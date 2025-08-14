
kerio.waw.ui.proxyServerList = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_shared = kerio.waw.shared,
k_methods = k_shared.k_methods,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_DEFINITIONS = k_shared.k_DEFINITIONS,
k_isAuditor = k_methods.k_isAuditor(),
k_isBoxEdition = k_methods.k_isBoxEdition(),
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
K_HEIGHT_ENABLE_REVERSE_PROXY = 25,
K_HEIGHT_SELECT_CERTIFICATE = 70,
K_VERTICAL_ANCHOR_REVERSE_PROXY_GRID = 20 + K_HEIGHT_ENABLE_REVERSE_PROXY + K_HEIGHT_SELECT_CERTIFICATE,
k_batchOptions,
k_batchChangeHandler,
k_onChangeHandler,
k_proxyServerCfg, k_proxyServer,
k_statusbar, k_statusbarCfg,
k_rulesGridCfg, k_rulesGrid,
k_reverseProxyCfg, k_reverseProxy,
k_cacheCfg, k_cache,
k_toolbarCfg, k_toolbar,
k_tabPageCfg, k_tabPage;

k_onChangeHandler = function(k_batchId) {
if (k_batchId && this.k_batchOptions[k_batchId]) {
this.k_batchOptions[k_batchId].k_isContentChanged = true;
kerio.adm.k_framework.k_enableApplyReset();
}
};

k_proxyServerCfg = {
k_useStructuredData: true,
k_isReadOnly: k_isAuditor,

k_onChange: function () {
this.k_onChangeHandler(this.k_batchId);
},
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('General', 'proxyServerList'),
k_items: [
{
k_type: 'k_checkbox',
k_id: 'enabled',
k_isLabelHidden: true,
k_option: k_tr('Enable non-transparent proxy server', 'proxyServerList'),
k_value: false,

k_onChange: function(k_form, k_item, k_enable) {
var
k_disable = !k_enable;
k_form.k_setDisabled(['k_proxySetting'], k_disable);
}
},
{
k_type: 'k_container',
k_id: 'k_proxySetting',
k_indent: 1,
k_labelWidth: 70,
k_items: [
k_DEFINITIONS.k_get('k_portField', {k_id: 'port'}),
{
k_type: 'k_checkbox',
k_id: 'allowAllPorts',
k_isLabelHidden: true,
k_option: k_tr('Allow tunneled connections to all TCP ports', 'proxyServerList')
},
{
k_type: 'k_display',
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_indent: 2,
k_value: k_tr('Required for HTTPS connections on non-standard ports.', 'proxyServerList')
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Set the automatic proxy configuration script to:', 'proxyServerList')
},
{
k_type: 'k_container',
k_indent: 1,
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_radio',
k_groupId: 'automaticScriptDirect',
k_option: [ k_tr('Direct access', 'proxyServerList'),
' (', k_tr('transparent proxy', 'proxyServerList'), ')'].join(''),
k_value: true
},
{
k_type: 'k_radio',
k_groupId: 'automaticScriptDirect',
k_option: k_tr('Kerio Control non-transparent proxy server', 'proxyServerList'),
k_value: false
}
]
},
{
k_type: 'k_checkbox',
k_id: 'automaticScriptEnabled',
k_isLabelHidden: true,
k_option: k_tr('Allow browsers to use configuration script automatically via DHCP server in Kerio Control', 'proxyServerList')
}
]
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Parent proxy server', 'proxyServerList'),
k_items: [
{
k_type: 'k_checkbox',
k_id: 'parentProxy.enabled',
k_isLabelHidden: true,
k_option: k_tr('Use parent proxy server', 'proxyServerList'),
k_value: false,

k_onChange: function(k_form, k_item, k_enable) {
var
k_disable = !k_enable;
k_form.k_setDisabled(['k_parentProxySetting'], k_disable);
}
},
{
k_type: 'k_container',
k_id: 'k_parentProxySetting',
k_indent: 1,
k_items: [
{
k_type: 'k_columns',
k_items: [
{
k_id: 'parentProxy.server',
k_caption: k_tr('Server:', 'proxyServerList'),
k_maxLength: k_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME_OR_IP_ADDRESS,
k_width: k_lib.k_isIPadCompatible ? undefined : 300,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_hasNoSpaces'
}
},
{
k_type: 'k_container',
k_labelWidth: 5,
k_items: [
k_DEFINITIONS.k_get(
'k_portField',
{
k_id: 'parentProxy.port',
k_caption: ':'
}
)
]
}
]
},
{
k_type: 'k_checkbox',
k_id: 'parentProxy.authEnabled',
k_isLabelHidden: true,
k_option: k_tr('Parent proxy server requires authentication', 'proxyServerList'),

k_onChange: function(k_form, k_item, k_value) {
k_form.k_setDisabled('k_containerAuthentication', !k_value);
k_form.k_getItem('parentProxy.credentials.userName').k_focus();
}
},
{
k_type: 'k_container',
k_id: 'k_containerAuthentication',
k_indent: 2,
k_isDisabled: true,
k_items: [
k_DEFINITIONS.k_get('k_userNameField',
{
k_id: 'parentProxy.credentials.userName',
k_validator: {
k_functionName: 'k_isUserNameDomain',
k_allowBlank: false
}
}
),
k_DEFINITIONS.k_get('k_passwordField', {k_id: 'parentProxy.credentials.password'})
]
}
]
}
]
}
]
};
k_proxyServer = new k_lib.K_Form(k_localNamespace + 'k_proxyServer', k_proxyServerCfg);
k_proxyServer.k_patchAutoFill();
k_proxyServer.k_addReferences({
k_batchId: 'k_proxyServer',
k_portField: k_proxyServer.k_getItem('port'),
k_parentProxyServerField: k_proxyServer.k_getItem('parentProxy.server'),
k_parentProxyPortField: k_proxyServer.k_getItem('parentProxy.port'),
k_usernameField: k_proxyServer.k_getItem('parentProxy.credentials.userName'),
k_passwordField: k_proxyServer.k_getItem('parentProxy.credentials.password')
});

