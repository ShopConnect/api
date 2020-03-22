import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';

import { AuthService } from './auth/auth.service';
import { DatabaseService } from './database/database.service';
import { LogEntry } from './database/entities/log-entry.entity';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logEntryRepository: Repository<LogEntry>;
  private readonly logger: Logger;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly authService: AuthService
  ) {
    this.logEntryRepository = this.databaseService.logEntryRepository;
    this.logger = new Logger("ShopConnect", true);
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    let request: Request = context.switchToHttp().getRequest();
    let token = "";
    let ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    if (request.headers.authorization) {
      token = request.headers.authorization.split(' ')[1];
    }

    let logEntry = await this.logEntryRepository.save(<LogEntry>{
      ip: ip,
      requestMethod: request.method,
      path: request.url,
      timestamp: new Date(),
      authenticatedUser: await this.authService.getUserByToken(token)
    });

    this.logger.verbose(`Logged request from ${logEntry.ip} (Authenticated as: ${logEntry.authenticatedUser?.id || "not logged in"}) to ${logEntry.requestMethod} ${logEntry.path} at ${logEntry.timestamp}`);

    return next.handle();
  }
}
