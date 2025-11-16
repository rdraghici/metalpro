import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

// =====================================================
// TYPES
// =====================================================

interface UploadResult {
  fileId: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  size: number;
}

// =====================================================
// CONFIGURATION
// =====================================================

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const BASE_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// =====================================================
// UPLOAD SERVICE
// =====================================================

export class UploadService {
  /**
   * Upload BOM file (Excel/CSV)
   */
  async uploadBOM(file: Express.Multer.File, userId?: string): Promise<UploadResult> {
    const fileId = uuidv4();
    const userFolder = userId || 'guest';
    const uploadPath = path.join(UPLOAD_DIR, 'bom-uploads', userFolder);

    // Ensure directory exists
    await fs.mkdir(uploadPath, { recursive: true });

    // Save file
    const fileName = `${fileId}-${file.originalname}`;
    const filePath = path.join(uploadPath, fileName);
    await fs.writeFile(filePath, file.buffer);

    return {
      fileId,
      fileName: file.originalname,
      filePath,
      fileUrl: `${BASE_URL}/uploads/bom-uploads/${userFolder}/${fileName}`,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  /**
   * Upload RFQ attachment (PDF, images, documents)
   */
  async uploadAttachment(file: Express.Multer.File, rfqId: string): Promise<UploadResult> {
    const fileId = uuidv4();
    const uploadPath = path.join(UPLOAD_DIR, 'rfq-attachments', rfqId);

    // Ensure directory exists
    await fs.mkdir(uploadPath, { recursive: true });

    // Save file
    const fileName = `${fileId}-${file.originalname}`;
    const filePath = path.join(uploadPath, fileName);
    await fs.writeFile(filePath, file.buffer);

    return {
      fileId,
      fileName: file.originalname,
      filePath,
      fileUrl: `${BASE_URL}/uploads/rfq-attachments/${rfqId}/${fileName}`,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  /**
   * Delete file
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('File deletion error:', error);
      // File might not exist, ignore error
    }
  }

  /**
   * Validate file type
   */
  validateBOMFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    const allowedMimeTypes = [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv', // .csv
      'text/plain', // .txt
    ];

    const allowedExtensions = ['.xls', '.xlsx', '.csv', '.txt'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.includes(file.mimetype) && !allowedExtensions.includes(fileExtension)) {
      return {
        valid: false,
        error: 'Format fișier invalid. Acceptăm doar: .xlsx, .xls, .csv, .txt',
      };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Fișierul este prea mare. Dimensiunea maximă: 10MB',
      };
    }

    return { valid: true };
  }

  /**
   * Validate attachment file
   */
  validateAttachment(file: Express.Multer.File): { valid: boolean; error?: string } {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.includes(file.mimetype) && !allowedExtensions.includes(fileExtension)) {
      return {
        valid: false,
        error: 'Format fișier invalid. Acceptăm: PDF, JPG, PNG, GIF, DOC, DOCX',
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Fișierul este prea mare. Dimensiunea maximă: 5MB',
      };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const uploadService = new UploadService();
