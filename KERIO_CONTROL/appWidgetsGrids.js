
kerio.waw.shared.k_widgets = kerio.waw.shared.k_widgets || {};
kerio.waw.shared.k_widgets.K_ContextMenuList = function(k_id, k_config){
kerio.waw.shared.k_widgets.K_ContextMenuList.superclass.constructor.call(this, k_id, k_config);
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_ContextMenuList', kerio.adm.k_widgets.K_BasicList, {


_k_prepareToolbars: function(k_id, k_config) {
var
k_contextMenuCfg;
if (k_config.k_toolbars && k_config.k_toolbars.k_bottom) {
k_contextMenuCfg = kerio.lib.k_cloneObject(k_config.k_toolbars.k_bottom);
this.k_prepareToolbarConfig(k_config.k_toolbars.k_bottom);
}
kerio.waw.shared.k_widgets.K_ContextMenuList.superclass._k_prepareToolbars.call(this, k_id, k_config);
if (k_contextMenuCfg) {
this.k_prepareContextMenuConfig(k_id, k_contextMenuCfg,k_config);
}
},

k_prepareToolbarConfig: function(k_toolbarCfg) {
var
k_items = k_toolbarCfg.k_items,
k_moreItems = [],
k_item,
k_i;
for (k_i = 0; k_i < k_items.length; k_i++) {
k_item = k_items[k_i];
if ('->' === k_item || 'K_APPLY_RESET' === k_item.k_type) {
break;
}
if (k_item.k_type) {
continue; }
if ('string' === typeof k_item) {
k_items.splice(k_i--, 1);
continue; }
if (true !== k_item.k_isVisibleInToolbar) {
k_moreItems.push(k_item);
k_items.splice(k_i--, 1);
}
} if (k_moreItems.length) {
k_items.splice(k_i, 0, { k_id: 'k_btnMoreActions',
k_caption: kerio.lib.k_tr('More Actions', 'common'),
k_isMenuButton: true,
k_items: k_moreItems
});
}
k_toolbarCfg.k_hasSharedMenu = false;
},
k_prepareContextMenuConfig: function(k_id, k_contextMenuCfg, k_config) {
var
k_items = k_contextMenuCfg.k_items,
k_toolbarItems = k_config.k_toolbars.k_bottom.k_items,
k_item,
k_i;
for (k_i = 0; k_i < k_items.length; k_i++) {
k_item = k_items[k_i];
if ('K_APPLY_RESET' === k_item.k_type) {
k_items = k_items.slice(0, k_i);
k_contextMenuCfg.k_items = k_items;
break;
}
if ('->' === k_item || k_item.k_extWidget) {k_items.splice(k_i--, 1);
continue;
}
if (k_item.k_type) {
switch(k_item.k_type) {
case 'K_GRID_DEFAULT':
case 'K_GRID_FULL':
k_items.splice(k_i, 1, k_toolbarItems.k_btnAdd._k_action, k_toolbarItems.k_btnEdit._k_action, k_toolbarItems.k_btnRemove._k_action);
k_i += 2;
break;
case 'K_BTN_ADD':
k_items[k_i] = k_toolbarItems.k_btnAdd._k_action;
break;
case 'K_BTN_EDIT':
k_items[k_i] = k_toolbarItems.k_btnEdit._k_action;
break;
case 'K_BTN_VIEW':
k_items[k_i] = k_toolbarItems.k_btnView._k_action;
break;
case 'K_BTN_REMOVE':
k_items[k_i] = k_toolbarItems.k_btnRemove._k_action;
break;
default:
kerio.lib.k_reportError('Unsupported k_type of toolbar button: ' + k_item.k_type, 'appWidgetsGrids');
}
}
if (k_item.k_id && k_toolbarItems[k_item.k_id]) {
k_items[k_i] = k_toolbarItems[k_item.k_id]._k_action;
}
}
if (0 !== k_items.length) {
k_config.k_contextMenu = new kerio.lib.K_Menu(k_id + '_' + 'k_contextMenu', k_contextMenuCfg);
k_config.k_contextMenu.k_relatedToolbar = k_config.k_toolbars.k_bottom; }
}
});

kerio.waw.shared.k_widgets.K_SimpleRulesGrid = function(k_id, k_config){
k_config.k_localData = k_config.k_localData || [];
k_config.k_isReadOnly = k_config.k_isAuditor; k_config.k_isDragDropRow = (false !== k_config.k_isDragDropRow && !k_config.k_isAuditor);
var
k_toolbars = k_config.k_toolbars || {},
k_enableApplyOnAction,
k_bottomToolbar;
if (!k_config.k_isAuditor) {
k_toolbars.k_right = kerio.waw.shared.k_DEFINITIONS.k_get('k_moveRowsToolbar');
if (k_toolbars.k_bottom) {
k_bottomToolbar = k_toolbars.k_bottom;
k_bottomToolbar.k_items = k_bottomToolbar.k_items || [];
k_bottomToolbar.k_items[0] = k_bottomToolbar.k_items[0] || {k_type: 'K_GRID_DEFAULT'};
if (!k_bottomToolbar.k_items[0].k_onRemove) {
k_bottomToolbar.k_items[0].k_onRemove = (true === k_config.k_confirmRemove) ? this._k_removeRow : this._k_removeRowCallback;
}
if ('function' === typeof k_config.k_enableApplyOnAction) {
k_enableApplyOnAction = k_config.k_enableApplyOnAction;
}
else {
k_enableApplyOnAction = true === k_config.k_enableApplyOnAction;
}
k_bottomToolbar.k_items.push(kerio.waw.shared.k_DEFINITIONS.k_get('k_editorGridBtnDuplicate', {
k_isVisibleInToolbar: true,
k_onAfterDuplicate: k_enableApplyOnAction
}));

k_bottomToolbar.k_update = k_bottomToolbar.k_update || function(k_sender, k_event){
if (kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED === k_event.k_type) {
this.k_enableItem('k_btnDuplicate', 1 === k_sender.k_selectionStatus.k_selectedRowsCount);
}
}; k_bottomToolbar.k_dialogs = k_bottomToolbar.k_dialogs || {};
k_bottomToolbar.k_dialogs.k_additionalParams = k_bottomToolbar.k_dialogs.k_additionalParams || {};
k_bottomToolbar.k_dialogs.k_additionalParams = {k_callback: this._k_saveRow};
}
k_config.k_toolbars = k_toolbars;
} else {
k_config.k_toolbars = {};
}
if (k_config.k_useDefaultDrop) {

k_config.k_onDrop = function (k_grid, k_data, k_rowIndex, k_isCopy) {
var
k_i, k_cnt;
if (k_isCopy) {
k_cnt = k_data.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_data[k_i].id = '';
}
}
kerio.adm.k_framework.k_enableApplyReset();
};
}
kerio.waw.shared.k_widgets.K_SimpleRulesGrid.superclass.constructor.call(this, k_id, k_config);
this.k_enableApplyOnRowMove = k_config.k_enableApplyOnAction || false;
this.k_enableApplyOnRemove  = k_config.k_enableApplyOnAction || false;
}; kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_SimpleRulesGrid', kerio.waw.shared.k_widgets.K_ContextMenuList, {


_k_saveRow: function(k_params) {
var
k_grid = kerio.waw.shared.k_methods.k_findGrid(this),
k_index = k_params.k_rowIndex,
k_data = k_params.k_data;
if (0 <= k_index) { k_grid.k_updateRow(k_data, k_index);
}
else { k_grid.k_appendRow(k_data);
}
},

_k_removeRow: function() {
var
k_grid = kerio.waw.shared.k_methods.k_findGrid(this),
k_selectionStatus = k_grid.k_selectionStatus,
k_tr = kerio.lib.k_tr,
k_confirmMsg = (1 === k_selectionStatus.k_selectedRowsCount) ? k_tr('Are you sure you want to remove the selected item?', 'list')
: k_tr('Are you sure you want to remove all the selected items?', 'list');
kerio.lib.k_confirm(k_tr('Confirm Action', 'common'), k_confirmMsg, k_grid._k_removeRowCallback, k_grid);
},

_k_removeRowCallback: function(k_response) {
var k_grid = kerio.waw.shared.k_methods.k_findGrid(this);
if ('no' === k_response) {
return;
}
k_grid.k_removeSelectedRows();
if (k_grid.k_enableApplyOnRemove) {
kerio.adm.k_framework.k_enableApplyReset();
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
}}); 
kerio.waw.shared.k_widgets.K_MediumRulesGrid = function(k_id, k_config){
var
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor();

k_config.k_onBeforeDrag =  (k_isAuditor) ? undefined : function (k_grid, k_data) {
var
k_row,
k_i, k_cnt;
if (!k_data) {
return false;
}
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_row = k_data[k_i];
if (k_row.k_isDefaultRule || k_row.k_isHidden) {
return false;
}
}
return true;
};

k_config.k_onDrag = (k_isAuditor) ? undefined : function (k_grid, k_data, k_srcIndex, k_destIndex) {
if (k_destIndex >= k_grid.k_getRowsCount()) {
return false;
}
};

k_config.k_rowRenderer = function(k_rowData, k_rowIndex) {
if (k_rowData.k_isDefaultRule) {
return 'ruleDefault';
}
};
k_config.k_className = 'mediumRulesGrid ' + k_config.k_className;
kerio.waw.shared.k_widgets.K_MediumRulesGrid.superclass.constructor.call(this, k_id, k_config);
this.k_addReferences({
_k_defaultRuleDefinition: k_config.k_defaultRuleDefinition
});
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_MediumRulesGrid', kerio.waw.shared.k_widgets.K_SimpleRulesGrid, {

k_setData: function(k_data, k_config) {
var
k_rule = this._k_defaultRuleDefinition;
if (k_rule) {
k_rule.k_isDefaultRule = true;
k_data.push(k_rule);
}
kerio.waw.shared.k_widgets.K_MediumRulesGrid.superclass.k_setData.call(this, k_data, k_config);
},

k_getData: function() {
var k_data = kerio.waw.shared.k_widgets.K_MediumRulesGrid.superclass.k_getData.call(this);
if (k_data && k_data[k_data.length - 1].k_isDefaultRule) {
k_data.pop(); }
return k_data;
}
});

kerio.waw.shared.k_widgets.K_RulesGrid = function (k_id, k_config) {
var
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_WAW_METHODS = k_shared.k_methods,
k_WAW_DEFINITIONS = k_shared.k_DEFINITIONS,
k_renderers = k_WAW_METHODS.k_renderers,
k_duplicateNewValues = { id: '' },
k_isTrafficRules = 'trafficPolicyList_trafficPolicyGrid' === k_id,
k_toolbars = {},
k_btnWizard = {},
k_gridColumns = [],
k_loadAddressGroups = false,
k_loadTimeRangeGroups = false,
k_columns = k_config.k_columns,
k_columnOrder = k_config.k_columnOrder,
k_tr = kerio.lib.k_tr,
k_isAuditor = k_config.k_isAuditor,
k_validTimeRenderer,
k_logRenderer,
k_enableEditor,
k_nameEditor,
k_ipAddressEditor,
k_timeRangeEditor,
k_enableLogEditor,
k_defaultColumns,
k_i, k_cnt,
k_columnId,
k_statusBarCfg,
k_statusbar,
k_gridCfg,
k_gridView,
k_localNamespace,
k_toolbarCfg,
k_onChangeHandler,
k_onChangeEnableHandler,
k_editorGridToolbarConfig;
this.k_publicName = k_id;
k_localNamespace = this.k_publicName + '_';
if (k_config.k_onCellDblClick) {
this._k_onCellDblClickCustom = k_config.k_onCellDblClick;
}


k_validTimeRenderer = k_WAW_METHODS.k_renderers.k_validTimeRangeRenderer;

k_logRenderer = function (k_value, k_data) {
return {
k_data: ''
};
};if (!k_config.k_isTabPage) {
k_onChangeHandler = function() {
kerio.adm.k_framework.k_enableApplyReset();
};
} else {
k_onChangeHandler = k_config.k_onChangeHandler;
}
if ('k_bandwidthManagementRules' === k_config.k_objectName) {
k_onChangeEnableHandler = function(k_grid, k_isChecked, k_rowData) {
k_grid.k_checkLinkSpeedNeeded(k_rowData);
k_grid._k_onChangeHandler(); };
}
else {
k_onChangeEnableHandler = k_onChangeHandler;
}

k_enableEditor = {
k_type: 'k_checkbox',
k_columnId: 'enabled',
k_onChange: k_onChangeEnableHandler
};
k_nameEditor = {
k_type: 'k_text',
k_maxLength: k_CONSTANTS.k_MAX_LENGTH.k_RULE_NAME,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false
},
k_onBlur: function(k_grid, k_element) {
var
k_oldValue = k_grid.k_getEditInfo().k_origValue,
k_newValue = k_element.k_getValue();
if (k_oldValue === k_newValue) {
return; }
k_grid._k_onChangeHandler(); }
};
k_ipAddressEditor = {
k_type: 'k_select',
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: [], 
k_onFocus: function(k_parent, k_element, k_value) {
var k_data = k_parent.k_getEditInfo().k_rowData;
k_element.k_listLoader.k_selectValue(k_data.validAddressGroup);
},
k_onBlur: function(k_parent, k_element, k_value) {
var
k_editInfo = k_parent.k_getEditInfo(),
k_data = k_editInfo.k_rowData,
k_newData = k_element.k_listLoader.k_getValue();
if (k_data.validAddressGroup.id === k_newData.id) {
return; }
k_data.validAddressGroup = k_newData;
k_parent.k_updateRowStatus(k_data);
k_parent.k_updateRow(k_data, k_editInfo.k_rowIndex);
}
};
k_timeRangeEditor = {
k_type: 'k_select',
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: [], 
k_onFocus: function(k_parent, k_element, k_value) {
var k_data = k_parent.k_getEditInfo().k_rowData;
if (k_data.validTimeRange.invalid) {
k_element.k_listLoader.k_selectValue('');
}
else {
k_element.k_listLoader.k_selectValue(k_data.validTimeRange);
}
},

k_onBlur: function(k_parent, k_element, k_value) {
var
k_editInfo = k_parent.k_getEditInfo(),
k_data = k_editInfo.k_rowData,
k_newData = k_element.k_listLoader.k_getValue();
if (k_data.validTimeRange.id === k_newData.id) {
return; }
k_data.validTimeRange = k_newData;
k_parent.k_updateRowStatus(k_data);
k_parent.k_updateRow(k_data, k_editInfo.k_rowIndex);
}
};
k_enableLogEditor = {
k_type: 'k_checkbox',
k_columnId: 'logEnabled',
k_onChange: k_onChangeHandler
};

k_defaultColumns = {
id:						{	k_columnId: 'id',
k_isDataOnly: true
},
description:			{	k_columnId: 'description',
k_isHidden: true, k_isKeptHidden: true
},
name:					{	k_columnId: 'name',
k_caption: k_tr('Name', 'common'),
k_width: 210,
k_editor: [ k_enableEditor, k_nameEditor ],

k_renderer: function(k_value, k_data) {
var
k_searchedDescriptionClass = '',
k_searchedDescription,
k_tooltipText,
k_tooltip,
k_ruleName;
if (this.k_isTrafficRules) {
k_ruleName = this.k_highlightSearchValueRenderer(k_value, k_data);
}
else {
k_ruleName = kerio.lib.k_htmlEncode(k_value);
}
if ('' === k_data.description) {
return {
k_data: k_ruleName,
k_isSecure: true
};
}
if (this.k_isTrafficRules) {
k_searchedDescription = this.k_highlightPassedValue('', k_data.description, k_data);
if (k_searchedDescription.k_isFound) {
k_searchedDescriptionClass = 'searchHighlighting';
}
k_tooltipText = k_searchedDescription.k_tooltip;
}
else {
k_tooltipText = kerio.lib.k_htmlEncode(k_data.description);
}
k_tooltip = kerio.lib.k_buildTooltip(k_tooltipText, true);
return {
k_data: k_ruleName + '<div ' + k_tooltip + ' class="iconRuleDescription ' + k_searchedDescriptionClass + '">&nbsp;</div>',
k_className: 'wrapRuleDescription',
k_isSecure: true
};
}
},
validAddressGroup:		{	k_columnId: 'validAddressGroup',
k_isDataOnly: true
},
validAddressGroupEditor:{	k_columnId: 'validAddressEditor',
k_caption: k_tr('Source', 'ruleList'),
k_isHidden: true,
k_renderer: k_WAW_METHODS.k_renderers.k_addressGroupRenderer,
k_editor: k_ipAddressEditor,
k_width: 140
},
validTimeRange:			{	k_columnId: 'validTimeRange',
k_isDataOnly: true
},
validTimeRangeEditor:	{	k_columnId: 'validTimeRangeEditor',
k_caption: k_tr('Valid Time', 'ruleList'),
k_renderer: k_validTimeRenderer,
k_editor: k_timeRangeEditor,
k_width: 115
},
logEnabled:				{	k_columnId: 'logEnabled',
k_caption: k_tr('Log', 'common'),
k_renderer: k_logRenderer,
k_editor: k_enableLogEditor,
k_width: 40
},
color:					{	k_columnId: 'color',
k_isDataOnly  : true
},
enabled:				{	k_columnId: 'enabled',
k_isDataOnly  : true
},
inactive:				{	k_columnId: 'inactive',
k_isDataOnly  : true
}
};
for (k_i in k_columns) {
if ('string' === typeof k_i) {
k_defaultColumns[k_i] = k_columns[k_i];
}
}

