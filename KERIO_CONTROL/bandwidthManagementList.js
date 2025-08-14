
kerio.waw.ui.bandwidthManagementList = {
k_init: function(k_objectName) {
var
k_tr = kerio.lib.k_tr,
k_localNamespace = k_objectName + '_',
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_WAW_DEFINITIONS = k_shared.k_DEFINITIONS,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_manager = 'BandwidthManagement',
k_COLUMN_TRAFFIC = 'trafficRenderer',
k_COLUMN_DOWNLOAD = 'downloadRenderer',
k_COLUMN_UPLOAD = 'uploadRenderer',
k_TRAFFIC_TYPE_TRANSLATIONS = k_WAW_DEFINITIONS.k_BM_TRAFFIC_TYPE_TRANSLATIONS,
k_grid, k_gridCfg,
k_currentBandwidth,
k_toolbar, k_toolbarCfg,
k_form, k_formCfg,
k_isInactiveRule,
k_renderTraffic,
k_renderTrafficItem,
k_lineRenderTraffic,
k_renderBandwidth,
k_lineRenderBandwidthUpload,
k_lineRenderBandwidthDownload,
k_onClickButtonChange;

k_isInactiveRule = function(k_data) {
var
BMConditionType = kerio.waw.shared.k_CONSTANTS.BMConditionType,
k_traffic;
if (kerio.waw.shared.k_methods.k_reportInactiveWebFilter.call(this, k_data)) {
return true;
}
if (k_data.interfaceId.invalid) {
return true;
}
k_traffic = k_data.traffic;
if (k_traffic && k_traffic[0] && BMConditionType.BMConditionInvalid === k_traffic[0].type) {
return true;
}
return false;
};

k_lineRenderTraffic = function(k_value, k_data, k_rowIndex, k_colIndex, k_grid, k_itemIndex) {
var
k_multilineProperties = k_grid.k_multilineProperties,
k_isLimited = false, k_displayLimit,
k_cnt,
k_lineData;
if (undefined !== k_itemIndex) {
k_lineData = k_data.traffic[k_itemIndex];
k_displayLimit = k_multilineProperties.k_listMaxItems - 1; k_cnt = k_data.traffic.length - k_displayLimit;
k_isLimited = (k_displayLimit === k_itemIndex && 1 < k_cnt); }
else {
k_lineData = k_data;
}
if (k_isLimited) {
k_lineData = {
k_data: kerio.lib.k_tr('…and %1 more', 'userList', {k_args:[k_cnt]}),
k_dataTooltip: kerio.lib.k_htmlEncode(
kerio.waw.shared.k_methods.k_joinReferenceList(
{	k_referenceList: k_data.traffic,
k_start: k_displayLimit,
k_method: k_multilineProperties.k_renderTrafficItem,
k_grid: k_grid,
k_stringProperty: 'k_data' }
)
)
};
}
else {
k_lineData = k_multilineProperties.k_renderTrafficItem(k_lineData, k_grid);
k_lineData.k_iconCls = 'bandwidthManagement cellIcon ' + k_lineData.k_iconCls;
} return k_lineData;
}; 
k_renderTrafficItem = function(k_lineData, k_grid) {
var
k_tr = kerio.lib.k_tr,
k_translations = k_grid.k_translations,
k_multilineProperties = k_grid.k_multilineProperties,
BMConditionType = k_multilineProperties.BMConditionType,
BMTrafficType = k_multilineProperties.BMTrafficType,
ApplicationType = kerio.waw.shared.k_CONSTANTS.ApplicationType,
ApplicationWebFilterCategory = ApplicationType.ApplicationWebFilterCategory,
ApplicationProtocol = ApplicationType.ApplicationProtocol,
k_tooltip = undefined,
k_className = undefined,
k_iconCls,
k_text,
k_userData;
switch (k_lineData.type) {
case BMConditionType.BMConditionApplication:
if (!k_grid.k_isWebFilterLicensed
|| (k_lineData.k_isWholeSubGroup && !k_grid.k_isWebFilterOn && !k_grid.k_isApplicationAwarenessOn)
|| (!k_lineData.k_isWholeSubGroup && k_lineData.types.length && !k_grid.k_isWebFilterOn && ApplicationWebFilterCategory === k_lineData.types[0])
|| (!k_lineData.k_isWholeSubGroup && k_lineData.types.length && !k_grid.k_isApplicationAwarenessOn && ApplicationProtocol === k_lineData.types[0])
) {
k_iconCls = 'cellIcon webFilterIcon invalid';
if (!k_grid.k_isWebFilterLicensed) {
k_tooltip = k_grid.k_translations.k_webFilterNotLicensed;
}
else if (k_lineData.k_isWholeSubGroup && !k_grid.k_isWebFilterOn && !k_grid.k_isApplicationAwarenessOn) {
k_className = 'invalid';
k_tooltip = k_grid.k_translations.k_bothDisabled;
}
else if ((k_lineData.k_isWholeSubGroup && !k_grid.k_isWebFilterOn) || (!k_lineData.k_isWholeSubGroup && !k_grid.k_isWebFilterOn && ApplicationWebFilterCategory === k_lineData.types[0])) {
k_className = 'invalid';
k_tooltip = k_grid.k_translations.k_webFilterDisabled;
}
else if ((k_lineData.k_isWholeSubGroup && !k_grid.k_isApplicationAwarenessOn) || (!k_lineData.k_isWholeSubGroup && !k_grid.k_isApplicationAwarenessOn && ApplicationProtocol === k_lineData.types[0])) {
k_className = 'invalid';
k_tooltip = k_grid.k_translations.k_applicationAwarenessDisabled;
}
k_className += !k_grid.k_isWebFilterLicensed ? ' unlicensed' : '';
}
else {
k_iconCls = 'cellIcon webFilterIcon';
}
k_text = k_lineData.k_isWholeSubGroup ? k_lineData.subGroup : k_lineData.name;
break;
case BMConditionType.BMConditionTrafficType:
k_iconCls = 'activity ';
k_text = k_grid.k_TRAFFIC_TYPE_TRANSLATIONS[k_lineData.trafficType];
switch (k_lineData.trafficType) {
case BMTrafficType.BMTrafficEmail:
k_iconCls += 'mail';
break;
case BMTrafficType.BMTrafficFtp:
k_iconCls += 'ftp';
break;
case BMTrafficType.BMTrafficInstantMessaging:
k_iconCls += 'im';
break;
case BMTrafficType.BMTrafficMultimedia:
k_iconCls += 'multimedia';
break;
case BMTrafficType.BMTrafficP2p:
k_iconCls += 'p2p';
break;
case BMTrafficType.BMTrafficRemoteAccess:
k_iconCls += 'remoteAccess';
break;
case BMTrafficType.BMTrafficSip:
k_iconCls += 'sip';
break;
case BMTrafficType.BMTrafficVpn:
k_iconCls += 'vpn';
break;
case BMTrafficType.BMTrafficWeb:
k_iconCls += 'web';
break;
}
break; case BMConditionType.BMConditionUsers:
k_userData = kerio.waw.shared.k_methods.k_createReferencedUserName(k_lineData.user);
k_text = k_userData.k_userName;
k_iconCls = k_userData.k_iconClass;
break;
case BMConditionType.BMConditionQuota:
k_text = k_translations.k_trExceededQuota;
k_iconCls = 'exceededQuotaIcon';
break;
case BMConditionType.BMConditionHosts:
if (k_lineData.hostStr)
k_text = k_lineData.hostStr;
else
k_text = '';
k_iconCls = 'hostIcon hostHost';
break;
case BMConditionType.BMConditionLargeData:
k_text = k_translations.k_trLargeDataTransfers;
k_iconCls = 'largeDataTransfersIcon';
break;
case BMConditionType.BMConditionTrafficRule:
k_text = k_lineData.valueId.name;
k_iconCls = 'packetsIcon';
break;
case BMConditionType.BMConditionContentRule:
k_text = k_lineData.valueId.name;
k_iconCls = 'contentFilterIcon';
break;
case BMConditionType.BMConditionService:
k_text = k_lineData.service.name;
k_iconCls = k_lineData.service.isGroup ?  'ipServiceGroupIcon' : 'ipServiceIcon';
break;
case BMConditionType.BMConditionDscp:
k_text = k_tr('QoS DSCP %1', 'bandwidthManagement', {k_args: [k_lineData.dscp]});
k_iconCls = 'dscpIcon';
break;
case BMConditionType.BMConditionGuests:
k_text = k_tr('Guest Interfaces', 'trafficRuleList');
k_iconCls = 'groupIcon interfaceHeaderIcon groupGuest';
break;
case BMConditionType.BMConditionInvalid:
k_text = k_translations.k_trNothing;
k_iconCls = 'objectNothing';
break;
} return {
k_data: k_text,
k_iconCls: k_iconCls,
k_className: k_className,
k_dataTooltip: k_tooltip,
k_iconTooltip: k_tooltip
};
}; 
k_renderTraffic = function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
var
k_collapsedValue;
if (!k_data.traffic || 0 === k_data.traffic.length) {
k_collapsedValue = k_grid.k_translations.k_trAny;
}
return {
k_isCollapsible: false,
k_collapsedValue: k_collapsedValue,
k_lineRenderer: k_grid.k_lineRenderTraffic,
k_maxItems: k_grid.k_multilineProperties.k_listMaxItems
};
};

k_lineRenderBandwidthUpload = function(k_value, k_data, k_rowIndex, k_colIndex, k_grid, k_itemIndex) {
return {
k_data: k_data.uploadRenderer[k_itemIndex]
};
};

k_lineRenderBandwidthDownload = function(k_value, k_data, k_rowIndex, k_colIndex, k_grid, k_itemIndex) {
return {
k_data: k_data.downloadRenderer[k_itemIndex]
};
};

k_renderBandwidth = function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
return {
k_isCollapsible: false,
k_lineRenderer: k_grid.k_COLUMN_UPLOAD === k_grid.k_getColumnId(k_columnIndex) ? k_grid.k_lineRenderBandwidthUpload : k_grid.k_lineRenderBandwidthDownload
};
};

