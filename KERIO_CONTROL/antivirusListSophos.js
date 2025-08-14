
kerio.waw.ui.antivirusListSophos = {

k_init: function(k_objectName) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared =  kerio.waw.shared,
k_getDefinition = k_shared.k_DEFINITIONS.k_get,
AntivirusUpdatePhases = k_shared.k_CONSTANTS.AntivirusUpdatePhases,
ScanRuleType = k_shared.k_CONSTANTS.ScanRuleType,
k_localNamespace = k_objectName + '_',
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_isLinux = kerio.waw.shared.k_methods.k_isLinux(),
k_tabs = [],  k_forms = [], k_setContentStatus = kerio.adm.k_framework.k_enableApplyReset,
k_smptServerInfo = kerio.lib.k_cloneObject(k_getDefinition('k_smtpServer')),
k_tabPage, k_tabPageCfg,
k_toolbar, k_toolbarCfg,
k_scanRulesGrid, k_scanRulesGridCfg,
k_formManager,
k_antivirusSettingsCfg,
k_engineForm, k_engineFormCfg,
k_httpFtpScanningForm, k_httpFtpScanningFormCfg,
k_emailScanningForm, k_emailScanningFormCfg,
k_sslVpnScanningForm, k_sslVpnScanningFormCfg,
k_translations,
k_trStatusInitText;
k_translations = {};
k_translations[AntivirusUpdatePhases.k_UPDATE_STATUS] = k_tr('Getting last update status…', 'antivirusList');
k_translations[AntivirusUpdatePhases.AntivirusUpdateStarted] = k_tr('Connecting to the antivirus update server…', 'antivirusList');
k_translations[AntivirusUpdatePhases.AntivirusUpdateChecking] = k_tr('Checking for new version…', 'antivirusList');
k_translations[AntivirusUpdatePhases.AntivirusUpdateDownload] = k_tr('Downloading new virus database…', 'antivirusList');
k_translations[AntivirusUpdatePhases.AntivirusUpdateDownloadEngine] = k_tr('Downloading new antivirus scanning engine…', 'antivirusList');
k_trStatusInitText = k_translations[AntivirusUpdatePhases.k_UPDATE_STATUS];

k_engineFormCfg = {
k_onChange: k_setContentStatus,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_id: 'k_containerProtocols',
k_caption: k_tr('Protocols', 'antivirusList'),
k_isReadOnly: k_isAuditor,
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'protocols.http',
k_option: k_tr('Enable HTTP scanning', 'antivirusList')
},
{
k_type: 'k_checkbox',
k_id: 'protocols.ftp',
k_option: k_tr('Enable FTP scanning', 'antivirusList')
},
{
k_type: 'k_checkbox',
k_id: 'protocols.smtp',
k_option: k_tr('Enable SMTP scanning (for inbound connections only)', 'antivirusList')
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_indent: 1,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('SMTP scanning is not compatible with greylisting.', 'antivirusList')
},
{
k_type: 'k_checkbox',
k_id: 'protocols.pop3',
k_option: k_tr('Enable POP3 scanning', 'antivirusList')
}
]
},
{
k_type: 'k_fieldset',
k_id: 'k_containerSettings',
k_caption: k_tr('Settings', 'antivirusList'),
k_isReadOnly: k_isAuditor,
k_items: [
k_shared.k_DEFINITIONS.k_get('k_optionalNumber', {
k_id: 'fileSizeLimit',
k_caption: k_tr('Scan only files that are smaller than:', 'antivirusList'),
k_minValue: 1,
k_units: 'KB',
k_isMainScreen: true
})
]
}
]
};
k_antivirusSettingsCfg = k_getDefinition('K_AntivirusSettingsCfg', {
k_isReadOnly: k_isAuditor,
k_allowUpdate: true,
k_trStatusInitText: k_trStatusInitText
});
k_engineFormCfg.k_items = k_antivirusSettingsCfg.k_items.concat(k_engineFormCfg.k_items);
k_engineForm = new k_lib.K_Form(k_localNamespace + 'k_engineForm', k_engineFormCfg);
k_antivirusSettingsCfg.k_init(k_engineForm);
k_tabs.push({
k_id: 'k_engineTab',
k_caption: k_tr('Antivirus Engine', 'antivirusList'),
k_content: k_engineForm
});
k_forms.push(k_engineForm);

