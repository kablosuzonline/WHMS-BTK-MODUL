
kerio.waw.ui.ipToolsList = {
k_init: function(k_objectName) {
var
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_WAW_DEFINITIONS = k_shared.k_DEFINITIONS,
k_tr = kerio.lib.k_tr,
k_localNamespace = k_objectName + '_',
k_anchor = kerio.lib.k_isMSIE ? '0 -34' : '0 -24',
k_inputWidth = kerio.lib.k_isIPadCompatible? undefined : 400,
k_MAX_OUTPUT_LINES = 500,
k_RUNNING_INDICATOR_STATUSES = {
k_READY: 'ready',
k_ACTIVE: 'active'
},
k_nothingToDisplayText =  k_tr('Nothing to display', 'ipToolsList'),
k_formPing, k_formPingCfg,
k_formTraceroute, k_formTracerouteCfg,
k_formDnsLookup, k_formDnsLookupCfg,
k_formWhois, k_formWhoisCfg,
k_layout, k_layoutCfg,
k_tabPage, k_tabPageCfg,
k_formOutput, k_formOutputCfg,
k_generateToolbar,
k_createToolRequest,
k_onEnterAction;

k_generateToolbar = function(k_idPrefix) {
return {
k_id: k_idPrefix + 'k_toolbar',
k_type: 'k_row',
k_items: [
'->',
{
k_id: k_idPrefix + '_' + 'k_runningIndicator',
k_type: 'k_display',
k_width: 100,
k_isLabelHidden: true,
k_className: 'runningIndicator',
k_value: ''
},
{
k_id: k_idPrefix + '_' + 'k_startButton',
k_type: 'k_formButton',
k_caption: kerio.lib.k_tr('Start', 'ipToolsList'),
k_onClick: function(k_form) {
if (k_form.k_isValid()) {
k_form.k_getMainWidget().k_onStartClick();
}
}
},
{
k_id: k_idPrefix + '_' + 'k_stopButton',
k_type: 'k_formButton',
k_caption: kerio.lib.k_tr('Stop', 'ipToolsList'),
k_isDisabled: true,
k_onClick: function(k_form) {
k_form.k_getMainWidget().k_onStopClick();
}
}
]
};
};

k_createToolRequest = function(k_requestMethod) {
return {
k_jsonRpc: {
method: 'IpTools.' + k_requestMethod,
params: {}
},
k_callback: function(){},
k_scope: this,
k_onError: kerio.waw.shared.k_methods.k_unmaskMainScreen.createCallback()
};
};

k_onEnterAction = function(k_form, k_item, k_event) {
if (!k_form.k_startButton.k_isDisabled() && kerio.lib.k_constants.k_EVENT.k_KEY_CODES.k_ENTER === k_event.keyCode) {
k_event.preventDefault();
if (k_form.k_isValid()) {
k_form.k_getMainWidget().k_onStartClick();
}
}
};

k_formPingCfg = {
k_labelWidth: 80,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Parameters', 'ipToolsList'),
k_anchor: k_anchor,
k_items: [
{
k_id: 'target',
k_caption: k_tr('Target:', 'ipToolsList'),
k_width: k_inputWidth,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_ipToolsTargetValidator'
},
k_onKeyDown: k_onEnterAction
},
{
k_id: 'ipv',
k_caption: k_tr('Protocol:', 'ipToolsList'),
k_type: 'k_select',
k_localData: k_WAW_DEFINITIONS.k_IP_TOOL_PROTOCOL_MAP,
k_value: k_WAW_CONSTANTS.IpVersion.IpVersionAny,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_width: k_inputWidth,
k_onKeyDown: k_onEnterAction
},
{
k_id: 'infinite',
k_caption: k_tr('Count:', 'ipToolsList'),
k_type: 'k_select',
k_localData: [
{ k_id: true, k_name: k_tr('Unlimited', 'ipToolsList') },
{ k_id: false, k_name: k_tr('10 packets', 'ipToolsList') }
],
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_width: k_inputWidth,
k_onKeyDown: k_onEnterAction
},
{
k_id: 'packetSize',
k_type: 'k_number',
k_caption: k_tr('Size:', 'ipToolsList'),
k_value: 56,
k_width: k_inputWidth,
k_minValue: 0,
k_maxValue: 65507,
k_maxLength: 5,
k_validator: {
k_allowBlank: false
},
k_onKeyDown: k_onEnterAction
},
{
k_id: 'allowFragmentation',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_isChecked: true,
k_option: k_tr('Allow fragmentation', 'ipToolsList')
}
]
},
k_generateToolbar('k_ping')
]
};
k_formPing = new kerio.lib.K_Form(k_localNamespace + 'k_formPing', k_formPingCfg);
k_formPing.k_addReferences({
k_target: k_formPing.k_getItem('target'),
k_runningIndicator: k_formPing.k_getItem('k_ping' + '_' + 'k_runningIndicator'),
k_startButton: k_formPing.k_getItem('k_ping' + '_' + 'k_startButton'),
k_stopButton: k_formPing.k_getItem('k_ping' + '_' + 'k_stopButton'),
k_commandRequest: k_createToolRequest('ping')
});

