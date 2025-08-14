
kerio.waw.ui.dhcpOptionEditor = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_isEditMode = 'dhcpOptionEditorAdd' !== k_objectName,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_wawShared = kerio.waw.shared,
k_mainForm, k_mainFormCfg,
k_mainLayout, k_mainLayoutCfg,
k_dialog, k_dialogCfg;
k_mainFormCfg = {
k_labelWidth: 70, k_items: [
{
k_type: 'k_select',
k_id: 'k_optionId',
k_caption: k_tr('Option:', 'dhcpOptionEditor'),
k_isDisabled: k_isEditMode,
k_checkPreselectedValue: false,
k_fieldDisplay: 'k_caption',
k_fieldValue:   'k_optionId', k_localData: [],

k_onChange: function(k_form, k_select, k_value) {
if (k_select.k_skipOnChange) {
return;
}
k_form.k_dialog.k_setEditor(k_value);
}
}
] }; k_mainForm = new k_lib.K_Form(k_localNamespace + 'k_mainForm', k_mainFormCfg);
k_mainLayoutCfg = {
k_verLayout: {
k_items: [
{
k_iniSize: 45,
k_content: k_mainForm
},
{
k_id: 'k_editor',
k_hasMorePages: true }
] }
}; k_mainLayout = new k_lib.K_Layout(k_localNamespace + 'k_mainLayout', k_mainLayoutCfg);
k_dialogCfg = {
k_width: 430,
k_height: 250,
k_title: (k_isEditMode)
? k_tr('Edit Option', 'dhcpOptionEditor')
: k_tr('Add Option', 'dhcpOptionEditor'),
k_content: k_mainLayout,
k_validateOk: false,
k_defaultItem: k_mainForm.k_getItem('k_optionId').k_id,

k_onOkClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData.call(k_toolbar.k_dialog);
} }; k_dialogCfg = k_wawShared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_mainForm: k_mainForm,
k_mainLayout: k_mainLayout,
K_DhcpOptionEditorFactory: k_wawShared.k_widgets.K_DhcpOptionEditorFactory,
k_currentEditor: null, k_isEditMode: k_isEditMode
}); k_mainForm.k_addReferences({
k_dialog: k_dialog,
k_parentLayout: k_mainLayout
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
this.k_showMask(kerio.lib.k_tr('Loading list of options…', 'dhcpOptionEditor'));
this.k_parent = k_params.k_relatedGrid;
this.k_dataStore = k_params.k_data || {};
this.K_DhcpOptionEditorFactory.k_getOptions(this.k_loadOptions, this);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); }; 
k_kerioWidget.k_loadOptions = function(k_options) {
if (!k_options) {
this.k_hide(); }
var
k_optionIdSelect = this.k_mainForm.k_getItem('k_optionId'),
k_list = [],
k_optionId;
for (k_optionId in k_options) {
k_list.push({
k_optionId: k_optionId,
k_caption:  kerio.waw.shared.k_methods.k_normalize(k_optionId, 3, { k_number: true }) + ': ' + k_options[k_optionId].name
});
}
k_optionIdSelect.k_setData(k_list, false, this.k_dataStore.optionId); this.k_setEditor(k_optionIdSelect.k_getValue()); if (this.k_dataStore.optionId) { this.k_currentEditor.k_setData(this.k_dataStore);
}
this.k_hideMask();
}; 
k_kerioWidget.k_setEditor = function(k_optionId) {
var k_editor = this.K_DhcpOptionEditorFactory.k_get(k_optionId);
this.k_currentEditor = k_editor; this.k_mainLayout.k_setContent({
k_id:     'k_editor',
k_content: k_editor
}); k_editor.k_focus.defer(100, k_editor); };

