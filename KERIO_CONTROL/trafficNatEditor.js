
kerio.waw.ui.trafficNatEditor = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_natModes = k_WAW_CONSTANTS.SourceNatMode,
k_balancing = k_WAW_CONSTANTS.NatBalancing,
k_NAT_ALL = 0,
k_NAT_IPv4_ONLY = 1,
k_sourceHeight = 200, k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_form, k_formCfg,
k_dialog, k_dialogCfg,
k_sourceModeContainers,
k_dataMapping;
k_formCfg = {
k_isReadOnly: k_isAuditor,
k_labelWidth: 120,
k_items: [
{
k_id: 'k_natIpv4Only',
k_type: 'k_select',
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',
k_caption: k_tr('Apply the settings to:', 'trafficNatEditor'),
k_localData: [
{k_value: k_NAT_IPv4_ONLY, k_name: k_tr('IPv4 NAT only', 'trafficNatEditor')},
{k_value: k_NAT_ALL, k_name: k_tr('IPv4 NAT and IPv6 prefix translation', 'trafficNatEditor')}
],
k_onChange: function(k_form, k_select, k_isNatIpv4OnlyValue) {
var
k_isNatIpv4Only = k_form.k_NAT_IPv4_ONLY === k_isNatIpv4OnlyValue;
k_form.k_isNatIpv4Only = k_isNatIpv4Only;
if (k_form.k_enableDestinationNat.k_getValue()) {
k_form.k_setDisabled(['k_translatedIpv6Host'], k_isNatIpv4Only);
}
if (k_form.k_enableSourceNat.k_getValue()) {
k_form.k_setDisabled(['k_ipv6Address'], k_isNatIpv4Only);
}
}
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Source NAT', 'trafficNatEditor'),
k_labelWidth: 100,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'k_enableSourceNat',
k_isChecked: false,
k_isLabelHidden: true,
k_option: k_tr('Enable source NAT', 'trafficNatEditor'),

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled(['k_sourceNatContainer'], !k_isChecked);
k_form.k_setDisabled(['k_ipv6Address'], k_form.k_isNatIpv4Only);
}
},
{	k_type: 'k_container',
k_id: 'k_sourceNatContainer',
k_isDisabled: true,
k_indent: 1,
k_items: [
{
k_type: 'k_select',
k_id: 'k_natMode',
k_isLabelHidden: true,
k_value: k_natModes.NatDefault,
k_localData: [
{
k_name: k_tr('Default setting (recommended)', 'trafficNatEditor'),
k_id: k_natModes.NatDefault
},
{
k_name: k_tr('Use specific outgoing interface', 'trafficNatEditor'),
k_id: k_natModes.NatInterface
},
{
k_name: k_tr('Use specific IP address', 'trafficNatEditor'),
k_id: k_natModes.NatIpAddress
}
],
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',

k_onChange: function(k_form, k_select, k_value) {
var k_containers = k_form.k_collections.k_sourceModeContainers;
k_form.k_setVisible(k_containers.k_all, false); k_form.k_setVisible(k_containers[k_value], true); }
}, {
k_type: 'k_container',
k_id: 'k_defaultModeContainer',
k_height: k_sourceHeight,
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Kerio Control will automatically choose the IP address for source NAT depending on the Internet connectivity.', 'trafficNatEditor')
},
{
k_type: 'k_radio',
k_groupId: 'k_balancing',
k_value: k_balancing.BalancingPerHost,
k_isLabelHidden: true,
k_indent: 1,
k_option: k_tr('Perform load balancing per host (better compatibility)', 'trafficNatEditor')
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_indent: 2,
k_value: k_tr('Connections initiated by the same host will always use the same Internet link.', 'trafficNatEditor')
},
{
k_type: 'k_radio',
k_groupId: 'k_balancing',
k_value: k_balancing.BalancingPerConnection,
k_isLabelHidden: true,
k_indent: 1,
k_option: k_tr('Perform load balancing per connection (better performance)', 'trafficNatEditor')
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_indent: 2,
k_value: k_tr('Connections initiated by the same host may use different Internet links. While this setting offers better performance you may experience compatibility problems with some applications and web sites.', 'trafficNatEditor')
}
] },
{
k_type: 'k_container',
k_id: 'k_interfaceModeContainer',
k_isHidden: true,
k_height: k_sourceHeight,
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Kerio Control will use IPv4 address and IPv6 prefix of the following specified interface for source NAT.', 'trafficNatEditor')
},
{
k_type: 'k_select',
k_id: 'k_natInterface',
k_caption: k_tr('Interface:', 'trafficNatEditor'),
k_indent: 1,
k_localData: [], k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_listClassName: 'interfaceIcon',
k_fieldIconClassName: 'k_class'
},
{
k_type: 'k_checkbox',
k_id: 'k_allowFailover',
k_isLabelHidden: true,
k_indent: 1,
k_option: k_tr('Use other Internet interfaces when this interface is unavailable.', 'trafficNatEditor')
}
] },
{
k_type: 'k_container',
k_id: 'k_ipAddressModeContainer',
k_isHidden: true,
k_height: k_sourceHeight,
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Kerio Control will use the following specified IPv4 address and IPv6 prefix for source NAT.', 'trafficNatEditor')
},
{
k_id: 'k_ipAddress',
k_caption: k_tr('IPv4 Address:', 'ipAddressGroupEditor'),
k_indent: 1,
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_IP_ADDRESS,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: k_shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: k_shared.k_methods.k_allowOnlyIpv4Chars
},
{
k_id: 'k_ipv6Address',
k_caption: k_tr('IPv6 Prefix:', 'ipAddressGroupEditor'),
k_indent: 1,
k_maxLength: 43, k_validator: {
k_functionName: 'k_isIpv4Or6Prefix',
k_allowBlank: false,
k_inputFilter: k_shared.k_DEFINITIONS.k_ipv4Or6Prefix.k_allowedChars
},
k_onChange: k_shared.k_methods.k_allowOnlyIpv4Or6Chars
}
]
},
{
k_type: 'k_checkbox',
k_id: 'k_allowReverseConnection',
k_isLabelHidden: true,
k_option: k_tr('Allow reverse connections from any host (full cone NAT)', 'trafficNatEditor'),

k_onChange: function(k_form, k_checkbox, k_value) {
if (k_value) {
k_form.k_confirmFullConeNat();
}
}
}
] }
] },
{
k_type: 'k_fieldset',
k_caption: k_tr('Destination NAT', 'trafficNatEditor'),
k_labelWidth: 100,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'k_enableDestinationNat',
k_isChecked: false,
k_isLabelHidden: true,
k_option: k_tr('Enable destination NAT', 'trafficNatEditor'),

k_onChange: function(k_form, k_select, k_isChecked) {
k_form.k_setDisabled(['k_destinationNatContainer'], !k_isChecked);
k_form.k_setDisabled(['k_translatedIpv6Host'], k_form.k_isNatIpv4Only);
}
},
{
k_type: 'k_container',
k_id: 'k_destinationNatContainer',
k_labelWidth: 240,
k_isDisabled: true,
k_items: [
{	k_type: 'k_container',
k_items: [
{
k_id: 'k_translatedHost',
k_caption: k_tr('Translate to the following IPv4 host:', 'trafficNatEditor'),
k_indent: 1,
k_checkByteLength: true,
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_HOST_WITH_PORT,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isHostWithPort'
}
},
{
k_id: 'k_translatedIpv6Host',
k_caption: k_tr('Translate with the following IPv6 prefix or host:', 'trafficNatEditor'),
k_indent: 1,
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_HOST_WITH_PORT,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_hasNoSpaces'
}
}
]
},
{
k_type: 'k_checkbox',
k_id: 'k_enableTranslatedPort',
k_indent: 1,
k_isLabelHidden: true,
k_option: k_tr('Translate port as well', 'trafficNatEditor'),

k_onChange: function(k_form, k_select, k_isChecked) {
k_form.k_setDisabled(['k_translatedPort'], !k_isChecked);
} },
{
k_type: 'k_number',
k_id: 'k_translatedPort',
k_caption: k_tr('Translate port to:', 'trafficNatEditor'),
k_isDisabled: true,
k_indent: 2,
k_width: 50,
k_maxLength: 5,
k_minValue: 1,
k_maxValue: 65535,
k_validator: {
k_allowBlank: false
}
}
] }
] }
] }; k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 630,
k_height: 610,
k_title: k_tr('Traffic Rule - Translation', 'trafficNatEditor'),
k_content: k_form,
k_defaultItem: 'k_natMode',

