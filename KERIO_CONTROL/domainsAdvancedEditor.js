
kerio.waw.ui.domainsAdvancedEditor = {

k_init: function(k_objectName, k_initParams) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_isLinux = kerio.waw.shared.k_methods.k_isLinux(),
k_localNamespace = k_objectName + '_',
k_settingsFormCfg,
k_settingsForm,
k_renderControllers,
k_renderData,
k_renderType,
k_renderStatus,
k_domainsGridCfg,
k_domainsGrid,
k_domainsFormCfg,
k_domainsForm,
k_tabPageCfg,
k_tabPage,
k_forms,
k_dialogCfg,
k_dialog;
k_settingsFormCfg = {
k_useStructuredData: true,
k_isReadOnly: k_isAuditor,
k_items: [
k_initParams.k_advancedFieldsetCfg,
{
k_type: 'k_fieldset',
k_id: 'k_adCooperation',
k_caption: k_tr('Microsoft® Active Directory® cooperation', 'domainsAdvancedEditor'),
k_items: [
{	k_type: 'k_radio',
k_groupId: 'authenticationOnly',
k_isLabelHidden: true,
k_option: k_tr('Map users from Microsoft® Active Directory® and authenticate users in local database', 'domainsAdvancedEditor'),
k_value: false,
k_isChecked: true,

k_onChange: function(k_form, k_element, k_value) {
k_form.k_setDisabled(['k_primaryDomainModeOptions'], !k_value);
}
},
{	k_type: 'k_radio',
k_groupId: 'authenticationOnly',
k_isLabelHidden: true,
k_option: k_tr('Only authenticate users of the local database in Microsoft® Active Directory®', 'domainsAdvancedEditor'),
k_value: true
},
{	k_type: 'k_container',
k_id: 'k_primaryDomainModeOptions',
k_indent: 1,
k_isLabelHidden: true,
k_isDisabled: true,
k_items: [
{	k_type: 'k_checkbox',
k_id: 'ntAuthMode',
k_isHidden: k_isLinux,
k_option: k_tr('Enable pre-Windows 2000 authentication compatibility', 'domainsAdvancedEditor')
},
{	k_type: 'k_checkbox',
k_id: 'adAutoImport',
k_option: k_tr('Enable automatic import', 'domainsAdvancedEditor')
}
]
}
]
}
]
}; k_settingsForm = new k_lib.K_Form(k_localNamespace + 'k_advancedSettings', k_settingsFormCfg);
k_renderData = function(k_value, k_data, k_row, k_column, k_grid) {
k_data.name = k_value.domainName;
k_data.type = k_value.type;
k_data.controllers = (k_value.type !== k_grid.k_domainsStore.k_TYPES.WindowsActiveDirectory || k_value.useSpecificServers)
? [ k_value.primaryServer, k_value.secondaryServer ]
: false;
return {
k_data: ''
};
};
k_renderType = function(k_value) {
if (this.k_domainsStore.k_TYPES.WindowsActiveDirectory === k_value) {
return { k_data: this.k_trActiveDirectory };
}
if (this.k_domainsStore.k_TYPES.AppleDirectoryKerberos === k_value) {
return { k_data: this.k_trOpenDirectory };
}
if (this.k_domainsStore.k_TYPES.k_KERIO_DIRECTORY === k_value) {
return { k_data: this.k_trKerioDirectory };
}
return { k_data: '' };
};

k_renderControllers = function(k_value, k_data, k_row, k_column, k_grid) {
var k_text = '';
if (false === k_value) {
k_text = k_grid.k_trAutomatic;
}
else {
k_text = k_value[0];
if (k_value[1]) {
k_text += ' (' + k_grid.k_trSecondary + ' ' + k_value[1] + ')';
}
}
return {
k_data: k_text
};
};

k_renderStatus = function(k_value, k_data) {
var
k_iconCls = 'statusDomainJoin',
k_domainStatus = this.k_domainsStore.k_isConnected(k_data.id),
k_iconTooltip;
if (true === k_domainStatus) {
k_iconTooltip = this.k_trControllerStatusSuccess;
}
else if (false === k_domainStatus){
k_iconTooltip = this.k_trControllerStatusError + '<br>' + this.k_trControllerStatusDetails;
k_iconCls += ' domainJoinError';
}
else {
k_iconTooltip = this.k_trControllerStatusUnknown;
k_iconCls += ' domainJoinTesting';
}
return {
k_iconCls: k_iconCls,
k_iconTooltip: k_iconTooltip,
k_isSecure: true,
k_data: ''
};
};
k_domainsGridCfg = {
k_isAuditor: k_isAuditor,
k_loadMask: false,
k_columns: {
k_items: [
{
k_columnId: 'service',
k_isKeptHidden: true,
k_isHidden: true,
k_renderer: k_renderData
},
{
k_columnId: 'name',
k_caption: k_tr('Name', 'common'),
k_width: 150,
k_renderer: kerio.waw.shared.k_methods.k_renderers.k_renderDomainName
},
{
k_columnId: 'description',
k_caption: k_tr('Description', 'common'),
k_width: 200
},
{
k_columnId: 'type',
k_caption: k_tr('Type', 'common'),
k_width: 100,
k_renderer: k_renderType
},
{
k_columnId: 'controllers',
k_caption: k_tr('Controllers', 'domainsAdvancedEditor'),
k_width: 130,
k_renderer: k_renderControllers,
k_isSortable: false,
k_isHidden: true
},
{
k_columnId: 'domainStatus',
k_caption: k_tr('Status', 'domainsAdvancedEditor'),
k_renderer: k_renderStatus,
k_isSortable: false
},
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'advanced',
k_isDataOnly: true
},
{
k_columnId: 'status',
k_isDataOnly: true
}
]
}, k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'domainsAdDomainEditor',
k_objectName: {
k_btnAdd:  'domainAdd',
k_btnEdit: 'domainEdit',
k_btnView: 'domainView'
}
},
k_items: [{
k_type: 'K_GRID_DEFAULT',

k_onRemove: function (k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget,
k_selectionStatus = k_grid.k_selectionStatus,
k_selectedRows = k_selectionStatus.k_rows,
k_i, k_cnt;
k_grid.k_removeSelectedRows();
for (k_i = 0, k_cnt = k_selectionStatus.k_selectedRowsCount; k_i < k_cnt; k_i++) {
kerio.waw.status.k_domainsStore.k_remove(k_selectedRows[k_i].k_data.id);
}
}
}]
}
},
k_localData: [],

