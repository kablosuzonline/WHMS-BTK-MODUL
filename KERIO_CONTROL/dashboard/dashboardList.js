
kerio.waw.ui.dashboardList = {
k_init: function (k_objectName) {
var
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_isFinal = k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.finalVersion,
k_isTrial = k_shared.k_methods.k_isTrial(false) || k_shared.k_methods.k_isTrial(true),
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_isIos = k_shared.k_methods.k_isIos(),
k_tr = kerio.lib.k_tr,
k_dashboard,
k_dashboardCfg,
k_supportIncidentButton,
k_dashboardInetInterfaces,
k_interface,
k_column,
k_urlLegalNotices,
k_i, k_cnt;
if (false !== k_isFinal) { k_supportIncidentButton = {
k_id: 'k_btnSupportIncident',
k_caption: k_tr('Contact Technical Support…', 'dashboardList'),

k_onClick: function(k_toolbar) {
if (!this.k_parentWidget.k_isRegistered()) {
return;
}
kerio.lib.k_openWindow('https://www.gfi.com/support/kerio-support');
}
};
}
else {
k_supportIncidentButton = {
k_id: 'k_btnReportProblem',
k_mask: false,
k_caption: k_tr('Report Problem…', 'dashboardList'),

k_onClick: function(k_toolbar) {
if (!this.k_parentWidget.k_isRegistered()) {
return;
}
var
k_country = ('cs' === kerio.waw.status.k_userSettings.k_get('language') ? 'cz' : 'en'),
k_version = kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.versionString;
kerio.lib.k_openWindow('http://www.kerio.com/feedback/?prod=kwf' + '&country=' + k_country + '&version=' + k_version, '_blank');
}
};
}
k_urlLegalNotices = kerio.adm.k_framework._k_helpActions[0].k_url;
k_urlLegalNotices = k_urlLegalNotices.substr(0, k_urlLegalNotices.indexOf('?'));  k_urlLegalNotices += 'en/legalnotices.html?v=8629';
if (kerio.lib.k_isMyKerio) {
k_urlLegalNotices = '/admin/' + k_urlLegalNotices;
k_urlLegalNotices = kerio.lib.k_ajax.k_changeDownloadUrlForMyKerio(k_urlLegalNotices);
}
k_dashboardCfg = {
k_tiles: [
{
k_type:        'tileNews',
k_description: k_tr('Kerio News', 'dashboardList')
},
{
k_type:        'tileConnectivity',
k_description: k_tr('Connectivity', 'dashboardList')
},
{
k_type:        'tileSystemHealth',
k_description: k_tr('System Health', 'dashboardList')
},
{
k_type:        'tileActiveHosts',
k_description: k_tr('Top Active Hosts', 'dashboardList')
},
{
k_type:        'tileSystem',
k_description: k_tr('System', 'dashboardList')
},
{
k_type:        'tileSystemStatus',
k_description: k_tr('System Status', 'dashboardList')
},
{
k_type:        'tileTrafficChart',
k_isSingleton: false, k_description: k_tr('Traffic Chart', 'dashboardList')
},
{
k_type:        'tileVpn',
k_description: k_tr('VPN Info', 'dashboardList')
},
{
k_type:        'tileHighAvailabilityList',
k_description: k_tr('High Availability', 'highAvailabilityList')
},
{
k_type:        'tileLicense',
k_description: k_tr('License', 'dashboardList')
}
],
k_defaultSettings: {
columns: [
[
{type: 'tileNews'},
{type: 'tileSystemHealth'}
],
[
{type: 'tileSystem'},
{type: 'tileSystemStatus'},
{type: 'tileConnectivity'},
{type: 'tileActiveHosts'}
]
]
},
k_toolbarButtons: [
'->',
{
k_id: 'k_btnConfAssistant',
k_mask: false,
k_caption: k_isAuditor ? k_tr('Export Configuration…', 'dashboardList') : k_tr('Configuration Assistant…', 'dashboardList'),
k_isHidden: k_isAuditor && k_isIos,
k_onClick: function (k_toolbar) {
var
k_dashboard = k_toolbar.k_relatedWidget,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor();
k_dashboard.k_suppressAutorefresh();
if (k_isAuditor) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'configurationExport',
k_objectName: 'configurationExport',
k_initParams: {}
});
}
else {
kerio.waw.shared.k_methods.k_productInfo.k_showAssistent(true);
}
}
}
],
k_statusbar: {
k_configurations: {
k_default: {
k_text: '&copy; <a href="http://www.gfi.com" onclick="window.open(\'http://www.gfi.com\'); return false;">GFI Software.</a> ' + k_tr('All rights reserved.', 'dashboardList'),
k_link: {
k_text: k_tr('Legal Notices', 'dashboardList'),
k_onClick: function () {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'htmlDialog',
k_objectName: 'legalNotices',
k_initParams: {
k_title: kerio.lib.k_tr('Legal Notices', 'dashboardList'),
k_url: this.k_relatedWidget.k_urlLegalNotices
}
});
}
}
}
},
k_defaultConfig: 'k_default'
},
k_onAfterRender: function () {
kerio.waw.requests.k_stopSendingNow(); kerio.waw.init.k_afterInitTasks();
}
};
if (!k_isAuditor) {
k_dashboardCfg.k_toolbarButtons.push({
k_id: 'k_btnSuggestIdea',
k_mask: false,
k_caption: k_tr('Suggest Idea…', 'dashboardList'),
k_onClick: function (k_toolbar) {
if (!this.k_parentWidget.k_isRegistered()) {
return;
}
var
k_dashboard = k_toolbar.k_relatedWidget,
k_request;
k_request = {
k_jsonRpc: {
method: 'UserVoice.getUrl'
},

k_callback: function (k_response, k_success, k_params) {
if (!k_response.k_isOk) {
k_params.k_dashboard.k_suppressAutorefresh();
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'suggestIdeaEditor'
});
} else {
kerio.lib.k_openWindow(k_response.k_decoded.url, '_blank');
}
},
k_callbackParams: {
k_dashboard: k_dashboard
},

k_onError: function (k_response) {
if (k_response.k_isOk || (!k_response.k_isOk && 1000 === k_response.k_decoded.error.code)) {
return true;
}
return false;
}
};
kerio.lib.k_ajax.k_request(k_request);
} });
k_dashboardCfg.k_toolbarButtons.push(k_supportIncidentButton);
}
if (kerio.k_isIPadCompatible) {
k_dashboardCfg.k_defaultSettings = {
columns: [
[],
[
{type: 'tileSystem'}
]
]
};
}
else {
if (k_isTrial) {
k_dashboardCfg.k_defaultSettings.columns[1].unshift({type: 'tileLicense'});
}
if (kerio.waw.shared.k_data.k_dashboardInetInterfaces) {
k_column = k_dashboardCfg.k_defaultSettings.columns[0];
k_dashboardInetInterfaces = kerio.waw.shared.k_data.k_dashboardInetInterfaces;
for (k_i = 0, k_cnt = k_dashboardInetInterfaces.length; k_i < k_cnt; k_i++) {
k_interface = k_dashboardInetInterfaces[k_i];
k_column.push({
type: 'tileTrafficChart',
custom: {
chartId: k_interface.id,
chartName: k_interface.name
}
});
}
delete kerio.waw.shared.k_data.k_dashboardInetInterfaces;
}
}
k_dashboard = new kerio.adm.k_widgets.K_Dashboard(k_objectName, k_dashboardCfg);
this.k_addControllers(k_dashboard);
k_dashboard.k_addReferences({
k_splashScreen: kerio.adm.k_widgets.splashScreen.k_init('splashScreen'),
k_urlLegalNotices: k_urlLegalNotices
});
return k_dashboard;
}, 
k_addControllers: function (k_kerioWidget) {

k_kerioWidget.k_isRegistered = function () {
var
k_license = kerio.waw.shared.k_CONSTANTS.k_SERVER.k_LICENSE;
if (!k_license || (kerio.lib.k_getSharedConstants && kerio.lib.k_getSharedConstants().kerio_web_rsNoRegistration === k_license.regType)) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Unregistered version', 'dashboardList'),
k_msg: [
kerio.lib.k_tr('This feature is not available in unregistered version.', 'dashboardList'),
'<br><br><b>',
kerio.lib.k_tr('Please register your copy of Kerio Control first.', 'dashboardList'),
'</b>'
].join('')
});
return false;
}
return true;
};
}
}; 