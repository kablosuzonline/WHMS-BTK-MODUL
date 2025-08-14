
kerio.waw.ui.bandwidthManagementReservationEditor = {
k_init: function(k_objectName, k_initParams) {
var
k_localNamespace = k_objectName + '_',
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_tr = kerio.lib.k_tr,
k_isDownload = ('bmUploadEditor' !== k_objectName),
k_reservePrefix = (k_isDownload ? 'reservedDownload' : 'reservedUpload') + '.',
k_maximumPrefix = (k_isDownload ? 'maximumDownload' : 'maximumUpload') + '.',
k_formCfg,
k_form,
k_dialogCfg,
k_dialog;
k_formCfg = {
k_useStructuredData: true,
k_items: [
{
k_type: 'k_display',
k_value: k_tr('Apply the following bandwidth policy:', 'bandwidthManagementReservationEditor')
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_checkbox',
k_id: k_reservePrefix + 'enabled',
k_isLabelHidden: true,
k_option: k_tr('Reserve at least:', 'bandwidthManagementReservationEditor'),
k_width: 180,
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled([
k_form.k_reservePrefix + 'value',
k_form.k_reservePrefix + 'unit'
], !k_isChecked);
}
},
{
k_type: 'k_number',
k_id: k_reservePrefix + 'value',
k_isDisabled: true,
k_minValue: 0,
k_maxLength: 9,
k_validator: {
k_functionName: 'k_isNumber',
k_allowBlank: false
}
},
kerio.waw.shared.k_DEFINITIONS.k_get('K_BANDWIDTH_UNITS_SELECT', {
k_id: k_reservePrefix + 'unit',
k_isDisabled: true,
k_hasPercents: true,
k_onChange: function(k_form, k_element, k_value) {
var
k_field = k_form.k_getItem(k_form.k_reservePrefix + 'value'),
k_isPercent = (k_value === kerio.waw.shared.k_CONSTANTS.BandwidthUnit.BandwidthUnitPercent),
k_validator = (k_isPercent ? 'k_isPercentage' : 'k_isNumber');
k_field.k_markInvalid(false);                 k_field.k_setValidationFunction(k_validator); k_field.k_isValid(true);                      }
})
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_checkbox',
k_id: k_maximumPrefix + 'enabled',
k_isLabelHidden: true,
k_option: k_tr('Do not exceed:', 'bandwidthManagementReservationEditor'),
k_width: 180,
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled([
k_form.k_maximumPrefix + 'value',
k_form.k_maximumPrefix + 'unit'
], !k_isChecked);
}
},
{
k_type: 'k_number',
k_id: k_maximumPrefix + 'value',
k_isDisabled: true,
k_minValue: 0,
k_maxLength: 9,
k_validator: {
k_functionName: 'k_isNumber',
k_allowBlank: false
}
},
kerio.waw.shared.k_DEFINITIONS.k_get('K_BANDWIDTH_UNITS_SELECT', {
k_id: k_maximumPrefix + 'unit',
k_isDisabled: true,
k_hasPercents: true,
k_onChange: function(k_form, k_element, k_value) {
var
k_field = k_form.k_getItem(k_form.k_maximumPrefix + 'value'),
k_isPercent = (k_value === kerio.waw.shared.k_CONSTANTS.BandwidthUnit.BandwidthUnitPercent),
k_validator = (k_isPercent ? 'k_isPercentage' : 'k_isNumber');
k_field.k_markInvalid(false);                 k_field.k_setValidationFunction(k_validator); k_field.k_isValid(true);                      }
})
]
}
]
};
k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_height: 162,
k_width: 400,
k_title: (k_isDownload)
? k_tr('Download Bandwidth Policy', 'bandwidthManagementReservationEditor')
: k_tr('Upload Bandwidth Policy', 'bandwidthManagementReservationEditor'),
k_content: k_form,
k_defaultItem: null,
k_onOkClick: function(k_form) {
k_form.k_dialog.k_saveData();
}
};
k_dialogCfg = k_WAW_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_callback: null
});
k_form.k_addReferences({
k_dialog: k_dialog,
k_isDownload: k_isDownload,
k_reservePrefix: k_reservePrefix,
k_maximumPrefix: k_maximumPrefix
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function (k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
this.k_callback = k_params.k_callback;
this.k_form.k_setData(k_params.k_data, true);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); }; 
k_kerioWidget.k_saveData = function() {
var k_data = this.k_form.k_getChangedData();
this.k_callback(k_data);
this.k_hide();
}; } }; 