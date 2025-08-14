
kerio.waw.ui.trafficPolicyList = {

k_init: function(k_objectName) {
var
k_localNamespace,
k_tr = kerio.lib.k_tr,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_isAuditor = k_WAW_METHODS.k_isAuditor(),
k_inspectorColumnId = 'inspector',
k_protocolTcp = k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP,
k_protocolUdp = k_WAW_CONSTANTS.k_PROTOCOL_ID.k_UDP,
k_COLUMN_ID_ACTION = 'actionRenderer',
k_protocolNames = {},
k_findField,
k_cleanupData,
k_inspectorEditor,
k_ipVersionEditor,
k_multilineRenderer,
k_setMultilineProperties,
k_renderServiceItem,
k_gridMultilineRenderer,
k_renderTrafficEntityItem,
k_renderTranslationRow,
k_isInactiveRule,
k_lineRenderAction,
k_renderAction,
k_gridCfg,
k_gridId,
k_grid,
k_lastUsedRenderer,
k_reloadDataOrigin;
k_WAW_CONSTANTS.k_TRAFFIC_RULE_LOG_INDEX = {
k_PACKETS: 0,
k_CONNECTIONS: 1
};

k_setMultilineProperties = function(k_columnIndex, k_data) {
var
k_multilineProperties = this.k_multilineProperties,
k_columnId,
k_method,
k_stringProperty,
k_referenceList,
k_trafficConditionType;
k_columnId = this.k_getColumnId(k_columnIndex);
k_stringProperty = 'k_data';switch (k_columnId) {
case 'sourceList':
k_method = this.k_renderTrafficEntityItem;
k_referenceList = k_data.data.sourceList;
k_trafficConditionType = k_data.data.source.type;
break;
case 'destinationList':
k_method = this.k_renderTrafficEntityItem;
k_referenceList = k_data.data.destinationList;
k_trafficConditionType = k_data.data.destination.type;
break;
case 'serviceList':
k_method = this.k_renderServiceItem;
k_referenceList = k_data.data.serviceList;
k_trafficConditionType = k_data.data.service.type;
break;
case 'translation':
k_method = this.k_renderTranslationRow;
k_referenceList = k_data.data.translation;
k_trafficConditionType = (0 === k_referenceList.length ?
kerio.waw.shared.k_CONSTANTS.RuleConditionType.k_NONE :
kerio.waw.shared.k_CONSTANTS.RuleConditionType.RuleSelectedEntities);
break;
default:
return;}
if (kerio.lib.k_isSafari) {
delete k_multilineProperties.k_method;
delete k_multilineProperties.k_stringProperty;
delete k_multilineProperties.k_referenceList;
delete k_multilineProperties.k_trafficConditionType;
}
k_multilineProperties.k_method = k_method;
k_multilineProperties.k_stringProperty = k_stringProperty;
k_multilineProperties.k_referenceList = k_referenceList;
k_multilineProperties.k_trafficConditionType = k_trafficConditionType;
};
k_renderServiceItem = function(k_data, k_grid) {
var
k_return = {};
if (k_data.k_isNothing) {
k_return.k_iconCls = 'policyGrid gridListIcon objectNothing';
k_return.k_data = k_grid.k_translations.k_nothing;
return k_return;
}
if (k_data.definedService) {
k_return = kerio.waw.shared.k_methods.k_formatServiceName(k_data.service.name, k_data.service);
k_return.k_iconCls = 'gridListIcon ' + k_return.k_iconCls;
} else {
k_return.k_data = k_grid.k_protocolNames[k_data.protocol] +
' ' + kerio.waw.shared.k_methods.k_formatPort(k_data.port);
k_return.k_iconCls = 'gridListIcon portIcon';
}
return k_return;
};

k_renderTrafficEntityItem = function(k_data, k_grid) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_TYPE = k_WAW_CONSTANTS.TrafficEntityType,
k_GROUP_TYPES = k_WAW_CONSTANTS.kerio_web_SharedConstants,
k_IPSEC_TUNNEL_TYPE = k_WAW_CONSTANTS.VpnType.VpnIpsec,
k_renderers = kerio.waw.shared.k_methods.k_renderers,
k_vpnTunnelsData = kerio.waw.shared.k_data.k_getStore('k_vpnTunnels').k_getData(),
k_tooltip = '',
k_entityType = k_data.type,
k_iconCls,
VpnConditionType,
InterfaceConditionType,
InterfaceGroupType,
k_interfaceCondition,
k_interfaceContitionType,
k_interfaceGroupRemaped,
k_vpnCondition,
k_rowData,
k_rendererInput = {},
k_rendererOutput,
k_i, k_cnt, k_item,
k_flags;
if (k_data.k_isNothing) {
k_iconCls = 'objectNothing';
k_rowData = k_grid.k_translations.k_nothing;
k_tooltip = k_grid.k_translations.k_invalidItem;
}
else {
switch (k_entityType) {
case k_TYPE.k_FIREWALL:
case k_TYPE.TrafficEntityHost:
case k_TYPE.TrafficEntityPrefix:
case k_TYPE.TrafficEntityNetwork:
case k_TYPE.TrafficEntityRange:
k_rendererInput = {
type: '',
host: k_data.host,
addr1: k_data.addr1,
addr2: k_data.addr2
};
switch (k_entityType) {
case k_TYPE.k_FIREWALL:
k_rendererInput.type = k_GROUP_TYPES.kerio_web_ThisMachine;
break;
case k_TYPE.TrafficEntityHost:
k_rendererInput.type = k_GROUP_TYPES.kerio_web_Host;
break;
case k_TYPE.TrafficEntityPrefix:
k_rendererInput.type = k_GROUP_TYPES.kerio_web_IpPrefix;
break;
case k_TYPE.TrafficEntityNetwork:
k_rendererInput.type = k_GROUP_TYPES.kerio_web_Network;
break;
case k_TYPE.TrafficEntityRange:
k_rendererInput.type = k_GROUP_TYPES.Range;
break;
}k_rendererOutput = k_renderers.k_addressGroupItemRenderer(undefined, k_rendererInput);
k_rowData = k_rendererOutput.k_data;
k_iconCls = k_rendererOutput.k_iconCls;
break;
case k_TYPE.TrafficEntityAddressGroup:
k_rendererInput.validAddressGroup = k_data.addressGroup;
k_rendererOutput = k_renderers.k_addressGroupRenderer(null, k_rendererInput);
k_rowData = k_rendererOutput.k_data;
k_iconCls = k_rendererOutput.k_iconCls;
k_tooltip = k_rendererOutput.k_dataTooltip;
break;
case k_TYPE.TrafficEntityInterface:
InterfaceConditionType = k_WAW_CONSTANTS.InterfaceConditionType;
k_interfaceCondition = k_data.interfaceCondition;
k_interfaceContitionType = k_interfaceCondition.type;
if (InterfaceConditionType.InterfaceSelected === k_interfaceContitionType) {
if (k_interfaceCondition.flags) {
k_flags = k_interfaceCondition.flags;
}
else {
k_flags = {
virtualSwitch: 'LanSwitch' === k_interfaceCondition.selectedInterface.id
};
}
k_rendererOutput = k_WAW_METHODS.k_formatInterfaceName(
k_interfaceCondition.selectedInterface.name,
{	type: k_interfaceCondition.interfaceType,
enabled: true,
flags: k_flags
},
false
);} else {
InterfaceGroupType = k_WAW_CONSTANTS.InterfaceGroupType;
switch (k_interfaceContitionType) {
case InterfaceConditionType.InterfaceInternet:
k_interfaceGroupRemaped = InterfaceGroupType.Internet;
break;
case InterfaceConditionType.InterfaceTrusted:
k_interfaceGroupRemaped = InterfaceGroupType.Trusted;
break;
case InterfaceConditionType.InterfaceGuest:
k_interfaceGroupRemaped = InterfaceGroupType.Guest;
break;
}
k_rendererOutput = k_renderers.k_interfaceGroupNameRenderer(k_interfaceGroupRemaped);
}
k_rowData = k_rendererOutput.k_data;
k_iconCls = k_rendererOutput.k_iconCls;
break;
case k_TYPE.TrafficEntityVpn:
VpnConditionType = k_WAW_CONSTANTS.VpnConditionType;
k_vpnCondition = k_data.vpnCondition;
k_iconCls = 'interfaceIcon ';
switch (k_vpnCondition.type) {
case VpnConditionType.AllTunnels:
k_rowData = k_grid.k_translations.k_allTunnels;
k_iconCls += 'interfaceAllVpnTunnels';
break;
case VpnConditionType.IncomingClient:
k_rowData = k_grid.k_translations.k_allClients;
k_iconCls += 'interfaceVpnServer';
break;
case VpnConditionType.SelectedTunnel:
k_item = {};
k_cnt = k_vpnTunnelsData.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_vpnTunnelsData[k_i];
if (k_item.id === k_vpnCondition.tunnel.id) {
break;
}
}
if (k_item && k_item.tunnel && k_IPSEC_TUNNEL_TYPE === k_item.tunnel.type) {
k_iconCls += 'interfaceIpsecTunnel';
}
else {
k_iconCls += 'interfaceVpnTunnel';
}
k_rowData = k_vpnCondition.tunnel.name;
break;
}
break;
case k_TYPE.TrafficEntityUsers:
if (k_WAW_CONSTANTS.UserConditionType.AuthenticatedUsers === k_data.userType){
k_rowData = k_grid.k_translations.k_authenticatedUsers;
k_iconCls = 'authUsersIcon';
} else {
k_rendererOutput = k_WAW_METHODS.k_createReferencedUserName(k_data.user);
k_rowData = k_rendererOutput.k_userName;
k_iconCls = k_rendererOutput.k_iconClass;
}
break;
}
}
return {
k_data: k_rowData,
k_iconCls: 'gridListIcon ' + k_iconCls,
k_tooltip: k_tooltip
};
};
k_renderTranslationRow = function(k_value, k_grid, k_data) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_translationTypes = k_grid.k_translationTypes,
k_translations = k_grid.k_translations,
k_rowData,
k_NAT_MODES;
switch (k_value.k_type) {
case k_translationTypes.k_sourceNat:
if (k_data.allowReverseConnection) {
k_rowData = k_translations.k_natFullCone;
}
else {
k_rowData = k_translations.k_natSimple;
}
k_NAT_MODES = k_WAW_CONSTANTS.SourceNatMode;
switch (k_data.natMode) {
case k_NAT_MODES.NatInterface:
k_rowData += ' (' + k_data.natInterface.name + ')';
break;
case k_NAT_MODES.NatIpAddress:
if (k_data.ipv6Address) {
k_rowData += ' (' + k_data.ipAddress + ', ' + k_data.ipv6Address + ')';
}
else {
k_rowData += ' (' + k_data.ipAddress + ')';
}
break;
}
break;
case k_translationTypes.k_balancing:
if (k_WAW_CONSTANTS.NatBalancing.BalancingPerHost === k_data.balancing) {
k_rowData = k_translations.k_balancingPerHost;
} else {
k_rowData = k_translations.k_balancingPerConnection;
}
break;
case k_translationTypes.k_destinationNatIpv4:
k_rowData = k_translations.k_destinationNat + ' ' +
k_data.translatedHost +
(k_data.translatedPort.enabled ? (':' + k_data.translatedPort.value) : '');
break;
case k_translationTypes.k_destinationNatIpv6:
k_rowData = k_translations.k_destinationNat + ' [' +
k_data.translatedIpv6Host + ']' +
(k_data.translatedPort.enabled ? (':' + k_data.translatedPort.value) : '');
break;
}
k_value.k_searchValue = k_rowData;
return {
k_data: k_rowData,
k_isSecure: true
};
};
k_gridMultilineRenderer = function(k_value, k_data, k_rowIndex, k_colIndex, k_grid, k_itemIndex) {
var
k_multilineProperties = k_grid.k_multilineProperties,
k_displayLimit = k_multilineProperties.k_listMaxItems - 1, k_cnt = k_multilineProperties.k_referenceList.length - k_displayLimit,
k_isLimited = (k_displayLimit === k_itemIndex && 1 < k_cnt), k_highlightedData,
k_highligtedObject,
k_listItemObj,
k_rowData,
k_iconCls,
k_tooltip;
if (k_isLimited) {
k_rowData = kerio.lib.k_tr('…and %1 more', 'userList', {k_args:[k_cnt]});
k_iconCls = '';
k_tooltip = kerio.lib.k_htmlEncode(
kerio.waw.shared.k_methods.k_joinReferenceList(
{	k_referenceList: k_multilineProperties.k_referenceList,
k_start: k_displayLimit,
k_method: k_multilineProperties.k_method,
k_grid: k_grid,
k_stringProperty: k_multilineProperties.k_stringProperty
}
)
);
k_value.k_searchValue = k_tooltip;
k_highligtedObject = k_grid.k_highlightPassedValue(k_rowData, k_tooltip, k_data);
k_highlightedData = k_highligtedObject.k_data;
k_tooltip = k_highligtedObject.k_tooltip;
}
else {
k_listItemObj = k_multilineProperties.k_method(k_value, k_grid, k_data);
k_rowData = k_listItemObj.k_data;
k_iconCls = k_listItemObj.k_iconCls;
k_tooltip = k_listItemObj.k_tooltip || '';
k_value.k_searchValue = k_rowData;
k_highlightedData = k_grid.k_highlightSearchValueRenderer(k_rowData, k_data);
}
return {
k_isSecure: true,
k_data: k_highlightedData,
k_iconCls: k_iconCls,
k_dataTooltip: k_tooltip,
k_iconTooltip: k_tooltip
};
};
k_multilineRenderer = function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_isCollapsible = k_WAW_CONSTANTS.k_COLLAPSE_MULTILINE_LIST,
k_TYPE = k_WAW_CONSTANTS.RuleConditionType,
k_multilineProperties = k_grid.k_multilineProperties,
k_translations = k_grid.k_translations,
k_className = 'userList',
k_collapsedData,
k_collapsedTooltip,
k_collapsedValue;
k_grid.k_setMultilineProperties.call(k_grid, k_columnIndex, k_data);
switch (k_multilineProperties.k_trafficConditionType) {
case k_TYPE.RuleInvalidCondition:
k_multilineProperties.k_referenceList.push({k_isNothing: true});
k_collapsedTooltip = k_translations.k_noService;
break;
case k_TYPE.RuleSelectedEntities:
if (k_isCollapsible) {
k_collapsedData = kerio.waw.shared.k_methods.k_formatCollapsedRowData(
{	k_referenceList: k_multilineProperties.k_referenceList,
k_method: k_multilineProperties.k_method,
k_stringProperty: k_multilineProperties.k_stringProperty
}
);
k_collapsedTooltip = k_collapsedData.k_tooltip;
k_collapsedValue = k_collapsedData.k_value;
}
break;
case k_TYPE.k_NONE:
k_collapsedValue = ' '; break;
default:
k_collapsedValue = k_grid.k_highlightSearchValueRenderer(k_translations.k_any, k_data);
}
return {
k_className: k_className,
k_isCollapsible: k_isCollapsible,
k_maxItems: k_multilineProperties.k_listMaxItems,
k_collapsedValue: k_collapsedValue,
k_collapsedTooltip: k_collapsedTooltip,
k_isSecure: true,
k_lineRenderer: k_grid.k_gridMultilineRenderer
};
};

