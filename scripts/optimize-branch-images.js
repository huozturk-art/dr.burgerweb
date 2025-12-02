const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = 'C:\\Users\\huozt\\Downloads\\Yeni klasör';
const TARGET_DIR = path.join(__dirname, '../public/images/branches');

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function optimizeImages() {
    try {
        const files = fs.readdirSync(SOURCE_DIR);

        console.log(`Found ${files.length} files in ${SOURCE_DIR}`);

        for (const file of files) {
            if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
                const sourcePath = path.join(SOURCE_DIR, file);
                const targetPath = path.join(TARGET_DIR, file.replace(/\.[^/.]+$/, "") + ".jpg"); // Convert to JPG for photos

                console.log(`Processing: ${file}`);

                await sharp(sourcePath)
                    .resize(1200, null, { // Resize to 1200px width for gallery
                        withoutEnlargement: true
                    })
                    .jpeg({
                        quality: 80,
                        mozjpeg: true
                    })
                    .toFile(targetPath);

                console.log(`Saved to: ${targetPath}`);
            }
        }
        console.log('Optimization complete!');
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
}

optimizeImages();
