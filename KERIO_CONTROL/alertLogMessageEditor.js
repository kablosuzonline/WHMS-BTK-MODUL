
kerio.waw.ui.alertLogMessageEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_form, k_formCfg,
k_dialog, k_dialogCfg;
k_formCfg = {
k_labelWidth: 80,
k_items: [
{
k_id: 'name',
k_caption: k_tr('Name:', 'common'),
k_maxLength: 100,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_select',
k_id: 'log',
k_caption: k_tr('Log:', 'alertEditor'),
k_fieldValue: 'k_id',
k_fieldDisplay: 'k_name',
k_localData: [
{ k_id: 'config', k_name: 'Config' },
{ k_id: 'connection', k_name: 'Connection' },
{ k_id: 'debug', k_name: 'Debug' },
{ k_id: 'dial', k_name: 'Dial' },
{ k_id: 'error', k_name: 'Error' },
{ k_id: 'filter', k_name: 'Filter' },
{ k_id: 'host', k_name: 'Host' },
{ k_id: 'http', k_name: 'Http' },
{ k_id: 'security', k_name: 'Security' },
{ k_id: 'warning', k_name: 'Warning' },
{ k_id: 'web', k_name: 'Web' }
]
},
{
k_id: 'condition',
k_caption: k_tr('Condition:', 'alertEditor'),
k_maxLength: 255,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_checkbox',
k_id: 'isRegex',
k_caption: ' ',
k_option: k_tr('Use regular expression', 'httpRuleEditor')
},
{
k_type: 'k_row',
k_style: 'margin-top: 8px;',
k_items: [
{
k_type: 'k_number',
k_id: 'interval',
k_caption: k_tr('Send maximum one alert per', 'alertEditor'),
k_isAutoLabelWidth: true,
k_width: 30,
k_value: 60,
k_minValue: 1,
k_maxValue: 999,
k_maxLength: 3,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('minutes', 'common')
}
]
},
kerio.waw.shared.k_methods.k_getDisplayFieldWithKbLink(1715, k_tr('Learn about Log message alerts', 'alertEditor'),
{
k_style: 'text-align: right;'
}
)
]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_defaultItem: 'name',
k_height: 240,
k_width: 400,
k_title: k_tr('Log Message Alert', 'alertEditor'),
k_content: k_form,
k_isAuditor: false,
k_onOkClick: function(k_toolbar) {
k_toolbar.k_parentWidget.k_sendData();
},
k_mask: false
};
k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialogCfg.k_hasHelpIcon = false;
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_index: undefined,
k_relatedGrid: null
});
k_form.k_addReferences({
k_dialog: k_dialog
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
var
k_data = k_params.k_data;
this.k_relatedGrid = k_params.k_relatedGrid;
if (k_data) {
this.k_form.k_setData(k_data.k_data);
this.k_index = k_data.k_index;
}
};

k_kerioWidget.k_sendData = function() {
var
k_allData = this.k_relatedGrid.k_dialog.k_data,
k_data = this.k_form.k_getData(),
k_index = this.k_index,
k_searchValue;
if (undefined === k_index) {
k_allData.logEventList.push(k_data);
}
else {
k_allData.logEventList[k_index] = k_data;
}
k_searchValue = k_data;
k_allData = this.k_relatedGrid.k_dialog.k_parent.k_fillAlertListRenderer(k_allData);
this.k_relatedGrid.k_setData(k_allData.alertListRenderer || []);
k_index = this.k_relatedGrid.k_findRowIndexBy(this.k_relatedGrid.k_findNewItem, k_searchValue);
if (null !== k_index) {
this.k_relatedGrid.k_selectRows(k_index[0]);
}
this.k_hide();
};

k_kerioWidget.k_resetOnClose = function() {
this.k_index = undefined;
this.k_form.k_reset();
};
}
};
