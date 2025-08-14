
kerio.waw.ui.contentFilterForbiddenWordsEditor = {
k_init: function(k_objectName) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_isItemAdd = ('contentFilterForbiddenWordsEditorAdd' === k_objectName),
k_isEditMode = false,
k_dialogCfg,
k_dialog,
k_formItems,
k_title,
k_form;
k_formItems = [
{	k_type: 'k_fieldset',
k_caption: k_tr('Properties', 'urlGroupEditor'),
k_className: 'removeFieldsetMargin',
k_items: [
{	k_id: 'keyword',
k_caption: k_tr('Keyword:', 'httpForbiddenWords'),
k_maxLength: 63,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false
}
},
{	k_type: 'k_number',
k_id: 'weight',
k_caption: k_tr('Weight:', 'httpForbiddenWords'),
k_maxLength: 7,
k_maxValue: 9999999,
k_minValue: -9999999,
k_allowNegative: true,
k_validator: {
k_allowBlank: false
}
},
{	k_id: 'description',
k_caption: k_tr('Description:', 'common'),
k_maxLength: 255,
k_checkByteLength: true
}
]
}
];
if (!k_isItemAdd) {
k_isEditMode = true;
if (k_isAuditor) {
k_title = k_tr('View Group Item', 'httpForbiddenWords');
}
else {
k_title = k_tr('Edit Group Item', 'httpForbiddenWords');
}
}
else {
k_title = k_tr('Add Group Item', 'httpForbiddenWords');
}
k_dialogCfg = {
k_translations: {
k_title: k_title
},
k_getGroupList: {
k_manager: 'ForbiddenWords'
},
k_items: k_formItems,
k_isReadOnly: k_isAuditor,
k_isEditMode: !k_isItemAdd,
k_size: {
k_height: 300
},

k_onOkClick: function(k_dialog) {
k_dialog.k_sendData();
}
};
k_dialog = new kerio.adm.k_widgets.K_GroupingDialog('forbiddenWordsEditor' + '_' + k_objectName, k_dialogCfg);
k_form = k_dialog.k_form;
k_form.k_addReferences({
k_dataStore: {}
});
k_dialog.k_addReferences({
k_relatedGrid: {},
k_isItemAdd: k_isItemAdd
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_applyParams = function(k_params) {
var
k_form = this.k_form,
k_hasData,
k_defaultGroup,
k_parentGroup,
k_data;
this.k_relatedGrid = k_params.k_relatedWidget;
this.k_groupToAdd = '';k_data = k_params.k_data;
k_form.k_dataStore = k_data;
k_hasData = (undefined !== k_data && !this.k_isItemAdd); if (k_hasData) {
k_form.k_setData(
{	keyword: k_data.keyword,
weight: k_data.weight,
description: k_data.description
}
);
k_parentGroup = {id: k_data.groupId};
} else {
k_defaultGroup = kerio.waw.shared.k_methods.k_getDefaultGroup(k_params.k_relatedWidget);
if (k_defaultGroup.id) {
k_parentGroup = {
id: k_defaultGroup.id,
name: k_defaultGroup.name
};
}
else {
k_parentGroup = {};
}
}
this._k_parentGroupList = kerio.waw.shared.k_methods.k_getGroupList(k_params.k_relatedWidget);
this.k_fillGroupList(k_parentGroup);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };
k_kerioWidget.k_addReferences({

k_sendData: function() {
var
k_method = 'ForbiddenWords', k_data = {},
k_formData,
k_group,
k_form,
k_params;
k_form = this.k_form;
k_formData = this.k_form.k_getData();
k_group = this.k_getGroup();
k_data.groupName = k_group.name;
k_data.groupId = k_group.id;
k_data.description = k_formData.description;
k_data.keyword = k_formData.keyword;
k_data.weight = k_formData.weight;
if (this.k_isItemAdd) {
k_data.enabled = true;
k_method += '.create';
k_params = {items: [k_data]};
}
else {
k_data.groupId = k_group.id;
k_data.enabled = k_form.k_dataStore.enabled;
k_method += '.set';
k_params = {ids: [k_form.k_dataStore.id], details: k_data};
}
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: k_method,
params: k_params
},
k_callback: this.k_sendDataCallback,
k_scope: this
});
},

k_sendDataCallback: function(k_response) {
var
k_relatedGrid;
if (!kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
return;
}
k_relatedGrid = this.k_relatedGrid;
k_relatedGrid.k_onChangeHandler(k_relatedGrid.k_batchId);
k_relatedGrid.k_reloadData();
this.k_hide();
}
});
} }; 