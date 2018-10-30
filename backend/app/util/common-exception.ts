export default class CommonException {
  status: number;
  code: string;
  message: any;

  constructor(data) {
    this.status = data.status;
    this.code = data.code;
    this.message = data.message;
  }
}
