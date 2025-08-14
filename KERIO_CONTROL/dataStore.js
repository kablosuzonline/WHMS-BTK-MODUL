
kerio.waw.shared = kerio.waw.shared || {};
kerio.waw.shared.k_data = {

k_get: function(k_storeId, k_forceReload, k_params) {
var
k_dataStore,
k_storeCfg,
k_isMappedData = false,
k_currentStoreId,
k_storedRequestConfig;
k_forceReload = (undefined === k_forceReload) ? false : k_forceReload;
k_storeId = this._k_checkStoreId(k_storeId);
k_currentStoreId = k_storeId;
if (k_params && k_params.k_domainId && kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE !== k_params.k_domainId) {
k_currentStoreId = k_storeId + '_' + k_params.k_domainId;
k_isMappedData = true;
}
if (!this._k_stores[k_currentStoreId]) {
k_storeCfg = this._k_getStoresCfg(k_storeId);
if (k_isMappedData) {
k_storeCfg.k_remoteData.k_jsonRpc.params.domainId = k_params.k_domainId;
}
k_dataStore = new kerio.lib.K_DataStoreShared(k_storeCfg);
k_storedRequestConfig = k_storeCfg.k_remoteData;
if (null === k_storedRequestConfig.k_jsonRpc.params.query) {
k_storedRequestConfig.k_jsonRpc.params = {};
}
if (k_storeCfg.k_onLoad) {
k_dataStore.k_onLoad = k_storeCfg.k_onLoad;
}
k_storedRequestConfig.k_callback = this._k_reloadDataCallback;
k_storedRequestConfig.k_scope = this;
k_storedRequestConfig.k_requestOwner = null;
k_storedRequestConfig.k_mask = false;
k_storedRequestConfig.k_callbackParams = {
k_root: k_storeCfg.k_remoteData.k_root,
k_storeId: k_currentStoreId
};
k_dataStore.k_addReferences({
_k_storedRequestConfig: k_storedRequestConfig,
k_id: k_currentStoreId,
k_get: this._k_storeGet
});
this._k_stores[k_currentStoreId] = k_dataStore;
k_forceReload = true;
}
k_dataStore =this._k_stores[k_currentStoreId];
if (k_forceReload) {
this._k_reloadData(k_currentStoreId);
}
return k_dataStore;
},
_k_storeGet: function(k_forceReload, k_params) {
kerio.waw.shared.k_data.k_get(this.k_id, k_forceReload, k_params);
},

_k_checkStoreId: function(k_id) {
switch (k_id) {
case 'k_selectInterfaceEntity':case 'k_interfacesOutgoingList':
k_id = 'k_outgoingInterfaces';
break;
case 'k_interfacesEthernetList':
k_id = 'k_ethernetInterfaces';
break;
case 'k_interfacesEthernetRasList':
k_id = 'k_ethernetAndRasInterfaces';
break;
case 'k_selectUsers':
k_id = 'k_users';
break;
case 'k_selectGroups':
k_id = 'k_groups';
break;
case 'selectServices':
case 'IpServices':
case 'k_servicesSelectedByCheckbox':
k_id = 'k_services';
break;
case 'k_selectTrafficRule':
k_id = 'k_trafficRules';
break;
case 'k_selectHttpRule':
k_id = 'k_httpRules';
break;
case 'k_selectFtpRule':
k_id = 'k_ftpRules';
break;
case 'k_selectContentRule':
k_id = 'k_contentRules';
break;
case 'k_selectVpnEntity':
k_id = 'k_vpnTunnels';
break;
case 'k_ipAddressGroupList':case 'k_selectIpGroups':
case 'IpAddressGroups':
k_id = 'k_ipAddressGroups';
break;
case 'k_timeRangeList':
case 'TimeRanges':
k_id = 'k_timeRanges';
break;
case 'k_urlGroupList':
case 'UrlGroups':
case 'k_selectUrlGroups':
k_id = 'k_urlGroups';
break;
case 'k_certificates':
case 'k_certificatesVpnServer':
case 'k_ipsecTunnelCertificates':
case 'Certificates':
case 'k_certificatesReverseProxyRule':
case 'k_certificatesReverseProxy':
k_id = 'k_certificates';
break;
case 'k_selectApplication':
k_id = 'k_applications';
break;
case 'k_selectFileType':
case 'k_fileTypeList':
k_id = 'k_fileTypes';
break;
}
return k_id;
},
_k_reloadData: function(k_storeId) {
var
k_dataStore = this.k_getStore(k_storeId);
if (!k_dataStore) {
return;
}
k_dataStore._k_isLoaded = false;
kerio.waw.requests.k_send(k_dataStore._k_storedRequestConfig);
},
_k_reloadDataCallback: function(k_response, k_success, k_params) {
var
k_dataStore = this.k_getStore(k_params.k_storeId),
k_data = k_response.k_decoded[k_params.k_root];
k_dataStore._k_isLoaded = true;
if (!k_success) {
k_dataStore.k_clearData();
return;
}
if (k_dataStore.k_onLoad) {
k_dataStore.k_onLoad({}, {}, k_response.k_decoded);
} else {
k_dataStore.k_setData(k_data);
}
kerio.waw.requests._k_resumeCaching();
},
k_registerObserver: function(k_dataStore, k_callback, k_scope) {
if ('string' === typeof k_dataStore) {
k_dataStore = this.k_getStore(k_dataStore);
}
if (!k_dataStore) {
return;
}
if (!k_callback) {
kerio.lib.k_reportError('Internal error: observer registered without callback', 'kerio.waw.shared.k_data', 'k_registerObserver');
}
if (!k_scope) {
k_scope = this;
}
k_dataStore.k_extWidget.on('wawDataComplete', k_callback, k_scope, {buffer: 100});k_dataStore.k_extWidget.on('add', this._k_onCompleteHandler);
k_dataStore.k_extWidget.on('clear', this._k_onCompleteHandler);
},
_k_onCompleteHandler: function(k_store) {
k_store.fireEvent('wawDataComplete');
},
_k_getStoresCfg: function(k_storeId) {
var
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_storeCfg = {},
k_method;
switch (k_storeId) {
case 'k_users':
k_storeCfg = {
k_record: [
{k_columnId: 'id', k_isPrimaryKey: true},
{k_columnId: 'credentials'},
{k_columnId: 'fullName'},
{k_columnId: 'description'},
{k_columnId: 'email'}
],
k_remoteData: {
k_timeout: k_CONSTANTS.k_TIMEOUT_REQUEST_DOMAIN_CONTROLLER,
k_jsonRpc: {
method: 'Users.get',
params: {
domainId: k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE,
query:{
orderBy: [
{
columnName: 'userName',
direction: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Asc
}
]
}
}
}
}
};
break;
case 'k_groups':
k_storeCfg = {
k_record: [
{k_columnId: 'id', k_isPrimaryKey: true},
{k_columnId: 'name'},
{k_columnId: 'description'}
],
k_remoteData: {
k_timeout: k_CONSTANTS.k_TIMEOUT_REQUEST_DOMAIN_CONTROLLER,
k_jsonRpc: {
method: 'UserGroups.get',
params: {
domainId: k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE
}
}
}
};
break;
case 'k_services':
k_storeCfg = {
k_remoteData: {
k_record: [
{k_columnId: 'id', k_isPrimaryKey: true},
{k_columnId: 'name'},
{k_columnId: 'description'}
],
k_jsonRpc: {
method: 'IpServices.get'
}
},

k_onLoad: function(k_relatedWidget, k_options, k_jsonData) {
var
k_serviceList = k_jsonData.list,
k_serviceListMapped = [],
k_i, k_cnt;
this.k_setData(k_serviceList);
for (k_i = 0, k_cnt = k_serviceList.length; k_i < k_cnt; k_i++) {
k_serviceListMapped[k_serviceList[k_i].id] = k_serviceList[k_i];
}
this.k_serviceListMapped = k_serviceListMapped;
}
};
break;
case 'k_trafficRules':
k_storeCfg = {
k_isQueryValueSent: false,
k_remoteData: {
k_jsonRpc: {
method: 'TrafficPolicy.get',
params: {query: null}
}
}
};
break;
case 'k_httpRules':
k_storeCfg = {
k_isQueryValueSent: false,
k_remoteData: {
k_jsonRpc: {
method: 'ContentFilter.get',
params: {query: null}
}
}
};
break;
case 'k_ftpRules':
k_storeCfg = {
k_isQueryValueSent: false,
k_remoteData: {
k_jsonRpc: {
method: 'ContentFilter.get',
params: {query: null}
}
}
};
break;
case 'k_contentRules':
k_storeCfg = {
k_isQueryValueSent: false,
k_remoteData: {
k_jsonRpc: {
method: 'ContentFilter.get',
params: {query: null}
}
}
};
break;
case 'k_outgoingInterfaces':
k_storeCfg = {
k_remoteData: {
k_jsonRpc: {
method: 'Interfaces.get',
params: {
sortByGroup: false,
query: this._k_getSharedCfg('k_interfaceOutgoingQuery')
}
}
}
};
break;
case 'k_internetInterfaces':
k_storeCfg = {
k_remoteData: {
k_jsonRpc: {
method: 'Interfaces.get',
params: {
sortByGroup: false,
query: this._k_getSharedCfg('k_interfaceInternetQuery')
}
}
},
k_onLoad: function(k_relatedWidget, k_options, k_jsonData) {
var
k_interfaces = k_jsonData.list,
k_addressList = [],
k_secondaryAddresses,
k_interface,
k_i, k_cnt,
k_j, k_cntSecondaryAddresses;
for (k_i = 0, k_cnt = k_interfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_i];
if (!k_interface.ip4Enabled) {
continue;
}
if ('' !== k_interface.ip) {
k_addressList.push({
name: k_interface.ip,
id: k_interface.ip
});
}
k_secondaryAddresses = k_interface.secondaryAddresses;
for (k_j = 0, k_cntSecondaryAddresses = k_secondaryAddresses.length; k_j < k_cntSecondaryAddresses; k_j++) {
k_addressList.push({
name: k_secondaryAddresses[k_j].ip,
id: k_secondaryAddresses[k_j].ip
});
}
}
if (2 > k_addressList.length) {
k_addressList = [];
}
this.k_setData(k_addressList);
}
};
break;
case 'k_ethernetInterfaces':
k_storeCfg = {
k_remoteData: {
k_jsonRpc: {
method: 'Interfaces.get',
params: {
sortByGroup: false,
query: this._k_getSharedCfg('k_interfaceEthernetQuery')
}
}
}
};
break;
case 'k_ethernetAndRasInterfaces':
k_storeCfg = {
k_remoteData: {
k_jsonRpc: {
method: 'Interfaces.get',
params: {
sortByGroup: false,
query: this._k_getSharedCfg('k_interfaceEthernetRasQuery')
}
}
}
};
break;
case 'k_vpnTunnels':
k_storeCfg = {
k_remoteData: {
k_jsonRpc: {
method: 'Interfaces.get',
params: {
sortByGroup: false,
query: this._k_getSharedCfg('k_interfaceVpnQuery')
}
}
}
};
break;
case 'k_vpnServer':
k_storeCfg = {
k_remoteData: {
k_jsonRpc: {
method: 'Interfaces.get',
params: {
sortByGroup: false,
query: this._k_getSharedCfg('k_interfaceVpnServerQuery')
}
}
}
};
break;
case 'k_ipAddressGroups':
k_storeCfg = {
k_remoteData: {
k_root: 'groups',
k_jsonRpc: {
method: 'IpAddressGroups.getGroupList',
params: {query: null}
}
},

k_onLoad: function(k_relatedWidget, k_options, k_jsonData) {
var
k_ipGroupList = k_jsonData.groups,
k_ipGroupListMapped = [],
k_i, k_cnt;
this.k_setData(k_ipGroupList);
for (k_i = 0, k_cnt = k_ipGroupList.length; k_i < k_cnt; k_i++) {
k_ipGroupListMapped[k_ipGroupList[k_i].id] = k_ipGroupList[k_i];
}
this.k_ipGroupListMapped = k_ipGroupListMapped;
}
};
break;
case 'k_timeRanges':
k_storeCfg = {
k_remoteData: {
k_root: 'groups',
k_jsonRpc: {
method: 'TimeRanges.getGroupList',
params: {query: null}
}
}
};
break;
case 'k_timeRangesAllGroups':
case 'k_ipAddressAllGroups':
case 'k_urlAllGroups':
switch (k_storeId) {
case 'k_timeRangesAllGroups':
k_method = 'TimeRanges';
break;
case 'k_ipAddressAllGroups':
k_method = 'IpAddressGroups';
break;
case 'k_urlAllGroups':
k_method = 'UrlGroups';
break;
}
k_storeCfg = {
k_remoteData: {
k_jsonRpc: {
method: k_method + '.get',
params: {query: { orderBy: [{ columnName: 'groupId', direction: 'Asc' }]}}
}
},

k_onLoad: function(k_relatedWidget, k_options, k_jsonData) {
var
k_list = k_jsonData.list,
k_cnt = k_list.length,
k_groupsById = [],
k_groups = [],
k_item,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_list[k_i];
if (undefined === k_groupsById[k_item.groupId]) {
k_groupsById[k_item.groupId] = k_item.groupName;
k_groups.push({
id: k_item.groupId,
name: k_item.groupName,
type: k_item.type,
sharedId: k_item.sharedId,
appManagerId: k_item.appManagerId
});
}
}
this.k_setData(k_groups);
}
};
break;
case 'k_urlGroups':
k_storeCfg = {
k_remoteData: {
k_root: 'groups',
k_jsonRpc: {
method: 'UrlGroups.getGroupList',
params: {query: null}
}
},

k_onLoad: function(k_relatedWidget, k_options, k_jsonData) {
var
k_urlGroupList = k_jsonData.groups,
k_urlGroupListMapped = [],
k_i, k_cnt;
this.k_setData(k_urlGroupList);
for (k_i = 0, k_cnt = k_urlGroupList.length; k_i < k_cnt; k_i++) {
k_urlGroupListMapped[k_urlGroupList[k_i].id] = k_urlGroupList[k_i];
}
this.k_urlGroupListMapped = k_urlGroupListMapped;
}
};
break;
case 'k_ipsecTunnelCertificates':
case 'k_certificates':
k_storeCfg = {
k_remoteData: {
k_root: 'certificates',
k_jsonRpc: {
method: 'Certificates.get',
params: {
query: k_storeId === 'k_certificates' ? this._k_getSharedCfg('k_activeCertificatesQuery') : this._k_getSharedCfg('k_ipsecTunnelQuery')
}
}
},

k_onLoad: function(k_relatedWidget, k_options, k_jsonData) {
var
k_certificateList = k_jsonData.certificates,
k_certificateListMapped = [],
k_i, k_cnt;
this.k_setData(k_certificateList);
for (k_i = 0, k_cnt = k_certificateList.length; k_i < k_cnt; k_i++) {
k_certificateListMapped[k_certificateList[k_i].id] = k_certificateList[k_i];
}
this.k_certificateListMapped = k_certificateListMapped;
if (undefined === this.k_getCertificateData) {

this.k_getCertificateData = function(k_id) {
if (this.k_certificateListMapped) {
return this.k_certificateListMapped[k_id];
}
return undefined;
};
}
}
};
break;
case 'k_domains':
k_storeCfg = {
k_remoteData: {
k_jsonRpc: {
method: 'Domains.get'
}
},

k_onLoad: function(k_relatedWidget, k_options, k_jsonData) {
var
k_shared = kerio.waw.shared,
k_domains = k_shared.k_methods.k_filterDomainList(k_jsonData.list);
this.k_domains = k_domains;
this.k_setData(k_domains.k_list);
this.k_setCurrentKey(k_shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE);
if (!this.k_getDomainTemplateData) {

this.k_getDomainTemplateData = function(k_domainId) {
return this.k_domains.k_templates[k_domainId];
};

this.k_setDomainTemplateData = function(k_domainId, k_data) {
this.k_domains.k_templates[k_domainId] = k_data;
};
}
}
};
break;
case 'k_applications':
k_storeCfg = {
k_isQueryValueSent: false,
k_remoteData: {
k_root: 'categories',
k_jsonRpc: {
method: 'ContentFilter.getContentApplicationList',
params: {query: null}
}
},
k_onLoad: function(k_relatedWidget, k_options, k_jsonData) {
this.k_setData(k_jsonData.categories);
}
};
break;
case 'k_fileTypes':
k_storeCfg = {
k_isQueryValueSent: false,
k_record: [
{k_columnId: 'name', k_isPrimaryKey: true}
],
k_remoteData: {
k_root: 'fileNamesGroups',
k_jsonRpc: {
method: 'FilenameGroups.get',
params: {query: null}
}
},
k_onLoad: function(k_relatedWidget, k_options, k_jsonData) {
var
k_TRANSLATIONS = kerio.waw.shared.k_DEFINITIONS.k_FILE_NAME_GROUPS_TRANSLATIONS,
k_groups = k_jsonData.groups,
k_cnt = k_groups.length,
k_i,
k_group;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_group = k_groups[k_i];
k_group.k_translation = k_TRANSLATIONS[k_group.name];
}
k_groups.sort(function(k_item1, k_item2){
return k_item1.k_translation.localeCompare(k_item2.k_translation);
});
kerio.waw.shared.k_CONSTANTS.k_FILE_TYPE_FIRST_GROUP = k_groups[0].name;
this.k_setData(k_groups);
}
};
break;
case 'k_dhcpScopesList':
k_storeCfg = {
k_isQueryValueSent: false,
k_remoteData: {
k_root: 'list',
k_jsonRpc: {
method: 'Dhcp.get',
params: {'query':{'start':0,'limit':-1}}
}
}
};
break;
default:
kerio.lib.k_reportError('Internal error: unknown store "' + k_storeId + '"', 'kerio.waw.shared.k_data', 'k_get');
}
return k_shared.k_methods.k_mergeObjects(k_storeCfg, this._k_getStoreCfgTemplate());
},_k_getSharedCfg: function(k_cfg) {
this._k_getSharedCfg = kerio.waw.shared.k_DEFINITIONS.k_get; return this._k_getSharedCfg(k_cfg);
},

