
kerio.waw.ui.bandwidthManagementDscpEditor = {

k_init: function(k_objectName) {
var
k_shared = kerio.waw.shared,
k_DEFINITIONS = k_shared.k_DEFINITIONS,
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_formCfg, k_form,
k_dialogCfg, k_dialog;
k_formCfg = {
k_labelWidth: 150,
k_items: [k_DEFINITIONS.k_get('k_dscpField', {k_id: 'k_dscp', k_isDisabled: false})]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 410,
k_height: 150,
k_title: k_tr('Add QoS DSCP', 'bandwidthManagementDscpEditor'),
k_content: k_form,
k_defaultItem: null,

k_onOkClick: function() {
var
k_dialog = this.k_parentWidget,
k_parentGrid = k_dialog.k_relatedGrid;
if (k_dialog.k_preselectValue) {
k_parentGrid.k_datastore.k_groups.BMConditionDscp.k_removeByValue(k_dialog.k_preselectValue);
}
k_parentGrid.k_fillDataFromRuleDataStore(
kerio.waw.shared.k_DEFINITIONS.k_get('k_bandwidthTrafficDataTemplate', {
type: kerio.waw.shared.k_CONSTANTS.BMConditionType.BMConditionDscp,
dscp: k_dialog.k_dscp.k_getValue()
})
);
k_dialog.k_hide();
}
};
k_dialogCfg = k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_dscp: k_form.k_getItem('k_dscp'),
k_preselectValue: undefined,
k_relatedGrid: {}
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function (k_params) {
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_preselectValue = k_params.k_preselectValue;
this.k_form.k_setData({k_dscp: k_params.k_preselectValue});
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}
}; 