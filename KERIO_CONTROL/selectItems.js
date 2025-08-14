
kerio.waw.ui.selectItems = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_methods = k_shared.k_methods,
k_isAuditor = k_methods.k_isAuditor(),
k_gridId = k_localNamespace + 'grid',
k_isDomainSelect = false,
k_isGroupsInDomainSelect = true,
k_isUsersInDomainSelect = true,
k_displayEditButton = false,
k_GET_GROUPS_REQUEST_INDEX =  0,
k_GET_USERS_REQUEST_INDEX =  1,
k_isSelectServices = false,
k_isSelectByCheckbox = false,
k_isAlertsSelect = false,
k_dialogTitle = k_tr('Select Items', 'common'),
k_decorateWithHighlighting = k_methods.k_renderers.k_decorateWithHighlighting,
k_gridCfg,
k_grid,
k_dialogHeight,
k_dialogWidth,
k_dialogCfg,
k_dialog,
k_searchField, k_searchFieldCfg,
k_searchWidth,
k_domainsDataStore,
k_initGridData,
k_editButton,
k_definitionTypes,
k_definitionType,
k_onClickEdit,
k_columnNameRenderer,
k_columns;
k_definitionTypes = {
k_isIpAddressType: 'k_ipAddress',
k_isTimeRangeType: 'k_timeRange',
k_isUrlGroupType: 'k_urlGroup'
};
k_gridCfg = {
k_isEnterMappedToDoubleClick: false, 
k_onDblClick: function() {
if (this.k_isSelectServices && this.k_isSelectByCheckbox) {
this.k_selectionStatus.k_rows[0].k_data.selected = true;
}
var k_dialog = this.k_parentWidget;
k_dialog.k_selectItems.call(k_dialog);
},
k_toolbars: {},
k_filters: {
k_hasRightAlign: true }
};
k_dialogHeight = 400;
k_dialogWidth = 375;
k_searchWidth = 200; switch (k_objectName) {
case 'k_selectUsers':
k_gridCfg.k_className = 'userList';
k_gridCfg.k_settingsId = 'selectUsersList';
k_gridCfg.k_columns = {
k_items: [
{
k_columnId: 'k_id',
k_isDataOnly: true
},
{
k_columnId: 'nameRenderer',
k_caption: k_tr('Username', 'common'),

k_renderer: k_decorateWithHighlighting(function (k_value, k_data) {
var k_rendererData = kerio.waw.shared.k_methods.k_renderers.k_renderSimpleUserName(k_value, k_data);
k_data.nameRenderer = k_rendererData.k_data;
return k_rendererData;
})
},
{
k_columnId: 'fullNameRenderer',
k_caption: k_tr('Full Name', 'common')
},
{
k_columnId: 'descriptionRenderer',
k_caption: k_tr('Description', 'common')
}
]
};
break;
case 'k_selectGroups':
k_gridCfg.k_className = 'groupList';
k_gridCfg.k_settingsId = 'selectGroupsList';
k_gridCfg.k_columns = {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_items: [
{
k_columnId: 'k_id',
k_isDataOnly: true
},
{
k_columnId: 'nameRenderer',
k_caption: k_tr('Name', 'common'),

k_renderer: k_decorateWithHighlighting(k_methods.k_renderers.k_renderUserGroupName)
},
{
k_columnId: 'descriptionRenderer',
k_caption: k_tr('Description', 'common')
}
]
};
break;
case 'selectGeoipCountries':
k_gridCfg.k_className = 'countryList';
k_gridCfg.k_columns = {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_sorting: {
k_columnId: 'k_sortingIndex',
k_isAscending: true,
k_isRemoteSort: false
},
k_items: [
{
k_columnId: 'k_id',
k_isDataOnly: true
},
{
k_columnId: 'k_name',
k_isHidden: true,
k_isKeptHidden: true
},
{
k_columnId: 'k_sortingIndex',
k_caption: k_tr('Country', 'common'),
k_renderer: function(k_value, k_data) {
var
k_dataHighlighted = kerio.waw.shared.k_methods.k_renderers.k_highlightSearchValueRenderer.call(this, k_data.k_name);
return {
k_data: k_dataHighlighted,
k_isSecure: true
};
}
},
{
k_columnId: 'k_sortingIndex',
k_isSortable: true,
k_isDataOnly: true
}
]
};
break;
case 'selectServices':
case 'k_servicesWithoutGroups':
case 'k_servicesSelectedByCheckbox':
k_displayEditButton = 'k_servicesWithoutGroups' !== k_objectName; k_isSelectByCheckbox = 'k_servicesSelectedByCheckbox' === k_objectName;
k_isSelectServices = true;
k_gridCfg.k_className = 'serviceList';
k_gridCfg.k_settingsId = 'k_servicesWithoutGroups' === k_objectName ? 'servicesWithoutGroupsList' : 'selectServicesList';
k_gridCfg.k_isStateful = false;
k_columnNameRenderer = {
k_columnId: 'nameRenderer',
k_caption: k_tr('Name', 'common'),
k_width: 130,

k_renderer: k_decorateWithHighlighting(k_methods.k_renderers.k_renderServiceName)
};
if (k_isSelectByCheckbox) {
k_columnNameRenderer.k_editor = {
k_type: 'k_checkbox',
k_columnId: 'selected'
};
}
k_columns = [
{	k_columnId: 'k_id',
k_isHidden: true,
k_isKeptHidden: true,
k_renderer: function(k_value, k_data) {
k_data.k_sort = k_data.name.toLowerCase;
return {
k_data: ''
};
}
},
{	k_columnId: 'k_sort',
k_isDataOnly: true
},
k_columnNameRenderer,
{
k_columnId: 'descriptionRenderer',
k_caption: k_tr('Description', 'common'),
k_renderer: k_decorateWithHighlighting(k_methods.k_renderers.k_renderServiceDescription)
}
];
if (k_isSelectByCheckbox) {
k_columns.push({
k_columnId: 'selected',
k_isDataOnly: true
});
}
k_gridCfg.k_columns = {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_items: k_columns
};
k_dialogHeight = 450;
k_dialogWidth = 400;
k_onClickEdit = function(k_form, k_item) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'serviceListDialog',
k_initParams: {
k_onApplyResetHandler: kerio.waw.shared.k_methods.k_definitionApplyResetHandler
},
k_params: {
k_relatedWidget: k_item.k_dialog
}
});
};
break;
case 'k_selectUrlGroups':
k_definitionType = k_definitionTypes.k_isUrlGroupType;
k_displayEditButton = true;
k_gridCfg.k_isStateful = false;
k_gridCfg.k_columns = {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_items: [
{	k_columnId: 'k_id',
k_isDataOnly: true
},
{	k_columnId: 'nameRenderer',
k_caption: k_tr('Name', 'common'),
k_renderer: k_decorateWithHighlighting(function(k_value) {
return {
k_data: k_value,
k_iconCls: 'urlGroupIcon ugTypeGroup'
};
})
}
]
};
break;
case 'k_selectIpGroups':
k_definitionType = k_definitionTypes.k_isIpAddressType;
k_displayEditButton = true;
k_gridCfg.k_isStateful = false;
k_gridCfg.k_className = 'ipGroupList';
k_gridCfg.k_columns = {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_items: [
{	k_columnId: 'k_id',
k_isDataOnly: true
},
{	k_columnId: 'nameRenderer',
k_caption: k_tr('Name', 'common'),

k_renderer: k_decorateWithHighlighting(function(k_value, k_data) {
return {
k_data: k_value,
k_iconCls: 'ipGroupIcon agTypeGroup'
};
})
}
]
};
break;
case 'k_selectTrafficRule':
k_gridCfg.k_isStateful = false;
k_gridCfg.k_columns = {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_items: [
{	k_columnId: 'id',
k_isDataOnly: true
},
{	k_columnId: 'name',
k_caption: k_tr('Name', 'common'),
k_renderer: k_decorateWithHighlighting(function(k_value, k_data) {
return {
k_data: k_value,
k_iconCls: 'bandwidthManagement packetsIcon'
};
})
}
]
};
break;
case 'k_selectHttpRule':
k_gridCfg.k_isStateful = false;
k_gridCfg.k_columns = {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_items: [
{	k_columnId: 'id',
k_isDataOnly: true
},
{	k_columnId: 'name',
k_caption: k_tr('Name', 'common'),
k_renderer: function(k_value, k_data) {
return {
k_data: k_value,
k_iconCls: 'bandwidthManagement httpIcon'
};
}
}
]
};
break;
case 'k_selectFtpRule':
k_gridCfg.k_isStateful = false;
k_gridCfg.k_columns = {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_items: [
{	k_columnId: 'id',
k_isDataOnly: true
},
{	k_columnId: 'name',
k_caption: k_tr('Name', 'common'),
k_renderer: function(k_value, k_data) {
return {
k_data: k_value,
k_iconCls: 'bandwidthManagement ftpIcon'
};
}
}
]
};
break;
case 'k_selectContentRule':
k_gridCfg.k_isStateful = false;
k_gridCfg.k_columns = {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_items: [
{	k_columnId: 'id',
k_isDataOnly: true
},
{	k_columnId: 'name',
k_caption: k_tr('Name', 'common'),
k_renderer: k_decorateWithHighlighting(function(k_value, k_data) {
return {
k_data: k_value,
k_iconCls: 'bandwidthManagement contentFilterIcon'
};
})
}
]
};
break;
case 'k_selectInterfaceEntity':
k_gridCfg.k_isStateful = false;
k_gridCfg.k_className = 'interfaceList undead';
k_gridCfg.k_columns = {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_items: [
{	k_columnId: 'k_id',
k_isDataOnly: true
},
{	k_columnId: 'nameRenderer',
k_caption: k_tr('Name', 'common'),

k_renderer: k_decorateWithHighlighting(function (k_value, k_data) {
return kerio.waw.shared.k_methods.k_formatInterfaceName(k_value, k_data, false);
})
}
]
};
break;
case 'k_selectVpnEntity':
k_gridCfg.k_isStateful = false;
k_gridCfg.k_className = 'interfaceList undead';
k_gridCfg.k_columns = {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_items: [
{	k_columnId: 'k_id',
k_isDataOnly: true
},
{	k_columnId: 'nameRenderer',
k_caption: k_tr('Name', 'common'),

k_renderer: k_decorateWithHighlighting(function (k_value, k_data) {
return kerio.waw.shared.k_methods.k_formatInterfaceName(k_value, k_data, false);
})
}
]
};
break;
case 'k_selectMembersForRule':
case 'k_selectMembersForReport':
case 'k_selectGroupsFromDomain':
case 'k_selectUsersForReport':
k_isDomainSelect = true;
k_isGroupsInDomainSelect = 'k_selectMembersForReport' === k_objectName ? false : true;
k_isUsersInDomainSelect = 'k_selectGroupsFromDomain' === k_objectName ? false : true;
if (!k_isGroupsInDomainSelect && 0 < k_GET_USERS_REQUEST_INDEX) {
k_GET_USERS_REQUEST_INDEX = 0;
}
kerio.waw.shared.k_data.k_get('k_domains');
k_domainsDataStore = kerio.waw.shared.k_data.k_getStore('k_domains');
k_gridCfg.k_filters.k_combobox = {
k_caption: k_tr('Domain:', 'selectItems'),
k_dataStore: k_domainsDataStore,
k_gridRequestParamName: 'domainId',
k_onChange: function(k_toolbar, k_item, k_domainId) {
var
k_grid = this.k_parentWidget.k_parentWidget;
k_grid.k_parentWidget.k_loadDomainMembers();
}
};
k_gridCfg.k_settingsId = 'selectMembersList';
k_gridCfg.k_columns = {
k_grouping: (k_isGroupsInDomainSelect && k_isUsersInDomainSelect
? {
k_columnId: 'k_isGroup',
k_isMemberIndented: true
}
: undefined
),
k_items: [
{
k_columnId: 'k_id',
k_isDataOnly: true
},
{
k_columnId: 'nameRenderer',
k_caption: k_tr('Name', 'common'),

k_renderer: k_decorateWithHighlighting(function(k_value, k_data) {
if (true === k_data.k_isGroup) {
return kerio.waw.shared.k_methods.k_renderers.k_renderUserGroupName(k_value);
} else {
return kerio.waw.shared.k_methods.k_renderers.k_renderSimpleUserName(k_value, k_data);
}
})
},
{
k_columnId: 'fullNameRenderer',
k_caption: k_tr('Full Name', 'common'),
k_isDataOnly: !k_isUsersInDomainSelect
},
{
k_columnId: 'descriptionRenderer',
k_caption: k_tr('Description', 'common'),
k_isHidden: 'k_selectMembersForReport' === k_objectName
},
{
k_columnId: 'email',
k_caption: k_tr('Email', 'common'),
k_isHidden: 'k_selectMembersForReport' !== k_objectName,
k_isKeptHidden: !k_isUsersInDomainSelect
},
{	k_columnId: 'k_isGroup',
k_isHidden: true,
k_isKeptHidden: true,

k_groupRenderer: function(k_isGroup) {
return {
k_data: (k_isGroup ? this.k_trGroups : this.k_trUsers)
};
}
},
{	k_columnId: 'k_domainName',
k_isDataOnly: true
}
]
};
k_dialogWidth = 600;
break;
case 'k_selectSystemAlert':
k_isAlertsSelect = true;
k_isSelectByCheckbox = true;
k_gridCfg.k_isStateful = false;
k_dialogWidth = 400;
k_dialogHeight = 400;
k_gridCfg.k_onDblClick = undefined; k_gridCfg.k_columns = {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_items: [
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'name',
k_caption: k_tr('Name', 'common'),
k_width: 310,
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'selected'
}
},
{
k_columnId: 'selected',
k_isDataOnly: true
}
]
};
break;
} if (undefined === k_gridCfg.k_columns.k_sorting) {
k_gridCfg.k_columns.k_sorting = {
k_columnId: k_gridCfg.k_columns.k_items[1].k_columnId, k_isRemoteSort: false
};
}
if (k_isDomainSelect) {
k_grid = new kerio.adm.k_widgets.K_BasicListDomain(k_gridId, k_gridCfg);
k_grid.k_addReferences({
k_domainsDataStore: k_domainsDataStore,
k_GET_GROUPS_REQUEST_INDEX: k_GET_GROUPS_REQUEST_INDEX,
k_GET_USERS_REQUEST_INDEX: k_GET_USERS_REQUEST_INDEX,
k_isGroupsInDomainSelect: k_isGroupsInDomainSelect,
k_isUsersInDomainSelect: k_isUsersInDomainSelect
});
k_grid.k_toolbars.k_top.k_addWidget(
new kerio.lib.K_FormButton(
k_objectName + '_' + 'k_refreshData',
{
k_caption: k_tr('Refresh', 'selectItems'),
k_onClick: function(k_toolbar) {
var
k_grid = k_toolbar.k_parentWidget.k_parentWidget;
k_grid.k_showMask(kerio.lib.k_tr('Loading…', 'common'));
k_grid.k_loadDomainMembers(true);
}
}
), 2 );
}
else {
k_grid = new kerio.adm.k_widgets.K_BasicList(k_gridId, k_gridCfg);
}
if (k_isAlertsSelect) {
k_grid.k_addReferences({
k_isAlertsSelect: true,
k_parentGrid: k_grid
});
}
else {
k_searchFieldCfg = {
k_id: k_objectName + '_' + 'k_filter',
k_width: k_searchWidth,
k_parentGrid: k_grid,

k_onBeforeFilterChange: function() {
var
k_dialog = this.k_parentWidget;
this.k_clearSelections();
if (k_dialog.k_isDomainSelect) {
return false;
}
},
k_onKeyDown: function(k_toolbar, k_searchInput, k_event) {
if (13 === k_event.keyCode) {
k_event.stopPropagation();
k_event.preventDefault();
}
k_searchInput._k_onBeforeFilterChange.call(k_toolbar.k_parentWidget);
},
k_onKeyUp: function(k_parent) {
var
k_closureNewSearchValue = this.k_getValue(),
k_closureGrid = k_parent.k_relatedWidget;
if (k_closureNewSearchValue !== this._k_oldSearchValue) { clearTimeout(this._k_searchTimeout);
this._k_searchTimeout = setTimeout(function(){
k_closureGrid.k_filterRowsBy(function(k_rowData) {
var
k_search = k_closureNewSearchValue.toLowerCase(), k_fields = [
'name',
'k_name',
'nameRenderer',
'credentials.userName',
'fullNameRenderer',
'descriptionRenderer',
'email',
'group'
],
k_value,
k_i, k_cnt,
k_iMember, k_cntMembers,
k_members;
for (k_i = 0, k_cnt = k_fields.length; k_i < k_cnt; k_i++) {
k_value = k_rowData[k_fields[k_i]];
if (undefined === k_value || 'boolean' === typeof k_value) {
continue;
}
k_value = k_value.toLowerCase();
if (-1 < k_value.indexOf(k_search)) {
return true;
}
if (k_rowData.group && k_rowData.members && 0 < k_rowData.members.length) {
k_members = k_rowData.members;
for (k_iMember = 0, k_cntMembers = k_members.length; k_iMember < k_cntMembers; k_iMember++) {
k_value = k_members[k_iMember].name.toLowerCase();
if (-1 < k_value.indexOf(k_search)) {
return true;
}
}
}
}
return false;
});
this._k_oldSearchValue = k_closureNewSearchValue;
}, 300);
k_closureGrid._k_searchValue = k_closureNewSearchValue;
}
}
};
}
if (!k_isAlertsSelect) {
k_searchField = kerio.waw.shared.k_DEFINITIONS.k_get('k_gridSearchField', k_searchFieldCfg);
k_grid.k_toolbars.k_top.k_addWidget(k_searchField);
}
k_dialogCfg = {
k_width: k_dialogWidth,
k_height: k_dialogHeight,
k_content: k_grid,
k_title: k_dialogTitle,
k_isReadOnly: k_isAuditor,
k_defaultItem: k_searchField ? k_searchField.k_id : null,

k_onOkClick: function(k_toolbar) {
var k_dialog = k_toolbar.k_dialog;
k_dialog.k_selectItems.call(k_dialog);
}
};
k_dialogCfg = k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialogCfg.k_hasHelpIcon = false; if (k_displayEditButton) {
if (undefined === k_onClickEdit) {
k_onClickEdit = function(k_form, k_item) {
var
k_objectName,
k_widgetType;
switch (k_item._k_definitionType) {
case k_item._k_definitionTypes.k_isIpAddressType:
k_objectName = 'ipAddressListDialog';
k_widgetType = 'k_ipAddressType';
break;
case k_item._k_definitionTypes.k_isTimeRangeType:
k_objectName = 'timeRangeListDialog';
k_widgetType = 'k_timeRangeType';
break;
case k_item._k_definitionTypes.k_isUrlGroupType:
k_objectName = 'urlGroupListDialog';
k_widgetType = 'k_urlGroupType';
break;
default:
kerio.lib.k_reportError('Unsuported type of definition select', 'definitionSelect.js');
break;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'definitionDialog',
k_objectName:  k_objectName,
k_initParams: {
k_showApplyReset: true,
k_widgetType: k_widgetType,
k_onApplyResetHandler: function(k_toolbar, k_button) {
var
k_selectItemsDialog = k_toolbar.k_parentWidget.k_params.k_relatedWidget;
if (k_selectItemsDialog.k_parentGrid.k_requestClearEmbeddedDefinitions) {
k_selectItemsDialog.k_parentGrid.k_requestClearEmbeddedDefinitions();
}
kerio.waw.shared.k_methods.k_definitionApplyResetHandler(k_toolbar, k_button);
},
k_gridConfig: {
k_pageSize: 500,
k_useItemStatus: true,
k_hasSharedItems: true
}
},
k_params: {
k_relatedWidget: k_item.k_dialog,
k_relatedSelectCfg: k_item.k_selectCfg
}
});
};
}
k_dialogCfg.k_buttons.unshift('->');
k_dialogCfg.k_buttons.unshift({
k_id: 'k_btnEdit',
k_caption: k_tr('Edit…', 'wlibButtons'),
k_isHidden: k_isAuditor,
k_onClick: k_onClickEdit
});
}
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
if (k_displayEditButton) {
k_editButton = k_dialog.k_toolbar.k_items.k_btnEdit;
k_editButton.k_addReferences({
_k_definitionType: k_definitionType || 'k_ipAddress',
_k_definitionTypes: k_definitionTypes,
_k_definitionWidget: false,
k_selectCfg: {
k_fieldValue: 'id',
k_fieldDisplay: 'name'
},
k_dialog: k_dialog
});
}
if (k_isDomainSelect) {

k_initGridData = function() {
var
k_grid = this.k_grid,
k_currentDomainData = k_grid.k_getCurrentDomainData();
k_grid.k_syncData();
if (null === k_currentDomainData) {return;
}
this.k_loadDomainMembers();
};
}
else {
k_initGridData = function() {
this.k_grid.k_beginUpdate();
this.k_loadItems(this.k_loadParams);
};
}
k_dialog.k_addReferences({
k_grid: k_grid,
k_objectName: k_objectName, k_initGridData: k_initGridData,
k_loadParams: undefined, k_dataStore: undefined,
k_searchField: k_searchField,
k_getDataParams: undefined,
k_isDomainSelect: k_isDomainSelect,
k_autoAddCallback: undefined
});
k_grid.k_addReferences({
k_trGroups: k_tr('Groups', 'menuTree'),
k_trUsers:  k_tr('Users', 'menuTree'),
k_isSelectByCheckbox: k_isSelectByCheckbox,
k_isSelectServices: k_isSelectServices
});
this.k_addControllers(k_dialog);
if (k_isSelectServices) {
k_dialog.k_nonMappedObserver = function() {
this.k_initGridData();
};
k_grid.k_addReferences({
k_serviceStore: kerio.waw.shared.k_data.k_get('k_services', true)
});
}
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function(k_params){
var k_grid = this.k_grid;
this.k_parentGrid = k_params.k_parentGrid;
k_grid.k_clearData();
k_grid.k_fixItems = k_params.k_fixItems;
k_grid.k_onlyFixItems = k_params.k_onlyFixItems;
k_grid.k_setSingleRowSelection('k_single' === k_params.k_selectionMode);
this.k_selectionCallback = (false !== k_params.k_autoAdd)
? undefined : k_params.k_callback;
this.k_autoAddCallback = k_params.k_autoAddCallback;
this.k_loadParams = k_params;
this.k_initGridData();
};