k_getStore: function(k_storeId, k_params) {
k_storeId = this._k_checkStoreId(k_storeId);
if (k_params && k_params.k_domainId && kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE !== k_params.k_domainId) {
k_storeId = k_storeId + '_' + k_params.k_domainId;
}
return this._k_stores[k_storeId];
},

_k_getStoreCfgTemplate: function() {
return {
k_record: [
{k_columnId: 'id', k_isPrimaryKey: true},
{k_columnId: 'name'}
],
k_sorting: {
k_isRemoteSort: true
},
k_remoteData: {
k_isAutoLoaded: false,
k_root: 'list',
k_jsonRpc: {
method: '',
params: {
query:{
orderBy: [
{
columnName: 'name',
direction: kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Asc,
caseSensitive: true
}
]
}
}
},
k_isQueryValueSent: true
}
};
},

k_removeStore: function(k_storeId, k_params) {
var
k_currentStoreId = this._k_checkStoreId(k_storeId);
if (k_params && k_params.k_domainId && kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE !== k_params.k_domainId) {
k_currentStoreId = k_currentStoreId + '_' + k_params.k_domainId;
}
this._k_stores[k_currentStoreId] = null;
},
_k_stores: {},
_k_currentScreen: null, _k_currentDialog: [],   _k_getCurrentWidget: function(k_includeDialogs) {
var
k_dialogs = this._k_currentDialog,
k_widget = this._k_currentScreen;
if (false !== k_includeDialogs && 0 < k_dialogs.length) {
k_widget = k_dialogs[k_dialogs.length - 1]; }
if (!k_widget) {
k_widget = { k_id: '' };
}
return k_widget;
},

