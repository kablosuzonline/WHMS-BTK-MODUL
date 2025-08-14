
kerio.waw.ui.systemHealth = {
k_init: function(k_objectName) {
var
k_lib = kerio.lib,
k_localNamespace = k_objectName + '_',
k_methods = kerio.waw.shared.k_methods,
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_webSharedConstants = k_CONSTANTS.kerio_web_SharedConstants,
k_LINUX = k_CONSTANTS.k_SERVER.k_OS_LINUX,
k_WINDOWS = k_CONSTANTS.k_SERVER.k_OS_WINDOWS,
k_isLinux = k_methods.k_isLinux(),
k_isAuditor = k_methods.k_isAuditor(),
k_tr = k_lib.k_tr,
k_histogramTypeId = k_objectName + '.' + 'type', k_graphPanelCpu,
k_graphPanelRam,
k_toolbarCfg,
k_toolbar,
k_autoRefreshGui,
k_formCfg,
k_form,
k_storageInfo,
k_storageInfoActual,
k_storageManage,
k_storageInfoContainer,
k_storageInfoContainerActual
;
k_graphPanelCpu = new k_lib.K_ContentPanel('k_graphCpu', {
k_html: ''
});
k_graphPanelRam = new k_lib.K_ContentPanel('k_graphRam', {
k_html: ''
});
k_storageInfo = {
k_type: 'k_display',
k_id: 'k_storageText',
k_isLabelHidden: true,
k_template: k_tr('{usage} of {total} total disk space used ({free} free).', 'systemHealth'),
k_templateValues: {
free: 0,
total: 0,
usage: 0
},
k_width: k_lib.k_isIPadCompatible ? undefined : 500
};
k_storageInfoActual = {
k_type: 'k_display',
k_id: 'k_storageTextActual',
k_isLabelHidden: true,
k_isVisible: false,
k_template: k_tr('Actual Disk Space usage: {usage}  of {total} ({free}  free).', 'systemHealth'),
k_templateValues: {
free: 0,
total: 0,
usage: 0
},
k_width: k_lib.k_isIPadCompatible ? undefined : 500
};
k_storageManage = {
k_type: 'k_formButton',
k_id: 'k_btnStorage',
k_caption: k_isAuditor ? k_tr('View…', 'common') : k_tr('Manage…', 'systemHealth'),

k_onClick: function(k_form) {
kerio.lib.k_ui.k_showDialog({k_sourceName: 'systemHealthStorage', k_params: {k_parentWidget: k_form, k_diskTotal: k_form.k_diskTotal}});
}
};
k_toolbarCfg = {
k_restrictBy: {
k_serverOs: (k_isLinux ? k_LINUX : k_WINDOWS),
k_isIos: kerio.waw.shared.k_methods.k_isIos()
},
k_items: [
{
k_caption: k_tr('Enable SSH', 'systemHealth'),
k_id: 'k_sshEnable',
k_isHidden: true,

k_onClick: function(k_toolbar) {
var
k_tr = kerio.lib.k_tr;
kerio.lib.k_confirm({
k_title: k_tr('Confirm Action', 'common'),
k_msg: k_tr('By using Secure Shell access to the system you agree to assume all responsibility for any product failures resulting from changes to the system settings you may perform.', 'systemHealth')
+ '<br>' + k_tr('Please note that performing system settings changes through Secure Shell console requires deep knowledge of the Linux operating system.', 'systemHealth')
+ '<br>' + k_tr('If you lack the required knowledge to perform such changes, please don\'t enable Secure Shell access to the system.', 'systemHealth')
+ '<br><br>'
+ '<b>'
+ k_tr('Do you want to enable Secure Shell access to the system?', 'systemHealth')
+ '</b>',

k_callback: function(k_result) {
if (k_result !== 'yes') {
return;
}
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'SystemTasks.setSsh',
params: {
enable: true
}
},

k_callback: function(k_response, k_success) {
if (!k_success || !k_response.k_isOk) {
return;
}
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Information', 'common'),
k_msg: kerio.lib.k_tr('Secure Shell access has been enabled.', 'systemHealth'),
k_icon: 'info'
});
this._k_sshEnabled = true;
this.k_toolbar.k_hideItem('k_sshEnable');
this.k_toolbar.k_showItem('k_sshDisable');
},
k_scope: this
});
},
k_scope: k_toolbar.k_parentWidget,
k_icon: 'warning'
}); } },
{
k_caption: k_tr('Disable SSH', 'systemHealth'),
k_id: 'k_sshDisable',
k_isHidden: true,

k_onClick: function(k_toolbar) {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'SystemTasks.setSsh',
params: {
enable: false
}
},

k_callback: function(k_response, k_success) {
if (!k_success || !k_response.k_isOk) {
return;
}
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Information', 'common'),
k_msg: kerio.lib.k_tr('Secure Shell access has been disabled.', 'systemHealth'),
k_icon: 'info'
});
this._k_sshEnabled = false;
this.k_toolbar.k_showItem('k_sshEnable');
this.k_toolbar.k_hideItem('k_sshDisable');
},
k_scope: k_toolbar.k_parentWidget
});
}
},
{
k_caption: k_tr('Reboot…', 'systemHealth'),
k_isHidden: k_isAuditor,
k_onClick: function() {
var
k_tr = kerio.lib.k_tr;
kerio.lib.k_confirm(
k_tr('Confirm Action', 'common'),
k_tr('Are you sure you want to reboot the server?', 'systemHealth'),

function(k_result) {
if (k_result !== 'yes') {
return;
}
kerio.waw.requests.k_sendBatch(
{
k_jsonRpc: {
method: 'SystemTasks.reboot'
},
k_callback: function(k_response, k_success) {
if (k_success) {
return; }
else {
kerio.waw.requests.k_reportRestartFail();
}
}
},
{
k_mask: false
}
);
if (kerio.waw.shared.k_tasks.k_isDefined(this.k_parentWidget.k_refreshTaskId)) {
kerio.waw.shared.k_tasks.k_stop(this.k_parentWidget.k_refreshTaskId); }
kerio.waw.requests.k_startRestart();
}, this ); } },
{
k_caption: k_tr('Power Off…', 'systemHealth'),
k_isHidden: k_isAuditor,
k_onClick: function() {
var
k_tr = kerio.lib.k_tr;
kerio.lib.k_confirm(
k_tr('Confirm Action', 'common'),
k_tr('Are you sure you want to power off the server?', 'systemHealth'),

function(k_result) {
if (k_result !== 'yes') {
return;
}
kerio.waw.status.k_userSettings.k_save(); kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'SystemTasks.shutdown'
},
k_callback: function(k_response, k_success) {
if (k_success) {
kerio.waw.requests.k_startShutdown();
} }
});
if (kerio.waw.shared.k_tasks.k_isDefined(this.k_parentWidget.k_refreshTaskId)) {
kerio.waw.shared.k_tasks.k_stop(this.k_parentWidget.k_refreshTaskId); }
},
this
); } }, {
k_restrictions: {
k_isIos: [ false ]
},
k_type: 'k_container',
k_content: new k_lib.K_DisplayField('k_supportInfoLink', {
k_isLabelHidden: true,
k_template: '<a id="k_supportInfo">{k_caption}</a>',
k_value: {
k_caption: k_tr('Support information', 'systemHealth')
},

k_onLinkClick: function() {
kerio.waw.requests.k_sendBatch({
k_jsonRpc: {
method: 'ProductInfo.getSupportInfo'
} });
}
})
},
'->'
]
};
k_toolbar = new k_lib.K_Toolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
k_autoRefreshGui = kerio.waw.shared.k_methods.k_addRefreshCheckbox({
k_toolbar: k_toolbar,
k_onChangeAutoRefresh: function (k_toolbar, k_checkbox, k_isChecked) {
var
k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_timeout;
if (k_checkbox.k_ignoreOnChange) {
return;
}
k_timeout = true === k_isChecked ? k_DEFINITIONS.k_AUTOREFRESH_INTERVAL : k_DEFINITIONS.k_AUTOREFRESH_DISABLED;
k_checkbox.k_ignoreOnChange = true;
k_checkbox.k_form.k_onSetAutoRefreshInterval(k_timeout);
}
});
if (k_lib.k_isIPadCompatible) {
k_storageInfoContainerActual = {
k_type: 'k_container',
k_items: [
k_storageInfoActual,
]
};
}
else {
k_storageInfoContainerActual = {
k_type: 'k_row',
k_items: [
k_storageInfoActual,
]
};
}
if (k_lib.k_isIPadCompatible) {
k_storageInfoContainer = {
k_type: 'k_container',
k_items: [
k_storageInfo,
k_storageManage
]
};
}
else {
k_storageInfoContainer = {
k_type: 'k_row',
k_items: [
k_storageInfo,
'->',
k_storageManage
]
};
}
k_formCfg = {
k_className: 'mainList mainForm',
k_toolbars: {
k_bottom: k_toolbar
},
k_items: [
{
k_type: 'k_container',
k_labelWidth: 130,
k_height: 25,
k_items: [
{
k_id: 'k_timeInterval',
k_caption: k_tr('Time interval:', 'systemHealth'),
k_type: 'k_select',
k_useColumnsNames: true,
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_localData: [
{k_value: k_webSharedConstants.kerio_web_HistogramTwoHours, k_caption: k_tr('2 hours', 'systemHealth')},
{k_value: k_webSharedConstants.kerio_web_HistogramOneDay,   k_caption: k_tr('1 day', 'systemHealth')},
{k_value: k_webSharedConstants.kerio_web_HistogramOneWeek,   k_caption: k_tr('1 week', 'systemHealth')},
{k_value: k_webSharedConstants.kerio_web_HistogramOneMonth,   k_caption: k_tr('1 month', 'systemHealth')}
],
k_value: kerio.waw.status.k_userSettings.k_get(k_histogramTypeId, k_webSharedConstants.kerio_web_HistogramTwoHours),
k_width: 100,

k_onChange: function(k_form, k_item, k_value) {
kerio.waw.status.k_userSettings.k_set(k_form._k_histogramTypeId, k_value);
k_form.k_loadData();
}
}
]
},
{
k_type: 'k_container',
k_className: 'ext4Charts',
k_anchor: '0 -135', k_minHeight: 250,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('CPU', 'systemHealth'),
k_anchor: '0 50%',
k_items: [
{
k_type: 'k_container',
k_id: 'k_graphContainerCpu',
k_content: k_graphPanelCpu
}
]
},
{
k_type: 'k_fieldset',
k_id: 'k_fieldsetRam',
k_caption: k_tr('RAM', 'systemHealth'),
k_anchor: '0 50%',
k_items: [
{
k_type: 'k_container',
k_id: 'k_graphContainerRam',
k_content: k_graphPanelRam
}
]
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Storage usage', 'systemHealth'),
k_height: 95,
k_items: [
{
k_type: 'k_progressBar',
k_id: 'k_storageGraph',
k_value: 0,
k_maxValue: 100
},
k_storageInfoContainer,
k_storageInfoContainerActual
]
}
]
};
k_form = new k_lib.K_Form(k_objectName, k_formCfg);
this.k_addControllers(k_form);
k_form.k_addReferences({
_k_histogramTypeId: k_histogramTypeId,
k_isAuditor: k_isAuditor,
k_toolbar: k_toolbar,
k_graphPanelCpu: k_graphPanelCpu,
k_graphPanelRam: k_graphPanelRam,
k_charts: {
k_cpu: null,
k_ram: null,
k_files: [],
k_fileId: 0
},
_k_isLoadMask: false,
k_autoRefreshGui: k_autoRefreshGui,
k_refreshTaskId: k_localNamespace + 'k_refreshTask',
k_showSsh: false
});
k_autoRefreshGui.k_addReferences({
k_form: k_form
});
return k_form;
}, 
k_addControllers: function (k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
if (!this.k_isAuditor) {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'SystemTasks.getSsh'
},
k_callback: this.k_callbackGetSsh,
k_scope: this,

k_onError: function() {
return true;
} });
}
this.k_toolbar.k_hideItem('k_sshEnable');
this.k_toolbar.k_hideItem('k_sshDisable');
this.k_showSsh = undefined !== k_params && true === k_params.k_isShiftKey;
if (!kerio.lib.K_TimeChart) {
kerio.waw.shared.k_methods.k_maskMainScreen(this); this._k_isLoadMask = true;
this.k_loadFiles();
}
else {
if (!this.k_charts.k_cpu) { kerio.waw.shared.k_methods.k_maskMainScreen(this);
this._k_isLoadMask = true;
}
this.k_loadData();
}
}; 
k_kerioWidget.k_callbackGetSsh = function(k_response, k_success) {
if (!k_success || !k_response.k_isOk) {
this._k_sshError = true;
return;
}
this._k_sshError = false;
this._k_sshEnabled = k_response.k_decoded.running;
if (this.k_showSsh) {
this.k_toolbar.k_showItem(this._k_sshEnabled ? 'k_sshDisable' : 'k_sshEnable');
}
}; 
k_kerioWidget.k_loadData = function() {
if (!window.Ext4 || !kerio.lib.K_TimeChart) {
return false;
}
kerio.waw.requests.k_sendBatch([
{
k_jsonRpc: { method: 'SystemConfig.getDateTime' },
k_callback: this.k_callbackSystemTime,
k_scope: this
},
{
k_jsonRpc: {
method: 'SystemHealth.get',
params: {
type: this.k_getItem('k_timeInterval').k_getValue()
}
},
k_callback: this.k_callbackLoadData,
k_scope: this
}
],
{
k_mask: false
});
return false; }; 
k_kerioWidget.k_callbackSystemTime = function(k_response, k_success) {
if (k_success) {
this._k_serverTime = k_response.config;
}
else { this._k_serverTime = {
date: kerio.waw.shared.k_methods.k_unixTimestampToDate(new Date()/1000),
time: kerio.waw.shared.k_methods.k_unixTimestampToTime(new Date()/1000)
};
}
};

