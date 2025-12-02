const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = 'C:\\Users\\huozt\\OneDrive\\Desktop\\dr burger\\Yeni klasör (3)';
const TARGET_DIR = path.join(__dirname, '../public/images/products');

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function optimizeImages() {
    try {
        const files = fs.readdirSync(SOURCE_DIR);

        console.log(`Found ${files.length} files in ${SOURCE_DIR}`);

        for (const file of files) {
            if (file.match(/\.(jpg|jpeg|png)$/i)) {
                const sourcePath = path.join(SOURCE_DIR, file);
                const targetPath = path.join(TARGET_DIR, file);

                console.log(`Processing: ${file}`);

                await sharp(sourcePath)
                    .resize(800, null, { // Resize to 800px width, auto height
                        withoutEnlargement: true
                    })
                    .png({
                        quality: 80,
                        compressionLevel: 9,
                        palette: true // Use palette-based compression for smaller size
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
