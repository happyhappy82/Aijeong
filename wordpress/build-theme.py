#!/usr/bin/env python3
"""Build the existing classic WordPress theme with the GEO homepage overlay.

The base theme stays local because it contains existing runtime configuration.
Only the new overlay and its build instructions belong in source control.
"""
import argparse
import json
import re
import shutil
import subprocess
import zipfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
VERSION = '1.7.0'
DESCRIPTION = 'GEO, 브랜드가 AI에 보이도록'
TITLE = '에이정 | GEO, 브랜드가 AI에 보이도록'


def replace_once(text, old, new):
    if text.count(old) != 1:
        raise ValueError('Expected one known template marker; base theme needs review')
    return text.replace(old, new, 1)


def build(base, output):
    base = base.resolve()
    output.mkdir(parents=True, exist_ok=True)
    theme = output / 'aijeong-theme'
    if theme.resolve() == base:
        raise ValueError('Output must be separate from the base theme')
    required = ['style.css', 'index.php', 'front-page.php', 'header.php', 'footer.php',
                'functions.php', 'inc/customizer.php', 'inc/seo.php']
    if not all((base / name).is_file() for name in required):
        raise ValueError('Base theme is incomplete')
    if theme.exists():
        shutil.rmtree(theme)
    shutil.copytree(base, theme, ignore=shutil.ignore_patterns(
        'node_modules', 'aijeong-theme', '_preview', '.git', '.DS_Store',
        '*.zip', '.env', '.env.*', '*.log', '*.bak', '__pycache__'))

    source = (REPO / 'previews/search-renewal/index.html').read_text()
    header_html = source.split('<body>', 1)[1].split('  <main id="main">', 1)[0]
    main_html = '<main id="main">' + source.split('  <main id="main">', 1)[1].split('  </main>', 1)[0] + '</main>\n'
    footer_html = '<footer' + source.split('  <footer', 1)[1].split('</footer>', 1)[0] + '</footer>\n'

    def adapt_markup(html):
        html = html.replace('src="assets/logo-original.svg"',
                            'src="<?php echo esc_url($theme_uri); ?>/assets/images/logo/logo-original.svg"')
        html = html.replace('href="https://aijeong.com/ai-education/"',
                            'href="<?php echo esc_url(home_url(\'/ai-education/\')); ?>"')
        html = html.replace('href="#"', 'href="<?php echo esc_url(home_url(\'/\')); ?>"')
        return html

    # Retain the original head hooks, tracking setup and footer integrations.
    # Their values are read from the unchanged local base theme at package time.
    header_prefix = (base / 'header.php').read_text().split('    <!-- Header -->', 1)[0]
    header_prefix = re.sub(r'    <!-- Dark mode FOUC prevention.*?</script>\s*', '',
                           header_prefix, count=1, flags=re.S)
    header_prefix = replace_once(header_prefix, '<body class="font-sans antialiased">',
                                '<body <?php body_class(\'aijeong-geo-home\'); ?>>\n    <?php wp_body_open(); ?>')
    (theme / 'header-geo.php').write_text(header_prefix + adapt_markup(header_html))

    footer_tail = (base / 'footer.php').read_text().split('    <!-- Channel IO (bfcache compatible) -->', 1)[1]
    footer_setup = "<?php\n$site = aijeong_get_site_config();\n$tracking = aijeong_get_tracking_config();\n$theme_uri = get_template_directory_uri();\n?>\n"
    (theme / 'footer-geo.php').write_text(footer_setup + adapt_markup(footer_html) +
                                       '\n    <!-- Channel IO (bfcache compatible) -->' + footer_tail)
    (theme / 'front-page.php').write_text(
        "<?php\n/** GEO front page. */\nget_header('geo');\n$theme_uri = get_template_directory_uri();\n?>\n" +
        adapt_markup(main_html) + "<?php get_footer('geo'); ?>\n")

    shutil.copyfile(REPO / 'wordpress/geo-home.php', theme / 'inc/geo-home.php')
    functions = (theme / 'functions.php').read_text()
    marker = "require_once get_template_directory() . '/inc/seo.php';"
    functions = replace_once(functions, marker, marker + "\nrequire_once get_template_directory() . '/inc/geo-home.php';")
    (theme / 'functions.php').write_text(functions)

    config = (theme / 'inc/customizer.php').read_text()
    config = replace_once(config,
                          "'description'     => 'AI교육을 넘어, AX파트너로 — 교육·컨설팅·자동화를 함께합니다'",
                          "'description'     => '" + DESCRIPTION + "'")
    nav_start = config.index('function aijeong_get_nav_items() {')
    nav_end = config.index('// Customizer registration', nav_start)
    new_nav = """function aijeong_get_nav_items() {
    return array(
        array('label' => '서비스', 'href' => '/#services', 'children' => array(
            array('label' => 'GEO · AI 검색 최적화', 'href' => '/#geo'),
            array('label' => '웹사이트 리뉴얼', 'href' => '/#website-renewal'),
            array('label' => 'AI 교육', 'href' => '/ai-education/'),
        )),
        array('label' => '프로젝트', 'href' => '/#projects'),
        array('label' => '인사이트', 'href' => '/135-2/', 'children' => array(
            array('label' => '블로그', 'href' => '/135-2/'),
            array('label' => '칼럼', 'href' => '/column/'),
            array('label' => '교육사례', 'href' => '/교육사례-2/'),
            array('label' => 'AX사례', 'href' => '/ax사례/'),
        )),
        array('label' => '에이정 소개', 'href' => '/#about'),
        array('label' => '문의하기', 'href' => '/#contact'),
    );
}

"""
    config = config[:nav_start] + new_nav + config[nav_end:]
    (theme / 'inc/customizer.php').write_text(config)

    seo = (theme / 'inc/seo.php').read_text()
    seo = replace_once(seo, "'에이정, AX파트너 — AI 교육·컨설팅·자동화'", "'" + TITLE + "'")
    seo = replace_once(seo, "' – 에이정, AX파트너'", "' – 에이정'")
    (theme / 'inc/seo.php').write_text(seo)

    style = (theme / 'style.css').read_text()
    style = re.sub(r'^Version:.*$', 'Version: ' + VERSION, style, count=1, flags=re.M)
    style = re.sub(r'^Description:.*$', 'Description: 에이정 - ' + DESCRIPTION, style, count=1, flags=re.M)
    (theme / 'style.css').write_text(style)

    css = (REPO / 'previews/search-renewal/styles.css').read_text()
    css = css.replace("url('assets/PretendardVariable.woff2')", "url('../fonts/PretendardVariable.woff2')")
    (theme / 'assets/css/geo-home.css').write_text(css)
    shutil.copyfile(REPO / 'previews/search-renewal/app.js', theme / 'assets/js/geo-home.js')

    # Fail before packaging if any PHP template is syntactically invalid.
    php_files = sorted(theme.rglob('*.php'))
    for path in php_files:
        result = subprocess.run(['php', '-l', str(path)], capture_output=True, text=True)
        if result.returncode:
            raise RuntimeError('PHP syntax check failed for ' + str(path.relative_to(theme)))

    archive = output / ('aijeong-theme-v' + VERSION + '-geo-20261030.zip')
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as bundle:
        for path in sorted(theme.rglob('*')):
            if path.is_file():
                bundle.write(path, Path('aijeong-theme') / path.relative_to(theme))
    with zipfile.ZipFile(archive) as bundle:
        if bundle.testzip() is not None:
            raise RuntimeError('ZIP verification failed')
        assert 'aijeong-theme/style.css' in bundle.namelist()
        assert 'aijeong-theme/index.php' in bundle.namelist()
        assert not any('/node_modules/' in p or '/.git/' in p for p in bundle.namelist())

    changed = []
    for path in sorted(theme.rglob('*')):
        if path.is_file():
            original = base / path.relative_to(theme)
            if not original.is_file() or original.read_bytes() != path.read_bytes():
                changed.append(str(path.relative_to(theme)))
    report = {'version': VERSION, 'theme_directory': str(theme), 'archive': str(archive),
              'php_files_checked': len(php_files), 'changed_files': changed}
    (output / 'build-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-theme', type=Path, required=True)
    parser.add_argument('--output', type=Path, default=REPO / '_local/package')
    arguments = parser.parse_args()
    build(arguments.base_theme, arguments.output.resolve())
