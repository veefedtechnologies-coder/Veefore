// Test the video compression for the 55MB file that's failing
const { VideoCompressor } = require('./server/video-compression.ts');

async function testCompression() {
  const filePath = './uploads/file-1749197978467-667927726.mp4';
  
  console.log('Testing compression for:', filePath);
  
  try {
    const result = await VideoCompressor.compressForInstagram(filePath, {
      quality: 'high',
      targetSizeMB: 25,
      maintainAspectRatio: true
    });
    
    console.log('Compression result:', result);
    
    if (result.success) {
      console.log(`Original size: ${(result.originalSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Compressed size: ${(result.compressedSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Output path: ${result.outputPath}`);
    }
  } catch (error) {
    console.error('Compression test failed:', error.message);
  }
}

testCompression();