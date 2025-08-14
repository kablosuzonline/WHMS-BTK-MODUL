
kerio.waw.ui.interfaceMultipleIpsEditor = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_tr = kerio.lib.k_tr,
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_WAW_DEFINITIONS = k_shared.k_DEFINITIONS,
k_MULTI_IP_IDS = k_WAW_CONSTANTS.k_INTERFACE_EDITOR_NAMES.k_MULTI_IP,
k_IP_ADDRESS_EDITOR_TYPES = k_WAW_CONSTANTS.k_IP_ADDRESS_EDITOR_TYPES,
k_isIpv6 = (k_MULTI_IP_IDS.k_IPv6.k_EDIT === k_objectName || k_MULTI_IP_IDS.k_IPv6.k_VIEW === k_objectName),
k_isView = (k_MULTI_IP_IDS.k_IPv4.k_VIEW === k_objectName || k_MULTI_IP_IDS.k_IPv6.k_VIEW === k_objectName),
k_editorParams = {}, k_statusbar, k_statusbarCfg,
k_grid, k_gridCfg,
k_dialog, k_dialogCfg;
if (!k_isIpv6 && !k_isView) {
k_statusbarCfg = {
k_defaultConfig:  'k_noMessage',
k_configurations: {
k_noMessage: {
k_text: ''
},
k_ipLimitReached: {
k_text: k_tr('A limit of IP address count has been reached.', 'interfaceMultipleIpsEditor'),
k_iconCls: 'statusBarIcon ipLimitReached'
}
}
};
k_statusbar = new kerio.lib.K_Statusbar(k_localNamespace + 'k_statusbar', k_statusbarCfg);
}
k_gridCfg = {
k_restrictBy: {
k_isView: k_isView,
k_isIpv6: k_isIpv6
},
k_className: 'lastFormItem', k_statusbar: (k_isIpv6 ? undefined : k_statusbar),
k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'addHostEditor',
k_additionalParams: k_editorParams
},
k_items: [],

