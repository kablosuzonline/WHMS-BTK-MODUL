
kerio.waw.ui.interfaceEditor = {
k_init: function(k_objectName, k_config) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_WAW_DEFINITIONS = k_shared.k_DEFINITIONS,
k_WAW_METHODS = k_shared.k_methods,
k_OS_WINDOWS = k_WAW_CONSTANTS.k_SERVER.k_OS_WINDOWS,
k_OS_LINUX = k_WAW_CONSTANTS.k_SERVER.k_OS_LINUX,
k_INTERFACE_EDITOR_NAMES = k_WAW_CONSTANTS.k_INTERFACE_EDITOR_NAMES,
k_CONTAINER_POSTFIX = '_' + 'k_container',
k_INNER_CONTAINER_POSTFIX = '_' + 'k_innerContainer',
k_CONNECTIVITY_PARAMS = 'connectivityParameters',
k_FAILOVER_ID = 'failoverRole',
k_LOAD_BALANCING_ID = k_CONNECTIVITY_PARAMS + '.loadBalancingWeight',
k_DIAL_ON_DEMAND_ID = k_CONNECTIVITY_PARAMS + '.onDemand',
k_isAuditor = k_WAW_METHODS.k_isAuditor(),
k_isLinux = k_WAW_METHODS.k_isLinux(),
k_isWindows = !k_isLinux,
k_showAllInTabs = k_lib.k_isIPadCompatible,
k_isEthernet = k_INTERFACE_EDITOR_NAMES.k_ETHERNET.k_EDIT === k_objectName || k_INTERFACE_EDITOR_NAMES.k_ETHERNET.k_VIEW === k_objectName,
k_isPppoe = k_INTERFACE_EDITOR_NAMES.k_PPPOE.k_ADD === k_objectName || k_INTERFACE_EDITOR_NAMES.k_PPPOE.k_EDIT === k_objectName || k_INTERFACE_EDITOR_NAMES.k_PPPOE.k_VIEW === k_objectName,
k_isPptp  = k_INTERFACE_EDITOR_NAMES.k_PPTP.k_ADD === k_objectName || k_INTERFACE_EDITOR_NAMES.k_PPTP.k_EDIT === k_objectName || k_INTERFACE_EDITOR_NAMES.k_PPTP.k_VIEW === k_objectName,
k_isL2tp  = k_INTERFACE_EDITOR_NAMES.k_L2TP.k_ADD === k_objectName || k_INTERFACE_EDITOR_NAMES.k_L2TP.k_EDIT === k_objectName || k_INTERFACE_EDITOR_NAMES.k_L2TP.k_VIEW === k_objectName,
k_isRas  = k_INTERFACE_EDITOR_NAMES.k_RAS.k_EDIT === k_objectName || k_INTERFACE_EDITOR_NAMES.k_RAS.k_VIEW === k_objectName,
k_isDialIn  = k_INTERFACE_EDITOR_NAMES.k_DIAL_IN.k_EDIT === k_objectName || k_INTERFACE_EDITOR_NAMES.k_DIAL_IN.k_VIEW === k_objectName,
k_isEthernetOnWindows = k_isEthernet && k_isWindows,
k_isWifi = k_INTERFACE_EDITOR_NAMES.k_WIFI.k_ADD === k_objectName || k_INTERFACE_EDITOR_NAMES.k_WIFI.k_EDIT === k_objectName || k_INTERFACE_EDITOR_NAMES.k_WIFI.k_VIEW === k_objectName,
k_isEthernetOnLinux = k_isEthernet && k_isLinux,
k_isEthernetOrWifi = k_isEthernetOnLinux || k_isWifi,
k_isAddMode = k_INTERFACE_EDITOR_NAMES.k_PPTP.k_ADD === k_objectName || k_INTERFACE_EDITOR_NAMES.k_L2TP.k_ADD === k_objectName || k_INTERFACE_EDITOR_NAMES.k_PPPOE.k_ADD === k_objectName || k_INTERFACE_EDITOR_NAMES.k_WIFI.k_ADD === k_objectName,
k_hasAdvancedButton = k_isRas || k_isPppoe || k_isPptp || k_isL2tp || k_isEthernetOnLinux || k_isWifi,
k_enableRowItems = [],
k_enableWifiItem = [],
k_rowHeight         = 24,
k_generalFormHeight = 24 + 6, k_tabPagesHeight    = 60, k_bottomFormHeight  = 35, k_labelWidth = 150,
k_title,
k_CONNECTIVITY_ITEM_IDS,
k_generalForm, k_generalFormCfg,
k_ipv4Form, k_ipv4FormCfg,
k_ipv6Form, k_ipv6FormCfg,
k_dialingForm, k_dialingFormCfg,
k_vlanForm, k_vlanFormCfg,
k_bottomForm, k_bottomFormCfg,
k_tabPage, k_tabPageCfg,
k_layout,
k_dialog, k_dialogCfg,
k_dialogHeight,
k_formManager,
k_i, k_cnt,
k_itemsChangedByObserver,
k_content,
k_formManagerForms,
k_ip6ModeData;
k_isPptp = k_isPptp || k_isL2tp;
if (k_isLinux) {
if (k_isEthernetOnLinux) {
k_generalFormHeight += 160;
k_tabPagesHeight += 8 * k_rowHeight; }
else {
k_generalFormHeight += 130;
k_tabPagesHeight += 9 * k_rowHeight; k_tabPagesHeight += 10; }
k_ip6ModeData = [{
k_caption: k_tr('Manual', 'interfaceEditor'),
k_value: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeManual
},
{
k_caption: k_tr('Link-Local only', 'interfaceEditor'),
k_value: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeLinkLocal
}
];
if (!k_isWifi) {
k_ip6ModeData.unshift({
k_caption: k_tr('Automatic', 'interfaceEditor'),
k_value: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeAutomatic
});
}
}
else { k_generalFormHeight += 130;
if (k_isEthernetOnWindows) {
k_tabPagesHeight += 5 * k_rowHeight + 55; k_bottomFormHeight = 0;
}
else if (k_isRas) {
k_tabPagesHeight += 10 * k_rowHeight; }
else { k_tabPagesHeight = 0;
k_bottomFormHeight = 5; }
}
k_WAW_CONSTANTS.k_CONNECTIVITY_ITEM_IDS = {
k_CONNECTIVITY_PARAMS: k_CONNECTIVITY_PARAMS,
k_FAILOVER_ID: k_FAILOVER_ID,
Failover: {
k_ID: k_CONNECTIVITY_PARAMS + '.' + k_FAILOVER_ID,
k_CONTAINER: k_CONNECTIVITY_PARAMS + '.' + k_FAILOVER_ID + k_CONTAINER_POSTFIX,
k_INNER_CONTAINER: k_CONNECTIVITY_PARAMS + '.' + k_FAILOVER_ID + k_INNER_CONTAINER_POSTFIX
},
LoadBalancing: {
k_ID: k_LOAD_BALANCING_ID,
k_CONTAINER: k_LOAD_BALANCING_ID + k_CONTAINER_POSTFIX,
k_INNER_CONTAINER: k_LOAD_BALANCING_ID + k_INNER_CONTAINER_POSTFIX
},
DialOnDemand: {
k_ID: k_DIAL_ON_DEMAND_ID,
k_CONTAINER: k_DIAL_ON_DEMAND_ID + k_CONTAINER_POSTFIX
}
};
k_CONNECTIVITY_ITEM_IDS = k_WAW_CONSTANTS.k_CONNECTIVITY_ITEM_IDS;
k_generalFormCfg = {
k_useStructuredData: true,
k_restrictBy: {
k_serverOs: (k_isLinux ? k_OS_LINUX : k_OS_WINDOWS),
k_isEthernetOnLinux: k_isEthernetOnLinux,
k_isEthernetOrWifi: k_isEthernetOrWifi,
k_isWifi: k_isWifi,
k_isAuditor: k_isAuditor
},
k_labelWidth: k_labelWidth,
k_height: k_generalFormHeight,
k_items: [
{
k_type: 'k_fieldset',
k_id: 'k_generalContainer',
k_caption: k_tr('General', 'interfaceEditor'),
k_height: k_generalFormHeight - 33, k_items: [
{
k_id: 'name',
k_caption: k_tr('Name:', 'common'),
k_value: '',
k_maxLength: 127,
k_checkByteLength: true,
k_isReadOnly: k_isDialIn,
k_validator: {
k_allowBlank: false
},
k_onChange: function() {
this.k_markInvalid(false);
}
},
k_WAW_DEFINITIONS.k_interfaceGroupSelector({

k_onChange: function(k_form, k_element, k_group){
var k_dialog = k_form.k_dialog;
k_dialog.k_enableConnectivityTypeFieldsets(k_dialog.k_formManager, k_dialog.k_connectivityType, k_group);
}
}),
{
k_type: 'k_row',
k_id: 'k_enableRow',
k_restrictions: {
k_serverOs: [ k_OS_LINUX ],
k_isEthernetOrWifi: [ true ]
},
k_items: k_isWifi ? k_enableWifiItem : k_enableRowItems },
{
k_type: 'k_display',
k_restrictions: {
k_isWifi: [ true ],
k_isAuditor: [ false ]
},
k_isSecure: true,
k_value: '<a>' + k_tr('View WiFi SSID settings', 'wifi') + '</a>',
k_onLinkClick: function(k_form) {
var
k_dialog = k_form.k_dialog,
k_interfaceGrid = k_dialog.k_relatedGrid,
k_ssids = k_interfaceGrid.k_form.k_wifiConfig.config.ssids,
k_cnt = k_ssids.length,
k_i, k_ssid;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_ssid = k_ssids[k_i];
if (k_ssid.id === k_dialog.k_dataStore.ssidId) {
break;
}
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'interfaceWifiSsidEditor',
k_objectName: 'ssidInPlaceView',
k_params: {
k_data: k_ssid
}
});
}
},
k_WAW_DEFINITIONS.k_get('k_interfaceFailoverSettings'),      k_WAW_DEFINITIONS.k_get('k_interfaceLoadBalancingSettings'), k_WAW_DEFINITIONS.k_get('k_interfaceDialOnDemandSettings')   ]
}
]
}; k_itemsChangedByObserver = [
'k_encapCaption',
k_CONNECTIVITY_ITEM_IDS.Failover.k_CONTAINER,
k_CONNECTIVITY_ITEM_IDS.LoadBalancing.k_CONTAINER,
k_CONNECTIVITY_ITEM_IDS.DialOnDemand.k_CONTAINER,
'k_disableAllIpv4',
'k_disableAllIpv6',
'k_disableAllDialing',
'k_disableAllBottom'
];
if (!k_isAuditor) {
k_itemsChangedByObserver.push('encap');
}
k_enableWifiItem.push({
k_type: 'k_checkbox',
k_id: 'enabled',
k_isLabelHidden: true,
k_option: k_tr('Enable this WiFi interface', 'interfaceEditor'),
k_onChange: k_WAW_METHODS.k_enableCheckboxObserver(k_itemsChangedByObserver)
});
k_enableRowItems.push({
k_type: 'k_checkbox',
k_id: 'enabled',
k_isLabelHidden: true,
k_option: k_tr('Enable this interface', 'interfaceEditor'),
k_onChange: k_WAW_METHODS.k_enableCheckboxObserver(k_itemsChangedByObserver)
});
k_enableRowItems.push('->');
if (k_isEthernetOnLinux) {
if (kerio.lib.k_isMSIE7) {
k_enableRowItems.push({
k_type: 'k_display',
k_id: 'k_encapCaption',
k_isDisabled: true,
k_value: k_tr('Mode:', 'interfaceEditor')
});
k_enableRowItems.push({
k_type: 'k_select',
k_id: 'encap',
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_value: k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapNative,
k_localData: [
{
k_caption: k_tr('Native', 'interfaceEditor'),
k_value: k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapNative
},
{
k_caption: k_tr('PPPoE', 'interfaceEditor'),
k_value: k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe
}
],
k_onChange: this.k_switchEncapsulation
});
}
else {
k_enableRowItems.push({
k_type: 'k_display',
k_id: 'k_encapCaption',
k_isDisabled: true,
k_value: k_tr('Mode:', 'interfaceEditor')
});
k_enableRowItems.push({
k_type: 'k_buttonBar',
k_id: 'encap',
k_value: k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapNative,
k_items: [
{
k_id: k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapNative,
k_caption: k_tr('Native', 'interfaceEditor')
},
{
k_id: k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe,
k_caption: k_tr('PPPoE', 'interfaceEditor')
}
],k_onChange: this.k_switchEncapsulation
});
}
}
k_ipv4FormCfg = {
k_restrictBy: {
k_isEthernetOnLinux: k_isEthernetOnLinux,
k_isLinux: k_isLinux,
k_isEthernet: k_isEthernet,
k_isWifi: k_isWifi
},
k_labelWidth: k_labelWidth,
k_items: [
{
k_type: 'k_container',
k_id: 'k_disableAllIpv4',
k_isDisabled: k_isLinux,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'ip4Enabled',
k_restrictions: {
k_isLinux: [ true ]
},
k_isLabelHidden: true,
k_option: k_tr('Enable', 'interfaceEditor'),
k_onChange: k_WAW_METHODS.k_enableCheckboxObserver([ 'k_ipv4EnableContainer' ])
},
{
k_type: 'k_container',
k_id: 'k_ipv4EnableContainer',
k_isDisabled: k_isLinux,
k_items: [
{
k_type: 'k_select',
k_id: 'mode',
k_caption: k_tr('Configuration:', 'interfaceEditor'),
k_restrictions: {
k_isEthernetOnLinux: [ true ]
},
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_value: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeAutomatic,
k_localData: [
{
k_caption: k_tr('Automatic', 'interfaceEditor'),
k_value: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeAutomatic
},
{
k_caption: k_tr('Manual', 'interfaceEditor'),
k_value: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeManual
}
],

k_onChange: function(k_form, k_element, k_value) {
if (kerio.waw.shared.k_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe === k_form.k_formManager.k_getItem('encap').k_getValue()) {
return; }
var
k_isAuto = (k_form.k_dialog.InterfaceModeType.InterfaceModeAutomatic === k_value),
k_data = k_form.k_getData(true),
k_isAuditor = k_form.k_dialog.k_isAuditor;
k_form.k_setReadOnly(['ip', 'subnetMask'], k_isAuto);
k_form.k_setVisible(['gatewayAutodetected', 'dnsAutodetected'], k_isAuto);
k_form.k_setDisabled(['gateway'], k_isAuto && k_data.gatewayAutodetected);  k_form.k_setDisabled(['dnsServers'], k_isAuto && k_data.dnsAutodetected);
k_form.k_setVisible(['k_btnMultiIp4Edit'], !k_isAuto && !k_isAuditor); k_form.k_setVisible(['k_btnMultiIp4View'], !k_isAuto && k_isAuditor);
}
},
{
k_id: 'ip',
k_caption: k_tr('IP address:', 'interfaceEditor'),
k_maxLength: 15,
k_isReadOnly: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: k_WAW_DEFINITIONS.k_ipv4.k_allowedChars
},

k_onBlur: function(k_form, k_element) {
var k_value = k_element.k_getValue();
kerio.waw.shared.k_methods.k_generateMaskForIp(k_value, { k_form: k_form, k_maskFieldId: 'subnetMask' });
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
},
kerio.waw.shared.k_DEFINITIONS.k_get('k_ipv4MaskField', {
k_id: 'subnetMask',
k_isReadOnly: true
}),
k_WAW_DEFINITIONS.k_get('k_autodetectRow', {
k_fieldId: 'gateway',
k_autodetectId: 'gatewayAutodetected',
k_caption: k_tr('Gateway:', 'interfaceEditor'),
k_isReadOnly: true,
k_restrictions: {
k_isEthernet: [ true ]
}
}),
k_WAW_DEFINITIONS.k_get('k_autodetectRow', {
k_fieldId: 'dnsServers',
k_autodetectId: 'dnsAutodetected',
k_caption: k_tr('DNS server:', 'interfaceEditor'),
k_isReadOnly: false,
k_isList: true,
k_restrictions: {
k_isWifi: [ false ]
}
}),
{
k_type: 'k_row',
k_restrictions: {
k_isEthernet: [ true ]
},
k_items: [
{
k_type: 'k_display', k_value: ' ',
k_isLabelHidden: true,
k_width: k_labelWidth
},
{
k_type: 'k_formButton',
k_caption: k_tr('View Additional IP Addresses…', 'interfaceEditor'),
k_id: 'k_btnMultiIp4View',
k_className: 'lastFormItem',
k_isVisible: false,
k_onClick: this.k_getMultiIpObserver(this.k_IPv4, this.k_VIEW)
},
{
k_type: 'k_formButton',
k_caption: k_tr('Define Additional IP Addresses…', 'interfaceEditor'),
k_id: 'k_btnMultiIp4Edit',
k_className: 'lastFormItem',
k_isVisible: false,
k_onClick: this.k_getMultiIpObserver(this.k_IPv4, this.k_EDIT)
}
] }
] }
] }
] }; k_ipv6FormCfg = {
k_restrictBy: {
k_isEthernetOnLinux: k_isEthernetOnLinux,
k_isEthernetOrWifi: k_isEthernetOrWifi,
k_isLinux: k_isLinux,
k_isEthernet: k_isEthernet,
k_isWifi: k_isWifi
},
k_labelWidth: k_labelWidth,
k_items: [
{
k_type: 'k_display',
k_id: 'k_ipv6Blocked',
k_isSecure: true,
k_height: 55,
k_icon: 'img/warning.png?v=8629',
k_className: 'warningImgIcon',
k_template: '{k_message}<br><a id="k_ipv6Blocked">{k_link}</a>',
k_value: {
k_message: k_tr('IPv6 traffic is blocked.', 'interfaceEditor'),
k_link: k_tr('Go to %1 to allow the IPv6 traffic…', 'interfaceList', {
k_args: [k_tr('Security Settings', 'menuTree')]
})
},
k_onLinkClick: function(k_form, k_element) {
var
k_tr = kerio.lib.k_tr;
kerio.lib.k_confirm(
k_tr('Confirm Action', 'common'),
k_tr('Do you want to close the current dialog and open the %1?', 'statusCurrentScreen', { k_args: [k_tr('Security Settings', 'menuTree')]}),

function(k_response) {
if ('no' === k_response) {
return;
}
this.k_hide();
kerio.waw.status.k_currentScreen.k_gotoNode('securitySettings', 'k_ipv6');
},
k_form.k_dialog
);
}
},
{
k_type: 'k_container',
k_id: 'k_disableAllIpv6',
k_isDisabled: k_isLinux,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'ip6Enabled',
k_isLabelHidden: true,
k_restrictions: {
k_isLinux: [ true ]
},
k_option: k_tr('Enable', 'interfaceEditor'),
k_onChange: k_WAW_METHODS.k_enableCheckboxObserver([ 'k_ipv6EnableContainer' ])
},
{
k_type: 'k_container',
k_id: 'k_ipv6EnableContainer',
k_isDisabled: k_isLinux,
k_items: [
{
k_type: 'k_select',
k_id: 'ip6Mode',
k_caption: k_tr('Configuration:', 'interfaceEditor'),
k_restrictions: {
k_isEthernetOrWifi: [ true ]
},
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_value: k_isWifi ? k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeManual : k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeAutomatic,
k_localData: k_ip6ModeData,

k_onChange: function(k_form, k_element, k_value) {
var
k_MODES = k_form.k_dialog.InterfaceModeType,
k_isAuto = k_MODES.InterfaceModeAutomatic === k_value,
k_isLocal = k_MODES.InterfaceModeLinkLocal === k_value,
k_isAuditor = k_form.k_dialog.k_isAuditor,
k_isWifi = k_form.k_dialog.k_isWifi;
if (!k_isWifi && kerio.waw.shared.k_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe === k_form.k_formManager.k_getItem('encap').k_getValue()) {
return; }
k_form.k_setReadOnly(['k_ip6PrimaryAddress', 'k_ip6PrefixLength', 'ip6Gateway'], k_isAuto);
k_form.k_setVisible(['k_ip6PrimaryAddress', 'k_ip6PrefixLength'], !k_isLocal);
k_form.k_setVisible(['k_btnMultiIp6Edit','k_btnMultiIp6View'], false); k_form.k_setVisible(['k_btnMultiIp6Edit'], !k_isAuto && !k_isLocal && !k_isAuditor); k_form.k_setVisible(['k_btnMultiIp6View'], k_isAuto || k_isAuditor);
}
},
{
k_id: 'k_ip6PrimaryAddress', k_caption: k_tr('IP address:', 'interfaceEditor'),
k_maxLength: 39, k_isReadOnly: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpv6Address',
k_inputFilter: k_WAW_DEFINITIONS.k_ipv6.k_allowedChars
},

k_onBlur: function(k_form, k_element) {
var k_value = k_element.k_getValue();
kerio.waw.shared.k_methods.k_generateMaskForIpv6(k_value, { k_form: k_form, k_maskFieldId: 'k_ip6PrefixLength' });
},
k_onChange: k_WAW_METHODS.k_allowOnlyIpv6Chars
},
{
k_id: 'k_ip6PrefixLength', k_caption: k_tr('Prefix length:', 'interfaceEditor'),
k_type: 'k_number',
k_isReadOnly: true,
k_minValue: 1,
k_maxValue: 128,
k_maxLength: 3,
k_validator: {
k_allowBlank: false
}
},
{
k_id: 'ip6Gateway',
k_caption: k_tr('Gateway:', 'interfaceEditor'),
k_maxLength: 39, k_isReadOnly: true,
k_restrictions: {
k_isEthernet: [ true ],
k_isWifi: [false]
},
k_validator: {
k_allowBlank: true,
k_functionName: 'k_isIpv6Address',
k_inputFilter: k_WAW_DEFINITIONS.k_ipv6.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv6Chars
},
{
k_id: 'linkIp6Address',
k_caption: k_tr('Link-local address:', 'interfaceEditor'),
k_isReadOnly: true
},
k_WAW_DEFINITIONS.k_get('k_autodetectRow', {
k_fieldId: 'routedIp6Prefix',
k_autodetectId: 'routedIp6PrefixAutodetected',
k_caption: k_tr('Routed prefix:', 'interfaceEditor'),
k_isReadOnly: true,
k_isIpv6: true,
k_restrictions: {
k_isWifi: [ false ]
}
}),
{
k_type: 'k_row',
k_restrictions: {
k_isEthernet: [ true ]
},
k_items: [
{
k_type: 'k_display', k_value: ' ',
k_isLabelHidden: true,
k_width: k_labelWidth
},
{
k_type: 'k_formButton',
k_caption: k_tr('View Additional IP Addresses…', 'interfaceEditor'),
k_id: 'k_btnMultiIp6View',
k_className: 'lastFormItem',
k_isVisible: false,
k_onClick: this.k_getMultiIpObserver(this.k_IPv6, this.k_VIEW)
},
{
k_type: 'k_formButton',
k_caption: k_tr('Define Additional IP Addresses…', 'interfaceEditor'),
k_id: 'k_btnMultiIp6Edit',
k_className: 'lastFormItem',
k_isVisible: false,
k_onClick: this.k_getMultiIpObserver(this.k_IPv6, this.k_EDIT)
}
] }
] },
{
k_type: 'k_display',
k_id: 'k_noIpv6Support',
k_indent: 1,
k_icon: 'img/warning.png?v=8629',
k_className: 'warningImgIcon',
k_value: k_tr('IPv6 is not supported on this system.', 'interfaceEditor')
}
]
} ] }; k_vlanFormCfg = {
k_restrictBy: {
k_isLinux: k_isLinux
},
k_useStructuredData: true,
k_items: [
{
k_type: 'k_container',
k_id: 'k_trunkContainer',
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Subinterfaces on this port:', 'interfaceEditor')
},
{
k_id: 'k_vlanIds',
k_caption: k_tr('VLAN IDs:', 'interfacePortEditor'),
k_isReadOnly: true
},
{
k_type: 'k_display',
k_id: 'k_setUpPortLink',
k_isLabelHidden: true,
k_template: ' <a>{k_link}</a>',
k_isVisible: !k_isAuditor,
k_value: {
k_link: k_tr('Add or remove VLANs…', 'interfaceEditor')
},
k_onLinkClick: function(k_form) {
var
k_dialog = k_form.k_dialog;
if (k_dialog.k_isChanged() || kerio.waw.status.k_currentScreen.k_isContentChanged()) {
kerio.lib.k_alert({
k_msg: kerio.lib.k_tr('Please, apply your current changes first.', 'interfaceEditor'),
k_icon: 'warning'
});
return;
}
k_dialog.k_hide();
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'interfacePortEditor',
k_params: {
k_data: k_dialog.k_interfaceListWidget.k_portListMapped[k_dialog.k_dataStore.ports[0]],
k_rowIndex: null,
k_parentWidget: k_dialog.k_relatedGrid
}
});
}}
]
},
{
k_type: 'k_container',
k_id: 'k_vlanContainer',
k_items: [
{
k_id: 'k_physicalPort',
k_caption: k_tr('Physical port:', 'interfacePortEditor'),
k_isReadOnly: true
},
{
k_id: 'vlanId',
k_caption: k_tr('VLAN ID:', 'interfacePortEditor'),
k_isReadOnly: true
}
]
}
]
};
k_dialingFormCfg = {
k_restrictBy: {
k_isEthernetOnLinux: k_isEthernetOnLinux,
k_isPppoe: k_isPppoe,
k_isPptp: k_isPptp,
k_isRas: k_isRas
},
k_useStructuredData: true,
k_labelWidth: k_labelWidth,
k_items: [
{
k_type: 'k_container',
k_id: 'k_disableAllDialing',
k_items: [
{
k_id: 'ras.pppoeIfaceId',
k_type: 'k_select',
k_restrictions: {
k_isPppoe: [ true ]
},
k_caption: k_tr('Interface:', 'interfaceEditor'),
k_localData: [],
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id'
},
{
k_id: 'ras.server',
k_restrictions: {
k_isPptp: [ true ]
},
k_caption: k_isL2tp ? k_tr('L2TP server:', 'interfaceEditor') : k_tr('PPTP server:', 'interfaceEditor'),
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_hasNoSpaces'
}
},
{
k_id: 'ras.entryName',
k_type: 'k_display',
k_restrictions: {
k_isRas: [ true ]
},
k_isReadOnly: true,
k_caption: k_tr('System connection:', 'interfaceEditor')
},
{ k_restrictions: {
k_isPppoe: [ true ],
k_isPptp: [ true ],
k_isRas: [ true ]
},
k_type: 'k_display'
},
{
k_id: 'ras.useOwnCredentials',
k_type: 'k_checkbox',
k_restrictions: {
k_isRas: [ true ]
},
k_isLabelHidden: true,
k_option: k_tr('Override system-stored credentials:', 'interfaceEditor'),
k_onChange: k_WAW_METHODS.k_enableCheckboxObserver(['ras.credentials.userName', 'ras.credentials.password'])
},
k_WAW_DEFINITIONS.k_get('k_userNameField', {k_width: 'auto', k_id: 'ras.credentials.userName', k_isDisabled: k_isWindows, k_indent: k_isLinux ? 0 : 1, k_validator: { k_functionName: 'k_isUserNameDomain' }}),
k_WAW_DEFINITIONS.k_get('k_passwordField', {k_width: 'auto', k_id: 'ras.credentials.password', k_isDisabled: k_isWindows, k_indent: k_isLinux ? 0 : 1}),
{ k_type: 'k_display'
},
{
k_id: 'k_containerKeepConnected',
k_type: 'k_container',
k_restrictions: {
k_isEthernetOnLinux: [ false ]
},
k_items: [
{
k_id: 'ras.connectTime.enabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Keep connected in the following time interval:', 'interfaceEditor'),
k_onChange: k_WAW_METHODS.k_enableCheckboxObserver('k_connectTime')
},
{
k_type: 'k_definitionSelect',
k_id: 'k_connectTime',
k_isDisabled: true,
k_indent: 1,
k_width: '100%',
k_isLabelHidden: true,
k_definitionType: 'k_timeRange',
k_showApplyReset: true,
k_allowFiltering: true,
k_pageSize: 500,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: [{
k_id: kerio.waw.shared.k_CONSTANTS.k_NONE,
k_name: k_tr('Always', 'timeRangeList')
}],
k_onApplyResetHandler: kerio.waw.shared.k_methods.k_definitionApplyResetHandler
}
]
}, {
k_id: 'k_containerKeepDisconnected',
k_type: 'k_container',
k_items: [
{
k_id: 'ras.noConnectTime.enabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Keep disconnected in the following time interval:', 'interfaceEditor'),
k_onChange: k_WAW_METHODS.k_enableCheckboxObserver('k_disconnectTime')
},
{
k_type: 'k_definitionSelect',
k_id: 'k_disconnectTime',
k_isDisabled: true,
k_indent: 1,
k_width: '100%',
k_isLabelHidden: true,
k_definitionType: 'k_timeRange',
k_showApplyReset: true,
k_allowFiltering: true,
k_pageSize: 500,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: [{
k_id: kerio.waw.shared.k_CONSTANTS.k_NONE,
k_name: k_tr('Always', 'timeRangeList')
}],
k_onApplyResetHandler: kerio.waw.shared.k_methods.k_definitionApplyResetHandler
}
]
}, {
k_id: 'k_containerIdleHangup',
k_type: 'k_columns',
k_className: 'lastFormItem',
k_restrictions: {
k_isEthernetOnLinux: [ false ]
},
k_items: [
{
k_id: 'ras.timeout.enabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Hangup if idle for ', 'interfaceEditor'),
k_onChange: k_WAW_METHODS.k_enableCheckboxObserver('ras.timeout.value')
},
{
k_id: 'ras.timeout.value',
k_type: 'k_number',
k_isLabelHidden: true,
k_isDisabled: true,
k_value: 0,
k_minValue: 1,
k_maxValue: 99999,
k_maxLength: 5,
k_width: 50
},
{
k_id: 'k_timeoutUnits',
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('minutes.', 'interfaceEditor')
}
]
} ]
} ] }; k_bottomFormCfg = {
k_className: 'interfaceEditorAdvanced',
k_height: k_bottomFormHeight,
k_items: [
{
k_type: 'k_row',
k_id: 'k_disableAllBottom',
k_isDisabled: !k_isRas, k_items: [
'->',
{
k_restrictBy: {
k_hasAdvancedButton: [ true ]
},
k_type: 'k_formButton',
k_id: 'k_btnAdvanced',
k_caption: k_tr('Advanced…', 'interfaceEditor'),
k_onClick: function(k_form) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_dialog = k_form.k_dialog,
k_dataStore = k_dialog.k_dataStore,
k_formData = k_dialog.k_formManager.k_getData(true),
k_isLinux = k_dialog.k_isLinux,
k_sourceName = 'interfaceRasAdvancedEditor',
k_objectName = '',
k_isPppoeEncap = false;
if (k_isLinux) {
if (k_WAW_CONSTANTS.InterfaceType.Ras === k_dataStore.type) {
if (k_WAW_CONSTANTS.RasType.PPPoE === k_dataStore.ras.rasType) {
k_objectName = 'interfaceRasAdvancedPppoe';
}
else {
if (k_WAW_CONSTANTS.RasType.PPTP === k_dataStore.ras.rasType) {
k_objectName = 'interfaceRasAdvancedPptp';
}
else {
k_objectName = 'interfaceRasAdvancedL2tp';
}
}
}
else { if (k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe === k_formData.encap) {
k_isPppoeEncap = true;
}
k_objectName = 'interfaceRasAdvancedEth';
}
}
else { k_sourceName = 'interfaceRasScriptsEditor';
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: k_sourceName,
k_objectName: k_objectName,
k_params: {
k_parent: k_dialog,
k_callback: k_dialog.k_saveAdvancedData.createDelegate(k_dialog, [], true),
k_data: k_dataStore,
k_isPppoeEncap: k_isPppoeEncap
}
});
}
}
]
}
]
};
if (k_showAllInTabs) {
k_generalFormCfg.k_items.push(k_bottomFormCfg.k_items[0]);
}
k_generalForm = new k_lib.K_Form(k_localNamespace + 'k_generalForm', k_generalFormCfg);
k_dialingForm = new k_lib.K_Form(k_localNamespace + 'k_dialingForm', k_dialingFormCfg);
k_ipv4Form    = new k_lib.K_Form(k_localNamespace + 'k_ipv4Form'   , k_ipv4FormCfg   );
k_ipv6Form    = new k_lib.K_Form(k_localNamespace + 'k_ipv6Form'   , k_ipv6FormCfg   );
k_bottomForm  = new k_lib.K_Form(k_localNamespace + 'k_bottomForm' , k_bottomFormCfg );
k_vlanForm  = new k_lib.K_Form(k_localNamespace + 'k_vlanForm' , k_vlanFormCfg );
k_dialingForm.k_patchAutoFill();
if (k_isDialIn) {
k_formManagerForms = [k_generalForm];
}
else {
k_formManagerForms = [
k_generalForm,
k_dialingForm,
k_ipv4Form,
k_ipv6Form,
k_vlanForm
];
if (!k_showAllInTabs) {
k_formManagerForms.push(k_bottomForm);
}
}
k_formManager = new k_lib.K_FormManager(k_localNamespace + 'k_formManager', { k_forms: k_formManagerForms });
k_tabPageCfg = {
k_className: 'interfaceEditorTabs', k_height: k_tabPagesHeight,
k_items: [
{
k_content: k_dialingForm,
k_caption: k_tr('Dialing Settings', 'interfaceEditor'),
k_id: 'k_dialingSettingsPage'
},
{
k_content: k_ipv4Form,
k_caption: k_tr('IPv4', 'interfaceEditor'),
k_id: 'k_ipv4Page'
},
{
k_content: k_ipv6Form,
k_caption: k_tr('IPv6', 'interfaceEditor'),
k_id: 'k_ipv6Page'
},
{
k_content: k_vlanForm,
k_caption: k_tr('VLAN', 'interfaceEditor'),
k_id: 'k_vlanPage'
}
]
}; if (k_showAllInTabs) {
k_tabPageCfg.k_items.unshift({
k_id: 'k_generalPage',
k_content: k_generalForm,
k_caption: k_tr('General', 'interfaceVpnTunnelEditor')
});
}
k_tabPage = new k_lib.K_TabPage(k_localNamespace + 'k_tabPage', k_tabPageCfg);
if (!k_showAllInTabs) {
k_layout = new kerio.lib.K_Layout(k_localNamespace + 'k_layout', {
k_restrictBy: {
k_hasAdvancedButton: k_hasAdvancedButton
},
k_verLayout: {
k_items: [
{
k_content: k_generalForm,
k_iniSize: k_generalFormHeight
},
{
k_content: k_tabPage
},
{
k_restrictions: {
k_hasAdvancedButton: [ true ]
},
k_content: k_bottomForm,
k_iniSize: k_bottomFormHeight
}
]
}
});
}
if (k_isLinux) {
if (k_isPppoe) {
k_title = k_tr('PPPoE Interface Properties', 'interfaceEditor');
}
else if (k_isPptp) {
k_title = k_isL2tp ? k_tr('L2TP Interface Properties', 'interfaceEditor') : k_tr('PPTP Interface Properties', 'interfaceEditor');
}
else if (k_isWifi) {
k_title = k_tr('WiFi Interface Properties', 'interfaceEditor');
}
else {
k_title = k_tr('Ethernet Interface Properties', 'interfaceEditor');
}
}
else {
if (k_isRas) {
k_title = k_tr('Dial-Up Interface Properties', 'interfaceEditor');
}
else if (k_isDialIn) {
k_title = k_tr('Dial-In Interface Properties', 'interfaceEditor');
}
else {
k_title = k_tr('Ethernet Interface Properties', 'interfaceEditor');
}
}
if (k_isDialIn) {
k_content = k_generalForm;
}
else if (k_showAllInTabs) {
k_content = k_tabPage;
}
else {
k_content = k_layout;
}
if (k_showAllInTabs) {
k_dialogHeight = Math.max(k_generalFormHeight, k_tabPagesHeight) + k_bottomFormHeight + 70;
}
else {
k_dialogHeight = k_generalFormHeight + k_tabPagesHeight + k_bottomFormHeight + 70;
}
k_dialogCfg = {
k_width: 500,
k_height: k_dialogHeight, k_content: k_content,
k_title: k_title,
k_defaultItem: null, 
k_onOkClick: function(k_toolbar){
var k_dialog = k_toolbar.k_dialog;
k_dialog.k_sendData();
k_dialog.k_inputPassword.k_setAllowBlank(true);
},
k_onCancelClick: function(k_toolbar) {
var k_dialog = k_toolbar.k_dialog;
k_dialog.k_inputPassword.k_setAllowBlank(true);
k_dialog.k_hide();
}
};
k_dialogCfg = k_WAW_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
this.k_addControllers(k_dialog);
if (k_isAuditor) {
this.k_switchToAuditor(k_formManager);
}
k_dialog.k_addReferences({
k_isAuditor: k_isAuditor,
k_isLinux: k_isLinux,
k_tabPage: k_tabPage,
k_showAllInTabs: k_showAllInTabs,
k_formManager: k_formManager,
k_switchEncapsulation: this.k_switchEncapsulation,
k_setMultiIpData: this.k_setMultiIpData,
k_saveAdvancedData: this.k_saveAdvancedData,
k_enableConnectivityTypeFieldsets: this.k_enableConnectivityTypeFieldsets,
InterfaceModeType: k_WAW_CONSTANTS.InterfaceModeType,
k_connectivityType: '',
k_relatedGrid: null,
k_dataStore: [],
k_isEthernetOnWindows: k_isEthernetOnWindows,
k_isEthernetOnLinux: k_isEthernetOnLinux,
k_isEthernet: k_isEthernet,
k_isWifi: k_isWifi,
k_isRas: k_isRas,
k_isPppoe: k_isPppoe,
k_isPptp: k_isPptp,
k_isL2tp: k_isL2tp,
k_isDialIn: k_isDialIn,
k_selectIpv4ConfigMode: k_isLinux ? k_ipv4Form.k_getItem('mode') : null,
k_selectIpv6ConfigMode: k_isLinux ? k_ipv6Form.k_getItem('ip6Mode') : null,
k_selectConnectTime: k_dialingForm.k_getItem('k_connectTime'),
k_selectDisconnectTime: k_dialingForm.k_getItem('k_disconnectTime'),
k_selectInterface: k_isPppoe ? k_dialingForm.k_getItem('ras.pppoeIfaceId') : null,
k_inputPassword: k_dialingForm.k_getItem('ras.credentials.password'),
k_nameField: k_generalForm.k_getItem('name'),
k_isAddMode: k_isAddMode,
k_trNone: k_tr('None', 'common'),
k_interfaceListWidget: {},
k_ENGINE_ERROR_IFACE_NAME_EXISTS: 1001 });
for (k_i = 0, k_cnt = k_formManager.k_forms.length; k_i < k_cnt; k_i++) {
k_formManager.k_forms[k_i].k_addReferences({
k_isAuditor: k_isAuditor,
k_isLinux: k_isLinux,
k_dialog: k_dialog,
k_tabPage: k_tabPage, k_isEthernetOnWindows: k_isEthernetOnWindows,
k_isRas: k_isRas
});
}
k_formManager.k_canDialOnDemand = !k_isEthernet && !k_isDialIn; return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_WAW_METHODS = k_shared.k_methods,
k_CONNECTIVITY_ITEM_IDS = k_WAW_CONSTANTS.k_CONNECTIVITY_ITEM_IDS,
k_isWifiAvailable = k_WAW_METHODS.k_isWifiAvailable(),
k_ipv6Support = k_WAW_METHODS.k_isIpv6Available(),
k_isIpv6Blocked = k_params.k_isIpv6Blocked,
k_formManager = this.k_formManager,
k_setMtuOverrideValue = false,
k_ip6PrimaryAddress,
k_data,
k_title,
k_isVlanTrunk,
k_isVlanAvailable,
k_vlans,
k_portId;
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_connectivityType = k_params.k_relatedGrid.k_connectivityType;
if (this.k_isAddMode) {
k_data = k_shared.k_DEFINITIONS.k_get('k_predefinedInterface');
k_setMtuOverrideValue = true;
if (this.k_isPptp) { k_data.ras.rasType = this.k_isL2tp ? k_WAW_CONSTANTS.RasType.L2TP : k_WAW_CONSTANTS.RasType.PPTP;
if (this.k_isL2tp) {
k_data.ras.mppe = k_WAW_CONSTANTS.MppeType.MppeDisabled;
}
}
if (this.k_isWifi) {
k_data.type = 'Wifi';
}
} else {
k_data = kerio.lib.k_cloneObject(k_params.k_data);
if (true !== k_data.mtuOverride.enabled) {
k_setMtuOverrideValue = true;
}
}
this.k_dataStore = k_data;
if (k_setMtuOverrideValue) {
if (this.k_isPptp) {
if (this.k_isL2tp) {
k_data.mtuOverride.value = k_WAW_CONSTANTS.k_INTERFACE_RAS_MTU_MAX.k_L2TP;
}
else {
k_data.mtuOverride.value = k_WAW_CONSTANTS.k_INTERFACE_RAS_MTU_MAX.k_PPTP;
}
}
else {
if (this.k_isPppoe) {
k_data.mtuOverride.value = k_WAW_CONSTANTS.k_INTERFACE_RAS_MTU_MAX.k_PPPoE;
}
}
}
if (!this.k_isEthernetOnWindows) {
this.k_loadDefinitionGroups();
}
k_isVlanAvailable = this.k_isEthernetOnLinux && !k_data.flags.virtualSwitch;
this.k_tabPage.k_setVisibleTab('k_vlanPage', k_isVlanAvailable);
this.k_interfaceListWidget = this.k_relatedGrid.k_parentWidget.k_parentWidget;
if (k_isVlanAvailable) {
k_isVlanTrunk = !k_data.flags.vlan;
k_portId = k_data.ports[0];
k_formManager.k_setVisible('k_trunkContainer', k_isVlanTrunk);
k_formManager.k_setVisible('k_vlanContainer', !k_isVlanTrunk);
k_data.k_physicalPort = this.k_trNone;
if (0 === k_data.vlanId) {
k_data.vlanId = '';
}
if (k_isVlanTrunk) {
k_data.k_vlanIds = '';
if (k_portId) {
k_vlans = this.k_interfaceListWidget.k_portListMapped[k_portId].vlans;
k_data.k_vlanIds = k_vlans.enabled ? k_vlans.value : '';
}
k_formManager.k_setDisabled('k_setUpPortLink', undefined === k_portId);
if ('' === k_data.k_vlanIds) {
k_data.k_vlanIds = this.k_trNone;
}
} else if (k_portId) {
k_data.k_physicalPort = this.k_interfaceListWidget.k_portListMapped[k_portId].name;
}
}
if (this.k_isEthernetOnLinux) {
if (k_data.flags.virtualSwitch) {
if (k_isWifiAvailable) {
k_title = kerio.lib.k_tr('LAN Switch and WiFi Properties', 'interfaceEditor');
}
else {
k_title = kerio.lib.k_tr('LAN Switch Properties', 'interfaceEditor');
}
}
else if (k_data.flags.vlan) {
k_title = kerio.lib.k_tr('VLAN Properties', 'interfaceEditor');
}
else {
k_title = kerio.lib.k_tr('Ethernet Interface Properties', 'interfaceEditor');
}
this.k_setTitle(k_title);
}
k_formManager.k_setVisible('k_ipv6EnableContainer', k_ipv6Support);
k_formManager.k_setVisible('k_noIpv6Support', !k_ipv6Support);
k_formManager.k_setVisible('k_ipv6Blocked', k_ipv6Support && k_isIpv6Blocked);
k_formManager.k_setReadOnly('ip6Enabled', !k_ipv6Support);
if (this.k_isEthernet) {
this.k_switchEncapsulation(this, null, k_data.encap);
}
else if (this.k_isWifi) {
this.k_tabPage.k_setActiveTab('k_ipv4Page');
this.k_tabPage.k_setVisibleTab('k_dialingSettingsPage', false);
k_formManager.k_setReadOnly( ['ip', 'subnetMask'], false);
k_formManager.k_setReadOnly( ['k_ip6PrimaryAddress', 'k_ip6PrefixLength'], false);
}
if (!this.k_showAllInTabs && (this.k_isRas || this.k_isPppoe || this.k_isPptp) && !this.k_isWifi) {
this.k_tabPage.k_setActiveTab('k_dialingSettingsPage');
}
if (this.k_isPppoe || this.k_isPptp) {
this.k_formManager.k_setDisabled([ 'k_disableAllIpv4',
'k_disableAllIpv6',
'k_disableAllDialing',
'k_disableAllBottom'
], false);
}
if (k_data.ip6Addresses && Array === k_data.ip6Addresses.constructor) {
k_ip6PrimaryAddress = k_data.ip6Addresses[0];
if (k_ip6PrimaryAddress) {
k_data.k_ip6PrimaryAddress = k_ip6PrimaryAddress.ip;
k_data.k_ip6PrefixLength = k_ip6PrimaryAddress.prefixLength;
}
}
if (k_WAW_CONSTANTS.FailoverRoleType.None === k_data[k_CONNECTIVITY_ITEM_IDS.k_CONNECTIVITY_PARAMS][k_CONNECTIVITY_ITEM_IDS.k_FAILOVER_ID]) {
k_data[k_WAW_CONSTANTS.k_CONNECTIVITY_ITEM_IDS.Failover.k_ID] = {
enabled: false,
value: k_WAW_CONSTANTS.FailoverRoleType.Primary
};
}
else {
k_data[k_WAW_CONSTANTS.k_CONNECTIVITY_ITEM_IDS.Failover.k_ID] = {
enabled: true,
value: k_data[k_CONNECTIVITY_ITEM_IDS.k_CONNECTIVITY_PARAMS][k_CONNECTIVITY_ITEM_IDS.k_FAILOVER_ID]
};
}
delete k_data.ras.pppoeIfaceId; k_formManager.k_setData(k_data, true);
this.k_enableConnectivityTypeFieldsets(this.k_formManager, this.k_connectivityType, k_data.group);
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_dialogs: (this.k_isDialIn)
? [] : [
(this.k_isEthernet ? 'interfaceMultipleIpsEditor' : 'interfaceRasScriptsEditor'),
'interfaceRasAdvancedEditor' ]
});
}; 
k_kerioWidget.k_loadDefinitionGroups = function() {
var
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_loader;
if (this.k_selectConnectTime) {
k_loader = new k_WAW_METHODS.K_ListLoader({
k_list:'k_timeRangeList',
k_select: this.k_selectConnectTime,
k_value: this.k_dataStore.ras.connectTime
});
k_loader.k_sendRequest();
}
if (this.k_selectDisconnectTime) {
k_loader = new k_WAW_METHODS.K_ListLoader({
k_list:'k_timeRangeList',
k_select: this.k_selectDisconnectTime,
k_value: this.k_dataStore.ras.noConnectTime
});
k_loader.k_sendRequest();
}
if (this.k_isPppoe) {
k_loader = new k_WAW_METHODS.K_ListLoader({
k_list: 'k_interfacesEthernetList',
k_select: this.k_selectInterface,
k_value: {
k_id: this.k_dataStore.ras.pppoeIfaceId
}
});
k_loader.k_sendRequest();
}
};

