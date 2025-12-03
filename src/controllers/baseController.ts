export class BaseController {
  success(res: any, data: any) {
    res.status(200).json({ success: true, data });
  }

  error(res: any, status: number, message: string) {
    res.status(status).json({ success: false, message });
  }
}
