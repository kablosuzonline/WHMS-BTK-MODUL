
kerio.waw.ui.securitySettingsList = {

k_init: function(k_objectName) {
var
MacFilterActionType = kerio.waw.shared.k_CONSTANTS.MacFilterActionType,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_localNamespace = k_objectName + '_',
k_shared = kerio.waw.shared,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_get = k_shared.k_DEFINITIONS.k_get,
k_batchRequests = [],
k_INDEX_GET_SETTINGS = 0,
k_INDEX_GET_INTERFACES_MAC_FILTER = 1,
k_INDEX_GET_INTERFACES_ZERO_CONFIG = 2,
k_INDEX_GET_CONN_LIMIT = 3,
k_INDEX_GET_GEOIP = 4,
k_INDEX_GET_GEOIP_COUNTRIES = 5,
k_isLinux = k_shared.k_methods.k_isLinux(),
k_WINDOWS = k_shared.k_CONSTANTS.k_SERVER.k_OS_WINDOWS,
k_LINUX = k_shared.k_CONSTANTS.k_SERVER.k_OS_LINUX,
k_miscellaneousForm,
k_miscellaneousFormCfg,
k_zeroConfigNetworkForm,
k_zeroConfigNetworkFormCfg,
k_macFilterForm,
k_macFilterFormCfg,
k_ipv6Form,
k_ipv6FormCfg,
k_macFilterInterfacesGridCfg,
k_macFilterInterfacesGrid,
k_macAddressesGridCfg,
k_macAddressesGrid,
k_zeroConfigNetworkGridCfg,
k_zeroConfigNetworkGrid,
k_connectionLimitFormCfg,
k_connectionLimitForm,
k_geoIpFilterBlacklistGridCfg,
k_geoIpFilterBlacklistGrid,
k_geoIpFilterFormCfg,
k_geoIpFilterForm,
k_toolbarCfg,
k_toolbar,
k_tabPageCfg,
k_tabPage,
k_getConnectionField;

k_macFilterInterfacesGridCfg = {
k_title: k_tr('Here you may define interfaces that the MAC filter will be enabled on:', 'securitySettingsList'),
k_isStateful: false,
k_className: 'gridWithSimpleTextAbove',
k_selectionMode: 'k_none',
k_isReadOnly: k_isAuditor,
k_columns: {
k_sorting: {
k_columnId: 'name'
},
k_items: [
{
k_columnId: 'isMacFilterEnabled',
k_isDataOnly: true
},
{
k_columnId: 'name',
k_caption: k_tr('Name', 'common'),

k_renderer: function(k_value) {
var
k_shared = kerio.waw.shared,
k_rendererData = k_shared.k_methods.k_formatInterfaceName(
'',
{
'type':  k_shared.k_CONSTANTS.InterfaceType.Ethernet,
'enabled': true});
return {
k_iconCls: k_rendererData.k_iconCls,
k_data: k_value
};
},
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'isMacFilterEnabled',

k_onChange: function(){
kerio.adm.k_framework.k_enableApplyReset();
}
}
},
{
k_columnId: 'id',
k_isDataOnly: true
}
]
}, k_toolbars: {}
}; k_macFilterInterfacesGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'interfacesGrid', k_macFilterInterfacesGridCfg);
k_macAddressesGridCfg = {
k_isReadOnly: k_isAuditor,
k_columns: {
k_sorting: {
k_columnId: 'macAddress'
},
k_items: [
{
k_columnId: 'macAddress',
k_caption: k_tr('MAC Address', 'securitySettingsList'),
k_width: 115,

k_renderer: function(k_value) {
return {
k_data: this.k_formatMacAddress(k_value)
};
}
},
{
k_columnId: 'description',
k_caption: k_tr('Description', 'common')
}
]
},
k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'securitySettingsMacEditor'
},
k_items: [{
k_type: 'K_GRID_DEFAULT',

k_onRemove: function(k_toolbar) {
k_toolbar.k_relatedWidget.k_removeSelectedRows();
kerio.adm.k_framework.k_enableApplyReset(true);
}
}]
}
}
};
if (k_isAuditor) {
k_macAddressesGridCfg.k_toolbars = {};
}
k_macAddressesGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'macAddressesGrid', k_macAddressesGridCfg);
k_macAddressesGrid.k_addReferences({
k_formatMacAddress: kerio.waw.shared.k_methods.k_formatMacAddress
});
k_macFilterFormCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_isReadOnly: k_isAuditor,
k_items: [
{
k_type: 'k_container',
k_height: 25,
k_items: [
{
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_id: 'enabled',
k_option: k_tr('Enable MAC Filter', 'securitySettingsList')
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Interfaces', 'securitySettingsList'),
k_height: 197, k_items: [
{
k_type: 'k_container',
k_content: k_macFilterInterfacesGrid
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('MAC addresses', 'securitySettingsList'),
k_isResizeableVertically: true,
k_minHeight: 250,
k_items: [
{ k_type: 'k_container',
k_height: 75,
k_items: [
{
k_type: 'k_radio',
k_groupId: 'macFilterAction',
k_value: MacFilterActionType.MacFilterDeny,
k_isChecked: true,
k_isLabelHidden: true,                 k_option: '<span class="ruleProperties radio block">&nbsp; &nbsp; &nbsp;</span>' + k_tr('Prevent listed computers from accessing the network', 'securitySettingsList'),
k_onChange: function(k_form, k_radio, k_value) {
k_form.k_allowReservedCheckbox.k_setDisabled(k_form.MacFilterActionType.MacFilterDeny === k_value);
}
},
{
k_type: 'k_radio',
k_groupId: 'macFilterAction',
k_value: MacFilterActionType.MacFilterAllow,
k_isLabelHidden: true,                 k_option: '<span class="ruleProperties radio allow">&nbsp; &nbsp; &nbsp;</span>' + k_tr('Permit only listed computers to access the network', 'securitySettingsList')
},
{
k_type: 'k_checkbox',
k_id: 'allowReserved',
k_isChecked: true,
k_isDisabled: true,
k_isLabelHidden: true,
k_style: 'margin-left: 37px;',
k_option: k_tr('Also permit MAC addresses used in DHCP reservations or automatic user login', 'securitySettingsList')
}
]
},
{
k_type: 'k_container',
k_minHeight: 120,
k_content: k_macAddressesGrid
}
]
}
] }; k_macFilterForm = new k_lib.K_Form(k_localNamespace + 'k_macFilterTab', k_macFilterFormCfg);
k_macFilterForm.k_addReferences({
MacFilterActionType: MacFilterActionType,
k_allowReservedCheckbox: k_macFilterForm.k_getItem('allowReserved')
});

k_ipv6FormCfg = {
k_restrictBy: {
k_serverOs: (k_isLinux ? k_LINUX : k_WINDOWS)
},
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_isReadOnly: k_isAuditor,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Tunneled IPv6', 'securitySettingsList'),
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'ipv6.blockTunnels',
k_option: k_tr('Block tunneled IPv6 (6to4, 6in4, Teredo)', 'securitySettingsList'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled('k_exceptions', !k_isChecked);
}
},
{
k_type: 'k_columns',
k_id: 'k_exceptions',
k_isDisabled: true,
k_indent: 1,
k_items: [
{
k_type: 'k_checkbox',
k_width: 270,
k_id: 'ipv6.addressGroupException.enabled',
k_isLabelHidden: true,
k_option: k_tr('Except for the following IPv4 hosts:', 'securitySettingsList'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled('ipv6.addressGroupException.id', !k_isChecked);
}
},
{
k_type: 'k_definitionSelect',
k_id: 'ipv6.addressGroupException.id',
k_isLabelHidden: true,
k_width: 230,
k_definitionType: 'k_ipAddress',
k_showApplyReset: true,
k_allowFiltering: true,
k_pageSize: 500,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_isDisabled: true,
k_onApplyResetHandler: k_shared.k_methods.k_definitionApplyResetHandler
}
]
}
]
}
] }; k_ipv6Form = new k_lib.K_Form(k_localNamespace + 'k_ipv6Tab', k_ipv6FormCfg);

