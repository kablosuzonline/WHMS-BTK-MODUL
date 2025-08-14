
kerio.waw.ui.userMultiEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_widgets = kerio.waw.shared.k_widgets,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_multiEditorElement = kerio.waw.shared.k_methods.k_multiEditorElement,
k_formGeneralCfg, k_formGeneral,
k_formRights,
k_formQuota,
k_formPreferences,
k_dialogContentCfg, k_dialogContent,
k_dialogCfg, k_dialog;
k_formGeneralCfg = {
k_items: [
{
k_type: 'k_columns',
k_id: 'k_enableUserContainer',
k_items: [
k_multiEditorElement(kerio.waw.shared.k_DEFINITIONS.k_get('k_userEditorEnableUserCfg'))
]
},
{
k_type: 'k_fieldset',
k_id: 'k_domainTemplateContainer',
k_caption: k_tr('Domain template', 'userMultiEditor'),
k_items: k_multiEditorElement(kerio.waw.shared.k_DEFINITIONS.k_get('k_userEditorUseTemplateCfg'))
},
{
k_type: 'k_display',
k_id: 'k_currentUserNotice',
k_isSecure: true,
k_isLabelHidden: true,
k_value: '<b>' + k_tr(' In bulk edits you cannot change rights or disable the account of the user currently used for the session.', 'userMultiEditor') + '</b>',
k_isHidden: true },
k_multiEditorElement(
{
k_type: 'k_text',
k_id: 'k_description',
k_caption: k_tr('Description:', 'common'),
k_maxLength: 255,
k_width: 200,
k_checkByteLength: true
}
)
]
};
k_formGeneral = new k_lib.K_Form(k_localNamespace + 'k_formGeneral', k_formGeneralCfg);
k_formRights = new k_widgets.K_TabRights(k_localNamespace + 'k_rights', { k_isMultiEdit: true });
k_formQuota = new k_widgets.K_TabQuota(k_localNamespace + 'k_quota', { k_isMultiEdit: true });
k_formPreferences = new k_widgets.K_TabPreferences(k_localNamespace + 'k_preferences', { k_isMultiEdit: true });
k_dialogContentCfg = {
k_items: [
{
k_content: k_formGeneral,
k_caption: k_tr('General', 'common'),
k_id: 'k_generalPage'
},
{
k_content: k_formRights,
k_caption: k_tr('Rights', 'common'),
k_id: 'k_rightsPage'
},
{
k_content: k_formQuota,
k_caption: k_tr('Quota', 'common'),
k_id: 'k_quotaPage'
},
{
k_content: k_formPreferences,
k_caption: k_tr('Preferences', 'userList'),
k_id: 'k_preferencesPage'
}
]
};
k_dialogContent = new k_lib.K_TabPage(k_localNamespace + 'k_tabs', k_dialogContentCfg);
k_dialogCfg = {
k_height: 550,
k_width: 630,
k_title: k_tr('Edit Users', 'userMultiEditor'),
k_content: k_dialogContent,
k_defaultItem: null,

k_onOkClick: function(k_toolbar){
k_toolbar.k_dialog.k_saveData();
}
};
k_dialog = new k_lib.K_Dialog(k_objectName, kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_userEditorUseTemplate: kerio.waw.shared.k_methods.k_userEditorUseTemplate,
k_dialogContent: k_dialogContent,
k_formGeneral: k_formGeneral,
k_formRights: k_formRights,
k_formQuota: k_formQuota,
k_formPreferences: k_formPreferences,
k_dataOrigin: {},
k_requestCfg: {
k_method: 'post',
k_jsonRpc: {
method: 'Users.set',
params: {}
}
},
k_batchCfg: {
k_scope: k_dialog,
k_callback: k_dialog.k_saveDataCallback
}
});
k_formGeneral.k_addReferences({
k_dialog: k_dialog,
k_ids: [],
k_templateIds: []
});
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_data = k_params.k_selectionStatus.k_rows,
k_ids = [],
k_templateIds = [],
k_applyRestrictions = false,
k_selectedUsers,
k_userData,
k_i;
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); for (k_i = 0; k_i < k_data.length; k_i++) {
k_userData = k_data[k_i].k_data;
if (k_userData.useTemplate) {
k_templateIds.push(k_userData.id);
}
else {
k_ids.push(k_userData.id);
}
}
this.k_ids = k_ids;
this.k_templateIds = k_templateIds;
this.k_relatedGrid = k_params.k_relatedWidget;
k_selectedUsers = this.k_relatedGrid.k_checkSelectedUsers(k_params.k_selectionStatus);
k_applyRestrictions = k_selectedUsers.k_isCurrentUserSelected;
this.k_formGeneral.k_setDisabled(['k_enableUserContainer', 'k_domainTemplateContainer'], k_applyRestrictions);
this.k_formGeneral.k_setVisible(['k_currentUserNotice'], k_applyRestrictions);
this.k_formRights.k_setDisabledAll(k_applyRestrictions);
this.k_formGeneral.k_setDisabled(['k_description'], !kerio.waw.status.k_userList.k_isCurrentDomainLocal);
this.k_dataOrigin = this.k_getData();
};

