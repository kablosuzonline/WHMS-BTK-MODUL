

kerio.waw.ui.ipAddressGroupEditor = {

k_init: function(k_objectName) {
var k_dialogCfg, k_dialog;
k_dialogCfg = {
k_isDataRefreshable: false,
k_onClose: function(k_response, k_isEditMode) {
if ('addressGroupList' === this.k_id) {
kerio.waw.shared.k_data.k_get(this.k_dataStoreId, true);
kerio.adm.k_framework.k_enableApplyReset();
}
}
};
k_dialog = new kerio.waw.shared.k_widgets.K_IpAddressGroupEditor(k_objectName, k_dialogCfg);
kerio.waw.shared.k_data.k_cache({ k_dialog: k_dialog }); return k_dialog;
}
};

kerio.waw.shared.k_widgets = kerio.waw.shared.k_widgets || {}; kerio.waw.shared.k_widgets.K_IpAddressGroupEditor = function (k_id, k_config){
var
k_dialogTitle,
k_translations,
k_hasChildGroup,
k_options,
k_i,
k_hostElementCfg,
k_tr = kerio.lib.k_tr,
k_itemTypes = [], k_formItems = [], k_visibleItems = {}, k_allItems = [],
k_SHARED_CONSTANTS = kerio.lib.k_getSharedConstants(),
k_defaultItemType = k_config.k_defaultItem || k_SHARED_CONSTANTS.kerio_web_Host, k_showIpPrefix = true === k_config.k_showIpPrefix,
k_specificTypesTooltip,
k_geoIpCountriesList = kerio.lib.k_getSortedCountries(true);
k_specificTypesTooltip = [
'<table class=tableTooltip>',
'<tr><th>',k_tr('Possibilities', 'ipAddressGroupEditor'),'</th><th>', k_tr('Examples', 'ipAddressGroupEditor'),'</th></tr>',
'<tr><td>',k_tr('Host', 'ipAddressGroupEditor'),'</td><td>', 'www.domain.org','</td></tr>',
'<tr><td>',k_tr('All hosts from domain', 'ipAddressGroupEditor'),'</td><td>', 'domain.org','</td></tr>',
'<tr><td>',k_tr('IPv4 address', 'ipAddressGroupEditor'),'</td><td>', '192.168.0.1','</td></tr>',
'<tr><td>',k_tr('IPv4 range', 'ipAddressGroupEditor'),'</td><td>', '192.168.0.5-192.168.0.90','</td></tr>',
'<tr><td>',k_tr('IPv4 subnet mask', 'ipAddressGroupEditor'),'</td><td>', '192.168.0.0/255.255.255.0','</td></tr>',
'<tr><td>',k_tr('IPv4 network', 'ipAddressGroupEditor'),'</td><td>', '192.168.0.0/24','</td></tr>',
'<tr><td>',k_tr('IPv6 address', 'ipAddressGroupEditor'),'</td><td>', '12:34::2','</td></tr>',
'<tr><td>',k_tr('IPv6 range', 'ipAddressGroupEditor'),'</td><td>', '12:34::2-12:34::99','</td></tr>',
'<tr><td>',k_tr('IPv6 prefix', 'ipAddressGroupEditor'),'</td><td>', '12:34::/64','</td></tr>',
'</table>'
].join('');
k_csvUploadFormatTooltip = [
'<table class=tableTooltip>',
'<tr><th>',k_tr('Valid row formats:', 'ipAddressGroupEditor'),'</th></tr>',
'<tr><td>1. ',k_tr('IP and description', 'ipAddressGroupEditor'),'</td></tr>',
'<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;e.g. 192.168.0.1, Description</td></tr>',
'<tr><td>2. ',k_tr('IP only', 'ipAddressGroupEditor'),'</td></tr>',
'<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;e.g. 192.168.0.1</td></tr>',
'<tr><td>3. ',k_tr('Hostname and description', 'ipAddressGroupEditor'),'</td></tr>',
'<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;e.g. domain.example.org, Description</td></tr>',
'<tr><td>4. ',k_tr('Hostname only', 'ipAddressGroupEditor'),'</td></tr>',
'<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;e.g. domain.example.org</td></tr>',
'<tr><td /></tr>',
'<tr><th>', k_tr('NOTE: Row formats can be mixed within the same file as each row is processed individually.', 'ipAddressGroupEditor'), '</th></tr>',
'</table>'
].join('');
k_config.k_translations = k_config.k_translations || {
k_geoIpPreset: k_tr('Import GeoIP Preset', 'ipAddressGroup'),
};
k_config.k_isEditMode = true;
if ('ipAddressGroupEdit' === k_id) {
k_dialogTitle = k_tr('Edit IP Address', 'wlibIpAddressGroupEditor');
}
else if ('ipAddressGroupEditorView' === k_id) {
k_dialogTitle = k_tr('View IP Address', 'wlibIpAddressGroupEditor');
k_config.k_isReadOnly = true;
}
else {
k_config.k_isEditMode = false;
k_dialogTitle = k_tr('Add IP Address', 'wlibIpAddressGroupEditor');
}
k_config.k_size = {
k_height: 321,
k_minHeight: 321,
k_width: 450,
k_minWidth: 450
};
k_translations = this._k_getTranslations(k_config.k_translations);
k_hasChildGroup = false; this._k_canSaveHostname = false !== k_config.k_canSaveHostname;k_formItems.push({
k_type: 'k_row',
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_groupItemType',
k_option: [
'<span ',
kerio.lib.k_buildTooltip(k_specificTypesTooltip, true),
'>',
k_tr('Addresses', 'ipAddressGroup'),
'<span class="tooltip" ',
kerio.lib.k_buildTooltip(k_specificTypesTooltip, true),
'>&nbsp; &nbsp; &nbsp;</span></span>'
].join(''),
k_value: k_SHARED_CONSTANTS.kerio_web_Host,
k_isLabelHidden: true,
k_isChecked: true,
k_onChange: function(k_form, k_radio, k_value) {
var
k_SHARED_CONSTANTS = k_form.k_dialog._k_SHARED_CONSTANTS,
k_isHostRow = k_value === k_SHARED_CONSTANTS.kerio_web_Host,
k_isChildGroup = k_value === k_SHARED_CONSTANTS.kerio_web_ChildGroup;
k_form.k_setDisabled('k_hostName', !k_isHostRow);
k_form.k_setDisabled('k_childGroup', !k_isChildGroup);
k_form.k_setDisabled('k_csvFile', !k_isHostRow);
},
k_width: 125
},
{
k_id: 'k_hostName',
},
{
k_type: 'k_row',
k_isLabelHidden: true,
k_width: 115,
k_items: [
{
k_type: 'k_formUploadButton',
k_id: 'k_csvFile',
k_value: k_tr('File:', 'importCsv'),
k_caption: 'Load CSV',
k_remoteData: {
k_isAutoUpload: false
},
k_onChange: function(k_form, k_item, k_value) {
var file = this.k_extWidget._kx.k_fileInput.dom.files[0];
if (!file || file.type !== 'text/csv') {
kerio.lib.k_alert({
k_icon: 'warning',
k_title: kerio.lib.k_tr('Incorrect Input', 'common'),
k_msg: kerio.lib.k_tr('Please select a CSV file.', 'advancedOptionsList')
});
k_item.k_reset();
return;
}
if (file.size > 1048576) { kerio.lib.k_alert({
k_icon: 'warning',
k_title: kerio.lib.k_tr('Invalid Input', 'common'),
k_msg: kerio.lib.k_tr('The file is too large. Please select a file with less than 1MB.', 'advancedOptionsList')
});
k_item.k_reset();
return;
}
var reader = new FileReader();
reader.onload = function(event) {
var hosts = event.target.result.split('\n').filter(function(line) {
return line.trim() !== '';
}).join('|');
k_form.k_items.k_hostName.k_setMaxLength(hosts.length+1);
k_form.k_items.k_hostName.k_setValue(hosts);
reader.onload = null;
};
reader.onerror = function(error) {
kerio.lib.k_alert({
k_icon: 'warning',
k_title: kerio.lib.k_tr('Invalid Input', 'common'),
k_msg: kerio.lib.k_tr('Error reading file.', 'advancedOptionsList')
});
k_item.k_reset();
reader.onerror = null;
};
reader.readAsText(file); }
},
{
k_type: 'k_display',
k_id: 'k_csvFile_Tooltip',
k_value: [
'<span class="tooltip" style="margin-left: 0px; padding-left: 0px"',
kerio.lib.k_buildTooltip(k_csvUploadFormatTooltip, true),
'>&nbsp; &nbsp; &nbsp;</span></span>'
].join(''),
k_isLabelHidden: true,
k_isSecure: true,
k_width: 25
}
]
}
]
});
k_formItems.push({
k_type: 'k_row',
k_isLabelHidden: true,
k_id: 'k_childGroup_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_groupItemType',
k_option: k_translations.k_group,
k_value: k_SHARED_CONSTANTS.kerio_web_ChildGroup,
k_isLabelHidden: true,
k_width: 125
},
{
k_type: 'k_select',
k_id: 'k_childGroup',
k_caption: k_translations.k_groupName,
k_fieldDisplay: 'name',
k_fieldValue: 'id',
k_isDisabled: true,
k_localData: {}, k_value: ''     }
]
});
if (!k_config.k_isEditMode) {
k_config.k_extendGroupItems = {
k_items: [{
k_type: 'k_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_groupName',
k_option: k_translations.k_geoIpPreset,
k_isLabelHidden: true,
k_value: 'k_import'
},
{
k_type: 'k_select',
k_id: 'k_importGroup',
k_localData: k_geoIpCountriesList,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',
k_value: '',
k_isLabelHidden: true
}
]
}],
k_onChange: function (k_form, k_radio) {
var k_isGeoIp = k_radio.k_getRadioGroup().k_getValue() === 'k_import';
k_form.k_setDisabled(['k_fieldsetProperties'], k_isGeoIp);
}
};
k_config.k_size.k_height += 30;
}
k_config.k_childGroup = 'k_childGroup';
k_formItems.push({
k_type: 'k_radio',
k_groupId: 'k_groupItemType',
k_option: k_tr('Firewall', 'ipAddressGroupEditor'),
k_value: k_SHARED_CONSTANTS.kerio_web_ThisMachine,
k_isLabelHidden: true
});
k_formItems.push({ k_name: 'description',
k_id: 'k_description',
k_caption: k_translations.k_description,
k_maxLength: 255,
k_checkByteLength: true
});
k_config.k_items = [{
k_type: 'k_fieldset',
k_id: 'k_fieldsetProperties',
k_caption: k_translations.k_properties,
k_width: '100%',
k_labelWidth: 125,
k_className: 'removeFieldsetMargin',
k_items: k_formItems
}];
k_config.k_getGroupList = {
k_manager: 'IpAddressGroups',
k_method:  'getGroupList',
k_root:    'groups',
k_groupIsEditable: function (k_group) {
var k_isNullOrEmpty = function (value) {
return !value || !value.trim();
};
return k_isNullOrEmpty(k_group.sharedId) &&
k_isNullOrEmpty(k_group.appManagerId) &&
k_group.type !== k_SHARED_CONSTANTS.kerio_web_GeoCode;
},

k_filter: function (groupName, k_newData) {
if (groupName !== 'k_existing' && groupName !== 'k_new') {
return k_newData;
}
k_result = [];
for (var i = 0; i < k_newData.length; ++i) {
var k_item = k_newData[i];
if (!this.k_groupIsEditable(k_item)) {
continue;
}
k_result.push(k_item);
}
return k_result;
}
};
if (k_hasChildGroup) {
k_config.k_childGroup = 'k_childGroup';
}
k_config.k_translations = {
k_title: k_dialogTitle
};
kerio.adm.k_widgets.K_IpAddressGroupEditor.superclass.constructor.call(this, k_id, k_config);
this.k_addReferences({
k_groupItemType: this.k_form.k_getItem('k_groupItemType'),
_k_rangeFromElement: this.k_form.k_getItem('k_rangeFrom'),
_k_rangeToElement: this.k_form.k_getItem('k_rangeTo'),
_k_config: k_config,
_k_SHARED_CONSTANTS: k_SHARED_CONSTANTS,
_k_defaultItemType: k_defaultItemType,
_k_visibleItems: k_visibleItems,
_k_allItems: k_allItems,
_k_isIpAddress: kerio.lib.k_inputValidator.k_getFunctionByName('k_isIpAddress'),
_k_saveDataMethod: k_config.k_isEditMode ? 'set' : 'create',
_k_showIpPrefix: k_showIpPrefix,
_k_geoLocations: {}, });
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_IpAddressGroupEditor', kerio.adm.k_widgets.K_IpAddressGroupEditor,
{

_k_geHostElementCfg: function() {
return kerio.waw.shared.k_widgets.K_IpAddressGroupEditor.superclass._k_geHostElementCfg.call(
this,
{
k_maxLength: kerio.waw.shared.k_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME_OR_IP_ADDRESS,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isHostIp'
}
}
);
},

