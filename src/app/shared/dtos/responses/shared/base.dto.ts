export class BaseAppDtoResponse {
  success!: boolean;
  full_messages!: string[];
}

export class ErrorAppDtoResponse extends BaseAppDtoResponse {
  override success = false;
}

export class SuccessAppDtoResponse extends BaseAppDtoResponse {
  override success = true;
}