k_kerioWidget.k_sendData = function() {
var
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_CONNECTIVITY_ITEM_IDS = k_WAW_CONSTANTS.k_CONNECTIVITY_ITEM_IDS,
k_formData = this.k_formManager.k_getData(true),
k_connectivityParams = k_formData[k_CONNECTIVITY_ITEM_IDS.k_CONNECTIVITY_PARAMS],
k_dataStore = this.k_dataStore;
if (k_formData.k_ip6PrimaryAddress) {
if (k_dataStore.ip6Addresses && 1 < k_dataStore.ip6Addresses.length) { k_formData.ip6Addresses = k_dataStore.ip6Addresses;
k_formData.ip6Addresses[0] = {
ip: k_formData.k_ip6PrimaryAddress,
prefixLength: k_formData.k_ip6PrefixLength
};
}
else { k_formData.ip6Addresses = [{
ip: k_formData.k_ip6PrimaryAddress,
prefixLength: k_formData.k_ip6PrefixLength
}];
}
} if (k_formData.subnetMask) { k_formData.subnetMask = kerio.waw.shared.k_methods.k_convertCidrToMask(k_formData.subnetMask);
}
if (k_connectivityParams[k_CONNECTIVITY_ITEM_IDS.k_FAILOVER_ID] && k_connectivityParams[k_CONNECTIVITY_ITEM_IDS.k_FAILOVER_ID].enabled) {
k_connectivityParams[k_CONNECTIVITY_ITEM_IDS.k_FAILOVER_ID] = k_connectivityParams[k_CONNECTIVITY_ITEM_IDS.k_FAILOVER_ID].value;
}
else {
k_connectivityParams[k_CONNECTIVITY_ITEM_IDS.k_FAILOVER_ID] = k_WAW_CONSTANTS.FailoverRoleType.None;
}
if (undefined !== k_formData.k_connectTime) {
if (k_WAW_CONSTANTS.k_NONE === k_formData.k_connectTime) {
k_formData.ras.connectTime.id = '';
}
else {
k_formData.ras.connectTime.id = k_formData.k_connectTime;
}
}
if (undefined !== k_formData.k_disconnectTime) {
if (k_WAW_CONSTANTS.k_NONE === k_formData.k_disconnectTime) {
k_formData.ras.noConnectTime.id = '';
}
else {
k_formData.ras.noConnectTime.id = k_formData.k_disconnectTime;
}
}
if (this.k_isPppoe) {
if (k_WAW_CONSTANTS.k_NONE === k_formData.ras.pppoeIfaceId) {
k_formData.ras.pppoeIfaceId = '';
}
}
else {
k_formData.ras = k_formData.ras || {}; k_formData.ras.pppoeIfaceId = '';
}
if ('' === this.k_inputPassword.k_getEmptyText()) {
k_dataStore.ras.credentials.passwordChanged = true;
}
k_formData.vlanId = Number(k_formData.vlanId); k_shared.k_methods.k_mergeObjects(k_formData, k_dataStore);
delete k_dataStore.k_ip6PrimaryAddress;
delete k_dataStore.k_ip6PrefixLength;
delete k_dataStore.ip6prefixLength;
delete k_dataStore.k_connectTime;
delete k_dataStore.k_disconnectTime;
delete k_dataStore.k_onDemand;
delete k_dataStore[k_CONNECTIVITY_ITEM_IDS.Failover.k_ID];
delete k_dataStore.k_physicalPort;
delete k_dataStore.k_vlanIds;
delete k_dataStore.vpn;
kerio.waw.shared.k_methods.k_unmaskMainScreen();
if (this.k_isAddMode) {
if (this.k_relatedGrid.k_pendingAutorefreshRequest) { this.k_relatedGrid.k_pendingAutorefreshRequest = false;
}
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Interfaces.create',
params: { list: [k_dataStore] }
},
k_callback: function(k_response, k_success) {
var
k_error;
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
if (!k_success || !k_response.k_isOk) {
return;
}
if (k_response.k_decoded.errors && 0 < k_response.k_decoded.errors.length) {
k_error = k_response.k_decoded.errors[0];
this.k_checkResponseForExistingIfaceName(k_error.code);
return;
}
this.k_relatedGrid.k_reloadData();
kerio.adm.k_framework.k_enableApplyReset();
this.k_hide();
},
k_scope: this
});
} else {
kerio.waw.requests.k_sendInterfaceChange({ ids: [k_dataStore.id], details: k_dataStore }, this, this.k_relatedGrid);
}
}; 
k_kerioWidget.k_resetOnClose = function() {
this.k_formManager.k_reset();
};

