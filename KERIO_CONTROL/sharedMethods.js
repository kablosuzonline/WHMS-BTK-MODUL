

kerio.waw.shared = kerio.waw.shared || {};
kerio.waw.shared.k_methods = kerio.waw.shared.k_methods || {};
kerio.waw.shared.k_methods = {

k_emptyFunction: function() {},

k_correctUri: function(k_uri) {
var
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS;
if ('string' !== typeof k_uri) {
return k_uri;
}
if (k_WAW_DEFINITIONS.k_uriSchemeRegExp.test(k_uri)) {
k_uri = k_uri.replace(k_WAW_DEFINITIONS.k_uriSchemeRegExp, '');
}
if (k_WAW_DEFINITIONS.k_uriPortRegExp.test(k_uri)) {
k_uri = k_uri.replace(k_WAW_DEFINITIONS.k_uriPortRegExp, '$1$4');
}
if (-1 < k_uri.indexOf('#')) {
k_uri = k_uri.replace(k_WAW_DEFINITIONS.k_clientParamRegExp, '');
}
return k_uri;
},

_k_getMainScreen: function(k_widget) {
k_widget = k_widget || kerio.lib.k_getActiveDialog();
if (k_widget && k_widget.k_getMainWidget) { k_widget = k_widget.k_getMainWidget(); }
if (k_widget && k_widget.k_onGetMainScreen) {
k_widget = k_widget.k_onGetMainScreen(); }
if (!k_widget || !k_widget.k_isInstanceOf || !k_widget.k_isInstanceOf('K_Dialog')) { k_widget = kerio.lib.k_getViewport();
}
if (!k_widget) {
return;
}
return k_widget;
}, 
k_maskMainScreen: function(k_widget, k_config) {
k_config = k_config || {};
var
k_default,
k_isSave = k_config.k_isSaving; k_widget = kerio.waw.shared.k_methods._k_getMainScreen(k_widget);
if (!k_widget) {
return;
}
if (true === k_isSave) {
k_default = kerio.waw.shared.k_DEFINITIONS.k_MASK_DEFAULT_SAVING;
}
else if (false === k_isSave) {
k_default = kerio.waw.shared.k_DEFINITIONS.k_MASK_DEFAULT_LOADING;
}
else if (k_widget.k_isInstanceOf('K_Dialog')) {
k_default = kerio.waw.shared.k_DEFINITIONS.k_MASK_DEFAULT_SAVING;
}
else {
k_default = kerio.waw.shared.k_DEFINITIONS.k_MASK_DEFAULT_LOADING;
}
Ext.applyIf(k_config, k_default);
if (0 === k_config.k_delay) {
k_config.k_delay = 1; }
kerio.lib.k_maskWidget(k_widget, k_config);
return k_widget;
},

k_unmaskMainScreen: function(k_widget) {
k_widget = kerio.waw.shared.k_methods._k_getMainScreen(k_widget);
if (!k_widget) {
return;
}
kerio.lib.k_unmaskWidget(k_widget);
},

k_isAuditor: function() {
var
k_userSettings = kerio.waw.status.k_userSettings,
k_USER_ROLE = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants;
return k_userSettings.k_hasRole(k_USER_ROLE.kerio_web_Auditor);
}, k_enableApplyReset: function(k_toolbar, k_enable) {
k_enable = ((undefined === k_enable ? true : k_enable) && !kerio.waw.shared.k_methods.k_isAuditor());
k_toolbar.k_setDisabledApplyReset(!k_enable, !k_enable);
},

k_LIMIT_FOR_APPLY_PARAMS_TEST: 25,
k_isApplyParamsCalledFromLeaveScreenCallback: function() {
var k_result = this.k_isApplyParamsCalledFromLeaveScreenCallbackDetection(arguments.callee.caller);
this.k_isApplyParamsCalledFromLeaveScreenCallbackDepth = 0;
return k_result;
},
k_isApplyParamsCalledFromLeaveScreenCallbackDepth: 0,
k_isApplyParamsCalledFromLeaveScreenCallbackDetection: function(k_caller) {
var
k_parentCaller;
this.k_isApplyParamsCalledFromLeaveScreenCallbackDepth++;
if (this.k_LIMIT_FOR_APPLY_PARAMS_TEST < this.k_isApplyParamsCalledFromLeaveScreenCallbackDepth) {
return false;
}
if (k_caller !== kerio.adm.k_framework._k_leaveScreenConfirmCallback) {
k_parentCaller = k_caller.arguments.callee.caller;
if (k_parentCaller) {
return this.k_isApplyParamsCalledFromLeaveScreenCallbackDetection(k_parentCaller);
}
else {
return false;
}
}
else {
return true;
}
},

k_isLinux: function() {
var k_SERVER = kerio.waw.shared.k_CONSTANTS.k_SERVER;
switch (k_SERVER.k_SERVER_OS) {
case k_SERVER.k_OS_WINDOWS:return false;
case k_SERVER.k_OS_LINUX:return true;
default:
kerio.lib.k_reportError('Unsupported server OS ' + k_SERVER.k_SERVER_OS, 'sharedMethods', 'k_isLinux');
return false;
}
},

k_isBoxEdition: function() {
return '' !== kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.boxEdition;
},

k_isWifiAvailable: function() {
return true === kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.wifiAvailable;
},

k_isIpv6Available: function() {
return true === kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.ip6Available;
},

k_isConnectionSecured: function() {
var k_protocol = window.document.location.protocol; switch (k_protocol) {
case 'https:':return true; case 'http:':return false;
default:
kerio.lib.k_reportError('Unsupported protocol '+k_protocol, 'k_isSecuredConnection');
return false;
}
}, 
k_isLocalhost: function() {
return (!kerio.waw.shared.k_CONSTANTS.k_SERVER.k_CONNECTED_INTERFACE); }, 
k_isIos: function() {
kerio.lib.k_isIPhone = kerio.lib.k_isIPhone || false;
return (kerio.lib.k_isIPad || kerio.lib.k_isIPhone);
},

k_licenseRemainingDays: function(k_licenseExpireType) {
var
k_expirations = kerio.waw.shared.k_CONSTANTS.k_SERVER.k_LICENSE.expirations,
k_expireDays = Math.min(), k_i, k_cnt;
for (k_i = 0, k_cnt = k_expirations.length; k_i < k_cnt; k_i++) {
if (undefined === k_licenseExpireType || k_licenseExpireType === k_expirations[k_i].type) {
if (!k_expirations[k_i].isUnlimited) { k_expireDays = Math.min(k_expireDays, k_expirations[k_i].remainingDays);
}
if (undefined !== k_licenseExpireType) { break;                               }
}
}
if (undefined !== k_licenseExpireType && k_i === k_cnt) { return Math.max(); }
return (0 > k_expireDays ? 0 : k_expireDays); },

k_isTrial: function(k_registered) {
var
kerio_web_SharedConstants = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_LICENSE = kerio.waw.shared.k_CONSTANTS.k_SERVER.k_LICENSE;
if (!k_LICENSE) {
return true;
}
if (false !== k_registered && kerio_web_SharedConstants.kerio_web_rsTrialRegistered === k_LICENSE.regType) {
return true;
}
if (false === k_registered && kerio_web_SharedConstants.kerio_web_rsNoRegistration === k_LICENSE.regType) {
return true;
}
return false;
},

k_startRegistration: function(k_params) {
k_params = k_params || {};
kerio.waw.activation = {
k_needLicense: true,
k_licenseDialog: true
};
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'activation',
k_objectName: 'k_registerWizzard',
k_params: k_params
});
},

k_ignoreAllErrors: function(k_response, k_success) {
if (!k_success && k_response && k_response.k_decoded && k_response.k_decoded.error
&& kerio.lib.k_ajax.k_EXPIRED_SESSION_ERROR_CODE === k_response.k_decoded.error.code) {
return false;
}
return true;
}, 
k_ignoreErrors: function(k_response) {
var k_result;
if (k_response && k_response.k_decoded) {
k_result = k_response.k_decoded;
if (k_result.result && Array === k_result.result.constructor) {
kerio.lib.k_reportError('This handler cannot be used for Batch. Use method ' + 'k_sendBatch' + ' instead.', 'sharedMethods', 'k_ignoreErrors');
return;
}
if (k_result.error) {
return (0 < k_result.error.code); }
if (k_result.result.error) {
return true; }
}
return false;
}, 
k_formatDate: function(k_date) {
var k_timestamp;
if ('number' === typeof k_date) {
k_timestamp = new Date(k_timestamp * 1000);
} else {
k_timestamp = new Date(k_date.year, k_date.month, k_date.day);
}
return k_timestamp.format(kerio.waw.shared.k_CONSTANTS.k_DATE_TIME_FORMATS.k_DATE);
}, 
k_formatTime: function(k_time) {
var
k_date,
k_timeFormat = kerio.waw.shared.k_CONSTANTS.k_DATE_TIME_FORMATS.k_TIME;
if (undefined !== k_time.sec) { k_date = new Date(1, 1, 1970, k_time.hour, k_time.min, k_time.sec);
k_timeFormat = kerio.waw.shared.k_CONSTANTS.k_DATE_TIME_FORMATS.k_TIME_SEC;
} else {
k_date = new Date(1, 1, 1970, k_time.hour, k_time.min);
}
return k_date.format(k_timeFormat);
}, 
k_formatElapsedTime: function(k_time) {
var
k_shared = kerio.waw.shared,
k_days = Math.floor(k_time.sec / k_shared.k_CONSTANTS.k_TIME_CONSTANTS.k_SECONDS_IN_DAY),
k_result;
if (0 < k_days) {
k_result = kerio.lib.k_tr('%1d', 'connectionsList', {k_args: [k_days]}) + ' ';
}
else {
k_result = '';
}
return k_result + k_shared.k_methods.k_formatTime(k_time);
},

k_formatTimeSpan: function(k_time, k_failed, k_succinct) {
var
k_tr = kerio.lib.k_tr, k_days = k_time.days || 0,
k_hours = k_time.hours || 0,
k_minutes = k_time.minutes || 0,
k_months,
k_years;
k_succinct = k_succinct || false;
if (false === k_time.isValid) {
return k_succinct ? '' : k_tr('Never', 'antivirusList');
}
if (true === k_failed) {
return k_tr('Failed %1', 'antivirusList', {k_args: [arguments.callee.call(this, k_time)]}); }
if (0 >= k_days) { if (0 >= k_hours) { if (0 >= k_minutes) { if (k_succinct) {
return k_tr('just now', 'antivirusList');
}
else {
return k_tr('less than a minute ago', 'antivirusList');
}
}
return k_tr('%1 [minute|minutes] ago', 'antivirusList', {k_args: [k_minutes], k_pluralityBy: k_minutes});
}
if (1 === k_hours) {
if (0 >= k_minutes || k_succinct) {
return k_tr('1 hour ago', 'antivirusList');
}
return k_tr('1 hour and %1 [minute|minutes] ago', 'antivirusList', {k_args: [k_minutes], k_pluralityBy: k_minutes});
}
return k_tr('%1 hours ago', 'antivirusList', {k_args: [k_hours]});
}
if (k_succinct) {
if (1 <= k_days && 1 > k_days/31 ) { return k_tr('%1 [day|days] ago', 'antivirusList', {k_args: [k_days], k_pluralityBy: k_days});
}
if (1 <= k_days/31 && 1 > k_days/365 ) { k_months = Math.round(k_days/31);
return k_tr('%1 [month|months] ago', 'antivirusList', {k_args: [k_months], k_pluralityBy: k_months});
}
if (1 <= k_days/365) { k_years = Math.round(k_days/365);
return k_tr('%1 [year|years] ago', 'antivirusList', {k_args: [k_years], k_pluralityBy: k_years});
}
}
if ((0 >= k_hours || 1 < k_days)) { return k_tr('%1 [day|days] ago', 'antivirusList', {k_args: [k_days], k_pluralityBy: k_days});
}
return k_tr('1 day and %1 [hour|hours] ago', 'antivirusList', {k_args: [k_hours], k_pluralityBy: k_hours});
}, 
k_formatDateTime: function(k_dateTime) {
var
k_methods = kerio.waw.shared.k_methods,
k_date,
k_time;
if ('number' === typeof k_dateTime) {
k_date = k_methods.k_unixTimestampToDate(k_dateTime);
k_time = k_methods.k_unixTimestampToTime(k_dateTime);
k_dateTime = {
date: k_date,
time: k_time
};
}
return k_methods.k_formatDate(k_dateTime.date) + ' ' + k_methods.k_formatTime(k_dateTime.time);
},
k_dateToUnixTimestamp: function(k_date) {
return new Date(k_date.year, k_date.month, k_date.day).getTime() / 1000;
},
k_unixTimestampToDate: function(k_timestamp) {
var
k_date = new Date(k_timestamp * 1000);
return {
year: k_date.getFullYear(),
month: k_date.getMonth(),
day: k_date.getDate()
};
},
k_unixTimestampToTime: function(k_timestamp) {
var
k_date = new Date(k_timestamp * 1000);
return {
hour: k_date.getHours(),
min: k_date.getMinutes(),
sec: k_date.getSeconds()
};
},
k_parseIpAddresses: function(k_addresses, k_separator) {
if (!k_addresses) {
return [];
}
k_separator = k_separator || ';';
var k_addressList = k_addresses.split(k_separator);
return k_addressList;
}, 
k_parseMacAddresses: function(k_addresses) {
var
k_methods = kerio.waw.shared.k_methods,
k_addressesList = k_methods.k_parseIpAddresses(k_addresses),
k_cnt, k_i;
for (k_i = 0, k_cnt = k_addressesList.length; k_i < k_cnt; k_i++) {
k_addressesList[k_i] = k_methods.k_removeMacAddressDelimiters(k_addressesList[k_i]);
}
return k_addressesList;
},

