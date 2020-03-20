import { Injectable } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { UserToken } from './entities/user-token.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class DatabaseService {
    private readonly _userRepository: UserRepository;

    private readonly _userTokenRepository: Repository<UserToken>;

    constructor(
        private readonly connection: Connection
    ) {
        this._userRepository = this.connection.getCustomRepository(UserRepository);
        this._userTokenRepository = this.connection.getRepository(UserToken);
    }
    
    public get userRepository(): UserRepository {
        return this._userRepository;
    }
    
    public get userTokenRepository(): Repository<UserToken> {
        return this._userTokenRepository;
    }
}
