
kerio.waw.ui.intrusionPreventionEditor = {

k_init: function(k_objectName){
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_removeSignatures,
k_signaturesGridCfg,
k_signaturesGrid,
k_portsGridCfg,
k_portsGrid,
k_formCfg,
k_form,
k_dialogCfg,
k_dialog;
k_WAW_DEFINITIONS.k_INTRUSION_PREVENTION_SIGNATURES_CACHE = k_WAW_DEFINITIONS.k_INTRUSION_PREVENTION_SIGNATURES_CACHE || {};

k_removeSignatures = function() {
this.k_removeSelectedRows();
};
k_signaturesGridCfg = {
k_isReadOnly: k_isAuditor,
k_localData: [],
k_columns: {
k_isColumnMovable: false,
k_isColumnHidable: false,
k_items: [
{
k_columnId: 'id',
k_caption: k_tr('Rule ID', 'intrusionPreventionEditor'),
k_width: 150,
k_editor: {
k_type: 'k_text',
k_maxLength: 21,
k_validator: { k_regExp: new RegExp('^[0-9]{1,10}(?::[0-9]{1,10})?$'), k_allowBlank: false
}
} },
{
k_columnId: 'description',
k_isSortable: false,
k_caption: k_tr('Description', 'common'),

k_renderer: function(k_value, k_rowData) {
var
k_className = '',
k_id = k_rowData.id,
k_description = this.k_descriptionCache[k_id];
if (!k_id) { k_value = '';
}
else if (this.k_NONE === k_description) {
k_value = this.k_trDescriptionLoading;
k_className = 'grayedText';
}
else if (k_description) {
k_value = k_description;
}
else {
k_value = this.k_trDescriptionUnknown;
k_className = 'grayedText';
}
return {
k_className: k_className,
k_data: k_value
};
}
} ] }, 
k_onBeforeCompleteEdit: function(k_grid, k_columnId, k_originalValue, k_value) {
var
k_dialog = k_grid.k_dialog,
k_descriptionExists;
if (-1 === k_value.indexOf(':')) {
k_value = '1:' + k_value;
}
k_descriptionExists = k_dialog.k_getDescription.call(k_dialog, { k_id: k_value });
if (!k_descriptionExists) {
k_grid.k_descriptionCache[k_value] = k_grid.k_NONE; }
k_dialog.k_resortSignatures.defer(1, k_grid); return {
k_value: k_value
};
} }; if (k_isAuditor) {
k_signaturesGridCfg.k_toolbars = {};
}
else {
k_signaturesGridCfg.k_toolbars = {
k_bottom: {
k_hasSharedMenu: true,
k_items: [
{
k_id: 'k_btnAdd',
k_caption: k_tr('Add', 'common'),

k_onClick: function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget;
if (k_grid.k_stopCellEdit()) {
return;
}
k_grid.k_addNewRow.defer(200, k_grid); } },
{
k_type: 'K_BTN_REMOVE',
k_isDisabled: true,

k_onClick: function(k_toolbar) {
k_toolbar.k_relatedWidget.k_removeSignatures.call(k_toolbar.k_relatedWidget);
}}
], 
k_update: function(k_sender, k_event) {
var
k_allowRemove;
if (k_sender.k_isInstanceOf('K_Grid') && kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED === k_event.k_type) {
k_allowRemove = 0 !== k_sender.k_selectionStatus.k_selectedRowsCount;
this.k_enableItem('k_btnRemove', k_allowRemove);
}
} } }; } k_signaturesGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'signaturesGrid', k_signaturesGridCfg);
k_portsGridCfg = {
k_selectionMode: 'k_none',
k_isReadOnly: k_isAuditor,
k_toolbars: {},
k_localData: [],
k_columns: {
k_sorting: false,
k_items: [
{
k_columnId: 'name',
k_caption: k_tr('Service', 'intrusionPreventionEditor'),
k_width: 135
},
{
k_columnId: 'value',
k_caption: k_isAuditor ? k_tr('Ports', 'intrusionPreventionEditor') : k_tr('Ports (Double click a row to change it)', 'intrusionPreventionEditor'),
k_editor: {
k_type: 'k_text',
k_maxLength: 478, k_validator: {
k_functionName: 'k_isPortListWithLimitedRange',
k_allowBlank: false
}
}
} ]
} }; k_portsGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'portsGrid', k_portsGridCfg);
k_formCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_isReadOnly: k_isAuditor,
k_items: [
{
k_id: 'k_fieldsetSignatures',
k_type: 'k_fieldset',
k_caption: k_tr('Ignored signatures', 'intrusionPreventionEditor'),
k_anchor: "0 50%",
k_minHeight: 180,
k_items: [
{
k_type: 'k_display',
k_height: 35,
k_value: k_tr('Here you may specify signatures that will be ignored by the intrusion prevention system:', 'intrusionPreventionEditor')
},
{
k_type: 'k_container',
k_anchor: "0 -35", k_content: k_signaturesGrid
}
] }, {
k_id: 'k_fieldsetProtocolDetection',
k_type: 'k_fieldset',
k_caption: k_tr('Protocol-specific detection', 'intrusionPreventionEditor'),
k_anchor: "0 50%",
k_minHeight: 180,
k_items: [
{
k_type: 'k_display',
k_height: 35,
k_value: k_tr('To improve performance, certain protocol-specific intrusions are detected only on ports specified in the table below:', 'intrusionPreventionEditor')
},
{
k_type: 'k_container',
k_anchor: "0 -35", k_content: k_portsGrid
}
] } ] }; k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_title: k_tr('Advanced Intrusion Prevention Settings', 'intrusionPreventionEditor'),
k_content: k_form,
k_height: 500,
k_width: 520,
k_defaultItem: null,