k_removeSpacesFromString: function(k_string) {
if (-1 === k_string.indexOf(' ')) {
return k_string;
}
return k_string.replace(new RegExp(/\ /g), '');
}, 
k_addSpacesAroundDelimiters: function(k_string) {
var k_parts;
k_string = kerio.waw.shared.k_methods.k_removeSpacesFromString(k_string);
k_parts = k_string.split('-');
k_string = k_parts.join(' - ');
k_parts = k_string.split(',');
k_string = k_parts.join(', ');
k_parts = k_string.split(';');
k_string = k_parts.join('; ');
return k_string;
}, 
K_ListLoader: function(k_options) {
var
k_tr = kerio.lib.k_tr,
k_closureLoader, k_list,
k_select = k_options.k_select,
k_form = k_options.k_form,
k_typeId;
if ('string' === typeof k_select) {
if (!k_form || !k_form.k_isInstanceOf || !k_form.k_isInstanceOf('K_Form')) {
kerio.lib.k_reportError('Internal error: if Select is defined by id, form reference must be defined.', 'SharedMethods', 'K_ListLoader');
return;
}
k_select = k_form.k_getItem(k_options.k_select + '.value'); if (!k_select) {
k_select = k_form.k_getItem(k_options.k_select);
}
}
k_options.k_isDefinitionSelect = false;
if (k_select.k_isInstanceOf('K_DefinitionSelect')) {
k_options.k_isDefinitionSelect = true;
k_select = k_select._k_select;
}
if (!k_select || !k_select.k_isInstanceOf || !k_select.k_isInstanceOf('K_Select')) {
kerio.lib.k_reportError('Internal error: Select is not defined or does not exist.', 'SharedMethods', 'K_ListLoader');
return;
}
k_options.k_select = k_select; k_closureLoader = {
_k_options: k_options,
_k_isReady: false,
_k_isDisabled: false,
_k_dataStore: {},
k_NONE: kerio.waw.shared.k_CONSTANTS.k_NONE };
if (k_options.k_iconRenderer && 'function' === typeof k_options.k_iconRenderer) {
k_closureLoader.k_iconRenderer = k_options.k_iconRenderer;
}
k_select.k_listLoader = k_closureLoader; if ('string' !== typeof k_closureLoader._k_options.k_list) {
kerio.lib.k_reportError('Internal error: list type must be string.', 'sharedMethods', 'K_ListLoader');
return;
}
k_list = {
k_method: 'getGroupList',
k_params: {},
k_root: 'groups',
k_itemId: 'id',
k_itemName: 'name',
k_add: kerio.waw.shared.k_methods.k_mergeObjects
};
k_typeId = k_closureLoader._k_options.k_list;
switch (k_typeId) {
case 'k_timeRangeList':
k_list.k_add({
k_object: 'TimeRanges',
k_localData: [{
'k_name': k_options.k_excludingNoneOption
? k_tr('Never', 'timeRangeList')
: k_tr('Always', 'timeRangeList'),
'k_id': k_closureLoader.k_NONE
}]
});
break;
case 'k_ipAddressGroupList':
k_list.k_add({
k_object: 'IpAddressGroups',
k_localData: [{
'k_name': k_options.k_excludingNoneOption
? k_tr('None', 'ipAddressGroupList')
: k_tr('Any', 'ipAddressGroupList'),
'k_id': k_closureLoader.k_NONE
}]
});
break;
case 'k_urlGroupList':
k_list.k_add({
k_object: 'UrlGroups',
k_localData: [{
'k_name': k_options.k_excludingNoneOption
? k_tr('None', 'urlGroupList')
: k_tr('Any', 'urlGroupList'),
'k_id': k_closureLoader.k_NONE
}]
});
break;
case 'k_certificates':
case 'k_ipsecTunnelCertificates':
k_list.k_add({
k_object: 'Certificates',
k_localData: [{
'k_name': k_tr('Not in local store', 'interfaceVpnTunnelEditor'),
'k_id': ''}]
});
break;
case 'k_certificatesVpnServer':
case 'k_certificatesReverseProxy':
k_list.k_add({
k_object: 'Certificates',
k_localData: [{
'k_name': k_tr('No certificate selected', 'interfaceVpnTunnelEditor'),
'k_id': ''
}]
});
break;
case 'k_certificatesReverseProxyRule':
k_list.k_add({
k_object: 'Certificates',
k_localData: [
{
'k_name': k_tr('No certificate selected', 'interfaceVpnTunnelEditor'),
'k_id': ''
},
{
'k_name': k_tr('Use default settings', 'reverseProxyRuleEditor'),
'k_id': kerio.waw.shared.k_CONSTANTS.k_REVERSE_PROXY_DEFAULT_CERTIFICATE_ID
}
]
});
break;
case 'k_interfacesOutgoingList':
case 'k_interfacesEthernetList':
case 'k_interfacesEthernetRasList':
k_list.k_add({
k_object: 'Interfaces',
k_localData: [{'k_name': k_tr('Any', 'interfaceList'), 'k_id': k_closureLoader.k_NONE}]
});
break;
case 'k_internetInterfaces':
k_list.k_add({
k_object: 'Interfaces',
k_localData: [{'k_name': k_tr('Any', 'interfaceList'), 'k_id': k_closureLoader.k_NONE}]
});
break;
case 'k_fileTypeList':
k_list.k_itemId = 'name';
k_list.k_itemName = 'k_translation';
k_list.k_add({
k_object: 'ContentFilter',
k_localData: []
});
break;
case 'k_dhcpScopesList':
k_list.k_add({
k_object: 'Dhcp',
k_localData: [{'k_name': k_tr('Any', 'common'), 'k_id': k_closureLoader.k_NONE}]
});
break;
default:
kerio.lib.k_reportError('Internal error: K_ListLoader does not support sending request for ' + k_list);
return;
}
k_closureLoader._k_dataStore = kerio.waw.shared.k_data.k_get(k_typeId);
kerio.waw.shared.k_data.k_registerObserver(
k_typeId,

function() {
this.k_sendRequest();
},
k_closureLoader
);
k_closureLoader._k_options.k_list = k_list; k_closureLoader._k_options.k_list.k_typeId = k_typeId;
if (k_closureLoader._k_options.k_addNoneOption === false) {
if ('k_certificatesReverseProxyRule' === k_typeId) {
k_list.k_localData.shift();
}
else {
k_list.k_localData = [];
}
}

k_closureLoader.k_getLoadRequest = function() {
var
k_options = this._k_options.k_list;
return {
method: k_options.k_object + '.' + k_options.k_method,
params: k_options.k_params,
root: k_options.k_root
};
};
k_closureLoader.k_isReady = function() {
return k_closureLoader._k_isReady;
};

k_closureLoader.k_sendRequest = function() {
var
k_dataStore = this._k_dataStore,
k_data;
k_closureLoader.k_disable();
k_closureLoader._k_isReady = false;
if (!k_dataStore.k_isLoaded()) {
return;
}
k_data = k_dataStore.k_getData();
kerio.waw.shared.k_methods.k_maskMainScreen(); this.k_setData(k_data);
};

k_closureLoader.k_handleResponse = function(k_data) {
kerio.waw.shared.k_methods.k_maskMainScreen(); k_closureLoader.k_setData(k_data);
};

k_closureLoader.k_setData = function(k_data) {
var
k_options = k_closureLoader._k_options,
k_value = k_options.k_value || {},
k_select = k_options.k_select,
k_list = k_options.k_list,
k_localData = kerio.lib.k_cloneObject(k_list.k_localData) || [],
k_isContentChanged,
k_item,
k_selectItem,
k_i, k_cnt,
k_valueFound = false;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_item = k_data[k_i];
k_valueFound = k_valueFound || k_value.id === k_item[k_list.k_itemId] || k_value.k_id === k_item[k_list.k_itemId];
k_selectItem = {
'k_name': k_item[k_list.k_itemName],
'k_id': k_item[k_list.k_itemId]
};
if (k_closureLoader.k_iconRenderer) {k_selectItem.k_class = k_closureLoader.k_iconRenderer(k_item);
}
k_localData.push(k_selectItem);
}
k_isContentChanged = kerio.waw.status.k_currentScreen.k_isContentChanged();
k_select.k_clearData();
k_select.k_addData(k_localData);
k_closureLoader._k_isReady = true; k_closureLoader.k_disable(0 === k_localData.length); if (k_valueFound || k_localData.length === 0) {
k_closureLoader.k_selectValue(k_value, true);
} else {
k_closureLoader.k_selectValue(k_localData[0], true);
}
kerio.adm.k_framework.k_enableApplyReset(k_isContentChanged);kerio.waw.shared.k_methods.k_unmaskMainScreen();
}; 
k_closureLoader.k_selectValue = function(k_value, k_initial) {
var
k_options = k_closureLoader._k_options,
k_select = k_options.k_select,
k_id,
k_name,
k_origEnableApplyReset;
k_value = k_value || {}; k_closureLoader._k_options.k_value = k_value;
if (!k_closureLoader.k_isReady()) {
return;
}
k_id = k_value.k_id || k_value.id;
k_name = k_value.k_name || k_value.name;
if (undefined !== k_id && k_select.k_containsValue(k_id)) {
if (true === k_initial) {
k_origEnableApplyReset = kerio.adm.k_framework.k_enableApplyReset;
kerio.adm.k_framework.k_enableApplyReset = kerio.waw.shared.k_methods.k_emptyFunction;
}
k_select.k_setValue(k_id, k_initial);
if (true === k_initial) {
kerio.adm.k_framework.k_enableApplyReset = k_origEnableApplyReset;
}
return;
}
k_id = k_id || '';
if ('string' === typeof k_name && '' !== k_name) {
k_select.k_addData({
k_id: k_id,
k_name: k_name
});
if (true === k_initial) {
k_origEnableApplyReset = kerio.adm.k_framework.k_enableApplyReset;
kerio.adm.k_framework.k_enableApplyReset = kerio.waw.shared.k_methods.k_emptyFunction;
}
k_select.k_setValue(k_id, k_initial); if (true === k_initial) {
kerio.adm.k_framework.k_enableApplyReset = k_origEnableApplyReset;
}
return;
}
k_closureLoader.k_selectFirst();
}; 
k_closureLoader.k_getValue = function(k_idKey, k_nameKey) {
var
k_result = {},
k_select = k_closureLoader._k_options.k_select,
k_id = k_select.k_getValue(),
k_name = k_select.k_getText();
if ('' === k_id) { k_id = k_closureLoader._k_options.k_value.k_id || k_closureLoader._k_options.k_value.id;
}
if (k_closureLoader.k_NONE === k_id) { k_id   = '';
k_name = '';
}
if (k_closureLoader._k_isDisabled) { k_id   = '';
k_name = '';
}
k_result[k_idKey || 'id'] = k_id;
k_result[k_nameKey || 'name'] = k_name;
if (-1 !== ['k_timeRanges', 'k_outgoingInterfaces', 'k_ipAddressGroups'].indexOf(k_select.k_listLoader._k_dataStore.k_id)) {
k_result.invalid = false;
}
return k_result;
};

k_closureLoader.k_isEmpty = function() {
return (k_closureLoader._k_isDisabled || 0 >= k_closureLoader._k_options.k_select.k_getValueCount());
};

k_closureLoader.k_selectFirst = function() {
var
k_options = k_closureLoader._k_options,
k_select = k_options.k_select,
k_NONE = k_closureLoader.k_NONE;
if (k_select.k_containsValue(k_NONE)) {
k_select.k_setValue(k_NONE, true);
return;
}
if (0 < k_select.k_getValueCount()) {
k_select.k_selectByIndex(0);
k_select.k_setValue(k_select.k_getValue(), true); return;
}
k_closureLoader.k_disable();
}; 
k_closureLoader.k_disable = function(k_disable) {
var
k_options = k_closureLoader._k_options,
k_select = k_options.k_select;
k_disable = (false !== k_disable);
k_select.k_setReadOnly(k_disable);
k_closureLoader._k_isDisabled = k_disable;
if (k_disable) {
k_select.k_setValue((k_closureLoader.k_isReady()
? kerio.lib.k_tr('No items available', 'common')
: kerio.lib.k_tr('Loading items…', 'common')
), true
);
}
}; k_closureLoader.k_disable(); 
k_closureLoader.k_reset = function() {
var k_options = k_closureLoader._k_options;
k_options.k_select.k_setData(k_options.k_list.k_localData);
}; return k_closureLoader;
}, 
k_sendBatch: function() {
return kerio.waw.requests.k_sendBatchOld.apply(kerio.waw.requests, arguments);
},

k_addBatchControllers: function() {
return kerio.waw.requests.k_addBatchControllers.apply(kerio.waw.requests, arguments);
}, 
k_alertError: function(k_errorMessage, k_title, k_callback) {
if ('string' !== typeof k_title || '' === k_title) {
k_title = kerio.lib.k_tr('Error', 'common');
}
if ('object' === typeof k_errorMessage) {
if (k_errorMessage.message) {
k_errorMessage = kerio.waw.shared.k_methods.k_translateErrorMessage(k_errorMessage);
}
else {
kerio.lib.k_reportError('Internal error: k_alertError called with bad LocalizableMessage!');
k_errorMessage = null;
}
}
else if ('string' === typeof k_errorMessage ) {
if ('' === k_errorMessage) { kerio.lib.k_reportError('Internal error: k_alertError called with empty error message!');
k_errorMessage = null;
} } else {
kerio.lib.k_reportError('Internal error: k_alertError called with unsupported error message!');
k_errorMessage = null;
}
if (!k_errorMessage) {
return;
}
kerio.lib.k_alert({
k_title: k_title,
k_msg: k_errorMessage,
k_icon: 'error',
k_callback: kerio.waw.shared.k_methods._k_alertErrorCallback,
k_scope: k_callback });
}, 
_k_alertErrorCallback: function() {
if ('function' === typeof this.k_function) {
this.k_function.call(this.k_scope);
}
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}, 
k_translateErrorMessage: function(k_errorMessage) {
var
_k_origError = kerio.lib.k_cloneObject(k_errorMessage), k_options = {};
if (k_errorMessage && k_errorMessage.errorMessage) {
k_errorMessage = k_errorMessage.errorMessage; }
if (k_errorMessage && k_errorMessage.code) {
return kerio.lib.k_ajax._k_translateErrorMessage(k_errorMessage);
}
if (!k_errorMessage || 'string' !== typeof k_errorMessage.message) {
kerio.lib.k_reportError('Server Error: Invalid message for translation: ' + kerio.lib.k_jsonEncode(_k_origError), 'translateErrorMessage');
return '';
}
if (k_errorMessage.positionalParameters) {
k_options.k_args = k_errorMessage.positionalParameters;
}
if (k_errorMessage.isSecure) {
k_options.k_isSecure = k_errorMessage.isSecure;
}
if (k_errorMessage.plurality) {
k_options.k_pluralityBy = k_errorMessage.plurality;
}
return kerio.lib.k_tr(k_errorMessage.message, 'serverMessage', k_options);
}, 
k_mergeObjects: function(k_values, k_object, k_property){
var k_key;
if (!k_object) {
k_object = this;
}
if ('object' === typeof k_values
&& null !== k_values && !(Array === k_values.constructor || k_values.k_isInstanceOf )) {
if ('string' !== typeof k_property || '' === k_property) {
for (k_key in k_values) {
kerio.waw.shared.k_methods.k_mergeObjects(k_values[k_key], k_object, k_key);
}
}
else {
if (!k_object[k_property]) {
k_object[k_property] = {}; }
for (k_key in k_values) {
kerio.waw.shared.k_methods.k_mergeObjects(k_values[k_key], k_object[k_property], k_key);
}
}
}
else { k_object[k_property] = k_values;
}
return k_object;
},
k_compare: function(k_original, k_template, k_requireExactMatch, k_requireArrayCount) {

var
k_key,
k_matchedKeys = {};
if ('object' === typeof k_original && 'object' === typeof k_template) { if (k_template.k_isInstanceOf) { return true;
}
if ((k_requireExactMatch || false !== k_requireArrayCount)
&& Array === k_template.constructor && Array === k_original.constructor
&& (k_original.length !== k_template.length)) {
return false;
}
for (k_key in k_template) {
k_matchedKeys[k_key] = true;
if (!arguments.callee(k_original[k_key], k_template[k_key], k_requireExactMatch, k_requireArrayCount)) {
return false;
}
}
if (!k_requireExactMatch) {
return true; }
for (k_key in k_original) {
if (!k_matchedKeys[k_key]) {
return false; }
}
return true;
}
if ('function' === typeof k_template) {
return true;
}
return (k_original === k_template);
},
k_sendVpnRouteData: function (k_options) {
var
k_shared = kerio.waw.shared,
k_action = k_options.k_action,
k_discardAction = k_shared.k_DEFINITIONS.k_SNAPSHOT_OPERATION_TYPES_MAPPED[k_shared.k_CONSTANTS.k_SNAPSHOT_OPERATION_TYPES.k_DISCARD],
k_callback,
k_scope,
k_params;
if ('number' === typeof k_action) {
k_action = k_shared.k_DEFINITIONS.k_SNAPSHOT_OPERATION_TYPES_MAPPED[k_action];
if (k_options.k_callback) {
k_callback = k_options.k_callback;
k_scope = k_options.k_scope;
}
}
else {
k_params = k_options.k_params;
k_scope = k_options.k_scope;
k_callback = k_options.k_callback || (k_scope ? k_scope.k_sendDataCallback : undefined);
}
k_callback = k_callback || kerio.waw.shared.k_methods.k_emptyFunction;
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'VpnRoutes' + '.' + k_action,
params: k_params
},
k_callback: k_callback,
k_scope: k_scope,
k_requestOwner: (k_discardAction === k_action ? null : undefined) });
},
k_findGrid: function(k_widget, k_isRequired) {
var k_grid;
if (k_widget) {
if (k_widget.k_isInstanceOf('K_Grid')) {
k_grid = k_widget;
}
else if (k_widget.k_isInstanceOf('K_Toolbar')) {
k_grid = k_widget.k_relatedWidget;
}
else if (k_widget.k_isInstanceOf('K_Menu')) {
k_grid = k_widget.k_relatedWidget;
}
else { k_grid = k_widget.k_relatedWidget || k_widget.k_relatedGrid || k_widget.k_parent;
}
}
if (false !== k_isRequired && (!k_grid || !k_grid.k_isInstanceOf('K_Grid'))) {
kerio.lib.k_reportError('Internal error: grid not found in given widget!');
return; }
return k_grid;
}, 
k_extractObjectValues: function(k_array, k_property, k_expectedType) {
var
k_result = [],
k_value,
k_cnt, k_i;
k_array = k_array || [];
for (k_i = 0, k_cnt = k_array.length; k_i < k_cnt; k_i++) {
k_value = k_array[k_i][k_property];
switch (k_expectedType) {
case undefined:
k_result.push(k_value);
break;
case 'array':
if (k_value && Array === k_value.constructor) {
k_result.push(k_value);
}
break;
case 'k_widget':
if (k_value && k_value.k_isInstanceOf) { k_result.push(k_value);
}
break;
case '': if (undefined !== k_value) {
k_result.push(k_value);
}
break;
default:
if (k_expectedType === typeof k_value) {
k_result.push(k_value);
}
break;
}
}
return k_result;
}, 
k_createReferencedUserName: function(k_userReference) {
var k_userName, k_className, k_tooltip,
k_tr = kerio.lib.k_tr;
if (!k_userReference || undefined === k_userReference.name || undefined === k_userReference.domainName) {
return {
k_userName: '',
k_iconClass: ''
};
}
if (k_userReference.name) { k_userName = k_userReference.name;
if (k_userReference.domainName) { k_userName += '@' + k_userReference.domainName;
}
if (true === k_userReference.isGroup) { k_className = 'userGroupIcon';
}
else {
k_className = 'userIcon';
}
}
else { k_userName = '{' + k_userReference.id + '}';
k_className = 'userList userUnknown';
k_tooltip = k_tr('This user or group is from a mapped domain that is currently unavailable.', 'common');
}
return {
k_userName: k_userName,
k_iconClass: k_className,
k_tooltip: k_tooltip };
}, 
k_joinReferenceList: function(k_params) {
var
k_referenceList = k_params.k_referenceList,
k_limit = k_params.k_limit,
k_start = k_params.k_start,
k_method = k_params.k_method,
k_grid = k_params.k_grid,
k_stringProperty = k_params.k_stringProperty,
k_resultList,
k_tmp,
k_cnt, k_i;
if (!k_referenceList || Array !== k_referenceList.constructor) {
return ''; }
if ('number' !== typeof k_start || 0 >= k_start) {
k_start = 0;
}
k_cnt = k_referenceList.length - k_start; if ('number' !== typeof k_limit || 0 > k_limit) {
k_limit = k_cnt;
}
k_limit = Math.min(k_limit, k_cnt); k_resultList = [];
for (k_i = 0; k_i < k_limit; k_i++) {
k_tmp = k_method(k_referenceList[k_i + k_start], k_grid);
k_resultList.push(k_tmp[k_stringProperty]);
}
return k_resultList.join(', ');
}, 
k_isRuleRowWithPropertySelected: function(k_propertyName) {
var
k_row,
k_i, k_cnt;
if (!this.k_isInstanceOf('K_Grid')) {
kerio.lib.k_reportError('Internal error: Method isDefaultRuleSelected can be called only on the Grid! (check your scope ;)');
return false;
}
k_row = this.k_findRow(k_propertyName, true);
if (Array === k_row.constructor) {
for (k_i = 0, k_cnt = k_row.length; k_i < k_cnt; k_i++) {
if (this.k_isRowSelected(k_row[k_i])) {
return true;
}
}
}
return false;
},

