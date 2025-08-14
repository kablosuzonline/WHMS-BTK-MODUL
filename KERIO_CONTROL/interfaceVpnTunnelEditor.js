
kerio.waw.ui.interfaceVpnTunnelEditor = {
k_init: function(k_objectName) {
var
k_shared = kerio.waw.shared,
k_DEFINITIONS = k_shared.k_DEFINITIONS,
k_WAW_METHODS = k_shared.k_methods,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
VpnType = k_WAW_CONSTANTS.VpnType,
k_REMOTE_CERTIFICATE = '',k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = k_WAW_METHODS.k_isAuditor(),
k_showAllInTabs = k_lib.k_isIPadCompatible,
k_IPSEC_IDS_DENY_VALUES = kerio.waw.shared.k_CONSTANTS.k_IPSEC_IDS_DENY_VALUES,
k_isEdit = ('interfaceVpnTunnelEdit' === k_objectName || k_isAuditor ),
k_messageTunnelActive = k_tr('Select this if you can specify the hostname or IP address of the remote endpoint and the remote endpoint can accept incoming connections.', 'interfaceVpnTunnelEditor'),
k_messageTunnelPassive = k_tr('Select this if the remote endpoint uses a dynamic IP address or it is unable to accept incoming connections.', 'interfaceVpnTunnelEditor'),
k_messageLocalId = k_tr('Use this on the remote site when you are asked to fill in the Remote ID. For certificates, the Remote ID Type is Distinguished name.', 'interfaceVpnTunnelEditor'),
k_emptyRemoteIdInvalidText = k_tr('Remote ID value cannot be empty', 'interfaceEditor'),
k_passiveRemoteIdInvalidText = k_tr('Remote ID value cannot be %1 or %2 for a passive tunnel', 'interfaceEditor', {k_args:[k_IPSEC_IDS_DENY_VALUES.k_EMPTY_IP, k_IPSEC_IDS_DENY_VALUES.k_ANY]}),
k_passiveRemoteIdInvalidTextWithNoSpaces = k_tr('Remote ID value cannot be %1 or %2 for a passive tunnel and cannot contain spaces for Preshared key', 'interfaceEditor', {k_args:[k_IPSEC_IDS_DENY_VALUES.k_EMPTY_IP, k_IPSEC_IDS_DENY_VALUES.k_ANY]}),
k_remoteIdInvalidTextWithNoSpaces = k_tr('Remote ID value cannot contain spaces for Preshared key', 'interfaceEditor', {k_args:[k_IPSEC_IDS_DENY_VALUES.k_EMPTY_IP, k_IPSEC_IDS_DENY_VALUES.k_ANY]}),
k_authenticationTabId = 'k_authenticationTab',
k_remoteRoutingTabId = 'k_remoteRoutingTab',
k_localRoutingTabId = 'k_localRoutingTab',
k_tunnelTypeBar = [],
k_onChangeTunnelType,
k_onChangeIpsecAuthentication,
k_authenticationFormCfg, k_authenticationForm,
k_remoteRouteGridCfg, k_remoteRouteGrid,
k_localRouteGridCfg, k_localRouteGrid,
k_remoteRoutingFormCfg, k_remoteRoutingForm,
k_localRoutingFormCfg, k_localRoutingForm,
k_generalFormCfg, k_generalForm,
k_tabPageCfg,k_tabPage,
k_dialogCfg, k_dialog,
k_formManager,
k_layout;

k_onChangeTunnelType = function(k_form, k_element, k_value){
var
k_dialog = k_form.k_dialog,
k_authenticationForm = k_form.k_authenticationForm,
k_remoteRoutingForm = k_form.k_remoteRoutingForm,
k_tabPage = k_dialog.k_tabPage,
k_isIpsec = k_value === k_form.VpnType.VpnIpsec;
k_authenticationForm.k_setVisible(['k_ipsecAuthentication', 'k_kerioVpnAuthentication'], false);
k_authenticationForm.k_setVisible(k_isIpsec ? 'k_ipsecAuthentication' : 'k_kerioVpnAuthentication', true);
k_remoteRoutingForm.k_setVisible('k_kvpn', !k_isIpsec);
k_remoteRoutingForm.k_setVisible('k_ipsecRoutes', k_isIpsec);
k_remoteRoutingForm.k_remoteRouteGridContainer.k_setIndent(k_isIpsec ? 0 : 1);
if (k_form.k_dialog.k_tabPage.k_items['k_tab' + '_' + k_remoteRoutingForm.k_remoteRoutingTabId].isVisible()) {
k_remoteRoutingForm.k_remoteRouteGridContainer.k_setSize({k_height: k_isIpsec ? 200 : 170});
}
if (!k_isIpsec && 0 < k_remoteRoutingForm.k_remoteRouteGrid.k_getData().length) {
k_remoteRoutingForm.k_acceptAutomaticRoutes.k_setChecked(false);
k_remoteRoutingForm.k_useCustomRoutes.k_setChecked(true);
}
if (k_dialog.k_activeTabID === k_dialog.k_localRoutingTabId) {
k_tabPage.k_setActiveTab(k_dialog.k_authenticationTabId);
}
k_tabPage.k_setVisibleTab(k_dialog.k_localRoutingTabId, k_isIpsec);
};
k_tunnelTypeBar.push('->');
if (kerio.lib.k_isMSIE7) {
k_tunnelTypeBar.push({
k_type: 'k_display',
k_isDisabled: true,
k_value: k_tr('Type:', 'interfaceVpnTunnelEditor')
});
k_tunnelTypeBar.push({
k_type: 'k_select',
k_id: 'tunnel.type',
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_id',
k_value: VpnType.VpnIpsec,
k_localData: [
{
k_id:  VpnType.VpnIpsec,
k_caption: k_tr('IPsec', 'interfaceVpnTunnelEditor')
},
{
k_id: VpnType.VpnKerio,
k_caption: k_tr('Kerio VPN', 'interfaceVpnTunnelEditor')
}
],
k_onChange: k_onChangeTunnelType
});
}
else {
k_tunnelTypeBar.push({
k_type: 'k_display',
k_value: k_tr('Type:', 'interfaceVpnTunnelEditor'),
k_style: 'text-align: right;',
k_isLabelHidden: true,
k_width: 50
});
k_tunnelTypeBar.push({
k_type: 'k_buttonBar',
k_id: 'tunnel.type',
k_value: VpnType.VpnIpsec,
k_items: [
{
k_id:  VpnType.VpnIpsec,
k_caption: k_tr('IPsec', 'interfaceVpnTunnelEditor')
},
{
k_id: VpnType.VpnKerio,
k_caption: k_tr('Kerio VPN', 'interfaceVpnTunnelEditor')
}
],
k_onChange: k_onChangeTunnelType
});
}
k_generalFormCfg = {
k_useStructuredData: true,
k_height: 250,
k_labelWidth: 135,
k_items: [
{
k_type: 'k_fieldset',
k_anchor: '100% 100%',
k_caption: k_tr('General', 'interfaceEditor'),
k_items: [
{
k_id: 'name',
k_caption: k_tr('Name:', 'common'),
k_isReadOnly: false,
k_value: '',
k_maxLength: 127,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_checkbox',
k_id: 'enabled',
k_isLabelHidden: true,
k_isChecked: true,
k_option: k_tr('Enable this tunnel', 'interfaceVpnTunnelEditor'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled('tunnel.peer.enabled', !k_isChecked);
k_form.k_setDisabledPeerElements(!k_isChecked || !k_form.k_isPeerEnabled());
}
},
{
k_type: 'k_radio',
k_groupId: 'tunnel.peer.enabled',
k_isLabelHidden: true,
k_indent: 1,
k_option: [
'<span ',
kerio.lib.k_buildTooltip(k_messageTunnelActive),
'>',
k_tr('Active - it connects to the remote endpoint', 'interfaceVpnTunnelEditor'),
'<span class="tooltip" ',
kerio.lib.k_buildTooltip(k_messageTunnelActive),
'>&nbsp; &nbsp; &nbsp;</span></span>'
].join(''),
k_value: true,
k_isChecked: true,
k_onChange: function(k_form, k_radio) {
var
k_isPassive = false === k_form.k_isPeerEnabled(),
k_isDisabled = k_radio.k_isDisabled() || k_isPassive;
k_form.k_setDisabledPeerElements(k_isDisabled);
k_form.k_dialog.k_setRemoteIdValidator();
}
},
{
k_type: 'k_container',
k_indent: 2,
k_items: [
{
k_id: 'tunnel.peer.value',
k_isLabelHidden: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isHostsList'
}
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Use semicolons (%1) to separate multiple hostnames or IP addresses of the remote endpoint.', 'interfaceVpnTunnelEditor', { k_args: [' ; '], k_isSecure: true})
}
]
},
{
k_type: 'k_radio',
k_groupId: 'tunnel.peer.enabled',
k_isLabelHidden: true,
k_indent: 1,
k_option: [
'<span ',
kerio.lib.k_buildTooltip(k_messageTunnelPassive),
'>',
k_tr('Passive - it only accepts incoming connections', 'interfaceVpnTunnelEditor'),
'<span class="tooltip" ',
kerio.lib.k_buildTooltip(k_messageTunnelPassive),
'>&nbsp; &nbsp; &nbsp;</span></span>'
].join(''),
k_value: false
},
{
k_type: 'k_row',
k_className: 'tunnelTypeRow',
k_items: k_tunnelTypeBar
}
]
}
]
};

k_onChangeIpsecAuthentication = function(k_form, k_element) {
var
k_dialog = k_form.k_dialog,
k_usePsk = true === k_form.k_authenticationType.k_getValue(),
k_isAuthTypeChanged = k_element instanceof kerio.lib.K_Radio;
k_form.k_setDisabled('tunnel.psk.value', !k_usePsk);
k_form.k_certificateSelect.k_setDisabled(k_usePsk);
if (k_isAuthTypeChanged) {
k_form.k_remoteIdValue.k_reset();
}
if (k_usePsk) {
k_dialog.k_setPskAuthentication(k_form, k_element);
}
else {
k_dialog.k_setCertificateAuthentication(k_form, k_element);
}
};
k_authenticationFormCfg = {
k_useStructuredData: true,
k_anchor: '100% 100%',
k_items: [
{
k_type: 'k_container',
k_id: 'k_kerioVpnAuthentication',
k_isHidden: true,
k_labelWidth: 300,
k_items: [
{
k_id: 'k_localFingerprint',
k_caption: k_tr('Local endpoint\'s SSL certificate fingerprint:', 'interfaceVpnTunnelEditor'),
k_itemClassName: 'addBottomPadding', k_isReadOnly: true },
{
k_id: 'tunnel.remoteFingerprint',
k_caption: k_tr('Remote endpoint\'s SSL certificate fingerprint:', 'interfaceVpnTunnelEditor'),
k_maxLength: 47,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isFingerprint'
}
},
{
k_type: 'k_display',
k_id: 'k_remoteFingerprintInfo',
k_isLabelHidden: true,
k_style: 'margin-top: 10px',
k_value: k_tr('The authenticity of the remote endpoint during the creation of a tunnel session is verified by checking its public SSL certificate - the fingerprint of the certificate received from the remote endpoint must match the fingerprint entered here.', 'interfaceVpnTunnelEditor')
},
{
k_type: 'k_row',
k_items: [
'->',
{
k_type: 'k_formButton',
k_id: 'k_detectRemoteFingerprint',
k_caption: k_tr('Detect remote certificate…', 'interfaceVpnTunnelEditor'),
k_onClick: function(k_form) {
k_form.k_dialog.k_detectRemoteCertificate();
}
}
]
}
]
},
{
k_type: 'k_container',
k_id: 'k_ipsecAuthentication',
k_labelWidth: 167,
k_anchor: '100% 95%',
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'tunnel.psk.enabled',
k_isLabelHidden: true,
k_isChecked: true,
k_option: k_tr('Preshared key:', 'common'),
k_value: true,
k_width: 167, k_onChange: k_onChangeIpsecAuthentication
},
k_DEFINITIONS.k_get('k_passwordField', {k_id: 'tunnel.psk.value', k_width: undefined})
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'tunnel.psk.enabled',
k_isLabelHidden: true,
k_option: k_tr('Remote certificate:', 'common'),
k_value: false,
k_width: 167, k_onChange: k_onChangeIpsecAuthentication
},
k_WAW_METHODS.k_getSslCertificateFields('k_ipsecTunnel', 'k_ipsecTunnel', {k_onCertificateChange: k_onChangeIpsecAuthentication, k_isDisabled: true})
]
},
{
k_type: 'k_row',
k_style: 'padding-top: 20px;',
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_isSecure: true,
k_value: [
'<span ',
kerio.lib.k_buildTooltip(k_messageLocalId),
'>',
k_tr('Local ID:', 'interfaceEditor'),
'<span class="tooltip" ',
kerio.lib.k_buildTooltip(k_messageLocalId),
'>&nbsp; &nbsp; &nbsp;</span></span>'
].join(''),
k_width: 167
},
{
k_id: 'tunnel.localIdValue',
k_isCaptionHidden: true,
k_validator: {
k_functionName : 'k_isIpsecTunnelIdValidWithoutSpaces',
k_invalidText: k_tr('Local ID value cannot be %1 or %2 and cannot contain spaces', 'interfaceEditor', {k_args:[k_IPSEC_IDS_DENY_VALUES.k_EMPTY_IP, k_IPSEC_IDS_DENY_VALUES.k_ANY]}),
k_allowBlank: false
}
}
]
},
{
k_id: 'tunnel.remoteIdValue',
k_caption: k_tr('Remote ID:', 'interfaceVpnTunnelEditor'),
k_emptyText: '',
k_validator :{
k_functionName: 'k_emptyValidator', k_invalidText: k_passiveRemoteIdInvalidText,
k_allowBlank: false
},
k_onChange: function(k_form, k_element, k_value) {
k_form.k_dialog.k_setRemoteIdValidator();
}
},
{
k_type: 'k_container',
k_style: 'padding-top: 20px;',
k_items: [
{
k_caption: k_tr('Phase 1 (IKE) cipher:', 'interfaceEditor'),
k_isReadOnly: true,
k_id: 'tunnel.cipherIke'
},
{
k_caption: k_tr('Phase 2 (ESP) cipher:', 'interfaceEditor'),
k_isReadOnly: true,
k_id: 'tunnel.cipherEsp'
}
]
},
{
k_type: 'k_row',
k_items: [
'->',
{
k_type: 'k_formButton',
k_caption: k_tr('Change…', 'interfaceEditor'),
k_onClick: function(k_form) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'interfaceVpnTunnelCipherEditor',
k_objectName: 'interfaceVpnTunnelCipherEditor',
k_params: {
k_data: k_form.k_getData(true),
k_relatedWidget: k_form
}
});
}
}
]
},
{
k_type: 'k_row',
k_style: 'padding-top: 17px;',
k_items: [
'->',
k_WAW_METHODS.k_getDisplayFieldWithKbLink(1390, k_tr('Learn more about IPsec parameters', 'interfaceVpnTunnelEditor'))
]
}
]
}
]
}; k_remoteRouteGridCfg = {
k_localNamespace: k_localNamespace + 'kvpn' + '_', k_isAuditor: k_isAuditor
};
k_remoteRouteGrid = new kerio.waw.shared.k_widgets.K_CustomRoutesGrid(k_remoteRouteGridCfg);
k_remoteRoutingFormCfg = {
k_useStructuredData: true,
k_items: [
{
k_type: 'k_container',
k_id: 'k_kvpn',
k_isHidden: true,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'tunnel.useRemoteAutomaticRoutes',
k_isChecked: true,
k_option: k_tr('Use routes provided automatically by the remote endpoint', 'interfaceVpnTunnelEditor'),
k_isLabelHidden: true
},
{
k_id: 'tunnel.useRemoteCustomRoutes',
k_type: 'k_checkbox',
k_option: k_tr('Use custom routes:', 'interfaceVpnTunnelEditor'),
k_isLabelHidden: true
}
]
},
{
k_id: 'k_ipsecRoutes',
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Please define all remote networks accesible via this tunnel:', 'interfaceVpnTunnelEditor')
},
{
k_id: 'k_remoteRouteGridContainer',
k_type: 'k_container',
k_height: 250,
k_indent: 0,
k_content: k_remoteRouteGrid
}
]
};
k_localRouteGridCfg = {
k_localNamespace: k_localNamespace + 'localRouting' + '_', k_isAuditor: k_isAuditor,
k_height: 175
};
k_localRouteGrid = new kerio.waw.shared.k_widgets.K_CustomRoutesGrid(k_localRouteGridCfg);
k_localRoutingFormCfg = {
k_useStructuredData: true,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'tunnel.useLocalAutomaticRoutes',
k_isChecked: true,
k_option: k_tr('Use automatically determined local networks', 'interfaceVpnTunnelEditor'),
k_isLabelHidden: true
},
{
k_id: 'tunnel.useLocalCustomRoutes',
k_type: 'k_checkbox',
k_option: k_tr('Use custom networks:', 'interfaceVpnTunnelEditor'),
k_isLabelHidden: true
},
{
k_id: 'k_localRouteGridContainer',
k_type: 'k_container',
k_height: 175,
k_indent: 1,
k_content: k_localRouteGrid
}
]
};
k_generalForm = new k_lib.K_Form(k_localNamespace + 'k_generalForm', k_generalFormCfg);
k_authenticationForm = new k_lib.K_Form(k_localNamespace + 'k_authenticationForm', k_authenticationFormCfg);
k_remoteRoutingForm = new k_lib.K_Form(k_localNamespace + 'k_remoteRoutingForm', k_remoteRoutingFormCfg);
k_localRoutingForm = new k_lib.K_Form(k_localNamespace + 'k_localRoutingForm', k_localRoutingFormCfg);
k_authenticationForm.k_patchAutoFill();
k_tabPageCfg = {
k_className: 'interfaceEditorTabs',
k_items: [
{
k_id: k_authenticationTabId,
k_content: k_authenticationForm,
k_caption: k_tr('Authentication', 'interfaceVpnTunnelEditor')
},
{
k_id: k_remoteRoutingTabId,
k_content: k_remoteRoutingForm,
k_caption: k_tr('Remote Networks', 'interfaceVpnTunnelEditor')
},
{
k_id: k_localRoutingTabId,
k_content: k_localRoutingForm,
k_caption: k_tr('Local Networks', 'interfaceVpnTunnelEditor')
}
],
k_onTabChange: function(k_tabPage, k_currentTabId) {
var
k_dialog = this.k_getMainWidget(),
k_remoteRoutingForm = k_dialog.k_remoteRoutingForm,
k_isIpsec = k_dialog.k_tunnelType.k_getValue() === k_dialog.VpnType.VpnIpsec;
k_dialog.k_activeTabID = k_currentTabId;
if (k_currentTabId === k_remoteRoutingForm.k_remoteRoutingTabId) {
k_remoteRoutingForm.k_remoteRouteGridContainer.k_setSize({k_height: k_isIpsec ? 200 : 170});
}
}
};
if (k_showAllInTabs) {
k_tabPageCfg.k_items.unshift({
k_id: 'k_generalTab',
k_content: k_generalForm,
k_caption: k_tr('General', 'interfaceVpnTunnelEditor')
});
}
k_tabPage = new k_lib.K_TabPage(k_localNamespace + 'k_tabPage', k_tabPageCfg);
if (!k_showAllInTabs) {
k_layout = new kerio.lib.K_Layout(k_localNamespace + 'k_layout', {
k_verLayout: {
k_items: [
{
k_content: k_generalForm,
k_iniSize: 250
},
{
k_content: k_tabPage
}
]
}
});
}
k_dialogCfg = {
k_height: k_showAllInTabs? 430 : 630,
k_width: 620,
k_content: k_showAllInTabs ? k_tabPage : k_layout,
k_title: k_tr('VPN Tunnel Properties', 'interfaceVpnTunnelEditor'),
k_defaultItem: null,

k_onOkClick: function(k_toolbar){
var
k_shared = kerio.waw.shared,
k_WAW_METHODS = k_shared.k_methods,
k_dialog = k_toolbar.k_dialog,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_authenticationForm = k_dialog.k_authenticationForm,
k_isIpsec = k_dialog.k_generalForm.VpnType.VpnIpsec === k_dialog.k_tunnelType.k_getValue(),
k_pskValue = k_authenticationForm.k_presharedKey.k_getValue(),
k_validation;
if (k_isIpsec && k_authenticationForm.k_authenticationType.k_getValue() && '' === k_pskValue && (!k_dialog.k_dataStore.tunnel.psk.enabled || !k_dialog.k_isEdit)) {
k_WAW_METHODS.k_alertError(k_tr('Please set a preshared key or use a certificate for authentication.', 'interfaceVpnTunnelEditor'));
k_WAW_METHODS.k_unmaskMainScreen(k_dialog);
return;
}
if (!k_WAW_METHODS.k_validators.k_isAsciiString(k_pskValue)) {
k_WAW_METHODS.k_alertError(k_tr('For technical reasons, a preshared key may contain ASCII characters only.', 'interfaceVpnTunnelEditor'));
k_WAW_METHODS.k_unmaskMainScreen(k_dialog);
return;
}
k_validation = k_dialog.k_checkRouteSettingsValidity();
if (k_validation.k_isInvalid) {
if (k_validation.k_isError) {
k_WAW_METHODS.k_alertError(k_validation.k_message);
return;
}
k_lib.k_confirm({
k_title: k_tr('Confirm Action', 'common'),
k_msg: k_validation.k_message,
k_callback: k_dialog.k_conditionalSendData,
k_scope: k_dialog
});
}
else {
k_dialog.k_sendData();
}
}};
k_dialogCfg = k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_formManager = new k_lib.K_FormManager(k_localNamespace + 'k_formManager', [k_generalForm, k_authenticationForm, k_remoteRoutingForm, k_localRoutingForm]);
if (k_isAuditor) {
k_generalForm.k_setReadOnlyAll();
k_authenticationForm.k_setReadOnlyAll();
k_remoteRoutingForm.k_setReadOnlyAll();
k_localRoutingForm.k_setReadOnlyAll();
}
k_dialog.k_addReferences({
k_objectName: k_objectName,
k_isAuditor: k_isAuditor,
k_showAllInTabs: k_showAllInTabs,
k_tabPage: k_tabPage,
k_formManager: k_formManager,
k_generalForm: k_generalForm,
k_authenticationForm: k_authenticationForm,
k_remoteRoutingForm: k_remoteRoutingForm,
k_localRoutingForm: k_localRoutingForm,
k_isEdit: k_isEdit,
k_remoteRouteGrid: k_remoteRouteGrid,
k_localRouteGrid: k_localRouteGrid,
VpnType: VpnType,
k_useCustomRoutes: k_remoteRoutingForm.k_getItem('tunnel.useRemoteCustomRoutes'),
k_tunnelType: k_generalForm.k_getItem('tunnel.type'),
k_inputPeer: k_generalForm.k_getItem('tunnel.peer.value'),
k_textRemoteFingerprint: k_authenticationForm.k_getItem('tunnel.remoteFingerprint'),
k_isFingerprint: kerio.lib.k_inputValidator.k_getFunctionByName('k_isFingerprint'),
k_vpnTunnelRequestId: 0,
k_defaultData: k_shared.k_DEFINITIONS.k_get('k_predefinedInterface').tunnel,
k_authenticationTabId: k_authenticationTabId,
k_remoteRoutingTabId: k_remoteRoutingTabId,
k_localRoutingTabId: k_localRoutingTabId,
k_keepDialogOpen: false,
k_activeTabID: k_authenticationTabId
});
k_generalForm.k_addReferences({
VpnType: VpnType,
k_dialog: k_dialog,
k_authenticationForm: k_authenticationForm,
k_remoteRoutingForm: k_remoteRoutingForm,
k_enabled: k_generalForm.k_getItem('enabled'),
k_peerEnabled: k_generalForm.k_getItem('tunnel.peer.enabled'),
k_enabledElements: [
'tunnel.peer.enabled'
],
k_peerEnabledElements: [
'tunnel.peer.value'
]
});
k_authenticationForm.k_addReferences(
{
k_dialog: k_dialog,
k_REMOTE_CERTIFICATE: k_REMOTE_CERTIFICATE,
k_localFingerprint: k_authenticationForm.k_getItem('k_localFingerprint'),
k_authenticationType: k_authenticationForm.k_getItem('tunnel.psk.enabled'),
k_presharedKey: k_authenticationForm.k_getItem('tunnel.psk.value'),
k_certificateSelect: k_authenticationForm.k_getItem('k_ipsecTunnel' + '_' + 'k_certificate'),
k_localIdValue: k_authenticationForm.k_getItem('tunnel.localIdValue'),
k_remoteIdValue: k_authenticationForm.k_getItem('tunnel.remoteIdValue'),
k_peerEnabledElements: ['k_detectRemoteFingerprint'],
k_emptyRemoteIdInvalidText: k_emptyRemoteIdInvalidText,
k_passiveRemoteIdInvalidText: k_passiveRemoteIdInvalidText,
k_passiveRemoteIdInvalidTextWithNoSpaces: k_passiveRemoteIdInvalidTextWithNoSpaces,
k_remoteIdInvalidTextWithNoSpaces: k_remoteIdInvalidTextWithNoSpaces,
k_serverCertificate: null,
k_ipsecPeerIdConfig: null,
k_remoteCertificate: {
k_isOriginal: false,
k_value: ''
}
}
);
k_remoteRoutingForm.k_addReferences(
{
k_dialog: k_dialog,
k_password: k_remoteRoutingForm.k_getItem('k_password'),
k_remoteRouteGridContainer: k_remoteRoutingForm.k_getItem('k_remoteRouteGridContainer'),
k_acceptAutomaticRoutes: k_remoteRoutingForm.k_getItem('tunnel.useRemoteAutomaticRoutes'),
k_useCustomRoutes: k_remoteRoutingForm.k_getItem('tunnel.useRemoteCustomRoutes'),
k_remoteRouteGrid: k_remoteRouteGrid,
k_remoteRoutingTabId: k_remoteRoutingTabId
}
);
k_localRoutingForm.k_addReferences(
{
k_dialog: k_dialog,
k_acceptAutomaticRoutes: k_localRoutingForm.k_getItem('tunnel.useLocalAutomaticRoutes'),
k_useCustomRoutes: k_localRoutingForm.k_getItem('tunnel.useLocalCustomRoutes'),
k_localRouteGrid: k_localRouteGrid,
k_localRoutingTabId: k_localRoutingTabId
}
);
k_remoteRouteGrid.k_addReferences({
k_dialog: k_dialog
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_shared = kerio.waw.shared,
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_authenticationForm = this.k_authenticationForm,
k_relatedGrid = k_params.k_relatedGrid,
k_ipsecPeerIdConfig = k_relatedGrid.k_ipsecPeerIdConfig,
k_dataStore,
k_isRemoteCertificate,
k_serverCertificate;
if (this.k_isEdit) {
k_dataStore = kerio.lib.k_cloneObject(k_params.k_data);
} else {
k_dataStore = kerio.lib.k_cloneObject(k_shared.k_DEFINITIONS.k_get('k_predefinedInterface'));
k_dataStore.tunnel = kerio.lib.k_cloneObject(this.k_defaultData);
k_dataStore.tunnel.localIdValue = k_ipsecPeerIdConfig.k_defaultLocalIdValue;
k_dataStore.tunnel.cipherIke = k_ipsecPeerIdConfig.k_defaultCipherIke;
k_dataStore.tunnel.cipherEsp = k_ipsecPeerIdConfig.k_defaultCipherEsp;
}
k_authenticationForm.k_setData(k_dataStore, true);
k_authenticationForm.k_ipsecPeerIdConfig = k_ipsecPeerIdConfig;
k_authenticationForm.k_serverCertificate = k_relatedGrid.k_kerioIpsecCertificate;
this.k_dataStore = k_dataStore;
this.k_relatedGrid = k_relatedGrid;
this.k_formManager.k_setData(k_dataStore, true);
this.k_remoteRouteGrid.k_setData(k_dataStore.tunnel.remoteRoutes);
this.k_localRouteGrid.k_setData(k_dataStore.tunnel.localRoutes);
k_isRemoteCertificate = !k_dataStore.tunnel.psk.value && k_authenticationForm.k_REMOTE_CERTIFICATE === k_dataStore.tunnel.certificate.id;
k_authenticationForm.k_remoteCertificate = {
k_isOriginal: k_isRemoteCertificate,
k_value: k_isRemoteCertificate ? k_dataStore.tunnel.remoteIdValue : ''
};
k_authenticationForm.k_authenticationType.k_setValue(k_dataStore.tunnel.psk.enabled, true);
k_authenticationForm.k_remoteIdValue.k_setValue(k_dataStore.tunnel.remoteIdValue);
if ('' === k_dataStore.tunnel.psk.value) {
k_WAW_METHODS.k_initPasswordField(k_authenticationForm.k_presharedKey);
}
if (k_params.k_kerioVpnCertificate) {
k_serverCertificate = k_WAW_METHODS.k_getSslCertificate(k_params.k_kerioVpnCertificate.id, 'k_certificates');
if (k_serverCertificate) {
k_authenticationForm.k_localFingerprint.k_setValue(k_serverCertificate.fingerprint);
}
}
k_WAW_METHODS.k_setSslCertificateFieldsetData(
{
k_form: k_authenticationForm,
k_idPrefix: 'k_ipsecTunnel',
k_showRemoteCertificate: true,
k_handleApplyReset: false,
k_listLoaderId: 'k_ipsecTunnelCertificates'
},
k_dataStore.tunnel.certificate);
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_dialogs: ['sslCertificateDetails', 'routeEditor'] });
};
k_kerioWidget.k_conditionalSendData = function(k_response) {
if ('no' === k_response) {
return;
}
this.k_sendData();
};