k_kerioWidget.k_callbackLoadData = function(k_response, k_success) {
this.k_disableRefresh(false);
if (kerio.waw.shared.k_tasks.k_isDefined(this.k_refreshTaskId)) { kerio.waw.shared.k_tasks.k_resume(this.k_refreshTaskId, true);
}
if (!k_success) {
return;
}
var
kerio_web_SharedConstants = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_formatDataUnits = kerio.waw.shared.k_methods.k_formatDataUnits,
k_systemHealth = k_response.data,
k_memoryTotalFormat,
k_memoryTotal,
k_fieldsetRam,
k_diskUsage;
k_diskUsage = k_systemHealth.diskTotal - k_systemHealth.diskFree;
k_diskUsageActual = k_systemHealth.actualDiskTotal - k_systemHealth.actualDiskFree;
this.k_getItem('k_storageGraph').k_setMaxValue(k_systemHealth.diskTotal);
var k_storageTextData = {
free:  k_formatDataUnits({ k_value: k_systemHealth.diskFree, k_units: kerio_web_SharedConstants.kerio_web_Bytes, k_isInTime: false }).k_string,
total: k_formatDataUnits({ k_value: k_systemHealth.diskTotal, k_units: kerio_web_SharedConstants.kerio_web_Bytes, k_isInTime: false }).k_string,
usage: k_formatDataUnits({ k_value: k_diskUsage, k_units: kerio_web_SharedConstants.kerio_web_Bytes, k_isInTime: false }).k_string
};
var k_storageTextActualData = {};
if(k_response.data.showActual)
k_storageTextActualData = {
free:  k_formatDataUnits({ k_value: k_systemHealth.actualDiskFree, k_units: kerio_web_SharedConstants.kerio_web_Bytes, k_isInTime: false }).k_string,
total: k_formatDataUnits({ k_value: k_systemHealth.actualDiskTotal, k_units: kerio_web_SharedConstants.kerio_web_Bytes, k_isInTime: false }).k_string,
usage: k_formatDataUnits({ k_value: k_diskUsageActual, k_units: kerio_web_SharedConstants.kerio_web_Bytes, k_isInTime: false }).k_string
};
if(k_response.data.showActual) {
this.k_items["k_storageTextActual"].k_setVisible(true);
}
this.k_setData({
k_storageGraph: k_diskUsage,
k_storageText: k_storageTextData,
k_storageTextActual: k_storageTextActualData
});
this.k_diskTotal = k_systemHealth.diskTotal;
k_fieldsetRam = this.k_getItem('k_fieldsetRam');
k_systemHealth.memoryTotal *= 1024; k_memoryTotalFormat = this.k_formatMaxValue(k_systemHealth.memoryTotal);
k_memoryTotal = kerio.waw.shared.k_methods.k_formatDataUnits(
{
k_value: k_systemHealth.memoryTotal,
k_numberFormat: {
k_decimalPlaces: k_memoryTotalFormat.k_decimalPlaces
}
}
);
k_fieldsetRam.k_extWidget.setTitle(kerio.lib.k_tr('RAM (total: %1)', 'systemHealth', {k_args: [k_memoryTotal.k_string]}));
this.k_drawGraph('k_cpu', k_systemHealth.cpu);
this.k_drawGraph('k_ram', k_systemHealth.memory, k_systemHealth.memoryTotal);
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_dialogs: ['systemHealthStorage']
});
}; 
k_kerioWidget.k_loadFiles = this.k_loadFiles; 
k_kerioWidget.k_drawGraph = function(k_type, k_data, k_dataMaxValue) {
var
k_isCpu = ('k_cpu' === k_type),
k_canvasId = (k_isCpu) ? 'k_graphPanelCpu' : 'k_graphPanelRam',
k_timeInterval = this.k_getTimeInterval(),
k_chartCfg, k_chart;
k_data = k_data || [];
if (!this.k_charts[k_type]) {
k_chartCfg = {
k_container: this[k_canvasId],
k_xAxis: {
k_fieldId: 'time',
k_renderer: function(k_value, k_data) {
var
k_tr = kerio.lib.k_tr,
k_timeInterval = this.k_relatedWidget.k_timeInterval,
k_nowText = 'k_day' === k_timeInterval.k_unit ? k_tr('Today', 'common') : k_tr('Now', 'common'),
k_date,
k_time;
if (!this.k_extWidget) {
return {k_data: ''};
}
if (k_value === k_data[0].time) {
return { k_data: k_nowText };
}
k_date = new Date(k_value);
k_time = k_date.format(k_timeInterval.k_format);
return {
k_data: k_time
};
}
},
k_yAxis: {
k_minValue: 0,
k_maxValue: 100,
k_ticks: kerio.waw.shared.k_CONSTANTS.k_CHART_TICKS_COUNT.k_PERCENT,
k_renderer: function(k_value) {
k_value += '%';
return {
k_data: k_value
};
}
},
k_series: [
{
k_fieldId: 'value',
k_color: (k_isCpu ? 2 : 0),
k_label: (k_isCpu)
? kerio.lib.k_tr('CPU usage', 'systemHealth')
: kerio.lib.k_tr('Memory usage', 'systemHealth'),
k_renderer: function(k_xValue, k_yValue, k_data) {
var
k_date = new Date(k_xValue),
k_day = k_date.format(kerio.waw.shared.k_CONSTANTS.k_DATE_TIME_FORMATS.k_DATE),
k_time = k_date.format(kerio.waw.shared.k_CONSTANTS.k_DATE_TIME_FORMATS.k_TIME_SEC),
k_methods = kerio.waw.shared.k_methods,
k_formatDataUnits = k_methods.k_formatDataUnits,
k_formatNumber = k_methods.k_formatNumber,
k_cfg = { k_decimalPlaces: 0 };
return {
k_data: kerio.lib.k_tr('Date: %1', 'systemHealth', { k_args: [k_day]})
+ '<br />'
+ kerio.lib.k_tr('Time: %1', 'systemHealth', { k_args: [k_time]})
+ '<br />'
+ ((this.k_maxValue)
? kerio.lib.k_tr('Usage: %1 of %2 (%3)', 'systemHealth', { k_args: [
k_formatDataUnits({ k_value: k_yValue * this.k_maxValue / 100 }).k_string,
k_formatDataUnits({ k_value: this.k_maxValue }).k_string,
k_formatNumber(k_yValue, k_cfg) + '%'
]})
: kerio.lib.k_tr('Usage: %1', 'systemHealth', { k_args: [ k_formatNumber(k_yValue, k_cfg) + '%' ]})
),
k_height: 55,
k_width: (this.k_maxValue) ? 320 : 150
};
}
}
]
};
k_chart = new kerio.lib.K_TimeChart(this.k_id + '_' + 'k_chart' + '_' + k_type, k_chartCfg);
k_chart.k_relatedWidget = this;
k_chart.k_maxValue = k_dataMaxValue;
this.k_charts[k_type] = k_chart;
} this.k_timeInterval = k_timeInterval;
k_data = this._k_processData(this._k_serverTime, k_data);
k_chartCfg = {
k_unit: k_timeInterval.k_unit,
k_step: k_timeInterval.k_step,
k_maxValue: k_data.k_endTime,
k_minValue: k_data.k_startTime
};
this.k_charts[k_type].k_setTimeAxis(k_chartCfg);
this.k_charts[k_type].k_setData(k_data.k_data);
if (this._k_isLoadMask) {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
this._k_isLoadMask = false;
}
}; 
k_kerioWidget._k_processData = function(k_endTime, k_data) {
var
k_out = {
k_endTime: 0,
k_startTime: 0,
k_data: []
},
k_date = k_endTime.date,
k_time = k_endTime.time,
k_interval,
k_i, k_cnt;
k_interval = this.k_timeInterval.k_interval * 1000; k_endTime = new Date(k_date.year, k_date.month, k_date.day, k_time.hour, k_time.min, k_time.sec);
k_endTime = Math.floor(k_endTime / k_interval) * k_interval; k_out.k_endTime = k_endTime;
k_out.k_startTime = k_endTime -  this.k_timeInterval.k_wholeTime; for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_out.k_data.push({
time: k_endTime - (k_i*k_interval),
value: k_data[k_i]
});
} if (!k_out.k_data.length) { k_out.k_data.push({
time: k_endTime,
value: 0
});
}
return k_out;
}; 
k_kerioWidget.k_getTimeInterval = function() {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_DATE_TIME_FORMATS = k_CONSTANTS.k_DATE_TIME_FORMATS,
k_webSharedConstants = k_CONSTANTS.kerio_web_SharedConstants;
switch (this.k_getItem('k_timeInterval').k_getValue()) {
case k_webSharedConstants.kerio_web_HistogramTwoHours:
return {
k_format: k_DATE_TIME_FORMATS.k_TIME_SEC,
k_unit: 'k_minute',
k_step: 5,
k_interval: 20, k_wholeTime: 7200000 };
case k_webSharedConstants.kerio_web_HistogramOneDay:
return {
k_format: k_DATE_TIME_FORMATS.k_TIME,
k_unit: 'k_hour',
k_step: 1,
k_interval: 300, k_wholeTime: 86400000 };
case k_webSharedConstants.kerio_web_HistogramOneWeek:
return {
k_format: k_DATE_TIME_FORMATS.k_DATE,
k_unit: 'k_day',
k_step: 1,
k_interval: 1800, k_wholeTime: 604800000 };
case k_webSharedConstants.kerio_web_HistogramOneMonth:
return {
k_format: k_DATE_TIME_FORMATS.k_DATE,
k_unit: 'k_day',
k_step: 1,
k_interval: 7200, k_wholeTime: 2678400000 };
default:
break;
}
};