k_lineRenderAction = function(k_value, k_data, k_rowIndex, k_colIndex, k_grid, k_itemIndex) {
var
k_INDEX_ACTION = 0,
k_INDEX_ACCOUNTING = 1,
k_INDEX_DSCP = 2,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
RuleAction = k_WAW_CONSTANTS.RuleAction,
k_TRAFFIC_RULE_LOG_INDEX = k_WAW_CONSTANTS.k_TRAFFIC_RULE_LOG_INDEX,
k_translations = k_grid.k_translations,
k_displayedValue = '',
k_isEnabledGraph,
k_isEnabledLogPackets,
k_isEnabledLogConnections,
k_separator,
k_dataTooltip,
k_iconCls;
switch (k_itemIndex) {
case k_INDEX_ACTION:
switch (k_data.action) {
case RuleAction.Allow:
k_displayedValue = k_translations.k_allow;
k_iconCls = 'allow';
break;
case RuleAction.Deny:
k_displayedValue = k_translations.k_deny;
k_iconCls = 'deny';
break;
case RuleAction.Drop:
k_displayedValue = k_translations.k_drop;
k_iconCls = 'drop';
break;
default:
k_displayedValue = k_translations.k_noAction;
k_iconCls = 'unset';
break;
} break;
case k_INDEX_ACCOUNTING:
k_isEnabledGraph = k_data.graphEnabled;
if (k_data.logEnabled) {
k_isEnabledLogPackets = k_data.logEnabled[k_TRAFFIC_RULE_LOG_INDEX.k_PACKETS];
k_isEnabledLogConnections = k_data.logEnabled[k_TRAFFIC_RULE_LOG_INDEX.k_CONNECTIONS] && RuleAction.Allow === k_data.action;
}
if (k_isEnabledGraph || k_isEnabledLogPackets || k_isEnabledLogConnections) {
k_displayedValue = k_translations.k_accounting;
k_iconCls = 'log';
k_dataTooltip = k_translations.k_captionAccounting;
k_separator = ' ';
if (k_isEnabledGraph) {
k_dataTooltip += k_separator + k_translations.k_trafficGraph;
k_separator = ', ';
}
if (k_isEnabledLogPackets) {
k_dataTooltip += k_separator + k_translations.k_logPackets;
k_separator = ', ';
}
if (k_isEnabledLogConnections) {
k_dataTooltip += k_separator + k_translations.k_logConnections;
}
}
break;
case k_INDEX_DSCP:
if (k_data.dscp && k_data.dscp.enabled && RuleAction.Allow === k_data.action) {
k_displayedValue = k_translations.k_dscp + k_data.dscp.value;
k_iconCls = 'dscp';
}
break;
default:
break;
} if (undefined !== k_iconCls) {
k_iconCls = 'gridListIcon ruleAction ' + k_iconCls;
}
k_data.actionRenderer[k_itemIndex] = {
k_searchValue: k_displayedValue
};
return {
k_data: k_grid.k_highlightSearchValueRenderer(k_displayedValue, k_data),
k_dataTooltip: k_dataTooltip,
k_iconCls: k_iconCls,
k_isSecure: true
};
};

