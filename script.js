const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let isInitialLoad = true;
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];


//Unsplash API
let photoCount = 5;
const apiKey = 'BwH-XwYWSifXtFUOLMDHGalFaLgqxQb9q-nPcGAaD3g';
let UnsplashAPIUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${photoCount}`;

// Check if all images were loaded
function imageLoaded() {
    imagesLoaded++;
    if(imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;        
    }
}

//Helper function to set photo count
function updateAPIPhotoCount(count) {
    photoCount = count;
    UnsplashAPIUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${photoCount}`;
}

// Helper functions to set attributes
function setAttributes(element, attributes) {
    for(key in attributes){
        element.setAttribute(key, attributes[key]);
    }
}

//Create Elements and links and photos, Add to DOM
function displayPhotosFromUnsplash() {
    imagesLoaded = 0;
    totalImages = photosArray.length;

    //Run function for each element in the array
    photosArray.forEach((photo) => {
        // Create an <a> to link to unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });
        
        // Create <img> for photo 
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });

        //Event Listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);

        //Put <img> inside <a> & then put both inside our imageContainer Element
        item.appendChild(img);
        imageContainer.appendChild(item);
    })
}

// Get Photos from unsplash API
async function getPhotosFromUnsplash() {
     try {
         const response = await fetch(UnsplashAPIUrl);
         photosArray = await response.json();
         displayPhotosFromUnsplash();
         if (isInitialLoad){
            updateAPIPhotoCount(30);
            isInitialLoad = false;
         }
     } catch (error) {
         //Catch Error
     }
};

// Check to see if scrolling near the bottom of page, Load more photos
window.addEventListener('scroll', () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotosFromUnsplash();
    }
});


//On Load
getPhotosFromUnsplash();