k_formTracerouteCfg = {
k_labelWidth: 80,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Parameters', 'ipToolsList'),
k_anchor: k_anchor,
k_items: [
{
k_id: 'target',
k_caption: k_tr('Target:', 'ipToolsList'),
k_width: k_inputWidth,
k_validator: {
k_allowBlank: false
},
k_onKeyDown: k_onEnterAction
},
{
k_id: 'ipv',
k_caption: k_tr('Protocol:', 'ipToolsList'),
k_type: 'k_select',
k_localData: k_WAW_DEFINITIONS.k_IP_TOOL_PROTOCOL_MAP,
k_value: k_WAW_CONSTANTS.IpVersion.IpVersionAny,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_width: k_inputWidth,
k_onKeyDown: k_onEnterAction
},
{
k_id: 'resolveHostnames',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Resolve addresses to hostnames', 'ipToolsList')
}
]
},
k_generateToolbar('k_tracert')
]
};
k_formTraceroute = new kerio.lib.K_Form(k_localNamespace + 'k_formTracert', k_formTracerouteCfg);
k_formTraceroute.k_addReferences({
k_target: k_formTraceroute.k_getItem('target'),
k_runningIndicator: k_formTraceroute.k_getItem('k_tracert' + '_' + 'k_runningIndicator'),
k_startButton: k_formTraceroute.k_getItem('k_tracert' + '_' + 'k_startButton'),
k_stopButton: k_formTraceroute.k_getItem('k_tracert' + '_' + 'k_stopButton'),
k_commandRequest: k_createToolRequest('traceRoute')
});

k_formDnsLookupCfg = {
k_labelWidth: 80,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Parameters', 'ipToolsList'),
k_anchor: k_anchor,
k_items: [
{
k_id: 'name',
k_caption: k_tr('Name:', 'ipToolsList'),
k_width: k_inputWidth,
k_validator: {
k_allowBlank: false
},
k_onKeyDown: k_onEnterAction
},
{
k_type: 'k_radio',
k_groupId: 'tool',
k_caption: k_tr('Tool:', 'ipToolsList'),
k_option: 'nslookup',
k_isChecked: true,
k_value: k_WAW_CONSTANTS.DnsTool.DnsToolNslookup
},
{
k_type: 'k_radio',
k_groupId: 'tool',
k_option: 'dig',
k_value: k_WAW_CONSTANTS.DnsTool.DnsToolDig
},
{
k_id: 'server',
k_type: 'k_selectTypeAhead',
k_caption: k_tr('Server:', 'ipToolsList'),
k_isEditable: true,
k_highlightClassName: 'x-combo-list x-combo-selected',
k_fieldDisplay: 'k_server',
k_fieldValue: 'k_server',
k_localData: [],
k_width: k_inputWidth,
k_onFocus: function() {
this.k_setValue('');
this.k_extWidget.onTriggerClick.call(this.k_extWidget);
},
k_onKeyDown: k_onEnterAction
},
{
k_id: 'type',
k_caption: k_tr('Type:', 'ipToolsList'),
k_type: 'k_select',
k_localData: k_WAW_DEFINITIONS.k_DNS_LOOKUP_TYPE_MAP,
k_value: k_WAW_CONSTANTS.DnsType.DnsTypeA,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_width: k_inputWidth,
k_onKeyDown: k_onEnterAction
}
]
},
k_generateToolbar('k_dnsLookup')
]
};
k_formDnsLookup = new kerio.lib.K_Form(k_localNamespace + 'k_formDnsLookup', k_formDnsLookupCfg);
k_formDnsLookup.k_getItem('server').k_extWidget.lazyInit = false;
k_formDnsLookup.k_addReferences({
k_target: k_formDnsLookup.k_getItem('name'),
k_serverSelect: k_formDnsLookup.k_getItem('server'),
k_runningIndicator: k_formDnsLookup.k_getItem('k_dnsLookup' + '_' + 'k_runningIndicator'),
k_startButton: k_formDnsLookup.k_getItem('k_dnsLookup' + '_' + 'k_startButton'),
k_stopButton: k_formDnsLookup.k_getItem('k_dnsLookup' + '_' + 'k_stopButton'),
k_commandRequest: k_createToolRequest('dns')
});

