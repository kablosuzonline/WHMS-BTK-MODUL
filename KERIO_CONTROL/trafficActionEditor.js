
kerio.waw.ui.trafficActionEditor = {
k_init: function(k_objectName) {
var
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_DEFINITIONS = k_shared.k_DEFINITIONS,
RuleAction = k_WAW_CONSTANTS.RuleAction,
k_localNamespace = k_objectName + '_',
k_tr = kerio.lib.k_tr,
k_actionChangedObserver,
k_form, k_formCfg,
k_dialog, k_dialogCfg,
k_selectAction;
k_actionChangedObserver = function(k_form, k_select, k_value) {
var
RuleAction = k_form.RuleAction;
k_form.k_setDisabled(['k_logConnections', 'k_fieldsetQos'], RuleAction.Allow !== k_value);
};
k_formCfg = {
k_useStructuredData: true,
k_labelWidth: 120,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Action', 'trafficActionEditor'),
k_items: [
k_DEFINITIONS.k_get('k_policySelectAction',
{
k_id: 'action',
k_caption: k_tr('Action:', 'trafficActionEditor'),
k_emptyText: k_tr('Select action', 'list'),
k_onChange: k_actionChangedObserver,
k_clearEmptyValue: true
}),
{
k_type: 'k_checkbox',
k_id: 'k_graphEnabled',
k_caption: k_tr('Accounting:', 'trafficActionEditor'),
k_option: k_tr('Internet traffic chart', 'trafficActionEditor'),
k_value: false,
k_isChecked: false
},
{
k_type: 'k_checkbox',
k_id: 'k_logPackets',
k_caption: ' ',
k_option: k_tr('Log packets', 'trafficActionEditor'),
k_value: false,
k_isChecked: false
},
{
k_type: 'k_checkbox',
k_id: 'k_logConnections',
k_caption: ' ',
k_option: k_tr('Log connections', 'trafficActionEditor'),
k_value: false,
k_isChecked: false,
k_isDisabled: true
}
] }, {
k_type: 'k_fieldset',
k_caption: k_tr('QoS', 'trafficActionEditor'),
k_id: 'k_fieldsetQos',
k_isDisabled: true,
k_labelWidth: 130,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'dscp.enabled',
k_isLabelHidden: true,
k_option: k_tr('Mark packets with DSCP', 'trafficActionEditor'),
k_onChange: function(k_form, k_item, k_value) {
k_form.k_setDisabled(['dscp.value'], !k_value);
}
},
{
k_type: 'k_number',
k_caption: k_tr('DSCP value (0 - 63):', 'trafficActionEditor'),
k_id: 'dscp.value',
k_isDisabled: true,
k_indent: 1,
k_width: 40,
k_value: 0,
k_minValue: 0,
k_maxValue: 63,
k_maxLength: 2,
k_validator: {
k_allowBlank: false
}
}
] } ] }; k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_selectAction = k_form.k_getItem('action');
k_dialogCfg = {
k_width: 430,
k_height: 320,
k_content: k_form,
k_defaultItem: k_selectAction.k_id,
k_title: k_tr('Traffic Rule - Action', 'trafficActionEditor'),

k_onOkClick: function(k_toolbar) {
var
k_dialog = k_toolbar.k_parentWidget,
k_form = k_dialog.k_form,
k_formData = k_form.k_getData(true),
k_data,
k_result;
if ('' === k_formData.action) {
kerio.waw.shared.k_methods.k_alertError(kerio.lib.k_tr('Please set the action!', 'list'));
return false;
}
k_data = {
action: k_formData.action,
graphEnabled: k_formData.k_graphEnabled,
logEnabled: [k_formData.k_logPackets, k_formData.k_logConnections],
dscp: k_formData.dscp
};
k_result = k_dialog.k_callbackSaveData.call(k_dialog.k_parentWidget, { k_data: k_data });
if (false !== k_result) {
k_dialog.k_hide();
return true;
}
return false;
}
}; k_dialog = new kerio.lib.K_Dialog(k_objectName, k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_form: k_form,
k_actionChangedObserver: k_actionChangedObserver,
k_selectAction: k_selectAction,
k_parentWidget: undefined,
k_callbackSaveData: undefined
});
k_form.k_addReferences({
k_dialog: k_dialog,
RuleAction: RuleAction
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_TRAFFIC_RULE_LOG_INDEX = kerio.waw.shared.k_CONSTANTS.k_TRAFFIC_RULE_LOG_INDEX,
k_form = this.k_form,
k_data = kerio.lib.k_cloneObject(k_params.k_data);
this.k_parentWidget = k_params.k_relatedGrid;
this.k_callbackSaveData = k_params.k_callback;
this.k_selectAction.k_setVisibleItem(k_form.RuleAction.Allow, !k_data.k_isDefaultRule);
this.k_form.k_setReadOnly('k_graphEnabled', true === k_data.k_isDefaultRule); if (k_form.RuleAction.NotSet === k_data.action) {
k_data.action = '';
}
k_form.k_setData(k_data, true);
k_form.k_getItem('k_graphEnabled').k_setValue(k_data.graphEnabled);
k_form.k_getItem('k_logPackets').k_setValue(k_data.logEnabled[k_TRAFFIC_RULE_LOG_INDEX.k_PACKETS]);
k_form.k_getItem('k_logConnections').k_setValue(k_data.logEnabled[k_TRAFFIC_RULE_LOG_INDEX.k_CONNECTIONS]);
this.k_actionChangedObserver(k_form, this.k_selectAction, k_data.action);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); }; k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
} }; 