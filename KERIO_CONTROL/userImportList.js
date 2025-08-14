
kerio.waw.ui.userImportList = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_grid, k_gridCfg,
k_dialog, k_dialogCfg;
k_gridCfg = {
k_className: 'userList',
k_isEnterMappedToDoubleClick: false, k_columns: {
k_sorting: false,
k_items: [
{k_columnId: 'userName',       k_caption:    k_tr('Username',    'common')  , k_width: 120,
k_renderer: kerio.waw.shared.k_methods.k_renderers.k_renderSimpleUserName,
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'selected'
}},
{k_columnId: 'fullName',       k_caption:    k_tr('Full Name',   'common')   , k_width: 100},
{k_columnId: 'description',    k_caption:    k_tr('Description', 'common')},
{k_columnId: 'selected',       k_isDataOnly: true}
]
},
k_localData: []
}; k_grid = new kerio.lib.K_Grid(k_localNamespace + 'grid', k_gridCfg);
k_dialogCfg = {
k_width: 500,
k_height: 400,
k_content: k_grid,
k_title: k_tr('Import User Accounts', 'userImportList'),
k_buttons: [
{
k_isDefault: true,
k_id: 'k_btnOk',
k_caption: k_tr('OK', 'common'),

k_onClick: function(k_toolbar) {
k_toolbar.k_dialog.k_importUsers();
},
k_mask: {
k_message: k_tr('Importing user accounts…', 'common')
}
},
{
k_isCancel: true,
k_caption: k_tr('Cancel', 'common')
}
]
}; k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_grid: k_grid
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
this.k_parentGrid               = k_params.k_parentGrid;
this.k_requestParams            = k_params.k_requestParams;
this.k_isActiveDirectoryServer  = k_params.k_isActiveDirectoryServer;
this.k_primaryDomainData        = k_params.k_primaryDomainData;
k_params.k_previousDialog.k_hide(); this.k_grid.k_setData(k_params.k_userList);
this.k_setChanged(true);
}; 
k_kerioWidget.k_importUsers = function(k_selectedOnly) {
var
k_requests = [],
k_primaryDomain = this.k_primaryDomainData,
k_gridData = this.k_grid.k_getData(),
k_usersToImport = [],
k_i, k_cnt, k_user;
k_selectedOnly = (false !== k_selectedOnly);
k_requests.push({
k_jsonRpc: {
method: 'Domains.set',
params: {
domainIds: [k_primaryDomain.id],
pattern: k_primaryDomain
}
}
});
k_requests.push({ k_jsonRpc: {
method: 'Domains.apply'
}
});
for (k_i = 0, k_cnt = k_gridData.length; k_i < k_cnt; k_i++) {
k_user = k_gridData[k_i];
if (k_selectedOnly && !k_user.selected) { continue;
}
delete k_user.selected;
delete k_user.id;
k_user.groups = [];          k_user.localEnabled = true;  k_usersToImport.push(k_user);
} if (!k_usersToImport.length) {
kerio.lib.k_confirm({
k_title: kerio.lib.k_tr('Import User Accounts', 'userImportList'),
k_msg:   kerio.lib.k_tr('You did not select any users for import.', 'userImportList')
+ '<br><br><b>'
+ kerio.lib.k_tr('Do you want to import all users from this domain?', 'userImportList')
+ '</b>',
k_callback: this.k_importUsersConfirm,
k_scope: this
});
return;
}
k_requests.push({
k_jsonRpc: {
method: 'Users.create',
params: {
domainId: kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE,
users: k_usersToImport
}
}
});
kerio.waw.requests.k_sendBatch(k_requests, {
k_mask: false,
k_callback: this.k_importUsersCallback,
k_scope: this
});
};

k_kerioWidget.k_importUsersConfirm = function(k_answer) {
if ('yes' === k_answer) {
this.k_importUsers(false); }
else {
kerio.waw.shared.k_methods.k_unmaskMainScreen(); }
};

k_kerioWidget.k_importUsersCallback = function() {
kerio.waw.shared.k_methods.k_updateDataStore('k_domains');
this.k_hide();
this.k_parentGrid.k_reloadData(); }; 
k_kerioWidget.k_grid.k_checkItems = function(k_check, k_selectedOnly) {
var
k_items,
k_i,
k_cnt = this.k_selectionStatus.k_selectedRowsCount;
k_check = (false !== k_check);
if (k_selectedOnly && 0 !== k_cnt) {
k_items = this.k_selectionStatus.k_rows;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_items[k_i].k_data.selected  = k_check;
} }
else {
k_items = this.k_getData();
for (k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_items[k_i].selected  = k_check;
} }
this.k_refresh();
};
} }; 