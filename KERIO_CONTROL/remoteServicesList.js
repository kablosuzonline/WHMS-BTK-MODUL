
kerio.waw.ui.remoteServicesList = {
k_init: function(k_objectName) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared =  kerio.waw.shared,
k_isIPadCompatible = k_lib.k_isIPadCompatible,
k_DEFINITIONS = k_shared.k_DEFINITIONS,
k_getDefinition = k_DEFINITIONS.k_get,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
DynamicDnsAddressType = k_WAW_CONSTANTS.DynamicDnsAddressType,
Target = kerio.waw.shared.k_CONSTANTS.Target,
k_VISIT_LINK = kerio.adm.k_widgets.K_MyKerioSettings.prototype.k_VISIT_LINK,
k_SMTP_LINK = 'smptLink',
k_BACKUP_LINK = 'backupLink',
k_closureLocalNamespace = k_objectName + '_',
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_isLinux = k_shared.k_methods.k_isLinux(),
k_buildTooltip = k_lib.k_buildTooltip,
k_closureTabs = [],  k_closureForms = [], k_tabPage, k_tabPageCfg,
k_toolbar, k_toolbarCfg,
k_mykerioForm,
k_appManagerForm,
k_appManagerFormId,
k_smtpFormCfg,
k_dnsFormCfg,
k_backupFormCfg,
k_mykerioFormId,
k_addForm,
k_backupSpecificUrlHint,
k_AppManagerStatus,
k_isAppManagerBackupNotAvailable,
k_interfaceLoader;

k_addForm = function(k_params) {
var
k_lib = kerio.lib,
k_methods =  kerio.waw.shared.k_methods,
k_isAuditor = k_methods.k_isAuditor(),
k_isLinux = k_methods.k_isLinux(),
k_id = k_params.k_id,
k_references = k_params.k_references || {},
k_items = k_params.k_items || {},
k_form,
k_reference;
k_form = new k_lib.K_Form(k_closureLocalNamespace + k_id, k_params.k_config);
k_form.k_addReferences({
k_name: k_id, k_isLinux: k_isLinux,
k_isAuditor: k_isAuditor,
k_loadRequests: undefined });
for (k_reference in k_items) { if ('string' === typeof(k_items[k_reference])) { k_references[k_reference] = k_form.k_getItem(k_items[k_reference]); }
}
k_form.k_addReferences(k_references);
k_closureForms.push(k_form);
k_closureForms[k_id] = k_form; k_closureTabs.push({
k_id: k_id,
k_caption: k_params.k_caption,
k_content: k_form
});
return k_form;
};

k_mykerioForm = new kerio.adm.k_widgets.K_MyKerioSettings(k_closureLocalNamespace + 'k_myKerioForm', {
k_showApplyReset: true,
k_isAuditor: k_isAuditor,
k_displayMarketing: {
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('You can use %1MyKerio%2 to remotely manage all of your Kerio Control appliances, as a %3notification service%4, and as a %5backup service%6.', 'remoteServices', {k_args: ['<a id="' + k_VISIT_LINK + '">', '</a>', '<a id="' + k_SMTP_LINK + '">','</a>', '<a id="' + k_BACKUP_LINK + '">','</a>'], k_isSecure: true}),
k_onLinkClick: function(k_form, k_item, k_id) {
switch(k_id) {
case k_form.k_VISIT_LINK:
k_form.k_openMyKerioWeb();
break;
case k_form.k_SMTP_LINK:
k_form.k_gotoSmtpFunction();
break;
case k_form.k_BACKUP_LINK:
k_form.k_gotoBackupFunction();
break;
}
}
},
k_statusCallback: function(k_status) {
var
k_isMyKerioBackupNotAvailable = !k_status.connected || !k_status.paired,
k_backupForm = this.k_parentWidget.k_items.k_tab_k_backupForm._kx.k_owner,
k_isBackupDisabled = true !== k_backupForm.k_getItem('enabled').k_getValue(),
k_backupData = k_backupForm.k_getData(),
k_isMyKerioBackup = k_backupData.target == Target.TargetMyKerio,
k_isAppManagerBackup = k_backupData.target == Target.TargetAppManager,
k_isMyKerioPaired = k_status.paired;
k_backupForm.k_myKerioNotAvailable.k_setVisible(k_isMyKerioBackupNotAvailable);
k_backupForm.k_btnBackup.k_setDisabled(k_isBackupDisabled || k_isMyKerioBackup && k_isMyKerioBackupNotAvailable || k_isAppManagerBackup && k_isAppManagerBackupNotAvailable);
if (k_isMyKerioBackup) {
if (k_isMyKerioPaired && !k_isBackupDisabled) { 
k_mykerioForm.k_getItem('enabled').k_setReadOnly(true);
k_mykerioForm.k_getItem('k_btnRemove').k_setReadOnly(true);
k_mykerioForm.k_getItem('k_warningMessage').k_setVisible(true);
}
else { 
k_mykerioForm.k_getItem('enabled').k_setReadOnly(false);
k_mykerioForm.k_getItem('k_btnRemove').k_setReadOnly(false);
k_mykerioForm.k_getItem('k_warningMessage').k_setVisible(false);
}
k_appManagerForm.k_getItem('k_warningMessage').k_setVisible(false);
k_appManagerForm.k_getItem('k_appManagerRemove').k_setReadOnly(false);
}
else if (k_isAppManagerBackup) {
if (k_AppManagerStatus == 'ApplianceRegistered' && !k_isBackupDisabled) k_appManagerForm.k_getItem('k_warningMessage').k_setVisible(true);
else k_appManagerForm.k_getItem('k_warningMessage').k_setVisible(false);
if (!k_isBackupDisabled) k_appManagerForm.k_getItem('k_appManagerRemove').k_setReadOnly(true);
else k_appManagerForm.k_getItem('k_appManagerRemove').k_setReadOnly(false);
k_mykerioForm.k_getItem('enabled').k_setReadOnly(false);
k_mykerioForm.k_getItem('k_btnRemove').k_setReadOnly(false);
k_mykerioForm.k_getItem('k_warningMessage').k_setVisible(false);
}
else {
k_mykerioForm.k_getItem('enabled').k_setReadOnly(false);
k_mykerioForm.k_getItem('k_btnRemove').k_setReadOnly(false);
k_mykerioForm.k_getItem('k_warningMessage').k_setVisible(false);
k_appManagerForm.k_getItem('k_warningMessage').k_setVisible(false);
k_appManagerForm.k_getItem('k_appManagerRemove').k_setReadOnly(false);
}
}
});
k_mykerioForm.k_addReferences({
k_SMTP_LINK: k_SMTP_LINK,
k_BACKUP_LINK: k_BACKUP_LINK,
k_getSaveRequests: function() {
return [{
k_method: 'CentralManagement.set',
k_params: {
config: this.k_getData()
}
}];
},
k_gotoSmtpFunction: function() {
kerio.waw.status.k_currentScreen.k_gotoNode('remoteServices', 'k_smtpForm');
},
k_gotoBackupFunction: function() {
kerio.waw.status.k_currentScreen.k_gotoNode('remoteServices', 'k_backupForm');
}
});
if (! kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED) {
k_mykerioFormId = 'myKerioForm';
k_closureForms.push(k_mykerioForm);
k_closureForms[k_mykerioFormId] = k_mykerioForm;
k_closureTabs.push({
k_id: k_mykerioFormId,
k_caption: 'MyKerio',
k_content: k_mykerioForm
});
}

k_appManagerForm = new kerio.waw.ui.appManagerSettings(k_closureLocalNamespace + 'k_appManagerForm', {
k_showApplyReset: true,
k_isAuditor: k_isAuditor,
k_statusCallback: function(k_status) {
var
k_backupForm = this.k_parentWidget.k_items.k_tab_k_backupForm._kx.k_owner;
k_AppManagerStatus = k_status.status;
k_isAppManagerBackupNotAvailable = k_status.status !== 'ApplianceRegistered';
k_backupForm.k_appManagerNotAvailable.k_setVisible(k_isAppManagerBackupNotAvailable);
}
});
k_appManagerForm.k_addReferences({
k_gotoSmtpFunction: function() {
kerio.waw.status.k_currentScreen.k_gotoNode('remoteServices', 'k_smtpForm');
},
k_gotoBackupFunction: function() {
kerio.waw.status.k_currentScreen.k_gotoNode('remoteServices', 'k_backupForm');
}
});
k_appManagerFormId = 'appManagerForm';
k_closureForms.push(k_appManagerForm);
k_closureForms[k_appManagerFormId] = k_appManagerForm;
k_closureTabs.push({
k_id: k_appManagerFormId,
k_caption: 'GFI AppManager',
k_content: k_appManagerForm
});

k_smtpFormCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Settings', 'common'),
k_id: 'k_smtpTypeFieldset',
k_items: [
{
k_type: 'k_radio',
k_isVisible: !kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_isDisabled: kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_groupId: 'k_serverType',
k_option: k_tr('MyKerio notification service', 'accountingList'),
k_value: k_WAW_CONSTANTS.k_SMTP_TYPE.k_KERIO_MANAGER,
k_isLabelHidden: true,
k_isChecked: !kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_onChange: function(k_form, k_radio, k_value) {
var k_isSmtpType = kerio.waw.shared.k_CONSTANTS.k_SMTP_TYPE.k_SMTP_SERVER === k_value;
k_form.k_setDisabled('k_smtpServerFieldset', !k_isSmtpType);
k_form.k_setDisabled('k_smtpServerTest', '' === k_form.k_serverField.k_getValue() && k_isSmtpType); }
},
{
k_type: 'k_radio',
k_isVisible: true,
k_isDisabled: false,
k_groupId: 'k_serverType',
k_option: k_tr('AppManager notification service', 'accountingList'),
k_value: k_WAW_CONSTANTS.k_SMTP_TYPE.k_APP_MANAGER,
k_isLabelHidden: true,
k_isChecked: false,
k_onChange: function(k_form, k_radio, k_value) {
var k_isSmtpType = kerio.waw.shared.k_CONSTANTS.k_SMTP_TYPE.k_SMTP_SERVER === k_value;
k_form.k_setDisabled('k_smtpServerFieldset', !k_isSmtpType);
k_form.k_setDisabled('k_smtpServerTest', '' === k_form.k_serverField.k_getValue() && k_isSmtpType); }
},
{
k_type: 'k_radio',
k_groupId: 'k_serverType',
k_option: k_tr('SMTP server', 'accountingList'),
k_value: k_WAW_CONSTANTS.k_SMTP_TYPE.k_SMTP_SERVER,
k_isLabelHidden: true,
k_isChecked: kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED
},
{
k_type: 'k_display',
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('Notifications, reports and alerts will be sent using the specified mail server.', 'advancedOptionsList')
},
k_mykerioForm.k_createEolWarning()
]
},
{
k_type: 'k_fieldset',
k_id: 'k_smtpServerFieldset',
k_caption: k_tr('SMTP server', 'advancedOptionsList'),
k_isDisabled: !kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_caption: k_tr('Server:', 'advancedOptionsList'),
k_id: 'server',
k_width: k_isIPadCompatible ? undefined : 300,
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME,
k_checkByteLength: true,
k_validator: {
k_functionName: 'k_hasNoSpaces',
k_allowBlank: true },

k_onChange: function(k_form, k_element, k_value){
var k_isSmtpType = kerio.waw.shared.k_CONSTANTS.k_SMTP_TYPE.k_SMTP_SERVER === k_form.k_serverType.k_getValue();
k_form.k_setDisabled('k_smtpServerTest', '' === k_value && k_isSmtpType); }
}
]
},
{
k_type: 'k_checkbox',
k_id: 'requireSecureConnection',
k_isLabelHidden: true,
k_option: k_tr('Require SSL-secured connection', 'advancedOptionsList')
},
{
k_type: 'k_checkbox',
k_id: 'authenticationRequired',
k_isLabelHidden: true,
k_option: k_tr('SMTP server requires authentication', 'advancedOptionsList'),

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled(['credentials.userName', 'credentials.password'], !k_isChecked);
k_form.k_getItem('credentials.userName').k_focus();
}
},
k_getDefinition('k_userNameField', {
k_id: 'credentials.userName',
k_indent: 1,
k_isDisabled: true,
k_validator: {
k_functionName: 'k_isUserNameDomain'
}
}),
k_getDefinition('k_passwordField', {
k_id: 'credentials.password',
k_indent: 1,
k_isDisabled: true
}),
{
k_type: 'k_checkbox',
k_id: 'fromAddress.enabled',
k_isLabelHidden: true,
k_option: k_tr('Specify sender email address in the "From:" header', 'advancedOptionsList'),

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled(['fromAddress.value'], !k_isChecked);
}
},
{
k_indent: 1,
k_id: 'fromAddress.value',
k_width: k_isIPadCompatible ? undefined : 300,
k_isDisabled: true,
k_caption: k_tr('Email address:', 'advancedOptionsList'),
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_EMAIL_ADDRESS,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isEmail'
}
}
]
},
{
k_type: 'k_formButton',
k_caption: k_tr('Test…', 'advancedOptionsList'),
k_isDisabled: k_WAW_CONSTANTS.k_MYKERIO_DISABLED,
k_id: 'k_smtpServerTest',

k_onClick: function(k_form) {
k_form.k_test();
}
}
]
};
if (k_WAW_CONSTANTS.k_MYKERIO_DISABLED) {
k_smtpFormCfg.k_items[0].k_items.shift();
}
k_addForm({
k_id: 'k_smtpForm',
k_config: k_smtpFormCfg,
k_caption: k_tr('SMTP Relay', 'advancedOptionsList'),
k_items: {
k_authenticationRequiredCheckbox: 'authenticationRequired',
k_passwordField: 'credentials.password',
k_serverType: 'k_serverType',
k_serverField: 'server'
}
});

