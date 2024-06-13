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
    console.log("login >>>>", login);
    

    try {
        const user = await this.usersService.findOne(login.email);

        console.log(">>>>>>", user);
        

        if (!user) {
          throw new UnauthorizedException('invalid credentials');
        }
    
        const validatePassword = await bcrypt.compare(login.password, user.password);

        console.log("valid >>>>", validatePassword);
        

        if (!validatePassword) {
          throw new UnauthorizedException('invalid credentials');
        }

        const payload = { email: user.email, sub: user._id };
        console.log("retorna o payload!!!!!");
        

        return {
          // access_token: await this.jwtService.signAsync(payload),
          access_token: "oppaaaaa"
        };

    }
    
      catch(err) {
        throw new UnauthorizedException('invalid credentials');
      }
    }
}