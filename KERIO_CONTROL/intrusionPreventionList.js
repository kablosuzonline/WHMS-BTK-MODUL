
kerio.waw.ui.intrusionPreventionList = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_shared = kerio.waw.shared,
k_WAW_METHODS = k_shared.k_methods,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_isAuditor = k_WAW_METHODS.k_isAuditor(),
k_tr = kerio.lib.k_tr,
k_isIPadCompatible = kerio.lib.k_isIPadCompatible,
IntrusionPreventionAction = k_WAW_CONSTANTS.IntrusionPreventionAction,
k_SELECT_SEVERITY_LEVELS_MAPPED = {},
k_SELECT_SEVERITY_LEVELS,
k_blacklistGridCfg,
k_blacklistGrid,
k_toolbarCfg,
k_toolbar,
k_formCfg,
k_form,
k_getBtnAdvancedCfg,
k_heightContainerEnabled,
k_heightFieldsetSeverityLevels,
k_heightFieldsetUpdate,
k_verticalAnchorBlacklists;
k_WAW_CONSTANTS.k_IPS_UPDATE_TASK_ID = 'k_ipsUpdateTask'; k_SELECT_SEVERITY_LEVELS_MAPPED[IntrusionPreventionAction.IntrusionPreventionActionDropAndLog] = { name: k_tr('Log and drop', 'intrusionPreventionList'), value: IntrusionPreventionAction.IntrusionPreventionActionDropAndLog};
k_SELECT_SEVERITY_LEVELS_MAPPED[IntrusionPreventionAction.IntrusionPreventionActionLog] = { name: k_tr('Log', 'intrusionPreventionList'), value: IntrusionPreventionAction.IntrusionPreventionActionLog};
k_SELECT_SEVERITY_LEVELS_MAPPED[IntrusionPreventionAction.IntrusionPreventionActionNothing] = { name: k_tr('Do nothing', 'intrusionPreventionList'), value: IntrusionPreventionAction.IntrusionPreventionActionNothing};
k_SELECT_SEVERITY_LEVELS = [
k_SELECT_SEVERITY_LEVELS_MAPPED[IntrusionPreventionAction.IntrusionPreventionActionDropAndLog],
k_SELECT_SEVERITY_LEVELS_MAPPED[IntrusionPreventionAction.IntrusionPreventionActionLog],
k_SELECT_SEVERITY_LEVELS_MAPPED[IntrusionPreventionAction.IntrusionPreventionActionNothing]
];
k_blacklistGridCfg = {
k_isReadOnly: k_isAuditor,
k_toolbars: {
},
k_localData: [],
k_columns: {
k_sorting: false,
k_items: [
{
k_columnId: 'url',
k_isDataOnly: true
},
{
k_columnId: 'name',
k_caption: k_tr('Name', 'common'),
k_width: 200,

k_renderer: function(k_value, k_data) {
return {
k_data: '<a href="' + k_data.url + '" class="selectable link linkText notUnderlinedLink" target="_blank">' + k_value + '</a>',
k_isSecure: true
};
}
},
{
k_columnId: 'action',
k_caption: k_isAuditor ? k_tr('Action', 'intrusionPreventionEditor') : k_tr('Action (Double click a row to change it)', 'intrusionPreventionEditor'),

k_renderer: function(k_value) {
return {
k_data: this.k_SELECT_SEVERITY_LEVELS_MAPPED[k_value].name
};
},
k_editor:  {
k_type: 'k_select',
k_localData: k_SELECT_SEVERITY_LEVELS,

k_onBlur: function(k_parent, k_element) {
var
k_oldValue = k_parent.k_getEditInfo().k_origValue,
k_newValue = k_element.k_getValue();
if (k_oldValue === k_newValue) {
return; }
kerio.adm.k_framework.k_enableApplyReset();
}
} } ] } }; k_blacklistGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'blacklistGrid', k_blacklistGridCfg);
k_heightContainerEnabled = 25;
k_heightFieldsetSeverityLevels = k_isIPadCompatible ? 205 : 190;
k_heightFieldsetUpdate = k_isIPadCompatible ? 120 : 90;
k_verticalAnchorBlacklists = 20 + k_heightContainerEnabled + k_heightFieldsetSeverityLevels + k_heightFieldsetUpdate; 
k_getBtnAdvancedCfg = function(k_forIpad) {
var k_runOnIpad = kerio.lib.k_isIPadCompatible;
if (k_forIpad !== k_runOnIpad) {
return {
k_restrictions: {
k_isIpad: [ k_forIpad ]
}
};
}
return {
k_restrictions: {
k_isIpad: [ k_forIpad ]
},
k_type: 'k_formButton',
k_caption: kerio.lib.k_tr('Advanced…', 'common'),
k_id: 'k_btnSeverityAdvanced',

k_onClick: function(k_form){
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'intrusionPreventionEditor',
k_params: {
k_data: {
ports: k_form.k_dataStore.ports,
k_ignoredSignatures: k_form.k_ignoredSignatures
},
k_callback: k_form.k_changeAdvancedSettings,
k_parentWidget: k_form,
k_loadSignatures: k_form.k_loadSignatures
}
});
} };
};
k_formCfg = {
k_restrictBy: {
k_isIpad: k_isIPadCompatible
},
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_isReadOnly: k_isAuditor,
k_items: [
{
k_type: 'k_container',
k_minHheight: k_heightContainerEnabled,
k_items: [
{
k_id: 'enabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Enable Intrusion Prevention', 'intrusionPreventionList'),
k_isChecked: false,

k_onChange: function(k_form, k_element, k_value) {
kerio.adm.k_framework.k_enableApplyReset();
}
}
]
}, {
k_id: 'k_fieldsetSeverityLevels',
k_type: 'k_fieldset',
k_minHheight: k_heightFieldsetSeverityLevels,
k_caption: k_tr('Severity levels', 'intrusionPreventionList'),
k_labelWidth: 130,
k_items: [
{
k_type: 'k_container',
k_items: [
{
k_type: 'k_display',
k_value: k_tr('The Intrusion Prevention System detects incidents based on a database of signatures.', 'intrusionPreventionList')
+ ' '
+ k_tr('Here you may define actions for the different severity levels of the detected incidents:', 'intrusionPreventionList')
}
] }, {
k_type: 'k_select',
k_id: 'high',
k_caption: k_tr('High severity:', 'intrusionPreventionList'),
k_width: 280,
k_localData: k_SELECT_SEVERITY_LEVELS,
k_value: IntrusionPreventionAction.IntrusionPreventionActionDropAndLog
},
{
k_type: 'k_select',
k_id: 'medium',
k_caption: k_tr('Medium severity:', 'intrusionPreventionList'),
k_width: 280,
k_localData: k_SELECT_SEVERITY_LEVELS,
k_value: IntrusionPreventionAction.IntrusionPreventionActionLog
},
{
k_type: 'k_select',
k_id: 'low',
k_caption: k_tr('Low severity:', 'intrusionPreventionList'),
k_width: 280,
k_localData: k_SELECT_SEVERITY_LEVELS,
k_value: IntrusionPreventionAction.IntrusionPreventionActionNothing
},
{
k_type: 'k_row',
k_className: 'lastFormItem',
k_items: [
{
k_type: 'k_display',
k_className: 'buttonCenteredText',
k_template: '<a class="selectable link textLink" target="_blank" href="{k_linkUrl}">{k_linkText}</a>',
k_width: k_isIPadCompatible ? undefined : 350,
k_value: {
k_linkUrl: 'http://www.kerio.com/control/ips-test',
k_linkText: k_tr('On the Kerio website, you can test these settings', 'intrusionPreventionList')
}
},
'->',
k_getBtnAdvancedCfg(false)
] }, k_getBtnAdvancedCfg(true)
] }, {
k_id: 'k_fieldsetBlacklist',
k_type: 'k_fieldset',
k_caption: k_tr('IP blacklists', 'intrusionPreventionList'),
k_anchor: "0 -" + k_verticalAnchorBlacklists, k_minHeight: k_isIPadCompatible ? 210: 150,
k_items: [
{
k_type: 'k_container',
k_anchor: "0 0", k_items: [
{
k_type: 'k_display',
k_value: k_tr('Here you may define actions for the IP addresses listed in the following blacklists:', 'intrusionPreventionList')
},
{
k_type: 'k_container',
k_anchor: "0 -20", k_content: k_blacklistGrid
}
] } ] }, {
k_id: 'k_fieldsetUpdate',
k_type: 'k_fieldset',
k_caption: k_tr('Updates', 'intrusionPreventionList'),
k_minHheight: k_heightFieldsetUpdate,
k_className: 'removeFieldsetMargin',
k_items: [
{
k_type: 'k_container',
k_items: [
{
k_type: 'k_columns',
k_items: [
{
k_type: 'k_checkbox',
k_id: 'updateCheckInterval.enabled',
k_isLabelHidden: true,
k_option: k_tr('Update signatures and blacklists every ', 'intrusionPreventionList'),

k_onChange: function(k_form, k_element, k_isChecked) {
k_form.k_setDisabled(['updateCheckInterval.value', 'updateCheckInterval.units'], !k_isChecked);
}
},
{
k_type: 'k_number',
k_id: 'updateCheckInterval.value',
k_isLabelHidden: true,
k_isDisabled: true,
k_width: 50,
k_value: 1,
k_minValue: 1,
k_maxValue: 999, k_maxLength: 3,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_id: 'updateCheckInterval.units',
k_isDisabled: true,
k_value: k_tr('hours', 'intrusionPreventionList')
},
{
k_type: 'k_formButton',
k_id: 'k_btnUpdateNow',
k_caption: k_tr('Update Now', 'intrusionPreventionList'),
k_mask: false,

k_onClick: function(k_form, k_button, k_event) {
k_form.k_updateRequestCfg.k_requests[0].params.force = k_event.k_isShiftKey();
kerio.waw.shared.k_methods.k_sendBatch(k_form.k_updateRequestCfg);
k_form.k_setProgressVisible(true); }
}
]
}, { k_type: 'k_container',
k_id: 'k_containerUpdateInfo',
k_labelWidth: 300,
k_items: [
{
k_type: 'k_display',
k_id: 'lastUpdateCheck',
k_caption: k_tr('Last update check:', 'intrusionPreventionList'),
k_value: k_tr('Never', 'common')
},
{
k_type: 'k_display',
k_id: 'databaseVersion',
k_caption: k_tr('Signatures database version:', 'intrusionPreventionList'),
k_value: k_tr('Unknown', 'common')
}
]
},  { k_type: 'k_container',
k_id: 'k_containerUpdateProgress',
k_isHidden: true, k_items: [
{
k_type: 'k_display',
k_id: 'k_downloadProgressMessage',
k_isLabelHidden: true,
k_className: 'ipsUpdateStatus checking',
k_template: '&nbsp; &nbsp; &nbsp; {k_message}',
k_value: {
k_message: k_tr('Please wait, update in progress…', 'intrusionPreventionList')
}
}
]
}  ]
}
]
}, {
k_id: 'k_fieldsetUpdateTrial',
k_type: 'k_fieldset',
k_caption: k_tr('Updates', 'intrusionPreventionList'),
k_minHeight: k_heightFieldsetUpdate,
k_isHidden: true,
k_className: 'removeFieldsetMargin',
k_items: [
{
k_id: 'k_noUpdateMessage',
k_type: 'k_display',
k_template: '<span class="antivirusStatus {k_icon}">&nbsp; &nbsp; &nbsp;</span>{k_message} <a id="k_gotoRegister">{k_link}</a>',
k_value: { k_message: '',
k_link: '',
k_icon: 'warning'
},
k_onLinkClick: k_WAW_METHODS.k_gotoRegister
}
]
}
] }; if (!k_isAuditor) {

k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function(k_toolbar) {
var
k_form = k_toolbar.k_relatedWidget;
if (!k_form.k_isValid()) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return false;
}
k_form.k_sendData();
return false;
}, 
k_onReset: function(k_toolbar) {
k_toolbar.k_relatedWidget.k_loadData();
}
}; k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
k_formCfg.k_toolbars = {
k_bottom: k_toolbar
};
}
k_form = new kerio.lib.K_Form(k_objectName, k_formCfg);
if (k_isAuditor) {
k_form.k_getItem('k_btnSeverityAdvanced').k_forceSetWritable();
}
this.k_addControllers(k_form);
k_blacklistGrid.k_addReferences({
k_SELECT_SEVERITY_LEVELS_MAPPED: k_SELECT_SEVERITY_LEVELS_MAPPED
});
k_form.k_addReferences({
k_isAuditor: k_isAuditor,
k_toolbar: k_toolbar,
k_blacklistGrid: k_blacklistGrid,
k_updateTaskId: k_WAW_CONSTANTS.k_IPS_UPDATE_TASK_ID,
k_dataStore: {},
k_ignoredSignatures: undefined,
k_loadSignaturesRequest: undefined,
k_fieldsetUpdate: k_form.k_getItem('k_fieldsetUpdate'),
k_fieldsetUpdateTrial: k_form.k_getItem('k_fieldsetUpdateTrial'),
k_getDataRequest: {
k_jsonRpc: {
method: 'IntrusionPrevention.get'
},
k_callback: k_form.k_loadDataCallback,
k_scope: k_form
},
k_requestSet: {
method: 'IntrusionPrevention.set'
},
k_requestSetIgnored: {
method: 'IntrusionPrevention.setIgnoredRules'
},
k_setDataRequest: {
k_requests: undefined,
k_scope: k_form,
k_callback: k_form.k_sendDataCallback,
k_requestOwner: k_form
},
k_updateRequestCfg: {
k_requests: [
{
method: 'IntrusionPrevention.update',
params: {}
},
{
method: 'IntrusionPrevention.getUpdateStatus'
}
],
k_callback: k_form.k_getUpdateStatusCallback,
k_scope: k_form
}
}); kerio.waw.shared.k_tasks.k_add({
k_id: k_WAW_CONSTANTS.k_IPS_UPDATE_TASK_ID,
k_interval: 5000,
k_run: k_form.k_getUpdateStatus,
k_scope: {
k_jsonRpc: {
method: 'IntrusionPrevention.getUpdateStatus'
},
k_callback: k_form.k_getUpdateStatusCallback,
k_scope: k_form
}
});
return k_form;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function () {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
var
k_tr = kerio.lib.k_tr,
k_shared = kerio.waw.shared,
k_isUnregisteredTrial = k_shared.k_methods.k_isTrial(false),
k_isSubscriptionExpired = (0 === k_shared.k_methods.k_licenseRemainingDays(k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Subscription)),
k_noUpdate = k_isUnregisteredTrial || k_isSubscriptionExpired;
this.k_fieldsetUpdate.k_setVisible(!k_noUpdate);
this.k_fieldsetUpdateTrial.k_setVisible(k_noUpdate);
if (k_noUpdate) {
this.k_getItem('k_noUpdateMessage').k_setValue(
(k_isUnregisteredTrial
? {
k_message: k_tr('Updates are not available in the unregistered trial.', 'intrusionPreventionList'),
k_link: k_tr('Please register to enable signatures database updates.', 'intrusionPreventionList')
}
: {
k_message: k_tr('Updates are available only with valid Software Maintenance.', 'intrusionPreventionList'),
k_link: k_tr('You can register a new Software Maintenance number to enable signatures database updates.', 'intrusionPreventionList')
}
)
);
}
this.k_loadData();
kerio.waw.shared.k_tasks.k_start(this.k_updateTaskId);
};

