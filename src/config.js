// @flow

export type D3GenericDataAccessor =
  ({[string]: number | string}) => number | string

export type State = {|
  transition: (any) => any,
  transitionDelay: ({[key: string]: mixed}, number) => number,
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

export const baseConfig: BaseConfig = {
  fixedAxis: true,
  height: 100,
  layout: 'vertical',
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  transitionDuration: 600,
  transitionStepSeed: 40,
  width: 100,
  xAccessor: d => d.x,
  xAxis: undefined,
  xAxisShow: true,
  xDomain: undefined,
  yAccessor: d => d.y,
  yAxis: undefined,
  yAxisShow: true,
  yDomain: undefined,
};


export type BarConfig = {|
  divergin: boolean,
  quantitativeScaleType: string,
  stack: void | (any) => any,
  stackedKeys: ?string[],
|};

export const barConfig: BarConfig = {
  divergin: false,
  quantitativeScaleType: 'linear',
  stack: undefined,
  stackedKeys: undefined,
};
