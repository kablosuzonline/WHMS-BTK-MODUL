
kerio.waw.ui.configurationImport = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_isLinux = kerio.waw.shared.k_methods.k_isLinux(),
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_formUpload, k_formUploadCfg,
k_formImportMode, k_formImportModeCfg,
k_formInterfaces, k_formInterfacesCfg,
k_formVlanInterfaces, k_formVlanInterfacesCfg,
k_formFinish, k_formFinishCfg,
k_interfacesGrid, k_interfacesGridCfg,
k_vlanInterfacesGrid, k_vlanInterfacesGridCfg, k_localPortSelector,
k_interfacesToolbar, k_interfacesToolbarCfg,
k_wizard, k_wizardCfg,
k_dialog, k_dialogCfg,
k_multilineRenderer,
k_lineRendererImported,
k_lineRendererLocal,
k_vlanRegex = /\/(\w+)\/(\w+)\/\{([\w\-]+)\}\/(\d+)/i,
k_gridEmptyMsg;
if (!kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.finalVersion && kerio.waw.shared.k_methods.k_isIos()) {
kerio.lib.k_reportError('Configuration import editor opened on iOS system.', 'configurationImport');
return;
}
k_interfacesToolbarCfg = {
k_hasSharedMenu: true,
k_items: [
{
k_id: 'k_btnSetInterface',
k_caption: k_tr('Select Interface…', 'configurationImport'),
k_onClick: this.k_setInterface
}
],
k_update: this.k_onSelect
};
k_interfacesToolbar = new kerio.lib.K_Toolbar(k_localNamespace + 'grid' + '_' + 'k_toolbar', k_interfacesToolbarCfg); 
k_multilineRenderer = function(k_value, k_data, k_rowIndex, k_colIndex, k_grid) {
var
k_columnId = k_grid.k_getColumnId(k_colIndex);
return {
k_isCollapsible: false,
k_isSecure: true,
k_lineRenderer: ('importedInterface' === k_columnId) ? k_grid.k_lineRendererImported : k_grid.k_lineRendererLocal
};
}; 
k_lineRendererImported = function(k_value, k_data, k_rowIndex, k_colIndex, k_grid, k_itemIndex) {
if (0 === k_itemIndex) {
return kerio.waw.shared.k_methods.k_formatInterfaceName(k_value, k_data);
}
return {
k_data: k_value,
k_iconCls: ''
};
}; 
k_lineRendererLocal = function(k_value, k_data, k_rowIndex, k_colIndex, k_grid, k_itemIndex) {
if (0 === k_itemIndex) {
if (kerio.waw.shared.k_CONSTANTS.InterfaceType.k_UNASSIGNED !== k_value) {
return kerio.waw.shared.k_methods.k_formatInterfaceName(k_value, this.k_dialog.k_localInterfaces[k_data.currentInterface.k_index]);
}
k_value = k_grid.k_trUnassigned;
}
return {
k_data: k_value,
k_iconCls: ''
};
}; k_gridEmptyMsg = [
'<b>',
k_tr('There are no interfaces in the uploaded configuration.', 'configurationImport'),
'<br>',
k_tr("No changes will be done in the interfaces' TCP/IP settings.", 'configurationImport'),
'</b>'
];
k_interfacesGridCfg = {
k_selectionMode: 'k_single',
k_className: 'removePadding interfaceList undead', k_emptyMsg: k_gridEmptyMsg.join(''),
k_columns: {
k_sorting: false,
k_items: [
{k_columnId: 'type'         ,  k_isDataOnly: true},
{k_columnId: 'importedId'   ,  k_isDataOnly  : true},
{k_columnId: 'name'         ,  k_isHidden: true, k_isKeptHidden: true,

k_renderer: function(k_value, k_data) {
var
k_currentInterface = k_data.currentInterface,
k_localInterfaces = this.k_dialog.k_localInterfaces,
k_localInterface;
k_data.importedInterface  = [k_data.name, ('0.0.0.0' === k_data.ip) ? '' : k_data.ip, ''];
k_localInterface = k_localInterfaces[k_currentInterface.k_index];
if (k_localInterface) {
k_data.currentInterfaceRenderer = [k_localInterface.id.name, k_localInterface.ip, k_localInterface.MAC];
}
else {
k_data.currentInterfaceRenderer = this.k_unassignedRow;
}
return {k_data: ''}; }},
{k_columnId: 'importedInterface'  ,  k_caption: k_tr('Uploaded Configuration', 'configurationImport') , k_width: 250,
k_multilineRenderer: k_multilineRenderer
},
{k_columnId: 'currentInterfaceRenderer'          ,  k_caption: k_tr('This Firewall (Double click a row to change it)', 'configurationImport'),
k_multilineRenderer: k_multilineRenderer
}
]
},k_toolbars: {
k_bottom: k_interfacesToolbar
},
k_contextMenu: k_interfacesToolbar.k_sharedMenu,

k_onDblClick: function(){
this.k_setInterface(this.k_toolbars.k_bottom); }
}; k_interfacesGrid = new kerio.lib.K_Grid(k_localNamespace + 'grid', k_interfacesGridCfg);
k_localPortSelector = {
k_id: 'k_localPortSelector',
k_type: 'k_select',
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',
k_localData: [],
k_onBlur: function(k_grid, k_select) {
var
k_editInfo = k_grid.k_getEditInfo(),
k_match,
k_localPort = k_editInfo.k_rowData.currentInterface;
k_localPort.id = k_editInfo.k_rowData.importedId;
k_match = k_localPort.id.match(k_grid.k_dialog.k_vlanRegex);
if (k_match && k_match[3] && k_select._k_prevValue !== k_grid.k_unassignedRow[0]) {
k_localPort.id = k_localPort.id.replace(k_match[3], k_select._k_prevValue);
k_localPort.name = k_editInfo.k_rowData.name;
k_localPort.MAC = k_select._k_prevValue;
k_localPort.invalid = false;
}
}
};
k_vlanInterfacesGridCfg = {
k_selectionMode: 'k_single',
k_className: 'removePadding interfaceList undead', k_emptyMsg: k_gridEmptyMsg.join(''),
k_columns: {
k_sorting: false,
k_items: [
{k_columnId: 'type'         ,  k_isDataOnly: true},
{k_columnId: 'importedId'   ,  k_isDataOnly  : true},
{k_columnId: 'name'         ,  k_isHidden: true, k_isKeptHidden: true,

k_renderer: function(k_value, k_data) {
var
k_currentInterface = k_data.currentInterface,
k_localInterfaces = this.k_dialog.k_localInterfaces,
k_localInterface, k_vlanMatch, k_ifaceMatch, k_i;
k_data.importedInterface  = [k_data.name, ('0.0.0.0' === k_data.ip) ? '' : k_data.ip, ''];
k_ifaceMatch = k_currentInterface.id.match(this.k_dialog.k_vlanRegex);
k_vlanMatch = k_data.importedId.match(this.k_dialog.k_vlanRegex);
if (k_ifaceMatch) {
for (k_i = 0; k_i < k_localInterfaces.length; k_i++) {
if (k_ifaceMatch[3] == k_localInterfaces[k_i].MAC && k_vlanMatch && k_vlanMatch[4] === k_ifaceMatch[4]) {
k_localInterface = k_localInterfaces[k_i];
break;
}
}
}
if (k_localInterface) {
k_currentInterface.k_index = k_i;
k_currentInterface.k_vlan = true;
k_data.currentInterfaceRenderer = [k_currentInterface.name || k_data.name, k_data.ip, k_currentInterface.MAC || ''];
} else {
k_data.currentInterfaceRenderer = this.k_unassignedRow;
}
return {k_data: ''}; }},
{k_columnId: 'importedInterface'  ,  k_caption: k_tr('Uploaded VLAN Interface', 'configurationImport') , k_width: 250,
k_multilineRenderer: k_multilineRenderer
},
{k_columnId: 'currentInterfaceRenderer'          ,  k_caption: k_tr('Mapped port', 'configurationImport'),
k_multilineRenderer: k_multilineRenderer, k_editor: k_localPortSelector
},
]
}
}; k_vlanInterfacesGrid = new kerio.lib.K_Grid(k_localNamespace + '1_grid', k_vlanInterfacesGridCfg);
k_formUploadCfg = {
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_isSecure: true,
k_value: '<b>' + k_tr('Click the button below to upload your exported configuration.', 'configurationImport') + '</b>'
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('With import you can restore your old configuration on the same machine, migrate Kerio Control installation to a different machine or even share the same configuration on several machines.', 'configurationImport')
},
{
k_type: 'k_container',
k_height: 30,
k_items: [
{
k_type: 'k_formUploadButton',
k_id: 'file', k_caption: k_tr('Upload Configuration File…', 'configurationImport'),
k_remoteData: {
k_isAutoUpload: false, k_jsonRpc: {'method': 'Configuration.getImportInfo'}
},

k_onChange: function(k_form, k_item, k_value) {
var
k_nameParts = k_value.toLowerCase().split('.'),
k_dialog = k_form.k_dialog,
k_toolbar = k_dialog.k_toolbar;
if (('gz' !== k_nameParts[k_nameParts.length - 1] || 'tar' !== k_nameParts[k_nameParts.length - 2]) && 'tgz' !== k_nameParts[k_nameParts.length - 1] && 'tar' !== k_nameParts[k_nameParts.length - 1]) {
kerio.lib.k_alert({
k_icon: 'warning',
k_title: kerio.lib.k_tr('Incorrect Input', 'common'),
k_msg: kerio.lib.k_tr('Please select proper configuration backup file.', 'configurationImport')
});
k_item.k_reset();
k_toolbar.k_disableItem('k_btnNext');
return;
}
k_dialog.k_showMask(kerio.lib.k_tr('Uploading and analyzing new configuration…', 'configurationImport'));
k_toolbar.k_disableItem('k_btnBack');
k_toolbar.k_disableItem('k_btnNext');
k_dialog.k_uploadForm.k_setVisible(['file'], false);
this.k_upload();
},
k_onUpload: function(k_form, k_item, k_response, k_success, k_params) {
var k_dialog = k_form.k_dialog;
if (k_success && k_response.k_isOk && 0 === k_response.k_decoded.errors.length) {
k_dialog.k_uploadProgressCallback(k_response, k_params.k_fileId);
}
else {
k_form.k_dialog.k_hideMask();
k_item.k_reset();
k_item.k_setVisible(true);
}
}
}
]
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Please note that the upload process may take from few seconds to several minutes depending on the file size and your connection speed.', 'configurationImport')
}
]
}; k_formImportModeCfg = {
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_template: '<b>{k_title}</b><br>&nbsp;',
k_value: {
k_title: k_tr('Select a method for import:', 'configurationImport')
}
},
{
k_type: 'k_row',
k_className: 'importRadioRow',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_fullImport',
k_isLabelHidden: true,
k_option: '<br />',
k_value: true,
k_isChecked: true,
k_onChange: function(k_form, k_item, k_value) {
k_form.k_dialog.k_fullImport = k_value;
}
},
{
k_type: 'k_display',
k_value: '<a>' + k_tr('Restore from backup', 'configurationImport') + '<br />' + k_tr('Replace the current configuration completely', 'configurationImport') + '</a>',
k_isSecure: true,
k_onLinkClick: function(k_form) {
k_form.k_getItem('k_fullImport').k_setValue(true);
}
}
]
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: ' '
},
{
k_type: 'k_row',
k_className: 'importRadioRow',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_fullImport',
k_isLabelHidden: true,
k_option: '<br />',
k_value: false,
k_onChange: function(k_form, k_item, k_value) {
k_form.k_dialog.k_fullImport = k_value;
}
},
{
k_type: 'k_display',
k_value: '<a>' + k_tr('Transfer configuration from another Kerio Control installation', 'configurationImport') + '<br />' + k_tr("Keep current values of the interfaces' TCP/IP settings (such as IP addresses).", 'configurationImport') + '</a>',
k_isSecure: true,
k_onLinkClick: function(k_form) {
k_form.k_getItem('k_fullImport').k_setValue(false);
}
}
]
}
]
}; k_formInterfacesCfg = {
k_restrictBy: {
k_isLinux: k_isLinux
},
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr("If you import configuration from a different machine or your machine's hardware has changed since last export, Kerio Control guesses mapping of imported interfaces for the current ones. Please check the assigned interfaces and change them if necessary.", 'configurationImport')
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_isSecure: true,
k_value: '<b>' + k_tr('Set correct interfaces on your firewall so that they match the imported ones.', 'configurationImport') + '</b>'
},
{
k_type: 'k_container',
k_content: k_interfacesGrid
}
]
}; k_formVlanInterfacesCfg = {
k_restrictBy: {
k_isLinux: k_isLinux
},
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr("If you import configuration from a different machine or your machine's hardware has changed since last export, Kerio Control guesses mapping of imported interfaces for the current ones. Please check the assigned interfaces and change them if necessary.", 'configurationImport')
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_isSecure: true,
k_value: '<b>' + k_tr('Set correct VLAN interfaces ports on your firewall so that they match the imported ones.', 'configurationImport') + '</b>'
},
{
k_type: 'k_container',
k_content: k_vlanInterfacesGrid
}
]
}; k_formFinishCfg = {
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_template: '<b>{k_title}</b>',
k_value: {
k_title: k_tr('Your new configuration is ready to apply', 'configurationImport', {k_args: [ kerio.waw.shared.k_DEFINITIONS.k_PRODUCT_NAME]})
},
k_isLabelHidden: true
},
{
k_type: 'k_display',
k_style: 'margin-top: 1.5em',
k_value: k_tr('Kerio Control will now restart. You will have to login again.', 'configurationImport'),
k_isLabelHidden: true
},
{
k_type: 'k_display',
k_id: 'k_myKerioFullImport',
k_isHidden: !k_isLinux,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_style: 'margin-top: 1.5em',
k_value: k_tr('Please note that the configuration import neither joins nor leaves the directory service domain.', 'configurationImport'),
k_isLabelHidden: true
},
{
k_type: 'k_display',
k_id: 'k_myKerioSmallImport',
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_style: 'margin-top: 1.5em',
k_value: k_tr('Please note that the configuration import neither joins nor leaves the directory service domain or MyKerio cloud service.', 'configurationImport'),
k_isLabelHidden: true
},
{
k_type: 'k_display',
k_isHidden: !kerio.waw.shared.k_methods.k_isConnectionSecured(),
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_style: 'margin-top: 1.5em',
k_value: [
k_tr('If your new configuration includes SSL certificates for Web Interface, some browsers may have a problem with the new kind of connection.', 'configurationImport'),
k_tr('If the login page or the Kerio Control Administration fails to load, please close all the browser windows and start it again.', 'configurationImport')
].join(' '),
k_isLabelHidden: true
}
]
}; k_formUpload     = new k_lib.K_Form(k_localNamespace + 'k_formUpload',     k_formUploadCfg);
k_formImportMode = new k_lib.K_Form(k_localNamespace + 'k_formImportMode', k_formImportModeCfg);
k_formInterfaces = new k_lib.K_Form(k_localNamespace + 'k_formInterfaces', k_formInterfacesCfg);
k_formVlanInterfaces = new k_lib.K_Form(k_localNamespace + 'k_formVlanInterfaces', k_formVlanInterfacesCfg);
k_formFinish     = new k_lib.K_Form(k_localNamespace + 'k_formFinish',     k_formFinishCfg);
k_wizardCfg = {
k_showPageHeader: false, k_items: [
{
k_content: k_formUpload,
k_caption: k_tr('Configuration file', 'configurationImport'),
k_id: 'k_pageUpload'
},
{
k_content: k_formImportMode, k_caption: k_tr('Import mode', 'configurationImport'),
k_id: 'k_pageImportMode'
},
{
k_content: k_formInterfaces,
k_caption: k_tr('Interfaces', 'configurationImport'),
k_id: 'k_pageInterfaces'
},
{
k_content: k_formVlanInterfaces,
k_caption: k_tr('VLAN Interfaces', 'configurationImport'),
k_id: 'k_pageVlanInterfaces'
},
{
k_content: k_formFinish,
k_caption: k_tr('Finish', 'common'),
k_id: 'k_pageFinish'
}
],
k_onBeforeTabChange: function(k_wizard, k_newTabId) {
if ('k_pageFinish' === k_newTabId) {
var
k_dialog = k_wizard.k_getParentWidget(),
k_pageFinish = k_wizard.k_getTabContent('k_pageFinish');
k_pageFinish.k_setVisible('k_myKerioFullImport', k_dialog.k_fullImport);
k_pageFinish.k_setVisible('k_myKerioSmallImport', !k_dialog.k_fullImport);
}
}
};
k_wizard = new k_lib.K_Wizard(k_localNamespace + 'k_wizard', k_wizardCfg);
k_dialogCfg = {
k_width: 600,
k_height: 550,
k_title: k_tr('Import Configuration', 'configurationImport'),
k_content: k_wizard,
k_hasHelpIcon: false, k_buttons: [
{
k_isDisabled: true,
k_id: 'k_btnBack',
k_caption: k_tr('< Back', 'common'),
k_onClick: this.k_goBack
},
{
k_isDefault: true,
k_isDisabled: true,
k_id: 'k_btnNext',
k_caption: k_tr('Next >', 'common'),
k_onClick: this.k_goNext
},
{
k_isDefault: true,
k_isHidden: true,
k_id: 'k_btnFinish',
k_caption: k_tr('Finish', 'common'),
k_mask: {
k_message: k_tr('Saving…', 'common')
},
k_onClick: this.k_goFinish
},
{
k_isCancel: true,
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'common')
}
]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences(
{
k_isLinux: k_isLinux,
k_wizard: k_wizard,
k_interfaces: k_interfacesGrid,
k_vlanInterfaces: k_vlanInterfacesGrid,
k_portSelector: kerio.lib.k_getWidgetById(k_localPortSelector.k_id),
k_uploadForm: k_formUpload,
k_importModeForm: k_formImportMode,
k_uploadButton: k_formUpload.k_getItem('file'),
k_localInterfaces: [],
k_importedInterfaces: [],
k_uploadId: '',
k_serverInterfacesResponse: {},
k_fullImport: true,
k_needIfaceMapping: false,
k_vlanRegex: k_vlanRegex
}
);if (k_isLinux) {
k_dialog.k_addReferences({
k_containerFullImport: k_formInterfaces.k_getItem('k_containerFullImport'),
k_checkboxFullImport: k_formInterfaces.k_getItem('k_fullImport')
});
}
k_formUpload.k_addReferences({
k_dialog: k_dialog
});
k_formImportMode.k_addReferences({
k_dialog: k_dialog
});
k_interfacesGrid.k_addReferences({
k_dialog: k_dialog,
k_lineRendererImported: k_lineRendererImported,
k_lineRendererLocal: k_lineRendererLocal,
k_trUnassigned: '      ' + k_tr('<Unassigned>', 'interfaceList'),
k_unassignedRow: [
kerio.waw.shared.k_CONSTANTS.InterfaceType.k_UNASSIGNED,
'',
''
]
});
kerio.lib.k_registerObserver(k_interfacesGrid, k_interfacesToolbar, [ kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED ]);
k_vlanInterfacesGrid.k_addReferences({
k_dialog: k_dialog,
k_lineRendererImported: k_lineRendererImported,
k_lineRendererLocal: k_lineRendererLocal,
k_trUnassigned: '      ' + k_tr('<Unassigned>', 'interfaceList'),
k_unassignedRow: [kerio.waw.shared.k_CONSTANTS.InterfaceType.k_UNASSIGNED]
});
kerio.lib.k_registerObserver(k_vlanInterfacesGrid, k_interfacesToolbar, [ kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED ]);
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_interfaces.k_addReferences({
k_setInterface: this.k_setInterface
});
k_kerioWidget.k_wizard.k_addReferences({
k_goBack: this.k_goBack,
k_goNext: this.k_goNext,
k_goFinish: this.k_goFinish
});

