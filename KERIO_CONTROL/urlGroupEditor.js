
kerio.waw.ui.urlGroupEditor = {
k_init: function(k_objectName) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_methods = kerio.waw.shared.k_methods,
k_isAuditor = k_methods.k_isAuditor(),
k_engineManager = 'UrlGroups',
k_isGroupItemAdd = ('urlGroupAdd' === k_objectName),
k_GROUP_TYPE = k_WAW_CONSTANTS.UrlEntryType,
k_isReadOnly = false,
k_items,
k_dialogCfg, k_dialog,
k_form,
k_title,
k_isEditMode;
k_items = [
{
k_type: 'k_fieldset',
k_caption: k_tr('Properties', 'urlGroupEditor'),
k_labelWidth: 130,
k_className: 'removeFieldsetMargin',
k_items: [
{
k_type: 'k_select',
k_id: 'k_groupItemType',
k_localData: [
{ k_name : k_tr('URL', 'urlGroupEditor'),       k_value : k_GROUP_TYPE.Url},
{ k_name : k_tr('URL Group', 'urlGroupEditor'), k_value : k_GROUP_TYPE.UrlChildGroup}
],
k_caption: k_tr('Type:', 'urlGroupEditor'),
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',
k_value: k_GROUP_TYPE.Url,
k_onChange: function(k_form) {
var k_isGroup = k_form.k_dialog.k_isChildGroupSelected();
k_form.k_setVisible(['k_childGroup'], k_isGroup);
k_form.k_setVisible(['k_groupUrl', 'isRegex', 'k_learnMoreUrl'], !k_isGroup);
}
},
{
k_id: 'k_groupUrl',
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME,
k_checkByteLength: true,
k_caption: k_tr('URL:', 'urlGroupEditor'),
k_validator: {
k_allowBlank: false,
k_functionName: 'k_hasNoSpaces'
}
},
{
k_type: 'k_checkbox',
k_id: 'isRegex',
k_caption: ' ',
k_option: k_tr('Use regular expression', 'httpRuleEditor')
},
k_methods.k_getDisplayFieldWithKbLink(1512,
k_tr('Learn more about wildcards and regular expressions in URL', 'httpRuleEditor'),
{
k_id: 'k_learnMoreUrl',
k_caption: ' ',
k_indent: 1
}
),
{
k_type: 'k_select',
k_id: 'k_childGroup',
k_caption: k_tr('URL Group:', 'urlGroupEditor'),
k_isHidden: true,
k_localData: {},
k_value: k_tr('Loading groups…', 'urlGroupEditor'),
k_isDisabled: true,
k_fieldDisplay: 'name',
k_fieldValue: 'id'
},
{
k_maxLength: 255,
k_checkByteLength: true,
k_id: 'k_groupDescription',
k_caption: k_tr('Description:', 'common'),
k_validator: {
k_functionName: 'k_isDescription'
}
}
]
}
];
if (k_isGroupItemAdd) {
k_isEditMode = false;
k_title = k_tr('Add URL', 'groupingDialog');
}
else {
k_isEditMode = true;
if ('urlGroupView' === k_objectName) {
k_title = k_tr('View URL', 'groupingDialog');
k_isReadOnly = true;
}
else {
k_title = k_tr('Edit URL', 'groupingDialog');
}
}
k_dialogCfg = {
k_items: k_items,
k_isReadOnly: k_isReadOnly,
k_isEditMode: !k_isGroupItemAdd,
k_getGroupList: {
k_manager: k_engineManager },
k_size: {
k_height: 360,
k_width: 550
},
k_childGroup: 'k_childGroup',
k_translations: {
k_title: k_title
},
k_isChildGroupSelected: function() {
var
k_ITEM_TYPES = kerio.waw.shared.k_CONSTANTS.UrlEntryType,
k_isGroupSelected = (k_ITEM_TYPES.UrlChildGroup === this.k_form.k_groupItemType.k_getValue());
return k_isGroupSelected;
},
k_onOkClick: function(k_dialog) {
k_dialog.k_sendData();
}
};
k_dialog = new kerio.adm.k_widgets.K_GroupingDialog(k_objectName, k_dialogCfg);
k_form = k_dialog.k_form;
k_dialog.k_addReferences({
k_isGroupItemAdd: k_isGroupItemAdd,
k_isAuditor: k_isAuditor,
k_engineManager: k_engineManager,
k_groupItemType: k_form.k_getItem('k_groupItemType')
});
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_sendDataRequest: {
k_jsonRpc: {},
k_callback: k_dialog.k_sendDataCallback,
k_scope: k_dialog
}
});
k_form.k_addReferences({
k_childGroup: k_form.k_getItem('k_childGroup'),
k_groupItemType: k_form.k_getItem('k_groupItemType'),
k_dataStore: []
});
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
var
k_form = this.k_form,
k_data = k_params.k_data,
k_hasData = (undefined !== k_data && !this.k_isGroupItemAdd), k_parentGroup,
k_childGroup,
k_defaultGroup,
k_type;
k_form.k_dataStore = k_data;
this.k_relatedGrid = k_params.k_relatedWidget;
this.k_groupToAdd = '';k_type = k_hasData ? k_data.type: kerio.waw.shared.k_CONSTANTS.UrlEntryType.Url;
if (!this.k_groupItemType) {
this.k_groupItemType = k_form.k_getItem('k_groupItemType');
}
this.k_groupItemType.k_setValue(k_type);
if (k_hasData) {
this.k_setData.call(k_form, k_data);
}
if (k_hasData) {
k_parentGroup = {
id: k_data.groupId,
name: k_data.groupName
};
k_childGroup = {
id: k_data.childGroupId,
name: k_data.childGroupName
};
}
else {
k_defaultGroup = k_params.k_defaultGroup;
if (k_defaultGroup && k_defaultGroup.id) {
k_parentGroup = {
id: k_defaultGroup.id,
name: k_defaultGroup.name
};
}
else {
k_parentGroup = {};
}
k_childGroup = {};
}
this._k_parentGroupList = k_params.k_groupList;
this.k_fillGroupList(k_parentGroup, k_childGroup);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };

