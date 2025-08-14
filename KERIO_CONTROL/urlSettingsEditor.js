
kerio.waw.ui.urlSettingsEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_dialog, k_dialogCfg,
k_form, k_formCfg;
k_formCfg = {
k_items: [
{
k_caption: k_tr('URL:', 'urlSettingsEditor'),
k_id: 'url',
k_maxLength: kerio.waw.shared.k_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_hasNoSpaces'
}
},
{
k_type: 'k_display',
k_caption: ' ',
k_value: '<i>' + k_tr('Example: %1 or %2', 'urlSettingsEditor', {
k_args: [
'<b>' + 'example.com' + '</b>',
'<b>' + 'example.com/some/path' + '</b>'
], k_isSecure: true})
+ '</i>',
k_isSecure: true
},
{
k_type: 'k_columns',
k_items: [
{
k_type: 'k_number',
k_id: 'ttl',
k_width: 50,
k_caption: k_tr('TTL:', 'urlSettingsEditor'),
k_value: 0,
k_maxLength: 4,
k_minValue: 0,
k_maxValue: 2400,k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_value: k_tr('hour(s)', 'urlSettingsEditor')
}
]
},
{
k_caption: k_tr('Description:', 'common'),
k_id: 'description',
k_maxLength: 255,
k_checkByteLength: true,
k_validator: {
k_allowBlank: true,
k_functionName: 'k_isDescription'
}
}
]
};
k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 450,
k_height: 190,
k_title: ('urlSettingsEditorEdit' === k_objectName ? k_tr('Edit URL', 'urlSettingsEditor') : k_tr('Add URL', 'urlSettingsEditor')),
k_content: k_form,
k_defaultItem: 'url',

k_onOkClick: function(k_toolbar){
var
k_dialog = this.k_parentWidget,
k_data = k_dialog.k_form.k_getData();
k_data.url = kerio.waw.shared.k_methods.k_correctUri(k_data.url);
if (k_toolbar.k_dialog.k_saveCallback(k_data, k_dialog.k_editedRowIndex)) {
k_dialog.k_hide();
} else {
k_dialog.k_hideMask();
}
} }; k_dialog = new k_lib.K_Dialog(k_objectName, kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_form: k_form,
k_saveCallback: undefined,
k_editedRowIndex: undefined
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
this.k_saveCallback = k_params.k_callback;
if (k_params.k_data) {
this.k_form.k_setData(k_params.k_data);
this.k_editedRowIndex = k_params.k_rowIndex;
}
};
k_kerioWidget.k_resetOnClose = function() {
this.k_editedRowIndex = undefined;
this.k_form.k_reset();
};
} }; 