import { Injectable } from "@nestjs/common";
import { CreateLocationDto } from "./dto/get-locations-by-state.dto";
import { UpdateLocationDto } from "./dto/get-location.dto";

@Injectable()
export class LocationsService {
  create(createLocationDto: CreateLocationDto) {
    return "This action adds a new location";
  }

  findAll() {
    return `This action returns all locations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