if (k_config.k_topToolbarCfg) {
k_toolbars.k_top = k_config.k_topToolbarCfg;
}
if (k_isAuditor){
if (k_config.k_bottomToolbarAdditionalRowItems) {
k_toolbars.k_bottom = {
k_hasSharedMenu: false, k_items: k_config.k_bottomToolbarAdditionalRowItems,
k_update: k_WAW_DEFINITIONS.k_get('k_editorGridToolbar').k_update
};
}
}
else {
if (k_isTrafficRules) {
k_duplicateNewValues.lastUsed = {
isValid: false
};
}
k_editorGridToolbarConfig = {
k_editColumn: 'name',
k_duplicateConfig: {
k_newValues: k_duplicateNewValues
}
};
k_toolbarCfg = k_WAW_DEFINITIONS.k_get('k_editorGridToolbar', k_editorGridToolbarConfig);
k_toolbarCfg.k_items.push({
k_id: 'k_btnChangeDescription',
k_caption: k_tr('Change Description…', 'ruleList'),
k_isDisabled: true,
k_onClick: function() {
var
k_grid = this.k_relatedWidget;
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'ruleDescriptionEditor',
k_params: {
k_data: k_grid.k_selectionStatus.k_rows[0].k_data,
k_relatedGrid: k_grid,
k_parentObjectName: k_grid._k_objectName
}
});
}
});
if (k_config.k_bottomToolbarAdditionalRowItems) {
k_toolbarCfg.k_items = k_toolbarCfg.k_items.concat(k_config.k_bottomToolbarAdditionalRowItems);
}
k_toolbarCfg.k_items.push('-');
if (k_config.k_wizard) {
k_btnWizard = {
k_id: 'k_btnWizard',
k_caption: kerio.lib.k_tr('Configure in Wizard…', 'common'),
k_onClick: function(k_toolbar) {
if (kerio.waw.status.k_currentScreen.k_isContentChanged()) {
kerio.waw.status.k_currentScreen.k_showContentChangedAlert();
return;
}
kerio.lib.k_ui.k_showDialog({k_sourceName: k_toolbar.k_relatedWidget.k_wizard, k_params: { k_parentGrid: k_toolbar.k_relatedWidget}});
}
};
k_toolbarCfg.k_items.push(k_btnWizard);
}
k_toolbarCfg.k_items.push({
k_id: 'k_btnEditTimeRanges',
k_caption: k_tr('Edit Time Ranges…', 'ruleList'),
k_isHidden: k_isAuditor,
k_onClick: function(k_toolbar) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'definitionDialog',
k_objectName:  'timeRangeListDialog',
k_initParams: {
k_showApplyReset: true,
k_onApplyResetHandler: function(k_toolbar, k_button) {
var
k_selectItemsDialog = k_toolbar.k_parentWidget.k_params.k_relatedWidget;
if (k_selectItemsDialog && k_selectItemsDialog.k_parentGrid && k_selectItemsDialog.k_parentGrid.k_requestClearEmbeddedDefinitions) {
k_selectItemsDialog.k_parentGrid.k_requestClearEmbeddedDefinitions();
}
kerio.waw.shared.k_methods.k_definitionApplyResetHandler(k_toolbar, k_button);
},
k_gridConfig: {
k_pageSize: 500,
k_widgetType: 'k_timeRangeType',
k_allowFiltering: true
}
},
k_params: {
k_relatedWidget: k_toolbar.k_relatedWidget,
k_relatedSelectCfg: {
k_fieldValue: 'id',
k_fieldDisplay: 'name'
}
}
});
}
});
if (k_config.k_bottomToolbarAdditionalGeneralItems) {
k_toolbarCfg.k_items = k_toolbarCfg.k_items.concat(k_config.k_bottomToolbarAdditionalGeneralItems);
}
if (!k_config.k_isTabPage) {
k_toolbarCfg.k_items.push(
{
k_type: 'K_APPLY_RESET',

k_onApply: function() {
var
k_grid = this.k_relatedWidget;
if (!k_grid || !k_grid.k_sendData) {
kerio.lib.k_reportError('Internal error: EditorGridToolbar expects method sendData to be defined in grid');
return false;
}
kerio.waw.shared.k_methods.k_maskMainScreen(k_grid);
k_grid.k_sendData.call(k_grid);
return false;
},

k_onReset: function(k_toolbar, k_button) {
var
k_grid = this.k_relatedWidget;
kerio.adm.k_framework.k_enableApplyReset(false);
if (k_button.k_isFiredByEvent) {
kerio.waw.shared.k_methods.k_maskMainScreen(k_grid);
k_grid.k_reloadData();
} else {
return true;
}
}
}
);
}
k_toolbars.k_bottom = k_toolbarCfg;
k_toolbars.k_right = k_WAW_DEFINITIONS.k_get('k_moveRowsToolbar');
if (k_config.k_isTabPage) {
k_toolbars.k_right.k_className = k_toolbars.k_right.k_className + ' tabPageInside';
}
}
k_cnt = k_columnOrder.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_columnId = k_columnOrder[k_i];
k_gridColumns.push(k_defaultColumns[k_columnId]);
if ('validAddressGroupEditor' === k_columnId) {
k_loadAddressGroups = true;
}
if ('validTimeRangeEditor' === k_columnId) {
k_loadTimeRangeGroups = true;
}
}
k_statusBarCfg = {
k_className: 'userList',

k_configurations: {
k_default: {
k_text: ''
},
k_ruleInactive: {
k_text: k_tr('Some rules are inefficient as they refer to non-existing objects.', 'policyList'),
k_iconCls: 'ruleInactive'
},
k_userUnknown: k_WAW_DEFINITIONS.k_invalidUserStatusBarCfg },
k_defaultConfig: 'k_default'
};
if (k_config.k_customStatusBarCfg) {
for (k_i in k_config.k_customStatusBarCfg) {
if ('string' === typeof k_i) {
k_statusBarCfg.k_configurations[k_i] = k_config.k_customStatusBarCfg[k_i];
}
}
}
k_statusbar = new kerio.lib.K_Statusbar(k_localNamespace + 'k_statusbar', k_statusBarCfg);

k_gridCfg = {
k_isAutoSelectNewRow: false,
k_isDragDropRow: !k_isAuditor && k_CONSTANTS.k_ALLOW_DRAG_AND_DROP,

k_onBeforeDrag: (k_isAuditor) ? undefined : function (k_grid, k_data, k_index) {
var
k_row,
k_i, k_cnt;
if (!k_data) {
return false;
}
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_row = k_data[k_i];
if (k_row.k_isDefaultRule || k_row.k_isHidden) {
return false;
}
}
return true;
},

k_onDrag: (k_isAuditor) ? undefined : function (k_grid, k_data, k_srcIndex, k_destIndex) {
if (k_destIndex >= k_grid.k_getRowsCount()) {
return false;
}
},

k_onDrop: (k_isAuditor) ? undefined : function (k_grid, k_data, k_rowIndex, k_isCopy) {
var
k_i, k_cnt;
if (k_isCopy) {
k_cnt = k_data.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_data[k_i].id = '';
}
}
if (k_grid._k_onDropCustom) {
k_grid._k_onDropCustom.call(k_grid, k_data, k_rowIndex, k_isCopy);
}
kerio.adm.k_framework.k_enableApplyReset();
},
k_loadMask: false,
k_isAuditor: k_isAuditor,
k_isRaster: true,
k_className: 'policyGrid' + (undefined === k_config.k_className ? '' : (' ' + k_config.k_className)),

k_rowRenderer: function(k_rowData, k_rowIndex) {
var
k_className = [];
k_className.push('background' + k_rowData.color);
if (true === k_rowData.inactive) {
k_className.push('ruleInactive');
}
if (k_rowData.k_isDefaultRule) {
k_className.push('ruleDefault');
}
if (this.k_isTrafficRules) {
this.k_hiddenRows[k_rowIndex] = k_rowData.k_isHidden;
}
if (k_rowData.k_isHidden) {
if (0 !== k_rowIndex && this.k_getRowByIndex(k_rowIndex-1).k_isHidden) {
k_className.push('ruleHidden');
k_rowData.k_isFirstInHiddenGroup = false;
}
else {
k_rowData.k_isFirstInHiddenGroup = true;
k_className.push('ruleHiddenFirst');
}
}
else {
k_rowData.k_isFirstInHiddenGroup = false;
}
return k_className.join(' ');
},

k_onBeforeEdit: function(k_grid, k_columnId, k_value, k_rowData) {
if (k_grid._k_isAuditor) {
return false; }
if (k_grid._k_onBeforeEditCustom) {
return k_grid._k_onBeforeEditCustom(k_columnId, k_rowData);
}
return !k_rowData.k_isDefaultRule;
},
k_columns: {
k_sorting: false,
k_items: k_gridColumns
},
k_toolbars: k_toolbars,
k_statusbar: k_statusbar,

k_onCellDblClick: function(k_grid, k_rowData, k_columnId) {
if (k_grid._k_isAuditor && 'users' !== k_columnId) {
return; }
if (k_rowData.k_isDefaultRule && !this.k_isTrafficRules) {
return; }
if ('users' !== k_columnId) {
if (this._k_onCellDblClickCustom) {
this._k_onCellDblClickCustom(k_grid, k_rowData, k_columnId);
}
}
},

k_onLoad: function(k_grid) {
var
k_extRecord,
k_extRecords,
k_i, k_cnt;
k_grid._k_markInactiveRules();
k_grid._k_checkPolicyStatus();
kerio.waw.k_hacks.k_suspendStoreEvents(k_grid);
k_grid._k_addDefaultRule();
kerio.waw.k_hacks.k_resumeStoreEvents(k_grid);
if ('k_bandwidthManagementRules' === this._k_objectName) {
k_extRecords = k_grid.k_getDataStore().k_extWidget.getRange();
for (k_i = 0, k_cnt = k_extRecords.length; k_i < k_cnt; k_i++) {
k_extRecord = k_extRecords[k_i];
k_grid.k_checkLinkSpeedNeeded(k_extRecord.data, k_extRecord);
}
}
if (!this.k_isTrafficRules) {
k_grid.k_refresh();
}
if ('k_contentRules' !== this._k_objectName) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
if (this.k_getRelatedData) {
this.k_getRelatedData();
}
kerio.adm.k_framework.k_enableApplyReset(false);
}
}; if (k_config.k_onClick) {
k_gridCfg.k_onClick = k_config.k_onClick;
if (k_config.k_isEnterMappedToDoubleClick && undefined === k_config.k_onDblClick) {
k_gridCfg.k_onDblClick = k_config.k_onClick;
k_gridCfg.k_isEnterMappedToDoubleClick = k_config.k_isEnterMappedToDoubleClick;
}
}
if (k_config.k_onRowSelect) {
k_gridCfg.k_onRowSelect = k_config.k_onRowSelect;
}
if (!k_config.k_isTabPage) {
k_gridCfg.k_remoteData = {
k_root: 'list',
k_isAutoLoaded: false,
k_isQueryValueSent: (false === k_config.k_isQueryValueSent ? false : true),
k_jsonRpc: {
method: k_config.k_manager + '.get'
}
};
}
kerio.waw.shared.k_widgets.K_RulesGrid.superclass.constructor.call(this, k_id, k_gridCfg);
if (k_config.k_onBeforeRemoveItem) {
this.k_addReferences({
_k_onBeforeRemoveItem: k_config.k_onBeforeRemoveItem
});
}
k_gridView = this.k_extWidget.getView();
kerio.waw.k_hacks.k_initCallOnLoadBeforeRender(k_gridView);
this.k_enableApplyOnRowMove = true;
this.k_addReferences({
_k_loadAddressGroups: k_loadAddressGroups,
_k_loadTimeRangeGroups: k_loadTimeRangeGroups,
k_newItemDefinition: k_config.k_newItemDefinition,
_k_defaultRuleDefinition: k_config.k_defaultRuleDefinition,
_k_isAuditor: k_isAuditor,
_k_manager: k_config.k_manager,
_k_objectName: k_config.k_objectName,
_k_isInactiveRuleCustom: k_config.k_isInactiveRule,
_k_customInactiveRuleCheck: k_config.k_customInactiveRuleCheck,
_k_isTabPage: k_config.k_isTabPage,
_k_onChangeHandler: k_onChangeHandler,
_k_onBeforeEditCustom: k_config.k_onBeforeEdit,
_k_cleanupData: k_config.k_cleanupData,
_k_createBatchRequests: k_config.k_createBatchRequests,
_k_onDropCustom: k_config.k_onDropCustom,
k_wizard: k_config.k_wizard,
k_highlightSearchValueRenderer: k_renderers.k_highlightSearchValueRenderer,
k_highlightPassedValue: k_renderers.k_highlightPassedValue,
k_isTrafficRules: k_isTrafficRules,
k_isFilterUsed: false
});
if ('k_bandwidthManagementRules' === this._k_objectName || 'trafficPolicyList' === this._k_objectName || 'k_contentRules' === this._k_objectName) {
this.k_addReferences({

k_requestClearEmbeddedDefinitions: function() {
this.k_embeddedDefinitionsNeedUpdate = true;
},

k_updateEmbeddedDefinitions: function() {
if (true !== this.k_embeddedDefinitionsNeedUpdate) {
this.k_embeddedDefinitionsNeedUpdate = false;
return;
}
this.k_embeddedDefinitionsNeedUpdate = false;
switch (this.k_id) {
case 'trafficSourceEditor_k_itemsGrid':
case 'trafficDestinationEditor_k_itemsGrid':
case 'contentFilterSourceEditor_k_grid':
this.k_updateEmbeddedIpAddressGroups();
break;
case 'contentFilterContentEditor_k_grid':
this.k_updateEmbeddedUrlGroups();
break;
default:
this.k_updateEmbeddedServices();
break;
}
}
});
}
if ('k_bandwidthManagementRules' === this._k_objectName || 'trafficPolicyList' === this._k_objectName) {
this.k_addReferences({
k_updateEmbeddedServices: function() {
var
RuleConditionType,
k_BM_CONDITION_TYPE_SERVICE,
k_isBandwidthManagementRules,
k_isTrafficRulesRules,
k_isServiceListChanged,
k_isServiceRemoved,
k_mappedService,
k_datastore,
k_serviceListMapped,
k_data,
k_item,
k_relatedGrid,
k_i;
k_datastore = kerio.waw.shared.k_data.k_get('k_services');
if (!k_datastore) {
return;
}
RuleConditionType = kerio.waw.shared.k_CONSTANTS.RuleConditionType;
k_BM_CONDITION_TYPE_SERVICE = kerio.waw.shared.k_CONSTANTS.BMConditionType.BMConditionService;
k_relatedGrid = this.k_relatedGrid || this.k_parentWidget.k_relatedGrid;
k_isBandwidthManagementRules = 'k_bandwidthManagementRules' === k_relatedGrid._k_objectName;
k_isTrafficRulesRules = 'trafficPolicyList' === k_relatedGrid._k_objectName;
k_isServiceListChanged = false;
k_isServiceRemoved = false;
k_serviceListMapped = k_datastore.k_serviceListMapped;
k_data = this.k_getData();
for (k_i = k_data.length - 1; 0 <= k_i; k_i--) {
k_item = k_data[k_i];
if ((!k_isBandwidthManagementRules && k_item.definedService) || k_BM_CONDITION_TYPE_SERVICE === k_item.type) {
k_mappedService = k_serviceListMapped[k_item.service.id];
if (undefined === k_mappedService) {
this.k_removeRowByIndex(k_i, true);
k_isServiceListChanged = true;
k_isServiceRemoved = true;
}
else {
if (k_mappedService.name !== k_item.service.name) {
k_item = kerio.lib.k_cloneObject(k_item);
k_item.service.name = k_mappedService.name;
this.k_updateRow(k_item, k_i);
k_isServiceListChanged = true;
}
}
}
}
if (k_isServiceListChanged) {
if (k_isBandwidthManagementRules) {
k_data = this.k_getData();
if (0 === k_data.length) {
k_data = [kerio.waw.shared.k_DEFINITIONS.k_get('k_bandwidthTrafficDataTemplate')];
this.k_datastore.k_fillData(k_data);
this.k_setData(this.k_datastore.k_getData());
}
else {
this.k_datastore.k_fillData(k_data);
}
}
else if (k_isTrafficRulesRules && k_isServiceRemoved && 0 === this.k_getRowsCount()) {
if (this.k_dialog) {
this.k_dialog.k_isNothing = true;
}
this.k_setData([{sortHash: 'k_nobody'}]);
}
}
if (k_relatedGrid && k_relatedGrid.k_updateInvalidServices) {
k_relatedGrid.k_updateInvalidServices();
}
}
});
}
if ('trafficPolicyList' === this._k_objectName) {
this.k_addReferences({
k_updateEmbeddedIpAddressGroups: function() {
var
k_TR_ENTITY_TYPE_ADDRESS_GROUP,
k_datastore,
k_ipGroupListMapped,
k_data,
k_item,
k_relatedGrid,
k_i;
k_datastore = kerio.waw.shared.k_data.k_get('k_ipAddressGroups');
if (!k_datastore) {
return;
}
k_TR_ENTITY_TYPE_ADDRESS_GROUP = kerio.waw.shared.k_CONSTANTS.TrafficEntityType.TrafficEntityAddressGroup;
k_relatedGrid = this.k_relatedGrid || this.k_parentWidget.k_relatedGrid;
k_ipGroupListMapped = k_datastore.k_ipGroupListMapped;
k_data = this.k_getData();
for (k_i = k_data.length - 1; 0 <= k_i; k_i--) {
k_item = k_data[k_i].item;
if (k_TR_ENTITY_TYPE_ADDRESS_GROUP === k_item.type && undefined === k_ipGroupListMapped[k_item.addressGroup.id]) {
k_item.addressGroup.invalid = true;
this.k_updateRow(k_item, k_i);
}
}
if (k_relatedGrid && k_relatedGrid.k_updateInvalidIpAddressGroups) {
k_relatedGrid.k_updateInvalidIpAddressGroups();
}
}
});
}
if ('k_contentRules' === this._k_objectName) {
this.k_addReferences({
k_updateEmbeddedIpAddressGroups: function() {
var
k_CF_ENTITY_TYPE_ADDRESS_GROUP,
k_datastore,
k_ipGroupListMapped,
k_data,
k_item,
k_relatedGrid,
k_i;
k_datastore = kerio.waw.shared.k_data.k_get('k_ipAddressGroups');
if (!k_datastore) {
return;
}
k_CF_ENTITY_TYPE_ADDRESS_GROUP = kerio.waw.shared.k_CONSTANTS.SourceConditonEntityType.SourceConditonEntityAddressGroup;
k_relatedGrid = this.k_relatedGrid || this.k_parentWidget.k_relatedGrid;
k_ipGroupListMapped = k_datastore.k_ipGroupListMapped;
k_data = this.k_getData();
for (k_i = k_data.length - 1; 0 <= k_i; k_i--) {
k_item = kerio.lib.k_cloneObject(k_data[k_i]);
if (k_CF_ENTITY_TYPE_ADDRESS_GROUP === k_item.type && undefined === k_ipGroupListMapped[k_item.ipAddressGroup.id]) {
k_item.ipAddressGroup.invalid = true;
this.k_updateRow(k_item, k_i);
}
}
if (k_relatedGrid && k_relatedGrid.k_updateInvalidIpAddressGroups) {
k_relatedGrid.k_updateInvalidIpAddressGroups();
}
},
k_updateEmbeddedUrlGroups: function() {
var
k_CF_CONDITION_TYPE_URL_GROUP,
k_datastore,
k_urlGroupListMapped,
k_data,
k_item,
k_relatedGrid,
k_i;
k_datastore = kerio.waw.shared.k_data.k_get('k_urlGroups');
if (!k_datastore) {
return;
}
k_CF_CONDITION_TYPE_URL_GROUP = kerio.waw.shared.k_CONSTANTS.ContentConditionEntityType.ContentConditionEntityUrlGroup;
k_relatedGrid = this.k_relatedGrid || this.k_parentWidget.k_relatedGrid;
k_urlGroupListMapped = k_datastore.k_urlGroupListMapped;
k_data = this.k_getData();
for (k_i = k_data.length - 1; 0 <= k_i; k_i--) {
k_item = kerio.lib.k_cloneObject(k_data[k_i]);
if (k_CF_CONDITION_TYPE_URL_GROUP === k_item.type && undefined === k_urlGroupListMapped[k_item.urlGroup.id]) {
k_item.urlGroup.invalid = true;
this.k_updateRow(k_item, k_i);
}
}
if (k_relatedGrid && k_relatedGrid.k_updateInvalidUrlGroups) {
k_relatedGrid.k_updateInvalidUrlGroups();
}
}
});
}
}; kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_RulesGrid', kerio.waw.shared.k_widgets.K_ContextMenuList, {