k_scanRulesGridCfg = {
k_isAuditor: k_isAuditor,
k_isApplyResetUsed: false,
k_selectionMode: 'k_multi',
k_enableApplyOnAction: true,
k_useDefaultDrop: true,
k_defaultRuleDefinition: {
scan: false,
type: ScanRuleType.ScanRuleFilename,
pattern: '*',
description: k_tr('Don\'t scan other traffic', 'antivirusList')
},
k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'antivirusScanRuleEditor'
},
k_update: function(k_sender, k_event) {
var
k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount,
k_isSelected = 1 === k_selectedRowsCount,
k_selectedRowData = k_isSelected ? k_sender.k_selectionStatus.k_rows[0].k_data : {},
k_isDefaultRule = k_selectedRowData.k_isDefaultRule,
k_isEditable = k_isSelected && !k_isDefaultRule,
k_isSomethingSelected = 0 < k_selectedRowsCount,
k_containesDefaultRule = false;
if (k_isSomethingSelected) {
k_containesDefaultRule = true === k_sender.k_selectionStatus.k_rows[k_selectedRowsCount - 1].k_data.k_isDefaultRule;
}
this.k_enableItem('k_btnEdit', k_isEditable);
this.k_enableItem('k_btnView', k_isEditable);
this.k_enableItem('k_btnRemove', k_isSomethingSelected && !k_containesDefaultRule);
this.k_enableItem('k_btnDuplicate', k_isEditable);
}
}
},
k_columns: {
k_sorting: false,
k_items: [
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'enabled',
k_isDataOnly: true },
{
k_columnId: 'type',
k_caption: k_tr('Type', 'antivirusList'),
k_width: 150,
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'enabled',
k_onChange: k_setContentStatus
},

k_renderer: function(k_value) {
var
ScanRuleType = this.ScanRuleType,
k_text,
k_class = 'avRuleType';
switch (k_value) {
case ScanRuleType.ScanRuleUrl:
k_text = this.k_urlRuleText;
k_class += ' url';
break;
case ScanRuleType.ScanRuleMime:
k_text = this.k_mimeRuleText;
k_class += ' mime';
break;
case ScanRuleType.ScanRuleFilename:
k_text = this.k_fileRuleText;
k_class += ' file';
break;
case ScanRuleType.ScanRuleFileGroup:
k_text = this.k_fileGroupRuleText;
k_class += ' file';
break;
}
return {
k_data: k_text,
k_iconCls: k_class
};
}
},
{
k_columnId: 'pattern',
k_caption: k_tr('Content', 'antivirusList'),
k_width: 200,
k_renderer: function(k_value, k_data) {
var
k_shared = kerio.waw.shared,
k_fileTypesTranslations = k_shared.k_DEFINITIONS.k_FILE_NAME_GROUPS_TRANSLATIONS,
k_fileTypes = k_shared.k_CONSTANTS.k_FILE_GROUP_TYPES,
k_pattern = k_value,
k_tooltip;
if (this.ScanRuleType.ScanRuleFileGroup === k_data.type) {
k_pattern = k_fileTypesTranslations[k_value];
k_tooltip = k_fileTypes[k_value] ? k_fileTypes[k_value].pattern : undefined;
}
return {
k_data: k_pattern,
k_dataTooltip: k_tooltip
};
}
},
{
k_columnId: 'scan',
k_caption: k_tr('Action', 'antivirusList'),

k_renderer: function(k_value) {
var
k_data = (k_value ? this.k_scanRuleText : this.k_noScanRuleText),
k_iconCls = 'avRuleAction ' + (k_value ? 'scan' : 'noScan');
return {
k_data: k_data,
k_iconCls: k_iconCls
};
}
},
{
k_columnId: 'description',
k_caption: k_tr('Description', 'antivirusList')
}
]
}
};
k_scanRulesGrid = new kerio.waw.shared.k_widgets.K_MediumRulesGrid(k_localNamespace + 'scanRulesGrid', k_scanRulesGridCfg);
k_httpFtpScanningFormCfg = {
k_onChange: k_setContentStatus,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('If a virus is found', 'antivirusList'),
k_isLabelHidden: true,
k_height: k_isLinux ? 75 : 90,
k_items: [
{
k_type: 'k_checkbox',
k_option: k_tr('Move the file to quarantine', 'antivirusList'),
k_id: 'httpFtpScanning.moveToQuarantine',
k_isReadOnly: k_isAuditor,
k_isHidden: k_isLinux },
{
k_type: 'k_checkbox',
k_option: k_tr('Alert the client', 'antivirusList'),
k_isReadOnly: k_isAuditor,
k_id: 'httpFtpScanning.alertClient'
},
k_smptServerInfo.k_undefinedSmtpDisplay,
k_smptServerInfo.k_definedSmtpDisplay
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('If a transferred file cannot be scanned (e.g. corrupted or encrypted)', 'antivirusList'),
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_height: 75,
k_items: [
{
k_type: 'k_radio',
k_option: '<span class="ruleProperties radio block">&nbsp; &nbsp; &nbsp;</span>' + k_tr('Deny transmission of the file', 'antivirusList'),
k_groupId: 'httpFtpScanning.allowNotScanned',
k_value: false,
k_isChecked: true
},
{
k_type: 'k_radio',
k_option: '<span class="ruleProperties radio">&nbsp; &nbsp; &nbsp;</span>' + k_tr('Allow transmission of the file', 'antivirusList'),
k_groupId: 'httpFtpScanning.allowNotScanned',
k_value: true
}
]
},
{
k_type: 'k_fieldset',
k_minHeight: 160,
k_caption: k_tr('Scanning rules', 'antivirusList'),
k_content: k_scanRulesGrid
}
]
};
k_httpFtpScanningForm = new k_lib.K_Form(k_localNamespace + 'k_httpFtpScanningForm', k_httpFtpScanningFormCfg);
k_tabs.push({
k_id: 'k_httpFtpScanningTab',
k_caption: k_tr('HTTP, FTP Scanning', 'antivirusList'),
k_content: k_httpFtpScanningForm
});
k_forms.push(k_httpFtpScanningForm);

