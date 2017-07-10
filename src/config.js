export const baseConfig = {
  height: 100,
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
  xScaleType: 'time',
  yAccessor: d => d.y,
  yAxis: undefined,
  yAxisShow: true,
  yDomain: undefined,
  yScaleType: 'linear',
};

export const barConfig = {
  horizontal: false,
  xScaleType: 'ordinal',
};
