
kerio.waw.ui.contentFilterContentEditor = {

k_init: function(k_objectName) {
var
k_shared = kerio.waw.shared,
k_methods = k_shared.k_methods,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_conditionTypes = k_WAW_CONSTANTS.ContentConditionEntityType,
k_localName = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_toolbar, k_toolbarCfg,
k_grid, k_gridCfg,
k_dialog, k_dialogCfg,
k_onSelect,
k_groupingRenderer,
k_setItemSorting,
k_sortItems,
k_itemRenderer,
k_openSelectItemsDialog,
k_selectItemsCallback,
k_updateItemCallback,
k_openRowEditor,
k_addCondition,
k_datastore;

k_onSelect = function(k_sender, k_event) {
var
k_constEventTypes = kerio.lib.k_constants.k_EVENT.k_TYPES,
k_constKeyCodes,
k_currentKeyCode,
k_selectedRowsCount;
if (k_sender instanceof kerio.lib.K_Grid) {
switch (k_event.k_type) {
case k_constEventTypes.k_SELECTION_CHANGED:
k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount;
this.k_enableItem('k_btnRemove', 0 < k_selectedRowsCount);
break;
case k_constEventTypes.k_KEY_PRESSED:
k_constKeyCodes = kerio.lib.k_constants.k_EVENT.k_KEY_CODES;
k_currentKeyCode = k_event.k_browserEvent.keyCode;
if (((k_constKeyCodes.k_BACKSPACE === k_currentKeyCode) || (k_constKeyCodes.k_DELETE === k_currentKeyCode))) {
kerio.waw.shared.k_methods.k_onClickRemoveRuleDataStore.call(k_sender.k_toolbar);
}
break;
}
}
};

k_selectItemsCallback = function (k_selectedItems, k_allData, k_currentDomain, k_selectedData) {
var
k_datastore = this.k_datastore,
k_gridData = this.k_getData(),
k_conditionTypes = this.k_conditionTypes,
k_get = kerio.waw.shared.k_DEFINITIONS.k_get,
k_type = this.k_currentType,
k_store = [],
k_itemData,
k_data,
k_i, k_cnt;
if (k_conditionTypes.ContentConditionEntityApplication === k_type) {
for (k_i = k_gridData.length - 1; k_i >= 0; k_i--) {
k_itemData = k_gridData[k_i];
if (k_conditionTypes.ContentConditionEntityApplication === k_itemData.type) {
this.k_removeRowByIndex(k_i);
}
}
k_datastore.k_fillData(this.k_getData());
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
k_data = k_get('k_contentConditionEntity', k_data);
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
if (k_conditionTypes.ContentConditionEntityUrlGroup === k_type) {
k_data.urlGroup = {
id: k_itemData.id,
name: k_itemData.name
};
}
k_data = k_get('k_contentConditionEntity', k_data);
k_store.push(k_data);
}
}
this.k_fillDataFromRuleDataStore(k_store);
};

k_updateItemCallback = function(k_data, k_isEdit) {
if (true === k_isEdit) {
kerio.waw.shared.k_methods.k_onClickRemoveRuleDataStore.call(this.k_toolbar);
}
this.k_fillDataFromRuleDataStore(kerio.waw.shared.k_DEFINITIONS.k_get('k_contentConditionEntity', k_data));
};

k_openRowEditor = function(k_grid, k_rowData) {
var
k_conditionTypes = k_grid.k_conditionTypes,
k_type = k_rowData.type;
switch (k_type) {
case k_conditionTypes.ContentConditionEntityUrl:
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'contentFilterUrlEditor',
k_params: {
k_relatedGrid: k_grid,
k_data: k_rowData
}
});
break;
case k_conditionTypes.ContentConditionEntityFileGroup:
case k_conditionTypes.ContentConditionEntityFileName:
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'contentFilterFileTypeEditor',
k_params: {
k_relatedGrid: k_grid,
k_data: k_rowData
}
});
break;
case k_conditionTypes.ContentConditionEntityApplication:
k_grid.k_currentType = k_conditionTypes.ContentConditionEntityApplication;
k_grid.k_openSelectItemsDialog('k_selectApplication', k_rowData.id);
break;
}
};

