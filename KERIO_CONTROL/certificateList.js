

kerio.waw.shared.k_widgets.K_CertificateGrid = function(k_id, k_config){
var
k_showApplyReset = ('function' === typeof k_config.k_onApply), k_groupActions = true, k_supportAuthorities = (true === k_config.k_supportAuthorities),
k_supportActiveCertificate = (false  !== k_config.k_supportActiveCertificate),
k_supportPkcsFormat = (true === k_config.k_supportPkcsFormat),
k_canRename = (true === k_config.k_supportRename),
k_canSearch = (undefined !== k_config.k_searchBy), k_sharedConstants = kerio.lib.k_getSharedConstants(),
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_toolbarCfg,
k_toolbar,
k_gridCfg,
k_rendererSslName,
k_rendererSslType,
k_rendererHostname,
k_rendererIssuer,
k_rendererSubject,
k_rendererExpires,
k_rendererValidFrom,
k_onClickImportButton;
k_config.k_managerName = k_config.k_managerName || 'Certificates';

k_onClickImportButton = function(k_toolbar, k_item) {
k_toolbar.k_parentWidget.k_openImportDialog(k_item.k_name);
};
k_toolbarCfg = {
k_items: [
{
k_restrictions: {
k_isAuditor: [false]
},
k_id: 'k_btnNew',
k_caption: k_tr('Add', 'wlibButtons'),
k_isMenuButton: true,
k_isDisabled: k_isAuditor,
k_isVisibleInToolbar: true,
k_items: [
{
k_restrictions: {
k_supportAuthorities: [true]
},
k_id: 'k_btnRecreate',
k_caption: k_tr('New Certificate for Local Authority…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_openRequestDialog(kerio.lib.k_getSharedConstants('kerio_web_LocalAuthority'));
}
},
{
k_id: 'k_btnNewRequest',
k_caption: k_tr('New Certificate Request…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_openRequestDialog(kerio.lib.k_getSharedConstants('kerio_web_CertificateRequest'));
}
},
{
k_id: 'k_btnNewCertificate',
k_caption: k_tr('New Certificate…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
var
k_lib = kerio.lib,
k_grid = k_toolbar.k_parentWidget,
k_localAuthority = k_grid.k_getLocalAuthority(false),
k_serverTime = new Date() - (kerio.waw.shared.k_CONSTANTS.k_CLIENT_SERVER_OFFSET_SECONDS * 1000),
k_tr = k_lib.k_tr,
k_warningMessage = '';
if (k_grid.k_supportAuthorities && null === k_localAuthority) { k_warningMessage = [
k_tr('Cannot create new certificate when there is no Local Authority to sign the certificate with. Please create new Local Authority first.', 'wlibCertificateList'),
'<br><br><b>',
k_tr('Do you want to create the Local Authority now?', 'wlibCertificateList')
].join('');
}
else if (k_serverTime > new Date(k_localAuthority.expires)) {
k_warningMessage = [
k_tr('Cannot create a new certificate when the Local Authority is expired. Please recreate the Local Authority first.', 'wlibCertificateList'),
'<br><br><b>',
k_tr('Do you want to recreate the Local Authority now?', 'wlibCertificateList')
].join('');
}
if (k_warningMessage) {
k_lib.k_confirm({
k_title: k_tr('Certificates', 'wlibCertificateList'),
k_msg: k_warningMessage,
k_icon: 'warning',
k_scope: k_grid,
k_callback: function(k_answer) {
if ('yes' === k_answer) {
this.k_openRequestDialog(kerio.lib.k_getSharedConstants('kerio_web_LocalAuthority'));
}
}
});
return;
}
k_toolbar.k_parentWidget.k_openRequestDialog(k_lib.k_getSharedConstants('kerio_web_InactiveCertificate'));
}
}
]
},
{
k_restrictions: {
k_groupActions: [true],
k_isAuditor: [false]
},
k_id: 'k_btnRemove',
k_isDisabled: true,
k_caption: k_tr('Remove', 'wlibButtons'),

k_onClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_removeData();
}
},
'-',
{
k_restrictions: {
k_canRename: [true],
k_isAuditor: [false]
},
k_id: 'k_btnRename',
k_isDisabled: true,
k_caption: k_tr('Rename…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
var
k_grid = k_toolbar.k_parentWidget,
k_data = k_grid.k_selectionStatus.k_rows[0].k_data;
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'certificateRename',
k_initParams: {
k_managerName: k_grid.k_config.k_managerName
},
k_params: {
k_relatedGrid: k_grid,
k_data: k_data
}
});
}
},
{
k_restrictions: {
k_isAuditor: [false]
},
k_id: 'k_btnDistrust',
k_isDisabled: true,
k_caption: k_tr('Distrust', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
var
k_grid = this.k_relatedWidget,
k_selectionStatus = k_grid.k_selectionStatus,
k_tr = kerio.lib.k_tr,
k_msg,
k_rowData;
if (1 === k_selectionStatus.k_selectedRowsCount){
k_rowData = k_selectionStatus.k_rows[0].k_data;
k_msg = k_tr('Do you really want to distrust "%1"?', 'accountingList', {k_args: [ k_rowData.name ]});
}
else {
k_msg = k_tr('Do you really want to distrust %1 [certificate|certificates]?', 'accountingList', {k_args: [ k_selectionStatus.k_selectedRowsCount ], k_pluralityBy: k_selectionStatus.k_selectedRowsCount});
}
kerio.lib.k_confirm({
k_title: k_tr('Confirm Action', 'common'),
k_msg: [
'<b>',k_msg,'</b>',
'<br /><br />',
k_tr('This action is irreversible. You should be really sure this certificate is untrusted. Do you want to continue? Please note that clients will still be able to connect after distrusting the certificate. If you want to prevent clients from using it, remove the certificate.', 'accountingList')
].join(''),
k_callback: function(k_response) {
var
k_selectionStatus = this.k_selectionStatus,
k_localAuthorityType = this.k_sharedConstants.kerio_web_LocalAuthority,
k_certificateRequestType = this.k_sharedConstants.kerio_web_CertificateRequest,
k_tr = kerio.lib.k_tr,
k_ids = [],
k_item,
k_cnt, k_i;
if ('no' === k_response) {
return;
}
if (!this.k_distrustRequest) {
this.k_distrustRequest = {
k_requestOwner: null, k_jsonRpc: {
method: 'Certificates.setDistrusted',
params: {
ids: ''
}
},
k_scope: this,
k_callback: function(k_response, k_isOk, k_params){
if (k_response.k_decoded && k_response.k_decoded.error) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Warning', 'common'),
k_msg: kerio.waw.shared.k_methods.k_translateErrorMessage(k_response.k_decoded.error),
k_icon: 'warning'
});
return true;
}
this.k_reloadData();
}
};
}
k_cnt = k_selectionStatus.k_selectedRowsCount;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_selectionStatus.k_rows[k_i].k_data;
if (k_localAuthorityType === k_item.type) {
kerio.lib.k_alert({
k_title: k_tr('Error', 'common'),
k_msg: k_tr('The Local Certification Authority cannot be distrusted.', 'wlibCertificateList'),
k_icon: 'error'
});
return;
}
if (k_certificateRequestType === k_item.type) {
kerio.lib.k_alert({
k_title: k_tr('Error', 'common'),
k_msg: k_tr('The Certification Request cannot be distrusted.', 'wlibCertificateList'),
k_icon: 'error'
});
return;
}
k_ids.push(k_item.id);
}
this.k_distrustRequest.k_jsonRpc.params.ids = k_ids;
kerio.lib.k_ajax.k_request(this.k_distrustRequest);
},
k_scope: k_grid
});
}
},
{
k_id: 'k_btnShowDetails',
k_isDisabled: true,
k_caption: k_tr('Show Details…', 'wlibCertificateList'),
k_isVisibleInToolbar: true,

k_onClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_openDetailDialog();
}
},
{
k_restrictions: {
k_supportActiveCertificate: [true],
k_isAuditor: [false]
},
k_id: 'k_btnSetAsActive',
k_isDisabled: true,
k_caption: k_tr('Set as Active', 'wlibCertificateList'),
k_isVisibleInToolbar: true,

k_onClick: function(k_toolbar) {
var
k_grid = k_toolbar.k_parentWidget,
k_data = k_grid.k_selectionStatus.k_rows[0].k_data,
k_tr = kerio.lib.k_tr;
if (k_grid.k_sharedConstants.kerio_web_Expired === k_data.validPeriod.validType) {
kerio.lib.k_alert({
k_title: k_tr('Certificate', 'wlibCertificateList'),
k_msg: k_tr('This certificate cannot be set as active, because it is expired.', 'wlibCertificateList')
});
return;
}
}
},
'-',
{
k_id: 'k_btnImport',
k_caption: k_tr('Import', 'wlibButtons'),
k_isMenuButton: true,
k_isDisabled: true,
k_restrictions: {
k_isIPad: [false],
k_groupActions: [true],
k_isAuditor: [false]
},
k_items: [
{
k_id: 'k_btnImportNew',
k_caption: k_tr('Import New Certificate…', 'wlibCertificateList'),
k_onClick: k_onClickImportButton
},
{
k_id: 'k_btnImportSigned',
k_isDisabled: true,
k_caption: k_tr('Import Signed Certificate from CA…', 'wlibCertificateList'),
k_onClick: k_onClickImportButton
},
{
k_restrictions: {
k_supportAuthorities: [true]
},
k_id: 'k_btnImportAuthority',
k_caption: k_tr('Import Certificate of an Authority…', 'wlibCertificateList'),
k_onClick: k_onClickImportButton
},
{
k_restrictions: {
k_supportAuthorities: [true]
},
k_id: 'k_btnImportLocal',
k_caption: k_tr('Import Certificate as a Local Authority…', 'wlibCertificateList'),
k_onClick: k_onClickImportButton
}
]
},
{
k_id: 'k_btnExport',
k_caption: k_tr('Export', 'wlibCertificateList'),
k_isMenuButton: true,
k_isDisabled: true,
k_restrictions: {
k_isIPad: [false],
k_groupActions: [true],
k_isAuditor: [false]
},
k_items: [{
k_isHidden: !k_supportPkcsFormat,
k_id: 'k_btnExportCertificatePkcs',
k_caption: k_tr('Export Certificate in PKCS#12…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'certificateExportPkcs',
k_objectName: 'certificateExportPkcs',
k_params: {
k_certificateId: k_toolbar.k_parentWidget.k_selectionStatus.k_rows[0].k_data.id
}
});
}
}, {
k_id: 'k_btnExportCertificate',
k_caption: k_supportPkcsFormat ? k_tr('Export Certificate in PEM', 'wlibCertificateList') : k_tr('Export Certificate…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_exportData();
}
}, {
k_id: 'k_btnExportRequest',
k_isHidden: true,
k_caption: k_supportPkcsFormat ? k_tr('Export Request in PEM', 'wlibCertificateList') :k_tr('Export Request…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_exportData();
}
}, {
k_id: 'k_btnExportPrivateKey',
k_caption: k_supportPkcsFormat ? k_tr('Export Private Key in PEM', 'wlibCertificateList') : k_tr('Export Private Key…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_exportData(true);
}
}]
},
'->',
{
k_restrictions: {
k_showApplyReset: [true],
k_isAuditor: [false]
},
k_type: 'K_APPLY_RESET',
k_onApply: k_config.k_onApply,
k_onReset: k_config.k_onReset
}
],
k_hasSharedMenu: true,