k_formatPort: function(k_portCondition) {
var
k_WAW_PORT_COMPARATOR_ID = kerio.waw.shared.k_CONSTANTS.PortComparator,
k_tr = kerio.lib.k_tr,
k_text = '',
k_comparator = k_portCondition.comparator,
k_ports = k_portCondition.ports;
switch (k_comparator) {
case k_WAW_PORT_COMPARATOR_ID.Equal:     k_text = k_ports;
break;
case k_WAW_PORT_COMPARATOR_ID.Range:        k_text = k_ports[0] + ' - ' + k_ports[1];
break;
case k_WAW_PORT_COMPARATOR_ID.Any:
k_text = k_tr('Any', 'serviceList');
break;
case k_WAW_PORT_COMPARATOR_ID.LessThan:    k_text = k_tr('Less than %1', 'serviceList', {k_args: k_ports});
break;
case k_WAW_PORT_COMPARATOR_ID.GreaterThan: k_text = k_tr('Greater than %1', 'serviceList', {k_args: k_ports});
break;
case k_WAW_PORT_COMPARATOR_ID.List:         k_text = k_ports.join(', ');
break;
}
return k_text;
},
k_formatServiceName: function(k_name, k_data) {
var
k_status = k_data.status,
k_isGroup = k_data.group || k_data.isGroup,
k_className = k_isGroup ? 'serviceGroupIcon ' : 'serviceIcon ';
if (kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusNew === k_status) {
k_className += 'added';
}
else {
if (kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusModified === k_status) {
k_className += 'modified';
}
}
return {
k_data: k_name,
k_iconCls: k_className
};
},

k_formatCollapsedRowData: function(k_params) {
var
k_referenceList = k_params.k_referenceList,
k_stringProperty = k_params.k_stringProperty,
k_method = k_params.k_method,
k_count = k_referenceList.length,
k_secure = kerio.lib.k_htmlEncode,
k_pluralityCount,
k_value,k_tooltip;k_tooltip = k_secure(kerio.waw.shared.k_methods.k_joinReferenceList(
{k_referenceList: k_referenceList,
k_method: k_method,
k_stringProperty: k_stringProperty
}
)
)
|| undefined; switch (k_count) {
case 1:
case 2:
case 3:
k_value = k_tooltip; break;
default:
k_pluralityCount = k_count - 2;
k_value = k_secure(
kerio.lib.k_tr('%1, %2 and %3 more', 'ruleList', {
k_args: [
k_method(k_referenceList[0])[k_stringProperty],
k_method(k_referenceList[1])[k_stringProperty],
k_pluralityCount
],
k_pluralityBy: k_pluralityCount
}));
break;
}
return {
k_value: k_value,
k_tooltip: k_tooltip
};
},
k_formatInterfaceName: function(k_value, k_data, k_checkDeadInterfaces) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_constInterfaceTypes = k_CONSTANTS.InterfaceType,
k_constStoreStatus = k_CONSTANTS.kerio_web_SharedConstants,
k_tr = kerio.lib.k_tr,
k_dataType = k_data.type,
k_iconCls;
k_checkDeadInterfaces = false !== k_checkDeadInterfaces;
if (k_constInterfaceTypes.k_EMPTY === k_dataType) {
return {
k_data: k_tr('No interfaces are assigned to this group.', 'interfaceList'),
k_className: 'emptyGroup'
};
}
if (k_data.invalid){
return {
k_data: k_tr('Nothing', 'common'),
k_iconCls: 'objectNothing'
};
}
k_iconCls = 'interfaceIcon';
switch (k_dataType) {
case k_constInterfaceTypes.Ethernet:
if (k_data.flags && (k_data.flags.virtualSwitch || k_data.flags.wifi)) { if (k_data.flags.virtualSwitch) {
k_iconCls += ' interfaceLanSwitch';
}
else {
k_iconCls += ' interfaceWifi';
if (k_constStoreStatus.kerio_web_StoreStatusNew === k_data.status) {
k_iconCls += ' itemAdded';
}
}
}
else {
if (k_CONSTANTS.InterfaceModeType.k_PPPoE === k_data.mode) {
k_iconCls += ' interfaceEthernetPppoe';
}
else {
k_iconCls += ' interfaceEthernet';
}
}
break;
case k_constInterfaceTypes.Ras:
k_iconCls += ' interfaceRas';
break;
case k_constInterfaceTypes.DialIn:
k_iconCls += ' interfaceDialIn';
break;
case k_constInterfaceTypes.VpnServer:
k_iconCls += ' interfaceVpnServer';
k_value = k_tr('VPN Server', 'interfaceList');
break;
case k_constInterfaceTypes.VpnTunnel:
if (k_data.tunnel && k_CONSTANTS.VpnType.VpnIpsec === k_data.tunnel.type) {
k_iconCls += ' interfaceIpsecTunnel';
} else {
k_iconCls += ' interfaceVpnTunnel';
}
if (k_constStoreStatus.kerio_web_StoreStatusNew === k_data.status) {
k_iconCls += ' itemAdded';
}
break;
case 'k_internetInterfaceEntity':
k_iconCls += ' interfaceHeaderIcon groupInternet';
break;
case 'k_trustedInterfaceEntity':
k_iconCls += ' interfaceHeaderIcon groupTrusted';
break;
case 'k_guestInterfaceEntity':
k_iconCls += ' interfaceHeaderIcon groupGuest';
break;
case 'k_vpnServerInterfaceEntity':
k_iconCls += ' interfaceHeaderIcon interfaceVpnServer';
break;
case 'k_vpnTunnelsInterfaceEntity':
k_iconCls += ' interfaceAllVpnTunnels';
break;
case k_constInterfaceTypes.PortAssignmentUnassigned:
k_iconCls = ''; k_value = k_tr('<Unassigned>', 'interfaceList');
break;
} if (k_checkDeadInterfaces && kerio.waw.shared.k_methods.k_isInterfaceDead(k_data)) {
k_iconCls += ' dead';
}
if (k_constStoreStatus.kerio_web_StoreStatusModified === k_data.status) {
k_iconCls += ' itemModified';
}
if (k_constStoreStatus.kerio_web_StoreStatusNew === k_data.status) {
k_iconCls += ' itemNew';
}
return {
k_data: k_value,
k_iconCls: k_iconCls
};
}, 
k_flip: function(k_original, k_merge) {
var
k_inverted = [],
k_key, k_value;
if ('object' !== typeof k_original) {
return null;
}
for (k_key in k_original) {
k_value = k_original[k_key];
if ('object' === typeof k_value || 'function' === typeof k_value) {
continue; }
k_inverted[k_value] = k_key;
}
if (k_merge) {
kerio.waw.shared.k_methods.k_mergeObjects(k_original, k_inverted);
}
return k_inverted;
}, 
k_mapProperties: function(k_data, k_map, k_forceAll) {
var
k_output = {},
k_alreadyMapped = {},
k_property,
k_mapped,
k_value;
for (k_property in k_data) {
k_mapped = k_map[k_property];
if (!k_mapped) {
continue; }
k_alreadyMapped[k_property] = true;
k_value = k_data[k_property];
if ('function' === typeof k_mapped) {
kerio.waw.shared.k_methods.k_mergeObjects(
k_mapped(k_property, k_value, k_data),
k_output
); }
else if ('string' === typeof k_mapped) {
k_output[k_mapped] = k_value;
}
else {
kerio.lib.k_reportError('Internal error: Invalid property map. Unsupported type '+(typeof k_mapped), 'sharedMethods::mapProperty');
}
} if (k_forceAll) {
for (k_property in k_map) {
if (!k_alreadyMapped[k_property]) {
k_value = null;
k_mapped = k_map[k_property];
if ('function' === typeof k_mapped) {
kerio.waw.shared.k_methods.k_mergeObjects(
k_mapped(k_property, k_value, k_data),
k_output
); }
else if ('string' === typeof k_mapped) {
k_output[k_mapped] = k_value;
}
else {
kerio.lib.k_reportError('Internal error: Invalid property map. Unsupported type '+(typeof k_mapped), 'sharedMethods::mapProperty');
}
}
}
}
return k_output;
}, 
k_filterUnknownUser: function(k_data) {
var
SelectedUsers = kerio.waw.shared.k_CONSTANTS.UserConditionType.SelectedUsers,
k_entities = [],
k_users = [],
k_entity,
k_userType,
k_i, k_cnt;
if (k_data.sourceCondition) { k_entities = k_data.sourceCondition.entities;
}
else if (k_data.source && k_data.destination) { k_entities = k_entities.concat(k_data.source.entities, k_data.destination.entities);
}
else { kerio.lib.k_reportError('Unsupported grid to look for mapped users.', 'sharedMethods', 'k_filterUnknownUser');
return false;
}
for (k_i = 0, k_cnt = k_entities.length; k_i < k_cnt; k_i++) {
k_entity = k_entities[k_i];
k_userType = (undefined !== k_entity.userType) ? k_entity.userType : k_entity.type; if (SelectedUsers !== k_userType) {
continue; }
k_users = k_users.concat(k_entity.user || k_entity.users); }
for (k_i = 0, k_cnt = k_users.length; k_i < k_cnt; k_i++) {
if ('' === k_users[k_i].name) {
return true;
}
}
return false;
},
k_reportUnknownUsers: function(k_statusBarConfigId) {
if ('k_ruleInactive' === k_statusBarConfigId) {
return k_statusBarConfigId;
}
var
k_statusbarConfig = false,
k_rowDataList;
k_rowDataList = this.k_findRowBy(kerio.waw.shared.k_methods.k_filterUnknownUser);
if (k_rowDataList) {
k_statusbarConfig = 'k_userUnknown';
}
return k_statusbarConfig;
},
k_ipToNumber: function(k_ip) {
var
k_i,
k_parts = k_ip.split('.'),
k_result = parseInt(k_parts[0], 10),
k_shift8Left = 256; for (k_i = 1; k_i < 4; k_i++) {
k_result = (k_result * k_shift8Left) + parseInt( k_parts[k_i], 10); }
return k_result;
}, 
k_getSslCertificateFields: function(k_type, k_idPrefix, k_config) {
var
k_isFieldset = false,
k_tr = kerio.lib.k_tr,
k_fieldsCfg = [],
k_certificateName,
k_labelWidth,
k_restartWarn,
k_onCertificateChange,
k_fingerprintField,
k_fingerprintSha1Field,
k_fingerprintSha256Field,
k_certificateErrorField,
k_certificateField,
k_restartWarnField,
k_certificateRow,
k_timeFields,
k_message,
k_items,
k_inputsWidth,
k_customClassName;
k_config = k_config || {};
k_labelWidth = k_config.k_labelWidth || 135;
k_inputsWidth = k_config.k_inputsWidth || 250;
k_restartWarn = k_config.k_restartWarn || false;
k_onCertificateChange = k_config.k_onCertificateChange;
k_certificateName = k_config.k_caption || k_tr('Certificate:', 'sslCertificate');
k_customClassName = k_config.k_className || '';
if (k_idPrefix) {
k_idPrefix = k_idPrefix + '_';
}
else {
k_idPrefix = ''; }
k_fingerprintField = {
k_caption: k_tr('Fingerprint:', 'sslCertificate'),
k_id: k_idPrefix + 'k_fingerprint',
k_width: k_inputsWidth,
k_isReadOnly: true
};
k_fingerprintSha1Field = {
k_caption: k_tr('SHA1 fingerprint:', 'sslCertificate'),
k_id: k_idPrefix + 'k_fingerprintSha1',
k_width: k_inputsWidth,
k_isReadOnly: true
};
k_fingerprintSha256Field = {
k_caption: k_tr('SHA-256 fingerprint:', 'sslCertificate'),
k_id: k_idPrefix + 'k_fingerprintSha256',
k_width: k_inputsWidth,
k_isReadOnly: true
};
k_timeFields = {
k_type: 'k_container',
k_items: [
{k_type: 'k_row',
k_items: [
{k_type: 'k_date',
k_id: k_idPrefix + 'k_validFromDate',
k_caption: k_tr('Valid from:', 'sslCertificate'),
k_isReadOnly: true,
k_width: 100
},
{k_id: k_idPrefix + 'k_validFromTime',
k_isLabelHidden: true,
k_isReadOnly: true,
k_width: 100
}
]
},
{k_type: 'k_row',
k_items: [
{k_type: 'k_date',
k_id: k_idPrefix + 'k_validToDate',
k_caption: k_tr('Valid to:', 'sslCertificate'),
k_isReadOnly: true,
k_width: 100
},
{k_id: k_idPrefix + 'k_validToTime',
k_isLabelHidden: true,
k_isReadOnly: true,
k_width: 100
}
]
}
]
};
k_message = {
k_type: 'k_display',
k_isLabelHidden: true,
k_isSecure: true,
k_isHidden: true,
k_id: k_idPrefix + 'k_certificateMessage',
k_indent: 1,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('Valid certificate has to be selected in order to allow the communication through the VPN tunnels.', 'sslCertificate')
};
k_certificateErrorField = kerio.lib.k_cloneObject(k_message, {
k_isLabelHidden: false,
k_labelWidth: k_labelWidth,
k_caption: '',
k_id: k_idPrefix + 'k_certificateError',
k_value: '',
k_indent: 0,
k_icon: 'weblib/int/lib/img/actionResult.png?v=8629',
k_className: 'userMessage warning'
});
if ('k_ipsecServer' === k_type) {
k_certificateName = ['<span ', kerio.lib.k_buildTooltip(k_message.k_value), '>',
k_certificateName,
'<span class="tooltip" ', kerio.lib.k_buildTooltip(k_message.k_value),'>&nbsp; &nbsp; &nbsp;</span>',
'</span>'].join('');
}
k_certificateField = {
k_type: 'k_certificateDefinitionSelect',
k_id: k_idPrefix + 'k_certificate',
k_isLabelHidden: true,
k_isDisabled: k_config.k_isDisabled || false,
k_width: 'k_ipsecServer' === k_type ? 200 : k_inputsWidth,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: [],
k_onChange: kerio.waw.shared.k_methods.k_updateSslCertificateFields,
k_onApplyResetHandler: kerio.waw.shared.k_methods.k_definitionApplyResetHandler
};
if (k_onCertificateChange) {
k_certificateField.k_onChange = kerio.waw.shared.k_methods.k_updateSslCertificateFields.createSequence(k_onCertificateChange);
}
k_certificateRow = {
k_type: 'k_row',
k_items: [
{
k_id: k_idPrefix + 'k_certificateCaption',
k_type: 'k_display',
k_isLabelHidden: true,
k_isSecure: true,
k_value: k_certificateName,
k_width: k_labelWidth,
k_isHidden: k_type === 'k_ipsecTunnel',
k_isDisabled: k_config.k_isDisabled || false
},
k_certificateField
]
};
k_restartWarnField = kerio.lib.k_cloneObject(k_message, {
k_restrictions: {
k_restartWarn: [ true ],
k_isSecureConnection: [ true ]
},
k_id: k_idPrefix + 'k_restartWarn',
k_isHidden: !k_restartWarn,
k_isLabelHidden: false,
k_caption: '',
k_indent: 0,
k_value: '<b>' + k_tr('If you change the certificate, you will need to login again to the Kerio Control Administration.', 'sslCertificate') + '</b> '
});
switch (k_type) {
case 'k_webserver':
k_isFieldset = true;
k_items = [k_certificateRow, k_restartWarnField, k_certificateErrorField];
break;
case 'k_ipsecServer':
k_items = [k_certificateRow, k_certificateErrorField, k_certificateErrorField];
break;
case 'k_kerioVpnServer':
k_certificateField.k_width = '100%';
k_items = [k_certificateRow, k_fingerprintField, k_certificateErrorField];
break;
case 'k_ipsecTunnel':
k_certificateField.k_width = '100%';
k_certificateErrorField.k_isLabelHidden = true;
k_items = [k_certificateField, k_certificateErrorField];
break;
case 'k_reverseProxy':
k_items = [k_certificateRow, k_certificateErrorField];
break;
case 'k_reverseProxyRule':
k_certificateField.k_width = '100%';
k_items = [k_certificateField, k_certificateErrorField];
break;
case 'k_details':
k_items = [k_fingerprintField, k_fingerprintSha1Field, k_fingerprintSha256Field, k_timeFields, k_certificateErrorField];
break;
}
k_fieldsCfg = {
k_type: (k_isFieldset ? 'k_fieldset' : 'k_container'),
k_labelWidth: k_labelWidth,
k_id: k_idPrefix + 'k_sslCertificate',
k_caption: k_isFieldset
? k_tr('SSL certificate', 'sslCertificate')
: undefined, k_className: (k_isFieldset ? 'formLastContainer' : '') + ('k_details' === k_type ? ' marginTop lastFormItem' : '') + k_customClassName,
k_items: k_items
};return k_fieldsCfg;
},
k_getSslCertificate: function(k_id, k_storeId) {
var
k_data  = kerio.waw.shared.k_data.k_get(k_storeId).k_getData(),
k_i, k_cnt;
if (k_id) {
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_data[k_i].id === k_id) {
return k_data[k_i];
}
}
}
return undefined;
},

