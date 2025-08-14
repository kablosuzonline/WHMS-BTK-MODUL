

kerio.waw.ui.dhcpServerList = {

k_init: function(k_objectName) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_WEB_CONSTANTS = k_WAW_CONSTANTS.kerio_web_SharedConstants,
k_methods = kerio.waw.shared.k_methods,
k_INDEX_GET_MODE = 0,
k_INDEX_GET_CONFIG = 1,
k_INDEX_GET_SCOPES = 2,
k_INDEX_GET_LEASES = 3,
k_INDEX_GET_INTERFACES = 4,
k_isAuditor = k_methods.k_isAuditor(),
k_tr = kerio.lib.k_tr,
k_localNamespace,
k_statusbar, k_statusBarCfg,
k_scopesGridCfg,
k_leasesGridCfg,
k_openScopeEditor,
k_openReservationEditor,
k_scopesGrid,
k_selectedScopeElement,
k_leasesGrid,
k_leasesFilterQuery,
k_getLeases,
k_reloadDeclinedScopes,
k_deleteLeases,
k_formCfg,
k_form,
k_toolbarCfg,
k_toolbarItems,
k_toolbar,
k_batchRequests,
k_switchModeLink,
k_switchModeHandler;
k_localNamespace = k_objectName + '_';

k_openScopeEditor = function(k_sender, k_item) {
var
k_id = k_item.k_name,
k_scopesGrid = kerio.waw.shared.k_methods.k_findGrid(k_sender, true),
k_objectName = 'dhcpScopeEditorAdd',
k_params = {
k_relatedGrid: k_scopesGrid
},
k_dialogParams;
switch (k_id) {
case 'k_btnAddMulti':
kerio.lib.k_reportError('This handler cannot be used for menu button.', 'dhcpServerList', 'k_openScopeEditor');
return;
case 'k_btnManual':case 'k_btnAdd':
break;
case 'k_btnView':case 'k_btnEdit':
if (0 === k_scopesGrid.k_selectionStatus.k_selectedRowsCount) {
return;
}
k_objectName = ('k_btnEdit' === k_id ? 'dhcpScopeEditorEdit' : 'dhcpScopeEditorView');
k_params.k_data = k_scopesGrid.k_selectionStatus.k_rows[0].k_data;
break;
default:
k_params.k_interfaceId = k_id;
}k_dialogParams = {
k_sourceName: 'dhcpScopeEditor',
k_objectName: k_objectName,
k_params: k_params
};
kerio.lib.k_ui.k_showDialog(k_dialogParams);
};
k_openReservationEditor = function(k_sender, k_item) {
var
k_eventData = kerio.waw.shared.k_methods.k_detectGridEditor.apply(this, arguments),
k_grid = k_eventData.k_grid,
k_isAuditor = k_grid.k_parentForm.k_isAuditor,
k_data = k_eventData.k_rowData,
k_isLease = (k_data.type === k_grid.DhcpLeaseType.DhcpTypeLease),
k_isAdvancedMode = k_grid.k_parentForm.k_isAdvancedMode,
k_sourceName = 'dhcpReservationEditor',
k_sendData = true,
k_scopeData = false,
k_isEdit = true,
k_scopesGridSelection,
k_objectName,
k_scope,
k_cnt, k_i;
switch (k_eventData.k_eventId) {
case 'k_btnView':
if (k_isLease) {
k_objectName = k_sourceName + 'ViewLease';
}
else {
k_objectName = k_sourceName + 'ViewReservation';
}
break;
case 'k_btnEdit':
if (k_isLease) {
k_objectName = k_sourceName + 'Add';
k_isEdit = false;
}
else {
k_objectName = k_sourceName + 'Edit';
}
break;
case 'k_btnAdd':
case 'k_btnAddEmpty':
k_sendData = false; case 'k_btnReserveLease': k_objectName = k_sourceName + 'Add';
k_isEdit = false;
break;
case 'k_onEnter': case 'k_onDblClick':
if (k_data.isRas) { return;
}
if (k_isAuditor) {
if (k_isLease) {
k_objectName = k_sourceName + 'ViewLease';
}
else {
k_objectName = k_sourceName + 'ViewReservation';
}
}
else {
k_objectName = k_sourceName + (k_isLease ? 'Add' : 'Edit');
}
break;
default:
kerio.lib.k_reportError('Internal error: Unsupported usage of this method.', 'dhcpServerList', 'k_openReservationEditor');
}
if (!k_isAdvancedMode) {
k_objectName += 'Simple';
}
k_scopesGridSelection = k_grid.k_scopesGrid.k_selectionStatus;
if (k_isEdit) {
k_cnt = k_scopesGridSelection.k_selectedRowsCount;
for(k_i = 0; k_i < k_cnt; k_i++) {
k_scope = k_scopesGridSelection.k_rows[k_i];
if (k_data.scopeId === k_scope.k_data.id) {
k_scopeData = k_scope;
}
}
}
else {
k_scopeData = k_scopesGridSelection.k_rows[0];
}
if (false === k_scopeData) {
kerio.lib.k_reportError('Internal error: Tried to add/edit lease, for which is not selected the scope.', 'dhcpServerList', 'k_openReservationEditor');
return;
}
kerio.lib.k_ui.k_showDialog(
{
k_sourceName: k_sourceName,
k_objectName: k_objectName,
k_params: {
k_relatedGrid: k_grid,
k_scopeData:   kerio.lib.k_cloneObject(k_scopeData.k_data), k_data:       (k_sendData ? k_data : {}),
k_isLease:     k_isLease,
k_scopesList: k_grid.k_scopesGrid.k_getData()
}
}
);
};
k_switchModeHandler = function(k_statusbar){
k_statusbar.k_parentWidget.k_parentForm.k_onClickSwitchConfigMode();
};
if (!k_isAuditor) {
k_switchModeLink = {
k_text: k_tr('Click to configure scopes manually', 'dhcpServerList'),
k_onClick: k_switchModeHandler
};
}
k_statusBarCfg = {
k_isHidden: true, k_className: 'dhcpStatusBar',
k_configurations: {
k_default: {
k_text: ''
},
k_simpleMode: {
k_text: k_tr('The DHCP scopes are generated based on active interfaces in the Trusted/Local Interfaces, Guest Interfaces and Other Interfaces groups.', 'dhcpServerList'),
k_link: k_switchModeLink
},
k_noTrustedIface: {
k_text: k_tr('There are no active interfaces in the Trusted/Local Interfaces, Guest Interfaces and Other Interfaces groups.', 'dhcpServerList'),
k_iconCls: 'dhcpMessage warning',
k_link: k_switchModeLink
}
},
k_defaultConfig: 'k_default'
};
k_statusbar = new kerio.lib.K_Statusbar(k_localNamespace + 'k_statusbar', k_statusBarCfg);
k_scopesGridCfg = {
k_isReadOnly: k_isAuditor,
k_statusbar: k_statusbar,
k_selectionMode: 'k_multi',
k_columns: {
k_sorting: {
k_columnId: 'name'
},
k_items: [
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'status',
k_isDataOnly: true
},
{
k_columnId: 'enabled',
k_isDataOnly: true
},
{
k_columnId: 'ipStart',
k_isDataOnly: true
},
{
k_columnId: 'ipEnd',
k_isDataOnly: true
},
{
k_columnId: 'ipMask',
k_isDataOnly: true
},
{
k_columnId: 'exclusions',
k_isDataOnly: true
},
{
k_columnId: 'options',
k_isDataOnly: true
},
{
k_columnId: 'name',
k_caption: k_tr('Name', 'common'),
k_width: 250,

k_renderer: function(k_value, k_data) {
var
k_constStoreStatus = this.kerio_web_SharedConstants,
k_iconClass = 'dhcpScopeIcon';
switch (k_data.status) {
case k_constStoreStatus.kerio_web_StoreStatusNew:
k_iconClass += ' added';
break;
case k_constStoreStatus.kerio_web_StoreStatusModified:
k_iconClass += ' modified';
break;
}
return {
k_iconCls: k_iconClass,
k_data: k_value
};
},
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'enabled',

k_onChange: function(k_grid, k_value, k_data){
kerio.waw.requests.k_sendBatch(
{
k_jsonRpc: {
method: 'Dhcp.set',
params: {scopeIds: [k_data.id], details: k_data}
}
},
{	k_groupUserClicks: true, k_mask: false,           k_requestOwner: null     }
);
k_data.status = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusModified;
k_grid.k_updateRow(k_data);
kerio.adm.k_framework.k_enableApplyReset();
k_grid.k_lastSelectedScope = k_data;
k_grid.k_selectRows(k_grid.k_findRow('id', k_data.id));
}
}
},
{
k_columnId: 'range',
k_isHidden: true,
k_isKeptHidden: true,

k_renderer: function (k_value, k_data) {
k_data.rangeRendered = this.k_ipToNumber(k_data.ipStart); return {
k_data: ''
};
}
},
{
k_columnId: 'rangeRendered',
k_caption: k_tr('Range', 'dhcpServerList'),

k_renderer: function(k_value, k_data) {
return {
k_data: kerio.lib.k_htmlEncode(k_data.ipStart + ' - ' + k_data.ipEnd)
};
}
},
{
k_columnId: '_totalAllocatedAddr',
k_caption: k_tr('Allocated', 'dhcpServerList'),
k_renderer: function(k_value, k_data) {
return {
k_data: k_tr('%1 of %2', 'dhcpServerList', {
k_args: [
k_data._totalAllocatedAddr,
k_data._totalAllocatableAddr
]
})
};
}
}
]},
k_onClick: function(k_grid, k_rowData) {
var
k_rowId,
k_elapsedTime;
if (0 === k_grid.k_selectionStatus.k_selectedRowsCount) {
k_grid.k_leasesGrid.k_leasesFieldsetReset.call(k_grid.k_leasesGrid);
k_grid.k_lastClickIndex = null;
return;
}
k_rowId = k_grid.k_selectionStatus.k_rows[0].k_rowIndex;
if (k_rowId === k_grid.k_lastClickIndex) {
k_elapsedTime = k_grid.k_lastClickTime.getElapsed();
if (k_elapsedTime < 3000) {
return;}
}
k_grid.k_lastClickTime = new Date();
k_grid.k_lastClickIndex = k_rowId;
k_grid.k_lastSelectedScope = k_rowData;
},
k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'dhcpScopeEditor'
},
k_isHidden: true, k_hasSharedMenu: true,
k_items: [],