k_update: function(k_sender) {
var
k_sharedConstants = k_sender.k_sharedConstants,
k_selectionStatus = k_sender.k_selectionStatus,
k_selectedRowsCount = k_selectionStatus.k_selectedRowsCount,
k_selectedNone = 0 === k_selectedRowsCount,
k_selectedOne = 1 === k_selectedRowsCount,
k_supportPkcsFormat = k_sender.k_supportPkcsFormat,
k_isActivableCertificate = false,
k_isRequest = false,
k_isAuthority = false,
k_toolbar = k_sender.k_toolbars.k_bottom,
k_storeStatusNew = kerio.lib.k_getSharedConstants('kerio_web_StoreStatusNew'),
k_builinSelection = false,
k_localAuthoritySelection = false,
k_requestSelection = false,
k_data,
k_type,
k_isBuilInAtuhority,
k_i;
k_toolbar.k_enableItem('k_btnShowDetails', k_selectedOne);
if (!k_sender.k_isAuditor) {
k_toolbar.k_enableItem('k_btnExport', k_selectedOne);
for (k_i = 0; k_i < k_selectionStatus.k_selectedRowsCount; k_i++) {
k_type = k_selectionStatus.k_rows[k_i].k_data.type;
if (k_sharedConstants.kerio_web_BuiltInAuthority === k_type) {
k_builinSelection = true;
}
if (k_sharedConstants.kerio_web_LocalAuthority === k_type) {
k_localAuthoritySelection = true;
}
if (k_sharedConstants.kerio_web_CertificateRequest === k_type) {
k_requestSelection = true;
}
}
k_toolbar.k_enableItem('k_btnRemove', !k_localAuthoritySelection && !k_builinSelection && !k_selectedNone);
k_toolbar.k_enableItem('k_btnDistrust', !k_requestSelection && !k_localAuthoritySelection && !k_selectedNone);
if (k_selectedOne) {
k_data = k_selectionStatus.k_rows[0].k_data;
k_type = k_data.type;
k_isRequest = k_sharedConstants.kerio_web_CertificateRequest === k_type;
k_isActivableCertificate = k_sharedConstants.kerio_web_InactiveCertificate === k_type;
k_isAuthority = k_sharedConstants.kerio_web_Authority === k_type;
k_isBuilInAtuhority = k_sharedConstants.kerio_web_BuiltInAuthority === k_type;
k_toolbar.k_enableItem('k_btnRename', !k_isBuilInAtuhority);
k_toolbar.k_enableItem('k_btnExport', k_data.status !== k_storeStatusNew);
k_toolbar.k_showItem('k_btnExportRequest', k_isRequest);
k_toolbar.k_showItem('k_btnExportCertificate', !k_isRequest);
k_toolbar.k_showItem('k_btnExportCertificatePkcs', !k_isRequest && !k_isAuthority && !k_isBuilInAtuhority && k_supportPkcsFormat);
k_toolbar.k_showItem('k_btnExportPrivateKey', !k_isAuthority && !k_isBuilInAtuhority);
}
else {
k_toolbar.k_enableItem('k_btnRename', false);
}
k_toolbar.k_enableItem('k_btnImportSigned', k_selectedOne && k_isRequest);
k_toolbar.k_enableItem('k_btnSetAsActive', k_selectedOne && k_isActivableCertificate);
}
}
};

