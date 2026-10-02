import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    const accountId = config.get<string>('R2_ACCOUNT_ID') ?? '';
    this.bucket = config.get<string>('R2_BUCKET_NAME') ?? '';
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.get<string>('R2_ACCESS_KEY_ID') ?? '',
        secretAccessKey: config.get<string>('R2_SECRET_ACCESS_KEY') ?? '',
      },
    });
  }

  private assertConfigured() {
    if (!this.bucket || !this.config.get('R2_ACCOUNT_ID') || !this.config.get('R2_ACCESS_KEY_ID') || !this.config.get('R2_SECRET_ACCESS_KEY')) {
      throw new ServiceUnavailableException('Document storage is not configured');
    }
  }

  async upload(key: string, file: Express.Multer.File) {
    this.assertConfigured();
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
    }));
  }

  async createDownloadUrl(key: string) {
    this.assertConfigured();
    return getSignedUrl(this.client, new GetObjectCommand({ Bucket: this.bucket, Key: key }), { expiresIn: 300 });
  }
}
