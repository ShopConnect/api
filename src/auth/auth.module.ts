import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: '931cb8fb-ba1c-4f39-b825-d8443da104f5',
      signOptions: {
        expiresIn: 7 * 24 * 60 * 60
      }
    })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
