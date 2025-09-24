// remotion/render-remotion.js

const { renderMedia } = require('@remotion/renderer');
const path = require('path');
const { RemotionRoot } = require('./remotion-config'); // Note the correct relative path

async function startRendering() {
  const inputPropsString = process.argv[2];
  const outputLocation = process.argv[3];
  
  if (!inputPropsString || !outputLocation) {
    console.error('❌ Missing arguments for rendering script.');
    process.exit(1);
  }

  const inputProps = JSON.parse(inputPropsString);

  try {
    console.log('Starting Remotion render...');
    await renderMedia({
      composition: 'Main',
      compositions: RemotionRoot,
      codec: 'h264',
      outputLocation: outputLocation,
      inputProps: inputProps,
    });
    console.log('✅ Video rendered successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Remotion render failed:', error);
    process.exit(1);
  }
}

startRendering();