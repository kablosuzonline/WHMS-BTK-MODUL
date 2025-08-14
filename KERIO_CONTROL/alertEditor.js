
kerio.waw.ui.alertEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_isEditMode = 'alertEditorEdit' === k_objectName,
k_RADIO_TYPE_USER = 0,
k_RADIO_TYPE_EMAIL = 1,
AlertEventRuleType = k_CONSTANTS.AlertEventRuleType,
k_ALERT_GROUP = k_CONSTANTS.k_ALERT_GROUP,
k_dataGrid, k_dataGridCfg,
k_formCfg, k_form,
k_dialogCfg, k_dialog,
k_selectUserCallback,
k_selectItemsCallback,
k_openSelectItemsDialog,
k_updateAlertLists,
k_openRowEditor,
k_findNewItem;

k_selectUserCallback = function (k_selectedItems, k_allData, k_currentDomain, k_selectedData) {
var
k_userName,
k_selectedUserData,
k_user;
if (1 === k_selectedData.length) {
k_selectedUserData = k_selectedData[0];
k_user = {
type: 'AddresseeUser',
email: k_selectedUserData.email,
user: {
id: k_selectedUserData.k_id,
name: k_selectedUserData.name,
isGroup: k_selectedUserData.isGroup,
domainName: k_selectedUserData.domainName
}
};
k_userName = kerio.waw.shared.k_methods.k_renderers.k_userOrEmailRenderer(k_user);
this.k_parentWidget.k_data.addressee = k_user;
this.k_userInput.k_setValue(k_userName.k_data);
}
};

k_selectItemsCallback = function (k_selectedItems, k_allData, k_currentDomain, k_selectedData) {
var
AlertEventRuleType = this.AlertEventRuleType,
k_dialog = this.k_dialog,
k_data = this.k_dialog.k_data,
k_type = this.k_currentType,
k_list = [],
k_mappedData = [],
k_searchValue = null,
k_selectedRowIndex = -1,
k_cnt, k_i,
k_itemData,
k_item,
k_index;
switch (k_type) {
case AlertEventRuleType.k_SYSTEM:
for (k_i = 0, k_cnt = k_allData.length; k_i < k_cnt; k_i++) {
k_itemData = k_allData[k_i];
if (k_itemData.selected) {
k_list.push(k_itemData.id);
}
}
k_data.alertList = k_list;
if (k_data.alertList && 0 < k_data.alertList.length) {
k_searchValue = {
k_type: k_type,
k_data: k_data.alertList[0]
};
}
break;
case AlertEventRuleType.AlertTraffic:
case AlertEventRuleType.AlertContent:
k_list = k_data.ruleEventList;
for (k_i = 0, k_cnt = k_list.length; k_i < k_cnt; k_i++) {
k_item = k_list[k_i];
if (k_item.ruleType === k_type) {
k_mappedData.push(k_item.rule.id);
}
}
k_list = [];
if (0 < this.k_selectionStatus.k_selectedRowsCount) {
k_selectedRowIndex = this.k_selectionStatus.k_rows[0].k_rowIndex;
}
for (k_i = 0, k_cnt = k_selectedData.length; k_i < k_cnt; k_i++) {
k_itemData = k_selectedData[k_i];
if (-1 === k_mappedData.indexOf(k_itemData.id)) {
k_item = {
ruleType: k_type,
rule: k_itemData
};
k_list.push(k_item);
}
if (null === k_searchValue) {
k_item = {
ruleType: k_type,
rule: k_itemData
};
k_searchValue = k_item;
}
}
k_data.ruleEventList = k_data.ruleEventList.concat(k_list);
break;
}
k_data = k_dialog.k_parent.k_fillAlertListRenderer(k_data);
this.k_setData(k_data.alertListRenderer || []);
if (null !== k_searchValue) {
k_index = this.k_findRowIndexBy(this.k_findNewItem, k_searchValue);
if (null !== k_index) {
this.k_selectRows(k_index[0]);
}
}
else {
if (-1 !== k_selectedRowIndex) {
this.k_selectRows(k_selectedRowIndex);
}
}
};

