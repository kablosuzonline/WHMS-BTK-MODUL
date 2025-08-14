
kerio.waw.ui.dhcpScopeEditor = {

k_init: function(k_objectName) {
var
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isItemAdd = ('dhcpScopeEditorAdd' === k_objectName),
k_optionsGrid,
k_formCfg,
k_form,
k_dialogTitle,
k_dialogCfg,
k_dialog;
k_optionsGrid = new kerio.waw.shared.k_widgets.K_DhcpOptionsGrid(k_localNamespace + 'optionsGrid', { k_isLease: false});
k_formCfg =  {
k_isReadOnly: k_isAuditor,
k_items: [
{
k_id: 'k_name',
k_caption: k_tr('Name:', 'common'),
k_maxLength: 127,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_fieldset',
k_className: 'marginTop',
k_height: 80 ,
k_caption: k_tr('Scope definition', 'dhcpScopeEditor'),
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_id: 'k_ipStart',
k_caption: k_tr('First Address:', 'dhcpScopeEditor'),
k_width: 120,
k_maxLength: 15,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},

k_onChange: function(k_form, k_element, k_value) {
kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars.apply(this, arguments);
if (k_form.k_elementIpTo.k_isValid(false)) {
k_form.k_elementIpTo.k_markInvalid(false);
}
},

k_onBlur: function(k_form, k_element) {
var
k_value = k_element.k_getValue(),
k_methods = kerio.waw.shared.k_methods;
if (!k_value) {
return;
}
k_methods.k_generateMaskForIp(k_value, { k_maskField: k_form.k_elementIpMask });
k_methods.k_generateIpRange(k_value, { k_field: k_form.k_elementIpTo });
if (k_form.k_elementIpTo.k_isValid(false)) {
k_form.k_elementIpTo.k_markInvalid(false);
}
if (k_form.k_elementIpMask.k_isValid(false)) {
k_form.k_elementIpMask.k_markInvalid(false);
}
}
},
'->',
{
k_id: 'k_ipEnd',
k_caption: k_tr('Last Address:', 'dhcpScopeEditor'),
k_width: 120,
k_maxLength: 15,
k_isLabelHidden: false,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},

k_onChange: function(k_form) {
kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars.apply(this, arguments);
if (k_form.k_elementIpFrom.k_isValid(false)) {
k_form.k_elementIpFrom.k_markInvalid(false);
}
}
}
] }, {
k_type: 'k_row',
k_items: [
kerio.waw.shared.k_DEFINITIONS.k_get('k_ipv4MaskField', {
k_id: 'k_ipMask',
k_width: 120
}),
'->',
{
k_type: 'k_formButton',
k_id: 'k_btnExclusions',
k_mask: false,
k_caption: k_tr('Exclusions…', 'dhcpScopeEditor'),

k_onClick: function(k_form) {
var
k_dialog = k_form.k_parentWidget,
k_data = k_dialog.k_dataStore,
k_lib = kerio.lib,
k_methods = kerio.waw.shared.k_methods,
k_isValid = true;
k_isValid = k_form.k_elementIpFrom.k_isValid() && k_isValid;
k_isValid = k_form.k_elementIpTo.k_isValid()   && k_isValid;
k_isValid = k_form.k_elementIpMask.k_isValid() && k_isValid;
if (!k_isValid) {
k_lib.k_alert(
k_lib.k_tr('Invalid Range', 'common'),
k_lib.k_tr('Please define valid scope before defining exceptions.', 'dhcpScopeEditor')
);
return;
}
k_methods.k_mergeObjects(k_methods.k_mapProperties(k_form.k_getData(), k_form.k_mapping), k_data);
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'dhcpExclusionsEditor',
k_params: {
k_data: k_data,
k_parent: k_dialog
}
});
} } ] }
] },
{
k_type: 'k_fieldset',
k_caption: k_tr('DHCP options', 'dhcpScopeEditor'),
k_minHeight: 160,
k_content: k_optionsGrid
}
]};k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_form.k_getItem('k_btnExclusions')._k_setReadOnlyByContainer(false);
if (!k_isItemAdd) {
if (k_isAuditor) {
k_dialogTitle = k_tr('View Scope', 'dhcpScopeEditor');
}
else {
k_dialogTitle = k_tr('Edit Scope', 'dhcpScopeEditor');
}
} else {
k_dialogTitle = k_tr('Add Scope', 'dhcpScopeEditor');
}
k_dialogCfg = {
k_title: k_dialogTitle,
k_isReadOnly: k_isAuditor,
k_content: k_form,
k_width: 525,
k_height: 500,
k_defaultItem: 'k_name',

k_onOkClick: function() {
this.k_dialog.k_saveData();
}
};
k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_form.k_addReferences({
k_elementIpFrom: k_form.k_getItem('k_ipStart'),
k_elementIpTo:   k_form.k_getItem('k_ipEnd'),
k_elementIpMask: k_form.k_getItem('k_ipMask'),
k_mapping: kerio.waw.shared.k_methods.k_flip({
k_name:    'name',
k_ipStart: 'ipStart',
k_ipEnd:   'ipEnd',
k_ipMask:  'ipMask'
}, true)
});
k_dialog.k_addReferences({
k_form: k_form,
k_optionsGrid: k_optionsGrid,
k_isItemAdd: k_isItemAdd,
k_relatedGrid: {},
k_dataStore: {},
k_isIpRange: kerio.waw.shared.k_methods.k_validators.k_isIpRange });
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_data = k_params.k_data,
k_maskMessage = kerio.lib.k_tr('Loading…', 'common');
this.k_relatedGrid = k_params.k_relatedGrid;
if (undefined !== k_data && !this.k_isItemAdd) {
this.k_showMask(k_maskMessage);
this.k_setDialogData(k_data);
} else if (k_params.k_interfaceId) {
this.k_showMask(k_maskMessage);
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Dhcp.getInterfaceTemplate',
params: {ifaceId: k_params.k_interfaceId}
},
k_callback: this.k_setIfaceTemplateData,
k_scope: this
});
} else {
this.k_dataStore = {};
}
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_dialogs: ['dhcpOptionEditor', 'dhcpExclusionsEditor']
});
};

