
kerio.waw.ui.serviceEditor = {
k_init: function(k_objectName) {
kerio.waw.shared.k_CONSTANTS.k_SERVICE_EDITOR = {
k_srcPortId: 'k_srcPort',
k_dstPortId: 'k_dstPort',
k_icmpMessageId: 'k_icmpMessage'
};
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_WAW_PROTOCOL_ID = k_WAW_CONSTANTS.k_PROTOCOL_ID,
k_WAW_PORT_COMPARATOR_ID = k_WAW_CONSTANTS.PortComparator,
k_WAW_ICMP_MESSAGES_ID = k_WAW_CONSTANTS.k_ICMP_MESSAGES_ID,
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_isEditMode = ('serviceEditorEdit' === k_objectName || k_isAuditor),
k_srcPortId = k_WAW_CONSTANTS.k_SERVICE_EDITOR.k_srcPortId,
k_dstPortId = k_WAW_CONSTANTS.k_SERVICE_EDITOR.k_dstPortId,
k_srcPortPrefix = k_srcPortId + '_',
k_dstPortPrefix = k_dstPortId + '_',
k_icmpMessageId = k_WAW_CONSTANTS.k_SERVICE_EDITOR.k_icmpMessageId,
k_icmpMessagePrefix = k_icmpMessageId + '_',
k_labelWidth = 140,
k_formCfg, k_form,
k_dialogCfg, k_dialog,
k_title,
k_collections,         k_protocols, k_ports,  k_portElements,        k_element,             k_i, k_cnt;
k_formCfg = {
k_items: [
{k_type: 'k_fieldset',
k_caption: k_tr('General', 'common'),
k_labelWidth: k_labelWidth,
k_items: [
{
k_id: 'k_name',
k_caption: k_tr('Name:', 'common'),
k_maxLength: 63,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isName'
}
},
{
k_id: 'k_description',
k_caption: k_tr('Description:', 'common'),
k_maxLength: 255,
k_checkByteLength: true,
k_validator: {
k_functionName: 'k_isDescription'
}
},
{
k_type: 'k_select',
k_id: 'k_protocol',
k_caption: k_tr('Protocol:', 'serviceEditor'),
k_value : k_WAW_PROTOCOL_ID.k_OTHER,
k_localData: kerio.waw.shared.k_DEFINITIONS.k_PROTOCOLS,
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',

k_onChange: function(k_form, k_item, k_protocol) {
k_form.k_protocolObserver(k_form, k_protocol);
}},
{
k_type: 'k_select',
k_id: 'k_inspector',
k_caption: k_tr('Protocol inspector:', 'serviceEditor'),
k_isDisabled: true,
k_value: '',
k_localData: [], k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id'
}
] },new this.K_PortConfig({
k_id: k_srcPortId,
k_title: k_tr('Source port', 'serviceEditor'),
k_labelWidth: k_labelWidth
}),
new this.K_PortConfig({
k_id: k_dstPortId,
k_title: k_tr('Destination port', 'serviceEditor'),
k_className: 'removeFieldsetMargin',
k_labelWidth: k_labelWidth
}),
{	k_type: 'k_fieldset',
k_id: 'k_settings',
k_labelWidth: k_labelWidth,
k_caption: k_tr('Settings', 'common'),
k_items: [
{
k_type: 'k_number',
k_id: 'k_protocolNumber',
k_caption: k_tr('Protocol number:', 'serviceEditor'),
k_maxLength: 3,
k_minValue: 0,
k_maxValue: 255,
k_validator: {
k_functionName: 'k_isProtocolNumber',
k_allowBlank: false
}
}
] },{	k_type: 'k_fieldset',
k_id: 'k_icmpMessages',
k_caption: k_tr('ICMP message type', 'serviceEditor'),
k_isHidden: true,
k_isLabelHidden: true,
k_items: [
new this.K_IcmpCheckbox({
k_message: k_WAW_ICMP_MESSAGES_ID.k_ANY,
k_title: k_tr('Any', 'serviceEditor'),

k_onChange: function(k_form, k_element, k_value) {
k_form.k_setDisabled(k_form.k_collections.k_icmpMessages, k_value);
}}),
new this.K_IcmpCheckbox({
k_message: k_WAW_ICMP_MESSAGES_ID.k_ECHO_REPLY,
k_title: k_tr('Echo Reply', 'serviceEditor')
}),
new this.K_IcmpCheckbox({
k_message: k_WAW_ICMP_MESSAGES_ID.k_ECHO,
k_title: k_tr('Echo', 'serviceEditor')
}),
new this.K_IcmpCheckbox({
k_message: k_WAW_ICMP_MESSAGES_ID.k_REDIRECT,
k_title: k_tr('Redirect', 'serviceEditor')
}),
new this.K_IcmpCheckbox({
k_message: k_WAW_ICMP_MESSAGES_ID.k_DEST_UNREACHABLE,
k_title: k_tr('Destination Unreachable', 'serviceEditor')
}),
new this.K_IcmpCheckbox({
k_message: k_WAW_ICMP_MESSAGES_ID.k_TIME_EXCEEDED,
k_title: k_tr('Time Exceeded', 'serviceEditor')
}),
new this.K_IcmpCheckbox({
k_message: k_WAW_ICMP_MESSAGES_ID.k_SOURCE_QUENCH,
k_title: k_tr('Source Quench', 'serviceEditor')
}),
new this.K_IcmpCheckbox({
k_message: k_WAW_ICMP_MESSAGES_ID.k_PARAM_PROBLEM,
k_title: k_tr('Parameter Problem', 'serviceEditor')
})
] }] };k_form = new k_lib.K_Form(k_localNamespace + 'k_formGeneral', k_formCfg);
if (k_isAuditor) {
k_form.k_setReadOnlyAll(true);
}

k_collections = {};
k_protocols = {};
k_protocols.k_all                        = [k_srcPortPrefix + 'k_frame', k_dstPortPrefix + 'k_frame', 'k_icmpMessages', 'k_settings'];
k_protocols[k_WAW_PROTOCOL_ID.k_TCP]     = [k_srcPortPrefix + 'k_frame', k_dstPortPrefix + 'k_frame'];
k_protocols[k_WAW_PROTOCOL_ID.k_UDP]     = [k_srcPortPrefix + 'k_frame', k_dstPortPrefix + 'k_frame'];
k_protocols[k_WAW_PROTOCOL_ID.k_TCP_UDP] = [k_srcPortPrefix + 'k_frame', k_dstPortPrefix + 'k_frame'];
k_protocols[k_WAW_PROTOCOL_ID.k_ICMP]    = ['k_icmpMessages'];
k_protocols[k_WAW_PROTOCOL_ID.k_OTHER]   = ['k_settings'];
k_collections.k_protocols = k_protocols;
k_ports = {};
k_ports.k_all                                    = ['k_number', 'k_from', 'k_to', 'k_list'];
k_ports[k_WAW_PORT_COMPARATOR_ID.Any]          = []; k_ports[k_WAW_PORT_COMPARATOR_ID.Equal]     = ['k_number'];
k_ports[k_WAW_PORT_COMPARATOR_ID.GreaterThan] = ['k_number'];
k_ports[k_WAW_PORT_COMPARATOR_ID.LessThan]    = ['k_number'];
k_ports[k_WAW_PORT_COMPARATOR_ID.Range]        = ['k_from', 'k_to'];
k_ports[k_WAW_PORT_COMPARATOR_ID.List]         = ['k_list'];
k_collections.k_ports = k_ports;
k_collections.k_icmpMessages = [	k_icmpMessagePrefix + k_WAW_ICMP_MESSAGES_ID.k_ECHO,
k_icmpMessagePrefix + k_WAW_ICMP_MESSAGES_ID.k_ECHO_REPLY,
k_icmpMessagePrefix + k_WAW_ICMP_MESSAGES_ID.k_REDIRECT,
k_icmpMessagePrefix + k_WAW_ICMP_MESSAGES_ID.k_DEST_UNREACHABLE,
k_icmpMessagePrefix + k_WAW_ICMP_MESSAGES_ID.k_TIME_EXCEEDED,
k_icmpMessagePrefix + k_WAW_ICMP_MESSAGES_ID.k_SOURCE_QUENCH,
k_icmpMessagePrefix + k_WAW_ICMP_MESSAGES_ID.k_PARAM_PROBLEM
];
k_portElements = ['k_comparator', 'k_number', 'k_from', 'k_to', 'k_list'];
k_collections.k_portElements = k_portElements;
for (k_i = 0, k_cnt = k_portElements.length; k_i < k_cnt; k_i++) {
k_element = k_portElements[k_i];
k_form.k_getItem(k_srcPortPrefix + k_element).k_addReferences({k_relatedPortType: k_srcPortId});
k_form.k_getItem(k_dstPortPrefix + k_element).k_addReferences({k_relatedPortType: k_dstPortId});
}
if (k_isEditMode) {
k_title = (k_isAuditor) ? k_tr('View Service', 'serviceEditor') : k_tr('Edit Service', 'serviceEditor');
}
else {
k_title = k_tr('Add Service', 'serviceEditor');
}
k_dialogCfg = {
k_width: 410,
k_height: 480,
k_isAuditor: k_isAuditor,
k_title: k_title,
k_content: k_form,
k_defaultItem: 'k_name',

k_onOkClick: function() {
this.k_dialog.k_sendData();
}}; k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_form.k_addReferences({
k_collections: k_collections,
k_srcPortPrefix: k_srcPortId,
k_dstPortPrefix: k_dstPortId,
k_icmpMessagesPrefix: k_icmpMessageId,
k_dialog: k_dialog,
k_protocolInspector: new this.K_ProtocolInspector(k_form.k_getItem('k_inspector'), k_WAW_CONSTANTS.k_PROTOCOL_ID.k_NONE)
});k_dialog.k_addReferences({
k_form: k_form,
k_objectName: k_objectName,
k_relatedGrid: {},
k_isAuditor: k_isAuditor,
k_isEditMode: k_isEditMode
});this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_sendDataRequest: {
k_callback: k_dialog.k_sendDataCallback,
k_scope: k_dialog
}
});
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {
var k_form = k_kerioWidget.k_form;

k_kerioWidget.k_applyParams = function(k_params) {
var
k_form = this.k_form,
k_WAW_PROTOCOL_ID = kerio.waw.shared.k_CONSTANTS.k_PROTOCOL_ID,
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_icmpPrefix = k_form.k_icmpMessagesPrefix + '_',
k_data = k_params.k_data || {},
k_formData,
k_portFields,
k_srcData, k_dstData,
k_icmpData, k_i, k_cnt;
this.k_data = k_data;
this.k_relatedGrid = k_params.k_relatedWidget;
if (!this.k_isEditMode) {
return;
}
k_formData = {
k_name: k_data.name,
k_description: k_data.description,
k_protocol: k_data.protocol || k_WAW_PROTOCOL_ID.k_OTHER,
k_inspector: k_data.inspector
};
k_srcData = k_data.srcPort || {};
k_dstData = k_data.dstPort || {};
switch (k_formData.k_protocol) {
case k_WAW_PROTOCOL_ID.k_TCP:
case k_WAW_PROTOCOL_ID.k_UDP:
case k_WAW_PROTOCOL_ID.k_TCP_UDP:
k_formData.k_srcPort = k_srcData.comparator;
k_formData.k_dstPort = k_dstData.comparator;
k_portFields = this.k_setPortFields({
k_comparator: k_srcData.comparator,
k_ports: k_srcData.ports,
k_prefix: k_form.k_srcPortPrefix
});
k_WAW_METHODS.k_mergeObjects(k_portFields, k_formData);
k_portFields = this.k_setPortFields({
k_comparator: k_dstData.comparator,
k_ports: k_dstData.ports,
k_prefix: k_form.k_dstPortPrefix
});
k_WAW_METHODS.k_mergeObjects(k_portFields, k_formData);
break; case k_WAW_PROTOCOL_ID.k_ICMP:
k_icmpData = k_data.icmpTypes;
for (k_i = 0, k_cnt = k_icmpData.length; k_i < k_cnt; k_i++) {
k_formData[k_icmpPrefix + k_icmpData[k_i]] = true; } break; case k_WAW_PROTOCOL_ID.k_OTHER:
k_formData.k_protocolNumber = k_data.protoNumber;
break;
} k_form.k_setData(k_formData, true); kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };
k_kerioWidget.k_sendData = function() {
var
k_form = this.k_form,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_WAW_PROTOCOL_ID = k_WAW_CONSTANTS.k_PROTOCOL_ID,
k_WAW_PORT_COMPARATOR_ID = k_WAW_CONSTANTS.PortComparator,
k_WAW_ICMP_MESSAGES_ID = k_WAW_CONSTANTS.k_ICMP_MESSAGES_ID,
k_icmpMessages = k_form.k_collections.k_icmpMessages,
k_icmpPrefix = k_form.k_icmpMessagesPrefix + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isRangeValid = true,
k_formData, k_data,     k_protocol,
k_i, k_cnt;
k_formData = k_form.k_getData(true);
k_protocol = k_formData.k_protocol;
k_data = {
'name': k_formData.k_name,
'description': k_formData.k_description,
'protocol': k_formData.k_protocol,
'inspector': k_formData.k_inspector
};
switch (k_protocol) {
case k_WAW_PROTOCOL_ID.k_TCP:
case k_WAW_PROTOCOL_ID.k_UDP:
case k_WAW_PROTOCOL_ID.k_TCP_UDP:
k_data.srcPort = this.k_parsePortData(k_formData, k_form.k_srcPortPrefix);
k_data.dstPort = this.k_parsePortData(k_formData, k_form.k_dstPortPrefix);
if (k_WAW_PORT_COMPARATOR_ID.Range === k_data.srcPort.comparator) {
k_isRangeValid = k_isRangeValid && k_form.k_isPortIntervalValid(k_form, k_form.k_srcPortPrefix);
}
if (k_WAW_PORT_COMPARATOR_ID.Range === k_data.dstPort.comparator) {
k_isRangeValid = k_isRangeValid && k_form.k_isPortIntervalValid(k_form, k_form.k_dstPortPrefix);
}
if (!k_isRangeValid) {
k_lib.k_alert(
k_tr('Invalid range', 'serviceEditor'), k_tr('Specified port numbers are not valid for range.', 'serviceEditor'));
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
return;
}
break; case k_WAW_PROTOCOL_ID.k_OTHER:
k_data.protoNumber = k_formData.k_protocolNumber;
break; case k_WAW_PROTOCOL_ID.k_ICMP:
if (k_formData[k_icmpPrefix + k_WAW_ICMP_MESSAGES_ID.k_ANY]) { k_data.icmpTypes = [k_WAW_ICMP_MESSAGES_ID.k_ANY];
} else {
k_data.icmpTypes = [];
for (k_i = 0, k_cnt = k_icmpMessages.length; k_i < k_cnt; k_i++) {
if (k_formData[k_icmpMessages[k_i]]) {
k_data.icmpTypes.push(k_form.k_getItem(k_icmpMessages[k_i]).k_getRawValue());
}
}
}
break; }if (this.k_isEditMode) {
kerio.waw.shared.k_methods.k_mergeObjects(k_data, this.k_data);
k_data = {
"serviceIds": [this.k_data.id],
"details": this.k_data
};
this.k_sendDataRequest.k_jsonRpc = {
method: 'IpServices.set',
params: k_data
};
}
else {
k_data = kerio.waw.shared.k_DEFINITIONS.k_get('k_predefinedIpService', k_data);
k_data = {
"services": [k_data]
};
this.k_sendDataRequest.k_jsonRpc = {
method: 'IpServices.create',
params: k_data
};
}
kerio.lib.k_ajax.k_request(this.k_sendDataRequest);
};
k_kerioWidget.k_sendDataCallback = function(k_response) {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
if (k_response.k_decoded.errors.length !== 0) {
return;
}
kerio.waw.shared.k_methods.k_maskMainScreen(this.k_relatedGrid);
this.k_relatedGrid.k_onItemChange();
this.k_hide();
};

k_kerioWidget.k_parseAllPortData = function(k_data, k_prefix) {
var
k_form = this.k_form,
k_elements = k_form.k_collections.k_portElements,
k_return = {},
k_elemPrefix = k_prefix + '_',
k_element,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_elements.length; k_i < k_cnt; k_i++) {
k_element = k_elements[k_i];
k_return[k_element] = k_data[k_elemPrefix + k_element];
}
return k_return;
};

