import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { IRegisterUser, IReponseUser } from '../model/user.model';
import { IResponseFE } from '../model/web.model';

@Controller('/api')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async RegisterUser(
    @Body() request: IRegisterUser,
  ): Promise<IResponseFE<IReponseUser>> {
    const response = await this.userService.registerUser(request);
    return { data: response };
  }
}
