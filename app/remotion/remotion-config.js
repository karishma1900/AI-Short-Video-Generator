// scripts/render-remotion.js
// This script is executed as a separate process by the Next.js API route.
// It is completely isolated from the Next.js build process.
const { renderMedia } = require('@remotion/renderer');
const path = require('path');
const { RemotionRoot } = require('../remotion-config.js');

async function renderVideo() {
  // Parse command-line arguments passed from the parent process
  // The first argument is the JSON string of input props, the second is the output path
  const inputProps = JSON.parse(process.argv[2]);
  const outputLocation = process.argv[3];

  try {
    console.log('Starting Remotion rendering...');
    await renderMedia({
      composition: 'Main',
      compositions: RemotionRoot,
      codec: 'h264',
      outputLocation: outputLocation,
      inputProps: inputProps,
    });
    console.log('Remotion rendering completed successfully.');
    // Exit with a success code
    process.exit(0);
  } catch (error) {
    console.error('Remotion rendering failed:', error);
    // Exit with an error code
    process.exit(1);
  }
}

// Start the rendering process
renderVideo();