k_renderAction = function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
return {
k_isCollapsible: false,
k_lineRenderer: k_grid.k_lineRenderAction
};
};
k_ipVersionEditor = {
k_type: 'k_select',
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',
k_localData: k_WAW_DEFINITIONS.k_ipVersions,
k_onBlur: function(k_grid, k_select) {
var
k_editInfo = k_grid.k_getEditInfo(),
k_ipVersion = k_editInfo.k_rowData.ipVersion;
if (k_ipVersion === k_editInfo.k_origValue && k_ipVersion === k_select._k_prevValue) {
return; }
k_grid._k_onChangeHandler();
}
};
k_inspectorEditor = {
k_type: 'k_select',
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',
k_localData: [],

k_onBlur: function(k_grid, k_select) {
var
k_editInfo = k_grid.k_getEditInfo(),
k_inspector = k_editInfo.k_rowData.inspector;
if (k_inspector === k_editInfo.k_origValue && k_inspector === k_select._k_prevValue) {
return; }
k_grid._k_onChangeHandler();
}
};

k_isInactiveRule = function(k_data) {
var
RuleInvalidCondition = kerio.waw.shared.k_CONSTANTS.RuleConditionType.RuleInvalidCondition,
k_i,
k_entities,
k_entityContainer,
k_addressGroup;
if (RuleInvalidCondition === k_data.destination.type ||
RuleInvalidCondition === k_data.source.type ||
RuleInvalidCondition === k_data.service.type) {
return true;
}
k_entityContainer = k_data.source;
for (k_i = 0; k_i < 2; k_i++) {
k_entities = k_entityContainer.entities;
if (k_entities && !k_entityContainer.firewall && 1 === k_entities.length) {
k_addressGroup = k_entities[0].addressGroup;
if (k_addressGroup && k_addressGroup.invalid) {
return true;
}
}
k_entityContainer = k_data.destination;
}
return false;
};

k_lastUsedRenderer = function(k_value, k_data) {
var
k_text = kerio.waw.shared.k_methods.k_formatTimeSpan(k_value, null, true);
k_value.k_searchValue = k_text;
return {
k_data: this.k_highlightSearchValueRenderer(k_text, k_data),
k_isSecure: true
};
};

