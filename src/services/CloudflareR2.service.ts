import { environment } from "@/shared/environment";
import { S3 } from "aws-sdk";

export class CloudflareR2Service {
  constructor (
    private s3 = new S3({
      endpoint: environment.cloudFlare.r2.url,
      accessKeyId: environment.cloudFlare.r2.accessKeyId,
      secretAccessKey: environment.cloudFlare.r2.secretAccessKey,
      signatureVersion: 'v4'
    })
  ) {}

  async listBuckets () {
    return await this.s3.listBuckets().promise()
  }
}