k_onClickButtonChange = function(k_form, k_showAlertNoConnections) {
var
k_tr = kerio.lib.k_tr,
k_bandwidth = k_form.k_grid.k_bandwidthStore,
k_count = k_bandwidth.length;
if (!k_count) {
if (false !== k_showAlertNoConnections) {
kerio.lib.k_alert({
k_title: k_tr('Link Bandwidth', 'bandwidthManagementLinkEditor'),
k_msg: k_tr('There are no Internet links to change.', 'bandwidthManagementLinkEditor'),
k_icon: 'warning'
});
}
return;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'bandwidthManagementLinkEditor',
k_objectName: 'bandwidthManagementLinkEditor' + '_' + k_count,
k_initParams: {
k_count: k_count
},
k_params: {
k_data: kerio.lib.k_cloneObject(k_bandwidth),
k_callback: k_form.k_updateBandwidth.createDelegate(k_form, [k_bandwidth], true),
k_cntRowsNeedUpLinkSpeed: k_form.k_grid.k_cntRowsNeedUpLinkSpeed,
k_cntRowsNeedDownLinkSpeed: k_form.k_grid.k_cntRowsNeedDownLinkSpeed,
k_forced: (false === k_showAlertNoConnections)
}
});
}; k_gridCfg = {
k_onBeforeRemoveItem: function(k_grid) {
var
k_rows = k_grid.k_selectionStatus.k_rows,
k_i, k_cnt,
k_extRecord,
k_storedRecord;
for (k_i = 0, k_cnt = k_grid.k_selectionStatus.k_selectedRowsCount; k_i < k_cnt; k_i++) {
k_extRecord = k_rows[k_i].k_extRecord;
k_storedRecord = this.k_rowsNeedUpLinkSpeed[k_extRecord.id];
if (undefined !== k_storedRecord) {
delete this.k_rowsNeedUpLinkSpeed[k_storedRecord.id];
this.k_cntRowsNeedUpLinkSpeed--;
}
k_storedRecord = this.k_rowsNeedDownLinkSpeed[k_extRecord.id];
if (undefined !== k_storedRecord) {
delete this.k_rowsNeedDownLinkSpeed[k_storedRecord.id];
this.k_cntRowsNeedDownLinkSpeed--;
}
}
}, k_className: 'bmRules',
k_objectName: 'k_bandwidthManagementRules',
k_isTabPage: true, k_isAuditor: k_isAuditor,
k_manager: k_manager,
k_newItemDefinition: 'k_predefinedBmRule',
k_skipDefaultInactiveRuleCheck: true,
k_isInactiveRule: k_isInactiveRule,
k_isQueryValueSent: false,

k_onCellDblClick: function(k_grid, k_rowData, k_columnId) {
var
k_dialogName,
k_dialogType,
k_initParams, k_callback;
if (k_grid._k_isAuditor) {
return; }
if (k_rowData.k_isDefaultRule) {
return; }
k_callback = k_grid.k_updateData.createDelegate(k_grid, [k_rowData], true);
switch (k_columnId) {
case k_grid.k_COLUMN_TRAFFIC:
k_dialogName = 'bandwidthManagementTrafficEditor';
k_initParams = {
k_setTrafficItemSorting: k_grid.k_form.k_setTrafficItemSorting,
k_sortItems: k_grid.k_form.k_sortItems,
k_grid: k_grid
};
break;
case k_grid.k_COLUMN_DOWNLOAD:
k_dialogName = 'bandwidthManagementReservationEditor';
k_dialogType = 'bmDownloadEditor';
break;
case k_grid.k_COLUMN_UPLOAD:
k_dialogName = 'bandwidthManagementReservationEditor';
k_dialogType = 'bmUploadEditor';
break;
case 'interfaceId':
k_dialogName = 'bandwidthManagementInterfaceEditor';
break;
default:
return false;
} kerio.lib.k_ui.k_showDialog({
k_sourceName: k_dialogName,
k_objectName: k_dialogType || k_dialogName,
k_params: {
k_data: k_rowData,
k_relatedGrid: k_grid,
k_callback: k_callback
},
k_initParams: k_initParams
});
},k_columns: {
prepareColumns:			{	k_columnId: 'prepareColumns',
k_isHidden: true, k_isKeptHidden: true,

k_renderer: function(k_value, k_data) {
var
k_tr = kerio.lib.k_tr,
k_BANDWIDTH_UNITS_MAPPED = kerio.waw.shared.k_DEFINITIONS.k_BANDWIDTH_UNITS_MAPPED,
k_downloadRenderer,
k_uploadRenderer,
k_reservedDownload,
k_maximumDownload,
k_reservedUpload,
k_maximumUpload,
k_mappedUnit;
k_data = this.k_prepareTrafficData(k_data);
k_data.trafficRenderer = kerio.lib.k_cloneObject(k_data.traffic);
k_data.downloadRenderer = [];
k_downloadRenderer = k_data.downloadRenderer;
k_reservedDownload = k_data.reservedDownload;
if (k_reservedDownload && k_reservedDownload.enabled) {
k_mappedUnit = k_BANDWIDTH_UNITS_MAPPED[k_reservedDownload.unit];
k_downloadRenderer.push('%' === k_mappedUnit
? k_tr('Reserve: %1%2 of the link', 'bandwidthManagement', {k_args: [k_reservedDownload.value, '%']})
: k_tr('Reserve: %1 %2', 'bandwidthManagement', {k_args: [k_reservedDownload.value, k_mappedUnit]}));
}
k_maximumDownload = k_data.maximumDownload;
if (k_maximumDownload && k_maximumDownload.enabled) {
k_mappedUnit = k_BANDWIDTH_UNITS_MAPPED[k_maximumDownload.unit];
k_downloadRenderer.push('%' === k_mappedUnit
? k_tr('Limit: %1%2 of the link', 'bandwidthManagement', {k_args: [k_maximumDownload.value, '%']})
: k_tr('Limit: %1 %2', 'bandwidthManagement', {k_args: [k_maximumDownload.value, k_mappedUnit]}));
}
if (0 === k_downloadRenderer.length) {
k_downloadRenderer.push(this.k_translations.k_trNoLimit);
}
k_data.uploadRenderer = [];
k_uploadRenderer = k_data.uploadRenderer;
k_reservedUpload = k_data.reservedUpload;
if (k_reservedUpload && k_reservedUpload.enabled) {
k_mappedUnit = k_BANDWIDTH_UNITS_MAPPED[k_reservedUpload.unit];
k_uploadRenderer.push('%' === k_mappedUnit
? k_tr('Reserve: %1%2 of the link', 'bandwidthManagement', {k_args: [k_reservedUpload.value, '%']})
: k_tr('Reserve: %1 %2', 'bandwidthManagement', {k_args: [k_reservedUpload.value, k_mappedUnit]}));
}
k_maximumUpload = k_data.maximumUpload;
if (k_maximumUpload && k_maximumUpload.enabled) {
k_mappedUnit = k_BANDWIDTH_UNITS_MAPPED[k_maximumUpload.unit];
k_uploadRenderer.push('%' === k_mappedUnit
? k_tr('Limit: %1%2 of the link', 'bandwidthManagement', {k_args: [k_maximumUpload.value, '%']})
: k_tr('Limit: %1 %2', 'bandwidthManagement', {k_args: [k_maximumUpload.value, k_mappedUnit]}));
}
if (0 === k_uploadRenderer.length) {
k_uploadRenderer.push(this.k_translations.k_trNoLimit);
}
return {k_data: ''}; }},
traffic:				{	k_columnId: 'traffic',
k_isHidden: true, k_isKeptHidden: true
},
trafficRenderer:		{	k_columnId: k_COLUMN_TRAFFIC,
k_caption: k_tr('Traffic', 'bandwidthManagement'),
k_width: 200,
k_multilineRenderer: k_renderTraffic
},
downloadRenderer:		{	k_columnId: k_COLUMN_DOWNLOAD,
k_caption: k_tr('Download', 'bandwidthManagement'),
k_width: 100,
k_multilineRenderer: k_renderBandwidth
},
uploadRenderer:			{	k_columnId: k_COLUMN_UPLOAD,
k_caption: k_tr('Upload', 'bandwidthManagement'),
k_width: 100,
k_multilineRenderer: k_renderBandwidth
},
reservedDownload:		{	k_columnId: 'reservedDownload',
k_isHidden: true, k_isKeptHidden: true
},
reservedUpload:			{	k_columnId: 'reservedUpload',
k_isHidden: true, k_isKeptHidden: true
},
maximumDownload:		{	k_columnId: 'maximumDownload',
k_isHidden: true, k_isKeptHidden: true
},
maximumUpload:			{	k_columnId: 'maximumUpload',
k_isHidden: true, k_isKeptHidden: true
},
interfaceId:			{	k_columnId: 'interfaceId',
k_caption: k_tr('Interface', 'bandwidthManagement'),
k_width: 100,
k_renderer: function(k_value, k_data) {
var
k_text,
k_renderData,
k_iconCls;
if (k_data.interfaceId.invalid) {
k_text = this.k_translations.k_trNothing;
k_iconCls = 'interfaceIcon interfaceEthernet dead';
} else if ('' !== k_value.id) {
k_renderData = this.k_interfacesStore[k_value.id].k_rendererData;
k_text = k_value.name;
k_iconCls = k_renderData.k_icon;
}
else {
k_text = this.k_translations.k_trAllInterfaces;
k_iconCls = 'interfaceHeaderIcon groupInternet';
}
return {
k_data: k_text,
k_iconCls: k_iconCls
};
}
},
chart:					{	k_columnId: 'chart',
k_caption: k_tr('Chart', 'bandwidthManagement'),
k_width: 50,
k_renderer: function (k_value, k_data) {
return {
k_data: ''
};
},
k_editor: {	k_type: 'k_checkbox',
k_columnId: 'chart',
k_onChange: kerio.adm.k_framework.k_enableApplyReset
}
}
},k_columnOrder: [
'prepareColumns',
'name', 'trafficRenderer', 'downloadRenderer', 'uploadRenderer',
'interfaceId', 'validTimeRange', 'validTimeRangeEditor', 'chart',
'id', 'enabled', 'color', 'traffic',
'reservedDownload', 'reservedUpload', 'maximumDownload', 'maximumUpload', 'description'
], k_defaultRuleDefinition: {
name: k_tr('Other traffic', 'list'),
color: kerio.waw.shared.k_CONSTANTS.k_POLICY_BCKG_COLORS.k_WHITE
},

k_customInactiveRuleCheck: function() {
var
k_rowDataList;
k_rowDataList = this.k_findRowBy(kerio.waw.shared.k_methods.k_reportInactiveWebFilter);
if (k_rowDataList) {
if (!this.k_isWebFilterLicensed) {
return 'k_WebFilterNotLicensed';
}
else if (!this.k_isWebFilterOn && !this.k_isApplicationAwarenessOn) {
return 'k_applicationsAndWebFilterDisabled';
}
else if (!this.k_isWebFilterOn) {
return 'k_webFilterDisabled';
}
else if (!this.k_isApplicationAwarenessOn) {
return 'k_applicationAwarenessDisabled';
}
return 'k_webFilterDisabled';
}
return false;
},
k_customStatusBarCfg: {
k_webFilterDisabled: {
k_text: k_tr('Some rules are inactive (Kerio Control Web Filter is disabled).', 'contentFilter'),
k_iconCls: 'ruleInactive'
},
k_applicationAwarenessDisabled: {
k_text: k_tr('Some rules are inactive (application awareness is disabled).', 'contentFilter'),
k_iconCls: 'ruleInactive'
},
k_applicationsAndWebFilterDisabled: {
k_text: k_tr('Some rules are inactive (Kerio Control Web Filter and application awareness are disabled).', 'contentFilter'),
k_iconCls: 'ruleInactive'
},
k_WebFilterNotLicensed: {
k_text: k_tr('Some rules are inactive (Kerio Control Web Filter is not licensed).', 'contentFilter'),
k_iconCls: 'ruleInactive'
}
},
k_bottomToolbarAdditionalRowItems: [
{
k_id: 'k_btnTrafficChart',
k_caption: k_tr('Show Traffic Chart', 'contextMenu'),
k_isVisibleInToolbar: k_isAuditor,
k_onClick: function(k_toolbar, k_item) {
kerio.waw.status.k_currentScreen.k_switchPage('trafficCharts', {
k_componentType: kerio.waw.shared.k_CONSTANTS.TrafficStatisticsType.TrafficStatisticsBandwidthRule,
k_componentId:   k_toolbar.k_parentWidget.k_selectionStatus.k_rows[0].k_data.id
});
}
}
],
k_bottomToolbarAdditionalGeneralItems: [
'->',
{
k_caption: k_tr('Troubleshoot…', 'common'),
k_isVisibleInToolbar: true,

k_onClick: function() {
kerio.waw.shared.k_methods.k_openSpecificKbArticle(1373);
}
}
],
k_onChangeHandler: kerio.adm.k_framework.k_enableApplyReset
}; k_grid = new kerio.waw.shared.k_widgets.K_RulesGrid(k_localNamespace + 'grid', k_gridCfg);
if (!k_isAuditor) {

k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function(k_toolbar) {
var
k_form = k_toolbar.k_relatedWidget;
if (!k_form.k_isValid()) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return false;
}
k_form.k_sendData();
return false;
}, 
k_onReset: function(k_toolbar) {
k_toolbar.k_relatedWidget.k_applyParams();
}
}; k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
} k_currentBandwidth = new kerio.waw.shared.k_widgets.K_BmBandwidthTable(k_localNamespace + 'k_currentBandwidth');
k_formCfg = {
k_toolbars: k_isAuditor ? undefined : { k_bottom: k_toolbar },
k_items: [
{
k_type: 'k_display',
k_value: k_tr('The Bandwidth Management allows you to fine-tune your Internet bandwidth utilization. You can reserve as well as limit bandwidth for selected traffic.', 'bandwidthManagement')
},
{
k_type: 'k_fieldset',
k_minHeight: 250,
k_caption: k_tr('Bandwidth Management rules', 'bandwidthManagement'),
k_content: k_grid
},
{
k_type: 'k_fieldset',
k_height: 50,
k_caption: k_tr('VPN tunnels', 'bandwidthManagement'),
k_items: [
{
k_id: 'decryptVpnTunnels',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Use rules for VPN tunnels before encrypting', 'bandwidthManagement'),
k_onChange: kerio.adm.k_framework.k_enableApplyReset
}
]
},
{
k_type: 'k_fieldset',
k_height: (k_isAuditor ? 90 : 128), k_caption: k_tr('Internet bandwidth', 'bandwidthManagement'),
k_items: [
{
k_type: 'k_container',
k_id: 'k_currentBandwidthContainer',
k_height: 70,
k_content: k_currentBandwidth
},
{
k_type: 'k_row',
k_isHidden: k_isAuditor,
k_items: [
'->',
{
k_id: 'k_btnChange',
k_type: 'k_formButton',
k_caption: k_tr('Change…', 'bandwidthManagement'),
k_onClick: k_onClickButtonChange
} ] }
] } ] }; k_form = new kerio.lib.K_Form(k_objectName, k_formCfg);
k_form.k_addReferences({
k_grid: k_grid,
k_currentBandwidth: k_currentBandwidth,
k_onClickButtonChange: k_onClickButtonChange
});
this.k_addControllers(k_form);
k_form.k_addReferences({
k_getBandwidthRequest: {
k_jsonRpc: {
method: 'BandwidthManagement.getBandwidth'
},
k_callback: k_form.k_loadBandwidthCallback,
k_scope: k_form
},
k_setBandwidthRequest: {
k_jsonRpc: {
method: 'BandwidthManagement.setBandwidth',
params: {}
} },
k_getWebFilterConfig: {
k_jsonRpc: {
method: 'ContentFilter.getUrlFilterConfig'
},
k_callback: k_form.k_loadLicencingCallback,
k_scope: k_grid
}
});
k_grid.k_addReferences({
k_form: k_form,
k_multilineProperties: {
k_renderTrafficItem: k_renderTrafficItem,
BMConditionType: k_WAW_CONSTANTS.BMConditionType,
BMTrafficType: k_WAW_CONSTANTS.BMTrafficType,
k_BM_TYPE_ORDER: k_WAW_DEFINITIONS.k_BM_TYPE_ORDER,
k_listMaxItems: k_WAW_CONSTANTS.k_LIMIT_MULTILINE_LIST_RENDERER
}, k_lineRenderTraffic: k_lineRenderTraffic,
k_lineRenderBandwidthUpload: k_lineRenderBandwidthUpload,
k_lineRenderBandwidthDownload: k_lineRenderBandwidthDownload,
k_COLUMN_TRAFFIC: k_COLUMN_TRAFFIC,
k_COLUMN_DOWNLOAD: k_COLUMN_DOWNLOAD,
k_COLUMN_UPLOAD: k_COLUMN_UPLOAD,
k_TRAFFIC_TYPE_TRANSLATIONS: k_TRAFFIC_TYPE_TRANSLATIONS,
k_getDataRequest: {
k_jsonRpc: {
method: k_manager + '.get'
},
k_callback: k_form.k_loadDataCallback,
k_scope: k_form
},
k_setDataRequest: {
k_jsonRpc: {
method: k_manager + '.set'
},
k_callback: k_form.k_saveDataCallback,
k_scope: k_form
},
k_translations: {
k_trAllInterfaces: k_tr('All', 'bandwidthManagement'),
k_trExceededQuota: k_tr('Exceeded quota', 'bandwidthManagement'),
k_trLargeDataTransfers: k_tr('Large data transfers', 'bandwidthManagement'),
k_trNoLimit: k_tr('No limit', 'bandwidthManagement'),
k_trNothing: k_tr('Nothing', 'common'),
k_trAny: k_tr('Any', 'common')
},
k_cntRowsNeedUpLinkSpeed: 0,
k_rowsNeedUpLinkSpeed: {},
k_cntRowsNeedDownLinkSpeed: 0,
k_rowsNeedDownLinkSpeed: {},
k_interfacesStore: {},
k_bandwidthStore: {},
k_bandwidthStoreChanged: false,
k_formatInterfaceName: k_shared.k_methods.k_formatInterfaceName,
k_typeRas: k_shared.k_CONSTANTS.InterfaceType.Ras,
k_preselectRowId: null,
k_isWebFilterOn: false,
k_isApplicationAwarenessOn: false,
k_isWebFilterLicensed: false
});
kerio.waw.shared.k_methods.k_renderers.k_lineRenderTraffic = k_lineRenderTraffic;
kerio.waw.shared.k_methods.k_renderers.k_renderTrafficItem = k_renderTrafficItem;
return k_form;
},
k_addControllers: function(k_kerioWidget){
k_kerioWidget.k_applyParams = function() {
var
k_grid = this.k_grid;
kerio.waw.shared.k_data.k_get('k_timeRanges');
kerio.waw.requests.k_sendBatch([
this.k_getWebFilterConfig,
this.k_getBandwidthRequest,
k_grid.k_getDataRequest
]);
k_grid.k_preselectRowId = kerio.waw.status.k_currentScreen.k_getSwitchPageParam('k_id');
};
k_kerioWidget.k_loadLicencingCallback = function(k_response, k_success) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_data = k_success && k_response && k_response.config ? k_response.config : {};
this.k_isWebFilterOn = k_data.enabled && k_CONSTANTS.UrlFilterStatus.UrlFilterActivated === k_data.status;
this.k_isApplicationAwarenessOn = k_data.appidEnabled;
this.k_isWebFilterLicensed = k_CONSTANTS.UrlFilterStatus.UrlFilterNotLicensed !== k_data.status;;
};

