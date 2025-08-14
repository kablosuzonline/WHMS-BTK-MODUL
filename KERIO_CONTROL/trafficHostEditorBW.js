kerio.waw.ui.trafficHostEditorBW = {
k_init: function (k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_isEditMode = 'trafficHostEditBW' === k_objectName,
k_form, k_formCfg,
k_dialog, k_dialogCfg,
k_specificTypesTooltip,
k_hostToRemove;
k_specificTypesTooltip = [
'<table class=tableTooltip>',
'<tr><th>', k_tr('Possibilities', 'ipAddressGroupEditor'), '</th><th>', k_tr('Examples', 'ipAddressGroupEditor'), '</th></tr>',
'<tr><td>', k_tr('Host', 'ipAddressGroupEditor'), '</td><td>', 'www.domain.org', '</td></tr>',
'<tr><td>', k_tr('IPv4 address', 'ipAddressGroupEditor'), '</td><td>', '192.168.0.1', '</td></tr>',
'<tr><td>', k_tr('IPv4 range', 'ipAddressGroupEditor'), '</td><td>', '192.168.0.5-192.168.0.90', '</td></tr>',
'<tr><td>', k_tr('IPv4 subnet mask', 'ipAddressGroupEditor'), '</td><td>', '192.168.0.0/32', '</td></tr>',
'<tr><td>', k_tr('IPv4 network', 'ipAddressGroupEditor'), '</td><td>', '192.168.0.0/255.255.0.0', '</td></tr>',
'<tr><td>', k_tr('IPv6 address', 'ipAddressGroupEditor'), '</td><td>', '12:34::2', '</td></tr>',
'<tr><td>', k_tr('IPv6 range', 'ipAddressGroupEditor'), '</td><td>', '12:34::2-12:34::99', '</td></tr>',
'<tr><td>', k_tr('IPv6 prefix', 'ipAddressGroupEditor'), '</td><td>', '12:34::/64', '</td></tr>',
'</table>'
].join('');
k_formCfg = {
k_items: [
{
k_type: 'k_row',
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_display',
k_value: [
'<span ',
kerio.lib.k_buildTooltip(k_specificTypesTooltip, true),
'>',
k_tr('Addresses:', 'ipAddressGroup'),
'<span class="tooltip" ',
kerio.lib.k_buildTooltip(k_specificTypesTooltip, true),
'>&nbsp; &nbsp; &nbsp;</span></span>'
].join(''),
k_isSecure: true,
k_isLabelHidden: true,
k_width: 100
},
{
k_id: 'hostIp'
}
]
}
]
};
k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 400,
k_height: 170,
k_content: k_form,
k_defaultItem: 'hostIp',
k_title: (k_isEditMode)
? k_tr('Edit Host, Network, Address Range, IP Prefix', 'trafficHostEditorBW')
: k_tr('Add Host, Network, Address Range, IP Prefix', 'trafficHostEditorBW'),
k_onOkClick: this.k_normalizeData
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_form: k_form,
k_dataStore: {},
k_isEditMode: k_isEditMode,
k_inputElement: k_form.k_getItem('hostIp'),
k_normalizeRequest: {
k_jsonRpc: {
method: 'TrafficPolicy.normalizeTrafficEntity',
params: {
input: {}
}
},
k_scope: k_dialog,
k_callback: function (k_response, k_success) {
this.k_saveData(k_response, k_success);
}
}
});
k_form.k_addReferences({
k_dialog: k_dialog
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function (k_kerioWidget) {
k_kerioWidget.k_addReferences({
k_applyParams: this.k_onLoad,
k_resetOnClose: this.k_resetOnClose,
k_saveData: this.k_saveData
});
},
k_onLoad: function (k_params) {
var
k_hostTypes = kerio.waw.shared.k_CONSTANTS.TrafficEntityType,
k_data = (k_params.k_data)
? k_params.k_data : kerio.waw.shared.k_DEFINITIONS.k_get('k_trafficEntity'),
k_trafficRuleGrid = k_params.k_parentGrid.k_getMainWidget().k_parentGrid,
k_form = this.k_form;
this.k_parentGrid = k_params.k_parentGrid;
this.k_dataStore = k_data;
if (k_hostTypes.TrafficEntityHost !== k_data.type) {
k_data.hostIp = k_trafficRuleGrid.k_renderTrafficEntityItem(k_data, k_trafficRuleGrid).k_data;
k_data.type = k_hostTypes.TrafficEntityHost;
}
else {
if (k_params.k_preselectValue)
k_data.hostIp = k_params.k_preselectValue;
}
if (k_params.k_preselectValue)
k_hostToRemove = k_params.k_preselectValue;
k_form.k_setData(k_data);
kerio.waw.shared.k_data.k_cache({k_dialog: this});
},
k_normalizeData: function (k_toolbar) {
var
k_shared = kerio.waw.shared,
k_hostTypes = kerio.waw.shared.k_CONSTANTS.TrafficEntityType,
k_dialog = k_toolbar.k_parentWidget,
k_form = k_dialog.k_form,
k_formData = k_form.k_getData(),
k_data = k_dialog.k_dataStore,
k_removeWhiteSpaces = new RegExp('\\s', 'g'),
k_requestCfg,
k_entity;
k_data.type = k_hostTypes.TrafficEntityHost;
k_data.host = k_formData.hostIp.replace(k_removeWhiteSpaces, '');
k_entity = k_shared.k_methods.k_mergeObjects(k_data, k_shared.k_DEFINITIONS.k_get('k_trafficEntity'));
k_requestCfg = k_dialog.k_normalizeRequest;
k_requestCfg.k_jsonRpc.params.input = k_entity;
kerio.lib.k_ajax.k_request(k_requestCfg);
},
k_saveData: function (k_response, k_success) {
if (!k_success || !k_response.k_isOk || (k_response.k_decoded && k_response.k_decoded.errors && 0 !== k_response.k_decoded.errors.length)) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
this.k_inputElement.k_focus();
return;
}
var
k_hostTypes = kerio.waw.shared.k_CONSTANTS.TrafficEntityType,
k_grid = this.k_parentGrid,
k_normalizedEntity = k_response.k_decoded.result,
k_data;
if (this.k_isEditMode) {
k_grid.k_datastore.k_groups.BMConditionHosts.k_removeByValue(k_hostToRemove);
}
k_data = {
k_type: k_normalizedEntity.type,
typeNumber: kerio.waw.shared.k_CONSTANTS.k_TRAFFIC_ENTITY_TYPES_NUMBER.k_HOST, item: k_normalizedEntity
};
k_grid.k_fillDataFromRuleDataStore(
kerio.waw.shared.k_DEFINITIONS.k_get('k_bandwidthTrafficDataTemplate', {
type: kerio.waw.shared.k_CONSTANTS.BMConditionType.BMConditionHosts,
hostStr: k_data.item.host
})
);
this.k_hide();
},
k_resetOnClose: function () {
this.k_form.k_reset();
}
};
