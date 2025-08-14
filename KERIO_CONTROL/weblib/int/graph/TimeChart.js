
(function(Ext) { var
isSandboxed = (true === Ext.isSandboxed),
k_widgetSuffix = (isSandboxed ? '4' : '');

Ext4.chart.TimeAxis.prototype.calcEnds = function() {
var me = this, range, step = me.step;
if (step) {
range = me.getRange();
range = Ext.draw.Draw.snapEndsByDateAndStep(new Date(range.min), new Date(range.max), Ext.isNumber(step) ? [Date.MILLI, step] : step, true);
return range;
}
else {
return me.callParent(arguments);
}
};

Ext4.draw.Draw.snapEndsByDateAndStep = function(k_from, k_to, k_step, k_lockEnds) {
var
k_output = Ext4.draw.Draw.self.prototype.snapEndsByDateAndStep(k_from, k_to, k_step, k_lockEnds);
if ('d' === k_step[0]) {
if (6 === k_output.steps || 8 === k_output.steps) {
k_output.steps = 7;
k_output.step = (k_output.to - k_output.from) / k_output.steps;
}
if (30 === k_output.steps || 32 === k_output.steps) {
k_output.steps = 31;
k_output.step = (k_output.to - k_output.from) / k_output.steps;
}
}
return k_output;
}; Ext.define('kerio.lib.K_TimeChart', {
extend: 'kerio.lib.K_LineChart',
_k_freshStartThreshold: 5, _k_tickUnits: {
k_year: Ext.Date.YEAR,
k_month: Ext.Date.MONTH,
k_day: Ext.Date.DAY,
k_hour: Ext.Date.HOUR,
k_minute: Ext.Date.MINUTE,
k_second: Ext.Date.SECOND,
k_years: Ext.Date.YEAR,
k_months: Ext.Date.MONTH,
k_days: Ext.Date.DAY,
k_hours: Ext.Date.HOUR,
k_minutes: Ext.Date.MINUTE,
k_seconds: Ext.Date.SECOND
},
constructor: function(k_id, k_config) {
this._k_setStoredProperties([
{'k_xAxis.k_constrain': 'k_xLimit'}
]);
this.callParent([k_id, k_config]);
this.k_timeAxis = this.k_extWidget.axes.get(0);
this.k_topTimeAxis = this.k_extWidget.axes.get(2);
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
return this.callParent(arguments);
},
_k_getAxes: function(k_adaptedConfig, k_storedConfig) {
var
k_axes = this.callParent(arguments), k_tickUnits = this._k_tickUnits,
k_interval = k_storedConfig.k_xTicks;
if (undefined === k_interval) {
k_interval = {
k_unit: 'k_hour',
k_step: 1
};
}
else if (!isNaN(parseInt(k_interval, 10))) { k_interval = { k_step: k_interval};
}
k_interval.k_unit = k_tickUnits[k_interval.k_unit] || k_tickUnits.k_second;
k_interval.k_step = (undefined !== k_interval.k_step ? parseInt(k_interval.k_step, 10) : 60);
Ext.apply(k_axes[0], {
type: 'Time',
constrain: (undefined !== k_storedConfig.k_xLimit)
? k_storedConfig.k_xLimit
: (undefined !== k_storedConfig.k_xMin && undefined !== k_storedConfig.k_xMax),
step: [k_interval.k_unit, k_interval.k_step]
});
Ext.apply(k_axes[2], {
type: 'Time',
step: [k_interval.k_unit, k_interval.k_step]
});
return k_axes;
},

k_setTicks: function(k_unit, k_step, k_refresh) {
var k_tickUnits = this._k_tickUnits;
if (!isNaN(parseInt(k_unit, 10))) {
k_refresh = k_step;
k_step = k_unit;
k_unit = undefined; }
if (!k_tickUnits.hasOwnProperty(k_unit)) {
kerio.lib.k_reportError('Internal error: Invalid chart ticks unit "' + k_unit + '" in ' + this.k_id, 'K_TimeChart');
return;
}
if (isNaN(parseInt(k_step, 10))) {
kerio.lib.k_reportError('Internal error: Invalid chart ticks interval "' + k_step + '" in ' + this.k_id, 'K_TimeChart');
return;
}
this.k_timeAxis.step = [k_tickUnits[k_unit] || k_tickUnits.k_second, parseInt(k_step, 10)];
this.k_topTimeAxis.step = [k_tickUnits[k_unit] || k_tickUnits.k_second, parseInt(k_step, 10)];
if (true === k_refresh) {
this.k_extWidget.refresh();
}
},

k_setConstrains: function(k_minValue, k_maxValue, k_constrain, k_refresh) {
this.k_timeAxis.minimum = k_minValue;
this.k_timeAxis.maximum = k_maxValue;
this.k_timeAxis.constrain = (undefined !== k_constrain) ? k_constrain : (undefined !== k_minValue && undefined !== k_maxValue);
if (true === k_refresh) {
this.k_extWidget.refresh();
}
},

k_setTimeAxis: function(k_config) {
if (undefined !== k_config.k_minValue || undefined !== k_config.k_maxValue) {
this.k_setConstrains(k_config.k_minValue, k_config.k_maxValue, k_config.k_constrains, false);
}
if (undefined !== k_config.k_step) {
this.k_setTicks(k_config.k_unit, k_config.k_step, false);
}
if (true === k_config.k_refresh) {
this.k_extWidget.refresh();
}
}
});
})(window.Ext4 ? Ext4 : Ext);