k_getConnectionField = function(k_config) {
return {
k_type: 'k_row',
k_indent: k_config.k_indent || 0,
k_items: [
{
k_type: 'k_checkbox',
k_id: k_config.k_id +'.enabled',
k_isLabelHidden: true,
k_width: k_config.k_indent ? 480 : 500,
k_option: k_config.k_text,
k_onChange: function(k_form, k_checkbox, k_isChecked) {
var k_valueInputId = k_checkbox.k_name.split('.');
k_valueInputId[k_valueInputId.length - 1] = 'value';
k_form.k_setDisabled([k_valueInputId.join('.')], !k_isChecked);
}
},
{
k_type: 'k_number',
k_id: k_config.k_id + '.value',
k_minValue: 1,
k_maxValue: 99999,
k_maxLength: 5,
k_width:50,
k_isLabelHidden: true,
k_isDisabled: true,
k_validator: {
k_allowBlank: false
}
}
]
};
};

k_connectionLimitFormCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_isReadOnly: k_isAuditor,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Connection limits', 'securitySettingsList'),
k_labelWidth: 180,
k_items: [
k_getConnectionField({k_id: 'srcLimit', k_text: k_tr('Limit maximum concurrent connections from 1 source IP address', 'securitySettingsList')}),
k_getConnectionField({k_id: 'srcRateLimit', k_text: k_tr('Limit new connections per minute from 1 source IP address', 'securitySettingsList')}),
{
k_type: 'k_display',
k_isLabelHidden: true,
k_style: 'padding-top: 20px;',
k_value: k_tr('For inbound connections:', 'securitySettingsList')
},
k_getConnectionField({k_id: 'dstLimit', k_text: k_tr('Limit maximum concurrent inbound connections to 1 destination IP address', 'securitySettingsList')}),
k_getConnectionField({k_id: 'dstPerSrcLimit', k_text: k_tr('Limit maximum concurrent inbound connections to 1 destination IP address from the same source', 'securitySettingsList')}),
{
k_type: 'k_columns',
k_style: 'padding-top: 20px;',
k_items: [
{
k_id: 'exclusions.enabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_width: 370,
k_option: k_tr('Use different settings for any connection from/to this IP address group:', 'securitySettingsList'),

k_onChange: function (k_form, k_element, k_isChecked) {
if (!k_element.k_isDisabled()) {
k_form.k_setDisabled(['exclusions.value.id'], !k_isChecked);
k_form.k_setDisabled(['k_connectionExclusionContainer'], !k_isChecked);
}
}
},
{
k_type: 'k_definitionSelect',
k_id: 'exclusions.value.id',
k_isLabelHidden: true,
k_width: 180,
k_definitionType: 'k_ipAddress',
k_showApplyReset: true,
k_allowFiltering: true,
k_pageSize: 500,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_isDisabled: true,
k_onApplyResetHandler: k_shared.k_methods.k_definitionApplyResetHandler
}
]
},
{
k_type: 'k_container',
k_id: 'k_connectionExclusionContainer',
k_isDisabled: true,
k_items: [
k_getConnectionField({k_id: 'exclSrcLimit', k_text: k_tr('Limit maximum concurrent connections from 1 source IP address', 'securitySettingsList'), k_indent: 1}),
k_getConnectionField({k_id: 'exclSrcRateLimit', k_text: k_tr('Limit new connections per minute from 1 source IP address', 'securitySettingsList'), k_indent: 1})
]
}
]
}
]
};
k_connectionLimitForm = new k_lib.K_Form(k_localNamespace + 'k_connectionLimitForm', k_connectionLimitFormCfg);
k_connectionLimitForm.k_addReferences({
k_connectionExclusionList: k_connectionLimitForm.k_getItem('exclusions.value.id'),
k_connectionExclusionListLoader: new kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_ipAddressGroupList',
k_select: 'exclusions.value.id',
k_form: k_connectionLimitForm,
k_addNoneOption: false
})
});

