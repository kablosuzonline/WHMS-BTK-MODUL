
kerio.waw.ui.domainsAdDomainEditor = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isEditMode = 'domainEdit' === k_objectName,
k_dialog, k_dialogCfg,
k_domainForm, k_domainFormCfg;
k_domainFormCfg = {
k_isDialogLayout: true,
k_hasMapUserOption: false,
k_hasDescription: true
};
k_domainForm = new kerio.adm.k_widgets.K_DomainServices(k_localNamespace + 'k_domainForm', k_domainFormCfg);
k_dialogCfg = {
k_width: 640,
k_height: 620,
k_isResizable: true,
k_content: k_domainForm,
k_defaultItem: 'service.domainName',
k_title: (k_isEditMode)
? k_tr('Edit Domain', 'domainsAdDomainEditor')
: k_tr('Add New Domain', 'domainsAdDomainEditor'),

k_onOkClick: function(k_toolbar) {
var k_dialog = k_toolbar.k_parentWidget;
if (false !== k_dialog.k_form.k_saveData()) { k_dialog.k_hide();
}
}
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_form: k_domainForm,
k_isEditMode: k_isEditMode,
k_saved: false,
k_relatedGrid: null
});
k_domainForm.k_addReferences({
k_dialog: k_dialog,
k_isEditMode: k_isEditMode
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_form = this.k_form;
if (this.k_isEditMode) {
this.k_domainId = k_params.k_data.id;
}
if (false !== kerio.waw.status.k_domainsStore.k_isNew(this.k_domainId)) {
k_params.k_requirePassword = true;
}
this.k_relatedGrid = k_params.k_relatedWidget;
k_params.k_callback = this.k_saveData.createDelegate(this, [], true);
k_form.k_applyParams(k_params);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };

k_kerioWidget.k_saveData = function(k_data) {
var
k_index,
k_id;
if (this.k_isEditMode) {
k_id = this.k_domainId;
kerio.waw.status.k_domainsStore.k_set(this.k_domainId, k_data);
}
else {
k_id = k_data.service.domainName;
kerio.waw.status.k_domainsStore.k_create(k_data);
}
k_index = this.k_relatedGrid.k_findRow('id', k_id);
if (-1 !== k_index) {
this.k_relatedGrid.k_selectRows(k_index);
}
};
k_kerioWidget.k_focusPassword = function() {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
this.k_focus('service.password');
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
};
} }; 