k_kerioWidget.k_applyParams = function(k_params) {
this.k_isRestarting = false;
this.k_assistent = k_params.k_assistent;
if (k_params.k_assistent) {
k_params.k_assistent.k_hide();
}
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_dialogs: ['configurationImportInterfaceEditor']
});
};

k_kerioWidget.k_resetOnClose = function() {
var
k_toolbar = this.k_toolbar;
this.k_resetUploadForm();
k_toolbar.k_showItem('k_btnNext');
k_toolbar.k_hideItem('k_btnFinish');
this.k_wizard.k_setActiveTab('k_pageUpload');
this.k_stop = true;
if (!this.k_isRestarting && this.k_assistent) {
this.k_assistent.k_show();
}
};

k_kerioWidget.k_resetUploadForm = function() {
var
k_uploadForm = this.k_uploadForm;
k_uploadForm.k_reset();
k_uploadForm.k_setVisible('file', true);
k_uploadForm.k_setVisible('k_uploadProgress', false);
this.k_importModeForm.k_reset();
};

k_kerioWidget.k_uploadProgressCallback = function(k_response, k_uploadId) {
var
k_decoded = k_response.k_decoded,
k_toolbar = this.k_toolbar;
this.k_hideMask(); k_toolbar.k_disableItem('k_btnBack');
k_toolbar.k_disableItem('k_btnNext');
this.k_fullImport = k_decoded.fullImportPossible ? true : null; this.k_uploadId = k_uploadId;
this.k_serverInterfacesResponse = k_decoded;
this.k_toolbar.k_enableItem('k_btnBack');
this.k_toolbar.k_enableItem('k_btnNext');
this.k_wizard.k_goNext(this.k_toolbar);
};

