// src/invitations/invitation.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { invite } from 'src/users/invite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity'
import { UnauthorizedException } from '@nestjs/common';
import jwtDecode from 'jwt-decode';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';


@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(invite) private inviteRep: Repository<invite>,
    private readonly jwtService: JwtService,
    ) {}

  async createInvitation(email: string,token:string): Promise<invite> {

    let verify = this.jwtService.decode(token)
    if(verify == null)
    {
      throw new UnauthorizedException('User not found for this token');
    }
    if (verify.role == 0) {
      throw new UnauthorizedException('Only admin users can send invitations');
    }

    // find invite already exist or not 
    let invite = await this.inviteRep.find({where:{email:email}})
    
    if(invite.length>0)
    {
      throw new HttpException({success: false,
        message: 'Invitation already exist, reinvite please to reset the expiration date.',
      },HttpStatus.BAD_REQUEST)

    }

    const invitation = await this.inviteRep.create({
      email,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
    });
    
    try{
     return await this.inviteRep.save(invitation)
    }
    catch(e)
    {
        console.log(e)
    }
    return invitation
  }

  async resendInvitation(email: string, token:string): Promise<String> {

    let verify = this.jwtService.decode(token)
    if(verify == null)
    {
      throw new UnauthorizedException('User not found for this token');
    }

    if (verify.role == 0) {
      throw new UnauthorizedException('Only admin users can reinvite')
    }

    const invitation = await this.inviteRep.findOne({ where: { email } });
    if (!invitation) {
      throw new HttpException({success: false,
        message: 'Invitation not found',
      },HttpStatus.BAD_REQUEST)
    }

    invitation.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Reset expiration to 24 hours
    await this.inviteRep.save(invitation);
    return `Resent invitation for email ${email}. Token: ${invitation.token}`;
    
  }
}