k_kerioWidget.k_setActiveRemoteRoutingTab = function() {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
this.k_tabPage.k_setActiveTab(this.k_remoteRoutingTabId);
};

k_kerioWidget.k_setActiveLocalRoutingTab = function() {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
this.k_tabPage.k_setActiveTab(this.k_localRoutingTabId);
};

k_kerioWidget.k_checkRouteSettingsValidity = function() {
var
k_isIpsec = this.k_generalForm.VpnType.VpnIpsec === this.k_tunnelType.k_getValue(),
k_isEnabled = this.k_generalForm.k_enabled.k_getValue(),
k_noRemoteEnabledRouteExists = -1 === this.k_remoteRouteGrid.k_findRow('enabled', true),
k_noLocalEnabledRouteExists = -1 === this.k_localRouteGrid.k_findRow('enabled', true),
k_tr = kerio.lib.k_tr,
k_validation = {
k_isInvalid: false,
k_isError: false,
k_message: ''
};
if (k_isEnabled) {
if (k_isIpsec && k_noRemoteEnabledRouteExists) {
this.k_setActiveRemoteRoutingTab();
k_validation.k_message = k_tr('IPsec tunnel needs to know remote networks. Please define some.', 'interfaceVpnTunnelEditor');
k_validation.k_isInvalid = true;
k_validation.k_isError = true;
return k_validation;
}
if (!k_isIpsec) {
if (!this.k_remoteRoutingForm.k_acceptAutomaticRoutes.k_getValue()) {
if (!this.k_remoteRoutingForm.k_useCustomRoutes.k_getValue()) {
k_validation.k_isInvalid = true;
k_validation.k_message = k_tr('The VPN tunnel neither accepts routes provided automatically by the remote endpoint nor uses custom routes. Do you want to continue?', 'vpnRouteManager');
}
else if (k_noRemoteEnabledRouteExists) {
k_validation.k_isInvalid = true;
k_validation.k_message = k_tr('The VPN tunnel is configured to use custom routes only, but no custom routes are defined. Do you want to continue?', 'vpnRouteManager');
}
if (k_validation.k_isInvalid) {
this.k_setActiveRemoteRoutingTab();
}
}
}
else {
if (!this.k_localRoutingForm.k_acceptAutomaticRoutes.k_getValue()) {
if (!this.k_localRoutingForm.k_useCustomRoutes.k_getValue()) {
k_validation.k_isInvalid = true;
k_validation.k_message = k_tr('The IPsec tunnel uses neither the automatically determined nor the custom defined local networks. Do you want to continue?', 'vpnRouteManager');
}
else if (k_noLocalEnabledRouteExists) {
k_validation.k_isInvalid = true;
k_validation.k_message = k_tr('The IPsec tunnel is configured to use custom local networks only, but no custom networks are defined. Do you want to continue?', 'vpnRouteManager');
}
if (k_validation.k_isInvalid) {
this.k_setActiveLocalRoutingTab();
}
}
}
}
return k_validation;
};