k_kerioWidget.k_nonMappedObserver = function() {
if (this.k_objectName === kerio.waw.shared.k_methods._k_getMainScreen().k_id) {
this.k_initGridData();
}
};

k_kerioWidget.k_mappedObserver = function() {
if (this.k_objectName === kerio.waw.shared.k_methods._k_getMainScreen().k_id) {
this.k_loadDomainMembers();
}
};

k_kerioWidget.k_loadItems = function(k_params) {
var
k_sharedData = kerio.waw.shared.k_data,
k_getData = k_params.k_getData || this.k_getDataParams,
k_data = [],
k_dataStore;
this.k_showMask(kerio.lib.k_tr('Loading…', 'common'));
if(this.k_grid.k_onlyFixItems) {
this.k_loadItemsCallback(k_data, k_params);
return;
}
if (this.k_grid.k_isAlertsSelect) {
k_data = kerio.waw.ui.accountingList.k_alertTypesList;
}
else if (k_getData) {
this.k_getDataParams = k_getData;
kerio.waw.requests.k_send({
k_jsonRpc: {
method: k_getData.object + '.' + k_getData.method,
params: k_getData.params
},
k_scope: this,
k_callbackParams: {
k_params: k_params
},
k_callback: function(k_response, k_success, k_callbackParams) {
if (k_success && k_response.k_isOk) {
this.k_loadItemsCallback(k_response.k_decoded.list, k_callbackParams.k_params);
}
}
});
return;
}
else {
k_dataStore = k_sharedData.k_get(this.k_objectName);
if (!k_dataStore.k_isLoaded()) {
k_sharedData.k_registerObserver(
k_dataStore,
this.k_nonMappedObserver,
this
);
return;
}
k_data = k_dataStore.k_getData();
}
this.k_loadItemsCallback(k_data, k_params);
};