k_formWhoisCfg = {
k_labelWidth: 80,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Parameters', 'ipToolsList'),
k_anchor: k_anchor,
k_items: [
{
k_id: 'target',
k_caption: k_tr('Host:', 'ipToolsList'),
k_width: k_inputWidth,
k_validator: {
k_allowBlank: false
},
k_onKeyDown: k_onEnterAction
}
]
},
k_generateToolbar('k_whois')
]
};
k_formWhois = new kerio.lib.K_Form(k_localNamespace + 'k_formWhois', k_formWhoisCfg);
k_formWhois.k_addReferences({
k_target: k_formWhois.k_getItem('target'),
k_runningIndicator: k_formWhois.k_getItem('k_whois' + '_' + 'k_runningIndicator'),
k_startButton: k_formWhois.k_getItem('k_whois' + '_' + 'k_startButton'),
k_stopButton: k_formWhois.k_getItem('k_whois' + '_' + 'k_stopButton'),
k_commandRequest: k_createToolRequest('whois')
});
k_tabPageCfg = {
k_className: 'tabsInMainPane',
k_items: [
{
k_id: 'k_tabPing',
k_caption: 'Ping',
k_content: k_formPing,
k_active: true
},
{
k_id: 'k_tabTraceroute',
k_caption: 'Traceroute',
k_content: k_formTraceroute
},
{
k_id: 'k_tabDnsLookup',
k_caption: 'DNS Lookup',
k_content: k_formDnsLookup
},
{
k_id: 'k_tabWhois',
k_caption: 'Whois',
k_content: k_formWhois
}
],
k_onTabChange: function(k_tabPage, k_currentTabId) {
var
k_layout = this.k_layout,
k_previousActiveTab = k_tabPage.k_activePage,
k_newActiveTab = k_tabPage.k_getTabContent(k_currentTabId),
k_isCommandActive;
if (k_previousActiveTab) {
k_isCommandActive = k_previousActiveTab.k_startButton.k_isDisabled();
k_newActiveTab.k_startButton.k_setDisabled(k_isCommandActive);
k_newActiveTab.k_stopButton.k_setDisabled(!k_isCommandActive);
k_layout.k_switchRunningIndicator(k_layout.k_runningIndicatorStatus);
if (k_isCommandActive) {
k_newActiveTab.k_stopButton.k_focusItem();
}
else {
k_newActiveTab.k_target.k_focusItem();
}
}
k_tabPage.k_activePage = k_newActiveTab;
}
};
k_tabPage = new kerio.lib.K_TabPage(k_localNamespace + 'k_tabPage', k_tabPageCfg);