k_onLoad: function() {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
};
if (k_isAuditor) {
k_domainsGridCfg.k_toolbars = {};
}
k_domainsGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'domainsGrid', k_domainsGridCfg);
k_domainsFormCfg = {
k_items: [
{	k_type: 'k_display',
k_id: 'k_textPrimaryDomain',
k_isLabelHidden: true,
k_template: k_tr('Your primary domain is %1', 'domainsAdvancedEditor', {k_args: ['<b>{k_primaryDomain}</b>'], k_isSecure: true})
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Here you may define additional directory service domains to map user accounts from:', 'domainsAdvancedEditor')
},
{
k_type: 'k_container',
k_content: k_domainsGrid
}
]
};
k_domainsForm = new k_lib.K_Form(k_localNamespace + 'k_domainsForm', k_domainsFormCfg);
k_tabPageCfg = {
k_items: [
{
k_content: k_settingsForm,
k_caption: k_tr('Settings', 'domainsAdvancedEditor'),
k_id: 'k_tabSettings'
},
{
k_content: k_domainsForm,
k_caption: k_tr('Additional Mapping', 'domainsAdvancedEditor'),
k_id: 'k_tabDomains'
}
]
};
k_tabPage = new k_lib.K_TabPage(k_localNamespace + 'k_tabs', k_tabPageCfg);
k_dialogCfg = {
k_width: 655,
k_height: 430,
k_title: k_tr('Advanced Settings', 'domainsAdvancedEditor'),
k_content: k_tabPage,
k_defaultItem: null,

k_onOkClick: function(k_toolbar) {
this.k_dialog.k_saveData();
}
};
k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_forms = kerio.waw.shared.k_methods.k_extractObjectValues(k_tabPageCfg.k_items, 'k_content', 'k_widget');
k_dialog.k_forms = new kerio.lib.K_FormManager(k_localNamespace + 'k_formManager', k_forms);
k_dialog.k_formIds = kerio.waw.shared.k_methods.k_extractObjectValues(k_tabPageCfg.k_items, 'k_id', 'string');
if (k_isAuditor) {
k_dialog.k_forms.k_setReadOnlyAll();
}
k_dialog.k_addReferences(
{	k_settingsForm: k_settingsForm,
k_domainsForm:  k_domainsForm,
k_domainsGrid:  k_domainsGrid,
k_tabPage: k_tabPage,
k_textPrimaryDomain: k_domainsForm.k_getItem('k_textPrimaryDomain'),
k_isLinux: k_isLinux,
k_parentList: {}
}
);
k_settingsForm.k_addReferences(
{	k_dialog: k_dialog,
k_isAuditor: k_isAuditor,
k_specificServerValueElement: k_settingsForm.k_getItem(['k_specificServerValue']),
k_btnTest: k_settingsForm.k_getItem(['k_btnTest'])
}
);
k_domainsGrid.k_addReferences({
k_dialog: k_dialog,
k_CONTROLLER_STATUS_SUCCESS: 0,
k_CONTROLLER_STATUS_UNKNOWN: 1,
k_CONTROLLER_STATUS_ERROR: 2,
k_trControllerStatusSuccess: k_tr('Domain controller is accessible.', 'domainsAdvancedEditor'),
k_trControllerStatusError:   k_tr('Connection to domain controller has failed.', 'domainsAdvancedEditor'),
k_trControllerStatusDetails: k_tr('To see details, edit this domain and click the Test button.', 'domainsAdvancedEditor'),
k_trControllerStatusUnknown: k_tr('Trying to connect to the domain controller…', 'domainsAdvancedEditor'),
k_trAdvancedLdap: k_tr('Secured connection', 'domainsAdvancedEditor'),
k_trKerberosRealm: k_tr('Kerberos Realm:', 'domainsAdvancedEditor'),
k_trLdapSuffix: k_tr('LDAP Suffix:', 'domainsAdvancedEditor'),
k_trActiveDirectory: k_tr('Microsoft® Active Directory®', 'domainServices'),
k_trOpenDirectory: k_tr('Apple® Open Directory', 'domainServices'),
k_trKerioDirectory: k_tr('Kerio Directory', 'domainServices'),
k_trAutomatic: k_tr('Automatic', 'domainsAdvancedEditor'),
k_trSecondary: k_tr('Secondary:', 'domainsAdvancedEditor'),
k_domainsStore: kerio.waw.status.k_domainsStore
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_data = k_params.k_data,
k_parent = k_params.k_parentForm,
k_settingsForm = this.k_settingsForm,
k_domainsGrid = this.k_domainsGrid;
k_params.k_switchDomainType(k_settingsForm); k_settingsForm.k_setData(k_data, true);
kerio.waw.status.k_domainsStore.k_set('k_primary', k_data, true); k_settingsForm.k_setVisible('k_adCooperation', k_parent.k_isType(k_parent.k_ACTIVE_DIRECTORY));
this.k_parentList = k_parent;
this.k_callback = k_params.k_callback;
this.k_textPrimaryDomain.k_setVisible('' !== k_data.service.domainName);
this.k_textPrimaryDomain.k_setValue(
{k_primaryDomain: kerio.lib.k_htmlEncode(k_data.service.domainName)}
);
kerio.waw.status.k_domainsStore.on('update', k_domainsGrid.k_updateRows, k_domainsGrid);
kerio.waw.status.k_domainsStore.on('test', k_domainsGrid.k_refresh, k_domainsGrid);
k_domainsGrid.k_updateRows(true);
kerio.waw.status.k_domainsStore.k_push(); this.k_saved = false;
if (!this.k_settingsForm.k_isAuditor) { k_domainsGrid.k_toolbars.k_bottom.k_setDialogAdditionalParams({
k_parentList: this.k_parentList,
k_isKusoAvailable: true === k_params.k_isKusoAvailable
});
}
k_domainsGrid.k_startTracing();
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_dialogs: ['domainsAdDomainEditor']
});
};