k_cleanupData = function(k_data) {
var
k_i, k_cnt,
k_rule;
if (!k_data) {
return;
}
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_rule = k_data[k_i];
delete k_rule.prepareColumns;
delete k_rule.sourceList;
delete k_rule.destinationList;
delete k_rule.serviceList;
delete k_rule.translation;
delete k_rule.actionRenderer;
delete k_rule.validTimeRangeEditor;
delete k_rule.inactive;
delete k_rule.k_isFirstInHiddenGroup;
delete k_rule.k_isFound;
delete k_rule.k_isHidden;
delete k_rule.lastUsed;
delete k_rule.k_routingInterface;
delete k_rule.k_routingType;
delete k_rule.k_ruleType;
}
};k_gridCfg = {
k_className: 'trafficRules',
k_objectName: k_objectName,
k_isAuditor: k_isAuditor,
k_manager: 'TrafficPolicy',
k_wizard: 'policyWizard',
k_newItemDefinition: 'k_predefinedTrafficRule',
k_skipDefaultInactiveRuleCheck: true,
k_isInactiveRule: k_isInactiveRule,
k_customInactiveRuleCheck: k_WAW_METHODS.k_reportUnknownUsers,
k_isQueryValueSent: false,
k_cleanupData: k_cleanupData,
k_isEnterMappedToDoubleClick: true,

k_onClick: function(k_grid, k_rowData, k_event) {
if (!k_rowData.k_isHidden || k_event.k_browserEvent.ctrlKey || k_event._k_isShiftKey) {
k_grid.k_event = k_event;
return;
}
var
k_rowsCount = k_grid.k_getRowsCount(),
k_firstIndex,
k_rowIteratorData,
k_rowIterator;
k_rowIterator = k_rowData.k_isDefaultRule ? k_rowsCount - 1 : k_grid.k_findRow('id', k_rowData.id)[0];
k_firstIndex = k_rowIterator;
k_rowIteratorData = k_rowsCount > k_rowIterator ? k_grid.k_getRowByIndex(k_rowIterator) : false;
while (k_rowIteratorData && k_rowIteratorData.k_isHidden) {
k_rowIteratorData.k_isHidden = false;
k_grid.k_hiddenRows[k_rowIterator] = false;
k_rowIterator++;
k_rowIteratorData = k_rowsCount > k_rowIterator ? k_grid.k_getRowByIndex(k_rowIterator) : false;
if (k_rowIteratorData.k_isFirstInHiddenGroup) {
break;
}
}
k_grid.k_refresh();
k_grid.k_enableRestoreButton();
k_grid.k_selectRows(k_firstIndex, false);
},

k_onCellDblClick: function(k_grid, k_rowData, k_columnId) {
var
k_dialogName, k_dialogType,
k_callback;
if (k_rowData.k_isHidden) {
return;
}
if (k_grid._k_isAuditor && 'users' !== k_columnId) {
return; }
if (k_rowData.k_isDefaultRule && k_grid.k_COLUMN_ID_ACTION !== k_columnId) {
return; }
switch (k_columnId) {
case k_grid.k_COLUMN_ID_ACTION:
k_dialogName = 'trafficActionEditor';
k_callback = k_grid.k_saveAction;
break;
case 'translation':
k_dialogName = 'trafficNatEditor';
break;
case 'source':
case 'sourceList':
k_dialogName = 'trafficSourceDestinationEditor';
k_dialogType = 'trafficSourceEditor';
break;
case 'destination':
case 'destinationList':
k_dialogName = 'trafficSourceDestinationEditor';
k_dialogType = 'trafficDestinationEditor';
break;
case 'serviceList':
k_dialogName = 'trafficServiceEditor';
break;
default:
return false;
}kerio.lib.k_ui.k_showDialog({
k_sourceName: k_dialogName,
k_objectName: k_dialogType || k_dialogName,
k_params: {
k_data: k_rowData,
k_relatedGrid: k_grid,
k_callback: k_callback
}
});
},
k_onRowSelect: function (k_grid, k_index) {
var
k_rowsCount = this.k_getRowsCount(),
k_rowIterator = k_index,
k_rowIteratorData = this.k_getRowByIndex(k_rowIterator),
k_selectedRows = [];
if (this.k_selectionInProgress || !k_rowIteratorData.k_isHidden) {
return;
}
this.k_selectionInProgress = true;
while (k_rowIteratorData && k_rowIteratorData.k_isHidden) {
k_selectedRows.push(k_rowIterator);
if (true === k_rowIteratorData.k_isFirstInHiddenGroup) { break;
}
k_rowIterator--;
k_rowIteratorData = 0 <= k_rowIterator ? this.k_getRowByIndex(k_rowIterator) : false;
}
k_rowIterator = k_index + 1;
k_rowIteratorData = k_rowsCount > k_rowIterator ? this.k_getRowByIndex(k_rowIterator) : false;
while (k_rowIteratorData && k_rowIteratorData.k_isHidden && true !== k_rowIteratorData.k_isFirstInHiddenGroup) {
k_selectedRows.push(k_rowIterator);
k_rowIterator++;
k_rowIteratorData = k_rowsCount > k_rowIterator ? this.k_getRowByIndex(k_rowIterator) : false;
}
this.k_selectRows(k_selectedRows, true);
this.k_selectionInProgress = false;
},

k_onDropCustom: function (k_data, k_rowIndex, k_isCopy) {
var
k_i, k_cnt;
if (k_isCopy) {
k_cnt = k_data.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
this.k_updateRow({lastUsed: { isValid: false }}, k_rowIndex + k_i);
}
}
},
k_columns: {
prepareColumns:			{	k_columnId: 'prepareColumns',
k_isHidden: true, k_isKeptHidden: true,

k_renderer: function(k_value, k_data, k_rowIndex) {
var
k_lib = kerio.lib,
k_firewall = this.k_firewallEntity,
k_translationTypes = this.k_translationTypes,
k_translation = [];
k_data.sourceList = k_lib.k_cloneObject(k_data.source.entities);
k_data.destinationList = k_lib.k_cloneObject(k_data.destination.entities);
k_data.actionRenderer = k_lib.k_cloneObject(this.k_actionRendererData);
k_data.sourceList.sort(this.k_compareEntityItems);
k_data.destinationList.sort(this.k_compareEntityItems);
if (k_data.source.firewall) {
k_data.sourceList.unshift(k_firewall);
}
if (k_data.destination.firewall) {
k_data.destinationList.unshift(k_firewall);
}
if (!kerio.waw.shared.k_methods.k_comparePortsNumerically) {

kerio.waw.shared.k_methods.k_comparePortsNumerically = function(k_first, k_second) {
return k_first - k_second;
};
}
k_data.service.entries.sort(this.k_sortServices);
k_data.serviceList = k_lib.k_cloneObject(k_data.service.entries); if (k_data.enableSourceNat) {
k_translation.push({k_type: k_translationTypes.k_sourceNat});
}
if (k_data.enableSourceNat && kerio.waw.shared.k_CONSTANTS.SourceNatMode.NatDefault === k_data.natMode) {
k_translation.push({k_type: k_translationTypes.k_balancing});
}
if (k_data.enableDestinationNat) {
k_translation.push({k_type: k_translationTypes.k_destinationNatIpv4});
if (undefined !== k_data.natIpv4Only && true !== k_data.natIpv4Only) {
k_translation.push({k_type: k_translationTypes.k_destinationNatIpv6});
}
}
k_data.translation = k_translation;
if (this._k_searchValue) {
this.k_btnRestore.k_setDisabled(false);
}
k_data.k_isFound = false;
if (undefined !== this.k_hiddenRows[k_rowIndex]) {
k_data.k_isHidden = this.k_hiddenRows[k_rowIndex];
}
return {k_data: ''}; }},
actionRenderer:			{	k_columnId: k_COLUMN_ID_ACTION,
k_caption: k_tr('Action', 'common'),
k_width: k_WAW_DEFINITIONS.k_actionColumnWidth,
k_multilineRenderer: k_renderAction
},
action:					{	k_columnId: 'action',
k_isHidden: true, k_isKeptHidden: true
},
source:					{	k_columnId: 'source',
k_isHidden: true, k_isKeptHidden: true
},
destination:			{	k_columnId: 'destination',
k_isHidden: true, k_isKeptHidden: true
},
sourceList:				{	k_columnId: 'sourceList',
k_caption: k_tr('Source', 'trafficPolicy'),
k_width: 150,
k_multilineRenderer: k_multilineRenderer
},
destinationList:		{	k_columnId: 'destinationList',
k_caption: k_tr('Destination', 'trafficPolicy'),
k_width: 150,
k_multilineRenderer: k_multilineRenderer
},
service:				{	k_columnId: 'service',
k_isHidden: true, k_isKeptHidden: true
},
serviceList:			{	k_columnId: 'serviceList',
k_caption: k_tr('Service', 'trafficPolicy'),
k_width: 120,
k_multilineRenderer: k_multilineRenderer
},
lastUsed:               {   k_columnId: 'lastUsed',
k_caption: k_tr('Last used', 'trafficPolicy'),
k_width: 120,
k_renderer: k_lastUsedRenderer
},
enableSourceNat:		{	k_columnId: 'enableSourceNat',
k_isHidden: true, k_isKeptHidden: true
},
natMode:				{	k_columnId: 'natMode',
k_isDataOnly  : true
},
allowReverseConnection: {	k_columnId: 'allowReverseConnection',
k_isDataOnly  : true
},
balancing:				{	k_columnId: 'balancing',
k_isDataOnly  : true
},
natInterface:			{	k_columnId: 'natInterface',
k_isDataOnly  : true
},
allowFailover:			{	k_columnId: 'allowFailover',
k_isDataOnly  : true
},
ipAddress:				{	k_columnId: 'ipAddress',
k_isDataOnly  : true
},
ipv6Address:			{	k_columnId: 'ipv6Address',
k_isDataOnly  : true
},
enableDestinationNat:	{	k_columnId: 'enableDestinationNat',
k_isDataOnly  : true
},
translatedHost:			{	k_columnId: 'translatedHost',
k_isDataOnly  : true
},
translatedPort:			{	k_columnId: 'translatedPort',
k_isDataOnly  : true
},
translatedIpv6Host:		{	k_columnId: 'translatedIpv6Host',
k_isDataOnly  : true
},
ipVersion:              {
k_columnId: 'ipVersion',
k_caption: k_tr('IP version', 'trafficPolicy'),
k_editor: k_ipVersionEditor,
k_width: 100,
k_renderer: function(k_value, k_data) {
var
k_shared = kerio.waw.shared,
k_IP_VERSIONS = k_shared.k_CONSTANTS.TrafficIpVersion,
k_ipVersionsMapped =k_shared.k_DEFINITIONS.k_ipVersionsMapped;
if ('' === k_value) {
k_data.ipVersion = k_IP_VERSIONS.IpAll;
k_value = k_IP_VERSIONS.IpAll;
}
return {
k_data: k_ipVersionsMapped[k_value]
};
}
},
inspector:				{	k_columnId: k_inspectorColumnId,
k_caption: k_tr('Inspector', 'trafficPolicy'),
k_editor: k_inspectorEditor,
k_isHidden: true,
k_width: 100,

k_renderer: function(k_value, k_data, k_rowIndex, k_colIndex, k_grid) {
var k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS;
switch (k_value) {
case k_WAW_CONSTANTS.k_DEFAULT_INSPECTORS.k_NONE:
k_value = k_grid.k_translations.k_none;
break;
case k_WAW_CONSTANTS.k_DEFAULT_INSPECTORS.k_DEFAULT:
k_value = k_grid.k_translations.k_default;
break;
}
return {
k_data: k_grid.k_highlightSearchValueRenderer(k_value, k_data),
k_isSecure: true
};
}},
logEnabled:				{	k_columnId: 'logEnabled',
k_isHidden: true, k_isKeptHidden: true
},
translation:		{		k_columnId: 'translation',
k_caption: k_tr('Translation', 'trafficPolicy'),
k_width: 120,
k_multilineRenderer: k_multilineRenderer
},
natIpv4Only:{	k_columnId: 'natIpv4Only',
k_isDataOnly  : true
},
dscp:		{	k_columnId: 'dscp',
k_isDataOnly  : true
},
collapsedCount:  {
k_columnId: 'collapsedCount',
k_isHidden: true, k_isKeptHidden: true,

k_renderer: function(k_value, k_data, k_rowIndex, k_colIndex, k_grid) {
var
k_dataTooltip = [],
k_rowsCount = k_grid.k_getRowsCount(),
k_rowIterator = k_rowIndex,
k_rowIteratorData = k_grid.k_getRowByIndex(k_rowIterator),
k_isFound = false,
k_count = 0,
k_text;
if (k_data.k_isHidden) {
while (k_rowIteratorData && (k_rowIteratorData.k_isHidden || this.k_hiddenRows[k_rowIterator])) {
k_count++;
if (k_rowIteratorData.k_isFound) {
k_dataTooltip.push('<b>' + k_rowIteratorData.name + '</b>');
k_isFound = true;
}
else {
k_dataTooltip.push(k_rowIteratorData.name);
}
k_rowIterator++;
k_rowIteratorData = k_rowIterator !== k_rowsCount ? k_grid.k_getRowByIndex(k_rowIterator) : false;
}
}
if (0 !== k_dataTooltip.length) {
k_dataTooltip = k_dataTooltip.join('<br />');
}
else {
k_dataTooltip = undefined;
}
k_text = kerio.lib.k_tr('%1 hidden [row|rows]', 'trafficPolicy', {k_args: [k_count], k_pluralityBy: k_count});
if (k_isFound) {
k_text = kerio.waw.shared.k_methods.k_renderers.k_doHighlighting(k_text, k_dataTooltip);
}
return {
k_data: k_text,
k_dataTooltip: k_dataTooltip,
k_isSecure: true
};
}
},
graphEnabled: {
k_columnId: 'graphEnabled',
k_isDataOnly  : true
}
},k_columnOrder: [
'prepareColumns', 'allowReverseConnection', 'balancing', 'natInterface', 'natMode',
'ipAddress', 'ipv6Address', 'enableDestinationNat', 'natIpv4Only',
'translatedHost', 'translatedIpv6Host', 'translatedPort', 'action', 'logEnabled',
'name', 'source', 'destination', 'sourceList', 'destinationList',
'service', 'serviceList', 'ipVersion', k_COLUMN_ID_ACTION,
'enableSourceNat', 'translation', 'lastUsed',
'validTimeRange', 'validTimeRangeEditor', 'inspector', 'collapsedCount',
'dscp', 'graphEnabled',
'id', 'enabled', 'color', 'description', 'allowFailover'
],
k_bottomToolbarAdditionalRowItems: [
{
k_id: 'k_btnTrafficChart',
k_caption: k_tr('Show Traffic Chart', 'contextMenu'),
k_isVisibleInToolbar: k_isAuditor,
k_onClick: function(k_toolbar) {
kerio.waw.status.k_currentScreen.k_switchPage('trafficCharts', {
k_componentType: kerio.waw.shared.k_CONSTANTS.TrafficStatisticsType.TrafficStatisticsTrafficRule,
k_componentId:   k_toolbar.k_parentWidget.k_selectionStatus.k_rows[0].k_data.id
});
}
},
{
k_id: 'k_btnCollapseRows',
k_caption: k_tr('Hide Rows', 'contextMenu'),
k_isVisibleInToolbar: k_isAuditor,

k_onClick: function(k_toolbar) {
var
k_grid = k_toolbar.k_parentWidget,
k_selectionStatus = k_grid.k_selectionStatus,
k_cnt = k_selectionStatus.k_selectedRowsCount,
k_rows = k_selectionStatus.k_rows,
k_firstIndex = k_rows[0].k_rowIndex,
k_row,
k_i;
k_grid.k_isFilterUsed = false;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_row = k_rows[k_i];
if (k_row.k_isDefaultRule) {
break;
}
k_row.k_data.k_isHidden = true;
k_grid.k_hiddenRows[k_row.k_rowIndex] = true;
}
k_grid.k_enableRestoreButton();
k_grid.k_refresh();
k_grid.k_selectRows(k_firstIndex, false);
if (Ext.isMac && k_grid._k_dragZone && k_grid._k_dragZone._k_dragNotAllowedToolTip) {
k_grid._k_dragZone._k_dragNotAllowedToolTip.disable();
}
}
}
],
k_topToolbarCfg: {
k_items: [
'->',
{
k_id: 'k_btnFilterByPacket',
k_icon: 'img/filterButton.png?v=8629',
k_caption: k_tr('Test Rules', 'trafficPolicyFilterEditor'),
k_className: 'k_btnFilterByPacket',

k_onClick: function(k_toolbar) {
var
k_grid = k_toolbar.k_parentWidget;
if (kerio.waw.status.k_currentScreen.k_isContentChanged()) {
kerio.waw.status.k_currentScreen.k_showContentChangedAlert();
return;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'trafficPolicyFilterEditor',
k_params: {
k_relatedGrid: k_grid,
k_callback: k_grid.k_filterRowsDialogCallback
}
});
}
},
{
k_id: 'k_btnRestore',
k_iconCls: 'btnRestore',
k_caption: k_tr('Restore View', 'trafficPolicy'),
k_isDisabled: true,
k_onClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_restoreView();
}
}
]
}
};k_localNamespace = k_objectName + '_';
k_gridId = k_localNamespace + 'trafficPolicyGrid';
if ('trafficPolicyList_trafficPolicyGrid' !== k_gridId) {
kerio.lib.k_reportError('Internal error: Traffic rules grid changes id, it is used in appWidgetsGrids', 'trafficPolicyList', 'k_init');
}
k_grid = new kerio.waw.shared.k_widgets.K_RulesGrid(k_gridId, k_gridCfg);
k_findField = new kerio.waw.shared.k_widgets.K_FindField(k_localNamespace + 'k_findField', {
k_grid: k_grid,
k_columns: ['description'],
k_caption: k_tr('Search:', 'trafficPolicy')
});
k_grid.k_toolbars.k_top.k_addWidget(k_findField, 1);
k_reloadDataOrigin = k_grid.k_reloadData;
k_grid.k_reloadData = k_reloadDataOrigin.createSequence(function(){
this.k_findField.k_reset();
this.k_enableRestoreButton();
}, k_grid);
if (Ext.isMac) {
k_grid.k_extWidget._kx.k_contextMenu.on('show', function() {
if (this._k_dragZone && this._k_dragZone._k_dragNotAllowedToolTip) {
this._k_dragZone._k_dragNotAllowedToolTip.disable();
}
}, k_grid);
}
k_protocolNames[k_protocolTcp] = k_WAW_DEFINITIONS.k_PROTOCOLS_MAPPED[k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP].k_caption;
k_protocolNames[k_protocolUdp] = k_WAW_DEFINITIONS.k_PROTOCOLS_MAPPED[k_WAW_CONSTANTS.k_PROTOCOL_ID.k_UDP].k_caption;
k_grid.k_addReferences({
k_translations: {
k_any: k_tr('Any', 'common'),
k_nothing: k_tr('Nothing', 'common'),
k_invalidItem: k_tr('The item no longer exists', 'contentFilter'),
k_allTunnels: k_tr('All VPN tunnels', 'trafficRuleList'),
k_allClients: k_tr('VPN clients', 'trafficRuleList'),
k_destinationNat: k_tr('MAP', 'trafficRuleList'),
k_balancingPerHost: k_tr('Balancing per host', 'trafficRuleList'),
k_balancingPerConnection: k_tr('Balancing per connection', 'trafficRuleList'),
k_default: k_tr('Default', 'common'),
k_none: k_tr('None', 'common'),
k_authenticatedUsers: k_tr('Authenticated users', 'trafficRuleList'),
k_accounting: k_tr('Accounting', 'trafficRuleList'),
k_dscp: k_tr('Set DSCP: ', 'trafficRuleList'),
k_allow: k_tr('Allow', 'common'),
k_deny: k_tr('Deny', 'common'),
k_drop: k_tr('Drop', 'common'),
k_noAction: k_tr('No action', 'trafficRuleList'),
k_natFullCone: k_tr('Full Cone NAT', 'trafficRuleList'),
k_natSimple: k_tr('NAT', 'trafficRuleList'),
k_captionAccounting: k_tr('Accounting:', 'trafficActionEditor'),
k_trafficGraph: k_tr('Internet traffic chart', 'trafficActionEditor'),
k_logPackets: k_tr('log packets', 'trafficActionEditor'),
k_logConnections: k_tr('log connections', 'trafficActionEditor')
},
k_setMultilineProperties: k_setMultilineProperties,
k_multilineProperties: {
k_listMaxItems: k_WAW_CONSTANTS.k_LIMIT_MULTILINE_LIST_RENDERER }, k_gridMultilineRenderer: k_gridMultilineRenderer,
k_renderTrafficEntityItem: k_renderTrafficEntityItem,
k_renderServiceItem: k_renderServiceItem,
k_renderTranslationRow: k_renderTranslationRow,
k_lineRenderAction: k_lineRenderAction,
k_inspectorEditor: kerio.lib.k_getWidgetById(k_gridId + '_' + 'k_editor' + '_' + k_inspectorColumnId),
k_btnRestore: k_grid.k_toolbars.k_top.k_getItem('k_btnRestore'),
k_protocolNames: k_protocolNames,
k_firewallEntity: {type: k_WAW_CONSTANTS.TrafficEntityType.k_FIREWALL},
k_translationTypes: {
k_sourceNat: 'k_sourceNat',
k_balancing: 'k_balancing',
k_destinationNatIpv4: 'k_destinationNatIpv4',
k_destinationNatIpv6: 'k_destinationNatIpv6'
},
k_actionRendererData: [0, 1, 2], k_COLUMN_ID_ACTION: k_COLUMN_ID_ACTION,
k_preselectRowId: null,
k_filterRequest: null,
k_selectionInProgress: false,
k_findField: k_findField,
k_hiddenRows: [],
k_connectivityConfig: {}
});
this.k_addControllers(k_grid);
k_grid.k_addReferences({
k_loadDefaultDataRequest: {
k_requests: [
{ method: 'Inspectors.get', k_onError: 0},
{ method: 'TrafficPolicy.getDefaultRule', k_onError: 0},
{ method: 'Interfaces.getConnectivityConfig', k_onError: 0}
],
k_callback: k_grid.k_loadData,
k_scope: k_grid
},
k_saveAction: function(k_data) {
this.k_updateRow(k_data.k_data);
kerio.adm.k_framework.k_enableApplyReset();
return true;
}
}); return k_grid;
},

