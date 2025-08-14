
kerio.waw.ui.connectivityWizard = {

k_init: function(k_objectName) {
var
k_lib = kerio.lib,
k_localNamespace = k_objectName + '_',
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_isLinux = k_shared.k_methods.k_isLinux(),
k_isBoxEdition = k_shared.k_methods.k_isBoxEdition(),
k_WAW_DEFINITIONS = k_shared.k_DEFINITIONS,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_WINDOWS       = k_WAW_CONSTANTS.k_SERVER.k_OS_WINDOWS,
k_LINUX         = k_WAW_CONSTANTS.k_SERVER.k_OS_LINUX,
k_NO_PAGE       = k_lib.K_Wizard2.prototype.k_NO_PAGE,
k_wizard, k_wizardCfg,
k_getInterfaceSelect,
k_getConnectedInterfaceWarning,
k_onEthernetModeChange,
k_lanPage,
k_interfacesGridCfg,
k_interfacesGrid,
k_incompatiblePage,
k_configuringPage,
k_boxConnections = new kerio.waw.shared.k_widgets.K_BoxConnections(k_localNamespace + 'k_boxConnections');



k_getInterfaceSelect = function(k_onChange, k_config) {
var
k_id;
k_config = k_config || {};
k_id = k_config.k_id ? (k_config.k_id + '_') : '';
return {
k_restrictions: {
k_boxEdition: [ false ]
},
k_type: 'k_select',
k_id: k_id + 'k_interface',
k_caption: kerio.lib.k_tr('Interface:', 'connectivityWizard'),
k_fieldDisplay: 'name',
k_fieldValue: 'id',
k_fieldIconClassName: 'k_icon',
k_listClassName: 'interfaceIcon',
k_localData: [],
k_onChange: k_onChange
};
};

k_getConnectedInterfaceWarning = function(k_id) {
if (k_id && '' !== k_id) {
k_id = k_id + '_';
}
return {
k_type: 'k_display',
k_id: k_id + 'k_connectedInterfaceWarning',
k_value: '<b>' + kerio.lib.k_tr('This is the interface you are currently using to connect to the Kerio Control Administration.', 'connectivityWizard') +'</b>',
k_isSecure: true,
k_indent: 1,
k_isHidden: true
};
};

k_onEthernetModeChange = function(k_form, k_element, k_value) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
InterfaceModeType = k_WAW_CONSTANTS.InterfaceModeType,
InterfaceEncapType = k_WAW_CONSTANTS.InterfaceEncapType,
k_isPppoe = InterfaceEncapType.InterfaceEncapPppoe === k_value,
k_isAuto  = InterfaceModeType.InterfaceModeAutomatic === k_value,
k_prefix = '';
if (-1 !== k_element.k_name.indexOf('k_line1')) {
k_prefix = 'k_line1' + '_';
} else if (-1 !== k_element.k_name.indexOf('k_line2')) {
k_prefix = 'k_line2' + '_';
}
k_form.k_setVisible([k_prefix + 'k_networkSettings'], !k_isPppoe && !k_isAuto);
k_form.k_setVisible([k_prefix + 'k_dhcpIpInfo'], k_isAuto);
k_form.k_setVisible([k_prefix + 'k_pppoeSettings'], k_isPppoe);
};

k_interfacesGridCfg = {
k_isRowHighlighting: false,
k_selectionMode: 'k_none',
k_columns: {
k_items: [
{
k_columnId: 'name',
k_caption: k_tr('Name', 'common'),
k_width: 240,
k_renderer: kerio.waw.shared.k_methods.k_formatInterfaceName
},
{
k_columnId: 'ip',
k_caption: k_tr('IP Address', 'connectivityWizard'),
k_width: 100
},
{
k_columnId: 'subnetMask',
k_caption: k_tr('Mask', 'common')
}
]
}
};
k_interfacesGrid = new kerio.lib.K_Grid(k_localNamespace + 'interfacesGrid', k_interfacesGridCfg);


k_wizardCfg = {
k_restrictBy: {
k_serverOs: (k_isLinux ? k_LINUX : k_WINDOWS),
k_boxEdition: k_isBoxEdition
},
k_height: 650,
k_width: 570,
k_isCancelable: true,
k_isResizable: true, k_title: k_tr('Connectivity', 'connectivityWizard'),
k_hasHelpIcon: true,
k_isConfirmBeforeClosing: false,
k_onBeforeClose: this.k_onBeforeClose,
k_onAfterCancel: this.k_onBeforeClose,
k_onBeforeShow: this.k_resetPages,
k_pages: [
{
k_id: 'k_loadData',

k_onBeforeShow: function() {
this.k_loadData();
this.k_showLoading(kerio.lib.k_tr('Checking configuration…', 'connectivityWizard'));
return false;
}
},

{
k_id: 'k_incompatiblePage',
k_title: k_tr('Please Note:', 'connectivityWizard'),
k_description: k_tr('This will replace the current connectivity configuration.', 'connectivityWizard'),
k_nextPageId: k_NO_PAGE,
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_container',
k_height: k_lib.k_isIPadCompatible ? 100 : 400
},
{
k_type: 'k_display',
k_id: 'k_continue',
k_template: '<a>' + k_tr('Yes, overwrite the current connectivity configuration.', 'connectivityWizard') + '</a>',

k_onLinkClick: function(k_page) {
k_page.k_wizard.k_showPage('k_connectivityPage');
}
},
{
k_type: 'k_display',
k_id: 'k_fatalError',
k_isHidden: true,
k_value: k_tr('Please fix your connectivity settings before using this wizard.', 'connectivityWizard')
}
]
},

{
k_id: 'k_connectivityPage',
k_title: k_tr('Connectivity', 'connectivityWizard'),
k_description: k_tr('Select your connectivity mode:', 'connectivityWizard'),
k_nextPageId: 'k_internetPage',
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_display',
k_value: ''
},
{
k_type: 'k_container',
k_isLabelHidden: true,
k_indent: 1,
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_connectivityMode',
k_option: k_tr('Single Internet link', 'connectivityWizard'),
k_value: k_WAW_CONSTANTS.ConnectivityType.Persistent,
k_isChecked: true, k_onChange: function(k_page) {
var
k_dataStore = k_page.k_wizard.k_dataStore;
if (k_dataStore) {
k_dataStore.k_line1LastEdited = undefined;
k_dataStore.k_line2LastEdited = undefined;
k_dataStore.k_lanLastEdited = undefined;
}
}
},
{
k_type: 'k_radio',
k_groupId: 'k_connectivityMode',
k_option: k_tr('Two Internet links with load balancing', 'connectivityWizard'),
k_value: k_WAW_CONSTANTS.ConnectivityType.LoadBalancing
},
{
k_type: 'k_radio',
k_groupId: 'k_connectivityMode',
k_option: k_tr('Two Internet links with failover', 'connectivityWizard'),
k_value: k_WAW_CONSTANTS.ConnectivityType.Failover
}
]}
],

k_onBeforeNextPage: function(k_page) {
this.k_dataStore.k_connectivity.mode = k_page.k_getItem('k_connectivityMode').k_getValue();
this.k_setupInternetPage(k_page);
this.k_setUpLanPage(k_page);
if (this.ConnectivityType.Persistent !== this.k_dataStore.k_connectivity.mode) {
k_page = this.k_getPage('k_twoInternetLinks');
k_page.k_getItem('k_firstLinkContainer').k_setTitle(this.k_getLinkName(this.k_dataStore.k_connectivity.mode, 1));
k_page.k_getItem('k_secondLinkContainer').k_setTitle(this.k_getLinkName(this.k_dataStore.k_connectivity.mode, 2));
}
this.k_setConfirmBeforeClose(true);
},

k_onBeforeShow: function (k_page) {
var
k_tr = kerio.lib.k_tr,
k_dataStore = this.k_dataStore,
k_connectivityMode = k_dataStore.k_connectivity.mode,
k_connectivityGroup = k_page.k_getItem('k_connectivityMode'),
ConnectivityType = kerio.waw.shared.k_CONSTANTS.ConnectivityType,
k_isEnoughInterfaces = (this.k_isBoxEdition || 2 < k_dataStore.k_interfaces.length); if (!k_isEnoughInterfaces && 2 > k_dataStore.k_interfaces.length) { this.k_hide();
kerio.lib.k_alert({
k_title: k_tr('Connectivity Wizard', 'connectivityWizard'),
k_msg: '<b>' + k_tr('Connectivity Wizard cannot start because the Kerio Control machine does not have enough available network interfaces.', 'connectivityWizard')
+ '</b><br><br><i>'
+ k_tr('You need at least one network interface for the Internet connection (e.g. Ethernet, ADSL or dial-up modem, WiFi, etc.) and another one for the local network (e.g. Ethernet, WiFi in AP mode, etc.).', 'connectivityWizard')
+ '</i>',
k_icon: 'error'
});
return false;
}
if (ConnectivityType.DialOnDemand === k_connectivityMode) {
k_connectivityMode = ConnectivityType.Persistent;
}
k_connectivityGroup.k_setItemDisabled(ConnectivityType.Failover, !k_isEnoughInterfaces);
k_connectivityGroup.k_setItemDisabled(ConnectivityType.LoadBalancing, !k_isEnoughInterfaces);
if (!k_isEnoughInterfaces) {
k_connectivityMode = ConnectivityType.Persistent;
}
k_page.k_setData({ k_connectivityMode: k_connectivityMode });
}
},

