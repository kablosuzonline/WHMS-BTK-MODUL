
kerio.waw.ui.configurationExport = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_form, k_formCfg,
k_dialog, k_dialogCfg;
if (!kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.finalVersion && kerio.waw.shared.k_methods.k_isIos()) {
kerio.lib.k_reportError('Configuration export editor opened on iOS system.', 'configurationExport');
return;
}
k_formCfg = {
k_hasHelpIcon: false,
k_items: [
{
k_type: 'k_fieldset',
k_id: 'k_exportFieldset',
k_caption: k_tr('Select data you wish to export', 'configurationExport'),
k_items: [
{
k_type: 'k_checkbox',
k_id: 'k_exportConfiguration',
k_isLabelHidden: true,
k_option: k_tr('Configuration', 'configurationExport'),
k_isChecked: true, k_isReadOnly: true },
{
k_type: 'k_checkbox',
k_id: 'k_exportCertificates',
k_isLabelHidden: true,
k_option: k_tr('SSL Certificates', 'configurationExport')
},
{
k_type: 'k_checkbox',
k_id: 'k_exportDhcpLeases',
k_isLabelHidden: true,
k_option: k_tr('DHCP leases', 'configurationExport')
},

{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Exported configuration can be used to restore configuration on the same machine, to migrate current Kerio Control installation to another machine or to share identical configuration on several machines.', 'configurationExport')
}
]
}
] }; k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 400,
k_height: 300,
k_content: k_form,
k_hasHelpIcon: false,
k_title: k_tr('Export Configuration', 'configurationExport'),
k_buttons: [
{
k_isDefault: true,
k_id: 'k_btnOk',
k_caption: k_tr('Export…', 'configurationExport'),
k_mask: {
k_message: k_tr('Preparing configuration for export…', 'configurationExport')
},
k_onClick: this.k_sendData
},
{
k_isCancel: true,
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'common')
}
]
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_requestCfg: {
k_jsonRpc: {
method: 'Configuration.exportConfig'
},
k_callback: function(k_response) {
if (k_response.k_isOk) {
this.k_resetOnClose();
this.k_hide();
}
},
k_scope: k_dialog
}
});
k_form.k_addReferences({
k_dialog: k_dialog,
k_mapping: { k_exportCertificates: 'certificates',
k_exportDhcpLeases: 'dhcpLeases',
k_exportStatistics:   'stats'
}
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({
k_applyParams: this.k_applyParams,
k_resetOnClose: this.k_resetOnClose
}); k_kerioWidget.k_form.k_isChanged = this.k_isChanged;
},

k_applyParams: function(k_params) {
if (k_params) {
this.k_assistent = k_params.k_assistent;
if (k_params.k_assistent) {
k_params.k_assistent.k_hide();
}
}
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); },

k_resetOnClose: function() {
this.k_form.k_reset();
if (this.k_assistent) {
this.k_assistent.k_show();
}
},

k_sendData: function(k_toolbar) {
var
k_dialog = k_toolbar.k_parentWidget,
k_form = k_dialog.k_form,
k_data = k_form.k_getData(),
k_requestCfg = k_dialog.k_requestCfg;
k_data = kerio.waw.shared.k_methods.k_mapProperties(k_data, k_form.k_mapping);
k_requestCfg.k_jsonRpc.params = { options: k_data };
kerio.lib.k_ajax.k_request(k_requestCfg);
},

k_isChanged: function() {
return false;
}
}; 