

kerio.waw.ui.domainsAuthenticationList = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_isLinux = k_shared.k_methods.k_isLinux(),
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_joinDomainCfg,
k_advancedEditorCfg,
k_toolbar, k_toolbarCfg,
k_authenticationForm, k_authenticationFormCfg,
k_unitySignOnForm,
k_adDomainForm, k_adDomainFormCfg,
k_tabPage, k_tabPageCfg,
k_formManager, k_formManagerCfg,
k_guestInterfaceForm, k_guestInterfaceFormCfg,
k_securityOptionsForm, k_securityOptionsFormCfg;
kerio.waw.status.k_domainsStore = new k_shared.k_widgets.K_DomainsStore();

k_joinDomainCfg = {
k_sourceName: 'domainsJoinEditor'
};
k_advancedEditorCfg = {
k_sourceName: 'domainsAdvancedEditor'
};
k_adDomainFormCfg = {
k_isAuditor: k_isAuditor,
k_isDialogLayout: k_lib.k_isIPadCompatible, k_hasAdvancedButton: true,
k_advancedButtonParams: k_advancedEditorCfg,
k_hasMembershipInfo: true,
k_joinDomainParams: k_joinDomainCfg,
k_onPasswordChange: k_shared.k_DEFINITIONS.k_passwordField.k_onChange,
k_onChange: function() {
kerio.adm.k_framework.k_enableApplyReset();
},
k_onDisable: function(k_form) {
return k_form.k_disableDomainsWarning.apply(this, arguments);
}
};
k_adDomainForm = new kerio.adm.k_widgets.K_DomainServices(k_localNamespace + 'k_adDomainForm', k_adDomainFormCfg);

k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function(k_toolbar, k_button) {
var
k_tabPage = k_toolbar.k_relatedWidget;
if (k_tabPage.k_isValid()) {
k_tabPage.k_saveBatchData(k_button.k_isFiredByEvent);
}
else {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
return false;
},

k_onReset: function(k_toolbar, k_button) {
k_toolbar.k_relatedWidget.k_loadBatchData();
}
};
if (!k_isAuditor) {
k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
}