{
k_id: 'k_singleInternetLink',
k_title: k_tr('Single Internet Link', 'connectivityWizard'),
k_nextPageId: 'k_lanPage',
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_id: 'k_singleLinkContainer',
k_height: 220,
k_items: [
k_getInterfaceSelect(this._k_changeInterface, {k_id: 'k_line1'}),
k_WAW_DEFINITIONS.k_get('k_ethernetModeForWizard', {k_id: 'k_line1', k_onChange: k_onEthernetModeChange, k_indent: 0}),
{
k_restrictions: {
k_serverOs: [ k_LINUX ]
},
k_type: 'k_display',
k_id: 'k_line1' + '_' + 'k_dhcpIpInfo',
k_indent: ((k_isBoxEdition) ? 1 : 0),
k_value: k_tr('The IP address, network mask, DNS server and Gateway will be assigned by DHCP. Please make sure a DHCP server is correctly configured on your network.', 'connectivityWizard')
},
k_WAW_DEFINITIONS.k_get('k_interfaceIpSettings', { k_id: 'k_line1', k_indent: ((k_isLinux && !k_isBoxEdition) ? 2 : 1)}),
k_WAW_DEFINITIONS.k_get('k_interfacePppoeSettings', { k_id: 'k_line1', k_indent: ((k_isLinux && !k_isBoxEdition) ? 2 : 1)})
]}
],
k_onBeforeShow: (k_isBoxEdition) ? this._k_setInterfaceData : this._k_fillInterfaces
},

{
k_id: 'k_twoInternetLinks',
k_title: '',
k_nextPageId: 'k_lanPage',
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_id: 'k_firstLinkContainer',
k_height: 220,
k_items: [
k_getInterfaceSelect(this._k_changeInterface, {k_id: 'k_line1'}),
k_WAW_DEFINITIONS.k_get('k_ethernetModeForWizard', {k_id: 'k_line1', k_onChange: k_onEthernetModeChange, k_indent: 0}),
{
k_restrictions: {
k_serverOs: [ k_LINUX ]
},
k_type: 'k_display',
k_id: 'k_line1' + '_' + 'k_dhcpIpInfo',
k_indent: ((k_isBoxEdition) ? 1 : 0),
k_value: k_tr('The IP address, network mask, default gateway and DNS server will be assigned by DHCP.', 'connectivityWizard')
},
k_WAW_DEFINITIONS.k_get('k_interfaceIpSettings', { k_id: 'k_line1', k_indent: 1}),
k_WAW_DEFINITIONS.k_get('k_interfacePppoeSettings', { k_id: 'k_line1', k_indent: 1}),
k_WAW_DEFINITIONS.k_get('k_interfaceLoadBalancingSettings', { k_id: 'k_line1' + '_' + 'k_weight', k_indent: 0, k_forceEnable: true })
]},
{
k_type: 'k_fieldset',
k_id: 'k_secondLinkContainer',
k_height: 220,
k_items: [
k_getInterfaceSelect(this._k_changeInterface, {k_id: 'k_line2'}),
k_WAW_DEFINITIONS.k_get('k_ethernetModeForWizard', {k_id: 'k_line2', k_onChange: k_onEthernetModeChange, k_indent: 0}),
{
k_restrictions: {
k_serverOs: [ k_LINUX ]
},
k_type: 'k_display',
k_id: 'k_line2' + '_' + 'k_dhcpIpInfo',
k_indent: ((k_isBoxEdition) ? 1 : 0),
k_value: k_tr('The IP address, network mask, default gateway and DNS server will be assigned by DHCP.', 'connectivityWizard')
},
k_WAW_DEFINITIONS.k_get('k_interfaceIpSettings', { k_id: 'k_line2', k_indent: 1}),
k_WAW_DEFINITIONS.k_get('k_interfacePppoeSettings', { k_id: 'k_line2', k_indent: 1}),
k_WAW_DEFINITIONS.k_get('k_interfaceLoadBalancingSettings', { k_id: 'k_line2' + '_' + 'k_weight', k_indent: 0, k_forceEnable: true })
]}
],
k_onBeforeShow: (k_isBoxEdition) ? this._k_setInterfaceData : this._k_fillInterfaces,
k_onBeforeNextPage: this._k_checkDuplicateIp
},

{
k_id: 'k_lanPage',
k_title: k_tr('Local network', 'connectivityWizard'),
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('LAN', 'connectivityWizard'),
k_height: 140,
k_items: [
k_getInterfaceSelect(this.k_selectLanInterface),
k_getConnectedInterfaceWarning(),
{
k_type: 'k_container',
k_id: 'k_lanContainer',
k_items: [
{
k_caption: k_tr('IP Address:', 'common'),
k_id: 'k_lanIp',
k_maxLength: 15,
k_isDisabled: !k_isLinux,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: k_WAW_DEFINITIONS.k_ipv4.k_allowedChars
},

k_onBlur: function(k_form, k_element) {
var k_value = k_element.k_getValue();
kerio.waw.shared.k_methods.k_generateMaskForIp(k_value, { k_form: k_form, k_maskFieldId: 'k_lanSubnetMask' });
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
},
kerio.waw.shared.k_DEFINITIONS.k_get('k_ipv4MaskField', {
k_id: 'k_lanSubnetMask',
k_isDisabled: !k_isLinux
})
]
},
{
k_type: 'k_checkbox',
k_id: 'k_dhcpForClients',
k_isLabelHidden: true,
k_option: k_tr('Use DHCP for clients', 'connectivityWizard'),

k_onChange: function(k_page, k_item, k_value) {
var
k_tr = kerio.lib.k_tr,
k_wizard = k_page.k_wizard,
k_dataStore = k_wizard.k_dataStore,
k_dhcp = k_dataStore.k_dhcp,
k_forwarderEnabled = k_dataStore.k_dns.forwarderEnabled;
k_page.k_dnsForwarderOn.k_setVisible(k_value && k_forwarderEnabled);
k_page.k_dnsForwarderOff.k_setVisible(k_value && !k_forwarderEnabled);
if (k_value) {
if (!k_dhcp.k_isModeOk) {
kerio.lib.k_alert(
k_tr('Warning', 'common'),
k_tr('DHCP server will be turned on and set to the automatic mode.', 'connectivityWizard')
);
}
}
else {
k_page.k_enableForwarder = false;
}
}
},
{
k_type: 'k_container',
k_id: 'k_dnsForwarderContainer',
k_items: [
{
k_type: 'k_display',
k_id: 'k_dnsForwarderOff',
k_isHidden: true,
k_icon: 'img/warning.png?v=8629',
k_className: 'warningImgIcon',
k_template: k_tr('DNS forwarding is not enabled', 'connectivityWizard') + '&nbsp;&nbsp;&nbsp<a>' + k_tr('Switch DNS forwarding on', 'connectivityWizard') + '</a>',

k_onLinkClick: function(k_page) {
k_page.k_enableDnsForwarder(true);
}
},
{
k_type: 'k_display',
k_id: 'k_dnsForwarderOn',
k_isHidden: true,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_template: k_tr('DNS forwarding will be enabled', 'connectivityWizard') + '&nbsp;&nbsp;&nbsp<a>' + k_tr('Keep DNS forwarding disabled', 'connectivityWizard') + '</a>',

k_onLinkClick: function(k_page) {
k_page.k_enableDnsForwarder(false);
}
}
]
}
]
},
{
k_type: 'k_container',
k_id: 'k_interfacesGridContainer',
k_restrictions: {
k_boxEdition: [false]
},
k_items: [
{k_type: 'k_display',
k_value: ''
},
{
k_type: 'k_display',
k_value: k_tr('All interfaces listed below will be moved into the Other Interfaces group', 'connectivityWizard')
},
{
k_type: 'k_container',
k_height: 150,
k_content: k_interfacesGrid
}
]
}
],
k_onBeforeNextPage: this._k_checkLanIp,

k_onBeforeShow: function(k_page) {
if (this.k_isBoxEdition) { return;
}
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
InterfaceType = k_WAW_CONSTANTS.InterfaceType,
k_interfaceList = [],
k_dataStore = this.k_dataStore,
k_interfaces = k_dataStore.k_interfaces,
k_interfaceElement = k_page.k_getItem('k_interface'),
k_isSecondInternetUsed = (k_WAW_CONSTANTS.ConnectivityType.Persistent !== k_dataStore.k_selectedConnectivityMode),
k_interface,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_interfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_i];
if (InterfaceType.Ethernet === k_interface.type &&
k_dataStore.k_selectedInternet1 !== k_interface.id &&
(!k_isSecondInternetUsed || k_dataStore.k_selectedInternet2 !== k_interface.id)
) {
k_interfaceList.push(k_interface);
}
}
if (0 === k_interfaceList.length) {
kerio.lib.k_alert(
{
k_title: kerio.lib.k_tr('Connectivity Wizard', 'connectivityWizard'),
k_msg: kerio.lib.k_tr('You need at least one Ethernet interface to set up LAN', 'connectivityWizard'),
k_icon: 'error'
}
);
return false;
}
k_interface = this.k_dataStore.k_selectedLan; k_page._k_skipLanSelect = true;
k_interfaceElement.k_setData(k_interfaceList);
if (k_interfaceElement.k_containsValue(k_interface)) {
k_interfaceElement.k_setValue(k_interface);
}
else {
k_interfaceElement.k_setValue(k_interfaceList[0].id);
}
k_page._k_skipLanSelect = false;
k_page.k_selectLanInterface(k_page, k_interfaceElement, k_interfaceElement.k_getValue());
}
},

