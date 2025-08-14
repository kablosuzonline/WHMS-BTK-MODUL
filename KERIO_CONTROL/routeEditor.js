
kerio.waw.ui.routeEditor = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isEditor = (k_objectName === 'k_routeEdit'),
k_formCfg, k_form,
k_dialogCfg, k_dialog;
k_formCfg = {
k_items: [
{	k_type: 'k_fieldset',
k_caption: k_tr('Custom VPN route', 'routeEditor'),
k_items: [
{	k_caption: k_tr('Network:', 'trafficHostEditor'),
k_id: 'network',
k_maxLength: 15,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isRouteIpAddress',
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},

k_onChange: function(k_form, k_element, k_value) {
kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars.apply(this, arguments);
kerio.waw.shared.k_methods.k_validateNetworkFieldsHandler.apply(this, arguments);
},

k_onBlur: function(k_form, k_element) {
var k_value = k_element.k_getValue();
kerio.waw.shared.k_methods.k_generateMaskForIp(k_value, { k_isRoute: true, k_form: k_form, k_maskFieldId: 'k_mask' });
}
},
kerio.waw.shared.k_DEFINITIONS.k_get('k_ipv4RouteMaskField', {
k_id: 'mask',
k_onChange: kerio.waw.shared.k_methods.k_validateNetworkFieldsHandler
}),
{	k_caption: k_tr('Description:', 'common'),
k_id: 'description',
k_maxLength: 255,
k_checkByteLength: true
}
]
}
]
};k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 350,
k_height: 205,
k_hasHelpIcon: false,
k_title: (k_isEditor ? k_tr('Edit Route', 'routeEditor') : k_tr('Add Route', 'routeEditor')),
k_content: k_form,
k_buttons: [
{	k_isDefault: true,
k_id: 'k_btnOk',
k_caption: k_tr('OK', 'common'),
k_mask: {
k_message: k_tr('Saving…', 'common')
},

k_onClick: function() {
this.k_dialog.k_sendData();
}
},
{	k_isCancel: true,
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'common')
}
]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences(
{	k_isEditor: k_isEditor,
k_relatedWidget: {},
k_routeId: '',
k_enabled: true,
k_form: k_form,
k_relatedGrid: null
}
);
k_form.k_addReferences({
k_validateNetworkFields: kerio.waw.shared.k_methods.k_validateNetworkFields
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_data;
this.k_relatedGrid = k_params.k_parentGrid;
if (this.k_isEditor) {
k_data = k_params.k_data;
this.k_routeId = k_data.id;
this.k_enabled = k_data.enabled;
this.k_form.k_setData(k_data, true);
} else {
this.k_enabled = true;}
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };
k_kerioWidget.k_sendData = function() {
var
k_rowData = this.k_form.k_getData(true),
k_isEditor = this.k_isEditor,
k_routes,
k_route,
k_i, k_cnt;
k_rowData.id = this.k_routeId;
k_rowData.enabled = this.k_enabled;
k_rowData.mask = kerio.waw.shared.k_methods.k_convertCidrToMask(k_rowData.mask);
if (!this.k_form.k_validateNetworkFields(true)) { this.k_hideMask();
return;
}
k_routes = this.k_relatedGrid.k_getData();
for (k_i = 0, k_cnt = k_routes.length; k_i < k_cnt; k_i++) {
k_route = k_routes[k_i];
if ((k_rowData.network === k_route.network && k_rowData.mask === k_route.mask) && (!k_isEditor || k_rowData.id !== k_route.id)) {
kerio.waw.shared.k_methods.k_alertError(
kerio.lib.k_tr('Route %1 (%2) is already defined for current interface.', 'routeEditor',
{
k_args: [k_rowData.network, k_rowData.mask]
}
)
);
this.k_hideMask();
return;
}
}
if (k_isEditor) {
this.k_relatedGrid.k_updateRow(k_rowData);
} else {
this.k_relatedGrid.k_appendRow(k_rowData);
}
this.k_relatedGrid.k_resortRows();
this.k_hide();
};
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};} }; 