k_cache: function(k_config) {
var
k_currentScreen = k_config.k_screen,
k_currentDialog = k_config.k_dialog,
k_dialogs = k_config.k_dialogs,
k_stores = k_config.k_stores || k_config.k_data;
if (k_currentScreen) {
this._k_currentScreen = k_currentScreen;
}
if (k_currentDialog) {
this._k_currentDialog.push(k_currentDialog);
k_currentScreen = k_currentDialog; }
if (Ext.isArray(k_dialogs)) {
this.k_loadRelatedDialogs(k_currentScreen, k_dialogs);
}
if (Ext.isArray(k_stores)) {
this.k_loadStores(k_currentScreen, k_stores);
}
kerio.waw.requests._k_startCaching();
},
_k_relatedDialogs: {}, 
k_loadRelatedDialogs: function(k_widget, k_dialogs) {
if (!k_widget) {
return;
}
var
k_relatedDialogsList = this._k_relatedDialogs,
k_screenId = k_widget.k_id,
k_widgetRelatedDialogs;
if (Ext.isArray(k_relatedDialogsList[k_screenId])) {
k_widgetRelatedDialogs = k_relatedDialogsList[k_screenId];
}
else {
k_widgetRelatedDialogs = [];
k_widgetRelatedDialogs._k_parent = k_widget;
}
k_widgetRelatedDialogs = k_widgetRelatedDialogs.concat(k_dialogs);
k_relatedDialogsList[k_screenId] = k_widgetRelatedDialogs;
kerio.waw.requests._k_startCaching();
},