k_updateSslCertificateFields: function(k_form, k_select, k_value) {
var
k_dataStoreId = k_select._k_fieldPrefix === ('k_ipsecTunnel' + '_') ? 'k_ipsecTunnelCertificates' : 'k_certificates',
k_certificate;
k_certificate = kerio.waw.shared.k_methods.k_getSslCertificate(k_value, k_dataStoreId);
kerio.waw.shared.k_methods.k_fillSslCertificateFields(k_form, k_select, k_certificate);
},

k_fillSslCertificateFields: function(k_form, k_select, k_certificate) {
var
k_tr = kerio.lib.k_tr,
k_methods = kerio.waw.shared.k_methods,
k_prefix = k_methods.k_prefixObjectValues,
kerio_web_SharedConstants = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_periodValid = true,
k_certificateValid,
k_errorMessage = '',
k_formData = {},
k_idPrefix,
k_validToDateElement,
k_validToTimeElement,
k_validPeriod,
k_validityType;
k_idPrefix = undefined !== k_select._k_fieldPrefix ? k_select._k_fieldPrefix : k_select.k_name.slice(0, k_select.k_name.length - 'k_certificate'.length);
k_validToDateElement = k_form.k_getItem(k_idPrefix + 'k_validToDate');
k_validToTimeElement = k_form.k_getItem(k_idPrefix + 'k_validToTime');
if (k_certificate) {
k_certificateValid = k_certificate.valid;
k_validPeriod = k_certificate.validPeriod;
k_validityType = k_validPeriod.validType;
if (!k_certificateValid) {
k_form.k_setVisible([k_idPrefix + 'k_certificateError'], true);
k_form.k_setData(k_prefix(k_idPrefix, {
'k_certificateError': k_tr('The certificate is not valid.', 'sslCertificate')
}));
}
else if (kerio_web_SharedConstants.kerio_web_Valid !== k_validityType) {
switch (k_validityType) {
case kerio_web_SharedConstants.kerio_web_NotValidYet:
k_errorMessage = k_tr('The certificate is not valid yet.', 'sslCertificate');
break;
case kerio_web_SharedConstants.kerio_web_ExpireSoon:
k_errorMessage = k_tr('The certificate will expire soon.', 'sslCertificate');
break;
case kerio_web_SharedConstants.kerio_web_Expired:
k_errorMessage = k_tr('The certificate has already expired or is untrusted.', 'sslCertificate');
break;
}
if (kerio_web_SharedConstants.kerio_web_NotValidYet !== k_validityType && k_validToDateElement && k_validToTimeElement) {
k_validToDateElement.k_addClassName('redText');
k_validToTimeElement.k_addClassName('redText');
}
k_periodValid = false;
}
else if (k_validToDateElement && k_validToTimeElement) {
k_validToDateElement.k_removeClassName('redText');
k_validToTimeElement.k_removeClassName('redText');
}
k_formData = k_prefix(k_idPrefix, {
k_fingerprint: k_certificate.fingerprint,
k_fingerprintSha1: k_certificate.fingerprintSha1,
k_validFromDate: k_methods.k_dateToUnixTimestamp(k_validPeriod.validFromDate),
k_validFromTime: k_methods.k_formatTime(k_validPeriod.validFromTime),
k_validToDate: k_methods.k_dateToUnixTimestamp(k_validPeriod.validToDate),
k_validToTime: k_methods.k_formatTime(k_validPeriod.validToTime),
k_certificateError: k_errorMessage
});
k_form.k_setVisible([k_idPrefix + 'k_certificateError'], !k_periodValid);
k_form.k_setVisible([k_idPrefix + 'k_certificateMessage'], k_periodValid);
k_form.k_setData(k_formData, true);
}
if (false !== k_select._k_handleApplyReset) {
kerio.adm.k_framework.k_enableApplyReset();
}
},

k_setSslCertificateFieldsetData: function(k_config, k_sslCertificate, k_initial) {
var
k_form = k_config.k_form,
k_idPrefix = k_config.k_idPrefix ? k_config.k_idPrefix + '_' : '',
k_showRemoteCertificate = k_config.k_showRemoteCertificate || false,
k_noneOptionForInvalidCertificate = k_config.k_noneOptionForInvalidCertificate || false,
k_handleApplyReset = false !== k_config.k_handleApplyReset,
k_select = k_form.k_getItem(k_idPrefix + 'k_certificate'),
k_listLoaderId = k_config.k_listLoaderId || 'k_certificates',
k_listLoader;
k_initial = true === k_initial;
if (!k_select) {
kerio.lib.k_reportError('Internal error: given form %1 does not contain SSL certificate select'.replace('%1', k_form.k_id), 'k_setSslCertificateFieldsetData');
return;
}
if (!k_select.k_listLoader) {
k_select._k_fieldPrefix = k_idPrefix; k_listLoader = new kerio.waw.shared.k_methods.K_ListLoader({ k_list: k_listLoaderId,
k_select: k_select,
k_form: k_form,
k_value: k_sslCertificate,
k_addNoneOption: k_showRemoteCertificate || (k_noneOptionForInvalidCertificate && k_sslCertificate && k_sslCertificate.invalid)
});
k_listLoader.k_sendRequest();
k_select.k_listLoader = k_listLoader;
}
else {
delete k_select.k_listLoader._k_options.k_value;
k_select.k_listLoader.k_setData(kerio.waw.shared.k_data.k_get(k_listLoaderId).k_getData());
k_select.k_listLoader.k_selectValue(k_sslCertificate, k_initial);
}
k_select._k_handleApplyReset = k_handleApplyReset; kerio.waw.shared.k_methods.k_updateSslCertificateFields(k_form, k_select, k_sslCertificate.id);
},

k_normalize: function (k_base, k_length, k_options) {
var
k_fill = ' ', k_addToEnd,
k_i;
k_options = k_options || {}; k_addToEnd = (true === k_options.k_addToEnd);
k_base = k_base || '';
if (true === k_options.k_number) {
k_base = k_base.toString();
k_fill = '0';
}
if (true === k_options.k_binary) {
k_base = parseInt(k_base, 10); if (isNaN(k_base)) {
k_base = '';
}
else {
k_base = k_base.toString(2);
}
k_fill = '0';
}
if (undefined !== k_options.k_fill) {
k_fill = k_options.k_fill;
}
if ('string' !== typeof k_base) {
if ('function' === typeof k_base.toString) {
k_base = k_base.toString();
}
else {
k_base = '';
}
}
for (k_i = k_base.length; k_i < k_length; k_i++) {
if (k_addToEnd) {
k_base += k_fill;
}
else {
k_base = k_fill + k_base;
}
}
return k_base;
}, 
k_formatNumber: function(k_number, k_config) {
var
k_defaultConfig = {
k_decimalSeparator: '.',
k_decimalPlaces: 2,
k_groupSeparator: ' '
},
k_string,
k_regExp,
k_parts,
k_int,
k_dec;
if (k_config) {
k_defaultConfig = kerio.waw.shared.k_methods.k_mergeObjects(k_config, k_defaultConfig);
}
k_config = k_defaultConfig;
k_regExp = /(\d+)(\d{3})/;
k_number = Number(k_number);
k_string = k_number.toFixed(k_config.k_decimalPlaces);
k_parts = k_string.split('.');
k_int = k_parts[0];
if (!k_parts[1]) {
k_dec = '';
} else {
k_dec = k_parts[1];
}
while (k_regExp.test(k_int)) {
k_int = k_int.replace(k_regExp, '$1' + k_config.k_groupSeparator + '$2');
}
if (0 === k_config.k_decimalPlaces) {
return k_int;
}
return k_int + k_config.k_decimalSeparator + k_dec;
},
k_detectGridEditor: function(k_sender, k_buttonOrData, k_columnOrEvent, k_event) {
var
k_EVENTS = kerio.lib.k_constants.k_EVENT,
k_TYPES = k_EVENTS.k_TYPES,
k_KEY_CODES  = k_EVENTS.k_KEY_CODES,
k_columnId = '',
k_grid,
k_eventId;
if (k_sender.k_isInstanceOf('K_Grid')) {
if ('string' === typeof k_columnOrEvent) { k_columnId = k_columnOrEvent;
}
else {
k_event = k_columnOrEvent;
}
switch (k_event.k_type) {
case k_TYPES.k_KEY_PRESSED:
if (k_KEY_CODES.k_ENTER === k_event.k_browserEvent.keyCode) {
k_eventId = 'k_onEnter';
}
else {
k_eventId = 'k_onKeyPress';
}
break;
case k_TYPES.k_DOUBLE_CLICK:
k_eventId = 'k_onDblClick';
break;
default:
k_eventId = '';
break;
}
return {
k_grid:    k_sender,
k_rowData: k_buttonOrData, k_eventId: k_eventId,
k_columnId: k_columnId
}; }
k_grid =    k_sender.k_parentWidget;
k_eventId = k_buttonOrData.k_name; return {
k_grid:    k_grid,
k_rowData: (1 === k_grid.k_selectionStatus.k_selectedRowsCount) ? k_grid.k_selectionStatus.k_rows[0].k_data : {},
k_eventId:  k_eventId
}; },
k_ipToBinary: function(k_ipAddress) {
var
k_parts = k_ipAddress.split('.');
return (parseInt(k_parts[0], 10) << 24) + (parseInt(k_parts[1], 10) << 16) + (parseInt(k_parts[2], 10) << 8) + parseInt(k_parts[3], 10);
},

k_compareIpv6Addresses: function(k_ipv6AddressLeft, k_ipv6AddressRight) {
var
k_createIpv6AddressFullFormat = kerio.waw.shared.k_methods.k_createIpv6AddressFullFormat,
k_ipv6AddressLeftFull = k_createIpv6AddressFullFormat(k_ipv6AddressLeft),
k_ipv6AddressRightFull = k_createIpv6AddressFullFormat(k_ipv6AddressRight),
k_partsLeft,
k_partsRight,
k_i;
if (k_ipv6AddressLeftFull.length === k_ipv6AddressRightFull.length && 0 === k_ipv6AddressLeftFull.indexOf(k_ipv6AddressRightFull)) {
return 0;
}
k_partsLeft = k_ipv6AddressLeftFull.split(':');
k_partsRight = k_ipv6AddressRightFull.split(':');
for (k_i = 0; k_i < 8; k_i++) {
if (k_partsLeft[k_i] !== k_partsRight[k_i]) {
return parseInt(k_partsLeft[k_i], 16) > parseInt(k_partsRight[k_i], 16) ? -1 : 1;
}
}
return 0;
},

k_prefixObjectValues: function(k_prefix, k_object, k_copy, k_skipFunctions) {
k_copy = (false !== k_copy); k_skipFunctions =  (false !== k_skipFunctions);
var
k_output = {},
k_key, k_value;
if (!k_prefix && !k_copy) { return k_object;
}
for (k_key in k_object) {
k_value = k_object[k_key];
if (k_skipFunctions && 'function' === typeof k_value) {
continue;
}
k_output[k_prefix + k_key] = k_value;
if (!k_copy) { delete k_output[k_key];
}
}
if (!k_copy) {
kerio.waw.shared.k_methods.k_mergeObjects(k_output, k_object);
}
return k_output;
}, 
k_formatIpAddress: function(k_address, k_mask) {
if (!k_address) {
return ''; }
if ('string' !== typeof k_address) { k_mask = (false === k_mask ? '' : k_address.mask || k_address.prefixLength);
k_address = k_address.ip;
}
else if ('string' !== typeof k_mask) { k_mask = '';
}
return (k_address ? k_address + (k_mask ? ('/' + k_mask) : '') : '');
},

k_formatMacAddress: function(k_value) {
var
k_methods = kerio.waw.shared.k_methods;
return k_methods.k_addMacAddressDelimiters(k_methods.k_removeMacAddressDelimiters(k_value));
},

k_removeHexDelimiter: function(k_value, k_delimiter) {
var
k_array;
if (!k_value) {
return '';
}
if (!k_delimiter) {
k_delimiter = ' ';
}
k_array = k_value.split(k_delimiter);
k_value = k_array.join('');
return k_value;
},

k_addHexDelimiter: function(k_value, k_delimiter) {
var
k_i,
k_length,
k_output = [];
if (!k_value) {
return '';
}
if (!k_delimiter) {
k_delimiter = ' ';
}
for (k_i = 0, k_length = k_value.length; k_i < k_length; k_i += 2) {
k_output.push(k_value.substr(k_i, 2));
}
return k_output.join(k_delimiter);
},

k_removeMacAddressDelimiters: function(k_value) {
if (!k_value) {
return '';
}
if (k_value.length > 12) {k_value = kerio.waw.shared.k_methods.k_removeHexDelimiter(k_value, k_value.charAt(2));
}
return k_value.toLowerCase();
},

k_addMacAddressDelimiters: function(k_value) {
return kerio.waw.shared.k_methods.k_addHexDelimiter(k_value, '-');
},

k_alertEmptyGroupSelect: function() {
var
k_lib = kerio.lib;
k_lib.k_alert(
k_lib.k_tr('No group available', 'policyList'),
k_lib.k_tr('There is no group available. Please select another option.', 'policyList')
); }, 
k_parseNetwork: function(k_value, k_displayError) {
var
k_methods = kerio.waw.shared.k_methods,
k_validators = k_methods.k_validators,
k_return = {k_isOk: false, k_isMatch: false, k_network: '', k_mask: ''},
k_list = kerio.waw.shared.k_methods.k_removeSpacesFromString(k_value).split('/'),
k_ip,
k_mask;
if (2 !== k_list.length) {  return k_return;
}
k_ip = k_list[0];
k_mask = k_list[1];
if (!k_validators.k_isIpAddress(k_ip)) {
return k_return;
}
if (k_validators.k_isCidrMask(k_mask)) {
k_mask = k_methods.k_convertCidrToMask(k_mask);
}
if (!k_validators.k_isIpMask(k_mask)) {
return k_return;
}
k_return.k_isOk = true;
k_return.k_network = k_ip;
k_return.k_mask = k_mask;
k_return.k_isMatch = k_methods.k_validateNetwork(k_ip, k_mask, k_displayError);
return k_return;
},

