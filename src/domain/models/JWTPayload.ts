  export class JWTPayload {
    constructor (
      public id: string,
      public storeId?: number,
      public sub = id
    ) {}
  }