k_kerioWidget.k_sendData = function() {
var
k_shared = kerio.waw.shared,
k_WAW_METHODS = k_shared.k_methods,
k_data = this.k_formManager.k_getData(true),
k_dataTunnel = k_data.tunnel,
k_dataStore = this.k_dataStore,
k_authenticationForm = this.k_authenticationForm,
k_remoteId = k_authenticationForm.k_certificateSelect.k_getValue(),
k_requests = [],
k_requestsCount = 0,
k_WAW_CONSTANTS,
k_commonProperties;
delete k_dataStore.ip6prefixLength;
delete k_dataStore.vpn;
k_dataStore.vlanId = k_dataStore.vlanId || 0;
k_dataTunnel.remoteRoutes = this.k_remoteRouteGrid.k_getData();
k_dataTunnel.localRoutes = this.k_localRouteGrid.k_getData();
k_dataTunnel.certificate = {
id: k_authenticationForm.k_REMOTE_CERTIFICATE === k_remoteId ? '' : k_remoteId,
name: '',
invalid: false
};
k_commonProperties = {
name: k_data.name,
enabled: k_data.enabled,
tunnel: k_dataTunnel
};
if (this.k_isEdit) {
if (k_dataTunnel.psk.enabled && k_dataStore.tunnel.psk.enabled && '' === k_dataTunnel.psk.value) {
delete k_dataStore.tunnel.psk.value;
delete k_commonProperties.tunnel.psk.value;
}
}
else {
k_WAW_CONSTANTS = k_shared.k_CONSTANTS;
k_dataStore.type = k_WAW_CONSTANTS.InterfaceType.VpnTunnel;
k_dataStore.group = k_WAW_CONSTANTS.InterfaceGroupType.Vpn;
}
k_WAW_METHODS.k_mergeObjects(k_commonProperties, k_dataStore);
if (this.k_isEdit) {
k_requests.push({
method: 'Interfaces.set',
params: {
ids: [k_dataStore.id],
details: k_dataStore
}
});
}
else {
k_requests.push({
method: 'Interfaces.create',
params: {
list: [k_dataStore]
}
});
}
k_requestsCount++;
this.k_vpnTunnelRequestId = k_requestsCount - 1;
k_WAW_METHODS.k_sendBatch({
k_requests: k_requests,
k_callback: this.k_sendDataCallback,
k_scope: this
});
};
k_kerioWidget.k_sendDataCallback = function(k_response, k_success) {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
if (!k_success || !k_response.k_decoded.batchResult || k_response.k_decoded.batchResult[this.k_vpnTunnelRequestId].errors.length !== 0) {
return;
}
this.k_relatedGrid.k_reloadData();
kerio.adm.k_framework.k_enableApplyReset();
if (true !== this.k_keepDialogOpen) {
this.k_hide();
}
};