k_validateNetwork: function(k_networkIp, k_networkMask, k_displayError) {
var
k_lib = kerio.lib,
k_methods = kerio.waw.shared.k_methods,
k_isValid = k_methods.k_validators.k_isNetwork(k_networkIp, k_methods.k_convertCidrToMask(k_networkMask));
if (k_displayError && !k_isValid) {
k_lib.k_alert(
k_lib.k_tr('Invalid Network', 'common'),
k_lib.k_tr('Network address %1 does not match the mask %2.', 'common',
{k_args: [k_networkIp, k_networkMask]}
)
);
}
return k_isValid;
},

k_validateIPv6Network: function(k_networkIp, k_networkMask, k_displayError) {
var
k_lib = kerio.lib,
k_isValid = kerio.waw.shared.k_methods.k_validators.k_isIpv6Network(k_networkIp, k_networkMask);
if (k_displayError && !k_isValid) {
k_lib.k_alert(
k_lib.k_tr('Invalid Network', 'common'),
k_lib.k_tr('The prefix %1 does not match the prefix length %2.', 'common',
{k_args: [k_networkIp, k_networkMask]}
)
);
}
return k_isValid;
},

k_validateNetworkFields: function(k_form, k_networkId, k_maskId, k_displayError) {
var
k_network,
k_mask,
k_validationNetworkMessage;
if (true === k_form && 1 === arguments.length) {
k_displayError = true;
k_form = undefined;
}
k_form = k_form || this;
if (!k_form.k_getItem) {
kerio.lib.k_reportError('Method called in unsupported k_form param.', 'sharedMethods', 'k_validateNetworkFields');
}
k_network = k_form.k_getItem(k_networkId) || k_form.k_getItem('k_network') || k_form.k_getItem('network') || k_form.k_getItem('k_networkIp');
k_mask = k_form.k_getItem(k_maskId) || k_form.k_getItem('k_mask') || k_form.k_getItem('mask') || k_form.k_getItem('k_networkMask');
if (!k_network || !k_mask || !k_network.k_getValue || !k_mask.k_getValue) {
kerio.lib.k_reportError('Form does not contain required fields.', 'sharedMethods', 'k_validateNetworkFields');
}
if (!k_network.k_isValid(false) || !k_mask.k_isValid(false)) {
return false;
}
if (!kerio.waw.shared.k_methods.k_validateNetwork(k_network.k_getValue(), k_mask.k_getValue(), k_displayError)) {
k_validationNetworkMessage = kerio.lib.k_tr('The network address does not match the mask.', 'common');
k_network.k_markInvalid(true, k_validationNetworkMessage);
k_mask.k_markInvalid(true, k_validationNetworkMessage);
return false;
}
k_network.k_markInvalid(false);
k_mask.k_markInvalid(false);
return true;
},

k_validateNetworkFieldsHandler: function(k_form, k_element, k_value) {
kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars(k_form, k_element, k_value);
kerio.waw.shared.k_methods.k_validateNetworkFields(k_form);
},

k_optionalCheckboxObserver: function(k_form, k_checkbox, k_isChecked) {
var
k_itemId = k_checkbox.k_name.slice(0, k_checkbox.k_name.lastIndexOf('.')),
k_relatedElementId = k_itemId + '.value',
k_relatedUnitsId = k_itemId + '.units';
k_form.k_getItem(k_relatedElementId).k_setDisabled(!k_isChecked);
if (k_form.k_getItem(k_relatedUnitsId)) {
k_form.k_getItem(k_relatedUnitsId).k_setDisabled(!k_isChecked);
}
},

k_enableCheckboxObserver: function(k_closureEnable, k_closureDisable) {
k_closureEnable = k_closureEnable || [];
k_closureDisable = k_closureDisable || [];
return function(k_form, k_checkbox, k_isChecked){
if (k_form.k_formManager) {          k_form = k_form.k_formManager;   }
k_form.k_setDisabled(k_closureEnable, !k_isChecked);
k_form.k_setDisabled(k_closureDisable, k_isChecked);
};
},

k_addRefreshCheckbox: function(k_config) {
var
k_checkboxCfg, k_checkbox;
k_checkboxCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_AutoRefreshCheckbox', {
k_onChange: k_config.k_onChangeAutoRefresh
});
k_checkbox = new kerio.lib.K_Checkbox(k_config.k_toolbar.k_id + '_' + 'k_checkbox' +  '_' + 'k_autoRefresh', k_checkboxCfg);
k_config.k_toolbar.k_addWidget(k_checkbox, k_config.k_index);
return k_checkbox;
},

k_onSetAutoRefreshInterval: function(k_interval) {
var
k_autoRefreshGui = this.k_autoRefreshGui;
k_autoRefreshGui.k_setValue(kerio.waw.shared.k_DEFINITIONS.k_AUTOREFRESH_DISABLED !== k_interval, true);
k_autoRefreshGui.k_ignoreOnChange = false;
},

k_isSwitchEmpty: function(k_data) {
var
k_methods = kerio.waw.shared.k_methods;
delete k_methods.k_isSwitchEmpty;
if (k_methods.k_isBoxEdition()) {
k_methods.k_isSwitchEmpty = function(k_data) {
return k_data.flags && k_data.flags.virtualSwitch && (!k_data.ports || 0 === k_data.ports.length);
};
}
else {
k_methods.k_isSwitchEmpty = function() {
return false;
};
}
return k_methods.k_isSwitchEmpty.call(this, k_data);
}, 
k_isInterfaceDead: function(k_data) {
if (k_data.ras && k_data.ras.dead) {
return true;
}
if (!k_data.enabled && kerio.waw.shared.k_CONSTANTS.InterfaceType.Ras !== k_data.type) { return true;
}
if (kerio.waw.shared.k_methods.k_isSwitchEmpty(k_data)) {
return true;
}
return false;
},
k_getTimeUnitsTableString: function() {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_TIME_UNITS_SETTINGS = kerio.waw.shared.k_CONSTANTS.k_TIME_UNITS_SETTINGS,
k_BITE_UNITS = k_CONSTANTS.k_BITE_UNITS,
kerio_web_SharedConstants = k_CONSTANTS.kerio_web_SharedConstants,
k_BYTE_UNITS_MAPPED = kerio.waw.shared.k_DEFINITIONS.k_BYTE_UNITS_MAPPED,
k_isMBps = k_TIME_UNITS_SETTINGS.k_BYTE_PER_SECOND ===kerio.waw.status.k_userSettings.k_get('timeUnits', k_TIME_UNITS_SETTINGS.k_BYTE_PER_SECOND);
return k_isMBps ? k_BYTE_UNITS_MAPPED[kerio_web_SharedConstants.kerio_web_KiloBytes] : k_BYTE_UNITS_MAPPED[k_BITE_UNITS.k_Kb];
},

k_formatDataUnits: function(k_config) {
var
k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_DATA_UNITS_ORDERED = k_DEFINITIONS.k_DATA_UNITS_ORDERED,
k_DATA_BITES_UNITS_ORDERED = k_DEFINITIONS.k_DATA_BITES_UNITS_ORDERED,
k_BYTE_UNITS_MAPPED = k_DEFINITIONS.k_BYTE_UNITS_MAPPED,
k_BYTE_TO_BITE_MAPPED = k_DEFINITIONS.k_BYTE_TO_BITE_MAPPED,
k_BITE_UNITS_STRING = k_DEFINITIONS.k_BITE_UNITS_STRING,
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
kerio_web_SharedConstants = k_CONSTANTS.kerio_web_SharedConstants,
k_TIME_UNITS_SETTINGS = k_CONSTANTS.k_TIME_UNITS_SETTINGS,
k_buildTooltip = kerio.lib.k_buildTooltip,
k_renderTooltip = false !== k_config.k_tooltip,
k_numberFormat = {},
k_isInTime = false,
k_outputUnits = false,
k_formatedValue,
k_unitIndex,
k_unitIndexMax,
k_value,
k_units,
k_string,
k_stringUnits,
k_tooltipString,
k_isInBites,
k_outputIsInBites;
if (!k_config) {
return;
}
k_value = k_config.k_value;
if (k_config.k_units) {
k_unitIndex = k_DATA_BITES_UNITS_ORDERED.indexOf(k_config.k_units);
k_isInBites = -1 !== k_unitIndex;
if (!k_isInBites) {
k_unitIndex = k_DATA_UNITS_ORDERED.indexOf(k_config.k_units);
}
} else {
k_unitIndex = 0;}
k_unitIndexMax = k_DATA_UNITS_ORDERED.length;
if (k_config.k_outputUnits) {
k_unitIndexMax = k_DATA_BITES_UNITS_ORDERED.indexOf(k_config.k_outputUnits);
k_outputIsInBites = -1 !== k_unitIndexMax;
if (!k_outputIsInBites) {
k_unitIndexMax = k_DATA_UNITS_ORDERED.indexOf(k_config.k_outputUnits);
}
k_outputUnits = true;
}
if (k_config.k_numberFormat) {
k_numberFormat = k_config.k_numberFormat;
}
if (k_config.k_isInTime) {
k_isInTime = k_config.k_isInTime;
}
if (k_outputUnits && k_unitIndex > k_unitIndexMax) {while (k_unitIndex > k_unitIndexMax)  {
k_value = k_value * 1024;
k_unitIndex -= 1;
}
} else if (k_value > 1 || k_outputUnits) {
while ((!k_outputUnits && k_value/1024 > 1 && (k_unitIndex < k_unitIndexMax - 1)) || (k_outputUnits && k_unitIndex < k_unitIndexMax))  {
k_value = k_value / 1024;
k_unitIndex += 1;
}
}
else {
while (k_value < 1 && k_unitIndex > 0) {
k_value = k_value * 1024;
k_unitIndex -= 1;
}
}
k_units = k_DATA_UNITS_ORDERED[k_unitIndex];
if (k_isInTime) {
if (k_TIME_UNITS_SETTINGS.k_BYTE_PER_SECOND === kerio.waw.status.k_userSettings.k_get('timeUnits', k_TIME_UNITS_SETTINGS.k_BYTE_PER_SECOND)) {
k_stringUnits = k_BYTE_UNITS_MAPPED[k_units];
}
else if (k_isInBites) {
k_units = k_DATA_BITES_UNITS_ORDERED[k_unitIndex];
k_stringUnits = k_BYTE_UNITS_MAPPED[k_units];
}
else {
k_value = k_value * 8;
if (!k_outputUnits && k_value/1024 > 1 && (k_unitIndex < k_unitIndexMax))  {
k_value = k_value/1024;
k_unitIndex += 1;
k_units = k_DATA_UNITS_ORDERED[k_unitIndex];
}
k_stringUnits = k_BYTE_UNITS_MAPPED[k_BYTE_TO_BITE_MAPPED[k_units]];
}
} else {
if (k_isInBites) {
k_units = k_DATA_BITES_UNITS_ORDERED[k_unitIndex];
k_stringUnits = k_BITE_UNITS_STRING[k_units];
}
else {
switch (k_units) {
case kerio_web_SharedConstants.kerio_web_Bytes:
k_stringUnits = 'B';
break;
case kerio_web_SharedConstants.kerio_web_KiloBytes:
k_stringUnits = 'KB';
break;
case kerio_web_SharedConstants.kerio_web_MegaBytes:
k_stringUnits = 'MB';
break;
case kerio_web_SharedConstants.kerio_web_GigaBytes:
k_stringUnits = 'GB';
break;
case kerio_web_SharedConstants.kerio_web_TeraBytes:
k_stringUnits = 'TB';
break;
case kerio_web_SharedConstants.kerio_web_PetaBytes:
k_stringUnits = 'PB';
break;
}
}
}
if (0 === k_unitIndex && ! k_isInTime) {
k_numberFormat = k_numberFormat || {};
k_numberFormat.k_decimalPlaces = 0;
}
k_formatedValue = kerio.waw.shared.k_methods.k_formatNumber(k_value, k_numberFormat);
k_string = k_formatedValue + ' ' + k_stringUnits;
if (k_renderTooltip) {
delete k_config.k_outputUnits;
if (k_config.k_numberFormat && undefined !== k_config.k_numberFormat.k_decimalPlaces) {
delete k_config.k_numberFormat.k_decimalPlaces;
}
k_config.k_tooltip = false;
k_tooltipString = kerio.waw.shared.k_methods.k_formatDataUnits(k_config).k_string;
}
return {
k_value: k_value,
k_units: k_units,
k_isInTime: k_isInTime,
k_numberFormat: k_numberFormat,
k_string: k_string,
k_formatedValue: k_formatedValue,
k_tooltipString: k_tooltipString,
k_unitString: k_stringUnits,
k_stringWithBuildInTooltip: ['<span ',k_buildTooltip(k_tooltipString),'>',k_string,'</span>'].join('')
};
},k_trafficChartRenderer: function (k_value, k_maxValue, k_unit) {
var
k_decimal = 0,
k_TIME_UNITS_SETTINGS = kerio.waw.shared.k_CONSTANTS.k_TIME_UNITS_SETTINGS,
k_units = kerio.waw.shared.k_DEFINITIONS.k_DATA_UNITS_ORDERED, k_unitIndex = k_units.indexOf(k_unit),
k_cnt;
if (-1 === k_unitIndex) {
k_units = kerio.waw.shared.k_DEFINITIONS.k_DATA_BITES_UNITS_ORDERED;
k_unitIndex = k_units.indexOf(k_unit);
}
else if (k_TIME_UNITS_SETTINGS.k_BITE_PER_SECOND === kerio.waw.status.k_userSettings.k_get('timeUnits', k_TIME_UNITS_SETTINGS.k_BYTE_PER_SECOND)) {
k_value *= 8;
k_maxValue *= 8;
k_units = kerio.waw.shared.k_DEFINITIONS.k_DATA_BITES_UNITS_ORDERED;
}
k_cnt = k_units.length - 1;
while (k_maxValue / 1024 >= 1 && k_unitIndex < k_cnt) {
k_maxValue /= 1024;
k_value /= 1024;
k_unitIndex += 1;
}
if (k_maxValue < 100 && k_maxValue % 4) {
if (k_value >= 1 || k_unitIndex === 0) {
k_decimal = 1;
}
else {
k_value = k_value * 1024;
k_unitIndex -= 1;
}
}
return {
k_data: kerio.waw.shared.k_methods.k_formatDataUnits({
k_value: k_value,
k_isInTime: true,
k_units: k_units[k_unitIndex],
k_outputUnits: k_units[k_unitIndex],
k_numberFormat: {
k_decimalPlaces: k_decimal
}
}).k_string
};
},

k_formatByteUnits: function(k_value, k_units, k_perSecond, k_config) {
var
k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_DATA_UNITS_ORDERED = k_DEFINITIONS.k_DATA_UNITS_ORDERED,
kerio_web_SharedConstants = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_unitIndex = k_DATA_UNITS_ORDERED.indexOf(k_units),
k_unitIndexMax = k_DATA_UNITS_ORDERED.length; while (k_value/1024 > 1 && k_unitIndex < k_unitIndexMax) {
k_value = k_value / 1024;
k_unitIndex += 1;
}
k_units = k_DATA_UNITS_ORDERED[k_unitIndex];
if (true === k_perSecond) {
k_units = k_DEFINITIONS.k_BYTE_UNITS_MAPPED[k_units];
}
else {
switch (k_units) {
case kerio_web_SharedConstants.kerio_web_Bytes:
k_units = 'B';
break;
case kerio_web_SharedConstants.kerio_web_KiloBytes:
k_units = 'kB';
break;
case kerio_web_SharedConstants.kerio_web_MegaBytes:
k_units = 'MB';
break;
case kerio_web_SharedConstants.kerio_web_GigaBytes:
k_units = 'GB';
break;
case kerio_web_SharedConstants.kerio_web_TeraBytes:
k_units = 'TB';
break;
case kerio_web_SharedConstants.kerio_web_PetaBytes:
k_units = 'PB';
break;
}
}
return kerio.waw.shared.k_methods.k_formatNumber(k_value, k_config) + ' ' + k_units;
}, 
k_gotoRegister: function(k_form, k_item, k_id) {
if ('k_gotoRegister' !== k_id) {
return;
}
if (kerio.waw.shared.k_methods.k_isAuditor()) {
kerio.lib.k_alert({
k_title: 'Kerio Control',
k_msg: kerio.lib.k_tr('Please ask your Kerio Control administrator to register the product for you.', 'common')
});
return;
}
kerio.waw.shared.k_methods.k_startRegistration({
k_callback: function() {
kerio.waw.requests.k_updateLicense();
}
});
},