k_geoIpFilterBlacklistGridCfg = {
k_isReadOnly: k_isAuditor,
k_emptyMsg: k_tr('No blocked country', 'securitySettingsList'),
k_columns: {
k_sorting: {
k_columnId: 'k_sortingIndex'
},
k_items: [
{
k_columnId: 'k_value',
k_isDataOnly: true
},
{
k_columnId: 'k_name',
k_isHidden: true,
k_isKeptHidden: true
},
{
k_columnId: 'k_sortingIndex',
k_caption: k_tr('Country', 'common'),
k_renderer: function(k_value, k_data) {
return {
k_data: k_data.k_name
};
},
k_isSortable: true
}
]
},
k_toolbars: {}
};
if (!k_isAuditor) {
k_geoIpFilterBlacklistGridCfg.k_toolbars = {
k_bottom: {
k_items: [
{
k_id: 'k_btnAdd',
k_caption: k_tr('Add…', 'common'),
k_type: 'K_BTN_ADD',

k_onClick: function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget,
k_params = {
k_onlyFixItems: true,
k_fixItems: k_grid.k_geoIpAllCountriesList,
k_parentGrid: k_grid,
k_parentGridIdColumn: 'k_value',
k_id: 'k_value',
k_autoAddCallback: function(){
kerio.adm.k_framework.k_enableApplyReset(true);
}
};
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'selectItems',
k_objectName: 'selectGeoipCountries',
k_params: k_params
});
}
},
{
k_id: 'k_btnRemove',
k_caption: k_tr('Remove', 'common'),
k_type: 'K_BTN_REMOVE',
k_onClick: function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget;
if (0 < k_grid.k_selectionStatus.k_selectedRowsCount) {
k_grid.k_removeSelectedRows();
kerio.adm.k_framework.k_enableApplyReset(true);
}
}
}
]
}
};
}
k_geoIpFilterBlacklistGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'blacklistGrid', k_geoIpFilterBlacklistGridCfg);
k_geoIpFilterFormCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_isReadOnly: k_isAuditor,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_container',
k_height: 25,
k_items: [
{
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_id: 'enabled',
k_option: k_tr('Block incoming traffic from the following countries', 'securitySettingsList')
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Blocked countries', 'securitySettingsList'),
k_labelWidth: 180,
k_anchor: "0 -30",
k_items: [
{
k_type: 'k_container',
k_anchor: "0 -20",
k_content: k_geoIpFilterBlacklistGrid
}
]
}
]
};
k_geoIpFilterForm = new k_lib.K_Form(k_localNamespace + 'k_geoIpFilterForm', k_geoIpFilterFormCfg);

