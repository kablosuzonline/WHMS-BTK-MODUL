
kerio.waw.ui.logsExpressionEditor = {
k_init: function(k_objectName) {
var
k_DEFAULT_TEMPLATE = '%DIRECTION% %IF%, proto:%PROTO%, len:%PKTLEN%, %SRC% -> %DST%, %PAYLOAD%',
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_methods = kerio.waw.shared.k_methods,
k_isAuditor = k_methods.k_isAuditor(),
k_isPacketFormatEditor = false,
k_formCfg,
k_form,
k_title,
k_dialogCfg,
k_dialog,
k_methodGet,
k_methodSet,
k_caption,
k_dataRoot,
k_articleId;
if ('packetFormatEditor' === k_objectName) {
k_caption = k_tr('Format:', 'logsExpressionEditor');
k_methodGet = 'getPacketLogFormat';
k_methodSet = 'setPacketLogFormat';
k_title = k_tr('Format of Logged Packets', 'logsExpressionEditor');
k_dataRoot = 'format';
k_isPacketFormatEditor = true;
}
else {
k_caption = k_tr('Expression:', 'logsExpressionEditor');
k_methodGet = 'getLogExpression';
k_methodSet = 'setLogExpression';
k_title = k_tr('Packet Logging Expression', 'logsExpressionEditor');
k_dataRoot = 'expression';
}
k_formCfg = {
k_isReadOnly: k_isAuditor,
k_labelWidth: k_isPacketFormatEditor ? 80 : undefined,
k_items: [
{
k_id: 'k_expression',
k_caption: k_caption,
k_maxLength: 255,
k_checkByteLength: true
}
]
};
if (k_isPacketFormatEditor && !k_isAuditor) {
k_formCfg.k_items.push({
k_type: 'k_display'
});
k_formCfg.k_items.push({
k_type: 'k_formButton',
k_caption: k_tr('Reset to default', 'logsExpressionEditor'),
k_onClick: function(k_form) {
k_form.k_dialog.k_inputExpression.k_setValue(k_form.k_DEFAULT_TEMPLATE);
}
});
}
k_articleId = k_isPacketFormatEditor ? 1392 : 1374;
k_formCfg.k_items.push(
k_methods.k_getDisplayFieldWithKbLink(k_articleId, undefined,
{
k_itemClassName: 'bottomFormItem',
k_style: 'text-align: right;'
}
)
);
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_title: k_title,
k_isAuditor: k_isAuditor,
k_content: k_form,
k_height: k_isPacketFormatEditor ? 190 : 140,
k_width: k_isPacketFormatEditor ? 620 : 300,
k_defaultItem: 'k_expression',

k_onOkClick: function() {
var
k_dialog = this.k_dialog,
k_jsonRpc = k_dialog.k_cfgRequestSet.k_jsonRpc,
k_value = k_dialog.k_inputExpression.k_getValue();
k_dialog.k_hide();
k_jsonRpc.params = {};
k_jsonRpc.params[k_dialog.k_dataRoot] = k_value;
kerio.lib.k_ajax.k_request(k_dialog.k_cfgRequestSet);
}
};
k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialogCfg.k_hasHelpIcon = false;
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_inputExpression: k_form.k_getItem('k_expression'),
k_dataRoot: k_dataRoot
});
k_form.k_addReferences({
k_DEFAULT_TEMPLATE: k_DEFAULT_TEMPLATE,
k_dialog: k_dialog
});
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_cfgRequestGet: {
k_jsonRpc: {
'method': 'Logs' + '.' + k_methodGet
},
k_callback: k_dialog.k_callbackGetExpression,
k_scope: k_dialog
},
k_cfgRequestSet: {
k_jsonRpc: {
'method': 'Logs' + '.' + k_methodSet
}
}
});
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function() {
this.k_showMask(kerio.lib.k_tr('Loading…', 'common'));
kerio.lib.k_ajax.k_request(this.k_cfgRequestGet);
};

k_kerioWidget.k_callbackGetExpression = function(k_response, k_success) {
if (!k_success || !k_response.k_decoded[this.k_dataRoot]) {
this.k_hideMask();
return;
}
this.k_inputExpression.k_setValue(k_response.k_decoded[this.k_dataRoot]);
this.k_hideMask();
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}
}; 