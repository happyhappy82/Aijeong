<?php
/**
 * Shared homepage/service styling, while keeping the existing theme assets.
 */
function aijeong_geo_home_assets() {
    $is_service = (bool) aijeong_current_service();
    $theme_uri = get_template_directory_uri();
    $version = wp_get_theme()->get('Version');
    $responsive_dependencies = array('aijeong-main');
    if (is_front_page() || $is_service) {
        wp_enqueue_style('aijeong-geo-home', $theme_uri . '/assets/css/geo-home.css', array('aijeong-main'), $version);
        $responsive_dependencies = array('aijeong-geo-home');
    }
    if ($is_service) {
        wp_enqueue_style('aijeong-services', $theme_uri . '/assets/css/service-pages.css', array('aijeong-geo-home'), $version);
        $responsive_dependencies = array('aijeong-services');
    }
    wp_enqueue_style('aijeong-responsive', $theme_uri . '/assets/css/responsive.css', $responsive_dependencies, $version);
    if (is_front_page()) {
        wp_enqueue_script('aijeong-geo-home', $theme_uri . '/assets/js/geo-home.js', array(), $version, true);
    }
}
add_action('wp_enqueue_scripts', 'aijeong_geo_home_assets', 30);