k_onLoad: function() {
if (this.k_isTrafficRules) {
this.k_reloadData();
if (this.k_isFilterUsed) {
kerio.lib.k_ajax.k_request(this.k_lastFilterRequest);
}
}
else {
this._k_dataStore._k_onLoad({}, {}, {});
}
if (this._k_loadAddressGroups) {
kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_ipAddressGroupList',
k_select: this.k_getColumnEditor('validAddressEditor')
}).k_sendRequest();
}
if (this._k_loadTimeRangeGroups) {
kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_timeRangeList',
k_select: this.k_getColumnEditor('validTimeRangeEditor')
}).k_sendRequest();
}
},

k_removeItem: function() {
if (this._k_onBeforeRemoveItem) {
this._k_onBeforeRemoveItem(this);
}
this.k_removeSelectedRows();
if (this._k_isTabPage) {
this._k_onChangeHandler();
} else {
kerio.adm.k_framework.k_enableApplyReset();
}
this._k_checkPolicyStatus();
},
k_addItem: function(k_newItemIndex) {
this.k_startCellEdit(k_newItemIndex, 'name');
if (this._k_isTabPage) {
this._k_onChangeHandler();
} else {
kerio.adm.k_framework.k_enableApplyReset();
}
},
_k_addDefaultRule: function() {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_ruleData = kerio.waw.shared.k_DEFINITIONS.k_get(this.k_newItemDefinition),
k_tr = kerio.lib.k_tr,
k_description;
switch (this._k_objectName) {
case 'k_bandwidthManagementRules':
k_description = k_tr('Any other communication is kept untouched.', 'ruleList');
break;
case 'trafficPolicyList':
k_description = k_tr('Any other communication is denied/dropped.', 'ruleList');
break;
default: k_description = k_tr('Any other communication is allowed.', 'ruleList');
break;
}
k_ruleData.k_isDefaultRule = true;
k_ruleData.name = this.k_isTrafficRules ? k_tr('Block other traffic', 'ruleList') : k_tr('Allow other traffic', 'ruleList');
k_ruleData.description = k_description;
k_ruleData.action = k_WAW_CONSTANTS.RuleAction.Allow;
k_ruleData.color = k_WAW_CONSTANTS.k_POLICY_BCKG_COLORS.k_GREEN;
if ('k_bandwidthManagementRules' === this._k_objectName) {
k_ruleData.name = this._k_defaultRuleDefinition.name;
}
if (this._k_defaultRuleDefinition) {
if ('k_bandwidthManagementRules' !== this._k_objectName) {
delete this._k_defaultRuleDefinition.name; }
if (this.k_isTrafficRules) {
delete this._k_defaultRuleDefinition.description; }
kerio.waw.shared.k_methods.k_mergeObjects(this._k_defaultRuleDefinition, k_ruleData);
}
this.k_appendRow(k_ruleData);
},
_k_isInactiveRule: function(k_data) {
if (('' !== k_data.validTimeRange.id) && k_data.validTimeRange.invalid) {
return true;
}
if (this._k_isInactiveRuleCustom) {
return this._k_isInactiveRuleCustom(k_data);
}
return false;
},

_k_markInactiveRules: function() {
var
k_rowDataList = this.k_getData(),
k_i, k_cnt;
for (k_i = 0, k_cnt = k_rowDataList.length; k_i < k_cnt; k_i++) {
k_rowDataList[k_i].inactive = this._k_isInactiveRule(k_rowDataList[k_i]);
}
},

_k_filterInactiveRule: function(k_data) {
return k_data.inactive;
},

_k_checkPolicyStatus: function() {
var
k_statusbarConfigId = 'k_default',
k_rowDataList,
k_customStatusbarConfigId;
k_rowDataList = this.k_findRowBy(this._k_filterInactiveRule);
if (k_rowDataList) {
k_statusbarConfigId = 'k_ruleInactive';
}
if (this._k_customInactiveRuleCheck) {
k_customStatusbarConfigId = this._k_customInactiveRuleCheck(k_statusbarConfigId);
}
if (k_customStatusbarConfigId) {
k_statusbarConfigId = k_customStatusbarConfigId;
}
this.k_statusbar.k_switchConfig(k_statusbarConfigId);

}, 
_k_onChangeCheckRule: function(k_ruleData) {
this._k_onChangeHandler();
if (k_ruleData.inactive) {
k_ruleData.inactive = this._k_isInactiveRule(k_ruleData);
}
this._k_checkPolicyStatus();
},

k_updateRowStatus: function(k_rowData) {
if (true === k_rowData) {
this._k_markInactiveRules();   this._k_onChangeCheckRule({}); }
else if ('object' === typeof k_rowData){
this._k_onChangeCheckRule(k_rowData);
}
else {
this._k_onChangeCheckRule({}); }

},

k_sendData: function() {
if (this.k_hasUnfinishedRules()) {
return false;
}
this._k_deferSendData.defer(1,this);
},

k_isRuleUnfinished: function(k_data, k_specificRule) {
var
k_shared = kerio.waw.shared,
k_message;
if (-1 === k_shared.k_DEFINITIONS.k_VALID_POLICY_ACTIONS_STRING.indexOf(k_data.action) || '' === k_data.action) {
if (true === k_specificRule) {
k_message = kerio.lib.k_tr('Please set the action for this rule!', 'list');
}
else {
k_message = kerio.lib.k_tr('Please set the action for rule "%1"!', 'list', {k_args: [k_data.name]});
}
k_shared.k_methods.k_alertError(k_message);
return true;
}
return false;
},

k_hasUnfinishedRules: function(k_userDefinedTestMethod) {
var
k_data = this.k_getData(),
k_i, k_cnt;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (this.k_isRuleUnfinished(k_data[k_i])) {
return true;
}
if (k_userDefinedTestMethod && k_userDefinedTestMethod(k_data[k_i])) {
return true;
}
}
return false;
},

_k_deferSendData: function(k_options) {
var
k_data = kerio.lib.k_cloneObject(this.k_getData()),
k_isOverlappingCheck,
k_rule,
k_i, k_cnt,
k_requestCfg;
k_options = k_options || {};
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_rule = k_data[k_i];
delete k_rule.inactive;
delete k_rule.validAddressEditor;
delete k_rule.validTimeRangeEditor;
}
if (this._k_cleanupData) {
this._k_cleanupData(k_data);
}
k_data = this.k_removeDefaultRule(k_data);
if (k_data && Array === k_data.constructor) {
k_data = {
rules: k_data
};
} k_requestCfg = {
k_jsonRpc: {
method: this._k_manager + '.' + 'set',
params: k_data
},
k_callback: this._k_sendDataCallback,
k_scope: this
};
if ('TrafficPolicy' === this._k_manager || 'ContentFilter' === this._k_manager) {
k_isOverlappingCheck = 'TrafficPolicy' === this._k_manager
? true !== kerio.waw.status.k_userSettings.k_get('trafficRulesOverlappingDisabled')
: true !== kerio.waw.status.k_userSettings.k_get('contentFilterOverlappingDisabled');
if (k_isOverlappingCheck) {
if ('TrafficPolicy' === this._k_manager) {
kerio.waw.requests.k_send(k_requestCfg);
}
k_requestCfg = [];
k_requestCfg.push({
k_jsonRpc: {
method:  this._k_manager + '.getCollisions'
},
k_timeout: kerio.waw.shared.k_CONSTANTS.k_TIMEOUT_REQUEST_DOMAIN_CONTROLLER,
k_scope: this,
k_callback: function(k_response, k_success) {
if (k_success) {
var
k_tr = kerio.lib.k_tr,
k_list = k_response.list,
k_cnt = k_list.length,
k_message = [],
k_isMoreItems = false,
k_item,
k_forCnt,
k_restCnt,
k_i;
if (0 !== k_cnt) {
k_isMoreItems = k_cnt > 6;
k_forCnt = k_isMoreItems ? 5 : k_cnt;
for (k_i = 0; k_i < k_forCnt; k_i++) {
k_item = k_list[k_i];
k_message.push(k_tr('The rule "%1" is overlapping the rule "%2".', 'rulesOverlaping', { k_args: [k_item.rule.name, k_item.overlappedRule.name] }));
}
if (k_isMoreItems) {
k_restCnt = k_cnt - k_forCnt;
k_message.push( k_tr('…and %1 more [incident|incidents]', 'rulesOverlaping', {k_args: [ k_restCnt ], k_pluralityBy: k_restCnt }) );
}
k_message.push('');
k_message.push('<input type="checkbox" name="overlapingCheckDisabled" id="overlapingCheckDisabled" /><span class="dontShowAgain">' + k_tr('Do not show this warning again', 'rulesOverlaping') + '</span>');
kerio.lib.k_alert(
{
k_title: k_tr('Rules Overlapping', 'advancedOptionsList'),
k_msg: k_message.join('<br />'),
k_callback: function() {
var
k_isTrafficList = 'trafficRules' === kerio.lib.k_widgets.k_admMenuTree._k_lastNode.id,
k_neverShowAgain = Ext.get('overlapingCheckDisabled').dom.checked;
if (k_neverShowAgain) {
if (k_isTrafficList) {
kerio.waw.status.k_userSettings.k_set('trafficRulesOverlappingDisabled', true);
}
else {
kerio.waw.status.k_userSettings.k_set('contentFilterOverlappingDisabled', true);
}
}
}
}
);
}
}
}
});
kerio.waw.requests.k_sendBatch(k_requestCfg);
}
else if ('TrafficPolicy' === this._k_manager) {
kerio.waw.requests.k_send(k_requestCfg);
}
} else {
kerio.lib.k_ajax.k_request(k_requestCfg);
}
}, 
k_removeDefaultRule: function(k_data) {
if (k_data && k_data[k_data.length - 1].k_isDefaultRule) {
k_data.pop(); }
return k_data;
},
_k_sendDataCallback: function(k_response, k_success) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
if (k_success && kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
var
k_storeId;
kerio.adm.k_framework.k_enableApplyReset(false);
switch (this._k_objectName) {
case 'trafficPolicyList':
k_storeId = 'k_selectTrafficRule';
break;
case 'k_ftpRules':
k_storeId = 'k_selectFtpRule';
break;
}
kerio.waw.shared.k_methods.k_updateDataStore(k_storeId);
if (true !== kerio.adm.k_framework.k_leaveCurrentScreen() && this.k_isTrafficRules) {
this.k_applyParams();
}
} else {
if (this.k_isTrafficRules) {
this.k_applyParams();
} else {
this.k_reloadData();
}
}
}, 
k_updateRelatedFields: function(k_data) {
var
k_dataStore = kerio.waw.shared.k_data.k_getStore('k_timeRangeList');
k_dataStore.k_clearData();
k_dataStore.k_setData(k_data);
}
}); 
kerio.waw.shared.k_widgets.K_AutorefreshGrid = function (k_id, k_config) {
var
k_localNamespace = k_id + '_',
k_shared = kerio.waw.shared,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_type = k_config.k_type,
k_contextMenuCfg = k_config.k_contextMenuCfg,
k_queryParams = k_config.k_queryParams || {},
k_customOnLoad,
k_contextMenu,
k_gridCfg,
k_quickSearchField;
k_queryParams.query = k_queryParams.query || {};
k_queryParams.method = k_type + '.get';
if (k_contextMenuCfg) {
k_contextMenu = new kerio.lib.K_Menu(k_localNamespace + 'k_menu', k_contextMenuCfg);
delete k_config.k_contextMenuCfg;
}
k_gridCfg = {
k_contextMenu: k_contextMenu,
k_useSnapshot: true,
k_loadMask: false,
k_remoteData: {
k_root: 'list',
k_isAutoLoaded: false,
k_jsonRpc: k_queryParams
},

k_onLoad: function(k_grid, k_options, k_jsonData) {
k_grid.k_disableRefreshGui(false);
if (this._k_customOnLoad) {
this._k_customOnLoad(k_grid, k_options, k_jsonData);
}
}, 
k_onBeforeLoad: function(k_grid, k_conditions, k_params, k_request) {
if (true === k_grid.k_forceRefresh && false === k_params.refresh) {
k_params.refresh = true;
k_grid.k_forceRefresh = false;
}
if (!k_grid.k_parentFormElements) {
if (this.k_onBeforeLoad) {
this.k_onBeforeLoad.apply(this, arguments);
}
return;
}
var
k_i,
k_indexOf = -1,
k_parentFormElements = k_grid.k_parentFormElements,
k_hideLocalConnectionsCondition = k_grid.k_hideLocalConnectionsCondition;

if (k_parentFormElements.k_hideLocal) {
for (k_i = 0; k_i < k_conditions.length; k_i++) {
if (k_conditions[k_i].fieldName &&
k_conditions[k_i].fieldName === k_hideLocalConnectionsCondition.fieldName
) {
k_indexOf = k_i;
break;
}
}
if (true === k_parentFormElements.k_hideLocal.k_getValue()) {
if (-1 === k_indexOf) {
k_conditions.push(k_hideLocalConnectionsCondition);
}
} else {
if (-1 < k_indexOf) { k_conditions.splice(k_indexOf, 1);
}
}
}
if (k_grid.k_queryParams && k_grid.k_queryParams.hostId) {
k_params.hostId = k_grid.k_queryParams.hostId;
}
if (this.k_onBeforeLoad) {
this.k_onBeforeLoad.apply(this, arguments);
}
}}; if (false === k_config.k_isMainSearch) {
k_gridCfg.k_filters = {
k_search: {
k_isSearchField: false
}
};
}
if (k_config.k_onLoad) {
k_customOnLoad = k_config.k_onLoad;
delete k_config.k_onLoad;
}
kerio.waw.shared.k_methods.k_mergeObjects(k_config, k_gridCfg, '');
k_gridCfg.k_isScrolledPositionKept = false;
kerio.waw.shared.k_widgets.K_AutorefreshGrid.superclass.constructor.call(this, k_id, k_gridCfg);
k_quickSearchField = this.k_toolbars.k_top.k_items.k_search;
this.k_addReferences({
k_isAuditor: k_isAuditor,
k_type: k_type,
k_contextMenu: k_contextMenu,
k_refreshTaskId: k_localNamespace + 'k_refreshTask',
k_customSearchId: undefined,k_silentRefresh: false,
k_onSetAutoRefreshInterval: k_config.k_onSetAutoRefreshInterval,
k_onDisableRefresh: k_config.k_onDisableRefresh,
k_lastRequestRef: undefined,
k_quickSearchField: k_quickSearchField,
k_quickSearchCondition: k_shared.k_DEFINITIONS.k_get('k_searchCondition', { k_value: ''}),
k_queryParams: k_queryParams,
_k_customOnLoad: k_customOnLoad,
k_forceRefresh: true
});
}; kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_AutorefreshGrid', kerio.adm.k_widgets.K_LiveGrid, {


