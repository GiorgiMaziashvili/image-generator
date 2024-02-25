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

        const frames = {};
        Object.keys(result.coordinates).forEach(imagePath => {
          const baseName = path.basename(imagePath, path.extname(imagePath)); 
          frames[baseName] = {
            frame: {
              x: result.coordinates[imagePath].x,
              y: result.coordinates[imagePath].y,
              w: result.coordinates[imagePath].width,
              h: result.coordinates[imagePath].height
            },
            rotated: false,
            trimmed: false,
            spriteSourceSize: {
              x: 0,
              y: 0,
              w: result.coordinates[imagePath].width,
              h: result.coordinates[imagePath].height
            },
            sourceSize: {
              w: result.coordinates[imagePath].width,
              h: result.coordinates[imagePath].height
            }
          };
        });

        const meta = {
          image: `${folder}.png`,
          size: {
            w: result.properties.width,
            h: result.properties.height
          }
        };

        const jsonData = {
          frames: frames,
          meta: meta
        };

        fs.writeFileSync(jsonPath, JSON.stringify(jsonData));
        fs.writeFileSync(spritesheetPath, result.image);
      });
    }
  });
});