k_formOutputCfg = {
k_className: 'formOutput',
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Command output', 'ipToolsList'),
k_anchor: '100% 100%',
k_items: [
{
k_id: 'k_console',
k_type: 'k_textArea',
k_maxLength: -1,
k_anchor: '100% 100%',
k_className: 'ipToolsOutput emptyText',
k_isLabelHidden: true,
k_isReadOnly: true,
k_value: k_nothingToDisplayText
}
]
}
]
};
k_formOutput = new kerio.lib.K_Form(k_localNamespace + 'k_formOutput', k_formOutputCfg);
k_formOutput.k_addReferences({
k_console: k_formOutput.k_getItem('k_console')
});
k_layoutCfg = {
k_className: 'splittedLayout ipToolsList',
k_verLayout: {
k_items: [
{
k_id: 'k_mainPane',
k_content: k_tabPage,
k_iniSize: 250,
k_minSize: 230,
k_showSplitter: true
},
{
k_id: 'k_detailsPane',
k_content: k_formOutput,
k_minSize: 300,
k_iniSize: '50%'
}
]
}
};
k_layout = new kerio.lib.K_Layout(k_objectName, k_layoutCfg);
k_layout.k_addReferences({
k_tabPage: k_tabPage,
k_formOutput: k_formOutput,
k_formPing: k_formPing,
k_formTraceroute: k_formTraceroute,
k_formDnsLookup: k_formDnsLookup,
k_formWhois: k_formWhois,
k_selectedTab: null,
k_preselectIp: null,
k_getStatusTaskId: 'k_GET_STATUS_TASK',
k_MAX_OUTPUT_LINES: k_MAX_OUTPUT_LINES,
k_consoleLines: [''],
k_RUNNING_INDICATOR_STATUSES: k_RUNNING_INDICATOR_STATUSES,
k_runningIndicatorStatus: k_RUNNING_INDICATOR_STATUSES.k_READY,
k_runningIndicatorActiveText: k_tr('Running', 'ipToolsList'),
k_nothingToDisplayText: k_nothingToDisplayText
});
this.k_addControllers(k_layout);
k_tabPage.k_addReferences({
k_layout: k_layout,
k_formOutput: k_formOutput,
k_activePage: undefined
});
k_layout.k_onActivate = this.k_resumeGetStatusTask;
k_layout.k_onDeactivate = function() {
this.k_resumeGetStatusTask(false);
};
return k_layout;
}, k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function() {
var
k_methods = kerio.waw.shared.k_methods;
if (k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
if (!this.k_getStatusRequest) {
this.k_getStatusRequest = {
k_jsonRpc: {
method: 'IpTools.getStatus'
},
k_callback: this.k_getStatusCallback,
k_scope: this,
k_onError: k_methods.k_unmaskMainScreen.createCallback()
};
}
if (!this.k_getDataRequests) {
this.k_getDataRequests = [
{
k_jsonRpc: {
method: 'IpTools.getDnsServers'
},
k_callback: this.k_getDnsServersCallback,
k_scope: this,
k_onError: k_methods.k_unmaskMainScreen.createCallback()
},
this.k_getStatusRequest
];
}
k_methods.k_maskMainScreen();
kerio.waw.requests.k_sendBatch(this.k_getDataRequests);
};

k_kerioWidget.k_getDnsServersCallback = function(k_response, k_success) {
var
k_data = [],
k_servers = k_response && k_response.servers instanceof Array ? k_response.servers : [],
k_cnt, k_i;
if (k_success) {
for (k_i = 0, k_cnt = k_servers.length; k_i < k_cnt; k_i++) {
k_data.push({k_server: k_servers[k_i]});
}
}
this.k_formDnsLookup.k_serverSelect.k_setData(k_data);
};
k_kerioWidget.k_resumeGetStatusTask = function(k_resume) {
var
k_isResume = false !== k_resume,
k_tasks = kerio.waw.shared.k_tasks;
if (k_tasks.k_isDefined(this.k_getStatusTaskId)) {
if (k_isResume) {
k_tasks.k_resume(this.k_getStatusTaskId, true);
}
else {
k_tasks.k_suspend(this.k_getStatusTaskId);
}
}
};

k_kerioWidget.k_getStatusTaskCallback = function(k_response) {
this.k_getStatusCallback(k_response.k_decoded, kerio.waw.shared.k_methods.k_responseIsOk(k_response));
};

k_kerioWidget.k_getStatusCallback = function(k_response, k_success) {
var
k_shared = kerio.waw.shared,
ActiveTool = k_shared.k_CONSTANTS.ActiveTool,
k_tasks = k_shared.k_tasks,
k_activeTab = this.k_tabPage.k_activePage;
if (!this.k_getStatusTaskRequest) {
this.k_getStatusTaskRequest = kerio.lib.k_cloneObject(this.k_getStatusRequest);
this.k_getStatusTaskRequest.k_callback = this.k_getStatusTaskCallback;
}
if (!k_tasks.k_isDefined(this.k_getStatusTaskId)) {
k_tasks.k_add({
k_id: this.k_getStatusTaskId,
k_interval: 1000,
k_scope: this,
k_startNow: true,
k_startSuspended: true,

k_run: function(){
kerio.lib.k_ajax.k_request(this.k_getStatusTaskRequest);
return false;
}
});
}
if (k_success) {
switch(k_response.activeTool) {
case ActiveTool.ActiveToolPing:
case ActiveTool.ActiveToolTraceRoute:
case ActiveTool.ActiveToolDns:
case ActiveTool.ActiveToolWhois:
if (0 !== k_response.lines.length) {
this.k_writeOutputLines(k_response.lines);
}
this.k_resumeGetStatusTask();
k_activeTab.k_startButton.k_setDisabled(true);
k_activeTab.k_stopButton.k_setDisabled(false);
break;
case ActiveTool.ActiveToolNone:
if (0 !== k_response.lines.length) {
this.k_writeOutputLines(k_response.lines);
this.k_resumeGetStatusTask();
}
else {
this.k_consoleLines = [''];
this.k_resumeGetStatusTask(false);
}
if(this.k_RUNNING_INDICATOR_STATUSES.k_ACTIVE === this.k_runningIndicatorStatus) {
this.k_switchRunningIndicator(this.k_RUNNING_INDICATOR_STATUSES.k_READY);
}
k_activeTab.k_startButton.k_setDisabled(false);
k_activeTab.k_stopButton.k_setDisabled(true);
break;
}
}
kerio.waw.shared.k_methods.k_unmaskMainScreen();
};

k_kerioWidget.k_writeOutputLines = function (k_lines) {
var
k_MAX_OUTPUT_LINES = this.k_MAX_OUTPUT_LINES,
k_consoleElement = this.k_formOutput.k_console.k_extWidget.el.dom,
k_scrollToBottom = true,
k_consoleLinesCnt,
k_newLinesCnt;
k_consoleLinesCnt = this.k_consoleLines.length;
if (0 === k_consoleLinesCnt) {
k_scrollToBottom = true;
}
else {
k_scrollToBottom = k_consoleElement.scrollTop >= (k_consoleElement.scrollHeight - k_consoleElement.clientHeight);
}
k_newLinesCnt = k_lines.length;
this.k_consoleLines = this.k_consoleLines.concat(k_lines);
k_consoleLinesCnt = k_consoleLinesCnt + k_newLinesCnt;
if (k_MAX_OUTPUT_LINES <= k_consoleLinesCnt) {
this.k_consoleLines.splice(0, k_consoleLinesCnt - k_MAX_OUTPUT_LINES);
}
this.k_formOutput.k_console.k_setRawValue(this.k_consoleLines.join('\n'));
if(k_scrollToBottom) {
k_consoleElement.scrollTop = k_consoleElement.scrollHeight;
}
};

k_kerioWidget.k_onStartClick = function() {
var
k_methods = kerio.waw.shared.k_methods,
k_activeTab = this.k_tabPage.k_activePage,
k_request;
if (k_activeTab.k_id === this.k_formDnsLookup.k_id && '' === k_activeTab.k_serverSelect.k_getValue()) {
k_activeTab.k_serverSelect.k_selectByIndex(0);
}
this.k_formOutput.k_console.k_removeClassName('emptyText');
this.k_formOutput.k_console.k_setValue('');
this.k_switchRunningIndicator(this.k_RUNNING_INDICATOR_STATUSES.k_ACTIVE);
k_activeTab.k_commandRequest.k_jsonRpc.params = k_activeTab.k_getData();
k_request = [
k_activeTab.k_commandRequest,
this.k_getStatusRequest
];
k_methods.k_maskMainScreen();
kerio.waw.requests.k_sendBatch(k_request);
k_activeTab.k_startButton.k_setDisabled(true);
k_activeTab.k_stopButton.k_setDisabled(false);
k_activeTab.k_stopButton.k_focusItem();
};

k_kerioWidget.k_switchRunningIndicator = function(k_status) {
var
k_RUNNING_INDICATOR_STATUSES = this.k_RUNNING_INDICATOR_STATUSES,
k_activeTab = this.k_tabPage.k_activePage;
k_activeTab.k_runningIndicator.k_removeClassName([k_RUNNING_INDICATOR_STATUSES.k_READY,
k_RUNNING_INDICATOR_STATUSES.k_ACTIVE]);
k_activeTab.k_runningIndicator.k_addClassName(k_status);
this.k_runningIndicatorStatus = k_status;
switch (k_status) {
case k_RUNNING_INDICATOR_STATUSES.k_READY:
k_activeTab.k_runningIndicator.k_setValue('');
break;
case k_RUNNING_INDICATOR_STATUSES.k_ACTIVE:
k_activeTab.k_runningIndicator.k_setValue(this.k_runningIndicatorActiveText);
break;
}
};

k_kerioWidget.k_onStopClick = function() {
var
k_methods = kerio.waw.shared.k_methods;
if (!this.k_getStopRequests) {
this.k_getStopRequests = [
{
k_jsonRpc: {
method: 'IpTools.stop'
},
k_callback: function(){},
k_scope: this,
k_onError: k_methods.k_unmaskMainScreen.createCallback()
},
this.k_getStatusRequest
];
}
k_methods.k_maskMainScreen();
kerio.waw.requests.k_sendBatch(this.k_getStopRequests);
};
} };