k_kerioWidget.k_setData = function(k_data) {
var
k_form = this,
k_formData = {};
k_formData.k_groupDescription = k_data.description;
k_formData.k_id = k_data.id;
if (kerio.waw.shared.k_CONSTANTS.UrlEntryType.Url === k_data.type) {
k_formData.k_groupUrl = k_data.url;
k_formData.isRegex = k_data.isRegex;
} else {
k_formData.k_childGroup = k_data.childGroupName;
}
k_formData.k_groupItemType = k_data.type;
k_form.k_setData(k_formData);
};

k_kerioWidget.k_sendData = function() {
if (this.k_isAuditor || this.k_isReadOnly()) {
return; }
var
k_form = this.k_form,
k_data = k_form.k_getData(),
k_constTypes = kerio.waw.shared.k_CONSTANTS.UrlEntryType,
k_collectedData = {},
k_group = this.k_getGroup(),
k_sendDataRequest = this.k_sendDataRequest,
k_jsonRpc = k_sendDataRequest.k_jsonRpc,
k_isEnabled,
k_method,
k_params;
k_collectedData.groupId = k_group.id;
k_collectedData.groupName = k_group.name;
switch (k_data.k_groupItemType) {
case k_constTypes.Url:
k_collectedData.url = kerio.waw.shared.k_methods.k_correctUri(k_data.k_groupUrl);
k_collectedData.isRegex = k_data.isRegex;
break;
case k_constTypes.UrlChildGroup:
k_collectedData.childGroupId = k_data.k_childGroup;
k_collectedData.childGroupName = k_form.k_childGroup.k_getText();
break;
}
k_collectedData.type = k_data.k_groupItemType;
k_collectedData.description = k_data.k_groupDescription;
k_isEnabled = (this.k_isGroupItemAdd || true === k_form.k_dataStore.enabled);
k_collectedData.enabled = k_isEnabled;
kerio.lib.k_maskWidget(this, {k_message: kerio.lib.k_tr('Saving…', 'common')});
if (this.k_isGroupItemAdd) {
k_method = 'create';
k_params = {groups: [k_collectedData]};
}
else {
k_method = 'set';
k_params = {groupIds: [k_form.k_dataStore.id], details: k_collectedData};
}
k_jsonRpc.method = this.k_engineManager + '.' + k_method;
k_jsonRpc.params = k_params;
kerio.lib.k_ajax.k_request(k_sendDataRequest);
};

k_kerioWidget.k_sendDataCallback = function(k_response) {
kerio.adm.k_widgets.K_TimeRangeEditor.superclass._k_saveDataCallback.call(this, k_response);
if (!kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
return;
}
this.k_relatedGrid.k_reloadData();
if ('urlGroupList' === this.k_relatedGrid.k_id) {
kerio.waw.shared.k_data.k_get(this.k_relatedGrid.k_dataStoreId, true);
kerio.adm.k_framework.k_enableApplyReset();
}
this.k_hide();
};
} }; 