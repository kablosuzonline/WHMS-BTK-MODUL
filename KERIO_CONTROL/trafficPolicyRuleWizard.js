
kerio.waw.ui.trafficPolicyRuleWizard = {
k_init: function(k_objectName) {
var
k_shared = kerio.waw.shared,
k_DEFINITIONS = k_shared.k_DEFINITIONS,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_methods = k_shared.k_methods,
k_RULE_TYPE_GENERIC = 'GENERIC',
k_RULE_TYPE_PORT_MAPPING = 'PORT_MAPPING',
k_RULE_TYPE_POLICY_ROUTING = 'POLICY_ROUTING',
k_ROUTING_TYPE_INTERFACE = k_CONSTANTS.SourceNatMode.NatInterface,
k_ROUTING_TYPE_IP_ADDRESS = k_CONSTANTS.SourceNatMode.NatIpAddress,
k_PAGE_ID_RULE_TYPE = 'k_PAGE_ID_RULE_TYPE',
k_PAGE_ID_RULE_SOURCE = 'k_PAGE_ID_RULE_SOURCE',
k_PAGE_ID_RULE_DESTINATION = 'k_PAGE_ID_RULE_DESTINATION',
k_PAGE_ID_RULE_SERVICES = 'k_PAGE_ID_RULE_SERVICES',
k_PAGE_ID_RULE_PORT = 'k_PAGE_ID_RULE_PORT',
k_NO_PAGE = kerio.lib.K_Wizard2.prototype.k_NO_PAGE,
k_FIELD_WIDTH = 250,
k_LABEL_WIDTH = 95,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_wizard, k_wizardCfg,
k_pageSequenceList,
k_invisibleTabs,
k_ruleTypePage,
k_rulePortPage,
k_sourceGrid,
k_destinationGrid,
k_serviceGrid;
k_sourceGrid = new k_shared.k_widgets.K_TrafficSourceDestinationGrid(k_objectName + '_' + 'k_sourceGrid', { k_isSource: true });
k_destinationGrid = new k_shared.k_widgets.K_TrafficSourceDestinationGrid(k_objectName + '_' + 'k_destinationGrid', { k_isSource: false });
k_serviceGrid = new k_shared.k_widgets.K_TrafficServiceGrid(k_objectName + '_' + 'k_serviceGrid', {});
k_wizardCfg = {
k_height: 450,
k_width: 720,
k_isCancelable: true,
k_title: k_tr('Add New Rule', 'trafficPolicyRuleWizard'),
k_defaultItem: 'name',
k_hasHelpIcon: true,
k_isConfirmBeforeClosing: false,
k_pages: [
{
k_id: k_PAGE_ID_RULE_TYPE,
k_title: '',
k_tabTitle: k_tr('Rule type', 'trafficPolicyRuleWizard'),
k_isFinishPage: true,
k_backPageId: k_NO_PAGE,
k_items: [
{
k_type: 'k_container',
k_labelWidth: k_LABEL_WIDTH,
k_items: [
{
k_id: 'name',
k_caption: k_tr('Name:', 'common'),
k_value: k_DEFINITIONS.k_predefinedTrafficRuleName,
k_maxLength: 127,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false
}
}
]
},
{
k_type: 'k_fieldset',
k_className: 'marginTop',
k_caption: k_tr('Rule type', 'trafficPolicyRuleWizard'),
k_labelWidth: k_LABEL_WIDTH,
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_ruleType',
k_option: '<b>' + k_tr('Generic', 'trafficPolicyRuleWizard') + '</b> - <i>' + k_tr('allow or deny a particular traffic.', 'trafficPolicyRuleWizard') + '</i>',
k_value: k_RULE_TYPE_GENERIC,
k_isLabelHidden: true,
k_isChecked: true,
k_onChange: function(k_form, k_radio, k_value) {
var
k_wizard = k_form.k_wizard,
k_pageSequence = k_wizard.k_pageSequenceList[k_value];
k_form.k_setDisabled('action',                      k_wizard.k_RULE_TYPE_GENERIC !== k_value);
k_form.k_setDisabled('k_relatedItemsPortMapping',   k_wizard.k_RULE_TYPE_PORT_MAPPING !== k_value);
k_form.k_setDisabled('k_relatedItemspolicyRouting', k_wizard.k_RULE_TYPE_POLICY_ROUTING !== k_value);
k_wizard.k_setPageSequence(k_pageSequence);
k_wizard._k_pagesWidget.k_setVisibleTab(k_pageSequence, true);
k_wizard._k_pagesWidget.k_setVisibleTab(k_wizard.k_invisibleTabs[k_value], false);
}
},
k_DEFINITIONS.k_get('k_policySelectAction',
{
k_id: 'action',
k_width: k_FIELD_WIDTH,
k_caption: k_tr('Action:', 'trafficActionEditor'),
k_avoidEmptyValuePrompt: true,
k_value: k_CONSTANTS.RuleAction.Allow,
k_checkPreselectedValue: true,
k_indent: 1
}
),
{
k_type: 'k_radio',
k_groupId: 'k_ruleType',
k_option: '<b>' + k_tr('Port mapping', 'trafficPolicyRuleWizard') + '</b> - <i>' + k_tr('make a service in LAN accessible from the Internet.', 'trafficPolicyRuleWizard') + '</i>',
k_value: k_RULE_TYPE_PORT_MAPPING,
k_className: 'marginTop',
k_isLabelHidden: true
},
{
k_id: 'k_relatedItemsPortMapping',
k_type: 'k_container',
k_indent: 1,
k_isDisabled: true,
k_items: [
{
k_id: 'translatedHost',
k_width: k_FIELD_WIDTH,
k_caption: k_tr('Host:', 'trafficPolicyRuleWizard'),
k_maxLength: k_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_hasNoSpaces'
},

k_onChange: function(k_page, k_item, k_value) {
var k_isValidIPv6Address = kerio.waw.shared.k_methods.k_validators.k_isIpv6Address(k_value);
k_item.k_markInvalid(k_isValidIPv6Address, kerio.lib.k_tr('This field is for IPv4 host only. You can add the IPv6 mapping in the rule settings.', 'trafficPolicyRuleWizard'));
k_page.k_isInvalid = k_isValidIPv6Address;
}
},
{
k_type: 'k_row',
k_isLabelHidden: true,
k_items: [
{
k_id: 'service',
k_width: k_FIELD_WIDTH,
k_caption: k_tr('Service:', 'trafficPolicyRuleWizard'),
k_isReadOnly: true
},
{
k_id: 'k_btnSelect',
k_type: 'k_formButton',
k_caption: k_tr('Select…', 'common'),
k_onClick: function(k_form) {
var
k_serviceList = k_form.k_wizard.k_serviceList,
k_selectedItems = [],
k_i, k_cnt;
for (k_i = 0, k_cnt = k_serviceList.length; k_i < k_cnt; k_i++) {
k_selectedItems.push(k_serviceList[k_i].id);
}
k_form.k_serviceDialogParams.k_params.k_selectedItems = k_selectedItems;
kerio.lib.k_ui.k_showDialog(k_form.k_serviceDialogParams);
}
}
]
}
]
},
{
k_type: 'k_radio',
k_groupId: 'k_ruleType',
k_option: '<b>' + k_tr('Policy routing', 'trafficPolicyRuleWizard') + '</b> - <i>' + k_tr('use a specific outgoing interface or a public IP address for a particular traffic.', 'trafficPolicyRuleWizard') + '</i>',
k_value: k_RULE_TYPE_POLICY_ROUTING,
k_className: 'marginTop',
k_isLabelHidden: true
},
{
k_id: 'k_relatedItemspolicyRouting',
k_type: 'k_container',
k_indent: 1,
k_isDisabled: true,
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_routingType',
k_isLabelHidden: true,
k_option: k_tr('Interface:', 'trafficPolicyRuleWizard'),
k_isChecked: true,
k_value: k_ROUTING_TYPE_INTERFACE,
k_width: k_LABEL_WIDTH,
k_onChange: function(k_form, k_radio, k_value) {
var
k_wizard = k_form.k_wizard;
k_form.k_setDisabled('k_routingInterface', k_wizard.k_ROUTING_TYPE_INTERFACE !== k_value);
k_form.k_setDisabled('k_routingIpAddress', k_wizard.k_ROUTING_TYPE_IP_ADDRESS !== k_value);
}
},
{
k_type: 'k_select',
k_id: 'k_routingInterface',
k_caption: k_tr('Interface:', 'trafficNatEditor'),
k_width: k_FIELD_WIDTH,
k_localData: [],
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_listClassName: 'interfaceIcon',
k_fieldIconClassName: 'k_class'
}
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_routingType',
k_isLabelHidden: true,
k_option: k_tr('IP Address:', 'trafficPolicyRuleWizard'),
k_value: k_ROUTING_TYPE_IP_ADDRESS,
k_width: k_LABEL_WIDTH
},
{
k_id: 'k_routingIpAddress',
k_caption: k_tr('IP Address:', 'trafficPolicyRuleWizard'),
k_width: k_FIELD_WIDTH,
k_maxLength: k_CONSTANTS.k_MAX_LENGTH.k_IP_ADDRESS,
k_isDisabled: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: k_methods.k_allowOnlyIpv4Chars
}
]
}
]
}
]
}
],
k_onBeforeNextPage: function(k_page) {
var
k_tr = kerio.lib.k_tr,
k_interface;
this.k_ruleType = k_page.k_getItem('k_ruleType').k_getValue();
switch (this.k_ruleType) {
case this.k_RULE_TYPE_GENERIC:
if (this.k_parentGrid.k_isRuleUnfinished(k_page.k_getData(), true)) {
k_page.k_getItem('action').k_focus();
return false;
}
break;
case this.k_RULE_TYPE_PORT_MAPPING:
if ('' === k_page.k_getItem('service').k_getValue()) {
kerio.lib.k_alert({
k_title: k_tr('No service selected', 'trafficPolicyRuleWizard'),
k_msg: k_tr('Please select some service for this rule.', 'trafficPolicyRuleWizard')
});
return false;
}
if (k_page.k_isInvalid) {
kerio.lib.k_alert({
k_title: k_tr('Validation warning', 'wlibAlerts'),
k_msg: k_tr('Highlighted field is incorrect.', 'wlibAlerts')
});
return false;
}
kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_internetInterfaces',
k_select: this.k_mappedHostField,
k_form: k_page,
k_addNoneOption: false
}).k_sendRequest();
break;
case this.k_RULE_TYPE_POLICY_ROUTING:
if (this.k_ROUTING_TYPE_INTERFACE === this.k_routingTypeField.k_getValue()) {
k_interface = this.k_routingInterfaceField.k_listLoader;
if (k_interface.k_isEmpty()) {
kerio.lib.k_alert({
k_title: k_tr('No available interface', 'trafficNatEditor'),
k_msg: k_tr('There is no interface available. Please choose another Policy routing mode.', 'trafficPolicyRuleWizard')
});
return false;
}
}
break;
}
return this.k_chooseFollowingPage(k_page.k_id);
}
}, {
k_id: k_PAGE_ID_RULE_SOURCE,
k_title: '',
k_tabTitle: k_tr('Source', 'trafficPolicyRuleWizard'),
k_isFinishPage: true,
k_items: [
{
k_type: 'k_container',
k_content: k_sourceGrid
}
],
k_onBeforeNextPage: function(k_page) {
return this.k_chooseFollowingPage(k_page.k_id);
}
}, {
k_id: k_PAGE_ID_RULE_DESTINATION,
k_title: '',
k_tabTitle: k_tr('Destination', 'trafficPolicyRuleWizard'),
k_isFinishPage: true,
k_items: [
{
k_type: 'k_container',
k_content: k_destinationGrid
}
],
k_onBeforeNextPage: function(k_page) {
return this.k_chooseFollowingPage(k_page.k_id);
}
}, {
k_id: k_PAGE_ID_RULE_SERVICES,
k_title: '',
k_tabTitle: k_tr('Services', 'trafficPolicyRuleWizard'),
k_isFinishPage: true,
k_nextPageId: null,
k_items: [
{
k_type: 'k_container',
k_content: k_serviceGrid
}
]
}, {
k_id: k_PAGE_ID_RULE_PORT,
k_title: '',
k_tabTitle: k_tr('Port mapping', 'trafficPolicyRuleWizard'),
k_isFinishPage: true,
k_items: [
{
k_id: 'k_containerPublicPort',
k_type: 'k_container',
k_items: [
{
k_id: 'k_enableMappedPort',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Use different port on the public interface', 'trafficPolicyRuleWizard'),
k_onChange: function(k_form, k_select, k_isChecked) {
k_form.k_setDisabled(['k_mappedPort'], !k_isChecked);
}
},
{
k_type: 'k_number',
k_id: 'k_mappedPort',
k_caption: k_tr('Port:', 'trafficPolicyRuleWizard'),
k_indent: 1,
k_width: k_FIELD_WIDTH,
k_isDisabled: true,
k_maxLength: 5,
k_minValue: 1,
k_maxValue: 65535,
k_validator: {
k_allowBlank: false
}
}
]
},
{
k_id: 'k_containerPublicAddress',
k_type: 'k_container',
k_items: [
{
k_id: 'k_enableMappedHost',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Use specific public IP address', 'trafficPolicyRuleWizard'),
k_onChange: function(k_form, k_select, k_isChecked) {
k_form.k_setDisabled(['k_mappedHost'], !k_isChecked);
}
},
{
k_type: 'k_select',
k_id: 'k_mappedHost',
k_caption: k_tr('IP Address:', 'trafficPolicyRuleWizard'),
k_indent: 1,
k_width: k_FIELD_WIDTH,
k_isDisabled: true,
k_localData: [],
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id'
}
]
}
],
k_onBeforeShow: function(k_page) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
PortComparator = k_CONSTANTS.PortComparator,
k_PROTOCOL_ID = k_CONSTANTS.k_PROTOCOL_ID,
k_serviceList = this.k_serviceList,
k_isPortAllowed = false,
k_isAddressAllowed,
k_isDstPortEqualTo,
k_isSrcPortAny,
k_service;
if (1 === k_serviceList.length) {
k_service = k_serviceList[0];
k_isDstPortEqualTo = PortComparator.Equal === k_service.dstPort.comparator;
k_isSrcPortAny = k_service.srcPort && PortComparator.Any === k_service.srcPort.comparator;
if (k_isDstPortEqualTo && (!k_service.srcPort || k_isSrcPortAny) && false === k_service.group) {
this.k_mappedPorts = [{
definedService: false,
protocol: k_service.protocol,
port: {
comparator: PortComparator.Equal,
ports: [k_service.dstPort.ports[0]]
}
}];
if (k_PROTOCOL_ID.k_TCP_UDP === k_service.protocol) {
this.k_mappedPorts.push(kerio.lib.k_cloneObject(this.k_mappedPorts[0]));
this.k_mappedPorts[0].protocol = k_PROTOCOL_ID.k_TCP;
this.k_mappedPorts[1].protocol = k_PROTOCOL_ID.k_UDP;
}
k_isPortAllowed = true;
}
}
k_page.k_setDisabled('k_enableMappedPort', !k_isPortAllowed);
k_isAddressAllowed = !this.k_mappedHostField.k_listLoader.k_isEmpty();
k_page.k_setDisabled('k_enableMappedHost', !k_isAddressAllowed);
}
} ], k_onBeforeFinish: this.k_onBeforeFinish,
k_onBeforeShow: this.k_onBeforeShow,
k_onBeforeClose: this.k_onBeforeClose,
k_onAfterCancel: this.k_onBeforeClose
}; k_wizard = new k_lib.K_Wizard2(k_objectName, k_wizardCfg);
k_pageSequenceList = [];
k_pageSequenceList[k_RULE_TYPE_GENERIC]        = [k_PAGE_ID_RULE_TYPE, k_PAGE_ID_RULE_SOURCE, k_PAGE_ID_RULE_DESTINATION, k_PAGE_ID_RULE_SERVICES];
k_pageSequenceList[k_RULE_TYPE_PORT_MAPPING]   = [k_PAGE_ID_RULE_TYPE, k_PAGE_ID_RULE_PORT];
k_pageSequenceList[k_RULE_TYPE_POLICY_ROUTING] = [k_PAGE_ID_RULE_TYPE, k_PAGE_ID_RULE_SOURCE, k_PAGE_ID_RULE_SERVICES];
k_invisibleTabs = [];
k_invisibleTabs[k_RULE_TYPE_GENERIC]        = [k_PAGE_ID_RULE_PORT];
k_invisibleTabs[k_RULE_TYPE_PORT_MAPPING]   = [k_PAGE_ID_RULE_SOURCE, k_PAGE_ID_RULE_DESTINATION, k_PAGE_ID_RULE_SERVICES];
k_invisibleTabs[k_RULE_TYPE_POLICY_ROUTING] = [k_PAGE_ID_RULE_DESTINATION, k_PAGE_ID_RULE_PORT];
k_ruleTypePage = k_wizard.k_getPage(k_PAGE_ID_RULE_TYPE);
k_rulePortPage = k_wizard.k_getPage(k_PAGE_ID_RULE_PORT);
k_wizard.k_addReferences({
k_RULE_TYPE_GENERIC: k_RULE_TYPE_GENERIC,
k_RULE_TYPE_PORT_MAPPING: k_RULE_TYPE_PORT_MAPPING,
k_RULE_TYPE_POLICY_ROUTING: k_RULE_TYPE_POLICY_ROUTING,
k_ROUTING_TYPE_INTERFACE: k_ROUTING_TYPE_INTERFACE,
k_ROUTING_TYPE_IP_ADDRESS: k_ROUTING_TYPE_IP_ADDRESS,
k_ruleTypePage: k_ruleTypePage,
k_sourceGrid: k_sourceGrid,
k_destinationGrid: k_destinationGrid,
k_serviceGrid: k_serviceGrid,
k_servicePage: k_wizard.k_getPage(k_PAGE_ID_RULE_SERVICES),
k_rulePortPage: k_rulePortPage,
k_ruleType: k_RULE_TYPE_GENERIC,
k_routingTypeField: k_ruleTypePage.k_getItem('k_routingType'),
k_routingInterfaceField: k_ruleTypePage.k_getItem('k_routingInterface'),
k_routingIpAddressField: k_ruleTypePage.k_getItem('k_routingIpAddress'),
k_mappedHostField: k_rulePortPage.k_getItem('k_mappedHost'),
k_pageSequenceList: k_pageSequenceList,
k_invisibleTabs: k_invisibleTabs,
k_serviceList: [],
k_mappedPorts: null
});
k_ruleTypePage.k_addReferences({
k_isInvalid: false,
k_serviceDialogParams: {
k_sourceName: 'selectItems',
k_objectName: 'k_servicesSelectedByCheckbox',
k_params: {
k_onlyNew: true,
k_parentGrid: {
k_relatedForm: k_ruleTypePage,
k_findRow: function() {
return -1;
},
k_serviceIdReference: kerio.waw.shared.k_DEFINITIONS.k_get('k_trafficService'),
k_embeddedDefinitionsNeedUpdate: false,

k_requestClearEmbeddedDefinitions: function() {
this.k_embeddedDefinitionsNeedUpdate = true;
},

k_updateEmbeddedDefinitions: function() {
var
k_form,
k_datastore,
k_serviceListOrig,
k_serviceList,
k_serviceNames,
k_serviceListMapped,
k_service,
k_i, k_cnt;
if (true !== this.k_embeddedDefinitionsNeedUpdate) {
return;
}
this.k_embeddedDefinitionsNeedUpdate = false;
k_datastore = kerio.waw.shared.k_data.k_get('k_services');
if (!k_datastore) {
return;
}
k_form = this.k_relatedForm;
k_serviceListOrig = k_form.k_wizard.k_serviceList;
k_serviceListMapped = k_datastore.k_serviceListMapped;
k_serviceList = [];
k_serviceNames = [];
for (k_i = 0, k_cnt = k_serviceListOrig.length; k_i < k_cnt; k_i++) {
k_service = k_serviceListOrig[k_i];
if (undefined !== k_serviceListMapped[k_service.id]) {
k_serviceList.push(k_service);
k_serviceNames.push(k_service.name);
}
}
this.k_updateServiceList(k_form, k_serviceNames, k_serviceList);
},

k_updateServiceList: function(k_form, k_serviceNames, k_serviceList) {
k_form.k_getItem('service').k_setValue(k_serviceNames.join(', '));
k_form.k_wizard.k_serviceList = k_serviceList;
}
},
k_autoAdd: false, 
k_callback: function(k_ids, k_allServices) {
var
k_form = this.k_relatedForm,
k_serviceList = [],
k_serviceNames = [],
k_service,
k_i, k_cnt;
this.k_embeddedDefinitionsNeedUpdate = false;
for (k_i = 0, k_cnt = k_allServices.length; k_i < k_cnt; k_i++) {
k_service = k_allServices[k_i];
if (k_service.selected) {
k_serviceList.push(k_service);
k_serviceNames.push(k_service.name);
}
}
this.k_updateServiceList(k_form, k_serviceNames, k_serviceList);
}
}
}
});
k_serviceGrid.k_addReferences({
k_dialog: k_wizard
});
this.k_addControllers(k_wizard);
return k_wizard;
}, 
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_applyParams: function(k_params) {
var
k_shared = kerio.waw.shared,
k_parentGrid = k_params.k_parentGrid,
k_pageSequence = this.k_pageSequenceList[this.k_RULE_TYPE_GENERIC],
k_page;
this.k_setPageSequence(k_pageSequence);
this._k_pagesWidget.k_setVisibleTab(k_pageSequence, true);
this._k_pagesWidget.k_setVisibleTab(this.k_invisibleTabs[this.k_RULE_TYPE_GENERIC], false);
k_shared.k_data.k_cache({
k_dialog: this,
k_data: ['k_services', 'k_internetInterfaces'],
k_dialogs: ['selectItems']
});
kerio.waw.shared.k_methods.k_updateDataStore('k_internetInterfaces');
this.k_parentGrid = k_parentGrid;
k_page = this.k_ruleTypePage;
k_parentGrid.k_initNatInterfaceListLoader({
k_select: this.k_routingInterfaceField,
k_form: k_page
});
},

