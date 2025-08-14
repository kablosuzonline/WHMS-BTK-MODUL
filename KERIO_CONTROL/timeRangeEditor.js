

kerio.waw.ui.timeRangeEditor = {

k_init: function(k_objectName) {
var k_dialog, k_dialogCfg;
k_dialogCfg = {
k_timeFormat: 'H:i',
k_dateFormat: 'Y-m-d',
k_isDataRefreshable: false,
k_onClose: function(k_response, k_isEditMode) {
if ('timeRangeList' === this.k_id) {
kerio.waw.shared.k_data.k_get(this.k_dataStoreId, true);
kerio.adm.k_framework.k_enableApplyReset();
}
}
};
k_dialog = new kerio.adm.k_widgets.K_TimeRangeEditor(k_objectName, k_dialogCfg);
kerio.waw.shared.k_data.k_cache({ k_dialog: k_dialog }); return k_dialog;
} }; 