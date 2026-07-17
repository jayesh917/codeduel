const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgCode = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0f172a" />
  <path d="M120 256L220 156V216H292V296H220V356L120 256Z" fill="#3b82f6" />
  <path d="M392 256L292 356V296H220V216H292V156L392 256Z" fill="#ef4444" />
</svg>
`;

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'masked-icon.svg'), svgCode);

sharp(Buffer.from(svgCode))
  .resize(192, 192)
  .png()
  .toFile(path.join(publicDir, 'pwa-192x192.png'))
  .then(() => console.log('pwa-192x192.png generated'));

sharp(Buffer.from(svgCode))
  .resize(512, 512)
  .png()
  .toFile(path.join(publicDir, 'pwa-512x512.png'))
  .then(() => console.log('pwa-512x512.png generated'));

sharp(Buffer.from(svgCode))
  .resize(180, 180)
  .png()
  .toFile(path.join(publicDir, 'apple-touch-icon.png'))
  .then(() => console.log('apple-touch-icon.png generated'));

sharp(Buffer.from(svgCode))
  .resize(32, 32)
  .png()
  .toFile(path.join(publicDir, 'favicon.ico'))
  .then(() => console.log('favicon.ico generated'));