k_authenticationFormCfg = {
k_isReadOnly: k_isAuditor,
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Web authentication', 'domainsAuthenticationList'),
k_isLabelHidden: true,
k_items: [
{
k_id: 'k_authenticationRequired',
k_type: 'k_checkbox',
k_option: k_tr('Always require users to be authenticated when accessing web pages', 'domainsAuthenticationList')
},
{
k_id: 'k_httpProxyRequired',
k_type: 'k_checkbox',
k_option: k_tr('Force non-transparent proxy server authentication', 'domainsAuthenticationList'),

k_onChange: function(k_form, k_element, k_isChecked) {
k_form.k_setDisabled(['k_httpProxyIpEnabledContainer'], !k_isChecked);
k_form.k_setDisabled(['k_httpProxyIpGroup'], !k_isChecked || !k_form.k_getItem('k_httpProxyIpEnabled').k_isChecked());
}
},
{
k_id: 'k_noteBrowserSession',
k_type: 'k_display',
k_indent: 1,
k_value: k_tr('Each browser session will require user authentication. This is useful in Citrix or Terminal Service environments, where multiple users authenticate to the firewall from the same computer.', 'domainsAuthenticationList')
},
{
k_type: 'k_columns',
k_indent: 1,
k_id: 'k_httpProxyIpEnabledContainer',
k_isDisabled: true,
k_items: [
{
k_id: 'k_httpProxyIpEnabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_width: 270,
k_option: k_tr('Apply only to these IP addresses:', 'domainsAuthenticationList'),

k_onChange: function (k_form, k_element, k_isChecked) {
if (!k_element.k_isDisabled()) {
k_form.k_setDisabled(['k_httpProxyIpGroup'], !k_isChecked);
}
}
},
{
k_type: 'k_definitionSelect',
k_id: 'k_httpProxyIpGroup',
k_width: 170,
k_isLabelHidden: true,
k_definitionType: 'k_ipAddress',
k_showApplyReset: true,
k_allowFiltering: true,
k_pageSize: 500,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_isDisabled: true,
k_localData: [{
k_id: kerio.waw.shared.k_CONSTANTS.k_NONE,
k_name: k_tr('Any', 'ipAddressGroupList')
}],
k_onApplyResetHandler: kerio.waw.shared.k_methods.k_definitionApplyResetHandler
}
]
},
{
k_id: 'k_httpProxyAuth',
k_type: 'k_checkbox',
k_option: k_tr('Enable automatic authentication using NTLM', 'domainsAuthenticationList')
}
]
}, {
k_type: 'k_fieldset',
k_caption: k_tr('Automatic logout', 'domainsAuthenticationList'),
k_isLabelHidden: true,
k_items: [
{
k_id: 'k_inactivityTimeoutEnabled',
k_type: 'k_checkbox',
k_option: k_tr('Automatically logout users if they are inactive', 'domainsAuthenticationList'),

k_onChange: function(k_form, k_element, k_isChecked) {
k_form.k_setDisabled(['k_inactivityTimeoutDetails'], !k_isChecked);
}
},
{
k_id: 'k_inactivityTimeoutDetails',
k_type: 'k_columns',
k_indent: 1,
k_isDisabled: true,
k_items: [
{
k_type: 'k_display',
k_value: k_tr('Timeout:', 'domainsAuthenticationList'),
k_width: 75
},
{
k_type: 'k_number',
k_id: 'k_inactivityTimeoutValue',
k_value: 120,
k_minValue: 1,
k_maxValue: 9999,
k_maxLength: 4,
k_isLabelHidden: true,
k_width: 50,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_value: k_tr('minute(s)', 'domainsAuthenticationList')
}
]
}
]
}, {
k_type: 'k_fieldset',
k_caption: k_tr('WiFi Authentication (RADIUS server)', 'domainsAuthenticationList'),
k_labelWidth: 125,
k_items: [
k_shared.k_methods.k_getSslCertificateFields('k_reverseProxy', '', {
k_caption: k_tr('Server certificate:', 'domainsAuthenticationList'),
k_inputsWidth: 295,
k_labelWidth: 125,
k_className: 'paddingBottom',
k_onCertificateChange: function(k_form, k_select, k_value) {
var
k_certficate = k_select.k_listLoader._k_dataStore.k_certificateListMapped[k_value];
if (undefined !== k_certficate) {
k_select.k_listLoader._k_options.k_value = {
id: k_certficate.id,
name: k_certficate.name,
invalid: true !== k_certficate.valid
};
}
k_select.k_markInvalid('' === k_value);
}
}),
{
k_id: 'radius.enabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_isChecked: false,
k_option: k_tr('Enable external access point authentication', 'domainsAuthenticationList'),
k_onChange: function(k_form, k_element, k_isChecked) {
k_form.k_setDisabled(['radius.password.value'], !k_isChecked);
}
},
k_shared.k_DEFINITIONS.k_get('k_passwordField', {
k_id: 'radius.password.value',
k_width: 275,
k_caption: k_tr('RADIUS password:', 'domainsAuthenticationList'),
k_emptyText: k_tr('No secret', 'domainsAuthenticationList'),
k_isDisabled: true,
k_validator: {
k_functionName: 'k_radiusSecretValidator',
k_invalidText: k_tr('The password cannot contain double quote.', 'domainsAuthenticationList')
}
})
]
}
]
}; k_authenticationForm = new k_lib.K_Form(k_localNamespace + 'k_authenticationForm', k_authenticationFormCfg);
k_authenticationForm.k_addReferences({
k_radiusPasswordField: k_authenticationForm.k_getItem('radius.password.value'),
k_radiusCertificateField: k_authenticationForm.k_getItem('k_certificate')
});
k_unitySignOnForm = new kerio.adm.k_widgets.K_KerioDirectory(k_localNamespace + 'k_unitySignOn', {k_isReadOnly: k_isAuditor});
k_guestInterfaceFormCfg = {
k_isReadOnly: k_isAuditor,
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Guest Welcome Page', 'domainsAuthenticationList'),
k_labelWidth: 400,
k_items: [
{
k_type: 'k_display',
k_caption: k_tr('Customize the welcome page for hosts connected to guest interfaces:', 'domainsAuthenticationList')
},
{
k_type: 'k_textArea',
k_id: 'guest.message',
k_isLabelHidden: true,
k_height: 200,
k_width: 600,
k_maxLength: 1023,
k_checkByteLength: true,
k_indent: 1,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_id: 'k_welcomePageText',
k_isLabelHidden: true,
k_indent: 1,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_template: k_tr('You can format the message in HTML and add a custom logo in the %1Web Interface section%2. The result can be seen on %3the welcome page%4.', 'domainsAuthenticationList', {
k_args: [
'<a id="k_changeCustomLogo">', '</a>',
'<a href="{k_url}nonauth/guest.php" target="_blank">', '</a>'
], k_isSecure: true}
),
k_value: {
k_url: k_shared.k_DEFINITIONS.k_CONTROL_URL.k_getWebifaceUrl()
},
k_isSecure: true,
k_onLinkClick: function(k_form, k_item, k_id) {
if ('k_changeCustomLogo' === k_id) {
kerio.waw.status.k_currentScreen.k_gotoNode('advancedOptions', 'k_webForm');
}
}
},
{
k_type: 'k_checkbox',
k_id: 'guest.password.enabled',
k_isLabelHidden: true,
k_option: k_tr('Require users to enter password', 'domainsAuthenticationList'),
k_onChange: function(k_form, k_element, k_isChecked) {
k_form.k_setDisabled(['guest.password.value', 'k_btnGeneratePassword'], !k_isChecked);
}
},
{
k_type: 'k_columns',
k_indent: 1,
k_labelWidth: 90,
k_items: [
{
k_id: 'guest.password.value',
k_caption: k_tr('Password:', 'domainsAuthenticationList'),
k_isDisabled: true,
k_width: 335,
k_value: '',
k_maxLength: 110, k_checkByteLength: true,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_formButton',
k_id: 'k_btnGeneratePassword',
k_caption: k_tr('Generate Password', 'domainsAuthenticationList'),
k_isDisabled: true,
k_mask: false,
k_onClick: function(k_form, k_button, k_event) {
var
k_generatedPassword = k_form.k_generatePassword();
k_form.k_getItem('guest.password.value').k_setValue(k_generatedPassword);
}
}
]
}
]
}
]
};
k_guestInterfaceForm = new k_lib.K_Form(k_localNamespace + 'k_guestInterfaceForm', k_guestInterfaceFormCfg);
k_authenticationForm.k_addReferences({
k_guestInterfaceForm: k_guestInterfaceForm,
k_welcomePageText: k_guestInterfaceForm.k_getItem('k_welcomePageText')
});
k_securityOptionsFormCfg = {
k_isReadOnly: k_isAuditor,
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Login guessing protection', 'domainsAuthenticationList'),
k_isLabelHidden: true,
k_items: [
{
k_id: 'antihammeringCfg.enabled',
k_type: 'k_checkbox',
k_option: k_tr('Block IP addresses suspicious of password guessing attacks', 'domainsAuthenticationList'),
k_onChange: function (k_form, k_element, k_isChecked) {
k_form.k_setDisabled(['antihammeringCfg.whitelistEnabled'], !k_isChecked);
k_form.k_setDisabled(['antihammeringCfg.whitelist'], !k_isChecked || !k_form.k_whitelistEnabled.k_getValue());
}
},
{
k_type: 'k_columns',
k_indent: 1,
k_items: [
{
k_id: 'antihammeringCfg.whitelistEnabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Never block this IP address group:', 'domainsAuthenticationList'),
k_isDisabled: true,
k_width: 270,
k_onChange: function (k_form, k_element, k_isChecked) {
if (!k_element.k_isDisabled()) {
k_form.k_setDisabled(['antihammeringCfg.whitelist'], !k_isChecked);
}
}
},
{
k_type: 'k_definitionSelect',
k_id: 'antihammeringCfg.whitelist',
k_width: 170,
k_isLabelHidden: true,
k_definitionType: 'k_ipAddress',
k_showApplyReset: true,
k_allowFiltering: true,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_isDisabled: true,
k_localData: [{
k_id: kerio.waw.shared.k_CONSTANTS.k_NONE,
k_name: k_tr('None', 'ipAddressGroupList')
}],
k_onApplyResetHandler: kerio.waw.shared.k_methods.k_definitionApplyResetHandler
}
]
},
{
k_id: 'k_blockedIpCount',
k_type: 'k_display',
k_isLabelHidden: true,
k_isSecure: true,
k_isHidden: true,
k_template: '{k_text} <a id="#">{k_unblock}</a>',
k_value: {
k_text: '',
k_unblock: ''
},
k_onLinkClick: function(k_form) {
kerio.waw.requests.k_sendBatch(
k_form.k_unblockRequests,
{
k_scope: k_form,
k_callback: k_form.k_unblockAllCallback
}
);
}
},
{
k_id: 'k_noBlockedIpCount',
k_type: 'k_display',
k_isLabelHidden: true,
k_isHidden: false,
k_value: k_tr('Currently there are no blocked IP addresses.', 'domainsAuthenticationList')
},
{
k_id: 'k_lockedTimeInfo',
k_type: 'k_display',
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_isLabelHidden: true,
k_template: k_tr('Blocking ends after %1 minutes.', 'domainsAuthenticationList', {k_args: ['{k_time}']}),
k_value: {
k_time: 5
}
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('2-Step Verification', 'domainsAuthenticationList'),
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_template: [
k_tr('Applies secondary identity verification to remote access (VPN client connections, Kerio Control Statistics and web administration).', 'domainsAuthenticationList'),
' <a id="learnMore">', kerio.lib.k_tr('Learn more…', 'common'), '</a>'
].join(''),
k_isSecure: true,
k_onLinkClick: function() {
kerio.waw.shared.k_methods.k_openSpecificKbArticle(1693);
}
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_isSecure: true,
k_template: k_tr('Users configure 2-step verification in their %1account settings%2.', 'domainsAuthenticationList', {k_args: ['<a id="accountLink">','</a>'], k_isSecure: true}),
k_onLinkClick: function() {
kerio.lib.k_openWindow(kerio.waw.shared.k_DEFINITIONS.k_CONTROL_URL.k_getWebifaceUrl('myAccount_verification_all'), '_blank');
}
},
{
k_id: 'twoStepVerification.config.required',
k_type: 'k_checkbox',
k_option: k_tr('Require 2-step verification', 'domainsAuthenticationList'),
k_onChange: function (k_form, k_element, k_isChecked) {
k_form.k_setDisabled(['twoStepVerification.config.remoteConfig'], !k_isChecked);
k_form.k_setDisabled(['twoStepVerification.config.ttlgroup'], !k_isChecked);
}
},
{
k_id: 'twoStepVerification.config.remoteConfig',
k_type: 'k_checkbox',
k_isChecked: true,
k_isDisabled: true,
k_indent: 1,
k_option: k_tr('Allow remote configuration (redirect user to their account settings)', 'domainsAuthenticationList')
},
{
k_id: 'twoStepVerification.config.ttlgroup',
k_type: 'k_columns',
k_indent: 1,
k_isDisabled: true,
k_items: [
{
k_type: 'k_display',
k_value: k_tr('2-step verification will expire in:', 'domainsAuthenticationList'),
k_width: 200
},
{
k_type: 'k_number',
k_id: 'twoStepVerification.config.ttl',
k_value: 30,
k_minValue: 0,
k_maxValue: 9999,
k_maxLength: 4,
k_isLabelHidden: true,
k_width: 50,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_value: k_tr('day(s)', 'domainsAuthenticationList')
}
]
}
]
}
]
};
k_securityOptionsForm = new k_lib.K_Form(k_localNamespace + 'k_securityOptionsForm', k_securityOptionsFormCfg);
k_securityOptionsForm.k_addReferences({
k_authenticationForm: k_authenticationForm,
k_antihammeringWhitelist: new kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_ipAddressGroupList',
k_select: 'antihammeringCfg.whitelist',
k_form: k_securityOptionsForm,
k_excludingNoneOption: true
}),
k_unblockRequests: [
{
k_jsonRpc: {
method: 'AntiHammering.unblockAll'
}
},
{
k_jsonRpc: {
method: 'AntiHammering.getBlockedIpCount'
}
}
],
k_getCountRequestNumber: 1,
k_noBlockedAddressText: k_tr('Currently there are no blocked IP addresses.', 'domainsAuthenticationList'),
k_blockedIpCount: k_securityOptionsForm.k_getItem('k_blockedIpCount'),
k_noBlockedIpCount: k_securityOptionsForm.k_getItem('k_noBlockedIpCount'),
k_lockedTimeInfo: k_securityOptionsForm.k_getItem('k_lockedTimeInfo'),
k_whitelistEnabled: k_securityOptionsForm.k_getItem('antihammeringCfg.whitelistEnabled')
});
k_authenticationForm.k_addReferences({
k_securityOptionsForm: k_securityOptionsForm
});
k_tabPageCfg = {
k_className: 'mainList',
k_items: [
{
k_id: 'k_authenticationForm',
k_caption: k_tr('Authentication Options', 'domainsAuthenticationList'),
k_content: k_authenticationForm
},
{
k_id: 'k_securityOptions',
k_caption: k_tr('Security Options', 'domainsAuthenticationList'),
k_content: k_securityOptionsForm
},
{
k_id: 'k_adDomainForm',
k_caption: k_tr('Directory Services', 'domainsAuthenticationList'),
k_content: k_adDomainForm
},
{
k_id: 'k_guestInterface',
k_caption: k_tr('Guest Interfaces', 'domainsAuthenticationList'),
k_content: k_guestInterfaceForm
},
{
k_id: 'k_unitySignOnForm',
k_caption: k_tr('Kerio Unity Sign-On', 'domainsAuthenticationList'),
k_content: k_unitySignOnForm
}
]
};
if (!k_isAuditor) {
k_tabPageCfg.k_toolbars = {
k_bottom: k_toolbar
};
}
k_tabPage = new k_lib.K_TabPage(k_objectName, k_tabPageCfg);
if (!k_isAuditor) {
k_tabPage.k_toolbar = k_toolbar;
}
k_tabPage.k_forms = {
k_authenticationForm: k_authenticationForm,
k_securityOptionsForm: k_securityOptionsForm,
k_adDomainForm: k_adDomainForm,
k_guestInterfaceForm: k_guestInterfaceForm,
k_unitySignOnForm: k_unitySignOnForm
};
k_formManagerCfg = {
k_forms: [k_authenticationForm, k_securityOptionsForm, k_adDomainForm, k_guestInterfaceForm, k_unitySignOnForm],
k_onChange: function() {
kerio.adm.k_framework.k_enableApplyReset();
}
};
k_formManager = new kerio.lib.K_FormManager(k_localNamespace + 'k_formManager', k_formManagerCfg);
k_tabPage.k_addReferences({
k_isAuditor: k_isAuditor,
k_formManager: k_formManager,
k_adDomainForm: k_adDomainForm,
k_unitySignOnForm: k_unitySignOnForm,
k_securityOptionsForm: k_securityOptionsForm
});
k_adDomainForm.k_addReferences({
k_isLinux: k_isLinux,
k_isKusoAvailable: false,
k_tabPage: k_tabPage
});
k_unitySignOnForm.k_addReferences({
k_adDomainForm: k_adDomainForm
});
kerio.waw.status.k_domainsStore.k_adDomainForm = k_adDomainForm;
this.k_addControllers(k_tabPage);
kerio.waw.shared.k_methods.k_addBatchControllers(k_tabPage);
return k_tabPage;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
var
k_isKusoAvailable = false;
this.k_adDomainForm.k_isKusoAvailable = k_isKusoAvailable;
this.k_setKdirVisible(k_isKusoAvailable);
kerio.waw.status.k_currentScreen.k_gotoTab(this, 'k_authenticationForm');
kerio.waw.shared.k_data.k_get('k_ipAddressGroups');
this.k_loadBatchData();
};