k_kerioWidget.k_loadItemsCallback = function(k_data, k_params) {
var
k_grid = this.k_grid,
k_fixItems = k_grid.k_fixItems,
k_map = {},
k_selectedItems,
k_id,
k_i, k_cnt,
k_iSelectedItem, k_cntSelectedItem,
k_item,
k_dataId;
k_params = k_params || {};
k_id = k_params.k_id || 'id';
if (k_fixItems && Array === k_fixItems.constructor) {
k_data = k_fixItems.concat(k_data);
}
if (0 === k_data.length) {
this.k_hideMask();
return; }
k_map[k_id] = 'k_id';
k_map[k_params.k_name || 'name'] = 'nameRenderer';
k_map[k_params.k_fullName || 'fullName'] = 'fullNameRenderer';
k_map[k_params.k_description || 'description'] = 'descriptionRenderer';
if (k_grid.k_isSelectByCheckbox) {
k_selectedItems = k_params.k_selectedItems;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_item = k_data[k_i];
k_dataId = k_item[k_id];
k_item.selected = false;
for (k_iSelectedItem = 0, k_cntSelectedItem = k_selectedItems.length; k_iSelectedItem < k_cntSelectedItem; k_iSelectedItem++) {
if (k_dataId === k_selectedItems[k_iSelectedItem]) {
k_item.selected = true;
k_selectedItems.splice(k_iSelectedItem, 1);
}
}
}
}
k_grid.k_setData(k_data, {k_append: false, k_mapping: k_map});
this.k_id = k_id;
if (k_params.k_onlyNew) {
k_grid.k_filterRowsBy(this.k_filterRows);
}
k_grid.k_endUpdate();
this.k_hideMask();
if (k_params.k_selectItemId) {
k_grid.k_preselectRowId = k_params.k_selectItemId;
kerio.waw.shared.k_DEFINITIONS.k_preselectRowById.defer(500, k_grid);
}
kerio.lib.k_unmaskWidget.defer(550, this, [k_grid]);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); if (this.k_searchedValue) {
this.k_searchField.k_setValue(this.k_searchedValue);
this.k_searchField.k_filter();
this.k_searchField.k_focus();
}
};