k_update: function(k_grid) {
if (!k_grid || !k_grid.k_isInstanceOf('K_Grid') || k_grid.k_parentWidget.k_isIpv6 || k_grid.k_parentWidget.k_isView) {
return;
}
var
k_rowCnt = k_grid.k_getRowsCount(),
k_isLimit = (kerio.waw.shared.k_CONSTANTS.k_MAX_MULTI_IPV4 < k_rowCnt); if (k_grid._k_lastItemCount === k_rowCnt) {
return; }
k_grid._k_lastItemCount = k_rowCnt;
k_grid.k_statusbar.k_switchConfig(k_isLimit ? 'k_ipLimitReached' : 'k_noMessage');
k_grid.k_statusbar.k_setVisible(k_isLimit);
k_grid.k_toolbars.k_bottom.k_enableItem('k_btnAdd', !k_isLimit); } } },
k_columns: {
k_sorting: false,
k_items: [
{
k_columnId: 'ip',
k_caption: k_tr('IP Address', 'interfaceEditor'),
k_width: k_isIpv6 ? 300 : 120
},
{
k_restrictions: {
k_isIpv6: [false]
},
k_columnId: 'subnetMask',
k_caption: k_tr('Mask', 'interfaceEditor')
},
{
k_restrictions: {
k_isIpv6: [true]
},
k_columnId: 'prefixLength',
k_caption: k_tr('Prefix Length', 'interfaceEditor')
}
] }
}; if (!k_isView) {
k_gridCfg.k_toolbars.k_bottom.k_items.push(
{ k_type: 'K_GRID_DEFAULT' }
);
}
k_grid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'ipListGrid', k_gridCfg);
k_dialogCfg = {
k_isAuditor: k_isView,
k_title: k_tr('Additional IP Addresses', 'interfaceEditor'),
k_content: k_grid,
k_height: 500,
k_width: 500,
k_defaultItem: null,

k_onOkClick: function(k_toolbar) {
var k_dialog = k_toolbar.k_dialog;
if (false !== k_dialog.k_callback.call(k_dialog.k_parentWidget, k_dialog.k_grid.k_getData())) {
k_dialog.k_hide();
}
else {
k_dialog.k_hideMask();
}
}
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_WAW_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_isView: k_isView,
k_isIpv6: k_isIpv6,
k_grid: k_grid,
k_callback: undefined,
k_parentWidget: undefined
}); k_grid.k_addReferences({
_k_lastItemCount: -1 });
this.k_addControllers(k_dialog);
k_editorParams.k_editorTypes = (k_isIpv6)
? k_IP_ADDRESS_EDITOR_TYPES.k_IPv6_ADDRESS + k_IP_ADDRESS_EDITOR_TYPES.k_IPv6_PREFIX
: k_IP_ADDRESS_EDITOR_TYPES.k_IPv4_ADDRESS + k_IP_ADDRESS_EDITOR_TYPES.k_IPv4_MASK;
k_editorParams.k_parentWidget = k_dialog;
k_editorParams.k_callback = k_dialog.k_setIp;
k_grid.k_toolbars.k_bottom.k_setDialogAdditionalParams(k_editorParams);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_applyParams: function(k_params) {
var
k_ipList = k_params.k_data,
k_grid = this.k_grid,
k_isLimit;
this.k_callback = k_params.k_callback;
this.k_parentWidget = k_params.k_parentWidget;
k_grid.k_setData(k_ipList);
if (!this.k_isIpv6 && !this.k_isView) {
k_isLimit = (kerio.waw.shared.k_CONSTANTS.k_MAX_MULTI_IPV4 < k_ipList.length); k_grid.k_statusbar.k_switchConfig(k_isLimit ? 'k_ipLimitReached' : 'k_noMessage');
k_grid.k_statusbar.k_setVisible(k_isLimit);
if (k_grid.k_toolbars.k_bottom) { k_grid.k_toolbars.k_bottom.k_enableItem('k_btnAdd', !k_isLimit); }
}
if (kerio.waw.shared.k_methods.k_isLinux()) {
k_grid.k_startTracing();
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_dialogs: ['addHostEditor']
});
}
else { kerio.waw.shared.k_data.k_cache({
k_dialog: this
});
}
}, 
k_resetOnClose: function() {
this.k_grid.k_stopTracing(); this.k_grid.k_setData([]);
this.k_grid._k_lastItemCount = -1; }, 
k_setIp: function(k_params) {
var
k_lib = kerio.lib,
k_grid = this,
k_isIpv6 = this instanceof kerio.lib.K_Dialog ? this.k_isIpv6 : this.k_parentWidget.k_isIpv6,
k_isEditMode = k_params.k_isEditMode && 0 !== k_grid.k_selectionStatus.k_selectedRowsCount,
k_ipData = k_params.k_data,
k_gridData = k_grid.k_getData(),
k_selectedRow,
k_currentRow,
k_i, k_cnt;
if (!k_isEditMode && kerio.waw.shared.k_CONSTANTS.k_MAX_MULTI_IPV4 < k_grid.k_getRowsCount()) {
return false; }
if (k_isEditMode) { k_selectedRow = k_grid.k_selectionStatus.k_rows[0].k_data;
if (k_selectedRow.ip === k_ipData.ip) {
if ((k_isIpv6 && k_selectedRow.prefixLength !== k_ipData.prefixLength)
|| (!k_isIpv6 && k_selectedRow.subnetMask !== k_ipData.subnetMask)
) {
k_grid.k_updateRow(k_ipData); }
return true;
}
} for (k_i = 0, k_cnt = k_gridData.length; k_i < k_cnt; k_i++) {
k_currentRow = k_gridData[k_i];
if (k_currentRow.ip === k_ipData.ip) {
k_lib.k_alert(
k_lib.k_tr('Validation Warning', 'common'),
k_lib.k_tr('This IP address is already defined for the interface.', 'interfaceMultipleIpsEditor')
);
return false;
}
} if (k_isEditMode) {
k_grid.k_updateRow(k_ipData); }
else {
k_grid.k_appendRow(k_ipData); }
return true;
} });
} }; 