k_statusbarCfg = {
k_configurations: {
k_default: {
k_text: ''
},
k_invalidCertificate: {
k_text: k_tr('Some rules refer to invalid or non-existing certificate. In case of non-existing certificate, default certificate is used instead.', 'proxyServerList'),
k_iconCls: 'statusBarIcon invalidCertificateError'
}
},
k_defaultConfig: 'k_default'
};
k_statusbar = new kerio.lib.K_Statusbar(k_localNamespace + 'k_statusbar', k_statusbarCfg);
k_rulesGridCfg = {
k_isAuditor: k_isAuditor,
k_className: 'reverseProxyRules',
k_isApplyResetUsed: false,
k_settingsId: 'ReverseProxyRulesGrid',
k_statusbar: k_statusbar,

k_onCellDblClick: function(k_grid, k_rowData, k_columnId) {
var
k_certificateList;
if (k_grid.k_reverseProxy.k_defaultCertificate) {
k_certificateList = k_grid.k_reverseProxy.k_defaultCertificate._k_select._k_dataStore.k_getData();
}
else {
k_certificateList = [];
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'reverseProxyRuleEditor',
k_objectName: 'reverseProxyRuleEditorEdit',
k_params: {
k_data: k_rowData,
k_relatedWidget: k_grid,
k_certificateList: k_certificateList,
k_activeItem: k_columnId
}
});
},
k_toolbars: {
k_bottom: {
k_items: [
{
k_type: 'K_GRID_DEFAULT',

k_onRemove: function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget;
k_grid.k_removeSelectedRows();
k_grid.k_reverseProxy.k_onChangeHandler(k_grid.k_reverseProxy.k_batchId);
k_grid.k_checkRulesCertificateValidity();
}
}
],
k_dialogs: {
k_sourceName: 'reverseProxyRuleEditor',

k_onBeforeShow: function(k_toolbar, k_button) {
var
k_dialogs = k_toolbar.k_dialogs,
k_rulesGrid = k_toolbar.k_relatedWidget,
k_isEditMode = ('k_btnEdit' === k_button.k_name || 'k_btnView' === k_button.k_name),
k_certificateList,
k_ruleData;
if (k_rulesGrid.k_reverseProxy.k_defaultCertificate) {
k_certificateList = k_rulesGrid.k_reverseProxy.k_defaultCertificate._k_select._k_dataStore.k_getData();
}
else {
k_certificateList = [];
}
if (k_isEditMode) {
k_ruleData = k_dialogs.k_additionalParams.k_data = k_rulesGrid.k_selectionStatus.k_rows[0].k_data;
}
else {
k_ruleData = [];
}
k_dialogs.k_additionalParams.k_certificateList = k_certificateList;
k_dialogs.k_additionalParams.k_data = k_ruleData;
}
}
}
},
k_columns: {
k_sorting: false,
k_items: [
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'enabled',
k_isDataOnly: true
},
{
k_columnId: 'httpsMode',
k_isDataOnly: true
},
{
k_columnId: 'targetHttps',
k_isDataOnly: true
},
{
k_columnId: 'serverHostname',
k_caption: k_tr('Host', 'proxyServerList'),
k_width: 150,
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'enabled',

k_onChange: function(k_grid) {
k_grid.k_reverseProxy.k_onChangeHandler(k_grid.k_reverseProxy.k_batchId);
}
}
},
{
k_columnId: 'serverHttp',
k_caption: k_tr('Ports', 'proxyServerList'),
k_width: 100,

k_renderer: function(k_value, k_data) {
var
k_SERVER_PROTOCOLS = this.k_TRANSLATIONS.k_SERVER_PROTOCOLS,
k_isHttp = k_data.serverHttp,
k_isHttpSecured = this.k_REVERSE_PROXY_HTTPS_MODE_DISABLED !== k_data.httpsMode,
k_text;
if (k_isHttp === k_isHttpSecured) {
k_text = k_isHttp ? k_SERVER_PROTOCOLS.k_BOTH_ENABLED : k_SERVER_PROTOCOLS.k_BOTH_DISABLED;
}
else {
k_text = k_isHttp ? k_SERVER_PROTOCOLS.k_HTTP_ONLY : k_SERVER_PROTOCOLS.k_HTTP_SECURED_ONLY;
}
return {
k_data: k_text
};
}
},
{
k_columnId: 'customCertificate',
k_caption: k_tr('Certificate', 'proxyServerList'),
k_width: 150,

k_renderer: function(k_value, k_data) {
var
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
HttpsServerMode = k_CONSTANTS.HttpsServerMode,
k_TRANSLATIONS_CERTIFICATES = k_shared.k_DEFINITIONS.k_CERTIFICATE_GRID_TRANSLATIONS,
k_iconCls = '',
k_text = '';
switch (k_data.httpsMode) {
case HttpsServerMode.HttpsServerModeDisabled:
k_text = '';
break;
case HttpsServerMode.HttpsServerModeDefaultCertificate:
k_text = k_TRANSLATIONS_CERTIFICATES.k_DEFAULT;
k_iconCls = 'certificateIcon';
break;
case HttpsServerMode.HttpsServerModeCustomCertificate:
return kerio.waw.shared.k_methods.k_renderers.k_renderCertificate(k_data.customCertificate, false, true);
}
return {
k_data: k_text,
k_iconCls: k_iconCls
};
}
},
{
k_columnId: 'targetServer',
k_width: 150,
k_caption: k_tr('Server', 'proxyServerList')
},
{
k_columnId: 'antivirus',
k_caption: k_tr('Antivirus', 'proxyServerList'),
k_isHidden: true,

k_renderer: function(k_value) {
return {
k_data: k_value ? this.k_TRANSLATIONS.k_ANTIVIRUS.k_SCAN : this.k_TRANSLATIONS.k_ANTIVIRUS.k_DONT_SCAN
};
}
},
{
k_columnId: 'description',
k_caption: k_tr('Description', 'common')
}
]
},

