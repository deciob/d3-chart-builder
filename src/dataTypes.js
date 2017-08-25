// @flow

export type D3GenericDataAccessor =
  ({[string]: number | string}) => number | string

export type DerivedConfig = {|
  height: number,
  transition: (any) => any,
  transitionDelay: ({[key: string]: mixed}, number) => number,
  width: number,
  xDomain: [number, number],
  xRange: [number, number],
  xScale: (any) => any,
  yRange: [number, number],
  yDomain: [number, number],
  yScale: (any) => any,
  zScale: void | (any) => any,
|};

export type Layouts =
  | 'horizontal'
  | 'vertical'
  | 'verticalStacked';

export type BaseConfig = {|
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
  xDomain: void | [number, number],
  yAccessor: (any) => any, /* D3GenericDataAccessor */
  yAxis: void | (any) => any,
  yAxisShow: boolean,
  yDomain: void | [number, number],
|};

export type BarConfig = {|
  divergin: boolean,
  quantitativeScaleType: string,
  schemeCategory: ?string[],
  // stack: void | (any) => any,
  stackedKeys: string[],
|};
