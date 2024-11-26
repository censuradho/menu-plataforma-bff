import { S3 } from "aws-sdk";

export class CloudflareR2Service {
  constructor (
    private s3 = new S3({
      
    })
  ) {}
}