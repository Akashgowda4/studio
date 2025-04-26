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

// Initialize the gallery
function initializeGallery() {
    try {
        console.log('Initializing gallery...');
        
        // Create media items with webContentLink URLs
        const photos = config.photoIds.map(id => ({
            type: 'image',
            url: `https://drive.google.com/thumbnail?id=${id}`,
            viewUrl: `https://drive.google.com/file/d/${id}/view?usp=sharing`,
            id: id
        }));
        
        const videos = config.videoIds.map(id => ({
            type: 'video',
            thumbnailUrl: `https://drive.google.com/thumbnail?id=${id}`,
            viewUrl: `https://drive.google.com/file/d/${id}/view?usp=sharing`,
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
        // For images, use a direct img element with error handling
        mediaElement = document.createElement('img');
        mediaElement.src = currentItem.url;
        mediaElement.alt = 'Gallery Image';
        mediaElement.style.width = '100%';
        mediaElement.style.height = '100%';
        mediaElement.style.objectFit = 'contain';
        
        // Add click handler to view full image
        mediaElement.style.cursor = 'pointer';
        mediaElement.onclick = () => window.open(currentItem.viewUrl, '_blank');
        
        // Add error handling
        mediaElement.onerror = function() {
            console.error('Error loading image:', currentItem.url);
            showError('Error loading image. Please check the file sharing settings.');
        };
    } else {
        // For videos, create a clickable thumbnail
        mediaElement = document.createElement('div');
        mediaElement.className = 'video-container';
        mediaElement.innerHTML = `
            <div class="video-thumbnail">
                <img src="${currentItem.thumbnailUrl}" alt="Video Thumbnail">
                <div class="play-overlay">
                    <span class="play-icon">▶</span>
                    <p>Click to view video</p>
                </div>
            </div>
        `;
        
        // Add click handler to open video in new tab
        mediaElement.onclick = () => window.open(currentItem.viewUrl, '_blank');
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