
kerio.waw.ui.appManagerSettings = function(k_objectName, k_initParams) {
k_initParams = k_initParams || {};
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_kerioLibraryRoot = k_lib.k_kerioLibraryRoot,
k_JOIN_LINK = 'joinAppManagerLink',
k_VISIT_LINK = 'visitAppManagerLink',
k_SMTP_LINK = 'smtpAppManagerLink',
k_BACKUP_LINK = 'backupAppManagerLink',
k_START_LINK = 'startAgentLink',
k_RESTART_LINK = 'restartAgentLink',
k_STOP_LINK = 'stopAgentLink',
k_PRODUCT_NAME = k_lib.k_getSharedConstants('k_PRODUCT_NAME'),
k_showApplyReset = k_initParams.k_showApplyReset,
k_displayMarketing = k_initParams.k_displayMarketing,
k_isAuditor = k_initParams.k_isAuditor,
_k_saveMethod = k_initParams.k_saveMethod,
_k_loadStatusCallback = k_initParams.k_statusCallback,
k_statusTexts,
k_agentStatusTexts,
k_formCfg;
k_statusTexts = {
statusWaiting:      k_tr('Waiting for a response from AppManager…', 'remoteServices'),
statusRegistering:  k_tr('Waiting for the registration in AppManager…', 'remoteServices'),
statusNotAdded:     k_tr('Not registered. You have to %1add this %2%3 to your GFI account to manage it.', 'remoteServices', {k_args: [k_isAuditor ? '' : '<a id="' + k_JOIN_LINK + '">', k_PRODUCT_NAME, k_isAuditor ? '' : '</a>'], k_isSecure: true}),
statusDisabled:     k_tr('Disabled. Communication with AppManager is disabled.', 'remoteServices'),
statusDisconnected: k_tr('Disconnected. %1 is trying to establish connection with AppManager.', 'remoteServices', {k_args: [k_PRODUCT_NAME]}),
statusReady:        k_tr('Registered. You can manage this %1 in %2AppManager%3.', 'remoteServices', {k_args: [k_PRODUCT_NAME, '<a id="' + k_VISIT_LINK + '">', '</a>'], k_isSecure: true})
};
k_agentStatusTexts = {
statusNotRunning:  k_tr('The GFI Agent service is not running. Please %1start%2 the GFI Agent to allow communication with AppManager.', 'remoteServices', {k_args: ['<a id="' + k_START_LINK + '">', '</a>'], k_isSecure: true}),
getStatusRunning: function(version) {
return k_tr('The GFI Agent service is running, version: %1. You can %2restart service%3 or %4stop service%5.', 'remoteServices', {k_args: [version, '<a id="' + k_RESTART_LINK + '">', '</a>', '<a id="' + k_STOP_LINK + '">', '</a>'], k_isSecure: true});
}
}
k_formCfg = {
k_useStructuredData: true,
k_restrictBy: {
k_isAuditor: k_isAuditor
},
k_labelWidth: 240,
k_onChange: function () {
this._k_onSettingsChanged();
if (this.k_showApplyReset) {
kerio.adm.k_framework.k_enableApplyReset(true);
}
else {
this.k_saveData();
}
},
k_items: [
{
k_type: 'k_fieldset',
k_id: 'k_appManagerFieldset',
k_className: 'appManagerFieldset',
k_caption: k_tr('AppManager settings', 'remoteServices'),
k_isDisabled: false,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'k_enabled',
k_isLabelHidden: true,
k_restrictions: {
k_isAuditor: [ false ]
},
k_option: k_tr('Enable communication with GFI AppManager', 'remoteServices')
},
{
k_type: 'k_display',
k_id: 'k_warningMessage',
k_icon: 'img/warning.png?v=8629',
k_className: 'warningImgIcon',
k_isHidden: true,
k_isLabelHidden: true,
k_isSecure: true,
k_value: 'The AppManager is currently selected as a backup service. Before disconnecting, please select a different backup option in the Backups tab first',
k_restrictions: {
k_isAuditor: [ false ]
}
},
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('You can use %1AppManager%2 to remotely manage all of your %3 appliances, as a %4notification service%5, and as a %6backup service%7.', 'remoteServices', {k_args: ['<a id="' + k_VISIT_LINK + '">', '</a>', 'Kerio Control', '<a id="' + k_SMTP_LINK + '">','</a>', '<a id="' + k_BACKUP_LINK + '">','</a>'], k_isSecure: true}),
k_onLinkClick: function(k_form, k_item, k_id) {
switch(k_id) {
case k_VISIT_LINK:
k_form.k_openAppManagerWeb();
break;
case k_SMTP_LINK:
k_form.k_gotoSmtpFunction();
break;
case k_BACKUP_LINK:
k_form.k_gotoBackupFunction();
break;
}
}
},
{
k_type: 'k_display',
k_id: 'k_appManagerStatusInfo',
k_className: 'appManagerStatus statusWaiting',
k_isSecure: true,
k_value: {
k_info: k_statusTexts.statusWaiting,
},
k_template: '<i class="icon"></i>{k_info}',
k_onLinkClick: function(k_form, k_item, k_id) {
switch(k_id) {
case k_VISIT_LINK:
kerio.lib.k_openWindow(k_form._k_appUrl, '_blank');
break;
case k_JOIN_LINK:
k_form.k_registerAppliance();
break;
}
}
},
{
k_type: 'k_display',
k_id: 'k_appManagerAgentInfo',
k_className: 'gfiAgentStatus',
k_isSecure: true,
k_isHidden: true,
k_value: {
k_info: k_agentStatusTexts.statusNotRunning,
},
k_template: '<i class="icon"></i>{k_info}',
k_onLinkClick: function(k_form, k_item, k_id) {
switch(k_id) {
case k_START_LINK:
k_form.k_runAgentManagementCommand('start');
break;
case k_RESTART_LINK:
k_form.k_runAgentManagementCommand('restart');
break;
case k_STOP_LINK:
k_form.k_runAgentManagementCommand('stop');
break;
}
}
},
{
k_type: 'k_formButton',
k_caption: k_tr('Register in AppManager', 'remoteServices'),
k_isHidden: true,
k_id: 'k_appManagerRegister',
k_restrictions: {
k_isAuditor: [ false ]
},

k_onClick: function(k_form) {
k_form.k_registerAppliance();
}
},
{
k_type: 'k_formButton',
k_caption: k_tr('Remove from AppManager', 'remoteServices'),
k_restrictions: {
k_isAuditor: [ false ]
},
k_isHidden: true,
k_id: 'k_appManagerRemove',

k_onClick: function(k_form) {
k_form.k_disconnectConfirm();
}
}
]
}
]
};
kerio.waw.ui.appManagerSettings.superclass.constructor.call(this, k_objectName, k_formCfg);
this.k_addReferences({
k_isAuditor: k_isAuditor,
k_JOIN_LINK: k_JOIN_LINK,
k_showApplyReset: k_showApplyReset,
_k_data: {},
_k_appUrl: kerio.waw.shared.k_CONSTANTS.k_APPMANAGER_URL,
_k_joinUrl: kerio.waw.shared.k_CONSTANTS.k_APPMANAGER_URL,
_k_statusTexts: k_statusTexts,
_k_agentStatusTexts: k_agentStatusTexts,
_k_updateTaskId: 'k_appManagerStatusUpdateTask',
_k_task: false,
_k_saveMethod: _k_saveMethod,
_k_loadStatusCallback: _k_loadStatusCallback,
k_openAppManagerWeb: function() {
kerio.lib.k_openWindow(this._k_appUrl, '_blank');
},
k_registerAppliance: function () {
function onRegisterResponse(k_response, k_success) {
if (k_success && k_response.k_isOk && !k_response.k_decoded.errors.length) {
var info = k_response.k_decoded.info;
kerio.lib.k_openWindow(info.registrationbUrl, '_blank');
}
}
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'CentralManagement.registerInAppManager'
},
k_callback: onRegisterResponse,
k_scope: this
});
},
k_runAgentManagementCommand: function(command) {
function onCommandResponse(k_response, k_success) {
if (k_success && k_response.k_isOk) {
}
}
var k_agentInfoElement = this.k_getItem('k_appManagerAgentInfo');
k_agentInfoElement.k_addClassName('inProgress');
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'CentralManagement.agentManagement',
params: {
command: command
}
},
k_callback: onCommandResponse,
k_scope: this
});
},
k_getSaveRequests: function() {
var k_data;
k_data = this.k_getData();
if (!k_data) {
return [];
}
return [{
k_method: 'CentralManagement.setAppManagerEnabled',
k_params: {
enabled: k_data.k_enabled
}
}];
},
_k_onSettingsChanged: function() {
var k_data = this.k_getData() || {},
k_disableControls = (k_data.k_enabled === false);
this.k_setDisabled(['k_appManagerStatusInfo', 'k_appManagerRemove', 'k_appManagerAgentInfo', 'k_appManagerRegister'], k_disableControls);
}
});
if (k_isAuditor) {
this.k_setReadOnlyAll();
}
}; kerio.lib.k_extend('kerio.waw.ui.appManagerSettings', kerio.lib.K_Form, {


k_applyParams: function(k_params) {
k_params = k_params || {};
if (this.k_isCallFromOtherScreens()) {
this.k_reset();
}
this.k_loadData();
this.k_loadStatus(true);
this.k_startUpdateTask();
},

k_isCallFromOtherScreens: function () {
return !(kerio.adm.k_framework._k_targetChoice &&
kerio.adm.k_framework._k_previousWidgetId) ||
(kerio.adm.k_framework._k_targetChoice.k_id === 'integration' &&
kerio.adm.k_framework._k_previousWidgetId !== 'integration_k_tabs');
},

k_loadData: function() {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Batch.run',
params: {
commandList: [
{
method: 'CentralManagement.getAppManager',
params: {
extendedInfo: false
}
},
{
method: 'CentralManagement.agentManagement',
params: {
command: 'status'
}
}
]
}
},
k_callback: this._k_setConfig,
k_scope: this
});
},

