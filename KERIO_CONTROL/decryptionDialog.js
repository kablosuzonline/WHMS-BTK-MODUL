
kerio.waw.ui.decryptionDialog = {
k_init: function (k_objectName) {
var
k_tr = kerio.lib.k_tr,
k_text,
k_dialogCfg,
k_dialog,
k_formCfg,
k_form;
k_formCfg = {
k_className: 'decrypt-dlg-form',
k_items: [
{
k_type: 'k_container',
k_items: [
{
k_type: 'k_display',
k_className: 'decrypt-dlg-title',
k_itemClassName: 'decrypt-dlg-title-item',
k_isSecure: true,
k_value: k_tr('Disabling encryption will store all data on disk without encryption. <br/>Please enter data encryption password to continue.', 'decryptionDialog'),
k_icon: '../weblib/ext/extjs/resources/images/default/window/icon-question.gif'
},
{
k_id: 'k_passIncorrectLbl',
k_type: 'k_display',
k_itemClassName: 'decrypt-dlg-error-item',
k_className: 'decrypt-dlg-error',
k_value: k_tr('Password is incorrect.', 'decryptionDialog'),
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_className: 'decrypt-dlg-password-lbl',
k_value: k_tr('Password:', 'decryptionDialog'),
},
{
k_id: 'k_decryptPwd',
k_type: 'k_text',
k_itemClassName: 'decrypt-dlg-password-item',
k_className: 'decrypt-dlg-password',
k_width: 235,
k_isLabelHidden: false,
k_isPasswordField: true,
k_validator: {
k_allowBlank: false
},
k_onChange: function (k_form, k_item) {
var password = k_item.k_getValue(),
k_decryptBtn = k_form.k_getItem('k_decryptBtn');
if (password !== undefined && password !== null && password.length > 0) {
k_decryptBtn.k_setDisabled(false);
}
else {
k_decryptBtn.k_setDisabled(true);
}
k_dialog.k_setErrorVisible(false);
},
k_onBlur: function (k_form, k_item) {
},
k_onKeyPress: function (k_form, k_item, k_event) {
}
}
]
},
{
k_type: 'k_container',
k_className: 'decrypt-dlg-btns',
k_items: [
{
k_id: 'k_decryptBtn',
k_type: 'k_formButton',
k_isDefault: true,
k_caption: k_tr('Decrypt', 'decryptionDialog'),
k_width: 80,
k_isDisabled: true,
k_onClick: function (k_form, k_item, k_event) {
var k_decryptPwd = k_form.k_getItem('k_decryptPwd'),
password = k_decryptPwd.k_getValue();
k_dialog.k_handleDecryptClick(password);
}
},
{
k_type: 'k_formButton',
k_isCancel: true,
k_caption: k_tr('Cancel', 'decryptionDialog'),
k_onClick: function (k_form, k_item, k_event) {
k_dialog.k_hide();
}
}
]
}
]
}
]
};
k_form = new kerio.lib.K_Form(k_objectName + '_' + 'k_form', k_formCfg);
k_dialogCfg = {
k_height: 160,
k_width: 505,
k_className: 'decrypt-dlg',
k_title: k_tr('Confirm action', 'decryptionDialog'),
k_content: k_form,
k_hasHelpIcon: false,
k_isResizable: false,
k_buttons: []
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_form: k_form
});
return k_dialog;
}, k_addControllers: function (k_kerioWidget) {

k_kerioWidget.k_applyParams = function (k_params) {
var k_params = k_params || {},
k_passIncorrectLbl = k_kerioWidget.k_form.k_getItem('k_passIncorrectLbl'),
k_decryptPwd = k_kerioWidget.k_form.k_getItem('k_decryptPwd');
this.k_onDecryptClickCallback = k_params.k_onDecryptClickCallback;
k_decryptPwd.k_setValue('');
k_kerioWidget.k_setErrorVisible(false);
};
k_kerioWidget.k_handleDecryptClick = function (password) {
if (this.k_onDecryptClickCallback) {
this.k_onDecryptClickCallback(password);
}
}
k_kerioWidget.k_setErrorVisible = function (isVisible) {
var k_passIncorrectLbl = k_kerioWidget.k_form.k_getItem('k_passIncorrectLbl'),
k_decryptPwd = k_kerioWidget.k_form.k_getItem('k_decryptPwd');
if (isVisible) {
k_passIncorrectLbl.k_addClassName('err-visible');
k_decryptPwd.k_markInvalid(true);
}
else {
k_passIncorrectLbl.k_removeClassName('err-visible');
k_decryptPwd.k_markInvalid(false);
}
}
}
};
