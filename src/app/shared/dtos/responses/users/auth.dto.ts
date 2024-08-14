import { BaseAppDtoResponse } from '../shared/base.dto';
import { User } from 'src/app/shared/models/user';

export class LoginDtoResponse extends BaseAppDtoResponse {
  token: string;
  scheme: string;
  user: User;
}
