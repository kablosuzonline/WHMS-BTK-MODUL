
(function(k_ajax) {
var queryString = {
get: function(name) {
name = name.replace(/[\[\]]/g, "\\$&");
var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
url = window.location.href,
results = regex.exec(url);
if (!results) return null;
if (!results[2]) return '';
return decodeURIComponent(results[2].replace(/\+/g, " "));
}
}
var dbgApiFlag = !!queryString.get('dbg_api');
if (dbgApiFlag) {
new apiWrapper(kerio.lib.k_ajax);
}
function apiWrapper(k_ajax) {
this._k_ajax = k_ajax;
this._k_request = k_ajax.k_request;
var dbgApi = queryString.get('dbg_api');
this.encryptApiFlag = dbgApi.indexOf('encrypt') !== -1;
this.resizeApiFlag = dbgApi.indexOf('resize') !== -1;
this.encryptedPass = queryString.get('dbg_enc') || '';
this.isEncryptedFlag = !!this.encryptedPass;
this.progressError = queryString.get('dbg_err_progress') || null;
this.encryptApiFlag = this.encryptApiFlag || this.isEncryptedFlag || !!this.progressError;
this.resizeError = queryString.get('dbg_resize') || null;
this.resizeProgressError = queryString.get('dbg_err_resize') || null;
this.resizeApiFlag = this.resizeApiFlag || !!this.resizeError || !!this.resizeProgressError;
this.showInfo = function() {
console.log('*************************API mocks params********************************');
console.log('To set api mocks enabled: /admin/?dbg_api=encrypt,resize#advancedOptions');
console.log('dbg_api=encrypt \t- set mocks for encryption/decryption');
console.log('dbg_api=resize \t\t- set mocks for encryption/decryption resizing');
console.log('dbg_enc=pwd \t\t- set encrypted state, pwd - password');
console.log('dbg_err_progress=1 \t- set progress error');
console.log('dbg_err_progress=2 \t- set progress Not Enough Space error');
console.log('dbg_resize=1 \t\t- set encrypted error low space');
console.log('dbg_resize=2 \t\t- set encrypted error critically low space');
console.log('dbg_resize=3 \t\t- set encrypted error free unused space');
console.log('dbg_err_resize=1 \t- set error Encrypted volume resize failed on resizing');
console.log('dbg_err_resize=2 \t- set error Not enough disk space on resizing');
console.log('dbg_err_resize=3 \t- set error Critically low free space on resizing');
console.log('example: '+location.origin+'/admin/?dbg_api=encrypt,resize&dbg_enc=a&dbg_resize=1#advancedOptions');
console.log('err example: '+location.origin+'/admin/?dbg_api=encrypt,resize&dbg_enc=aa&dbg_resize=1&dbg_err_resize=1#advancedOptions');
console.log('*************************API mocks params********************************');
}
this.result = function(k_options, result, isSuccess) {
var data = {
k_isOk: isSuccess !== undefined ? isSuccess : true,
k_decoded: result
};
k_options.k_callback.call(k_options.k_scope, data, data.k_isOk);
}
this.setState = function(method, state) {
var key = 'dbg_api_' + method;
localStorage.setItem(key, JSON.stringify(state));
}
this.getState = function(method) {
var key = 'dbg_api_' + method;
return JSON.parse(localStorage.getItem(key) || null);
}
this.init = function() {
var state = this.getState('Encryption.getEncryptionStatus');
if (state && state.error) {
delete state.error;
this.setState('Encryption.getEncryptionStatus', state);
}
if (this.isEncryptedFlag) {
this.setState('enc_pwd', this.encryptedPass);
this.setState('Encryption.getEncryptionStatus', {status: 'encrypted'});
}
if (this.resizeError) {
switch (this.resizeError) {
case '1':
this.setState('Encryption.getEncryptionStatus', {status: 'encrypted', error: {"code": 6000}});
break;
case '2':
this.setState('Encryption.getEncryptionStatus', {status: 'encrypted', error: {"code": 6001}});
break;
case '3':
this.setState('Encryption.getEncryptionStatus', {status: 'encrypted', error: {"code": 6002}});
break;
}
}
}
this.showInfo();
this.init();
k_ajax.k_request = function(k_options, k_kerioWidget) {
k_options = k_options || {};
var method = k_options.k_jsonRpc ? k_options.k_jsonRpc.method : '';
if (this.encryptApiFlag) {
switch (method) {
case 'Encryption.getEncryptionStatus':
var state = this.getState(method);
if (state) {
if (state.error && state.error.code === 5014) {this.setState('Encryption.getEncryptionStatus', {status: 'encrypted'});
}
if (state.action === 'encrypting' || state.action === 'decrypting') {
if (!state.progress) {
state.progress = {
current: 0
}
this.setState('Encryption.getEncryptionStatus', state);
}
else {
state.progress.current += 1.5;
state.progress.total = 7.4;
if (state.progress.current > 4 && this.progressError) {
switch(this.progressError) {
case '1':if (state.action === 'encrypting') {
state = {status: 'decrypted', error: {"code": 5000}};
}
else {
state = {status: 'encrypted', error: {"code": 5010}};
}
this.setState('Encryption.getEncryptionStatus', state);
break;
case '2':if (state.action === 'encrypting') {
state = {status: 'decrypted', error: {"code": 5001,"need": 250}}
}
else {
state = {status: 'encrypted', error: {"code": 5011,"need": 250}}
}
this.setState('Encryption.getEncryptionStatus', state);
break;
}
}
else {
if (state.progress.current >= state.progress.total) {
state.progress.current = state.progress.total;
var newStatus = state.action === 'encrypting' ? 'encrypted' : 'decrypted';
this.setState('Encryption.getEncryptionStatus', {status: newStatus});
}
else {
this.setState('Encryption.getEncryptionStatus', state);
}
}
}
}
else if (state.action === 'resizing' || state.action === 'saving' || state.action === 'restoring') {
switch(this.resizeError) {
case '1':
case '2':
state.iteration = state.iteration || 0;
state.iteration++;
if (state.iteration > 1 && this.resizeProgressError) {
switch(this.resizeProgressError) {
case '1':
state = {status: 'encrypted', error: {"code": 6010}};
this.setState('Encryption.getEncryptionStatus', state);
break;
case '2':
state = {status: 'encrypted', error: {"code": 6011}};
this.setState('Encryption.getEncryptionStatus', state);
break;
case '3':
state = {status: 'encrypted', error: {"code": 6012}};
this.setState('Encryption.getEncryptionStatus', state);
break;
}
}
else {
if (state.iteration > 2) {
delete state.iteration;
this.setState('Encryption.getEncryptionStatus', {status: 'encrypted'});
}
else {
this.setState('Encryption.getEncryptionStatus', {
status: 'encrypted',
action: 'resizing',
progress: {
current: 0,
},
iteration: state.iteration
});
}
}
break;
case '3':
state.iteration = state.iteration || 0;
switch (state.iteration) {
case 0:
state.progress = state.progress || {current: 0, total: 7.4};
state.progress.current += 2.2;
if (state.progress.current >= state.progress.total) {
state.progress.current = state.progress.total;
state.iteration++;
this.setState('Encryption.getEncryptionStatus', {
status: 'encrypted',
action: 'resizing',
progress: {
current: 0
},
iteration: state.iteration
});
}
else {
this.setState('Encryption.getEncryptionStatus', {
status: 'encrypted',
action: 'saving',
progress: {
current: state.progress.current,
total : state.progress.total
},
iteration: state.iteration
});
}
break;
case 1:
state.stepIteration = state.stepIteration || 0;
state.stepIteration++;
if (state.stepIteration > 1) {
state.iteration++;
this.setState('Encryption.getEncryptionStatus', {
status: 'encrypted',
action: 'restoring',
progress: {
current: 0,
total: 7.4
},
iteration: state.iteration
});
}
else {
this.setState('Encryption.getEncryptionStatus', {
status: 'encrypted',
action: 'resizing',
progress: {
current: 0
},
iteration: state.iteration,
stepIteration: state.stepIteration
});
}
break;
case 2:
state.progress.current += 2.5;
if (state.progress.current >= state.progress.total) {
state.progress.current = state.progress.total;
this.setState('Encryption.getEncryptionStatus', {
status: 'encrypted'
});
}
else {
this.setState('Encryption.getEncryptionStatus', {
status: 'encrypted',
action: 'restoring',
progress: {
current: state.progress.current,
total : state.progress.total
},
iteration: state.iteration
});
}
break;
}
break;
}
}
this.result(k_options, state);
}
else {
this.result(k_options, {status: 'decrypted'});
}
return;
case 'Encryption.startEncryption':
var pwd = k_options.k_jsonRpc.params.password;
this.setState('enc_pwd', pwd);
this.setState('Encryption.getEncryptionStatus', {
status: 'encrypted',
action: 'encrypting'
});
this.result(k_options, {});
return;
case 'Encryption.startDecryption':
var storedPwd = this.getState('enc_pwd') || this.encryptedPass;
var pwd = k_options.k_jsonRpc.params.password;
if (storedPwd === pwd) {
this.setState('enc_pwd_incorrect', 0);
this.setState('Encryption.getEncryptionStatus', {
status: 'encrypted',
action: 'decrypting'
});
this.result(k_options, {});
}
else {
var incorrectPwdCount = parseInt(this.getState('enc_pwd_incorrect') || '0');
incorrectPwdCount++;
if (incorrectPwdCount > 2) {
incorrectPwdCount = 0;
this.setState('Encryption.getEncryptionStatus', {status: 'encrypted', error: {"code": 5014}});
this.result(k_options, {status: 'encrypted', error: {"code": 5013}});
}
else {
this.result(k_options, {status: 'encrypted', error: {"code": 5012}});
}
this.setState('enc_pwd_incorrect', incorrectPwdCount);
}
return;
case 'Batch.run':
var replacedIndexes = [],
k_callback = k_options.k_callback;
for(var cmd, i = 0, len = k_options.k_jsonRpc.params.commandList.length; i < len; i++) {
cmd = k_options.k_jsonRpc.params.commandList[i];
if (cmd.method === 'Encryption.getEncryptionStatus') {
cmd.method = 'Users.getMySettings';
replacedIndexes.push(i);
}
}
if (replacedIndexes.length > 0) {
k_options.k_callback = function(k_response) {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Encryption.getEncryptionStatus'
},
k_callback: function (k_resp) {
for (var i=0, len = replacedIndexes.length; i < len; i++) {
k_response.k_decoded[replacedIndexes[i]] = k_resp.k_decoded;}
k_options.k_callback = k_callback;
k_options.k_callback.call(k_options.k_scope, k_response, k_response.k_isOk, k_options.k_callbackParams);
},
k_scope: k_options.k_scope
});
}
}
this._k_request.call(this._k_ajax, k_options);
return;
}
}
if (this.resizeApiFlag) {
switch (method) {
case 'Encryption.startResizing':
switch(this.resizeError) {
case '1':
case '2':
this.setState('Encryption.getEncryptionStatus', {
status: 'encrypted',
action: 'resizing',
progress: {
current: 0
}
});
break;
case '3':
this.setState('Encryption.getEncryptionStatus', {
status: 'encrypted',
action: 'saving',
progress: {
current: 0,
total: 7.4
}
});
break;
}
this.result(k_options, {});
return;
}
}
if (this.resizeError) {
switch (method) {
case 'Notifications.get':
switch (this.resizeError) {
case '1':
this.result(k_options, {
"notifications": [
{
"type": "NotificationDataEncryption",
"severity": "NotificationWarning",
"value": "",
"code": 6000
}
]
});
break;
case '2':
this.result(k_options, {
"notifications": [
{
"type": "NotificationSubWillExpire",
"severity": "NotificationWarning",
"value": "",
"code": 0
},
{
"type": "NotificationDataEncryption",
"severity": "NotificationWarning",
"value": "",
"code": 6001
}
]
});
break;
}
return;
}
}
this._k_request.call(this._k_ajax, k_options);
}.bind(this);
}
})(kerio.lib.k_ajax);