k_kerioWidget.k_loadData = function() {
kerio.waw.shared.k_methods.k_maskMainScreen();
kerio.lib.k_ajax.k_request(this.k_getDataRequest);
};

k_kerioWidget.k_loadDataCallback = function(k_response) {
var
k_config;
if (!k_response.k_isOk) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
}
k_config = k_response.k_decoded.config;
this.k_setData(k_config, true);
this.k_dataStore = k_config;
delete this.k_ignoredSignatures; this.k_blacklistGrid.k_setData(k_config.blackLists.sort(this.k_sortArray));
kerio.adm.k_framework.k_enableApplyReset(false);
kerio.waw.shared.k_methods.k_unmaskMainScreen();
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_dialogs: ['intrusionPreventionEditor']
});
}; 
k_kerioWidget.k_sendData = function() {
var
k_sharedMethods = kerio.waw.shared.k_methods,
k_formData,
k_requests;
k_sharedMethods.k_maskMainScreen();
k_formData = this.k_getData(true);
this.k_dataStore.blackLists = this.k_blacklistGrid.k_getData();
this.k_requestSet.params = {
'config': k_sharedMethods.k_mergeObjects(k_formData, this.k_dataStore)
};
k_requests = [
this.k_requestSet
];
if (this.k_ignoredSignatures) {
this.k_requestSetIgnored.params = {
'ignored': this.k_ignoredSignatures
};
k_requests.push(this.k_requestSetIgnored);
}
this.k_setDataRequest.k_requests = k_requests;
k_sharedMethods.k_sendBatch(this.k_setDataRequest);
}; 
k_kerioWidget.k_sendDataCallback = function(k_response) {
if (kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
delete this.k_ignoredSignatures; kerio.adm.k_framework.k_enableApplyReset(false);
kerio.adm.k_framework.k_leaveCurrentScreen();
}
kerio.waw.shared.k_methods.k_unmaskMainScreen();
};

