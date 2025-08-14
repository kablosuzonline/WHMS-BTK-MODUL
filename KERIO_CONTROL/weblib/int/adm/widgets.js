

kerio.adm.k_widgets.K_GroupingDialog = function(k_id, k_config) {
var
k_isEditMode = (true === k_config.k_isEditMode),
k_localNamespace = k_id + '_',
k_tr = kerio.lib.k_tr,
k_isSaveChangesOnly = true === kerio.lib.k_getSharedConstants('kerio_web_SaveChangesOnly', false),
k_translations,
k_formItems,
k_setValueNew,
k_item;
if (k_config.k_onOkClick) {
this.k_onOkClick = k_config.k_onOkClick;
}
if (k_config.k_isChildGroupSelected) {
this.k_isChildGroupSelected = k_config.k_isChildGroupSelected;
}
if (k_config.k_onGroupNameChange) {
this.k_onGroupNameChange = k_config.k_onGroupNameChange;
}
k_translations = {
k_title:          k_tr('Grouping Dialog', 'wlibGroupingDialog'),
k_addToGroup:     k_isEditMode ? k_tr('Move to a group', 'wlibGroupingDialog') : k_tr('Add to a group', 'wlibGroupingDialog'),
k_existingGroup:  k_isEditMode ? k_tr('Move to existing:', 'wlibGroupingDialog') : k_tr('Select existing:', 'wlibGroupingDialog'),
k_createGroup:    k_isEditMode ? k_tr('Move to new:', 'wlibGroupingDialog') : k_tr('Create new:', 'wlibGroupingDialog'),
k_newGroup:       k_tr('New Group',           'wlibGroupingDialog'),
k_noGroups:       k_tr('No groups available', 'wlibGroupingDialog'),
k_loading:        k_tr('Loading groups…',   'wlibGroupingDialog'),
k_ok:             k_tr('OK',                  'wlibButtons'),
k_cancel:         k_tr('Cancel',              'wlibButtons'),
k_close:          k_tr('Close',               'wlibButtons'),
k_childGroupAlertTitle:     k_tr('No child group', 'wlibGroupingDialog'),
k_childGroupAlertMessage:   k_tr('There is no child group available.', 'wlibGroupingDialog'),
k_validationAlertTitle:     k_tr('Validation warning', 'wlibAlerts'),
k_validationRangeMessage: k_tr('Specified values are not valid for range.', 'wlibGroupingDialog')
};
Ext.apply(k_translations, k_config.k_translations);
var k_isReadOnly = k_config.k_isReadOnly || kerio.lib.k_getSharedConstants('kerio_web_Auditor') === kerio.adm.k_framework._k_userRole;
var k_childGroupId  = k_config.k_childGroup;
this._k_hasChildGroup = (undefined !== k_config.k_childGroup);
var k_getGroupList = k_config.k_getGroupList;
k_getGroupList.k_id = 'id';
k_getGroupList.k_name = 'name';
k_getGroupList.k_root = 'groups';
var k_newGroupName = k_config.k_newGroupName || {};
var k_fieldsetOptions = ['k_new', 'k_existing'];

this._k_groupFieldsetCallack = function(k_form, k_radio) {
var k_dialog = k_form.k_dialog;
var k_selectedOption = k_radio.k_getRadioGroup().k_getValue();
for (var i = 0; i < k_fieldsetOptions.length; ++i) {
var k_optionValue = k_fieldsetOptions[i],
k_groupName = k_optionValue + 'Group',
k_isSelected = k_selectedOption === k_optionValue;
k_form.k_setDisabled([k_groupName], !k_isSelected);
}
k_dialog.k_isGroupValid.call(k_dialog);
k_dialog.k_checkChildGroup.call(k_dialog);
k_dialog._k_notifyGroupNameChange.call(k_dialog, k_radio);
k_form.k_focus(k_selectedOption + 'Group');
if (k_config.k_extendGroupItems &&
k_config.k_extendGroupItems.k_onChange &&
k_config.k_extendGroupItems.k_onChange !== this._k_groupFieldsetCallack) {
k_config.k_extendGroupItems.k_onChange(k_form, k_radio);
}
};
var k_formCfg = {
k_items: [
{ k_type: 'k_fieldset',
k_id: 'k_fieldsetGroupName',
k_width: '100%',
k_caption: k_translations.k_addToGroup,
k_items: [
{ k_type: 'k_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_groupName',
k_option: k_translations.k_existingGroup,
k_isLabelHidden: true,
k_isDisabled: true,
k_value: 'k_existing',
k_onChange: this._k_groupFieldsetCallack
},
{k_type: 'k_select',
k_id: 'k_existingGroup',
k_localData: {}, k_value: k_translations.k_loading,
k_isDisabled: true, k_fieldDisplay: k_getGroupList.k_name,
k_fieldValue: k_getGroupList.k_id,
k_isLabelHidden: true,

k_onChange: function(k_form, k_select) {
var k_dialog = k_form.k_dialog;
k_dialog.k_checkChildGroup.call(k_dialog);
k_dialog._k_notifyGroupNameChange.call(k_dialog, k_select);
}
}] }, { k_type: 'k_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_groupName',
k_option: k_translations.k_createGroup,
k_isLabelHidden: true,
k_value: 'k_new',
k_isChecked: true
},
{k_id: 'k_newGroup',
k_value: k_translations.k_newGroup,
k_maxLength: 63,
k_checkByteLength: true,
k_isLabelHidden: true,
k_validator: k_newGroupName.k_validator ? k_newGroupName.k_validator : { k_allowBlank: false },

k_onChange: function(k_form, k_item) {
var k_dialog = k_form.k_dialog;
k_dialog.k_checkChildGroup.call(k_dialog);
k_dialog._k_notifyGroupNameChange.call(k_dialog, k_item);
}
}] } ] } ] }; if (k_config.k_extendGroupItems) {
var k_fieldSetWidget = k_formCfg.k_items[0];
for (var i = 0; i < k_config.k_extendGroupItems.k_items.length; ++i) {
var k_externalItem = k_config.k_extendGroupItems.k_items[i];
k_externalItem.onChange = k_externalItem.onChange || this._k_groupFieldsetCallack;
k_fieldSetWidget.k_items.push(k_externalItem);
k_fieldsetOptions.push(k_externalItem.k_items[0].k_value);
}
}
if (k_config.k_items) {
k_formCfg.k_items.push({ k_type: 'k_container',
k_id: 'k_itemPropeties',
k_items: k_config.k_items                                         }); }
else {
kerio.lib.k_reportError('Internal error: You haven\'t defined items for the GroupingGrid!!!', 'groupingDialog.js');
}
var k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_formItems = k_form._k_formItems;
k_setValueNew = function(k_value, k_isInitial) {
k_isInitial = false !== k_isInitial;
this.constructor.prototype.k_setValue.call(this, k_value, k_isInitial);
};
for (k_item in k_formItems) {
k_formItems[k_item].k_setValue = k_setValueNew;
}
this._k_childGroup = k_form.k_getItem(k_childGroupId);
if (this._k_hasChildGroup) {
if (this._k_childGroup) {
this._k_childGroup.k_setValue(k_translations.k_loading);
}
else {
kerio.lib.k_reportError('Internal error: Child group is defined to "' + k_childGroupId + '" but not found in form "' + k_id + '_k_form"!!!', 'groupingDialog.js');
}
}
if (k_isReadOnly) {
k_form.k_setReadOnlyAll(true);
}
var k_size = k_config.k_size ? k_config.k_size : {};
var k_dialogCfg = {
k_width: (k_size.k_width ? k_size.k_width : 475),
k_height: (k_size.k_height ? k_size.k_height : 485),
k_title: k_translations.k_title,
k_content: k_form,
k_buttons: [
{
k_isDefault: !k_isReadOnly,
k_id: 'k_btnOK',
k_caption: k_translations.k_ok,
k_validateBeforeClick: true,
k_isHidden: k_isReadOnly,

k_onClick: function(k_toolbar) {
var
k_dialog = k_toolbar.k_dialog,
k_isChildGroupSelected = k_dialog.k_isChildGroupSelected(),
k_tr = k_dialog._k_translations;
if (k_isChildGroupSelected && k_dialog._k_childGroup.k_isDisabled()) {
kerio.lib.k_alert(k_tr.k_childGroupAlertTitle, k_tr.k_childGroupAlertMessage);
return;
}
k_dialog.k_onOkClick.call(k_dialog, k_dialog); } }, {
k_isDefault: k_isReadOnly,
k_isCancel: true,
k_id: 'k_btnCancel',
k_caption: (k_isReadOnly) ? k_translations.k_close : k_translations.k_cancel
} ] }; kerio.adm.k_widgets.K_GroupingDialog.superclass.constructor.call(this, k_id, k_dialogCfg);
this.k_addReferences({
k_form: k_form,
_k_getGroupList: k_getGroupList,
_k_childGroupId: k_childGroupId,
_k_isDialogReadOnly: k_isReadOnly,
_k_newGroup: k_form.k_getItem('k_newGroup'),
_k_groupName: k_form.k_getItem('k_groupName'),
_k_parentGroup: k_form.k_getItem('k_existingGroup'),
_k_parentGroupList: [],
_k_isSaveChangesOnly: k_isSaveChangesOnly
});
k_form.k_addReferences({
k_dialog: this
});
this._k_translations = {
k_noGroups:					k_translations.k_noGroups,
k_newGroup:					k_translations.k_newGroup,
k_childGroupAlertTitle:     k_translations.k_childGroupAlertTitle,
k_childGroupAlertMessage:   k_translations.k_childGroupAlertMessage,
k_validationAlertTitle:     k_translations.k_validationAlertTitle,
k_validationRangeMessage:	k_translations.k_validationRangeMessage
};
}; kerio.lib.k_extend('kerio.adm.k_widgets.K_GroupingDialog', kerio.lib.K_Dialog,
{


k_applyParams: function(k_params) {
var
k_data = k_params.k_data || {},
k_isEditMode = k_data.id ? true : false,k_form = this.k_form,
k_selectionStatus;
this._k_data = k_data;
this._k_isEditMode = k_isEditMode;
this.k_relatedGrid = k_params.k_relatedGrid || k_params.k_relatedWidget;
this._k_parentGroupList = k_params.k_groupList;
this.k_groupToAdd = '';
this._k_canDownloadData = k_isEditMode && false !== this._k_config.k_isDataRefreshable;
if (k_isEditMode) {
this._k_groupName.k_setValue('k_existing');
k_form.k_getItem('k_existingGroup').k_setValue(k_data.groupName);
k_form.k_getItem('k_newGroup').k_setValue(k_data.groupName);
}
else {
k_selectionStatus = this.k_relatedGrid.k_selectionStatus;
if (0 < k_selectionStatus.k_selectedRowsCount) {
this.k_groupToAdd = k_selectionStatus.k_rows[0].k_data.groupId;
}
else {
this._k_groupName.k_setValue('k_new');
}
}
if (kerio.lib.k_isMSIE8 && false !== this._k_isFirstDialogShow) {
k_form.k_focus(k_isEditMode ? 'k_existingGroup' : 'k_newGroup');
this._k_isFirstDialogShow = false;
}
},

k_resetOnClose: function() {
this.k_reset();
},

k_reset: function() {
var k_form = this.k_form;
k_form.k_reset();
this._k_parentGroup.k_clearData();
this._k_groupName.k_setValue(this._k_isEditMode ? 'k_new' : 'k_existing'); this._k_groupName.k_setItemDisabled('k_existing');
if (this._k_hasChildGroup) {
this._k_childGroup.k_clearData();
k_form.k_setDisabled([this._k_childGroupId]);
}
},

k_isReadOnly: function() {
return this._k_isDialogReadOnly;
},

k_isGroupValid: function() {
if ('k_existing' === this._k_groupName.k_getValue()) {
return true; }
else {
return this._k_newGroup.k_isValid();
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
} k_count = k_filteredGroups.length;
var k_form = this.k_form;
var k_childGroup = this._k_childGroup;
if (0 === k_count) {
k_childGroup.k_setValue(this._k_translations.k_noGroups);
k_form.k_setDisabled([this._k_childGroupId]);
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
k_form.k_setDisabled([this._k_childGroupId], false); } }, 
_k_findGroup: function(k_index, k_value) {
if (undefined === this.k_groups || undefined === k_value) {
return undefined; }
else {
for (var k_i = 0, k_cnt = this.k_groups.length; k_i < k_cnt; k_i++) {
var k_group = this.k_groups[k_i];
if (k_group[k_index] === k_value) {
return k_group; }
} return undefined; }
},

k_getGroup: function() {
var k_options = this._k_getGroupList;
var k_groupName = ('k_existing' === this._k_groupName.k_getValue()) ? this._k_parentGroup.k_getText() : this._k_newGroup.k_getValue();
var k_tmp = this._k_findGroup(k_options.k_name, k_groupName); var k_group = {};
k_group[k_options.k_name] = k_groupName;
k_group[k_options.k_id] = (k_tmp) ? k_tmp[k_options.k_id] : '';
return k_group;
},

_k_notifyGroupNameChange: function(k_item) {
var k_group = this.k_getGroup();
var k_groupName = k_group.name || ""; if (k_groupName === this._k_lastGroupName) {
return; }
else {
this._k_lastGroupName = k_groupName;
this.k_onGroupNameChange(k_groupName, undefined === k_group.id); }
},

k_fillGroupList: function(k_parentGroup, k_childGroup) {
var
k_options = this._k_getGroupList,
k_data;
this._k_defaultParentGroup = k_parentGroup || {};
this._k_defaultChildGroup = k_childGroup || {};
if (this.k_isReadOnly()) {
var k_name = k_parentGroup[k_options.k_name];
this._k_newGroup.k_setValue(k_name);
this._k_parentGroup.k_setValue(k_name);
if (this._k_hasChildGroup) {
this._k_childGroup.k_setValue(k_childGroup[k_options.k_name]);
}
this._k_groupName.k_setItemDisabled('k_existing', false); this._k_groupName.k_setValue('k_existing');
kerio.lib.k_unmaskWidget(this);
}
else if (this._k_parentGroupList) {
k_data = { k_decoded: {}};
k_data.k_decoded[k_options.k_root] = this._k_parentGroupList;
this._k_groupsLoaded(k_data);
}
else {
var k_requestCfg = {
k_jsonRpc: {
'method': k_options.k_manager + '.' + 'getGroupList'
},
k_scope: this,
k_callback: this._k_groupsLoaded
};
if (k_options.k_params) {
k_requestCfg.k_jsonRpc.params = k_options.k_params;
}
if (!this._k_canDownloadData) {
kerio.lib.k_maskWidget(this);
}
kerio.lib.k_ajax.k_request(k_requestCfg);
}
}, 
_k_groupsLoaded: function(k_response) {
var k_options = this._k_getGroupList;
var k_id = k_options.k_id;
var k_name = k_options.k_name;
var k_data = k_response.k_decoded[k_options.k_root];
var k_count = (k_data) ? k_data.length : 0;
var k_parentGroup = this._k_defaultParentGroup;
var k_childGroup  = this._k_defaultChildGroup;
this.k_groups = (0 < k_count) ? k_data : undefined;
var k_parentGroupExists = 'object' === typeof this._k_findGroup(k_id, k_parentGroup[k_id]);
var k_childGroupExists = false;
if (this._k_hasChildGroup) {
k_childGroupExists  = 'object' === typeof this._k_findGroup(k_id, k_childGroup[k_id]);
}
var k_tmp;
if (this._k_hasChildGroup && !k_childGroupExists && k_childGroup[k_name]) {
k_tmp = {};
if (k_childGroup[k_id]) {
k_tmp[k_id] = k_childGroup[k_id];
k_childGroupExists = true;
}
else {
k_tmp[k_id] = '';
}
k_tmp[k_name] = k_childGroup[k_name];
k_tmp.sharedId = k_childGroup.sharedId;
k_tmp.appManagerId = k_childGroup.appManagerId;
k_tmp.type = k_childGroup.type;
k_data.unshift(k_tmp);
} if (!k_parentGroupExists && k_parentGroup[k_name]) {
k_tmp = {};
if (k_parentGroup[k_id]) {
k_tmp[k_id] = k_parentGroup[k_id];
k_parentGroupExists = true;
}
else {
k_tmp[k_id] = '';
}
k_tmp[k_name] = k_parentGroup[k_name];
k_tmp.sharedId = k_parentGroup.sharedId;
k_tmp.appManagerId = k_parentGroup.appManagerId;
k_tmp.type = k_parentGroup.type;
k_data.unshift(k_tmp);
} if (k_options.k_filter) {
k_data = k_options.k_filter(this._k_groupName.k_getValue(), k_data);
}
k_count = (k_data) ? k_data.length : 0; this.k_groups = (0 < k_count) ? k_data : undefined;
var k_groupName = k_parentGroup[k_name] || this._k_translations.k_newGroup;
this._k_newGroup.k_setValue(k_groupName);
this._k_groupName.k_setItemDisabled('k_existing', (0 === k_count)); if ('k_existing' === this._k_groupName.k_getValue()) {
this._k_parentGroup.k_setDisabled(0 === k_count);
}
this._k_parentGroup.k_clearData();
this._k_parentGroup.k_addData(k_data);
if (k_parentGroupExists) { this._k_parentGroup.k_setValue(k_parentGroup[k_id]); this._k_groupName.k_setValue('k_existing'); }
else if (k_parentGroup[k_name]){ this._k_parentGroup.k_setValue(k_parentGroup[k_name]); this._k_groupName.k_setValue('k_existing'); }
else if (0 < k_count){ if ('' === this.k_groupToAdd) {
this._k_parentGroup.k_selectByIndex(0); this._k_groupName.k_setValue('k_new'); }
else {	this._k_groupName.k_setValue('k_existing');
this._k_parentGroup.k_setValue(this.k_groupToAdd);
}
}
else { this._k_parentGroup.k_setValue(this._k_translations.k_noGroups);
this._k_groupName.k_setValue('k_new'); } if (this._k_hasChildGroup) {
this._k_childGroup.k_clearData();
this._k_childGroup.k_addData(k_data);
if (k_childGroupExists) { this._k_childGroup.k_setValue(k_childGroup[k_id]); }
else if (k_childGroup[k_name]){ this._k_childGroup.k_setValue(k_childGroup[k_name]); }
else if (0 < k_count){ this._k_childGroup.k_selectByIndex(0); }
else { this._k_childGroup.k_setValue(this._k_translations.k_noGroups);
} this.k_checkChildGroup(); }
kerio.lib.k_unmaskWidget(this);
}, 
_k_saveDataCallback: function(k_response) {
kerio.lib.k_unmaskWidget(this);
},

k_onOkClick: function() {
kerio.lib.k_reportError('Internal Error: kerio.adm.k_widgets.K_GroupingDialog.k_onOkClick has to be defined! Widget ID: ' + this.k_id);
},

k_isChildGroupSelected: function() {
return this._k_hasChildGroup;
},

k_onGroupNameChange: function(){}
}); 

kerio.adm.k_widgets.K_IpAddressGroupEditor = function(k_id, k_config) {
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
k_defaultItemType = k_config.k_defaultItem || k_SHARED_CONSTANTS.kerio_web_Host, k_showIpPrefix = true === k_config.k_showIpPrefix;
k_config.k_translations = k_config.k_translations || {};
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
k_translations = this._k_getTranslations(k_config.k_translations);
k_hasChildGroup = false; this._k_canSaveHostname = false !== k_config.k_canSaveHostname;this._k_isIPv6Supported = k_config.k_isIPv6Supported;

if (false === Boolean(k_config.k_isIPv6ZoneIdEnabled)) {
this._k_validationFunctions.k_isIPv6AddressWithZoneIdentifier = this._k_validationFunctions.k_isIPv6Address;
}
kerio.lib.k_inputValidator.k_registerFunctions(this._k_createValidationObject(k_config.k_validators));
k_options = k_config.k_itemTypeStatus || {};
k_formItems.push({ k_type: 'k_select',
k_id: 'k_groupItemType',
k_name: 'k_groupItemType',
k_caption: k_translations.k_itemType,
k_isDisabled: (true === k_options.k_isDisabled),
k_isHidden:   (true === k_options.k_isHidden),
k_localData: k_itemTypes, k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_onChange: this._k_onGroupItemTypeSelect
});
if (undefined !== k_SHARED_CONSTANTS.kerio_web_Host) {
k_itemTypes.push({
k_caption: k_translations.k_host,
k_value: k_SHARED_CONSTANTS.kerio_web_Host
});
k_visibleItems[k_SHARED_CONSTANTS.kerio_web_Host] = ['k_hostName'];
k_hostElementCfg = this._k_geHostElementCfg();
k_hostElementCfg.k_caption = false === k_config.k_canSaveHostname ? k_translations.k_networkIp : k_translations.k_hostName;
k_hostElementCfg.k_isHidden = k_defaultItemType !== k_SHARED_CONSTANTS.kerio_web_Host;
k_formItems.push(k_hostElementCfg);
}
if (undefined !== k_SHARED_CONSTANTS.kerio_web_Network) {
k_itemTypes.push({
k_caption: k_translations.k_network,
k_value: k_SHARED_CONSTANTS.kerio_web_Network
});
k_visibleItems[k_SHARED_CONSTANTS.kerio_web_Network] = ['k_networkIp', 'k_networkMask'];
k_formItems.push(this._k_getNetworkIpElementCfg());
k_formItems.push(this._k_getNetworkMaskElementCfg());
k_SHARED_CONSTANTS.kerio_web_NetworkIPv6 = k_SHARED_CONSTANTS.kerio_web_Network + 'IPv6';
if (this._k_isIPv6Supported) {
k_itemTypes.push({
k_caption: k_translations.k_networkIPv6,
k_value: k_SHARED_CONSTANTS.kerio_web_NetworkIPv6
});
k_visibleItems[k_SHARED_CONSTANTS.kerio_web_NetworkIPv6] = ['k_sitePrefix', 'k_prefixLength'];
k_formItems.push(this._k_getSitePrefixElementCfg());
k_formItems.push(this._k_getPrefixLengthElementCfg());
}
}
if (undefined !== k_SHARED_CONSTANTS.kerio_web_Range) {
k_itemTypes.push({
k_caption: k_translations.k_range,
k_value: k_SHARED_CONSTANTS.kerio_web_Range
});
k_visibleItems[k_SHARED_CONSTANTS.kerio_web_Range] = ['k_rangeFrom', 'k_rangeTo'];
k_formItems.push(this._k_getRangeFromElementCfg());
k_formItems.push(this._k_getRangeToElementCfg());
}
if (undefined !== k_SHARED_CONSTANTS.kerio_web_ChildGroup) {
k_itemTypes.push({
k_caption: k_translations.k_group,
k_value: k_SHARED_CONSTANTS.kerio_web_ChildGroup
});
k_visibleItems[k_SHARED_CONSTANTS.kerio_web_ChildGroup] = ['k_childGroup'];
k_hasChildGroup = true;
k_config.k_childGroup = 'k_childGroup';
k_formItems.push({ k_type: 'k_select',
k_id: 'k_childGroup',
k_isHidden: (k_defaultItemType !== k_SHARED_CONSTANTS.kerio_web_ChildGroup),
k_caption: k_translations.k_groupName,
k_fieldDisplay: 'name',
k_fieldValue: 'id',
k_localData: {}, k_value: ''     });
}
if (k_showIpPrefix) {
k_itemTypes.push({
k_caption: k_translations.k_ipPrefix,
k_value: k_SHARED_CONSTANTS.kerio_web_IpPrefix
});
k_visibleItems[k_SHARED_CONSTANTS.kerio_web_IpPrefix] = ['k_ipPrefix']; k_config.k_ipPrefix = 'k_ipPrefix';
k_formItems.push(this._k_getPrefixElementCfg({
k_caption: k_translations.k_ipPrefixCaption,
k_isHidden: k_defaultItemType !== k_SHARED_CONSTANTS.kerio_web_IpPrefix
}));
}
if (undefined !== k_SHARED_CONSTANTS.kerio_web_ThisMachine && k_config.k_thisMachineCaption) {
k_itemTypes.push({
k_caption: k_config.k_thisMachineCaption,
k_value: k_SHARED_CONSTANTS.kerio_web_ThisMachine
});
k_visibleItems[k_SHARED_CONSTANTS.kerio_web_ThisMachine] = []; }
for (k_i = 1; k_i < k_formItems.length; k_i++ ) {
k_allItems.push(k_formItems[k_i].k_id);
}
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
k_labelWidth: kerio.lib.k_languageDependentValue({k_default: 100, ru: 130, cs: 145, pt: 130, sk: 135}),
k_className: 'removeFieldsetMargin',
k_items: k_formItems
}];
k_config.k_size = {
k_height: 321,
k_minHeight: 321
};
k_config.k_getGroupList = {
k_manager: 'IpAddressGroups',
k_method:  'getGroupList',
k_root:    'groups'
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
_k_showIpPrefix: k_showIpPrefix
});
};kerio.lib.k_extend('kerio.adm.k_widgets.K_IpAddressGroupEditor', kerio.adm.k_widgets.K_GroupingDialog,
{










k_applyParams: function(k_params) {
var
k_form = this.k_form,
k_options,
k_id,
k_name,
k_defaultGroup;
kerio.adm.k_widgets.K_IpAddressGroupEditor.superclass.k_applyParams.call(this, k_params);
if (this._k_isEditMode) {
k_form.k_setVisible(['k_fieldsetProperties'], false); }
else {
k_options = this._k_getGroupList;
k_id = k_options.k_id;
k_name = k_options.k_name;
k_defaultGroup = k_params.k_defaultGroup;
this._k_data.type = this._k_defaultItemType;
if (k_defaultGroup) {
if (k_defaultGroup[k_id]) {
this._k_data.groupId = k_defaultGroup[k_id];
}
if (k_defaultGroup[k_name]) {
this._k_data.groupName = k_defaultGroup[k_name];
}
for (var k_groupIndex = 0; k_groupIndex < k_params.k_groupList.length; k_groupIndex++) {
var k_group = k_params.k_groupList[k_groupIndex];
if (k_group[k_id] === this._k_data.groupId) {
this._k_data.type = k_group.type || this._k_defaultItemType;
this._k_data.sharedId = k_group.sharedId;
this._k_data.appManagerId = k_group.appManagerId;
break;
}
}
}
}
this.k_setData(this._k_data, !this._k_canDownloadData);
k_form.k_setVisible(['k_fieldsetProperties'], true); if (this._k_canDownloadData) {
this._k_downloadData();
}
}, 
k_resetOnClose: function() {
this.k_form.k_setVisible(['k_fieldsetProperties'], false);
this.k_reset();
}, 
_k_downloadData:function() {
var
k_SHARED_CONSTANTS = this._k_SHARED_CONSTANTS,
k_fields,
k_params,
k_requestCfg;
k_fields = [
'id', 'groupId', 'groupName', 'description', 'type', 'enabled', 'host', 'addr1', 'addr2', 'childGroupName', 'childGroupId'
];
k_params = {
query: {
fields: k_fields,
conditions: [{
'fieldName': 'id',
'comparator': k_SHARED_CONSTANTS.kerio_web_Eq,
'value': this.k_relatedGrid.k_selectionStatus.k_rows[0].k_data.id
}],
start: 0,
limit: 1
}
};
k_requestCfg = {
k_jsonRpc: {
'method': 'IpAddressGroups.get',
'params': k_params
},
k_scope: this,
k_callback: this._k_downloadDataCallback
};
kerio.lib.k_maskWidget(this);
kerio.lib.k_ajax.k_request(k_requestCfg);
},

_k_downloadDataCallback:function(k_response) {
var
k_tr = kerio.lib.k_tr,
k_data;
if (!k_response.k_isOk) {
kerio.lib.k_unmaskWidget(this);
return;
}
if (k_response.k_decoded.totalItems === 1) {
k_data = k_response.k_decoded.list[0];
this._k_data = k_data;
this.k_setData(k_data);
}
else {
kerio.lib.k_alert({
k_title: k_tr('Error', 'wlibAlerts'),
k_msg: k_tr('This item doesn\'t exist.', 'wlibGroupingDialog')
});
this.k_relatedGrid.k_reloadData();
this.k_hide();
}
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
switch (k_data.type) {
case k_SHARED_CONSTANTS.kerio_web_Host:
k_formData.k_hostName = k_data.host || '';
break;
case k_SHARED_CONSTANTS.kerio_web_IpPrefix:
k_formData.k_ipPrefix = k_data.host || '';
break;
case k_SHARED_CONSTANTS.kerio_web_Network:
if (-1 === k_data.addr1.indexOf(':')) {
k_formData.k_networkIp = k_data.addr1 || '';
k_formData.k_networkMask = k_data.addr2 || '';
}
else {
k_formData.k_sitePrefix = k_data.addr1 || '';
k_formData.k_prefixLength = k_data.addr2 || '';
k_formData.k_groupItemType = k_SHARED_CONSTANTS.kerio_web_NetworkIPv6;
}
break;
case k_SHARED_CONSTANTS.kerio_web_Range:
k_formData.k_rangeFrom = k_data.addr1 || '';
k_formData.k_rangeTo = k_data.addr2 || '';
break;
case k_SHARED_CONSTANTS.kerio_web_GeoCode:
k_formData.k_hostName = k_data.geoCode;
break;
}
k_form.k_setDataIfNew(k_formData, true);
if (false !== k_fillGroups) {
k_parentGroup = {
id: k_data.groupId,
name: k_data.groupName
};
k_childGroup = {
id: k_data.childGroupId,
name: k_data.childGroupName
};
this.k_fillGroupList(k_parentGroup, k_childGroup);
}
}, 
_k_removeLeadingZeros: function(k_value) {
var
k_ipParts,
k_i;
if (this._k_canSaveHostname && false === this._k_isIpAddress.call(kerio.lib.k_inputValidator, k_value)) {
return k_value;
}
if (-1 !== k_value.indexOf(':')) {
return k_value;  }
k_ipParts = k_value.split('.');
for (k_i = 0; k_i < k_ipParts.length; k_i++) {
k_ipParts[k_i] = parseInt(k_ipParts[k_i], 10);
}
return k_ipParts.join('.');
},

_k_cutOff: {

k_validate: function(k_params) {
var k_requestCfg;
k_requestCfg = {
k_jsonRpc: {
'method': 'IpAddressGroups.validateSet',
'params': k_params
},
k_callback: this._k_cutOff.k_validationCallback,
k_callbackParams: k_params,
k_onError: this._k_cutOff.k_onError,
k_scope: this
};
kerio.lib.k_ajax.k_request(k_requestCfg);
},

k_validationCallback: function(k_response, k_success, k_callbackParams) {
this._k_isValidateCutOff = true;
if (k_response.k_isOk && 0 === k_response.k_decoded.errors.length) {
this._k_saveData(k_callbackParams);
}
},

k_onError: function(k_response, k_success, k_callbackParams) {
var
k_tr = kerio.lib.k_tr,
k_error = k_response.k_decoded.result.errors[0];
kerio.lib.k_confirm({
k_title: k_tr('Edit IP Address', 'wlibIpAddressGroupEditor'),
k_msg: k_tr(k_error.message, 'serverMessage', {
k_args: k_error.messageParameters.positionalParameters,
k_pluralityBy: k_error.messageParameters.plurality
}),
k_icon: 'warning',
k_buttons: {
k_yes: k_tr('Disconnect', 'wlibDefinitions'),
k_no: k_tr('Cancel', 'wlibButtons')
},

k_callback: this._k_cutOff.k_confirmCallback,
k_scope: {k_dialog: this, k_data: k_callbackParams}
});
return true;
},

k_confirmCallback: function(k_response) {
if ('yes' === k_response) {
this.k_dialog._k_isUserCuttedOff = true;
this.k_dialog._k_saveData(this.k_data);
}
}
},

k_onOkClick: function() {
var
k_isEditWithChangesOnly = this._k_isEditMode && this._k_isSaveChangesOnly,
k_form = this.k_form,
k_params = {},
k_collectedData,
k_lib,
k_tr,
k_data,
k_group,
k_getGroupList,
k_groupName,
k_SHARED_CONSTANTS,
k_isEnabled,
k_changedDataFields;
if (k_isEditWithChangesOnly && !k_form.k_isChanged()) {
this.k_hide();
return;
}
if (kerio.lib.k_getSharedConstants('kerio_web_Auditor') === kerio.adm.k_framework._k_userRole || this.k_isReadOnly()) {
return; }
k_lib = kerio.lib;
k_tr  = k_lib.k_tr;
k_SHARED_CONSTANTS = this._k_SHARED_CONSTANTS;
if (k_isEditWithChangesOnly) {
k_changedDataFields = ['k_groupItemType', 'k_hostName', 'k_networkIp', 'k_networkMask', 'k_rangeFrom', 'k_rangeTo', 'k_childGroup'];
if (this._k_isIPv6Supported) {
k_changedDataFields.push('k_sitePrefix', 'k_prefixLength');
}
if (this._k_showIpPrefix) {
k_changedDataFields.push('k_ipPrefix');
}
k_data = k_form.k_getChangedData(true, [k_changedDataFields]);
}
else {
k_data = k_form.k_getData();
}
k_collectedData = {};
if (k_data.k_groupName === 'k_import') {
k_data.k_groupItemType = k_SHARED_CONSTANTS.kerio_web_GeoCode;
}
if (k_data.k_groupItemType === k_SHARED_CONSTANTS.kerio_web_Range && !this._k_validateIpRange(k_form)) {
k_lib.k_alert(
k_tr('Invalid range', 'wlibAlerts'),
k_tr('Specified IP addresses are not valid for range.', 'wlibIpAddressGroupEditor')
);
return;
}
if (k_data.k_groupItemType === k_SHARED_CONSTANTS.kerio_web_Network && !this._k_validateMask(k_form, k_form.k_getItem('k_networkMask'))) {
kerio.lib.k_alert(
k_tr('Invalid mask', 'wlibIpAddressGroupEditor'),
k_tr('Highlighted field is not valid for network mask.', 'wlibIpAddressGroupEditor')
);
return;
}
if (k_data.k_existingGroup || k_data.k_newGroup) {
k_group = this.k_getGroup();
k_getGroupList = this._k_getGroupList;
k_collectedData.groupId = k_group[k_getGroupList.k_id];
k_collectedData.groupName = k_group[k_getGroupList.k_name];
}
k_collectedData.type = k_data.k_groupItemType;
switch (k_data.k_groupItemType) {
case k_SHARED_CONSTANTS.kerio_web_Host:
k_collectedData.host = this._k_removeLeadingZeros(k_data.k_hostName);
break;
case k_SHARED_CONSTANTS.kerio_web_IpPrefix:
k_collectedData.host = this._k_removeLeadingZeros(k_data.k_ipPrefix);
break;
case k_SHARED_CONSTANTS.kerio_web_Network:
k_collectedData.addr1 = this._k_removeLeadingZeros(k_data.k_networkIp);
k_collectedData.addr2 = this._k_removeLeadingZeros(k_data.k_networkMask);
break;
case k_SHARED_CONSTANTS.kerio_web_NetworkIPv6:
k_collectedData.addr1 = k_data.k_sitePrefix;
k_collectedData.addr2 = String(k_data.k_prefixLength);
k_collectedData.type = k_SHARED_CONSTANTS.kerio_web_Network;  break;
case k_SHARED_CONSTANTS.kerio_web_Range:
k_collectedData.addr1 = this._k_removeLeadingZeros(k_data.k_rangeFrom);
k_collectedData.addr2 = this._k_removeLeadingZeros(k_data.k_rangeTo);
break;
case k_SHARED_CONSTANTS.kerio_web_ChildGroup:
k_groupName = this._k_childGroup.k_getText();
k_collectedData.childGroupId = (k_groupName !== k_data.k_childGroup) ? k_data.k_childGroup : '';
k_collectedData.childGroupName = k_groupName;
break;
case k_SHARED_CONSTANTS.kerio_web_GeoCode:
k_collectedData.geoCode = k_data.k_importGroup;
break;
case k_SHARED_CONSTANTS.kerio_web_ThisMachine:
break; }
k_collectedData.description = k_data.k_description;
if (!k_isEditWithChangesOnly) {
k_isEnabled = (!this._k_isEditMode || this._k_data.enabled);
if (false === this._k_config.k_useBoolean) {
k_isEnabled = (k_isEnabled) ? 1 : 0;
}
k_collectedData.enabled = k_isEnabled;
}
if (this._k_isEditMode) {
k_params.groupIds = [this._k_data.id]; k_params.details = k_collectedData;
if (this._k_isSaveChangesOnly) {this._k_cutOff.k_validate.call(this, k_params);
return;
}
}
else {
k_params.groups = [k_collectedData]; }
this._k_saveData(k_params);
}, 
_k_saveData: function(k_params) {
var
k_lib = kerio.lib,
k_requestCfg;
k_requestCfg = {
k_jsonRpc: {
'method': 'IpAddressGroups.' + this._k_saveDataMethod,
'params': k_params
},
k_scope: this,
k_callback: this._k_saveDataCallback
};
k_lib.k_maskWidget(this, {k_message: k_lib.k_tr('Saving…', 'wlibWait')});
k_lib.k_ajax.k_request(k_requestCfg);
},

_k_saveDataCallback: function(k_response) {
kerio.adm.k_widgets.K_IpAddressGroupEditor.superclass._k_saveDataCallback.call(this, k_response);
if (k_response.k_isOk && 0 === k_response.k_decoded.errors.length) {
if (true === this._k_isUserCuttedOff) {
window.location.reload();
}
if (this._k_config.k_onClose) {
this._k_config.k_onClose.call(this.k_relatedGrid, k_response, this._k_isEditMode);
}
this.k_relatedGrid.k_reloadData();
this.k_hide();
}
},

k_isChildGroupSelected: function() {
return (this._k_SHARED_CONSTANTS.kerio_web_ChildGroup === this.k_groupItemType.k_getValue());
},

_k_onGroupItemTypeSelect: function (k_form, k_select, k_value) {
var
k_dialog = k_form.k_dialog,
k_visible = k_dialog._k_visibleItems;
k_form.k_setVisible(k_dialog._k_allItems, false);
k_form.k_setVisible(k_visible[k_value], true);
if (k_dialog.k_isChildGroupSelected()) {
k_dialog.k_checkChildGroup();
}
},

_k_validateIpRange: function(k_form, k_item) {
var
k_dialog = k_form.k_dialog,
k_isIPv4Address = kerio.lib.k_inputValidator.k_getFunctionByName('k_isIpAddress'),
k_validationRangeMessage = k_dialog._k_translations.k_validationRangeMessage,
k_ipNotValidMessage = k_dialog._k_translations.k_ipNotValidMessage,
k_rangeFrom = k_dialog._k_rangeFromElement,
k_rangeTo = k_dialog._k_rangeToElement,
k_valueFrom,
k_valueTo,
k_normalizedAddresses,
k_radix,
k_rangeFromParts,
k_rangeToParts,
k_rangeFromPart,
k_rangeToPart,
k_key,
k_cnt;
if (k_rangeFrom.k_isValid() && k_rangeTo.k_isValid()) {
k_valueFrom = k_rangeFrom.k_getValue();
k_valueTo = k_rangeTo.k_getValue();
if (k_isIPv4Address(k_valueFrom)) {
k_rangeFromParts = k_valueFrom.split('.');
k_rangeToParts = k_valueTo.split('.');
k_radix = 10;
}
else {
k_normalizedAddresses = k_dialog._k_checkZoneRange(k_valueFrom, k_valueTo);
if (k_normalizedAddresses.k_haveSameZoneId) {
k_rangeFromParts = k_dialog._k_expandIPv6Address(k_normalizedAddresses.k_addressFrom).split(':');
k_rangeToParts = k_dialog._k_expandIPv6Address(k_normalizedAddresses.k_addressTo).split(':');
k_radix = 16;
}
else {
k_rangeFrom.k_markInvalid(true, k_validationRangeMessage);
return false;
}
}
k_cnt = k_rangeFromParts.length;
for (k_key = 0; k_key < k_cnt; k_key++) {
k_rangeFromPart = parseInt(k_rangeFromParts[k_key], k_radix);
k_rangeToPart = parseInt(k_rangeToParts[k_key], k_radix);
if ((k_rangeToPart < k_rangeFromPart) || (k_key === (k_cnt - 1) && k_rangeToPart === k_rangeFromPart)) {
k_rangeFrom.k_markInvalid(true, k_validationRangeMessage);
k_rangeTo.k_markInvalid(true, k_validationRangeMessage);
return false;
}
else if (k_rangeToPart > k_rangeFromPart) {
break;
}
}
}
k_rangeFrom.k_markInvalid(false, k_ipNotValidMessage);
k_rangeTo.k_markInvalid(false, k_ipNotValidMessage);
k_rangeFrom.k_isValid(); k_rangeTo.k_isValid();
return true; },

_k_checkZoneRange: function(k_addressFrom, k_addressTo) {
var
k_posA = k_addressFrom.indexOf('%'),
k_posB = k_addressTo.indexOf('%'),
k_zoneIdA = '',
k_zoneIdB = '';
if (-1 !== k_posA) {
k_zoneIdA = k_addressFrom.substr(k_posA);
k_addressFrom = k_addressFrom.substr(0, k_posA);
}
if (-1 !== k_posB) {
k_zoneIdB = k_addressTo.substr(k_posB);
k_addressTo = k_addressTo.substr(0, k_posB);
}
return {
k_haveSameZoneId: k_zoneIdA === k_zoneIdB,
k_addressFrom   : k_addressFrom,
k_addressTo     : k_addressTo
};
},
_k_expandIPv6Address: function(k_value) {
var
k_pos = k_value.indexOf('::'),
k_expanded,
k_parts,
k_idx,
k_i, k_cnt;
if (-1 === k_pos) {
return k_value;
}
k_expanded = ['0000', '0000', '0000', '0000', '0000', '0000', '0000', '0000'];
k_idx = 8;
k_parts = k_value.substr(k_pos + 1).split(':');
for (k_i = k_parts.length - 1; k_i >= 0; k_i--) {
if ('' !== k_parts[k_i]) {
k_idx--;
k_expanded[k_idx] = k_parts[k_i];
}
}
k_idx = 0;
k_parts = k_value.substr(0, k_pos).split(':');
for (k_i = 0, k_cnt = k_parts.length; k_i < k_cnt; k_i++) {
if ('' !== k_parts[k_i]) {
k_expanded[k_idx] = k_parts[k_i];
k_idx++;
}
}
return k_expanded.join(':');
},

_k_validateMask: function(k_form, k_item) {
var
k_setInvalid = false,
k_lastBit,
k_prevLastBit,
k_bits,
k_maskParts,
k_i, k_j;
if (k_item.k_isValid()) {
k_maskParts = k_item.k_getValue().split('.');
if ('0' === k_maskParts[0]) {
k_setInvalid = true;
}
else {
k_prevLastBit = k_maskParts[3] % 2;
k_bits = 7; for (k_j = 3; k_j >= 0 && true !== k_setInvalid; k_j--) {
for (k_i = 0; k_i < k_bits; k_i++) {
k_lastBit = k_maskParts[k_j] % 2;
if ((1 === k_prevLastBit) && (0 === k_lastBit)) {
k_setInvalid = true;
break;
}
k_maskParts[k_j] = (k_maskParts[k_j] - k_lastBit) / 2;
k_prevLastBit = k_lastBit;
}
k_bits = 8; }
}
}
k_item.k_markInvalid(k_setInvalid);
k_item.k_isValid(); return !k_setInvalid;
},

_k_createValidationObject: function(k_config) {
var
k_validators,
k_default = this._k_validationFunctions,
k_IPv6RegExp;
if (k_config) {
k_validators = Ext.apply({}, k_config, k_default);
}
else {
k_validators = k_default;
}
if (null === k_validators._k_isIpAddressRegExp) {
k_validators._k_isIpAddressRegExp = kerio.lib.k_inputValidator.k_getRegExpValidator(kerio.lib.k_getSharedConstants('kerio_web_IpAddressRegExp'));
this.constructor.prototype._k_validationFunctions._k_isIpAddressRegExp = k_validators._k_isIpAddressRegExp;
k_IPv6RegExp = kerio.lib.k_getSharedConstants('kerio_web_IPv6RegExp', false);
if (!k_IPv6RegExp) {
kerio.lib.k_warn(' Constants kerio.wam.k_CONST.kerio_web_SharedConstants.kerio_web_IPv6RegExp is not defined! WebLib default value will be used.');
k_IPv6RegExp = '^((?=.*::)(?!.*::.+::)(::)?([\\dA-F]{1,4}:(:|\\b)|){5}|([\\dA-F]{1,4}:){6})((([\\dA-F]{1,4}((?!\\3)::|:\\b|$))|(?!\\2\\3)){2}|(((2[0-4]|1\\d|[1-9])?\\d|25[0-5])\\.?\\b){4})$';
}
k_validators._k_isIPv6AddressRegExp = kerio.lib.k_inputValidator.k_getRegExpValidator(k_IPv6RegExp, 'i');
this.constructor.prototype._k_validationFunctions._k_isIPv6AddressRegExp = k_validators._k_isIPv6AddressRegExp;
}
return k_validators;
},
_k_validationFunctions: {

k_hasNoSpaces: function(k_value) {
return (-1 === k_value.indexOf(' '));
},

_k_isIpAddressRegExp: null,  
k_isNetworkAddress: function (k_value) {
var
k_isIPv4Address = kerio.lib.k_inputValidator.k_getFunctionByName('k_isIpAddress'),
k_isIPv6Address = kerio.lib.k_inputValidator.k_getFunctionByName('k_isIPv6AddressWithZoneIdentifier');
return k_isIPv4Address(k_value) || k_isIPv6Address(k_value);
},
k_isHostAddress: function (k_value) {
var
k_isIPv4Address = kerio.lib.k_inputValidator.k_getFunctionByName('k_isIpAddress'),
k_isIPv6Address = kerio.lib.k_inputValidator.k_getFunctionByName('k_isIPv6AddressWithZoneIdentifier');
return k_isIPv4Address(k_value) || k_isIPv6Address(k_value);
},

k_isIpAddress: function (k_value) {
var
k_state = true,
k_isIpAddressRegExp = kerio.lib.k_inputValidator.k_getFunctionByName('_k_isIpAddressRegExp');
if ('0.0.0.0' === k_value || '255.255.255.255' === k_value) {
k_state = false;
}
else {
if (!k_isIpAddressRegExp(k_value)) {
k_state = false;
}
}
return k_state;
},

k_isIPv6Address: function (k_value) {
var k_isIpAddressRegExp;
if (-1 === k_value.indexOf(':')) {  return false;
}
k_isIpAddressRegExp = kerio.lib.k_inputValidator.k_getFunctionByName('_k_isIPv6AddressRegExp');
return k_isIpAddressRegExp(k_value);
},

k_isIPv6AddressWithZoneIdentifier: function (k_value) {
var
k_isIpAddressRegExp,
k_pos,
k_zoneId;
if (-1 === k_value.indexOf(':')) {  return false;
}
k_pos = k_value.indexOf('%');  if (-1 !== k_pos) {
k_zoneId = k_value.substr(k_pos + 1);
k_value = k_value.substr(0, k_pos);
if (k_zoneId.length < 1 || -1 !== k_zoneId.indexOf('/') || -1 !== k_zoneId.indexOf(' ')) {
return false;
}
}
k_isIpAddressRegExp = kerio.lib.k_inputValidator.k_getFunctionByName('_k_isIPv6AddressRegExp');
return k_isIpAddressRegExp(k_value);
}
},
_k_validationObjects: {
k_isNetworkAddress: {  k_functionName: 'k_isNetworkAddress',
k_allowBlank: false
},
k_networkIp: {         k_functionName: 'k_isIpAddress',
k_allowBlank: false
},
k_networkMask: {       k_functionName: 'k_isIpAddress',
k_allowBlank: false
},
k_sitePrefix: {        k_functionName: 'k_isIPv6AddressWithZoneIdentifier',
k_allowBlank: false
},
k_prefix: {            k_allowBlank: false
}
},

_k_getTranslations: function(k_appTranslations) {
var k_defaultTranslations;
if (this._k_editorTranslations) {
return this._k_editorTranslations;
}
k_defaultTranslations = {
k_properties:			kerio.lib.k_tr('Properties',        'wlibIpAddressGroupEditor'),
k_itemType:				kerio.lib.k_tr('Type:',             'wlibIpAddressGroupEditor'),
k_host:					kerio.lib.k_tr('Host',              'wlibIpAddressGroupEditor'),
k_hostName:				kerio.lib.k_tr('Hostname/IP:',      'wlibIpAddressGroupEditor'),
k_network:				kerio.lib.k_tr('IPv4 Network/Mask', 'wlibIpAddressGroupEditor'),
k_networkIp:			kerio.lib.k_tr('IP Address:',       'wlibIpAddressGroupEditor'),
k_networkMask:			kerio.lib.k_tr('Mask:',             'wlibIpAddressGroupEditor'),
k_networkIPv6:			'IPv6 Prefix',  k_sitePrefix:			'Prefix:',      k_prefixLength:			kerio.lib.k_tr('Length:',           'wlibIpAddressGroupEditor'),
k_range:				kerio.lib.k_tr('Address Range',     'wlibIpAddressGroupEditor'),
k_rangeFrom:			kerio.lib.k_tr('From:',             'wlibIpAddressGroupEditor'),
k_rangeTo:				kerio.lib.k_tr('To:',               'wlibIpAddressGroupEditor'),
k_group:				kerio.lib.k_tr('IP Address Group',  'wlibIpAddressGroupEditor'),
k_groupName:			kerio.lib.k_tr('IP Address Group:', 'wlibIpAddressGroupEditor'),
k_description:			kerio.lib.k_tr('Description:',      'wlibIpAddressGroupEditor'),
k_ipPrefix:				kerio.lib.k_tr('IP Prefix',         'wlibDefinitions'),
k_ipPrefixCaption:		kerio.lib.k_tr('IP Prefix:',        'wlibIpAddressGroupEditor'),
k_localhost:			kerio.lib.k_tr('Firewall',          'wlibDefinitions')
};
this._k_editorTranslations = Ext.apply({}, k_appTranslations, k_defaultTranslations);
return this._k_editorTranslations;
},

_k_createItemConfig: function(k_id, k_config, k_default) {
var
k_translations = this._k_getTranslations(),
k_elementCfg;
if (k_config) {
k_elementCfg = Ext.apply({}, k_config, k_default);
} else {
k_elementCfg = k_default;
}
k_elementCfg.k_id = k_id;
k_elementCfg.k_isHidden = true;
k_elementCfg.k_caption = k_translations[k_id];
return k_elementCfg;
},

_k_geHostElementCfg: function(k_config) {
var	k_default = {
k_maxLength: 255,
k_validator: {
k_functionName: false === this._k_canSaveHostname ? (this._k_isIPv6Supported ? 'k_isHostAddress' : 'k_isIpAddress') : 'k_hasNoSpaces',
k_allowBlank: false
}
};
return this._k_createItemConfig('k_hostName', k_config, k_default);
},

_k_getNetworkIpElementCfg: function(k_config) {
var	k_default = {
k_maxLength: 15,
k_validator: this._k_validationObjects.k_networkIp
};
return this._k_createItemConfig('k_networkIp', k_config, k_default);
},

_k_getNetworkMaskElementCfg: function(k_config) {
var k_default = {
k_maxLength: 15,
k_validator: this._k_validationObjects.k_networkMask,
k_onChange: this._k_validateMask
};
return this._k_createItemConfig('k_networkMask', k_config, k_default);
},

_k_getSitePrefixElementCfg: function(k_config) {
var	k_default = {
k_maxLength: 39, k_validator: {
k_functionName: 'k_isIPv6Address'
}
};
return this._k_createItemConfig('k_sitePrefix', k_config, k_default);
},

_k_getPrefixLengthElementCfg: function(k_config) {
var k_default = {
k_type: 'k_number',
k_maxLength: 3,
k_minValue: 1,
k_maxValue: 128,
k_validator: {
k_allowBlank: false
}
};
return this._k_createItemConfig('k_prefixLength', k_config, k_default);
},

_k_getRangeFromElementCfg: function(k_config) {
var k_default = {
k_maxLength: this._k_isIPv6Supported ? 39 : 15,
k_validator: this._k_isIPv6Supported ? this._k_validationObjects.k_isNetworkAddress : this._k_validationObjects.k_networkIp,
k_onChange: this._k_validateIpRange,
k_onBlur: this._k_onRangeLeave
};
return this._k_createItemConfig('k_rangeFrom', k_config, k_default);
},

_k_getRangeToElementCfg: function(k_config) {
var k_default = {
k_maxLength: this._k_isIPv6Supported ? 39 : 15,
k_validator: this._k_isIPv6Supported ? this._k_validationObjects.k_isNetworkAddress : this._k_validationObjects.k_networkIp,
k_onChange: this._k_validateIpRange
};
return this._k_createItemConfig('k_rangeTo', k_config, k_default);
},

_k_getPrefixElementCfg: function(k_config) {
var k_default = {
k_caption: k_config.k_caption,
k_isHidden: k_config.k_isHidden,
k_maxLength: 43, k_validator: this._k_validationObjects.k_prefix
};
return this._k_createItemConfig('k_ipPrefix', k_config, k_default);
}
}); 

kerio.adm.k_widgets.K_TimeRangeEditor = function(k_id, k_config) {
var k_tr = kerio.lib.k_tr;
var k_SHARED_CONSTANTS = kerio.lib.k_getSharedConstants();
var k_dateFormat = k_config.k_dateFormat || 'd/m/Y';
var k_timeFormat = k_config.k_timeFormat || 'H:i';
var k_timeRegexp = new RegExp(k_SHARED_CONSTANTS.kerio_web_TimeRegExp);
var k_typeData = [
{name: k_tr('Daily', 'wlibTimeRangeEditor'), value: k_SHARED_CONSTANTS.kerio_web_TimeRangeDaily},
{name: k_tr('Weekly', 'wlibTimeRangeEditor'), value: k_SHARED_CONSTANTS.kerio_web_TimeRangeWeekly},
{name: k_tr('Absolute', 'wlibTimeRangeEditor'), value: k_SHARED_CONSTANTS.kerio_web_TimeRangeAbsolute}
];
var k_weekdaysData = [
{name: k_tr('Monday', 'wlibCalendar'), value: k_SHARED_CONSTANTS.kerio_web_Monday},
{name: k_tr('Tuesday', 'wlibCalendar'), value: k_SHARED_CONSTANTS.kerio_web_Tuesday},
{name: k_tr('Wednesday', 'wlibCalendar'), value: k_SHARED_CONSTANTS.kerio_web_Wednesday},
{name: k_tr('Thursday', 'wlibCalendar'), value: k_SHARED_CONSTANTS.kerio_web_Thursday},
{name: k_tr('Friday', 'wlibCalendar'), value: k_SHARED_CONSTANTS.kerio_web_Friday},
{name: k_tr('Saturday', 'wlibCalendar'), value: k_SHARED_CONSTANTS.kerio_web_Saturday},
{name: k_tr('Sunday', 'wlibCalendar'), value: k_SHARED_CONSTANTS.kerio_web_Sunday}
];
var k_dayMap = {
'k_validOnMonday':    'kerio_web_Monday',
'k_validOnTuesday':   'kerio_web_Tuesday',
'k_validOnWednesday': 'kerio_web_Wednesday',
'k_validOnThursday':  'kerio_web_Thursday',
'k_validOnFriday':    'kerio_web_Friday',
'k_validOnSaturday':  'kerio_web_Saturday',
'k_validOnSunday':    'kerio_web_Sunday'
}; var k_validOnData = [
{name: k_tr('All days', 'wlibDefinitions'), value: 1},
{name: k_tr('Weekdays', 'wlibDefinitions'), value: 2},
{name: k_tr('Weekend', 'wlibDefinitions'), value: 3},
{name: k_tr('Selected days', 'wlibTimeRangeEditor'), value: 4}
];
var k_daysOrder = {};
k_daysOrder[k_SHARED_CONSTANTS.kerio_web_Monday]    = 0;
k_daysOrder[k_SHARED_CONSTANTS.kerio_web_Tuesday]   = 1;
k_daysOrder[k_SHARED_CONSTANTS.kerio_web_Wednesday] = 2;
k_daysOrder[k_SHARED_CONSTANTS.kerio_web_Thursday]  = 3;
k_daysOrder[k_SHARED_CONSTANTS.kerio_web_Friday]    = 4;
k_daysOrder[k_SHARED_CONSTANTS.kerio_web_Saturday]  = 5;
k_daysOrder[k_SHARED_CONSTANTS.kerio_web_Sunday]    = 6;
var k_timeValidator = {
k_regExp: k_timeRegexp,
k_allowBlank: false
};
var k_todayTimeStamp = Math.round(new Date().getTime() / 1000);
var k_items = [
{
k_caption: k_tr('Description', 'wlibCommon'),
k_type: 'k_fieldset',
k_id: 'k_descriptionFieldset',
k_items: [
{
k_isLabelHidden: true,
k_id: 'k_description',
k_maxLength: 255,
k_checkByteLength: true
}
]
},
{
k_caption: k_tr('Time settings', 'wlibTimeRangeEditor'),
k_type: 'k_fieldset',
k_id: 'k_timeSettingsFieldset',
k_isHidden: true,
k_items: [
{
k_caption: k_tr('Type:', 'wlibTimeRangeEditor'),
k_type: 'k_select',
k_id: 'k_type',
k_value: k_SHARED_CONSTANTS.kerio_web_TimeRangeDaily,
k_localData: k_typeData,

k_onChange: function(k_form, k_select, k_value) {
var k_SHARED_CONSTANTS = kerio.lib.k_getSharedConstants();
k_form.k_setVisible(['k_daily', 'k_dailyValidOn', 'k_weekly', 'k_absolute'], false);
k_form.k_setVisible(['k_daily', 'k_dailyValidOn'], (k_SHARED_CONSTANTS.kerio_web_TimeRangeDaily == k_value));
k_form.k_setVisible(['k_weekly'], (k_SHARED_CONSTANTS.kerio_web_TimeRangeWeekly == k_value));
k_form.k_setVisible(['k_absolute'], (k_SHARED_CONSTANTS.kerio_web_TimeRangeAbsolute == k_value));
var k_validOn = k_form.k_getItem('k_validOn');
k_validOn.k_setValue(k_validOn.k_getValue());
k_form.k_parentWidget.k_checkTimes();
}
},
{
k_type: 'k_container',
k_id: 'k_daily',
k_className: 'inputSpacer',
k_items: [
{
k_caption: k_tr('From:', 'wlibTimeRangeEditor'),
k_id: 'k_dailyFrom',
k_value: '00:00',
k_validator: k_timeValidator,
k_maxLength: 5,

k_onChange: function(k_form) {
k_form.k_parentWidget.k_checkTimes();
}
},
{
k_caption: k_tr('To:', 'wlibTimeRangeEditor'),
k_id: 'k_dailyTo',
k_value: '23:59',
k_validator: k_timeValidator,
k_maxLength: 5,

k_onChange: function(k_form) {
k_form.k_parentWidget.k_checkTimes();
}
}
]
},
{
k_type: 'k_container',
k_id: 'k_weekly',
k_isHidden: true,
k_className: 'inputSpacer',
k_items: [
{
k_caption: k_tr('From:', 'wlibTimeRangeEditor'),
k_type: 'k_row',
k_items: [
{
k_type: 'k_select',
k_id: 'k_fromDay',
k_value: k_SHARED_CONSTANTS.kerio_web_Monday,
k_localData: k_weekdaysData,

k_onChange: function(k_form, k_select, k_value) {
var k_toDay = k_form.k_getItem('k_toDay');
if (k_form._k_daysOrder[k_value] > k_form._k_daysOrder[k_toDay.k_getValue()]) {
k_toDay.k_setValue(k_value);
}
k_form.k_parentWidget.k_checkTimes();
}
},
{
k_id: 'k_weeklyFromTime',
k_value: '00:00',
k_width: 100,
k_validator: k_timeValidator,
k_maxLength: 5,

k_onChange: function(k_form) {
k_form.k_parentWidget.k_checkTimes();
}
}
]
},
{
k_caption: k_tr('To:', 'wlibTimeRangeEditor'),
k_type: 'k_row',
k_items: [
{
k_type: 'k_select',
k_id: 'k_toDay',
k_value: k_SHARED_CONSTANTS.kerio_web_Monday,
k_localData: k_weekdaysData,

k_onChange: function(k_form, k_select, k_value) {
var k_fromDay = k_form.k_getItem('k_fromDay');
if (k_form._k_daysOrder[k_value] < k_form._k_daysOrder[k_fromDay.k_getValue()]) {
k_fromDay.k_setValue(k_value);
}
k_form.k_parentWidget.k_checkTimes();
}
},
{
k_id: 'k_weeklyToTime',
k_value: '23:59',
k_width: 100,
k_validator: k_timeValidator,
k_maxLength: 5,

k_onChange: function(k_form) {
k_form.k_parentWidget.k_checkTimes();
}
}
]
}
]
},
{
k_type: 'k_container',
k_id: 'k_absolute',
k_isHidden: true,
k_className: 'inputSpacer',
k_items: [
{
k_caption: k_tr('From:', 'wlibTimeRangeEditor'),
k_type: 'k_row',
k_items: [
{
k_id: 'k_absoluteFromDate',
k_type: 'k_date',
k_width: 100,
k_maxLength: 10,
k_dateFormat: k_dateFormat,

k_onChange: function(k_form, k_select, k_value) {
var k_absoluteToDate = k_form.k_getItem('k_absoluteToDate');
var k_toDateTimeStamp = k_absoluteToDate.k_getValue();
if (k_toDateTimeStamp) {
if (k_value > k_toDateTimeStamp) {
k_absoluteToDate.k_setValue(k_value);
}
else if (k_value == k_toDateTimeStamp && k_select._k_previouseValue < k_value && k_form.k_dialog._k_todayTimeStamp < k_value) {
k_absoluteToDate.k_setValue(k_value);
}
}
k_select._k_previouseValue = k_value;
k_form.k_parentWidget.k_checkTimes();
}
},
{
k_id: 'k_absoluteFromTime',
k_value: '00:00',
k_validator: k_timeValidator,
k_maxLength: 5,

k_onChange: function(k_form) {
k_form.k_parentWidget.k_checkTimes();
}
}
]
},
{
k_caption: k_tr('To:', 'wlibTimeRangeEditor'),
k_type: 'k_row',
k_items: [
{
k_id: 'k_absoluteToDate',
k_type: 'k_date',
k_width: 100,
k_maxLength: 10,
k_dateFormat: k_dateFormat,

k_onChange: function(k_form, k_dateField, k_value) {
var k_absoluteFromDate = k_form.k_getItem('k_absoluteFromDate');
var k_fromDateTimeStamp = k_absoluteFromDate.k_getValue();
if (k_fromDateTimeStamp) {
if (k_value < k_fromDateTimeStamp) {
k_absoluteFromDate.k_setValue(k_value);
}
}
k_dateField._k_previouseValue = k_value;
k_form.k_parentWidget.k_checkTimes();
}
},
{
k_id: 'k_absoluteToTime',
k_value: '23:59',
k_validator: k_timeValidator,
k_maxLength: 5,

k_onChange: function(k_form) {
k_form.k_parentWidget.k_checkTimes();
}
}
]
}
]
},
{
k_type: 'k_container',
k_id: 'k_dailyValidOn',
k_className: 'inputSpacer',
k_items: [
{
k_caption: k_tr('Valid on:', 'wlibTimeRangeEditor'),
k_type: 'k_select',
k_value: 1, k_id: 'k_validOn',
k_localData: k_validOnData,

k_onChange: function(k_form, k_select, k_value) {
k_form._k_isBreakSet = true;
if (4 == k_value) {
k_form.k_dialog._k_setSavedDays(k_form);
}
else {
var k_is1 = (1 == k_value);
var k_is2 = (2 == k_value);
var k_is3 = (3 == k_value);
var k_isWeekday = ((k_is1 || k_is2) && !k_is3);
var k_isWeekend = ((k_is1 || k_is3) && !k_is2);
k_form.k_getItem('k_validOnMonday').k_setValue(k_isWeekday, false);
k_form.k_getItem('k_validOnTuesday').k_setValue(k_isWeekday, false);
k_form.k_getItem('k_validOnWednesday').k_setValue(k_isWeekday, false);
k_form.k_getItem('k_validOnThursday').k_setValue(k_isWeekday, false);
k_form.k_getItem('k_validOnFriday').k_setValue(k_isWeekday, false);
k_form.k_getItem('k_validOnSaturday').k_setValue(k_isWeekend, false);
k_form.k_getItem('k_validOnSunday').k_setValue(k_isWeekend, false);
}
k_form._k_isBreakSet = false;
}
},
{
k_type: 'k_row',
k_id: 'k_validOnDays',
k_className: 'validOnSpacer',
k_items: [
{
k_isLabelHidden: true,
k_type: 'k_checkbox',
k_isChecked: true,
k_option: k_tr('Mon', 'wlibCalendar'),
k_id: 'k_validOnMonday',
k_onChange: this.k_validateDays
},
{
k_type: 'k_checkbox',
k_isChecked: true,
k_option: k_tr('Tue', 'wlibCalendar'),
k_id: 'k_validOnTuesday',
k_onChange: this.k_validateDays
},
{
k_type: 'k_checkbox',
k_isChecked: true,
k_option: k_tr('Wed', 'wlibCalendar'),
k_id: 'k_validOnWednesday',
k_onChange: this.k_validateDays
},
{
k_type: 'k_checkbox',
k_isChecked: true,
k_option: k_tr('Thu', 'wlibCalendar'),
k_id: 'k_validOnThursday',
k_onChange: this.k_validateDays
},
{
k_type: 'k_checkbox',
k_isChecked: true,
k_option: k_tr('Fri', 'wlibCalendar'),
k_id: 'k_validOnFriday',
k_onChange: this.k_validateDays
},
{
k_type: 'k_checkbox',
k_isChecked: true,
k_option: k_tr('Sat', 'wlibCalendar'),
k_id: 'k_validOnSaturday',
k_onChange: this.k_validateDays
},
{
k_type: 'k_checkbox',
k_isChecked: true,
k_option: k_tr('Sun', 'wlibCalendar'),
k_id: 'k_validOnSunday',
k_onChange: this.k_validateDays
}
]
}
]
},
{
k_type: 'k_simpleText',
k_isLabelHidden: true,
k_value: k_tr('Times set in the dialog correspond with server time zone.', 'wlibTimeRangeEditor'),
k_icon: k_config.k_infoIconPath ? k_config.k_infoIconPath : '/weblib/int/lib/img/info',
k_className: 'timeRangeServerZone'
}
]
}
]; var k_title;
var k_isEditMode = true;
var k_isReadOnly = false;
if ('timeRangeEdit' === k_id) {
k_title = k_tr('Edit Time Range', 'wlibGroupingDialog');
}
else if ('timeRangeEditorView' === k_id) {
k_title = k_tr('View Time Range', 'wlibGroupingDialog');
k_isReadOnly = true;
}
else {
k_isEditMode = false;
k_title = k_tr('Add Time Range', 'wlibGroupingDialog');
}
var k_getGroupList = {
k_manager: 'TimeRanges',
k_method:  'getGroupList',
k_root:    'groups'
};
var k_dialogCfg = {
k_items: k_items,
k_isEditMode: k_isEditMode,
k_groupName: k_config.k_groupName,
k_getGroupList: k_getGroupList,
k_isReadOnly: k_isReadOnly,
k_size: {
k_height: 540,
k_minHeight: 540
},
k_translations: {
k_title: k_title,
k_newGroup: k_tr('New Time Range', 'wlibGroupingDialog')
}
};
kerio.adm.k_widgets.K_TimeRangeEditor.superclass.constructor.call(this, k_id, k_dialogCfg);
this.k_addReferences({
_k_config: k_config,
_k_dayMap: k_dayMap,
_k_SHARED_CONSTANTS: k_SHARED_CONSTANTS,
_k_todayTimeStamp: k_todayTimeStamp,
_k_timeFormat: k_timeFormat
});
this.k_form.k_addReferences({
_k_daysOrder: k_daysOrder
});
}; kerio.lib.k_extend('kerio.adm.k_widgets.K_TimeRangeEditor', kerio.adm.k_widgets.K_GroupingDialog,
{







k_applyParams: function(k_params) {
this.k_form._k_selectedDays = {};
kerio.adm.k_widgets.K_TimeRangeEditor.superclass.k_applyParams.call(this, k_params);
if (this._k_isEditMode) {
this.k_form.k_setVisible(['k_timeSettingsFieldset'], false); this.k_form.k_setVisible(['k_descriptionFieldset'], false); }
this._k_enabled = undefined;
if (this._k_isEditMode) {
this.k_fillInData(this._k_data, !this._k_canDownloadData);
this.k_form.k_setVisible(['k_descriptionFieldset'], true); this.k_form.k_setVisible(['k_timeSettingsFieldset'], true); }
if (this._k_canDownloadData) {
this._k_loadRemoteData();
}
else if (this._k_isEditMode) {
this._k_enabled = this._k_data.enabled;
}
else {
var k_options = this._k_getGroupList;
var k_id = k_options.k_id;
var k_groupName = k_options.k_groupName;
var k_parentGroup = {};
var k_childGroup = {};
k_groupName = 'name';
if (k_params.k_defaultGroup) {
if (k_params.k_defaultGroup[k_id]) {
k_parentGroup[k_id] = k_params.k_defaultGroup[k_id];
}
if (k_params.k_defaultGroup[k_groupName]) {
k_parentGroup[k_groupName] = k_params.k_defaultGroup[k_groupName];
}
} this.k_fillGroupList(k_parentGroup, k_childGroup);
this._k_data = {
k_absoluteFromDate: this._k_todayTimeStamp,
k_absoluteToDate: this._k_todayTimeStamp
};
this.k_form.k_setData(this._k_data, true);
this.k_form.k_setVisible(['k_descriptionFieldset'], true); this.k_form.k_setVisible(['k_timeSettingsFieldset'], true);
}
}, 
k_resetOnClose: function() {
this.k_form.k_setVisible(['k_descriptionFieldset'], false);
this.k_form.k_setVisible(['k_timeSettingsFieldset'], false);
this.k_reset();
}, 
_k_loadRemoteData: function() {
var k_fields = [
'id', 'groupId', 'groupName', 'description', 'type', 'enabled', 'status', 'fromTime', 'toTime', 'days', 'fromDay', 'toDay',
'fromDate', 'toDate', 'childGroupId', 'childGroupName'
];
var k_params = {
query: {
fields: k_fields,
conditions: [{
'fieldName': 'id',
'comparator': this._k_SHARED_CONSTANTS.kerio_web_Eq,
'value': this._k_data.id
}],
start: 0,
limit: 1
}
};
var k_requestCfg = {
k_method: 'post',
k_jsonRpc: {
'method': 'TimeRanges.get',
'params': k_params
},
k_callback: this._k_callbackLoadData,
k_scope: this
};
kerio.lib.k_maskWidget(this);
kerio.lib.k_ajax.k_request(k_requestCfg);
}, 
_k_callbackLoadData: function(k_response) {
var
k_tr = kerio.lib.k_tr,
k_data;
if (k_response.k_isOk) {
if (k_response.k_decoded.totalItems === 1) {
k_data = k_response.k_decoded.list[0];
this._k_data = k_data;
this.k_fillInData(k_data); this._k_enabled = k_data.enabled;
}
else {
kerio.lib.k_alert({
k_title: k_tr('Error', 'wlibAlerts'),
k_msg: k_tr('This item doesn\'t exist.', 'wlibGroupingDialog')
});
this.k_relatedGrid.k_reloadData();
this.k_hide();
}
}
else {
kerio.lib.k_unmaskWidget(this);
}
}, 
k_fillInData: function(k_loadedData, k_fillGroups) {
var k_SHARED_CONSTANTS = this._k_SHARED_CONSTANTS;
var k_todayTimestamp = Math.round(new Date().getTime() / 1000);
var k_data = {
k_type: k_loadedData.type,
k_description: k_loadedData.description || '',
k_absoluteFromDate: k_todayTimestamp,
k_absoluteToDate: k_todayTimestamp
};
var k_days = k_loadedData.days;
switch (k_loadedData.type) {
case k_SHARED_CONSTANTS.kerio_web_TimeRangeDaily:
k_data.k_validOnMonday = (-1 !== k_days.indexOf(k_SHARED_CONSTANTS.kerio_web_Monday));
k_data.k_validOnTuesday = (-1 !== k_days.indexOf(k_SHARED_CONSTANTS.kerio_web_Tuesday));
k_data.k_validOnWednesday = (-1 !== k_days.indexOf(k_SHARED_CONSTANTS.kerio_web_Wednesday));
k_data.k_validOnThursday = (-1 !== k_days.indexOf(k_SHARED_CONSTANTS.kerio_web_Thursday));
k_data.k_validOnFriday = (-1 !== k_days.indexOf(k_SHARED_CONSTANTS.kerio_web_Friday));
k_data.k_validOnSaturday = (-1 !== k_days.indexOf(k_SHARED_CONSTANTS.kerio_web_Saturday));
k_data.k_validOnSunday = (-1 !== k_days.indexOf(k_SHARED_CONSTANTS.kerio_web_Sunday));
var k_daysCount = k_days.length;
var k_isWeekend = (k_data.k_validOnSaturday && k_data.k_validOnSunday) && 2 === k_daysCount; var k_isWeekday = (!k_data.k_validOnSaturday && !k_data.k_validOnSunday) && 5 === k_daysCount; var k_isAllDays = 7 === k_daysCount; var k_validOn = 4; if (k_isWeekend) {
k_validOn = 3;
}
else if (k_isWeekday) {
k_validOn = 2;
}
else if (k_isAllDays) {
k_validOn = 1;
}
k_data.k_validOn = k_validOn;
k_data.k_dailyFrom = this._k_formatTime(k_loadedData.fromTime);
k_data.k_dailyTo = this._k_formatTime(k_loadedData.toTime);
break;
case k_SHARED_CONSTANTS.kerio_web_TimeRangeWeekly:
k_data.k_weeklyFromTime = this._k_formatTime(k_loadedData.fromTime);
k_data.k_weeklyToTime = this._k_formatTime(k_loadedData.toTime);
k_data.k_fromDay = k_loadedData.fromDay;
k_data.k_toDay = k_loadedData.toDay;
break;
case k_SHARED_CONSTANTS.kerio_web_TimeRangeAbsolute:
k_data.k_absoluteFromDate = this._k_dateToTimeStamp(k_loadedData.fromDate);
k_data.k_absoluteToDate = this._k_dateToTimeStamp(k_loadedData.toDate);
k_data.k_absoluteFromTime = this._k_formatTime(k_loadedData.fromTime);
k_data.k_absoluteToTime = this._k_formatTime(k_loadedData.toTime);
break;
default:
break;
}
this.k_form.k_setDataIfNew(k_data, true);
var k_parentGroup = {
id: k_loadedData.groupId,
name: k_loadedData.groupName
};
var k_childGroup = {
id: k_loadedData.childGroupId,
name: k_loadedData.childGroupName
};
if (false !== k_fillGroups) {
this.k_fillGroupList(k_parentGroup, k_childGroup);
}
}, 
k_onOkClick: function() {
var
k_isEditWithChangesOnly = this._k_isEditMode && this._k_isSaveChangesOnly,
k_form = this.k_form,
k_lib,
k_tr,
k_SHARED_CONSTANTS,
k_detail,
k_isEditMode,
k_data,
k_group,
k_getGroupList,
k_dayMap,
k_i,
k_isEnabled,
k_requestCfg,
k_params,
k_method;
if (k_isEditWithChangesOnly && !k_form.k_isChanged()) {
this.k_hide();
return;
}
k_lib = kerio.lib;
k_tr = k_lib.k_tr;
k_SHARED_CONSTANTS = this._k_SHARED_CONSTANTS;
k_detail = k_isEditWithChangesOnly ?
k_form.k_getChangedData(true, [
['k_dailyFrom', 'k_dailyTo', 'k_fromDay', 'k_toDay', 'k_weeklyFromTime', 'k_weeklyToTime',
'k_absoluteFromDate', 'k_absoluteToDate', 'k_absoluteFromTime', 'k_absoluteToTime', 'k_type'
],
['k_type', 'k_dailyFrom', 'k_dailyTo', 'k_validOnMonday', 'k_validOnTuesday', 'k_validOnWednesday',
'k_validOnThursday', 'k_validOnFriday', 'k_validOnSaturday', 'k_validOnSunday']
]) :
k_form.k_getData();
if (k_detail.k_type == k_SHARED_CONSTANTS.kerio_web_TimeRangeDaily && !this.k_checkDailyValidOn()) {
k_lib.k_alert({
k_title: this._k_translations.k_validationAlertTitle,
k_msg: k_tr('It is required to select at least one Valid on day.', 'wlibTimeRangeEditor')
});
return;
}
if (!this.k_checkTimes()) {
kerio.lib.k_alert({
k_title: k_tr('Invalid range', 'wlibAlerts'),
k_msg: k_tr('Specified times are not valid for range.', 'wlibTimeRangeEditor')
});
return;
}
k_isEditMode = this._k_isEditMode;
k_data = {
type: k_detail.k_type,
description: k_detail.k_description
};
if (k_detail.k_existingGroup || k_detail.k_newGroup) {
k_group = this.k_getGroup();
k_getGroupList = this._k_getGroupList;
k_data.groupId = k_group[k_getGroupList.k_id];
k_data.groupName = k_group[k_getGroupList.k_name];
}
switch (k_detail.k_type) {
case k_SHARED_CONSTANTS.kerio_web_TimeRangeDaily:
k_data.days = [];
k_dayMap = this._k_dayMap;
for (k_i in k_dayMap) { if (k_detail[k_i]) {
k_data.days.push(k_SHARED_CONSTANTS[k_dayMap[k_i]]);
}
} k_data.fromTime = this._k_parseTime(k_detail.k_dailyFrom);
k_data.toTime = this._k_parseTime(k_detail.k_dailyTo);
break;
case k_SHARED_CONSTANTS.kerio_web_TimeRangeWeekly:
k_data.fromDay = k_detail.k_fromDay;
k_data.toDay = k_detail.k_toDay;
k_data.fromTime = this._k_parseTime(k_detail.k_weeklyFromTime);
k_data.toTime = this._k_parseTime(k_detail.k_weeklyToTime);
break;
case k_SHARED_CONSTANTS.kerio_web_TimeRangeAbsolute:
k_data.fromDate = this._k_timeStampToDate(k_detail.k_absoluteFromDate);
k_data.toDate = this._k_timeStampToDate(k_detail.k_absoluteToDate);
k_data.fromTime = this._k_parseTime(k_detail.k_absoluteFromTime);
k_data.toTime = this._k_parseTime(k_detail.k_absoluteToTime);
break;
default:
if (undefined !== k_detail.k_type) {
kerio.lib.k_reportError('Internal error: Invalid time range type' +
' (value: ' +
k_detail.k_type +
', type ' +
typeof(k_detail.k_type) +
')', 'TimeRangeEditor', 'k_onOkClick'); }
break;
}
k_isEnabled = (!this._k_isEditMode || this._k_enabled);
if (false === this._k_config.k_useBoolean) {
k_isEnabled = (k_isEnabled) ? 1 : 0;
}
if (!k_isEditWithChangesOnly) {
k_data.enabled = k_isEnabled;
}
k_params = {};
if (k_isEditMode) {
k_params.rangeIds = [this._k_data.id]; k_params.details = k_data;
k_method = 'set';
}
else {
k_params.ranges = [k_data]; k_method = 'create';
}
k_requestCfg = {
k_jsonRpc: {
'method': 'TimeRanges.' + k_method,
'params': k_params
},
k_callback: this._k_saveDataCallback,
k_scope: this
};
k_lib.k_maskWidget(this, {k_message: k_lib.k_tr('Saving…', 'wlibWait')});
k_lib.k_ajax.k_request(k_requestCfg);
}, 
_k_saveDataCallback: function(k_response) {
kerio.adm.k_widgets.K_TimeRangeEditor.superclass._k_saveDataCallback.call(this, k_response);
if (k_response.k_isOk && 0 === k_response.k_decoded.errors.length) {
if (this._k_config.k_onClose) {
this._k_config.k_onClose.call(this.k_relatedGrid, k_response, this._k_isEditMode);
}
this.k_relatedGrid.k_reloadData();
this.k_hide();
}
}, 
_k_formatTime: function(k_time) {
var k_date = new Date('1/1/2007 ' + k_time.hour + ':' + k_time.min + ':00');
return k_date.format(this._k_timeFormat);
}, 
_k_parseTime: function(k_timeString) {
var k_date = Date.parseDate(k_timeString, 'G:i');
if (k_date) {
return {hour: k_date.getHours(), min: k_date.getMinutes()};
}
else {
return false;
}
}, 
_k_timeStampToDate: function(k_timeStamp) {
var k_date = Date.parseDate(k_timeStamp, 'U');
return {'year': k_date.getFullYear(), 'month': k_date.getMonth(), 'day': k_date.getDate()};
},

_k_dateToTimeStamp: function(k_date) {
return Date.parseDate(k_date.year + '-' + (k_date.month + 1) + '-' + k_date.day, 'Y-n-j').format('U');
},

k_onGroupNameChange: function(k_groupName, k_isNew) {
this.k_checkTimes();
},

_k_isTimeRangeValid: function(k_from, k_to, k_allowMidnight) {
var k_fromParts = k_from.k_getValue().split(':');
var k_toParts = k_to.k_getValue().split(':');
var k_fromHour = parseInt(k_fromParts[0], 10);
var k_fromMin = parseInt(k_fromParts[1], 10);
var k_toHour = parseInt(k_toParts[0], 10);
var k_toMin = parseInt(k_toParts[1], 10);
if (true === k_allowMidnight) {
return (k_fromHour !== k_toHour) || (k_fromHour === k_toHour && k_fromMin !== k_toMin);
}
else {
return (k_fromHour  <  k_toHour) || (k_fromHour === k_toHour && k_fromMin  <  k_toMin);
}
},

k_checkDailyValidOn: function() {
var
k_dayMap = this._k_dayMap,
k_countChecked = 0,
k_i;
for (k_i in k_dayMap) { if (this.k_form.k_getItem(k_i).k_getValue()) {
k_countChecked++;
}
}
return (0 < k_countChecked);
},

k_checkTimes: function() {
if (kerio.lib.k_getSharedConstants('kerio_web_Auditor') === kerio.adm.k_framework._k_userRole || this.k_isReadOnly()) {
return;
}
var k_form = this.k_form;
var k_enable = true;
if (k_form.k_getItem('k_weekly').k_isVisible()) {
var k_weeklyFromTime = k_form.k_getItem('k_weeklyFromTime');
var k_weeklyToTime = k_form.k_getItem('k_weeklyToTime');
var k_areWeeklyTimeFieldsValid = false;
if (k_form.k_getItem('k_fromDay').k_getValue() === k_form.k_getItem('k_toDay').k_getValue()) {
k_areWeeklyTimeFieldsValid = this._k_isTimeRangeValid(k_weeklyFromTime, k_weeklyToTime);
if (!k_areWeeklyTimeFieldsValid) {
k_enable = false;
}
k_areWeeklyTimeFieldsValid = !k_areWeeklyTimeFieldsValid;
}
k_weeklyFromTime.k_markInvalid(!k_weeklyFromTime.k_isValid() || k_areWeeklyTimeFieldsValid);
k_weeklyToTime.k_markInvalid(!k_weeklyToTime.k_isValid() || k_areWeeklyTimeFieldsValid);
}
else if (k_form.k_getItem('k_daily').k_isVisible()) {
var k_dailyFrom = k_form.k_getItem('k_dailyFrom');
var k_dailyTo = k_form.k_getItem('k_dailyTo');
var k_areDailyTimeFieldsValid = this._k_isTimeRangeValid(k_dailyFrom, k_dailyTo, true); k_dailyFrom.k_markInvalid(!k_dailyFrom.k_isValid() || !k_areDailyTimeFieldsValid);
k_dailyTo.k_markInvalid(!k_dailyTo.k_isValid() || !k_areDailyTimeFieldsValid);
if (!k_areDailyTimeFieldsValid) {
k_enable = false;
}
}
else if (k_form.k_getItem('k_absolute').k_isVisible()) {
var k_absoluteFromTime = k_form.k_getItem('k_absoluteFromTime');
var k_absoluteToTime = k_form.k_getItem('k_absoluteToTime');
var k_areAbsoluteTimeFieldsValid = false;
if (k_form.k_getItem('k_absoluteFromDate').k_getValue() === k_form.k_getItem('k_absoluteToDate').k_getValue()) {
k_areAbsoluteTimeFieldsValid = this._k_isTimeRangeValid(k_absoluteFromTime, k_absoluteToTime);
if (!k_areAbsoluteTimeFieldsValid) {
k_enable = false;
}
k_areAbsoluteTimeFieldsValid = !k_areAbsoluteTimeFieldsValid;
}
k_absoluteFromTime.k_markInvalid(!k_absoluteFromTime.k_isValid() || k_areAbsoluteTimeFieldsValid);
k_absoluteToTime.k_markInvalid(!k_absoluteToTime.k_isValid() || k_areAbsoluteTimeFieldsValid);
}
return k_enable;
}, 
k_validateDays: function(k_form, k_item) {
if (k_form._k_isBreakSet) {
return;
}
var k_validOn = k_form.k_getItem('k_validOn');
var k_selectedDays = {};
var k_countChecked = 0;
var k_dayMap = k_form.k_dialog._k_dayMap;
for (var k_i in k_dayMap) { if (k_form.k_getItem(k_i).k_getValue()) {
k_selectedDays[k_dayMap[k_i]] = 1;
k_countChecked++;
}
}
var k_type = 4;
if (7 === k_countChecked) {
k_type = 1; }
else {
if (undefined === k_selectedDays.kerio_web_Saturday &&
undefined === k_selectedDays.kerio_web_Sunday &&
5 === k_countChecked) {k_type = '2'; }
else {
if (1 == k_selectedDays.kerio_web_Saturday &&
1 == k_selectedDays.kerio_web_Sunday &&
2 === k_countChecked) {k_type = '3'; }
}
}
if (4 == k_type) {
k_form._k_selectedDays = k_selectedDays;
}
else {
k_form._k_selectedDays = null;
}
k_validOn.k_setValue(k_type, false);
}, 
_k_setSavedDays: function (k_form) {
var k_dayMap = k_form.k_dialog._k_dayMap;
var k_selectedDays = k_form._k_selectedDays;
for (var k_i in k_dayMap) {
if (k_selectedDays && k_selectedDays[k_dayMap[k_i]]) {
k_form.k_getItem(k_i).k_setValue(true, false);
}
else {
k_form.k_getItem(k_i).k_setValue(false, false);
}
}
} });


kerio.adm.k_widgets.K_GridWithToolbar = function(k_id, k_config){
var k_isReadOnly = k_config.k_isReadOnly || false; var k_kerioWidgets = kerio.adm.k_widgets;

if (undefined === k_config.k_toolbars) {
k_config.k_toolbars = {};
}
var k_toolbars = k_config.k_toolbars;
var k_configToolbar; var k_contextMenu, k_onDblClick;
if (k_toolbars.k_right) { k_configToolbar = k_toolbars.k_right;
k_configToolbar.k_restrictBy = k_config.k_restrictBy;
k_configToolbar.k_type = k_configToolbar.k_type || 'k_gridDefault';
k_configToolbar.k_dialogs = k_config.k_dialogs;
k_configToolbar.k_isReadOnly = k_config.k_isReadOnly;
k_configToolbar.k_removeButtonHandler = k_config.k_removeButtonHandler;
k_configToolbar.k_grid = this;
k_toolbars.k_right = new k_kerioWidgets.K_ActionToolbar(k_id + '_' + 'k_rightToolbar', k_configToolbar);
k_onDblClick = k_toolbars.k_right._k_editItem; k_contextMenu = k_toolbars.k_right.k_sharedMenu; }
if ((k_toolbars.k_bottom || !k_toolbars.k_right)) { k_configToolbar = k_toolbars.k_bottom || {}; k_configToolbar.k_restrictBy = k_config.k_restrictBy;
k_configToolbar.k_type = k_configToolbar.k_type || 'k_gridDefault';
k_configToolbar.k_dialogs = k_config.k_dialogs;
k_configToolbar.k_isReadOnly = k_config.k_isReadOnly;
k_configToolbar.k_removeButtonHandler = k_config.k_removeButtonHandler;
k_configToolbar.k_grid = this;
if ('k_none' === k_configToolbar.k_type) {
delete k_toolbars.k_bottom;
}
else {
k_toolbars.k_bottom = new k_kerioWidgets.K_ActionToolbar(k_id + '_' + 'k_bottomToolbar', k_configToolbar);
k_onDblClick = k_onDblClick || k_toolbars.k_bottom._k_editItem; k_contextMenu = k_contextMenu || k_toolbars.k_bottom.k_sharedMenu; }
}
if (k_toolbars.k_top) {
k_configToolbar = k_toolbars.k_top;
k_configToolbar.k_restrictBy = k_config.k_restrictBy;
if (k_configToolbar.k_config.k_domain) {
k_configToolbar.k_config.k_domain.k_domainIdQueryParam = k_configToolbar.k_config.k_domain.k_domainIdQueryParam || 'domainId';
k_configToolbar.k_config.k_domain.k_domainOrderByParam = k_configToolbar.k_config.k_domain.k_domainOrderByParam || 'name';
}
switch (k_configToolbar.k_type) {
case 'k_search':
k_configToolbar = new k_kerioWidgets.K_SearchToolbar(k_id + '_' + 'k_searchToolbar', k_configToolbar.k_config);
break;
case 'k_domainSelect':
k_configToolbar = new k_kerioWidgets.K_DomainSelectToolbar(k_id + '_' + 'k_domainSelectToolbar', k_configToolbar.k_config);
break;
case 'k_userList':
k_configToolbar = new k_kerioWidgets.K_UserListToolbar(k_id + '_' + 'k_userListToolbar', k_configToolbar.k_config);
break;
case 'k_userDefined':	k_configToolbar = k_configToolbar.k_config; break;
default:
kerio.lib.k_reportError('Internal error: Undefined type of top toolbar', 'basicList.js');
break;
} if (k_configToolbar instanceof kerio.adm.k_widgets.K_DomainSelectToolbar) {
var k_selectDataStore = k_configToolbar.k_domainSelect._k_dataStore.k_extWidget;
k_selectDataStore.on('beforeload',     this._k_showLoadingMask.createDelegate(this, [true]), this);
k_selectDataStore.on('load',           this._k_showLoadingMask.createDelegate(this, [false]), this);
k_selectDataStore.on('loadexception',  this._k_showLoadingMask.createDelegate(this, [false]), this);
}
k_config.k_toolbars.k_top = k_configToolbar;
}
k_configToolbar = null; 
k_config.k_contextMenu = k_config.k_contextMenu || k_contextMenu;
k_config.k_onDblClick = k_config.k_onDblClick || k_onDblClick;
k_kerioWidgets.K_GridWithToolbar.superclass.constructor.call(this, k_id, k_config);
var k_constants = kerio.lib.k_constants;
var k_constEventTypes = k_constants.k_EVENT.k_TYPES;
var k_libConstants = {
_k_constEventTypes: k_constEventTypes,
_k_constKeyCodes: k_constants.k_EVENT.k_KEY_CODES
};
var k_toolbarGrid = {
k_toolbar: k_toolbars.k_bottom || k_toolbars.k_right,
_k_isReadOnly: k_isReadOnly,
_k_libConstants: k_libConstants,
_k_sharedConstants: kerio.lib.k_getSharedConstants()
};
var k_remoteData = k_config.k_remoteData;
if (k_remoteData) {
k_toolbarGrid._k_requestErrorHandler = k_remoteData.k_requestErrorHandler;
k_toolbarGrid._k_requestFields = k_remoteData.k_requestFields;
k_toolbarGrid._k_engineManager = '';
}
if (k_toolbars.k_top) {
k_toolbarGrid.k_topToolbar = k_toolbars.k_top;
}
this.k_toolbarGrid = k_toolbarGrid;
var k_observedEvents = [k_constEventTypes.k_SELECTION_CHANGED];
if (!k_isReadOnly) {	k_observedEvents.push(k_constEventTypes.k_KEY_PRESSED);
}
var k_registerObserver = kerio.lib.k_registerObserver;
if (k_toolbars.k_bottom) {
k_registerObserver(this, k_toolbars.k_bottom, k_observedEvents);
}
if (k_toolbars.k_right) {
k_registerObserver(this, k_toolbars.k_right, k_observedEvents);
}
k_toolbars = null;
k_config = null;
k_constants = null;
}; kerio.lib.k_extend('kerio.adm.k_widgets.K_GridWithToolbar', kerio.lib.K_Grid,
{




k_setReadOnly: function (k_readOnly) {
var
k_toolbars = this.k_toolbars,
k_toolbarType,
k_toolbar;
kerio.adm.k_widgets.K_GridWithToolbar.superclass.k_setReadOnly.call(this, k_readOnly);
for (k_toolbarType in k_toolbars) {
k_toolbar = k_toolbars[k_toolbarType];
if ('function' === Ext.type(k_toolbar)) {
continue;
}
if (k_toolbar.k_isInstanceOf('kerio.adm.k_widgets.K_ActionToolbar')) {
if (k_toolbar._k_useViewBtnForReadOnly) {
k_toolbar.k_setReadOnly(false);
}
}
else if (k_toolbar.k_isInstanceOf('kerio.adm.k_widgets.K_SearchToolbar')) {
k_toolbar.k_setReadOnly(false);
}
}
},

k_initGrid: function(k_config) {
var k_domain = null;
var k_query = {};
if (this._k_dataStore._k_isQueryValueSent) {
k_query = this._k_createQuery(''); }
var k_topToolbar = this.k_toolbarGrid.k_topToolbar;
if (k_topToolbar && k_topToolbar.k_searchField) {
k_topToolbar.k_searchField.k_setValue(''); if (k_topToolbar.k_config.k_domain) {
k_domain = k_topToolbar.k_config.k_domain.k_currentDomain; }
}
this.k_toolbarGrid._k_domain = k_domain;
if (k_domain) {
k_query[k_topToolbar.k_config.k_domain.k_domainIdQueryParam] = k_domain.k_id; }
if (k_config) {
for (var k_param in k_config) {
k_query[k_param] = k_config[k_param];
}
}
if (k_topToolbar && k_topToolbar.k_domainSelect) {
k_topToolbar.k_domainSelect.k_currentDomainId = k_config.domainId;
k_topToolbar.k_domainSelect.k_reload();
}
else {
this.k_reloadData(k_query);
}
},

k_setDialogAdditionalParams: function(k_params) {
this.k_toolbarGrid.k_toolbar.k_setDialogAdditionalParams(k_params);
},

_k_createQuery: function(k_searchValue) {
var
k_queryValue,
k_conditions = [],
k_toolbarGrid = this.k_toolbarGrid,
k_sharedConstants = k_toolbarGrid._k_sharedConstants,
k_topToolbar = k_toolbarGrid.k_topToolbar,
k_isCheckboxChecked = k_topToolbar && k_topToolbar.k_checkbox ? k_topToolbar.k_checkbox.k_getValue() : false,
k_search = k_topToolbar ? k_topToolbar.k_config.k_search : undefined,
k_searchBy = k_search ? k_search.k_searchBy : undefined,
k_i;
k_queryValue = {
'query': {
'fields': k_toolbarGrid._k_requestFields
}
};
if (k_searchBy !== undefined) {
k_searchBy = 'string' === typeof k_searchBy ? [k_searchBy] : k_searchBy;
k_queryValue.start = 0;
for (k_i = 0; k_i < k_searchBy.length; k_i++) {
k_conditions.push({
'fieldName': k_searchBy[k_i],
'comparator': k_sharedConstants.kerio_web_Like,
'value': k_searchValue
});
}
if ('' === k_searchValue) {
k_conditions = [];
}
k_queryValue.query.combining = undefined !== k_search.k_combining ? k_search.k_combining : k_sharedConstants.kerio_web_And;
}
if (k_isCheckboxChecked) {
k_conditions = k_conditions.concat(this._k_getCheckboxCondition());
}
if (undefined !== k_topToolbar && undefined !== k_topToolbar._k_filterData) {
k_conditions = k_conditions.concat(k_topToolbar._k_filterData);
}
if (k_conditions.length > 0) {
k_queryValue.query.conditions = k_conditions;
}
return k_queryValue;
}, 
_k_getCheckboxCondition: function() {
var
k_sharedConstants = this.k_toolbarGrid._k_sharedConstants,
k_conditionDef = this.k_toolbarGrid.k_topToolbar.k_config.k_checkbox.k_conditions || {},
k_condition = [],
k_item,
k_i, k_cnt;
if (!(k_conditionDef instanceof Array)) {
k_conditionDef = [k_conditionDef];
}
for (k_i = 0, k_cnt = k_conditionDef.length; k_i < k_cnt; k_i++) {
k_item = k_conditionDef[k_i];
k_condition.push({
'fieldName': k_item.k_firstOperand || 'isEnabled',
'comparator': k_item.k_comparator || k_sharedConstants.kerio_web_Eq,
'value': k_item.k_secondOperand || true
});
}
return k_condition;
}
}); 
kerio.adm.k_widgets.K_ActionToolbar = function(k_id, k_config){
var k_isReadOnly = k_config.k_isReadOnly;
var k_toolbarItems;
var k_customUpdate;
this._k_useViewBtnForReadOnly = false !== k_config.k_useViewBtnForReadOnly;
if ('function' === typeof k_config.k_removeButtonHandler) {
this._k_removeItem = this._k_removeItemUserDefined;
this._k_removeAction = k_config.k_removeButtonHandler;
}
var k_toolbarCfg = k_config;
if (k_toolbarCfg) {
k_customUpdate = k_toolbarCfg.k_update; }
else {
k_toolbarCfg = {};
}
var k_toolbarType = k_config.k_type ? k_config.k_type : 'k_applyResetOnly';
k_toolbarCfg.k_hasSharedMenu = k_config.k_hasSharedMenu || ('k_userDefined' !== k_toolbarType);
var k_update;
var k_editItem;
var k_tr = kerio.lib.k_tr;
var k_applyResetButton = [];

if ('k_applyResetOnly' === k_toolbarType || 'k_applyReset' === k_toolbarType) {
k_applyResetButton = [
'->',
{
k_id: 'k_btnApply',
k_caption: k_tr('Apply', 'wlibButtons'),
k_isInSharedMenu: false,
k_isDisabled: true,
k_onClick: k_config.k_onApply || this._k_applyHandler,
k_validateBeforeClick: kerio.lib.k_constants.k_DEFAULT_VALIDATION_STATUS
},
{
k_id: 'k_btnReset',
k_caption: k_tr('Reset', 'wlibButtons'),
k_isInSharedMenu: false,
k_isDisabled: true,
k_onClick: k_config.k_onReset || this._k_resetHandler
}
];
}
if ('k_userDefined' === k_toolbarType) {	k_toolbarItems = k_toolbarCfg.k_items;
k_update = k_toolbarCfg.k_update;
}
else if ('k_applyResetOnly' === k_toolbarType) {	k_toolbarItems = k_toolbarCfg.k_items || [];
k_toolbarItems = k_toolbarItems.concat(k_applyResetButton);
k_update = k_toolbarCfg.k_update;
}
else {	

k_editItem = function(k_scope) {
var k_toolbar = k_scope.k_relatedWidget ? k_scope : this.k_toolbarGrid.k_toolbar;	if (!k_toolbar.k_isItemDisabled('k_btnEdit')) {
k_toolbar._k_openDialog(k_toolbar, true);
}
};
if (k_isReadOnly && this._k_useViewBtnForReadOnly) {
k_toolbarItems = [
{k_id: 'k_btnView', k_caption: k_tr('View…', 'wlibButtons'), k_isDisabled: true, k_onClick: k_editItem}
];

k_update = function(k_sender, k_event){
if (k_sender instanceof kerio.lib.K_Grid) {
this.k_enableItem('k_btnView', (1 === k_sender.k_selectionStatus.k_selectedRowsCount));
}
if (this._k_customUpdate) {
this._k_customUpdate.call(this, k_sender, k_event);
}
};
}
else {
k_toolbarItems = [
{k_id: 'k_btnAdd', k_caption: k_tr('Add…', 'wlibButtons'),

k_onClick: function(k_toolbar) {
k_toolbar._k_openDialog(k_toolbar, false);
}
},
{k_id: 'k_btnEdit', k_caption: k_tr('Edit…', 'wlibButtons'), k_isDisabled: true, k_onClick: k_editItem},
{k_id: 'k_btnRemove', k_caption: k_tr('Remove', 'wlibButtons'), k_isDisabled: true, k_onClick: this._k_removeItem}
]; 
k_update = function(k_sender, k_event) {
if (k_sender.k_isReadOnly()) {	return;
}
var k_constEventTypes = k_sender.k_toolbarGrid._k_libConstants._k_constEventTypes;
var k_toolbar = this;
if (k_sender instanceof kerio.lib.K_Grid) {
switch (k_event.k_type) {
case k_constEventTypes.k_SELECTION_CHANGED:
var k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount;
var k_selectedOne = k_selectedRowsCount === 1;
var k_selectedMany = k_selectedRowsCount > 0;
this.k_enableItem('k_btnEdit', k_selectedOne);
this.k_enableItem('k_btnRemove', k_selectedMany);
break; case k_constEventTypes.k_KEY_PRESSED:
var k_constKeyCodes = k_sender.k_toolbarGrid._k_libConstants._k_constKeyCodes;
var k_currentKeyCode = k_event.k_browserEvent.keyCode;
if ((k_constKeyCodes.k_BACKSPACE === k_currentKeyCode || k_constKeyCodes.k_DELETE === k_currentKeyCode))
{
k_toolbar._k_removeItem();
}
break; }
}
if (k_toolbar._k_customUpdate) {
k_toolbar._k_customUpdate.call(this, k_sender, k_event);
}
};
} if ('k_additional' === k_toolbarType) {	k_toolbarItems = k_toolbarItems.concat(k_toolbarCfg.k_items);
}
if ('k_applyReset' === k_toolbarType) {	k_toolbarItems = k_toolbarItems.concat(k_applyResetButton);
}
}k_toolbarCfg.k_items = k_toolbarItems;
k_toolbarCfg.k_update = k_update;
var k_defaultObjectNames = {	k_add: 'Add',
k_edit: 'Edit',
k_view: 'View'
};
var k_dialogParam = {};
var k_cfgDialogs = k_config.k_dialogs;
if (k_cfgDialogs) {
var k_sourceName = k_cfgDialogs.k_sourceName;
var k_objectName = k_cfgDialogs.k_objectName || {};
for (var k_defaultObjectName in k_defaultObjectNames) {	if (!k_objectName[k_defaultObjectName]) {
k_objectName[k_defaultObjectName] = k_sourceName + k_defaultObjectNames[k_defaultObjectName];
}
}
k_dialogParam = {
_k_sourcePath: k_cfgDialogs.k_sourcePath,
_k_sourceName: k_sourceName,
_k_objectName: k_objectName,
_k_additionalParams: k_cfgDialogs.k_additionalParams
};
}
kerio.adm.k_widgets.K_ActionToolbar.superclass.constructor.call(this, k_id, k_toolbarCfg);
this.k_addReferences({
_k_dialogParam: k_dialogParam,
k_onApply: k_config.k_onApply,
k_onReset: k_config.k_onReset,
_k_editItem: k_editItem,
k_grid: k_config.k_grid	});
if (k_customUpdate) {	this._k_customUpdate = k_customUpdate;
}
k_toolbarCfg = null;
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_ActionToolbar', kerio.lib.K_Toolbar,
{








k_setDialogAdditionalParams: function(k_params) {
this._k_dialogParam._k_additionalParams = k_params;
},

k_removeDialogAdditionalParams: function(k_params) {
var
k_i,
k_cnt;
k_params = ('string' === typeof k_params) ? [k_params] : k_params;
for (k_i = 0, k_cnt = k_params.length; k_i < k_cnt; k_i++) {
delete this._k_dialogParam._k_additionalParams[k_params[k_i]];
}
},

_k_removeItem: function() {
this.k_grid.k_removeSelectedRows();
},

_k_removeItemUserDefined: function() {
this._k_removeAction(this.k_grid, this.k_grid.k_selectionStatus.k_rows);
},

_k_applyHandler: function() {
this._k_applyResetHandler('apply');
},

_k_resetHandler: function() {
this._k_applyResetHandler('reset');
},

_k_applyResetHandler: function(k_method) {
this._k_sendRequest(k_method);
},

_k_openDialog: function(k_toolbar, k_isEditMode) {
var
k_grid = k_toolbar.k_relatedWidget,
k_params = {},
k_dialogParam,
k_toolbarGrid,
k_selectionStatus,
k_sourceName,
k_objectName,
k_objectNameEdit,
k_dialogParams,
k_row;
k_dialogParam = k_toolbar._k_dialogParam;
if (k_dialogParam._k_additionalParams) {
k_params = kerio.lib.k_cloneObject(k_dialogParam._k_additionalParams); }
k_params.k_relatedGrid = k_grid;
k_toolbarGrid = k_grid.k_toolbarGrid;
if (k_toolbarGrid._k_domain) {	k_params.k_domain = k_toolbarGrid._k_domain;
}
if (k_isEditMode) {	k_selectionStatus = k_grid.k_selectionStatus;
if (0 === k_selectionStatus.k_rows.length) {
return;
}
k_row = k_selectionStatus.k_rows[0];
k_params.k_selectionStatus = k_selectionStatus;
k_params.k_data = k_row.k_data;
k_params.k_rowIndex = k_row.k_rowIndex;
}
k_sourceName = k_dialogParam._k_sourceName;
k_objectName = k_dialogParam._k_objectName;
k_objectNameEdit = k_toolbarGrid._k_isReadOnly ? k_objectName.k_view : k_objectName.k_edit;
k_dialogParams = {
k_sourcePath: k_dialogParam._k_sourcePath,
k_sourceName: k_sourceName,
k_objectName:  (k_isEditMode) ? k_objectNameEdit : k_objectName.k_add,
k_params: k_params
};
kerio.lib.k_ui.k_showDialog(k_dialogParams);
},
k_setDisabledApplyReset: function(k_isApplyDisabled, k_isResetDisabled) {
this.k_enableItem('k_btnApply', !k_isApplyDisabled);
this.k_enableItem('k_btnReset', !k_isResetDisabled);
}, 
_k_sendRequest: function(k_method, k_params, k_options) {
k_options = k_options || {};
var k_requestParams = {
k_jsonRpc: {
method: k_method,
params: k_params
},
k_callbackParams: k_options.k_callbackParams || undefined,
k_callback: k_options.k_callback,
k_scope: k_options.k_scope || this
};
kerio.lib.k_ajax.k_request(k_requestParams);
} });

kerio.adm.k_widgets.K_SearchToolbar = function(k_id, k_config) {
var k_localNamespace = k_id + '_';
var k_configTextField = {
k_caption: k_config.k_search.k_caption,
k_id: 'k_search',
k_value: '',
k_width: 200,
k_maxLength: 128,
k_isSearchField: false !== k_config.k_search.k_isSearchField,

k_onKeyDown: function(k_toolbar, k_textField, k_extEvent) {
if (k_extEvent.ENTER !== k_extEvent.keyCode) {
return;
}
var k_searchValue = k_textField.k_getValue();
k_extEvent.stopEvent();
k_toolbar.k_relatedWidget.k_reloadData(k_toolbar.k_relatedWidget._k_createQuery(k_searchValue));
}
};
var k_searchField = new kerio.lib.K_TextField(k_localNamespace + 'k_searchField', k_configTextField);
var k_searchToolbarConfiguration = {
k_items: [
'->',    {k_content: k_searchField}
]
};
kerio.adm.k_widgets.K_SearchToolbar.superclass.constructor.call(this, k_id, k_searchToolbarConfiguration);
this.k_searchField = k_searchField;
this.k_config = k_config;
k_searchField = null;
k_searchToolbarConfiguration = null;
};kerio.lib.k_extend('kerio.adm.k_widgets.K_SearchToolbar', kerio.lib.K_Toolbar,
{



k_getDomain: function() {
return this.k_relatedWidget.k_toolbarGrid._k_domain;
},

k_setFilterData: function(k_data) {
this._k_filterData = k_data;
}
});

kerio.adm.k_widgets.K_DomainSelectToolbar = function(k_id, k_config) {
var
k_localNamespace = k_id + '_',
k_domainConfig = k_config.k_domain;
kerio.adm.k_widgets.K_DomainSelectToolbar.superclass.constructor.call(this, k_id, k_config);

var k_onChange = function(k_toolbar, k_select, k_value) {
if (this.k_customOnChange) {	this.k_customOnChange.call(this, k_toolbar, k_select, k_value);
}
var k_relatedWidget = k_toolbar.k_relatedWidget;
var k_queryParams = k_relatedWidget._k_createQuery('');
k_queryParams[k_select.k_domainIdQueryParam] = k_value;
k_toolbar.k_searchField.k_setValue('');
k_relatedWidget.k_toolbarGrid._k_domain = {	k_id: k_value,
k_name: k_select.k_getText()
};
k_relatedWidget.k_reloadData(k_queryParams);
};

var k_onInit = function() {
var k_toolbar = this.k_toolbar;
if (this.k_onDataInit) {
this.k_onDataInit();
}
if (!this.k_currentDomainId) {
this.k_currentDomainId = this.k_getValue();
}
this.k_setCurrentDomain.call(k_toolbar, this.k_currentDomainId);
if (this.k_customCallback) {
this.k_customCallback.call(this);
}
};
var k_configRemoteData = k_domainConfig.k_remoteData;
var k_requestParams = k_configRemoteData.k_requestParams || {};
var k_sharedConstants = kerio.lib.k_getSharedConstants();
var k_queryCfg = {
fields: k_requestParams.k_fields || ['id', 'name'],
orderBy: [{
columnName: k_domainConfig.k_domainOrderByParam || 'name',
direction: k_sharedConstants.kerio_web_Asc
}],
start: 0,
limit: k_sharedConstants.kerio_web_Unlimited
};
var k_remoteDataConfig = {
k_root: k_configRemoteData.k_root || 'list',
k_isQueryValueSent: true,
k_isAutoLoaded: false,
k_jsonRpc: {
method: (k_requestParams.k_object || 'Domains') + '.' + (k_requestParams.k_method || 'get'),
params: {
query: k_queryCfg
}
}
};
Ext.apply(k_domainConfig, {
k_id: 'k_domain',
k_width: 170,
k_onChange: k_onChange,
k_onInit: k_onInit,
k_fieldDisplay: k_domainConfig.k_fieldDisplay || 'name',
k_fieldValue: k_domainConfig.k_fieldValue || 'id',
k_useColumnsNames: true,
k_remoteData: k_remoteDataConfig
});
var k_domainSelect = new kerio.lib.K_Select(k_localNamespace + 'k_domainSelect', k_domainConfig);
this.k_addWidget(k_domainSelect, 0);
k_domainSelect.k_addReferences({
k_onDataInit: k_configRemoteData.k_onDataInit,
k_customCallback: k_configRemoteData.k_callback,
k_setCurrentDomain: this._k_setCurrentDomain,
k_currentDomainId: k_domainConfig.k_currentDomain.k_id,
k_toolbar: this,
k_domainIdQueryParam: k_domainConfig.k_domainIdQueryParam || 'domainId'
});
if (undefined !== k_domainConfig.k_onCustomChange) {
k_domainSelect.k_addReferences({
k_customOnChange: k_domainConfig.k_onCustomChange
});
}
this.k_addReferences({
k_domainSelect: k_domainSelect
});
k_config = null;
k_domainSelect = null;
};kerio.lib.k_extend('kerio.adm.k_widgets.K_DomainSelectToolbar', kerio.adm.k_widgets.K_SearchToolbar,
{


_k_setCurrentDomain: function(k_currentDomainId) {
var k_domainSelect = this.k_domainSelect;
var k_currentDomain = k_currentDomainId || this.k_config.k_domain.k_currentDomain.k_id;
if (k_domainSelect.k_getValue() !== k_currentDomain) {
if (!k_domainSelect.k_containsValue(k_currentDomain)) {
k_domainSelect.k_currentDomainId = null;	k_domainSelect.k_reload();
}
else {
k_domainSelect.k_setValue(k_currentDomain);
}
}
else {
var k_queryParams = this.k_relatedWidget._k_createQuery('');
k_queryParams[k_domainSelect.k_domainIdQueryParam] = k_currentDomain;
this.k_relatedWidget.k_reloadData(k_queryParams);
}
this.k_relatedWidget.k_toolbarGrid._k_domain = {	k_id: k_currentDomain,
k_name: k_domainSelect.k_getText()
};
}
});
kerio.adm.k_widgets.K_UserListToolbar = function(k_id, k_config){
var k_localNamespace = k_id + '_';
var k_checkboxConfig = k_config.k_checkbox;
kerio.adm.k_widgets.K_UserListToolbar.superclass.constructor.call(this, k_id, k_config);

var k_onChange = function(k_toolbar, k_checkbox, k_isChecked) {
var k_relatedWidget = k_toolbar.k_relatedWidget;
var k_queryParams = k_relatedWidget._k_createQuery(k_toolbar.k_searchField.k_getValue());
if (this.k_customOnChange) {	this.k_customOnChange.call(this, k_toolbar, k_checkbox, k_isChecked);
}
k_queryParams[k_toolbar.k_config.k_domain.k_domainIdQueryParam] = k_relatedWidget.k_toolbarGrid._k_domain.k_id;
k_relatedWidget.k_reloadData(k_queryParams);
};
Ext.applyIf(k_checkboxConfig, {
k_type: 'k_checkbox',
k_id: 'k_basiclistCheckbox',
k_isLabelHidden: true,
k_onChange: k_onChange
});
var k_checkbox = new kerio.lib.K_Checkbox(k_localNamespace + 'k_checkbox', k_checkboxConfig);
k_checkbox.k_parent = this;
this.k_checkbox = k_checkbox;
if (undefined !== k_checkboxConfig.k_onCustomChange) {
k_checkbox.k_addReferences({
k_customOnChange: k_checkboxConfig.k_onCustomChange
});
}
this.k_addWidget(k_checkbox, 2);
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_UserListToolbar', kerio.adm.k_widgets.K_DomainSelectToolbar,
{

});


kerio.adm.k_widgets.K_BasicToolbar = function(k_id, k_config) {
if (!this._k_isClassInitialized) {
this._k_initClass();
}
k_config = kerio.lib.k_applyRestrictionToConfig(k_config);  k_config.k_items = this._k_parseItems(k_config.k_items);
kerio.adm.k_widgets.K_BasicToolbar.superclass.constructor.call(this, k_id, k_config);
this.k_addReferences({
k_dialogs: k_config.k_dialogs && this._k_prepareDialogSettings(k_config.k_dialogs)
});
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_BasicToolbar', kerio.lib.K_Toolbar,
{




_k_isClassInitialized: false,

_k_initClass: function() {
kerio.adm.k_widgets.K_BasicToolbar.prototype.k_predefinedButtonsCfg = {
K_BTN_ADD   : this._k_getBtnAdd,
K_BTN_EDIT  : this._k_getBtnEdit,
K_BTN_VIEW  : this._k_getBtnView,
K_BTN_REMOVE: this._k_getBtnRemove,
K_BTN_APPLY : this._k_getBtnApply,
K_BTN_RESET : this._k_getBtnReset
};
kerio.adm.k_widgets.K_BasicToolbar.prototype._k_isClassInitialized = true;
},

k_predefinedButtonsCfg: {},

k_buttonSet: {
K_APPLY_RESET : ['->', 'K_BTN_APPLY', 'K_BTN_RESET'],
K_GRID_DEFAULT: ['K_BTN_ADD', 'K_BTN_EDIT', 'K_BTN_REMOVE'],
K_GRID_FULL   : ['K_GRID_DEFAULT', 'K_APPLY_RESET']
},

k_objectNameSuffix: {
k_btnAdd: 'Add',
k_btnEdit: 'Edit',
k_btnView: 'View'
},

_k_getBtnAdd: function(k_config) {
return {
k_id: 'k_btnAdd',
k_caption: kerio.lib.k_tr('Add…', 'wlibButtons'),
k_onClick: k_config.k_onAdd || k_config.k_onClick || this._k_btnAddOnClick
};
},

_k_getBtnEdit: function(k_config) {
return {
k_id: 'k_btnEdit',
k_caption: kerio.lib.k_tr('Edit…', 'wlibButtons'),
k_isDisabled: true,
k_onClick: k_config.k_onEdit || k_config.k_onClick || this._k_btnEditOnClick
};
},

_k_getBtnView: function(k_config) {
return {
k_id: 'k_btnView',
k_caption: kerio.lib.k_tr('View…', 'wlibButtons'),
k_isDisabled: true,
k_onClick: k_config.k_onView || k_config.k_onClick || this._k_btnViewOnClick
};
},

_k_getBtnRemove: function(k_config) {
return {
k_id: 'k_btnRemove',
k_caption: kerio.lib.k_tr('Remove', 'wlibButtons'),
k_isDisabled: true,
k_onClick: k_config.k_onRemove || k_config.k_onClick || this._k_btnRemoveOnClick
};
},

_k_getBtnApply: function(k_config) {
return {
k_id: 'k_btnApply',
k_caption: kerio.lib.k_tr('Apply', 'wlibButtons'),
k_isInSharedMenu: false,
k_isDisabled: true,
k_onClick: k_config.k_onApply || k_config.k_onClick || this._k_btnApplyOnClick,
k_validateBeforeClick: kerio.lib.k_constants.k_DEFAULT_VALIDATION_STATUS
};
},

_k_getBtnReset: function(k_config) {
return {
k_id: 'k_btnReset',
k_caption: kerio.lib.k_tr('Reset', 'wlibButtons'),
k_isInSharedMenu: false,
k_isDisabled: true,
k_onClick: k_config.k_onReset || k_config.k_onClick || this._k_btnResetOnClick
};
},

_k_btnAddOnClick: function(k_toolbar, k_button) {
this.k_showDialog(k_toolbar, k_button);
},

_k_btnEditOnClick: function(k_toolbar, k_button) {
this.k_showDialog(k_toolbar, k_button);
},

_k_btnViewOnClick: function(k_toolbar, k_button) {
this.k_showDialog(k_toolbar, k_button);
},

_k_btnRemoveOnClick: function(k_toolbar, k_button) {
this.k_relatedWidget.k_removeSelectedRows();
},

_k_btnApplyOnClick: function(k_toolbar, k_button) {
},

_k_btnResetOnClick: function(k_toolbar, k_button) {
},

_k_parseItems: function (k_items) {
var
k_convertedItems = [],
k_type,
k_item,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_item = k_items[k_i];
if ('object' === typeof k_item) {
k_type = k_item.k_type;
}
else {
k_type = k_item;
}
if (this._k_isPredefinedButton(k_type) || this._k_isPredefinedButtonSet(k_type)) {
this._k_addPredefinedButton(k_convertedItems, k_item);
}
else {
k_convertedItems.push(k_item);
}
}
return k_convertedItems;
},

_k_isPredefinedButton: function(k_btnName) {
return Boolean(this.k_predefinedButtonsCfg[k_btnName]);
},

_k_isPredefinedButtonSet: function(k_btnName) {
return Boolean(this.k_buttonSet[k_btnName]);
},

_k_addPredefinedButton: function(k_items, k_predefinedButton, k_properties) {
var
k_type,
k_buttonSet,
k_i, k_cnt;
if ('string' === typeof k_predefinedButton) {
k_type = k_predefinedButton;
k_properties = k_properties || {};
}
else {
k_type = k_predefinedButton.k_type;
k_properties = k_properties || Ext.apply({}, k_predefinedButton);
delete k_properties.k_type;
}
if (this._k_isPredefinedButtonSet(k_type)) {
k_buttonSet = this.k_buttonSet[k_type];
for (k_i = 0, k_cnt = k_buttonSet.length; k_i < k_cnt; k_i++) {
this._k_addPredefinedButton(k_items, k_buttonSet[k_i], k_properties);
}
}
else if (this._k_isPredefinedButton(k_type)) {
k_items.push(this.k_predefinedButtonsCfg[k_type].call(this, k_properties));
}
else {
k_items.push(k_predefinedButton);  }
},

_k_getBtnHandler: function(k_button) {
return k_button._k_action._k_storedConfig.k_onClick;
},

_k_prepareDialogSettings: function(k_config) {
var
k_sourceName = k_config.k_sourceName,
k_objectName = k_config.k_objectName || {},
k_propertyName;
for (k_propertyName in this.k_objectNameSuffix) {
if (!k_objectName[k_propertyName]) {
k_objectName[k_propertyName] = k_sourceName + this.k_objectNameSuffix[k_propertyName];
}
}
return {
k_sourcePath: k_config.k_sourcePath,
k_sourceName: k_sourceName,
k_objectName: k_objectName,
k_baseParams: {},
k_additionalParams: k_config.k_additionalParams,
k_onBeforeShow: k_config.k_onBeforeShow
};
},

_k_setDialogBaseParams: function(k_params, k_add) {
if (k_add) {
Ext.apply(this.k_dialogs.k_baseParams, k_params);
}
else {
this.k_dialogs.k_baseParams = k_params;
}
},

k_setDialogAdditionalParams: function(k_params) {
this.k_dialogs.k_additionalParams = k_params;
},

k_removeDialogAdditionalParams: function(k_params) {
var
k_i,
k_cnt;
k_params = ('string' === typeof k_params) ? [k_params] : k_params;
for (k_i = 0, k_cnt = k_params.length; k_i < k_cnt; k_i++) {
delete this.k_dialogs.k_additionalParams[k_params[k_i]];
}
},

k_showDialog: function(k_toolbar, k_button) {
var
k_relatedWidget = this.k_relatedWidget,
k_dialogs = this.k_dialogs,
k_params;
if (k_dialogs.k_onBeforeShow && false === k_dialogs.k_onBeforeShow.call(k_relatedWidget, k_toolbar, k_button)) {
return;
}
k_params = Ext.apply({}, k_dialogs.k_baseParams, k_dialogs.k_additionalParams || {});
k_params.k_relatedWidget = k_relatedWidget;
kerio.lib.k_ui.k_showDialog({
k_sourcePath: k_dialogs.k_sourcePath,
k_sourceName: k_dialogs.k_sourceName,
k_objectName: k_dialogs.k_objectName[k_button.k_name],
k_params: k_params
});
},

k_enableApplyReset: function(k_enable) {
this.k_enableItem('k_btnApply', k_enable);
this.k_enableItem('k_btnReset', k_enable);
},

k_isApplyResetDisabled: function() {
var
k_isApplyDisabled = this.k_isItemDisabled('k_btnApply'),
k_isResetDisabled = this.k_isItemDisabled('k_btnReset');
return k_isApplyDisabled === k_isResetDisabled ? k_isApplyDisabled : undefined;
}
});


kerio.adm.k_widgets.K_BasicList = function(k_id, k_config){
this.k_id = k_id;
k_config = kerio.lib.k_applyRestrictionToConfig(k_config);  delete k_config.k_restrictBy; delete k_config.k_dblClickMapToButton;
if (k_config.k_toolbars) {
this._k_prepareToolbars(k_id, k_config);
}
else {
k_config.k_toolbars = {};
}
if (!k_config.k_toolbars.k_top && k_config.k_filters) {
k_config.k_toolbars.k_top = this._k_createFilters(k_config.k_filters);
if (k_config.k_remoteData && k_config.k_remoteData.k_jsonRpc.params) {
this.k_filters.k_fields = k_config.k_remoteData.k_jsonRpc.params.query && k_config.k_remoteData.k_jsonRpc.params.query.fields;
}
}
kerio.adm.k_widgets.K_BasicList.superclass.constructor.call(this, k_id, k_config);
}; kerio.lib.k_extend('kerio.adm.k_widgets.K_BasicList', kerio.lib.K_Grid,
{




k_setReadOnly: function (k_readOnly) {
var
k_toolbars = this.k_toolbars,
k_toolbarType,
k_toolbar;
kerio.adm.k_widgets.K_BasicList.superclass.k_setReadOnly.call(this, k_readOnly);
for (k_toolbarType in k_toolbars) {
k_toolbar = k_toolbars[k_toolbarType];
if ('function' === Ext.type(k_toolbar)) {
continue;
}
if (k_toolbar.k_isInstanceOf('kerio.adm.k_widgets.K_BasicToolbar')) {
if (k_toolbar.k_getItem('k_btnView') && false !== k_readOnly) {
k_toolbar.k_setReadOnly(false);
k_toolbar.k_setReadOnlyAll(true);
k_toolbar.k_setReadOnlyItem('k_btnView', false);
}
}
else if (k_toolbar.k_isInstanceOf('kerio.adm.k_widgets.K_SearchToolbar')) {
k_toolbar.k_setReadOnly(false);
}
}
},

_k_prepareToolbars: function(k_id, k_config) {
var
k_tbNameList = ['k_top', 'k_right', 'k_bottom'],
k_tbIdList = ['k_topToolbar', 'k_rightToolbar', 'k_bottomToolbar'],
k_kerioWidgets = kerio.adm.k_widgets,
k_toolbars = k_config.k_toolbars,
k_commonCfg = {
k_isReadOnly: k_config.k_isReadOnly,
k_update: this._k_gridListener
},
k_eventTypes = kerio.lib.k_constants.k_EVENT.k_TYPES,
k_observedEvents = [k_eventTypes.k_SELECTION_CHANGED],
k_toolbarCfg = {},
k_customUpdate,
k_tbName,
k_tbWidget,
k_i, k_cnt;
if (!k_config.k_isReadOnly) {	k_observedEvents.push(k_eventTypes.k_KEY_PRESSED);
}
for (k_i = 0, k_cnt = k_tbNameList.length; k_i < k_cnt; k_i++) {
k_tbName = k_tbNameList[k_i];
k_toolbarCfg = kerio.lib._k_cloneObject(k_toolbars[k_tbName]);
if (k_toolbarCfg) {
k_customUpdate = k_toolbarCfg.k_update;
if ('k_right' === k_tbName) {
k_toolbarCfg.k_showVertically = true;
}
Ext.apply(k_toolbarCfg, k_toolbars[k_tbName], k_commonCfg);
if (k_toolbarCfg.k_dialogs && !k_toolbarCfg.k_dialogs.k_onBeforeShow) {
k_toolbarCfg.k_dialogs.k_onBeforeShow = this._k_onBeforeShowDialog;
}
if (k_customUpdate) {
k_toolbarCfg.k_update = this._k_gridListener.createSequence(k_customUpdate);
}
k_tbWidget = new k_kerioWidgets.K_BasicToolbar(k_id + '_' + k_tbIdList[k_i], k_toolbarCfg);
kerio.lib.k_registerObserver(this, k_tbWidget, k_observedEvents);
k_toolbars[k_tbName] = k_tbWidget;
this._k_setConfigProperties(k_config, k_tbWidget);
}
k_commonCfg.k_hasSharedMenu = true;
}
},

_k_setConfigProperties: function (k_config, k_toolbar) {
var k_button;
if (!k_config.k_contextMenu) {
k_config.k_contextMenu = k_toolbar.k_sharedMenu;
}
if (!k_config.k_onDblClick) {
k_button = k_toolbar.k_getItem('k_btnEdit') || k_toolbar.k_getItem('k_btnView');
if (k_button) {
this._k_gridDblClickHandler = {
k_fn: k_toolbar._k_getBtnHandler(k_button),
k_toolbar: k_toolbar,
k_button: k_button
};
k_config.k_onDblClick = this._k_onGridDblClick;
}
}
},

_k_createFilters: function(k_config) {
var
k_sharedConstants = kerio.lib.k_getSharedConstants(),
k_filters = {
k_combining: undefined === k_config.k_combining ? k_sharedConstants.kerio_web_And : k_config.k_combining,
k_onBeforeFilterChange: k_config.k_onBeforeFilterChange,
k_sharedConstants: k_sharedConstants,
k_relatedWidget: this
},
k_items = [];
this.k_filters = k_filters;
if (k_config.k_combobox) {
k_filters.k_combobox = this._k_createComboBox(k_config.k_combobox);
k_items.push(k_filters.k_combobox);
}
if (k_config.k_checkbox) {
k_filters.k_checkbox = this._k_createCheckBox(k_config.k_checkbox);
k_items.push(k_filters.k_checkbox);
}
if (k_config.k_search) {
k_items.push('->');
k_filters.k_search = this._k_createSearchField(k_config.k_search);
k_items.push(k_filters.k_search);
}
else if (true === k_config.k_hasRightAlign) {
k_items.push('->');
}
return new kerio.lib.K_Toolbar(this.k_id + '_' + 'k_filters', {k_items: k_items});
},

_k_createComboBox: function(k_config) {
var
k_configComboBox = {},
k_combobox,
k_dataStore;
Ext.apply(k_configComboBox, k_config, {
k_id: 'k_filterCombobox',
k_width: 170,
k_useColumnsNames: true
});
k_configComboBox.k_onChange = this._k_onComboBoxChange;
k_combobox = new kerio.lib.K_Select(this.k_id + '_' + 'k_filters' + '_' + k_configComboBox.k_id, k_configComboBox);
k_combobox.k_addReferences({
k_onChange: k_config.k_onChange,
k_gridRequestParamName: k_config.k_gridRequestParamName
});
if (k_config.k_maskOnLoad) {
k_dataStore = k_combobox._k_dataStore.k_extWidget;
k_dataStore.on('beforeload'   , this._k_comboBoxMask, this);
k_dataStore.on('load'         , this._k_comboBoxUnmask, this);
k_dataStore.on('loadexception', this._k_comboBoxUnmask, this);
}
return k_combobox;
},

_k_comboBoxMask: function() {
this._k_showLoadingMask(true);
},

_k_comboBoxUnmask: function() {
this._k_showLoadingMask(false);
},

_k_onComboBoxChange: function(k_toolbar, k_select, k_value) {
if (this.k_onChange) {	this.k_onChange.call(this, k_toolbar, k_select, k_value);
}
if (k_toolbar.k_relatedWidget.k_filters.k_search) {
k_toolbar.k_relatedWidget.k_filters.k_search.k_setValue('');
}
k_toolbar.k_relatedWidget._k_onFilterChange();
},

_k_createCheckBox: function(k_config) {
var
k_checkboxConfig = {},
k_checkbox;
Ext.apply(k_checkboxConfig, k_config, {
k_id: 'k_filterCheckbox'
});
k_checkboxConfig.k_onChange = this._k_onCheckboxChange;
k_checkbox = new kerio.lib.K_Checkbox(this.k_id + '_' + 'k_filters' + '_' + k_checkboxConfig.k_id, k_checkboxConfig);
k_checkbox.k_parent = this;  k_checkbox.k_addReferences({
k_onChange: k_config.k_onChange,
k_conditions: k_config.k_conditions
});
return k_checkbox;
},

_k_onCheckboxChange: function(k_toolbar, k_checkbox, k_isChecked) {
if (this.k_onChange) {	this.k_onChange.call(this, k_toolbar, k_checkbox, k_isChecked);
}
k_toolbar.k_relatedWidget._k_onFilterChange();
},

_k_createSearchField: function(k_config) {
var
k_configTextField = {
k_caption: k_config.k_caption,
k_id: 'k_filterSearch',
k_value: '',
k_width: 200,
k_maxLength: 128,
k_isSearchField: false !== k_config.k_isSearchField,
k_onKeyDown: this._k_onSearchFieldKeyDown
},
k_searchField = new kerio.lib.K_TextField(this.k_id + '_' + 'k_filters' + '_' + k_configTextField.k_id, k_configTextField);
k_searchField.k_addReferences({k_searchBy: k_config.k_searchBy});
return k_searchField;
},

_k_onSearchFieldKeyDown: function(k_toolbar, k_textField, k_extEvent) {
if (k_extEvent.ENTER === k_extEvent.keyCode) {
k_extEvent.stopEvent();
k_toolbar.k_relatedWidget._k_onFilterChange();
}
},

_k_onFilterChange: function() {
var
k_currentFilter = this._k_createQuery(),
k_continue;
if (this.k_filters.k_onBeforeFilterChange) {
k_continue = this.k_filters.k_onBeforeFilterChange.call(this.k_filters, this.k_filters, k_currentFilter);
if (false === k_continue) {
return;
}
}
if (this._k_isLocalData) {
this._k_localFilter = k_currentFilter;
this.k_filterRowsBy(this._k_filterLocalData, this);
}
else {
this.k_reloadData(k_currentFilter);
}
},

_k_createQuery: function() {
var
k_filters = this.k_filters,
k_combobox = k_filters.k_combobox,
k_checkbox = k_filters.k_checkbox,
k_search = k_filters.k_search,
k_queryValue = {
'query': {}
},
k_conditions = [],
k_query = k_queryValue.query,
k_searchBy,
k_searchValue,
k_i, k_cnt;
if (k_filters.k_fields) {
k_query.fields = k_filters.k_fields;
}
if (k_combobox && k_combobox.k_gridRequestParamName) {
k_queryValue[k_combobox.k_gridRequestParamName] = k_combobox.k_getValue();
}
k_searchValue = k_search && k_search.k_searchBy ? k_search.k_getValue() : '';
if ('' !== k_searchValue) {
k_searchBy = k_search.k_searchBy;
k_searchBy = 'string' === typeof k_searchBy ? [k_searchBy] : k_searchBy;
k_queryValue.start = 0;
for (k_i = 0, k_cnt = k_searchBy.length; k_i < k_cnt; k_i++) {
k_conditions.push({
'fieldName': k_searchBy[k_i],
'comparator': k_filters.k_sharedConstants.kerio_web_Like,
'value': k_searchValue
});
}
}
if (k_checkbox && k_checkbox.k_getValue()) {
k_conditions = k_conditions.concat(this._k_getCheckboxCondition());
}
if (k_conditions.length > 0) {
k_query.combining = k_filters.k_combining;
k_query.conditions = k_conditions;
}
return k_queryValue;
}, 
_k_getCheckboxCondition: function() {
if (!this.k_filters.k_checkbox) {
return [];
}
var
k_sharedConstants = this.k_filters.k_sharedConstants,
k_conditionDef = this.k_filters.k_checkbox.k_conditions || {},
k_condition = [],
k_item,
k_i, k_cnt;
if (!(k_conditionDef instanceof Array)) {
k_conditionDef = [k_conditionDef];
}
for (k_i = 0, k_cnt = k_conditionDef.length; k_i < k_cnt; k_i++) {
k_item = k_conditionDef[k_i];
k_condition.push({
'fieldName': k_item.k_firstOperand || 'isEnabled',
'comparator': k_item.k_comparator || k_sharedConstants.kerio_web_Eq,
'value': k_item.k_secondOperand || true
});
}
return k_condition;
},

k_setCheckboxConditions: function(k_conditions) {
this.k_filters.k_checkbox.k_conditions = k_conditions;
},

_k_filterLocalData: function(k_rowData, k_id) {
var
k_query = this._k_localFilter.query,
k_conditionList = k_query.conditions,
k_matchCount = 0,
k_condition,
k_fieldValue,
k_value,
k_i, k_cnt;
if (!k_conditionList) {
return true;
}
for (k_i = 0, k_cnt = k_conditionList.length; k_i < k_cnt; k_i++) {
k_condition = k_conditionList[k_i];
k_value = k_condition.value;
k_fieldValue = k_rowData[k_condition.fieldName];
switch (k_condition.comparator) {
case 'Eq'         : k_matchCount += (k_fieldValue == k_value) ? 1 : 0; break;
case 'NotEq'      : k_matchCount += (k_fieldValue != k_value) ? 1 : 0; break;
case 'LessThan'   : k_matchCount += (k_fieldValue <  k_value) ? 1 : 0; break;
case 'GreaterThan': k_matchCount += (k_fieldValue >  k_value) ? 1 : 0; break;
case 'LessEq'     : k_matchCount += (k_fieldValue <= k_value) ? 1 : 0; break;
case 'GreaterEq'  : k_matchCount += (k_fieldValue >= k_value) ? 1 : 0; break;
case 'Like'       :
k_fieldValue = String(k_fieldValue).toUpperCase();
k_value = k_value.toUpperCase();
k_matchCount += ('' === k_value || -1 !== k_fieldValue.indexOf(k_value)) ? 1 : 0;
break;
}
if (k_matchCount && ('Or' === k_query.combining || k_matchCount === k_cnt)) {
return true;
}
}
return false;
},

_k_gridListener: function(k_sender, k_event) {
var
k_constants = kerio.lib.k_constants.k_EVENT,
k_constKeyCodes = k_constants.k_KEY_CODES,
k_constEventTypes = k_constants.k_TYPES,
k_currentKeyCode,
k_selectedRowsCount,
k_selectedOne,
k_selectedMany,
k_button;
switch (k_event.k_type) {
case k_constEventTypes.k_SELECTION_CHANGED:
k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount;
k_selectedOne = k_selectedRowsCount === 1;
k_selectedMany = k_selectedRowsCount > 0;
this.k_enableItem(['k_btnEdit', 'k_btnView'], k_selectedOne);
this.k_enableItem('k_btnRemove', k_selectedMany);
break;
case k_constEventTypes.k_KEY_PRESSED:
k_currentKeyCode = k_event.k_browserEvent.keyCode;
if (k_constKeyCodes.k_BACKSPACE === k_currentKeyCode || k_constKeyCodes.k_DELETE === k_currentKeyCode) {
k_button = this.k_getItem('k_btnRemove');
if (k_button && !k_button.k_isDisabled() && !k_button.k_isReadOnly()) {
k_button._k_action._k_storedConfig.k_onClick.call(this, this, k_button);
}
}
break;
}
},

_k_onBeforeShowDialog: function(k_toolbar, k_button) {
var
k_baseParams = {},
k_selectionStatus,
k_row;
if ('k_btnAdd' !== k_button.k_name) {
k_selectionStatus = this.k_selectionStatus;
if (0 === k_selectionStatus.k_rows.length) {
return false;  }
k_row = k_selectionStatus.k_rows[0];
k_baseParams = {
k_selectionStatus: k_selectionStatus,
k_data: k_row.k_data,
k_rowIndex: k_row.k_rowIndex
};
}
k_toolbar._k_setDialogBaseParams(k_baseParams);
return true;
},

_k_gridDblClickHandler: null,

_k_onGridDblClick: function() {
var k_gridDblClickHandler = this._k_gridDblClickHandler;
if (!k_gridDblClickHandler.k_button.k_isDisabled()) {
k_gridDblClickHandler.k_fn.call(k_gridDblClickHandler.k_toolbar, k_gridDblClickHandler.k_toolbar, k_gridDblClickHandler.k_button);
}
}
}); 

kerio.adm.k_widgets.K_BasicListDomain = function(k_id, k_config) {
if (!k_config.k_filters) {
k_config.k_filters = {};
}
k_config.k_filters.k_combobox = kerio.lib._k_applyDefaults(k_config.k_filters.k_combobox, this._k_domainComboDefaults);
k_config.k_filters.k_combobox.k_maskOnLoad = false;  kerio.adm.k_widgets.K_BasicListDomain.superclass.constructor.call(this, k_id, k_config);
this._k_dataStore.k_extWidget.on('beforeload', this._k_setLoadingActive, this);
this._k_dataStore.k_extWidget.on('load',       this._k_setLoadingDone,   this);
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_BasicListDomain', kerio.adm.k_widgets.K_BasicList, {



_k_domainComboDefaults: {
k_fieldDisplay: 'name',
k_fieldValue: 'id',
k_value: '',
k_checkPreselectedValue: false,
k_gridRequestParamName: 'domainId'
},

_k_onComboBoxChange: function(k_toolbar, k_select, k_value) {
k_select._k_dataStore.k_setCurrentKey(k_value);
kerio.adm.k_widgets.K_BasicListDomain.superclass._k_onComboBoxChange.call(this, k_toolbar, k_select, k_value);
},

k_syncData: function() {
var
k_domainDataStore = this.k_filters.k_combobox._k_dataStore;
k_domainDataStore.k_setMaskedWidget(this);
if (k_domainDataStore.k_isLoaded()) {
this._k_setCurrentDomain();
}
else {
k_domainDataStore.k_init(this._k_setCurrentDomain, this);
}
},

k_getCurrentDomainData: function() {
return this.k_filters.k_combobox._k_dataStore.k_getCurrentRecord();
},

_k_setCurrentDomain: function() {
var
k_combobox = this.k_filters.k_combobox,
k_selectedDomain = k_combobox._k_dataStore.k_getCurrentKey();
if (k_selectedDomain !== k_combobox.k_getValue()) {
this.k_clearData();
k_combobox.k_setValue(k_selectedDomain);
}
else if (this._k_isGridLoading) {
this.k_reloadData();
}
},

_k_onBeforeShowDialog: function(k_toolbar, k_button) {
var k_combobox = this.k_filters.k_combobox;
kerio.adm.k_widgets.K_BasicListDomain.superclass._k_onBeforeShowDialog.call(this, k_toolbar, k_button);
k_toolbar._k_setDialogBaseParams({
k_domain: {
k_id  : k_combobox.k_getValue(),
k_name: k_combobox.k_getText()
}
}, true);
},

_k_setLoadingActive: function() {
this._k_isGridLoading = true;
},

_k_setLoadingDone: function() {
this._k_isGridLoading = false;
}
});


kerio.adm.k_widgets.K_LogViewer = function(k_id, k_config) {
var
k_remoteData = k_config.k_remoteData,
k_searchField,
k_taskRunnerCfg,
k_topToolbar,
k_statusbar;
kerio.adm._k_logList.push(this);  k_topToolbar = this._k_createTopToolbar(k_id);
k_statusbar = this._k_createStatusbar(k_id);
k_config.k_onScrollFetch = this._k_onScrollFetchHandler;
k_config.k_onScroll = this._k_onScrollHandler;
k_config.k_isMultiSelect = false;
k_config.k_toolbars = Ext.apply(k_config.k_toolbars || {}, {k_top: k_topToolbar});
k_config.k_statusbar = k_statusbar;
k_config.k_rowRenderer = this._k_encodeRow;
k_config.k_onSelectionChange = this._k_onSelectionChange;
k_config.k_onSelectionRenewed = this._k_onSelectionRenewed;
k_config.k_onBeforeSelect = this._k_onBeforeSelect;
k_remoteData.k_isBuffered = true;
k_remoteData.k_bufferSize = 800;
k_remoteData.k_onError = this._k_onError;
kerio.adm.k_widgets.K_LogViewer.superclass.constructor.call(this, k_id, k_config);
this._k_autoUpdateRequestCfg = {
k_url: k_remoteData.k_url,
k_root: k_remoteData.k_root,
k_params: {},
k_callback: this._k_autoUpdateCallback,
k_scope: this,
k_onError: this._k_onRequestErrorHandler
};
k_taskRunnerCfg = {
k_precision: 200,
k_taskList: [{
k_id: 'k_autoUpdateTask',
k_run: this.k_autoUpdate,
k_scope: this,
k_interval: this.k_autoUpdateTimeout
}]
};
k_searchField = k_topToolbar.k_getItem('k_searchField');
this.k_addReferences({
k_isAutoUpdate: false,
_k_taskRunner: new kerio.lib.K_TaskRunner(k_taskRunnerCfg),
k_searchField: k_searchField
});
if (kerio.lib.k_isMSIE) {
k_searchField.k_extWidget.on('render', function(){
var k_el = this.k_searchField.k_extWidget.getEl();
k_el.on('focus', this._k_setSearchFieldCursorPos, k_el);
}, this);
}
this._k_searchStatus = new kerio.lib._K_LogSearchStatus(this);
k_topToolbar.k_addReferences({
k_logView: this
});
this._k_initSearchRequests();
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_LogViewer', kerio.lib.K_RowView,
{

_k_urlRe: new RegExp('(&quot;)?(\')?(https?:\\/\\/\\S+)\\2\\1', 'g'),
k_isAutoLoaded: false,
k_autoUpdateTimeout: 2000,  
k_autoUpdate: function() {
var
k_lib = kerio.lib,
k_dataStore = this._k_dataStore,
k_lastRequest = k_dataStore.k_getLastRequestParams(),
k_requestCfg = this._k_autoUpdateRequestCfg,
k_startParamName = this._k_settings.k_startParamName,
k_limitParamName = this._k_settings.k_limitParamName,
k_params;
if (this._k_autoUpdateReqId && this._k_autoUpdateReqId.conn) {  return;
}
k_requestCfg.k_jsonRpc = k_lib._k_cloneObject(k_lastRequest);
k_params = {logName: k_lastRequest.logName};
k_params[k_startParamName] = -1;
k_params[k_limitParamName] = k_lastRequest[k_limitParamName] + k_dataStore.k_extWidget._kx.k_bufferSize;
k_requestCfg.k_jsonRpc.params = k_params;
k_requestCfg.k_callbackParams = {
k_start: -1,
k_limit: this.k_getStatus().k_scrollerStatus.k_linesPerPage };
k_dataStore.k_setLastRequestParams(k_requestCfg.k_jsonRpc);
this._k_autoUpdateReqId = k_lib.k_ajax.k_request(k_requestCfg);
},

_k_autoUpdateCallback: function(k_response, k_success, k_callbackParams) {
var
k_lastTotalRows = this.k_getStatus().k_totalRows,
k_statusbar =  this.k_statusbar,
k_isStatusbarVisible = k_statusbar.k_isVisible(),
k_totalRows;
if (!k_success || !k_response.k_isOk) {
if (!k_isStatusbarVisible && !k_success) {
this.k_isLoaded = false;
this._k_showConnectionError = true;
k_statusbar.k_setVisible(true);
}
return;
}
if (k_isStatusbarVisible) {
k_statusbar.k_setVisible(false);
this.k_setTotalRows(0, 0);
this.k_load(-1);
return;
}
k_totalRows = k_response.k_decoded[this._k_settings.k_totalProperty];
if (k_totalRows === k_lastTotalRows) {
return;
}
if (k_totalRows < k_lastTotalRows) {
this.k_resetSelection();
}
this._k_setDataFromXHR(k_response, k_success, k_callbackParams);
},

_k_setDataFromXHR: function (k_response, k_success, k_callbackParams) {
var
k_o = this._k_dataStore._k_reader.read(k_response.k_xhrResponse),
k_lastParams = this._k_dataStore.k_getLastRequestParams(),
k_options;
if (k_lastParams.params) {
k_lastParams = k_lastParams.params;
}
else {
}
k_options = {
k_initBuffer: true,
k_origParams: kerio.lib._k_cloneObject(k_callbackParams),
params: kerio.lib._k_cloneObject(k_lastParams)
};
this.k_isLoaded = false;
this._k_dataStore.k_extWidget.loadRecords(k_o, k_options, k_success);
},

_k_onScrollFetchHandler: function(k_logViewer, k_status) {
if (k_status.k_isBottomPosition) {
this._k_startAutoUpdate();
}
else {
this._k_stopAutoUpdate();
}
},

_k_onScrollHandler: function(k_logViewer, k_status) {
this._k_stopAutoUpdate();
},

_k_startAutoUpdate: function () {
if (!this.k_isAutoUpdate) {
this._k_dataStore.k_abortDelayedRequest();
this._k_dataStore.k_abortCurrentRequest();
this._k_taskRunner.k_start('k_autoUpdateTask');
this.k_isAutoUpdate = true;
}
},

_k_stopAutoUpdate: function () {
if (this.k_statusbar.k_isVisible()) {
return;
}
this._k_taskRunner.k_stop('k_autoUpdateTask');
if (this._k_autoUpdateReqId) {
kerio.lib.k_ajax.k_abort(this._k_autoUpdateReqId);
this._k_autoUpdateReqId = null;
}
this.k_isAutoUpdate = false;
},

_k_suspendAutoUpdate: function() {
this._k_taskRunner.k_suspend('k_autoUpdateTask');
if (this.k_searchField.k_isInProgress()) {
this._k_cancelSearch();
}
},

_k_resumeAutoUpdate: function() {
if (this._k_forceRefresh) {
this.k_getDataStore().k_reloadData(undefined, true);
}
this._k_fixSize();
this._k_forceRefresh = false;
this._k_taskRunner.k_resume('k_autoUpdateTask');
},

_k_createTopToolbar: function (k_id) {
var k_tr = kerio.lib.k_tr,
k_toolbarId = 'k_topToolbar',
k_searchFieldCfg,
k_searchField,
k_toolbar;
k_searchFieldCfg = {
k_id: 'k_searchField',
k_isSearchField: true,
k_isFocusedByTrigger: false,
k_className: 'logSearch',
k_restrictBy: true === kerio.lib.k_isIPadCompatible,
k_defaultTrigger: 'k_triggerFindNext',
k_triggers: [
{
k_restrictions: [true],
k_id: 'k_spacer1',
k_className: 'triggerSpacer',
k_onClick: Ext.emptyFn,
k_isHidden: true
},
{
k_id: 'k_triggerFindNext',
k_onClick: function (k_toolbar, k_searchField) {
if ('' === k_searchField.k_getValue()) {
return;
}
k_toolbar.k_logView._k_search(k_searchField, true);
},
k_className: 'findNext',
k_title: k_tr('Find Next', 'wlibLogs'),
k_isHidden: true
},
{
k_restrictions: [true],
k_id: 'k_spacer2',
k_className: 'triggerSpacer',
k_onClick: Ext.emptyFn,
k_isHidden: true
},
{
k_id: 'k_triggerFindPrev',
k_onClick: function (k_toolbar, k_searchField) {
k_toolbar.k_logView._k_search(k_searchField, false);
},
k_className: 'findPrev',
k_title: k_tr('Find Prev', 'wlibLogs'),
k_isHidden: true
},
{
k_id: 'k_triggerStopFind',
k_onClick: function (k_toolbar, k_triggerField) {
k_toolbar.k_logView._k_cancelSearch();
},
k_className: 'stopFind',
k_title: k_tr('Stop Search', 'wlibLogs'),
k_isHidden: true
}
],
k_onKeyPress: function (k_toolbar, k_searchField, k_extEvent) {
var k_key = k_extEvent.getKey();
if (k_extEvent.ENTER !== k_key && k_searchField.k_isInProgress()) {
k_extEvent.stopEvent();
k_toolbar.k_logView._k_cancelSearch();
}
else if (k_extEvent.ESC === k_key){
k_searchField.k_setValue('');
}
if (kerio.lib.k_isIPadCompatible && k_extEvent.ENTER === k_key) {
k_searchField.k_extWidget.el.blur(); }
},
k_onChange: function (k_toolbar, k_triggerField) {
var k_logViewer = k_toolbar.k_logView;
k_logViewer._k_onSearchChangeHandler.call(k_logViewer, k_logViewer, k_triggerField);
},
k_caption: k_tr('Find:', 'wlibLogs'),
k_value: '',
k_width: 200
};
k_searchField = new kerio.lib.K_MultiTriggerField(k_id + '_' + k_toolbarId + '_' + 'k_searchField', k_searchFieldCfg);
k_searchField.k_extWidget.on('render', this._k_createFindInProgressEl, this);
k_searchField._k_higlight = this._k_highlightSearchField;
k_toolbar = new kerio.lib.K_Toolbar(k_id + '_' + k_toolbarId, {
k_items: [
'->',
{k_content: k_searchField}
]
});
return k_toolbar;
},

_k_highlightSearchField: function () {
var
k_searchFieldEl = this.k_extWidget.getEl(),
k_highlightEls = this._k_highlightEls,
k_searchFieldSize,
k_container,
k_bgEl,
k_fadeEl;
if (!k_highlightEls) {
k_container = this.k_extWidget.wrap;
k_bgEl = k_container.createChild({tag: 'div', cls: 'searchFieldHighlightBg'}, k_searchFieldEl);
k_fadeEl = k_container.createChild({tag: 'div', cls: 'searchFieldHighlightFade'}, k_searchFieldEl);
k_highlightEls = {
k_bgEl: k_bgEl,
k_fadeEl: k_fadeEl
};
this._k_highlightEls = k_highlightEls;
k_searchFieldEl.setWidth = k_searchFieldEl.setWidth.createSequence(function (k_width) {
this._k_highlightEls.k_fadeEl.setWidth(k_width);
this._k_highlightEls.k_bgEl.setWidth(k_width);
}, this);
}
else {
k_fadeEl = k_highlightEls.k_fadeEl;
k_bgEl = k_highlightEls.k_bgEl;
}
k_searchFieldSize = k_searchFieldEl.getSize();
k_bgEl.setSize(k_searchFieldSize);
k_fadeEl.setSize(k_searchFieldSize);
k_fadeEl.stopFx();
k_searchFieldEl.addClass('highlight');
k_bgEl.setVisible(true);
k_fadeEl.setVisible(true);
k_fadeEl.fadeOut({
duration: 3,
block: true,
callback: function () {
this._k_highlightEls.k_bgEl.setVisible(false);
this.k_extWidget.getEl().removeClass('highlight');
},
scope: this
});
},

_k_createFindInProgressEl: function () {
var
k_extWidget = this.k_searchField.k_extWidget,
k_searchEl = k_extWidget.getEl(),
k_element;
k_element = k_extWidget.wrap.createChild({
tag: 'div',
style: 'display: none',
cls: 'findInProgress'
}, k_searchEl);
this._k_findInProgress = k_element;
},

_k_showStopFindTrigger: function (k_show) {
this.k_searchField.k_setVisibleTrigger('k_triggerStopFind', k_show);
this._k_findInProgress.setDisplayed(k_show);
},

_k_createStatusbar: function(k_id) {
return new kerio.lib.K_Statusbar(k_id + '_' + 'k_statusbar', {
k_isHidden: true,
k_configurations: {
k_connectionError: {
k_text: kerio.lib.k_tr('Connection to the server has been lost. The log data is not being updated any longer.', 'wlibLogs'),
k_iconCls: 'actionResultError'
}
},
k_defaultConfig: 'k_connectionError'
});
},

_k_getSearchProgress: function(k_callbackParams) {
var k_requestCfg = this._k_requestSearchProgressCfg;
k_requestCfg.k_jsonRpc.params = {
countLines: this.k_getPageSize(),
searchId: this._k_searchId
};
k_requestCfg.k_callbackParams = {
k_toLine: k_callbackParams.k_toLine
};
this._k_searchRequestId = kerio.lib.k_ajax.k_request(k_requestCfg);
},

_k_searchProgressCallback: function(k_responseDecoded, k_callbackParams) {
var
k_searchField = this.k_searchField,
k_sharedConstants = this.k_sharedConstants;
if (k_responseDecoded.status !== k_sharedConstants.kerio_web_Searching) {
this._k_showInternalMask(false);
}
this._k_searchRequestId = null;
switch (k_responseDecoded.status) {
case k_sharedConstants.kerio_web_Searching: k_searchField.k_setProgressValueInPerc(k_responseDecoded.percentage);
this._k_getSearchProgress(k_callbackParams);
break;
case k_sharedConstants.kerio_web_ResultNotFound:
this._k_onSearchResultNotFound();
break;
case k_sharedConstants.kerio_web_ResultFound:
this._k_onSearchResultFound(k_responseDecoded);
break;
default: }
if (this.k_getStatus().k_isBottomPosition) {
this._k_startAutoUpdate();
}
},

_k_onSearchResultFound: function (k_responseDecoded) {
var
k_searchStatus = this._k_searchStatus,
k_firstRow = k_responseDecoded.firstLine,
k_settings = this._k_settings,
k_pageSize = this.k_getPageSize(),
k_totalRows = k_responseDecoded[k_settings.k_totalProperty],
k_lastParams,
k_params,
k_start;
this._k_isValueFound = true;
k_searchStatus.k_update({
k_fromLine: k_firstRow,
k_fromChar: k_searchStatus.k_isForward ? 0 : -1
});
if (!this.k_isRowInView(k_firstRow)) {
if (k_firstRow > k_totalRows - k_responseDecoded.viewport.length) {
k_start = k_totalRows - k_responseDecoded.viewport.length;
}
else {
k_start = k_firstRow;
}
if (k_totalRows !== this.k_getStatus().k_totalRows) {
this.k_setTotalRows(k_totalRows, k_start);
}
this.k_scrollToRow(k_firstRow, true);
k_params = {};
k_params[k_settings.k_limitParamName] = k_pageSize;
k_params[k_settings.k_startParamName] = k_start;
k_params[k_settings.k_totalProperty] = k_responseDecoded[k_settings.k_totalProperty];
k_lastParams = this.k_getDataStore().k_getLastRequestParams();
k_lastParams = Ext.apply(k_lastParams, k_params);
delete k_lastParams[k_settings.k_totalProperty];
this.k_getDataStore().k_setLastRequestParams(k_lastParams);
this._k_dataStore.k_loadData(k_responseDecoded, {params: k_params});
this._k_onScroll.call(this, this, this.k_getStatus());
}
this._k_resetSearchField();
this._k_localSearch();
},

_k_onSearchResultNotFound: function () {
var
k_searchStatus = this._k_searchStatus,
k_wholeLogScanned;
this._k_resetSearchField();
if (k_searchStatus.k_isForward) {
k_wholeLogScanned = 0 === k_searchStatus.k_startFromLine && 0 === k_searchStatus.k_startFromChar && -1 == k_searchStatus.k_toLine;
}
else {
k_wholeLogScanned = -1 == k_searchStatus.k_startFromLine && 0 === k_searchStatus.k_toLine;
}
if (k_searchStatus.k_isCyclic || k_wholeLogScanned) {
this._k_showAlertNotFound();
}
else {
this._k_showConfirmSearchDialog();
}
},

_k_showAlertNotFound: function() {
var
k_searchStatus = this._k_searchStatus,
k_tr = kerio.lib.k_tr,
k_msg;
if (k_searchStatus.k_found) {
k_msg = k_tr('No more occurrences of "%1" were found.', 'wlibLogs', {k_args: [k_searchStatus.k_searchWhat]});
}
else {
this.k_searchField.k_addClassName('notFound');
k_msg = k_tr('No occurrences of "%1" were found.', 'wlibLogs', {k_args: [k_searchStatus.k_searchWhat]});
}
kerio.lib.k_alert({k_title: k_tr('Warning', 'wlibAlerts'), k_msg: k_msg});
k_searchStatus.k_reset();
},

_k_showConfirmSearchDialog: function () {
var
k_searchStatus = this._k_searchStatus,
k_tr = kerio.lib.k_tr,
k_msg;
if (k_searchStatus.k_isForward) {
k_msg = k_tr('Text %1 not found. <br>Would you like to search from the top?', 'wlibLogs', {k_args: [k_searchStatus.k_searchWhat]});
}
else {
k_msg = k_tr('Text %1 not found. <br>Would you like to search from the bottom?', 'wlibLogs', {k_args: [k_searchStatus.k_searchWhat]});
}
kerio.lib.k_confirm({
k_title: k_tr('Confirm Action', 'wlibAlerts'),
k_msg: k_msg,
k_callback: this._k_onConfirmSearchCallback,
k_scope: this,
k_defaultButton: 'Yes'
});
},

_k_onConfirmSearchCallback: function (k_response) {
if ('yes' === k_response) {
this._k_searchStatus.k_update({k_isCyclic: true});
this._k_search(this.k_searchField, this._k_searchStatus.k_isForward);
}
else {
this._k_searchStatus.k_reset();
}
},

_k_search: function(k_searchField, k_isForward) {
var
k_searchStatus = this._k_searchStatus,
k_searchWhat = k_searchField.k_getValue();
if (this._k_searchRequestId) {
this._k_cancelSearch();
}
k_searchStatus.k_init({
k_isForward: k_isForward,
k_searchWhat: k_searchWhat
});
if (!this._k_localSearch()) {
if (k_searchStatus.k_prepareForRemoteSearch()) {
this._k_remoteSearch();
}
else {
this._k_onSearchResultNotFound();
}
}
},

_k_localSearch: function() {
var
k_localStore = this._k_dataStore.k_extWidget._kx.k_buffer,
k_data = k_localStore.k_data,
k_searchStatus = this._k_searchStatus,
k_params = k_searchStatus.k_getParamsForLocalSearch(k_localStore),
k_searchWhat = k_params.k_searchWhat,
k_min = k_params.k_min,
k_max = k_params.k_max,
k_inc = k_params.k_inc,
k_index = k_params.k_index,
k_searchFn = k_params.k_searchFn,
k_fromPos = k_params.k_fromPos,
k_toPos = k_params.k_toPos,
k_haystack,
k_haystackPreOffset,
k_haystackPostOffset,
k_selection,
k_pos;
k_searchStatus.k_update({
k_fromChar: k_searchStatus.k_isForward ? 0 : -1
}); if (k_params.k_min < 0 || (-1 == k_searchStatus.k_fromLine && k_localStore.k_start + k_data.length < this.k_getStatus().k_totalRows)) {  return false;
}
while (k_min <= k_index && k_index <= k_max) {
k_haystackPreOffset = 0; k_haystackPostOffset = undefined; if (undefined !== k_toPos && k_searchStatus.k_isForward && k_index === k_max) {
k_haystackPreOffset = 0;
k_haystackPostOffset = k_toPos + k_searchWhat.length - 1;
}
else if (undefined !== k_toPos && !k_searchStatus.k_isForward && k_index === k_min) {
k_haystackPreOffset = k_toPos - k_searchWhat.length + 1;
k_haystackPostOffset = undefined;
if (undefined !== k_fromPos && k_haystackPreOffset > k_fromPos) {
return false;
}
}
k_haystack = k_data[k_index].data.content.toLowerCase();
k_haystack = k_haystack.substr(k_haystackPreOffset, k_haystackPostOffset);
k_pos = k_haystack[k_searchFn](k_searchWhat, k_fromPos - k_haystackPreOffset);
k_searchStatus.k_update({
k_fromLine: k_params.k_storeOffset + k_index
});
if (-1 !== k_pos) {
k_selection = this.k_getSelection();
if (
k_selection
&& k_selection.k_range
&& k_selection.k_range.k_className === kerio.lib._K_SelectionContainer.prototype._k_SELECTION_HIGHLIGHT
&& k_selection.k_firstRowNumber === k_index
&& k_selection.k_firstRowNumber === k_selection.k_lastRowNumber
&& k_selection.k_range.k_startPos === k_pos
&& k_selection.k_range.k_endPos === k_pos + k_searchWhat.length
) {
k_searchStatus.k_update({
k_found: true, k_fromLine: k_params.k_storeOffset + k_index,
k_fromChar: k_pos
});
return false;
}
}
if (-1 !== k_pos) {
k_pos += k_haystackPreOffset;
k_searchStatus.k_update({
k_execNextSearchAsNew: false,
k_found: true,
k_fromChar: k_pos
});
this._k_highlightTextInBuffer(k_searchStatus.k_fromLine, k_pos, k_pos + k_searchWhat.length);
if (!kerio.lib.k_isIPadCompatible) {
this.k_searchField.k_focus.defer(10, this.k_searchField);
}
return true;
}
k_index += k_inc;
k_fromPos = undefined;  }
return false;
},

_k_remoteSearch: function() {
var
k_requestCfg = this._k_requestStartSearchCfg,
k_searchStatus = this._k_searchStatus,
k_searchField = this.k_searchField;
k_requestCfg.k_jsonRpc.params = {
logName: this.k_id,
what: k_searchStatus.k_searchWhat,
fromLine: k_searchStatus.k_fromLine,
toLine: k_searchStatus.k_toLine,
forward: k_searchStatus.k_isForward
};
k_requestCfg.k_callbackParams = {
k_toLine: k_searchStatus.k_toLine
};
k_searchField.k_setVisibleTrigger(['k_triggerFindNext', 'k_triggerFindPrev'], false);
if (kerio.lib.k_isIPadCompatible) {
k_searchField.k_setVisibleTrigger(['k_spacer1', 'k_spacer2'], false);
}
k_searchField.k_removeClassName('notFound');
k_searchField.k_startProgress();
this._k_showStopFindTrigger(true);
this._k_stopAutoUpdate();
this._k_showInternalMask(true);
this._k_searchRequestId = kerio.lib.k_ajax.k_request(k_requestCfg);
},

_k_cancelSearch: function() {
var
k_requestCfg = this._k_requestCancelSearchCfg,
k_lib = kerio.lib;
k_lib.k_ajax.k_abort(this._k_searchRequestId);
this._k_searchRequestId = null;
if (undefined !== this._k_searchId) {
k_requestCfg.k_jsonRpc.params = {
searchId: this._k_searchId
};
k_lib.k_ajax.k_request(k_requestCfg);
}
this._k_resetSearchField(true);
this._k_showInternalMask(false);
},

_k_resetSearchField: function (k_resetSearchStatus) {
var k_searchField = this.k_searchField;
if (k_resetSearchStatus) {
this._k_searchStatus.k_reset();
}
k_searchField.k_removeClassName('notFound');
k_searchField.k_setVisibleTrigger(['k_triggerFindNext', 'k_triggerFindPrev'], '' !== k_searchField.k_getValue());
if (kerio.lib.k_isIPadCompatible) {
k_searchField.k_setVisibleTrigger(['k_spacer1', 'k_spacer2'], '' !== k_searchField.k_getValue());
}
k_searchField.k_stopProgress();
this._k_showStopFindTrigger(false);
},

_k_onSearchChangeHandler: function (k_logView, k_searchField) {
this._k_resetSearchField(true);
},

_k_initSearchRequests: function () {
var
k_requestStartSearchCfg,
k_requestSearchProgressCfg,
k_requestCancelSearchCfg;
k_requestStartSearchCfg = {
k_jsonRpc: {
'method': 'Logs.search'
},

k_callback: function(k_response, k_success, k_callbackParams) {
this._k_searchRequestId = null;
if (k_response.k_isOk && this._k_searchStatus.k_searchWhat) {
this._k_searchId = k_response.k_decoded.searchId;	this._k_getSearchProgress(k_callbackParams);	}
else {
this._k_showInternalMask(false);
this._k_resetSearchField(true);
}
},
k_scope: this
};
k_requestSearchProgressCfg = {
k_jsonRpc: {
'method': 'Logs.getSearchProgress'
},

k_callback: function(k_response, k_success, k_callbackParams) {
if (k_response.k_isOk) {
this._k_searchProgressCallback(k_response.k_decoded, k_callbackParams);
}
else {
this._k_showInternalMask(false);
this._k_resetSearchField(true);
}
},
k_scope: this
};
k_requestCancelSearchCfg = {
k_jsonRpc: {
'method': 'Logs.cancelSearch'
},

k_callback: function(k_response) {
this._k_showInternalMask(false);
},
k_scope: this
};
this.k_addReferences({
_k_requestStartSearchCfg: k_requestStartSearchCfg,
_k_requestSearchProgressCfg: k_requestSearchProgressCfg,
_k_requestCancelSearchCfg: k_requestCancelSearchCfg
});
},

_k_encodeRow: function (k_logViewer, k_data) {
var
k_format = Ext.util.Format,
k_lastReplacedEndIndex = 0,
k_matches,
k_value,
k_valueStart,
k_valueEnd,
k_link,
k_formatedData,
k_i, k_cnt;
k_formatedData = kerio.lib._k_cloneObject(k_data);
k_value = k_formatedData.content;
k_value = k_format.htmlEncode(k_value);
k_matches = k_value.match(this._k_urlRe);
if (null !== k_matches) {
for (k_i = 0, k_cnt = k_matches.length; k_i < k_cnt; k_i++) {
k_link = this._k_rawLink(k_matches[k_i]);
k_valueStart = k_value.substr(0, k_lastReplacedEndIndex);
k_valueEnd = k_value.substr(k_lastReplacedEndIndex);
k_valueEnd = k_valueEnd.replace(k_link, '<a target="_blank" href="' + k_link + '">' + k_link + '</a>');
k_value = k_valueStart + k_valueEnd;
k_lastReplacedEndIndex = k_value.indexOf('</a>', k_lastReplacedEndIndex) + 4;
}
}
k_formatedData.content = k_value;
return k_formatedData;
},

_k_rawLink: function (k_link) {
var
k_firstChar = k_link.charAt(0),
k_quoteEntity = '&quot;',
k_removeCnt = 1,
k_lastChar,
k_length;
if ('\'' === k_firstChar || '&' === k_firstChar) {
if ('&' === k_firstChar && k_quoteEntity === k_link.substr(0, 6)) {
k_firstChar = k_quoteEntity;
k_removeCnt = 6;
}
k_link = k_link.substr(k_removeCnt);
k_length = k_link.length;
k_lastChar = k_link.substr(k_length - k_removeCnt);
if (k_length > k_removeCnt && k_firstChar === k_lastChar) {
k_link = k_link.substr(0, k_length - k_removeCnt);
}
}
return k_link;
},

_k_onRequestErrorHandler: function (k_response) {
return k_response.k_decoded.error.code !== kerio.lib.k_ajax.k_EXPIRED_SESSION_ERROR_CODE;
},

_k_onBeforeSelect: function (k_logViewer) {
if (this.k_isAutoUpdate) {
this._k_stopAutoUpdate();
}
},

_k_onSelectionChange: function (k_logViewer, k_selection) {
if (this.k_getStatus().k_isBottomPosition) {
this._k_startAutoUpdate();
}
if (k_selection && kerio.lib._K_SelectionContainer.prototype._k_SELECTION_HIGHLIGHT !== k_selection.k_range.k_className) {
this._k_searchStatus.k_reset();
}
},

_k_onSelectionRenewed: function(k_logViewer, k_selection, k_isSelectionVisible) {
var k_execNextSearchAsNew;
if (kerio.lib._K_SelectionContainer.prototype._k_SELECTION_HIGHLIGHT === k_selection.k_range.k_className) {
k_execNextSearchAsNew = !k_isSelectionVisible;
this._k_searchStatus.k_update({k_execNextSearchAsNew: k_execNextSearchAsNew});
}
},

_k_setSearchFieldCursorPos: function () {
var
k_input = this.dom,
k_range = k_input.createTextRange();
k_range.move('character', k_input.value.length);
k_range.select();
},

_k_onError: function(k_response, k_success) {
var
k_errCode = k_response.k_decoded.error && k_response.k_decoded.error.code,
k_suppressInternalErrorHandler = false;
if (1002 === k_errCode) {  this.k_setTotalRows(0, 0);
this._k_startAutoUpdate();
k_suppressInternalErrorHandler = true;
}
else if (-32002 === k_errCode && this.k_statusbar.k_isVisible()) {  k_suppressInternalErrorHandler = !this._k_showConnectionError;
this._k_showConnectionError = false;
}
return k_suppressInternalErrorHandler;
}
});


kerio.lib._K_LogSearchStatus = function(k_owner) {
this.k_owner = k_owner;
};
kerio.lib._K_LogSearchStatus.prototype = {

k_reset: function() {
Ext.apply(this, {
k_isForward: true,                 k_isCyclic: false,                 k_isCyclicChangedForLocal: false,  k_firstCyclicRemoteSearch: false,  k_execNextSearchAsNew: false,      k_found: false,                    k_searchWhat: undefined,           k_startFromLine: undefined,        k_startFromChar: undefined,        k_fromLine: undefined,             k_fromChar: undefined,             k_toLine: undefined,               k_toChar: undefined                });
},

k_init: function(k_statusFragment) {
var k_isNewSearch = this.k_searchWhat !== k_statusFragment.k_searchWhat
|| this.k_isForward !== k_statusFragment.k_isForward
|| this.k_execNextSearchAsNew;
if (k_isNewSearch) {
this.k_reset();
k_statusFragment.k_toLine = k_statusFragment.k_isForward ? -1 : 0;
}
this.k_update(k_statusFragment);
this._k_setStartPos(k_statusFragment.k_isForward);
if (this.k_isCyclicChangedForLocal) {
this.k_update({
k_isCyclicChangedForLocal: false,
k_toLine: this.k_startFromLine,
k_toChar: this.k_startFromChar,
k_fromLine: this.k_isForward ? 0 : -1,
k_fromChar: this.k_isForward ? 0 : -1
});
}
},

k_update: function(k_statusFragment) {
if (true === k_statusFragment.k_isCyclic) {
k_statusFragment.k_isCyclicChangedForLocal = true;
k_statusFragment.k_firstCyclicRemoteSearch = true;
}
if (true === k_statusFragment.k_found) {
k_statusFragment.k_firstCyclicRemoteSearch = false;
}
Ext.apply(this, k_statusFragment);
},

_k_setStartPos: function (k_isForward) {
var
k_status = this.k_owner.k_getStatus(),
k_scrollerStatus = k_status.k_scrollerStatus,
k_start = k_status.k_start,
k_startLine = -1,
k_fromChar = k_isForward ? 0 : -1,
k_selection,
k_rowsPerPage;
if (this.k_owner.k_isSelection()) {
k_selection = this.k_owner.k_getSelection();
k_startLine = k_selection.k_firstRowNumber;
k_fromChar = k_isForward ? k_selection.k_range.k_endPos : k_selection.k_range.k_startPos;
}
if (-1 === k_startLine || !this.k_owner.k_isRowInView(k_startLine, true)) {
k_rowsPerPage = k_scrollerStatus.k_linesPerPage;
if (k_isForward) {
k_startLine = -1 == k_start ? k_status.k_totalRows - k_rowsPerPage : k_start;
if (k_startLine < 0) {
k_startLine = 0;
}
}
else {
if (-1 == k_start) {
k_startLine = -1;
}
else {
if (k_start + k_rowsPerPage === k_status.k_totalRows) {
k_startLine = -1;
}
else {
k_startLine = k_start + k_rowsPerPage - 1;
}
}
}
if (0 !== k_scrollerStatus.k_displayOffset && k_status.k_totalRows >= k_rowsPerPage) {
if (k_isForward && 1 === k_scrollerStatus.k_displayOffsetDirection) {
k_startLine += 1;
}
if (!k_isForward && -1 === k_scrollerStatus.k_displayOffsetDirection) {
k_startLine += 1;
}
}
this.k_startFromLine = k_startLine;
this.k_startFromChar = k_fromChar;
}
if (undefined === this.k_startFromLine) {
this.k_startFromLine = k_startLine;
this.k_startFromChar = k_fromChar;
}
this.k_fromLine = k_startLine;
this.k_fromChar = k_fromChar;
},

k_getParamsForLocalSearch: function(k_localStore) {
var
k_lastDataIndex = k_localStore.k_data.length - 1,
k_storeOffset = k_localStore.k_start,
k_searchWhat,
k_params,
k_index,
k_fromPos;
k_searchWhat =  this.k_searchWhat.toLowerCase();
if (this.k_isForward) {
k_index = this.k_fromLine - k_storeOffset;
k_params = {
k_min: k_index,
k_max: -1 === this.k_toLine ? k_lastDataIndex : Math.min(this.k_toLine - k_storeOffset, k_lastDataIndex),
k_inc: 1,
k_index: k_index,
k_searchFn: 'indexOf',
k_fromPos: this.k_fromChar,
k_toPos: this.k_toChar
};
}
else {
k_index = -1 === this.k_fromLine ? k_lastDataIndex : Math.min(this.k_fromLine - k_storeOffset, k_lastDataIndex);
k_fromPos = -1 === this.k_fromChar ? undefined : (this.k_fromChar - k_searchWhat.length);
if (k_fromPos < 0) {
k_index--;
k_fromPos = undefined;  }
k_params = {
k_min: 0 === this.k_toLine ? 0 : Math.max(this.k_toLine - k_storeOffset, 0),
k_max: k_index,
k_inc: -1,
k_index: k_index,
k_searchFn: 'lastIndexOf',
k_fromPos: k_fromPos,
k_toPos: this.k_toChar
};
}
k_params.k_searchWhat = k_searchWhat;
k_params.k_storeOffset = k_localStore.k_start;
return k_params;
},

k_prepareForRemoteSearch: function() {
var
k_bufferedStore = this.k_owner._k_dataStore.k_extWidget._kx.k_buffer,
k_remoteSearchMakeSense = true,
k_fromLine;
if (this.k_firstCyclicRemoteSearch) {
this.k_firstCyclicRemoteSearch = false;
}
else {
if (this.k_isForward) {
k_fromLine = k_bufferedStore.k_start + k_bufferedStore.k_data.length;
}
else {
k_fromLine = Math.max(k_bufferedStore.k_start - 1, 0);
k_remoteSearchMakeSense = k_bufferedStore.k_start > 0;  }
if (k_remoteSearchMakeSense) {
this.k_update({k_fromLine: k_fromLine});
}
}
if (this.k_isCyclic) {
if (this.k_isForward) {
k_remoteSearchMakeSense = this.k_fromLine < this.k_toLine;
}
else {
k_remoteSearchMakeSense = -1 == this.k_fromLine || this.k_fromLine > this.k_toLine;
}
}
return k_remoteSearchMakeSense;
}
};


kerio.adm.k_widgets.logs = {



k_init: function(k_objectName, k_initParams) {
var
k_logView,
k_logViewCfg,
k_contextMenuCfg,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_fullAdmin = kerio.lib.k_getSharedConstants('kerio_web_FullAdmin'),
k_sharedConstants = kerio.lib.k_getSharedConstants(),
k_contextMenuItems,
k_items,
k_item,
k_index,
k_i, k_cnt;
this.k_publicName = k_objectName;
k_contextMenuItems = [
{
k_id: 'logCopy',
k_restrictions: {k_isIPadCompatible: [false]},
k_isDisabled: true,
k_caption: Ext.isMac ? k_tr('Copy (⌘C)', 'wlibLogs') : k_tr('Copy (Ctrl+C)', 'wlibLogs'),
k_onClick: function () {
var
k_lib = kerio.lib,
k_text;
if (k_lib.k_isMSIE) {
k_text = this.k_relatedWidget._k_doCopyToClipboard();
if (k_text) {
window.clipboardData.setData("Text", k_text);
}
}
else {
k_lib.k_alert({
k_msg: k_lib.k_tr('Press %1 to copy the selected text.', 'wlibLogs', {k_args: [Ext.isMac ? '⌘C' : 'Ctrl+C']}),
k_icon: 'warning'
});
}
return false;
}
},
{                         k_caption: '-'                              , k_restrictions: {k_isIPadCompatible: [false]}},
{k_id: 'logExport'      , k_caption: k_tr('Save Log…', 'wlibLogs')    , k_restrictions: {k_isIPadCompatible: [false]}},
{                         k_caption: '-'                              , k_restrictions: {k_isIPadCompatible: [false]}},
{k_id: 'logHighlighting', k_caption: k_tr('Highlighting…', 'wlibLogs')},
{k_id: 'logSettings'    , k_caption: k_tr('Log Settings…', 'wlibLogs')},
{k_id: 'logMessages'    , k_caption: k_tr('Messages…', 'wlibLogs')    },
{                         k_caption: '-'                              , k_restrictions: {k_role: [k_fullAdmin]}},
{k_id: 'clearLog'       , k_caption: k_tr('Clear Log', 'wlibLogs')    , k_restrictions: {k_role: [k_fullAdmin]}}
];
if ('debug' !== k_objectName) {
if ('logMessages' !== k_contextMenuItems[6].k_id) {
kerio.lib.k_reportError('Internal error: order of context menu items in logs has changed, update position for Messages', 'logs.js', 'k_init');
return;
}
k_contextMenuItems.splice(6,1);  }
if (k_initParams && k_initParams.k_contextMenu) {
k_items = k_initParams.k_contextMenu.k_items;
for (k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_item = k_items[k_i];
k_index = k_item.k_index;
delete k_item.k_index;
if (k_index >= 0 && k_index < k_contextMenuItems.length) {
k_contextMenuItems.splice(k_index, 0, k_item);
}
else {
k_contextMenuItems.push(k_item);
}
}
}
k_contextMenuCfg = {
k_restrictBy: {
k_role: kerio.adm.k_framework._k_userRole,
k_isIPadCompatible: true === kerio.lib.k_isIPadCompatible
},

k_onClick: function(k_menu, k_menuItem) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr;
if ('clearLog' !== k_menuItem.k_name) {
k_lib.k_ui.k_showDialog({
k_sourceName: k_menuItem.k_name,
k_params: {
k_logViewer: k_menu.k_relatedWidget,
k_logName: k_menu.k_relatedWidget.k_id
}
});
}
else {
k_lib.k_confirm(k_tr('Clear Log', 'wlibLogs'),
k_tr('The log data will be permanently deleted. Do you want to proceed?', 'wlibLogs'),

function (k_answer) {
if ('yes' !== k_answer) {
return;
}
this.k_relatedWidget.k_setTotalRows(0, 0);
var k_requestCfg = {
k_jsonRpc: {
'method': 'Logs.clear',
'params': {
logName: this.k_relatedWidget.k_id
}
},
k_scope: this.k_relatedWidget,

k_callback: function (k_response) {
this.k_resetSelection();
if (k_response.k_isOk) {
this.k_load(-1);
this._k_taskRunner.k_start('k_autoUpdateTask');
this.k_isAutoUpdate = true;
}
}
};
kerio.lib.k_ajax.k_request(k_requestCfg);
}, k_menu);
}
},
k_items: k_contextMenuItems
};
k_logViewCfg = {
k_isAutoLoaded: false,
k_maxRowLength: 1100, k_rowTemplate: '<div class="singleRow background{highlight}" id="' + k_objectName + '_row_{[xindex]}">'
+ '<pre class="rowContent" id="' + k_objectName + '_rowtxt_{[xindex]}">{content}</pre></div>',
k_record: [
{k_columnId: 'content'},
{k_columnId: 'highlight'}
],
k_remoteData: {
k_root: 'viewport',
k_totalProperty: 'totalItems',
k_startParamName: 'fromLine',
k_limitParamName: 'countLines',
k_isQueryValueSent: false,
k_jsonRpc: {
'method': 'Logs.get',
'params': {
'logName' : k_objectName
}
}
},
k_contextMenu: k_contextMenuCfg,
k_onClipboardIsTooLarge: function (k_logView, k_selection) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'logExport',
k_params: {
k_logViewer: k_logView,
k_logName: k_logView.k_id,
k_showCopyWarning: true
}
});
}
};
k_logView = new kerio.adm.k_widgets.K_LogViewer(k_objectName, k_logViewCfg);
k_logView.k_addReferences({
k_sharedConstants: k_sharedConstants
});
if (!kerio.lib.k_isIPadCompatible) {
k_logView.k_getContextMenu().k_extWidget.on('beforeshow', function () {
this.k_getContextMenu().k_items.logCopy.k_setDisabled(!this.k_isSelection());
}, k_logView);
}
k_logView.k_applyParams = function(k_params) {
if (this.k_isLoaded) {
this.k_fixScrollPosition();
}
else {
this.k_load(-1);  }
};
k_logView.k_onActivate = k_logView._k_resumeAutoUpdate;
k_logView.k_onDeactivate = k_logView._k_suspendAutoUpdate;
return k_logView;
} };


kerio.adm.k_widgets.logHighlighting = {

k_init: function(k_objectName) {
var
k_rightToolbarCfg,
k_rightToolbar,
k_eraseData,
k_bottomToolbarCfg,
k_bottomToolbar,
k_gridCfg,
k_grid,
k_dialogCfg,
k_dialog,
k_enableEditor,
k_descriptionEditor,
k_conditionEditor,
k_isRegExpEditor,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_publicName = k_objectName + '_',
k_gridWidgetName = 'k_grid';
k_bottomToolbarCfg = {
k_hasSharedMenu: true,
k_items: [
{
k_id: 'k_btnAdd',
k_caption: k_tr('Add', 'wlibButtons'),

k_onClick: function(k_toolbar) {
k_toolbar.k_grid.k_dialog._k_createNewHighlight();
}
},
{
k_id: 'k_btnRemove',
k_caption: k_tr('Remove', 'wlibButtons'),
k_isDisabled: true,

k_onClick: function(k_toolbar) {
var k_grid = k_toolbar.k_grid;
k_grid.k_stopCellEdit(true);
k_grid.k_removeSelectedRows();
k_grid.k_dialog._k_newRowIndex = null;
}
},
{
k_id: 'k_btnDuplicate',
k_caption: k_tr('Duplicate', 'wlibLogHighlighting'),
k_isDisabled: true,

k_onClick: function(k_toolbar) {
k_toolbar.k_grid.k_dialog._k_cancelRowEdit();
k_toolbar.k_grid.k_dialog._k_createNewHighlight(false);
}
},
{
k_id: 'k_btnColorPicker',
k_caption: k_tr('Change Color', 'wlibLogHighlighting'),
k_isColorPicker: true,
k_isDisabled: true,
k_onClick: function (k_toolbar) {
var
k_grid = k_toolbar.k_grid,
k_editInfo,
k_editor,
k_isValid,
k_data;
if (k_grid.k_isEditing()) {
k_editInfo = k_grid.k_getEditInfo();
k_editor = k_grid.k_getColumnEditor(k_editInfo.k_columnId);
k_isValid = k_editor.k_isValid();
if (!k_isValid) {
k_data = kerio.lib.k_cloneObject(k_editInfo.k_rowData);
k_data[k_editInfo.k_columnId] = k_editor.k_getValue();
k_grid.k_updateRow(k_data, k_editInfo.k_rowIndex);
k_grid.k_selectRows(k_editInfo.k_rowIndex);
k_toolbar.k_dialog._k_editInfo = k_editInfo;
}
k_grid.k_stopCellEdit(!k_isValid);
}
},

k_onColorClick: function(k_toolbar, k_menuItem) {
var
k_row,
k_i,
k_data,
k_lib = kerio.lib,
k_grid = k_toolbar.k_grid,
k_selectionStatus = k_grid.k_selectionStatus,
k_cnt = k_selectionStatus.k_selectedRowsCount,
k_editInfo = k_toolbar.k_dialog._k_editInfo,
k_indexes = [];
for (k_i = 0; k_i < k_cnt; k_i++) {
k_row = k_selectionStatus.k_rows[k_i];
k_data = k_lib.k_cloneObject(k_row.k_data);	k_data.color = k_menuItem.k_name;
k_grid.k_updateRow(k_data, k_row.k_rowIndex);
k_indexes.push(k_row.k_rowIndex);
}
k_grid.k_selectRows(k_indexes);
if (k_editInfo) {
k_grid.k_extWidget.getView().focusRow(k_editInfo.k_rowIndex);
k_grid.k_startCellEdit(k_editInfo.k_rowIndex, k_editInfo.k_columnId);
delete k_toolbar.k_dialog._k_editInfo;
}
}
}
],

k_update : function(k_sender, k_event) {
k_sender.k_dialog._k_updateBottomToolbar(k_sender, k_event); }
}; k_bottomToolbar = new k_lib.K_Toolbar(k_publicName + k_gridWidgetName + '_' + 'k_bottomToolbar', k_bottomToolbarCfg);
k_rightToolbarCfg = {
k_showVertically: true,
k_isCentered: true,
k_buttonMinWidth: 24,         k_className: 'toolbarSprite', k_items: [
{
k_id: 'k_btnMoveUp',
k_className: 'k_btnMoveUp',
k_icon: k_lib.k_kerioLibraryRoot + 'img/moveUp.png?v=8629',
k_isDisabled: true,

k_onClick: function(k_toolbar) {
k_toolbar.k_grid.k_dialog._k_cancelRowEdit();
k_toolbar.k_grid.k_moveSelectedRows(true);
}
},
{
k_id: 'k_btnMoveDown',
k_className: 'k_btnMoveDown',
k_icon: k_lib.k_kerioLibraryRoot + 'img/moveDown.png?v=8629',
k_isDisabled: true,

k_onClick: function(k_toolbar) {
k_toolbar.k_grid.k_dialog._k_cancelRowEdit();
k_toolbar.k_grid.k_moveSelectedRows(false);
}
}
],

k_update : function(k_sender, k_event) {
k_sender.k_dialog._k_updateRightToolbar(k_sender, k_event); }
}; k_rightToolbar = new k_lib.K_Toolbar(k_publicName + k_gridWidgetName + '_' + 'k_rightToolbar', k_rightToolbarCfg);

k_eraseData = function () {
return {
k_data: ''
};
};
k_enableEditor = {
k_type: 'k_checkbox',
k_columnId: 'enabled'
};
k_descriptionEditor = {
k_type: 'k_text',
k_maxLength: 255,
k_checkByteLength: true
};
k_conditionEditor = {
k_type: 'k_text',
k_maxLength: 255,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false
},
k_onKeyPress: function (k_grid, k_item, k_event) {
var k_rowIndex = k_grid.k_getEditInfo().k_rowIndex;
if (k_event.ESC === k_event.getKey() && k_rowIndex === k_grid.k_dialog._k_newRowIndex) {
k_grid.k_dialog._k_cancelRowEdit();
k_grid.k_removeRowByIndex(k_rowIndex);
}
}
};
k_isRegExpEditor = {
k_type: 'k_checkbox',
k_columnId: 'isRegex'
};
k_gridCfg = {
k_isDragDropRow: true,
k_dragColumnId: 'condition',
k_columns: {
k_items: [
{	k_columnId: 'enabled', k_isHidden: true, k_isKeptHidden: true},
{	k_columnId: 'condition', k_caption: k_tr('Condition', 'wlibLogHighlighting') , k_width: 190,
k_editor: [k_enableEditor, k_conditionEditor]
},
{	k_columnId: 'isRegex',  k_caption: k_tr('Regular Expression', 'wlibLogHighlighting'), k_width: 120,
k_editor: k_isRegExpEditor, k_renderer: k_eraseData
},
{	k_columnId: 'description', k_caption: k_tr('Description', 'wlibCommon'),
k_editor: k_descriptionEditor
},
{	k_columnId: 'color', k_isHidden: true, k_isKeptHidden: true},
{	k_columnId: 'id', k_isDataOnly: true, k_isPrimaryKey: true}
],
k_sorting: false
},
k_toolbars: {
k_bottom: k_bottomToolbar,
k_right: k_rightToolbar
},
k_isRaster: true,
k_contextMenu: k_bottomToolbar.k_sharedMenu,

k_rowRenderer: function(k_rowData) {
return 'background' + k_rowData.color;
},
k_remoteData: {
k_jsonRpc: {
'method': 'Logs.getHighlightRules'
},
k_root: 'rules',
k_isAutoloaded: false,
k_isQueryValueSent: false
},
k_onLoad: function (k_grid) {
kerio.lib.k_unmaskWidget(k_grid.k_dialog);
}
}; if (kerio.lib.k_isStateful) {
k_gridCfg.k_settingsId = 'logHighlighting';
}
k_grid = new k_lib.K_Grid(k_publicName + k_gridWidgetName, k_gridCfg);

k_dialogCfg = {
k_height: 420,
k_width: 600,
k_minHeight: 205,
k_minWidth: 500,
k_title: k_tr('Highlighting', 'wlibLogHighlighting'),
k_content: k_grid,
k_buttons: [{
k_id: 'k_btnOk', k_isDefault: true, k_caption: k_tr('OK', 'wlibButtons'),
k_validateBeforeClick: true,

k_onClick: function(k_toolbar){
k_toolbar.k_dialog._k_saveData();
}
}, {
k_caption: k_tr('Cancel', 'wlibButtons'),
k_isCancel: true
}]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_grid.k_addReferences({
k_dialog: k_dialog
});
k_dialog.k_addReferences({
k_grid: k_grid,
k_const: {
k_new: 0,
k_duplicate: 1
},
k_isSaveChangesOnly: true === kerio.lib.k_getSharedConstants('kerio_web_SaveChangesOnly', false)
});
k_bottomToolbar.k_addReferences({
k_grid: k_grid,
k_dialog: k_dialog
});
k_rightToolbar.k_addReferences({
k_grid: k_grid
});
k_lib.k_registerObserver(k_grid, k_bottomToolbar);
k_lib.k_registerObserver(k_grid, k_rightToolbar);
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function(k_params){
kerio.lib.k_maskWidget(this);
this.k_logViewer = k_params.k_logViewer;
this.k_grid.k_reloadData();
if (this.k_isSaveChangesOnly) {
this.k_grid.k_startTracing();
}
};

k_kerioWidget._k_updateBottomToolbar = function(k_sender, k_event){
if (!(k_sender instanceof kerio.lib.K_Grid)) {
return;
}
var
k_selectedRowsCount,
k_constKeyCodes,
k_currentKeyCode,
k_enableForSelectedOneOnly,
k_enableForSelectedSomething,
k_constEvent = kerio.lib.k_constants.k_EVENT,
k_constEventTypes = k_constEvent.k_TYPES,
k_toolbar = k_sender.k_toolbars.k_bottom;
switch (k_event.k_type) {
case k_constEventTypes.k_SELECTION_CHANGED:
k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount;
k_enableForSelectedOneOnly   = (1 === k_selectedRowsCount);
k_enableForSelectedSomething = (0 < k_selectedRowsCount);
k_toolbar.k_enableItem('k_btnRemove', k_enableForSelectedSomething);
k_toolbar.k_enableItem('k_btnDuplicate', k_enableForSelectedOneOnly);
k_toolbar.k_enableItem('k_btnColorPicker', k_enableForSelectedSomething);
break;
case k_constEventTypes.k_KEY_PRESSED:
k_constKeyCodes = k_constEvent.k_KEY_CODES;
k_currentKeyCode = k_event.k_browserEvent.keyCode;
if ((k_constKeyCodes.k_BACKSPACE === k_currentKeyCode) || (k_constKeyCodes.k_DELETE === k_currentKeyCode)) {
k_sender.k_removeSelectedRows();
}
break;
}
};

k_kerioWidget._k_updateRightToolbar = function(k_sender, k_event){
var
k_toolbar = k_sender.k_toolbars.k_right,
k_lastRowIndex = k_sender.k_getRowsCount() - 1;
if (0 === k_sender.k_selectionStatus.k_selectedRowsCount) {
k_toolbar.k_disableItem(['k_btnMoveUp', 'k_btnMoveDown']);
}
else {
k_toolbar.k_enableItem('k_btnMoveUp', !k_sender.k_isRowSelected(0)); k_toolbar.k_enableItem('k_btnMoveDown', !k_sender.k_isRowSelected(k_lastRowIndex)); }
};

k_kerioWidget._k_createNewHighlight = function(k_createNew){
var
k_newRow,
k_index = 0,
k_grid = this.k_grid,
k_selectionStatus = k_grid.k_selectionStatus,
k_isNewRow = false !== k_createNew;
if (1 === k_selectionStatus.k_selectedRowsCount) {
k_index = k_selectionStatus.k_rows[0].k_rowIndex + 1;
this._k_newRowIndex = k_index;
}
if (k_isNewRow) {
k_newRow = {
enabled: true,
description: '',
condition: '',
isRegex: false,
color: 'ffffcc'	};
}
else {
k_newRow = kerio.lib.k_cloneObject(k_selectionStatus.k_rows[0].k_data);
delete k_newRow.id; }
k_grid.k_addRow(k_newRow, k_index);
k_grid.k_startCellEdit(k_index, 'condition'); };

k_kerioWidget._k_saveData = function(){
var
k_requestCfg,
k_lib = kerio.lib,
k_data = this.k_grid.k_getData();
k_requestCfg = {
k_jsonRpc: {
'method': 'Logs.setHighlightRules',
'params': {rules: k_data}
},
k_callback: function(k_response) {
var
k_logList = kerio.adm._k_logList,
k_cnt = k_logList.length,
k_i;
kerio.lib.k_unmaskWidget(this);
if (k_response.k_isOk){
this.k_logViewer.k_getDataStore().k_reloadData(undefined, true);
for (k_i = 0; k_i < k_cnt; k_i++) {
if (this.k_logViewer !== k_logList[k_i]) {
k_logList[k_i]._k_forceRefresh = true;
}
}
this.k_hide();
}
},
k_scope: this
};
k_lib.k_maskWidget(this, {k_message: k_lib.k_tr('Saving…', 'wlibWait')});
k_lib.k_ajax.k_request(k_requestCfg);
};

k_kerioWidget.k_grid._k_convertColor = function(k_origin) {
switch (k_origin) {
case 'FFFFCC':
return 'FFFFB2';
case 'FFCCFF':
return 'FDE8CA';
case 'CCCCFF':
return 'DDBFEB';
case 'CCFFFF':
return 'C9D8ED';
case 'CCFFCC':
return 'C9EEC6';
case 'CCCCCC':
return 'E8E8E8';
}
return k_origin;
};

k_kerioWidget.k_resetOnClose = function(){
this.k_grid.k_clearData();
if (this.k_isSaveChangesOnly) {
this.k_grid.k_stopTracing();
}
};

k_kerioWidget._k_cancelRowEdit = function() {
this.k_grid.k_stopCellEdit(true);
this._k_newRowIndex = null;
};
}
};


kerio.adm.k_widgets.logExport = {

k_init: function(k_objectName) {
var
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_normalSize,
k_sizeWithCopyWarning,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_publicName = k_objectName + '_';
k_formCfg = {
k_items: [
{
k_id: 'k_copyWarning',
k_type: 'k_simpleText',
k_value: k_tr('Copying to clipboard is not possible. You can save the selection to a file.', 'wlibLogs'),
k_className: 'logCopyWarning',
k_isLabelHidden: true,
k_isHidden: true,
k_style: 'height: 50px;'
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Format', 'wlibLogExport'),
k_items: [
{
k_type: 'k_radio',
k_groupId: 'formatGroup',
k_id: 'plain',
k_value: kerio.lib.k_getSharedConstants('kerio_web_PlainText'),
k_option: k_tr('Plain text', 'wlibLogExport'),
k_isLabelHidden: true,
k_isChecked: true
},
{
k_type: 'k_radio',
k_groupId: 'formatGroup',
k_id: 'html',
k_value: kerio.lib.k_getSharedConstants('kerio_web_Html'),
k_option: k_tr('HTML', 'wlibLogExport'),
k_isLabelHidden: true
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Source', 'wlibLogExport'),
k_items: [
{
k_type: 'k_radio',
k_groupId: 'sourceGroup',
k_id: 'full',
k_value: 0,
k_option: k_tr('Full file', 'wlibLogExport'),
k_isLabelHidden: true,
k_isChecked: true
},
{
k_type: 'k_radio',
k_groupId: 'sourceGroup',
k_id: 'selection',
k_value: 1,
k_option: k_tr('Only selected rows', 'wlibLogExport'),
k_isLabelHidden: true
}
]
}
]
};
k_form = new kerio.lib.K_Form(k_publicName + 'k_form', k_formCfg);
k_normalSize = {
k_width: 240,
k_height: 265
};
k_sizeWithCopyWarning = {
k_width: 290,
k_height: 320
};

k_dialogCfg = {
k_width: k_normalSize.k_width,
k_height: k_normalSize.k_height,
k_minWidth: 220,
k_minHeight: 260,
k_title: k_tr('Save Log', 'wlibLogExport'),
k_content: k_form,
k_buttons: [
{
k_id: 'k_btnOk', k_isDefault: true, k_caption: k_tr('OK', 'wlibButtons'),

k_onClick: function(k_toolbar){
k_toolbar.k_dialog.k_exportData();
}
},
{k_caption: k_tr('Cancel', 'wlibButtons'), k_isCancel: true}
]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_formatGroup: k_form.k_getItem('formatGroup'),
k_sourceGroup: k_form.k_getItem('sourceGroup'),
k_copyWarning: k_form.k_getItem('k_copyWarning'),
_k_normalSize: k_normalSize,
_k_sizeWithCopyWarning: k_sizeWithCopyWarning
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function(k_params) {
var
k_isSelection = k_params.k_logViewer.k_isSelection(),
k_sourceGroup = this.k_sourceGroup,
k_currentSelection;
this.k_logName = k_params.k_logName;
if (k_isSelection) {
k_currentSelection = k_params.k_logViewer.k_getSelection();
this.k_fromLine = k_currentSelection.k_firstRowNumber;
this.k_countLines = k_currentSelection.k_lastRowNumber - k_currentSelection.k_firstRowNumber + 1;
}
else {
this.k_fromLine = 0;
this.k_countLines = -1;
}
if (k_params.k_showCopyWarning) {
this.k_copyWarning.k_setVisible(true);
this.k_setSize(this._k_sizeWithCopyWarning);
}
k_sourceGroup.k_setItemDisabled(1, !k_isSelection);
k_sourceGroup.k_setValue(k_isSelection ? 1 : 0);
};

k_kerioWidget.k_exportData = function() {
var
k_exportSelectedOnly = 1 === this.k_sourceGroup.k_getValue(),
k_fromLine,
k_countLines,
k_requestCfg;
if (k_exportSelectedOnly) {
k_fromLine = this.k_fromLine;
k_countLines = this.k_countLines;
}
else {
k_fromLine = 0;
k_countLines = -1;
}
k_requestCfg = {
k_jsonRpc: {
'method': kerio.lib.k_isMyKerio ? 'Logs.exportLogRelative' : 'Logs.exportLog',
'params': {
logName: this.k_logName,
fromLine: k_fromLine,
countLines: k_countLines,
type: this.k_formatGroup.k_getValue()
}
},
k_callback:  function(k_response) {
if (k_response.k_isOk) {
this.k_hide();
}
},
k_scope: this
};
kerio.lib.k_ajax.k_request(k_requestCfg);
};

k_kerioWidget.k_resetOnClose = function() {
this.k_copyWarning.k_setVisible(false);
this.k_setSize(this._k_normalSize);
this.k_form.k_reset();
};
}
};


kerio.adm.k_widgets.logSettings = {

k_init: function(k_objectName) {
var
k_formFileLoggingCfg,
k_formFileLogging,
k_formExternalLoggingCfg,
k_formExternalLogging,
k_tabPageCfg,
k_tabPage,
k_formManager,
k_dialogCfg,
k_dialog,
k_buttons,
k_facilityValues,
k_tr = kerio.lib.k_tr,
k_publicName = k_objectName + '_',
k_sharedConstants = kerio.lib.k_getSharedConstants(),
k_isReadOnly = k_sharedConstants.kerio_web_Auditor === kerio.adm.k_framework._k_userRole,
k_severityObject = {};
k_severityObject[k_sharedConstants.kerio_web_SeverityEmergency] = '0: Emergency';
k_severityObject[k_sharedConstants.kerio_web_SeverityAlert] = '1: Alert';
k_severityObject[k_sharedConstants.kerio_web_SeverityCritical] = '2: Critical';
k_severityObject[k_sharedConstants.kerio_web_SeverityError] = '3: Error';
k_severityObject[k_sharedConstants.kerio_web_SeverityWarning] = '4: Warning';
k_severityObject[k_sharedConstants.kerio_web_SeverityNotice] = '5: Notice';
k_severityObject[k_sharedConstants.kerio_web_SeverityInformational] = '6: Informational';
k_severityObject[k_sharedConstants.kerio_web_SeverityDebug] = '7: Debug';
k_facilityValues = [
{value: k_sharedConstants.kerio_web_FacilityKernel,        name: '0: Kernel messages'},
{value: k_sharedConstants.kerio_web_FacilityUserLevel,     name: '1: User-level messages'},
{value: k_sharedConstants.kerio_web_FacilityMailSystem,    name: '2: Mail system'},
{value: k_sharedConstants.kerio_web_FacilitySystemDaemons, name: '3: System daemons'},
{value: k_sharedConstants.kerio_web_FacilitySecurity1,     name: '4: Security\/Authorization messages'},
{value: k_sharedConstants.kerio_web_FacilityInternal,      name: '5: Messages generated internally by syslog daemon'},
{value: k_sharedConstants.kerio_web_FacilityLinePrinter,   name: '6: Line printer subsystem'},
{value: k_sharedConstants.kerio_web_FacilityNetworkNews,   name: '7: Network news subsystem'},
{value: k_sharedConstants.kerio_web_FacilityUucpSubsystem, name: '8: UUCP subsystem'},
{value: k_sharedConstants.kerio_web_FacilityClockDaemon1,  name: '9: Clock daemon'},
{value: k_sharedConstants.kerio_web_FacilitySecurity2,     name: '10: Security\/Authorization messages'},
{value: k_sharedConstants.kerio_web_FacilityFtpDaemon,     name: '11: FTP daemon'},
{value: k_sharedConstants.kerio_web_FacilityNtpSubsystem,  name: '12: NTP subsystem'},
{value: k_sharedConstants.kerio_web_FacilityLogAudit,      name: '13: Log audit'},
{value: k_sharedConstants.kerio_web_FacilityLogAlert,      name: '14: Log alert'},
{value: k_sharedConstants.kerio_web_FacilityClockDaemon2,  name: '15: Clock daemon'},
{value: k_sharedConstants.kerio_web_FacilityLocal0,        name: '16: Local use 0'},
{value: k_sharedConstants.kerio_web_FacilityLocal1,        name: '17: Local use 1'},
{value: k_sharedConstants.kerio_web_FacilityLocal2,        name: '18: Local use 2'},
{value: k_sharedConstants.kerio_web_FacilityLocal3,        name: '19: Local use 3'},
{value: k_sharedConstants.kerio_web_FacilityLocal4,        name: '20: Local use 4'},
{value: k_sharedConstants.kerio_web_FacilityLocal5,        name: '21: Local use 5'},
{value: k_sharedConstants.kerio_web_FacilityLocal6,        name: '22: Local use 6'},
{value: k_sharedConstants.kerio_web_FacilityLocal7,        name: '23: Local use 7'}
];
k_formFileLoggingCfg = {
k_labelWidth: 235,
k_isReadOnly: k_isReadOnly,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_checkbox',
k_id: 'general.enabled',
k_value: 0,
k_option: k_tr('Enable logging to file:', 'wlibLogSettings'),
k_isLabelHidden: true,

k_onChange: function (k_form, k_item, k_isChecked) {
k_form.k_setDisabled(['rotationFieldset'], !k_isChecked);
}
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Rotation', 'wlibLogSettings'),
k_id: 'rotationFieldset',
k_isDisabled: true,
k_labelWidth: 320,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'rotation.enabled',
k_isLabelHidden: true,
k_option: k_tr('Rotate regularly', 'wlibLogSettings'),

k_onChange: function (k_form, k_item, k_isChecked) {
var k_isOverSizedChecked = k_form.k_getItem('rotation.isOverSizeEnabled').k_isChecked();
k_form.k_getItem('rotateItems').k_setDisabled(!k_isChecked);
k_form.k_getItem('rotation.rotateCount').k_setDisabled(!(k_isChecked || k_isOverSizedChecked));
}
},
{
k_type: 'k_container',
k_id: 'rotateItems',
k_indent: 1,
k_isLabelHidden: true,
k_isDisabled: true,
k_items: [
{
k_type: 'k_radio',
k_groupId: 'rotation.period',
k_id: 'hour',
k_value: k_sharedConstants.kerio_web_RotateHourly,
k_option: k_tr('Every hour', 'wlibLogSettings')
},
{
k_type: 'k_radio',
k_groupId: 'rotation.period',
k_id: 'day',
k_value: k_sharedConstants.kerio_web_RotateDaily,
k_option: k_tr('Every day', 'wlibLogSettings'),
k_isChecked: true
},
{
k_type: 'k_radio',
k_groupId: 'rotation.period',
k_id: 'week',
k_value: k_sharedConstants.kerio_web_RotateWeekly,
k_option: k_tr('Every week', 'wlibLogSettings')
},
{
k_type: 'k_radio',
k_groupId: 'rotation.period',
k_id: 'month',
k_value: k_sharedConstants.kerio_web_RotateMonthly,
k_option: k_tr('Every month', 'wlibLogSettings')
}
]
},
{
k_type: 'k_row',
k_id: 'rotateFileSize',
k_items: [
{
k_type: 'k_checkbox',
k_option: k_tr('Rotate when file size exceeds (MB):', 'wlibLogSettings'),
k_id: 'rotation.isOverSizeEnabled',
k_isLabelHidden: true,
k_width: 320,

k_onChange: function (k_form, k_item, k_isChecked) {
var k_isRotateChecked = k_form.k_getItem('rotation.enabled').k_isChecked();
k_form.k_setDisabled('rotation.maxLogSize', !k_isChecked);
k_form.k_getItem('rotation.rotateCount').k_setDisabled(!(k_isChecked || k_isRotateChecked));
if (k_isChecked) {
k_form.k_focus('rotation.maxLogSize');
}
else {
k_form.k_getItem('rotation.maxLogSize').k_setValue(0);
}
}
},
{
k_id: 'rotation.maxLogSize',
k_type: 'k_number',
k_isLabelHidden: true,
k_maxLength: 4,
k_width: 45,
k_isDisabled: true,
k_validator: {
k_allowBlank: false
}
}
]
},
{
k_id: 'rotation.rotateCount',
k_type: 'k_number',
k_caption: k_tr('Number of rotated log files to keep:', 'wlibLogSettings'),
k_value: '1000',
k_maxLength: 6,
k_isDisabled: true,
k_width: 45,
k_validator: {
k_allowBlank: false
}
}
]
}
]
};
k_formFileLogging = new kerio.lib.K_Form(k_publicName + 'k_formFileLogging', k_formFileLoggingCfg);
k_formExternalLoggingCfg = {
k_isReadOnly: k_isReadOnly,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'syslog.enabled',
k_isLabelHidden: true,
k_option: k_tr('Enable Syslog logging', 'wlibLogSettings'),

k_onChange: function (k_form, k_item, k_isChecked) {
k_form.k_getItem('syslogItems').k_setDisabled(!k_isChecked);
if (k_isChecked) {
k_form.k_focus('syslog.serverUrl');
}
}
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Syslog service', 'wlibLogSettings'),
k_id: 'syslogItems',
k_isDisabled: true,
k_items: [
{
k_id: 'syslog.serverUrl',
k_caption: k_tr('Syslog server:', 'wlibLogSettings'),
k_maxLength: 255,
k_checkByteLength: true,
k_validator: {
k_regExp: new RegExp('^[^ ]+$'),
k_allowBlank: false
}
},
{
k_id: 'syslog.facility',
k_type: 'k_select',
k_caption: k_tr('Facility:', 'wlibLogSettings'),
k_localData: k_facilityValues
},
{
k_id: 'syslog.severity',
k_type: 'k_display',
k_caption: k_tr('Severity:', 'wlibLogSettings'),
k_value: ''
},
{
k_id: 'syslog.application',
k_caption: k_tr('Application:', 'wlibLogSettings'),
k_value: '',
k_maxLength: 48,
k_validator: {
k_regExp: new RegExp('^[\x21-\x7E]+$'),
k_invalidText: k_tr('Only ASCII characters with code from range 33 to 126 are allowed.', 'wlibLogSettings'),
k_allowBlank: false
}
}
]
}
]
};
k_formExternalLogging = new kerio.lib.K_Form(k_publicName + 'k_formExternalLogging', k_formExternalLoggingCfg);
k_tabPageCfg = {
k_items: [
{k_caption: k_tr('File Logging', 'wlibLogSettings'),k_content: k_formFileLogging},
{k_caption: k_tr('External Logging', 'wlibLogSettings'), k_content: k_formExternalLogging}
]
};
k_tabPage = new kerio.lib.K_TabPage(k_publicName + 'k_tabPage', k_tabPageCfg);
k_formManager = new kerio.lib.K_FormManager(k_publicName + 'k_formManager',	[k_formFileLogging, k_formExternalLogging]);
if (k_isReadOnly) {
k_buttons = [{k_caption: k_tr('Close', 'wlibButtons'), k_isCancel: true}];
}
else {
k_buttons =
[{
k_id: 'k_btnOk', k_isDefault: true, k_caption: k_tr('OK', 'wlibButtons'), k_validateBeforeClick: true,

k_onClick: function(k_toolbar){
k_toolbar.k_dialog._k_saveData();
}
},
{k_caption: k_tr('Cancel', 'wlibButtons'), k_isCancel: true}
];
}

k_dialogCfg = {
k_height: 350,
k_width: 480,
k_title: k_tr('Log Settings', 'wlibLogSettings'),
k_content: k_tabPage,
k_buttons: k_buttons
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_formManager: k_formManager,
k_tabPage: k_tabPage,
k_sharedConstants: k_sharedConstants,
k_severityObject: k_severityObject
});
k_formFileLogging.k_addReferences({
k_dialog: k_dialog
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function(k_params){
var
k_requestCfg;
kerio.lib.k_maskWidget(this);
k_requestCfg = {
k_jsonRpc: {
'method': 'Logs.getSettings',
'params': {logName: k_params.k_logName}
},
k_scope: this,
k_callback: this._k_loadDataCallback
};
kerio.lib.k_ajax.k_request(k_requestCfg);
this.k_logName = k_params.k_logName;
};

k_kerioWidget._k_loadDataCallback = function(k_response) {
if (k_response.k_isOk) {
var
k_settings = k_response.k_decoded.currentSettings,
k_rotation = k_settings.rotation,
k_syslog = k_settings.syslog;
Ext.apply(k_rotation, {
enabled: this.k_sharedConstants.kerio_web_RotateNever !== k_rotation.period,
maxLogSize: 0 < k_rotation.maxLogSize ? k_rotation.maxLogSize : 0,
isOverSizeEnabled: 0 < k_rotation.maxLogSize
});
Ext.apply(k_syslog, {
severity: this.k_severityObject[k_syslog.severity],
facility: k_syslog.facility,
application: k_syslog.application
});
this.k_formManager.k_setData(k_settings, true);
this.k_formManager.k_getItem('general.enabled').k_setOption(
kerio.lib.k_tr('Enable logging to file (%1).', 'wlibLogSettings', {k_args: [k_settings.general.fileName]})
);
}
kerio.lib.k_unmaskWidget(this);
};

k_kerioWidget._k_saveData = function() {
var
k_requestCfg,
k_lib = kerio.lib,
k_data = true === kerio.lib.k_getSharedConstants('kerio_web_SaveChangesOnly', false)
? this.k_formManager.k_getChangedData(true, [
['syslog.enabled', 'syslog.serverUrl', 'syslog.facility', 'syslog.application'],
['rotation.enabled', 'rotation.period', 'rotation.isOverSizeEnabled', 'rotation.maxLogSize', 'rotation.rotateCount']
])
: this.k_formManager.k_getData(true);
if (undefined !== k_data.rotation) {	k_data.rotation.period = k_data.rotation.enabled ? k_data.rotation.period : this.k_sharedConstants.kerio_web_RotateNever;
delete k_data.rotation.isOverSizeEnabled;
}
k_requestCfg = {
k_jsonRpc: {
'method': 'Logs.setSettings',
'params': {
newSettings: k_data,
logName: this.k_logName
}
},
k_scope: this,

k_callback: function (k_response) {
kerio.lib.k_unmaskWidget(this);
if (k_response.k_isOk) {
this.k_hide();
}
}
};
k_lib.k_maskWidget(this, {k_message: k_lib.k_tr('Saving…', 'wlibWait')});
k_lib.k_ajax.k_request(k_requestCfg);
};

k_kerioWidget.k_resetOnClose = function() {
this.k_tabPage.k_setActiveTab(0);
this.k_formManager.k_reset();
};
}
};


kerio.adm.k_widgets.logMessages = {

k_init: function(k_objectName) {
var
k_checkboxEditor,
k_gridCfg,
k_grid,
k_dialogCfg,
k_dialog,
k_buttons,
k_form,
k_descriptionMenu,
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isReadOnly = kerio.lib.k_getSharedConstants('kerio_web_Auditor') === kerio.adm.k_framework._k_userRole,
k_isSaveChangesOnly = true === kerio.lib.k_getSharedConstants('kerio_web_SaveChangesOnly', false),
k_productName = kerio.lib.k_getSharedConstants('k_PRODUCT_NAME').toLowerCase(),
_k_highlightSearchValueRenderer,
_k_findSearchValue;
k_checkboxEditor = {
k_type: 'k_checkbox',
k_columnId: 'enabled'
};
_k_findSearchValue = function(k_text, k_searchValue, k_isTooltip) {
var
k_beginMark = k_isTooltip ? '<b>' : '<span class="searchHighlighting">',
k_endMark = k_isTooltip ? '</b>' : '</span>',
k_searchStartPosition = 0,
k_searchValueLength = k_searchValue.length,
k_searchtPositionIncrement = k_searchValueLength + k_beginMark.length + k_endMark.length,
k_index;
k_searchValue = k_searchValue.toLowerCase();
k_index = k_text.toLowerCase().indexOf(k_searchValue);
while (0 <= k_index) {
k_text = [
k_text.substring(0,k_index),
k_beginMark,
k_text.substring(k_index, k_index + k_searchValueLength),
k_endMark,
k_text.substring(k_index + k_searchValueLength)
].join('');
k_searchStartPosition = k_index + k_searchtPositionIncrement;
k_index = k_text.toLowerCase().indexOf(k_searchValue, k_searchStartPosition);
}
return k_text;
};
_k_highlightSearchValueRenderer = function(k_value, k_data) {
var
k_searchValue = this._k_searchValue,
k_encodedValue = kerio.lib.k_htmlEncode(k_value).replace('&amp;', '&'),
k_highlightedValue = k_encodedValue;
if ('' !== k_searchValue) {
k_highlightedValue = this._k_findSearchValue(k_highlightedValue, k_searchValue, false);
return {
k_data: k_highlightedValue,
k_isSecure: true
};
}
return {
k_data: k_value
};
};
k_gridCfg = {
k_columns: {
k_items: [
{
k_columnId: 'description',
k_editor: k_checkboxEditor,
k_renderer: _k_highlightSearchValueRenderer
},
{k_columnId: 'parentName', k_renderer: _k_highlightSearchValueRenderer},
{k_columnId: 'enabled', k_isDataOnly: true},
{k_columnId: 'id', k_isDataOnly: true}
],
k_grouping: {
k_columnId: 'parentName',
k_isMemberIndented: true
},
k_autoExpandColumn: 'description',
k_sorting: {
k_columnId: 'description',
k_isAscending: true,
k_isRemoteSort: false
}
},
k_selectionMode: 'k_none',
k_isReadOnly: k_isReadOnly,
k_className: 'noGridHeader',
k_isCellBorderHidden: true,
k_isStateful: false,
k_remoteData: {
k_root: 'messages',
k_jsonRpc: {
'method': 'Logs.getMessages'
},
k_isAutoLoaded: false,
k_isQueryValueSent: false
},

k_onLoad: function(k_grid) {
var k_dialog = k_grid.k_dialog;
if (k_dialog.k_isSaveChangesOnly) {
k_grid.k_startTracing();
}
kerio.lib.k_unmaskWidget(k_dialog);
}
};
if (k_productName.indexOf('operator') >= 0 || k_productName.indexOf('connect') >= 0) {
k_gridCfg.k_columns.k_sorting = undefined;
}
k_grid = new k_lib.K_Grid(k_localNamespace + 'k_grid', k_gridCfg);

k_grid.k_extWidget.on('rowclick', function(k_extWidget, k_rowIndex, k_extEvent) {
var
k_kerioWidget = k_extWidget._kx.k_owner,
k_target,
k_record;
if (k_kerioWidget.k_isReadOnly()) {
return;
}
k_target = k_extEvent.getTarget('.gridColCbxWithText');
if (k_target) { k_record = k_extWidget.getStore().getAt(k_rowIndex);
k_record.set('enabled', !k_record.get('enabled'));
}
});
k_descriptionMenu = k_grid._k_checkAllMenus.description;
k_descriptionMenu.k_hideItem('k_checkSelected');
k_descriptionMenu.k_hideItem('k_uncheckSelected');
k_descriptionMenu.k_addItem({
k_caption: k_tr('Show checked only', 'wlibLogs'),

k_onClick: function() {
var
k_grid = this.k_relatedWidget;
k_grid.k_filter.k_reset();
k_grid.k_filterRowsBy(
function(k_data) {
return k_data.enabled;
}
);
}
});
k_descriptionMenu.k_addItem({
k_caption: k_tr('Show all items', 'wlibLogs'),

k_onClick: function() {
var
k_grid = this.k_relatedWidget;
k_grid.k_filter.k_reset();
k_grid.k_clearRowFilter();
}
});
k_grid.k_extWidget.on(
'contextmenu',
function (k_extEvent) {
this.showAt(k_extEvent.getXY());
},
k_descriptionMenu.k_extWidget
);
if(k_isReadOnly) {
k_buttons = [{k_id: 'k_btnClose', k_caption: k_tr('Close', 'wlibButtons'), k_isCancel: true}];
}
else {
k_buttons =
[{
k_id: 'k_btnOk', k_isDefault: true, k_caption: k_tr('OK', 'wlibButtons'),

k_onClick: function(k_toolbar){
var
k_dialog = k_toolbar.k_dialog,
k_grid = k_dialog.k_grid,
k_lib = kerio.lib,
k_requestCfg;
if (!k_dialog.k_isSaveChangesOnly || k_grid.k_isChanged()) {
k_grid.k_clearRowFilter(true);
k_requestCfg = {
k_jsonRpc: {
'method': 'Logs.setMessages',
'params': {
messages: k_dialog.k_isSaveChangesOnly ?
k_grid.k_getChangedData().k_modified :
k_grid.k_getData()
}
},
k_callback: function(k_response){
kerio.lib.k_unmaskWidget(this);
if (k_response.k_isOk) {
this.k_hide();
}
},
k_scope: k_toolbar.k_dialog
};
k_lib.k_maskWidget(this, {k_message: k_lib.k_tr('Saving…', 'wlibWait')});
k_lib.k_ajax.k_request(k_requestCfg);
}
else {
k_dialog.k_hide();
}
}
},
{k_caption: k_tr('Cancel', 'wlibButtons'), k_isCancel: true}
];
}
k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', {
k_items: [{
k_type: 'k_row',
k_items: [{
k_id: 'k_filter',
k_className: 'searchField',
k_isLabelHidden: true,
k_value: '',
k_onKeyUp: function(k_form, k_item, k_value) {
var
k_grid = k_form.k_parentWidget.k_grid,
k_searchValue = this.k_getValue();
k_grid._k_searchValue = k_searchValue;
if ('' !== k_searchValue) {
k_grid.k_extWidget.view.toggleAllGroups(true);
}
k_grid.k_filterRowsBy(function(k_rowData) {
var k_value = this._k_searchValue.toLowerCase();
return -1 !== k_rowData.description.toLowerCase().indexOf(k_value) || -1 !== k_rowData.parentName.toLowerCase().indexOf(k_value);
}, k_grid);
}
}]
},{
k_type: 'k_container',
k_content: k_grid
}]
});

k_dialogCfg = {
k_height: 450,
k_width: 350,
k_minHeight: 265,
k_minWidth: 300,
k_title: k_tr('Logging Messages', 'wlibLogs'),
k_content: k_form,
k_buttons: k_buttons,
k_className: 'logMessages'
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_grid: k_grid,
k_isSaveChangesOnly: k_isSaveChangesOnly,
k_filter: k_form.k_getItem('k_filter')
});
k_grid.k_addReferences({
k_dialog: k_dialog,
k_filter: k_form.k_getItem('k_filter'),
_k_searchValue: '',
_k_findSearchValue: _k_findSearchValue
});

k_dialog.k_applyParams = function(){
kerio.lib.k_maskWidget(this);
this.k_grid.k_reloadData();
};

k_dialog.k_resetOnClose = function(){
if (this.k_isSaveChangesOnly) {
this.k_grid.k_stopTracing();
}
this.k_grid.k_clearRowFilter();
this.k_filter.k_setValue('');
this.k_grid._k_searchValue = '';
};
return k_dialog;
}
};


kerio.adm.k_widgets.productRegistration = {

k_init: function(k_objectName, k_initParams) {
return new kerio.adm.k_widgets.K_ProductRegistrationWizard(k_objectName, k_initParams);
}
};


kerio.adm.k_widgets.htmlDialog = {

k_init: function(k_objectName, k_initParams) {
var
k_formCfg,
k_form,
k_dialogCfg,
k_contentItem,
k_onContentLoad = Ext.emptyFn,
k_lib = kerio.lib,
k_tr = k_lib.k_tr;
k_formCfg = {
k_items: [{
k_type: 'k_container',
k_height: 'auto',
k_isResizeableVertically: true,
k_id: 'k_content'
}]
};
k_form = new k_lib.K_Form(k_objectName + '_' + 'k_htmlDialogForm', k_formCfg);
k_contentItem = k_form.k_getItem('k_content');
if ('legalNotices' === k_objectName && !kerio.lib.k_isMyKerio) {
k_onContentLoad = function(k_iframe) {
var
k_doc = k_iframe.contentWindow.document,
k_css = k_doc.createElement('link');
k_css.rel = 'stylesheet';
k_css.type ='text/css';
k_css.href = kerio.lib.k_kerioLibraryRoot + '../adm/terms/style.css?v=8629';
k_doc.getElementsByTagName('head')[0].appendChild(k_css);
};
}
k_contentItem.k_addReferences({
k_contentUrl: k_initParams.k_url,
k_onLoad: k_initParams.k_onLoad || k_onContentLoad
});
if (kerio.lib.k_isIPadCompatible) {

k_contentItem.k_extWidget.on('afterrender', function(k_extWidget) {
var k_iframe;
k_iframe = k_extWidget.body.createChild({
tag: 'iframe',
src: k_extWidget._kx.k_owner.k_contentUrl,
frameBorder: '0',
width: '100%',
height: '100%'
});
k_iframe.on('load', function(k_extEvent) {
this._kx.k_owner.k_onLoad(k_extEvent.target);
}, k_extWidget);
k_iframe.on('load', function (k_extEvent, k_domElement) {
var
k_contentDoc = k_domElement.contentDocument,
k_domBody = k_contentDoc.body,
k_wrapEl;
k_domBody.innerHTML = '<div id="htmlDialogWrap" style="overflow: auto; -webkit-overflow-scrolling: touch;">'
+ k_domBody.innerHTML + '</div>';
k_domBody.style.marginTop = 0;
k_domBody.style.marginRight = 0;
k_domBody.style.marginBottom = 0;
k_domBody.style.marginLeft = 0;
k_wrapEl = k_contentDoc.getElementById('htmlDialogWrap');
k_wrapEl.style.height = this.body.getHeight() + 'px';
this.on('bodyresize', function (k_extWidget, k_width, k_height) {
if ('number' === typeof k_height) {
this.style.height = k_height + 'px';
}
}, k_wrapEl);
}, k_extWidget);
});
}
else {
k_contentItem.k_extWidget.on('render', function(k_extWidget) {
k_extWidget.html = '<iframe src="' + k_extWidget._kx.k_owner.k_contentUrl + '" frameBorder="0" width="100%" height="100%"' +
' onload="Ext.getCmp(\'' + this.id + '\')._kx.k_owner.k_onLoad(this)"></iframe>';
});
}
k_dialogCfg = {
k_height: 370,
k_width: 500,
k_minHeight: 370,
k_minWidth: 500,
k_hasHelpIcon: false,
k_className: 'htmlDialog',
k_buttons: [
{
k_isDefault: true,
k_isCancel: true,
k_mask: {},
k_id: 'k_btnClose',
k_caption: k_tr('Close', 'wlibButtons')
}
],
k_title: k_initParams.k_title,
k_content: k_form
};
return new k_lib.K_Dialog(k_objectName, k_dialogCfg);
}
};


kerio.adm.k_widgets.K_DefinitionGrid = function(k_id, k_config) {
var
k_columnEditor,
k_dialogConfig,
k_columnItems,
k_gridCfg,
k_requestCfg,
k_object,
k_itemRenderer,
k_showApplyReset,
k_isInsideDialog,
k_handlers,
k_groupIcon,
k_translations = {},
k_shortDayNames = [],
k_dayNames = [],
k_types = [],
k_requestParamIndex = 'groupIds',
k_onApply = null,
k_onReset = null,
k_onRemove,
k_onAfterRemove,
k_toolbarButtons,
k_widgetType = k_config.k_widgetType,
k_sharedConstants = kerio.lib.k_getSharedConstants(),
k_tr = kerio.lib.k_tr;
k_config = k_config || {};
k_handlers = k_config.k_handlers;
k_isInsideDialog = k_config.k_isInsideDialog;
if (k_handlers) {
k_showApplyReset = k_handlers.k_onApply ? true : false;
if (k_handlers.k_onAfterRemove) {
k_onAfterRemove = k_handlers.k_onAfterRemove;
}
}
k_requestCfg = {
k_callback : this._k_defaultCallback,
k_jsonRpc: {
method: null
}
};
k_columnEditor = {
k_type: 'k_checkbox',
k_columnId: 'enabled',
k_onGroupCheck: this._k_onGroupCheck,
k_onChange: this._k_onCheckboxChange
};
k_columnItems = [
{	k_columnId: 'item', k_caption: k_tr('Item', 'wlibCommon'), k_width: 300, k_renderer: null, k_editor: k_columnEditor},
{	k_columnId: 'groupId', k_isKeptHidden: true, k_groupRenderer: null},
{	k_columnId: 'type', k_isDataOnly: true},
{	k_columnId: 'id', k_isDataOnly: true, k_isSortable: false},
{	k_columnId: 'groupName', k_isDataOnly: true}
];
if (true === k_config.k_hasSharedItems) {
k_columnItems = k_columnItems.concat([
{	k_columnId: 'sharedId', k_caption: k_tr('Source', 'wlibCommon'), k_width: 100, k_renderer: this._k_trSourceRenderer}
]);
}
k_columnItems = k_columnItems.concat([
{	k_columnId: 'description', k_caption: k_tr('Description', 'wlibCommon'), k_width: 200},
{	k_columnId: 'enabled', k_isDataOnly: true},
{	k_columnId: 'status', k_isDataOnly: true},
{	k_columnId: 'childGroupId',   k_isDataOnly: true},
{	k_columnId: 'childGroupName', k_isDataOnly: true}
]);
switch (k_widgetType) {
case 'k_timeRangeType':
k_groupIcon = 'timeRangeIcon';
k_itemRenderer = this._k_trItemRenderer;
k_columnItems = k_columnItems.concat([
{	k_columnId: 'fromTime', k_isDataOnly: true},
{	k_columnId: 'toTime', k_isDataOnly: true},
{	k_columnId: 'days', k_caption: k_tr('Valid on', 'wlibDefinitions'), k_width: 120, k_renderer: this._k_trValidOnRenderer},
{	k_columnId: 'fromDay', k_isDataOnly  : true},
{	k_columnId: 'toDay', k_isDataOnly  : true},
{	k_columnId: 'fromDate', k_isDataOnly  : true},
{	k_columnId: 'toDate', k_isDataOnly  : true},
{	k_columnId: 'appManagerId', k_isDataOnly  : true}
]);
k_dialogConfig = {
k_sourceName: 'timeRangeEditor',
k_objectName: {
k_btnAdd: 'timeRangeAdd',
k_btnEdit: 'timeRangeEdit'
}
};
k_object = 'TimeRanges';
k_requestParamIndex = 'rangeIds';
k_translations = {
k_dailyFrom: k_tr('Daily from', 'wlibDefinitions'),
k_weeklyFrom: k_tr('Weekly from', 'wlibDefinitions'),
k_from: k_tr('From', 'wlibDefinitions'),
k_to: k_tr('to', 'wlibDefinitions'),
k_allDays: k_tr('All days', 'wlibDefinitions'),
k_weekend: k_tr('Weekend', 'wlibDefinitions'),
k_weekdays: k_tr('Weekdays', 'wlibDefinitions')
};
k_dayNames[k_sharedConstants.kerio_web_Monday] = k_tr('Monday', 'wlibCalendar');
k_dayNames[k_sharedConstants.kerio_web_Tuesday] = k_tr('Tuesday', 'wlibCalendar');
k_dayNames[k_sharedConstants.kerio_web_Wednesday] = k_tr('Wednesday', 'wlibCalendar');
k_dayNames[k_sharedConstants.kerio_web_Thursday] = k_tr('Thursday', 'wlibCalendar');
k_dayNames[k_sharedConstants.kerio_web_Friday] = k_tr('Friday', 'wlibCalendar');
k_dayNames[k_sharedConstants.kerio_web_Saturday] = k_tr('Saturday', 'wlibCalendar');
k_dayNames[k_sharedConstants.kerio_web_Sunday] = k_tr('Sunday', 'wlibCalendar');
k_shortDayNames[k_sharedConstants.kerio_web_Monday] = k_tr('Mon', 'wlibCalendar');
k_shortDayNames[k_sharedConstants.kerio_web_Tuesday] = k_tr('Tue', 'wlibCalendar');
k_shortDayNames[k_sharedConstants.kerio_web_Wednesday] = k_tr('Wed', 'wlibCalendar');
k_shortDayNames[k_sharedConstants.kerio_web_Thursday] = k_tr('Thu', 'wlibCalendar');
k_shortDayNames[k_sharedConstants.kerio_web_Friday] = k_tr('Fri', 'wlibCalendar');
k_shortDayNames[k_sharedConstants.kerio_web_Saturday] = k_tr('Sat', 'wlibCalendar');
k_shortDayNames[k_sharedConstants.kerio_web_Sunday] = k_tr('Sun', 'wlibCalendar');
k_types[k_sharedConstants.kerio_web_TimeRangeDaily] = k_tr('Daily time range', 'wlibDefinitions');
k_types[k_sharedConstants.kerio_web_TimeRangeWeekly] = k_tr('Weekly time range', 'wlibDefinitions');
k_types[k_sharedConstants.kerio_web_TimeRangeAbsolute] = k_tr('Absolute time range', 'wlibDefinitions');
break;
case 'k_ipAddressType':
k_groupIcon = 'ipGroupIcon';
k_itemRenderer = this._k_ipagItemRenderer;
k_columnItems = k_columnItems.concat([
{	k_columnId: 'host', k_isDataOnly  : true},
{	k_columnId: 'addr1', k_isDataOnly  : true},
{	k_columnId: 'addr2', k_isDataOnly  : true},
{	k_columnId: 'appManagerId', k_isDataOnly  : true},
{	k_columnId: 'geoCode', k_isDataOnly  : true},
]);
k_dialogConfig = {
k_sourceName: 'ipAddressGroupEditor',
k_objectName: {
k_btnAdd: 'ipAddressGroupAdd',
k_btnEdit: 'ipAddressGroupEdit'
}
};
k_object = 'IpAddressGroups';
k_translations = {
k_editIpAddress: k_tr('Edit IP Address', 'wlibDefinitions'),
k_ipAddressRemove: k_tr('IP Address Removal', 'wlibDefinitions'),
k_disconnect: k_tr('Disconnect', 'wlibDefinitions'),
k_firewall: k_tr('Firewall', 'wlibDefinitions')
};
if (undefined === k_sharedConstants.kerio_web_IpPrefix) {
k_sharedConstants.kerio_web_IpPrefix = 'dummyIpPrefix';
if (kerio.lib._k_debugMode) {
kerio.lib.k_warn('Shared constant "kerio_web_IpPrefix" is not defined!');
}
}
k_types[k_sharedConstants.kerio_web_Host] = k_tr('Host address', 'wlibDefinitions');
k_types[k_sharedConstants.kerio_web_IpPrefix] = k_tr('IP Prefix', 'wlibDefinitions');
k_types[k_sharedConstants.kerio_web_Network] = k_tr('Network/Mask address', 'wlibDefinitions');
k_types[k_sharedConstants.kerio_web_Range] = k_tr('Range address', 'wlibDefinitions');
k_types[k_sharedConstants.kerio_web_ThisMachine] = k_tr('Firewall address', 'wlibDefinitions');
break;
case 'k_urlGroupType':
k_groupIcon = 'urlGroupIcon';
k_itemRenderer = this._k_ugItemRenderer;
k_columnItems = k_columnItems.concat([
{ k_columnId: 'url',     k_isDataOnly: true},
{ k_columnId: 'isRegex', k_isDataOnly: true},
{ k_columnId: 'appManagerId', k_isDataOnly: true},
]);
k_dialogConfig = {
k_sourceName: 'urlGroupEditor',
k_objectName: {
k_btnAdd: 'urlGroupAdd',
k_btnEdit: 'urlGroupEdit'
}
};
k_object = 'UrlGroups';
break;
default:
kerio.lib.k_reportError('Internal error: Invalid listype "' + k_widgetType + '"', 'definitionGrid.js');
break;
}
k_translations.k_deleteMsgSingle = k_tr('Are you sure you want to remove the selected item?', 'wlibAlerts');
k_translations.k_deleteMsgMulti = k_tr('Are you sure you want to remove the selected items?', 'wlibAlerts');
k_translations.k_saving = k_tr('Saving…', 'wlibWait');
k_translations.k_cancel = k_tr('Cancel', 'wlibButtons');
k_translations.k_confirmAction = k_tr('Confirm Action', 'wlibAlerts');
k_types[k_sharedConstants.kerio_web_ChildGroup] = k_tr('Group address', 'wlibDefinitions');
k_columnItems[0].k_renderer = k_itemRenderer;
k_columnItems[1].k_groupRenderer = this._k_groupRenderer;
k_gridCfg = {
k_columns: {
k_items: k_columnItems,
k_sorting: {
k_columnId: 'item' },
k_grouping: {
k_columnId: 'groupId',
k_isMemberIndented: true,
k_isRemoteGroup: true
}
},
k_isReadOnly: k_config.k_isReadOnly,
k_pageSize: k_config.k_pageSize || 50,
k_onLoad: k_config.k_onLoad,
k_remoteData: {
k_isAutoLoaded: false,
k_root: 'list',
k_jsonRpc: {
method: k_object + '.get'
}
}
};
if (true === k_config.k_hasSharedItems) {
k_translations.k_myKerioDefinition = k_tr('MyKerio', 'wlibDefinitions');
k_translations.k_appManagerDefinition = k_tr('AppManager', 'wlibDefinitions');
k_translations.k_localDefinition = k_tr('Local', 'wlibDefinitions');
k_gridCfg.k_rowRenderer = function(k_rowData) {
if (this.k_isSharedItem(k_rowData)) {
return 'readOnlyRow';
}
};
k_gridCfg.k_onBeforeEdit = function(k_grid, k_class, k_value, k_rowData) {
if (k_grid.k_isReadOnly(k_rowData)) {
return false;
}
};
}
if (k_config.k_settingsId) {
k_gridCfg.k_settingsId = k_config.k_settingsId;
}
if (true === k_config.k_allowFiltering) {
k_gridCfg.k_filters = {
k_search: {
k_caption: k_tr('Filter:', 'liveGrid'),
k_searchBy: ['QUICKSEARCH']
},
k_combining: k_sharedConstants.kerio_web_Or
};
}
if (k_showApplyReset || k_isInsideDialog) {
k_onRemove = function(k_toolbar) {
k_toolbar.k_relatedWidget._k_onDeleteItemConfirm('yes');
};
}
else {
k_onRemove = function(k_toolbar) {
k_toolbar.k_relatedWidget._k_deleteItem();
};
}
if (k_config.k_isReadOnly) {
k_toolbarButtons = [{ k_type: 'K_BTN_VIEW' }];
}
else if (k_showApplyReset) {
if (true === k_config.k_hasSharedItems) {
k_toolbarButtons = [
{
k_type: 'K_BTN_ADD'
},
{
k_type: 'K_BTN_EDIT'
},
{
k_type: 'K_BTN_VIEW'
},
{
k_type: 'K_BTN_REMOVE',
k_onRemove: k_onRemove
},
{
k_type: 'K_APPLY_RESET',
k_onApply: k_config.k_handlers.k_onApply,
k_onReset: k_config.k_handlers.k_onReset
}
];
}
else {
k_toolbarButtons = [{
k_type: 'K_GRID_FULL',
k_onRemove: k_onRemove,
k_onApply: k_config.k_handlers.k_onApply,
k_onReset: k_config.k_handlers.k_onReset
}];
}
}
else {
k_toolbarButtons = [{
k_type: 'K_GRID_DEFAULT',
k_onRemove: k_onRemove,
k_onApply: k_onApply,
k_onReset: k_onReset
}];
}
k_gridCfg.k_toolbars = {
k_bottom: {
k_dialogs: k_config.k_dialogs || k_dialogConfig,
k_items: k_toolbarButtons
}
};
k_requestCfg.k_jsonRpc.method = k_object;
kerio.adm.k_widgets.K_DefinitionGrid.superclass.constructor.call(this, k_id, k_gridCfg);
if (true === k_config.k_hasSharedItems) {
this.k_toolbars.k_bottom.k_update = function(k_grid, k_event){
var
k_isEditableRule,
k_actionButton;
if (kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED === k_event.k_type) {
if (kerio.lib.k_getSharedConstants('kerio_web_Auditor') === kerio.adm.k_framework._k_userRole) {
this.k_enableItem('k_btnView', 1 === k_grid.k_selectionStatus.k_selectedRowsCount);
}
else {
k_isEditableRule = 1 === k_grid.k_selectionStatus.k_selectedRowsCount && !k_grid.k_isSelectedReadOnlyItem();
k_actionButton = k_isEditableRule ? this.k_getItem('k_btnEdit') : this.k_getItem('k_btnView');
k_grid._k_gridDblClickHandler = {
k_fn: this._k_getBtnHandler(k_actionButton),
k_toolbar: this,
k_button: k_actionButton
};
this.k_showItem('k_btnView', !k_isEditableRule);
this.k_showItem('k_btnEdit', k_isEditableRule);
this.k_enableItem('k_btnView', !k_isEditableRule);
this.k_enableItem('k_btnEdit', 1 === k_grid.k_selectionStatus.k_selectedRowsCount && !k_grid.k_isSelectedReadOnlyItem());
this.k_enableItem('k_btnRemove', 0 < k_grid.k_selectionStatus.k_selectedRowsCount && !k_grid.k_isSelectedSharedItem());
}
}
else {
kerio.adm.k_widgets.K_DefinitionGrid.superclass._k_gridListener.call(this, k_grid, k_event);
}
};
}
this.k_addReferences({
_k_translations: k_translations,
_k_requestCfg: k_requestCfg,
_k_requestParamIndex: k_requestParamIndex,
_k_shortDayNames: k_shortDayNames,
_k_dayNames: k_dayNames,
_k_types: k_types,
_k_sharedConstants: k_sharedConstants,
_k_onAfterRemove: k_onAfterRemove,
_k_groupIcon: k_groupIcon,
_k_allowCutOff: k_config.k_allowCutOff !== undefined ? k_config.k_allowCutOff : true,
_k_useItemStatus: true === k_showApplyReset || true === k_config.k_useItemStatus
});
if (true === k_config.k_validateCutOff && 'k_ipAddressType' === k_widgetType) {
this.k_checkCutOff = this._k_ipagCheckCutOff;
}
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_DefinitionGrid', kerio.adm.k_widgets.K_BasicList,
{


k_applyParams: function(k_params) {
this.k_reloadData();
},

_k_defaultCallback: function(k_response) {
this.k_showLoadingMask(false);
if (this._k_isUserCuttedOff === true) {
window.location.reload();
}
},

k_isSharedItem: function(k_data) {
return k_data.sharedId && '' !== k_data.sharedId || k_data.appManagerId && '' !== k_data.appManagerId;
},

k_isReadOnlyItem: function(k_data) {
return this.k_isSharedItem(k_data) ||
k_data.type === this._k_sharedConstants.kerio_web_GeoCode;
},

k_isAppManagerItem: function(k_data) {
return k_data.appManagerId && '' !== k_data.appManagerId;
},

k_isSelectedSharedItem: function() {
var
k_selectionStatus = this.k_selectionStatus,
k_selectedRows = k_selectionStatus.k_rows,
k_cnt = k_selectionStatus.k_selectedRowsCount,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (this.k_isSharedItem(k_selectedRows[k_i].k_data)) {
return true;
}
}
return false;
},

k_isSelectedReadOnlyItem: function() {
var
k_selectionStatus = this.k_selectionStatus,
k_selectedRows = k_selectionStatus.k_rows,
k_cnt = k_selectionStatus.k_selectedRowsCount,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (this.k_isReadOnlyItem(k_selectedRows[k_i].k_data)) {
return true;
}
}
return false;
},

_k_createRequestCfg: function(k_config) {
var	k_requestCfg = this._k_requestCfg;
k_requestCfg = kerio.lib.k_cloneObject(k_requestCfg, {
k_jsonRpc: {
'method': k_requestCfg.k_jsonRpc.method + '.' + k_config.k_method,
'params': k_config.k_params
},
k_callbackParams: {
k_rowData: k_config.k_detailParams
},
k_scope : k_config.k_scope
}, {
k_removeUndefinedProperties: true
});
if (k_config.k_callback) {
k_requestCfg.k_callback = k_config.k_callback;
}
return k_requestCfg;
},

_k_ipagCheckCutOff: function(k_requestCfg) {
var
k_checkCutOffRequest,
k_method = k_requestCfg.k_jsonRpc.method,
k_tmp = k_method.split('.'),
k_object;
k_object = k_tmp[0];
k_method = k_tmp[1];
k_checkCutOffRequest = kerio.lib.k_cloneObject(k_requestCfg, {
k_jsonRpc: {
method: k_object + '.' + (k_method === 'set' ? 'validateSet' : 'validateRemove')
},
k_callbackParams: {
k_requestCfg: k_requestCfg,
k_rowData: k_requestCfg.k_callbackParams.k_rowData
},
k_onError: this._k_validationError,
k_callback: this._k_validationCallback
});
kerio.lib.k_ajax.k_request(k_checkCutOffRequest);
},

_k_validationError: function(k_response, k_success, k_params) {
if (!k_response.k_isOk) {
return false;
}
var
k_translations = this._k_translations,
k_error = k_response.k_decoded.result.errors[0],
k_title = k_params.k_rowData ? k_translations.k_editIpAddress : k_translations.k_ipAddressRemove,
k_msg = kerio.lib.k_tr(k_error.message, 'serverMessage', {
k_args: k_error.messageParameters.positionalParameters,
k_pluralityBy: k_error.messageParameters.plurality
});
this.k_callbackParams = {
k_requestCfg: k_params.k_requestCfg
};
if (k_params.k_rowData) {
this.k_callbackParams.k_rowData = k_params.k_rowData;
}
if (this._k_allowCutOff) {
kerio.lib.k_confirm({
k_title: k_title,
k_msg: k_msg,
k_icon: 'warning',
k_buttons: {
k_yes: k_translations.k_disconnect,
k_no: k_translations.k_cancel
},
k_callback: this._k_cutOffCallback,
k_scope: this
});
}
else {
kerio.lib.k_alert({
k_title: k_title,
k_msg: k_msg,
k_icon: 'error',
k_callback: this._k_cutOffResetChanges,
k_scope: this
});
}
return true;
},

_k_validationCallback: function(k_response, k_success, k_params) {
if (k_response.k_isOk && 0 === k_response.k_decoded.errors.length) {
kerio.lib.k_ajax.k_request(k_params.k_requestCfg);
return;
}
},

_k_cutOffCallback: function(k_response) {
if (k_response === 'yes') {
this._k_isUserCuttedOff = true;
kerio.lib.k_ajax.k_request(this.k_callbackParams.k_requestCfg);
delete this.k_callbackParams;
}
else {
this._k_cutOffResetChanges();
}
},

_k_cutOffResetChanges: function() {
var
k_callbackParams = this.k_callbackParams,
k_rows = k_callbackParams.k_rowData,
k_i, k_cnt;
if (k_rows) {
if (!Ext.isArray(k_rows)) {
k_rows = [k_rows];
}
for (k_i = 0, k_cnt = k_rows.length; k_i < k_cnt; k_i++) {
this.k_updateRow({enabled: true}, this.k_findRow('id', k_rows[k_i].id));
}
}
this.k_showLoadingMask(false);
},

_k_deleteItem: function() {
var	k_selectionStatus = this.k_selectionStatus;
kerio.lib.k_confirm({
k_title: this._k_translations.k_confirmAction,
k_msg: k_selectionStatus.k_selectedRowsCount === 1 ?
this._k_translations.k_deleteMsgSingle :
this._k_translations.k_deleteMsgMulti,
k_callback: this._k_onDeleteItemConfirm,
k_scope: this
});
},

_k_onDeleteItemConfirm: function(k_response) {
if ('no' === k_response) {
return;
}
var
k_requestCfg,
k_currentRow,
k_prepareRequestCfg,
k_deleteItemArray = [],
k_rowsToRemove = this.k_selectionStatus.k_rows,
k_countRows = this.k_selectionStatus.k_selectedRowsCount;
for (k_currentRow = 0; k_currentRow < k_countRows; k_currentRow++) {
k_deleteItemArray.push(k_rowsToRemove[k_currentRow].k_data.id);
}
k_prepareRequestCfg = {
k_method: 'remove',
k_params: {},
k_callback: this._k_callbackItemDelete,
k_scope: this
};
k_prepareRequestCfg.k_params[this._k_requestParamIndex] = k_deleteItemArray;
k_requestCfg = this._k_createRequestCfg(k_prepareRequestCfg);
this.k_showLoadingMask(true, {k_message: this._k_translations.k_saving});
if (this.k_checkCutOff) {
this.k_checkCutOff(k_requestCfg);
}
else {
kerio.lib.k_ajax.k_request(k_requestCfg);
}
},

_k_callbackItemDelete: function(k_response) {
if (k_response.k_isOk) {
if (this._k_isUserCuttedOff) {
window.location.reload();
}
if (undefined !== this._k_onAfterRemove) {
this._k_onAfterRemove();
}
kerio.adm.k_framework.k_enableApplyReset(true);}
this.k_showLoadingMask(false);
this.k_reloadData();
},

_k_addItemStatus: function(k_status) {
var
k_sharedConstants = this._k_sharedConstants,
k_iconCls = '';
if (this._k_useItemStatus) {
switch (k_status) {
case k_sharedConstants.kerio_web_StoreStatusNew:
k_iconCls = ' added';
break;
case k_sharedConstants.kerio_web_StoreStatusModified:
k_iconCls = ' modified';
break;
}
}
return k_iconCls;
},

_k_formatTime: function(k_time) {
var
k_hour = k_time.hour,
k_min = k_time.min;
return (k_hour < 10 ? ('0' + k_hour) : k_hour) + ':' + (k_min < 10 ? ('0' + k_min) : k_min);
},

_k_formatDate: function(k_date){
return Date.parseDate(k_date.year + '-' + (k_date.month + 1) + '-' + k_date.day, 'Y-n-j').format('Y-m-d');
},

_k_trItemRenderer: function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
var
k_sharedConstants = k_grid._k_sharedConstants,
k_translations = k_grid._k_translations,
k_iconCls = '',
k_text;
switch (k_data.type) {
case k_sharedConstants.kerio_web_TimeRangeDaily:
k_iconCls = 'trTypeDaily';
k_text = k_translations.k_dailyFrom + ' ' + k_grid._k_formatTime(k_data.fromTime) + ' ' +
k_translations.k_to + ' ' + k_grid._k_formatTime(k_data.toTime);
break;
case k_sharedConstants.kerio_web_TimeRangeWeekly:
k_iconCls = 'trTypeWeekly';
k_text = k_translations.k_weeklyFrom + ' ' + k_grid._k_dayNames[k_data.fromDay] + ' ' +
k_translations.k_to + ' ' + k_grid._k_dayNames[k_data.toDay];
break;
case k_sharedConstants.kerio_web_TimeRangeAbsolute:
k_iconCls = 'trTypeAbsolute';
k_text = k_translations.k_from + ' ' + k_grid._k_formatDate(k_data.fromDate) + ' ' +
k_grid._k_formatTime(k_data.fromTime) + ' ' +
k_translations.k_to + ' ' + k_grid._k_formatDate(k_data.toDate) + ' ' +
k_grid._k_formatTime(k_data.toTime);
break;
case k_sharedConstants.kerio_web_TimeRangeChildGroup:
k_iconCls += 'trTypeGroup';
k_text = k_data.childGroupName;
break;
}
return {
k_data: k_text,
k_iconCls: 'timeRangeIcon ' + k_iconCls + this._k_addItemStatus(k_data.status),
k_iconTooltip: k_grid._k_types[k_data.type]
};
},

_k_trSourceRenderer: function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
if (k_grid.k_isSharedItem(k_data)) {
if (k_grid.k_isAppManagerItem(k_data)) {
return {k_data: k_grid._k_translations.k_appManagerDefinition};
}
return {k_data: k_grid._k_translations.k_myKerioDefinition};
}
return {k_data: k_grid._k_translations.k_localDefinition};
},

_k_trValidOnRenderer: function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
var
k_translations = k_grid._k_translations,
k_shortDayNames = k_grid._k_shortDayNames,
k_sharedConstants = k_grid._k_sharedConstants,
k_values = [],
k_i,
k_cnt,
k_dataGrid;
for (k_i = 0, k_cnt = k_value.length; k_i < k_cnt; k_i++) {
k_values.push(k_shortDayNames[k_value[k_i]]);
}
if (7 === k_values.length) {
k_dataGrid = k_translations.k_allDays;
}
else if (-1 === k_value.indexOf(k_sharedConstants.kerio_web_Saturday) && -1 === k_value.indexOf(k_sharedConstants.kerio_web_Sunday) && 5 === k_value.length) {k_dataGrid = k_translations.k_weekdays;
}
else if (-1 !== k_value.indexOf(k_sharedConstants.kerio_web_Saturday) && -1 !== k_value.indexOf(k_sharedConstants.kerio_web_Sunday) && 2 === k_value.length) { k_dataGrid = k_translations.k_weekend;
}
else {
k_dataGrid = k_values.join(', ');
}
return {k_data: k_dataGrid};
},

_k_ipagItemRenderer: function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
var
k_sharedConstants = k_grid._k_sharedConstants,
k_iconCls = '',
k_text = '';
switch (k_data.type) {
case k_sharedConstants.kerio_web_Host:
k_iconCls = 'agTypeHost';
k_text = k_data.host;
break;
case k_sharedConstants.kerio_web_IpPrefix:
k_iconCls = 'agTypeNetwork'; k_text = k_data.host;
break;
case k_sharedConstants.kerio_web_Network:
k_iconCls = 'agTypeNetwork';
k_text = k_data.addr1 + ' / ' + k_data.addr2;
break;
case k_sharedConstants.kerio_web_Range:
k_iconCls = 'agTypeNetwork';
k_text = k_data.addr1 + ' - ' + k_data.addr2;
break;
case k_sharedConstants.kerio_web_ChildGroup:
k_iconCls = 'agTypeGroup';
k_text = k_data.childGroupName;
break;
case k_sharedConstants.kerio_web_ThisMachine:
k_iconCls = 'agTypeFirewall';
k_text = k_grid._k_translations.k_firewall;
break;
case k_sharedConstants.kerio_web_GeoCode:
k_iconCls = 'agTypeGeoCode';
k_text = k_data.geoCode;
break;
}
return {
k_data: k_text,
k_iconCls: 'ipGroupIcon ' + k_iconCls + this._k_addItemStatus(k_data.status),
k_iconTooltip: k_grid._k_types[k_data.type]
};
},

_k_ugItemRenderer: function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
var
k_sharedConstants = k_grid._k_sharedConstants,
k_iconCls = '',
k_text = '';
if (k_sharedConstants.kerio_web_UrlChildGroup === k_data.type) {
k_iconCls = 'ugTypeGroup';
k_text = k_data.childGroupName;
} else {
k_iconCls = 'ugTypeUrl';
k_text = k_data.url;
}
return {
k_data: k_text,
k_iconCls: 'urlGroupIcon ' + k_iconCls + this._k_addItemStatus(k_data.status),
k_iconTooltip: k_grid._k_types[k_data.type]
};
},

_k_groupRenderer: function(k_value, k_data) {
return {
k_data: k_data.groupName,
k_iconCls: 'grpHeader ' + this._k_groupIcon
};
},

_k_enableRules: function (k_rules, k_enable) {
var
k_statusModified = this._k_sharedConstants.kerio_web_StoreStatusModified,
k_rulesId = [],
k_prepareRequestCfg,
k_requestCfg,
k_i, k_cnt;
k_prepareRequestCfg = {
k_method: 'set',
k_params: {},
k_detailParams: k_rules,
k_scope: this
};
for (k_i = 0, k_cnt = k_rules.length; k_i < k_cnt; k_i++) {
k_rulesId[k_rulesId.length] = k_rules[k_i].id;
k_rules[k_i].status = k_statusModified;
}
k_prepareRequestCfg.k_params = {
details: {enabled: false !== k_enable}
};
k_prepareRequestCfg.k_params[this._k_requestParamIndex] = k_rulesId;
k_requestCfg = this._k_createRequestCfg(k_prepareRequestCfg);
if (kerio.adm.k_framework._k_lastWidget._k_applyResetToolbar) {
kerio.adm.k_framework.k_enableApplyReset(true);this.k_refresh();
}
this.k_showLoadingMask(true, {k_message: this._k_translations.k_saving});
if (this.k_checkCutOff) {
this.k_checkCutOff(k_requestCfg);
}
else {
kerio.lib.k_ajax.k_request(k_requestCfg);
}
},

_k_onGroupCheck: function (k_grid, k_data, k_checked) {
k_grid._k_enableRules(k_data, k_checked);
},

_k_onCheckboxChange: function(k_grid, k_value, k_data){
if (k_grid.k_isGroupCbxChangeInProgress()) {
return;
}
k_grid._k_enableRules([k_data], k_value);
},

k_getServerObjectName: function () {
return this._k_requestCfg.k_jsonRpc.method;
}
});


kerio.adm.k_widgets.K_DefinitionSelect = function(k_id, k_config){
var
k_selectId,
k_selectCfg,
k_button,
k_definitionType,
k_dialogObjectName,
k_dialogWidgetType;
k_selectCfg = kerio.lib.k_cloneObject(k_config, {
k_width: 150,
k_fieldValue: 'id',
k_fieldDisplay: 'name',
k_isLabelHidden: !k_config.k_caption,
k_localData: [],
k_definitionType: 'k_ipAddress',
k_showApplyReset: false,
k_validateCutOff: false
}, {
k_replaceExisting: false
});
k_selectCfg.k_type = 'k_select';
k_selectId = k_selectCfg.k_id;
k_definitionType = k_selectCfg.k_definitionType;
switch (k_definitionType) {
case 'k_ipAddress':
k_dialogObjectName = 'ipAddressListDialog';
k_dialogWidgetType = 'k_ipAddressType';
break;
case 'k_timeRange':
k_dialogObjectName = 'timeRangeListDialog';
k_dialogWidgetType = 'k_timeRangeType';
break;
case 'k_urlGroup':
k_dialogObjectName = 'urlGroupListDialog';
k_dialogWidgetType = 'k_urlGroupType';
break;
default:
kerio.lib.k_reportError('Unsuported type of definition select', 'definitionSelect.js');
break;
}
delete k_selectCfg.k_isDisabled;
delete k_selectCfg.k_isHidden;
delete k_selectCfg.k_indent;
k_config.k_items = [
k_selectCfg,
{
k_type: 'k_formButton',
k_id: k_selectId + '_' + 'k_button',
k_caption: kerio.lib.k_tr('Edit…', 'wlibButtons'),

k_onClick: function(k_form, k_item) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'definitionDialog',
k_objectName:  k_item._k_dialogObjectName,
k_initParams: {
k_showApplyReset: k_item._k_showApplyReset,
k_onApplyResetHandler: k_item._k_onApplyResetHandler,
k_gridConfig: {
k_widgetType: k_item._k_dialogWidgetType,
k_validateCutOff: k_item._k_validateCutOff,
k_allowFiltering: k_item._k_allowFiltering,
k_pageSize: k_item._k_pageSize
}
},
k_params: {
k_relatedWidget: k_item._k_definitionWidget,
k_relatedSelectCfg: k_item.k_selectCfg
}
});
}
}
];
delete k_config.k_width;
delete k_config.k_showApplyReset;
k_config.k_id = k_selectId + '_' + 'k_container';
this._k_localData = k_selectCfg.k_localData;
kerio.adm.k_widgets.K_DefinitionSelect.superclass.constructor.call(this, k_id + '_' + 'k_container', k_config);
this._k_select = this._k_ownerForm.k_getItem(k_selectId);
k_button = this._k_ownerForm.k_getItem(k_selectId + '_' + 'k_button');

k_button.k_extWidget.on('render', this._k_fixDefinitionSelectWidth, this.k_extWidget);
k_button.k_addReferences({
_k_dialogObjectName: k_dialogObjectName,
_k_dialogWidgetType: k_dialogWidgetType,
_k_showApplyReset: k_selectCfg.k_showApplyReset,
_k_onApplyResetHandler: k_selectCfg.k_onApplyResetHandler,
_k_validateCutOff: k_selectCfg.k_validateCutOff,
_k_definitionWidget: this,
_k_allowFiltering: k_selectCfg.k_allowFiltering,
_k_pageSize: k_selectCfg.k_pageSize,
k_selectCfg: k_selectCfg
});
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_DefinitionSelect', kerio.lib.K_RowContainer,
{





k_setData: function(k_data, k_append, k_selectedValue) {
this._k_select.k_setData(k_data, k_append, k_selectedValue);
},

k_clearData: function() {
this._k_select.k_clearData();
},

k_setValue: function(k_value, k_isInitial) {
this._k_select.k_setValue(k_value, k_isInitial);
},

k_setInitialValue: function(k_value) {
this._k_select.k_setInitialValue(k_value);
},

k_focus: function() {
this._k_select.k_focus();
},

k_getValue: function() {
return this._k_select.k_getValue();
},

k_reload: function() {
this._k_select.k_reload();
},

k_getValueCount: function() {
return this._k_select.k_getValueCount();
},

k_setRelatedFields: function(k_relatedFields) {
var
k_i,
k_j,
k_cnt,
k_relatedField;
this._k_relatedFields = k_relatedFields;
for (k_i = 0, k_cnt = k_relatedFields.length; k_i < k_cnt; k_i++) {
k_relatedField = k_relatedFields[k_i];
k_relatedField._k_relatedFields = [];
k_relatedField._k_relatedFields.push(this);
for (k_j = 0; k_j < k_cnt; k_j++) {
if (k_relatedFields[k_j].k_id !== k_relatedField.k_id) {
k_relatedField._k_relatedFields.push(k_relatedFields[k_j]);
}
}
}
},

k_updateRelatedFields: function(k_data) {
var
k_relatedFields = kerio.lib.k_cloneObject(this._k_relatedFields) || [],
k_previousValue,
k_selectData,
k_select,
k_i,
k_cnt;
k_relatedFields.push(this);
k_selectData = this._k_localData.concat(k_data);
for (k_i = 0, k_cnt = k_relatedFields.length; k_i < k_cnt; k_i++) {
k_select = k_relatedFields[k_i];
k_select.k_clearData();
if (k_selectData.length) {
k_previousValue = k_select.k_getValue();
k_select.k_setData(k_selectData, false, k_previousValue);
}
}
},

_k_fixDefinitionSelectWidth: function () {
var k_ownerCt = this.ownerCt;
if (k_ownerCt && k_ownerCt.ownerCt) {
k_ownerCt.columnWidth = 1;
k_ownerCt.ownerCt.doLayout();
}
}
});

kerio.lib.k_registerType({
k_type: 'k_definitionSelect',
k_constructorName: 'K_DefinitionSelect',
k_constructor: kerio.adm.k_widgets.K_DefinitionSelect
});


kerio.adm.k_widgets.definitionDialog = {



k_init: function(k_objectName, k_initParams) {
var
k_tr = kerio.lib.k_tr,
k_showApplyReset = k_initParams.k_showApplyReset,
k_grid,
k_dialog,
k_gridConfig,
k_title,
k_settingsId,
k_manager;
switch(k_objectName) {
case 'ipAddressListDialog':
k_title = k_tr('IP Address Groups', 'wlibDefinitionDialog');
k_settingsId = 'ipAddressGroupSelect';
k_manager = 'IpAddressGroups';
break;
case 'timeRangeListDialog':
k_title = k_tr('Time Ranges', 'wlibDefinitionDialog');
k_settingsId = 'timeRangesSelect';
k_manager = 'TimeRanges';
break;
case 'urlGroupListDialog':
k_title = k_tr('URL Groups', 'wlibDefinitionDialog');
k_settingsId = 'urlGroupsSelect';
k_manager = 'UrlGroups';
break;
}
k_gridConfig = {
k_widgetType: k_initParams.k_widgetType,
k_validateCutOff: k_initParams.k_validateCutOff
};
if (k_initParams.k_gridConfig) {
k_gridConfig = k_initParams.k_gridConfig;
k_gridConfig.k_widgetType = k_gridConfig.k_widgetType || k_initParams.k_widgetType;
k_gridConfig.k_validateCutOff = k_gridConfig.k_validateCutOff || k_initParams.k_validateCutOff;
}
k_gridConfig.k_isInsideDialog = true;
k_grid = new kerio.adm.k_widgets.K_DefinitionGrid(k_objectName + '_' + 'k_grid', k_gridConfig);
k_dialog = new kerio.lib.K_Dialog(k_objectName, {
k_width: 700,
k_height: 450,
k_content: k_grid,
k_title: k_title,
k_buttons: [{
k_id: 'k_btnOk',
k_isDefault: k_showApplyReset,
k_caption: k_tr('Apply', 'wlibButtons'),
k_isHidden: !k_showApplyReset,
k_onClick: k_initParams.k_onApplyResetHandler || Ext.emptyFn
}, {
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'wlibButtons'),
k_isCancel: true,
k_isHidden: !k_showApplyReset,
k_onClick: k_initParams.k_onApplyResetHandler || Ext.emptyFn
}, {
k_id: 'k_btnClose',
k_isDefault: !k_showApplyReset,
k_caption: k_tr('Close', 'wlibButtons'),
k_isCancel: true,
k_isHidden: k_showApplyReset
}]
});
k_dialog.k_addReferences({
k_grid: k_grid,
k_showApplyReset: k_showApplyReset,
k_manager: k_manager,
k_isScreenChanged: false
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
this.k_params = k_params;
this.k_grid.k_reloadData();
this.k_isScreenChanged = kerio.adm.k_framework.k_isScreenChanged();
};

k_kerioWidget.k_updateSelect = function(){
var
k_params = this.k_params,
k_relatedSelectCfg = k_params.k_relatedSelectCfg,
k_fieldValue = k_relatedSelectCfg.k_fieldValue,
k_fieldDisplay = k_relatedSelectCfg.k_fieldDisplay,
k_gridData = this.k_grid.k_getData(),
k_data = {},
k_selectData = [],
k_item,
k_row,
k_cnt,
k_i;
if (true === this.k_isDialogCanceled) {
delete this.k_isDialogCanceled;
return;
}
for (k_i = 0, k_cnt = k_gridData.length; k_i < k_cnt; k_i++) {
k_row = k_gridData[k_i];
if (!k_data[k_row.groupId]) {
k_data[k_row.groupId] = k_row.groupName;
k_item = {};
k_item[k_fieldValue] = k_row.groupId;
k_item[k_fieldDisplay] = k_row.groupName;
k_selectData.push(k_item);
}
}
k_params.k_relatedWidget.k_updateRelatedFields(k_selectData);
};

k_kerioWidget.k_resetOnClose = function() {
this.k_updateSelect();
if (!this.k_isScreenChanged) {
kerio.adm.k_framework.k_enableApplyReset(false);
}
};
}
};


kerio.adm.k_widgets.certificateList = {



k_init: function(k_objectName, k_initParams) {
var
k_config = k_initParams,
k_sharedConstants = kerio.lib.k_getSharedConstants(),
k_toolbarCfg,
k_toolbar,
k_columnItems,
k_gridCfg,
k_grid,
k_rendererSslType,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = k_config.k_isAuditor;
if (undefined === k_config.k_managerName || undefined === k_config.k_isAuditor) {
kerio.lib.k_reportError('Internal error: You have not configured certificates properly. Check your configuration of kerio.adm.k_framework.k_init() method.', 'adm/widget/certificateList.js');
}
k_toolbarCfg = {
k_restrictBy: {
k_isDesktop: true !== kerio.lib.k_isIPadCompatible
},
k_items: [{
k_id: 'k_btnNew',
k_caption: k_tr('New', 'wlibCertificateList'),
k_isMenuButton: true,
k_isDisabled: k_isAuditor,
k_items: [{
k_id: 'k_btnNewRequest',
k_caption: k_tr('New Certificate Request…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
k_toolbar.k_grid.k_openRequestDialog(true);
}
}, {
k_id: 'k_btnNewCertificate',
k_caption: k_tr('New Certificate…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
k_toolbar.k_grid.k_openRequestDialog(false);
}
}]
}, {
k_id: 'k_btnShowDetails',
k_isDisabled: true,
k_caption: k_tr('Show Details…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
k_toolbar.k_grid.k_openDetailDialog();
}
}, {
k_id: 'k_btnImport',
k_caption: k_tr('Import', 'wlibButtons'),
k_isMenuButton: true,
k_isDisabled: true,
k_restrictions: {
k_isDesktop: [true]
},
k_items: [{
k_id: 'k_btnImportSigned',
k_isDisabled: true,
k_caption: k_tr('Import Signed Certificate from CA…', 'wlibCertificateList'),

k_onClick: function(k_toolbar, k_item) {
k_toolbar.k_grid.k_openImportDialog(k_item.k_name);
}
}, {
k_id: 'k_btnImportNew',
k_caption: k_tr('Import a New Certificate…', 'wlibCertificateList'),

k_onClick: function(k_toolbar, k_item) {
k_toolbar.k_grid.k_openImportDialog(k_item.k_name);
}
}]
}, {
k_id: 'k_btnExport',
k_caption: k_tr('Export', 'wlibCertificateList'),
k_isMenuButton: true,
k_isDisabled: true,
k_restrictions: {
k_isDesktop: [true]
},
k_items: [{
k_id: 'k_btnExportCertificate',
k_caption: k_tr('Export Certificate…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
k_toolbar.k_grid.k_exportData(k_toolbar.k_grid.k_selectionStatus.k_rows[0].k_data.id);
}
}, {
k_id: 'k_btnExportRequest',
k_isHidden: true,
k_caption: k_tr('Export Request…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
k_toolbar.k_grid.k_exportData(k_toolbar.k_grid.k_selectionStatus.k_rows[0].k_data.id);
}
}, {
k_id: 'k_btnExportPrivateKey',
k_caption: k_tr('Export Private Key…', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
k_toolbar.k_grid.k_exportData(k_toolbar.k_grid.k_selectionStatus.k_rows[0].k_data.id, true);
}
}]
}, {
k_id: 'k_btnRemove',
k_isDisabled: true,
k_caption: k_tr('Remove', 'wlibButtons'),

k_onClick: function(k_toolbar) {
k_toolbar.k_grid.k_removeData();
}
},
'->',
{
k_id: 'k_btnSetAsActive',
k_isDisabled: true,
k_caption: 'default' === k_config.k_btnSetAsActiveType ? k_tr('Set as Default', 'wlibCertificateList') : k_tr('Set as Active', 'wlibCertificateList'),

k_onClick: function(k_toolbar) {
var
k_grid = k_toolbar.k_grid,
k_data = k_grid.k_selectionStatus.k_rows[0].k_data,
k_tr = kerio.lib.k_tr,
k_msg;
if (k_grid.k_sharedConstants.kerio_web_Expired === k_data.validPeriod.validType) {
if ('default' === k_grid.k_config.k_btnSetAsActiveType) {
k_msg = k_tr('This certificate cannot be set as default because it is expired.', 'wlibCertificateList');
}
else {
k_msg = k_tr('This certificate cannot be set as active, because it is expired.', 'wlibCertificateList');
}
kerio.lib.k_alert({
k_title: k_tr('Certificate', 'wlibCertificateList'),
k_msg: k_msg
});
return;
}
if (k_grid.k_config.k_reloadApplication) {
k_grid.k_setActiveAndReload();
}
else {
k_grid.k_setActive();
}
}
}],
k_hasSharedMenu: true,

k_update: function(k_sender, k_event) {
k_sender.k_update(k_sender, k_event);
}
};
k_toolbar = new k_lib.K_Toolbar(k_objectName + '_' + 'k_toolbar', k_toolbarCfg);

k_rendererSslType = function(k_value, k_rowData, k_rowIndex, k_columnIndex, k_grid) {
var
k_sharedConstants = k_grid.k_sharedConstants,
k_tr = kerio.lib.k_tr,
k_types = [],
k_addIcon = '',
k_trustworthyInfo;
k_types[k_sharedConstants.kerio_web_ActiveCertificate] = k_tr('Active Certificate', 'wlibCertificateList');
k_types[k_sharedConstants.kerio_web_InactiveCertificate] = k_tr('Certificate', 'wlibCertificateList');
k_types[k_sharedConstants.kerio_web_ServerCertificate] = k_tr('Default Certificate', 'wlibCertificateList');
k_types[k_sharedConstants.kerio_web_CertificateRequest] = k_tr('Request', 'wlibCertificateList');
if (k_grid.k_showChain) {
k_trustworthyInfo = k_grid.k_getTrustworthyInfo(k_rowData);
if ('untrusted' === k_trustworthyInfo.k_iconCls && k_trustworthyInfo.k_errMessage) {
k_trustworthyInfo.k_text += '\<br\>(\<i\>' + k_trustworthyInfo.k_errMessage + '\</i\>)';
}
k_addIcon = '<span unselectable="on" class="sslCert ' + k_trustworthyInfo.k_iconCls  + '" qtip="' + k_trustworthyInfo.k_text + '">&nbsp; &nbsp; &nbsp;</span>';
}
return {
k_data: k_addIcon + k_types[k_value],
k_isSecure: true,
k_iconCls: k_value === k_sharedConstants.kerio_web_CertificateRequest ? 'certificateRequest' : 'certificate'
};
};
k_columnItems = [
{	k_columnId: 'type', k_caption: k_tr('Type', 'wlibCertificateList'), k_width: 150,
k_renderer: k_rendererSslType},
{	k_columnId: 'id',	k_caption: k_tr('Name', 'wlibCertificateList'),	k_width: 120,  k_isHidden: true},
{	k_columnId: 'issuerDisplay', k_caption: k_tr('Issuer', 'wlibCertificateList'), k_width: 180},
{	k_columnId: 'issuer', k_isDataOnly: true},
{	k_columnId: 'subjectDisplay', k_caption: k_tr('Subject', 'wlibCertificateList'), k_width: 180},
{	k_columnId: 'subject', k_isDataOnly: true},
{	k_columnId: 'expires', k_caption: k_tr('Expires', 'wlibCertificateList')},
{	k_columnId: 'validPeriod', k_isDataOnly: true},
{	k_columnId: 'subjectAlternativeNameList', k_isDataOnly: true},
{	k_columnId: 'isUntrusted', k_isDataOnly: true},
{	k_columnId: 'isSelfSigned', k_isDataOnly: true},
{	k_columnId: 'verificationMessage', k_isDataOnly: true},
{	k_columnId: 'chainInfo', k_isDataOnly: true}
];
k_gridCfg = {
k_columns: {
k_items: k_columnItems,
k_sorting: {
k_isRemoteSort: false
}
},
k_pageSize: 50,
k_contextMenu: k_toolbar.k_sharedMenu,
k_remoteData: {
k_isAutoLoaded: false,
k_isQueryValueSent: false,
k_root: 'certificates',
k_jsonRpc: {
'method': k_config.k_managerName + '.' + 'get'
}
},

k_onDblClick: function () {
this.k_openDetailDialog();
},

k_onLoad: function(k_grid) {
var
k_i,
k_j,
k_cntj,
k_rowData,
k_issuer,
k_subject,
k_validToDate,
k_data = k_grid.k_getData(),
k_cnt = k_data.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_rowData = k_data[k_i];
k_issuer = k_rowData.issuer;
for (k_j = 0, k_cntj = k_issuer.length; k_j < k_cntj; k_j++) {
if ('hostname' === k_issuer[k_j].name) {
k_rowData.issuerDisplay = k_issuer[k_j].value;
break;
}
}
k_subject = k_rowData.subject;
for (k_j = 0, k_cntj = k_subject.length; k_j < k_cntj; k_j++) {
if ('hostname' === k_subject[k_j].name) {
k_rowData.subjectDisplay = k_subject[k_j].value;
break;
}
}
k_validToDate = k_rowData.validPeriod.validToDate;
k_rowData.expires = k_validToDate.year ? kerio.adm.k_framework.k_formatDate(k_validToDate) : '';
}
k_grid.k_refresh();
if (true === k_grid.k_isSetAsActive) {
k_grid.k_selectRows(0);
k_grid.k_isSetAsActive = false;
}
},
k_toolbars: {
k_bottom: k_toolbar
}
};
if (kerio.lib.k_isStateful) {
k_gridCfg.k_settingsId = 'sslCertificates';
}
k_grid = new k_lib.K_Grid(k_objectName, k_gridCfg);
kerio.lib.k_registerObserver(k_grid, k_toolbar);
k_grid.k_addReferences({
k_toolbar: k_toolbar,
k_isAuditor: k_isAuditor,
k_sharedConstants: k_sharedConstants,
k_config: k_config,
k_activatableCertificateType: 'default' === k_config.k_btnSetAsActiveType ? k_sharedConstants.kerio_web_ActiveCertificate : k_sharedConstants.kerio_web_InactiveCertificate,
k_showChain: k_config.k_showChain
});
k_toolbar.k_addReferences({
k_grid: k_grid
});
this.k_addControllers(k_grid);
return k_grid;
},

k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function() {
this.k_reloadData();
if (!this.k_isAuditor) {
this.k_toolbar.k_enableItem('k_btnImport');
}
};

k_kerioWidget.k_update = function(k_sender, k_event) {
var
k_data,
k_type,
k_selectionStatus = this.k_selectionStatus,
k_selectedRowsCount = k_selectionStatus.k_selectedRowsCount,
k_selectedOne = 1 === k_selectedRowsCount,
k_isActivableCertificate = false,
k_isRequest = false,
k_toolbar = this.k_toolbar,
k_constantsEvent = kerio.lib.k_constants.k_EVENT;
k_toolbar.k_enableItem('k_btnShowDetails', k_selectedOne);
if (!this.k_isAuditor) {
k_toolbar.k_enableItem('k_btnRemove', 0 < k_selectedRowsCount);
k_toolbar.k_enableItem('k_btnExport', k_selectedOne);
if (k_selectedOne) {
k_data = k_selectionStatus.k_rows[0].k_data;
k_type = k_data.type;
k_isRequest = k_sender.k_sharedConstants.kerio_web_CertificateRequest === k_type;
k_isActivableCertificate = k_sender.k_activatableCertificateType === k_type;
}
k_toolbar.k_enableItem('k_btnImportSigned', k_selectedOne && k_isRequest);
k_toolbar.k_enableItem('k_btnSetAsActive', k_selectedOne && k_isActivableCertificate);
k_toolbar.k_showItem('k_btnExportRequest', k_isRequest);
k_toolbar.k_showItem('k_btnExportCertificate', !k_isRequest);
if (k_event.k_type === k_constantsEvent.k_TYPES.k_KEY_PRESSED) {
var
k_currentKeyCode = k_event.k_browserEvent.keyCode,
k_keyCodes = k_constantsEvent.k_KEY_CODES;
if ((k_keyCodes.k_BACKSPACE === k_currentKeyCode || k_keyCodes.k_DELETE === k_currentKeyCode)) {
this.k_removeData();
}
}
}
};

k_kerioWidget.k_exportData = function(k_id, k_isKey) {
var	k_requestCfg = {
k_jsonRpc: {
method: this.k_config.k_managerName + '.' + (k_isKey ? 'exportPrivateKey' : 'exportCertificate'),
params: {id: k_id}
}
};
kerio.lib.k_ajax.k_request(k_requestCfg);
};

k_kerioWidget.k_openRequestDialog = function(k_isRequest) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'certificateRequest',
k_params: {
k_relatedGrid: this,
k_isRequest: k_isRequest
}
});
};

k_kerioWidget.k_openDetailDialog = function() {
if (0 === this.k_selectionStatus.k_rows.length) {
return;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'certificateDetail',
k_params: {
k_relatedGrid: this
},
k_initParams: this.k_config
});
};

k_kerioWidget.k_openImportDialog = function(k_id) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'certificateImport',
k_params: {
k_relatedGrid: this,
k_isSigned: k_id === 'k_btnImportSigned'
},
k_initParams: this.k_config
});
};

k_kerioWidget.k_removeData = function() {
var
k_message,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_selectionStatus = this.k_selectionStatus;
if (k_selectionStatus.k_selectedRowsCount === 1) {
k_message = k_selectionStatus.k_rows[0].k_data.type === this.k_sharedConstants.kerio_web_CertificateRequest ?
k_tr('Are you sure you want to remove the selected request?', 'wlibCertificateList') :
k_tr('Are you sure you want to remove the selected certificate?', 'wlibCertificateList');
}
else {
k_message = k_tr('Are you sure you want to remove the selected items?', 'wlibAlerts');
}
k_lib.k_confirm({
k_title: k_tr('Confirm Action', 'wlibAlerts'),
k_msg: k_message,
k_callback: this.k_removeDataCallback,
k_scope: this
});
};

k_kerioWidget.k_removeDataCallback = function(k_response) {
if ('no' === k_response) {
return;
}
var
k_i,
k_rows = this.k_selectionStatus.k_rows,
k_cnt = k_rows.length,
k_ids = [],
k_request;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_ids.push(k_rows[k_i].k_data.id);
}
k_request = {
k_jsonRpc: {
'method': this.k_config.k_managerName + '.' + 'remove',
'params': {certificateIds: k_ids}
},

k_callback: function(k_response) {
if (k_response.k_isOk) {
this.k_reloadData();
}
},
k_scope: this
};
kerio.lib.k_ajax.k_request(k_request);
};

k_kerioWidget.k_setActive = function() {
var
k_request;
k_request = {
k_jsonRpc: {
'method': this.k_config.k_managerName + '.' + 'setActive',
'params': {id: this.k_selectionStatus.k_rows[0].k_data.id}
},

k_callback: function(k_response) {
if (k_response.k_isOk) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr;
if (this.k_config.k_restartMessage) {
k_lib.k_alert({
k_title: k_tr('Certificate Activated', 'wlibCertificateList'),
k_msg: this.k_config.k_restartMessage
});
}
this.k_isSetAsActive = true;
this.k_reloadData();
}
},
k_scope: this
};
kerio.lib.k_ajax.k_request(k_request);
};

k_kerioWidget.k_setActiveAndReload = function() {
var
k_lib = kerio.lib;
k_lib.k_confirm({
k_title: k_lib.k_tr('Certificate Activation', 'wlibCertificateList'),
k_msg: this.k_config.k_restartMessage,
k_callback : function (k_button) {
if ('yes' === k_button) {
this.k_setActiveAndReloadCallback();
}
},
k_scope: this
});
};

k_kerioWidget.k_setActiveAndReloadCallback = function() {
var
k_request;
k_request = {
k_jsonRpc: {
'method': this.k_config.k_managerName + '.' + 'setActive',
'params': {id: this.k_selectionStatus.k_rows[0].k_data.id}
},
k_callback: function(k_response) {
if (k_response.k_isOk) {
kerio.adm.k_framework._k_abortAllRequestsBeforeUnload();
kerio.adm.k_framework._k_mainLayout.k_mask();
window.location.reload();
}
}
};
kerio.lib.k_ajax.k_request(k_request);
};
k_kerioWidget.k_getTrustworthyInfo = function(k_rowData) {
var
k_tr = kerio.lib.k_tr,
k_errMessage = k_rowData.verificationMessage,
k_iconCls = 'untrusted',
k_text = k_tr('Untrusted certificate', 'wlibCertificateList');
if (this.k_sharedConstants.kerio_web_CertificateRequest === k_rowData.type) {
return {
k_iconCls: 'request',
k_text: ''
};
}
if (false === k_rowData.isUntrusted) {
if (k_rowData.isSelfSigned) {
k_iconCls = 'selfSigned';
k_text = k_tr('Self-signed certificate', 'wlibCertificateList');
k_errMessage = '';
}
else {
k_iconCls = 'trusted';
k_text = k_tr('Trusted certificate', 'wlibCertificateList');
}
}
return {
k_iconCls: k_iconCls,
k_text: k_text,
k_errMessage: k_errMessage
};
};
} };


kerio.adm.k_widgets.certificateDetail = {

k_init: function(k_objectName, k_initParams) {
var
k_isAuditor = k_initParams.k_isAuditor,
k_gridCfg,
k_grid,
k_formSourceCfg,
k_formSource,
k_dialogCfg,
k_dialog,
k_tabPageCfg,
k_tabPage,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_localNamespace = k_objectName + '_',
k_formChain;
k_gridCfg = {
k_selectionMode: 'k_none',
k_isRowHighlighting: false,
k_isStateful: false,
k_columns: {
k_items: [{
k_columnId: 'group',
k_isKeptHidden: true
},
{
k_caption: k_tr('Name', 'wlibCertificateDetail'),
k_columnId: 'name',
k_width: 150,
k_renderer: function(k_value) {
return {
k_data: this.k_rendererTranslations[k_value]
};
}
},
{
k_caption: k_tr('Value', 'wlibCertificateDetail'),
k_columnId: 'value',

k_renderer: function(k_value) {
return {
k_data: k_value ? k_value : kerio.lib.k_tr('<not specified>', 'wlibCertificateDetail')
};
}
}],
k_grouping: {
k_columnId: 'group',
k_isMemberIndented: true,
k_isCollapsible: false,
k_allowCollapse: false
}
},
k_isCellBorderHidden: true
};
k_grid = new k_lib.K_Grid(k_localNamespace + 'k_grid', k_gridCfg);
k_grid.k_addReferences({
k_rendererTranslations: {
'hostname':               k_tr('Hostname', 'wlibCertificateDetail'),
'organizationName':       k_tr('Organization name', 'wlibCertificateDetail'),
'organizationalUnitName': k_tr('Organization unit', 'wlibCertificateDetail'),
'city':                   k_tr('City', 'wlibCertificateDetail'),
'state':                  k_tr('State or Province', 'wlibCertificateDetail'),
'country':                k_tr('Country', 'wlibCertificateDetail'),
'emailAddress':           k_tr('Email Address', 'wlibCertificateDetail')
}
});
k_formSourceCfg = {
k_restrictBy: k_isAuditor,
k_items: [{
k_restrictions: [false],
k_type: 'k_textArea',
k_id: 'k_source',
k_isLabelHidden: true,
k_isReadOnly: true,
k_maxLength: 65535
},{
k_restrictions: [true],
k_type: 'k_display',
k_id: 'k_sourceNotAvailable',
k_isLabelHidden: true,
k_icon: '/weblib/int/lib/img/info.png?v=8629',
k_value: k_tr('Certificate source is available only for users with full administration rights to this server.', 'wlibCertificateDetail')
}]
};
k_formSource = new k_lib.K_Form(k_localNamespace + 'k_formCertificate', k_formSourceCfg);
k_tabPageCfg = {
k_items: [
{k_caption: k_tr('Details', 'wlibCertificateDetail'), k_content: k_grid, k_id: 'k_tabDetails'},
{k_caption: k_tr('Source', 'wlibCertificateDetail'), k_content: k_formSource, k_id: 'k_tabCertificate'}
]
};
if (k_initParams.k_showChain) {
k_formChain = new kerio.lib.K_Form(k_localNamespace + 'k_formChain', {
k_className: 'certificateChainForm',
k_isLabelHidden: true,
k_items: [{
k_type: 'k_display',
k_id: 'k_trustworthy',
k_value: {k_iconCls: '', k_text: '', k_errMessage: ''},
k_template: '<span unselectable="on" class="sslCert {k_iconCls}">&nbsp; &nbsp; &nbsp;</span><b>{k_text}</b><br><i>{k_errMessage}</i>',
k_className: 'certificateTrustworthy'
}, {
k_type: 'k_display',
k_id: 'k_chain',
k_value: '',
k_isSecure: true,
k_className: 'certificateChain'
}]
});
k_tabPageCfg.k_items.splice(1, 0, {k_caption: k_tr('Hierarchy', 'wlibCertificateDetail'), k_content: k_formChain, k_id: 'k_tabHierarchy'});
}
k_tabPage = new k_lib.K_TabPage(k_localNamespace + 'k_tabPages', k_tabPageCfg);
k_dialogCfg = {
k_width: 500,
k_height: 450,
k_minWidth: 460,
k_minHeight: 400,
k_title: k_tr('Certificate Details', 'wlibCertificateDetail'),
k_content: k_tabPage,
k_buttons: [{
k_id: 'k_btnClose',
k_caption: k_tr('Close', 'wlibButtons'),
k_isCancel: true
}]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_tabPage: k_tabPage,
k_grid: k_grid,
k_formSource: k_formSource,
k_formChain: k_formChain,
k_isAuditor: k_isAuditor
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function(k_params){
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_loadData();
};

k_kerioWidget.k_loadData = function() {
var
k_i,
k_cnt,
k_groupName,
k_data = [],
k_selectionStatus = this.k_relatedGrid.k_selectionStatus,
k_certificate = k_selectionStatus.k_rows[0].k_data,
k_issuer = k_certificate.issuer,
k_subject = k_certificate.subject,
k_tr = kerio.lib.k_tr,
k_requestSourceCfg;
k_cnt = k_issuer.length;
k_groupName = k_tr('Issuer', 'wlibCertificateList');
for (k_i = 0; k_i < k_cnt; k_i++) {
k_data.push({
group: k_groupName,
name: k_issuer[k_i].name,
value: k_issuer[k_i].value
});
}
k_cnt = k_subject.length;
k_groupName = k_tr('Subject', 'wlibCertificateList');
for (k_i = 0; k_i < k_cnt; k_i++) {
k_data.push({
group: k_groupName,
name: k_subject[k_i].name,
value: k_subject[k_i].value
});
}
if (k_certificate.subjectAlternativeNameList && k_certificate.subjectAlternativeNameList.length) {
this.k_addAlternativeSubjects(k_groupName, k_data, k_certificate.subjectAlternativeNameList);
}
this.k_grid.k_setData(k_data);
if (this.k_formChain) {
this.k_setHierarchy(k_certificate);
}
if (!this.k_isAuditor) {
k_requestSourceCfg = {
k_jsonRpc: {
'method': this.k_relatedGrid.k_config.k_managerName + '.' + 'toSource',
'params': {id: k_certificate.id}
},

k_callback: function(k_response){
if (k_response.k_isOk) {
this.k_formSource.k_setData({
k_source: k_response.k_decoded.source
});
}
},
k_scope: this
};
kerio.lib.k_ajax.k_request(k_requestSourceCfg);
}
};
k_kerioWidget.k_setHierarchy = function(k_certificate) {
var
k_sharedConstants = kerio.lib.k_getSharedConstants(),
k_chainHtml = '',
k_template = '\<img src="' + Ext.BLANK_IMAGE_URL + '" %1\>',
k_img = '', k_cornerImg = k_template.replace('%1', 'class="corner"'),
k_iconImg = k_template.replace('%1', 'class="icon"'),
k_trustworthyInfo = this.k_relatedGrid.k_getTrustworthyInfo(k_certificate),
k_i, k_cnt;
for (k_i = 0, k_cnt = k_certificate.chainInfo.length; k_i < k_cnt; k_i++) {
k_chainHtml += '<ul><li>' + k_img + k_iconImg + k_certificate.chainInfo[k_i];
k_img = k_cornerImg;
}
for (k_i; k_i > 0; k_i--) {
k_chainHtml += '</li></ul>';
}
this.k_formChain.k_getItem('k_chain').k_setValue(k_chainHtml);
this.k_tabPage.k_setVisibleTab('k_tabHierarchy', k_sharedConstants.kerio_web_CertificateRequest !== k_certificate.type);
this.k_formChain.k_getItem('k_trustworthy').k_setValue(k_trustworthyInfo);
};
k_kerioWidget.k_addAlternativeSubjects = function(k_groupName, k_data, k_subjectAlternativeNameList) {
var
k_name,
k_values,
k_idx,
k_i, k_j, k_cnt, k_cntValues;
for (k_i = 0, k_cnt = k_subjectAlternativeNameList.length; k_i < k_cnt; k_i++) {
k_name = k_subjectAlternativeNameList[k_i].name;
k_values = k_subjectAlternativeNameList[k_i].value;
for (k_j = 0, k_cntValues = k_values.length; k_j < k_cntValues; k_j++) {
k_idx = this.k_findLastSubjectIdx(k_data, k_name, k_values[k_j]);
if (-1 !== k_idx) {
k_data.splice(k_idx, 0, {
group: k_groupName,
name: k_name,
value: k_values[k_j]
});
}
}
}
};

k_kerioWidget.k_findLastSubjectIdx = function(k_data, k_subjectName, k_value) {
var
k_idx = k_data.length,
k_isSubjectNameFound = false,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_subjectName === k_data[k_i].name) {
if (k_value === k_data[k_i].value) {
return -1;  }
k_idx = k_i + 1;
k_isSubjectNameFound = true;
}
else {
if (k_isSubjectNameFound) {  break;
}
}
}
return k_idx;
};

k_kerioWidget.k_resetOnClose = function() {
this.k_tabPage.k_setActiveTab('k_tabDetails');
};
}
};


kerio.adm.k_widgets.certificateImport = {

k_init: function(k_objectName, k_initParams) {
var
k_managerName = k_initParams.k_managerName,
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_localNamespace,
k_resetUploadFiles,
k_lib = kerio.lib,
k_tr = k_lib.k_tr;
this.k_publicName = k_objectName; k_localNamespace = k_objectName + '_';

k_resetUploadFiles = function() {
this.k_keyFileName.k_reset();
this.k_keyFileUpload.k_reset();
this.k_certificateFileName.k_reset();
this.k_certificateFileUpload.k_reset();
};k_formCfg = {
k_items: [{
k_type: 'k_fieldset',
k_id: 'k_keyFileFs',
k_caption: k_tr('Key file', 'wlibCertificateImport'),
k_items: [{
k_type: 'k_row',
k_items: [{
k_id: 'k_keyFileName',
k_isLabelHidden: true,
k_isReadOnly: true,
k_width: '100%'
}, {
k_type: 'k_formUploadButton',
k_id: 'keyFileUpload',
k_caption: k_tr('Select…', 'wlibButtons'),
k_remoteData: {
k_isAutoUpload: false,
k_jsonRpc: {
method: k_managerName + '.importPrivateKey'
}
},

k_onChange: function(k_form, k_item, k_value) {
k_form.k_keyFileName.k_setValue(k_value);
},

k_onUpload: function (k_form, k_item, k_response) {
var k_decoded = k_response.k_decoded;
if (k_response.k_isOk) {
k_form.k_dialog.k_importId = k_decoded.id;
k_form.k_certificateFileUpload.k_setAdditionalRequestParams({id: k_decoded.id});
if (true === k_decoded.needPassword) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'certificatePassword',
k_params: {
k_relatedForm: k_form
}
});
}
else {
k_form.k_certificateFileUpload.k_upload();
}
} else {
k_form.k_resetUploadFiles();
k_form.k_dialog.k_mask(false);
}
}}]}, {
k_type: 'k_simpleText',
k_isLabelHidden: true,
k_value: k_tr('E.g. *.key file', 'wlibCertificateImport')
}]}, {
k_type: 'k_fieldset',
k_caption: k_tr('Certificate file', 'wlibCertificateImport'),
k_className: 'formLastContainer',
k_items: [{
k_type: 'k_row',
k_items: [{
k_id: 'k_certificateFileName',
k_isLabelHidden: true,
k_isReadOnly: true,
k_width: '100%'
}, {
k_type: 'k_formUploadButton',
k_id: 'certificateFileUpload',
k_caption: k_tr('Select…', 'wlibButtons'),
k_remoteData: {
k_isAutoUpload: false,
k_jsonRpc: {
method: k_managerName + '.importCertificate',
params: {
id: '',
password: ''
}
}
},

k_onChange: function(k_form, k_item, k_value) {
k_form.k_certificateFileName.k_setValue(k_value);
},

k_onUpload: function (k_form, k_item, k_response) {
var k_dialog = k_form.k_dialog;
k_dialog.k_mask(false);
if (k_response.k_isOk) {
k_dialog.k_relatedGrid.k_reloadData();
k_dialog.k_hide();
}
else {
k_form.k_resetUploadFiles();
}
}}]}, {
k_type: 'k_simpleText',
k_isLabelHidden: true,
k_value: k_tr('E.g. *.crt file', 'wlibCertificateImport')
}]
}]
};k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 300,
k_minWidth: 300,
k_height: 280,
k_minHeight: 280,
k_title: k_tr('Import Certificate', 'wlibCertificateImport'),
k_content: k_form,
k_buttons: [{
k_id: 'k_btnImport',
k_isDefault: true,
k_caption: k_tr('Import', 'wlibButtons'),

k_onClick: function(k_toolbar) {
var
k_tr = kerio.lib.k_tr,
k_dialog = k_toolbar.k_dialog,
k_isSigned = k_dialog.k_isSigned,
k_form = k_dialog.k_form,
k_certificateFileName = k_form.k_certificateFileName.k_getValue(),
k_keyFileName = k_form.k_keyFileName.k_getValue();
if ((k_isSigned && k_certificateFileName === '') ||
!k_isSigned && (k_certificateFileName === '' || k_keyFileName === '')) {
kerio.lib.k_alert({
k_title: k_tr('Incorrect Input', 'wlibAlerts'),
k_msg: !k_isSigned ?
k_tr('Select both key and certificate files to upload.', 'wlibCertificateImport') :
k_tr('Select a certificate file to upload.', 'wlibCertificateImport')
});
return;
}
k_dialog.k_showMask(k_tr('Importing certificate', 'wlibCertificateImport'));
k_dialog.k_sendData();
}}, {
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'wlibButtons'),
k_isCancel: true
}]};k_dialog = new k_lib.K_Dialog(this.k_publicName, k_dialogCfg);
k_form.k_addReferences({
k_keyFileName: k_form.k_getItem('k_keyFileName'),
k_keyFileUpload: k_form.k_getItem('keyFileUpload'),
k_certificateFileName: k_form.k_getItem('k_certificateFileName'),
k_certificateFileUpload: k_form.k_getItem('certificateFileUpload'),
k_dialog: k_dialog,
k_resetUploadFiles: k_resetUploadFiles,
k_parentDialog: undefined
});k_dialog.k_addReferences({
k_form: k_form,
k_importId: undefined
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
this.k_relatedGrid = k_params.k_relatedGrid;
if (true === k_params.k_isSigned) {
this.k_form.k_setDisabled('k_keyFileFs');
}
this.k_isSigned = k_params.k_isSigned;
};

k_kerioWidget.k_sendData = function() {
var
k_form = this.k_form;
if (true === this.k_isSigned) {
k_form.k_certificateFileUpload.k_setAdditionalRequestParams({id: this.k_relatedGrid.k_selectionStatus.k_rows[0].k_data.id});
k_form.k_certificateFileUpload.k_upload();
}
else {
k_form.k_keyFileUpload.k_upload();
}
};
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_setDisabled('k_keyFileFs', false);
this.k_form.k_reset();
};
}
};


kerio.adm.k_widgets.certificatePassword = {

k_init: function(k_objectName) {
var
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_localNamespace,
k_lib = kerio.lib,
k_tr = k_lib.k_tr;
k_localNamespace = k_objectName + '_';
k_formCfg = {
k_items: [{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Enter password for key file:', 'wlibCertificateImport')
},
{
k_id: 'k_password',
k_emptyText: '',
k_isLabelHidden: true,
k_isPasswordField: true
}]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 300,
k_minWidth: 300,
k_height: 140,
k_minHeight: 140,
k_title: k_tr('Certificate Password', 'wlibCertificateImport'),
k_content: k_form,
k_buttons:[
{	k_id: 'k_btnOk',
k_isDefault: true,
k_caption: k_tr('OK', 'wlibButtons'),

k_onClick: function(k_toolbar) {
k_toolbar.k_dialog._k_isOkBtnClick = true;
k_toolbar.k_dialog.k_saveData();
}},
{	k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'wlibButtons'),
k_isCancel: true
}
]};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
this.k_relatedForm = k_params.k_relatedForm;
};

k_kerioWidget.k_saveData = function() {
this.k_relatedForm.k_certificateFileUpload.k_setAdditionalRequestParams({password: this.k_form.k_getItem('k_password').k_getValue()});
this.k_relatedForm.k_certificateFileUpload.k_upload();
this.k_hide();
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
if (true !== this._k_isOkBtnClick) {
this.k_relatedForm.k_resetUploadFiles();
this.k_relatedForm.k_dialog.k_mask(false);
delete this._k_isOkBtnClick;
}
};
}
};


kerio.adm.k_widgets.certificateRequest = {

k_init: function(k_objectName) {
var
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_lib = kerio.lib,
k_tr = k_lib.k_tr;
k_formCfg = {
k_labelWidth: 140,
k_items: [{
k_id: 'k_name',
k_caption: k_tr('Hostname:', 'wlibCertificateRequest'),
k_maxLength: 63,
k_validator: {
k_allowBlank: false
}
}, {
k_id: 'k_organization',
k_maxLength: 63,
k_caption: k_tr('Organization name:', 'wlibCertificateRequest')
}, {
k_id: 'k_unit',
k_maxLength: 63,
k_caption: k_tr('Organization unit:', 'wlibCertificateRequest')
}, {
k_id: 'k_location',
k_maxLength: 127,
k_caption: k_tr('City:', 'wlibCertificateRequest')
}, {
k_id: 'k_state',
k_maxLength: 127,
k_caption: k_tr('State or Province:', 'wlibCertificateRequest')
}, {
k_id: 'k_country',
k_type: 'k_select',
k_localData: k_lib.k_getSortedCountries(),
k_value: 'US',
k_fieldValue: 'k_value',
k_fieldDisplay: 'k_name',
k_caption: k_tr('Country:', 'wlibProductRegistration')
}, {
k_id: 'k_validFor',
k_type: 'k_select',
k_value: 1,
k_localData: [
{k_value: 1, k_name: k_tr('1 year', 'wlibCertificateRequest')},
{k_value: 2, k_name: k_tr('2 years', 'wlibCertificateRequest')},
{k_value: 3, k_name: k_tr('3 years', 'wlibCertificateRequest')},
{k_value: 5, k_name: k_tr('5 years', 'wlibCertificateRequest')},
{k_value: 10, k_name: k_tr('10 years', 'wlibCertificateRequest')}
],
k_fieldValue: 'k_value',
k_fieldDisplay: 'k_name',
k_caption: k_tr('Valid for:', 'wlibCertificateRequest')
}]
};
k_form = new k_lib.K_Form(k_objectName + '_' + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 400,
k_height: 260,
k_minWidth: 400,
k_minHeight: 260,
k_content: k_form,
k_buttons: [
{	k_id: 'k_btnOk',
k_isDefault: true,
k_caption: k_tr('OK', 'wlibButtons'),

k_onClick: function(k_toolbar) {
k_toolbar.k_dialog.k_saveData();
}},
{	k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'wlibButtons'),
k_isCancel: true
}
]};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function(k_params){
var k_tr = kerio.lib.k_tr;
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_isRequest = k_params.k_isRequest;
if (this.k_isRequest) {
this.k_form.k_setVisible('k_validFor', false);
this.k_setTitle(k_tr('New Certificate Request', 'wlibCertificateRequest'));
}
else {
this.k_setTitle(k_tr('New Certificate', 'wlibCertificateRequest'));
}
};

k_kerioWidget.k_saveData = function() {
var
k_request,
k_subject = [],
k_data = this.k_form.k_getData();
k_subject = [{
name: 'hostname',
value: k_data.k_name
}, {
name: 'organizationName',
value: k_data.k_organization ? k_data.k_organization : ''
}, {
name: 'organizationalUnitName',
value: k_data.k_unit ? k_data.k_unit : ''
}, {
name: 'city',
value: k_data.k_location ? k_data.k_location : ''
}, {
name: 'state',
value: k_data.k_state ? k_data.k_state : ''
}, {
name: 'country',
value: k_data.k_country
}];
k_request = {
k_jsonRpc: {
'method': this.k_relatedGrid.k_config.k_managerName + '.' + (this.k_isRequest ? 'generateRequest' : 'generate'),
'params': {subject: k_subject, valid: this.k_isRequest ? undefined : k_data.k_validFor}
},

k_callback: function(k_response) {
kerio.lib.k_unmaskWidget(this);
if (k_response.k_isOk) {
this.k_relatedGrid.k_reloadData();
this.k_hide();
}
},
k_scope: this
};
kerio.lib.k_maskWidget(this);
kerio.lib.k_ajax.k_request(k_request);
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
this.k_form.k_setVisible('k_validFor', true);
};
}
};


kerio.adm.k_widgets.K_DialogWithCheckbox = function(k_id, k_config) {
var
k_tr = kerio.lib.k_tr,
k_checkboxText,
k_checkboxCfg,
k_checkbox,
k_toolbar;
k_checkboxText = undefined !== k_config.k_checkboxText ? k_config.k_checkboxText : k_tr('Do not show this message in future', 'wlibAlerts');
k_config.k_hasHelpIcon = true === k_config.k_hasHelpIcon;
k_config.k_buttons = [
{
k_isDefault: true,
k_id: 'k_btnOk',
k_caption: k_tr('OK', 'wlibButtons'),
k_onClick: k_config.k_onOkClick
},
{
k_isCancel: true,
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'wlibButtons'),
k_mask: undefined }
];
kerio.adm.k_widgets.K_DialogWithCheckbox.superclass.constructor.call(this, k_id, k_config);

if (k_config.k_resetOnClose) {
this.k_addReferences({
k_resetOnClose: function() {
if (this.k_avoidResetOnClose) {
this.k_avoidResetOnClose = false;
return;
}
this.k_customResetOnClose();
},
k_customResetOnClose: k_config.k_resetOnClose,
k_avoidResetOnClose: false
});
}
if (k_config.k_onClickProperties) {
this.k_addReferences({
k_onClickProperties: k_config.k_onClickProperties
});
}
if (false !== k_config.k_createCheckbox) {
k_toolbar = this.k_toolbar;
k_checkboxCfg = {
k_id: 'k_checkbox',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_checkboxText
};
k_checkbox = new kerio.lib.K_Checkbox(k_id + '_' + 'k_tb' +'_' + 'k_checkbox', k_checkboxCfg);
k_toolbar.k_addWidget(k_checkbox, 0);
k_toolbar.k_addReferences({
k_checkbox: k_checkbox
});
}
}; Ext.extend(kerio.adm.k_widgets.K_DialogWithCheckbox, kerio.lib.K_Dialog,
{






});


kerio.adm.k_widgets.welcomeTrial = {

k_init: function(k_objectName, k_config) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_productName = k_config.k_productName,
k_registrationParams = k_config.k_registrationParams,
k_showRegisterTrial = (false !== k_config.k_showRegisterTrial),
k_trialRegistrationText,
k_icons,
k_formCfg,
k_form,
k_onClickLink,
k_dialog;
k_icons = k_config.k_icons;
if (undefined === k_icons) {
k_icons = {
k_buyProduct: '/admin/img/big/trialReminderBuy.png?v=8629',
k_registerTrial:  '/admin/img/big/trialReminderTrial.png?v=8629'
};
}

k_onClickLink = function(k_extEvent, k_target, k_options) {
var
k_sourceName  = 'productRegistration',
k_dialogCfg,
k_regType = k_options.k_isTrialRegistration ? 'k_trial' : 'k_product';
if (true === this.k_parentDialog.k_avoidResetOnCloseRegistration) {
this.k_parentDialog.k_avoidResetOnClose = true;
}
if (true === this.k_parentDialog.k_useDashboard) {
kerio.adm.k_registrationUtils.k_startRegistration(k_regType);
}
else {
this.k_parentDialog.k_hide();
kerio.lib.k_widgets.splashScreen._k_startRegistration(
k_regType,
{
k_callback: this.k_callback,
k_scope: this,
k_closeCallback: this.k_closeCallback,
k_closeCallbackScope: this.k_closeCallbackScope
}
);
}

};
k_trialRegistrationText = false === k_registrationParams.k_isSophosProduct
? k_tr('By registering you get free access to our email or telephonic technical support during the trial period.', 'wlibWelcomeTrial')
: k_tr('By registering you get the option to update the integrated antivirus and free access to our email or phone technical support during the trial period.', 'wlibWelcomeTrial');
k_formCfg = {
k_isLabelHidden: true,
k_items: [
{
k_className: 'title',
k_type: 'k_simpleText',
k_id: 'k_titleText',
k_safeValue: k_tr('Welcome to %1', 'wlibWelcomeTrial', {k_args: [k_productName]})
},
{
k_type: 'k_simpleText',
k_id: 'k_descriptionText',
k_value: k_config.k_description
},
{
k_type: 'k_row',
k_className: 'itemMovedDown',
k_items: [
{
k_type: 'k_container',
k_isLabelHidden: true,
k_width: 50,
k_items: [{
k_type: 'k_image',
k_id: 'k_purchaseImage',
k_width: 32,
k_height: 32,
k_value: k_icons.k_buyProduct
}]
},
{
k_type: 'k_simpleText',
k_id: 'k_purchaseText',
k_safeValue: '<a href="' + k_config.k_url + '" target="_blank">'
+ k_tr('Purchase %1', 'wlibWelcomeTrial', {k_args: [k_productName]}) + '</a><br>'
+ k_tr('Please consult our website for pricing and further information on how to purchase a license.', 'wlibWelcomeTrial')
}
]
},
{
k_type: 'k_row',
k_className: 'itemMovedDown',
k_items: [
{
k_type: 'k_container',
k_isLabelHidden: true,
k_width: 50,
k_items: [{
k_type: 'k_image',
k_id: 'k_registerImage',
k_width: 32,
k_height: 32,
k_className: 'trialReminderLicense',
k_value: Ext.BLANK_IMAGE_URL
}]
},
{
k_type: 'k_simpleText',
k_id: 'k_registerText',
k_safeValue: '<span class="link textLink" id="linkRegistrationFull">'
+ k_tr('Register %1 by using a purchased license number', 'wlibWelcomeTrial', {k_args: [k_productName]}) + '</span><br>'
+ k_tr("By registering you will activate the product's features according to the license you have purchased.", 'wlibWelcomeTrial')
}
]
}
]
};
if (k_showRegisterTrial) {
k_formCfg.k_items.splice(3, 0,
{
k_type: 'k_row',
k_className: 'itemMovedDown',
k_id: 'k_welcomeTrialRegistration',
k_items: [
{
k_type: 'k_container',
k_isLabelHidden: true,
k_width: 50,
k_items: [{
k_type: 'k_image',
k_id: 'k_becomeRegisteredImage',
k_width: 32,
k_height: 32,
k_value: k_icons.k_registerTrial
}]
},
{
k_type: 'k_simpleText',
k_id: 'k_becomeRegisteredText',
k_safeValue: '<span class="link textLink" id="linkRegistrationTrial">'
+ k_tr('Become a registered trial user of %1', 'wlibWelcomeTrial', {k_args: [k_productName]}) + '</span><br>'
+ k_trialRegistrationText
}
]
}
);
}
k_form = new k_lib.K_Form(k_objectName + '_' + 'k_form', k_formCfg);
Ext.apply(k_config, {
k_className: 'welcomeDialog',
k_height: 390,
k_width: 480,
k_content: k_form
});
k_config.k_createCheckbox = true !== k_config.k_isAuditor;
delete k_config.k_isAuditor;
k_dialog = new kerio.adm.k_widgets.K_DialogWithCheckbox(k_objectName, k_config);
k_registrationParams.k_parentDialog = k_dialog;
k_registrationParams.k_onClickLink = k_onClickLink;
k_registrationParams.k_showRegisterTrial = k_showRegisterTrial;
k_dialog.k_extWidget.on('afterlayout', function() {
Ext.get('linkRegistrationFull').on('click', this.k_onClickLink, this, {k_isTrialRegistration: false});
if (this.k_showRegisterTrial) {
Ext.get('linkRegistrationTrial').on('click', this.k_onClickLink, this, {
k_isTrialRegistration: true,
k_isSophosProduct: this.k_isSophosProduct
});
}
delete this.k_onClickLink;
delete this.k_showRegisterTrial;
}, k_registrationParams, {single: true});
k_dialog.k_addReferences({
k_form: k_form
});
if (undefined !== k_config.k_relatedWidget) {
k_dialog.k_addReferences({
k_relatedWidget: k_config.k_relatedWidget
});
}
if (undefined !== k_config.k_avoidResetOnCloseRegistration) {
k_dialog.k_addReferences({
k_avoidResetOnCloseRegistration: k_config.k_avoidResetOnCloseRegistration
});
}
if (undefined !== k_config.k_useDashboard) {
k_dialog.k_addReferences({
k_useDashboard: k_config.k_useDashboard
});
}
return k_dialog;
} };


kerio.adm.k_widgets.welcomeBeta = {

k_init: function(k_objectName, k_config) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_productName = k_config.k_productName,
k_image,
k_formCfg,
k_form,
k_dialog;
k_image = (undefined === k_config.k_image) ? '/admin/img/welcomeBeta.png?v=8629' : k_config.k_image;
k_formCfg = {
k_isLabelHidden: true,
k_items: [
{
k_className: 'title',
k_id: 'k_titleText',
k_type: 'k_simpleText',
k_safeValue: k_tr('Welcome to %1 beta testing!', 'wlibWelcomeBeta', {k_args: [k_productName]})
},
{
k_type: 'k_simpleText',
k_id: 'k_descriptionText',
k_value: k_tr('Thank you for your interest in this prerelease version of %1. Should you have any comments to this testing version or encounter any bugs, please tell us!', 'wlibWelcomeBeta', {k_args: [k_productName]})
},
{
k_type: 'k_container',
k_className: 'formRowsWithImage',
k_style: 'background: url(' + k_image + ') no-repeat 0 0;',
k_height: 180,
k_items: [
{
k_type: 'k_simpleText',
k_value: k_tr('There are two ways to send comments or report problems:', 'wlibWelcomeBeta')
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_container',
k_isLabelHidden: true,
k_width: 16,
k_items: [{
k_type: 'k_image',
k_width: 16,
k_height: 16,
k_className: 'unorderedListItem',
k_value: Ext.BLANK_IMAGE_URL
}]
},
{
k_type: 'k_simpleText',
k_safeValue: k_config.k_buttonPlaceText || k_tr('Click on the Report Problem button at the bottom of the main screen.', 'wlibWelcomeBeta')
}
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_container',
k_isLabelHidden: true,
k_width: 16,
k_items: [{
k_type: 'k_image',
k_width: 16,
k_height: 16,
k_className: 'unorderedListItem',
k_value: Ext.BLANK_IMAGE_URL
}]
},
{
k_type: 'k_simpleText',
k_safeValue: k_tr('Or navigate your browser directly to the following URL:', 'wlibWelcomeBeta')
+ '<br><a href="http://www.kerio.com/feedback" target="_blank">http://www.kerio.com/feedback</a>'
}
]
}
]
}
]
};
k_form = new k_lib.K_Form(k_objectName + '_' + 'k_form', k_formCfg);
Ext.apply(k_config, {
k_className: 'welcomeDialog',
k_height: 370,
k_width: 520,
k_content: k_form
});
k_config.k_createCheckbox = true !== k_config.k_isAuditor;
delete k_config.k_isAuditor;
k_dialog = new kerio.adm.k_widgets.K_DialogWithCheckbox(k_objectName, k_config);
k_dialog.k_addReferences({
k_form: k_form
});
return k_dialog;
} };


kerio.adm.k_widgets.splashScreen = {

k_init: function(k_objectName, k_config) {
return new kerio.adm.k_widgets.K_SplashScreenForm(k_objectName, k_config);
} };


kerio.adm.k_widgets.licenseInstall = {

k_init : function(k_objectName) {
var
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_tr = kerio.lib.k_tr,
k_lib = kerio.lib;
k_formCfg = {
k_items: [{
k_type: 'k_row',
k_labelWidth: 60,
k_items: [{
k_id: 'licenseFileName',
k_value: '',
k_width: '100%',
k_caption: k_tr('File:', 'wlibLicenseInstall'),
k_isReadOnly: true
}, {
k_type: 'k_formUploadButton',
k_id: 'licenseFile',
k_value: k_tr('File:', 'wlibLicenseInstall'),
k_remoteData: {
k_isAutoUpload: false,
k_jsonRpc: {
method: 'Server.uploadLicense'
}
},

k_onChange: function (k_form, k_item, k_value) {
var
k_name = k_value.split('.'),
k_tr = kerio.lib.k_tr;
if (('key' === k_name[k_name.length - 1])||('KEY' === k_name[k_name.length - 1])) {
var k_valueParts = k_value.split(/[\\\/]/);
k_value = k_valueParts[k_valueParts.length - 1];
k_form.k_getItem('licenseFileName').k_setValue(k_value);
}
else {
kerio.lib.k_alert({
k_title: k_tr('Incorrect Input', 'wlibAlerts'),
k_msg: k_tr('The selected file has an incorrect suffix!', 'wlibLicenseInstall')
});
k_item.k_reset();
}
},

k_onUpload: function (k_form, k_item, k_response) {
var k_dialog = k_form.k_dialog;
if (k_response.k_isOk) {
if (undefined !== k_dialog.k_registrationCallback) {
k_dialog.k_registrationCallback.call(k_dialog.k_registrationScope);
}
k_dialog.k_hide();
}
else {
k_form.k_reset();
k_dialog.k_mask(false);
}
}
}]
}, {
k_type: 'k_simpleText',
k_id: 'suffix',
k_value: k_tr('License file must have the KEY suffix.', 'wlibLicenseInstall'),
k_isLabelHidden: true,
k_icon: '/weblib/int/lib/img/info'
}]
};
k_form = new k_lib.K_Form(k_objectName + '_' + 'k_form', k_formCfg);
k_dialogCfg = {
k_title: kerio.lib.k_tr('Install License', 'wlibLicenseInstall'),
k_height: 146,
k_width: 430,
k_isResizable: false,
k_content: k_form,
k_hasHelpIcon: false,
k_buttons:[{
k_isDefault: true,
k_id: 'k_btnOk',
k_caption: k_tr('OK', 'wlibButtons'),

k_onClick: function(k_toolbar, k_menuItem) {
var
k_dialog = k_toolbar.k_dialog,
k_form = k_dialog.k_form,
k_isFileSelected = '' !== k_form.k_getItem('licenseFileName').k_getValue(),
k_tr = kerio.lib.k_tr;
if (k_isFileSelected) {
k_dialog.k_showMask(k_tr('Uploading…', 'wlibLicenseInstall'));
k_form.k_getItem('licenseFile').k_upload();
}
else {
kerio.lib.k_alert({
k_title: k_tr('Incorrect Input', 'wlibAlerts'),
k_msg: k_tr('You have to select a license file.', 'wlibLicenseInstall')
});
return;
}
}
},{
k_isCancel: true,
k_caption: k_tr('Cancel', 'wlibButtons')
}]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form
});
k_form.k_addReferences({
k_dialog: k_dialog
});

k_dialog.k_resetOnClose = function() {
this.k_form.k_reset();
if (undefined !== this.k_closeCallback) {
this.k_closeCallback.call(this.k_closeCallbackScope);
}
};
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function(k_params){
this.k_registrationCallback = k_params.k_callback;
this.k_registrationScope = k_params.k_scope;
this.k_closeCallback = k_params.k_closeCallback;
this.k_closeCallbackScope = k_params.k_closeCallbackScope;
};
}
};


kerio.adm.k_widgets.reportProblem = {

k_init : function(k_objectName) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_language = kerio.lib.k_engineConstants.k_CURRENT_LANGUAGE,
k_emptyRows = '\n\n\n',
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_selectedLanguage,
k_i;
for (k_i in k_lib.k_constants.k_languageList) {
if (k_lib.k_constants.k_languageList[k_i].k_id === k_language) {
k_selectedLanguage = k_lib.k_constants.k_languageList[k_i].k_caption;
break;
}
}
k_formCfg = {
k_labelWidth: 130,
k_items: [{
k_type: 'k_simpleText',
k_isHidden: k_language === 'en',
k_value: k_tr('Please use English to report your problem.', 'wlibReportProblem')
}, {
k_id: 'subject',
k_caption: k_tr('Problem summary:', 'wlibReportProblem'),
k_emptyText: 'Enter short but descriptive problem summary',
k_validator: {
k_allowBlank: false
}
}, {
k_type: 'k_textArea',
k_height: 200,
k_maxLength: 10000,
k_id: 'description',
k_caption: k_tr('Problem description:', 'wlibReportProblem'),
k_value: 'Steps to reproduce:' + k_emptyRows +
'Expected result:' + k_emptyRows +
'Actual result:' + k_emptyRows +
'Used software:'
}, {
k_id: 'name',
k_value: '',
k_caption: k_tr('Name:', 'wlibReportProblem')
}, {
k_id: 'email',
k_type: 'k_email',
k_value: '',
k_validator: {
k_allowBlank: false
}
}, {
k_type: 'k_simpleText',
k_id: 'k_version',
k_caption: k_tr('Version:', 'wlibReportProblem'),
k_safeValue: ''
}, {
k_type: 'k_simpleText',
k_id: 'k_serverOs',
k_caption: k_tr('OS:', 'wlibReportProblem'),
k_value: ''
}, {
k_type: 'k_simpleText',
k_caption: k_tr('Language:', 'wlibReportProblem'),
k_value: k_selectedLanguage
}, {
k_type: 'k_simpleText',
k_id: 'k_licenseNumber',
k_caption: k_tr('License number:', 'wlibReportProblem')
}, {
k_type: 'k_simpleText',
k_id: 'k_supportInfo',
k_isLabelHidden: true,
k_style: 'margin-top: 16px',
k_value: '' }]
};k_form = new k_lib.K_Form(k_objectName + '_' + 'k_form', k_formCfg);
k_dialogCfg = {
k_title: k_tr('Report Problem', 'wlibReportProblem'),
k_width: 470,
k_height: 560,
k_minWidth: 470,
k_minHeight: 560,
k_content: k_form,
k_hasHelpIcon: false,
k_buttons:[
'->',
{
k_isDefault: true,
k_caption: k_tr('Report Problem', 'wlibReportProblem'),
k_id: 'k_btnOk',
k_mask: {},

k_onClick: function(k_toolbar){
k_toolbar.k_dialog.k_sendData();
}
}, {
k_isCancel: true,
k_caption: k_tr('Cancel', 'wlibButtons')
}]
};k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form
});

k_dialog.k_applyParams = function(k_params){
this.k_form.k_setData({
k_licenseNumber: k_params.k_licenseNumber,
k_version: k_params.k_product + ' ' + k_params.k_version,
k_serverOs: k_params.k_serverOs || 'Unknown', name: k_params.k_username || '',
email: k_params.k_email || ''
});
this.k_form.k_getItem('k_supportInfo').k_setValue(
kerio.lib.k_tr('No other information than the displayed will be sent. This is not a technical support form, we do not support beta and RC versions. Thank you for helping us improve %1.', 'wlibReportProblem', { k_args: [ k_params.k_product ] } )
);
};

k_dialog.k_sendData = function() {
var
k_data = this.k_form.k_getData(),
k_isMailEmpty = k_data.email === '',
k_lib = kerio.lib;
this.k_isMailEmpty = k_isMailEmpty;
if (k_data.name === '') {
k_data.name = 'Anonymous';
}
if (k_isMailEmpty) {
k_data.email = 'anonymous@kerio.com';
}
k_data.language = k_lib.k_engineConstants.k_CURRENT_LANGUAGE;
k_lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Server.sendBugReport',
params: k_data
},

k_callback: function(k_response) {
var	k_lib = kerio.lib;
if (k_response.k_isOk) {
k_lib.k_alert({
k_msg:
k_lib.k_tr('Thank you for your feedback!', 'wlibReportProblem'),

k_callback: function() {
this.k_hide();
},
k_scope: this
});
}
k_lib.k_unmaskWidget(this);
},
k_scope: this
});
};

k_dialog.k_resetOnClose = function() {
this.k_form.k_reset();
};
return k_dialog;
}};


kerio.adm.k_widgets.suggestIdea = {

k_init : function(k_objectName) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_fullName = '',
k_email = '',
k_loadData,
k_formConfig,
k_form,
k_dialogCfg,
k_infoText,
k_dialog;
k_infoText = k_tr('You are going to suggest your first idea.', 'wlibSuggestIdea') + '<br><br>' +
k_tr('You will be redirected to the idea management website.', 'wlibSuggestIdea') + '<br><br>' +
k_tr('Provide your email address and optionally also your name to track your suggestions and receive weekly email updates on the items you submitted or have interacted with.', 'wlibSuggestIdea')	+'<br><br>';
k_formConfig = {
k_items: [{
k_type: 'k_container',
k_labelWidth: 90,
k_items: [{
k_type: 'k_simpleText',
k_isLabelHidden: true,
k_safeValue: k_infoText
}, {
k_id: 'name',
k_caption: k_tr('Your name:', 'wlibSuggestIdea'),
k_value: k_fullName
}, {
k_id: 'email',
k_type: 'k_email',
k_value: k_email,
k_validator: {
k_regExp: kerio.adm.k_emailRegExp
}
}]
}]
}; k_form = new k_lib.K_Form(k_objectName + '_' + 'k_form', k_formConfig);
k_dialogCfg = {
k_title: kerio.lib.k_tr('Suggest Idea', 'wlibSuggestIdea'),
k_width: 310,
k_height: 320,
k_minWidth: 310,
k_minHeight: 320,
k_content: k_form,
k_hasHelpIcon: false,
k_buttons: [
'->',
{
k_isDefault: true,
k_caption: k_tr('Continue', 'wlibSuggestIdea'),
k_id: 'k_btnOk',
k_onClick: function(k_toolbar){
k_toolbar.k_dialog.k_sendData();
}
}, {
k_isCancel: true,
k_caption: k_tr('Cancel', 'wlibButtons')
}
]
}; k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_loadData: k_loadData
});
k_form.k_addReferences({
k_dialog: k_dialog
});

k_dialog.k_applyParams = function(k_params){
this.k_form.k_setData({
name: k_params.k_username || '',
email: k_params.k_email || ''
});
};

k_dialog.k_sendData = function() {
var
k_data = this.k_form.k_getData(),
k_isName = (k_data.name !== ''),
k_requestCfg;
if (!k_isName) {
k_data.name = 'Anonymous';
}
k_requestCfg = {
k_jsonRpc: {
method: 'UserVoice.getUrl',
params: k_data
},
k_callback: function(k_response) {
if (k_response.k_isOk) {
kerio.lib.k_openWindow(k_response.k_decoded.url);
this.k_hide();
}
},
k_scope: this
};
kerio.lib.k_ajax.k_request(k_requestCfg);
};

k_dialog.k_resetOnClose = function() {
this.k_form.k_reset();
};
return k_dialog;
} };


kerio.adm.k_widgets.crashReport = {

k_init: function(k_objectName, k_initParams) {
var
k_CONSTANTS = kerio.lib.k_getSharedConstants(),
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_crashTime = new Date(k_initParams.k_crashTime * 1000).format('Y-m-d G:i'),
k_form,
k_dialog,
k_message;
switch (k_initParams.k_importance) {
case k_CONSTANTS.kerio_assist_OtherProcess:
k_message = k_tr('An external process has stopped working at %2 and has been restarted. The %1 itself was not affected. We apologize for the inconvenience.', 'wlibCrashReport', {k_args: [
k_initParams.k_productName, k_crashTime]});
break;
default:
k_message = k_tr('%1 has stopped working at %2. We apologize for the inconvenience.', 'wlibCrashReport', {k_args: [
k_initParams.k_productName, k_crashTime]});
break;
}
k_form = new k_lib.K_Form(k_objectName + '_' + 'k_form', {
k_isLabelHidden: true,
k_items: [{
k_type: 'k_container',
k_id: 'k_topContainer',
k_height: 94,
k_items: [{
k_type: 'k_display',
k_value: k_message,
k_isSecure: true,
k_icon: k_lib.k_kerioLibraryRoot + k_lib.k_extLibraryRoot + '/resources/images/default/window/icon-warning.gif?v=8629',
k_id: 'infoText',
k_style: 'padding-left: 40px; min-height: 34px;'
}, {
k_type: 'k_display',
k_value: '<b>' + k_tr('Please tell Kerio Technologies about this problem.', 'wlibCrashReport') + '</b>',
k_style: 'padding-top: 2px;',
k_isSecure: true
}, {
k_type: 'k_display',
k_id: 'k_questionText',
k_value: k_tr('What were you doing with the product when the problem occured?', 'wlibCrashReport'),
k_isSecure: true
}]
}, {
k_type: 'k_textArea',
k_id: 'description',
k_minHeight: 80,
k_checkByteLength: true,
k_maxLength: 4095
}, {
k_type: 'k_container',
k_id: 'k_bottomContainer',
k_height: 120,
k_items: [{
k_type: 'k_display',
k_className: 'formLabelSeparate',
k_value: k_tr('Email address (optional):', 'wlibCrashReport'),
k_isSecure: true
}, {
k_id: 'email',
k_type: 'k_email',
k_isLabelHidden: true
}, {
k_type: 'k_display',
k_value: k_tr('An error report has been created which will help us greatly to improve the product. All the information in the report will be treated as strictly confidential.', 'wlibCrashReport'),
k_isSecure: true
}]
}]
});
k_dialog = new k_lib.K_Dialog(k_objectName, {
k_title: k_tr('Report Problem', 'wlibReportProblem'),
k_height: 400,
k_width: 420,
k_hasHelpIcon: false,
k_content: k_form,
k_buttons: [{
k_caption: k_tr('Send Report', 'wlibCrashReport'),
k_isDefault: true,

k_onClick: function(k_toolbar) {
k_toolbar.k_dialog.k_submitReport();
}
}, {
k_caption: k_tr('Take no action', 'wlibCrashReport'),

k_onClick: function(k_toolbar) {
k_toolbar.k_dialog.k_cancelReport();
}
}]
});
k_dialog.k_extWidget.tools = [];
k_dialog.k_extWidget.onEsc = function(){};
k_dialog.k_addReferences({
k_form: k_form
});
this.k_addControllers(k_dialog, k_initParams);
return k_dialog;
},

k_addControllers: function(k_kerioWidget, k_initParams) {

k_kerioWidget.k_submitReport = function() {
var k_lib = kerio.lib;
k_lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Dumps.send',
params: this.k_form.k_getData()
},
k_requestOwner: null  });
k_lib.k_alert({
k_msg: k_lib.k_tr('Thank you!<br><br>The report is now being sent.', 'wlibCrashReport')
});
this.k_hide();
};

k_kerioWidget.k_cancelReport = function() {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Dumps.remove'
},
k_requestOwner: null
});
this.k_hide();
};

if (k_initParams.k_callback) {
if (k_initParams.k_scope) {
k_kerioWidget.k_addReferences({
k_closeCallback: k_initParams.k_callback,
k_closeCallbackScope: k_initParams.k_scope
});
k_kerioWidget.k_resetOnClose = function() {
this.k_closeCallback.call(this.k_closeCallbackScope);
};
}
else {
k_kerioWidget.k_resetOnClose = k_initParams.k_callback;
}
}

k_kerioWidget.k_extWidget.on('hide', function() {
delete kerio.lib.k_widgets[this.id];
delete kerio.lib.k_uiCacheManager._k_uiCache[this.id];
this.destroy();
});

k_kerioWidget.k_extWidget.on('afterrender', function() {
var
k_form = this.k_form,
k_topContainer = k_form.k_getItem('k_topContainer').k_extWidget,
k_description = k_form.k_getItem('description'),
k_items = k_topContainer.items,
k_height = 0,
k_i, k_cnt, k_el;
for (k_i = 0, k_cnt = k_items.getCount(); k_i < k_cnt; k_i++) {
k_el = k_items.itemAt(k_i).getEl();
if (!k_el) {
continue;
}
k_el = k_el.findParent('.x-form-item', 5, true);
if (k_el) {
k_height += k_el.getHeight() + k_el.getMargins('tb');
}
}
if (k_height !== k_topContainer.getHeight()) {
delete k_description.k_extWidget.anchorSpec;
k_topContainer.setHeight(k_height);
k_description._k_adjustAnchor(k_description.k_extWidget);
k_form.k_extWidget.doLayout();
}
}, k_kerioWidget);
}
};



kerio.adm.k_widgets.K_DomainServices = function(k_objectName, k_initParams) {
k_initParams = k_initParams || {};
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_KERIO_DIRECTORY = 'KerioDirectory',
k_ACTIVE_DIRECTORY = 'WindowsActiveDirectory',
k_APPLE_DIRECTORY = 'AppleDirectoryKerberos',
k_APPLE_PASSWORD = 'AppleDirectoryPassword',
k_WINDOWS_NT = 'WindowsNtDirectory',
k_SHARED_CONSTANTS = kerio.lib.k_getSharedConstants(),
k_membershipStatus = {
JoinStatusWaiting:      k_tr('Waiting for domain controller…', 'wlibDomainServices'),
JoinStatusDisconnected: k_tr('Not a member of any domain.', 'wlibDomainServices'),
JoinStatusError:        k_tr('Cannot contact domain controller right now.', 'wlibDomainServices')
},
k_accountFieldsetTitles = {
k_readAccess: k_tr('Account with read access to the directory service', 'wlibDomainServices'),
k_fullAccess: k_tr('Kerio Directory administrator account', 'wlibDomainServices')
},
k_primaryServerTitle = k_tr('Primary server:', 'wlibDomainServices'),
k_serverTitle = k_tr('Server:', 'wlibDomainServices'),
k_hasAdvancedButton = (true  === k_initParams.k_hasAdvancedButton),
k_hasMapUserOption =  (false !== k_initParams.k_hasMapUserOption),
k_hasMembershipInfo = (true  === k_initParams.k_hasMembershipInfo),
k_hasDescription =    (true  === k_initParams.k_hasDescription),
k_isAuditor = k_initParams.k_isAuditor,
k_labelWidth = 240,
k_fieldWidth = (k_initParams.k_isDialogLayout ? undefined: 300),
k_isDisabled = k_hasMapUserOption,
k_onChange,
k_formCfg,
k_advancedFieldsetCfg,
k_kerioLibraryRoot = kerio.lib.k_kerioLibraryRoot;
this._k_initValidation();
this._k_testConnectionStrings = {
k_directoryServer: k_tr('Directory server:', 'wlibDomainServices'),
k_primaryServer: k_tr('Primary server:', 'wlibDomainServices'),
k_secondaryServer: k_tr('Secondary server:', 'wlibDomainServices'),
k_successMsg: k_tr('The connection has been successfully tested.', 'wlibDomainServices'),
k_alerTitle: k_tr('Connection Test Result', 'wlibDomainServices')
};

k_advancedFieldsetCfg = {
k_restrictions: {
k_hasAdvancedButton: [ false ]
},
k_type: 'k_fieldset',
k_id: 'k_advanced',
k_isDisabled: !k_hasAdvancedButton && k_isDisabled,
k_caption: k_tr('Advanced', 'wlibDomainServices'),
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_row',
k_id: 'k_kerberosRealm',
k_isHidden: true,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'advanced.kerberosRealm.enabled',
k_width: k_labelWidth,
k_option: k_tr('Custom Kerberos™ 5 realm name:', 'wlibDomainServices'),
k_isLabelHidden: true,
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled('advanced.kerberosRealm.value', !k_isChecked);
}
},
{
k_id: 'advanced.kerberosRealm.value',
k_isDisabled: true,
k_validator: {
k_functionName: 'k_wlibKerberosRealm',
k_allowBlank: false
},
k_width: k_fieldWidth
}
]
},
{
k_type: 'k_row',
k_id: 'k_ldapSuffix',
k_isHidden: true,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'advanced.ldapSearchSuffix.enabled',
k_width: k_labelWidth,
k_isLabelHidden: true,
k_option: k_tr('Custom LDAP search suffix:', 'wlibDomainServices'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled('advanced.ldapSearchSuffix.value', !k_isChecked);
}
},
{
k_id: 'advanced.ldapSearchSuffix.value',
k_isDisabled: true,
k_validator: {
k_functionName: 'k_wlibLdapSuffix',
k_allowBlank: false
},
k_width: k_fieldWidth
}
]
},
{
k_type: 'k_container',
k_id: 'k_advancedLdapSecure',
k_items: [
{
k_type: 'k_checkbox',
k_id: 'advanced.ldapSecure',
k_isLabelHidden: true,
k_option: k_tr('Use encrypted connection', 'wlibDomainServices')
},
{
k_type: 'k_display',
k_indent: 1,
k_className: 'infoImgIcon',
k_icon: k_kerioLibraryRoot + 'img/info.png?v=8629',
k_value: k_tr('The directory server must be configured properly to support encryption.', 'wlibDomainServices')
}
]
}
] }; 
k_onChange = function(k_form, k_element) {
if (k_element.k_isValid(false)) {
k_element.k_markInvalid(false, '');
}
};
k_formCfg = {
k_useStructuredData: true,
k_restrictBy: {
k_hasAdvancedButton: k_hasAdvancedButton,
k_hasMapUserOption:  k_hasMapUserOption,
k_hasMembershipInfo: k_hasMembershipInfo,
k_hasDescription:    k_hasDescription,
k_isAuditor:         k_isAuditor,
k_serverOs:          kerio.lib.k_getSharedConstants().kerio_web_ServerOs
},
k_labelWidth: k_labelWidth,
k_onChange: k_initParams.k_onChange,
k_items: [
{
k_restrictions: {
k_hasMembershipInfo: [ true ]
},
k_type: 'k_row',
k_id: 'k_membership',
k_className: 'domainStatus',
k_items: [
{
k_type: 'k_display',
k_id: 'k_membershipInfo',
k_icon: k_kerioLibraryRoot + '../adm/img/dots.png?v=8629',
k_className: 'JoinStatusWaiting',
k_isSecure: true,
k_value: {
k_info: k_membershipStatus.JoinStatusWaiting,
k_link: ''
},
k_template: '{k_info} {k_link}',
k_onLinkClick: function(k_form) {
k_form.k_openJoinLeaveEditor(false);
}
},
{
k_restrictions: {
k_serverOs: [ 'Linux' ],
k_isAuditor: [ false ]
},
k_type: 'k_formButton',
k_id: 'k_btnJoinDomain',
k_caption: k_tr('Join Domain…', 'wlibDomainServices'),
k_isHidden: true,
k_onClick: function(k_form) {
k_form.k_openJoinLeaveEditor(true);
}
},
{
k_restrictions: {
k_serverOs: [ 'Linux' ],
k_isAuditor: [ false ]
},
k_type: 'k_formButton',
k_id: 'k_btnLeaveDomain',
k_caption: k_tr('Leave Domain…', 'wlibDomainServices'),
k_isHidden: true,
k_onClick: function(k_form) {
k_form.k_openJoinLeaveEditor(false);
}
}
] },
{
k_restrictions: {
k_hasMapUserOption: [ true ]
},
k_type: 'k_checkbox',
k_id: 'service.enabled',
k_isLabelHidden: true,
k_option: k_tr('Map user accounts and groups from a directory service', 'wlibDomainServices'),
k_onChange: function(k_form, k_element, k_isChecked) {
var k_inputDomainName;
if (k_form._k_onDisable) {
if (false === k_form._k_onDisable.apply(this, arguments)) {
k_element.k_setValue(!k_isChecked);
return;
}
}
k_form.k_setDisabled(['k_domain', 'k_account', 'k_connection', 'k_advanced', 'k_bottomRow'], !k_isChecked);
if (k_isChecked) {
k_inputDomainName = k_form.k_getItem('service.domainName');
if (k_inputDomainName && !k_inputDomainName.k_isDisabled()) {
k_inputDomainName.k_focus();
}
else {
k_form.k_getItem('service.userName').k_focus();
}
}
}
},
{
k_type: 'k_fieldset',
k_id: 'k_domain',
k_isDisabled: k_isDisabled,
k_caption: k_tr('Domain', 'wlibDomainServices'),
k_items: [
{
k_type: 'k_select',
k_id: 'service.type',
k_caption: k_tr('Directory service type:', 'wlibDomainServices'),
k_width: k_fieldWidth,
k_fieldValue: 'k_id',
k_fieldDisplay: 'k_name',
k_localData: [
{k_id: k_ACTIVE_DIRECTORY, k_name: k_tr('Microsoft® Active Directory®', 'wlibDomainServices')},
{k_id: k_APPLE_DIRECTORY,  k_name: k_tr('Apple® Open Directory', 'wlibDomainServices')},
{k_id: k_KERIO_DIRECTORY,  k_name: k_tr('Kerio Directory', 'wlibDomainServices')} ],
k_value: k_ACTIVE_DIRECTORY,
k_onChange: function(k_form, k_element, k_value) {
k_form._k_switchDomainType.apply(k_form, arguments);
}
},
{
k_id: 'service.domainName',
k_caption: k_tr('Domain name:', 'wlibDomainServices'),
k_validator: {
k_functionName: 'k_wlibDomainName',
k_allowBlank: false
},
k_isDisabled: k_hasMembershipInfo, k_width: k_fieldWidth,
k_onChange: k_onChange
},
{
k_restrictions: {
k_hasDescription: [ true ]
},
k_id: 'description',
k_validator: {
k_functionName: 'k_wlibDescription',
k_allowBlank: true
},
k_caption: k_tr('Description:', 'wlibDomainServices'),
k_width: k_fieldWidth
}
]},
{
k_type: 'k_fieldset',
k_id: 'k_account',
k_isDisabled: k_isDisabled,
k_caption: k_accountFieldsetTitles.k_readAccess,
k_items: [
{
k_id: 'service.userName',
k_caption: k_tr('Username:', 'wlibDomainServices'),
k_width: k_fieldWidth,
k_value: '',
k_maxLength: 127,
k_checkByteLength: true,
k_validator: {
k_functionName: 'k_wlibUserNameDomain',
k_allowBlank: false
}
},
{
k_id: 'service.password',
k_isPasswordField: true,
k_caption: k_tr('Password:', 'wlibDomainServices'),
k_width: k_fieldWidth,
k_value: '',
k_emptyText: 'NoPassword', k_maxLength: 110, k_checkByteLength: true,
k_onChange: k_onChange
}
] },
{
k_type: 'k_fieldset',
k_id: 'k_connection',
k_isDisabled: k_isDisabled,
k_caption: k_tr('Connection', 'wlibDomainServices'),
k_items: [
{
k_type: 'k_container',
k_id: 'k_useSpecificServers',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'service.useSpecificServers',
k_isLabelHidden: true,
k_option: k_tr('Automatically connect to the first directory server available', 'wlibDomainServices'),
k_isChecked: true,
k_value: false,

k_onChange: function(k_form, k_element, k_value) {
k_form.k_setDisabled(['k_connectionPadding'], !k_value);
}},
{
k_type: 'k_radio',
k_groupId: 'service.useSpecificServers',
k_isLabelHidden: true,
k_option: k_tr('Connect to the specified directory servers:', 'wlibDomainServices'),
k_value: true
}
]
},
{
k_type: 'k_container',
k_id: 'k_connectionPadding', k_indent: 1,
k_isDisabled: true,
k_labelWidth: k_labelWidth - kerio.lib.k_constants.k_FORM_INDENT,
k_items: [
{
k_id: 'service.primaryServer',
k_caption: k_primaryServerTitle,
k_width: k_fieldWidth,
k_value: '',
k_maxLength: 255,
k_checkByteLength: true,
k_validator: {
k_functionName: 'k_wlibServerAddress',
k_allowBlank: false
}
},
{
k_id: 'service.secondaryServer',
k_caption: k_tr('Secondary server:', 'wlibDomainServices'),
k_width: k_fieldWidth,
k_value: '',
k_maxLength: 255,
k_checkByteLength: true,
k_validator: {
k_functionName: 'k_wlibServerAddress',
k_allowBlank: true
}
}
] }
] },
k_advancedFieldsetCfg,
{
k_type: 'k_row',
k_id: 'k_bottomRow',
k_isDisabled: k_isDisabled,
k_items: [
{
k_type: 'k_formButton',
k_id: 'k_btnTestConnection',
k_caption: k_tr('Test Connection', 'wlibDomainServices'),
k_onClick: function(k_form) {
k_form.k_testConnection();
}
},
{
k_type: 'k_display',
k_id: 'k_testLoading',
k_isSecure: true,
k_value: k_tr('Testing…', 'wlibDomainServices')
+ ' <a id="k_cancelTest">'
+ k_tr('Cancel', 'wlibButtons')
+ '</a>',
k_isHidden: true,
k_onLinkClick: function(k_form) {
k_form.k_cancelConnectionTest();
}
},
{
k_type: 'k_display',
k_id: 'k_testResultOk',
k_icon: k_kerioLibraryRoot + 'img/actionResult.png?v=8629',
k_className: 'actionResultOk',
k_value: k_tr('Connection test passed.', 'wlibDomainServices'),
k_isHidden: true
},
{
k_type: 'k_display',
k_id: 'k_testResultFail',
k_icon: k_kerioLibraryRoot + 'img/actionResult.png?v=8629',
k_className: 'actionResultError',
k_isSecure: true,
k_value: k_tr('Connection test failed.', 'wlibDomainServices')
+ ' <a id="k_details">'
+ k_tr('Details…', 'wlibDomainServices')
+ '</a>',
k_isHidden: true,
k_onLinkClick: function(k_form) {
k_form.k_showTestDetails();
}
},
'->',
{
k_restrictions: {
k_hasAdvancedButton: [ true ]
},
k_type: 'k_formButton',
k_id: 'k_btnAdvanced',
k_caption: k_tr('Advanced…', 'wlibDomainServices'),
k_onClick: function(k_form) {
k_form.k_openAdvancedEditor();
}
}
]
}
]
};kerio.adm.k_widgets.K_DomainServices.superclass.constructor.call(this, k_objectName, k_formCfg);
this.k_patchAutoFill();
this.k_addReferences({
k_KERIO_DIRECTORY: k_KERIO_DIRECTORY,
k_ACTIVE_DIRECTORY: k_ACTIVE_DIRECTORY,
k_APPLE_DIRECTORY: k_APPLE_DIRECTORY,
k_APPLE_PASSWORD: k_APPLE_PASSWORD,
k_WINDOWS_NT: k_WINDOWS_NT,
k_membershipStatus: k_membershipStatus,
k_isAuditor: k_isAuditor,
k_accountFieldsetTitles: k_accountFieldsetTitles,
k_primaryServerTitle: k_primaryServerTitle,
k_serverTitle: k_serverTitle,
_k_hasMembershipInfo: k_hasMembershipInfo,
_k_hasAdvancedButton: k_hasAdvancedButton,
_k_advancedFieldsetCfg: (k_hasAdvancedButton) ? k_advancedFieldsetCfg : undefined, _k_advancedButtonParams: k_initParams.k_advancedButtonParams || {},
_k_joinDomainParams: k_initParams.k_joinDomainParams || {},
_k_onDisable: k_initParams.k_onDisable,
_k_data: {},
_k_getParams: {
query: {
conditions: [
{
comparator: k_SHARED_CONSTANTS.kerio_web_Eq,
fieldName: 'id',
value: '' }
],
limit: 1,
start: 0
}
},
_k_selectServiceType: this.k_getItem('service.type')
});
if (k_isAuditor) {
this.k_setReadOnlyAll();
this.k_getItem('k_btnTestConnection').k_forceSetWritable();
this.k_getItem('k_testResultOk').k_forceSetWritable();
this.k_getItem('k_testResultFail').k_forceSetWritable();
this.k_getItem('k_testLoading').k_forceSetWritable();
if (k_initParams.k_hasAdvancedButton) {
this.k_getItem('k_btnAdvanced').k_forceSetWritable();
}
}
}; kerio.lib.k_extend('kerio.adm.k_widgets.K_DomainServices', kerio.lib.K_Form, {

k_applyParams: function(k_params) {
k_params = k_params || {};
this._k_callback = k_params.k_callback;
this._k_callbackScope = k_params.k_parentGrid;
this._k_domainId = k_params.k_domainId;
this._k_requirePassword = (true === k_params.k_requirePassword);
this._k_isKusoAvailable = (true === k_params.k_isKusoAvailable);
this.k_setKdirVisible(k_params.k_isKusoAvailable);
this.k_reset(); this.k_setVisible(['k_testLoading', 'k_testResultOk', 'k_testResultFail'], false); this.k_setDisabled('k_btnTestConnection', false);
if (k_params.k_domainId) {
this._k_getDomainData(k_params.k_domainId);
}
else {
this._k_data = k_params.k_data || {};
if (k_params.k_data) {
this._k_setInputsForKdir(k_params.k_data);
}
this.k_setData(k_params.k_data, true);
}
this.k_getStatus();
},

_k_setInputsForKdir: function(k_data) {
var
k_domainType = k_data ? k_data.service.type : this.k_getItem('service.type').k_getValue(),
k_isKdir = this.k_KERIO_DIRECTORY === k_domainType ? true : false,
k_primaryServerField = this.k_getItem('service.primaryServer'),
k_title = k_isKdir ? this.k_serverTitle : this.k_primaryServerTitle;
if (k_primaryServerField.k_extWidget.label) {
k_primaryServerField.k_extWidget.label.dom.innerHTML = k_title;
}
else {
k_primaryServerField.k_extWidget.fieldLabel = k_title;
}
this.k_setVisible(['service.secondaryServer'], !k_isKdir); },

_k_getDomainData: function(k_domainId) {
var k_requestParams;
k_requestParams = kerio.lib.k_cloneObject(this._k_getParams);
k_requestParams.query.conditions[0].value = k_domainId;
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Domains.get',
params: k_requestParams
},
k_callback: this._k_getDomainDataCallback,
k_scope: this
});
},

_k_getDomainDataCallback: function(k_response, k_success) {
var k_data;
if (k_success && k_response.k_isOk) {
k_data = k_response.k_decoded.list;
if (k_data && 1 === k_data.length) {
this.k_setData(k_data[0]);
this._k_data = k_data[0];
}
else {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Domain Services', 'wlibDomainServices'),
k_msg: kerio.lib.k_tr('No data found for domain %1', 'wlibDomainServices', {k_args: [ this._k_domainId ]}),
k_icon: 'error'
});
}
}
},

k_getStatus: function() {
if (!this._k_hasMembershipInfo) {
return;
}
this.k_switchStatus('JoinStatusWaiting');
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Authentication.getJoinStatus'
},
k_callback: this._k_getStatusCallback,
k_scope: this,
k_requestOwner: this.k_getMainWidget() });
},

_k_getStatusCallback: function(k_response, k_success) {
if (k_success && k_response.k_isOk) {
this._k_connectedDomain = k_response.k_decoded.domainName;
this.k_switchStatus(k_response.k_decoded.status);
}
},

k_getData: function() {
var
k_oldData = this._k_data,
k_newData = kerio.lib.K_Form.prototype.k_getData.call(this, true), k_password = this.k_getItem('service.password'),
k_advanced = k_newData.advanced || {};
if (!k_password.k_isDirty()) { delete k_newData.service.password;
}
if (this.k_isType(this.k_KERIO_DIRECTORY)) {k_advanced.ldapSecure = true;
k_newData.advanced = k_advanced;
}
return kerio.lib.k_cloneObject(k_oldData, k_newData);
},

k_saveData: function() {
var
k_data = this.k_getData(),
k_domainId = this._k_domainId;
if (undefined !== k_domainId) {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: (k_domainId ? 'Domains.set' : 'Domains.create'), params: (k_domainId)
? {
domainIds: [ k_domainId ],
pattern: k_data
}
: {domains: [ k_data ]}
},
k_callback: this._k_saveDataCallback,
k_callbackParams: k_data,
k_scope: this
});
}
else if ('function' === typeof this._k_callback) {
return this._k_callback.call(this._k_callbackScope || this, k_data);
}
}, 
_k_saveDataCallback: function(k_response, k_success, k_data) {
if ('function' === typeof this._k_callback) {
this._k_callback.call(this._k_callbackScope || this, k_data, k_response, k_success);
}
},

k_isType: function(k_types) {
var
k_value = this.k_getItem('service.type').k_getValue(),
k_i, k_cnt;
if (!k_types) {
return false;
}
if (Array !== k_types.constructor) {
k_types = [ k_types ];
}
for (k_i = 0, k_cnt = k_types.length; k_i < k_cnt; k_i++) {
if (k_types[k_i] === k_value ) {
return true;
}
}
return false;
}, 
_k_switchDomainType: function(k_form, k_select, k_value) {
var
k_isOpenDirectory = this.k_isType([this.k_APPLE_DIRECTORY, this.k_APPLE_PASSWORD, this.k_KERIO_DIRECTORY]),
k_isApple = this.k_isType([this.k_APPLE_DIRECTORY, this.k_APPLE_PASSWORD]),
k_isKDir = this.k_isType(this.k_KERIO_DIRECTORY),
k_accountFieldset = k_form.k_getItem('k_account'),
k_connectionPadding,
k_domainNameField;
if (k_accountFieldset) {
k_accountFieldset.k_extWidget.setTitle(k_isKDir ? k_form.k_accountFieldsetTitles.k_fullAccess : k_form.k_accountFieldsetTitles.k_readAccess);
}
k_form.k_setVisible(['k_kerberosRealm'], k_isApple);
k_form.k_setVisible(['k_ldapSuffix'], k_isOpenDirectory);
k_form.k_setVisible(['k_useSpecificServers'], !k_isOpenDirectory);
k_form.k_setVisible(['k_advancedLdapSecure'], !k_isKDir);
k_connectionPadding = k_form.k_getItem('k_connectionPadding');
if (k_connectionPadding) {
k_connectionPadding.k_setIndent((k_isOpenDirectory  ? 0 : 1));
k_connectionPadding.k_setDisabled(this.k_isType([this.k_ACTIVE_DIRECTORY]) && !k_form.k_getItem('service.useSpecificServers').k_getValue());
this._k_setInputsForKdir();
k_form.k_setVisible(['service.secondaryServer'], !k_isKDir); }
k_domainNameField = k_form.k_getItem('service.domainName');
if (this._k_connectedDomain && k_domainNameField) {
if (this.k_ACTIVE_DIRECTORY === k_value) {
k_domainNameField.k_setValue(this._k_connectedDomain);
k_domainNameField.k_setDisabled(true);
}
else if (this.k_ACTIVE_DIRECTORY === k_select._k_prevValue) {  if (k_value === this._k_data.service.type) {          k_domainNameField.k_setValue(this._k_data.service.domainName); }
k_domainNameField.k_setDisabled(false);
}
}
},

k_switchStatus: function(k_status) {
if (!this._k_hasMembershipInfo) {
return;
}
var
k_membershipInfo = this.k_getItem('k_membershipInfo'),
k_isStatusConnected = 'JoinStatusConnected' === k_status,
k_isStatusWaiting = 'JoinStatusWaiting' === k_status,
k_membershipStatus;
if (k_isStatusConnected) {
k_membershipStatus = kerio.lib.k_tr('Member of domain %1.', 'wlibDomainServices', {k_args: [ this._k_connectedDomain ]});
}
else {
k_membershipStatus = this.k_membershipStatus[k_status];
}
k_membershipInfo.k_setValue({
k_info: k_membershipStatus,
k_link: 'JoinStatusError' !== k_status ? '' : '<a>' + kerio.lib.k_tr('Leave this domain', 'wlibDomainServices') + '</a>'
});
k_membershipInfo.k_removeClassName(['JoinStatusWaiting', 'JoinStatusConnected', 'JoinStatusDisconnected', 'JoinStatusError']);
k_membershipInfo.k_addClassName(k_status);
this.k_setDisabled('service.domainName', (this.k_isType(this.k_ACTIVE_DIRECTORY) && (k_isStatusConnected || k_isStatusWaiting)));
this.k_setVisible('k_btnJoinDomain', !k_isStatusConnected && !k_isStatusWaiting );
this.k_setVisible('k_btnLeaveDomain', k_isStatusConnected);
},

k_openAdvancedEditor: function() {
var
k_data = this.k_getData(),
k_params;
if (!this._k_advancedButtonParams.k_sourceName) {
kerio.lib.k_reportError('Internal error: undefined dialog source for Advanced editor.', 'wlibDomainServices');
return;
}
k_params = kerio.lib.k_cloneObject(this._k_advancedButtonParams, {
k_initParams: {
k_isAuditor: this.k_isAuditor,
k_advancedFieldsetCfg: this._k_advancedFieldsetCfg
},
k_params: {
k_parentForm: this,
k_data: k_data,
k_switchDomainType: this._k_switchDomainType.createDelegate(this, [], true),
k_callback: this._k_advancedEditorCallback.createDelegate(this, [], true),
k_isKusoAvailable: this._k_isKusoAvailable
}
});
kerio.lib.k_ui.k_showDialog(k_params);
},

_k_advancedEditorCallback: function(k_data) {
this._k_data = kerio.lib.k_cloneObject(this._k_data, k_data);
this.k_setData(k_data);
return true;
},

k_openJoinLeaveEditor: function(k_isJoin) {
var
k_data = this.k_getData(),
k_params;
if (!this._k_joinDomainParams.k_sourceName) {
kerio.lib.k_reportError('Internal error: undefined dialog source for Join Domain editor.', 'wlibDomainServices');
return;
}
k_isJoin = (false !== k_isJoin);
k_params = kerio.lib.k_cloneObject(this._k_joinDomainParams, {
k_objectName: (k_isJoin ? 'joinDomain' : 'leaveDomain'),
k_initParams: {
k_domainType: k_data.service.type
},
k_params: {
k_parentForm: this,
k_data: k_data
}
});
k_params.k_params.k_switchDomainType = this._k_switchDomainType.createDelegate(this, [], true);
k_params.k_params.k_callback = this._k_joinLeaveEditorCallback.createDelegate(this, [], true);
kerio.lib.k_ui.k_showDialog(k_params);
},

_k_joinLeaveEditorCallback: function(k_data) {
this._k_data = kerio.lib.k_cloneObject(this._k_data, k_data);
this.k_setData(k_data);
this.k_getStatus();
return true;
},

k_testConnection: function() {
var
k_data = this.k_getData(),
k_hostnames = [],
k_directory,
k_service;
if (!this.k_isValid()) {
return;
}
this.k_setVisible(['k_testResultOk', 'k_testResultFail'], false); this.k_setVisible(['k_testLoading'], true);
this.k_setDisabled('k_btnTestConnection'); this.k_extWidget.doLayout(); k_service = k_data.service;
if (this.k_getItem('k_useSpecificServers').k_isVisible() && false === k_service.useSpecificServers) {
k_hostnames.push('');
}
else {
k_hostnames.push(k_service.primaryServer);
if ('' !== k_service.secondaryServer.trim()) {
k_hostnames.push(k_service.secondaryServer);
}
delete k_service.primaryServer;
delete k_service.secondaryServer;
delete k_service.useSpecificServers;
}
k_directory = {
service: k_service,
advanced: k_data.advanced
};
if (undefined !== k_data.id) {
k_directory.id = k_data.id;
}
this._k_pendingTestRequest = kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Domains.testDomainController',
params: {
hostnames: k_hostnames,
directory: k_directory
}
},
k_onError: this._k_onTestConnectionErrorHandler,
k_callback: this._k_testConnectionCallback,
k_callbackParams: {
k_hostnames: k_hostnames
},
k_scope: this
});
},

k_cancelConnectionTest: function(k_kill) {
if (this._k_pendingTestRequest) {
if (false !== k_kill) {
kerio.lib.k_ajax.k_abort(this._k_pendingTestRequest);
}
this.k_setDisabled('k_btnTestConnection', false); this.k_setVisible(['k_testLoading'], false);
this._k_pendingTestRequest = null;
}
},

_k_onTestConnectionErrorHandler: function (k_response) {
if (k_response.k_decoded.error) {
return false;
}
return true;
},

_k_testConnectionCallback: function(k_response, k_success, k_params) {
this.k_cancelConnectionTest(false); if (!k_success && !k_response.k_isOk) {
this.k_extWidget.doLayout(); return;
}
this._k_testResults = k_response.k_decoded;
this._k_testResults.k_params = k_params;
if (0 === k_response.k_decoded.errors.length) {
this.k_setVisible('k_testResultOk');
}
else {
this.k_setVisible('k_testResultFail');
this.k_showTestDetails();
}
this.k_extWidget.doLayout(); },

k_showTestDetails: function() {
var
k_tr = kerio.lib.k_tr,
k_testResults = this._k_testResults,
k_errors = k_testResults.errors,
k_hostnames = k_testResults.k_params.k_hostnames,
k_isAutomatic = '' === k_hostnames[0],
k_isSecondaryTested  = 2 === k_hostnames.length,
k_testConnectionStrings = this._k_testConnectionStrings,
k_message1 = k_testConnectionStrings.k_successMsg,
k_isSecondarySuccessful = true,
k_message2 = k_message1,
k_message,
k_error,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_errors.length; k_i < k_cnt; k_i++) {
k_error =  k_errors[k_i];
if (0 === k_error.inputIndex) {
k_message1 = kerio.lib.k_ajax._k_translateErrorMessage(k_error);
}
else if (1 === k_error.inputIndex) {
k_message2 = kerio.lib.k_ajax._k_translateErrorMessage(k_error);
k_isSecondarySuccessful = false;
}
}
if (k_isAutomatic && k_isSecondarySuccessful) {
k_message = k_testConnectionStrings.k_directoryServer + ' ' + k_message1;
}
else if (!k_isSecondaryTested) {
k_message = k_testConnectionStrings.k_primaryServer + ' ' + k_message1;
}
else {
k_message = '' + '<b>' + k_testConnectionStrings.k_primaryServer + '</b>'
+ ' ' + k_message1
+ '<br><br>'
+ '<b>' + k_testConnectionStrings.k_secondaryServer + '</b>'
+ ' ' + k_message2;
}
kerio.lib.k_alert({
k_icon: 'info',
k_title: k_testConnectionStrings.k_alerTitle,
k_msg: k_message
});
},

_k_isValid: function (k_markInvalid) {
var
k_password = this.k_getItem('service.password'),
k_results;
k_results = kerio.adm.k_widgets.K_DomainServices.superclass._k_isValid.call(this, k_markInvalid);
if ((undefined === this.k_getItem('service.enabled') || this.k_getItem('service.enabled').k_getValue()) && k_password) {
if (this._k_requirePassword && k_results.k_isValid() && !k_password.k_getValue()) { k_password.k_markInvalid(true, '');
k_results.k_inc(true); k_results.k_addMethod(k_password.k_focus, [], k_password);
}
}
return k_results;
},

_k_initValidation: function () {
if (this._k_isValidationInitialized) {
return;
}
var
k_inputValidator = kerio.lib.k_inputValidator,
k_VALIDATOR_DOMAIN_ENTITY = 'kerio_web_EntityDomain';
kerio.lib.k_inputValidator.k_registerFunctions({
k_wlibDescription:     k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR_DOMAIN_ENTITY, 'Description'),
k_wlibDomainName:      k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR_DOMAIN_ENTITY, 'DomainName'),
k_wlibUserNameDomain:  k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR_DOMAIN_ENTITY, 'kerio_web_userNameDomain'),
k_wlibServerAddress:   k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR_DOMAIN_ENTITY, 'kerio_web_serverAddress'),
k_wlibKerberosRealm:   k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR_DOMAIN_ENTITY, 'kerio_web_kerberosRealm'),
k_wlibLdapSuffix:      k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR_DOMAIN_ENTITY, 'kerio_web_ldapSuffix')
});
kerio.adm.k_widgets.K_DomainServices.prototype._k_isValidationInitialized = true;
},

k_setKdirVisible: function(k_isVisible) {
this._k_selectServiceType.k_setVisibleItem(this.k_KERIO_DIRECTORY, k_isVisible);
}
}); 

kerio.adm.k_widgets.K_LiveGrid = function(k_id, k_config) {
var
k_tr = kerio.lib.k_tr,
k_filtersSearch;
if (!k_config.k_remoteData || !k_config.k_remoteData.k_jsonRpc || !k_config.k_remoteData.k_jsonRpc.method) {
kerio.lib.k_reportError('Internal error: Remote data definition required. This grid is not designed to work with local data!', 'liveGrid');
return;
}
this._k_liveCfg = {
k_pageSize: k_config.k_pageSize || 2000,
k_isSelectable: ('k_multi' === k_config.k_selectionMode || !k_config.k_selectionMode), k_isAutoLoaded: (false !== k_config.k_remoteData.k_isAutoLoaded),
k_onBeforeLoad: k_config.k_onBeforeLoad,
k_useSnapshot: k_config.k_useSnapshot,
k_emptyText: k_config.k_emptyMsg || Ext.grid.GridView.prototype.emptyText, k_emptyLoadingText: k_config.k_emptyLoadingMsg || k_tr('Loading…', 'wlibWait')
};
k_config.k_pageSize = false; k_config.k_remoteData.k_isAutoLoaded = false; k_filtersSearch = {
k_caption: k_tr('Filter:', 'liveGrid'),
k_searchBy: ['QUICKSEARCH'],
k_isSearchField: true
};
k_config.k_filters = k_config.k_filters || {};
k_config.k_filters.k_search = Ext.apply(k_filtersSearch, k_config.k_filters.k_search);
k_config.k_isScrolledPositionKept = false;
this.k_baseClass = kerio.adm.k_widgets.K_LiveGrid.superclass;
this.k_baseClass.constructor.call(this, k_id, k_config);
this._k_infoTextValue = {
k_isPaging: false,
k_isSelectable: this._k_liveCfg.k_isSelectable,
k_total: 0,
k_actualPage: 0,
k_selected: 0
};
this._k_infoText = new kerio.lib.K_DisplayField(this.k_toolbars.k_top.k_id + '_' + 'k_infoText', {
k_value: ''
});
this._k_applyInfoValue();
this.k_toolbars.k_top.k_addWidget(this._k_infoText, 0); this.k_toolbars.k_top.k_update = this._k_onSelectRows;
kerio.lib.k_registerObserver(this, this.k_toolbars.k_top, [this.k_eventTypes.k_SELECTION_CHANGED]);
this.k_setPageSize(this._k_liveCfg.k_pageSize, false);
this.k_extWidget.on('render', this._k_enablePaging, this);
this._k_extDataStore.loadRecords = this._k_dataStoreLoadCallback;
this.k_extWidget.view.onLoad = this._k_onViewLoad;
if (this._k_liveCfg.k_isAutoLoaded) {
this.k_reloadData();
}
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_LiveGrid', kerio.adm.k_widgets.K_BasicList,
{







k_setPageSize: function(k_pageSize, k_reload) {
if (0 < k_pageSize) {
if (kerio.lib.k_isSlowMachine) {
k_pageSize = Math.round(k_pageSize / 4);
}
this._k_extPagingToolbar.pageSize = k_pageSize;  this.k_pageSize = k_pageSize;                    this._k_dataStore.k_pageSize = k_pageSize;       }
this._k_forcePagingToolbar = false; if (false !== k_reload) {
this.k_reloadData();
}
},
_k_autoRefresh: null, 
k_setAutoRefreshInterval: function(k_interval, k_defer) {
var
k_hasTaskManager = this._k_autoRefresh,
k_isStarting = (0 < k_interval);
if (!k_hasTaskManager && !k_isStarting) {
return;
}
if (!k_hasTaskManager) {
this._k_autoRefresh = new kerio.lib.K_TaskRunner({k_precision: 1000});
this._k_autoRefreshId = this.k_id + '_' + 'k_autoRefresh';
}
if (k_isStarting) {
this._k_autoRefresh.k_add({
k_id: this._k_autoRefreshId,
k_interval: k_interval,
k_run: this._k_refreshNow,
k_scope: this,
k_startNow: true,
k_startDeferred: (false !== k_defer)
});
}
else {
this._k_autoRefresh.k_remove(this._k_autoRefreshId, true);
}
},

_k_refreshNow: function() {
this._k_autoRefreshPending = true; this.k_reloadData();
return false;
},

_k_createDataStore: function(k_config) {
k_config.k_pageSize = this._k_liveCfg.k_pageSize; this.k_baseClass._k_createDataStore.apply(this, arguments);
this._k_isPaging = false; },

_k_createToolbars: function(k_widgetConfig) {
this._k_isPaging = true; k_widgetConfig = this.k_baseClass._k_createToolbars.apply(this, arguments);
this._k_isPaging = false; return k_widgetConfig;
},

_k_enablePaging: function() {
this._k_isPaging = true;
},

_k_setPagingToolbarVisibility: function() {
if (this._k_forcePagingToolbar && !this._k_extPagingToolbar.el.hasClass('hiddenPaging')) {
return;
}
this.k_baseClass._k_setPagingToolbarVisibility.apply(this, arguments);
},

_k_onBeforeLoadStore: function(k_dataStore, k_options) {
if (!k_options.params.params) {
k_options.params.params = { query: {}};
}
var
k_request     = this._k_dataStore._k_baseRequestParams,
k_searchQuery = k_options.params.params.query || {}, k_conditions  = k_searchQuery.conditions || [],
k_gridView    = this.k_extWidget.view;
if (this._k_liveCfg.k_useSnapshot) {
k_options.params.refresh = false;
}
if (this._k_autoRefresh && this._k_autoRefresh.k_isDefined(this._k_autoRefreshId)) {
this._k_autoRefresh.k_suspend(this._k_autoRefreshId);
if (this._k_liveCfg.k_useSnapshot && this._k_autoRefreshPending) {
k_options.params.refresh = true;
}
}
k_searchQuery.limit = this.k_pageSize;
if (this._k_liveCfg.k_onBeforeLoad) {
this._k_liveCfg.k_onBeforeLoad.apply(this, [this, k_conditions, k_options.params, k_request]);
if (k_conditions.length) {
k_searchQuery.conditions = k_conditions;
}
}
if (k_searchQuery && k_searchQuery.conditions && !k_searchQuery.conditions.length) { delete k_searchQuery.conditions;
delete k_searchQuery.combining;
}
k_options.params.params.query = k_searchQuery;
k_gridView.emptyText = this._k_liveCfg.k_emptyLoadingText;
k_gridView.applyEmptyText();
},

_k_dataStoreLoadCallback: function(k_data, k_options, k_success) {
var
k_grid = this._kx.k_relatedWidget, k_gridView = k_grid.k_extWidget.view,
k_selectionModel = k_grid.k_extWidget.getSelectionModel(),
k_selectedRows = {},
k_rowsToSelect = [];
k_gridView.emptyText = k_grid._k_liveCfg.k_emptyText;
k_gridView.applyEmptyText();
k_selectionModel.suspendEvents(false); if (k_success) {
if (k_data.totalRecords > k_grid.k_pageSize) {
k_grid._k_forcePagingToolbar = true;
}
if (0 === k_data.records.length) {   if (0 === k_data.totalRecords) { this.constructor.prototype.loadRecords.apply(this, arguments);
}
else {
k_grid._k_selectRowsAfterLoad = k_selectedRows;
k_options.params.start = (Math.ceil(k_data.totalRecords / k_grid.k_pageSize) - 1) * k_grid.k_pageSize;
k_grid._k_dataStore.k_reloadData(k_options.params);
}
}
else {
this.constructor.prototype.loadRecords.apply(this, arguments);
}
}
else { this.constructor.prototype.loadRecords.apply(this, arguments);
}
k_grid._k_infoTextValue = {
k_isPaging: k_success && (k_data.totalRecords > k_grid.k_pageSize || k_grid._k_forcePagingToolbar),
k_isSelectable: k_grid._k_liveCfg.k_isSelectable,
k_total: (k_success && k_data.totalRecords ? k_data.totalRecords : 0),
k_actualPage: (k_success ? k_data.records.length : 0),
k_selected: k_rowsToSelect.length
};
k_grid._k_applyInfoValue();
k_selectionModel.resumeEvents();
k_grid._k_onSelectionChanged(k_selectionModel);
if (k_grid._k_autoRefresh && k_grid._k_autoRefresh.k_isDefined(k_grid._k_autoRefreshId)) {
k_grid._k_autoRefresh.k_resume(k_grid._k_autoRefreshId, true);
}
},

_k_onSelectRows: function(k_sender) {
if (k_sender.k_isInstanceOf('kerio.adm.k_widgets.K_LiveGrid') && k_sender._k_infoTextValue) {
k_sender._k_infoTextValue.k_selected = (k_sender.k_selectionStatus ? k_sender.k_selectionStatus.k_selectedRowsCount : 0);
k_sender._k_applyInfoValue();
}
},

_k_applyInfoValue: function() {
var
k_tr = kerio.lib.k_tr,
k_values = this._k_infoTextValue,
k_inBrackets = [],
k_message;
k_message = k_tr('%1 [item|items]', 'liveGrid', {k_args:[k_values.k_total], k_pluralityBy: k_values.k_total});
if (k_values.k_isPaging) {
k_inBrackets.push(k_tr('%1 on this page', 'liveGrid', {k_args: [k_values.k_actualPage]}));
}
if (k_values.k_isSelectable) { k_inBrackets.push(k_tr('%1 [selected|selected]', 'liveGrid', {k_args: [k_values.k_selected], k_pluralityBy: k_values.k_selected}));
}
if (0 < k_inBrackets.length) {
k_message += ' (' + k_inBrackets.join(', ') + ')';
}
this._k_infoText.k_setValue(k_message);
},

_k_onViewLoad: function() {
this.grid._kx.k_owner._k_autoRefreshPending = false;
}
});


kerio.adm.k_widgets.K_LiveGridDeprecated = function(k_id, k_config) {
var
k_tr = kerio.lib.k_tr,
k_toolbarCfg, k_toolbar;
if (!k_config.k_remoteData || !k_config.k_remoteData.k_jsonRpc || !k_config.k_remoteData.k_jsonRpc.method) {
kerio.lib.k_reportError('Internal error: Remote data definition required. This grid is not designed to work with local data!', 'liveGrid');
return;
}
this._k_liveCfg = {
k_pageSize: k_config.k_pageSize || 2000,
k_isSelectable: ('k_multi' === k_config.k_selectionMode || !k_config.k_selectionMode), k_isAutoLoaded: (false !== k_config.k_remoteData.k_isAutoLoaded),
k_onBeforeLoad: k_config.k_onBeforeLoad,
k_useSnapshot: k_config.k_useSnapshot,
k_emptyText: k_config.k_emptyMsg || Ext.grid.GridView.prototype.emptyText, k_emptyLoadingText: k_config.k_emptyLoadingMsg || k_tr('Loading…', 'wlibWait')
};
k_config.k_pageSize = false; k_config.k_remoteData.k_isAutoLoaded = false; k_toolbar = k_config.k_toolbars ? k_config.k_toolbars.k_top || {} : {};
Ext.applyIf(k_toolbar, {
k_search: {}
});
Ext.applyIf(k_toolbar.k_search, {
k_caption: k_tr('Filter:', 'liveGrid'),
k_searchBy: ['QUICKSEARCH'],
k_isSearchField: true
});
k_toolbarCfg = {
k_type: 'k_search',
k_config: {
k_search: k_toolbar.k_search
}
};
if (k_config.k_toolbars && (k_config.k_toolbars.k_bottom || k_config.k_toolbars.k_right)) {
k_config.k_toolbars.k_top = k_toolbarCfg;
}
else {
k_config.k_toolbars = {
k_top: k_toolbarCfg,
k_bottom: { k_type: 'k_none' }, k_right:  { k_type: 'k_none' }
};
}
this.k_baseClass = kerio.adm.k_widgets.K_LiveGridDeprecated.superclass;
this.k_baseClass.constructor.call(this, k_id, k_config);
this._k_infoTextValue = {
k_isPaging: false,
k_isSelectable: this._k_liveCfg.k_isSelectable,
k_total: 0,
k_actualPage: 0,
k_selected: 0
};
this._k_infoText = new kerio.lib.K_DisplayField(this.k_toolbars.k_top.k_id + '_' + 'k_infoText', {
k_value: ''
});
this._k_applyInfoValue();
this.k_toolbars.k_top.k_addWidget(this._k_infoText, 0); this.k_toolbars.k_top.k_update = this._k_onSelectRows;
kerio.lib.k_registerObserver(this, this.k_toolbars.k_top, [this.k_eventTypes.k_SELECTION_CHANGED]);
this.k_setPageSize(this._k_liveCfg.k_pageSize, false);
this.k_extWidget.on('render', this._k_enablePaging, this);
this._k_extDataStore.loadRecords = this._k_dataStoreLoadCallback;
this.k_extWidget.view.onLoad = this._k_onViewLoad;
if (this._k_liveCfg.k_isAutoLoaded) {
this.k_reloadData();
}
}; kerio.lib.k_extend('kerio.adm.k_widgets.K_LiveGridDeprecated', kerio.adm.k_widgets.K_GridWithToolbar,
{









k_setPageSize: function(k_pageSize, k_reload) {
if (0 < k_pageSize) {
if (kerio.lib.k_isSlowMachine) {
k_pageSize = Math.round(k_pageSize / 4);
}
this._k_extPagingToolbar.pageSize = k_pageSize;  this.k_pageSize = k_pageSize;                    this._k_dataStore.k_pageSize = k_pageSize;       }
this._k_forcePagingToolbar = false; if (false !== k_reload) {
this.k_reloadData();
}
},
_k_autoRefresh: null, 
k_setAutoRefreshInterval: function(k_interval, k_defer) {
var
k_hasTaskManager = this._k_autoRefresh,
k_isStarting = (0 < k_interval);
if (!k_hasTaskManager && !k_isStarting) {
return;
}
if (!k_hasTaskManager) {
this._k_autoRefresh = new kerio.lib.K_TaskRunner({k_precision: 1000});
this._k_autoRefreshId = this.k_id + '_' + 'k_autoRefresh';
}
if (k_isStarting) {
this._k_autoRefresh.k_add({
k_id: this._k_autoRefreshId,
k_interval: k_interval,
k_run: this._k_refreshNow,
k_scope: this,
k_startNow: true,
k_startDeferred: (false !== k_defer)
});
}
else {
this._k_autoRefresh.k_remove(this._k_autoRefreshId, true);
}
},

_k_refreshNow: function() {
this._k_autoRefreshPending = true; this.k_reloadData();
return false;
},

_k_createDataStore: function(k_config) {
k_config.k_pageSize = this._k_liveCfg.k_pageSize; this.k_baseClass._k_createDataStore.apply(this, arguments);
this._k_isPaging = false; },

_k_createToolbars: function(k_widgetConfig) {
this._k_isPaging = true; k_widgetConfig = this.k_baseClass._k_createToolbars.apply(this, arguments);
this._k_isPaging = false; return k_widgetConfig;
},

_k_enablePaging: function() {
this._k_isPaging = true;
},

_k_setPagingToolbarVisibility: function() {
if (this._k_forcePagingToolbar && !this._k_extPagingToolbar.el.hasClass('hiddenPaging')) {
return;
}
this.k_baseClass._k_setPagingToolbarVisibility.apply(this, arguments);
},

_k_onBeforeLoadStore: function(k_dataStore, k_options) {
if (!k_options.params.params) {
k_options.params.params = { query: {}};
}
var
k_request     = this._k_dataStore._k_baseRequestParams,
k_searchQuery = k_options.params.params.query || {}, k_conditions  = k_searchQuery.conditions || [],
k_gridView    = this.k_extWidget.view;
if (this._k_liveCfg.k_useSnapshot) {
k_options.params.refresh = false;
}
if (this._k_autoRefresh && this._k_autoRefresh.k_isDefined(this._k_autoRefreshId)) {
this._k_autoRefresh.k_suspend(this._k_autoRefreshId);
if (this._k_liveCfg.k_useSnapshot && this._k_autoRefreshPending) {
k_options.params.refresh = true;
}
}
k_searchQuery.limit = this.k_pageSize;
if (this._k_liveCfg.k_onBeforeLoad) {
this._k_liveCfg.k_onBeforeLoad.apply(this, [this, k_conditions, k_options.params, k_request]);
if (k_conditions.length) {
k_searchQuery.conditions = k_conditions;
}
}
if (k_searchQuery && k_searchQuery.conditions && !k_searchQuery.conditions.length) { delete k_searchQuery.conditions;
delete k_searchQuery.combining;
}
k_options.params.params.query = k_searchQuery;
k_gridView.emptyText = this._k_liveCfg.k_emptyLoadingText;
k_gridView.applyEmptyText();
},

_k_dataStoreLoadCallback: function(k_data, k_options, k_success) {
var
k_grid = this._kx.k_relatedWidget, k_gridView = k_grid.k_extWidget.view,
k_selectionModel = k_grid.k_extWidget.getSelectionModel(),
k_selectedRows = {},
k_rowsToSelect = [];
k_gridView.emptyText = k_grid._k_liveCfg.k_emptyText;
k_gridView.applyEmptyText();
k_selectionModel.suspendEvents(false); if (k_success) {
if (k_data.totalRecords > k_grid.k_pageSize) {
k_grid._k_forcePagingToolbar = true;
}
if (0 === k_data.records.length) {   if (0 === k_data.totalRecords) { this.constructor.prototype.loadRecords.apply(this, arguments);
}
else {
k_grid._k_selectRowsAfterLoad = k_selectedRows;
k_options.params.start = (Math.ceil(k_data.totalRecords / k_grid.k_pageSize) - 1) * k_grid.k_pageSize;
k_grid._k_dataStore.k_reloadData(k_options.params);
}
}
else {
this.constructor.prototype.loadRecords.apply(this, arguments);
}
}
else { this.constructor.prototype.loadRecords.apply(this, arguments);
}
k_grid._k_infoTextValue = {
k_isPaging: k_success && (k_data.totalRecords > k_grid.k_pageSize || k_grid._k_forcePagingToolbar),
k_isSelectable: k_grid._k_liveCfg.k_isSelectable,
k_total: (k_success ? k_data.totalRecords : 0),
k_actualPage: (k_success ? k_data.records.length : 0),
k_selected: k_rowsToSelect.length
};
k_grid._k_applyInfoValue();
k_selectionModel.resumeEvents();
k_grid._k_onSelectionChanged(k_selectionModel);
if (k_grid._k_autoRefresh && k_grid._k_autoRefresh.k_isDefined(k_grid._k_autoRefreshId)) {
k_grid._k_autoRefresh.k_resume(k_grid._k_autoRefreshId, true);
}
},

_k_onSelectRows: function(k_sender) {
if (k_sender.k_isInstanceOf('kerio.adm.k_widgets.K_LiveGridDeprecated') && k_sender._k_infoTextValue) {
k_sender._k_infoTextValue.k_selected = (k_sender.k_selectionStatus ? k_sender.k_selectionStatus.k_selectedRowsCount : 0);
k_sender._k_applyInfoValue();
}
},

_k_applyInfoValue: function() {
var
k_tr = kerio.lib.k_tr,
k_values = this._k_infoTextValue,
k_inBrackets = [],
k_message;
k_message = k_tr('%1 [item|items]', 'liveGrid', {k_args:[k_values.k_total], k_pluralityBy: k_values.k_total});
if (k_values.k_isPaging) {
k_inBrackets.push(k_tr('%1 on this page', 'liveGrid', {k_args: [k_values.k_actualPage]}));
}
if (k_values.k_isSelectable) { k_inBrackets.push(k_tr('%1 [selected|selected]', 'liveGrid', {k_args: [k_values.k_selected], k_pluralityBy: k_values.k_selected}));
}
if (0 < k_inBrackets.length) {
k_message += ' (' + k_inBrackets.join(', ') + ')';
}
this._k_infoText.k_setValue(k_message);
},

_k_onViewLoad: function() {
this.grid._kx.k_owner._k_autoRefreshPending = false;
}
});

kerio.lib.k_inputValidator.k_registerFunctions({
k_wlibDomainValidator: {

k_function: function(k_value){
var
k_lib = kerio.lib,
k_domainParts = k_value.split(':'),
k_inputValidator = k_lib.k_inputValidator,
k_domainNameValidator = k_inputValidator.k_getRegExpValidator(k_lib.k_getSharedConstants('kerio_web_DomainNameRegExp')),
k_isIpAddress = k_inputValidator.k_getRegExpValidator(k_lib.k_getSharedConstants('kerio_web_IpAddressRegExp')),
k_domainPort = parseInt(k_domainParts[1], 10),
k_domainName = k_domainParts[0],
k_result = false;
if (3 > k_domainParts.length) {
k_result = k_domainNameValidator.call(this, k_domainName) || k_isIpAddress.call(this, k_domainName);
if (true === k_result && 2 === k_domainParts.length) {
if (!k_domainPort || k_domainPort < 1 || k_domainPort > 65535) {
k_result = false;
}
}
}
return k_result;
}
}
});

kerio.adm.k_widgets.K_KerioDirectory = function(k_objectName, k_config) {
k_config = k_config || {};
var
k_tr = kerio.lib.k_tr,
k_inputWidth = k_config.k_inputWidth || 170,
k_testConnectionToolbar;
k_testConnectionToolbar = new kerio.adm.k_widgets.K_TestConnection(k_objectName + '_' + 'k_testConnection', {
k_remoteData: {
k_jsonRpc: {
method: 'UnitySignOn.testConnection'
}
},
k_getJsonRpcParams: this._k_getJsonRpcParams
});
kerio.adm.k_widgets.K_KerioDirectory.superclass.constructor.call(this, k_objectName, {
k_items: [{
k_type: 'k_checkbox',
k_id: 'isEnabled',
k_option: k_tr('Authenticate users via Kerio Unity Sign-On', 'wlibUnitySignOn'),
k_isReadOnly: k_config.k_isReadOnly,
k_isLabelHidden: true,

k_onChange: function (k_form, k_item, k_checked) {
k_form.k_setDisabled('k_ssoContainer', !k_checked);
k_form.k_testConnectionToolbar.k_setDisabled(!k_checked);
}
}, {
k_type: 'k_fieldset',
k_id: 'k_ssoContainer',
k_caption: k_tr('Kerio Directory Server', 'wlibUnitySignOn'),
k_indent: 1,
k_labelWidth: 135,
k_height: 100,
k_isDisabled: true,
k_isReadOnly: k_config.k_isReadOnly,
k_items: [{
k_caption: k_tr('Hostname:', 'wlibUnitySignOn'),
k_maxLength: 73, k_id: 'hostName',
k_width: k_inputWidth,
k_validator: {
k_functionName: 'k_wlibDomainValidator',
k_allowBlank: false
}
}, {
k_caption: k_tr('Username:', 'wlibUnitySignOn'),
k_id: 'userName',
k_maxLength: 127,
k_width: k_inputWidth,
k_validator: {
k_allowBlank: false
}
}, {
k_caption: k_tr('Password:', 'wlibUnitySignOn'),
k_id: 'password',
k_width: k_inputWidth,
k_isPasswordField: true
}]
}, {
k_height: 40,
k_type: 'k_container',
k_content: k_testConnectionToolbar
}]
});
this.k_patchAutoFill();
k_testConnectionToolbar.k_setDisabled();	this.k_addReferences({
k_testConnectionToolbar: k_testConnectionToolbar
});
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_KerioDirectory', kerio.lib.K_Form, {

k_setData: function (k_data) {
kerio.adm.k_widgets.K_KerioDirectory.superclass.k_setData.apply(this, arguments);
if (true === k_data.isEnabled && '' !== k_data.userName) {
this.k_getItem('password').k_setEmptyText('**********');
}
},

_k_getJsonRpcParams: function (k_form) {
var
k_data = k_form.k_getData(),
k_params;
k_params = {
hostNames: [k_data.hostName],
credentials: {
userName: k_data.userName
}
};
if (k_form.k_getItem('password').k_isDirty()) {
k_params.credentials.password = k_data.password;
}
return k_params;
}
});

kerio.adm.k_widgets.K_TestConnection = function(k_objectName, k_config) {
k_config = k_config || {};
var
k_iconPath = kerio.lib.k_kerioLibraryRoot + 'img/actionResult.png?v=8629',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_displayTesting,
k_displaySuccess,
k_displayFailure;
k_displayTesting = new k_lib.K_DisplayField(k_objectName + '_' + 'k_testing', {
k_value: k_tr('Testing…', 'wlibDomainServices') + ' <a id="k_cancelTest">' + k_tr('Cancel', 'wlibButtons') + '</a>',
k_id: 'k_testing',
k_isSecure: true,
k_isHidden: true,

k_onLinkClick: function(k_toolbar) {
k_toolbar._k_cancelConnectionTest();
}
});
k_displaySuccess = new k_lib.K_DisplayField(k_objectName + '_' + 'k_testResultOk', {
k_id: 'k_testResultOk',
k_icon: k_iconPath,
k_className: 'actionResultOk',
k_value: k_tr('Connection test passed.', 'wlibDomainServices'),
k_isHidden: true
});
k_displayFailure = new k_lib.K_DisplayField(k_objectName + '_' + 'k_testResultFail', {
k_id: 'k_testResultFail',
k_icon: k_iconPath,
k_className: 'actionResultError',
k_value: k_tr('Connection test failed.', 'wlibDomainServices')	+ ' <a id="k_details">'	+ k_tr('Details…', 'wlibUnitySignOn')	+ '</a>',
k_isSecure: true,
k_isHidden: true,

k_onLinkClick: function(k_toolbar) {
k_toolbar._k_showTestDetails();
}
});
kerio.adm.k_widgets.K_TestConnection.superclass.constructor.call(this, k_objectName, {
k_items: [{
k_id: 'k_btnTestConnection',
k_caption: k_tr('Test Connection', 'wlibDomainServices'),

k_onClick: function(k_toolbar) {
k_toolbar._k_testConnection();
}
}, {
k_content: k_displayTesting
}, {
k_content: k_displaySuccess
}, {
k_content: k_displayFailure
}]
});
this.k_addReferences({
k_config: k_config
});
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_TestConnection', kerio.lib.K_Toolbar, {



_k_testConnection: function() {
var
k_form = this.k_getForm(),
k_remoteData = this.k_config.k_remoteData;
if (!k_form.k_isValid()) {
return;
}
this._k_pendingTestRequest = kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: k_remoteData.k_jsonRpc.method,
params: this._k_getJsonRpcParams()
},

k_onError: this._k_onRequestError,
k_callback: this._k_testConnectionCallback,
k_scope: this
});
this.k_showItem('k_testing');
this.k_showItem(['k_testResultOk', 'k_testResultFail'], false);
this.k_getItem('k_btnTestConnection').k_setDisabled();
},

_k_onRequestError: function (k_response) {
if (false === k_response.k_isOk) {
this._k_resetToolbar();
return false;
}
return true;
},

_k_resetToolbar: function() {
this.k_getItem('k_btnTestConnection').k_setDisabled(false);
this.k_showItem(['k_testing', 'k_testResultOk', 'k_testResultFail'], false);
},

_k_cancelConnectionTest: function() {
if (this._k_pendingTestRequest) {
kerio.lib.k_ajax.k_abort(this._k_pendingTestRequest);
this._k_pendingTestRequest = null;
this._k_resetToolbar();
}
},

_k_testConnectionCallback: function(k_response) {
if (k_response.k_isOk) {
var	k_error = k_response.k_decoded.errors;
if (0 === k_error.length) {
this.k_showItem(['k_testing', 'k_testResultFail'], false);
this.k_showItem('k_testResultOk');
}
else {
this.k_showItem(['k_testing', 'k_testResultOk'], false);
this.k_showItem('k_testResultFail');
this._k_errorMsg = kerio.lib.k_ajax._k_translateErrorMessage(k_error[0]);
this._k_showTestDetails();
}
this.k_getItem('k_btnTestConnection').k_setDisabled(false);
}
else {
this._k_resetToolbar();
}
},

k_getForm: function () {
return this.k_parentWidget.k_form;
},

_k_getJsonRpcParams: function () {
if (!this.k_config.k_getJsonRpcParams) {
kerio.lib.k_reportError('K_TestConnection: Method k_getJsonRpcParams has to be implemented!');
return null;
}
return this.k_config.k_getJsonRpcParams.call(this, this.k_getForm(), this);
},

_k_showTestDetails: function() {
kerio.lib.k_alert({
k_icon: 'info',
k_msg: this._k_errorMsg
});
}
});

kerio.adm.k_widgets.K_OuterWebPage = function(k_id, k_config) {
this.k_id = this._k_generateToken(k_id);
this._k_serializeData = k_config.k_serializeData;
this._k_callback = {
k_fn: k_config.k_callback,
k_scope: k_config.k_scope
}
this.k_outerWindow = kerio.lib.k_openWindow(this._k_composeUrl(k_config));
kerio.lib.k_registerWidget(this, this.k_id);
};
kerio.adm.k_widgets.K_OuterWebPage.prototype = {

_k_callbackUrl: (function () {
var k_path = kerio.lib.k_kerioLibraryRoot;  if (0 !== k_path.indexOf('http')) {
k_path = document.location.protocol + '//' + document.location.host + kerio.lib.k_kerioLibraryRoot;
}
k_path = kerio.lib._k_normalizePath(k_path + '../adm/outerWebPageCallback.html', true);
return k_path;
}()),

_k_composeUrl: function(k_config) {
var
k_url = k_config.k_url,
k_data = k_config.k_data,
k_language = kerio.lib.k_translation.k_currentLanguage || kerio.lib.k_engineConstants.k_CURRENT_LANGUAGE || 'en',
k_prop;
k_url += '?adminUrl=' + encodeURIComponent(this._k_callbackUrl) + '&token=' + this.k_id + '&language=' + k_language;
if (this._k_serializeData) {
k_url += '&data=' + encodeURIComponent(Ext.encode(k_data));
}
else {
for (k_prop in k_data) {
if (k_data.hasOwnProperty(k_prop)) {
k_url += '&' + k_prop + '=' + encodeURIComponent(k_data[k_prop]);
}
}
}
return k_url;
},

k_fireCallback: function(k_data) {
if (this._k_callback.k_fn) {
delete k_data.adminUrl;
delete k_data.token;
this._k_callback.k_fn.call(this._k_callback.k_scope || window, k_data, this);
}
},

_k_generateToken: function(k_id) {
return k_id + '@' + new Date().valueOf();
},

k_destroy: function() {
this.k_extWidget = {};  kerio.lib.k_unregisterWidget(this.k_id);
},

k_focus: function() {
if (this.k_outerWindow.opener) {
this.k_outerWindow.focus();  return true;
}
return false;
}
}

kerio.adm.k_widgets.K_SupportWeb = {
_k_technicalSupportUrl: 'https://support.kerio.com/kerio_api/portal/',
_k_outerWebPages: [],

k_open: function(k_maskedWidget) {
if (k_maskedWidget) {
kerio.lib.k_maskWidget(k_maskedWidget);
}
kerio.lib.k_ajax.k_request({
k_jsonRpc: {method: 'TechnicalSupport.getInfo'},
k_callback: this._k_getInfoCallback,
k_callbackParams: {k_maskedWidget: k_maskedWidget},
k_onError: this._k_onError,
k_scope: this
});
},

_k_getInfoCallback: function(k_response, k_success, k_callbackParams) {
var	k_data = k_response.k_decoded;
if (!k_response.k_isOk) {
return;
}
if (k_callbackParams.k_maskedWidget) {
kerio.lib.k_unmaskWidget(k_callbackParams.k_maskedWidget);
}
this._k_outerWebPages.push({
k_widget: new kerio.adm.k_widgets.K_OuterWebPage('k_reportProblem', {
k_url: this._k_technicalSupportUrl,
k_data: k_data,
k_serializeData: true,
k_callback: this._k_outerWebPageCallback,
k_scope: this
}),
k_timestamp: new Date()
});
},

_k_outerWebPageCallback: function(k_data, k_outerWebPage) {
k_data = decodeURIComponent(k_data.data);
k_data = Ext.decode(k_data);
if (1 === k_data.addSystemInfo) {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'TechnicalSupport.addSystemInfoToTicket',
params: {
ticketId: k_data.ticketId,
email: k_data.email
}
}
});
}
this._k_destroyOuterWebPage(k_outerWebPage);
},

_k_destroyOuterWebPage: function(k_outerWebPage) {
var
k_list = this._k_outerWebPages,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_list.length; k_i < k_cnt; k_i++) {
if (k_list[k_i].k_widget === k_outerWebPage) {
k_outerWebPage.k_destroy();
k_list.splice(k_i ,1);
break;
}
}
},

_k_garbageCollector: function() {
},

_k_onError: function(k_response, k_success, k_callbackParams) {
if (k_response.k_decoded.error.code === kerio.lib.k_ajax.k_EXPIRED_SESSION_ERROR_CODE) {
return false;
}
k_response = {
k_isOk: true,
k_decoded: {
userInfo: {
name: '',
email: ''
},
productInfo: {
productVersion: '',
productName: '',
operatingSystem: '',
licenseNumber: ''
},
systemInfo: {
files: [],
description: ''
},
isUploadServerAvailable: true  }
}
this._k_getInfoCallback(k_response, true, k_callbackParams);
return true;  }
};


kerio.adm.k_widgets.K_Dashboard = function(k_id, k_config) {
var
k_localNamespace = k_id + '_',
k_dashboardCfg,
k_toolbar, k_toolbarCfg,
k_defaultSettings,
k_tasks,
k_tiles;
k_tiles = k_config.k_tiles;
k_defaultSettings = k_config.k_defaultSettings;
k_toolbarCfg = this._k_createToolbar(k_tiles, k_config.k_toolbarButtons);
k_toolbar = new kerio.lib.K_Toolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
k_dashboardCfg = {
bodyCssClass: 'dashboard loadingIndicator',
k_toolbars: {
k_bottom: k_toolbar
}
};
if (k_config.k_statusbar) {
k_dashboardCfg.k_statusbar = new kerio.lib.K_Statusbar(k_localNamespace + 'k_statusbar', k_config.k_statusbar);
}
kerio.adm.k_widgets.K_Dashboard.superclass.constructor.call(this, k_id, k_dashboardCfg);
k_tasks = new kerio.lib.K_TaskRunner({ k_precision: 333});
this.k_addReferences({
_k_settingsRestored: false,
_k_tasks: k_tasks,
_k_activeTaskIdList: [],
_k_widgetLibrary: [],
_k_defaultSettings: k_defaultSettings,
_k_toolbar: k_toolbar,
_k_onAfterRender: k_config.k_onAfterRender,
_k_isTextSelected: false,
_k_timeTextSelectionFinished: 0,
_k_isInitLoading: true,
_k_cntTilesTotal: 0,
_k_cntTilesLoaded: 0,
_k_cntTilesRendered: 0
});
this._k_createLibrary(k_tiles);
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_Dashboard', kerio.lib._K_ToolbarContainer,
{
k_DEFAULT_REFRESH_TIMEOUT:              20,  k_TEXT_SELECTION_MILIS_ITERATION:     5000,  k_TEXT_SELECTION_MILIS_TO_CLEAR:  4 * 5000,  k_MARGIN_TOP: 60,  k_PADDING_TOP: 65, _k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_isIPadCompatible = kerio.lib.k_isIPadCompatible,
k_columnWidth = k_isIPadCompatible ? 1.0 : 0.5,
k_columnStyle = 'padding-bottom: 30px;',
k_extWidget;
k_adaptedConfig.layout = 'column';
k_adaptedConfig.items = [
{columnWidth: k_columnWidth, style: k_isIPadCompatible ? '' : k_columnStyle},
{columnWidth: k_columnWidth, style: k_columnStyle}
];
k_extWidget = new Ext.Panel(k_adaptedConfig);
k_extWidget.initEvents = function() {
Ext.Panel.prototype.initEvents.call(this);
var
k_dashboard = this._kx.k_owner;
k_dashboard._k_allowDragDrop();
k_dashboard._k_setHandlers();
};
return k_extWidget;
},
_k_allowDragDrop: function() {
var
k_dropZone;
k_dropZone = new Ext.dd.DropZone(this.k_extWidget.bwrap.dom, {
notifyOver: function(k_dragSource, k_event, k_data) {
var
k_dashboard = this._kx.k_owner,
k_dasboardScrollTop = k_dashboard.k_extWidget.body.getScroll(),
k_cursorPosition = k_event.getXY(),
k_cursorLeft = k_cursorPosition[0],
k_cursorTop = k_cursorPosition[1] + k_dasboardScrollTop.top,
k_proxy = k_dragSource.getProxy(),
k_proxyDom,
k_columnIndex,
k_column,
k_columnItems,
k_visibleItem,
k_visibleItemDom,
k_indexOffset;
k_columnIndex = k_dashboard._k_getColumnFromPosition(k_cursorLeft);
k_column = k_dashboard._k_getColumn(k_columnIndex);
k_columnItems = k_column.k_items;
if (!k_columnItems || 0 === k_columnItems.length) {
k_proxy.moveProxy(k_column.k_extWidget.body.dom, null);
return this.dropAllowed;
}
if (this.k_PADDING_TOP > k_cursorTop) {
k_proxyDom = k_proxy.getProxy().dom;
if (k_column.k_extWidget.body.dom === k_proxyDom.parentNode && null === k_proxyDom.previousSibling) {
return this.dropAllowed;
}
k_proxy.moveProxy(k_column.k_extWidget.body.dom, k_column.k_extWidget.body.dom.childNodes[0]);
k_event.stopEvent();
return this.dropAllowed;
}
k_indexOffset = 1;
if (k_columnItems[k_columnItems.length - 1] === k_data.panel) {
if (2 <= k_columnItems.length) {
k_indexOffset = 2;
}
}
k_visibleItem = k_columnItems[k_columnItems.length - k_indexOffset];
k_visibleItemDom = k_visibleItem.el.dom;
if (0 < k_visibleItemDom.offsetTop && ((k_visibleItemDom.offsetTop + k_visibleItemDom.offsetHeight) < k_cursorTop)) {
k_proxy.moveProxy(k_column.k_extWidget.body.dom, null);
k_event.stopEvent();
return this.dropAllowed;
}
return this.dropAllowed;
},
notifyDrop: function(k_dragSource, k_event, k_data) {
var
k_dashboard = this._kx.k_owner,
k_extWidget = k_data.panel,
k_cursorPosition = k_event.getXY(),
k_cursorLeft = k_cursorPosition[0],
k_columnIndex,
k_proxy,
k_proxyDom;
k_columnIndex = k_dashboard._k_getColumnFromPosition(k_cursorLeft);
k_proxy = k_dragSource.getProxy();
k_proxyDom = k_proxy.getProxy().dom;
if (null === k_proxyDom.nextSibling) {
k_dashboard.k_dropTile(k_extWidget, k_columnIndex);
}
else {
k_dashboard.k_dropTileBefore(k_extWidget, Ext.getCmp(k_proxyDom.nextSibling.id));
}
k_extWidget._kx.k_owner._k_onAfterDrop();
return true;
}
}); Ext.dd.ScrollManager.register(this.k_extWidget.body);
kerio.lib._k_addKerioProperty(k_dropZone, {
k_owner: this
});
}, _k_setHandlers: function() {
this.k_extWidget.el.on('contextmenu', this._k_showContextMenu, this);
},
_k_showContextMenu: function(k_extEvent) {
this._k_toolbar.k_sharedMenu.k_extWidget.showAt(k_extEvent.getXY());
},

k_applyParams: function() {
var
k_userSettings;
this._k_isInitLoading = true;
if (false === this._k_settingsRestored) {
k_userSettings = kerio.lib.k_getSettings('dashboard');
if (k_userSettings) {
this._k_restoreUserSettings(k_userSettings);
}
else {
this._k_applyDefaultSettings();
}
this._k_settingsRestored = true;
}
this.k_extWidget.doLayout();
kerio.lib.k_unmaskWidget(kerio.lib.k_getViewport());
if (0 === this._k_cntTilesTotal) {
this._k_initLayout();
this._k_finishInitialization();
}
},
k_addLibraryTile: function(k_tileCfg, k_columnIndex, k_avoidChangeSettings) {
var
k_type = k_tileCfg.type,
k_libraryItem = this._k_widgetLibrary[k_type],
k_tile;
if (!k_libraryItem) {
return;
}
k_libraryItem.k_dashboard = this;
if (!k_libraryItem.k_cntInstanctes) {
k_libraryItem.k_cntInstanctes = 0;
}
if (k_libraryItem.k_isSingleton) {
if (1 === k_libraryItem.k_cntInstanctes) {
return;
}
this._k_enableToolbarItem(k_type, false);
}
k_libraryItem.k_cntInstanctes++;
if (k_tileCfg.custom) {
k_libraryItem.k_userSettings = k_tileCfg.custom;
}
else {
delete k_libraryItem.k_userSettings; if (k_tileCfg.k_userSettings) {
delete k_tileCfg.k_userSettings;
}
}
k_tile = new kerio.adm.k_widgets.K_DashboardTile(k_type + '_' + kerio.lib.k_getGeneratedId(), k_libraryItem);
this.k_addTile(k_tile, k_columnIndex);
if (true !== k_avoidChangeSettings) {
this._k_storeUserSettings();
}
this._k_cntTilesTotal++;
}, _k_restoreLibraryItem: function(k_type) {
var
k_libraryItem = this._k_widgetLibrary[k_type];
if (k_libraryItem && k_libraryItem.k_isSingleton && 1 === k_libraryItem.k_cntInstanctes) {
this._k_enableToolbarItem(k_type, true);
}
k_libraryItem.k_cntInstanctes--;
},

k_addTile: function(k_tile, k_columnIndex) {
var
k_column = this._k_getColumn(k_columnIndex);
k_column.k_extWidget.add(k_tile.k_extWidget);
this.k_extWidget.doLayout();
},

k_removeTile: function(k_tile) {
var
k_columnIndex, k_cntColumns,
k_column;
if (undefined !== k_tile.k_autorefreshTaskId) {
this.k_removeTask(k_tile.k_autorefreshTaskId);
}
for (k_columnIndex = 0, k_cntColumns = this._k_getColumnCount(); k_columnIndex < k_cntColumns; k_columnIndex++) {
k_column = this._k_getColumn(k_columnIndex);
k_column.k_extWidget.remove(k_tile.k_extWidget, false); }
this._k_storeUserSettings();
this._k_restoreLibraryItem(k_tile.k_type);
},

_k_getColumnFromPosition: function(k_left) {
var
k_columnIndex, k_cnt,
k_column,
k_box;
for (k_columnIndex = 0, k_cnt = this._k_getColumnCount(); k_columnIndex < k_cnt; k_columnIndex++) {
k_column = this._k_getColumn(k_columnIndex);
k_box = k_column.k_extWidget.getBox();
if (k_left < (k_box.x + k_box.width)) {
return k_columnIndex;
}
}
k_columnIndex--;
return k_columnIndex;
},

k_dropTile: function(k_extTile, k_columnIndex) {
this.k_addTile(k_extTile._kx.k_owner, k_columnIndex);
this._k_updateDomInColumn(true, k_extTile.ownerCt, k_extTile);
this._k_onAfterDropTile(k_extTile);
},

k_dropTileAfter: function(k_extDroppedTile, k_extTargetTile) {
var
k_extTargetColumn,
k_tileIndex;
k_extTargetColumn = k_extTargetTile.ownerCt;
k_tileIndex = k_extTargetColumn.items.indexOf(k_extTargetTile);
this.k_dropTileBefore(k_extDroppedTile, k_extTargetTile, k_tileIndex + 1);
},

k_dropTileBefore: function(k_extDroppedTile, k_extTargetTile, k_tileIndex) {
var
k_insertAfter = undefined !== k_tileIndex,
k_extSourceColumn,
k_extTargetColumn,
k_column;
if (k_extDroppedTile === k_extTargetTile) {
return;
}
k_extSourceColumn = k_extDroppedTile.ownerCt;
k_extTargetColumn = k_extTargetTile.ownerCt;
if (!k_insertAfter) {
k_tileIndex = k_extTargetColumn.items.indexOf(k_extTargetTile);
}
if (-1 !== k_tileIndex) {
k_extSourceColumn.remove(k_extDroppedTile, false);
k_extTargetColumn.insert(k_tileIndex, k_extDroppedTile);
if (k_extSourceColumn === k_extTargetColumn) {
this._k_updateDomInColumn(false, k_extSourceColumn, k_extDroppedTile, k_extTargetTile, k_insertAfter);
}
}
else {
k_column = this._k_getColumn(this._k_getColumnCount() - 1);
k_column.k_extWidget.add(k_extDroppedTile);
}
this._k_onAfterDropTile(k_extDroppedTile);
},
_k_onAfterDropTile: function (k_extTile) {
this.k_extWidget.doLayout();
this._k_syncSize.defer(1, this.k_extWidget, [k_extTile]);
this._k_storeUserSettings();
},
_k_syncSize: function (k_extTile) {
this.syncSize();
k_extTile.el.scrollIntoView.defer(1, k_extTile.el, [this.body.id]);
},

_k_updateDomInColumn: function(k_append, k_extColumn, k_extSourceTile, k_extTargetTile, k_insertAfter) {
var
k_targetDom,
k_removedNode;
k_removedNode = k_extColumn.body.dom.removeChild(k_extSourceTile.el.dom);
if (true === k_append || (true === k_insertAfter && null === k_extTargetTile.el.dom.nextSibling)) {
k_extColumn.body.dom.appendChild(k_removedNode);
}
else {
k_targetDom = k_extTargetTile.el.dom;
if (true === k_insertAfter) {
k_targetDom = k_targetDom.nextSibling;
}
k_extColumn.body.dom.insertBefore(k_removedNode, k_targetDom);
}
},

_k_createLibrary: function(k_tiles) {
var
k_i, k_cnt,
k_tileCfg;
for (k_i = 0, k_cnt = k_tiles.length; k_i < k_cnt; k_i++) {
k_tileCfg = k_tiles[k_i];
k_tileCfg.k_isSingleton = false !== k_tileCfg.k_isSingleton; this._k_widgetLibrary[k_tileCfg.k_type] = k_tileCfg;
}
},

_k_createToolbar: function(k_tiles, k_buttons) {
var
k_items = [],
k_onClickAddWidget,
k_i, k_cnt,
k_tileCfg,
k_toolbarCfg;
k_onClickAddWidget = function(k_toolbar, k_item) {
var
k_dashboard = k_toolbar.k_relatedWidget,
k_columnIndex = k_dashboard._k_getColumnCount() - 1,
k_type = k_item.k_name;
k_dashboard.k_addLibraryTile({type: k_type}, k_columnIndex, false);
};
for (k_i = 0, k_cnt = k_tiles.length; k_i < k_cnt; k_i++) {
k_tileCfg = k_tiles[k_i];
k_items.push({
k_id: k_tileCfg.k_type,
k_caption: k_tileCfg.k_description,
k_onClick: k_onClickAddWidget
});
}
k_toolbarCfg = {
k_hasSharedMenu: true,
k_items: [
{
k_id: 'k_btnAddWidget',
k_caption: kerio.lib.k_tr('Add Tile', 'wlibDashboard'),
k_isMenuButton: true,
k_items: k_items,
k_isDisabled: true
}
]
};
if (k_buttons) {
k_toolbarCfg.k_items = k_toolbarCfg.k_items.concat(k_buttons);
}
return k_toolbarCfg;
}, 
_k_enableToolbarItem: function(k_id, k_enable) {
this._k_toolbar.k_getItem('k_btnAddWidget').k_submenu.k_enableItem(k_id, k_enable);
},

_k_initLayout: function() {
this.k_extWidget.doLayout();
this.k_showLoadingIndicator(false);
},

_k_finishInitialization: function() {
if (this._k_onAfterRender) {
this._k_onAfterRender();
}
this._k_isInitLoading = false;
this._k_toolbar.k_enableItem('k_btnAddWidget');
this.k_extWidget.doLayout();
},

k_doLayout: function() {
this.k_extWidget.doLayout();
},

k_onContentReady: function() {
this._k_cntTilesLoaded++;
if (true !== this._k_isInitLoading || this._k_cntTilesTotal <= this._k_cntTilesLoaded) {
this._k_initLayout();
}
},

k_onAfterRenderContent: function() {
this._k_cntTilesRendered++;
if (true === this._k_isInitLoading && this._k_cntTilesTotal <= this._k_cntTilesRendered) {
this._k_forEachTile('k_initTile');
this._k_finishInitialization();
}
},

_k_applyDefaultSettings: function() {
this._k_restoreUserSettings(this._k_defaultSettings);
},

_k_restoreUserSettings: function(k_dashboardSettings) {
var
k_storedColumns,
k_columnItems,
k_columnIndex, k_cntColumns,
k_column,
k_i, k_cnt;
for (k_columnIndex = 0, k_cntColumns = this._k_getColumnCount(); k_columnIndex < k_cntColumns; k_columnIndex++) {
k_column = this._k_getColumn(k_columnIndex);
k_column.k_extWidget.removeAll(true);
}
k_storedColumns = k_dashboardSettings.columns;
for (k_columnIndex = 0, k_cntColumns = k_storedColumns.length; k_columnIndex < k_cntColumns; k_columnIndex++) {
k_columnItems = k_storedColumns[k_columnIndex];
for (k_i = 0, k_cnt = k_columnItems.length; k_i < k_cnt; k_i++) {
this.k_addLibraryTile(k_columnItems[k_i], k_columnIndex, true);
}
}
},

_k_storeUserSettings: function() {
var
k_dashboardSettings = { columns: [] },
k_columnSettings,
k_widgetSettings,
k_columnItems,
k_column,
k_columnIndex, k_cntColumns,
k_i, k_cnt,
k_tile,
k_settings;
for (k_columnIndex = 0, k_cntColumns = this._k_getColumnCount(); k_columnIndex < k_cntColumns; k_columnIndex++) {
k_columnSettings = [];
k_column = this._k_getColumn(k_columnIndex);
k_columnItems = k_column.k_items;
for (k_i = 0, k_cnt = k_columnItems.length; k_i < k_cnt; k_i++) {
k_tile = k_columnItems[k_i]._kx.k_owner;
k_widgetSettings = {
type: k_tile.k_type
};
if (k_tile.k_getUserSettings) {
k_widgetSettings.custom = k_tile.k_getUserSettings();
}
k_columnSettings.push(k_widgetSettings);
}
k_dashboardSettings.columns.push(k_columnSettings);
}
k_settings = {};
k_settings[kerio.lib.k_isIPadCompatible ? 'iPadAdmin' : 'admin'] = {dashboard: k_dashboardSettings};
kerio.lib.k_addCustomSettings(k_settings);
},

k_onActivate: function() {
this._k_handleScreenSwitching(true, arguments);
},

k_onDeactivate: function() {
this._k_handleScreenSwitching(false, arguments);
},

_k_handleScreenSwitching: function(k_activated, k_arguments) {
var
k_methodName;
this.k_toggleAllTasks(k_activated);
if (k_activated) {
k_methodName = 'k_onActivate';
}
else {
k_methodName = 'k_onDeactivate';
}
this._k_forEachTile(k_methodName, k_arguments);
},

_k_forEachTile: function(k_methodName, k_arguments) {
var
k_columnItems,
k_column,
k_columnIndex, k_cntColumns,
k_i, k_cnt,
k_tile,
k_content;
k_arguments = k_arguments || [];
for (k_columnIndex = 0, k_cntColumns = this._k_getColumnCount(); k_columnIndex < k_cntColumns; k_columnIndex++) {
k_column = this._k_getColumn(k_columnIndex);
k_columnItems = k_column.k_items;
for (k_i = 0, k_cnt = k_columnItems.length; k_i < k_cnt; k_i++) {
k_tile = k_columnItems[k_i]._kx.k_owner;
if (k_tile[k_methodName]) {
k_tile[k_methodName].apply(k_tile, k_arguments);
}
else {
k_content = k_tile.k_content;
if (k_content[k_methodName]) {
k_content[k_methodName].apply(k_content, k_arguments);
}
}
}
}
},

k_addTask: function(k_config) {
if (!this._k_tasks.k_isDefined(k_config.k_id)) {
this._k_activeTaskIdList.push(k_config.k_id);
this._k_tasks.k_add(k_config);
}
},

k_startTask: function(k_id) {
if (this._k_tasks.k_isDefined(k_id)) {
this._k_tasks.k_start(k_id);
}
},

k_removeTask: function(k_id) {
this._k_tasks.k_remove(k_id, true);
},

k_toggleAllTasks: function(k_resume) {
var
k_tasks = this._k_tasks,
k_taskIdList = this._k_activeTaskIdList,
k_isDefined = k_tasks.k_isDefined,
k_action,
k_i, k_cnt;
if (k_resume) {
k_action = k_tasks.k_resume;
}
else {
k_action = k_tasks.k_suspend;
}
for (k_i = 0, k_cnt = k_taskIdList.length; k_i < k_cnt; k_i++) {
if (k_isDefined.call(k_tasks, k_taskIdList[k_i])) {
k_action.call(k_tasks, k_taskIdList[k_i]);
}
else {
k_taskIdList.splice(k_i, 1);
k_i--;
k_cnt = k_taskIdList.length;
}
}
},

_k_getColumnCount: function() {
return this.k_extWidget.items.getCount();
},

_k_getColumn: function(k_columnIndex) {
var
k_columns = this.k_extWidget.items.items,
k_extWidget = null,
k_items;
if (!k_columns || !k_columns[k_columnIndex] || !k_columns[k_columnIndex].items || !k_columns[k_columnIndex].items.items) {
if (k_columns[k_columnIndex]) {
k_extWidget = k_columns[k_columnIndex];
}
k_items = [];
}
else {
k_extWidget = k_columns[k_columnIndex];
k_items = k_extWidget.items.items;
}
return {
k_extWidget: k_extWidget,
k_items: k_items
};
},

k_onBeforeTextSelection: function() {
this._k_isTextSelected = true;
this._k_forEachTile('k_preventPerformAction');
},

k_onAfterTextSelection: function(k_selectedText) {
var
k_timeTextSelectionFinished;
if (0 === k_selectedText.length) {
this._k_finishTextSelection();
}
else {
k_timeTextSelectionFinished = new Date();
k_timeTextSelectionFinished = k_timeTextSelectionFinished.add(Date.MILLI, this.k_TEXT_SELECTION_MILIS_TO_CLEAR);
this._k_timeTextSelectionFinished = k_timeTextSelectionFinished.getTime();
this._k_deferredFinishTextSelection.defer(this.k_TEXT_SELECTION_MILIS_ITERATION, this);
}
this._k_isTextSelected = false;
},

_k_finishTextSelection: function() {
this._k_timeTextSelectionFinished = 0;
this._k_forEachTile('k_allowPerformAction');
},

_k_deferredFinishTextSelection: function() {
var
k_currentTime = new Date();
if (false === this._k_isTextSelected && this._k_timeTextSelectionFinished <= k_currentTime.getTime()) {
this._k_finishTextSelection();
}
else {
this._k_deferredFinishTextSelection.defer(this.k_TEXT_SELECTION_MILIS_ITERATION, this);
}
},

k_suppressAutorefresh: function() {
var
k_waitForFocusTaskId;
this._k_forEachTile('k_preventPerformAction');
if (undefined === this._k_waitForFocusTaskId) {
k_waitForFocusTaskId = 'k_waitForFocusTaskId';
this.k_addTask({
k_id: k_waitForFocusTaskId,
k_interval: 2000,
k_run: this._k_waitForFocus,
k_scope: this,
k_startNow: true,
k_startDeferred: true,
k_startSuspended: true
});
this.k_addReferences({
_k_waitForFocusTaskId: k_waitForFocusTaskId
});
}
this._k_tasks.k_resume(this._k_waitForFocusTaskId);
},

_k_waitForFocus: function() {
if (undefined !== kerio.lib._k_windowManager.k_getActiveWindow()) {
return;
}
this._k_tasks.k_suspend(this._k_waitForFocusTaskId);
this._k_forEachTile('k_allowPerformAction');
},

k_canLoadDataIndividually: function() {
return true !== this._k_isInitLoading;
},

k_showLoadingIndicator: function(k_show) {
if (k_show) {
this.k_extWidget.body.addClass('loadingIndicator');
}
else {
this.k_extWidget.body.removeClass('loadingIndicator');
}
},

_k_debugColumns: function(k_text, k_force) {
var
k_columnFirstItems,
k_columnSecondItems,
k_i, k_cnt,
k_row;
if (true !== k_force) {
return;
}
k_columnFirstItems = this._k_getColumn(0).k_items;
k_columnSecondItems = this._k_getColumn(1).k_items;
k_cnt = Math.max(k_columnFirstItems.length, k_columnSecondItems.length);
kerio.lib.k_log('=== Dashboard columns - ' + k_text + ' ===');
for (k_i = 0; k_i < k_cnt; k_i++) {
k_row = '| ';
if (k_columnFirstItems[k_i]) {
k_row += k_columnFirstItems[k_i]._kx.k_owner.k_id;
}
else {
k_row += '......................';
}
k_row += ' | ';
if (k_columnSecondItems[k_i]) {
k_row += k_columnSecondItems[k_i]._kx.k_owner.k_id;
}
else {
k_row += '......................';
}
k_row += ' |';
kerio.lib.k_log(k_row);
}
kerio.lib.k_log('======');
}
});



kerio.adm.k_widgets.K_DashboardTile = function(k_id, k_config) {
k_config = k_config || {};
kerio.adm.k_widgets.K_DashboardTile.superclass.constructor.call(this, k_id, k_config);
this.k_addReferences({
k_type: k_config.k_type,
k_dashboard: k_config.k_dashboard,
k_userSettings: k_config.k_userSettings,
_k_isDragged: false,
_k_isOverTopHalf: false,
k_isNonremovable: k_config.k_isNonremovable
});
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_DashboardTile', kerio.lib._K_BaseWidget,
{

_k_propertiesMapping: {
k_id: 'id',
k_isSingleton: 'k_isSingleton',
k_dashboard: 'k_dashboard',
k_description: 'title'
},

_k_propertiesDefault: {
draggable: true,
overCls: 'mouseover',
bodyCssClass: 'selectable',
cls: 'tile %+'
},
_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_extWidget,
k_toolsCfg;
k_toolsCfg = [{
id:'gear',
qtip: kerio.lib.k_tr('Tile settings', 'wlibDashboard'),
hidden: true,
handler: function(k_extEvent, k_tool, k_extTile) {
this._k_showContextMenu(k_extEvent);
},
scope: this
}];
k_adaptedConfig.tools = k_toolsCfg;
k_extWidget = new Ext.Panel(k_adaptedConfig);
k_extWidget.on('afterrender', this._k_onTileRender, this, {delay: 10});
kerio.lib._k_addKerioProperty(k_extWidget, {
_k_createGhost: k_extWidget.createGhost
});
k_extWidget.createGhost = this._k_createGhost;
return k_extWidget;
},
_k_createGhost: function (cls, useShim, appendTo) {
cls = kerio.lib._k_addClassName(cls, 'dashboardTileGhost');
return this._kx._k_createGhost.call(this, cls, useShim, appendTo);
},

_k_onTileRender: function() {
this._k_initContent();
this._k_allowDragDrop();
this._k_setHandlers();
},
_k_allowDragDrop: function() {
var
k_tile = this,
k_extWidget = this.k_extWidget,
k_dropZone;
k_dropZone = new Ext.dd.DropZone(k_extWidget.el.dom, {
notifyOver: function(k_dragSource, k_event, k_data) {
var
k_tile = this._kx.k_owner,
k_dashboard = k_tile.k_dashboard,
k_tileDom = this.el.dom,
k_dasboardScrollTop = k_dashboard.k_extWidget.body.getScroll(),
k_cursorPosition = k_event.getXY(),
k_cursorTop = k_cursorPosition[1] + k_dasboardScrollTop.top - kerio.adm.k_widgets.K_Dashboard.prototype.k_MARGIN_TOP,
k_isOverTopHalf;
if (0 === k_tileDom.offsetTop) {
k_event.stopEvent();
return this.dropAllowed;
}
k_isOverTopHalf = (k_tileDom.offsetTop + k_tileDom.offsetHeight / 2) >= k_cursorTop;
if (k_isOverTopHalf) {
k_dragSource.proxy.moveProxy(k_tileDom.parentNode, k_tileDom);
}
else {
k_dragSource.proxy.moveProxy(k_tileDom.parentNode, k_tileDom.nextSibling);
}
k_tile._k_isOverTopHalf = k_isOverTopHalf;
k_tile.k_isTileDroppedNotify = true;
k_tile.k_isTileDropped = true;
k_event.stopEvent();
return this.dropAllowed;
},
notifyDrop: function(k_dragSource, k_event, k_data) {
if (true !== this._kx.k_owner.k_isTileDroppedNotify) {
return;
}
delete this._kx.k_owner.k_isTileDroppedNotify;
k_event.stopEvent();
return this.dropAllowed;
}
});
k_tile.k_addReferences({
_k_showProxyOrig: k_extWidget.dd.proxy.show
});
k_extWidget.dd.proxy.show = this._k_showProxy;
kerio.lib._k_addKerioProperty(k_dropZone, {
k_owner: k_tile
});
k_extWidget.dd.afterDragDrop = function(k_dropZone, k_extEvent) {
var
k_droppedTile = this.panel._kx.k_owner,
k_targetTile = k_dropZone._kx.k_owner;
if (true !== k_targetTile.k_isTileDropped) {
return;
}
delete k_targetTile.k_isTileDropped;
if (k_targetTile._k_isOverTopHalf) {
k_targetTile.k_dashboard.k_dropTileBefore(k_droppedTile.k_extWidget, k_targetTile.k_extWidget);
}
else {
k_targetTile.k_dashboard.k_dropTileAfter(k_droppedTile.k_extWidget, k_targetTile.k_extWidget);
}
k_targetTile._k_isOverTopHalf = false;
k_droppedTile._k_onAfterDrop();
};
},
_k_showProxy: function () {
var
k_tile = this.panel._kx.k_owner;
k_tile._k_onBeforeDrag.call(k_tile, arguments);
k_tile._k_showProxyOrig.call(this, arguments);
},
_k_onBeforeDrag: function() {
this._k_isDragged = true;
this.k_dashboard.k_toggleAllTasks(false);
},
_k_onAfterDrop: function() {
this._k_isDragged = false;
this.k_dashboard.k_toggleAllTasks(true);
},
_k_setHandlers: function() {
var
k_extWidget = this.k_extWidget;
k_extWidget.el.on('mouseover', this._k_showTools, this);
k_extWidget.el.on('mouseout', this._k_hideTools, this);
k_extWidget.el.on('contextmenu', this._k_showContextMenu, this);
},
_k_initContent: function() {
kerio.lib.k_ui.k_showDialog({
k_sourcePath: 'dashboard',
k_sourceName: this.k_type,
k_objectName: this.k_id + '_' + 'k_content',
k_initParams: {
k_tile: this }
});
},
_k_showTools: function() {
this.k_extWidget.tools.gear.setVisible(true);
},
_k_hideTools: function() {
this.k_extWidget.tools.gear.setVisible(false);
},
k_isDragged: function() {
return this._k_isDragged;
},

k_onContentReady: function(k_content) {
var
k_dashboard = this.k_dashboard;
this.k_extWidget.insert(0, k_content.k_extWidget);
this.k_content = k_content;
this.k_addReferences({
k_getUserSettings: k_content.k_getUserSettings
});
k_content.k_addReferences({
k_userSettings: this.k_userSettings
});
if (k_dashboard.k_onContentReady) {
k_dashboard.k_onContentReady();
}
},

k_onAfterRenderContent: function() {
var
k_dashboard = this.k_dashboard,
k_content = this.k_content,
k_autorefreshTaskId;
if (k_content.k_autorefresh) {
k_autorefreshTaskId = k_content.k_id + '_' + 'k_refreshId';
k_dashboard.k_addTask({
k_id: k_autorefreshTaskId,
k_interval: k_content.k_autorefresh.k_interval * 1000,
k_run: k_content.k_loadData,
k_scope: k_content,
k_params: k_content.k_loadDataParams,
k_startDeferred: true
});
this.k_addReferences({
k_autorefreshTaskId: k_autorefreshTaskId
});
}
k_content.k_allowPerformAction();
if (k_dashboard.k_onAfterRenderContent) {
k_dashboard.k_onAfterRenderContent.defer(10, k_dashboard);
}
},
k_onContentChanged: function() {
this.k_dashboard._k_storeUserSettings();
},
k_close: function() {
this.k_content.k_onClose();
this.k_dashboard.k_removeTile(this);
this.k_extWidget.hide();
this.k_extWidget.destroy();
delete this.k_extWidget;
},
_k_showContextMenu: function(k_extEvent) {
var
k_settings,
k_menuCfg,
k_items;
k_extEvent.stopEvent(); if (!this._k_contextMenu) {
k_settings = this.k_content.k_settings;
if (k_settings && k_settings.k_items) {
k_items = k_settings.k_items.concat(['-']);
}
else {
k_items = [];
}
k_items.push({
k_caption: kerio.lib.k_tr('Remove this tile', 'wlibDashboard'),
k_onClick: function(k_menu) { k_menu.k_parentWidget.k_close(); },
k_isDisabled: this.k_isNonremovable
});
k_menuCfg = {
k_items: k_items
};
this._k_contextMenu = new kerio.lib.K_Menu(this.k_id + '_' + 'k_menu', k_menuCfg);
this._k_contextMenu._k_setParentWidget(this);
}
this._k_contextMenu.k_extWidget.showAt(k_extEvent.getXY());
if ((Ext.isLinux && kerio.lib.k_isChrome) || ((Ext.isLinux || Ext.isMac) && kerio.lib.k_isFirefox)) {
this.k_allowPerformAction();
}
},
k_updateStatus: function(k_newStatus) {
var
k_isError = 'error' === k_newStatus;
if (!this.k_extWidget) {
return;
}
this.k_extWidget.removeClass('statusError');
if (k_isError) {
this.k_extWidget.addClass('statusError');
}
},
k_setTitle: function(k_title) {
this.k_extWidget.setTitle(k_title);
},
k_onActivate: function() {
if (this.k_content && this.k_content.k_onActivate) {
this.k_content.k_onActivate.apply(this.k_content, arguments);
}
},
k_onDeactivate: function() {
if (this.k_content && this.k_content.k_onDeactivate) {
this.k_content.k_onDeactivate.apply(this.k_content, arguments);
}
},

k_preventPerformAction: function() {
this.k_content.k_preventPerformAction();
},

k_allowPerformAction: function() {
this.k_content.k_allowPerformAction();
}
});


kerio.adm.k_widgets.K_TileForm = function(k_id, k_config) {
k_config = k_config || {};
if (!k_config.k_autorefresh || !k_config.k_autorefresh.k_interval) {
k_config.k_autorefresh = k_config.k_autorefresh || {};
k_config.k_autorefresh.k_interval = kerio.adm.k_widgets.K_Dashboard.prototype.k_DEFAULT_REFRESH_TIMEOUT;
}
kerio.adm.k_widgets.K_TileForm.superclass.constructor.call(this, k_id, k_config);
this._k_initHandlers(k_config);
this.k_addReferences({
k_tile: k_config.k_tile,
k_loadDataParams: k_config.k_loadDataParams,
k_settings: k_config.k_settings,
k_autorefresh: k_config.k_autorefresh,
_k_isSelectable: false !== k_config.k_isSelectable,
_k_isClosed: false,
_k_isActive: false, _k_isDataLoaded: false
});
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_TileForm', kerio.lib.K_Form,
{

k_show: function() {
if (false === this._k_isSelectable) {
this.k_tile.k_extWidget.body.removeClass('selectable');
}
if (this.k_tile.k_onContentReady) {
this.k_tile.k_onContentReady(this);
}
this._k_afterRender();
},

_k_afterRender: function () {
var
k_stackLength = this._k_getStackLength();
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments, k_stackLength)) {
return;
}
if (this.k_tile.k_onAfterRenderContent) {
this.k_tile.k_onAfterRenderContent(this);
}
if (this.k_userSettings && this.k_setUserSettings) {
this.k_setUserSettings(this.k_userSettings);
}
if (this.k_tile.k_dashboard.k_canLoadDataIndividually()) {
if (this.k_initTile) {
this.k_initTile();
}
else {
if (this.k_loadData) {
this.k_loadData(this.k_loadDataParams);
}
}
}
this._k_setTextSelectionObservers();
},

_k_initHandlers: function(k_config) {
this.k_addReferences({
_k_handlers: {
k_initTile: k_config.k_initTile,
k_loadData: k_config.k_loadData,
k_loadDataCallback: k_config.k_loadDataCallback,
k_onActivate: k_config.k_onActivate,
k_onDeactivate: k_config.k_onDeactivate,
k_onClose: k_config.k_onClose
}
});
if (k_config.k_notifications && k_config.k_notifications.k_callback) {
this._k_handlers.k_notificationsCallback = k_config.k_notifications.k_callback;
}
},

_k_setTextSelectionObservers: function() {
var
k_dashboard = this.k_tile.k_dashboard,
k_element = this.k_extWidget.el,
k_mouseupHandler;
if (document.getSelection) {
k_mouseupHandler = function() {
var
k_selectedText = document.getSelection().toString();
this.k_onAfterTextSelection(k_selectedText);
};
}
else {
k_mouseupHandler = function() {
var
k_selectedText = document.selection.createRange();
k_selectedText = k_selectedText.text;
this.k_onAfterTextSelection(k_selectedText);
};
}
k_element.on('mousedown', k_dashboard.k_onBeforeTextSelection, k_dashboard);
k_element.on('mouseup', k_mouseupHandler, k_dashboard);
},
_k_fireEvent: function(k_handlerName, k_arguments) {
if (this.k_canPerformAction() && this._k_handlers[k_handlerName]) {
return this._k_handlers[k_handlerName].apply(this, k_arguments);
}
},

k_initTile: function() {
var
k_tile = this.k_tile;
k_tile.k_dashboard.k_startTask(k_tile.k_autorefreshTaskId);
this._k_fireEvent('k_initTile', arguments);
},
k_loadData: function() {
this._k_fireEvent('k_loadData', arguments);
},

k_loadDataCallback: function() {
this._k_fireEvent('k_loadDataCallback', arguments);
if (false === this._k_isDataLoaded) {
this.k_tile.k_dashboard.k_doLayout();
this._k_isDataLoaded = true;
}
},
k_onActivate: function() {
this.k_allowPerformAction();
this._k_fireEvent('k_onActivate', arguments);
},
k_onDeactivate: function() {
var
k_handlerName = 'k_onDeactivate';
this.k_preventPerformAction();
if (this._k_ajaxRequestStack) {
kerio.lib.k_ajax.k_abortAllPendingRequests(this);
}
if (this._k_handlers[k_handlerName]) {
return this._k_handlers[k_handlerName].apply(this, arguments);
}
},
k_notificationsCallback: function() {
this._k_fireEvent('k_notificationsCallback', arguments);
},
k_onClose: function() {
var
k_handlerName = 'k_onClose';
this._k_isClosed = true;
this.k_onDeactivate();
if (this._k_handlers[k_handlerName]) {
return this._k_handlers[k_handlerName].apply(this, arguments);
}
},

k_preventPerformAction: function() {
this._k_isActive = false;
},

k_allowPerformAction: function() {
this._k_isActive = true;
},

k_canPerformAction: function() {
return true !== this._k_isClosed && this._k_isActive;
}
});


kerio.adm.k_widgets.K_ProductRegistrationWizard = function(k_objectName, k_initParams) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isTrial = k_initParams.k_isTrial || k_objectName === 'trialRegistration',
k_localNamespace = k_objectName + '_',
k_inputWidth = 170,
k_notEmpty = {
k_allowBlank: false
},
k_keyRegExp = new RegExp('[0-9a-z]{5}(\\-[0-9a-z]{5}){2}', 'i'),
k_formStartRegistrationCfg,
k_formStartRegistration,
k_formSubscriptions,
k_formDetailsCfg,
k_formDetails,
k_formQuestionsCfg,
k_formQuestions,
k_summaryGridCfg,
k_summaryGrid,
k_formSummaryCfg,
k_formSummary,
k_formTrialIdCfg,
k_formTrialId,
k_trialIdsMgs,
k_formManager,
k_buttons,
k_title,
k_wizard,
k_wizardCfg,
k_dialogCfg;
k_formStartRegistrationCfg = {
k_restrictBy: {
k_isTrial: k_isTrial,
k_showCaptcha: k_initParams.k_showCaptcha
},
k_items: [{
k_restrictions: {k_isTrial: [true]},
k_type: 'k_display',
k_id: 'k_trialRegistrationInfo',
k_value: this.k_getTrialRegistrationInfo(k_initParams)
},{
k_restrictions: {k_isTrial: [false]},
k_type: 'k_display',
k_value: k_tr('This registration wizard will generate your license.key file for the product. This file specifies who is the owner of the license.', 'wlibProductRegistration')
},{
k_restrictions: {k_isTrial: [false]},
k_type: 'k_display',
k_value: true === k_initParams.k_newKissMode ? k_tr('Please enter the license number of your product and keep it for future use. In case you decide to extend your product by adding more users or an additional Software Maintenance, this number will be required.', 'wlibProductRegistration')
: k_tr('Please enter the license number of your base product and keep it for future use. In case you decide to extend your product by adding more users or an additional Software Maintenance, this base number will be required.', 'wlibProductRegistration')
},{
k_restrictions: {k_isTrial: [true]},
k_type: 'k_display',
k_value: k_tr('An email with your Trial License number was sent to you when you requested a trial.', 'wlibProductRegistration')
},{
k_type: 'k_row',
k_items: [{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_isTrial ? k_tr('Trial license number:', 'wlibProductRegistration') : k_tr('License number:', 'wlibProductRegistration')
}, {
k_type: 'k_container',
k_width: '100%',
k_isLabelHidden: true,
k_items: [{
k_id: 'k_licenseNumber',
k_labelWidth: 83,
k_caption: k_isTrial ? k_tr('Trial license number:', 'wlibProductRegistration') : k_tr('License number:', 'wlibProductRegistration'),
k_maxLength: 17,
k_width: 145,

k_onChange: function(k_form, k_item, k_value) {
if (17 !== k_value.length) {
return;
}
k_item.k_setRegexValidator(k_form.k_dialog.k_keyRegExp, k_form.k_invalidLicenseNumber);
},
k_validator: k_notEmpty
}, {
k_restrictions: {k_isTrial: [true]},
k_type: 'k_display',
k_isSecure: true,
k_value: {k_text: k_tr('Get a Trial License number', 'wlibProductRegistration')},
k_template: '<a target="_blank" href="' + k_initParams.k_trialLicenseLink + '">{k_text}</a>',
k_className: 'htmlLink'
}] }] },{
k_type: 'k_container',
k_id: 'k_captchaItems',
k_restrictions: {k_showCaptcha: [true]},
k_isLabelHidden: true,
k_items: [{
k_type: 'k_display',
k_value: this.k_getCaptchaExplainMsg(k_initParams)
},{
k_width: 250,
k_height: 80,
k_type: 'k_image',
k_id: 'k_captcha',
k_value: ''
},{
k_type: 'k_display',
k_value: k_tr('Enter security code displayed in the image above:', 'wlibProductRegistration')
},{
k_id: 'k_securityCode',
k_validator: k_notEmpty,
k_maxLength: 6,
k_width: 250
}]
}]
};
k_formStartRegistration = new k_lib.K_Form(k_localNamespace + 'k_formStartRegistration', k_formStartRegistrationCfg);
k_formSubscriptions = k_initParams.k_newKissMode
? this._k_createLicenseInfoForm(k_localNamespace)
: this._k_createSubscriptionForm(k_localNamespace);
k_formDetailsCfg = {
k_items: [{
k_type: 'k_display',
k_value: k_tr('Please fill in the form below with the valid information.', 'wlibProductRegistration')
},
{
k_type: 'k_columns',
k_labelWidth: 100,
k_height: 120,
k_width: '100%',
k_items: [{
k_width: '50%',
k_type: 'k_container',
k_items: [{
k_id: 'k_organization',
k_caption: k_tr('Organization:', 'wlibProductRegistration'),
k_validator: k_notEmpty
},
{
k_id: 'k_person',
k_caption: k_tr('Person:', 'wlibProductRegistration'),
k_validator: k_notEmpty
},
{
k_id: 'k_email',
k_type: 'k_email',
k_validator: {
k_regExp: kerio.adm.k_emailRegExp,
k_allowBlank: false
}
},
{
k_id: 'k_phone',
k_caption: k_tr('Phone:', 'wlibProductRegistration'),
k_validator: k_notEmpty
},
{
k_id: 'k_web',
k_caption: k_tr('Web:', 'wlibProductRegistration')
}]
},
{
k_type: 'k_container',
k_items: [{
k_id: 'k_fake',
k_type: 'k_display',
k_value: ' ',
k_width: 12
}]
},
{
k_type: 'k_container',
k_labelWidth: 100,
k_width: '50%',
k_items: [{
k_id: 'k_country',
k_caption: k_tr('Country:', 'wlibProductRegistration'),
k_type: 'k_select',
k_localData: k_lib.k_getSortedCountries(),
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',

k_onChange: function(k_form, k_item, k_value) {
var
k_enable = false,
k_state = k_form.k_getItem('k_state');
if ('AU' === k_value || 'CA' === k_value || 'US' === k_value) {
k_state.k_setData(kerio.lib.k_constants.k_stateItems[k_value]);
k_enable = true;
}
k_state.k_setValue('');
k_state.k_setDisabled(!k_enable);
}
},
{
k_id: 'k_state',
k_type: 'k_select',
k_caption: k_tr('State:', 'wlibProductRegistration'),
k_isDisabled: true,
k_localData: [],
k_emptyText: k_tr('Select state…', 'wlibProductRegistration'),
k_emptyValuePrompt: {
k_value: '',
k_display: k_tr('Select state…', 'wlibProductRegistration')
},
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',
k_validator: k_notEmpty
},
{
k_id: 'k_city',
k_caption: k_tr('City:', 'wlibProductRegistration'),
k_validator: k_notEmpty
},
{
k_id: 'k_street',
k_caption: k_tr('Street:', 'wlibProductRegistration'),
k_validator: k_notEmpty
},
{
k_id: 'k_zip',
k_caption: k_tr('ZIP:', 'wlibProductRegistration'),
k_validator: k_notEmpty
}]
}]
},
{
k_id: 'k_comment',
k_type: 'k_textArea',
k_height: 145,
k_caption: k_tr('Comment:', 'wlibProductRegistration')
},
{
k_id: 'k_policy',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('I agree with the <span class="link textLink">Privacy Policy Terms</span>', 'wlibProductRegistration')
}]
};
k_formDetails = new k_lib.K_Form(k_localNamespace + 'k_formDetails', k_formDetailsCfg);
k_formDetails.k_getItem('k_policy').k_extWidget.on('render', function(k_extWidget) {
k_extWidget.getEl().parent().child('label').child('span').on('click', function() {
Ext.EventObject.stopEvent();
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'htmlDialog',
k_objectName: 'privacyPolicy',
k_initParams: {
k_title: kerio.lib.k_tr('Privacy Policy Terms', 'wlibPrivacyPolicyTerms'),
k_url: kerio.adm.k_framework.k_getPredefinedUrl('privacypolicy.html')
}
});
}, this.k_getItem('k_policy'));
}, k_formDetails);
k_formQuestionsCfg = {
k_items: [{
k_type: 'k_container',
k_id: 'k_questions',
k_isLabelHidden: true,
k_items: [{
k_type: 'k_display',
k_value: k_tr('This information is not required. However, we will appreciate if you answer these questions. This information will help us develop our products according to the needs of our customers. Thank you.',
'wlibProductRegistration')
},
{
k_type: 'k_display',
k_value: k_tr('Number of computers in your company?', 'wlibProductRegistration')
},
{
k_type: 'k_select',
k_width: k_inputWidth,
k_id: 'k_computerCount',
k_value: '',
k_localData: [
{k_name: k_tr('1 - 19', 'wlibProductRegistration'), k_value: '1 - 19'},
{k_name: k_tr('20 - 49', 'wlibProductRegistration'), k_value: '20 - 49'},
{k_name: k_tr('50 - 99', 'wlibProductRegistration'), k_value: '50 - 99'},
{k_name: k_tr('100 - 249', 'wlibProductRegistration'), k_value: '100 - 249'},
{k_name: k_tr('250 - 999', 'wlibProductRegistration'), k_value: '250 - 999'},
{k_name: k_tr('1000 and more', 'wlibProductRegistration'), k_value: '1000 and more'}
],
k_emptyText: k_tr('Select number of computers…', 'wlibProductRegistration'),
k_emptyValuePrompt: {
k_value: '',
k_display: k_tr('Select number of computers…', 'wlibProductRegistration')
},
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value'
},
{
k_type: 'k_display',
k_value: k_tr('Where did you learn of the product?', 'wlibProductRegistration')
},
{
k_type: 'k_select',
k_width: k_inputWidth,
k_id: 'k_origin',
k_value: '',
k_localData: [
{k_name: k_tr('Internet search', 'wlibProductRegistration'), k_value: 'Internet search'},
{k_name: k_tr('Magazine', 'wlibProductRegistration'), k_value: 'Magazine'},
{k_name: k_tr('Personal recommendation', 'wlibProductRegistration'), k_value: 'Personal recommendation'},
{k_name: k_tr('Reseller', 'wlibProductRegistration'), k_value: 'Resseler'},
{k_name: k_tr('Exhibition', 'wlibProductRegistration'), k_value: 'Exhibition'},
{k_name: k_tr('Other', 'wlibProductRegistration'), k_value: 'Other'}
],
k_emptyText: k_tr('Select option…', 'wlibProductRegistration'),
k_emptyValuePrompt: {
k_value: '',
k_display: k_tr('Select option…', 'wlibProductRegistration')
},
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value'
},
{
k_type: 'k_display',
k_value: k_tr('Who did you buy your license number from? (please enter the reseller\'s name)', 'wlibProductRegistration'),
k_isHidden: k_isTrial
},
{
k_id: 'k_reseller',
k_width: k_inputWidth,
k_isHidden: k_isTrial
}]
}]
};
k_formQuestions = new k_lib.K_Form(k_localNamespace + 'k_formQuestions', k_formQuestionsCfg);
k_summaryGridCfg = {
k_isStateful: false,
k_selectionMode: 'k_none',
k_isRowHighlighting: false,
k_pageSize: 200,  k_columns: {
k_sorting: false,
k_items: [
{k_columnId: 'caption', k_caption: k_tr('Item', 'wlibCommon'), k_width: 150,

k_renderer: function (k_value){
return {
k_data: '<b>' + kerio.lib.k_htmlEncode(k_value) + '</b>',
k_isSecure: true
};
}
},
{k_columnId: 'value', k_caption: k_tr('Value', 'wlibProductRegistration')}
]
},
k_localData: []
};
k_summaryGrid = new k_lib.K_Grid(k_localNamespace + 'k_gridSummary', k_summaryGridCfg);
k_formSummaryCfg = {
k_items: [{
k_type: 'k_display',
k_value: k_tr('Registration wizard has collected all necessary information and will now generate the registration. If you have provided incorrect information or if your network setup changes, you may run this wizard again to generate new one.',
'wlibProductRegistration')
},
{
k_type: 'k_container',
k_content: k_summaryGrid
}]
};
k_formSummary = new k_lib.K_Form(k_localNamespace + 'k_formSummary', k_formSummaryCfg);
k_formTrialIdCfg = {
k_items: [{
k_type: 'k_display',
k_value: k_tr('Registration wizard has collected all necessary information and will now finish the trial registration. Your trial registration will expire 30 days after installation.', 'wlibProductRegistration')
}]
};
k_formTrialId = new k_lib.K_Form(k_localNamespace + 'k_formTrialId', k_formTrialIdCfg);
k_formManager = new k_lib.K_FormManager(k_localNamespace + 'k_formManager',
[k_formStartRegistration, k_formSubscriptions, k_formDetails, k_formQuestions, k_formSummary, k_formTrialId]);
k_trialIdsMgs = this.k_getTrialId(k_initParams);
k_wizardCfg = {
k_showPageHeader: false,
k_items: [
{k_caption: k_tr('Start Registration', 'wlibProductRegistration'),  k_id: 'k_startRegistrationTab',  k_content: k_formStartRegistration},
{k_caption: k_tr('Software Maintenances', 'wlibProductRegistration'),  k_id: 'k_subscriptionsTab',  k_content: k_formSubscriptions},
{k_caption: k_tr('Details', 'wlibProductRegistration'),  k_id: 'k_detailsTab',  k_content: k_formDetails},
{k_caption: k_tr('Questions', 'wlibProductRegistration'),  k_id: 'k_questionsTab',  k_content: k_formQuestions},
{k_caption: k_tr('Summary', 'wlibProductRegistration'),  k_id: 'k_summaryTab',  k_content: k_formSummary},
{k_caption: k_trialIdsMgs,  k_id: 'k_trialIdTab',  k_content: k_formTrialId}
],

k_onBeforeTabChange: function(k_wizard, k_newTab, k_currentTab) {
var
k_dialog = k_wizard.k_dialog,
k_tr = kerio.lib.k_tr;
if (true === k_dialog.k_nextClicked) {
if (k_dialog.k_formSubscriptions.k_subscriptionGrid) {
k_dialog.k_formSubscriptions.k_subscriptionGrid.k_toolbars.k_right.k_isEdited = false;
}
k_dialog.k_nextClicked = false;
if (true === k_wizard.k_changePending) {
k_wizard.k_changePending = false;
return true;
}
if ('k_startRegistrationTab' === k_currentTab) {
k_dialog.k_formStartRegistration.k_getItem('k_licenseNumber').k_setRegexValidator(k_dialog.k_keyRegExp, k_dialog.k_formStartRegistration.k_invalidLicenseNumber);
if (k_dialog.k_formStartRegistration.k_isValid() && undefined !== k_dialog.k_token) {
k_wizard.k_changePending = true;
k_dialog.k_showMask(k_tr('Verifying license number…', 'wlibProductRegistration'));
k_dialog.k_getRegistrationInfo(k_newTab);
}
return false;
}
if ('k_detailsTab' === k_currentTab) {
if (k_dialog.k_formDetails.k_isValid()) {
if (!k_dialog.k_formDetails.k_getItem('k_policy').k_isChecked()) { kerio.lib.k_alert(k_tr('Privacy Policy', 'wlibProductRegistration'), k_tr('If you want to continue in registration, you must agree with the Privacy Policy Terms.', 'wlibProductRegistration'));
return false;
}
k_dialog.k_summarizeData();
return true;
}
else {
return false;
}
}
}
},

k_onTabChange: function(k_wizard, k_currentTab) {
var
k_tr = kerio.lib.k_tr,
k_dialog = k_wizard.k_dialog,
k_title = k_dialog.k_title,
k_button = 'k_btnNext',
k_divider = ' - ',
k_newTitle;
switch(k_currentTab) {
case 'k_startRegistrationTab':
if (this.k_dialog.k_isTrial) {
k_newTitle = k_title;
}
else {
k_newTitle = k_title + k_divider + k_tr('Start', 'wlibProductRegistration');
}
break;
case 'k_subscriptionsTab':
k_newTitle = k_title + k_divider + (k_dialog.k_newKissMode
? k_tr('License Details', 'wlibProductRegistration')
: k_tr('Software Maintenances', 'wlibProductRegistration'));
break;
case 'k_detailsTab':
k_newTitle = k_title + k_divider + k_tr('Details', 'wlibProductRegistration');
break;
case 'k_questionsTab':
k_newTitle = k_title + k_divider + k_tr('Questions', 'wlibProductRegistration');
break;
case 'k_summaryTab':
k_button = 'k_btnFinish';
k_newTitle = k_title + k_divider + k_tr('Summary', 'wlibProductRegistration');
break;
case 'k_trialIdTab':
k_button = 'k_btnClose';
k_newTitle = k_title + k_divider + k_tr('Summary', 'wlibProductRegistration');
break;
}
k_dialog.k_setTitle(k_newTitle);
k_dialog.k_toolbar.k_showItem('k_btnPrev', 'k_startRegistrationTab' !== k_currentTab);
if ('k_summaryTab' === k_currentTab) { k_dialog.k_toolbar.k_showItem('k_btnNext', false);
k_dialog.k_toolbar.k_showItem('k_btnFinish', true);
}
if ('k_trialIdTab' === k_currentTab) { k_dialog.k_toolbar.k_showItem(['k_btnPrev', 'k_btnNext', 'k_btnFinish', 'k_btnCancel'], false);
k_dialog.k_toolbar.k_showItem('k_btnClose', true);
}
k_dialog.k_setDefaultButton(k_button);
}
};
k_wizard = new k_lib.K_Wizard(k_localNamespace + 'k_wizard', k_wizardCfg);
k_buttons = [{
k_id: 'k_btnPrev',
k_caption: k_tr('< Back', 'wlibProductRegistration'),

k_onClick: function (k_toolbar) {
var k_activePage = k_toolbar.k_wizard.k_getActiveTabIndex();
if (4 == k_activePage) { k_toolbar.k_showItem('k_btnNext', true);
k_toolbar.k_showItem('k_btnFinish', false);
k_toolbar.k_dialog.k_setDefaultButton('k_btnNext');
}
}
},
{
k_id: 'k_btnNext',
k_caption: k_tr('Next >', 'wlibProductRegistration'),

k_onClick: function (k_toolbar) {
var
k_tr = kerio.lib.k_tr,
k_activePage = k_toolbar.k_wizard.k_getActiveTabIndex(),
k_dialog = k_toolbar.k_dialog,
k_gridData,
k_gridDataCount,
k_description,
k_i;
k_dialog.k_nextClicked = true;
if (1 == k_activePage && k_dialog.k_formSubscriptions.k_subscriptionGrid) {
k_gridData = k_dialog.k_formSubscriptions.k_subscriptionGrid.k_getRowsData();
k_gridDataCount = k_gridData.length;
for (k_i = 0; k_i < k_gridDataCount; k_i++) {
k_description = k_gridData[k_i].description;
if ('loading' === k_description || 'incorrect' === k_description || 'exists' === k_description) {
kerio.lib.k_alert(
k_tr('Error', 'wlibAlerts'),
k_tr('Your license keys are incomplete or invalid.', 'wlibProductRegistration')
);
return false;
}
}
}
}
},
{
k_isDefault: true,
k_isHidden: true,
k_id: 'k_btnFinish',
k_caption: k_tr('Finish', 'wlibProductRegistration'),
k_validateBeforeClick: false,

k_onClick: function(k_toolbar) {
k_toolbar.k_dialog.k_showMask(kerio.lib.k_tr('Please wait…', 'wlibWait'));
k_toolbar.k_dialog.k_finishRegistration();
return false;
}
},
{
k_id: 'k_btnClose',
k_isHidden: true,
k_isDefault: true,
k_caption: k_tr('Close', 'wlibButtons'),
k_onClick: function(k_toolbar) {
k_toolbar.k_dialog.k_showMask(kerio.lib.k_tr('Please wait…', 'wlibWait'));
k_toolbar.k_dialog.k_finishTrialRegistration();
}
},
{
k_isCancel: true,
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'wlibButtons')
}];

k_title = this.k_getTitle(k_isTrial);
k_dialogCfg = {
k_height: 412,
k_width: 550,
k_minHeight: 412,
k_minWidth: 550,
k_hasHelpIcon: false,
k_title: k_title,
k_content: k_wizard,
k_buttons: k_buttons
};
kerio.adm.k_widgets.K_ProductRegistrationWizard.superclass.constructor.call(this, k_objectName, k_dialogCfg);
this.k_addReferences({
k_wizard: k_wizard,
k_formManager: k_formManager,
k_isTrial: k_isTrial,
k_formStartRegistration: k_formStartRegistration,
k_formSubscriptions: k_formSubscriptions,
k_formDetails: k_formDetails,
k_formQuestions: k_formQuestions,
k_summaryGrid: k_summaryGrid,
k_formTrialId: k_formTrialId,
k_keyRegExp: k_keyRegExp,
k_title: k_title,
k_isBox: true === k_initParams.k_isBox,
k_newKissMode: k_initParams.k_newKissMode,
k_absoluteurlPattern: /^(http:\/\/|https:\/\/|\/)./i   });
k_formStartRegistration.k_addReferences({
k_dialog: this,
k_invalidLicenseNumber: k_tr('Please use valid format.<br>Example: 11111-12ABC-34XYZ', 'wlibProductRegistration')
});
k_formSubscriptions.k_addReferences({
k_dialog: this
});
k_wizard.k_addReferences({
k_dialog: this,
k_messages:{
k_trialIdsMgs : k_trialIdsMgs
}
});
this.k_toolbar.k_addReferences({
k_wizard: k_wizard,
k_formDetails: k_formDetails,
k_isTrial: k_isTrial
});
k_wizard.k_registerWizardButtons({
k_toolbar: this.k_toolbar,
k_validateBeforeClick: false,
k_prevButtonId: 'k_btnPrev',
k_nextButtonId: 'k_btnNext'
});
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_ProductRegistrationWizard', kerio.lib.K_Dialog, {

k_applyParams : function(k_params) {
var
k_captcha,
k_licenseNumber = '';
this.k_registrationFinished = false;
if (k_params) {
this.k_registrationCallback = k_params.k_callback;
this.k_registrationScope = k_params.k_scope;
this.k_closeCallback = k_params.k_closeCallback;
this.k_closeCallbackScope = k_params.k_closeCallbackScope;
this.k_token = k_params.k_token;
if (k_params.k_disableAddOn && this.k_formSubscriptions.k_subscriptionGrid) {
this.k_formSubscriptions.k_subscriptionGrid.k_toolbars.k_right.k_setVisible(!k_params.k_disableAddOn);
}
if (k_params.k_licenseNumber) {
k_licenseNumber = k_params.k_licenseNumber;
}
if (k_params.k_captchaUrl && (k_captcha = this.k_formStartRegistration.k_getItem('k_captcha'))) {
if (kerio.lib.k_isMyKerio) {
k_params.k_captchaUrl = kerio.lib.k_ajax.k_changeDownloadUrlForMyKerio(k_params.k_captchaUrl);
}
if (this.k_absoluteurlPattern.test(k_params.k_captchaUrl)) {
k_captcha.k_setValue(k_params.k_captchaUrl);
} else {
k_captcha.k_setValue(kerio.lib.k_kerioLibraryRoot + '../../../' + k_params.k_captchaUrl);
}
}
}
this.k_formStartRegistration.k_getItem('k_licenseNumber').k_unsetRegexValidator();
if (!this.k_isTrial) {
if (this.k_keyRegExp.test(k_licenseNumber)) {
this.k_formStartRegistration.k_setData({
k_licenseNumber: k_licenseNumber
});
this.k_formStartRegistration.k_getItem('k_securityCode').k_focus();
}
}
this.k_setRegistrationMode(this.k_isTrial);
this.k_formQuestions.k_getItem('k_computerCount').k_setValue('');
this.k_formQuestions.k_getItem('k_origin').k_setValue('');
this.k_toolbar.k_showItem('k_btnPrev', false);
this.k_setDefaultButton('k_btnNext');
},

k_setRegistrationMode : function(k_isTrial) {
if (k_isTrial) {
this.k_wizard.k_hideTab('k_subscriptionsTab');
this.k_wizard.k_hideTab('k_detailsTab');
this.k_wizard.k_hideTab('k_questionsTab');
this.k_wizard.k_hideTab('k_summaryTab');
this.k_wizard.k_showTab('k_trialIdTab');
}
else {
this.k_wizard.k_showTab('k_subscriptionsTab');
this.k_wizard.k_showTab('k_detailsTab');
this.k_wizard.k_showTab('k_questionsTab');
this.k_wizard.k_showTab('k_summaryTab');
this.k_wizard.k_hideTab('k_trialIdTab');
}
this.k_title = this.k_getTitle(k_isTrial);
},

k_formatDate : function(k_date){
var k_timestamp = Date.parseDate(k_date.year + '-' + k_date.month + '-' + k_date.day, 'Y-n-j');
if (k_timestamp) {
return k_timestamp.format('Y-m-d');
}
else {
return kerio.lib.k_tr('Already expired', 'wlibProductRegistration');
}
},

k_getRegistrationInfo : function(k_newTabId) {
var
k_data = this.k_formManager.k_getData(),
k_requestCfg;
this.k_newTabId = k_newTabId;
k_requestCfg = {
k_jsonRpc: {
method: 'ProductRegistration.get',
params: {
token: this.k_token,
securityCode: k_data.k_securityCode || '',
baseId: k_data.k_licenseNumber.toUpperCase()
}
},
k_scope: this,
k_callback: this._k_getRegistrationInfoCallback
};
this.k_baseId = k_data.k_licenseNumber.toUpperCase();
kerio.lib.k_ajax.k_request(k_requestCfg);
},

_k_getRegistrationInfoCallback : function (k_response) {
var
k_decoded = k_response.k_decoded,
k_isTrial,
k_wizard = this.k_wizard,
k_expirationDate,
k_expires,
k_registrationInfo,
k_details,
k_isTrialLicenseNumber;
if (!k_response.k_isOk) {
k_wizard.k_changePending = false;
this.k_hideMask();
return;
}
k_registrationInfo = k_decoded.registrationInfo;
k_expirationDate = k_registrationInfo.expirationDate;
k_expires = this.k_formatDate(k_expirationDate);
k_isTrialLicenseNumber = k_decoded.trial;
if (this.k_isTrial !== k_isTrialLicenseNumber) {
this.k_isTrial = k_isTrialLicenseNumber;
this.k_setRegistrationMode(k_isTrialLicenseNumber);
this.k_newTabId = k_isTrialLicenseNumber ? 'k_trialIdTab' : 'k_subscriptionsTab';
}
k_isTrial = this.k_isTrial;
if (!k_isTrial) {
if (!kerio.adm.k_registrationUtils.k_checkLicenseExpirationDate(k_expirationDate)) {
k_wizard.k_changePending = false;
this.k_hideMask();
return;
}
this.k_newRegistration = k_decoded.newRegistration;
if (this.k_formSubscriptions.k_subscriptionGrid) {
this.k_formSubscriptions.k_subscriptionGrid.k_setData(k_registrationInfo.regNumbers);
this.k_formSubscriptions.k_setData({
k_numberOfUsers: k_registrationInfo.subscribers,
k_expiration: k_expires
});
}
else {
this.k_formSubscriptions.k_setLicenseInfo(k_registrationInfo);
}
}
k_details = k_registrationInfo.details;
this.k_formDetails.k_setData({
k_organization: k_details.organization,
k_person: k_details.person,
k_email: k_details.email,
k_phone: k_details.phone,
k_web: k_details.web,
k_country: k_details.country ? k_details.country.toUpperCase() : 'US',
k_state: k_details.state ? k_details.state.toUpperCase() : '',
k_city: k_details.city,
k_street: k_details.street,
k_zip: k_details.zip,
k_comment: k_details.comment
});
this.k_formDetails.k_setDisabled('k_organization', !!k_details.organization);
if (!k_isTrial) {
if (false === k_registrationInfo.showQuestions) {
k_wizard.k_hideTab('k_questionsTab');
}
else {
k_wizard.k_showTab('k_questionsTab');
}
this.k_showFinish = k_registrationInfo.showQuestions ? 'k_questionsTab' : 'k_detailsTab';
}
else {
this.k_newTabId = 'k_trialIdTab';
}
k_registrationInfo.k_expires = k_expires;
k_registrationInfo.k_expirationDate = k_expirationDate;
this.k_registrationInfo = k_registrationInfo;
if (k_isTrial) {
this.k_finishTrialRegistration();
}
else {
k_wizard.k_setActiveTab(this.k_newTabId);
this.k_formStartRegistration.k_getItem('k_licenseNumber').k_setValue(this.k_baseId);
this.k_hideMask();
}
k_wizard.k_changePending = false;
},

k_finishRegistration : function() {
var
k_data,
k_requestCfg,
k_saveRegistrationInfo,
k_isTrial = this.k_isTrial,
k_lib = kerio.lib,
k_sharedConstants;
k_data = this.k_formManager.k_getData(true);
k_saveRegistrationInfo = {
details: {
organization: k_data.k_organization,
person: k_data.k_person,
email: k_data.k_email,
phone: k_data.k_phone,
web: k_data.k_web,
country: k_data.k_country,
state: k_data.k_state,
city: k_data.k_city,
street: k_data.k_street,
zip: k_data.k_zip,
comment: k_data.k_comment
},
expirationDate: this.k_registrationInfo.k_expirationDate
};
if (this.k_registrationInfo.showQuestions) {
k_saveRegistrationInfo.surveyAnswers = [{
questionID: '6', answer: k_data.k_computerCount
},
{
questionID: '1', answer: k_data.k_origin
}];
if (!k_isTrial) {
k_saveRegistrationInfo.surveyAnswers.push({
questionID: '7', answer: k_data.k_reseller
});
}
}
k_sharedConstants = kerio.lib.k_getSharedConstants();
if (this.k_formSubscriptions.k_subscriptionGrid) {
k_saveRegistrationInfo.regNumbers = this.k_formSubscriptions.k_subscriptionGrid.k_getData();
}
k_requestCfg = {
k_jsonRpc: {
method: 'ProductRegistration.finish',
params: {
token: this.k_token,
baseId: this.k_baseId,
registrationInfo: k_saveRegistrationInfo,
finishType:	k_sharedConstants.kerio_web_rfCreate
}
},
k_scope: this,

k_callback: function(k_response){
var k_lib = kerio.lib;
this.k_hideMask();
if (k_response.k_isOk) {
k_lib.k_alert(
k_lib.k_tr('Registration Result', 'wlibProductRegistration'),
k_lib.k_tr('Registration has been completed successfully. Thank you.', 'wlibProductRegistration')
);
this.k_registrationFinished = true;
this.k_hide();
}
}
};
k_lib.k_ajax.k_request(k_requestCfg);
},

k_finishTrialRegistration: function() {
var
k_requestCfg,
k_lib = kerio.lib,
k_sharedConstants = kerio.lib.k_getSharedConstants();
k_requestCfg = {
k_jsonRpc: {
method: 'ProductRegistration.finish',
params: {
token: this.k_token,
registrationInfo: {},
baseId: this.k_baseId,
finishType:	k_sharedConstants.kerio_web_rfStore
}
},
k_scope: this,
k_callback: this.k_finishTrialCallback
};
k_lib.k_ajax.k_request(k_requestCfg);
},

k_finishTrialCallback: function(k_response) {
var k_lib = kerio.lib;
this.k_hideMask();
if (k_response.k_isOk) {
k_lib.k_alert(
k_lib.k_tr('Registration Result', 'wlibProductRegistration'),
k_lib.k_tr('Registration has been completed successfully. Thank you.', 'wlibProductRegistration')
);
this.k_registrationFinished = true;
}
this.k_hide();
},

k_summarizeData : function () {
this.k_summaryGrid.k_setData(this.k_prepareSummarizeData());
},

k_prepareSummarizeData : function () {
var
k_sharedConstants = kerio.lib.k_getSharedConstants(),
k_tr = kerio.lib.k_tr,
k_data = this.k_formManager.k_getData(true),
k_registrationInfo = this.k_registrationInfo,
k_subscriptionRows = [],
k_expirationCaption,
k_subscriptions = '',
k_gridData,
k_row,
k_i, k_cnt;
if (this.k_formSubscriptions.k_subscriptionGrid) {
k_subscriptionRows = this.k_formSubscriptions.k_subscriptionGrid.k_getData();
}
else {
if (!this.k_isTrial) {
k_subscriptionRows.push(k_registrationInfo.regNumbers[0]);
}
}
if (!this.k_isTrial) {
for (k_i = 0, k_cnt = k_subscriptionRows.length; k_i < k_cnt; k_i++) {
k_row = k_subscriptionRows[k_i];
k_subscriptions += k_row.key + ', ' + k_row.type + ', ' + k_row.description + '\n';
}
k_expirationCaption = k_tr('Software Maintenance expires:', 'wlibProductRegistration');
}
else {
k_expirationCaption = this.k_getTrialExpires();
}
k_gridData = [
{caption: k_tr('Product:', 'wlibProductRegistration'), value: k_sharedConstants.kerio_web_ServerSoftware},
{caption: k_tr('System:', 'wlibProductRegistration'), value: k_sharedConstants.kerio_web_ServerOs},
{caption: k_expirationCaption, value: k_registrationInfo.k_expires},
{caption: k_tr('Number of users:', 'wlibProductRegistration'), value: k_registrationInfo.subscribers},
{caption: k_tr('License numbers:', 'wlibProductRegistration'), value: k_subscriptions},
{caption: k_tr('Organization:', 'wlibProductRegistration'), value: k_data.k_organization},
{caption: k_tr('Country:', 'wlibProductRegistration'), value: this.k_formDetails.k_getItem('k_country').k_getText()},
{caption: k_tr('State:', 'wlibProductRegistration'), value: this.k_formDetails.k_getItem('k_state').k_getText()},
{caption: k_tr('Email:', 'wlibCommon'), value: k_data.k_email},
{caption: k_tr('Person:', 'wlibProductRegistration'), value: k_data.k_person},
{caption: k_tr('Phone:', 'wlibProductRegistration'), value: k_data.k_phone},
{caption: k_tr('Street:', 'wlibProductRegistration'), value: k_data.k_street},
{caption: k_tr('City:', 'wlibProductRegistration'), value: k_data.k_city},
{caption: k_tr('Web:', 'wlibProductRegistration'), value: k_data.k_web},
{caption: k_tr('ZIP:', 'wlibProductRegistration'), value: k_data.k_zip},
{caption: k_tr('Comment:', 'wlibProductRegistration'), value: k_data.k_comment}
];
if (this.k_isBox) { k_gridData[1] = {caption: k_tr('Serial number:', 'wlibProductRegistration'), value: k_sharedConstants.kerio_web_SerialNumber};
}
if (this.k_isTrial) {
k_gridData.splice(3, 2);
}
return k_gridData;
},

k_resetOnClose: function() {
this.k_formManager.k_reset();
this.k_wizard.k_setActiveTab('k_startRegistrationTab');
this.k_toolbar.k_showItem(['k_btnNext', 'k_btnCancel'], true);
this.k_toolbar.k_showItem(['k_btnPrev', 'k_btnFinish', 'k_btnClose'], false);
if (this.k_formSubscriptions.k_resetData) {
this.k_formSubscriptions.k_resetData();
}
if (true === this.k_registrationFinished && undefined !== this.k_registrationCallback) {
this.k_registrationCallback.call(this.k_registrationScope);
}
if (undefined !== this.k_closeCallback) {
this.k_closeCallback.call(this.k_closeCallbackScope);
}
},
_k_createSubscriptionForm: function(k_localNamespace) {
var
k_tr = kerio.lib.k_tr,
k_subscriptionGridCfg,
k_subscriptionGrid,
k_formSubscriptionsCfg,
k_formSubscriptions;
k_subscriptionGridCfg = {
k_isStateful: false,
k_columns: {
k_isColumnHidable: false,
k_sorting: false,
k_items: [{
k_columnId: 'key',
k_caption: k_tr('Key', 'wlibProductRegistration'),
k_width: 150,
k_editor: {
k_type: 'k_text',
k_columnId: 'key',
k_maxLength: 17,

k_onKeyPress: function(k_grid, k_item, k_event) {
var	k_key = k_event.getKey();
if (k_key === kerio.lib.k_constants.k_EVENT.k_KEY_CODES.k_ESC) {
k_event.stopEvent();
k_item.k_setValue('');
k_grid.k_form._k_onRemoveLicense(k_grid.k_toolbars.k_right);
}
},

k_onBeforeEdit: function(k_grid, k_columnId, k_value, k_rowData) {
k_grid.k_toolbars.k_right.k_isRemove = false;
return k_rowData.allowEdit === true;
}
}
},
{
k_columnId: 'type',
k_caption: k_tr('Type', 'wlibProductRegistration'),
k_width: 50
},
{
k_columnId: 'description',
k_caption: k_tr('Description', 'wlibCommon'),

k_renderer: function(k_value, k_rowData, k_columnIndex, k_rowIndex, k_grid) {
var
k_data,
k_iconCls = '';
switch (k_value) {
case 'loading':
k_data = k_grid.k_translations.k_verifying;
k_iconCls = 'loading';
break;
case 'incorrect':
k_data = k_grid.k_translations.k_incorrect;
k_iconCls = '';
break;
case 'exists':
k_data = k_grid.k_translations.k_exists;
k_iconCls = '';
break;
default:
k_data = k_value;
}
return {
k_data: k_data,
k_iconCls: k_iconCls
};
}
},
{
k_columnId: 'allowEdit',
k_isDataOnly: true
}]
},
k_toolbars: {
k_right: {
k_items: [{
k_type: 'K_BTN_ADD',

k_onClick: function(k_toolbar) {
k_toolbar.k_isEdited = true;
k_toolbar.k_relatedWidget.k_addRow({
key: '',
type: '',
description: '',
allowEdit: true
});
k_toolbar.k_enableItem('k_btnEdit', false);
k_toolbar.k_relatedWidget.k_startCellEdit((k_toolbar.k_relatedWidget.k_getRowsCount() - 1), 'key');
}
},
{
k_caption: k_tr('Edit', 'wlibProductRegistration'),
k_id: 'k_btnEdit',

k_onClick: function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget,
k_row = k_grid.k_selectionStatus.k_rows[0];
k_toolbar.k_isEdited = true;
k_grid.k_startCellEdit(k_row.k_rowIndex, 'key');
}
},
{
k_type: 'K_BTN_REMOVE',

k_onClick: function (k_toolbar) {
k_toolbar.k_relatedWidget.k_form._k_onRemoveLicense(k_toolbar);
}
}]
}
},

k_rowRenderer: function(k_rowData) {
return (true !== k_rowData.allowEdit ? 'x-item-disabled x-form-empty-field' : '');
}
};
k_subscriptionGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'k_formSubscriptions' + '_' + 'k_grid', k_subscriptionGridCfg);

k_subscriptionGrid.k_getColumnEditor('key').k_extWidget.gridEditor.on('beforecomplete', function(k_editor) {
var
k_item = k_editor.field._kx.k_owner,
k_grid = k_item.k_parent;
var
k_info = k_grid.k_getEditInfo(),
k_index = k_info.k_rowIndex,
k_data = k_grid.k_getData(),
k_cnt = k_data.length,
k_form = k_grid.k_form,
k_dialog = k_form.k_dialog,
k_value = k_item.k_getValue(),
k_rightToolbar = k_grid.k_toolbars.k_right,
k_alreadyExists = false,
k_isValid = true,
k_i,
k_description,
k_valueUppercase;
if (k_rightToolbar.k_isRemove) {
k_rightToolbar.k_isEdited = false;
k_rightToolbar.k_isRemove = false;
k_rightToolbar.k_update(k_grid);
return;
}
if (0 === k_data.length) {
return;
}
k_valueUppercase = k_value.toUpperCase();
if (k_dialog.k_keyRegExp.test(k_value)) {
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_i === k_index) {
continue;
}
if (k_data[k_i].key.toUpperCase() === k_valueUppercase) {
k_alreadyExists = true;
k_grid.k_updateRow({description: 'exists'}, k_index);
k_rightToolbar.k_isEdited = true;
k_isValid = false;
break;
}
}
k_description = k_data[k_index].description;
if (!k_alreadyExists) {
if (k_dialog.k_prevKey != k_value) {
k_dialog.k_prevKey = k_value;
k_grid.k_updateRow({
description: 'loading',
key: k_value
}, k_index);
k_form.k_verifyNumbers(k_index);
}
else if ('loading' !== k_description && 'incorrect' !== k_description && 'exists' !== k_description) {
}
else {
k_rightToolbar.k_isEdited = true;
k_isValid = false;
}
}
k_rightToolbar.k_isEdited = false;
}
else { k_grid.k_updateRow({description: 'incorrect'}, k_index);
k_rightToolbar.k_isEdited = true;
k_isValid = false;
}
k_item.k_markInvalid(!k_isValid);
return k_isValid;
});

k_subscriptionGrid.k_toolbars.k_right.k_update = function(k_grid){
var
k_selectionStatus = k_grid.k_selectionStatus,
k_rows = k_selectionStatus.k_rows,
k_rowsCount = k_rows.length,
k_toolbar = k_grid.k_toolbars.k_right,
k_isEditable = true,
k_isVerifying = false,
k_i;
for (k_i = 0; k_i < k_rowsCount; k_i++) {
if (true !== k_rows[k_i].k_data.allowEdit) {
k_isEditable = false;
}
if ('loading' === k_rows[k_i].k_data.description) {
k_isVerifying = true;
}
}
k_toolbar.k_enableItem('k_btnAdd', !k_toolbar.k_isEdited && !k_isVerifying);
k_toolbar.k_enableItem('k_btnEdit', 1 === k_rowsCount && k_isEditable && !k_toolbar.k_isEdited);
k_toolbar.k_enableItem('k_btnRemove', k_rowsCount >= 1 && k_isEditable && !k_isVerifying);
};
k_formSubscriptionsCfg = {
k_items: [{
k_type: 'k_display',
k_value: k_tr('Enter additional license numbers you want to register.', 'wlibProductRegistration')
},
{
k_type: 'k_container',
k_content: k_subscriptionGrid
},
{
k_type: 'k_container',
k_height: 45,
k_labelWidth: 220,
k_items: [{
k_type: 'k_display',
k_id: 'k_numberOfUsers',
k_caption: k_tr('Number of users:', 'wlibProductRegistration')
},
{
k_type: 'k_display',
k_id: 'k_expiration',
k_caption: k_tr('Software Maintenance expires:', 'wlibProductRegistration')
}]
}]
};
k_formSubscriptions = new kerio.lib.K_Form(k_localNamespace + 'k_formSubscriptions', k_formSubscriptionsCfg);
k_subscriptionGrid.k_addReferences({
k_form: k_formSubscriptions,
k_translations: {
k_verifying: kerio.lib.k_tr('Verifying key', 'wlibProductRegistration'),
k_incorrect: kerio.lib.k_tr('Incorrect key', 'wlibProductRegistration'),
k_exists: kerio.lib.k_tr('Key already inserted', 'wlibProductRegistration')
}
});
k_formSubscriptions.k_addReferences({
k_subscriptionGrid: k_subscriptionGrid
});

k_formSubscriptions._k_onRemoveLicense = function(k_toolbar) {
k_toolbar.k_isEdited = false;
k_toolbar.k_isRemove = true;
k_toolbar.k_relatedWidget.k_stopCellEdit(true);
this.k_prevKey = '';
if (undefined !== this.k_requestId) {
kerio.lib.k_ajax.k_abort(this.k_requestId);
delete this.k_requestId;
}
this.k_subscriptionGrid.k_removeSelectedRows();
this.k_verifyNumbers();
};

k_formSubscriptions.k_verifyNumbers = function(k_index) {
var
k_requestCfg,
k_i,
k_dialog = this.k_dialog,
k_regNumbersToVerify = [],
k_gridData = this.k_subscriptionGrid.k_getData(),
k_cnt = k_gridData.length;
k_dialog.k_toolbar.k_disableItem('k_btnPrev');
k_dialog.k_toolbar.k_disableItem('k_btnNext');
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_dialog.k_keyRegExp.test(k_gridData[k_i].key)) {
k_regNumbersToVerify.push(k_gridData[k_i].key);
}
}
k_requestCfg = {
k_jsonRpc: {
method: 'ProductRegistration.verifyNumber',
params: {
token: k_dialog.k_token,
baseId: k_dialog.k_baseId,
regNumbersToVerify: k_regNumbersToVerify
}
},

k_callback: function(k_response, k_success, k_callbackParams) {
var
k_index = k_callbackParams.k_index,
k_decoded = k_response.k_decoded,
k_grid = this.k_subscriptionGrid,
k_dialog = this.k_dialog,
k_startCellEdit = false,
k_description,
k_expirationDate,
k_expires,
k_key,
k_regNumberInfo,
k_type = '';
if (k_response.k_isOk && 0 === k_decoded.errors.length) { k_regNumberInfo = k_decoded.regNumberInfo;
if (undefined !== k_index) {
k_description = k_regNumberInfo[k_index].description;
k_type = k_regNumberInfo[k_index].type;
k_key = k_regNumberInfo[k_index].key.toUpperCase();
}
k_expirationDate = k_decoded.expirationDate;
k_expires = k_dialog.k_formatDate(k_expirationDate);
this.k_setData({
k_numberOfUsers: k_decoded.users,
k_expiration: k_expires
});
k_dialog.k_registrationInfo.subscribers = k_decoded.users;
k_dialog.k_registrationInfo.k_expires = k_expires;
}
else {
k_description = 'incorrect';
if (undefined !== k_index) {
k_grid.k_toolbars.k_right.k_isEdited = true;
k_startCellEdit = true;
}
}
if (undefined !== k_index) {
k_grid.k_updateRow({key: k_key, description: k_description, type: k_type}, k_index);
k_grid.k_refresh();
if (k_startCellEdit) {
k_grid.k_startCellEdit(k_index, 'key');
k_grid.k_getColumnEditor('key').k_markInvalid(true);
}
}
k_dialog.k_toolbar.k_enableItem('k_btnPrev');
k_dialog.k_toolbar.k_enableItem('k_btnNext');
},
k_callbackParams: {
k_index: k_index
},
k_scope: this
};
this.k_requestId = kerio.lib.k_ajax.k_request(k_requestCfg);
};
k_formSubscriptions.k_resetData = function() {
var
k_grid = this.k_subscriptionGrid,
k_toolbar = k_grid.k_toolbars.k_right;
k_grid.k_clearData();
k_toolbar.k_isEdited = false;
k_toolbar.k_isRemove = false;
};
return k_formSubscriptions;
},  _k_createLicenseInfoForm: function(k_localNamespace) {
var
k_tr = kerio.lib.k_tr,
k_form;
k_form = new kerio.lib.K_Form(k_localNamespace + 'k_licenseInfoForm', {
k_items: [{
k_type: 'k_display',
k_value: k_tr('License details:', 'wlibProductRegistration')
},{
k_id: 'k_licenseInfo',
k_type: 'k_display',
k_value: '',
k_template: [
'<br>',
'<table style="margin-left: 20px;"><tbody>',
'<tr><td style="width: 220px;">' + k_tr('License number:', 'wlibProductRegistration') + '</td><td>{k_licenseNumber}</td></tr>',
'<tr><td>' + k_tr('Product:', 'wlibProductRegistration') + '</td><td>{k_product}</td></tr>',
'<tr><td>' + k_tr('Number of users:', 'wlibSplashScreen') + '</td><td>{k_subscribers}</td></tr>',
'<tr><td>' + k_tr('Software Maintenance expires:', 'wlibProductRegistration') + '</td><td>{k_expirationDate}</td></tr>',
'<tr><td>' + k_tr('Extensions:', 'wlibProductRegistration') + '</td><td>{k_extensions}</td></tr>',
'</tbody></table><br>',
'<a href="https://secure.kerio.com/reg_info/" target="_blank">',
k_tr('Register multiple license numbers', 'wlibProductRegistration') + '</a><br>',
k_tr('The earlier licensing system used multiple numbers, such as for adding users, Software Maintenance renewal or enabling the antivirus module.', 'wlibProductRegistration')
].join('')
}]
});
k_form.k_setLicenseInfo = function(k_registrationInfo) {
var
k_regNumber = k_registrationInfo.regNumbers[0],
k_extensionList = k_registrationInfo.extensions,
k_extensions = [],
k_i, k_cnt;
for (k_i = 0, k_cnt = k_extensionList.length; k_i < k_cnt; k_i++) {
k_extensions.push(k_extensionList[k_i].name);
}
this.k_getItem('k_licenseInfo').k_setValue({
k_licenseNumber: k_regNumber.key,
k_product: k_regNumber.description,
k_subscribers: k_registrationInfo.subscribers,
k_expirationDate: this.k_dialog.k_formatDate(k_registrationInfo.expirationDate),
k_extensions: k_extensions.join(', ')
});
};
return k_form;
},

k_getTrialRegistrationInfo: function(k_initParams) {
return false === k_initParams.k_isSophosProduct
? kerio.lib.k_tr('Trial registration entitles you to request technical support during the trial period.', 'wlibProductRegistration')
: kerio.lib.k_tr('Trial registration entitles you to request technical support and allows to update the integrated Sophos antivirus during the trial period.', 'wlibProductRegistration');
},

k_getTrialId: function(k_initParams) {
return k_initParams.k_newKissMode
? kerio.lib.k_tr('Trial License ID', 'wlibProductRegistration')
: kerio.lib.k_tr('Trial ID', 'wlibProductRegistration');
},

k_getTrialIdIs: function(k_initParams) {
return k_initParams.k_newKissMode
? kerio.lib.k_tr('Your trial license ID is:', 'wlibProductRegistration')
: kerio.lib.k_tr('Your trial ID is:', 'wlibProductRegistration');
},

k_getTrialNotificationInfo: function(k_initParams) {
return kerio.lib.k_tr('An email message will arrive shortly at your address. Click on the link contained in the message to activate your trial registration. After that, the Trial ID entitles you to request technical support during your trial period.', 'wlibProductRegistration');
},

k_getTitle: function(k_isTrial) {
return k_isTrial
? kerio.lib.k_tr('Trial Registration', 'wlibProductRegistration')
: kerio.lib.k_tr('Product Registration', 'wlibProductRegistration');
},

k_getTrialExpires: function() {
return kerio.lib.k_tr('Trial expires:', 'wlibProductRegistration');
},

k_getCaptchaExplainMsg: function(k_initParams) {
return kerio.lib.k_tr('To provide the highest security possible, retyping of the text displayed on the security image is required in the textfield below.', 'wlibProductRegistration');
}
});


kerio.adm.k_widgets.K_SplashScreenForm = function(k_objectName, k_config) {
var
k_linkActions = {}, k_topRows = [],
k_bottomRows = [],
k_currentRows,
k_formCfg,
k_toolbarCfg,
k_i, k_cnt, k_row;
this.k_splashScreenNamespace = k_objectName + '_';
this.k_linkActions = k_linkActions;
k_config = k_config || {};
k_config.k_toolbars = k_config.k_toolbars || {};
k_config.k_product = k_config.k_product || {};
if (!k_config.k_toolbars.k_top && (k_config.k_product && true !== k_config.k_product.k_noRegistration)) {

k_toolbarCfg = {
k_className: 'splashToolbar',
k_items: [
kerio.lib.k_tr('Help us make %1 even better.', 'wlibSplashScreen', { k_args: [k_config.k_product.k_name]}) + '&nbsp;&nbsp;',
{
k_id: 'k_btnSuggestIdea',
k_mask: false,
k_caption: kerio.lib.k_tr('Suggest Idea…', 'wlibSplashScreen'),

k_onClick: function(k_toolbar) {
if (!k_toolbar.k_parentWidget.k_isRegistered()) {
return;
}
if (false === k_toolbar.k_parentWidget._k_notifyApp('k_onBeforeDialogOpen', 'k_userVoiceStatus')) {
return;
}
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'UserVoice.getStatus'
},

k_callback: k_toolbar.k_suggestIdeaCallback,
k_scope: k_toolbar,
k_requestOwner: null
});
} }
]
};
if (false !== k_config.k_product.k_isFinal) { k_toolbarCfg.k_items.push({
k_id: 'k_btnSupportIncident',
k_caption: kerio.lib.k_tr('Technical Support…', 'wlibSplashScreen'),

k_onClick: function(k_toolbar) {
if (!k_toolbar.k_parentWidget.k_isRegistered()) {
return;
}
k_toolbar.k_parentWidget._k_goToSupportWeb();
}
});
}
else {
k_toolbarCfg.k_items.push({
k_id: 'k_btnReportProblem',
k_caption: kerio.lib.k_tr('Report Problem…', 'wlibSplashScreen'),

k_onClick: function(k_toolbar) {
if (!k_toolbar.k_parentWidget.k_isRegistered()) {
return;
}
var
k_dialogId = 'k_reportProblem',
k_userInfo;
k_userInfo = k_toolbar.k_parentWidget._k_notifyApp('k_onBeforeDialogOpen', k_dialogId);
if (false === k_userInfo) {
return;
}
k_userInfo = k_userInfo || {};
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'reportProblem',
k_objectName: k_dialogId,
k_params: {
k_licenseNumber: k_toolbar.k_relatedWidget.k_licenseNumber,
k_product: k_toolbar.k_relatedWidget.k_product,
k_version:  k_toolbar.k_relatedWidget.k_version,
k_serverOs: k_toolbar.k_relatedWidget.k_serverOs,
k_username: k_userInfo.k_fullname,
k_email: k_userInfo.k_email
}
});
} });
}
k_config.k_toolbars.k_top = new kerio.lib.K_Toolbar(this.k_splashScreenNamespace + 'k_toolbar', k_toolbarCfg);
} k_formCfg = {
k_toolbars: k_config.k_toolbars
};
kerio.adm.k_widgets.K_SplashScreenForm.superclass.constructor.call(this, k_objectName, k_formCfg);
this.k_extWidget.on('render', this.k_showMask, this);
this.k_extWidget.on('afterrender', function() {
this._k_notifyApp('k_onAfterLoad');
this.k_hideMask();
}, this, { single: true});
this.k_extWidget.on('afterlayout', this.k_resize, this); this.k_splashScreen = this;
this._k_elementsId = [];
k_topRows = k_topRows.concat(this.k_processRows(k_config.k_product || {})); k_currentRows = k_topRows; if (k_config.k_additionalRows) {
for (k_i = 0, k_cnt = k_config.k_additionalRows.length; k_i < k_cnt; k_i++) {
k_row = k_config.k_additionalRows[k_i];
if (' ' === k_row) {
k_row = { k_type: 'k_empty' };
}
else if ('->' === k_row) {
k_row = { k_type: 'k_bottom' };
}
if ('object' !== typeof k_row) {
return;
}
else if ('k_bottom' === k_row.k_type) {
k_currentRows = k_bottomRows;
continue;
}
k_currentRows.push(this.k_processRow(k_row));
} } k_bottomRows.push(this.k_getSimpleRow({
k_id: 'k_legalNotices',
k_className: 'legalNotices',
k_align: 'right',
k_value: kerio.lib.k_tr('Legal Notices', 'wlibSplashScreen'),
k_link: function() {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'htmlDialog',
k_objectName: 'legalNotices',
k_initParams: {
k_title: kerio.lib.k_tr('Legal Notices', 'wlibSplashScreen'),
k_url: kerio.adm.k_framework.k_getPredefinedUrl('legalnotices.html')
}
});
}
}));
this.k_extWidget.html = '<div class="splashScreenContainer">' + this.k_getSplashBody({
k_productVersion: k_config.k_product.k_version || '',
k_topRows: k_topRows,
k_bottomRows: k_bottomRows
}) + '</div>';
this.k_extWidget.afterRender = this.k_extWidget.afterRender.createInterceptor(this._k_initElements, this);
this.k_splashScreen.k_addReferences({
k_isBox: true === k_config.k_product.k_isBox,
k_isSophosProduct: false !== k_config.k_product.k_isSophosProduct,
_k_localNamespace: this.k_splashScreenNamespace,

_k_initMethods: [],
_k_isInitiated: false
});
this.k_splashScreen._k_isRegistered= false;
this.k_splashScreen.k_addReferences(k_config.k_additionalReferences || {});
if (this.k_splashScreen.k_toolbars && this.k_splashScreen.k_toolbars.k_top) {
this.k_splashScreen.k_toolbars.k_top.k_addReferences({

k_suggestIdeaCallback: function(k_response) {
var k_userInfo;
if (k_response.k_isOk) {
if (true !== k_response.k_decoded.isSet) {
k_userInfo = this.k_relatedWidget._k_notifyApp('k_onBeforeDialogOpen', 'k_suggestIdea');
if (false === k_userInfo) {
return;
}
else {
k_userInfo = k_userInfo || {};
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'suggestIdea',
k_objectName: 'k_suggestIdea',
k_params: {
k_username: k_userInfo.k_fullname,
k_email: k_userInfo.k_email
}
});
}
else { kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'UserVoice.getUrl',
params: {
name: '',
email: ''
}
},

k_callback: this.k_gotoUrlCallback,
k_scope: this
});
}
}
}, 
k_gotoUrlCallback: function(k_response){
if (k_response.k_isOk) {
if (false === this.k_relatedWidget._k_notifyApp('k_onBeforeDialogOpen', 'k_userVoice', k_response.k_decoded.url)) {
return;
}
kerio.lib.k_openWindow(k_response.k_decoded.url);
}
} });
}
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_SplashScreenForm', kerio.lib.K_Form, {

k_processRows: function(k_product) {
var
k_lib = kerio.lib,
k_splashScreen = this.k_splashScreen,
k_ENGINE_CONSTANTS = k_lib.k_getSharedConstants(),
k_isBox = true === k_product.k_isBox,
k_tr = k_lib.k_tr,
k_isNewVersionAvailable,
k_showRegistrationLinks,
k_rows = [],
k_tmp;
k_product.k_license = k_product.k_license || {};
k_splashScreen.k_noRegistration = k_product.k_noRegistration;
k_showRegistrationLinks = !k_product.k_noRegistration;
k_isNewVersionAvailable = k_product.k_newVersionLink && k_product.k_newVersionLink.length > 0;
k_splashScreen.k_product = k_product.k_name;
k_splashScreen.k_version = k_product.k_version;
k_splashScreen.k_serverOs = k_product.k_serverOs;
k_splashScreen._k_initExpirationInfo(k_product.k_license);
k_tmp = k_splashScreen.k_getLicenseText(k_product.k_license);
k_rows.push(this.k_getColumnsRow({
k_id: 'k_license',
k_className: 'license',
k_caption: k_tmp.k_caption,
k_value: k_tmp.k_value
}));
k_splashScreen.k_setRowBold('k_license');
k_tmp = k_splashScreen.k_getExpirationText(k_product.k_license, k_ENGINE_CONSTANTS.kerio_web_Subscription);
k_rows.push(this.k_getColumnsRow({
k_id: 'k_subscriptionExpire',
k_className: 'expire subscription',
k_caption: k_tr('Software Maintenance expiration date:', 'wlibSplashScreen'),
k_value: k_tmp
}));
if (k_tmp) {
k_splashScreen.k_setRowRed('k_subscriptionExpire', k_splashScreen.k_expiredIn30Days[k_ENGINE_CONSTANTS.kerio_web_Subscription] && k_ENGINE_CONSTANTS.kerio_web_rsProductRegistered == k_product.k_license.regType);
}
k_tmp = k_splashScreen.k_getExpirationText(k_product.k_license, k_ENGINE_CONSTANTS.kerio_web_License);
k_rows.push(this.k_getColumnsRow({
k_id: 'k_licenseExpire',
k_className: 'expire license',
k_caption: k_tr('Product expiration date:', 'wlibSplashScreen'),
k_value: k_tmp
}));
if (k_tmp) {
k_splashScreen.k_setRowRed('k_licenseExpire', k_splashScreen.k_expiredIn30Days[k_ENGINE_CONSTANTS.kerio_web_License]);
}
k_tmp = (k_product.k_license.users ? k_product.k_license.users : '');
k_rows.push(this.k_getColumnsRow({
k_id: 'k_licensedUsers',
k_className: 'users licensed',
k_caption: k_tr('Number of users allowed by the license:', 'wlibSplashScreen'),
k_value: k_tmp
}));
k_rows.push(this.k_getColumnsRow({
k_id: 'k_additionalUsers',
k_className: 'users additional',
k_caption: '',
k_value: ''
}));
k_splashScreen.k_setRowVisible('k_additionalUsers', false);
k_rows.push(this.k_getEmptyRow({
k_id: 'k_infoSeparator'
}));
k_tmp = k_product.k_license.company || '';
k_rows.push(this.k_getColumnsRow({
k_id: 'k_company',
k_className: 'company',
k_caption: k_tr('Company:', 'wlibSplashScreen'),
k_value: k_tmp
}));
k_tmp = k_product.k_serverName || '';
k_rows.push(this.k_getColumnsRow({
k_id: 'k_serverName',
k_className: 'serverName',
k_caption: k_tr('Host:', 'wlibSplashScreen'),
k_value: k_tmp
}));
if (k_isBox) { k_rows.push(this.k_getColumnsRow({
k_id: 'k_boxSn',
k_className: 'boxSn',
k_caption: k_tr('Serial number:', 'wlibSplashScreen'),
k_value: k_lib.k_getSharedConstants().kerio_web_SerialNumber
}));
}
else { k_tmp = k_product.k_serverOs || '';
k_rows.push(this.k_getColumnsRow({
k_id: 'k_serverOs',
k_className: 'serverOs',
k_caption: k_tr('Operating system:', 'wlibSplashScreen'),
k_value: k_tmp
}));
}
if (k_showRegistrationLinks || k_isNewVersionAvailable) {
k_rows.push(this.k_getEmptyRow({
k_id: 'k_regSeparator'
}));
}
if (k_isNewVersionAvailable) {
k_rows.push(this.k_getSimpleRow({
k_id: 'k_newVersionLink',
k_value: k_tr('New version available, click here for details…', 'wlibSplashScreen'),
k_link: k_product.k_newVersionLink
}));
}
if (k_showRegistrationLinks) {
k_rows.push(this.k_getSimpleRow({
k_id: 'k_registerTrial',
k_className: 'register trial',
k_value: this.k_getTrialRegistrationMsg(),
k_link: k_splashScreen._k_registerTrial
}));
k_splashScreen.k_setRowVisible('k_registerTrial', k_ENGINE_CONSTANTS.kerio_web_rsNoRegistration === k_product.k_license.regType && !k_isBox);
k_tmp = (k_ENGINE_CONSTANTS.kerio_web_rsProductRegistered === k_product.k_license.regType) ? k_tr('Update registration info…', 'wlibSplashScreen') : k_tr('Register product with a purchased license number…', 'wlibSplashScreen');
k_rows.push(this.k_getSimpleRow({
k_id: 'k_registerProduct',
k_className: 'register product',
k_value: k_tmp,
k_link: k_splashScreen._k_registerProduct
}));
if (true !== k_lib.k_isIPadCompatible) {
k_rows.push(this.k_getSimpleRow({
k_id: 'k_installLicense',
k_className: 'register license',
k_value: k_tr('Install license…', 'wlibSplashScreen'),
k_link: k_splashScreen._k_registerLicense
}));
}
}
return k_rows;
}, k_processRow: function(k_config) {
var
k_splashScreen = this.k_splashScreen,
k_align;
if (!k_config.hasOwnProperty('k_id')) {
this._k_getId(k_config);
}
if (k_config.hasOwnProperty('k_isBold')) {
k_splashScreen.k_setRowBold(k_config.k_id, k_config.k_isBold);
}
if (k_config.hasOwnProperty('k_isRed')) {
k_splashScreen.k_setRowRed(k_config.k_id, k_config.k_isRed);
}
if (k_config.hasOwnProperty('k_isHidden')) {
k_splashScreen.k_setRowVisible(k_config.k_id, !k_config.k_isHidden);
}
if (undefined === k_config.k_type) {
k_config.k_type = (k_config.k_caption ? 'k_columns' : 'k_left');
}
switch (k_config.k_type) {
case 'k_empty':
return this.k_getEmptyRow({
k_id: k_config.k_id
});
case 'k_columns':
return this.k_getColumnsRow({
k_id: k_config.k_id,
k_className: k_config.k_className,
k_caption: k_config.k_caption,
k_value: k_config.k_value,
k_link: k_config.k_link
});
case 'k_right':
k_align = k_align || 'right';
case 'k_center':
k_align = k_align || 'center';
case 'k_left':
k_align = 'left';
return this.k_getSimpleRow({
k_id: k_config.k_id,
k_className: k_config.k_className,
k_align: k_align,
k_value: k_config.k_value,
k_link: k_config.k_link
});
case 'k_html':
return k_config.k_value;
default:
kerio.lib.k_reportError('Unknown row type ' + k_config.k_type + '.', 'splashScreen.js', 'k_init');
break;
}
}, 
_k_getId: function(k_config) {
if (!k_config.k_id) {
k_config.k_id = Ext.id(null, 'k_row' + '_gen');
}
return k_config.k_id;
},

k_getColumnsRow: function(k_data) {
var
k_elementsId = this.k_splashScreen._k_elementsId,
k_captionElId,
k_valueElId,
k_htmlTemplate,
k_extTemplate,
k_value;
this._k_getId(k_data);
k_htmlTemplate = '<div id="{rowId}" class="row columns {rowClass}">'
+ '<div id="{captionId}" class="caption">{rowCaption}</div>'
+ '<div id="{valueId}" class="value">{rowValue}</div>'
+ '</div>';
k_extTemplate = new Ext.XTemplate(k_htmlTemplate);
if (k_data.k_link) {
k_value = this.k_getLink({
k_id: k_data.k_id,
k_caption: k_data.k_value,
k_link: k_data.k_link
});
}
else {
k_value = kerio.lib.k_htmlEncode(k_data.k_value);
}
k_captionElId = k_data.k_id + '_' + 'k_caption';
k_valueElId = k_data.k_id + '_' + 'k_value';
k_elementsId.push(k_data.k_id);
k_elementsId.push(k_captionElId);
k_elementsId.push(k_valueElId);
return k_extTemplate.apply({
rowId: this.k_splashScreenNamespace + k_data.k_id,
rowClass: k_data.k_className,
captionId: this.k_splashScreenNamespace + k_captionElId,
valueId: this.k_splashScreenNamespace + k_valueElId,
rowCaption: kerio.lib.k_htmlEncode(k_data.k_caption),
rowValue: k_value
});
}, 
k_getSimpleRow: function(k_data) {
var
k_elementsId = this.k_splashScreen._k_elementsId,
k_valueElId,
k_htmlTemplate,
k_extTemplate,
k_value;
this._k_getId(k_data);
k_htmlTemplate = '<div id="{rowId}" class="row simple {rowAlign} {rowClass}">'
+ '<div id="{valueId}" class="value">{rowValue}</div>'
+ '</div>';
k_extTemplate = new Ext.XTemplate(k_htmlTemplate);
k_valueElId = k_data.k_id + '_' + 'k_value';
k_elementsId.push(k_data.k_id);
k_elementsId.push(k_valueElId);
if (k_data.k_link) {
k_value = this.k_getLink({
k_id: k_data.k_id,
k_caption: k_data.k_value,
k_link: k_data.k_link
});
}
else {
k_value = kerio.lib.k_htmlEncode(k_data.k_value);
}
return k_extTemplate.apply({
rowId: this.k_splashScreenNamespace + k_data.k_id,
rowClass: k_data.k_className,
rowAlign: k_data.k_align || 'left',
valueId: this.k_splashScreenNamespace + k_valueElId,
rowValue: k_value
});
}, 
k_getEmptyRow: function(k_data) {
var
k_htmlTemplate,
k_extTemplate;
this._k_getId(k_data);
k_htmlTemplate = '<div id="{rowId}" class="row empty">&nbsp;</div>';
this.k_splashScreen._k_elementsId.push(k_data.k_id);
k_extTemplate = new Ext.XTemplate(k_htmlTemplate);
return k_extTemplate.apply({
rowId: this.k_splashScreenNamespace + k_data.k_id
});
}, 
k_getLink: function(k_data) {
var
k_splashScreen = this.k_splashScreen,
k_htmlTemplate,
k_extTemplate;
k_htmlTemplate = '<a id="{linkId}" class="link textLink" href="#">{linkValue}</a>';
k_extTemplate = new Ext.XTemplate(k_htmlTemplate);
k_splashScreen.k_setLinkAction(k_data.k_id, k_data.k_link); k_splashScreen._k_elementsId.push(k_data.k_id + '_' + 'k_link');
return k_extTemplate.apply({
linkId: this.k_splashScreenNamespace + k_data.k_id + '_' + 'k_link',
linkValue: kerio.lib.k_htmlEncode(k_data.k_caption)
});
}, 
k_getSplashBody: function(k_config) {
var
k_htmlTemplate,
k_extTemplate;
k_htmlTemplate = '<div id="{splashId}" class="splashScreen selectable">'
+ '<div id="{versionId}" class="rows productVersion">{productVersion}</div>'
+ '<div id="{topRowsId}" class="rows top">{topRows}</div>'
+ '<div id="{bottomRowsId}" class="rows bottom">{bottomRows}</div>'
+ '<div id="{copyrightId}" class="rows copyright">'
+ '&copy; <a href="http://www.kerio.com" onclick="kerio.lib.k_openWindow(\'http://www.kerio.com\'); return false;">Kerio Technologies s.r.o.</a> ' + kerio.lib.k_tr('All rights reserved.', 'wlibSplashScreen')
+ '</div>'
+ '</div>';
k_extTemplate = new Ext.XTemplate(k_htmlTemplate);
return k_extTemplate.apply({
splashId:     this.k_splashScreenNamespace + 'k_splashScreen',
versionId:    this.k_splashScreenNamespace + 'k_splashProductVersion',
topRowsId:    this.k_splashScreenNamespace + 'k_topRows',
bottomRowsId: this.k_splashScreenNamespace + 'k_bottomRows',
copyrightId:  this.k_splashScreenNamespace + 'k_copyright',
productVersion: k_config.k_productVersion,
topRows: k_config.k_topRows.join('\n'),
bottomRows: k_config.k_bottomRows.join('\n')
});
}, 
_k_initElements: function () {
var
k_elements = {},
k_elementsId = this._k_elementsId,
k_localNamespace = this._k_localNamespace,
k_i, k_cnt;
k_elements.k_splashScreen = Ext.get(k_localNamespace + 'k_splashScreen');
k_elements['k_splashProductVersion' + '_' + 'k_value'] = Ext.get('k_splashProductVersion' + '_' + 'k_value');
for (k_i=0, k_cnt = k_elementsId.length; k_i < k_cnt; k_i++) {
k_elements[k_elementsId[k_i]] = Ext.get(k_localNamespace + k_elementsId[k_i]);
}
this._k_elements = k_elements;
delete this._k_elementsId;
},

k_applyParams: function() {
this.k_refresh();
},

k_refresh: function() {
this._k_updateLicense();
this._k_notifyApp('k_onAfterRefresh');
},

_k_updateLicense: function() {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'ProductRegistration.getFullStatus'
},
k_callback: this._k_updateLicenseCallback,
k_onError: this._k_productRegistrationError,
k_scope: this,
k_requestOwner: null });
},

_k_updateLicenseCallback: function(k_request) {
var k_license;
if (k_request.k_isOk) {
k_license = k_request.k_decoded.status;
if (!k_license.Id) {
k_license.Id = k_license.id;
delete k_license.id;
}
}
else {
k_license = {}; }
this.k_setProductLicense(k_license);
this._k_notifyApp('k_onAfterLicenseUpdate', k_license);
this.k_hideMask();
}, 
_k_productRegistrationError: function(k_response) {
if (k_response.k_decoded.error.code === kerio.lib.k_ajax.k_EXPIRED_SESSION_ERROR_CODE) {
return false;
}
kerio.lib.k_alert({
k_msg: kerio.lib.k_tr('There was a problem while obtaining license from the server. Please check your server or try again later.', 'wlibSplashScreen'),
k_icon: 'error'
});
return true;
},

k_setProductVersion: function(k_version) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_el = this._k_elements['k_splashProductVersion' + '_' + 'k_value'];
k_el.dom.value = kerio.lib.k_htmlEncode(k_version);
}, 
k_setProductLicense: function(k_license) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var
k_ENGINE_CONSTANTS = kerio.lib.k_getSharedConstants(),
k_tmp;
this._k_initExpirationInfo(k_license);
k_tmp = this.k_getLicenseText(k_license);
this.k_setRowCaption('k_license', k_tmp.k_caption);
this.k_setRowValue('k_license', k_tmp.k_value);
this.k_setRowVisible('k_license');
k_tmp = this.k_getExpirationText(k_license, k_ENGINE_CONSTANTS.kerio_web_Subscription);
this.k_setRowValue('k_subscriptionExpire', k_tmp);
this.k_setRowRed('k_subscriptionExpire', this.k_expiredIn30Days[k_ENGINE_CONSTANTS.kerio_web_Subscription] && k_ENGINE_CONSTANTS.kerio_web_rsProductRegistered == k_license.regType);
this.k_setRowVisible('k_subscriptionExpire');
k_tmp = this.k_getExpirationText(k_license, k_ENGINE_CONSTANTS.kerio_web_License);
this.k_setRowValue('k_licenseExpire', k_tmp);
this.k_setRowRed('k_licenseExpire', this.k_expiredIn30Days[k_ENGINE_CONSTANTS.kerio_web_License]);
this.k_setRowVisible('k_licenseExpire');
this.k_setRowValue('k_company', k_license.company || '');
this.k_setRowVisible('k_company');
this.k_setRowValue('k_licensedUsers', k_license.users || (0 === k_license.users ? kerio.lib.k_tr('Unlimited', 'wlibSplashScreen') : ''));
this.k_setRowVisible('k_licensedUsers');
}, 
k_setRowCaption: function(k_rowId, k_caption) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_el = this._k_elements[k_rowId + '_' + 'k_caption'];
k_el.dom.innerHTML = kerio.lib.k_htmlEncode(k_caption);
},

k_setRowValue: function(k_rowId, k_value) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var
k_el = this._k_elements[k_rowId + '_' + 'k_value'],
k_link = this._k_elements[k_rowId + '_' + 'k_link'];
if (k_link) {
kerio.lib.k_reportError('Internal error: This row contains link, use k_setLinkName() instead.', 'splashScreen.js', 'k_setRowValue');
return;
}
k_el.dom.innerHTML = kerio.lib.k_htmlEncode(k_value);
},

_k_setRowClass: function(k_rowId, k_className, k_add) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_el = this._k_elements[k_rowId];
if (false !== k_add) {
k_el.addClass(k_className);
}
else {
k_el.removeClass(k_className);
}
},

k_setRowVisible: function(k_rowId, k_show) {
this._k_setRowClass(k_rowId, 'hidden', false === k_show); },

k_setRowBold: function(k_rowId, k_bold) {
this._k_setRowClass(k_rowId, 'bold', false !== k_bold); },

k_setRowRed: function(k_rowId, k_red) {
this._k_setRowClass(k_rowId, 'red', false !== k_red); },

k_setLinkAction: function(k_rowId, k_callback, k_scope, k_params){
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_el = this._k_elements[k_rowId + '_' + 'k_link'];
k_el.dom.href = '#';
if ('string' === typeof k_callback) { k_el.dom.href = k_callback;
k_callback = this._k_openUrl.createCallback(k_callback); }
k_el.dom.onclick = this._k_cancelLink.createSequence(k_callback.createDelegate(k_scope || this, k_params || [], true));
},

k_setLinkName: function(k_rowId, k_value){
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_el = this._k_elements[k_rowId + '_' + 'k_link'];
k_el.dom.innerHTML = k_value;
},

_k_notifyApp: function(k_functionName) {
var k_params = Array.prototype.slice.call(arguments, 1); if ('function' === typeof this[k_functionName]) {
return this[k_functionName].apply(this, k_params); }
return true;
},

k_resize: function() {
var
k_splash = this._k_elements.k_splashScreen,
k_body = this.k_extWidget.body,
k_parentSize = k_body.getSize(true),
k_splashSize = k_splash.getSize(true),
k_width = k_parentSize.width - k_splashSize.width,
k_height = k_parentSize.height - k_splashSize.height - 30, 
k_horizontalDif = Math.round(k_height / 3),
k_verticalDif = Math.round(k_width  / 3),
k_top = (k_horizontalDif > 0 ? k_horizontalDif : 0),
k_left = (k_verticalDif > 0 ? k_verticalDif : 0);
k_body.down('.splashScreenContainer').setSize(k_parentSize);
k_splash.setStyle({
marginTop: k_top + 'px',
marginLeft: k_left + 'px'
});
if (this._k_loadingMask) {
this._k_loadingMask.next().setStyle({
left: k_left + Math.round(k_splashSize.width / 2) + 'px',
top: k_top + Math.round(k_splashSize.height / 2) + 'px'
});
}
this._k_notifyApp('k_onAfterResize');
}, 
k_showMask: function() {
if (false === this._k_notifyApp('k_onBeforeMask', true)) {
return;
}
kerio.lib.k_maskWidget(this);
},

k_hideMask: function() {
if (false === this._k_notifyApp('k_onBeforeMask', false)) {
return;
}
kerio.lib.k_unmaskWidget(this);
},

_k_cancelLink: function() {
return false;
},

_k_openUrl: function(k_url) {
kerio.lib.k_openWindow(k_url);
},

_k_initExpirationInfo: function (k_license) {
var
k_expirations = k_license.expirations,
k_expiration,
k_i, k_cnt;
this.k_expired = {};
this.k_expiredIn30Days = {};
if (!k_expirations) {
return;
}
for (k_i = 0, k_cnt = k_expirations.length; k_i < k_cnt; k_i++) {
k_expiration = k_expirations[k_i];
this.k_expired[k_expiration.type] = false;
this.k_expiredIn30Days[k_expiration.type] = false;
if (k_expiration.isUnlimited) {
continue;
}
if (30 > k_expiration.remainingDays) {
this.k_expiredIn30Days[k_expiration.type] = true;
}
if (0 >= k_expiration.remainingDays) {
this.k_expired[k_expiration.type] = true;
}
}
},

k_getLicenseText: function(k_license) {
var
k_ENGINE_CONSTANTS = kerio.lib.k_getSharedConstants(),
k_tr = kerio.lib.k_tr,
k_result = {
k_caption: k_tr('License number:', 'wlibSplashScreen'),
k_value: ''
};
if (!k_license) {
k_result.k_caption = k_tr('No license info available', 'wlibSplashScreen');
this._k_isRegistered = false;
}
else {
this.k_licenseNumber = k_license.Id; this._k_isRegistered = true;
if (true !== this.k_noRegistration) {
this.k_setRowVisible('k_registerTrial', false);
this.k_setLinkName('k_registerProduct', k_tr('Register product with a purchased license number…', 'wlibSplashScreen'));
}
switch (k_license.regType) {
case k_ENGINE_CONSTANTS.kerio_web_rsNoRegistration:
this._k_isRegistered = false; if (true !== this.k_noRegistration) {
this.k_setRowVisible('k_registerTrial', false === this.k_expired[k_ENGINE_CONSTANTS.kerio_web_License] && !this.k_isBox);
}
k_result.k_caption = this.k_getUnregisteredTrialMsg();
break;
case k_ENGINE_CONSTANTS.kerio_web_rsTrialRegistered:
k_result.k_caption = this.k_getTrialIdMsg();
k_result.k_value = k_license.Id || '';
break;
case k_ENGINE_CONSTANTS.kerio_web_rsTrialExpired:
k_result.k_caption = this.k_getTrialIdMsg();
k_result.k_value = k_license.Id || '';
break;
case k_ENGINE_CONSTANTS.kerio_web_rsProductRegistered:
if (true !== this.k_noRegistration) {
this.k_setLinkName('k_registerProduct', k_tr('Update registration info…', 'wlibSplashScreen'));
}
k_result.k_value = k_license.Id || '';
break;
default:
k_result.k_caption = k_tr('No license info available', 'wlibSplashScreen');
}
}
return k_result;
}, 
k_getExpirationText: function(k_license, k_licenseType) {
var
k_tr = kerio.lib.k_tr,
k_ENGINE_CONSTANTS = kerio.lib.k_getSharedConstants(),
k_LICENSE = k_ENGINE_CONSTANTS.kerio_web_License,
k_RS_TRIAL_EXPIRED = k_ENGINE_CONSTANTS.kerio_web_rsTrialExpired,
k_i, k_cnt,
k_expiration,
k_expirationDate;
if (k_license.expirations) {
for (k_i = 0, k_cnt = k_license.expirations.length; k_i < k_cnt; k_i++) {
k_expiration = k_license.expirations[k_i];
if (k_expiration.date) {  k_expirationDate = new Date(k_expiration.date * 1000);
k_expirationDate = k_expirationDate.getUTCFullYear() + '-' + String.leftPad(k_expirationDate.getUTCMonth() + 1, 2, '0') +
'-' + String.leftPad(k_expirationDate.getUTCDate(), 2, '0');
}
if (k_licenseType === k_expiration.type) {
if (k_expiration.isUnlimited) {
return k_tr('Never', 'wlibSplashScreen');
}
if (0 >= k_expiration.remainingDays) {
if (k_RS_TRIAL_EXPIRED == k_license.regType) {
return k_LICENSE == k_licenseType ? this.k_getTrialExpiredMsg() : k_tr('Never', 'wlibSplashScreen');
}
else {
return k_tr('%1 (expired)', 'wlibSplashScreen', {k_args: [k_expirationDate]});
}
}
else if (k_expiration.date) {
return k_expirationDate;
}
}
}
}
return '';
}, 
k_isRegistered: function(k_silent) {
if (this._k_isRegistered) {
return true;
}
else {
if (true !== k_silent) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Unregistered version', 'wlibSplashScreen'),
k_msg: kerio.lib.k_tr('This feature is not available in unregistered version.', 'wlibSplashScreen')
+ '<br><br><b>'
+ kerio.lib.k_tr('Please register your copy of %1 first.', 'wlibSplashScreen', { k_args: [this.k_product] })
+ '</b>'
});
}
return false;
}
}, 
_k_startRegistration: function(k_type, k_welcomeTrialOptions) {
this.k_showMask();
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'ProductRegistration.start',
params: {
langId: kerio.lib.k_engineConstants.k_CURRENT_LANGUAGE, trial: 'k_trial' === k_type
}
},
k_callback: this._k_startRegistrationCallback,
k_callbackParams: {k_type: k_type, k_welcomeTrialOptions: k_welcomeTrialOptions},
k_onError: this._k_productRegistrationError,
k_scope: this,
k_requestOwner: null });
},

_k_startRegistrationCallback: function(k_request, k_success, k_callbackParams) {
this.k_hideMask();
if (k_request.k_isOk) {
this.k_register(k_callbackParams.k_type, k_request.k_decoded, k_callbackParams.k_welcomeTrialOptions);
}
},

_k_registerTrial: function() {
this._k_startRegistration('k_trial');
},

_k_registerProduct: function() {
this._k_startRegistration('k_product');
},

_k_registerLicense: function() {
this.k_register('k_license');
},

k_register: function(k_type, k_config, k_welcomeTrialOptions) {
var
k_sourceName,
k_objectName,
k_params,
k_cancelCallback,
k_onBeforeDialogOpen,
k_disableAddOn = false;
k_config = k_config || {};
switch (k_type) {
case 'k_trial':
k_objectName = 'trialRegistration';
case 'k_product':
k_sourceName = this.k_registrationDialog || 'productRegistration';
break;
case 'k_license':
k_sourceName = 'licenseInstall';
break;
}
k_objectName = k_objectName || k_sourceName;
k_cancelCallback = this._k_notifyApp.createDelegate(this, ['k_onRegistrationCancel']);
k_params = { k_licenseNumber: this.k_licenseNumber,
k_callback: this.k_refresh,
k_closeCallback: k_cancelCallback
};
k_onBeforeDialogOpen = this._k_notifyApp('k_onBeforeDialogOpen', k_objectName, k_params);
if (false === k_onBeforeDialogOpen) {
return;
}
if ('object' === typeof k_onBeforeDialogOpen && k_onBeforeDialogOpen.k_disableAddOn) {
k_disableAddOn = true;
}
k_params = { k_disableAddOn: k_disableAddOn,
k_licenseNumber: this.k_licenseNumber,
k_callback: this.k_refresh,
k_scope: this,
k_closeCallback: k_cancelCallback,
k_closeCallbackScope: this,
k_captchaUrl: k_config.image,
k_token: k_config.token
};
if (k_welcomeTrialOptions) {
Ext.apply(k_params, {
k_callback:           k_welcomeTrialOptions.k_callback,
k_scope:              k_welcomeTrialOptions.k_scope,
k_closeCallback:      k_welcomeTrialOptions.k_closeCallback,
k_closeCallbackScope: k_welcomeTrialOptions.k_closeCallbackScope
});
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: k_sourceName,
k_objectName: k_objectName,
k_params: k_params,
k_initParams: {
k_isBox: this.k_isBox,
k_isSophosProduct: this.k_isSophosProduct,
k_showCaptcha: k_config.showImage,
k_newKissMode: k_config.newKissMode
}
});
}, 
_k_goToSupportWeb: function() {
var	k_userInfo = this._k_notifyApp('k_onBeforeDialogOpen', 'k_reportProblem');
if (false === k_userInfo) {
return;
}
kerio.adm.k_widgets.K_SupportWeb.k_open(this);
},

k_getTrialRegistrationMsg: function() {
return kerio.lib.k_tr('Become a registered trial user…', 'wlibSplashScreen');
},

k_getUnregisteredTrialMsg: function() {
return kerio.lib.k_tr('Unregistered trial version', 'wlibSplashScreen');
},

k_getTrialIdMsg: function() {
return kerio.lib.k_tr('Trial ID:', 'wlibSplashScreen');
},

k_getTrialExpiredMsg : function() {
return kerio.lib.k_tr('Trial expired', 'wlibSplashScreen');
}
});


kerio.adm.k_widgets.k_productMenu = function(k_id, k_config) {
kerio.adm.k_framework.k_leaveCurrentScreen = kerio.adm.k_framework.k_leaveCurrentScreen.createSequence(function() {
if (undefined !== this._k_targetTabId) {
this._k_getTab(this._k_targetTabId).show();
}
}, this);
this._k_setHomeNode(k_config);
kerio.adm.k_widgets.k_productMenu.superclass.constructor.call(this, k_id, this._k_prepareCfg(k_id, k_config));
this._k_frameworkInitialized = false;
this.k_objectName = k_id;
this._k_settingsId = k_config.k_settingsId;
this.k_MIN_WIDTH = 90;
this.k_MAX_WIDTH = 600;
this.k_extWidget.on('afterrender', this._k_initMenu, this);
};
Ext.extend(kerio.adm.k_widgets.k_productMenu, kerio.lib.K_TabPage,
{

_k_nodeMap: {},

_k_prepareCfg: function(k_id, k_config) {
var
k_localNamespace = k_id + '_',
k_lib = kerio.lib,
k_cloneObject = k_lib.k_cloneObject,
k_rootNodes = k_config.k_localData[0].k_nodes,
k_storeSettings = k_lib.k_getSettings(k_config.k_settingsId) || {},
k_tabs = [],
k_selectionModel,
k_itemId,
k_tree, k_treeCfg,
k_cnt, k_i,
k_item,
k_tabPageCfg;
this.k_rootNodes = k_rootNodes;
this._k_isStateful = true;
this._k_settingsEvents = [];
if (k_lib.k_isIPadCompatible) {
this.k_width = 300;
}
else {
this.k_width = k_storeSettings.width || k_config.k_width;
this.k_initialWidth = k_config.k_width;
}
for (k_i = 0, k_cnt = k_rootNodes.length; k_i < k_cnt; k_i++) {
k_item = k_rootNodes[k_i];
k_itemId = k_item.id || k_i;
k_treeCfg = k_cloneObject(k_config);
k_treeCfg.k_onBeforeClick = this._k_onBeforeClick;
k_treeCfg.k_isRootVisible = false;
k_treeCfg.k_localData = [k_item];
k_treeCfg.k_isProductMenu = true;
delete k_treeCfg.k_settingsId;
delete k_treeCfg.k_width;
k_tree = new kerio.adm.k_widgets.k_productMenuSubmenu(k_localNamespace + k_itemId, k_treeCfg);
k_tree.k_extWidget.on('afterlayout', this._k_denyAnchorActions, k_tree);
this._k_fillNodeMap(k_tree.k_items, k_tabs.length);
k_selectionModel = k_tree.k_extWidget.getSelectionModel();
if (k_lib.k_isIPadCompatible) {
k_selectionModel.on('selectionchange', this._k_onSelectionChanged, this);
}
k_tabs.push({
k_active: k_i === this._k_homeNode.k_tabIdx,
k_caption: k_item.k_caption,
k_content: k_tree
});
}
k_tabPageCfg = {
k_className: 'mainMenu', k_items: k_tabs,
k_onBeforeTabChange: function(k_menuTree, k_newTabId, k_currentTabId) {
var
k_currentNode,
k_newNode;
if (k_currentTabId) {  k_currentNode = k_menuTree._k_getTab(k_currentTabId)._kx.k_owner.k_activeItem;
k_newNode = k_menuTree._k_getTab(k_newTabId)._kx.k_owner.k_activeItem;
if (!k_newNode) {
k_newNode = k_menuTree._k_getFirstNodeInTab(k_newTabId);
}
if (k_currentNode && k_newNode) {
this._k_targetTabId = k_newTabId;
return kerio.adm.k_framework._k_onBeforeLeaveScreen(k_currentNode, k_newNode, Ext.EventObject);
}
}
return true;
}
};

k_tabPageCfg.k_onTabChange = function(k_menuTree, k_currentTabId) {
var
k_ACTIVE_CSS_CLASS = 'activeTab',
k_currentTab = k_menuTree._k_getTab(k_currentTabId),
k_activeItem,
k_activeItemExt,
k_tab,
k_cnt, k_i;
for (k_i = 0, k_cnt = k_menuTree.k_rootNodes.length; k_i < k_cnt; k_i++) {
k_tab = k_menuTree._k_getTab(k_i);
k_tab.removeClass(k_ACTIVE_CSS_CLASS);
}
k_currentTab.addClass(k_ACTIVE_CSS_CLASS);
k_activeItem = k_currentTab._kx.k_owner.k_activeItem;
if (k_activeItem && k_activeItem.k_id) {
k_activeItemExt = k_activeItem.k_extWidget;
if (kerio.lib.k_isIPadCompatible && k_menuTree._k_iPadCompatibleSelectNodeCall !== true) {
this._k_iPadNodeSelection(k_activeItemExt);
return;
}
delete k_menuTree._k_iPadCompatibleSelectNodeCall;
k_menuTree._k_fireBeforeClickAndClick(k_activeItemExt);
}
else {
k_menuTree._k_selectFirstItemInTab(k_currentTabId);
}
};
return k_tabPageCfg;
},

_k_denyAnchorActions: function() {
var
k_denyFunction = function() { return false; },
k_nodes = this.k_items,
k_nodeIndex, k_node;
for(k_nodeIndex in k_nodes) {
if (k_nodes.hasOwnProperty(k_nodeIndex)) {
k_node = k_nodes[k_nodeIndex];
if (k_node.ui && k_node.ui.anchor) {
k_node.ui.anchor.onclick = k_denyFunction;
}
}
}
},

_k_fireBeforeClickAndClick: function(k_item) {
if (false !== k_item.fireEvent('beforeclick', k_item, Ext.EventObject)) {
k_item.fireEvent('click', k_item, Ext.EventObject);
}
},

_k_fillNodeMap: function(k_nodeList, k_tabIdx) {
var k_id;
for (k_id in k_nodeList) {
if (k_nodeList.hasOwnProperty(k_id)) {
this._k_nodeMap[k_id] = k_tabIdx;
}
}
},

k_getSettings: function() {
var
k_settings = {};
if (this.k_width !== this.k_initialWidth) {
k_settings.width = this.k_width;
}
return k_settings;
},

_k_storeInitialSettings: function(k_config) {
this._k_initialSettings = k_config;
},

_k_onTreeNodeClick: function(k_treeNode) {
var
k_currentTabExt = k_treeNode.k_tree.k_parentWidget.k_extWidget.getActiveTab(),
k_currentTab = k_currentTabExt._kx.k_owner;
k_treeNode.k_tree.k_parentWidget._k_lastNode = k_treeNode.k_extWidget;
k_treeNode.k_tree.k_parentWidget._k_lastTab = k_currentTabExt;
k_currentTab.k_activeItem = k_treeNode;
if (kerio.lib.k_isIPadCompatible) {
this._k_onSelectionChanged();
}
},

_k_onSelectionChanged: function() {
var
k_viewport = kerio.lib.k_getViewport(),
k_westRegion = k_viewport.k_extWidget.layout.west;
k_westRegion.slideIn();
k_westRegion.k_closeElement.hide();
},

_k_onBeforeClick: function(k_newNode, k_currentNode, k_event) {
var
k_menuTree = this.k_getMainWidget(),
k_tab,
k_selectionModel,
k_selectedNode,
k_cnt, k_i;
for (k_i = 0, k_cnt = k_menuTree.k_rootNodes.length; k_i < k_cnt; k_i++) {
k_tab = k_menuTree._k_getTab(k_i);
k_selectionModel = k_tab.getSelectionModel();
k_selectedNode = k_selectionModel.getSelectedNode();
if (k_selectedNode) {
k_selectionModel.unselect(k_selectedNode, true);
}
}
if (false === kerio.adm.k_framework._k_onBeforeLeaveScreen(k_newNode, k_menuTree._k_lastNode, k_event)) {
return false;
}
return true;
},

k_goBackToCurrentScreen: function() {
this._k_lastTab.show();
this._k_lastNode.select();
},

_k_initMenu: function() {
this._k_modifyTabStrips();
this._k_createLogo();
},
_k_setHomeNode: function(k_config) {
var
k_rootNodes = k_config.k_localData[0].k_nodes,
k_itemId = k_rootNodes[0].k_nodes[0].k_id,
k_tabIdx = 0,
k_i, k_cnt;
if (k_config.k_homeNodeId) {
k_itemId = k_config.k_homeNodeId;
for (k_i = 0, k_cnt = k_rootNodes.length; k_i < k_cnt; k_i++) {
if (this._k_tabContainsItemId(k_rootNodes[k_i], k_config.k_homeNodeId)) {
k_tabIdx = k_i;
break;
}
}
}
this._k_homeNode = {
k_tabIdx: k_tabIdx,
k_itemId: k_itemId
};
},

_k_tabContainsItemId: function(k_node, k_itemId) {
var k_i, k_cnt;
if (k_node.k_id === k_itemId) {
return true;
}
if (!k_node.k_nodes) {
return false;
}
for (k_i = 0, k_cnt = k_node.k_nodes.length; k_i < k_cnt; k_i++) {
if (this._k_tabContainsItemId(k_node.k_nodes[k_i], k_itemId)) {
return true;
}
}
return false;
},

_k_selectFirstItemInTab: function(k_tabId) {
var
k_firstItem;
if (!this._k_frameworkInitialized) {  return;
}
k_firstItem = this.k_getTabContent(k_tabId).k_items[this._k_getFirstNodeInTab(k_tabId).id];
if (kerio.lib.k_isIPadCompatible) {
this._k_iPadNodeSelection(k_firstItem);
return;
}
this._k_fireBeforeClickAndClick(k_firstItem);
},

_k_iPadNodeSelection: function(k_item) {
var
k_westRegion = kerio.lib.k_getViewport().k_extWidget.layout.west,
k_rawData = k_item._kx.k_rawData;
k_item.select();
k_westRegion.k_closeElement.show();
k_westRegion.slideOut();
},

_k_getFirstNodeInTab: function(k_tabId) {
var
k_firstNode = this._k_getTab(k_tabId).root.childNodes[0];
if (k_firstNode.childNodes && k_firstNode.childNodes.length > 0) {
k_firstNode = k_firstNode.childNodes[0];
}
return k_firstNode;
},

_k_afterLayoutRender: function() {
this._k_lastTab = this._k_getTab(this._k_homeNode.k_tabIdx);
this._k_frameworkInitialized = true;
if (kerio.lib.k_isIPadCompatible) {
this._k_modifyForIPad();
}
else {
this._k_createGhostSplitter();
this._k_logoElement.k_extWidget.render(this.k_extWidget.el);
}
},

_k_modifyTabStrips: function() {
var
k_stripHeader = this.k_extWidget.el.dom.childNodes[0],
k_listOfStrips = k_stripHeader.childNodes[0].childNodes[0],
k_stipsArray = k_listOfStrips.childNodes,
k_rootNodes = this.k_rootNodes,
k_rootNode,
k_tooltip,
k_i, k_cnt,
k_item;
this._k_stripLineEl = k_stripHeader;
for (k_i = 0, k_cnt = k_rootNodes.length; k_i < k_cnt; k_i++) {
k_item = k_stipsArray[k_i];
k_rootNode = k_rootNodes[k_i];
k_item.className += ' ' + k_rootNode.k_iconCls;
if (!kerio.lib.k_isIPadCompatible) {
k_tooltip = document.createAttribute('ext:qtip');
k_tooltip.value = k_rootNode.k_caption;
Ext.select('a.x-tab-right', true, k_item.id).elements[0].dom.attributes.setNamedItem(k_tooltip);
}
}
},

_k_createLogo: function() {
var
k_lib = kerio.lib,
k_firstMenuItem = this.k_getTabContent(String(this._k_homeNode.k_tabIdx)).k_items[this._k_homeNode.k_itemId],
k_logoCfg, k_logo;
k_logoCfg = {
k_type: 'k_display',
k_isSecure: true,
k_template: [
'<a class="k_productLogo" ',
k_lib.k_buildTooltip(k_lib.k_tr('Go to %1','wlibCommon',{k_args: [k_firstMenuItem.text]})),
'></a>'
].join(),
k_value: '',
k_onLinkClick: function (k_form, k_item, k_linkId) {
var
k_menuTree = this.k_menuTree,
k_firstMenuItem = this.k_firstMenuItem;
if (false !== k_firstMenuItem.fireEvent('beforeclick', k_firstMenuItem, Ext.EventObject)) {
k_menuTree.k_setActiveTab(k_menuTree._k_homeNode.k_tabIdx);
k_firstMenuItem.fireEvent('click', k_firstMenuItem, Ext.EventObject);
return true;
}
return false;
}
};
k_logo = new k_lib.K_DisplayField(this.k_objectName + '_' + 'k_logo', k_logoCfg);
k_logo.k_addReferences({
k_menuTree: this,
k_firstMenuItem: k_firstMenuItem
});
this._k_logoElement = k_logo;
},

_k_createGhostSplitter: function() {
var
k_religion = kerio.lib.k_getViewport().k_extWidget.layout.west,
k_originalSplitter = k_religion.getSplitBar(),
k_newSplitterElement,
k_newSplitter;
k_newSplitterElement = Ext.getBody().createChild({
id: 'k_ghostSplitter',
tag: 'div',
style: 'position: absolute; top: 0; left: ' + this.k_width + 'px; width: 5px; height: 100%; background: transparent !important;'
});
k_newSplitter = new Ext.SplitBar(k_newSplitterElement, k_religion.el, Ext.SplitBar.HORIZONTAL);
k_newSplitter.setMinimumSize(this.k_MIN_WIDTH);
k_newSplitter.setMaximumSize(this.k_MAX_WIDTH);
k_originalSplitter.el.addClass('mainMenuSplitter');
k_originalSplitter.fireEvent('beforeapply', k_originalSplitter, this.k_width);
k_newSplitter.animate = true;
k_newSplitter.k_relatedSplitter = k_religion.getSplitBar();
k_newSplitter.k_element = k_newSplitterElement;
k_newSplitter.k_productMenu = this;
k_newSplitter.on('moved', function(k_splitbar, k_newSize) {
var
k_split = this.k_relatedSplitter;
this.k_productMenu.k_width = k_newSize;
k_split.fireEvent('beforeapply', k_split, k_newSize);
this.k_element.setStyle('left', k_newSize + 'px');
this.k_productMenu._k_lastTab._kx.k_owner._k_updateBackgroundWidth();
}, k_newSplitter);
},

_k_modifyForIPad: function() {
var
k_westRegion = kerio.lib.k_getViewport().k_extWidget.layout.west,
k_collapseTool = k_westRegion.getCollapsedEl(),
k_stripLine = this._k_stripLineEl,
k_closeElement;
k_collapseTool.addClass('mainMenu');
k_collapseTool.dom.appendChild(k_stripLine);
this._k_logoElement.k_extWidget.render(k_collapseTool.dom);
k_collapseTool.un('click', k_westRegion.collapseClick, k_westRegion);
k_collapseTool.on('click', function(k_e) {
if (this.isSlid && -1 === k_e.target.className.indexOf('x-tab-right')) {
k_e.stopPropagation();
this.slideIn();
this.k_closeElement.hide();
}
else if (-1 === k_e.target.className.indexOf('textLink')) {
this.k_closeElement.show();
k_e.stopPropagation();
this.slideOut();
}
}, k_westRegion);
k_closeElement = Ext.getBody().createChild({
tag: 'div',
style: 'position: absolute; top: 0; left: 40; width: 100%; height: 100%;display:none;background: black;opacity: 0.3;'
});
k_closeElement.on('click', function(k_e) {
if (this.isSlid || this.k_closeElement.isVisible()) {
this.items[0]._kx.k_owner.k_goBackToCurrentScreen();
this.slideIn();
this.k_closeElement.hide();
}
else {
this.k_closeElement.show();
this.slideOut();
}
}, k_westRegion);
k_westRegion.k_closeElement = k_closeElement;
k_westRegion.cmargins.right = 0;
k_westRegion.cmargins.left = 0;
k_collapseTool.setWidth(40);
kerio.lib.k_getViewport().k_extWidget.doLayout();
},

k_getNodeById: function(k_nodeId) {
var
k_tabIdx = this._k_nodeMap[k_nodeId],
k_tree;
if (undefined === k_tabIdx) {
return null;
}
k_tree = this.k_getTabContent(String(k_tabIdx));
return k_tree._k_getTreeNode(k_tree.k_items[k_nodeId]);
},

k_selectNode: function(k_nodeId) {
var
k_activeItem = this.k_getNodeById(k_nodeId),
k_tabIdx,
k_currentTab,
k_targetTab;
if (null === k_activeItem) {
k_nodeId = kerio.adm.k_framework._k_defaultMenuTreeSelection;
k_activeItem = this.k_getNodeById(k_nodeId);
}
k_tabIdx = this._k_nodeMap[k_nodeId];
k_currentTab = this.k_extWidget.activeTab;
k_targetTab = this._k_getTab(k_tabIdx);
k_targetTab._kx.k_owner.k_activeItem = k_activeItem;
if (k_currentTab === k_targetTab) {
this._k_fireBeforeClickAndClick(k_activeItem.k_extWidget);
}
else {  if (kerio.lib.k_isIPadCompatible) {
this._k_iPadCompatibleSelectNodeCall = true;
}
this.k_setActiveTab(k_tabIdx);
}
}
});
kerio.adm.k_widgets.k_productMenuSubmenu = function(k_id, k_config) {
kerio.adm.k_widgets.k_productMenuSubmenu.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.adm.k_widgets.k_productMenuSubmenu, kerio.lib.K_Tree, {
_k_updateBackgroundWidth: function() {
var
k_extTree = this.k_extWidget,
k_domTreeContainer = k_extTree.body.dom;
if (k_domTreeContainer.clientWidth < k_domTreeContainer.scrollWidth) {
kerio.lib.K_Tree.prototype._k_updateBackgroundWidth.call(this);
}
else {
k_extTree.innerCt.dom.style.width = 'auto';
}
}
});


kerio.adm.k_registrationUtils = {

k_dashboardWidgetId: 'dashboard',

k_productParameters: { k_name: '',
k_osNumber: 2
},

k_startRegistration: function(k_type, k_licenseNumber) {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'ProductRegistration.start',
params: {
langId: kerio.lib.k_engineConstants.k_CURRENT_LANGUAGE }
},
k_callback: this._k_startRegistrationCallback,
k_callbackParams: {k_type: k_type, k_licenseNumber: k_licenseNumber},
k_onError: this._k_productRegistrationError,
k_scope: this,
k_requestOwner: null });
},

_k_startRegistrationCallback: function(k_request, k_success, k_callbackParams) {
if (k_request.k_isOk) {
this.k_register(k_callbackParams.k_type, k_request.k_decoded, k_callbackParams.k_licenseNumber);
}
},

_k_productRegistrationError: function(k_response) {
if (k_response.k_decoded.error.code === kerio.lib.k_ajax.k_EXPIRED_SESSION_ERROR_CODE) {
return false;
}
kerio.lib.k_alert({
k_msg: kerio.lib.k_tr('There was a problem while obtaining license from the server. Please check your server or try again later.', 'wlibSplashScreen'),
k_icon: 'error'
});
return true;
},

k_register: function(k_type, k_config, k_licenseNumber) {
var
k_objectName,
k_params,
k_dashboardWidget = kerio.lib.k_getWidgetById(this.k_dashboardWidgetId),
k_trialLicenseLink;
k_config = k_config || {};
switch (k_type) {
case 'k_trial':
k_objectName = 'trialRegistration';
break;
case 'k_product':
k_objectName = 'productRegistration';
break;
}
k_params = { k_licenseNumber: k_licenseNumber,
k_callback: k_dashboardWidget.k_refreshLicenseInfo,
k_scope: k_dashboardWidget,
k_captchaUrl: k_config.image,
k_token: k_config.token
};
k_trialLicenseLink = this.k_getTrialLicenseLink(this.k_productParameters.k_name, kerio.lib.k_engineConstants.k_CURRENT_LANGUAGE, this.k_productParameters.k_osNumber);
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'productRegistration',
k_objectName: k_objectName,
k_params: k_params,
k_initParams: {
k_showCaptcha: k_config.showImage,
k_newKissMode: true, k_trialLicenseLink: k_trialLicenseLink
}
});
}, 
k_setProductParams: function(k_productName, k_serverOsNumber) {
this.k_productParameters.k_name = k_productName;
if (k_serverOsNumber) {
this.k_productParameters.k_osNumber = k_serverOsNumber;
}
},

k_getTrialLicenseLink: function(k_productName, k_language, k_serverOsNumber) {
if (undefined === k_serverOsNumber) {
k_serverOsNumber = this.k_productParameters.k_osNumber;
}
return 'http://www.kerio.com/scripts/ctrl/ctrl.php?prod=' + k_productName + '&lang=' + k_language + '&plat=' + k_serverOsNumber;
},

k_checkLicenseExpirationDate: function(k_expiration) {
var k_localTimestamp = new Date(),
k_expirationTimestamp = new Date(k_expiration.year, k_expiration.month - 1, k_expiration.day),
k_tr = kerio.lib.k_tr,
k_kbArticleId,
k_expiredSwmMessage;
if (k_expirationTimestamp < k_localTimestamp) {
switch (this.k_productParameters.k_name) {
case 'kwf':
k_kbArticleId = 1300;
break;
case 'kts':
k_kbArticleId = 892;
break;
default: k_kbArticleId = 1134;
break; }
k_expiredSwmMessage = k_tr('The Software Maintenance has expired. This License number cannot be used for the online product registration.', 'wlibProductRegistration')
+ '<br>' + k_tr('You can download the license file and install it locally.', 'wlibProductRegistration') + '&nbsp;' + kerio.adm.k_getKbLink(k_kbArticleId);
kerio.lib.k_alert({
k_title: k_tr('Product Registration', 'wlibProductRegistration'),
k_msg: k_expiredSwmMessage,
k_icon: 'error'
});
return false;
}
return true;
}
};

kerio.adm.k_widgets.K_SelectTypeAheadLocal = function(k_id, k_config) {
k_config.k_isTriggerHidden = true !== k_config.k_hasTrigger;
k_config.k_isEditable = true;
k_config.k_useColumnsNames = true;
k_config.k_value = (undefined === k_config.k_value ? '' : k_config.k_value); if ('function' === typeof k_config.k_rowFilter) {
this.k_rowFilter = k_config.k_rowFilter;
}
else if (false === k_config.k_rowFilter) {
this.k_rowFilter = this._k_disabledRowFilter;
}
kerio.adm.k_widgets.K_SelectTypeAheadLocal.superclass.constructor.call(this, k_id, k_config);
};

kerio.lib.k_extend('kerio.adm.k_widgets.K_SelectTypeAheadLocal', kerio.lib.K_SelectTypeAhead,

{

_k_doAfterRender: function() {
kerio.lib.K_Select.prototype._k_doAfterRender.call(this);
this.k_extWidget.el.on('keydown', function(k_event) {
var k_length = this.getRawValue().trim().length;
if (k_event.ENTER === k_event.keyCode && k_length >= 2 && false === this.isExpanded()) {
this.expand.defer(100, this);
}
}, this.k_extWidget);
this.k_extWidget.el.on('keyup', this._k_startLocalSearch, this);
},

k_setValue: function(k_value) {
kerio.lib.K_Select.prototype.k_setValue.apply(this, arguments);
this._k_startLocalSearch();
},

_k_startLocalSearch: function(k_event) {
if (k_event && k_event.isSpecialKey() && k_event.BACKSPACE !== k_event.keyCode && k_event.DELETE !== k_event.keyCode ) {
return;
}
if (this.k_isDisabled() || this.k_isReadOnly()) { this.k_extWidget.collapse();
return;
}
var
k_value = this.k_extWidget.getRawValue(),
k_data = this._k_dataStore.k_extWidget;
k_data.filter([{
fn: this._k_rowFilterFactory(k_value),
scope: this
}]);
if (0 < k_data.getCount() && this.k_extWidget.hasFocus) { this._k_expand.defer(10, this); this.k_extWidget.restrictHeight();
this.k_extWidget.select(-1); }
else {
this.k_extWidget.collapse();
}
},

_k_expand: function() {
var
k_extWidget = this.k_extWidget,
k_mainWidget = this.k_getMainWidget(),
k_isInDialog = (null !== k_mainWidget);  if (k_extWidget
&& !this.k_isDisabled() && !this.k_isReadOnly()      && !k_extWidget.isExpanded()                         && (!k_isInDialog                                    || k_mainWidget.k_extWidget.isVisible())         && k_extWidget.hasFocus) {                           k_extWidget.expand();
}
},

_k_rowFilterFactory: function(k_closureValue) {
return function(k_record) {
return this.k_rowFilter(k_closureValue, k_record.data);
};
},

k_rowFilter: function(k_value, k_item) {
return (-1 < k_item[this._k_fieldValue].indexOf(k_value));
},

_k_disabledRowFilter: function() {
return true; }
});    kerio.adm.k_widgets.K_SearchSpotlight = function() {
kerio.adm.k_widgets.K_SearchSpotlight.superclass.constructor.call(this, 'k_searchSpotLight', {
k_emptyText: kerio.lib.k_tr('Where is …', 'wlibSearchSpotlight'),
k_caption: '',
k_value: '',
k_isEditable: true,
k_hasTrigger: false,
k_className: 'searchSpotlight',
k_listClassName: 'searchSpotlight',
k_useColumnsNames: true,
k_fieldDisplay: 'k_foundKeywords',
k_fieldValue: 'origValue',
k_isLabelHidden: false,
k_localData: [],
k_rowFilter: this._filterByKeywords,
k_onSelect: this.k_onSelect
});
this.k_extWidget.initEvents = function() {
this.constructor.prototype.initEvents.apply(this, arguments);
this.keyNav.enter = function(e) {
if (-1 !== this.selectedIndex) {
this.onViewClick();
}
};
};
this._k_loadSearchTerms();
};
kerio.lib.k_extend('kerio.adm.k_widgets.K_SearchSpotlight', kerio.adm.k_widgets.K_SelectTypeAheadLocal, {
_k_reFullUrl: new RegExp('^\\s*http.?://', 'i'),
_k_reWhiteSpace: new RegExp('\\s+'),

_k_beforeInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
kerio.adm.k_widgets.K_SearchSpotlight.superclass._k_beforeInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
k_adaptedConfig.selectOnFocus = false;
k_adaptedConfig.tpl = '<tpl for="."><div class="x-combo-list-item"><div class="keyword">{k_foundKeywords}</div><div class="hint">{k_foundHint}</div></div></tpl>';
k_adaptedConfig.onSelect = function(record, index){
if(this.fireEvent('beforeselect', this, record, index) !== false){
this.collapse();
this.fireEvent('select', this, record, index);
}
};
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
kerio.adm.k_widgets.K_SearchSpotlight.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
this.k_extWidget.assertValue = Ext.emptyFn;
},

_k_doAfterRender: function() {
kerio.adm.k_widgets.K_SearchSpotlight.superclass._k_doAfterRender.call(this);
this._k_searchHintEl = Ext.getBody().createChild({
'tag': 'div',
'class': 'searchSpotlight searchHint'
});
},
_k_createRecordDefiniton: function() {
var k_recordDef = kerio.adm.k_widgets.K_SearchSpotlight.superclass._k_createRecordDefiniton.call(this);
k_recordDef.push(
{k_columnId: 'origValue'},
{k_columnId: 'url'},
{k_columnId: 'target'},
{k_columnId: 'targetId'},
{k_columnId: 'targetAction'},
{k_columnId: 'k_foundKeywords'},
{k_columnId: 'k_foundHint'}
);
return k_recordDef;
},
_k_initList: function() {
kerio.adm.k_widgets.K_SearchSpotlight.superclass._k_initList.apply(this, arguments);
this.k_extWidget.view.on('selectionchange', function(k_extDataView, k_selections, k_event) {
if (k_selections.length > 0) {
this._k_lastHighlightedElement = null;
this.k_processSpotlight(k_selections[0].viewIndex, true);
}
}, this, {buffer: 300});
this._k_textMetrics = Ext.util.TextMetrics.createInstance(this.k_extWidget.view.el);
},

_k_listRowRenderer: function(k_data) {
return k_data;
},

_k_startLocalSearch: function (k_event) {
var k_length;
if (k_event && k_event.isSpecialKey() && k_event.BACKSPACE !== k_event.keyCode && k_event.DELETE !== k_event.keyCode ) {
return;
}
k_length = this.k_extWidget.getRawValue().trim().length;
if (k_length < 2) {
this._k_rowFilterFactory = function() {return function() {return false;};};
}
else {
this._k_rowFilterFactory = kerio.adm.k_widgets.K_SearchSpotlight.superclass._k_rowFilterFactory;
}
this._k_longestKeyword = '';
this._k_longestHint = '';
this._k_lastHint = '';
kerio.adm.k_widgets.K_SearchSpotlight.superclass._k_startLocalSearch.call(this, k_event);
if (0 === this._k_dataStore.k_getRowsCount()) {
switch (k_length) {
case 0: this.k_hideSearchHint(); break;
case 1: this.k_showSearchHint(kerio.lib.k_tr('at least 2 chraracters', 'wlibSearchSpotlight')); break;
default: this.k_showSearchHint(kerio.lib.k_tr('not found', 'wlibSearchSpotlight'));
}
}
else {
this.k_hideSearchHint();
this._k_setListWidth();
}
},
_k_setListWidth: function() {
var
k_extWidget = this.k_extWidget,
k_list = k_extWidget.view.el.select('.keyword').elements,
k_keywordWidth = Math.min(250, this._k_textMetrics.getWidth(this._k_longestKeyword)) + 10,
k_hintWidth = Math.min(200, this._k_textMetrics.getWidth(this._k_longestHint)) + 10,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_list.length; k_i < k_cnt; k_i++) {
k_list[k_i].style.width = k_keywordWidth + 'px';
k_list[k_i].nextSibling.style.width = k_hintWidth + 'px';
}
k_extWidget.view.setWidth(k_keywordWidth + k_hintWidth + 40);
k_extWidget.view.container.alignTo(k_extWidget.el);
k_extWidget.list.shadow.show(k_extWidget.list);
},
_filterByKeywords: function(k_value, k_item) {
var
k_fieldValue = k_item.value,
k_matchCnt = 0,
k_matchIdx = [],
k_searchWords,
k_searchWordCnt,
k_keyWords,
k_word,
k_pos,
k_length,
k_i, k_j, k_cnt;
k_value = k_value.toLowerCase();
k_searchWords = k_value.split(this._k_reWhiteSpace);
k_keyWords = k_fieldValue.split(this._k_reWhiteSpace);
k_searchWordCnt = k_searchWords.length;
for (k_i = 0, k_cnt = k_keyWords.length; k_i < k_cnt; k_i++) {
for (k_j = 0; k_j < k_searchWordCnt; k_j++) {
k_word = k_searchWords[k_j];
k_pos = k_keyWords[k_i].indexOf(k_word);  if (0 === k_pos || (k_pos > 0 && '-' === k_keyWords[k_i].charAt(k_pos - 1))) {
k_matchCnt++;
k_matchIdx.push({k_idx: k_i, k_pos: k_pos, k_length: k_word.length});
k_searchWords[k_j] = ' ';  break;
}
}
}
if (k_matchCnt === k_searchWordCnt) {
k_keyWords = k_item.origValue.split(this._k_reWhiteSpace);
for (k_i = 0, k_cnt = k_matchIdx.length; k_i < k_cnt; k_i++) {
k_j = k_matchIdx[k_i].k_idx;
k_pos = k_matchIdx[k_i].k_pos;
k_length = k_matchIdx[k_i].k_length;
k_word = k_keyWords[k_j];
k_keyWords[k_j] = k_word.substr(0, k_pos) + '<b>' + k_word.substr(k_pos, k_length) + '</b>' + k_word.substr(k_pos + k_length);
}
k_item.k_foundKeywords = k_keyWords.join(' ');
if (k_item.origValue.length > this._k_longestKeyword.length) {
this._k_longestKeyword = k_item.origValue;
}
if (k_item.hint.length > this._k_longestHint.length) {
this._k_longestHint = k_item.hint;
}
if (this.k_lastHint !== k_item.hint) {
k_item.k_foundHint = '<b>' + k_item.hint + '</b>';
}
else {
k_item.k_foundHint = k_item.hint;
}
this.k_lastHint = k_item.hint;
return true;
}
return false;
},

_k_loadSearchTerms: function() {
var k_script = document.createElement('script');
k_script.setAttribute('src', 'searchTerms/searchTerms.js?v=8629');
k_script.setAttribute('type', 'text/javascript');
k_script.onload = k_script.onreadystatechange = function(k_event) {
var
k_script,
k_head;
k_event = k_event || window.event;
k_script = k_event.target || k_event.srcElement;
if ((!k_script.readyState || 'loaded' === k_script.readyState || 'complete' === k_script.readyState)) {
if (this._k_isSearchTermsLoaded) {
return;
}
this._k_getSearchTerms();
this._k_isSearchTermsLoaded = true;
k_script.onload = k_script.onreadystatechange = null;
k_head = document.getElementsByTagName('head')[0];
if ( k_head && k_script.parentNode ) {
k_head.removeChild( k_script );
}
}
}.createDelegate(this);
document.getElementsByTagName('head')[0].appendChild(k_script);
},

_k_getSearchTerms: function() {
var
k_searchTerms = window.searchTerms,
k_data = [],
k_screen,
k_term,
k_keywords,
k_isDomainAdmin = (kerio.lib.k_getSharedConstants('kerio_web_AccountAdmin') === kerio.adm.k_framework._k_userRole),
k_role,
k_roleAll = 'all',
k_roleDomain = 'domain',
k_i, k_j, k_cnt, k_keywordCnt;
for (k_screen in k_searchTerms) {
if (k_searchTerms.hasOwnProperty(k_screen)) {
k_data = k_data.concat(k_searchTerms[k_screen]);
}
}
k_searchTerms = k_data;
k_data = [];
for (k_i = 0, k_cnt = k_searchTerms.length; k_i < k_cnt; k_i++) {
k_term = k_searchTerms[k_i];
k_keywords = k_term.keywords;
k_role = k_term.role;
if (k_role !== k_roleAll && ((k_role === k_roleDomain) != k_isDomainAdmin)) {
continue;
}
for (k_j = 0, k_keywordCnt = k_keywords.length; k_j < k_keywordCnt; k_j++) {
k_data.push({
hint: k_term.hint,
value: k_keywords[k_j].toLowerCase(),
origValue: k_keywords[k_j],
url: k_term.url,
target: k_term.target,
targetId: k_term.targetId,
targetAction: k_term.targetAction
});
}
}
this._k_dataStore.k_setData(k_data);
},
k_onSelect: function(k_parentWidget, k_select, k_value) {
this.k_processSpotlight(k_select.k_extWidget.selectedIndex);
},
k_processSpotlight: function(k_index, k_animOnly) {
var
k_data = this.k_extWidget.store.data.items[k_index],
k_url;
if (k_data) {
k_data = k_data.data;
k_url = k_data.url;
if (this._k_reFullUrl.test(k_url)) {
kerio.lib.k_openWindow(k_url);
}
else {
this.k_switchToSearchTerm({
k_url: k_data.url,
k_widget: k_data.targetId,
k_action: k_animOnly ? 'highlight' : k_data.targetAction,
k_focusEl: this.k_extWidget.el
});
}
}
},

k_switchToSearchTerm: function(k_config) {
this.k_searchTarget = k_config;
document.location.href = k_config.k_url;
this.k_switchToSearchTermPart2.defer(100, this);
},

k_switchToSearchTermPart2: function() {
var
k_processed = false,
k_target = this.k_searchTarget,
k_targetList,
k_targetType,
k_targetName,
k_tmp,
k_i, k_cnt;
if (kerio.adm.k_framework.k_screenIsChanging) {
this.k_switchToSearchTermPart2.defer(100, this);
return;
}
if (!k_target.k_action) {
k_target.k_action = 'click';
}
if (k_target.k_widget) {
k_targetList = k_target.k_widget.split('|');
for (k_i = 0, k_cnt = k_targetList.length; k_i < k_cnt; k_i++) {
k_tmp = k_targetList[k_i].split('=');
k_targetType = k_tmp[0];
k_targetName = k_tmp[1];
if (this.k_processSearchTarget(k_target, k_targetType, k_targetName)) {
k_processed = true;
break;
}
}
}
else {
this.k_processSearchTarget(k_target, 'screen', '');
k_processed = true;
}
if (!k_processed && k_target.k_widget) {
kerio.lib.k_log('Internal error: searchSpotlight - invalid target ' + k_target.k_widget);
}
if ('highlight' === k_target.k_action && k_target.k_focusEl) {
k_target.k_focusEl.focus.defer(500, k_target.k_focusEl);
}
},
k_processSearchTarget: function(k_target, k_targetType, k_targetName) {
var k_result = true;
switch (k_targetType) {
case 'screen':
this.k_highlight(kerio.adm.k_framework._k_lastWidget.k_extWidget.getEl());
break;
case 'tab':
k_result = this.k_switchToSearchTermTabPageActions(k_targetName, k_target.k_action);
break;
case 'button':
k_result = this.k_switchToSearchTermButtonActions(k_targetName, k_target.k_action);
break;
default:
kerio.lib.k_log('Internal error: Unknown type of target');
} return k_result;
},

k_switchToSearchTermButtonActions: function(k_targetName, k_action) {
var k_button = kerio.adm.k_framework._k_lastWidget.k_toolbars.k_bottom.k_items[k_targetName];
if (!k_button || !k_button.k_isVisible()) {
return false ;
}
if ('click' === k_action && k_button.k_isDisabled()) {
k_action = 'highlight';
}
switch(k_action){
case 'click':
if (k_button.k_submenu) {
k_button.k_submenu.k_show(k_button.k_extWidget.el);
}
else {
k_button._k_action._k_onClick.call(k_button._k_action, k_button.k_extWidget);
}
break;
case 'highlight':
this.k_highlight(k_button.k_extWidget.el);
break;
default:
kerio.lib.k_log('Internal error: Unknown type of action');
} return true;
},

k_switchToSearchTermTabPageActions: function(k_tabName, k_action) {
var k_currentWidget = kerio.adm.k_framework._k_lastWidget,
k_tabWidget;
if (!k_currentWidget._k_getTab) {
this.k_switchToSearchTermTabPageActions.defer(100, this, [k_tabName, k_action]);
return true;
}
k_tabWidget = k_currentWidget._k_getTab(k_tabName);
if (!k_tabWidget) {
kerio.lib.k_log('Internal error: Tab ' + k_tabName + ' is missing');
return false;
}
if ('click' === k_action && k_tabWidget.tabEl.className.indexOf('x-item-disabled')!== -1) {
k_action = 'highlight';
}
switch(k_action){
case 'click':
k_currentWidget.k_setActiveTab(k_tabName);
break;
case 'highlight':
this.k_highlight(k_tabWidget.tabEl);
break;
default:
kerio.lib.k_log('Internal error: Unknown type of action');
} return true;
},
k_highlight: function(k_element) {
var k_extElement;
if (k_element === this._k_lastHighlightedElement) {
return;
}
this._k_lastHighlightedElement = k_element;
k_extElement = Ext.fly(k_element);
if (!this._k_highlightEl) {
this._k_highlightEl = Ext.getBody().createChild({
tag: 'div',
id: 'globalHighlighter',
children: [{tag: 'div'}]
});
}
if (this._k_highlightElTimerId) {
clearTimeout(this._k_highlightElTimerId);
}
this._k_highlightEl.setSize(50,50);
this._k_highlightEl.center();
this._k_highlightEl.setVisible(true);
this._k_highlightEl.setBox(k_extElement.getBox(), true, true);
this._k_highlightElTimerId = this._k_highlightEl.setVisible.defer(3000, this._k_highlightEl, false);
},
k_showSearchHint: function(k_text) {
var k_box = this.k_extWidget.getBox();
k_box.y += k_box.height;
this._k_searchHintEl.setBox(k_box);
this._k_searchHintEl.dom.innerHTML = k_text;
this._k_searchHintEl.show();
},
k_hideSearchHint: function() {
this._k_searchHintEl.hide();
}
});


kerio.adm.k_widgets.K_MyKerioSettings = function(k_objectName, k_initParams) {
k_initParams = k_initParams || {};
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_kerioLibraryRoot = k_lib.k_kerioLibraryRoot,
k_JOIN_LINK = 'joinLink',
k_VISIT_LINK = this.k_VISIT_LINK,
k_PRODUCT_NAME = k_lib.k_getSharedConstants('k_PRODUCT_NAME'),
k_showApplyReset = k_initParams.k_showApplyReset,
k_displayMarketing = k_initParams.k_displayMarketing,
k_isAuditor = k_initParams.k_isAuditor,
_k_saveMethod = k_initParams.k_saveMethod,
_k_loadStatusCallback = k_initParams.k_statusCallback,
k_statusTexts,
k_learnMoreClick,
k_formCfg;
k_statusTexts = {
statusWaiting:      k_tr('Waiting for the server response…', 'wlibMyKerioSettings'),
statusNotAdded:     k_tr('Not added. You have to %1add this %2%3 to your MyKerio account to manage it.', 'wlibMyKerioSettings', {k_args: [k_isAuditor ? '' : '<a id="' + k_JOIN_LINK + '">', k_PRODUCT_NAME, k_isAuditor ? '' : '</a>'], k_isSecure: true}),
statusDisabled:    k_tr('Disabled. Communication with MyKerio is disabled.', 'wlibMyKerioSettings'),
statusDisconnected: k_tr('Disconnected. %1 is trying to establish connection with MyKerio.', 'wlibMyKerioSettings', {k_args: [k_PRODUCT_NAME]}),
statusReady:        k_tr('Ready. You can manage this %1 in %2MyKerio%3.', 'wlibMyKerioSettings', {k_args: [k_PRODUCT_NAME, '<a id="' + k_VISIT_LINK + '">', '</a>'], k_isSecure: true})
};
k_learnMoreClick = function(k_form, k_item, k_linkId) {
var k_kbLinks = {
'Kerio Control' : 1766,
'Kerio Connect' : 1944,
'Kerio Operator': 1929
};
if ('learnMore' === k_linkId) {
kerio.lib.k_openWindow(kerio.adm.k_getKbLinkUrl(k_kbLinks[kerio.lib.k_getSharedConstants('k_PRODUCT_NAME')]), '_blank');
return false;
}
};
if (k_displayMarketing.k_isSecure) {
k_displayMarketing.k_value += ' <a id="learnMore">' + kerio.lib.k_tr('Learn more…', 'common') + '</a>';
if (k_displayMarketing.k_onLinkClick) {
k_displayMarketing.k_onLinkClick = k_displayMarketing.k_onLinkClick.createInterceptor(k_learnMoreClick);
}
else {
k_displayMarketing.k_onLinkClick = k_learnMoreClick;
}
}
else {
kerio.lib.k_warn('k_displayMarketing.k_isSecure is expected to be true! (because of added link to KB)');
}
this.k_createEolWarning = function() {
var eolMessage = {};
if (kerio.waw.shared.k_cloud_messages) {
var message = kerio.waw.shared.k_cloud_messages['MyKerioEOL'];
if (message) {
var translatedMessage = message[kerio.lib.k_translation.k_currentLanguage];
if (translatedMessage) {
eolMessage.messageText = translatedMessage['EOLText'];
eolMessage.linkText = translatedMessage['LinkText'];
eolMessage.linkUrl = message['url'];
}
}
}
return {
k_type: 'k_display',
k_id: 'k_eolWarning',
k_isHidden: !eolMessage.messageText,
k_icon: 'img/warning.png?v=8629',
k_value: {
messageText: eolMessage.messageText,
linkText: eolMessage.linkText
},
k_template: '{messageText} <a id="myKerioEolLink">{linkText}</a>',
k_onLinkClick: function(k_form, k_item, k_id) {
kerio.lib.k_openWindow(eolMessage.linkUrl, '_blank');
}
};
};
k_formCfg = {
k_useStructuredData: true,
k_restrictBy: {
k_isAuditor: k_isAuditor
},
k_labelWidth: 240,
k_onChange: function () {
if (this.k_showApplyReset) {
kerio.adm.k_framework.k_enableApplyReset(true);
}
else {
this.k_saveData();
}
},
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('MyKerio settings', 'wlibMyKerioSettings'),
k_id: 'myKerioFieldset',
k_className: 'myKerioFieldset',
k_items: [
{
k_type: 'k_checkbox',
k_id: 'enabled',
k_isLabelHidden: true,
k_restrictions: {
k_isAuditor: [ false ]
},
k_option: k_tr('Enable communication with MyKerio', 'wlibMyKerioSettings')
},
{
k_type: 'k_display',
k_id: 'k_warningMessage',
k_icon: 'img/warning.png?v=8629',
k_className: 'warningImgIcon',
k_isHidden: true,
k_isLabelHidden: true,
k_isSecure: true,
k_value: 'The MyKerio is currently selected as a backup service. Before disconnecting, please select a different backup option in the Backups tab first',
k_restrictions: {
k_isAuditor: [ false ]
}
},
k_displayMarketing,
{
k_type: 'k_display',
k_id: 'k_statusInfo',
k_className: 'myKerioStatus statusWaiting',
k_isSecure: true,
k_value: {
k_info: k_statusTexts.statusWaiting
},
k_template: '<i class="icon"></i>{k_info}',
k_onLinkClick: function(k_form, k_item, k_id) {
switch(k_id) {
case k_form.k_VISIT_LINK:
kerio.lib.k_openWindow(k_form._k_appUrl, '_blank');
break;
case k_form.k_JOIN_LINK:
kerio.lib.k_openWindow(k_form._k_joinUrl, '_blank');
break;
}
}
},
{
k_type: 'k_formButton',
k_id: 'k_btnRemove',
k_restrictions: {
k_isAuditor: [ false ]
},
k_caption: k_tr('Remove from MyKerio', 'wlibMyKerioSettings'),
k_isHidden: true,
k_onClick: function(k_form) {
k_form.k_disconnectConfirm();
}
},
this.k_createEolWarning()
]
}
]
};
kerio.adm.k_widgets.K_MyKerioSettings.superclass.constructor.call(this, k_objectName, k_formCfg);

this.k_extWidget.on('bodyresize', function(k_extComponent, k_width) {
var
k_myKerioFieldset = this._kx.k_owner.k_getItem('myKerioFieldset');
k_myKerioFieldset.k_removeClassName(['noLogo', 'smallLogo', 'bigLogo']);
if (k_width < 500) {
k_myKerioFieldset.k_addClassName('noLogo');
}
else if (k_width < 800) {
k_myKerioFieldset.k_addClassName('smallLogo');
}
else {
k_myKerioFieldset.k_addClassName('bigLogo');
}
});
this.k_addReferences({
k_isAuditor: k_isAuditor,
k_JOIN_LINK: k_JOIN_LINK,
k_showApplyReset: k_showApplyReset,
_k_data: {},
_k_appUrl: 'http://my.kerio.com',
_k_joinUrl: '',
_k_statusTexts: k_statusTexts,
_k_updateTaskId: 'k_myKerioStatusUpdateTask',
_k_task: false,
_k_saveMethod: _k_saveMethod,
_k_loadStatusCallback: _k_loadStatusCallback,
k_openMyKerioWeb: function() {
kerio.lib.k_openWindow(this._k_appUrl, '_blank');
}
});
if (k_isAuditor) {
this.k_setReadOnlyAll();
}
}; kerio.lib.k_extend('kerio.adm.k_widgets.K_MyKerioSettings', kerio.lib.K_Form, {

k_VISIT_LINK: 'visitLink',

k_applyParams: function(k_params) {
k_params = k_params || {};
if (this.k_isCallFromOtherScreens()) {
this.k_reset();
}
this.k_loadData();
this.k_loadStatus();
this.k_startUpdateTask();
},

k_isCallFromOtherScreens: function () {
return !(kerio.adm.k_framework._k_targetChoice &&
kerio.adm.k_framework._k_previousWidgetId) ||
(kerio.adm.k_framework._k_targetChoice.k_id === 'integration' &&
kerio.adm.k_framework._k_previousWidgetId !== 'integration_k_tabs');
},

k_loadData: function() {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'CentralManagement.get'
},
k_callback: this._k_setConfig,
k_scope: this
});
},

_k_setConfig: function(k_response, k_success) {
var k_config;
if (k_success && k_response.k_isOk) {
k_config = k_response.k_decoded.config;
this.k_setData(k_config, true);
this._k_enabled = k_config.enabled;
this._k_appUrl = k_config.appUrl;
kerio.adm.k_framework.k_enableApplyReset(false);
}
},

k_loadStatus: function() {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'CentralManagement.getStatus'
},
k_callback: this._k_setStatus,
k_scope: this
});
},

_k_setStatus: function(k_response, k_success) {
var
k_status;
if (k_success && k_response.k_isOk) {
k_status = k_response.k_decoded.status;
this._k_joinUrl = k_status.url.value;
if (!this._k_enabled) {
this.k_switchStatus('statusDisabled');
}
else if (!k_status.connected) {
this.k_switchStatus('statusDisconnected');
}
else if (!k_status.paired) {
if (!k_status.url.value) {
this.k_switchStatus('statusWaiting');
}
else {
this.k_switchStatus('statusNotAdded');
}
}
else {
this.k_switchStatus('statusReady');
}
this.k_setVisible(['k_btnRemove'], k_status.paired);
if (this._k_loadStatusCallback) {
this._k_loadStatusCallback(k_status);
}
}
},

k_switchStatus: function(k_status) {
var
k_statusElement = this.k_getItem('k_statusInfo'),
k_statusTexts = this._k_statusTexts;
k_statusElement.k_setValue({
k_info: k_statusTexts[k_status]
});
k_statusElement.k_removeClassName(['statusWaiting', 'statusNotAdded', 'statusDisabled', 'statusDisconnected', 'statusReady']);
k_statusElement.k_addClassName(k_status);
},

k_startUpdateTask: function() {
if (!this._k_task) {
this._k_task = new kerio.lib.K_TaskRunner({
k_precision: 333,
k_taskList: [{
k_id: this._k_updateTaskId,
k_run: function() {
this.k_loadStatus();
},
k_scope: this,
k_interval: 2000,
k_startNow: true
}]
});
}
this._k_task.k_resume(this._k_updateTaskId);
},

k_stopUpdateTask: function() {
if (this._k_task) {
this._k_task.k_suspend(this._k_updateTaskId);
}
},

k_saveDataCallback: function() {
if  (!this.k_showApplyReset) {
this.k_loadData();
}
},

k_saveData: function() {
var
k_data = this.k_getData();
if (this._k_saveMethod) {
this._k_saveMethod(k_data, this.k_saveDataCallback);
}
else {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'CentralManagement.set',
params: {
config: k_data
}
},
k_callback: this.k_saveDataCallback,
k_scope: this
});
}
},

k_disconnectConfirm: function() {
kerio.lib.k_confirm({
k_title: kerio.lib.k_tr('Confirm Action', 'common'),
k_msg: kerio.lib.k_tr('Are you sure you want to remove this appliance from MyKerio?', 'wlibMyKerioSettings'),
k_callback: function(k_response) {
if ('no' === k_response) {
return;
}
this.k_disconnect();
},
k_scope: this
});
},

k_disconnect: function() {
kerio.lib.k_maskWidget(this);
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'CentralManagement.reset'
},
k_callback: function() {
kerio.lib.k_unmaskWidget(this);
this.k_loadData();
},
k_scope: this
});
}
}); 