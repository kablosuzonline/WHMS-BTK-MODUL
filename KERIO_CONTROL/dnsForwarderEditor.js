
kerio.waw.ui.dnsForwarderEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_shared = kerio.waw.shared,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_dialog, k_dialogCfg,
k_form, k_formCfg;
k_formCfg = {
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('DNS query type', 'dnsForwarderEditor'),
k_items: [
{
k_type: 'k_radio',
k_isLabelHidden: true,
k_groupId: 'k_isNetwork',
k_value: false,
k_option: k_tr('Match DNS query name', 'dnsForwarderEditor'),
k_isChecked: true,

k_onChange: function(k_form, k_radio, k_isNetwork) {
k_form.k_setVisible('k_dnsNameContainer', !k_isNetwork);
k_form.k_setVisible('k_dnsNetworkContainer', k_isNetwork);
k_form.k_focus(k_isNetwork ? 'k_network' : 'k_dnsName');
} },
{
k_type: 'k_radio',
k_isLabelHidden: true,
k_groupId: 'k_isNetwork',
k_value: true,
k_option: k_tr('Match IP address from reverse DNS query', 'dnsForwarderEditor')
},
{
k_type: 'k_container',
k_indent: 1,
k_id: 'k_dnsNameContainer',
k_items: [
{
k_id: 'k_dnsName',
k_caption: k_tr('DNS name:', 'dnsForwarderEditor'),
k_maxLength: k_shared.k_CONSTANTS.k_MAX_LENGTH.k_DOMAIN_NAME,
k_validator: {
k_functionName: 'k_hasNoSpaces',
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_caption: ' ', k_value: k_tr('Wildcard characters (%1) are allowed.', 'dnsForwarderEditor', { k_args: ['*, ?'], k_isSecure: true})
}
]
},
{
k_type: 'k_container',
k_indent: 1,
k_id: 'k_dnsNetworkContainer',
k_isHidden: true,
k_items: [
{
k_id: 'k_network',
k_caption: k_tr('Network:', 'common'),
k_maxLength: 15,
k_validator: {
k_functionName: 'k_isIpAddress',
k_allowBlank: false,
k_inputFilter: k_shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: function(k_form, k_element, k_value) {
kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars.apply(this, arguments);
kerio.waw.shared.k_methods.k_validateNetworkFieldsHandler.apply(this, arguments);
},

k_onBlur: function(k_form, k_element) {
var k_value = k_element.k_getValue();
kerio.waw.shared.k_methods.k_generateMaskForIp(k_value, { k_isNetwork: true, k_form: k_form, k_maskFieldId: 'k_mask' });
}
},
k_shared.k_DEFINITIONS.k_get('k_ipv4MaskField', {
k_id: 'k_mask',
k_onChange: kerio.waw.shared.k_methods.k_validateNetworkFieldsHandler
})
]
}
]
},
{
k_type: 'k_fieldset',
k_className: 'removeFieldsetMargin',
k_caption: k_tr('Forwarding', 'dnsForwarderEditor'),
k_items: [
{
k_type: 'k_radio',
k_isLabelHidden: true,
k_groupId: 'k_isForward',
k_value: false,
k_option: k_tr('Do not forward', 'dnsForwarderEditor'),
k_isChecked: true,

k_onChange: function(k_form, k_radio, k_isForward) {
k_form.k_setDisabled('k_forwardersContainer', !k_isForward);
k_form.k_focus('k_forwarders');
}
},
{
k_type: 'k_radio',
k_isLabelHidden: true,
k_groupId: 'k_isForward',
k_value: true,
k_option: k_tr('Forward the query', 'dnsForwarderEditor')
},
{
k_type: 'k_container',
k_indent: 1,
k_isDisabled: true,
k_id: 'k_forwardersContainer',
k_items: [
{
k_id: 'k_forwarders',
k_caption: k_tr('DNS server(s):', 'dnsForwarderEditor'),
k_maxLength: k_shared.k_CONSTANTS.k_MAX_LENGTH.k_IP_ADDRESS_LIST,
k_validator: {
k_functionName: 'k_isIpAddressList',
k_allowBlank: false,
k_inputFilter: k_shared.k_DEFINITIONS.k_ipv4List.k_allowedChars
},
k_onChange: k_shared.k_methods.k_allowOnlyIpv4Chars
},
{
k_type: 'k_display',
k_caption: ' ', k_value: k_tr('Use semicolons (%1) to separate individual entries.', 'dnsForwarderEditor', { k_args: [' ; '], k_isSecure: true})
}
]
}
] }
] };
k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_height: 380,
k_title: k_tr('Custom DNS Forwarding', 'dnsForwarderEditor'),
k_content: k_form,
k_defaultItem: 'k_dnsName',

