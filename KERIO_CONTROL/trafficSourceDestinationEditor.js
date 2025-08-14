
kerio.waw.ui.trafficSourceDestinationEditor = {

k_init: function(k_objectName) {
var
k_isSource = ('trafficSourceEditor' === k_objectName),
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_grid,
k_dialog, k_dialogCfg;
k_grid = new kerio.waw.shared.k_widgets.K_TrafficSourceDestinationGrid(k_objectName, { k_isSource: k_isSource });
k_dialogCfg = {
k_title: k_isSource ? k_tr('Traffic Rule - Source', 'trafficSourceDestinationEditor') : k_tr('Traffic Rule - Destination', 'trafficSourceDestinationEditor'),
k_content: k_grid,
k_onOkClick: this.k_saveData,
k_className: 'trafficRuleSourceDestination',
k_isResizable: false,
k_width: 569,
k_height: 500,
k_defaultItem: null
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_isSource: k_isSource,
k_grid: k_grid,
k_parentGrid: null,
k_dataStore: {}
});
k_grid.k_addReferences({
k_isSource: k_isSource,
k_dialog: k_dialog,
k_embeddedDefinitionsNeedUpdate: false,
k_requestClearEmbeddedDefinitions: null,
k_updateEmbeddedDefinitions: null,
k_updateEmbeddedIpAddressGroups: null
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({
k_applyParams: this.k_applyParams,
k_resetOnClose: this.k_resetOnClose
});
},

k_applyParams: function(k_params) {
var
k_types = kerio.waw.shared.k_CONSTANTS.TrafficEntityType,
k_typesNumber = kerio.waw.shared.k_CONSTANTS.k_TRAFFIC_ENTITY_TYPES_NUMBER,
k_data = k_params.k_data,
k_columns = [],
k_relatedGrid = k_params.k_relatedGrid,
k_grid = this.k_grid,
k_entity, k_type, k_typeNumber,
k_i, k_cnt;
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_data: ['k_ipAddressGroups', 'k_outgoingInterfaces', 'k_vpnTunnels', 'k_domains', 'k_users', 'k_groups'],
k_dialogs: ['selectItems', 'trafficHostEditor']
});
k_data = this.k_isSource ? k_data.sourceList : k_data.destinationList;
this.k_dataStore = k_params.k_data;
this.k_parentGrid = k_relatedGrid;
this.k_relatedGrid = k_relatedGrid; k_grid.k_requestClearEmbeddedDefinitions = k_relatedGrid.k_requestClearEmbeddedDefinitions;
k_grid.k_updateEmbeddedDefinitions = k_relatedGrid.k_updateEmbeddedDefinitions;
k_grid.k_updateEmbeddedIpAddressGroups = k_relatedGrid.k_updateEmbeddedIpAddressGroups;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_entity = k_data[k_i];
if (k_entity.k_isNothing) {
k_type = k_types.k_INVALID;
k_typeNumber = k_typesNumber.k_INVALID;
}
else {
k_type = k_entity.type;
switch (k_type) {
case k_types.TrafficEntityNetwork:
case k_types.TrafficEntityRange:
case k_types.k_FIREWALL:
case k_types.TrafficEntityPrefix:
k_type = k_types.TrafficEntityHost;
k_typeNumber = k_typesNumber.k_HOST;
break;
case k_types.TrafficEntityHost:
k_typeNumber = k_typesNumber.k_HOST;
break;
case k_types.TrafficEntityAddressGroup:
k_typeNumber = k_typesNumber.k_ADDRESS_GROUP;
break;
case k_types.TrafficEntityInterface:
k_typeNumber = k_typesNumber.k_INTERFACE;
break;
case k_types.TrafficEntityVpn:
k_typeNumber = k_typesNumber.k_VPN;
break;
case k_types.TrafficEntityUsers:
k_typeNumber = k_typesNumber.k_USERS;
break;
default:
break; }
}
k_columns.push({
k_type: k_type,
typeNumber: k_typeNumber,
item: k_entity
});
}
k_grid.k_setData(k_columns);
k_grid.k_startTracing();
}, 
k_saveData: function() {
var
k_dialog = this.k_parentWidget, k_grid = k_dialog.k_grid,
k_data = k_grid.k_getDataForSaving(),
k_refreshGrid = false,
k_isNothing = 1 === k_data.length && k_data[0].item.k_isNothing,
k_dialogType = (k_dialog.k_isSource) ? 'source' : 'destination',
k_dataStore = kerio.lib.k_cloneObject(k_dialog.k_dataStore[k_dialogType]),
k_cellData = {};
k_dataStore.firewall = false;
k_dataStore.entities = [];
if (!k_isNothing) {
k_dataStore = k_data;
k_refreshGrid = true;
k_cellData[k_dialogType] = k_dataStore;
k_dialog.k_parentGrid.k_updateRow(k_cellData);
if (k_refreshGrid) {
k_dialog.k_parentGrid.k_updateRowStatus(k_dialog.k_dataStore); kerio.adm.k_framework.k_enableApplyReset();
k_dialog.k_parentGrid.k_updateRowStatus(true); k_dialog.k_parentGrid.k_updateRow(k_dialog.k_dataStore[k_dialogType]); }
}
k_dialog.k_hide();
}, 
k_resetOnClose: function() {
this.k_grid.k_stopTracing();
this.k_grid.k_setData([]);
}
}; 