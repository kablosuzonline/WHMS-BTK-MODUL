

kerio.waw.ui.userGroupEditor = {

k_init: function(k_objectName) {
var k_localNamespace = k_objectName + '_';
var k_WAW_METHODS = kerio.waw.shared.k_methods;
var k_lib = kerio.lib;
var k_tr = k_lib.k_tr;
var k_widgets = kerio.waw.shared.k_widgets;
var k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor();
var k_isGroupAdd = (kerio.waw.shared.k_DEFINITIONS.k_userListIds.k_userGroupAdd === k_objectName);
var k_generalFormCfg = {
k_items: [{
k_type: 'k_container',
k_labelWidth: 90,
k_width: '100%',
k_items: [
{
k_id: 'id',
k_isHidden: true
},
{
k_caption: k_tr('Name:', 'common'),
k_id: 'name',
k_isDisabled: !k_isGroupAdd && !k_isAuditor,
k_isReadOnly: k_isAuditor,
k_maxLength: 127,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isUserGroupName'
}
},
{
k_caption: k_tr('Description:', 'common'),
k_isReadOnly: k_isAuditor,
k_id: 'description',
k_maxLength: 255,
k_checkByteLength: true
}
]
}]
};var k_membersFormCfg = {
k_objectName: k_objectName,
k_type: 'k_LOCAL_USER',
k_isHeader: true
};
var k_generalForm = new k_lib.K_Form(k_localNamespace + 'k_general'  , k_generalFormCfg);
var k_membersForm = new k_widgets.K_AddMembershipWidget(k_localNamespace + 'members', k_membersFormCfg);
var k_rightsForm  = new k_widgets.K_TabRights(k_localNamespace + 'k_rights', { k_isAuditor: k_isAuditor });
var k_dialogContentCfg = {
k_items: [
{
k_content: k_generalForm,
k_caption: k_tr('General', 'common'),
k_id: 'k_generalPage'
},
{
k_content: k_membersForm,
k_caption: k_tr('Members', 'userGroupEditor'),
k_id: 'k_membersPage'
},
{
k_content: k_rightsForm,
k_caption: k_tr('Rights', 'common'),
k_id: 'k_rightsPage'
}
]
};
var k_dialogContent;
k_dialogContent = new k_lib.K_TabPage(k_localNamespace + 'k_tabs'    , k_dialogContentCfg);
var k_dialogWidth = k_lib.k_languageDependentValue(
{	k_default: 430,
hu: 450,
ru: 450
});
var k_dialogHeight = k_lib.k_languageDependentValue(
{	k_default: 435,
hu: 470,
ru: 450
});
var k_dialogCfg = {
k_width: k_dialogWidth,
k_minWidth: k_dialogWidth,
k_height: k_dialogHeight,
k_minHeight: k_dialogHeight,
k_title: (k_isGroupAdd)
? k_tr('Add Group', 'userGroupEditor')
: (k_isAuditor)
? k_tr('View Group', 'userGroupEditor')
: k_tr('Edit Group', 'userGroupEditor'),
k_content: k_dialogContent,
k_buttons: [
{	k_isDefault: true,
k_id: 'k_dialogBtnOK',
k_caption: k_tr('OK', 'common'),
k_isHidden: k_isAuditor,
k_mask: {
k_message: k_tr('Saving…', 'common')
},

k_onClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData();
}
},
{	k_isCancel: true,
k_id: 'k_dialogBtnCancel',
k_caption: (k_isAuditor)
? k_tr('Close', 'common')
: k_tr('Cancel', 'common')
}
]
};
var k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
var k_forms = k_WAW_METHODS.k_extractObjectValues(k_dialogContentCfg.k_items, 'k_content', 'k_widget');
k_dialog.k_forms = new kerio.lib.K_FormManager(k_localNamespace + 'k_formManager', k_forms);
k_dialog.k_formIds = k_WAW_METHODS.k_extractObjectValues(k_dialogContentCfg.k_items, 'k_id', 'string');
this.k_addControllers(k_dialog);
k_dialog.k_addReferences(
{	k_isAuditor: k_isAuditor,
k_isGroupAdd: k_isGroupAdd,
k_dialogContent: k_dialogContent,
k_generalForm: k_generalForm,
k_membersForm: k_membersForm,
k_rightsForm: k_rightsForm,
k_relatedGrid: {},
k_domainId: '',
k_requestCfg: {
k_jsonRpc: {
method: 'UserGroups' + '.' + (k_isGroupAdd ? 'create' : 'set'),
params: ''
},
k_scope: k_dialog,
k_callback: k_dialog.k_sendDataCallback
}}
);k_generalForm.k_addReferences(
{	k_inputGroupName: k_generalForm.k_getItem('name'),
k_dialog: k_dialog
}
);k_membersForm.k_addReferences(
{k_dialog: k_dialog}
);k_rightsForm.k_addReferences(
{k_dialog: k_dialog}
);return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_generalForm = this.k_generalForm,
k_membersForm = this.k_membersForm,
k_rightsForm = this.k_rightsForm,
k_domainId,
k_data;
this.k_relatedGrid = k_params.k_relatedWidget;
this.k_domainId = kerio.waw.status.k_userList.k_currentDomainId;
k_domainId = this.k_domainId;
this.k_dialogContent.k_setActiveTab('k_generalPage');
if (this.k_isGroupAdd) {
k_generalForm.k_focus('name');
k_membersForm.k_setMembers();
k_membersForm.k_startTracing();
return;
}k_data = k_params.k_data;
k_generalForm.k_setDisabled(['description'], !kerio.waw.status.k_userList.k_isCurrentDomainLocal);
k_generalForm.k_setData({id: k_data.id, name: k_data.name, description: k_data.description}, true);
k_membersForm.k_setMembers(k_data.members, k_domainId);
k_membersForm.k_startTracing();
k_rightsForm.k_setRightsData(k_data.rights);
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_data: ['k_users'],
k_dialogs: ['selectItems']
});
}; 
k_kerioWidget.k_resetOnClose = function() {
this.k_generalForm.k_reset();
this.k_membersForm.k_stopTracing();
this.k_rightsForm.k_reset();
};

k_kerioWidget.k_sendData = function() {
var
k_dialog = this,
k_generalForm = k_dialog.k_generalForm,
k_membersForm = k_dialog.k_membersForm,
k_rightsForm = k_dialog.k_rightsForm,
k_domainId = this.k_domainId,
k_generalFormData = k_generalForm.k_getData(true),
k_data = {
name: k_generalFormData.name,
description: k_generalFormData.description
},
k_requestCfg = k_dialog.k_requestCfg;
k_data.rights = k_rightsForm.k_getRightsData();
k_data.members = k_membersForm.k_getMembers();
if (k_dialog.k_isGroupAdd) {
k_data = {
"groups": [k_data],
"domainId": k_domainId
};
} else {
k_data = {
"groupIds": [k_generalFormData.id],
"details": k_data,
"domainId": k_domainId
};
}
k_requestCfg.k_jsonRpc.params = k_data;
kerio.waw.requests.k_send(k_requestCfg);
}; 
k_kerioWidget.k_sendDataCallback = function(k_response) {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
if (!kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
return;
}
this.k_relatedGrid.k_reloadData();
this.k_hide();
kerio.waw.shared.k_methods.k_updateDataStore('k_groups', {k_domainId: kerio.waw.status.k_userList.k_currentDomainId});
};
} }; 