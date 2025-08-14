
kerio.waw.shared = kerio.waw.shared || {};
kerio.waw.shared.k_widgets = kerio.waw.shared.k_widgets || {};

kerio.waw.shared.k_widgets._K_Requests = function(){
var
k_constructor = kerio.waw.shared.k_widgets._K_Requests,
k_ajax = kerio.lib.k_ajax;
if (k_constructor._k_instance) {
return k_constructor._k_instance;
}
else { k_constructor._k_instance = this;
}
k_constructor.superclass.constructor.call(this, {});
this.addEvents({
beforeSend: true,
afterSend: true,
beforeCallback: true,
afterCallback: true,
beforeError: true,
beforeReconnectError: true,
beforeConfirmError: true,
afterCutOff: true,
beforeReconnect: true,
beforeConfirm: true,
afterConfirm: true,
beforeLogout: true,
beforeMask: true,
beforeUnmask: true,
notificationUpdate: true,
beforeLicenseUpdate: true,
afterLicenseUpdate: true
});
this._k_connectionState = this._k_CONNECTION_OK;
this._k_sendServices = new kerio.lib.K_TaskRunner({
k_taskList: [
{
k_id: 'k_send',
k_run: this.k_sendNow,
k_interval: 10,
k_scope: this,
k_startNow: true,        k_startSuspended: true   },
{
k_id: this._K_TASK_ID_KEEP_ALIVE,
k_run: this._k_keepAlive,
k_interval: (kerio.waw.activation ? 30000 : 500), k_scope: this
},
{
k_id: this._K_TASK_ID_RESTARTING,
k_run: this._k_tryToReconnect,
k_interval: 3000,
k_scope: this
},
{
k_id: this._K_TASK_ID_CACHING,
k_run: this._k_processCaching,
k_interval: 200,
k_scope: this
}
]
});
k_ajax.k_abortAllPendingRequests = k_ajax.k_abortAllPendingRequests.createSequence(this.k_abortByOwner, this);
}; 
kerio.waw.shared.k_widgets._K_Requests._k_instance = null;
kerio.lib.k_extend('kerio.waw.shared.k_widgets._K_Requests', Ext.util.Observable, {


k_dangerousMethods: {
'Users.set': true,      'Users.remove': true,   'UserGroups.set': true,
'UserGroups.remove': true,
'Domains.apply': true, 'TimeRanges.apply': false,
'IpAddressGroups.apply': false,
'UrlGroups.apply': false,
'TrafficPolicy.set': false,
'IpServices.apply': false,
'SecuritySettings.set': false,
'RoutingTable.setStaticRoutes': false,
'P2pEliminator.set': false,
'VpnRoutes.apply': false,
'WebInterface.set': false, 'Interfaces.apply': true,  'Ports.set': false,        'ConnectivityAssistant.set': true, 'BandwidthManagement.set': false,
'BandwidthManagement.setBandwidth': false,
'ContentFilter.set': false,
'ReverseProxy.set': false,
'Dhcp.apply': false,
'CentralManagement.set': false
},
_k_safeRequests: [],
_k_dangerousRequests: [],
_k_lastRequests: [], _k_callbacks: [],
_k_isVeryDangerous: false,
_k_isSilentRequest: false,
_k_isWaitingForUserConfirm: false,
_k_isRequestPending: false,
_k_keepAlivePending: false, _k_maskedWidgets: [], _k_lastSendId: 1, _k_abortedSends: [], _k_ajaxResponse: null, _k_ajaxParams: null,
_k_BATCH_MAX_COMMAND_COUNT: 100, _k_ERROR_BATCH_MAX_COMMAND_EXCEEDED: -32606, _k_isFinalVersion: true, _k_NOTHING_WAS_SENT_NOW: true,
_k_BATCH_SUCCESSFULLY_SENT_NOW: false,
_k_CONNECTION_OK:      'k_connectionOk',       _k_CONNECTION_CUTOFF:  'k_permanentCutOff',    _k_CONNECTION_TRY:     'k_tryingToReconnect',  _k_CONNECTION_LOGIN:   'k_confirmAfterLogin',  _k_CONNECTION_RESTART: 'k_waitingForRestart',  _K_TASK_ID_KEEP_ALIVE: 'k_keepAlive',
_K_TASK_ID_RESTARTING: 'k_restarting',
_K_TASK_ID_CACHING:    'k_caching',
_k_keepAliveRequests: undefined,
_k_keepAliveOptions: undefined,
_k_lastNotifications: [],
_k_KEEP_ALIVE_TIMEOUT_ENGINE: 120, _k_KEEP_ALIVE_TIMEOUT_CLIENT: 150000, _k_connectionState: null, _k_disconnectedSince: 0,  _k_cntQuickResponse: 0,
_k_requestProperties: {}, _k_sendServices: null, _k_isMyKerioApplianceInaccessible: false, _k_isConfigurationImport: false,
_k_forceSendNow: false, 
k_isConnectionOk: function() {
switch (this._k_connectionState) {
case this._k_CONNECTION_OK:
case this._k_CONNECTION_LOGIN:
return true;
default:
return false;
} }, 
k_getError: function() {
var
k_NO_ERROR = { k_code: 0,
k_message: '',
k_data: {},
k_failMethod: '',
k_failParams: undefined
},
k_response = this._k_ajaxResponse,
k_decoded,
k_jsonRpc,
k_error,
k_i, k_cnt;
if (k_response && k_response.k_decoded) {
if (Array !== k_response.k_decoded.constructor) {
k_error = k_response.k_decoded.error;
if (k_error && k_error.code) {
k_jsonRpc = this._k_ajaxParams.k_requests[0].k_jsonRpc; return {
k_code: k_error.code,
k_message: k_error.message,
k_data: k_error.data,
k_failMethod: k_jsonRpc.method,
k_failParams: k_jsonRpc.params
};
}
}
else { k_decoded = k_response.k_decoded;
for (k_i = 0, k_cnt = k_decoded.length; k_i < k_cnt; k_i++) {
k_error = k_decoded[k_i];
if (k_error.code) {
k_jsonRpc = this._k_ajaxParams.k_requests[k_i].k_jsonRpc;
return {
k_code: k_error.code,
k_message: k_error.message,
k_data: k_error.data,
k_failMethod: k_jsonRpc.method,
k_failParams: k_jsonRpc.params
};
}
}
}
}
return k_NO_ERROR;
}, 
k_isRequestPending: function() {
return this._k_isRequestPending;
},

k_send: function(k_options) {
this.k_sendBatch({
k_jsonRpc: k_options.k_jsonRpc,
k_callback: this._k_sendCallbackCompatible,
k_scope: this,
k_callbackParams: k_options
},
{
k_requestOwner: k_options.k_requestOwner,
k_mask: k_options.k_mask
});
},

k_sendBatch: function(k_requests, k_options) {
k_options = k_options || {};
var
k_sendId = this._k_lastSendId++, k_isVeryDangerous = k_options.k_requireUserConfirm,
k_requestOwner = k_options.k_requestOwner,
k_i, k_cnt,
k_request,
k_method,
k_maskWidget;
this._k_sendServices.k_suspend('k_send'); if (null !== k_requestOwner && 'string' !== typeof k_requestOwner) {
if (undefined !== k_requestOwner && k_requestOwner.k_id) {
k_requestOwner = k_requestOwner.k_id;
}
else { k_requestOwner = kerio.lib._k_windowManager.k_getActiveWindow(true) || kerio.lib.k_ajax._k_defaultOwner; k_requestOwner = (k_requestOwner ? k_requestOwner.k_id : null); }
}
if (!(this._k_abortedSends[k_requestOwner] instanceof Array)) { this._k_abortedSends[k_requestOwner] = [];
}
this._k_abortedSends[k_requestOwner].push(k_sendId);
if (Array !== k_requests.constructor) {
k_requests = [ k_requests ];
}
if (false !== k_options.k_mask) {
k_maskWidget = kerio.waw.shared.k_methods._k_getMainScreen(k_options.k_requestOwner);
if (false !== this.fireEvent('beforeMask', k_maskWidget)) {
this._k_maskedWidgets.push(kerio.waw.shared.k_methods.k_maskMainScreen(k_maskWidget));
}
}
for (k_i = 0, k_cnt = k_requests.length; k_i < k_cnt; k_i++) {
k_request = k_requests[k_i];
if (k_request.k_jsonRpc) {
if (undefined === k_request.k_isDangerous) {
k_method = k_request.k_jsonRpc.method;
k_request.k_isDangerous = (undefined !== this.k_dangerousMethods[k_method]);
if (undefined === k_isVeryDangerous && true === this.k_dangerousMethods[k_method]) {
k_isVeryDangerous = this.k_dangerousMethods[k_method];
}
}
if (-1 < k_request.k_jsonRpc.method.indexOf('.apply') && undefined === k_request.k_isLastRequest) {
k_request.k_isLastRequest = true;
}
this[(k_request.k_isDangerous) ? (k_request.k_isLastRequest ? '_k_lastRequests' : '_k_dangerousRequests') : '_k_safeRequests'].push(k_request);
}
else if (k_request.method) {
kerio.lib.k_reportError('Request must have defined jsonRpc property instead of method: ' + k_request.method, 'requests', 'k_sendBatch');
return;
}
else { k_request.k_isOk = true;
}
k_request._k_requestOwner = k_requestOwner;
if (k_request.k_callback) {
k_request._k_sendId = k_sendId; this._k_callbacks.push(new kerio.waw.shared.k_widgets._K_Requests._K_Callback(
k_request, [ k_request ] ));
}
}
if (k_options.k_callback) {
k_options._k_sendId = k_sendId; this._k_callbacks.push(new kerio.waw.shared.k_widgets._K_Requests._K_Callback(
k_options,    k_requests    ));
}
this._k_onError = k_options.k_onError;
this._k_isVeryDangerous = (true === k_isVeryDangerous); this._k_isSilentRequest = (true === k_options.k_isSilent);  if (true === this._k_forceSendNow) {
k_options.k_sendNow = true;
}
if (true === k_options.k_sendNow) {
if (this._k_NOTHING_WAS_SENT_NOW === this.k_sendNow()) {
k_options.k_sendNow = false; }
}
if (true !== k_options.k_sendNow) {
this._k_waitForUserDelay = (true === k_options.k_groupUserClicks ? 1 : -1); this._k_sendServices.k_resume('k_send', true); }
if (false !== k_options.k_mask && (this._k_lastRequests.length || this._k_dangerousRequests.length)) { this.k_startWaiting(kerio.lib.k_tr('Verifying your configuration changes…', 'connectivityWarning'));
}
return k_sendId;
}, 
k_getRequestTimeout: function(k_request) {
var
k_requestTimeout;
if (k_request.k_callbackParams && k_request.k_callbackParams.k_timeout) {
k_requestTimeout = parseInt('' + k_request.k_callbackParams.k_timeout, 10);
if (!isNaN(k_requestTimeout)) {
return k_requestTimeout;
}
}
return 0;
},

k_sendNow: function() {
if (0 < this._k_waitForUserDelay && this._k_BATCH_MAX_COMMAND_COUNT > this._k_waitForUserDelay) { this._k_waitForUserDelay++;
return this._k_NOTHING_WAS_SENT_NOW;
}
if (this.k_isRequestPending()) {
return this._k_NOTHING_WAS_SENT_NOW; }
if (this._k_connectionState === this._k_CONNECTION_CUTOFF) {
return; }
var
k_shared = kerio.waw.shared,
k_mergeObjects = k_shared.k_methods.k_mergeObjects,
k_dangerousRequests = this._k_dangerousRequests,
k_safeRequests = this._k_safeRequests,
k_lastRequests = this._k_lastRequests,
k_needConfirm = false,
k_requests = [], k_commands = [], k_timeout = k_shared.k_CONSTANTS.k_TIMEOUT_REQUEST_DEFAULT,
k_ajaxCfg,
k_i, k_cnt,
k_eventParam,
k_dangerousRequest,
k_safeRequest;
for (k_i = 0, k_cnt = k_dangerousRequests.length; k_i < k_cnt; k_i++) {
k_dangerousRequest = k_dangerousRequests[k_i];
k_requests.push( k_dangerousRequest );
k_commands.push( k_dangerousRequest.k_jsonRpc );
k_needConfirm = true;
k_timeout = Math.max(k_timeout, this.k_getRequestTimeout(k_dangerousRequest));
}
for (k_i = 0, k_cnt = k_safeRequests.length; k_i < k_cnt; k_i++) {
k_safeRequest = k_safeRequests[k_i];
k_requests.push( k_safeRequest );
k_commands.push( k_safeRequest.k_jsonRpc );
k_timeout = Math.max(k_timeout, this.k_getRequestTimeout(k_safeRequest));
}
for (k_i = 0, k_cnt = k_lastRequests.length; k_i < k_cnt; k_i++) {
k_dangerousRequest = k_lastRequests[k_i];
k_requests.push( k_dangerousRequest );
k_commands.push( k_dangerousRequest.k_jsonRpc );
k_needConfirm = true;
k_timeout = Math.max(k_timeout, this.k_getRequestTimeout(k_dangerousRequest));
}
if (k_needConfirm) {
k_commands.push({ method: 'Session.getConfigTimestamp' });
}
if (0 === k_requests.length) {
return this._k_BATCH_SUCCESSFULLY_SENT_NOW;
}
this._k_isRequestPending = true;
k_ajaxCfg = {
k_url: this._k_getUrl(k_commands),
k_scope: this,
k_callback: this._k_sendCallback,
k_onError:  this._k_sendError,
k_callbackParams: {
k_needConfirm: k_needConfirm,
k_isSilent: this._k_isSilentRequest,
k_requests: k_requests,
k_callbacks: this._k_callbacks,
k_maskedWidgets: this._k_maskedWidgets
},
k_timeout: k_timeout,
k_requestOwner: null
};
k_eventParam = {
k_requests: k_requests,
k_commands: k_commands,
k_dangerousRequests: k_dangerousRequests,
k_safeRequests: k_safeRequests,
k_lastRequests: k_lastRequests,
k_needConfirm: k_needConfirm
};
this.fireEvent('beforeSend', k_eventParam);
if (1 === k_commands.length) {
k_mergeObjects({ k_jsonRpc: k_commands[0] }, k_ajaxCfg);
}
else {
k_mergeObjects({
k_jsonRpc: {
method: 'Batch.run',
params: {
commandList: k_commands
}
}
}, k_ajaxCfg);
}
k_ajaxCfg.k_scope = this; this._k_dangerousRequests = [];
this._k_safeRequests = [];
this._k_lastRequests = [];
this._k_callbacks = [];
this._k_maskedWidgets = [];
this._k_ajaxResponse = {};
kerio.lib.k_ajax.k_request(k_ajaxCfg);
this.fireEvent('afterSend', k_eventParam);
return this._k_BATCH_SUCCESSFULLY_SENT_NOW; }, 
k_abort: function(k_sendId) {
this._k_abortedSends.push(k_sendId);
}, 
k_abortByOwner: function(k_ownerId, k_abortUnowned) {
if (k_ownerId && k_ownerId.k_id) {
k_ownerId = k_ownerId.k_id;
}
if ('string' !== typeof k_ownerId) { return;
}
var
k_i, k_cnt,
k_ownersRequests = this._k_abortedSends[k_ownerId] || [];
for (k_i = 0, k_cnt = k_ownersRequests.length; k_i < k_cnt; k_i++) {
this._k_abortedSends.push(k_ownersRequests[k_i]); }
delete this._k_abortedSends[k_ownerId]; if (k_abortUnowned) {
arguments.callee.call(this, null); }
if (kerio.waw.shared.k_data && kerio.waw.shared.k_data._k_currentScreen) {
if (k_ownerId === kerio.waw.shared.k_data._k_getCurrentWidget(false).k_id) {
kerio.waw.shared.k_data._k_currentScreen = null;
kerio.waw.shared.k_data._k_currentDialog = []; }
if (k_ownerId === kerio.waw.shared.k_data._k_getCurrentWidget().k_id) {
kerio.waw.shared.k_data._k_currentDialog.pop();
this._k_startCaching(); }
}
}, 
k_isAborted: function(k_sendId) {
return (-1 < this._k_abortedSends.indexOf(k_sendId));
}, 
_k_sendCallbackCompatible: function(k_data, k_success, k_options) {
var
k_response = {
k_decoded: k_data,
k_isOk: k_success
};
k_options.k_callback.call(k_options.k_scope || window, k_response, k_success, k_options.k_callbackParams);
},

_k_sendCallback: function(k_response, k_success, k_params) {
var
k_responses = (k_response.k_decoded ? k_response.k_decoded : []),
k_configTimestamp;
this._k_ajaxResponse = k_response; this._k_ajaxParams   = k_params;
if (k_response.k_isTimeout) {
return; }
if (this._k_connectionState === this._k_CONNECTION_CUTOFF) {
return; }
this.fireEvent('beforeCallback', k_response, k_success, k_params);
if (Array !== k_responses.constructor) {
k_responses = [ k_responses ];
}
k_params.k_responses = k_responses;
if (k_params.k_needConfirm && true !== k_params.k_confirmedByError) { if ((k_params.k_requests.length + 1) !== k_responses.length) { this._k_tryToReconnect(); }
else {
k_configTimestamp = k_responses[k_responses.length - 1].clientTimestampList; this._k_confirmTimestamp(k_configTimestamp);
}
}
else { this._k_processCallbacks();
}
}, 
_k_sendError: function(k_response, k_success, k_params) {
var
k_i, k_cnt,
k_request,
k_requests,
k_responses,
k_configTimestamp,
k_error;
this._k_ajaxResponse = k_response; this._k_ajaxParams   = k_params;
k_error = this.k_getError();
if (this._k_ERROR_BATCH_MAX_COMMAND_EXCEEDED === k_error.k_code && this._k_isFinalVersion) {
return true; }
if (this._k_isTimeout(k_response)) {
k_response.k_isTimeout = true;
return true; }
if (this._k_isInvalidSession(k_response)) {
if (k_params.k_needConfirm && this._k_isVeryDangerous) {
kerio.lib.k_alert({
k_title: kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_alertTitle,
k_msg: kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_invalidSessionCutOff,
k_icon: 'warning',
k_callback: function(){
kerio.waw.k_restart(true); }
});
return true; }
return false; }
this.k_stopWaiting(); this.fireEvent('beforeError', k_response, k_success, k_params);
k_responses = k_response.k_decoded.result;
if (this._k_onError && this._k_onError.call(k_params.k_callbacks[0]._k_scope, k_responses)) {
return true;
}
if (!k_responses) { return;
}
if (Array !== k_responses.constructor) {
k_responses = [ k_responses ];
}
k_cnt = k_responses.length;
k_requests = k_params.k_requests;
if (k_params.k_needConfirm) {
if ((k_cnt - 1) === k_requests.length) {
k_cnt--;
}
}
if (k_cnt > k_requests.length) { 
kerio.lib.k_reportError('Server returned more responses than expected', '_K_Requests', '_k_sendError');
return;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_request = k_requests[k_i];
k_request.k_isOk = (undefined === k_responses[k_i].error);
}
if (k_params.k_needConfirm) { if ((k_params.k_requests.length + 1) !== k_responses.length) { this._k_tryToReconnect(); }
else {
if (k_responses[k_responses.length - 1].error)  {
return false;
}
k_configTimestamp = k_responses[k_responses.length - 1].result.clientTimestampList; this._k_confirmTimestamp(k_configTimestamp);
}
k_params.k_confirmedByError = true; }
}, 
_k_processCallbacks: function() {
if (!this._k_ajaxParams) {
this._k_isRequestPending = false;
return; }
var
k_params = this._k_ajaxParams,
k_callbacks = k_params.k_callbacks,
k_requests = k_params.k_requests,
k_responses = k_params.k_responses || [],
k_maskedWidgets = k_params.k_maskedWidgets || [],
k_callbackCnt = k_callbacks.length,
k_requestCnt = k_requests.length,
k_response,
k_request,
k_success,
k_i,
k_maskWidget;
this.k_stopWaiting(); for (k_i = 0; k_i < k_requestCnt; k_i++) {
k_response = k_responses[k_i];
k_request = k_requests[k_i];
k_success = true;
if (!k_response) { k_response = {};
k_success = false;
}
else if (!this._k_ajaxResponse.k_isOk && true !== k_request.k_isOk) {
k_success = false;
}
k_request.k_response = k_response;
k_request.k_isOk = k_success;
}
for (k_i = 0; k_i < k_callbackCnt; k_i++) {
k_callbacks[k_i].k_call();
}
this.fireEvent('afterCallback', k_requests, k_params);
this._k_ajaxResponse = null;
this._k_ajaxParams = null;
this._k_isRequestPending = false;
for (k_i = 0; k_i < k_requestCnt; k_i++) {
k_request = k_requests[k_i];
if (this._k_abortedSends[k_request._k_requestOwner] instanceof Array) { this._k_abortedSends[k_request._k_requestOwner].remove(k_request._k_sendId);
}
}
while (k_maskedWidgets.length) { k_maskWidget = k_maskedWidgets.shift(); if (false !== this.fireEvent('beforeUnmask', k_maskWidget)) {
kerio.waw.shared.k_methods.k_unmaskMainScreen(k_maskWidget);
}
}
if (-1 !== window.location.hash.indexOf('processDeepValidation')) {
}
}, _k_checkDeepValidation: function() {
if (!kerio.waw.shared.k_CONSTANTS || kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.finalVersion || !window['console'] || kerio.waw.activation) {
return;
}
kerio.lib.k_ajax.k_request({
k_url: this._k_getUrl([{ method: 'deepValidationCheck' }]),
k_jsonRpc: {
method: 'Logs.get',
params: {
logName: 'warning',
countLines: 9999, fromLine: -1
}
},
k_callback: this._k_checkDeepValidationCallback,
k_scope: this,
k_requestOwner: null
});
},
_k_deepValidationRegExp: new RegExp('\\[([^\\]]+)\\] \\[Deep Validation\\] (.*)', 'i'),
_k_deepValidationIgnores: {}, _k_checkDeepValidationCallback: function(k_response, k_success) {
if (!k_success || !k_response.k_isOk || !k_response.k_decoded) {
window.console.error('Deep validation check failed!');
return;
}
var
k_rows = k_response.k_decoded.viewport,
k_i, k_cnt,
k_row,
k_values,
k_time,
k_message;
for (k_i = 0, k_cnt = k_rows.length; k_i < k_cnt; k_i++) {
k_row = k_rows[k_i].content;
k_values = k_row.match(this._k_deepValidationRegExp);
if (k_values && k_values[1]) {
k_time = k_values[1];
k_message = k_values[2];
if (!this._k_deepValidationIgnores[k_time]) {
this._k_deepValidationIgnores[k_time] = [];
}
if (this._k_deepValidationIgnores[k_time][k_message]) {
continue;
}
this._k_deepValidationIgnores[k_time][k_message] = true;
window.console.warn(k_message);
}
} },

_k_checkWarnings: function() {
var
k_requestCfg = kerio.waw.shared.k_methods.k_productInfo.k_getWarningsRequest({
k_callback: this._k_checkWarningsCallback,
k_scope: this
});
k_requestCfg.k_url = this._k_getUrl([ k_requestCfg.k_jsonRpc ]);
kerio.lib.k_ajax.k_request(k_requestCfg);
},

_k_checkWarningsCallback: function(k_warnings) {
var
k_found = false,
k_i, k_cnt,
WarnConfigurationReverted = kerio.waw.shared.k_CONSTANTS.WarningType.WarnConfigurationReverted;
if (k_warnings && k_warnings.length) {
for (k_i = 0, k_cnt = k_warnings.length; k_i < k_cnt; k_i++) {
if (WarnConfigurationReverted === k_warnings[k_i].type) {
k_warnings[0] = k_warnings[k_i]; k_warnings.splice(1);            k_found = true;
break;
}
}
}
if (this._k_CONNECTION_RESTART === this._k_connectionState) {
if (k_found) {
this.k_reportRestartFail();
this._k_processCallbacks();
}
else {
this._k_sendServices.k_resume(this._K_TASK_ID_RESTARTING, true);
}
return false;
}
if (this._k_CONNECTION_TRY === this._k_connectionState) {
this._k_disconnectedSince = 0; this._k_connectionState = this._k_CONNECTION_OK; if (k_found) { if (false === this.fireEvent('afterReconnect', true, true)) {
k_found = false;
}
}
else if (this._k_keepAlivePending && !this._k_ajaxResponse) { this.k_stopWaiting(); }
else if (this._k_ajaxResponse.k_isTimeout && !this._k_keepAlivePending) {
if (false !== this.fireEvent('afterReconnect', true, false) && true !== this._k_ajaxParams.k_isSilent) {
k_warnings[0] = {     type: kerio.waw.shared.k_CONSTANTS.WarningType.k_CONNECTION_TIMEOUT,
suppresable: false,
property: ''
};
k_warnings.splice(1); k_found = true;
}
}
}
this._k_processCallbacks();
if (true === this._k_keepAlivePending) { this._k_keepAlivePending = false;
this._k_sendServices.k_resume(this._K_TASK_ID_KEEP_ALIVE, true); }
return k_found;
}, 
_k_tryToReconnect: function() {
var
k_method = 'Session.getConfigTimestamp',
k_transaction;
this.fireEvent('beforeReconnect');
if (this._k_keepAlivePending) {
kerio.lib.k_ajax.k_abort(this._k_keepAlivePending); }
if (this._k_disconnectedSince) {
if (700000 < ((new Date()) - this._k_disconnectedSince)) { if (false !== this.fireEvent('afterReconnect', false, true)) {
this.k_startShutdown(false);
}
this._k_connectionState = this._k_CONNECTION_CUTOFF;
return false;
}
}
k_transaction = kerio.lib.k_ajax.k_request({
k_url: this._k_getUrl([{ method: k_method }]),
k_jsonRpc: {
method: k_method
},
k_callback: this._k_tryToReconnectCallback,
k_onError: this._k_tryToReconnectError,
k_scope: this,
k_requestOwner: null
});
this._k_requestProperties = {
k_transaction: k_transaction,
k_timestamp: new Date()
};
return false;
},

_k_clearBrowserAuthenticationCache: function() {
if (kerio.lib.k_isMSIE || kerio.lib.k_isMSIE11) {
document.execCommand("ClearAuthenticationCache","false");
}
else if (window.crypto && 'function' === typeof window.crypto.logout){ window.crypto.logout();
}
},

_k_tryToReconnectCallback: function(k_response, k_success) {
if (k_success && k_response.k_isOk) {
this._k_confirmTimestamp(k_response.k_decoded.clientTimestampList);
} },

_k_tryToReconnectError: function(k_response) {
var
k_QUICK_RESPONSE_TIMEOUT,
k_MAX_QUICK_RESPONSE_REQUESTS,
k_xhrResponse,
k_wawRequests,
k_requestLiveTime,
k_isNotTimeout,
k_isCommunicationFailure,
k_isRequestIdentityValid;
if (this._k_isTimeout(k_response)) {
k_wawRequests = kerio.waw.requests; k_xhrResponse = k_response.k_xhrResponse;
k_requestLiveTime = (new Date()) - this._k_requestProperties.k_timestamp;
k_QUICK_RESPONSE_TIMEOUT = 5000;
k_MAX_QUICK_RESPONSE_REQUESTS = 5;
k_isCommunicationFailure = -1 !== k_xhrResponse.statusText.indexOf('communication failure');
k_isNotTimeout = true !== k_xhrResponse.isTimeout;
k_isRequestIdentityValid = this._k_requestProperties.k_transaction.tId === k_xhrResponse.tId;
if (k_wawRequests._k_CONNECTION_RESTART === k_wawRequests._k_connectionState && k_isNotTimeout && k_isCommunicationFailure && k_isRequestIdentityValid && k_QUICK_RESPONSE_TIMEOUT > k_requestLiveTime) {
if (k_MAX_QUICK_RESPONSE_REQUESTS <= this._k_cntQuickResponse) {
this._k_clearBrowserAuthenticationCache();
window.document.location.reload(true);
}
this._k_cntQuickResponse++;
}
return true;
}
if (this._k_isInvalidSession(k_response)) {
if (this._k_CONNECTION_RESTART === this._k_connectionState) {
this._k_clearBrowserAuthenticationCache();
window.document.location.reload(true);
return true;
}
return;
}
if (this._k_CONNECTION_RESTART === this._k_connectionState) {
this.k_reportRestartFail();
return true;
}
this.fireEvent('beforeReconnectError', k_response);
this._k_processCallbacks();
if (true === this._k_keepAlivePending) { this._k_keepAlivePending = false;
this._k_sendServices.k_resume(this._K_TASK_ID_KEEP_ALIVE, true); }
},

_k_confirmTimestamp: function(k_timestamp) {
var
k_method = 'Session.confirmConfig';
if (kerio.lib.k_isMyKerio && this._k_CONNECTION_RESTART === this._k_connectionState && this._k_isMyKerioApplianceInaccessible) {
window.document.location.reload(true);
return;
}
if (!k_timestamp || (Ext.isArray(k_timestamp) && 0 === k_timestamp.length)) {
if (this._k_CONNECTION_LOGIN === this._k_connectionState) {
this._k_connectionState = this._k_CONNECTION_OK;
return;
}
if (!this._k_isConfigurationImport || this._k_CONNECTION_RESTART !== this._k_connectionState) {
this._k_checkWarnings();
}
return; }
this.fireEvent('beforeConfirm', k_timestamp);
kerio.lib.k_ajax.k_request({
k_url: this._k_getUrl([{ method: k_method }]),
k_jsonRpc: {
method: k_method,
params: {
clientTimestampList: k_timestamp
}
},
k_callback: this._k_confirmTimestampCallback,
k_onError: this._k_confirmTimestampError,
k_scope: this,
k_requestOwner: null
});
},

_k_confirmTimestampCallback: function(k_response, k_success) {
if (this._k_CONNECTION_RESTART === this._k_connectionState) {
this._k_sendServices.k_resume(this._K_TASK_ID_RESTARTING, true);
return;
}
if (k_success && k_response.k_isOk) {
this.fireEvent('afterConfirm', k_response.k_decoded.confirmed, this._k_CONNECTION_TRY === this._k_connectionState && 0 < this._k_disconnectedSince);
if (k_response.k_decoded.confirmed) {
if (this._k_CONNECTION_LOGIN === this._k_connectionState) {
kerio.lib.k_alert({
k_msg: kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_loginMessage,
k_title: kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_alertTitle,
k_icon: 'info'
});
}
this._k_disconnectedSince = 0; this._k_connectionState = this._k_CONNECTION_OK;
this._k_processCallbacks();
if (true === this._k_keepAlivePending) { this._k_keepAlivePending = false;
this._k_sendServices.k_resume(this._K_TASK_ID_KEEP_ALIVE, true); }
}
else { this._k_checkWarnings();
}
} }, 
_k_confirmTimestampError: function(k_response) {
var
k_tr = kerio.lib.k_tr;
if (this._k_isTimeout(k_response)) {
return true; }
if (k_response.k_decoded && k_response.k_decoded.error && kerio.lib.k_ajax.k_FORBIDEN_HTTP_STATUS === k_response.k_decoded.error.code) {
this.k_actualTimeout = 40;
this.k_timeoutElementId = 'k_configurationRevertTimer';
kerio.lib.k_alert({
k_title: k_tr('Connectivity error','connectivityWarning'),
k_msg: [k_tr('Your recent changes have caused the Kerio Control Administration to become unable to communicate with the server. They will be reverted soon.', 'connectivityWarning'),
'<br /><br />',
k_tr('Browser will be automatically refreshed in %1 seconds.', 'connectivityWarning', {k_args: ['<span id="' + this.k_timeoutElementId + '">' + this.k_actualTimeout + '</span>'], k_isSecure: true})].join(''),
k_icon: 'warning'
});
kerio.waw.shared.k_tasks.k_add({
k_id: 'countBrowserRefresh',
k_interval: 1000,
k_scope: this,
k_run: this._k_countDown,
k_startNow: true
});
return true;
}
if (this._k_isInvalidSession(k_response)) {
return;
}
this.fireEvent('beforeConfirmError', k_response);
this._k_ajaxResponse.k_success = false;
}, _k_countDown: function() {
this.k_actualTimeout--;
Ext.get(this.k_timeoutElementId).dom.innerHTML = this.k_actualTimeout;
if (0 >= this.k_actualTimeout) {
document.location.reload(); }
},

_k_isTimeout: function(k_response) {
var
k_isTimeout = false,
k_ajax = kerio.lib.k_ajax,
k_isMyKerioConnectionTimeout,
k_isInaccessible,
k_errorCode,
k_error;
if (!k_response.k_isOk && k_response.k_decoded.error) {
k_error = k_response.k_decoded.error;
k_isTimeout = k_error.code === k_ajax.k_TIMEOUT_ERROR_CODE;
if (!k_isTimeout && kerio.lib.k_isMyKerio) {
k_errorCode = parseInt(k_error.code, 10);
k_isInaccessible = k_errorCode === k_ajax.k_MYKERIO_ERROR_CODE_APPLIANCE_NOT_CONNECTED || k_errorCode === k_ajax.k_MYKERIO_ERROR_CODE_APPLIANCE_DOES_NOT_EXIST
|| k_errorCode === k_ajax.k_MYKERIO_ERROR_CODE_ACCESS_DENIED
|| k_errorCode === k_ajax.k_MYKERIO_ERROR_CODE_PRODUCT_SESSION_EXPIRED;
this._k_isMyKerioApplianceInaccessible = this._k_isMyKerioApplianceInaccessible || k_isInaccessible;
k_isMyKerioConnectionTimeout = k_errorCode === k_ajax.k_MYKERIO_ERROR_CODE_REQUEST_TIMEOUT;
k_isTimeout = k_isInaccessible || k_isMyKerioConnectionTimeout;
}
}
if (k_isTimeout) {
if (this._k_CONNECTION_RESTART === this._k_connectionState) {
this._k_sendServices.k_resume(this._K_TASK_ID_RESTARTING, true);
return true; }
this.fireEvent('afterCutOff', k_response);
if (this._k_connectionState !== this._k_CONNECTION_CUTOFF) {
this._k_connectionState = this._k_CONNECTION_TRY;
}
if (!this._k_disconnectedSince) {
this._k_disconnectedSince = new Date(); }
this._k_tryToReconnect.defer(2000, this); if (this._k_WAITING_IDLE === this._k_waitingState) { this.k_startWaiting(kerio.lib.k_tr('Waiting for server connection…', 'connectivityWarning'));
}
}
return k_isTimeout;
},

_k_isInvalidSession: function(k_response) {
var
k_ajax = kerio.lib.k_ajax,
k_EXPIRED_SESSION_ERROR_CODE = k_ajax.k_EXPIRED_SESSION_ERROR_CODE,
k_MYKERIO_ERROR_CODE_PRODUCT_SESSION_EXPIRED = k_ajax.k_MYKERIO_ERROR_CODE_PRODUCT_SESSION_EXPIRED,
k_decoded = k_response.k_decoded,
k_isLogout = false,
k_i, k_cnt,
k_item;
if (!k_response.k_isOk) {
if (k_decoded.error && (kerio.lib.k_isMyKerio && k_MYKERIO_ERROR_CODE_PRODUCT_SESSION_EXPIRED === k_decoded.error.code || k_EXPIRED_SESSION_ERROR_CODE === k_decoded.error.code)) { k_isLogout = true;
}
else if (k_decoded.result && Array === k_decoded.result.constructor) { for (k_i = 0, k_cnt = k_decoded.result.length; k_i < k_cnt; k_i++) {
k_item = k_decoded.result[k_i];
if (k_item.error && k_item.error.code === k_EXPIRED_SESSION_ERROR_CODE) {
k_isLogout = true; break;
}
} }
}
if (k_isLogout) {
this.fireEvent('beforeLogout', k_response);
if (this._k_CONNECTION_RESTART !== this._k_connectionState) { this._k_connectionState = this._k_CONNECTION_CUTOFF; }
}
return k_isLogout;
},

_k_getUrl: function(k_commands) {
var
k_isFinal = (kerio.waw.shared.k_CONSTANTS ? kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.finalVersion : true), k_defUrl = kerio.lib.k_ajax._k_defaultRequestParams.k_url,
k_cnt = (k_commands ? k_commands.length : 0),
k_result = [],
k_i;
if (k_isFinal) {
return k_defUrl;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_result.push(k_commands[k_i].method);
}
return k_defUrl + (kerio.lib.k_isFirefox ? '#' : '?methods=') + k_result.join('+'); }, 
k_confirmAfterLogin: function() {
this._k_connectionState = this._k_CONNECTION_LOGIN;
this._k_tryToReconnect();
}, 
k_sendBatchOld: function(k_options) {
var
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_commands = [],
k_request,
k_requests,
k_ajaxCfg,
k_i, k_cnt;
if (k_options && Array === k_options.constructor) {
k_options = { k_requests: k_options};
}
if (!k_options || 'object' !== typeof k_options
|| !k_options.k_requests || Array !== k_options.k_requests.constructor) { kerio.lib.k_reportError('Internal error: Missing parameters or wrong types!', 'sharedMethods', 'k_sendBatch');
return;
}
k_requests = k_options.k_requests;
for (k_i = 0, k_cnt = k_requests.length; k_i < k_cnt; k_i++) {
if (k_requests[k_i].k_jsonRpc) {
k_request = k_requests[k_i].k_jsonRpc;
}
else {
k_request = {
method: k_requests[k_i].method
};
}
if (!k_request.method || -1 === k_request.method.indexOf('.')) {
kerio.lib.k_reportError('Internal error: invalid or missing method in batch command ' + k_request.method, 'sharedMethods', 'k_sendBatch');
return;
}
if (k_requests[k_i].params) {
k_request.params = k_requests[k_i].params;
}
k_commands.push(k_request);
}
if (false !== k_options.k_mask) {
k_options._k_maskedWidget = k_WAW_METHODS.k_maskMainScreen(k_options.k_requestOwner);
}
k_ajaxCfg = {
k_url: kerio.waw.requests._k_getUrl([{method: 'batch'}]),
k_jsonRpc: {
method: 'Batch.run',
params: {
commandList: k_commands
}
},
k_callback: this._k_sendBatchCallback,
k_onError:  this._k_sendBatchOnError,
k_scope: k_options,
k_requestOwner: k_options.k_requestOwner
};
return kerio.lib.k_ajax.k_request(k_ajaxCfg);
}, 
_k_sendBatchOnError: function(k_response, k_success) {
var
k_i, k_cnt,
k_requests,
k_responses,
k_request,
k_requestResponse,
k_result;
switch (typeof this.k_onError) {
case 'function':
k_result = this.k_onError.apply(this.k_scope || window, arguments);
break;
case 'boolean':
k_result = this.k_onError;
break;
default:
k_result = false;
break;
}
if (!k_response.k_decoded.result || Array !== k_response.k_decoded.result.constructor) {
return k_result;
}
if (k_result) {
return true;
}
k_requests = this.k_requests;
k_responses = k_response.k_decoded.result;
for (k_i = 0, k_cnt = k_requests.length; k_i < k_cnt; k_i++) {
k_requestResponse = k_responses[k_i];
if (k_requestResponse && !k_requestResponse.error) {
continue; }
k_request = k_requests[k_i];
k_request._k_isOk = false; switch (typeof k_request.k_onError) {
case 'function':
k_result = k_result || k_request.k_onError.apply(k_request.k_scope || window, [k_requestResponse, k_success, k_request.k_callbackParams]);
break;
case 'number':
k_result = k_result || (k_request.k_onError < k_requestResponse.error.code);
break;
case 'boolean':
k_result = k_result || k_request.k_onError;
break;
}
}
return k_result;
}, 
_k_sendBatchCallback: function(k_response, k_success) {
var
k_i, k_cnt,
k_requests,
k_responses,
k_request,
k_requestResponse;
if (k_response.k_isOk && k_response.k_decoded.constructor === Array) {
k_response.k_decoded = { batchResult: k_response.k_decoded };
}
if ('function' === typeof this.k_callback) {
this.k_callback.apply(this.k_scope || window, [k_response, k_success, this.k_callbackParams]);
}
if (false !== this.k_mask) { kerio.waw.shared.k_methods.k_unmaskMainScreen(this._k_maskedWidget);
}
if (!k_response.k_decoded || !k_response.k_decoded.batchResult) {
return;
}
k_requests = this.k_requests;
k_responses = k_response.k_decoded.batchResult;
for (k_i = 0, k_cnt = k_requests.length; k_i < k_cnt; k_i++) {
k_requestResponse = k_responses[k_i];
k_request = k_requests[k_i];
if ('function' === typeof k_request.k_callback) {
k_request.k_callback.apply(k_request.k_scope || window, [k_requestResponse, false !== k_request._k_isOk, k_request.k_callbackParams]);
}
}
}, 
k_addBatchControllers: function(k_kerioWidget, k_forms) {
var k_batchMethods;
if (!k_kerioWidget) {
kerio.lib.k_reportError('Internal error: You must pass a widget into addBatchControllers method!');
return;
}k_forms = k_forms || k_kerioWidget.k_formManager || k_kerioWidget.k_forms || k_kerioWidget.k_form;
if (!k_forms) {
kerio.lib.k_reportError('Internal error: You must define a list of forms for addBatchControllers method!');
return;
}
if (Array !== k_forms.constructor) { if (k_forms.k_isInstanceOf && k_forms.k_isInstanceOf('K_Form')) {
k_forms = [ k_forms ]; }
else if (k_forms.k_forms && Array === k_forms.k_forms.constructor) { k_forms = k_forms.k_forms; }
} k_batchMethods = this._k_batchMethods;
k_kerioWidget.k_addReferences({
_k_batchForms: k_forms,
k_isWaitingForBatch: k_batchMethods.k_isWaitingForBatch,
k_loadBatchData: k_batchMethods.k_loadBatchData,
k_saveBatchData: k_batchMethods.k_saveBatchData,
_k_loadBatchDataCallback: k_batchMethods._k_loadBatchDataCallback,
_k_saveBatchDataCallback: k_batchMethods._k_saveBatchDataCallback
});
}, _k_batchMethods: {

k_isWaitingForBatch: function() {
return this._k_batchInProgress;
},

k_loadBatchData: function(k_allowLoading) {
var
k_forms = this._k_batchForms,
k_requests = [],
k_params = [],
k_i, k_formCnt,
k_j, k_requestCnt,
k_form,
k_formRequests,
k_request;
for (k_i = 0, k_formCnt = k_forms.length; k_i < k_formCnt; k_i++) {
k_form = k_forms[k_i];
if ('function' === typeof k_form.k_getLoadRequests) {
k_formRequests = k_form.k_getLoadRequests(false !== k_allowLoading); for (k_j = 0, k_requestCnt = k_formRequests.length; k_j < k_requestCnt; k_j++) {
k_request = k_formRequests[k_j];
k_requests.push({
k_jsonRpc: {
method: k_request.k_method,
params: k_request.k_params
}
});
k_params.push({
k_form: k_form,
k_handler: k_request.k_handler || k_request.k_callback
});
} } else if ('function' === typeof k_form.k_applyParams) { k_form.k_applyParams({
k_allowLoading: k_allowLoading
}); } } kerio.waw.requests.k_sendBatch(
k_requests,
{
k_callback: this._k_loadBatchDataCallback,
k_callbackParams: k_params,
k_scope: this,
k_requestOwner: this
}
);
this._k_batchInProgress = true;
}, 
k_saveBatchData: function(k_allowReloading) {
var
k_forms = this._k_batchForms,
k_reloadDelay = 0,
k_batchOptions = {
k_callback: this._k_saveBatchDataCallback,
k_callbackParams: {
k_allowReloading: k_allowReloading,
k_reloadDelay: k_reloadDelay,
k_requestCount: 0
},
k_scope: this,
k_requestOwner: this
},
k_requests = [],
k_i, k_formCnt,
k_j, k_requestCnt,
k_form,
k_formRequests,
k_request;
for (k_i = 0, k_formCnt = k_forms.length; k_i < k_formCnt; k_i++) {
k_form = k_forms[k_i];
if ('function' === typeof k_form.k_getSaveRequests) {
k_formRequests = k_form.k_getSaveRequests(false !== k_allowReloading); if (false === k_formRequests) {
return false;
}
for (k_j = 0, k_requestCnt = k_formRequests.length; k_j < k_requestCnt; k_j++) {
k_request = k_formRequests[k_j];
k_requests.push({
k_jsonRpc: {
method: k_request.k_method,
params: k_request.k_params
}
});
if (k_request.k_requireUserConfirm) {
k_requests[k_requests.length - 1].k_isDangerous = true;
k_batchOptions.k_requireUserConfirm = true;
}
if (undefined !== k_request.k_reloadDelay) {
k_reloadDelay = k_request.k_reloadDelay;
}
} } } if (0 === k_requests.length) { if (k_allowReloading) {
this.k_loadBatchData();
} else {
kerio.adm.k_framework.k_leaveCurrentScreen();
kerio.adm.k_framework.k_enableApplyReset(false);
}
return;
}
k_batchOptions.k_callbackParams.k_requestCount = k_requests.length;
k_batchOptions.k_callbackParams.k_reloadDelay = k_reloadDelay;
kerio.waw.requests.k_sendBatch(
k_requests,
k_batchOptions
);
this._k_batchInProgress = true;
}, 
_k_loadBatchDataCallback: function(k_response, k_success, k_params) {
this._k_batchInProgress = false;
if (!k_success || !k_response) {
return; }
var
k_i, k_cnt,
k_param;
k_params = k_params || [];
for (k_i = 0, k_cnt = k_params.length; k_i < k_cnt; k_i++) {
k_param = k_params[k_i];
if ('function' === typeof k_param.k_handler) { k_param.k_handler.call(k_param.k_form, k_response[k_i]);
}
}
kerio.adm.k_framework.k_enableApplyReset(false);
}, 
_k_saveBatchDataCallback: function(k_response, k_success, k_params) {
this._k_batchInProgress = false;
if (!k_success) {
return; }
if (!kerio.waw.shared.k_methods.k_processUserClick()) {return false;
}
if (!this.k_isInstanceOf('K_Dialog')) {
kerio.adm.k_framework.k_enableApplyReset(false);
}
if (k_params.k_allowReloading) {
if (0 === k_params.k_reloadDelay) {
this.k_loadBatchData();
}
else {
this.k_loadBatchData.defer(k_params.k_reloadDelay, this);
}
}
} }, 
k_startKeepAlive: function() {
this._k_sendServices.k_start(this._K_TASK_ID_KEEP_ALIVE);
}, 
k_stopKeepAlive: function() {
this._k_sendServices.k_stop(this._K_TASK_ID_KEEP_ALIVE);
}, 
k_getNotifications: function() {
return this._k_lastNotifications;
},

_k_keepAlive: function() {
var k_ajaxCfg;
if (this._k_keepAlivePending) {
return false; }
if (this._k_CONNECTION_TRY === this._k_connectionState) {
return true; }
if (undefined === this._k_keepAliveRequests) {
this._k_keepAliveRequests = (kerio.waw.activation
? {
method: 'Session.getConfigTimestamp' }
: {
method: 'Notifications.get',
params: {
timeout: this._k_KEEP_ALIVE_TIMEOUT_ENGINE
}
}
);
}
if (this._k_keepAliveRequests.params) {
this._k_keepAliveRequests.params.lastNotifications = this._k_lastNotifications;
}
k_ajaxCfg = {
k_url: this._k_getUrl([{method: 'KeepAlive'}]), k_scope: this,
k_jsonRpc: this._k_keepAliveRequests,
k_callback: this._k_keepAliveCallback,
k_onError:  this._k_keepAliveError,
k_callbackParams: {
k_isKeepAlive: true,
k_requests: this._k_keepAliveRequests
},
k_timeout: this._k_KEEP_ALIVE_TIMEOUT_CLIENT,
k_requestOwner: null
};
this._k_keepAlivePending = kerio.lib.k_ajax.k_request(k_ajaxCfg);
return false; }, 
_k_keepAliveCallback: function(k_response, k_success) {
if (!k_success || !k_response.k_isOk) {
return;
}
this._k_lastNotifications = k_response.k_decoded.notifications;
this.fireEvent('notificationUpdate', kerio.lib.k_cloneObject(this._k_lastNotifications));
this._k_keepAlivePending = false; this._k_sendServices.k_resume(this._K_TASK_ID_KEEP_ALIVE, true);
}, _k_keepAliveError: function(k_response, k_success) {
this._k_keepAlivePending = true; this._k_tryToReconnect();
return true;
}, 
k_sendInterfaceChange: function (k_params, k_dialog, k_grid) {
if (k_grid.k_pendingAutorefreshRequest) {
k_grid.k_pendingAutorefreshRequest = false;
}
kerio.waw.requests.k_sendBatch([
{
k_jsonRpc: {
method: 'Interfaces.set',
params: k_params
},
k_callback: function(k_response, k_success) {
var
k_dialog,
k_error;
if (!k_success) {
return;
}
if (k_response.errors && 0 < k_response.errors.length) {
k_dialog = this.k_dialog;
k_error = k_response.errors[0];
if (k_dialog && k_dialog.k_checkResponseForExistingIfaceName) {
k_dialog.k_checkResponseForExistingIfaceName(k_error.code);
}
return;
}
kerio.adm.k_framework.k_enableApplyReset();
if (this.k_grid) {
this.k_grid.k_reloadData();
}
if (this.k_dialog) {
this.k_dialog.k_hide();
}
},
k_scope: {
k_dialog: k_dialog,
k_grid: k_grid
}
},
{
k_jsonRpc: {
method: 'Interfaces.checkIpCollision'
},
k_callback: k_grid.k_showCollisionWarning,
k_scope: k_grid
}
]);
}, 
_k_processCaching: function() {
if (this.k_isRequestPending()) { return true;                 }
if (true === kerio.waw.shared.k_data._k_getRelatedDialog()) {
return false; }
if (true === kerio.waw.shared.k_data._k_getRelatedStore()) {
return false; }
this._k_sendServices.k_stop(this._K_TASK_ID_CACHING); return false;
},

_k_startCaching: function() {
this._k_sendServices.k_start(this._K_TASK_ID_CACHING); },

_k_resumeCaching: function() {
this._k_sendServices.k_resume(this._K_TASK_ID_CACHING, true); },

k_updateLicense: function() {
var k_this = kerio.waw.requests; k_this.fireEvent('beforeLicenseUpdate');
k_this.k_sendBatch({
k_jsonRpc: {
method: 'ProductRegistration.getFullStatus'
},
k_callback: k_this.k_updateLicenseCallback,
k_scope: k_this
},
{
k_requestOwner: null,
k_mask: false,
k_isSilent: true });
}, 
k_updateLicenseCallback: function(k_response, k_success) {
if (k_success) {
kerio.waw.shared.k_CONSTANTS.k_SERVER.k_LICENSE = k_response.status;
this.fireEvent('afterLicenseUpdate', k_response.status);
}
}, 
k_startSendingNow: function() {
this._k_forceSendNow = true;
},

k_stopSendingNow: function() {
this._k_forceSendNow = false;
}
});
kerio.waw.shared.k_widgets._K_Requests._K_Callback = function(k_config, k_requests) {
if ('function' !== typeof k_config.k_callback) {
kerio.lib.k_reportError('Invalid request callback defined: ' + typeof k_config.k_callback, 'K_Callback', 'constructor');
return;
}
if (!k_config.k_callbackParams && k_config.k_params) {
kerio.lib.k_reportError('Internal error: Use k_callbackParams instead of k_params', 'requests', 'callback');
}
this._k_callback = k_config.k_callback;
this._k_scope = k_config.k_scope || window;
this._k_params = k_config.k_callbackParams || [];
this._k_sendId = k_config._k_sendId;
this._k_requests = k_requests || [];
this._k_requestData = null;
this._k_success = undefined;
}; kerio.lib.k_extend('kerio.waw.shared.k_widgets._K_Requests._K_Callback', Object, {


k_call: function() {
if (kerio.waw.requests.k_isAborted(this._k_sendId)) {
return; }
this._k_gatherData(); this._k_callback.defer(1, this._k_scope, [this._k_requestData, this._k_success, this._k_params]);
}, 
_k_gatherData: function() {
if (null !== this._k_requestData) {
return; }
var
k_i, k_cnt,
k_requests = this._k_requests,
k_success = true,
k_requestData = [],
k_request;
for (k_i = 0, k_cnt = k_requests.length; k_i < k_cnt; k_i++) {
k_request = k_requests[k_i];
k_success = k_success && k_request.k_isOk;
k_requestData.push(k_request.k_response);
}
this._k_success = k_success;
this._k_requestData = (2 > k_requestData.length ? k_requestData[0] : k_requestData);
} }); kerio.waw.requests = new kerio.waw.shared.k_widgets._K_Requests();
