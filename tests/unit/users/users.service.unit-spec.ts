import { Test } from '@nestjs/testing'
import { UsersService } from '../../../src/modules/users/users.service'
import { userStub } from '../../../src/modules/users/stubs'
import { PrismaService } from '../../../src/config/prisma/prisma.service'
import { PrismaMock } from '../../../src/modules/users/__mocks__'
import { UsersRole } from '@prisma/client'
import { CreateUserDto } from '../../../src/modules/users/dto'

describe('UsersService Unit', () => {
    let usersService: UsersService
    let prismaService: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useClass: PrismaMock
                }
            ]
        }).compile()

        usersService = moduleRef.get<UsersService>(UsersService)
        prismaService = moduleRef.get<PrismaService>(PrismaService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('create()', () => {
        it('when create is called then it should call prismaService', async () => {
            const createUserDto: CreateUserDto = {
                email: 'test@test.com',
                password: 'P@sswordTest123!',
                firstName: 'Test',
                lastName: 'Test',
                mobileNumber: '12345678901',
                role: UsersRole.REGULAR,
                locationId: '49182968-da7c-40d7-8321-0229e9c2cb5e'
            }
            const user = await usersService.create(createUserDto)
            expect(prismaService.users.create).toHaveBeenCalled()
            expect(user).toEqual(userStub())
        })
    })

    describe('findOneById()', () => {
        it('when findOneById is called then it should call prismaService', async () => {
            const { id } = userStub()
            const user = await usersService.findOneById(id)
            expect(prismaService.users.findUnique).toHaveBeenCalledWith({
                where: { id }
            })
            expect(user).toEqual(userStub())
        })
    })

    describe('findOneByEmail()', () => {
        it('when findOneByEmail is called then it should call prismaService', async () => {
            const { email } = userStub()
            const user = await usersService.findOneByEmail(email)
            expect(prismaService.users.findUnique).toHaveBeenCalledWith({
                where: { email }
            })
            expect(user).toEqual(userStub())
        })
    })

    describe('updateHashedRefreshToken()', () => {
        it('when updateHashedRefreshToken is called then it should call prismaService', async () => {
            const { id, hashedRefreshToken } = userStub()

            expect(
                await usersService.updateHashedRefreshToken(
                    id,
                    hashedRefreshToken
                )
            ).toBeUndefined()
            expect(prismaService.users.update).toHaveBeenCalled()
        })
    })

    describe('removeHashedRefreshToken()', () => {
        it('when removeHashedRefreshToken is called then it should call prismaService', async () => {
            const { id } = userStub()

            expect(
                await usersService.removeHashedRefreshToken(id)
            ).toBeUndefined()
            expect(prismaService.users.updateMany).toHaveBeenCalledWith({
                where: {
                    id,
                    hashedRefreshToken: {
                        not: null
                    }
                },
                data: {
                    hashedRefreshToken: null
                }
            })
        })
    })

    describe('updateUserRole()', () => {
        it('when updateUserRole is called then it should call prismaService', async () => {
            const { id, role } = userStub()

            const user = await usersService.updateUserRole(id, role)
            expect(prismaService.users.update).toHaveBeenCalledWith({
                where: {
                    id
                },
                data: {
                    role
                }
            })
            expect(user).toEqual(userStub())
        })
    })
})
