
// src/auth/auth.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from 'src/users/user.entity';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBody({ description: 'Pass Data in Json { "username":"nouman@gmail.com", "password":"richboy", "role":0}' ,
    schema: { type: 'object', properties: {
      username:{type:'string', example:"nouman@gmail.com"},
      password:{type:'string', example:"password"},
      role:{type:'number', example:0}
      }} 
  })  

  async signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @ApiBody({ description: 'Pass Data in Json {"username": "admin","password": "adminpassword"}' ,
    schema: { type: 'object', properties: {
    username:{type:'string', example:"admin"},
    password:{type:'string', example:"adminpassword"}
    }} 
  })
  
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {  
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
