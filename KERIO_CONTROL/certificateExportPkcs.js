
kerio.waw.ui.certificateExportPkcs = {

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
k_labelWidth: 150,
k_items: [{
k_id: 'includeCa',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_isChecked: true,
k_option: k_tr('Include all certificates in the certification path if possible', 'certificateExport')
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_style: 'padding-top: 20px',
k_value: k_tr('Set password for the certificate file:', 'certificateExport')
},
{
k_id: 'password',
k_emptyText: '',
k_caption: k_tr('Password:','certificateExport'),
k_isPasswordField: true
}, {
k_id: 'k_confirmPassword',
k_emptyText: '',
k_caption: k_tr('Confirm password:','certificateExport'),
k_isPasswordField: true
}]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 460,
k_height: 210,
k_title: k_tr('Export Certificate in PKCS#12 Format', 'certificateExport'),
k_content: k_form,
k_defaultItem: k_localNamespace + 'k_form' + '_' + 'password',
k_buttons:[
{	k_id: 'k_btnOk',
k_isDefault: true,
k_caption: k_tr('Export', 'certificateExport'),

k_onClick: function(k_toolbar) {
k_toolbar.k_dialog.k_saveData();
}},
{	k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'common'),
k_isCancel: true
}
]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_relatedForm: null,
k_keyId: '',
k_passwordField: k_form.k_getItem('password'),
k_passwordConfirmationField: k_form.k_getItem('k_confirmPassword')
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
this.k_certificateId = k_params.k_certificateId;
};

k_kerioWidget.k_saveData = function() {
var
k_data = this.k_form.k_getData(),
k_tr = kerio.lib.k_tr,
k_passwordField = this.k_passwordField,
k_passwordConfirmationField = this.k_passwordConfirmationField,
k_requestCfg;
k_passwordField.k_markInvalid(false);
k_passwordConfirmationField.k_markInvalid(false);
if ('' === k_data.password) {
kerio.lib.k_alert({
k_title: k_tr('Password', 'certificateExport'),
k_msg: k_tr('The password cannot be empty.', 'certificateExport'),
k_icon: 'warning'
});
k_passwordField.k_markInvalid(true);
k_passwordField.k_focus();
return;
}
if (k_data.password !== k_data.k_confirmPassword) {
kerio.lib.k_alert({
k_icon: 'warning',
k_title: k_tr('Password', 'certificateExport'),
k_msg: k_tr('Password and password confirmation do not match.', 'certificateExport')
});
k_passwordConfirmationField.k_markInvalid(true);
k_passwordConfirmationField.k_focus();
return;
}
k_requestCfg = {
k_jsonRpc: {
method: 'Certificates.exportCertificateP12',
params: {
id: this.k_certificateId,
password: k_data.password,
includeCa: k_data.includeCa
}
},

k_callback: function(k_response) {
if (k_response.k_isOk) {
this.k_resetOnClose();
this.k_hide();
}
},
k_scope: this
};
kerio.lib.k_ajax.k_request(k_requestCfg);
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}
};
