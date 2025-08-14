
kerio.waw.ui.interfaceAdvancedEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_isProbeEditor = ('interfaceProbeEditor' === k_objectName),
k_topToolbarCfg,
k_probeFormCfg, k_probeForm,
k_rulesGridCfg, k_rulesGrid,
k_toolbarCheckbox,
k_dialogCfg, k_dialog;
if (k_isProbeEditor) {
k_probeFormCfg = {
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Availability detection', 'interfaceAdvancedEditor'),
k_isHidden: !k_isProbeEditor,
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('An ICMP ping message is sent periodically to probe hosts to determine whether the connection is available.', 'interfaceAdvancedEditor')
},
{
k_type: 'k_radio',
k_groupId: 'k_probeHostsEnabled',
k_value: false,
k_isLabelHidden: true,
k_option: k_tr('Use the primary default gateway as the probe host', 'interfaceAdvancedEditor'),

k_onChange: function(k_form, k_radio, k_value) {
k_form.k_setDisabled(['k_probeHosts','k_probeHostsNote'], !k_value); }
},
{
k_type: 'k_radio',
k_groupId: 'k_probeHostsEnabled',
k_value: true,
k_isLabelHidden: true,
k_option: k_tr('Use the following specified IP addresses as the probe hosts:', 'interfaceAdvancedEditor')
},
{
k_id: 'k_probeHosts',
k_isLabelHidden: true,
k_indent: 1,
k_maxLength: 511,
k_validator: {
k_functionName: 'k_isIpAddressList',
k_allowBlank: false,
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4List.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
},
{
k_type: 'k_display',
k_id: 'k_probeHostsNote',
k_isLabelHidden: true,
k_indent: 1,
k_value: k_tr('Use semicolons ( ; ) to separate individual entries.', 'interfaceAdvancedEditor')
}
] },
{
k_type: 'k_checkbox',
k_id: 'k_reconnectTunnels',
k_isLabelHidden: true,
k_option: k_tr('Force reconnect of all VPN tunnels when the primary line is used again', 'interfaceAdvancedEditor'),
k_isChecked: true
},
{
k_type: 'k_checkbox',
k_id: 'k_continueWithBackupLine',
k_isLabelHidden: true,
k_option: k_tr('Continue using the backup line even after the primary line becomes available', 'interfaceAdvancedEditor')
}
] };k_probeForm = new k_lib.K_Form(k_localNamespace + 'k_form', k_probeFormCfg);
} else { k_toolbarCheckbox = new kerio.lib.K_Checkbox(k_localNamespace + 'k_dialDnsWithoutDomain', {
k_id: 'k_dialDnsWithoutDomain',
k_isLabelHidden: true,
k_option: k_tr('Enable dialing for local DNS names (names where the domain part is missing)', 'interfaceAdvancedEditor')
});
k_topToolbarCfg = {
k_items: [
k_toolbarCheckbox
]
};
k_rulesGridCfg = {
k_isAuditor: k_isAuditor,
k_isApplyResetUsed: false,
k_selectionMode: 'k_multi',
k_columns: {
k_sorting: false, k_items: [{
k_columnId: 'dialEnabled',
k_caption: k_tr('Action', 'common'),
k_width: 100,
k_renderer: kerio.waw.shared.k_methods.k_renderers.k_renderAllowDeny
}, {
k_columnId: 'dnsName',
k_caption: k_tr('DNS Name', 'common')
}]
}, k_toolbars: {
k_top: k_topToolbarCfg,
k_bottom: {
k_dialogs: {
k_sourceName: 'interfaceAdvancedRuleEditor'
}
}
}
}; k_rulesGrid = new kerio.waw.shared.k_widgets.K_SimpleRulesGrid(k_localNamespace + 'dnsRulesGrid', k_rulesGridCfg);
} k_dialogCfg = {
k_height: (k_isProbeEditor) ? 350 : 380,
k_width: 600,
k_title: (k_isProbeEditor)
? k_tr('Advanced Connectivity Options', 'interfaceAdvancedEditor')
: k_tr('DNS rules', 'interfaceAdvancedEditor'),
k_content: (k_isProbeEditor)
? k_probeForm
: k_rulesGrid,
k_defaultItem: (k_isProbeEditor) ? 'k_probeHosts' : null, 
k_onOkClick: function(k_toolbar){
k_toolbar.k_dialog.k_saveData();
} }; k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
if (k_isAuditor && k_isProbeEditor) {
k_probeForm.k_setReadOnlyAll();
}
k_dialog.k_addReferences({
k_objectName: k_objectName,
k_isAuditor: k_isAuditor,
k_dataStore: null
});
if (k_isProbeEditor) {
k_dialog.k_addReferences({
k_form: k_probeForm
});
k_probeForm.k_addReferences({
k_dialog: k_dialog
});
}
else { k_dialog.k_addReferences({
k_rulesGrid: k_rulesGrid,
k_dialDnsWithoutDomain: k_toolbarCheckbox
});
k_rulesGrid.k_addReferences({
k_allowDenyTranslate: {
k_allow: k_tr('Dial', 'interfaceList'),
k_deny: k_tr('Ignore', 'common')
}
});
} this.k_addControllers(k_dialog); if (k_isProbeEditor) {
this.k_addProbeControllers(k_dialog);
}
else {
this.k_addRulesControllers(k_dialog);
}
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_notifyDataChange = function() {
kerio.adm.k_framework.k_enableApplyReset();
this.k_hide();
};
},

