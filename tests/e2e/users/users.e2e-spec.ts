import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { UsersRole } from "@prisma/client"
import { HttpStatus } from "@nestjs/common"
import * as pactum from "pactum"
import { randomUUID } from "crypto"
import { PrismaService } from "../../../src/config/prisma/prisma.service"
import { AppModule } from "../../../src/app.module"
import { SignInAuthDto } from "../../../src/modules/auth/dto"
import {
  CreateUserDto,
  UpdateUserRoleDto
} from "../../../src/modules/users/dto"
import { UsersService } from "../../../src/modules/users/users.service"
import { AuthService } from "../../../src/modules/auth/auth.service"

describe("/users", () => {
  let app: INestApplication
  let prisma: PrismaService
  let usersService: UsersService
  let authService: AuthService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    const PORT = 3001
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true // Only DTO fields are allowed.
      })
    )
    await app.init()
    await app.listen(PORT)

    usersService = app.get<UsersService>(UsersService)
    authService = app.get<AuthService>(AuthService)
    prisma = app.get<PrismaService>(PrismaService)

    pactum.request.setBaseUrl(`http://localhost:${PORT}`)
  })

  afterEach(async () => {
    await prisma.cleanDatabase()
  })

  afterAll(async () => {
    await app.close()
  })

  describe("PUT /update-role/:id", () => {
    const endpoint = "/users/update-role"

    it("given logged ADMIN user when update user role then update user role to REGULAR", async () => {
      const signUpDto: CreateUserDto = {
        email: "test@test.com",
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.ADMIN,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e"
      }
      const createdUser = await usersService.create(signUpDto)
      const signInDto: SignInAuthDto = {
        email: signUpDto.email,
        password: signUpDto.password
      }
      const { accessToken } = await authService.signIn(signInDto)
      const updateUserRoleDto: UpdateUserRoleDto = {
        newRole: UsersRole.REGULAR
      }

      const { json } = await pactum
        .spec()
        .put(`${endpoint}/${createdUser.id}`)
        .withJson(updateUserRoleDto)
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.OK)

      expect(json.role).toBe(UsersRole.REGULAR)
      expect(json.role).not.toBe(createdUser.role)
      expect(json.hashedPassword).toBeUndefined()
      expect(json.hashedRefreshToken).toBeUndefined()
    })

    it("given non ADMIN user when update user role then do not update user role and throw forbidden", async () => {
      const signUpDto: CreateUserDto = {
        email: "test@test.com",
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e"
      }
      const createdUser = await usersService.create(signUpDto)
      const signInDto: SignInAuthDto = {
        email: signUpDto.email,
        password: signUpDto.password
      }
      const { accessToken } = await authService.signIn(signInDto)
      const updateUserRoleDto: UpdateUserRoleDto = {
        newRole: UsersRole.ADMIN
      }

      return pactum
        .spec()
        .put(`${endpoint}/${createdUser.id}`)
        .withJson(updateUserRoleDto)
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it("given ADMIN user with non existing user when update user role then do not update user role and throw not found", async () => {
      const signUpDto: CreateUserDto = {
        email: "test@test.com",
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.ADMIN,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e"
      }
      await usersService.create(signUpDto)
      const signInDto: SignInAuthDto = {
        email: signUpDto.email,
        password: signUpDto.password
      }
      const { accessToken } = await authService.signIn(signInDto)
      const updateUserRoleDto: UpdateUserRoleDto = {
        newRole: UsersRole.ONG
      }

      return pactum
        .spec()
        .put(`${endpoint}/${randomUUID()}`)
        .withJson(updateUserRoleDto)
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.NOT_FOUND)
    })
  })
})
