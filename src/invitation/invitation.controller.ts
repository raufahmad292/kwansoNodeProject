// src/invitations/invitation.controller.ts

import { Controller, Post, Body,Request,Req } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { UnauthorizedException } from '@nestjs/common';
import { invite } from 'src/users/invite.entity';
import { ApiBearerAuth,ApiBody } from '@nestjs/swagger';

@ApiBearerAuth() 
@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiBody({ description: 'Pass Data in Json {"emailToSend":"nouman@gmail.com"}' ,
    schema: { type: 'object', properties: {
      emailToSend:{type:'string', example:"nouman@gmail.com"}
    }} 
  }) // Describe the request body
  
  async createInvitation(@Body('emailToSend') email: string,@Req() request: Request ): Promise<invite> {

    const headers= request.headers as { authorization?: string };;
    const authorizationHeader = headers.authorization;

  // Check if the Authorization header exists and starts with "Bearer "
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split('Bearer ')[1];
      return await this.invitationService.createInvitation(email,token);
    } 
    else{
      throw new UnauthorizedException('Token Not Found');

    }
  }

  @Post('resend')
  @ApiBody({ description: 'Pass Data in Json {"emailToReinvite":"nouman@gmail.com"}' ,
    schema: { type: 'object', properties: {
      emailToReinvite:{type:'string', example:"nouman@gmail.com"}
    }} 
  }) // Describe the request body
  async resendInvitation(@Body('emailToReinvite') email: string,@Req() request: Request): Promise<String> {
    const headers = request.headers as { authorization?: string };;
    const authorizationHeader = headers.authorization ;

  // Check if the Authorization header exists and starts with "Bearer "
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split('Bearer ')[1];
      return await this.invitationService.resendInvitation(email,token);    } 
    else{
      throw new UnauthorizedException('Token Not Found');

    }
  }
}
