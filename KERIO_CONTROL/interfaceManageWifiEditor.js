
kerio.waw.ui.interfaceManageWifiEditor = {

k_init: function(k_objectName) {
var
k_shared = kerio.waw.shared,
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_MAX_SSID_COUNT = k_shared.k_CONSTANTS.k_WIFI_CONFIG.k_MAX_SSID_COUNT,
k_grid, k_gridCfg,
k_form, k_formCfg,
k_dialog, k_dialogCfg,
k_statusbar, k_statusbarCfg;
k_statusbarCfg = {
k_defaultConfig:  'k_noMessage',
k_configurations: {
k_noMessage: {
k_text: ''
},
k_limitWarning: {
k_text: k_tr('Limit for SSIDs exceeded. You can use only %1 SSIDs.', 'wifi', {k_args:[k_MAX_SSID_COUNT]}),
k_iconCls: 'error'
}
}
};
k_statusbar = new kerio.lib.K_Statusbar(k_localNamespace + 'k_statusbar', k_statusbarCfg);
k_gridCfg = {
k_isReadOnly: k_isAuditor,
k_statusbar: k_statusbar,
k_localData: [],
k_columns: {
k_sorting: {
k_columnId: 'ssid'
},
k_items: [
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'enabled',
k_isDataOnly: true
},
{
k_columnId: 'group',
k_isDataOnly: true
},
{
k_columnId: 'wpaPassword',
k_isDataOnly: true
},
{
k_columnId: 'ssid',
k_caption: k_tr('Name', 'common'),
k_width: 260,
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'enabled'
}
},
{
k_columnId: 'assignment',
k_caption: k_tr('Assigned To', 'wifi'),
k_width: 150,
k_renderer: function(k_value) {
var
k_PORT_ASSIGNMENT_TYPE_NAMES = kerio.waw.shared.k_DEFINITIONS.k_PORT_ASSIGNMENT_TYPE_NAMES;
return {
k_data: k_PORT_ASSIGNMENT_TYPE_NAMES[k_value]
};
}
},
{
k_columnId: 'encryption',
k_caption: k_tr('Security', 'wifi'),
k_renderer: function(k_value) {
var
k_WIFI_ENCRYPTION_NAMES = kerio.waw.shared.k_DEFINITIONS.k_WIFI_ENCRYPTION_NAMES;
return {
k_data: k_WIFI_ENCRYPTION_NAMES[k_value]
};
}
}
]
},
k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'interfaceWifiSsidEditor'
},
k_items: [{
k_type: k_isAuditor ? 'K_BTN_VIEW' : 'K_GRID_DEFAULT',
k_onRemove: function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget;
k_grid.k_removeSelectedRows();
k_grid.k_updateStatusbar();
}
}]
}
}
};
k_grid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'grid', k_gridCfg);
k_formCfg = {
k_useStructuredData: true,
k_isReadOnly: k_isAuditor,
k_items: [
{
k_id: 'k_fieldsetWifiSettings',
k_type: 'k_fieldset',
k_height: 105,
k_caption: k_tr('WiFi settings', 'wifi'),
k_labelWidth: 130,
k_items: [
{
k_type: 'k_select',
k_id: 'country',
k_caption: k_tr('Country:', 'wifi'),
k_localData: [],
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',

k_onChange: function(k_form, k_element, k_value) {
k_form.k_dialog.k_setModeSelectByCountry(k_value);
}
},
{
k_type: 'k_select',
k_id: 'band',
k_caption: k_tr('Band:', 'wifi'),
k_localData: [],
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',

k_onChange: function(k_form, k_element, k_value) {
var
k_countryId = k_form.k_getItem('country').k_getValue();
k_form.k_dialog.k_setChannelSelectByCountryMode(k_countryId, k_value);
}
},
{
k_type: 'k_select',
k_id: 'channel',
k_caption: k_tr('Channel:', 'wifi'),
k_localData: [],
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value'
}
]
},
{
k_id: 'k_fieldsetSsids',
k_type: 'k_fieldset',
k_caption: k_tr('SSIDs', 'wifi'),
k_anchor: "0 -120",
k_minHeight: 100,
k_items: [
{
k_type: 'k_container',
k_content: k_grid
}
]
}
]
};
k_form = new kerio.lib.K_Form(k_localNamespace + 'form', k_formCfg);
k_dialogCfg = {
k_isAuditor: k_isAuditor,
k_title: k_tr('WiFi Settings', 'wifi'),
k_content: k_form,
k_height: 505,
k_width: 700,
k_buttons: [
'->',
{
k_id: 'k_btnOk',
k_caption: k_tr('Ok', 'common'),
k_isHidden: k_isAuditor,
k_isDefault: !k_isAuditor,

k_onClick: function(k_form) {
k_form.k_dialog.k_saveData();
}
},
{
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'common'),
k_isDefault: k_isAuditor,
k_isCancel: true
}
]
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_grid: k_grid,
k_statusbar: k_statusbar,
k_parentWidget: undefined,
k_callbackSaveData: undefined,
k_wifiCountries: undefined,
k_wifiConfig: undefined,
k_setPortsRequestCfg: {
k_jsonRpc: { method: 'Ports.set' },
k_scope: k_dialog,
k_callback: k_dialog.k_callbackSetPortList
}
});
k_form.k_addReferences({
k_dialog: k_dialog,
k_counrySelect: k_form.k_getItem('country'),
k_bandSelect: k_form.k_getItem('band'),
k_channelSelect: k_form.k_getItem('channel')
});
this.k_addControllers(k_dialog);
if (!k_isAuditor) {
k_grid.k_toolbars.k_bottom.k_dialogs.k_additionalParams = {
k_callback: k_grid.k_saveRow.createDelegate(k_grid, [], true) };
}
return k_dialog;
},

