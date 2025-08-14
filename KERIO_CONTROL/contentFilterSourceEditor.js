
kerio.waw.ui.contentFilterSourceEditor = {

k_init: function(k_objectName) {
var
k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_localName = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_anyText = k_tr('Any source', 'trafficSourceDestinationEditor'),
k_toolbar, k_toolbarCfg,
k_grid, k_gridCfg,
k_dialog, k_dialogCfg,
k_itemRenderer,
k_removeRows,
k_onSelect;

k_removeRows = function() {
var
k_data,
k_cnt, k_i;
this.k_removeSelectedRows();
k_data = this.k_getData();
k_cnt = k_data.length;
if (0 < k_cnt) {
this.k_resetGrid();
for (k_i = 0; k_i < k_cnt; k_i++) {
this.k_addItem(k_data[k_i]);
}
this.k_selectRows(0);
}
};

k_onSelect = function(k_sender, k_event) {
var
k_lib = kerio.lib,
k_constEventTypes = k_lib.k_constants.k_EVENT.k_TYPES,
k_constKeyCodes,
k_currentKeyCode,
k_selectedRowsCount;
if (k_sender instanceof k_lib.K_Grid) {
switch (k_event.k_type) {
case k_constEventTypes.k_SELECTION_CHANGED:
k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount;
this.k_enableItem('k_btnRemove', 0 < k_selectedRowsCount);
break;
case k_constEventTypes.k_KEY_PRESSED:
k_constKeyCodes = k_lib.k_constants.k_EVENT.k_KEY_CODES;
k_currentKeyCode = k_event.k_browserEvent.keyCode;
if (((k_constKeyCodes.k_BACKSPACE === k_currentKeyCode) || (k_constKeyCodes.k_DELETE === k_currentKeyCode))) {
k_sender.k_removeRows();
}
break;
}
}
};

k_itemRenderer = function(k_value, k_data) {
var
k_grid = this.k_dialog.k_parentGrid,
k_renderedData = k_grid.k_renderSourceEntityItem(k_data, k_grid);
return k_renderedData;
};
k_toolbarCfg = {
k_update: k_onSelect,
k_hasSharedMenu: true,
k_items: [
{
k_id: 'k_selectedUsers',
k_caption: k_tr('Users and Groups', 'trafficSourceDestinationEditor'),
k_iconCls: 'gridListIcon userIcon',
k_onClick: function(k_toolbar) {
var k_grid = k_toolbar.k_relatedWidget;
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'selectItems',
k_objectName: 'k_selectMembersForRule',
k_params: {
k_parentGrid: k_grid,
k_callback: k_grid.k_addUsersCallback,
k_autoAdd: false
}
});
}
},
{
k_id: 'k_selectedIpAddressGroup',
k_caption: k_tr('IP Address Groups', 'trafficSourceDestinationEditor'),
k_iconCls: 'groupIcon grpHeader ipGroupIcon',
k_onClick: function(k_toolbar) {
var k_grid = k_toolbar.k_relatedWidget;
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'selectItems',
k_objectName: 'k_selectIpGroups',
k_params: {
k_parentGrid: k_grid,
k_callback: k_grid.k_addIpGroupsCallback,
k_autoAdd: false
}
});
}
},
{
k_id: 'k_addGuestInterfaces',
k_caption: k_tr('Guest Interfaces', 'trafficRuleList'),
k_iconCls: 'groupIcon interfaceHeaderIcon groupGuest',
k_onClick: function(k_toolbar) {
k_toolbar.k_relatedWidget.k_addGroupInterfaces();
}
}
]
};
k_gridCfg = {
k_isStateful: false,
k_className: 'noGridHeader policyGrid',
k_emptyMsg: k_anyText,
k_toolbars: {
k_bottom: k_toolbarCfg
},
k_columns: {
k_grouping: {
k_columnId: 'type',
k_isMemberIndented: true,
k_isRemoteGroup: false
},
k_items: [
{
k_columnId: 'type',
k_isKeptHidden: true,
k_groupRenderer: function(k_value) {
var
k_types = kerio.waw.shared.k_CONSTANTS.SourceConditonEntityType,
k_translations = this.k_translations,
k_caption,
k_icon;
switch(k_value) {
case k_types.SourceConditonEntityAddressGroup:
k_caption = k_translations.k_addressGroups;
k_icon = 'ipGroupIcon agTypeHost';
break;
case k_types.SourceConditonEntityUsers:
k_caption = k_translations.k_userGroup;
k_icon = 'userGroupIcon';
break;
case k_types.SourceConditonEntityGuests:
k_caption = k_translations.k_interfaces;
k_icon = 'interfaceIcon interfaceEthernet';
break;
default:
k_caption = k_translations.k_invalidGroup;
k_icon = '';
break;
}
return {
k_data: k_caption,
k_iconCls: k_icon
};
}
},
{
k_columnId: 'addressGroup',
k_isDataOnly: true
},
{
k_columnId: 'userType',
k_isDataOnly: true
},
{
k_columnId: 'user',
k_isDataOnly: true
},
{
k_caption: k_tr('Item', 'common'),
k_columnId: 'k_renderer',
k_isSortable: false,
k_renderer: k_itemRenderer
}
]
}
};
k_grid = new kerio.waw.shared.k_widgets.K_OfferGrid(k_localName + 'k_grid', k_gridCfg);
k_toolbar = k_grid.k_toolbars.k_bottom;
k_dialogCfg = {
k_title: k_tr('Content Rule - Source', 'contentFilterSourceEditor'),
k_content: k_grid,
k_height: 500,
k_minHeight: 500,
k_defaultItem: null,
k_callbackSaveData: null,
k_onOkClick: function() {
this.k_dialog.k_sendData();
}
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_grid: k_grid
});
k_grid.k_addReferences({
k_dialog: k_dialog,
k_toolbar: k_toolbar,
k_removeRows: k_removeRows,
k_translations: {
k_nothing: k_tr('Nothing', 'common'),
k_addressGroups: k_tr('IP Address Groups', 'trafficSourceDestinationEditor'),
k_userGroup: k_tr('Users and Groups', 'bandwidthManagementTrafficEditor'),
k_invalidGroup: k_tr('Other', 'bandwidthManagementTrafficEditor'), k_interfaces: k_tr('Interfaces', 'trafficSourceDestinationEditor')
},
k_embeddedDefinitionsNeedUpdate: false,
k_requestClearEmbeddedDefinitions: null,
k_updateEmbeddedDefinitions: null,
k_updateEmbeddedIpAddressGroups: null
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_data = k_params.k_data.sourceConditionList,
k_relatedGrid = k_params.k_relatedGrid,
k_grid = this.k_grid;
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_data: ['k_ipAddressGroups', 'k_domains', 'k_users', 'k_groups'],
k_dialogs: ['selectItems']
});
k_grid.k_relatedGrid = k_relatedGrid;
k_grid.k_requestClearEmbeddedDefinitions = k_relatedGrid.k_requestClearEmbeddedDefinitions;
k_grid.k_updateEmbeddedDefinitions = k_relatedGrid.k_updateEmbeddedDefinitions;
k_grid.k_updateEmbeddedIpAddressGroups = k_relatedGrid.k_updateEmbeddedIpAddressGroups;
this.k_dataStore = k_params.k_data;
this.k_parentGrid = k_relatedGrid;
this.k_callbackSaveData = k_params.k_callback;
for (var k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_grid.k_addItem(k_data[k_i]);
}
k_grid.k_startTracing();
};