k_kerioWidget.k_loadBandwidthCallback = function(k_response, k_success) {
var
k_bandwidth,
k_rendererData,
k_formatInterfaceName = this.k_grid.k_formatInterfaceName,
k_getBmInterfaceIcon = kerio.waw.shared.k_methods.k_getBmInterfaceIcon,
k_i, k_interface,
k_interfaces = [];
if (k_success && k_response && k_response.list) {
k_bandwidth = k_response.list;
this.k_currentBandwidth.k_setRows(k_bandwidth);
for (k_i = 0; k_i < k_bandwidth.length; k_i++) {
k_interface = k_bandwidth[k_i];
k_interface.enabled = true;
k_interface.invalid = false;
k_rendererData = k_formatInterfaceName(k_interface.name, k_interface);
k_interface.k_rendererData = {
k_name: k_interface.name,
k_id: k_interface.id,
k_icon: 'cellIcon interfaceIcon ' + k_getBmInterfaceIcon(k_interface)
};
k_interfaces.push(k_interface.k_rendererData);
k_interfaces[k_interface.id] = k_interface;
}
this.k_grid.k_interfacesStore = k_interfaces;
this.k_grid.k_bandwidthStore = k_bandwidth;
this.k_grid.k_bandwidthStoreChanged = false;
}
}; 
k_kerioWidget.k_loadDataCallback = function (k_response, k_success) {
if (!k_success) {
return;
}
var
k_grid = this.k_grid;
this.k_processTrafficItems(k_response.config.rules);
k_grid.k_setData(k_response.config.rules);
k_grid.k_onLoad();
this.k_setData(k_response.config);
if (k_grid.k_preselectRowId) { kerio.waw.shared.k_DEFINITIONS.k_preselectRowById.defer(500, k_grid);
}
this.k_alertLinkSpeedNeeded(this);
kerio.adm.k_framework.k_enableApplyReset(false);
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_data: [],
k_dialogs: [
'bandwidthManagementReservationEditor',
'bandwidthManagementTrafficEditor',
'bandwidthManagementLinkEditor',
'bandwidthManagementInterfaceEditor',
'ruleDescriptionEditor'
]
});
}; 
k_kerioWidget.k_sendData = function() {
var
k_grid = this.k_grid,
k_setBandwidthRequest = this.k_setBandwidthRequest,
k_setDataRequest = k_grid.k_setDataRequest,
k_requests = [],
k_formData = this.k_getData();
if (this.k_grid.k_bandwidthStoreChanged) {
k_setBandwidthRequest.k_jsonRpc.params = {
list: this.k_grid.k_bandwidthStore
};
k_requests.push(k_setBandwidthRequest);
}
k_setDataRequest.k_jsonRpc.params = {
config: {
decryptVpnTunnels: k_formData.decryptVpnTunnels,
rules: this.k_getBmRules()
}
};
k_requests.push(k_setDataRequest);
kerio.waw.requests.k_sendBatch(k_requests);
};

