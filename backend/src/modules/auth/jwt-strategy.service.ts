// src/auth/jwt-strategy.service.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY')!,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, username: payload.username, email: payload.email,
      name: payload.name, first_name: payload.first_name, birth_date: payload.birth_date,
      tel: payload.tel, sex: payload.sex, solde: payload.solde };
  }
}