k_onOkClick: function() {
var
k_dialog = this.k_dialog,
k_portList = k_dialog.k_portsGrid.k_getData(),
k_ignoredSignatures = k_dialog.k_signaturesGrid.k_getData(),
k_removeSpacesFromString = kerio.waw.shared.k_methods.k_removeSpacesFromString,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_portList.length; k_i < k_cnt; k_i++) {
k_portList[k_i].value = k_removeSpacesFromString(k_portList[k_i].value);
}
k_dialog.k_callbackSaveData.call(k_dialog.k_parentWidget, {ports: k_portList, k_ignoredSignatures: k_ignoredSignatures});
k_dialog.k_resetData = false;
k_dialog.k_hide();
} }; k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_signaturesGrid: k_signaturesGrid,
k_portsGrid: k_portsGrid,
k_callbackSaveData: undefined,
k_resetData: true,
k_descriptionCache: k_WAW_DEFINITIONS.k_INTRUSION_PREVENTION_SIGNATURES_CACHE,
k_NONE: k_WAW_CONSTANTS.k_NONE,
k_trLoadMaskText: k_tr('Loading list of ignored signatures…', 'intrusionPreventionEditor')
});
k_signaturesGrid.k_addReferences({
k_dialog: k_dialog,
k_removeSignatures: k_removeSignatures,
k_origIgnoredSignatures: undefined,
k_origPorts: undefined,
k_trDescriptionLoading: k_tr('Loading…', 'intrusionPreventionEditor'),
k_trDescriptionUnknown: k_tr('Unknown', 'common')
});
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_requestGetDescription: {
k_jsonRpc: {
method: 'IntrusionPrevention.getSignatureDescription'
},
k_callback: k_dialog.k_callbackGetDescription,
k_callbackParams: {},
k_scope: k_dialog,
onError: kerio.waw.shared.k_methods.k_ignoreErrors
}
});
k_signaturesGrid.k_addReferences({
k_descriptionCache: k_WAW_DEFINITIONS.k_INTRUSION_PREVENTION_SIGNATURES_CACHE,
k_NONE: k_WAW_CONSTANTS.k_NONE,
k_callbackGetDescription: k_dialog.k_callbackGetDescription
});
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_data = k_params.k_data,
k_ignoredSignatures = k_data.k_ignoredSignatures,
k_loadData = (undefined === k_ignoredSignatures),
k_portList,
k_addSpacesAroundDelimiters,
k_signature,
k_i, k_cnt;
this.k_parentWidget = k_params.k_parentWidget;
this.k_callbackSaveData = k_params.k_callback;
this.k_loadSignatures = k_params.k_loadSignatures;
this.k_resetData = true;
if (k_loadData) {
this.k_showMask(this.k_trLoadMaskText);
k_portList = kerio.lib.k_cloneObject(k_data.ports);
k_addSpacesAroundDelimiters = kerio.waw.shared.k_methods.k_addSpacesAroundDelimiters;
this.k_signaturesGrid.k_resetGrid();
this.k_loadSignatures.call(this.k_parentWidget, {k_callback: this.k_callbackSetSignatures, k_scope: this});
for (k_i = 0, k_cnt = k_portList.length; k_i < k_cnt; k_i++) {
k_portList[k_i].value = k_addSpacesAroundDelimiters(k_portList[k_i].value);
}
this.k_portsGrid.k_setData(k_portList);
this.k_origPorts = k_portList;
}
else {
this.k_origIgnoredSignatures = k_ignoredSignatures;
for (k_i = 0, k_cnt = k_ignoredSignatures.length; k_i < k_cnt; k_i++) {
k_signature = k_ignoredSignatures[k_i];
if ('' === k_signature.description || this.k_NONE === k_signature.description) {
this.k_getDescription({ k_id: k_signature.id });
}
}
this.k_signaturesGrid.k_startTracing();
this.k_portsGrid.k_startTracing();
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); }
}; 
k_kerioWidget.k_callbackSetSignatures = function(k_ignoredSignatures, k_success) {
var
k_signatureIds = [],
k_i, k_cnt,
k_signature;
if (k_success && k_ignoredSignatures) {
for (k_i = 0, k_cnt = k_ignoredSignatures.length; k_i < k_cnt; k_i++) {
k_signature = k_ignoredSignatures[k_i];
k_signatureIds.push({ id: k_signature.id });
this.k_descriptionCache[k_signature.id] = k_signature.description;
}
this.k_signaturesGrid.k_setData(k_signatureIds);
this.k_origIgnoredSignatures = k_signatureIds;
}
this.k_hideMask();
this.k_signaturesGrid.k_startTracing();
this.k_portsGrid.k_startTracing();
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };

k_kerioWidget.k_getDescription = function(k_params) {
var
k_requestGetDescription = this.k_requestGetDescription,
k_description = this.k_descriptionCache[k_params.k_id]; if (k_description && this.k_NONE !== k_description) {
return true;
}
k_requestGetDescription.k_jsonRpc.params = {id: k_params.k_id};
k_requestGetDescription.k_callbackParams = k_params;
kerio.lib.k_ajax.k_request(k_requestGetDescription);
return false;
};

k_kerioWidget.k_callbackGetDescription = function(k_response, k_success, k_params) {
var
k_signaturesGrid = this.k_signaturesGrid,
k_descriptionCache = this.k_descriptionCache,
k_id = k_params.k_id;
k_descriptionCache[k_id] = (k_response.k_isOk) ? k_response.k_decoded.description : undefined;
if (!k_signaturesGrid.k_isEditing()) { k_signaturesGrid.k_refresh();      } }; 
k_kerioWidget.k_resetOnClose = function() {
if (this.k_resetData) {
this.k_signaturesGrid.k_stopTracing();
this.k_portsGrid.k_stopTracing();
this.k_signaturesGrid.k_setData(this.k_origIgnoredSignatures || []);
this.k_portsGrid.k_setData(this.k_origPorts || []);
}
};

k_kerioWidget.k_resortSignatures = function() {
this.k_resortRows();
if (0 === this.k_selectionStatus.k_selectedRowsCount) {
return;
}
var
k_rowRecord = this.k_selectionStatus.k_rows[0].k_extRecord;
this.k_selectRecords([k_rowRecord]);
};

k_kerioWidget.k_signaturesGrid.k_addNewRow = function() {
this.k_appendRow({id: '', description: ''});
this.k_startCellEdit(this.k_getRowsCount() - 1, 'id');
};
} }; 