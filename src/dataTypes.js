// @flow


export type BarConfig = {|
  divergin: boolean,
  quantitativeScaleType: string,
  fill: ?string,
  schemeCategory: ?string[],
  // stack: void | (any) => any,
  stackedKeys: string[],
|};

export type Layouts =
  | 'horizontal'
  | 'vertical'
  | 'verticalStacked';

export type BaseConfig = {|
  brushShow: boolean,
  fixedAxis: boolean,
  height: number,
  layout: Layouts,
  margin: {
    top: number,
    right: number,
    bottom: number,
    left: number,
  },
  transitionDuration: number,
  transitionStepSeed: number,
  width: number,
  xAccessor: (any) => any, /* D3GenericDataAccessor */
  xAxis: void | (any) => any,
  xAxisShow: boolean,
  xDomain: void | mixed[],
  yAccessor: (any) => any, /* D3GenericDataAccessor */
  yAxis: void | (any) => any,
  yAxisShow: boolean,
  yDomain: void | mixed[],
|};

export type D3GenericDataAccessor =
  ({[string]: number | string}) => number | string

export type DerivedConfig = {|
  height: number,
  transition: (any) => any,
  transitionDelay: ({[key: string]: mixed}, number) => number,
  width: number,
  xDomain: mixed[],
  xRange: [number, number],
  xScale: (any) => any,
  yRange: [number, number],
  yDomain: mixed[],
  yScale: (any) => any,
  zScale: void | (any) => any,
|};

export type State = {|
  brushExtent: ?[number, number],
  xDomain: ?mixed[],
  yDomain: ?mixed[],
|};

export type Store = {|
  dispatch: (string) => any,
  getState: () => State,
  subscribe: (string, (any) => any) => any,
|};
