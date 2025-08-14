
kerio.waw.ui.dnsHostsEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_get = kerio.waw.shared.k_DEFINITIONS.k_get,
k_dialog, k_dialogCfg,
k_statusbarCfg, k_statusbar,
k_grid, k_gridCfg,
k_findField;
if (!k_isAuditor) {
k_statusbarCfg = {
k_configurations: {
k_default: {
k_text: k_tr('Use semicolons ( ; ) to separate individual hostnames in a row.', 'dnsHostsEditor')
}
},
k_defaultConfig: 'k_default'
}; k_statusbar = new kerio.lib.K_Statusbar(k_localNamespace + 'k_statusbar', k_statusbarCfg);
}
k_gridCfg = {
k_statusbar: k_isAuditor ? undefined : k_statusbar,
k_isReadOnly: k_isAuditor,
k_isDragDropRow: true,
k_columns: {
k_sorting: false, k_items: [
{
k_columnId: 'enabled',
k_isDataOnly: true
},
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'ip',
k_caption: k_tr('IP Address', 'common'),
k_width: 120,
k_renderer: function(k_value) {
return {
k_data: this.k_highlightSearchValueRenderer(k_value),
k_isSecure: true
};
},
k_editor: [
{
k_type: 'k_checkbox',
k_columnId: 'enabled'
},
{
k_type: 'k_text',
k_maxLength: 15,
k_validator: {
k_functionName: 'k_isIpAddress',
k_allowBlank: false,
k_inputFilter:  kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
}
]
},
{
k_columnId: 'hosts',
k_caption: k_tr('Hostnames', 'dnsHostsEditor'),
k_width: 150,
k_renderer: function(k_value) {
return {
k_data: this.k_highlightSearchValueRenderer(k_value),
k_isSecure: true
};
},
k_editor: {
k_type: 'k_text',
k_maxLength: 1023,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isHostsList'
}
}
},
{
k_columnId: 'description',
k_caption: k_tr('Description', 'common'),
k_renderer: function(k_value) {
return {
k_data: this.k_highlightSearchValueRenderer(k_value),
k_isSecure: true
};
},
k_editor: {
k_type: 'k_text',
k_maxLength: 255,
k_checkByteLength: true
}
}
]},k_toolbars: {}
};if (!k_isAuditor) {
k_gridCfg.k_toolbars = {
k_right: kerio.waw.shared.k_DEFINITIONS.k_get('k_moveRowsToolbar'),
k_bottom: {
k_items: [
k_get('k_editorGridBtnAdd'),
k_get('k_editorGridBtnRemove'),
k_get('k_editorGridBtnDuplicate', {
k_editColumn: 'ip',
k_onAfterDuplicate: false })
],

k_update: function(k_sender, k_event){
if (kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED === k_event.k_type) {
var k_selected = k_sender.k_selectionStatus;
this.k_enableItem('k_btnRemove', 0 < k_selected.k_selectedRowsCount);
this.k_enableItem('k_btnDuplicate', 1 === k_selected.k_selectedRowsCount);
}
} }
};
}
k_gridCfg.k_toolbars.k_top = {
k_items: ['->']
};
k_grid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'dnsHostsGrid', k_gridCfg);
k_findField = new kerio.waw.shared.k_widgets.K_FindField(k_localNamespace + 'k_findField', {
k_grid: k_grid
});
k_grid.k_toolbars.k_top.k_addWidget(k_findField, 1);
k_grid.k_addReferences({

k_removeItem: function() {
this.k_removeSelectedRows();
},
k_addItem: function(k_newItemIndex) {
this.k_startCellEdit(k_newItemIndex, 'ip');
},k_newItemDefinition: 'k_newHostsItem',
k_highlightSearchValueRenderer: kerio.waw.shared.k_methods.k_renderers.k_highlightSearchValueRenderer
});
k_dialogCfg = {
k_height: 340,
k_title: k_tr('DNS Hosts Editor', 'dnsHostsEditor'),
k_content: k_grid,
k_defaultItem: null,

k_onOkClick: function(k_toolbar){
k_toolbar.k_dialog.k_saveData();
} }; k_dialog = new k_lib.K_Dialog(k_objectName, kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences(
{
k_grid: k_grid,
k_findField: k_findField
}
);
this.k_addControllers(k_dialog); return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
this.k_grid.k_setData(k_params.k_hosts);
this.k_grid.k_startTracing();
this.k_saveCallback = k_params.k_callback;
this.k_findField.k_reset();
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };
k_kerioWidget.k_saveData = function() {
this.k_saveCallback.defer(100, this, [this.k_grid.k_getData()]);
this.k_hide();
};
k_kerioWidget.k_enableSelected = function(k_menu, k_menuItem) {
var
k_mergeObjects = kerio.waw.shared.k_methods.k_mergeObjects,
k_grid = this.k_relatedWidget,
k_data = {enabled: true},
k_i, k_cnt,
k_rows;
if(0 === k_grid.k_selectionStatus.k_selectedRowsCount) {
return;
}
k_rows = k_grid.k_selectionStatus.k_rows;
if ('k_btnDisable' === k_menuItem.k_name) {
k_data.enabled = false;
}
for (k_i = 0, k_cnt = k_rows.length; k_i < k_cnt; k_i++) {
k_mergeObjects(k_data, k_rows[k_i].k_data);
}
k_grid.k_refresh();
};
k_kerioWidget.k_resetOnClose = function() {
this.k_grid.k_stopTracing();
}; } }; 