k_kerioWidget.k_setKdirVisible = function(k_isVisible) {
this.k_setVisibleTab('k_unitySignOnForm', k_isVisible);
this.k_adDomainForm.k_setKdirVisible(k_isVisible);
};
k_kerioWidget.k_onDeactivate = function() {
kerio.waw.status.k_domainsStore.un('load', this.k_adDomainForm.k_loadCallback, this);
kerio.waw.status.k_domainsStore.un('update', this.k_adDomainForm.k_updateCallback, this);
kerio.waw.status.k_domainsStore.k_cancelConnectionTest();
this.k_adDomainForm.k_cancelConnectionTest();
};


var
k_forms = k_kerioWidget.k_forms,
k_i;
for (k_i in k_forms) {
k_forms[k_i].k_addReferences({k_parent: k_kerioWidget });
}

k_forms.k_authenticationForm.k_getLoadRequests = function(k_allowLoading) {
var
k_groupLoader, k_groupLoaderCfg;
if (false === k_allowLoading) {
return []; }
k_groupLoaderCfg = {
k_list: 'k_ipAddressGroupList',
k_select: this.k_getItem('k_httpProxyIpGroup'),
k_form: this
};
k_groupLoader = new kerio.waw.shared.k_methods.K_ListLoader(k_groupLoaderCfg);
k_groupLoader.k_sendRequest();
this.k_securityOptionsForm.k_antihammeringWhitelist.k_sendRequest();
this.k_groupLoader = k_groupLoader; return [
{
k_method: 'Authentication.get',
k_handler: this.k_applyParams
},
{
k_method: 'AntiHammering.get',
k_handler: this.k_loadAntihammeringCallback
},
{
k_method: 'AntiHammering.getBlockedIpCount',
k_handler: this.k_loadBlockedIpCountCallback
},
{
k_method: 'Authentication.getTotpConfig',
k_handler: this.k_securityOptionsForm.k_load2stepVerification
}
];
};
k_forms.k_authenticationForm.k_loadAntihammeringCallback = function(k_data, k_success) {
var
k_securityOptionsForm = this.k_securityOptionsForm,
k_time = Math.round(k_data.antihammeringCfg.lockedTime / 6) / 10;
k_securityOptionsForm.k_setData(k_data);
k_securityOptionsForm.k_antihammeringWhitelist.k_selectValue(k_data.antihammeringCfg.whitelist, true);
k_securityOptionsForm.k_lockedTimeInfo.k_setValue({k_time: k_time});
};

