<?php
/**
 * Assets for the GEO front page only.
 * Existing post, education and contact page assets remain unchanged.
 */
function aijeong_geo_home_assets() {
    if (!is_front_page()) {
        return;
    }

    wp_dequeue_style('aijeong-main');
    wp_dequeue_script('aijeong-theme-toggle');
    wp_dequeue_script('aijeong-mobile-menu');
    wp_dequeue_script('aijeong-scroll-effects');

    $theme_uri = get_template_directory_uri();
    $version = wp_get_theme()->get('Version');
    wp_enqueue_style('aijeong-geo-home', $theme_uri . '/assets/css/geo-home.css', array(), $version);
    wp_enqueue_script('aijeong-geo-home', $theme_uri . '/assets/js/geo-home.js', array(), $version, true);
}
add_action('wp_enqueue_scripts', 'aijeong_geo_home_assets', 30);