k_emailScanningFormCfg = {
k_onChange: k_setContentStatus,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('If a virus is found', 'antivirusList'),
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_items: [
{
k_type: 'k_checkbox',
k_option: k_tr('Store message in quarantine', 'antivirusList'),
k_id: 'emailScanning.moveToQuarantine',
k_isHidden: k_isLinux },
{
k_type: 'k_display',
k_isLabelHidden: true,
k_indent: k_isLinux ? 0 : 1,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('Note that it is not possible to drop whole email messages. Such an action might have caused problems in communication with the server and disabled sending and receiving legitimate messages.', 'antivirusList')
},
k_shared.k_DEFINITIONS.k_get('k_optionalEdit', {
k_id: 'emailScanning.prependText', k_caption: k_tr('Prepend message subject with this text:', 'antivirusList'),
k_isMainScreen: true
})
]
},
{
k_type: 'k_fieldset',
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_caption: k_tr('TLS connection (cannot be scanned by antivirus)', 'antivirusList'),
k_items: [
{
k_type: 'k_checkbox',
k_id: 'emailScanning.allowTls',
k_option: k_tr('Allow clients to use encrypted TLS connections', 'antivirusList')
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_indent: 1,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('This option works even when no antivirus is enabled; you can still block TLS connections if you want to.', 'antivirusList')
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('If an attachment cannot be scanned (e.g. corrupted or encrypted)', 'antivirusList'),
k_isReadOnly: k_isAuditor,
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_radio',
k_option: '<span class="ruleProperties radio block">&nbsp; &nbsp; &nbsp;</span>' + k_tr('Remove the attachment from the email message', 'antivirusList'),
k_groupId: 'emailScanning.allowNotScanned',
k_value: false,
k_isChecked: true
},
{
k_type: 'k_radio',
k_option: '<span class="ruleProperties radio">&nbsp; &nbsp; &nbsp;</span>' + k_tr('Allow delivery of the attachment', 'antivirusList'),
k_groupId: 'emailScanning.allowNotScanned',
k_value: true
}
]
}
]
};
k_emailScanningForm = new k_lib.K_Form(k_localNamespace + 'k_emailScanningForm', k_emailScanningFormCfg);
k_tabs.push({
k_id: 'k_emailScanningTab',
k_caption: k_tr('Email Scanning', 'antivirusList'),
k_content: k_emailScanningForm
});
k_forms.push(k_emailScanningForm);

if (!k_isLinux) { k_sslVpnScanningFormCfg = {
k_onChange: k_setContentStatus,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Clientless SSL-VPN scanning options', 'antivirusList'),
k_isReadOnly: k_isAuditor,
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_checkbox',
k_option: k_tr('Scan uploaded files', 'antivirusList'),
k_id: 'sslVpnScanning.scanUpload'
},
{
k_type: 'k_checkbox',
k_option: k_tr('Scan downloaded files', 'antivirusList'),
k_id: 'sslVpnScanning.scanDownload'
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('If file cannot be scanned (e.g. corrupted or encrypted)', 'antivirusList'),
k_isReadOnly: k_isAuditor,
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_radio',
k_option: '<span class="ruleProperties radio block">&nbsp; &nbsp; &nbsp;</span>' + k_tr('Deny download or upload of the file', 'antivirusList'),
k_groupId: 'sslVpnScanning.allowNotScanned',
k_value: false,
k_isChecked: true
},
{
k_type: 'k_radio',
k_option: '<span class="ruleProperties radio">&nbsp; &nbsp; &nbsp;</span>' + k_tr('Allow download or upload of the file', 'antivirusList'),
k_groupId: 'sslVpnScanning.allowNotScanned',
k_value: true
}
]
}
]
};
k_sslVpnScanningForm = new k_lib.K_Form(k_localNamespace + 'k_sslVpnScanningForm', k_sslVpnScanningFormCfg);
k_tabs.push({
k_id: 'k_sslVpnScanningTab',
k_caption: k_tr('SSL-VPN Scanning', 'antivirusList'),
k_content: k_sslVpnScanningForm
});
k_forms.push(k_sslVpnScanningForm);
}
k_formManager = new k_lib.K_FormManager(k_localNamespace + 'k_formManager', k_forms);
k_tabPageCfg = {
k_className: 'mainList antivirusList',
k_items: k_tabs
};