{
k_id: 'k_summaryPage',
k_title: k_tr('Ready to apply the configuration', 'connectivityWizard'),
k_nextPageId: k_NO_PAGE,
k_isFinishPage: true,
k_items: [
{
k_type: 'k_container',
k_restrictions: {
k_boxEdition: [false]
},
k_items: [
{
k_type: 'k_display'
},
{
k_type: 'k_display',
k_value: '<b>' + k_tr('Once you click on Finish, the following configuration will be applied.', 'connectivityWizard') +
' ' + k_tr('Make sure all cables are connected properly.', 'common') + '</b>',
k_isSecure: true
},
{
k_type: 'k_display'
},
{
k_type: 'k_display',
k_id: 'k_line1Type',
k_indent: 1,
k_template: '<span class="interfaceIcon {k_className}">&nbsp; &nbsp; &nbsp; </span><b>{k_name}</b>'
},
{
k_type: 'k_container',
k_indent:2,
k_items: [
{
k_type: 'k_display',
k_id: 'k_line1Name',
k_caption: k_tr('Name:', 'connectivityWizard'),
k_isSecure: true
},
{
k_type: 'k_display',
k_id: 'k_line1Ip',
k_caption: k_tr('IP address:', 'connectivityWizard')
},
{
k_type: 'k_display',
k_id: 'k_line1Gateway',
k_caption: k_tr('Gateway:', 'connectivityWizard')
},
{
k_type: 'k_display',
k_id: 'k_line1Dhcp',
k_isHidden: true,
k_caption: k_tr('Configured by:', 'connectivityWizard'),
k_value: k_tr('DHCP server', 'connectivityWizard')
},
{
k_type: 'k_display',
k_id: 'k_line1Pppoe',
k_isHidden: true,
k_caption: k_tr('Configured by:', 'connectivityWizard'),
k_value: k_tr('Dial-up server', 'connectivityWizard')
}
]
},
{
k_type: 'k_container',
k_id: 'k_line2',
k_items: [
{
k_type: 'k_display',
k_id: 'k_line2Type',
k_indent: 1,
k_template: '<span class="interfaceIcon {k_className}">&nbsp; &nbsp; &nbsp; </span><b>{k_name}</b>'
},
{
k_type: 'k_container',
k_indent:2,
k_items: [
{
k_type: 'k_display',
k_id: 'k_line2Name',
k_caption: k_tr('Name:', 'connectivityWizard'),
k_isSecure: true
},
{
k_type: 'k_display',
k_id: 'k_line2Ip',
k_caption: k_tr('IP address:', 'connectivityWizard')
},
{
k_type: 'k_display',
k_id: 'k_line2Gateway',
k_caption: k_tr('Gateway:', 'connectivityWizard')
},
{
k_type: 'k_display',
k_id: 'k_line2Dhcp',
k_isHidden: true,
k_caption: k_tr('Configured by:', 'connectivityWizard'),
k_value: k_tr('DHCP server', 'connectivityWizard')
},
{
k_type: 'k_display',
k_id: 'k_line2Pppoe',
k_isHidden: true,
k_caption: k_tr('Configured by:', 'connectivityWizard'),
k_value: k_tr('Dial-up server', 'connectivityWizard')
}
]
}
]
},
{
k_type: 'k_display',
k_id: 'k_lanType',
k_indent: 1,
k_template: '<span class="interfaceIcon {k_className}">&nbsp; &nbsp; &nbsp; </span><b>{k_name}</b>'
},
{
k_type: 'k_container',
k_indent:2,
k_items: [
{
k_type: 'k_display',
k_id: 'k_lanName',
k_caption: k_tr('Name:', 'connectivityWizard'),
k_isSecure: true
},
{
k_type: 'k_display',
k_id: 'k_lanIp',
k_caption: k_tr('IP address:', 'connectivityWizard')
},
{
k_type: 'k_display',
k_id: 'k_lanMask',
k_caption: k_tr('Mask:', 'connectivityWizard')
}
]
}
]
},
{
k_type: 'k_container',
k_restrictions: {
k_boxEdition: [true]
},
k_items: [
{
k_type: 'k_display'
},
{
k_type: 'k_display',
k_value: '<b>' + k_tr('Once you click on Finish, make sure all the cables are connected according to the scheme below.', 'connectivityWizard') + '</b>',
k_isSecure: true
},
{
k_type: 'k_display'
},
{
k_type: 'k_container',
k_height: 215,
k_content: k_boxConnections
}
]
},
{
k_type: 'k_container',
k_id: 'k_configSaving',
k_isHidden: true,
k_items: [
{
k_type: 'k_display'
},
{
k_type: 'k_display'
},
{
k_type: 'k_display',
k_restrictions: {
k_boxEdition: [true]
}
},
{
k_type: 'k_display',
k_indent: k_isBoxEdition ? 8: 4,
k_value: '<span class="loadinHeaderText">&nbsp;</span>' + k_tr('Saving…', 'common'),
k_isSecure: true
}
]
}
],
k_onBeforeShow: function(k_page) {
var
k_data = this.k_dataStore,
k_tr = kerio.lib.k_tr,
ConnectivityType = kerio.waw.shared.k_CONSTANTS.ConnectivityType,
Ethernet = kerio.waw.shared.k_CONSTANTS.InterfaceType.Ethernet,
k_htmlEncode = kerio.lib.k_htmlEncode,
k_connectivityMode = k_data.k_selectedConnectivityMode,
k_wizardData = this.k_getData(true),
k_formData = {},
k_labels,
k_selectedInternet1,
k_selectedInternet2,
k_selectedLan;
k_page.k_setVisible('k_configSaving', false);
if (!this.k_isBoxEdition) {
k_selectedInternet1 = k_data.k_interfaces[k_data.k_selectedInternet1];
k_selectedLan = k_data.k_interfaces[k_data.k_selectedLan];
switch (k_connectivityMode) {
case ConnectivityType.Persistent:
k_formData = {
k_line1Name: k_htmlEncode(k_selectedInternet1.name),
k_line1Ip: k_wizardData.k_singleInternetLink['k_line1' + '_' + 'k_ip'],
k_line1Gateway: k_wizardData.k_singleInternetLink['k_line1' + '_' + 'k_gateway'] || k_tr('none', 'connectivityWizard'),
k_line1Type: {
k_name: this.k_getLinkName(k_connectivityMode),
k_className: (Ethernet === k_selectedInternet1.type) ? 'interfaceEthernet' : 'interfaceRas'
}
};
k_page.k_setVisible(['k_line1Ip', 'k_line1Gateway'], (!this.k_isLinux && Ethernet === k_selectedInternet1.type) || this.InterfaceModeType.InterfaceModeManual === k_wizardData.k_singleInternetLink['k_line1' + '_' + 'k_ethernetMode']);
k_page.k_setVisible(['k_line1Dhcp'], this.InterfaceModeType.InterfaceModeAutomatic === k_wizardData.k_singleInternetLink['k_line1' + '_' + 'k_ethernetMode']);
k_page.k_setVisible(['k_line1Pppoe'], Ethernet !== k_selectedInternet1.type || (this.k_isLinux && this.InterfaceEncapType.InterfaceEncapPppoe === k_wizardData.k_singleInternetLink['k_line1' + '_' + 'k_ethernetMode'])); k_page.k_getItem('k_line2').k_setVisible(false);
break;
case ConnectivityType.LoadBalancing:
case ConnectivityType.Failover:
k_selectedInternet2 = k_data.k_interfaces[k_data.k_selectedInternet2];
k_formData = {
k_line1Name: k_htmlEncode(k_selectedInternet1.name),
k_line1Ip: k_wizardData.k_twoInternetLinks['k_line1' + '_' + 'k_ip'],
k_line1Gateway: k_wizardData.k_twoInternetLinks['k_line1' + '_' + 'k_gateway'] || k_tr('none', 'connectivityWizard'),
k_line2Name: k_htmlEncode(k_selectedInternet2.name),
k_line2Ip: k_wizardData.k_twoInternetLinks['k_line2' + '_' + 'k_ip'],
k_line2Gateway: k_wizardData.k_twoInternetLinks['k_line2' + '_' + 'k_gateway'] || k_tr('none', 'connectivityWizard'),
k_line1Type: {
k_name: this.k_getLinkName(k_connectivityMode, 1),
k_className: (Ethernet === k_selectedInternet1.type) ? 'interfaceEthernet' : 'interfaceRas'
},
k_line2Type: {
k_name: this.k_getLinkName(k_connectivityMode, 2),
k_className: (Ethernet === k_selectedInternet2.type) ? 'interfaceEthernet' : 'interfaceRas'
}
};
k_page.k_setVisible(['k_line1Ip', 'k_line1Gateway'], (!this.k_isLinux && Ethernet === k_selectedInternet1.type) || this.InterfaceModeType.InterfaceModeManual === k_wizardData.k_twoInternetLinks['k_line1' + '_' + 'k_ethernetMode']);
k_page.k_setVisible(['k_line1Dhcp'], this.InterfaceModeType.InterfaceModeAutomatic === k_wizardData.k_twoInternetLinks['k_line1' + '_' + 'k_ethernetMode']);
k_page.k_setVisible(['k_line1Pppoe'], Ethernet !== k_selectedInternet1.type || (this.k_isLinux && this.InterfaceEncapType.InterfaceEncapPppoe === k_wizardData.k_twoInternetLinks['k_line1' + '_' + 'k_ethernetMode'])); k_page.k_getItem('k_line2').k_setVisible(true);
k_page.k_setVisible(['k_line2Ip', 'k_line2Gateway'], (!this.k_isLinux && Ethernet === k_selectedInternet2.type) || this.InterfaceModeType.InterfaceModeManual === k_wizardData.k_twoInternetLinks['k_line2' + '_' + 'k_ethernetMode']);
k_page.k_setVisible(['k_line2Dhcp'], this.InterfaceModeType.InterfaceModeAutomatic === k_wizardData.k_twoInternetLinks['k_line2' + '_' + 'k_ethernetMode']);
k_page.k_setVisible(['k_line2Pppoe'], Ethernet !== k_selectedInternet2.type || (this.k_isLinux && this.InterfaceEncapType.InterfaceEncapPppoe === k_wizardData.k_twoInternetLinks['k_line2' + '_' + 'k_ethernetMode'])); break;
}
k_formData.k_lanType =  {
k_name: k_tr('Local Network', 'connectivityWizard'),
k_className: 'interfaceEthernet' };
k_formData.k_lanName = k_htmlEncode(k_selectedLan.name);
k_formData.k_lanIp = k_wizardData.k_lanPage.k_lanIp;
k_formData.k_lanMask = k_wizardData.k_lanPage.k_lanSubnetMask;
k_page.k_setData(k_formData);
} else {
switch (k_connectivityMode) {
case ConnectivityType.Persistent:
k_labels = [this.k_getLinkName(k_connectivityMode, 1, true), k_tr('Local Network', 'connectivityWizard')];
break;
case ConnectivityType.LoadBalancing:
case ConnectivityType.Failover:
k_labels = [this.k_getLinkName(k_connectivityMode, 1, true), this.k_getLinkName(k_connectivityMode, 2, true), k_tr('Local Network', 'connectivityWizard')];
break;
}
k_page.k_boxConnections.k_setRowData(k_labels);
}
},
k_onBeforeFinish: this.k_saveData
},

