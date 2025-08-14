

kerio.waw.ui.routingTableList = {

k_init: function(k_objectName) {
var
k_shared = kerio.waw.shared,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_batchRequests = [],
k_INDEX_GET_ACTIVE_ROUTES_IPv4 = 0,
k_INDEX_GET_STATIC_ROUTES_IPv4 = 1,
k_INDEX_GET_ACTIVE_ROUTES_IPv6 = 2,
k_INDEX_GET_STATIC_ROUTES_IPv6 = 3,
k_ipv4Form,
k_ipv6Form,
k_getRoutesToSave,
k_renderRouteName,
k_renderInterface,
k_createFormWithRouteTables,
k_functionParams,
k_toolbarCfg,
k_toolbar,
k_tabPageCfg,
k_tabPage,
k_formReferences;
k_batchRequests[k_INDEX_GET_ACTIVE_ROUTES_IPv4] = { method: 'RoutingTable.get', params: {} };
k_batchRequests[k_INDEX_GET_STATIC_ROUTES_IPv4] = { method: 'RoutingTable.getStaticRoutes', params: {} };
k_batchRequests[k_INDEX_GET_ACTIVE_ROUTES_IPv6] = { method: 'RoutingTable.get', params: {ipv6: true} };
k_batchRequests[k_INDEX_GET_STATIC_ROUTES_IPv6] = { method: 'RoutingTable.getStaticRoutes', params: {ipv6: true} };

k_getRoutesToSave = function() {
var
k_staticRoutesGrid = this.k_staticRoutesGrid,
k_routes,
k_route,
k_i, k_cnt;
if (!k_staticRoutesGrid.k_isChanged() && !k_staticRoutesGrid.k_isRouteListEdited) {
return null;
}
k_routes = this.k_staticRoutesGrid.k_getData();
for (k_i = 0, k_cnt = k_routes.length; k_i < k_cnt; k_i++) {
k_route = k_routes[k_i];
delete k_route.nameRenderer;
delete k_route.interfaceRenderer;
delete k_route.k_status;
delete k_route.networkRenderer;
delete k_route.maskRenderer;
delete k_route.gatewayRenderer;
}
return k_routes;
};

k_renderRouteName = function(k_value, k_data) {
var
k_form = this.k_form,
kerio_web_SharedConstants = k_form.kerio_web_SharedConstants,
RouteType = k_form.RouteType,
k_iconClass = 'routeListIcon';
switch (k_data.type) {
case RouteType.RouteSystem:
k_data.nameRenderer = k_form.k_systemRouteText;
break;
case RouteType.RouteVpn:
k_data.nameRenderer = k_form.k_vpnRouteText;
break;
case RouteType.RouteStatic: k_data.nameRenderer = ('' === k_data.name ? k_form.k_vpnRouteText : k_data.name);
break;
default:k_data.nameRenderer = k_data.name;
}
switch (k_data.k_status) {
case kerio_web_SharedConstants.kerio_web_StoreStatusNew:
k_iconClass += ' added';
break;
case kerio_web_SharedConstants.kerio_web_StoreStatusModified:
k_iconClass += ' modified';
break;
}
return {
k_iconCls: k_iconClass,
k_data: k_data.nameRenderer
};
};

k_renderInterface = function(k_value, k_data) {
var
k_interfaceData = {
type: k_data.interfaceType,
enabled: k_data.enabled,
invalid: k_data.interfaceId.invalid
},
k_rendererData;
k_data.enabled = k_interfaceData.enabled;
k_rendererData = kerio.waw.shared.k_methods.k_formatInterfaceName(k_data.interfaceId.name, k_interfaceData);
k_data.interfaceRenderer = k_rendererData.k_data;
return k_rendererData;
};
k_createFormWithRouteTables = function(k_config) {
var
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isIpv6,
k_localNamespace,
k_getRoutesToSave,
k_renderRouteName,
k_renderInterface,
k_nameColumn,
k_gridColumns,
k_columns,
k_activeRoutesGrid,
k_activeRoutesGridCfg,
k_staticRoutesGrid,
k_staticRoutesGridCfg,
k_statusbarCfg,
k_staticRoutesStatusbar,
k_renderNetwork,
k_renderMask,
k_renderGateway,
k_widgetId,
k_formCfg,
k_form;
k_isIpv6 = k_config.k_isIpv6;
k_localNamespace = k_config.k_localNamespace;
k_getRoutesToSave = k_config.k_getRoutesToSave;
k_renderRouteName = k_config.k_renderRouteName;
k_renderInterface = k_config.k_renderInterface;

if (k_isIpv6) {
k_renderNetwork = function(k_value, k_data) {
k_data.networkRenderer = this.k_form.k_padIpv6AddressWithZeroes(k_data.network);
return { k_data: k_data.network};
};
}
else {
k_renderNetwork = function(k_value, k_data) {
k_data.networkRenderer = this.k_form.k_ipToNumber(k_data.network);
return { k_data: k_data.network};
};
}

if (k_isIpv6) {
k_renderMask = function(k_value, k_data) {
k_data.maskRenderer = k_data.prefixLen;
return { k_data: k_data.prefixLen};
};
}
else {
k_renderMask = function(k_value, k_data) {
k_data.maskRenderer = this.k_form.k_ipToNumber(k_data.mask);
return { k_data: k_data.mask};
};
}

if (k_isIpv6) {
k_renderGateway = function(k_value, k_data) {
var k_gateway = k_data.gateway || '0::';
k_data.gatewayRenderer = this.k_form.k_padIpv6AddressWithZeroes(k_gateway);
return { k_data: k_data.gateway};
};
}
else {
k_renderGateway = function(k_value, k_data) {
if ('' === k_data.gateway) {
k_data.gatewayRenderer = 0;
} else {
k_data.gatewayRenderer = this.k_form.k_ipToNumber(k_data.gateway);
}
return { k_data: k_data.gateway};
};
}
k_nameColumn = {
k_columnId: 'nameRenderer',
k_caption: k_tr('Name', 'common'),
k_renderer: k_renderRouteName,
k_width: 150
};
k_gridColumns = [
{
k_columnId: 'enabled',
k_isDataOnly: true
},
{
k_columnId: 'type',
k_isDataOnly: true
},
{
k_columnId: 'interfaceType',
k_isDataOnly: true
},
{
k_columnId: 'interfaceId',
k_isDataOnly: true
},
{
k_columnId: 'name',
k_isDataOnly: true
},
k_nameColumn,
{
k_columnId: 'network',
k_isDataOnly: true
},
{
k_columnId: 'networkRenderer',
k_width: k_isIpv6 ? 200 : undefined,
k_caption: k_isIpv6 ? k_tr('Prefix', 'common') : k_tr('Network', 'common'),
k_renderer: k_renderNetwork
},
{
k_columnId: 'mask',
k_isDataOnly: true
},
{
k_columnId: 'prefixLen',
k_isDataOnly: true
},
{
k_columnId: 'maskRenderer',
k_caption: k_isIpv6 ? k_tr('Prefix Length', 'routerAdvertisements') : k_tr('Mask', 'common'),
k_renderer: k_renderMask
},
{
k_columnId: 'gateway',
k_isDataOnly: true
},
{
k_columnId: 'gatewayRenderer',
k_width: k_isIpv6 ? 200 : undefined,
k_caption: k_tr('Gateway', 'common'),
k_renderer: k_renderGateway
},
{
k_columnId: 'interfaceRenderer',
k_caption: k_tr('Interface', 'common'),
k_renderer: k_renderInterface,
k_width: 160
},
{
k_columnId: 'metric',
k_caption: k_tr('Metric', 'routingTableList'),
k_width: 50
}
];
k_columns = {
k_sorting: {
k_columnId: 'networkRenderer',
k_isAscending: true
},
k_items: k_gridColumns
};
k_statusbarCfg = {
k_defaultConfig:  'k_noMessage',
k_configurations: {
k_noMessage: {
k_text: ''
},
k_ifaceInactive: {
k_text: k_tr('Some rows are invalid as they refer to objects that do not exist.', 'policyList'),
k_iconCls: 'ruleInactive'
}
}
};
k_activeRoutesGridCfg = {
k_selectionMode: 'k_none',
k_columns: k_lib.k_cloneObject(k_columns)
};
k_widgetId = k_localNamespace + (k_isIpv6 ? 'ipv6ActiveRoutes' : 'activeRoutes');
k_activeRoutesGrid = new k_lib.K_Grid(k_widgetId, k_activeRoutesGridCfg);
k_nameColumn.k_editor = {
k_type: 'k_checkbox',
k_columnId: 'enabled',

k_onChange: function(k_grid, k_value, k_data) {
k_data.k_status = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusModified;
k_grid.k_updateRow(k_data);
kerio.adm.k_framework.k_enableApplyReset();
}
};
k_gridColumns.unshift(
{
k_columnId: 'k_status',
k_isDataOnly: true
}
);
k_columns.k_items = k_gridColumns;
k_staticRoutesStatusbar = new kerio.lib.K_Statusbar(k_localNamespace + 'k_statusbar' + (k_isIpv6 ? '_ipv6StaticRoutes' : '_staticRoutes'), k_statusbarCfg);
k_staticRoutesGridCfg = {
k_className: 'statusBarGrid',
k_statusbar: k_staticRoutesStatusbar,
k_isReadOnly: k_isAuditor,
k_columns: k_lib.k_cloneObject(k_columns),
k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'staticRouteEditor',
k_objectName: {
k_btnAdd: k_isIpv6 ? 'ipv6StaticRouteEditorAdd' : 'staticRouteEditorAdd',
k_btnEdit: k_isIpv6 ? 'ipv6StaticRouteEditorEdit' : 'staticRouteEditorEdit'
}
},
k_items: [
{
k_type: 'K_GRID_DEFAULT',

k_onRemove: function(k_toolbar) {
k_toolbar.k_relatedWidget.k_removeSelectedRows();
this.k_relatedWidget.k_form.k_setInactiveMessage();
kerio.adm.k_framework.k_enableApplyReset(true);
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
}
]
}
},
k_rowRenderer: function(k_rowData) {
var
k_className = '';
if (k_rowData.interfaceId.invalid) {
k_className = 'inactive';
}
this.k_form.k_setInactiveMessage();
return k_className;
}
};
if (k_isAuditor) {
k_staticRoutesGridCfg.k_toolbars = {};
}
k_widgetId = k_localNamespace + (k_isIpv6 ? 'ipv6StaticRoutes' : 'staticRoutes');
k_staticRoutesGrid = new kerio.adm.k_widgets.K_BasicList(k_widgetId, k_staticRoutesGridCfg);
k_formCfg = {
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Active routing table', 'routingTableList'),
k_anchor: '0 50%',
k_minHeight: 120,
k_items: [
{
k_type: 'k_container',
k_content: k_activeRoutesGrid
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Static routes', 'routingTableList'),
k_anchor: '0 50%',
k_minHeight: 160,
k_items: [
{
k_type: 'k_container',
k_content: k_staticRoutesGrid
}
]
}
]
};
k_widgetId = k_localNamespace + (k_isIpv6 ? 'k_ipv6Form' : 'k_form');
k_form = new k_lib.K_Form(k_widgetId, k_formCfg);
k_activeRoutesGrid.k_addReferences({
k_form: k_form
});
k_staticRoutesGrid.k_addReferences({
k_isRouteListEdited: false,
k_isIpv6: k_isIpv6,
k_form: k_form
});
k_form.k_addReferences({
k_isIpv6: k_isIpv6,
k_getRoutesToSave: k_getRoutesToSave,
k_activeRoutesGrid: k_activeRoutesGrid,
k_staticRoutesGrid: k_staticRoutesGrid
});
return k_form;
};
k_functionParams = {
k_isIpv6: false,
k_localNamespace: k_localNamespace,
k_getRoutesToSave: k_getRoutesToSave,
k_renderRouteName: k_renderRouteName,
k_renderInterface: k_renderInterface
};
k_ipv4Form = k_createFormWithRouteTables(k_functionParams);
k_functionParams.k_isIpv6 = true;
k_ipv6Form = k_createFormWithRouteTables(k_functionParams);
k_tabPageCfg = {
k_className: 'mainList',
k_items: [
{
k_caption: k_tr('IPv4 Routing Table', 'routingTableList'),
k_content: k_ipv4Form,
k_id: 'k_ipv4RoutingTable'
},
{
k_caption: k_tr('IPv6 Routing Table', 'routingTableList'),
k_content: k_ipv6Form,
k_id: 'k_ipv6RoutingTable'
}
]
};
if (!k_isAuditor) {

k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function() {
var
k_tabPage = this.k_parentWidget,
k_ipv4Form = k_tabPage.k_ipv4Form,
k_ipv6Form = k_tabPage.k_ipv6Form,
k_requests = [],
k_ipv4Routes,
k_ipv6Routes;
k_ipv4Routes = k_ipv4Form.k_getRoutesToSave();
k_ipv6Routes = k_ipv6Form.k_getRoutesToSave();
if (null !== k_ipv4Routes) {
k_tabPage.k_ipv4RouteRequest.k_jsonRpc.params.routes = k_ipv4Routes;
k_requests.push(k_tabPage.k_ipv4RouteRequest);
}
if (null !== k_ipv6Routes) {
k_tabPage.k_ipv6RouteRequest.k_jsonRpc.params.routes = k_ipv6Routes;
k_requests.push(k_tabPage.k_ipv6RouteRequest);
}
kerio.waw.shared.k_methods.k_maskMainScreen();
kerio.waw.requests.k_sendBatch(k_requests, k_tabPage.k_requestParams);
return false;
},

k_onReset: function() {
this.k_parentWidget.k_applyParams(true);
}
};
k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
k_tabPageCfg.k_toolbars = {
k_bottom: k_toolbar
};
}
k_tabPage = new k_lib.K_TabPage(k_objectName, k_tabPageCfg);
k_formReferences = {
kerio_web_SharedConstants: k_shared.k_CONSTANTS.kerio_web_SharedConstants,
RouteType: k_shared.k_CONSTANTS.RouteType,
k_systemRouteText: k_tr('System route', 'routingTableList'),
k_vpnRouteText: k_tr('VPN route', 'routingTableList'),
k_isAuditor: k_isAuditor,
k_toolbar: k_toolbar
};
k_ipv4Form.k_addReferences(k_formReferences);
k_ipv6Form.k_addReferences(k_formReferences);
k_ipv4Form.k_addReferences({
k_ipToNumber: k_shared.k_methods.k_ipToNumber
});
k_ipv6Form.k_addReferences({
k_padIpv6AddressWithZeroes: k_shared.k_methods.k_padIpv6AddressWithZeroes
});
k_tabPage.k_addReferences({
k_ipv4Form: k_ipv4Form,
k_ipv6Form: k_ipv6Form,
k_ipv4ActiveRoutesGrid: k_ipv4Form.k_activeRoutesGrid,
k_ipv4StaticRoutesGrid: k_ipv4Form.k_staticRoutesGrid,
k_ipv6ActiveRoutesGrid: k_ipv6Form.k_activeRoutesGrid,
k_ipv6StaticRoutesGrid: k_ipv6Form.k_staticRoutesGrid,
k_batchRequests: k_batchRequests,
k_INDEX_GET_ACTIVE_ROUTES_IPv4: k_INDEX_GET_ACTIVE_ROUTES_IPv4,
k_INDEX_GET_STATIC_ROUTES_IPv4: k_INDEX_GET_STATIC_ROUTES_IPv4,
k_INDEX_GET_ACTIVE_ROUTES_IPv6: k_INDEX_GET_ACTIVE_ROUTES_IPv6,
k_INDEX_GET_STATIC_ROUTES_IPv6: k_INDEX_GET_STATIC_ROUTES_IPv6
});
this.k_addControllers(k_tabPage);
k_tabPage.k_addReferences({
k_batchOptions: {
k_requests: k_tabPage.k_batchRequests,
k_scope: k_tabPage,
k_callback: k_tabPage.k_loadDataCallback,
k_requestOwner: k_tabPage
},
k_ipv4RouteRequest: {
k_jsonRpc: {
method: 'RoutingTable.setStaticRoutes',
params: {
routes: null
}
}
},
k_ipv6RouteRequest: {
k_jsonRpc: {
method: 'RoutingTable.setStaticRoutes',
params: {
routes: null,
ipv6: true
}
}
},
k_requestParams: {
k_scope: k_tabPage,
k_mask: false,
k_callback: k_tabPage.k_onApplyResetCallback
}
});
return k_tabPage;
}, 
k_addControllers: function(k_kerioWidget) {
var
k_isRouteUnique,
k_setInactiveMessage,
k_storeRoute;

k_kerioWidget.k_applyParams = function(k_keepCurrentTab) {
kerio.waw.shared.k_methods.k_maskMainScreen();
if (true !== k_keepCurrentTab) {
kerio.waw.status.k_currentScreen.k_gotoTab(this, 'k_ipv4RoutingTable');
}
kerio.waw.shared.k_methods.k_sendBatch(this.k_batchOptions);
};

k_kerioWidget.k_loadDataCallback = function(k_response, k_success) {
var
k_ipv4ActiveRoutesGrid = this.k_ipv4ActiveRoutesGrid,
k_ipv4StaticRoutesGrid = this.k_ipv4StaticRoutesGrid,
k_ipv6ActiveRoutesGrid = this.k_ipv6ActiveRoutesGrid,
k_ipv6StaticRoutesGrid = this.k_ipv6StaticRoutesGrid,
k_batchResult,
k_resortRowsOnViewReady;
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_data: ['k_ethernetAndRasInterfaces'],
k_dialogs: ['staticRouteEditor']
});
if (!k_success || !k_response.k_decoded.batchResult) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
}
k_batchResult = k_response.k_decoded.batchResult;