k_forms.k_authenticationForm.k_loadBlockedIpCountCallback = function(k_data, k_success) {
var
k_securityOptionsForm = this.k_securityOptionsForm,
k_count = k_data.count,
k_isAnyBlocked = 0 !== k_count;
if (k_isAnyBlocked) {
k_securityOptionsForm.k_blockedIpCount.k_setValue({
k_text: kerio.lib.k_tr('Currently there [is|are] %1 blocked IP [address|addresses].','domainsAuthenticationList',{k_args: [k_count], k_pluralityBy: k_count}),
k_unblock: kerio.lib.k_tr('Unblock [it|all]','domainsAuthenticationList',{k_args: [k_count], k_pluralityBy: k_count})
});
}
k_securityOptionsForm.k_setVisible(['k_blockedIpCount'], k_isAnyBlocked);
k_securityOptionsForm.k_setVisible(['k_noBlockedIpCount'], !k_isAnyBlocked);
};

k_forms.k_securityOptionsForm.k_unblockAllCallback = function(k_data, k_success) {
this.k_authenticationForm.k_loadBlockedIpCountCallback(k_data[this.k_getCountRequestNumber], k_success);
};
k_forms.k_securityOptionsForm.k_load2stepVerification = function(k_data, k_success) {
this.k_securityOptionsForm.k_setData({twoStepVerification: k_data});
};

k_forms.k_authenticationForm.k_getSaveRequests = function() {
var
k_saveData = this.k_saveData();
if (false === k_saveData) {
return false;
}
return [
{
k_method: 'Authentication.set',
k_params: k_saveData.k_authentication
},
{
k_method: 'AntiHammering.set',
k_params: k_saveData.k_antiHammering
},
{
k_method: 'Authentication.setTotpConfig',
k_params: k_saveData.twoStepVerification
}
];
};

