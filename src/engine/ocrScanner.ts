import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(
  imageFile: File | Blob,
  onProgress?: (progress: number, status: string) => void
): Promise<{ text: string; confidence: number; error?: string }> {
  try {
    if (onProgress) onProgress(10, 'Initializing OCR worker...');
    
    // Convert to object URL or base64 for processing
    const worker = await createWorker('eng');
    
    if (onProgress) onProgress(40, 'Recognizing text in screenshot...');
    const ret = await worker.recognize(imageFile);
    
    if (onProgress) onProgress(90, 'Finalizing text extraction...');
    await worker.terminate();

    const cleanText = ret.data.text.trim();
    return {
      text: cleanText,
      confidence: ret.data.confidence
    };
  } catch (error: any) {
    console.warn('OCR processing encountered an issue, falling back to manual input:', error);
    return {
      text: '',
      confidence: 0,
      error: error?.message || 'OCR extraction could not process this image.'
    };
  }
}
