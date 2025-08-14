
kerio.waw.ui.contentFilterUrlEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_URL_TYPES = k_WAW_CONSTANTS.ContentEntityUrlType,
k_methods = k_shared.k_methods,
k_isAuditor = k_methods.k_isAuditor(),
k_buildTooltip = k_lib.k_buildTooltip,
k_hostnameTooltip = k_tr('The domain name without wildcards', 'contentFilterUrlEditor'),
k_formCfg,
k_form,
k_dialogCfg,
k_dialog;
k_formCfg = {
k_isReadOnly: k_isAuditor,
k_labelWidth: 50,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Destination', 'contentFilterUrlEditor'),
k_items: [
{
k_id: 'value',
k_caption: k_tr('Site:', 'httpRuleEditor'),
k_width: '100%',
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_hasNoSpaces'
}
},
{
k_type: 'k_radio',
k_groupId: 'urlType',
k_option: k_tr('HTTP URL', 'contentFilterUrlEditor'),
k_value: k_URL_TYPES.ContentEntityUrlWildcard,
k_caption: ' ',
k_isChecked: true,
k_onChange: function(k_form, k_radio, k_value) {
var
k_types = k_form.k_URL_TYPES;
switch(k_value) {
case k_types.ContentEntityUrlWildcard:
case k_types.ContentEntityUrlRegex:
k_form.k_httpsCheckbox.k_setDisabled(false);
break;
case k_types.ContentEntityUrlHostname:
k_form.k_httpsCheckbox.k_setDisabled(true);
k_form.k_httpsCheckbox.k_setChecked(true);
break;
}
}
},
{
k_type: 'k_radio',
k_groupId: 'urlType',
k_option: k_tr('HTTP URL by regular expression', 'contentFilterUrlEditor'),
k_value: k_URL_TYPES.ContentEntityUrlRegex,
k_caption: ' '
},
{
k_type: 'k_radio',
k_groupId: 'urlType',
k_option: ['<span ',k_buildTooltip(k_hostnameTooltip),'>',
k_tr('Hostname across all protocols', 'contentFilterUrlEditor'),
' <span class="tooltip" style="vertical-align: bottom;" ', k_buildTooltip(k_hostnameTooltip),'>&nbsp;&nbsp;&nbsp;&nbsp;</span></span>&nbsp;'
].join(''),
k_value: k_URL_TYPES.ContentEntityUrlHostname
,							k_caption: ' '
},
k_methods.k_getDisplayFieldWithKbLink(1512,
k_tr('Learn more about wildcards and regular expressions in URL', 'httpRuleEditor'),
{
k_style: 'text-align: right;'
}
)
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Protocol', 'httpRuleEditor'),
k_items: [
{
k_type: 'k_checkbox',
k_id: 'matchSecured',
k_isChecked: true,
k_isLabelHidden: true,
k_option: k_tr('Also apply to secured connections (HTTPS)', 'httpRuleEditor')
},
k_methods.k_getDisplayFieldWithKbLink(1380, k_tr('Learn about HTTPS filtering specifics', 'httpRuleEditor'),
{
k_style: 'text-align: right;'
}
)
]
}
]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_urlForm', k_formCfg);
k_dialogCfg = {
k_width: 620,
k_height: 340,
k_title: k_tr('Content Rule - URL', 'contentFilterUrlEditor'),
k_content: k_form,
k_defaultItem: 'value',

k_onOkClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData.call(k_toolbar.k_dialog);
}
};
k_dialogCfg = k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_isEditMode: false,
k_relatedGrid: null
});
k_form.k_addReferences({
k_URL_TYPES: k_URL_TYPES,
k_url: k_form.k_getItem('value'),
k_dialog: k_dialog,
k_httpsCheckbox: k_form.k_getItem('matchSecured')
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_applyParams: function(k_params){
var
k_data = k_params.k_data;
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_isEditMode = undefined !== k_data;
k_data = kerio.lib.k_cloneObject(k_data);
this.k_form.k_setData(k_data, true);
},

k_sendData: function() {
var
k_form = this.k_form,
k_formData = k_form.k_getData(true),
k_url = kerio.waw.shared.k_methods.k_correctUri(k_formData.value),
k_urlCondition,
k_urlType = k_formData.urlType,
k_matchSecured = k_formData.matchSecured;
if (k_form.k_URL_TYPES.ContentEntityUrlHostname === k_urlType) {
k_matchSecured = true;
}
k_urlCondition = {
type: kerio.waw.shared.k_CONSTANTS.ContentConditionEntityType.ContentConditionEntityUrl,
value: k_url,
urlType: k_urlType,
matchSecured: k_matchSecured
};
this.k_relatedGrid.k_updateItemCallback(k_urlCondition, this.k_isEditMode);
this.k_hide();
},

k_resetOnClose: function() {
this.k_form.k_reset();
}
});
} }; 