_k_getNetworkMaskElementCfg: function() {
return kerio.waw.shared.k_widgets.K_IpAddressGroupEditor.superclass._k_getNetworkMaskElementCfg.call(
this,
kerio.waw.shared.k_DEFINITIONS.k_get('k_ipv4MaskField', {
k_onChange: kerio.waw.shared.k_methods.k_validateNetworkFieldsHandler
})
);
},

_k_getNetworkIpElementCfg: function() {
return kerio.waw.shared.k_widgets.K_IpAddressGroupEditor.superclass._k_getNetworkIpElementCfg.call(
this,
{
k_validator: this._k_validationObjects.k_networkIp,
k_onChange: function(k_form, k_element, k_value) {
var
k_methods = kerio.waw.shared.k_methods;
k_methods.k_allowOnlyIpv4Chars.apply(this, arguments);
k_methods.k_validateNetworkFieldsHandler.apply(this, arguments);
},

k_onBlur: function(k_form, k_element) {
var k_value = k_element.k_getValue();
kerio.waw.shared.k_methods.k_generateMaskForIp(k_value, { k_isNetwork: true, k_form: k_form, k_maskFieldId: 'k_networkMask' });
}
}
);
},

_k_getRangeFromElementCfg: function() {
return kerio.waw.shared.k_widgets.K_IpAddressGroupEditor.superclass._k_getRangeFromElementCfg.call(
this,
{
k_validator: this._k_validationObjects.k_rangeIp,
k_onChange: this._k_validateIpRange,
k_maxLength: kerio.waw.shared.k_CONSTANTS.k_MAX_LENGTH.k_IPV6_ADDRESS,

k_onBlur: function(k_form, k_element) {
var k_value = k_element.k_getValue();
kerio.waw.shared.k_methods.k_generateIpRange(k_value, { k_form: k_form, k_fieldId: 'k_rangeTo' });
}
}
);
},