k_logTrace: function(k_message) {
try {
if (!window.console || kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.finalVersion) {
return;
}
var
k_console = window.console,
k_list = Array.prototype.slice.call(arguments),
k_screenId = (kerio.waw.activation ? 'Activation' : kerio.lib.k_widgets.k_admMenuTree.k_getSelectedNode().k_id),
k_i, k_cnt, k_item;
k_console.group(k_message);
k_console.info('Current screen:', ('k_gen_0' === k_screenId) ? 'SplashScreen' : k_screenId);
for (k_i = 1, k_cnt = k_list.length; k_i < k_cnt; k_i++) {
k_item = k_list[k_i];
if (k_item && (k_item.k_id || k_item.id)) {
k_console.group(k_item.k_id || k_item.id);
k_console.debug(k_item);
k_console.groupEnd();
}
else {
k_console.debug(k_item);
}
}
k_console.trace();
k_console.groupEnd();
}
catch (e) {
if (window.console && window.console.log) {
window.console.log('Error in method ' + 'k_logTrace' + ' ignored: ' + e);
}
return; }
},

_k_logTime: function() {
try {
var
k_console = window.console,
k_screenId = (kerio.waw.activation ? 'Activation' : kerio.lib.k_widgets.k_admMenuTree.k_getSelectedNode().k_id),
k_i, k_cnt;
k_console.groupEnd();
k_console.group('Time: ' + new Date());
k_console.log('Current screen:', kerio.waw.shared.k_data._k_currentScreen ? kerio.waw.shared.k_data._k_currentScreen.k_id : k_screenId);
if (kerio.waw.shared.k_data._k_currentDialog) {
for (k_i = 0, k_cnt = kerio.waw.shared.k_data._k_currentDialog.length; k_i < k_cnt; k_i++) {
k_console.log('Opened dialog:', kerio.waw.shared.k_data._k_currentDialog[k_i].k_id);
} }
} catch (e) {
if (window.console && window.console.log) {
window.console.log('Error in method ' + 'k_logTime' + ' ignored: ' + e);
}
return; }
},

k_logTime: function(k_interval) {
try {
if (!window.console || kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.finalVersion) {
return;
}
var
k_console = window.console,
k_taskId = 'k_debugLogTime',
_k_logTime = kerio.waw.shared.k_methods._k_logTime;
kerio.waw.shared.k_tasks.k_remove(k_taskId, true);
if (undefined === k_interval) {
_k_logTime();
return;
}
if (false === k_interval) {
if (kerio.waw.shared.k_methods._k_logTimeOrigAbort) {
kerio.lib.k_ajax.k_abortAllPendingRequests = kerio.waw.shared.k_methods._k_logTimeOrigAbort;
kerio.waw.shared.k_data.k_cache = kerio.waw.shared.k_methods._k_logTimeOrigCache;
}
k_console.log('logTime finished (' + new Date() + ')');
k_console.groupEnd();
return;
}
kerio.waw.shared.k_tasks.k_add({
k_id: k_taskId,
k_interval: k_interval,
k_startNow: true,
k_run: _k_logTime
});
if (!kerio.waw.shared.k_methods._k_logTimeOrigAbort) {
kerio.waw.shared.k_methods._k_logTimeOrigAbort = kerio.lib.k_ajax.k_abortAllPendingRequests;
kerio.waw.shared.k_methods._k_logTimeOrigCache = kerio.waw.shared.k_data.k_cache;
}
kerio.lib.k_ajax.k_abortAllPendingRequests = kerio.waw.shared.k_methods._k_logTimeOrigAbort.createSequence(_k_logTime);
kerio.waw.shared.k_data.k_cache = kerio.waw.shared.k_methods._k_logTimeOrigCache.createSequence(_k_logTime);
k_console.group('logTime started');
}
catch (e) {
if (window.console && window.console.log) {
window.console.log('Error in method ' + 'k_logTrace' + ' ignored: ' + e);
}
return; }
},

k_processUserClick: function() {
if (kerio.adm.k_framework.k_leaveCurrentScreen()) {
kerio.adm.k_framework.k_enableApplyReset(false);
return false;
}
return true;
},k_isFiredByToolbar: function() {
var
k_framework = kerio.adm.k_framework,
k_applyResetToolbarItems = k_framework._k_lastWidget._k_applyResetToolbar.k_items,
k_applyButton = k_applyResetToolbarItems.k_btnApply,
k_resetButton = k_applyResetToolbarItems.k_btnReset;
if (k_applyButton.k_isFiredByEvent || k_resetButton.k_isFiredByEvent) {  return true;
}
return false;
},

k_multiEditorElement: function(k_config) {
var
k_tr = kerio.lib.k_tr,
k_unchanged = kerio.waw.shared.k_DEFINITIONS.k_unchangedText,
k_valueUnchanged = kerio.waw.shared.k_CONSTANTS.k_VALUE_UNCHANGED,
k_fieldValue = 'name',k_fieldDisplay = 'value',k_dataTemplate,
k_i,
k_type,
k_select,
k_display,
k_return;
if(Array === k_config.constructor) {
k_type = k_config[0].k_type;
} else {
k_type = k_config.k_type;
}
switch (k_type) {
case 'k_checkbox':
k_select = {
k_type: 'k_select',
k_value: k_valueUnchanged,
k_isLabelHidden: true,
k_localData: [
{value: k_valueUnchanged, name: k_unchanged},
{value: true, name: k_tr('Yes', 'common')},
{value: false, name: k_tr('No', 'common')}
]
};
k_display = {
k_type: 'k_display',
k_id: k_config.k_id + '_' + 'k_label',
k_width: k_config.k_width,
k_value: k_config.k_option,
k_isSecure: true};
delete k_config.k_option;
delete k_config.k_isChecked;
k_select = kerio.waw.shared.k_methods.k_mergeObjects(k_select, k_config);
k_return = {
k_type: 'k_columns',
k_isHidden: (k_config.k_isHidden ? true : false),
k_items: [
k_select,
k_display
]
};
break;
case 'k_radio':
for (k_i = 0; k_i < k_config.length; k_i++) {
k_config[k_i].k_isChecked = false;
}
k_config.unshift(
{
k_type: 'k_radio',
k_groupId: k_config[0].k_groupId,
k_option: k_unchanged,
k_value: k_valueUnchanged,
k_isChecked: true,
k_isLabelHidden: true
}
);
k_return = k_config;
break;
case 'k_select':
if (!k_config.k_localData) {
return k_config;
}
if (k_config.k_fieldValue && k_config.k_fieldDisplay) {
k_fieldValue = k_config.k_fieldValue;
k_fieldDisplay = k_config.k_fieldDisplay;
}
k_dataTemplate = {};
k_dataTemplate[k_fieldDisplay] = k_unchanged;
k_dataTemplate[k_fieldValue] = k_valueUnchanged;
k_config.k_value = k_valueUnchanged;
k_config.k_localData.unshift(k_dataTemplate);
k_return = k_config;
break;
case 'k_text':
k_select = {
k_type: 'k_select',
k_value: k_valueUnchanged,
k_isLabelHidden: true,
k_isEditable: true,
k_localData: [
{value: k_valueUnchanged, name: k_unchanged}
]
};
k_display = {
k_type: 'k_display',
k_value: k_config.k_caption,
k_isSecure: true};
k_select = kerio.waw.shared.k_methods.k_mergeObjects(k_select, k_config);
k_return = {
k_type: 'k_columns',
k_isHidden: (k_config.k_isHidden ? true : false),
k_items: [
k_display,
k_select
]
};
break;
default:
return k_config;
}
return k_return;
},
k_getBmInterfaceIcon: function(k_values) {
var
InterfaceType = kerio.waw.shared.k_CONSTANTS.InterfaceType,
k_className;
switch (k_values.type) {
case InterfaceType.Ras:
case InterfaceType.DialIn:
k_className = 'interfaceRas';
break;
default: if ('LanSwitch' === k_values.id) {
k_className = 'interfaceLanSwitch';
}
else {
k_className = 'interfaceEthernet';
}
}
if (!k_values.online) {
k_className += ' dead';
}
return k_className;
},
k_userEditorUseTemplate: function() {},
k_filterDomainList: function(k_domainList) {
if (kerio.waw.status.k_userList === undefined) {
kerio.waw.status.k_userList = kerio.waw.shared.k_DEFINITIONS.k_get('k_userListStatus');
}
var
k_i, k_cnt,
k_domainName,
k_domain,
k_domainId,
k_domains = [],
k_shared = kerio.waw.shared,
k_localDomainId = k_shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE,
k_storeStatusClean = k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusClean,
k_localDomainName = kerio.lib.k_tr('Local User Database', 'userList'),
k_userListStatus = kerio.waw.status.k_userList,k_return = {
k_list: [],
k_data: {},
k_primaryDomain: {},
k_templates: {},
k_isdomainDbDisabled: false
};
for (k_i = 0, k_cnt = k_domainList.length; k_i < k_cnt; k_i++) {
k_domain = k_domainList[k_i];
k_domainId = k_domain.id;
if (k_localDomainId === k_domainId) {
k_domainName = k_localDomainName;
} else {
k_domainName = k_domain.service.domainName;
}
if ('' === k_domainName) {
continue;
}
if (k_storeStatusClean !== k_domain.status) {
continue;
}
if (k_domain.primary) {
k_userListStatus.k_isAdAuthEnabled = k_domain.service.enabled;
k_userListStatus.k_isNtAuthEnabled = k_domain.ntAuthMode;
}
if (k_domain.primary) {
if (k_domain.authenticationOnly) {
continue;
}
if (!k_domain.service.enabled) {
k_return.k_isdomainDbDisabled = true;
}
k_return.k_primaryDomain = k_domain;
}
k_return.k_data[k_domain.id] = k_domain;
k_domains.push({
id: k_domainId,
name: k_domainName
});
k_return.k_templates[k_domain.id] = k_domain.templateData;
}
k_return.k_list = k_domains;
return k_return;
}, 
k_parseIp: function(k_ip) {
var k_result;
if (!kerio.waw.shared.k_methods.k_validators.k_isIpAddress(k_ip)) {
return []; }
k_result = k_ip.split('.');
return [
parseInt(k_result[0], 10),
parseInt(k_result[1], 10),
parseInt(k_result[2], 10),
parseInt(k_result[3], 10)
];
},

k_generateIpRange: function(k_ipFrom, k_config) {
var
k_ipParts = kerio.waw.shared.k_methods.k_parseIp(k_ipFrom),
k_ipTo,
k_field;
k_config = k_config || {};
if (4 !== k_ipParts.length || 0 === k_ipParts[0]) { return;
}
k_ipParts[3] = 254;
k_ipTo = k_ipParts.join('.'); if (!kerio.waw.shared.k_methods.k_validators.k_isIpRange(k_ipFrom, k_ipTo)) {
return; }
if (k_config.k_form) {
k_field = k_config.k_fieldId;
k_field = k_config.k_form.k_getItem(k_field);
}
else {
k_field = k_config.k_field;
}
if (k_field && k_field.k_setValue) {
if ((true === k_config.k_allowOverwrite) || (k_field.k_getValue && '' === k_field.k_getValue())) {
k_field.k_setValue(k_ipTo);
}
k_field.k_extWidget.selectText(); }
return k_ipTo;
}, 
k_generateMaskForIp: function(k_ip, k_config) {
var
k_defaultMasks = kerio.waw.shared.k_DEFINITIONS.k_defaultMasks, k_ipParts = kerio.waw.shared.k_methods.k_parseIp(k_ip),
k_mask, k_field;
k_config = k_config || {};
if (4 !== k_ipParts.length || 0 === k_ipParts[0]) { return;
}
k_ipParts.unshift(0); if (true === k_config.k_isRoute && 0 !== k_ipParts[4]) {
k_mask = k_defaultMasks[4]; }
else if (true === k_config.k_isNetwork || true === k_config.k_isRoute) {
if (0 !== k_ipParts[4]) {
return; }
if (192 === k_ipParts[1] && 168 === k_ipParts[2]) {
k_mask = k_defaultMasks[3];
}
else if (0 === k_ipParts[3]) {
if (0 !==k_ipParts[2]) {
k_mask = k_defaultMasks[2]; }
else {
k_mask = k_defaultMasks[1]; }
}
else {
k_mask = k_defaultMasks[3]; }
if (!kerio.waw.shared.k_methods.k_validateNetwork(k_ip, k_mask, false)) {
return;
}
}
else {
k_mask = k_defaultMasks[3]; switch (k_ipParts[1]) {
case 172:
if (16 <= k_ipParts[2] && 32 > k_ipParts[2]) {
k_mask = k_defaultMasks[2]; }
break;
case 10:
k_mask = k_defaultMasks[1]; break;
case 169:
if (254 === k_ipParts[2]) {
k_mask = k_defaultMasks[2]; }
break;
}
}
if (k_mask) {
if (k_config.k_form) {
k_field = k_config.k_maskFieldId;
k_field = k_config.k_form.k_getItem(k_field);
}
else {
k_field = k_config.k_maskField;
}
if (k_field && k_field.k_setValue) {
if ((true === k_config.k_allowOverwrite) || (k_field.k_getValue && '' === k_field.k_getValue())) {
k_field.k_setValue(k_mask);
k_field.k_extWidget.selectText(); }
}
}
return k_mask;
}, 
k_generateMaskForIpv6: function(k_ip, k_config) {
var
k_isValid = kerio.waw.shared.k_methods.k_validators.k_isIpv6Address(k_ip),
k_mask = 64, k_field;
k_config = k_config || {};
if (!k_isValid) { return;
}
if (k_mask) {
if (k_config.k_form) {
k_field = k_config.k_maskFieldId;
k_field = k_config.k_form.k_getItem(k_field);
}
else {
k_field = k_config.k_maskField;
}
if (k_field && k_field.k_setValue) {
if ((true === k_config.k_allowOverwrite) || (k_field.k_getValue && '' === k_field.k_getValue())) {
k_field.k_setValue(k_mask);
}
}
}
return k_mask;
}, 
k_convertCidrToMask: function(k_mask) {
var
k_placeholderMasks = kerio.waw.shared.k_DEFINITIONS.k_placeholderMasks,
k_cidrValuesMap = kerio.waw.shared.k_DEFINITIONS.k_cidrValuesMap,
k_cidrMaskRegExp = kerio.waw.shared.k_DEFINITIONS.k_cidrMaskRegExp,
k_position,
k_part,
k_result;
if (!k_cidrMaskRegExp.test(k_mask)) {
if (kerio.waw.shared.k_methods.k_validators.k_isIpMask(k_mask, true)) {
return k_mask;
}
return k_placeholderMasks[5]; }
if (0 === k_mask) {
return k_placeholderMasks[0]; }
k_position = Math.floor(k_mask / 8) + 1;       k_part = k_cidrValuesMap[k_mask % 8];   k_result = k_placeholderMasks[k_position];
k_result = k_result.replace('%1', k_part);
return k_result;
},

k_allowOnlyIpv4Chars: function(k_form, k_element, k_value) {
var
k_ipv4Conf = kerio.waw.shared.k_DEFINITIONS.k_ipv4;
return kerio.waw.shared.k_methods.k_replaceOnChangeCharacters(k_form, k_element, k_value, k_ipv4Conf.k_allowedSeparator, k_ipv4Conf.k_separator);
},

k_allowOnlyIpv6Chars: function(k_form, k_element, k_value) {
var
k_ipv6Conf = kerio.waw.shared.k_DEFINITIONS.k_ipv6;
return kerio.waw.shared.k_methods.k_replaceOnChangeCharacters(k_form, k_element, k_value, k_ipv6Conf.k_allowedSeparator, k_ipv6Conf.k_separator);
},

k_padIpv6AddressWithZeroes: function(k_ipv6Address) {
var
k_paddedParts = [],
k_parts,
k_i, k_cnt;
k_ipv6Address = kerio.waw.shared.k_methods.k_createIpv6AddressFullFormat(k_ipv6Address);
k_parts = k_ipv6Address.split(':');
for (k_i = 0, k_cnt = k_parts.length; k_i < k_cnt; k_i++) {
k_paddedParts.push(String.leftPad(k_parts[k_i], 4, '0'));
}
return k_paddedParts.join(':');
},

