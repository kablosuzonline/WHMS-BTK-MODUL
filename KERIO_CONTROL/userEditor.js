
kerio.waw.ui.userEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_widgets = kerio.waw.shared.k_widgets,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_isAuditor = k_WAW_METHODS.k_isAuditor(),
k_isUserAdd = (kerio.waw.shared.k_DEFINITIONS.k_userListIds.k_userAdd === k_objectName),
k_AUTH_TYPE = k_WAW_CONSTANTS.AuthType,
k_generalForm, k_generalFormCfg,
k_membersForm, k_membersFormCfg,
k_rightsForm,
k_quotaForm,
k_preferencesForm,
k_addressesForm, k_addressesFormCfg,
k_dialogContent, k_dialogContentCfg,
k_dialog, k_dialogCfg,
k_forms;
k_generalFormCfg = {
k_items: [
{
k_type: 'k_container',
k_id: 'k_localOnlyEditContainer',
k_labelWidth: 165,
k_items: [
{
k_id: 'k_id',
k_isHidden: true
},
{
k_id: 'k_userName',
k_caption: k_tr('Username:', 'common'),
k_maxLength: 127,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isUserName'
}
},
{
k_id: 'k_fullName',
k_caption: k_tr('Full name:', 'userEditor'),
k_maxLength: 127,
k_checkByteLength: true
},
{
k_id: 'k_description',
k_caption: k_tr('Description:', 'common'),
k_maxLength: 255,
k_checkByteLength: true
},
{
k_id: 'k_email',
k_caption: k_tr('Email address:', 'userEditor'),
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_EMAIL_ADDRESS,
k_validator: {
k_allowBlank: true,
k_functionName: 'k_isEmail'
}
},
{
k_type: 'k_select',
k_id: 'k_authType',
k_caption: k_tr('Authentication:', 'userEditor'),
k_localData: [
{
k_value: k_AUTH_TYPE.Internal,
k_caption: k_tr('Internal user database', 'userEditor')
},
{
k_value: k_AUTH_TYPE.KerberosNt,
k_caption: k_tr('Directory service', 'userEditor')
}
],
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_value: k_AUTH_TYPE.Internal,

k_onChange: function(k_form, k_select, k_value){
if (!k_form) {
return;
}
var
Internal = kerio.waw.shared.k_CONSTANTS.AuthType.Internal,
k_isPasswordEdited = k_form.k_isPasswordEdited,
k_isInternal = (Internal === k_value),
k_isFieldValid;
k_form.k_setDisabled(['k_password', 'k_passwordConfirmation'], !k_isInternal);
if (!k_isPasswordEdited && k_isInternal) {
k_form.k_setDisabled(['k_passwordConfirmation'], true);
}
k_isFieldValid = !k_isInternal || !k_isPasswordEdited || k_form.k_password.k_getValue() === k_form.k_passwordConfirmation.k_getValue();
k_form.k_passwordConfirmation.k_markInvalid(!k_isFieldValid);
}
},
{
k_id: 'k_password',
k_caption: k_tr('Password:', 'common'),
k_isPasswordField: true,
k_width: '100%',
k_emptyText: '**********',
k_maxLength: 110, k_checkByteLength: true,

k_onChange: function(k_form, k_element, k_value) {
if (k_value && !k_form.k_isPasswordEdited) {
k_form.k_isPasswordEdited = true;
}
k_form.k_setDisabled(['k_passwordConfirmation'], '' === k_value && !k_form.k_isPasswordEdited);
k_form.k_dialog.k_validatePassword();
}},
{
k_id: 'k_passwordConfirmation',
k_caption: k_tr('Confirm password:', 'userEdit'),
k_isPasswordField: true,
k_width: '100%',
k_isDisabled: true,
k_maxLength: 110, k_checkByteLength: true,
k_preventExtValidation: true,

k_onChange: function(k_form) {
k_form.k_dialog.k_validatePassword();
}
}
] },{
k_type: 'k_columns',
k_id: 'k_enableAccountContainer',
k_width: 200,
k_items: [
kerio.waw.shared.k_DEFINITIONS.k_get('k_userEditorEnableUserCfg'),
{
k_type: 'k_display',
k_id: 'k_disabledMessage',
k_value: k_tr('(is disabled in directory service domain)', 'userEdit'),
k_isHidden: true
}
]
},
{
k_type: 'k_fieldset',
k_id: 'k_domainTemplateContainer',
k_caption: k_tr('Domain template', 'userEditor'),
k_items: kerio.waw.shared.k_DEFINITIONS.k_get('k_userEditorUseTemplateCfg')
},
{
k_type: 'k_display',
k_id: 'k_rootUserNotice',
k_isLabelHidden: true,
k_value: '<b>' + k_tr('This user must have full-access rights for administration at any time. For that reason some values cannot be changed.', 'userEditor') + '</b>',
k_isSecure: true,
k_isHidden: true }
]
};k_membersFormCfg = {
k_objectName: k_objectName,
k_type: 'k_LOCAL_GROUP',
k_isHeader: true
};
k_addressesFormCfg = {
k_items: [
{k_type: 'k_fieldset',
k_caption: k_tr('Automatic login', 'userEditor'),
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Assume that the user works on the following hosts or MAC addresses:', 'userEdit')
},
{
k_type: 'k_checkbox',
k_id: 'k_useHostAddresses',
k_option: k_tr('Specific host IP addresses', 'userEditor'),
k_isLabelHidden: true,

k_onChange: function(k_form, k_element, k_enable) {
k_form.k_dialog.k_enableElements.call(k_form, ['k_hostAddresses', 'k_hostAddressesText'], k_enable);
} },
{
k_id: 'k_hostAddresses',
k_isDisabled: true,
k_indent: 1,
k_isLabelHidden: true,
k_maxLength: 511,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddressList',
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4List.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars,
k_onBlur: function(k_form) {
var
k_dialog = k_form.k_dialog;
if (this.k_isDirty() && this.k_isValid()) {
k_dialog.k_isWarningCheckNeed = true;
}
}
},
{
k_type: 'k_display',
k_id: 'k_hostAddressesText',
k_isLabelHidden: true,
k_indent: 1,
k_value: k_tr('Use semicolons (;) to separate individual entries', 'userEdit'),
k_isDisabled: true
},
{
k_type: 'k_checkbox',
k_id: 'k_useAddressGroup',
k_option: k_tr('IP address group', 'userEdit'),
k_isLabelHidden: true,

k_onChange: function(k_form, k_element, k_enable) {
k_form.k_dialog.k_enableElements.call(k_form, 'k_groupSelect', k_enable);
} },
{
k_type: 'k_definitionSelect',
k_id: 'k_groupSelect',
k_width: '100%',
k_isLabelHidden: true,
k_definitionType: 'k_ipAddress',
k_indent: 1,
k_showApplyReset: true,
k_allowFiltering: true,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_isDisabled: true,
k_localData: [{
k_id: kerio.waw.shared.k_CONSTANTS.k_NONE,
k_name: k_tr('None', 'ipAddressGroupList')
}],
k_onApplyResetHandler: kerio.waw.shared.k_methods.k_definitionApplyResetHandler,
k_onChange: function(k_form) {
var
k_dialog = k_form.k_dialog;
if (this.k_isDirty()) {
k_dialog.k_isWarningCheckNeed = true;
}
}
},
{
k_type: 'k_checkbox',
k_id: 'k_useMacAddresses',
k_option: k_tr('Specific MAC addresses', 'userEditor'),
k_isLabelHidden: true,

k_onChange: function(k_form, k_element, k_enable) {
k_form.k_dialog.k_enableElements.call(k_form, ['k_macAddresses', 'k_macAddressesText'], k_enable);
}
},
{
k_id: 'k_macAddresses',
k_isDisabled: true,
k_indent: 1,
k_isLabelHidden: true,
k_maxLength: 511,
k_validator: { k_allowBlank: false,
k_functionName: 'k_isMacAddressList'
},
k_onBlur: function(k_form) {
var
k_dialog = k_form.k_dialog;
if (this.k_isDirty() && this.k_isValid()) {
k_dialog.k_isWarningCheckNeed = true;
}
}
},
{
k_type: 'k_display',
k_id: 'k_macAddressesText',
k_isLabelHidden: true,
k_indent: 1,
k_value: k_tr('Use semicolons (;) to separate individual entries', 'userEdit'),
k_isDisabled: true
}
]
},{k_type: 'k_fieldset',
k_caption: k_tr('VPN client address', 'userEditor'),
k_items: [
{
k_type: 'k_checkbox',
k_id: 'k_useStaticAddress',
k_option: k_tr('Assign a static IP address to VPN client', 'userEditor'),
k_isLabelHidden: true,

k_onChange: function(k_form, k_element, k_enable) {
k_form.k_setDisabled('k_vpnAddress', !k_enable);
if (k_enable) {
var
k_ip,
k_vpnServer,
k_vpnAddress = k_form.k_getItem('k_vpnAddress');
if ('' === k_vpnAddress.k_getValue()) {
k_vpnServer = kerio.waw.shared.k_data.k_get('k_vpnServer').k_getData();
if (!k_vpnServer[0] || '' === k_vpnServer[0].ip) {
return;
}
k_ip = k_vpnServer[0].ip;
k_ip = k_ip.substring(0, k_ip.lastIndexOf('.') + 1);
k_vpnAddress.k_setValue(k_ip);
k_vpnAddress.k_focus();
}
}
}},
{
k_id: 'k_vpnAddress',
k_isDisabled: true,
k_isLabelHidden: true,
k_indent: 1,
k_width: 200,
k_maxLength: 15,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars,
k_onBlur: function(k_form) {
var
k_dialog = k_form.k_dialog;
if (this.k_isDirty() && this.k_isValid()) {
k_dialog.k_isWarningCheckNeed = true;
}
}
}
]
}]
};k_generalForm     = new k_lib.K_Form(k_localNamespace + 'k_formGeneral'    , k_generalFormCfg);
k_membersForm     = new k_widgets.K_AddMembershipWidget(k_localNamespace + 'members', k_membersFormCfg);
k_rightsForm      = new k_widgets.K_TabRights(k_localNamespace + 'k_rights', { k_isAuditor: k_isAuditor });
k_quotaForm       = new k_widgets.K_TabQuota(k_localNamespace + 'k_quota', { k_isAuditor: k_isAuditor });
k_preferencesForm = new k_widgets.K_TabPreferences(k_localNamespace + 'k_preferences', { k_isAuditor: k_isAuditor });
k_addressesForm   = new k_lib.K_Form(k_localNamespace + 'k_formAddresses'  , k_addressesFormCfg);
k_dialogContentCfg = {
k_items: [
{
k_content: k_generalForm,
k_caption: k_tr('General', 'common'),
k_id: 'k_generalPage'
},
{
k_content: k_membersForm,
k_caption: k_tr('Groups', 'userList'),
k_id: 'k_groupsPage'
},
{
k_content: k_rightsForm,
k_caption: k_tr('Rights', 'common'),
k_id: 'k_rightsPage'
},
{
k_content: k_quotaForm,
k_caption: k_tr('Quota', 'userList'),
k_id: 'k_quotaPage'
},
{
k_content: k_preferencesForm,
k_caption: k_tr('Preferences', 'userList'),
k_id: 'k_preferencesPage'
},
{
k_content: k_addressesForm,
k_caption: k_tr('Addresses', 'userList'),
k_id: 'k_addressesPage'
}
]
};
k_dialogContent = new k_lib.K_TabPage(k_localNamespace + 'k_tabs'    , k_dialogContentCfg);
k_dialogCfg = {
k_width: 500,
k_height: 530,
k_title: (k_isUserAdd)
? k_tr('Add User', 'userEditor')
: (k_isAuditor)
? k_tr('View User', 'userEditor')
: k_tr('Edit User', 'userEditor')
,
k_content: k_dialogContent,
k_buttons: [
{	k_isDefault: true,
k_id: 'k_dialogBtnOK',
k_caption: k_tr('OK', 'common'),
k_isHidden: k_isAuditor,
k_mask: {
k_message: k_tr('Saving…', 'common')
},

k_onClick: function(k_toolbar) {
var
k_dialog = k_toolbar.k_dialog;
k_dialog.k_sendData();
}
},
{	k_isCancel: true,
k_id: 'k_dialogBtnCancel',
k_caption: (k_isAuditor)
? k_tr('Close', 'common')
: k_tr('Cancel', 'common')
}
]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_forms = k_WAW_METHODS.k_extractObjectValues(k_dialogContentCfg.k_items, 'k_content', 'k_widget');
k_dialog.k_addReferences({
k_forms: new kerio.lib.K_FormManager(k_localNamespace + 'k_formManager', k_forms),
k_formIds: k_WAW_METHODS.k_extractObjectValues(k_dialogContentCfg.k_items, 'k_id', 'string')
});
if (k_isAuditor) {
k_dialog.k_forms.k_setReadOnlyAll();
}
this.k_addControllers(k_dialog);
k_dialog.k_addReferences(
{	k_objectName: k_objectName,
k_isAuditor: k_isAuditor,
k_isUserAdd: k_isUserAdd,
k_dialogContent: k_dialogContent,
k_generalForm: k_generalForm,
k_rightsForm: k_rightsForm,
k_addressesForm: k_addressesForm,
k_quotaForm: k_quotaForm,
k_preferencesForm: k_preferencesForm,
k_membersForm: k_membersForm,
k_domainId: '',
k_relatedGrid: {},
k_userEditorUseTemplate: k_WAW_METHODS.k_userEditorUseTemplate,
k_isWarningCheckNeed: false,
k_params: null,
k_isRootUser: false
}
);
k_generalForm.k_addReferences(
{	k_isPasswordEdited: false,
k_passwordConfirmation: k_generalForm.k_getItem('k_passwordConfirmation'),
k_password: k_generalForm.k_getItem('k_password'),
k_userName: k_generalForm.k_getItem('k_userName'),
k_isEnabled: k_generalForm.k_getItem('k_isEnabled'),
k_authTypeValue: k_generalForm.k_getItem('k_authType').k_getValue(),
k_dialog: k_dialog
}
);
k_addressesForm.k_addReferences(
{	k_groupSelect: k_addressesForm.k_getItem('k_groupSelect'),
k_hostAddresses: k_addressesForm.k_getItem('k_hostAddresses'),
k_vpnAddress: k_addressesForm.k_getItem('k_vpnAddress'),
k_dialog: k_dialog
}
);
k_quotaForm.k_addReferences(
{	k_dialog: k_dialog
}
);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_domainsDataStore = k_params.k_relatedWidget.k_domainsDataStore;
this.k_params = k_params;
if (!k_domainsDataStore.k_isLoaded()) {
this.k_showMask(kerio.lib.k_tr('Loading…', 'common'));
kerio.waw.shared.k_data.k_registerObserver(
k_domainsDataStore,
this.k_fillData,
this
);
return;
}
this.k_fillData();
};

