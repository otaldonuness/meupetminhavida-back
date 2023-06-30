export class Location {
  private _id: string;
  private _city: string;
  private _state: string;
  constructor(id: string, city: string, state: string) {
    this._id = id;
    this._city = city;
    this._state = state;
  }

  get id(): string {
    return this._id;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }
}
