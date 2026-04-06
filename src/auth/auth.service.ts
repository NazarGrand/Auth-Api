import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jcw-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, pass: string) {
    const existingUser = this.usersService.findOne(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = this.usersService.create({
      id: Date.now(),
      email,
      password: hashedPassword,
    });

    return { id: newUser.id, email: newUser.email };
  }

  async signIn(email: string, pass: string) {
    const user = this.usersService.findOne(email);

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }

    return this.generateTokens(user.id, user.email);
  }

  async refreshToken(token: string) {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);

      return this.generateTokens(payload.id, payload.email);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  getMe(userId: number) {
    const user = this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  private async generateTokens(userId: number, email: string) {
    const payload = { id: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '1h' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