k_kerioWidget.k_checkResponseForExistingIfaceName = function(k_errorCode) {
if (this.k_ENGINE_ERROR_IFACE_NAME_EXISTS !== k_errorCode) {
return;
}
this.k_nameField.k_focus();
this.k_nameField.k_markInvalid(true);
};
}, 
k_switchEncapsulation: function(k_form, k_element, k_value) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_dialog = k_form.k_dialog ? k_form.k_dialog : k_form,
k_tabPage = k_form.k_tabPage,
k_formManager = k_form.k_formManager,
k_isPppoe = k_value === k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe,
k_isNative = !k_isPppoe,
k_isLinux = k_dialog.k_isLinux,
k_isWindows = !k_isLinux,
k_isIpv4Automatic = false,
k_isIpv6Automatic = false,
k_isIpv6Manual    = false,
k_isDnsAutodetect = k_formManager.k_getItem('dnsAutodetected').k_getValue(),
k_isAuditor = k_dialog.k_isAuditor,
k_firstTab;
if (k_dialog.k_selectIpv4ConfigMode) {
k_isIpv4Automatic = k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeAutomatic === k_dialog.k_selectIpv4ConfigMode.k_getValue();
}
if (k_dialog.k_selectIpv6ConfigMode) {
k_isIpv6Automatic = k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeAutomatic === k_dialog.k_selectIpv6ConfigMode.k_getValue();
k_isIpv6Manual    = k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeManual    === k_dialog.k_selectIpv6ConfigMode.k_getValue();
}
k_formManager.k_setVisible(['mode', 'ip6Mode'], k_isNative);
k_formManager.k_setVisible(['k_ip6PrimaryAddress', 'k_ip6PrefixLength'], k_isWindows || !k_isNative || (k_isIpv6Automatic || k_isIpv6Manual)); k_formManager.k_setVisible(['gateway' + '_' + 'k_container', 'ip6Gateway'], k_isNative || k_dialog.k_isEthernetOnWindows);
k_formManager.k_setReadOnly( ['ip', 'subnetMask'], k_isPppoe || k_isIpv4Automatic || k_isWindows);
k_formManager.k_setReadOnly( ['k_ip6PrimaryAddress', 'k_ip6PrefixLength'], k_isPppoe || k_isIpv6Automatic || k_isWindows);
if (k_isLinux) {
k_formManager.k_setVisible(['dnsAutodetected'], k_isPppoe || k_isIpv4Automatic);
if (k_isNative && !k_isIpv4Automatic) {
k_formManager.k_setDisabled(['dnsServers'], false);             }
else {
k_formManager.k_setDisabled(['dnsServers'], k_isDnsAutodetect); }
}
k_formManager.k_setVisible(['k_btnMultiIp4Edit'], k_isLinux && !k_isPppoe && !k_isIpv4Automatic && !k_isAuditor);
k_formManager.k_setVisible(['k_btnMultiIp4View'], k_isLinux && !k_isPppoe && !k_isIpv4Automatic && k_isAuditor);
k_formManager.k_setVisible(['k_btnMultiIp6Edit'], k_isLinux && !k_isPppoe && k_isIpv6Manual && !k_isAuditor);
k_formManager.k_setVisible(['k_btnMultiIp6View'], k_isLinux && !k_isPppoe && k_isIpv6Manual && k_isAuditor);
k_tabPage.k_setVisibleTab('k_dialingSettingsPage', k_isPppoe || k_dialog.k_isRas);
if (k_dialog.k_showAllInTabs){
k_firstTab = 'k_generalPage';
}
else if (k_isNative && !k_dialog.k_isRas) {
k_firstTab = 'k_ipv4Page';
}
else {
k_firstTab = 'k_dialingSettingsPage';
}
k_tabPage.k_setActiveTab(k_firstTab);
},

