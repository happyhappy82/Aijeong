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
VERSION = '1.7.1'
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

    # Reuse the original header, footer, compiled CSS and common behavior.
    # The GEO front page is now a native PHP template, not the early HTML sketch.
    shutil.copyfile(REPO / 'wordpress/front-page.php', theme / 'front-page.php')

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

    shutil.copyfile(REPO / 'wordpress/geo-home.css', theme / 'assets/css/geo-home.css')
    shutil.copyfile(REPO / 'wordpress/geo-home.js', theme / 'assets/js/geo-home.js')

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