k_kerioWidget.k_fillData = function() {
var
k_data = this.k_params.k_data,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_LOCAL_USER_DB = k_WAW_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE,
k_relatedGrid = this.k_params.k_relatedWidget,
k_generalForm = this.k_generalForm,
k_addressesForm = this.k_addressesForm,
k_rightsForm = this.k_rightsForm,
k_quotaForm = this.k_quotaForm,
k_preferencesForm = this.k_preferencesForm,
k_isUserAdd = this.k_isUserAdd,
k_membersForm = this.k_membersForm,
k_domainId = kerio.waw.status.k_userList.k_currentDomainId,
k_formatMacAddress = kerio.waw.shared.k_methods.k_formatMacAddress,
k_widgetsData,
k_authType,
k_credentials,
k_formData,
k_passwordChanged,
k_groups,
k_groupIds,
k_i, k_cnt,
k_autoLogin,
k_addressGroup,
k_vpnAddress,
k_addresses,
k_isRootUser,
k_macAddresses,
k_macAddressesEnabled;
this.k_hideMask();
this.k_relatedGrid = k_relatedGrid;
this.k_userEditorUseTemplate(this.k_dialogContent, true); k_generalForm.k_userName.k_markInvalid(false);
this.k_domainId = k_domainId;
k_widgetsData = (k_isUserAdd || k_data.useTemplate) ? k_relatedGrid.k_domainsDataStore.k_getDomainTemplateData(k_domainId) : k_data.data;

k_rightsForm.k_setRightsData(k_widgetsData.rights);
k_quotaForm.k_setQuotaData(k_widgetsData.quota);
k_preferencesForm.k_setPreferencesData(k_widgetsData);
this.k_fillGroupsComboData();
if (k_isUserAdd) {
k_generalForm.k_focus('k_userName');
k_generalForm.k_getItem('k_domainTemplate').k_setValue(1);
k_membersForm.k_startTracing();
return;
}
k_isRootUser = k_LOCAL_USER_DB === k_domainId && 'admin' === k_data.credentials.userName.toLowerCase();
if (kerio.waw.shared.k_methods.k_isLinux() && !this.k_isAuditor) {
k_generalForm.k_setReadOnly(['k_domainTemplateContainer', 'k_isEnabled'], k_isRootUser);
k_generalForm.k_setVisible(['k_rootUserNotice'], k_isRootUser);
this.k_rightsForm.k_setReadOnlyAll(k_isRootUser);
}
this.k_isRootUser = k_isRootUser;

k_authType = k_data.authType;
k_credentials = k_data.credentials;
k_formData = {
k_id: k_data.id,
k_userName: k_credentials.userName,
k_fullName: k_data.fullName,
k_email:  k_data.email,
k_description: k_data.description,
k_authType: k_authType,
k_isEnabled: k_data.localEnabled,
k_domainTemplate: k_data.useTemplate
};
k_generalForm.k_setData(k_formData, true);
k_generalForm.k_userName.k_setDisabled(true);
k_generalForm.k_isEnabled.k_setDisabled(!k_data.adEnabled);
k_generalForm.k_getItem('k_disabledMessage').k_setVisible(!k_data.adEnabled);
k_passwordChanged = k_credentials.passwordChanged;
k_generalForm.k_isPasswordEdited = k_passwordChanged;
k_generalForm.k_passwordConfirmation.k_setDisabled(!k_passwordChanged);
k_groups = k_data.groups;
k_groupIds = [];
k_cnt = k_groups.length;
if (k_cnt > 0) {
for (k_i = 0; k_i < k_cnt; k_i++) {
k_groupIds[k_i] = k_groups[k_i].id;
}
}
k_membersForm.k_setMembers(k_groups, k_domainId);
k_membersForm.k_startTracing();
k_autoLogin = k_data.autoLogin;
k_addressGroup = k_autoLogin.addressGroup;
k_addressesForm.k_groupSelect.k_setValue(k_addressGroup.id || kerio.waw.shared.k_CONSTANTS.k_NONE);
k_vpnAddress = k_data.vpnAddress;
k_addresses = k_autoLogin.addresses;
k_macAddressesEnabled = k_autoLogin.macAddresses.enabled;
k_macAddresses = kerio.lib.k_cloneObject(k_autoLogin.macAddresses.value);
for (k_i = 0, k_cnt = k_macAddresses.length; k_i < k_cnt; k_i++) {
k_macAddresses[k_i] = k_formatMacAddress(k_macAddresses[k_i]);
}
k_formData = {
'k_useHostAddresses': k_addresses.enabled,
'k_hostAddresses': k_addresses.value.join(';'),
'k_useAddressGroup': k_addressGroup.enabled,
'k_useStaticAddress': k_vpnAddress.enabled,
'k_vpnAddress': k_vpnAddress.value,
'k_useMacAddresses': k_macAddressesEnabled,
'k_macAddresses': k_macAddresses.join(';')
};
k_addressesForm.k_setData(k_formData, true);
k_generalForm.k_setReadOnly(['k_localOnlyEditContainer'], (k_domainId !== k_LOCAL_USER_DB));
};
k_kerioWidget.k_fillGroupsComboData = function() {
var
k_dataStore = kerio.waw.shared.k_data.k_get('k_ipAddressGroups'),
k_data,
k_NONE,
k_localData,
k_dataKi,
k_groupSelect,
k_cnt, k_i;
if (!k_dataStore.k_isLoaded()) {
kerio.waw.shared.k_data.k_registerObserver(
k_dataStore,
function() {
this.k_fillGroupsComboData();
},
this
);
return;
}
k_data = k_dataStore.k_getData();
k_NONE = kerio.waw.shared.k_CONSTANTS.k_NONE;
k_localData = [{'k_name': kerio.lib.k_tr('None', 'userEditor'), 'k_id': k_NONE}];
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_dataKi = k_data[k_i];
k_localData.push({
'k_name': k_dataKi.name,
'k_id': k_dataKi.id
});
}
k_groupSelect = this.k_addressesForm.k_groupSelect;
k_groupSelect.k_clearData();
k_groupSelect.k_setData(k_localData);
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_data: ['k_groups'],
k_dialogs: ['selectItems']
});
};
k_kerioWidget.k_sendDataCallback = function(k_response) {
var
k_methods = kerio.waw.shared.k_methods;
if (!k_methods.k_responseIsOk(k_response)) {
k_methods.k_unmaskMainScreen(this);
return;
}
this.k_relatedGrid.k_reloadData();
this.k_hide();
k_methods.k_updateDataStore('k_users', {k_domainId: kerio.waw.status.k_userList.k_currentDomainId});
};

