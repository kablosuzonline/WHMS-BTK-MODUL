
kerio.waw.ui.domainsJoinEditor = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isJoin = ('leaveDomain' !== k_objectName),
k_btnCancelCfg,
k_btnCloseCfg,
k_dialogHeight,
k_resultFormCfg,
k_step0Form,
k_step0FormCfg,
k_step1Form,
k_step1FormCfg,
k_step2Form,
k_step2FormCfg,
k_step3Form,
k_dialogContent,
k_dialogContentCfg,
k_dialog,
k_dialogCfg,
k_dialogButtons,
k_pageNames;
k_step1FormCfg = {
k_items: [
{ k_type: 'k_fieldset',
k_caption: (k_isJoin)
? k_tr('Domain account with rights to join the domain', 'domainsJoinEditor')
: k_tr('Domain account with rights to remove this computer from the domain', 'domainsJoinEditor'),
k_className: 'removeFieldsetMargin',
k_items: [
kerio.waw.shared.k_DEFINITIONS.k_get('k_userNameField', {
k_id: 'k_userName',
k_width: 'auto',
k_validator: {
k_functionName: 'k_wlibUserNameDomain'
}
}),
kerio.waw.shared.k_DEFINITIONS.k_get('k_passwordField', {
k_id: 'k_password',
k_width: 'auto',
k_emptyText: '',
k_validator: {
k_allowBlank: false
}
})
]
}
]
};
k_resultFormCfg = {
k_items: [
{ 	k_type: 'k_display',
k_id: 'k_actionResult',
k_isLabelHidden: true,
k_isSecure: true,
k_value: ''
}
]
};
k_btnCancelCfg = {	k_id: 'k_btnCancel',
k_isCancel: true,
k_caption: k_tr('Cancel', 'common')
};
k_btnCloseCfg = {	k_id: 'k_btnClose',
k_isCancel: true,
k_caption: k_tr('Close', 'common'),
k_isHidden: true,

k_onClick: function(k_toolbar) {
k_toolbar.k_dialog.k_hide();
k_toolbar.k_dialog.k_parent.k_parent.k_loadBatchData();
}
};

