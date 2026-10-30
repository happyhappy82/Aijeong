<?php
/**
 * Shared homepage/service styling, while keeping the existing theme assets.
 */
function aijeong_geo_home_assets() {
    $is_service = (bool) aijeong_current_service();
    if (!is_front_page() && !$is_service) {
        return;
    }

    $theme_uri = get_template_directory_uri();
    $version = wp_get_theme()->get('Version');
    wp_enqueue_style('aijeong-geo-home', $theme_uri . '/assets/css/geo-home.css', array('aijeong-main'), $version);
    if ($is_service) {
        wp_enqueue_style('aijeong-services', $theme_uri . '/assets/css/service-pages.css', array('aijeong-geo-home'), $version);
    }
    if (is_front_page()) {
        wp_enqueue_script('aijeong-geo-home', $theme_uri . '/assets/js/geo-home.js', array(), $version, true);
    }
}
add_action('wp_enqueue_scripts', 'aijeong_geo_home_assets', 30);
