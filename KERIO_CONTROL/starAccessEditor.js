
kerio.waw.ui.starAccessEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_isEdit = 'starAccessEditorEdit' === k_objectName,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_formCfg, k_form,
k_dialogCfg, k_dialog,
k_RADIO_TYPE_USER = 0,
k_RADIO_TYPE_EMAIL = 1,
k_selectUserCallback,
k_dataGrid, k_dataGridCfg,
k_addAllData,
k_addUserGroup,
k_addUserGroupCallback,
k_searchDuplicate;

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
this.k_dialog.k_data.addressee = k_user;
this.k_userInput.k_setValue(k_userName.k_data);
}
};
k_addAllData = function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget,
k_isAllDataAlready = k_grid.k_findRowBy(function(k_data) {
if (k_data.allData) {
return true;
}
});
if (k_isAllDataAlready) {
return;
}
k_grid.k_addRow(
{
allData: true,
k_usersRenderer: {allData: true},
k_type: k_grid.k_GROUPS.k_ALL_DATA
},
0
); }; 
k_addUserGroup = function(k_toolbar) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'selectItems',
k_objectName: 'k_selectMembersForRule',
k_params: {
k_onlyNew: false, k_parentGrid: k_toolbar.k_relatedWidget,
k_autoAdd: false, k_callback: function(k_selectedIds, k_allItems, k_currentDomain, k_selectedItems) {
var
k_i, k_cnt,
k_user;
for (k_i = 0, k_cnt = k_selectedItems.length; k_i < k_cnt; k_i++) {
k_user = k_selectedItems[k_i];
if (null === this.k_findRowBy(this.k_searchDuplicate, k_user)) {
k_user.k_type = (k_user.k_isGroup ? this.k_GROUPS.k_GROUPS : this.k_GROUPS.k_USERS);
this.k_addRow(k_user);
}
} this.k_resortRows();
}
}});
}; 
k_searchDuplicate = function(k_data) {
if (true === k_data.allData) {
return false;
}
return this.id === k_data.id;
}; k_dataGridCfg = {
k_className: 'starAccessEditor noGridHeader',
k_isStateful: false,
k_toolbars: {
k_bottom: {
k_items: [
{
k_id: 'k_addAllData',
k_caption: k_tr('All Data', 'starAccessEditor'),
k_iconCls: 'gridListIcon allData',
k_onClick: k_addAllData
},
{
k_id: 'k_addUserGroup',
k_caption: k_tr('Users and Groups', 'trafficSourceDestinationEditor'),
k_iconCls: 'gridListIcon userIcon',
k_onClick: k_addUserGroup }
],
k_update: function(k_sender, k_event){
var
k_events = kerio.lib.k_constants.k_EVENT,
k_constEventTypes = k_events.k_TYPES,
k_selectedRowsCount,
k_constKeyCodes,
k_currentKeyCode;
if (k_sender instanceof kerio.lib.K_Grid) {
switch (k_event.k_type) {
case k_constEventTypes.k_SELECTION_CHANGED:
k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount;
this.k_enableItem('k_btnRemove', (0 !== k_selectedRowsCount));
break; case k_constEventTypes.k_KEY_PRESSED:
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
k_columns: {
k_grouping: {
k_columnId: 'k_type',
k_isMemberIndented: true
},
k_items: [
{
k_columnId: 'allData',
k_isDataOnly: true
},
{
k_columnId: 'isGroup',
k_isDataOnly: true
},
{
k_columnId: 'k_type',
k_isHidden: true,
k_isKeptHidden: true,
k_groupRenderer: function(k_value) {
var k_data;
switch (k_value) {
case this.k_GROUPS.k_ALL_DATA:
k_data = this.k_allDataText;
break;
case this.k_GROUPS.k_USERS:
k_data = this.k_userDataText;
break;
case this.k_GROUPS.k_GROUPS:
k_data = this.k_groupDataText;
break;
}
return {
k_data: k_data
};
}
},
{
k_caption: k_tr('Data', 'starAccessEditor'),
k_columnId: 'k_usersRenderer',
k_renderer: function(k_value, k_data, k_rowIndex, k_colIndex, k_grid) {
var
k_renderData = '',
k_iconCls = 'icon',
k_rendererOutput;
if (k_data.allData) {
k_renderData = k_grid.k_allDataText;
k_iconCls += ' starDataIcon';
}
else {
k_rendererOutput = kerio.waw.shared.k_methods.k_createReferencedUserName(k_data);
k_renderData = k_rendererOutput.k_userName;
k_iconCls += k_data.isGroup ? ' groupDataIcon' : ' userDataIcon';
}
return {
k_data: k_renderData,
k_iconCls: k_iconCls
};
}
}
]
}
};
k_dataGrid = new kerio.waw.shared.k_widgets.K_OfferGrid(k_localNamespace + 'dataGrid', k_dataGridCfg);
k_dataGrid.k_addReferences({
k_addUserGroupCallback: k_addUserGroupCallback,
k_searchDuplicate: k_searchDuplicate,
k_groupDataText: k_tr('Group statistics','starAccessEditor'),
k_userDataText: k_tr('Individual statistics','starAccessEditor'),
k_allDataText: k_tr('All data', 'starAccessEditor'),
k_GROUPS: {
k_ALL_DATA: 0,
k_USERS: 1,
k_GROUPS: 2
}
});
k_formCfg = {
k_useStructuredData: true,
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
}
},
{
k_id: 'k_userInput',
k_isReadOnly: true,
k_width: 210,
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
k_objectName: 'k_selectMembersForRule',
k_params: {
k_onlyNew: false, k_parentGrid: k_form,
k_autoAdd: false, k_selectionMode: 'k_single', k_callback: k_form.k_selectUserCallback
}
});
}
}
]
},
{
k_type: 'k_checkbox',
k_id: 'reportConfig.onlineAccess',
k_isLabelHidden: true,
k_indent: 1,
k_isChecked: true,
k_option: k_tr('Allow online access to the data defined below', 'accountingList')
}
]
}, {
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
k_value: '',
k_maxLength: kerio.waw.shared.k_CONSTANTS.k_MAX_LENGTH.k_EMAIL_ADDRESS,
k_isDisabled: true,
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
k_caption: k_tr('Data', 'starAccessEditor'),
k_height: 300,
k_content: k_dataGrid
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Regular email reports', 'starAccessEditor'),
k_items: [
{
k_type: 'k_display',
k_template: k_tr('The user receives regular email reports containing the following data:', 'starAccessEditor')
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_checkbox',
k_id: 'reportConfig.dailyEnabled',
k_isLabelHidden: true,
k_width: 100,
k_option: k_tr('Daily', 'accountingList')
},
{
k_type: 'k_checkbox',
k_id: 'reportConfig.weeklyEnabled',
k_isLabelHidden: true,
k_width: 100,
k_option: k_tr('Weekly', 'accountingList')
},
{
k_type: 'k_checkbox',
k_id: 'reportConfig.monthlyEnabled',
k_isLabelHidden: true,
k_width: 100,
k_option: k_tr('Monthly', 'accountingList')
}
]
}
]
}
] };k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 580,
k_height: 610,
k_title: k_tr('Access Rights and Email Reports', 'starAccessEditor'),
k_content: k_form,
k_defaultItem: 'k_userInput',

