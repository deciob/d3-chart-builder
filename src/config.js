export const baseConfig = {
  height: 100,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  transitionDuration: 600,
  width: 100,
  xAccessor: d => d.x,
  xScaleType: 'time',
  yAccessor: d => d.y,
  yMax: void 0,
  yScaleType: 'linear',
}

export const barConfig = {
  horizontal: false,
  xScaleType: 'ordinal',
}