k_addProbeControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_isFailover = kerio.waw.shared.k_CONSTANTS.ConnectivityType.Failover === k_params.k_parent.k_grid.k_connectivityType,
k_dataStore = k_params.k_data,
k_probeHosts;
this.k_dataStore = k_dataStore; k_probeHosts = k_dataStore.probeHosts;
this.k_form.k_setData({
k_probeHostsEnabled: k_probeHosts.enabled,
k_probeHosts: k_probeHosts.value,
k_reconnectTunnels: k_dataStore.reconnectTunnelsWhenPrimaryGoesBack,
k_continueWithBackupLine: k_dataStore.lazyFailover
}, true);
this.k_form.k_setVisible(['k_reconnectTunnels', 'k_continueWithBackupLine'], k_isFailover);
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_dialogs: ['interfaceAdvancedRuleEditor']
});
}; 
k_kerioWidget.k_saveData = function() {
var
k_data = this.k_form.k_getData(true),
k_dataStore = this.k_dataStore,
k_mergeData;
k_mergeData = {
probeHosts: {
enabled: k_data.k_probeHostsEnabled,
value: k_data.k_probeHosts
},
reconnectTunnelsWhenPrimaryGoesBack: k_data.k_reconnectTunnels,
lazyFailover: k_data.k_continueWithBackupLine
};
kerio.waw.shared.k_methods.k_mergeObjects(k_mergeData, k_dataStore); this.k_notifyDataChange();
};
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}, 
k_addRulesControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_dataStore = k_params.k_data;
this.k_dataStore = k_dataStore; this.k_rulesGrid.k_setData(kerio.lib.k_cloneObject(k_dataStore.dialRules)); this.k_rulesGrid.k_startTracing();
this.k_dialDnsWithoutDomain.k_setValue(k_dataStore.dialDnsWithoutDomain, true);
};
k_kerioWidget.k_saveData = function() {
var
k_dataStore = this.k_dataStore,
k_mergeData;
k_mergeData = {
dialRules: this.k_rulesGrid.k_getData(),
dialDnsWithoutDomain: this.k_dialDnsWithoutDomain.k_getValue()
};
kerio.waw.shared.k_methods.k_mergeObjects(k_mergeData, k_dataStore); this.k_notifyDataChange();
};
k_kerioWidget.k_resetOnClose = function() {
this.k_rulesGrid.k_stopTracing();
};

k_kerioWidget.k_isChanged = function() {
return (this.k_rulesGrid.k_isChanged() || this.k_dialDnsWithoutDomain.k_isDirty());
};
}}; 