k_dnsFormCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'enabled',
k_isLabelHidden: true,
k_option: k_tr("Automatically update dynamic DNS service records with the firewall's IP address", 'advancedOptionsList'),

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled(['k_containerDynDnsSettings', 'k_containerReportedIpAddress'], !k_isChecked);
k_form.k_getItem('hostname').k_focus();
}
},
{ k_type: 'k_fieldset',
k_id: 'k_containerDynDnsSettings',
k_caption: k_tr('DDNS service provider', 'advancedOptionsList'),
k_isDisabled: true,
k_labelWidth: 150,
k_items: [
{
k_type: 'k_select',
k_id: 'provider',
k_caption: k_tr('Provider:', 'advancedOptionsList'),
k_width: k_isIPadCompatible ? undefined : 300,
k_localData: [],
k_fieldDisplay: 'k_value',
k_fieldValue: 'k_value'
},
{
k_id: 'hostname',
k_caption: k_tr('Update hostname:', 'advancedOptionsList'),
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME,
k_checkByteLength: true,
k_width: k_isIPadCompatible ? undefined : 300,
k_validator: {
k_functionName: 'k_isName',
k_allowBlank: false
}
},
k_getDefinition('k_userNameField', {
k_id:   'credentials.userName',
k_validator: {
k_functionName: 'k_isUserNameDomain'
}
}),
k_getDefinition('k_passwordField', {
k_id:   'credentials.password'
})
]
},
{
k_type: 'k_fieldset',
k_id: 'k_containerReportedIpAddress',
k_caption: k_tr('Reported IP address', 'advancedOptionsList'),
k_isDisabled: true,
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_radio',
k_groupId: 'addressType',
k_option: k_tr('IP address configured on outgoing Internet interface', 'advancedOptionsList'),
k_value: DynamicDnsAddressType.DynamicDnsAdressIface,
k_onChange: function(k_form, k_radio, k_value) {
k_form.k_setDisabled(['customIface'], kerio.waw.shared.k_CONSTANTS.DynamicDnsAddressType.DynamicDnsAdressCustom !== k_value);
}
},
{
k_type: 'k_radio',
k_groupId: 'addressType',
k_option: k_tr('Detected public IP address', 'advancedOptionsList'),
k_value: DynamicDnsAddressType.DynamicDnsAdressDetect
},
{
k_type: 'k_columns',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'addressType',
k_option: k_tr('IP address configured on interface:', 'advancedOptionsList'),
k_value: DynamicDnsAddressType.DynamicDnsAdressCustom,
k_isLabelHidden: true
},
{
k_type: 'k_select',
k_id: 'customIface',
k_isLabelHidden: true,
k_width: 200,
k_localData: [],
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_fieldIconClassName: 'k_class'
}
]
}
]
},
{
k_type: 'k_fieldset',
k_id: 'k_containerDynDnsUpdate',
k_caption: k_tr('Update status', 'advancedOptionsList'),
k_labelWidth: 150,
k_isHidden: true,
k_items: [
{
k_type: 'k_display',
k_id: 'k_dnsUpdateResult',
k_className: 'dnsUpdateStatus',
k_template: '&nbsp; &nbsp; &nbsp; &nbsp;{status}'
},
{
k_type: 'k_formButton',
k_id: 'k_buttonUpdateDynamicDns',
k_caption: k_tr('Update Now', 'advancedOptionsList'),
k_mask: false, 
k_onClick: function(k_form) {
k_form.k_updateDns(true);
}
}
]
}
]
}; k_addForm({
k_id: 'k_dnsForm',
k_config: k_dnsFormCfg,
k_caption: k_tr('Dynamic DNS', 'advancedOptionsList'),
k_references: {
k_updatingMessage: k_tr('Please wait, update in progress…', 'advancedOptionsList'),
k_updateOkMessage: k_tr('Update has been completed successfully', 'advancedOptionsList'),
k_updating: false, k_providersLoaded: false,
k_updateTaskName: 'k_dynDnsStatusUpdate',
k_updateRequests: [
{
method: 'DynamicDns.update'
},
{
method: 'DynamicDns.getStatus'
}
],
k_getStatusRequests: [
{
method: 'DynamicDns.getStatus'
}
]
},
k_items: {
k_passwordField: 'credentials.password',
k_dnsUpdateResult: 'k_dnsUpdateResult'
}
});
k_interfaceLoader = new kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_interfacesEthernetRasList',
k_select: k_closureForms.k_dnsForm.k_getItem('customIface'),
k_addNoneOption: false,
k_value: {},

