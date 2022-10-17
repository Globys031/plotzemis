interface IBuilding {
  id: number,
  userId: number,
  streetId: number,
  plotId: number,
  streetNumber: string,
  postalCode: string,
  type: string,
  areaSize: number,
  floorCount: number,
  year: number,
  price: number,
}

interface IBuildingArr {
  map(arg0: (building: IBuilding) => JSX.Element): import("react").ReactNode;
  [key: number]: IBuilding;
}

export { IBuilding, IBuildingArr };