if (k_isJoin) {
k_dialogHeight = 340;
k_step1FormCfg.k_items.unshift({ k_type: 'k_fieldset',
k_caption: k_tr('Domain information', 'domainsJoinEditor'),
k_labelWidth: 200,
k_items: [
{
k_type: 'k_display',
k_value: k_tr('Join the Microsoft® Active Directory® domain', 'domainsJoinEditor')
},
{
k_id: 'k_domainName',
k_caption: k_tr('Domain name:', 'domainServices'),
k_validator: {
k_functionName: 'k_wlibDomainName',
k_allowBlank: false
}
},
{
k_id: 'k_hostName',
k_caption: k_tr('%1 server name:', 'domainsJoinEditor', { k_args: [kerio.waw.shared.k_DEFINITIONS.k_PRODUCT_NAME ]}),
k_value: '',
k_maxLength: 52,
k_checkByteLength: true,
k_validator: {
k_functionName: 'k_isHostIp',
k_allowBlank: false
}
},
{
k_type: 'k_container',
k_height: 10
},
{
k_type: 'k_checkbox',
k_id: 'k_ldapSecure',
k_isLabelHidden: true,
k_option: k_tr('Use encrypted connection', 'wlibDomainServices')
}
]
});
k_step0FormCfg = {
k_items: [
{
k_type: 'k_display',
k_value: k_tr('Mapping of user accounts is currently active.', 'domainsJoinEditor')
},
{
k_type: 'k_display',
k_value: k_tr('If you continue, user accounts will be mapped from the joined Microsoft® Active Directory® domain instead.', 'domainsJoinEditor')
},
{
k_type: 'k_container',
k_height: 120
},
{
k_type: 'k_display',
k_id: 'k_continue',
k_template: '<a>' + k_tr('Yes, overwrite the current mapping of user accounts.', 'domainsJoinEditor') + '</a>',

k_onLinkClick: function(k_page) {
var
k_wizard = k_page.k_parentWidget,
k_dialog = k_wizard.k_parentWidget;
k_dialog.k_toolbar.k_showItem('k_btnNext');
k_wizard.k_setActiveTab('k_step1Page');
}
}
]
};
k_step2FormCfg = {
k_items: [
{	k_type: 'k_fieldset',
k_caption: k_tr('Domain controller IP address', 'domainsJoinEditor'),
k_items: [
{ 	k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Kerio Control is unable to locate the domain controller for the specified domain. Please specify the IP address of the domain controller:', 'domainsJoinEditor')
},
{	k_caption: k_tr('IP address:', 'domainsJoinEditor'),
k_id: 'k_server',
k_width: 120,
k_maxLength: 15,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
}
]
}
]
};
k_step0Form = new k_lib.K_Form(k_localNamespace + 'k_step0Form', k_step0FormCfg);
k_step1Form = new k_lib.K_Form(k_localNamespace + 'k_step1Form', k_step1FormCfg);
k_step2Form = new k_lib.K_Form(k_localNamespace + 'k_step2Form', k_step2FormCfg);
k_step3Form = new k_lib.K_Form(k_localNamespace + 'k_step3Form', k_resultFormCfg);
k_dialogContentCfg = {
k_showPageHeader: false,
k_items: [
{
k_content: k_step0Form,
k_id: 'k_step0Page'
},
{
k_content: k_step1Form,
k_id: 'k_step1Page'
},
{
k_content: k_step2Form,
k_id: 'k_step2Page'
},
{
k_content: k_step3Form,
k_id: 'k_step3Page'
}
]
};
k_pageNames = {
k_INCOMPATIBLE_PAGE: 0,
k_START_PAGE: 1,
k_DOMAIN_CONTROLLER_PAGE: 2,
k_END_PAGE: 3
};
k_dialogButtons = [
{
k_id: 'k_btnPrev',
k_caption: k_tr('< Back', 'common'),
k_isHidden: true,

k_onClick: function() {
var
k_dialog = this.k_dialog,
k_activePageIndex = k_dialog.k_wizard.k_getActiveTabIndex(),
k_toolbar = k_dialog.k_toolbar;
k_toolbar.k_showItem('k_btnCancel');
k_toolbar.k_hideItem('k_btnPrev');
if (k_dialog.k_pageNames.k_END_PAGE === k_activePageIndex) {
k_toolbar.k_hideItem('k_btnClose');
k_toolbar.k_showItem('k_btnNext');
if (k_dialog.k_isServerNeeded) {
k_dialog.k_wizard.k_setActiveTab('k_step2Page');
k_toolbar.k_showItem('k_btnPrev');
return;
}
}
k_dialog.k_wizard.k_setActiveTab('k_step1Page');
}
},
{
k_isDefault: true,
k_validateBeforeClick: false,
k_id: 'k_btnNext',
k_caption: k_tr('Next >', 'common'),

k_onClick: function() {
var
k_dialog = this.k_dialog,
k_activePageIndex = k_dialog.k_wizard.k_getActiveTabIndex();
switch (k_activePageIndex) {
case k_dialog.k_pageNames.k_START_PAGE:
if (k_dialog.k_step1Form.k_isValid()) {
k_dialog.k_domainName = k_dialog.k_step1Form.k_getItem('k_domainName').k_getValue();
k_dialog.k_isJoinServerNeeded.call(k_dialog);
return;
}
break;
case k_dialog.k_pageNames.k_DOMAIN_CONTROLLER_PAGE:
if (k_dialog.k_step2Form.k_isValid()) {
k_dialog.k_joinDomain.call(k_dialog);
return;
}
break;
}
}
},
k_btnCloseCfg,
k_btnCancelCfg
];
} else {

k_step1Form = new k_lib.K_Form(k_localNamespace + 'k_step1Form', k_step1FormCfg);
k_step2Form = new k_lib.K_Form(k_localNamespace + 'k_step2Form', k_resultFormCfg);
k_dialogContentCfg = {
k_showPageHeader: false,
k_items: [
{
k_content: k_step1Form,
k_id: 'k_step1Page'
},
{
k_content: k_step2Form,
k_id: 'k_step2Page'
}
]
};
k_pageNames = {
k_START_PAGE: 0,
k_END_PAGE: 1
};
k_dialogHeight = 200;
k_dialogButtons = [
{
k_isDefault: true,
k_id: 'k_btnNext',
k_caption: k_tr('Next >', 'common'),

k_onClick: function() {
if (this.k_dialog.k_step1Form.k_isValid()) {
this.k_dialog.k_leaveDomain();
return;
}
}
},
k_btnCloseCfg,
k_btnCancelCfg
];
}
k_step1Form.k_patchAutoFill();
k_dialogContent = new k_lib.K_Wizard(k_localNamespace + 'k_wizard', k_dialogContentCfg);
k_dialogCfg = {
k_width: 500,
k_height: k_dialogHeight,
k_isResizable: true,
k_content: k_dialogContent,
k_defaultItem: (k_isJoin) ? k_step1Form.k_getItem('k_hostName').k_id : k_step1Form.k_getItem('k_userName').k_id,
k_title: (k_isJoin)
? k_tr('Join Domain', 'domainsJoinEditor')
: k_tr('Leave Domain', 'domainsJoinEditor'),
k_buttons: k_dialogButtons
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_isJoin: k_isJoin,
k_userNameElement: k_step1Form.k_getItem('k_userName'),
k_wizard: k_dialogContent,
k_step1Form: k_step1Form,
k_step2Form: k_step2Form,
k_step3Form: k_step3Form,
k_isServerNeeded: false,
k_adNotResponding: k_tr('The server is not responding. There may be a problem in communication with Microsoft® Active Directory®.', 'domainsJoinEditor'),
k_domainName: undefined,
k_parent: {},
k_pageNames: k_pageNames
});
k_step1Form.k_addReferences({
k_dialog: k_dialog
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {

var
k_data = k_params.k_data,
k_closureData = k_data;
this.k_parent = k_params.k_parentForm;
this.k_callback = k_params.k_callback;
this.k_domainName = k_data.service.domainName;
if (this.k_isJoin && k_data.service.enabled) {
this.k_toolbar.k_hideItem('k_btnNext'); this.k_wizard.k_setActiveTab('k_step0Page');
}
else {
this.k_wizard.k_setActiveTab('k_step1Page');}
this.k_step1Form.k_setData({ k_domainName: k_data.service.domainName });
kerio.waw.requests.k_sendBatch({
k_jsonRpc: {
method: 'SystemConfig.get'
},
k_scope: this,
k_callback: function(k_response, k_success, k_params) {
if (k_success) {
this.k_step1Form.k_setData({
k_hostName: k_response.config.hostname
});
}
this.k_step1Form.k_setData({
k_userName: k_closureData.service.userName,
k_password: '' });
}
});
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };

k_kerioWidget.k_isJoinServerNeeded = function() {
this.k_showMask(kerio.lib.k_tr('Connecting to the domain…', 'domainsJoinEditor'));
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Authentication.isJoinServerNeeded',
params: { domainName: this.k_domainName }
},
k_callback: this.k_isJoinServerNeededCallback,
k_scope: this
});
};

