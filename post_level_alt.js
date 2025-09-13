function createModal(id) {
	console.log('inside createModal we are looking for '+id);
    // Create the modal container
    var modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
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

    // Append the content container to the modal
    modal.appendChild(modalContent);

    // Append the modal to the body
	console.log('modalHolder is looking for '+id);
	var modalHolder = document.getElementById(id);
	modalHolder.appendChild(modal);

    // Close the modal when clicking outside the content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modalHolder.removeChild(modal);
        }
    });

    // Generate and set the modal content
    genModalInner();

	document.getElementById("acceptAltText").addEventListener('click', function(event) {
		console.log('we are trying to run the alt text function');
		setAltText(document.getElementById('llava').value);
        modalHolder.removeChild(modal);
	});
}

async function fetchAltText(url) {
	console.log("hitting "+url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseText = await response.text();
        // alert(responseText);
        return responseText;
    } catch (error) {
        console.error("Error fetching the alt-text:", error);
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
        console.log("No image container found.");
        return { error: "No image container found. Did you select an image?" };
    }

    const img = div.querySelector('img');
    if (!img) {
        console.log("No image found inside the container.");
        return { error: "No image found inside the container." };
    }

    const imgSrc = img.src;
    const parentId = div.parentNode.id;

    console.log(imgSrc);
    console.log(parentId);

    // Return an object (not an array) for clarity
    return {
        imgSrc: imgSrc,
        parentId: parentId
    };
}

function featuredImageUrl() {
	console.log('running featuredImageUrl');
	let imgSrc = document.getElementById("attachment-details-copy-link").value;
	console.log('returning '+imgSrc);
	return imgSrc;
}

function isMediaLibraryOpen() {
    return !!document.querySelector('.media-modal');
}

async function fetchAltTexts() {
	/* Base function. Fetch alt text from all edge providers */
	console.log('at the top of the function');

	let origImage;
	let parent;

	let llava         = 'https://alt-text-worker-llava.cprapps.workers.dev/?image_url=';
	let imagePrepend  = "https://www.cpr.org/cdn-cgi/image/width=1080,quality=75,format=auto/";

	/* find out if we are on the post page or on the media library page */
	if(isMediaLibraryOpen()) {
		console.log('library is open');
		// we are in the media library
		origImage = featuredImageUrl();
		console.log('we have origImage of '+origImage );
		parent = 'media-frame-title'; // that's the element id our modal will attach to
		createModal(parent);
		console.log("hey lou parent is "+parent+" and origImage is "+origImage);
	} else {
		console.log('library is closed');
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
	console.log("Final origImage:", origImage);
	let imageUrl      = imagePrepend+origImage;
	console.log("sending "+imageUrl);
	let llavaText     = await fetchAltText(llava+imageUrl);
	document.getElementById('llava').value=llavaText;
	document.getElementById('lvmLoadingMessage').innerHTML="Here's what the machine came up with!";
}

function genModalInner() {
	var modalInner = '<h3 id="lvmLoadingMessage">Getting LVM results ... </h3>\
	\
	<table>\
		<tr>\
			<td>LLava</td>\
		</tr>\
		<tr>\
			<td>\
				<textarea style="width:200px; height: 200px" id="llava" class="llmBox"></textarea>\
			</td>\
			<td>\
				<button style="color: #ffffff; background-color: #333333; margin: 8px; padding: 8px;" id="acceptAltText">I like it!</button>\
			</td>\
		</tr>\
	</table>\
	';
	console.log("in the function"+modalInner);
    document.getElementById('modalContent').innerHTML = modalInner;
}
fetchAltTexts();