{
k_id: 'k_finishPage',
k_title: k_tr('The connectivity has been configured successfully.', 'connectivityWizard'),
k_backPageId: k_NO_PAGE,
k_isClosePage: true,
k_onBeforeShow: function() {
this.k_enableConfirmBeforeClosing(false);
if (this.k_parentGrid) {
this.k_parentGrid.k_baseWidget.k_loadData();
}
}
}
] }; k_wizard = new kerio.lib.K_Wizard2(k_objectName, k_wizardCfg);
k_wizard.k_addReferences({
k_isBoxEdition: k_isBoxEdition,
k_isLinux: k_isLinux,
k_dataStore: {
k_selectedConnectivityMode: undefined,
k_selectedInternet1: undefined,
k_selectedInternet2: undefined,
k_selectedLan: undefined
},
k_setupInternetPage: this.k_setupInternetPage,
k_setUpLanPage: this.k_setUpLanPage,
_k_fillInterfaces: this._k_fillInterfaces,
InterfaceModeType: k_WAW_CONSTANTS.InterfaceModeType,
InterfaceEncapType: k_WAW_CONSTANTS.InterfaceEncapType
});

k_wizard.k_addReferences({
k_loadData: this.k_loadData,
k_loadDataCallback: this.k_loadDataCallback
});

k_wizard.k_addReferences({
k_onEthernetModeChange: k_onEthernetModeChange,
_k_checkDuplicateIp: this._k_checkDuplicateIp,
_k_changeInterface: this._k_changeInterface,
k_selectLanInterface: this.k_selectLanInterface,
k_lineMap: { k_ethernetType: function(k_from, k_value, k_data) {
var
k_prefix = (k_from.indexOf('k_line1') !== -1 ? 'k_line1' : 'k_line2') + '_',
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS;
return {
mode: (k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeManual === k_data[k_prefix + 'k_ethernetMode']
? k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeManual
: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeAutomatic
),
encap: (k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe === k_data[k_prefix + 'k_ethernetMode']
? k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe
: k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapNative
)
};
},
k_ip: 'ip',
k_subnetMask: function(k_from, k_value) {
return { subnetMask: kerio.waw.shared.k_methods.k_convertCidrToMask(k_value) };
},
k_gateway: 'gateway',
k_gatewayAutodetected: function(k_from, k_value, k_data) {
var k_prefix = (k_from.indexOf('k_line1') !== -1 ? 'k_line1' : 'k_line2') + '_';
if (!kerio.waw.shared.k_methods.k_isLinux()) { return {
gatewayAutodetected: k_value
};
}
if (kerio.waw.shared.k_CONSTANTS.InterfaceModeType.InterfaceModeAutomatic === k_data[k_prefix + 'k_ethernetMode']
|| kerio.waw.shared.k_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe === k_data[k_prefix + 'k_ethernetMode']) {
return {
gatewayAutodetected: true };
}
if (kerio.waw.shared.k_CONSTANTS.InterfaceModeType.InterfaceModeManual === k_data[k_prefix + 'k_ethernetMode']) {
return {
gatewayAutodetected: false };
}
return {}; },
k_userName: function(k_from, k_value) {
return {
credentials: {
userName: k_value || ''
}
};
},
k_password: function(k_from, k_value) {
return {
credentials: {
password: k_value || '',
passwordChanged: true
}
};
},
k_dnsServers: function(k_from, k_value, k_data) {
var
k_prefix = (k_from.indexOf('k_line1') !== -1 ? 'k_line1' : 'k_line2') + '_';
if (!kerio.waw.shared.k_methods.k_isLinux() || kerio.waw.shared.k_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe !== k_data[k_prefix + 'k_ethernetMode']) {
return {
dnsServers: k_value
};
}
return {}; },
k_pppoeDnsServers: function(k_from, k_value, k_data) {
var
k_prefix = (k_from.indexOf('k_line1') !== -1 ? 'k_line1' : 'k_line2') + '_';
if (kerio.waw.shared.k_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe === k_data[k_prefix + 'k_ethernetMode']) {
return {
dnsServers: k_value
};
}
return {}; },
k_dnsAutodetected: function(k_from, k_value, k_data) {
var k_prefix = (k_from.indexOf('k_line1') !== -1 ? 'k_line1' : 'k_line2') + '_';
if (!kerio.waw.shared.k_methods.k_isLinux()) { return {
dnsAutodetected: k_value
};
}
if (kerio.waw.shared.k_CONSTANTS.InterfaceModeType.InterfaceModeAutomatic === k_data[k_prefix + 'k_ethernetMode']) {
return {
dnsAutodetected: true };
}
if (kerio.waw.shared.k_CONSTANTS.InterfaceModeType.InterfaceModeManual === k_data[k_prefix + 'k_ethernetMode']) {
return {
dnsAutodetected: false };
}
return {}; },
k_pppoeDnsAutodetected: function(k_from, k_value, k_data) {
var
k_prefix = (k_from.indexOf('k_line1') !== -1 ? 'k_line1' : 'k_line2') + '_';
if (kerio.waw.shared.k_methods.k_isLinux() && (kerio.waw.shared.k_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe === k_data[k_prefix + 'k_ethernetMode'])) {
return {
dnsAutodetected:  k_value
};
}
return {}; },
k_weight: function(k_from, k_value, k_data) {
if (!k_value || !k_value.value) {
k_value = { value: 1};
}
k_value.enabled = true; return {
loadBalancingWeight: k_value
};
}
},
k_interfaceMap: k_shared.k_methods.k_mergeObjects(
kerio.waw.k_hacks.k_fixFlip( k_shared.k_methods.k_flip( {
k_subnetMask: 'subnetMask',
k_gateway: 'gateway',
k_gatewayAutodetected: 'gatewayAutodetected'
},
true ) ), { 
encap: function(k_from, k_value) {
var k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS;
if (k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe === k_value) {
return { k_ethernetMode: k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe};
}
return {}; },
mode: function(k_from, k_value, k_data) {
var k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS;
if (k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe !== k_data.encap) {
return { k_ethernetMode: k_value };
}
return {}; },
k_ethernetType: function(k_from, k_value, k_data) {
var k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS;
return {
mode: (k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeManual === k_data.k_ethernetMode
? k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeManual
: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeAutomatic
),
encap: (k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe === k_data.k_ethernetMode
? k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe
: k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapNative
)
};
},
connectivityParameters: function(k_from, k_value) {
return {
k_weight: k_value.loadBalancingWeight
};
},
ras: function(k_from, k_value) {
return {
k_userName: k_value.credentials.userName,
k_password: k_value.credentials.password
};
},
k_userName: function(k_from, k_value) {
return {
ras: {
credentials: {
userName: k_value
}
}
};
},
k_password: function(k_from, k_value) {
return {
ras: {
credentials: {
password: k_value
}
}
};
},
ip: function(k_from, k_value) {
return {
k_ip: k_value,
k_pppoeIp: k_value
};
},
k_ip: function(k_from, k_value, k_data) {
if (kerio.waw.shared.k_methods.k_isLinux() && kerio.waw.shared.k_CONSTANTS.InterfaceModeType.InterfaceModeManual === k_data.k_ethernetMode) {
return {
ip: k_value
};
}
return {}; },
dnsServers: function(k_from, k_value) {
return {
k_dnsServers: k_value,
k_pppoeDnsServers: k_value
};
},
k_dnsServers: function(k_from, k_value, k_data) {
if (kerio.waw.shared.k_CONSTANTS.InterfaceModeType.InterfaceModeManual === k_data.k_ethernetMode) {
return {
dnsServers: k_value
};
}
return {}; },
k_pppoeDnsServers: function(k_from, k_value, k_data) {
if (kerio.waw.shared.k_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe === k_data.k_ethernetMode) {
return {
dnsServers: k_value
};
}
return {}; },
dnsAutodetected: function(k_from, k_value) {
return {
k_dnsAutodetected: k_value,
k_pppoeDnsAutodetected: k_value
};
},
k_dnsAutodetected: function(k_from, k_value, k_data) {
if (!kerio.waw.shared.k_methods.k_isLinux()) { return {
dnsAutodetected: k_value
};
}
return {}; },
k_pppoeDnsAutodetected: function(k_from, k_value, k_data) {
if (kerio.waw.shared.k_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe === k_data.k_ethernetMode) {
return {
dnsAutodetected: k_value
};
}
return {}; }
}
) });

k_lanPage = k_wizard.k_getPage('k_lanPage');
k_lanPage.k_addReferences({
k_dnsForwarderOff: k_lanPage.k_getItem('k_dnsForwarderOff'),
k_dnsForwarderOn: k_lanPage.k_getItem('k_dnsForwarderOn'),
k_dnsForwarderContainer: k_lanPage.k_getItem('k_dnsForwarderContainer'),
k_enableDnsForwarder: this.k_enableDnsForwarder,
k_selectLanInterface: this.k_selectLanInterface,
k_interfacesGrid: k_interfacesGrid,
k_interfacesGridContainer: k_lanPage.k_getItem('k_interfacesGridContainer'),
k_enableForwarder: false,
k_lanSettings: {}
});

k_wizard.k_getPage('k_summaryPage').k_addReferences({
k_boxConnections: k_boxConnections
});

