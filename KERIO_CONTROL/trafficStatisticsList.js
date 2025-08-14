
kerio.waw.ui.trafficStatisticsList = {
k_init: function(k_objectName) {
var
k_tr = kerio.lib.k_tr,
k_localNamespace = k_objectName + '_',
k_shared = kerio.waw.shared,
k_sharedMethods = k_shared.k_methods,
k_isAuditor = k_sharedMethods.k_isAuditor(),
k_contextMenuCfg,
k_ctxMenuAction,
k_grid, k_gridCfg,
k_formHistogram,
k_layout, k_layoutCfg,
k_getContent,
k_onDisableRefresh,
k_trCache;

k_getContent = function() {
var
k_id = this.k_selectedId;
if (!k_id) { return;
}
if (!this.k_isDetailsVisible()) {
return; }
if (this.k_grid.k_selectionStatus && 1 < this.k_grid.k_selectionStatus.k_selectedRowsCount) {
this.k_histogram.k_setVisible('k_textMultiselect', true);
this.k_histogram.k_setVisible(['k_histogramType', 'k_container', 'k_textDeadInterface', 'k_title'], false);
return;
} this.k_histogram.k_setVisible('k_textMultiselect', false);
this.k_histogram.k_loadData(k_id);
};

k_onDisableRefresh = function(k_disabled) {
this.k_layout.k_autoRefreshGui.k_setDisabled(k_disabled);
};

k_ctxMenuAction = function(k_menu) {
var
TrafficStatisticsType = kerio.waw.shared.k_CONSTANTS.TrafficStatisticsType,
k_data = k_menu.k_relatedWidget.k_selectionStatus.k_rows[0].k_data, k_screenId;
switch (k_data.type) {
case TrafficStatisticsType.TrafficStatisticsInterface:
k_screenId = 'interfaces';
break;
case TrafficStatisticsType.TrafficStatisticsTrafficRule:
k_screenId = 'trafficRules';
break;
case TrafficStatisticsType.TrafficStatisticsBandwidthRule:
k_screenId = 'bandwidthManagement';
break;
default:
return;
}
kerio.waw.status.k_currentScreen.k_switchPage(k_screenId, {k_id: k_data.componentId});
};
k_contextMenuCfg = {
k_items: [
{
k_id: 'k_viewInterface',
k_caption: k_tr('View in Interfaces', 'contextMenu'),
k_isHidden: true,
k_onClick: k_ctxMenuAction
},
{
k_id: 'k_viewTrafficRule',
k_caption: k_tr('View in Traffic Rules', 'contextMenu'),
k_isHidden: true,
k_onClick: k_ctxMenuAction
},
{
k_id: 'k_viewBandwidthRule',
k_caption: k_tr('View in Bandwidth Management', 'contextMenu'),
k_isHidden: true,
k_onClick: k_ctxMenuAction
}
]
};
if (!k_isAuditor) {
k_contextMenuCfg.k_items.push({
k_id: 'k_deleteStats',
k_caption: k_tr('Reset Statistics', 'trafficStatisticsList'),
k_isDisabled: true,

k_onClick: function(k_menu) {
var
k_lib = kerio.lib,
k_grid = k_menu.k_relatedWidget;
if (0 >= k_grid.k_selectionStatus.k_selectedRowsCount) {
return;
}
if (!k_grid.k_confirmDeleteStatsCfg) { k_grid.k_confirmDeleteStatsCfg = {
k_title: k_lib.k_tr('Reset Statistics', 'trafficStatisticsList'),
k_msg:   k_lib.k_tr('Do you really want to reset the statistics?', 'trafficStatisticsList'),
k_callback: k_grid.k_confirmDeleteStats,
k_scope: k_grid
};
}
k_lib.k_confirm(k_grid.k_confirmDeleteStatsCfg);
}
}); } k_gridCfg = {
k_type: 'TrafficStatistics',
k_contextMenuCfg: k_contextMenuCfg,
k_onSetAutoRefreshInterval: k_sharedMethods.k_onSetAutoRefreshInterval,
k_onDisableRefresh: k_onDisableRefresh,
k_columns: {
k_autoExpandColumn: false,
k_grouping: {
k_columnId: 'type',
k_hasHeader: true,
k_isRemoreGroup: true
},
k_items: [
{k_isKeptHidden: true, k_columnId: 'type', k_isHidden: true,  
k_renderer: function(k_value) {
return {
k_data: this.k_trCache[k_value]
};
}
},
kerio.waw.shared.k_DEFINITIONS.k_get('k_prepareTrafficStatisticsColumns'), {k_isDataOnly: true,   k_columnId: 'interfaceType'} ,
{k_isDataOnly: true,   k_columnId: 'id'},
{k_isDataOnly: true,   k_columnId: 'componentId'}, {k_caption: k_tr('Name', 'common'), k_columnId: 'name',  k_width: 220,
k_renderer: function(k_value, k_data) {
var
TrafficStatisticsType = kerio.waw.shared.k_CONSTANTS.TrafficStatisticsType,
k_rendererData;
switch(k_data.type) {
case TrafficStatisticsType.TrafficStatisticsInterface:
k_rendererData = kerio.waw.shared.k_methods.k_formatInterfaceName(k_value, {
type: k_data.interfaceType,
enabled: true
});
break;
case TrafficStatisticsType.TrafficStatisticsTrafficRule:
k_rendererData = {
k_data: k_value,
k_iconCls: 'smallIcon trafficRules'
};
break;
case TrafficStatisticsType.TrafficStatisticsBandwidthRule:
k_rendererData = {
k_data: k_value,
k_iconCls: 'smallIcon bandwidthManagement'
};
break;
default:
k_rendererData = { k_data: k_value.name };
}
return k_rendererData;
}
}
].concat(kerio.waw.shared.k_DEFINITIONS.k_get('k_trafficStatisticsColumns'))
} };
k_grid = new kerio.waw.shared.k_widgets.K_AutorefreshGrid(k_localNamespace + 'grid', k_gridCfg);
k_formHistogram = new kerio.waw.shared.k_widgets.K_HistogramPane(k_localNamespace + 'histogram', {
k_manager: 'TrafficStatistics',
k_promptToSelect: k_tr('Select an interface or a rule to view the histogram', 'trafficStatisticsList'),
k_relatedGrid: k_grid,

k_getDataForCaption: function() {
var
k_dataForCaption,
k_selectedRow = this._k_relatedGrid.k_selectionStatus.k_rows[0],
TrafficStatisticsType = kerio.waw.shared.k_CONSTANTS.TrafficStatisticsType,
k_name;
if (!k_selectedRow) {
return this._k_dataForCaption;
}
k_name = {k_args: [k_selectedRow.k_data.name]};
switch (k_selectedRow.k_data.type) {
case TrafficStatisticsType.TrafficStatisticsInterface:
k_dataForCaption = kerio.lib.k_tr('Interface %1', 'trafficStatisticsList', k_name);
break;
case TrafficStatisticsType.TrafficStatisticsTrafficRule:
k_dataForCaption = kerio.lib.k_tr('Traffic rule %1', 'trafficStatisticsList', k_name);
break;
case TrafficStatisticsType.TrafficStatisticsBandwidthRule:
k_dataForCaption = kerio.lib.k_tr('Bandwidth management rule %1', 'trafficStatisticsList', k_name);
break;
}
this._k_dataForCaption = k_dataForCaption;
return k_dataForCaption;
}});
k_layoutCfg = {
k_detailsVisibilityProperty: k_grid.k_id + '.' + 'showDetails',
k_isVertical: true,
k_mainPaneContent: k_grid,
k_detailsPaneContent: k_formHistogram,
k_callbackDetailsVisible: k_getContent,

k_beforeApplyParams: function() {
var
k_currentScreen = kerio.waw.status.k_currentScreen,
k_params = { k_trafficChartId: k_currentScreen.k_getSwitchPageParam('k_trafficChartId'),
k_componentId: k_currentScreen.k_getSwitchPageParam('k_componentId'),
k_componentType: k_currentScreen.k_getSwitchPageParam('k_componentType')
};
this.k_grid.k_reloadData();
this.k_setDetailsVisible();
if (k_params.k_trafficChartId || k_params.k_componentId) {
this.k_preselectItem = k_params; if (!this.k_isDetailsVisible()) {
this.k_setDetailsVisible(true); }
}
},
k_iPad: {
k_onBeforeDetails: function(k_show) {
if (k_show && 0 === this.k_grid.k_selectionStatus.k_selectedRowsCount) {
return kerio.lib.k_tr('Please select an interface or rule to show the details.', 'trafficStatisticsList');
}
return true;
}
}
};
k_layout = new kerio.waw.shared.k_widgets.K_SplittedLayout(k_objectName, k_layoutCfg);
k_layout.k_addReferences({
k_getContent: k_getContent,
k_histogram: k_formHistogram,
k_grid: k_grid
});
this.k_addControllers(k_layout);
k_layout.k_addReferences({
k_preselectItem: null,
k_selectedId: ''
});
k_trCache = [];
k_trCache[k_shared.k_CONSTANTS.TrafficStatisticsType.TrafficStatisticsInterface] = k_tr('Interfaces', 'trafficStatisticsList');
k_trCache[k_shared.k_CONSTANTS.TrafficStatisticsType.TrafficStatisticsTrafficRule]   = k_tr('Traffic Rules (Internet traffic only)', 'trafficStatisticsList');
k_trCache[k_shared.k_CONSTANTS.TrafficStatisticsType.TrafficStatisticsBandwidthRule] = k_tr('Bandwidth Management Rules', 'trafficStatisticsList');
k_grid.k_addReferences({
k_layout: k_layout,
k_trCache: k_trCache,
k_deleteStatsRequest: {
k_jsonRpc: {
method: 'TrafficStatistics.remove'
},
k_callback: k_grid.k_deleteStatsCallback,
k_scope: k_grid
},
k_confirmDeleteStatsCfg: null
});
kerio.lib.k_registerObserver(k_grid, k_layout, [k_grid.k_eventTypes.k_SELECTION_CHANGED]);
return k_layout;
}, 
k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_update = function(k_sender) {
var
k_invalidSelection = true,
k_selection,
k_rowData,
k_matchingRows,
k_i, k_cnt;
if (k_sender && k_sender.k_isInstanceOf('K_Grid')) {
if (this.k_preselectItem) {
k_selection = this.k_preselectItem;
this.k_preselectItem = null;
if (k_selection.k_trafficChartId) {
k_matchingRows = k_sender.k_findRow('id', k_selection.k_trafficChartId);           k_sender.k_selectRows(k_matchingRows);                                             return;                                                                            }
else {
k_matchingRows = k_sender.k_findRow('componentId', k_selection.k_componentId);     if (k_matchingRows instanceof Array) { k_rowData = k_sender.k_getData();
for (k_i = 0, k_cnt = k_matchingRows.length; k_i < k_cnt; k_i++) {             if (k_rowData[k_matchingRows[k_i]].type === k_selection.k_componentType) { k_sender.k_selectRows(k_matchingRows[k_i]);
return;                                                                }
}
}
else {
}
}
}
else {
k_selection = k_sender.k_selectionStatus;
k_invalidSelection = 0 === k_selection.k_selectedRowsCount;
this.k_selectedId = '';
if (true !== k_invalidSelection) {
k_rowData = k_selection.k_rows[0].k_data;
this.k_selectedId = k_rowData.id;
this.k_getContent();
}
}
k_sender.k_disableUserActions(k_invalidSelection, k_rowData);
}
}; 
k_kerioWidget.k_grid.k_confirmDeleteStats = function(k_response) {
if ('no' === k_response) {
return;
}
var
k_rows = this.k_selectionStatus.k_rows,
k_ids = [],
k_i;
for (k_i = 0; k_i < k_rows.length; k_i++) {
k_ids.push(k_rows[k_i].k_data.id);
}
this.k_deleteStats(k_ids);
};

k_kerioWidget.k_grid.k_deleteStats = function(k_ids) {
this.k_disableRefreshGui(true);
this.k_runAutoRefresh(false);
this.k_deleteStatsRequest.k_jsonRpc.params =  { ids: k_ids };
kerio.lib.k_ajax.k_request(this.k_deleteStatsRequest);
};

k_kerioWidget.k_grid.k_deleteStatsCallback = function() {
this.k_reloadData();
};

k_kerioWidget.k_grid.k_disableUserActions = function(k_disable, k_data) {
var
TrafficStatisticsType = kerio.waw.shared.k_CONSTANTS.TrafficStatisticsType;
this.k_contextMenu.k_showItem('k_viewInterface', false);
this.k_contextMenu.k_showItem('k_viewTrafficRule', false);
this.k_contextMenu.k_showItem('k_viewBandwidthRule', false);
if ("object" === typeof k_data) {
switch (k_data.type) {
case TrafficStatisticsType.TrafficStatisticsInterface:
this.k_contextMenu.k_showItem('k_viewInterface', !k_disable);
break;
case TrafficStatisticsType.TrafficStatisticsTrafficRule:
this.k_contextMenu.k_showItem('k_viewTrafficRule', !k_disable);
break;
case TrafficStatisticsType.TrafficStatisticsBandwidthRule:
this.k_contextMenu.k_showItem('k_viewBandwidthRule', !k_disable);
break;
}
}
if (!this.k_isAuditor) { this.k_contextMenu.k_enableItem('k_deleteStats', !k_disable);
}
};

k_kerioWidget.k_onActivate = function() {
var
k_autorefresh = this.k_grid.k_getSavedAutoRefreshInterval();
this.k_grid.k_handleAutorefresh(k_autorefresh, true, true);
if (this.k_histogram.k_charts.k_canvas) {
this.k_histogram.k_charts.k_canvas.k_bypassDomRestore();
}
};

k_kerioWidget.k_onDeactivate = function() {
this.k_grid.k_initAutoRefreshTask(0);
if (this.k_histogram.k_charts.k_canvas) {
this.k_histogram.k_charts.k_canvas.k_bypassDomRelease();
}
};
} }; 