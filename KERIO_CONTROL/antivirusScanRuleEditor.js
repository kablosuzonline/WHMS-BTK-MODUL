
kerio.waw.ui.antivirusScanRuleEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
ScanRuleType = k_WAW_CONSTANTS.ScanRuleType,
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_dialog, k_dialogCfg,
k_form, k_formCfg;
k_formCfg = {
k_items: [
{
k_type: 'k_select',
k_id: 'type',
k_caption: k_tr('Condition type:', 'antivirusScanRuleEditor'),
k_fieldDisplay: 'k_value',
k_fieldValue: 'k_id',
k_fieldIconClassName: 'k_iconClass',
k_listClassName: 'avRuleType',
k_localData: [
{ k_id: ScanRuleType.ScanRuleUrl,  k_value: k_tr('HTTP URL', 'antivirusList'), k_iconClass: 'url'},
{ k_id: ScanRuleType.ScanRuleMime, k_value: k_tr('HTTP MIME type', 'antivirusList'), k_iconClass: 'mime'},
{ k_id: ScanRuleType.ScanRuleFilename, k_value: k_tr('Filename', 'antivirusList'), k_iconClass: 'file'},
{ k_id: ScanRuleType.ScanRuleFileGroup,k_value: k_tr('File type', 'antivirusList'), k_iconClass: 'file'}
],
k_value: ScanRuleType.ScanRuleUrl,
k_onChange: function(k_form, k_select, k_value) {
var ScanRuleType = k_form.k_parentWidget.ScanRuleType;
k_form.k_setVisible(['k_urlContentContainer'], ScanRuleType.ScanRuleUrl === k_value);
k_form.k_setVisible(['k_mimeContainer'], ScanRuleType.ScanRuleMime === k_value);
k_form.k_setVisible(['k_fileContainer'], ScanRuleType.ScanRuleFilename === k_value);
k_form.k_setVisible(['k_fileGroupContainer'], ScanRuleType.ScanRuleFileGroup === k_value);
}
},
{
k_id: 'k_urlContentContainer',
k_type: 'k_container',
k_height: 65,
k_items: [
{
k_id: 'k_urlContent',
k_caption: k_tr('URL address:', 'antivirusScanRuleEditor'),
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isHttpProtocol'
}
},
{
k_type: 'k_display',
k_caption: ' ',
k_value: k_tr('Wildcard characters (%1) are allowed.', 'dnsForwarderEditor', { k_args: ['*, ?'], k_isSecure: true})
}
]
},
{
k_id: 'k_mimeContainer',
k_type: 'k_container',
k_height: 65,
k_isHidden: true,
k_items: [
{
k_type: 'k_selectTypeAhead',
k_isEditable: true,
k_id: 'k_mimeContent',
k_caption: k_tr('MIME type:', 'antivirusScanRuleEditor'),
k_validator: {
k_functionName: 'k_hasNoSpaces',
k_allowBlank: false
},
k_value: '',
k_checkPreselectedValue: false,
k_fieldDisplay: 'name',
k_fieldValue: 'value',
k_localData: k_WAW_DEFINITIONS.k_MIME_TYPES_MAPPED
},
{
k_type: 'k_display',
k_caption: ' ',
k_value: k_tr('Wildcard characters (%1) are allowed.', 'dnsForwarderEditor', { k_args: ['*, ?'], k_isSecure: true})
}
]
},
{
k_id: 'k_fileContainer',
k_type: 'k_container',
k_height: 65,
k_isHidden: true,
k_items: [
{
k_id: 'k_fileContent',
k_caption: k_tr('Pattern:', 'contentFilter'),
k_validator: {
k_allowBlank: false
},
k_value: ''
},
{
k_type: 'k_display',
k_caption: ' ',
k_value: k_tr('Wildcard characters (%1) are allowed.', 'dnsForwarderEditor', { k_args: ['*, ?'], k_isSecure: true})
}
]
},
{
k_id: 'k_fileGroupContainer',
k_type: 'k_container',
k_height: 65,
k_isHidden: true,
k_items: [
{
k_type: 'k_select',
k_id: 'k_fileGroup',
k_caption: k_tr('File type:', 'contentFilter'),
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: [],
k_value: k_tr('Loading file types…', 'contentFilter'),
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
k_height: 35
}
]
},
{
k_type: 'k_select',
k_id: 'scan',
k_caption: k_tr('Action:', 'antivirusScanRuleEditor'),
k_fieldDisplay: 'k_value',
k_fieldValue: 'k_id',
k_fieldIconClassName: 'k_iconClass',
k_listClassName: 'avRuleAction',
k_localData: [
{ k_id: 1,  k_value: k_tr('Scan', 'antivirusScanRuleEditor'), k_iconClass: 'scan'},
{ k_id: 0, k_value: k_tr('Do not scan', 'antivirusScanRuleEditor'), k_iconClass: 'noScan'}
],
k_value: 1
},
{
k_id: 'description',
k_caption: k_tr('Description:', 'common'),
k_maxLength: 255,
k_checkByteLength: true
}
]
};
k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_form.k_addReferences({
k_predefinedDescription: k_form.k_getItem('k_predefinedDescription'),
k_fileGroup: k_form.k_getItem('k_fileGroup')
});
k_dialogCfg = {
k_width: 690,
k_height: 300,
k_title: k_tr('Antivirus Scanning Rule', 'antivirusScanRuleEditor'),
k_content: k_form,
k_defaultItem: 'type',

k_onOkClick: function(k_toolbar){
k_toolbar.k_dialog.k_saveData();
}
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_WAW_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg));
k_dialog.k_addReferences({
k_form: k_form,
k_saveCallback: null,
k_parentWidget: null,
ScanRuleType: ScanRuleType
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_predefinedTypes = k_CONSTANTS.k_FILE_GROUP_TYPES,
k_form = this.k_form,
k_listLoader,
k_selectedFileGroup,
k_data;
if (k_params.k_data) {
this.k_dataStore = k_params.k_data;
k_data = kerio.lib.k_cloneObject(k_params.k_data);
switch (k_data.type) {
case this.ScanRuleType.ScanRuleUrl:
k_data.k_urlContent = k_data.pattern;
break;
case this.ScanRuleType.ScanRuleMime:
k_data.k_mimeContent = k_data.pattern;
break;
case this.ScanRuleType.ScanRuleFilename:
k_data.k_fileContent = k_data.pattern;
break;
case this.ScanRuleType.ScanRuleFileGroup:
k_selectedFileGroup = k_predefinedTypes[k_data.pattern];
break;
}
this.k_editedRow = k_params.k_rowIndex;
k_data.scan = k_data.scan ? 1 : 0;
k_form.k_setData(k_data, true);
}
else {
k_data = {
type: this.ScanRuleType.ScanRuleFileGroup
};
k_form.k_setData(k_data, true);
}
this.k_saveCallback = k_params.k_callback;
this.k_parentWidget = k_params.k_parentWidget;
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); if (undefined === k_selectedFileGroup) {
k_selectedFileGroup = k_predefinedTypes[k_CONSTANTS.k_FILE_TYPE_FIRST_GROUP];
}
k_form.k_predefinedDescription.k_setValue(k_selectedFileGroup.pattern);
k_listLoader = new kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_fileTypeList',
k_select: k_form.k_fileGroup,
k_form: k_form,
k_addNoneOption: false,
k_value: {
k_id: k_selectedFileGroup.name
}
});
k_listLoader.k_sendRequest();
};

k_kerioWidget.k_saveData = function() {
var
k_form = this.k_form,
k_data = k_form.k_getData(true);
k_data.scan = (1 === k_data.scan); switch (k_data.type) {
case this.ScanRuleType.ScanRuleUrl:
k_data.pattern = k_data.k_urlContent;
break;
case this.ScanRuleType.ScanRuleMime:
k_data.pattern = k_data.k_mimeContent;
break;
case this.ScanRuleType.ScanRuleFilename:
k_data.pattern = k_data.k_fileContent;
break;
case this.ScanRuleType.ScanRuleFileGroup:
k_data.pattern = k_data.k_fileGroup;
break;
}
delete k_data.k_urlContent;
delete k_data.k_mimeContent;
delete k_data.k_fileContent;
k_data.pattern = kerio.waw.shared.k_methods.k_correctUri(k_data.pattern);
if (this.k_saveCallback(k_data, this.k_editedRow)) {
this.k_hide();
}
else {
this.k_hideMask();
}
};k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
}; } }; 