k_kerioWidget.k_isJoinServerNeededCallback = function(k_response) {
if (!k_response.k_isOk) {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
return;
}
var
k_decoded = k_response.k_decoded,
k_toolbar = this.k_toolbar;
if (k_decoded.needServer) {
this.k_wizard.k_setActiveTab('k_step2Page');
k_toolbar.k_enableItem('k_btnNext');
k_toolbar.k_showItem('k_btnPrev');
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
} else {
this.k_joinDomain();
}
this.k_isServerNeeded = k_decoded.needServer;
};

k_kerioWidget.k_joinDomain = function() {
var
k_activePageIndex = this.k_wizard.k_getActiveTabIndex(),
k_step1Data = this.k_step1Form.k_getData(),
k_joinData = {
hostName: k_step1Data.k_hostName,
domainName: this.k_domainName,
ldapSecure: k_step1Data.k_ldapSecure,
credentials: {
userName: k_step1Data.k_userName,
password: k_step1Data.k_password,
passwordChanged: true
}
};
this.k_showMask(kerio.lib.k_tr('Connecting to the domain…', 'domainsJoinEditor'));
if (this.k_pageNames.k_DOMAIN_CONTROLLER_PAGE === k_activePageIndex) {
k_joinData.server = this.k_step2Form.k_getItem('k_server').k_getValue();
} else {
k_joinData.server = '';
}
kerio.waw.requests.k_sendBatch([
{
k_jsonRpc: {
method: 'Authentication.join',
params: k_joinData
},
k_callbackParams: {
k_timeout: 300000 }
},
{
k_jsonRpc: {
method: 'Authentication.getJoinStatus'
}
}
],
{
k_callback: this.k_joinDomainCallback,
k_scope: this,
k_onError: kerio.waw.shared.k_methods.k_ignoreErrors
});
};

