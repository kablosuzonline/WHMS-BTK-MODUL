

kerio.waw.ui.userGroupList = {
k_translations: {
k_enabled: kerio.lib.k_tr('Enabled', 'common'),
k_disabled: kerio.lib.k_tr('Disabled', 'common'),
k_internal: kerio.lib.k_tr('Internal user database', 'userList'),
k_directoryService: kerio.lib.k_tr('Directory service', 'userList'),
k_firewall: kerio.lib.k_tr('Firewall', 'common'),
k_localDomainName: kerio.lib.k_tr('Local User Database', 'userList'),
k_unlockRule: kerio.lib.k_tr('unlock URL rules', 'userList'),
k_dialRasConnection: kerio.lib.k_tr('control dial-up lines', 'userList'),
k_connectVpn: kerio.lib.k_tr('connect using VPN', 'userList'),
k_connectSslVpn: kerio.lib.k_tr('use Clientless SSL-VPN', 'userList'),
k_useP2p: kerio.lib.k_tr('use P2P networks', 'userList'),
k_viewStats: kerio.lib.k_tr('view statistics', 'userList'),
k_isAuditor: kerio.lib.k_tr('Read only', 'userList'),
k_isAdmin: kerio.lib.k_tr('Full access', 'userList'),
k_additionalRights: kerio.lib.k_tr('additional rights', 'userList'),
k_additionalRightsCapital: kerio.lib.k_tr('Additional rights', 'userList'),
k_noAdditionalRights: kerio.lib.k_tr('No additional rights', 'userList'),
k_rightsFromTemplate: kerio.lib.k_tr('Rights acquired from template:', 'userList'),
k_template: kerio.lib.k_tr('template', 'userList'),
k_userStats: kerio.lib.k_tr('Number of users in this domain: %1.', 'userList', { k_args: ['%1']}), k_2stepConfigured: kerio.lib.k_tr('Configured', 'userList'),
k_2stepNotConfigured: kerio.lib.k_tr('Not configured', 'userList')
},
k_allSpacesRegExp: new RegExp(' ', 'g'),
k_init: function(k_objectName) {
var
k_shared = kerio.waw.shared,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_WAW_DEFINITIONS = k_shared.k_DEFINITIONS,
k_userListIds = k_WAW_DEFINITIONS.k_userListIds,
k_isUserList = (k_userListIds.k_userList === k_objectName),
k_onRemoveItemConfirm,
k_removeItemsCallback,
k_enableUsersRequestCfg,
k_gridCfg,
k_grid,
k_sharedMenuCfg,
k_toolbarItems;
if (kerio.waw.status.k_userList === undefined) {
kerio.waw.status.k_userList = k_WAW_DEFINITIONS.k_get('k_userListStatus');
}

k_onRemoveItemConfirm = function(k_response){
if ('no' === k_response) {
return;
}
var
k_grid = this.k_relatedWidget,
k_removedItemIdList = [],
k_params = {},
k_selectionStatus = k_grid.k_selectionStatus,
k_rows = k_selectionStatus.k_rows,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_selectionStatus.k_selectedRowsCount; k_i < k_cnt; k_i++) {
k_removedItemIdList.push(k_rows[k_i].k_data.id);
}
k_params[k_grid.k_propertyRemovedItemIdList] = k_removedItemIdList;
k_params.domainId = kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE;
k_grid.k_removeRequestCfg.k_jsonRpc.params = k_params;
kerio.waw.requests.k_send(k_grid.k_removeRequestCfg); };

k_removeItemsCallback = function(k_response, k_success, k_params){
kerio.waw.shared.k_methods.k_unmaskMainScreen(this); this.k_reloadData(); if (!kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
return;
}
if (this.k_isUserList) {
kerio.waw.shared.k_methods.k_updateDataStore('k_users');
} else {
kerio.waw.shared.k_methods.k_updateDataStore('k_groups');
}
};
k_gridCfg = {
k_className: (k_isUserList) ? 'userList' : 'groupList',
k_columns: {
k_items: this.k_getColumnItems(
k_isUserList,
this.k_getRenderers(k_isUserList),
this.k_getConverters(k_isUserList),
this.k_getSortTypes()
)
},
k_filters: this.k_getFilters(k_isUserList),
k_toolbars: {
k_bottom: this.k_getBottomToolbar(k_isUserList)
},
k_remoteData: {
k_isAutoLoaded: false,
k_root: 'list',
k_jsonRpc: {
method: (k_isUserList) ? 'Users.get' : 'UserGroups.get'
},
k_timeout: k_shared.k_CONSTANTS.k_TIMEOUT_REQUEST_DOMAIN_CONTROLLER
},
k_statusbar: this.k_getStatusbar(k_isUserList),

k_onLoad: function(k_grid, k_request, k_response) {
var
k_conditions;
k_conditions = k_request.params.query.conditions;
if (k_grid.k_isUserList && (undefined === k_conditions || 0 === k_conditions.length)) {
k_grid.k_numberOfUsers = k_response.totalItems;
}
if (k_response.warnings) {
k_grid.k_checkResponseStatus(k_response.warnings); }
kerio.waw.shared.k_data.k_cache({
k_screen: k_grid,
k_data: ['k_ipAddressGroups'],
k_dialogs: ['userEditor', 'userGroupEditor', 'userTemplateEditor', 'userImportList', 'userImportServer']
});
k_grid.k_preselectRow();
}
}; k_grid = new kerio.adm.k_widgets.K_BasicListDomain(k_objectName, k_gridCfg);
k_enableUsersRequestCfg = {
k_jsonRpc: {
method: 'Users.set',
params: {}
},
k_scope: k_grid,
k_callback: function(k_response) {
if (!kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
return;
}
this.k_reloadData();
}
};
if (k_isUserList && !k_isAuditor) {
k_toolbarItems = k_grid.k_toolbars.k_bottom.k_items;
k_sharedMenuCfg = {
k_items: [
k_toolbarItems.k_btnAdd._k_action,
k_toolbarItems.k_btnEdit._k_action,
k_toolbarItems.k_btnRemove._k_action,
'-',
k_toolbarItems.k_btnReset2StepVerification._k_action,
'-',
k_toolbarItems.k_btnEnable._k_action,
k_toolbarItems.k_btnDisable._k_action,
'-',
k_toolbarItems.k_btnTemplate._k_action,
k_toolbarItems.k_btnImport._k_action
]
};
k_grid.k_sharedMenu = new kerio.lib.K_Menu(k_objectName + '_' + 'k_contextMenu', k_sharedMenuCfg);
k_grid.k_sharedMenu.k_relatedToolbar = k_grid.k_toolbars.k_bottom; k_grid.k_toolbars.k_bottom.k_sharedMenu = k_grid.k_sharedMenu; k_grid.k_createContextMenu(k_grid.k_sharedMenu); }
k_grid.k_addReferences({
k_isUserList: k_isUserList,
k_propertyRemovedItemIdList: (k_isUserList) ? 'userIds' : 'groupIds',
k_localDomainId: k_shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE,
k_storeStatusClean: k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusClean,
k_onRemoveItemConfirm: k_onRemoveItemConfirm,
_k_userListId: k_shared.k_DEFINITIONS.k_userListIds.k_userList,
_k_isScreenActive: true, k_removeRequestCfg: {
k_jsonRpc: {
method: (k_isUserList ? 'Users' : 'UserGroups') + '.' + 'remove',
params: {}
},
k_callback: k_removeItemsCallback,
k_scope: k_grid
},
k_editors: {
k_userEdit: k_userListIds.k_userEdit
},
k_enableUsersRequestCfg: k_enableUsersRequestCfg,
k_initGridData: function() {},
k_domainsDataStore: kerio.waw.shared.k_data.k_getStore('k_domains'),
k_numberOfUsers: 0
});
k_grid.k_toolbars.k_top.k_addReferences({
k_grid: k_grid
});
this.k_addControllers(k_grid);

if (k_isUserList) {
k_grid.k_addReferences({
k_macFilterCondition: {
comparator: k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Like,
fieldName: 'autoLogin',
value: ''
}
});
kerio.waw.k_hacks.k_fixGridOnLoadError(k_grid);
}

k_shared.k_methods.k_userEditorUseTemplate = function(k_dialogContent, k_useTemplate) {
if (kerio.waw.shared.k_CONSTANTS.k_VALUE_UNCHANGED === k_useTemplate) {
k_useTemplate = false;
}
k_dialogContent.k_setDisabledTab(['k_rightsPage', 'k_quotaPage', 'k_preferencesPage'], k_useTemplate);
};
k_WAW_DEFINITIONS.k_userEditorEnableUserCfg = {
k_type: 'k_checkbox',
k_id: 'k_isEnabled',
k_option: kerio.lib.k_tr('Account is enabled', 'userEditor'),
k_width: 200,
k_isLabelHidden: true,
k_isChecked: true
};
k_WAW_DEFINITIONS.k_userEditorUseTemplateCfg = [
{
k_type: 'k_radio',
k_groupId: 'k_domainTemplate',
k_option: kerio.lib.k_tr('This user\'s configuration is defined by the domain template', 'userEditor'),
k_value: k_shared.k_CONSTANTS.k_USER_TEMPLATE.k_USED,
k_isChecked: true,
k_isLabelHidden: true,
k_onChange: function(k_form, k_item, k_value) {
var
k_dialog = k_form.k_dialog;
k_dialog.k_userEditorUseTemplate(k_dialog.k_dialogContent, kerio.waw.shared.k_CONSTANTS.k_USER_TEMPLATE.k_USED === k_value);
}
},
{
k_type: 'k_radio',
k_groupId: 'k_domainTemplate',
k_option: kerio.lib.k_tr('This user has a separate configuration', 'userEditor'),
k_value: k_shared.k_CONSTANTS.k_USER_TEMPLATE.k_NOT_USED,
k_isChecked: false,
k_isLabelHidden: true
}
];return k_grid;
}, 
k_getColumnItems: function(k_isUserList, k_renderers, k_converters, k_sortTypes) {
var
k_tr = kerio.lib.k_tr,
k_columnItems;
if (k_isUserList) {
k_columnItems = [
{k_columnId: 'userName',         k_caption:    k_tr('Username', 'common')                      , k_width: 180  , k_renderer: k_renderers.userName},
{k_columnId: 'fullName',         k_caption:    k_tr('Full Name', 'common')                     , k_width: 180},
{k_columnId: 'description',      k_caption:    k_tr('Description', 'common')                   , k_width: 180},
{k_columnId: 'groups',           k_caption:    k_tr('Groups', 'userList')                      , k_width: 180  , k_renderer: k_renderers.groups},
{k_columnId: 'email',            k_caption:    k_tr('Email', 'common')                         , k_width: 250  ,                                      k_isHidden: true},
{k_columnId: 'enabled',          k_caption:    k_tr('Account Status', 'userList')              , k_width: 130  , k_renderer: k_renderers.enabled,     k_isHidden: true},
{k_columnId: 'authType',         k_caption:    k_tr('Authentication Type', 'userList')         , k_width: 180  , k_renderer: k_renderers.authType,    k_isHidden: true},
{k_columnId: 'vpnAddress',       k_caption:    k_tr('Static VPN Client Address', 'userList')   , k_width: 200  , k_renderer: k_renderers.vpnAddress,  k_isHidden: true},
{k_columnId: 'autoLogin',        k_caption:    k_tr('Automatic Login', 'userList')             , k_width: 250  , k_renderer: k_renderers.autoLogin,   k_isHidden: true},
{
k_columnId: 'rights',
k_caption: k_tr('Rights', 'userList'),
k_width: 250,
k_convert: k_converters.rights,
k_renderer: k_renderers.rights,
k_sortType: k_sortTypes.rights,
k_localSort: true,
k_isHidden: true
},
{k_columnId: 'twoStepVerification',k_caption:  k_tr('2-Step Verification', 'userList')         , k_width: 180  , k_renderer: k_renderers.twoStepVerification, k_isHidden: true},
{k_columnId: 'id',                        k_isDataOnly: true},
{k_columnId: 'credentials',               k_isDataOnly: true},
{k_columnId: 'localEnabled',              k_isDataOnly: true},
{k_columnId: 'adEnabled',                 k_isDataOnly: true},
{k_columnId: 'useTemplate',               k_isDataOnly: true},
{k_columnId: 'data',                      k_isDataOnly: true},
{k_columnId: 'conflictWithLocal',         k_isDataOnly: true},
{k_columnId: 'totpConfigured',            k_isDataOnly: true}
];
}
else {
k_columnItems = [
{k_columnId: 'name',           k_caption:    k_tr('Name', 'common')                  , k_width: 180  , k_renderer: k_renderers.name},
{k_columnId: 'description',    k_caption:    k_tr('Description', 'common')           , k_width: 180},
{
k_columnId: 'rights',
k_caption: k_tr('Rights', 'userList'),
k_width: 250,
k_convert: k_converters.rights,
k_renderer: k_renderers.rights,
k_sortType: k_sortTypes.rights,
k_localSort: true,
k_isHidden: true
},
{k_columnId: 'id',             k_isDataOnly: true},
{k_columnId: 'members',        k_isDataOnly: true}
];
}
return k_columnItems;
},
k_getSortTypes: function() {
return {
rights: function(k_value) {
return k_value._displayValue;
}
};
},

