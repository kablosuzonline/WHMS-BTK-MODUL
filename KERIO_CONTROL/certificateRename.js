

kerio.adm.k_widgets.certificateRename = {

k_init: function(k_objectName, k_initParams) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_managerName = k_initParams.k_managerName,
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_localNamespace;
k_localNamespace = k_objectName + '_';
k_formCfg = {
k_items: [{
k_id: 'name',
k_caption: k_tr('Name:', 'wlibCertificateRename')
}]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 300,
k_height: 120,
k_title: k_tr('Rename Certificate', 'wlibCertificateRename'),
k_hasHelpIcon: false,
k_content: k_form,
k_defaultItem: k_form.k_getItem('name').k_id,
k_buttons: [{
k_id: 'k_btnOk',
k_isDefault: true,
k_caption: k_tr('OK', 'wlibButtons'),

k_onClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_showMask();
k_toolbar.k_parentWidget.k_sendData();
}
}, {
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'wlibButtons'),
k_isCancel: true
}]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_form.k_addReferences({
k_dialog: k_dialog,
k_parentDialog: undefined
});
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_form: k_form,
k_sendDataRequest: {
k_jsonRpc: {
method: k_managerName + '.setName',
params: {}
},
k_scope: k_dialog,
k_callback: k_dialog.k_sendDataCallback
}
});
return k_dialog;
},

k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_dataId = k_params.k_data.id;
this.k_form.k_setData(k_params.k_data);
};

k_kerioWidget.k_sendData = function() {
var
k_formData = this.k_form.k_getData(),
k_sendDataRequest = this.k_sendDataRequest,
k_params = k_sendDataRequest.k_jsonRpc.params;
k_params.id = this.k_dataId;
k_params.name = k_formData.name;
kerio.lib.k_ajax.k_request(k_sendDataRequest);
};

k_kerioWidget.k_sendDataCallback = function(k_response, k_success) {
if (!k_success || !k_response.k_isOk) {
this.k_hideMask();
return;
}
this.k_hide();
kerio.adm.k_framework.k_enableApplyReset(true);this.k_relatedGrid.k_reloadData();
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}
};
