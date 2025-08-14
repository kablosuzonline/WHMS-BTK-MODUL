

kerio.adm.k_widgets.certificateDetail = {

k_init: function(k_objectName, k_initParams) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_localNamespace = k_objectName + '_',
k_isAuditor = k_initParams.k_isAuditor,
k_gridCfg,
k_grid,
k_formSourceCfg,
k_formSource,
k_dialogCfg,
k_dialog,
k_tabPageCfg,
k_tabPage;
k_gridCfg = {
k_selectionMode: 'k_none',
k_isRowHighlighting: false,
k_isStateful: false,
k_columns: {
k_items: [{
k_columnId: 'group',
k_isKeptHidden: true
},
{
k_caption: k_tr('Name', 'wlibCertificateDetail'),
k_columnId: 'name',
k_width: 175,
k_renderer: function(k_value) {
return {
k_data: this.k_rendererTranslations[k_value]
};
}
},
{
k_caption: k_tr('Value', 'wlibCertificateDetail'),
k_columnId: 'value',

k_renderer: function(k_value) {
return {
k_data: k_value ? k_value : kerio.lib.k_tr('<not specified>', 'wlibCertificateDetail')
};
}
}],
k_grouping: {
k_columnId: 'group',
k_isMemberIndented: true,
k_isCollapsible: false,
k_allowCollapse: false
}
},
k_isCellBorderHidden: true
};
k_grid = new k_lib.K_Grid(k_localNamespace + 'k_grid', k_gridCfg);
k_grid.k_addReferences({
k_rendererTranslations: {
'hostname':                  k_tr('Hostname', 'wlibCertificateDetail'),
'subjectAlternativeNameList':k_tr('Alternative hostnames', 'wlibCertificateDetail'),
'authorityName':             k_tr('Authority name', 'wlibCertificateDetail'),
'organizationName':          k_tr('Organization name', 'wlibCertificateDetail'),
'organizationalUnitName':    k_tr('Organization unit', 'wlibCertificateDetail'),
'city':                      k_tr('City', 'wlibCertificateDetail'),
'state':                     k_tr('State or Province', 'wlibCertificateDetail'),
'country':                   k_tr('Country', 'wlibCertificateDetail'),
'emailAddress':              k_tr('Email Address', 'wlibCertificateDetail'),
'fingerprint':               k_tr('MD5', 'wlibCertificateDetail'),
'fingerprintSha1':           k_tr('SHA-1', 'wlibCertificateDetail'),
'fingerprintSha256':           k_tr('SHA-256', 'wlibCertificateDetail')
}
});
k_formSourceCfg = {
k_restrictBy: k_isAuditor,
k_items: [{
k_restrictions: [false],
k_type: 'k_textArea',
k_id: 'k_source',
k_isLabelHidden: true,
k_isReadOnly: true,
k_maxLength: 65535
},{
k_restrictions: [true],
k_type: 'k_display',
k_id: 'k_sourceNotAvailable',
k_isLabelHidden: true,
k_icon: '/img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('Certificate source is available only for users with full administration rights to this server.', 'wlibCertificateDetail')
}]
};
k_formSource = new k_lib.K_Form(k_localNamespace + 'k_formCertificate', k_formSourceCfg);
k_tabPageCfg = {
k_items: [
{k_caption: k_tr('Details', 'wlibCertificateDetail'), k_content: k_grid, k_id: 'k_tabDetails'},
{k_caption: k_tr('Source', 'wlibCertificateDetail'), k_content: k_formSource, k_id: 'k_tabCertificate'}
]
};
k_tabPage = new k_lib.K_TabPage(k_localNamespace + 'k_tabPages', k_tabPageCfg);
k_dialogCfg = {
k_width: 550,
k_height: 460,
k_title: k_tr('Certificate Details', 'wlibCertificateDetail'),
k_content: k_tabPage,
k_buttons: [{
k_id: 'k_btnClose',
k_caption: k_tr('Close', 'wlibButtons'),
k_isCancel: true
}]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_tabPage: k_tabPage,
k_grid: k_grid,
k_formSource: k_formSource,
k_isAuditor: k_isAuditor
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function(k_params){
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_loadData();
};

k_kerioWidget.k_loadData = function() {
var
k_data = [],
k_certificatesGrid = this.k_relatedGrid,
k_selectionStatus = k_certificatesGrid.k_selectionStatus,
k_certificate = k_selectionStatus.k_rows[0].k_data,
k_issuer = k_certificate.issuer,
k_subject = k_certificate.subject,
k_sharedConstants = k_certificatesGrid.k_sharedConstants,
k_tr = kerio.lib.k_tr,
k_subjectAlternativeNameList,
k_requestSourceCfg,
k_isAuthority,
k_cnt, k_i,
k_item,
k_groupName;
k_isAuthority = k_sharedConstants.kerio_web_LocalAuthority === k_certificate.type || k_sharedConstants.kerio_web_Authority === k_certificate.type;
k_cnt = k_issuer.length;
k_groupName = k_tr('Issuer', 'wlibCertificateList');
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_issuer[k_i];
if (k_isAuthority && 'hostname' === k_item.name) {
k_item.name = 'authorityName';
}
k_data.push({
group: k_groupName,
name: k_item.name,
value: k_item.value
});
}
k_subjectAlternativeNameList = k_certificate.subjectAlternativeNameList || [];
for (k_i = 0, k_cnt = k_subjectAlternativeNameList.length; k_i < k_cnt; k_i++) {
k_item = k_subjectAlternativeNameList[k_i];
if ('DNS' === k_item.name) {
k_subjectAlternativeNameList = k_item.value.join(', ');
break;
}
}
k_cnt = k_subject.length;
k_groupName = k_tr('Subject', 'wlibCertificateList');
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_subject[k_i];
if (k_isAuthority && 'hostname' === k_item.name) {
k_item.name = 'authorityName';
}
k_data.push({
group: k_groupName,
name: k_item.name,
value: k_item.value
});
if ('hostname' === k_item.name && 0 < k_subjectAlternativeNameList.length) {
k_data.push({
group: k_groupName,
name: 'subjectAlternativeNameList',
value: k_subjectAlternativeNameList
});
}
}
k_groupName = k_tr('Fingerprint', 'wlibCertificateList');
if (k_certificate.fingerprint) {
k_data.push({
group: k_groupName,
name: 'fingerprint',
value: k_certificate.fingerprint
});
}
if (k_certificate.fingerprintSha1) {
k_data.push({
group: k_groupName,
name: 'fingerprintSha1',
value: k_certificate.fingerprintSha1
});
}
if (k_certificate.fingerprintSha256) {
k_data.push({
group: k_groupName,
name: 'fingerprintSha256',
value: k_certificate.fingerprintSha256
});
}
this.k_grid.k_setData(k_data);
if (!this.k_isAuditor && kerio.lib.k_getSharedConstants('kerio_web_StoreStatusNew') !== k_certificate.status) {
k_requestSourceCfg = {
k_jsonRpc: {
'method': this.k_relatedGrid.k_config.k_managerName + '.' + 'toSource',
'params': {id: k_certificate.id}
},

k_callback: function(k_response){
if (k_response.k_isOk) {
this.k_formSource.k_setData({
k_source: k_response.k_decoded.source
});
}
},
k_scope: this
};
kerio.lib.k_ajax.k_request(k_requestSourceCfg);
}
else {
this.k_formSource.k_setData({
k_source: kerio.lib.k_tr('Cannot display source of a new certificate. It will be available after applying the changes.', 'wliCertificateDetails')
});
}
};

k_kerioWidget.k_resetOnClose = function() {
this.k_tabPage.k_setActiveTab('k_tabDetails');
};
}
};