k_kerioWidget.k_enableElements = function(k_ids, k_enable) {
if (!k_ids) {
return;
}
if (Array !== k_ids.constructor) {
k_ids = [k_ids];
}
this.k_setDisabled(k_ids, !k_enable);
};

k_kerioWidget.k_sendData = function() {
var
k_tr = kerio.lib.k_tr,
k_methods = kerio.waw.shared.k_methods,
k_data = {data: {}},
k_dialog = this,
k_domainId = this.k_domainId,
k_isPasswordInvalid = false,
k_generalForm,
k_generalFormData,
k_isEnabledElem,
k_groupIds,
k_preferencesFormData,
k_addressesFormData,
k_useHostAddresses,
k_useAddressGroup,
k_useStaticAddress,
k_hostAddressList,
k_isAddressGroupUsed,
k_useMacAddresses,
k_macAddressList,
k_method,
k_callback,
k_requestCfg,
k_i, k_cnt,
k_alertTitle,
k_alertMsg;

k_generalForm = k_dialog.k_generalForm;
k_generalFormData = k_generalForm.k_getData(true);
if (!k_dialog.k_validateRootPassword()) {
k_isPasswordInvalid = true;
k_alertTitle = k_tr('Password invalid', 'userEditor');
k_alertMsg = k_tr('For technical reasons, the password of the Admin user may contain ASCII characters only.', 'activation');
}
else {
if (!k_dialog.k_validatePassword()) {
k_isPasswordInvalid = true;
k_alertTitle = k_tr('Password mismatch', 'common');
k_alertMsg = k_tr('Password and password confirmation do not match.', 'userEditor');
}
}
if (k_isPasswordInvalid) {
kerio.lib.k_alert({
k_title: k_alertTitle,
k_msg: k_alertMsg
});
k_dialog.k_dialogContent.k_setActiveTab('k_generalPage');
k_generalForm.k_focus('k_password');
kerio.waw.shared.k_methods.k_unmaskMainScreen(k_dialog);
return;
}
k_generalForm.k_setDisabled(['k_userName'], false);
k_generalFormData.k_userName = k_generalForm.k_userName.k_getValue();
k_data.credentials = {
'userName': k_generalFormData.k_userName,
'password': k_generalFormData.k_password,
'passwordChanged': k_generalForm.k_isPasswordEdited
};
k_data.fullName = k_generalFormData.k_fullName;
k_data.description = k_generalFormData.k_description;
k_data.email = k_generalFormData.k_email;
k_data.authType = k_generalFormData.k_authType;
k_data.useTemplate = (k_generalFormData.k_domainTemplate === 1 ? true : false);
k_isEnabledElem = k_generalForm.k_isEnabled;
k_data.adEnabled = true;
k_data.localEnabled = k_generalFormData.k_isEnabled;
if (k_isEnabledElem.k_isDisabled()) {
k_data.adEnabled = false;
k_isEnabledElem.k_setDisabled(false);
k_data.localEnabled = k_isEnabledElem.k_getValue();
}
k_groupIds = this.k_membersForm.k_getMemberIds();
k_data.groups = [];
for (k_i = 0, k_cnt = k_groupIds.length; k_i < k_cnt; k_i++) {
k_data.groups[k_i] = {
id: k_groupIds[k_i]
};
}
k_data.data.rights = k_dialog.k_rightsForm.k_getRightsData();
k_data.data.quota = k_dialog.k_quotaForm.k_getQuotaData();
k_preferencesFormData = k_dialog.k_preferencesForm.k_getPreferencesData();
k_data.data.wwwFilter = k_preferencesFormData.wwwFilter;
k_data.data.language = k_preferencesFormData.language;
k_addressesFormData = k_dialog.k_addressesForm.k_getData(true);
k_useHostAddresses = k_addressesFormData.k_useHostAddresses;
k_useAddressGroup = k_addressesFormData.k_useAddressGroup;
k_useStaticAddress = k_addressesFormData.k_useStaticAddress;
k_useMacAddresses = k_addressesFormData.k_useMacAddresses;
k_hostAddressList = (k_useHostAddresses ? k_methods.k_parseIpAddresses(k_addressesFormData.k_hostAddresses) : ['']);
k_macAddressList = (k_useMacAddresses ? k_methods.k_parseMacAddresses(k_addressesFormData.k_macAddresses) : ['']);
k_isAddressGroupUsed = (k_useAddressGroup && k_addressesFormData.k_groupSelect !== kerio.waw.shared.k_CONSTANTS.k_NONE);
k_data.autoLogin = {
addresses: {
enabled: k_useHostAddresses,
value: k_hostAddressList
},
addressGroup: {
enabled: k_isAddressGroupUsed,
id: (k_isAddressGroupUsed ? k_addressesFormData.k_groupSelect : '')
},
macAddresses: {
enabled: k_useMacAddresses,
value: k_macAddressList
}
};
k_data.vpnAddress = {
enabled: k_useStaticAddress,
value: (k_useStaticAddress ? k_addressesFormData.k_vpnAddress : '')
};
k_callback = k_dialog.k_sendDataCallback;
if (k_dialog.k_isWarningCheckNeed) {
k_method = 'checkWarnings';
k_data.id = k_generalFormData.k_id;
k_data = {
user: k_data
};
k_callback = k_dialog.k_checkWarningsCallback;
}
else if (k_dialog.k_isUserAdd) {
k_method = 'create';
k_data = {
users: [k_data],
domainId: k_domainId
};
}
else {
k_method = 'set';
k_data = {
userIds: [k_generalFormData.k_id],
details: k_data,
domainId: k_domainId
};
}
k_requestCfg = {
k_method: 'post',
k_jsonRpc: {
method: 'Users.' + k_method,
params: k_data
},
k_scope: this,
k_callback: k_callback
};
if (k_dialog.k_isWarningCheckNeed) {
this.k_checkWarnings(k_requestCfg);
}
else {
kerio.waw.requests.k_send(k_requestCfg);
}
};
k_kerioWidget.k_validatePassword = function() {
var
k_generalForm = this.k_generalForm,
k_passwordElement = k_generalForm.k_password,
k_password = k_passwordElement.k_getValue(),
k_passwordConfirmationElement = k_generalForm.k_passwordConfirmation,
k_passwordConfirmation = k_passwordConfirmationElement.k_getValue(),
k_isValid = true,
k_isPasswordCorrect;
k_isValid = this.k_validateRootPassword();
if (true !== k_isValid) {
return false;
}
if (!k_passwordConfirmationElement.k_isDisabled()) {
k_isPasswordCorrect = (k_password === k_passwordConfirmation);
k_isValid = k_isPasswordCorrect;
if (k_generalForm.k_authTypeValue === kerio.waw.shared.k_CONSTANTS.AuthType.Internal) {
k_passwordConfirmationElement.k_markInvalid(!k_isPasswordCorrect);
} else {
k_passwordConfirmationElement.k_markInvalid(false);
}
}
return k_isValid;
};

