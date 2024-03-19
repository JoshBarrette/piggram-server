import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import * as sharp from "sharp";

export const MAX_IMAGE_SIZE = 600; // pixels

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private readonly cdnUrl = process.env.CDN_URL;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
  }

  /**
   * Uploads files to s3.
   * @param files The files to upload.
   * @param uploaderId The id of the uploader.
   * @returns string[] containing the urls of the file.
   */
  async uploadFiles(
    files: Express.Multer.File[],
    uploaderId: string,
  ): Promise<string[]> {
    const fileURLs: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const newURL = await this.uploadFile(uploaderId + `-${i}`, files[i]);
      fileURLs.push(newURL);
    }

    return fileURLs;
  }

  /**
   * Uploads a single file to S3.
   * @param key The key to pass to S3 for storage.
   * @param file The file to upload.
   * @returns The CDN URL extension of the uploaded file.
   */
  async uploadFile(key: string, file: Express.Multer.File): Promise<string> {
    const buffer = await this.resizeImageFile(file);

    const bucketParams: PutObjectCommandInput = {
      Body: buffer,
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: file.mimetype,
    };

    return await this.sendUpload(key, bucketParams);
  }

  /**
   * Delete a single file from S3.
   * @param key The key of the file to delete.
   * @returns True on success, the error object on failure.
   */
  async deleteFile(key: string): Promise<boolean> {
    const bucketParams: DeleteObjectCommandInput = {
      Key: key,
      Bucket: process.env.AWS_BUCKET_NAME,
    };

    return await this.s3Client
      .send(new DeleteObjectCommand(bucketParams))
      .then(() => true)
      .catch((e) => e);
  }

  /**
   * Uploads a single file buffer to S3.
   * @param key The key to pass to S3 for storage.
   * @param fileBuffer The file buffer to upload.
   * @param fileType The file type for the buffer.
   * @returns The CDN URL extension of the uploaded file.
   */
  async uploadBuffer(
    key: string,
    fileBuffer: Buffer,
    fileType: string,
  ): Promise<string> {
    const buffer = await this.resizeBuffer(fileBuffer);

    const bucketParams: PutObjectCommandInput = {
      Body: buffer,
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    };

    return await this.sendUpload(key, bucketParams);
  }

  /**
   * Resizes an image file for easier storage.
   * @param file The file to resize.
   * @returns A buffer of the given file that has been resized.
   */
  private async resizeImageFile(file: Express.Multer.File): Promise<Buffer> {
    const buffer = Buffer.from(file.buffer);
    return await this.resizeBuffer(buffer);
  }

  /**
   * Resizes an image file buffer for easier storage.
   * @param buffer The file buffer to resize.
   * @returns A buffer of the given file buffer that has been resized.
   */
  private async resizeBuffer(buffer: Buffer): Promise<Buffer> {
    const image = sharp(buffer);

    const metadata = await image.metadata();
    const { width, height } = metadata;

    let croppedImageBuffer: Buffer;
    if (height > width) {
      croppedImageBuffer = await image
        .extract({
          left: 0,
          top: Math.floor((height - width) / 2),
          width: width,
          height: width,
        })
        .resize({ width: MAX_IMAGE_SIZE, height: MAX_IMAGE_SIZE })
        .toBuffer();
    } else {
      croppedImageBuffer = await image
        .resize({ width: MAX_IMAGE_SIZE })
        .toBuffer();
    }

    return croppedImageBuffer;
  }

  /**
   * Sends the upload command to S3.
   * @param key The S3 key for the file.
   * @param bucketParams PutObjectCommandInput object containing the
   * options for S3.
   * @returns The CDN URL extension of the uploaded file.
   */
  private async sendUpload(
    key: string,
    bucketParams: PutObjectCommandInput,
  ): Promise<string> {
    return await this.s3Client
      .send(new PutObjectCommand(bucketParams))
      .then(() => "/" + key)
      .catch((e) => e);
  }
}
