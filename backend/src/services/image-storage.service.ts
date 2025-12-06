import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

// =====================================================
// TYPES
// =====================================================

interface UploadImageOptions {
  productSku: string;
  buffer: Buffer;
  mimetype: string;
  originalName: string;
}

interface UploadImageResult {
  url: string;
  filename: string;
}

// =====================================================
// IMAGE STORAGE SERVICE
// =====================================================

export class ImageStorageService {
  private s3Client: S3Client | null = null;
  private useS3: boolean;
  private bucketName: string;
  private region: string;
  private localUploadPath: string;
  private baseUrl: string;

  constructor() {
    // Determine if we should use S3 or local storage
    this.useS3 = process.env.USE_S3_STORAGE === 'true';
    this.bucketName = process.env.AWS_S3_BUCKET || 'metalpro-product-images';
    this.region = process.env.AWS_REGION || 'eu-central-1';
    this.localUploadPath = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads', 'products');

    // Base URL for images
    if (this.useS3) {
      // Use CloudFront or S3 URL
      this.baseUrl = process.env.AWS_CLOUDFRONT_URL
        || `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;
    } else {
      // Local development URL
      this.baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    }

    // Initialize S3 client if needed
    if (this.useS3) {
      this.s3Client = new S3Client({ region: this.region });
    }
  }

  /**
   * Upload a product image
   */
  async uploadImage(options: UploadImageOptions): Promise<UploadImageResult> {
    const { productSku, buffer, mimetype, originalName } = options;

    // Process image with sharp (resize and optimize)
    const processedBuffer = await this.processImage(buffer);

    // Generate unique filename
    const ext = path.extname(originalName) || '.jpg';
    const filename = `${uuidv4()}${ext}`;
    const fullPath = `products/${productSku}/${filename}`;

    if (this.useS3 && this.s3Client) {
      // Upload to S3
      await this.uploadToS3(fullPath, processedBuffer, mimetype);
      return {
        url: `${this.baseUrl}/${fullPath}`,
        filename,
      };
    } else {
      // Save locally
      await this.saveLocally(productSku, filename, processedBuffer);
      return {
        url: `${this.baseUrl}/uploads/products/${productSku}/${filename}`,
        filename,
      };
    }
  }

  /**
   * Delete a product image
   */
  async deleteImage(productSku: string, filename: string): Promise<void> {
    const fullPath = `products/${productSku}/${filename}`;

    if (this.useS3 && this.s3Client) {
      // Delete from S3
      await this.deleteFromS3(fullPath);
    } else {
      // Delete locally
      await this.deleteLocally(productSku, filename);
    }
  }

  /**
   * Process image: resize and optimize
   */
  private async processImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toBuffer();
  }

  /**
   * Upload image to S3
   */
  private async uploadToS3(key: string, buffer: Buffer, mimetype: string): Promise<void> {
    if (!this.s3Client) {
      throw new Error('S3 client not initialized');
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
      CacheControl: 'max-age=31536000', // 1 year
    });

    await this.s3Client.send(command);
  }

  /**
   * Delete image from S3
   */
  private async deleteFromS3(key: string): Promise<void> {
    if (!this.s3Client) {
      throw new Error('S3 client not initialized');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  /**
   * Save image locally
   */
  private async saveLocally(productSku: string, filename: string, buffer: Buffer): Promise<void> {
    const dir = path.join(this.localUploadPath, productSku);

    // Create directory if it doesn't exist
    await fs.mkdir(dir, { recursive: true });

    // Save file
    const filePath = path.join(dir, filename);
    await fs.writeFile(filePath, buffer);
  }

  /**
   * Delete image locally
   */
  private async deleteLocally(productSku: string, filename: string): Promise<void> {
    const filePath = path.join(this.localUploadPath, productSku, filename);

    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      // Ignore if file doesn't exist
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

// Export singleton instance
export const imageStorageService = new ImageStorageService();