k_iconRenderer: kerio.waw.shared.k_methods.k_renderers.k_interfaceIconsForListLoader
});
k_closureForms.k_dnsForm.k_addReferences({
k_interfaceLoader: k_interfaceLoader
});

k_backupSpecificUrlHint = k_tr('The URL has to link to a specific page.','advancedOptionsList');
k_backupFormCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'enabled',
k_isLabelHidden: true,
k_option: k_tr('Enable automatic daily backup', 'advancedOptionsList'),
k_onChange: function(k_form, k_item, k_value) {
k_form.k_setReadOnly(['target', 'k_ftpSettings'], !k_value);
if (!k_value) {
k_form.k_setDisabled(['k_btnBackup'], true);
}
}
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Settings', 'common'),
k_id: 'k_settingsFieldset',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'target',
k_option: k_tr('MyKerio', 'backup'),
k_value: Target.TargetMyKerio,
k_isLabelHidden: true,
k_isReadOnly: true,
k_isVisible: !kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_isDisabled: kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_isChecked: !kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
},
{
k_type: 'k_radio',
k_groupId: 'target',
k_option: k_tr('GFI AppManager', 'backup'),
k_value: Target.TargetAppManager,
k_isLabelHidden: true,
k_isReadOnly: true,
k_isVisible: !kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_isDisabled: kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_isChecked: !kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_onChange: function(k_form, k_item, k_value) {
var
Target = kerio.waw.shared.k_CONSTANTS.Target;
switch (k_value) {
case Target.TargetAppManager:
k_form.k_setVisible(['k_appManagerSettings'], true);
k_form.k_setVisible(['k_ftpSettings'], false);
k_form.k_setVisible(['k_myKerioSettings'], false);
break;
case Target.TargetMyKerio:
k_form.k_setVisible(['k_appManagerSettings'], false);
k_form.k_setVisible(['k_ftpSettings'], false);
k_form.k_setVisible(['k_myKerioSettings'], true);
break;
case Target.TargetFtpServer:
k_form.k_setVisible(['k_appManagerSettings'], false);
k_form.k_setVisible(['k_ftpSettings'], true);
k_form.k_setVisible(['k_myKerioSettings'], false);
break;
}
}
},
{
k_type: 'k_radio',
k_groupId: 'target',
k_option: 'FTP',
k_isReadOnly: true,
k_value: Target.TargetFtpServer,
k_isChecked: kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_isLabelHidden: true
},
{
k_type: 'k_container',
k_id: 'k_appManagerSettings',
k_items: [
{
k_type: 'k_display',
k_id: 'k_appManagerNotAvailable',
k_icon: 'img/warning.png?v=8629',
k_className: 'warningImgIcon',
k_isHidden: true,
k_isVisible: !kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_isDisabled: kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_value: k_tr('Kerio Control is unable to backup to AppManager.', 'backup') + ' <a id="goToMyKerioTab">' + k_tr('Go to AppManager settings', 'backup') + '</a>',
k_isSecure: true,
k_onLinkClick: function() {
kerio.waw.status.k_currentScreen.k_gotoNode('remoteServices', 'appManagerForm');
}
}
]
},
{
k_type: 'k_container',
k_id: 'k_myKerioSettings',
k_items: [
{
k_type: 'k_display',
k_id: 'k_myKerioNotAvailable',
k_icon: 'img/warning.png?v=8629',
k_className: 'warningImgIcon',
k_isHidden: true,
k_isVisible: !kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_isDisabled: kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_value: k_tr('Kerio Control is unable to backup to MyKerio.', 'backup') + ' <a id="goToMyKerioTab">' + k_tr('Go to MyKerio settings', 'backup') + '</a>',
k_isSecure: true,
k_onLinkClick: function() {
kerio.waw.status.k_currentScreen.k_gotoNode('remoteServices', 'myKerioForm');
}
}
]
},
{
k_type: 'k_container',
k_id: 'k_ftpSettings',
k_isHidden: !kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED,
k_isReadOnly: true,
k_items: [
{
k_id: 'k_ftpUsername',
k_caption: k_tr('Username:', 'common'),
k_width: k_isIPadCompatible ? undefined : 400,
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_EMAIL_ADDRESS,
k_validator: {
k_allowBlank: false
}
},
k_getDefinition('k_passwordField', {
k_id: 'k_ftpPassword',
k_width: k_isIPadCompatible ? undefined : 400
}),
{
k_type: 'k_row',
k_className: 'k_rowWithoutPadding',
k_items: [
{
k_type: 'k_display',
k_id: 'k_urlLabelFtp',
k_width: 105,
k_isLabelHidden: true,
k_isHidden: false,
k_template: [
k_tr('URL:', 'interfaceEditor'),
'<span class="tooltip" style="visibility:hidden;"></span>'
].join('')
},
{
k_id: 'k_ftpUrl',
k_isLabelHidden: true,
k_width: k_isIPadCompatible ? undefined : 400,
k_validator: {
k_allowBlank: false
}
}
]
}
]
},
k_mykerioForm.k_createEolWarning()
]
},
{
k_type: 'k_fieldset',
k_id: 'k_containerBackupStatus',
k_caption: k_tr('Backup', 'advancedOptionsList'),
k_items: [
{
k_type: 'k_row',
k_id: 'k_containerBackupStatusTime',
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_width: 120,
k_value: k_tr('Last backup:', 'advancedOptionsList')
},
{
k_type: 'k_display',
k_id: 'k_lastBackupTime',
k_className: 'backupStatus',
k_isLabelHidden: true,
k_isSecure: true,
k_value: k_tr('Never', 'advancedOptionsList')
}
]
},
{
k_type: 'k_row',
k_id: 'k_backupLocationRow',
k_isHidden: true,
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_isLabelHidden: true,
k_width: 120,
k_value: k_tr('Location:', 'advancedOptionsList')
},
{
k_id: 'k_backupLocation',
k_type: 'k_display',
k_isSecure: true,
k_isLabelHidden: true,
k_template: '<a class="selectable link textLink" href="{k_url}" onclick="window.open(\'{k_url}\'); return false;">{k_visibleLink}</a>',
k_value: {
k_url: '',
k_visibleLink: ''
}
}
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_formButton',
k_id: 'k_btnBackup',
k_isDisabled: true,
k_caption: k_tr('Backup now', 'advancedOptionsList'),

