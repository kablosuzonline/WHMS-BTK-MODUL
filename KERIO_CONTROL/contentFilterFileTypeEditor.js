
kerio.waw.ui.contentFilterFileTypeEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_PREDEFINED_FILE_TYPE = k_CONSTANTS.k_FILE_TYPE_DEFINITION_TYPE.k_PREDEFINED,
k_CUSTOM_FILE_TYPE = k_CONSTANTS.k_FILE_TYPE_DEFINITION_TYPE.k_CUSTOM,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_formCfg, k_form,
k_dialogCfg, k_dialog;
k_formCfg = {
k_labelWidth: 80,
k_items: [
{	k_type: 'k_radio',
k_groupId: 'k_radioFileType',
k_option: k_tr('Select predefined file type', 'contentFilter'),
k_value: k_PREDEFINED_FILE_TYPE,
k_isChecked: true,
k_isLabelHidden: true,
k_onChange: function(k_form, k_item, k_value) {
var
k_isPredefinedUsed = k_form.k_PREDEFINED_FILE_TYPE === k_value;
k_form.k_setDisabled(['k_predefinedFileTypes', 'k_predefinedDescription'], !k_isPredefinedUsed);
k_form.k_setDisabled(['k_pattern'], k_isPredefinedUsed);
}
},
{
k_type: 'k_select',
k_id: 'k_predefinedFileTypes',
k_caption: k_tr('File type:', 'contentFilter'),
k_fieldDisplay: 'k_name', k_fieldValue: 'k_id', k_localData: [],
k_value: k_tr('Loading file types…', 'contentFilter'),
k_indent: 1,
k_onChange: function(k_form, k_item, k_value) {
var
k_fileTypeAttributes = kerio.waw.shared.k_CONSTANTS.k_FILE_GROUP_TYPES[k_value];
if (k_fileTypeAttributes) {
k_form.k_predefinedDescription.k_setValue(k_fileTypeAttributes.pattern);
}
}
},
{
k_id: 'k_predefinedDescription',
k_type: 'k_display',
k_itemClassName: 'selectable',
k_caption: ' ',
k_value: '',
k_indent: 1,
k_height: 30
},
{
k_type: 'k_container',
k_style: 'padding-top: 10px',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'k_radioFileType',
k_option: k_tr('Specify your own file name', 'contentFilter'),
k_value: k_CUSTOM_FILE_TYPE,
k_isLabelHidden: true
},
{
k_id: 'k_pattern',
k_caption: k_tr('Pattern:', 'contentFilter'),
k_maxLength: k_CONSTANTS.k_MAX_LENGTH.k_FILE_TYPE_LIST,
k_checkByteLength: true,
k_isDisabled: true,
k_indent: 1,
k_validator: {
k_allowBlank: false
}
}
]
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_itemClassName: 'paddingTop20px',
k_style: 'background-position: 0 2px;',
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('The filtering works on HTTP, FTP and POP3 protocols.', 'contentFilter')
}
]
}; k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 690,
k_height: 275,
k_title: k_tr('Content Rule - File Name', 'contentFilter'),
k_content: k_form,
k_defaultItem: null,

k_onOkClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData.call(k_toolbar.k_dialog);
}
};
k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_form.k_addReferences({
k_PREDEFINED_FILE_TYPE: k_PREDEFINED_FILE_TYPE,
k_CUSTOM_FILE_TYPE: k_CUSTOM_FILE_TYPE,
k_predefinedFileTypes: k_form.k_getItem('k_predefinedFileTypes'),
k_predefinedDescription: k_form.k_getItem('k_predefinedDescription'),
k_inputPattern: k_form.k_getItem('k_pattern'),
k_radioFileType: k_form.k_getItem('k_radioFileType')
});
k_dialog.k_addReferences({
k_form: k_form,
k_isEditMode: false,
k_relatedGrid: null
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({
k_applyParams: function(k_params) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_predefinedTypes = k_CONSTANTS.k_FILE_GROUP_TYPES,
k_form = this.k_form,
k_data = k_params.k_data,
k_isSpecifyPattern = true,
k_predefinedFileType,
k_listLoader,
k_value;
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_isEditMode = undefined !== k_data;
if (this.k_isEditMode) {
k_value = k_data.value;
k_predefinedFileType = k_predefinedTypes[k_value];
k_isSpecifyPattern = undefined === k_predefinedFileType;
k_form.k_radioFileType.k_setValue(k_isSpecifyPattern ? k_form.k_CUSTOM_FILE_TYPE : k_form.k_PREDEFINED_FILE_TYPE);
if (k_isSpecifyPattern) {
k_form.k_inputPattern.k_setValue(k_value);
}
}
if (k_isSpecifyPattern) {
k_predefinedFileType = k_predefinedTypes[k_CONSTANTS.k_FILE_TYPE_FIRST_GROUP];
}
k_form.k_predefinedDescription.k_setValue(k_predefinedFileType.pattern);
k_listLoader = new kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_fileTypeList',
k_select: k_form.k_predefinedFileTypes,
k_form: k_form,
k_addNoneOption: false,
k_value: {
k_id: k_predefinedFileType.name
}
});
k_listLoader.k_sendRequest();
},
k_sendData: function() {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
ContentConditionEntityType = k_CONSTANTS.ContentConditionEntityType,
k_form = this.k_form,
k_grid = this.k_relatedGrid,
k_data = k_form.k_getData(),
k_isPredefined = k_form.k_PREDEFINED_FILE_TYPE === k_data.k_radioFileType,
k_value,
k_type,
k_fileTypeCondition;
if (k_isPredefined) {
k_value = k_CONSTANTS.k_FILE_GROUP_TYPES[k_data.k_predefinedFileTypes].name;
k_type = ContentConditionEntityType.ContentConditionEntityFileGroup;
}
else {
k_value = k_data.k_pattern;
k_type = ContentConditionEntityType.ContentConditionEntityFileName;
}
k_fileTypeCondition = {
type: k_type,
value: k_value,
predefined: k_isPredefined
};
k_grid.k_updateItemCallback(k_fileTypeCondition, this.k_isEditMode);
this.k_hide();
},
k_resetOnClose: function() {
this.k_form.k_reset();
}
});
}
}; 