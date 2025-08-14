
kerio.waw.ui.webFilterCategoryDialog = {

k_init: function(k_objectName) {
var
k_shared = kerio.waw.shared,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_localNamespace;
k_localNamespace = k_objectName + '_';
k_formCfg = {
k_isReadOnly: k_isAuditor,
k_class: 'k_webFilterCategoryDialog',
k_labelWidth: 110,
k_items: [
{
k_id: 'k_urlDisplay',
k_caption: k_tr('Tested URL:', 'webFilterCategory'),
k_style: kerio.lib.k_isMSIE ? 'padding-top: 1px' : undefined, k_value: '',
k_isReadOnly: true
},
{
k_type: 'k_display',
k_id: 'k_urlCategories',
k_caption: k_tr('Categories: ', 'webFilterCategory'),
k_isSecure: true,
k_value: ''
},
{
k_type: 'k_display',
k_id: 'k_suggestLink',
k_isLabelHidden: true,
k_value: '<a id="k_suggestLinkAnchor">' + k_tr('Not happy with this categorization?', 'webFilterCategory') + '</a>',
k_isSecure: true,
k_onLinkClick: function(k_form, k_item) {
k_form.k_suggestionContainer.k_setVisible(true);
k_item.k_setVisible(false);
k_form.k_parentWidget.k_setChanged(true);
}
},
{
k_type: 'k_container',
k_id: 'k_suggestionContainer',
k_isVisible: false,
k_items: [
{
k_type: 'k_row',
k_isLabelHidden: true,
k_style: 'padding-bottom: 4px;',
k_items: [
{
k_type: 'k_display',
k_value: k_tr('Report incorrect categorization to Kerio Technologies:', 'webFilterCategory')
}
]
},
{
k_type: 'k_select',
k_id: 'k_categorySelect',
k_caption: k_tr('Your suggestion:', 'webFilterCategory'),
k_localData: k_shared.k_CONSTANTS.k_WEB_FILTER_CATEGORIES,
k_fieldDisplay: 'group',
k_fieldValue: 'id'
},
{
k_type: 'k_row',
k_id: 'k_submitButtons',
k_style: 'k_padding-top: 8px;',
k_items: [
{
k_type: 'k_formButton',
k_id: 'k_btnSubmit',
k_caption: k_tr('Submit', 'webFilterCategory'),

k_onClick: function(k_form) {
var
k_request = k_form.k_suggestedRequest,
k_categoryId = k_form.k_categorySelect.k_getValue();
k_request.k_jsonRpc.params.url = k_form.k_url;
k_request.k_jsonRpc.params.categoryIds = (k_categoryId && '' !== k_categoryId) ? [k_categoryId] : [];
k_request.k_callback = k_form.k_dialog.k_submitCallback;
k_form.k_dialog.k_showMask( kerio.lib.k_tr('Sending…', 'webFilterCategory'), 1);
kerio.lib.k_ajax.k_request(k_request);
}
}, {
k_type: 'k_formButton',
k_id: 'k_btnSubmitAndWhitelist',
k_caption: k_tr('Submit and add to whitelist', 'webFilterCategory'),

k_onClick: function(k_form) {
var
k_suggestedRequest = k_form.k_suggestedRequest,
k_categoryId = k_form.k_categorySelect.k_getValue(),
k_url;
k_suggestedRequest.k_jsonRpc.params.url = k_form.k_url;
k_suggestedRequest.k_jsonRpc.params.categoryIds = (k_categoryId && '' !== k_categoryId) ? [k_categoryId] : [];
k_url = k_form.k_url.trim().toLowerCase();
if (0 === k_url.indexOf(k_form.k_HTTP_PROTOCOL)) {
k_url = k_form.k_url.substring(k_form.k_HTTP_PROTOCOL.length);
}
else if (0 === k_url.indexOf(k_form.k_HTTPS_PROTOCOL)) {
k_url = k_form.k_url.substring(k_form.k_HTTPS_PROTOCOL.length);
}
k_form.k_httpPolicyData.whiteList.push({description: '', url: k_url});
kerio.waw.requests.k_sendBatch(
[
{
k_jsonRpc: k_suggestedRequest.k_jsonRpc
},
{
k_jsonRpc: {
method: 'ContentFilter.setUrlFilterConfig',
params: {
config: k_form.k_httpPolicyData
}
}
}
],
{
k_scope: k_suggestedRequest.k_scope,
k_callback: k_form.k_dialog.k_btnSubmitAndWhitelistCallback,
k_mask: true
}
); }
} ] }
]
},
{
k_type: 'k_display',
k_id: 'k_categorizationReply',
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_isSecure: true,
k_isHidden: true,
k_value: ''
},
{
k_type: 'k_display',
k_id: 'k_categorizationErrorReply',
k_icon: 'img/warning.png?v=8629',
k_className: 'warningImgIcon',
k_isSecure: true,
k_isHidden: true,
k_value: k_tr('The Kerio Technologies server is not reachable. Check your Internet conectivity and try it again.', 'webFilterCategory')
}
]
};k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 500,
k_height: 290,
k_title: k_tr('URL Categorization', 'webFilterCategory'),
k_content: k_form,
k_defaultItem: null,
k_hasHelpIcon: false,
k_buttons: [
{
k_isCancel: true,
k_isDefault: true,
k_id: 'k_btnCancel',
k_caption: k_tr('Close', 'common')
}
]
};k_dialog = new k_lib.K_Dialog(this.k_publicName, k_dialogCfg);
k_form.k_addReferences(
{
k_dialog: k_dialog,
k_urlDisplay: k_form.k_getItem('k_urlDisplay'),
k_categorySelect: k_form.k_getItem('k_categorySelect'),
k_urlCategories: k_form.k_getItem('k_urlCategories'),
k_categorizationReply: k_form.k_getItem('k_categorizationReply'),
k_categorizationErrorReply: k_form.k_getItem('k_categorizationErrorReply'),
k_suggestionContainer: k_form.k_getItem('k_suggestionContainer'),
k_submitButtons: k_form.k_getItem('k_submitButtons'),
k_btnSubmitAndWhitelist: k_form.k_getItem('k_btnSubmitAndWhitelist'),
k_noCategoriesText: k_tr('No category found', 'webFilterCategory'),
k_suggestionReply: k_tr('Your suggestion has been sent. Thank you.', 'webFilterCategory'),
k_suggestionErrorReply: k_tr('Kerio Control cannot send your suggestion. Check your Internet connection and try it again.', 'webFilterCategory'),
k_suggestionAndWhitelistReply: k_tr('The URL has been added to the whitelist and your suggestion has been sent. Thank you.', 'webFilterCategory'),
k_suggestionErrorAndWhitelistReply: k_tr('The URL has been added to the whitelist but Kerio Control cannot send your suggestion. Check your Internet connection and try it again.', 'webFilterCategory'),
k_HTTP_PROTOCOL: 'http://', k_HTTPS_PROTOCOL: 'https://',
k_httpPolicyData: {},
k_suggestedCategoriesIds: [],
k_url: '',
k_suggestedRequest: {
k_jsonRpc: {
method: 'ContentFilter.reportMiscategorizedUrl',
params: {
'url': null,
'categoryIds': null
}
},
k_callback:	null, k_scope: k_form
}
}
);
k_dialog.k_addReferences(
{
k_form: k_form
}
);this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params){
var
k_methods = kerio.waw.shared.k_methods,
k_form = this.k_form,
k_data = k_params.k_data,
k_url = k_data.k_url,
k_categoryIds = k_data.k_categoryIds,
k_urlCategoriesText = [],
k_category,
k_webFilterCategory,
k_i, k_cnt;
this.k_parentWidget = k_params.k_parentWidget;
k_form.k_urlDisplay.k_setValue(k_url, true);
k_form.k_url = k_url;
k_form.k_httpPolicyData = k_data.k_httpPolicyData;
k_cnt = k_categoryIds.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_category = k_categoryIds[k_i];
k_webFilterCategory = k_methods.k_getWebFilterCategoryById(k_category);
if (k_webFilterCategory) { k_urlCategoriesText.push('<b>' + k_webFilterCategory.group + '</b>');
}
}
k_url = k_url.trim().toLowerCase();
if (-1 === k_url.indexOf('://') || 0 === k_url.indexOf(k_form.k_HTTP_PROTOCOL) || 0 === k_url.indexOf(k_form.k_HTTPS_PROTOCOL)) {
k_form.k_btnSubmitAndWhitelist.k_setDisabled(false);
}
else {
k_form.k_btnSubmitAndWhitelist.k_setDisabled(true);
}
if (0 === k_urlCategoriesText.length) {
k_form.k_urlCategories.k_setValue(k_form.k_noCategoriesText, true);
}
else {
k_form.k_urlCategories.k_setValue(k_urlCategoriesText.join('<br />'), true);
}
};