k_kerioWidget.k_filterRows = function(k_rowData) {
var
k_dialog = this.k_parentWidget,
k_id = k_dialog.k_id,
k_row = k_dialog.k_parentGrid.k_findRow(k_id, k_rowData[k_id]);
return (0 > k_row); };

k_kerioWidget.k_isAnyRowSelectedByCheckbox = function(k_data) {
return k_data.selected;
};

k_kerioWidget.k_selectItems = function() {
var
k_lib = kerio.lib,
k_grid = this.k_grid,
k_isNothingSelected,
k_selectedRows;
if (k_grid.k_isSelectByCheckbox) {
k_selectedRows = k_grid.k_findRowBy(this.k_isAnyRowSelectedByCheckbox);
k_isNothingSelected = null === k_selectedRows;
}
else {
k_isNothingSelected = 0 === k_grid.k_selectionStatus.k_selectedRowsCount;
}
if (k_isNothingSelected) {
k_lib.k_alert({
k_title: k_lib.k_tr('Select Items', 'common'),
k_msg: k_lib.k_tr('Please select at least one item from the list.', 'selectItems'),
k_callback: k_grid.k_removeSelection, k_scope: k_grid
});
this.k_hideMask();
return;
}
if (undefined !== this.k_selectionCallback) {
this.k_returnIds();
}
else {
this.k_setItems();
}
};