k_kerioWidget.k_resetOnClose = function() {
this.k_formManager.k_reset();
this.k_remoteRouteGrid.k_reset();
this.k_tabPage.k_setActiveTab(this.k_showAllInTabs ? 'k_generalTab' : 'k_authenticationTab');
};

k_kerioWidget.k_generalForm.k_isPeerEnabled = function() {
return this.k_peerEnabled.k_getValue();
};

k_kerioWidget.k_generalForm.k_setDisabledPeerElements = function(k_disable) {
k_disable = false !== k_disable;
this.k_setDisabled(this.k_peerEnabledElements, k_disable);
this.k_authenticationForm.k_setDisabled(this.k_authenticationForm.k_peerEnabledElements, k_disable);
};

k_kerioWidget.k_detectRemoteCertificate = function(){
var
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_hostName = this.k_inputPeer.k_getValue();
if ('' === k_hostName) {
k_WAW_METHODS.k_alertError(kerio.lib.k_tr('Please specify remote endpoint', 'vpnRouteManager'));
return; }
k_WAW_METHODS.k_maskMainScreen(this, {
k_message: kerio.lib.k_tr('Trying to detect the remote endpoint\'s SSL certificate…', 'vpnRouteManager'),
k_delay: 0
});
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Certificates.detect',
params: { host: k_hostName }
},
k_callback: this.k_detectRemoteCertificateCallback,
k_scope: this
});
};

