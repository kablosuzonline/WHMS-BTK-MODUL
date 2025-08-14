
kerio.waw.ui.bandwidthManagementTrafficEditor = {

k_init: function(k_objectName, k_initParams) {
var
k_shared = kerio.waw.shared,
k_methods = k_shared.k_methods,
k_tr = kerio.lib.k_tr,
k_conditionTypes = k_shared.k_CONSTANTS.BMConditionType,
k_trafficTypes = k_shared.k_CONSTANTS.BMTrafficType,
k_localNamespace = k_objectName + '_',
k_SELECT_ITEMS_USERS = 'k_selectMembersForRule',
k_SELECT_ITEMS_SERVICE = 'selectServices',
k_SELECT_ITEMS_TRAFFIC_RULE = 'k_selectTrafficRule',
k_SELECT_ITEMS_HTTP_RULE = 'k_selectHttpRule',
k_SELECT_ITEMS_FTP_RULE = 'k_selectFtpRule',
k_SELECT_ITEMS_CONTENT_RULE = 'k_selectContentRule',
k_gridCfg, k_grid,
k_dialogCfg, k_dialog,
k_datastore,
k_addCondition,
k_selectItemsCallback,
k_openSelectItemsDialog,
k_openRowEditor;

k_selectItemsCallback = function (k_selectedItems, k_allData, k_currentDomain, k_selectedData) {
var
BMConditionApplication = this.k_conditionTypes.BMConditionApplication,
BMConditionUsers = this.k_conditionTypes.BMConditionUsers,
BMConditionHosts = this.k_conditionTypes.BMConditionHosts,
BMConditionService = this.k_conditionTypes.BMConditionService,
k_gridData = this.k_getData(),
k_get = kerio.waw.shared.k_DEFINITIONS.k_get,
k_type = this.k_currentType,
k_store = [],
k_itemData,
k_data,
k_i, k_cnt;
if (BMConditionApplication === k_type) {
for (k_i = k_gridData.length - 1; k_i >= 0; k_i--) {
k_itemData = k_gridData[k_i];
if (BMConditionApplication === k_itemData.type) {
this.k_removeRowByIndex(k_i);
}
}
this.k_datastore.k_fillData(this.k_getData());
for (k_i = 0, k_cnt = k_selectedItems.length; k_i < k_cnt; k_i++) {
k_itemData = k_selectedItems[k_i];
k_data = {
type: k_type,
id: k_itemData.id,
group: k_itemData.name,
name: k_itemData.name,
types: k_itemData.types,
subGroup: k_itemData.subGroup
};
k_data = k_get('k_bandwidthTrafficDataTemplate', k_data);
k_store.push(k_data);
}
k_store = kerio.waw.shared.k_methods.k_filterApplications(k_store);
}
else {
for (k_i = 0, k_cnt = k_selectedData.length; k_i < k_cnt; k_i++) {
k_itemData = k_selectedData[k_i];
k_data = {
type: k_type
};
if (BMConditionUsers === k_type) {
k_data.user = {
id: k_itemData.id,
name: k_itemData.name,
isGroup: k_itemData.isGroup,
domainName: k_itemData.domainName
};
}
else if (BMConditionHosts === k_type) {
k_data.user = {
id: k_itemData.id,
name: k_itemData.name,
isGroup: k_itemData.isGroup,
domainName: k_itemData.domainName
};
}
else if (BMConditionService === k_type) {
k_data.service = {
id: k_itemData.id,
name: k_itemData.name,
isGroup: k_itemData.group
};
}
else {
k_data.valueId = {
id: k_itemData.id,
name: k_itemData.name
};
}
k_data = k_get('k_bandwidthTrafficDataTemplate', k_data);
k_store.push(k_data);
}
}
this.k_fillDataFromRuleDataStore(k_store);
};

k_openSelectItemsDialog = function(k_type, k_selectItemId) {
var
BMConditionApplication = this.k_conditionTypes.BMConditionApplication,
k_grid = this.k_parentWidget.k_grid,
k_sourceName = 'selectItems',
k_selectedApplicationIds,
k_data,
k_i, k_cnt,
k_subGroupItems,
k_j, k_cnt2;
if (BMConditionApplication === k_grid.k_currentType) {
k_sourceName = 'applicationSelectItems';
k_selectedApplicationIds = [];
k_data = k_grid.k_getData();
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (BMConditionApplication === k_data[k_i].type) {
if (k_data[k_i].k_isWholeSubGroup) {
k_subGroupItems = kerio.waw.shared.k_methods.k_getSubGroupItems(k_data[k_i].subGroup);
for (k_j = 0, k_cnt2 = k_subGroupItems.length; k_j < k_cnt2; k_j++) {
k_selectedApplicationIds.push(k_subGroupItems[k_j].id);
}
}
else {
k_selectedApplicationIds = k_selectedApplicationIds.concat(k_data[k_i].applications);
}
}
}
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: k_sourceName,
k_objectName: k_type,
k_params: {
k_onlyNew: false, k_parentGrid: k_grid,
k_autoAdd: false, k_callback: k_grid.k_selectItemsCallback,
k_selectedItems: k_selectedApplicationIds,
k_selectItemId: k_selectItemId
}
});
};

