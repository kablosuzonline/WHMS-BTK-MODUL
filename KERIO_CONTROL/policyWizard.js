
kerio.waw.ui.policyWizard = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_isLinux = k_shared.k_methods.k_isLinux(),
k_isBoxEdition = k_shared.k_methods.k_isBoxEdition(),
k_isWifiAvailable = k_shared.k_methods.k_isWifiAvailable(),
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_WINDOWS       = k_WAW_CONSTANTS.k_SERVER.k_OS_WINDOWS,
k_LINUX         = k_WAW_CONSTANTS.k_SERVER.k_OS_LINUX,
k_NO_PAGE       = kerio.lib.K_Wizard2.prototype.k_NO_PAGE,
k_toolbarCfg,
k_grid, k_gridCfg,
k_wizard, k_wizardCfg,
k_policyPage,
k_firewallServicesPage,
k_trustedGuestGroupWithVpnEntity;

k_toolbarCfg = {
k_hasSharedMenu: true,
k_items: [
{
k_type: 'K_GRID_DEFAULT',

k_onAdd: function(k_toolbar) {
k_toolbar.k_relatedWidget.k_openDialog(false);
return false;
},

k_onEdit: function(k_toolbar) {
k_toolbar.k_relatedWidget.k_openDialog(true);
},

k_onRemove: function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget,
k_selection = k_grid.k_selectionStatus,
k_cnt = k_selection.k_selectedRowsCount,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_selection.k_rows[k_i].k_data.k_locked) {
k_grid.k_confirmDelete();
return;
}
}
k_grid.k_deleteRows();
}
}
],

k_update: function(k_sender, k_event) {
var
k_allowRemove,
k_selectedRowsCount,
k_rows,
k_i, k_cnt;
if (k_sender instanceof kerio.lib.K_Grid && kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED === k_event.k_type) {
k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount;
k_rows = k_sender.k_selectionStatus.k_rows;
k_allowRemove = (0 !== k_sender.k_selectionStatus.k_selectedRowsCount);
for (k_i = 0, k_cnt = k_rows.length; k_i < k_cnt; k_i++) {
if (k_rows[k_i].k_data.k_reserved) {
k_allowRemove = false;
}
}
this.k_enableItem('k_btnRemove', k_allowRemove);
this.k_enableItem('k_btnDuplicate', k_allowRemove && 1 === k_sender.k_selectionStatus.k_selectedRowsCount);
this.k_enableItem('k_btnEdit', 1 === k_selectedRowsCount && k_allowRemove);
}
}
};
k_gridCfg = {
k_emptyMsg: k_tr('No services', 'trafficRuleEditor'),
k_className: 'policyGrid',
k_toolbars: {
k_bottom: k_toolbarCfg
},
k_dblClickMapToButton: 'k_btnEdit',
k_isDragDropRow: true,
k_columns: {
k_isColumnHidable: false,
k_sorting: false,
k_items: [
{	k_columnId: 'definedService',
k_isDataOnly: true},
{	k_columnId: 'service',
k_isDataOnly: true},
{	k_columnId: 'protocol',
k_isDataOnly: true},
{	k_columnId: 'port',
k_isDataOnly: true},
{
k_columnId: 'item',
k_width: 200,
k_caption: k_tr('Service', 'common'),

k_renderer: function(k_value, k_data) {
var
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_WAW_DEFINITIONS = k_shared.k_DEFINITIONS,
k_return = {};
if (this.k_isNothing) {
return {
k_data: this.k_parentWidget.k_relatedGrid.k_translations.k_nothing,
k_iconCls: 'serviceIcon objectNothing'
};
}
if (k_data.k_reserved) {
k_return.k_data = k_data.k_reserved;
k_return.k_iconCls = 'ipGroupIcon agTypeFirewall modified'; }
else if (k_data.k_locked) { k_return.k_data = k_data.k_rule.name;
k_return.k_iconCls = 'nodeIcon treeIconBandwidthManagement';
}
else if (k_data.definedService) {
k_return = kerio.waw.shared.k_methods.k_formatServiceName(k_data.service.name, k_data.service);
k_return.k_iconCls = 'gridListIcon ' + k_return.k_iconCls;
} else {
k_return.k_data = (k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP === k_data.protocol
? k_WAW_DEFINITIONS.k_PROTOCOLS_MAPPED[k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP].k_caption
: k_WAW_DEFINITIONS.k_PROTOCOLS_MAPPED[k_WAW_CONSTANTS.k_PROTOCOL_ID.k_UDP].k_caption
) + ' ' + kerio.waw.shared.k_methods.k_formatPort(k_data.port);
k_return.k_iconCls = 'gridListIcon portIcon';
}
return k_return;
}
},
{
k_columnId: 'destination',
k_caption: k_tr('Host', 'policyWizard'),

k_renderer: function(k_value) {
if (!k_value) {
return {
k_data: this.k_firewall,
k_iconCls: 'firewall'
};
}
return {
k_data: k_value,
k_iconCls: 'host'
};
}
},
{	k_columnId: 'k_rule',     k_isDataOnly: true},
{	k_columnId: 'k_data',     k_isDataOnly: true},
{	k_columnId: 'k_locked',   k_isDataOnly: true},
{	k_columnId: 'k_editable', k_isDataOnly: true},
{	k_columnId: 'k_reserved', k_isDataOnly: true},
{	k_columnId: 'k_description', k_isDataOnly: true}
]
}
};
k_grid = new kerio.waw.shared.k_widgets.K_SimpleRulesGrid(k_localNamespace + 'serviceGrid', k_gridCfg);
k_grid.k_addReferences({
k_firewall: k_tr('Firewall', 'policyWizard'),
k_renderServiceItem: '',
k_addServiceOrPort: this.k_addServiceOrPort,
k_isServiceUnique: this.k_isServiceUnique,
k_isPortUnique: this.k_isPortUnique,
k_addItems: this.k_addItems,
k_fillZeroes: this.k_fillZeroes,
k_getServiceObject: this.k_getServiceObject,
k_getPortObject: this.k_getPortObject,
k_getServiceOrPort: this.k_getServiceOrPort,
k_getLockedService: this.k_getLockedService,
k_openDialog: this.k_openDialog,
k_getDestination: this.k_getDestination,
k_deleteRows: this.k_deleteRows,
k_confirmDelete: this.k_confirmDelete,
k_serviceIdReference: {
definedService: false,
service: {
id: '',
name: '',
invalid: false
},
protocol: 0,
port: {
comparator: k_WAW_CONSTANTS.PortComparator.Any,
ports: []
}
}
});

k_wizardCfg = {
k_restrictBy: {
k_serverOs: (k_isLinux ? k_LINUX : k_WINDOWS),
k_boxEdition: k_isBoxEdition,
k_isWifiAvailable: k_isWifiAvailable
},
k_height: 350,
k_width: 600,
k_isCancelable: true,
k_title: k_tr('Configuration Assistant', 'connectivityWizard'),
k_hasHelpIcon: true,
k_isConfirmBeforeClosing: true,
k_onBeforeClose: this.k_onBeforeClose,
k_onAfterCancel: this.k_onBeforeClose,
k_pages: [

{
k_id: 'k_incompatiblePolicyPage',
k_title: k_tr('Please note:', 'connectivityWizard'),
k_nextPageId: k_NO_PAGE,
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('This will replace the current traffic rules with following one:', 'connectivityWizard')
+ '<br><br>'
+ k_tr('- Permit all outbound traffic', 'connectivityWizard')
+ '<br>'
+ k_tr('- Let you specify the inbound traffic policy', 'connectivityWizard')
},
{
k_type: 'k_container',
k_className: 'bottomFormItem',
k_items: [{
k_type: 'k_display',
k_id: 'k_continue',
k_template: '<a>' + k_tr('Yes, overwrite the current traffic rules.', 'connectivityWizard') + '</a>',

k_onLinkClick: function(k_page) {
k_page.k_wizard.k_setConfirmBeforeClose(true);
k_page.k_wizard.k_showPage('k_firewallServicesPage');
}
}]
}
],
k_onBeforeShow: function() {
this.k_setConfirmBeforeClose(false);
if (this.k_dataStore.k_rules) {
return this.k_checkCompatibility();
}
this.k_loadRules();
return false;
},
k_onBeforeNextPage: function(k_page) {
this.k_setConfirmBeforeClose(true);
}
},

