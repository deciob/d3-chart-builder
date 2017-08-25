// @flow

import type {
  BarConfig,
  BaseConfig,
} from './dataTypes';

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

export const barConfig: BarConfig = {
  divergin: false,
  quantitativeScaleType: 'linear',
  schemeCategory: undefined,
  // stack: undefined,
  stackedKeys: [],
};


// ERRORS

export function ConfigError(message: string) {
  this.name = 'ConfigError';
  this.message = message || 'Something is wrong with the config';
  this.stack = (new Error()).stack;
}

ConfigError.prototype = Object.create(Error.prototype);
ConfigError.prototype.constructor = ConfigError;
