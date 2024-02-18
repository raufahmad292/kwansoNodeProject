// src/tasks/task.service.ts

import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../users/task.entity';
import { TaskStatus } from 'src/users/task.entity';
import { User } from 'src/users/user.entity';
import { stat } from 'fs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';


@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findUser(username:string): Promise<User>{
    return await this.userRepository.findOne({ where: { username: username } })
  }
  async createTask(user_id: number, title: string, description: string, token:string): Promise<Task> {

    let verify = this.jwtService.decode(token)
    if(verify == null)
    {
      throw new UnauthorizedException('User not found for this token');
    }
    if (verify.role == 0) {
      throw new UnauthorizedException('Only admin users can crate Task');
    }
    const task = this.taskRepository.create({ user_id, title, description });
    return this.taskRepository.save(task);
  }

  async getTaskById(id: number,token:string): Promise<Task> {
    let verify = this.jwtService.decode(token)
    if(verify == null)
    {
      throw new UnauthorizedException('User not found for this token');
    }
    if (verify.role == 0) {
      throw new UnauthorizedException('Only admin users can delete Task');
    }
    const task = await this.taskRepository.findOne({ where: { id: id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    let token= 'sad'
    const task = await this.getTaskById(id,token);
    task.status = status;
    return this.taskRepository.save(task);
  }

  async updateTask(id: number, title: string, status:string, description: string, token:string): Promise<Task> {
    
    let verify = this.jwtService.decode(token)
    if(verify == null)
    {
      throw new UnauthorizedException('User not found for this token');
    }
    if (verify.role == 0) {
      throw new UnauthorizedException('Only admin users can delete Task');
    }

    const task = await this.getTaskById(id,token);
    task.title = title;
    task.description = description;

    if(status)
    {
      if (status =='Pending')
      {
        task.status = TaskStatus.Pending
      }
      else if(status =='Completed'){
        task.status = TaskStatus.Completed
      }
      else{
        throw new HttpException({success: false,
          message: `Update Not Successful because status can only be Completed or Pending and you have send status ${status}`,
        },HttpStatus.BAD_REQUEST)

      }

    }
    return this.taskRepository.save(task);
  }

  async deleteTask(id: number, token:string): Promise<string>{

    let verify = this.jwtService.decode(token)
    if(verify == null)
    {
      throw new UnauthorizedException('User not found for this token');
    }
    if (verify.role == 0) {
      throw new UnauthorizedException('Only admin users can delete Task');
    }

    const result = await this.taskRepository.delete({ id});
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return "Task Successfully Deleted"
  }

  async getTasks(userId: number, limit: number, offset: number, status:string, token:string): Promise<Task[]| string> {
    let verify = this.jwtService.decode(token)
    if(verify == null)
    {
      throw new UnauthorizedException('User not found for this token');
    }
    if (verify.role == 0) {
      throw new UnauthorizedException('Only admin can see user taks');
    }
    if(limit == 0){
      throw new HttpException({success: true,
        message: 'No rows found because limit is 0',
      },HttpStatus.ACCEPTED)
    }
    if(status =='Completed')
    {
      if(userId)
      {
        return this.taskRepository.find({ where: { user_id:userId,status:TaskStatus.Completed } , skip: offset, take: limit, });
      }
      else{
        return this.taskRepository.find({ where: {status:TaskStatus.Completed } , skip: offset, take: limit, });

      }
    }
    if(status =='Pending')
    {
      if(userId)
      {
        return this.taskRepository.find({ where: { user_id:userId,status:TaskStatus.Pending } , skip: offset, take: limit, });
      }
      else{
        return this.taskRepository.find({ where: {status:TaskStatus.Pending } , skip: offset, take: limit, });

      }

    }
    if(status ==undefined)
    {
      if(userId)
      {
        return this.taskRepository.find({ where: { user_id:userId } , skip: offset, take: limit, });
      }
      else{
        return this.taskRepository.find({ skip: offset, take: limit, });

      }
    }
    if(status)
    {
      return ` Status ${status} is not valid`
    //
    }
  }
}