_k_getRangeToElementCfg: function() {
return kerio.waw.shared.k_widgets.K_IpAddressGroupEditor.superclass._k_getRangeToElementCfg.call(
this,
{
k_validator: this._k_validationObjects.k_rangeIp,
k_onChange: this._k_validateIpRange,
k_maxLength: kerio.waw.shared.k_CONSTANTS.k_MAX_LENGTH.k_IPV6_ADDRESS
}
);
},

_k_getPrefixElementCfg: function() {
return kerio.waw.shared.k_widgets.K_IpAddressGroupEditor.superclass._k_getPrefixElementCfg.call(
this,
{
k_validator: this._k_validationObjects.k_prefix,
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Or6Chars
}
);
},

_k_validateIpRange: function(k_form, k_element, k_value) {
if (k_element) {kerio.waw.shared.k_methods.k_allowOnlyIpv4Or6Chars.apply(k_form, arguments);
}
return kerio.waw.shared.k_methods.k_validateIpRange.apply(k_form, arguments);
},
_k_validationObjects: {
k_networkIp: {
k_functionName: 'k_isIpAddress',
k_allowBlank: false,
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_rangeIp: {
k_functionName: 'k_isIpv4Or6Address',
k_allowBlank: false,
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv6.k_allowedChars
},
k_prefix: {
k_functionName: 'k_isIpv4Or6Prefix',
k_allowBlank: false,
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4Or6Prefix.k_allowedChars
}
},

_k_createValidationObject: function() {
return kerio.waw.shared.k_widgets.K_IpAddressGroupEditor.superclass._k_createValidationObject.call(
this,
{
k_isIpAddress: kerio.waw.shared.k_methods.k_validators.k_isIpAddress,
k_isIpMaskOrCidr: kerio.waw.shared.k_methods.k_validators.k_isIpMaskOrCidr
}
);
},

k_setData: function(k_data, k_fillGroups) {
var
k_parentGroup,
k_childGroup,
k_form = this.k_form,
k_SHARED_CONSTANTS = this._k_SHARED_CONSTANTS,
k_formData = {
'k_description': k_data.description || '',
'k_groupItemType': k_data.type
};
if (this._k_isEditMode) {
k_form.k_items.k_csvFile.k_setVisible(false);
}
if (k_SHARED_CONSTANTS.kerio_web_ChildGroup !== k_data.type &&
k_SHARED_CONSTANTS.kerio_web_ThisMachine !== k_data.type) {
k_formData.k_hostName = this.k_relatedGrid._k_ipagItemRenderer(k_data.host, k_data, undefined, undefined, this.k_relatedGrid).k_data;
if (k_SHARED_CONSTANTS.kerio_web_GeoCode !== k_data.type) {
k_data.type = k_SHARED_CONSTANTS.kerio_web_Host;
}
}
k_form.k_setDataIfNew(k_formData, true);
if (false !== k_fillGroups) {
var k_disableExisting = true;
k_parentGroup = {};
k_childGroup = {};
if (this._k_isEditMode || this._k_config.k_getGroupList.k_groupIsEditable(k_data)) {
k_parentGroup = {
id: k_data.groupId,
name: k_data.groupName
};
k_childGroup = {
id: k_data.childGroupId,
name: k_data.childGroupName
};
k_disableExisting = false;
}
this.k_fillGroupList(k_parentGroup, k_childGroup);
if (k_disableExisting) {
this.k_groupToAdd = '';
this._k_parentGroup.k_selectByIndex(0);
this._k_groupName.k_setValue('k_new');
}
}
},

k_checkChildGroup: function() {
if (!this._k_childGroup) {
return; }
if (!this.k_groups) {
this.k_form.k_setDisabled([this._k_childGroupId]); return; }
var k_parentGroupName;
if ('k_existing' === this._k_groupName.k_getValue()) {
k_parentGroupName = this._k_parentGroup.k_getText();
}
else {
k_parentGroupName = this._k_newGroup.k_getValue();
}
var k_groups = this.k_groups;
var k_count = k_groups.length;
var k_filteredGroups = [];
for (var k_i = 0; k_i < k_count; k_i++) {
if (k_parentGroupName !== k_groups[k_i].name) {
k_filteredGroups.push(k_groups[k_i]);
}
}
k_count = k_filteredGroups.length;
var k_form = this.k_form;
var k_childGroup = this._k_childGroup;
if (0 === k_count) {
k_childGroup.k_setValue(this._k_translations.k_noGroups);
k_form.k_setDisabled([this._k_childGroupId]);
k_form.k_items.k_groupItemType.k_setItemDisabled(this._k_SHARED_CONSTANTS.kerio_web_ChildGroup, true);
} else {
var k_oldValue = k_childGroup.k_getValue();
var k_oldName = k_childGroup.k_getText();
k_childGroup.k_clearData();
k_childGroup.k_addData(k_filteredGroups);
if (k_childGroup.k_isDisabled() || '' === k_oldName || k_oldName === k_parentGroupName) {
k_childGroup.k_selectByIndex(0); k_childGroup.k_setInitialValue(k_childGroup.k_getValue());
}
else {
k_childGroup.k_setValue(k_oldValue); }
k_form.k_items.k_groupItemType.k_setItemDisabled(this._k_SHARED_CONSTANTS.kerio_web_ChildGroup, false);
}
},

_k_saveData: function(k_params) {
var
k_removeWhiteSpaces = new RegExp('\\s', 'g'),
k_lib = kerio.lib,
k_tr = kerio.lib.k_tr;
if (this._k_isEditMode && this._k_SHARED_CONSTANTS.kerio_web_Host === k_params.details.type) {
k_params.details.host = k_params.details.host.replace(k_removeWhiteSpaces, '');
}
else if (k_params.groups && this._k_SHARED_CONSTANTS.kerio_web_Host === k_params.groups[0].type) {
if (k_params.groups[0].host.indexOf(',') === -1 && k_params.groups[0].host.indexOf('|') === -1) {
k_params.groups[0].host = k_params.groups[0].host.replace(k_removeWhiteSpaces, '');
}
else {
var groupName = k_params.groups[0].groupName;
var hosts = k_params.groups[0].host.split('|');
k_params.groups = [];
for (var i = 0; i < hosts.length; i++) {
var hostParts = hosts[i].split(',');
if (hostParts.length > 0) {
var k_collectedData = {};
k_collectedData.type = this._k_SHARED_CONSTANTS.kerio_web_Host;
k_collectedData.host = hostParts[0].replace(k_removeWhiteSpaces, '');
if(hostParts.length > 1) {
k_collectedData.description = hostParts[1].trim();
}
k_collectedData.groupName = groupName;
k_collectedData.enabled = true;
k_params.groups.push(k_collectedData);
}
}
}
}
else if (k_params.groups && this._k_SHARED_CONSTANTS.kerio_web_GeoCode === k_params.groups[0].type) {
var geoLocation = this._k_geoLocations[k_params.groups[0].geoCode];
if (!geoLocation || !geoLocation.geoCode) {
k_lib.k_alert({
k_title: k_tr('Invalid Selection', 'wlibAlerts'),
k_msg: k_tr('Invalid GeoIP country selection.', 'wlibIpAddressGroupEditor'),
k_icon: 'ERROR'
});
return;
}
k_params.groups[0].geoCode = 'GeoIP - ' + geoLocation.geoCode + ' (' + k_params.groups[0].geoCode + ')';
k_params.groups[0].groupName = 'GeoIP Group - ' + geoLocation.countryName;
k_params.groups[0].description = 'GeoIP filter for ' + geoLocation.countryName;
}
kerio.waw.shared.k_widgets.K_IpAddressGroupEditor.superclass._k_saveData.call(this, k_params);
},
k_applyParams: function(k_params) {
kerio.waw.shared.k_widgets.K_IpAddressGroupEditor.superclass.k_applyParams.call(this, k_params);
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
'method': 'Geoip.getLocations'
},
k_scope: this,
k_callback: function (k_response) {
var countries = kerio.lib.k_getSortedCountries(true),
locations = k_response.k_decoded.geoipLocations;
translatedCountriesMap = {};
for (var i = 0; i < countries.length; ++i) {
translatedCountriesMap[countries[i].k_value] = {
countryName: countries[i].k_name,
countryCode: countries[i].k_value
};
}
for (var i = 0; i < locations.length; ++i) {
slot = translatedCountriesMap[locations[i].countryCode];
if (!slot) {
continue;
}
slot.geoCode = locations[i].geoCode;
}
this._k_geoLocations = translatedCountriesMap;
}
});
}
});