k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
this.k_parentWidget = k_params.k_parentWidget;
this.k_callbackSaveData = k_params.k_callback;
this.k_wifiCountries = k_params.k_wifiCountries;
this.k_createCountryList();
this.k_wifiConfig = k_params.k_wifiConfig;
this.k_setModeFromConfig();
this.k_form.k_setData(this.k_wifiConfig.config);
this.k_grid.k_setData(this.k_wifiConfig.config.ssids);
this.k_grid.k_updateStatusbar();
};
k_kerioWidget.k_createCountryList = function() {
var
k_form = this.k_form,
k_localisedCountries;
k_localisedCountries = kerio.waw.shared.k_DEFINITIONS.k_getLimitedSortedCountries('wifi', this.k_wifiCountries.k_counryIdList);
k_form.k_counrySelect.k_setData(k_localisedCountries);
};

k_kerioWidget.k_saveData = function() {
var
k_formData = this.k_form.k_getData();
k_formData = this.k_setModeToConfig(k_formData);
k_formData.ssids = this.k_grid.k_getData();
kerio.waw.shared.k_methods.k_mergeObjects(k_formData, this.k_wifiConfig.config);
this.k_showLoading(kerio.lib.k_tr('Saving…', 'common'));
kerio.waw.requests.k_send({
k_jsonRpc: {
method: 'Interfaces.setWifiConfig',
params: {config: k_formData}
},
k_scope: this,
k_callback: function(k_response, k_success) {
if (k_success && k_response.k_isOk && (!k_response.k_decoded.errors || 0 === k_response.k_decoded.errors.length)) {
this.k_parentWidget.k_grid.k_reloadData();
this.k_callbackSaveData.call(this.k_parentWidget, this.k_wifiConfig);
kerio.adm.k_framework.k_enableApplyReset(true);
this.k_hide();
}
}
});
this.k_parentWidget.k_updateWifiConfig(k_formData);
};