k_resortRowsOnViewReady = function() {
this.k_resortRows();
};
k_ipv4ActiveRoutesGrid.k_extWidget.on('viewready', k_resortRowsOnViewReady, k_ipv4ActiveRoutesGrid);
k_ipv4StaticRoutesGrid.k_extWidget.on('viewready', k_resortRowsOnViewReady, k_ipv4StaticRoutesGrid);
k_ipv6ActiveRoutesGrid.k_extWidget.on('viewready', k_resortRowsOnViewReady, k_ipv6ActiveRoutesGrid);
k_ipv6StaticRoutesGrid.k_extWidget.on('viewready', k_resortRowsOnViewReady, k_ipv6StaticRoutesGrid);
k_ipv4ActiveRoutesGrid.k_setData(k_batchResult[this.k_INDEX_GET_ACTIVE_ROUTES_IPv4].routes);
k_ipv4StaticRoutesGrid.k_setData(k_batchResult[this.k_INDEX_GET_STATIC_ROUTES_IPv4].routes);
k_ipv4StaticRoutesGrid.k_isRouteListEdited = false;
k_ipv4StaticRoutesGrid.k_stopTracing();
k_ipv4StaticRoutesGrid.k_startTracing();
k_ipv6ActiveRoutesGrid.k_setData(k_batchResult[this.k_INDEX_GET_ACTIVE_ROUTES_IPv6].routes);
k_ipv6StaticRoutesGrid.k_setData(k_batchResult[this.k_INDEX_GET_STATIC_ROUTES_IPv6].routes);
k_ipv6StaticRoutesGrid.k_isRouteListEdited = false;
k_ipv6StaticRoutesGrid.k_stopTracing();
k_ipv6StaticRoutesGrid.k_startTracing();
kerio.adm.k_framework.k_enableApplyReset(false);
kerio.waw.shared.k_methods.k_unmaskMainScreen();
};