_k_setConfig: function(k_response, k_success) {
var k_config,
k_appManagerInfo;
if (k_success && k_response.k_isOk) {
k_appManagerInfo = k_response.k_decoded[0];
k_config = {
k_enabled: k_appManagerInfo.status.enabled
};
this.k_setData(k_config, true);
this._k_setStatus(k_response, k_success);
this._k_enabled = k_config.k_enabled;
kerio.adm.k_framework.k_enableApplyReset(false);
}
},

k_loadStatus: function(extendedInfo) {
var k_config = this.k_getData();
if (k_config.k_enabled === false) {
return;
}
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Batch.run',
params: {
commandList: [
{
method: 'CentralManagement.getAppManager',
params: {
extendedInfo: extendedInfo
}
},
{
method: 'CentralManagement.agentManagement',
params: {
command: 'status'
}
}
]
}
},
k_callback: this._k_setStatus,
k_scope: this
});
},

_k_setStatus: function(k_response, k_success) {
const k_decoded = k_response.k_decoded;
if (k_success && k_response.k_isOk && !k_decoded[0].errors.length) {
var k_status = k_decoded[0].status,
k_agentStatus = k_decoded[1].agentStatus.status,
k_agentRunning = k_agentStatus === 'Running',
k_data = this.k_getData() || {},
k_applianceStatus = this._k_translateAppmanagerStatus(k_status.status);
if (k_status.managementUrl) {
this._k_appUrl = k_status.managementUrl;
}
if (!k_status.enabled) {
k_applianceStatus = 'statusDisabled';
} else if (!k_status.queryStatus && !k_status.connectionStatus || (!k_status.connectionStatus && k_status.status === 'ApplianceRegistered')) {
k_applianceStatus = 'statusDisconnected';
}
this.k_switchStatus(k_applianceStatus, k_agentRunning, k_status.version);
if (!k_status.enabled) {
this.k_setVisible(['k_appManagerStatusInfo'], true);
this.k_setVisible(['k_appManagerRemove'], false);
this.k_setVisible(['k_appManagerAgentInfo'], false);
this.k_setVisible(['k_appManagerRegister'], false);
if (this._k_loadStatusCallback) {
this._k_loadStatusCallback(k_status);
}
return;
}
this.k_setVisible(['k_appManagerRemove'], k_status.status === 'ApplianceRegistered');
this.k_setVisible(['k_appManagerAgentInfo'], true);
var canRegister = k_status.signUpStatus && (k_status.status === 'ApplianceNotRegistered');
var registering = k_status.status === 'ApplianceRegistring';
this.k_setVisible(['k_appManagerRegister'], canRegister || registering);
if (this._k_loadStatusCallback) {
this._k_loadStatusCallback(k_status);
}
}
},

