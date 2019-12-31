export class InvalidSurfZoneError extends Error {
  constructor(id: string) {
    super(`invalid SurfZone id : ${id}`);
  }
}