k_incompatiblePage = k_wizard.k_getPage('k_incompatiblePage');
k_incompatiblePage.k_addReferences({
k_messages: null,

k_checkFailover: function(k_dataStore, k_messages) {
var
FailoverRoleType = kerio.waw.shared.k_CONSTANTS.FailoverRoleType,
Primary = FailoverRoleType.Primary,
Secondary = FailoverRoleType.Secondary,
k_activeInterfaces = k_dataStore.k_interfaces, k_tr = kerio.lib.k_tr,
k_isPrimarySet = false,
k_isPrimaryReported = false,
k_isSecondarySet = false,
k_isSecondaryReported = false,
k_interface,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_activeInterfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_activeInterfaces[k_i];
if (Primary === k_interface.connectivityParameters.failoverRole) {
if (k_isPrimarySet) {
if (!k_isPrimaryReported) {
k_isPrimaryReported = true;
k_messages.push(k_tr('Too many primary links for failover. Only one of them will be used.', 'connectivityWizard'));
}
}
else {
k_isPrimarySet = true;
}
}
else {
if (Secondary === k_interface.connectivityParameters.failoverRole) {
if (k_isSecondarySet) {
if (!k_isSecondaryReported) {
k_isSecondaryReported = true;
k_messages.push(k_tr('Too many backup links for failover. Only one of them will be used.', 'connectivityWizard'));
}
}
else {
k_isSecondarySet = true;
}
}
}
}
if (!k_isPrimarySet) {
k_messages.push(k_tr('The primary link for failover is not set.', 'connectivityWizard'));
}
if (!k_isSecondarySet) {
k_messages.push(k_tr('The backup link for connection failover is not set.', 'connectivityWizard'));
}
return k_isPrimarySet && !k_isPrimaryReported && k_isSecondarySet && !k_isSecondaryReported;
}, 
k_setInterfaces: function(k_dataStore, k_connectivityMode) {
k_connectivityMode = k_connectivityMode || k_dataStore.k_selectedConnectivityMode;
k_dataStore.k_selectedConnectivityMode = k_connectivityMode;
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
InterfaceGroupType = k_CONSTANTS.InterfaceGroupType,
Primary = k_CONSTANTS.FailoverRoleType.Primary,
Secondary = k_CONSTANTS.FailoverRoleType.Secondary,
k_CONNECTED_INTERFACE = k_CONSTANTS.k_SERVER.k_CONNECTED_INTERFACE,
k_cntInternet = k_CONSTANTS.ConnectivityType.Persistent === k_connectivityMode ? 1 : 2,
k_activeInterfaces = k_dataStore.k_interfaces, k_availableIfaces = {},
k_cntDefaultGateway = 0,
k_isPrimarySet = false,
k_isSecondarySet = false,
k_internetIfaces,
k_lanIfaces,
k_interface,
k_i, k_cnt;
k_availableIfaces.push = function(k_group, k_item) {
var k_array = this[k_group];
if (!k_array) {
k_array = [];
this[k_group] = k_array;
}
if (!k_item || -1 < k_array.indexOf(k_item)) { return;
}
k_array.push(k_item);
};
k_availableIfaces.push(InterfaceGroupType.Internet);
k_availableIfaces.push(InterfaceGroupType.Other);
k_availableIfaces.push(InterfaceGroupType.Trusted);
for (k_i = 0, k_cnt = k_activeInterfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_activeInterfaces[k_i];
k_availableIfaces.push(k_interface.group, k_interface);
k_cntDefaultGateway++;
}
k_internetIfaces = k_availableIfaces[InterfaceGroupType.Internet].concat(k_availableIfaces[InterfaceGroupType.Other], k_availableIfaces[InterfaceGroupType.Trusted].reverse());
k_lanIfaces      = k_availableIfaces[InterfaceGroupType.Trusted].concat(k_availableIfaces[InterfaceGroupType.Other], k_availableIfaces[InterfaceGroupType.Internet]);
if (k_CONSTANTS.ConnectivityType.Failover === k_connectivityMode) {
for (k_i = 0, k_cnt = k_internetIfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_internetIfaces[k_i];
if (!k_isPrimarySet && Primary === k_interface.connectivityParameters.failoverRole) {
k_dataStore.k_selectedInternet1 = k_interface.id;
k_isPrimarySet = true;
k_cntDefaultGateway++;
}
else if (!k_isSecondarySet && Secondary === k_interface.connectivityParameters.failoverRole) {
k_dataStore.k_selectedInternet2 = k_interface.id;
k_isSecondarySet = true;
k_cntDefaultGateway++;
}
if (k_isPrimarySet && k_isSecondarySet) {
break;
}
}
}
else { for (k_i = 0, k_cnt = k_internetIfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_internetIfaces[k_i];
if ('' !== k_interface.gateway) {
k_cntDefaultGateway++;
if (!k_isPrimarySet) {
k_dataStore.k_selectedInternet1 = k_interface.id;
k_isPrimarySet = true;
}
else {
k_dataStore.k_selectedInternet2 = k_interface.id;
k_isSecondarySet = true;
break;
}
}
}
}
if (!k_isPrimarySet || !k_isSecondarySet) {
for (k_i = 0, k_cnt = k_internetIfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_internetIfaces[k_i];
if ('' === k_interface.gateway) {
k_cntDefaultGateway++;
if (!k_isPrimarySet) {
k_dataStore.k_selectedInternet1 = k_interface.id;
k_isPrimarySet = true;
}
else {
k_dataStore.k_selectedInternet2 = k_interface.id;
break;
}
}
}
}
if (k_cntInternet > k_cntDefaultGateway) {
return; }
if (k_CONNECTED_INTERFACE && k_CONNECTED_INTERFACE !== k_dataStore.k_selectedInternet1 && k_CONNECTED_INTERFACE !== k_dataStore.k_selectedInternet2) {
k_dataStore.k_selectedLan = k_CONNECTED_INTERFACE;
}
else { for (k_i = 0, k_cnt = k_lanIfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_lanIfaces[k_i];
if (k_dataStore.k_selectedInternet1 !== k_interface.id && k_dataStore.k_selectedInternet2 !== k_interface.id) {
k_dataStore.k_selectedLan = k_interface.id;
break;
}
}
}
if (!k_dataStore.k_selectedLan) {
return; }
}, 
k_checkConnectedInterface: function(k_dataStore) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_CONNECTED_INTERFACE = k_CONSTANTS.k_SERVER.k_CONNECTED_INTERFACE,
k_activeInterfaces = k_dataStore.k_interfaces, k_interface,
k_i, k_cnt;
if ("" === k_CONNECTED_INTERFACE) {
return true; }
for (k_i = 0, k_cnt = k_activeInterfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_activeInterfaces[k_i];
if (k_CONNECTED_INTERFACE === k_interface.id) {
return (k_CONSTANTS.InterfaceGroupType.Internet !== k_interface.group);
}
}
return false; },

k_checkPorts: function(k_dataStore) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
PortAssignmentType = k_WAW_CONSTANTS.PortAssignmentType,
k_isSecondInternetUsed = (k_WAW_CONSTANTS.ConnectivityType.Persistent !== k_dataStore.k_selectedConnectivityMode),
k_ports = k_dataStore.k_ports,
k_isCompatible = true,
k_port,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_ports.length; k_i < k_cnt; k_i++) {
k_port = k_ports[k_i];
switch (k_port.type) {
case k_WAW_CONSTANTS.PortType.PortEthernet:
if ("1" === k_port.id) {
if (PortAssignmentType.PortAssignmentStandalone !== k_port.assignment) {
k_isCompatible = false;
break;
}
}
else {
if ("2" === k_port.id) {
if (k_isSecondInternetUsed && PortAssignmentType.PortAssignmentStandalone !== k_port.assignment) {
k_isCompatible = false;
break;
}
if (!k_isSecondInternetUsed && PortAssignmentType.PortAssignmentSwitch !== k_port.assignment) {
k_isCompatible = false;
break;
}
}
else { if ("3" === k_port.id) {
if (k_isSecondInternetUsed) {
if (PortAssignmentType.PortAssignmentSwitch !== k_port.assignment) {
k_isCompatible = false;
break;
}
}
else {
if (PortAssignmentType.PortAssignmentStandalone === k_port.assignment) {
k_isCompatible = false;
break;
}
}
}
else { if (PortAssignmentType.PortAssignmentStandalone === k_port.assignment) {
k_isCompatible = false;
break;
}
}
}
}
break;
case k_WAW_CONSTANTS.PortType.PortWifi:
k_isCompatible = false;
break;
default:
kerio.lib.k_reportError('Internal error: unsupported port type ' + k_port.type, 'connectivityWizard', 'k_prepareBoxPorts');
return;
}
} return k_isCompatible;
}, 
k_countEthernetLines: function(k_dataStore) {
return k_dataStore.k_interfaces.length;
},

k_countInternetLines: function(k_dataStore) {
var
InterfaceGroupType = kerio.waw.shared.k_CONSTANTS.InterfaceGroupType,
k_activeInterfaces = k_dataStore.k_interfaces, k_cntGroup = 0,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_activeInterfaces.length; k_i < k_cnt; k_i++) {
if (InterfaceGroupType.Internet === k_activeInterfaces[k_i].group) {
k_cntGroup++;
}
}
return k_cntGroup;
}
}); k_wizard.k_addReferences({
k_lanPage: k_lanPage
});

k_configuringPage = k_wizard.k_getPage('k_configuringPage');
k_wizard.k_addReferences({
k_configuringPage: k_configuringPage,
k_saveData: this.k_saveData,
k_applyParams: this.k_applyParams,
k_registerCutOffObservers: this.k_registerCutOffObservers,
k_unregisterCutOffObservers: this.k_unregisterCutOffObservers,
k_onCutOff: this.k_onCutOff,
k_onReconnect: this.k_onReconnect,
k_getLinkName: this.k_getLinkName,
ConnectivityType: kerio.waw.shared.k_CONSTANTS.ConnectivityType,
k_registeredCutOffObservers: false });
k_wizard.k_getPage('k_singleInternetLink').k_getItem('k_singleLinkContainer').k_setTitle(k_wizard.k_getLinkName(k_WAW_CONSTANTS.ConnectivityType.Persistent));
return k_wizard;
}, 
k_applyParams: function(k_params) {
this.k_setConfirmBeforeClose(false); this.k_dataStore = {
k_selectedConnectivityMode: undefined,
k_selectedInternet1: undefined,
k_selectedInternet2: undefined,
k_selectedLan: undefined
};
this.k_getPage('k_singleInternetLink').k_reset();
this.k_getPage('k_twoInternetLinks').k_reset();
this.k_getPage('k_lanPage').k_reset();
this.k_parentGrid = k_params.k_parentGrid;
this.k_assistent = k_params.k_assistent;
if (k_params.k_assistent) {
k_params.k_assistent.k_hide();
}
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); },

