
kerio.waw.ui.reportEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isEditMode = ('reportEditorEdit' === k_objectName),
k_formCfg, k_form,
k_dialogCfg, k_dialog,
k_selectUserCallback,
k_originEmail;

k_selectUserCallback = function (k_selectedItems, k_allData, k_currentDomain, k_selectedData) {
var
k_userName,
k_selectedUser;
if (1 === k_selectedData.length) {
k_selectedUser = k_selectedData[0];
k_userName = kerio.waw.shared.k_methods.k_renderers.k_renderSimpleUserName(null, k_selectedUser);
this.k_emailAddress.k_setValue(k_selectedUser.email);
this.k_userReference.k_setValue(k_selectedUser.k_id);
this.k_userReferenceDomainName.k_setValue(k_selectedUser.domainName);
this.k_userReferenceText.k_setValue(k_userName.k_data);
this.k_userReferenceName.k_setValue(k_userName.k_data);
this.k_userReferenceContainer.k_setVisible(true);
}
};k_formCfg = {
k_className: 'reportEditor',
k_useStructuredData: true,
k_items: [
{
k_type: 'k_display',
k_value: k_tr('To recipient:', 'reportEditor')
},
{
k_id: 'recipientEmail',
k_isLabelHidden: true,
k_maxLength: kerio.waw.shared.k_CONSTANTS.k_MAX_LENGTH.k_EMAIL_ADDRESS,
k_validator: {
k_functionName: 'k_isEmail',
k_allowBlank: true
},

k_onChange: function(k_form) {
k_form.k_userReferenceContainer.k_setVisible(false);
k_form.k_userReference.k_setValue('');
k_form.k_userReferenceText.k_setValue('');
k_form.k_userReferenceName.k_setValue('');
}
},
{
k_id: 'addressee.user.id',
k_isLabelHidden: true,
k_isHidden: true
},
{
k_id: 'addressee.user.domainName',
k_isLabelHidden: true,
k_isHidden: true
},
{
k_id: 'addressee.user.name',
k_isLabelHidden: true,
k_isHidden: true
},
{
k_type: 'k_row',
k_id: 'k_selectUserRow',
k_items: [{
k_type: 'k_container',
k_className: 'userNameIcon',
k_id: 'k_userReferenceContainer',
k_width: 150,
k_height: 20,
k_isHidden: true,
k_items: [{
k_type: 'k_display',
k_id: 'userReferenceText',
k_className: 'userName',
k_width: 150
}]
},
'->',
{
k_type: 'k_formButton',
k_id: 'k_btnSelectUser',
k_caption: k_tr('Select user…', 'reportEditor'),

k_onClick: function(k_grid) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'selectItems',
k_objectName: 'k_selectMembersForReport',
k_params: {
k_onlyNew: false, k_parentGrid: k_grid,
k_autoAdd: false, k_selectionMode: 'k_single', k_callback: k_grid.k_selectUserCallback
}});
}
}
]
},
{
k_type: 'k_display',
k_value: k_tr('Type of report:', 'reportEditor')
},
{
k_type: 'k_checkbox',
k_id: 'dailyEnabled',
k_isLabelHidden: true,
k_option: k_tr('Daily', 'reportEditor')
},
{
k_type: 'k_checkbox',
k_id: 'weeklyEnabled',
k_isLabelHidden: true,
k_option: k_tr('Weekly', 'reportEditor')
},
{
k_type: 'k_checkbox',
k_id: 'monthlyEnabled',
k_isLabelHidden: true,
k_option: k_tr('Monthly', 'reportEditor')
}
] };k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 400,
k_height: 300,
k_title: (k_isEditMode)
? k_tr('Edit StaR Report Recipient', 'reportEditor')
: k_tr('Add StaR Report Recipient', 'reportEditor'),
k_content: k_form,
k_defaultItem: 'recipientEmail',

