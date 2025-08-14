

kerio.waw.ui.dnsList = {

k_init: function(k_objectName) {
var
k_lib = kerio.lib,
k_shared = kerio.waw.shared,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_tr = k_lib.k_tr,
k_localNamespace,
k_form, k_formCfg,
k_toolbarCfg;
k_localNamespace = k_objectName + '_';
k_formCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('DNS forwarding', 'dnsList'),
k_items: [
{
k_id: 'forwarderEnabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_option: k_tr('Enable the DNS forwarding service', 'dnsList')
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('DNS resolution', 'dnsList'),
k_items: [
{
k_type: 'k_columns',
k_items: [
{
k_id: 'cacheEnabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_option: k_tr('Enable DNS cache for faster responses to repeated queries', 'dnsList')
},
{
k_type: 'k_formButton',
k_id: 'k_btnClearCache',
k_caption: k_tr('Clear Cache', 'dnsList'),
k_isHidden: k_isAuditor,
k_mask: false,

k_onClick: function(k_form) {
kerio.lib.k_ajax.k_request(k_form.k_clearCacheRequestCfg);
}
}
] },
{
k_type: 'k_columns',
k_items: [
{
k_id: 'customForwardingEnabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_option: k_tr('Enable custom DNS forwarding', 'dnsList'),

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled('k_btnForwarders', !k_isChecked);
} },
{
k_type: 'k_formButton',
k_id: 'k_btnForwarders',
k_isDisabled: true,
k_caption: (k_isAuditor)
? k_tr('View…', 'common')
: k_tr('Edit…', 'common'),

k_onClick: function(k_form) {
k_form.k_editForwarders();
} }
] },
{
k_id: 'k_labelDnsQueries',
k_type: 'k_display',
k_isHidden: true,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_template: k_tr('All *.%1 DNS queries will be forwarded to the domain controller.', 'dnsList', {k_args: ['{k_domain}']}),
k_value: {
k_domain: 'kerio.local'
}
}
] },
{
k_type: 'k_fieldset',
k_caption: k_tr('Local DNS lookup', 'dnsList'),
k_items: [
{
k_type: 'k_display',
k_value: k_tr('Before forwarding the query to DNS server, search for it in:', 'dnsList')
},
{
k_type: 'k_columns',
k_items: [
{
k_id: 'hostsEnabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_option: k_tr('Hosts table', 'dnsList'),

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled('k_btnHosts', !k_isChecked);
} },
{
k_type: 'k_formButton',
k_id: 'k_btnHosts',
k_isDisabled: true,
k_caption: (k_isAuditor)
? k_tr('View…', 'common')
: k_tr('Edit…', 'common'),

k_onClick: function(k_form) {
k_form.k_editHosts();
} }
] },
{
k_id: 'dhcpLookupEnabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_option: k_tr('DHCP lease table', 'dnsList')
},
{
k_type: 'k_display',
k_indent: 1,
k_template: '<a>' + k_tr('The lease table can be viewed in %1', 'dnsList', {
k_args: [ k_shared.k_DEFINITIONS.k_get('k_MENU_TREE_NODES.dhcpServerList') ]
}) + '</a>',

k_onLinkClick: function() {
kerio.waw.status.k_currentScreen.k_gotoNode('dhcpServer');
}
},
{
k_type: 'k_display',
k_isReadOnly: k_isAuditor,
k_value: k_tr('When resolving a DNS name from the hosts table or the lease table, combine it with the DNS domain below:', 'dnsList')
},
{
k_id: 'domainName',
k_isLabelHidden: true,
k_isReadOnly: k_isAuditor,
k_maxLength: k_shared.k_CONSTANTS.k_MAX_LENGTH.k_DOMAIN_NAME,
k_width: k_lib.k_isIPadCompatible ? undefined : 400,
k_validator: {
k_functionName: 'k_hasNoSpaces'
}
}
] }
]};if (!k_isAuditor) {
k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function() {
this.k_parentWidget.k_sendData();
kerio.adm.k_framework.k_enableApplyReset(false);
return false;
},

k_onReset: function(k_toolbar) {
this.k_parentWidget.k_loadData();
kerio.adm.k_framework.k_enableApplyReset(false);
}
};
k_formCfg.k_toolbars = {
k_bottom: new kerio.adm.k_widgets.K_ActionToolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg)
};
}
k_form = new k_lib.K_Form(k_objectName, k_formCfg);
this.k_addControllers(k_form);
k_form.k_addReferences({
k_isAuditor: k_isAuditor,
k_dataStore: {},
k_hostsStore: '',
k_isHostsChanged: false, k_isForwarderChanged: false, k_labelDnsQueries: k_form.k_getItem('k_labelDnsQueries'),
k_loadDataRequestCfg: {
k_jsonRpc: {
method: 'Dns.get'
},
k_callback: k_form.k_loadDataCallback,
k_scope: k_form
},
k_loadHostsRequestCfg: {
k_jsonRpc: {
method: 'Dns.getHosts'
},
k_callback: k_form.k_loadHostsCallback,
k_scope: k_form
},
k_saveRequestCfg: { k_requests: [],
k_callback: k_form.k_sendDataCallback,
k_scope: k_form
},
k_setDataRequestCfg: {
method: 'Dns.set',
params: {}
},
k_setHostsRequestCfg: {
method: 'Dns.setHosts',
params: {}
},
k_clearCacheRequestCfg: {
k_jsonRpc: {
method: 'Dns.clearCache'
},
k_callback: k_form.k_clearCacheCallback,
k_requestOwner: null
}
});
return k_form;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function() {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
this.k_isHostsChanged = false;
this.k_loadData();
};

