import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
//TODO: inject this into auth service and into user service, hash password as part of user module...
//rename properties in crud dtos to reflect plainTextPassword
@Injectable()
export class HashingService {
  async hash(text: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(text, salt);
    return hashedPassword;
  }

  async verify(plainText: string, hashedText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashedText);
  }
}

//TODO create user controller for CREATE(POST), maybe even for other crud opeartions if auth pipeline allows it