k_onOkClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData.call(k_toolbar.k_dialog);
} }; k_dialogCfg = k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);

k_sourceModeContainers = {};
k_sourceModeContainers.k_all = [ 'k_defaultModeContainer', 'k_interfaceModeContainer', 'k_ipAddressModeContainer' ];
k_sourceModeContainers[k_natModes.NatDefault] = [ 'k_defaultModeContainer' ];
k_sourceModeContainers[k_natModes.NatInterface] = [ 'k_interfaceModeContainer' ];
k_sourceModeContainers[k_natModes.NatIpAddress] = [ 'k_ipAddressModeContainer' ];


k_dataMapping = {
k_enableSourceNat: 'enableSourceNat',
k_natMode: 'natMode',
k_balancing: 'balancing',
k_allowFailover: 'allowFailover',
k_ipAddress: 'ipAddress',
k_ipv6Address: 'ipv6Address',
k_allowReverseConnection: 'allowReverseConnection',
k_enableDestinationNat: 'enableDestinationNat',
k_translatedHost: 'translatedHost',
k_translatedIpv6Host: 'translatedIpv6Host',
k_natIpv4Only: 'natIpv4Only',
k_translatedPort: this.k_mapProperty,
k_enableTranslatedPort: this.k_mapProperty,
translatedPort: this.k_mapProperty };
k_form.k_addReferences({
k_isAuditor: k_isAuditor,
k_dataMapping: k_shared.k_methods.k_flip(k_dataMapping, true), k_collections: {
k_sourceModeContainers: k_sourceModeContainers
},
k_skipNatWarning: false,
k_enableSourceNat: k_form.k_getItem('k_enableSourceNat'),
k_enableDestinationNat: k_form.k_getItem('k_enableDestinationNat'),
k_isNatIpv4Only: true,
k_NAT_ALL: k_NAT_ALL,
k_NAT_IPv4_ONLY: k_NAT_IPv4_ONLY
});
k_dialog.k_addReferences({
k_form: k_form,
k_dataStore: {}
});
if (k_isAuditor) {
k_form.k_setReadOnlyAll();
}
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_shared = kerio.waw.shared,
k_WAW_METHODS = k_shared.k_methods,
k_formData = {},
k_data = k_params.k_data,
k_form = this.k_form,
k_relatedGrid = k_params.k_relatedGrid,
k_isLoadBalanced = false,
k_allowFailover = k_form.k_getItem('k_allowFailover');
this.k_dataStore = k_data;
this.k_relatedGrid = k_relatedGrid;
k_formData = k_WAW_METHODS.k_mapProperties(k_data, k_form.k_dataMapping);
k_form.k_skipNatWarning = true; k_isLoadBalanced = k_relatedGrid.k_connectivityConfig && k_relatedGrid.k_connectivityConfig.mode === k_shared.k_CONSTANTS.ConnectivityType.LoadBalancing;
k_allowFailover.k_setVisible(k_isLoadBalanced);
if (k_formData.k_natIpv4Only) {
k_formData.k_natIpv4Only = k_form.k_NAT_IPv4_ONLY;
}
else {
k_formData.k_natIpv4Only = undefined === k_formData.k_natIpv4Only ? k_form.k_NAT_IPv4_ONLY : k_form.k_NAT_ALL;
}
k_form.k_setData(k_formData);
k_relatedGrid.k_initNatInterfaceListLoader({
k_select: k_form.k_getItem('k_natInterface'),
k_form: k_form,
k_value: k_data.natInterface
});
k_form.k_skipNatWarning = false;
k_shared.k_data.k_cache({ k_dialog: this }); }; 
k_kerioWidget.k_sendData = function() {
var
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_formData,
k_dataStore = {}, k_form = this.k_form,
k_grid = this.k_relatedGrid,
k_interface,
k_tr = kerio.lib.k_tr;
k_interface = k_form.k_getItem('k_natInterface').k_listLoader;
if (k_interface.k_isEmpty()) {
kerio.lib.k_alert(
k_tr('No available interface', 'trafficNatEditor'),
k_tr('There is no interface available. Please choose another NAT mode.', 'trafficNatEditor')
);
this.k_hideMask();
return;
}
k_dataStore.natInterface = k_interface.k_getValue();
k_formData = k_form.k_getData();
if (k_formData.k_enableDestinationNat && k_formData.k_enableTranslatedPort && -1 < k_formData.k_translatedHost.indexOf(':')) {
kerio.lib.k_alert(
k_tr('Validation Warning', 'common'),
k_tr('Destination port translation is not valid. Destination host address cannot contain port number when port translation is enabled.', 'trafficNatEditor')
);
this.k_hideMask();
return;
}
k_formData.k_natIpv4Only = k_form.k_NAT_IPv4_ONLY === k_formData.k_natIpv4Only;
if (k_formData.k_natIpv4Only) {
k_formData.k_ipv6Address = '';
k_formData.k_translatedIpv6Host = '';
}
k_WAW_METHODS.k_mergeObjects(
k_WAW_METHODS.k_mapProperties(k_formData, k_form.k_dataMapping),
k_dataStore
);
k_grid.k_updateRow(k_dataStore);
kerio.adm.k_framework.k_enableApplyReset();
this.k_hide();
}; 
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
}; 
k_kerioWidget.k_form.k_confirmFullConeNat = function() {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_trCache = this.k_trCache || {};
if (this.k_skipNatWarning) {
return;
}
if (!k_trCache.k_fullConeNatTitle) {
kerio.waw.shared.k_methods.k_mergeObjects(
{
k_fullConeNatTitle: k_tr('Full cone NAT', 'trafficNatEditor'),
k_fullConeNatInfo: k_tr('It is not recommended to enable full cone NAT unless you are sure what you are doing. By turning it on, you are allowing certain incoming traffic from arbitrary Internet hosts. That may imply a security threat.', 'trafficNatEditor'),
k_fullConeNatQuestion: k_tr('Are you sure you want to enable full cone NAT?', 'trafficNatEditor')
},
k_trCache
);
this.k_trCache = k_trCache;
}
k_lib.k_confirm(
k_trCache.k_fullConeNatTitle,
k_trCache.k_fullConeNatInfo + '<br><br>' + '<b>' + k_trCache.k_fullConeNatQuestion + '</b>',
this.k_fullConeNatCallback,
this
); }; 
k_kerioWidget.k_form.k_fullConeNatCallback = function(k_answer) {
if ('no' === k_answer) {
this.k_setData({
k_allowReverseConnection: false });
}
}; }, 
k_mapProperty: function(k_from, k_value, k_data) {
switch (k_from) {
case 'k_translatedPort':
return {
translatedPort: {
value: k_value
}
}; case 'k_enableTranslatedPort':
return {
translatedPort: {
enabled: k_value
}
}; case 'translatedPort':
return {
k_enableTranslatedPort: k_value.enabled,
k_translatedPort: k_value.value
}; default:
return {};
} }}; 