k_kerioWidget.k_sendData = function() {
var
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
RuleConditionType = k_CONSTANTS.RuleConditionType,
k_grid = this.k_grid,
k_data = k_grid.k_getData(),
k_isNothing = 1 === k_data.length && k_data[0].k_isNothing,
k_sendData = {},
k_cnt, k_i;
if (!k_isNothing) {
k_cnt = k_data.length;
if (0 === k_cnt) {
k_sendData.sourceCondition = {
type: RuleConditionType.RuleAny,
entities: []
};
}
else {
k_sendData.sourceCondition = {
type: RuleConditionType.RuleSelectedEntities,
entities: k_data
};
}
this.k_callbackSaveData.call(this.k_parentGrid, { k_data: k_sendData });
}
this.k_hide();
return true;
};

k_kerioWidget.k_grid.k_addUsersCallback = function(k_selectedUsers, k_userData, k_domain, k_selectedData) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_userType = k_WAW_CONSTANTS.SourceConditonEntityType.SourceConditonEntityUsers,
k_userCond = k_WAW_CONSTANTS.UserConditionType,
k_foundRowIndices,
k_allUsersItem,
k_entity,
k_user,
k_i;
k_allUsersItem = this.k_findRow('userType', k_userCond.AuthenticatedUsers);
if (-1 !== k_allUsersItem) {
for (k_i = k_allUsersItem.length - 1; k_i >= 0; k_i--) {
this.k_removeRowByIndex(k_allUsersItem[k_i]);
}
}
k_selectedData = k_selectedData || [];
for (k_i = k_selectedData.length - 1; 0 <= k_i; k_i--) {
k_user = k_selectedData[k_i];
k_entity = kerio.waw.shared.k_DEFINITIONS.k_get('k_sourceConditionEntity', {
type: k_userType,
userType: k_userCond.SelectedUsers,
user: {
id: k_user.id,
name: k_user.name,
isGroup: k_user.k_isGroup,
domainName: k_domain
}
});
k_foundRowIndices = this.k_findRowIndexBy(this.k_searchDuplicate, k_entity);
if (null === k_foundRowIndices) {
this.k_addItem(k_entity);
}
}
if (k_foundRowIndices) {
this.k_selectRows(k_foundRowIndices[0]);
}
};

