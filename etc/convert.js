const fs = require('fs');
const heicConvert = require('heic-convert');

(async () => {
  try {
    const inputBuffer = fs.readFileSync('Noivas fotos/Giovanna.HEIC');
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 1
    });
    fs.writeFileSync('Noivas fotos/Giovanna.jpg', outputBuffer);
    console.log('Conversion successful!');
  } catch (err) {
    console.error('Error during conversion:', err);
  }
})();