k_findNewItem = function(k_data) {
var
AlertEventRuleType = kerio.waw.shared.k_CONSTANTS.AlertEventRuleType,
k_type = this.k_type || this.ruleType;
if (undefined === k_type) {
if (undefined !== this.name && undefined !== this.log && undefined !== this.condition && undefined !== this.isRegex) {
k_type = AlertEventRuleType.k_LOG;
}
}
if (k_data.k_type !== k_type) {
return false;
}
switch (k_type) {
case AlertEventRuleType.k_SYSTEM:
return k_data.k_data === this.k_data;
case AlertEventRuleType.AlertTraffic:
case AlertEventRuleType.AlertContent:
return k_data.k_data.rule.id === this.rule.id;
case AlertEventRuleType.k_LOG:
return k_data.k_data.name === this.name && k_data.k_data.log === this.log && k_data.k_data.condition === this.condition && k_data.k_data.isRegex === this.isRegex;
}
return false;
};

k_openSelectItemsDialog = function(k_type, k_selectItemId) {
var
k_gridData = this.k_getData(),
AlertEventRuleType = this.AlertEventRuleType,
k_selectedItems = [],
k_selectObject;
this.k_updateAlertLists();
this.k_currentType = k_type;
switch(k_type) {
case AlertEventRuleType.k_SYSTEM:
k_selectObject = 'k_selectSystemAlert';
k_selectedItems = this.k_dialog.k_data.alertList || [];
break;
case AlertEventRuleType.AlertTraffic:
k_selectObject = 'k_selectTrafficRule';
break;
case AlertEventRuleType.AlertContent:
k_selectObject = 'k_selectContentRule';
break;
case AlertEventRuleType.k_LOG:
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'alertLogMessageEditor',
k_objectName: 'k_alertLogMessageEditor',
k_params: {
k_relatedGrid: this,
k_data: undefined !== k_selectItemId ? k_gridData[k_selectItemId] : undefined
}
});
return;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'selectItems',
k_objectName: k_selectObject,
k_params: {
k_selectedItems: k_selectedItems,
k_onlyNew: false,
k_parentGrid: this,
k_autoAdd: false,
k_callback: this.k_selectItemsCallback
}
});
};

k_updateAlertLists = function() {
var
k_ALERT_GROUP = this.k_ALERT_GROUP,
k_gridData = this.k_getData(),
k_data = this.k_dialog.k_data,
k_alertList = [],
k_ruleList = [],
k_logList = [],
k_cnt, k_i,
k_item;
for (k_i = 0, k_cnt = k_gridData.length; k_i < k_cnt; k_i++) {
k_item = k_gridData[k_i];
switch(k_item.k_group) {
case k_ALERT_GROUP.k_SYSTEM:
k_alertList.push(k_item.k_data);
break;
case k_ALERT_GROUP.k_RULE:
k_ruleList.push(k_item.k_data);
break;
case k_ALERT_GROUP.k_LOG:
k_logList.push(k_item.k_data);
break;
}
}
k_data.alertList = k_alertList;
k_data.ruleEventList = k_ruleList;
k_data.logEventList = k_logList;
this.k_dialog.k_data = k_data;
return k_data;
};