k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_applyParams: function() {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
var
k_sharedData =  kerio.waw.shared.k_data,
k_vpnDataStore = k_sharedData.k_get('k_vpnTunnels');
kerio.waw.shared.k_methods.k_maskMainScreen();
k_sharedData.k_get('k_timeRanges');
k_sharedData.k_get('k_selectIpGroups', true);
this.k_preselectRowId = kerio.waw.status.k_currentScreen.k_getSwitchPageParam('k_id');
if (!k_vpnDataStore.k_isLoaded()) {
k_vpnDataStore.k_extWidget.on('add', this.k_loadDefaultData, this, {buffer: 100, single: true});
k_vpnDataStore.k_extWidget.on('clear', this.k_loadDefaultData, this, {buffer: 100, single: true}); return;
}
this.k_loadDefaultData();
},

k_loadDefaultData: function() {
kerio.waw.shared.k_methods.k_sendBatch(this.k_loadDefaultDataRequest);
},

k_loadData: function(k_response) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_result = k_response.k_decoded.batchResult,
k_translations = this.k_translations,
k_inspectorsData,
k_i, k_cnt,
k_inspectors;
if (!k_response.k_isOk || !k_result || Array !== k_result.constructor) {
if (k_response.k_decoded[0] && k_response.k_decoded[0].code) {
kerio.waw.shared.k_methods.k_alertError(k_response.k_decoded[0]);
}
else if (k_response.k_decoded[1] && k_response.k_decoded[1].code) {
kerio.waw.shared.k_methods.k_alertError(k_response.k_decoded[1]);
}
else { kerio.waw.shared.k_methods.k_alertError(kerio.lib.k_tr('An error occurred in the connection to the server!', 'common'));
}
return;
}
k_inspectorsData = [
{	k_name: k_translations.k_default,
k_value: k_WAW_CONSTANTS.k_DEFAULT_INSPECTORS.k_DEFAULT},
{	k_name: k_translations.k_none,
k_value: k_WAW_CONSTANTS.k_DEFAULT_INSPECTORS.k_NONE}
];
k_inspectors = k_result[0].list;
for (k_i = 0, k_cnt = k_inspectors.length; k_i < k_cnt; k_i++) {
k_inspectorsData.push(
{	'k_name': k_inspectors[k_i].name,
'k_value': k_inspectors[k_i].name
}
);
}
this.k_inspectorEditor.k_setData(k_inspectorsData);
this._k_defaultRuleDefinition = k_result[1].rule;
this.k_connectivityConfig = k_result[2].config;
this._k_defaultRuleDefinition.color = k_WAW_CONSTANTS.k_POLICY_BCKG_COLORS.k_RED;
this.k_onLoad();
if (this.k_preselectRowId) { kerio.waw.shared.k_DEFINITIONS.k_preselectRowById.defer(500, this);
}
this.k_enableRestoreButton();
},

