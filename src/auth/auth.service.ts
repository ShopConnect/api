import * as crypto from 'crypto';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserRepository } from 'src/database/repositories/user.repository';
import { Repository } from 'typeorm';
import { UserToken } from '../database/entities/user-token.entity';
import { DatabaseService } from '../database/database.service';
import { LoginRequestDto } from '../_dtos/login-request.dto';
import { User } from '../database/entities/user.entity';
import { PasswordHashModel } from '../_models/password-hash.model';
import { RegisterRequestDto } from '../_dtos/register-request.dto';
import { LoginResponseDto } from '../_dtos/login-response.dto';
import { RegisterResponseDto } from 'src/_dtos/register-response.dto';

@Injectable()
export class AuthService {
  /**
   * Amount of bytes used for the hashed password
   */
  private static readonly _hashBytes = 128;

  /**
   * Amount of bytes used for the hashed passwords salt
   */
  private static readonly _saltBytes = 24;

  /**
   * Maximum amount of iterations used for hashing a password.
   * The used value is a randomized value between 250 and this value to ensure a pseudo random security machanism.
   * This makes brute forcing a password significant harder, because it gives you a range of 7500000 values to brute force (at least 4 alphanumeric chars * 750 iteration possibilities), when the password and hash got leaked.
   * If a brute force attack is performed on the frontend the range of possibilities is only 10000, because the database knows the required iteration count.
   */
  private static readonly _iterationCount = 1000;

  private readonly userRepository: UserRepository;

  private readonly userTokenRepository: Repository<UserToken>;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {
    this.userRepository = this.databaseService.userRepository;
    this.userTokenRepository = this.databaseService.userTokenRepository;
  }

  public async register(registerRequest: RegisterRequestDto): Promise<RegisterResponseDto> {
    let doesExist = await this.userRepository.doesExistAsync(registerRequest.email);
    if (doesExist) {
      throw new BadRequestException("Username is already in use");
    }

    let passwordHash = await this.generatePasswordHash(registerRequest.password);
    let result = await this.userRepository.createAsync(registerRequest.email, passwordHash);

    return new RegisterResponseDto(result != null);
  }

  public async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    let user = await this.userRepository.getByEmailAsync(loginRequest.email);

    if (!user) {
      throw new NotFoundException();
    }

    if (user.isDeactivated) {
      throw new UnauthorizedException("User is deactivated");
    }

    let hasAccess = await this.checkEquals(user, loginRequest.password);
    if (!hasAccess) {
      throw new UnauthorizedException("Wrong password");
    }

    const tokenIssueTimestamp = new Date();
    const token = await this.generateTokenForUser(user, tokenIssueTimestamp);
    const userToken = this.userTokenRepository.create({
      user: user,
      token: token,
      isValid: true,
      createdOn: tokenIssueTimestamp
    });

    this.userTokenRepository.save(userToken);

    this.userRepository.update({
      id: user.id
    }, {
      lastLogin: tokenIssueTimestamp
    });

    return new LoginResponseDto(token);
  }

  public async logout(user: User, token: string): Promise<void> {
    const tokenEntity = await this.userTokenRepository.findOne({
      where: {
        token: token,
        user: user
      }
    });

    if (!tokenEntity) {
      throw new UnauthorizedException();
    }

    tokenEntity.isValid = false;
    await this.userTokenRepository.save(tokenEntity);
  }

  public async validateUser(payload: JwtPayload): Promise<User> {
    let user = await this.userRepository.getByEmailAsync(payload.email, [
      "tokens"
    ]);

    if (!user) {
      return null;
    }

    if (!(user.id == payload.id && user.email == payload.email && user.createdOn.getTime() == payload.createdOn)) {
      return null;
    }

    return user;
  }

  public generatePasswordHash(password: string): Promise<PasswordHashModel> {
    let salt = Buffer.from(crypto.randomBytes(AuthService._saltBytes)).toString("base64");

    let percentage = Math.random();

    const iterations = Number.parseInt(Math.round(this.lerp(250, AuthService._iterationCount, percentage)).toFixed(0));

    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, iterations, AuthService._hashBytes, "sha512", (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        let hash = Buffer.from(derivedKey).toString("base64");
        let passwordHash = new PasswordHashModel(hash, salt, iterations);

        resolve(passwordHash);
      });
    });
  }

  private clamp(min: number, max: number, value: number): number {
    if (value < min) {
      return min;
    }

    if (value > max) {
      return max;
    }

    return value;
  }

  private lerp(min: number, max: number, value: number): number {
    value = this.clamp(0, 1, value);
    return (1 - value) * min + value * max;
  }

  private generateTokenForUser(user: User, tokenIssueTimestamp: Date): Promise<string> {
    const jwtPayload: JwtPayload = { id: user.id, email: user.email, createdOn: user.createdOn.getTime(), timestamp: tokenIssueTimestamp.getTime() };

    return this.jwtService.signAsync(jwtPayload);
  }

  public checkEquals(databaseUser: User, password: string): Promise<boolean> {
    if (!password) {
      return new Promise((resolve) => resolve(false));
    }

    let originalHash = Buffer.from(databaseUser.password, "base64");

    return new Promise((resolve) => {
      crypto.pbkdf2(password, databaseUser.salt, databaseUser.iterations, originalHash.length, "sha512", (error, derivedKey) => {
        if (error) {
          resolve(false);
          return;
        }

        let testHash = Buffer.from(derivedKey);

        let differences = originalHash.length ^ testHash.length;

        for (let position = 0; position < Math.min(originalHash.length, testHash.length); position++) {
          differences |= (originalHash[position] ^ testHash[position]);
        }

        let passwordMatches = (differences == 0);
        if (passwordMatches) {
          resolve(true);
          return;
        }

        resolve(false);
      });
    })
  }
}
