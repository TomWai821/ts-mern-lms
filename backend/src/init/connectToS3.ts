import { S3Client } from "@aws-sdk/client-s3";

export const BUCKET_NAME = process.env.S3_BUCKET_NAME;
export const AWS_REGION = process.env.AWS_REGION;

export const s3Client = new S3Client({});