k_getRelatedData: function() {
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_dialogs: [
'trafficActionEditor',
'trafficSourceDestinationEditor',
'trafficServiceEditor',
'trafficNatEditor',
'ruleDescriptionEditor',
'trafficPolicyRuleWizard'
],
k_stores: [
'k_outgoingInterfaces'
]
});
},

k_sortServices: function(k_service1, k_service2) {
var
k_servicePorts1,
k_service1Name,
k_service1NameLowerCase,
k_servicePorts2,
k_service2Name,
k_service2NameLowerCase;
if (k_service1.definedService !== k_service2.definedService) {
return k_service1.definedService ? -1 : 1;
}
if (k_service1.definedService) {
k_service1Name = k_service1.service.name;
k_service1NameLowerCase = k_service1Name.toLowerCase();
k_service2Name = k_service2.service.name;
k_service2NameLowerCase = k_service2Name.toLowerCase();
if (k_service1NameLowerCase < k_service2NameLowerCase) {
return -1;
}
if (k_service1NameLowerCase > k_service2NameLowerCase) {
return 1;
}
if (k_service1Name < k_service2Name) {
return -1;
}
if (k_service1Name > k_service2Name) {
return 1;
}
return 0;
}
if (k_service1.protocol !== k_service2.protocol) {
return kerio.waw.shared.k_CONSTANTS.k_PROTOCOL_ID.k_TCP === k_service1.protocol ? -1 : 1;
}
k_servicePorts1 = k_service1.port.ports.sort(kerio.waw.shared.k_methods.k_comparePortsNumerically);
k_servicePorts2 = k_service2.port.ports.sort(kerio.waw.shared.k_methods.k_comparePortsNumerically);
return k_servicePorts1[0] < k_servicePorts2[0] ? -1 : 1;
},

