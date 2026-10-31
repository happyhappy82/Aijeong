<?php
/** Service pages shipped with the classic theme, without replacing editor content. */
function aijeong_service_pages() {
    return array(
        'geo' => array(
            'name' => '브랜드 AI검색 노출',
            'title' => '브랜드 AI검색 노출 · GEO·AEO',
            'description' => '브랜드 AI검색 노출을 위해 SEO 기반을 점검하고 고객 질문에 맞춰 브랜드 정보와 콘텐츠를 정비합니다 GEO·AEO 작업 범위와 진행 과정을 확인하세요',
        ),
        'website-renewal' => array(
            'name' => '웹사이트 리뉴얼',
            'title' => '웹사이트 리뉴얼',
            'description' => '브랜드의 강점과 서비스가 제대로 전해지도록 웹사이트를 개선합니다 콘텐츠 기획부터 디자인·개발, 모바일 문의 동선까지 함께 정리합니다',
        ),
        'ai-education' => array(
            'name' => 'AI교육',
            'title' => '기업·기관 AI교육',
            'description' => '기업과 기관의 실제 업무로 배우는 실습형 AI교육입니다 참여자의 직무와 수준에 맞춰 문서 작성, 자료조사, 결과 검토 과정을 구성합니다',
        ),
    );
}

function aijeong_current_service() {
    foreach (aijeong_service_pages() as $slug => $service) {
        if (is_page($slug)) {
            $service['slug'] = $slug;
            return $service;
        }
    }
    return null;
}

function aijeong_service_inquiry_url($slug) {
    return add_query_arg('service', $slug, home_url('/')) . '#contact';
}

/** Theme ZIP updates do not fire after_switch_theme, so also run once in admin. */
function aijeong_create_service_pages() {
    if (!current_user_can('manage_options') || get_option('aijeong_service_pages_version') === '1') {
        return;
    }
    $complete = true;
    foreach (aijeong_service_pages() as $slug => $service) {
        // Keep existing pages, including drafts and their editor content, untouched.
        if (get_page_by_path($slug, OBJECT, 'page')) {
            continue;
        }
        $result = wp_insert_post(array(
            'post_type' => 'page',
            'post_status' => 'publish',
            'post_name' => $slug,
            'post_title' => $service['name'],
            'post_content' => '',
        ), true);
        if (is_wp_error($result) || !$result) {
            $complete = false;
        }
    }
    if ($complete) {
        update_option('aijeong_service_pages_version', '1', false);
    }
}
add_action('after_switch_theme', 'aijeong_create_service_pages');
add_action('admin_init', 'aijeong_create_service_pages');

function aijeong_service_title($parts) {
    $service = aijeong_current_service();
    if ($service) {
        $parts['title'] = $service['title'] . ' – 에이정';
    }
    return $parts;
}
add_filter('document_title_parts', 'aijeong_service_title', 20);

function aijeong_service_canonical() {
    if (aijeong_current_service()) {
        // The theme SEO renderer already emits the service canonical link.
        remove_action('wp_head', 'rel_canonical');
    }
}
add_action('wp', 'aijeong_service_canonical');

function aijeong_service_structured_data() {
    $service = aijeong_current_service();
    if (!$service) {
        return;
    }
    $schema = array(
        '@context' => 'https://schema.org',
        '@type' => 'Service',
        'name' => $service['title'],
        'description' => $service['description'],
        'url' => get_permalink(),
        'provider' => array('@type' => 'Organization', 'name' => '에이정 주식회사', 'url' => home_url('/')),
    );
    echo '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\n";
}
add_action('wp_head', 'aijeong_service_structured_data', 5);