_k_translateAppmanagerStatus: function(k_status) {
switch (k_status) {
case 'ApplianceNotRegistered':
return 'statusNotAdded';
case 'ApplianceRegistring':
return 'statusRegistering';
case 'ApplianceRegistered':
return 'statusReady';
default:
return 'statusNotAdded';
}
},

k_switchStatus: function(k_status, k_agentRunning, k_agentVersion) {
var
k_statusElement = this.k_getItem('k_appManagerStatusInfo'),
k_agentInfoElement = this.k_getItem('k_appManagerAgentInfo'),
k_statusTexts = this._k_statusTexts,
k_agentStatusTexts = this._k_agentStatusTexts;
k_statusElement.k_setValue({
k_info: k_statusTexts[k_status]
});
k_statusElement.k_removeClassName(['statusWaiting', 'statusRegistering', 'statusNotAdded', 'statusDisabled', 'statusDisconnected', 'statusReady']);
k_statusElement.k_addClassName(k_status);
this.k_setVisible(['k_appManagerStatusInfo'], k_agentRunning);
k_agentInfoElement.k_removeClassName(['statusDisconnected', 'statusReady', 'inProgress']);
k_agentInfoElement.k_addClassName(k_agentRunning ? 'statusReady' : 'statusDisconnected');
var k_infoText = k_agentRunning ? k_agentStatusTexts.getStatusRunning(k_agentVersion ?? 'Unknown') : k_agentStatusTexts.statusNotRunning;
k_agentInfoElement.k_setValue({
k_info: k_infoText
});
},