k_createQuery: function() {
var
k_quickSearchValue = this.k_quickSearchField.k_getValue(),
k_params = this.k_queryParams,
k_conditions = [];
if (!this.k_silentRefresh) {
this.k_disableRefreshGui();
}
this.k_runAutoRefresh(false);

if ('' !== k_quickSearchValue) {
this.k_quickSearchCondition.value = k_quickSearchValue;
k_conditions.push(this.k_quickSearchCondition);
}
k_params.query.conditions = k_conditions;
return k_params;
}, 
k_getSavedAutoRefreshInterval: function() {
var
k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_autorefresh;
k_autorefresh = kerio.waw.status.k_userSettings.k_get(this.k_id + '.' + 'autorefresh', k_DEFINITIONS.k_AUTOREFRESH_INTERVAL);
if (k_DEFINITIONS.k_AUTOREFRESH_DISABLED !== k_autorefresh) {
k_autorefresh = k_DEFINITIONS.k_AUTOREFRESH_INTERVAL;
}
return k_autorefresh;
},

k_handleAutorefresh: function(k_interval, k_startDeferred, k_avoidUserSettings) {
if (true !== k_avoidUserSettings) {
kerio.waw.status.k_userSettings.k_set(this.k_id + '.' + 'autorefresh', k_interval);
}
this.k_setAutoRefreshInterval(k_interval, true === k_startDeferred);
if (this.k_onSetAutoRefreshInterval) {
this.k_onSetAutoRefreshInterval(k_interval, k_startDeferred, k_avoidUserSettings);
}
},

k_initAutoRefreshTask: function(k_interval, k_startDeferred) {
this.k_setAutoRefreshInterval(k_interval, k_startDeferred);
},

k_runAutoRefresh: function(k_run) {
var
k_tasks = kerio.waw.shared.k_tasks,
k_taskId = this.k_refreshTaskId;
if (!k_tasks.k_isDefined(k_taskId)) { return false;
}
if (false !== k_run) {
return k_tasks.k_resume(k_taskId, true); }
return k_tasks.k_suspend(k_taskId);
}, 
k_linkSearchToolbar: function(k_searchToolbar) {
var
k_constEvent = kerio.lib.k_constants.k_EVENT;
this.k_addReferences({
k_quickSearchField: k_searchToolbar.k_searchField
});
this.k_toolbarGrid = { k_topToolbar: k_searchToolbar,
_k_sharedConstants: kerio.lib.k_getSharedConstants(),
_k_isReadOnly: this._k_isReadOnly,
_k_libConstants: {
_k_constEventTypes: k_constEvent.k_TYPES,
_k_constKeyCodes: k_constEvent.k_KEY_CODES
},
_k_engineManager: ''
};
k_searchToolbar.k_relatedWidget = this; }, 
k_disableRefreshGui: function(k_disable) {
k_disable = false !== k_disable; if (this.k_onDisableRefresh) {
this.k_onDisableRefresh(k_disable);
}
}
}); 
kerio.waw.shared.k_widgets.K_ConnectionsGrid = function (k_id, k_config) {
var
k_tr = kerio.lib.k_tr,
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_type = k_config.k_type || 'ActiveConnections',
k_userSettings = {},
k_queryParams = {},
k_countryRenderer,
k_hideLocalConnectionsCondition,
k_renderTime,
k_resetPendingRequest,
k_gridCfg;
k_hideLocalConnectionsCondition = kerio.waw.shared.k_DEFINITIONS.k_get('k_searchCondition', {
k_fieldName: 'direction',
k_comparator: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_NotEq,
k_value: k_CONSTANTS.ConnectionDirection.ConnectionDirectionLocal
});
if (k_type !== 'VpnClients') {
k_queryParams.hostId = '';
k_userSettings.k_showDnsNames = kerio.waw.status.k_userSettings.k_get(k_id + '.showDnsNames', false);
k_userSettings.k_hideLocal = kerio.waw.status.k_userSettings.k_get(k_id + '.hideLocal', false);
k_queryParams.query = {
start: 0,
conditions: [],
combining: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_And
};
}

k_renderTime = function(k_value, k_data) {
this.k_timeObject.sec = k_value;
return {
k_data: kerio.waw.shared.k_methods.k_formatElapsedTime(this.k_timeObject)
};
};

k_resetPendingRequest = function() {
this._k_requestPending = false;
};
k_countryRenderer = function(k_value) {
return {
k_data: k_value ? kerio.waw.shared.k_DEFINITIONS.k_MAP_COUNTRIES[k_value].k_name : ''
};
};
k_gridCfg = {
k_type: k_type,
k_columns: {
k_sorting: {
k_columnId: 'trafficRule'
},
k_items: [
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'active',
k_isDataOnly: true
},
{
k_columnId: 'src',
k_isDataOnly: true
},
{
k_columnId: 'dst',
k_isDataOnly: true
},
{
k_columnId: 'trafficRule',
k_caption: k_tr('Traffic Rule', 'connectionsList'),
k_width: 150
},
{
k_columnId: 'service',
k_caption: k_tr('Service', 'connectionsList')
},
{
k_columnId: 'srcIp',
k_caption: k_tr('Source IP', 'connectionsList'),
k_width: 100,
k_renderer: function(k_value, k_data) {
var k_render = k_data.src.ip;
return { k_data: k_render };
}
},
{
k_columnId: 'srcHost',
k_caption: k_tr('Source Hostname', 'connectionsList'),
k_width: 150,
k_isHidden: !k_userSettings.k_showDnsNames, k_renderer: function(k_value, k_data) {
var k_render = k_data.src.host;
return { k_data: k_render };
}
},
{
k_columnId: 'srcCountry',
k_caption: k_tr('Source Country', 'connectionsList'),
k_width: 120,
k_isHidden: true,
k_renderer: function(k_value, k_data) {
var k_render = k_data.src.country ? kerio.waw.shared.k_DEFINITIONS.k_MAP_COUNTRIES[k_data.src.country].k_name : '';
return { k_data: k_render };
}
},
{
k_columnId: 'dstIp',
k_caption: k_tr('Destination IP', 'connectionsList'),
k_width: 100,
k_renderer: function(k_value, k_data) {
var k_render = k_data.dst.ip;
return { k_data: k_render };
}
},
{
k_columnId: 'dstHost',
k_caption: k_tr('Destination Hostname', 'connectionsList'),
k_width: 170,
k_isHidden: !k_userSettings.k_showDnsNames, k_renderer: function(k_value, k_data) {
var k_render = k_data.dst.host;
return { k_data: k_render };
}
},
{
k_columnId: 'dstCountry',
k_caption: k_tr('Destination Country', 'connectionsList'),
k_width: 140,
k_isHidden: true,
k_renderer: function(k_value, k_data) {
var k_render = k_data.dst.country ? kerio.waw.shared.k_DEFINITIONS.k_MAP_COUNTRIES[k_data.dst.country].k_name : '';
return { k_data: k_render };
}
},
{
k_columnId: 'bandwidthRuleName',
k_caption: k_tr('Bandwidth Management Rule', 'connectionsList'),
k_width: 150
},
{
k_columnId: 'internetLink',
k_caption: k_tr('Load Balancing', 'connectionsList')
},
{
k_columnId: 'srcPort',
k_caption: k_tr('Source Port', 'connectionsList'),
k_isHidden: true,
k_renderer: function(k_value, k_data) {
var k_render = k_data.src.port;
return { k_data: k_render };
}
},
{
k_columnId: 'dstPort',
k_caption: k_tr('Destination Port', 'connectionsList'),
k_isHidden: true,
k_renderer: function(k_value, k_data) {
var k_render = k_data.dst.port;
return { k_data: k_render };
}
},
{
k_columnId: 'protocol',
k_caption: k_tr('Protocol', 'connectionsList'),
k_width: 80,
k_isHidden: true
},
{
k_columnId: 'timeout',
k_caption: k_tr('Timeout', 'connectionsList'),
k_isHidden: true,
k_width: 80,
k_renderer: k_renderTime
},
{
k_columnId: 'age',
k_caption: k_tr('Age', 'connectionsList'),
k_isHidden: true,
k_width: 80,
k_renderer: k_renderTime
},
{
k_columnId: 'rxNum',
k_caption: k_tr('Rx [MB]', 'connectionsList'),
k_width: 60,
k_isHidden: true,
k_align: 'right',
k_renderer: kerio.waw.shared.k_methods.k_renderers.k_renderMBColumn
},
{
k_columnId: 'txNum',
k_caption: k_tr('Tx [MB]', 'connectionsList'),
k_width: 60,
k_isHidden: true,
k_align: 'right',
k_renderer: kerio.waw.shared.k_methods.k_renderers.k_renderMBColumn
},
{
k_columnId: 'info',
k_caption: k_tr('Info', 'connectionsList'),
k_width: 150,
k_isHidden: true,

k_renderer: function(k_value) {
return {
k_data: k_value,
k_dataTooltip: k_value
};
}
},
{
k_columnId: 'direction',
k_caption: k_tr('Type', 'connectionsList'),

k_renderer: function(k_value, k_data) {
var
ConnectionDirection = kerio.waw.shared.k_CONSTANTS.ConnectionDirection,
k_text = '';
switch (k_value) {
case ConnectionDirection.ConnectionDirectionInbound:
if (k_data.active) {
k_text = this.k_trInboundConnection;
}
else {
k_text = this.k_trInactiveInboundConnection;
}
break;
case ConnectionDirection.ConnectionDirectionOutbound:
if (k_data.active) {
k_text = this.k_trOutboundConnection;
}
else {
k_text = this.k_trInactiveOutboundConnection;
}
break;
case ConnectionDirection.ConnectionDirectionLocal:
if (k_data.active) {
k_text = this.k_trLocalConnection;
}
else {
k_text = this.k_trInactiveLocalConnection;
}
break;
default:
break;
}
return {
k_data: k_text
};
}
} ]},

k_rowRenderer: function(k_rowData) {
var
ConnectionDirection = kerio.waw.shared.k_CONSTANTS.ConnectionDirection,
k_className = 'connection';
if (!k_rowData.active) {
k_className += ' inactive';
}
switch (k_rowData.direction) {
case ConnectionDirection.ConnectionDirectionInbound:
k_className += ' inbound';
break;
case ConnectionDirection.ConnectionDirectionOutbound:
k_className += ' outbound';
break;
default:
break;
}
return k_className;
},
k_remoteData: {
k_jsonRpc: k_queryParams
}
}; if ('ActiveHosts' === k_config.k_widgetType) {
k_gridCfg.k_onLoadException = k_resetPendingRequest;
k_gridCfg.k_onLoad = k_resetPendingRequest;
}
if (!k_isAuditor) {
k_gridCfg.k_contextMenuCfg = {
k_items: [
{
k_id: 'k_kill',
k_caption: k_type !== 'VpnClients' ? k_tr('Kill Connection', 'connectionsList') : k_tr('Disconnect', 'connectionsList'),
k_isDisabled: true,

k_onClick: function(k_menu, k_item) {
var
k_grid = k_menu.k_relatedWidget,
k_selection = k_grid.k_selectionStatus,
k_ids = [],
k_i;
if (0 >= k_selection.k_selectedRowsCount) {
return; }
for (k_i = 0; k_i < k_selection.k_selectedRowsCount; k_i++) {
k_ids.push(k_selection.k_rows[k_i].k_data.id);
}
k_grid.k_killConnection(k_ids);
}
}
] }; } if (k_config.k_columns) {
k_gridCfg.k_columns = k_config.k_columns;
}
kerio.waw.shared.k_methods.k_mergeObjects(k_config, k_gridCfg, '');
if (k_type === 'VpnClients') {
k_gridCfg.k_rowRenderer = undefined;
k_gridCfg.k_statusbar = new kerio.lib.K_Statusbar(k_id + '_' + 'k_statusbar', {
k_configurations: {
k_noVpnServer: {
k_text: kerio.lib.k_tr('VPN server is not running. No users can connect using Kerio Control VPN Client.', 'vpnClientsList'),
k_iconCls: 'vpnClients warning',
k_link: {
k_text: k_tr('Check VPN Server status under %1…', 'accountingList', {
k_args: [
k_shared.k_DEFINITIONS.k_get('k_MENU_TREE_NODES.interfaceList')
]
}),
k_onClick: kerio.waw.status.k_currentScreen.k_gotoNode.createDelegate(kerio.waw.status.k_currentScreen, ['interfaces'])
}
}
},
k_defaultConfig: 'k_noVpnServer'
}); }
kerio.waw.shared.k_widgets.K_ConnectionsGrid.superclass.constructor.call(this, k_id, k_gridCfg);
if (!k_isAuditor) {

this.k_contextMenu.k_update = function(k_sender) {
if (k_sender && k_sender.k_isInstanceOf('K_Grid')) {
this.k_enableItem('k_kill', k_sender.k_selectionStatus.k_selectedRowsCount > 0);
}
};
kerio.lib.k_registerObserver(this, this.k_contextMenu, [this.k_eventTypes.k_SELECTION_CHANGED]);
} kerio.waw.k_hacks.k_addSortingHack(this);this.k_addReferences({
_k_requestPending: false,
k_trInboundConnection: k_tr('Inbound connection', 'connectionsList'),
k_trInactiveInboundConnection: k_tr('Inactive inbound connection', 'connectionsList'),
k_trOutboundConnection: k_tr('Outbound connection', 'connectionsList'),
k_trInactiveOutboundConnection: k_tr('Inactive outbound connection', 'connectionsList'),
k_trLocalConnection: k_tr('Local connection', 'connectionsList'),
k_trInactiveLocalConnection: k_tr('Inactive local connection', 'connectionsList'),
k_hideLocalConnectionsCondition: k_hideLocalConnectionsCondition,
k_showDnsNames: k_userSettings.k_showDnsNames,
k_timeObject: {
hour: 0,
min: 0,
sec: 0
},
k_killConnectionRequest: {
k_jsonRpc: {
method: k_type + '.kill'
},
k_callback: this._k_killConnectionCallback,
k_callbackParams:
'VpnClients' !== k_type ?
undefined :
{
k_defer: true
},
k_scope: this
}
});
kerio.waw.k_hacks.k_fixGridOnLoadError(this);
}; kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_ConnectionsGrid', kerio.waw.shared.k_widgets.K_AutorefreshGrid, {