k_kerioWidget.k_setItems = function() {
var
k_parentGrid = this.k_parentGrid,
k_parentGridIdColumn = this.k_loadParams.k_parentGridIdColumn || 'id',
k_selectedItems = this.k_grid.k_getRowsData(true),
k_regExpValue,
k_data,
k_cnt, k_i;
for (k_i = 0, k_cnt = k_selectedItems.length; k_i < k_cnt; k_i++) {
k_data = k_selectedItems[k_i];
k_regExpValue = new RegExp('^' + k_data[this.k_id] + '$');
if (-1 === k_parentGrid.k_findRow(k_parentGridIdColumn, k_regExpValue)) {
k_parentGrid.k_addRow(k_data);
}
}
this.k_parentGrid.k_resortRows();
if (this.k_autoAddCallback) {
this.k_autoAddCallback.call(this.k_parentGrid);
}
this.k_hide();
};

k_kerioWidget.k_returnIds = function() {
var
k_grid = this.k_grid,
k_selectedIds = [],
k_selectedItems = k_grid.k_getRowsData(true),
k_currentDomain = '',
k_allItems,
k_cnt, k_i;
k_grid.k_clearRowFilter();
k_allItems = k_grid.k_getData();
if (true !== k_grid.k_isSelectByCheckbox) {
for (k_i = 0, k_cnt = k_selectedItems.length; k_i < k_cnt; k_i++) {
k_selectedIds.push(k_selectedItems[k_i].k_id);
k_currentDomain = k_selectedItems[k_i].domainName; }
}
if (false !== this.k_selectionCallback.call(this.k_parentGrid, k_selectedIds, k_allItems, k_currentDomain, k_selectedItems)) {
this.k_hide();
}
else {
this.k_hideMask();
}
};

