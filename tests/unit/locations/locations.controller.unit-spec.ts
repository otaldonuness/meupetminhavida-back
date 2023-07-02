import { Test, TestingModule } from "@nestjs/testing";
import { LocationsController } from "../../../src/modules/locations/locations.controller";
import { LocationsService } from "../../../src/modules/locations/locations.service";

describe("LocationsController", () => {
  let controller: LocationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [LocationsService],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
