import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { JwtPayload } from '../types'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh'
) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
        const refreshToken = req
            .get('authorization')
            .replace('Bearer', '')
            .trim()
        return {
            ...payload,
            refreshToken
        }
    }
}