_k_onCacheError: function() {
return true;
},
_k_lastDialogName: '',
_k_lastDialogTry: 0,

_k_getRelatedDialog: function() {
var
k_screen = this._k_getCurrentWidget(),
k_relatedDialogsList = this._k_relatedDialogs,
k_screenId,
k_widgetRelatedDialogs,
k_sourceName,
k_requests,
k_i, k_cnt;
if (!k_screen) {
return false;
}
k_screenId = k_screen.k_id;
if (!Ext.isArray(k_relatedDialogsList[k_screenId])) {
return false; }
k_widgetRelatedDialogs = k_relatedDialogsList[k_screenId];
while (0 < k_widgetRelatedDialogs.length) {
k_sourceName = k_widgetRelatedDialogs[0]; if (k_sourceName === this._k_lastDialogName) {
if (1 < this._k_lastDialogTry++) { k_widgetRelatedDialogs.shift();
continue;
}
}
else {
this._k_lastDialogName = k_sourceName;
this._k_lastDialogTry = 0;
}
if (kerio.lib.k_uiCacheManager._k_uiNamespace[k_sourceName]) { k_widgetRelatedDialogs.shift();                            continue;                                                  }
k_requests = kerio.lib.k_uiCacheManager._k_ajaxRequestStack;
for (k_i = 0, k_cnt = k_requests.length; k_i < k_cnt; k_i++) {
if (k_requests[k_i].conn && 4 > k_requests[k_i].conn.readyState) {
return false; }
} kerio.lib.k_ajax.k_request({
k_url: k_sourceName + '.js' + kerio.lib._k_kerioLibraryQuery + '&caching=' + k_screenId, k_method: 'get',
k_callback: this._k_getRelatedDialogCallback,
k_scope: this,
k_callbackParams: {k_sourceName: k_sourceName},
k_requestOwner: kerio.lib.k_uiCacheManager,
k_errorMessages: {k_invalidResponse: ''},
k_onError: this._k_onCacheError
});
return true; }
return false; },

