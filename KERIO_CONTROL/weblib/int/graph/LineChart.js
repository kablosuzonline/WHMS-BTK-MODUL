
(function(Ext) { var
isSandboxed = (true === Ext.isSandboxed),
k_widgetSuffix = (isSandboxed ? '4' : '');

Ext.draw.Draw.k_originalSnapEnds = Ext.draw.Draw.snapEnds;
Ext.draw.Draw.snapEnds = function(from, to, stepsMax){
if (Ext.isDate(from)) { return this.snapEndsByDate(from, to, stepsMax);
}
if (!stepsMax) { return Ext.draw.Draw.k_originalSnapEnds.apply(this, arguments);
}
var step = (to - from) / stepsMax;
return {
from: from,
to: to,
steps: stepsMax,
step: step,
power: Math.floor(Math.log(step) / Math.LN10) + 1
};
};
Ext.override(Ext.chart.series.Line, {

getDistanceToPoint: function(k_from, k_to, k_xOnly) {
if (!k_from || !k_to) {
return Infinity;
}
var
k_x = (k_from[0] - k_to[0]), k_y = (k_from[1] - k_to[1]); if (k_xOnly) {
return Math.abs(k_x); }
return Math.sqrt(k_x * k_x + k_y * k_y); },

getItemForPoint: function(x, y){
var
me = this,
items = me.items,
bbox = me.bbox,
i, ln,
k_nearestItem = null, k_item,
k_distance;
if (!this.items || !this.items.length || this.seriesIsHidden) {
return null;
}
if (!Ext.draw.Draw.withinBox(x, y, bbox)) {
return null;
}
for (i = 0, ln = items.length; i < ln; i++) {
k_item = items[i];
if (!k_item) {
continue;
}
k_distance = this.getDistanceToPoint([x, y], k_item.point, true);
if (k_distance <= this.selectionTolerance) {
k_item.k_distanceToMouse = k_distance;
if (!k_nearestItem || k_nearestItem.k_distanceToMouse > k_distance) {
k_nearestItem = k_item;
}
}
}
return k_nearestItem;
},

hideAll: function(k_options) {
if (!this.chart._kx || (k_options && k_options.k_callOriginal)) {
this.callOverridden();
return;
}
var k_chart = this.chart._kx.k_owner;
this.seriesIsHidden = true;
if ('function' === typeof k_chart._k_onHideSerie) {
if (false !== k_chart._k_onHideSerie(this.yField)) {
this.callOverridden();
}
}
else {
this.callOverridden();
}
},

showAll: function(k_options) {
if (!this.chart._kx || (k_options && k_options.k_callOriginal)) {
this.callOverridden();
return;
}
var k_chart = this.chart._kx.k_owner;
this.seriesIsHidden = false;
if ('function' === typeof k_chart._k_onShowSerie) {
if (false !== k_chart._k_onShowSerie(this.yField)) {
this.callOverridden();
}
}
else {
this.callOverridden();
}
},
drawSeries: function() {
if (this._kx && this._kx.k_drawInProgress) {
return;
}
kerio.lib._k_addKerioProperty(this, { k_drawInProgress: true });
if (this.seriesIsHidden) {
this.hideAll({k_callOriginal: true});
}
else {
this.showAll({k_callOriginal: true});
}
this.callOverridden();
this._kx.k_drawInProgress = false;
}
});
Ext.define('kerio.lib.K_LineChart', {
extend: 'kerio.lib._K_BaseChart',
_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib._K_BaseChart, {
'k_isRaster': 'grid'
}),
_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib._K_BaseChart, {
grid: true
}),
_k_seriesMapping: {
'k_id': 'k_fieldId',
'k_title': 'k_label',
'k_color': 'k_color',
'k_fill': 'k_fill',
'k_tooltip': 'k_renderer'
},
constructor: function(k_id, k_config) {
this._k_setStoredProperties([
{'k_xAxis.k_fieldId': 'k_xId'},
{'k_xAxis.k_title': 'k_xTitle'},
{'k_xAxis.k_renderer': 'k_xLabel'},
{'k_xAxis.k_minValue': 'k_xMin'},
{'k_xAxis.k_maxValue': 'k_xMax'},
{'k_xAxis.k_ticks': 'k_xTicks'},
{'k_yAxis.k_title': 'k_yTitle'},
{'k_yAxis.k_renderer': 'k_yLabel'},
{'k_yAxis.k_minValue': 'k_yMin'},
{'k_yAxis.k_maxValue': 'k_yMax'},
{'k_yAxis.k_ticks': 'k_yTicks'},
{'k_series': 'k_series'},
{'k_onSerieShow': 'k_onShowSerie'},
{'k_onSerieHide': 'k_onHideSerie'}
]);
this.callParent([k_id, k_config]);
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_fields = [],
k_tooltip,
k_tooltipSet = false,
k_i, k_cnt,
k_series,
k_serie,
k_widget;
if (!k_storedConfig.k_xId) {
kerio.lib.k_reportError('Internal error: missing field id for X axis.', 'K_LineChart');
return;
}
k_fields.push({ k_columnId: k_storedConfig.k_xId,
k_title: k_storedConfig.k_xTitle,
k_isPrimaryKey: true
});
k_series = k_storedConfig.k_series; for (k_i = 0, k_cnt = k_series.length; k_i < k_cnt; k_i++) {
k_serie = k_series[k_i];
if (!k_serie[this._k_seriesMapping.k_id]) {
kerio.lib.k_reportError('Internal error: missing field id for a serie in ' + this.k_id, 'K_LineChart');
return;
}
if (k_tooltipSet) {        k_tooltip = undefined; }
else {
k_tooltip = k_serie[this._k_seriesMapping.k_tooltip];
if (k_tooltip) {
k_tooltipSet = true;
}
}
k_fields.push({
k_columnId: k_serie[this._k_seriesMapping.k_id],
k_title: k_serie[this._k_seriesMapping.k_title],
k_color: k_serie[this._k_seriesMapping.k_color],
k_fill: k_serie[this._k_seriesMapping.k_fill],
k_tooltip: k_tooltip
});
} this._k_fields = k_fields;
k_widget = this.callParent(arguments);
k_widget.drawAxis = this._k_drawAxis;
return k_widget;
},

_k_drawAxis: function(k_axis) {
k_axis.drawAxis();
if ('right' === k_axis.position || 'top' === k_axis.position) {
if (k_axis.axis && 'function' === typeof k_axis.axis.hide) { k_axis.axis.hide(true); }
}
},
_k_getSeries: function(k_adaptedConfig, k_storedConfig) {
var
k_fields = this._k_fields,
k_xField = k_fields[0].k_columnId,
k_series = [],
k_field,
k_color,
k_i, k_cnt;
for (k_i = 1, k_cnt = k_fields.length; k_i < k_cnt; k_i++) { k_field = k_fields[k_i];
k_color = this._k_getColor(k_field.k_color);
k_series.push({
type: 'Line',
title: k_field.k_title,
xField: k_xField,
yField: k_field.k_columnId,
axis: ['left', 'bottom'], selectionTolerance: 4, tips: (undefined === k_field.k_tooltip) ? undefined : { renderer: this._k_getRenderTooltipWrapper(k_i),
trackMouse: true,        constrainPosition: true, dismissDelay: 0          },
showMarkers: false, shadowAttributes: false,
fill: (false !== k_field.k_fill),
style: { 'stroke-width': ((false !== k_field.k_fill) ? 1 : 3), stroke: k_color,
fill: k_color
}
});
} return k_series;
},
_k_getAxes: function(k_adaptedConfig, k_storedConfig) {
var
k_fields = this._k_fields,
k_yFields = [],
k_i, k_cnt;
for (k_i = 1, k_cnt = k_fields.length; k_i < k_cnt; k_i++) {
k_yFields.push(k_fields[k_i].k_columnId);
} return [
{ type: 'Numeric',
position: 'bottom',
title: k_storedConfig.k_xTitle,
label: {
renderer: Ext.Function.bind(this._k_renderLabel, this, [k_storedConfig.k_xLabel, true], true),
font: '11px tahoma,arial,sans-serif',
color: '#000'
},
fields: this._k_fields[0].k_columnId,
grid: (false !== k_storedConfig.k_grid), minimum: k_storedConfig.k_xMin,
maximum: k_storedConfig.k_xMax,
majorTickSteps: k_storedConfig.k_xTicks || false },
{ type: 'Numeric',
position: 'left',
title: k_storedConfig.k_yTitle,
label: {
renderer: Ext.Function.bind(this._k_renderLabel, this, [k_storedConfig.k_yLabel], true),
font: '11px tahoma,arial,sans-serif',
color: '#000'
},
fields: k_yFields,
grid: (false !== k_storedConfig.k_grid), minimum: k_storedConfig.k_yMin,
maximum: k_storedConfig.k_yMax,
majorTickSteps: k_storedConfig.k_yTicks || false
},
{ type: 'Numeric',
position: 'top',
label: {
renderer: function() { return ''; }
},
fields: this._k_fields[0].k_columnId,
minimum: k_storedConfig.k_xMin,
maximum: k_storedConfig.k_xMax,
majorTickSteps: k_storedConfig.k_xTicks || false
},
{ type: 'Numeric',
position: 'right',
label: {
renderer: function() { return ''; }
},
fields: k_yFields,
minimum: k_storedConfig.k_yMin,
maximum: k_storedConfig.k_yMax,
majorTickSteps: k_storedConfig.k_yTicks || false
}
];
},
_k_renderLabel: function(k_value, k_renderer, k_horAxis) {
var k_output;
if ('function' === typeof k_renderer) {
k_output = k_renderer.apply(this, [k_value, this._k_store.k_getData()]);
k_value = k_output.k_data;
}
if (k_horAxis) {
k_value = '\u00A0' + k_value + '\u00A0';
}
return k_value;
},
_k_getRenderTooltipWrapper: function(k_columnIndex) {
var k_chart = this;
return function(k_record, k_item) {
k_chart._k_renderTooltip.apply(this, [k_record, k_item, k_columnIndex, k_chart._k_fields[k_columnIndex].k_columnId, k_chart._k_fields[k_columnIndex].k_title, k_chart]);
};
},
_k_renderTooltip: function(k_record, k_item, k_index, k_columnId, k_title, k_chart) {
var
k_tooltip = k_chart._k_fields[k_index].k_tooltip,
k_xField = k_chart._k_fields[0].k_columnId,
k_output;
if ('function' === typeof k_tooltip) {
k_output = k_tooltip.apply(k_chart, [
k_item.value[0],
k_item.value[1],
k_record.data,
k_xField,
k_columnId,
k_index,
k_chart
]);
this.setTitle(k_output.k_data);
this.setSize(k_output.k_width || 100, k_output.k_height || 20);
}
},

k_setAxes: function(k_config) {
var
k_xAxis = this.k_extWidget.axes.get(0),
k_yAxis =  this.k_extWidget.axes.get(1),
k_xAxis2 =  this.k_extWidget.axes.get(2),
k_yAxis2 =  this.k_extWidget.axes.get(3);
if (undefined !== k_config.k_xMinValue) {
k_xAxis.minimum = k_config.k_xMinValue;
k_xAxis2.minimum = k_config.k_xMinValue;
}
if (undefined !== k_config.k_xMaxValue) {
k_xAxis.maximum = k_config.k_xMaxValue;
k_xAxis2.maximum = k_config.k_xMaxValue;
}
if (undefined !== k_config.k_xConstrain) {
k_xAxis.constrain = k_config.k_xConstrain;
}
if (undefined !== k_config.k_yMinValue) {
k_yAxis.minimum = k_config.k_yMinValue;
k_yAxis2.minimum = k_config.k_yMinValue;
}
if (undefined !== k_config.k_yMaxValue) {
k_yAxis.maximum = k_config.k_yMaxValue;
k_yAxis2.maximum = k_config.k_yMaxValue;
}
if (undefined !== k_config.k_yConstrain) {
k_yAxis.constrain = k_config.k_yConstrain;
}
if (true === k_config.k_refresh) {
this.k_extWidget.refresh();
}
},
_k_getLegend: function(k_adaptedConfig, k_storedConfig) {
var k_legend;
k_legend = this.callParent([k_adaptedConfig, k_storedConfig]);
Ext.apply(k_legend, {
boxStrokeWidth: 0,
boxStroke: 'transparent',
padding: 0,
itemSpacing: 20,
labelFont: '11px tahoma,arial,sans-serif'
});
return k_legend;
},
k_setSerieLabel: function(k_id, k_title) {
var
k_chart = this.k_extWidget,
k_serie;
k_chart.legend.isVertical = true;
k_chart.legend.itemSpacing = 0;
this.k_getSerie(k_id).title = k_title;
},
_k_onHideSerie: function(k_serieId) {
if ('function' === typeof this._k_storedConfig.k_onHideSerie) {
return this._k_storedConfig.k_onHideSerie.apply(this, arguments);
}
},
_k_onShowSerie: function(k_serieId) {
if ('function' === typeof this._k_storedConfig.k_onShowSerie) {
return this._k_storedConfig.k_onShowSerie.apply(this, arguments);
}
}
});
})(window.Ext4 ? Ext4 : Ext);