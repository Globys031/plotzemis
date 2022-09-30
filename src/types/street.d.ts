interface IStreet {
  id: number,
  userId: number,
  name: string,
  city: string,
  district: string,
  postalCode: string,
  addressCount: number,
  streetLength: string,
}

interface IStreetArr {
  map(arg0: (street: IStreet) => JSX.Element): import("react").ReactNode;
  [key: number]: IStreet;
}

export { IStreet, IStreetArr };