k_kerioWidget.k_sortArray = function(k_objectA, k_objectB) {
if (k_objectA.name < k_objectB.name) {
return -1;
}
else if (k_objectA.name > k_objectB.name) {
return 1;
}
return 0;
};

k_kerioWidget.k_changeAdvancedSettings = function(k_data) {
this.k_dataStore.ports   = k_data.ports;
this.k_ignoredSignatures = k_data.k_ignoredSignatures;
kerio.adm.k_framework.k_enableApplyReset();
};

k_kerioWidget.k_loadSignatures = function(k_callbackSetSignatures) {
if (!this.k_loadSignaturesRequest) {
this.k_loadSignaturesRequest = {
k_jsonRpc: {
method: 'IntrusionPrevention.getIgnoredRules'
},
k_callback: this.k_callbackLoadSignatures,
k_callbackParams: {
k_callbackSetSignatures: k_callbackSetSignatures
},
k_scope: this
};
}
else {
this.k_loadSignaturesRequest.k_callbackParams = {
k_callbackSetSignatures: k_callbackSetSignatures
};
}
kerio.lib.k_ajax.k_request(this.k_loadSignaturesRequest);
}; 
k_kerioWidget.k_callbackLoadSignatures = function(k_response, k_success, k_params) {
if (k_success && k_response.k_isOk) {
this.k_ignoredSignatures = k_response.k_decoded.ignored;
}
k_params.k_callbackSetSignatures.k_callback.call(k_params.k_callbackSetSignatures.k_scope, this.k_ignoredSignatures, k_success && k_response.k_isOk);
};