if (!k_isAuditor) {
k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function(k_toolbar){
var k_tabPage = k_toolbar.k_relatedWidget;
kerio.waw.shared.k_methods.k_maskMainScreen();
if (k_tabPage.k_isValid()) {
k_tabPage.k_saveData();
return false;
}
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return false;
},

k_onReset: function(k_toolbar){
k_toolbar.k_relatedWidget.k_loadData();
}
};
k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
k_tabPageCfg.k_toolbars = {
k_bottom: k_toolbar
};
}
k_tabPage = new k_lib.K_TabPage(k_objectName, k_tabPageCfg);
if (!k_isAuditor) {
k_tabPage.k_toolbar = k_toolbar;
}
k_tabPage.k_addReferences({
k_isLinux: k_isLinux,
k_dataStore: undefined,
k_formManager: k_formManager,
k_engineForm: k_engineForm,
k_httpFtpScanningForm: k_httpFtpScanningForm,
k_emailScanningForm: k_emailScanningForm,
k_scanRulesGrid: k_scanRulesGrid
});
this.k_addControllers(k_tabPage);
k_smptServerInfo.k_request.k_scope = k_tabPage.k_httpFtpScanningForm;
k_tabPage.k_addReferences({
k_loadRequest: [
{
k_jsonRpc: {
method: 'Antivirus.get'
},
k_callback: k_tabPage.k_loadDataCallback,
k_scope: k_tabPage,
k_onError: kerio.waw.shared.k_methods.k_unmaskMainScreen.createCallback()
},
k_smptServerInfo.k_request
],
k_saveRequest: {
k_jsonRpc: {
method: 'Antivirus.set',
params: ''
},
k_callback: k_tabPage.k_saveDataCallback,
k_scope: k_tabPage,
k_onError: kerio.waw.shared.k_methods.k_unmaskMainScreen.createCallback()
}
});
k_engineForm.k_addReferences({
k_translations: k_translations,
k_textStatus: k_engineForm.k_getItem('status')
});
k_scanRulesGrid.k_addReferences({
ScanRuleType: ScanRuleType,
k_urlRuleText: k_tr('HTTP URL', 'antivirusList'),
k_mimeRuleText: k_tr('HTTP MIME type', 'antivirusList'),
k_fileRuleText: k_tr('Filename', 'antivirusList'),
k_fileGroupRuleText: k_tr('File type', 'antivirusList'),
k_scanRuleText: k_tr('Scan', 'antivirusList'),
k_noScanRuleText: k_tr('Do not scan', 'antivirusList')
});
if (!k_isAuditor) {
k_scanRulesGrid.k_toolbars.k_bottom.k_dialogs.k_additionalParams = {
k_callback: k_scanRulesGrid.k_saveRow.createDelegate(k_scanRulesGrid, [], true) };
}
return k_tabPage;
}, 
k_addControllers: function(k_kerioWidget){
k_kerioWidget.k_addReferences({

k_onDeactivate: function() {
this.k_engineForm.k_stopAvUpdate();
this.k_engineForm.k_reset(); },

k_applyParams: function(){
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
this.k_engineForm.k_reset(); kerio.waw.status.k_currentScreen.k_gotoTab(this, 'k_engineTab');
kerio.waw.shared.k_methods.k_maskMainScreen();
this.k_loadData();
},

k_loadData: function(){
kerio.waw.requests.k_sendBatch(this.k_loadRequest);
},

k_loadDataCallback: function(k_response, k_success) {
var k_data;
kerio.waw.shared.k_methods.k_unmaskMainScreen();
if (!k_success || !k_response.config) {
return;
}
k_data = k_response.config;
this.k_dataStore = k_data;
this.k_fileNameGroups = kerio.waw.shared.k_CONSTANTS.k_FILE_GROUP_TYPES;
this.k_engineForm.k_setAvData(k_data.antivirus, true);
this.k_formManager.k_setData(k_data, true);
this.k_scanRulesGrid.k_setData(k_data.httpFtpScanning.scanRuleList, {k_keepSelection: true});
this.k_engineForm.k_updateAv(false); kerio.adm.k_framework.k_enableApplyReset(false);
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_dialogs: ['antivirusOptionsEditor', 'antivirusScanRuleEditor']
});
this.k_scanRulesGrid.k_stopTracing();
this.k_scanRulesGrid.k_startTracing();
},

k_saveData: function() {
var
k_widgetData = this.k_engineForm.k_getAvData(true),
k_scanRulesData = this.k_scanRulesGrid.k_getData(),
k_data = this.k_formManager.k_getData(true),
k_dataStore = this.k_dataStore,
k_requestCfg = this.k_saveRequest;
k_data.antivirus = k_widgetData;
k_data.httpFtpScanning.scanRuleList = k_scanRulesData;
delete k_data.httpFtpScanning.denyTransfer;
delete k_data.emailScanning.removeAttachment;
kerio.waw.shared.k_methods.k_mergeObjects(k_data, k_dataStore);
k_requestCfg.k_jsonRpc.params = { config: k_dataStore };
kerio.lib.k_ajax.k_request(k_requestCfg);
},

k_saveDataCallback: function(k_response) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
if (kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
kerio.adm.k_framework.k_enableApplyReset(false);
if (!kerio.adm.k_framework.k_leaveCurrentScreen()) {
this.k_loadData(); }
}
}
}); k_kerioWidget.k_scanRulesGrid.k_addReferences({

k_saveRow: function(k_rowData, k_rowIndex) {
var
k_isSelectedRows,
k_isSelectedRow;
if (undefined === k_rowIndex) {
k_rowData.enabled = true; k_isSelectedRows = this.k_selectionStatus.k_selectedRowsCount ? this.k_selectionStatus.k_rows : false;
if (k_isSelectedRows) {
k_isSelectedRow = k_isSelectedRows[0];
k_rowIndex = k_isSelectedRow.k_data.k_isDefaultRule ? k_isSelectedRow.k_rowIndex : k_isSelectedRow.k_rowIndex + 1;
}
else {
k_rowIndex = 0;
}
this.k_addRow(k_rowData, k_rowIndex);
}
else {
this.k_updateRow(k_rowData, k_rowIndex);
}
kerio.adm.k_framework.k_enableApplyReset();
return true;
}
});
} }; 
kerio.waw.shared.k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS || {}; kerio.waw.shared.k_DEFINITIONS.K_AntivirusSettingsCfg = function(k_config) {

k_config = k_config || {};
var
k_result,
k_this = arguments.callee, k_tr = kerio.lib.k_tr,
k_isReadOnly = k_config.k_isReadOnly || false,
k_useIntegratedAntivirusCheckbox,
k_antivirusStatus,
k_antivirusSoftware; k_useIntegratedAntivirusCheckbox = {
k_type: 'k_checkbox',
k_id: 'antivirus.internalEnabled',
k_isReadOnly: k_isReadOnly,
k_option: k_tr('Use the integrated antivirus engine', 'antivirusList'),
k_onChange: k_this.k_onChange,
k_isLabelHidden: true
};
k_antivirusStatus = {
k_type: 'k_display',
k_id: 'antivirus' + '.' + 'k_status',
k_indent: 1,
k_template: '<span class="antivirusStatus {k_icon}">&nbsp; &nbsp; &nbsp;</span>{k_status}',
k_value: {
k_icon: 'noIcon',
k_status: ''
}
};
k_antivirusSoftware = {
k_type: 'k_fieldset',
k_caption: k_tr('Antivirus software', 'antivirusList'),
k_isLabelHidden: true,
k_items: [
k_useIntegratedAntivirusCheckbox,
{
k_type: 'k_columns',
k_id: 'k_externalAvContainer',
k_items: [
{
k_type: 'k_checkbox',
k_id: 'antivirus.externalEnabled',
k_isReadOnly: k_isReadOnly,
k_isLabelHidden: true,
k_option: k_tr('Use an external antivirus', 'antivirusList'),
k_onChange: k_this.k_onChange
},
{
k_type: 'k_select',
k_id: 'antivirus.selectedExternalId',
k_isReadOnly: k_isReadOnly,
k_isLabelHidden: true,
k_localData: [],
k_fieldDisplay: 'description',
k_fieldValue: 'id',
k_isDisabled: true,
k_validator: {
k_allowBlank: false }
},
{
k_type: 'k_formButton',
k_id: 'k_btnExternalOptions',
k_caption: k_tr('Options…', 'antivirusList'),
k_isDisabled: true,

k_onClick: function(k_form) {
var
k_selectedPlugin = k_form.k_getItem('antivirus.selectedExternalId').k_getValue(),
k_pluginOptions  = k_form._k_avDataStore.externalList[k_form._k_avPluginsIndex[k_selectedPlugin]].options;
kerio.lib.k_ui.k_showDialog(
{
k_sourceName: 'antivirusOptionsEditor',
k_params: {
k_relatedForm: k_form,
k_defaultOptions: k_form.k_defaultOptions,
k_pluginOptions: k_pluginOptions
}
}
);
}
}
]
},
k_antivirusStatus
]
};
k_result = {
k_init: k_this.k_init,
_k_references: {
_k_onAntivirusChange: k_config.k_onChange,
k_getAvData: k_this.k_getData,
k_setAvData: k_this.k_setData,
k_isInternalAvAvailable: k_this.k_isInternalAvAvailable,
k_updateAv: k_this.k_updateAv,
k_stopAvUpdate: k_this.k_stopAvUpdate
},
k_items: [
k_antivirusSoftware,
{
k_type: 'k_fieldset',
k_id: 'k_integratedEngineUpdateContainer',
k_caption: k_tr('Integrated antivirus engine', 'antivirusList'),
k_className: 'integratedEngineUpdateSophos',
k_minHeight: 125,
k_items: [
{
k_type: 'k_columns',
k_id: 'k_internalAvUpdateContainer',
k_isDisabled: true,
k_className: 'showBackground',
k_items: [
{
k_type: 'k_checkbox',
k_id: 'antivirus.internal.updateCheckInterval.enabled',
k_isLabelHidden: true,
k_option: k_tr('Check for update every', 'antivirusList'),

k_onChange: function(k_form, k_element, k_isChecked) {
k_form.k_setDisabled(['antivirus.internal.updateCheckInterval.value', 'antivirus.internal.updateCheckInterval.units'], !k_isChecked);
}
},
{
k_type: 'k_number',
k_id: 'antivirus.internal.updateCheckInterval.value',
k_isLabelHidden: true,
k_isDisabled: true,
k_width: 50,
k_minValue: 1,
k_maxValue: 999, k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_id: 'antivirus.internal.updateCheckInterval.units',
k_isDisabled: true,
k_value: k_tr('hours', 'antivirusList')
},
{
k_type: 'k_formButton',
k_id: 'k_btnUpdateNow',
k_isReadOnly: (undefined !== k_config.k_allowUpdate) ? !k_config.k_allowUpdate : k_isReadOnly,
k_caption: k_tr('Update Now', 'antivirusList'),
k_isHidden: k_isReadOnly,
k_isDisabled: true,
k_mask: false,

k_onClick: function(k_form) {
if (k_form.k_isChanged(true)) {
kerio.waw.status.k_currentScreen.k_showContentChangedAlert();
}
else {
k_form.k_updateAv();
}
}
}
]
},
{
k_type: 'k_container',
k_id: 'k_containerEngineInfo',
k_className: 'showBackground',
k_isDisabled: true,
k_labelWidth: 300,
k_isHidden: true, k_items: [
{
k_type: 'k_display',
k_id: 'status.lastUpdateCheck',
k_caption: k_tr('Last update check:', 'antivirusList'),
k_value: k_tr('Never', 'common')
},
{
k_type: 'k_display',
k_id: 'status.databaseAge',
k_caption: k_tr('Current virus database updated:', 'antivirusList'),
k_value: k_tr('Never', 'common')
},
{
k_type: 'k_display',
k_id: 'status.databaseVersion',
k_caption: k_tr('Virus database version:', 'antivirusList')
},
{
k_type: 'k_display',
k_id: 'status.engineVersion',
k_caption: k_tr('Scanning engine version:', 'antivirusList')
}
]
},
{
k_type: 'k_container',
k_id: 'k_containerAvFail',
k_className: 'showBackground',
k_isHidden: true, k_items: [
{
k_type: 'k_display',
k_id: 'k_internalAvStatus',
k_indent: 1,
k_template: '<span class="antivirusStatus {k_icon}">&nbsp; &nbsp; &nbsp;</span>{k_status} <br><a id="k_gotoRegister">{k_link}</a>',
k_value: {
k_icon: '',
k_status: '',
k_link: ''
},
k_onLinkClick: kerio.waw.shared.k_methods.k_gotoRegister
}
]
},
{
k_type: 'k_container',
k_id: 'k_containerUpdateProgress',
k_className: 'showBackground',
k_isHidden: true, k_items: [
{
k_type: 'k_columns',
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Update in progress:', 'antivirusList')
},
{
k_type: 'k_progressBar',
k_id: 'status.percentage',
k_width: 300,
k_value: 33,
k_maxValue: 100,
k_exceeded: {
k_message: '<b>' + k_tr('Update has failed.', 'antivirusList') + '</b>'
}
},
{
k_type: 'k_display',
k_id: 'status',
k_value: k_config.k_trStatusInitText
}
]
}
]
}
]
}
]
};
return k_result;
}; Ext.apply(kerio.waw.shared.k_DEFINITIONS.K_AntivirusSettingsCfg, {

k_init: function(k_form) {
k_form.k_addReferences(this._k_references);
k_form.k_addReferences({
_k_updateAvTaskManager: new kerio.lib.K_TaskRunner({
k_precision: 1000, k_taskList: [
{
k_id: 'k_updateAv',
k_interval: 1000,
k_scope: k_form,

k_run: function(k_request) {
kerio.lib.k_ajax.k_request(k_request);
return false; },
k_params: [
{ k_jsonRpc: { method: 'Antivirus.getUpdateStatus' },
k_onError: kerio.waw.shared.k_methods.k_ignoreErrors,
k_scope: k_form,

k_callback: function(k_response, k_success) {
var
AntivirusUpdatePhases = kerio.waw.shared.k_CONSTANTS.AntivirusUpdatePhases,
k_status = k_response.k_decoded.status;
if (k_success && k_response.k_isOk) {
this.k_setVisible('status.percentage',
(AntivirusUpdatePhases.AntivirusUpdateDownload === k_status.phase || AntivirusUpdatePhases.AntivirusUpdateDownloadEngine === k_status.phase)
);
switch (k_status.phase) {
case AntivirusUpdatePhases.AntivirusUpdateOk:
this.k_setDisabled('k_btnUpdateNow', false); this.k_setVisible(['k_containerUpdateProgress', 'k_containerAvFail'], false);
this.k_setVisible('k_containerEngineInfo');
k_status.lastUpdateCheck = kerio.waw.shared.k_methods.k_formatTimeSpan(k_status.lastUpdateCheck);
k_status.databaseAge = kerio.waw.shared.k_methods.k_formatTimeSpan(k_status.databaseAge);
this.k_setData({ status: k_status });
return;
case AntivirusUpdatePhases.AntivirusUpdateFailed:
k_status.lastUpdateCheck = kerio.waw.shared.k_methods.k_formatTimeSpan(k_status.lastUpdateCheck, true); k_status.databaseAge = kerio.waw.shared.k_methods.k_formatTimeSpan(k_status.databaseAge);
this.k_setData({status: k_status});
this.k_setDisabled('k_btnUpdateNow', false); this.k_setVisible(['k_containerUpdateProgress', 'k_containerAvFail'], false);
this.k_setVisible('k_containerEngineInfo');
return;
default:
}
this.k_setData({status: k_status});
this.k_textStatus.k_setValue(this.k_translations[k_status.phase]);
this._k_updateAvTaskManager.k_resume('k_updateAv'); }
else { if (k_response && k_response.k_decoded.message) {
k_status = kerio.waw.shared.k_methods.k_translateErrorMessage(k_response.k_decoded);
}
else {
k_status = kerio.lib.k_tr('Communication with server failed.', 'common');
}
this.k_getItem('k_internalAvStatus').k_setValue({
k_status: k_status,
k_link: '',
k_icon: 'error'
});
this.k_setDisabled('k_btnUpdateNow', false); this.k_setVisible(['k_containerUpdateProgress', 'k_containerEngineInfo'], false);
this.k_setVisible('k_containerAvFail');
}
}
}
]
}
]
}),
_k_updateAvUpdateRequestCfg: {
k_jsonRpc: { method: 'Antivirus.update' },
k_scope: k_form,

k_callback: function(k_response, k_success) {
if (k_success && k_response.k_isOk) {
if (!this._k_updateAvTaskManager.k_start('k_updateAv')) {
this._k_updateAvTaskManager.k_resume('k_updateAv');
}
}
}
}
});
},

k_setData: function(k_data) {
var
k_i, k_cnt,
k_avStatus,
k_avPluginsIndex,
k_link = false, k_avIcon = 'noIcon',
AntivirusStatus = kerio.waw.shared.k_CONSTANTS.AntivirusStatus,
k_tr = kerio.lib.k_tr,
k_methods = kerio.waw.shared.k_methods,
k_isAuditor = k_methods.k_isAuditor(),
k_isUnregisteredTrial = k_methods.k_isTrial(false),
k_isInternalAvailable = k_data.internal.available,
k_isUpdateAvailable  = !k_data.internal.expired,
k_noExtAvAvailable = k_data.externalList && (0 === k_data.externalList.length),
k_internalAntivirusFieldsetHeight = 142;
this._k_avDataStore = k_data;
k_avPluginsIndex = {};
k_cnt = k_data.externalList ? k_data.externalList.length : 0;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_avPluginsIndex[k_data.externalList[k_i].id] = k_i; }
this._k_avPluginsIndex = k_avPluginsIndex;
if (!k_noExtAvAvailable) {
this.k_getItem('antivirus.selectedExternalId').k_setData(k_data.externalList);
if (!k_data.selectedExternalId || undefined === k_avPluginsIndex[k_data.selectedExternalId]) {
k_data.selectedExternalId = k_data.externalList[0].id; }
}
else {
k_data.selectedExternalId = '';
}
this.k_setVisible('k_externalAvContainer', !k_noExtAvAvailable);
if (!k_isInternalAvailable) {
k_avStatus = k_tr('You don\'t have a valid license for the integrated Sophos® antivirus.', 'antivirusList');
k_link = k_tr('To enable the Sophos® antivirus, you can register a new license number for the product with license for Sophos® included.', 'antivirusList');
k_avIcon = 'warning';
}
else if (!k_isUpdateAvailable) {
if (k_isUnregisteredTrial) { k_avStatus = k_tr('Updates are not available in the unregistered trial.', 'antivirusList');
k_link = k_tr('Please register to enable antivirus updates.', 'antivirusList');
k_avIcon = 'warning';
}
else { k_avStatus = k_tr('Updates are available only with valid Software Maintenance.', 'antivirusList');
k_link = k_tr('To enable the Sophos® antivirus updates, you can register a new Software Maintenance number with Sophos® included.', 'antivirusList');
k_avIcon = 'warning';
}
}
else { k_avStatus = true;
}
this._k_internalAvLicensed = k_isInternalAvailable || k_isUnregisteredTrial; this._k_internalAvUpdatable = k_isUpdateAvailable; this._k_isUnregisteredTrial = k_isUnregisteredTrial;
if (k_isUpdateAvailable) {
this.k_setVisible('k_containerAvFail', false);
}
else {
this.k_getItem('k_internalAvStatus').k_setValue({
k_status: k_avStatus,
k_link: k_link ? k_link : '',
k_icon: k_avIcon
});
k_internalAntivirusFieldsetHeight = k_link ? 105 : 75;
this.k_setVisible('k_containerEngineInfo', false);
this.k_setVisible('k_containerAvFail');
}
this.k_getItem('k_integratedEngineUpdateContainer').k_setSize({k_minHeight: k_internalAntivirusFieldsetHeight});
this.k_setReadOnly('antivirus.internalEnabled', !k_isInternalAvailable || k_isAuditor); this.k_setReadOnly('k_internalAvUpdateContainer', !k_isUpdateAvailable || k_isAuditor);
if (!k_isInternalAvailable) {
if (k_data.status === AntivirusStatus.AntivirusInternalFailed) { k_data.status = AntivirusStatus.AntivirusOk;
}
else if (k_data.status === AntivirusStatus.AntivirusBothFailed) {
k_data.status = AntivirusStatus.AntivirusExternalFailed;
}
}
switch (k_data.status) {
case AntivirusStatus.AntivirusOk:
k_avIcon = ''; if (k_data.internalEnabled && k_data.externalEnabled) {
k_avStatus = k_tr('Both internal and external antivirus are running OK.', 'antivirusList');
}
else if (k_data.internalEnabled) {
k_avStatus = k_tr('The internal antivirus is running OK.', 'antivirusList');
}
else if (k_data.externalEnabled) {
k_avStatus = k_tr('The external antivirus is running OK.', 'antivirusList');
}
else { k_avStatus = k_tr('No antivirus is running!', 'antivirusList');
k_avIcon = 'warning';
}
break;
case AntivirusStatus.AntivirusNotActive:
k_avStatus = k_tr('No antivirus is running!', 'antivirusList');
k_avIcon = 'warning';
break;
case AntivirusStatus.AntivirusInternalFailed:
k_avStatus = k_tr('The internal antivirus has failed to start!', 'antivirusList');
k_avIcon = 'error';
break;
case AntivirusStatus.AntivirusExternalFailed:
k_avStatus = k_tr('The external antivirus has failed to start!', 'antivirusList');
k_avIcon = 'error';
break;
case AntivirusStatus.AntivirusBothFailed:
k_avStatus = k_tr('Both internal and external antivirus have failed to start!', 'antivirusList');
k_avIcon = 'error';
break;
}
this.k_getItem('antivirus' + '.' + 'k_status').k_setValue({
k_icon: k_avIcon,
k_status: k_avStatus
});
k_data = { antivirus: k_data }; return kerio.lib.K_Form.prototype.k_setData.apply(this, arguments);     },

k_isInternalAvAvailable: function() {
return this._k_internalAvLicensed;
},

k_getData: function() {
var
k_dataStore = this._k_avDataStore,
k_data;
k_data = kerio.lib.K_Form.prototype.k_getData.apply(this, arguments); k_data = k_data.antivirus; delete k_data.logo; kerio.waw.shared.k_methods.k_mergeObjects(k_data, k_dataStore);
return k_dataStore;
},

k_onChange: function(k_form, k_element, k_value) {
var
k_intAvEnabled   = k_form.k_getItem('antivirus.internalEnabled').k_getValue(),
k_isExtAv        = undefined !== k_form.k_getItem('antivirus.externalEnabled'),
k_extAvEnabled   = k_isExtAv ? k_form.k_getItem('antivirus.externalEnabled').k_getValue() : null,
k_selectedPlugin = k_isExtAv ? k_form.k_getItem('antivirus.selectedExternalId').k_getValue() : null,
k_isVisible = false,
k_avPluginsIndex,
k_externalList;
k_form.k_setDisabled(['k_internalAvUpdateContainer', 'k_containerEngineInfo'], !k_intAvEnabled || k_form._k_isUnregisteredTrial);
k_form.k_setDisabled(['antivirus.selectedExternalId', 'k_btnExternalOptions'], !k_extAvEnabled);
if (k_selectedPlugin) {
k_avPluginsIndex = k_form._k_avPluginsIndex;
k_externalList = k_form._k_avDataStore.externalList;
if (k_avPluginsIndex && undefined !== k_avPluginsIndex[k_selectedPlugin] && k_externalList && k_externalList[k_avPluginsIndex[k_selectedPlugin]]
&& k_externalList[k_avPluginsIndex[k_selectedPlugin]].options &&  0 < k_externalList[k_avPluginsIndex[k_selectedPlugin]].options.length) {
k_isVisible = true;
}
k_form.k_setVisible('k_btnExternalOptions', k_isVisible);
}
if ('function' === typeof k_form._k_onAntivirusChange) {
k_form._k_onAntivirusChange.call(k_form, k_intAvEnabled, k_extAvEnabled, k_selectedPlugin);
}
},

k_updateAv: function(k_forceUpdate) {
this.k_setDisabled('k_btnUpdateNow'); if (!this._k_internalAvUpdatable) {
this.k_setVisible('k_containerUpdateProgress', false);
return; }
this.k_setVisible(['k_containerAvFail', 'k_containerEngineInfo', 'status.percentage'], false);
this.k_setVisible('k_containerUpdateProgress');
this.k_setData({ "status.percentage": 0 });
if (false !== k_forceUpdate) {
this.k_textStatus.k_setValue(this.k_translations[kerio.waw.shared.k_CONSTANTS.AntivirusUpdatePhases.AntivirusUpdateStarted]);
kerio.lib.k_ajax.k_request(this._k_updateAvUpdateRequestCfg);
}
else {
this.k_textStatus.k_setValue(this.k_translations[kerio.waw.shared.k_CONSTANTS.AntivirusUpdatePhases.k_UPDATE_STATUS]);
if (!this._k_updateAvTaskManager.k_start('k_updateAv')) {
this._k_updateAvTaskManager.k_resume('k_updateAv');
}
}
},

k_stopAvUpdate: function() {
this._k_updateAvTaskManager.k_stop('k_updateAv');
}
}); 