k_miscellaneousFormCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_isReadOnly: k_isAuditor,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Anti-spoofing', 'securitySettingsList'),
k_items: [
{
k_type: 'k_checkbox',
k_id: 'antiSpoofing.enabled',
k_isLabelHidden: true,
k_option: k_tr('Enable anti-spoofing', 'securitySettingsList'),

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled(['antiSpoofing.log'], !k_isChecked);
}
},
{
k_type: 'k_checkbox',
k_id: 'antiSpoofing.log',
k_isLabelHidden: true,
k_isDisabled: true,
k_option: k_tr('Log', 'securitySettingsList')
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('DHCP scopes', 'securitySettingsList'),
k_isLabelHidden: true,
k_items: [
{
k_id: 'dhcpScopes.blockUnknownIp',
k_type: 'k_checkbox',
k_option: k_tr('Block IP addresses which are not assigned by DHCP server', 'domainsAuthenticationList'),

k_onChange: function(k_form, k_element, k_isChecked) {
k_form.k_setDisabled(['k_dhcpScopesBlocking', 'dhcpScopes.log', 'k_dhcpScopesReservationInfo'], !k_isChecked);
k_form.k_setDisabled(['dhcpScopes.blockScopeId.value'], !k_isChecked || !k_form.k_getItem('dhcpScopes.blockScopeId.enabled').k_isChecked());
}
},
{
k_type: 'k_columns',
k_indent: 1,
k_id: 'k_dhcpScopesBlocking',
k_isDisabled: true,
k_items: [
{
k_id: 'dhcpScopes.blockScopeId.enabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Apply only to this scope:', 'securitySettingsList'),

k_onChange: function (k_form, k_element, k_isChecked) {
if (!k_element.k_isDisabled()) {
k_form.k_setDisabled(['dhcpScopes.blockScopeId.value'], !k_isChecked);
}
}
},
{
k_id: 'dhcpScopes.blockScopeId.value',
k_type: 'k_select',
k_width: 180,
k_isLabelHidden: true,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: []
}
]
},
{
k_id: 'k_dhcpScopesReservationInfo',
k_type: 'k_display',
k_indent: 1,
k_isDisabled: true,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('IP addresses used in DHCP reservations by MAC address are always allowed', 'securitySettingsList')
},
{
k_id: 'dhcpScopes.log',
k_type: 'k_checkbox',
k_isChecked: true,
k_isDisabled: true,
k_option: k_tr('Log', 'securitySettingsList')
}
]
}
]
}; k_miscellaneousForm = new k_lib.K_Form(k_localNamespace + 'k_miscellaneousTab', k_miscellaneousFormCfg);

