
kerio.waw.ui.securitySettingsMacEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_isAddMode = 'securitySettingsMacEditorAdd' === k_objectName,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_formCfg,
k_form,
k_dialogCfg,
k_dialog;
k_formCfg = {
k_items: [
{
k_id: 'macAddress',
k_caption: k_tr('MAC address:', 'securitySettingsMacEditor'),
k_maxLength: kerio.waw.shared.k_CONSTANTS.k_MAX_LENGTH.k_MAC_ADDRESS,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isMacAddress'
}
},
{
k_id: 'description',
k_caption: k_tr('Description:', 'common'),
k_maxLength: 255,
k_checkByteLength: true,
k_validator: {
k_allowBlank: true,
k_functionName: 'k_isDescription'
}
}
] };k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_height: 145,
k_width: 300,
k_title: (k_isAddMode)
? k_tr('Add MAC Address', 'securitySettingsMacEditor')
: k_tr('Edit MAC Address', 'securitySettingsMacEditor'),
k_content: k_form,
k_defaultItem: 'macAddress',

k_onOkClick: function(k_toolbar){
k_toolbar.k_dialog.k_saveData();
} }; k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_isAddMode: k_isAddMode,
k_form: k_form
});k_form.k_addReferences({
k_dialog: k_dialog
});this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var k_data;
if (this.k_isAddMode) {
k_data = {}; }
else {
k_data = k_params.k_data;
}
this.k_dataStore = k_data;
k_data.macAddress = kerio.waw.shared.k_methods.k_formatMacAddress(k_data.macAddress);
this.k_form.k_setData(k_data);
this.k_parent = k_params.k_relatedWidget;
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };
k_kerioWidget.k_saveData = function() {
var
k_lib = kerio.lib,
k_data = this.k_form.k_getData(true),
k_isUnique;
k_data.macAddress = kerio.waw.shared.k_methods.k_removeMacAddressDelimiters(k_data.macAddress);
k_isUnique = this.k_parent.k_addMacAddress(k_data, !this.k_isAddMode);
if (!k_isUnique) {
k_lib.k_alert(
k_lib.k_tr('Validation Warning', 'common'),
k_lib.k_tr('Specified MAC address is already defined.', 'securitySettingsMacEditor')
);
this.k_hideMask();
return;
}
kerio.adm.k_framework.k_enableApplyReset();
this.k_hide();
};
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}}; 