k_openRowEditor = function(k_grid, k_rowData) {
var
k_selectionStatus = k_grid.k_selectionStatus,
k_row;
if (1 === k_selectionStatus.k_selectedRowsCount) {
k_row = k_grid.k_selectionStatus.k_rows[0];
k_grid.k_openSelectItemsDialog(k_row.k_data.k_type, k_row.k_rowIndex);
}
};
k_dataGridCfg = {
k_className: 'noGridHeader',
k_isStateful: false,
k_toolbars: {
k_bottom: {
k_items: [
{
k_caption: k_tr('System alert', 'alertEditor'),
k_iconCls: 'bandwidthManagement systemAlertIcon agTypeFirewall',
k_onClick: function(k_toolbar){
var
k_grid = k_toolbar.k_relatedWidget;
k_grid.k_openSelectItemsDialog(k_grid.AlertEventRuleType.k_SYSTEM);
}
},
{
k_caption: k_tr('Traffic rule', 'alertEditor'),
k_iconCls: 'bandwidthManagement packetsIcon',
k_onClick: function(k_toolbar){
var
k_grid = k_toolbar.k_relatedWidget;
k_grid.k_openSelectItemsDialog(k_grid.AlertEventRuleType.AlertTraffic);
}
},
{
k_caption: k_tr('Content rule', 'alertEditor'),
k_iconCls: 'bandwidthManagement contentFilterIcon',
k_onClick: function(k_toolbar){
var
k_grid = k_toolbar.k_relatedWidget;
k_grid.k_openSelectItemsDialog(k_grid.AlertEventRuleType.AlertContent);
}
},
{
k_caption: k_tr('Log message', 'alertEditor'),
k_iconCls: 'bandwidthManagement logIcon',
k_onClick: function(k_toolbar){
var
k_grid = k_toolbar.k_relatedWidget;
k_grid.k_openSelectItemsDialog(k_grid.AlertEventRuleType.k_LOG);
}
}
],
k_update: function(k_sender, k_event){
var
k_events = kerio.lib.k_constants.k_EVENT,
k_constEventTypes = k_events.k_TYPES,
k_selectedRowsCount,
k_currentKeyCode,
k_constKeyCodes;
if (k_sender instanceof kerio.lib.K_Grid) {
switch (k_event.k_type) {
case k_constEventTypes.k_SELECTION_CHANGED:
k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount;
this.k_enableItem('k_btnRemove', (0 !== k_selectedRowsCount));
break;
case k_constEventTypes.k_KEY_PRESSED:
k_constKeyCodes = kerio.lib.k_constants.k_EVENT.k_KEY_CODES;
k_currentKeyCode = k_event.k_browserEvent.keyCode;
if (((k_constKeyCodes.k_BACKSPACE === k_currentKeyCode) || (k_constKeyCodes.k_DELETE === k_currentKeyCode))) {
k_sender.k_removeLines();
}
break;
}
}
}
}
},
k_removeFunction: function(k_rowsIndexes) {
var k_grid = this.k_relatedWidget;
if (k_rowsIndexes) {
k_grid.k_removeRowByIndex(k_rowsIndexes);
}
else {
k_grid.k_removeSelectedRows();
}
k_grid.k_updateAlertLists();
},
k_onDblClick: k_openRowEditor,
k_columns: {
k_grouping: {
k_columnId: 'k_group',
k_isMemberIndented: true
},
k_sorting: {
k_columnId: 'k_type',
k_isAscending: false
},
k_items: [
{
k_columnId: 'k_group',
k_caption: 'Type',
k_isHidden: true,
k_isKeptHidden: true,
k_groupRenderer: function(k_value) {
return {
k_data: this.k_trCache[k_value]
};
}
},
{
k_columnId: 'k_type',
k_isHidden: true,
k_isKeptHidden: true
},
{
k_columnId: 'k_data',
k_isDataOnly: true
},
{
k_columnId: 'k_value',
k_renderer: k_shared.k_methods.k_renderers.k_alertLineRenderer
}
]
}
};
k_dataGrid = new kerio.waw.shared.k_widgets.K_OfferGrid(k_localNamespace + 'dataGrid', k_dataGridCfg);
k_dataGrid.k_addReferences({
AlertEventRuleType: AlertEventRuleType,
k_ALERT_GROUP: k_ALERT_GROUP,
k_selectItemsCallback: k_selectItemsCallback,
k_openSelectItemsDialog: k_openSelectItemsDialog,
k_updateAlertLists: k_updateAlertLists,
k_currentType: null,
k_findNewItem: k_findNewItem,
k_trCache: {}
});
k_dataGrid.k_trCache[k_ALERT_GROUP.k_SYSTEM] = k_tr('System alerts', 'alertEditor');
k_dataGrid.k_trCache[k_ALERT_GROUP.k_RULE] = k_tr('Policy Rule alerts', 'alertEditor');
k_dataGrid.k_trCache[k_ALERT_GROUP.k_LOG] = k_tr('Log message alerts', 'alertEditor');
k_formCfg = {
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('User', 'common'),
k_items: [
{
k_type: 'k_container',
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_addresseeType',
k_isLabelHidden: true,
k_option: k_tr('User:', 'common'),
k_value: k_RADIO_TYPE_USER,
k_isChecked: true,
k_width: 115,
k_onChange: function(k_form, k_group, k_value) {
k_form.k_setDisabled(['k_emailInput'], k_form.k_RADIO_TYPE_USER === k_value);
k_form.k_setDisabled(['k_userInput', 'k_btnSelectUser', 'reportConfig.onlineAccess'], k_form.k_RADIO_TYPE_USER !== k_value);
if (k_form.k_RADIO_TYPE_USER !== k_value) {
k_form.k_emailInput.k_focus();
}
else {
k_form.k_btnSelectUser.k_focus();
}
}
},
{
k_id: 'k_userInput',
k_isReadOnly: true,
k_width: 220,
k_value: ''
},
{
k_id: 'addressee.user',
k_isLabelHidden: true,
k_isHidden: true
},
{
k_type: 'k_formButton',
k_id: 'k_btnSelectUser',
k_caption: k_tr('Select user…', 'starAccessEditor'),

k_onClick: function(k_form) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'selectItems',
k_objectName: 'k_selectMembersForReport',
k_params: {
k_onlyNew: false, k_parentGrid: k_form,
k_autoAdd: false, k_selectionMode: 'k_single', k_callback: k_form.k_selectUserCallback
}
});
}
}
]
}
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_addresseeType',
k_isLabelHidden: true,
k_width: 115,
k_option: k_tr('Email:', 'common'),
k_value: k_RADIO_TYPE_EMAIL
},
{
k_id: 'k_emailInput',
k_isDisabled: true,
k_value: '',
k_maxLength: k_CONSTANTS.k_MAX_LENGTH.k_EMAIL_ADDRESS,
k_validator: {
k_functionName: 'k_isEmail',
k_allowBlank: true
}
}
]
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Alerts', 'alertEditor'),
k_height: 365,
k_content: k_dataGrid
},
{
k_type: 'k_fieldset',
k_labelWidth: 220,
k_className: 'removeFieldsetMargin',
k_caption: k_tr('Additional settings', 'alertEditor'),
k_items: [
{
k_type: 'k_definitionSelect',
k_id: 'validTimeRange',
k_caption: k_tr('Valid at time interval:', 'alertEditor'),
k_width: '100%',
k_definitionType: 'k_timeRange',
k_showApplyReset: true,
k_allowFiltering: true,
k_pageSize: 500,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: [{
k_id: kerio.waw.shared.k_CONSTANTS.k_NONE,
k_name: k_tr('Always', 'timeRangeList')
}],
k_onApplyResetHandler: kerio.waw.shared.k_methods.k_definitionApplyResetHandler
}
]
}
]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_form.k_addReferences({
k_selectUserCallback: k_selectUserCallback,
k_RADIO_TYPE_USER: k_RADIO_TYPE_USER,
k_RADIO_TYPE_EMAIL: k_RADIO_TYPE_EMAIL,
k_dataGrid: k_dataGrid,
k_userInput: k_form.k_getItem('k_userInput'),
k_emailInput: k_form.k_getItem('k_emailInput'),
k_addresseeType: k_form.k_getItem('k_addresseeType'),
k_userReference: k_form.k_getItem('addressee.user'),
k_btnSelectUser: k_form.k_getItem('k_btnSelectUser'),
k_timeRange: new kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_timeRangeList',
k_select: 'validTimeRange',
k_form: k_form
})
});
k_dialogCfg = {
k_width: 570,
k_height: 635,
k_title: k_isEditMode ? k_tr('Edit Alert', 'alertEditor') : k_tr('Add Alert', 'alertEditor'),
k_content: k_form,
k_defaultItem: null,
k_onOkClick: function() {
this.k_dialog.k_sendData();
}
};
k_dialogCfg = k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_dataGrid: k_dataGrid,
k_isEdit: k_isEditMode
});
k_dataGrid.k_addReferences({
k_dialog: k_dialog,
k_form: k_form
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_applyParams = function(k_params) {
var
k_tr = kerio.lib.k_tr,
k_parent = k_params.k_relatedWidget,
k_data = kerio.lib.k_cloneObject(k_params.k_data) || {}, k_grid = this.k_dataGrid,
k_form = this.k_form,
k_isEdit = this.k_isEdit,
k_isUserType,
k_userName,
k_validTimeRange;
this.k_parent = k_parent;
this.k_saveCallback = k_params.k_saveCallback;
k_form.k_timeRange.k_sendRequest();
if (k_isEdit) {
this.k_editedRowIndex = k_params.k_rowIndex;
k_validTimeRange = k_data.validTimeRange;
delete k_data.validTimeRange; if(k_validTimeRange.invalid) {
k_validTimeRange = {
id: null,
invalid: true,
name: k_tr('Select Time Range', 'alertEditor')
};
}
if (1 === k_data.alertListRenderer.length && k_data.alertListRenderer[0].k_isNothing) {
k_data.alertListRenderer = [];
}
k_grid.k_setData(k_data.alertListRenderer || []);
k_form.k_setData(k_data, true);
k_form.k_timeRange.k_selectValue(k_validTimeRange, true);
k_isUserType = kerio.waw.shared.k_CONSTANTS.AddresseeType.AddresseeUser === k_data.addressee.type;
if (k_isUserType) {
k_userName = kerio.waw.shared.k_methods.k_renderers.k_userOrEmailRenderer(k_data.addressee);
k_form.k_userInput.k_setValue(k_userName.k_data, true);
k_form.k_addresseeType.k_setValue(k_form.k_RADIO_TYPE_USER, true);
}
else {
k_form.k_emailInput.k_setValue(k_data.addressee.email, true);
k_form.k_emailInput.k_setDisabled(false);
k_form.k_emailInput.k_focus();
k_form.k_addresseeType.k_setValue(k_form.k_RADIO_TYPE_EMAIL, true);
}
}
else {
k_data = {
alertList: [],
ruleEventList: [],
logEventList: []
};
}
this.k_data = k_data;
kerio.waw.shared.k_data.k_cache({
k_dialogs: ['alertLogMessageEditor']
});
};

k_kerioWidget.k_sendData = function() {
var
k_tr = kerio.lib.k_tr,
k_form = this.k_form,
k_grid = this.k_dataGrid,
k_formData = k_form.k_getData(),
k_gridData = k_grid.k_getData(),
k_isValid = true,
k_message,
k_isEmailType;
k_isEmailType = k_form.k_RADIO_TYPE_EMAIL === k_formData.k_addresseeType;
if (0 === k_gridData.length) {
k_isValid = false;
k_message = k_tr('Please select at least one alert.', 'alertEditor');
}
else if (k_isEmailType && '' === k_formData.k_emailInput) {
k_isValid = false;
k_message = k_tr('Please fill in an email address.', 'alertEditor');
}
else if (!k_isEmailType && '' === k_formData.k_userInput) {
k_isValid = false;
k_message = k_tr('Please select a user.', 'alertEditor');
}
else if ('' === k_formData.validTimeRange) {
k_isValid = false;
k_message = k_tr('Please select a valid time range.', 'alertEditor');
}
if (!k_isValid) {
kerio.lib.k_alert({
k_title: k_tr('Validation warning', 'alertEditor'),
k_msg: k_message,
k_icon: 'warning'
});
this.k_hideMask();
return;
}
k_formData = kerio.waw.shared.k_methods.k_mergeObjects(k_grid.k_updateAlertLists(), k_formData);
k_formData.validTimeRange = k_form.k_timeRange.k_getValue();
k_formData.alertListRenderer = k_gridData;
k_formData.addressee = this.k_data.addressee || {};
if (k_isEmailType) {
k_formData.addressee.type = kerio.waw.shared.k_CONSTANTS.AddresseeType.AddresseeEmail;
k_formData.addressee.email = k_formData.k_emailInput;
k_formData.addressee.user = {};
}
delete k_formData.k_shortenedEmail;
delete k_formData.k_emailInput;
delete k_formData.k_userInput;
delete k_formData.k_addresseeType;
if (!this.k_isEdit) {
k_formData.enabled = true;
}
if (this.k_saveCallback.call(this.k_parent, k_formData, this.k_editedRowIndex)) {
this.k_hide();
}
};

k_kerioWidget.k_resetOnClose = function() {
this.k_dataGrid.k_resetGrid();
this.k_form.k_reset();
};
}
};
