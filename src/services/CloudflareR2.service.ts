import { environment } from "@/shared/environment";
import { S3 } from "@aws-sdk/client-s3";

export class CloudflareR2Service {
  constructor (
    private s3 = new S3({
      region: 'auto',
      endpoint: environment.cloudFlare.r2.url,
      credentials: {
        accessKeyId: environment.cloudFlare.r2.accessKeyId,
        secretAccessKey: environment.cloudFlare.r2.secretAccessKey,
      }
    }),
    private bucket: string = "menu"
  ) {}
}