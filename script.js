// Configuration
const config = {
    photosFolderId: '1Qa5FeueDj9dULfL6d_xryLYPpsEDbgoR', // Photos folder ID
    videosFolderId: '1QbwQj25Xn58iND952gwinBDRihU5peej', // Videos folder ID
    slideInterval: 5000, // Time between slides in milliseconds
    totalItems: 100 // Total number of items to display
};

// Gallery state
let currentIndex = 0;
let mediaItems = [];

// DOM Elements
const gallerySlider = document.querySelector('.gallery-slider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Initialize the gallery
async function initializeGallery() {
    try {
        // Load both photos and videos
        const photos = await loadMediaItems(config.photosFolderId, 'image');
        const videos = await loadMediaItems(config.videosFolderId, 'video');
        
        // Combine and shuffle the media items
        mediaItems = [...photos, ...videos].sort(() => Math.random() - 0.5);
        
        if (mediaItems.length === 0) {
            showError('No media items found. Please check your Google Drive configuration.');
            return;
        }
        
        // Display the first item
        displayCurrentItem();
        
        // Start the slideshow
        startSlideshow();
    } catch (error) {
        console.error('Error initializing gallery:', error);
        showError('Error loading gallery. Please check your Google Drive configuration.');
    }
}

// Load media items from Google Drive
async function loadMediaItems(folderId, type) {
    const items = [];
    const baseUrl = 'https://drive.google.com/uc?export=view&id=';
    
    try {
        for (let i = 1; i <= config.totalItems; i++) {
            const itemId = `${folderId}/${i}`;
            const testUrl = type === 'image' 
                ? `${baseUrl}${itemId}`
                : `${baseUrl}${itemId}`;
            
            // Test if the file exists
            const response = await fetch(testUrl, { method: 'HEAD' });
            if (response.ok) {
                const item = {
                    type,
                    url: testUrl,
                    id: i
                };
                items.push(item);
            }
        }
    } catch (error) {
        console.error(`Error loading ${type}s:`, error);
    }
    
    return items;
}

// Display current media item
function displayCurrentItem() {
    if (mediaItems.length === 0) return;
    
    const currentItem = mediaItems[currentIndex];
    let mediaElement;
    
    if (currentItem.type === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = currentItem.url;
        mediaElement.alt = `Photo ${currentItem.id}`;
        mediaElement.onerror = () => handleMediaError(currentItem);
    } else {
        mediaElement = document.createElement('video');
        mediaElement.src = currentItem.url;
        mediaElement.controls = true;
        mediaElement.autoplay = true;
        mediaElement.loop = true;
        mediaElement.onerror = () => handleMediaError(currentItem);
    }
    
    gallerySlider.innerHTML = '';
    gallerySlider.appendChild(mediaElement);
}

// Handle media loading errors
function handleMediaError(item) {
    console.error(`Failed to load ${item.type} ${item.id}`);
    // Try to load the next item
    nextSlide();
}

// Show error message
function showError(message) {
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