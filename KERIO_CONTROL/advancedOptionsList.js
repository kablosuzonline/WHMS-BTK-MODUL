

kerio.waw.ui.advancedOptionsList = {
k_encryptionStateEnum: {
encrypted: 'encrypted',
decrypted: 'decrypted'
},
k_encryptionActionEnum: {
encrypting: 'encrypting',
decrypting: 'decrypting',
resizing: 'resizing',
saving: 'saving',
restoring: 'restoring'
},
k_encryptionOperation:{
no_operation: 'no_operation',
encryption: 'encryption',
decryption: 'decryption',
resizing: 'resizing'
},

k_init: function(k_objectName) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared =  kerio.waw.shared,
k_DEFINITIONS = k_shared.k_DEFINITIONS,
k_getDefinition = k_DEFINITIONS.k_get,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_closureLocalNamespace = k_objectName + '_',
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_isLinux = k_shared.k_methods.k_isLinux(),
k_urlTemplate = '<a href="{k_url}" target="_blank">{k_url}</a>',
k_closureTabs = [],  k_closureForms = [], k_idPostfixUpload = '_' + 'k_upload',
k_idPostfixDownload = '_' + 'k_download',
k_trPleaseWait = '&nbsp; &nbsp; &nbsp; &nbsp;' + k_tr('Please wait, the file is being uploaded…', 'advancedOptionsList'),
k_trPleaseWaitUrl = '&nbsp; &nbsp; &nbsp; &nbsp;' + k_tr('Please wait, the file is being downloaded…', 'advancedOptionsList'),
k_updateCheckerDownload,
k_tabPage, k_tabPageCfg,
k_toolbar, k_toolbarCfg,
k_systemCfgFormLabelWidth,
k_systemCfgFormFieldWidth,
k_systemCfgFormCfg,
k_webFormCfg,
k_sslFormCfg,
k_updateFormCfg,
k_updateForm,
k_dataEncryptionFormCfg,
k_addForm,
k_showUploadAnotherFile,
k_reloadDataOnApplyResetHandler;

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
}); return k_form;
}; 
if (k_isLinux) {
k_systemCfgFormLabelWidth = 165;
k_systemCfgFormFieldWidth = 300;
function enableUefiSupport() {
kerio.lib.k_confirm(
k_tr('Confirm Action', 'common'),
k_tr('Are you sure you want to enable UEFI support?', 'advancedOptionsList'),
function(k_result) {
if (k_result !== 'yes') {
return;
}
kerio.waw.requests.k_sendBatch({
k_jsonRpc: {
method: 'SystemConfig.setUefiSupport'
},
k_callback: function(k_response, k_success) {
if (k_success) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('UEFI support', 'advancedOptionsList'),
k_msg: kerio.lib.k_tr('UEFI support activated. Please restart the server in order for the changes to take effect.', 'advancedOptionsList')
});
}
else {
kerio.waw.requests.k_reportRestartFail();
}
}
},
{
k_mask: false
});
}, this ); }
k_systemCfgFormCfg = {

k_onChange: function(k_form) {
if (k_form.k_keepContentStatusUnchanged) {
return;
}
kerio.adm.k_framework.k_enableApplyReset();
},k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('System settings', 'advancedOptionsList'),
k_labelWidth: k_systemCfgFormLabelWidth,
k_items: [
{
k_type: 'k_display',
k_caption: k_tr('%1 server name:', 'advancedOptionsList', { k_args: [ kerio.waw.shared.k_DEFINITIONS.k_PRODUCT_NAME ]}),
k_id: 'hostname',
k_className: 'systemHostName',
k_width: k_systemCfgFormFieldWidth
},
{
k_type: 'k_checkbox',
k_id: 'forceHostname',
k_isLabelHidden: true,
k_isChecked: false,
k_option: k_tr('Force hostname for VPN clients', 'advancedOptionsList')
},
{
k_type: 'k_display',
k_id: 'k_hostnameInfo',
k_isLabelHidden: true,
k_indent: 1,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('You can change the hostname when %1joining a directory service domain%2. Alternatively, you can %3change the Web Interface URL%4.', 'advancedOptionsList', {
k_args: [
'<a id="k_joinDomain">', '</a>',
'<a id="k_changeWebIfaceUrl">', '</a>'
], k_isSecure: true}
),
k_isSecure: true,
k_onLinkClick: function(k_form, k_item, k_id) {
switch (k_id) {
case 'k_joinDomain':
kerio.waw.status.k_currentScreen.k_gotoNode('domainsAndUserLogin', 'k_adDomainForm');
break;
case 'k_changeWebIfaceUrl':
kerio.waw.status.k_currentScreen.k_gotoNode('advancedOptions', 'k_webForm');
break;
}
}
}
]},
{
k_type: 'k_fieldset',
k_className: 'uefiFieldset',
k_caption: k_tr('UEFI support', 'advancedOptionsList'),
k_items: [
{
k_type: 'k_display',
k_id: 'k_uefiSupportStatus',
k_className: 'uefiSupportStatus statusDisabled',
k_isSecure: true,
k_value: {
k_info: k_tr('Not enabled. You can %1enable%2 it to boot in UEFI mode.', 'advancedOptionsList', {
k_args: ['<a id="k_enableUefiSupport">', '</a>'],
k_isSecure: true
}),
},
k_template: '<i class="icon"></i>{k_info}',
k_onLinkClick: function(k_form, k_item, k_id) {
enableUefiSupport();
}
},
{
k_type: 'k_display',
k_id: 'k_uefiConversionInfo',
k_isLabelHidden: true,
k_indent: 0,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('%1 needs to be restarted to apply changes, please backup your data before triggering this operation.', 'advancedOptionsList', {
k_args: [
kerio.waw.shared.k_DEFINITIONS.k_PRODUCT_NAME
], k_isSecure: true}
),
k_isSecure: true,
k_onLinkClick: function(k_form, k_item, k_id) {
switch (k_id) {
case 'k_joinDomain':
kerio.waw.status.k_currentScreen.k_gotoNode('domainsAndUserLogin', 'k_adDomainForm');
break;
case 'k_changeWebIfaceUrl':
kerio.waw.status.k_currentScreen.k_gotoNode('advancedOptions', 'k_webForm');
break;
}
}
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Date and time settings', 'advancedOptionsList'),
k_labelWidth: k_systemCfgFormLabelWidth,
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_caption: k_tr('Current date and time:', 'advancedOptionsList'),
k_id: 'dateTime',
k_isReadOnly: true,
k_width: k_systemCfgFormFieldWidth
},
{
k_type: 'k_formButton',
k_id: 'k_btnChange',
k_caption: k_tr('Change…', 'advancedOptionsList'),

k_onClick: function(k_form) {
k_form.k_getSystemDateTime();
} }
]},
{
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_id: 'ntpServer.enabled',
k_option: k_tr('Keep synchronized with NTP server', 'advancedOptionsList'),

k_onChange: function(k_form, k_item, k_value) {
k_form.k_setDisabled(['ntpServer.value'], !k_value);
}},
{
k_caption: k_tr('NTP server name:', 'advancedOptionsList'),
k_id: 'ntpServer.value',
k_width: k_systemCfgFormFieldWidth,
k_maxLength: 1023,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isHostsList'
}
},
{
k_type: 'k_display',
k_caption: ' ', k_value: k_tr('Use semicolons (%1) to separate individual entries.', 'dnsForwarderEditor', { k_args: [' ; '], k_isSecure: true})
}
]},
{
k_type: 'k_fieldset',
k_caption: k_tr('Time zone settings', 'advancedOptionsList'),
k_labelWidth: k_systemCfgFormLabelWidth,
k_items: [
{
k_type: 'k_select',
k_id: 'timeZoneId',
k_fieldDisplay: 'name',
k_fieldValue: 'id',
k_localData: [],k_caption: k_tr('Server time zone:', 'advancedOptionsList'),

k_onChange: function(k_form, k_select, k_value) {
k_form.k_isReloadDelayed = true;
var selectedTimeZone = k_form.k_getTimeZoneById(k_value);
if (selectedTimeZone && selectedTimeZone.summerOffset !== selectedTimeZone.winterOffset) {
k_form.k_dst.k_setValue(
kerio.lib.k_tr('(This time zone has a daylight saving time period)', 'activation')
);
} else {
k_form.k_dst.k_setValue('');
}
}},
{
k_id: 'k_dst',
k_type: 'k_display',
k_caption: ' ',
k_value: ''
}
]}
]};k_addForm({
k_id: 'k_systemCfgForm',
k_config: k_systemCfgFormCfg,
k_caption: k_tr('System Configuration', 'advancedOptionsList'),
k_references: { k_timeZonesData: undefined,
k_serverDateTime: {},
k_keepContentStatusUnchanged: false,
k_isReloadDelayed: false
},
k_items: { k_timeZoneIdElement: 'timeZoneId',
k_dateTimeElement: 'dateTime'
}
}); }
k_webFormCfg = {
k_restrictBy: {
k_restartWarn: true,
k_isSecureConnection: kerio.waw.shared.k_methods.k_isConnectionSecured()
},
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Web interface', 'advancedOptionsList'),
k_labelWidth: 230,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'useSsl',
k_isLabelHidden: true,
k_isChecked: true,
k_option: k_tr('Force SSL secured connection (recommended)', 'advancedOptionsList'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setWebUrls(k_isChecked);
k_form.k_setWebUrls();
kerio.adm.k_framework.k_enableApplyReset();
}
},
{
k_restrictions: {
k_isSecureConnection: [ false ]
},
k_type: 'k_display',
k_isLabelHidden: true,
k_isSecure: true,
k_isHidden: true,
k_id: 'k_forceSslWarning',
k_indent: 1,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: '<b>' + k_tr('If you force SSL connection, you will need to login again to the Kerio Control Administration.', 'advancedOptionsList') + '</b> '
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_checkbox',
k_id: 'hostname.enabled',
k_width: 230,
k_option: k_tr('Use specified hostname:', 'advancedOptionsList'),
k_isLabelHidden: true,
k_onChange: function(k_form, k_item, k_value) {
k_form.k_setDisabled('hostname.value', !k_value);
k_form.k_setWebUrls();
kerio.adm.k_framework.k_enableApplyReset();
}
},
{
k_id: 'hostname.value',
k_isLabelHidden: true,
k_isDisabled: true,
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME,
k_checkByteLength: true,
k_width: 350,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isHostIp'
},
k_onChange: function(k_form) {
k_form.k_setWebUrls();
kerio.adm.k_framework.k_enableApplyReset();
}
}
]
},
{
k_type: 'k_display',
k_id: 'webIfaceUrl',
k_caption: k_tr('Web Interface is accessible at:', 'advancedOptionsList'),
k_className: 'selectable link textLink',
k_template: k_urlTemplate
},
{
k_type: 'k_display',
k_id: 'webAdminUrl',
k_caption: k_tr('Administration is accessible at:', 'advancedOptionsList'),
k_className: 'selectable link textLink',
k_template: k_urlTemplate
}
]
},
k_shared.k_methods.k_getSslCertificateFields('k_webserver', '', {
k_restartWarn: kerio.waw.shared.k_methods.k_isConnectionSecured(),
k_inputsWidth: 350
}),
{
k_type: 'k_fieldset',
k_caption: k_tr('Login page customization', 'advancedOptionsList'),
k_labelWidth: 110,
k_items: [
{
k_id: 'customizedBrand.enabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Use custom logo on login page, guest welcome page, denial pages and user alerts', 'advancedOptionsList'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled('customizableLogoSettings', !k_isChecked);
kerio.adm.k_framework.k_enableApplyReset();
}
},
{
k_id: 'customizableLogoSettings',
k_isDisabled: true,
k_type: 'k_container',
k_items: [
{
k_id: 'customizedBrand.pageTitle',
k_width: 325,
k_caption: k_tr('Page title:', 'advancedOptionsList'),
k_emptyText: 'Kerio Control',
k_className: 'repairEmptyText',
k_onChange: function() {
kerio.adm.k_framework.k_enableApplyReset();
}
},
{
k_type: 'k_row',
k_className: 'customizableLogoContainer',
k_items: [
{
k_width: 110,
k_isLabelHidden: true,
k_type: 'k_display',
k_value: k_tr('Logo (*.png):', 'advancedOptionsList')
},
{
k_id: 'customLogo',
k_type: 'k_image',
k_width: 327,
k_height: 80,
k_className: 'imageBorder',
k_itemClassName: 'customizableLogo',
k_value: ''
},
{
k_type: 'k_formUploadButton',
k_caption: k_tr('Change…', 'advancedOptionsList'),
k_id: 'logoUpload',
k_remoteData: {
k_isAutoUpload: false, k_jsonRpc: {
method: 'WebInterface.uploadImage',
params: {
isFavicon: false
}
}
},

k_onChange: function (k_form, k_item, k_value) {
var
k_nameParts = k_value.toLowerCase().split('.');
if ('png' === k_nameParts[k_nameParts.length - 1]) {
this.k_upload();
}
else {
kerio.lib.k_alert({
k_icon: 'warning',
k_title: kerio.lib.k_tr('Incorrect Input', 'common'),
k_msg: kerio.lib.k_tr('Please select only images in png format!', 'advancedOptionsList')
});
k_item.k_reset();
}
},

k_onUpload: function(k_form, k_item, k_response, k_success) {
var
k_timestamp = new Date().getTime();
if (k_success && k_response.k_isOk) {
k_form.k_imageChanged = true;
kerio.waw.k_hacks.k_setImageBackgroundForImageField(k_form.k_customLogoImg, '/admin/internal/brand_logo_preview.png');
kerio.adm.k_framework.k_enableApplyReset();
}
}
}
]
},
{
k_type: 'k_display',
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_caption: ' ',
k_value: k_tr('Recommended sizes are 300px wide and 60px high.', 'advancedOptionsList')
},
{
k_type: 'k_row',
k_items: [
{
k_width: 110,
k_isLabelHidden: true,
k_type: 'k_display',
k_value: k_tr('Favicon (*.ico):', 'advancedOptionsList')
},
{
k_id: 'customFavicon',
k_type: 'k_image',
k_width: 16,
k_height: 16,
k_className: 'imageBorder',
k_itemClassName: 'customizableFavicon',
k_value: ''
},
{
k_type: 'k_formUploadButton',
k_caption: k_tr('Change…', 'advancedOptionsList'),
k_id: 'faviconUpload',
k_remoteData: {
k_isAutoUpload: false, k_jsonRpc: {
method: 'WebInterface.uploadImage',
params: {
isFavicon: true
}
}
},

k_onChange: function (k_form, k_item, k_value) {
var
k_nameParts = k_value.toLowerCase().split('.');
if ('ico' === k_nameParts[k_nameParts.length - 1]) {
this.k_upload();
}
else {
kerio.lib.k_alert({
k_icon: 'warning',
k_title: kerio.lib.k_tr('Incorrect Input', 'common'),
k_msg: kerio.lib.k_tr('Please select only icons in ico format!', 'advancedOptionsList')
});
k_item.k_reset();
}
},

k_onUpload: function(k_form, k_item, k_response, k_success) {
var
k_timestamp = new Date().getTime(),
k_imageExtWidget = k_form.k_customFaviconImg.k_extWidget;
if (k_success && k_response.k_isOk) {
k_form.k_imageChanged = true;
k_imageExtWidget.setValue.defer(100, k_imageExtWidget, [kerio.lib.k_ajax.k_changeDownloadUrlForMyKerio('/admin/internal/brand_fav_preview.ico?t=' + k_timestamp)]);
kerio.adm.k_framework.k_enableApplyReset();
}
}
}
]
}
]
}
]
}
] }; k_addForm({
k_id: 'k_webForm',
k_config: k_webFormCfg,
k_caption: k_tr('Web Interface', 'advancedOptionsList'),
k_references: {
k_origData: null,
k_imageChanged: false
},
k_items: {
k_webIfaceUrlField: 'webIfaceUrl',
k_webAdminUrlField: 'webAdminUrl',
k_checkboxUseSsl:   'useSsl',
k_customLogoImg: 'customLogo',
k_customFaviconImg: 'customFavicon'
}
}); 
if (!k_isLinux) {
k_sslFormCfg = {
k_restrictBy: {
k_restartWarn: false
},
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('SSL-VPN', 'advancedOptionsList'),
k_labelWidth: 70,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'enabled',
k_isLabelHidden: true,
k_option: k_tr('Enable Kerio Clientless SSL-VPN server', 'advancedOptionsList'),

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled(['port'], !k_isChecked);
kerio.adm.k_framework.k_enableApplyReset();
}},
k_getDefinition('k_portField', {
k_id: 'port',
k_caption: k_tr('TCP port:', 'advancedOptionsList'),
k_isDisabled: true,
k_indent: 1,

k_onChange: function() {
kerio.adm.k_framework.k_enableApplyReset();
}
}) ]
},
k_shared.k_methods.k_getSslCertificateFields('k_webserver')
]
}; k_addForm({
k_id: 'k_sslForm',
k_config: k_sslFormCfg,
k_caption: k_tr('SSL-VPN', 'advancedOptionsList'),
k_references: {
},
k_items: {
k_sslEnabledField: 'enabled',
k_sslPortField: 'port'
}
}); } 

