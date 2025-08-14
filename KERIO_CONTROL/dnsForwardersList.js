
kerio.waw.ui.dnsForwardersList = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_dialog, k_dialogCfg,
k_grid, k_gridCfg;
k_gridCfg = {
k_isAuditor: k_isAuditor,
k_isApplyResetUsed: false,
k_selectionMode: 'k_multi',
k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'dnsForwarderEditor'
}
}
},
k_columns: {
k_sorting: false,
k_items: [
{
k_columnId: 'enabled',
k_isDataOnly: true },
{
k_columnId: 'domain',
k_caption: k_tr('DNS Name/Network', 'dnsForwardersList'),
k_width: 175,
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'enabled'
}
},
{
k_columnId: 'forwarders',
k_caption: k_tr('DNS Server(s)', 'dnsForwardersList'),

k_renderer: function(k_value) {
return {
k_data: ('' === k_value) ? this.k_noForwardTxt : this.k_addSpacesAroundDelimiters(k_value),
k_className: ('' === k_value) ? 'dnsNoForward' : ''
};
}
}
]
}
};
k_grid = new kerio.waw.shared.k_widgets.K_SimpleRulesGrid(k_localNamespace + 'grid', k_gridCfg);
k_dialogCfg = {
k_height: 300,
k_title: k_tr('Custom DNS Forwarding', 'dnsForwardersList'),
k_content: k_grid,
k_defaultItem: null,

k_onOkClick: function(k_toolbar){
k_toolbar.k_dialog.k_saveData();
}
};
k_dialog = new k_lib.K_Dialog(k_objectName, kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_isAuditor: k_isAuditor,
k_grid: k_grid,
k_saveCallback: null,
k_parentWidget: null
});
k_grid.k_addReferences({
k_noForwardTxt: k_tr('Do not forward', 'dnsForwardersList'),
k_addSpacesAroundDelimiters: kerio.waw.shared.k_methods.k_addSpacesAroundDelimiters
});
this.k_addControllers(k_dialog);
if (!k_isAuditor) {
k_grid.k_toolbars.k_bottom.k_dialogs.k_additionalParams = ({
k_callback: k_grid.k_saveRow.createDelegate(k_grid, [], true) });
}
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
this.k_grid.k_setData(k_params.k_data);
this.k_grid.k_startTracing();
this.k_saveCallback = k_params.k_callback;
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_dialogs: ['dnsForwarderEditor']
});
};

k_kerioWidget.k_saveData = function() {
var
k_data = this.k_grid.k_getData(),
k_seachData = kerio.lib.k_cloneObject(k_data),
k_cnt = k_data.length,
k_i;
for (k_i = 0; k_i < k_cnt - 1; k_i++) {
k_seachData.splice(0, 1);
if (true === this.k_grid.k_lookForDuplicate(k_data[k_i], k_seachData)) {
this.k_hideMask();
this.k_grid.k_selectRows(k_i);
return;
}
}
if (this.k_saveCallback(k_data)) {
this.k_hide();
}
};

k_kerioWidget.k_grid.k_saveRow = function(k_rowData, k_rowIndex) {
if (undefined === k_rowIndex) {
if (this.k_lookForDuplicate(k_rowData)) {
return false;
}
k_rowData.enabled = true; k_rowIndex = this.k_selectionStatus.k_selectedRowsCount ? this.k_selectionStatus.k_rows[0].k_rowIndex + 1 : 0;
this.k_addRow(k_rowData, k_rowIndex);
}
else {
this.k_updateRow(k_rowData, k_rowIndex);
}
return true;
};

k_kerioWidget.k_grid.k_lookForDuplicate = function(k_rowData, k_searchData) {
var
k_lib = kerio.lib,
k_gridData = k_searchData || this.k_getData(),
k_domain = k_rowData.domain,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_gridData.length; k_i < k_cnt; k_i++) {
if (k_gridData[k_i].domain === k_domain) {
k_lib.k_alert(
k_lib.k_tr('Validation Warning', 'common'),
k_lib.k_tr('DNS Name/Network "%1" already exists.', 'dnsForwardersList',
{ k_args: [k_domain] }
)
);
return true;
}
}
return false;
};

k_kerioWidget.k_resetOnClose = function() {
this.k_grid.k_stopTracing();
this.k_grid.k_clearData();
};
} }; 