k_forms.k_authenticationForm.k_applyParams = function(k_params) {
var
k_config = k_params.config,
k_httpProxy = k_config.httpProxyAuth,
k_ipGroup = k_httpProxy.addressGroup,
k_timeout = k_config.inactivityTimeout,
k_data;
this.k_dataStore = k_config;
k_data = {
'k_authenticationRequired': k_config.authenticationRequired,
'k_httpProxyRequired': k_httpProxy.enabled,
'k_httpProxyIpEnabled': k_ipGroup.enabled,
'k_httpProxyIpGroup': k_ipGroup.name || '', 'k_inactivityTimeoutEnabled': k_timeout.enabled,
'k_inactivityTimeoutValue': k_timeout.value,
'k_httpProxyAuth': k_config.ntlmEnabled,
'radius': k_config.radius,
'guest': k_config.guest
};
this.k_reset();
this.k_setData(k_data);
this.k_securityOptionsForm.k_setData(k_data);
this.k_guestInterfaceForm.k_setData(k_data);
this.k_welcomePageText.k_setValue({k_url: kerio.waw.shared.k_DEFINITIONS.k_CONTROL_URL.k_getWebifaceUrl()});
this.k_groupLoader.k_selectValue({ k_id: k_ipGroup.id,
k_name: k_ipGroup.name
});
this.k_radiusPasswordField.k_setAllowBlank(k_config.radius.password.isSet);
kerio.waw.shared.k_methods.k_setSslCertificateFieldsetData(
{
k_form: this,
k_listLoaderId: 'k_certificatesReverseProxy',
k_noneOptionForInvalidCertificate: true
},
k_config.radius.certificate
);
};

k_forms.k_authenticationForm.k_saveData = function() {
var
k_data = this.k_getData(true),
k_radius = {},
k_securityFormData;
if (this.k_groupLoader.k_NONE === k_data.k_httpProxyIpGroup) {
k_data.k_httpProxyIpGroup = "";
k_data.k_httpProxyIpEnabled = false;
}
k_radius = k_data.radius;
if ('' === k_radius.password.value) {
delete k_radius.password;
}
else {
k_radius.password.isSet = true;
}
if (k_radius.enabled && '' === k_data.k_certificate) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Validation warning', 'wlibAlerts'),
k_msg: kerio.lib.k_tr('Highlighted field is required.', 'wlibAlerts')
});
this.k_parentWidget.k_setActiveTab('k_authenticationForm');
this.k_radiusCertificateField._k_select.k_markInvalid(true);
this.k_radiusCertificateField._k_select.k_focus();
return false;
}
k_radius.certificate = {
id: k_data.k_certificate
};
k_securityFormData = this.k_securityOptionsForm.k_getData(true);
k_data.antihammeringCfg = k_securityFormData.antihammeringCfg;
k_data.antihammeringCfg.whitelist = this.k_securityOptionsForm.k_antihammeringWhitelist.k_getValue();
k_data.guest = this.k_guestInterfaceForm.k_getData(true).guest;
return {
k_authentication: {
config: {
authenticationRequired: k_data.k_authenticationRequired,
httpProxyAuth: {
enabled: k_data.k_httpProxyRequired,
addressGroup: {
enabled: k_data.k_httpProxyIpEnabled,
id: k_data.k_httpProxyIpGroup
}
},
inactivityTimeout: {
enabled: k_data.k_inactivityTimeoutEnabled,
value: k_data.k_inactivityTimeoutValue
},
ntlmEnabled: k_data.k_httpProxyAuth,
radius: k_radius,
guest: k_data.guest
}
},
k_antiHammering: {
config: k_data.antihammeringCfg
},
twoStepVerification: k_securityFormData.twoStepVerification
};
};

k_forms.k_adDomainForm.k_getLoadRequests = function(k_allowReloading) {
if (k_allowReloading) {
kerio.waw.status.k_domainsStore.on('load', this.k_loadCallback, this); kerio.waw.status.k_domainsStore.on('update', this.k_updateCallback, this); kerio.waw.status.k_domainsStore.k_load();
kerio.waw.shared.k_DEFINITIONS.k_CONTROL_URL.k_sendRequest();
return [];
}
return [{
k_method: 'Domains.reset'
}];
};

k_forms.k_adDomainForm.k_getSaveRequests = function() {
var
k_unitySignOnForm = this.k_parent.k_unitySignOnForm,
k_password = this.k_getItem('service.password'),
k_data = this.k_getData(),
k_service = k_data.service,
k_lib = kerio.lib,
k_tr = k_lib.k_tr;
if (this.k_isKusoAvailable && k_service && k_service.enabled && this.k_KERIO_DIRECTORY === k_service.type && k_password.k_isDirty()) {
k_unitySignOnForm = this.k_parent.k_unitySignOnForm;
if (!k_unitySignOnForm.k_getData().isEnabled) {
k_unitySignOnForm.k_kusoConfigImport = {
};
k_lib.k_confirm({
k_title: k_tr('Kerio Unity Sign-On activation', 'domainsAuthenticationList'),
k_msg: '<b>' + k_tr('Do you want to activate Kerio Unity Sign-On for this mapping of Kerio Directory?', 'domainsAuthenticationList') + '</b>' +
'<br><br>' +
k_tr('Kerio Unity Sign-On allows users to access all Kerio products through a single authentication point.', 'domainsAuthenticationList'),
k_defaultButton: 'yes',
k_callback: this.k_setKerioUnitySignOn,
k_scope: {
k_data: {
isEnabled: true,
hostName: k_data.service.primaryServer,
userName: k_data.service.userName,
password: k_data.service.password
},
k_unitySignOnForm: k_unitySignOnForm,
k_parent: this.k_parent
}
});
}
}
this.k_saveData(); kerio.waw.status.k_domainsStore.k_save();
return [];
};

k_forms.k_adDomainForm.k_setKerioUnitySignOn = function(k_answer) {
if ('yes' === k_answer) {
this.k_unitySignOnForm.k_applyParams({settings: this.k_data}, false); this.k_parent.k_saveBatchData(true);
}
};

