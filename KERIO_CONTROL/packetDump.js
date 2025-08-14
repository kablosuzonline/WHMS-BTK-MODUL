
kerio.waw.ui.packetDump = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_methods = k_shared.k_methods,
k_isAuditor = k_methods.k_isAuditor(),
k_apiObject = 'PacketDump',
k_dataRoot = 'expression',
k_formCfg, k_form,
k_dialogCfg, k_dialog,
k_onStartClick,
k_stopPacketDump,
k_downloadPacketDump;
k_formCfg = {
k_isReadOnly: k_isAuditor,
k_items: [
{
k_id: 'k_expression',
k_caption: k_tr('Expression:', 'logsExpressionEditor'),
k_maxLength: 255,
k_checkByteLength: true
},
{
k_type: 'k_display',
k_id: 'k_fileSize',
k_caption: k_tr('File size:', 'packetDump'),
k_template: '{k_size}',
k_value: {
k_size: '0 kB'
}
},
{
k_type: 'k_display',
k_id: 'k_runningIndicator',
k_isHidden: true,
k_isLabelHidden: true,
k_className: 'runningIndicator active',
k_value: k_tr('Dump in progress…', 'packetDump')
},
k_methods.k_getDisplayFieldWithKbLink(1374, undefined,
{
k_itemClassName: 'bottomFormItem',
k_style: 'text-align: right;'
}
)
]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_onStartClick = function() {
var
k_dialog = this.k_dialog,
k_inputExpression = k_dialog.k_inputExpression;
if ('' === k_inputExpression.k_getValue()) {
k_inputExpression.k_setValue('any');
}
if (!k_inputExpression.k_isValid()) {
return;
}
if (k_dialog.k_dumpExists) {
kerio.lib.k_confirm(k_dialog.k_cfgConfirmRemoveOnStart);
}
else {
k_dialog.k_startPacketDump();
}
};
k_stopPacketDump = function() {
var
k_dialog = this.k_dialog;
this.k_disableItem(['k_btnStop']);
kerio.waw.requests.k_sendBatch(k_dialog.k_cfgRequestStop);
};
k_downloadPacketDump = function() {
var
k_dialog = this.k_dialog;
kerio.waw.requests.k_sendBatch(k_dialog.k_cfgRequestDownload);
};
k_dialogCfg = {
k_title: k_tr('Packet Dump To File', 'packetDump'),
k_isAuditor: k_isAuditor,
k_content: k_form,
k_height: 210,
k_width: 450,
k_defaultItem: k_form.k_id + '_' + 'k_expression',
k_hasHelpIcon: false,
k_buttons: [
{
k_id: 'k_btnStart',
k_caption: k_tr('Start', 'packetDump'),
k_isHidden: k_isAuditor,
k_isDefault: !k_isAuditor,
k_onClick: k_onStartClick
},
{
k_id: 'k_btnStop',
k_caption: k_tr('Stop', 'packetDump'),
k_isHidden: k_isAuditor,
k_onClick: k_stopPacketDump,
k_isDisabled: true
},
{
k_id: 'k_btnDownload',
k_caption: k_tr('Download', 'packetDump'),
k_isHidden: k_isAuditor || kerio.lib.k_isIPad,
k_onClick: k_downloadPacketDump,
k_isDisabled: true
},
'->',
{
k_id: 'k_btnClose',
k_caption: k_tr('Close', 'common'),
k_isDefault: k_isAuditor,
k_isCancel: true
}
]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_isAuditor: k_isAuditor,
k_inputExpression: k_form.k_getItem('k_expression'),
k_fieldFileSize: k_form.k_getItem('k_fileSize'),
k_runningIndicator: k_form.k_getItem('k_runningIndicator'),
k_dataRoot: k_dataRoot,
k_dumpExists: false,
k_dumpInProgress: false
});
k_form.k_addReferences({
k_dialog: k_dialog
});
k_form.k_isChanged = function() { return false; };
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_getStatusTaskId: k_localNamespace + 'k_GET_STATUS_TASK',
k_cfgRequestStatus: {
k_jsonRpc: {
method: k_apiObject + '.getStatus'
},
k_callback: k_dialog.k_callbackGetStatus,
k_scope: k_dialog,
k_onError: k_methods.k_unmaskMainScreen.createCallback()
},
k_cfgRequestGet: {
k_jsonRpc: {
'method': k_apiObject + '.getExpression'
},
k_callback: k_dialog.k_callbackGetExpression,
k_scope: k_dialog
},
k_cfgRequestSet: {
k_jsonRpc: {
'method': k_apiObject + '.setExpression',
params: {}
}
},
k_cfgRequestRemove: {
k_jsonRpc: {
'method': k_apiObject + '.clear'
},
k_onError: function(k_response) {
if (k_response.k_decoded && k_response.k_decoded.error) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Warning', 'common'),
k_msg: kerio.waw.shared.k_methods.k_translateErrorMessage(k_response.k_decoded.error),
k_icon: 'warning'
});
return true;
}
}
},
k_cfgRequestStart: {
k_jsonRpc: {
'method': k_apiObject + '.start'
}
},
k_cfgRequestStop: {
k_jsonRpc: {
'method': k_apiObject + '.stop'
}
},
k_cfgRequestDownload: {
k_jsonRpc: {
'method': k_apiObject + '.download'
},
k_isDataExport: true
},
k_cfgConfirmRemoveOnStart: {
k_title: k_tr('Confirm', 'common'),
k_msg: [
k_tr('You have already created one dump file. If you continue, this file will be removed.', 'packetDump'),
'<br>',
'<br>',
k_tr('Do you want to continue?', 'common')
].join(''),
k_callback: function(k_response) {
if ('no' === k_response) {
return;
}
this.k_removePacketDump();
this.k_startPacketDump();
},
k_scope: k_dialog,
k_icon: 'warning'
},
k_cfgConfirmRemoveOnClose: {
k_title: k_tr('Confirm', 'common'),
k_msg: k_tr('Do you want to remove the file with the last packet dump?', 'packetDump'),
k_callback: function(k_response) {
if ('no' !== k_response) {
this.k_removePacketDump();
}
},
k_scope: k_dialog,
k_icon: 'warning'
},
k_templateFormatSize: {
k_units: k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_KiloBytes,
k_numberFormat: {
k_decimalPlaces: 0
}
}
});
return k_dialog;
}, k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_applyParams: function(k_params) {
var
k_tasks = kerio.waw.shared.k_tasks;
this.k_dumpInProgress = true; this.k_toolbar.k_disableItem(['k_btnStart', 'k_btnStop', 'k_btnDownload']);
if (k_params && true === k_params.k_dumpInProgress) {
this.k_runningIndicator.k_setVisible();
}
else {
this.k_showMask(kerio.lib.k_tr('Loading…', 'common'));
}
kerio.lib.k_ajax.k_request(this.k_cfgRequestGet);
if (!k_tasks.k_isDefined(this.k_getStatusTaskId)) {
k_tasks.k_add({
k_id: this.k_getStatusTaskId,
k_interval: 1000,
k_scope: this,
k_startNow: true,
k_startSuspended: true,
k_run: function(){
kerio.waw.requests.k_sendBatch(this.k_cfgRequestStatus, {k_mask: false});
}
});
}
this.k_resumeGetStatusTask(true);
},
k_callbackGetExpression: function(k_response, k_success) {
if (k_success && k_response.k_decoded[this.k_dataRoot]) {
this.k_inputExpression.k_setValue(k_response.k_decoded[this.k_dataRoot]);
}
this.k_hideMask();
},

