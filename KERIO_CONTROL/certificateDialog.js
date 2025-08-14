kerio.waw.ui.certificateDialog = {
k_init: function(k_objectName, k_initParams) {
var
k_tr = kerio.lib.k_tr,
k_gridCfg,
k_grid,
k_dialog;
k_gridCfg = {
k_isAuditor: kerio.waw.shared.k_methods.k_isAuditor(),
k_managerName: 'Certificates',
k_supportAuthorities: true,
k_supportActiveCertificate: false,
k_supportRename: true,
k_searchBy: 'QUICKSEARCH',
k_supportPkcsFormat: true
};
k_grid = new kerio.waw.shared.k_widgets.K_CertificateGrid(k_objectName + '_' + 'k_grid', k_gridCfg);
k_dialog = new kerio.lib.K_Dialog(k_objectName, {
k_width: 700,
k_height: 450,
k_content: k_grid,
k_title: k_tr('Certificates', 'certificateDialog'),
k_buttons: [
{
k_id: 'k_btnOk',
k_isDefault: true,
k_caption: k_tr('Apply', 'wlibButtons'),
k_onClick: function() {
var k_dialog = this.k_dialog;
k_dialog.k_clickOnApplyFlag = true;
k_dialog.k_onApplyResetHandler.apply(null, arguments);
}
},
{
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'wlibButtons'),
k_isCancel: true,
k_onClick: k_initParams.k_onApplyResetHandler || Ext.emptyFn
}
]
});
k_dialog.k_addReferences({
k_grid: k_grid,
k_manager: 'Certificates',
k_onApplyResetHandler: k_initParams.k_onApplyResetHandler || Ext.emptyFn,
k_clickOnApplyFlag: false
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
this.k_params = k_params;
this.k_grid.k_applyParams();
};

k_kerioWidget.k_updateSelect = function() {
var
k_params = this.k_params,
k_WEB_CONSTANTS = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_relatedSelectCfg = k_params.k_relatedSelectCfg,
k_fieldValue = k_relatedSelectCfg.k_fieldValue,
k_fieldDisplay = k_relatedSelectCfg.k_fieldDisplay,
k_gridData = this.k_grid.k_getData(),
k_data = {},
k_selectData = [],
k_allowedCertificates = [
k_WEB_CONSTANTS.kerio_web_ActiveCertificate,
k_WEB_CONSTANTS.kerio_web_InactiveCertificate
],
k_item,
k_row,
k_cnt,
k_i;
for (k_i = 0, k_cnt = k_gridData.length; k_i < k_cnt; k_i++) {
k_row = k_gridData[k_i];
if (-1 === k_allowedCertificates.indexOf(k_row.type)) {
continue;
}
if (!k_data[k_row.groupId]) {
k_data[k_row.groupId] = k_row.groupName;
k_item = {};
k_item[k_fieldValue] = k_row.id;
k_item[k_fieldDisplay] = k_row.name;
k_selectData.push(k_item);
}
}
k_params.k_relatedWidget.k_updateRelatedFields(k_selectData);
};

k_kerioWidget.k_resetOnClose = function() {
if(this.k_clickOnApplyFlag) {
this.k_clickOnApplyFlag = false;
this.k_updateSelect();
}
};
}
};