k_loadData: function() {
var
k_requests = [],
k_callback;
k_requests.push(
{
k_jsonRpc: {
method: 'Interfaces.reset'
}
},
{
k_jsonRpc: {
method: 'Dhcp.reset'
}
}
); k_requests.push({
k_jsonRpc: {
method: 'Interfaces.get',
params: {
query: kerio.waw.shared.k_DEFINITIONS.k_get('k_interfaceOutgoingQuery'), sortByGroup: true
}
},
k_scope: this,

k_callback: function(k_response, k_success) {
var
InterfaceType = kerio.waw.shared.k_CONSTANTS.InterfaceType,
k_newInterfaces = [],
k_deadInterfaces = [],
k_isWindows = !this.k_isLinux,
k_interfaces,
k_i, k_cnt, k_interface;
if (k_success) {
k_interfaces = k_response.list;
for (k_i = 0, k_cnt = k_interfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_i];
if (InterfaceType.Ethernet !== k_interface.type || k_interface.flags.deletable) {
if (!k_isWindows || InterfaceType.Ras !== k_interface.type) {
k_deadInterfaces.push(k_interface);
continue;
}
}
k_interface.k_icon = 'interfaceEthernet';
k_newInterfaces.push(k_interface);
k_newInterfaces[k_interface.id] = k_interface; }
this.k_dataStore.k_interfaces = k_newInterfaces;
this.k_dataStore.k_deadInterfaces = k_deadInterfaces;
}
} });
k_requests.push({
k_jsonRpc: {
method: 'Interfaces.getConnectivityConfig'
},
k_scope: this,

k_callback: function(k_response, k_success) {
if (k_success) {
this.k_dataStore.k_connectivity = k_response.config;
this.k_dataStore.k_selectedConnectivityMode = k_response.config.mode;
}
}
});
k_requests.push({
k_jsonRpc: {
method: 'Dns.get'
},
k_scope: this,

k_callback: function(k_response, k_success) {
if (k_success) {
this.k_dataStore.k_dns = k_response.config;}
}
});
k_requests.push({
k_jsonRpc: {
method: 'Dhcp.getConfig'
},
k_scope: this,

k_callback: function(k_response, k_success) {
var
k_dhcp;
if (k_success) {
k_dhcp = this.k_dataStore.k_dhcp || {};
k_dhcp.k_enabled = k_response.config.enabled;
this.k_dataStore.k_dhcp = k_dhcp;
}
}
});
k_requests.push({
k_jsonRpc: {
method: 'Dhcp.getMode'
},
k_scope: this,

k_callback: function(k_response, k_success) {
var
k_dhcp;
if (k_success) {
k_dhcp = this.k_dataStore.k_dhcp || {};
k_dhcp.k_mode = k_response.mode.type;
this.k_dataStore.k_dhcp = k_dhcp;
}
}
});
if (this.k_isBoxEdition) {
k_requests.push({
k_jsonRpc: {
method: 'Ports.get'
},
k_scope: this,

k_callback: function(k_response, k_success) {
if (k_success) {
this.k_dataStore.k_ports = k_response.ports;
}
}
});
}
k_callback = {
k_callback: this.k_loadDataCallback,
k_scope: this,
k_mask: false,
k_requestOwner: this };
kerio.waw.requests.k_sendBatch(k_requests, k_callback);
}, 
k_loadDataCallback: function(k_response, k_success, k_params) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_dataStore = this.k_dataStore,
k_tr = kerio.lib.k_tr,
k_isIncompatible = false,
k_isFatal = false,
k_messages = [],
k_mode,
k_cntInternetLines,
k_incompatiblePage,
k_interfaces,
k_interface,
k_i, k_cnt;
if (k_success) {
k_incompatiblePage = this.k_getPage('k_incompatiblePage');
if (k_dataStore.k_connectivity && k_dataStore.k_connectivity.mode) {
k_mode = k_dataStore.k_connectivity.mode;
}
else {
k_mode = k_CONSTANTS.ConnectivityType.Persistent;
}
if (!k_isFatal && 1 === k_incompatiblePage.k_countEthernetLines(k_dataStore)) {
k_messages.push(k_tr('There is only one Ethernet link available. Therefore, the wizard is unable to setup the connectivity properly.', 'connectivityWizard'));
k_isIncompatible = true;
k_isFatal = true;
}
if (!k_isFatal) {
if (this.k_isLinux) {
k_interfaces = this.k_dataStore.k_deadInterfaces; for (k_i = 0, k_cnt = k_interfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_i];
if (k_interface.group === k_CONSTANTS.InterfaceGroupType.Internet
&& k_interface.type === k_CONSTANTS.InterfaceType.Ras
) {
k_isIncompatible = true;
break;
}
}
}
if (2 === k_incompatiblePage.k_countEthernetLines(k_dataStore)) {
k_mode = k_CONSTANTS.ConnectivityType.Persistent;
k_dataStore.k_selectedConnectivityMode = k_mode;
}
else {
switch (k_mode) {
case k_CONSTANTS.ConnectivityType.Persistent:
if (1 < k_incompatiblePage.k_countInternetLines(k_dataStore)) {
k_isIncompatible = true;
k_messages.push(k_tr('Too many Internet links. Only one of them will be kept.', 'connectivityWizard'));
}
break;
case k_CONSTANTS.ConnectivityType.DialOnDemand:
if (!this.k_isBoxEdition) {
k_isIncompatible = true;
k_messages.push(k_tr('Connectivity mode Dial on Demand has been detected, it will be changed to persistent with one Internet interface.', 'connectivityWizard'));
k_mode = k_CONSTANTS.ConnectivityType.Persistent;
k_dataStore.k_selectedConnectivityMode = k_mode;
}
break;
case k_CONSTANTS.ConnectivityType.Failover:
k_incompatiblePage.k_checkFailover(k_dataStore, k_messages);
case k_CONSTANTS.ConnectivityType.LoadBalancing:
k_cntInternetLines = k_incompatiblePage.k_countInternetLines(k_dataStore);
if (1 === k_cntInternetLines) {
k_isIncompatible = true;
k_messages.push(k_tr('The %1 connectivity mode with only one Internet link is used. One more Internet link will be used yet.', 'connectivityWizard',
{ k_args: [ k_CONSTANTS.ConnectivityType.Failover === k_mode ? k_tr('Failover', 'connectivityWizard') : k_tr('Link Load Balancing', 'connectivityWizard') ]}) );
k_dataStore.k_selectedConnectivityMode = k_mode;
}
else {
if (2 < k_cntInternetLines) {
k_isIncompatible = true;
k_messages.push(k_tr('The %1 connectivity mode with more than two Internet links is used. Only two Internet links will be used.', 'connectivityWizard',
{ k_args: [ k_CONSTANTS.ConnectivityType.Failover === k_mode ? k_tr('Failover', 'connectivityWizard') : k_tr('Link Load Balancing', 'connectivityWizard') ]}) );
k_dataStore.k_selectedConnectivityMode = k_mode;
}
}
break;
} }
if (k_dataStore.k_dhcp.k_enabled && k_CONSTANTS.DhcpModeType.InterfaceModeManual === k_dataStore.k_dhcp.k_mode) {
k_isIncompatible = true;
k_messages.push(k_tr('DHCP is currently in manual mode. It will be changed to automatic mode if you use DHCP for clients on LAN.', 'connectivityWizard'));
}
} if (k_isIncompatible) {
if (k_isFatal) {
k_incompatiblePage.k_setDescription(k_messages[0]);
k_incompatiblePage.k_getItem('k_fatalError').k_setVisible(true);
k_incompatiblePage.k_getItem('k_continue').k_setVisible(false);
} else {
k_incompatiblePage.k_setInterfaces(k_dataStore, k_mode);
}
this.k_hideLoading('k_incompatiblePage');
}
else {
k_incompatiblePage.k_setInterfaces(k_dataStore);
this.k_hideLoading('k_connectivityPage');
}
} else {
this.k_hide();  }
}, 
k_saveData: function(k_page) {
var
k_tr = kerio.lib.k_tr,
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_mergeObjects = k_WAW_METHODS.k_mergeObjects,
k_mapProperties = k_WAW_METHODS.k_mapProperties,
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
ConnectivityType = k_CONSTANTS.ConnectivityType,
k_dataStore = this.k_dataStore,
k_interfaces = k_dataStore.k_interfaces,
k_data = this.k_getData(true),
k_lanPage = this.k_getPage('k_lanPage'),
k_connectivityMode = k_data.k_connectivityPage.k_connectivityMode,
k_lineMap = this.k_lineMap,
k_line1Map = k_WAW_METHODS.k_prefixObjectValues('k_line1' + '_', k_lineMap, true, false),
k_line2Map = k_WAW_METHODS.k_prefixObjectValues('k_line2' + '_', k_lineMap, true, false),
k_usedIps = [],
k_requests = [],
k_internet1Data,
k_internet2Data,
k_lanData,
k_interface,
k_i, k_cnt;
if (ConnectivityType.Persistent === k_connectivityMode) {
k_internet1Data = k_mapProperties(k_data.k_singleInternetLink, k_line1Map, true);
if (!this.k_isBoxEdition) {
k_internet1Data.id = k_dataStore.k_selectedInternet1;
}
} else {
k_internet1Data = k_mapProperties(k_data.k_twoInternetLinks, k_line1Map, true);
k_internet2Data = k_mapProperties(k_data.k_twoInternetLinks, k_line2Map, true);
if (!this.k_isBoxEdition) {
k_internet1Data.id = k_dataStore.k_selectedInternet1;
k_internet2Data.id = k_dataStore.k_selectedInternet2;
}
}
for (k_i = 0, k_cnt = k_interfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_i];
if (k_interface.ip && -1 < k_usedIps.indexOf(k_interface.ip)) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Validation Warning', 'common'),
k_msg: (this.k_isBoxEdition
? k_tr('IP address %1 is used on two or more connections.', 'connectivityWizard', { k_args: [ k_interface.ip ]} )
: k_tr('IP address %1 is used on two or more interfaces.', 'connectivityWizard', { k_args: [ k_interface.ip ]} )
) + ' ' + k_tr('Each IP address may be used only once.', 'connectivityWizard'),
k_icon: 'warning'
});
return false;
}
k_usedIps.push(k_interface.ip);
} k_lanData = k_lanPage.k_getData(true);
k_lanData = {
id: this.k_isBoxEdition ? null : k_dataStore.k_selectedLan,
ip: (this.k_isLinux) ? k_lanData.k_lanIp : k_interfaces[k_dataStore.k_selectedLan].ip, subnetMask: (this.k_isLinux)
? k_WAW_METHODS.k_convertCidrToMask(k_lanData.k_lanSubnetMask)
: k_interfaces[k_dataStore.k_selectedLan].subnetMask,
dhcpServerEnabled: k_data.k_lanPage.k_dhcpForClients
};
if (this.k_isBoxEdition) {
delete k_lanData.id;
}
if (k_lanPage.k_enableForwarder) {
k_requests.push({
k_jsonRpc: {
method: 'Dns.set',
params: {
config: k_dataStore.k_dns
}
}
});
}
k_requests.push({
k_jsonRpc: {
method: 'ConnectivityAssistant.set',
params: {
config: {
type: k_connectivityMode,
wans: (ConnectivityType.Persistent === k_connectivityMode) ? [k_internet1Data] : [k_internet1Data, k_internet2Data],
lan: k_lanData
},
revertTimeout: 600
}
}
});
k_page.k_setVisible('k_configSaving');
this.k_toolbar.k_showItem('k_btnBack', false);
this.k_toolbar.k_showItem('k_btnFinish', false);
this.k_toolbar.k_showItem('k_btnCancel', false);
this.k_registerCutOffObservers();
kerio.waw.requests.k_sendBatch(k_requests, {
k_scope: this,
k_callback: function(k_response, k_success) {
this.k_unregisterCutOffObservers();
if (k_success) {
this.k_showPage('k_finishPage');
}
else {
this.k_showPage('k_lanPage'); }
}
});
return false;
}, 