_k_getRelatedDialogCallback: function(k_response, k_success, k_params) {
if (k_success) {
if (kerio.lib.k_uiCacheManager._k_uiNamespace[k_params.k_sourceName]) { return;
}
kerio.lib.k_uiCacheManager._k_evalJsonConfig(k_params.k_sourceName, k_response.k_xhrResponse.responseText); } kerio.waw.requests._k_resumeCaching();
},
_k_relatedStores: {}, 
k_loadStores: function(k_widget, k_stores) {
if (!k_widget) {
return;
}
var
k_relatedStoresList = this._k_relatedStores,
k_screenId = k_widget.k_id,
k_widgetRelatedStores;
if (Ext.isArray(k_relatedStoresList[k_screenId])) {
k_widgetRelatedStores = k_relatedStoresList[k_screenId];
}
else {
k_widgetRelatedStores = [];
k_widgetRelatedStores._k_parent = k_widget;
}
k_widgetRelatedStores = k_widgetRelatedStores.concat(k_stores);
k_relatedStoresList[k_screenId] = k_widgetRelatedStores;
kerio.waw.requests._k_startCaching();
},

_k_getRelatedStore: function() {
var
k_screen = this._k_getCurrentWidget(),
k_relatedStoresList = this._k_relatedStores,
k_screenId,
k_widgetRelatedStores,
k_storeId,
k_domainId;
if (!k_screen) {
return false;
}
k_screenId = k_screen.k_id;
if (!Ext.isArray(k_relatedStoresList[k_screenId])) {
return false; }
k_widgetRelatedStores = k_relatedStoresList[k_screenId];
while (0 < k_widgetRelatedStores.length) {
k_storeId = k_widgetRelatedStores.shift(); if (k_storeId && k_storeId.k_storeId) {
k_domainId = k_storeId.k_domainId;
k_storeId = k_storeId.k_storeId;
}
k_storeId = this._k_checkStoreId(k_storeId);
if (undefined !== k_domainId && kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE !== k_domainId) {
k_storeId += '_' + k_domainId;
}
if (this._k_stores[k_storeId]) {
continue; }
this.k_get(k_storeId, false, { k_domainId: k_domainId});
return true; }
return false; },
k_ipMaskTemplates: new kerio.lib.K_DataStoreSharedLocal({
k_record: [
{k_columnId: 'value', k_isPrimaryKey: true}
],
k_sorting: {
k_columnId: 'value'
},
k_localData: [
{ value: '255.0.0.0'},
{ value: '255.255.0.0'},
{ value: '255.255.255.0'}
]
}),
k_ipRouteMaskTemplates: new kerio.lib.K_DataStoreSharedLocal({
k_record: [
{k_columnId: 'value', k_isPrimaryKey: true}
],
k_sorting: {
k_columnId: 'value'
},
k_localData: [
{ value: '0.0.0.0'},
{ value: '255.0.0.0'},
{ value: '255.255.0.0'},
{ value: '255.255.255.0'},
{ value: '255.255.255.255'}
]
})
}; 