k_kerioWidget.k_onApplyResetCallback = function(k_response, k_success) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
if (k_success && kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
kerio.adm.k_framework.k_enableApplyReset(false);
if (!kerio.adm.k_framework.k_leaveCurrentScreen()) {
this.k_applyParams(true);
}
}
};

k_isRouteUnique = function(k_routeData, k_rowIndex) {
var
k_gridData = this.k_getData(),
k_route,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_gridData.length; k_i < k_cnt; k_i++) {
if (k_i === k_rowIndex) {
continue;
}
k_route = k_gridData[k_i];
if (k_route.network === k_routeData.network &&
k_route.mask === k_routeData.mask &&
k_route.gateway === k_routeData.gateway) {
kerio.waw.shared.k_methods.k_alertError(
kerio.lib.k_tr('The route already exists!', 'routingTableList')
);
return false;
}
}
return true;
};
k_kerioWidget.k_ipv4StaticRoutesGrid.k_isRouteUnique = k_isRouteUnique;
k_kerioWidget.k_ipv6StaticRoutesGrid.k_isRouteUnique = k_isRouteUnique;

k_setInactiveMessage = function() {
var
k_grid = this.k_staticRoutesGrid;
k_grid.k_statusbar.k_switchConfig('k_noMessage');
k_grid.k_getData().some(function(currentData) {
if (currentData.interfaceId.invalid) {
this.k_statusbar.k_switchConfig('k_ifaceInactive');
return true;
}
}, k_grid);
};
k_kerioWidget.k_ipv4Form.k_setInactiveMessage = k_setInactiveMessage;
k_kerioWidget.k_ipv6Form.k_setInactiveMessage = k_setInactiveMessage;

k_storeRoute = function(k_routeData, k_rowIndex) {
var
kerio_web_SharedConstants = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_isAdd = true;
if (undefined !== k_rowIndex) {
k_isAdd = false;
}
if (this.k_isIpv6) {
k_routeData.mask = '';
}
else {
k_routeData.prefixLen = 0;
}
if (k_isAdd) {
k_routeData.k_status = kerio_web_SharedConstants.kerio_web_StoreStatusNew;
} else if (kerio_web_SharedConstants.kerio_web_StoreStatusNew !== k_routeData.k_status) {
k_routeData.k_status = kerio_web_SharedConstants.kerio_web_StoreStatusModified;
}
if (k_isAdd) {
this.k_addRow(k_routeData);
}
this.k_isRouteListEdited = true;
this.k_resortRows();
kerio.adm.k_framework.k_enableApplyReset();
return true;
};
k_kerioWidget.k_ipv4StaticRoutesGrid.k_storeRoute = k_storeRoute;
k_kerioWidget.k_ipv6StaticRoutesGrid.k_storeRoute = k_storeRoute;
} }; 