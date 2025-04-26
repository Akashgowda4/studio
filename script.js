// Configuration
const config = {
    // Add your photo file IDs here (just the ID part from the Google Drive share link)
    photoIds: [
        '1Qa5FeueDj9dULfL6d_xryLYPpsEDbgoR', // Replace with your actual photo file IDs
        // Add more photo IDs as needed
    ],
    // Add your video file IDs here
    videoIds: [
        '1QbwQj25Xn58iND952gwinBDRihU5peej', // Replace with your actual video file IDs
        // Add more video IDs as needed
    ],
    slideInterval: 5000, // Time between slides in milliseconds
};

// Gallery state
let currentIndex = 0;
let mediaItems = [];

// DOM Elements
const gallerySlider = document.querySelector('.gallery-slider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Test URL accessibility
async function testUrl(url, type) {
    try {
        console.log(`Testing ${type} URL:`, url);
        const response = await fetch(url, { 
            method: 'HEAD',
            mode: 'no-cors' // Try with no-cors mode
        });
        console.log(`${type} URL status:`, response.status);
        return true;
    } catch (error) {
        console.error(`Error testing ${type} URL:`, error);
        return false;
    }
}

// Initialize the gallery
async function initializeGallery() {
    try {
        console.log('Initializing gallery...');
        
        // Test photo URLs
        for (const id of config.photoIds) {
            const photoUrl = `https://drive.google.com/uc?export=view&id=${id}`;
            const isAccessible = await testUrl(photoUrl, 'photo');
            console.log(`Photo ${id} accessible:`, isAccessible);
        }
        
        // Test video URLs
        for (const id of config.videoIds) {
            const videoUrl = `https://drive.google.com/file/d/${id}/preview`;
            const isAccessible = await testUrl(videoUrl, 'video');
            console.log(`Video ${id} accessible:`, isAccessible);
        }
        
        // Create media items with embed URLs
        const photos = config.photoIds.map(id => ({
            type: 'image',
            url: `https://drive.google.com/uc?export=view&id=${id}`,
            embedUrl: `https://drive.google.com/file/d/${id}/preview`,
            id: id
        }));
        
        const videos = config.videoIds.map(id => ({
            type: 'video',
            url: `https://drive.google.com/file/d/${id}/preview`,
            id: id
        }));
        
        console.log('Created photos:', photos);
        console.log('Created videos:', videos);
        
        // Combine and shuffle the media items
        mediaItems = [...photos, ...videos].sort(() => Math.random() - 0.5);
        
        if (mediaItems.length === 0) {
            showError('No media items configured. Please add file IDs to the configuration.');
            return;
        }
        
        // Display the first item
        displayCurrentItem();
        
        // Start the slideshow
        startSlideshow();
    } catch (error) {
        console.error('Error initializing gallery:', error);
        showError('Error setting up gallery. Please check the configuration.');
    }
}

// Display current media item
function displayCurrentItem() {
    if (mediaItems.length === 0) return;
    
    const currentItem = mediaItems[currentIndex];
    console.log('Displaying item:', currentItem);
    
    let mediaElement;
    
    if (currentItem.type === 'image') {
        // For images, use an iframe with the preview URL
        mediaElement = document.createElement('iframe');
        mediaElement.src = currentItem.embedUrl;
        mediaElement.frameBorder = '0';
        mediaElement.allowFullscreen = true;
        mediaElement.style.width = '100%';
        mediaElement.style.height = '100%';
        mediaElement.style.border = 'none';
        mediaElement.style.background = '#000';
    } else {
        // For videos, use an iframe with the preview URL
        mediaElement = document.createElement('iframe');
        mediaElement.src = currentItem.url;
        mediaElement.frameBorder = '0';
        mediaElement.allowFullscreen = true;
        mediaElement.style.width = '100%';
        mediaElement.style.height = '100%';
        mediaElement.style.border = 'none';
        mediaElement.style.background = '#000';
    }
    
    gallerySlider.innerHTML = '';
    gallerySlider.appendChild(mediaElement);
}

// Show error message
function showError(message) {
    console.error(message);
    gallerySlider.innerHTML = `<div class="error-message">${message}</div>`;
}

// Navigation functions
function nextSlide() {
    currentIndex = (currentIndex + 1) % mediaItems.length;
    displayCurrentItem();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    displayCurrentItem();
}

// Start automatic slideshow
function startSlideshow() {
    setInterval(nextSlide, config.slideInterval);
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

// Initialize the gallery when the page loads
window.addEventListener('load', initializeGallery); 