const API_CONFIG = {
	LLAVA_ENDPOINT: 'https://alt-text-worker-llava.cprapps.workers.dev/?image_url=',
	IMAGE_CDN: 'https://www.cpr.org/cdn-cgi/image/width=1080,quality=75,format=auto/',
	THUMB_CDN: 'https://www.cpr.org/cdn-cgi/image/width=300,quality=75,format=auto/',
}; 

function createModal(id) {
	// Create the modal container
	var modal = document.createElement('div');
	modal.style.position = 'fixed';
	modal.style.top = '0';
	modal.style.left = '0';
	modal.style.width = '100%';
	modal.style.height = '100%';
	modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
	modal.style.display = 'flex';
	modal.style.justifyContent = 'center';
	modal.style.alignItems = 'center';
	modal.style.zIndex = '1000';
	modal.id = 'customModal';

	// Create the modal content container
	var modalContent = document.createElement('div');
	modalContent.id = 'modalContent';
	modalContent.style.backgroundColor = 'white';
	modalContent.style.padding = '20px';
	modalContent.style.borderRadius = '5px';
	modalContent.style.position = 'relative';
	modalContent.style.left = '350px';
	modalContent.style.width = '550px';


	// Append the content container to the modal
	modal.appendChild(modalContent);

	// Append the modal to the body
	var modalHolder = document.getElementById(id);
	if(!modalHolder) {
		alert("There was an error and the system can't show the results. Try reloading and giving it another shot");
	}
	modalHolder.appendChild(modal);

	// Close the modal when clicking outside the content
	modal.addEventListener('click', function(event) {
		if (event.target === modal) {
			modalHolder.removeChild(modal);
			return false;
		}
	});

	// Generate and set the modal content
	genModalInner();

	document.getElementById("acceptAltText").addEventListener('click', function(event) {
		setAltText(document.getElementById('llava').value);
		modalHolder.removeChild(modal);
	});
}

async function fetchAltText(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.text();
	} catch (error) {
		console.error("Error fetching the alt-text:", error);
		return null;
	}
}

function setAltText(altText) {
	if(isMediaLibraryOpen()) {
		document.getElementById('attachment-details-alt-text').value = altText;
	} else {
		const selectedBlock = wp.data.select('core/block-editor').getSelectedBlock();
		 wp.data.dispatch('core/block-editor').updateBlockAttributes(selectedBlock.clientId, {
			alt: altText
		});
	}
}


function selectedImageMeta() {
	/* Find the image src and the container it's in */
	const div = document.querySelector('.components-resizable-box__container.has-show-handle');

	// Check if the div exists
	if (!div) {
		return { error: "No image container found. Did you select an image?" };
	}

	const img = div.querySelector('img');
	if (!img) {
		return { error: "No image found inside the container." };
	}

	const imgSrc = img.src;
	const parentId = div.parentNode.id;


	// Return an object (not an array) for clarity
	return {
		imgSrc: imgSrc,
		parentId: parentId
	};
}

function featuredImageUrl() {
	// Try the first ID
	const firstField = document.getElementById("attachment-details-copy-link");
	if (firstField) return firstField.value;

	// Fall back to the second ID
	const secondField = document.getElementById("attachment-details-two-column-copy-link");
	if (secondField) return secondField.value;

	// Neither field exists
	console.error("No image URL field found!");
	return null; // or throw an error
}

function isMediaLibraryOpen() {
	return !!document.body.classList.contains("modal-open");
}

async function fetchAltTexts() {
	console.log("running fetchAltTexts");
	/* Base function. Fetch alt text from all edge providers */

	let origImage;
	let parent;

	/* find out if we are on the post page or on the media library page */
	if(isMediaLibraryOpen()) {
		console.log("lib is open");
		// we are in the media library
		origImage = featuredImageUrl();
		parent = 'media-frame-title'; // that's the element id our modal will attach to
		createModal(parent);
	} else {
		console.log("lib is closed");
		let origImageData = selectedImageMeta();
		if(origImageData.error) {
			console.error(origImageData.error);
			alert("I (insofar as I have a sense of self) can't find an image. Did you select one on the page?");
		} else {
			origImage = origImageData.imgSrc; 
			parent = origImageData.parentId; 
			createModal(parent);
		}
	}
	let imageUrl	  = API_CONFIG.IMAGE_CDN+origImage;
	let thumbUrl	  = API_CONFIG.THUMB_CDN+origImage;
		console.log("set some stuff now let's fetch for "+API_CONFIG.LLAVA_ENDPOINT+imageUrl);
	let llavaText	 = await fetchAltText(API_CONFIG.LLAVA_ENDPOINT+imageUrl);
	if (!llavaText) {
		document.getElementById('llava').value = "Failed to generate alt text.";
		return;
	}
	document.getElementById('llava').value=llavaText.trim();
	document.getElementById('lvmLoadingMessage').innerHTML="Here's what the machine came up with! ";
	document.getElementById('altThumb').src=thumbUrl;
}

function genModalInner() {
	var modalInner = `<h3 id="lvmLoadingMessage">Getting LVM results ... </h3>
	
	<table>
		<tr>
			<td>
				<textarea style="width:200px; height: 345px" id="llava" class="llmBox"></textarea>
			</td>
			<td>
				<h3 style="margin-top: 0;">Trust, but verify</h3><p>This text was generated by an algorithm that has no human sense of race, gender, disability status, or names. It also makes things up. Please read the resulting text and make sure it is something that is true and that respects the subject.</p><img src = "https://alt-text-bookmarklet.cprapps.workers.dev/waiting.svg" style="height: 200px" id="altThumb"/>
			</td>
		</tr>
		<tr>
			<td>
				<button class="components-button editor-post-publish-button editor-post-publish-button__button is-primary is-compact" id="acceptAltText">Add alt text</button>
			</td>
			<td>&nbsp;</td>
		</tr>
	</table>
	`;
	document.getElementById('modalContent').innerHTML = modalInner;
}