k_kerioWidget.k_setIfaceTemplateData = function(k_response, k_success) {
if (!k_success || !k_response.k_decoded.details) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
this.k_setChanged(true); this.k_setDialogData(k_response.k_decoded.details);
};

k_kerioWidget.k_setDialogData = function(k_data) {
var
k_formData = kerio.waw.shared.k_methods.k_mapProperties(k_data, this.k_form.k_mapping);
this.k_optionsGrid.k_setData({ k_options: k_data.options });
this.k_optionsGrid.k_startTracing();
this.k_form.k_setData(k_formData, true);
this.k_dataStore = kerio.lib.k_cloneObject(k_data);
this.k_hideMask();
};

k_kerioWidget.k_isScopeRangeValid = function(k_ipStart, k_ipEnd, k_ipMask) {
var
k_ipToBinary = kerio.waw.shared.k_methods.k_ipToBinary,
k_ipStartBin = k_ipToBinary(k_ipStart),
k_ipEndBin = k_ipToBinary(k_ipEnd),
k_ipMaskBin = k_ipToBinary(k_ipMask),
k_ipStartAndMaskBin = k_ipStartBin & k_ipMaskBin,
k_isRange,
k_notEdges;
k_isRange = (k_ipStartBin & ~k_ipMaskBin) <= (k_ipEndBin & ~k_ipMaskBin)
&& k_ipStartAndMaskBin === (k_ipEndBin & k_ipMaskBin);
k_notEdges = (k_ipStartAndMaskBin !== k_ipStartBin)
&& ((k_ipEndBin | ~k_ipMaskBin) !== k_ipEndBin);
return k_isRange && k_notEdges;
};

k_kerioWidget.k_saveData = function() {
var
k_form = this.k_form,
k_formData = k_form.k_getData(),  k_ipStart = k_formData.k_ipStart,
k_ipEnd = k_formData.k_ipEnd,
k_data = this.k_dataStore,  k_lib = kerio.lib,
k_methods = kerio.waw.shared.k_methods,
k_i, k_cnt, k_exclusion,
k_requestData;
k_formData.k_ipMask = kerio.waw.shared.k_methods.k_convertCidrToMask(k_formData.k_ipMask);
if (!this.k_isScopeRangeValid(k_ipStart, k_ipEnd, k_formData.k_ipMask)) {
k_form.k_elementIpFrom.k_markInvalid();
k_form.k_elementIpTo.k_markInvalid();
k_lib.k_alert(
k_lib.k_tr('Invalid Range', 'common'),
k_lib.k_tr('IP addresses are not valid for the range.', 'dhcpScopeEditor')
);
this.k_hideMask();k_methods.k_unmaskMainScreen();
return;
}
k_data.exclusions = k_data.exclusions || []; for (k_i = 0, k_cnt = k_data.exclusions.length; k_i < k_cnt; k_i++) {
k_exclusion = k_data.exclusions[k_i];
if (!this.k_isIpRange(k_ipStart, k_exclusion.ipStart, true) || !this.k_isIpRange(k_exclusion.ipEnd, k_ipEnd, true)) {
k_lib.k_alert(
k_lib.k_tr('Validation Warning', 'common'),
k_lib.k_tr('One or more exclusions are out of the current scope. Please click on button "%1" and check all defined exclusions.', 'dhcpScopeEditor',
{ k_args: [k_lib.k_tr('Exclusions…', 'dhcpScopeEditor')] }
)
);
this.k_hideMask();k_methods.k_unmaskMainScreen();
return;
} } k_formData = k_methods.k_mapProperties(k_formData, this.k_form.k_mapping);
k_methods.k_mergeObjects(k_formData, k_data);
k_data.options = this.k_optionsGrid.k_getData();
if (this.k_isItemAdd) {
k_data.enabled = true;
k_requestData = {scopes: [k_data]};
} else {
k_requestData = {scopeIds: [k_data.id], details: k_data};
}
this.k_relatedGrid.k_parentForm.k_scopesGrid.k_lastSelectedScope = k_data;
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Dhcp' + '.' + (this.k_isItemAdd ? 'create' : 'set'),
params: k_requestData
},
k_callback: this.k_saveDataCallback,
k_scope: this
});
};

k_kerioWidget.k_saveDataCallback = function(k_response, k_success) {
if (k_success && kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
if (k_response.k_decoded && k_response.k_decoded.result && k_response.k_decoded.result[0]) {
this.k_relatedGrid.k_parentForm.k_scopesGrid.k_lastSelectedScope.id = k_response.k_decoded.result[0].id;
}
this.k_relatedGrid.k_parentForm.k_loadData();
kerio.adm.k_framework.k_enableApplyReset();
this.k_hide();
} else {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);}
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
this.k_optionsGrid.k_stopTracing();
this.k_optionsGrid.k_resetGrid();
};
} }; 