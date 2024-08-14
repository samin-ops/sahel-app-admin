import { User } from './user';

export class Comment {
  constructor(params: any = {}) {
    this.id = params.id;
    this.user = params.user;
    this.username = params.username;
    this.productId = params.productId;
    this.content = params.content;
    this.createdAt = params.createdAt;
  }
  id: number;
  user?: User;
  username: string;
  productId?: number;
  content: string;
  createdAt: string;
}
