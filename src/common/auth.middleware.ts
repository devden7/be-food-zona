import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    try {
      const token = this.extractTokenHeaderAuth(req);
      if (token) {
        const user = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_KEY,
        });
        if (user) {
          req.user = user;
        }
      }
    } catch (err) {
      throw new HttpException('Invalid Token!', 400);
    }

    next();
  }

  private extractTokenHeaderAuth(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
