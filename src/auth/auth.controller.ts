import { Controller, Body, Post, Get, UseGuards, Req } from '@nestjs/common';
import {
    ApiTags,
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiUnauthorizedResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from '../_dtos/register-request.dto';
import { RegisterResponseDto } from '../_dtos/register-response.dto';
import { LoginRequestDto } from '../_dtos/login-request.dto';
import { LoginResponseDto } from '../_dtos/login-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';
import { Request } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    @ApiBadRequestResponse({ description: 'Username is already in use' })
    @ApiCreatedResponse({ description: 'User is registered', type: RegisterResponseDto })
    public register(@Body() registerRequest: RegisterRequestDto): Promise<RegisterResponseDto> {
        return this.authService.register(registerRequest);
    }

    @Post('login')
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiUnauthorizedResponse({ description: 'User is deactivated' })
    @ApiUnauthorizedResponse({ description: 'Wrong password' })
    @ApiCreatedResponse({ description: 'User successfully logged in', type: LoginResponseDto })
    public login(@Body() loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
        return this.authService.login(loginRequest);
    }
    
    @Get('logout')
    @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
    @ApiOkResponse({ description: 'User successfully logged out' })
    @ApiBearerAuth()
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

    @Get('validate')
    @ApiUnauthorizedResponse({ description: 'Token is not valid' })
    @ApiOkResponse({ description: 'Token is valid' })
    @ApiBearerAuth()
    public async validate(@Req() request: Request): Promise<boolean> {
        if (!request.headers.authorization) {
            return false;
        }

        const token = request.headers.authorization.split(' ', 2)[1];
        if (!token) {
            return false;
        }

        return await this.authService.validateToken(token);
    }

    @Post('refresh')
    @ApiUnauthorizedResponse({ description: 'Token is not valid' })
    @ApiCreatedResponse({ description: 'Token generated' })
    @ApiBearerAuth()
    public async refresh(@Req() request: Request): Promise<LoginResponseDto> {
        const user = <User>request.user;
        if (!user) {
            return;
        }

        return await this.authService.refreshToken(user);
    }
}