k_update: function(k_sender, k_event) {
var
k_allowRemove,
k_selectedRowsCount;
if (k_sender.k_isInstanceOf('K_Grid') && kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED === k_event.k_type) {
k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount;
k_allowRemove = (0 !== k_selectedRowsCount && this.k_parentWidget.k_parentForm.k_isAdvancedMode);
this.k_enableItem('k_btnRemove', k_allowRemove);
this.k_enableItem('k_btnEdit', (1 === k_selectedRowsCount));
this.k_enableItem('k_btnView', (1 === k_selectedRowsCount));
k_sender.k_getLeases();
}
}
}
},

k_onDblClick: function(k_grid, k_rowData) {
if (!k_grid.k_parentForm.k_isAdvancedMode) {
return;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'dhcpScopeEditor',
k_objectName: 'dhcpScopeEditorEdit',
k_params: {
k_relatedGrid: k_grid,
k_data: k_rowData
}
});
}
};k_toolbarItems = k_scopesGridCfg.k_toolbars.k_bottom.k_items;
if (k_isAuditor) {
k_toolbarItems.push({
k_type: 'K_BTN_VIEW',
k_onView: k_openScopeEditor,
k_isDisabled: true
});
}
else {
k_toolbarItems.push({
k_type: 'K_BTN_ADD',
k_onAdd: k_openScopeEditor
});
k_toolbarItems.push({
k_id: 'k_btnAddMulti',
k_caption: k_tr('Add', 'common'),
k_isHidden: true,
k_isMenuButton: true,
k_items: [
{
k_id: 'k_btnTemplate',
k_caption: k_tr('Use Interface Template', 'dhcpServerList'),
k_isDisabled: true,
k_items: [],
k_onClick: k_openScopeEditor
},
{
k_id: 'k_btnManual',
k_caption: k_tr('Manual…', 'dhcpServerList'),
k_onClick: k_openScopeEditor
}
]
});
k_toolbarItems.push({
k_type: 'K_BTN_EDIT',
k_isDisabled: true,
k_onEdit: k_openScopeEditor
});
k_toolbarItems.push({
k_type: 'K_BTN_REMOVE',
k_isDisabled: true,

k_onRemove: function(k_toolbar) {
k_toolbar.k_relatedWidget.k_parentForm.k_removeScopes.call(k_toolbar.k_relatedWidget);
}
});
k_toolbarItems.push('->'); k_toolbarItems.push({
k_id: 'k_btnSimpleMode',
k_caption: k_tr('Generate Scopes Automatically…', 'dhcpServerList'),
k_isInSharedMenu: false,
k_onClick: k_switchModeHandler
});
}
k_scopesGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'scopesGrid', k_scopesGridCfg);
k_scopesGrid.k_toolbars.k_bottom.k_sharedMenu.k_extWidget.on('beforeshow', function() {
return this.k_parentForm.k_isAdvancedMode;
}, k_scopesGrid);

k_getLeases = function() {
var
k_leasesGrid = this.k_leasesGrid,
k_selectedScopesStatus = this.k_selectionStatus,
k_selectedScopesCnt = k_selectedScopesStatus.k_selectedRowsCount,
k_isOneScopeSelected = 1 === k_selectedScopesCnt,
k_selectedScopesRows = k_selectedScopesStatus.k_rows,
k_translations = k_leasesGrid.k_translations,
k_scopesIdsArray = [],
k_searchValue = k_leasesGrid.k_searchField.k_getValue(),
k_leasesFilterQuery,
k_item,
k_i;
if (0 === k_selectedScopesCnt) {
k_leasesGrid.k_setDisabled(true);
return;
}
k_leasesGrid.k_setDisabled(false);
k_leasesGrid.k_selectedScopeElement.k_setValue(
{
k_selectedSignal: k_isOneScopeSelected ? k_translations.k_scope : k_translations.k_multipleSelect,
k_selectedScope: k_isOneScopeSelected ? k_selectedScopesRows[0].k_data.name : ''
}
);
for (k_i = 0; k_i < k_selectedScopesCnt; k_i++) {
k_item = k_selectedScopesRows[k_i].k_data;
k_scopesIdsArray.push(k_item.id);
}
if (k_searchValue && '' !== k_searchValue) {
k_leasesFilterQuery = kerio.lib.k_cloneObject(this.k_leasesFilterQuery);
k_leasesFilterQuery.conditions.push(kerio.waw.shared.k_DEFINITIONS.k_get('k_searchCondition', { k_value: k_searchValue}));
}
else {
k_leasesFilterQuery = this.k_leasesFilterQuery;
}
k_leasesGrid.k_reloadData({query: k_leasesFilterQuery, scopeIds: k_scopesIdsArray});
k_leasesGrid.k_reloadDeclinedScopes(k_scopesIdsArray);
};