kerio.waw.k_restart = function(k_clientOnly, k_skipLogin) {
kerio.waw.requests.k_stopKeepAlive();
if (true === k_clientOnly) { window.document.location.reload(true); return;
}

var k_requestCfg = {
k_jsonRpc: {
'method': 'ProductInfo.get',
'params': null
},
k_errorMessages: {
k_connectionTimeout: '',
k_invalidResponse: ''
},
k_onError: kerio.waw.shared.k_methods.k_ignoreAllErrors, 
k_callback: function(k_response, k_success, k_params) {
if ((new Date()).getTime() > kerio.waw._k_restartGiveUp) { kerio.waw.k_restart(true); }
kerio.waw.k_restart.defer(5000, this);
}
};
if (undefined === kerio.waw._k_restartGiveUp) {
kerio.waw._k_restartGiveUp =  (new Date()).getTime() + (2 * kerio.waw.shared.k_CONSTANTS.k_TIME_CONSTANTS.k_SECONDS_IN_MIN * 1000) ; }
kerio.lib.k_ajax.k_request(k_requestCfg);
};

kerio.waw.init.k_onReady = function() {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_wawInit = kerio.waw.init;
if (false === k_wawInit.k_checkLoadedFiles()) {
kerio.lib.k_alert({
k_title: k_tr('Error', 'common'),
k_msg: k_tr("Some files haven't been loaded correctly. Please reload the administration now.", 'networkError'),
k_icon: 'error',
k_callback: function() {
window.location.reload();
}
});
return;
}
window.k_loadedAt = new Date();
kerio.lib.k_ajax._k_apiMethodCreate = kerio.lib.k_ajax._k_apiMethodCreate.concat(['createLeases', 'generateEx', 'importCertificateP12']);
k_wawInit.k_maskBrowser(true);
k_wawInit.k_initApplicationStart();
kerio.waw.requests._k_cacheWaitingDialogImages();
}; 
kerio.waw.init.k_requests = function() {
var
k_USER_SETTINGS_REQUEST_LOCATION = 'k_USER_SETTINGS_REQUEST_LOCATION',
k_requests,
k_index;
kerio.lib.k_setSharedConstants(kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants);
kerio.lib.k_setSupportedLanguages(kerio.waw.shared.k_CONSTANTS.k_LANGUAGES.k_LIST.slice(1)); k_requests = [
[
kerio.waw.status.k_userSettings.k_getLoadRequest(),
k_USER_SETTINGS_REQUEST_LOCATION,
{
k_jsonRpc: { method: 'ProductRegistration.getFullStatus' },
k_callback: function(k_data) {
kerio.waw.shared.k_CONSTANTS.k_SERVER.k_LICENSE = k_data.status;
}
},
{
k_jsonRpc: { method: 'Encryption.getEncryptionStatus' },
k_callback: function(k_response) {
if (k_response.action) {
if(history.pushState) {
history.pushState(null, null, '#advancedOptions');
}
else {
location.hash = '#advancedOptions';
}
}
}
}
],
[
{
k_isAsyncCallback: true,
k_callback: this.k_getTranslations },
{
k_isAsyncCallback: true,
k_callback: function() {
kerio.lib.k_inputValidator.k_setRestrictionList({
k_jsonRpc: {method: 'Server.getRestrictionList'},
k_callback: kerio.waw.init.k_initValidators
});
}
}
]
]; if (!kerio.waw.activation) {
k_requests[1].push({
k_isAsyncCallback: true,
k_callback: this._k_preloadDashboard });
}
k_index = k_requests[0].indexOf(k_USER_SETTINGS_REQUEST_LOCATION);
if (-1 !== k_index) {
k_requests[0].splice(k_index, 1);
}
if (!kerio.waw.activation) {
if (-1 !== k_index) {
k_requests[0].splice(k_index, 0, kerio.waw.status.k_userSettings.k_getLoadSettingsRequest());
}
else {
k_requests.push(kerio.waw.status.k_userSettings.k_getLoadSettingsRequest());
}
k_requests.push(
{
k_jsonRpc: { method: 'Logs.getStatusFunctionList' },
k_callback: function(k_data, k_success) {
if (k_success) {
kerio.waw.shared.k_CONSTANTS.k_LOGS.k_FUNCTION_LIST = k_data.functions;
}
}
},
{
k_jsonRpc: { method: 'Logs.getHttpLogType' },
k_callback: function(k_data, k_success) {
if (k_success) {
kerio.waw.shared.k_CONSTANTS.HttpLogType.k_CURRENT_TYPE = k_data.logType;
}
}
},
{
k_jsonRpc: { method: 'SystemConfig.getDateTime' },
k_callback: function(k_data, k_success) {
kerio.waw.shared.k_methods.k_updateClientServerTimeOffset(k_data.config || {}, k_success);
}
},
kerio.waw.shared.k_methods.k_productInfo.k_getWarningsRequest(),
{
k_jsonRpc: { method: 'ContentFilter.getContentApplicationList' },
k_callback: function(k_data, k_success) {
var
k_tr = kerio.lib.k_tr,
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
ApplicationWebFilterCategory = k_CONSTANTS.ApplicationType.ApplicationWebFilterCategory,
k_categories,
k_applications,
k_webFilterCategories,
k_isWebFilter,
k_category,
k_types,
k_subGroups,
k_i, k_cnt,
k_iType, k_cntType;
if (!k_success) {
return;
}
k_categories = k_data.categories;
k_applications = [];
k_webFilterCategories = [];
k_subGroups = [];
for (k_i = 0, k_cnt = k_categories.length; k_i < k_cnt; k_i++) {
k_category = k_categories[k_i];
k_category.sorting = k_i;
k_applications[k_category.id] = k_category;
k_category.name = k_category.name.replace('&amp;', '&');
k_category.group = k_category.group.replace('&amp;', '&');
k_category.subGroup = k_category.subGroup.replace('&amp;', '&');
if (k_category.group === k_category.subGroup) {
k_category.subGroup +=' ';
}
if (k_category.subGroup) {
if (k_subGroups[k_category.subGroup]) {
k_subGroups[k_category.subGroup]++;
}
else {
k_subGroups[k_category.subGroup] = 1;
}
}
k_types = k_category.types;
k_isWebFilter = false;
for (k_iType = 0, k_cntType = k_types.length; k_iType < k_cntType; k_iType++) {
if (ApplicationWebFilterCategory === k_types[k_iType]) {
k_isWebFilter = true;
break;
}
}
k_category.k_isWebFilterOnly = k_isWebFilter;
if (k_isWebFilter) {
k_webFilterCategories.push({
id: k_category.id,
group: k_category.subGroup || k_category.name
});
}
}
k_webFilterCategories.sort(function(k_firstCategory, k_secondCategory) {
if (k_firstCategory.group < k_secondCategory.group) {
return -1;
}
if (k_firstCategory.group > k_secondCategory.group) {
return 1;
}
return 0;
});
k_webFilterCategories.unshift({id: '', group: k_tr('No suggestion', 'webFilterCategory')});
k_CONSTANTS.k_CONTENT_FILTER_APPLICATIONS = k_applications;
k_CONSTANTS.k_WEB_FILTER_CATEGORIES = k_webFilterCategories;
k_CONSTANTS.k_contentFilterApplications = k_categories;
k_CONSTANTS.k_CONTENT_APPLICATION_SUBGROUPS = k_subGroups;
}
},
{
k_jsonRpc: { method: 'FilenameGroups.get' },
k_callback: function(k_data, k_success) {
var
k_mappedFileTypes = [],
k_fileNameGroups = k_data.groups,
k_fileNameGroup,
k_pattern,
k_i, k_cnt;
if (k_success) {
k_fileNameGroups.sort(function(k_first, k_second) {
return k_first.name.localeCompare(k_second.name);
});
kerio.waw.shared.k_CONSTANTS.k_FILE_TYPE_FIRST_GROUP = k_fileNameGroups[0].name;
for (k_i = 0, k_cnt = k_fileNameGroups.length; k_i < k_cnt; k_i++) {
k_fileNameGroup = k_fileNameGroups[k_i];
k_fileNameGroup.predefined = true;
k_pattern = k_fileNameGroup.pattern.split("; ");
kerio.waw.shared.k_methods.k_sort(k_pattern);
k_fileNameGroup.pattern = k_pattern.join('; ');
k_mappedFileTypes[k_fileNameGroup.name] = k_fileNameGroup;
}
kerio.waw.shared.k_CONSTANTS.k_FILE_GROUP_TYPES = k_mappedFileTypes;
}
}
}
);
}
return k_requests;
};

