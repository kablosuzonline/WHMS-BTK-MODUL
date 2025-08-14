
kerio.waw.ui.configurationImportInterfaceEditor = {

k_init: function(k_objectName) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr, k_grid, k_gridCfg,
k_dialog, k_dialogCfg,
k_trUnassigned;
k_gridCfg = {
k_selectionMode: 'k_single',
k_emptyMsg: k_tr('No available interfaces', 'configurationImport'),
k_className: 'interfaceList undead', k_columns: {
k_sorting: false,
k_items: [
{
k_caption: k_tr('Name', 'common'),
k_columnId: 'item',
k_width: 190,

k_renderer: function(k_value, k_data) {
return kerio.waw.shared.k_methods.k_formatInterfaceName(k_data.id.name, k_data);
} },
{k_columnId: 'ip'  ,  k_caption: k_tr('IP Address', 'interfaceList')  , k_width: 100},
{k_columnId: 'MAC' ,  k_caption: k_tr('MAC', 'interfaceList')         , k_width: 130}
] },
k_onDblClick: this.k_sendData
}; k_grid = new kerio.lib.K_Grid(k_objectName + '_' + 'grid', k_gridCfg);
k_dialogCfg = {
k_width: 460,
k_height: 400,
k_title: k_tr('Select Interface', 'configurationImport'),
k_content: k_grid,
k_onOkClick: this.k_sendData,
k_defaultItem: null
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_trUnassigned = k_tr('<Unassigned>', 'interfaceList');
k_dialog.k_addReferences({
k_grid: k_grid,
k_parentGrid: null,
k_editedInterface: null,
k_importedInterfaces: null,
k_localInterfaces: null,
k_trUnassigned: k_trUnassigned,
k_unassignedRow: {
id:  {name: k_trUnassigned},
ip:  '',
MAC: '',
type: kerio.waw.shared.k_CONSTANTS.InterfaceType.k_UNASSIGNED
}
}); k_grid.k_addReferences({
k_dialog: k_dialog
}); this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {
var
k_grid = k_kerioWidget.k_grid,
k_toolbar = k_grid.k_toolbar;

k_kerioWidget.k_applyParams = function(k_params) {
this.k_parentGrid = k_params.k_parentGrid;
this.k_importedInterfaces = k_params.k_importedInterfaces;
this.k_localInterfaces = k_params.k_localInterfaces;
this.k_editedInterface = k_params.k_editedInterface;
this.k_grid.k_setData([this.k_unassignedRow]);
this.k_grid.k_setData(k_params.k_localInterfaces, true);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); }; k_kerioWidget.k_addReferences({
k_resetOnClose: this.k_resetOnClose
});
}, 
k_resetOnClose: function() {
this.k_grid.k_setData([]);
}, 
k_sendData: function() {
var
k_dialog = this.k_parentWidget, k_grid = k_dialog.k_grid,
k_parentGrid = k_dialog.k_parentGrid,
k_selectionStatus = k_grid.k_selectionStatus,
k_selectedRow,
k_selectedInterface,
k_selectedInterfaceIndex,
k_editedInterface,
k_editedInterfaceCurrent,
k_editedInterfaceIndex,
k_currentInterface,
k_rowData;
if (0 === k_selectionStatus.k_selectedRowsCount) {
kerio.lib.k_alert(
kerio.lib.k_tr('Select Interface', 'configurationImport'),
kerio.lib.k_tr('Please select an interface.', 'configurationImport')
);
k_dialog.k_hideMask();
return;
}
k_selectedRow = k_selectionStatus.k_rows[0];
k_selectedInterface = k_selectedRow.k_data;
k_editedInterface = k_dialog.k_editedInterface;
k_editedInterfaceCurrent = k_editedInterface.k_data.currentInterface;
k_editedInterfaceIndex = k_editedInterface.k_rowIndex;
if (undefined !== k_selectedInterface.k_index) {
k_currentInterface = k_dialog.k_importedInterfaces[k_selectedInterface.k_index].currentInterface;
delete k_currentInterface.k_index;
k_rowData = k_parentGrid.k_getRowsData(false)[k_editedInterfaceIndex];
delete k_rowData.currentInterface.k_index;
k_parentGrid.k_updateRow(k_rowData, k_editedInterfaceIndex);
}
if (undefined !== k_editedInterfaceCurrent.k_index) {
delete k_dialog.k_localInterfaces[k_editedInterfaceCurrent.k_index].k_index;
delete k_dialog.k_importedInterfaces[k_editedInterface.k_rowIndex].currentInterface.k_index;
delete k_editedInterfaceCurrent.k_index;
}
if (0 < k_selectedRow.k_rowIndex) {
k_selectedInterfaceIndex = k_selectedRow.k_rowIndex - 1;
k_editedInterfaceCurrent.k_index = k_selectedInterfaceIndex;
k_dialog.k_importedInterfaces[k_editedInterfaceIndex].currentInterface.k_index = k_selectedInterfaceIndex;
k_selectedInterface.k_index = k_editedInterfaceIndex;
k_dialog.k_localInterfaces[k_selectedInterfaceIndex].k_index = k_editedInterfaceIndex;
}
k_dialog.k_parentGrid.k_refresh(); k_dialog.k_hide();
} }; 