k_kerioWidget.k_validateRootPassword = function() {
var
k_generalForm = this.k_generalForm,
k_passwordElement = k_generalForm.k_password,
k_password = k_passwordElement.k_getValue(),
k_isValid;
if (true !== this.k_isRootUser) {
return true;
}
k_isValid = kerio.waw.shared.k_methods.k_validators.k_isAsciiString(k_password);
k_passwordElement.k_markInvalid(!k_isValid);
return k_isValid;
};

k_kerioWidget.k_resetOnClose = function() {
var
k_generalForm = this.k_generalForm,
k_isUserAdd = this.k_isUserAdd;
k_generalForm.k_isPasswordEdited = false;
k_generalForm.k_reset();
this.k_membersForm.k_stopTracing();
this.k_rightsForm.k_reset();
this.k_quotaForm.k_reset();
this.k_preferencesForm.k_reset();
this.k_addressesForm.k_reset();
if (k_isUserAdd) {
this.k_membersForm.k_setMembers();k_generalForm.k_passwordConfirmation.k_setDisabled(true);
}this.k_dialogContent.k_setActiveTab('k_generalPage');
};

k_kerioWidget.k_checkWarnings = function(k_requestCfg) {
this.k_onWarningErrorCallback = this.k_sendData;
kerio.lib.k_ajax.k_request({
k_requestOwner: null, k_jsonRpc: k_requestCfg.k_jsonRpc,
k_onError: kerio.waw.shared.k_methods.k_onUserWarningError,

k_callback: function(k_response) {
if (k_response.k_isOk && 0 === k_response.k_decoded.errors.length) {
this.k_isWarningCheckNeed = false;
this.k_sendData();
}
},
k_scope: this
});
};
}}; 