k_showUploadAnotherFile = function(k_form) {
k_form.k_textUploadInfo.k_setValue(k_form.k_trPleaseWait);
k_form.k_rowImageProgress.k_setVisible(false);
k_form.k_rowImageFile.k_setVisible(true);
k_form.k_btnUploadAnotherFile.k_setVisible(false);
k_form.k_btnStartUpgrade.k_setVisible(false);
};
k_updateCheckerDownload = k_tr('Upgrade to new version', 'advancedOptionsList');
k_reloadDataOnApplyResetHandler = function(k_toolbar, k_button) {
var
k_tabPage = this.k_getMainWidget().k_params.k_relatedWidget.k_getMainWidget();
kerio.waw.shared.k_methods.k_definitionApplyResetHandler(k_toolbar, k_button);
kerio.waw.shared.k_tasks.k_resume(k_tabPage.k_forms.k_updateForm.k_UPDATE_TASK_ID);
};
k_updateFormCfg = {
k_restrictBy: {
k_isIos: kerio.waw.shared.k_methods.k_isIos(),
k_isLinux: k_isLinux,
k_isAuditor: k_isAuditor
},
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_id: 'k_updateStatusFieldset',
k_caption: k_updateCheckerDownload,
k_isHidden: true, k_items: [
{
k_type: 'k_display',
k_id: 'k_updateStatus',
k_className: 'dnsUpdateStatus',
k_isSecure: true,
k_template: '&nbsp; &nbsp; &nbsp; &nbsp;{k_status}'
},
{
k_type: 'k_display',
k_id: 'k_updateInfo',
k_indent: 1,
k_isHidden: true,
k_className: 'selectable link textLink',
k_template: '<a href="{k_infoUrl}" target="_blank">' + k_tr('More information…', 'advancedOptionsList') + '</a>'
},
{
k_type: 'k_container',
k_id: 'k_containerSheduled',
k_indent: 1,
k_isHidden: true,
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_id: 'k_scheduled',
k_template: k_tr('The automatic upgrade is scheduled for {date}.', 'advancedOptionsList'),
k_value: {
date: ''
}
}
]
},
{
k_type: 'k_display',
k_id: 'k_containerDownloadFailed',
k_className: 'dnsUpdateStatus error',
k_value: '&nbsp; &nbsp; &nbsp; &nbsp;' + k_tr('Error while downloading update. Please try again.', 'advacedOptionsList'),
k_isSecure: true,
k_isHidden: true
},
{
k_type: 'k_display',
k_id: 'k_containerUpgradeFailed',
k_className: 'dnsUpdateStatus error',
k_value: '&nbsp; &nbsp; &nbsp; &nbsp;' + k_tr('Error while upgrading. Please try again.', 'advacedOptionsList'),
k_isSecure: true,
k_isHidden: true
},
{
k_type: 'k_container',
k_id: 'k_containerDownloadNow',
k_isHidden: true,
k_indent: 1,
k_items: [
{
k_type: 'k_formButton',
k_id: 'k_btnDownloadNow',
k_mask: false,
k_style: 'margin-top: 10px;',
k_caption: k_tr('Download', 'advacedOptionsList'),
k_onClick: function(k_form) {
k_form.k_downloadUpdate();
}
}
]
},
{
k_type: 'k_container',
k_id: 'k_containerDownloading',
k_isHidden: true,
k_indent: 1,
k_items: [
{
k_type: 'k_columns',
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Download in progress:', 'advancedOptionsList')
},
{
k_type: 'k_progressBar',
k_id: 'k_downloadProgress',
k_width: 300,
k_value: 33,
k_maxValue: 100,
k_exceeded: {
k_message: '<b>' + k_tr('Download has failed.', 'advancedOptionsList') + '</b>'
}
}
]
},
{
k_type: 'k_formButton',
k_id: 'k_btnCancelDownload',
k_mask: false,
k_caption: k_tr('Cancel', 'common'),
k_onClick: function(k_form) {
k_form.k_cancelDownload();
}
}
]
},
{
k_type: 'k_container',
k_id: 'k_containerUpgradeNow',
k_indent: 1,
k_isHidden: true,
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Ready to upgrade to the new version. Click the button below to upgrade.', 'advancedOptionsList')
},
{
k_type: 'k_formButton',
k_mask: false,
k_caption: k_tr('Upgrade Now', 'advacedOptionsList'),
k_onClick: function(k_form) {
k_form.k_askToUpgrade();
}
}
]
}
]
},
{
k_type: 'k_fieldset',
k_id: 'k_updateSettings',
k_caption: k_tr('Software update settings', 'advancedOptionsList'),
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_row',
k_id: 'k_updateCheckTimeRow',
k_isHidden: false,
k_items: [
{
k_type: 'k_display',
k_id: 'k_lastCheckTime',
k_isLabelHidden: true,
k_template: k_tr('Last update check: {time}.', 'advancedOptionsList') + ' {result}',
k_value: {
time: k_tr('Never', 'advancedOptionsList'),
result: k_tr('No new version is available.', 'advancedOptionsList')
}
}
]
},
{
k_type: 'k_row',
k_id: 'k_updateInProgressRow',
k_isHidden: true,
k_items: [
{
k_type: 'k_image',
k_className: 'gridLoading',
k_style: 'padding-top: 4px',
k_isLabelHidden: true,
k_value: kerio.lib.k_getSharedConstants('kerio_web_WeblibPath') + '/ext/extjs/resources/images/default/grid/grid-loading.gif?v=8629',
k_width: 16,
k_height: 16
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Update check in progress.', 'advancedOptionsList')
}
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_checkbox',
k_id: 'enabled',
k_isLabelHidden: true,
k_isHidden: true,
k_option: k_tr('Periodically check for new versions', 'advancedOptionsList'),
k_width: 'auto'
},
{
k_type: 'k_formButton',
k_id: 'k_btnUpdate',
k_caption: k_tr('Check Now', 'advancedOptionsList'),
k_style: 'margin-left: 12px; margin-bottom: 6px;',

k_onClick: function(k_form) {
k_form.k_changeStatus('k_check');
k_form.k_setDisabled(['k_btnUpdate'], true);
k_form.k_setVisible(['k_updateCheckTimeRow'], false);
k_form.k_setVisible(['k_updateInProgressRow'], true);
}
}
]
},
{
k_type: 'k_columns',
k_indent: 1,
k_items: [
{
k_type: 'k_checkbox',
k_width: 400,
k_id: 'download',
k_isLabelHidden: true,
k_option: k_tr('Download and upgrade to new versions automatically in time range:', 'advancedOptionsList'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled('autoUpdateInterval', !k_isChecked);
}
},
{
k_type: 'k_definitionSelect',
k_id: 'autoUpdateTimeRange',
k_width: 175,
k_isLabelHidden: true,
k_definitionType: 'k_timeRange',
k_showApplyReset: true,
k_allowFiltering: true,
k_pageSize: 500,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: [{
k_id: kerio.waw.shared.k_CONSTANTS.k_NONE,
k_name: k_tr('Anytime', 'timeRangeList')
}],
k_onApplyResetHandler: k_reloadDataOnApplyResetHandler
}
]
},
{
k_type: 'k_checkbox',
k_id: 'betaVersion',
k_indent: 1,
k_option: k_tr('Check also for beta versions', 'advancedOptionsList')
},
{
k_type: 'k_columns',
k_id: 'k_containerStatistics',
k_items: [
{
k_type: 'k_checkbox',
k_id: 'sendClientStatistics',
k_isLabelHidden: true,
k_option: k_tr('Send anonymous usage statistics to Kerio Technologies.', 'advancedOptionsList')
},
{
k_type: 'k_display',
k_template: ' <a>{k_link}</a>',
k_value: {
k_link: k_tr('View sample data', 'advancedOptionsList')
},
k_width: 125,
k_onLinkClick: function(k_form, k_item, k_id) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'contributeDialogSample'
});
}
}
]
}
]
},
{
k_restrictions: {
k_isIos: [ false ],
k_isAuditor: [ false ]
},
k_type: 'k_fieldset',
k_caption: k_tr('Upgrade by uploading binary image file', 'advancedOptionsList'),
k_height: 125,
k_items: [
{
k_type: 'k_row',
k_height: 25,
k_id: 'k_rowImageProgress',
k_isHidden: true,
k_items: [
{
k_type: 'k_display',
k_className: 'dnsUpdateStatus inProgress',
k_id: 'k_uploadInfo',
k_value: k_trPleaseWait,
k_isSecure: true,
k_isLabelHidden: true
}
]
},
{
k_type: 'k_row',
k_height: 25,
k_id: 'k_rowImageFile',
k_items: [
{
k_id: 'k_imageFileName',
k_caption: k_tr('Upgrade image file (*.img):', 'advancedOptionsList'),
k_style: 'display: none;',
k_isAutoLabelWidth: true,
k_width: 1
},
{
k_type: 'k_formUploadButton',
k_id: 'uploadImage',
k_caption: k_tr('Select File…', 'advancedOptionsList'),
k_remoteData: {
k_isAutoUpload: false,
k_jsonRpc: {
method: 'UpdateChecker.uploadImage'
}
},
k_onChange: function(k_form, k_item, k_value) {
var
k_name = k_value.toLowerCase().split('.');
if ('img' !== k_name[k_name.length - 1]) {
kerio.lib.k_alert({
k_icon: 'warning',
k_title: kerio.lib.k_tr('Incorrect Input', 'common'),
k_msg: kerio.lib.k_tr('Please select proper upgrade image file.', 'advancedOptionsList')
});
k_item.k_reset();
return;
}
k_form.k_uploadedVersionDescription = k_value;
k_form.k_textUploadInfo.k_addClassName('inProgress');
k_form.k_rowImageProgress.k_setVisible(true);
k_form.k_rowImageFile.k_setVisible(false);
k_item.k_upload();
},
k_onError: function (k_form, k_item, k_response) {
if (413 === k_response.k_decoded.error.code) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Error', 'common'),
k_msg: kerio.lib.k_tr('Operation could not be completed due to unavailable free space in memory.', 'advancedOptionsList'),
k_icon: 'error'
});
return true;
}
return false;
},
k_onUpload: function (k_form, k_item, k_response, k_success) {
var
k_decoded = k_response.k_decoded;
if (k_response.k_isOk) {
k_form.k_uploadedFileId = k_decoded.id;
k_form.k_textUploadInfo.k_setValue(k_form.k_trImageUploaded);
k_form.k_textUploadInfo.k_removeClassName('inProgress');
k_form.k_btnStartUpgrade.k_setVisible(true);
k_form.k_btnUploadAnotherFile.k_setVisible(true);
}
else {
k_form.k_showUploadAnotherFile(k_form);
}
}
} ] }, {
k_type: 'k_row',
k_height: 25,
k_items: [
{
k_type: 'k_formButton',
k_id: 'k_btnStartUpgrade',
k_caption: k_tr('Start Upgrade', 'advancedOptionsList'),
k_isHidden: true,
k_onClick: function (k_form, k_item) {
k_form.k_askToUpgrade(true);
}
},
{
k_type: 'k_formButton',
k_id: 'k_btnUploadAnotherFile',
k_caption: k_tr('Upload Another File', 'advancedOptionsList'),
k_isHidden: true,
k_onClick: k_showUploadAnotherFile
}
]
}
]
},
{
k_restrictions: {
k_isIos: [ false ],
k_isAuditor: [ false ]
},
k_type: 'k_fieldset',
k_caption: k_tr('Upgrade from URL', 'advancedOptionsList'),
k_height: 125,
k_items: [
{
k_type: 'k_row',
k_height: 25,
k_id: 'k_rowUrlImageProgress',
k_isHidden: true,
k_items: [
{
k_type: 'k_display',
k_className: 'dnsUpdateStatus inProgress',
k_id: 'k_downloadInfo',
k_value: k_trPleaseWaitUrl,
k_isSecure: true,
k_isLabelHidden: true
},
]
},
{
k_type: 'k_progressBar',
k_id: 'k_urlDownloadProgress',
k_width: 300,
k_value: 0,
k_maxValue: 100,
k_isHidden: true,
k_exceeded: {
k_message: '<b>' + k_tr('Download has failed.', 'advancedOptionsList') + '</b>'
}
},
{
k_type: 'k_row',
k_height: 25,
k_id: 'k_rowUrlImageFile',
k_items: [
{
k_id: 'url',
k_emptyText: 'Enter URL of the upgrade image file (*.img)',
k_isLabelHidden: true,
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME_OR_IP_ADDRESS,
k_checkByteLength: true,
k_width: 350,
k_validator: {
k_allowBlank: true
}
},
{
k_type: 'k_formButton',
k_id: 'k_btnDownloadFromUrl',
k_mask: false,
k_caption: k_tr('Download', 'advacedOptionsList'),
k_onClick: function(k_form) {
var
k_url = k_form.k_getItem('url');
k_name = k_url.k_getValue().toLowerCase().split('/');
if (k_url.k_getValue() == '') {
kerio.lib.k_alert({
k_title: k_tr('Error', 'common'),
k_msg: k_tr('Enter a URL to download file', 'advacedOptionsList'),
k_icon: 'warning'
});
return;
}
if (kerio.waw.shared.k_tasks._k_tasks[k_form.k_DOWNLOAD_STATUS_TASK_ID]._kx.k_isSuspended) {
kerio.waw.shared.k_tasks.k_resume(k_form.k_DOWNLOAD_STATUS_TASK_ID);
}
else {
kerio.waw.shared.k_tasks.k_start(k_form.k_DOWNLOAD_STATUS_TASK_ID);
}
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'UpdateChecker.downloadImage',
params: {
url: k_url.k_getValue()
}
},
k_timeout: 3600000,
k_onError: function(k_response) {
if (k_response.k_decoded && k_response.k_decoded.error) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Warning', 'common'),
k_msg: kerio.waw.shared.k_methods.k_translateErrorMessage(k_response.k_decoded.error),
k_icon: 'warning'
});
return true;
}
},
});
}
},
] }, {
k_type: 'k_row',
k_height: 25,
k_items: [
{
k_type: 'k_formButton',
k_id: 'k_btnStartUpgradeFromUrl',
k_caption: k_tr('Start Upgrade', 'advancedOptionsList'),
k_isHidden: true,
k_onClick: function (k_form, k_item) {
k_form.k_askToUpgrade(true);
}
},
{
k_type: 'k_formButton',
k_id: 'k_btnDownloadAnotherFile',
k_caption: k_tr('Download Another File', 'advancedOptionsList'),
k_isHidden: true,
k_onClick: function () {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'UpdateChecker.resetDownloadStatus'
}
});
}
}
]
}
]
}
]
};
k_addForm({
k_id: 'k_updateForm',
k_config: k_updateFormCfg,
k_caption: k_tr('Software Update', 'advancedOptionsList'),
k_references: {
k_UPDATE_TASK_ID: 'k_updateCheckerProgress',
k_URL_UPDATE_TASK_ID: 'k_updateDownloadProgress',
k_DOWNLOAD_STATUS_TASK_ID: 'k_updateDownloadStatus',
k_STATUS_TYPE: k_WAW_CONSTANTS.UpdateStatus,
k_getStatusRequest: undefined,
k_getDownloadStatusRequest: undefined,
k_translations: {
k_updateFailed: k_lib.k_htmlEncode(k_tr('Update check failed', 'advancedOptionsList')),
k_updateProgress: k_lib.k_htmlEncode(k_tr('Update check is currently in progress.', 'advancedOptionsList')),
k_noVersion: k_lib.k_htmlEncode(k_tr('No new version is available.', 'advancedOptionsList')),
k_newVersion: k_lib.k_htmlEncode(k_tr('A new version is available: ', 'advancedOptionsList'))
},
k_downloadedVersionDescription: '',
k_uploadedVersionDescription: '',
k_isUpload: false,
k_uploadedFileId: ''
},
k_items: {
k_lastCheckTime: 'k_lastCheckTime',
k_updateStatus: 'k_updateStatus',
k_updateInfo: 'k_updateInfo',
k_downloadProgress: 'k_downloadProgress',
k_updateStatusFieldset: 'k_updateStatusFieldset',
k_scheduled: 'k_scheduled'
}
}); 
if (k_isLinux) {
k_dataEncryptionFormCfg = {
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Data Encryption', 'advancedOptions'),
k_labelWidth: 240,
k_items: [{
k_type: 'k_container',
k_className: 'text-cont-compact',
k_items: [{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('Enable Encryption to ensure that Kerio Control will encrypt all data prior writing it to the disk. <a href="http://go.gfi.com/?pageid=control-encrypt" target="_blank">%1</a>', 'advancedOptions', {k_args: [k_tr('Learn more...', 'advancedOptions')]})
}]
}, {
k_type: 'k_display',
k_id: 'dataEncryptWarn',
k_isHidden: true,
k_isSecure: true,
k_value: {
k_text: '',
k_linkText: ''
},
k_template: '<div class="data-encrypt-warn">' +
'<span class="data-encrypt-img {k_img}"></span>' +
'<span class="data-encrypt-warn-text">{k_text}</span>&nbsp;' +
'<a href="javascript:void(0)" class="data-encrypt-warn-link">{k_linkText}</a>' +
'</div>',
k_onLinkClick: function(k_form, k_item, k_id) {
k_form.k_toggleResizeProgress(true);
}
}, {
k_type: 'k_display',
k_id: 'dataEncryptStatus',
k_className: 'data-encrypt-status',
k_style: 'margin-left: -5px;',
k_isSecure: true,
k_value: {
k_info: ''
},
k_template: '<i class="icon"></i>{k_info}'
}, {
k_type: 'k_formButton',
k_id: 'btnDecrypt',
k_isReadOnly: k_isAuditor,
k_caption: k_tr('Disable', 'advancedOptions'),
k_onClick: function(k_form, k_button) {
k_form.k_onDecryptClick(k_form);
}
}, {
k_type: 'k_text',
k_id: 'encryptPassword',
k_isReadOnly: k_isAuditor,
k_caption: k_tr('Password:', 'advancedOptions'),
k_isPasswordField: true,
k_width: 300,
k_style: 'margin-left: 6px;',
k_onChange: function(k_form, k_item) {
k_form.k_onEncryptPasswordChange(k_form);
},
k_onBlur: function(k_form, k_item) {
},
k_onKeyPress: function(k_form, k_item, k_event) {
}
}, {
k_type: 'k_text',
k_id: 'encryptPasswordConfirm',
k_isReadOnly: k_isAuditor,
k_caption: k_tr('Confirm password:', 'advancedOptions'),
k_isPasswordField: true,
k_width: 300,
k_style: 'margin-left: 6px;',
k_validator: {
k_allowBlank: false
},
k_onChange: function(k_form, k_item) {
k_form.k_onEncryptPasswordChange(k_form);
},
k_onBlur: function(k_form, k_item) {
},
k_onKeyPress: function(k_form, k_item, k_event) {
}
}, {
k_type: 'k_row',
k_id: 'btnEncryptCont',
k_className: 'encrypt-btn-cont',
k_items: [{
k_type: 'k_display',
k_isSecure: true,
k_value: '',
k_width: 1
}, {
k_type: 'k_formButton',
k_id: 'btnEncrypt',
k_isReadOnly: k_isAuditor,
k_caption: k_tr('Enable', 'advancedOptions'),
k_onClick: function(k_form, k_button) {
k_form.k_onEncryptClick(k_form);
}
}]
}]
}
]};k_addForm({
k_id: 'k_dataEncryptionForm',
k_config: k_dataEncryptionFormCfg,
k_caption: k_tr('Data Encryption', 'advancedOptionsList'),
k_references: { },
k_items: { }
}); }
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
var
k_webForm = this.k_relatedWidget.k_forms.k_webForm;
if (k_webForm.k_imageChanged) {
k_webForm.k_sendResetRequest();
}
k_toolbar.k_relatedWidget.k_loadBatchData();
} }; k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_closureLocalNamespace + 'k_toolbar', k_toolbarCfg);
k_tabPageCfg.k_toolbars = {
k_bottom: k_toolbar
};
}
k_tabPageCfg.k_onTabChange = function(k_tabPage, k_currentTabId) {
kerio.adm.k_framework._k_setHelpQuery(k_tabPage.k_id + '_' + k_currentTabId);
k_tabPage.k_forms.k_systemCfgForm.k_animateClock('k_systemCfgForm' === k_currentTabId);
if ('k_backupForm' === k_currentTabId) {
k_tabPage.k_forms.k_backupForm.k_extWidget.doLayout.defer(100, k_tabPage.k_forms.k_backupForm.k_extWidget);
}
};
k_tabPage = new k_lib.K_TabPage(k_objectName, k_tabPageCfg);
if (!k_isAuditor) {
k_tabPage.k_toolbar = k_toolbar;
}
k_tabPage.k_addReferences({
k_forms: k_closureForms,
k_isLinux: k_isLinux
});
k_tabPage.k_addReferences({
k_onActivate: function() {
this.k_forms.k_systemCfgForm.k_animateClock(true);
if (kerio.waw.shared.k_tasks._k_tasks[this.k_forms.k_updateForm.k_DOWNLOAD_STATUS_TASK_ID]._kx.k_isSuspended) {
kerio.waw.shared.k_tasks.k_resume(this.k_forms.k_updateForm.k_DOWNLOAD_STATUS_TASK_ID);
}
else {
kerio.waw.shared.k_tasks.k_start(this.k_forms.k_updateForm.k_DOWNLOAD_STATUS_TASK_ID);
}
},
k_onDeactivate: function() {
kerio.waw.shared.k_tasks.k_suspend(this.k_forms.k_updateForm.k_UPDATE_TASK_ID);
kerio.waw.shared.k_tasks.k_suspend(this.k_forms.k_updateForm.k_URL_UPDATE_TASK_ID);
kerio.waw.shared.k_tasks.k_suspend(this.k_forms.k_updateForm.k_DOWNLOAD_STATUS_TASK_ID);
this.k_forms.k_systemCfgForm.k_animateClock(false);
}
});
if (!k_isLinux) {
k_closureForms.k_webForm.k_addReferences({
k_sslForm: k_closureForms.k_sslForm
});
}
if (k_isAuditor) {
this.k_switchToAuditor(k_tabPage, k_closureForms);
}
kerio.waw.requests.k_addBatchControllers(k_tabPage);
this.k_addControllers(k_tabPage);
k_updateForm = k_tabPage.k_forms.k_updateForm;
k_tabPage.k_forms.k_updateForm.k_addReferences({
k_idPostfixUpload: k_idPostfixUpload,
k_idPostfixDownload: k_idPostfixDownload,
k_trPleaseWait: k_trPleaseWait,
k_trPleaseWaitUrl: k_trPleaseWaitUrl,
k_showUploadAnotherFile: k_showUploadAnotherFile,
k_trImageUploaded: '&nbsp; &nbsp; &nbsp; &nbsp;' + k_tr('The upgrade file has been uploaded successfully. Click the button below to upgrade. Restart will be required.', 'advancedOptionsList'),
k_trImageDownloaded: '&nbsp; &nbsp; &nbsp; &nbsp;' + k_tr('The upgrade file has been downloaded successfully. Click the button below to upgrade. Restart will be required.', 'advancedOptionsList'),
k_textUploadInfo: k_updateForm.k_getItem('k_uploadInfo'),
k_textDownloadInfo: k_updateForm.k_getItem('k_downloadInfo'),
k_urlDownloadProgress: k_updateForm.k_getItem('k_urlDownloadProgress'),
k_rowImageProgress: k_updateForm.k_getItem('k_rowImageProgress'),
k_rowUrlImageProgress: k_updateForm.k_getItem('k_rowUrlImageProgress'),
k_rowImageFile: k_updateForm.k_getItem('k_rowImageFile'),
k_rowUrlImageFile: k_updateForm.k_getItem('k_rowUrlImageFile'),
k_btnUploadAnotherFile: k_updateForm.k_getItem('k_btnUploadAnotherFile'),
k_btnDownloadAnotherFile: k_updateForm.k_getItem('k_btnDownloadAnotherFile'),
k_btnStartUpgrade: k_updateForm.k_getItem('k_btnStartUpgrade'),
k_btnUploadImage: k_updateForm.k_getItem('uploadImage'),
k_btnDownloadFromUrl: k_updateForm.k_getItem('k_btnDownloadFromUrl'),
k_btnStartUpgradeFromUrl: k_updateForm.k_getItem('k_btnStartUpgradeFromUrl'),
k_betaVersion: k_updateForm.k_getItem('betaVersion'),
k_autoUpdateTimeRange: new kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_timeRangeList',
k_select: 'autoUpdateTimeRange',
k_form: k_tabPage.k_forms.k_updateForm
})
});
return k_tabPage;
}, 
k_addControllers: function(k_kerioWidget){
var
k_forms = k_kerioWidget.k_forms,
k_tr = kerio.lib.k_tr;
k_kerioWidget.isProgressDialogOpened = false;
k_kerioWidget.isDecryptionDialogOpened = false;
k_kerioWidget.encryptionUIState = kerio.waw.ui.advancedOptionsList.k_encryptionStateEnum.decrypted;
k_kerioWidget.k_encryptedDiskSpaceErrorCode = null;

k_kerioWidget.k_applyParams = function() {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
kerio.waw.status.k_currentScreen.k_gotoTab(this, 'k_systemCfgForm');
this.k_loadBatchData();
if (k_forms.k_dataEncryptionForm) {
k_forms.k_dataEncryptionForm.k_getEncryptionStatus();
k_forms.k_dataEncryptionForm.k_getDiskSpace();
}
}; if (k_forms.k_systemCfgForm) {
k_forms.k_systemCfgForm.k_addReferences({

k_getLoadRequests: function(k_canReloadData, k_isUserCalled) {
if (!k_canReloadData || !this.k_isLinux) {
return [];
}
var
k_sharedMethods = kerio.waw.shared.k_methods,
k_requests = [
{
k_method:  'SystemConfig.getDateTime',
k_handler: this.k_storeDateTime
}
];
if (!k_isUserCalled) {
k_requests.push(
{
k_method:  'ProductInfo.configUpdate',
k_handler: k_sharedMethods.k_emptyFunction
}
); k_requests.push(
{
k_method:  'SystemConfig.get',
k_handler: this.k_applyParams
}
);
k_requests.push(
{
k_method:  'SystemConfig.getUefiSupportStatus',
k_handler: this.k_updateUefiStatus
}
);
if (!this.k_timeZonesData) {
k_requests.unshift(
{
k_method:  'SystemConfig.getTimeZones',
k_params: {
currentDate: k_sharedMethods.k_unixTimestampToDate((new Date()).getTime()/1000)
},
k_handler: this.k_fillTimeZones
}
);
}
}
return k_requests;
},k_updateUefiStatus: function (params) {
if (params.supported) {
var k_statusElement = this.k_getItem('k_uefiSupportStatus');
k_statusElement.k_setValue({
k_info: k_tr('Enabled. You can boot %1 in UEFI mode.', 'advancedOptionsList', {k_args: [kerio.waw.shared.k_DEFINITIONS.k_PRODUCT_NAME]})
});
k_statusElement.k_removeClassName(['statusEnabled', 'statusDisabled']);
k_statusElement.k_addClassName('statusEnabled');
this.k_setVisible(['k_uefiConversionInfo'], false);
}
},

k_applyParams: function(k_params) {
var
k_config = k_params.config;
this.k_timeZoneIdElement.k_setData(this.k_timeZonesData);
this.k_isReloadDelayed = false;  this.k_reset();
this.k_setData(k_config, true);
kerio.waw.shared.k_data.k_cache({
k_screen: this.k_parentWidget,
k_dialogs: ['dateTimeSettingsEditor']
});
},
k_getSaveRequests: function() {
if (!this.k_isChanged(true)) { return [];
}
var
k_isReloadDelayed = this.k_isReloadDelayed;
this.k_isReloadDelayed = false;  return [{
k_method: 'SystemConfig.set',
k_params: this.k_saveData(),
k_reloadDelay: (k_isReloadDelayed) ? 1000 : 0
}];
}, 
k_saveData: function() {
var
k_data = this.k_getData(true);
delete k_data.dateTime;
return {config: k_data};
}, 
k_fillTimeZones: function(k_params) {
this.k_timeZonesData = k_params.timeZones;
},
k_getTimeZoneById: function(timeZoneId) {
var timeZone = null;
for (var i = this.k_timeZonesData.length - 1; i >= 0; --i) {
if (this.k_timeZonesData[i].id === timeZoneId) {
timeZone = this.k_timeZonesData[i];
break;
}
}
return timeZone;
}, 
k_fillDateTime: function(k_dateTime) {
this.k_keepContentStatusUnchanged = true;this.k_dateTimeElement.k_setValue(kerio.waw.shared.k_methods.k_formatDateTime(k_dateTime), true);
this.k_keepContentStatusUnchanged = false;
},
k_storeDateTime: function(k_params) {
var
k_succees = k_params.config;
this.k_timeOffsetServerClient = new Date();
this.k_timeOffsetServerClient = this.k_timeOffsetServerClient.add(Date.MILLI, -1000);
kerio.waw.shared.k_methods.k_updateClientServerTimeOffset(k_params.config || {}, k_succees);
this.k_serverDateTime = new Date(this.k_timeOffsetServerClient - (kerio.waw.shared.k_CONSTANTS.k_CLIENT_SERVER_OFFSET_SECONDS * 1000));
kerio.waw.shared.k_tasks.k_start(this.k_ANIMATE_CLOCKS_TASK_ID);
kerio.waw.shared.k_tasks.k_resume(this.k_ANIMATE_CLOCKS_TASK_ID); },

k_getSystemDateTime: function() {
var
k_request = this.k_getLoadRequests(true, true),
k_ajaxCfg;
k_request = k_request[0];
kerio.waw.shared.k_methods.k_maskMainScreen(this);
k_ajaxCfg = {
k_jsonRpc: {
method: k_request.k_method
},
k_callback: this.k_openDateTimeSettingsEditor,
k_scope: this
};
kerio.lib.k_ajax.k_request(k_ajaxCfg);
}, 
k_openDateTimeSettingsEditor: function(k_response, k_success) {
var
k_config;
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
if (!k_success || !kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
return;
}
if (k_response.k_decoded) {
k_response = k_response.k_decoded;
}
k_config = k_response.config;
this.k_fillDateTime(k_config);
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'dateTimeSettingsEditor',
k_params: {
k_parentForm: this,
k_dateTime: k_config
}
});
},k_animateClock: function(k_enableAnimation) {
if (k_enableAnimation) {
kerio.waw.shared.k_tasks.k_resume(this.k_ANIMATE_CLOCKS_TASK_ID);
}
else {
kerio.waw.shared.k_tasks.k_suspend(this.k_ANIMATE_CLOCKS_TASK_ID);
}
}
}); k_forms.k_systemCfgForm.k_addReferences({
k_ANIMATE_CLOCKS_TASK_ID: 'k_animateClocks',
k_timeOffsetServerClient: 0,
k_fieldTime: k_forms.k_systemCfgForm.k_getItem('dateTime'),
k_dst: k_forms.k_systemCfgForm.k_getItem('k_dst')
});
kerio.waw.shared.k_tasks.k_add({
k_id: k_forms.k_systemCfgForm.k_ANIMATE_CLOCKS_TASK_ID,
k_interval: 500, k_scope: k_forms.k_systemCfgForm,
k_run: function(){
var
k_timeOffset,
k_time;
k_timeOffset = (new Date()) - this.k_timeOffsetServerClient;
k_time = this.k_serverDateTime.add(Date.MILLI, k_timeOffset);
this.k_fillDateTime({
date: {
year: k_time.getFullYear(),
month: k_time.getMonth(),
day: k_time.getDate()
},
time: {
hour: k_time.getHours(),
min: k_time.getMinutes(),
sec: k_time.getSeconds()
}
});
return true;
}
}); } if (k_forms.k_webForm) {
k_forms.k_webForm.k_addReferences({

k_getLoadRequests: function(k_canReloadData) {
if (!k_canReloadData) {
return [];
}
if (!this.k_loadRequests) {
this.k_loadRequests = [
{
k_method: 'WebInterface.get',
k_handler: this.k_applyParams
}
];
}
return this.k_loadRequests;
}, 
k_applyParams: function(k_params) {
var
k_data = k_params.config,
k_timestamp = new Date().getTime();
if (this._k_dangerousForceSsl || this._k_dangerousNewCertificate) {
k_data.useSsl = this._k_dangerousForceSsl || k_data.useSsl; k_data.certificate = this._k_dangerousNewCertificate || k_data.certificate;
delete this._k_dangerousForceSsl;
delete this._k_dangerousNewCertificate;
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'WebInterface.set',
params: {
config: k_data,
revertTimeout: 600 }
},
k_callback: function() {
window.k_webAssist.k_switchOff(); kerio.waw.requests.k_stopKeepAlive();
kerio.waw.shared.k_methods.k_maskMainScreen(this);
kerio.lib.k_alert({
k_title: kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_alertTitle,
k_msg: kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_restartWarningTitle,
k_callback: function() {
if (kerio.lib.k_isMSIE || kerio.lib.k_isMSIE11) {
document.execCommand("ClearAuthenticationCache","false");
}
else if (window.crypto && typeof window.crypto.logout === "function"){ window.crypto.logout();
}
kerio.waw.k_restart(true); }
});
},
k_errorMessages: {
k_connectionTimeout: '',
k_invalidResponse: ''
},
k_onError: kerio.waw.shared.k_methods.k_ignoreAllErrors
});
return;
}
this.k_reset();
if (k_data.certificate.invalid) {
k_data.certificate.name = kerio.lib.k_tr('None (new certificate will be generated when needed)', 'common');
}
kerio.waw.shared.k_DEFINITIONS.k_CONTROL_URL.k_set(k_data);
this.k_origData = k_data;
this.k_setData(k_data, true);
this.k_setWebUrls(true);
this.k_setCertificate(k_data);
this.k_customLogoImg.k_extWidget.on('afterrender', function() {
kerio.waw.k_hacks.k_setImageBackgroundForImageField(this.k_customLogoImg, '/admin/internal/brand_logo.png');
}, this);
kerio.waw.k_hacks.k_setImageBackgroundForImageField(this.k_customLogoImg, '/admin/internal/brand_logo.png');
this.k_customFaviconImg.k_setValue(kerio.lib.k_ajax.k_changeDownloadUrlForMyKerio('/admin/internal/brand_fav.ico?timehash=' + k_timestamp));
this.k_setVisible('k_forceSslWarning', !k_data.useSsl);
kerio.waw.shared.k_data.k_cache({
k_screen: this.k_parentWidget,
k_data: [ 'k_certificates' ]
});
}, 
k_getSaveRequests: function() {
var
k_methods = kerio.waw.shared.k_methods,
k_data = this.k_saveData(),k_origData = this.k_origData,
k_request;
if (!k_data) {
return [];
}
if (k_methods.k_isConnectionSecured()) {
if (k_origData.certificate.id !== k_data.config.certificate.id) {
this._k_dangerousNewCertificate = k_data.config.certificate;
k_data.config.certificate = k_origData.certificate;
}
}
else {
if (!k_methods.k_isLocalhost() && !k_methods.k_isConnectionSecured() && k_data.config && k_data.config.useSsl) {
this._k_dangerousForceSsl = true;
k_data.config.useSsl = false;
}
}
k_data.revertTimeout = 30; k_request = {
k_method: 'WebInterface.set',
k_params: k_data
};
return [k_request];
}, 
k_saveData: function() {
var
k_formData = this.k_getData(),
k_origData = kerio.lib.k_cloneObject(this.k_origData),
k_certificate = this.k_getItem('k_certificate')._k_select.k_listLoader,
k_changed;
k_certificate = (k_certificate && k_certificate.k_isReady() ? k_certificate.k_getValue() : k_origData.certificate);
k_changed = !kerio.waw.shared.k_methods.k_compare(k_formData, {
useSsl: k_origData.useSsl,
hostname: k_origData.hostname,
certificate: k_origData.certificate,
customizedBrand: k_origData.customizedBrand
});
if (k_changed || this.k_imageChanged) {
kerio.waw.shared.k_methods.k_mergeObjects({
useSsl: k_formData.useSsl,
hostname: k_formData.hostname,
certificate: k_certificate,
customizedBrand: k_formData.customizedBrand
}, k_origData);
return {
config: k_origData
};
}
return false;
}, 
k_setCertificate: function(k_data) {
kerio.waw.shared.k_methods.k_setSslCertificateFieldsetData({k_form: this}, k_data.certificate);
},

