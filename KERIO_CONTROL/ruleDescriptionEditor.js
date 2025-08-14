
kerio.waw.ui.ruleDescriptionEditor = {

k_init: function(k_objectName) {
var
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_localNamespace;
k_localNamespace = k_objectName + '_';
k_formCfg = {
k_isReadOnly: k_isAuditor,
k_items: [{
k_type: 'k_textArea',
k_id: 'k_description',
k_maxLength: 255,
k_checkByteLength: true,
k_isLabelHidden: true
}]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 450,
k_height: 200,
k_title: k_tr('Description', 'common'),
k_content: k_form,
k_defaultItem: 'k_description',

k_onOkClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData();
}
};
k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialogCfg.k_hasHelpIcon = false;
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_dataStore: {},
k_relatedGrid: {},
k_trTitleHttp: k_tr('HTTP Rule - Description', 'httpRuleEditor'),
k_trTitleFtp: k_tr('FTP Rule - Description', 'ftpRuleEditor'),
k_trTitleTraffic: k_tr('Traffic Rule - Description', 'ruleDescriptionEditor'),
k_trTitleDefault: k_tr('Description', 'common')
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
var
k_data = k_params.k_data,
k_form = this.k_form,
k_title;
switch (k_params.k_parentObjectName) {
case 'k_httpRules':
k_title = this.k_trTitleHttp;
break;
case 'k_ftpRules':
k_title = this.k_trTitleFtp;
break;
case 'trafficPolicyList':
k_title = this.k_trTitleTraffic;
break;
default: k_title = this.k_trTitleDefault;
break;
}
this.k_setTitle(k_title);
this.k_dataStore = k_data;
this.k_relatedGrid = k_params.k_relatedGrid;
k_form.k_setData({k_description: k_data.description}, true);
k_form.k_focus('k_description');
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); }; 
k_kerioWidget.k_sendData = function() {
var
k_relatedGrid;
this.k_dataStore.description = this.k_form.k_getItem('k_description').k_getValue();
k_relatedGrid = this.k_relatedGrid;
k_relatedGrid.k_refresh();
this.k_hide();
if (k_relatedGrid.k_batchId) {
if (k_relatedGrid.k_parentWidget.k_onChangeHandler) {
k_relatedGrid.k_parentWidget.k_onChangeHandler(k_relatedGrid.k_batchId);
}
else {
k_relatedGrid.k_parentWidget.k_parentWidget.k_onChangeHandler(k_relatedGrid.k_batchId);	
}
} else {
kerio.adm.k_framework.k_enableApplyReset();
}
}; 
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}
}; 