k_kerioWidget.k_detectRemoteCertificateCallback = function(k_response, k_success) {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
if (!k_success || !k_response.k_decoded.certificate) {
return;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'sslCertificateDetails',
k_objectName: 'sslCertificateConfirm',
k_params: {
k_parent: this,
k_acceptMethod: this.k_certificateAccepted,
k_cancelMethod: this.k_certificateCancel,
k_data: {
k_sslCertificate: k_response.k_decoded.certificate,
k_successMessage: kerio.lib.k_tr('SSL Certificate has been detected successfully.', 'sslCertificate')
}
}
});
};

k_kerioWidget.k_certificateAccepted = function(k_sslCertificate) {
this.k_parentDialog.k_textRemoteFingerprint.k_setValue(k_sslCertificate.fingerprint);
this.k_hide();
};

k_kerioWidget.k_certificateCancel = function() {
this.k_hide();
};

k_kerioWidget.k_setPskAuthentication = function(k_form, k_element) {
var
k_isAuthTypeChanged = k_element instanceof kerio.lib.K_Radio,
k_dataStore = k_form.k_dialog.k_dataStore,
k_remoteIdValue = k_form.k_remoteIdValue,
k_localIdValue = k_form.k_localIdValue;
if (k_isAuthTypeChanged) {
if (k_dataStore.tunnel.psk.enabled) {
k_remoteIdValue.k_setValue(k_dataStore.tunnel.remoteIdValue);
} else {
k_remoteIdValue.k_reset();
}
k_remoteIdValue.k_setReadOnly(false);
k_localIdValue.k_setReadOnly(false);
k_form.k_dialog.k_setRemoteIdValidator();
if (k_form.k_ipsecPeerIdConfig) {
k_localIdValue.k_setValue(k_form.k_ipsecPeerIdConfig.k_defaultLocalIdValue);
}
}
};