k_resumeGetStatusTask: function(k_resume) {
var
k_isResume = false !== k_resume,
k_tasks = kerio.waw.shared.k_tasks;
if (k_tasks.k_isDefined(this.k_getStatusTaskId)) {
if (k_isResume) {
k_tasks.k_resume(this.k_getStatusTaskId);
}
else {
k_tasks.k_suspend(this.k_getStatusTaskId);
}
}
},

k_callbackGetStatus: function(k_response, k_success) {
var
k_status;
if (!k_success) {
return;
}
k_status = k_response.status || {};
this.k_dumpInProgress = k_status.running;
this.k_dumpExists = k_status.exists;
this.k_setFileSize(this.k_dumpExists ? k_status.sizeKb : 0);
if (this.k_dumpInProgress) {
this.k_runningIndicator.k_setVisible();
this.k_toolbar.k_enableItem(['k_btnStop']);
this.k_inputExpression.k_setDisabled();
}
else {
this.k_runningIndicator.k_setVisible(false);
this.k_toolbar.k_enableItem(['k_btnStart']);
this.k_toolbar.k_disableItem(['k_btnStop']); this.k_inputExpression.k_setDisabled(false);
if (this.k_dumpExists) {
this.k_toolbar.k_enableItem(['k_btnDownload']);
}
this.k_resumeGetStatusTask(false);
}
},
k_startPacketDump: function() {
this.k_runningIndicator.k_setVisible();
this.k_toolbar.k_disableItem(['k_btnStart', 'k_btnStop', 'k_btnDownload']);
this.k_inputExpression.k_setDisabled();
this.k_dumpInProgress = true;
this.k_storeExpression();
kerio.waw.requests.k_sendBatch(this.k_cfgRequestStart);
this.k_resumeGetStatusTask(true);
},
k_removePacketDump: function() {
kerio.lib.k_ajax.k_request(this.k_cfgRequestRemove);
},
k_storeExpression: function() {
var
k_value = this.k_inputExpression.k_getValue(),
k_jsonRpc = this.k_cfgRequestSet.k_jsonRpc;
k_jsonRpc.params[this.k_dataRoot] = k_value;
kerio.waw.requests.k_sendBatch(this.k_cfgRequestSet);
},
k_setFileSize: function(k_size) {
var
k_formattedSize;
this.k_templateFormatSize.k_value = k_size;
k_formattedSize = kerio.waw.shared.k_methods.k_formatDataUnits(this.k_templateFormatSize);
this.k_fieldFileSize.k_setValue({k_size: k_formattedSize.k_string});
},

k_resetOnClose: function() {
this.k_resumeGetStatusTask(false);
if (!this.k_isAuditor && !this.k_dumpInProgress) {
this.k_storeExpression();
if (this.k_dumpExists) {
kerio.lib.k_confirm(this.k_cfgConfirmRemoveOnClose);
}
}
}
});
}
}; 