k_kerioWidget.k_loadData = function(k_refresh) {
if (false === k_refresh && !this.k_isForwarderChanged) { this.k_isHostsChanged = false;
this.k_loadDataCallback({ k_decoded: { config: this.k_dataStore }}, true); }
else {
kerio.waw.shared.k_methods.k_maskMainScreen(this);
kerio.lib.k_ajax.k_request(this.k_loadDataRequestCfg);
}
};
k_kerioWidget.k_loadDataCallback = function(k_response, k_success) {
var
k_isDomainJoined = false,
k_useDomainControler,
k_config;
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_dialogs: ['dnsHostsEditor', 'dnsForwardersList']
});
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
if (!k_success || !k_response.k_decoded.config) {
return;
}
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
if (!k_success || !k_response.k_decoded.config) {
return;
}
this.k_reset();
k_config = k_response.k_decoded.config;
this.k_dataStore = k_config;
this.k_setData(this.k_dataStore, true);
k_useDomainControler = k_config.useDomainControler;
if (k_useDomainControler) {
k_isDomainJoined = k_useDomainControler.enabled;
if (k_isDomainJoined) {
this.k_labelDnsQueries.k_setValue({k_domain: k_useDomainControler.value});
}
}
this.k_labelDnsQueries.k_setVisible(k_isDomainJoined);
kerio.adm.k_framework.k_enableApplyReset(false);
this.k_isForwarderChanged = false;
this.k_isHostsChanged = false;
};
k_kerioWidget.k_editForwarders = function() {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'dnsForwardersList',
k_params: {
k_data: this.k_dataStore.customForwarders,
k_callback: this.k_editForwardersCallback.createDelegate(this, [], true)
}
});
}; 
k_kerioWidget.k_editForwardersCallback = function(k_hosts) {
this.k_dataStore.customForwarders = k_hosts;
this.k_isForwarderChanged = true;
kerio.adm.k_framework.k_enableApplyReset();
return true;
}; 
k_kerioWidget.k_editHosts = function() {
if (this.k_isHostsChanged) {
this.k_loadHostsCallback();
}
else {
kerio.waw.shared.k_methods.k_maskMainScreen(this);
kerio.lib.k_ajax.k_request(this.k_loadHostsRequestCfg);
}
};
k_kerioWidget.k_loadHostsCallback = function(k_response, k_success) {
if (k_response) { kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
if (!this.k_isHostsChanged) {
if (!k_success || !k_response.k_isOk) {
return;
}
this.k_hostsStore = k_response.k_decoded.hosts;
} kerio.lib.k_ui.k_showDialog({
k_sourceName: 'dnsHostsEditor',
k_params: {
k_hosts: this.k_hostsStore,
k_callback: this.k_editHostsCallback.createDelegate(this, [], true)
}
});
};
k_kerioWidget.k_editHostsCallback = function(k_hosts) {
this.k_hostsStore = k_hosts;
this.k_isHostsChanged = true;
kerio.adm.k_framework.k_enableApplyReset();
}; 
k_kerioWidget.k_sendData = function() {
var
k_requests = [];
if (this.k_isChanged() || this.k_isForwarderChanged) {
kerio.waw.shared.k_methods.k_mergeObjects(this.k_getData(true), this.k_dataStore);
this.k_setDataRequestCfg.params = { config: this.k_dataStore };
k_requests.push(this.k_setDataRequestCfg);
}
if (this.k_isHostsChanged) {
this.k_setHostsRequestCfg.params = { hosts: this.k_hostsStore };
k_requests.push(this.k_setHostsRequestCfg);
}
if (0 === k_requests.length) { this.k_loadData(false);
return;
}
this.k_saveRequestCfg.k_requests = k_requests;
kerio.waw.shared.k_methods.k_sendBatch(this.k_saveRequestCfg);
}; 
k_kerioWidget.k_sendDataCallback = function(k_response, k_success) {
if (!k_success || !kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
}
if (!kerio.adm.k_framework.k_leaveCurrentScreen()) {
this.k_isForwarderChanged = false;
this.k_loadData(true);
}
}; 
k_kerioWidget.k_clearCacheCallback = function(k_response, k_success) {
if (k_success && k_response.k_isOk) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Clear Cache', 'dnsList'),
k_msg: kerio.lib.k_tr('Successfully flushed the DNS Cache.', 'dnsList')
});
}
};
}}; 