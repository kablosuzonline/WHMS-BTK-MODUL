
kerio.waw.ui.connectionsList = {
k_init: function(k_objectName) {
var
k_tr = kerio.lib.k_tr,
k_localNamespace = k_objectName + '_',
k_formCfg, k_form,
k_layoutCfg, k_layout,
k_connectionsPane,
k_getContent,
k_grid;
k_connectionsPane = new kerio.waw.shared.k_widgets.K_ConnectionsPane(k_localNamespace + 'connectionsPane');
k_grid = k_connectionsPane.k_grid;
k_formCfg = {
k_labelWidth: 190,
k_className: 'selectable',
k_items: [
{
k_type: 'k_display',
k_id: 'k_textSelectConnection',
k_isLabelHidden: true,
k_value: k_tr('Select a connection to view its details', 'connectionsList')
},
{
k_type: 'k_display',
k_id: 'k_textConnectionNotFound',
k_isLabelHidden: true,
k_value: k_tr('There is no data for such connection.', 'connectionsList'),
k_isVisible: false
},
{
k_type: 'k_fieldset',
k_id: 'k_fieldsetConnectionInfo',
k_itemClassName: 'selectable',
k_caption: k_tr('Connection information', 'connectionsList'),
k_isVisible: false,
k_items: [
{
k_type: 'k_columns',
k_items: [
{
k_type: 'k_container',
k_width: '50%',
k_items: [
{
k_type: 'k_display',
k_id: 'sourceIp',
k_isSecure: true,
k_itemClassName: 'selectable',
k_caption: k_tr('Source IP:', 'connectionsList'),
k_value: ''
},
{
k_type: 'k_display',
k_id: 'sourceHostname',
k_itemClassName: 'selectable',
k_caption: k_tr('Source hostname:', 'connectionsList'),
k_value: ''
},
{
k_type: 'k_display',
k_id: 'sourceCountry',
k_itemClassName: 'selectable',
k_caption: k_tr('Source country:', 'connectionsList'),
k_value: ''
}
]
},
{
k_type: 'k_container',
k_width: '50%',
k_items: [
{
k_type: 'k_display',
k_id: 'destinationIp',
k_isSecure: true,
k_itemClassName: 'selectable',
k_caption: k_tr('Destination IP:', 'connectionsList'),
k_value: ''
},
{
k_type: 'k_display',
k_id: 'destinationHostname',
k_isSecure: true,
k_itemClassName: 'selectable',
k_caption: k_tr('Destination hostname:', 'connectionsList'),
k_value: ''
},
{
k_type: 'k_display',
k_id: 'destinationCountry',
k_itemClassName: 'selectable',
k_caption: k_tr('Destination country:', 'connectionsList'),
k_value: ''
}
]
}
]
}
]
}
]
};
if (kerio.lib.k_isIPadCompatible) {
this.k_modifyForIPad(k_formCfg);
}
k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);

k_getContent = function() {
if (!this.k_isDetailsVisible()) {
return; }
this.k_form.k_loadData();
this.k_form.k_grid.k_setPageSize(0, false); if (false === this.k_form.k_isFormatted) {
this.k_form.k_isFormatted = true;
this.k_form.k_extWidget.doLayout();
}
};
k_layoutCfg = {
k_className: 'activeItemsList',
k_detailsVisibilityProperty: k_grid.k_id + '.' + 'showDetails',
k_isVertical: true,
k_mainPaneContent: k_connectionsPane,
k_detailsPaneContent: k_form,
k_detailsPaneIniSize: 135,
k_callbackDetailsVisible: k_getContent,
k_beforeApplyParams: function() {
this.k_grid.k_reloadData();
this.k_setDetailsVisible();
},
k_iPad: {
k_onBeforeDetails: function(k_show) {
if (k_show && 0 === this.k_grid.k_selectionStatus.k_selectedRowsCount) {
return kerio.lib.k_tr('Please select a connection to show the details.', 'connectionsList');
}
return true;
}
}
};
k_layout = new kerio.waw.shared.k_widgets.K_SplittedLayout(k_objectName, k_layoutCfg);
k_layout.k_addReferences({
k_getContent: k_getContent,
k_grid: k_grid,
k_form: k_form
});
k_form.k_addReferences({
k_grid: k_grid,
k_isFormatted: false
});
this.k_addControllers(k_layout);
kerio.lib.k_registerObserver(k_grid, k_layout, [k_grid.k_eventTypes.k_SELECTION_CHANGED]);
return k_layout;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_update = function(k_sender) {
var
k_selection,
k_invalidSelection;
if (k_sender && k_sender.k_isInstanceOf('K_Grid')) {
k_selection = k_sender.k_selectionStatus;
k_invalidSelection = 0 === k_selection.k_selectedRowsCount;
if (!k_invalidSelection) {
this.k_showDetails();
this.k_getContent();
}
}
};

k_kerioWidget.k_form.k_loadData = function() {
var
k_MAP_COUNTRIES = kerio.waw.shared.k_DEFINITIONS.k_MAP_COUNTRIES,
k_grid = this.k_grid,
k_gridData,
k_data;
if (0 === k_grid.k_selectionStatus.k_selectedRowsCount) {
return;
}
k_gridData = k_grid.k_selectionStatus.k_rows[0].k_data;
k_data = {
sourceHostname:		k_gridData.src.host,
sourceIp:			k_gridData.src.ip,
sourceCountry:		k_gridData.src.country ? k_MAP_COUNTRIES[k_gridData.src.country].k_name : 'N/A',
destinationHostname:k_gridData.dst.host,
destinationIp:		k_gridData.dst.ip,
destinationCountry:	k_gridData.dst.country ? k_MAP_COUNTRIES[k_gridData.dst.country].k_name : 'N/A'
};
this.k_setData(k_data);
};

k_kerioWidget.k_setAutoRefreshInterval = function(k_interval, k_startDeferred, k_avoidUserSettings) {
this.k_grid.k_handleAutorefresh(k_interval, k_startDeferred, k_avoidUserSettings);
};

k_kerioWidget.k_showDetails = function(k_isVisible) {
k_isVisible = false !== k_isVisible;
this.k_form.k_setVisible(['k_textSelectConnection'], !k_isVisible);
this.k_form.k_setVisible(['k_textConnectionNotFound'], false);
this.k_form.k_setVisible(['k_fieldsetConnectionInfo'], k_isVisible);
};

k_kerioWidget.k_onActivate = function() {
var
k_autorefresh = this.k_grid.k_getSavedAutoRefreshInterval();
this.k_grid.k_handleAutorefresh(k_autorefresh, true, true);
};

k_kerioWidget.k_onDeactivate = function() {
this.k_grid.k_initAutoRefreshTask(0);
};
},

k_modifyForIPad: function(k_formCfg) {
var
k_fieldset, k_fieldsets,
k_row, k_rows,
k_columns,
k_i, k_j;
k_fieldsets = k_formCfg.k_items;
for (k_i = 0; k_i < k_fieldsets.length; k_i++) {
k_fieldset = k_fieldsets[k_i];
k_rows = k_fieldset.k_items;
if ('k_fieldset' !== k_fieldset.k_type || !k_rows) {
continue;
}
for (k_j = 0; k_j < k_rows.length; k_j++) {
k_row = k_rows[k_j];
k_columns = k_row.k_items;
if (('k_row' !== k_row.k_type && 'k_columns' !== k_row.k_type)|| !k_columns) {
continue;
}
k_rows = k_rows.slice(0,k_j).concat(k_columns, k_rows.slice(k_j + 1));
k_j += k_columns.length - 1;
} k_fieldset.k_items = k_rows;
} }
}; 