kerio.waw.init.k_initApplicationStart = function(k_response, k_success) {
var
k_requests = this.k_requests,
k_isAsyncRequestOnly = true,
k_currentRequests,
k_i, k_cnt;
if (false === k_success) {
if (true === this.k_errorRepeatTry) {
this.k_error = kerio.waw.requests.k_getError();
kerio.lib.k_reportError(
'Initialization failed;'
+ (this.k_error.k_failMethod ? ' method ' + this.k_error.k_failMethod : '')
+ ' returned error: ' + this.k_error.k_code + ' ' + this.k_error.k_message,
'kerio.waw.init', 'k_start'
);
return;
}
this.k_errorRepeatTry = true;
}
else if (true === k_success){
this.k_currentRequestBatch++;
this.k_errorRepeatTry = false;
}
else {
this.k_currentRequestBatch = 0;
}
if ('function' === typeof k_requests) {
k_requests = this.k_requests();
this.k_requests = k_requests;
}
if (k_requests[this.k_currentRequestBatch]) {
k_currentRequests = k_requests[this.k_currentRequestBatch];
if (!(k_currentRequests instanceof Array)) {
k_currentRequests = [k_currentRequests];
}
for (k_i = 0, k_cnt = k_currentRequests.length; k_i < k_cnt; k_i++) {
if (true === k_currentRequests[k_i].k_isAsyncCallback) {
delete k_currentRequests[k_i].k_isAsyncCallback;
this.k_asyncOperations++;
}
else {
k_isAsyncRequestOnly = false;
}
}
if (k_isAsyncRequestOnly) {
for (k_i = 0, k_cnt = k_currentRequests.length; k_i < k_cnt; k_i++) {
k_currentRequests[k_i].k_callback();
}
this.k_initApplicationStart({}, true);
}
else {
kerio.waw.requests.k_sendBatch(k_requests[this.k_currentRequestBatch], {
k_callback: this.k_initApplicationStart,
k_scope: this,
k_requestOwner: null
});
}
}
else { var decodedMessages = kerio.waw.shared.k_CONSTANTS.k_CLOUD_MESSAGES.replaceAll(' L"', ' L\'');
try {
kerio.waw.shared.k_cloud_messages = decodedMessages ? JSON.parse(decodedMessages) : {};
}
catch (e) {
console.log(e);
}
this.k_initApplicationFinish.defer(100, this);
}
};