k_kerioWidget.k_onActivate = function() {
var
k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_autorefresh = kerio.waw.status.k_userSettings.k_get(this.k_id + '.' + 'autorefresh', k_DEFINITIONS.k_AUTOREFRESH_INTERVAL),
k_charts = this.k_charts;
if (k_DEFINITIONS.k_AUTOREFRESH_DISABLED !== k_autorefresh) {
k_autorefresh = k_DEFINITIONS.k_AUTOREFRESH_INTERVAL;
}
this.k_onSetAutoRefreshInterval(k_autorefresh, true, true);
if (k_charts.k_cpu) {
k_charts.k_cpu.k_bypassDomRestore();
}
if (k_charts.k_ram) {
k_charts.k_ram.k_bypassDomRestore();
}
};

k_kerioWidget.k_onDeactivate = function() {
this.k_initAutoRefreshTask(0);
if (this.k_charts.k_cpu) {
this.k_charts.k_cpu.k_bypassDomRelease();
}
if (this.k_charts.k_ram) {
this.k_charts.k_ram.k_bypassDomRelease();
}
};

k_kerioWidget.k_initAutoRefreshTask = function(k_interval, k_startDeferred) {
var
k_tasks = kerio.waw.shared.k_tasks,
k_taskId = this.k_refreshTaskId;
if (0 === k_interval) {
k_tasks.k_remove(k_taskId, true); return; }
k_tasks.k_add({ k_id: k_taskId,
k_interval: k_interval,
k_scope: this,
k_startNow: true,
k_run: this.k_loadData,
k_startDeferred: k_startDeferred
});
};

