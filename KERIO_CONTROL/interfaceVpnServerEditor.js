
kerio.waw.ui.interfaceVpnServerEditor = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_WAW_METHODS = k_shared.k_methods,
k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_isAuditor = k_WAW_METHODS.k_isAuditor(),
k_showAllInTabs = k_lib.k_isIPadCompatible,
k_buildTooltip = k_lib.k_buildTooltip,
k_labelWidth = 150,
k_trafficPolicyInfo = k_tr('The traffic policy must allow such traffic.', 'interfaceEditor'),
k_formKerioVpnCfg, k_formKerioVpn,
k_formIpSecCfg, k_formIpSec,
k_formDnsCfg, k_formDns,
k_formWinsCfg, k_formWins,
k_tabPageCfg, k_tabPage,
k_formManager,
k_dialogCfg, k_dialog,
k_formTop, k_formTopCfg, k_formTopHeight,
k_layout;
k_formTopHeight = 180;
k_formTopCfg = {
k_useStructuredData: true,
k_height: k_formTopHeight,
k_labelWidth: k_labelWidth,
k_items: [
{
k_type: k_showAllInTabs ? 'k_container' : 'k_fieldset',
k_caption: k_showAllInTabs ? undefined : k_tr('General', 'interfaceEditor'),
k_items: [
{
k_id: 'server.ipsecVpnEnabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Enable IPsec VPN Server', 'interfaceEditor')
},
{
k_id: 'server.kerioVpnEnabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Enable Kerio VPN Server', 'interfaceEditor')
},
{
k_type: 'k_display',
k_value: k_tr('Assign IP addresses to VPN clients using the following network:', 'interfaceEditor')
},
{
k_id: 'server.network',
k_caption: k_tr('VPN Network:', 'interfaceEditor'),
k_width: 120,
k_maxLength: 15,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: k_DEFINITIONS.k_ipv4.k_allowedChars
},

k_onChange: function(k_form) {
var
k_WAW_METHODS = kerio.waw.shared.k_methods;
k_WAW_METHODS.k_allowOnlyIpv4Chars.apply(this, arguments);
k_WAW_METHODS.k_validateNetworkFields(k_form, 'server.network', 'server.mask');
},

k_onBlur: function(k_form, k_element) {
var
k_value = k_element.k_getValue();
kerio.waw.shared.k_methods.k_generateMaskForIp(k_value, { k_isNetwork: true, k_form: k_form, k_maskFieldId: 'k_mask' });
}
},
k_DEFINITIONS.k_get('k_ipv4MaskField', {
k_id: 'server.mask',
k_width: 120,

k_onChange: function(k_form, k_element, k_value) {
var
k_WAW_METHODS = kerio.waw.shared.k_methods;
k_WAW_METHODS.k_allowOnlyIpv4Chars.apply(this, arguments);
k_WAW_METHODS.k_validateNetworkFields(k_form, 'server.network', 'server.mask');
}
})
]
}
]
}; k_ikeVersions = [
{k_value: 'ike',    k_caption: 'IKEv1/IKEv2' },
{k_value: 'ikev1',  k_caption: 'IKEv1' },
{k_value: 'ikev2',  k_caption: 'IKEv2' }
];
k_formIpSecCfg = {
k_useStructuredData: true,
k_labelWidth: k_labelWidth,
k_items: [
k_WAW_METHODS.k_getSslCertificateFields('k_ipsecServer', 'k_ipsec', {k_labelWidth: k_labelWidth}),
{
k_type: 'k_container',
k_style: 'padding-top: 20px;',
k_items: [
{
k_type: 'k_select',
k_width: 200,
k_id: 'server.ikeVersion',
k_isDisabled: false,
k_labelWidth: 100,
k_caption: k_tr('IKE version:', 'interfaceEditor'),
k_isLabelHidden: false,
k_localData: k_ikeVersions,
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_onChange: undefined
},
{
k_type: 'k_row',
k_items: [
{
k_id: 'server.eapPskIdentity',
k_isLabelHidden: false,
k_caption: k_tr('IKEv2 preshared key identity:', 'interfaceEditor')
}
]
},
{
k_id: 'server.useCertificate',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Use certificate for clients', 'interfaceEditor')
},
{
k_type: 'k_row',
k_items: [
{
k_id: 'server.psk.enabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Use preshared key:', 'interfaceEditor'),
k_width: 150,
k_onChange: k_WAW_METHODS.k_enableCheckboxObserver(['server.psk.value', 'server.eapPskIdentity'])
},
k_DEFINITIONS.k_get('k_passwordField', {k_id: 'server.psk.value', k_isLabelHidden: true, k_width: undefined}) ]
},
{
k_type: 'k_row',
k_items: [
{
k_id: 'server.mschapv2Enabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Enable MS-CHAP v2 authentication', 'interfaceEditor')
}
]
}
]
}
]
}; k_formKerioVpnCfg = {
k_useStructuredData: true,
k_labelWidth: 110,
k_items: [
k_WAW_METHODS.k_getSslCertificateFields('k_kerioVpnServer', 'k_kvpn', {k_labelWidth: 110, k_inputsWidth: '100%'}),
{
k_id: 'server.port',
k_type: 'k_number',
k_caption: k_tr('Listen on port:', 'interfaceEditor'),
k_width: 80,
k_maxLength: 5,
k_minValue: 1,
k_maxValue: 65535,
k_style: 'margin-bottom: 20px',
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isPortNumber'
}
},
{
k_id: 'server.defaultRoute',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_isChecked: true,
k_option: '<span ' + k_buildTooltip(k_trafficPolicyInfo) + '>' + k_tr('VPN clients access the Internet through the VPN', 'interfaceEditor')
+ '<span class="tooltip" ' + k_buildTooltip(k_trafficPolicyInfo) + '>&nbsp; &nbsp; &nbsp;</span></span>'
},
{
k_type: 'k_row',
k_items: [
'->',
{
k_id: 'k_customRoutes',
k_type: 'k_formButton',
k_caption: k_tr('Custom Routes…', 'interfaceEditor'),
k_onClick: function() {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'routerDialog',
k_objectName: 'routerDialog',
k_params: {
k_dataStore: this.k_getMainWidget().k_dataStore
}
});
}
}
]
}
]
}; k_formDnsCfg = {
k_useStructuredData: true,
k_items: [
{ k_type: 'k_container',
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_radio',
k_groupId: 'server.localDns',
k_option: k_tr('Use Kerio Control as DNS server', 'interfaceEditor'),
k_value: true,
k_isChecked: true,

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled(['k_containerDnsServers'], k_isChecked);
}
},
{
k_type: 'k_radio',
k_groupId: 'server.localDns',
k_option: k_tr('Use specific DNS servers', 'interfaceEditor'),
k_value: false
}
]
},
{ k_type: 'k_container',
k_id: 'k_containerDnsServers',
k_isDisabled: true,
k_labelWidth: 135,
k_indent: 1,
k_items: [
{
k_id: 'server.primaryDns',
k_caption: k_tr('Primary DNS:', 'interfaceEditor'),
k_maxLength: 15,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: k_WAW_METHODS.k_allowOnlyIpv4Chars
},
{
k_id: 'server.secondaryDns',
k_caption: k_tr('Secondary DNS:', 'interfaceEditor'),
k_maxLength: 15,
k_validator: {
k_allowBlank: true, k_functionName: 'k_isIpAddress',
k_inputFilter: k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: k_WAW_METHODS.k_allowOnlyIpv4Chars
}
]
},
{ k_type: 'k_container',
k_isLabelHidden: true,
k_className: 'marginTop',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'server.autodetectDomainSuffix',
k_option: k_tr('Automatically select the domain suffix', 'interfaceEditor'),
k_value: true,
k_isChecked: true,

k_onChange: function(k_form, k_checkbox, k_isChecked){
k_form.k_setDisabled(['server.domainSuffix'], k_isChecked);
}
},
{
k_type: 'k_radio',
k_groupId: 'server.autodetectDomainSuffix',
k_option: k_tr('Use specific domain suffix', 'interfaceEditor'),
k_value: false
}
]
},
{
k_id: 'server.domainSuffix',
k_caption: k_tr('Domain suffix:', 'interfaceEditor'),
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_DOMAIN_NAME,
k_checkByteLength: true,
k_indent: 1,
k_isDisabled: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_hasNoSpaces'
}
}
]
}; k_formWinsCfg = {
k_useStructuredData: true,
k_items: [
{ k_type: 'k_container',
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_radio',
k_groupId: 'server.localWins',
k_option: k_tr('Detect WINS server automatically', 'interfaceEditor'),
k_value: true,
k_isChecked: true,

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled(['k_containerWinsServers'], k_isChecked);
}
},
{
k_type: 'k_radio',
k_groupId: 'server.localWins',
k_option: k_tr('Use specific WINS servers', 'interfaceEditor'),
k_value: false
}
]
},
{ k_type: 'k_container',
k_id: 'k_containerWinsServers',
k_isDisabled: true,
k_labelWidth: 145,
k_indent: 1,
k_items: [
{
k_id: 'server.primaryWins',
k_caption: k_tr('Primary WINS:', 'interfaceEditor'),
k_maxLength: 15,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: k_WAW_METHODS.k_allowOnlyIpv4Chars
},
{
k_id: 'server.secondaryWins',
k_caption: k_tr('Secondary WINS:', 'interfaceEditor'),
k_maxLength: 15,
k_validator: {
k_allowBlank: true, k_functionName: 'k_isIpAddress',
k_inputFilter: k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: k_WAW_METHODS.k_allowOnlyIpv4Chars
}
]
}
]
}; k_formTop       = new k_lib.K_Form(k_localNamespace + 'k_generalForm',  k_formTopCfg);
k_formIpSec     = new k_lib.K_Form(k_localNamespace + 'k_ipsecForm',    k_formIpSecCfg);
k_formKerioVpn  = new k_lib.K_Form(k_localNamespace + 'k_formGeneral',  k_formKerioVpnCfg);
k_formDns       = new k_lib.K_Form(k_localNamespace + 'k_formDns',      k_formDnsCfg);
k_formWins      = new k_lib.K_Form(k_localNamespace + 'k_formWins',     k_formWinsCfg);
k_formIpSec.k_patchAutoFill();
k_tabPageCfg = {
k_className: 'interfaceEditorTabs',
k_items: [
{
k_caption: k_tr('IPsec VPN', 'common'),
k_content: k_formIpSec,
k_id: 'k_pageIpsec'
},
{
k_caption: k_tr('Kerio VPN', 'common'),
k_content: k_formKerioVpn,
k_id: 'k_pageGeneral'
},
{
k_caption: k_tr('DNS', 'common'),
k_content: k_formDns,
k_id: 'k_pageDns'
},
{
k_caption: k_tr('WINS', 'common'),
k_content: k_formWins,
k_id: 'k_pageWins'
}
]
};
if (k_showAllInTabs) {
k_tabPageCfg.k_items.unshift({
k_id: 'k_pageGeneral',
k_content: k_formTop,
k_caption: k_tr('General', 'interfaceVpnTunnelEditor')
});
}
k_tabPage = new k_lib.K_TabPage(k_localNamespace + 'k_tabPage', k_tabPageCfg);
k_formManager = new kerio.lib.K_FormManager(k_localNamespace + 'k_formManager',
[k_formTop, k_formIpSec, k_formKerioVpn, k_formDns, k_formWins]);
if (!k_showAllInTabs) {
k_layout = new kerio.lib.K_Layout(k_localNamespace + 'k_layout', {
k_verLayout: {
k_items: [
{
k_content: k_formTop,
k_iniSize: k_formTopHeight
},
{
k_content: k_tabPage
}
]
}
});
}
k_dialogCfg = {
k_height: k_showAllInTabs? 380 : 590,
k_content: k_showAllInTabs ? k_tabPage : k_layout,
k_title: k_tr('VPN Server Properties', 'interfaceEditor'),
k_defaultItem: null,

k_onOkClick: function(k_toolbar) {
var
k_tr = kerio.lib.k_tr,
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_dialog = k_toolbar.k_dialog,
k_pskValue = k_dialog.k_pskValue.k_getValue();
if (k_dialog.k_usePsk.k_getValue() && !k_dialog.k_dataStore.server.psk.enabled && '' === k_pskValue) {
k_WAW_METHODS.k_alertError(k_tr('The preshared key must be set to be used.', 'interfaceVpnTunnelEditor'));
k_WAW_METHODS.k_unmaskMainScreen(k_dialog);
return;
}
if (!k_WAW_METHODS.k_validators.k_isAsciiString(k_pskValue)) {
k_WAW_METHODS.k_alertError(k_tr('For technical reasons, a preshared key may contain ASCII characters only.', 'interfaceVpnTunnelEditor'));
k_WAW_METHODS.k_unmaskMainScreen(k_dialog);
return;
}
this.k_dialog.k_sendData();
},

k_onCancelClick: function() {
this.k_dialog.k_hide();
}
};
k_dialogCfg = k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
if (k_isAuditor) {
k_formManager.k_setReadOnlyAll();
}
k_formIpSec.k_addReferences(
{
k_idPrefix: 'k_ipsec'
}
);
k_formKerioVpn.k_addReferences(
{
k_dialog: k_dialog,
k_CERTIFICATE_TYPE: k_WAW_CONSTANTS.k_CERTIFICATE_TYPE.k_VPN_SERVER,
k_idPrefix: 'k_kvpn'
}
);
k_dialog.k_addReferences(
{
k_objectName: k_objectName,
k_isAuditor: k_isAuditor,
k_showAllInTabs: k_showAllInTabs,
k_tabPage: k_tabPage,
k_formManager: k_formManager,
k_formGeneral: k_formKerioVpn,
k_topForm: k_formTop,
k_formIpSec: k_formIpSec,
k_useCertificateForClientsElement: k_formIpSec.k_getItem('server.useCertificate'),
k_usePsk: k_formIpSec.k_getItem('server.psk.enabled'),
k_pskValue: k_formIpSec.k_getItem('server.psk.value'),
k_formKerioVpn: k_formKerioVpn,
k_dataStore: {},
k_relatedGrid: {},
k_ipsecEnabled: k_formTop.k_getItem('server.ipsecVpnEnabled'),
k_kerioVpnEnabled: k_formTop.k_getItem('server.kerioVpnEnabled'),
k_ipSecCertificateElementId: k_formIpSec.k_idPrefix + '_' + 'k_certificate',
k_kerioVpnCertificateElementId: k_formKerioVpn.k_idPrefix + '_' + 'k_certificate',
k_kerioVpnFingerprintElementId: k_formKerioVpn.k_idPrefix + '_' + 'k_fingerptint'
}
);
k_formTop.k_addReferences({
k_validateNetworkFields: k_WAW_METHODS.k_validateNetworkFields
});
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_INTERFACE_SET_INDEX: 0,
k_COLLISION_CHECK_INDEX: 1,
k_sendDataRequests: {
k_requests: [
{
method: 'Interfaces.set',
params: {}
},
{
method: 'Interfaces.checkIpCollision'
}
],
k_callback: k_dialog.k_sendDataCallback,
k_scope: k_dialog
}
});
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_data = k_params.k_data;
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_dataStore = k_data;this.k_formManager.k_setData(k_data, true);
k_WAW_METHODS.k_setSslCertificateFieldsetData(
{
k_form: this.k_formIpSec,
k_idPrefix: this.k_formIpSec.k_idPrefix,
k_handleApplyReset: false,
k_listLoaderId: 'k_certificatesVpnServer',
k_noneOptionForInvalidCertificate: true
},
k_data.server.ipsecVpnCertificate,
true
);
k_WAW_METHODS.k_setSslCertificateFieldsetData(
{
k_form: this.k_formKerioVpn,
k_idPrefix: this.k_formKerioVpn.k_idPrefix,
k_handleApplyReset: false,
k_listLoaderId: 'k_certificatesVpnServer',
k_noneOptionForInvalidCertificate: true
},
k_data.server.kerioVpnCertificate,
true
);
this.k_useCertificateForClientsElement.k_setDisabled(0 === kerio.waw.shared.k_data.k_get('k_certificates').k_getData().length);
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_dialogs: ['routerDialog']
});
};