kerio.waw.init.k_initApplicationFinish = function() {
if (0 < kerio.waw.init.k_asyncOperations) {
this.k_initApplicationFinish.defer(300, this);
return;
}
var
k_waw = kerio.waw,
k_wawInit = k_waw.init,
k_userSettings = k_waw.status.k_userSettings,
k_params,
k_dumps;
k_waw.shared.k_tasks = new kerio.lib.K_TaskRunner({});
k_wawInit.k_initSharedDefinitions();
kerio.waw.init.k_updateWebAssist();
kerio.waw.shared.k_methods.k_checkConnectivityToKb();
if (!kerio.waw.shared.k_methods.k_isAuditor()) { kerio.waw.requests.k_confirmAfterLogin();
}
k_userSettings.k_loggedUser.k_fullName = k_userSettings._k_globalValues.fullName;
k_params = {
k_browserPreferredLanguage: k_userSettings.k_browserLanguage,
k_currentLanguage: k_userSettings.k_language,
k_userRole: k_userSettings.k_role,
k_loggedUser: k_userSettings.k_loggedUser,
k_showOnLoad: true
};
if (kerio.waw.activation) {
kerio.waw.ui.activation.k_init(k_params);
}
else {
k_wawInit.k_initMainLayout(k_params);
k_dumps = kerio.waw.init.k_dumps;
if (k_dumps && 0 < k_dumps.length) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'crashReport',
k_initParams: {
k_productName: 'Kerio Control',
k_crashTime: kerio.waw.init.k_dumps[0].timestamp
}
});
delete kerio.waw.init.k_dumps;
}
}
k_wawInit.k_maskBrowser(false);
if (!kerio.waw.activation) {
kerio.waw.ui.notifications.k_startNotifications();
kerio.waw.shared.k_DEFINITIONS.k_CONTROL_URL.k_sendRequest();
window.k_initedAt = new Date();
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
'method': 'ProductInfo.setStatisticsData',
'params': {
data: {
screenWidth: screen.width || -1,
screenHeight: screen.height || -1,
localization: k_userSettings.k_get('calculatedLanguage') || k_userSettings.k_get('language', 'en') || 'unknown',
loadTime: (window.k_loadedAt - window.k_startedAt) || -1,
initTime: (window.k_initedAt - window.k_loadedAt) || -1
}
}
},
k_owner: null
});
if (kerio.lib.k_isMSIE) { window.k_initedAt = undefined;
}
else {
delete window.k_initedAt;
}
}
if (kerio.lib.k_isMSIE) { window.k_loadedAt = undefined;
window.k_startedAt = undefined;
}
else {
delete window.k_loadedAt;
delete window.k_startedAt;
}
if (('#' + k_waw.shared.k_DEFINITIONS.k_DASHBOARD_LIST_ID) !== window.location.hash && !kerio.waw.activation) {
kerio.waw.init.k_afterInitTasks();
}
if (!kerio.waw.activation && !kerio.lib.k_isMyKerio) {
kerio.waw.init.k_addStarIcon();
}
}; 
kerio.waw.init.k_addStarIcon = function() {
var
k_starIconHelper,
k_starIcon,
k_starIconTooltip,
k_onClick,
k_onMouseOut;
k_onClick = function() {
kerio.lib.k_openWindow(kerio.waw.shared.k_DEFINITIONS.k_CONTROL_URL.k_getWebifaceUrl(), '_blank');
};
k_onMouseOut = function(event) {
var k_toElement = event ? (kerio.lib.k_isFirefox ? event.relatedTarget : event.toElement) : window.event.toElement;
if (null === k_toElement || ('starIconTooltip' !== k_toElement.id && 'starIcon' !== k_toElement.id && k_toElement.parentNode !== this && k_toElement !== this)) {
document.getElementById('starIconTooltip').className = '';
document.getElementById('starIconHelper').className = '';
}
};
k_starIcon = document.createElement('div');
k_starIcon.id = 'starIcon';
k_starIcon.innerHTML = '<div id="starIconHelper" class="helper"></div>';
k_starIcon.onmouseover = function() {
document.getElementById('starIconHelper').className = 'show';
document.getElementById('starIconTooltip').className = 'show';
};
k_starIcon.onmouseout = k_onMouseOut;
k_starIcon.onclick = k_onClick;
document.body.appendChild(k_starIcon);
k_starIconTooltip = document.createElement('div');
k_starIconTooltip.innerHTML = '<span>Kerio</span>Control Statistics';
k_starIconTooltip.id = 'starIconTooltip';
k_starIconTooltip.onmouseout = k_onMouseOut;
k_starIconTooltip.onclick = k_onClick;
document.body.appendChild(k_starIconTooltip);
};