k_enableApplyOnAction: function () {
this.k_reverseProxy.k_onChangeHandler(this.k_reverseProxy.k_batchId);
},

k_onDrop: function (k_grid, k_data, k_rowIndex, k_isCopy) {
var
k_i, k_cnt;
if (k_isCopy) {
k_cnt = k_data.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_data[k_i].id = '';
}
}
k_grid.k_reverseProxy.k_onChangeHandler(k_grid.k_reverseProxy.k_batchId);
}
}; k_rulesGrid = new kerio.waw.shared.k_widgets.K_SimpleRulesGrid(k_localNamespace + 'k_rulesGrid', k_rulesGridCfg);
k_reverseProxyCfg = {

k_onChange: function () {
this.k_onChangeHandler(this.k_batchId);
},
k_isReadOnly: k_isAuditor,
k_minHeight: 200,
k_items: [
{
k_type: 'k_container',
k_height: K_HEIGHT_ENABLE_REVERSE_PROXY,
k_items: [
{
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_id: 'enabled',
k_option: k_tr('Enable Reverse Proxy', 'proxyServerList')
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Reverse Proxy rules', 'proxyServerList'),
k_anchor: '0 -' + K_VERTICAL_ANCHOR_REVERSE_PROXY_GRID, k_items: [
{
k_type: 'k_container',
k_content: k_rulesGrid
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Settings', 'common'),
k_items: [
k_methods.k_getSslCertificateFields('k_reverseProxy', 'k_reverseProxy', {k_caption: k_tr('Default certificate:', 'proxyServerList'),
k_onCertificateChange: function(k_form, k_select, k_value) {
k_select.k_markInvalid('' === k_value);
}
})
]
}
]
};
k_reverseProxy = new k_lib.K_Form(k_localNamespace + 'k_reverseProxy', k_reverseProxyCfg);
k_reverseProxy.k_addReferences({
k_batchId: 'k_reverseProxy',
k_defaultCertificate: k_reverseProxy.k_getItem('k_reverseProxy' + '_' + 'k_certificate')
});
k_rulesGrid.k_addReferences({
k_REVERSE_PROXY_HTTPS_MODE_DISABLED: k_CONSTANTS.HttpsServerMode.HttpsServerModeDisabled,
k_TRANSLATIONS: {
k_SERVER_PROTOCOLS: {
k_HTTP_ONLY: 'HTTP',
k_HTTP_SECURED_ONLY: 'HTTPS',
k_BOTH_ENABLED: 'HTTP & HTTPS',
k_BOTH_DISABLED: k_tr('No port', 'proxyServerList')
},
k_ANTIVIRUS: {
k_SCAN: k_tr('Scan', 'proxyServerList'),
k_DONT_SCAN: k_tr('Don\'t scan', 'proxyServerList')
}
},
k_reverseProxy: k_reverseProxy,

k_addRule: function(k_data) {
this._k_processRule(k_data, true);
},

k_updateRule: function(k_data) {
this._k_processRule(k_data, false);
},

_k_processRule: function(k_data, k_isRuleAdded) {
var
k_rowIndex;
this.k_markRuleWithInvalidCertificate(k_data);
if (true === k_isRuleAdded) {
k_rowIndex = this.k_selectionStatus.k_selectedRowsCount ? this.k_selectionStatus.k_rows[0].k_rowIndex + 1 : 0;
this.k_addRow(k_data, k_rowIndex);
}
else {
this.k_updateRow(k_data);
}
this.k_reverseProxy.k_onChangeHandler(this.k_reverseProxy.k_batchId);
this.k_checkRulesCertificateValidity();
},

k_isRuleCertificateInvalid: function(k_data) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
HttpsServerMode = k_CONSTANTS.HttpsServerMode,
k_isInvalid = false,
k_certificates,
k_certificateData;
if (HttpsServerMode.HttpsServerModeCustomCertificate === k_data.httpsMode) {
k_isInvalid = '' === k_data.customCertificate.id;
k_certificates = kerio.waw.shared.k_data.k_get('k_certificates');
k_certificateData = k_certificates.k_getCertificateData(k_data.customCertificate.id);
}
return k_isInvalid;
},

k_markRuleWithInvalidCertificate: function(k_data) {
k_data.invalidCertificate = this.k_isRuleCertificateInvalid(k_data);
},

k_markAllRulesWithInvalidCertificate: function(k_data) {
var
k_certificates = kerio.waw.shared.k_data.k_get('k_certificates'),
k_i, k_cnt;
if (undefined === k_certificates.k_getCertificateData) {
return;
}
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
this.k_markRuleWithInvalidCertificate(k_data[k_i]);
}
},

k_removeCertificateFlagFromData: function(k_data) {
var
k_i, k_cnt;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
delete k_data[k_i].invalidCertificate;
}
},

k_filterRuleWithInvalidCertificate: function(k_data) {
return k_data.invalidCertificate;
},

k_checkRulesCertificateValidity: function() {
var
k_statusbarConfigId = 'k_default',
k_rowDataList;
k_rowDataList = this.k_findRowBy(this.k_filterRuleWithInvalidCertificate);
if (k_rowDataList) {
k_statusbarConfigId = 'k_invalidCertificate';
}
this.k_statusbar.k_switchConfig(k_statusbarConfigId);
}
});

if (!k_isBoxEdition) {
k_cacheCfg = {

k_onChange: function () {
this.k_onChangeHandler(this.k_batchId);
},
k_items:[
{
k_type: 'k_fieldset',
k_caption: k_tr('General', 'proxyServerList'),
k_items: [
{
k_type: 'k_checkbox',
k_id: 'transparentEnabled',
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_option: [ k_tr('Enable cache for direct access to web', 'proxyServerList'),
' (', k_tr('transparent proxy', 'proxyServerList'), ')'].join('')
},
{
k_type: 'k_checkbox',
k_id: 'nonTransparentEnabled',
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_option: k_tr('Enable cache on Kerio Control non-transparent proxy server', 'proxyServerList')
},
{
k_type: 'k_checkbox',
k_id: 'reverseEnabled',
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_option: k_tr('Enable cache for Kerio Control reverse proxy', 'proxyServerList')
},
{
k_type: 'k_columns',
k_indent: 1,
k_labelWidth: 170,
k_items: [
{
k_type: 'k_number',
k_isReadOnly: k_isAuditor,
k_id: 'httpTtl',
k_caption: k_tr('HTTP protocol TTL:', 'proxyServerList'),
k_value: 1,
k_maxLength: 3,
k_minValue: 0,
k_maxValue: 100,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_value: k_tr('day(s)', 'proxyServerList'),
k_width: 50
},
{
k_type: 'k_formButton',
k_id: 'k_btnUrlSettings',
k_caption: k_tr('URL Specific Settings…', 'proxyServerList'),

k_onClick: function(k_form) {
k_form.k_openUrlSettingsList();
}
}
]
},
{
k_type: 'k_columns',
k_isReadOnly: k_isAuditor,
k_indent: 1,
k_labelWidth: 170,
k_items: [
{
k_type: 'k_number',
k_id: 'cacheSize',
k_caption: k_tr('Cache size:', 'proxyServerList'),
k_value: 0,
k_maxLength: 9,
k_minValue: 1,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: 'MB',
k_width: 50
}
]
}
]
},
{
k_type: 'k_fieldset',
k_isReadOnly: k_isAuditor,
k_caption: k_tr('Cache status', 'proxyServerList'),
k_items: [
{
k_type: 'k_display',
k_id: 'k_usedSize',
k_caption: k_tr('Used:', 'proxyServerList'),
k_template: ['{k_used} (', k_tr('files:', 'proxyServerList'), ' {k_files})'].join(''),
k_value: {
k_used: '0 B',
k_files: 0
}
},
{
k_type: 'k_display',
k_id: 'k_effectivity',
k_caption: k_tr('Effectiveness:', 'proxyServerList'),
k_template: ['{k_hitRatio}% (', k_tr('hit:', 'proxyServerList'), ' {k_hit} / ', k_tr('miss:', 'proxyServerList'), ' {k_miss})'].join(''),
k_value: {
k_hitRatio: 0,
k_hit: 0,
k_miss: 0
}
},
{
k_type: 'k_formButton',
k_isVisible: !k_isAuditor,
k_caption: k_tr('Clear Cache', 'proxyServerList'),

k_onClick: function(k_form) {
kerio.lib.k_confirm({
k_title: k_form.k_translations.k_confirmAction,
k_msg: k_form.k_translations.k_clearCache,
k_scope: k_form,
k_callback: k_form.k_confirmClearCache
});
}
}
]
}
]
};
k_cache = new k_lib.K_Form(k_localNamespace + 'k_cache', k_cacheCfg);
k_cache.k_addReferences({
k_batchId: 'k_cache',
k_ttlSettingsBachId: 'k_cacheTtlSettings',
k_isCacheOn: false,k_ttlStore: [],
k_usedSizeElement:  k_cache.k_getItem('k_usedSize'),
k_effectivityElement:  k_cache.k_getItem('k_effectivity'),
k_formatNumber: k_methods.k_formatNumber,
k_formatNumberConfig: {k_decimalPlaces: 0},
k_translations: {
k_confirmAction: k_tr('Confirm Action', 'common'),
k_changeCacheSize: k_tr('Kerio Control must be rebooted in order to change the HTTP Cache size.', 'proxyServerList'),
k_restartNow: k_tr('Do you want to reboot Kerio Control now?', 'proxyServerList'),
k_restartOptions: k_tr('Select "%1" if you want to reboot manually later.', 'proxyServerList', { k_args: [k_tr('No', 'wlibButtons') ] }),
k_clearCache: k_tr('Do you want to clear the HTTP cache now?', 'proxyServerList')
},

k_confirmClearCache: function(k_response) {
if ('no' === k_response) {
return;
}
kerio.lib.k_ajax.k_request(
{
k_jsonRpc: {
method: 'HttpCache.clearCache'
},

k_callback: function() {
this.k_effectivityElement.k_reset();
this.k_usedSizeElement.k_reset();
},
k_scope: this
}
);
},
k_getTtlListRequestCfg: {
k_jsonRpc: {
method: 'HttpCache.getUrlSpecificTtl'
},
k_callback: undefined,
k_scope: k_cache
}
});
} k_tabPageCfg = {
k_className: 'mainList',
k_items: [
{
k_caption: k_tr('Proxy Server', 'proxyServerList'),
k_content: k_proxyServer,
k_id: 'k_proxyServer'
},
{
k_caption: k_tr('Reverse Proxy', 'proxyServerList'),
k_content: k_reverseProxy,
k_id: 'k_reverseProxy'
},
{
k_caption: k_tr('HTTP Cache', 'proxyServerList'),
k_content: k_cache,
k_id: 'k_cache'
}
],

k_onBeforeTabChange: function(k_tabPage, k_newTabId, k_currentTabId) {
var
k_rulesGrid;
if ('k_reverseProxy' === k_newTabId) {
k_rulesGrid = this.k_rulesGrid;
k_rulesGrid.k_markAllRulesWithInvalidCertificate(k_rulesGrid.k_getData());
k_rulesGrid.k_checkRulesCertificateValidity();
this._k_mappedListeners.k_onBeforeTabChange = kerio.waw.shared.k_methods.k_emptyFunction;
}
},
k_onTabChange: function(k_tabPage, k_currentTabId) {
kerio.adm.k_framework._k_setHelpQuery(k_tabPage.k_id + '_' + k_currentTabId);
}
};
if (k_isBoxEdition) {
if ('k_cache' !== k_tabPageCfg.k_items[2].k_id) {
k_lib.k_reportError('Internal error: HTTP Policy - position of tab cache has changed, update the code for Box', 'proxyServerList', 'k_init');
return;
}
k_tabPageCfg.k_items.splice(2, 1); }
if (!k_isAuditor) {

k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function(){
this.k_relatedWidget.k_sendData();
kerio.adm.k_framework.k_enableApplyReset(false);
return false;
},

k_onReset: function(){
this.k_relatedWidget.k_resetData();
kerio.adm.k_framework.k_enableApplyReset(false);
}
};
k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
k_toolbar.k_items.k_btnApply._k_action._k_storedConfig.k_validate = false;
k_tabPageCfg.k_toolbars = {
k_bottom: k_toolbar
};
}
k_tabPage = new k_lib.K_TabPage(k_objectName, k_tabPageCfg);