k_kerioWidget.k_onSetAutoRefreshInterval = function(k_interval, k_startDeferred, k_avoidUserSettings) {
if (true !== k_avoidUserSettings) {
kerio.waw.status.k_userSettings.k_set(this.k_id + '.' + 'autorefresh', k_interval);
}
this.k_initAutoRefreshTask(k_interval, true === k_startDeferred);
this.k_autoRefreshGui.k_setValue(kerio.waw.shared.k_DEFINITIONS.k_AUTOREFRESH_DISABLED !== k_interval, true);
this.k_autoRefreshGui.k_ignoreOnChange = false;
};

k_kerioWidget.k_manualRefresh = function() {
this.k_disableRefresh(true);
this.k_loadData();
};

k_kerioWidget.k_disableRefresh = function(k_disabled) {
this.k_autoRefreshGui.k_setDisabled(k_disabled);
};

k_kerioWidget.k_formatMaxValue = function(k_value) {
var
kerio_web_SharedConstants = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_outputUnits,
k_multiple,
k_decimalPlaces,
k_maximumValue;
k_maximumValue = kerio.waw.shared.k_methods.k_formatDataUnits(
{
k_value: k_value
}
);
if (kerio_web_SharedConstants.kerio_web_MegaBytes === k_maximumValue.k_units) {
k_outputUnits = kerio_web_SharedConstants.kerio_web_MegaBytes;
k_decimalPlaces = 0;
k_multiple = 1024 * 1024;
} else {
k_outputUnits = k_maximumValue.k_units;
k_decimalPlaces = k_maximumValue.k_value > 10 ? 1 : 2;
k_multiple = 1024 * 1024 * 1024;
}
return {
k_outputUnits: k_outputUnits,
k_decimalPlaces: k_decimalPlaces,
k_multiple: k_multiple
};
};}, k_charts: { k_files: [], k_fileId: 0 },
k_loadData: kerio.waw.shared.k_methods.k_emptyFunction,