k_kerioWidget.k_setCertificateAuthentication = function(k_form, k_element) {
var
k_remoteCertificate = k_form.k_remoteCertificate,
k_certificateId = k_form.k_certificateSelect.k_getValue(),
k_useRemoteCertificate = k_form.k_REMOTE_CERTIFICATE === k_certificateId,
k_remoteIdValue = k_form.k_remoteIdValue,
k_localIdValue = k_form.k_localIdValue;
if (k_useRemoteCertificate) {
k_remoteIdValue.k_setValue(k_remoteCertificate.k_value);
k_remoteCertificate.k_isOriginal = true;
}
else {
k_remoteCertificate.k_isOriginal = false;
k_remoteIdValue.k_setValue(k_form.k_ipsecPeerIdConfig.k_certificateValues[k_certificateId]);
}
if (k_remoteCertificate.k_isOriginal) {
k_remoteCertificate.k_value = k_remoteIdValue.k_getValue();
}
k_remoteIdValue.k_setReadOnly(!k_useRemoteCertificate);
k_localIdValue.k_setReadOnly(true);
k_form.k_dialog.k_setRemoteIdValidator();
if (k_form.k_ipsecPeerIdConfig && k_form.k_ipsecPeerIdConfig.k_certificateValues) {
k_form.k_localIdValue.k_setValue(k_form.k_ipsecPeerIdConfig.k_certificateValues[k_form.k_serverCertificate.id]);
}
};