k_rendererSslName = function(k_value, k_rowData, k_rowIndex, k_columnIndex, k_grid) {
var
k_sharedConstants = k_grid.k_sharedConstants,
k_icon;
switch(k_rowData.type) {
case k_sharedConstants.kerio_web_Authority:
k_icon = 'authorityIcon';
break;
case k_sharedConstants.kerio_web_LocalAuthority:
k_icon = 'localAuthorityIcon';
break;
case k_sharedConstants.kerio_web_CertificateRequest:
k_icon = 'requestIcon';
break;
case k_sharedConstants.kerio_web_BuiltInAuthority:
k_icon = 'builtInAuthority';
break;
case k_sharedConstants.kerio_web_ServerCertificate:
k_icon = 'serverCrtIcon';
break;
default:
k_icon = 'certificateIcon';
}
switch (k_rowData.status) {
case k_sharedConstants.kerio_web_StoreStatusNew:
k_icon += ' added';
break;
case k_sharedConstants.kerio_web_StoreStatusModified:
k_icon += ' modified';
break;
}
if (k_rowData.isUntrusted || kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Expired === k_rowData.validPeriod.validType) {
k_icon += ' expired';
}
return {
k_data: k_value,
k_iconCls: k_icon
};
};

k_rendererSslType = function(k_value, k_rowData, k_rowIndex, k_columnIndex, k_grid) {
var
k_sharedConstants = k_grid.k_sharedConstants,
k_tr = kerio.lib.k_tr,
k_types = k_grid._k_types || [],
k_typeRenderer;
if (!k_types.length) {
k_types[k_sharedConstants.kerio_web_ActiveCertificate]  = k_tr('Active Certificate', 'wlibCertificateList');
k_types[k_sharedConstants.kerio_web_InactiveCertificate]= k_tr('Certificate', 'wlibCertificateList');
k_types[k_sharedConstants.kerio_web_ServerCertificate]  = k_tr('Certificate', 'wlibCertificateList');
k_types[k_sharedConstants.kerio_web_CertificateRequest] = k_tr('Request', 'wlibCertificateList');
k_types[k_sharedConstants.kerio_web_Authority]			= k_tr('Certification Authority', 'wlibCertificateList');
k_types[k_sharedConstants.kerio_web_LocalAuthority]     = k_tr('Local Certification Authority', 'wlibCertificateList');
k_types[k_sharedConstants.kerio_web_BuiltInAuthority]   = k_tr('Built-in Certification Authority', 'wlibCertificateList');
k_grid._k_types = k_types;
}
k_typeRenderer = k_types[k_value];
if (k_rowData.isUntrusted) {
k_typeRenderer = k_tr('Untrusted %1', 'wlibCertificateList', {k_args: [k_typeRenderer]});
}
return {
k_data: k_typeRenderer
};
};

