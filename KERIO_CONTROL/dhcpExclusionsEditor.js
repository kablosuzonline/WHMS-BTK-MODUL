
kerio.waw.ui.dhcpExclusionsEditor = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_gridCfg,
k_grid,
k_dialogCfg,
k_dialog;
k_gridCfg = { k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'dhcpExclusionRowEditor'
},
k_items: [{
k_type: 'K_GRID_DEFAULT'
}]
}
},
k_title: k_tr('Current scope: %1 - %2', 'dhcpExclusionsEditor', {k_args: ['0.0.0.0','0.0.0.0']}), k_className: 'gridWithSimpleTextAbove',
k_isReadOnly: k_isAuditor,
k_columns: {
k_sorting: {
k_columnId: 'ipStartRenderer'
},
k_items: [
{
k_columnId: 'ipStart',
k_isDataOnly: true
},
{
k_columnId: 'ipEnd',
k_isDataOnly: true
},
{
k_columnId: 'ipStartRenderer',
k_caption: k_tr('From', 'dhcpExclusionsEditor'),
k_renderer: function(k_value, k_data) {
k_data.ipStartRenderer = kerio.waw.shared.k_methods.k_ipToNumber(k_data.ipStart);
return { k_data: k_data.ipStart};
}
},
{
k_columnId: 'ipEndRenderer',
k_caption: k_tr('To', 'dhcpExclusionsEditor'),
k_renderer: function(k_value, k_data) {
k_data.ipEndRenderer = kerio.waw.shared.k_methods.k_ipToNumber(k_data.ipEnd);
return { k_data: k_data.ipEnd};
}
},
{
k_columnId: 'description',
k_caption: k_tr('Description', 'common')
}
]
}
}; if (k_isAuditor) {
k_gridCfg.k_toolbars.k_bottom.k_items = [];
}
k_grid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'grid', k_gridCfg);
k_dialogCfg = {
k_width: 450,
k_height: 450,
k_title: k_tr('Exclusions', 'dhcpExclusionsEditor'),
k_content: k_grid,
k_defaultItem: null,

k_onOkClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData.call(k_toolbar.k_dialog);
} }; k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_grid: k_grid
}); k_grid.k_addReferences({
k_dialog: k_dialog
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
var
k_data = k_params.k_data,
k_grid = this.k_grid;
this.k_dataStore = k_data;
this.k_parent = k_params.k_parent;
if (k_data.exclusions) {
k_grid.k_setData(k_data.exclusions);
}
k_grid.k_startTracing();
k_grid.k_setTitle(kerio.lib.k_tr('Current scope: %1 - %2', 'dhcpExclusionsEditor', { k_args: [k_data.ipStart, k_data.ipEnd] }));
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_dialogs: ['dhcpExclusionRowEditor']
});
}; 
k_kerioWidget.k_sendData = function(){
var
k_data = this.k_grid.k_getData(),
k_dataStore = this.k_dataStore,
k_ipStart = k_dataStore.ipStart,
k_ipEnd   = k_dataStore.ipEnd,
k_lib = kerio.lib,
k_isIpRange = kerio.waw.shared.k_methods.k_validators.k_isIpRange,
k_i, k_cnt,
k_exclusion;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_exclusion = k_data[k_i];
if (!k_isIpRange(k_ipStart, k_exclusion.ipStart, true) || !k_isIpRange(k_exclusion.ipEnd, k_ipEnd, true)) {
k_lib.k_alert(
k_lib.k_tr('Invalid Range', 'common'),
k_lib.k_tr('Exclusion %1 - %2 is out of the current scope.', 'dhcpExclusionsEditor',
{ k_args: [k_exclusion.ipStart, k_exclusion.ipEnd] }
)
);
this.k_hideMask();kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
} delete k_exclusion.ipStartRenderer;  delete k_exclusion.ipEndRenderer;
} k_dataStore.exclusions = k_data;
this.k_hide();
}; 
k_kerioWidget.k_resetOnClose = function() {
this.k_grid.k_stopTracing();
this.k_grid.k_clearData();
}; } }; 