k_forms.k_adDomainForm.k_loadCallback = function() {
var
k_domain = kerio.waw.status.k_domainsStore.k_get('k_primary');
this.k_skipDisableWarning = true;
this.k_isKusoAvailable = false;
this.k_tabPage.k_setKdirVisible(this.k_isKusoAvailable);
this.k_applyParams({
k_data: k_domain,
k_requirePassword: (false === k_domain.service.enabled), k_callback: this.k_saveDataCallback,
k_parentGrid: this, k_isKusoAvailable: this.k_isKusoAvailable
});
delete this.k_skipDisableWarning;
kerio.waw.shared.k_data.k_cache({
k_screen: this.k_parent,
k_dialogs: ['domainsJoinEditor', 'domainsAdvancedEditor']
});
};

k_forms.k_adDomainForm.k_updateCallback = function(k_domainId) {
if (this.k_skipDataUpdate || kerio.waw.status.k_domainsStore.k_isPrimary(k_domainId)) {
this.k_loadCallback();
}
};

k_forms.k_adDomainForm.k_saveDataCallback = function(k_data) {
kerio.waw.status.k_domainsStore.k_set(k_data);
};

k_forms.k_adDomainForm.k_disableDomainsWarning = function(k_form, k_checkbox, k_checked) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_title,
k_info,
k_question;
if (k_checked || k_form.k_skipDisableWarning || (0 === kerio.waw.status.k_domainsStore.k_count())) {
return true;
}
k_title =    k_tr('Disable domain user database', 'domainsAuthenticationList');
k_info =     k_tr('Disabling domain user database will erase all your additionally mapped domains.', 'domainsAuthenticationList');
k_question = k_tr('Are you sure you want to disable domain user database?', 'domainsAuthenticationList');
k_lib.k_confirm(
k_title,
k_info + '<br><br>' + '<b>' + k_question + '</b>',
k_form.k_disableDomainsWarningCallback,
k_form
);
return false;
};

k_forms.k_adDomainForm.k_disableDomainsWarningCallback = function(k_answer) {
if ('yes' === k_answer) {
this.k_skipDisableWarning = true; this.k_setData({
'service.enabled': false });
delete this.k_skipDisableWarning;
}
};

k_forms.k_unitySignOnForm.k_getLoadRequests = function(k_allowLoading) {
if (false === k_allowLoading) {
return []; }
return [
{
k_method: 'UnitySignOn.get',
k_handler: this.k_applyParams
}
];
};

k_forms.k_unitySignOnForm.k_getSaveRequests = function() {
var
k_data = Ext.apply(this._k_dataStore, this.k_getData(true)),
k_passwordField = this.k_getItem('password');
if (!k_passwordField.k_isDirty()) {
delete k_data.password;
}
return [
{
k_method: 'UnitySignOn.set',
k_params: {
settings: k_data
}
}
];
};

k_forms.k_unitySignOnForm.k_applyParams = function(k_params, k_isInitial) {
var
k_config = k_params.settings,
k_adDomainForm = this.k_adDomainForm;
k_adDomainForm.k_isKusoAvailable = false;
k_adDomainForm.k_tabPage.k_setKdirVisible(k_adDomainForm.k_isKusoAvailable);
this._k_dataStore = k_config;
this.k_setData(k_config, false !== k_isInitial);
};

k_forms.k_authenticationForm.k_guestInterfaceForm.k_generatePassword = function() {
var
k_PASSWORD_LENGTH = 6,
k_password = '',
k_i;
for (k_i = 0; k_i < k_PASSWORD_LENGTH; k_i++) {
k_password += this.k_generateChar();
}
return k_password;
};

k_forms.k_authenticationForm.k_guestInterfaceForm.k_generateChar = function() {
var
k_ASCII_CHARS_OFFSET = 'a'.charCodeAt(0) - 10, k_ASCII_SMALL_L = 'l'.charCodeAt(0),
k_CYPHER_SMALL_L = k_ASCII_SMALL_L - k_ASCII_CHARS_OFFSET,
k_NUMBER_OF_CHARS = 'z'.charCodeAt(0) - 'a'.charCodeAt(0) + 10,
k_cypher;
do {
k_cypher = Math.round(Math.random() * k_NUMBER_OF_CHARS);
} while (k_CYPHER_SMALL_L === k_cypher);
if (10 <= k_cypher) {
k_cypher = String.fromCharCode(k_ASCII_CHARS_OFFSET + k_cypher);
}
return k_cypher;
};

} }; 
kerio.waw.shared.k_widgets.K_DomainsStore = function() {
this.k_reset();
this.k_STATUS = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants;
this.k_TYPES = kerio.waw.shared.k_CONSTANTS.DirectoryServiceType;
this.k_JOIN = kerio.waw.shared.k_CONSTANTS.JoinStatus;
this.addEvents({
load: true,
save: true,
update: true,
remove: true,
test: true
});
this.superclass.constructor.call(this);
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_DomainsStore', Ext.util.Observable, {

k_reset: function() {
this._k_mapped = [];
this._k_connection = {};
this._k_index = {};
this._k_removed = [];
this._k_new = [];
this._k_history = [];
},

k_load: function(){
var
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS;
this.k_reset();
kerio.waw.requests.k_sendBatch([
{
k_jsonRpc: {
method: 'Domains.reset'
}
},
{
k_jsonRpc: {
method: 'Domains.get',
params: {
"query": {
"conditions": [ k_shared.k_DEFINITIONS.k_get('k_searchCondition', {
k_fieldName: "id",
k_comparator: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_NotEq,
k_value: k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE
})
],
"orderBy": [{
"columnName": "name",
"direction": k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Asc
}],
"start": 0,
"limit": -1
}
}
},
k_callback: this._k_loadCallback,
k_scope: this
}
],
{
k_requestOwner: null
});
},

_k_loadCallback: function(k_data, k_success) {
if (!k_success) {
kerio.lib.k_alert({
k_icon: 'error',
k_msg: kerio.lib.k_tr('Error when loading domains.', 'domainsAuthenticationList')
});
return;
}
var
k_KERIO_DIRECTORY = this.k_TYPES.k_KERIO_DIRECTORY,
k_adDomainForm = this.k_adDomainForm,
k_mapped = this._k_mapped,
k_index = this._k_index,
k_domains = k_data.list,
k_primary = false, k_isKusoAvailable = false,
k_domain,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_domains.length; k_i < k_cnt; k_i++) {
k_domain = k_domains[k_i];
delete k_domain.service.password; k_index[k_domain.id] = k_domain;
if (k_domain.primary) {
k_index.k_primary = k_domain; k_primary = true;
}
else {
k_mapped.push(k_domain);
}
if (k_KERIO_DIRECTORY === k_domain.service.type) {
k_isKusoAvailable = false;
}
this.k_test(k_domain.id);
}
k_adDomainForm.k_isKusoAvailable = false;
k_adDomainForm.k_tabPage.k_setKdirVisible(k_adDomainForm.k_isKusoAvailable);
if (!k_primary) {
kerio.lib.k_reportError('No primary domain recieved from server', 'K_DomainsStore');
return;
}
this.fireEvent('load');
},
k_save: function() {
var
k_additionalDomains = this._k_mapped,
k_removedDomainsIds = this._k_removed,
k_newDomains = this._k_new,
k_primaryDomain = this._k_index.k_primary,
k_requests = [],
k_changedDomainIds = [],
k_domain,
k_i, k_cnt;
k_requests.push({ k_jsonRpc: {
method: 'Domains.set',
params: {
domainIds: [ k_primaryDomain.id ],
pattern: k_primaryDomain
}
}
});
k_changedDomainIds.push(k_primaryDomain.id);
if (0 < k_removedDomainsIds.length) {
k_requests.push({
k_jsonRpc: {
method: 'Domains.remove',
params: {
domainIds: k_removedDomainsIds
}
}
});
}
k_changedDomainIds = k_changedDomainIds.concat(k_removedDomainsIds);
for (k_i = 0, k_cnt = k_additionalDomains.length; k_i < k_cnt; k_i++) {
k_domain = k_additionalDomains[k_i];
if (this.k_STATUS.kerio_web_StoreStatusModified === k_domain.status) { k_requests.push({
k_jsonRpc: {
method: 'Domains.set',
params: {
domainIds: [k_domain.id],
pattern: k_domain
}
}
});
k_changedDomainIds.push(k_domain.id);
}
}
if (0 < k_newDomains.length) {
k_requests.push({
k_jsonRpc: {
method: 'Domains.create',
params: {
domains: k_newDomains
}
}
});
}
k_requests.push({
k_jsonRpc: {
method: 'Domains.apply'
}
});
kerio.waw.requests.k_sendBatch(k_requests, {
k_callback: this._k_saveCallback,
k_scope: this,
k_requestOwner: null,
k_callbackParams: {
k_changedDomainIds: k_changedDomainIds
}
});
},