k_kerioWidget.k_sortCategories = function(k_firstCategory, k_secondCategory) {
if (k_firstCategory.group < k_secondCategory.group) {
return -1;
}
if (k_firstCategory.group > k_secondCategory.group) {
return 1;
}
return 0;
};

k_kerioWidget.k_suggestCategoriesCallback = function(k_categoriesIds, k_categoriesTexts) {
var
k_suggestedCategories = this.k_suggestedCategories;
this.k_suggestedCategoriesIds = k_categoriesIds;
if (0 < k_categoriesIds.length) {
k_suggestedCategories.k_setValue('<b>' + k_categoriesTexts.join('</b><br /><b>') + '</b>');
k_suggestedCategories.k_setVisible(true);
this.k_dialog.k_toolbar.k_items.k_btnOK.k_setVisible(true);
}
else if (k_suggestedCategories.k_isVisible()) {
this.k_categorizationErrorReply.k_setVisible(false);
}
};

k_kerioWidget.k_submitCallback = function(k_response) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
this.k_categorySelect.k_setDisabled(true);
this.k_submitButtons.k_setVisible(false);
if (k_response.k_isOk) {
this.k_categorizationReply.k_setValue(this.k_suggestionReply);
this.k_categorizationReply.k_setVisible(true);
}
else {
this.k_categorizationReply.k_setValue(this.k_suggestionErrorReply);
this.k_categorizationReply.k_setVisible(true);
}
};