k_kerioWidget.k_saveData = function() {
var
k_formData;
k_formData = this.k_settingsForm.k_getData(true);
kerio.waw.status.k_domainsStore.k_set('k_primary', k_formData);
this.k_saved = true; kerio.adm.k_framework.k_enableApplyReset();
this.k_hide();
};

k_kerioWidget.k_resetOnClose = function() {
kerio.waw.status.k_domainsStore.un('update', this.k_domainsGrid.k_updateRows, this.k_domainsGrid);
kerio.waw.status.k_domainsStore.un('test', this.k_domainsGrid.k_refresh, this.k_domainsGrid);
if (!this.k_saved) {
kerio.waw.status.k_domainsStore.k_pop();
}
this.k_domainsGrid.k_stopTracing();
this.k_settingsForm.k_reset();
this.k_tabPage.k_setActiveTab('k_tabSettings');
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
};

k_kerioWidget.k_testConnectionCallback = function(k_response, k_success, k_params) {
this.k_parentList.k_testConnectionCallback.call(this.k_parentList, k_response, k_success, k_params);
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
};

k_kerioWidget.k_domainsGrid.k_updateRows = function(k_id) {
if (!k_id) { return;
}
this.k_setData(kerio.waw.status.k_domainsStore.k_getAll());
};
} }; 