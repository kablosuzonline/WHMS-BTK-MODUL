
kerio.waw.ui.interfaceAdvancedRuleEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_isAddMode = 'interfaceAdvancedRuleEditorAdd' === k_objectName,
k_formCfg, k_form,
k_dialogCfg, k_dialog;
k_formCfg = {
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('DNS name', 'common')
},
{
k_id: 'dnsName',
k_isLabelHidden: true,
k_maxLength: k_shared.k_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_container',
k_labelWidth:25,
k_indent: 1,
k_items: [
{
k_type: 'k_radio',
k_groupId: 'dialEnabled',
k_value: true,
k_option: '<span class="ruleProperties radio">&nbsp; &nbsp; &nbsp; &nbsp;</span>' + k_tr('Dial', 'interfaceList')
},
{
k_type: 'k_radio',
k_groupId: 'dialEnabled',
k_value: false,
k_option: '<span class="ruleProperties radio block">&nbsp; &nbsp; &nbsp; &nbsp;</span>' + k_tr('Ignore', 'common')
}
]
}
] };k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_height: 200,
k_width: 300,
k_title: k_tr('DNS rule', 'common'),
k_content: k_form,
k_defaultItem: 'dnsName',

k_onOkClick: function(k_toolbar){
k_toolbar.k_dialog.k_saveData();
} }; k_dialogCfg = k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
this.k_addControllers(k_dialog);
if (k_isAuditor) {
k_form.k_setReadOnlyAll();
}
k_dialog.k_addReferences(
{	k_objectName: k_objectName,
k_isAuditor: k_isAuditor,
k_isAddMode: k_isAddMode,
k_form: k_form
}
);k_form.k_addReferences(
{
k_dialog: k_dialog
}
);return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
if (this.k_isAddMode) {
k_params.k_data = undefined; }
var k_dataStore = k_params.k_data ||
{ dnsName: '', dialEnabled: true}; this.k_dataStore = k_params; this.k_form.k_setData(k_dataStore);
this.k_parent = k_params.k_relatedWidget;
this.k_callback = k_params.k_callback;
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };

k_kerioWidget.k_saveData = function() {
var
k_data = this.k_form.k_getData(true),
k_dataStore = this.k_dataStore;
if (this.k_isAddMode) {
k_dataStore.k_data = k_data;
}
else {
k_dataStore.k_data = kerio.lib.k_cloneObject(k_data);
}
this.k_callback.call(this.k_parent, k_dataStore);
this.k_hide();
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}
}; 