k_kerioWidget.k_saveDataCallback = function(k_response, k_success) {
if (k_success) {
kerio.adm.k_framework.k_enableApplyReset(false);
if (kerio.adm.k_framework.k_leaveCurrentScreen()) {
return;
}
this.k_applyParams();
}
};

k_kerioWidget.k_getBmRules = function(k_data) {
var
k_grid = this.k_grid,
BMConditionType = k_grid.k_multilineProperties.BMConditionType,
k_rules = k_grid.k_getData(),
k_defaultRule = (k_rules && k_rules.length) ? k_rules[k_rules.length - 1] : undefined,
k_i, k_cnt,
k_j,
k_k, k_subGroupsCnt,
k_rule,
k_traffic,
k_item,
k_tempItem,
k_subGroups,
k_subGroupsItems = [];
if (!k_defaultRule || !k_defaultRule.k_isDefaultRule) {
kerio.lib.k_reportError('Internal error: Expected default rule but none found.', 'bandwidthManagementList');
}
else {
k_rules.remove(k_defaultRule);
}
for (k_i = 0, k_cnt = k_rules.length; k_i < k_cnt; k_i++) {
k_rule = k_rules[k_i];
k_subGroupsItems = [];
delete k_rule.prepareColumns;
delete k_rule.downloadRenderer;
delete k_rule.uploadRenderer;
delete k_rule.validTimeRangeEditor;
delete k_rule.trafficRenderer;
delete k_rule.inactive;
k_traffic = k_rule.traffic;
for (k_j = k_traffic.length - 1; k_j >= 0; k_j--) {
k_item = k_traffic[k_j];
if (BMConditionType.BMConditionApplication === k_item.type) {
if (k_item.k_isWholeSubGroup) {
k_subGroups = kerio.waw.shared.k_methods.k_getSubGroupItems(k_item.subGroup);
for (k_k = 0, k_subGroupsCnt = k_subGroups.length; k_k < k_subGroupsCnt; k_k++) {
k_tempItem = kerio.lib.k_cloneObject(k_item);
k_tempItem.appId = k_subGroups[k_k].id;
k_subGroupsItems.push(k_tempItem);
}
k_traffic.splice(k_j, 1);
}
else {
k_item.appId = k_item.id;
}
}
delete k_item.k_group;
delete k_item.k_order;
delete k_item.k_trafficRenderer;
}
k_rules[k_i].traffic = k_traffic.concat(k_subGroupsItems);
}
return k_rules;
};
k_kerioWidget.k_grid.k_prepareTrafficData = function(k_data) {
var
k_items = kerio.lib.k_cloneObject(k_data.traffic),
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
BMConditionType = this.k_multilineProperties.BMConditionType,
k_CONTENT_FILTER_APPLICATIONS = k_CONSTANTS.k_CONTENT_FILTER_APPLICATIONS,
k_cloneObject = kerio.lib.k_cloneObject,
k_newItems = [],
k_nonApplicationItems = [],
k_cnt = k_items.length,
k_isWebFilterOnly = 0 < k_cnt,
k_i,
k_item,
k_application;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_items[k_i];
if (BMConditionType.BMConditionApplication !== k_item.type) {
k_nonApplicationItems.push(k_item);
k_isWebFilterOnly = false;
}
else {
k_application = k_cloneObject(k_CONTENT_FILTER_APPLICATIONS[k_item.appId || k_item.id]);
if (k_application) {
k_application.type = BMConditionType.BMConditionApplication;
k_shared.k_methods.k_mergeObjects(k_item, k_application);
k_isWebFilterOnly = k_isWebFilterOnly && k_application.k_isWebFilterOnly;
k_application.group = k_application.name;
k_application.applications = [];
k_application.applications.push(k_application.id);
k_newItems.push(k_application);
}
}
}
if (0 < k_newItems.length) {
k_newItems = kerio.waw.shared.k_methods.k_filterApplications(k_newItems);
}
k_data.k_isWebFilterOnly = k_isWebFilterOnly;
k_data.traffic = k_newItems.concat(k_nonApplicationItems);
return k_data;
};

