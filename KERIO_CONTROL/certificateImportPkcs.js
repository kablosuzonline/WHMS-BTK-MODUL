
kerio.waw.ui.certificateImportPkcs = {

k_init: function(k_objectName, k_initParams) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_PEM_FORMAT = 0,
k_PKCS_FORMAT = 1,
k_CRT_WITHOUT_KEY_FORMAT = 2,
k_CRT_WITHOUT_KEY_URL = 0,
k_CRT_WITHOUT_KEY_FILE = 1,
k_managerName = 'Certificates',
k_isSigned = 'certificateImportSigned' === k_objectName,
k_isLocalAuthority = 'certificateImportLocal' === k_objectName,
k_hasPrivateKey = 'certificateImportNew' === k_objectName || k_isLocalAuthority,
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_localNamespace,
k_resetUploadFiles,
k_generateUploadButtonCfg,
k_enableCrtWithoutKeyContent,
k_setVisibleUploadAnotherPkcsFile,
k_dialogHeight;
k_localNamespace = k_objectName + '_';

k_resetUploadFiles = function() {
if (this.k_keyFileName) {
this.k_keyFileName.k_reset();
}
if (this.k_keyFileUpload) {
this.k_keyFileUpload.k_reset();
}
if (this.k_certificateFileName) {
this.k_certificateFileName.k_reset();
}
if (this.k_certificateFileUpload) {
this.k_certificateFileUpload.k_reset();
}
if (this.k_pkcsFileName) {
this.k_pkcsFileName.k_reset();
}
if (this.k_pkcsFileUpload) {
this.k_pkcsFileUpload.k_reset();
}
if (this.k_pkcsPassword) {
this.k_pkcsPassword.k_reset();
}
if (this.k_cerWithoutKeyName) {
this.k_cerWithoutKeyName.k_reset();
}
if (this.k_cerWithoutKeyFileUpload && this.k_cerWithoutKeyFileUpload.k_reset) {
this.k_cerWithoutKeyFileUpload.k_reset();
}
if (this.k_cerWithoutKeyServerUrl) {
this.k_cerWithoutKeyServerUrl.k_reset();
}
this.k_setVisibleUploadAnotherPkcsFile(false);
};

k_setVisibleUploadAnotherPkcsFile = function(k_show) {
this.k_setVisible(['k_pkcsFileUpload'], true !== k_show);
this.k_setVisible(['k_btnUploadNewPkcsFile'], k_show);
};

k_enableCrtWithoutKeyContent = function() {
if (!this.k_isLocalAuthority) {
var
k_isCrtWithoutKeyRowUrl = this.k_CRT_WITHOUT_KEY_URL === this.k_getItem('k_crtWithoutKeyType').k_getValue();
this.k_setDisabled('k_cerWithoutKeyServerUrl', !k_isCrtWithoutKeyRowUrl);
this.k_setDisabled('k_cerWithoutKeyFileUpload', k_isCrtWithoutKeyRowUrl);
}
};

k_generateUploadButtonCfg = function(k_config) {
var
k_onUpload,
k_rowConfig;
if (undefined === k_config.k_onUpload) {
if (undefined === kerio.waw.ui.certificateImportPkcs.k_onUploadHandler) {

kerio.waw.ui.certificateImportPkcs.k_onUploadHandler = function (k_form, k_item, k_response) {
var
k_dialog = k_form.k_dialog;
k_dialog.k_mask(false);
if (k_response.k_isOk) {
kerio.adm.k_framework.k_enableApplyReset(true);
k_dialog.k_relatedGrid.k_reloadData();
k_form.k_pkcsFileUpload.k_resetInputFile();
k_dialog.k_hide();
}
else {
if (1000 === k_response.k_decoded.code && k_item.k_name === k_form.k_pkcsFileUpload.k_name) {
k_form.k_pkcsPassword.k_reset();
k_form.k_setVisibleUploadAnotherPkcsFile(true);
k_form.k_pkcsPassword.k_focus();
}
else {
k_form.k_pkcsFileUpload.k_resetInputFile();
k_form.k_resetUploadFiles();
}
}
};
}
k_onUpload = kerio.waw.ui.certificateImportPkcs.k_onUploadHandler;
}
else {
k_onUpload = k_config.k_onUpload;
}
k_rowConfig = {
k_type: 'k_row',
k_height: true === k_config.k_isPkcs ? 30 : undefined,
k_items: [
{
k_id: k_config.k_labelId,
k_caption: k_config.k_labelCaption,
k_isLabelHidden: k_config.k_isLabelHidden,
k_isReadOnly: true,
k_width: '100%'
},
{
k_type: 'k_formUploadButton',
k_id: k_config.k_buttonId,
k_caption: kerio.lib.k_tr('Select…', 'wlibButtons'),
k_remoteData: {
k_isAutoUpload: false,
k_jsonRpc: {
method: k_config.k_method,
params: k_config.k_params
}
},

k_onChange: function(k_form, k_item, k_value) {
var
k_tr = kerio.lib.k_tr,
k_nameParts = k_value.toLowerCase().split('.'),
k_fileSuffix = k_nameParts[k_nameParts.length - 1],
k_validationMessage = '';
if (k_form.k_isLocalAuthority) {
k_form.k_cerWithoutKeyFileUpload = {};
}
switch (k_item.k_name) {
case k_form.k_cerWithoutKeyFileUpload.k_name:
case k_form.k_certificateFileUpload.k_name:
if ('crt' !== k_fileSuffix) {
k_validationMessage = k_tr('Please select certificate file in PEM format.', 'configurationImport');
}
break;
case k_form.k_keyFileUpload.k_name:
if ('key' !== k_fileSuffix) {
k_validationMessage = k_tr('Please select certificate key file in PEM format.', 'configurationImport');
}
break;
case k_form.k_pkcsFileUpload.k_name:
if ('pfx' !== k_fileSuffix && 'p12' !== k_fileSuffix) {
k_validationMessage = k_tr('Please select certificate file in PKCS #12 format.', 'configurationImport');
}
break;
}
if ('' !== k_validationMessage) {
kerio.lib.k_alert({
k_icon: 'warning',
k_title: k_tr('Incorrect Input', 'common'),
k_msg: k_validationMessage
});
k_item.k_reset();
return;
}
k_item.k_relatedLabel.k_setValue(k_value);
},
k_onUpload: k_onUpload
}
]
};
if (true === k_config.k_isPkcs) {
k_rowConfig.k_items.push({
k_type: 'k_formButton',
k_id: 'k_btnUploadNewPkcsFile',
k_caption: kerio.lib.k_tr('Upload Another File…', 'certificateImport'),
k_isHidden: true,
k_onClick: function(k_form) {
k_form.k_pkcsFileName.k_reset();
k_form.k_pkcsFileUpload.k_resetInputFile();
k_form.k_setVisibleUploadAnotherPkcsFile(false);
}
});
}
return k_rowConfig;
};
k_formCfg = {
k_restrictBy: {
k_hasPrivateKey: k_hasPrivateKey,
k_isLocalAuthority: k_isLocalAuthority
},
k_labelWidth: 170,
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Select format of imported certificate', 'wlibCertificateImport')
},
{
k_type: 'k_radio',
k_groupId: 'k_importFormat',
k_option: k_tr('PKCS#12 format', 'wlibCertificateImport'),
k_isLabelHidden: true,
k_isChecked: true,
k_value: k_PKCS_FORMAT
},
{
k_id: 'k_pkcsContainer',
k_type: 'k_container',
k_indent: 1,
k_items: [
k_generateUploadButtonCfg({
k_labelId: 'k_pkcsFileName',
k_labelCaption: k_tr('File (*.pfx, *.p12):', 'wlibCertificateImport'),
k_buttonId: 'k_pkcsFileUpload',
k_method: k_managerName + '.importCertificateP12',
k_params: { name: '',
type: '',
password: ''
},
k_isPkcs: true
}),
{
k_id: 'k_pkcsPassword',
k_caption: k_tr('Password:', 'wlibCertificateImport'),
k_isPasswordField: true,
k_emptyText: '',
k_width: '100%'
},
{
k_type: 'k_display',
k_indent: 1,
k_isLabelHidden: true,
k_isSecure: true,
k_value: '<span class="tooltip">&nbsp; &nbsp; &nbsp;</span> &nbsp;' + k_tr('Leave the password blank for unprotected certificate.', 'certificateImport')
}
]
},
{
k_type: 'k_radio',
k_groupId: 'k_importFormat',
k_option: k_tr('PEM format', 'wlibCertificateImport'),
k_isLabelHidden: true,
k_value: k_PEM_FORMAT,

k_onChange: function(k_form, k_radio, k_value) {
var
k_isPemFormat = k_form.k_PEM_FORMAT === k_value,
k_isPkcsFormat = k_form.k_PKCS_FORMAT === k_value,
k_isCrtWithoutKeyFormat  = k_form.k_CRT_WITHOUT_KEY_FORMAT === k_value;
k_form.k_setDisabled('k_pemContainer',!k_isPemFormat);
k_form.k_setDisabled('k_pkcsContainer',!k_isPkcsFormat);
k_form.k_setDisabled('k_crtWithoutKeyContainer',!k_isCrtWithoutKeyFormat);
k_form.k_enableCrtWithoutKeyContent();
}
},
{
k_id: 'k_pemContainer',
k_type: 'k_container',
k_indent: 1,
k_isDisabled: true,
k_items: [
k_generateUploadButtonCfg({
k_labelId: 'k_keyFileName',
k_labelCaption: k_tr('Key file (*.key):', 'wlibCertificateImport'),
k_buttonId: 'keyFileUpload',
k_method: k_managerName + '.importPrivateKey',

k_onUpload: function (k_form, k_item, k_response) {
var k_decoded = k_response.k_decoded;
if (k_response.k_isOk) {
k_form.k_dialog.k_importId = k_decoded.keyId;
k_form.k_certificateFileUpload.k_setAdditionalRequestParams({
name: k_form.k_getName(),
keyId: k_decoded.keyId,
type: k_form.k_importType
});
if (true === k_decoded.needPassword) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'certificatePassword',
k_params: {
k_relatedForm: k_form,
k_keyId: k_decoded.keyId
}
});
}
else {
k_form.k_certificateFileUpload.k_upload();
}
} else {
k_form.k_resetUploadFiles();
k_form.k_dialog.k_mask(false);
}
}
}),
k_generateUploadButtonCfg({
k_labelId: 'k_certificateFileName',
k_labelCaption: k_tr('Certificate file (*.crt):', 'wlibCertificateImport'),
k_buttonId: 'certificateFileUpload',
k_method: k_managerName + '.importCertificate',
k_params: { name: '',
keyId: '',
type: ''
}
})
]
},
{
k_restrictions: {
k_isLocalAuthority: [ false ]
},
k_type: 'k_radio',
k_groupId: 'k_importFormat',
k_option: k_tr('PEM format without private key', 'wlibCertificateImport'),
k_isLabelHidden: true,
k_value: k_CRT_WITHOUT_KEY_FORMAT
},
{
k_restrictions: {
k_isLocalAuthority: [ false ]
},
k_id: 'k_crtWithoutKeyContainer',
k_type: 'k_container',
k_indent: 1,
k_isDisabled: true,
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_crtWithoutKeyType',
k_option: k_tr('Server URL:', 'wlibCertificateImport'),
k_isLabelHidden: true,
k_isChecked: true,
k_width: 170,
k_value: k_CRT_WITHOUT_KEY_URL,
k_onChange: function(k_form, k_radio, k_value) {
k_form.k_enableCrtWithoutKeyContent();
}
},
{
k_id: 'k_cerWithoutKeyServerUrl',
k_isLabelHidden: true,
k_emptyText: '',
k_validator: {
k_functionName: 'k_hasNoSpaces',
k_allowBlank: true
},
k_width: '100%'
}
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_crtWithoutKeyType',
k_option: k_tr('Certificate file (*.crt):', 'wlibCertificateImport'),
k_isLabelHidden: true,
k_width: 170,
k_value: k_CRT_WITHOUT_KEY_FILE
},
k_generateUploadButtonCfg({
k_labelId: 'k_cerWithoutKeyName',
k_isLabelHidden: true,
k_buttonId: 'k_cerWithoutKeyFileUpload',
k_isDisabled: true,
k_method: k_managerName + '.importCertificate',
k_params: { name: '',
type: ''
}
})
]
}
]
}
]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
if (k_isLocalAuthority) {
k_dialogHeight = 300;
}
else if (k_hasPrivateKey) {
k_dialogHeight = 380;
}
else {
k_dialogHeight = 150;
}
k_dialogCfg = {
k_width: 520,
k_height: k_dialogHeight,
k_title: k_tr('Import Certificate', 'wlibCertificateImport'),
k_content: k_form,
k_buttons: [{
k_id: 'k_btnImport',
k_isDefault: true,
k_caption: k_tr('Import', 'wlibButtons'),

k_onClick: function(k_toolbar) {
var
k_tr = kerio.lib.k_tr,
k_dialog = k_toolbar.k_dialog,
k_form = k_dialog.k_form,
k_hasPrivateKey = k_form.k_hasPrivateKey,
k_certificateFileName = k_form.k_certificateFileName.k_getValue(),
k_keyFileName = k_form.k_keyFileName ? k_form.k_keyFileName.k_getValue() : '',
k_importFormatValue = k_form.k_importFormatRadio.k_getValue(),
k_isPemFormat = k_form.k_PEM_FORMAT === k_importFormatValue,
k_isPkcsFormat  = k_form.k_PKCS_FORMAT === k_importFormatValue,
k_isCrtWithoutKeyFormat  = k_form.k_CRT_WITHOUT_KEY_FORMAT === k_importFormatValue,
k_isUrlImportCrtKeyType = k_form.k_crtWithoutKeyType && k_form.k_CRT_WITHOUT_KEY_URL === k_form.k_crtWithoutKeyType.k_getValue();
if (k_isPemFormat
&& ((!k_hasPrivateKey && k_certificateFileName === '')
|| (k_hasPrivateKey && (k_certificateFileName === '' || k_keyFileName === '')))
) {
kerio.lib.k_alert({
k_title: k_tr('Incorrect Input', 'wlibAlerts'),
k_msg: k_hasPrivateKey ?
k_tr('Select both key and certificate files to upload.', 'wlibCertificateImport') :
k_tr('Select a certificate file to upload.', 'wlibCertificateImport')
});
return;
}
if (k_isPkcsFormat && '' === k_form.k_pkcsFileName.k_getValue()) {
kerio.lib.k_alert({
k_title: k_tr('Incorrect Input', 'wlibAlerts'),
k_msg: k_tr('Select a certificate file to upload.', 'wlibCertificateImport')
});
return;
}
if (k_isCrtWithoutKeyFormat && (
(!k_isUrlImportCrtKeyType && '' === k_form.k_cerWithoutKeyName.k_getValue())
|| (k_isUrlImportCrtKeyType && '' === k_form.k_cerWithoutKeyServerUrl.k_getValue())
)) {
kerio.lib.k_alert({
k_title: k_tr('Incorrect Input', 'wlibAlerts'),
k_msg: k_tr('Select a certificate file to upload or set a server URL.', 'wlibCertificateImport')
});
return;
}
k_dialog.k_showMask(k_tr('Importing certificate…', 'wlibCertificateImport'));
if (k_isPemFormat) {
k_dialog.k_sendPemData();
}
else if (k_isPkcsFormat) {
k_dialog.k_sendPkcsData();
}
else {
k_dialog.k_sendCrtWithoutKey();
}
}
}, {
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'wlibButtons'),
k_isCancel: true
}]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_form.k_addReferences({
k_PEM_FORMAT: k_PEM_FORMAT,
k_PKCS_FORMAT: k_PKCS_FORMAT,
k_CRT_WITHOUT_KEY_FORMAT: k_CRT_WITHOUT_KEY_FORMAT,
k_CRT_WITHOUT_KEY_URL: k_CRT_WITHOUT_KEY_URL,
k_CRT_WITHOUT_KEY_FILE: k_CRT_WITHOUT_KEY_FILE,
k_hasPrivateKey: k_hasPrivateKey,
k_isSigned: k_isSigned,
k_keyFileName: k_form.k_getItem('k_keyFileName'),
k_keyFileUpload: k_form.k_getItem('keyFileUpload'),
k_certificateFileName: k_form.k_getItem('k_certificateFileName'),
k_certificateFileUpload: k_form.k_getItem('certificateFileUpload'),
k_pkcsFileName: k_form.k_getItem('k_pkcsFileName'),
k_pkcsFileUpload: k_form.k_getItem('k_pkcsFileUpload'),
k_pkcsPassword: k_form.k_getItem('k_pkcsPassword'),
k_cerWithoutKeyName: k_form.k_getItem('k_cerWithoutKeyName'),
k_cerWithoutKeyFileUpload: k_form.k_getItem('k_cerWithoutKeyFileUpload'),
k_cerWithoutKeyServerUrl: k_form.k_getItem('k_cerWithoutKeyServerUrl'),
k_crtWithoutKeyType: k_form.k_getItem('k_crtWithoutKeyType'),
k_importType: undefined,
k_importFormatRadio: k_form.k_getItem('k_importFormat'),
k_dialog: k_dialog,
k_resetUploadFiles: k_resetUploadFiles,
k_setVisibleUploadAnotherPkcsFile: k_setVisibleUploadAnotherPkcsFile,
k_parentDialog: undefined,
k_enableCrtWithoutKeyContent: k_enableCrtWithoutKeyContent,
k_isLocalAuthority: k_isLocalAuthority
});
k_dialog.k_addReferences({
k_form: k_form,
k_importId: undefined
});
k_form.k_keyFileUpload.k_addReferences({
k_relatedLabel: k_form.k_keyFileName
});
k_form.k_certificateFileUpload.k_addReferences({
k_relatedLabel: k_form.k_certificateFileName
});
k_form.k_pkcsFileUpload.k_addReferences({
k_relatedLabel: k_form.k_pkcsFileName
});
if (!k_isLocalAuthority) {
k_form.k_cerWithoutKeyFileUpload.k_addReferences({
k_relatedLabel: k_form.k_cerWithoutKeyName
});
}
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_form.k_importType = k_params.k_importType;
this.k_form.k_certificateFileUpload.k_setAdditionalRequestParams({
type: k_params.k_importType
});
};