k_kerioWidget.k_parsePortData = function(k_data, k_prefix) {
var
k_WAW_PORT_COMPARATOR_ID = kerio.waw.shared.k_CONSTANTS.PortComparator,
k_parsedData = this.k_parseAllPortData(k_data, k_prefix), k_ports = [],
k_i, k_cnt;
switch (k_parsedData.k_comparator) {
case k_WAW_PORT_COMPARATOR_ID.Equal:
case k_WAW_PORT_COMPARATOR_ID.GreaterThan:
case k_WAW_PORT_COMPARATOR_ID.LessThan:
k_ports.push(k_parsedData.k_number);
break;
case k_WAW_PORT_COMPARATOR_ID.Range:
if (k_parsedData.k_from === k_parsedData.k_to) {
k_parsedData.k_comparator = k_WAW_PORT_COMPARATOR_ID.Equal;
k_ports.push(k_parsedData.k_from);
}
else {
k_ports.push(k_parsedData.k_from);
k_ports.push(k_parsedData.k_to);
}
break;
case k_WAW_PORT_COMPARATOR_ID.List:
k_ports = k_parsedData.k_list.split(',');
for (k_i = 0, k_cnt = k_ports.length; k_i < k_cnt; k_i++) {
k_ports[k_i] = parseInt(k_ports[k_i], 10);
}
break;
}
return {
comparator: k_parsedData.k_comparator,
ports: k_ports
};
};

