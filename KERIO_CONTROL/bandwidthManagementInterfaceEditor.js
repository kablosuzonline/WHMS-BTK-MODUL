
kerio.waw.ui.bandwidthManagementInterfaceEditor = {
k_init: function(k_objectName, k_initParams) {
var
k_localNamespace = k_objectName + '_',
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_tr = kerio.lib.k_tr,
k_formCfg,
k_form,
k_dialogCfg,
k_dialog;
k_formCfg = {
k_useStructuredData: true,
k_items: [
{
k_type: 'k_container',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_isDefined',
k_value: false,
k_isChecked: true,
k_isLabelHidden: true,
k_option: k_tr('Apply defined policy on traffic on all Internet interfaces', 'bandwidthManagementInterfaceEditor'),
k_onChange: function(k_form, k_element, k_isDefined) {
k_form.k_setDisabled('k_interface', !k_isDefined || k_form.k_noInterfaces);
}
},
{
k_type: 'k_radio',
k_groupId: 'k_isDefined',
k_value: true,
k_isLabelHidden: true,
k_option: k_tr('Apply the policy on the selected interface only:', 'bandwidthManagementInterfaceEditor')
},
{
k_type: 'k_select',
k_id: 'k_interface',
k_isLabelHidden: true,
k_indent: 1,
k_isDisabled: true,
k_localData: [], k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_fieldIconClassName: 'k_icon'
}
]}
]
};
k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_height: 180,
k_width: 500,
k_title: k_tr('Interface', 'bandwidthManagementInterfaceEditor'),
k_content: k_form,
k_defaultItem: null,
k_onOkClick: function(k_form) {
k_form.k_dialog.k_saveData();
}
};
k_dialogCfg = k_WAW_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_callback: null,
k_interfacesStore: {}
});
k_form.k_addReferences({
k_dialog: k_dialog,
k_interface: k_form.k_getItem('k_interface'),
k_noInterfacesMsg: k_tr('No interfaces', 'bandwidthManagementInterfaceEditor'),
k_noInterfaces: false,
k_removeLast: false,k_relatedGrid: {}
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function (k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_interfaceId = k_params.k_data.interfaceId,
k_form = this.k_form,
k_interface = k_form.k_interface,
k_interfacesStore,
k_value;
this.k_interfacesStore =k_params.k_relatedGrid.k_interfacesStore;
k_interfacesStore = this.k_interfacesStore;
this.k_removeLast = false;
k_form.k_interface.k_clearData();
if (0 === this.k_interfacesStore.length) {
k_form.k_noInterfaces = true;
} else {
k_form.k_noInterfaces = false;
}
if ('' === k_interfaceId.id) {
if (k_form.k_noInterfaces) {
k_value = k_form.k_noInterfacesMsg;
}
} else {
if (k_interfaceId.invalid) {
k_interfacesStore.push(
{
k_name: k_interfaceId.name,
k_id: k_interfaceId.id,
k_icon: 'interfaceIcon interfaceEthernet dead'
}
);
k_interfacesStore[k_interfaceId.id] = k_interfaceId;
this.k_removeLast = true;
}
k_value = k_interfaceId.id;
}
if (0 !== this.k_interfacesStore) {
k_form.k_interface.k_setData(this.k_interfacesStore);
}
k_form.k_interface.k_setValue(k_value, true);
k_form.k_setData({
k_isDefined: ('' !== k_interfaceId.id)
}, true);
this.k_callback = k_params.k_callback;
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); }; 
k_kerioWidget.k_saveData = function() {
var
k_form = this.k_form,
k_formData = k_form.k_getData(),
k_interface,
k_data = {
id: '',
name: '',
invalid: false
};
if (k_formData.k_isDefined) {
if (k_form.k_noInterfaces) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('No available interface', 'trafficNatEditor'), k_msg: kerio.lib.k_tr('There is no interface available. The defined policy will be applied on all Internet traffic.', 'trafficNatEditor'),
k_icon: 'warning'
});
}
else {
k_interface = this.k_interfacesStore[this.k_form.k_interface.k_getValue()];
k_data = {
id: k_interface.id,
name: k_interface.name,
invalid: k_interface.invalid
};
}
}
if (this.k_removeLast) {
this.k_interfacesStore.pop();
}
this.k_callback({ interfaceId: k_data });
this.k_hide();
}; } }; 