k_onClick: function(k_form, k_button) {
if (kerio.waw.status.k_currentScreen.k_isContentChanged()) {
kerio.waw.status.k_currentScreen.k_showContentChangedAlert();
return;
}
k_form.k_setDisabled(['k_btnBackup'], true);
k_form.k_backupNow();
}
},
{
k_id: 'k_importLink',
k_type: 'k_formButton',
k_caption: k_tr('Import configuration…', 'assistant'),

k_onClick: function(k_form, k_button) {
kerio.lib.k_ui.k_showDialog({k_sourceName: 'configurationImport', k_params: {}});
}
}
]
}
]
}
]
}; if (k_WAW_CONSTANTS.k_MYKERIO_DISABLED) {
k_backupFormCfg.k_items[1].k_items.shift();
}
k_addForm({
k_id: 'k_backupForm',
k_config: k_backupFormCfg,
k_caption: k_tr('Configuration Backup', 'advancedOptionsList'),
k_items: {
k_urlField: 'url',
k_lastBackupTime: 'k_lastBackupTime',
k_backupLocation : 'k_backupLocation',
k_backupLocationRow: 'k_backupLocationRow',
k_btnBackup: 'k_btnBackup',
k_urlLabelFtp: 'k_urlLabelFtp',
k_ftpPassword: 'k_ftpPassword',
k_myKerioNotAvailable: 'k_myKerioNotAvailable',
k_appManagerNotAvailable: 'k_appManagerNotAvailable'
},
k_references: {
k_backupTaskId: 'k_backupUpdateTask',
k_statusProgressText: k_tr('Please wait, performing backup now…', 'advancedOptionsList'),
k_statusProgressClass: 'inProgress',
k_statusFailedClass: 'failed',
k_passwordRegExp: k_DEFINITIONS.k_backupPassworRegExp,
k_passwordInvalidText: k_tr('Password must be at least 6 characters in length', 'advancedOptionsList'),
k_passwordEmptyText: k_tr('You have changed the email address so a new password needs to be set.', 'alertEditor'),
k_isFtpBackup: undefined
}
});

