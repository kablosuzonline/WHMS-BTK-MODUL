
(function(Ext) { var
isSandboxed = (true === Ext.isSandboxed),
k_widgetSuffix = (isSandboxed ? '4' : '');
Ext.tip.ToolTip.prototype.maxWidth = 400; Ext.define('kerio.lib._K_BaseChart', {
extend: 'kerio.lib._K_BaseComponent' + k_widgetSuffix,
_k_propertiesMapping: {
k_width: 'width',
k_height: 'height'
},
_k_propertiesDefault: {
width: 600,
height: 250,
legend: {
visible: true,
position: 'bottom'
}
},
_k_chartColors: [ '#00A1E1',
'#E73A27',
'#82B800',
'#F77C0F',
'#CE64A3',
'#6E237C',
'#61C899' ],
_k_hashColorRegExp: new RegExp('$#([0-9a-fA-F]{3}){1,2}^'),
_k_rgbColorRegExp: new RegExp('$rgb\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)^'),
_k_legendPositions: {
k_bottom: 'bottom',
k_top: 'top',
k_left: 'left',
k_right: 'right'
}, constructor: function(k_id, k_config) {
this.k_id = k_id;
kerio.lib.k_registerWidget(this);
this._k_setStoredProperties([
'k_legend',
'k_container', {'k_remoteData': 'k_remoteData'},
{'k_localData': 'k_localData'}
]);
Ext.apply(this, {
_k_store: null,
_k_fields: [],  _k_axes:   [],  _k_series: []
});
this.callParent([k_config]);
},

k_destroy: function() {
this._k_storedConfig.k_container.k_extWidget.removeAll(); kerio.lib.k_unregisterWidget(this.k_id);                  },

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
this._k_fields = this._k_getFields(k_adaptedConfig, k_storedConfig);
this._k_axes = this._k_getAxes(k_adaptedConfig, k_storedConfig);
this._k_series = this._k_getSeries(k_adaptedConfig, k_storedConfig);
this._k_store = this._k_createStore(k_storedConfig);
Ext.apply(k_adaptedConfig, {
id: this.k_id,
store: this._k_store.k_extWidget,
renderTo: (k_storedConfig.k_container ? k_storedConfig.k_container.k_extWidget.body.dom: undefined),
axes: this._k_axes,
series: this._k_series,
legend: this._k_getLegend(k_adaptedConfig, k_storedConfig),
theme: this._k_createTheme(k_storedConfig)
});
this.k_extWidget = Ext.create(isSandboxed ? 'Ext4.chart.Chart' : 'Ext.chart.Chart', k_adaptedConfig);
if (k_storedConfig.k_container) {
this.k_parentWidget = k_storedConfig.k_container;
k_storedConfig.k_container.k_extWidget.on('bodyresize', this.k_syncSize, this);
this.k_syncSize(); }
return this.k_extWidget;
},
k_syncSize: function() {
if (!this.k_parentWidget) {
return;
}
var
k_size = this.k_parentWidget.k_extWidget.body.getSize(true);
this.k_extWidget.setSize(k_size);
},
_k_createStore: function(k_storedConfig) {
var k_storeCfg;
k_storeCfg = {
k_localData: k_storedConfig.k_localData,
k_remoteData: k_storedConfig.k_remoteData,
k_record: this._k_fields
};
return new kerio.lib['_K_DataStore' + k_widgetSuffix](this, k_storeCfg);
},
_k_createTheme: function(k_storedConfig) {
var k_themes = Ext.chart.theme;
if (!k_themes.KerioColors) { k_themes.KerioColors = Ext.extend(k_themes.Base, {
constructor: function(config){
k_themes.Base.prototype.constructor.call(this, Ext.apply({
colors: kerio.lib._K_BaseChart.prototype._k_chartColors
}, config));
}
});
}
return 'KerioColors';
},
_k_getFields: function(k_adaptedConfig, k_storedConfig) {
return this._k_fields;
},
_k_getSeries: function(k_adaptedConfig, k_storedConfig) {
return this._k_series;
},
_k_getAxes: function(k_adaptedConfig, k_storedConfig) {
return undefined; },
_k_getLegend: function(k_adaptedConfig, k_storedConfig) {
var
k_positions = this._k_legendPositions,
k_legend = k_storedConfig.k_legend;
if ('string' === typeof k_legend) {
if (k_positions[k_legend]) { k_adaptedConfig.legend.position = this._k_legendPositions[k_storedConfig.k_legend];
}
else {
kerio.lib.k_reportError('Internal error: unsupported type of chart legend: ' + k_legend, '_K_BaseChart');
return {};
}
}
else if (true !== k_legend){
k_adaptedConfig.legend = false;
} return k_adaptedConfig.legend;
},

_k_getColor: function(k_color) {
if (undefined !== k_color) {
if (0 <= k_color && this._k_chartColors.length > k_color) {k_color = this._k_chartColors[k_color];
}
else if ('string' === typeof k_color) {
if (!this._k_hashColorRegExp.test(k_color) || !this._k_hashColorRegExp.test(k_color)) { kerio.lib.k_reportError('Internal error: wrong color format in ' + this.k_id, '_K_BaseChart');
}
}
}
return k_color;
},
_k_renderTooltip: function() {
},
k_setData: function() {
this._k_store.k_setData.apply(this._k_store, arguments);
},
k_getSerie: function(k_id) {
var
k_chart = this.k_extWidget,
k_closureId = k_id;
return k_chart.series.findBy(function(k_item) { return (k_item.yField === k_closureId);});
},

k_bypassDomRelease: function() {
var
k_ext = this.k_extWidget,
k_dom = k_ext.el.dom;
if (undefined !== this._k_lastDomParent) {
return;
}
this._k_lastDomParent = k_dom.parentNode;
k_ext.hide();
Ext.getBody().appendChild(k_dom);
},

k_bypassDomRestore: function() {
var
k_ext = this.k_extWidget,
k_dom = k_ext.el.dom,
k_parent = this._k_lastDomParent;
this._k_lastDomParent = undefined;
if (!k_parent) {
return false;
}
k_parent.appendChild(k_dom);
k_ext.show();
return true;
}
});
})(window.Ext4 ? Ext4 : Ext);