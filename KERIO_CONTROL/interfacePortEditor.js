
kerio.waw.ui.interfacePortEditor = {
k_init: function(k_objectName){
var
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isBoxEdition = k_shared.k_methods.k_isBoxEdition(),
PortAssignmentType = k_CONSTANTS.PortAssignmentType,
k_PORT_ASSIGNMENT_TYPE_NAMES = k_shared.k_DEFINITIONS.k_PORT_ASSIGNMENT_TYPE_NAMES,
k_form, k_formCfg,
k_dialog, k_dialogCfg;
k_formCfg = {
k_useStructuredData: true,
k_isReadOnly: k_shared.k_methods.k_isAuditor(),
k_restrictBy: {
k_isBoxEdition: k_isBoxEdition
},
k_labelWidth: 150,
k_items: [
{
k_id: 'name',
k_type: 'k_display',
k_caption: k_tr('Port name:', 'interfacePortEditor'),
k_maxLength: 127,
k_value: ''
},
{
k_id: 'speedDuplex',
k_type: 'k_select',
k_caption: k_tr('Speed and duplex:', 'interfacePortEditor'),
k_localData: []
},
{
k_id: 'assignment',
k_type: 'k_select',
k_caption: k_tr('Assigned to:', 'interfaceManagePorEditor'),
k_restrictions: {
k_isBoxEdition: [ true ]
},
k_value: PortAssignmentType.PortAssignmentStandalone,
k_localData: [
{value: PortAssignmentType.PortAssignmentSwitch,     name: k_PORT_ASSIGNMENT_TYPE_NAMES[PortAssignmentType.PortAssignmentSwitch]},
{value: PortAssignmentType.PortAssignmentStandalone, name: k_PORT_ASSIGNMENT_TYPE_NAMES[PortAssignmentType.PortAssignmentStandalone]},
{value: PortAssignmentType.PortAssignmentUnassigned, name: k_PORT_ASSIGNMENT_TYPE_NAMES[PortAssignmentType.PortAssignmentUnassigned]}
],
k_onChange: function(k_form, k_element, k_value) {
k_form.k_setDisabled('k_vlanContainer', k_value !== kerio.waw.shared.k_CONSTANTS.PortAssignmentType.PortAssignmentStandalone);
}
},
{
k_type: 'k_container',
k_id: 'k_vlanContainer',
k_items: [
{
k_type: 'k_checkbox',
k_id: 'vlans.enabled',
k_option: k_tr('Create VLAN subinterfaces', 'interfacePortEditor'),
k_isLabelHidden: true,
k_onChange: function(k_form, k_item, k_value) {
k_form.k_setDisabled('k_vlansContainer', !k_value);
}
},
{
k_type: 'k_container',
k_id: 'k_vlansContainer',
k_isDisabled: true,
k_indent: 1,
k_items: [
{
k_id: 'vlans.value',
k_caption: k_tr('VLAN IDs:', 'interfacePortEditor'),
k_maxLength: 6000,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isVlanList'
}
},
{
k_type: 'k_display',
k_caption: ' ',
k_value: k_tr('Use semicolons (;) to separate individual VLANs', 'interfacePortEditor')
}
]
} ]
} ]
}; k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);

