
kerio.waw.ui.interfaceVpnTunnelCipherEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_INTERFACE_VPN_TUNNEL_CIPHERS = kerio.waw.shared.k_CONSTANTS.k_INTERFACE_VPN_TUNNEL_CIPHERS,
k_DEFAULT_CIPHER_IKE = k_INTERFACE_VPN_TUNNEL_CIPHERS.k_DEFAULT_CIPHER_IKE,
k_DEFAULT_CIPHER_ESP = k_INTERFACE_VPN_TUNNEL_CIPHERS.k_DEFAULT_CIPHER_ESP,
k_defaultIkeParse = k_DEFAULT_CIPHER_IKE.split(','),
k_defaultEspParse = k_DEFAULT_CIPHER_ESP.split(','),
k_DEFAULT_VALUE = 'default',
k_CUSTOM_VALUE = 'custom',
k_espDhNoneOption = 'none (no PFS)',
k_form, k_formCfg,
k_dialog, k_dialogCfg;
k_formCfg = {
k_useStructuredData: true,
k_labelWidth: 130,
k_items: [
{
k_type: 'k_row',
k_height: 30,
k_items: [
{
k_type: 'k_radio',
k_groupId: 'cipherConfiguration',
k_option: k_tr('Default ciphers', 'interfaceVpnTunnelEditor'),
k_value: k_DEFAULT_VALUE,
k_isLabelHidden: true,
k_isChecked: true,
k_width: 150,
k_onChange: function(k_form, k_radio, k_value) {
var
k_DEFAULT_VALUE = k_form.k_parentWidget.k_DEFAULT_VALUE;
k_form.k_setDisabled(['k_defaultPrimaryHeader', 'k_defaultFallbackHeader', 'k_defaultIkeRow', 'k_defaultEspRow'], k_DEFAULT_VALUE !== k_value);
k_form.k_setDisabled(['k_customEncryptionHeader', 'k_customIntegrityHeader', 'k_customDhGroupsHeader', 'k_customIkeRow', 'k_customEspRow'], k_DEFAULT_VALUE === k_value);
}
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Primary:', 'interfaceVpnTunnelEditor'),
k_width: 165,
k_itemClassName: 'cipherHeader',
k_id: 'k_defaultPrimaryHeader'
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Fallback:', 'interfaceVpnTunnelEditor'),
k_width: 165,
k_itemClassName: 'cipherHeader',
k_id: 'k_defaultFallbackHeader'
}
]
},
{
k_type: 'k_row',
k_id: 'k_defaultIkeRow',
k_indent: 1,
k_items: [
{
k_id: 'primaryIke',
k_caption: k_tr('Phase 1 (IKE) cipher:', 'interfaceVpnTunnelEditor'),
k_isReadOnly: true,
k_width: 165,
k_value: k_defaultIkeParse[0]
},
{
k_id: 'fallbackIke',
k_isLabelHidden: true,
k_isReadOnly: true,
k_width: 165,
k_value: k_defaultIkeParse[1]
}
]
},
{
k_type: 'k_row',
k_id: 'k_defaultEspRow',
k_indent: 1,
k_items: [
{
k_id: 'primaryEsp',
k_caption: k_tr('Phase 2 (ESP) cipher:', 'interfaceVpnTunnelEditor'),
k_isReadOnly: true,
k_width: 165,
k_value: k_defaultEspParse[0]
},
{
k_id: 'fallbackEsp',
k_isLabelHidden: true,
k_isReadOnly: true,
k_width: 165,
k_value: k_defaultEspParse[1]
}
]
},
{
k_type: 'k_row',
k_style: 'padding-top: 15px;',
k_height: 45,
k_items: [
{
k_type: 'k_radio',
k_groupId: 'cipherConfiguration',
k_option: k_tr('Custom ciphers', 'interfaceVpnTunnelEditor'),
k_value: k_CUSTOM_VALUE,
k_width: 150,
k_isLabelHidden: true
},
{
k_id: 'k_customEncryptionHeader',
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Encryption:', 'interfaceVpnTunnelEditor'),
k_width: 110,
k_itemClassName: 'cipherHeader',
k_isDisabled: true
},
{
k_id: 'k_customIntegrityHeader',
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Integrity:', 'interfaceVpnTunnelEditor'),
k_width: 110,
k_itemClassName: 'cipherHeader',
k_isDisabled: true
},
{
k_id: 'k_customDhGroupsHeader',
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('DH Groups:', 'interfaceVpnTunnelEditor'),
k_width: 110,
k_itemClassName: 'cipherHeader',
k_isDisabled: true
}
]
},
{
k_type: 'k_row',
k_indent: 1,
k_id: 'k_customIkeRow',
k_isDisabled: true,
k_items: [
{
k_type: 'k_select',
k_caption: k_tr('Phase 1 (IKE) cipher:', 'interfaceVpnTunnelEditor'),
k_id: 'ike.encryption',
k_width: 100,
k_fieldDisplay: 'k_id',
k_fieldValue: 'k_id',
k_localData: [
{ k_id: 'aes128' },
{ k_id: 'aes192' },
{ k_id: 'aes256' },
{ k_id: '3des' }
]
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: '-',
k_width: 5
},
{
k_type: 'k_select',
k_isLabelHidden: true,
k_width: 100,
k_id: 'ike.integrity',
k_fieldDisplay: 'k_id',
k_fieldValue: 'k_id',
k_localData: [
{ k_id: 'md5' },
{ k_id: 'sha1' },
{ k_id: 'sha2_256' },
{ k_id: 'sha2_384' },
{ k_id: 'sha2_512' }
]
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: '-',
k_width: 5
},
{
k_type: 'k_select',
k_isLabelHidden: true,
k_width: 100,
k_id: 'ike.dhGroups',
k_fieldDisplay: 'k_id',
k_fieldValue: 'k_id',
k_localData: [
{ k_id: 'modp1024' },
{ k_id: 'modp1536' },
{ k_id: 'modp2048' },
{ k_id: 'modp3072' },
{ k_id: 'modp4096' },
{ k_id: 'modp8192' },
{ k_id: 'modp1024s160' },
{ k_id: 'modp2048s224' },
{ k_id: 'modp2048s256' }
]
}
]
},
{
k_type: 'k_row',
k_id: 'k_customEspRow',
k_isDisabled: true,
k_indent: 1,
k_items: [
{
k_type: 'k_select',
k_caption: k_tr('Phase 2 (ESP) cipher:', 'interfaceVpnTunnelEditor'),
k_width: 100,
k_id: 'esp.encryption',
k_fieldDisplay: 'k_id',
k_fieldValue: 'k_id',
k_localData: [
{ k_id: 'aes128' },
{ k_id: 'aes192' },
{ k_id: 'aes256' },
{ k_id: '3des' },
{ k_id: 'blowfish256' }
]
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: '-',
k_width: 5
},
{
k_type: 'k_select',
k_isLabelHidden: true,
k_width: 100,
k_id: 'esp.integrity',
k_fieldDisplay: 'k_id',
k_fieldValue: 'k_id',
k_localData: [
{ k_id: 'md5' },
{ k_id: 'sha1' },
{ k_id: 'sha2_256' },
{ k_id: 'sha2_384' },
{ k_id: 'sha2_512' },
{ k_id: 'aesxcbc' }
]
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: '-',
k_width: 5
},
{
k_type: 'k_select',
k_isLabelHidden: true,
k_width: 100,
k_id: 'esp.dhGroups',
k_fieldDisplay: 'k_id',
k_fieldValue: 'k_id',
k_localData: [
{ k_id: k_espDhNoneOption },
{ k_id: 'modp1024' },
{ k_id: 'modp1536' },
{ k_id: 'modp2048' },
{ k_id: 'modp3072' },
{ k_id: 'modp4096' },
{ k_id: 'modp8192' },
{ k_id: 'modp1024s160' },
{ k_id: 'modp2048s224' },
{ k_id: 'modp2048s256' }
]
}
]
}
]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 531,
k_height: 280,
k_content: k_form,
k_title: k_tr('VPN Tunnel Ciphers Configuration', 'interfaceVpnTunnelEditor'),
k_defaultItem: null,
k_onOkClick: function(k_toolbar) {
k_toolbar.k_dialog.k_saveData();
}
};
k_dialogCfg = k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_DEFAULT_CIPHER_IKE: k_DEFAULT_CIPHER_IKE,
k_DEFAULT_CIPHER_ESP: k_DEFAULT_CIPHER_ESP,
k_DEFAULT_VALUE: k_DEFAULT_VALUE,
k_CUSTOM_VALUE: k_CUSTOM_VALUE,
k_espDhNoneOption: k_espDhNoneOption,
k_form: k_form,
k_parentForm: undefined,
k_dataStore: undefined
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_tunnelData = k_params.k_data.tunnel,
k_cipherIke = k_tunnelData.cipherIke,
k_cipherEsp = k_tunnelData.cipherEsp,
k_parsedIke = k_cipherIke.split(','),
k_parsedEsp = k_cipherEsp.split(','),
k_customIkeParsed, k_customEspParsed,
k_dialogData = {};
this.k_dataStore = k_params.k_data;
this.k_parentForm = k_params.k_relatedWidget;
if (this.k_DEFAULT_CIPHER_IKE === k_cipherIke && this.k_DEFAULT_CIPHER_ESP === k_cipherEsp) {
k_dialogData.cipherConfiguration = this.k_DEFAULT_VALUE;
}
else {
k_dialogData.cipherConfiguration = this.k_CUSTOM_VALUE;
}
k_customIkeParsed = k_parsedIke[0].split('-');
k_dialogData.ike = {
encryption: k_customIkeParsed[0],
integrity: k_customIkeParsed[1],
dhGroups: k_customIkeParsed[2]
};
k_customEspParsed = k_parsedEsp[0].split('-');
if (2 === k_customEspParsed.length) {
k_customEspParsed[2] = this.k_espDhNoneOption;
}
k_dialogData.esp = {
encryption: k_customEspParsed[0],
integrity: k_customEspParsed[1],
dhGroups: k_customEspParsed[2]
};
this.k_form.k_setData(k_dialogData, true);
};
k_kerioWidget.k_saveData = function() {
var
k_formData = this.k_form.k_getData();
if (this.k_DEFAULT_VALUE === k_formData.cipherConfiguration) {
this.k_dataStore.tunnel.cipherIke = this.k_DEFAULT_CIPHER_IKE;
this.k_dataStore.tunnel.cipherEsp = this.k_DEFAULT_CIPHER_ESP;
}
else {
this.k_dataStore.tunnel.cipherIke = k_formData.ike.encryption + '-' + k_formData.ike.integrity + '-' + k_formData.ike.dhGroups;
this.k_dataStore.tunnel.cipherEsp = k_formData.esp.encryption + '-' + k_formData.esp.integrity;
if (this.k_espDhNoneOption !== k_formData.esp.dhGroups) {
this.k_dataStore.tunnel.cipherEsp += '-' + k_formData.esp.dhGroups;
}
}
this.k_parentForm.k_dialog.k_authenticationForm.k_setDataIfNew(this.k_dataStore);
this.k_hide();
};
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
}
};