k_tabPageCfg = {
k_className: 'mainList',
k_items: k_closureTabs
};

if (!k_isAuditor) {
k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function(k_toolbar, k_button){
var k_tabPage = k_toolbar.k_relatedWidget;
if (k_tabPage.k_isValid()) {
k_tabPage.k_saveBatchData(k_button.k_isFiredByEvent);
return false;
}
return true;
},

k_onReset: function(k_toolbar, k_button){
k_toolbar.k_relatedWidget.k_loadBatchData();
}
};
k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_closureLocalNamespace + 'k_toolbar', k_toolbarCfg);
k_tabPageCfg.k_toolbars = {
k_bottom: k_toolbar
};
}
if (k_isLinux) {
k_tabPageCfg.k_onTabChange = function(k_tabPage, k_currentTabId) {
kerio.adm.k_framework._k_setHelpQuery(k_tabPage.k_id + '_' + k_currentTabId);
if ('k_backupForm' === k_currentTabId) {
k_tabPage.k_forms.k_backupForm.k_extWidget.doLayout.defer(100, k_tabPage.k_forms.k_backupForm.k_extWidget);
}
};
}
k_tabPage = new k_lib.K_TabPage(k_objectName, k_tabPageCfg);
if (!k_isAuditor) {
k_tabPage.k_toolbar = k_toolbar;
}
k_tabPage.k_addReferences({
k_forms: k_closureForms,
k_isLinux: k_isLinux
});
k_tabPage.k_addReferences({
k_onDeactivate: function() {
var
k_tasks = kerio.waw.shared.k_tasks,
k_backupTaskId = this.k_forms.k_backupForm.k_backupTaskId;
if (k_tasks.k_isDefined(k_backupTaskId)) {
k_tasks.k_suspend(k_backupTaskId);
}
if (!kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED) {
this.k_forms.myKerioForm.k_stopUpdateTask();
this.k_forms.appManagerForm.k_stopUpdateTask();
}
}
});
if (k_isAuditor) {
this.k_switchToAuditor(k_tabPage, k_closureForms);
}
kerio.waw.requests.k_addBatchControllers(k_tabPage);
this.k_addControllers(k_tabPage);
k_tabPage.k_forms.k_smtpForm.k_patchAutoFill();
k_tabPage.k_forms.k_dnsForm.k_patchAutoFill();
k_tabPage.k_forms.k_backupForm.k_patchAutoFill();
return k_tabPage;
},