k_loadFiles: function() {
if (kerio.lib.K_TimeChart) {
this.k_loadData();
return;
}
if (!this.k_charts.k_files.length) {
this.k_charts.k_files = [
'weblib/int/graph/BaseComponent4.js?v=8629',
'weblib/int/graph/DataStore4.js?v=8629',
'weblib/int/graph/BaseChart.js?v=8629',
'weblib/int/graph/LineChart.js?v=8629',
'weblib/int/graph/TimeChart.js?v=8629'
];
kerio.lib.k_loadCss('weblib/ext/sandbox/ext-sandbox.css', true);
}
kerio.lib.k_ajax.k_request({
k_url: this.k_charts.k_files[this.k_charts.k_fileId],
k_method: 'GET',

k_callback: function (k_response) {
try {
eval(k_response.k_xhrResponse.responseText);
}
catch (k_err) {
kerio.lib.k_reportError('Internal error: Error during file loading ' + this.k_charts.k_files[this.k_charts.k_fileId], 'systemHealth');
}
this.k_charts.k_fileId++;
if (this.k_charts.k_fileId < this.k_charts.k_files.length) {
this.k_loadFiles();
}
else {
this.k_charts.k_files = []; this.k_loadData();
}
}, k_scope: this
});
},

_k_preloadFiles: function(){
if (!kerio.lib.k_widgets.systemHealthList) { kerio.waw.ui.systemHealth.k_loadFiles(); }
},

_k_preloadFilesDefer: function(k_interval) {
return this._k_preloadFiles.defer(k_interval, this);
}
}; kerio.waw.ui.systemHealth._k_preloadFilesDefer(1000);