k_killConnection: function(k_connectionIds) {
this.k_disableRefreshGui();
this.k_runAutoRefresh(false);
this.k_killConnectionRequest.k_jsonRpc.params = { ids: k_connectionIds };
kerio.lib.k_ajax.k_request(this.k_killConnectionRequest);
},

_k_killConnectionCallback: function(k_response, k_success, k_callbackParams) {
if (k_callbackParams && true === k_callbackParams.k_defer) {
this.k_reloadData.defer(1000, this);
return;
}
this.k_reloadData();
},

k_onLoadError: function() {
this._k_requestPending = false;
}
}); 
kerio.waw.shared.k_widgets.K_ConnectionsPane = function (k_id, k_config) {
var
k_type = (k_config && k_config.k_type) ? k_config.k_type : 'ActiveConnections',
k_createRefresh = 'VpnClients' === k_type,
k_gridConfig = {},
k_gridId = k_id + '_' + 'connectionsGrid',
k_grid,
k_autoRefreshGui,
k_toolbarContainer,
k_toolbarItems,
k_index,
k_onChangeHandler,
k_setReferences,
k_formCfg,
k_widgetType;

k_onChangeHandler = function(k_form, k_item, k_value) {
if (true === k_value || false === k_value) { kerio.waw.status.k_userSettings.k_set(k_form._k_gridId + '.' + k_item.k_name, k_value);
} else {
k_form.k_grid.k_forceRefresh = true;
}
k_form.k_grid.k_reloadData();
};

k_setReferences = function(k_references) {
this.k_parentFormElements.k_hideLocal = k_references.k_hideLocal;
};
if (k_config && k_config.k_gridCfg) {
k_gridConfig = k_config.k_gridCfg;
}
k_widgetType = k_type;
switch (k_type) {
case 'ActiveConnections':
break;
case 'ActiveHosts':
k_type = 'ActiveConnections';
break;
case 'VpnClients':
k_toolbarContainer = [
{
k_type: 'k_row',
k_items: []
}
];
break;
}
if (k_createRefresh) {
k_toolbarItems = k_toolbarContainer[k_toolbarContainer.length - 1].k_items;
k_index = k_toolbarItems.length;
k_toolbarItems.splice(k_index, 0,
'->',
kerio.waw.shared.k_DEFINITIONS.k_get('K_AutoRefreshCheckbox')
);
k_gridConfig.k_onSetAutoRefreshInterval = kerio.waw.shared.k_methods.k_onSetAutoRefreshInterval;
}
k_gridConfig.k_type = k_type;
k_gridConfig.k_widgetType = k_widgetType;
k_gridConfig.k_isMainSearch = k_config ? k_config.k_isMainSearch : true;
k_grid = new kerio.waw.shared.k_widgets.K_ConnectionsGrid(k_gridId, k_gridConfig);
k_formCfg = {
k_className: 'connectionsPane',
k_items: [
{
k_type: 'k_container',
k_id: 'k_gridContainer',
k_content: k_grid
}
]
};
if ('ActiveConnections' !== k_widgetType && 'ActiveHosts' !== k_widgetType) {
k_formCfg.k_items.push({
k_height: 21,
k_type: 'k_container',
k_id: 'k_bottomToolbar',
k_items: k_toolbarContainer
});
}
kerio.waw.shared.k_widgets.K_ConnectionsPane.superclass.constructor.call(this, k_id, k_formCfg);
this.k_addReferences({
_k_gridId: k_gridId, k_type: k_type,
k_widgetType: k_widgetType,
k_grid: k_grid
});
if (k_createRefresh) {
k_autoRefreshGui = this.k_getItem('k_autoRefreshCheckbox');
k_autoRefreshGui.k_addReferences({
k_grid: k_grid,
k_ignoreOnChange: false
});
k_grid.k_addReferences({
k_autoRefreshGui: k_autoRefreshGui
});
}
k_grid.k_addReferences({
k_parentForm: this,
k_parentFormElements: {
k_hideLocal: this.k_getItem('hideLocal')
},
k_setReferences: k_setReferences
});
}; kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_ConnectionsPane', kerio.lib.K_Form, {


k_loadData: function(k_hostId) {
var
k_isActiveHosts = 'ActiveHosts' === this.k_widgetType;
if (k_isActiveHosts) {
if (this.k_grid._k_requestPending) {
return;
}
if (undefined !== k_hostId) {
this.k_grid.k_queryParams.hostId = k_hostId;
} else {
this.k_grid.k_queryParams.hostId = '';
}
}
this.k_grid.k_reloadData();
if (k_isActiveHosts) {
this.k_grid._k_requestPending = true;
}
},

k_onActivate: function() {
var
k_autorefresh = this.k_grid.k_getSavedAutoRefreshInterval();
this.k_grid.k_handleAutorefresh(k_autorefresh, true, true);
},

k_onDeactivate: function() {
this.k_grid.k_initAutoRefreshTask(0);
}
});
kerio.waw.shared.k_widgets.K_SplittedLayout = function (k_id, k_config) {
var
k_tr = kerio.lib.k_tr,
k_isIPadCompatible = kerio.lib.k_isIPadCompatible,
k_isConnectionsList = 'connectionsList' === k_id,
k_localNamespace = k_id + '_',
k_className = 'splittedLayout',
k_hideDetailsText = k_tr('Hide Details', 'splittedLayout'),
k_showDetailsText = k_tr('Show Details', 'splittedLayout'),
k_isRefreshVisible = false !== k_config.k_isRefreshVisible,
k_layoutCfg = {},
k_connectionsGrid,
k_indexRefresh,
k_toolbar, k_toolbarCfg,
k_checkboxCfg,
k_checkboxHideLocal,
k_autoRefreshGui,
k_mainPaneMinSize,
k_detailsPaneIniSize,
k_detailsPaneMinSize;
if (!k_config.k_beforeApplyParams && !k_config.k_afterApplyParams) {
kerio.lib.k_reportError("Internal error: config must contain k_beforeApplyParams or k_afterApplyParams, don't use k_applyParams for this widget!", 'appWidgetsGrids', 'K_SplittedLayout');
}
k_config.k_iPad = k_config.k_iPad || {};
k_indexRefresh = 1;  k_toolbarCfg = {
k_className: 'bottomToolbar',
k_items: [
'->',
{
k_id: 'k_btnHideDetails',
k_caption: k_hideDetailsText,
k_mask: false,

k_onClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_setDetailsVisible(true);
}
}
]
};
k_toolbar = new kerio.lib.K_Toolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
k_className += undefined === k_config.k_className ? '' : (' ' + k_config.k_className);
k_config.k_className = k_className;
k_config.k_toolbars = k_config.k_toolbars || {};
if (k_isRefreshVisible) {
k_autoRefreshGui = kerio.waw.shared.k_methods.k_addRefreshCheckbox({
k_toolbar: k_toolbar,
k_index:   k_indexRefresh,
k_onChangeAutoRefresh: k_config.k_onChangeAutoRefresh
});
}
if (k_isConnectionsList) {
k_connectionsGrid = k_config.k_mainPaneContent.k_grid;
k_checkboxCfg = {
k_id: 'hideLocal',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_isChecked: kerio.waw.status.k_userSettings.k_get(k_connectionsGrid.k_id + '.hideLocal', false),
k_value: true,
k_option: k_tr('Hide local connections', 'connectionsList'),
k_onChange: function(k_toolbar, k_item, k_value) {
if (true === k_value || false === k_value) { kerio.waw.status.k_userSettings.k_set(k_toolbar._k_gridId + '.' + k_item.k_name, k_value);
} else {
k_toolbar.k_grid.k_forceRefresh = true;
}
k_toolbar.k_grid.k_reloadData();
}
};
k_checkboxHideLocal = new kerio.lib.K_Checkbox(k_toolbar.k_id + '_' + 'k_checkbox' + '_' + 'hideLocal', k_checkboxCfg);
k_toolbar.k_addWidget(k_checkboxHideLocal, 0);
k_checkboxCfg = {
k_id: 'showDnsNames',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_isChecked: kerio.waw.status.k_userSettings.k_get(k_connectionsGrid.k_id + '.showDnsNames', false),
k_style: 'margin-left: 25px;',
k_option: k_tr('Show DNS names', 'connectionsList'),
k_onChange: function(k_toolbar, k_item, k_value) {
kerio.waw.status.k_userSettings.k_set(k_toolbar._k_gridId + '.' + k_item.k_name, k_value);
k_toolbar.k_grid.k_showDnsNames = k_value;
k_toolbar.k_grid.k_reloadData();
}
};
k_connectionsGrid.k_setReferences({
k_hideLocal: k_checkboxHideLocal
});
k_connectionsGrid.k_onSetAutoRefreshInterval = kerio.waw.shared.k_methods.k_onSetAutoRefreshInterval;
}
if (k_config.k_toolbars.k_bottom) {
k_toolbar.k_addWidget(k_config.k_toolbars.k_bottom, 0); }
k_config.k_toolbars.k_bottom = k_toolbar;
if (k_isIPadCompatible) { k_config.k_horLayout = {
k_items: [{
k_id: 'k_iPadPane',
k_isAutoExpand: true,
k_hasMorePages: true }]
};
k_config.k_mainPaneContent.k_extWidget.addClass('splittedLayoutMainPane');
k_config.k_detailsPaneContent.k_extWidget.addClass('splittedLayoutDetailsPane');
}
else { if (k_config.k_isVertical) {
k_config.k_verLayout = k_layoutCfg;
k_mainPaneMinSize = 200;
k_detailsPaneIniSize = k_config.k_detailsPaneIniSize || 310;
k_detailsPaneMinSize = Math.min(k_detailsPaneIniSize, 250);
}
else {
k_config.k_horLayout = k_layoutCfg;
k_mainPaneMinSize = 300;
k_detailsPaneIniSize = k_config.k_detailsPaneIniSize || '50%';
k_detailsPaneMinSize = 250;
}
k_layoutCfg.k_items = [
{
k_id: 'k_mainPane',
k_isAutoExpand: true,
k_content: k_config.k_mainPaneContent,
k_minSize: k_mainPaneMinSize
},
{
k_id: 'k_detailsPane',
k_content: k_config.k_detailsPaneContent,
k_minSize: k_detailsPaneMinSize,
k_iniSize: k_detailsPaneIniSize,
k_showSplitter: true
}
];
}
kerio.waw.shared.k_widgets.K_SplittedLayout.superclass.constructor.call(this, k_id, k_config);
this.k_addReferences({
k_toolbar: k_toolbar,
_k_beforeApplyParams: k_config.k_beforeApplyParams,
_k_afterApplyParams: k_config.k_afterApplyParams,
k_detailsVisibilityProperty: k_config.k_detailsVisibilityProperty,
k_hideDetailsText: k_hideDetailsText,
k_showDetailsText: k_showDetailsText,
k_callbackDetailsVisible: k_config.k_callbackDetailsVisible,
k_isIPadCompatible: k_isIPadCompatible,
k_onBeforeDetails: k_config.k_iPad.k_onBeforeDetails || kerio.waw.shared.k_methods.k_emptyFunction,
_k_isDetailsVisible: false,
_k_mainPaneContent: k_config.k_mainPaneContent,
_k_detailsPaneContent: k_config.k_detailsPaneContent
});
if (k_isConnectionsList) {
k_toolbar.k_addReferences({
k_grid: k_connectionsGrid,
_k_gridId: k_connectionsGrid.k_id
});
}
if (k_isRefreshVisible) {
this.k_addReferences({
k_autoRefreshGui: k_autoRefreshGui
});
k_autoRefreshGui.k_addReferences({
k_layout: this,
k_ignoreOnChange: false,    k_grid: k_isConnectionsList ? k_connectionsGrid : k_config.k_mainPaneContent });
k_config.k_mainPaneContent.k_addReferences({
k_autoRefreshGui: k_autoRefreshGui
});
if (k_isConnectionsList) {
k_connectionsGrid.k_addReferences({
k_autoRefreshGui: k_autoRefreshGui
});
}
}
if (k_isIPadCompatible) { this._k_setIpadContent();
}
}; kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_SplittedLayout', kerio.lib.K_Layout, {


_k_setIpadContent: function(k_showDetails) {
this._k_isDetailsVisible = (true === k_showDetails);
this.k_extWidget.removeClass('mainPaneActive');
this.k_extWidget.removeClass('detailsPaneActive');
if (this._k_isDetailsVisible) {
this.k_setContent({
k_id: 'k_iPadPane',
k_content: this._k_detailsPaneContent
});
this.k_extWidget.addClass('detailsPaneActive');
}
else {
this.k_setContent({
k_id: 'k_iPadPane',
k_content: this._k_mainPaneContent
});
this.k_extWidget.addClass('mainPaneActive');
}
}, 
_k_isIPadDetailsAllowed: function() {
var k_allow = this.k_onBeforeDetails.call(this, true);
if ('string' === typeof k_allow) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Active Hosts', 'menuTree'),
k_msg: k_allow,
k_icon: 'warning'
});
return false;
}
return k_allow;
},

k_setDetailsVisible: function(k_alter) {
var k_show;
if (undefined === k_alter) {
if (this.k_isIPadCompatible) { k_show = false;
}
else {
k_show = kerio.waw.status.k_userSettings.k_get(this.k_detailsVisibilityProperty, true);
}
}
else {
k_show = !this.k_isDetailsVisible();
if (this.k_isIPadCompatible) { if (!this._k_isIPadDetailsAllowed()) {
return;
}
}
else {
kerio.waw.status.k_userSettings.k_set(this.k_detailsVisibilityProperty, k_show);
}
}
if (this.k_isIPadCompatible) {
this._k_setIpadContent(k_show);
}
else {
this.k_collapseRegion('k_detailsPane', !k_show);
}
this.k_toolbar.k_setItemCaption('k_btnHideDetails', (k_show) ? this.k_hideDetailsText : this.k_showDetailsText);
if (k_show && 'function' === typeof this.k_callbackDetailsVisible) {
this.k_callbackDetailsVisible();
}
}, 
k_isDetailsVisible: function() {
if (this.k_isIPadCompatible) {
return this._k_isDetailsVisible;
}
return (false === this.k_isRegionCollapsed('k_detailsPane'));
},

