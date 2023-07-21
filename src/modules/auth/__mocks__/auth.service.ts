import { tokensStub } from '../stubs'

export const AuthService = jest.fn().mockReturnValue({
    signIn: jest.fn().mockResolvedValue(tokensStub()),
    signUp: jest.fn().mockResolvedValue(tokensStub()),
    signOut: jest.fn().mockResolvedValue(Promise.resolve()),
    refreshTokens: jest.fn().mockResolvedValue(tokensStub())
})