k_kerioWidget.k_grid.k_updateData = function(k_changedData, k_originalData) {
var
k_data = kerio.waw.shared.k_methods.k_mergeObjects(k_changedData, kerio.lib.k_cloneObject(k_originalData));
this.k_checkLinkSpeedNeeded(k_data);
this.k_form.k_processTrafficItems([k_data]); k_data.inactive = this._k_isInactiveRule(k_data);
this.k_updateRow(k_data); this.k_updateRowStatus(true); kerio.adm.k_framework.k_enableApplyReset(true);
};

k_kerioWidget.k_updateBandwidth = function(k_data, k_changed) {
this.k_currentBandwidth.k_setRows(k_data);
this.k_grid.k_bandwidthStore = k_data;
this.k_grid.k_bandwidthStoreChanged = this.k_grid.k_bandwidthStoreChanged || k_changed;
if (k_changed) {
kerio.adm.k_framework.k_enableApplyReset(true);
}
};

k_kerioWidget.k_alertLinkSpeedNeeded = function(k_form) {
var
k_upLinkSpeedNeeded = false,
k_downLinkSpeedNeeded = false,
k_currentBandwidthRows,
k_i, k_cnt,
k_row;
k_currentBandwidthRows = k_form.k_grid.k_bandwidthStore;
for (k_i = 0, k_cnt = k_currentBandwidthRows.length; k_i < k_cnt; k_i++) {
k_row = k_currentBandwidthRows[k_i];
if (!k_downLinkSpeedNeeded && 0 === k_row.download.speed) {
k_downLinkSpeedNeeded = true;
}
if (!k_upLinkSpeedNeeded && 0 === k_row.upload.speed) {
k_upLinkSpeedNeeded = true;
}
if (k_downLinkSpeedNeeded && k_upLinkSpeedNeeded) {
break;
}
}
if ((k_downLinkSpeedNeeded && 0 < k_form.k_grid.k_cntRowsNeedDownLinkSpeed) || (k_upLinkSpeedNeeded && 0 < k_form.k_grid.k_cntRowsNeedUpLinkSpeed)) {
k_form.k_onClickButtonChange(k_form, false);
return true;
}
return false;
};