k_getConverters: function(k_isUserList) {
return {
rights: function k_convertRights(k_value, k_rowData) {
var
k_translations = kerio.waw.ui.userGroupList.k_translations,
k_domainsDataStore = kerio.waw.shared.k_data.k_getStore('k_domains'),
k_isLinux = kerio.waw.shared.k_methods.k_isLinux(),
k_allSpacesRegExp = kerio.waw.ui.userGroupList.k_allSpacesRegExp,
k_isAuditor = false,
k_isAdmin = false,
k_dataTooltip = [],
k_isTemplateDefined = false,
k_data = '',
k_rights,
k_right;
if (k_isUserList) {
if (k_rowData.useTemplate) {
k_rights = k_domainsDataStore.k_getDomainTemplateData(kerio.waw.status.k_userList.k_currentDomainId).rights;
k_isTemplateDefined = true;
} else {
k_rights = k_rowData.data.rights;
}
} else {
k_rights = k_rowData.rights;
}
for (k_right in k_rights) {
if (false === k_rights[k_right]) {
continue;
}
switch(k_right) {
case 'writeConfig':
k_isAdmin = true;
break;
case 'readConfig':
k_isAuditor = true;
break;
case 'unlockRule':
k_dataTooltip.push(k_translations.k_unlockRule);
break;
case 'dialRasConnection':
k_dataTooltip.push(k_translations.k_dialRasConnection);
break;
case 'connectVpn':
k_dataTooltip.push(k_translations.k_connectVpn);
break;
case 'connectSslVpn':
if (!k_isLinux) { k_dataTooltip.push(k_translations.k_connectSslVpn);
}
break;
case 'useP2p':
k_dataTooltip.push(k_translations.k_useP2p);
break;
case 'viewStats':
k_dataTooltip.push(k_translations.k_viewStats);
break;
}
}
if (k_isAuditor) {
k_data = k_translations.k_isAuditor;
}
if(k_isAdmin) {
k_data = k_translations.k_isAdmin;
}
if (k_dataTooltip.length !== 0) {
if (k_data !== '') {
k_data = k_data + ', ' + k_translations.k_additionalRights;
} else {
k_data = k_translations.k_additionalRightsCapital;
}
if (k_isTemplateDefined) {
k_dataTooltip.unshift(k_translations.k_rightsFromTemplate);
} else {
k_dataTooltip[0] = ' - ' + k_dataTooltip[0];
}
k_dataTooltip = k_dataTooltip.join('<br>' + ' - ');
k_dataTooltip = k_dataTooltip.replace(k_allSpacesRegExp, '&nbsp;'); } else {
k_dataTooltip = k_translations.k_noAdditionalRights;
}
if (k_isTemplateDefined) {
k_data = k_data + ' (' + k_translations.k_template + ')';
}
if (!k_value)
k_value = {};
k_value._displayValue = k_data;
k_value._tooltipValue = k_dataTooltip;
return k_value;
} }
},