k_batchOptions = {

k_proxyServer: {
k_isContentChanged: false,
k_root: 'config',
k_sendDataRequest: {
method: 'ProxyServer.set'
},
k_getDataRequest: {
method: 'ProxyServer.get'
},
k_setTabData: function (k_data) {
this.k_proxyServer.k_setData(k_data);
kerio.waw.shared.k_methods.k_initPasswordField(this.k_proxyServer.k_passwordField);
this.k_proxyServer.k_setDisabled(['k_proxySetting'], !k_data.enabled);
this.k_proxyServer.k_setDisabled(['k_parentProxySetting'], !k_data.parentProxy.enabled);
},
k_getTabData: function () {
var
k_form = this.k_proxyServer,
k_data = k_form.k_getData(true),
k_testValidity = false;
if (true === k_data.enabled) {
k_testValidity = !k_form.k_portField.k_isValid();
}
if (!k_testValidity && true === k_data.parentProxy.enabled) {
k_testValidity = (!k_form.k_parentProxyServerField.k_isValid() || !k_form.k_parentProxyPortField.k_isValid());
if (!k_testValidity && true === k_data.parentProxy.authEnabled) {
k_testValidity = (!k_form.k_usernameField.k_isValid());
}
}
if (k_testValidity && !k_form.k_isValid()) {
this.k_stopUpload = true;
return;
}
k_data.parentProxy.credentials.passwordChanged = '' !== k_form.k_passwordField.k_getValue();
return {config: k_data};
}
},

k_reverseProxy: {
k_isContentChanged: false,
k_root: 'config',
k_sendDataRequest: {
method: 'ReverseProxy.set'
},
k_getDataRequest: {
method: 'ReverseProxy.get'
},
k_setTabData: function (k_data) {
var
k_rulesGrid = this.k_rulesGrid;
kerio.waw.shared.k_methods.k_setSslCertificateFieldsetData(
{
k_form: this.k_reverseProxy,
k_idPrefix: 'k_reverseProxy',
k_handleApplyReset: false,
k_listLoaderId: 'k_certificatesReverseProxy',
k_noneOptionForInvalidCertificate: true
},
k_data.defaultCertificate
);
delete k_data.defaultCertificate;
this.k_reverseProxy.k_setData(k_data);
k_rulesGrid.k_markAllRulesWithInvalidCertificate(k_data.rules);
k_rulesGrid.k_setData(k_data.rules);
k_rulesGrid.k_checkRulesCertificateValidity();
k_rulesGrid.k_refresh();
},
k_getTabData: function () {
var
k_certificateFieldId = 'k_reverseProxy' + '_' + 'k_certificate',
k_form = this.k_reverseProxy,
k_data = k_form.k_getData(true);
k_data = kerio.lib.k_cloneObject(k_data);
k_data.rules = this.k_rulesGrid.k_getData();
this.k_rulesGrid.k_removeCertificateFlagFromData(k_data.rules);
if ('' === k_data[k_certificateFieldId]) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Warning', 'common'),
k_msg: kerio.lib.k_tr('No default certificate is selected for Reverse Proxy', 'proxyServerList'),
k_icon: 'warning'
});
this.k_setActiveTab('k_reverseProxy');
this.k_stopUpload = true;
return;
}
k_data.defaultCertificate = {
id: k_data[k_certificateFieldId]
};
delete k_data[k_certificateFieldId];
return {config: k_data};
}
}
}; if (!k_isBoxEdition) {

k_batchOptions.k_cache = {
k_isContentChanged: false,
k_root: 'config',
k_sendDataRequest: {
method: 'HttpCache.set'
},
k_getDataRequest: {
method: 'HttpCache.get'
},
k_setTabData: function (k_data) {
var
k_form = this.k_cache,
k_status = k_data.status,
k_hit = k_status.hit,
k_formatedStatus,
k_formatNumber = k_form.k_formatNumber,
k_formatNumberConfig = k_form.k_formatNumberConfig,
k_wasEnabledBeforeApply;
k_formatedStatus = {
k_files: k_formatNumber(k_status.files, k_formatNumberConfig),
k_hit: k_formatNumber(k_status.hit, k_formatNumberConfig),
k_miss: k_formatNumber(k_status.miss, k_formatNumberConfig),
k_used: kerio.waw.shared.k_methods.k_formatByteUnits(
k_status.used,
kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Bytes,
false,
{k_decimalPlaces: 0}
)
};
k_data.k_usedSize = k_formatedStatus;
k_data.k_effectivity = k_formatedStatus;
if (0 !== k_hit ||  0 !== k_status.miss) {
k_data.k_effectivity.k_hitRatio = Math.round(100 * k_hit / (k_hit + k_status.miss), 0);
}
else {
k_data.k_effectivity.k_hitRatio = 0;
}
k_form.k_isCacheOn = k_data.transparentEnabled || k_data.nonTransparentEnabled || k_data.reverseEnabled;
k_form.k_setData(k_data);
if (k_form.k_originalData) {
k_wasEnabledBeforeApply = k_form.k_originalData.transparentEnabled || k_form.k_originalData.nonTransparentEnabled || k_form.k_originalData.reverseEnabled;
if (!k_form.k_isCacheOn && k_wasEnabledBeforeApply) {
kerio.lib.k_confirm({
k_title: k_form.k_translations.k_confirmAction,
k_msg: k_form.k_translations.k_clearCache,
k_scope: k_form,
k_callback: k_form.k_confirmClearCache
});
}
else if (k_data.cacheSize !== k_form.k_originalData.cacheSize && k_form.k_isCacheOn) {
kerio.lib.k_confirm({
k_title: k_form.k_translations.k_confirmAction,
k_msg: k_form.k_translations.k_changeCacheSize + '<br><br><b>' + k_form.k_translations.k_restartNow + '</b><br>' + k_form.k_translations.k_restartOptions,
k_scope: this,
k_callback: this.k_batchOptions.k_cache.k_resizeCacheCallback
});
}
}
k_form.k_originalData = k_data;
},
k_getTabData: function () {
if (!this.k_cache.k_isValid()) {
this.k_stopUpload = true;
return;
}
return {config: this.k_cache.k_getData()};
},

k_resizeCacheCallback: function(k_answer) {
var k_requests = [];
if ('no' === k_answer) {
return;
}
k_requests.push({ k_jsonRpc: { method: 'SystemTasks.reboot' } });
kerio.waw.requests.k_sendBatch(k_requests);
kerio.waw.requests.k_startRestart(); }
};

k_batchOptions.k_cacheTtlSettings = {
k_isContentChanged: false,
k_root: 'list',
k_sendDataRequest: {
method: 'HttpCache.setUrlSpecificTtl'
},
k_getDataRequest: {
method: 'HttpCache.getUrlSpecificTtl'
},
k_getTabData: function() {
return {list: this.k_cache.k_ttlStore};
},
k_setTabData: function (k_data) {
this.k_cache.k_ttlStore = k_data;
}
};
}
k_tabPage.k_addReferences({
k_toolbar: k_toolbar,
k_proxyServer: k_proxyServer,
k_reverseProxy: k_reverseProxy,
k_rulesGrid: k_rulesGrid,
k_isAuditor: k_isAuditor,
k_dataStore: {}
});
k_batchChangeHandler = {
k_onChangeHandler: k_onChangeHandler,
k_batchOptions: k_batchOptions
};
k_tabPage.k_addReferences(k_batchChangeHandler);
k_proxyServer.k_addReferences(k_batchChangeHandler);
k_reverseProxy.k_addReferences(k_batchChangeHandler);
if (!k_isBoxEdition) {
k_cache.k_addReferences(k_batchChangeHandler);
k_tabPage.k_addReferences({k_cache: k_cache});
}
this.k_addControllers(k_tabPage);
k_tabPage.k_addReferences({
k_applyBatchCfg: {
k_scope: k_tabPage,
k_callback: k_tabPage.k_applyResetCallback
}
});
return k_tabPage;
}, 
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_applyParams: function() {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
kerio.waw.status.k_currentScreen.k_gotoTab(this, 'k_proxyServer');
this.k_loadData();
},

