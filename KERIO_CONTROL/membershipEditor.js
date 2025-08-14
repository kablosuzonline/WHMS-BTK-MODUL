
kerio.waw.ui.membershipEditor = {

k_init: function(k_objectName) {
var
k_dialogCfg,
k_dialog,
k_localNamespace,
k_membersFormCfg,
k_membershipWidget,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_isGroupOnly = 'k_gatherGroupsEditor' === k_objectName,
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS;
if (kerio.waw.status.k_userList === undefined) {
kerio.waw.status.k_userList = k_WAW_DEFINITIONS.k_get('k_userListStatus');
}
k_localNamespace = k_objectName + '_';
k_membersFormCfg = {
k_objectName: k_objectName,
k_type: k_isGroupOnly ? 'k_DOMAIN_GROUP' : 'k_DOMAIN_USER_GROUP'
};
k_membershipWidget = new kerio.waw.shared.k_widgets.K_AddMembershipWidget(k_localNamespace + 'members',k_membersFormCfg);
k_dialogCfg = {
k_width: 450,
k_height: 400,
k_title: k_tr('Select Items', 'common'),
k_isReadOnly: k_isAuditor,
k_content: k_membershipWidget,
k_defaultItem: null,

k_onOkClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData.call(k_toolbar.k_dialog);
} };k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialogCfg.k_hasHelpIcon = false;
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences(
{
k_relatedWidget: {},
k_dataStore: {},
k_callback: null,
k_membershipWidget: k_membershipWidget
}
);this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_data = k_params.k_data;
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_data: ['k_domains', 'k_users', 'k_groups'],
k_dialogs: ['selectItems']
});
this.k_dataStore = k_data;
this.k_relatedWidget = k_params.k_relatedWidget;
this.k_callback = k_params.k_callback;
this.k_membershipWidget.k_addDomainMembers(this.k_membershipWidget.k_getMemberIds(k_data), k_data);
this.k_membershipWidget.k_startTracing();
};
k_kerioWidget.k_sendData = function() {
var
k_members = this.k_membershipWidget.k_getMembers();
this.k_callback.call(this.k_relatedWidget, k_members);
this.k_hide();
};
k_kerioWidget.k_resetOnClose = function() {
this.k_membershipWidget.k_stopTracing();
this.k_membershipWidget.k_clearData();
}; }}; 