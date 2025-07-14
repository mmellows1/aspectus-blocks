<?php
/**
 * Plugin Name:       Aspectus Blocks
 * Description:       Display your site&#39;s copyright date.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.3.5
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       aspectus-blocks
 *
 * @package           create-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_aspectus_blocks_init() {
	// var_dump(__DIR__);
	// wp_die();
	// Register a block metadata collection and its manifest
	wp_register_block_metadata_collection(
		__DIR__ . '/build/blocks',
		__DIR__ . '/build/blocks-manifest.php' // Path to your manifest file
	);
	
	// Register all block types from the collection
	wp_register_block_types_from_metadata_collection(
		__DIR__ . '/build/blocks' // Path to your block directory (if already registered)
	);
}

add_action( 'init', 'create_block_aspectus_blocks_init' );


function aspectus_blocks_block_editor_styles() {
    wp_enqueue_style(
        'aspectus_blocks-editor-styles',
        plugins_url('build/helpers.css', __FILE__),
        array(),
        wp_get_theme()->get('Version')
    );
}
add_action('enqueue_block_editor_assets', 'aspectus_blocks_block_editor_styles');
