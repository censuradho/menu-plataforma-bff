import { environment } from "@/shared/environment";
import { DeleteObjectCommand, ListBucketsCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { format } from "date-fns";

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

  generatePublicURL (key: string) {
    return `${environment.cloudFlare.r2.publicAccessUrl}/${key}`;
  };

  async uploadFile (
    buffer: Buffer, 
    key: string,
    contentType: string,
    folder: string
  ) {
    const fileName = `${folder}/${format(new Date(), 'yyyy-MM-dd')}/${new Date().getTime()}-${key}`

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    });
    const result = await this.s3.send(command);

    return {
      result,
      fileName,
      url: this.generatePublicURL(fileName)
    }
  }

  async deleteFile (fileName: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileName
    })

    await this.s3.send(command);
  }

  async deleteByKey (fileName: string) {
    try {
      const Key = this.generatePublicURL(fileName)

      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key
      })
  
      await this.s3.send(command);
    } catch (error) {
      console.log(error)
    }
  }
}