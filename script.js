// Configuration
const config = {
    photosFolderId: 'https://drive.google.com/drive/folders/1Qa5FeueDj9dULfL6d_xryLYPpsEDbgoR', // Replace with your Google Drive photos folder ID
    videosFolderId: 'https://drive.google.com/drive/folders/1QbwQj25Xn58iND952gwinBDRihU5peej', // Replace with your Google Drive videos folder ID
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
        
        // Display the first item
        displayCurrentItem();
        
        // Start the slideshow
        startSlideshow();
    } catch (error) {
        console.error('Error initializing gallery:', error);
    }
}

// Load media items from Google Drive
async function loadMediaItems(folderId, type) {
    const items = [];
    const baseUrl = 'https://drive.google.com/uc?export=view&id=';
    
    for (let i = 1; i <= config.totalItems; i++) {
        const itemId = `${folderId}/${i}`;
        const item = {
            type,
            url: type === 'image' ? `${baseUrl}${itemId}` : `${baseUrl}${itemId}`,
            id: i
        };
        items.push(item);
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
    } else {
        mediaElement = document.createElement('video');
        mediaElement.src = currentItem.url;
        mediaElement.controls = true;
        mediaElement.autoplay = true;
        mediaElement.loop = true;
    }
    
    gallerySlider.innerHTML = '';
    gallerySlider.appendChild(mediaElement);
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
    // Here you would typically send the form data to a server
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

// Initialize the gallery when the page loads
window.addEventListener('load', initializeGallery); 