k_setWebUrls: function(k_init) {
var
k_CONTROL_URL = kerio.waw.shared.k_DEFINITIONS.k_CONTROL_URL,
k_data = this.k_saveData(),
k_urls = k_CONTROL_URL.k_getTempUrls(k_data.config);
this.k_webIfaceUrlField.k_setValue({k_url: k_urls.k_star});
this.k_webAdminUrlField.k_setValue({k_url: k_urls.k_admin});
},

k_sendResetRequest: function() {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'WebInterface.reset'
}
});
}
}); } if (k_forms.k_sslForm) {
k_forms.k_sslForm.k_addReferences({

k_getLoadRequests: function(k_canReloadData) {
if (!k_canReloadData) {
return [];
}
if (!this.k_loadRequests) {
this.k_loadRequests = [
{
k_method:  'WebInterface.get',
k_handler: this.k_applyParams
}
];
}
return this.k_loadRequests;
}, 
k_applyParams: function(k_params) {
var
k_data = k_params.config.sslConfig;
this.k_reset();
if (k_data.certificate.invalid) {
k_data.certificate.name = kerio.lib.k_tr('None (new certificate will be generated when needed)', 'common');
}
this.k_setData(k_data, true);
this.k_setCertificate(k_data);
kerio.waw.shared.k_data.k_cache({
k_screen: this.k_parentWidget
});
}, 
k_setCertificate: function(k_data) {
kerio.waw.shared.k_methods.k_setSslCertificateFieldsetData({k_form: this}, k_data.certificate);
}
}); } if (k_forms.k_updateForm) {
k_forms.k_updateForm.k_addReferences({

k_getLoadRequests: function(k_canReloadData) {
if (!k_canReloadData) {
return [];
}
if (!this.k_getStatusRequest) {
this.k_getStatusRequest = { k_method:  'UpdateChecker.getStatus',
k_managerObject: 'UpdateChecker',
k_handler: this.k_setUpdate
};
}
if (!this.k_getDownloadStatusRequest) {
this.k_getDownloadStatusRequest = {
k_method:  'UpdateChecker.getDownloadStatus',
k_handler: this.k_setDownloadUpdate
};
}
if (!this.k_loadRequests) {
this.k_loadRequests = [
{
k_method: 'ProductInfo.getClientStatistics',
k_handler: this.k_applyClientStatistics
},
{
k_method: 'UpdateChecker.get',
k_handler: this.k_applyParams
}
];
}
if (kerio.waw.shared.k_tasks._k_tasks[this.k_UPDATE_TASK_ID]._kx.k_isSuspended) {
kerio.waw.shared.k_tasks.k_resume(this.k_UPDATE_TASK_ID); }
else {
kerio.waw.shared.k_tasks.k_start(this.k_UPDATE_TASK_ID); }
kerio.waw.shared.k_tasks.k_start(this.k_DOWNLOAD_STATUS_TASK_ID); this.k_autoUpdateTimeRange.k_sendRequest();
return this.k_loadRequests;
},

k_getSaveRequests: function() {
if (!this.k_isChanged(true)) { return [];
}
return [
{
k_method: 'ProductInfo.setClientStatistics',
k_params: { setting: this.k_getItem('sendClientStatistics').k_getValue() }
},
{
k_method: 'UpdateChecker.set',
k_params: this.k_saveData()
}
];
},

k_applyParams: function(k_params) {
this.k_setData(k_params.config, true);
this.k_autoUpdateTimeRange.k_selectValue(kerio.waw.shared.k_methods.k_prepareListValue(k_params.config.autoUpdateTimeRange), true);
},

k_applyClientStatistics: function(k_params) {
this.k_getItem('sendClientStatistics').k_setValue(k_params.setting, true);
},

k_saveData: function() {
var
k_data = this.k_getData(true),
k_timeRange = this.k_autoUpdateTimeRange.k_getValue();
k_data.autoUpdateTimeRange = {
enabled: ('' !== k_timeRange.id),
value: k_timeRange
};
return {
config: k_data
};
},

k_setUpdate: function(k_params, k_success) {
var
k_STATUS_TYPE = this.k_STATUS_TYPE,
k_STATUS_ICONS,
k_tr = kerio.lib.k_tr,
k_showUpdating = false,
k_updateStatusElement = this.k_updateStatus,
k_percentage = 0,
k_isChecking = false,
k_updateStatus,
k_lastCheck,
k_newVersionMessage,
k_icon,
k_description;
this.k_updateStatusFieldset.k_setVisible(false);
this.k_setVisible(['k_updateStatusFieldset', 'k_containerDownloadNow', 'k_containerDownloadFailed', 'k_containerUpgradeFailed', 'k_containerDownloading', 'k_containerUpgradeNow', 'k_containerSheduled'], false);
this.k_setDisabled(['k_btnUpdate'], false);
k_STATUS_ICONS = {
k_ERROR: 'error',
k_CHECK: 'checking',
k_NOICON: 'noIcon',
k_OK: 'ok'
};
k_lastCheck = {
time: '',
result: ''
};
if (!k_params || !k_params.hasOwnProperty('length') || (k_params.hasOwnProperty('length') && 2 !== k_params.length) || undefined === k_params[1].status) {
this.k_lastCheckTime.k_setValue({time: k_tr('unknown', 'common'), result: k_tr('Update check failed.', 'advancedOptionsList')});
this.k_setVisible(['k_updateCheckTimeRow'], true);
this.k_setVisible(['k_updateInProgressRow'], false);
return;
}
k_percentage = k_params[0].percentage || k_percentage;
if ('number' === typeof k_percentage) {
this.k_downloadProgress.k_setValue(k_percentage);
}
k_updateStatus = k_params[1].status;
if (kerio.waw.shared.k_CONSTANTS.k_UPDATE_TIME_NEVER === k_updateStatus.lastCheckTime) {
k_lastCheck.time = k_tr('Never', 'advancedOptionsList');
this.k_lastCheckTime.k_setValue(k_lastCheck);
return;
}
k_lastCheck.time = kerio.waw.shared.k_methods.k_formatTimeSpan(k_updateStatus.lastUpdateCheck);
if (k_updateStatus.autoUpdatePlanned) {
this.k_scheduled.k_setValue({date: k_updateStatus.autoUpdateDateTime});
this.k_setVisible(['k_containerSheduled'], true);
}
switch (k_updateStatus.status) {
case k_STATUS_TYPE.UpdateStatusCheckFailed:
k_lastCheck.result = this.k_translations.k_updateFailed;
if (k_updateStatus.updateErrorDescr) {
k_lastCheck.result += ' - ' + kerio.lib.k_tr(k_updateStatus.updateErrorDescr, 'serverMessage');
}
k_lastCheck.result += '.';
break;
case k_STATUS_TYPE.UpdateStatusChecking:
k_isChecking = true;
kerio.waw.shared.k_tasks.k_resume(this.k_UPDATE_TASK_ID, true);
this.k_setDisabled(['k_btnUpdate'], true);
this.k_setVisible(['k_updateCheckTimeRow'], false);
this.k_setVisible(['k_updateInProgressRow'], true);
break;
case k_STATUS_TYPE.UpdateStatusOk:
if (k_updateStatus.newVersion) {
k_showUpdating = true;
k_icon = k_STATUS_ICONS.k_OK;
this.k_setVisible(['k_containerDownloadNow'], true);
}
else {
k_lastCheck.result = this.k_translations.k_noVersion;
}
break;
case k_STATUS_TYPE.UpdateStatusDownloading:
k_showUpdating = true;
this.k_setVisible(['k_containerDownloading'], true);
this.k_setDisabled(['k_btnUpdate'], true);
kerio.waw.shared.k_tasks.k_resume(this.k_UPDATE_TASK_ID, true);
break;
case k_STATUS_TYPE.UpdateStatusDownloadOk:
k_showUpdating = true;
this.k_setVisible(['k_containerUpgradeNow'], true);
break;
case k_STATUS_TYPE.UpdateStatusDownloadFailed:
k_showUpdating = true;
this.k_setVisible(['k_containerDownloadFailed', 'k_containerDownloadNow'], true);
break;
case k_STATUS_TYPE.UpdateStatusUpgradeFailed:
k_showUpdating = true;
this.k_setVisible(['k_containerUpgradeFailed', 'k_containerDownloadNow'], true);
break;
}
if (!k_isChecking) {
this.k_setDisabled(['k_btnUpdate'], false);
this.k_setVisible(['k_updateCheckTimeRow'], true);
this.k_setVisible(['k_updateInProgressRow'], false);
}
if (k_updateStatus.description) {
k_description = kerio.lib.k_htmlEncode(k_updateStatus.description);
this.k_downloadedVersionDescription = k_description;
k_newVersionMessage = this.k_translations.k_newVersion + '<b>' + k_description + '</b>';
}
if (k_showUpdating) {
k_updateStatusElement.k_removeClassName([k_STATUS_ICONS.k_OK, k_STATUS_ICONS.k_ERROR, k_STATUS_ICONS.k_CHECK, k_STATUS_ICONS.k_NOICON]);
k_updateStatusElement.k_setValue({k_status: k_newVersionMessage});
k_updateStatusElement.k_addClassName(k_icon);
if (k_updateStatus.infoUrl) {
this.k_updateInfo.k_setValue({
k_infoUrl: kerio.lib.k_htmlEncode(k_updateStatus.infoUrl)
});
this.k_updateInfo.k_setVisible(true);
}
}
this.k_lastCheckTime.k_setValue(k_lastCheck);
this.k_updateStatusFieldset.k_setVisible(k_showUpdating);
},
k_setDownloadUpdate: function(k_response, k_succees) {
if (!k_succees) {
return;
}
var 
params = k_response.k_decoded;
this.k_changeDownloadStatus(params.status, params.id, params.fileName);
},
k_changeDownloadStatus: function(k_newStatus, k_id, k_fileName) {
var 
k_STATUS_TYPE = this.k_STATUS_TYPE;
switch (k_newStatus) {
case k_STATUS_TYPE.UpdateStatusDownloading:
if (kerio.waw.shared.k_tasks._k_tasks[k_forms.k_updateForm.k_URL_UPDATE_TASK_ID]._kx.k_isSuspended) {
kerio.waw.shared.k_tasks.k_resume(k_forms.k_updateForm.k_URL_UPDATE_TASK_ID);
}
else {
kerio.waw.shared.k_tasks.k_start(k_forms.k_updateForm.k_URL_UPDATE_TASK_ID);
}
this.k_urlDownloadProgress.k_setVisible(true);
this.k_textDownloadInfo.k_addClassName('inProgress');
this.k_btnDownloadFromUrl.k_setVisible(false);
this.k_rowUrlImageFile.k_setVisible(false);
this.k_rowUrlImageProgress.k_setVisible(true);
break;
case k_STATUS_TYPE.UpdateStatusDownloadOk:
kerio.waw.shared.k_tasks.k_suspend(k_forms.k_updateForm.k_URL_UPDATE_TASK_ID);
this.k_urlDownloadProgress.k_setVisible(false);
this.k_btnStartUpgradeFromUrl.k_setVisible(true);
this.k_btnDownloadAnotherFile.k_setVisible(true);
this.k_btnDownloadFromUrl.k_setVisible(false);
this.k_rowUrlImageFile.k_setVisible(false);
this.k_uploadedVersionDescription = k_fileName;
this.k_uploadedFileId = k_id;
this.k_rowUrlImageProgress.k_setVisible(true);
this.k_textDownloadInfo.k_setValue(this.k_trImageDownloaded);
this.k_textDownloadInfo.k_removeClassName('inProgress');
break;
default:
kerio.waw.shared.k_tasks.k_suspend(k_forms.k_updateForm.k_URL_UPDATE_TASK_ID);
kerio.waw.shared.k_tasks.k_suspend(k_forms.k_updateForm.k_DOWNLOAD_STATUS_TASK_ID);
this.k_urlDownloadProgress.k_setVisible(false);
this.k_textDownloadInfo.k_setValue(this.k_trPleaseWaitUrl);
this.k_rowUrlImageProgress.k_setVisible(false);
this.k_rowUrlImageFile.k_setVisible(true);
this.k_btnDownloadFromUrl.k_setVisible(true);
this.k_btnDownloadAnotherFile.k_setVisible(false);
this.k_btnStartUpgradeFromUrl.k_setVisible(false);
return;
}
},

k_changeStatus: function(k_newStatus) {
var
k_betaVersionConst = kerio.waw.shared.k_CONSTANTS.CheckVersionType,
k_requestTemplate = this.k_getStatusRequest,
k_lookForBetaVersion = k_betaVersionConst.CheckVersionConfig,
k_params = {},
k_method;
if (this.k_betaVersion.k_isDirty()) {
k_lookForBetaVersion = this.k_betaVersion.k_isChecked() ? k_betaVersionConst.CheckVersionBeta : k_betaVersionConst.CheckVersionFinal;
}
switch (k_newStatus) {
case 'k_check':
k_method = 'check';
k_params = {
type: k_lookForBetaVersion
};
break;
case 'k_download':
this.k_setDisabled(['k_btnUpdate'], true);
k_method = 'download';
k_params = {
type: k_lookForBetaVersion
};
kerio.waw.shared.k_tasks.k_start(this.k_UPDATE_TASK_ID); break;
case 'k_cancel':
this.k_setDisabled(['k_btnUpdate'], false);
k_method = 'cancelDownload';
break;
case 'k_progress':
this.k_setDisabled(['k_btnUpdate'], true);
k_method = 'getProgressStatus';
break;
case 'k_upgrade':
this.k_setDisabled(['k_btnUpdate'], false);
kerio.lib.k_reportError('To upgrade server call k_installUpdate() instead of k_changeStatus()!', 'advancedOptionsList', 'k_changeStatus');
return;
default:
kerio.lib.k_reportError('Unsupported method for UpdateChecker', 'advancedOptionsList', 'k_changeStatus');
return;
}
this.k_lastUpdateRequest = kerio.waw.requests.k_sendBatch(
[
{
k_jsonRpc: {
method: k_requestTemplate.k_managerObject + '.' + k_method,
params: k_params
}
},
{
k_jsonRpc: {
method: k_requestTemplate.k_method
}
}
],
{
k_callback: k_requestTemplate.k_handler,
k_scope: this,
k_requestOwner: null, k_mask: false,
k_isSilent: true,
k_onError: function (k_response) {
if (k_response[0] && k_response[0].error && k_response[0].error.code && 1000 === k_response[0].error.code) {
return true;
}
return false;
}
}
);
}
});
kerio.waw.shared.k_tasks.k_add({
k_id: k_forms.k_updateForm.k_UPDATE_TASK_ID,
k_interval: 2000,
k_scope: k_forms.k_updateForm,

k_run: function() {
this.k_changeStatus('k_progress');
return false; }
});
kerio.waw.shared.k_tasks.k_add({
k_id: k_forms.k_updateForm.k_URL_UPDATE_TASK_ID,
k_interval: 2000,
k_scope: k_forms.k_updateForm,

k_run: function() {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'UpdateChecker.getDownloadProgress',
},
k_callback: function(k_response, k_success) {
if (k_success && k_response.k_isOk) {
var percentage = k_response.k_decoded.percentage;
k_forms.k_updateForm.k_urlDownloadProgress.k_setValue(percentage);
}
}
});
}
});
kerio.waw.shared.k_tasks.k_add({
k_id: k_forms.k_updateForm.k_DOWNLOAD_STATUS_TASK_ID,
k_interval: 2000,
k_scope: k_forms.k_updateForm,

k_run: function() {
var k_requestTemplate = this.k_getDownloadStatusRequest;
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: k_requestTemplate.k_method,
},
k_scope: this,
k_callback: k_requestTemplate.k_handler,
k_requestOwner: null, k_mask: false,
k_isSilent: true
});
}
});
k_forms.k_updateForm.k_addReferences({

k_downloadUpdate: function() {
this.k_changeStatus('k_download');
},

k_cancelDownload: function() {
this.k_changeStatus('k_cancel');
},

k_askToUpgrade: function(k_isUpload) {
var
k_tr = kerio.lib.k_tr,
k_newVersionDescription;
k_isUpload = true === k_isUpload;
this.k_isUpload = k_isUpload;
k_newVersionDescription = k_isUpload ? this.k_uploadedVersionDescription : this.k_downloadedVersionDescription;
kerio.lib.k_confirm(
{
k_title: k_tr('Confirm Restart', 'advancedOptionsList'),
k_msg: ['<b>', k_tr('Do you want to upgrade to "%1" now?', 'advancedOptionsList', {k_args: [k_newVersionDescription]}), '</b>',
'<br><br>', k_tr('This operation restarts %1.', 'advancedOptionsList', {k_args: ['Kerio Control']})].join(''),
k_callback: this.k_installUpdate,
k_scope: this
});
},

k_installUpdate: function(k_answer) {
if ('no' === k_answer) { return;
}
var
k_requestTemplate = this.k_getStatusRequest,
k_method,
k_params;
if (this.k_isUpload) {
k_method = 'performCustomUpgrade';
k_params = {id: this.k_uploadedFileId};
}
else {
k_method = 'performUpgrade';
}
kerio.waw.requests.k_sendBatch(
{
k_jsonRpc:{
method: k_requestTemplate.k_managerObject + '.' + k_method,
params: k_params
},
k_callback: function(k_response, k_success) {
if (!k_success) {
kerio.waw.requests.k_reportRestartFail();
} }
},
{
k_mask: false,
k_requestOwner: null }
);
kerio.waw.requests.k_startRestart();
}
});
}
if (k_forms.k_dataEncryptionForm) {
k_forms.k_dataEncryptionForm.k_addReferences({
k_encryptionRestartTriggered: false,
k_currentWaitingOperation:kerio.waw.ui.advancedOptionsList.k_encryptionOperation.no_operation,
k_toggleEncryptedVolumeWarn: function(isShow, text, linkText, isWarn) {
var k_form = k_forms.k_dataEncryptionForm,
dataEncryptWarn = k_form.k_getItem('dataEncryptWarn');
dataEncryptWarn.k_setVisible(isShow);
if (isShow && text) {
dataEncryptWarn.k_setValue({
k_text: text,
k_linkText: linkText,
k_img: isWarn ? 'img-warn' : 'img-info'
})
}
},
k_showLowDiskSpaceAlert: function() {
this.k_showEncryptedVolumeAlert(
k_tr('Not enough free space on encrypted volume. Increase encrypted volume size. It might take several minutes. During volume resize all Kerio Control services will be temporarily stopped.', 'advancedOptions'),
k_tr('Add', 'common'),
this.k_startResizing.bind(this)
);
},
k_showCritLowDiskSpaceAlert: function() {
this.k_showEncryptedVolumeAlert(
k_tr('Critically low free space on encrypted volume. Kerio Control is temporarily stopped until encrypted volume size is increased. Increase encrypted volume size. It might take several minutes. During volume resize all Kerio Control services will be temporarily stopped.', 'advancedOptions'),
k_tr('Add', 'common'),
this.k_startResizing.bind(this)
);
},
k_showFreeUnusedSpaceAlert: function() {
this.k_showEncryptedVolumeAlert(
k_tr('Available space on encrypted volume is low. Please click Decrease to free unused disk space. It might take several minutes. During volume resize all Kerio Control services will be temporarily stopped.', 'advancedOptions'),
k_tr('Decrease', 'common'),
this.k_startResizing.bind(this)
);
},
k_showEncryptedVolumeAlert: function(text, yesBtnText, startResizeCallback) {
kerio.lib.k_confirm({
k_title: k_tr('Warning', 'wlibAlerts'),
k_msg: text,
k_buttons: {
k_yes: yesBtnText,
k_no: k_tr('Later', 'common')
},
k_defaultButton: 'Yes',
k_callback: function(k_response) {
if (k_response === 'yes') {
this.k_toggleResizeProgress(true);
}
}.bind(this),
k_scope: this
});
},
k_toggleResizeProgress: function(open) {
this.k_toggleProgressDialog(
open,
k_tr('Kerio Control is resizing encrypted volume…', 'advancedOptions'),
this.k_startResizing.bind(this)
);
},
k_switchEncryptDecrypt: function(showEncrypt) {
var k_form = k_forms.k_dataEncryptionForm,
btnDecrypt = k_form.k_getItem('btnDecrypt'),
encryptPassword = k_form.k_getItem('encryptPassword'),
encryptPasswordConfirm = k_form.k_getItem('encryptPasswordConfirm'),
btnEncryptCont = k_form.k_getItem('btnEncryptCont'),
btnEncrypt = k_form.k_getItem('btnEncrypt');
btnDecrypt.k_setVisible(!showEncrypt);
encryptPassword.k_setVisible(showEncrypt);
encryptPasswordConfirm.k_setVisible(showEncrypt);
btnEncryptCont.k_setVisible(showEncrypt);
if (showEncrypt) {
encryptPasswordConfirm.k_setDisabled(true);
btnEncrypt.k_setDisabled(true);
encryptPassword.k_setValue('');
encryptPasswordConfirm.k_setValue('');
this.k_setDataEncryptStatus(false, k_tr('Disabled. Data encryption is disabled.', 'advancedOptions'));
this.encryptionUIState = kerio.waw.ui.advancedOptionsList.k_encryptionStateEnum.decrypted;
}
else {
this.k_setDataEncryptStatus(true, k_tr('Enabled. Data is encrypted.', 'advancedOptions'));
this.encryptionUIState = kerio.waw.ui.advancedOptionsList.k_encryptionStateEnum.encrypted;
}
},
k_setDataEncryptStatus: function(isEnabled, text) {
var k_form = k_forms.k_dataEncryptionForm,
dataEncryptStatus = k_form.k_getItem('dataEncryptStatus');
dataEncryptStatus.k_setValue({
k_info: text
})
dataEncryptStatus.k_removeClassName('status-enabled');
dataEncryptStatus.k_removeClassName('status-disabled');
dataEncryptStatus.k_addClassName(isEnabled ? 'status-enabled' : 'status-disabled');
},
k_onEncryptPasswordChange: function(k_form) {
var k_form = k_forms.k_dataEncryptionForm,
encryptPassword = k_form.k_getItem('encryptPassword'),
encryptPasswordConfirm = k_form.k_getItem('encryptPasswordConfirm'),
btnEncrypt = k_form.k_getItem('btnEncrypt'),
password = encryptPassword.k_getValue(),
passwordConfirm = encryptPasswordConfirm.k_getValue();
encryptPasswordConfirm.k_setDisabled(!password);
encryptPasswordConfirm.k_markInvalid(password !== passwordConfirm);
btnEncrypt.k_setDisabled(!password || password !== passwordConfirm);
},
k_onEncryptClick: function(k_form) {
var encryptPassword = k_form.k_getItem('encryptPassword'),
password = encryptPassword.k_getValue();
kerio.lib.k_confirm({
k_title: k_tr('Confirm Action', 'wlibAlerts'),
k_msg: k_tr('Please note that encryption results in more resources being utilized and hence performance could be affected. Encryption also locks the data to this particular device, hence change to the device hardware could result in the data being inaccessible. Loosing data encryption password could result in inability to turn off data encryption. Interrupting the encryption process might result in complete data loss. Please do not interrupt the encryption.', 'advancedOptions'),
k_buttons: {
k_yes: k_tr('Encrypt', 'common'),
k_no: k_tr('Cancel', 'common')
},
k_callback: function(k_response) {
if (k_response === 'yes') {
this.k_toggleProgressDialog(
true,
k_tr('Data encryption is in progress…', 'advancedOptions'),
function() {
password = encryptPassword.k_getValue();
this.k_startEncryption(password);
}.bind(this)
);
}
else {
this.k_switchEncryptDecrypt(true);
}
},
k_scope: this
});
},
k_toggleProgressDialog: function(open, text, onShow) {
var progressDialog = kerio.lib.k_uiCacheManager.k_get('progressDialog');
if (open) {
kerio.lib.k_ui.k_showDialog({k_sourceName: 'progressDialog', k_params: {
k_text: text,
k_onShow: function(dlg) {
this.isProgressDialogOpened = true;
if (onShow) {
onShow();
}
}.bind(this)
}});
}
else {
if (progressDialog && this.isProgressDialogOpened) {
progressDialog.k_hide();
this.isProgressDialogOpened = false;
}
}
},
k_onDecryptClick: function(k_form) {
this.k_getDecryptionStatus();
},
k_toggleDecryptionDialog: function(open) {
var decryptionDialog = kerio.lib.k_uiCacheManager.k_get('decryptionDialog');
if (open) {
kerio.lib.k_ui.k_showDialog({k_sourceName: 'decryptionDialog', k_params: {
k_onDecryptClickCallback: this.k_onDecryptClickCallback.bind(this)
}});
this.isProgressDialogOpened = true;
}
else {
if (decryptionDialog && this.isProgressDialogOpened) {
decryptionDialog.k_hide();
this.isProgressDialogOpened = false;
}
}
},
k_toggleDecryptionDialogError: function(showPwdError) {
var decryptionDialog = kerio.lib.k_uiCacheManager.k_get('decryptionDialog');
if (decryptionDialog && this.isProgressDialogOpened) {
decryptionDialog.k_setErrorVisible(showPwdError);
}
},
k_onDecryptClickCallback: function(password) {
this.k_startDecryption(password);
},
k_handleStartDecryption: function(k_response) {
var k_ERROR_TYPE = kerio.waw.shared.k_CONSTANTS.EncryptionErrorType,
data = k_response.k_decoded,
errorMsg = '',
errorCode;
this.k_removeZeroCodeError(k_response);
if (k_response.k_isOk && data && !data.error) {
this.k_toggleDecryptionDialog(false);
this.k_toggleProgressDialog(true, k_tr('Data decryption is in progress…', 'advancedOptions'));
this.k_startCheckEncryptionProgress(k_response);
}
else {
if (data && data.error) {
errorCode = data.error.code;
}
switch(errorCode) {
case k_ERROR_TYPE.ErrorCodeIncorrectPassword:errorMsg = k_tr('Password is incorreсt', 'advancedOptions');
this.k_toggleDecryptionDialogError(true);
break;
default:
this.k_toggleDecryptionDialog(false);
this.k_onGetEncryptionStatusError(k_response);
}
}
},

k_startEncryption: function(password) {
this.k_currentWaitingOperation = kerio.waw.ui.advancedOptionsList.k_encryptionOperation.encryption,
kerio.waw.requests.k_stopKeepAlive();
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Encryption.startEncryption',
params: {
password: password
}
},
k_callback: this.k_handleStartEncryption,
k_onError: this.k_showEncryptionGlobalError,
k_scope: this
}, k_forms.k_dataEncryptionForm);
},
k_startDecryption: function(password) {
this.k_currentWaitingOperation = kerio.waw.ui.advancedOptionsList.k_encryptionOperation.decryption,
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Encryption.startDecryption',
params: {
password: password
}
},
k_callback: this.k_handleStartDecryption,
k_onError: this.k_showDecryptionGlobalError,
k_scope: this
}, k_forms.k_dataEncryptionForm);
},
k_getDecryptionStatus: function() {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Encryption.getEncryptionStatus'
},
k_callback: this.k_handleDecryptionStatus,
k_onError: this.k_handleGlobalEncryptionStatusError,
k_scope: this
}, k_forms.k_dataEncryptionForm);
},
k_getDiskSpace:function(){
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Encryption.getDiskSpace'
},
k_callback: this.k_handleInitialDiskSpace,
k_scope: this
}, k_forms.k_dataEncryptionForm);
},
k_getEncryptionStatus: function() {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Encryption.getEncryptionStatus'
},
k_callback: this.k_handleInitialEncryptionStatus,
k_onError: this.k_handleGetEncryptionStatusError,
k_scope: this
}, k_forms.k_dataEncryptionForm);
},
k_getEncryptionProgress: function() {
kerio.waw.requests.k_stopKeepAlive();
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Encryption.getEncryptionStatus'
},
k_callback: this.k_handleEncryptionStatus,
k_onError: this.k_showEncryptionGlobalError,
k_scope: this
}, k_forms.k_dataEncryptionForm);
},
k_startResizing: function() {
this.k_currentWaitingOperation = kerio.waw.ui.advancedOptionsList.k_encryptionOperation.resizing,
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Encryption.startResizing'
},
k_callback: this.k_handleStartResizing,
k_onError: this.k_showEncryptionGlobalError,
k_scope: this
}, k_forms.k_dataEncryptionForm);
},

