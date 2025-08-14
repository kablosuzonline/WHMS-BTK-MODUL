
kerio.waw.ui.sslCertificateDetails = {

k_init: function(k_objectName) {
var
k_gridCfg,
k_grid,
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_localNamespace,
k_dialogButtonsCfg,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor();
this.k_publicName = k_objectName; k_localNamespace = k_objectName + '_';
k_gridCfg = {
k_settingsId: 'sslCertificateDetails',
k_columns: {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_sorting: false,
k_grouping: {
k_columnId: 'groupName',
k_isMemberIndented: true
},
k_items: [
{	k_columnId: 'groupName',
k_isMemberIndented: true,
k_isKeptHidden: true
},
{	k_columnId: 'name',
k_caption: k_tr('Name', 'common'),
k_width: 150
},
{	k_columnId: 'value',
k_caption: k_tr('Value', 'common')
}
]
},
k_localData: []
};k_grid = new kerio.lib.K_Grid(k_localNamespace + 'grid', k_gridCfg);
k_formCfg = {
k_restrictBy: {
k_isIos: kerio.waw.shared.k_methods.k_isIos()
},
k_isReadOnly: k_isAuditor,
k_items: [
{	k_type: 'k_fieldset',
k_caption: k_tr('Attributes', 'sslCertificate'),
k_items: [
{
k_type: 'k_display',
k_id: 'k_successMessage',
k_isLabelHidden: true,
k_value: ''
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Do you want to accept this certificate?', 'sslCertificate')
},
{	k_type: 'k_container',
k_content: k_grid,
k_height: 270,
k_width: 300
},
kerio.waw.shared.k_methods.k_getSslCertificateFields('k_details')
]
}
]
};k_dialogButtonsCfg = [
{	k_id: 'k_btnAccept',
k_caption: k_tr('Accept Certificate', 'common'),

k_onClick: function() {
var
k_dialog = this.k_parentWidget;
if (k_dialog.k_acceptMethod) {
k_dialog.k_acceptMethod.call(k_dialog, k_dialog.k_sslCertificate);
return;
}
k_dialog.k_showMask(kerio.lib.k_tr('Saving certificate…', 'sslCertificate'));
kerio.lib.k_ajax.k_request(
{
k_jsonRpc: {
method: 'Certificates.set',
params: {
id: k_dialog.k_importId,
type: k_dialog.k_detailsDialog.k_parentForm.k_CERTIFICATE_TYPE
}
},
k_callback:k_dialog.k_setCertificateCallback,
k_scope: k_dialog
}
);
}},
{	k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'common'),
k_isCancel: true,

k_onClick: function() {
var
k_dialog = this.k_parentWidget;
if (k_dialog.k_cancelMethod) {
k_dialog.k_cancelMethod.call(k_dialog, k_dialog.k_sslCertificate);
return;
}
k_dialog.k_showMask(kerio.lib.k_tr('Discarding the certificate…', 'sslCertificate'));
kerio.lib.k_ajax.k_request(
{
k_jsonRpc: {
method: 'Certificates.discard',
params: {
ids: [k_dialog.k_importId]
}
},
k_callback:k_dialog.k_discardCertificateCallback,
k_scope: k_dialog
}
);
}}
];k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 535,
k_height: 620,
k_title: k_tr('Confirm SSL Certificate', 'sslCertificate'),
k_content: k_form,
k_buttons: k_dialogButtonsCfg
};k_dialog = new k_lib.K_Dialog(this.k_publicName, k_dialogCfg);
k_form.k_addReferences(
{	k_dialog: k_dialog,
k_successMessageElement: k_form.k_getItem('k_successMessage')
}
);
k_dialog.k_addReferences(
{	k_form: k_form,
k_grid: k_grid,
k_importId: undefined,
k_sslCertificate: undefined,
k_acceptMethod: undefined,
k_cancelMethod: undefined,
k_parentDialog: undefined,
k_translations: {
k_issuer: k_tr('Issuer', 'sslCertificate'),
k_subject: k_tr('Subject', 'sslCertificate'),
k_notSpecified: '<' + k_tr('not specified', 'common') + '>',
k_certificateProperties: {
hostname: k_tr('Hostname', 'sslCertificate'),
organizationName: k_tr('Organization name', 'sslCertificate'),
organizationalUnitName: k_tr('Organizational Unit', 'sslCertificate'),
city: k_tr('City', 'sslCertificate'),
state: k_tr('State or Province', 'sslCertificate'),
country: k_tr('Country', 'sslCertificate')
}
},
k_detailsDialog: {},
k_parentForm: {}
}
);this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
var
k_sslCertificate = k_params.k_data.k_sslCertificate,
k_translations = this.k_translations,
k_notSpecifiedTranslation = k_translations.k_notSpecified,
k_propertiesTranslations = k_translations.k_certificateProperties,
k_typeTranslation = {
'issuer': k_translations.k_issuer,
'subject': k_translations.k_subject
},
k_data = {
'issuer': k_sslCertificate.issuer,
'subject': k_sslCertificate.subject
},
k_gridData = [],
k_properties,
k_propertyItem,
k_type,
k_property;
for (k_type in k_data) {
if ('object' !== typeof k_data[k_type]) {
continue;
}
k_properties = k_data[k_type];
for (k_property in k_properties) {
if ('object' !== typeof k_properties[k_property]) {
continue;
}
k_propertyItem = k_properties[k_property];
k_gridData.push(
{	groupName: k_typeTranslation[k_type],
name: k_propertiesTranslations[k_propertyItem.name],
value: ('' !== k_propertyItem.value ? k_propertyItem.value : k_notSpecifiedTranslation)
}
);
}}
this.k_grid.k_setData(k_gridData);
if (k_params.k_parent) {
this.k_parentDialog = k_params.k_parent;
}
this.k_form.k_successMessageElement.k_setValue(k_params.k_data.k_successMessage);
this.k_importId = k_params.k_data.k_importId;
this.k_acceptMethod = k_params.k_acceptMethod;
this.k_cancelMethod = k_params.k_cancelMethod;
if (this.k_parentDialog.k_parentDialog) { this.k_detailsDialog = this.k_parentDialog.k_parentDialog;
this.k_form.k_setVisible( 'k_restartWarning',
(
kerio.waw.shared.k_methods.k_isConnectionSecured()
&& kerio.waw.shared.k_CONSTANTS.k_CERTIFICATE_TYPE.k_WEBIFACE === this.k_detailsDialog.k_parentForm.k_CERTIFICATE_TYPE
)
);
}
this.k_setChanged(true); if (k_params.k_parentForm) {
this.k_parentForm = k_params.k_parentForm;
}
this.k_sslCertificate = k_sslCertificate;
kerio.waw.shared.k_methods.k_fillSslCertificateFields(this.k_form, {_k_fieldPrefix: ''}, k_sslCertificate);
kerio.waw.shared.k_data.k_cache({
k_dialog: this
});
};
k_kerioWidget.k_setCertificateCallback = function(k_response, k_success) {
if (k_success && k_response.k_isOk) {
this.k_certificateAccepted(this.k_sslCertificate);
}
this.k_hide();
};
k_kerioWidget.k_certificateAccepted = function(k_sslCertificate) {
var
k_certificateDetailsDialog = this.k_detailsDialog,
k_interfaceListGrid = k_certificateDetailsDialog.k_parentDialog.k_relatedGrid;
if (this.k_restartWaw()) {
return;
}
k_certificateDetailsDialog.k_applyParams(
{k_data: {	k_sslCertificate:k_sslCertificate
}
}
);
kerio.waw.shared.k_methods.k_setSslCertificateFieldsetData({k_form: k_certificateDetailsDialog.k_parentForm}, k_sslCertificate);
if (k_interfaceListGrid) {
k_interfaceListGrid.k_sslCertificate = k_sslCertificate;
}
};
k_kerioWidget.k_discardCertificateCallback = function() {
this.k_hide();
};}
}; 