k_kerioWidget.k_processTrafficItems = function(k_data) {
var
k_traffic,
k_i, k_dataCnt,
k_j, k_itemCnt;
for (k_i = 0, k_dataCnt = k_data.length; k_i < k_dataCnt; k_i++) {
k_traffic = k_data[k_i].traffic;
for (k_j = 0, k_itemCnt = k_traffic.length; k_j < k_itemCnt; k_j++) {
this.k_setTrafficItemSorting(k_traffic[k_j]);
}
k_traffic.sort(this.k_sortItems);
}
};

k_kerioWidget.k_setTrafficItemSorting = function(k_item, k_clone) {
var
k_shared = kerio.waw.shared,
BMConditionType = k_shared.k_CONSTANTS.BMConditionType,
k_BM_TRAFFIC_TYPE_TRANSLATIONS = k_shared.k_DEFINITIONS.k_BM_TRAFFIC_TYPE_TRANSLATIONS,
k_BM_TYPE_ORDER = this.k_grid.k_multilineProperties.k_BM_TYPE_ORDER,
k_group = k_item.type,
k_order = k_BM_TYPE_ORDER.indexOf(k_group); switch(k_group) { case BMConditionType.BMConditionTrafficType:
k_order = k_order + '_' + k_BM_TRAFFIC_TYPE_TRANSLATIONS[k_item.trafficType]; break;
case BMConditionType.BMConditionLargeData:
k_group = BMConditionType.BMConditionTrafficType;
break;
case BMConditionType.BMConditionUsers:
k_order = k_order + '_' + (k_item.user.isGroup ? 1 : 0); break;
case BMConditionType.BMConditionHosts:
k_order = k_order + '_' + k_item.hostStr;
break;
case BMConditionType.BMConditionQuota:
k_group = BMConditionType.BMConditionUsers;
break;
case BMConditionType.BMConditionTrafficRule:
k_order = k_order + '_' + k_item.valueId.name;
break;
case BMConditionType.BMConditionService:
k_order = k_order + '_' + k_item.service.name;
break;
case BMConditionType.BMConditionContentRule:
k_group = BMConditionType.BMConditionTrafficRule;
k_order = k_order + '_' + k_item.valueId.name;
break;
case BMConditionType.BMConditionDscp:
k_order = k_order + '_' + k_item.dscp;
break;
}
if (true === k_clone) {
k_item = kerio.lib.k_cloneObject(k_item);
}
k_item.k_group = k_BM_TYPE_ORDER.indexOf(k_group); k_item.k_order = '' + k_order; return k_item;
};