k_setupInternetPage: function(k_page) {
var
k_isLinux = this.k_isLinux,
k_tr = kerio.lib.k_tr,
k_data = k_page.k_getData(),
ConnectivityType = kerio.waw.shared.k_CONSTANTS.ConnectivityType,
k_connectivityMode = k_data.k_connectivityMode,
k_singleInternetLinkPage = this.k_getPage('k_singleInternetLink'),
k_twoInternetLinksPage = this.k_getPage('k_twoInternetLinks'),
k_line1Item,
k_line2Item;
this.k_dataStore.k_selectedConnectivityMode = k_connectivityMode;
switch (k_connectivityMode) {
case ConnectivityType.Persistent:
k_page.k_nextPageId = 'k_singleInternetLink';
k_singleInternetLinkPage.k_nextPageId = 'k_lanPage';
break;
case ConnectivityType.LoadBalancing:
k_page.k_nextPageId = 'k_twoInternetLinks';
k_twoInternetLinksPage.k_setTitle(k_tr('Two Internet links with load balancing', 'connectivityWizard'));
k_twoInternetLinksPage.k_setVisible('k_line1' + '_' + 'k_weight' + '_' + 'k_container', true);
k_twoInternetLinksPage.k_setVisible('k_line2' + '_' + 'k_weight' + '_' + 'k_container', true);
k_twoInternetLinksPage.k_setDisabled('k_line1' + '_' + 'k_weight' + '_' + 'k_container', false); k_twoInternetLinksPage.k_setDisabled('k_line2' + '_' + 'k_weight' + '_' + 'k_container', false);
break;
case ConnectivityType.Failover:
k_page.k_nextPageId = 'k_twoInternetLinks';
k_twoInternetLinksPage.k_setTitle(k_tr('Two Internet links with failover', 'connectivityWizard'));
k_twoInternetLinksPage.k_setVisible('k_line1' + '_' + 'k_weight' + '_' + 'k_container', false);
k_twoInternetLinksPage.k_setVisible('k_line2' + '_' + 'k_weight' + '_' + 'k_container', false);
break;
default:
kerio.lib.k_reportError('Internal error: unsupported connectivity mode', 'connectivityWizard', 'k_init');
}
if (k_isLinux) {
if (ConnectivityType.Persistent === k_connectivityMode) {
k_line1Item = k_singleInternetLinkPage.k_getItem('k_line1' + '_' + 'k_ethernetMode');
this.k_onEthernetModeChange.call(k_singleInternetLinkPage, k_singleInternetLinkPage, k_line1Item, k_line1Item.k_getValue());
} else {
k_line1Item = k_twoInternetLinksPage.k_getItem('k_line1' + '_' + 'k_ethernetMode');
k_line2Item = k_twoInternetLinksPage.k_getItem('k_line2' + '_' + 'k_ethernetMode');
this.k_onEthernetModeChange.call(k_twoInternetLinksPage, k_twoInternetLinksPage, k_line1Item, k_line1Item.k_getValue());
this.k_onEthernetModeChange.call(k_twoInternetLinksPage, k_twoInternetLinksPage, k_line2Item, k_line2Item.k_getValue());
}
}
},


_k_fillInterfaces: function(k_page, k_isLine2) {
var
k_interfaceList = [],
k_hiddenItems = [],
k_dataStore = this.k_dataStore,
k_interfaces = this.k_dataStore.k_interfaces,
k_interfaceField = 'k_lanPage' === k_page.k_name ? k_page.k_getItem('k_interface') : k_page.k_getItem((k_isLine2 ? 'k_line2' : 'k_line1') + '_' + 'k_interface'),
k_selectedInternet,
k_interface,
k_i, k_cnt;
k_selectedInternet = k_dataStore.k_selectedInternet1;
if (!k_interfaceField) {
return;
}
if (k_isLine2) {
k_selectedInternet = k_dataStore.k_selectedInternet2;
k_hiddenItems.push(k_dataStore.k_selectedInternet1);
}
else {
k_selectedInternet = k_dataStore.k_selectedInternet1;
}
for (k_i = 0, k_cnt = k_interfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_i];
if (-1 < k_hiddenItems.indexOf(k_interface.id)) { continue;
}
k_interfaceList.push(k_interface);
}
k_dataStore.k_ignoreInterfaceChange = true; k_interfaceField.k_setData(k_interfaceList);
delete k_dataStore.k_ignoreInterfaceChange; if (k_interfaceField.k_containsValue(k_selectedInternet)) {
k_interfaceField.k_setValue(k_selectedInternet);
}
this._k_changeInterface(k_page, k_interfaceField, k_interfaceField.k_getValue());
},

_k_setInterfaceData: function(k_page) {
if (this.k_dataStore._k_interfaceDataSet) {
return;
}
this.k_dataStore._k_interfaceDataSet = true;
var
k_interfaces = this.k_dataStore.k_interfaces,
k_isPersistent = kerio.waw.shared.k_CONSTANTS.ConnectivityType.Persistent === this.k_dataStore.k_selectedConnectivityType,
k_isSwitch = false,
k_isLine1Set = false,
k_isLine2Set = false,
k_item = {k_name: ''},
k_interface,
k_i, k_cnt;
if ('k_lanPage' === k_page.k_id) {
k_isSwitch = true;
}
if (k_isPersistent) {
k_isLine2Set = true;
}
for (k_i = 0, k_cnt = k_interfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_i];
if (k_isSwitch && k_interface.flags.virtualSwitch) {
this._k_changeInterface(k_page, null, k_interface.id);
return;
}
if (!k_isLine1Set && -1 < k_interface.ports.indexOf("1")) {
k_item.k_name = 'k_line1';
this._k_changeInterface(k_page, k_item, k_interface.id);
k_isLine1Set = true;
}
if (!k_isLine2Set && -1 < k_interface.ports.indexOf("2")) {
k_item.k_name = 'k_line2';
this._k_changeInterface(k_page, k_item, k_interface.id);
k_isLine2Set = true;
}
if (k_isLine1Set && k_isLine2Set) {
return;
}
}
},

_k_changeInterface: function(k_page, k_item, k_value) {
var
k_wizard = k_page.k_wizard, k_shared = kerio.waw.shared,
k_WAW_METHODS = k_shared.k_methods,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
InterfaceType = k_WAW_CONSTANTS.InterfaceType,
k_dataStore = k_wizard.k_dataStore,
k_interfaces = k_dataStore.k_interfaces,
k_interface = k_interfaces[k_value], k_isLine1 = false,
k_isLine2 = false,
k_interfaceData,
k_prefix;
if (k_dataStore.k_ignoreInterfaceChange) { return;
}
if (-1 !== k_item.k_name.indexOf('k_line1')) {
k_isLine1 = true;
k_prefix = 'k_line1' + '_';
} else if (-1 !== k_item.k_name.indexOf('k_line2')) {
k_isLine2 = true;
k_prefix = 'k_line2' + '_';
}
if (k_isLine1) {
if (k_interface.id === k_dataStore.k_line1LastEdited) {
return;
}
k_dataStore.k_line1LastEdited = k_interface.id;
} else if (k_isLine2) {
if (k_interface.id === k_dataStore.k_line2LastEdited) {
return;
}
k_dataStore.k_line2LastEdited = k_interface.id;
} else {
if (k_interface.id === k_dataStore.k_lanLastEdited) {
return;
}
k_dataStore.k_lanLastEdited = k_interface.id;
}
switch (k_interface.type) {
case InterfaceType.Ethernet:
case InterfaceType.Ras:
case InterfaceType.DialIn:
if (k_page.k_wizard.InterfaceEncapType.InterfaceEncapPppoe === k_interface.mode) {
k_interface[k_prefix + 'k_userName'] = k_interface.ras.credentials.userName;
k_interface[k_prefix + 'k_password'] = k_interface.ras.credentials.password;
k_interface[k_prefix + 'k_pppoeDnsAutodetected'] = k_interface.dnsAutodetected;
k_interface[k_prefix + 'k_pppoeDnsServers'] = k_interface.dnsServers;
}
k_interfaceData = k_WAW_METHODS.k_mapProperties(k_interface, k_page.k_wizard.k_interfaceMap);
k_interfaceData.k_type = k_interface.type;
kerio.waw.shared.k_methods.k_prefixObjectValues(k_prefix, k_interfaceData, false, true);
k_page.k_setData(k_interfaceData, true); delete k_interface.k_userName;
delete k_interface.k_password;
delete k_interface.k_pppoeDnsAutodetected;
delete k_interface.k_pppoeDnsServers;
k_page.k_setVisible([k_prefix + 'k_gateway', k_prefix + 'k_gatewayAutodetected'], (k_interface.type === InterfaceType.Ethernet));
break;
default:
kerio.lib.k_reportError('Switched to unsupported interface', 'activationWizard', '_k_changeInterface');
}
if (k_isLine1) {
k_dataStore.k_selectedInternet1 = k_interface.id;
k_wizard._k_fillInterfaces(k_page, true);} else if (k_isLine2) {
k_dataStore.k_selectedInternet2 = k_interface.id;
}
}, 
_k_checkDuplicateIp: function(k_page) {
if (!this.k_isLinux || kerio.waw.shared.k_CONSTANTS.ConnectivityType.Persistent === this.k_dataStore.k_selectedConnectivityMode) {
return true;
}
var
k_ip1,
k_ip2,
k_isValid = true;
if (this.InterfaceModeType.InterfaceModeManual === k_page.k_getItem('k_line1' + '_' + 'k_ethernetMode').k_getValue() &&
this.InterfaceModeType.InterfaceModeManual === k_page.k_getItem('k_line2' + '_' + 'k_ethernetMode').k_getValue()
) {
k_ip1 = k_page.k_getItem('k_line1' + '_' + 'k_ip').k_getValue();
k_ip2 = k_page.k_getItem('k_line2' + '_' + 'k_ip').k_getValue();
if (k_ip1 === k_ip2) {
k_isValid = false;
}
}
if (!k_isValid) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Validation Warning', 'common'),
k_msg: (this.k_isBoxEdition)
? kerio.lib.k_tr('Each port must have a unique IP address.', 'connectivityWizard')
: kerio.lib.k_tr('Each interface must have a unique IP address.', 'connectivityWizard'),
k_icon: 'warning'
});
}
return k_isValid;
},