k_handleStartResizing: function(k_response) {
var data = k_response.k_decoded;
this.k_removeZeroCodeError(k_response);
if (k_response.k_isOk && data && !data.error) {
this.k_toggleEncryptedVolumeWarn(false);
this.k_startCheckEncryptionProgress();
}
else {
this.k_onGetEncryptionStatusError(k_response);
}
},
k_isFormVisible:function(){
if(!k_forms)
return false;
return k_forms.k_dataEncryptionForm.k_extWidget.isVisible();
},
k_handleInitialDiskSpace: function(k_response) {
var k_DISK_STATUS = kerio.waw.shared.k_CONSTANTS.EncryptionDiskStatus,
data = k_response.k_decoded;;
if(data && data.status){
switch (data.status) {
case k_DISK_STATUS.LOW_SPACE:if(this.k_isFormVisible())
this.k_showLowDiskSpaceAlert();
this.k_toggleEncryptedVolumeWarn(
true,
k_tr('Not enough free space on encrypted volume.', 'advancedOptions'),
k_tr('Click here to add disk space.', 'advancedOptions')
)
break;
case k_DISK_STATUS.CRITICALLY_LOW_SPACE:if(this.k_isFormVisible())
this.k_showCritLowDiskSpaceAlert();
this.k_toggleEncryptedVolumeWarn(
true,
k_tr('Critically low free space on encrypted volume.', 'advancedOptions'),
k_tr('Click here to add disk space.', 'advancedOptions'),
true
)
break;
case k_DISK_STATUS.TOO_MUCH_SPACE:if(this.k_isFormVisible())
this.k_showFreeUnusedSpaceAlert();
this.k_toggleEncryptedVolumeWarn(
true,
k_tr('Available space on encrypted volume is low.', 'advancedOptions'),
k_tr('Click here to free unused disk space.', 'advancedOptions')
)
break;	
}
}
},
k_handleInitialEncryptionStatus: function(k_response) {
var k_ERROR_TYPE = kerio.waw.shared.k_CONSTANTS.EncryptionErrorType,
data = k_response.k_decoded;
this.k_removeZeroCodeError(k_response);
if (data && data.status) {
switch (data.status) {
case kerio.waw.ui.advancedOptionsList.k_encryptionStateEnum.decrypted:
this.k_stopCheckEncryptionProgress(true);
break;
case kerio.waw.ui.advancedOptionsList.k_encryptionStateEnum.encrypted:
this.k_stopCheckEncryptionProgress(false);
break;
}
if (data.action) {
k_kerioWidget.k_setActiveTab('k_dataEncryptionForm');
this.k_handleEncryptionProgress(data.progress, data.action);
this.k_handleStartDecryption(k_response);
}
if (data.error) {
switch (data.error.code) {
case k_ERROR_TYPE.ErrorCodeLowDiskSpace:case k_ERROR_TYPE.ErrorCodeCritLowDiskSpace:case k_ERROR_TYPE.ErrorCodeTooMuchDiskSpace:k_kerioWidget.k_setActiveTab('k_dataEncryptionForm');
break;
}
switch (data.error.code) {
case k_ERROR_TYPE.ErrorCodeLowDiskSpace:this.k_showLowDiskSpaceAlert();
this.k_toggleEncryptedVolumeWarn(
true,
k_tr('Not enough free space on encrypted volume.', 'advancedOptions'),
k_tr('Click here to add disk space.', 'advancedOptions')
)
break;
case k_ERROR_TYPE.ErrorCodeCritLowDiskSpace:this.k_showCritLowDiskSpaceAlert();
this.k_toggleEncryptedVolumeWarn(
true,
k_tr('Critically low free space on encrypted volume.', 'advancedOptions'),
k_tr('Click here to add disk space.', 'advancedOptions'),
true
)
break;
case k_ERROR_TYPE.ErrorCodeTooMuchDiskSpace:this.k_showFreeUnusedSpaceAlert();
this.k_toggleEncryptedVolumeWarn(
true,
k_tr('Available space on encrypted volume is low.', 'advancedOptions'),
k_tr('Click here to free unused disk space.', 'advancedOptions')
)
break;
}
}
}
else {
this.k_onGetEncryptionStatusError(k_response);
}
},
k_handleDecryptionStatus: function(k_response) {
var k_ERROR_TYPE = kerio.waw.shared.k_CONSTANTS.EncryptionErrorType,
data = k_response.k_decoded;
this.k_removeZeroCodeError(k_response);
if (data && data.error && data.error.code === k_ERROR_TYPE.ErrorCodeIncorrectPassword) {delete k_response.k_decoded.error;
}
var reactOnErrors = [
k_ERROR_TYPE.ErrorCodeIncPassWait,
k_ERROR_TYPE.ErrorCodeThreeAttempts
]
if (data && data.error && reactOnErrors.indexOf(data.error.code) === -1) {delete k_response.k_decoded.error;
}
if (k_response.k_isOk && data && !data.error) {
this.k_toggleDecryptionDialog(true);
}
else {
this.k_onGetEncryptionStatusError(k_response);
}
},
k_handleGetEncryptionStatusError: function(k_response) {
this.k_removeZeroCodeError(k_response);
this.k_switchEncryptDecrypt(true);
},
k_handleGlobalEncryptionStatusError: function() {
if (this.k_getDataEncryptionUIState() === kerio.waw.ui.advancedOptionsList.k_encryptionStateEnum.encrypted) {
this.k_showEncryptionGlobalError();
}
else {
this.k_showEncryptionGlobalError();
}
},
k_getDataEncryptionUIState: function() {
return this.encryptionUIState;
},
k_handleStartEncryption: function(k_response) {
var data = k_response.k_decoded;
this.k_removeZeroCodeError(k_response);
if (k_response.k_isOk && data && !data.error) {
this.k_startCheckEncryptionProgress();
}
else {
this.k_onGetEncryptionStatusError(k_response);
}
},
k_startCheckEncryptionProgress: function() {
if (!kerio.waw.shared.k_tasks.k_isDefined('k_checkEncryptionProcess')) {
kerio.waw.shared.k_tasks.k_add({
k_id: 'k_checkEncryptionProcess',
k_scope: this,
k_interval: 1000,
k_run: this.k_getEncryptionProgress
});
}
kerio.waw.shared.k_tasks.k_start('k_checkEncryptionProcess');
},
k_stopCheckEncryptionProgressRequest: function(showEncrypt) {
if (kerio.waw.shared.k_tasks.k_isDefined('k_checkEncryptionProcess')) {
kerio.waw.shared.k_tasks.k_remove('k_checkEncryptionProcess');
}
if (showEncrypt !== undefined) {
this.k_switchEncryptDecrypt(showEncrypt);
}
},
k_stopCheckEncryptionProgress: function(showEncrypt) {
if (kerio.waw.shared.k_tasks.k_isDefined('k_checkEncryptionProcess')) {
kerio.waw.shared.k_tasks.k_remove('k_checkEncryptionProcess');
}
this.k_toggleProgressDialog(false);
if (showEncrypt !== undefined) {
this.k_switchEncryptDecrypt(showEncrypt);
}
},
k_handleEncryptionStatus: function(k_response) {
var data = k_response.k_decoded;
this.k_removeZeroCodeError(k_response);
if (k_response.k_isOk && data && !data.error) {
if (data.action) {
this.k_handleEncryptionProgress(data.progress, data.action);
}
else {
switch(data.status) {
case kerio.waw.ui.advancedOptionsList.k_encryptionStateEnum.decrypted:
this.k_triggerEncryptionRestart();
break;
case kerio.waw.ui.advancedOptionsList.k_encryptionStateEnum.encrypted:
this.k_triggerEncryptionRestart();
break;
}
}
}
else {
this.k_onGetEncryptionStatusError(k_response);
}
},
k_handleEncryptionProgress: function(data, action) {
if (!data) {
return;
}
var actionEnum = kerio.waw.ui.advancedOptionsList.k_encryptionActionEnum,
current = data.current,
total = data.total,
showEncrypt;
switch(action) {
case actionEnum.encrypting:
this.k_showEncryptionProgress(current, total, true);
showEncrypt = false;
break;
case actionEnum.decrypting:
this.k_showEncryptionProgress(current, total, false);
showEncrypt = true;
break;
case actionEnum.resizing:
case actionEnum.saving:
case actionEnum.restoring:
this.k_showResizingProgress(current, total, action);
showEncrypt = true;
break;
}
},
k_showResizingProgress: function(progress, total, action) {
var actionEnum = kerio.waw.ui.advancedOptionsList.k_encryptionActionEnum,
text;
if (progress !== undefined) {
progress = progress.toFixed(1);
}
if (total !== undefined) {
total = total.toFixed(1);
}
switch(action) {
case actionEnum.resizing:
text = k_tr('Enabled. Resizing encrypted volume…', 'advancedOptions');
break;
case actionEnum.saving:
text = k_tr('Enabled. Saving encrypted data %1MB out of %2MB.', 'advancedOptions', {k_args: [progress, total]});
break;
case actionEnum.restoring:
text = k_tr('Enabled. Restoring encrypted data %1MB out of %2MB.', 'advancedOptions', {k_args: [progress, total]});
break;
}
this.k_setDataEncryptStatus(true, text);
},
k_showEncryptionProgress: function(progress, total, isEncryption) {
var text;
if (!progress) {
if (isEncryption) {
text = k_tr('Disabled. Preparing encrypted volume…', 'advancedOptions');
}
else {
text = k_tr('Enabled. Preparing decrypted volume…', 'advancedOptions');
}
}
else {
if (progress !== undefined) {
progress = progress.toFixed(1);
}
if (total !== undefined) {
total = total.toFixed(1);
}
if (isEncryption) {
text = k_tr('Disabled. Encrypted %1MB out of %2MB.', 'advancedOptions', {k_args: [progress, total]});
}
else {
text = k_tr('Enabled. Decrypted %1MB out of %2MB.', 'advancedOptions', {k_args: [progress, total]});
}
}
this.k_setDataEncryptStatus(!isEncryption, text);
},