k_createIpv6AddressFullFormat: function(k_ipv6Address) {
var
k_indexDoubleColon,
k_parts,
k_prefixGroups,
k_suffixGroups,
k_i, k_cnt;
k_indexDoubleColon = k_ipv6Address.indexOf('::');
if (-1 === k_indexDoubleColon) {
return k_ipv6Address;
}
k_parts = k_ipv6Address.split('::');
if (0 === k_indexDoubleColon) {
k_prefixGroups = ['0'];
}
else {
k_prefixGroups = k_parts[0].split(':');
}
if ((k_ipv6Address.length - 2) === k_indexDoubleColon) {
k_suffixGroups = ['0'];
}
else {
k_suffixGroups = k_parts[1].split(':');
}
for (k_i = 0, k_cnt = 8 - k_prefixGroups.length - k_suffixGroups.length; k_i < k_cnt; k_i++) {
k_prefixGroups.push('0');
}
return k_prefixGroups.join(':') + ':' + k_suffixGroups.join(':');
},

k_replaceOnChangeCharacters: function(k_form, k_element, k_value, k_replace, k_replacement) {
if (kerio.lib.k_isIPad) {
return; }
var
k_newValue = k_value,
k_pos = this.k_getCaretPosition(k_element),
k_posStart = k_pos.k_start,
k_posEnd = k_pos.k_end,
k_i, k_cnt;
if (isNaN(k_posStart)) {
k_posStart = 0;
}
if (isNaN(k_posEnd)) {
k_posEnd = 0;
}
if (k_replace && k_replacement && k_element.k_getValue().length <= k_element._k_maxLength) {
if (k_replace instanceof Array && k_replacement instanceof Array){
for (k_i = 0, k_cnt = k_replace.length; k_i < k_cnt; k_i++) {
k_newValue = k_newValue.replace(k_replace[k_i], k_replacement[k_i]);
}
}
else {
k_newValue = k_value.replace(k_replace, k_replacement);
}
}
if (k_newValue !== k_value) {
k_element.k_setValue(k_newValue);
this.k_setCaretPosition(k_element, k_posStart);
}
},

k_getCaretPosition: function(k_element) {
if (!k_element.k_extWidget.rendered || !k_element.k_extWidget.hasFocus) {
return {k_start: 0, k_end: 0}; }
var
k_input = k_element.k_extWidget.el.dom,
k_start, k_end,
k_selection, k_storedSelection;
if (!k_input.value) {
return {k_start: 0, k_end: 0};
}
if (k_input.selectionStart || k_input.selectionEnd) {
k_start = k_input.selectionStart;
k_end = k_input.selectionEnd;
}
else if (document.selection) {                                           k_storedSelection = document.selection.createRange().getBookmark();  k_selection = k_input.createTextRange();                             k_selection.moveToBookmark(k_storedSelection);                       k_start = k_input.createTextRange();                                 k_start.collapse(true);                                              k_start.setEndPoint("EndToStart", k_selection);                      k_start = k_start.text.length;                                       k_end = k_start + k_selection.text.length;                           }
return {
k_start: k_start,
k_end: k_end
};
},

k_setCaretPosition: function(k_element, k_position) {
if (k_element._k_isExecutionDeferredAfterRender(arguments.callee, arguments) || !k_element.k_extWidget.hasFocus) { return;
}
var
k_input = k_element.k_extWidget.el.dom,
k_selection;
if (!k_input.value) {
return;
}
if (k_input.createTextRange) {
k_selection = k_input.createTextRange();
k_selection.collapse(true);
k_selection.moveEnd('character', k_position);
k_selection.moveStart('character', k_position);
k_selection.select();
}
else if (k_input.selectionStart) {
k_input.selectionStart = k_position;
k_input.selectionEnd = k_position;
}
},

k_updateDataStore: function(k_storeId, k_params) {
var
k_dataStore = kerio.waw.shared.k_data.k_getStore(k_storeId, k_params);
if (k_dataStore) {
k_dataStore.k_get(true);
}
}, 
k_getDefaultGroup: function(k_grid) {
var
k_defaultGroup = {},
k_data;
if (0 < k_grid.k_selectionStatus.k_selectedRowsCount) {
k_data = k_grid.k_selectionStatus.k_rows[0].k_data;
return {
id:   k_data.groupId,
name: k_data.groupName
};
}
return k_defaultGroup;
}, 
k_getGroupList: function(k_grid) {
var
k_isPagingUsed = (k_grid.k_getRowsCount(false) !== k_grid.k_getRowsCount(true)), k_groups = [],
k_data,
k_i, k_cnt, k_row;
if (k_isPagingUsed) {  return undefined;  }
k_data = k_grid.k_getData();
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_row = k_data[k_i];
if (k_groups[k_groups.length - 1] !== k_row.groupId) {
k_groups.push({
id: k_row.groupId,
name: k_row.groupName
});
}
} return k_groups;
},

k_getLanguageList: function(k_skLanguage, k_detectLanguage){
var
k_LANGUAGE_SETTINGS = kerio.waw.shared.k_CONSTANTS.k_LANGUAGE_SETTINGS,
k_allLanguages = kerio.lib.k_constants.k_languageList,
k_detectLang = kerio.waw.shared.k_CONSTANTS.k_LANGUAGES.k_DATA[0],
k_supportedLanguages = [],
k_i, k_cnt,
k_lang;
if (k_detectLanguage) {
k_supportedLanguages.push({
k_id: k_detectLang.k_value,
k_className: 'flag ' + k_detectLang.k_value,
k_caption: k_detectLang.k_name,
k_localizedCaption: k_detectLang.k_name,
k_name: k_detectLang.k_value
});
}
if (undefined === k_skLanguage) {
k_skLanguage = false;
k_supportedLanguages.push({k_id: 'sk', k_className: 'flag sk', k_caption: 'Slovenčina', k_localizedCaption: kerio.lib.k_tr('Slovak', 'wlibLanguages'), k_name: 'Slovak'});
}
for (k_i = 0, k_cnt = k_allLanguages.length; k_i < k_cnt; k_i++) {
k_lang = kerio.lib.k_cloneObject(k_allLanguages[k_i]);
if (k_LANGUAGE_SETTINGS.k_IS_BRITISH_PREFERRED && k_LANGUAGE_SETTINGS.k_LANGUAGE_ENGLISH === k_lang.k_id) {
k_lang.k_className += ' gb';
}
if (k_skLanguage && 'sk' < k_lang.k_id) {
k_supportedLanguages.push({k_id: 'sk', k_className: 'flag sk', k_caption: 'Slovenčina', k_localizedCaption: kerio.lib.k_tr('Slovak', 'wlibLanguages'), k_name: 'Slovak'});
k_skLanguage = false;
}
k_supportedLanguages.push(k_lang);
}
return k_supportedLanguages;
}, 
k_validateIpRange: function(k_form) {
var
k_shared = kerio.waw.shared,
k_validators = k_shared.k_methods.k_validators,
k_validationRangeMessage = k_shared.k_DEFINITIONS.k_IP_RANGE_ERROR,
k_rangeFrom = k_form.k_getItem('k_rangeFrom'),
k_rangeTo = k_form.k_getItem('k_rangeTo'),
k_isIpv4Address;
if (!k_validators.k_isIpv4Or6Address(k_rangeFrom.k_getValue()) || !k_validators.k_isIpv4Or6Address(k_rangeTo.k_getValue())) {
return;
}
k_isIpv4Address = k_validators.k_isIpAddress(k_rangeFrom.k_getValue());
if ((k_isIpv4Address !== k_validators.k_isIpAddress(k_rangeTo.k_getValue()))
|| (k_isIpv4Address && !k_validators.k_isIpRange(k_rangeFrom.k_getValue(), k_rangeTo.k_getValue()))
|| (!k_isIpv4Address && !k_validators.k_isIpv6Range(k_rangeFrom.k_getValue(), k_rangeTo.k_getValue()))) {
k_rangeFrom.k_markInvalid(true, k_validationRangeMessage);
k_rangeTo.k_markInvalid(true, k_validationRangeMessage);
return false;
}
k_rangeFrom.k_markInvalid(false);
k_rangeTo.k_markInvalid(false);
return true;
},

k_checkConnectivityToKb: function(k_helpAction, k_helpUrlQuery, k_directUrlToKb) {
var
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_closureImg,
k_timestamp,
k_joint,
k_imgPath;
if (!k_WAW_DEFINITIONS.k_KB_CONNECTIVITY_IMAGE) {
k_closureImg = new Image();
k_closureImg.onload = function() {
this.k_showKbWindow(true);
};
k_closureImg.onerror = function() {
this.k_showKbWindow(false);
};

k_closureImg.k_showKbWindow = function(k_online) {
var
k_KB_STATUS = kerio.waw.shared.k_DEFINITIONS.k_KB_STATUS,
k_helpAction = this.k_helpAction;
window.clearTimeout(this.loadTimer);
k_KB_STATUS.k_status = k_online ? k_KB_STATUS.k_AVAIABLE : k_KB_STATUS.k_OFFLINE;
if (k_helpAction) {
kerio.adm.k_framework._k_showWindow(k_helpAction.k_url, this.k_helpUrlQuery, this.k_directUrlToKb);
}
kerio.waw.requests.fireEvent('afterConnectivityChecked', k_online);
};
k_WAW_DEFINITIONS.k_KB_CONNECTIVITY_IMAGE = k_closureImg;
}
else {
k_closureImg = k_WAW_DEFINITIONS.k_KB_CONNECTIVITY_IMAGE;
}
k_closureImg.k_helpAction = k_helpAction || false;
k_closureImg.k_helpUrlQuery = k_helpUrlQuery;
k_closureImg.k_directUrlToKb = k_directUrlToKb || undefined;
k_closureImg.loadTimer = setTimeout(function() {
k_closureImg.k_showKbWindow(false);
k_closureImg.src = '';
},10000);
k_imgPath = kerio.waw.shared.k_DEFINITIONS.k_KB_STATUS.k_IMG;
k_timestamp = 't=' + (new Date()).getTime();
k_joint = -1 === k_imgPath.indexOf('?') ? '?' : '&';
k_closureImg.src = [window.location.protocol, '//',  k_imgPath, k_joint, k_timestamp].join('');
},

k_openSpecificKbArticle: function(k_articleId) {
var
k_directUrlToKb;
k_directUrlToKb = kerio.adm.k_getKbLinkUrl(k_articleId);
this._k_helpUrlQuery = 'defaultPage'; kerio.waw.shared.k_methods.k_checkConnectivityToKb(kerio.adm.k_framework._k_helpActions[0], this._k_helpUrlQuery, k_directUrlToKb);
},

k_getDisplayFieldWithKbLink: function (k_articleId, k_linkText, k_config) {
var
k_cfgDisplay;
k_config = k_config || {};
k_linkText = undefined === k_linkText ? kerio.lib.k_tr('Learn more…', 'common') : k_linkText;
k_cfgDisplay = kerio.waw.shared.k_methods.k_mergeObjects(
k_config,
{
k_type: 'k_display',
k_template: ' <a id="{k_articleId}">{k_linkText}</a>',
k_forceWritable: true,
k_value: {
k_articleId: k_articleId,
k_linkText: k_linkText
},
k_isSecure: true,
k_onLinkClick: function(k_form, k_item, k_id) {
kerio.waw.shared.k_methods.k_openSpecificKbArticle(k_id);
}
}
);
return k_cfgDisplay;
},

k_responseIsOk: function(k_response) {
var
k_responseBody,
k_batchItems,
k_i, k_cnt;
if (false === k_response.k_isOk) {
return false;
}
k_responseBody = k_response;
k_batchItems = k_response;
if (k_response.k_decoded) {
k_responseBody = k_response.k_decoded;
k_batchItems = k_response.k_decoded.batchResult;
}
if (k_batchItems && Array === k_batchItems.constructor) {
k_cnt = k_batchItems.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_batchItems[k_i].errors && k_batchItems[k_i].errors.length) {
return false;
}
}
} else if (k_responseBody.errors && k_responseBody.errors.length) {
return false;
}
return true;
}, 
_k_sortBy: function(k_itemA, k_itemB) {
var
k_i, k_cnt,
k_result,
k_getValue = kerio.lib._k_getPointerToObject;
if (undefined === k_itemA || null === k_itemA) {
return 1; }
if ('object' === typeof k_itemA && 'object' === typeof k_itemB) {
if (this.k_sortBy && Array === this.k_sortBy.constructor) {
for (k_i = 0, k_cnt = this.k_sortBy.length; k_i < k_cnt; k_i++) {
k_result = this.k_fn.call({k_sortBy: this.k_sortBy[k_i], k_fn: this.k_fn}, k_itemA, k_itemB);
if (0 !== k_result) {
return k_result;
} } }
else if ('string' === typeof this.k_sortBy) {
k_itemA = k_getValue.call(k_itemA, this.k_sortBy, 'this');
k_itemB = k_getValue.call(k_itemB, this.k_sortBy, 'this');
return this.k_fn.call({}, k_itemA, k_itemB); }
return 0; }
if ('object' === typeof k_itemA) { return 1; }
if ('object' === typeof k_itemB) { return -1; }
return k_itemA.toString().localeCompare(k_itemB.toString());
},

k_sort: function(k_list, k_sortBy) {
if (!k_list || Array !== k_list.constructor) {
return k_list; }
var
k_params = {},
k_fn = kerio.waw.shared.k_methods._k_sortBy,
k_fnParams = k_fn.createDelegate(k_params, [], true);
k_params.k_sortBy = k_sortBy;
k_params.k_fn = k_fn;
k_list.sort(k_fnParams);
return k_list;
},

k_apply: function(k_manager, k_screen, k_dataStores) {
kerio.waw.requests.k_sendBatch({
k_jsonRpc: {
method: k_manager + '.apply'
},
k_callbackParams: {
k_screen: k_screen,
k_dataStores: k_dataStores
},
k_callback: function(k_response, k_success, k_params) {
var
k_dataStores = k_params.k_dataStores || [],
k_cnt, k_i;
for (k_i = 0, k_cnt = k_dataStores.length; k_i < k_cnt; k_i++) {
kerio.waw.shared.k_data.k_get(k_dataStores[k_i], true); }
kerio.adm.k_framework.k_enableApplyReset(false);
if (kerio.waw.shared.k_methods.k_processUserClick()) {
if (k_params.k_screen && k_params.k_screen.k_applyParams) {
k_params.k_screen.k_applyParams();
}
}
}
});
},

k_reset: function(k_manager, k_screen) {
kerio.waw.requests.k_sendBatch({
k_jsonRpc: {
method: k_manager + '.reset'
},
k_callbackParams: {
k_screen: k_screen
},
k_callback: function(k_response, k_success, k_params) {
kerio.adm.k_framework.k_enableApplyReset(false);
if (kerio.waw.shared.k_methods.k_processUserClick()) {
if (k_params.k_screen && k_params.k_screen.k_applyParams) {
k_params.k_screen.k_applyParams();
}
}
}
});
},

k_charts: {

k_getMaxY: function(k_dataMax){
var
k_maxList = kerio.waw.shared.k_DEFINITIONS.k_CHART_MAX_VALUES, k_cnt = k_maxList.length,
k_i;
if (k_dataMax instanceof Array) {
k_dataMax = Math.max.apply(Math, k_dataMax); }
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_dataMax <= k_maxList[k_i]) {
return k_maxList[k_i]; }
} return k_dataMax; } }, 
k_updateClientServerTimeOffset: function(k_serverDateTime, k_success) {
var
k_clientServerOffset = 0,
k_clientDateTime,
k_serverDate,
k_serverTime;
if (k_success) {
k_clientDateTime = new Date();
k_serverDate = k_serverDateTime.date;
k_serverTime = k_serverDateTime.time;
k_serverDateTime = new Date(k_serverDate.year, k_serverDate.month, k_serverDate.day, k_serverTime.hour, k_serverTime.min, k_serverTime.sec);
k_clientServerOffset = Math.round((k_clientDateTime - k_serverDateTime) / 1000);
}
kerio.waw.shared.k_CONSTANTS.k_CLIENT_SERVER_OFFSET_SECONDS = k_clientServerOffset;
},

k_initPasswordField: function(k_passwordField) {
k_passwordField.k_setEmptyText('NoPassword');
k_passwordField.k_setAllowBlank(true);
k_passwordField.k_markInvalid(false);
},