k_kerioWidget.k_mapInterfaces = function(k_vlan) {
var
k_decoded = this.k_serverInterfacesResponse,
k_indexImported, k_cntImported,
k_indexLocal, k_cntLocal,
k_localInterface,
k_currentInterface,
k_importedInterfaces,
k_vlanInterfaces = [],
k_localInterfaces, k_localPorts = [],
k_emptyLocalInterface, k_match,
k_isFullImportWithMapping;
k_importedInterfaces = k_decoded.importedInterfaces;
k_localInterfaces = k_decoded.currentInterfaces;
this.k_needIfaceMapping = k_decoded.needIfaceMapping;
this.k_importedInterfaces = k_importedInterfaces;
k_emptyLocalInterface = {
id: '',
invalid: false,
name: ''
};
k_isFullImportWithMapping = this.k_fullImport && this.k_needIfaceMapping;
if (k_isFullImportWithMapping) {
for (k_indexLocal = k_localInterfaces.length - 1 ; k_indexLocal >= 0; k_indexLocal--) {
k_localInterface = k_localInterfaces[k_indexLocal];
if (!k_localInterface.useForFullImport) {
k_localInterfaces.splice(k_indexLocal, 1);
}
}
}
for (k_indexImported = 0, k_cntImported = k_importedInterfaces.length; k_indexImported < k_cntImported; k_indexImported++) {
k_currentInterface = k_importedInterfaces[k_indexImported].currentInterface;
if ('' !== k_currentInterface.id) {
for (k_indexLocal = 0, k_cntLocal = k_localInterfaces.length; k_indexLocal < k_cntLocal; k_indexLocal++) {
k_localInterface = k_localInterfaces[k_indexLocal];
if (k_currentInterface.id === k_localInterface.id.id) {
break;
}
}
if (k_indexLocal < k_cntLocal) {
if (!k_isFullImportWithMapping || (k_isFullImportWithMapping && k_localInterface.useForFullImport)) {
k_currentInterface.k_index = k_indexLocal;
k_currentInterface.type = k_localInterface.type;
k_localInterface.k_index = k_indexImported;
} else {
k_currentInterface = k_emptyLocalInterface;
}
}
}
k_match = k_importedInterfaces[k_indexImported].importedId.match(this.k_vlanRegex);
if (k_match && k_match[2] === 'vlan') {
k_vlanInterfaces.push(k_importedInterfaces[k_indexImported]);
}
}
this.k_localInterfaces = k_localInterfaces;
this.k_importedInterfacesRendered = k_importedInterfaces;
if (k_vlan) {
this.k_vlanInterfaces.k_clearData();
this.k_vlanInterfaces.k_setData(k_vlanInterfaces);
for (k_i = 0, k_cnt = k_localInterfaces.length; k_i < k_cnt; k_i++) {
k_localPorts.push(
{	'k_name': k_localInterfaces[k_i].name || k_localInterfaces[k_i].MAC,
'k_value': k_localInterfaces[k_i].MAC
}
);
}
this.k_portSelector.k_setData(k_localPorts);
} else {
this.k_interfaces.k_clearData();
this.k_interfaces.k_setData(k_importedInterfaces);
}
};
}, 
k_goBack: function(k_toolbar) {
var
k_dialog = k_toolbar.k_parentWidget,
k_wizard = k_dialog.k_wizard,
k_activeTab = k_wizard.k_activeTabIndex;
k_wizard.k_prev(); if (3 <= k_activeTab) { k_toolbar.k_showItem('k_btnNext');
k_toolbar.k_hideItem('k_btnFinish');
if (k_dialog.k_fullImport && !k_dialog.k_needIfaceMapping) {
k_wizard.k_prev(); k_activeTab--;
}
}
if (2 === k_activeTab && null === k_dialog.k_fullImport) {
k_wizard.k_prev(); k_activeTab--;
}
if (1 === k_activeTab) { k_toolbar.k_disableItem('k_btnBack');
}
},