k_reloadDeclinedScopes = function(k_scopesIdsArray) {
if (!this.k_getDeclinedLeasesRequest) {
this.k_getDeclinedLeasesRequest = {
k_jsonRpc: {
method: 'Dhcp.getDeclinedLeases',
params: {
scopeIds: null
}
},
k_callback: function(k_response, k_success) {
var
k_count;
if (k_success) {
k_count = k_response.count;
this.k_declinedLeasesCnt = k_count;
this.k_statusbar.k_setVisible(0 < k_count);
if (1 === k_count) {
this.k_statusbar.k_setText(this.k_translations.k_declinedOneLease);
this.k_statusbar.k_setLink(this.k_translations.k_declinedOneLeaseLink);
}
else if (1 < k_count) {
this.k_statusbar.k_setText(this.k_translations.k_declinedLeases);
this.k_statusbar.k_setLink(this.k_translations.k_declinedLeasesLink);
}
}
},
k_scope: this
};
}
this.k_scopesIdsArray = k_scopesIdsArray;
this.k_getDeclinedLeasesRequest.k_jsonRpc.params.scopeIds = k_scopesIdsArray;
kerio.waw.requests.k_sendBatch(this.k_getDeclinedLeasesRequest);
};

k_deleteLeases = function(k_response) {
if ('no' === k_response) {
return;
}
if (!this.k_removeDeclinedLeasesRequest) {
this.k_removeDeclinedLeasesRequest = {
k_jsonRpc: {
method: 'Dhcp.removeDeclinedLeases',
params: {
scopeIds: null
}
},
k_callback: function(k_response, k_success) {
this.k_reloadDeclinedScopes(this.k_scopesIdsArray);
},
k_scope: this
};
}
this.k_removeDeclinedLeasesRequest.k_jsonRpc.params.scopeIds = this.k_scopesIdsArray;
kerio.waw.requests.k_sendBatch(this.k_removeDeclinedLeasesRequest);
};
k_statusBarCfg = {
k_isHidden: true,
k_configurations: {
k_declinedLeases: {
k_text: '',
k_iconCls: 'dhcpMessage',
k_link: k_isAuditor ? undefined : {
k_text: '',
k_onClick: function() {
var
k_grid = this.k_relatedWidget,
k_declinedLeasesCnt = k_grid.k_declinedLeasesCnt,
k_tr = kerio.lib.k_tr;
kerio.lib.k_confirm({
k_title: k_tr('Declined leases', 'dhcpServerList'),
k_msg: [k_tr('There [is|are] %1 declined [lease|leases].', 'dhcpServerList', { k_args: [k_declinedLeasesCnt], k_pluralityBy: k_declinedLeasesCnt }),
'<br><br><b>',
k_tr('Do you want to delete [it|them]?', 'dhcpServerList', { k_pluralityBy: k_declinedLeasesCnt }),
'</b>'].join(''),
k_callback: k_grid.k_deleteLeases,
k_scope: k_grid
});
}
}
}
},
k_defaultConfig: 'k_declinedLeases'
};
k_statusbar = new kerio.lib.K_Statusbar(k_localNamespace + 'k_leasesStatusbar', k_statusBarCfg);
k_leasesGridCfg = {
k_columns: {
k_sorting: {
k_columnId: 'ipAddress'
},
k_autoExpandColumn: 'userName',
k_items: [
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'scopeId',
k_isDataOnly: true
},
{
k_columnId: 'isRas',
k_isDataOnly: true
},
{
k_columnId: 'macDefined',
k_isDataOnly: true
},
{
k_columnId: 'options',
k_isDataOnly: true
},
{
k_columnId: 'type',
k_isDataOnly: true
},
{
k_columnId: 'status',
k_isDataOnly: true
},
{
k_columnId: 'leased',
k_isDataOnly: true
},
{
k_columnId: 'ipAddress',
k_caption: k_tr('IP Address', 'dhcpServerList'),
k_width: 120, 
k_renderer: function(k_value, k_data) {
var
k_constStoreStatus = this.kerio_web_SharedConstants,
k_rendererData,
k_iconClass;
if (true === k_data.isRas) {
k_rendererData = kerio.waw.shared.k_methods.k_formatInterfaceName(
'',
{
'type':  this.k_TYPE_RAS,
'enabled': true});
k_iconClass = k_rendererData.k_iconCls;
} else if (this.DhcpLeaseType.DhcpTypeLease === k_data.type) {
k_iconClass = 'dhcpLeaseIcon';
} else {
k_iconClass = 'dhcpReservationIcon';
}
switch (k_data.status) {
case k_constStoreStatus.kerio_web_StoreStatusNew:
k_iconClass += ' added';
break;
case k_constStoreStatus.kerio_web_StoreStatusModified:
k_iconClass += ' modified';
break;
}
return {
k_iconCls: k_iconClass,
k_data: k_value
};
}},
{
k_columnId: 'name',
k_width: 150,
k_caption: k_tr('Name', 'common')
},
{
k_columnId: 'cardManufacturer',
k_width: 200,
k_caption: k_tr('Manufacturer', 'dhcpServerList'),
k_isHidden: true
},
{
k_columnId: 'macAddress',
k_caption: k_tr('MAC Address', 'dhcpServerList'),
k_width: 115, 
k_renderer: function(k_value, k_data) {
var
k_rendererData,
k_tooltip;
if (k_data.macDefined && !k_value) { k_value = this.k_DEFAULT_MAC_ADDRESS;
k_data.macAddress = k_value; }
if (k_data.isRas) {
k_rendererData = this.k_translations.k_rasClient;
k_tooltip = this.k_translations.k_clientId + ' ' + kerio.lib.k_htmlEncode(k_value);
} else {
k_rendererData = this.k_formatMacAddress(k_value);
k_tooltip = kerio.lib.k_htmlEncode(k_data.cardManufacturer);
}
k_tooltip = k_tooltip.replace(this.k_allSpacesRegExp, '&nbsp;');return {
k_data: k_rendererData,
k_dataTooltip: k_tooltip,
k_isSecure: true
};
}
},
{
k_columnId: 'hostName',
k_width: 130,
k_caption: k_tr('Hostname', 'dhcpServerList'),

k_renderer: function(k_value, k_data) {
var k_return,
k_rendererInput = {
type: this.k_TYPE_HOST,
host: k_value
};
if ('' !== k_value) {
k_return = this.k_addressGroupItemRenderer(undefined, k_rendererInput);
} else {
k_return = {k_data: ''};
}
return k_return;
}
},
{
k_columnId: 'itemStatus',
k_caption: k_tr('Status', 'dhcpServerList'),

k_renderer: function(k_value, k_data) {
var
k_rendererData;
if (this.DhcpLeaseType.DhcpTypeLease === k_data.type) {
k_rendererData = this.k_translations.k_leased;
} else {
if (k_data.leased) {
if (0 === k_data.expirationDate.year) {
k_rendererData = this.k_translations.k_reservedExpired;
} else {
k_rendererData = this.k_translations.k_reservedLeased;
}
} else {
k_rendererData = this.k_translations.k_reserved;
}
}
return {
k_data: k_rendererData
};
}
},
{
k_columnId: 'userName',
k_caption: k_tr('User', 'dhcpServerList'),

k_renderer: function(k_value, k_data) {
var k_return,
k_referencedUserName,
k_rendererInput = {
name: k_value,
domainName: ''
};
if ('' !== k_value) {
k_referencedUserName = this.k_createReferencedUserName(k_rendererInput);
k_return = {
k_data: k_referencedUserName.k_userName,
k_iconCls: k_referencedUserName.k_iconClass
};
} else {
k_return = {k_data: ''};
}
return k_return;
}
},
{
k_columnId: 'expirationTime',
k_isDataOnly: true
},
{
k_columnId: 'expirationDate',
k_caption: k_tr('Lease Expiration', 'dhcpServerList'),
k_width: 150,
k_isHidden: true,

k_renderer: function(k_value, k_data) {
return this.k_leaseDateTimeRenderer(k_data.expirationDate, k_data.expirationTime);
}
},
{
k_columnId: 'requestTime',
k_isDataOnly: true
},
{
k_columnId: 'requestDate',
k_caption: k_tr('Last Request Time', 'dhcpServerList'),
k_width: 150,
k_isHidden: true,

k_renderer: function(k_value, k_data) {
return this.k_leaseDateTimeRenderer(k_data.requestDate, k_data.requestTime);
}
}
]},k_filters: {
k_combining: k_WEB_CONSTANTS.kerio_web_Or,
k_search: {
k_caption: k_tr('Filter:', 'dhcpServerList'),
k_searchBy: ['QUICKSEARCH']
},
k_onBeforeFilterChange: k_methods.k_onBeforeFilterForMacAddresses
},
k_statusbar: k_statusbar,
k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'dhcpReservationEditor'
},
k_hasSharedMenu: true,