{
k_id: 'k_firewallServicesPage',
k_title: k_tr('Inbound policy', 'connectivityWizard'),
k_backPageId: k_NO_PAGE,
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: '<br>' + k_tr('The following services provided by Kerio Control will be accessible from the Internet:', 'connectivityWizard')
+ '<br><br>'
},
{
k_type: 'k_checkbox',
k_id: 'k_allowVpnServices',
k_option: k_tr('VPN Services', 'policyWizard'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
var
k_dataStore = k_form.k_wizard.k_dataStore,
k_rule = k_dataStore.k_rules.k_vpnServicesRule;
if (!k_isChecked && k_dataStore.k_watchLockedRules && k_rule && k_rule.k_locked) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Configuration Assistant', 'connectivityWizard'),
k_msg: kerio.lib.k_tr('This service is used as a traffic condition in a Bandwidth Management rule. Please note that disabling the service may present unintended result in Bandwidth Management.', 'connectivityWizard')
});
}
}
},
{
k_type: 'k_checkbox',
k_id: 'k_allowWebAdminSsl',
k_option: k_tr('Kerio Control Administration', 'policyWizard'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
var
k_dataStore = k_form.k_wizard.k_dataStore,
k_rule = k_dataStore.k_rules.k_webAdminRuleSsl;
if (!k_isChecked && k_dataStore.k_watchLockedRules && k_rule && k_rule.k_locked) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Configuration Assistant', 'connectivityWizard'),
k_msg: kerio.lib.k_tr('This service is used as a traffic condition in a Bandwidth Management rule. Please note that disabling the service may present unintended result in Bandwidth Management.', 'connectivityWizard')
});
}
}
},
{
k_type: 'k_checkbox',
k_id: 'k_allowWebServices',
k_option: k_tr('Web Services', 'policyWizard'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
var
k_dataStore = k_form.k_wizard.k_dataStore,
k_rule = k_dataStore.k_rules.k_webServicesRule;
if (!k_isChecked && k_dataStore.k_watchLockedRules && k_rule && k_rule.k_locked) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Configuration Assistant', 'connectivityWizard'),
k_msg: kerio.lib.k_tr('This service is used as a traffic condition in a Bandwidth Management rule. Please note that disabling the service may present unintended result in Bandwidth Management.', 'connectivityWizard')
});
}
}
}
],
k_onBeforeShow: function(k_page) {
var k_rules = this.k_dataStore.k_rules;
this.k_dataStore.k_watchLockedRules = true; if (k_page.k_wentBack) {
return;
}
k_page.k_setData({
k_allowVpnServices   : k_rules.k_vpnServicesRule && k_rules.k_vpnServicesRule.enabled,
k_allowWebAdminSsl   : k_rules.k_webAdminRuleSsl && k_rules.k_webAdminRuleSsl.enabled,
k_allowWebServices   : k_rules.k_webServicesRule && k_rules.k_webServicesRule.enabled
});
},
k_onBeforeNextPage: function(k_page) {
this.k_dataStore.k_watchLockedRules = false; }
},

{
k_isFinishPage: true,
k_id: 'k_policyPage',
k_title: k_tr('Inbound policy', 'policyWizard'),
k_items: [
{
k_type: 'k_container',
k_content: k_grid
}
],
k_onBeforeShow: function(k_page) {
k_page.k_grid.k_setData(k_page.k_wizard.k_getGridServices(k_page.k_wizard.k_firewallServicesPage.k_wentBack));
k_page.k_wizard.k_firewallServicesPage.k_wentBack = true;
}
}
], k_onBeforeFinish: this.k_saveData,
k_onBeforeShow: this.k_beforeShow
}; k_wizard = new kerio.lib.K_Wizard2(k_objectName, k_wizardCfg);
k_policyPage = k_wizard.k_getPage('k_policyPage');
k_firewallServicesPage = k_wizard.k_getPage('k_firewallServicesPage');
k_wizard.k_addReferences({
k_isBoxEdition: k_isBoxEdition,
k_isLinux: k_isLinux,
k_isWifiAvailable: k_isWifiAvailable,
k_policyPage: k_policyPage,
k_firewallServicesPage: k_firewallServicesPage,
k_grid: k_grid,
k_gridServices: null,
k_dataStore: {
k_webAdminPortSsl: k_WAW_CONSTANTS.k_WEB_PORT_SECURED,
k_vpnServicePortIke: k_WAW_CONSTANTS.k_VPN_SERVICE_PORT_IKE,
k_vpnServicePortIpsec: k_WAW_CONSTANTS.k_VPN_SERVICE_PORT_IPSEC,
k_vpnServicePortIpsecNat: k_WAW_CONSTANTS.k_VPN_SERVICE_PORT_IPSEC_NAT,
k_vpnServicePortKvpn: k_WAW_CONSTANTS.k_VPN_SERVICE_PORT_KVPN,
k_webServicePortHttp: k_WAW_CONSTANTS.k_WEB_SERVICE_PORT_HTTP,
k_webServicePortHttps: k_WAW_CONSTANTS.k_WEB_SERVICE_PORT_HTTPS,
k_guestsTrafficServicePortDns: k_WAW_CONSTANTS.k_GUESTS_TRAFFIC_SERVICE_PORT_DNS,
k_guestsTrafficServicePortDhcpBootpFrom: k_WAW_CONSTANTS.k_GUESTS_TRAFFIC_SERVICE_PORT_DHCP_BOOTP_FROM,
k_guestsTrafficServicePortDhcpBootpTo: k_WAW_CONSTANTS.k_GUESTS_TRAFFIC_SERVICE_PORT_DHCP_BOOTP_TO,
k_guestsTrafficServicePortWebIface: k_WAW_CONSTANTS.k_WEB_PORT_UNSECURED,
k_guestsTrafficServicePortWebAdmin: k_WAW_CONSTANTS.k_WEB_PORT_SECURED
},
k_ruleName: k_tr('Rule created by Policy wizard', 'policyWizard'),
k_applyParams: this.k_applyParams,
k_loadRules: this.k_loadRules,
k_createRule: this.k_createRule,
k_clearRuleData: this.k_clearRuleData,
k_createRuleName: this.k_createRuleName,
k_detectServices: this.k_detectServices,
k_getMappedServicesById: this.k_getMappedServicesById,
k_parseOuterRules: this.k_parseOuterRules,
k_parseAlertRules: this.k_parseAlertRules,
k_parseRules: this.k_parseRules,
k_onCreateDefaultRule: this.k_onCreateDefaultRule,
k_checkCompatibility: this.k_checkCompatibility,
k_getDestination: this.k_getDestination,
k_parseDestination: this.k_parseDestination,
k_getGridServices: this.k_getGridServices,
k_getLockedService: this.k_getLockedService,
k_registerCutOffObservers: this.k_registerCutOffObservers,
k_unregisterCutOffObservers: this.k_unregisterCutOffObservers,
k_registeredCutOffObservers: false, k_trVpnServices: k_tr('VPN Services', 'policyWizard'),
k_trWebServices: k_tr('Web Services', 'policyWizard'),
k_trWebAdminSsl: 'Kerio Control Administration',
k_anyEntity: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleAny,
firewall: false,
entities: []
},
k_trustedGuestGroupEntity: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities,
firewall: false,
entities: [
{
type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityInterface,
interfaceCondition: {
type: k_WAW_CONSTANTS.InterfaceConditionType.InterfaceTrusted
}
},
{
type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityInterface,
interfaceCondition: {
type: k_WAW_CONSTANTS.InterfaceConditionType.InterfaceGuest
}
}
]
},
k_allTrustedEntities: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities,
firewall: true,
entities: [
{
type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityVpn,
vpnCondition: {
type: k_WAW_CONSTANTS.VpnConditionType.IncomingClient }
},
{
type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityVpn,
vpnCondition: {
type: k_WAW_CONSTANTS.VpnConditionType.AllTunnels }
},
{
type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityInterface,
interfaceCondition: {
type: k_WAW_CONSTANTS.InterfaceConditionType.InterfaceTrusted
}
}
]
},
k_internetGroupEntity: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities,
firewall: false,
entities: [
{
type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityInterface,
interfaceCondition: {
type: k_WAW_CONSTANTS.InterfaceConditionType.InterfaceInternet
}
}
]
},
k_guestsInterfacesEntity: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities,
firewall: false,
entities: [
{
type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityInterface,
interfaceCondition: {
type: k_WAW_CONSTANTS.InterfaceConditionType.InterfaceGuest
}
}
]
},
k_firewallEntity: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities,
firewall: true,
entities: []
},
k_anyService: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleAny,
entries: []
},
k_singleSelectedService: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities,
entries: [
{
definedService: true,
service: {} }
]
},
k_singleSelectedPort: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities,
entries: [
{
definedService: false,
port: {
comparator: kerio.waw.shared.k_CONSTANTS.PortComparator.Equal,
ports: []
}
}
]
},
k_selectedTwoServices: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities,
entries: [
{
definedService: true,
service: {}
},
{
definedService: true,
service: {}
}
]
},
k_invalidService: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleInvalidCondition,
entries: []
},
k_defaultRuleValues: null,        k_defaultNatRuleValues: null,     k_defaultServiceRuleValues: null }); k_trustedGuestGroupWithVpnEntity = kerio.lib.k_cloneObject(k_wizard.k_trustedGuestGroupEntity);
k_trustedGuestGroupWithVpnEntity.entities.push({
type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityVpn,
vpnCondition: {
type: k_WAW_CONSTANTS.VpnConditionType.IncomingClient }
});
k_wizard.k_addReferences({
k_trustedGuestGroupWithVpnEntity: k_trustedGuestGroupWithVpnEntity
});
k_wizard.k_defaultRuleValues = {
service: k_wizard.k_anyService,
validTimeRange: { id: '' },
inspector: k_WAW_CONSTANTS.k_DEFAULT_INSPECTORS.k_DEFAULT,
enableDestinationNat: false,
enableSourceNat: false
};
k_wizard.k_defaultNatRuleValues = kerio.lib.k_cloneObject(k_wizard.k_defaultRuleValues, {
enableSourceNat: true,      natMode: k_WAW_CONSTANTS.SourceNatMode.NatDefault,
allowFailover: true,        ipAddress: ''
});
k_wizard.k_defaultServiceRuleValues = kerio.lib.k_cloneObject(k_wizard.k_defaultRuleValues);
delete k_wizard.k_defaultServiceRuleValues.service; k_wizard.k_defaultRemoteAccessRuleValues = kerio.lib.k_cloneObject(k_wizard.k_defaultServiceRuleValues, { inspector: k_WAW_CONSTANTS.k_DEFAULT_INSPECTORS.k_NONE });
k_grid.k_addReferences({
k_parent: k_wizard,
k_servicesById: null
});
k_firewallServicesPage.k_addReferences({
k_wentBack: false
});
k_policyPage.k_addReferences({
k_grid: k_grid
});
return k_wizard;
}, 
k_applyParams: function(k_params) {
this.k_firewallServicesPage.k_wentBack = false;
this.k_parentGrid = k_params.k_parentGrid;
this.k_assistent = k_params.k_assistent;
if (k_params.k_assistent) {
}
},