k_kerioWidget.k_grid.k_removeSelection = function() {
this.k_selectRows([]); };

k_kerioWidget.k_loadDomainMembers = function(k_forceReload){
var
k_grid = this.k_grid,
k_currentDomainId = k_grid.k_getCurrentDomainData().id,
k_shared = kerio.waw.shared,
k_sharedData = k_shared.k_data,
k_data = [],
k_usersStore,
k_groupsStore;
k_forceReload = (undefined === k_forceReload) ? false : k_forceReload;
this.k_showMask(kerio.lib.k_tr('Loading…', 'common'));
if (k_grid.k_isUsersInDomainSelect) {
k_usersStore = k_sharedData.k_get('k_users', k_forceReload, {k_domainId: k_currentDomainId});
if (!k_usersStore.k_isLoaded()) {
k_sharedData.k_registerObserver(
k_usersStore,
this.k_mappedObserver,
this
);
}
k_data[k_grid.k_GET_USERS_REQUEST_INDEX] = k_usersStore.k_getData();
}
if (k_grid.k_isGroupsInDomainSelect) {
k_groupsStore = k_sharedData.k_get('k_groups', k_forceReload, {k_domainId: k_currentDomainId});
if (!k_groupsStore.k_isLoaded()) {
k_sharedData.k_registerObserver(
k_groupsStore,
this.k_mappedObserver,
this
);
}
k_data[k_grid.k_GET_GROUPS_REQUEST_INDEX] = k_groupsStore.k_getData();
}
if (0 === k_grid.k_GET_USERS_REQUEST_INDEX) {
k_grid.k_GET_USERS_REQUEST_INDEX = 1;
}
if ((k_grid.k_isUsersInDomainSelect && !k_usersStore.k_isLoaded()) || (this.k_isGroupsInDomainSelect && !k_groupsStore.k_isLoaded())) {
return;
}
this.k_fillGridData(k_data);
};

