import { Controller, Body, Post, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from '../_dtos/register-request.dto';
import { RegisterResponseDto } from '../_dtos/register-response.dto';
import { LoginRequestDto } from 'src/_dtos/login-request.dto';
import { LoginResponseDto } from 'src/_dtos/login-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/database/entities/user.entity';
import { Request } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    @ApiBadRequestResponse({ description: 'Username is already in use' })
    @ApiOkResponse({ description: 'User is registered' })
    public register(@Body() registerRequest: RegisterRequestDto): Promise<RegisterResponseDto> {
        return this.authService.register(registerRequest);
    }

    @Post('login')
    public login(@Body() loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
        return this.authService.login(loginRequest);
    }
    
    @Get('logout')
    @UseGuards(JwtAuthGuard)
    public async logout(@Req() request: Request): Promise<void> {
        const user = <User>request.user;
        if (!user) {
            return;
        }

        if (!request.headers.authorization) {
            return;
        }

        const token = request.headers.authorization.split(' ', 2)[1];
        if (!token) {
            return;
        }

        await this.authService.logout(user, token);
    }
}
