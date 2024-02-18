import { HttpStatus } from '@nestjs/common';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { invite } from 'src/users/invite.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(invite) private inviteRep: Repository<invite>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {

    const { username, password,role } = signUpDto;
    //find invite
    let invite = await this.inviteRep.find({where:{email:username}})

    if(invite.length == 0)
    {    
      throw new HttpException({success: false,
        message: 'Invite not found"',
      },HttpStatus.BAD_REQUEST)
    }
    
    //finding user if already exist
    let user = await this.userRep.findOne({where:{username}})

    if(user)
    {
      throw new HttpException({success: false,
        message: 'User Already Exist',
      },HttpStatus.BAD_REQUEST)
    }
    const currentDate = new Date();
    if(currentDate<invite[invite.length-1].expiresAt){

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User();
      user.username = username;
      user.password = hashedPassword;
      user.role = role

      return await this.userRep.save(user);
    }
    else
    {
        throw new HttpException({success: false,
          message: `Expiry date of invitation has passed ${invite[invite.length-1].expiresAt}`,
        },HttpStatus.BAD_REQUEST)
    }
  }

  async signIn(username: string, password: string,): Promise<{ accessToken: string }> {

    const user = await this.userRep.findOne({ where: { username } });
    if (!user) {
      
      throw new HttpException({success: false,
        message: 'Invalid credentials',
      },HttpStatus.BAD_REQUEST)

    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException({success: false,
        message: 'Invalid credentials',
      },HttpStatus.BAD_REQUEST)
    }

    const payload = { username: user.username, id: user.id, role:user.role };
    const accessToken = this.jwtService.sign(payload,{
        secret: 'your_secret_key_here',
      });

    return { accessToken };
    
  }
}

