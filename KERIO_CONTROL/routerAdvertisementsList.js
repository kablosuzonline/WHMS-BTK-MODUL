
kerio.waw.ui.routerAdvertisementsList = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_INDEX_GET_MODE = 0,
k_INDEX_GET_LIST = 1,
k_INDEX_GET_CONFIG = 2,
k_shared = kerio.waw.shared,
k_WAW_METHODS = k_shared.k_methods,
k_get = k_shared.k_DEFINITIONS.k_get,
k_tr = kerio.lib.k_tr,
k_isAuditor = k_WAW_METHODS.k_isAuditor(),
k_routerAdvertisementsGrid, k_routerAdvertisementsGridCfg,
k_form, k_formCfg,
k_toolbar, k_toolbarCfg,
k_switchModeHandler,
k_statusbar, k_statusbarCfg,
k_switchModeLink;

k_switchModeHandler = function(k_toolbar) {
var
k_tr = kerio.lib.k_tr,
k_form = k_toolbar.k_getMainWidget(),
k_currentScreen = kerio.waw.status.k_currentScreen,
k_confirmMessage;
if (k_currentScreen.k_isContentChanged()) {
k_currentScreen.k_showContentChangedAlert(k_form.k_unmaskMainScreen);
return;
}
if (k_form.k_isAdvancedMode) {
k_confirmMessage = k_tr('You are switching to the automatic mode of IPv6 router advertisements. All existing configuration will be removed and generated again based on the interfaces settings.', 'routerAdvertisements');
}
else {
k_confirmMessage = k_tr('You are switching to the manual mode of IPv6 router advertisements. In this mode, it is necessary to update the interfaces manually when you change the interface settings or when you obtain a different routed prefix.', 'dhcpServerList');
}
kerio.lib.k_confirm({
k_title: k_tr('Confirm', 'common'),
k_msg: [ k_confirmMessage, '<br><br>', k_tr('Do you want to continue?', 'common') ].join(''),
k_callback: k_form.k_callbackModeConfirm,
k_scope: k_form,
k_icon: 'warning'
});
};
if (!k_isAuditor) {
k_switchModeLink = {
k_text: k_tr('Click to configure manually', 'dhcpServerList'),
k_onClick: k_switchModeHandler
};
}
k_statusbarCfg = {
k_isHidden: true, k_className: 'dhcpStatusBar',
k_configurations: {
k_default: {
k_text: ''
},
k_simpleMode: {
k_text: k_tr('The IPv6 router advertisements are generated based on active interfaces with IPv6 enabled.', 'routerAdvertisements'),
k_link: k_switchModeLink
},
k_noInterfaces: {
k_text: k_tr('Your interfaces settings do not generate any IPv6 router advertisement in automatic mode.', 'routerAdvertisements'),
k_iconCls: 'dhcpMessage warning',
k_link: k_switchModeLink
}
},
k_defaultConfig: 'k_default'
};
k_statusbar = new kerio.lib.K_Statusbar(k_localNamespace + 'k_modeStatusbar', k_statusbarCfg);
k_routerAdvertisementsGridCfg = {
k_isReadOnly: k_isAuditor,
k_className: 'routerAdvertisementsGrid',
k_rowRenderer: function(k_rowData) {
var
k_className = '';
if (!k_rowData.interfaceId || true === k_rowData.interfaceId.invalid) {
k_className = 'inactive';
}
return k_className;
},

k_onBeforeEdit: function(k_grid, k_columnId, k_value, k_rowData) {
var
k_isAdvancedMode = k_grid.k_getMainWidget().k_isAdvancedMode;
if ('enabled' !== k_columnId) {
if (k_isAdvancedMode) {
if ('prefixIp' === k_columnId) {
k_rowData.prefixIp = k_rowData.prefix.ip;
}
return true;
}
return false;
}
},
k_columns: {
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
k_columnId: 'interfaceId',
k_isDataOnly: true
},
{
k_columnId: 'interfaces',
k_caption: k_tr('Interface', 'routerAdvertisements'),
k_width: 250,
k_renderer: function (k_value, k_data) {
var
k_iconClass = 'interfaceIcon interfaceEthernet',
k_text = '';
if (!k_data.interfaceId || true === k_data.interfaceId.invalid) {
k_text = this.k_trNothing;
k_iconClass = 'serviceGroupIcon objectNothing';
}
else  {
if (k_data.interfaceId && k_data.interfaceId.name) {
k_text = k_data.interfaceId.name;
k_data.interfaces = k_text;
}
}
return {
k_data: k_text,
k_iconCls: k_iconClass
};
},
k_editor: [
{
k_type: 'k_checkbox',
k_columnId: 'enabled',
k_onChange: function() {
kerio.adm.k_framework.k_enableApplyReset();
}
},
{
k_type: 'k_select',
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_id: 'selectInterface',

k_onFocus: function(k_parent, k_element) {
var k_data = k_parent.k_getEditInfo().k_rowData;
if (k_data.interfaceId && k_data.interfaceId.id) {
k_element.k_listLoader.k_selectValue(k_data.interfaceId);
}
},

k_onBlur: function(k_parent, k_element) {
var
k_editInfo = k_parent.k_getEditInfo(),
k_data = k_editInfo.k_rowData,
k_newData = k_element.k_listLoader.k_getValue(),
k_interfaces,
k_cnt, k_i,
k_item,
k_name;
if (k_data.interfaceId && k_data.interfaceId.id === k_newData.id) {
return; }
if (undefined === k_newData.id) {
k_interfaces = k_element.k_listLoader._k_dataStore._k_dataStore.data.items;
k_cnt = k_interfaces.length;
k_name = k_newData.name;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = (k_interfaces[k_i]).data;
if (k_item.name === k_name) {
k_newData.id = k_item.id;
break;
}
}
}
k_data = {
interfaceId: k_newData,
interfaces: k_newData.name
};
k_parent.k_updateRow(k_data, k_editInfo.k_rowIndex);
kerio.adm.k_framework.k_enableApplyReset();
}
}
]
},
{
k_columnId: 'prefixIp',
k_caption: k_tr('Prefix', 'routerAdvertisements'),
k_width: 200,

k_renderer: function (k_value, k_data) {
var
k_text = '';
if (k_data.prefix && k_data.prefix.ip) {
k_text = k_data.prefix.ip;
k_data.prefixIp = kerio.waw.shared.k_methods.k_padIpv6AddressWithZeroes(k_data.prefix.ip);
}
return {
k_data: k_text,
k_iconCls: ''
};
},
k_editor: {
k_type: 'k_text',
k_maxLength: 39, k_checkByteLength: true,
k_validator: {
k_functionName: 'k_isIpv6Address',
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv6.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv6Chars,

k_onBlur: function(k_parent, k_element) {
var
k_editInfo = k_parent.k_getEditInfo(),
k_data = k_editInfo.k_rowData,
k_oldPrefix = k_data.prefix,
k_newIp = k_element.k_getValue();
if (!k_element.k_isValid() || '' === k_newIp) {
return;
}
if (k_oldPrefix && k_oldPrefix.ip === k_newIp) {
return; }
k_data = { prefix: {
ip: k_newIp,
prefixLength: k_oldPrefix.prefixLength
},
prefixIp: k_newIp
};
k_parent.k_updateRow(k_data, k_editInfo.k_rowIndex);
kerio.adm.k_framework.k_enableApplyReset();
}
}
},
{
k_columnId: 'prefixLength',
k_caption: k_tr('Prefix Length', 'routerAdvertisements'),
k_width: 200,

k_renderer: function (k_value, k_data) {
var
k_text = '';
if (k_data.prefix && k_data.prefix.prefixLength) {
k_text = k_data.prefix.prefixLength;
k_data.prefixLength = k_data.prefix.prefixLength;
}
return {
k_data: k_text,
k_iconCls: ''
};
},
k_editor: {
k_type: 'k_number',
k_isLabelHidden: true,
k_className: 'prefixLengthEditor',
k_minValue: 1,
k_maxValue: 128,
k_maxLength: 3,
k_checkByteLength: true,

k_onBlur: function(k_parent, k_element) {
var
k_editInfo = k_parent.k_getEditInfo(),
k_data = k_editInfo.k_rowData,
k_oldPrefix = k_data.prefix,
k_newLength = k_element.k_getValue();
if ('' === k_newLength) {
return;
}
if (k_oldPrefix && k_oldPrefix.prefixLength === k_newLength) {
return; }
k_data = { prefix: {
ip: k_oldPrefix.ip,
prefixLength: k_newLength
}
};
k_parent.k_updateRow(k_data, k_editInfo.k_rowIndex);
kerio.adm.k_framework.k_enableApplyReset();
}
}
},
{
k_columnId: 'prefix',
k_isDataOnly: true
}
] }, k_statusbar: k_statusbar,
k_toolbars: {}
}; if (!k_isAuditor) {
k_routerAdvertisementsGridCfg.k_toolbars = {
k_bottom: k_get('k_editorGridToolbar', {
k_toolbarItems: [
k_get('k_editorGridBtnAdd'),
k_get('k_editorGridBtnRemove'),
k_get('k_editorGridBtnDuplicate', { k_editColumn: 'interfaces'}),
'->',
{
k_id: 'k_btnSimpleMode',
k_caption: k_tr('Generate Automatically…', 'routerAdvertisements'),
k_isInSharedMenu: false,
k_onClick: k_switchModeHandler
}
]
})
};
}
k_routerAdvertisementsGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'routerAdvertisementsGrid', k_routerAdvertisementsGridCfg);
k_routerAdvertisementsGrid.k_addReferences({

k_removeItem: function() {
if (this.k_getMainWidget().k_isAdvancedMode) {
this.k_removeSelectedRows();
kerio.adm.k_framework.k_enableApplyReset();
}
},

k_addItem: function(k_newItemIndex) {
if (this.k_isEditing() && !this.k_stopCellEdit()) {
var k_lastEditedCell = this._k_lastEditedCell;
this.k_startCellEdit(k_lastEditedCell.k_rowIndex, k_lastEditedCell.k_columnId);
this.k_getColumnEditor(k_lastEditedCell.k_columnId).k_reset();
this.k_stopCellEdit();
}
this.k_startCellEdit(k_newItemIndex, 'interfaces');
},
k_newItemDefinition: 'k_newRouterAdvertisementsList',
k_trNothing: k_tr('Nothing', 'common')
});
if (!k_isAuditor) {
k_routerAdvertisementsGrid.k_toolbars.k_bottom.k_sharedMenu.k_extWidget.on('beforeshow', function() {
return this.k_getMainWidget().k_isAdvancedMode;
}, k_routerAdvertisementsGrid);
}
k_formCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_isReadOnly: k_isAuditor,
k_items: [
{
k_type: 'k_container',
k_height: 25,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'enabled',
k_isLabelHidden: true,
k_option: k_tr('Enable IPv6 Router Advertisements', 'routerAdvertisements'),

k_onChange: function(k_form, k_checkbox, k_isChecked) {
kerio.adm.k_framework.k_enableApplyReset();
}
}
]
},{
k_id: 'k_fieldsetGrid',
k_type: 'k_fieldset',
k_caption: k_tr('Interfaces', 'routerAdvertisements'),
k_labelWidth: 130,
k_anchor: "0 -30",
k_items: [
{
k_type: 'k_container',
k_anchor: "0 -20", k_content: k_routerAdvertisementsGrid
}
] } ] }; if (!k_isAuditor) {

k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function() {
var
k_form = this.k_parentWidget,
k_routerAdvertisementsGrid = k_form.k_routerAdvertisementsGrid,
k_routerAdvertisementsGridData = k_routerAdvertisementsGrid.k_getData(),
k_validationResults = new kerio.lib._K_ValidationResults(),
k_sendData = [],
k_i, k_cnt, k_item,
k_alertMessage,
k_requests;
k_cnt = k_routerAdvertisementsGridData.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_routerAdvertisementsGridData[k_i];
if (!k_item.interfaceId.id) {
if (!k_validationResults.k_getCount()) { k_validationResults.k_addMethod(k_routerAdvertisementsGrid.k_startCellEdit, [k_i, 'interfaces'], k_routerAdvertisementsGrid);
}
k_validationResults.k_inc(true); }
k_sendData.push({
id: k_item.id,
enabled: k_item.enabled,
interfaceId: k_item.interfaceId,
prefix: k_item.prefix
});
}
if (!k_validationResults.k_isValid(false)) {                k_alertMessage = k_validationResults._k_getMessage();   k_alertMessage.k_callback = function() {                this._k_executionStack.k_execute();                 };                                                      k_alertMessage.k_scope = k_validationResults;
k_alertMessage.k_msg = k_alertMessage.k_message; kerio.lib.k_alert(k_alertMessage);
return false; }
k_requests = [
{
k_jsonRpc: {
method: 'RouterAdvertisements.setConfig',
params: {
config: {
enabled: k_form.k_getItem('enabled').k_getValue()
}
}
}
},
{
k_jsonRpc: {
method: 'RouterAdvertisements.set',
params: {
advertisements: k_sendData
}
}
}
];
kerio.waw.requests.k_sendBatch(
k_requests,
{
k_callback: k_form.k_applyResetCallback
}
);
k_routerAdvertisementsGrid.k_resortRows();
return false; }, 
k_onReset: function(k_toolbar) {
k_toolbar.k_relatedWidget.k_loadData();
}
}; k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
k_formCfg.k_toolbars = {
k_bottom: k_toolbar
};
}
k_form = new kerio.lib.K_Form(k_objectName, k_formCfg);
this.k_addControllers(k_form);
k_form.k_addReferences({
k_isAuditor: k_isAuditor,
k_toolbar: k_toolbar,
k_routerAdvertisementsGrid: k_routerAdvertisementsGrid,
k_enabled: k_form.k_getItem('enabled'),
k_dataStore: {},
k_INDEX_GET_MODE: k_INDEX_GET_MODE,
k_INDEX_GET_LIST: k_INDEX_GET_LIST,
k_INDEX_GET_CONFIG: k_INDEX_GET_CONFIG,
k_isAdvancedMode: false,
k_editors: []
});
return k_form;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function() {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
var
k_WAW_METHODS = kerio.waw.shared.k_methods;
this.k_isInitialLoad = true; k_WAW_METHODS.K_ListLoader({
k_list: 'k_interfacesOutgoingList',
k_select: this.k_routerAdvertisementsGrid.k_getColumnEditor('interfaces'),
k_addNoneOption: false
}).k_sendRequest();
this.k_loadData();
}; 
k_kerioWidget.k_loadData = function() {
var
k_batchRequests = [],
k_shared = kerio.waw.shared,
k_options;
k_batchRequests[this.k_INDEX_GET_MODE] = {
method: 'RouterAdvertisements.getMode'
};
k_batchRequests[this.k_INDEX_GET_LIST] = {
method: 'RouterAdvertisements.get'
};
k_batchRequests[this.k_INDEX_GET_CONFIG] = {
method: 'RouterAdvertisements.getConfig'
};
k_options = {
k_requests: k_batchRequests,
k_scope: this,
k_callback: this.k_loadDataCallback,
k_requestOwner: this
};k_shared.k_methods.k_sendBatch(k_options);
};

