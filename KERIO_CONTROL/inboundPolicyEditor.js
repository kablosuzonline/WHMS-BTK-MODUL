
kerio.waw.ui.inboundPolicyEditor = {

k_init: function(k_objectName){
var
k_shared = kerio.waw.shared,
k_DEFINITIONS = k_shared.k_DEFINITIONS,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_TARGET_FIREWALL = 0,
k_TARGET_HOST = 1,
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isEditMode = 'k_inboundPolicyEditorEdit' === k_objectName,
k_formCfg,
k_form,
k_dialogCfg,
k_dialog;
k_formCfg = {
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Service / port', 'inboundPolicyEditor'),
k_items: [
{
k_type: 'k_display',
k_id: 'k_lockedRule',
k_isHidden: true,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('This rule is used as a traffic condition in a Bandwidth Management rule.', 'inboundPolicyEditor')
+ ' ' + k_tr('Please note that changing the service or port may present unintended result in Bandwidth Management.', 'inboundPolicyEditor')
},
{
k_type: 'k_display',
k_id: 'k_uneditableRule',
k_isHidden: true,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('This rule is used as a traffic condition in a Bandwidth Management rule.', 'inboundPolicyEditor')
+ ' ' + k_tr('As long as the rule contains more than one service or port, it cannot be edited here.', 'connectivityWizard', 'inboundPolicyEditor')
},
{
k_type: 'k_container',
k_id: 'k_editableRule',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_serviceType',
k_isLabelHidden: true,
k_option: k_tr('Service', 'inboundPolicyEditor'),
k_value: k_CONSTANTS.k_SERVICE_TYPE.k_SERVICE,
k_isChecked: true,
k_onChange: function(k_form, k_item, k_value) {
k_form.k_setDisabled(['service'], kerio.waw.shared.k_CONSTANTS.k_SERVICE_TYPE.k_SERVICE !== k_value);
}
},
{
k_type: 'k_select',
k_id: 'service',
k_isLabelHidden: true,
k_fieldDisplay: 'name',
k_fieldValue: 'id',
k_indent: 1,
k_width: 250,
k_localData: []
},
k_DEFINITIONS.k_get('k_portWithType', {
k_isInsideRadioOption: true
})
]
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Runs on', 'inboundPolicyEditor'),
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_target',
k_isLabelHidden: true,
k_option: k_tr('The Firewall', 'inboundPolicyEditor'),
k_value: k_TARGET_FIREWALL,
k_isChecked: true,
k_onChange: function(k_form, k_item, k_value) {
k_form.k_setDisabled(['destination'], k_form.k_TARGET_FIREWALL === k_value);
}
},
{
k_type: 'k_radio',
k_groupId: 'k_target',
k_isLabelHidden: true,
k_option: k_tr('Host:', 'inboundPolicyEditor'),
k_value: k_TARGET_HOST
},
{
k_id: 'destination',
k_isLabelHidden: true,
k_indent: 1,
k_width: 250,
k_isDisabled: true,
k_maxLength: k_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_hasNoSpaces'
}
}
]
}
]}; k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_title: k_tr('Inbound Policy', 'inboundPolicyEditor'),
k_content: k_form,
k_height: 400,
k_width: 400,
k_defaultItem: 'service',

k_onOkClick: function() {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_dialog = this.k_dialog,
k_form = k_dialog.k_form,
k_data = k_form.k_getData(),
definedService = k_CONSTANTS.k_SERVICE_TYPE.k_SERVICE === k_data.k_serviceType,
k_isTargetFirewall = k_form.k_TARGET_FIREWALL === k_data.k_target,
k_result,
k_portNumbers,
k_i, k_cnt;
if (k_data.port) {
k_portNumbers = k_data.port.split('-');
for (k_i = 0, k_cnt = k_portNumbers.length; k_i < k_cnt; k_i++) {
k_portNumbers[k_i] = parseInt(k_portNumbers[k_i], 10);
}
k_data.port = {
comparator: (-1 !== k_data.port.indexOf('-') ? k_CONSTANTS.PortComparator.Range : k_CONSTANTS.PortComparator.Equal),
ports: k_portNumbers
};
}
k_result = k_dialog.k_callbackSaveData.call(k_dialog.k_parentWidget,
{
k_data: {
definedService: definedService,
service: k_dialog.k_servicesById[k_data.service] || {}, protocol: k_data.protocol || 0, port: k_data.port || {}, destination: k_isTargetFirewall ? '' : k_data.destination
},
k_isEditMode: k_dialog.k_isEditMode,
k_isEditable: k_dialog.k_isEditable,
k_lockedRule: k_dialog.k_lockedRule
});
if (false !== k_result) {
k_dialog.k_hide();
}
else {
k_dialog.k_hideMask();
}
}
}; k_dialogCfg = k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialogCfg.k_hasHelpIcon = false;
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_form.k_addReferences({
k_TARGET_FIREWALL: k_TARGET_FIREWALL,
k_TARGET_HOST: k_TARGET_HOST,
k_radioServiceType: k_form.k_getItem('k_serviceType'),
k_radioTarget: k_form.k_getItem('k_target')
});
k_dialog.k_addReferences({
k_form: k_form,
k_select: k_form.k_getItem('service'),
k_isEditMode: k_isEditMode,
k_servicesById: undefined,
k_serviceList: undefined,
k_editorTypes: undefined,
k_parentWidget: undefined,
k_callbackSaveData: undefined
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_form = this.k_form,
k_rowData = k_params.k_rowData,
k_isTargetFirewall = true,
k_data = {},
k_isEditable;
k_rowData.k_locked = true === k_rowData.k_locked;
k_isEditable = (!k_rowData.k_locked || k_rowData.k_editable);
this.k_parentWidget = k_params.k_parentWidget;
this.k_callbackSaveData = k_params.k_callback;
this.k_servicesById = k_params.k_servicesById;
this.k_serviceList = k_params.k_dataStore.k_services;
this.k_select.k_setData(this.k_serviceList);
this.k_isEditable = k_isEditable;
this.k_lockedRule = (k_rowData.k_locked ? k_rowData.k_rule : false);
this.k_form.k_setVisible(['k_editableRule'], k_isEditable);
this.k_form.k_setVisible(['k_uneditableRule'], !k_isEditable);
this.k_form.k_setVisible(['k_lockedRule'], k_isEditable && k_rowData.k_locked);
if (this.k_isEditMode) {
k_isTargetFirewall = '' === k_rowData.destination;
k_data.k_target = (k_isTargetFirewall ? k_form.k_TARGET_FIREWALL : k_form.k_TARGET_HOST);
if (!k_isTargetFirewall) {
k_data.destination = k_rowData.destination;
}
if (k_isEditable) {
if (k_rowData.k_locked) {
k_rowData = k_rowData.k_data;
}
k_data.k_serviceType = (k_rowData.definedService ? k_CONSTANTS.k_SERVICE_TYPE.k_SERVICE : k_CONSTANTS.k_SERVICE_TYPE.k_PORT);
if (k_rowData.definedService) {
k_data.service = k_rowData.service.id;
}
else {
k_data.protocol = k_rowData.protocol;
k_data.port = k_rowData.port.ports.join('-');
}
}
k_form.k_setData(k_data);
}
}; 
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
} }; 