k_compareEntityItems: function(k_first, k_second) {
var
k_constInterfaceConditionTypes,
k_constVpnTypes,
k_constInterfaceTypes,
k_isFirstIpAddress,
k_isSecondIpAddress,
k_isIpAddress,
k_firstIp,
k_secondIp,
k_firstInterfaceConditionType,
k_secondInterfaceConditionType,
k_firstInterfaceType,
k_secondInterfaceType,
k_firstVpnType,
k_secondVpnType,
k_firstUser,
k_secondUser,
k_firstUserName,
k_secondUserName,
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_constEntityType = k_WAW_CONSTANTS.TrafficEntityType,
k_firstType = k_first.type,
k_secondType = k_second.type,
k_KEEP_ORDER = -1,
k_CHANGE_ORDER = 1,
k_EQUAL = 0;
if (k_firstType !== k_secondType) {
switch (k_firstType) {
case k_constEntityType.k_FIREWALL:
return k_KEEP_ORDER; case k_constEntityType.TrafficEntityRange:
return (k_constEntityType.k_FIREWALL === k_secondType) ? k_CHANGE_ORDER : k_KEEP_ORDER;
case k_constEntityType.TrafficEntityNetwork:
return ((k_constEntityType.k_FIREWALL === k_secondType)
|| (k_constEntityType.TrafficEntityRange === k_secondType))
? k_CHANGE_ORDER : k_KEEP_ORDER;
case k_constEntityType.TrafficEntityHost:
return ((k_constEntityType.k_FIREWALL === k_secondType)
|| (k_constEntityType.TrafficEntityRange === k_secondType)
|| (k_constEntityType.TrafficEntityNetwork === k_secondType))
? k_CHANGE_ORDER : k_KEEP_ORDER;
case k_constEntityType.TrafficEntityPrefix:
return ((k_constEntityType.k_FIREWALL === k_secondType)
|| (k_constEntityType.TrafficEntityRange === k_secondType)
|| (k_constEntityType.TrafficEntityNetwork === k_secondType)
|| (k_constEntityType.TrafficEntityHost === k_secondType))
? k_CHANGE_ORDER : k_KEEP_ORDER;
case k_constEntityType.TrafficEntityAddressGroup:
return ((k_constEntityType.TrafficEntityInterface === k_secondType)
|| (k_constEntityType.TrafficEntityVpn === k_secondType)
|| (k_constEntityType.TrafficEntityUsers === k_secondType))
? k_KEEP_ORDER : k_CHANGE_ORDER;
case k_constEntityType.TrafficEntityInterface:
return ((k_constEntityType.TrafficEntityVpn === k_secondType)
|| (k_constEntityType.TrafficEntityUsers === k_secondType))
? k_KEEP_ORDER : k_CHANGE_ORDER;
case k_constEntityType.TrafficEntityVpn:
return (k_constEntityType.TrafficEntityUsers === k_secondType) ? k_KEEP_ORDER : k_CHANGE_ORDER;
case k_constEntityType.TrafficEntityUsers:
return k_CHANGE_ORDER; } } switch (k_firstType) {
case k_constEntityType.TrafficEntityRange:
k_firstIp = k_WAW_METHODS.k_ipToNumber(k_first.addr1);
k_secondIp = k_WAW_METHODS.k_ipToNumber(k_second.addr1);
if (k_firstIp === k_secondIp) {
k_firstIp = k_WAW_METHODS.k_ipToNumber(k_first.addr2);
k_secondIp = k_WAW_METHODS.k_ipToNumber(k_second.addr2);
}
return (k_firstIp < k_secondIp) ? k_KEEP_ORDER : k_CHANGE_ORDER;
case k_constEntityType.TrafficEntityNetwork:
k_firstIp = k_WAW_METHODS.k_ipToNumber(k_first.addr1);
k_secondIp = k_WAW_METHODS.k_ipToNumber(k_second.addr1);
return (k_firstIp < k_secondIp) ? k_KEEP_ORDER : k_CHANGE_ORDER;
case k_constEntityType.TrafficEntityHost:
k_isIpAddress = k_WAW_METHODS.k_validators.k_isIpAddress;
k_isFirstIpAddress = k_isIpAddress(k_first.addr1);
k_isSecondIpAddress = k_isIpAddress(k_second.addr1);
if (k_isFirstIpAddress !== k_isSecondIpAddress) {
return (k_isFirstIpAddress) ? k_KEEP_ORDER : k_CHANGE_ORDER;
}
if (!k_isFirstIpAddress) {
return k_first.host.localeCompare(k_second.host);
}
k_firstIp = k_WAW_METHODS.k_ipToNumber(k_first.addr1);
k_secondIp = k_WAW_METHODS.k_ipToNumber(k_second.addr1);
return (k_firstIp < k_secondIp) ? k_KEEP_ORDER : k_CHANGE_ORDER;
case k_constEntityType.TrafficEntityPrefix:
return k_first.host.localeCompare(k_second.host);
case k_constEntityType.TrafficEntityAddressGroup:
return k_first.addressGroup.name.localeCompare(k_second.addressGroup.name);
case k_constEntityType.TrafficEntityInterface:
k_constInterfaceConditionTypes = k_WAW_CONSTANTS.InterfaceConditionType;
k_firstInterfaceConditionType = k_first.interfaceCondition.type;
k_secondInterfaceConditionType = k_second.interfaceCondition.type;
if (k_firstInterfaceConditionType !== k_secondInterfaceConditionType) {
if ((k_constInterfaceConditionTypes.InterfaceInternet === k_firstInterfaceConditionType)
|| (k_constInterfaceConditionTypes.InterfaceSelected === k_secondInterfaceConditionType)
|| (k_constInterfaceConditionTypes.k_OTHER === k_secondInterfaceConditionType)
|| ((k_constInterfaceConditionTypes.InterfaceTrusted === k_firstInterfaceConditionType) && (k_constInterfaceConditionTypes.InterfaceGuest === k_secondInterfaceConditionType))) {
return  k_KEEP_ORDER;
}
if ((k_constInterfaceConditionTypes.InterfaceSelected === k_firstInterfaceConditionType)
|| (k_constInterfaceConditionTypes.InterfaceInternet === k_secondInterfaceConditionType)
|| (k_constInterfaceConditionTypes.k_OTHER === k_firstInterfaceConditionType)
|| ((k_constInterfaceConditionTypes.InterfaceGuest === k_firstInterfaceConditionType) && (k_constInterfaceConditionTypes.InterfaceTrusted === k_secondInterfaceConditionType))) {
return  k_CHANGE_ORDER;
}
}
k_firstInterfaceType = k_first.interfaceCondition.interfaceType;
k_secondInterfaceType = k_second.interfaceCondition.interfaceType;
if (k_firstInterfaceType === k_secondInterfaceType) {
return k_first.interfaceCondition.selectedInterface.name.localeCompare(k_second.interfaceCondition.selectedInterface.name);
}
k_constInterfaceTypes = k_WAW_CONSTANTS.InterfaceType;
switch (k_firstInterfaceType) {
case k_constInterfaceTypes.Ethernet:
return k_KEEP_ORDER;
case k_constInterfaceTypes.DialIn:
return (k_constInterfaceTypes.Ethernet === k_secondInterfaceType) ? k_CHANGE_ORDER : k_KEEP_ORDER;
case k_constInterfaceTypes.Ras:
return k_CHANGE_ORDER;
}
return k_KEEP_ORDER; case k_constEntityType.TrafficEntityVpn:
k_constVpnTypes = k_WAW_CONSTANTS.VpnConditionType;
k_firstVpnType = k_first.vpnCondition.type;
k_secondVpnType = k_second.vpnCondition.type;
if (k_firstVpnType !== k_secondVpnType) {
if ((k_constVpnTypes.IncomingClient === k_firstVpnType) || (k_constVpnTypes.SelectedTunnel === k_secondVpnType)) {
return  k_KEEP_ORDER;
}
if ((k_constVpnTypes.SelectedTunnel === k_firstVpnType) || (k_constVpnTypes.IncomingClient === k_secondVpnType)) {
return  k_CHANGE_ORDER;
}
}
return k_first.vpnCondition.tunnel.name.localeCompare(k_second.vpnCondition.tunnel.name);
case k_constEntityType.TrafficEntityUsers:
k_firstUser = k_first.user;
k_secondUser = k_second.user;
if (k_firstUser.isGroup !== k_secondUser.isGroup) {
return (k_firstUser.isGroup) ? k_CHANGE_ORDER : k_KEEP_ORDER;
}
k_firstUserName = k_firstUser.name + '@' + k_firstUser.domainName;
k_secondUserName = k_secondUser.name + '@' + k_secondUser.domainName;
return k_firstUserName.localeCompare(k_secondUserName);
} return k_EQUAL; },