k_kerioWidget.k_saveData = function() {
var
k_USER_TEMPLATE = kerio.waw.shared.k_CONSTANTS.k_USER_TEMPLATE,
k_cloneObject = kerio.lib.k_cloneObject,
k_isEmpty = kerio.lib.k_isEmpty,
k_requestCfg = this.k_requestCfg,
k_userIds = this.k_ids,
k_templateIds = this.k_templateIds,
k_requests = [],
k_multiData,
k_multiDataForTemplateUsers;
k_multiData = k_cloneObject(this.k_getData());
if (k_isEmpty(k_multiData) || kerio.waw.shared.k_methods.k_compare(k_multiData, this.k_dataOrigin, true, true)) {
this.k_hide();
return;
}
if (k_USER_TEMPLATE.k_NOT_USED === k_multiData.useTemplate) {
k_userIds = k_userIds.concat(k_templateIds);
k_templateIds = [];
}
if (k_USER_TEMPLATE.k_USED === k_multiData.useTemplate) {
k_multiData.useTemplate = true;
}
else if (k_USER_TEMPLATE.k_NOT_USED === k_multiData.useTemplate) {
k_multiData.useTemplate = false;
}
else {
delete k_multiData.useTemplate;
}
if (k_userIds.length) {
k_requestCfg.k_jsonRpc.params = {
userIds: k_userIds,
details: k_multiData,
domainId: kerio.waw.status.k_userList.k_currentDomainId
};
k_requests.push(k_cloneObject(k_requestCfg));
}
if (k_templateIds.length) {
k_multiDataForTemplateUsers = {};
k_USER_TEMPLATE.k_UPDATABLE_FIELDS.forEach(function(updatableField) {
if (k_multiData[updatableField] !== undefined) {
k_multiDataForTemplateUsers[updatableField] = k_multiData[updatableField];
}
});
if (Object.keys(k_multiDataForTemplateUsers).length) {
k_requestCfg.k_jsonRpc.params = {
userIds: k_templateIds,
details: k_multiDataForTemplateUsers,
domainId: kerio.waw.status.k_userList.k_currentDomainId
};
k_requests.push(k_cloneObject(k_requestCfg));
}
}
if (0 === k_requests.length) {
this.k_hide();
return;
}
kerio.waw.requests.k_sendBatch(k_requests, this.k_batchCfg);
};

