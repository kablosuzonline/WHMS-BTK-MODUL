
kerio.waw.ui.staticRouteEditor = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_DEFINITIONS = k_shared.k_DEFINITIONS,
k_methods = k_shared.k_methods,
k_isAdd = 'staticRouteEditorAdd' === k_objectName || 'ipv6StaticRouteEditorAdd' === k_objectName,
k_isIpv6 = 'ipv6StaticRouteEditorAdd' === k_objectName || 'ipv6StaticRouteEditorEdit' === k_objectName,
k_interfaceLoader,
k_dialogCfg,
k_dialog,
k_formCfg,
k_form;
k_formCfg = {
k_restrictBy: {
k_isIpv6: k_isIpv6
},
k_useStructuredData: true,
k_items: [
{
k_id: 'name',
k_caption: k_tr('Name:', 'common'),
k_maxLength: 63,
k_value: k_tr('New route', 'staticRouteEditor'),
k_validator: {
k_allowBlank: false
}
},
{
k_restrictions: {
k_isIpv6: [ false ]
},
k_id: 'network',
k_caption: k_tr('Network:', 'staticRouteEditor'),
k_maxLength: 15,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isRouteIpAddress',
k_inputFilter: k_DEFINITIONS.k_ipv4.k_allowedChars
},

k_onChange: function(k_form, k_element, k_value) {
kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars.apply(this, arguments);
kerio.waw.shared.k_methods.k_validateNetworkFieldsHandler.apply(this, arguments);
},

k_onBlur: function(k_form, k_element) {
var k_value = k_element.k_getValue();
kerio.waw.shared.k_methods.k_generateMaskForIp(k_value, { k_isRoute: true, k_form: k_form, k_maskFieldId: 'mask' });
}
},
k_DEFINITIONS.k_get('k_ipv4RouteMaskField', {
k_restrictions: {
k_isIpv6: [ false ]
},
k_id: 'mask',
k_onChange: k_methods.k_validateNetworkFieldsHandler
}),
{
k_restrictions: {
k_isIpv6: [ true ]
},
k_id: 'network',
k_caption: k_tr('Prefix:', 'staticRouteEditor'),
k_maxLength: k_CONSTANTS.k_MAX_LENGTH.k_IPV6_ADDRESS,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpv6Address',
k_inputFilter: k_DEFINITIONS.k_ipv6.k_allowedChars
},

k_onChange: function(k_form) {
var
k_fieldNetwork = k_form.k_getItem('network'),
k_fieldPrefixLength = k_form.k_getItem('prefixLen');
kerio.waw.shared.k_methods.k_allowOnlyIpv6Chars.apply(this, arguments);
if (!k_fieldNetwork.k_isValid(false) || !k_fieldPrefixLength.k_isValid(false)) {
return false;
}
k_form.k_validateIpv6NetworkAndPrefix();
}
},
{
k_restrictions: {
k_isIpv6: [ true ]
},
k_id: 'prefixLen',
k_caption: k_tr('Prefix length:', 'interfaceEditor'),
k_type: 'k_number',
k_minValue: 0,
k_maxValue: 128,
k_maxLength: 3,
k_validator: {
k_allowBlank: false
},

k_onChange: function(k_form) {
k_form.k_validateIpv6NetworkAndPrefix();
}
},
{
k_type: 'k_select',
k_id: 'k_interface',
k_caption: k_tr('Interface:', 'staticRouteEditor'),
k_localData: [],
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_fieldIconClassName: 'k_class'
},
{
k_restrictions: {
k_isIpv6: [ false ]
},
k_id: 'gateway',
k_caption: k_tr('Gateway:', 'staticRouteEditor'),
k_maxLength: 15,
k_validator: {
k_functionName: 'k_isIpAddress',
k_inputFilter: k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: k_methods.k_allowOnlyIpv4Chars
},
{
k_restrictions: {
k_isIpv6: [ true ]
},
k_id: 'gateway',
k_caption: k_tr('Gateway:', 'staticRouteEditor'),
k_maxLength: k_CONSTANTS.k_MAX_LENGTH.k_IPV6_ADDRESS,
k_validator: {
k_allowBlank: true,
k_functionName: 'k_isIpv6Address',
k_inputFilter: k_DEFINITIONS.k_ipv6.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv6Chars
},
{
k_type: 'k_number',
k_id: 'metric',
k_caption: k_tr('Metric:', 'staticRouteEditor'),
k_maxLength: 10,
k_minValue: 1,
k_value: 1,
k_maxValue: 2147483647
}
]
}; k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
if (k_isIpv6) {
k_form.k_addReferences({
k_validateIpv6NetworkAndPrefix: function() {
var
k_fieldNetwork = this.k_getItem('network'),
k_fieldPrefixLength = this.k_getItem('prefixLen'),
k_validationNetworkMessage;
if (!kerio.waw.shared.k_methods.k_validateIPv6Network(k_fieldNetwork.k_getValue(), k_fieldPrefixLength.k_getValue(), false)) {
k_validationNetworkMessage = kerio.lib.k_tr('The prefix does not match the prefix length.', 'common');
k_fieldNetwork.k_markInvalid(true, k_validationNetworkMessage);
k_fieldPrefixLength.k_markInvalid(true, k_validationNetworkMessage);
return false;
}
k_fieldNetwork.k_markInvalid(false);
k_fieldPrefixLength.k_markInvalid(false);
return true;
}
});
}
k_dialogCfg = {
k_width: 400,
k_height: 260,
k_title: k_isAdd ? k_tr('Add Route', 'staticRouteEditor') : k_tr('Edit Route', 'staticRouteEditor'),
k_content: k_form,
k_defaultItem: 'network',

k_onOkClick: function(k_toolbar) {
var
k_tr = kerio.lib.k_tr,
k_methods = kerio.waw.shared.k_methods,
k_dialog = k_toolbar.k_dialog,
k_routeData = k_dialog.k_form.k_getData(),
k_isReady = true;
if (k_dialog.k_isIpv6) {
if (!k_methods.k_validateIPv6Network(k_routeData.network, k_routeData.prefixLen, true)) {
k_isReady = false;
}
}
else {
k_routeData.mask = kerio.waw.shared.k_methods.k_convertCidrToMask(k_routeData.mask);
if (!k_methods.k_validateNetwork(k_routeData.network, k_routeData.mask, true)) {
k_isReady = false;
}
}
if (k_isReady && !k_dialog.k_interfaceLoader.k_isReady()) {
k_methods.k_alertError(
k_tr('No interface selected!', 'staticRouteEditor')
);
k_isReady = false;
}
if (!k_isReady && !k_dialog.k_relatedGrid.k_isRouteUnique(k_routeData, k_dialog.k_selectedRowIndex)) {
k_isReady = false;
}
if (!k_isReady) {
k_dialog.k_hideMask();
return;
}
k_dialog.k_saveData(k_routeData);
}
};
k_dialogCfg = k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_interfaceLoader = new k_methods.K_ListLoader({
k_list: 'k_interfacesEthernetRasList',
k_select: k_form.k_getItem('k_interface'),
k_addNoneOption: false,
k_value: {},
k_iconRenderer: k_methods.k_renderers.k_interfaceIconsForListLoader
});
k_dialog.k_addReferences({
k_isAdd: k_isAdd,
k_isIpv6: k_isIpv6,
k_form: k_form,
k_relatedGrid: undefined,
k_selectedRowIndex: undefined,
k_rowData: undefined,
k_interfaceLoader: k_interfaceLoader,
k_routeDataTemplate: {
k_status: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusClean,
enabled: true,
name: '',
type: k_CONSTANTS.RouteType.RouteStatic,
network: '',
mask: '',
gateway: '',
interfaceType: k_CONSTANTS.InterfaceType.Ethernet,interfaceId: {
id: '',
name: '',
invalid: false
},
metric: 1
}
});
k_dialog.k_interfaceLoader.k_interfaceStore = [];
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function(k_params){
this.k_interfaceLoader.k_sendRequest(); this.k_relatedGrid = k_params.k_relatedWidget;
if (this.k_isAdd) {
this.k_selectedRowIndex = undefined;
return;
}
this.k_rowData = k_params.k_data;
this.k_selectedRowIndex = k_params.k_rowIndex;
this.k_form.k_setData(k_params.k_data, true);
if(k_params.k_data.enabled && !k_params.k_data.interfaceId.invalid){
this.k_interfaceLoader.k_selectValue(k_params.k_data.interfaceId, true);
}
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };

k_kerioWidget.k_saveData = function(k_routeData) {
var
k_data;
if (this.k_isAdd) {
k_data = kerio.lib.k_cloneObject(this.k_routeDataTemplate);
} else {
k_data = this.k_rowData;
}
kerio.waw.shared.k_methods.k_mergeObjects(k_routeData, k_data);
k_data.interfaceId = this.k_interfaceLoader.k_getValue();
k_data.interfaceType = this.k_interfaceLoader.k_interfaceStore[k_data.interfaceId.id];
delete k_data.k_interface;
if (this.k_relatedGrid.k_storeRoute(k_data, this.k_selectedRowIndex)) {
this.k_hide();
}
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}};