k_getDomainIdByName: function(k_domainName) {
var
k_domainsDataStore = kerio.waw.shared.k_data.k_getStore('k_domains'),
k_domainsList,
k_item,
k_cnt, k_i;
if (k_domainsDataStore) {
k_domainsList = k_domainsDataStore.k_domains.k_list;
for (k_i = 0, k_cnt = k_domainsList.length; k_i < k_cnt; k_i++) {
k_item = k_domainsList[k_i];
if (k_item.name === k_domainName) {
return k_item.id;
}
}
}
return -1;
},

k_goToUsers: function(k_domainName, k_userId) {
var
k_domainsDataStore = kerio.waw.shared.k_data.k_getStore('k_domains'),
k_localDomainId = kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE,
k_userList = kerio.waw.status.k_userList,
k_currentDomainId = k_localDomainId;
k_userList.k_isCurrentDomainLocal = true;
if ('' !== k_domainName) {
k_currentDomainId = kerio.waw.shared.k_methods.k_getDomainIdByName(k_domainName);
if (-1 === k_currentDomainId) {
k_currentDomainId = k_localDomainId;
}
else {
k_userList.k_isCurrentDomainLocal = false;
}
}
k_userList.k_currentDomainId = k_currentDomainId;
k_domainsDataStore.k_setCurrentKey(k_currentDomainId);
kerio.waw.status.k_currentScreen.k_switchPage('users', {
k_userId: k_userId
});
},

k_definitionApplyResetHandler: function(k_toolbar, k_button) {
var
k_dialog = k_toolbar.k_getMainWidget(),
k_requestParams = kerio.waw.shared.k_DEFINITIONS.k_DEFINITON_APPLY_RESET_REQUEST,
k_manager = k_dialog.k_manager,
k_isApplyCalled = 'k_btnOk' === k_button.k_name,
k_method = k_isApplyCalled ? 'apply' : 'reset';
if (!k_isApplyCalled) {
k_dialog.k_isDialogCanceled = true;
}
k_requestParams.k_jsonRpc.method = k_manager + '.' + k_method;
k_requestParams.k_scope = k_dialog;
kerio.waw.requests.k_send(k_requestParams);
},

k_definitionApplyResetCallback: function(k_response) {
if (k_response.k_isOk) {
kerio.waw.shared.k_data.k_get(this.k_manager).k_get(true);
this.k_hide();
}
else {
this.k_grid.k_reloadData();
}
},

k_createRuleDataStore: function(k_params) {
var
k_emptyFunction = kerio.waw.shared.k_methods.k_emptyFunction,
k_datastore = {};
k_datastore.k_setItemSorting = k_params.k_setItemSorting;
k_datastore.k_sortItems = k_params.k_sortItems;
k_datastore.k_grid = k_params.k_grid;
k_datastore.k_typeInvalid = k_params.k_typeInvalid;

k_datastore.k_add = function(k_item) {
var
k_invalidData = this.k_groups[this.k_typeInvalid];
if (k_invalidData && k_invalidData.k_data && 0 < k_invalidData.k_data.length) {
k_invalidData.k_data = [];
}
this.k_groups[k_item.type].k_add(this.k_setItemSorting(k_item, true)); };

k_datastore.k_fillData = function(k_items) {
var
k_groups = this.k_groups,
k_group,
k_i, k_cnt;
for (k_group in k_groups) {
k_groups[k_group].k_data = [];
}
for (k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_groups[k_items[k_i].type].k_data.push(k_items[k_i]);
}
};

k_datastore.k_sortFactory = function(k_customSort) {
var
k_closureSort = this.k_sortItems,
k_closureCustomSort = k_customSort;
return function(k_first, k_second) {
var k_order = k_closureSort(k_first, k_second);
if (0 === k_order) {
k_order = k_closureCustomSort(k_first, k_second);
}
return k_order;
};
};

k_datastore.k_getData = function(k_sort) {
var
k_groups = this.k_groups,
k_data = [],
k_groupData,
k_group;
k_sort = true === k_sort;
for (k_group in k_groups) {
k_groupData = k_groups[k_group];
if (k_groupData.k_data.length !== 0) {
if (k_sort) {
k_data = k_data.concat(k_groupData.k_data.sort(this.k_sortFactory(k_groupData.k_sort)));
} else {
k_data = k_data.concat(k_groupData.k_data);
}
}
}
return k_data;
};

k_datastore.k_getRowToSelect = function(k_dataRowToSelect) {
var
k_groups = this.k_groups,
k_isItemFound = false,
k_dataRowGroupType,
k_groupData,
k_groupType,
k_group,
k_index,
k_i, k_cnt;
if (!k_dataRowToSelect || this.k_typeInvalid === k_dataRowToSelect.type) {
return -1;
}
k_dataRowGroupType = k_dataRowToSelect.type;
k_index = 0;
for (k_groupType in k_groups) {
if (this.k_typeInvalid === k_groupType) {
continue;
}
if (k_dataRowGroupType === k_groupType) {
break;
}
k_group = k_groups[k_groupType];
k_index += k_group.k_data.length;
}
k_group = k_groups[k_dataRowGroupType];
k_groupData = k_group.k_data;
for (k_i = 0, k_cnt = k_groupData.length; k_i < k_cnt; k_i++) {
if (k_group.k_compare(k_groupData[k_i], k_dataRowToSelect)) {
k_isItemFound = true;
break;
}
k_index++;
}
if (k_isItemFound) {
return k_index;
}
return -1;
};
k_datastore.k_groups = {};
k_datastore.k_groups[k_datastore.k_typeInvalid] = {
k_add: k_emptyFunction,
k_data: [],
k_sort: k_emptyFunction
};
k_datastore.k_setGrid = function(k_grid) {
this.k_grid = k_grid;
};
return k_datastore;
}, 
k_onClickRemoveRuleDataStore: function(k_rowsIndexes) {
var
k_grid = this.k_relatedWidget;
if (k_rowsIndexes) {
k_grid.k_removeRowByIndex(k_rowsIndexes);
}
else {
k_grid.k_removeSelectedRows();
}
k_grid.k_datastore.k_fillData(k_grid.k_getData());
},

k_fillDataFromRuleDataStore: function(k_data, k_clearStore) {
var
k_datastore = this.k_datastore,
k_groups = k_datastore.k_groups,
k_group,
k_i, k_cnt,
k_dataRowToSelect,
k_index;
if (true === k_clearStore) {
for (k_group in k_groups) {
k_groups[k_group].k_data = [];
}
}
if (!Ext.isArray(k_data)) {
k_data = [k_data];
}
k_cnt = k_data.length;
if (!k_clearStore && 0 < k_cnt) {
k_dataRowToSelect = k_data[0];
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_datastore.k_add(k_data[k_i]);
}
this.k_setData(k_datastore.k_getData(true));
k_index = k_datastore.k_getRowToSelect(k_dataRowToSelect);
if (-1 !== k_index) {
this.k_selectRows(k_index);
}
},

k_onBeforeFilterForMacAddresses: function(k_filters, k_currentFilter) {
var
k_searchString = this.k_search.k_getValue(),
k_shared = kerio.waw.shared,
k_macDelimeterRegExp = k_shared.k_DEFINITIONS.k_macDelimeterRegExp,
k_filterCondition = k_currentFilter.query.conditions,
k_macFilterCondition = this.k_relatedWidget.k_macFilterCondition,
k_macFilterValue,
k_filterConditionFieldName,
k_i;
if (undefined === k_macFilterCondition) {
kerio.lib.k_reportError('Internal Error: A grid which used k_onBeforeFilterForMacAddresses has to have reference for k_macFilterCondition.', 'sharedMethods.js');
}
if (k_filterCondition && k_searchString) {
k_macFilterValue = k_searchString.replace(k_macDelimeterRegExp, '');
if ('activeHostsList_grid' === this.k_relatedWidget.k_id) {
k_macFilterValue = k_shared.k_methods.k_addMacAddressDelimiters(k_macFilterValue);
}
if ('userList' === this.k_relatedWidget.k_id) {
k_currentFilter.query.combining =  k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Or;
}
k_macFilterCondition.value = k_macFilterValue;
k_filterCondition.push(k_macFilterCondition);
}
if ('userList' === this.k_relatedWidget.k_id) {
this.k_checkbox.k_extWidget.el.dom.parentElement.style.visibility = '' === k_searchString ? '' : 'hidden';
if (k_searchString) {
for (k_i = k_filterCondition.length - 1; k_i >= 0; k_i--) {
k_filterConditionFieldName = k_filterCondition[k_i].fieldName;
if (k_filterConditionFieldName === 'localEnabled' || k_filterConditionFieldName === 'adEnabled') {
k_filterCondition.splice(k_i, 1);
}
}
}
}
},

k_onUserWarningError: function(k_response) {
if (!k_response.k_isOk) {
return false;
}
var
k_MAX_WARNINGS = 3,
k_errors = k_response.k_decoded.result.errors,
k_translateErrorMessage = kerio.waw.shared.k_methods.k_translateErrorMessage,
k_tr = kerio.lib.k_tr,
k_errorMessage = '',
k_warningsCnt = k_errors.length,
k_cnt,k_i,
k_rest;
k_cnt = 1 === k_warningsCnt - k_MAX_WARNINGS ? k_warningsCnt : Math.min(k_warningsCnt, k_MAX_WARNINGS); for (k_i = 0; k_i < k_cnt; k_i++) {
k_errorMessage += k_translateErrorMessage(k_errors[k_i]) + '<br />'; }
k_rest = k_errors.length - k_cnt;
if (1 <= k_rest){
k_errorMessage += k_tr('…and %1 more conflicts.', 'userEditor', {k_args:[k_rest]});
}
if (k_errorMessage) {
kerio.lib.k_confirm({
k_title: k_tr('Some user accounts are in conflict', 'userGroupList'),
k_msg: k_errorMessage + '<br /><br /><b>' + k_tr('[This|These] conflicting [setting|settings] will be set for this user.', 'userEditor', {k_pluralityBy: k_cnt}) + ' ' + k_tr('Do you want to continue?', 'common') + '</b>',
k_icon: 'warning',

k_callback: function(k_response) {
if ('yes' === k_response) {
this.k_isWarningCheckNeed = false;
this.k_onWarningErrorCallback();
}
else {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
}
},
k_scope: this
});
}
return true;
},

k_parseUserReferenceListToNames: function(k_list) {
var
k_names = [],
k_item,
k_cnt, k_i;
k_list = k_list || [];
k_cnt = k_list.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_list[k_i];
if ('' !== k_item.domainName) {
k_names.push(k_item.name + '@' + k_item.domainName);
}
else if (k_item.name) {
k_names.push(k_item.name);
}
else {
k_names.push('{' + k_item.id + '}');
}
}
return k_names.join(', ');
},

k_prepareListValue: function(k_optionalIdReference) {
var
k_enabled = k_optionalIdReference.enabled,
k_value   = k_optionalIdReference.value; if (!k_enabled) {
k_value = {
k_id: kerio.waw.shared.k_DEFINITIONS.k_NONE
};
}
return k_value;
},
k_getWebFilterCategoryById: function(k_id) {
var
k_categories = kerio.waw.shared.k_CONSTANTS.k_WEB_FILTER_CATEGORIES,
k_cnt = k_categories.length,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_categories[k_i].id === k_id) {
return k_categories[k_i];
}
}
return undefined;
},
k_getSubGroupItems: function(k_subGroup) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_APPLICATIONS = k_CONSTANTS.k_contentFilterApplications,
k_CONTENT_APPLICATION_SUBGROUPS  = k_CONSTANTS.k_CONTENT_APPLICATION_SUBGROUPS,
k_subGroupItemsCnt = k_CONTENT_APPLICATION_SUBGROUPS[k_subGroup],
k_items = [],
k_cnt = k_APPLICATIONS.length,
k_itemsLength = 0,
k_i;
if (!k_CONTENT_APPLICATION_SUBGROUPS[k_subGroup]) {
kerio.lib.k_reportError('Internal error: There is no subgroup ' + k_subGroup, 'sharedMethods', 'k_getSubGroupItems');
return [];
}
k_subGroupItemsCnt = k_CONTENT_APPLICATION_SUBGROUPS[k_subGroup];
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_APPLICATIONS[k_i].subGroup === k_subGroup) {
k_items.push(k_APPLICATIONS[k_i]);
k_itemsLength++;
if (k_subGroupItemsCnt === k_itemsLength) {
return k_items;
}
}
}
return k_items;
},
k_sortSubGroups: function(k_first, k_second) {
var
k_firstName = k_first.k_isWholeSubGroup ? k_first.subGroup : k_first.name,
k_secondName = k_second.k_isWholeSubGroup ? k_second.subGroup : k_second.name;
return k_firstName.localeCompare(k_secondName);
},

k_filterApplications: function(k_data) {
var
k_CONTENT_APPLICATION_SUBGROUPS = kerio.waw.shared.k_CONSTANTS.k_CONTENT_APPLICATION_SUBGROUPS,
k_subGroups = [],
k_subGroupsCnt = [],
k_cnt,
k_i,
k_j,
k_subGroupRollBack,
k_itemSubGroup;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_itemSubGroup = k_data[k_i].subGroup;
if (k_itemSubGroup) {
if (-1 === k_subGroups.indexOf(k_itemSubGroup)) {
k_subGroups.push(k_itemSubGroup);
k_subGroupsCnt[k_itemSubGroup] = 1;
}
else {
k_subGroupsCnt[k_itemSubGroup]++;
}
}
}
for (k_i = 0, k_cnt = k_subGroups.length; k_i < k_cnt; k_i++) {
if (k_subGroupsCnt[k_subGroups[k_i]] === k_CONTENT_APPLICATION_SUBGROUPS[k_subGroups[k_i]]) {
for (k_j = k_data.length - 1; k_j >= 0; k_j--) {
k_itemSubGroup = k_data[k_j].subGroup;
if (k_itemSubGroup === k_subGroups[k_i]) {
if (k_itemSubGroup !== k_subGroupRollBack) {
k_subGroupRollBack = k_itemSubGroup;
k_data[k_j].k_isWholeSubGroup = true;
}
else {
k_data.splice(k_j, 1);
}
}
}
}
}
k_data.sort(kerio.waw.shared.k_methods.k_sortSubGroups);
return k_data;
},
k_reportInactiveWebFilter: function(k_data) {
var
k_ENTITY_APPLICATION = kerio.waw.shared.k_CONSTANTS.ContentConditionEntityType.ContentConditionEntityApplication,
k_APP_TYPE = kerio.waw.shared.k_CONSTANTS.ApplicationType,
k_isContentFilter = k_data.contentCondition || false,
k_entities,
k_subItems,
k_applications,
k_item,
k_cnt,
k_i,
k_j, k_cnt2;
if (k_isContentFilter) {
k_ENTITY_APPLICATION = kerio.waw.shared.k_CONSTANTS.ContentConditionEntityType.ContentConditionEntityApplication;
k_entities = k_data.contentCondition.entities;
}
else {
k_ENTITY_APPLICATION = kerio.waw.shared.k_CONSTANTS.BMConditionType.BMConditionApplication;
k_entities = k_data.traffic;
}
k_cnt = k_entities.length;
if (0 === k_cnt) {
return false;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_ENTITY_APPLICATION !== k_entities[k_i].type) {
return false;
}
}
if (!this.k_isWebFilterLicensed) {
return true;
}
if (k_isContentFilter) {
k_applications = k_data.contentConditionList;
}
else {
k_applications = k_data.traffic;
}
for (k_i = 0, k_cnt = k_applications.length; k_i < k_cnt; k_i++) {
k_item = k_applications[k_i];
if (k_item.k_isWholeSubGroup) {
k_subItems = kerio.waw.shared.k_methods.k_getSubGroupItems(k_item.subGroup);
for (k_j = 0, k_cnt2 = k_subItems.length; k_j < k_cnt2; k_j++) {
if (k_APP_TYPE.ApplicationWebFilterCategory === k_subItems[k_j].types[0] && this.k_isWebFilterOn) {
return false;
}
if (k_APP_TYPE.ApplicationProtocol === k_subItems[k_j].types[0] && this.k_isApplicationAwarenessOn) {
return false;
}
}
}
else {
if (k_APP_TYPE.ApplicationWebFilterCategory === k_item.types[0] && this.k_isWebFilterOn) {
return false;
}
if (k_APP_TYPE.ApplicationProtocol === k_item.types[0] && this.k_isApplicationAwarenessOn) {
return false;
}
}
}
return true;
}
}; kerio.waw.shared.k_methods.k_allowOnlyIpv4Or6Chars = kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars;
