import { envVariablesStub } from "../stubs"

export class ConfigServiceMock {
  get(envName: string) {
    return envVariablesStub()[envName]
  }
}