k_onOkClick: function() {
this.k_dialog.k_sendData();
}}; k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_form.k_addReferences({
k_isEditMode: k_isEditMode,
k_dialog: k_dialog,
k_selectUserCallback: k_selectUserCallback,
k_emailAddress: k_form.k_getItem('recipientEmail'),
k_userReferenceText: k_form.k_getItem('userReferenceText'),
k_userReferenceName: k_form.k_getItem('addressee.user.name'),
k_userReference: k_form.k_getItem('addressee.user.id'),
k_userReferenceDomainName: k_form.k_getItem('addressee.user.domainName'),
k_userReferenceContainer: k_form.k_getItem('k_userReferenceContainer'),
k_originEmail: k_originEmail
});k_dialog.k_addReferences({
k_form: k_form,
k_isEditMode: k_isEditMode
});this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_parent = k_params.k_relatedWidget,
k_form = this.k_form,
k_items = k_form.k_items,
k_data = kerio.lib.k_cloneObject(k_params.k_data);
this.k_parent = k_parent;
this.k_saveCallback = k_params.k_saveCallback;
if (this.k_isEditMode) {
this.k_editedRowIndex = k_params.k_rowIndex;
if (null !== k_data.addressee) {
k_items.recipientEmail.k_setValue(k_data.addressee.email);
k_form.k_originEmail = k_data.addressee.email;
k_items.userReferenceText.k_setValue(k_data.addressee.user.name);
if (kerio.waw.shared.k_CONSTANTS.AddresseeType.AddresseeUser === k_data.addressee.type) {
k_items.k_userReferenceContainer.k_setVisible(true);
}
else {
k_items.k_userReferenceContainer.k_setVisible(false);
}
}
else {
k_form.k_originEmail = k_data.recipientEmail;
}
k_form.k_setData(k_data, true);
}
else {
k_items.k_userReferenceContainer.k_setVisible(false);
}
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_data: ['k_domains', 'k_users'],
k_dialogs: ['selectItems']
});
};

k_kerioWidget.k_sendData = function() {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
AddresseeType = kerio.waw.shared.k_CONSTANTS.AddresseeType,
k_ADDRESSEE_TYPE_USER = AddresseeType.AddresseeUser,
k_ADDRESSEE_TYPE_EMAIL = AddresseeType.AddresseeEmail,
k_formData,
k_gridData, k_item,
k_cnt, k_i,
k_addresseeType,
k_originalRecipient,
k_email;
k_formData = this.k_form.k_getData(true);
k_formData.addressee.email = k_formData.recipientEmail;
k_email = k_formData.recipientEmail;
k_formData.addressee.user.isGroup = false;
k_formData.addressee.type = '' !== k_formData.addressee.user.id ? k_ADDRESSEE_TYPE_USER : k_ADDRESSEE_TYPE_EMAIL;
k_addresseeType = k_formData.addressee.type;
if ('' === k_formData.recipientEmail && k_ADDRESSEE_TYPE_EMAIL === k_addresseeType) {
k_lib.k_alert(
k_tr('Invalid Input', 'reportEditor'),
k_tr('Email address or user has to be set', 'reportEditor')
);
this.k_hideMask();kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
}
if (!k_formData.dailyEnabled && !k_formData.weeklyEnabled && !k_formData.monthlyEnabled) {
k_lib.k_alert(
k_tr('Invalid Input', 'reportEditor'),
k_tr('At least one type of StaR Report has to be set.', 'reportEditor')
);
this.k_hideMask();kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
}
k_gridData = this.k_parent.k_getData();
k_originalRecipient = true;
if (this.k_form.k_originEmail !== k_email) {
for (k_i = 0, k_cnt = k_gridData.length; k_i < k_cnt && k_originalRecipient; k_i++) {
k_item = k_gridData[k_i];
if (k_ADDRESSEE_TYPE_USER === k_addresseeType && k_ADDRESSEE_TYPE_USER === k_item.addressee.type && k_item.addressee.user.id === k_formData.addressee.user.id) {
k_originalRecipient = false;
}
else if (k_ADDRESSEE_TYPE_EMAIL === k_addresseeType && k_ADDRESSEE_TYPE_EMAIL === k_item.addressee.type && k_item.addressee.email === k_email) {
k_originalRecipient = false;
}
}
}
if (!k_originalRecipient) {
k_lib.k_alert(
k_tr('Invalid Input', 'reportEditor'),
k_tr('This recipient is already defined in the list.', 'reportEditor')
);
this.k_hideMask();kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
}
if (!this.k_isEditMode) {
k_formData.enabled = true;
}
if (this.k_saveCallback.call(this.k_parent, k_formData, this.k_editedRowIndex)) {
this.k_hide();
}
};
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
} }; 