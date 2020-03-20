import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/repositories/user.repository';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly userRepository: UserRepository;

  constructor(
    private readonly databaseService: DatabaseService,
  ) {
    this.userRepository = this.databaseService.userRepository;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let user = context.switchToHttp().getRequest().user;
    let dbUser = await this.userRepository.findOne({
      where: {
        user: user
      }
    });

    return dbUser != null && dbUser.isAdmin;
  }
}