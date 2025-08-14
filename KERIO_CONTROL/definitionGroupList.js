

kerio.waw.ui.definitionGroupList = {

k_init: function(k_objectName) {
var
k_dialogSourceName,
k_dialogAdd,
k_dialogEdit,
k_dialogView,
k_widgetType,
k_gridCfg, k_grid,
k_onApplyResetHandler,
k_engineManager,
k_dataStoreId,
k_relatedDataStoreId;
switch (k_objectName) {
case 'urlGroupList':
k_widgetType = 'k_urlGroupType';
k_dialogSourceName = 'urlGroupEditor';
k_dialogAdd = 'urlGroupAdd';
k_dialogEdit = 'urlGroupEdit';
k_dialogView = 'urlGroupView';
break;
case 'addressGroupList':
k_widgetType = 'k_ipAddressType';
k_dialogSourceName = 'ipAddressGroupEditor';
k_dialogAdd = 'ipAddressGroupAdd';
k_dialogEdit = 'ipAddressGroupEdit';
k_dialogView = 'ipAddressGroupEditorView';
break;
case 'timeRangeList':
k_widgetType = 'k_timeRangeType';
k_dialogSourceName = 'timeRangeEditor';
k_dialogAdd = 'timeRangeAdd';
k_dialogEdit = 'timeRangeEdit';
k_dialogView = 'timeRangeEditorView';
break;
}
k_onApplyResetHandler = function(k_toolbar, k_button) {
var
k_grid = this.k_getMainWidget(),
k_requestParams = k_grid.k_applyResetRequest,
k_method = ('k_btnApply' === k_button.k_name ? 'apply' : 'reset');
k_requestParams.k_jsonRpc.method = k_grid.k_engineManager + '.' + k_method;
kerio.waw.requests.k_send(k_requestParams);
kerio.waw.shared.k_data.k_get(k_grid.k_dataStoreId, true);
return false;
};
k_gridCfg = {
k_pageSize: 500,
k_widgetType: k_widgetType,
k_isReadOnly: kerio.waw.shared.k_methods.k_isAuditor(),
k_hasSharedItems: true,
k_dialogs: {
k_sourceName: k_dialogSourceName,
k_objectName: {
k_btnAdd: k_dialogAdd,
k_btnEdit: k_dialogEdit,
k_btnView: k_dialogView
},

k_onBeforeShow: function(k_toolbar, k_button) {
var
k_dialogs = k_toolbar.k_dialogs,
k_isEditMode = ('k_btnEdit' === k_button.k_name || 'k_btnView' === k_button.k_name),
k_dataStore = kerio.waw.shared.k_data.k_getStore(this.k_dataStoreId),
k_groupData;
if (k_dataStore && k_dataStore.k_isLoaded()) {
k_groupData = k_dataStore.k_getData();
}
else {
k_groupData = kerio.waw.shared.k_methods.k_getGroupList(this);
}
k_dialogs.k_additionalParams = {
k_defaultGroup: kerio.waw.shared.k_methods.k_getDefaultGroup(this),
k_groupList: k_groupData
};
if (!k_isEditMode) {
return;
}
k_dialogs.k_additionalParams.k_data = this.k_selectionStatus.k_rows[0].k_data;
}
},
k_handlers: {
k_onApply: k_onApplyResetHandler,
k_onReset: k_onApplyResetHandler
},
k_allowFiltering: true
};
k_grid = new kerio.adm.k_widgets.K_DefinitionGrid(k_objectName, k_gridCfg);
k_grid.k_toolbars.k_top.k_setReadOnly(false);
this.k_addControllers(k_grid);
k_engineManager = k_grid.k_getServerObjectName();
switch (k_engineManager) {
case 'UrlGroups':
k_dataStoreId = 'k_urlAllGroups';
k_relatedDataStoreId = 'k_urlGroups';
break;
case 'TimeRanges':
k_dataStoreId = 'k_timeRangesAllGroups';
k_relatedDataStoreId = 'k_timeRanges';
break;
case 'IpAddressGroups':
k_dataStoreId = 'k_ipAddressAllGroups';
k_relatedDataStoreId = 'k_ipAddressGroups';
break;
}
k_grid.k_addReferences({
k_applyResetRequest: {
k_jsonRpc: {
method: null
},
k_callback: k_grid.k_applyResetCallback,
k_scope: k_grid
},
k_engineManager: k_engineManager,
k_dataStoreId: k_dataStoreId,
k_relatedDataStoreId: k_relatedDataStoreId,
k_dataGroup: undefined
});
return k_grid;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function () {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
this.k_reloadData();
kerio.waw.shared.k_data.k_get(this.k_dataStoreId, true);
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_dialogs: ['timeRangeEditor', 'ipAddressGroupEditor', 'urlGroupEditor'] });
};
k_kerioWidget.k_applyResetCallback = function(k_response){
kerio.waw.shared.k_methods.k_unmaskMainScreen(this); if (!kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
kerio.adm.k_framework.k_enableApplyReset(false); this.k_reloadData(); return;
}
kerio.waw.shared.k_data.k_get(this.k_dataStoreId, true);
kerio.waw.shared.k_data.k_get(this.k_relatedDataStoreId, true);
kerio.adm.k_framework.k_enableApplyReset(false);
if (kerio.waw.shared.k_methods.k_processUserClick()) {
this.k_reloadData();
}
};
} }; 