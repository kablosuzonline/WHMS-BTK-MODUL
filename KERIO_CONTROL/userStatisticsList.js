
kerio.waw.ui.userStatisticsList = {

k_init: function(k_objectName) {
var
k_tr = kerio.lib.k_tr,
k_sharedMethods = kerio.waw.shared.k_methods,
k_isAuditor = k_sharedMethods.k_isAuditor(),
k_contextMenuCfg,
k_autoRefreshGui,
k_gridCfg,
k_grid;
if (!k_isAuditor) {
k_contextMenuCfg = {
k_items: [
{
k_id: 'k_viewUser',
k_caption: k_tr('View in Users', 'contextMenu'),
k_onClick: function(k_menu) {
var
k_grid = k_menu.k_relatedWidget,
k_domainsDataStore;
kerio.waw.shared.k_data.k_get('k_domains');
k_domainsDataStore = kerio.waw.shared.k_data.k_getStore('k_domains');
if (!k_domainsDataStore.k_isLoaded()) {
kerio.waw.shared.k_data.k_registerObserver(
k_domainsDataStore,
k_grid.k_viewUser,
k_grid
);
return;
}
k_grid.k_viewUser();
}
}
]
};
if (!kerio.lib.k_isMyKerio) {
k_contextMenuCfg.k_items.push({
k_id: 'k_viewStar',
k_caption: k_tr('View in Kerio Control Statistics', 'contextMenu'),
k_onClick: function(k_menu) {
var
k_STATISTIC_TYPES = kerio.waw.shared.k_CONSTANTS.UserStatisticType,
k_grid = k_menu.k_relatedWidget,
k_urlCfg = k_grid.k_starUrl,
k_selection = k_grid.k_selectionStatus,
k_rows = k_selection.k_rows,
k_selectedUser,
k_url;
if (1 !== k_selection.k_selectedRowsCount || !k_urlCfg) {
return;
}
k_selectedUser = k_rows[0].k_data;
switch (k_selectedUser.type) {
case k_STATISTIC_TYPES.UserStatisticAll:
k_url = 'index.html#summary_overall_all';
break;
case k_STATISTIC_TYPES.UserStatisticGuest:
k_url = 'index.html#individual_activity_-2';
break;
case k_STATISTIC_TYPES.UserStatisticOther:
k_url = 'index.html#individual_activity_0';
break;
default:
k_url = 'index.html#individual_activity_' + k_selectedUser.id;
}
window.open(k_urlCfg + k_url);
}
});
}
k_contextMenuCfg.k_items.push('-');
k_contextMenuCfg.k_items.push({
k_id: 'k_delete',
k_caption: k_tr('Delete User Traffic Counters', 'userStatisticsList'),

k_onClick: function(k_menu) {
var
k_grid = k_menu.k_relatedWidget,
k_selection = k_grid.k_selectionStatus,
k_rows = k_selection.k_rows,
k_i,
k_message;
if (0 >= k_selection.k_selectedRowsCount) {
return; }
k_message = k_grid.k_translations.k_deleteUserData;
for (k_i = 0; k_i < k_selection.k_selectedRowsCount; k_i++) {
if (k_grid.k_STATISTIC_TYPES.UserStatisticAll === k_rows[k_i].k_data.type) {
k_message = k_grid.k_translations.k_deleteAllData;
break;
}
}
k_grid.k_onDeactivate(); kerio.lib.k_confirm({
k_title: k_grid.k_translations.k_deleteCounters,
k_msg: k_message,
k_callback: k_grid.k_deleteCountersConfirm,
k_scope: k_grid
});
}
});
}
k_gridCfg = {
k_type: 'UserStatistics',
k_contextMenuCfg: k_contextMenuCfg,
k_columns: {
k_sorting: {
k_columnId: 'userName'
},
k_autoExpandColumn: false,
k_items: [
{ k_columnId: 'type',     k_isDataOnly: true },
kerio.waw.shared.k_DEFINITIONS.k_get('k_prepareTrafficStatisticsColumns'), { k_columnId: 'id',       k_isDataOnly: true },
{ k_columnId: 'userName', k_caption: k_tr('Username', 'common'),          k_width: 180,

k_renderer: function(k_value, k_data) {
var
k_STATISTIC_TYPES = this.k_STATISTIC_TYPES,
k_iconCls = '',
k_userName,
k_userData;
switch (k_data.type) {
case k_STATISTIC_TYPES.UserStatisticAll:
k_userName = this.k_translations.k_allUsers;
k_data.fullName = this.k_translations.k_allUsers;
break;
case k_STATISTIC_TYPES.UserStatisticGuest:
k_userName = this.k_translations.k_guestUsers;
k_data.fullName = this.k_translations.k_guestUsers;
break;
case k_STATISTIC_TYPES.UserStatisticOther:
k_userName = this.k_translations.k_notLoggedInUsers;
k_data.fullName = this.k_translations.k_notLoggedInUsers;
break;
default:k_userData = this.k_createReferencedUserName({
id: k_data.id,
name: k_value,
domainName: '' });
k_iconCls = k_userData.k_iconClass;
k_userName = k_userData.k_userName;
}
return {
k_data: k_userName,
k_iconCls: k_iconCls
};
}},
{ k_columnId: 'fullName', k_caption: k_tr('Full Name', 'common'),         k_width: 220 },
{ k_columnId: 'quota',    k_caption: k_tr('Quota', 'common'),             k_width: 100,

k_renderer: function(k_value, k_data) {
if (this.k_STATISTIC_TYPES.UserStatisticUser !== k_data.type) {
return {
k_data: ''
};
}
var
k_iconCls;
if (k_value < 75) {
k_iconCls = ''; } else if (k_value < 100) {
k_iconCls = ' yellow';
} else {
k_iconCls = ' red';
}
k_value += '%';
return {
k_data: k_value,
k_iconCls: 'dotCell' + k_iconCls
};
}}
].concat(kerio.waw.shared.k_DEFINITIONS.k_get('k_trafficStatisticsColumns'))
},k_toolbars: {
k_bottom: {
k_hasSharedMenu: !k_isAuditor,
k_type: 'k_userDefined',
k_items: ['->'],

k_update: function(k_sender) {
var
k_contextMenu = this.k_parentWidget.k_contextMenu,
k_selection = k_sender.k_selectionStatus,
k_selectedRowsCount = k_selection.k_selectedRowsCount,
k_USER_STATISTICS_TYPE = kerio.waw.shared.k_CONSTANTS.UserStatisticType.AddresseeUser,
k_rowData;
if (k_sender.k_isInstanceOf('K_Grid') && !k_sender.k_isAuditor) {
k_contextMenu.k_enableItem('k_delete', 0 !== k_selectedRowsCount);
if (1 === k_selectedRowsCount) {
k_rowData = k_selection.k_rows[0].k_data;
k_contextMenu.k_enableItem('k_viewUser', k_USER_STATISTICS_TYPE === k_rowData.type);
if (!kerio.lib.k_isMyKerio)
k_contextMenu.k_enableItem('k_viewStar', true);
}
else {
k_contextMenu.k_enableItem('k_viewUser', false);
if (!kerio.lib.k_isMyKerio)
k_contextMenu.k_enableItem('k_viewStar', false);
}
}
}
}
}, k_remoteData: {
k_root: 'list',
k_isAutoLoaded: false,
k_jsonRpc: {
method: 'UserStatistics.get'
}
},
k_onSetAutoRefreshInterval: k_sharedMethods.k_onSetAutoRefreshInterval
};k_grid = new kerio.waw.shared.k_widgets.K_AutorefreshGrid(k_objectName, k_gridCfg);
k_autoRefreshGui = k_sharedMethods.k_addRefreshCheckbox({
k_toolbar: k_grid.k_toolbars.k_bottom
});
k_grid.k_addReferences({
k_autoRefreshGui: k_autoRefreshGui,
k_createReferencedUserName: k_sharedMethods.k_createReferencedUserName,
k_STATISTIC_TYPES: kerio.waw.shared.k_CONSTANTS.UserStatisticType,
k_hostname: false,
k_translations: {
k_allUsers: k_tr('all users', 'userStatisticsList'),
k_unrecognizedUsers: k_tr('unrecognized users', 'userStatisticsList'),
k_notLoggedInUsers: k_tr('not logged in', 'userStatisticsList'),
k_guestUsers: k_tr('guest users', 'userStatisticsList'),
k_deleteCounters: k_tr('Delete User Traffic Counters', 'userStatisticsList'),
k_deleteAllData: k_tr('Traffic counters of all users will be reset. Do you really want to continue?', 'userStatisticsList'),
k_deleteUserData: k_tr('Do you really want to reset user traffic counters?', 'userStatisticsList')
},
k_preselectId: null,
k_starUrl: ''
});
k_autoRefreshGui.k_addReferences({
k_grid: k_grid,
k_ignoreOnChange: false    });
this.k_addControllers(k_grid);
return k_grid;
},
k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function() {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
this.k_preselectId = kerio.waw.status.k_currentScreen.k_getSwitchPageParam('k_userId');
this.k_forceRefresh = true;
this.k_loadData();
this.k_starUrl = kerio.waw.shared.k_DEFINITIONS.k_CONTROL_URL.k_getWebifaceUrl();
};

k_kerioWidget.k_loadData = function() {
if (this.k_preselectId) {
this.k_preselectRow.defer(500, this);
}
this.k_reloadData();
};
k_kerioWidget.k_preselectRow = function() {
var
k_row = this.k_findRow('id', this.k_preselectId);
this.k_selectRows(k_row);
this.k_preselectId = null;
};

k_kerioWidget.k_onActivate = function() {
var
k_autorefresh = this.k_getSavedAutoRefreshInterval();
this.k_handleAutorefresh(k_autorefresh, true, true);
};

k_kerioWidget.k_onDeactivate = function() {
this.k_initAutoRefreshTask(0);
};

k_kerioWidget.k_deleteCountersConfirm = function (k_response) {
if ('no' === k_response) {
this.k_onActivate(); return;
}
var
k_rows = this.k_selectionStatus.k_rows,
k_ids = [],
k_i;
for (k_i = 0; k_i < k_rows.length; k_i++) {
k_ids.push(k_rows[k_i].k_data.id);
}
this.k_deleteCounters(k_ids);
};
k_kerioWidget.k_deleteCounters = function (k_ids) {
kerio.lib.k_ajax.k_request(
{
k_jsonRpc: {
method: 'UserStatistics.remove',
params: {
ids: k_ids
}
},
k_callback: this.k_deleteCountersCallback,
k_scope: this
}
);
};
k_kerioWidget.k_deleteCountersCallback = function() {
this.k_reloadData();
this.k_onActivate(); };

k_kerioWidget.k_viewUser = function() {
var
k_data = this.k_selectionStatus.k_rows[0].k_data, k_userName = k_data.userName,
k_domainName = '';
if (-1 !== k_userName.indexOf("@")) {
k_domainName = k_userName.substr(k_userName.indexOf("@") + 1);
}
kerio.waw.shared.k_methods.k_goToUsers(k_domainName, k_data.id)
};
}};