k_kerioWidget.k_loadDomainError =  function(k_response) {
var
k_results = k_response.k_decoded.result,
k_cnt = k_results.length,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_results[k_i].error) {
kerio.waw.shared.k_methods.k_alertError(k_results[k_i].error);
return true;
}
}
return false;
};

k_kerioWidget.k_fillGridData = function(k_membersData){
var
k_filterByLocalData = 'k_selectUsersForReport' === this.k_objectName,
k_grid = this.k_grid,
k_gridData = [],
k_domainName,
k_member,
k_data,
k_isGroup,
k_i, k_cntRequests,
k_j, k_cntItems,
k_k, k_cntLclData,
k_filterByGatheredGroups,
k_localData = false;
k_grid.k_clearData();
k_domainName =  k_grid.k_domainsDataStore.k_domains.k_data[k_grid.k_getCurrentDomainData().id].service.domainName;
if (k_filterByLocalData) {
k_filterByGatheredGroups = this.k_getMainWidget().k_parentGrid.k_getMainWidget().k_gatheredGroups;
k_localData = [];
k_cntLclData = k_filterByGatheredGroups.length;
for (k_k = 0; k_k < k_cntLclData; k_k++) {
k_localData[k_filterByGatheredGroups[k_k].id] = k_filterByGatheredGroups[k_k];
}
}
for (k_i = 0, k_cntRequests = k_membersData.length; k_i < k_cntRequests; k_i++) {
k_data = k_membersData[k_i];
if (!k_data) {
continue;
}
k_isGroup = (k_i === k_grid.k_GET_GROUPS_REQUEST_INDEX && k_grid.k_isGroupsInDomainSelect);
for (k_j = 0, k_cntItems = k_data.length; k_j < k_cntItems; k_j++) {
k_member = k_data[k_j];
if (!k_isGroup) {
k_gridData.push({
k_id: k_member.id,
nameRenderer: k_member.credentials.userName,
k_isGroup: k_isGroup,
fullNameRenderer: k_member.fullName,
descriptionRenderer: k_member.description,
id: k_member.id,
name: k_member.credentials.userName,
fullName: k_member.fullName,
description: k_member.description,
isGroup: k_isGroup,
domainName: k_domainName,
email: k_member.email
});
}
else {
if (false === k_localData || k_localData[k_member.id]) {
k_gridData.push({
k_id: k_member.id,
nameRenderer: k_member.name,
k_isGroup: k_isGroup,
fullNameRenderer: '',
descriptionRenderer: k_member.description,
id: k_member.id,
name: k_member.name,
isGroup: k_isGroup,
fullName: '',
description: k_member.description,
domainName: k_domainName,
email: k_member.email
});
}
}
}
}
k_grid.k_setData(k_gridData);
this.k_initSearchField();
k_grid.k_clearSelections();
k_grid.k_scrollToTop();
this.k_hideMask();
};

k_kerioWidget.k_initSearchField = function() {
if (this.k_searchField) {
this.k_searchField.k_reset(); this.k_searchField.k_focus(200, this.k_searchField); }
};

k_kerioWidget.k_resetOnClose = function() {
var
k_isContentChanged;
if (this.k_parentGrid.k_updateEmbeddedDefinitions) {
k_isContentChanged = kerio.waw.status.k_currentScreen.k_isContentChanged();
this.k_parentGrid.k_updateEmbeddedDefinitions();
if (!k_isContentChanged) {
kerio.adm.k_framework.k_enableApplyReset(false);
}
}
if (this.k_searchField) {
this.k_searchField.k_reset();
}
this.k_grid._k_searchValue = '';
};

k_kerioWidget.k_updateRelatedFields = function(k_data) {
var
k_dataStore = kerio.waw.shared.k_data.k_get(this.k_objectName);
k_dataStore.k_clearData();
k_dataStore.k_setData(k_data);
this.k_grid.k_clearData();
this.k_loadItemsCallback(k_data);
};
}
}; 