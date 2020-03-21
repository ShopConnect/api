import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../database/entities/user.entity';
import { DatabaseService } from '../database/database.service';
import { UserRepository } from '../database/repositories/user.repository';
import { UserToken } from '../database/entities/user-token.entity';
import { DeleteResult, Repository } from 'typeorm';
import { IdentificationCard } from '../database/entities/identification-card.entity';
import { UploadedFileModel } from '../_models/uploaded-file.model';

@Injectable()
export class UserService {
  private readonly userRepository: UserRepository;

  private readonly userTokenRepository: Repository<UserToken>;

  private readonly identificationCardRepository: Repository<IdentificationCard>;

  constructor(
    private readonly databaseService: DatabaseService,
  ) {
    this.userRepository = this.databaseService.userRepository;
    this.userTokenRepository = this.databaseService.userTokenRepository;
    this.identificationCardRepository = this.databaseService.identificationCardRepository;
  }

  public getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public getUser(jwtUser: User, relations: string[] = []): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id: jwtUser.id
      },
      relations: relations
    })
  }

  public async postIdFoto(jwtUser: User, files: UploadedFileModel[]): Promise<boolean> {
    let identificationCard = await this.identificationCardRepository.findOne({
      where: {
        user: {
          id: jwtUser.id
        }
      },
      relations: [
        "user"
      ]
    });

    if (identificationCard) {
      throw new BadRequestException("User already has an identification card added.")
    }

    identificationCard = await this.identificationCardRepository.create({
      user: jwtUser,
      fotoBlobs: JSON.stringify(files.map(file => file.buffer.toString('base64')))
    });

    return await this.identificationCardRepository.save(identificationCard) != null;
  }

  public async deleteIdData(jwtUser: User): Promise<boolean> {
    let identificationCard = await this.identificationCardRepository.findOne({
      where: {
        user: {
          id: jwtUser.id
        }
      },
      relations: [
        "user"
      ]
    });

    if (!identificationCard) {
      throw new NotFoundException("User doesn't have a registered identification card.")
    }

    await this.userRepository.update({
      id: jwtUser.id
    }, {
      identificationCard: null
    });

    return (await this.identificationCardRepository.delete({ id: identificationCard.id })).affected > 0;
  }
}
