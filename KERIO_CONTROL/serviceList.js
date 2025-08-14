

kerio.waw.ui.serviceList = {
k_init: function(k_objectName) {
var
k_shared = kerio.waw.shared,
k_tr = kerio.lib.k_tr,
k_gridCfg, k_grid;
k_gridCfg = {
k_settingsId: 'serviceList',
k_filters: {
k_search: {
k_caption: k_tr('Filter:', 'wlibLogs'),
k_searchBy: ['QUICKSEARCH']
},
k_combining: k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Or
}
};
k_grid = new k_shared.k_widgets.K_ServiceGrid(k_objectName, k_gridCfg);
this.k_addControllers(k_grid);
return k_grid;
},

k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_applyParams: function() {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
kerio.waw.shared.k_methods.k_maskMainScreen();
this.k_reloadData();
},

k_onItemChange: function() {
this.k_reloadData();
kerio.adm.k_framework.k_enableApplyReset();
}
});
}
}; 