k_update: function(k_sender, k_event) {
var
k_showInActiveHosts = this.k_getItem('k_showInActiveHosts'),
k_scopesSelectionCnt = k_sender.k_scopesGrid.k_selectionStatus.k_selectedRowsCount,
k_isOneScopeSelected = 1 === k_scopesSelectionCnt,
k_allowRemove,
k_selectedRowsCount,
k_allowEdit,
k_isRas,
k_singleSelect;
if (k_sender.k_isInstanceOf('K_Grid') && kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED === k_event.k_type) {
k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount;
k_allowRemove = 0 !== k_selectedRowsCount;
k_singleSelect = 1 === k_selectedRowsCount;
k_isRas = k_singleSelect && k_sender.k_selectionStatus.k_rows[0].k_data.isRas;
k_allowEdit = k_singleSelect && !k_isRas
&& k_sender.k_selectionStatus.k_rows[0].k_data.type === this.k_parentWidget.DhcpLeaseType.DhcpTypeReservation;
this.k_enableItem('k_btnRemove', k_allowRemove);
this.k_enableItem('k_btnAdd', k_isOneScopeSelected);
this.k_enableItem('k_btnEdit', k_singleSelect && !k_isRas);
this.k_enableItem('k_btnView', k_singleSelect && !k_isRas);
this.k_enableItem('k_btnReserveLease', !k_allowEdit && k_singleSelect && !k_isRas); k_showInActiveHosts.k_setReadOnly(false);
this.k_enableItem('k_showInActiveHosts', k_singleSelect);
}
}}},k_remoteData: {
k_root: 'list',
k_isAutoLoaded: false,
k_jsonRpc: {
method: 'Dhcp.getLeases'
}
},