k_kerioWidget.k_sendData = function() {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_data = this.k_formManager.k_getData(true),
k_dataStore = this.k_dataStore,
k_sendDataRequests = this.k_sendDataRequests,
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_unmaskMainScreen = k_WAW_METHODS.k_unmaskMainScreen,
k_ipsecVpnCertificateId = k_data[this.k_ipSecCertificateElementId],
k_kerioVpnCertificateId = k_data[this.k_kerioVpnCertificateElementId],
k_warningMsg = '',
k_tabId;
if (!this.k_topForm.k_validateNetworkFields(this.k_topForm, 'server.network', 'server.mask')) {
k_unmaskMainScreen(this);
return;
}
if (k_data.server.ipsecVpnEnabled && '' === k_ipsecVpnCertificateId) {
k_warningMsg = k_tr('No certificate is selected in IPsec VPN Server','interfaceVpnServerEditor');
k_tabId = 'k_pageIpsec';
}
else {
if (k_data.server.kerioVpnEnabled && '' === k_kerioVpnCertificateId) {
k_warningMsg = k_tr('No certificate is selected in Kerio VPN Server','interfaceVpnServerEditor');
k_tabId = 'k_pageGeneral';
}
}
if (k_warningMsg) {
kerio.lib.k_alert({
k_title: k_tr('Warning', 'common'),
k_msg: k_warningMsg,
k_icon: 'warning'
});
this.k_tabPage.k_setActiveTab(k_tabId);
k_unmaskMainScreen(this);
return;
}
k_data.server.ipsecVpnCertificate = {
id: k_ipsecVpnCertificateId
};
k_data.server.kerioVpnCertificate = {
id: k_kerioVpnCertificateId
};
if (k_data.server.psk.enabled && k_dataStore.server.psk.enabled && '' === k_data.server.psk.value) {
delete k_dataStore.server.psk.value;
delete k_data.server.psk.value;
}
delete k_dataStore.ip6prefixLength;
delete k_dataStore.vpn;
delete k_data[this.k_ipSecCertificateElementId];
delete k_data[this.k_kerioVpnCertificateElementId];
delete k_data[this.k_kerioVpnFingerprintElementId];
k_dataStore.vlanId = k_dataStore.vlanId || 0;
k_WAW_METHODS.k_mergeObjects(k_data, k_dataStore);
k_sendDataRequests.k_requests[this.k_INTERFACE_SET_INDEX].params = {
ids: [k_dataStore.id],
details: k_dataStore
};
k_WAW_METHODS.k_sendBatch(k_sendDataRequests);
};