k_zeroConfigNetworkGridCfg = {
k_title: k_tr('Enable %1Service Discovery forwarding%2 on:', 'securitySettingsList', {k_isSecure: true, k_args: ['<a href="http://kb.kerio.com/1710" target="_blank" onclick="kerio.waw.shared.k_methods.k_openSpecificKbArticle(1710);return false;">', '</a>']}),
k_isStateful: false,
k_className: 'gridWithSimpleTextAbove nullTitlePadding',
k_selectionMode: 'k_none',
k_isReadOnly: k_isAuditor,
k_columns: {
k_sorting: {
k_columnId: 'name'
},
k_items: [
{
k_columnId: 'isZeroConfigEnabled',
k_isDataOnly: true
},
{
k_columnId: 'name',
k_caption: k_tr('Name', 'common'),

k_renderer: function(k_value, k_rowData, k_rowIndex, k_columnIndex, k_grid) {
var
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
InterfaceType = k_CONSTANTS.InterfaceType,
VpnType = k_CONSTANTS.VpnType,
ZeroConfigItemType = k_CONSTANTS.ZeroConfigItemType,
k_type = k_rowData.type,
k_iconCls = 'interfaceIcon ',
k_rendererData = '',
k_formatterConfig,
k_tunnel;
switch (k_type) {
case ZeroConfigItemType.ZeroConfigVpnClients:
k_rendererData = k_grid.k_trVpnClients;
k_iconCls += 'interfaceAllVpnTunnels';
break;
case InterfaceType.VpnTunnel: k_tunnel = k_grid.k_zeroConfigNetworkInterfaces[k_rowData.id];
if (k_tunnel) {
if (VpnType.VpnIpsec === k_tunnel.tunnel.type) {
k_iconCls += 'interfaceIpsecTunnel';
}
else {
k_iconCls += 'interfaceVpnTunnel';
}
k_rendererData = k_tunnel.name;
}
break;
default: k_formatterConfig = {
'type':  k_rowData.type,
'enabled': true
};
k_rendererData = k_shared.k_methods.k_formatInterfaceName('', k_formatterConfig);
k_iconCls = k_rendererData.k_iconCls;
k_rendererData = k_value;
break;
}
return {
k_iconCls: k_iconCls,
k_data: k_rendererData
};
},
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'isZeroConfigEnabled',

k_onChange: function(){
kerio.adm.k_framework.k_enableApplyReset();
}
}
},
{
k_columnId: 'id',
k_isDataOnly: true
}
]
},
k_toolbars: {}
};
k_zeroConfigNetworkGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'k_zeroConfigNetworkGrid', k_zeroConfigNetworkGridCfg);
k_zeroConfigNetworkFormCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_isReadOnly: k_isAuditor,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Service Discovery forwarding', 'securitySettingsList'),
k_height: 280, k_items: [
{
k_type: 'k_checkbox',
k_id: 'enabled',
k_isLabelHidden: true,
k_isSecure: true,
k_option: k_tr('Enable Service Discovery forwarding', 'securitySettingsList')
},
{
k_type: 'k_container',
k_content: k_zeroConfigNetworkGrid
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('UPnP service', 'securitySettingsList'),
k_items: [
{
k_type: 'k_checkbox',
k_id: 'upnp.enabled',
k_isLabelHidden: true,
k_option: k_tr('Enable UPnP service', 'securitySettingsList'),

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled(['upnp.logPackets', 'upnp.logConnections'], !k_isChecked);
}
},
{
k_type: 'k_checkbox',
k_id: 'upnp.logPackets',
k_isLabelHidden: true,
k_isDisabled: true,
k_option: k_tr('Log packets', 'securitySettingsList')
},
{
k_type: 'k_checkbox',
k_id: 'upnp.logConnections',
k_isLabelHidden: true,
k_isDisabled: true,
k_option: k_tr('Log connections', 'securitySettingsList')
}
]
}
]
};
k_zeroConfigNetworkForm = new k_lib.K_Form(k_localNamespace + 'k_zeroConfigNetworkTab', k_zeroConfigNetworkFormCfg);
k_miscellaneousForm.k_addReferences({
k_dhcpScopesList: k_miscellaneousForm.k_getItem('dhcpScopes.blockScopeId.value'),
k_dhcpScopesListListLoader: new kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_dhcpScopesList',
k_select: 'dhcpScopes.blockScopeId.value',
k_form: k_miscellaneousForm
})
});
k_ipv6Form.k_addReferences({
k_addressGroupException: k_ipv6Form.k_getItem('ipv6.addressGroupException.id'),
k_addressGroupExceptionListLoader: kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_ipAddressGroupList',
k_select: 'ipv6.addressGroupException.id',
k_form: k_ipv6Form,
k_addNoneOption: false
})
});
k_tabPageCfg = {
k_className: 'mainList',
k_items: [
{
k_caption: k_tr('MAC Filter', 'securitySettingsList'),
k_content: k_macFilterForm,
k_id: 'k_macFilter'
},
{
k_caption: k_tr('IPv6', 'securitySettingsList'),
k_content: k_ipv6Form,
k_id: 'k_ipv6'
},
{
k_caption: 'Zero-configuration Networking',
k_content: k_zeroConfigNetworkForm,
k_id: 'k_zeroConfigNetworkForm'
},
{
k_caption: k_tr('Connection Limits', 'securitySettingsList'),
k_content: k_connectionLimitForm,
k_id: 'k_connectionLimitForm'
},
{
k_caption: k_tr('GeoIP Filter', 'securitySettingsList'),
k_content: k_geoIpFilterForm,
k_id: 'k_geoIpFilterForm'
},
{
k_caption: k_tr('Miscellaneous', 'securitySettingsList'),
k_content: k_miscellaneousForm,
k_id: 'k_miscellaneous'
}
]
};
if (!k_isAuditor) {

k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function() {
this.k_parentWidget.k_saveData();
return false;
},

k_onReset: function() {
this.k_parentWidget.k_loadData();
}
};
k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
k_tabPageCfg.k_toolbars = {
k_bottom: k_toolbar
};
}
k_tabPage = new k_lib.K_TabPage(k_objectName, k_tabPageCfg);
k_batchRequests[k_INDEX_GET_SETTINGS] = {
method: 'SecuritySettings.get'
};
k_batchRequests[k_INDEX_GET_INTERFACES_MAC_FILTER] = {
method: 'Interfaces.get',
params: {
'sortByGroup':true,
'query': {
conditions: [k_shared.k_DEFINITIONS.k_interfaceEthernetCondition],
combining: k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_And,
orderBy: [
{
columnName: 'name',
direction: k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Asc
}
]
}
}
};
k_batchRequests[k_INDEX_GET_INTERFACES_ZERO_CONFIG] = {
method: 'Interfaces.get',
params: {
sortByGroup: true,
query: k_shared.k_DEFINITIONS.k_get('k_zeroConfigNetworkInterfacesQuery')
}
};
k_batchRequests[k_INDEX_GET_CONN_LIMIT] = {
method: 'ConnLimit.get'
};
k_batchRequests[k_INDEX_GET_GEOIP] = {
method: 'Geoip.get'
};
k_batchRequests[k_INDEX_GET_GEOIP_COUNTRIES] = {
method: 'Geoip.getCountries'
};
k_tabPage.k_addReferences({
k_toolbar: k_toolbar,
k_INDEX_GET_SETTINGS: k_INDEX_GET_SETTINGS,
k_INDEX_GET_INTERFACES_MAC_FILTER: k_INDEX_GET_INTERFACES_MAC_FILTER,
k_INDEX_GET_INTERFACES_ZERO_CONFIG: k_INDEX_GET_INTERFACES_ZERO_CONFIG,
k_INDEX_GET_CONN_LIMIT: k_INDEX_GET_CONN_LIMIT,
k_INDEX_GET_GEOIP: k_INDEX_GET_GEOIP,
k_INDEX_GET_GEOIP_COUNTRIES: k_INDEX_GET_GEOIP_COUNTRIES,
k_miscellaneousForm: k_miscellaneousForm,
k_macFilterInterfacesGrid: k_macFilterInterfacesGrid,
k_macFilterForm: k_macFilterForm,
k_connectionLimitForm: k_connectionLimitForm,
k_geoIpFilterBlacklistGrid: k_geoIpFilterBlacklistGrid,
k_geoIpFilterForm: k_geoIpFilterForm,
k_zeroConfigNetworkForm: k_zeroConfigNetworkForm,
k_zeroConfigNetworkGrid: k_zeroConfigNetworkGrid,
k_ipv6Form: k_ipv6Form,
k_macAddressesGrid: k_macAddressesGrid,
k_dataStore: {}
});
k_zeroConfigNetworkGrid.k_addReferences({
k_zeroConfigNetworkInterfaces: [],
k_trVpnClients: k_tr('Kerio Control VPN Clients', 'trafficRuleList')
});
k_geoIpFilterBlacklistGrid.k_addReferences({
k_geoIpAllCountriesList: undefined
});
this.k_addControllers(k_tabPage);
k_tabPage.k_addReferences({
k_loadDataBatchParams: {
k_requests: k_batchRequests,
k_scope: k_tabPage,
k_callback: k_tabPage.k_loadDataCallback,
k_requestOwner: k_tabPage
},
k_saveSecuritySettingsRequest: {
k_jsonRpc: {
method: 'SecuritySettings.set'
},
k_callback: k_tabPage.k_onApplyResetCallback,
k_scope: k_tabPage
},
k_saveConnectionLimitRequest: {
k_jsonRpc: {
method: 'ConnLimit.set'
}
},
k_saveGeoipBlockedCountries: {
k_jsonRpc: {
method: 'Geoip.set'
}
}
});
return k_tabPage;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_macAddressesGrid.k_addMacAddress = function(k_macAddressData, k_isEditMode) {
var
k_gridData = this.k_getData(),
k_cnt = k_gridData.length,
k_macAddress = k_macAddressData.macAddress,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_gridData[k_i].macAddress === k_macAddress) {
if (k_isEditMode && this.k_isRowSelected(k_i)) {
continue; }
return false;
}
}
if (k_isEditMode) {
this.k_removeSelectedRows();
}
this.k_appendRow(k_macAddressData);
this.k_resortRows();
return true;
};