k_kerioWidget.k_loadDataCallback = function(k_response, k_success) {
var
k_shared = kerio.waw.shared,
k_routerAdvertisementsGrid = this.k_routerAdvertisementsGrid,
k_toolbar = k_routerAdvertisementsGrid.k_toolbars.k_bottom,
k_statusbar = k_routerAdvertisementsGrid.k_statusbar,
k_batchResult, k_advertisements,
k_isAdvancedMode,
k_config;
if (!k_success || !kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
k_shared.k_methods.k_unmaskMainScreen();
return;
}
k_batchResult = k_response.k_decoded.batchResult;
k_isAdvancedMode = k_shared.k_CONSTANTS.RouterAdvertisementsModeType.RouterAdvertisementsManual === k_batchResult[this.k_INDEX_GET_MODE].mode;
this.k_isAdvancedMode = k_isAdvancedMode;
k_advertisements = k_batchResult[this.k_INDEX_GET_LIST].list;
k_statusbar.k_switchConfig( 0 === k_advertisements.length ? 'k_noInterfaces' : 'k_simpleMode' );
if (!this.k_isAuditor) {
k_toolbar.k_setVisible(k_isAdvancedMode);     }
k_statusbar.k_setVisible(!k_isAdvancedMode);  k_advertisements = k_batchResult[this.k_INDEX_GET_LIST].list;
this.k_routerAdvertisementsGrid.k_setData(k_advertisements);
k_config = k_batchResult[this.k_INDEX_GET_CONFIG].config;
if (k_config && undefined !== k_config.enabled) {
this.k_enabled.k_setValue(k_config.enabled);
}
kerio.adm.k_framework.k_enableApplyReset(false);
this.k_routerAdvertisementsGrid.k_resortRows();
};