k_kerioWidget.k_sendData = function(){
var
k_optionId = this.k_mainForm.k_getItem('k_optionId'),
k_wawShared = kerio.waw.shared,
k_lib = kerio.lib,
k_parent = this.k_parent,
k_data = {};
if (!this.k_currentEditor.k_isValid()) {
this.k_hideMask();
return;
}
k_wawShared.k_methods.k_mergeObjects(this.k_currentEditor.k_getData(), k_data);
k_data.value = k_data.value ? ('' + k_data.value) : ''; if ( ! k_data.hasOwnProperty('ipListList')) {
k_data.ipListList = []; }
if (this.k_isEditMode) {
k_parent.k_editOption(k_data);
}
else {
k_data.optionId = k_optionId.k_getValue();
k_data.name = k_wawShared.k_widgets.K_DhcpOptionEditorFactory.k_getOptionName(k_data.optionId);
if (!k_parent.k_addOption(k_data)) {
k_lib.k_alert(
k_lib.k_tr('Validation Warning', 'common'),
k_lib.k_tr('This option is already defined.', 'dhcpOptionEditor')
); this.k_hideMask();
return;
}
if (kerio.lib.k_isFirefox && (kerio.lib.k_isTiger || kerio.lib.k_isLeopard || kerio.lib.k_isSnowLeopard)) {
k_parent.k_editationDisabled = true;
k_parent.k_enableEditation.defer(300, k_parent);
}
}
this.k_hide();
}; 
k_kerioWidget.k_resetOnClose = function() {
this.k_mainForm.k_reset();
this.K_DhcpOptionEditorFactory.k_reset();
}; } }; 
kerio.waw.shared.k_widgets = kerio.waw.shared.k_widgets || {}; kerio.waw.shared.k_widgets.K_DhcpOptionEditorFactory = {

k_get: function(k_optionId) {
var
k_optionType, k_editor, k_editorCfg;
if ('k_empty' === k_optionId) {
if (!this._k_editorWidgets.k_empty) {
this._k_editorWidgets.k_empty = new kerio.lib.K_ContentPanel('K_DhcpOptionEditorFactory' + '_' + 'k_empty', {k_html:''}); this._k_editorWidgets.k_empty.k_setData = function() {
kerio.lib.k_reportError('Internal error: empty editor replacement used to edit data.', 'dhcpOptionEditor', 'k_get');
};
}
return this._k_editorWidgets.k_empty;
}
if (!this._k_dhcpOptions[k_optionId]) {
kerio.lib.k_reportError('Unknown DHCP Option ' + k_optionId, 'K_DhcpOptionEditorFactory', 'k_get');
return null;
}
k_optionType = this._k_dhcpOptions[k_optionId].type;
if (!this._k_editorCfgs._k_isReady) {
this._k_initEditorTypes();
}
k_editorCfg = this._k_editorCfgs[k_optionType];
if (!k_editorCfg) {
kerio.lib.k_reportError('Unsupported DHCP Option ' + this._k_dhcpOptions[k_optionId].optionId
+ '; value type ' + k_optionType, 'dhcpOptionEditor', 'k_get');
return null;
}
k_editor = this._k_editorWidgets[k_optionType];
if (!k_editor) {
if ('function' === typeof k_editorCfg) { k_editorCfg = k_editorCfg(k_optionType);
}
k_editor = new this._k_constructor(k_optionType, k_editorCfg);
if (k_editor) {
this._k_editorWidgets[k_optionType] = k_editor;
}
else {
kerio.lib.k_reportError('Error in editor constructor for type ' + k_optionType, 'dhcpOptionEditor', 'k_get');
}
}
return k_editor;
}, 
k_getOptions: function(k_callback, k_scope) {
var k_STATES = this._k_DHCP_OPTIONS_STATES;
if ('function' === typeof k_callback) {
this._k_loadListeners.push({
k_callback: k_callback,
k_scope: k_scope
});
}
if (k_STATES.k_LOADED === this._k_dhcpOptionsState) {
this._k_getOptionsCallback.defer(1, this); return true;
}
if (k_STATES.k_EMPTY === this._k_dhcpOptionsState) {
this._k_getOptions();
} return false; }, 
k_getOptionName: function(k_optionId) {
var k_name;
if (this._k_DHCP_OPTIONS_STATES.k_LOADED !== this._k_dhcpOptionsState) {
k_name = '';
}
else if (this._k_dhcpOptions[k_optionId]) {
k_name = this._k_dhcpOptions[k_optionId].name;
}
return (k_name ? k_name : '');
}, 
k_reset: function() {
var
k_editors = this._k_editorWidgets,
k_i;
for (k_i in k_editors) {
if (k_editors[k_i].k_reset) { k_editors[k_i].k_reset();
}
}
}, 
_k_dhcpOptions: {},
_k_dhcpOptionsState: 0, _k_DHCP_OPTIONS_STATES: {
k_EMPTY: 0,  k_LOADED: 1, k_LOADING: 2 },

_k_editorWidgets: {},

_k_editorCfgs: {}, 
_k_loadListeners: [],

_k_initEditorTypes: function() {
var
k_types = kerio.waw.shared.k_CONSTANTS.DhcpOptionType,
k_editors = this._k_editorCfgs;
k_editors._k_isReady = true; k_editors[k_types.DhcpBool] = this._k_editorBool;
k_editors[k_types.DhcpInt8]  = this._k_editorInt; k_editors[k_types.DhcpInt16] = this._k_editorInt;
k_editors[k_types.DhcpString]  = this._k_editorString;
k_editors[k_types.DhcpIpAddr] = this._k_editorIpAddress;
k_editors[k_types.DhcpHex]     = this._k_editorHex;
k_editors[k_types.DhcpInt16List]   = this._k_editorList;
k_editors[k_types.DhcpIpAddrList] = this._k_editorList;
k_editors[k_types.DhcpTimeUnsigned] = this._k_editorDayTime;
k_editors[k_types.DhcpTimeSigned]   = this._k_editorOffsetTime;
k_editors[k_types.DhcpIpPairList]    = this._k_editorListIpAddresses;
k_editors[k_types.DhcpIpMaskList]    = this._k_editorListIpAddresses;
k_editors[k_types.DhcpIpMaskIpList] = this._k_editorListIpAddresses;
}, 
_k_getOptions: function() {
this._k_dhcpOptionsState = this._k_DHCP_OPTIONS_STATES.k_LOADING;
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Dhcp.getOptionList'
},
k_callback: this._k_getOptionsCallback,
k_scope: this
});
}, 
_k_getOptionsCallback: function(k_response, k_success) {
var
k_cloneObject = kerio.lib.k_cloneObject,
k_STATES = this._k_DHCP_OPTIONS_STATES,
k_listeners = this._k_loadListeners,
k_i, k_cnt, k_option,
k_dhcpOptions,
k_listener;
if (k_STATES.k_LOADED !== this._k_dhcpOptionsState) { if (!k_success || !k_response.k_decoded.options) {
this._k_dhcpOptionsState = k_STATES.k_EMPTY;
this._k_dhcpOptions = null;
kerio.lib.k_reportError('Unable to load list of DHCP options.', 'dhcpOptionEditor', '_k_getOptionsCallback');
return;
}
else {
this._k_dhcpOptionsState = k_STATES.k_LOADED;
k_dhcpOptions = {};
k_response = k_response.k_decoded.options;
for (k_i = 0, k_cnt = k_response.length; k_i < k_cnt; k_i++) {
k_option = k_response[k_i];
k_dhcpOptions[k_option.optionId] = k_option;
}
this._k_dhcpOptions = k_dhcpOptions;
}
}
k_dhcpOptions = this._k_dhcpOptions;
for (k_i = 0, k_cnt = k_listeners.length; k_i < k_cnt; k_i++) {
k_listener = k_listeners[k_i];
k_listener.k_callback.call(k_listener.k_scope, k_cloneObject(k_dhcpOptions)); }
this._k_loadListeners = []; }, 
_k_constructor: function(k_optionType, k_config) {
var
k_formMethods = kerio.lib.K_Form.prototype, k_formCfg = k_config.k_formCfg;
k_formCfg.k_className = 'layoutBottomForm ' + k_formCfg.k_className; k_formCfg.k_labelWidth = 70;  kerio.lib.K_Form.call(this, 'K_DhcpOptionEditorFactory' + '_' + 'k_type' + k_optionType, k_formCfg);
this.k_addReferences({
_k_formFocus:   k_formMethods.k_focus,    _k_formSetData: k_formMethods.k_setData,  _k_formGetData: k_formMethods.k_getData,  _k_editorSetData: k_config.k_setData,     _k_editorGetData: k_config.k_getData,     _k_needSetData: ('function' === typeof k_config.k_setData), _k_needGetData: ('function' === typeof k_config.k_getData), _k_optionType: k_optionType,  _k_defaultItem: k_config.k_defaultItem });
if (k_config.k_addReferences) {
this.k_addReferences(k_config.k_addReferences);
}
}, 
_k_editorBool: {
k_defaultItem: 'k_isEnabled',
k_formCfg: {
k_items: [
{
k_id: 'k_isEnabled',
k_type: 'k_checkbox',
k_caption: '', k_option: kerio.lib.k_tr('Enabled', 'common'), k_isChecked: false
}
] },

k_setData: function(k_data) {
return { k_isEnabled: ('1' === k_data.value) }; },

k_getData: function(k_data) {
return { value: (k_data.k_isEnabled ? '1' : '0') };
}
}, 
_k_editorInt: function(k_optionType) {
var
k_limits = kerio.waw.shared.k_DEFINITIONS.k_DHCP_INT_LIMITS,
k_tr = kerio.lib.k_tr,
k_maxLength,
k_maxValue;
k_maxValue = k_limits[k_optionType];
if (undefined === k_maxValue) { kerio.lib.k_reportError('DHCP option INT editor does not support value type ' + k_optionType, 'dhcpOptionEditor', '_k_editorInt');
}
k_maxLength = String(k_maxValue).length;
return {
k_defaultItem: 'value',
k_formCfg: {
k_items: [
{
k_id: 'value',
k_type: 'k_number',
k_caption: k_tr('Value:', 'dhcpOptionEditor'),
k_maxLength: k_maxLength,
k_maxValue: k_maxValue,
k_minValue: 0,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_id:   'k_editorInfo',
k_caption: ' ', k_value: k_tr('Numerical value in range 0 - %1.', 'dhcpOptionEditor', {k_args: [k_maxValue]})
}
] }
}; }, 
_k_editorString: {
k_defaultItem: 'value',
k_formCfg: {
k_items: [
{
k_id: 'value',
k_caption: kerio.lib.k_tr('Value:', 'dhcpOptionEditor'),
k_maxLength: 255,
k_validator: {
k_allowBlank: false
}
}
] }
}, 
_k_editorIpAddress: {
k_defaultItem: 'value',
k_formCfg: {
k_items: [
{
k_id: 'value',
k_caption: kerio.lib.k_tr('IP address:', 'dhcpOptionEditor'),
k_maxLength: 15,
k_validator: {
k_functionName: 'k_isIpAddress',
k_allowBlank: false,
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
},
{
k_type: 'k_display',
k_id:   'k_editorInfo',
k_caption: ' ', k_value: kerio.lib.k_tr('Single IP address.', 'dhcpOptionEditor')
}
] }
}, 
_k_editorHex: {
k_defaultItem: 'value',
k_formCfg: {
k_items: [
{
k_id: 'value',
k_caption: kerio.lib.k_tr('Value:', 'dhcpOptionEditor'),
k_maxLength: 254, k_validator: {
k_functionName: 'k_isHexNumber',
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_id:   'k_editorInfo',
k_caption: ' ', k_value: kerio.lib.k_tr('Hexadecimal value defined by numbers 0-9 and letters A-F in pairs.', 'dhcpOptionEditor')
}
] }
}, 
_k_editorList: function(k_optionType) {
var
k_wawShared = kerio.waw.shared,
k_types  = k_wawShared.k_CONSTANTS.DhcpOptionType,
k_limits = k_wawShared.k_DEFINITIONS.k_DHCP_INT_LIMITS,
k_maxValue = k_limits[k_optionType], k_tr = kerio.lib.k_tr,
k_validator,
k_info;
switch (k_optionType) {
case k_types.DhcpInt8List:
k_validator =  'k_isInt8List';
k_info = k_tr('Numerical values in range 0 - %1 separated by semicolons (;).', 'dhcpOptionEditor', {k_args: [k_maxValue]});
break;
case k_types.DhcpInt16List:
k_validator =  'k_isInt16List';
k_info = k_tr('Numerical values in range 0 - %1 separated by semicolons (;).', 'dhcpOptionEditor', {k_args: [k_maxValue]});
break;
case k_types.DhcpInt32List:
k_validator =  'k_isInt32List';
k_info = k_tr('Numerical values in range 0 - %1 separated by semicolons (;).', 'dhcpOptionEditor', {k_args: [k_maxValue]});
break;
case k_types.DhcpIpAddrList:
k_validator =  'k_isIpAddressList';
k_info = k_tr('List of IP addresses separated by semicolons (;).', 'dhcpOptionEditor');
break;
default:
kerio.lib.k_reportError('DHCP option LIST editor does not support value type ' + k_optionType, 'dhcpOptionEditor', '_k_editorInt');
break;
}
return {
k_defaultItem: 'value',
k_formCfg: {
k_items: [
{
k_id: 'value',
k_caption: kerio.lib.k_tr('List:', 'dhcpOptionEditor'),
k_maxLength: 511,
k_validator: {
k_functionName: k_validator,
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_id:   'k_editorInfo',
k_caption: ' ', k_value: k_info
}
] }
}; }, 
_k_editorDayTime: {
k_defaultItem: 'k_days',
k_formCfg: {
k_items: [
{
k_id: 'k_days',
k_type: 'k_number',
k_caption: kerio.lib.k_tr('Days:', 'dhcpOptionEditor'),
k_width: 50,
k_value: 0,
k_minValue: 0,
k_maxValue: 99,
k_maxLength: 2,
k_validator: {
k_allowBlank: false
}
},
{
k_id: 'k_time',
k_caption: kerio.lib.k_tr('Time:', 'dhcpOptionEditor'),
k_width: 75,
k_value: '00:00',
k_maxLength: 5, k_validator: {
k_functionName: 'k_isTime',
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_id:   'k_editorInfo',
k_caption: ' ', k_value: kerio.lib.k_tr('Number of days, hours and minutes. Time can be defined in range from 0:00 to 23:59.', 'dhcpOptionEditor')
}
] },

k_setData: function(k_data) {
var
k_wawShared = kerio.waw.shared,
k_TIME = k_wawShared.k_CONSTANTS.k_TIME_CONSTANTS,
k_value = Math.abs(k_data.value), k_days  = Math.floor(k_value / k_TIME.k_SECONDS_IN_DAY),
k_time  = k_data.value % k_TIME.k_SECONDS_IN_DAY,         k_hours = Math.floor(k_time / k_TIME.k_SECONDS_IN_HOUR),
k_mins  = Math.floor(k_time % k_TIME.k_SECONDS_IN_HOUR / k_TIME.k_SECONDS_IN_MIN);
return {
k_days: k_days,
k_time: '' + k_hours + ':' + k_wawShared.k_methods.k_normalize(k_mins, 2, {k_number: true})
}; },

k_getData: function(k_data) {
var
k_TIME = kerio.waw.shared.k_CONSTANTS.k_TIME_CONSTANTS,
k_time = k_data.k_time.split(':'),
k_days, k_hours, k_mins;
k_days  = k_data.k_days;
k_hours = parseInt(k_time[0], 10);
k_mins  = parseInt(k_time[1], 10);
return {
value: k_days * k_TIME.k_SECONDS_IN_DAY + k_hours * k_TIME.k_SECONDS_IN_HOUR + k_mins * k_TIME.k_SECONDS_IN_MIN
}; }
}, 
_k_editorOffsetTime: {
k_defaultItem: 'k_time',
k_formCfg: {
k_items: [
{
k_id: 'k_time',
k_caption: kerio.lib.k_tr('Time:', 'dhcpOptionEditor'),
k_width: 75,
k_value: '00:00',
k_maxLength: 5, k_validator: {
k_functionName: 'k_isTime',
k_allowBlank: false
}
},
{
k_type: 'k_checkbox',
k_id: 'k_isNegative',
k_caption: '',
k_option: kerio.lib.k_tr('Negative', 'dhcpOptionEditor')
},
{
k_type: 'k_display',
k_id:   'k_editorInfo',
k_caption: ' ', k_value: kerio.lib.k_tr('Time in range 0:00 to 23:59 that can be either positive or negative (e.g. -8:00).', 'dhcpOptionEditor')
}
] },

k_setData: function(k_data) {
var
k_wawShared = kerio.waw.shared,
k_TIME = k_wawShared.k_CONSTANTS.k_TIME_CONSTANTS,
k_isNegative = (0 > k_data.value),
k_time = Math.abs(k_data.value), k_hours = Math.floor(k_time / k_TIME.k_SECONDS_IN_HOUR),
k_mins  = Math.floor(k_time % k_TIME.k_SECONDS_IN_HOUR / k_TIME.k_SECONDS_IN_MIN);
return {
k_isNegative: k_isNegative,
k_time: '' + k_hours + ':' + k_wawShared.k_methods.k_normalize(k_mins, 2, {k_number: true})
}; },

k_getData: function(k_data) {
var
k_TIME = kerio.waw.shared.k_CONSTANTS.k_TIME_CONSTANTS,
k_time = k_data.k_time.split(':'),
k_days, k_hours, k_mins,
k_value;
k_days  = k_data.k_days;
k_hours = parseInt(k_time[0], 10);
k_mins  = parseInt(k_time[1], 10);
k_value = k_hours * k_TIME.k_SECONDS_IN_HOUR + k_mins * k_TIME.k_SECONDS_IN_MIN;
if (k_data.k_isNegative) {
k_value *= -1; }
return {
value: k_value
}; }
}, 
_k_editorListIpAddresses: function(k_optionType) {
var
k_wawShared = kerio.waw.shared,
k_types = k_wawShared.k_CONSTANTS.DhcpOptionType,
k_tr = kerio.lib.k_tr,
k_mergeObjects = k_wawShared.k_methods.k_mergeObjects,
k_isThirdInputVisible = false,
k_separatorSafeValue = '/ ',
k_info,
k_formCfg,
k_formItems,
k_items,
k_secondRowItems,
k_thirdRowItems,
k_validator = k_types.DhcpIpMaskIpList === k_optionType ? 'k_isRouteMask' : 'k_isIpMask',
k_ipAddressValidator = k_types.DhcpIpMaskIpList === k_optionType ? 'k_isRouteIpAddress' : 'k_isIpAddress';
switch (k_optionType) {
case k_types.DhcpIpPairList:
k_info = k_tr('Pair of independent IP addresses.', 'dhcpOptionEditor');
k_separatorSafeValue = ', ';
k_validator = 'k_isIpAddress';
break;
case k_types.DhcpIpMaskList:
k_info = k_tr('IP address with relevant mask.', 'dhcpOptionEditor');
break;
case k_types.DhcpIpMaskIpList:
k_info = k_tr('One IP address with relevant mask and one independent IP address.', 'dhcpOptionEditor');
k_isThirdInputVisible = true;
break;
default:
kerio.lib.k_reportError('DHCP option LIST IP ADDRESSES editor does not support value type ' + k_optionType, 'dhcpOptionEditor', '_k_editorListIpAddresses');
}
k_formCfg = {
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_id: 'k_ipFirst1',
k_caption: k_tr('Value 1:', 'dhcpOptionEditor'),
k_width: 96,
k_maxLength: 15,
k_validator: {
k_allowBlank: true,
k_functionName: k_ipAddressValidator,
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
},
{
k_id: 'k_listIpSeparatorFirst1',
k_width: 5,
k_type: 'k_display',
k_isSecure: true,
k_value: k_separatorSafeValue
},
{
k_id: 'k_ipSecond1',
k_width: 96,
k_maxLength: 15,
k_isLabelHidden: true,
k_validator: {
k_allowBlank: true,
k_functionName: k_validator,
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
}
] } ] }; k_formItems = k_formCfg.k_items[0];
k_secondRowItems = {
k_items: {
0: {
k_id: 'k_ipFirst2',
k_caption: k_tr('Value 2:', 'dhcpOptionEditor')
},
1: {
k_id:   'k_listIpSeparatorFirst2'
},
2: {
k_id: 'k_ipSecond2'
}
} }; k_thirdRowItems = {
k_items: {
0: {
k_id: 'k_ipFirst3',
k_caption: k_tr('Value 3:', 'dhcpOptionEditor')
},
1: {
k_id:   'k_listIpSeparatorFirst3'
},
2: {
k_id: 'k_ipSecond3'
}
} }; if (k_isThirdInputVisible) {
k_items = k_formItems.k_items;
k_items.push({
k_id:   'k_listIpSeparatorSecond1',
k_width: 5,
k_type: 'k_display',
k_isSecure: true,
k_value: ', '
});
k_items.push({
k_id: 'k_ipThird1',
k_width: 96,
k_maxLength: 15,
k_isLabelHidden: true,
k_validator: {
k_allowBlank: true,
k_functionName: 'k_isIpAddress',
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
});
k_mergeObjects({
3: {
k_id: 'k_listIpSeparatorSecond2'
},
4: {
k_id: 'k_ipThird2'
}
},
k_secondRowItems.k_items
);
k_mergeObjects({
3: {
k_id: 'k_listIpSeparatorSecond3'
},
4: {
k_id: 'k_ipThird3'
}
},
k_thirdRowItems.k_items
);
} k_secondRowItems = k_mergeObjects(k_secondRowItems, kerio.lib.k_cloneObject(k_formItems));
k_thirdRowItems = k_mergeObjects(k_thirdRowItems, kerio.lib.k_cloneObject(k_formItems));
k_formCfg.k_items.push( k_secondRowItems );
k_formCfg.k_items.push( k_thirdRowItems );
k_formCfg.k_items.push({
k_id:   'k_editorInfo',
k_type: 'k_display',
k_caption: ' ', k_value: k_info
});
return {
k_defaultItem: 'k_ipFirst1',
k_formCfg: k_formCfg,
k_addReferences: {
k_MAX_NUMBER_OF_ROWS: 3,
k_MAX_NUMBER_OF_COLUMNS: (k_isThirdInputVisible) ? 3 : 2,
k_origIsValid: null,
k_origData: null,
k_inputIds: [
[
'k_ipFirst1',
'k_ipSecond1',
'k_ipThird1'
],
[
'k_ipFirst2',
'k_ipSecond2',
'k_ipThird2'
],
[
'k_ipFirst3',
'k_ipSecond3',
'k_ipThird3'
]
]
}, 
k_setData: function(k_data) {
var
k_ipListList,
k_inputIds,
k_convertedData,
k_row, k_cntRow,
k_column, k_cntColumn,
k_rowData,
k_rowInputIds;
if (!this.k_origIsValid) {
this.k_origIsValid = this.k_isValid;

this.k_isValid = function (k_notifyUser) {
if (!this.k_origIsValid(k_notifyUser)) {
return false;
}
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_data = this._k_formGetData(),
k_inputIds = this.k_inputIds,
k_isFormIncomplete = false,
k_cntColumn = this.k_MAX_NUMBER_OF_COLUMNS,
k_i,
k_row, k_cntRow,
k_column,
k_isRowIncomplete,
k_inputId,
k_inputData,
k_rowInputIds,
k_cntEmpyInputs,
k_emptyInputs;
for (k_row = 0, k_cntRow = this.k_MAX_NUMBER_OF_ROWS; k_row < k_cntRow; k_row++) {
k_emptyInputs = [];
k_rowInputIds = k_inputIds[k_row];
for (k_column = 0; k_column < k_cntColumn; k_column++) {
k_inputId = k_rowInputIds[k_column];
k_inputData = k_data[k_inputId];
if ('' === k_inputData) {
k_emptyInputs.push(this.k_getItem(k_inputId));
}
}
k_cntEmpyInputs = k_emptyInputs.length;
k_isRowIncomplete = 0 < k_cntEmpyInputs && k_cntColumn > k_cntEmpyInputs;
if (k_isRowIncomplete) {
for (k_i = 0; k_i < k_cntEmpyInputs; k_i++) {
k_emptyInputs[k_i].k_markInvalid();
}
}
k_isFormIncomplete = k_isFormIncomplete || k_isRowIncomplete;
}
if (k_isFormIncomplete) {
k_lib.k_alert(
k_tr('Validation Warning', 'common'),
k_tr('All values in a row must be specified.', 'dhcpOptionEditor')
);
}
return !k_isFormIncomplete;
}; } this.k_origData = kerio.lib.k_cloneObject(k_data);
k_ipListList = k_data.ipListList;
k_convertedData = {};
if (k_ipListList) {
k_inputIds = this.k_inputIds;
k_cntRow = (k_ipListList.length < this.k_MAX_NUMBER_OF_ROWS) ? k_ipListList.length : this.k_MAX_NUMBER_OF_ROWS;
for (k_row = 0; k_row < k_cntRow; k_row++) {
k_rowData = k_ipListList[k_row];
k_rowInputIds = k_inputIds[k_row];
for (k_column = 0, k_cntColumn = k_rowData.length; k_column < k_cntColumn; k_column++) {
k_convertedData[k_rowInputIds[k_column]] = k_rowData[k_column];
}
}
}
return k_convertedData;
}, 
k_getData: function(k_data) {
var
k_lib = kerio.lib,
k_origData = this.k_origData || {},
k_removeIndices = [],
k_ipListList,
k_inputIds,
k_row, k_cntRow,
k_column, k_cntColumn,
k_rowData,
k_cellData,
k_rowInputIds,
k_removeRow;
k_ipListList = k_origData.ipListList;
if (k_ipListList) {
k_ipListList = k_lib.k_cloneObject(k_ipListList); }
else {
k_ipListList = [];
}
k_inputIds = this.k_inputIds;
for (k_row = 0, k_cntRow = this.k_MAX_NUMBER_OF_ROWS; k_row < k_cntRow; k_row++) {
k_rowData = [];
k_rowInputIds = k_inputIds[k_row];
k_removeRow = true;
for (k_column = 0, k_cntColumn = this.k_MAX_NUMBER_OF_COLUMNS; k_column < k_cntColumn; k_column++) {
k_cellData = k_data[k_rowInputIds[k_column]];
if ('' !== k_cellData && undefined !== k_cellData) {
k_removeRow = false;
}
k_rowData[k_column] = k_cellData;
}
if (k_removeRow) {
k_removeIndices.push(k_row);
}
k_ipListList[k_row] = k_rowData;
}
k_removeIndices.reverse();
for (k_row = 0, k_cntRow = k_removeIndices.length; k_row < k_cntRow; k_row++) {
k_ipListList.splice(k_removeIndices[k_row], 1);
}
k_origData.ipListList = k_ipListList;
return k_origData;
} }; } }; 
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_DhcpOptionEditorFactory._k_constructor', kerio.lib.K_Form,

{

k_getType: function() {
return this._k_optionType;
},

k_setData: function(k_data) {
if (this.k_getType() !== k_data.type) {
kerio.lib.k_reportError('DHCP option editor ' + this.k_getType()
+ ' used to editor option ' + k_data.optionId
+ ' with value type ' + k_data.type, 'dhcpOptionEditor', 'k_setData');
return;
}
if (this._k_needSetData) {
arguments[0] = this._k_editorSetData(k_data); }
return this._k_formSetData.apply(this, arguments);     },

k_getData: function() {
var k_data;
k_data = this._k_formGetData.apply(this, arguments); if (this._k_needGetData) {
k_data = this._k_editorGetData(k_data); }
k_data.type = this.k_getType(); return k_data;
},

k_focus: function(k_name) {
if ('string' !== typeof k_name && 'string' === typeof this._k_defaultItem) {
k_name = this._k_defaultItem;
}
return this._k_formFocus(k_name);
}
}); 