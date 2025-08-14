
kerio.waw.ui.addHostEditor = {

k_init: function(k_objectName){
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isEditMode = ('addHostEditorEdit' === k_objectName),
k_formCfg,
k_form,
k_dialogCfg,
k_dialog;
k_formCfg = {
k_items: [
{
k_type: 'k_container',
k_labelWidth: 105,
k_items: [
{
k_id: 'ip',
k_caption: k_tr('IP Address:', 'addHostEditor'),
k_maxLength: 15,
k_isVisible: false,
k_validator: {
k_functionName: 'k_isIpAddress',
k_allowBlank: false,
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},

k_onBlur: function(k_form, k_element) {
var k_value = k_element.k_getValue();
kerio.waw.shared.k_methods.k_generateMaskForIp(k_value, { k_form: k_form, k_maskFieldId: 'subnetMask' });
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
},
kerio.waw.shared.k_DEFINITIONS.k_get('k_ipv4MaskField', {
k_id: 'subnetMask',
k_isVisible: false
}),
{
k_id: 'ip6',
k_caption: k_tr('IP Address:', 'addHostEditor'),
k_maxLength: 39,
k_isVisible: false,
k_validator: {
k_functionName: 'k_isIpv6Address',
k_allowBlank: false,
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv6.k_allowedChars
},

k_onBlur: function(k_form, k_element) {
var k_value = k_element.k_getValue();
kerio.waw.shared.k_methods.k_generateMaskForIpv6(k_value, { k_form: k_form, k_maskFieldId: 'ip6Prefix' });
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv6Chars
},
{
k_id: 'ip6Prefix',
k_caption: k_tr('Prefix Length:', 'addHostEditor'),
k_maxLength: 3,
k_isVisible: false,
k_validator: {
k_functionName: 'k_isIpv6PrefixLength',
k_allowBlank: false
}
}
]}
]
}; k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_title: (k_isEditMode) ? k_tr('Edit IP Address', 'addHostEditor') : k_tr('Add IP Address', 'addHostEditor'),
k_content: k_form,
k_height: 150,
k_width: 265, k_defaultItem: 'ip',

k_onOkClick: function() {
var
k_dialog = this.k_dialog,
k_IP_ADDRESS_EDITOR_TYPES = kerio.waw.shared.k_CONSTANTS.k_IP_ADDRESS_EDITOR_TYPES,
k_editorTypes = k_dialog.k_editorTypes,
k_data = {},
k_formData = k_dialog.k_form.k_getData(),
k_result;
if (k_editorTypes & k_IP_ADDRESS_EDITOR_TYPES.k_IPv4_ADDRESS) {
k_data.ip = k_formData.ip;
}
if (k_editorTypes & k_IP_ADDRESS_EDITOR_TYPES.k_IPv4_MASK) {
k_data.subnetMask = kerio.waw.shared.k_methods.k_convertCidrToMask(k_formData.subnetMask);
}
if (k_editorTypes & k_IP_ADDRESS_EDITOR_TYPES.k_IPv6_ADDRESS) {
k_data.ip = k_formData.ip6;
}
if (k_editorTypes & k_IP_ADDRESS_EDITOR_TYPES.k_IPv6_PREFIX) {
k_data.prefixLength = parseInt(k_formData.ip6Prefix, 10);
}
k_result = k_dialog.k_callbackSaveData.call(k_dialog.k_parentWidget,
{
k_data: k_data,
k_isEditMode: k_dialog.k_isEditMode
});
if (false !== k_result) {
k_dialog.k_hide();
}
else {
k_dialog.k_hideMask();
}
}
}; k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialogCfg.k_hasHelpIcon = false;
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_isEditMode: k_isEditMode,
k_editorTypes: undefined,
k_parentWidget: undefined,
k_callbackSaveData: undefined
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_IP_ADDRESS_EDITOR_TYPES = kerio.waw.shared.k_CONSTANTS.k_IP_ADDRESS_EDITOR_TYPES,
k_editorTypes = k_params.k_editorTypes,
k_data = k_params.k_data,
k_formData = {};
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); this.k_editorTypes = k_editorTypes;
this.k_parentWidget = k_params.k_relatedWidget;
this.k_callbackSaveData = k_params.k_callback;
if (0 === k_editorTypes) {
kerio.lib.k_reportError('Internal error: unsupported editor type.', 'addHostEditor', 'k_applyParams');
return;
}
this.k_form.k_setVisible(['ip'],         0 < (k_editorTypes & k_IP_ADDRESS_EDITOR_TYPES.k_IPv4_ADDRESS));
this.k_form.k_setVisible(['subnetMask'], 0 < (k_editorTypes & k_IP_ADDRESS_EDITOR_TYPES.k_IPv4_MASK));
this.k_form.k_setVisible(['ip6'],        0 < (k_editorTypes & k_IP_ADDRESS_EDITOR_TYPES.k_IPv6_ADDRESS));
this.k_form.k_setVisible(['ip6Prefix'],  0 < (k_editorTypes & k_IP_ADDRESS_EDITOR_TYPES.k_IPv6_PREFIX));
this.k_setSize({k_width: (k_editorTypes & k_IP_ADDRESS_EDITOR_TYPES.k_IPv6_ADDRESS ? 400 : 265)});
this.k_extWidget.center(); if (!this.k_isEditMode) {
return;
}
if (k_editorTypes & k_IP_ADDRESS_EDITOR_TYPES.k_IPv4_ADDRESS) {
k_formData.ip = k_data.ip;
}
if (k_editorTypes & k_IP_ADDRESS_EDITOR_TYPES.k_IPv4_MASK) {
k_formData.subnetMask = k_data.subnetMask;
}
if (k_editorTypes & k_IP_ADDRESS_EDITOR_TYPES.k_IPv6_ADDRESS) {
k_formData.ip6 = k_data.ip;
}
if (k_editorTypes & k_IP_ADDRESS_EDITOR_TYPES.k_IPv6_PREFIX) {
k_formData.ip6Prefix = k_data.prefixLength;
}
this.k_form.k_setData(k_formData);
}; 
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
} }; 