k_getRenderers: function(k_isUserList) {
var

k_renderRights = function(k_value, k_rowData) {
var k_converter = kerio.waw.ui.userGroupList.k_getConverters(k_isUserList);
var k_convertedValue = k_converter.rights(k_value, k_rowData);
return kerio.waw.k_hacks.k_renderHtmlWithTooltip({
k_data: k_convertedValue._displayValue,
k_dataTooltip: k_convertedValue._tooltipValue,
k_isSecure: true
});
}; if (!k_isUserList) {
return {
name: kerio.waw.shared.k_methods.k_renderers.k_renderUserGroupName,
rights: k_renderRights
};}
return {
userName: kerio.waw.shared.k_methods.k_renderers.k_renderUserName,

groups: function(k_value) {
var
k_groupNameList,
k_i, k_cnt;
if (!k_value || Array !== k_value.constructor || (0 === k_value.length)) {
return {
k_data: ''
};
}
k_groupNameList = [];
for (k_i = 0, k_cnt = k_value.length; k_i < k_cnt; k_i++) {
k_groupNameList.push(k_value[k_i].name);
}
return {
k_data: k_groupNameList.join(', ')
};
},
enabled: function(k_value, k_data) {
var
k_isUserEnabled = k_data.localEnabled && k_data.adEnabled,
k_trCache = kerio.waw.ui.userGroupList.k_translations;
return {
k_iconCls: 'userStatus ' + (k_isUserEnabled ? 'enabled' : 'disabled'),
k_data: (k_isUserEnabled) ? k_trCache.k_enabled : k_trCache.k_disabled
};
},
authType: function(k_value) {
var k_trCache = kerio.waw.ui.userGroupList.k_translations;
return {
k_data: (kerio.waw.shared.k_CONSTANTS.AuthType.Internal === k_value)
? k_trCache.k_internal
: k_trCache.k_directoryService
};
},
vpnAddress: function(k_value) {
var k_isEnabled = (k_value && k_value.enabled);
return {
k_data: (k_isEnabled) ? k_value.value : ''
};
},
autoLogin: function(k_value) {
var
k_formatMacAddress = kerio.waw.shared.k_methods.k_formatMacAddress,
k_loginAddressList,
k_address,
k_addresses,
k_i, k_cnt;
if (!k_value) {
return { k_data: '' };
}
k_loginAddressList = [];
k_addresses = k_value.addresses;
if (k_addresses && k_addresses.enabled) {
k_addresses = k_addresses.value;
for (k_i = 0, k_cnt = k_addresses.length; k_i < k_cnt; k_i++) {
k_loginAddressList.push(k_addresses[k_i]);
}
}
k_address = k_value.addressGroup;
if (k_address && k_address.enabled) {
k_loginAddressList.push('[' + k_address.name + ']');
}
k_addresses = k_value.macAddresses;
if (k_addresses && k_addresses.enabled) {
k_addresses = k_addresses.value;
for (k_i = 0, k_cnt = k_addresses.length; k_i < k_cnt; k_i++) {
k_loginAddressList.push(k_formatMacAddress(k_addresses[k_i]));
}
}
return {
k_data: k_loginAddressList.join(', ')
};
},rights: k_renderRights,
twoStepVerification: function(k_value, k_data) {
var k_trCache = kerio.waw.ui.userGroupList.k_translations;
return {
k_data: k_data.totpConfigured ? k_trCache.k_2stepConfigured : k_trCache.k_2stepNotConfigured
};
}
};},
k_getBottomToolbar: function(k_isUserList) {
var
k_userListIds = kerio.waw.shared.k_DEFINITIONS.k_userListIds,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_tr = kerio.lib.k_tr,
k_items = [];
k_items = [
{
k_type: kerio.waw.shared.k_methods.k_isAuditor() ? 'K_BTN_VIEW' : 'K_GRID_DEFAULT' ,

k_onRemove: function(k_toolbar){
if (!kerio.waw.status.k_userList.k_isCurrentDomainLocal) {
return;
}
var
k_grid = k_toolbar.k_getMainWidget(),
k_tr = kerio.lib.k_tr,
k_gridId = k_grid.k_id,
k_selectionStatus,
k_confirmMsg,
k_rows;
k_selectionStatus = k_grid.k_selectionStatus;
k_rows = k_selectionStatus.k_rows;
if (k_gridId === k_grid._k_userListId) {
if (!k_grid.k_confirmUserAction('k_delete')) {
return;
}
}
if (k_selectionStatus.k_selectedRowsCount === 1) {
if (k_gridId === k_grid._k_userListId) {
k_confirmMsg = k_tr('Are you sure you want to remove user "%1"?', 'userList', {
k_args: [k_rows[0].k_data.credentials.userName]
});
}
else {
k_confirmMsg = k_tr('Are you sure you want to remove group "%1"?', 'groupList', {
k_args: [k_rows[0].k_data.name]
});
}
}
else {
if (k_gridId === k_grid._k_userListId) {
k_confirmMsg = k_tr('Are you sure you want to remove the selected users?', 'userList');
}
else {
k_confirmMsg = k_tr('Are you sure you want to remove selected groups?', 'groupList');
}
}
kerio.lib.k_confirm(k_tr('Confirm Action', 'common'), k_confirmMsg, k_grid.k_onRemoveItemConfirm, this);
} }
];
if (k_isUserList) {
k_items.push({
k_id: 'k_btnMoreActions',
k_caption: k_tr('More Actions', 'common'),
k_isMenuButton: true,
k_items: [
{
k_id: 'k_btnReset2StepVerification',
k_caption: k_tr('Disable 2-step verification', 'userGroupList'),
k_isDisabled: true,
k_onClick: this.k_reset2StepVerification
},
{
k_id: 'k_btnEnable',
k_caption: k_tr('Enable users', 'userGroupList'),
k_isDisabled: true,
k_onClick: this.k_enableUsersHandler
},
{
k_id: 'k_btnDisable',
k_caption: k_tr('Disable users', 'userGroupList'),
k_isDisabled: true,
k_onClick: this.k_enableUsersHandler
}
]
});
k_items.push('->');
k_items.push(
{
k_id: 'k_btnTemplate',
k_caption: kerio.lib.k_tr('Template…', 'userList'),

k_onClick: function(k_toolbar){
var k_relatedGrid = k_toolbar.k_relatedWidget;
kerio.lib.k_ui.k_showDialog({
k_sourceName: kerio.waw.shared.k_DEFINITIONS.k_userListIds.k_userTemplateEditor,
k_params: {	k_domainId: kerio.waw.status.k_userList.k_currentDomainId,
k_relatedGrid: k_relatedGrid}
});
} }
);
if (!k_isAuditor) {
k_items.push(
{
k_id: 'k_btnImport',
k_caption: kerio.lib.k_tr('Import…', 'common'),

k_onClick: function(k_toolbar){
kerio.lib.k_ui.k_showDialog({
k_sourceName: kerio.waw.shared.k_DEFINITIONS.k_userListIds.k_userImportServer,
k_params: {
k_parentGrid: k_toolbar.k_relatedWidget
}
});
} }
);
}
}
return {
k_dialogs: {
k_sourceName: (k_isUserList) ? 'userEditor' : 'userGroupEditor',
k_objectName: {
k_btnAdd: (k_isUserList) ? k_userListIds.k_userAdd  : k_userListIds.k_userGroupAdd,
k_btnEdit: (k_isUserList) ? k_userListIds.k_userEdit : k_userListIds.k_userGroupEdit,
k_btnView: (k_isUserList) ? k_userListIds.k_userView : k_userListIds.k_userGroupView
},
k_onBeforeShow: function(k_toolbar, k_button) {
var
k_dialogs = k_toolbar.k_dialogs,
k_selectionStatus = this.k_selectionStatus,
k_selectedRows = k_selectionStatus.k_selectedRowsCount,
k_userListIds = kerio.waw.shared.k_DEFINITIONS.k_userListIds,
k_isEditMode = 'k_btnEdit' === k_button.k_name || 'k_btnView' === k_button.k_name;
k_dialogs.k_additionalParams = {
k_selectionStatus: k_selectionStatus
};
if (k_isEditMode) {
k_dialogs.k_additionalParams.k_data = k_selectionStatus.k_rows[0].k_data;}
if (!this.k_isUserList) {
return;
}
if (!k_isEditMode) {
k_dialogs.k_sourceName = k_userListIds.k_userEditor;
k_dialogs.k_objectName.k_btnEdit = k_userListIds.k_userAdd;
return;
}
if (k_selectedRows > 1 ) {
k_dialogs.k_sourceName = k_userListIds.k_userMultiEditor;
k_dialogs.k_objectName.k_btnEdit = k_userListIds.k_userMultiEdit;
} else {
k_dialogs.k_sourceName = k_userListIds.k_userEditor;
k_dialogs.k_objectName.k_btnEdit = k_userListIds.k_userEdit;
}
}},
k_items: k_items,

k_update: function(k_sender, k_event) {
var
k_selectionStatus,
k_selectedRowsCount,
k_selectedMany,
k_selectedOne,
k_selectedAny;
if (kerio.waw.shared.k_methods.k_isAuditor()) {
return;
}
if (k_sender instanceof kerio.lib.K_Grid) {
k_selectionStatus = k_sender.k_selectionStatus;
k_selectedRowsCount = k_selectionStatus.k_selectedRowsCount;
k_selectedMany = k_selectedRowsCount > 1;
k_selectedAny = k_selectedRowsCount > 0;
k_selectedOne = k_selectedRowsCount === 1;
this.k_enableItem('k_btnRemove', (kerio.waw.status.k_userList.k_isCurrentDomainLocal && k_selectedAny));
if (k_sender.k_isUserList) {
this.k_enableItem('k_btnEdit', k_selectedAny);
this.k_sharedMenu.k_enableItem('k_btnEnable', k_selectedAny);
this.k_sharedMenu.k_enableItem('k_btnDisable', k_selectedAny);
this.k_sharedMenu.k_enableItem('k_btnReset2StepVerification', k_selectedOne && k_selectionStatus.k_rows[0].k_data.totpConfigured);
}
}
}};
},
k_enableUsersHandler: function(k_menu, k_menuItem) {
var
k_i,
k_grid = this.k_parentWidget,
k_rows,
k_ids = [],
k_data = {localEnabled: true};
if(0 === k_grid.k_selectionStatus.k_selectedRowsCount) {
return;
}
k_rows = k_grid.k_selectionStatus.k_rows;
if ('k_btnDisable' === k_menuItem.k_name) {
if (!k_grid.k_confirmUserAction('k_disable')) {
return;
}
k_data.localEnabled = false;
}
for (k_i = 0; k_i < k_rows.length; k_i++) {
k_ids.push(k_rows[k_i].k_data.id);
}
k_grid.k_enableUsersRequestCfg.k_jsonRpc.params = {
userIds: k_ids,
details: k_data,
domainId: kerio.waw.status.k_userList.k_currentDomainId
};
kerio.waw.requests.k_send(k_grid.k_enableUsersRequestCfg);
},

