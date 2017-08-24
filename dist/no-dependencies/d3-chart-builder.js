(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3-axis'), require('d3-array'), require('d3-selection'), require('d3-scale'), require('d3-shape'), require('d3-transition'), require('d3-collection')) :
	typeof define === 'function' && define.amd ? define(['d3-axis', 'd3-array', 'd3-selection', 'd3-scale', 'd3-shape', 'd3-transition', 'd3-collection'], factory) :
	(global.d3 = factory(global.d3,global.d3,global.d3,global.d3,global.d3,global.d3,global.d3));
}(this, (function (d3Axis,d3Array,d3Selection,d3Scale,d3Shape,d3Transition,d3Collection) { 'use strict';

//      


var baseConfig = {
  fixedAxis: true,
  height: 100,
  layout: 'vertical',
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  transitionDuration: 600,
  transitionStepSeed: 40,
  width: 100,
  xAccessor: function xAccessor(d) {
    return d.x;
  },
  xAxis: undefined,
  xAxisShow: true,
  xDomain: undefined,
  yAccessor: function yAccessor(d) {
    return d.y;
  },
  yAxis: undefined,
  yAxisShow: true,
  yDomain: undefined
};

var barConfig = {
  divergin: false,
  quantitativeScaleType: 'linear',
  schemeCategory: undefined,
  // stack: undefined,
  stackedKeys: []
};

// ERRORS

function ConfigError(message) {
  this.name = 'ConfigError';
  this.message = message || 'Something is wrong with the config';
  this.stack = new Error().stack;
}

ConfigError.prototype = Object.create(Error.prototype);
ConfigError.prototype.constructor = ConfigError;

//      

// TODO:
// Axis positioning, see: https://bl.ocks.org/mbostock/b5935342c6d21928111928401e2c8608


function drawAxis(config, derivedConfig, container, cssClass, axis) {
  // $FlowNoD3
  var axisG = container.select('.' + cssClass);

  if (axisG.empty()) {
    // $FlowNoD3
    axisG = container.append('g');
  }

  switch (cssClass) {
    case 'x-axis-g':
      {
        var zeroLevel = 0;
        if (config.fixedAxis || config.layout.includes('horizontal')) {
          zeroLevel = derivedConfig.height;
        } else if (config.layout.includes('vertical')) {
          zeroLevel = derivedConfig.yScale(0);
        }
        axisG.attr('transform', 'translate(0, ' + zeroLevel + ')').attr('class', 'axis-g ' + cssClass);
        break;
      }
    case 'y-axis-g':
      if (config.fixedAxis || config.layout.includes('vertical')) {
        axisG.attr('class', 'axis-g ' + cssClass);
      } else if (config.layout.includes('horizontal')) {
        var _zeroLevel = derivedConfig.xScale(0);
        axisG.attr('transform', 'translate(' + _zeroLevel + ', 0)').attr('class', 'axis-g ' + cssClass);
      }
      break;
    default:
      break;
  }

  /* eslint-disable indent */
  axisG.transition(derivedConfig.transition).call(axis).selectAll('g').delay(derivedConfig.transitionDelay);
  /* eslint-enable indent */

  return axisG;
}

function xAxis(config, derivedConfig, container) {
  if (config.xAxisShow) {
    var axis = void 0;

    if (config.xAxis) {
      axis = config.xAxis;
      axis.scale(derivedConfig.xScale);
    } else {
      axis = d3Axis.axisBottom(derivedConfig.xScale);
    }

    return drawAxis(config, derivedConfig, container, 'x-axis-g', axis);
  }

  return [];
}

function yAxis(config, derivedConfig, container) {
  if (config.yAxisShow) {
    var axis = void 0;

    if (config.yAxis) {
      axis = config.yAxis;
      axis.scale(derivedConfig.yScale);
    } else {
      axis = d3Axis.axisLeft(derivedConfig.yScale);
    }

    return drawAxis(config, derivedConfig, container, 'y-axis-g', axis);
  }

  return [];
}

//      


// TODO data should be of type Array<{[key: string]: number | string}> or nested!
var bar = function (config, derivedConfig, container, data) // TODO data type
{
  var height = derivedConfig.height;
  var xAccessor = config.xAccessor;
  var yAccessor = config.yAccessor;
  var xScale = derivedConfig.xScale;
  var yScale = derivedConfig.yScale;
  var transition$$1 = derivedConfig.transition;
  var delay = derivedConfig.transitionDelay;
  var zScale = derivedConfig.zScale;

  // $FlowNoD3
  var barsG = container.select('.bars-g');

  if (barsG.empty()) {
    // $FlowNoD3
    barsG = container.append('g').attr('class', 'bars-g');
  }

  /* eslint-disable indent */
  if (config.layout === 'horizontal') {
    var zeroLevel = xScale(0);
    // UPDATE
    var bars = barsG.selectAll('.bar').data(data, yAccessor);
    // EXIT
    bars.exit().remove();
    // ENTER
    bars.enter().append('rect').attr('class', 'bar').attr('x', zeroLevel).attr('y', function (d) {
      return yScale(yAccessor(d));
    })
    // ENTER + UPDATE
    .merge(bars).transition(transition$$1).attr('x', function (d) {
      var value = xAccessor(d);
      var scaledValue = xScale(value);
      if (value >= 0) {
        return zeroLevel;
      }
      return scaledValue;
    }).attr('width', function (d) {
      var value = xAccessor(d);
      var scaledValue = xScale(value);
      if (value >= 0) {
        return scaledValue - zeroLevel;
      }
      return scaledValue + zeroLevel;
    }).attr('y', function (d) {
      return yScale(yAccessor(d));
    }).attr('height', yScale.bandwidth()).delay(delay);
  } else if (config.layout === 'vertical') {
    var _zeroLevel = yScale(0);
    // UPDATE
    var _bars = barsG.selectAll('.bar').data(data, xAccessor);
    // EXIT
    _bars.exit().remove();
    // ENTER
    _bars.enter().append('rect').attr('class', 'bar').attr('x', function (d) {
      return xScale(xAccessor(d));
    }).attr('y', _zeroLevel)
    // ENTER + UPDATE
    .merge(_bars).transition(transition$$1).attr('x', function (d) {
      return xScale(xAccessor(d));
    }).attr('width', xScale.bandwidth()).attr('y', function (d) {
      var value = yAccessor(d);
      var scaledValue = yScale(value);
      if (value >= 0) {
        return scaledValue;
      }
      return scaledValue - (height - _zeroLevel);
    }).attr('height', function (d) {
      var value = yAccessor(d);
      var scaledValue = yScale(value);
      if (value >= 0) {
        return height - scaledValue - (height - _zeroLevel);
      }
      return height - scaledValue + (height - _zeroLevel);
    }).delay(delay);
  } else if (config.layout === 'verticalStacked') {
    var _zeroLevel2 = yScale(0);
    // UPDATE
    // https://github.com/d3/d3-selection#selection_data
    // Joins the specified array of data with the selected elements,
    // returning a new selection that represents the update selection:
    // the elements successfully bound to data.
    // Also defines the enter and exit selections on the returned selection...
    var dataJoin = barsG.selectAll('.bars-g-nested').data(data);
    // EXIT
    dataJoin.exit().remove();
    // ENTER + UPDATE
    var nestedBarsG = dataJoin.enter().append('g').attr('class', 'bars-g-nested').attr('fill', function (d) {
      return zScale && zScale(d.key);
    }).merge(dataJoin);

    // UPDATE
    var _bars2 = nestedBarsG.selectAll('rect').data(function (d) {
      return d;
    });
    // EXIT
    _bars2.exit().remove();
    // ENTER + UPDATE
    _bars2.enter().append('rect').attr('x', function (d) {
      return xScale(xAccessor(d.data));
    }).attr('width', xScale.bandwidth).attr('y', _zeroLevel2).merge(_bars2).transition(transition$$1).attr('x', function (d) {
      return xScale(xAccessor(d.data));
    }).attr('width', xScale.bandwidth()).attr('y', function (d) {
      return yScale(d[1]);
    }).attr('height', function (d) {
      return yScale(d[0]) - yScale(d[1]);
    }).delay(delay);
  }
  /* eslint-enable indent */

  return container;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

//      

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

// deep clone an object
function clone(obj) {
  if (obj === null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') return obj;
  var copy = obj.constructor();
  Object.keys(obj).forEach(function (attr) {
    copy[attr] = clone(obj[attr]);
  });
  return copy;
}

// extend target object with source object
// overriding target values with source ones
function extend(target, source) {
  if (!isObject(target) || !isObject(source)) {
    throw new Error('extend only accepts objects');
  }

  var targetClone = clone(target);
  Object.keys(source).forEach(function (prop) {
    targetClone[prop] = source[prop];
  });
  return targetClone;
}

// $FlowNoD3
function getOrdinalBandScale(domain, range) {
  return d3Scale.scaleBand().rangeRound(range, 0.1).padding(0.1).domain(domain);
}

// $FlowNoD3
function getQuantitativeScale(scaleType, domain, range) {
  var scale = void 0;
  switch (scaleType) {
    case 'linear':
      scale = d3Scale.scaleLinear();
      break;
    default:
      scale = d3Scale.scaleLinear();
  }

  return scale.range(range).domain(domain);
}

// for each attribute in `state` it sets a getter-setter function on `f`
function getset(f, state) {
  d3Collection.entries(state).forEach(function (o) {
    /* eslint no-param-reassign:0 */
    f[o.key] = function getSetCallback(x) {
      if (x === undefined) return state[o.key];
      if (isObject(o.value)) {
        state[o.key] = extend(o.value, x);
      } else {
        state[o.key] = x;
      }
      return f;
    };
  });
  return f;
}

function stackMax(serie) {
  return d3Array.max(serie, function (d) {
    return d[1];
  });
}

function stackMin(serie) {
  return d3Array.min(serie, function (d) {
    return d[0];
  });
}

var helpers = {
  clone: clone,
  extend: extend,
  getOrdinalBandScale: getOrdinalBandScale,
  getQuantitativeScale: getQuantitativeScale,
  getset: getset,
  isObject: isObject,
  stackMax: stackMax,
  stackMin: stackMin
};

//      


var wrapper = function (config, derivedConfig, container) {
  var width = derivedConfig.width;
  var height = derivedConfig.height;
  var margin = config.margin;

  // $FlowNoD3
  var svg = container.select('svg');

  if (svg.empty()) {
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    /* eslint-disable indent */
    // $FlowNoD3
    svg = container.append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    /* eslint-enable indent */
  }

  return svg;
};

//      

// import {
//   createStore,
// } from '../state';
function setup(config, data) // TODO data type
{
  var height = config.height - config.margin.top - config.margin.bottom;
  var width = config.width - config.margin.left - config.margin.right;
  var xRange = [0, width];
  var yRange = [0, height];
  var tr = d3Transition.transition().duration(config.transitionDuration);
  var transitionDelay = function transitionDelay(d, i) {
    return i * config.transitionStepSeed;
  };

  switch (config.layout) {
    case 'horizontal':
      {
        var quantitativeMax = d3Array.max(data, config.xAccessor);
        var quantitativeMin = d3Array.min(data, config.xAccessor);
        var xDomain = config.xDomain !== undefined ? config.xDomain : [quantitativeMin < 0 ? quantitativeMin : 0, quantitativeMax];
        var yDomain = config.yDomain !== undefined ? config.yDomain : data.map(config.yAccessor);
        var xScale = helpers.getQuantitativeScale(config.quantitativeScaleType, xDomain, xRange);
        var yScale = helpers.getOrdinalBandScale(yDomain, yRange);
        var zScale = undefined;
        return {
          barData: data,
          derivedConfig: {
            height: height,
            transition: tr,
            transitionDelay: transitionDelay,
            width: width,
            xDomain: xDomain,
            xRange: xRange,
            xScale: xScale,
            yDomain: yDomain,
            yRange: yRange,
            yScale: yScale,
            zScale: zScale
          }
        };
      }
    case 'vertical':
      {
        var _quantitativeMax = d3Array.max(data, config.yAccessor);
        var _quantitativeMin = d3Array.min(data, config.yAccessor);
        var _xDomain = config.xDomain !== undefined ? config.xDomain : data.map(config.xAccessor);
        var _yDomain = config.yDomain !== undefined ? config.yDomain : [_quantitativeMax, _quantitativeMin < 0 ? _quantitativeMin : 0];
        var _xScale = helpers.getOrdinalBandScale(_xDomain, xRange);
        var _yScale = helpers.getQuantitativeScale(config.quantitativeScaleType, _yDomain, yRange);
        var _zScale = undefined;
        return {
          barData: data,
          derivedConfig: {
            height: height,
            transition: tr,
            transitionDelay: transitionDelay,
            width: width,
            xDomain: _xDomain,
            xRange: xRange,
            xScale: _xScale,
            yDomain: _yDomain,
            yRange: yRange,
            yScale: _yScale,
            zScale: _zScale
          }
        };
      }
    case 'verticalStacked':
      {
        var keys = config.stackedKeys;
        if (keys.length === 0) {
          throw new ConfigError('A stacked barchart needs a list of stackedKeys');
        }
        var offset = config.divergin ? d3Shape.stackOffsetDiverging : d3Shape.stackOrderAscending;
        var series = d3Shape.stack().keys(keys).offset(offset)(data);
        var _xDomain2 = config.xDomain !== undefined ? config.xDomain : data.map(config.xAccessor);
        var _yDomain2 = config.yDomain !== undefined ? config.yDomain : [d3Array.min(series, helpers.stackMin), d3Array.max(series, helpers.stackMax)];
        var _xScale2 = helpers.getOrdinalBandScale(_xDomain2, xRange);
        var _yScale2 = d3Scale.scaleLinear().domain(_yDomain2).rangeRound([height, 0]);
        var _zScale2 = d3Scale.scaleOrdinal(config.schemeCategory || d3Scale.schemeCategory10);
        return {
          barData: series,
          derivedConfig: {
            height: height,
            transition: tr,
            transitionDelay: transitionDelay,
            width: width,
            xDomain: _xDomain2,
            xRange: xRange,
            xScale: _xScale2,
            yRange: yRange,
            yDomain: _yDomain2,
            yScale: _yScale2,
            zScale: _zScale2
          }
        };
      }
    default:
      return {
        barData: data,
        derivedConfig: {
          height: height,
          transition: tr,
          transitionDelay: transitionDelay,
          width: width,
          xDomain: [0, 0],
          xRange: xRange,
          xScale: function xScale() {
            return undefined;
          },
          yRange: yRange,
          yDomain: [0, 0],
          yScale: function yScale() {
            return undefined;
          },
          zScale: undefined
        }
      };
  }
}

/**
 Example:
 const barChart = ntc.bar();
 const data = [...];
 const chartContainer = ntc.select('#chart');
 chartContainer.datum(data).call(barChart);
 */

var barChart = function () {
  var config = helpers.extend(baseConfig, barConfig);

  function exports(selection) {
    // Concept:
    // data
    // config
    // derivedConfig
    // state

    // $FlowNoD3
    var data = selection.datum();

    var _setup = setup(config, data),
        derivedConfig = _setup.derivedConfig,
        barData = _setup.barData;
    // TODO
    // const store = createStore(derivedConfig);

    var wrapperComponent = wrapper(config, derivedConfig, selection);
    var barComponent = bar(config, derivedConfig, wrapperComponent, barData);
    var xAxisComponent = xAxis(config, derivedConfig, wrapperComponent);
    var yAxisComponent = yAxis(config, derivedConfig, wrapperComponent);
  }

  helpers.getset(exports, config);

  return exports;
};

var d3 = {
  axisBottom: d3Axis.axisBottom,
  axisLeft: d3Axis.axisLeft,
  barChart: barChart,
  components: {},
  helpers: helpers,
  max: d3Array.max,
  min: d3Array.min,
  select: d3Selection.select
};

d3.components.wrapper = wrapper;

return d3;

})));
//# sourceMappingURL=d3-chart-builder.js.map