k_rendererHostname = function(k_value) {
var
k_display = '',
k_i, k_cnt;
for (k_i = 0, k_cnt = k_value.length; k_i < k_cnt; k_i++) {
if ('hostname' === k_value[k_i].name) {
k_display = k_value[k_i].value;
break;
}
}
return {
k_data: k_display
};
};

k_rendererIssuer = function(k_value, k_rowData, k_rowIndex, k_columnIndex, k_grid) {
return k_grid.k_rendererHostname(k_rowData.issuer);
};

k_rendererSubject = function(k_value, k_rowData, k_rowIndex, k_columnIndex, k_grid) {
return k_grid.k_rendererHostname(k_rowData.subject);
};

k_rendererValidFrom = function(k_value, k_rowData) {
var
k_validFromDate = k_rowData.validPeriod.validFromDate;
return {
k_data: k_validFromDate.year ? kerio.adm.k_framework.k_formatDate(k_validFromDate) : ''
};
};

k_rendererExpires = function(k_value, k_rowData) {
var
k_validToDate = k_rowData.validPeriod.validToDate;
return {
k_data: k_validToDate.year ? kerio.adm.k_framework.k_formatDate(k_validToDate) : ''
};
};
k_gridCfg = {
k_className: 'certificateGrid',
k_restrictBy: {
k_isIPad: k_lib.k_isIPad,
k_isAuditor: k_isAuditor,
k_showApplyReset: k_showApplyReset,
k_groupActions: k_groupActions,
k_supportAuthorities: k_supportAuthorities,
k_supportActiveCertificate: k_supportActiveCertificate,
k_canRename: k_canRename
},
k_columns: {
k_items: [
{ k_columnId: 'id',             k_isDataOnly: true },
{ k_columnId: 'name',           k_caption: k_tr('Name', 'wlibCertificateList'),       k_width: 120, k_renderer: k_rendererSslName},
{ k_columnId: 'type',           k_caption: k_tr('Type', 'wlibCertificateList'),       k_width: 150, k_renderer: k_rendererSslType,   k_isHidden: true},
{ k_columnId: 'issuer',         k_caption: k_tr('Issuer', 'wlibCertificateList'),     k_width: 220, k_renderer: k_rendererIssuer},
{ k_columnId: 'subject',        k_caption: k_tr('Subject', 'wlibCertificateList'),    k_width: 220, k_renderer: k_rendererSubject},
{ k_columnId: 'validFrom',      k_caption: k_tr('Valid from', 'wlibCertificateList'),               k_renderer: k_rendererValidFrom, k_isHidden: true},
{ k_columnId: 'validTo',        k_caption: k_tr('Expires', 'wlibCertificateList'),                  k_renderer: k_rendererExpires},
{ k_columnId: 'validPeriod',    k_isDataOnly: true},
{ k_columnId: 'status',         k_isDataOnly: true},
{ k_columnId: 'subjectAlternativeNameList',k_isDataOnly: true},
{ k_columnId: 'isUntrusted',	k_isDataOnly: true},
{ k_columnId: 'fingerprint',	k_isDataOnly: true},
{ k_columnId: 'fingerprintSha1',k_isDataOnly: true},
{ k_columnId: 'fingerprintSha256',k_isDataOnly: true}
],
k_sorting: {
k_isRemoteSort: true,
k_columnId: 'name'
}
},
k_pageSize: 250, k_remoteData: {
k_isAutoLoaded: true,
k_root: 'certificates',
k_jsonRpc: {
method: k_config.k_managerName + '.get'
}
},

k_onDblClick: function () {
this.k_openDetailDialog();
},

k_onLoad: function(k_grid) {
var
k_CONSTANTS =  kerio.waw.shared.k_CONSTANTS,
k_localAuthorityIndex = this.k_findRow('type', k_CONSTANTS.kerio_web_SharedConstants.kerio_web_LocalAuthority),
k_localAuthority = -1 !== k_localAuthorityIndex ? this.k_getRowByIndex(k_localAuthorityIndex[0]) : undefined,
k_islocalAuthorityExpired = k_localAuthority ? k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Expired === k_localAuthority.validPeriod.validType : false;
if (!this.k_isAuditor) {
this.k_toolbars.k_bottom.k_getItem('k_btnNewCertificate').k_setDisabled(k_islocalAuthorityExpired);
this.k_toolbars.k_bottom.k_getItem('k_btnNewRequest').k_setDisabled(k_islocalAuthorityExpired);
}
if (true === k_grid.k_isSetAsActive) {
k_grid.k_selectRows(0);
k_grid.k_isSetAsActive = false;
}
},
k_toolbars: {
k_bottom: k_toolbarCfg
},
k_filters: {
k_search: {
k_caption: k_tr('Filter:', 'wlibCommon'),
k_searchBy: k_config.k_searchBy
},
k_checkbox: {
k_option: k_tr('Hide built-in certification authorities', 'userGroupList'),
k_isChecked: kerio.waw.status.k_userSettings.k_get('certification.hideBuiltIn', true),k_conditions: {
k_firstOperand: 'type',
k_comparator: k_sharedConstants.kerio_web_NotEq,
k_secondOperand: k_sharedConstants.kerio_web_BuiltInAuthority
},

k_onChange: function(k_toolbar, k_item, k_value) {
kerio.waw.status.k_userSettings.k_set('certification.hideBuiltIn', k_value);}
}
}
};
if (kerio.lib.k_isStateful) {
k_gridCfg.k_settingsId = 'sslCertificates';
}
kerio.waw.shared.k_widgets.K_CertificateGrid.superclass.constructor.call(this, k_id, k_gridCfg);
this.k_addReferences({
k_toolbar: k_toolbar,
k_isAuditor: k_isAuditor,
k_sharedConstants: k_sharedConstants,
k_config: k_config,
k_showApplyReset: k_showApplyReset,
k_groupActions: k_groupActions,
k_supportAuthorities: k_supportAuthorities,
k_supportPkcsFormat: k_supportPkcsFormat,
k_supportActiveCertificate: k_supportActiveCertificate,
k_canRename: k_canRename,
k_canSearch: k_canSearch,
k_rendererHostname: k_rendererHostname
});
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_CertificateGrid', kerio.waw.shared.k_widgets.K_ContextMenuList, {