k_goNext: function(k_toolbar) {
var
k_dialog = k_toolbar.k_parentWidget,
k_wizard = k_dialog.k_wizard,
k_activeTab = k_wizard.k_activeTabIndex,
k_interfaces = [],
k_importedInterfacesRendered,
k_i;
k_wizard.k_next(); k_toolbar.k_enableItem('k_btnBack');
if (0 === k_activeTab) { k_dialog.k_resetUploadForm();
if (null === k_dialog.k_fullImport) {
k_wizard.k_next(); k_activeTab++;
}
}
if (1 === k_activeTab) { k_dialog.k_mapInterfaces();
if (k_dialog.k_fullImport) {
if (k_dialog.k_needIfaceMapping) {
k_dialog.k_interfaces.k_clearData();
k_importedInterfacesRendered = k_dialog.k_importedInterfacesRendered;
for (k_i = k_importedInterfacesRendered.length - 1; k_i >= 0; k_i--) {
if (k_importedInterfacesRendered[k_i].useForFullImport) {
k_importedInterfacesRendered[k_i].k_originalIndex = k_i;
k_interfaces.push(k_importedInterfacesRendered[k_i]);
}
}
k_dialog.k_interfaces.k_setData(k_interfaces);
}
else {
k_wizard.k_next(); k_activeTab++;
}
}
}
if (2 === k_activeTab) {
k_dialog.k_mapInterfaces(true);
if (k_dialog.k_vlanInterfaces.k_getData().length <= 0) {
k_wizard.k_next();  k_activeTab++;
}
}
if (3 === k_activeTab) { k_toolbar.k_hideItem('k_btnNext');
k_toolbar.k_showItem('k_btnFinish');
}
},