k_handleServerStatus : function(k_handleServerStatusCaller, startTime) {
kerio.waw.requests.k_stopKeepAlive();
var k_handleServerStatusRef = k_handleServerStatusCaller || this.k_handleServerStatus;
var k_timeoutValue = 5000;
if(!startTime)
startTime = new Date().getTime();
k_timeoutValue += ((new Date().getTime())-startTime) / 5;
if(k_timeoutValue > 20 * 1000)
k_timeoutValue = 20 * 1000;
else if(k_timeoutValue < 0)
k_timeoutValue = 5000;
var k_requestCfg = {
k_jsonRpc: {
'method': 'ProductInfo.get',
'params': null
},
k_timeout: k_timeoutValue,
k_errorMessages: {
k_connectionTimeout: '',
k_invalidResponse: ''
},
k_onError: 	 function(k_response, k_success) {
if (k_response && k_response.k_decoded && k_response.k_decoded.error
&& kerio.lib.k_ajax.k_EXPIRED_SESSION_ERROR_CODE === k_response.k_decoded.error.code) {
window.document.location.reload(true);
return true;
}
var progressDialog = kerio.lib.k_uiCacheManager.k_get('progressDialog');
if(progressDialog && progressDialog.k_form.k_getItem('k_title')){
var k_title=progressDialog.k_form.k_getItem('k_title');
if(k_title)
k_title.k_setValue(k_tr('Waiting for server restart…','connectivityWarning'));
}
setTimeout(function(){
k_handleServerStatusRef(k_handleServerStatusRef, startTime);
}, 1000);
return true;
},
k_callback: function(k_response, k_success, k_params) {
if(k_response && k_response.k_decoded && k_response.k_decoded.code != kerio.lib.k_ajax.k_TIMEOUT_ERROR_CODE){
setTimeout(function(){
k_handleServerStatusRef(k_handleServerStatusRef, startTime);	
}, 1000);
}
}
};
kerio.lib.k_ajax.k_request(k_requestCfg);
},
k_onGetEncryptionStatusError: function(k_response) {
var k_ERROR_TYPE = kerio.waw.shared.k_CONSTANTS.EncryptionErrorType,
data = k_response.k_decoded,
errorMsg = '',
missingSpace = 0,
errorCode,
showEncrypt;
this.k_removeZeroCodeError(k_response);
if (data && data.error) {
errorCode = data.error.code;
missingSpace = data.error.param;
}
switch(errorCode) {
case k_ERROR_TYPE.ErrorCodeEncryptionFailed:errorMsg = k_tr('Encryption failed. Please restart to ensure that appliance is fully operational', 'advancedOptions');
showEncrypt = true;
break;
case k_ERROR_TYPE.ErrorCodeNotEnoughSpace:errorMsg = k_tr('There is not enough disk space to complete data encryption. You have to free at least %1MB to continue.', 'advancedOptions', {k_args: [missingSpace]});
showEncrypt = true;
break;
case k_ERROR_TYPE.ErrorCodeDecryptionFailed:errorMsg = k_tr('Decryption failed. Please restart to ensure that appliance is fully operational', 'advancedOptions');
showEncrypt = false;
break;
case k_ERROR_TYPE.ErrorCodeNotEnoughSpaceDec:errorMsg = k_tr('There is not enough disk space to complete data decryption. You have to free at least %1MB to continue.', 'advancedOptions', {k_args: [missingSpace]});
showEncrypt = false;
break;
case k_ERROR_TYPE.ErrorCodeIncorrectPassword:errorMsg = k_tr('Password is incorreсt', 'advancedOptions');
break;
case k_ERROR_TYPE.ErrorCodeIncPassWait:errorMsg = k_tr('Password is incorrect. You shall wait for a minute before you can try again.', 'advancedOptions');
break;
case k_ERROR_TYPE.ErrorCodeThreeAttempts:errorMsg = k_tr('You have 3 failed attempts to enter password. Please wait for a minute before you can try again.', 'advancedOptions');
break;
case k_ERROR_TYPE.ErrorCodeLowDiskSpace:this.k_showLowDiskSpaceAlert();
this.k_toggleEncryptedVolumeWarn(
true,
k_tr('Not enough free space on encrypted volume.', 'advancedOptions'),
k_tr('Click here to add disk space.', 'advancedOptions')
)
break;
case k_ERROR_TYPE.ErrorCodeCritLowDiskSpace:this.k_showCritLowDiskSpaceAlert();
this.k_toggleEncryptedVolumeWarn(
true,
k_tr('Critically low free space on encrypted volume.', 'advancedOptions'),
k_tr('Click here to add disk space.', 'advancedOptions'),
true
)
break;
case k_ERROR_TYPE.ErrorCodeTooMuchDiskSpace:this.k_showFreeUnusedSpaceAlert();
this.k_toggleEncryptedVolumeWarn(
true,
k_tr('Available space on encrypted volume is low.', 'advancedOptions'),
k_tr('Click here to free unused disk space.', 'advancedOptions')
)
break;
case k_ERROR_TYPE.ErrorCodeResizeFailed:this.k_toggleEncryptedVolumeWarn(true);
errorMsg = k_tr('Encrypted volume resize failed. <br/>Please restart to ensure that appliance is fully operational.', 'advancedOptions');
break;
case k_ERROR_TYPE.ErrorCodeResizeLowDiskSpace:this.k_toggleEncryptedVolumeWarn(
true,
k_tr('Not enough free space on encrypted volume.', 'advancedOptions'),
k_tr('Click here to add disk space.', 'advancedOptions')
);
errorMsg = k_tr('There is not enough disk space to increase encrypted volume size. <br/>Increase free disk space to complete the action.', 'advancedOptions');
break;
case k_ERROR_TYPE.ErrorCodeResizeCritLowDiskSpace:this.k_toggleEncryptedVolumeWarn(
true,
k_tr('Critically low free space on encrypted volume.', 'advancedOptions'),
k_tr('Click here to add disk space.', 'advancedOptions'),
true
);
errorMsg = k_tr('Critically low free space on encrypted volume and there is not enough disk space to increase encrypted volume. Appliance operations are at risk.  Appliance is temporary suspended. Increase free disk space and restart the appliance.', 'advancedOptions');
break;
default:
this.k_handleGlobalEncryptionStatusError();
}
if (errorMsg) {
this.k_showEncryptionError(errorMsg);
}
switch(data.status) {
case kerio.waw.ui.advancedOptionsList.k_encryptionStateEnum.decrypted:
showEncrypt = true;
break;
case kerio.waw.ui.advancedOptionsList.k_encryptionStateEnum.encrypted:
showEncrypt = false;
break;
}
if(!this.k_encryptionRestartTriggered)
this.k_stopCheckEncryptionProgress(showEncrypt);
},
k_triggerEncryptionRestart: function() {
var progressDialog = kerio.lib.k_uiCacheManager.k_get('progressDialog');
if(!progressDialog || !this.isProgressDialogOpened) {
switch(this.k_currentWaitingOperation) {
case kerio.waw.ui.advancedOptionsList.k_encryptionOperation.encryption: 
this.k_toggleProgressDialog(true,k_tr('Data encryption is in progress…', 'advancedOptions'));
break;
case kerio.waw.ui.advancedOptionsList.k_encryptionOperation.decryption: 
this.k_toggleProgressDialog(true,k_tr('Data decryption is in progress…', 'advancedOptions'));
break;
}
}
this.k_stopCheckEncryptionProgressRequest();
if(!this.k_encryptionRestartTriggered)
this.k_handleServerStatus();
this.k_encryptionRestartTriggered = true
},
k_showEncryptionGlobalError: function(k_response) {
this.k_triggerEncryptionRestart();
return true;
},
k_showDecryptionGlobalError: function(k_response) {
this.k_triggerEncryptionRestart();
},
k_showEncryptionError: function(msg) {
kerio.lib.k_confirm({
k_title: k_tr('Error', 'common'),
k_msg: msg,
k_icon: 'warning',
k_buttons: {
k_yes: k_tr('OK', 'common'),
}
});
},
k_removeZeroCodeError: function(k_response) {
var data = k_response.k_decoded;
if (data && data.error && data.error.code === 0) {
delete k_response.k_decoded.error;
}
}
});
}
},

k_switchToAuditor: function(k_widget, k_forms) {
if (k_forms.k_systemCfgForm) {
k_forms.k_systemCfgForm.k_setReadOnlyAll();
k_forms.k_systemCfgForm.k_getItem('k_hostnameInfo').k_forceSetWritable();
}
if (k_forms.k_updateForm) {
k_forms.k_updateForm.k_setReadOnly(['k_updateSettings', 'k_btnUpdate', 'k_containerDownloadNow']);
}
if (k_forms.k_webForm) {
k_forms.k_webForm.k_setReadOnlyAll();
k_forms.k_webForm.k_getItem('webIfaceUrl').k_forceSetWritable();
k_forms.k_webForm.k_getItem('webAdminUrl').k_forceSetWritable();
}
if (k_forms.k_sslForm) {
k_forms.k_sslForm.k_setReadOnlyAll();
}
}
}; 