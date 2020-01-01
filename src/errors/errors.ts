export class InvalidSurfZoneError extends Error {
  constructor(id: string) {
    super(`invalid SurfZone id : ${id}`);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidSurfSpotError extends Error {
  constructor(id: string) {
    super(`invalid SurfSpot id : ${id}`);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class DuplicateEntryError extends Error {
  constructor() {
    super('entry already exist');
  }
}

// tslint:disable-next-line: max-classes-per-file
export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