k_kerioWidget.k_setRemoteIdValidator = function() {
var
k_isActive = this.k_generalForm.k_peerEnabled.k_getValue(),
k_authenticationForm = this.k_authenticationForm,
k_isPsk = true === k_authenticationForm.k_authenticationType.k_getValue(),
k_remoteIdValue = k_authenticationForm.k_remoteIdValue,
k_invalidMessage;
if ('' !== k_remoteIdValue.k_getValue()) {
if (!k_isActive) {
if (k_isPsk) {
k_remoteIdValue.k_setValidationFunction('k_isIpsecTunnelIdValidWithoutSpaces');
k_invalidMessage = k_authenticationForm.k_passiveRemoteIdInvalidTextWithNoSpaces;
}
else {
k_remoteIdValue.k_setValidationFunction('k_isIpsecTunnelIdValid');
k_invalidMessage = k_authenticationForm.k_passiveRemoteIdInvalidText;
}
}
else {
if (k_isPsk) {
k_remoteIdValue.k_setValidationFunction('k_hasNoSpaces');
k_invalidMessage = k_authenticationForm.k_remoteIdInvalidTextWithNoSpaces;
}
else {
k_remoteIdValue.k_setValidationFunction('k_emptyValidator');
k_authenticationForm.k_emptyRemoteIdInvalidText;
}
}
}
else {
k_invalidMessage = k_authenticationForm.k_emptyRemoteIdInvalidText;
}
k_remoteIdValue.k_markInvalid(!k_remoteIdValue.k_isValid(), k_invalidMessage);
};
} }; 