k_applyParams: function() {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
this.k_reloadData(this._k_createQuery());
if (!this.k_isAuditor) {
this.k_toolbars.k_bottom.k_enableItem('k_btnImport');
}
this.k_serverTime = new Date();
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'SystemConfig.getDateTime'
},
k_scope: this,
k_callback: function(k_response, k_success) {
if (k_success) {
var k_date = k_response.k_decoded.config.date;
this.k_serverTime = new Date(k_date.year, k_date.month, k_date.day);
}
}
});
},

k_exportData: function(k_isKey) {
var
k_rowData = this.k_selectionStatus.k_rows[0].k_data,
k_requestCfg;
k_requestCfg = {
k_jsonRpc: {
method: this.k_config.k_managerName + '.' + (k_isKey ? 'exportPrivateKey' : 'exportCertificate'),
params: {id: k_rowData.id}
}
};
kerio.lib.k_ajax.k_request(k_requestCfg);
},

k_openRequestDialog: function(k_requestType) {
var
k_objectName,
k_data;
switch (k_requestType) {
case kerio.lib.k_getSharedConstants('kerio_web_CertificateRequest'):
k_objectName = 'certificateRequest';
break;
case kerio.lib.k_getSharedConstants('kerio_web_ActiveCertificate'):
case kerio.lib.k_getSharedConstants('kerio_web_InactiveCertificate'):
k_objectName = 'newCertificate';
break;
default: k_requestType = k_requestType || kerio.lib.k_getSharedConstants('kerio_web_LocalAuthority');
k_objectName = 'autorityRecreate';
k_data = this.k_getLocalAuthority();
break;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'certificateRequest',
k_objectName: k_objectName,
k_initParams: {
k_canRename: this.k_canRename
},
k_params: {
k_relatedGrid: this,
k_certificateType: k_requestType,
k_data: k_data
}
});
},