k_addControllers: function(k_kerioWidget){
var
k_forms = k_kerioWidget.k_forms;

k_kerioWidget.k_applyParams = function() {
var k_tabId = kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED ? 'appManagerForm' : 'myKerioForm';
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
kerio.waw.status.k_currentScreen.k_gotoTab(this, k_tabId); this.k_loadBatchData();
};
k_forms.k_smtpForm.k_addReferences({

k_getLoadRequests: function(k_canReloadData) {
if (!k_canReloadData) {
return [];
}
if (!this.k_loadRequests) {
this.k_loadRequests = [
{
k_method:  'SmtpRelay.get',
k_handler: this.k_applyParams
}
];
}
return this.k_loadRequests;
}, 
k_getSaveRequests: function() {
if (!this.k_isChanged(true)) { return [];
}
return [
{
k_method: 'SmtpRelay.set',
k_params: this.k_saveData()
}];
}, 
k_applyParams: function(k_params) {
var
k_SMTP_TYPE = kerio.waw.shared.k_CONSTANTS.k_SMTP_TYPE,
k_data;
this.k_reset();
k_data = k_params.config;
k_data.k_serverType = k_data.useKManager ? k_SMTP_TYPE.k_KERIO_MANAGER : (k_data.useAppManager ? k_SMTP_TYPE.k_APP_MANAGER : k_SMTP_TYPE.k_SMTP_SERVER);
this.k_setData(k_data, true); kerio.waw.shared.k_methods.k_initPasswordField(this.k_passwordField);
kerio.waw.shared.k_data.k_cache({
k_screen: this.k_parentWidget,
k_dialogs: ['addEmailAddress']
});
}, 
k_saveData: function() {
var k_data = this.k_getData(true); k_data.credentials.passwordChanged = ('' === this.k_passwordField.k_getEmptyText());
k_data.useKManager = kerio.waw.shared.k_CONSTANTS.k_SMTP_TYPE.k_KERIO_MANAGER === k_data.k_serverType;
k_data.useAppManager = kerio.waw.shared.k_CONSTANTS.k_SMTP_TYPE.k_APP_MANAGER === k_data.k_serverType;
delete k_data.k_serverType;
return { config: k_data };
}, 
k_test: function() {
var k_lib = kerio.lib;
k_lib.k_ui.k_showDialog({
k_sourceName: 'addEmailAddress',
k_objectName: 'k_smtpTest',
k_params: {
k_parentDialog: this,
k_callback: this.k_requestTest,
k_resetValue: false, k_initValue: kerio.waw.status.k_userSettings.k_get('smtpTestEmail', '')
}
}); }, 
k_requestTest: function(k_email, k_editor) {
var
k_tabPage = this.k_parentWidget,
k_params;
k_editor.k_showMask( kerio.lib.k_tr('Sending email…', 'advancedOptionsList'), 1);
kerio.waw.status.k_userSettings.k_set('smtpTestEmail', k_email);
k_params = {
k_jsonRpc: {
method: 'SmtpRelay.test',
params: kerio.lib.k_cloneObject(this.k_saveData(), {'address': k_email})
},
k_callback: this.k_requestTestCallback,
k_callbackParams: k_editor,
k_scope: this,
k_requestOwner: k_tabPage
};
kerio.lib.k_ajax.k_request(k_params); return false;
}, 
k_requestTestCallback: function(k_response, k_success, k_editor) {
var k_lib = kerio.lib;
k_editor.k_hide(); if (k_success && kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
k_lib.k_alert(
k_lib.k_tr('SMTP Test', 'advancedOptionsList'),
k_lib.k_tr('The email has been sent. Please, check your mailbox.', 'advancedOptionsList')
);
} } }); k_forms.k_dnsForm.k_addReferences({

k_getLoadRequests: function(k_canReloadData) {
var k_requests;
if (!k_canReloadData) {
return [];
}
if (this.k_loadRequests) {
k_requests = this.k_loadRequests;
}
else {
k_requests = [
{
k_method:  'DynamicDns.get',
k_handler: this.k_applyParams
},
{
k_method:  'DynamicDns.getStatus',
k_handler: this.k_updateDnsCallback
}
]; this.k_loadRequests = k_requests;
} if (!this.k_providersLoaded) { k_requests = kerio.lib.k_cloneObject(k_requests); k_requests.push({
k_method:  'DynamicDns.getProviders',
k_handler: this.k_fillProviders
});
}
this.k_updating = false; this.k_interfaceLoader.k_sendRequest();
return k_requests;
}, 
k_getSaveRequests: function() {
var
k_requests = [],
k_data;
if (this.k_isChanged(true)) { k_data = this.k_saveData();
k_requests.push({
k_method: 'DynamicDns.set',
k_params: k_data
});
if (k_data.config.enabled) { k_requests.push({
k_method: 'DynamicDns.update'
});
}
}
return k_requests;
}, 
k_applyParams: function(k_params) {
this.k_dataStore = k_params.config;
this.k_reset();
this.k_setData(k_params.config, true); kerio.waw.shared.k_methods.k_initPasswordField(this.k_passwordField);
this.k_setVisible(['k_containerDynDnsUpdate'], k_params.config.enabled); if (this.k_providersLoaded && '' === k_params.config.provider) {
this.k_getItem('provider').k_selectByIndex(0);
}
this.k_interfaceLoader.k_selectValue(k_params.config.customIface, true);
},

k_saveData: function() {
var k_data = this.k_getData(true); k_data.credentials.passwordChanged = ('' === this.k_passwordField.k_getEmptyText());
k_data.customIface = {
id: k_data.customIface
};
return { config: k_data };
}, 
k_fillProviders: function(k_data) {
var
k_providers = k_data.providers,
k_providerField = this.k_getItem('provider'),
k_i,
k_length = k_providers.length;
for (k_i = 0; k_i < k_length; k_i++) {
k_providerField.k_addData({ k_value: k_providers[k_i] });
}
if ('' === k_providerField.k_getValue()) {
k_providerField.k_selectByIndex(0);
}
this.k_providersLoaded = true;
}, 
k_updateDns: function(k_update){
var k_resultField;
if (this.k_updating) {
return; }
k_update = (true === k_update); if (k_update && this.k_isChanged(true)) {
kerio.waw.status.k_currentScreen.k_showContentChangedAlert();
return;
}
this.k_updating = k_update; if (k_update) {
k_resultField = this.k_dnsUpdateResult;
k_resultField.k_removeClassName('error');
k_resultField.k_addClassName('checking');
k_resultField.k_setValue({
status: this.k_updatingMessage
});
}
kerio.waw.shared.k_methods.k_sendBatch({
k_requests: k_update ? this.k_updateRequests : this.k_getStatusRequests,
k_callback: this.k_updateDnsCallback,
k_callbackParams: {
k_isBatch: true,
k_isUpdate: k_update
},
k_scope: this,
k_requestOwner: this.k_parentWidget });
}, 
k_updateDnsCallback: function(k_response, k_success, k_params) {
k_params = k_params || {};
k_success = (false !== k_success);
var
k_STATUS = kerio.waw.shared.k_CONSTANTS.DynamicDnsStatus,
k_ICON_OK = '', k_ICON_ERROR = 'error', k_ICON_UPDATE = 'checking', k_isBatch = (true === k_params.k_isBatch),
k_isUpdate = (true === k_params.k_isUpdate),
k_statusIndex = (k_isUpdate ? 1 : 0), k_resultField,
k_icon,
k_message;
if (k_isBatch) {
if (!k_success || !k_response.k_isOk) {
k_success = false;
} else {
k_response = k_response.k_decoded.batchResult[k_statusIndex]; }
}
if (k_success) {
switch (k_response.status) {
case k_STATUS.DynamicDnsOk:
k_icon = k_ICON_OK;
k_message = this.k_updateOkMessage;
break;
case k_STATUS.DynamicDnsError:
k_icon = k_ICON_ERROR;
k_message = kerio.waw.shared.k_methods.k_translateErrorMessage(k_response.message);
break;
case k_STATUS.DynamicDnsUpdate:
k_icon = k_ICON_UPDATE;
k_message = kerio.waw.shared.k_methods.k_translateErrorMessage(k_response.message);
if (this.k_dataStore.enabled) { this.k_startUpdateTask();
}
break;
}
}
else {
k_icon = k_ICON_ERROR;
k_message = kerio.lib.k_tr('Error in communication with server', 'common');
return;
}
k_resultField = this.k_dnsUpdateResult;
k_resultField.k_removeClassName([k_ICON_ERROR, k_ICON_UPDATE]);
k_resultField.k_addClassName(k_icon);
k_resultField.k_setValue({ status: k_message });
this.k_updating = false; }, 
k_startUpdateTask: function() {
var
k_tasks = kerio.waw.shared.k_tasks,
k_taskName = this.k_updateTaskName;
if (k_tasks.k_isDefined(k_taskName)) {
if (!k_tasks.k_start(k_taskName)) {
k_tasks.k_resume(k_taskName, true);
}
return;
}
k_tasks.k_add({
k_id: k_taskName,
k_interval: 5000, k_scope: this,
k_startNow: true,

k_run: function() {
this.k_updateDns();
return false;
}
});
}
}); k_forms.k_backupForm.k_addReferences({

k_getLoadRequests: function(k_canReloadData) {
if (!k_canReloadData) {
return [];
}
if (!this.k_getStatusRequest) {
this.k_getStatusRequest = {
k_jsonRpc: {
method: 'ConfigurationBackup.getStatus'
},
k_callback: this.k_getBackupStatusTaskCallback,
k_scope: this
};
}
if (!this.k_loadRequests) {
this.k_loadRequests = [
{
k_method: 'ConfigurationBackup.get',
k_handler: this.k_applyParams
}
];
this.k_loadRequests.push({
k_method: this.k_getStatusRequest.k_jsonRpc.method,
k_handler: this.k_setBackupStatus
});
}
return this.k_loadRequests;
},

k_applyParams: function(k_params) {
var
k_BACKUP_TARGET = kerio.waw.shared.k_CONSTANTS.Target,
k_config = k_params.config,
k_isFtpBackup = k_BACKUP_TARGET.TargetFtpServer === k_config.target;
this.k_originalData = kerio.lib.k_cloneObject(k_config);
if (k_isFtpBackup) {
k_config.k_ftpUsername = k_config.username;
k_config.k_ftpUrl = k_config.url;
k_config.k_ftpPassword = k_config.password;
}
this.k_setData(k_config, true);
kerio.waw.shared.k_methods.k_initPasswordField(this.k_ftpPassword);
this.k_isFtpBackup = k_isFtpBackup;
this.k_isMyKerioBackup = k_BACKUP_TARGET.TargetMyKerio === k_config.target;
},

k_getBackupStatusTaskCallback: function(k_response) {
if (kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
this.k_setBackupStatus(k_response.k_decoded, true);
}
},

k_setBackupStatus: function(k_response) {
var
k_shared = kerio.waw.shared,
k_methods = k_shared.k_methods,
k_tasks = k_shared.k_tasks,
k_PHASES = k_shared.k_CONSTANTS.ConfigurationBackupPhase,
k_status = k_response.status  || {},
k_isSetUrl = '' !== k_status.url && undefined !== k_status.url,
k_visibleLink = '',
k_inProgress = false,
k_displayValue,
k_substringParsed,
k_url;
if (!k_tasks.k_isDefined(this.k_backupTaskId)) {
k_tasks.k_add({
k_id: this.k_backupTaskId,
k_interval: 2000,
k_scope: this,
k_startNow: true,
k_startSuspended: true,

k_run: function(){
kerio.lib.k_ajax.k_request(this.k_getStatusRequest);
return false;
}
});
}
switch (k_status.phase) {
case k_PHASES.ConfigurationBackupOk:
k_displayValue = k_methods.k_formatTimeSpan(k_status.lastBackup);
this.k_lastBackupTime.k_removeClassName([this.k_statusProgressClass, this.k_statusFailedClass]);
break;
case k_PHASES.ConfigurationBackupInProgress:
k_inProgress = true;
k_displayValue = this.k_statusProgressText;
this.k_lastBackupTime.k_removeClassName(this.k_statusFailedClass);
this.k_lastBackupTime.k_addClassName(this.k_statusProgressClass);
break;
default: this.k_lastBackupTime.k_removeClassName(this.k_statusProgressClass);
this.k_lastBackupTime.k_addClassName(this.k_statusFailedClass);
if  (k_status.errorMessage) {
k_displayValue = kerio.lib.k_tr(k_status.errorMessage, 'serverMessage');
}
else {
k_displayValue = kerio.lib.k_tr('Uknown error.', 'advancedOptionsList');
}
break;
}
if (k_inProgress) {
k_tasks.k_resume(this.k_backupTaskId, true);
}
else {
k_tasks.k_suspend(this.k_backupTaskId);
this.k_btnBackup.k_setDisabled(!this.k_originalData.enabled);
}
this.k_lastBackupTime.k_setValue(k_displayValue);
this.k_backupLocationRow.k_setVisible(k_isSetUrl);
if (k_isSetUrl) {
k_url = k_status.url;
if (this.k_isFtpBackup) {
if (0 !== k_url.toLowerCase().indexOf('ftp')) {
k_url = 'ftp://' + k_url;
}
k_visibleLink = k_url;
}
else {
k_substringParsed = k_url.split('/');
if (k_substringParsed.length) {
k_visibleLink = k_substringParsed[0] + '//' + k_substringParsed[2];
if (this.k_isMyKerioBackup) {
k_visibleLink += '/backup';
}
}
}
this.k_backupLocation.k_setValue({k_url: k_url, k_visibleLink: k_visibleLink});
}
},

k_getSaveRequests: function() {
var
k_BACKUP_TARGET = kerio.waw.shared.k_CONSTANTS.Target,
k_originalData = this.k_originalData,
k_data = this.k_getData(),
k_requests = [];
switch (k_data.target) {
case k_BACKUP_TARGET.TargetMyKerio:
break;
case k_BACKUP_TARGET.TargetAppManager:
break;
case k_BACKUP_TARGET.TargetFtpServer:
k_originalData.username = k_data.k_ftpUsername;
k_originalData.password = k_data.k_ftpPassword;
k_originalData.url = k_data.k_ftpUrl;
break;
}
k_originalData.target = k_data.target;
k_originalData.enabled = k_data.enabled;
if ('' === k_originalData.password && k_data.target === k_originalData.target) {
delete k_originalData.password;
}
if (this.k_isChanged(true)) {
k_requests.push({
k_method: 'ConfigurationBackup.set',
k_params: {
config: k_originalData
}
});
}
return k_requests;
},

k_backupNow: function() {
if (this.k_isChanged(true)) {
kerio.waw.status.k_currentScreen.k_showContentChangedAlert();
}
else {
if (!this.k_backupNowRequests) {
this.k_backupNowRequests = {
k_requests: [
{
method: 'ConfigurationBackup.backupNow'
},
{
method: 'ConfigurationBackup.getStatus'
}
],
k_callback: this.k_backupNowCallback,
k_scope: this
};
}
kerio.waw.shared.k_methods.k_sendBatch(this.k_backupNowRequests);
}
},

k_backupNowCallback: function(k_response) {
if (kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
this.k_setBackupStatus(k_response.k_decoded.batchResult[1], true);
}
}
});
}, 
k_switchToAuditor: function(k_widget, k_forms) {
if (k_forms.k_smtpForm) {
k_forms.k_smtpForm.k_setReadOnly([
'k_smtpTypeFieldset',
'k_smtpServerFieldset' ]); }
if (k_forms.k_dnsForm) {
k_forms.k_dnsForm.k_setReadOnly([
'enabled', 'k_containerDynDnsSettings' ]); }
if (k_forms.k_backupForm) {
k_forms.k_backupForm.k_setReadOnlyAll();
k_forms.k_backupForm.k_setVisible(['k_importLink'], false);
}
}
}; 