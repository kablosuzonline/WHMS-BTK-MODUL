
kerio.waw.ui.dhcpExclusionRowEditor = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_isEditMode = 'dhcpExclusionRowEditorAdd' !== k_objectName,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_form, k_formCfg,
k_dialog, k_dialogCfg;
k_formCfg = {
k_items: [
{
k_id: 'k_ipStart',
k_caption: k_tr('From:', 'dhcpExclusionRowEditor'),
k_validator: {
k_functionName: 'k_isIpAddress',
k_allowBlank: false,
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_maxLength:15,

k_onChange: function(k_form, k_element, k_value) {
kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars.apply(this, arguments);
k_form.k_checkRange();
},

k_onBlur: function(k_form, k_element) {
var
k_value = k_element.k_getValue(),
k_toField = k_form.k_ipEnd;
if ('' === k_toField.k_getValue()) {
k_toField.k_setValue(k_value);
}
}
},
{
k_id: 'k_ipEnd',
k_caption: k_tr('To:', 'dhcpExclusionRowEditor'),
k_validator: {
k_functionName: 'k_isIpAddress',
k_allowBlank: false,
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_maxLength:15,

k_onChange: function(k_form, k_element, k_value) {
kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars.apply(this, arguments);
k_form.k_checkRange();
}
},
{
k_id: 'k_description',
k_caption: k_tr('Description:', 'common'),
k_maxLength: 255,
k_checkByteLength: true
}
] }; k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 300,
k_height: 170,
k_title: (k_isEditMode)
? k_tr('Edit Exclusion', 'dhcpExclusionRowEditor')
: k_tr('Add Exclusion', 'dhcpExclusionRowEditor'),
k_content: k_form,
k_defaultItem: 'k_ipStart',

k_onOkClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData.call(k_toolbar.k_dialog);
} }; k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_isEditMode: k_isEditMode
}); k_form.k_addReferences({
k_isIpAddress: kerio.waw.shared.k_methods.k_validators.k_isIpAddress,  k_isIpRange: kerio.waw.shared.k_methods.k_validators.k_isIpRange, k_ipStart: k_form.k_getItem('k_ipStart'),
k_ipEnd:   k_form.k_getItem('k_ipEnd'),
k_mapping: kerio.waw.shared.k_methods.k_flip({
k_ipStart:     'ipStart',
k_ipEnd:       'ipEnd',
k_description: 'description'
}, true) });
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
var
k_form = this.k_form;
this.k_parent = k_params.k_relatedWidget.k_dialog;
this.k_dataStore = k_params.k_data || {};
k_form.k_setData(kerio.waw.shared.k_methods.k_mapProperties(k_params.k_data, k_form.k_mapping), true);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); }; 
k_kerioWidget.k_sendData = function(){
var
k_form = this.k_form,
k_isIpAddress = k_form.k_isIpAddress, k_isIpRange = k_form.k_isIpRange,     k_data = kerio.waw.shared.k_methods.k_mapProperties(k_form.k_getData(), k_form.k_mapping),
k_parent = this.k_parent,
k_scope = k_parent.k_dataStore,
k_grid = k_parent.k_grid,
k_exclusions = k_grid.k_getData(),
k_origIpStart = this.k_dataStore.ipStart,
k_origIpEnd = this.k_dataStore.ipEnd,
k_lib = kerio.lib,
k_i, k_cnt, k_row; if (!k_isIpAddress(k_data.ipStart) || !k_isIpAddress(k_data.ipEnd) || !k_isIpRange(k_data.ipStart, k_data.ipEnd, true)) {
k_lib.k_alert(
k_lib.k_tr('Invalid Range', 'common'),
k_lib.k_tr('Specified IP addresses are not valid for the range.', 'dhcpExclusionRowEditor')
);
this.k_hideMask();
return;
}
if (!k_isIpRange(k_scope.ipStart, k_data.ipStart, true) || !k_isIpRange(k_data.ipEnd, k_scope.ipEnd, true)) {
k_lib.k_alert(
k_lib.k_tr('Invalid Range', 'common'),
k_lib.k_tr('Specified exclusion is out of the current scope.', 'dhcpExclusionRowEditor')
);
this.k_hideMask();
return;
}
for (k_i = 0, k_cnt = k_exclusions.length; k_i < k_cnt; k_i++) {
k_row = k_exclusions[k_i];
if (this.k_isEditMode && k_origIpStart === k_row.ipStart && k_origIpEnd === k_row.ipEnd) {
continue; }
if (k_isIpRange(k_data.ipEnd, k_row.ipStart) || k_isIpRange(k_row.ipEnd, k_data.ipStart)) {
continue; }
k_lib.k_alert(
k_lib.k_tr('Invalid Range', 'common'),
k_lib.k_tr('Specified IP addresses collide with existing exclusion %1 - %2.', 'dhcpExclusionRowEditor', {k_args: [
k_row.ipStart,
k_row.ipEnd
]}) );
this.k_hideMask();
return;
}
if (this.k_isEditMode) {
kerio.waw.shared.k_methods.k_mergeObjects(k_data, this.k_dataStore);
k_grid.k_refresh(); }
else {
k_grid.k_appendRow(k_data);
}
k_grid.k_resortRows(); this.k_hide();
}; 
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
}; 
k_kerioWidget.k_form.k_checkRange = function() {
var k_isValidRange;
if (!this.k_ipStart.k_isValid(false) || !this.k_ipEnd.k_isValid(false)) {
return; }
k_isValidRange = this.k_isIpRange(this.k_ipStart.k_getValue(), this.k_ipEnd.k_getValue(), true);
this.k_ipStart.k_markInvalid(!k_isValidRange);
this.k_ipEnd.k_markInvalid(!k_isValidRange);
};
} }; 