k_setMultiIpData: function(k_data, k_isIpv6) {
var
k_dataStore = this.k_dataStore,
k_formManager = this.k_formManager,
k_primaryAddress;
if (!k_data || !k_data.length) { if (k_isIpv6) {
k_dataStore.ip6Addresses = [];
k_formManager.k_setData({
k_ip6PrimaryAddress: '',
k_ip6PrefixLength: ''
});
}
else { k_dataStore.secondaryAddresses = [];
k_formManager.k_setData({
ip: '',
subnetMask: ''
});
}
this.k_setChanged(true);
return true;
}
k_primaryAddress = (k_isIpv6)
? k_data[0]       : k_data.shift(); k_dataStore[(k_isIpv6 ? 'ip6Addresses' : 'secondaryAddresses')] = k_data; if (k_isIpv6) {
k_formManager.k_setData({
k_ip6PrimaryAddress: k_primaryAddress.ip,
k_ip6PrefixLength: k_primaryAddress.prefixLength
});
}
else { k_formManager.k_setData({
ip: k_primaryAddress.ip,
subnetMask: k_primaryAddress.subnetMask
});
}
this.k_setChanged(true);
return true;
},

k_saveAdvancedData: function(k_data) {
kerio.waw.shared.k_methods.k_mergeObjects(k_data, this.k_dataStore);
this.k_setChanged(true);
},