k_addCondition = function(k_toolbar, k_button) {
var
k_grid = k_toolbar.k_relatedWidget,
k_conditionTypes = k_grid.k_conditionTypes,
k_buttonId = k_button.k_name,
k_get = kerio.waw.shared.k_DEFINITIONS.k_get;
switch (k_buttonId) {
case 'k_btnApplications':
k_grid.k_currentType = k_conditionTypes.BMConditionApplication;
k_grid.k_openSelectItemsDialog('k_selectApplication');
break;
case 'k_btnUsers':
k_grid.k_currentType = k_grid.k_conditionTypes.BMConditionUsers;
k_grid.k_openSelectItemsDialog(k_grid.k_SELECT_ITEMS_USERS);
break;
case 'k_btnHosts':
k_grid.k_currentType = k_grid.k_conditionTypes.BMConditionHosts;
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'trafficHostEditorBW',
k_objectName: 'trafficHostAddBW',
k_params: {
k_parentGrid: k_grid
}
});
break;
case 'k_btnQuota':
k_grid.k_fillDataFromRuleDataStore.call(k_grid, k_get('k_bandwidthTrafficDataTemplate', { type: k_conditionTypes.BMConditionQuota }));
break;
case 'k_btnTransfer':
k_grid.k_fillDataFromRuleDataStore.call(k_grid, k_get('k_bandwidthTrafficDataTemplate', { type: k_conditionTypes.BMConditionLargeData }));
break;
case 'k_btnService':
k_grid.k_currentType = k_grid.k_conditionTypes.BMConditionService;
k_grid.k_openSelectItemsDialog(k_grid.k_SELECT_ITEMS_SERVICE);
break;
case 'k_btnPackets':
k_grid.k_currentType = k_grid.k_conditionTypes.BMConditionTrafficRule;
k_grid.k_openSelectItemsDialog(k_grid.k_SELECT_ITEMS_TRAFFIC_RULE);
break;
case 'k_btnTraffic':
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'bandwidthManagementTrafficTypeEditor',
k_params: {
k_relatedGrid: k_grid
}
});
break;
case 'k_btnDscp':
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'bandwidthManagementDscpEditor',
k_params: {
k_relatedGrid: k_grid
}
});
break;
case 'k_btnContentFilter':
k_grid.k_currentType = k_grid.k_conditionTypes.BMConditionContentRule;
k_grid.k_openSelectItemsDialog(k_grid.k_SELECT_ITEMS_CONTENT_RULE);
break;
case 'k_addGuestInterfaces':
k_grid.k_fillDataFromRuleDataStore.call(k_grid, k_get('k_bandwidthTrafficDataTemplate', { type: k_conditionTypes.BMConditionGuests }));
break;
}
}; k_datastore = k_methods.k_createRuleDataStore({
k_setItemSorting: k_initParams.k_setTrafficItemSorting,
k_sortItems: k_initParams.k_sortItems,
k_grid: k_initParams.k_grid,
k_typeInvalid: k_conditionTypes.BMConditionInvalid
});
k_datastore.k_groups[k_conditionTypes.BMConditionApplication] = k_shared.k_DEFINITIONS.k_APPLICATION_DATA_STORE_GROUP;
k_datastore.k_groups[k_conditionTypes.BMConditionTrafficType] = {
k_add: function(k_item) {
var
k_compare = this.k_compare,
k_data = this.k_data,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_compare(k_data[k_i], k_item)) {
return;
}
}
k_data.push(k_item);
},
k_data: [],
k_sort: function(k_first, k_second) {
var
k_translations = kerio.waw.shared.k_DEFINITIONS.k_BM_TRAFFIC_TYPE_TRANSLATIONS;
return k_translations[k_first.trafficType].localeCompare(k_translations[k_second.trafficType]);
},
k_compare: function(k_first, k_second) {
return k_first.trafficType === k_second.trafficType;
},
k_removeByType: function(k_type) {
var
k_data = this.k_data,
k_cnt = k_data.length,
k_i;
for (k_i = k_cnt - 1; k_i >= 0; k_i--) {
if (k_type === k_data[k_i].trafficType) {
k_data.splice(k_i, 1);
}
}
}
};
k_datastore.k_groups[k_conditionTypes.BMConditionLargeData] = {
k_add: function(k_item) {
if (0 === this.k_data.length) {
this.k_data.push(k_item);
}
},
k_data: [],
k_sort: k_methods.k_emptyFunction, k_compare: function(k_first, k_second) {
return k_first.type === k_second.type;
}
};
k_datastore.k_groups[k_conditionTypes.BMConditionUsers] = {
k_add: function(k_item) {
var
k_compare = this.k_compare,
k_data = this.k_data,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_compare(k_data[k_i], k_item)) {
return;
}
}
k_data.push(k_item);
},
k_data: [],
k_sort: function(k_first, k_second) {
return k_first.user.name.localeCompare(k_second.user.name);
},
k_sortItems: k_initParams.k_sortItems,
k_compare: function(k_first, k_second) {
return k_first.user.id === k_second.user.id;
}
};
k_datastore.k_groups[k_conditionTypes.BMConditionHosts] = {
k_add: function (k_item) {
var
k_compare = this.k_compare,
k_data = this.k_data,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_compare(k_data[k_i], k_item)) {
return;
}
}
k_data.push(k_item);
},
k_data: [],
k_sort: function (k_first, k_second) {
if (k_first.hostStr)
return k_first.hostStr < k_second.hostStr;
else
return false;
},
k_sortItems: k_initParams.k_sortItems,
k_compare: function (k_first, k_second) {
if (k_first.hostStr)
return k_first.hostStr === k_second.hostStr;
else
return false;
},
k_removeByValue: function (k_value) {
var
k_data = this.k_data,
k_cnt = k_data.length,
k_i;
for (k_i = k_cnt - 1; k_i >= 0; k_i--) {
if (k_value === k_data[k_i].hostStr) {
k_data.splice(k_i, 1);
}
}
}
};
k_datastore.k_groups[k_conditionTypes.BMConditionQuota] = {
k_add: function(k_item) {
if (0 === this.k_data.length) {
this.k_data.push(k_item);
}
},
k_data: [],
k_sort: k_methods.k_emptyFunction, k_compare: function(k_first, k_second) {
return k_first.type === k_second.type;
}
};
k_datastore.k_groups[k_conditionTypes.BMConditionTrafficRule] = {
k_add: function(k_item) {
var
k_compare = this.k_compare,
k_data = this.k_data,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_compare(k_data[k_i], k_item)) {
return;
}
}
k_data.push(k_item);
},
k_data: [],
k_sort: function(k_first, k_second) {
if (k_first.valueId.name < k_second.valueId.name) {
return -1;
}
return 1;
},
k_compare: function(k_first, k_second) {
return k_first.valueId.id === k_second.valueId.id;
}
};
k_datastore.k_groups[k_conditionTypes.BMConditionContentRule] = kerio.lib.k_cloneObject(k_datastore.k_groups[k_conditionTypes.BMConditionTrafficRule]);
k_datastore.k_groups[k_conditionTypes.BMConditionService] = {
k_add: function(k_item) {
var
k_compare = this.k_compare,
k_data = this.k_data,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_compare(k_data[k_i], k_item)) {
return;
}
}
k_data.push(k_item);
},
k_data: [],
k_sort: function(k_first, k_second) {
if (k_first.service.name < k_second.service.name) {
return -1;
}
return 1;
},
k_compare: function(k_first, k_second) {
return k_first.service.name === k_second.service.name;
}
};
k_datastore.k_groups[k_conditionTypes.BMConditionDscp] = {
k_add: function(k_item) {
var
k_compare = this.k_compare,
k_data = this.k_data,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_compare(k_data[k_i], k_item)) {
return;
}
}
k_data.push(k_item);
},
k_data: [],
k_sort: function(k_first, k_second) {
if (k_first.dscp < k_second.dscp) {
return -1;
}
return 1;
},
k_compare: function(k_first, k_second) {
return k_first.dscp === k_second.dscp;
},
k_removeByValue: function(k_value) {
var
k_data = this.k_data,
k_cnt = k_data.length,
k_i;
for (k_i = k_cnt - 1; k_i >= 0; k_i--) {
if (k_value === k_data[k_i].dscp) {
k_data.splice(k_i, 1);
}
}
}
};
k_datastore.k_groups[k_conditionTypes.BMConditionGuests] = kerio.lib.k_cloneObject(k_datastore.k_groups[k_conditionTypes.BMConditionQuota]);