k_onOkClick: function(k_toolbar){
k_toolbar.k_dialog.k_saveData();
}
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_form: k_form,
k_saveCallback: null,
k_parentWidget: null,
k_networkMapping: {
k_isOk:    'k_isNetwork',
k_network: 'k_network',
k_mask:    'k_mask'
}
});
k_form.k_addReferences({
k_validateNetworkFields: k_shared.k_methods.k_validateNetworkFields
});
this.k_addControllers(k_dialog); return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_methods = kerio.waw.shared.k_methods,
k_form = this.k_form,
k_network;
if (k_params.k_data) {
this.k_editedRow = k_params.k_rowIndex;
k_network = k_methods.k_parseNetwork(k_params.k_data.domain);
if (k_network.k_isOk) {
k_form.k_setData(k_methods.k_mapProperties(k_network, this.k_networkMapping), true);
}
else {
k_form.k_setData({
k_isNetwork: false,
k_dnsName: k_params.k_data.domain
}, true);
}
k_form.k_setData({
k_isForward: '' !== k_params.k_data.forwarders,
k_forwarders: k_params.k_data.forwarders
}, true);
}
this.k_saveCallback = k_params.k_callback;
this.k_parentWidget = k_params.k_relatedWidget;
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };
k_kerioWidget.k_saveData = function(k_force) {
var
k_lib = kerio.lib,
k_methods = kerio.waw.shared.k_methods,
k_data = this.k_form.k_getData(),
k_dnsValue,
k_forwarders;
k_data.k_mask = kerio.waw.shared.k_methods.k_convertCidrToMask(k_data.k_mask);
if (k_data.k_isNetwork) {
if (!k_methods.k_validateNetwork(k_data.k_network, k_data.k_mask, true)) {
this.k_hideMask();return;
}
k_dnsValue = k_data.k_network + '/' + k_data.k_mask;
}
else {
k_dnsValue = k_methods.k_parseNetwork(k_data.k_dnsName);
if (k_dnsValue.k_isOk) { if (k_dnsValue.k_isMatch) {
if ('no' === k_force) {
this.k_hideMask();
return; }
if ('yes' !== k_force) {
k_lib.k_confirm({
k_title: k_lib.k_tr('Valid Network', 'common'),
k_msg: k_lib.k_tr('The defined value is valid for Network address %1 with mask %2.', 'dnsForwarderEditor',
{ k_args: [k_dnsValue.k_network, k_dnsValue.k_mask] })
+ '<br><br><b>'
+ k_lib.k_tr('Do you want to continue and process the value as a reverse DNS query?', 'dnsForwarderEditor')
+ '</b>'
, k_defaultButton: 'yes',
k_callback: this.k_saveData,
k_scope: this
}); return;
}
}
else { k_lib.k_alert(
k_lib.k_tr('Invalid Network', 'common'),
k_lib.k_tr('The defined value is valid for Network address %1 with mask %2.', 'dnsForwarderEditor',
{ k_args: [k_dnsValue.k_network, k_dnsValue.k_mask] })
+ '<br><br><b>'
+ k_lib.k_tr('Network address %1 does not match mask %2.', 'dnsForwarderEditor',
{ k_args: [k_dnsValue.k_network, k_dnsValue.k_mask] })
+ '</b>'
);
this.k_hideMask();return;
}
k_dnsValue = k_dnsValue.k_network + '/' + k_dnsValue.k_mask; }
else {
k_dnsValue = k_data.k_dnsName;
}
}
if (k_data.k_isForward) {
k_forwarders = k_data.k_forwarders;
}
else {
k_forwarders = '';
}
k_data = {
domain: k_dnsValue,
forwarders: k_forwarders
};
if (this.k_saveCallback(k_data, this.k_editedRow)) {
this.k_hide();
}
else {
this.k_hideMask();
}
};k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
}; } }; 