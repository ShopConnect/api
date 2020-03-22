import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/database.service';
import { IdentificationCard } from '../database/entities/identification-card.entity';
import { PatchUserRequestDto } from '../_dtos/patch-user-request.dto';
import { RegisterDeviceRequestDto } from '../_dtos/register-device-request.dto';
import { RegisterDeviceResponseDto } from '../_dtos/register-device-response.dto';
import { Repository } from 'typeorm';
import { UploadedFileModel } from '../_models/uploaded-file.model';
import { User } from '../database/entities/user.entity';
import { UserDevice } from '../database/entities/user-device.entity';
import { UserRepository } from '../database/repositories/user.repository';
import { Order } from 'src/database/entities/order.entity';

@Injectable()
export class UserService {
  private readonly userRepository: UserRepository;

  private readonly userDeviceRepository: Repository<UserDevice>;

  private readonly identificationCardRepository: Repository<IdentificationCard>;

  private readonly orderRepository: Repository<Order>

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly authService: AuthService,
  ) {
    this.userRepository = this.databaseService.userRepository;
    this.userDeviceRepository = this.databaseService.userDeviceRepository;
    this.identificationCardRepository = this.databaseService.identificationCardRepository;
    this.orderRepository = this.databaseService.orderRepository;
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
    });
  }

  public async patchUser(user: User, patchUserRequestDto: PatchUserRequestDto): Promise<boolean> {
    user = await this.userRepository.findOne({
      where: {
        id: user.id
      }
    });

    if (patchUserRequestDto.email) {
      user.email = patchUserRequestDto.email;
    }

    if (patchUserRequestDto.password) {
      let passwordHash = await this.authService.generatePasswordHash(patchUserRequestDto.password);
      user.password = passwordHash.hash;
      user.salt = passwordHash.salt;
      user.iterations = passwordHash.iterations;
    }

    if (patchUserRequestDto.firstName) {
      user.firstName = patchUserRequestDto.firstName;
    }

    if (patchUserRequestDto.lastName) {
      user.lastName = patchUserRequestDto.lastName;
    }

    if (patchUserRequestDto.birthday) {
      user.birthday = patchUserRequestDto.birthday;
    }

    if (patchUserRequestDto.country) {
      user.country = patchUserRequestDto.country;
    }

    if (patchUserRequestDto.city) {
      user.city = patchUserRequestDto.city;
    }

    if (patchUserRequestDto.zipCode) {
      user.zipCode = patchUserRequestDto.zipCode;
    }

    if (patchUserRequestDto.street) {
      user.street = patchUserRequestDto.street;
    }

    if (patchUserRequestDto.houseNumber) {
      user.houseNumber = patchUserRequestDto.houseNumber;
    }

    if (patchUserRequestDto.payPalHandle) {
      user.payPalHandle = patchUserRequestDto.payPalHandle;
    }

    if (patchUserRequestDto.iban) {
      user.iban = patchUserRequestDto.iban;
    }

    if (patchUserRequestDto.telephoneNumber) {
      user.telephoneNumber = patchUserRequestDto.telephoneNumber;
    }

    return (await this.userRepository.update({ id: user.id }, user)).affected > 0;
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

  public async registerDevice(requestUser: User, registerDeviceRequestDto: RegisterDeviceRequestDto): Promise<RegisterDeviceResponseDto> {
    let userDevice = await this.userDeviceRepository.save(<UserDevice>{
      user: requestUser,
      token: registerDeviceRequestDto.token
    });

    return new RegisterDeviceResponseDto(userDevice != null);
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

  public async getOrders(owner: User) {
    return this.orderRepository.find({ where: { owner: owner } });
  }
}