k_openDetailDialog: function() {
if (0 === this.k_selectionStatus.k_rows.length) {
return;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'certificateDetail',
k_params: {
k_relatedGrid: this
},
k_initParams: this.k_config
});
},

k_openImportDialog: function(k_id) {
var
k_sharedConstants = this.k_sharedConstants,
k_sourceName = 'certificateImport',
k_supportPkcsFormat = this.k_supportPkcsFormat,
k_objectName,
k_type;
switch (k_id) {
case 'k_btnImportSigned':
k_objectName = 'certificateImportSigned';
k_type = k_sharedConstants.kerio_web_CertificateRequest;
break;
case 'k_btnImportAuthority':
k_objectName = 'certificateImportAuthority';
k_type = k_sharedConstants.kerio_web_Authority;
break;
case 'k_btnImportLocal':
k_objectName = 'certificateImportLocal';
k_type = k_sharedConstants.kerio_web_LocalAuthority;
if (k_supportPkcsFormat) {
k_sourceName = 'certificateImportPkcs';
}
break;
default: k_objectName = 'certificateImportNew';
k_type = k_sharedConstants.kerio_web_ActiveCertificate;
if (k_supportPkcsFormat) {
k_sourceName = 'certificateImportPkcs';
}
break;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: k_sourceName,
k_objectName: k_objectName,
k_params: {
k_relatedGrid: this,
k_importType: k_type
},
k_initParams: this.k_config
});
},