k_applyParams: function() {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
this.k_grid.k_forceRefresh = true;
if (this._k_beforeApplyParams) {
this._k_beforeApplyParams();
}
if (this._k_afterApplyParams) {
this._k_afterApplyParams();
}
}
});
kerio.waw.shared.k_widgets.K_ServiceGrid = function (k_id, k_config) {
var
k_shared = kerio.waw.shared,
k_methods = k_shared.k_methods,
k_isAuditor = k_methods.k_isAuditor(),
k_tr = kerio.lib.k_tr,
k_showApplyReset = false !== k_config.k_showApplyReset,
k_rendererPort,
k_rendererProtocol,
k_openServiceEditor,
k_items,
k_gridCfg;

k_openServiceEditor = function(k_toolbar, k_button) {
var
k_grid = k_toolbar.k_relatedWidget,
k_selectedRow = k_grid.k_selectionStatus.k_rows[0],
k_objectName,
k_isGroup;
switch (k_button.k_name) {
case 'k_btnAdd':
case 'k_btnAddService':
k_isGroup = false;
k_objectName = 'serviceEditorAdd';
break;
case 'k_btnAddGroup':
k_isGroup = true;
k_objectName = 'serviceGroupEditorAdd';
break;
case 'k_btnEdit':
k_isGroup = k_selectedRow.k_data.group;
k_objectName = k_isGroup ? 'serviceGroupEditorEdit' : 'serviceEditorEdit';
break;
case 'k_btnView':
k_isGroup = k_selectedRow.k_data.group;
k_objectName = k_isGroup ? 'serviceGroupEditorView' : 'serviceEditorView';
break;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: k_isGroup ? 'serviceGroupEditor' : 'serviceEditor',
k_objectName: k_objectName,
k_params: {
k_relatedWidget: k_grid,
k_data: k_selectedRow ? k_selectedRow.k_data : undefined,
k_rowIndex: k_selectedRow ? k_selectedRow.k_rowIndex : undefined
}
});
};
k_config = k_config || {};
if (k_isAuditor) {
k_items = [{
k_type: 'K_BTN_VIEW',
k_onView: k_openServiceEditor,
k_isVisibleInToolbar: true
}];
}
else {
k_items = [
{
k_id: 'k_btnAdd',
k_caption: k_tr('Add…', 'common'),
k_onClick: k_openServiceEditor,
k_isMenuButton: false, k_isVisibleInToolbar: true,
k_items: [ {
k_id: 'k_btnAddService',
k_caption: k_tr('Add Service…', 'serviceList'),
k_onClick: k_openServiceEditor
},
{
k_id: 'k_btnAddGroup',
k_caption: k_tr('Add Service Group…', 'serviceList'),
k_onClick: k_openServiceEditor
}
]
},
{
k_type: 'K_BTN_EDIT',
k_isDisabled: true,
k_isVisibleInToolbar: true,
k_onEdit: k_openServiceEditor
},
{
k_type: 'K_BTN_REMOVE',
k_isDisabled: true,
k_isVisibleInToolbar: true,
k_onRemove: function (k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget,
k_removeRequestCfg = k_grid.k_removeRequestCfg,
k_rows = k_grid.k_selectionStatus.k_rows,
k_removedItemIdList = [],
k_i, k_cnt;
for (k_i = 0, k_cnt = k_rows.length; k_i < k_cnt; k_i++) {
k_removedItemIdList.push(k_rows[k_i].k_data.id);
}
kerio.waw.shared.k_methods.k_maskMainScreen();
k_removeRequestCfg.k_jsonRpc.params.serviceIds = k_removedItemIdList;
kerio.lib.k_ajax.k_request(k_removeRequestCfg);
}
}
];
if (k_showApplyReset) {
k_items.push({
k_type: 'K_APPLY_RESET',
k_onApply: function(k_toolbar) {
k_toolbar.k_relatedWidget.k_onApplyReset(true);
return false;
},
k_onReset: function(k_toolbar) {
k_toolbar.k_relatedWidget.k_onApplyReset(false);
return false;
}
});
}
}

k_rendererPort = function(k_value, k_data) {
if (k_data.group) {
return {k_data: '' };
}
return {
k_data: kerio.waw.shared.k_methods.k_formatPort(k_value)
};
};

k_rendererProtocol = function(k_value, k_data) {
if (k_data.group) {
return {k_data: '' };
}
if (kerio.waw.shared.k_CONSTANTS.k_PROTOCOL_ID.k_OTHER === k_value) {
return {
k_data: k_data.protoNumber
};
}
return {
k_data: kerio.waw.shared.k_DEFINITIONS.k_PROTOCOLS_MAPPED[k_value].k_caption
};
};
k_gridCfg = {
k_columns: {
k_items: [
{k_columnId: 'id',          k_isDataOnly: true},
{k_columnId: 'status',      k_isDataOnly: true},
{k_columnId: 'name',        k_caption: k_tr('Name', 'common'),                     k_width: 180, k_renderer: k_methods.k_renderers.k_renderServiceName},
{k_columnId: 'protocol',    k_caption: k_tr('Protocol', 'serviceList'),            k_width:  60, k_renderer: k_rendererProtocol},
{k_columnId: 'srcPort',     k_caption: k_tr('Source Port', 'serviceList'),         k_width: 120, k_renderer: k_rendererPort},
{k_columnId: 'dstPort',     k_caption: k_tr('Destination Port', 'serviceList'),    k_width: 120, k_renderer: k_rendererPort},
{k_columnId: 'inspector',   k_caption: k_tr('Protocol Inspector', 'serviceList'),  k_width: 100},
{k_columnId: 'description', k_caption: k_tr('Description', 'common'),              k_width: 160, k_renderer: k_methods.k_renderers.k_renderServiceDescription},
{k_columnId: 'protoNumber', k_isDataOnly: true},
{k_columnId: 'icmpTypes',   k_isDataOnly: true},
{k_columnId: 'group',       k_isDataOnly: true},
{k_columnId: 'members',     k_isDataOnly: true}
]
},
k_remoteData: {
k_isAutoLoaded: false,
k_root: 'list',
k_jsonRpc: {
method: 'IpServices.get'
}
},

k_onLoad: function() {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_dialogs: ['serviceEditor', 'serviceGroupEditor']
});
},
k_toolbars: {
k_bottom: {
k_items: k_items
}
}
}; k_methods.k_mergeObjects(k_config, k_gridCfg);
kerio.waw.shared.k_widgets.K_ServiceGrid.superclass.constructor.call(this, k_id, k_gridCfg);
this.k_addReferences({
k_serviceStore: kerio.waw.shared.k_data.k_get('k_services', true),
k_showApplyReset: k_showApplyReset,
k_applyResetRequestCfg: {
k_jsonRpc: {},
k_callback: function(k_response, k_success) {
if (k_success && kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
if (this.k_showApplyReset) {
kerio.adm.k_framework.k_enableApplyReset(false);
}
if (kerio.waw.shared.k_methods.k_processUserClick()) {
this.k_reloadData();
}
kerio.waw.shared.k_methods.k_updateDataStore('k_services');
}
else {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
},
k_scope: this
},
k_removeRequestCfg: {
k_jsonRpc: {
method: 'IpServices.remove',
params: {}
},
k_callback: this.k_callbackRemoveItems,
k_scope: this
}
});
}; kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_ServiceGrid', kerio.adm.k_widgets.K_BasicList, {


k_callbackRemoveItems: function(k_response, k_success) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
if (k_success && kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
this.k_removeSelectedRows();
if (this.k_showApplyReset) {
kerio.adm.k_framework.k_enableApplyReset();
}
}
},

k_onApplyReset: function(k_isApply) {
kerio.waw.shared.k_methods.k_maskMainScreen();
this.k_applyResetRequestCfg.k_jsonRpc.method = k_isApply ? 'IpServices.apply' : 'IpServices.reset';
kerio.waw.requests.k_send(this.k_applyResetRequestCfg);
}
}); 
kerio.waw.shared.k_widgets.K_OfferGrid = function(k_id, k_config) {
var
k_onRowClickAction,
k_gridClassName,
k_bottomToolbar,
k_contextMenu,
k_contextMenuCfg,
k_toolbarClassName,
k_columns,
k_lastColumn,
k_rowRenderer,
k_buttonTextSizeChanger,
k_removeFunction,
k_toolbar,
k_i, k_cnt;
k_gridClassName = k_config.k_className;
if (!k_gridClassName) {
k_gridClassName = '';
}
k_gridClassName += ' gridWithRemoveLines';
k_config.k_className = k_gridClassName;
k_columns = k_config.k_columns.k_items;
k_lastColumn = k_columns[k_columns.length - 1];
k_rowRenderer = k_lastColumn.k_renderer;
k_lastColumn.k_renderer = function(k_value, k_rowData, k_rowIndex, k_columnIndex, k_grid) {
var k_rendered = this.k_rowRenderer(k_value, k_rowData, k_rowIndex, k_columnIndex, k_grid);
if (!k_rendered.k_data) {
k_rendered.k_data = '';
}
k_rendered.k_data = kerio.lib.k_htmlEncode(k_rendered.k_data);
k_rendered.k_data += '<div class="removeIcon">&nbsp;</div>';
k_rendered.k_isSecure = true;
if (!k_rendered.k_className) {
k_rendered.k_className = '';
}
k_rendered.k_className += ' rowWithRemoveIcon';
return k_rendered;
};
k_bottomToolbar = k_config.k_toolbars.k_bottom;
k_toolbarClassName = k_bottomToolbar.k_className;
if (!k_toolbarClassName) {
k_toolbarClassName = '';
}
k_toolbarClassName += ' offerToolbar';
k_bottomToolbar.k_className = k_toolbarClassName;
k_contextMenuCfg = kerio.lib.k_cloneObject(k_bottomToolbar);
k_toolbar = new kerio.lib.K_Toolbar(k_id + 'k_toolbar', k_bottomToolbar);
k_config.k_toolbars.k_bottom = k_toolbar;
for (k_i = 0, k_cnt = k_contextMenuCfg.k_items.length; k_i < k_cnt; k_i++) {
k_contextMenuCfg.k_items[k_i].k_caption = k_contextMenuCfg.k_items[k_i].k_caption.replace('<br />', ' / ');
}
k_contextMenuCfg.k_items = [
{
k_caption: kerio.lib.k_tr('Add', 'common'),
k_items: k_contextMenuCfg.k_items
},
{
k_isDisabled: true,
k_id: 'k_btnRemove',
k_caption: kerio.lib.k_tr('Remove', 'common'),
k_onClick: function(){
var k_grid = this.k_relatedWidget;
k_grid.k_removeLines();
}
}
];
k_contextMenu = new kerio.lib.K_Menu(k_id + 'k_menu', k_contextMenuCfg);
k_config.k_contextMenu = k_contextMenu;
k_onRowClickAction = k_config.k_onClick;

k_config.k_onClick = function(k_grid, k_rowData, k_event) {
var k_browseEvent = k_event.k_browserEvent,
k_target = k_browseEvent.target || k_browseEvent.srcElement;
if ('removeIcon' === k_target.className) {
var k_rowsIndexes;
k_rowsIndexes = k_grid.k_findRowIndexBy(k_grid.k_compareRows, k_rowData, 0, true);
k_grid.k_removeLines(k_rowsIndexes);
}
else if (k_grid.k_onRowClickAction) {
k_grid.k_onRowClickAction(k_grid, k_rowData, k_event);
}
};
k_removeFunction = k_config.k_removeFunction;
kerio.waw.shared.k_widgets.K_OfferGrid.superclass.constructor.call(this, k_id, k_config);
kerio.lib.k_registerObserver(this, k_contextMenu, [
kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED,
kerio.lib.k_constants.k_EVENT.k_TYPES.k_KEY_PRESSED
]);

k_buttonTextSizeChanger = function(k_extToolbar){
var
k_buttons = k_extToolbar.el.dom.getElementsByTagName('button'),
k_i, k_cnt,
k_button;
for (k_i = 0, k_cnt = k_buttons.length; k_i < k_cnt; k_i++) {
k_button = k_buttons[k_i];
if (k_button.scrollWidth > 75) {
k_button.className += ' wordBreaking';
}
if (k_button.clientHeight > 80) {
k_button.className += ' muchLotsText';
}
else if (k_button.clientHeight > 70) {
k_button.className += ' lotsText';
}
}
};
this.k_toolbars.k_bottom.k_extWidget.on('afterrender', k_buttonTextSizeChanger, this);
this.k_addReferences({
k_onRowClickAction: k_onRowClickAction,
k_rowRenderer: k_rowRenderer,
k_removeFunction: k_removeFunction,
k_contextMenu: k_contextMenu
});
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_OfferGrid', kerio.lib.K_Grid, {
k_compareRows: function(k_data) {
return kerio.waw.shared.k_methods.k_compare(k_data, this);
},
_k_onBeforeRowSelect: function(k_extSelectionModel, k_rowIndex, k_keepSelection) {
var k_targetElement = Ext.EventObject.target;
if (false === this._k_isSelection) {
return false;
}
if (k_targetElement && k_targetElement.className === "removeIcon") {
return false;
}
},
k_removeLines: function(k_rowsIndexes) {
if (this.k_removeFunction) {
this.k_removeFunction.call(this.k_toolbars.k_bottom, k_rowsIndexes);
}
else if(k_rowsIndexes) {
this.k_removeRowByIndex(k_rowsIndexes);
}
else {
this.k_removeSelectedRows();
}
}
});
kerio.waw.shared.k_widgets.K_TrafficSourceDestinationGrid = function(k_id, k_config){
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_gridId   = k_id + '_' + 'k_itemsGrid',
k_isSource = k_config.k_isSource,
k_gridCfg;
k_gridCfg = {
k_settingsId: 'trafficSourceDestinationEditor',
k_isStateful: false,
k_className: 'noGridHeader policyGrid',
k_emptyMsg: k_isSource ? k_tr('Any source', 'trafficSourceDestinationEditor') : k_tr('Any destination', 'trafficSourceDestinationEditor'),
k_toolbars: {
k_bottom: {
k_update: this.k_onSelect,
k_hasSharedMenu: true,
k_items: [
{
k_id: 'k_firewall',
k_caption: k_tr('Firewall', 'common'),
k_iconCls: 'agTypeFirewall',
k_onClick: this.k_addFirewall
},
{
k_id: 'k_ip',
k_caption: k_tr('Addresses', 'trafficSourceDestinationEditor'),
k_iconCls: 'gridListIcon ipGroupIcon agTypeHost',
k_onClick: this.k_addHost
},
{
k_id: 'k_ipGroup',
k_caption: k_tr('IP Address Groups', 'trafficSourceDestinationEditor'),
k_iconCls: 'groupIcon grpHeader ipGroupIcon',
k_onClick: this.k_addIpGroups
},
{
k_id: 'k_interface',
k_caption: k_tr('Interfaces', 'trafficSourceDestinationEditor'),
k_iconCls: 'interfaceIcon interfaceEthernet',
k_onClick: this.k_addInterfaces
},
{
k_id: 'k_vpn',
k_caption: k_tr('VPN', 'trafficSourceDestinationEditor'),
k_iconCls: 'gridListIcon interfaceIcon interfaceVpnServer',
k_onClick: this.k_addVpns
},
{
k_id: 'k_loggedUsers',
k_caption: k_tr('Any Authenticated User', 'trafficSourceDestinationEditor'),
k_iconCls: 'nodeIcon treeIconDomains',
k_onClick: this.k_addAuthenticatedUsers
},
{
k_id: 'k_selectedUsers',
k_caption: k_tr('Users and Groups', 'trafficSourceDestinationEditor'),
k_isSecure: true,
k_iconCls: 'gridListIcon userIcon',
k_onClick: this.k_addUsers
}
]
}
},
k_sorting: {
k_columnId: 'item'
},
k_columns: {
k_grouping: {
k_columnId: 'typeNumber',
k_isMemberIndented: true,
k_isRemoteGroup: false
},
k_items: [
{
k_columnId: 'typeNumber',
k_isKeptHidden: true, k_groupRenderer: this.k_groupingRenderer
},
{
k_columnId: 'k_type',
k_isDataOnly: true
},
{
k_caption: k_tr('Item', 'common'),
k_columnId: 'item',
k_isSortable: false,
k_renderer: this.k_itemRenderer
}
]
},
k_onDblClick: this.k_openRowEditor
};
kerio.waw.shared.k_widgets.K_TrafficSourceDestinationGrid.superclass.constructor.call(this, k_gridId, k_gridCfg);
this.k_addReferences({
k_toolbar: this.k_toolbars.k_bottom,
k_translations: {
k_firewall: k_tr('Firewall', 'common'),
k_interfaces: k_tr('Interfaces', 'trafficSourceDestinationEditor'),
k_hosts: k_tr('Hosts, Networks, Address Ranges', 'trafficSourceDestinationEditor'),
k_vpns: k_tr('VPN server', 'trafficSourceDestinationEditor'),
k_addressGroups: k_tr('IP Address Groups', 'trafficSourceDestinationEditor'),
k_users: k_tr('Users and Groups', 'trafficSourceDestinationEditor'),
k_internet: k_tr('Internet Interfaces', 'trafficSourceDestinationEditor'),
k_trusted: k_tr('Trusted/Local Interfaces', 'trafficSourceDestinationEditor'),
k_vpnClients: k_tr('Any connected VPN Client', 'trafficSourceDestinationEditor'),
k_vpnTunnels: k_tr('All VPN Tunnels', 'trafficSourceDestinationEditor'),
k_nothing: k_tr('Nothing', 'common'),
k_invalidGroup: k_tr('Other', 'bandwidthManagementTrafficEditor'),
k_authenticatedUsers: k_tr('Authenticated users', 'trafficRuleList'),
k_invalidItem: k_tr('The item no longer exists', 'contentFilter'),
k_allTunnels: k_tr('All VPN tunnels', 'trafficRuleList'),
k_allClients: k_tr('VPN clients', 'trafficRuleList')
}
});
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_TrafficSourceDestinationGrid', kerio.waw.shared.k_widgets.K_OfferGrid, {

k_onSelect: function(k_sender, k_event) {
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
k_sender.k_removeSelected(k_sender.k_toolbars.k_bottom); }
break;
}
}
}, 
k_addItem: function(k_itemData, k_nextType) {
var
k_data,
k_gridData,
k_i, k_cnt,
k_itemProperties,
k_dataType = 'unknown',
k_itemType = k_itemData.k_type,
k_compareEntityItems = this.k_getTopLevelParent().k_parentGrid.k_compareEntityItems,
k_KEEP_ORDER = -1;
this.k_removeNothing();
k_gridData = this.k_getData();
for (k_i = 0, k_cnt = k_gridData.length; k_i < k_cnt; k_i++) {
k_dataType = k_gridData[k_i].k_type;
if ((k_itemType === k_dataType) || (k_nextType === k_dataType)) {
break;
}
}
if ((k_i < k_cnt) && (k_itemType === k_dataType)) {
k_itemProperties = k_itemData.item;
for (k_i = k_i, k_cnt = k_gridData.length; k_i < k_cnt; k_i++) {
k_data = k_gridData[k_i];
if ((k_KEEP_ORDER === k_compareEntityItems(k_itemProperties, k_data.item)) || (k_itemType !== k_data.k_type)) {
break;
}
}
}
if (k_i === k_cnt) {
this.k_setData([ k_itemData ], true );
}
else {
this.k_addRow(k_itemData, k_i);
}
},