k_onDblClick: k_openReservationEditor }; if (k_isAuditor) {
k_leasesGridCfg.k_toolbars.k_bottom.k_items = [{
k_type: 'K_BTN_VIEW',
k_onView: k_openReservationEditor,
k_isVisibleInToolbar: true
}];
}
else {
k_leasesGridCfg.k_toolbars.k_bottom.k_items = [
{
k_id: 'k_btnAdd',
k_caption: k_tr('Add…', 'common'),
k_onClick: k_openReservationEditor,
k_isMenuButton: false, k_isVisibleInToolbar: true,
k_items: [ {
k_id: 'k_btnAddEmpty',
k_caption: k_tr('Add Reservation…', 'dhcpServerList'),
k_onClick: k_openReservationEditor
},
{
k_id: 'k_btnReserveLease',
k_caption: k_tr('Reserve Lease…', 'dhcpServerList'),
k_onClick: k_openReservationEditor
}
]
},
{
k_type: 'K_BTN_EDIT',
k_isDisabled: true,
k_isVisibleInToolbar: true,
k_onEdit: k_openReservationEditor
},
{
k_type: 'K_BTN_REMOVE',
k_isDisabled: true,
k_isVisibleInToolbar: true,

k_onRemove: function (k_toolbar) {
k_toolbar.k_parentWidget.k_removeRows();
}
}
];
} k_leasesGridCfg.k_toolbars.k_bottom.k_items.push('-');
k_leasesGridCfg.k_toolbars.k_bottom.k_items.push({
k_id: 'k_showInActiveHosts',
k_caption: k_tr('Show Host Details', 'dhcpServerList'),
k_isDisabled: true,
k_isVisibleInToolbar: true,
k_onClick: function (k_toolbar, k_toolbarItem ) {
var
k_selectedRows = k_toolbar.k_relatedWidget.k_selectionStatus.k_rows,
k_data;
if (1 === k_selectedRows.length) {
k_data = k_selectedRows[0].k_data;
kerio.waw.status.k_currentScreen.k_switchPage('activeHosts', {k_ip: k_data.ipAddress});
}
}
});
k_leasesGrid = new kerio.waw.shared.k_widgets.K_ContextMenuList(k_localNamespace + 'leasesGrid', k_leasesGridCfg);
k_selectedScopeElement = new kerio.lib.K_DisplayField(
k_localNamespace + 'k_selectedScope',
{
k_isSecure: true,
k_template: '{k_selectedSignal} <b>{k_selectedScope}</b>',
k_value: {
k_selectedSignal: '',
k_selectedScope: ''
}
}
);
k_leasesGrid.k_toolbars.k_top.k_addWidget(k_selectedScopeElement, 0);
k_leasesFilterQuery = {
conditions: [],
combining: k_WEB_CONSTANTS.kerio_web_Or,
orderBy: [
{
columnName: "ipAddress",
direction: k_WEB_CONSTANTS.kerio_web_Asc
}
]
};
k_formCfg = {
k_items: [
{
k_type: 'k_container',
k_height: 25,
k_items: [
{
k_id: 'k_checkboxEnabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_option: k_tr('Enable DHCP server', 'dhcpServerList'),
k_isChecked: false,

k_onChange: function(k_form, k_element, k_value) {
kerio.adm.k_framework.k_enableApplyReset();
}
}
]
},
{
k_id: 'k_fieldsetScopes',
k_type: 'k_fieldset',
k_caption: k_tr('Scopes', 'dhcpServerList'),
k_height: 170, k_items: [
{
k_type: 'k_container',
k_content: k_scopesGrid
}
]
},
{
k_type: 'k_fieldset',
k_minHeight: 200,
k_isResizeableVertically: true,
k_caption: k_tr('Leases and reservations', 'dhcpServerList'),
k_items: [
{
k_type: 'k_container',
k_content: k_leasesGrid
}
]
}
]};if (!k_isAuditor) {

k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function() {
var
k_form = this.k_parentWidget;
kerio.waw.requests.k_sendBatch(
[
{
k_jsonRpc: {
method: 'Dhcp.apply'
}
},
{
k_jsonRpc: {
method: 'Dhcp.setConfig',
params: {
'config': {
'enabled': k_form.k_checkboxEnabled.k_getValue()
}
}
}
}
],
{
k_scope: k_form,
k_callback: k_form.k_onApplyResetCallback,
k_requestOwner: k_form
}
);
return false;
},

k_onReset: function() {
this.k_parentWidget.k_isInitialLoad = true; kerio.waw.requests.k_sendBatch(
{
k_jsonRpc: {
method: 'Dhcp.reset'
}
},
{
k_callback: this.k_parentWidget.k_onApplyResetCallback,
k_scope: this.k_parentWidget
});
return false;
}
}; k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
k_formCfg.k_toolbars = {
k_bottom: k_toolbar
};
}
k_form = new kerio.lib.K_Form(k_objectName, k_formCfg);
k_batchRequests = [];
k_batchRequests[k_INDEX_GET_MODE] = { method: 'Dhcp.getMode' };
k_batchRequests[k_INDEX_GET_CONFIG] = { method: 'Dhcp.getConfig' };
k_batchRequests[k_INDEX_GET_SCOPES] = { method: 'Dhcp.get', params: {'query':{'start':0,'limit':-1}} };
k_batchRequests[k_INDEX_GET_LEASES] = {
method: 'Dhcp.getLeases',
params: {
query: {
start: 0,
limit: -1
},
scopeIds: []
}
};
if (!k_isAuditor) {
k_batchRequests[k_INDEX_GET_INTERFACES] = {
method: 'Interfaces.get',
params: {
'sortByGroup':true,
'query': {
conditions: [kerio.waw.shared.k_DEFINITIONS.k_interfaceEthernetCondition],
combining: k_WEB_CONSTANTS.kerio_web_And,
orderBy: [
{
columnName: "name",
direction: k_WEB_CONSTANTS.kerio_web_Asc
}
]
}
}
};
}
k_scopesGrid.k_addReferences({
kerio_web_SharedConstants: k_WAW_CONSTANTS.kerio_web_SharedConstants,
k_ipToNumber: kerio.waw.shared.k_methods.k_ipToNumber,
k_parentForm: k_form,
k_leasesGrid: k_leasesGrid,
k_leasesFilterQuery: k_leasesFilterQuery,
k_lastSelectedScope: {},
k_getLeases: k_getLeases,
k_lastClickIndex: null,
k_lastClickTime: null
});
k_leasesGrid.k_addReferences({
kerio_web_SharedConstants: k_WAW_CONSTANTS.kerio_web_SharedConstants,
k_TYPE_RAS: k_WAW_CONSTANTS.InterfaceType.Ras,
k_TYPE_HOST: k_WAW_CONSTANTS.kerio_web_SharedConstants.kerio_web_Host,
DhcpLeaseType: k_WAW_CONSTANTS.DhcpLeaseType,
k_DEFAULT_MAC_ADDRESS: k_WAW_CONSTANTS.k_DEFAULT_MAC_ADDRESS,
k_scopesGrid: k_scopesGrid,
k_parentForm: k_form,
k_reloadDeclinedScopes: k_reloadDeclinedScopes,
k_deleteLeases: k_deleteLeases,
k_createReferencedUserName: kerio.waw.shared.k_methods.k_createReferencedUserName,
k_addressGroupItemRenderer: kerio.waw.shared.k_methods.k_renderers.k_addressGroupItemRenderer,
k_selectedScopeElement: k_selectedScopeElement,
k_searchField: k_leasesGrid.k_filters.k_search,
k_allSpacesRegExp: new RegExp(' ', 'g'),k_scopesIdsArray: [],
k_removeDeclinedLeasesRequest: false,
k_removeRows: {},k_macFilterCondition: {
comparator: 'Like',
fieldName: 'macAddress',
value: ''
},
k_translations: {
k_rasClient: k_tr('Dial-up client', 'dhcpServerList'),
k_clientId: k_tr('Client ID:', 'dhcpServerList'),
k_leased: k_tr('Leased', 'dhcpServerList'),
k_reserved: k_tr('Reserved', 'dhcpServerList'),
k_reservedLeased: k_tr('Reserved, Leased', 'dhcpServerList'),
k_reservedExpired: k_tr('Reserved, Expired', 'dhcpServerList'),
k_scope: k_tr('Scope:', 'dhcpServerList'),
k_multipleSelect: k_tr('More than one scope is selected', 'dhcpServerList'),
k_noScopeSelected: k_tr('No scope is selected', 'dhcpServerList'),
k_declinedLeases: k_tr('There are some declined leases.', 'dhcpServerList') + ' ',
k_declinedLeasesLink: k_tr('Click here to delete them.', 'dhcpServerList'),
k_declinedOneLease: k_tr('There is a declined lease.', 'dhcpServerList') + ' ',
k_declinedOneLeaseLink: k_tr('Click here to delete it.', 'dhcpServerList')
},
k_formatMacAddress: kerio.waw.shared.k_methods.k_formatMacAddress
});
k_form.k_addReferences({
k_INDEX_GET_MODE: k_INDEX_GET_MODE,
k_INDEX_GET_CONFIG: k_INDEX_GET_CONFIG,
k_INDEX_GET_SCOPES: k_INDEX_GET_SCOPES,
k_INDEX_GET_LEASES: k_INDEX_GET_LEASES,
k_INDEX_GET_INTERFACES: k_INDEX_GET_INTERFACES,
k_checkboxEnabled: k_form.k_getItem('k_checkboxEnabled'),
k_isAdvancedMode: true,
k_scopesGrid: k_scopesGrid,
k_scopesGridToolbar: k_scopesGrid.k_toolbars.k_bottom,
k_leasesGrid: k_leasesGrid,
k_toolbar: k_toolbar,
k_isAuditor: k_isAuditor,
k_batchRequests: k_batchRequests,
k_isInitialLoad: true
});
if (k_isAuditor) {
k_form.k_scopesGridToolbar.k_setReadOnly(false);
k_leasesGrid.k_toolbars.k_top.k_setReadOnly(false);
}
this.k_addControllers(k_form);
return k_form;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_leasesGrid.k_leaseDateTimeRenderer = function (k_date, k_time) {
var
k_return = '';
if (0 !== k_date.year) {
k_return = kerio.waw.shared.k_methods.k_formatDate(k_date) + ', ' + kerio.waw.shared.k_methods.k_formatTime(k_time);
}
return {
k_data: k_return
};
};

k_kerioWidget.k_leasesGrid.k_removeRows = function() {
var
k_selectedRows = this.k_selectionStatus.k_rows,
k_ids = [],
k_i, k_cnt;
for (k_i = 0, k_cnt = this.k_selectionStatus.k_selectedRowsCount; k_i < k_cnt; k_i++) {
k_ids.push(k_selectedRows[k_i].k_data.id);
}
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Dhcp.removeLeases',
params: {leaseIds: k_ids}
},
k_callback: this.k_parentForm.k_removeLeasesCallback,
k_scope: this
});
};

k_kerioWidget.k_leasesGrid.k_leasesFieldsetReset = function() {
this.k_clearData();
this.k_selectedScopeElement.k_setValue(
{
k_selectedSignal: this.k_translations.k_noScopeSelected,
k_selectedScope: ''
}
);
this.k_setDisabled(true);
};

k_kerioWidget.k_scopesGrid.k_findScopeBy = function(k_data) {
var
k_lastSelectedScope = this.k_lastSelectedScope;
if (k_lastSelectedScope.ipStart === k_data.ipStart
&& k_lastSelectedScope.ipEnd === k_data.ipEnd
&& k_lastSelectedScope.ipMask === k_data.ipMask) {
return true;
}
return false;
};

