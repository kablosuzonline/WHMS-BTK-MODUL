
kerio.waw.ui.interfaceRasScriptsEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_trArgs = { k_args: ['%1'] },
k_formCfg, k_form,
k_dialogCfg, k_dialog,
k_textBdScriptEnabled,
k_textAdScriptEnabled,
k_textBhScriptEnabled,
k_textAhScriptEnabled;
k_textBdScriptEnabled = k_tr('Execute "%1" before dial', 'interfaceRasScriptsEditor',    k_trArgs);
k_textAdScriptEnabled = k_tr('Execute "%1" after dial', 'interfaceRasScriptsEditor',     k_trArgs);
k_textBhScriptEnabled = k_tr('Execute "%1" before hang-up', 'interfaceRasScriptsEditor', k_trArgs);
k_textAhScriptEnabled = k_tr('Execute "%1" after hang-up', 'interfaceRasScriptsEditor',  k_trArgs);
k_formCfg = {
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('External command', 'interfaceRasScriptsEditor'),
k_items: [
{
k_type: 'k_checkbox',
k_id: 'bdScriptEnabled',
k_option: k_textBdScriptEnabled,
k_isLabelHidden: true
},
{
k_type: 'k_checkbox',
k_id: 'adScriptEnabled',
k_option: k_textAdScriptEnabled,
k_isLabelHidden: true
},
{
k_type: 'k_checkbox',
k_id: 'bhScriptEnabled',
k_option: k_textBhScriptEnabled,
k_isLabelHidden: true
},
{
k_type: 'k_checkbox',
k_id: 'ahScriptEnabled',
k_option: k_textAhScriptEnabled,
k_isLabelHidden: true
}
] }
] };k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_height: 235,
k_width: 530,
k_content: k_form,
k_title: k_tr('Interface properties', 'interfaceEditor'),
k_defaultItem: null,

k_onOkClick: function(k_toolbar){
k_toolbar.k_dialog.k_saveData();
} }; k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
this.k_addControllers(k_dialog);
if (k_isAuditor) {
k_form.k_setReadOnlyAll();
}
k_dialog.k_addReferences(
{	k_objectName: k_objectName,
k_isAuditor: k_isAuditor,
k_form: k_form,
k_textBdScriptEnabled: k_textBdScriptEnabled,
k_textAdScriptEnabled: k_textAdScriptEnabled,
k_textBhScriptEnabled: k_textBhScriptEnabled,
k_textAhScriptEnabled: k_textAhScriptEnabled,
k_scriptBd: 'scripts\\BeforeDial.cmd',
k_scriptAd: 'scripts\\AfterDial.cmd',
k_scriptBh: 'scripts\\BeforeHangup.cmd',
k_scriptAh: 'scripts\\AfterHangup.cmd'
}
);k_form.k_addReferences({
k_dialog: k_dialog,
k_checkboxBdScriptEnabled: k_form.k_getItem('bdScriptEnabled'),
k_checkboxAdScriptEnabled: k_form.k_getItem('adScriptEnabled'),
k_checkboxBhScriptEnabled: k_form.k_getItem('bhScriptEnabled'),
k_checkboxAhScriptEnabled: k_form.k_getItem('ahScriptEnabled')
});return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_data = k_params.k_data,
k_form = this.k_form,
k_name = undefined === k_data.name ? '' : (' ' + k_data.name);
k_form.k_checkboxBdScriptEnabled.k_setOption(this.k_textBdScriptEnabled.replace('%1', this.k_scriptBd + k_name));
k_form.k_checkboxAdScriptEnabled.k_setOption(this.k_textAdScriptEnabled.replace('%1', this.k_scriptAd + k_name));
k_form.k_checkboxBhScriptEnabled.k_setOption(this.k_textBhScriptEnabled.replace('%1', this.k_scriptBh + k_name));
k_form.k_checkboxAhScriptEnabled.k_setOption(this.k_textAhScriptEnabled.replace('%1', this.k_scriptAh + k_name));
k_form.k_setData(k_data.ras, true);
this.k_parent = k_params.k_parent;
this.k_callback = k_params.k_callback;
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };
k_kerioWidget.k_saveData = function() {
var
k_data = this.k_form.k_getData(true);
this.k_callback.call(this.k_parent, { ras: k_data });
this.k_hide();
};
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}}; 