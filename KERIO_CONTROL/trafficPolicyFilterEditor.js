
kerio.waw.ui.trafficPolicyFilterEditor = {

k_init: function(k_objectName) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_formCfg,
k_form,
k_dialogCfg,
k_dialog;
k_formCfg = {
k_labelWidth: 110,
k_items: [
{
k_type: 'k_display',
k_value: k_tr('Show all rules which currently match the following packet description', 'trafficPolicyFilterEditor')
},
{
k_id: 'sourceIp',
k_caption: k_tr('Source IP:', 'trafficPolicyFilterEditor'),
k_emptyText: k_tr('Any', 'common'),
k_validator: {
k_functionName: 'k_isIpv4Or6Address',
k_allowBlank: true,
k_inputFilter: k_DEFINITIONS.k_ipv6.k_allowedChars
}
},
{
k_id: 'destinationIp',
k_caption: k_tr('Destination IP:', 'trafficPolicyFilterEditor'),
k_emptyText: k_tr('Any', 'common'),
k_validator: {
k_functionName: 'k_isIpv4Or6Address',
k_allowBlank: true,
k_inputFilter: k_DEFINITIONS.k_ipv6.k_allowedChars
}
},
{
k_id: 'port',
k_caption: k_tr('Destination port:', 'trafficPolicyFilterEditor'),
k_emptyText: k_tr('Any', 'common'),
k_type: 'k_number',
k_maxLength: 5,
k_minValue: 1,
k_maxValue: 65535,
k_validator: {
k_allowBlank: true,
k_functionName: 'k_isPortNumber'
}
}
]
};
k_form = new k_lib.K_Form(k_objectName + '_' + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 400,
k_height: 220,
k_title: k_DEFINITIONS.k_get('k_MENU_TREE_NODES.trafficPolicyList') + ' - ' + k_tr('Test Rules', 'trafficPolicyFilterEditor'),
k_content: k_form,
k_defaultItem: null,
k_isAuditor: false, 
k_onOkClick: function(k_toolbar) {
var
k_dialog = k_toolbar.k_parentWidget,
k_form = k_dialog.k_form,
k_data = k_form.k_getData();
k_data.port = '' === k_data.port ? 0 : parseInt(k_data.port, 10);
k_dialog.k_hide();
k_dialog.k_callback.call(k_dialog.k_relatedGrid, k_form.k_getData());
}
};
k_dialogCfg = k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_relatedGrid: null,
k_callback: null
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_applyParams = function(k_params){
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_callback = k_params.k_callback;
};
}
}; 