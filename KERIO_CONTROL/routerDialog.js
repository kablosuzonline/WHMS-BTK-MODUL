
kerio.waw.ui.routerDialog = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_dialog, k_dialogCfg,
k_routesGrid, k_routesGridCfg;
k_routesGridCfg = {
k_localNamespace: k_localNamespace,
k_isAuditor: k_isAuditor,
k_simpleTextAboveGrid: k_tr('All VPN clients are automatically configured with routes to local networks. Here you may define additional custom routes.', 'routerDialog')
};
k_routesGrid = new kerio.waw.shared.k_widgets.K_CustomRoutesGrid(k_routesGridCfg);
k_dialogCfg = {
k_height: 300,
k_title: k_tr('Custom Routes', 'routerDialog'),
k_content: k_routesGrid,
k_defaultItem: null,

k_onOkClick: function(k_toolbar){
k_toolbar.k_dialog.k_saveData();
}
};
k_dialog = new k_lib.K_Dialog(k_objectName, kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_isAuditor: k_isAuditor,
k_routesGrid: k_routesGrid,
k_dataStore: null
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
this.k_dataStore = k_params.k_dataStore;
this.k_routesGrid.k_setData(k_params.k_dataStore.server.routes);
this.k_routesGrid.k_startTracing();
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_dialogs: ['routeEditor']
});
};

k_kerioWidget.k_saveData = function() {
this.k_dataStore.server.routes = this.k_routesGrid.k_getData();
this.k_hide();
};

k_kerioWidget.k_resetOnClose = function() {
this.k_routesGrid.k_stopTracing();
this.k_routesGrid.k_clearData();
};
}
}; 