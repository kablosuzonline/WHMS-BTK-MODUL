
kerio.waw.ui.contentFilterActionEditor = {

k_init: function(k_objectName) {
var
k_localName = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_DEFINITIONS = k_shared.k_DEFINITIONS,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_CONTENT_FILTER_EMAIL_INTERVAL = Math.round(k_CONSTANTS.k_CONTENT_FILTER_EMAIL_INTERVAL/36)/100, k_form, k_formCfg,
k_dialog, k_dialogCfg;
k_formCfg = {
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Action', 'common'),
k_items: [
k_DEFINITIONS.k_get('k_policySelectAction',
{
k_id: 'action',
k_caption: k_tr('Action:', 'trafficActionEditor'),
k_emptyText: k_tr('Select action', 'list'),
k_onChange: function(k_form, k_select, k_value) {
var
RuleAction = kerio.waw.shared.k_CONSTANTS.RuleAction,
k_allowAction = RuleAction.Allow === k_value,
k_isDenyAction = RuleAction.Deny === k_value;
k_form.k_setDisabled(['skipAvScan', 'skipKeywords', 'skipAuthentication', 'k_redirectRow', 'k_denialConditionFieldset'], true);
k_form.k_setDisabled(['skipAvScan', 'skipKeywords', 'skipAuthentication'], !k_allowAction);
k_form.k_setDisabled(['k_redirectRow', 'k_denialConditionFieldset'], !k_isDenyAction);
},
k_clearEmptyValue: true,
k_isAutoLabelWidth: true
}),
{
k_id: 'logEnabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Log the traffic', 'contentFilterActionEditor')
},
{
k_id: 'skipAvScan',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Skip Antivirus scanning', 'contentFilterActionEditor')
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('HTTP Actions', 'contentFilterActionEditor'),
k_items: [
{
k_id: 'skipKeywords',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Skip Forbidden words filtering', 'contentFilterActionEditor')
},
{
k_id: 'skipAuthentication',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Do not require authentication', 'contentFilterActionEditor')
},
{
k_type: 'k_row',
k_id: 'k_redirectRow',
k_items: [
{
k_id: 'denialCondition.redirectUrl.enabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Redirect to:', 'contentFilterActionEditor'),
k_onChange: function(k_form, k_item, k_value) {
k_form.k_redirectUrlField.k_setDisabled(!k_value);
if (k_value) {
k_form.k_redirectUrlField.k_focus();
}
}
},
{
k_id: 'denialCondition.redirectUrl.value',
k_isLabelHidden: true,
k_isDisabled: true,
k_width: '100%'
}
]
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Deny Text', 'contentFilterActionEditor'),
k_id: 'k_denialConditionFieldset',
k_items: [
{
k_type: 'k_textArea',
k_id: 'denialCondition.denialText',
k_isLabelHidden: true,
k_height: 60,
k_maxLength: 1023,
k_checkByteLength: true
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Text will be always displayed on HTTP deny page', 'contentFilterActionEditor')
},
{
k_id: 'denialCondition.sendEmail',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Send email notification to user for non-HTTP connections', 'contentFilterActionEditor')
},
{
k_id: 'k_emailInterval',
k_type: 'k_display',
k_isLabelHidden: true,
k_indent: 1,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('User will receive max one notification per %1 [hour|hours] for each rule', 'contentFilterActionEditor', {k_args: [k_CONTENT_FILTER_EMAIL_INTERVAL], k_pluralityBy: 1 > k_CONTENT_FILTER_EMAIL_INTERVAL ? 1 : k_CONTENT_FILTER_EMAIL_INTERVAL})
}
]
}
]
};
k_form = new k_lib.K_Form(k_localName + 'k_form', k_formCfg);
k_form.k_addReferences({
k_redirectUrlField: k_form.k_getItem('denialCondition.redirectUrl.value')
});
k_dialogCfg = {
k_title: k_tr('Content Rule - Action', 'contentFilterActionEditor'),
k_content: k_form,
k_minHeight: 525,
k_height: 525,
k_width: 450,
k_minWidth: 450,
k_defaultItem: 'action',
k_onOkClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_saveData();
}
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_originData: {},
k_form: k_form,
k_parentGrid: null,
k_callbackSaveData: null
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_applyParams = function(k_params) {
var
k_data = k_params.k_data,
k_time;
this.k_originData = k_data;
this.k_form.k_setData(k_data);
this.k_parentGrid = k_params.k_relatedGrid;
this.k_callbackSaveData = k_params.k_callback;
};
k_kerioWidget.k_saveData = function() {
var
RuleAction = kerio.waw.shared.k_CONSTANTS.RuleAction,
k_data = this.k_form.k_getData();
if ('' === k_data.action) {
kerio.waw.shared.k_methods.k_alertError(kerio.lib.k_tr('Please set the action!', 'list'));
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
return false;
}
if (RuleAction.Deny === k_data.action && '' === k_data.denialCondition.redirectUrl.value) {
k_data.denialCondition.redirectUrl.enabled = false;
}
this.k_callbackSaveData.call(this.k_parentGrid, { k_data: k_data });
this.k_hide();
return true;
};
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}
}; 