k_kerioWidget.k_setPortFields = function(k_data) {
var
k_comparator = k_data.k_comparator,
k_ports = k_data.k_ports || {}, k_prefix = k_data.k_prefix + '_',
k_WAW_PORT_COMPARATOR_ID = kerio.waw.shared.k_CONSTANTS.PortComparator,
k_result = {};
k_result[k_prefix + 'k_comparator'] = k_comparator;
switch (k_comparator) {
case k_WAW_PORT_COMPARATOR_ID.Equal:
k_result[k_prefix + 'k_list'] = k_ports[0]; case k_WAW_PORT_COMPARATOR_ID.GreaterThan:
case k_WAW_PORT_COMPARATOR_ID.LessThan:
k_result[k_prefix + 'k_number'] = k_ports[0] || '';
break;
case k_WAW_PORT_COMPARATOR_ID.Range:
k_result[k_prefix + 'k_from'] = k_ports[0] || '';
k_result[k_prefix + 'k_to'] = k_ports[1] || '';
break;
case k_WAW_PORT_COMPARATOR_ID.List:
k_result[k_prefix + 'k_list'] = k_ports.join(', ');
break;
default: } return k_result;
};
k_form.k_protocolObserver = function(k_form, k_protocol) {
var k_protocols = k_form.k_collections.k_protocols;
k_form.k_setVisible(k_protocols.k_all, false);
k_form.k_setVisible(k_protocols[k_protocol], true);
k_form.k_protocolInspector.k_setList(k_protocol);
};
k_form.k_portConditionObserver = function(k_form, k_item, k_comparator) {
var
k_portElements = k_form.k_collections.k_ports,
k_idPrefix = k_item.k_relatedPortType + '_',
k_elements,
k_i, k_cnt;
k_elements = k_portElements.k_all;
for (k_i = 0, k_cnt = k_elements.length; k_i < k_cnt; k_i++) {
k_form.k_setVisible(k_idPrefix + k_elements[k_i], false);
}
k_elements = k_portElements[k_comparator];
for (k_i = 0, k_cnt = k_elements.length; k_i < k_cnt; k_i++) {
k_form.k_setVisible(k_idPrefix + k_elements[k_i], true);
}
};
k_form.k_isPortIntervalValid = function(k_form, k_item) {
var
k_idPrefix = (('string' === typeof k_item) ? k_item : k_item.k_relatedPortType) + '_',
k_isRangeValid = true,
k_toElement,
k_fromElement;
k_toElement = k_form.k_getItem(k_idPrefix + 'k_to');
k_fromElement = k_form.k_getItem(k_idPrefix + 'k_from');
if (!k_toElement.k_isValid(false) || !k_fromElement.k_isValid(false)) {
return;
}
if (k_toElement.k_getValue() < k_fromElement.k_getValue()) {
k_isRangeValid = false;
}
k_fromElement.k_markInvalid(!k_isRangeValid);
k_toElement.k_markInvalid(!k_isRangeValid);
return k_isRangeValid;
};
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
this.k_form.k_protocolInspector.k_reset();
};
}, 
K_ProtocolInspector: function(k_select, k_limit) {

this._k_loadCallback = function(k_response) {
var
k_list = [ kerio.waw.shared.k_DEFINITIONS.k_get('k_predefinedProtocolInspector')
],
k_inspectors, k_inspector,
k_i, k_cnt;
if (!k_response || !k_response.k_isOk) { this._k_inspectors = k_list;
this.k_setList(this._k_limit);
return;
}
k_inspectors = k_response.k_decoded.list;
for (k_i = 0, k_cnt = k_inspectors.length; k_i < k_cnt; k_i++) {
k_inspector = k_inspectors[k_i];
k_list.push({
k_name: k_inspector.name,
k_id: k_inspector.name, k_ipProtocol: k_inspector.ipProtocol
}); } this._k_inspectors = k_list; this.k_setList(this._k_limit); }; 
this._k_filterInspectors = function(k_limit) {
var
k_all = kerio.waw.shared.k_CONSTANTS.k_PROTOCOL_ID.k_ALL,
k_inspectors = this._k_inspectors,
k_list = [],
k_inspector,
k_protocol,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_inspectors.length; k_i < k_cnt; k_i++) {
k_inspector = k_inspectors[k_i];
k_protocol = k_inspector.k_ipProtocol;
if (k_all === k_limit || k_limit === k_protocol || k_all === k_protocol) {
k_list.push(k_inspector);
}
} return k_list;
}; 
this.k_setList = function(k_limit) {
var
k_select = this._k_select,
k_selectValue,
k_list;
this._k_limit = k_limit; this._k_lastValidValue = k_select.k_getValue() || this._k_lastValidValue;
k_list = this._k_filterInspectors(k_limit);
k_select.k_setData(k_list);
k_selectValue = k_select.k_containsValue(this._k_lastValidValue) ? this._k_lastValidValue : "";
k_select.k_setValue(k_selectValue);
k_select.k_setDisabled(1 >= k_list.length);
}; this.k_reset = function() {
this._k_lastValidValue = '';
this._k_limit = this._k_initialLimit;
}; this._k_select = k_select;
this._k_initialLimit = k_limit;
this.k_reset();
this._k_loadCallback(); kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Inspectors.get'
},
k_callback: this._k_loadCallback,
k_scope: this
});
}, 
K_PortConfig: function (k_config) {
var
k_WAW_PORT_COMPARATOR_ID = kerio.waw.shared.k_CONSTANTS.PortComparator,
k_idPrefix = k_config.k_id + '_',
k_tr = kerio.lib.k_tr,
k_definition;
k_definition = {
k_type: 'k_fieldset',
k_id: k_idPrefix + 'k_frame',
k_caption: k_config.k_title,
k_labelWidth: k_config.k_labelWidth,
k_isHidden: true, k_items: [
{
k_type: 'k_select',
k_caption: k_tr('Condition:', 'serviceEditor'),
k_id: k_idPrefix + 'k_comparator',
k_value : k_WAW_PORT_COMPARATOR_ID.Any,
k_localData: kerio.waw.shared.k_DEFINITIONS.k_PORT_COMPARATORS,
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',

k_onChange: function (k_form, k_item, k_value) {
k_form.k_portConditionObserver.apply(k_form, arguments);
}}, {
k_type: 'k_number',
k_caption: k_tr('Port number:', 'serviceEditor'),
k_id: k_idPrefix + 'k_number',
k_maxLength: 5,
k_minValue: 1,
k_maxValue: 65535,
k_isHidden: true,
k_validator: {
k_functionName: 'k_isPortNumber',
k_allowBlank: false
}
}, {
k_type: 'k_number',
k_caption: k_tr('From:', 'common'),
k_id: k_idPrefix + 'k_from',
k_maxLength: 5,
k_minValue: 1,
k_maxValue: 65535,
k_isHidden: true,
k_validator: {
k_functionName: 'k_isPortNumber',
k_allowBlank: false
},

k_onChange: function (k_form, k_item) {
k_form.k_isPortIntervalValid.apply(k_form, arguments);
}}, {
k_type: 'k_number',
k_caption: k_tr('To:', 'common'),
k_id: k_idPrefix + 'k_to',
k_maxLength: 5,
k_minValue: 1,
k_maxValue: 65535,
k_isHidden: true,
k_validator: {
k_functionName: 'k_isPortNumber',
k_allowBlank: false
},

k_onChange: function (k_form, k_item) {
k_form.k_isPortIntervalValid.apply(k_form, arguments);
}}, {
k_caption: k_tr('List:', 'serviceEditor'),
k_id: k_idPrefix + 'k_list',
k_isHidden: true,
k_validator: {
k_functionName: 'k_isPortList',
k_allowBlank: false
}
} ] };kerio.waw.shared.k_methods.k_mergeObjects(k_definition, this);
},
K_IcmpCheckbox: function(k_config) {
this.k_type = 'k_checkbox';
this.k_id = kerio.waw.shared.k_CONSTANTS.k_SERVICE_EDITOR.k_icmpMessageId + '_' + k_config.k_message;
this.k_value = k_config.k_message;
this.k_option = k_config.k_title;
delete k_config.k_message;
delete k_config.k_title;
kerio.waw.shared.k_methods.k_mergeObjects(k_config, this);
}}; 