k_resetData: function() {
var
k_requests = [],
k_batchCfg,
k_batchOptions,
k_option,
k_batchId;
k_batchOptions = this.k_batchOptions;
for (k_batchId in k_batchOptions) {
k_option = k_batchOptions[k_batchId];
if (k_option.k_resetDataRequest) {
k_requests.push({ k_jsonRpc: k_option.k_resetDataRequest });
}
}
if (0 === k_requests.length) {
this.k_resetScreen();
return;
}
k_batchCfg = {
k_scope: this,
k_callback: this.k_applyResetCallback
};
kerio.waw.requests.k_sendBatch(k_requests, k_batchCfg);
},

k_applyResetCallback: function(k_response, k_success) {
if (!k_success || !kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
return;
}
if (kerio.adm.k_framework.k_leaveCurrentScreen()) {
return;
}
this.k_resetScreen();
},

k_resetScreen: function() {
kerio.adm.k_framework.k_enableApplyReset(false);
this.k_loadData();
},

k_loadData: function() {
var
k_requests = [],
k_batchCfg,
k_batchOptions,
k_option,
k_batchId;
kerio.waw.shared.k_data.k_get('k_certificates');
k_batchOptions = this.k_batchOptions;
for (k_batchId in k_batchOptions) {
k_option = k_batchOptions[k_batchId];
if (k_option.k_getDataRequest) {
k_requests.push(k_option.k_getDataRequest);
}
}
k_batchCfg = {
k_requests: k_requests,
k_callback: this.k_loadDataCallback,
k_scope: this
};
kerio.waw.shared.k_methods.k_sendBatch(k_batchCfg);
},