k_groupingRenderer: function(k_value) {
var
k_types = kerio.waw.shared.k_CONSTANTS.k_TRAFFIC_ENTITY_TYPES_NUMBER,
k_translations = this.k_translations,
k_caption = '',
k_icon;
switch(k_value) {
case k_types.k_FIREWALL:
case k_types.k_HOST:
case k_types.k_PREFIX:
case k_types.k_NETWORK:
case k_types.k_RANGE:
k_caption = k_translations.k_hosts;
k_icon = 'ipGroupIcon agTypeHost';
break;
case k_types.k_ADDRESS_GROUP:
k_caption = k_translations.k_addressGroups;
k_icon = 'grpHeader ipGroupIcon';
break;
case k_types.k_INTERFACE:
k_caption = k_translations.k_interfaces;
k_icon = 'interfaceIcon interfaceEthernet';
break;
case k_types.k_VPN:
k_caption = k_translations.k_vpns;
k_icon = 'interfaceIcon interfaceVpnServer';
break;
case k_types.k_USERS:
k_caption = k_translations.k_users;
k_icon = 'userGroupIcon';
break;
case k_types.k_INVALID:
k_caption = k_translations.k_invalidGroup;
break;
default:
k_caption = k_value;
break;
}
return {
k_data: k_caption,
k_iconCls: k_icon
};
}, 
k_itemRenderer: function(k_value) {
if (k_value.k_isEmpty) {
return {
k_data: kerio.lib.k_tr('This group is empty', 'common'),
k_className: 'emptyGroup'
};
}
return this.k_getTopLevelParent().k_parentGrid.k_renderTrafficEntityItem(k_value, this);
},

k_addFirewall: function(k_toolbar) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_types = k_CONSTANTS.TrafficEntityType,
k_typesNumber = k_CONSTANTS.k_TRAFFIC_ENTITY_TYPES_NUMBER,
k_grid = k_toolbar.k_relatedWidget,
k_firewall = kerio.waw.shared.k_DEFINITIONS.k_get('k_trafficEntityFirewall'),
k_foundRowIndices;
k_foundRowIndices = k_grid.k_findRowIndexBy(k_grid.k_searchDuplicate, k_firewall);
if (null !== k_foundRowIndices) {
k_grid.k_selectRows(k_foundRowIndices[0]);
return;
}
k_grid.k_removeNothing();
k_grid.k_addRow(
{
k_type: k_types.TrafficEntityHost,
typeNumber: k_typesNumber.TrafficEntityHost,
item: k_firewall
},
0
);
},

k_addAuthenticatedUsers: function(k_toolbar) {
var
k_shared = kerio.waw.shared,
k_grid = k_toolbar.k_relatedWidget,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_foundRowIndices,
k_title;
k_foundRowIndices = k_grid.k_findRowIndexBy(k_grid.k_searchDuplicate, k_shared.k_DEFINITIONS.k_get('k_trafficEntityAuthUsers'));
if (null !== k_foundRowIndices) {
k_grid.k_selectRows(k_foundRowIndices[0]);
return;
}
if (!k_grid.k_findRowIndexBy(k_grid.k_searchEntityType, { k_type: k_shared.k_CONSTANTS.TrafficEntityType.TrafficEntityUsers })) {
k_grid.k_addAuthenticatedUsersCallback();
return;
}
k_title = k_grid.k_isSource ? k_tr('Traffic Rule - Source', 'trafficSourceDestinationEditor') : k_tr('Traffic Rule - Destination', 'trafficSourceDestinationEditor');
k_lib.k_confirm({
k_title: k_title,
k_msg: [
'<b>',
k_tr('All selected users will be removed from the list.', 'trafficSourceDestinationEditor'),
'</b><br><br>',
k_tr('Do you want to continue?', 'common')
].join(''),
k_callback: k_grid.k_addAuthenticatedUsersCallback,
k_scope: k_grid
});
},

k_removeAllUsers: function(k_type) {
var
k_types = kerio.waw.shared.k_CONSTANTS.TrafficEntityType,
k_data = this.k_getData(),
k_i,
k_item;
for (k_i = k_data.length - 1; k_i >= 0; k_i--) {
k_item = k_data[k_i].item;
if (k_types.TrafficEntityUsers === k_item.type) {
if (undefined === k_type || k_item.userType === k_type) {
this.k_removeRowByIndex(k_i);
}
}
else {
return; }
}
},

k_addAuthenticatedUsersCallback: function(k_answer) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_types = k_CONSTANTS.TrafficEntityType,
k_typesNumber = k_CONSTANTS.k_TRAFFIC_ENTITY_TYPES_NUMBER;
if ('no' === k_answer) {
return; }
this.k_removeNothing();
this.k_removeAllUsers();
this.k_addRow({
k_type: k_types.TrafficEntityUsers,
typeNumber: k_typesNumber.TrafficEntityUsers,
item: kerio.waw.shared.k_DEFINITIONS.k_get('k_trafficEntityAuthUsers')
});
},

k_addUsers: function(k_toolbar) {
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
},

k_addUsersCallback: function(k_selectedUsers, k_userData, k_domain, k_selectedData) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_userType = k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityUsers,
k_userCond = k_WAW_CONSTANTS.UserConditionType,
k_foundRowIndices,
k_user,
k_i;
this.k_removeAllUsers(k_userCond.AuthenticatedUsers);
k_selectedData = k_selectedData || [];
for (k_i = k_selectedData.length - 1; 0 <= k_i; k_i--) {
k_user = k_selectedData[k_i];
k_user = kerio.waw.shared.k_DEFINITIONS.k_get('k_trafficEntity', {
type: k_userType,
userType: k_userCond.SelectedUsers,
user: {
id: k_user.id,
name: k_user.name,
isGroup: k_user.k_isGroup,
domainName: k_domain
}
});
k_foundRowIndices = this.k_findRowIndexBy(this.k_searchDuplicate, k_user);
if (null === k_foundRowIndices) {
this.k_addItem({ k_type: k_userType, typeNumber: k_WAW_CONSTANTS.k_TRAFFIC_ENTITY_TYPES_NUMBER.k_USERS, item: k_user }, 'thisIsLast');
}
}
if (k_foundRowIndices) {
this.k_selectRows(k_foundRowIndices[0]);
}
},

k_removeSelected: function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget;
k_grid.k_removeSelectedRows();
},

k_addIpGroups: function(k_toolbar) {
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
},

k_addIpGroupsCallback: function(k_selected, k_allData, k_domain, k_selectedData) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_groupType = k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityAddressGroup,
k_interfaceType = k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityInterface,
k_group,
k_foundRowIndices,
k_i;
k_selectedData = k_selectedData || [];
for (k_i = k_selectedData.length - 1; 0 <= k_i; k_i--) {
k_group = k_selectedData[k_i];
k_group = kerio.waw.shared.k_DEFINITIONS.k_get('k_trafficEntity', {
type: k_groupType,
addressGroup: {
id: k_group.id,
name: k_group.name
}
});
k_foundRowIndices = this.k_findRowIndexBy(this.k_searchDuplicate, k_group);
if (null === k_foundRowIndices) {
this.k_addItem({ k_type: k_groupType, typeNumber: k_WAW_CONSTANTS.k_TRAFFIC_ENTITY_TYPES_NUMBER.k_ADDRESS_GROUP, item: k_group }, k_interfaceType);
}
}
if (k_foundRowIndices) {
this.k_selectRows(k_foundRowIndices[0]);
}
},

k_addInterfaces: function(k_toolbar) {
var k_grid = k_toolbar.k_relatedWidget;
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'selectItems',
k_objectName: 'k_selectInterfaceEntity',
k_params: {
k_parentGrid: k_grid,
k_callback: k_grid.k_addInterfacesCallback,
k_autoAdd: false,
k_fixItems: [
{
type: 'k_internetInterfaceEntity',
status: 0,
id: 'k_internetInterfaceEntity',
name: kerio.lib.k_tr('Internet Interfaces', 'trafficRuleList'),
enabled: true
},
{
type: 'k_trustedInterfaceEntity',
status: 0,
id: 'k_trustedInterfaceEntity',
name: kerio.lib.k_tr('Trusted/Local Interfaces', 'trafficRuleList'),
enabled: true
},
{
type: 'k_guestInterfaceEntity',
status: 0,
id: 'k_guestInterfaceEntity',
name: kerio.lib.k_tr('Guest Interfaces', 'trafficRuleList'),
enabled: true
}
]
}
});
},

k_addInterfacesCallback: function(k_selected, k_allData, k_domain, k_selectedData) {
var
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_interfaceType = k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityInterface,
k_interfaceTypes = k_WAW_CONSTANTS.InterfaceConditionType,
k_vpnType = k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityVpn,
k_interface,
k_foundRowIndices,
k_i;
k_selectedData = k_selectedData || [];
for (k_i = k_selectedData.length - 1; 0 <= k_i; k_i--) {
k_interface = k_selectedData[k_i];
if ('k_internetInterfaceEntity' === k_selected[k_i]) {
k_interface = k_WAW_DEFINITIONS.k_get('k_trafficEntity', {
type: k_interfaceType,
interfaceCondition: {
type: k_interfaceTypes.InterfaceInternet
}
});
}
else if ('k_trustedInterfaceEntity' === k_selected[k_i]) {
k_interface = k_WAW_DEFINITIONS.k_get('k_trafficEntity', {
type: k_interfaceType,
interfaceCondition: {
type: k_interfaceTypes.InterfaceTrusted
}
});
}
else if ('k_guestInterfaceEntity' === k_selected[k_i]) {
k_interface = k_WAW_DEFINITIONS.k_get('k_trafficEntity', {
type: k_interfaceType,
interfaceCondition: {
type: k_interfaceTypes.InterfaceGuest
}
});
}
else {
k_interface = k_WAW_DEFINITIONS.k_get('k_trafficEntity', {
type: k_interfaceType,
interfaceCondition: {
type: k_interfaceTypes.InterfaceSelected,
interfaceType: k_interface.type,
enabled: k_interface.enabled,
flags: k_interface.flags,
selectedInterface: {
id: k_interface.id,
name: k_interface.name
}
}
});
}
k_foundRowIndices = this.k_findRowIndexBy(this.k_searchDuplicate, k_interface);
if (null === k_foundRowIndices) {
this.k_addItem({ k_type: k_interfaceType, typeNumber: k_WAW_CONSTANTS.k_TRAFFIC_ENTITY_TYPES_NUMBER.k_INTERFACE, item: k_interface }, k_vpnType);
}
}
if (k_foundRowIndices) {
this.k_selectRows(k_foundRowIndices[0]);
return;
}
},

k_addVpns: function(k_toolbar) {
var k_grid = k_toolbar.k_relatedWidget;
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'selectItems',
k_objectName: 'k_selectVpnEntity',
k_params: {
k_parentGrid: k_grid,
k_callback: k_grid.k_addVpnsCallback,
k_autoAdd: false,
k_fixItems: [
{
type: 'k_vpnServerInterfaceEntity',
status: 0,
id: 'k_vpnServerInterfaceEntity',
name: kerio.lib.k_tr('VPN clients', 'trafficRuleList'),
enabled: true
},
{
type: 'k_vpnTunnelsInterfaceEntity',
status: 0,
id: 'k_vpnTunnelsInterfaceEntity',
name: kerio.lib.k_tr('All VPN tunnels', 'trafficRuleList'),
enabled: true
}
]
}
});
},

k_addVpnsCallback: function(k_selected, k_allData, k_domain, k_selectedData) {
var
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_vpnType = k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityVpn,
k_vpnTypes = k_WAW_CONSTANTS.VpnConditionType,
k_userType = k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityUsers,
k_allTunnels = false,
k_selectedTunnel = this.k_findRowBy(this.k_searchEntityType, {
k_type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityVpn,
k_typeNumber: k_WAW_CONSTANTS.k_TRAFFIC_ENTITY_TYPES_NUMBER.k_VPN,
k_vpnType: k_WAW_CONSTANTS.VpnConditionType.SelectedTunnel
}),
k_foundRowIndices,
k_vpn,
k_i;
k_selectedData = k_selectedData || [];
for (k_i = k_selectedData.length - 1; 0 <= k_i; k_i--) {
k_vpn = k_selectedData[k_i];
if ('k_vpnServerInterfaceEntity' === k_selected[k_i]) {
k_vpn = k_WAW_DEFINITIONS.k_get('k_trafficEntity', {
type: k_vpnType,
vpnCondition: {
type: k_vpnTypes.IncomingClient
}
});
}
else if ('k_vpnTunnelsInterfaceEntity' === k_selected[k_i]) {
k_allTunnels = true;
continue; }
else {
k_selectedTunnel = true;
k_vpn = k_WAW_DEFINITIONS.k_get('k_trafficEntity', {
type: k_vpnType,
vpnCondition: {
type: k_vpnTypes.SelectedTunnel,
enabled: k_vpn.enabled,
tunnel: {
id: k_vpn.id,
name: k_vpn.name
}
}
});
}
k_foundRowIndices = this.k_findRowIndexBy(this.k_searchDuplicate, k_vpn);
if (null === k_foundRowIndices) {
this.k_addItem({ k_type: k_vpnType, typeNumber: k_WAW_CONSTANTS.k_TRAFFIC_ENTITY_TYPES_NUMBER.k_VPN, item: k_vpn }, k_userType);
}
}
if (k_foundRowIndices) {
this.k_selectRows(k_foundRowIndices[0]);
return;
}

if (k_allTunnels) {
if (k_selectedTunnel) {
this.k_addAllVpnTunnels({ k_parentWidget: this }); }
else {
this.k_addAllVpnTunnelsCallback();
}
}
else if (k_selectedTunnel) {
this.k_removeVpnTunnels(k_vpnTypes.AllTunnels);
}
}, 
k_addAllVpnTunnels: function(k_toolbar) {
var
k_grid = k_toolbar.k_parentWidget,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_tunnels = k_grid.k_findRowBy(k_grid.k_searchEntityType, {
k_type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityVpn,
k_typeNumber: k_WAW_CONSTANTS.k_TRAFFIC_ENTITY_TYPES_NUMBER.k_VPN,
k_vpnType: k_WAW_CONSTANTS.VpnConditionType.SelectedTunnel
}),
k_all = k_grid.k_findRowBy(k_grid.k_searchDuplicate, kerio.waw.shared.k_DEFINITIONS.k_get('k_trafficEntityAllVpnTunnels')),
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_title;
if (k_all) {

this.k_removeVpnTunnels(k_WAW_CONSTANTS.VpnConditionType.SelectedTunnel);
return; }
if (!k_tunnels) { k_grid.k_addAllVpnTunnelsCallback();
return;
}
k_title = k_grid.k_isSource ? k_tr('Traffic Rule - Source', 'trafficSourceDestinationEditor') : k_tr('Traffic Rule - Destination', 'trafficSourceDestinationEditor');
k_lib.k_confirm({
k_title: k_title,
k_msg: [
k_tr('Do you want to add All VPN tunnels?', 'trafficSourceDestinationEditor'),
'<br><br><b>',
k_tr('All selected VPN tunnels will be removed from the list.', 'trafficSourceDestinationEditor'),
'</b>'
].join(''),
k_callback: k_grid.k_addAllVpnTunnelsCallback,
k_scope: k_grid
});
},

