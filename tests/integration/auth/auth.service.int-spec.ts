import { Test } from '@nestjs/testing'
import { AppModule } from '../../../src/app.module'
import { PrismaService } from '../../../src/config/prisma/prisma.service'
import { UsersService } from '../../../src/modules/users/users.service'
import { CreateUserDto } from '../../../src/modules/users/dto'
import { UsersRole } from '@prisma/client'
import { AuthService } from '../../../src/modules/auth/auth.service'
import { SignInAuthDto } from 'src/modules/auth/dto'
import { UnauthorizedException } from '@nestjs/common'
import { randomUUID } from 'crypto'

describe('AuthService Integration', () => {
    let prisma: PrismaService
    let usersService: UsersService
    let authService: AuthService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        prisma = moduleRef.get<PrismaService>(PrismaService)
        usersService = moduleRef.get<UsersService>(UsersService)
        authService = moduleRef.get<AuthService>(AuthService)
    })

    afterEach(async () => {
        await prisma.cleanDatabase()
    })

    describe('signIn()', () => {
        it('given registered user when signin then user should signin', async () => {
            const signUpDto: CreateUserDto = {
                email: 'test@test.com',
                password: 'P@sswordTest123!',
                firstName: 'Test',
                lastName: 'Test',
                mobileNumber: '12345678901',
                role: UsersRole.REGULAR,
                locationId: '49182968-da7c-40d7-8321-0229e9c2cb5e'
            }
            await usersService.create(signUpDto)

            const signInDto: SignInAuthDto = {
                email: signUpDto.email,
                password: signUpDto.password
            }
            const signInTokens = await authService.signIn(signInDto)
            expect(signInTokens.accessType).toBe('Bearer')
            expect(signInTokens).toHaveProperty('accessToken')
            expect(signInTokens).toHaveProperty('refreshToken')
        })

        it('given unregistered user when signin then user should not signin and throws unauthorized', async () => {
            const signInDto: SignInAuthDto = {
                email: 'notexists@test.com',
                password: 'test'
            }
            await authService
                .signIn(signInDto)
                .then((tokens) => expect(tokens).toBeUndefined())
                .catch((err) => {
                    expect(err.status).toBe(401)
                    expect(err).toBeInstanceOf(UnauthorizedException)
                })
        })

        it('given registered user with wrong password when signin then user should not signin and throws unauthorized', async () => {
            const signUpDto: CreateUserDto = {
                email: 'test@test.com',
                password: 'P@sswordTest123!',
                firstName: 'Test',
                lastName: 'Test',
                mobileNumber: '12345678901',
                role: UsersRole.REGULAR,
                locationId: '49182968-da7c-40d7-8321-0229e9c2cb5e'
            }
            await usersService.create(signUpDto)

            const signInDto: SignInAuthDto = {
                email: signUpDto.email,
                password: 'wrong'
            }
            await authService
                .signIn(signInDto)
                .then((tokens) => expect(tokens).toBeUndefined())
                .catch((err) => {
                    expect(err.status).toBe(401)
                    expect(err).toBeInstanceOf(UnauthorizedException)
                })
        })
    })

    describe('signUp()', () => {
        it('given valid input when signup then user should signup', async () => {
            const signUpDto: CreateUserDto = {
                email: 'test@test.com',
                password: 'P@sswordTest123!',
                firstName: 'Test',
                lastName: 'Test',
                mobileNumber: '12345678901',
                role: UsersRole.REGULAR,
                locationId: '49182968-da7c-40d7-8321-0229e9c2cb5e'
            }
            const signUptTokens = await authService.signUp(signUpDto)
            expect(signUptTokens.accessType).toBe('Bearer')
            expect(signUptTokens).toHaveProperty('accessToken')
            expect(signUptTokens).toHaveProperty('refreshToken')
        })

        it('given already registered user when signup with same email then user should not signup and throws unauthorized', async () => {
            const signUpDto: CreateUserDto = {
                email: 'test@test.com',
                password: 'P@sswordTest123!',
                firstName: 'Test',
                lastName: 'Test',
                mobileNumber: '12345678901',
                role: UsersRole.REGULAR,
                locationId: '49182968-da7c-40d7-8321-0229e9c2cb5e'
            }
            await usersService.create(signUpDto)

            await authService
                .signUp(signUpDto)
                .then((tokens) => expect(tokens).toBeUndefined())
                .catch((err) => {
                    expect(err.status).toBe(401)
                    expect(err).toBeInstanceOf(UnauthorizedException)
                })
        })
    })

    describe('signOut()', () => {
        it('given user signout when signout then user should signout', async () => {
            const signUpDto: CreateUserDto = {
                email: 'test@test.com',
                password: 'P@sswordTest123!',
                firstName: 'Test',
                lastName: 'Test',
                mobileNumber: '12345678901',
                role: UsersRole.REGULAR,
                locationId: '49182968-da7c-40d7-8321-0229e9c2cb5e'
            }
            await authService.signUp(signUpDto)
            const user = await usersService.findOneByEmail(signUpDto.email)
            expect(user.hashedRefreshToken).not.toBeNull()

            await authService.signOut(user.id)

            const userAfterLogout = await usersService.findOneById(user.id)
            expect(userAfterLogout.hashedRefreshToken).toBeNull()
        })

        it('given already registered user when signup with same email then user should not signup and throws unauthorized', async () => {
            const signUpDto: CreateUserDto = {
                email: 'test@test.com',
                password: 'P@sswordTest123!',
                firstName: 'Test',
                lastName: 'Test',
                mobileNumber: '12345678901',
                role: UsersRole.REGULAR,
                locationId: '49182968-da7c-40d7-8321-0229e9c2cb5e'
            }
            await usersService.create(signUpDto)

            await authService
                .signUp(signUpDto)
                .then((tokens) => expect(tokens).toBeUndefined())
                .catch((err) => {
                    expect(err.status).toBe(401)
                    expect(err).toBeInstanceOf(UnauthorizedException)
                })
        })
    })

    describe('refreshTokens()', () => {
        it('given already signin user when refresh tokens then user should refresh tokens', async () => {
            const signUpDto: CreateUserDto = {
                email: 'test@test.com',
                password: 'P@sswordTest123!',
                firstName: 'Test',
                lastName: 'Test',
                mobileNumber: '12345678901',
                role: UsersRole.REGULAR,
                locationId: '49182968-da7c-40d7-8321-0229e9c2cb5e'
            }
            const signUpTokens = await authService.signUp(signUpDto)

            const user = await usersService.findOneByEmail(signUpDto.email)

            const tokens = await authService.refreshTokens(
                user.id,
                signUpTokens.refreshToken
            )
            expect(tokens.accessType).toBe('Bearer')
            expect(tokens).toHaveProperty('accessToken')
            expect(tokens).toHaveProperty('refreshToken')
        })

        it('given already signin user with wrong refresh token when refresh tokens then user should not refresh tokens and throws unauthorized', async () => {
            const signUpDto: CreateUserDto = {
                email: 'test@test.com',
                password: 'P@sswordTest123!',
                firstName: 'Test',
                lastName: 'Test',
                mobileNumber: '12345678901',
                role: UsersRole.REGULAR,
                locationId: '49182968-da7c-40d7-8321-0229e9c2cb5e'
            }
            await authService.signUp(signUpDto)

            const user = await usersService.findOneByEmail(signUpDto.email)

            await authService
                .refreshTokens(user.id, 'wrong')
                .then((tokens) => expect(tokens).toBeUndefined())
                .catch((err) => {
                    expect(err.status).toBe(401)
                    expect(err).toBeInstanceOf(UnauthorizedException)
                })
        })

        it('given not registered user when refresh tokens then user should not refresh tokens and throws unauthorized', async () => {
            await authService
                .refreshTokens(randomUUID(), 'test')
                .then((tokens) => expect(tokens).toBeUndefined())
                .catch((err) => {
                    expect(err.status).toBe(401)
                    expect(err).toBeInstanceOf(UnauthorizedException)
                })
        })
    })
})
