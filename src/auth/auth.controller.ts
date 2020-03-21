import { Controller, Body, Post } from '@nestjs/common';
import { ApiTags, ApiForbiddenResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from '../_dtos/register-request.dto';
import { RegisterResponseDto } from '../_dtos/register-response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    @ApiBadRequestResponse({ description: 'Username is already in use' })
    public register(@Body() registerRequest: RegisterRequestDto): Promise<RegisterResponseDto> {
        return this.authService.register(registerRequest);
    }
}