k_beforeShow: function() {
this.k_dataStore = { k_webAdminPortSsl: this.k_dataStore.k_webAdminPortSsl,
k_vpnServicePortIke: this.k_dataStore.k_vpnServicePortIke,
k_vpnServicePortIpsec: this.k_dataStore.k_vpnServicePortIpsec,
k_vpnServicePortIpsecNat: this.k_dataStore.k_vpnServicePortIpsecNat,
k_vpnServicePortKvpn: this.k_dataStore.k_vpnServicePortKvpn,
k_webServicePortHttp: this.k_dataStore.k_webServicePortHttp,
k_webServicePortHttps: this.k_dataStore.k_webServicePortHttps,
k_guestsTrafficServicePortDns:  this.k_dataStore.k_guestsTrafficServicePortDns,
k_guestsTrafficServicePortDhcpBootpFrom:  this.k_dataStore.k_guestsTrafficServicePortDhcpBootpFrom,
k_guestsTrafficServicePortDhcpBootpTo: this.k_dataStore.k_guestsTrafficServicePortDhcpBootpTo,
k_guestsTrafficServicePortWebIface:  this.k_dataStore.k_guestsTrafficServicePortWebIface,
k_guestsTrafficServicePortWebAdmin: this.k_dataStore.k_guestsTrafficServicePortWebAdmin,
k_lockedRules: []
};
},

k_loadRules: function() {
var k_requests = [];
this.k_showLoading(kerio.lib.k_tr('Loading current traffic rules…', 'policyWizard'));
k_requests.push({
k_jsonRpc: {
method: "IpServices.get",
params: {
"query": {
"start": 0,
"limit": -1,
"orderBy": [{
"columnName": "name",
"direction": kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Asc
}]
}
}
},
k_scope: this,
k_callback: function(k_response, k_success, k_params){
var
k_service,
k_services,
k_servicesById,
k_i, k_cnt;
if (k_success) {
k_services = k_response.list;
k_servicesById = {};
for (k_i = 0, k_cnt = k_services.length; k_i < k_cnt; k_i++) {
k_service = k_services[k_i];
k_servicesById[k_service.id] = k_service;
}
this.k_dataStore.k_services = k_response.list;
this.k_grid.k_servicesById = k_servicesById;
this.k_detectServices();
}
}
});
k_requests.push({
k_jsonRpc: {
method: "BandwidthManagement.get"
},
k_scope: this,
k_callback: function(k_response, k_success, k_params){
if (k_success) {
this.k_dataStore.k_bmRules = k_response.config.rules; this.k_parseOuterRules(true);
}
}
});
k_requests.push({
k_jsonRpc: {
method: "Alerts.getSettings"
},
k_scope: this,
k_callback: function(k_response, k_success, k_params){
if (k_success) {
this.k_dataStore.k_alertRules = k_response.config;
this.k_parseOuterRules(false);
}
}
});
k_requests.push({
k_jsonRpc: {
method: "TrafficPolicy.get"
},
k_scope: this,
k_callback: function(k_response, k_success, k_params){
if (k_success) {
this.k_dataStore.k_rules = k_response.list;
this.k_parseRules();
}
}
});
k_requests.push({ k_jsonRpc: {
method: "TrafficPolicy.getDefaultRule"
},
k_scope: this,
k_callback: function(k_response, k_success, k_params){
if (k_success) {
this.k_dataStore.k_defaultRule = k_response.rule; }
}
});
kerio.waw.requests.k_sendBatch(k_requests, {
k_scope: this,
k_callback: function(k_response, k_success, k_params) {
this.k_hideLoading('k_incompatiblePolicyPage');
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_dialogs: ['inboundPolicyEditor']
});
},
k_mask: false
});
},

