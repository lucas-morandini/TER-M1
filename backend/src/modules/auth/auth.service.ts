import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ){}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<UserDto | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.pwd))) {
      const userDto = plainToInstance(UserDto, user);
      return userDto;
    }
    return null;
  }

  async login(user: any) {
    const payload = { id: user.id, email: user.email, username: user.username, name: user.name, 
      first_name: user.first_name, birth_date: user.birth_date, tel: user.tel, sex: user.sex, solde: user.solde };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateTokenByEmail(email : string): Promise<string> {
    return this.jwtService.sign({ email }, {expiresIn: '1h'});
  }

  async decodeEmailToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