k_startUpdateTask: function() {
if (!this._k_task) {
this._k_task = new kerio.lib.K_TaskRunner({
k_precision: 333,
k_taskList: [{
k_id: this._k_updateTaskId,
k_run: function() {
this.k_loadStatus(false);
},
k_scope: this,
k_interval: 4000,
k_startNow: true
}]
});
}
this._k_task.k_resume(this._k_updateTaskId);
},

k_stopUpdateTask: function() {
if (this._k_task) {
this._k_task.k_suspend(this._k_updateTaskId);
}
},

k_saveDataCallback: function() {
if  (!this.k_showApplyReset) {
this.k_loadData();
}
},

k_saveData: function() {
var
k_data = this.k_getData();
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'CentralManagement.setAppManagerEnabled',
params: {
enabled: k_data.k_enabled
}
},
k_callback: this.k_saveDataCallback,
k_scope: this
});
},

k_disconnectConfirm: function() {
kerio.lib.k_confirm({
k_title: kerio.lib.k_tr('Confirm Action', 'common'),
k_msg: kerio.lib.k_tr('Are you sure you want to remove this appliance from AppManager?', 'remoteServices'),
k_callback: function(k_response) {
if ('no' === k_response) {
return;
}
this.k_disconnect();
},
k_scope: this
});
},

k_disconnect: function() {
kerio.lib.k_maskWidget(this);
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'CentralManagement.removeFromAppManager'
},
k_callback: function() {
kerio.lib.k_unmaskWidget(this);
this.k_loadData();
},
k_scope: this
});
}
}); 