k_saveData: function() {
var
k_mergeObjects = kerio.waw.shared.k_methods.k_mergeObjects,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_firewall = this.k_grid.k_firewall, k_tr = kerio.lib.k_tr,
k_dataStore = this.k_dataStore,
k_mappedServices = k_dataStore.k_mappedServices,
k_grid = this.k_grid,
k_gridData = k_grid.k_getData(),
k_newRules = [],
k_getServiceObject = this.k_grid.k_getServiceObject,
k_rules = k_dataStore.k_rules,
k_rule,
k_i, k_cnt,
k_service,
k_vpnServices,
k_webServices;
this.k_showLoading(k_tr('Saving new traffic rules…', 'policyWizard'));
for (k_i = 0, k_cnt = k_gridData.length; k_i < k_cnt; k_i++) {
k_service = k_gridData[k_i];
switch (k_service.k_reserved) {
case (this.k_trWebAdminSsl):
k_rule = this.k_createRule(k_service, k_service.k_reserved);
k_rule.id = k_rules.k_webAdminRuleSsl ? k_rules.k_webAdminRuleSsl.id : '';
k_newRules.push(k_rule);
break;
case (this.k_trVpnServices):
k_vpnServices = [
k_getServiceObject.call(k_grid, k_mappedServices.k_vpnServiceIpsecGroup),
k_getServiceObject.call(k_grid, k_mappedServices.k_vpnServiceKvpn)
];
k_service.k_data = k_vpnServices;
k_rule = this.k_createRule(k_service, this.k_trVpnServices, k_tr('Allows access to VPN services on the firewall machine from the Internet.', 'policyWizard'));
if (false === k_mappedServices.k_vpnServiceIpsecGroup.k_isServiceFound || false === k_mappedServices.k_vpnServiceKvpn.k_isServiceFound) {
k_rule.service = kerio.lib.k_cloneObject(this.k_invalidService);
}
k_rule.id = k_rules.k_vpnServicesRule ? k_rules.k_vpnServicesRule.id : '';
k_newRules.push(k_rule);
break;
case (this.k_trWebServices):
k_webServices = [
k_getServiceObject.call(k_grid, k_mappedServices.k_webServicePortHttp),
k_getServiceObject.call(k_grid, k_mappedServices.k_webServicePortHttps)
];
k_service.k_data = k_webServices;
k_rule = this.k_createRule(k_service, this.k_trWebServices, k_tr('Allows access to HTTP and HTTPS services on the firewall machine from the Internet.', 'policyWizard'));
k_rule.id = k_rules.k_webServicesRule ? k_rules.k_webServicesRule.id : '';
k_newRules.push(k_rule);
break;
default:
if (k_service.k_locked) {
k_newRules.push(this.k_createRule(k_service)); }
else {
k_newRules.push(this.k_createRule(k_service, this.k_createRuleName(k_service, k_service.destination || k_firewall)));
}
}
}
k_rule = this.k_createRule([], k_tr('Internet access (NAT)', 'policyWizard'), k_tr('Enables access from local machines and VPN clients to the Internet using address translation.', 'policyWizard'));
k_rule.id = k_rules.k_internetNatRule ? k_rules.k_internetNatRule.id : '';
k_rule.source = this.k_trustedGuestGroupWithVpnEntity;
k_rule.destination = this.k_internetGroupEntity;
k_mergeObjects(this.k_defaultNatRuleValues, k_rule);
k_rule.color = k_WAW_CONSTANTS.k_POLICY_BCKG_COLORS.k_GREEN;
this.k_onCreateDefaultRule(k_rule, k_dataStore.k_rules.k_internetNatRule);
k_newRules.push(k_rule);
k_rule = this.k_createRule([], k_tr('Local traffic', 'policyWizard'), k_tr('Enables local traffic between the firewall and local networks.', 'policyWizard'));
k_rule.id = k_rules.k_localTrafficRule ? k_rules.k_localTrafficRule.id : '';
k_rule.source = this.k_allTrustedEntities;
k_rule.destination = this.k_allTrustedEntities;
k_rule.color = k_WAW_CONSTANTS.k_POLICY_BCKG_COLORS.k_GREEN;
this.k_onCreateDefaultRule(k_rule, k_dataStore.k_rules.k_localTrafficRule);
k_newRules.push(k_rule);
k_rule = this.k_createRule([], k_tr('Firewall traffic', 'policyWizard'), k_tr('Enables communication between the firewall and the Internet.', 'policyWizard'));
k_rule.id = k_rules.k_fwTrafficRule ? k_rules.k_fwTrafficRule.id : '';
k_rule.source = this.k_firewallEntity;
k_rule.destination = this.k_anyEntity;
k_rule.color = k_WAW_CONSTANTS.k_POLICY_BCKG_COLORS.k_GREEN;
this.k_onCreateDefaultRule(k_rule, k_dataStore.k_rules.k_fwTrafficRule);
k_newRules.push(k_rule);
k_rule = this.k_createRule([], k_tr('Guests traffic', 'policyWizard'), k_tr('Allows access to the selected services of the firewall from guest machines.', 'policyWizard'));
k_rule.id = k_rules.k_guestsTrafficRule ? k_rules.k_guestsTrafficRule.id : '';
k_rule.source = this.k_guestsInterfacesEntity;
k_rule.destination = this.k_firewallEntity;
if (false !== k_mappedServices.k_guestsTrafficServiceGroup.k_isServiceFound) {
k_service = kerio.lib.k_cloneObject(this.k_singleSelectedService);
k_service.entries[0] = k_getServiceObject.call(k_grid, k_mappedServices.k_guestsTrafficServiceGroup);
}
else {
k_service = kerio.lib.k_cloneObject(this.k_invalidService);
}
k_rule.service = k_service;
k_rule.color = k_WAW_CONSTANTS.k_POLICY_BCKG_COLORS.k_GREEN;
this.k_onCreateDefaultRule(k_rule, k_dataStore.k_rules.k_guestsTrafficRule);
k_newRules.push(k_rule);
this.k_registerCutOffObservers();
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'ProductInfo.accountUsage',
params: {
apiEntity: k_WAW_CONSTANTS.ApiEntity.PolicyWizard
}
},
k_onError: function() {
return true;
},
k_owner: null
});
kerio.waw.requests.k_sendBatch(
{
k_jsonRpc: {
method: 'TrafficPolicy.set',
params: {
rules: k_newRules,
defaultRule: k_dataStore.k_defaultRule
}
},
k_scope: this,
k_callback: function(k_response, k_success) {
this.k_unregisterCutOffObservers();
if (k_success) {
this.k_close(true); if (this.k_assistent) {
this.k_assistent.k_show();
}
if (this.k_parentGrid) { kerio.waw.shared.k_methods.k_maskMainScreen(kerio.lib.k_getViewport());
this.k_parentGrid.k_reloadData();
}
}
else {
this.k_hideLoading();
}
}
},
{
k_requestOwner: null,  k_mask: true
}
);
return false;
}, 
k_onCreateDefaultRule: function(k_newRule, k_oldRule) {
if (!k_oldRule) {
return;
}
if (k_oldRule.k_locked) { k_newRule.id = k_oldRule.id;
}
},

k_createRule: function(k_services, k_ruleName, k_ruleDescription) {
var
k_tr = kerio.lib.k_tr,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_values = {},
k_id = '', k_destination = false,
k_destinationName = false,
k_firstService = (k_services[0] ? k_services[0] : k_services),
k_description = '';
if (k_ruleDescription) {
k_description = k_ruleDescription; }
else if (k_firstService.k_description) {
k_description = k_firstService.k_description; }
else {
if ('string' === typeof k_firstService.destination && '' !== k_firstService.destination) {
k_destinationName = k_firstService.destination.split(':')[0]; }
if (k_firstService.service && k_firstService.service.name) {
if (k_destinationName) {
k_description = k_tr('Allows access to service %1 on %2 from the Internet.', 'policyWizard', {
k_args: [k_firstService.service.name, k_destinationName]
});
}
else {
k_description = k_tr('Allows access to service %1 on firewall machine from the Internet.', 'policyWizard', {
k_args: [k_firstService.service.name]
});
}
}
else if (k_firstService.port && k_firstService.port.ports && k_firstService.port.ports.length) {
if (k_destinationName) {
k_description = k_tr('Allows access to port %1 on %2 from the Internet.', 'policyWizard', {
k_args: [k_firstService.port.ports[0], k_destinationName] });
}
else {
k_description = k_tr('Allows access to port %1 on the firewall machine from the Internet.', 'policyWizard', {
k_args: [k_firstService.port.ports[0]] });
}
} }
if (k_services.k_locked) {
k_id = k_services.k_rule.id;
k_ruleName = k_services.k_rule.name; this.k_parseDestination(k_values, k_services.destination);
k_destination = true;
}
if (k_services.k_data) {
if (Array === k_services.k_data.constructor) {
k_services = k_services.k_data;
}
else {
k_services = [k_services.k_data];
}
}
else if (Array !== k_services.constructor) {
k_services = [ k_services ];
}
if (k_services[0] && !k_destination) { this.k_parseDestination(k_values, k_services[0].destination); }
k_values.service = {
type: (k_services[0])
? k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities
: k_WAW_CONSTANTS.RuleConditionType.RuleAny,
entries: k_services
};
k_values.destination = {
type: k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities,
firewall: true
};
k_values.id = k_id;
k_values.action = k_WAW_CONSTANTS.RuleAction.Allow;
k_values.name = k_ruleName || this.k_ruleName;
k_values.color = k_WAW_CONSTANTS.k_POLICY_BCKG_COLORS.k_RED;
k_values.description = k_description;
this.k_clearRuleData(k_values);
return kerio.waw.shared.k_DEFINITIONS.k_get('k_predefinedTrafficRule', k_values);
}, 
k_clearRuleData: function(k_ruleData) {
var k_i, k_cnt, k_items, k_item;
k_items = k_ruleData.service.entries;
for (k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_item = k_items[k_i];
delete k_item.item;
delete k_item.destination;
delete k_item.k_description;
delete k_item.k_rule;
delete k_item.k_data;
delete k_item.k_locked;
delete k_item.k_editable;
delete k_item.k_reserved;
k_item = k_item.service;
delete k_item.status;
delete k_item.description;
delete k_item.protocol;
delete k_item.srcPort;
delete k_item.dstPort;
delete k_item.inspector;
delete k_item.protoNumber;
delete k_item.icmpTypes;
}
},

