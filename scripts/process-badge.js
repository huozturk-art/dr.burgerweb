const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sourcePath = 'C:/Users/huozt/.gemini/antigravity/brain/51b38289-41d4-4b22-ba64-aea7ecd5b473/uploaded_image_1764692387943.jpg';
const targetPath = path.join(__dirname, '../public/images/dr_burger_badge_new.png');

async function processImage() {
    try {
        console.log('Processing image...');
        await sharp(sourcePath)
            .resize(500, 500, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background if possible, though input is JPG
            })
            .png()
            .toFile(targetPath);
        console.log('Image processed and saved to:', targetPath);
    } catch (error) {
        console.error('Error processing image:', error);
    }
}

processImage();
