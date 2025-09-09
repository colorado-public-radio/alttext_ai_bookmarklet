function createModal(id) {
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
    modal.style.left = '350px';

    // Append the content container to the modal
    modal.appendChild(modalContent);

    // Append the modal to the body
	console.log('id is '+id);
	var modalHolder = document.getElementById(id);
	modalHolder.appendChild(modal);
    // document.getElementsByClassName("settings")[0].appendChild(modal);

	// keeping this here to test if we are hitting it at the right time in load
	// document.getElementById("acceptAltText").classList.add("components-button", "editor-post-publish-button", "editor-post-publish-button__button", "is-primary", "is-compact");


    // Close the modal when clicking outside the content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modalHolder.removeChild(modal);
        }
    });

    // Generate and set the modal content
    genModalContent();

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
    const labels = document.querySelectorAll('label.components-base-control__label');
    for (const label of labels) {
        if (label.textContent.trim() === "Alternative text") {
            const container = label.closest('.components-base-control__field');
            if (container) {
                const textarea = container.querySelector('textarea');
                if (textarea) {
                    textarea.value = altText;
                    return true; // Success
                }
            }
        }
    }
    return false; // Not found
}

async function selectedImageMeta() {
	/* Find the image src and the container it's in */
	const div = document.querySelector('.components-resizable-box__container.has-show-handle');
	const imgSrc = div.querySelector('img').src;
	const parentId = div.parentNode.id;
	console.log(imgSrc);
	console.log(parentId);
	let ret = new Array();
	ret['imgSrc'] = imgSrc;
	ret['parentId'] = parentId;
	// console.log(ret);
	console.log(ret['imgSrc']);
	console.log(ret['parentId']);
	console.log('^^ before returning');
	return ret;
}

async function fetchAltTexts() {
	/* Base function. Fetch alt text from all edge providers */
	let llava         = 'https://alt-text-worker-llava.cprapps.workers.dev/?image_url=';
	let origImageData = await selectedImageMeta();
	console.log(origImageData );
	console.log(origImageData['imgSrc']); 
	console.log(origImageData['parentId']); 
	console.log('origImageData ^^');
	let origImage = origImageData['imgSrc']; 
	let parent = origImageData['parentId']; 
	console.log("parent is "+parent+" and origImage is "+origImage);
	createModal(parent);
	if(origImage) {
		let imageUrl      = "https://www.cpr.org/cdn-cgi/image/width=1080,quality=75,format=auto/"+origImage;
		let llavaText     = await fetchAltText(llava+imageUrl);
		// let altAiText     = await altTextAI(imageUrl);
		// let alertContent = "LLava LVM:\n"+llavaText+"\n\nQwen LVM:\n"+qwenText;
		// alert(alertContent);
		document.getElementById('llava').value=llavaText;
		document.getElementById('lvmLoadingMessage').innerHTML="Here's what the machine came up with!";
	} else {
		document.getElementById('lvmLoadingMessage').innerHTML="Can't find an image. Did you select one?";
	}
}

function genModalContent() {
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
