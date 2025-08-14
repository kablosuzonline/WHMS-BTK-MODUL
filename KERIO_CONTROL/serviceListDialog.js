

kerio.waw.ui.serviceListDialog = {
k_init: function(k_objectName, k_initParams) {
var
k_localNamespace = k_objectName + '_',
k_shared = kerio.waw.shared,
k_tr = kerio.lib.k_tr,
k_gridCfg, k_grid,
k_dialog;
k_gridCfg = {
k_settingsId: 'selectServiceList',
k_showApplyReset: false
};
k_grid = new k_shared.k_widgets.K_ServiceGrid(k_localNamespace + 'k_grid', k_gridCfg);
k_dialog = new kerio.lib.K_Dialog(k_objectName, {
k_width: 700,
k_height: 450,
k_content: k_grid,
k_title: k_tr('Services', 'bandwidthManagementTrafficEditor'),
k_buttons: [{
k_id: 'k_btnOk',
k_isDefault: true,
k_caption: k_tr('Apply', 'wlibButtons'),

k_onClick: function(k_toolbar, k_button) {
var
k_selectItemsDialog = k_toolbar.k_parentWidget.k_params.k_relatedWidget;
if (k_selectItemsDialog.k_parentGrid.k_requestClearEmbeddedDefinitions) {
k_selectItemsDialog.k_parentGrid.k_requestClearEmbeddedDefinitions();
}
kerio.waw.shared.k_methods.k_definitionApplyResetHandler(k_toolbar, k_button);
}
}, {
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'wlibButtons'),
k_isCancel: true,
k_onClick: k_shared.k_methods.k_definitionApplyResetHandler
}]
});
k_dialog.k_addReferences({
k_grid: k_grid,
k_manager: 'IpServices'
});
k_grid.k_addReferences({
k_onItemChange: function() {
this.k_reloadData();
}
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({
k_applyParams: function(k_params) {
this.k_params = k_params;
this.k_grid.k_reloadData();
},

k_resetOnClose: function() {
var
k_selectItemsDialog = this.k_params.k_relatedWidget;
this.k_grid.k_clearData();
k_selectItemsDialog.k_loadItems({});
k_selectItemsDialog.k_initSearchField();
}
});
}
}; 