kerio.waw.init.k_afterInitTasks = function() {
kerio.waw.init.k_afterLoadInit = true;
kerio.waw.requests.k_startKeepAlive();
kerio.waw.shared.k_methods.k_productInfo.k_setReady();
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_dialogs: [
'activeHostsList', 'trafficStatisticsList', 'userStatisticsList', 'interfaceList',
'trafficPolicyList', 'bandwidthManagementList', 'userGroupList', 'dhcpServerList',
'systemHealth' ]
});
kerio.waw.init.k_afterInitTasks = kerio.waw.shared.k_methods.k_emptyFunction;
};

kerio.waw.init.k_maskBrowser = function(k_mask) {
var
k_div = document.getElementById('k_initLoading');
k_div.style.display = k_mask ? 'block' : 'none';
};

kerio.waw.init.k_getTranslations = function() {
var
k_language,
k_requestCfg;
k_language = kerio.waw.status.k_userSettings.k_get('calculatedLanguage');
k_requestCfg = {
k_url: 'translations/' + k_language + '.js?v=8629',
k_method: 'get',
k_timeout: 120000,
k_owner: null,
k_onError: function() {
return true;
}
};

k_requestCfg.k_callback = function(k_response, k_success) {
if (k_success) {
kerio.lib.k_parseTranslations(k_response.k_xhrResponse.responseText); }
else {
kerio.lib.k_engineConstants.k_CURRENT_LANGUAGE = 'en';
}
kerio.lib.k_applyTranslations(); kerio.waw.init.k_asyncOperations--; return true;
};
kerio.lib.k_ajax.k_request(k_requestCfg);
}; 
kerio.waw.init._k_preloadDashboard = function() {
var
k_lib = kerio.lib,
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_appSettingsRoot,
k_guiSettings,
k_settings,
k_dashboardSettings,
k_requests,
k_upgraded_8_5;
kerio.waw.requests.k_startSendingNow(); k_appSettingsRoot = k_lib.k_isIPadCompatible ? 'iPadAdmin' : 'admin';
k_guiSettings = k_lib._k_settings.k_guiSettings;
k_dashboardSettings = k_guiSettings[k_appSettingsRoot] ? k_guiSettings[k_appSettingsRoot].dashboard : undefined;
if (k_dashboardSettings) {
k_upgraded_8_5 = kerio.waw.status.k_userSettings.k_get('dashboardKerioNewsUpgraded', false);
if (false === k_upgraded_8_5) {
k_dashboardSettings.columns[0].unshift({type: 'tileNews'});
k_settings = {};
k_settings[k_appSettingsRoot] = {
dashboard: k_dashboardSettings
};
k_lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Session.setSettings',
params: {settings: k_settings}
},
k_requestOwner: null,
k_onError: kerio.waw.shared.k_methods.k_ignoreErrors
});
}
}
kerio.waw.status.k_userSettings.k_set('dashboardKerioNewsUpgraded', 'set');
k_requests = [
{
k_jsonRpc: {
method: 'Interfaces.get',
params: {
sortByGroup: false,
query: {
conditions: [{
fieldName: 'group',
comparator: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Eq,
value: k_CONSTANTS.InterfaceGroupType.Internet }],
combining: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Or,
orderBy: [
{
columnName: 'name',
direction: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Asc
}
]
}
}
}
},
{
k_jsonRpc: {
method: 'TrafficStatistics.get',
params: {
refresh: true,
query: {
conditions: [{
fieldName: 'type',
comparator: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Eq,
value: k_CONSTANTS.TrafficStatisticsType.TrafficStatisticsInterface
}],
combining: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Or,
orderBy: [
{
columnName: 'name',
direction: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Asc
}
]
}
}
}
}
];
kerio.waw.requests.k_sendBatch(k_requests, {
k_callback: function(k_response, k_success) {
var
k_dashboardInetInterfaces,
k_interfaceList,
k_chartList,
k_chartListMapped,
k_i, k_cnt,
k_chart;
if (k_success) {
k_interfaceList = k_response[0].list;
k_chartList = k_response[1].list;
k_dashboardInetInterfaces = [];
k_chartListMapped = [];
for (k_i = 0, k_cnt = k_chartList.length; k_i < k_cnt; k_i++) {
k_chartListMapped[k_chartList[k_i].componentId] = k_chartList[k_i];
}
for (k_i = 0, k_cnt = k_interfaceList.length; k_i < k_cnt; k_i++) {
k_chart = k_chartListMapped[k_interfaceList[k_i].id];
if (k_chart && k_chart.id) {
k_dashboardInetInterfaces.push(k_chart);
}
}
kerio.waw.shared.k_data.k_dashboardInetInterfaces = k_dashboardInetInterfaces;
kerio.waw.init.k_asyncOperations--; }
},
k_requestOwner: null,
k_scope: this
});
}; 
kerio.waw.init.k_updateWebAssist = function() {
if (!window.k_webAssist) {
return; }
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_PRODUCT_INFO = k_WAW_CONSTANTS.k_SERVER.k_PRODUCT_INFO,
k_userSettings = kerio.waw.status.k_userSettings;

window.k_webAssist.k_afterLoad({
k_version:      k_PRODUCT_INFO.versionString,
k_serverOs:     window.k_webAssist.k_serverOs, k_language:     k_userSettings.k_get('language', 'en'),
k_isEnabled:    k_userSettings.k_get('webassist', true), k_switchOffUrl: kerio.lib.k_ajax.k_getDefaultRequestParams().k_url,
k_token:        kerio.lib.k_ajax.k_getToken()
});
window.onerror = function(k_message, k_url, k_line) {
var
k_alertError = kerio.waw.shared.k_methods.k_alertError,
k_tr = kerio.lib.k_tr;
if (k_url.indexOf('/ajax.js') !== -1) {
if (k_message.indexOf('Internal Error: Unexpected Content-Type: undefined 12019') !== -1) {
kerio.lib.k_alert({
k_title: k_tr('Error', 'common'),
k_msg: k_tr('SSL Certificate was changed. Please restart your browser now.', 'networkError'),
k_icon: 'error',
k_callback: function() {
window.location.reload(true);
}
});
return;
}
if (k_message.indexOf('Internal Error: Unexpected Content-Type: undefined 12007') !== -1) {
k_alertError(k_tr('Connection to the server is not working. Please check your connection and try again.', 'networkError'));
return;
}
}
window.k_webAssist.k_onErrorHandler(k_message, k_url, k_line);
};
};

