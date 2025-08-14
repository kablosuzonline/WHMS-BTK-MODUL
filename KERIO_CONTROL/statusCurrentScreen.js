
kerio.waw.status.k_currentScreen = kerio.waw.status.k_currentScreen || {};
Ext.apply(kerio.waw.status.k_currentScreen, {

k_isContentChanged: function() {
return kerio.adm.k_framework.k_isScreenChanged();
}, 

k_showContentChangedAlert: function(k_callback, k_scope) {
var
k_tr = kerio.lib.k_tr;
kerio.lib.k_alert({
k_title: k_tr('Notice', 'common'),
k_msg: k_tr('You have modified data in this section.', 'common')
+ '<br>'
+ k_tr('Please click on the Apply button to save the changes first.', 'common'),
k_callback: k_callback,
k_scope: k_scope
});
},

k_gotoNode: function(k_nodeId, k_tabId){
this.k_switchPage(k_nodeId, {k_tabId: k_tabId});
},
_k_switchPageParams: {},

k_switchPage: function(k_nodeId, k_params) {
var
k_menuTree = kerio.adm.k_framework._k_mainLayout.k_menuTree,
k_menuTab;
if (k_params && 'object' === typeof k_params) {
kerio.waw.shared.k_methods.k_mergeObjects(k_params, this._k_switchPageParams);
}
k_menuTab = k_menuTree._k_getTab(k_menuTree._k_tabIndex);
k_menuTree._k_lastTab = k_menuTab;
k_menuTree._k_lastNode = k_menuTab.getSelectionModel().getSelectedNode();
kerio.adm.k_framework._k_mainLayout.k_menuTree.k_selectNode(k_nodeId);
return true;
},

k_getSwitchPageParam: function(k_paramId){
var
k_return;
if (this._k_switchPageParams) {
k_return = this._k_switchPageParams[k_paramId];
delete this._k_switchPageParams[k_paramId];
return k_return;
}
return undefined;
},

k_gotoTab: function(k_tabPage, k_defaultTab) {
var k_newTabId = this.k_getSwitchPageParam('k_tabId');
if (k_newTabId) {
if (k_tabPage.k_items.hasOwnProperty(k_tabPage._k_getInternalId(k_newTabId))) {
k_tabPage.k_setActiveTab(k_newTabId);
return;
}
kerio.lib.k_todo('statusCurrentScreen - k_gotoTab - Trying to swich to undefined default tab ' + k_newTabId + ' in tabPage ' + k_tabPage.k_id);
}
if (k_defaultTab && k_tabPage.k_items.hasOwnProperty(k_tabPage._k_getInternalId(k_defaultTab))) {
k_tabPage.k_setActiveTab(k_defaultTab);
return;
}
kerio.lib.k_reportError('Internal error: Cannot switch to undefined default tab ' + k_defaultTab + ' in tabPage ' + k_tabPage.k_id, 'statusCurrentScreen', 'k_gotoTab');
}
});