k_dialogCfg = {
k_defaultItem: 'speedDuplex',
k_height: 280,
k_width: 520,
k_title: k_tr('Configure Port', 'interfacePortEditor'),
k_content: k_form,
k_onOkClick: function(k_form) {
k_form.k_dialog.k_saveData();
}
};
k_dialogCfg = k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_trSavingData: k_tr('Saving…', 'common'),
k_trApply: k_tr('Apply', 'common'),
k_trOk: k_tr('OK', 'common'),
k_form: k_form,
k_rowIndex: null,
k_dataStore: {},
k_parentWidget: {},
k_setPortsRequestCfg: {
k_jsonRpc: { method: 'Ports.set' },
k_scope: k_dialog,
k_callback: k_dialog.k_saveDataCallback
},
k_btnOk: k_dialog.k_toolbar.k_getItem('k_btnOK'),
k_interfaceList: {}
});
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_DEFINITIONS = k_shared.k_DEFINITIONS,
SpeedDuplexType = k_CONSTANTS.SpeedDuplexType,
k_SPEED_DUPLEX_TYPE_NAMES = k_DEFINITIONS.k_SPEED_DUPLEX_TYPE_NAMES,
k_SPEED_DUPLEX_TYPE_NAMES_UNSUPPORTED = k_DEFINITIONS.k_SPEED_DUPLEX_TYPE_NAMES_UNSUPPORTED,
k_SPEED_DUPLEX_TYPE_LIST = k_DEFINITIONS.k_SPEED_DUPLEX_TYPE_LIST,
k_speedValues,
k_speedDuplexMayNotWork,
k_i, k_cnt,
k_speedDuplex,
k_speedNotWorkId,
k_index;
k_speedValues = [
k_SPEED_DUPLEX_TYPE_NAMES[SpeedDuplexType.SpeedDuplexAuto],
k_SPEED_DUPLEX_TYPE_NAMES[SpeedDuplexType.SpeedDuplexHalf10],
k_SPEED_DUPLEX_TYPE_NAMES[SpeedDuplexType.SpeedDuplexFull10],
k_SPEED_DUPLEX_TYPE_NAMES[SpeedDuplexType.SpeedDuplexHalf100],
k_SPEED_DUPLEX_TYPE_NAMES[SpeedDuplexType.SpeedDuplexFull100],
k_SPEED_DUPLEX_TYPE_NAMES[SpeedDuplexType.SpeedDuplexFull1000]
];
this.k_rowIndex = k_params.k_rowIndex;
this.k_parentWidget = k_params.k_parentWidget;
this.k_dataStore = k_params.k_data;
k_speedDuplexMayNotWork = this.k_dataStore.speedDuplexMayNotWork || [];
for (k_i = 0, k_cnt = k_speedDuplexMayNotWork.length; k_i < k_cnt; k_i++) {
k_speedNotWorkId = k_speedDuplexMayNotWork[k_i];
k_index = k_SPEED_DUPLEX_TYPE_LIST[k_speedNotWorkId];
k_speedValues[k_index] = k_SPEED_DUPLEX_TYPE_NAMES_UNSUPPORTED[k_speedNotWorkId];
}
k_speedDuplex = this.k_form.k_getItem('speedDuplex');
k_speedDuplex.k_setData(k_speedValues);
this.k_form.k_setData(k_params.k_data, true);
if (null === this.k_rowIndex) {
this.k_btnOk.k_setCaption(this.k_trApply);
this.k_interfaceList = this.k_parentWidget.k_parentWidget.k_parentWidget;
} else {
this.k_btnOk.k_setCaption(this.k_trOk);
}
};

k_kerioWidget.k_saveData = function() {
var
k_data = this.k_form.k_getData(true),
k_isDangerous = false,
k_interfaceList,
k_interfaces,
k_ports,
k_i;
if (null !== this.k_rowIndex) {
this.k_parentWidget.k_updateRow(k_data, this.k_rowIndex);
this.k_hide();
}
else {
k_interfaceList = this.k_interfaceList;
k_interfaces = this.k_parentWidget.k_getData();
k_ports = k_interfaceList.k_portList;
kerio.waw.shared.k_methods.k_mergeObjects(k_data, this.k_dataStore);
k_isDangerous = k_interfaceList.k_isPortsSetDangerous(k_data, k_interfaces);
for (k_i = 0; k_i < k_ports.length; k_i++) {
if (k_ports[k_i].id === this.k_dataStore.id) {
k_ports[k_i] = this.k_dataStore;
break;
}
}
this.k_showMask(this.k_trSavingData);
this.k_setPortsRequestCfg.k_jsonRpc.params = { ports: k_ports, revertTimeout: k_isDangerous ? 600 : 60 };
kerio.waw.requests.k_sendBatch(this.k_setPortsRequestCfg, {
k_requireUserConfirm: k_isDangerous
});
}
};

k_kerioWidget.k_saveDataCallback = function(k_data, k_success) {
this.k_hideMask();
if (!k_success || !kerio.waw.shared.k_methods.k_responseIsOk(k_data)) {
return;
}
this.k_interfaceList.k_updatePortAssignment();
this.k_hide();
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
this.k_rowIndex = null;
};
} }; 