k_removeVpnTunnels: function(k_type) {
var
k_types = kerio.waw.shared.k_CONSTANTS.TrafficEntityType,
k_data = this.k_getData(),
k_i;
for (k_i = k_data.length - 1; k_i >= 0; k_i--) {
if (k_types.TrafficEntityVpn === k_data[k_i].item.type) {
if (undefined === k_type || k_data[k_i].item.vpnCondition.type === k_type) {
this.k_removeRowByIndex(k_i);
}
}
}
},

k_addAllVpnTunnelsCallback: function(k_answer) {
var
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_types = k_WAW_CONSTANTS.TrafficEntityType;
if ('no' === k_answer) {
return; }
this.k_removeVpnTunnels(k_WAW_CONSTANTS.VpnConditionType.SelectedTunnel);
this.k_removeVpnTunnels(k_WAW_CONSTANTS.VpnConditionType.AllTunnels);
this.k_addItem({ k_type: k_types.TrafficEntityVpn, typeNumber: k_WAW_CONSTANTS.k_TRAFFIC_ENTITY_TYPES_NUMBER.k_VPN, item: k_shared.k_DEFINITIONS.k_get('k_trafficEntityAllVpnTunnels') }, k_types.TrafficEntityUsers);
},

k_addHost: function(k_toolbar) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'trafficHostEditor',
k_objectName: 'trafficHostAdd',
k_params: {
k_parentGrid: k_toolbar.k_relatedWidget
}
});
},

k_openRowEditor: function(k_grid, k_rowData) {
var k_types = kerio.waw.shared.k_CONSTANTS.TrafficEntityType;
switch (k_rowData.item.type) {
case k_types.TrafficEntityHost:
case k_types.TrafficEntityPrefix:
case k_types.TrafficEntityNetwork:
case k_types.TrafficEntityRange:
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'trafficHostEditor',
k_objectName: 'trafficHostEdit',
k_params: {
k_parentGrid: k_grid,
k_data: k_rowData
}
});
}
},

k_searchEntityType: function(k_data) {
if (this.k_vpnType) {
return (k_data.k_type === this.k_type && !k_data.item.k_isEmpty && k_data.item.vpnCondition.type === this.k_vpnType);
}
return (k_data.k_type === this.k_type) && !k_data.item.k_isEmpty;
},

k_searchDuplicate: function(k_data) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_types = k_WAW_CONSTANTS.TrafficEntityType,
k_consts, k_tmpData, k_tmpThis; k_data = k_data.item;
if (k_data.type !== this.type) {
return false; }
switch (this.type) {
case k_types.k_FIREWALL:
return true; case k_types.TrafficEntityHost:
return (k_data.host === this.host);
case k_types.TrafficEntityPrefix:
return (k_data.host === this.host);
case k_types.TrafficEntityRange:  case k_types.TrafficEntityNetwork:
return (k_data.addr1 === this.addr1 && k_data.addr2 === this.addr2);
case k_types.TrafficEntityAddressGroup:
return (k_data.addressGroup && this.addressGroup && k_data.addressGroup.id === this.addressGroup.id);
case k_types.TrafficEntityInterface:
k_consts = k_WAW_CONSTANTS.InterfaceConditionType;
k_tmpData = k_data.interfaceCondition || {};
k_tmpThis = this.interfaceCondition || {};
if (k_consts.InterfaceSelected === k_tmpThis.type) {
return (k_tmpData.type === k_tmpThis.type && k_tmpData.selectedInterface.id === k_tmpThis.selectedInterface.id);
}
else {
return (k_tmpData.type === k_tmpThis.type);
}
break; case k_types.TrafficEntityVpn:
k_consts = k_WAW_CONSTANTS.VpnConditionType;
k_tmpData = k_data.vpnCondition || {};
k_tmpThis = this.vpnCondition || {};
if (k_consts.SelectedTunnel === k_tmpThis.type) {
return (k_tmpData.type === k_tmpThis.type && k_tmpData.tunnel.id === k_tmpThis.tunnel.id);
}
else {
return (k_tmpData.type === k_tmpThis.type);
}
break; case k_types.TrafficEntityUsers:
k_consts = k_WAW_CONSTANTS.UserConditionType;
k_tmpData = k_data.user || {};
k_tmpThis = this.user || {};
if (k_consts.SelectedUsers === this.userType) {
return (k_data.userType === this.userType && k_tmpData.id === k_tmpThis.id);
}
else {
return (k_data.userType === this.userType);
}
break; default:
return false; }
}, 
k_removeNothing: function() {
var
k_data = this.k_getData(),
k_isNothingItem = 1 === k_data.length && k_data[0].item.k_isNothing;
if (k_isNothingItem) {
this.k_removeRowByIndex(0);
}
},

k_getDataForSaving: function() {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
RuleConditionType = k_CONSTANTS.RuleConditionType,
k_data = kerio.lib.K_Grid.prototype.k_getData.call(this),
k_cnt, k_i,
k_entity,
k_condition;
k_cnt = k_data.length;
k_condition = {
type: RuleConditionType.RuleAny,
firewall: false,
entities: []
};
for (k_i = 0; k_i < k_cnt; k_i++) {
k_entity = k_data[k_i].item;
if (k_CONSTANTS.TrafficEntityType.k_FIREWALL === k_entity.type) {
k_condition.firewall = true;
}
else if (!k_entity.k_isEmpty) {
k_condition.entities.push(k_entity);
}
}
k_cnt = k_condition.entities.length;
if (0 < k_cnt || (0 === k_cnt && k_condition.firewall)) {
k_condition.type = RuleConditionType.RuleSelectedEntities;
}
return k_condition;
}
});
kerio.waw.shared.k_widgets.K_TrafficServiceGrid = function(k_id, k_config){
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_toolbar, k_toolbarCfg,
k_removeSelected,
k_gridCfg;

k_removeSelected = function(k_toolbar) {
var
k_isRowsIndexes = undefined !== k_toolbar && 'K_Toolbar' !== k_toolbar._k_constructorName,
k_grid = k_isRowsIndexes || undefined === k_toolbar ? this.k_relatedWidget : k_toolbar.k_relatedWidget,
k_dialog = k_grid.k_dialog,
k_rowsIndexes;
if (k_isRowsIndexes) {
k_rowsIndexes = k_toolbar; k_grid.k_removeRowByIndex(k_rowsIndexes);
}
else {
k_grid.k_removeSelectedRows();
}
if (k_dialog.k_isNothing && 0 === k_grid.k_getRowsCount()) { k_dialog.k_isNothing = false; }
};
k_toolbarCfg = {
k_type: 'k_userDefined',
k_hasSharedMenu: true,
k_items: [
{
k_id: 'k_btnAddService',
k_caption: k_tr('Service', 'trafficRuleEditor'),
k_iconCls: 'bandwidthManagement ipServiceGroupIcon',

k_onClick: function(k_toolbar) {
var
k_params,
k_grid = k_toolbar.k_relatedWidget;
k_params = {
k_onlyNew: true, k_parentGrid: k_grid,
k_autoAdd: false, k_callback: k_grid.k_createServiceObjects
};
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'selectItems',
k_objectName: 'selectServices',
k_params: k_params
});
}
},
{
k_id: 'k_btnAddPort',
k_caption: k_tr('Port', 'trafficRuleEditor'),
k_iconCls: 'portIcon',

k_onClick: function(k_toolbar) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'trafficPortEditor',
k_objectName: 'portAdd',
k_params: {
k_relatedGrid: k_toolbar.k_relatedWidget
}
});
}
}
],

k_update: function(k_sender, k_event) {
var
k_events = kerio.lib.k_constants.k_EVENT,
k_constEventTypes = k_events.k_TYPES,
k_constKeyCodes = k_events.k_KEY_CODES,
k_allowRemove,
k_currentKeyCode;
if (k_sender instanceof kerio.lib.K_Grid) {
k_allowRemove = (0 !== k_sender.k_selectionStatus.k_selectedRowsCount);

switch (k_event.k_type) {
case k_constEventTypes.k_SELECTION_CHANGED:
this.k_enableItem('k_btnRemove', k_allowRemove);
break;
case k_constEventTypes.k_KEY_PRESSED:
k_currentKeyCode = k_event.k_browserEvent.keyCode;
if (k_allowRemove && ((k_constKeyCodes.k_BACKSPACE === k_currentKeyCode) || (k_constKeyCodes.k_DELETE === k_currentKeyCode))) {
k_sender.k_removeSelected(k_sender.k_toolbars.k_bottom); }
break;
}
}
}
};
k_gridCfg = {
k_emptyMsg: k_tr('Any service', 'trafficRuleEditor'),
k_isStateful: false,
k_className: 'policyGrid noGridHeader',
k_toolbars: {
k_bottom: k_toolbarCfg
},
k_removeFunction: k_removeSelected,
k_columns: {
k_sorting: {
k_columnId: 'sortBy'
},
k_items: [
{	k_columnId: 'sortHash',
k_isHidden: true,
k_isKeptHidden: true,

k_renderer: function(k_value, k_data) {
var
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_hash = [],
k_ports;
if ('k_nobody' !== k_value) {
if (k_data.definedService) {
k_hash = ['0', '-', k_data.service.name.toLowerCase()];
}
else {
k_ports = k_data.port.ports;
k_hash = ['1', '-',
k_WAW_DEFINITIONS.k_PROTOCOLS_MAPPED[k_data.protocol].k_caption,
'-', this.k_fillZeroes(k_ports[0]),
(k_ports[0] ? this.k_fillZeroes(k_ports[0]) : '')];
}
k_data.sortBy = k_hash.join('');
}
return {
k_data: ''
};
}
},
{	k_columnId: 'sortBy',
k_isDataOnly: true},
{	k_columnId: 'definedService',
k_isDataOnly: true},
{	k_columnId: 'service',
k_isDataOnly: true},
{	k_columnId: 'protocol',
k_isDataOnly: true},
{	k_columnId: 'port',
k_isDataOnly: true},
{	k_columnId: 'item',
k_isSortable: false,
k_caption: k_tr('Item', 'common'),

k_renderer: function(k_value, k_data) {
if (this.k_dialog && this.k_dialog.k_isNothing) {
return {
k_data: this.k_parentWidget.k_relatedGrid.k_translations.k_nothing,
k_iconCls: 'serviceIcon objectNothing'
};
}
var
k_topParent = this.k_getTopLevelParent(),
k_grid = k_topParent.k_parentGrid ? k_topParent.k_parentGrid : k_topParent.k_relatedGrid,
k_renderServiceItem = k_grid.k_renderServiceItem;
return k_renderServiceItem(k_data, k_grid);
}
}
]
},

k_onCellDblClick: function(k_grid, k_rowData) {
if (k_rowData.definedService || k_grid.k_dialog.k_isNothing) {
return;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'trafficPortEditor',
k_objectName: 'portEdit',
k_params: {
k_data: k_rowData,
k_relatedGrid: k_grid
}
});
}
};
kerio.waw.shared.k_widgets.K_TrafficServiceGrid.superclass.constructor.call(this, k_id, k_gridCfg);
k_toolbar = this.k_toolbars.k_bottom;
this.k_addReferences({
k_serviceIdReference: kerio.waw.shared.k_DEFINITIONS.k_get('k_trafficService'),
k_removeSelected: k_removeSelected
});
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_TrafficServiceGrid', kerio.waw.shared.k_widgets.K_OfferGrid, {

k_createServiceObjects: function(k_ids, k_allServices, k_domain, k_services) {
var
k_definedService = true,
k_gridData = [],
k_itemData,
k_service,
k_i, k_cnt;
k_services = k_services || [];
for (k_i = 0, k_cnt = k_services.length; k_i < k_cnt; k_i++) {
k_service = k_services[k_i];
k_itemData = kerio.lib.k_cloneObject(this.k_serviceIdReference);
k_itemData.definedService = k_definedService;
k_itemData.service.id = k_service.id;
k_itemData.service.name = k_service.name;
k_itemData.service.isGroup = k_service.group;
k_gridData.push(k_itemData);
}
this.k_addItems(k_gridData, k_definedService);
},

k_fillZeroes: function(k_number) {
var
k_i, k_cnt,
k_length,
k_tmp;
k_number = (k_number || 0) + '';
k_length = k_number.length;
k_tmp = k_number;
for (k_i = 0, k_cnt = 5 - k_number.length; k_i < k_cnt; k_i++) {
k_tmp = '0' + k_tmp;
}
return k_tmp;
},

k_getDataForSaving: function() {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
RuleConditionType = k_CONSTANTS.RuleConditionType,
k_data = kerio.lib.K_Grid.prototype.k_getData.call(this),
k_cnt, k_i,
k_serviceCondition;
k_serviceCondition = {
type: RuleConditionType.RuleAny,
entries: []
};
k_cnt = k_data.length;
if (0 < k_cnt) {
for (k_i = 0; k_i < k_cnt; k_i++) {
delete k_data[k_i].sortBy;
delete k_data[k_i].sortHash;
}
k_serviceCondition.type = RuleConditionType.RuleSelectedEntities;
k_serviceCondition.entries = k_data;
}
return k_serviceCondition;
},
k_addItems: function(k_newData, k_definedService) {
var
k_serviceData = [],
k_serviceIndices = [],
k_gridData = [],
k_findDuplicateMethod,
k_foundItemIndex,
k_index,
k_i, k_cnt,
k_entry;
k_definedService = k_definedService ? true : false;
k_newData = k_newData || [];
if (!this.k_isNothing) {
k_gridData = kerio.lib.K_Grid.prototype.k_getData.call(this);
}
if (k_definedService) {
k_findDuplicateMethod = this.k_findDuplicateService;
} else {
k_findDuplicateMethod = this.k_findDuplicatePort;
}
k_index = 0;
for (k_i = 0, k_cnt = k_gridData.length; k_i < k_cnt; k_i++) {
k_entry = k_gridData[k_i];
if (k_entry.definedService === k_definedService) {
k_serviceData.push(k_entry);
k_serviceIndices[k_index] = k_i;
k_index++;
}
}
for (k_i = k_newData.length - 1; 0 <= k_i; k_i--) {
k_entry = k_newData[k_i];
k_foundItemIndex = k_findDuplicateMethod(k_entry, k_serviceData);
if (-1 === k_foundItemIndex) {
this.k_addRow(k_entry);
}
}
if (-1 !== k_foundItemIndex) {
this.k_selectRows(k_serviceIndices[k_foundItemIndex]);
}
if (0 !== k_gridData.length && this.k_dialog) {
this.k_dialog.k_isNothing = false;
}
this.k_resortRows();
this.k_removeNothing();
},

k_findDuplicateService: function(k_serviceReference, k_data) {
var
k_id,
k_i, k_cnt;
k_id = k_serviceReference.service.id;
k_data = k_data || [];
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_id === k_data[k_i].service.id) {
return k_i;
}
}
return -1;
},

k_findDuplicatePort: function(k_portReference, k_data) {
var
k_port,
k_entry,
k_entryProtocol,
k_protocol,
k_i, k_cnt;
k_protocol = k_portReference.protocol;
k_port = k_portReference.port;
k_data = k_data || [];
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_entryProtocol = k_data[k_i].protocol;
k_entry = k_data[k_i].port;
if (k_protocol === k_entryProtocol
&& k_port.comparator === k_entry.comparator
&& k_port.ports[0] === k_entry.ports[0] && k_port.ports[1] === k_entry.ports[1]) {
return k_i;
}
}
return -1;
},

k_removeNothing: function() {
var
k_data = this.k_getData(),
k_row;
k_row = k_data[0];
if ('' === k_row.definedService && '' === k_row.port && '' === k_row.service && '' === k_row.item) {
this.k_removeRowByIndex(0);
}
}
});