k_kerioWidget.k_getUpdateStatus = function() {
kerio.lib.k_ajax.k_request(this); return false; }; 
k_kerioWidget.k_getUpdateStatusCallback = function(k_response, k_success) {
var
k_tr = kerio.lib.k_tr,
k_shared = kerio.waw.shared,
k_tasks = k_shared.k_tasks,
k_WAW_METHODS = k_shared.k_methods,
k_PHASES = k_shared.k_CONSTANTS.IntrusionPreventionUpdatePhases,
k_inProgress = false,
k_data;
if (!k_success || !k_response.k_isOk) {
this.k_setProgressVisible(false);
this.k_setData({lastUpdateCheck: k_tr('Communication with server failed.', 'common')}, true);
k_tasks.k_stop(this.k_updateTaskId);
return;
}
k_data = k_response.k_decoded;
if (k_data.batchResult) {
k_data = k_data.batchResult;
if (0 === k_data.length || !k_data[1].status) { kerio.lib.k_reportError('Invalid update batch request', 'intrustionPreventionList', 'k_getUpdateStatusCallback');
return;
}
k_data = k_data[1].status;
}
else {
k_data = k_data.status;
}
switch (k_data.phase) {
case k_PHASES.IntrusionPreventionUpdateOk:
k_data.lastUpdateCheck = k_WAW_METHODS.k_formatTimeSpan(k_data.lastUpdateCheck);
break;
case k_PHASES.IntrusionPreventionUpdateError:
k_data.lastUpdateCheck = k_WAW_METHODS.k_formatTimeSpan(k_data.lastUpdateCheck, true); if (k_data.errorMessage) {
k_data.lastUpdateCheck += ' - ' + k_tr(k_data.errorMessage, 'serverMessage');
}
break;
case k_PHASES.IntrusionPreventionUpdateProgress:
k_inProgress = true;
break;
default:
kerio.lib.k_reportError('Uknown update phase', 'intrustionPreventionList', 'k_getUpdateStatusCallback');
return;
}
this.k_setProgressVisible(k_inProgress);
this.k_setData(k_data, true);
if (k_inProgress) { if (!k_tasks.k_start(this.k_updateTaskId)) { k_tasks.k_resume(this.k_updateTaskId, true);
}
}
else { k_tasks.k_stop(this.k_updateTaskId);
}
}; 
k_kerioWidget.k_setProgressVisible = function(k_visible) {
this.k_setVisible('k_containerUpdateInfo', false); this.k_setVisible('k_containerUpdateProgress', k_visible);
this.k_setVisible('k_containerUpdateInfo', !k_visible);
this.k_setDisabled('k_btnUpdateNow', k_visible);
};
}}; 