k_kerioWidget.k_applyParams = function() {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
kerio.waw.shared.k_methods.k_maskMainScreen();
this.k_isInitialLoad = true; this.k_leasesGrid.k_leasesFieldsetReset.call(this.k_leasesGrid);
this.k_loadData();
};

k_kerioWidget.k_removeScopesCallback = function(k_response) {
if (kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
this.k_removeSelectedRows();
kerio.adm.k_framework.k_enableApplyReset();
if (0 !== this.k_selectionStatus.k_selectedRowsCount) {
this.k_getLeases();
this.k_lastSelectedScope = this.k_selectionStatus.k_rows[0].k_data;
} else {
this.k_lastSelectedScope = {};
this.k_leasesGrid.k_leasesFieldsetReset.call(this.k_leasesGrid);
}
}
kerio.waw.shared.k_methods.k_unmaskMainScreen();
};

k_kerioWidget.k_loadData = function() {
var
k_options = {
k_requests: this.k_batchRequests,
k_scope: this,
k_callback: this.k_loadDataCallback,
k_requestOwner: this
};
kerio.waw.shared.k_methods.k_sendBatch(k_options);
};

k_kerioWidget.k_loadDataCallback = function(k_response, k_success) {
var
k_scopes,
k_scope,
k_leases,
k_interfaces,
k_interface,
k_i, k_cnt,
k_rendererData,
k_batchResult,
k_selectRow,
k_selectRowId,
k_isAdvancedMode,
k_ipMaskB,
k_shared = kerio.waw.shared,
k_hasIfaceTemplate = false,
k_scopesGrid = this.k_scopesGrid,
k_toolbar = k_scopesGrid.k_toolbars.k_bottom,
k_statusbar = k_scopesGrid.k_statusbar,
k_lastSelectedScope = k_scopesGrid.k_lastSelectedScope,
k_formatInterfaceName = k_shared.k_methods.k_formatInterfaceName,
k_ipToBinary = kerio.waw.shared.k_methods.k_ipToBinary,
k_typeInterface = k_shared.k_CONSTANTS.InterfaceType.Ethernet,
InterfaceGroupType = k_shared.k_CONSTANTS.InterfaceGroupType;
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_dialogs: ['dhcpScopeEditor', 'dhcpReservationEditor']
});
if (!k_success || !k_response.k_decoded.batchResult) {
k_shared.k_methods.k_unmaskMainScreen();
return;
}
k_batchResult = k_response.k_decoded.batchResult;
if (!kerio.waw.status.k_currentScreen.k_isContentChanged()) { this.k_checkboxEnabled.k_setValue(k_batchResult[this.k_INDEX_GET_CONFIG].config.enabled);
}
k_isAdvancedMode = (k_shared.k_CONSTANTS.DhcpModeType.DhcpManual === k_batchResult[this.k_INDEX_GET_MODE].mode.type);
this.k_isAdvancedMode = k_isAdvancedMode;
k_scopes = k_batchResult[this.k_INDEX_GET_SCOPES].list;
k_leases = k_batchResult[this.k_INDEX_GET_LEASES].list;
for (k_i = 0, k_cnt = k_scopes.length; k_i < k_cnt; ++k_i) {
k_scope = k_scopes[k_i];
k_scope._totalAllocatedAddr = k_leases.filter(function(k_lease) {
return k_lease.scopeId === k_scope.id;
}).length;
k_ipMaskB = k_ipToBinary(k_scope.ipMask);
k_scope._totalAllocatableAddr = (k_ipToBinary(k_scope.ipEnd) & ~k_ipMaskB)  - (k_ipToBinary(k_scope.ipStart) & ~k_ipMaskB) + 1;
}
k_statusbar.k_switchConfig( (0 === k_scopes.length)      ? 'k_noTrustedIface' : 'k_simpleMode'
);
k_toolbar.k_setVisible(k_isAdvancedMode);     k_statusbar.k_setVisible(!k_isAdvancedMode);  if (!this.k_isAuditor && k_isAdvancedMode) {
k_interfaces = k_batchResult[this.k_INDEX_GET_INTERFACES].list;
k_toolbar.k_showItem('k_btnAdd', true);
k_toolbar.k_showItem('k_btnAddMulti', false);
k_toolbar.k_disableItem('k_btnTemplate', true);
k_toolbar.k_removeAllMenuItems('k_btnTemplate');
for (k_i = 0, k_cnt = k_interfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_i];
if (InterfaceGroupType.Internet === k_interface.group) {
continue; }
k_hasIfaceTemplate = true;
k_rendererData = k_formatInterfaceName(
'',
{
'type':  k_typeInterface,
'enabled': true});
k_toolbar.k_enableItem('k_btnTemplate', true);
k_toolbar.k_addMenuItem(
'k_btnTemplate',
{
k_id: k_interface.id,
k_iconCls: k_rendererData.k_iconCls,
k_caption: k_interface.name
}
);
}
if (k_hasIfaceTemplate) {
k_toolbar.k_showItem('k_btnAdd', false);
k_toolbar.k_showItem('k_btnAddMulti', true);
}
}
k_scopesGrid.k_setData(k_scopes, {k_keepSelection: true});
if (k_lastSelectedScope.ipStart) {
k_selectRow = k_scopesGrid.k_findRowBy(k_scopesGrid.k_findScopeBy);
if (k_selectRow) {
k_lastSelectedScope = k_selectRow[0];
k_selectRowId = k_scopesGrid.k_findRow('id', k_lastSelectedScope.id);
k_scopesGrid.k_selectRows(k_selectRowId);
k_scopesGrid.k_getLeases();
}
else {
k_lastSelectedScope = {};
}
k_scopesGrid.k_lastSelectedScope = k_lastSelectedScope;
}
k_shared.k_methods.k_unmaskMainScreen();
if (this.k_isInitialLoad) {
kerio.adm.k_framework.k_enableApplyReset(false); this.k_isInitialLoad = false;
}
};
k_kerioWidget.k_onApplyResetCallback = function(k_response, k_success) {
if (k_success && kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
kerio.adm.k_framework.k_enableApplyReset(false);
kerio.waw.shared.k_data.k_get('k_dhcpScopesList', true);
if (!kerio.adm.k_framework.k_leaveCurrentScreen()) {
this.k_loadData();
this.k_leasesGrid.k_leasesFieldsetReset.call(this.k_leasesGrid);
}
else {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
} else {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
};

k_kerioWidget.k_removeScopes = function() {
var
k_selectedRows = this.k_selectionStatus.k_rows,
k_ids = [],
k_i, k_cnt;
for (k_i = 0, k_cnt = this.k_selectionStatus.k_selectedRowsCount; k_i < k_cnt; k_i++) {
k_ids.push(k_selectedRows[k_i].k_data.id);
}
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Dhcp.remove',
params: {scopeIds: k_ids}
},
k_callback: this.k_parentForm.k_removeScopesCallback,
k_scope: this
});
};

k_kerioWidget.k_removeLeasesCallback = function(k_response, k_success) {
if (k_success && kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
this.k_removeSelectedRows();
kerio.adm.k_framework.k_enableApplyReset();
}
kerio.waw.shared.k_methods.k_unmaskMainScreen();
};

k_kerioWidget.k_unmaskMainScreen = function() {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
};