_k_saveCallback: function(k_response, k_success, k_params) {
var
k_shared = kerio.waw.shared,
k_sharedData = k_shared.k_data,
k_changedDomainIds = k_params.k_changedDomainIds,
k_paramsOfRemove,
k_i, k_cnt;
this.fireEvent('save', k_success);
k_shared.k_methods.k_updateDataStore('k_domains');
k_sharedData.k_removeStore('k_users');
k_sharedData.k_removeStore('k_groups');
for (k_i = 0, k_cnt = k_changedDomainIds.length; k_i < k_cnt; k_i++) {
k_paramsOfRemove = {k_domainId: k_changedDomainIds[k_i]};
k_sharedData.k_removeStore('k_users', k_paramsOfRemove);
k_sharedData.k_removeStore('k_groups', k_paramsOfRemove);
}
},

k_get: function(k_id) {
return kerio.lib.k_cloneObject(this._k_index[k_id]);
},

k_count: function() {
return this._k_mapped.length + 1;
},

k_getAll: function() {
var
k_output = [],
k_i, k_cnt;
for (k_i = 0, k_cnt = this._k_mapped.length; k_i < k_cnt; k_i++) {
k_output.push(kerio.lib.k_cloneObject(this._k_mapped[k_i]));
} return k_output;
},

k_set: function(k_id, k_data, k_silent) {
var
k_domain;
if (k_id && k_id.id) {
k_data = k_id;
k_id = k_data.id;
}
if (!this._k_index[k_id]) {
return;
}
if (!this.k_isUnique(k_id, k_data)) {
return false;
}
k_domain = this._k_index[k_id];
kerio.waw.shared.k_methods.k_mergeObjects(k_data, k_domain);
if (!this.k_isNew(k_id) && k_data.service && k_data.service.userName && !k_data.service.password) {
delete k_domain.service.password; }
if (!this.k_isNew(k_id)) { k_domain.status = this.k_STATUS.kerio_web_StoreStatusModified;
}
this.k_test(k_id);
if (true !== k_silent) {
this.fireEvent('update', k_domain.id, this.k_get(k_id)); }
return true;
},

k_create: function(k_data) {
var
k_newDomain;
if (!this.k_isUnique(undefined, k_data)) { return false;
}
k_data = k_data || {};
k_data.service = k_data.service || {};
k_data.advanced = k_data.advanced || {};
k_newDomain = {
id: k_data.service.domainName,
status: this.k_STATUS.kerio_web_StoreStatusNew,
adAutoImport: k_data.adAutoImport || false,
ntAuthMode: k_data.ntAuthMode || false,
authenticationOnly: k_data.authenticationOnly || false,
description: k_data.description || '',
service: {
enabled: k_data.service.enabled || true,
domainName: k_data.service.domainName,
type: k_data.service.type || this.k_TYPES.WindowsActiveDirectory,
userName: k_data.service.userName || '',
password: k_data.service.password || '',
useSpecificServers: k_data.service.useSpecificServers || false,
primaryServer: k_data.service.primaryServer || '',
secondaryServer: k_data.service.secondaryServer || ''
},
advanced: {
ldapSecure: k_data.advanced.ldapSecure,
kerberosRealm: (k_data.advanced.kerberosRealm)
? {
enabled: k_data.advanced.kerberosRealm.enabled || false,
value: k_data.advanced.kerberosRealm.value || ''
}
: { enabled: false, value: ''},
ldapSearchSuffix: (k_data.advanced.ldapSearchSuffix)
? {
enabled: k_data.advanced.ldapSearchSuffix.enabled || false,
value: k_data.advanced.ldapSearchSuffix.value || ''
}
: { enabled: false, value: ''}
}
};
this._k_mapped.push(k_newDomain);
this._k_index[k_newDomain.id] = k_newDomain;
this._k_new.push(k_newDomain);
this.k_test(k_newDomain.id);
this.fireEvent('update', k_newDomain.id, k_newDomain);
return k_newDomain.id;
},