k_kerioWidget.k_callbackModeConfirm = function(k_userAnswer) {
if ('yes' !== k_userAnswer) {
return;
}
var
RouterAdvertisementsModeType = kerio.waw.shared.k_CONSTANTS.RouterAdvertisementsModeType;
kerio.waw.shared.k_methods.k_maskMainScreen(this, { k_message: kerio.lib.k_tr('Switching IPv6 Router Advertisements mode…', 'routerAdvertisements'), k_delay: 0});
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'RouterAdvertisements.setMode',
params: {
mode: this.k_isAdvancedMode ? RouterAdvertisementsModeType.RouterAdvertisementsAutomatic : RouterAdvertisementsModeType.RouterAdvertisementsManual
}
},
k_callback: this.k_callbackSwitchConfigMode,
k_scope: this
});
};

k_kerioWidget.k_callbackSwitchConfigMode = function(k_response, k_success) {
if (!k_success || !kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
}
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'ProductInfo.configUpdate'
},
k_callback: this.k_callbackConfigUpdate,
k_scope: this,
k_onError: kerio.waw.shared.k_methods.k_ignoreErrors });
};

k_kerioWidget.k_callbackConfigUpdate = function() {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
this.k_applyParams();
};

k_kerioWidget.k_applyResetCallback = function(k_response, k_success) {
var
k_isError = false,
k_request, k_requestId;
for (k_requestId in k_response) {
k_request = k_response[k_requestId];
if (k_request.errors && 0 < k_request.errors.length) {
k_isError = true;
}
}
if (k_success && !k_isError) {
kerio.adm.k_framework.k_enableApplyReset(false);
if (kerio.adm.k_framework.k_leaveCurrentScreen()) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
} else {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
};}}; 