k_kerioWidget.k_joinDomainCallback = function(k_response) {
var
k_AUTHENTICATION_JOIN = 0,
k_AUTHENTICATION_GET_STATUS = 1,
k_actionResultElement = this.k_step3Form.k_getItem('k_actionResult'),
k_toolbar = this.k_toolbar,
k_joinResponse,
k_message;
if (kerio.waw.shared.k_CONSTANTS.JoinStatus.JoinStatusConnected === (k_response[k_AUTHENTICATION_GET_STATUS]).status) {
k_toolbar.k_hideItem('k_btnPrev');
k_toolbar.k_hideItem('k_btnNext');
k_toolbar.k_hideItem('k_btnCancel');
k_toolbar.k_showItem('k_btnClose');
k_message = '<b>' + kerio.lib.k_htmlEncode(this.k_domainName) + '</b>';
k_actionResultElement.k_setValue(
kerio.lib.k_tr('Success. The firewall is a member of the %1 domain now.',
'domainsJoinEditor',
{k_args: [k_message], k_isSecure: true})
);
}
else { if (kerio.waw.shared.k_CONSTANTS.JoinStatus.JoinStatusError === k_response[k_AUTHENTICATION_GET_STATUS].status
&& kerio.waw.shared.k_CONSTANTS.JoinStatus.JoinStatusConnected === k_response[k_AUTHENTICATION_JOIN].status) {
k_message = kerio.lib.k_tr('Unable to get join status, although Domain.join was successful.', 'domainsJoinEditor');
}
else {
k_joinResponse = k_response[k_AUTHENTICATION_JOIN];
if (k_joinResponse.message && 'string' === typeof k_joinResponse.message.message) {
k_joinResponse = k_joinResponse.message;
}
if (k_joinResponse.message) {
k_message = kerio.waw.shared.k_methods.k_translateErrorMessage(k_joinResponse);
}
else {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
return;
}
}
k_toolbar.k_hideItem('k_btnNext');
k_toolbar.k_hideItem('k_btnClose');
k_toolbar.k_showItem('k_btnCancel');
k_toolbar.k_showItem('k_btnPrev');
k_actionResultElement.k_setValue(k_message);
}
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
this.k_wizard.k_setActiveTab('k_step3Page');
kerio.waw.shared.k_methods.k_updateDataStore('k_domains');
};

k_kerioWidget.k_leaveDomain = function() {
var
k_step1Data = this.k_step1Form.k_getData(),
k_leaveData = {credentials: {
userName: k_step1Data.k_userName,
password: k_step1Data.k_password,
passwordChanged: true
}
};
this.k_showMask(kerio.lib.k_tr('Disconnecting from the domain…', 'domainsJoinEditor'));
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Authentication.leave',
params: k_leaveData
},
k_callback: this.k_leaveDomainCallback,
k_callbackParams: {
k_timeout: 300000 },
k_scope: this,
k_errorMessages: {
k_connectionTimeout: this.k_adNotResponding
},
k_onError: kerio.waw.shared.k_methods.k_ignoreErrors
});
};

k_kerioWidget.k_leaveDomainCallback = function(k_response) {
var
k_actionResultElement = this.k_step2Form.k_getItem('k_actionResult'),
k_toolbar = this.k_toolbar,
k_decoded = k_response.k_decoded,
k_message;
k_toolbar.k_hideItem('k_btnNext');
k_toolbar.k_hideItem('k_btnCancel');
k_toolbar.k_showItem('k_btnClose');
if (k_response.k_isOk && kerio.waw.shared.k_CONSTANTS.JoinStatus.JoinStatusDisconnected === k_response.k_decoded.status) {
k_actionResultElement.k_setValue(
kerio.lib.k_tr('Success. The firewall is not member of any domain now.', 'domainsJoinEditor')
);
} else {
if (k_decoded.message && 'string' === typeof k_decoded.message.message) {
k_decoded = k_decoded.message;
}
if (k_decoded.message) {
k_message = '<br><b>' + kerio.lib.k_htmlEncode(kerio.waw.shared.k_methods.k_translateErrorMessage(k_decoded)) + '</b>';
k_actionResultElement.k_setValue(
kerio.lib.k_tr('Success. But note the fact that the firewall has been disconnected only locally due to the following error: %1',
'domainsJoinEditor',
{k_args: [k_message], k_isSecure: true})
);
}
else {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
return; }
}
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
this.k_wizard.k_setActiveTab('k_step2Page');
};

k_kerioWidget.k_resetOnClose = function() {
var
k_toolbar = this.k_toolbar;
this.k_step1Form.k_reset();
this.k_wizard.k_setActiveTab('k_step1Page');k_toolbar.k_hideItem('k_btnClose');
k_toolbar.k_showItem('k_btnNext');
k_toolbar.k_showItem('k_btnCancel');
if (this.k_isJoin) {
k_toolbar.k_hideItem('k_btnPrev');
this.k_step2Form.k_reset();
this.k_step3Form.k_reset();
this.k_isServerNeeded = false;
}
};
} }; 