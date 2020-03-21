import * as cats from 'cat-ascii-faces';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
        message: 'It works!',
        cat: cats()
    };
  }
}
