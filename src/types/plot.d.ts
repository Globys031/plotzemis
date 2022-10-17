interface IPlot {
  id: number,
  userId: number,
  streetId: number,
  lotNo: number,
  areaSize: number,
  purpose: string,
  type: string,
}

interface IPlotArr {
  map(arg0: (plot: IPlot) => JSX.Element): import("react").ReactNode;
  [key: number]: IPlot;
}

export { IPlot, IPlotArr };
