
kerio.waw.ui.alertWithCheckbox = {

k_init: function(k_objectName) {
var
k_DEFAULT_WIDTH = 300,
k_DEFAULT_HEIGHT = 200,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isCutOff = ('k_cutOffDialog' === k_objectName || 'k_cutOffBlockingDialog' === k_objectName),
k_isPermanent = ('k_permanentDialog' === k_objectName || 'k_cutOffBlockingDialog' === k_objectName),
k_form, k_formCfg,
k_dialog, k_dialogCfg;
k_formCfg = {
k_items: [
{
k_type: 'k_container',
k_anchor: (k_isPermanent || k_isCutOff ? undefined : '0 -20'), k_items: [
{
k_type: 'k_display',
k_id: 'k_messageTitle',
k_isLabelHidden: true,
k_isSecure: true,
k_isHidden: true
},
{
k_type: 'k_display',
k_id: 'k_message',
k_isSecure: true,
k_isLabelHidden: true,
k_value: '' }
]
},
{
k_type: 'k_container',
k_className: 'removeItemsMargin',
k_items: [{
k_type: 'k_checkbox',
k_id: 'k_disable',
k_isLabelHidden: true,
k_option: k_tr('Never show this message again', 'common')
}]
}
] }; k_form = new kerio.lib.K_Form(k_objectName + '_' + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: (k_isCutOff) ? 500 : k_DEFAULT_WIDTH,
k_height: (k_isCutOff) ? 250 : k_DEFAULT_HEIGHT,
k_isResizable: false,
k_hasHelpIcon: false,
k_content: k_form,
k_className: (k_isPermanent) ? 'noCloseButton' : '',
k_title: (k_isCutOff)
? kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_alertTitle
: (k_isPermanent)
? '' : k_tr('Administration Warning', 'common'),
k_buttons: (k_isPermanent) ? [] : [
{
k_isDefault: true,
k_isCancel: true,
k_id: 'k_btnOK',
k_caption: k_tr('OK', 'common'),
k_mask: {
k_message: k_tr('Please wait…', 'common')
},

k_onClick: this.k_onClose
}
] }; k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_params: {},
k_isCutOff: k_isCutOff,
k_isPermanent: k_isPermanent
});
k_form.k_addReferences({
k_dialog: k_dialog,
k_message: k_form.k_getItem('k_message'),
k_messageTitle: k_form.k_getItem('k_messageTitle'),
k_disable: k_form.k_getItem('k_disable')
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({
k_applyParams: this.k_onLoad,
k_resetOnClose: this.k_afterClose,
k_onGetMainScreen: this.k_onGetMainScreen
}); }, 
k_onLoad: function(k_params) {
var k_form = this.k_form;
if (!k_params.k_message || (!this.k_isPermanent && !this.k_isCutOff && !k_params.k_callback)) {
kerio.lib.k_reportError('Internal error: Missing params!', 'alertWithCheckbox', 'ApplyParams');
return;
}
this.k_params = k_params;
if (!this.k_isCutOff) {
this.k_setSize({ k_width: 300,
k_height: 200
});
this.k_form.k_reset(); }
k_form.k_message.k_setValue(k_params.k_message);
if (k_params.k_shortMessage) {
k_form.k_setVisible('k_messageTitle');
k_form.k_messageTitle.k_setValue('<b>' + k_params.k_shortMessage + '</b>');
}
k_form.k_setVisible(['k_disable'], false !== k_params.k_showDisable);
if (k_params.k_title) {
this.k_setTitle(k_params.k_title);
}
if (k_params.k_size) {
this.k_setSize(k_params.k_size);
this.k_extWidget.center(); }
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); }, 
k_onClose: function() {
var
k_dialog = this.k_parentWidget,
k_params = k_dialog.k_params,
k_scope  = k_params.k_scope || window;
k_dialog.k_hide();
if (k_dialog.k_isCutOff && !k_params.k_callback) { return;
}
k_params.k_callback.call(k_scope, k_params.k_callbackParams, k_dialog.k_form.k_disable.k_getValue());
}, 
k_afterClose: function() {
if (this.k_isCutOff && kerio.waw.requests.k_isConnectionOk()) {
return; }
if (this.k_isPermanent) {
this.k_show();
}
},

k_onGetMainScreen: function(){
var k_windows = kerio.lib._k_windowManager._k_stack, k_myIndex = k_windows.indexOf(this);
if (0 === k_myIndex) { return null; }
return k_windows.get(k_myIndex - 1); }
}; 