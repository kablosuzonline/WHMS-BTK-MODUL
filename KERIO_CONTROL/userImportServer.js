

kerio.waw.ui.userImportServer = {

k_init: function(k_objectName) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_isLinux = kerio.waw.shared.k_methods.k_isLinux(),
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_IMPORT_SERVER_TYPE,
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_serverTypeSelect;
k_IMPORT_SERVER_TYPE = {
k_ACTIVE_DIRECTORY: 0,
k_KERBEROS_NT: 1
};
k_WAW_CONSTANTS.k_IMPORT_SERVER_TYPE = k_IMPORT_SERVER_TYPE;
k_formCfg = {
k_items: [
{
k_type: 'k_container',
k_labelWidth: 220,
k_items: [
{ k_id: 'k_serverType',
k_caption: k_tr('Import users from:', 'userImportServer'),
k_type: 'k_select',
k_isHidden: k_isLinux,
k_localData: [
{
k_value: k_IMPORT_SERVER_TYPE.k_ACTIVE_DIRECTORY,
k_caption: k_tr('Microsoft® Active Directory®', 'userImportServer')
},
{
k_value: k_IMPORT_SERVER_TYPE.k_KERBEROS_NT,
k_caption: k_tr('Windows NT® domain', 'userImportServer')
}
],
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_value: k_IMPORT_SERVER_TYPE.k_ACTIVE_DIRECTORY,

k_onChange: function(k_form, k_select, k_value){
if (!k_form) {
return;
}
var k_isActiveDirectoryServer = (kerio.waw.shared.k_CONSTANTS.k_IMPORT_SERVER_TYPE.k_ACTIVE_DIRECTORY === k_value);
k_form.k_dialog.k_isActiveDirectoryServer = k_isActiveDirectoryServer;
k_form.k_setVisible(k_select.k_activeDirectoryItems, k_isActiveDirectoryServer);
k_form.k_setVisible(k_select.k_windowsNtItems, !k_isActiveDirectoryServer);
}
},
{ k_id: 'k_adDomainName',
k_caption: k_tr('Microsoft® Active Directory® domain name:', 'userImportServer'),
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_DOMAIN_NAME,
k_isReadOnly: true, k_checkByteLength: true,
k_validator: {
k_allowBlank: false
}
},
{ k_name: 'hostName',
k_id:   'k_hostName',
k_caption: k_tr('Import from server:', 'userImportServer'),
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME_OR_IP_ADDRESS,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false
}
},
{ k_name: 'userName',
k_id:   'k_userName',
k_caption: k_tr('Username:', 'common'),
k_maxLength: 127,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false
}
},
{ k_caption: k_tr('Password:', 'common'),
k_name: 'password',
k_id:   'k_password',
k_isPasswordField: true,
k_maxLength: 110, k_checkByteLength: true
},
{ k_id: 'k_winNtDomainName',
k_caption: k_tr('Windows NT® domain name:', 'userImportServer'),
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_DOMAIN_NAME,
k_checkByteLength: true,
k_isHidden: true,
k_validator: {
k_allowBlank: false
}
},
{ k_type: 'k_checkbox',
k_id: 'k_useSecureConnection',
k_option: k_tr('Secure connection (LDAPS)', 'userImportServer'),
k_caption: '',
k_isChecked: true
}
]
}
]
}; k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_form.k_patchAutoFill();
k_dialogCfg = {
k_width: 500,
k_height: 260,
k_title: k_tr('Import User Accounts', 'userImportServer'),
k_content: k_form,
k_defaultItem: k_form.k_getItem('k_hostName').k_id,
k_buttons: [
{
k_isDefault: true,
k_id: 'k_dialogBtnOK',
k_caption: k_tr('OK', 'common'),

k_onClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData.call(k_toolbar.k_dialog);
}
},
{
k_isCancel: true,
k_id: 'k_dialogBtnCancel',
k_caption: k_tr('Cancel', 'common')
}
]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_form = k_form;
k_form.k_dialog = k_dialog;
k_serverTypeSelect = k_form.k_getItem('k_serverType');
k_serverTypeSelect.k_activeDirectoryItems = ['k_adDomainName', 'k_hostName', 'k_userName', 'k_password'];
k_serverTypeSelect.k_windowsNtItems = ['k_winNtDomainName'];
k_form.k_inputAdDomainName           = k_form.k_getItem('k_adDomainName');
k_form.k_inputHostName               = k_form.k_getItem('k_hostName');
k_form.k_inputUserName               = k_form.k_getItem('k_userName');
k_form.k_inputPassword               = k_form.k_getItem('k_password');
k_form.k_checkboxUseSecureConnection = k_form.k_getItem('k_useSecureConnection');
k_form.k_inputWinNtDomainName        = k_form.k_getItem('k_winNtDomainName');
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
}; 
k_kerioWidget.k_applyParams = function(k_params) {
var k_WAW_METHODS = kerio.waw.shared.k_methods;
this.k_parentGrid = k_params.k_parentGrid;
k_WAW_METHODS.k_maskMainScreen(this, {
k_message: kerio.lib.k_tr('Testing connection to the primary domain…', 'userImportServer')
});
k_WAW_METHODS.k_sendBatch({
k_requests: [	{
'method': 'Domains.get',
'params': {
query: {
start: 0,
limit: 1,
conditions: [ kerio.waw.shared.k_DEFINITIONS.k_get('k_searchCondition', { k_fieldName: 'primary', k_value: '1', k_match: true})
] } } }, {
'method': 'Authentication.getJoinStatus'
}
], k_callback: this.k_getDomainCallback,
k_scope: this,
k_mask: false
}); }; 
k_kerioWidget.k_getDomainCallback = function(k_response) {
var
k_tr = kerio.lib.k_tr,
k_constDomainJoinStatus = kerio.waw.shared.k_CONSTANTS.JoinStatus,
k_form = this.k_form,
k_primaryDomain,
k_focusField,
k_joinStatus,
k_reason;
if (!k_response.k_isOk) {
kerio.lib.k_reportError('Error in communication with server', 'userImportServer', 'k_getDomainCallback');
return;
}
k_primaryDomain = k_response.k_decoded.batchResult[0];
k_primaryDomain = k_primaryDomain.list ? k_primaryDomain.list[0] : {};
k_joinStatus = k_response.k_decoded.batchResult[1];
k_joinStatus = k_joinStatus ? k_joinStatus.status : k_constDomainJoinStatus.JoinStatusError;
k_primaryDomain.name = k_primaryDomain.service.domainName;
if (k_constDomainJoinStatus.JoinStatusConnected === k_joinStatus) {
k_form.k_setData({
k_adDomainName: k_primaryDomain.name,
k_winNtDomainName: ''
}, true);
this.k_primaryDomainData = k_primaryDomain;
if (k_primaryDomain.service.enabled) { if (k_primaryDomain.service) {
k_form.k_setData({
k_hostName: (k_primaryDomain.service.useSpecificServers ? k_primaryDomain.service.primaryServer : ''),
k_userName: k_primaryDomain.service.userName || '',
k_useSecureConnection: (k_primaryDomain.advanced ? k_primaryDomain.advanced.ldapSecure : true)
}, true);
k_focusField = k_form.k_getItem(!k_primaryDomain.service.useSpecificServers
? 'k_hostName'
: (!k_primaryDomain.service.userName
? 'k_hostName'
: 'k_password'
)
);
k_focusField.k_focus.defer(100, k_focusField);
}
}
else { this.k_enableUserDb(k_primaryDomain.name);
return; }
}
else { k_reason = (k_constDomainJoinStatus.JoinStatusDisconnected === k_joinStatus)
? k_tr('Kerio Control is not member of any domain.', 'userImportServer')
: k_tr('There is a problem with connection to domain %1.', 'userImportServer', {k_args: [k_primaryDomain.name]});
kerio.lib.k_alert(
k_tr('User Import', 'userImportServer'),
k_tr('You cannot import users: %1', 'userImportServer', {k_args: [k_reason]})
);
this.k_hide(); }
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
}; 
k_kerioWidget.k_enableUserDb = function(k_domainName) {
var k_tr = kerio.lib.k_tr;
kerio.lib.k_confirm(
k_tr('User Import', 'userImportServer'),
k_tr('Kerio Control is not configured to authenticate users from your primary domain. It can be automatically configured based on values you use for user import.', 'userImportServer', {k_args: [k_domainName]})
+ '<br><br><b>'
+ k_tr('Do you want to continue with user import and automatic domain configuration?', 'userImportServer')
+ '</b>',
this.k_enableUserDbCallback,
this,
'yes'
);
}; 
k_kerioWidget.k_enableUserDbCallback = function(k_answer) {
if ('yes' === k_answer) {
this.k_switchToLocalDb  = true; kerio.waw.shared.k_methods.k_unmaskMainScreen(this); }
else {
this.k_hide();
}
}; 
k_kerioWidget.k_sendData = function() {
var
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_WAW_METHODS = k_shared.k_methods,
k_form = this.k_form,
k_requests = [],
k_formData = k_form.k_getData(),
k_primaryDomainData = this.k_primaryDomainData,
k_importFromAd = (false !== this.k_isActiveDirectoryServer); k_WAW_METHODS.k_maskMainScreen(this, {
k_message: kerio.lib.k_tr('Importing users from domain %1…', 'userImportServer', {
k_args: [k_formData.k_adDomainName || k_formData.k_winNtDomainName] })
});
if (k_importFromAd) {
this.k_domainUsersIndex = k_requests.length;
k_requests.push({
k_jsonRpc: {
method: 'Users' + '.' + 'getAdUsers',
params: {
domainName: k_formData.k_adDomainName,
server:     k_formData.k_hostName,
ldapSecure: k_formData.k_useSecureConnection,
credentials: {
userName: k_formData.k_userName,
password: k_formData.k_password,
passwordChanged: true
}
}
}
});
}
else { this.k_domainUsersIndex = k_requests.length;
k_requests.push({
k_jsonRpc: {
method: 'Users' + '.' + 'getNtUsers',
params: {
domainName: k_formData.k_winNtDomainName
}
}
});
}
this.k_localUsersIndex = k_requests.length;
k_requests.push({
k_jsonRpc: {
method: 'Users.get',
params: {
domainId: k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE,
query: {
start: 0,
limit: -1,
orderBy: [
{
columnName: 'userName',
direction: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Asc
}
]
}
}}
});
k_WAW_METHODS.k_mergeObjects({
service: {
enabled: true,
domainName: k_formData.k_adDomainName,
useSpecificServers: true,
primaryServer: k_formData.k_hostName,
userName: k_formData.k_userName,
password: k_formData.k_password
},
advanced: {
ldapSecure: k_formData.k_useSecureConnection
},
ntAuthMode: !k_importFromAd,
authenticationOnly: this.k_switchToLocalDb || k_primaryDomainData.authenticationOnly
}, k_primaryDomainData); kerio.waw.requests.k_sendBatch(k_requests, {
k_mask: false, k_callback: this.k_sendDataCallback,
k_scope: this
});
};
k_kerioWidget.k_sendDataCallback = function(k_response, k_success) {
if (!k_success) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
}
var
k_usersToImport = [],
k_localUsers  = k_response[this.k_localUsersIndex].list || [],
k_domainUsers = k_response[this.k_domainUsersIndex].users || [],
k_tr,
k_i, k_iCnt,
k_j, k_jCnt,
k_domainUser,
k_localUser,
k_found;
for (k_i = 0, k_iCnt = k_domainUsers.length; k_i < k_iCnt; k_i++) {
k_domainUser = k_domainUsers[k_i];
k_found = false;
for (k_j = 0, k_jCnt = k_localUsers.length; k_j < k_jCnt; k_j++) {
k_localUser = k_localUsers[k_j];
if (k_domainUser.credentials.userName === k_localUser.credentials.userName) { k_found = true;
break;
}
} if (!k_found) {
k_usersToImport.push(k_domainUser);
}
} if ((0 === k_usersToImport.length)) {
k_tr = kerio.lib.k_tr;
kerio.lib.k_alert({
k_title: k_tr('User Import', 'userImportServer'),
k_msg: '<b>' + k_tr('No user accounts can be imported from this domain.', 'userImportServer')
+ '</b><br><br>'
+ k_tr('Either there are no users in the domain or all of the users already exist in the local user database.', 'userImportServer'),
k_icon: 'info'
}); this.k_hide(); return;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'userImportList',
k_params: {
k_previousDialog:          this,
k_userList:                k_usersToImport,
k_isActiveDirectoryServer: (false !== this.k_isActiveDirectoryServer), k_parentGrid:              this.k_parentGrid,
k_primaryDomainData:       this.k_primaryDomainData
}
});
};}}; 