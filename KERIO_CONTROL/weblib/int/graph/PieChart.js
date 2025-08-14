
(function(Ext) { var
isSandboxed = (true === Ext.isSandboxed),
k_widgetSuffix = (isSandboxed ? '4' : '');
Ext.define('kerio.lib.K_PieChart', {
extend: 'kerio.lib._K_BaseChart',
_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib._K_BaseChart, {
width: 600,
height: 600,
grid: false,
legend: {
position: 'right'
}
}),
constructor: function(k_id, k_config) {
this._k_setStoredProperties([
'k_padding',
{'k_slices.k_title': 'k_xTitle'},
{'k_slices.k_labelFieldId': 'k_xLabel'},
{'k_slices.k_valueFieldId': 'k_xId'},
{'k_slices.k_sizeFieldId': 'k_yId'},
{'k_slices.k_renderer': 'k_tooltip'},
{'k_slices.k_donut': 'k_donut'}
]);
this.callParent([k_id, k_config]);
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_fields = [],
k_i, k_cnt,
k_series,
k_widget;
if (!k_storedConfig.k_xId) {
kerio.lib.k_reportError('Internal error: missing field id for the values ' + this.k_id, 'K_PieChart');
return;
}
k_fields.push({ k_columnId: k_storedConfig.k_xId,
k_title: k_storedConfig.k_xTitle,
k_isPrimaryKey: true
});
k_fields.push({ k_columnId: k_storedConfig.k_yId,
k_tooltip: k_storedConfig.k_tooltip
});
this._k_fields = k_fields;
Ext.apply(k_adaptedConfig, {
insetPadding: k_storedConfig.k_padding || 60,
shadow: false });
k_widget = this.callParent(arguments);
return k_widget;
},
_k_getSeries: function(k_adaptedConfig, k_storedConfig) {
var k_series = [];
k_series.push({
type: 'Pie',
angleField: k_storedConfig.k_xId,  lengthField: k_storedConfig.k_yId, showInLegend: true, donut: (true === k_storedConfig.k_donut ? 33 : k_storedConfig.k_donut || false), tips: (undefined === k_storedConfig.k_tooltip) ? undefined :  { trackMouse: true,
renderer: Ext.Function.bind(this._k_renderTooltip, this, [k_storedConfig.k_xId, k_storedConfig.k_yId, k_storedConfig.k_xLabel], true)
},
highlight: {
segment: {
margin: 15
}
},
label: { field: k_storedConfig.k_xLabel }
});
return k_series;
},
_k_renderTooltip: function(k_record, k_data, k_xId, k_yId, k_xLabel) {
var k_tooltip = this._k_fields[1].k_tooltip;
if ('function' === typeof k_tooltip) {
return k_tooltip.apply(this, [
k_record.data[k_xId],
k_record.data,
k_xId,
k_xLabel,
k_yId,
this
]);
}
}
});
})(window.Ext4 ? Ext4 : Ext);