k_reset2StepVerification: function(k_toolbar, k_button) {
var
k_userListStatus = kerio.waw.status.k_userList,
k_grid = k_toolbar.k_relatedWidget,
k_rowData = k_toolbar.k_relatedWidget.k_selectionStatus.k_rows[0].k_data;
k_rowData.totpConfigured = false;
kerio.waw.requests.k_send({
k_jsonRpc: {
method: 'Users.set',
params: {
userIds: [ k_rowData.id ],
domainId: k_userListStatus.k_currentDomainId,
details: k_rowData
}
},
k_scope: k_grid,
k_callback: function(k_response, k_success) {
if (k_success && k_response.k_isOk) {
this.k_reloadData();
}
}
});
},
k_getFilters: function(k_isUserList) {
var
k_shared = kerio.waw.shared,
k_tr = kerio.lib.k_tr,
k_domainsDataStore,
k_filters;
k_shared.k_data.k_get('k_domains');
k_domainsDataStore = k_shared.k_data.k_getStore('k_domains');
k_filters = {
k_combobox: {
k_caption: k_tr('Domain:', 'userGroupList'),
k_dataStore: k_domainsDataStore,
k_gridRequestParamName: 'domainId',

k_onChange: function(k_form, k_item, k_value) {
var
k_userListStatus = kerio.waw.status.k_userList,
k_toolbar = this.k_parentWidget,
k_domainId = this.k_getValue(),
k_checkbox;
k_userListStatus.k_isCurrentDomainLocal = (k_domainId === this.k_parentWidget.k_grid.k_localDomainId);
k_userListStatus.k_currentDomainId = k_domainId;
k_toolbar.k_grid.k_toolbars.k_bottom.k_enableItem(['k_btnAdd', 'k_btnImport'], k_userListStatus.k_isCurrentDomainLocal);
if (this.k_parentWidget.k_grid.k_isUserList) {
k_checkbox = k_toolbar.k_getItem('k_filterCheckbox');
if (k_value === kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE) {
k_checkbox.k_conditions = [
{
k_firstOperand: 'localEnabled',
k_secondOperand: '1'
}
];
} else {
k_checkbox.k_conditions = [
{
k_firstOperand: 'localEnabled',
k_secondOperand: '1'
},
{
k_firstOperand: 'adEnabled',
k_secondOperand: '1'
}
];
}
}
}
},
k_search: {
k_caption: k_tr('Filter:', 'userGroupList'),
k_searchBy: ['QUICKSEARCH'],
k_combining: k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_And
}
};
if (k_isUserList) {
k_filters.k_onBeforeFilterChange = k_shared.k_methods.k_onBeforeFilterForMacAddresses;
k_filters.k_checkbox = {
k_option: k_tr('Hide disabled user accounts', 'userGroupList'),
k_isChecked: kerio.waw.status.k_userSettings.k_get('userList.hideDisabled', false),k_conditions: {
k_firstOperand: 'localEnabled'
},

k_onChange: function(k_toolbar, k_item, k_value) {
kerio.waw.status.k_userSettings.k_set('userList.hideDisabled', k_value);}
};
}
return k_filters;
},
k_getStatusbar: function(k_isUserList) {
var
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_tr = kerio.lib.k_tr,
k_statusbarCfg;
if (!k_isUserList) {
return undefined;
}
k_statusbarCfg = {
k_className: 'userList',
k_isHidden: true,
k_configurations: {
k_default: {
k_text: '',
k_iconCls: 'userMessage info'
},
k_inactiveUser: {
k_text: k_tr('Some user accounts are not functional.', 'userGroupList'), k_iconCls: 'userMessage warning',
k_link: k_isAuditor ? undefined : {
k_text: k_tr('Click here for details.', 'common'),
k_onClick: function(k_statusbar) {
var
k_grid = this.k_relatedWidget,
k_tr = kerio.lib.k_tr;
kerio.lib.k_confirm(
k_tr('Directory service authentication problem', 'userGroupList'),
k_tr('Some user accounts are not functional.', 'userGroupList') + ' ' + k_tr('Authentication in some of the directory services is not active.', 'userGroupList')
+ '<br><br><b>'
+ k_tr('Do you want to go to %1 to configure directory services?', 'userGroupList', {
k_args: [ kerio.waw.shared.k_DEFINITIONS.k_get('k_MENU_TREE_NODES.domainsAuthenticationList') ]
})
+ '</b>',
k_grid.k_gotoDomains,
k_grid
);
}
}
},
k_conflictingUser: {
k_text: k_tr('Some user accounts are in conflict.', 'userGroupList'),
k_iconCls: 'userMessage info',
k_link: {
k_text: (k_isAuditor)
? k_tr('Click here for details.', 'common')
: k_tr('Click here to solve it.', 'common'),

k_onClick: (k_isAuditor) ? function() {
var k_tr = kerio.lib.k_tr;
kerio.lib.k_alert({
k_title: k_tr('Some user accounts are in conflict', 'userGroupList'),
k_msg:   k_tr('Some user names are in conflict with users in the local user database. Unless such users specify domain name within their login, they are logged in as a local database users. This behavior can be undesirable. When conflicts are solved, the user account is removed from the local database and its settings are merged with the settings of the account from this domain.', 'userList')
+ '<br><br><b>'
+ k_tr('Please ask an administrator to solve the conflicts.', 'userList')
+'</b>',
k_icon: 'info'
}); }
: function() {
var
k_grid = this.k_relatedWidget,
k_tr = kerio.lib.k_tr;
kerio.lib.k_confirm(
k_tr('Some user accounts are in conflict', 'userGroupList'),
k_tr('Some user names are in conflict with users in the local user database. Unless such users specify domain name within their login, they are logged in as a local database users. This behavior can be undesirable. When conflicts are solved, the user account is removed from the local database and its settings are merged with the settings of the account from this domain.', 'userList')
+ '<br><br><b>'
+ k_tr('Do you want to solve all conflicts now?', 'userList')
+'</b>',
k_grid.k_convertUsers,
k_grid
); }
}
}
},
k_defaultConfig: 'k_default'
};
return new kerio.lib.K_Statusbar(kerio.waw.shared.k_DEFINITIONS.k_userListIds.k_userList + '_' + 'k_statusbar', k_statusbarCfg);
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function () {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
var
k_userListStatus = kerio.waw.status.k_userList,
k_sharedData = kerio.waw.shared.k_data,
k_domainsDataStore = kerio.waw.shared.k_data.k_getStore('k_domains');
this._k_isScreenActive = true; k_sharedData.k_get('k_domains');
if (this.k_isUserList) {
k_sharedData.k_get('k_ipAddressGroups');
}
if (k_userListStatus.k_isCurrentDomainLocal) {
if (this.k_isUserList) {
k_sharedData.k_get('k_domains');
k_sharedData.k_get('k_groups');
k_sharedData.k_get('k_ipAddressGroups');
k_sharedData.k_get('k_vpnServer');
} else {
k_sharedData.k_get('k_users');
}
}
if (!k_domainsDataStore.k_isLoaded()) {
k_sharedData.k_registerObserver(
k_domainsDataStore,
this.k_initGridData,
this
);
return;
}
this.k_initGridData();
}; 
k_kerioWidget.k_initGridData = function() {
if (this._k_isScreenActive) {
this.k_syncData();
this.k_reloadData();
}
};

k_kerioWidget.k_preselectRow = function() {
var
k_preselectId = kerio.waw.status.k_currentScreen.k_getSwitchPageParam('k_userId'),
k_row;
if (k_preselectId) {
k_row = this.k_findRow('id', k_preselectId);
this.k_selectRows(k_row);
}
};

k_kerioWidget.k_checkResponseStatus = function(k_warnings) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_WARNINGS = k_CONSTANTS.k_USER_LIST_WARNINGS,
k_statusbar = this.k_statusbar,
k_warningCode;
this.k_setUserStatistics(); if (!k_warnings || Array !== k_warnings.constructor) {
if (!k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.finalVersion) {
kerio.lib.k_reportError('Invalid response from server, expected list of warnings', 'userGroupList', 'k_checkDomainStatus');
}
return;
}
if (0 === k_warnings.length) { return;
}
k_warningCode = k_warnings[0].code; switch (k_warningCode) {
case k_WARNINGS.k_AD_DISABLED_ID:
k_statusbar.k_switchConfig('k_inactiveUser'); break;
case k_WARNINGS.k_USER_COLLISION_ID:
k_statusbar.k_switchConfig('k_conflictingUser'); break;
default:
kerio.lib.k_reportError('Unsupported server warning: ' + k_warnings[0].message, 'userGroupList', 'k_checkDomainStatus');
}
}; 
k_kerioWidget.k_gotoDomains = function (k_response) {
if ('no' === k_response) {
return;
}
kerio.waw.status.k_currentScreen.k_gotoNode('domainsAndUserLogin', 'k_adDomainForm'); }; 
k_kerioWidget.k_convertUsers = function (k_response) {
var
k_requestCfg;
if ('no' === k_response) {
return;
}
kerio.waw.shared.k_methods.k_maskMainScreen(undefined, {
k_message: kerio.lib.k_tr('Merging local users into this domain…', 'userGroupList')
});
k_requestCfg = {
k_jsonRpc: {
method: 'Users.convertLocalUsers',
params: {
domainId: kerio.waw.status.k_userList.k_currentDomainId
}
},
k_callback: function(k_response, k_success) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
if (k_success) {
kerio.waw.shared.k_methods.k_updateDataStore('k_users', {k_domainId: this.k_localDomainId});
this.k_reloadData();
}
},
k_scope: this
};
kerio.waw.requests.k_sendBatch(k_requestCfg);
}; 
k_kerioWidget.k_checkSelectedUsers = function(k_selectionStatus) {
var
k_loggedUser,
k_indexOfDomain,
k_isLocalUser,
k_i, k_cnt,
k_isLinux = kerio.waw.shared.k_methods.k_isLinux(),
k_isRootAdmin = false,
k_isCurrentUserSelected = false,
k_rows = k_selectionStatus.k_rows;
k_loggedUser = kerio.waw.status.k_userSettings.k_getDomainName();
k_indexOfDomain = k_loggedUser.indexOf('@localhost');
k_isLocalUser = kerio.waw.status.k_userList.k_isCurrentDomainLocal;k_loggedUser = k_loggedUser.substring(0, k_indexOfDomain);
for (k_i = 0, k_cnt = k_selectionStatus.k_selectedRowsCount; k_i < k_cnt; k_i++) {
if (k_rows[k_i].k_data.credentials.userName === k_loggedUser) {
k_isCurrentUserSelected = true;
break;
}
if (k_isLocalUser && k_isLinux && 'admin' === k_rows[k_i].k_data.credentials.userName.toLowerCase()) {
k_isRootAdmin = k_rows[k_i].k_data.credentials.userName;
}
}
return {
k_isLocalUser: k_isLocalUser,
k_isRootAdmin: k_isRootAdmin,
k_isCurrentUserSelected: k_isCurrentUserSelected
};
};
k_kerioWidget.k_confirmUserAction = function(k_type) {
var
k_selectedUsers,
k_tr = kerio.lib.k_tr;
k_selectedUsers = this.k_checkSelectedUsers(this.k_selectionStatus);
if (!k_selectedUsers.k_isLocalUser && 'k_delete' === k_type) {return;
}
if ('k_delete' === k_type) {
if (k_selectedUsers.k_isCurrentUserSelected) {
kerio.lib.k_alert(
k_tr('Delete User', 'userList'),
k_tr('You cannot remove the user whose account you are currently using.', 'userList')
);
return false;
}
if (k_selectedUsers.k_isRootAdmin) {
kerio.lib.k_alert(
k_tr('Delete User', 'userList'),
k_tr('You cannot remove the user "%1".', 'userList', {k_args: [k_selectedUsers.k_isRootAdmin], k_plurality: 1})
);
return false;
}
}
if ('k_disable' === k_type) {
if (k_selectedUsers.k_isCurrentUserSelected) {
kerio.lib.k_alert(
k_tr('Disable User', 'userList'),
k_tr('You cannot disable the user whose account you are currently using.', 'userList')
);
return false;
}
if (k_selectedUsers.k_isRootAdmin) {
kerio.lib.k_alert(
k_tr('Disable User', 'userList'),
k_tr('You cannot disable user "%1".', 'userList', {k_args: [k_selectedUsers.k_isRootAdmin], k_plurality: 1})
);
return false;
}
}
return true;
};
k_kerioWidget.k_onDeactivate = function() {
this._k_isScreenActive = false;
};
if (k_kerioWidget.k_isUserList) {

k_kerioWidget.k_setUserStatistics = function() {
var
k_statusbar = this.k_statusbar,
k_translations = kerio.waw.ui.userGroupList.k_translations;
k_statusbar.k_switchConfig('k_default'); k_statusbar.k_setText(k_translations.k_userStats.replace('%1', this.k_numberOfUsers));
};

k_kerioWidget.k_showUserStatistics = function() {
var k_translations = kerio.waw.ui.userGroupList.k_translations;
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Users', 'menuTree'),
k_msg: k_translations.k_userStats.replace('%1', this.k_numberOfUsers),
k_icon: 'info'
});
};

k_kerioWidget.k_onLoadError = function() {
this.k_numberOfUsers = 0;
this.k_setUserStatistics();
}; } }}; 