k_createRuleName: function(k_service, k_destination) {
var
k_tr = kerio.lib.k_tr,
k_PROTOCOL_ID = kerio.waw.shared.k_CONSTANTS.k_PROTOCOL_ID,
k_name;
if (k_service.definedService) {
k_name = k_tr('Service %1 on %2', 'policyWizard', { k_args: [k_service.service.name, k_destination]});
}
else {
if (k_PROTOCOL_ID.k_TCP === k_service.protocol) {
k_name = k_tr('TCP on %1', 'policyWizard', { k_args: [k_destination]});
}
else if (k_PROTOCOL_ID.k_UDP === k_service.protocol) {
k_name = k_tr('UDP on %1', 'policyWizard', { k_args: [k_destination]});
}
else { k_name = k_tr('Services on %1', 'policyWizard', { k_args: [k_destination]});
}
}
return k_name;
},

k_getDestination: function(k_rule) {
var k_string = '';
if (k_rule.enableDestinationNat) {
k_string = k_rule.translatedHost;
if (k_rule.translatedPort.enabled) {
k_string = k_string + ':' + k_rule.translatedPort.value;
}
}
return k_string;
},

k_parseDestination: function(k_rule, k_destination) {
if (!k_destination) {
return false;
}
k_destination = k_destination.split(':');
k_rule.enableDestinationNat = true;
k_rule.translatedHost = k_destination[0];
if (k_destination[1] && !isNaN(k_destination[1])) { k_rule.translatedPort = {
enabled: true,
value: parseInt(k_destination[1], 10) || 0 };
}
return true;
},
k_getMappedServicesById: function(k_services) {
var
k_mappedServices = [],
k_item,
k_cnt, k_i;
k_cnt = k_services.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_services[k_i];
k_mappedServices[k_item.id] = k_item;
}
return k_mappedServices;
},

k_detectServices: function() {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
Any = k_WAW_CONSTANTS.PortComparator.Any,
k_EQ = k_WAW_CONSTANTS.PortComparator.Equal,
k_dataStore = this.k_dataStore,
k_services = k_dataStore.k_services,
k_servicesById = this.k_getMappedServicesById(k_services),
k_mappedServices = [],
k_PROTOCOLS,
k_i, k_cnt,
k_service,
k_members,
k_member,
k_memberIndex, k_memberCnt,
k_isGuestsTrafficServiceGroup,
k_isIpsecGroup;
k_PROTOCOLS = [
k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP,
k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP_UDP
];
k_dataStore.k_mappedServices = k_mappedServices;
k_mappedServices.k_webAdminServiceSsl = {};
k_mappedServices.k_vpnServiceIpsecGroup = {k_isServiceFound: false};
k_mappedServices.k_vpnServiceKvpn = {k_isServiceFound: false};
k_mappedServices.k_webServicePortHttp = {};
k_mappedServices.k_webServicePortHttps = {};
k_mappedServices.k_guestsTrafficServiceGroup = {k_isServiceFound: false};
for (k_i = 0, k_cnt = k_services.length; k_i < k_cnt; k_i++) {
k_service = k_services[k_i];
if (k_service.group) {
k_members = k_service.members;
k_memberCnt = k_members.length;
if (3 === k_memberCnt) {
k_isIpsecGroup = true;
for (k_memberIndex = 0; k_memberIndex < k_memberCnt; k_memberIndex++) {
k_member = k_servicesById[k_members[k_memberIndex].id];
k_isIpsecGroup = k_isIpsecGroup &&
((k_WAW_CONSTANTS.k_PROTOCOL_ID.k_UDP === k_member.protocol
&& (k_dataStore.k_vpnServicePortIke === k_member.dstPort.ports[0] || k_dataStore.k_vpnServicePortIpsecNat === k_member.dstPort.ports[0]))
|| (k_WAW_CONSTANTS.k_PROTOCOL_ID.k_OTHER === k_member.protocol && k_dataStore.k_vpnServicePortIpsec === k_member.protoNumber));
}
if (k_isIpsecGroup) {
k_mappedServices.k_vpnServiceIpsecGroup = k_service;
}
}
else if (4 === k_memberCnt) {
k_isGuestsTrafficServiceGroup = true;
for (k_memberIndex = 0; k_memberIndex < k_memberCnt; k_memberIndex++) {
k_member = k_servicesById[k_members[k_memberIndex].id];
k_isGuestsTrafficServiceGroup = k_isGuestsTrafficServiceGroup &&
((k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP_UDP === k_member.protocol && k_dataStore.k_guestsTrafficServicePortDns === k_member.dstPort.ports[0])
|| (k_WAW_CONSTANTS.k_PROTOCOL_ID.k_UDP === k_member.protocol
&& k_dataStore.k_guestsTrafficServicePortDhcpBootpFrom === k_member.dstPort.ports[0]
&& k_dataStore.k_guestsTrafficServicePortDhcpBootpTo === k_member.dstPort.ports[1])
|| (k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP === k_member.protocol && k_dataStore.k_guestsTrafficServicePortWebIface === k_member.dstPort.ports[0])
|| (k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP === k_member.protocol && k_dataStore.k_guestsTrafficServicePortWebAdmin === k_member.dstPort.ports[0]));
}
if (k_isGuestsTrafficServiceGroup) {
k_mappedServices.k_guestsTrafficServiceGroup = k_service;
}
}
}
k_mappedServices[k_service.id] = k_service; if (Any === k_service.srcPort.comparator && k_EQ === k_service.dstPort.comparator) {
if (-1 < k_PROTOCOLS.indexOf(k_service.protocol)) {
switch(k_service.dstPort.ports[0]) {
case k_dataStore.k_webAdminPortSsl:
k_mappedServices.k_webAdminServiceSsl = k_service;
break;
case k_dataStore.k_vpnServicePortKvpn:
k_mappedServices.k_vpnServiceKvpn = k_service;
break;
case k_dataStore.k_webServicePortHttp:
k_mappedServices.k_webServicePortHttp = k_service;
break;
case k_dataStore.k_webServicePortHttps:
k_mappedServices.k_webServicePortHttps = k_service;
break;
}
}
}
}
},