k_remove: function(k_ids) {
var
k_i, k_cnt,
k_id,
k_domain;
if (Array !== k_ids.constructor) {
k_ids = [ k_ids ];
}
for (k_i = 0, k_cnt = k_ids.length; k_i < k_cnt; k_i++) {
k_id = k_ids[k_i];
if ('k_primary' === k_id || this._k_index.k_primary.id === k_id) {
continue; }
if (this._k_index[k_id]) {
this._k_removed.push(k_id);
k_domain = this._k_index[k_id];
delete this._k_index[k_id];
this._k_mapped.remove(k_domain);
if ('object' === typeof this._k_connection[k_domain.id]) {
kerio.lib.k_ajax.k_abort(this._k_connection[k_domain.id]);
}
this.fireEvent('remove', k_id, k_domain);
}
}
this.fireEvent('update');
},

k_push: function() {
this._k_history.push({
k_mapped:  kerio.lib.k_cloneObject(this._k_mapped),
k_primary: kerio.lib.k_cloneObject(this._k_index.k_primary),
k_removed: kerio.lib.k_cloneObject(this._k_removed)
});
},

k_pop: function() {
var
k_index = {},
k_backup,
k_i, k_cnt,
k_domain;
if (0 >= this._k_history.length) {
return false;
}
k_backup = this._k_history.pop();
for (k_i = 0, k_cnt = k_backup.k_mapped.length; k_i < k_cnt; k_i++) {
k_domain = k_backup.k_mapped[k_i];
k_index[k_domain.id] = k_domain;
}
this._k_mapped = k_backup.k_mapped;
this._k_index  = k_index;
this._k_index.k_primary = k_backup.k_primary;
this._k_index[k_backup.k_primary.id] = k_backup.k_primary;
this._k_removed = k_backup.k_removed;
this.fireEvent('update');
return true;
},

k_test: function(k_id) {
var
k_directory = this.k_get(k_id),
k_hostnameList,
k_service;
if (!k_directory || !k_directory.service.enabled                 || (this.k_isNew(k_id) && !k_directory.service.password)) { return;
}
if ('object' === typeof this._k_connection[k_id]) { kerio.lib.k_ajax.k_abort(this._k_connection[k_id]);
}
k_service = k_directory.service;
k_hostnameList = [];
if (this.k_TYPES.WindowsActiveDirectory === k_service.type && false === k_service.useSpecificServers) {
k_hostnameList = [''];
}
else {
if (k_service.primaryServer) {
k_hostnameList.push(k_service.primaryServer);
}
if (this.k_TYPES.k_KERIO_DIRECTORY !== k_service.type && k_service.secondaryServer) {
k_hostnameList.push(k_service.secondaryServer);
}
}
this._k_connection[k_id] = kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Domains.testDomainController',
params: {
hostnames: k_hostnameList,
directory: {
id: k_directory.id,
service: k_service,
advanced: k_directory.advanced
}
}
},
k_requestOwner: null,
k_onError: function() {
return true;
},
k_callback: this._k_testCallback,
k_callbackParams: k_id,
k_scope: this
});
},

k_cancelConnectionTest: function() {
var
k_connections = this._k_connection,
k_i;
for (k_i in k_connections) {
if ('boolean' !== typeof k_connections[k_i]) { kerio.lib.k_ajax.k_abort(k_connections[k_i]);
}
}
},

_k_testCallback: function(k_response, k_success, k_id) {
if (k_success && k_response.k_isOk) {
this._k_connection[k_id] = (!k_response.k_decoded.errors || 0 === k_response.k_decoded.errors.length);
this.fireEvent('test', k_id, this._k_connection[k_id]);
return;
}
this._k_connection[k_id] = false;
this.fireEvent('test', k_id, false);
},

k_isConnected: function(k_id) {
var
k_connected = this._k_connection[k_id];
if ('boolean' === typeof k_connected) {
return k_connected;
} },

k_isType: function(k_id, k_types, k_type) {
var
k_value = k_type || this._k_index[k_id].service.type,
k_i, k_cnt;
if (!k_types) {
return false;
}
if (Array !== k_types.constructor) {
k_types = [ k_types ];
}
for (k_i = 0, k_cnt = k_types.length; k_i < k_cnt; k_i++) {
if (k_types[k_i] === k_value ) {
return true;
}
}
return false;
},

k_isUnique: function(k_id, k_data) {
if (!k_data || !k_data.service || !k_data.service.domainName) {
return true;
}
var
k_tr = kerio.lib.k_tr,
k_domain = this._k_index[k_id],
k_mapped = this._k_mapped,
k_primary = this._k_index.k_primary,
k_newName = k_data.service.domainName.toLowerCase(),
k_i, k_cnt;
if (k_domain && k_newName === k_domain.service.domainName.toLowerCase()) {
return true;
}
if (k_newName === k_primary.service.domainName.toLowerCase()) {
kerio.lib.k_alert(
k_tr('Validation Warning', 'common'),
k_tr('You cannot map domain %1 because it\'s your primary domain.', 'domainsAdDomainEditor', {k_args: [k_newName]})
);
return false; }
for (k_i = 0, k_cnt = k_mapped.length; k_i < k_cnt; k_i++) {
if (k_id !== k_mapped[k_i].id && k_newName === k_mapped[k_i].service.domainName) {
kerio.lib.k_alert(
k_tr('Validation Warning', 'common'),
k_tr('You cannot map domain %1 because it\'s already mapped.', 'domainsAdDomainEditor', {k_args: [k_newName]})
);
return false; }
}
return true; },

k_isPrimary: function(k_id) {
return (k_id === 'k_primary' || k_id === this._k_index.k_primary.id);
},

k_isNew: function(k_id) {
var
k_domain = this._k_index[k_id];
if (k_domain) {
return (this.k_STATUS.kerio_web_StoreStatusNew === k_domain.status);
}
}
}); 