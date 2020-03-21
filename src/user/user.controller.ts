import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller, Delete,
  Get,
  Param,
  Post,
  Req, UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { UploadedFileModel } from '../_models/uploaded-file.model';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Get('')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('@me')
  @UseGuards(JwtAuthGuard)
  public async getMe(@Req() req: Request) {
    const requestUser = <User>req.user;
    return this.userService.getUser(requestUser);
  }

  @Post('@me/id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiImplicitFile({ name: 'files', description: 'image of id', required: true })
  public postMyIdFoto(@Req() req: Request, @UploadedFiles() files: UploadedFileModel[]) {
    const requestUser = <User>req.user;

    if (!files) {
      throw new BadRequestException('Image missing');
    }

    if (files.some(file => file.mimetype != "image/jpeg" && file.mimetype != "image/jpg" && file.mimetype != "image/png")) {
      throw new BadRequestException("Invalid file type");
    }

    return this.userService.postIdFoto(requestUser, files);
  }

  @Delete('@me/id')
  @UseGuards(JwtAuthGuard)
  public deleteMyId(@Req() req: Request) {
    const requestUser = <User>req.user;

    return this.userService.deleteIdData(requestUser);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public getById(@Param('id') id: number): Promise<User> {
    return this.userService.getUser(<User>{ id: id });
  }
}