k_kerioWidget.k_sortItems = function(k_first, k_second) {
return k_first.k_order.localeCompare(k_second.k_order);
};

k_kerioWidget.k_grid.k_checkLinkSpeedNeeded = function(k_data, k_extRecord) {
if (undefined === k_extRecord) {
if (0 === this.k_selectionStatus.k_selectedRowsCount) {
return;
}
k_extRecord = this.k_selectionStatus.k_rows[0].k_extRecord;
}
var
k_BANDWIDTH_UNITS_MAPPED = kerio.waw.shared.k_DEFINITIONS.k_BANDWIDTH_UNITS_MAPPED,
k_isUpLinkSpeedNeeded = false,
k_isDownLinkSpeedNeeded = false,
k_reservedDownload,
k_maximumDownload,
k_reservedUpload,
k_maximumUpload;
if (k_data.enabled) {
k_reservedDownload = k_data.reservedDownload;
if (!k_isDownLinkSpeedNeeded && k_reservedDownload && k_reservedDownload.enabled) {
k_isDownLinkSpeedNeeded = true;
}
k_maximumDownload = k_data.maximumDownload;
if (!k_isDownLinkSpeedNeeded && k_maximumDownload && k_maximumDownload.enabled && '%' === k_BANDWIDTH_UNITS_MAPPED[k_maximumDownload.unit]) {
k_isDownLinkSpeedNeeded = true;
}
k_reservedUpload = k_data.reservedUpload;
if (!k_isUpLinkSpeedNeeded && k_reservedUpload && k_reservedUpload.enabled) {
k_isUpLinkSpeedNeeded = true;
}
k_maximumUpload = k_data.maximumUpload;
if (!k_isUpLinkSpeedNeeded && k_maximumUpload && k_maximumUpload.enabled && '%' === k_BANDWIDTH_UNITS_MAPPED[k_maximumUpload.unit]) {
k_isUpLinkSpeedNeeded = true;
}
}
if (undefined !== k_extRecord) {
this.k_setLinkSpeedNeededFlags(k_isUpLinkSpeedNeeded, true, k_extRecord);
this.k_setLinkSpeedNeededFlags(k_isDownLinkSpeedNeeded, false, k_extRecord);
}
};

k_kerioWidget.k_grid.k_setLinkSpeedNeededFlags = function(k_isLinkSpeedNeeded, k_isUpload, k_extRecord) {
var
k_rowsNeedLinkSpeed = k_isUpload ? this.k_rowsNeedUpLinkSpeed : this.k_rowsNeedDownLinkSpeed,
k_cntChange = 0,
k_storedRecord;
if (k_isLinkSpeedNeeded) {
if (undefined === k_rowsNeedLinkSpeed[k_extRecord.id]) {
k_rowsNeedLinkSpeed[k_extRecord.id] = k_extRecord;
k_cntChange = 1;
}
}
else {
k_storedRecord = k_rowsNeedLinkSpeed[k_extRecord.id];
if (undefined !== k_storedRecord) {
delete k_rowsNeedLinkSpeed[k_storedRecord.id];
k_cntChange = -1;
}
}
if (k_isUpload) {
this.k_cntRowsNeedUpLinkSpeed += k_cntChange;
}
else {
this.k_cntRowsNeedDownLinkSpeed += k_cntChange;
}
};

