import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type StorageConfig = {
  endpoint?: string;
  region: string;
  bucket: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  forcePathStyle?: boolean;
};

const loadConfig = (): StorageConfig => ({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION ?? 'us-east-1',
  bucket: process.env.S3_BUCKET ?? 'portal-demo',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
});

const createClient = (config: StorageConfig): S3Client => {
  const credentials =
    config.accessKeyId && config.secretAccessKey
      ? {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        }
      : undefined;

  return new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials,
    forcePathStyle: config.forcePathStyle,
  });
};

export type PresignedUpload = {
  url: string;
  key: string;
};

export type PresignedDownload = {
  url: string;
};

export interface StorageService {
  createPresignedUpload: (key: string, contentType: string) => Promise<PresignedUpload>;
  createPresignedDownload: (key: string) => Promise<PresignedDownload>;
  bucket: string;
}

export const createStorageService = (): StorageService => {
  const config = loadConfig();
  const client = createClient(config);

  return {
    bucket: config.bucket,
    async createPresignedUpload(key: string, contentType: string): Promise<PresignedUpload> {
      const command = new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        ContentType: contentType,
      });

      const url = await getSignedUrl(client, command, { expiresIn: 900 });
      return { url, key };
    },
    async createPresignedDownload(key: string): Promise<PresignedDownload> {
      const command = new GetObjectCommand({
        Bucket: config.bucket,
        Key: key,
      });

      const url = await getSignedUrl(client, command, { expiresIn: 900 });
      return { url };
    },
  };
};