k_kerioWidget.k_applyParams = function() {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
kerio.waw.shared.k_data.k_get('k_ipAddressGroups');
this.k_ipv6Form.k_addressGroupExceptionListLoader.k_sendRequest();
this.k_miscellaneousForm.k_dhcpScopesListListLoader.k_sendRequest();
this.k_connectionLimitForm.k_connectionExclusionListLoader.k_sendRequest();
kerio.waw.status.k_currentScreen.k_gotoTab(this, 'k_macFilter');
this.k_loadData();
};

k_kerioWidget.k_loadData = function() {
kerio.waw.shared.k_methods.k_maskMainScreen();
kerio.waw.shared.k_methods.k_sendBatch(this.k_loadDataBatchParams);
};

k_kerioWidget.k_onApplyResetCallback = function(k_response) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
if (kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
kerio.adm.k_framework.k_enableApplyReset(false);
if (!kerio.adm.k_framework.k_leaveCurrentScreen()) {
this.k_loadData();
}
}
};

k_kerioWidget.k_loadDataCallback = function(k_response) {
var
k_methods = kerio.waw.shared.k_methods,
k_macAddressesGrid = this.k_macAddressesGrid,
k_config,
k_macFilterCfg,
k_miscSettings,
k_zeroConfigNetwork,
k_batchResult,
k_allInterfaces,
k_usedInterfaces,
k_selectedRowData,
k_macAddress,
k_index,
k_configGeoip,
k_configGeoipCountries,
k_configGeoipCountriesLocalised,
k_configGeoipBlockedCountries = [],
k_i;
if (!k_response.k_isOk) {
k_methods.k_unmaskMainScreen();
return;
}
k_batchResult = k_response.k_decoded.batchResult;
k_config = k_batchResult[this.k_INDEX_GET_SETTINGS].config;
this.k_dataStore = k_config;
k_macFilterCfg = k_config.macFilter;
this.k_macFilterForm.k_setData(k_macFilterCfg);
k_selectedRowData = k_macAddressesGrid.k_getRowsData(true);
k_macAddressesGrid.k_setData(k_macFilterCfg.macAccessItems);
if (k_selectedRowData && 0 < k_selectedRowData.length) {
k_macAddress = k_selectedRowData[0].macAddress;
k_index = k_macAddressesGrid.k_findRow('macAddress', k_macAddress);
if (-1 !== k_index) {
k_macAddressesGrid.k_selectRows(k_index);
}
}
k_allInterfaces = k_batchResult[this.k_INDEX_GET_INTERFACES_MAC_FILTER].list;
k_usedInterfaces = k_macFilterCfg.interfaces;
this._k_fillMacFilterGrid(k_allInterfaces, k_usedInterfaces);
k_zeroConfigNetwork = k_config.zeroConfigNetwork;
this.k_zeroConfigNetworkForm.k_setData(k_zeroConfigNetwork);
k_allInterfaces = k_batchResult[this.k_INDEX_GET_INTERFACES_ZERO_CONFIG].list;
k_usedInterfaces = k_zeroConfigNetwork.items;
this._k_fillZeroConfigGrid(k_allInterfaces, k_usedInterfaces);
k_configGeoipCountries = k_batchResult[this.k_INDEX_GET_GEOIP_COUNTRIES].geoipCountries;
k_configGeoipCountriesLocalised = kerio.waw.shared.k_DEFINITIONS.k_getLimitedSortedCountries('geoip', k_configGeoipCountries);
this.k_geoIpFilterBlacklistGrid.k_geoIpAllCountriesList = k_configGeoipCountriesLocalised;
k_configGeoip = k_batchResult[this.k_INDEX_GET_GEOIP].config;
this.k_geoIpFilterForm.k_setData(k_configGeoip);
k_configGeoipBlockedCountries = k_configGeoip.blockedCountries.map(function(item) {
var k_item = kerio.waw.shared.k_DEFINITIONS.k_MAP_COUNTRIES[item];
return {
k_value: item,
k_sortingIndex: k_item.k_sortingIndex,
k_name: k_item.k_name
};
});
this.k_geoIpFilterBlacklistGrid.k_setData(k_configGeoipBlockedCountries);
k_miscSettings = k_config.miscSettings;
this.k_miscellaneousForm.k_setData(k_miscSettings);
this.k_ipv6Form.k_setData(k_miscSettings);
this.k_zeroConfigNetworkForm.k_setData(k_miscSettings);
this.k_ipv6Form.k_addressGroupExceptionListLoader.k_selectValue(k_miscSettings.ipv6.addressGroupException);
this.k_miscellaneousForm.k_dhcpScopesListListLoader.k_selectValue({k_id: k_miscSettings.dhcpScopes.blockScopeId.value}, true);
k_config = k_batchResult[this.k_INDEX_GET_CONN_LIMIT].config;
this.k_connectionLimitForm.k_setData(k_config);
this.k_connectionLimitForm.k_connectionExclusionListLoader.k_selectValue(k_miscSettings.connectionLimit.exclusions.value, true);
kerio.adm.k_framework.k_enableApplyReset(false);
k_methods.k_unmaskMainScreen();
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_dialogs: ['securitySettingsMacEditor'],
k_data: ['k_dhcpScopesList']
});
}; 
k_kerioWidget.k_saveData = function() {
var
k_shared = kerio.waw.shared,
k_WAW_METHODS = k_shared.k_methods,
k_mergeObjects = k_WAW_METHODS.k_mergeObjects,
k_CONSTANTS = k_shared.k_CONSTANTS,
InterfaceType = k_CONSTANTS.InterfaceType,
ZeroConfigItemType = k_CONSTANTS.ZeroConfigItemType,
k_config = this.k_dataStore,
k_macData = k_config.macFilter,
k_ipv6Exceptions = {id: '', name: ''},
k_zeroConfigNetworkGrid = this.k_zeroConfigNetworkGrid,
k_usedInterfaces,
k_interface,
k_interfaces,
k_connLimitConfig,
k_geoipConfig, k_geoipBlockedCountries,
k_i, k_cnt,
k_type;
k_WAW_METHODS.k_maskMainScreen();
k_config.miscSettings = this.k_miscellaneousForm.k_getData(true);
k_mergeObjects(this.k_ipv6Form.k_getData(true), k_config.miscSettings);
if (0 !== this.k_ipv6Form.k_addressGroupException.k_getValueCount()) {
k_ipv6Exceptions = this.k_ipv6Form.k_addressGroupException.k_getValue();
delete k_ipv6Exceptions.invalid; }
k_mergeObjects(k_ipv6Exceptions, k_config.miscSettings.ipv6.addressGroupException);
k_usedInterfaces = this.k_macFilterInterfacesGrid.k_findRowBy(
this._k_findMacFilterInterfaceBy,
this.k_macFilterInterfacesGrid,
0,
true);
k_interfaces = [];
if (k_usedInterfaces) { for (k_i = 0, k_cnt = k_usedInterfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_usedInterfaces[k_i];
k_interfaces.push({
id: k_interface.id,
name: k_interface.name,
invalid: false
});
}
}
k_macData.interfaces = k_interfaces;
k_mergeObjects(this.k_macFilterForm.k_getData(true), k_macData);
k_mergeObjects(this.k_macAddressesGrid.k_getData(), k_macData, 'macAccessItems');
k_config.zeroConfigNetwork = this.k_zeroConfigNetworkForm.k_getData();
k_config.miscSettings.upnp = k_config.zeroConfigNetwork.upnp;
delete k_config.zeroConfigNetwork.upnp;
k_usedInterfaces = k_zeroConfigNetworkGrid.k_findRowBy(
this._k_findZroConfigNetworkInterfaceBy,
k_zeroConfigNetworkGrid,
0,
true);
k_interfaces = [];
if (k_usedInterfaces) { for (k_i = 0, k_cnt = k_usedInterfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_usedInterfaces[k_i];
switch (k_interface.type) {
case ZeroConfigItemType.ZeroConfigVpnClients:
k_type = ZeroConfigItemType.ZeroConfigVpnClients;
break;
case InterfaceType.VpnTunnel: k_type = ZeroConfigItemType.ZeroConfigVpnTunnel;
break;
default:
k_type = ZeroConfigItemType.ZeroConfigInterface;
break;
}
k_interfaces.push({
type: k_type,
item: {
id: k_interface.id,
name: k_interface.name,
invalid: false
}
});
}
}
k_config.zeroConfigNetwork.items = k_interfaces;
this.k_saveSecuritySettingsRequest.k_jsonRpc.params = { config: k_config };
k_geoipConfig = this.k_geoIpFilterForm.k_getData();
k_geoipBlockedCountries = this.k_geoIpFilterBlacklistGrid.k_getData();
k_geoipConfig.blockedCountries = k_geoipBlockedCountries.map(function(item){
return item.k_value;
});
this.k_saveGeoipBlockedCountries.k_jsonRpc.params = { config: k_geoipConfig };
k_connLimitConfig = this.k_connectionLimitForm.k_getData();
if (k_connLimitConfig.exclusions.enabled) {
k_connLimitConfig.exclusions.value.id = this.k_connectionLimitForm.k_connectionExclusionListLoader.k_getValue().id;
}
this.k_saveConnectionLimitRequest.k_jsonRpc.params = { config: k_connLimitConfig };
kerio.waw.requests.k_sendBatch([this.k_saveSecuritySettingsRequest, this.k_saveConnectionLimitRequest, this.k_saveGeoipBlockedCountries]);
}; 
k_kerioWidget._k_findMacFilterInterfaceBy = function(k_data) {
return k_data.isMacFilterEnabled;
};