k_kerioWidget.k_getData = function() {
var
k_multiData = {},
k_valueUnchanged = kerio.waw.shared.k_CONSTANTS.k_VALUE_UNCHANGED,
k_isEmpty = kerio.lib.k_isEmpty,
k_data, k_i, k_map,
k_quotaPeriods = ['k_daily', 'k_weekly', 'k_monthly'],
k_serverPeriods = {
'k_daily': 'daily',
'k_weekly': 'weekly',
'k_monthly': 'monthly'
},
k_period,
k_dataMap = {
k_formGeneral: {
k_domainTemplate: 'useTemplate',
k_isEnabled: 'localEnabled'
},
k_formQuota: {
k_blockTraffic: 'blockTraffic',
k_notifyUser: 'notifyUser'
}
};
k_data = this.k_formGeneral.k_getData();
k_map = k_dataMap.k_formGeneral;
for (k_i in k_data) {
if (k_map[k_i] && k_data[k_i] !== k_valueUnchanged) {
k_multiData[k_map[k_i]] = k_data[k_i];
}
}
if (k_valueUnchanged !== k_data.k_description) {
k_multiData.description = k_data.k_description;
}
if (!k_multiData.data) {
k_multiData.data = {};
}
k_data = this.k_formRights.k_getData();
k_multiData.data.rights = {};
for (k_i in k_data) {
if ('k_role' === k_i && k_data[k_i] !== k_valueUnchanged) {
switch (k_data[k_i]) {
case kerio.waw.shared.k_CONSTANTS.k_NONE:
k_multiData.data.rights.readConfig = false;
k_multiData.data.rights.writeConfig = false;
break;
case kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Auditor:
k_multiData.data.rights.readConfig = true;
k_multiData.data.rights.writeConfig = false;
break;
case kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_FullAdmin:
k_multiData.data.rights.readConfig = true;
k_multiData.data.rights.writeConfig = true;
break;
}
continue;
}if (k_data[k_i] !== k_valueUnchanged) {
k_multiData.data.rights[k_i] = k_data[k_i];
}
}
if (k_isEmpty(k_multiData.data.rights)) {
delete(k_multiData.data.rights);
}
k_data = this.k_formQuota.k_getData();
k_map = k_dataMap.k_formQuota;
k_multiData.data.quota = {};
for (k_i in k_data) {
if (k_data[k_i] !== k_valueUnchanged && k_map[k_i]) {
k_multiData.data.quota[k_map[k_i]] = k_data[k_i];
}
}
for (k_i = 0; k_i < k_quotaPeriods.length; k_i++) {
k_period = k_quotaPeriods[k_i];
if (k_data[k_period] !== k_valueUnchanged) {
k_multiData.data.quota[k_serverPeriods[k_period]] = {};
if (k_data[k_period] === false) {
k_multiData.data.quota[k_serverPeriods[k_period]] ={
enabled: false
};
continue;
}
k_multiData.data.quota[k_serverPeriods[k_period]] ={
enabled: k_data[k_period],
type: k_data[k_period + '_' + 'k_direction'],
limit: {
value: k_data[k_period + '_' + 'k_value'],
units: k_data[k_period + '_' + 'k_units']
}
};
}
}
if (k_isEmpty(k_multiData.data.quota)) {
delete(k_multiData.data.quota);
}
k_data = this.k_formPreferences.k_getData();
k_multiData.data.wwwFilter = {};
for (k_i in k_data) {
if ('language' === k_i && k_data[k_i] !== k_valueUnchanged) {
k_multiData.data[k_i] = k_data[k_i];
continue;
}if (k_data[k_i] !== k_valueUnchanged) {
k_multiData.data.wwwFilter[k_i] = k_data[k_i];
}
}
if (k_isEmpty(k_multiData.data.wwwFilter)) {
delete(k_multiData.data.wwwFilter);
}
if (k_isEmpty(k_multiData.data)) {
delete(k_multiData.data);
}
return k_multiData;
};

k_kerioWidget.k_saveDataCallback = function(k_response) {
if (k_response && !kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
return;
}
this.k_relatedGrid.k_reloadData();
this.k_hide();
kerio.waw.shared.k_methods.k_updateDataStore('k_selectUsers');
};

k_kerioWidget.k_resetOnClose = function() {
this.k_formGeneral.k_reset();
this.k_formRights.k_reset();
this.k_formQuota.k_reset();
this.k_formPreferences.k_reset();
this.k_dialogContent.k_setActiveTab('k_generalPage');
};
}};