k_kerioWidget.k_onClickSwitchConfigMode = function() {
var
k_tr = kerio.lib.k_tr,
k_currentScreen = kerio.waw.status.k_currentScreen,
k_confirmMessage;
if (k_currentScreen.k_isContentChanged()) {
k_currentScreen.k_showContentChangedAlert(this.k_unmaskMainScreen);
return;
}
if (this.k_isAdvancedMode) {
k_confirmMessage = k_tr('You are switching to the automatic mode of DHCP configuration. All existing scopes will be removed and generated again based on interfaces in the Trusted/Local Interfaces, Guest Interfaces and Other Interfaces groups.', 'dhcpServerList');
}
else {
k_confirmMessage = k_tr('You are switching to the manual mode of DHCP configuration. In this mode, it is necessary to update the scopes manually when changing interfaces in the Trusted/Local Interfaces, Guest Interfaces and Other Interfaces groups.', 'dhcpServerList');
}
kerio.lib.k_confirm({
k_title: k_tr('Confirm', 'common'),
k_msg: k_confirmMessage
+ '<br>'
+ k_tr('Do you want to continue?', 'common'),
k_callback: this.k_callbackModeConfirm,
k_scope: this,
k_icon: 'warning'
});
};

k_kerioWidget.k_switchConfigMode = function() {
var
DhcpModeType = kerio.waw.shared.k_CONSTANTS.DhcpModeType;
kerio.waw.shared.k_methods.k_maskMainScreen(this, { k_message: kerio.lib.k_tr('Switching DHCP server mode…', 'dhcpServerList'), k_delay: 0});
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Dhcp.setMode',
params: { mode: {
type: this.k_isAdvancedMode ? DhcpModeType.DhcpAutomatic : DhcpModeType.DhcpManual } }
},
k_callback: this.k_callbackSwitchConfigMode,
k_scope: this
});
};

k_kerioWidget.k_callbackSwitchConfigMode = function(k_response, k_success) {
if (!k_success || !kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
} kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'ProductInfo.configUpdate'
},
k_callback: this.k_callbackConfigUpdate,
k_scope: this,
k_onError: kerio.waw.shared.k_methods.k_ignoreErrors });
};

k_kerioWidget.k_callbackConfigUpdate = function() {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this); this.k_applyParams(); };

k_kerioWidget.k_callbackModeConfirm = function(k_userAnswer) {
if ('yes' === k_userAnswer) {
this.k_switchConfigMode();
return;
}
};
}}; 
kerio.waw.shared.k_widgets = kerio.waw.shared.k_widgets || {}; kerio.waw.shared.k_widgets.K_DhcpOptionsGrid = function(k_objectName, k_config){
var
k_tr = kerio.lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_isLease = k_config.k_isLease,
k_sortColumns = false,
k_removeButtonHandler,
k_optionsGridCfg,
k_toolbarCfg,
k_gridColumns;
k_toolbarCfg = {
k_dialogs: {
k_sourceName: 'dhcpOptionEditor'
},
k_hasSharedMenu: true,
k_items: [
{
k_id: 'k_btnAdd',
k_caption: k_tr('Add…', 'common'),
k_onClick: this.k_openEditor },
{
k_id: 'k_btnEdit',
k_caption: k_tr('Edit…', 'common'),
k_isDisabled: true,
k_onClick: this.k_openEditor },
{
k_id: 'k_btnRemove',
k_caption: k_tr('Remove', 'common'),
k_isDisabled: true,

k_onClick: function (k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget;
k_grid.k_removeButtonHandler(k_grid);
}
}
],

k_update: function(k_sender, k_event) {
var
k_events = kerio.lib.k_constants.k_EVENT,
k_constEventTypes = k_events.k_TYPES,
k_canEdit = false;
if (k_sender instanceof kerio.lib.K_Grid) {
if (k_constEventTypes.k_SELECTION_CHANGED === k_event.k_type) {
if (0 !== k_sender.k_selectionStatus.k_selectedRowsCount) {
k_canEdit = false !== k_sender.k_selectionStatus.k_rows[0].k_data.isLease;
}
this.k_enableItem(['k_btnRemove', 'k_btnEdit'], k_canEdit);
}
}
}
};
if (k_isAuditor) {
k_toolbarCfg = {
k_items: []
};
}
else {

k_removeButtonHandler = function(k_grid) {
var
k_selectedRows = k_grid.k_selectionStatus.k_rows,
k_rowData = k_selectedRows[0].k_data,
k_canEdit = false !== k_rowData.isLease, k_gridData,
k_i, k_cnt,
k_row;
if (!k_canEdit) {
return;
}
k_grid.k_removeSelectedRows();
if (k_rowData.isDuplicate) { k_gridData = k_grid.k_getData();
for (k_i = 0, k_cnt = k_gridData.length; k_i < k_cnt; k_i++) {
k_row = k_gridData[k_i];
if (k_row.optionId !== k_rowData.optionId) {
continue; }
if (false !== k_row.isLease) {
break; }
k_row.isDuplicate = false;
k_grid.k_updateRow(k_row, k_i);
break; }
}
k_grid.k_refresh(); };
}
k_optionsGridCfg = {
k_settingsId: 'dhcpOptionsGrid',
k_selectionMode: 'k_single',
k_toolbars: {
k_bottom: k_toolbarCfg
},
k_isReadOnly: k_isAuditor,
k_columns: {
k_sorting: {
k_columnId: 'optionId'
},
k_items: [
{
k_columnId: 'type', k_isDataOnly: true
},
{
k_columnId: 'optionId',
k_caption: k_tr('ID', 'common'),
k_width: 80,
k_isSortable: k_sortColumns,

k_renderer: function(k_value){
return {
k_data: this.k_normalize(k_value, 3, { k_number: true }) };
} },
{
k_columnId: 'name',
k_caption: k_tr('Name', 'common'),
k_isSortable: k_sortColumns,
k_width: 200
},
{
k_columnId: 'value',
k_caption: k_tr('Value', 'common'),
k_isSortable: k_sortColumns,

k_renderer: function(k_value, k_data){
var
k_tr = kerio.lib.k_tr,
k_methods = kerio.waw.shared.k_methods,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_OPTION_TYPES = k_WAW_CONSTANTS.DhcpOptionType,
k_TIME = k_WAW_CONSTANTS.k_TIME_CONSTANTS,
k_output, k_days = 0, k_sign = '', k_time = k_value, k_hours, k_mins, k_ipListList,
k_separator,
k_isThirdIpVisible,
k_row,
k_rowData,
k_rowOutput,
k_cntRow;
if (k_data.type === k_OPTION_TYPES.DhcpTimeSigned) {
k_sign = (0 > k_value ? '-' : '+'); k_time = Math.abs(k_time); }
switch (k_data.type) {
case k_OPTION_TYPES.DhcpBool:
k_output = ("1" === k_value ? k_tr('Enabled', 'common') : k_tr('Disabled', 'common'));
break;
case k_OPTION_TYPES.DhcpTimeUnsigned:
k_days = Math.floor(k_value / k_TIME.k_SECONDS_IN_DAY);
k_time = k_value % k_TIME.k_SECONDS_IN_DAY;
case k_OPTION_TYPES.DhcpTimeSigned:
k_hours = Math.floor(k_time / k_TIME.k_SECONDS_IN_HOUR); k_mins = Math.floor(k_time % k_TIME.k_SECONDS_IN_HOUR / k_TIME.k_SECONDS_IN_MIN);
if (0 === k_days) {
k_output = k_sign + k_hours + ':' + k_methods.k_normalize(k_mins, 2, {
k_number: true
});
}
else if (0 === k_hours && 0 === k_mins) {
k_output = k_tr('%1 [day|days]', 'dhcpServerList', {
k_args: [k_days],
k_pluralityBy: k_days
});
}
else {
k_output = k_tr('%1 [day|days], %2:%3', 'dhcpServerList', {
k_pluralityBy: k_days,
k_args: [k_days, k_hours, k_methods.k_normalize(k_mins, 2, { k_number: true })]
});
}
break;
case k_OPTION_TYPES.DhcpIpPairList:
case k_OPTION_TYPES.DhcpIpMaskList:
case k_OPTION_TYPES.DhcpIpMaskIpList:
k_output = '';
k_ipListList = k_data.ipListList;
k_separator = (k_OPTION_TYPES.DhcpIpPairList === k_data.type) ? ', ' : ' / ';
k_isThirdIpVisible = (k_OPTION_TYPES.DhcpIpMaskIpList === k_data.type) ? true : false;
k_cntRow = (3 < k_ipListList.length) ? 3 : k_ipListList.length;
for (k_row = 0; k_row < k_cntRow; k_row++) {
k_rowData = k_ipListList[k_row];
k_rowOutput = k_rowData[0] + k_separator + k_rowData[1];
k_rowOutput += ((k_isThirdIpVisible) ? (', ' + k_rowData[2]) : '');
k_output = k_output + (('' !== k_output && '' !== k_rowOutput) ? '; ' : '') + k_rowOutput;
}
break;
default:
k_output = k_value;
break;
}
return {
k_data: k_output
};
}},
{
k_columnId: 'ipListList',
k_isDataOnly: true
}
]},
k_rowRenderer: function(k_rowData) {
var k_className = (!k_rowData.isLease && k_rowData.isDuplicate ? 'dhcpOptionDuplicate' : '');
return k_className;
},
k_onDblClick: this.k_openEditor
};if (k_isLease) {
k_gridColumns = k_optionsGridCfg.k_columns;
k_gridColumns.k_items.unshift(
{ k_columnId: 'isLease',
k_isKeptHidden: true, 
k_groupRenderer: function(k_value) {
return {
k_data: (false !== k_value) ? this.k_reservationOptionGroup
: this.k_scopeOptionGroup
};
} },
{ k_columnId: 'isDuplicate',
k_isDataOnly: true
}
);
k_gridColumns.k_grouping = {
k_columnId: 'isLease',
k_isMemberIndented: true
};
}
kerio.adm.k_widgets.K_BasicList.call(this, k_objectName, k_optionsGridCfg);
this.k_addReferences({
k_isAuditor: k_isAuditor,
k_isLease: k_isLease,
k_normalize: kerio.waw.shared.k_methods.k_normalize,
k_reservationOptionGroup: k_tr('Reservation options', 'dhcpServerList'),
k_scopeOptionGroup:       k_tr('Scope options', 'dhcpServerList'),
k_removeButtonHandler: k_removeButtonHandler
});
if (kerio.lib.k_isFirefox && (kerio.lib.k_isTiger || kerio.lib.k_isLeopard || kerio.lib.k_isSnowLeopard)) {
this.k_addReferences({
k_editationDisabled: false,
k_enableEditation: function() {
this.k_editationDisabled = false;
}
});
}
}; 
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_DhcpOptionsGrid', kerio.adm.k_widgets.K_BasicList,