k_parseOuterRules: function(k_bmRules) {
var
k_TRAFFIC_RULE = kerio.waw.shared.k_CONSTANTS.BMConditionType.BMConditionTrafficRule,
k_dataStore = this.k_dataStore,
k_outerRules = k_dataStore.k_bmRules,
k_dataStoreLockerRules = k_dataStore.k_lockedRules,
k_trRules,
k_trRule,
k_trId,
k_outerRuleI, k_outerRuleCnt,
k_trRuleI, k_trRuleCnt;
if (k_bmRules) {
k_TRAFFIC_RULE = kerio.waw.shared.k_CONSTANTS.BMConditionType.BMConditionTrafficRule;
k_outerRules = k_dataStore.k_bmRules;
}
else {
k_TRAFFIC_RULE = kerio.waw.shared.k_CONSTANTS.AlertEventRuleType.AlertTraffic;
k_outerRules = k_dataStore.k_alertRules;
}
for (k_outerRuleI = 0, k_outerRuleCnt = k_outerRules.length; k_outerRuleI < k_outerRuleCnt; k_outerRuleI++) {
k_trRules = k_outerRules[k_outerRuleI];
k_trRules = k_bmRules ? k_trRules.traffic : k_trRules.ruleEventList;
for (k_trRuleI = 0, k_trRuleCnt = k_trRules.length; k_trRuleI < k_trRuleCnt; k_trRuleI++) {
k_trRule = k_trRules[k_trRuleI];
k_trId = k_bmRules ? k_trRule.valueId.id : k_trRule.rule.id;
if (((k_bmRules && k_TRAFFIC_RULE === k_trRule.type) || (!k_bmRules && k_TRAFFIC_RULE === k_trRule.ruleType)) && -1 === k_dataStoreLockerRules.indexOf(k_trId)) {
k_dataStoreLockerRules.push(k_trId);
}
}
}
},

k_parseRules: function() {
var
k_compare = kerio.waw.shared.k_methods.k_compare,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
Allow = k_WAW_CONSTANTS.RuleAction.Allow,
RuleAny = k_WAW_CONSTANTS.RuleConditionType.RuleAny,
RuleSelectedEntities = k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities,
k_WEB_PORT_SECURED = k_WAW_CONSTANTS.k_WEB_PORT_SECURED,
k_WEB_PORT_UNSECURED = k_WAW_CONSTANTS.k_WEB_PORT_UNSECURED,
k_isWindows = true !== this.k_isLinux,
k_dataStore = this.k_dataStore,
k_mappedServices = k_dataStore.k_mappedServices,
k_rules = k_dataStore.k_rules,
k_lockedRules = k_dataStore.k_lockedRules,
k_natMappingRules = [], k_fwMappingRules = [],  k_allMappingRules = [], k_defaultRules = [],
k_denyRules = [],
k_otherRules = [],
k_disabledRules = [],
k_mappingServices = [],
k_lockedOtherRules = [],
k_i, k_j, k_cnt, k_ruleCnt, k_serviceCnt,
k_rule,
k_lockedRuleIndex,
k_service,
k_vpnServicesIds,
k_webServicesIds,
k_entries,
k_iEntry, k_cntEntry,
k_matchRule;
k_rules.k_internetNatRule = undefined;    k_rules.k_localTrafficRule = undefined;   k_rules.k_fwTrafficRule = undefined;      k_rules.k_vpnServicesRule = undefined;    k_rules.k_webServicesRule = undefined;    k_rules.k_guestsTrafficRule = undefined;  k_rules.k_defaultRules = k_defaultRules;
k_rules.k_natMappingRules = k_natMappingRules;
k_rules.k_fwMappingRules = k_fwMappingRules;
k_rules.k_allMappingRules = k_allMappingRules;
k_rules.k_denyRules = k_denyRules;
k_rules.k_otherRules = k_otherRules;
k_rules.k_disabledRules = k_disabledRules;
k_rules.k_lockedOtherRules = k_lockedOtherRules;
k_dataStore.k_mappingServices = k_mappingServices;
k_vpnServicesIds = [
k_mappedServices.k_vpnServiceIpsecGroup.id,
k_mappedServices.k_vpnServiceKvpn.id
];
k_webServicesIds = [
k_mappedServices.k_webServicePortHttp.id,
k_mappedServices.k_webServicePortHttps.id
];
for (k_i = 0, k_cnt = k_rules.length; k_i < k_cnt; k_i++) {
k_rule = k_rules[k_i];
k_lockedRuleIndex = k_lockedRules.indexOf(k_rule.id); if (-1 < k_lockedRuleIndex) {
k_lockedRules[k_lockedRuleIndex] = k_rule; k_rule.k_locked = true;
}
if (Allow === k_rule.action) {
if ((k_compare(k_rule.source, this.k_trustedGuestGroupEntity) || k_compare(k_rule.source, this.k_trustedGuestGroupWithVpnEntity)) && k_compare(k_rule.destination, this.k_internetGroupEntity)){
if (k_rules.k_internetNatRule) {
continue; }
k_rules.k_internetNatRule = k_rule;
k_defaultRules.push(k_rule);
k_rule.k_isModified = !k_compare(k_rule, this.k_defaultNatRuleValues);
continue;
}
if (k_compare(k_rule.source, this.k_allTrustedEntities) && k_compare(k_rule.destination, this.k_allTrustedEntities)) {
if (k_rules.k_localTrafficRule) {
continue; }
k_rules.k_localTrafficRule = k_rule;
k_defaultRules.push(k_rule);
k_rule.k_isModified = !k_compare(k_rule, this.k_defaultRuleValues);
continue;
}
if (k_compare(k_rule.source, this.k_firewallEntity) && k_compare(k_rule.destination, this.k_anyEntity)) {
if (k_rules.k_fwTrafficRule) {
continue; }
k_rules.k_fwTrafficRule = k_rule;
k_defaultRules.push(k_rule);
k_rule.k_isModified = !k_compare(k_rule, this.k_defaultRuleValues);
continue;
}
if (k_compare(k_rule.source, this.k_guestsInterfacesEntity) && k_compare(k_rule.destination, this.k_firewallEntity)
&& k_compare(k_rule.service, this.k_singleSelectedService)) {
if (k_rules.k_guestsTrafficRule) {
continue; }
k_rules.k_guestsTrafficRule = k_rule;
k_defaultRules.push(k_rule);
k_rule.k_isModified = !k_compare(k_rule, this.k_defaultServiceRuleValues);
continue;
}
if (k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities === k_rule.source.type && 1 === k_rule.source.entities.length
&& k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityInterface === k_rule.source.entities[0].type && RuleSelectedEntities === k_rule.destination.type && k_rule.destination.firewall && 0 === k_rule.destination.entities.length
&& k_compare(k_rule.service, this.k_singleSelectedPort, false, false)
&& [k_WEB_PORT_UNSECURED, k_WEB_PORT_SECURED].indexOf(k_rule.service.entries[0].port.ports[0])
) { if (!k_rule.enableDestinationNat) {
if (k_rules.k_webAdminRuleSsl) {
continue; }
k_rules.k_webAdminRuleSsl = k_rule;
k_rule.k_reserved = this.k_trWebAdminSsl;
k_defaultRules.push(k_rule);
k_allMappingRules.push(k_rule);
k_rule.k_isModified = !k_compare(k_rule, this.k_defaultRemoteAccessRuleValues);
if (k_WEB_PORT_SECURED === k_rule.service.entries[0].port.ports[0] && k_mappedServices.k_webAdminServiceSsl) {
k_rule.service.entries[0] = kerio.waw.shared.k_DEFINITIONS.k_get('k_trafficService', {
definedService: true,
service: {
id: k_mappedServices.k_webAdminServiceSsl.id,
name: k_mappedServices.k_webAdminServiceSsl.name
}
});
}
continue;
} }
if (RuleAny === k_rule.source.type && RuleSelectedEntities === k_rule.destination.type && k_rule.destination.firewall && 0 === k_rule.destination.entities.length) {
if ((k_compare(k_rule.service, this.k_singleSelectedService) && k_compare(k_rule.service.entries[0].service.id, k_mappedServices.k_webAdminServiceSsl.id))
|| (k_compare(k_rule.service, this.k_singleSelectedPort, false, false) && k_compare(k_rule.service.entries[0].port.ports[0], k_dataStore.k_webAdminPortSsl))) {
if (!k_rule.enableDestinationNat) {
if (k_rules.k_webAdminRuleSsl) {
continue; }
k_rules.k_webAdminRuleSsl = k_rule;
k_rule.k_reserved = this.k_trWebAdminSsl;
k_defaultRules.push(k_rule);
k_allMappingRules.push(k_rule);
k_rule.k_isModified = !k_compare(k_rule, this.k_defaultServiceRuleValues) && !k_compare(k_rule, this.k_defaultRemoteAccessRuleValues);
continue;
} }
if (k_compare(k_rule.service, this.k_selectedTwoServices)) {
k_entries = k_rule.service.entries;
k_matchRule = true;
for (k_iEntry = 0, k_cntEntry = k_entries.length; k_iEntry < k_cntEntry; k_iEntry++) {
k_matchRule = k_matchRule && -1 !== k_vpnServicesIds.indexOf(k_entries[k_iEntry].service.id);
}
if (k_matchRule && !k_rule.enableDestinationNat) {
k_rule.k_isVpnServicesRule = true;
if (k_rules.k_vpnServicesRule) {
continue; }
k_rules.k_vpnServicesRule = k_rule;
k_rule.k_reserved = this.k_trVpnServices;
k_defaultRules.push(k_rule);
k_allMappingRules.push(k_rule);
k_rule.k_isModified = !k_compare(k_rule, this.k_defaultServiceRuleValues);
continue;
}
k_matchRule = true;
for (k_iEntry = 0; k_iEntry < k_cntEntry; k_iEntry++) {
k_matchRule = k_matchRule && -1 !== k_webServicesIds.indexOf(k_entries[k_iEntry].service.id);
}
if (k_matchRule && !k_rule.enableDestinationNat) {
k_rule.k_isWebServicesRule = true;
if (k_rules.k_isWebServicesRule) {
continue; }
k_rules.k_webServicesRule = k_rule;
k_rule.k_reserved = this.k_trWebServices;
k_defaultRules.push(k_rule);
k_allMappingRules.push(k_rule);
k_rule.k_isModified = !k_compare(k_rule, this.k_defaultServiceRuleValues);
continue;
}
}
if (!k_rule.enabled) { k_rule.k_modified = true; k_disabledRules.push(k_rule);
continue;
}
if (k_rule.enableDestinationNat) {
k_natMappingRules.push(k_rule);
k_allMappingRules.push(k_rule);
}
else {
k_fwMappingRules.push(k_rule);
k_allMappingRules.push(k_rule);
}
}
else {
if (k_rule.enabled) {
k_otherRules.push(k_rule);
} }
}
else {
if (-1 < k_lockedRules.indexOf(k_rule.id)) {
k_lockedOtherRules.push(k_rule); }
if (k_rule.enabled) {
k_denyRules.push(k_rule);
} }
} for (k_i = 0, k_ruleCnt = k_allMappingRules.length; k_i < k_ruleCnt; k_i++) {
k_rule = k_allMappingRules[k_i];
if (k_rule.k_locked) {
k_service = k_rule.service.entries; k_mappingServices.push(this.k_getLockedService(k_rule));
continue;
}
for (k_j = 0, k_serviceCnt = k_rule.service.entries.length; k_j < k_serviceCnt; k_j++) {
k_service = k_rule.service.entries[k_j];
k_service.destination = this.k_getDestination(k_rule);
k_service.k_description = k_rule.description;
if (k_rule.k_reserved) {
k_service.k_reserved = k_rule.k_reserved;
}
k_mappingServices.push(k_service);
if (k_rule.k_isVpnServicesRule || k_rule.k_isWebServicesRule) {
break;
}
}
}
}, 
k_checkCompatibility: function() {
var
k_tr = kerio.lib.k_tr,
k_dataStore = this.k_dataStore,
k_rules = k_dataStore.k_rules,
k_incompatibles = []; if (!k_rules.k_fwTrafficRule || k_rules.k_fwTrafficRule.k_isModified) {
k_incompatibles.push(k_tr("The rule allowing traffic of the firewall is missing or has been modified. The wizard will create it and/or set default values for this rule.", 'policyWizard'));
}
if (!k_rules.k_internetNatRule || k_rules.k_internetNatRule.k_isModified) {
k_incompatibles.push(k_tr('The rule allowing access to the Internet is missing or has been modified. The wizard will create it and/or set default values for this rule.', 'policyWizard'));
}
if (!k_rules.k_localTrafficRule || k_rules.k_localTrafficRule.k_isModified) {
k_incompatibles.push(k_tr('The rule allowing traffic within LAN is missing or has been modified. The wizard will create it and/or set default values for this rule.', 'policyWizard'));
}
if (!k_rules.k_guestsTrafficRule || k_rules.k_guestsTrafficRule.k_isModified) {
k_incompatibles.push(k_tr('The rule allowing access to the selected services of the firewall from guest machines is missing or has been modified. The wizard will create it and/or set default values for this rule.', 'policyWizard'));
}
if (k_rules.k_webAdminRuleSsl && k_rules.k_webAdminRuleSsl.k_isModified) {
k_incompatibles.push(k_tr('The rule allowing access to the Kerio Control Administration has been modified. The wizard will set default values for this rule.', 'policyWizard'));
}
if (k_rules.k_vpnServicesRule && k_rules.k_vpnServicesRule.k_isModified) {
k_incompatibles.push(k_tr('The rule allowing access to VPN services has been modified. The wizard will set the default values for this rule.', 'policyWizard'));
}
if (0 < k_rules.k_lockedOtherRules.length) {
k_incompatibles.push(k_tr('There are some rules not supported by this wizard which are used in Bandwidth Management conditions. Such rules will be removed by the wizards. This may lead to unexpected Bandwidth Management behavior.', 'policyWizard'));
}
if (0 < k_rules.k_denyRules.length) {
k_incompatibles.push(k_tr('There are some user-created rules that deny or drop traffic; the wizard cannot guarantee correct order (functionality) of such rules and for that reason they will be disabled.', 'policyWizard'));
}
if (0 < k_rules.k_otherRules.length) {
k_incompatibles.push(k_tr('There are some special user-created rules. The wizard cannot guarantee correct order (functionality) of such rules and for that reason they will be disabled.', 'policyWizard'));
}
if (k_incompatibles.length) {
return true;
}
this.k_enableConfirmBeforeClosing(true);
return 'k_firewallServicesPage'; },


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
this.k_showLoading = this._k_origShowMask;
},