_k_checkLanIp: function(k_page) {
if (!this.k_isLinux) {
return true;
}
var
k_methods = kerio.waw.shared.k_methods,
k_isSingleLine = (kerio.waw.shared.k_CONSTANTS.ConnectivityType.Persistent === this.k_dataStore.k_selectedConnectivityMode),
k_ip1,
k_ip2,
k_ipLan,
k_mask,
k_wizardData = this.k_getData(true),
k_isValid = true;
if (k_isSingleLine) {
k_ip1 = k_wizardData.k_singleInternetLink['k_line1' + '_' + 'k_ip'];
k_ip2 = '0.0.0.0'; }
else {
k_ip1 = k_wizardData.k_twoInternetLinks['k_line1' + '_' + 'k_ip'];
k_ip2 = k_wizardData.k_twoInternetLinks['k_line2' + '_' + 'k_ip'];
}
k_ipLan = k_wizardData.k_lanPage.k_lanIp;
k_mask  = k_wizardData.k_lanPage.k_lanSubnetMask;
k_ip1 = k_methods.k_ipToNumber(k_ip1);
k_ip2 = k_methods.k_ipToNumber(k_ip2);
k_ipLan = k_methods.k_ipToNumber(k_ipLan);
k_mask = k_methods.k_ipToNumber(kerio.waw.shared.k_methods.k_convertCidrToMask(k_mask));
k_ip1 = (k_ip1 & k_mask);
k_ip2 = (k_ip2 & k_mask);
k_ipLan = (k_ipLan & k_mask);
if (this.InterfaceModeType.InterfaceModeManual === k_wizardData[(k_isSingleLine) ? 'k_singleInternetLink' : 'k_twoInternetLinks']['k_line1' + '_' + 'k_ethernetMode'] && k_ip1 === k_ipLan) {
k_isValid = false;
}
if (!k_isSingleLine && this.InterfaceModeType.InterfaceModeManual === k_wizardData.k_twoInternetLinks['k_line2' + '_' + 'k_ethernetMode'] && k_ip2 === k_ipLan) {
k_isValid = false;
}
if (!k_isValid) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Validation Warning', 'common'),
k_msg:   kerio.lib.k_tr('The local network cannot use the same IP address scope as the Internet connection.', 'connectivityWizard'),
k_icon: 'warning'
});
}
return k_isValid;
},


k_setUpLanPage: function(k_page) {
var
k_lanPage = this.k_lanPage,
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_ASSIGNMENT_SWITCH = k_CONSTANTS.PortAssignmentType.PortAssignmentSwitch,
k_interfaces, k_interface,
k_dataStore = this.k_dataStore,
k_dhcp = k_dataStore.k_dhcp,
k_isInSwitch,
k_ports, k_i, k_cnt;
k_dhcp.k_isModeOk = (kerio.waw.shared.k_CONSTANTS.DhcpModeType.DhcpAutomatic === k_dhcp.k_mode);
if (this.k_isBoxEdition) {
k_interfaces = k_dataStore.k_interfaces;
for (k_i = 0, k_cnt = k_interfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_i];
if (k_interface.flags.virtualSwitch) {
k_lanPage.k_lanSettings = {
k_lanIp: k_interface.ip,
k_lanSubnetMask: k_interface.subnetMask,
k_id: k_interface.id,
k_dhcpForClients: k_dhcp.k_isModeOk && k_dhcp.k_enabled && k_interface.dhcpServerEnabled
};
k_dataStore.k_selectedLan = k_interface.id;
}
}
k_lanPage.k_setData(k_lanPage.k_lanSettings);
}
k_lanPage.k_dnsForwarderContainer.k_setVisible(!k_dataStore.k_dns.forwarderEnabled);
k_lanPage.k_dnsForwarderOff.k_setVisible(true ===  k_dataStore.k_dhcp.k_enabled && !k_dataStore.k_dns.forwarderEnabled);
k_lanPage.k_dnsForwarderOn.k_setVisible(false);
},

k_enableDnsForwarder: function(k_enable) {
this.k_dnsForwarderOn.k_setVisible(k_enable);
this.k_dnsForwarderOff.k_setVisible(!k_enable);
this.k_wizard.k_dataStore.k_dns.forwarderEnabled = k_enable;
this.k_enableForwarder = k_enable;
},

k_selectLanInterface: function(k_page, k_item, k_value) {
if (k_page._k_skipLanSelect) {
return;
}
var
k_wizard = k_page.k_wizard,
k_dataStore = k_wizard.k_dataStore,
k_interfaces = k_wizard.k_dataStore.k_interfaces,
k_interface = k_interfaces[k_value],
k_isSecondInternetUsed = (kerio.waw.shared.k_CONSTANTS.ConnectivityType.Persistent !== k_dataStore.k_selectedConnectivityMode),
k_gridData = [],
k_i, k_cnt;
k_dataStore.k_selectedLan = k_interface.id;
if (k_interface.id !== k_dataStore.k_lanLastEdited) {
k_dataStore.k_lanLastEdited = k_interface.id;
k_page.k_setData({
k_lanIp: k_interface.ip,
k_lanSubnetMask: k_interface.subnetMask,
k_dhcpForClients: k_dataStore.k_dhcp.k_isModeOk && k_dataStore.k_dhcp.k_enabled && k_interface.dhcpServerEnabled
});
}
k_cnt = k_interfaces.length;
if (k_cnt !== 0) {
for (k_i = 0; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_i];
if (
k_dataStore.k_selectedInternet1 !==  k_interface.id &&
(!k_isSecondInternetUsed || k_dataStore.k_selectedInternet2 !==  k_interface.id) &&
k_dataStore.k_selectedLan !==  k_interface.id
) {
k_gridData.push(k_interface);
}
}
k_page.k_interfacesGrid.k_setData(k_gridData);
k_page.k_interfacesGridContainer.k_setVisible(k_gridData.length !== 0);
} else {
k_page.k_interfacesGridContainer.k_setVisible(false);
}
},


k_registerCutOffObservers: function() {
if (this.k_registeredCutOffObservers) {
return;
}
this.k_registeredCutOffObservers = true;
this._k_origCloseHandler = this.k_onBeforeClose;
this._k_origShowMask = this.k_showLoading;
this.k_onBeforeClose = function() { return false; }; this.k_showLoading = function() { }; },

k_unregisterCutOffObservers: function() {
if (!this.k_registeredCutOffObservers) {
return;
}
this.k_registeredCutOffObservers = false;
this.k_onBeforeClose = this._k_origCloseHandler;
},

k_onCutOff: function(k_response) {
this.k_hideLoading('k_cutoffBlockPage');
return false;
},

k_onReconnect: function(k_success, k_reverted) {
if (!k_success) {
this.k_hide();
return true;
}
if (k_reverted) {           this.k_hideLoading();   return true;            }
this.k_hideLoading('k_finishPage'); return false;                       },

k_onBeforeClose: function() {
if (this._k_origShowMask) {
this.k_showLoading = this._k_origShowMask; }
if (this.k_assistent) {
this.k_assistent.k_show();
}
},

k_resetPages: function() {
this.k_getPage('k_singleInternetLink').k_reset();
this.k_getPage('k_twoInternetLinks').k_reset();
this.k_getPage('k_lanPage').k_reset();
},

k_getLinkName: function(k_mode, k_orderId, k_ignorePorts) {
var
k_tr = kerio.lib.k_tr,
ConnectivityType = this.ConnectivityType,
k_return,
k_port;
if (!this.k_isBoxEdition || k_ignorePorts) {
k_port = '';
} else if (2 === k_orderId) {
k_port = ' (' + k_tr('Port 2', 'connectivityWizard') + ')';
} else {
k_port = ' (' + k_tr('Port 1', 'connectivityWizard') + ')';
}
switch (k_mode) {
case ConnectivityType.Persistent:
k_return = k_tr('Internet Link', 'connectivityWizard');
break;
case ConnectivityType.Failover:
if (1 === k_orderId) {
k_return = k_tr('Primary Link', 'connectivityWizard');
} else {
k_return = k_tr('Backup Link', 'connectivityWizard');
}
break;
case ConnectivityType.LoadBalancing:
if (1 === k_orderId) {
k_return = k_tr('Internet Link 1', 'connectivityWizard');
} else {
k_return = k_tr('Internet Link 2', 'connectivityWizard');
}
break;
}
return k_return + k_port;
}
}; 