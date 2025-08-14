
kerio.waw.ui.interfaceWifiSsidEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_isSsidInPlaceView = 'ssidInPlaceView' === k_objectName,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_DEFINITIONS = k_shared.k_DEFINITIONS,
k_methods = k_shared.k_methods,
k_isReadOnly = k_methods.k_isAuditor() || k_isSsidInPlaceView,
PortAssignmentType = k_CONSTANTS.PortAssignmentType,
k_PORT_ASSIGNMENT_TYPE_NAMES = k_DEFINITIONS.k_PORT_ASSIGNMENT_TYPE_NAMES,
WifiEncryptionType = k_CONSTANTS.WifiEncryptionType,
k_WIFI_ENCRYPTION_NAMES = k_DEFINITIONS.k_WIFI_ENCRYPTION_NAMES,
InterfaceGroupType = k_CONSTANTS.InterfaceGroupType,
k_formCfg,
k_form,
k_dialogCfg,
k_dialog;
k_formCfg = {
k_useStructuredData: true,
k_isReadOnly: k_isReadOnly,
k_items: [
{
k_id: 'ssid',
k_caption: k_tr('SSID name:', 'wifi'),
k_maxLength: 32,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false
}
},
{
k_id: 'assignment',
k_type: 'k_select',
k_caption: k_tr('Assigned to:', 'wifi'),
k_value: PortAssignmentType.PortAssignmentStandalone,
k_localData: [
{value: PortAssignmentType.PortAssignmentStandalone, name: k_PORT_ASSIGNMENT_TYPE_NAMES[PortAssignmentType.PortAssignmentStandalone]},
{value: PortAssignmentType.PortAssignmentSwitch,     name: k_PORT_ASSIGNMENT_TYPE_NAMES[PortAssignmentType.PortAssignmentSwitch]}
],
k_onChange: function(k_form, k_element, k_value) {
var
PortAssignmentType = kerio.waw.shared.k_CONSTANTS.PortAssignmentType,
k_isStandAlone = k_value === PortAssignmentType.PortAssignmentStandalone;
k_form.k_setVisible('group', k_isStandAlone);
}
},
k_DEFINITIONS.k_interfaceGroupSelector({k_value: InterfaceGroupType.Trusted}),
{
k_type: 'k_select',
k_id: 'encryption',
k_caption: k_tr('Security:', 'interfaceEditor'),
k_value: WifiEncryptionType['WifiEncryptionWpa2Ent'],
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_localData: [
{
k_caption: k_WIFI_ENCRYPTION_NAMES[WifiEncryptionType['WifiEncryptionDisabled']],
k_value: WifiEncryptionType['WifiEncryptionDisabled']
},
{
k_caption: k_WIFI_ENCRYPTION_NAMES[WifiEncryptionType['WifiEncryptionWpaPsk']],
k_value: WifiEncryptionType['WifiEncryptionWpaPsk']
},
{
k_caption: k_WIFI_ENCRYPTION_NAMES[WifiEncryptionType['WifiEncryptionWpaEnt']],
k_value: WifiEncryptionType['WifiEncryptionWpaEnt']
},
{
k_caption: k_WIFI_ENCRYPTION_NAMES[WifiEncryptionType['WifiEncryptionWpa2Psk']],
k_value: WifiEncryptionType['WifiEncryptionWpa2Psk']
},
{
k_caption: k_WIFI_ENCRYPTION_NAMES[WifiEncryptionType['WifiEncryptionWpa2Ent']],
k_value: WifiEncryptionType['WifiEncryptionWpa2Ent']
}
],
k_onChange: function(k_form, k_element, k_value) {
var
WifiEncryptionType = kerio.waw.shared.k_CONSTANTS.WifiEncryptionType,
k_isPsk = WifiEncryptionType['WifiEncryptionWpaPsk'] === k_value || WifiEncryptionType['WifiEncryptionWpa2Psk'] === k_value,
k_isEnterprise = WifiEncryptionType['WifiEncryptionWpaEnt'] === k_value || WifiEncryptionType['WifiEncryptionWpa2Ent'] === k_value;
k_form.k_setVisible('wpaPassword', k_isPsk);
k_form.k_setVisible('enterpriseInfo', k_isEnterprise);
}
},
{
k_id: 'wpaPassword',
k_caption: k_tr('Shared secret:', 'wifi'),
k_maxLength: 63,
k_isHidden: true,
k_validator: {
k_allowBlank: false,
k_regExp: /.{8,}/,
k_invalidText: k_tr('Minimum length for the shared secret is 8 characters.', 'wifi')
}
},
{
k_type: 'k_display',
k_id: 'enterpriseInfo',
k_caption: ' ',
k_value: k_tr('Users must use their username and password.', 'wifi')
}
]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_ssidForm', k_formCfg);
k_dialogCfg = {
k_width: 400,
k_height: 240,
k_title: k_tr('WiFi SSID', 'wifi'),
k_content: k_form,
k_defaultItem: 'ssid',
k_onOkClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData.call(k_toolbar.k_dialog);
}
};
k_dialogCfg = k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_isEditMode: false
});
k_form.k_addReferences({
k_dialog: k_dialog
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({
k_applyParams: function(k_params){
var
k_data = k_params.k_data;
if (k_data) {
this.k_editedRow = k_params.k_rowIndex;
}
this.k_data = k_data || {};
this.k_form.k_setData(k_data, true);
this.k_saveCallback = k_params.k_callback;
},
k_sendData: function() {
var
k_form = this.k_form,
k_formData = k_form.k_getData();
kerio.waw.shared.k_methods.k_mergeObjects(k_formData, this.k_data);
if (this.k_saveCallback) {
this.k_saveCallback(k_formData, this.k_editedRow);
}
this.k_hide();
},
k_resetOnClose: function() {
this.k_form.k_reset();
}
});
}
};
