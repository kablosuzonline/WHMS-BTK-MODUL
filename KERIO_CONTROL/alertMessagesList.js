
kerio.waw.ui.alertMessagesList = {

k_init: function(k_objectName) {
var
k_tr = kerio.lib.k_tr,
k_localNamespace = k_objectName + '_',
k_grid, k_gridCfg,
k_form, k_formCfg,
k_toolbarText, k_toolbarTextCfg,
k_layout, k_layoutCfg,
k_callbackDetailsVisible,
k_getContent,
k_getContentCallback;

k_callbackDetailsVisible = function() {
this.k_update(this.k_grid); };

k_getContent = function(k_id) {
var
k_requestCfg = this.k_grid.k_contentRequestCfg;
if (!k_id) { this.k_form.k_content.k_setValue(kerio.lib.k_tr('Select an alert to view its description', 'alertMessagesList'));
return;
}
if (!this.k_isDetailsVisible()) {
return; }
if (this.k_lastDetailsRequest) { kerio.lib.k_ajax.k_abort(this.k_lastDetailsRequest);
}
k_requestCfg.k_jsonRpc.params = {
id: k_id
};
this.k_lastDetailsRequest = kerio.lib.k_ajax.k_request(k_requestCfg);
}; 
k_getContentCallback = function(k_response, k_success) {
this.k_lastDetailsRequest = null;
if (k_success && k_response.k_isOk) {
this.k_form.k_content.k_setValue(k_response.k_decoded.content);
}
else {
this.k_grid.k_reloadData();
}
};
k_gridCfg = {
k_selectionMode: 'k_single',
k_pageSize: true,
k_loadMask: false,
k_columns: {
k_sorting: false,
k_items: [
{k_isDataOnly: true,   k_columnId: 'id'} ,
{k_caption: k_tr('Date', 'alertMessagesList'),        k_columnId: 'date',         k_width: 150} ,
{k_caption: k_tr('Alert', 'alertMessagesList'),       k_columnId: 'alertView',

k_renderer: function(k_value, k_data) {
var
k_htmlEncode = kerio.lib.k_htmlEncode,
k_text = k_htmlEncode(k_data.alert) + '<br>' + k_htmlEncode(k_data.details);
return {
k_data: k_text,
k_dataTooltip: kerio.lib.k_isIPadCompatible ? undefined : k_text, k_isSecure: true
};
}
},
{k_isDataOnly: true, k_columnId: 'alert'},
{k_isDataOnly: true, k_columnId: 'details'}
]
},
k_remoteData: {
k_isAutoLoaded: false,
k_root: 'list',
k_jsonRpc: {
method: 'Alerts.get'
}
},

k_onLoad: function(k_grid) {
if (0 === k_grid.k_getRowsCount()) {
k_grid.k_parentWidget.k_getContent(); }
} };
k_grid = new kerio.lib.K_Grid(k_localNamespace + 'grid', k_gridCfg);
k_toolbarTextCfg = {
k_isLabelHidden: true,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_template: '<a id="k_link">{k_text}</a>',
k_value: {
k_text: k_tr('Email notifications for particular alert types can be configured in %1.', 'alertMessagesList', {
k_args: [kerio.waw.shared.k_DEFINITIONS.k_get('k_MENU_TREE_NODES.accountingList')] }) },
k_onLinkClick: function() {
kerio.waw.status.k_currentScreen.k_gotoNode('accountingAndMonitoring', 'k_alertSettingsGrid');
}
};
k_toolbarText = new kerio.lib.K_DisplayField(k_localNamespace + 'k_toolbar' + '_' + 'k_info', k_toolbarTextCfg);
k_formCfg = {
k_items: [
{
k_type: 'k_display',
k_id: 'content',
k_className: 'alertMessageDetails selectable',
k_isSecure: true,
k_value: ''
}
]
};
k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_layoutCfg = {
k_className: 'screenAlertMessages',
k_toolbars: {
k_bottom: k_toolbarText
},
k_detailsVisibilityProperty: k_grid.k_id + '.' + 'showDetails',
k_isVertical: false,
k_isRefreshVisible: false,
k_mainPaneContent: k_grid,
k_detailsPaneContent: k_form,
k_callbackDetailsVisible: k_callbackDetailsVisible,

k_beforeApplyParams: function() {
this.k_grid.k_reloadData();
this.k_setDetailsVisible();
this.k_getContent();
},
k_iPad: {
k_onBeforeDetails: function(k_show) {
if (k_show && 0 === this.k_grid.k_selectionStatus.k_selectedRowsCount) {
return kerio.lib.k_tr('Please select an alert to show the details.', 'alertMessagesList');
}
return true;
}
}
};
k_layout = new kerio.waw.shared.k_widgets.K_SplittedLayout(k_objectName, k_layoutCfg);
this.k_addControllers(k_layout);
k_layout.k_addReferences({
k_grid: k_grid,
k_form: k_form,
k_lastDetailsRequest: null,
k_getContent: k_getContent,
k_getContentCallback: k_getContentCallback
});
k_grid.k_addReferences({
k_contentRequestCfg: {
k_jsonRpc: {
method: 'Alerts.getContent'
}, k_callback: k_layout.k_getContentCallback,
k_scope: k_layout
}
});
k_form.k_addReferences({
k_content: k_form.k_getItem('content')
});
kerio.lib.k_registerObserver(k_grid, k_layout, [k_grid.k_eventTypes.k_SELECTION_CHANGED]);
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'ProductInfo.accountUsage',
params: {
apiEntity: kerio.waw.shared.k_CONSTANTS.ApiEntity.AlertList
}
},
k_onError: function() {
return true;
},
k_requestOwner: null
});
return k_layout;
},
k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_update = function(k_sender) {
var k_selection;
if (k_sender && k_sender.k_isInstanceOf('K_Grid')) {
k_selection = k_sender.k_selectionStatus;
if (1 === k_selection.k_selectedRowsCount) {
this.k_getContent(k_selection.k_rows[0].k_data.id);
} } }; }};