k_removeData: function() {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_selectionStatus = this.k_selectionStatus,
k_localAuthorityType = this.k_sharedConstants.kerio_web_LocalAuthority,
k_message,
k_i, k_cnt,
k_item;
k_cnt = k_selectionStatus.k_selectedRowsCount;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_selectionStatus.k_rows[k_i];
if (k_localAuthorityType === k_item.k_data.type) {
kerio.lib.k_alert({
k_title: k_tr('Error', 'common'),
k_msg: k_tr('The Local Certification Authority cannot be removed.', 'wlibCertificateList'),
k_icon: 'error'
});
return;
}
}
if (this.k_showApplyReset) {
this.k_removeDataCallback();
return;
}
if (1 === k_selectionStatus.k_selectedRowsCount) {
k_message = k_tr('Are you sure you want to remove the selected item?', 'wlibCertificateList');
}
else {
k_message = k_tr('Are you sure you want to remove the selected items?', 'wlibAlerts');
}
k_lib.k_confirm({
k_title: k_tr('Confirm Action', 'wlibAlerts'),
k_msg: k_message,
k_callback: this.k_removeDataCallback,
k_scope: this
});
},

k_removeDataCallback: function(k_response) {
if ('no' === k_response) {
return;
}
var
k_rows = this.k_selectionStatus.k_rows,
k_cnt = k_rows.length,
k_ids = [],
k_i,
k_request;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_ids.push(k_rows[k_i].k_data.id);
}
k_request = {
k_jsonRpc: {
'method': this.k_config.k_managerName + '.' + 'remove',
'params': {ids: k_ids}
},

k_callback: function(k_response) {
if (k_response.k_isOk) {
kerio.adm.k_framework.k_enableApplyReset(true);this.k_reloadData();
}
},
k_scope: this
};
kerio.lib.k_ajax.k_request(k_request);
},

k_setActive: function() {
var
k_request;
k_request = {
k_jsonRpc: {
'method': this.k_config.k_managerName + '.' + 'setActive',
'params': {id: this.k_selectionStatus.k_rows[0].k_data.id}
},

k_callback: function(k_response) {
if (k_response.k_isOk) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr;
if (this.k_config.k_restartMessage) {
k_lib.k_alert({
k_title: k_tr('Certificate Activated', 'wlibCertificateList'),
k_msg: this.k_config.k_restartMessage
});
}
this.k_isSetAsActive = true;
this.k_reloadData();
}
},
k_scope: this
};
kerio.lib.k_ajax.k_request(k_request);
},

k_getLocalAuthority: function(k_forceData) {
var
k_data = this.k_getData(),
k_i, k_cnt;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_data[k_i].type === this.k_sharedConstants.kerio_web_LocalAuthority) {
return k_data[k_i];
}
}
if (false !== k_forceData) { return {
name: kerio.lib.k_tr('Local Authority', 'wlibCertificateList'),
subject: []
};
}
return null;
}
});
kerio.adm.k_widgets.certificateList = {

k_init: function(k_objectName, k_initParams) {
return new kerio.waw.shared.k_widgets.K_CertificateGrid(k_objectName, k_initParams);
},

k_getName: function(k_name) {
k_name = k_name.replace(new RegExp('\\.(crt|pfx|p12)$'), '');
if (kerio.lib.k_isMSIE) {
k_name = k_name.substr(k_name.lastIndexOf('\\')+1);
}
return k_name;
}
};