k_onOkClick: function() {
this.k_dialog.k_sendData();
}}; k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_form.k_addReferences({
k_dataGrid: k_dataGrid,
k_dialog: k_dialog,
k_userInput: k_form.k_getItem('k_userInput'),
k_emailInput: k_form.k_getItem('k_emailInput'),
k_addresseeType: k_form.k_getItem('k_addresseeType'),
k_userReference: k_form.k_getItem('addressee.user'),
k_onlineAccess: k_form.k_getItem('reportConfig.onlineAccess'),
k_RADIO_TYPE_USER: k_RADIO_TYPE_USER,
k_RADIO_TYPE_EMAIL: k_RADIO_TYPE_EMAIL,
k_selectUserCallback: k_selectUserCallback
});k_dialog.k_addReferences({
k_form: k_form,
k_dataGrid: k_dataGrid,
k_isEdit: k_isEdit,
k_parent: {},
k_saveCallback: null,
k_data: {}
});this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_form = this.k_form,
k_GROUPS = this.k_dataGrid.k_GROUPS,
k_data = kerio.lib.k_cloneObject(k_params.k_data),
k_isEdit = this.k_isEdit,
k_userType,
k_userName,
k_i, k_cnt, k_item;
this.k_parent = k_params.k_relatedWidget;
if (k_isEdit) {
if(k_data.usersRenderer && k_data.usersRenderer[0].k_isNothing) {
k_data.usersRenderer.shift();
}
k_userType = kerio.waw.shared.k_CONSTANTS.AddresseeType.AddresseeUser === k_data.addressee.type;
if (k_userType) {
k_userName = kerio.waw.shared.k_methods.k_renderers.k_userOrEmailRenderer(k_data.addressee);
k_form.k_userInput.k_setValue(k_userName.k_data, true);
k_form.k_addresseeType.k_setValue(k_form.k_RADIO_TYPE_USER, true);
}
else {
k_form.k_emailInput.k_setValue(k_data.addressee.email, true);
k_form.k_addresseeType.k_setValue(k_form.k_RADIO_TYPE_EMAIL, true);
}
for (k_i = 0, k_cnt = k_data.usersRenderer.length; k_i < k_cnt; k_i++) {
k_item = k_data.usersRenderer[k_i];
k_item.k_type = (k_item.allData ? k_GROUPS.k_ALL_DATA : (k_item.isGroup ? k_GROUPS.k_GROUPS : k_GROUPS.k_USERS));
} k_form.k_setData(k_data, true);
k_form.k_dataGrid.k_setData(k_data.usersRenderer, true);
k_form.k_dataGrid.k_startTracing();
this.k_data = k_data;
}
};