k_kerioWidget.k_btnSubmitAndWhitelistCallback = function(k_responses) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
var
k_responseIsOk = true,
k_UNABLE_TO_REPORT_CODE = 1000,
k_isNotKerioServerReachable = false,
k_cnt = k_responses.length,
k_i, k_item;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_responses[k_i];
if (k_UNABLE_TO_REPORT_CODE === k_item.code) {
k_isNotKerioServerReachable = true;
} else if (k_item.code) {
k_responseIsOk = false;
}
}
this.k_dialog.k_parentWidget.k_getMainWidget().k_loadData();
if (k_responseIsOk || k_isNotKerioServerReachable) {
if (!k_isNotKerioServerReachable) {
this.k_categorizationReply.k_setValue(this.k_suggestionAndWhitelistReply);
}
else {
this.k_categorizationReply.k_setValue(this.k_suggestionErrorAndWhitelistReply);
}
this.k_categorySelect.k_setDisabled(true);
this.k_submitButtons.k_setVisible(false);
this.k_categorizationReply.k_setVisible(true);
}
};

k_kerioWidget.k_resetOnClose = function() {
var
k_form = this.k_form;
k_form.k_setDisabled(['k_categorySelect'], false);
k_form.k_setVisible(['k_suggestLink', 'k_submitButtons'], true);
k_form.k_setVisible(['k_categorizationReply', 'k_suggestionContainer'], false);
k_form.k_reset();
};
}
}; 