k_kerioWidget.k_sendPemData = function() {
var
k_form = this.k_form;
if (k_form.k_hasPrivateKey) {
k_form.k_keyFileUpload.k_upload();
}
else { k_form.k_certificateFileUpload.k_setAdditionalRequestParams({
name: (this.k_isSigned ? this.k_relatedGrid.k_selectionStatus.k_rows[0].k_data.name : k_form.k_getName()),
keyId: (k_form.k_isSigned) ? this.k_relatedGrid.k_selectionStatus.k_rows[0].k_data.id : '',
type: k_form.k_importType
});
k_form.k_certificateFileUpload.k_upload();
}
};
k_kerioWidget.k_sendPkcsData = function() {
var
k_getSharedConstants = kerio.lib.k_getSharedConstants(),
k_form = this.k_form,
k_localAuthorityType = k_getSharedConstants.kerio_web_LocalAuthority,
k_certificateType = k_getSharedConstants.kerio_web_InactiveCertificate;
k_form.k_pkcsFileUpload.k_setAdditionalRequestParams({
name: k_form.k_getName(),
type: k_localAuthorityType === k_form.k_importType ? k_localAuthorityType : k_certificateType,
password: k_form.k_pkcsPassword.k_getValue()
});
k_form.k_pkcsFileUpload.k_upload(false);
};
k_kerioWidget.k_sendCrtWithoutKey = function() {
var
k_getSharedConstants = kerio.lib.k_getSharedConstants(),
k_form = this.k_form,
k_certificateType = k_getSharedConstants.kerio_web_ServerCertificate;
if (k_form.k_cerWithoutKeyName.k_getValue()) {
k_form.k_cerWithoutKeyFileUpload.k_setAdditionalRequestParams({
name: k_form.k_getName(),
keyId: '',
type: k_certificateType
});
k_form.k_cerWithoutKeyFileUpload.k_upload();
}
else {
kerio.waw.requests.k_send({
k_jsonRpc: {
method: 'Certificates.importCertificateUrl',
params: {
url: k_form.k_cerWithoutKeyServerUrl.k_getValue()
}
},
k_scope: this,
k_callback: function(k_response, k_success) {
if (k_success) {
this.k_mask(false);
kerio.adm.k_framework.k_enableApplyReset(true);
this.k_relatedGrid.k_reloadData();
this.k_form.k_resetUploadFiles();
this.k_hide();
}
else {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
this.k_form.k_cerWithoutKeyServerUrl.k_focus();
}
}
});
}
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_setDisabled('k_keyFileFs', false);
this.k_form.k_setVisibleUploadAnotherPkcsFile(false);
this.k_form.k_reset();
};

k_kerioWidget.k_form.k_getName = function() {
var
k_importFormatRadio = this.k_importFormatRadio.k_getValue(),
k_isPemFormat = this.k_PEM_FORMAT === k_importFormatRadio,
k_isPkcsFormat = this.k_PKCS_FORMAT === k_importFormatRadio,
k_name;
if (k_isPemFormat) {
k_name = this.k_certificateFileName.k_getValue();
}
else if (k_isPkcsFormat) {
k_name = this.k_pkcsFileName.k_getValue();
}
else {
k_name = this.k_cerWithoutKeyName.k_getValue();
}
k_name = kerio.adm.k_widgets.certificateList.k_getName(k_name);
return k_name;
};
}
};