k_kerioWidget.k_sendData = function() {
var
k_form = this.k_form,
k_data = this.k_data,
k_relatedGrid = this.k_parent,
k_formData;
k_formData = k_form.k_getData(true);
k_formData.k_usersRenderer = this.k_dataGrid.k_getData();
if (!this.k_validateForm(k_form, k_formData)) {
this.k_hideMask();
return;
}
k_data.reportConfig = k_formData.reportConfig;
k_data.addressee = undefined === k_data.addressee ? {} : k_data.addressee;
if (k_form.k_RADIO_TYPE_EMAIL === k_formData.k_addresseeType) {
k_data.addressee.type = kerio.waw.shared.k_CONSTANTS.AddresseeType.AddresseeEmail;
k_data.addressee.email = k_formData.k_emailInput;
k_data.addressee.user = {};
}
k_data.usersRenderer = k_formData.k_usersRenderer;
k_data.onlineAccess = k_formData.reportConfig.onlineAccess;
if (0 < k_data.usersRenderer.length && k_data.usersRenderer[0].allData) {
k_data.users = k_data.usersRenderer.slice(1);
k_data.allData = true;
}
else {
k_data.users = k_data.usersRenderer;
k_data.allData = false;
}
if (this.k_isEdit) {
k_relatedGrid.k_updateRow(k_data);
}
else {
k_data.enabled = true;
k_relatedGrid.k_addRow(k_data);
}
k_relatedGrid.k_resortRows();
kerio.adm.k_framework.k_enableApplyReset();
this.k_hide();
};
k_kerioWidget.k_validateForm = function(k_form, k_data) {
var
k_reportConfig = k_data.reportConfig;
if ((k_form.k_RADIO_TYPE_EMAIL === k_data.k_addresseeType && '' === k_data.k_emailInput) ||
(k_form.k_RADIO_TYPE_EMAIL !== k_data.k_addresseeType && '' === k_data.k_userInput)) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Validation warning', 'starAccessEditor'),
k_msg: kerio.lib.k_tr('A user or an email address has to be set.', 'starAccessEditor'),
k_icon: 'info'
});
return false;
}
if (0 === k_data.k_usersRenderer.length) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Validation warning', 'starAccessEditor'),
k_msg: kerio.lib.k_tr('Please select at least one type of data.', 'starAccessEditor'),
k_icon: 'info'
});
return false;
}
if (k_form.k_RADIO_TYPE_USER === k_data.k_addresseeType && !(k_reportConfig.dailyEnabled || k_reportConfig.monthlyEnabled || k_reportConfig.onlineAccess || k_reportConfig.weeklyEnabled)) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Validation warning', 'starAccessEditor'),
k_msg: kerio.lib.k_tr('At least one type of access has to be set (online access or regular email report).', 'starAccessEditor'),
k_icon: 'info'
});
return false;
}
if ( k_form.k_RADIO_TYPE_EMAIL === k_data.k_addresseeType && !(k_reportConfig.dailyEnabled || k_reportConfig.monthlyEnabled || k_reportConfig.weeklyEnabled)) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Validation warning', 'starAccessEditor'),
k_msg: kerio.lib.k_tr('At least one type of regular email report has to be set for the email adressee.', 'starAccessEditor'),
k_icon: 'info'
});
return false;
}
return true;
};

k_kerioWidget.k_resetOnClose = function() {
this.k_dataGrid.k_stopTracing();
this.k_dataGrid.k_resetGrid();
this.k_form.k_reset();
};
} }; 