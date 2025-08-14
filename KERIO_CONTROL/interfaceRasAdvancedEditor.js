
kerio.waw.ui.interfaceRasAdvancedEditor = {

k_init: function(k_objectName) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_isBox = kerio.waw.shared.k_methods.k_isBoxEdition(),
k_localNamespace = k_objectName + '_',
k_isPptp  = ('interfaceRasAdvancedPptp'  === k_objectName),
k_isL2tp  = ('interfaceRasAdvancedL2tp'  === k_objectName),
k_isEth   = ('interfaceRasAdvancedEth'   === k_objectName),
k_form, k_formCfg,
k_dialog, k_dialogCfg;
k_isPptp = k_isPptp || k_isL2tp;
k_formCfg =  {
k_restrictBy: {
k_isPptp: k_isPptp,
k_isEth: k_isEth,
k_isBox: k_isBox
},
k_isReadOnly: k_isAuditor,
k_useStructuredData: true,
k_items: [
{
k_restrictions: {
k_isPptp: [ true ]
},
k_type: 'k_fieldset',
k_caption: k_tr('Authentication', 'interfaceRasAdvancedEditor'),
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_display',
k_value: k_tr('Allow the following authentication methods:', 'interfaceRasAdvancedEditor')
},
{
k_id: 'ras.papEnabled',
k_type: 'k_checkbox',
k_option: 'PAP'
},
{
k_id: 'ras.chapEnabled',
k_type: 'k_checkbox',
k_option: 'CHAP'
},
{
k_id: 'ras.mschapEnabled',
k_type: 'k_checkbox',
k_option: 'MSCHAP'
},
{
k_id: 'ras.mschapv2Enabled',
k_type: 'k_checkbox',
k_option: 'MSCHAPv2'
}
]
},
{
k_restrictions: {
k_isPptp: [ true ]
},
k_type: 'k_fieldset',
k_caption: k_tr('Security', 'interfaceRasAdvancedEditor'),
k_isLabelHidden: true,
k_items: [
{
k_id: 'k_mppeEnabled',
k_type: 'k_checkbox',
k_option: k_tr('Use point-to-point encryption (MPPE)', 'interfaceRasAdvancedEditor'),
k_onChange: kerio.waw.shared.k_methods.k_enableCheckboxObserver(['k_mppe128Bit', 'ras.mppeStateful'])
},
{
k_id: 'k_mppe128Bit',
k_type: 'k_checkbox',
k_indent: 1,
k_isDisabled: true,
k_option: k_tr('Require 128-bit encryption', 'interfaceRasAdvancedEditor')
},
{
k_id: 'ras.mppeStateful',
k_type: 'k_checkbox',
k_indent: 1,
k_isDisabled: true,
k_option: k_tr('Allow stateful encryption', 'interfaceRasAdvancedEditor')
}
]
},
{
k_type: 'k_container',
k_id: 'k_macAddress_container',
k_isLabelHidden: true,
k_height: 50,
k_restrictions: {
k_isLinux: [ true ],
k_isEth: [ true ]
},
k_items: [
{
k_type: 'k_checkbox',
k_id: 'macOverride.enabled',
k_option: k_tr('Override MAC address', 'interfaceRasAdvancedEditor'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled(['macOverride.value'], !k_isChecked);
}
},
{
k_id: 'macOverride.value',
k_isDisabled: true,
k_indent: 1,
k_maxLength: kerio.waw.shared.k_CONSTANTS.k_MAX_LENGTH.k_MAC_ADDRESS,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isMacAddress'
}
}
]
},
kerio.waw.shared.k_DEFINITIONS.k_get('k_mtuInput'),
{
k_type: 'k_display',
k_id: 'k_mtuNote',
k_indent: 1,
k_value: k_tr('Note: The changed MTU will be applied after the next dial.', 'interfaceRasAdvancedEditor'),
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon'
},
{
k_restrictions: {
k_isEth: [ true ],
k_isBox: [ true ]
},
k_id: 'stp',
k_type: 'k_checkbox',
k_option: k_tr('Enable the Spanning Tree protocol', 'interfaceRasAdvancedEditor'),
k_isLabelHidden: true,
k_isChecked: true
},
{
k_type: 'k_container',
k_items: [
{
k_type: 'k_display',
k_template: k_tr('Interface GRO (Generic Receive Offload) mode:', 'interfaceEditor')
},
{
k_type: 'k_container',
k_style: 'padding-left: 10px',
k_restrictions: {
k_isLinux: [ true ],
k_isEth: [ true ]
},
k_items: [
{
k_type: 'k_radio',
k_groupId: 'groMode',
k_value: kerio.waw.shared.k_CONSTANTS.GroModeType.Auto,
k_isChecked: true,
k_isLabelHidden: true,
k_option: k_tr('Auto', 'interfaceEditor')
},
{
k_type: 'k_radio',
k_groupId: 'groMode',
k_value: kerio.waw.shared.k_CONSTANTS.GroModeType.On,
k_isLabelHidden: true,
k_option: k_tr('On', 'interfaceEditor')
},
{
k_type: 'k_radio',
k_groupId: 'groMode',
k_value: kerio.waw.shared.k_CONSTANTS.GroModeType.Off,
k_isLabelHidden: true,
k_option: k_tr('Off', 'interfaceEditor')
}
]
}
]
},
]};k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_isAuditor: k_isAuditor,
k_title: k_tr('Advanced Interface Properties', 'interfaceRasAdvancedEditor'),
k_content: k_form,
k_height: k_isPptp ? 505 : (k_isEth && k_isBox ? 350 : 320),
k_width: 330,
k_defaultItem: 'mtuOverride.value',

