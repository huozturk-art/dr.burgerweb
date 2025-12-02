const fs = require('fs');
const path = require('path');

const sourcePath = 'C:/Users/huozt/.gemini/antigravity/brain/51b38289-41d4-4b22-ba64-aea7ecd5b473/uploaded_image_1764693128897.png';
const targetPath = path.join(__dirname, '../public/images/dr_burger_badge_final.png');

try {
    fs.copyFileSync(sourcePath, targetPath);
    console.log('Image copied successfully to:', targetPath);
} catch (error) {
    console.error('Error copying image:', error);
}