k_kerioWidget.k_grid.k_searchDuplicate = function(k_data) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_types = k_WAW_CONSTANTS.SourceConditonEntityType,
k_consts,
k_tmpData, k_tmpThis;
if (k_data.type !== this.type) {
return false;
}
switch (this.type) {
case k_types.SourceConditonEntityAddressGroup:
return (k_data.ipAddressGroup && this.ipAddressGroup && k_data.ipAddressGroup.id === this.ipAddressGroup.id);
case k_types.SourceConditonEntityUsers:
k_consts = k_WAW_CONSTANTS.UserConditionType;
k_tmpData = k_data.user || {};
k_tmpThis = this.user || {};
if (k_consts.SelectedUsers === this.userType) {
return (k_data.userType === this.userType && k_tmpData.id === k_tmpThis.id);
}
return (k_data.userType === this.userType);
case k_types.SourceConditonEntityGuests:
return k_data.type === k_types.SourceConditonEntityGuests;
}
return false;
};
k_kerioWidget.k_grid.k_addGroupInterfaces = function() {
var
k_shared = kerio.waw.shared,
k_entity,
k_foundRowIndices;
k_entity = k_shared.k_DEFINITIONS.k_get('k_sourceConditionEntity', {
type: k_shared.k_CONSTANTS.SourceConditonEntityType.SourceConditonEntityGuests
});
k_foundRowIndices = this.k_findRowIndexBy(this.k_searchDuplicate, k_entity);
if (null === k_foundRowIndices) {
this.k_addItem(k_entity);
}
else {
this.k_selectRows(k_foundRowIndices[0]);
}
};

k_kerioWidget.k_grid.k_addIpGroupsCallback = function(k_selected, k_allData, k_domain, k_selectedData) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_groupType = k_WAW_CONSTANTS.SourceConditonEntityType.SourceConditonEntityAddressGroup,
k_foundRowIndices,
k_group,
k_entity,
k_i;
k_selectedData = k_selectedData || [];
for (k_i = k_selectedData.length - 1; 0 <= k_i; k_i--) {
k_group = k_selectedData[k_i];
k_entity = kerio.waw.shared.k_DEFINITIONS.k_get('k_sourceConditionEntity', {
type: k_groupType,
ipAddressGroup: {
id: k_group.id,
name: k_group.name
}
});
k_foundRowIndices = this.k_findRowIndexBy(this.k_searchDuplicate, k_entity);
if (null === k_foundRowIndices) {
this.k_addItem(k_entity);
}
}
if (k_foundRowIndices) {
this.k_selectRows(k_foundRowIndices[0]);
}
};

k_kerioWidget.k_grid.k_removeNothing = function() {
var
k_nothingItem = this.k_findRow('k_isNothing', true),
k_i;
if (-1 !== k_nothingItem) {
for (k_i = k_nothingItem.length - 1; k_i >= 0; k_i--) {
this.k_removeRowByIndex(k_nothingItem[k_i]);
}
}
};

k_kerioWidget.k_grid.k_addItem = function(k_item) {
var
k_KEEP_ORDER = -1,
k_SOURCE_TYPES = kerio.waw.shared.k_CONSTANTS.SourceConditonEntityType,
k_compareSourceConditionList = this.k_parentWidget.k_parentGrid.k_compareSourceConditionList,
k_gridData  = this.k_getData(),
k_itemType = k_item.type,
k_guestInterfaces,
k_targetIndex,
k_sameTypeItems,
k_data,
k_i, k_cnt;
this.k_removeNothing();
if (0 === k_gridData.length) {
this.k_setData([ k_item ]);
return;
}
k_sameTypeItems = this.k_findRow('type', k_itemType);
if (-1 === k_sameTypeItems) {
switch (k_itemType) {
case k_SOURCE_TYPES.SourceConditonEntityUsers:
k_targetIndex = 0;
break;
case k_SOURCE_TYPES.SourceConditonEntityAddressGroup:
k_guestInterfaces = this.k_findRow('type', k_SOURCE_TYPES.SourceConditonEntityGuests);
k_targetIndex = -1 === k_guestInterfaces ? k_gridData.length : k_guestInterfaces[0];
break;
case k_SOURCE_TYPES.SourceConditonEntityGuests:
k_targetIndex = k_gridData.length;
break;
}
this.k_addRow(k_item, k_targetIndex);
return;
}
k_cnt = k_sameTypeItems[k_sameTypeItems.length - 1];
for (k_i = k_sameTypeItems[0]; k_i <= k_cnt; k_i++) {
k_data = k_gridData[k_i];
if (k_KEEP_ORDER === k_compareSourceConditionList(k_item, k_data)) {
break;
}
}
this.k_addRow(k_item, k_i);
};

k_kerioWidget.k_resetOnClose = function() {
this.k_grid.k_resetGrid();
};
} };
