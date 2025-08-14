
kerio.waw.ui.dateTimeSettingsEditor = {
k_init: function(k_objectName){
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_formCfg,
k_form,
k_dialogCfg,
k_dialog;
k_formCfg = {
k_items: [
{
k_type: 'k_date',
k_id: 'k_date',
k_caption: k_tr('Date:', 'dateTimeSettingsEditor')
},
{
k_id: 'k_time',
k_caption: k_tr('Time:', 'dateTimeSettingsEditor'),
k_width: 100,
k_value: '00:00:00',
k_maxLength: 8, k_validator: {
k_allowBlank: false,
k_functionName: 'k_isTimeWithSeconds'
}
}
]};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_title: k_tr('Date and Time Settings', 'dateTimeSettingsEditor'),
k_content: k_form,
k_height: 150,
k_width: 265,
k_defaultItem: 'k_time',
k_onOkClick: function() {
this.k_dialog.k_saveData();
}
};
k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_form: k_form,
k_parentForm: {},
k_batchIndexSetDateTime: 0,
k_batchIndexGetDateTime: 1,
k_batchRequests: [
{
k_jsonRpc: {
method: 'SystemConfig.setDateTime',
params: {}
}
},
{
k_jsonRpc: {
method: 'SystemConfig.getDateTime'
}
}
],
k_batchOptions: {
k_callback: k_dialog.k_saveDataCallback,
k_scope: k_dialog,
k_sendNow: true
}
});
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
this.k_parentForm = k_params.k_parentForm;
this.k_form.k_setData({
k_date: kerio.waw.shared.k_methods.k_dateToUnixTimestamp(k_params.k_dateTime.date),
k_time: kerio.waw.shared.k_methods.k_formatTime(k_params.k_dateTime.time)
}, true);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); }; 
k_kerioWidget.k_saveData = function(){
var
k_formData = this.k_form.k_getData(),
k_time = [],
k_dateTime = {};
k_time = k_formData.k_time.split(':');
k_dateTime.time = {
hour: parseInt(k_time[0], 10),
min: parseInt(k_time[1], 10),
sec: parseInt(k_time[2], 10)
};
k_dateTime.date = kerio.waw.shared.k_methods.k_unixTimestampToDate(k_formData.k_date);
this.k_batchRequests[this.k_batchIndexSetDateTime].k_jsonRpc.params.config = k_dateTime;
kerio.waw.requests.k_sendBatch(this.k_batchRequests, this.k_batchOptions);
};

k_kerioWidget.k_saveDataCallback = function(k_response, k_success) {
if (!k_success) {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
return;
}
var k_lib = kerio.lib;
this.k_parentForm.k_storeDateTime(k_response[this.k_batchIndexGetDateTime]);
this.k_hide();
k_lib.k_alert({
k_title: k_lib.k_tr('Information', 'dateTimeSettingsEditor'),
k_msg: k_lib.k_tr('Server date and time have been changed.', 'dateTimeSettingsEditor'),
k_icon: 'info'
});
kerio.lib.k_ajax.k_request({ k_jsonRpc: {
method: 'ProductRegistration.getFullStatus'
},
k_callback: function(k_response) {
if (k_response.k_isOk) {
kerio.waw.shared.k_CONSTANTS.k_SERVER.k_LICENSE = k_response.k_decoded.status;
}
}
});
};
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
}; } }; 