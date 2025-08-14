
kerio.waw.ui.interfaceManagePortsEditor = {

k_init: function(k_objectName) {
var
k_shared = kerio.waw.shared,
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_boxModel = k_shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.boxEdition,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_isBox = kerio.waw.shared.k_methods.k_isBoxEdition(),
k_boxClass,
k_openPortEditor,
k_grid, k_gridCfg,
k_form, k_formCfg,
k_dialog, k_dialogCfg;

k_openPortEditor = function(k_caller) {
var
k_selectedRow,
k_grid = k_caller;
if ( !(k_caller instanceof kerio.lib.K_Grid)) {
k_grid = k_caller.k_dialog.k_grid;
}
if (0 === k_grid.k_selectionStatus.k_selectedRowsCount) {
return;
}
k_selectedRow = k_grid.k_selectionStatus.k_rows[0];
if (undefined === k_selectedRow || undefined === k_selectedRow.k_data) {
return;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'interfacePortEditor',
k_params: {
k_data: k_selectedRow.k_data,
k_rowIndex: k_selectedRow.k_rowIndex,
k_parentWidget: k_grid
}
});
};
k_gridCfg = {
k_selectionMode: 'k_single',
k_isReadOnly: k_isAuditor,
k_localData: [],
k_onDblClick: k_openPortEditor,
k_columns: {
k_sorting: true,
k_items: [
{k_columnId: 'id', k_isDataOnly: true},
{k_columnId: 'type', k_isDataOnly: true},
{
k_columnId: 'name',
k_caption: k_tr('Port Name', 'interfaceManagePortsEditor'),
k_width: 120
},
{
k_columnId: 'speedDuplex',
k_caption: k_tr('Speed and Duplex', 'interfaceManagePortsEditor'),
k_width: 260,

k_renderer: function(k_speedId, k_rowData) {
var
k_speedDuplexTypeNames = kerio.waw.shared.k_DEFINITIONS.k_SPEED_DUPLEX_TYPE_NAMES,
k_speedDuplexMayNotWork = k_rowData.speedDuplexMayNotWork || [],
k_i, k_cnt;
for (k_i = 0, k_cnt = k_speedDuplexMayNotWork.length; k_i < k_cnt; k_i++) {
if (k_speedId === k_speedDuplexMayNotWork[k_i]) {
k_speedDuplexTypeNames = kerio.waw.shared.k_DEFINITIONS.k_SPEED_DUPLEX_TYPE_NAMES_UNSUPPORTED;
break;
}
}
return {
k_data: k_speedDuplexTypeNames[k_speedId].name
};
}
},
{
k_columnId: 'assignment',
k_isDataOnly: !k_shared.k_methods.k_isBoxEdition(),
k_caption: k_tr('Assigned To', 'interfaceManagePortsEditor'),

k_renderer: function(k_value) {
var
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
PortAssignmentType = k_CONSTANTS.PortAssignmentType,
k_PORT_ASSIGNMENT_TYPE_NAMES = k_shared.k_DEFINITIONS.k_PORT_ASSIGNMENT_TYPE_NAMES,
k_text = '';
switch (k_value) {
case PortAssignmentType.PortAssignmentSwitch:
case PortAssignmentType.PortAssignmentStandalone:
case PortAssignmentType.PortAssignmentUnassigned:
k_text = k_PORT_ASSIGNMENT_TYPE_NAMES[k_value];
break;
default:
kerio.lib.k_reportError('Internal error: unknown port assignment type.', 'interfaceManagePortsEditor', 'k_renderer');
break;
}
return {
k_data: k_text
};
}
}, {
k_columnId: 'vlans',
k_caption: k_tr('VLANs', 'interfaceManagePortsEditor'),

k_renderer: function(k_data, k_rowData) {
return {
k_data: (k_data.enabled && kerio.waw.shared.k_CONSTANTS.PortAssignmentType.PortAssignmentStandalone === k_rowData.assignment ? k_data.value : '')
};
}
}
] } }; k_grid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'grid', k_gridCfg);
if (k_isBox) {
switch (k_boxModel) {
case k_CONSTANTS.bigBox1:
case k_CONSTANTS.bigBox2:
case k_CONSTANTS.bigBox3:
k_boxClass = 'box8';
break;
case k_CONSTANTS.bigBox4:
k_boxClass = 'bigBox4';
break;
case k_CONSTANTS.smallBox2:
k_boxClass = 'box6';
break;
case k_CONSTANTS.smallBox3:
k_boxClass = 'smallBox2'; break;
case k_CONSTANTS.smallBox1:
k_boxClass = 'box4';
break;
case k_CONSTANTS.tinyBox1:
k_boxClass = 'box3';
break;
case k_CONSTANTS.box_id_ng110:
k_boxClass = 'box_id_ng110';
break;
case k_CONSTANTS.box_id_ng310:
k_boxClass = 'box_id_ng310';
break;
case k_CONSTANTS.box_id_ng510:
k_boxClass = 'box_id_ng510';
break;
case k_CONSTANTS.box_id_ng511:
k_boxClass = 'box_id_ng511';
break;
}
}
k_formCfg = {
k_className: 'managePorts',
k_items: [
{
k_type: 'k_display',
k_className: k_boxClass + ' boxConnections',
k_height: 120,
k_isLabelHidden: true,
k_value: ' ',
k_isHidden: !k_isBox
},
{
k_type: 'k_container',
k_anchor: "0 -120",
k_minHeight: 100,
k_content: k_grid
}
]
};
k_form = new kerio.lib.K_Form(k_localNamespace + 'form', k_formCfg);
k_dialogCfg = {
k_isAuditor: k_isAuditor,
k_title: k_isAuditor ? k_tr('View Ports', 'interfaceManagePortsEditor') : k_tr('Manage Ports', 'interfaceManagePortsEditor'),
k_content: k_form,
k_height: 400,
k_width: 600,
k_buttons: [
{
k_id: 'k_btnEdit',
k_caption: k_tr('Edit…', 'common'),
k_isHidden: k_isAuditor,
k_onClick: k_openPortEditor,
k_isDisabled: true
},
'->',
{
k_id: 'k_btnApply',
k_caption: k_tr('Apply', 'common'),
k_isHidden: k_isAuditor,
k_isDefault: !k_isAuditor,

k_onClick: function(k_form) {
k_form.k_dialog.k_saveData();
}
},
{
k_id: 'k_btnClose',
k_caption: (k_isAuditor) ? k_tr('Close', 'common') : k_tr('Cancel', 'common'),
k_isDefault: k_isAuditor,
k_isCancel: true
}
],
k_buttonUpdate: function(k_sender) {
if ( ! (k_sender instanceof kerio.lib.K_Grid)) {
return;
}
this.k_enableItem('k_btnEdit', 1 === k_sender.k_selectionStatus.k_selectedRowsCount);
}
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_lib.k_registerObserver(k_grid, k_dialog.k_toolbar);
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_grid: k_grid,
k_trSavingData: k_tr('Saving…', 'common'),
k_parentWidget: undefined,
k_callbackSaveData: undefined,
k_setPortsRequestCfg: {
k_jsonRpc: { method: 'Ports.set' },
k_scope: k_dialog,
k_callback: k_dialog.k_callbackSetPortList
}
});
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
this.k_callbackSaveData = k_params.k_callback;
this.k_parentWidget = k_params.k_parentWidget;
this.k_grid.k_stopTracing();
this.k_grid.k_setData(k_params.k_portList);
this.k_grid.k_startTracing(true); kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };

k_kerioWidget.k_callbackSetPortList = function(k_data, k_success) {
var
k_result;
this.k_hideMask();
if (!k_success || !kerio.waw.shared.k_methods.k_responseIsOk(k_data)) {
return;
}
k_result = this.k_callbackSaveData.call(this.k_parentWidget,
{
k_data: this.k_grid.k_getData()
});
if (false !== k_result) {
this.k_hide();
}
}; k_kerioWidget.k_saveData = function() {
var
k_portsGrid = this.k_grid,
k_ifaceGrid = this.k_parentWidget.k_grid,
k_interfaces = k_ifaceGrid.k_getData(),
k_changes = k_portsGrid.k_getChangedData().k_modified,
k_ports = k_portsGrid.k_getData(),
k_isDangerous = false;
k_isDangerous = this.k_parentWidget.k_isPortsSetDangerous(k_changes, k_interfaces);
this.k_showMask(this.k_trSavingData);
this.k_setPortsRequestCfg.k_jsonRpc.params = { ports: k_ports, revertTimeout: (k_isDangerous ? 600 : 60) };
kerio.waw.requests.k_sendBatch(this.k_setPortsRequestCfg, {
k_requireUserConfirm: k_isDangerous
});
};
} }; 