import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import * as sharp from "sharp";

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

  async uploadFile(key: string, file: Express.Multer.File): Promise<string> {
    const fileBuffer = Buffer.from(
      await new File([file.buffer], file.originalname).arrayBuffer(),
    );

    const buffer = await this.resizeBuffer(fileBuffer);

    const bucketParams: PutObjectCommandInput = {
      Body: buffer,
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: file.mimetype,
    };

    return await this.sendUpload(key, bucketParams);
  }

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

  private async resizeImageFile(file: Express.Multer.File) {
    const buffer = Buffer.from(file.buffer);
    return await this.resizeBuffer(buffer);
  }

  private async resizeBuffer(buffer: Buffer) {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    const { width, height } = metadata;
    const size = Math.min(width, height);
    const top = (height - size) / 2;

    let croppedImageBuffer: Buffer;
    if (height > width) {
      croppedImageBuffer = await image
        .extract({ left: 0, top, width: size, height: size })
        .resize({ width: 600, height: 600 })
        .toBuffer();
    } else {
      croppedImageBuffer = await image.resize({ width: 600 }).toBuffer();
    }

    console.log(croppedImageBuffer.length);
    return croppedImageBuffer;
  }

  private async sendUpload(
    key: string,
    bucketParams: PutObjectCommandInput,
  ): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        await this.s3Client.send(new PutObjectCommand(bucketParams));
        resolve(this.cdnUrl + "/" + key);
      } catch (err) {
        console.log("Error", err);
        reject(err);
      }
    });
  }
}
