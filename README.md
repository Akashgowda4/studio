# SiddartPhotography Website

A professional photography studio website built with HTML, CSS, and JavaScript, hosted on GitHub Pages.

## Features

- Modern, responsive design
- Dynamic gallery with automatic slideshow
- Google Drive integration for media storage
- Contact form
- Mobile-friendly layout

## Setup Instructions

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/siddartphotography.git
   ```

2. Configure Google Drive:
   - Create two folders in Google Drive:
     - `photos` - for storing images
     - `videos` - for storing videos
   - Upload your media files with sequential names (1.jpg, 2.jpg, etc.)
   - Get the folder IDs from the Google Drive URL

3. Update configuration:
   - Open `script.js`
   - Replace `YOUR_PHOTOS_FOLDER_ID` with your photos folder ID
   - Replace `YOUR_VIDEOS_FOLDER_ID` with your videos folder ID
   - Replace `YOUR_FIRST_IMAGE_ID` in `styles.css` with your first image ID

4. Update package.json:
   - Replace `YOUR_USERNAME` with your GitHub username

## Deployment

The website is automatically deployed to GitHub Pages using GitHub Actions. The workflow is triggered on:
- Push to the main branch
- Manual trigger through GitHub Actions

## Customization

- Update the content in `index.html` to match your studio's information
- Modify colors and styles in `styles.css`
- Adjust gallery settings in `script.js`

## License

MIT License - See LICENSE file for details 