
kerio.waw.ui.reverseProxyRuleEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAddMode = 'reverseProxyRuleEditorAdd' === k_objectName,
k_dialog, k_dialogCfg,
k_form, k_formCfg;
k_formCfg = {
k_labelWidth: 70,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Public server name', 'reverseProxyRuleEditor'),
k_items: [
{
k_id: 'serverHostname',
k_caption: k_tr('Host:', 'reverseProxyRuleEditor'),
k_maxLength: k_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isReverseProxyPublicHost'
}
},
{
k_type: 'k_checkbox',
k_id: 'serverHttp',
k_caption: k_tr('Protocol:', 'reverseProxyRuleEditor'),
k_option: k_tr('HTTP', 'reverseProxyRuleEditor')
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_checkbox',
k_id: 'k_httpsMode',
k_caption: '', k_option: k_tr('HTTPS', 'reverseProxyRuleEditor'),
k_width: 70,

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_parentWidget.k_customCertificate.k_setDisabled(!k_isChecked);
}
},
k_shared.k_methods.k_getSslCertificateFields('k_reverseProxyRule', '', {
k_isDisabled: true,
k_onCertificateChange: function(k_form, k_select, k_value) {
k_select.k_markInvalid('' === k_value);
}
})
]
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Internal server', 'reverseProxyRuleEditor'),
k_items: [
{
k_id: 'targetServer',
k_caption: k_tr('Server:', 'reverseProxyRuleEditor'),
k_maxLength: k_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isReverseProxyInternalHost'
}
},
{
k_type: 'k_checkbox',
k_id: 'targetHttps',
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_getItem("forceHTTPSRedirection").k_setDisabled(!k_isChecked);
if(!k_isChecked) {
k_form.k_getItem("forceHTTPSRedirection").k_setChecked(false);
}
},
k_caption: '', k_option: k_tr('Use secured connection', 'reverseProxyRuleEditor')
},
{
k_type: 'k_checkbox',
k_id: 'forceHTTPSRedirection',
k_enabled: true,
k_caption: '', k_option: k_tr('Force HTTPS Redirection', 'reverseProxyRuleEditor')
}
]
},
{
k_type: 'k_container',
k_labelWidth: 80,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'antivirus',
k_caption: k_tr('Antivirus:', 'reverseProxyRuleEditor'),
k_option: k_tr('Perform antivirus scanning', 'reverseProxyRuleEditor')
},
{
k_id: 'description',
k_caption: k_tr('Description:', 'common'),
k_maxLength: 255,
k_checkByteLength: true
}
]
}
]
}; k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_height: 400,
k_width: 470,
k_title: k_tr('Reverse Proxy Rule', 'reverseProxyRuleEditor'),
k_content: k_form,
k_defaultItem: 'serverHostname',

k_onOkClick: function(k_toolbar){
var
k_dialog = k_toolbar.k_dialog,
k_result;
k_result = k_dialog.k_sendData();
kerio.waw.shared.k_methods.k_unmaskMainScreen(k_dialog);
if (k_result) {
k_dialog.k_hide();
}
}
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_isAddMode: k_isAddMode,
k_form: k_form,
k_customCertificate: k_form.k_getItem('k_certificate'),
k_relatedGrid: null
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_applyParams: function(k_params) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
HttpsServerMode = k_CONSTANTS.HttpsServerMode,
k_data = kerio.lib.k_cloneObject(k_params.k_data),
k_activeItem,
k_certificate;
this.k_relatedGrid = k_params.k_relatedWidget;
k_data.k_httpsMode = HttpsServerMode.HttpsServerModeDisabled !== k_data.httpsMode;
if (!k_data.targetHttps) {
k_data.forceHTTPSRedirection = false;
}
if (this.k_isAddMode) {
k_certificate = {
id: HttpsServerMode.HttpsServerModeDefaultCertificate,
invalid: false };
}
else {
if (HttpsServerMode.HttpsServerModeDefaultCertificate === k_data.httpsMode) {
k_certificate = {
id: k_CONSTANTS.k_REVERSE_PROXY_DEFAULT_CERTIFICATE_ID
};
}
else {
k_certificate = k_data.customCertificate;
}
delete k_data.customCertificate;
}
kerio.waw.shared.k_methods.k_setSslCertificateFieldsetData(
{
k_form: this.k_form,
k_listLoaderId: 'k_certificatesReverseProxyRule',
k_handleApplyReset: false,
k_noneOptionForInvalidCertificate: HttpsServerMode.HttpsServerModeDefaultCertificate !== k_data.httpsMode
},
k_certificate
);
if (!this.k_isAddMode) {
this.k_customCertificate._k_select.k_markInvalid(false);
this.k_form.k_setData(k_data);
}
if (k_params.k_activeItem) {
if ('customCertificate' === k_params.k_activeItem) {
k_params.k_activeItem = k_data.k_httpsMode ? 'k_certificate' : 'k_httpsMode';
}
k_activeItem = this.k_form.k_getItem(k_params.k_activeItem);
if (k_activeItem) {
k_activeItem.k_focus();
}
}
},

k_sendData: function() {
var
k_tr = kerio.lib.k_tr,
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
HttpsServerMode = k_CONSTANTS.HttpsServerMode,
k_form = this.k_form,
k_httpsMode,
k_data,
k_certificate;
if (!k_form.k_isValid()) {
return false;
}
k_data = k_form.k_getData();
k_certificate = k_data.k_certificate;
if (!k_data.serverHttp && !k_data.k_httpsMode) {
kerio.lib.k_alert({
k_title: k_tr('Warning', 'common'),
k_msg: k_tr('At least one protocol (HTTP or HTTPS) should be used in the reverse proxy rule.', 'reverseProxyRuleEditor'),
k_icon: 'warning'
});
return false;
}
if (!k_data.targetHttps) {
k_data.forceHTTPSRedirection = false;
}
if (k_data.k_httpsMode) {
if ('' === k_certificate) {
kerio.lib.k_alert({
k_title: k_tr('Warning', 'common'),
k_msg: k_tr('No certificate is selected for HTTPS', 'reverseProxyRuleEditor'),
k_icon: 'warning'
});
this.k_customCertificate._k_select.k_markInvalid(true);
return false;
}
if (k_CONSTANTS.k_REVERSE_PROXY_DEFAULT_CERTIFICATE_ID === k_certificate) {
k_httpsMode = HttpsServerMode.HttpsServerModeDefaultCertificate;
k_data.customCertificate = {
id: ''
};
}
else {
k_httpsMode = HttpsServerMode.HttpsServerModeCustomCertificate;
k_data.customCertificate = {
id: k_certificate
};
}
}
else {
k_httpsMode = HttpsServerMode.HttpsServerModeDisabled;
k_data.customCertificate = {
id: '',
invalid: true
};
}
k_data.httpsMode = k_httpsMode;
delete k_data.k_certificate;
delete k_data.k_httpsMode;
if (this.k_isAddMode) {
k_data.enabled = true;
this.k_relatedGrid.k_addRule(k_data);
}
else {
this.k_relatedGrid.k_updateRule(k_data);
}
return true;
},

k_resetOnClose: function() {
this.k_form.k_setVisible('k_certificateError', false);
this.k_customCertificate._k_select.k_markInvalid(false);
this.k_form.k_reset();
}
});
} }; 