k_kerioWidget.k_sendDataCallback = function(k_response, k_success) {
var
k_grid = this.k_relatedGrid,
k_statusbar = k_grid.k_statusbar,
k_batchResult,
k_result;
kerio.waw.shared.k_methods.k_unmaskMainScreen();
if (!k_success || !k_response.k_decoded.batchResult) {
return;
}
k_batchResult = k_response.k_decoded.batchResult;
if (false === this.k_ipsecEnabled.k_getValue() && false === this.k_kerioVpnEnabled.k_getValue()) {
k_statusbar.k_setVisible(false);
k_grid.k_vpnServerSaved = true;
}
else {
k_result = k_batchResult[this.k_INTERFACE_SET_INDEX];
k_grid.k_setWarning(this.k_dataStore.id,
(k_result && k_result.warnings)
? k_result.warnings[0]
: false );
k_result = k_batchResult[this.k_COLLISION_CHECK_INDEX];
k_grid.k_showCollisionWarning(k_result, k_success);
}
k_grid.k_reloadData();
kerio.adm.k_framework.k_enableApplyReset();
this.k_hide();
};

k_kerioWidget.k_resetOnClose = function() {
this.k_formManager.k_reset();
this.k_pskValue.k_setAllowBlank(true);
this.k_tabPage.k_setActiveTab(this.k_showAllInTabs ? 'k_pageGeneral' : 'k_pageIpsec');
};
} }; 