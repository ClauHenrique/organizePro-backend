import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'
import { UnauthorizedException } from '@nestjs/common';

// gerar hash de senha para testes
const password = 'j7ldd@bbb';
const hash = bcrypt.hashSync(password, 8);

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mockedJwtToken'),
  verify: jest.fn().mockReturnValue({ userId: '1' }),
};

// banco de dados
const mockUserService = {
  findOne: jest.fn().mockResolvedValue({
    _id: '1',
    email: 'test@example.com',
    password: hash,
  }),
};



describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a JWT token for valid credentials', async () => {
    const loginUserDto = { email: 'test@example.com', password: 'j7ldd@bbb' };
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await service.signIn(loginUserDto);
    
    expect(result).toEqual({ access_token: 'mockedJwtToken' });
  });

  // it('return an exception for incorrect email', async () => {
  //   const loginUserDto = { email: 'incorrect@example.com', password: 'j7ldd@bbb' };
  
  //   await expect(service.signIn(loginUserDto)).rejects.toThrow(UnauthorizedException);
  // });

  it('return an exception for invalid password', async () => {
    const loginUserDto = { email: 'test@example.com', password: '123456' };
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
  
    await expect(service.signIn(loginUserDto)).rejects.toThrow(UnauthorizedException);
  });
  

});
