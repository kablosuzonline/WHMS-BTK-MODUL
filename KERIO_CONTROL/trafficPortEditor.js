
kerio.waw.ui.trafficPortEditor = {

k_init: function(k_objectName) {
var
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_localNamespace,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS;
this.k_publicName = k_objectName; k_localNamespace = this.k_publicName + '_';
k_formCfg = {
k_items: [
{	k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Port or port range:', 'trafficRuleEditor')
},
{	k_type: 'k_row',
k_items: [
{
k_type: 'k_select',
k_id: 'k_protocol',
k_width: 65,
k_isLabelHidden: true,
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_localData: [
k_WAW_DEFINITIONS.k_PROTOCOLS_MAPPED[k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP],
k_WAW_DEFINITIONS.k_PROTOCOLS_MAPPED[k_WAW_CONSTANTS.k_PROTOCOL_ID.k_UDP]
],
k_value: k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP
},
{	k_id: 'k_port',
k_isLabelHidden: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isPortOrPortRange'
}
}
]
}
]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 230,
k_height: 140,
k_title: k_tr('Port', 'common'),
k_content: k_form,
k_defaultItem: 'k_protocol',

k_onOkClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData();
}
};
k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog('trafficPortEditor' + '_' + this.k_publicName, k_dialogCfg);
k_dialog.k_addReferences(
{	k_form: k_form,
k_relatedGrid: {},
k_isPortAdd: ('portAdd' === k_objectName ? true : false)
}
);
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
var
k_formData,
k_portData;
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_form.k_focus('k_port');
if (this.k_isPortAdd) {
return;
}
k_portData = k_params.k_data.port;
k_formData = {
k_protocol: k_params.k_data.protocol,
k_port: k_portData.ports.join('-')
};
this.k_form.k_setData(k_formData, true);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };

k_kerioWidget.k_sendData = function() {
var
k_COMPARATOR = kerio.waw.shared.k_CONSTANTS.PortComparator,
k_definedService = false,
k_formData = this.k_form.k_getData(),
k_ports = k_formData.k_port.split('-'),
k_portsCount = k_ports.length,
k_relatedGrid = this.k_relatedGrid,
k_portData;
k_portData = kerio.lib.k_cloneObject(k_relatedGrid.k_serviceIdReference);
k_ports[0] = parseInt(k_ports[0], 10);if (1 === k_portsCount) {
k_portData.port.comparator = k_COMPARATOR.Equal;
}
else {
k_ports[1] = parseInt(k_ports[1], 10);if (k_ports[0] === k_ports[1]) {
k_portData.port.comparator = k_COMPARATOR.Equal;
k_ports.pop(1);
}
else {
k_portData.port.comparator = k_COMPARATOR.Range;
}
}
k_portData.k_definedService = k_definedService;
k_portData.protocol = k_formData.k_protocol;
k_portData.port.ports = k_ports;
if (!this.k_isPortAdd) {
k_relatedGrid.k_removeSelectedRows();
}
k_relatedGrid.k_addItems([k_portData], k_definedService);
this.k_hide();
};
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}
}; 