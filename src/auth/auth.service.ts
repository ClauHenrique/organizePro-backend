import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
) {}

  async signIn(login: LoginUserDto): Promise<any> {

    try {
        const user = await this.usersService.findOne(login.email);   

        if (!user) {
          throw new UnauthorizedException('invalid credentials');
        }
    
        const validatePassword = await bcrypt.compare(login.password, user.password)

        if (!validatePassword) {
          throw new UnauthorizedException('invalid credentials');
        }

        const payload = { email: user.email, sub: user._id };

        return {
          access_token: await this.jwtService.signAsync(payload),
        };

    }
    
      catch(err) {
        throw new UnauthorizedException('invalid credentials');
      }
    }
}