<?php
/**
 * Plugin Name:     Add New Post
 * Plugin URI:      https://createwithrani.com
 * Description:     Adds an "Add New" button to the Block Editor toolbar, so you can easily create new posts/pages/custom post types.
 * Author:          Aurooba Ahmed
 * Author URI:      https://createwithrani.com
 * Text Domain:     createwithrani-add-new-post
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         createwithrani-add-new-post
 */

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 */
function createwithrani_add_new_post_script() {

	$dir = dirname( __FILE__ );
	$index_js = 'build/index.js';

	// automatically load dependencies and version
	$asset_file = include $dir . '/build/index.asset.php';
	wp_enqueue_script(
		'createwithrani-add-new-post-js',
		plugins_url( $index_js, __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
	);
	wp_set_script_translations( 'createwithrani-add-new-post-js' );

}

add_action( 'enqueue_block_editor_assets', 'createwithrani_add_new_post_script' );