k_onBeforeClose: function() {
this.k_dataStore.k_watchLockedRules = false; if (this.k_assistent) {
this.k_assistent.k_show();
}
},


k_fillZeroes: function(k_number) {
var
k_i, k_cnt,
k_length,
k_tmp;
k_number = ((k_number || 0) + '');
k_length = k_number.length;
k_tmp = k_number;
for (k_i = 0, k_cnt = 5 - k_number.length; k_i < k_cnt; k_i++) {
k_tmp = '0' + k_tmp;
}
return k_tmp;
},

k_getServiceOrPort: function(k_service, k_port) {
if (k_service && k_service.id) {
return this.k_getServiceObject(k_service);
}
else {
return this.k_getPortObject(k_port);
}
},

k_getLockedService: function(k_rule) {
var
k_services = k_rule.service.entries,
k_count = k_services.length,
k_service = (k_count ? k_services[0] : null);
return {
k_locked: true, k_rule: k_rule,
k_reserved: k_rule.k_reserved, destination: this.k_getDestination(k_rule), k_description: k_rule.description,
k_editable: (1 === k_count), k_data: (1 === k_count) ? k_service : k_services
};
},

k_getServiceObject: function(k_service) {
var k_tmpData;
k_tmpData = kerio.lib.k_cloneObject(this.k_serviceIdReference);
k_tmpData.definedService = true;
k_tmpData.service.id = k_service.id;
k_tmpData.service.name = k_service.name;
return k_tmpData;
},

k_getPortObject: function(k_port) {
var k_tmpData;
k_tmpData = kerio.lib.k_cloneObject(this.k_serviceIdReference);
k_tmpData.protocol = kerio.waw.shared.k_CONSTANTS.k_PROTOCOL_ID.k_TCP;
k_tmpData.port.comparator = kerio.waw.shared.k_CONSTANTS.PortComparator.Equal;
k_tmpData.port.ports = [ k_port ];
return k_tmpData;
},

