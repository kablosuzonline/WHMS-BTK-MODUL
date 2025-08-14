
kerio.waw.ui.addEmailAddress = {

k_init: function(k_objectName){
var
k_id = 'k_addEmailAddress' + '_' + k_objectName, k_localNamespace = k_id + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_form, k_formCfg,
k_dialog, k_dialogCfg;
k_formCfg = {
k_labelWidth: 170,
k_items: [
{
k_id: 'k_emailAddress',
k_caption: k_tr('Email address:', 'addEmailAddress'),
k_maxLength: kerio.waw.shared.k_CONSTANTS.k_MAX_LENGTH.k_EMAIL_ADDRESS,
k_value: '',
k_validator: {
k_functionName: 'k_isEmail',
k_allowBlank: false
}
} ]
}; k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);

k_dialogCfg = {
k_defaultItem: 'k_emailAddress',
k_height: 120,
k_width: 400,
k_title: k_tr('Email Address', 'addEmailAddress'),
k_content: k_form,
k_isAuditor: false, 
k_onOkClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_setEmail();
},
k_mask: false
};
k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialogCfg.k_hasHelpIcon = false; k_dialog = new k_lib.K_Dialog(k_id, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_email: k_form.k_getItem('k_emailAddress'),
k_parentDialog: null,
k_callback: null,
k_resetValue: true
});
k_form.k_addReferences({
k_dialog: k_dialog
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
this.k_parentDialog = k_params.k_parentDialog;
this.k_callback = k_params.k_callback;
this.k_resetValue = (false !== k_params.k_resetValue); if (undefined !== k_params.k_initValue) {
this.k_email.k_setValue(k_params.k_initValue, true);
}
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); }; 
k_kerioWidget.k_setEmail = function() {
var k_email = this.k_email.k_getValue();
if (false !== this.k_callback.call(this.k_parentDialog, k_email, this)) {
this.k_hide();
}
}; 
k_kerioWidget.k_resetOnClose = function() {
if (this.k_resetValue) {
this.k_form.k_reset();
}
}; } }; 