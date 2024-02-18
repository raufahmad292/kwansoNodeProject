// src/tasks/task.con   troller.ts

import { Controller, Post, Body, Param, Get, Put, Delete, UseGuards, Request,Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskStatus } from '../users/task.entity';
import { Task } from '../users/task.entity';
import { User } from '../users/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { Query,ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiBody,ApiQuery } from '@nestjs/swagger';
import { ApiExcludeEndpoint } from '@nestjs/swagger';


@ApiBearerAuth() 
@Controller('tasks')

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiBody({ description: 'Pass Data in Json {"title":" work", "description":"complete this work", username:"nouman@gmail.com"}' ,
    schema: { type: 'object', properties: {
      title:{type:'string', example:"assignment physics"},
      description:{type:'string', example:"complete this assignment"},
      username:{type:'string', example:"nouman@gmail.com"}
      }} 
  }) // Describe the request body

  async createTask(@Body('username') username: string, @Body('title') title: string, @Body('description') description: string,@Req() request: Request): Promise<Task> {

    const headers = request.headers as { authorization?: string };;
    const authorizationHeader = headers.authorization;

  // Check if the Authorization header exists and starts with "Bearer "
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split('Bearer ')[1];
      const user: User = await this.taskService.findUser(username)
      if(user == null)
      {
          throw new UnauthorizedException(`User ${username} Not Found`)
      }
      return this.taskService.createTask(user.id, title, description,token);
    } 
    else{
      throw new UnauthorizedException('Token Not Found');

    } 
  }
  
  @Get(':id')
  @ApiExcludeEndpoint()
  async getTaskById(@Param('id') id: number, @Request() request): Promise<Task> {

    const headers = request.headers as { authorization?: string };;
    const authorizationHeader = headers.authorization;
  // Check if the Authorization header exists and starts with "Bearer "
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.split('Bearer ')[1];
      
        return  this.taskService.getTaskById(id,token);
    } 
    else{
      throw new UnauthorizedException('Token Not Found');
    }
  }
  
  @Put(':id/status')
  @ApiExcludeEndpoint()
  async updateTaskStatus(@Param('id') id: number, @Body('status') status: TaskStatus, @Request() req,): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status);
  }

  @Put(':id')
  @ApiBody({ description: 'Pass Data in Json {"title":"updated title", "description":"updated description", "status":"Completed"}' ,
    schema: { type: 'object', properties: {
      title:{type:'string', example:"update title"},
      description:{type:'string', example:"updated desc"},
      status:{type:'string', example:"Completed"},
    } } 
  }) // Describe the request body
  async updateTask(@Param('id') id: number,@Body('title') title: string,@Body('status') status: string,@Body('description') description: string,@Request() request,): Promise<Task> {

    const headers = request.headers as { authorization?: string };;
    const authorizationHeader = headers.authorization;
  // Check if the Authorization header exists and starts with "Bearer "
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.split('Bearer ')[1];
        return this.taskService.updateTask(id, title,status, description,token);
    } 
    else{
      throw new UnauthorizedException('Token Not Found');
    }
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number, @Request() request): Promise<String> {

    const headers = request.headers as { authorization?: string };;
    const authorizationHeader = headers.authorization;
  // Check if the Authorization header exists and starts with "Bearer "
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.split('Bearer ')[1];
        return this.taskService.deleteTask(id,token);
    } 
    else{
      throw new UnauthorizedException('Token Not Found');
    }
  }

  @Get()
  @ApiQuery({ name: 'userFilter', required: false } ) // Set required to false for optional parameters
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'status', required: false })
 
  async getTasks( @Request() request,@Query('userFilter') userFilter: string,@Query('limit') limit: string = '100',
  @Query('offset') offset: string = '0', @Query('status') status?: TaskStatus):Promise<string | Task[]>  {

    const headers = request.headers as { authorization?: string };;
    const authorizationHeader = headers.authorization;

  // Check if the Authorization header exists and starts with "Bearer "
    if(authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.split('Bearer ')[1];
        let nlimit =parseInt(limit)
        let noff = parseInt(offset)

        let filterUser:User

        if(userFilter != undefined)
        {
            filterUser = await this.taskService.findUser(userFilter)
            if(filterUser == null)
            {
              throw new UnauthorizedException('Filter User Not Correct')
            }
        }
        return this.taskService.getTasks(filterUser?.id,nlimit, noff,status,token);
    } 
    else{
      throw new UnauthorizedException('Token Not Found');

    }
  }
}