kerio.waw.init.k_checkLoadedFiles = function() {
var
k_checkObjects,
k_parseItem,
k_windowObject,
k_objectsCnt, k_i,
k_parseCnt, k_j;
k_checkObjects = [
'kerio.waw.init.k_initSharedDefinitions',
'kerio.waw.init.k_initValidators',
'kerio.waw.init.k_getTranslations',
'kerio.waw.init.k_initValidators',
'kerio.waw.k_hacks.k_renderHtmlWithTooltip',
'kerio.waw.k_hacks.k_store.k_warn',
'kerio.waw.k_restart',
'kerio.waw.requests.k_startRestart',
'kerio.waw.shared.k_CONSTANTS.k_WEB_PORT_UNSECURED',
'kerio.waw.shared.k_data.k_get',
'kerio.waw.shared.k_data.k_loadStores',
'kerio.waw.shared.k_widgets.K_RulesGrid',
'kerio.waw.shared.k_widgets.K_ContextMenuList',
'kerio.waw.shared.k_widgets.K_FindField',
'kerio.waw.status.k_userSettings._k_loadRequestCfg',
'kerio.waw.shared.k_methods.k_emptyFunction',
'kerio.waw.shared.k_methods.k_getDomainIdByName',
'kerio.waw.ui.waitingDialog.k_init',
'kerio.waw.ui.dashboardList.k_init',
'kerio.waw.ui.tileLicense.k_init',
'kerio.waw.ui.k_helpMapping',
'kerio.lib.K_Button',
'kerio.lib.K_UploadButton',
'kerio.lib.k_jsonDecode',
'kerio.lib.k_tr',
'kerio.adm.k_emailRegExp',
'kerio.adm.k_framework.k_init',
'kerio.adm.k_framework.k_enableApplyReset',
'kerio.adm.k_framework.k_showHelp',
'kerio.adm.k_getKbLinkUrl',
'kerio.adm.k_widgets.K_Dashboard',
'kerio.adm.k_widgets.K_BasicList',
'kerio.adm.k_widgets.K_TimeRangeEditor',
'kerio.adm.k_widgets.logs',
'kerio.adm.k_widgets.k_productMenu',
'kerio.adm.k_widgets.crashReport',
'kerio.adm.k_widgets.certificateImport',
'k_webAssist.k_init',
'kerio.lib.k_browserInfo.k_supportedBrowsers',
'kerio.lib.k_languageDependentValue',
'kerio.lib.k_setSupportedLanguages',
'kerio.lib.k_uiCacheManager',
'kerio.lib.k_ui.k_showDialog',
'kerio.lib.K_Error',
'kerio.lib._K_BaseComponent',
'kerio.lib.K_Action',
'kerio.lib.K_Event',
'kerio.waw.shared.k_methods.k_productInfo.k_get',
'kerio.adm.k_widgets.K_TestConnection',
'kerio.lib.K_TaskRunner',
'Ext.ux.grid.BufferView',
'Ext.ux.grid.PrinterGridView',
'Ext.lib.Ajax.abort'
];
if (!kerio.waw.activation) {
k_checkObjects.concat([
'kerio.waw.init.k_initMainLayout',
'Ext4',
'Ext4.chart.TimeAxis.prototype.calcEnds'
]);
}
k_objectsCnt = k_checkObjects.length;
for (k_i = 0; k_i < k_objectsCnt; k_i++) {
k_parseItem = k_checkObjects[k_i].split('.');
k_parseCnt = k_parseItem.length;
k_windowObject = window;
for (k_j = 0; k_j < k_parseCnt; k_j++) {
k_windowObject = k_windowObject[k_parseItem[k_j]];
if (undefined === k_windowObject) {
return false;
}
}
}
return true;
};