k_isServiceUnique: function(k_serviceReference, k_data) {
var
k_id,
k_i, k_cnt;
k_id = k_serviceReference.service.id;
k_data = k_data || [];
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_id === k_data[k_i].service.id) {
return false;
}
}
return true;
},

k_isPortUnique: function(k_portReference, k_data) {
var
k_port,
k_entry,
k_entryProtocol,
k_protocol,
k_i, k_cnt;
k_protocol = k_portReference.protocol;
k_port = k_portReference.port;
k_data = k_data || [];
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_entryProtocol = k_data[k_i].protocol;
k_entry = k_data[k_i].port;
if (k_protocol === k_entryProtocol
&& k_port.comparator === k_entry.comparator
&& k_port.ports[0] === k_entry.ports[0] && k_port.ports[1] === k_entry.ports[1]) {
return false;
}
}
return true;
},

k_openDialog: function(k_isEditMode) {
var
k_grid = this,
k_selectionStatus = k_grid.k_selectionStatus,
k_params;
if (k_isEditMode && (1 !== k_selectionStatus.k_selectedRowsCount || k_selectionStatus.k_rows[0].k_data.k_reserved)) {
return;
}
k_params = {
k_parentWidget: k_grid,
k_dataStore: k_grid.k_parent.k_dataStore,
k_servicesById: k_grid.k_servicesById,
k_rowData: k_isEditMode ? k_selectionStatus.k_rows[0].k_data : [],
k_callback: k_grid.k_addServiceOrPort
};
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'inboundPolicyEditor',
k_objectName: k_isEditMode ? 'k_inboundPolicyEditorEdit' : 'k_inboundPolicyEditorAdd',
k_params: k_params
});
},

k_addServiceOrPort: function(k_params) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_data = kerio.waw.shared.k_DEFINITIONS.k_get('k_trafficService', k_params.k_data),
k_grid = this,
k_definedService = k_data.definedService,
k_subsetData = [],
k_gridData = [],
k_isUniqueMethod,
k_i, k_cnt,
k_entry;
if (k_params.k_isEditMode) {
k_grid.k_removeSelectedRows();
}
if (!this.k_isNothing) {
k_gridData = k_grid.k_getData();
}
if (k_definedService) { k_isUniqueMethod = this.k_isServiceUnique;
}
else {
k_isUniqueMethod = this.k_isPortUnique;
}
if (k_params.k_lockedRule) {
k_subsetData = this.k_getLockedService(k_params.k_lockedRule);
k_subsetData.destination = k_data.destination;
if (k_params.k_isEditable) {
k_subsetData.k_data = k_data;
}
k_gridData.unshift(k_subsetData);
}
else {
for (k_i = 0, k_cnt = k_gridData.length; k_i < k_cnt; k_i++) {
k_entry = k_gridData[k_i];
if (k_entry.definedService === k_definedService) {
k_subsetData.push(k_entry);
}
}
if (k_CONSTANTS.k_PROTOCOL_ID.k_TCP_UDP === k_data.protocol) {
k_data.protocol = k_CONSTANTS.k_PROTOCOL_ID.k_UDP;
if (k_isUniqueMethod(k_data, k_subsetData)) {
k_gridData.unshift(k_data);
}
k_data = kerio.lib.k_cloneObject(k_data, {
protocol: k_CONSTANTS.k_PROTOCOL_ID.k_TCP
});
if (k_isUniqueMethod(k_data, k_subsetData)) {
k_gridData.unshift(k_data);
}
}
else {
if (k_params.k_isEditMode || k_isUniqueMethod(k_data, k_subsetData)) {
k_gridData.unshift(k_data);
}
}
}
if (0 !== k_gridData.length) {
this.k_isNothing = false;
}
k_grid.k_setData(k_gridData);
}, 
k_getGridServices: function(k_update) {
var
k_dataStore = this.k_dataStore,
k_firewallServicesData = this.k_getPage('k_firewallServicesPage').k_getData(),
k_gridServices = [],
k_service,
k_i,
k_serviceCnt,
k_vpnServicesIndex,
k_webAdminSslIndex,
k_webServicesIndex;
if (true === k_update) {
k_gridServices = this.k_grid.k_getData();
}
else {
k_gridServices = kerio.lib.k_cloneObject(k_dataStore.k_mappingServices); }
for (k_i = 0, k_serviceCnt = k_gridServices.length; k_i < k_serviceCnt; k_i++) {
k_service = k_gridServices[k_i];
if (this.k_trVpnServices === k_service.k_reserved) {
k_vpnServicesIndex = k_i;
}
else if (this.k_trWebAdminSsl === k_service.k_reserved) {
k_webAdminSslIndex = k_i;
}
else if (this.k_trWebServices === k_service.k_reserved) {
k_webServicesIndex = k_i;
}
}
if (k_firewallServicesData.k_allowVpnServices) {
if (undefined === k_vpnServicesIndex) { if (k_dataStore.k_rules.k_vpnServicesRule && k_dataStore.k_rules.k_vpnServicesRule.k_locked) {
k_service = this.k_getLockedService(k_dataStore.k_rules.k_vpnServiceKvpn);
}
else {
k_service = this.k_grid.k_getServiceOrPort(k_dataStore.k_mappedServices.k_vpnServiceKvpn, k_dataStore.k_vpnServicePortKvpn);
k_service.destination = ''; k_service.k_reserved = this.k_trVpnServices;
}
k_service.k_isVpnServicesRule = true;
k_gridServices.push(k_service);
}
}
else if (undefined !== k_vpnServicesIndex){
delete k_gridServices[k_vpnServicesIndex];
}
if (k_firewallServicesData.k_allowWebAdminSsl) {
if (undefined === k_webAdminSslIndex) { if (k_dataStore.k_rules.k_webAdminRuleSsl && k_dataStore.k_rules.k_webAdminRuleSsl.k_locked) {
k_service = this.k_getLockedService(k_dataStore.k_rules.k_webAdminRuleSsl);
}
else {
k_service = this.k_grid.k_getServiceOrPort(k_dataStore.k_mappedServices.k_webAdminServiceSsl, k_dataStore.k_webAdminPortSsl);
k_service.destination = ''; k_service.k_reserved = this.k_trWebAdminSsl;
}
k_gridServices.push(k_service);
}
}
else if (undefined !== k_webAdminSslIndex){
delete k_gridServices[k_webAdminSslIndex];
}
if (k_firewallServicesData.k_allowWebServices) {
if (undefined === k_webServicesIndex) { if (k_dataStore.k_rules.k_webServicesRule && k_dataStore.k_rules.k_webServicesRule.k_locked) {
k_service = this.k_getLockedService(k_dataStore.k_rules.k_webServicesRule);
}
else {
k_service = this.k_grid.k_getServiceOrPort(k_dataStore.k_mappedServices.k_webServicePortHttp, k_dataStore.k_webServicePortHttps);
k_service.destination = ''; k_service.k_reserved = this.k_trWebServices;
}
k_gridServices.push(k_service);
}
}
else if (undefined !== k_webServicesIndex){
delete k_gridServices[k_webServicesIndex];
}
k_i = 0;
while (k_i < k_gridServices.length) {
if (undefined === k_gridServices[k_i]) {
k_gridServices.splice(k_i, 1);
}
else {
k_i++;
}
}
return k_gridServices;
},

k_deleteRows: function(k_answer) {
if ('no' === k_answer) {
return; }
this.k_removeSelectedRows();
if (this.k_isNothing && 0 === this.k_getRowsCount()) { this.k_isNothing = false; }
},

k_confirmDelete: function() {
var k_tr = kerio.lib.k_tr;
kerio.lib.k_confirm({
k_title: k_tr('Configuration Assistant', 'connectivityWizard'),
k_msg: k_tr('You are going to remove a rule used as a traffic condition in a Bandwidth Management rule.', 'policyWizard')
+ ' '
+ k_tr('Please note that removing such rule may present unintended result in the Bandwidth Management.', 'policyWizard')
+ '<br><br>'
+ k_tr('Do you want to continue?', 'common'),
k_callback: this.k_deleteRows,
k_scope: this
});
}
}; 