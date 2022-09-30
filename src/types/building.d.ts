interface IBuilding {
  id: number,
  userId: number,
  streetName: string,
  lotNo: number,
  streetNumber: string,
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