
kerio.waw.ui.bandwidthManagementLinkEditor = {
k_init: function(k_objectName, k_initParams) {
var
k_localNamespace = k_objectName + '_',
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_productName = k_WAW_DEFINITIONS.k_PRODUCT_NAME,
k_tr = kerio.lib.k_tr,
k_items = [],
k_linkPrefix = 'k_link' + '_',
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_getLinkEditorCfg,
k_i, k_cnt,
k_height;

k_getLinkEditorCfg = function(k_id) {
var
k_tr = kerio.lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_namespace = k_id + '_';
return {
k_type: 'k_row',
k_id: k_id,
k_isReadOnly: k_isAuditor,
k_items: [
{
k_type: 'k_display',
k_id: k_namespace + 'k_interface',
k_width: 100, k_className: '', k_isSecure: true,
k_template: '<table class="bandwidth" width="200px" height="20px"><tbody><tr>'
+ '<tpl if="k_online">'
+ '<td width="19px" class="cellIcon interfaceIcon {k_type}">&nbsp</td>'
+ '<td width="170px"><span class="ellipsis" style="width:170px !important;" title="{k_name:htmlEncode}">{k_name:htmlEncode}</span></td>'
+ '</tpl>'
+ '<tpl if="!k_online">'
+ '<td width="19px" class="cellIcon interfaceIcon {k_type} dead">&nbsp</td>'
+ '<td width="170px"><span class="ellipsis" style="width:170px !important;" title="{k_name:htmlEncode} (' + k_tr('Offline', 'bandwidthManagement') + ')">{k_name:htmlEncode}</span></td>'
+ '</tpl>'
+ '</tr></tbody></table>',
k_value: {
k_type: '',
k_name: '',
k_online: true
}
},
{
k_type: 'k_display',
k_value: k_tr('Download:', 'bandwidthManagementLinkEditor')
},
{
k_type: 'k_number',
k_id: k_namespace + 'k_downloadSpeed',
k_emptyText: k_tr('undefined', 'bandwidthManagementLinkEditor'),
k_minValue: 1,
k_maxLength: 9
},
kerio.waw.shared.k_DEFINITIONS.k_get('K_BANDWIDTH_UNITS_SELECT', { k_id: k_namespace + 'k_downloadUnit'}),
{
k_type: 'k_display',
k_value: k_tr('Upload:', 'bandwidthManagementLinkEditor')
},
{
k_type: 'k_number',
k_id: k_namespace + 'k_uploadSpeed',
k_emptyText: k_tr('undefined', 'bandwidthManagementLinkEditor'),
k_minValue: 1,
k_maxLength: 9
},
kerio.waw.shared.k_DEFINITIONS.k_get('K_BANDWIDTH_UNITS_SELECT', { k_id: k_namespace + 'k_uploadUnit'})
]
};
}; for (k_i = 0, k_cnt = k_initParams.k_count; k_i < k_cnt; k_i++) {
k_items.push(k_getLinkEditorCfg(k_linkPrefix + k_i));
}
k_items.unshift(
{
k_type: 'k_display',
k_template: '{k_text}<br>{k_note}<br>&nbsp;',
k_value: {
k_text: k_tr('%1 needs to know the real bandwidth.', 'bandwidthManagementLinkEditor', {
k_args: [k_productName]
}),
k_note: k_tr('The real bandwidth is typically %1 narrower than the ISP contracted bandwidth.', 'bandwidthManagementLinkEditor', { k_args: [ '20%' ]})
}
}
);
k_items.push(
kerio.waw.shared.k_methods.k_getDisplayFieldWithKbLink(1373, k_tr('What are correct values?', 'bandwidthManagementLinkEditor'),
{
k_itemClassName: 'lastFormItem bottomFormItem',
k_style: 'text-align: right;'
}
)
);
k_formCfg = {
k_items: k_items
};
k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_height = 140 + (k_items.length * 28);
k_dialogCfg = {
k_height: k_height,
k_width: 720,
k_title: k_tr('Link Bandwidth', 'bandwidthManagementLinkEditor'),
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
InterfaceType: kerio.waw.shared.k_CONSTANTS.InterfaceType,
k_dataStore: null,
k_callback: null
});
k_form.k_addReferences({
k_dialog: k_dialog
});
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_sendDataRequest: {
k_jsonRpc: {
method: 'BandwidthManagement.setBandwidth',
params: {}
},
k_callback: k_dialog.k_saveDataCallback,
k_scope: k_dialog
}
});
return k_dialog;
}, 
k_addControllers: function (k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_getBmInterfaceIcon = kerio.waw.shared.k_methods.k_getBmInterfaceIcon,
k_data = k_params.k_data,
k_formData = {},
k_linkPrefix = 'k_link' + '_',
k_prefix,
k_i, k_cnt,
k_row;
this.k_dataStore = k_data;
this.k_callback = k_params.k_callback;
this.k_cntRowsNeedUpLinkSpeed = k_params.k_cntRowsNeedUpLinkSpeed;
this.k_cntRowsNeedDownLinkSpeed = k_params.k_cntRowsNeedDownLinkSpeed;
this.k_forced = k_params.k_forced;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_row = k_data[k_i];
k_prefix = k_linkPrefix + k_i + '_';
k_formData[k_prefix + 'k_interface'] = {
k_type: k_getBmInterfaceIcon(k_row),
k_name: k_row.name,
k_online: k_row.online
};
k_formData[k_prefix + 'k_downloadSpeed'] = k_row.download.speed || ''; k_formData[k_prefix + 'k_downloadUnit'] = k_row.download.unit;
k_formData[k_prefix + 'k_uploadSpeed'] = k_row.upload.speed || ''; k_formData[k_prefix + 'k_uploadUnit'] = k_row.upload.unit;
}
this.k_form.k_setData(k_formData);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); }; 
k_kerioWidget.k_saveData = function() {
var
k_sendDataRequest = this.k_sendDataRequest,
k_data = this.k_dataStore,
k_formData = this.k_form.k_getData(),
k_linkPrefix = 'k_link' + '_',
k_downloadRequired = false,
k_uploadRequired = false,
k_prefix,
k_i, k_cnt,
k_row;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_row = k_data[k_i];
k_prefix = k_linkPrefix + k_i + '_';
k_row.download.speed = k_formData[k_prefix + 'k_downloadSpeed'] || 0; k_row.download.unit  = k_formData[k_prefix + 'k_downloadUnit'];
k_row.upload.speed   = k_formData[k_prefix + 'k_uploadSpeed'] || 0; k_row.upload.unit    = k_formData[k_prefix + 'k_uploadUnit'];
if (0 === k_row.download.speed && 0 < this.k_cntRowsNeedDownLinkSpeed) {
k_downloadRequired = true;
}
if (0 === k_row.upload.speed && 0 < this.k_cntRowsNeedUpLinkSpeed) {
k_uploadRequired = true;
}
}
if (false === this.k_displaySpeedWarning(k_downloadRequired, k_uploadRequired)) {
this.k_hideMask();
return;
}
if (this.k_forced) { k_sendDataRequest.k_jsonRpc.params.list = k_data;
k_sendDataRequest.k_callbackParams = k_data;
kerio.waw.requests.k_sendBatch(k_sendDataRequest);
}
else { this.k_callback(k_data, true);
this.k_hide();
}
}; 
k_kerioWidget.k_saveDataCallback = function(k_response, k_success, k_data) {
if (k_success) {
this.k_callback(k_data, false);
this.k_hide();
}
else {
this.k_hideMask();
}
};

