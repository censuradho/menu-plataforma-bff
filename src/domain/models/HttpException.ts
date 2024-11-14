export class HttpException implements Error {
  constructor (
    public status: number,
    public message: string
  ) {
    this.name = message
  }
  name: string;
  stack?: string | undefined;
}