k_openSelectItemsDialog = function(k_type, k_selectItemId) {
var
ContentConditionEntityApplication = this.k_conditionTypes.ContentConditionEntityApplication,
k_grid = this.k_parentWidget.k_grid,
k_sourceName = 'selectItems',
k_selectedApplicationIds,
k_data,
k_i, k_cnt,
k_subGroupItems,
k_j, k_cnt2;
if (ContentConditionEntityApplication === k_grid.k_currentType) {
k_sourceName = 'applicationSelectItems';
k_selectedApplicationIds = [];
k_data = k_grid.k_getData();
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (ContentConditionEntityApplication === k_data[k_i].type) {
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
k_buttonId = k_button.k_name;
switch (k_buttonId) {
case 'k_btnApplications':
k_grid.k_currentType = k_conditionTypes.ContentConditionEntityApplication;
k_grid.k_openSelectItemsDialog('k_selectApplication');
break;
case 'k_btnFileTypes':
k_grid.k_currentType = k_conditionTypes.ContentConditionEntityFileGroup;
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'contentFilterFileTypeEditor',
k_params: {
k_relatedGrid: k_grid
}
});
break;
case 'k_btnUrl':
k_grid.k_currentType = k_conditionTypes.ContentConditionEntityUrl;
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'contentFilterUrlEditor',
k_params: {
k_relatedGrid: k_grid
}
});
break;
case 'k_btnUrlGroups':
k_grid.k_currentType = k_conditionTypes.ContentConditionEntityUrlGroup;
k_grid.k_openSelectItemsDialog('k_selectUrlGroups');
break;
}
};
k_setItemSorting = function(k_item, k_clone) {
var
k_shared = kerio.waw.shared,
ContentConditionEntityType = k_shared.k_CONSTANTS.ContentConditionEntityType,
k_CF_TYPE_ORDER = k_shared.k_DEFINITIONS.k_CF_TYPE_ORDER,
k_group = k_item.type,
k_order = k_CF_TYPE_ORDER.indexOf(k_group);
switch(k_group) { case ContentConditionEntityType.ContentConditionEntityFileGroup:
case ContentConditionEntityType.ContentConditionEntityFileName:
k_group = ContentConditionEntityType.ContentConditionEntityFileGroup;
break;
case ContentConditionEntityType.ContentConditionEntityUrlGroup:
case ContentConditionEntityType.k_INVALID:
k_group = ContentConditionEntityType.ContentConditionEntityUrl;
break;
}
if (true === k_clone) {
k_item = kerio.lib.k_cloneObject(k_item);
}
k_item.k_group = k_CF_TYPE_ORDER.indexOf(k_group);
k_item.k_order = '' + k_order;
return k_item;
};
k_sortItems = function(k_first, k_second) {
return (k_first.k_order.localeCompare(k_second.k_order));
};
k_datastore = k_methods.k_createRuleDataStore({
k_setItemSorting: k_setItemSorting,
k_sortItems: k_sortItems,
k_typeInvalid: k_conditionTypes.k_INVALID
});
k_datastore.k_groups[k_conditionTypes.ContentConditionEntityApplication] = k_shared.k_DEFINITIONS.k_APPLICATION_DATA_STORE_GROUP;;
k_datastore.k_groups[k_conditionTypes.ContentConditionEntityFileGroup] = {
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
k_TRANSLATIONS = kerio.waw.shared.k_DEFINITIONS.k_FILE_NAME_GROUPS_TRANSLATIONS,
k_firstValue = k_TRANSLATIONS[k_first.value] || k_first.value,
k_secondValue = k_TRANSLATIONS[k_second.value] || k_second.value;
return k_firstValue.localeCompare(k_secondValue);
},
k_compare: function(k_first, k_second) {
return k_first.value === k_second.value;
}
};
k_datastore.k_groups[k_conditionTypes.ContentConditionEntityFileName] = k_lib.k_cloneObject(k_datastore.k_groups[k_conditionTypes.ContentConditionEntityFileGroup]);
k_datastore.k_groups[k_conditionTypes.ContentConditionEntityUrl] = {
k_add: function(k_item) {
var
k_compare = this.k_compare,
k_data = this.k_data,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_compare(k_data[k_i], k_item)) {
k_data[k_i].isRegex = k_item.isRegex;
return;
}
}
k_data.push(k_item);
},
k_data: [],
k_sort: function(k_first, k_second) {
if (k_first.value < k_second.value) {
return -1;
}
return 1;
},
k_compare: function(k_first, k_second) {
return k_first.value === k_second.value;
}
};
k_datastore.k_groups[k_conditionTypes.ContentConditionEntityUrlGroup] = {
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
if (k_first.urlGroup.name < k_second.urlGroup.name) {
return -1;
}
return 1;
},
k_compare: function(k_first, k_second) {
return k_first.urlGroup.id === k_second.urlGroup.id;
}
};
k_toolbarCfg = {
k_update: k_onSelect,
k_hasSharedMenu: true,
k_items: [
{
k_id: 'k_btnApplications',
k_caption: k_tr('Applications and Web Categories', 'contentEditor'),
k_iconCls: 'bandwidthManagement appIcon',
k_onClick: k_addCondition
},
{
k_id: 'k_btnFileTypes',
k_caption: k_tr('File Name', 'contentEditor'),
k_iconCls: 'bandwidthManagement trafficTypeIcon',
k_onClick: k_addCondition
},
{
k_id: 'k_btnUrl',
k_caption: k_tr('URL', 'contentEditor') + '<br />' + k_tr('Hostname', 'contentEditor'),
k_iconCls: 'urlHostname',
k_onClick: k_addCondition
},
{
k_id: 'k_btnUrlGroups',
k_caption: k_tr('URL Groups', 'contentEditor'),
k_iconCls: 'urlGroups',
k_onClick: k_addCondition
}
]
};
k_itemRenderer = function(k_value, k_data, k_rowIndex, k_colIndex, k_grid, k_itemIndex) {
var
k_isLimited = false, k_displayLimit,
k_cnt,
k_lineData;
if (undefined !== k_itemIndex) {
k_lineData = k_data.contentCondition[k_itemIndex];
k_displayLimit = 10; k_cnt = k_data.contentCondition.length - k_displayLimit;
k_isLimited = (k_displayLimit === k_itemIndex && 1 < k_cnt); } else {
k_lineData = k_data;
}
if (k_isLimited) {
k_lineData = {
k_data: kerio.lib.k_tr('…and %1 more', 'userList', {k_args:[k_cnt]}),
k_dataTooltip: kerio.lib.k_htmlEncode(
kerio.waw.shared.k_methods.k_joinReferenceList(
{	k_referenceList: k_data.contentCondition,
k_start: k_displayLimit,
k_method: k_grid.k_parentWidget.k_parentGrid.k_renderContentEntityItem,
k_grid: k_grid,
k_stringProperty: 'k_data' }
)
)
};
}
else {
k_lineData = k_grid.k_parentWidget.k_parentGrid.k_renderContentEntityItem(k_lineData, k_grid, k_itemIndex);
k_lineData.k_iconCls = 'bandwidthManagement cellIcon ' + k_lineData.k_iconCls;
}
return k_lineData;
};
k_gridCfg = {
k_isStateful: false,
k_className: 'noGridHeader',
k_emptyMsg: k_tr('Any content', 'contentEditor'),
k_removeFunction: k_methods.k_onClickRemoveRuleDataStore,
k_toolbars: {
k_bottom: k_toolbarCfg
},
k_sorting: {
k_columnId: 'item'
},
k_columns: {
k_grouping: {
k_columnId: 'k_group',
k_isMemberIndented: true,
k_isRemoteGroup: false
},
k_items: [
{
k_columnId: 'k_group',
k_isKeptHidden: true,
k_groupRenderer: function(k_value, k_data) {
return {
k_data: this.k_trCache[k_data.type] || this.k_trCache[this.k_conditionTypes.k_INVALID]
};
}
},
{
k_columnId: 'type',
k_isDataOnly: true
},
{
k_caption: k_tr('Item', 'common'),
k_columnId: 'item',
k_isSortable: false,
k_renderer: k_itemRenderer
}
]
},
k_onDblClick: k_openRowEditor
};
k_grid = new k_shared.k_widgets.K_OfferGrid(k_localName + 'k_grid', k_gridCfg);
k_toolbar = k_grid.k_toolbars.k_bottom;
k_dialogCfg = {
k_title: k_tr('Content Rule - Detected Content', 'contentFilterContentEditor'),
k_content: k_grid,
k_height: 500,
k_minHeight: 500,
k_defaultItem: null,
k_onOkClick: function() {
this.k_dialog.k_sendData();
}
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_grid: k_grid,
k_parentGrid: null,
k_dataStore: {},
k_callbackSaveData: null,
k_translations: {
k_urlGroups: k_tr('URL Groups…', 'contentEditor')
},
k_data: k_shared.k_DEFINITIONS.k_contentConditionEntity
});
k_grid.k_addReferences({
k_dialog: k_dialog,
k_toolbar: k_toolbar,
k_groupingRenderer: k_groupingRenderer,
k_fillDataFromRuleDataStore: k_methods.k_fillDataFromRuleDataStore,
k_updateItemCallback: k_updateItemCallback,
k_currentType: '',
k_conditionTypes: k_conditionTypes,
k_openSelectItemsDialog: k_openSelectItemsDialog,
k_selectItemsCallback: k_selectItemsCallback,
k_datastore: k_datastore,
k_trCache: {},
k_generateApplicationLine: null,
k_isWebFilterLicensed: true,
k_embeddedDefinitionsNeedUpdate: false,
k_requestClearEmbeddedDefinitions: null,
k_updateEmbeddedDefinitions: null,
k_updateEmbeddedUrlGroups: null
});
k_grid.k_trCache[k_conditionTypes.ContentConditionEntityApplication]   = k_tr('Applications and Web Categories', 'contentFilterContentEditor');
k_grid.k_trCache[k_conditionTypes.ContentConditionEntityFileGroup]    = k_tr('File Names', 'contentFilterContentEditor');
k_grid.k_trCache[k_conditionTypes.ContentConditionEntityFileName]     = k_grid.k_trCache[k_conditionTypes.ContentConditionEntityFileGroup];
k_grid.k_trCache[k_conditionTypes.ContentConditionEntityUrl]           = k_tr('URL and URL Groups', 'contentFilterContentEditor');
k_grid.k_trCache[k_conditionTypes.ContentConditionEntityUrlGroup]     = k_grid.k_trCache[k_conditionTypes.ContentConditionEntityUrl];
k_grid.k_trCache[k_conditionTypes.k_ADDRESS_GROUP] = k_grid.k_trCache[k_conditionTypes.ContentConditionEntityUrl];
k_grid.k_trCache[k_conditionTypes.k_INVALID]       = k_tr('Other', 'contentFilterContentEditor'); this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({
k_applyParams: function(k_params) {
var
k_parentGrid = k_params.k_relatedGrid,
k_relatedGrid = k_parentGrid,
k_data = k_params.k_data,
k_contentConditionList = k_data.contentConditionList,
k_grid = this.k_grid,
k_store = [],
k_i, k_cnt;
this.k_parentGrid = k_parentGrid;
this.k_relatedGrid = k_relatedGrid; this.k_dataStore = k_data;
this.k_callbackSaveData = k_params.k_callback;
k_grid.k_requestClearEmbeddedDefinitions = k_relatedGrid.k_requestClearEmbeddedDefinitions;
k_grid.k_updateEmbeddedDefinitions = k_relatedGrid.k_updateEmbeddedDefinitions;
k_grid.k_updateEmbeddedUrlGroups = k_relatedGrid.k_updateEmbeddedUrlGroups;
k_grid.k_datastore.k_setGrid(k_parentGrid);
k_grid.k_translations = k_parentGrid.k_translations;
k_grid.k_generateApplicationLine = k_parentGrid.k_generateApplicationLine;
k_grid.k_isWebFilterLicensed = k_parentGrid.k_isWebFilterLicensed;
k_grid.k_isWebFilterOn = k_parentGrid.k_isWebFilterOn;
k_grid.k_isApplicationAwarenessOn = k_parentGrid.k_isApplicationAwarenessOn;
k_grid.k_clearData();
for (k_i = 0, k_cnt = k_contentConditionList.length; k_i < k_cnt; k_i++) {
k_store.push(k_contentConditionList[k_i]);
}
k_grid.k_fillDataFromRuleDataStore(k_store, true);
k_grid.k_startTracing();
},
k_sendData: function() {
var
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
RuleConditionType = k_CONSTANTS.RuleConditionType,
k_grid = this.k_grid,
k_APPLICATION_TYPE = k_grid.k_conditionTypes.ContentConditionEntityApplication,
k_get = kerio.waw.shared.k_DEFINITIONS.k_get,
k_data = k_grid.k_getData(),
k_isWebFilterOnly = true,
k_sendData = kerio.lib.k_cloneObject(this.k_dataStore),
k_entities = [],
k_item,
k_subGroupItems,
k_i, k_cnt,
k_j, k_cnt2;
k_cnt = k_data.length;
if (0 === k_cnt) {
k_isWebFilterOnly = false;
k_sendData.contentCondition = {
type: RuleConditionType.RuleAny,
entities: []
};
}
else {
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_data[k_i];
k_isWebFilterOnly = k_isWebFilterOnly && true === k_item.k_isWebFilterOnly;
if (k_item.k_isWholeSubGroup) {
k_subGroupItems = kerio.waw.shared.k_methods.k_getSubGroupItems(k_item.subGroup);
for (k_j = 0, k_cnt2 = k_subGroupItems.length; k_j < k_cnt2; k_j++) {
k_subGroupItems[k_j].type = k_APPLICATION_TYPE;
k_item = k_get('k_contentConditionEntity', k_subGroupItems[k_j]);
k_item.applications.push(k_item.id);
k_entities.push(k_item);
}
}
else {
k_entities.push(k_item);
}
}
k_sendData.contentCondition = {
type: RuleConditionType.RuleSelectedEntities,
entities: k_entities
};
}
delete k_sendData.contentConditionList;
k_sendData.k_isWebFilterOnly = k_isWebFilterOnly;
this.k_callbackSaveData.call(this.k_parentGrid, { k_data: k_sendData });
this.k_hide();
return true;
}
});

k_kerioWidget.k_resetOnClose = function() {
this.k_grid.k_resetGrid();
};
}
}; 