k_kerioWidget.k_grid.k_updateInvalidServices = function() {
var
RuleConditionType,
k_DEFINITIONS,
k_CONSTANTS,
BMConditionType,
k_shared,
k_datastore,
k_serviceListMapped,
k_mappedService,
k_data,
k_trafficEntries,
k_isServiceChanged,
k_updatedData,
k_newEntries,
k_entry,
k_i, k_cnt,
k_j, k_cntTrafficEntries;
k_datastore = kerio.waw.shared.k_data.k_get('k_services');
if (!k_datastore) {
return;
}
k_serviceListMapped = k_datastore.k_serviceListMapped;
k_shared = kerio.waw.shared;
k_DEFINITIONS = k_shared.k_DEFINITIONS;
k_CONSTANTS = k_shared.k_CONSTANTS;
RuleConditionType = k_CONSTANTS.RuleConditionType;
BMConditionType = k_CONSTANTS.BMConditionType;
k_data = this.k_getData();
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_trafficEntries = kerio.lib.k_cloneObject(k_data[k_i].traffic);
k_isServiceChanged = false;
k_newEntries = [];
for (k_j = 0, k_cntTrafficEntries = k_trafficEntries.length; k_j < k_cntTrafficEntries; k_j++) {
k_entry = k_trafficEntries[k_j];
if (BMConditionType.BMConditionService === k_entry.type) {
k_mappedService = k_serviceListMapped[k_entry.service.id];
if (undefined === k_mappedService) {
k_isServiceChanged = true;
}
else {
if (k_mappedService.name !== k_entry.service.name) {
k_entry.service.name = k_mappedService.name;
k_isServiceChanged = true;
}
k_newEntries.push(k_entry);
}
}
else {
k_newEntries.push(k_entry);
}
}
if (k_isServiceChanged) {
if (0 === k_newEntries.length) {
k_updatedData = {inactive: true, traffic: [kerio.waw.shared.k_DEFINITIONS.k_get('k_bandwidthTrafficDataTemplate')]};
}
else {
k_updatedData = {traffic: k_newEntries};
}
this.k_updateRow(k_updatedData, k_i);
this.k_updateRowStatus(k_data[k_i]); this.k_updateRowStatus(true);      this.k_updateRow(k_updatedData, k_i);
}
}
};
} }; 
kerio.waw.shared.k_widgets.K_BmBandwidthTable = function(k_id) {
var
k_tr = kerio.lib.k_tr,
k_displayCfg;
k_displayCfg = {
k_className: 'scrollContent',

k_template: '<table class="bandwidth" width="620px"><tbody>'
+ '<tpl if="!k_rows || 0 &gt;= k_rows.length">'
+ '<tr>'
+ '<td width="19px" class="userMessage warning">&nbsp;</td>'
+ '<td>'
+ '<tpl if="k_forceRefresh">'
+ k_tr('Refreshing data…', 'bandwidthManagement')
+ '</tpl>'
+ '<tpl if="!k_forceRefresh">'
+ k_tr('No Internet connection', 'bandwidthManagement')
+ '</tpl>'
+ '</td>'
+ '</tr>'
+ '</tpl>'
+ '<tpl if="k_rows && 0 &lt; k_rows.length">'
+ '<tpl for="k_rows">'
+ '<tpl if="true === online">'
+ '<tr height="19px" title="{name:htmlEncode}">' + '</tpl>'
+ '<tpl if="false === online">'
+ '<tr height="19px" class="dead" title="{name:htmlEncode} (' + k_tr('Offline', 'bandwidthManagement') + ')">'
+ '</tpl>'
+ '<tpl if="false === online">'
+ '<td width="19px" class="cellIcon interfaceIcon {[this.k_types(values)]} dead">&nbsp'
+ '</tpl>'
+ '<tpl if="true === online">'
+ '<td width="19px" class="cellIcon interfaceIcon {[this.k_types(values)]}">&nbsp'
+ '</tpl>'
+ '<td width="150px"><span class="ellipsis" style="width:150px !important;">{name:htmlEncode}</span>'
+ '<tpl for="download">'
+ '<tpl if="!speed">'
+ '<td width="19px" class="userMessage warning">&nbsp;</td>'
+ '</tpl>'
+ '<tpl if="speed">'
+ '<td width="19px">&nbsp;</td>'
+ '</tpl>'
+ '<td width="200px">'
+ k_tr('Download:', 'bandwidthManagement')
+ ' '
+ '<tpl if="!speed">'
+ k_tr('not defined', 'bandwidthManagement')
+ '</tpl>'
+ '<tpl if="speed">'
+ '{speed} {[this.k_units(values.unit)]}'
+ '</tpl>'
+ '</td>'
+ '</tpl>'
+ '<tpl for="upload">'
+ '<tpl if="!speed">'
+ '<td width="19px" class="userMessage warning">&nbsp;</td>'
+ '</tpl>'
+ '<tpl if="speed">'
+ '<td width="19px">&nbsp;</td>'
+ '</tpl>'
+ '<td width="200px">'
+ k_tr('Upload:', 'bandwidthManagement')
+ ' '
+ '<tpl if="!speed">'
+ k_tr('not defined', 'bandwidthManagement')
+ '</tpl>'
+ '<tpl if="speed">'
+ '{speed} {[this.k_units(values.unit)]}'
+ '</tpl>'
+ '</td>'
+ '</tpl>'
+ '</tr>'
+ '</tpl>'
+ '</tpl>'
+ '</tbody></table>',
k_isSecure: true,
k_value: {
k_rows: [], k_forceRefresh: true
}
};
kerio.waw.shared.k_widgets.K_BmBandwidthTable.superclass.constructor.call(this, k_id, k_displayCfg);
this.k_extWidget.on('afterrender', this._k_initTemplate, this);
}; kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_BmBandwidthTable', kerio.lib.K_DisplayField,

{

_k_initTemplate: function() {
Ext.apply(this.k_extWidget.tpl, this._k_templateScope);
Ext.apply(this.k_extWidget.tpl, {
k_BANDWIDTH_UNITS_MAPPED: kerio.waw.shared.k_DEFINITIONS.k_BANDWIDTH_UNITS_MAPPED,
InterfaceType: kerio.waw.shared.k_CONSTANTS.InterfaceType
});
},

_k_templateScope: {

k_units: function(k_unit){
return this.k_BANDWIDTH_UNITS_MAPPED[k_unit];
},

k_types: kerio.waw.shared.k_methods.k_getBmInterfaceIcon
},

k_setRows: function(k_rows) {
this.k_setValue({ k_rows: k_rows || [], k_forceRefresh: false });
},

k_setRefresh: function() {
this.k_setValue({ k_rows: [], k_forceRefresh: true });
}
}); 