k_goFinish: function(k_toolbar) {
var
k_dialog = k_toolbar.k_parentWidget,
k_interfaces = k_dialog.k_interfaces.k_getData(),
k_vlanInterfaces = k_dialog.k_vlanInterfaces.k_getData(),
k_localInterfaces = k_dialog.k_localInterfaces,
k_importedInterfaces = k_dialog.k_importedInterfaces,
k_i, k_cnt, k_j,
k_interface,
k_unassignedInterface,
k_fullImport;
k_unassignedInterface = {
id: '',
name: '',
invalid: false
};
if (k_dialog.k_needIfaceMapping) {
for (k_i = 0, k_cnt = k_interfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_i];
k_importedInterfaces[k_interface.k_originalIndex] = k_interface;
}
k_interfaces = k_importedInterfaces;
}
for (k_i = 0, k_cnt = k_interfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_i];
if (undefined !== k_interface.currentInterface.k_index) {
k_interface.currentInterface = k_localInterfaces[k_interface.currentInterface.k_index].id;
}
else {
for (k_j = 0; k_j < k_vlanInterfaces.length; k_j++) {
if (k_vlanInterfaces[k_j].importedId === k_interface.importedId) {
k_interface = k_vlanInterfaces[k_j];
k_interfaces[k_i] = k_vlanInterfaces[k_j];
break;
}
}
if (k_interface.currentInterface.k_vlan) {
delete k_interface.currentInterface.k_vlan;
} else {
k_interface.currentInterface = k_unassignedInterface;
}
}
delete k_interface.importedInterface;
delete k_interface.currentInterfaceRenderer;
delete k_interface.k_originalIndex;
}
k_fullImport = k_dialog.k_isLinux && k_dialog.k_fullImport;
if (false !== k_fullImport && true !== k_fullImport) {
k_fullImport = k_fullImport ? true : false;
}
if (kerio.waw.requests._k_keepAlivePending) {
kerio.lib.k_ajax.k_abort(kerio.waw.requests._k_keepAlivePending);
}
kerio.waw.requests.k_startRestart(true);
this.k_isRestarting = true;
kerio.waw.requests.k_sendBatch(
{
k_jsonRpc: {
method: 'Configuration.apply',
params: {id: k_dialog.k_uploadId, interfaces: k_interfaces, fullImport: k_fullImport}
},
k_scope: k_dialog,
k_callback: function(k_response, k_success, k_params) {
window.onerror = function(){};
if (k_success) {
kerio.waw.requests._k_sendServices.k_resume(kerio.waw.requests._K_TASK_ID_RESTARTING);
return; }
else {
this.k_hide();
kerio.waw.requests.k_reportRestartFail();
}
}
},
{
k_mask: false,
k_requestOwner: null
}
);
},

k_onSelect: function(k_sender, k_event) {
var
k_constEventTypes = kerio.lib.k_constants.k_EVENT.k_TYPES,
k_selectedRowsCount;
if (k_sender instanceof kerio.lib.K_Grid) {
if (k_constEventTypes.k_SELECTION_CHANGED === k_event.k_type) {
k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount;
this.k_enableItem('k_btnSetInterface', 0 < k_selectedRowsCount);
}
}
},

k_setInterface: function(k_toolbar) {
var
k_grid = k_toolbar.k_parentWidget,
k_dialog = k_grid.k_dialog;
if (0 === k_grid.k_selectionStatus.k_selectedRowsCount) {
return;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'configurationImportInterfaceEditor',
k_params: {
k_parentGrid: k_grid,
k_localInterfaces: k_dialog.k_localInterfaces,
k_importedInterfaces: k_dialog.k_importedInterfaces,
k_editedInterface: k_grid.k_selectionStatus.k_rows[0]
}
});
}
}; 