k_openRowEditor = function(k_grid, k_rowData) {
var
k_conditionTypes = k_grid.k_conditionTypes,
k_type = k_rowData.type;
switch (k_type) {
case k_conditionTypes.BMConditionApplication:
k_grid.k_currentType = k_conditionTypes.BMConditionApplication;
k_grid.k_openSelectItemsDialog('k_selectApplication', k_rowData.appId);
break;
case k_conditionTypes.BMConditionTrafficType:
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'bandwidthManagementTrafficTypeEditor',
k_params: {
k_relatedGrid: k_grid,
k_preselectId: k_rowData.trafficType
}
});
break;
case k_conditionTypes.BMConditionUsers:
k_grid.k_currentType = k_grid.k_conditionTypes.BMConditionUsers;
k_grid.k_openSelectItemsDialog(k_grid.k_SELECT_ITEMS_USERS);
break;
case k_conditionTypes.BMConditionHosts:
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'trafficHostEditorBW',
k_objectName: 'trafficHostEditBW',
k_params: {
k_parentGrid: k_grid,
k_preselectValue: k_rowData.hostStr
}
});
break;
case k_conditionTypes.BMConditionTrafficRule:
k_grid.k_currentType = k_grid.k_conditionTypes.BMConditionTrafficRule;
k_grid.k_openSelectItemsDialog(k_grid.k_SELECT_ITEMS_TRAFFIC_RULE);
break;
case k_conditionTypes.BMConditionContentRule:
k_grid.k_currentType = k_grid.k_conditionTypes.BMConditionContentRule;
k_grid.k_openSelectItemsDialog(k_grid.k_SELECT_ITEMS_CONTENT_RULE);
break;
case k_conditionTypes.BMConditionService:
k_grid.k_currentType = k_grid.k_conditionTypes.BMConditionService;
k_grid.k_openSelectItemsDialog(k_grid.k_SELECT_ITEMS_SERVICE);
break;
case k_conditionTypes.BMConditionDscp:
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'bandwidthManagementDscpEditor',
k_params: {
k_relatedGrid: k_grid,
k_preselectValue: k_rowData.dscp
}
});
break;
}
};
k_gridCfg = {
k_title: k_tr('The rule processes the traffic between the local network and the Internet.', 'bandwidthManagementTrafficEditor') + '<br />' + k_tr('The rule applies if at least one of the following conditions is matched:', 'bandwidthManagementTrafficEditor'),
k_className: 'gridWithSimpleTextAbove noGridHeader',
k_emptyMsg: k_tr('Any traffic', 'bandwidthManagementTrafficEditor'),
k_removeFunction: k_methods.k_onClickRemoveRuleDataStore,
k_columns: {
k_grouping: {
k_columnId: 'k_group',
k_isMemberIndented: true
},
k_items: [
{
k_columnId: 'k_group',
k_caption: 'Type',
k_isHidden: true,
k_isKeptHidden: true,
k_groupRenderer: function(k_value, k_data) {
return {
k_data: this.k_trCache[k_data.type] || this.k_trCache[this.k_multilineProperties.BMConditionType.BMConditionInvalid]
};
}
},
{
k_columnId: 'k_trafficRenderer',
k_renderer: k_methods.k_renderers.k_lineRenderTraffic
}
]
},
k_onDblClick: k_openRowEditor,
k_toolbars: {
k_bottom: {
k_items: [
{
k_id: 'k_btnApplications',
k_caption: k_tr('Applications and Web Categories', 'contentEditor'),
k_iconCls: 'bandwidthManagement appIcon',
k_onClick: k_addCondition
},
{
k_id: 'k_btnTraffic',
k_caption: k_tr('Traffic Type', 'bandwidthManagementTrafficEditor'),
k_iconCls: 'bandwidthManagement trafficTypeIcon',
k_onClick: k_addCondition
},
{
k_id: 'k_btnTransfer',
k_caption: k_tr('Large Data Transfers', 'bandwidthManagementTrafficEditor'),
k_iconCls: 'bandwidthManagement largeDataTransfersIcon',
k_onClick: k_addCondition
},
{
k_id: 'k_btnUsers',
k_caption: k_tr('Users and Groups', 'trafficSourceDestinationEditor'),
k_iconCls: 'gridListIcon userIcon',
k_onClick: k_addCondition
},
{
k_id: 'k_btnHosts',
k_caption: k_tr('Hosts', 'trafficHostEditorBW'),
k_iconCls: 'gridListIcon ipGroupIcon agTypeHost',
k_onClick: k_addCondition
},
{
k_id: 'k_btnQuota',
k_caption: k_tr('Exceeded Quota', 'bandwidthManagementTrafficEditor'),
k_title: k_tr('Users with exceeded quota', 'bandwidthManagementTrafficEditor'),
k_iconCls: 'bandwidthManagement exceededQuotaIcon',
k_onClick: k_addCondition
},
{
k_id: 'k_btnPackets',
k_caption: k_tr('Traffic Rule', 'bandwidthManagementTrafficEditor'),
k_title: k_tr('Packets matching a Traffic rule…', 'bandwidthManagementTrafficEditor'),
k_iconCls: 'bandwidthManagement packetsIcon',
k_onClick: k_addCondition
},
{
k_id: 'k_btnContentFilter',
k_caption: k_tr('Content Rule', 'bandwidthManagementTrafficEditor'),
k_title: k_tr('Connections matching a Content rule…', 'bandwidthManagementTrafficEditor'),
k_iconCls: 'bandwidthManagement contentFilterIcon',
k_onClick: k_addCondition
},
{
k_id: 'k_btnService',
k_caption: k_tr('Service', 'bandwidthManagementTrafficEditor'),
k_iconCls: 'bandwidthManagement ipServiceGroupIcon',
k_onClick: k_addCondition
},
{
k_id: 'k_btnDscp',
k_caption: k_tr('QoS DSCP Value', 'bandwidthManagementTrafficEditor'),
k_title: k_tr('Packets marked with QoS DSCP value…', 'bandwidthManagementTrafficEditor'),
k_iconCls: 'bandwidthManagement dscpIcon',
k_onClick: k_addCondition
},
{
k_id: 'k_addGuestInterfaces',
k_caption: k_tr('Guest Interfaces', 'trafficRuleList'),
k_iconCls: 'groupIcon interfaceHeaderIcon groupGuest',
k_onClick: k_addCondition
}
],

k_update: function(k_sender, k_event) {
var
k_lib = kerio.lib,
k_constEventTypes = k_lib.k_constants.k_EVENT.k_TYPES,
k_constKeyCodes,
k_currentKeyCode,
k_selectedRowsCount,
k_isSelected;
if (k_sender instanceof k_lib.K_Grid) {
switch (k_event.k_type) {
case k_constEventTypes.k_SELECTION_CHANGED:
k_isSelected = (0 < k_sender.k_selectionStatus.k_selectedRowsCount);
this.k_enableItem('k_btnRemove', k_isSelected);
break;
case k_constEventTypes.k_KEY_PRESSED:
k_constKeyCodes = k_lib.k_constants.k_EVENT.k_KEY_CODES;
k_currentKeyCode = k_event.k_browserEvent.keyCode;
if (((k_constKeyCodes.k_BACKSPACE === k_currentKeyCode) || (k_constKeyCodes.k_DELETE === k_currentKeyCode))) {
kerio.waw.shared.k_methods.k_onClickRemoveRuleDataStore.call(k_sender.k_toolbars.k_bottom);
}
break;
}
}
}
}
}
};
k_grid = new kerio.waw.shared.k_widgets.K_OfferGrid(k_localNamespace + 'k_grid', k_gridCfg);
k_dialogCfg = {
k_width: 797,
k_height: 600,
k_title: k_tr('Traffic', 'bandwidthManagementTrafficEditor'),
k_content: k_grid,
k_defaultItem: null,
k_isResizable: false,

k_onOkClick: function(k_toolbar) {
var
k_dialog = this.k_dialog;
k_dialog.k_updateBandwidthManagementList({traffic: k_dialog.k_grid.k_datastore.k_getData()});
k_dialog.k_hide();
}
};
k_dialogCfg = k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_grid.k_addReferences({
k_SELECT_ITEMS_USERS: k_SELECT_ITEMS_USERS,
k_SELECT_ITEMS_SERVICE: k_SELECT_ITEMS_SERVICE,
k_SELECT_ITEMS_TRAFFIC_RULE: k_SELECT_ITEMS_TRAFFIC_RULE,
k_SELECT_ITEMS_HTTP_RULE: k_SELECT_ITEMS_HTTP_RULE,
k_SELECT_ITEMS_FTP_RULE: k_SELECT_ITEMS_FTP_RULE,
k_SELECT_ITEMS_CONTENT_RULE: k_SELECT_ITEMS_CONTENT_RULE,
k_multilineProperties: {
k_renderTrafficItem: k_methods.k_renderers.k_renderTrafficItem,
BMConditionType: k_conditionTypes,
BMTrafficType: k_trafficTypes,
k_listMaxItems: -1 }, k_fillDataFromRuleDataStore: k_methods.k_fillDataFromRuleDataStore,
k_dialog: k_dialog,
k_datastore: k_datastore,
k_currentType: '',
k_conditionTypes: k_conditionTypes,
k_translations: {},k_openSelectItemsDialog: k_openSelectItemsDialog,
k_selectItemsCallback: k_selectItemsCallback,
k_trCache: {},
k_relatedGrid: null,
k_embeddedDefinitionsNeedUpdate: false,
k_requestClearEmbeddedDefinitions: null,
k_updateEmbeddedDefinitions: null,
k_updateEmbeddedServices: null
});
k_grid.k_trCache[k_conditionTypes.BMConditionApplication] 	= k_tr('Applications and Web Categories', 'contentEditor');
k_grid.k_trCache[k_conditionTypes.BMConditionTrafficType] = k_tr('Traffic', 'bandwidthManagementTrafficEditor');
k_grid.k_trCache[k_conditionTypes.BMConditionLargeData]   = k_tr('Traffic', 'bandwidthManagementTrafficEditor');
k_grid.k_trCache[k_conditionTypes.BMConditionUsers]			= k_tr('Users and Groups', 'bandwidthManagementTrafficEditor');
k_grid.k_trCache[k_conditionTypes.BMConditionHosts] 	= k_tr('Hosts, Networks, Address Ranges', 'bandwidthManagementTrafficEditor');
k_grid.k_trCache[k_conditionTypes.BMConditionQuota]   		= k_tr('Users and Groups', 'bandwidthManagementTrafficEditor');
k_grid.k_trCache[k_conditionTypes.BMConditionTrafficRule] = k_tr('Policy Rules', 'bandwidthManagementTrafficEditor');
k_grid.k_trCache[k_conditionTypes.BMConditionContentRule] = k_tr('Policy Rules', 'bandwidthManagementTrafficEditor');
k_grid.k_trCache[k_conditionTypes.BMConditionService]		= k_tr('Services', 'bandwidthManagementTrafficEditor');
k_grid.k_trCache[k_conditionTypes.BMConditionDscp]   		= k_tr('QoS DSCP', 'bandwidthManagementTrafficEditor');
k_grid.k_trCache[k_conditionTypes.BMConditionGuests]   		= k_tr('Interfaces', 'trafficSourceDestinationEditor');
k_grid.k_trCache[k_conditionTypes.BMConditionInvalid]   	= k_tr('Other', 'bandwidthManagementTrafficEditor'); k_dialog.k_addReferences({
k_grid: k_grid,
k_updateBandwidthManagementList: null
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function (k_params) {
var
k_relatedGrid = k_params.k_relatedGrid,
k_grid = this.k_grid;
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_data: ['k_trafficRules', 'k_httpRules', 'k_ftpRules', 'k_contentRules', 'k_services', 'k_domains', 'k_users', 'k_groups'],
k_dialogs: ['selectItems', 'bandwidthManagementTrafficTypeEditor', 'bandwidthManagementDscpEditor', 'trafficHostEditorBW']
});
k_grid.k_relatedGrid = k_relatedGrid;
k_grid.k_requestClearEmbeddedDefinitions = k_relatedGrid.k_requestClearEmbeddedDefinitions;
k_grid.k_updateEmbeddedDefinitions = k_relatedGrid.k_updateEmbeddedDefinitions;
k_grid.k_updateEmbeddedServices = k_relatedGrid.k_updateEmbeddedServices;
k_grid.k_translations = k_relatedGrid.k_translations;
k_grid.k_TRAFFIC_TYPE_TRANSLATIONS = k_params.k_relatedGrid.k_TRAFFIC_TYPE_TRANSLATIONS;
k_grid.k_isApplicationAwarenessOn = k_relatedGrid.k_isApplicationAwarenessOn;
k_grid.k_isWebFilterLicensed = k_relatedGrid.k_isWebFilterLicensed;
k_grid.k_isWebFilterOn = k_relatedGrid.k_isWebFilterOn;
k_grid.k_datastore.k_fillData(k_params.k_data.traffic);
k_grid.k_setData(this.k_grid.k_datastore.k_getData());
k_grid.k_startTracing();
this.k_updateBandwidthManagementList = k_params.k_callback;
};

k_kerioWidget.k_resetOnClose = function() {
this.k_grid.k_stopTracing();
};
}};