k_onOkClick: function(k_toolbar) {
var
MppeType = kerio.waw.shared.k_CONSTANTS.MppeType,
k_dialog = k_toolbar.k_dialog,
k_data = k_dialog.k_form.k_getData();
if (k_dialog.k_isPptp) {
if (k_data.k_mppeEnabled) {
k_data.ras.mppe = k_data.k_mppe128Bit ? MppeType.Mppe128Enabled : MppeType.MppeEnabled;
}
else {
k_data.ras.mppe = MppeType.MppeDisabled;
}
}
if (k_data.macOverride && k_data.macOverride.enabled && k_data.macOverride.value) {
k_data.macOverride.value = kerio.waw.shared.k_methods.k_removeMacAddressDelimiters(k_data.macOverride.value);
}
if (false !== k_dialog.k_callback(k_data)) {
k_dialog.k_hide();
}
else {
k_dialog.k_hideMask();
}
}
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_form: k_form,
k_callback: undefined,
k_parentWidget: undefined,
k_isPptp: k_isPptp,
k_isEth: k_isEth,
k_isBox: k_isBox
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_applyParams: function(k_params) {
var
MppeType = kerio.waw.shared.k_CONSTANTS.MppeType,
k_data = k_params.k_data,
k_mppeEnabled = false,
k_mppe128Bit = false;
this.k_callback = k_params.k_callback;
this.k_parentWidget = k_params.k_parentWidget;
if (this.k_isPptp) {
if (k_data.ras) { switch (k_data.ras.mppe) {
case MppeType.MppeEnabled:
k_mppeEnabled = true;
break;
case MppeType.Mppe128Enabled:
k_mppeEnabled = true;
k_mppe128Bit = true;
break;
}
}
k_data.k_mppeEnabled = k_mppeEnabled;
k_data.k_mppe128Bit = k_mppe128Bit;
}
this.k_form.k_setVisible('stp', k_data.flags.virtualSwitch);
this.k_form.k_setVisible('k_mtuNote', !this.k_isEth || k_params.k_isPppoeEncap);
this.k_form.k_setVisible('k_macAddress_container', this.k_isEth);
if (this.k_isEth) {
if (undefined === k_data.macOverride || (false === k_data.macOverride.enabled && '' === k_data.macOverride.value)) {
k_data.macOverride = k_data.macOverride || {};
k_data.macOverride.value = k_data.mac;
}
k_data.macOverride.value = kerio.waw.shared.k_methods.k_formatMacAddress(k_data.macOverride.value);
}
this.k_form.k_reset();
this.k_form.k_setData(k_data, true);
} });
} }; 