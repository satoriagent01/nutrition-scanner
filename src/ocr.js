const Tesseract = require('tesseract.js');

/**
 * OCR module using Tesseract.js to extract text from nutrition label images.
 * Uses English and German trained data for best results on European labels.
 */

/**
 * Extracts text from an image file (Buffer or Blob).
 * @param {Buffer|Blob} image - The image to process
 * @returns {Promise<string>} The extracted text
 */
async function extractText(image) {
  try {
    let worker;
    try {
      worker = await Tesseract.createWorker(['eng', 'deu'], 1, {
        logger: () => {}, // Suppress logging
      });
    } catch (createError) {
      // Fallback if multi-language not supported
      worker = await Tesseract.createWorker('eng', 1, {
        logger: () => {},
      });
    }

    let result;
    if (image instanceof Blob) {
      result = await worker.recognize(image);
    } else {
      // Buffer - convert to blob-like format
      const blob = new Blob([image], { type: 'image/png' });
      result = await worker.recognize(blob);
    }

    await worker.terminate();
    return result.data.text;
  } catch (error) {
    throw new Error(`OCR failed: ${error.message}`);
  }
}

/**
 * Preprocesses OCR text by cleaning up common OCR artifacts.
 * @param {string} text - Raw OCR text
 * @returns {string} Cleaned text
 */
function cleanText(text) {
  return text
    .replace(/\t/g, '  ') // Replace tabs with spaces
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

module.exports = { extractText, cleanText };