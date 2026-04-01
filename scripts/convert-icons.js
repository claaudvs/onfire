const pngToIco = require('png-to-ico');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Sizes Windows uses for tray icons
const SIZES = [16, 32, 48, 256];

// Padding as fraction of total size (keeps a thin border so icon isn't clipped)
const PADDING_RATIO = 0.05;

async function buildIcoBuffers(src) {
  // Step 1: trim all transparent / near-white empty space around the character
  const trimmed = await sharp(src)
    .trim({ background: '#ffffff', threshold: 30 })
    .png()
    .toBuffer();

  // Step 2: for each required size, resize the trimmed image with padding
  const buffers = await Promise.all(
    SIZES.map(async (size) => {
      const pad = Math.round(size * PADDING_RATIO);
      const inner = size - pad * 2;

      return sharp(trimmed)
        .resize(inner, inner, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .extend({
          top: pad, bottom: pad, left: pad, right: pad,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
    })
  );

  return buffers;
}

async function convert() {
  const activeSrc   = path.join(__dirname, '..', 'icon', 'active.png');
  const inactiveSrc = path.join(__dirname, '..', 'icon', 'desactive.png');

  console.log('Converting active icon...');
  const activeBuffers  = await buildIcoBuffers(activeSrc);
  const activeIco      = await pngToIco(activeBuffers);
  fs.writeFileSync(path.join(assetsDir, 'tray-active.ico'), activeIco);
  console.log('  -> assets/tray-active.ico  (%d sizes: %s)', SIZES.length, SIZES.join(', '));

  console.log('Converting inactive icon...');
  const inactiveBuffers = await buildIcoBuffers(inactiveSrc);
  const inactiveIco     = await pngToIco(inactiveBuffers);
  fs.writeFileSync(path.join(assetsDir, 'tray-inactive.ico'), inactiveIco);
  console.log('  -> assets/tray-inactive.ico  (%d sizes: %s)', SIZES.length, SIZES.join(', '));

  console.log('Done.');
}

convert().catch((err) => {
  console.error('Icon conversion failed:', err.message);
  process.exit(1);
});