{

k_setData: function(k_data) {
var
k_mergeObjects = kerio.waw.shared.k_methods.k_mergeObjects,
k_indexedData = {},
k_gridData = [],
k_item, k_itemCount,
k_optionIndex, k_optionCnt,
k_option,
k_options,
k_optionData,
k_isLeaseOption;
if (Array !== k_data.constructor) {
k_data = [ k_data ];
}
if (this.k_isLease) { for (k_item = 0, k_itemCount = k_data.length; k_item < k_itemCount; k_item++) {
k_options = k_data[k_item].k_options;
k_isLeaseOption = (true === k_data[k_item].k_isLease);
for (k_optionIndex = 0, k_optionCnt = k_options.length; k_optionIndex < k_optionCnt; k_optionIndex++) {
k_option = k_options[k_optionIndex];
k_option.isLease = k_isLeaseOption;
k_optionData = (k_isLeaseOption)
? { k_lease: k_option }
: { k_scope: k_option };
k_mergeObjects(k_optionData, k_indexedData, k_option.optionId.toString());
}
}
for (k_optionIndex in k_indexedData) {
k_option = k_indexedData[k_optionIndex];
if (k_option.k_scope) {
k_option.k_scope.isDuplicate = (undefined !== k_option.k_lease); k_gridData.push(k_option.k_scope);
}
if (k_option.k_lease) {
k_option.k_lease.isDuplicate = (undefined !== k_option.k_scope); k_gridData.push(k_option.k_lease);
}
}
}
else { for (k_item = 0, k_itemCount = k_data.length; k_item < k_itemCount; k_item++) {
k_gridData = k_gridData.concat(k_data[k_item].k_options);
}
}
kerio.adm.k_widgets.K_BasicList.prototype.k_setData.call(this, k_gridData);
}, 
k_addOption: function(k_rowData) {
var
k_allRows = this.k_getData(),
k_selectRowIndex,
k_row,
k_i, k_cnt;
k_rowData.optionId = parseInt(k_rowData.optionId, 10); if (-1 !== k_allRows) { for (k_i = 0, k_cnt = k_allRows.length; k_i < k_cnt; k_i++) {
k_row = k_allRows[k_i];
if (k_row.optionId !== k_rowData.optionId) {
continue; }
if (false !== k_row.isLease) {
return false; }
else { k_row.isDuplicate = true;
k_rowData.isDuplicate = true;
}
}
}
k_rowData.isLease = true; this.k_appendRow(k_rowData);
this.k_resortRows();
k_selectRowIndex = this.k_findRow('optionId', k_rowData.optionId);
this.k_selectRows(k_selectRowIndex[k_selectRowIndex.length - 1]);
return true; },

k_editOption: function(k_rowData) {
this.k_updateRow(k_rowData);
this.k_resortRows();
},

k_openEditor: function(k_sender, k_item) {
var
k_eventData = kerio.waw.shared.k_methods.k_detectGridEditor.apply(this, arguments),
k_grid = k_eventData.k_grid,
k_data = k_eventData.k_rowData,
k_isLease = (false !== k_data.isLease),
k_isDuplicate = (true === k_data.isDuplicate),
k_sourceName = 'dhcpOptionEditor',
k_sendData = true,
k_objectName;
if (this.k_editationDisabled) {
return;
}
switch (k_eventData.k_eventId) {
case 'k_btnEdit':
k_objectName = k_sourceName + 'Edit';
break;
case 'k_btnAdd':
k_objectName = k_sourceName + 'Add';
k_sendData = !k_isLease && !k_isDuplicate; break;
case 'k_onDblClick':
case 'k_onEnter':
if ((!k_isLease && k_isDuplicate) || this.k_isAuditor) {
return; }
k_objectName = k_sourceName + (!k_isLease ? 'Add' : 'Edit');
break;
default:
kerio.lib.k_reportError('Internal error: Unsupported usage of this method.', 'dhcpServerList', 'k_openEditor');
return;
}
kerio.lib.k_ui.k_showDialog(
{
k_sourceName: k_sourceName,
k_objectName: k_objectName,
k_params: {
k_relatedGrid: k_grid,
k_data:       (k_sendData ? k_data : {})
}
}
);
} }); 