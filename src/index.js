/**
 * WordPress dependencies.
 */
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { render, useState } from "@wordpress/element";
import { subscribe } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import AddNewPostButton from "./add-button";
import QuickPostKebabMenu from "./kebab-menu";

/**
 * Internal dependencies.
 */
import { getPostInfo, getPostLabels } from "./utils";

/**
 * Create the Quick Post button
 *
 * @since 0.1.0
 * @return {string} Return the rendered Quick Post Button
 */
function QuickPostButton() {
	const { postType } = useSelect((select) => {
		return {
			postType: select("core/editor").getCurrentPostType(),
		};
	});
	const { newPost } = useSelect((select) => {
		const newPost = select("core/editor").isCleanNewPost();

		return {
			newPost: newPost,
		};
	});
	if (!postType) {
		return null;
	}
	const { singleLabel, addNewLabel } = useSelect((select) => {
		const { getPostTypes } = select(coreStore);
		const includedPostType = [postType];
		const filteredPostTypes = getPostTypes({ per_page: -1 })?.filter(
			({ viewable, slug }) => viewable && includedPostType.includes(slug)
		);
		if (undefined !== filteredPostTypes) {
			return {
				addNewLabel: filteredPostTypes[0].labels.add_new,
				singleLabel: filteredPostTypes[0].labels.singular_name,
			};
		}

		return {
			addNewLabel: undefined,
			singleLabel: undefined,
		};
	});
	console.log(newPost);
	if (undefined !== addNewLabel) {
		return (
			<>
				<AddNewPostButton
					postType={postType}
					newPost={newPost}
					addNewLabel={addNewLabel}
					singleLabel={singleLabel}
				/>
				<QuickPostKebabMenu
					postType={postType}
					newPost={newPost}
					addNewLabel={addNewLabel}
					singleLabel={singleLabel}
				/>
			</>
		);
	}
	return null;
}

/**
 * Let's subscribe (because I finally understand what this does better)
 * and add the component to the toolbar!
 */
subscribe(() => {
	const quickpostbutton = document.querySelector(
		"#createwithrani-add-new-button-wrapper"
	);

	// If the Quick Post Button already exists, skip render
	// (which we can do because we are finally in a functional call!)
	if (quickpostbutton) {
		return;
	}

	domReady(() => {
		const editorToolbar = document.querySelector(
			".edit-post-header-toolbar__left"
		);

		// If toolbar doesn't exist, we can't continue
		if (!editorToolbar) {
			return;
		}

		// So turns out you can't append to an existing container without
		// using dangerouslySetInnerHTML, which..I don't want to use.
		const buttonWrapper = document.createElement("div");
		buttonWrapper.id = "createwithrani-add-new-button-wrapper";
		buttonWrapper.style.cssText = "display:flex;";
		// Now we add the empty div to the existing toolbar element
		// so we can fill it.
		editorToolbar.appendChild(buttonWrapper);

		render(
			<QuickPostButton />,
			document.getElementById("createwithrani-add-new-button-wrapper")
		);
	});
});
