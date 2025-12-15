# WordPress Alt-Text Bookmarklet

This bookmarklet helps WordPress users generate and add alt-text to images within the WordPress dashboard without having to think about it. It uses Cloudflare's edge AI tools to suggest alt-text for images in stories or the media library. It's an MVP for a full plugin but if you have a Cloudflare account it does okay on its own.


## Requirements
* A WordPress media library with images in it
* A Cloudflare account that includes their CDN and AI edge models
* A Cloudflare [vision language model](https://github.com/colorado-public-radio/alt-text-worker/tree/model-llava) to process the image and return text

## How It Works

#### From within the image library

* Log into the dashboard and select Media → Library
* Click the image that needs alt text
* Click your bookmarklet
* Edit the resulting alt-text if needed, then click "Add alt text"

#### Featured image

* Log into the dashboard and select a post to edit
* Click the featured image in the right rail
* Once the featured image loads from the library, click the bookmarklet. It will generate some alt-text and show it to you in a pop-up
* Edit the resulting alt-text if needed, then click "Add alt text"
* Click "Set featured image"
* Save your post and you're done!

#### Post images

* Log into the dashboard and select a post to edit
* Click on a post image
* Click the bookmarklet. It will generate some alt-text and show it to you in a pop-up
* Edit the resulting alt-text if needed, then click "Add alt text"
* Repeat on any other images on the page
* Save your post and you're done!

## Features
- Works in the WordPress post editor and media library.
- Generates alt-text using edge AI models (LLaVA), so it's free!
- Tracks usage events (e.g., launches, edits, abandonments) via Zaraz.

## Limitations
- Requires an active internet connection to fetch AI-generated alt-text.
- AI-generated text requires human review for accuracy and appropriateness.
- Only works in the WordPress dashboard.


 1 What is the name of this bookmarklet/project?                                                                                                                                                                                             
 2 Who is the primary audience (e.g., journalists, content editors, developers)?                                                                                                                                                             
 3 Are there any specific WordPress versions or plugins this is designed to work with?                                                                                                                                                       
 4 Should I mention any privacy or data handling considerations (e.g., where the image URLs are sent)?                                                                                                                                       
 5 Are there any known limitations or edge cases (e.g., file types, image sizes)?                                                                                                                                                            
 6 Should I include instructions for installing or using the bookmarklet?  
