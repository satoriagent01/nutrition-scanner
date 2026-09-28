/**
 * Tests for the OCR module
 * Tests the scanImage function which extracts text from images using Tesseract.js
 */

const { scanImage } = require('../src/ocr.js');
const fs = require('fs');
const path = require('path');

// Mock Tesseract.js since we can't use the actual library in tests
jest.mock('tesseract.js', () => ({
  createWorker: jest.fn(() => ({
    recognize: jest.fn(() => Promise.resolve({
      data: { text: 'Nährwertdeklaration\nEnergie 2292 kJ\nFett 33 g\nKohlenhydrate 55 g\nZucker 45 g\nBallaststoffe 2,4 g\nEiweiß 6,8 g\nSalz 0,18 g' }
    })),
    terminate: jest.fn(() => Promise.resolve())
  }))
}));

describe('OCR Module', () => {
  describe('scanImage', () => {
    test('should extract text from an image', async () => {
      // Create a minimal test image (1x1 pixel PNG)
      const testImagePath = path.join(__dirname, '..', 'test', 'test-image.png');
      
      // Create test directory and image
      const testDir = path.join(__dirname, '..', 'test');
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir);
      }
      
      // Minimal valid PNG (1x1 transparent pixel)
      const pngData = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      fs.writeFileSync(testImagePath, pngData);
      
      const result = await scanImage(testImagePath);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('Nährwertdeklaration');
      expect(result).toContain('Energie');
      expect(result).toContain('Fett');
      
      // Cleanup
      fs.unlinkSync(testImagePath);
    });

    test('should return empty string if no text is detected', async () => {
      // Mock Tesseract to return empty text
      const Tesseract = require('tesseract.js');
      Tesseract.createWorker.mockImplementation(() => ({
        recognize: jest.fn(() => Promise.resolve({
          data: { text: '' }
        })),
        terminate: jest.fn(() => Promise.resolve())
      }));
      
      const testImagePath = path.join(__dirname, '..', 'test', 'blank-image.png');
      const pngData = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      fs.writeFileSync(testImagePath, pngData);
      
      const result = await scanImage(testImagePath);
      
      expect(result).toBe('');
      
      // Cleanup
      fs.unlinkSync(testImagePath);
    });

    test('should throw error for invalid image path', async () => {
      await expect(scanImage('/nonexistent/path/image.png'))
        .rejects
        .toThrow();
    });
  });
});