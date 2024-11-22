interface Page {
  size: number,
  totalRecords: number,
  totalPages: number,
  currentPage: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
}
export class Paginate<D> {
  constructor (
    public info: Page,
    public data: D,
  ) {}
}