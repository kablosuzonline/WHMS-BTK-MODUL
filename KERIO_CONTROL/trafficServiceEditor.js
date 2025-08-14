
kerio.waw.ui.trafficServiceEditor = {

k_init: function(k_objectName) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_grid,
k_dialogCfg,
k_dialog,
k_localNamespace;
k_localNamespace = k_objectName + '_';
k_grid = new kerio.waw.shared.k_widgets.K_TrafficServiceGrid(k_localNamespace + 'serviceGrid', {});
k_dialogCfg = {
k_width: 400,
k_height: 350,
k_title: k_tr('Traffic Rule - Service/Port', 'trafficRuleEditor'),
k_content: k_grid,
k_defaultItem: null,

k_onOkClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData();
}
};
k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_grid: k_grid,
k_relatedGrid: {},
k_dataStore: {},
k_isNothing: false
});
k_grid.k_addReferences({
k_dialog: k_dialog,
k_embeddedDefinitionsNeedUpdate: false,
k_requestClearEmbeddedDefinitions: null,
k_updateEmbeddedDefinitions: null,
k_updateEmbeddedServices: null
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
var
k_relatedGrid = k_params.k_relatedGrid,
k_grid = this.k_grid,
k_data;
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_data: ['k_services'],
k_dialogs: ['selectItems', 'trafficPortEditor']
});
k_data = k_params.k_data.service;
this.k_dataStore = k_params.k_data;
this.k_isNothing = (kerio.waw.shared.k_CONSTANTS.RuleConditionType.RuleInvalidCondition === k_data.type);
this.k_relatedGrid = k_relatedGrid;
k_grid.k_requestClearEmbeddedDefinitions = k_relatedGrid.k_requestClearEmbeddedDefinitions;
k_grid.k_updateEmbeddedDefinitions = k_relatedGrid.k_updateEmbeddedDefinitions;
k_grid.k_updateEmbeddedServices = k_relatedGrid.k_updateEmbeddedServices;
k_grid.k_renderServiceItem = k_relatedGrid.k_renderServiceItem;
if (!this.k_isNothing) {
k_grid.k_setData(k_data.entries);
} else {
k_grid.k_setData([{sortHash: 'k_nobody'}]);
}
k_grid.k_startTracing();
};

k_kerioWidget.k_sendData = function() {
var
k_data = this.k_grid.k_getDataForSaving(),
k_cellData = {};
if (!this.k_isNothing) {
k_cellData = {service: k_data};
this.k_relatedGrid.k_updateRow(k_cellData); this.k_dataStore.service = k_cellData.service;
this.k_relatedGrid.k_updateRowStatus(this.k_dataStore); this.k_relatedGrid.k_updateRow(k_cellData); }this.k_hide();
kerio.adm.k_framework.k_enableApplyReset();
};

k_kerioWidget.k_resetOnClose = function() {
this.k_grid.k_stopTracing();
this.k_grid.k_setData([]);
};
}
}; 