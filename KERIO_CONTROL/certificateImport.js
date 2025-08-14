

kerio.adm.k_widgets.certificateImport = {

k_init: function(k_objectName, k_initParams) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_localNamespace = k_objectName + '_',
k_managerName = k_initParams.k_managerName,
k_isSigned = 'certificateImportSigned' === k_objectName,
k_hasPrivateKey = ('certificateImportNew' === k_objectName || 'certificateImportLocal' === k_objectName),
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_resetUploadFiles;

k_resetUploadFiles = function() {
if (this.k_hasPrivateKey) {
this.k_keyFileName.k_reset();
this.k_keyFileUpload.k_reset();
}
this.k_certificateFileName.k_reset();
this.k_certificateFileUpload.k_reset();
};
k_formCfg = {
k_labelWidth: 150,
k_restrictBy: {
k_hasPrivateKey: k_hasPrivateKey
},
k_items: [{
k_restrictions: {
k_hasPrivateKey: [ true ]
},
k_type: 'k_fieldset',
k_id: 'k_keyFileFs',
k_caption: k_tr('Key file', 'wlibCertificateImport'),
k_items: [{
k_type: 'k_row',
k_items: [{
k_id: 'k_keyFileName',
k_isLabelHidden: true,
k_isReadOnly: true,
k_width: '100%'
}, {
k_type: 'k_formUploadButton',
k_id: 'keyFileUpload',
k_caption: k_tr('Select…', 'wlibButtons'),
k_remoteData: {
k_isAutoUpload: false,
k_jsonRpc: {
method: k_managerName + '.importPrivateKey'
}
},

k_onChange: function(k_form, k_item, k_value) {
k_form.k_keyFileName.k_setValue(k_value);
},

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
}]
}, {
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('E.g. *.key file', 'wlibCertificateImport')
}]
}, {
k_type: 'k_fieldset',
k_caption: k_tr('Certificate file', 'wlibCertificateImport'),
k_className: 'formLastContainer',
k_items: [{
k_type: 'k_row',
k_items: [{
k_id: 'k_certificateFileName',
k_isLabelHidden: true,
k_isReadOnly: true,
k_width: '100%'
}, {
k_type: 'k_formUploadButton',
k_id: 'certificateFileUpload',
k_caption: k_tr('Select…', 'wlibButtons'),
k_remoteData: {
k_isAutoUpload: false,
k_jsonRpc: {
method: k_managerName + '.importCertificate',
params: { name: '',
keyId: '',
type: ''
}
}
},

k_onChange: function(k_form, k_item, k_value) {
k_form.k_certificateFileName.k_setValue(k_value);
},

k_onUpload: function (k_form, k_item, k_response) {
var k_dialog = k_form.k_dialog;
k_dialog.k_mask(false);
if (k_response.k_isOk) {
kerio.adm.k_framework.k_enableApplyReset(true);k_dialog.k_relatedGrid.k_reloadData();
k_dialog.k_hide();
}
else {
k_form.k_resetUploadFiles();
}
}
}]
}, {
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('E.g. *.crt file', 'wlibCertificateImport')
}]
}]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 360,
k_height: (k_hasPrivateKey ? 270 : 180),
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
k_hasPrivateKey = k_dialog.k_hasPrivateKey,
k_form = k_dialog.k_form,
k_certificateFileName = k_form.k_certificateFileName.k_getValue(),
k_keyFileName = (k_form.k_keyFileName ? k_form.k_keyFileName.k_getValue() : '');
if ((!k_hasPrivateKey && k_certificateFileName === '') ||
k_hasPrivateKey && (k_certificateFileName === '' || k_keyFileName === '')) {
kerio.lib.k_alert({
k_title: k_tr('Incorrect Input', 'wlibAlerts'),
k_msg: k_hasPrivateKey ?
k_tr('Select both key and certificate files to upload.', 'wlibCertificateImport') :
k_tr('Select a certificate file to upload.', 'wlibCertificateImport')
});
return;
}
k_dialog.k_showMask(k_tr('Importing certificate', 'wlibCertificateImport'));
k_dialog.k_sendData();
}
}, {
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'wlibButtons'),
k_isCancel: true
}]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_form.k_addReferences({
k_hasPrivateKey: k_hasPrivateKey,
k_isSigned: k_isSigned,
k_keyFileName: k_form.k_getItem('k_keyFileName'),
k_keyFileUpload: k_form.k_getItem('keyFileUpload'),
k_certificateFileName: k_form.k_getItem('k_certificateFileName'),
k_certificateFileUpload: k_form.k_getItem('certificateFileUpload'),
k_importTYpe: kerio.lib.k_getSharedConstants('kerio_web_ActiveCertificate'),
k_dialog: k_dialog,
k_resetUploadFiles: k_resetUploadFiles,
k_parentDialog: undefined
});
k_dialog.k_addReferences({
k_form: k_form,
k_importId: undefined
});
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

k_kerioWidget.k_sendData = function() {
var
k_form = this.k_form,
k_data,
k_name,
k_keyId;
if (k_form.k_hasPrivateKey) {
k_form.k_keyFileUpload.k_upload();
}
else { if (k_form.k_isSigned) {
k_data = this.k_relatedGrid.k_selectionStatus.k_rows[0].k_data;
k_name = k_data.name;
k_keyId = k_data.id;
}
else {
k_name = k_form.k_getName();
k_keyId = '';
}
k_form.k_certificateFileUpload.k_setAdditionalRequestParams({
name: k_name,
keyId: k_keyId,
type: k_form.k_importType
});
k_form.k_certificateFileUpload.k_upload();
}
};

k_kerioWidget.k_resetOnClose = function() {
var
k_form = this.k_form;
if (k_form.k_hasPrivateKey) {
k_form.k_setDisabled('k_keyFileFs', false);
}
k_form.k_reset();
};

k_kerioWidget.k_form.k_getName = function() {
var
k_name;
k_name = this.k_getItem('k_certificateFileName').k_getValue();
k_name = kerio.adm.k_widgets.certificateList.k_getName(k_name);
return k_name;
};
}
};