k_loadDataCallback: function (k_response, k_success) {
var
k_batchResponseIndex = 0,
k_closureSelf = this,
k_closureResponse = k_response,
k_closureSuccess = k_success,
k_certificates,
k_batchOptions,
k_option,
k_batchResult,
k_batchId;
k_certificates = kerio.waw.shared.k_data.k_get('k_certificates');
if (undefined === k_certificates.k_getCertificateData) {
setTimeout(function () {k_closureSelf.k_loadDataCallback(k_closureResponse, k_closureSuccess);}, 1000);
return;
}
if (!k_success || ! k_response.k_isOk) {
return;
}
k_batchResult = k_response.k_decoded.batchResult;
k_batchOptions = this.k_batchOptions;
for (k_batchId in k_batchOptions) {
k_option = k_batchOptions[k_batchId];
if (k_option.k_setTabData) {
k_option.k_setTabData.call(this, k_batchResult[k_batchResponseIndex][k_option.k_root]);
k_option.k_isContentChanged = false;
}
k_batchResponseIndex++;
}
kerio.adm.k_framework.k_enableApplyReset(false);
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_dialogs: ['reverseProxyRuleEditor']
});
},

k_sendData: function() {
var
k_requests = [],
k_batchCfg = this.k_applyBatchCfg,
k_batchOptions,
k_option,
k_batchId;
k_batchOptions = this.k_batchOptions;
this.k_stopUpload = false;
for (k_batchId in k_batchOptions) {
k_option = k_batchOptions[k_batchId];
if (k_option.k_isContentChanged && k_option.k_sendDataRequest) {
if (false === this.k_stopUpload && k_option.k_getTabData) {
k_option.k_sendDataRequest.params = k_option.k_getTabData.call(this);
}
k_requests.push({ k_jsonRpc: k_option.k_sendDataRequest });
}
}
if (0 === k_requests.length) {
if (!kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.finalVersion) {
kerio.lib.k_warn('Internal error: nothing to apply - proxyServerList - k_sendData');
}
k_batchCfg.k_callback.apply(k_batchCfg.k_scope, [[], true]); return;
}
if (this.k_stopUpload) {
this.k_stopUpload = true;
return false;
}
kerio.waw.requests.k_sendBatch(k_requests, k_batchCfg);
}
}); if (k_kerioWidget.k_cache) {
k_kerioWidget.k_cache.k_addReferences({

k_openUrlSettingsList: function() {
if (this.k_batchOptions[this.k_ttlSettingsBachId].k_isContentChanged) {this.k_getTtlListCallback();
}
else {
if (!this.k_getTtlListRequestCfg.k_callback) {
this.k_getTtlListRequestCfg.k_callback =  this.k_getTtlListCallback;
}
kerio.waw.shared.k_methods.k_maskMainScreen(this);
kerio.lib.k_ajax.k_request(this.k_getTtlListRequestCfg);
}
},

k_getTtlListCallback: function(k_response, k_success) {
if (k_response) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
if (!this.k_batchOptions[this.k_ttlSettingsBachId].k_isContentChanged) {
if (!k_success || !k_response.k_isOk) {
return;
}
this.k_ttlStore = k_response.k_decoded.list;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'urlSettingsList',
k_params: {
k_data: this.k_ttlStore,
k_callback: this.k_editTtlListCallback.createDelegate(this)
}
});
},

k_editTtlListCallback: function(k_list) {
this.k_ttlStore = k_list;
this.k_onChangeHandler(this.k_ttlSettingsBachId);
}
});
}
} }; 