k_kerioWidget.k_displaySpeedWarning = function(k_downloadRequired, k_uploadRequired) {
var
k_tr = kerio.lib.k_tr,
k_message = '',
k_isSingleLink = (1 === this.k_dataStore.length),
k_type = (k_uploadRequired << 1) + k_downloadRequired; switch (k_type) {
case 1: k_message = (k_isSingleLink)
? k_tr('The download speed needs to be specified.', 'bandwidthManagementLinkEditor')
: k_tr('The download speed needs to be specified for all interfaces.', 'bandwidthManagementLinkEditor');
break;
case 2: k_message = (k_isSingleLink)
? k_tr('The upload speed needs to be specified.', 'bandwidthManagementLinkEditor')
: k_tr('The upload speed needs to be specified for all interfaces.', 'bandwidthManagementLinkEditor');
break;
case 3: k_message = (k_isSingleLink)
? k_tr('Download and upload speeds need to be specified.', 'bandwidthManagementLinkEditor')
: k_tr('Download and upload speeds need to be specified for all interfaces.', 'bandwidthManagementLinkEditor');
break;
default:
return true;
}
k_message += '<br><br><i>';
k_message += k_tr('Note: The link speed needs to be specified when there is a rule for bandwidth reservation or a rule limiting traffic to a percentage of the link speed.', 'bandwidthManagementLinkEditor');
k_message += '</i>';
kerio.lib.k_alert({
k_title: k_tr('Validation warning', 'common'),
k_msg: k_message,
k_icon: 'warning'
});
return false;
}; } }; 