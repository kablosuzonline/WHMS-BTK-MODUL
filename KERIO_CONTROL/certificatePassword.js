

kerio.adm.k_widgets.certificatePassword = {

k_init: function(k_objectName) {
var
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_localNamespace,
k_lib = kerio.lib,
k_tr = k_lib.k_tr;
k_localNamespace = k_objectName + '_';
k_formCfg = {
k_items: [{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Enter password for key file:', 'wlibCertificateImport')
},
{
k_id: 'k_password',
k_emptyText: '',
k_isLabelHidden: true,
k_isPasswordField: true
}]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 300,
k_height: 140,
k_title: k_tr('Certificate Password', 'wlibCertificateImport'),
k_content: k_form,
k_buttons:[
{	k_id: 'k_btnOk',
k_isDefault: true,
k_caption: k_tr('OK', 'wlibButtons'),

k_onClick: function(k_toolbar) {
k_toolbar.k_dialog.k_saveData();
}},
{	k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'wlibButtons'),
k_isCancel: true
}
]};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_relatedForm: null,
k_keyId: ''
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
this.k_relatedForm = k_params.k_relatedForm;
this.k_keyId = k_params.k_keyId;
};

k_kerioWidget.k_saveData = function() {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Certificates.unlockPrivateKey',
params: {
keyId: this.k_keyId,
password: this.k_form.k_getItem('k_password').k_getValue()
}
},
k_scope: this,
k_callback: this.k_saveCallback
});
};

k_kerioWidget.k_saveCallback = function(k_response, k_success) {
if (k_success && k_response.k_isOk) {
this.k_relatedForm.k_certificateFileUpload.k_upload();
this._k_passwordOk = true;
this.k_hide();
}
else {
this.k_form.k_getItem('k_password').k_focus(); }
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
if (true !== this._k_passwordOk) {
this.k_relatedForm.k_resetUploadFiles();
this.k_relatedForm.k_dialog.k_mask(false);
delete this._k_passwordOk;
}
};
}
};
