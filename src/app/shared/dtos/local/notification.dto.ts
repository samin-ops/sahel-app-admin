export class NotificationsDto {
  constructor(type: string, message: string) {}
}

export class NotificationTypes {
  static SUCCESS_TYPE = 'success';
  static ERROR_TYPE = 'error';
}
