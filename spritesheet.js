const fs = require('fs');
const path = require('path');
const spritesmith = require('spritesmith');

const sourcePath = path.resolve(__dirname, 'src', 'spritesheets');
const outputDir = path.resolve(__dirname, 'dist', 'spritesheets');

fs.readdir(sourcePath, (err, files) => {
  if (err) {
    console.error('Error reading spritesheets directory:', err);
    return;
  }

  files.forEach(folder => {
    const folderPath = path.join(sourcePath, folder);
    if (fs.statSync(folderPath).isDirectory()) {
      const images = fs.readdirSync(folderPath)
        .filter(file => file.endsWith('.png'))
        .map(file => path.join(folderPath, file));

      spritesmith.run({ src: images }, (err, result) => {
        if (err) {
          console.error('Error generating spritesheet:', err);
          return;
        }
        
        const spritesheetPath = path.join(outputDir, `${folder}.png`);
        const jsonPath = path.join(outputDir, `${folder}.json`);

        const coordinates = {};
        Object.keys(result.coordinates).forEach(imagePath => {
          const baseName = path.basename(imagePath, path.extname(imagePath));
          coordinates[baseName] = result.coordinates[imagePath];
        });

        fs.writeFileSync(spritesheetPath, result.image);
        fs.writeFileSync(jsonPath, JSON.stringify(coordinates));
      });
    }
  });
});
