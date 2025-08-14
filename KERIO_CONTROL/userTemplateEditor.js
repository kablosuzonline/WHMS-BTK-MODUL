
kerio.waw.ui.userTemplateEditor = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_widgets = kerio.waw.shared.k_widgets,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_rightsForm,
k_quotaForm,
k_preferencesForm,
k_dialogContentCfg,
k_dialogContent,
k_dialogCfg,
k_dialog;
k_rightsForm      = new k_widgets.K_TabRights(k_localNamespace + 'k_rights', { k_isAuditor: k_isAuditor });
k_quotaForm       = new k_widgets.K_TabQuota(k_localNamespace + 'k_quota', { k_isAuditor: k_isAuditor });
k_preferencesForm = new k_widgets.K_TabPreferences(k_localNamespace + 'k_preferences', { k_isAuditor: k_isAuditor });
k_dialogContentCfg = {
k_items: [
{
k_content: k_rightsForm,
k_caption: k_tr('Rights', 'common'),
k_id: 'k_rightsPage'
},
{
k_content: k_quotaForm,
k_caption: k_tr('Quota', 'userList'),
k_id: 'k_quotaPage'
},
{
k_content: k_preferencesForm,
k_caption: k_tr('Preferences', 'userList'),
k_id: 'k_preferencesPage'
}
]
};
k_dialogContent = new k_lib.K_TabPage(k_localNamespace + 'k_tabs'    , k_dialogContentCfg);
k_dialogCfg = {
k_width: 470,
k_height: 530,
k_title: k_tr('User Template for Current Domain' , 'templateEditor'),
k_content: k_dialogContent,
k_buttons: [
{	k_isDefault: true,
k_id: 'k_dialogBtnOK',
k_caption: k_tr('OK', 'common'),
k_mask: {
k_message: k_tr('Saving…', 'common')
},
k_isHidden: k_isAuditor,

k_onClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData.call(k_toolbar.k_dialog);
}
},
{	k_isCancel: true,
k_id: 'k_dialogBtnCancel',
k_caption: (k_isAuditor) ? k_tr('Close', 'common') : k_tr('Cancel', 'common')
}
]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
this.k_addControllers(k_dialog);
k_dialog.k_addReferences(
{
k_rightsForm: k_rightsForm,
k_quotaForm: k_quotaForm,
k_preferencesForm: k_preferencesForm,
k_dialogContent: k_dialogContent,
k_domainId: '',
k_relatedGrid: {},
k_loadingMessage: k_tr('Loading…', 'common'),
k_templateStored: {}
}
);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
this.k_domainId = k_params.k_domainId;
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_dialogContent.k_setActiveTab('k_rightsPage');
this.k_loadData();
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };
k_kerioWidget.k_loadData = function(k_response){
var
k_dialog = this,
k_dataStore = kerio.waw.shared.k_data.k_getStore('k_domains'),
k_tr = kerio.lib.k_tr,
k_rightsForm = k_dialog.k_rightsForm,
k_quotaForm = k_dialog.k_quotaForm,
k_preferencesForm = k_dialog.k_preferencesForm,
k_domainData,
k_domainName,
k_templateData;
if (!k_dataStore.k_isLoaded()) {
return;
}
k_domainData = k_dataStore.k_domains.k_data[this.k_domainId];
k_domainName = k_domainData.service.domainName;
k_templateData = k_domainData.templateData;
delete(k_domainData.service.password);
k_dialog.k_domainData = k_domainData;
if (k_domainData.id === kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE) {
k_domainName = k_tr('Local User Database', 'common');
}
k_dialog.k_setTitle(k_tr(	'User Template for \'%1\' Domain', 'templateEditor',
{k_args : [k_domainName]}));
k_rightsForm.k_setRightsData(k_templateData.rights);
k_quotaForm.k_setQuotaData(k_templateData.quota);
k_preferencesForm.k_setPreferencesData(k_templateData);
this.k_relatedGrid.k_domainsDataStore.k_setDomainTemplateData(this.k_domainId, k_templateData);this.k_hideMask();
};
k_kerioWidget.k_resetOnClose = function() {
this.k_rightsForm.k_reset();
this.k_quotaForm.k_reset();
this.k_preferencesForm.k_reset();
};

k_kerioWidget.k_sendData = function(){
var
k_dialog = this,
k_templateData,
k_data;
k_templateData = k_dialog.k_preferencesForm.k_getPreferencesData();
k_templateData.rights = k_dialog.k_rightsForm.k_getRightsData();
k_templateData.quota = k_dialog.k_quotaForm.k_getQuotaData();
k_data = k_dialog.k_domainData;
k_data.templateData = k_templateData;
k_data = {
"domainIds": [k_dialog.k_domainId],
"pattern": k_data
};
this.k_templateStored = k_templateData;
kerio.waw.requests.k_sendBatch([
{
k_jsonRpc: {
method: 'Domains.set',
params: k_data
}
},
{
k_jsonRpc: {
method: 'Domains.apply'
}
}
], {
k_callback: k_dialog.k_sendDataCallback,
k_scope: this
});
};
k_kerioWidget.k_sendDataCallback = function(k_response, k_success) {
if (k_success && kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
this.k_relatedGrid.k_domainsDataStore.k_setDomainTemplateData(this.k_domainId, this.k_templateStored);this.k_hide();
this.k_relatedGrid.k_initGridData();
}
};}}; 