
kerio.waw.ui.antivirusOptionsEditor = {

k_init: function(k_objectName){
var
k_gridCfg,
k_grid,
k_dialogCfg,
k_dialog,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_lib = kerio.lib,
k_tr = k_lib.k_tr;
k_gridCfg = {
k_selectionMode: 'k_single',
k_isReadOnly: k_isAuditor,
k_columns: {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_sorting: false,
k_items: [
{
k_caption: k_tr('Name', 'antivirusOptionsEditor'),
k_columnId: 'name',
k_width: 150
},
{
k_caption: k_tr('Value', 'antivirusOptionsEditor'),
k_columnId: 'content',
k_editor: {
k_type: 'k_text',
k_maxLength: 255,
k_checkByteLength: true
}
},
{
k_columnId: 'defaultValue',
k_isDataOnly: true
}
]
}
};
k_grid = new k_lib.K_Grid(k_objectName + '_' + 'grid', k_gridCfg);
k_dialogCfg = {
k_height: 240,
k_width: 350,
k_minHeight: 240,
k_minWidth: 350,
k_title: k_tr('Antivirus Options', 'antivirusOptionsEditor'),
k_content: k_grid,
k_buttons: [
{
k_id: 'k_btnDefault',
k_caption: k_tr('Default', 'common'),
k_isHidden: k_isAuditor,
k_isDisabled: true,

k_onClick: function(k_toolbar) {
if (0 === k_toolbar.k_dialog.k_grid.k_selectedRowsCount) {
return;
}
var k_row = k_toolbar.k_dialog.k_grid.k_selectionStatus.k_rows[0]; k_toolbar.k_dialog.k_grid.k_updateRow({content: k_row.k_data.defaultValue}, k_row.k_rowIndex);
}
},
'->',
{
k_isDefault: !k_isAuditor,
k_id: 'k_btnOK',
k_caption: k_tr('OK', 'common'),
k_isHidden: k_isAuditor,
k_mask: {
k_message: k_tr('Saving…', 'common')
},

k_onClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_saveData();
}
},
{
k_isCancel: true,
k_isDefault: k_isAuditor,
k_id: 'k_btnCancel',
k_caption: (k_isAuditor) ? k_tr('Close', 'common') : k_tr('Cancel', 'common')
}
] };
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_grid: k_grid
});
k_grid.k_addReferences({
k_dialog: k_dialog
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function (k_kerioWidget) {
if (!kerio.waw.shared.k_methods.k_isAuditor()) {

k_kerioWidget.k_toolbar.k_update = function(k_sender) {
if (k_sender && k_sender.k_isInstanceOf('K_Grid')) {
var k_selected = k_sender.k_selectionStatus.k_selectedRowsCount;
k_sender.k_dialog.k_toolbar.k_enableItem('k_btnDefault', 0 !== k_selected);
}
};
kerio.lib.k_registerObserver(k_kerioWidget.k_grid, k_kerioWidget.k_toolbar);
}

k_kerioWidget.k_applyParams = function(k_params) {
this.k_dataStore = k_params.k_pluginOptions;
this.k_grid.k_setData(k_params.k_pluginOptions);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };

k_kerioWidget.k_saveData = function() {
var
k_data = this.k_grid.k_getData(),
k_options = this.k_dataStore,
k_i, k_j, k_cnt;
k_cnt = k_options.length; for (k_i = 0; k_i < k_cnt; k_i++) {
for (k_j =0; k_j < k_cnt; k_j++) {
if (k_data[k_j] && k_data[k_j].name === k_options[k_i].name) {
k_options[k_i].content = k_data[k_j].content;
delete k_data[k_j]; break;
}
}
}
kerio.adm.k_framework.k_enableApplyReset();
this.k_hide();
};

k_kerioWidget.k_update = function(k_sender) {
var
k_valueChanged = false,
k_selectionStatus = k_sender.k_selectionStatus,
k_rowData;
if (0 < k_selectionStatus.k_selectedRowsCount) {
k_rowData = k_selectionStatus.k_rows[0].k_data;
k_valueChanged = k_rowData.content !== k_rowData.defaultValue;
}
this.k_enableItem('k_btnDefault', k_valueChanged);
};

k_kerioWidget.k_resetOnClose = function() {
this.k_grid.k_clearData();
};
}
};