k_switchToAuditor: function(k_formManager) {
var k_items = k_formManager.k_items;
k_formManager.k_setReadOnly([
'k_generalContainer',
'k_disableAllIpv4',
'k_disableAllIpv6',
'k_disableAllDialing',
'k_disableAllBottom'
]);
if (k_items.k_btnAdvanced) {
k_items.k_btnAdvanced.k_forceSetWritable();
}
if (k_items.k_btnMultiIp4View) {
k_items.k_btnMultiIp4View.k_forceSetWritable();
}
if (k_items.k_btnMultiIp6View) {
k_items.k_btnMultiIp6View.k_forceSetWritable();
}
},
k_IPv4: false,
k_IPv6: true,
k_VIEW: false,
k_EDIT: true,

k_getMultiIpObserver: function(k_closureIsIpv6, k_closureIsEdit) {
return function(k_form) {
var
k_MULTI_IP_IDS = kerio.waw.shared.k_CONSTANTS.k_INTERFACE_EDITOR_NAMES.k_MULTI_IP,
k_objectName = k_MULTI_IP_IDS[(k_closureIsIpv6 ? 'k_IPv6' : 'k_IPv4')][(k_closureIsEdit ? 'k_EDIT' : 'k_VIEW')],
k_listId = (k_closureIsIpv6 ? 'ip6Addresses' : 'secondaryAddresses'),
k_ipId = (k_closureIsIpv6 ? 'k_ip6PrimaryAddress' : 'ip'),
k_maskId = (k_closureIsIpv6 ? 'k_ip6PrefixLength' : 'subnetMask'),
k_dialog = k_form.k_dialog,
k_dataStore = k_dialog.k_dataStore,
k_formData = k_form.k_getData(),
k_list = k_dataStore[k_listId] || [],
k_ip = k_formData[k_ipId],
k_mask = k_formData[k_maskId];
k_list = kerio.lib.k_cloneObject(k_list);
if (k_ip) { if (k_closureIsIpv6) {
k_list[0] = {
ip: k_ip,
prefixLength: k_mask
};
}
else {
k_list.unshift({
ip: k_ip,
subnetMask: k_mask
});
}
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'interfaceMultipleIpsEditor',
k_objectName: k_objectName,
k_params: {
k_data: k_list,
k_callback: (k_closureIsEdit)
? k_dialog.k_setMultiIpData.createDelegate(k_dialog, [k_closureIsIpv6], true)
: undefined, k_parentWidget: k_dialog
}
});
};
}, 
k_enableConnectivityTypeFieldsets: function(k_formObject, k_connectivityType, k_group) {
if (!(k_formObject instanceof kerio.lib.K_Form || k_formObject instanceof kerio.lib.K_FormManager)) {
return;
}
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
ConnectivityType = k_WAW_CONSTANTS.ConnectivityType,
k_CONNECTIVITY_ITEM_IDS = k_WAW_CONSTANTS.k_CONNECTIVITY_ITEM_IDS,
k_fieldsetId, k_disableFieldsetId;
k_formObject.k_setVisible([k_CONNECTIVITY_ITEM_IDS.Failover.k_CONTAINER, k_CONNECTIVITY_ITEM_IDS.LoadBalancing.k_CONTAINER, k_CONNECTIVITY_ITEM_IDS.DialOnDemand.k_CONTAINER], false);
switch (k_connectivityType) {
case ConnectivityType.Failover:
k_fieldsetId = k_CONNECTIVITY_ITEM_IDS.Failover.k_CONTAINER;
k_disableFieldsetId = k_CONNECTIVITY_ITEM_IDS.Failover.k_INNER_CONTAINER;
break;
case ConnectivityType.LoadBalancing:
k_fieldsetId = k_CONNECTIVITY_ITEM_IDS.LoadBalancing.k_CONTAINER;
k_disableFieldsetId = k_CONNECTIVITY_ITEM_IDS.LoadBalancing.k_INNER_CONTAINER;
break;
case ConnectivityType.DialOnDemand:
if (true !== k_formObject.k_canDialOnDemand) {
return;
}
k_fieldsetId = k_CONNECTIVITY_ITEM_IDS.DialOnDemand.k_CONTAINER;
k_disableFieldsetId = k_fieldsetId;
break;
default:
return;} k_formObject.k_setDisabled([k_disableFieldsetId], (k_group !== k_WAW_CONSTANTS.InterfaceGroupType.Internet));
k_formObject.k_setVisible([k_fieldsetId], true);
} }; 