k_kerioWidget.k_setModeSelectByCountry = function(k_countryId) {
var
WifiBandAC = kerio.waw.shared.k_CONSTANTS.WifiBandType.WifiBandAC,
k_countryModeList = this.k_wifiCountries.k_countryModeList,
k_hasAcBand = false,
k_bandList,
k_selectedBand,
k_i, k_cnt;
k_bandList = k_countryModeList[k_countryId];
k_cnt = k_bandList.length;
for (k_i = 0; k_i < k_cnt; k_i++){
if (WifiBandAC === k_bandList[k_i].k_value) {
k_hasAcBand = true;
break;
}
}
if (k_hasAcBand) {
k_selectedBand = WifiBandAC;
}
else {
k_selectedBand = k_bandList[k_cnt - 1].k_value;
}
this.k_form.k_bandSelect.k_setData(k_bandList);
this.k_form.k_bandSelect.k_setValue(k_selectedBand);
this.k_setChannelSelectByCountryMode(k_countryId, k_selectedBand);
};

k_kerioWidget.k_setChannelSelectByCountryMode = function(k_countryId, k_bandId) {
var
k_channelSelect = this.k_form.k_channelSelect,
k_countryModelChannelList = this.k_wifiCountries.k_countryModelChannelList,
k_channels = k_countryModelChannelList[k_countryId][k_bandId];
k_channelSelect.k_clearData();
if (0 === k_channels.length) {
k_channelSelect.k_setDisabled(true);
k_channelSelect.k_setEmptyText(kerio.lib.k_tr('No channel available', 'wifi'));
return;
}
k_channelSelect.k_setDisabled(false);
k_channelSelect.k_setData(k_countryModelChannelList[k_countryId][k_bandId]);
};

k_kerioWidget.k_setModeFromConfig = function() {
var
WifiBandType = kerio.waw.shared.k_CONSTANTS.WifiBandType,
k_band = this.k_wifiConfig.config.band;
if (this.k_wifiConfig.config.band80211n) {
switch (this.k_wifiConfig.config.band) {
case WifiBandType.WifiBandA:
k_band = WifiBandType.k_BAND_AN;
break;
case WifiBandType.WifiBandBG:
k_band = WifiBandType.k_BAND_BGN;
break;
}
this.k_wifiConfig.config.band = k_band;
}
};

k_kerioWidget.k_setModeToConfig = function(k_data) {
var
WifiBandType = kerio.waw.shared.k_CONSTANTS.WifiBandType,
k_bandId = k_data.band;
if (WifiBandType.k_BAND_AN !== k_bandId && WifiBandType.k_BAND_BGN !== k_bandId && WifiBandType.WifiBandAC !== k_bandId) {
k_data.band = k_bandId;
k_data.band80211n = false;
return k_data;
}
k_data.band80211n = true;
switch (k_bandId) {
case WifiBandType.k_BAND_AN:
k_data.band = WifiBandType.WifiBandA;
break;
case WifiBandType.k_BAND_BGN:
k_data.band = WifiBandType.WifiBandBG;
break;
}
return k_data;
};

k_kerioWidget.k_grid.k_saveRow = function(k_rowData, k_rowIndex) {
if (undefined === k_rowIndex) {
k_rowData.enabled = true;
this.k_addRow(k_rowData, k_rowIndex);
}
else {
this.k_updateRow(k_rowData, k_rowIndex);
}
this.k_updateStatusbar();
this.k_refresh();
this.k_resortRows();
};

k_kerioWidget.k_grid.k_updateStatusbar = function() {
var
k_limit = kerio.waw.shared.k_CONSTANTS.k_WIFI_CONFIG.k_MAX_SSID_COUNT,
k_currentCnt = this.k_getRowsCount();
if (k_currentCnt <= k_limit) {
this.k_statusbar.k_switchConfig('k_noMessage');
this.k_getMainWidget().k_toolbar.k_items.k_btnOk.k_setDisabled(false);
}
else {
this.k_statusbar.k_switchConfig('k_limitWarning');
this.k_getMainWidget().k_toolbar.k_items.k_btnOk.k_setDisabled(true);
}
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}
};