k_saveData: function() {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_ruleTypePage = this.k_ruleTypePage,
k_data = k_ruleTypePage.k_getData(),
k_services = [],
k_item,
k_cnt, k_i,
k_partialData;
switch (k_data.k_ruleType) {
case this.k_RULE_TYPE_GENERIC:
k_data.source = this.k_sourceGrid.k_getDataForSaving();
k_data.destination = this.k_destinationGrid.k_getDataForSaving();
k_data.service = this.k_serviceGrid.k_getDataForSaving();
break;
case this.k_RULE_TYPE_PORT_MAPPING:
k_partialData = this.k_rulePortPage.k_getData();
k_data.service = {
type: k_CONSTANTS.RuleConditionType.RuleAny,
entries: {}
};
k_data.action = k_CONSTANTS.RuleAction.Allow;
k_data.enableDestinationNat = true;
if (this.k_mappedPorts && k_partialData.k_enableMappedPort) {
k_data.translatedPort = {
enabled: true,
value: this.k_mappedPorts[0].port.ports[0]
};
this.k_mappedPorts[0].port.ports[0] = k_partialData.k_mappedPort;
if (this.k_mappedPorts[1]) {
this.k_mappedPorts[1].port.ports[0] = k_partialData.k_mappedPort;
}
k_data.service = {
type: k_CONSTANTS.RuleConditionType.RuleSelectedEntities,
entries: this.k_mappedPorts
};
}
else {
k_cnt = this.k_serviceList.length;
if (0 < k_cnt) {
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = this.k_serviceList[k_i];
k_services.push({
definedService: true,
service: {
id: k_item.id,
isGroup: k_item.group,
name: k_item.name,
k_invalid: false
}
});
}
k_data.service = {
type: k_CONSTANTS.RuleConditionType.RuleSelectedEntities,
entries: k_services
};
}
}
if (k_partialData.k_enableMappedHost) {
k_data.destination = {
type: k_CONSTANTS.RuleConditionType.RuleSelectedEntities,
firewall: false,
entities: [{
type: k_CONSTANTS.TrafficEntityType.TrafficEntityHost,
host: k_partialData.k_mappedHost,
addr1: k_partialData.k_mappedHost,
addr2: k_partialData.k_mappedHost
}]
};
}
else {
k_data.destination = {firewall: true};
}
break;
case this.k_RULE_TYPE_POLICY_ROUTING:
k_data.action = k_CONSTANTS.RuleAction.Allow;
k_data.source = this.k_sourceGrid.k_getDataForSaving();
k_data.service = this.k_serviceGrid.k_getDataForSaving();
k_data.destination = {
type: k_CONSTANTS.RuleConditionType.RuleSelectedEntities,
firewall: false,
entities: [
{
type: k_CONSTANTS.TrafficEntityType.TrafficEntityInterface,
interfaceCondition: {
type: k_CONSTANTS.InterfaceConditionType.InterfaceInternet
}
}
]
};
k_data.enableSourceNat = true;
k_data.natMode = this.k_routingTypeField.k_getValue();
if (this.k_ROUTING_TYPE_INTERFACE === k_data.natMode) {
k_data.natInterface = this.k_routingInterfaceField.k_listLoader.k_getValue();
}
else {
k_data.ipAddress = this.k_routingIpAddressField.k_getValue();
}
break;
}
this.k_parentGrid.k_addNewRule(k_data);
},

k_chooseFollowingPage: function(k_currentPageId) {
var
k_pageSequence = this.k_pageSequenceList[this.k_ruleType],
k_newPageIndex,
k_i, k_cnt;
k_cnt = k_pageSequence.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_currentPageId === k_pageSequence[k_i]) {
k_newPageIndex = k_i + 1;
break;
}
}
if (k_newPageIndex < k_cnt) {
return k_pageSequence[k_newPageIndex];
}
return '';
},

k_resetWizard: function() {
this.k_ruleTypePage.k_reset();
this.k_sourceGrid.k_clearData();
this.k_destinationGrid.k_clearData();
this.k_serviceGrid.k_clearData();
}
});
}, 
k_onBeforeShow: function() {
this.k_serviceList = [];
},

k_onBeforeFinish: function() {
this.k_saveData();
this.k_onBeforeClose();
},

k_onBeforeClose: function() {
this.k_resetWizard();
}
}; 