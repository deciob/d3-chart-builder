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
  xAxis: void 0,
  xAxisShow: true,
  xDomain: void 0,
  xScaleType: 'time',
  yAccessor: d => d.y,
  yAxis: void 0,
  yAxisShow: true,
  yDomain: void 0,
  yScaleType: 'linear',
}

export const barConfig = {
  horizontal: false,
  xScaleType: 'ordinal',
}