k_kerioWidget._k_findZroConfigNetworkInterfaceBy = function(k_data) {
return k_data.isZeroConfigEnabled;
};

k_kerioWidget._k_fillMacFilterGrid = function(k_allInterfaces, k_usedInterfaces) {
var
k_interfaces = [],
k_interface,
k_i, k_cnt,
k_item;
for (k_i = 0, k_cnt = k_allInterfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_allInterfaces[k_i];
k_item = {
name: k_interface.name,
id: k_interface.id,
isMacFilterEnabled: false
};
k_interfaces.push(k_item);
k_interfaces[k_interface.id] = k_item;
}
if (k_interfaces.length) {
for (k_i = 0, k_cnt = k_usedInterfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_usedInterfaces[k_i].id];
if (k_interface) {
k_interface.isMacFilterEnabled = true;
}
}
this.k_macFilterInterfacesGrid.k_setData(k_interfaces);
}
else {
this.k_macFilterInterfacesGrid.k_resetGrid(); }
};

k_kerioWidget._k_fillZeroConfigGrid = function(k_allInterfaces, k_usedInterfaces) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
VpnServer = k_CONSTANTS.InterfaceType.VpnServer,
ZeroConfigVpnClients = k_CONSTANTS.ZeroConfigItemType.ZeroConfigVpnClients,
k_PPPoE_ENCAPSULATION = k_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe,
k_RAS_TYPE = k_CONSTANTS.InterfaceType.Ras,
VpnIpsec = k_CONSTANTS.VpnType.VpnIpsec,
k_ALL_VPN_CLIENTS_ID = 'all_vpn_clients',
k_zeroConfigNetworkGrid = this.k_zeroConfigNetworkGrid,
k_zeroConfigNetworkInterfaces = [],
k_interfaces = [],
k_interfacesById = [],
k_interface,
k_i, k_cnt,
k_item,
k_id;
for (k_i = 0, k_cnt = k_allInterfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_allInterfaces[k_i];
if (VpnServer === k_interface.type || k_PPPoE_ENCAPSULATION === k_interface.encap || k_RAS_TYPE === k_interface.type || VpnIpsec === k_interface.tunnel.type) {
continue;
}
k_item = {
name: k_interface.name,
id: k_interface.id,
type: k_interface.type,
isZeroConfigEnabled: false
};
k_interfaces.push(k_item);
k_interfacesById[k_interface.id] = k_item;
k_zeroConfigNetworkInterfaces[k_interface.id] = k_interface;
}
k_item = {
name: k_zeroConfigNetworkGrid.k_trVpnClients,
id: k_ALL_VPN_CLIENTS_ID,
type: ZeroConfigVpnClients,
isZeroConfigEnabled: false
};
k_interfaces.push(k_item);
k_interfacesById[k_ALL_VPN_CLIENTS_ID] = k_item;
k_zeroConfigNetworkGrid.k_zeroConfigNetworkInterfaces = k_zeroConfigNetworkInterfaces;
if (k_interfaces.length) {
for (k_i = 0, k_cnt = k_usedInterfaces.length; k_i < k_cnt; k_i++) {
k_id = ZeroConfigVpnClients === k_usedInterfaces[k_i].type ? k_ALL_VPN_CLIENTS_ID : k_usedInterfaces[k_i].item.id;
k_interface = k_interfacesById[k_id];
if (k_interface) {
k_interface.isZeroConfigEnabled = true;
}
}
k_zeroConfigNetworkGrid.k_setData(k_interfaces);
}
else {
k_zeroConfigNetworkGrid.k_resetGrid(); }
};
} };