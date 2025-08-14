
kerio.waw.ui.urlSettingsList = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_toolbarsCfg = {},
k_dialog, k_dialogCfg,
k_grid, k_gridCfg;
if (!k_isAuditor) {
k_toolbarsCfg = {
k_bottom: {
k_dialogs: {
k_sourceName: 'urlSettingsEditor'
},
k_items: [
{
k_type: 'K_GRID_DEFAULT',

k_onAdd: function() {
var
k_dialog = this.k_parentWidget.k_parentWidget;
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'urlSettingsEditor',
k_objectName: 'urlSettingsEditorAdd',
k_params: {
k_callback: k_dialog.k_editTtlCallback.createDelegate(k_dialog.k_grid)
}
});
},

k_onEdit: function() {
var
k_dialog = this.k_parentWidget.k_parentWidget,
k_selectedRow = k_dialog.k_grid.k_selectionStatus.k_rows[0];
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'urlSettingsEditor',
k_objectName: 'urlSettingsEditorEdit',
k_params: {
k_callback: k_dialog.k_editTtlCallback.createDelegate(k_dialog.k_grid),
k_data: k_selectedRow.k_data,
k_rowIndex: k_selectedRow.k_rowIndex
}
});
}
}
]
}
};
}
k_gridCfg = {
k_autoExpandColumn: 'description',
k_isReadOnly: k_isAuditor,
k_toolbars: k_toolbarsCfg,
k_columns: {
k_items: [
{
k_columnId: 'url',
k_caption: k_tr('URL', 'urlSettingsList'),
k_width: 120
},
{
k_columnId: 'ttl',
k_caption: k_tr('TTL', 'urlSettingsList') + ' (' + k_tr('hours', 'urlSettingsList') + ')'
},
{
k_columnId: 'description',
k_caption: k_tr('Description', 'common')
}
]
}
};
k_grid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'grid', k_gridCfg);
k_dialogCfg = {
k_height: 300,
k_title: k_tr('URL Specific Settings', 'urlSettingsList'),
k_content: k_grid,
k_defaultItem: null, 
k_onOkClick: function(k_toolbar){
var
k_dialog = k_toolbar.k_parentWidget;
k_dialog.k_saveCallback(k_dialog.k_grid.k_getData());
k_dialog.k_hide();
} }; k_dialog = new k_lib.K_Dialog(k_objectName, kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_grid: k_grid
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
this.k_grid.k_setData(k_params.k_data);
this.k_saveCallback = k_params.k_callback;
this.k_grid.k_startTracing();
};
k_kerioWidget.k_editTtlCallback = function(k_data, k_editedRowIndex) {
var
k_isEditMode = undefined !== k_editedRowIndex,
k_ttlSettingsStore = this.k_getData(),
k_lib = kerio.lib,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_ttlSettingsStore.length; k_i < k_cnt; k_i++) {
if (k_isEditMode && k_editedRowIndex === k_i) {
continue;}
if (k_data.url === k_ttlSettingsStore[k_i].url) {
k_lib.k_alert(
k_lib.k_tr('Validation Warning', 'common'),
k_lib.k_tr('TTL for URL "%1" has already been defined.', 'urlSettingsList',
{ k_args: [k_data.url] }
)
);
return false;
}
}
if (k_isEditMode) {
this.k_updateRow(k_data, k_editedRowIndex);
this.k_resortRows();
} else {
this.k_setData([k_data], {k_append: true, k_keepSelection: true});
}
return true;
};

k_kerioWidget.k_resetOnClose = function() {
this.k_grid.k_stopTracing();
this.k_grid.k_clearData();
};
} }; 