k_filterRowsDialogCallback: function(k_filterCondition) {
var
k_filterRequest = this.k_filterRequest;
if (!k_filterRequest) {
k_filterRequest = {
k_jsonRpc: {
method: 'TrafficPolicy.filterRules',
params: {
condition: null
}
},
k_callback: this.k_filterRowsRequestCallback,
k_scope: this
};
this.k_filterRequest = k_filterRequest;
}
k_filterRequest.k_jsonRpc.params.condition = k_filterCondition;
this.k_hiddenRows = [];
this.k_isFilterUsed = true;
this.k_lastFilterRequest = kerio.lib.k_cloneObject(k_filterRequest);
kerio.lib.k_ajax.k_request(k_filterRequest);
},

k_filterRowsRequestCallback: function(k_response) {
if (!k_response.k_isOk) {
return;
}
var
k_filterListId = k_response.k_decoded.idList,
k_rows = this.k_getRowsData(),
k_cnt = k_rows.length,
k_isFiltered = false,
k_rowFound = false,
k_row,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_row = k_rows[k_i];
if (k_row.k_isDefaultRule) {
break;
}
k_rowFound = -1 === k_filterListId.indexOf(k_row.id);
k_row.k_isHidden = k_rowFound;
k_isFiltered = k_isFiltered || k_rowFound;
}
this.k_enableRestoreButton();
this.k_refresh();
},

k_enableRestoreButton: function() {
var
k_rows = this.k_getRowsData(),
k_cnt = k_rows.length,
k_isBtnDisabled = true,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_rows[k_i].k_isHidden) {
k_isBtnDisabled = false;
break;
}
}
this.k_btnRestore.k_setDisabled(k_isBtnDisabled);
},

k_restoreView: function() {
var
k_rows = this.k_getRowsData(),
k_cnt = k_rows.length,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_rows[k_i].k_isHidden = false;
}
this.k_hiddenRows = [];
this.k_findField.k_reset();
this.k_isFilterUsed = false;
this.k_refresh();
this.k_btnRestore.k_setDisabled(true);
},

k_openNewRuleWizard: function() {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'trafficPolicyRuleWizard',
k_params: {
k_parentGrid: this
}
});
},

k_updateInvalidServices: function() {
var
RuleConditionType,
k_datastore,
k_serviceListMapped,
k_data,
k_serviceEntries,
k_serviceEntry,
k_isServiceChanged,
k_isServiceInvalid,
k_mappedService,
k_updatedData,
k_newEntries,
k_type,
k_i, k_cnt,
k_j, k_cntServiceEntries;
k_datastore = kerio.waw.shared.k_data.k_get('k_services');
if (!k_datastore) {
return;
}
k_serviceListMapped = k_datastore.k_serviceListMapped;
RuleConditionType = kerio.waw.shared.k_CONSTANTS.RuleConditionType;
k_data = this.k_getData();
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_serviceEntries = k_data[k_i].service.entries;
k_isServiceChanged = false;
k_newEntries = [];
for (k_j = 0, k_cntServiceEntries = k_serviceEntries.length; k_j < k_cntServiceEntries; k_j++) {
k_serviceEntry = k_serviceEntries[k_j];
if (k_serviceEntry.definedService) {
k_mappedService = k_serviceListMapped[k_serviceEntry.service.id];
if (undefined === k_mappedService) {
k_isServiceChanged = true;
}
else {
if (k_mappedService.name !== k_serviceEntry.service.name) {
k_serviceEntry.service.name = k_mappedService.name;
k_isServiceChanged = true;
}
k_newEntries.push(k_serviceEntry);
}
}
else {
k_newEntries.push(k_serviceEntry);
}
}
if (k_isServiceChanged) {
k_isServiceInvalid = 0 === k_newEntries.length;
k_type = k_isServiceInvalid ? RuleConditionType.RuleInvalidCondition : RuleConditionType.RuleSelectedEntities;
k_updatedData = {service: {entries: k_newEntries, type: k_type}};
if (k_isServiceInvalid) {
k_updatedData.inactive = true;
}
this.k_updateRow(k_updatedData, k_i);
}
}
},

k_checkAddressGroupEntities: function(k_entities, k_ipGroupListMapped) {
var
k_TR_ENTITY_TYPE_ADDRESS_GROUP = kerio.waw.shared.k_CONSTANTS.TrafficEntityType.TrafficEntityAddressGroup,
k_isSubItemInvalid = false,
k_j, k_cntEntities,
k_item;
for (k_j = 0, k_cntEntities = k_entities.length; k_j < k_cntEntities; k_j++) {
k_item = k_entities[k_j];
if (k_TR_ENTITY_TYPE_ADDRESS_GROUP === k_item.type && undefined === k_ipGroupListMapped[k_item.addressGroup.id]) {
k_item.addressGroup.invalid = true;
k_isSubItemInvalid = true;
}
}
return k_isSubItemInvalid;
},

k_updateInvalidIpAddressGroups: function() {
var
k_datastore,
k_ipGroupListMapped,
k_data,
k_columnData,
k_isSubItemInvalid,
k_isRuleInvalid,
k_rowData,
k_i, k_cnt,
k_cellData;
k_datastore = kerio.waw.shared.k_data.k_get('k_ipAddressGroups');
if (!k_datastore) {
return;
}
k_ipGroupListMapped = k_datastore.k_ipGroupListMapped;
k_data = this.k_getData();
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_rowData = k_data[k_i];
k_isSubItemInvalid = false;
k_cellData = {};
k_columnData = kerio.lib.k_cloneObject(k_rowData.destination);
if (this.k_checkAddressGroupEntities(k_columnData.entities, k_ipGroupListMapped)) {
k_isSubItemInvalid = true;
k_cellData.destination = k_columnData;
}
k_columnData = kerio.lib.k_cloneObject(k_rowData.source);
if (this.k_checkAddressGroupEntities(k_columnData.entities, k_ipGroupListMapped)) {
k_isSubItemInvalid = true;
k_cellData.source = k_columnData;
}
if (k_isSubItemInvalid) {
k_isRuleInvalid = this._k_isInactiveRuleCustom(k_rowData);
if (k_isRuleInvalid) {
k_rowData.inactive = true;
}
this.k_updateRow(k_cellData, k_i);
this.k_updateRowStatus(k_rowData); this.k_updateRowStatus(true);      this.k_updateRow(k_cellData, k_i);
}
}
}
});
kerio.lib.k_todo('trafficPolicyList - redefining K_RulesGrid::k_removeDefaultRule');

k_kerioWidget.k_removeDefaultRule = function(k_data) {
var k_defaultRule = {};
if (k_data && k_data.length && k_data[k_data.length - 1].k_isDefaultRule) {
k_defaultRule = k_data.pop(); }
delete k_defaultRule.k_isDefaultRule;
return {
rules: k_data,
defaultRule: k_defaultRule
};
};

k_kerioWidget.k_addNewRule = function(k_ruleData) {
var
k_shared = kerio.waw.shared,
k_isDefaultRuleSelected,
k_selected,
k_index,
k_data;
k_data = k_shared.k_DEFINITIONS.k_get(this.k_newItemDefinition, k_ruleData);
k_selected = this.k_selectionStatus;
k_isDefaultRuleSelected = k_shared.k_methods.k_isRuleRowWithPropertySelected.call(this, 'k_isDefaultRule'); if (!k_isDefaultRuleSelected && 1 === k_selected.k_selectedRowsCount) {
k_index = k_selected.k_rows[0].k_rowIndex + 1;
}
else {
k_index = 0;
}
this.k_addRow(k_data, k_index);
this.k_selectRows(k_index, false);
kerio.adm.k_framework.k_enableApplyReset();
};

k_kerioWidget.k_initNatInterfaceListLoader = function(k_params) {
kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_interfacesOutgoingList',
k_select: k_params.k_select,
k_form: k_params.k_form,
k_value: k_params.k_value,
k_addNoneOption: false,
k_iconRenderer: kerio.waw.shared.k_methods.k_renderers.k_interfaceIconsForListLoader
}).k_sendRequest();
};
} }; 