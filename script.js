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
async function initializeGallery() {
    try {
        console.log('Initializing gallery...');
        // Load both photos and videos
        const photos = await loadMediaItems(config.photoIds, 'image');
        const videos = await loadMediaItems(config.videoIds, 'video');
        
        console.log('Loaded photos:', photos);
        console.log('Loaded videos:', videos);
        
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
async function loadMediaItems(fileIds, type) {
    const items = [];
    const baseUrls = [
        'https://drive.google.com/uc?export=view&id=',
        'https://drive.google.com/file/d/',
        'https://docs.google.com/uc?id='
    ];
    
    try {
        for (const fileId of fileIds) {
            for (const baseUrl of baseUrls) {
                const testUrl = `${baseUrl}${fileId}`;
                console.log(`Testing ${type} URL:`, testUrl);
                
                try {
                    // For images, we can use a simple fetch
                    if (type === 'image') {
                        const img = new Image();
                        await new Promise((resolve, reject) => {
                            img.onload = resolve;
                            img.onerror = reject;
                            img.src = testUrl;
                        });
                        console.log(`Found valid ${type} at:`, testUrl);
                        items.push({
                            type,
                            url: testUrl,
                            id: fileId
                        });
                        break; // If one URL works, no need to try others
                    } 
                    // For videos, we need to check differently
                    else {
                        const response = await fetch(testUrl, { method: 'HEAD' });
                        if (response.ok) {
                            console.log(`Found valid ${type} at:`, testUrl);
                            items.push({
                                type,
                                url: testUrl,
                                id: fileId
                            });
                            break; // If one URL works, no need to try others
                        }
                    }
                } catch (error) {
                    console.log(`URL failed:`, testUrl, error);
                }
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
    console.log('Displaying item:', currentItem);
    
    let mediaElement;
    
    if (currentItem.type === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = currentItem.url;
        mediaElement.alt = `Photo ${currentItem.id}`;
        mediaElement.onerror = () => {
            console.error('Failed to load image:', currentItem.url);
            handleMediaError(currentItem);
        };
    } else {
        mediaElement = document.createElement('video');
        mediaElement.src = currentItem.url;
        mediaElement.controls = true;
        mediaElement.autoplay = true;
        mediaElement.loop = true;
        mediaElement.onerror = () => {
            console.error('Failed to load video:', currentItem.url);
            handleMediaError(currentItem);
        };
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