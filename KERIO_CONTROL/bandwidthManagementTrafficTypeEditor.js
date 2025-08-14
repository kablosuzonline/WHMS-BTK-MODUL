
kerio.waw.ui.bandwidthManagementTrafficTypeEditor = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_shared = kerio.waw.shared,
k_tr = k_lib.k_tr,
k_trafficType = k_shared.k_CONSTANTS.BMTrafficType,
k_TRAFFIC_TYPE_TRANSLATIONS = k_shared.k_DEFINITIONS.k_BM_TRAFFIC_TYPE_TRANSLATIONS,
k_localData = [],
k_elements = [],
k_descList = [],
k_descElements = [],
k_id,
k_data,
k_currentData,
k_formCfg, k_form,
k_dialogCfg, k_dialog;
k_data = {
k_email: {
k_value: k_trafficType.BMTrafficEmail,
k_caption: k_TRAFFIC_TYPE_TRANSLATIONS[k_trafficType.BMTrafficEmail],
k_description: k_tr('SMTP, IMAP, POP3 protocols (and their secured versions).', 'bandwidthManagementTrafficTypeEditor')
},
k_ftp: {
k_value: k_trafficType.BMTrafficFtp,
k_caption: k_TRAFFIC_TYPE_TRANSLATIONS[k_trafficType.BMTrafficFtp],
k_description: k_tr('FTP protocol (including traffic through a proxy server).', 'bandwidthManagementTrafficTypeEditor')
},
k_im: {
k_value: k_trafficType.BMTrafficInstantMessaging,
k_caption: k_TRAFFIC_TYPE_TRANSLATIONS[k_trafficType.BMTrafficInstantMessaging],
k_description: k_tr('Online communication via services such as ICQ, MSN Messenger, Yahoo! Messenger, etc.', 'bandwidthManagementTrafficTypeEditor')
},
k_multimedia: {
k_value: k_trafficType.BMTrafficMultimedia,
k_caption: k_TRAFFIC_TYPE_TRANSLATIONS[k_trafficType.BMTrafficMultimedia],
k_description: k_tr('Protocols enabling real-time transmission of sound and video files (e.g. RTSP, MMS, RealAudio).', 'bandwidthManagementTrafficTypeEditor')
},
k_p2p: {
k_value: k_trafficType.BMTrafficP2p,
k_caption: k_TRAFFIC_TYPE_TRANSLATIONS[k_trafficType.BMTrafficP2p],
k_description: k_tr('File-sharing protocols (peer-to-peer — e.g. DirectConnect, BitTorrent, eDonkey, etc.). The traffic is accounted only if Kerio Control detects that it is traffic within a P2P network.', 'bandwidthManagementTrafficTypeEditor')
},
k_rdp: {
k_value: k_trafficType.BMTrafficRemoteAccess,
k_caption: k_TRAFFIC_TYPE_TRANSLATIONS[k_trafficType.BMTrafficRemoteAccess],
k_description: k_tr('\"Terminal\" access to remote hosts (e.g. Remote Desktop, VNC, Telnet or SSH).', 'bandwidthManagementTrafficTypeEditor')
},
k_sip: {
k_value: k_trafficType.BMTrafficSip,
k_caption: k_TRAFFIC_TYPE_TRANSLATIONS[k_trafficType.BMTrafficSip],
k_description: k_tr('Voice over IP using SIP protocol.', 'bandwidthManagementTrafficTypeEditor')
},
k_vpn: {
k_value: k_trafficType.BMTrafficVpn,
k_caption: k_TRAFFIC_TYPE_TRANSLATIONS[k_trafficType.BMTrafficVpn],
k_description: k_tr('Connection to remote private networks (e.g. Kerio VPN, Microsoft PPTP, etc.).', 'bandwidthManagementTrafficTypeEditor')
},
k_web: {
k_value: k_trafficType.BMTrafficWeb,
k_caption: k_TRAFFIC_TYPE_TRANSLATIONS[k_trafficType.BMTrafficWeb],
k_description: k_tr('HTTP and HTTPS protocols and any other traffic served by the HTTP protocol inspector.', 'bandwidthManagementTrafficTypeEditor')
}
};
for (k_id in k_data) {
k_currentData = k_data[k_id];
k_localData.push({
k_name: k_currentData.k_caption,
k_id:  k_currentData.k_value
});
k_elements.push({
k_type: 'k_display',
k_id: k_id,
k_isHidden: true,
k_value: k_currentData.k_description
});
k_descList.push(k_id);
k_descElements[k_currentData.k_value] = k_id;
}
k_localData.sort(function(k_first, k_second) {
return k_first.k_name.localeCompare(k_second.k_name);
});
k_formCfg = {
k_items: [
{
k_type: 'k_select',
k_id: 'k_trafficType',
k_caption: k_tr('Select type:', 'bandwidthManagementTrafficTypeEditor'),
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: k_localData,
k_onChange: function(k_form, k_item, k_value) {
k_form.k_setVisible(k_form.k_descList, false);
k_form.k_setVisible(k_form.k_descElements[k_value], true);
}
},
{
k_type: 'k_display'},
{
k_type: 'k_container',
k_items: k_elements
}
]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 410,
k_height: 220,
k_title: k_tr('Add Traffic Type', 'bandwidthManagementTrafficTypeEditor'),
k_content: k_form,
k_defaultItem: null,

k_onOkClick: function() {
var
k_dialog = this.k_parentWidget,
k_parentGrid = k_dialog.k_relatedGrid;
if (k_dialog.k_preselectId) {
k_parentGrid.k_datastore.k_groups.BMConditionTrafficType.k_removeByType(k_dialog.k_preselectId);
}
k_parentGrid.k_fillDataFromRuleDataStore(
kerio.waw.shared.k_DEFINITIONS.k_get('k_bandwidthTrafficDataTemplate', {
type: kerio.waw.shared.k_CONSTANTS.BMConditionType.BMConditionTrafficType,
trafficType: k_dialog.k_trafficType.k_getValue()
})
);
k_dialog.k_hide();
}
};
k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_form.k_addReferences({
k_descList: k_descList,
k_descElements: k_descElements
});
k_form.k_setVisible(k_form.k_descElements[k_localData[0].k_id], true);
k_dialog.k_addReferences({
k_form: k_form,
k_trafficType: k_form.k_getItem('k_trafficType'),
k_relatedGrid: {}
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function (k_params) {
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_preselectId = k_params.k_preselectId;
this.k_form.k_setData({k_trafficType: k_params.k_preselectId});
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};}};