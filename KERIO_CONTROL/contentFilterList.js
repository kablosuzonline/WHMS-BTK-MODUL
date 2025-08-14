
kerio.waw.ui.contentFilterList = {

k_init: function(k_objectName) {
var
k_shared = kerio.waw.shared,
k_WAW_METHODS = k_shared.k_methods,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_localNamespace = k_objectName + '_',
k_initTextForTestKwf = 'http://',
k_contentRules,k_contentRulesCfg,
k_contentRulesForm,
k_forbiddenWordsGrid, k_forbiddenWordsGridCfg,
k_forbiddenWords, k_forbiddenWordsCfg,
k_whiteListGrid, k_whiteListGridCfg,
k_webFilter, k_webFilterCfg,
k_tabPage, k_tabPageCfg,
k_toolbar,k_toolbarCfg,
k_p2pForm, k_p2pFormCfg,
k_servicesGridCfg, k_servicesGrid,
k_httpsForm, k_httpsFormCfg,
k_onChangeHandler,
k_batchOptions,
k_batchChangeHandler,
k_contentFilterObject,
k_forbiddenWordsObject,
k_renderAction,
k_lineRenderAction,
k_renderDetectedContent,
k_lineRenderDetectedContent,
k_renderContentConditionList;

k_onChangeHandler = function(k_batchId) {
if (k_batchId && this.k_batchOptions[k_batchId]) {
this.k_batchOptions[k_batchId].k_isContentChanged = true;
kerio.adm.k_framework.k_enableApplyReset();
}
};

k_lineRenderAction = function(k_value, k_data, k_rowIndex, k_colIndex, k_grid, k_itemIndex) {
var
k_ACTION_RENDERER_INDEXES = k_grid.k_ACTION_RENDERER,
RuleAction = kerio.waw.shared.k_CONSTANTS.RuleAction,
k_translations = k_grid.k_translations,
k_displayedValue = k_translations.k_noAction,
k_dataTooltip = [],
k_isAllowAction = RuleAction.Allow === k_data.action,
k_isDenyAction = RuleAction.Deny === k_data.action,
k_isDropAction = RuleAction.Drop === k_data.action,
k_iconCls;
switch (k_value.k_type) {
case k_ACTION_RENDERER_INDEXES.k_ACTION:
if (k_isAllowAction) {
k_displayedValue = k_translations.k_allow;
k_iconCls = 'allow';
}
else if (k_isDenyAction) {
k_displayedValue = k_translations.k_deny;
k_iconCls = 'deny';
}
else if (k_isDropAction) {
k_displayedValue = k_translations.k_drop;
k_iconCls = 'drop';
}
break;
case k_ACTION_RENDERER_INDEXES.k_ADDITIONAL_SETTIGNS:
k_displayedValue = k_translations.k_additionalSettings;
k_iconCls = 'additional';
if (k_data.logEnabled) {
k_dataTooltip.push(k_translations.k_logging, '<br />');
}
if (k_isAllowAction && k_data.skipAvScan) {
k_dataTooltip.push(k_translations.k_skipAntivirus, '<br />');
}
if (k_isAllowAction && k_data.skipKeywords) {
k_dataTooltip.push(k_translations.k_skipKeywords, '<br />');
}
if (k_isAllowAction && k_data.skipAuthentication) {
k_dataTooltip.push(k_translations.k_skipAuthentication, '<br />');
}
if (k_isDenyAction && k_data.denialCondition.redirectUrl.enabled && k_data.denialCondition.redirectUrl.value) {
k_dataTooltip.push(k_translations.k_allowRedirect, '<br />');
}
if (k_isDenyAction && k_data.denialCondition.denialText) {
k_dataTooltip.push(k_translations.k_denialText, '<br />');
}
if (k_isDenyAction && k_data.denialCondition.sendEmail) {
k_dataTooltip.push(k_translations.k_sendEmailText, '<br />');
}
break;
}
k_dataTooltip = k_dataTooltip.join('');
if (undefined !== k_iconCls) {
k_iconCls = 'gridListIcon ruleAction ' + k_iconCls;
}
return {
k_isSecure: true,
k_data: k_displayedValue,
k_dataTooltip: k_dataTooltip,
k_iconTooltip: k_dataTooltip,
k_iconCls: k_iconCls
};
};

k_renderAction = function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
return {
k_isCollapsible: false,
k_lineRenderer: k_grid.k_lineRenderAction
};
};

k_lineRenderDetectedContent = function(k_value, k_data, k_rowIndex, k_colIndex, k_grid, k_itemIndex) {
var
k_displayLimit = kerio.waw.shared.k_CONSTANTS.k_LIMIT_MULTILINE_LIST_RENDERER - 1, k_columnId = k_grid.k_getColumnId(k_colIndex),
k_isSourceColumn = 'sourceConditionList' === k_columnId,
k_itemData = k_isSourceColumn ? k_data.sourceConditionList : k_data.contentConditionList,
k_cntHiddenItems = k_itemData.length - k_displayLimit,
k_isLimited = (k_displayLimit === k_itemIndex && 1 < k_cntHiddenItems), k_itemRenderer = k_isSourceColumn ? k_grid.k_renderSourceEntityItem : k_grid.k_renderContentEntityItem,
k_rowData,
k_iconCls,
k_tooltip;
if (k_isLimited) {
k_rowData = kerio.lib.k_tr('…and %1 more', 'userList', {k_args:[k_cntHiddenItems]});
k_iconCls = '';
k_tooltip = kerio.lib.k_htmlEncode(
kerio.waw.shared.k_methods.k_joinReferenceList(
{
k_referenceList: k_itemData,
k_start: k_displayLimit,
k_method: k_itemRenderer,
k_grid: k_grid,
k_stringProperty: 'k_data' }
)
);
return {
k_isSecure: k_isLimited,
k_data: k_rowData,
k_iconCls: k_iconCls,
k_dataTooltip: k_tooltip,
k_iconTooltip: k_tooltip
};
}
return k_itemRenderer(k_itemData[k_itemIndex], k_grid, k_itemIndex);
};

k_renderContentConditionList = function(k_data) {
var
k_items = k_data.contentConditionList,
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
ContentConditionEntityType = k_CONSTANTS.ContentConditionEntityType,
k_CONTENT_FILTER_APPLICATIONS = k_CONSTANTS.k_CONTENT_FILTER_APPLICATIONS,
k_get = k_shared.k_DEFINITIONS.k_get,
k_cloneObject = kerio.lib.k_cloneObject,
k_newItems = [],
k_nonApplicationItems = [],
k_cnt = k_items.length,
k_isWebFilterOnly = 0 < k_cnt,
k_i,
k_indexApp, k_cntApplication,
k_application,
k_applicationList;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (ContentConditionEntityType.ContentConditionEntityApplication !== k_items[k_i].type) {
k_nonApplicationItems.push(k_items[k_i]);
k_isWebFilterOnly = false;
}
else {
k_applicationList = k_items[k_i].applications;
for (k_indexApp = 0, k_cntApplication = k_applicationList.length; k_indexApp < k_cntApplication; k_indexApp++) {
k_application = k_cloneObject(k_CONTENT_FILTER_APPLICATIONS[k_applicationList[k_indexApp]]);
if (k_application) {
k_application.type = ContentConditionEntityType.ContentConditionEntityApplication;
k_application = k_get('k_contentConditionEntity', k_application);
k_isWebFilterOnly = k_isWebFilterOnly && k_application.k_isWebFilterOnly;
k_application.group = k_application.name;
k_application.applications = [];
k_application.applications.push(k_application.id);
k_newItems.push(k_application);
}
}
}
}
if (0 < k_newItems.length) {
k_newItems = kerio.waw.shared.k_methods.k_filterApplications(k_newItems);
}
k_data.k_isWebFilterOnly = k_isWebFilterOnly;
k_data.contentConditionList = k_newItems.concat(k_nonApplicationItems);
};
k_renderDetectedContent = function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
var
k_INVALID_RULE_CONDITION = kerio.waw.shared.k_CONSTANTS.RuleConditionType.RuleInvalidCondition,
k_columnId = k_grid.k_getColumnId(k_columnIndex),
k_isSourceColumn = 'sourceConditionList' === k_columnId,
k_isNoEntity = 0 === k_value.length,
k_isCollapsed = false,
k_collapsedValue = '';
if (k_isSourceColumn && k_isNoEntity && k_INVALID_RULE_CONDITION === k_data.data.sourceCondition.type) {
k_data.data.sourceConditionList.push({k_isNothing: true});
}
else if (k_isNoEntity) {
k_collapsedValue = k_grid.k_translations.k_any;
k_isCollapsed = true;
}
return {
k_isCollapsible: k_isCollapsed,
k_collapsedValue: k_collapsedValue,
k_isSecure: true,
k_maxItems: kerio.waw.shared.k_CONSTANTS.k_LIMIT_MULTILINE_LIST_RENDERER,
k_lineRenderer: k_grid.k_lineRenderDetectedContent
};
};
k_contentRulesCfg = {
k_isTabPage: true,
k_isAuditor: k_isAuditor,
k_objectName: 'k_contentRules',
k_manager: 'ContentFilter',
k_newItemDefinition: 'k_predefinedContentRule',
k_loadTimeRangeGroups: true,
k_loadAddressGroups: true,
k_defaultRuleDefinition: {
description: k_tr('Any other traffic is allowed (content is scanned for viruses)', 'ruleList')
},
k_onDropCustom: function() {
this._k_onChangeHandler();
},
k_isQueryValueSent: false,

k_customInactiveRuleCheck: function() {
var
k_unknownUserCheck,
k_rowDataList;
k_rowDataList = this.k_findRowBy(kerio.waw.shared.k_methods.k_reportInactiveWebFilter);
if (k_rowDataList) {
if (!this.k_isWebFilterLicensed) {
return 'k_WebFilterNotLicensed';
}
else if (!this.k_isWebFilterOn && !this.k_isApplicationAwarenessOn) {
return 'k_applicationsAndWebFilterDisabled';
}
else if (!this.k_isWebFilterOn) {
return 'k_webFilterDisabled';
}
else if (!this.k_isApplicationAwarenessOn) {
return 'k_applicationAwarenessDisabled';
}
return 'k_webFilterDisabled';
}
k_unknownUserCheck = kerio.waw.shared.k_methods.k_reportUnknownUsers.apply(this, arguments);
if (k_unknownUserCheck) {
return k_unknownUserCheck;
}
return false;
},
k_customStatusBarCfg: {
k_webFilterDisabled: {
k_text: k_tr('Some rules are inactive (Kerio Control Web Filter is disabled).', 'contentFilter'),
k_iconCls: 'ruleInactive'
},
k_applicationAwarenessDisabled: {
k_text: k_tr('Some rules are inactive (application awareness is disabled).', 'contentFilter'),
k_iconCls: 'ruleInactive'
},
k_applicationsAndWebFilterDisabled: {
k_text: k_tr('Some rules are inactive (Kerio Control Web Filter and application awareness are disabled).', 'contentFilter'),
k_iconCls: 'ruleInactive'
},
k_WebFilterNotLicensed: {
k_text: k_tr('Some rules are inactive (Kerio Control Web Filter is not licensed).', 'contentFilter'),
k_iconCls: 'ruleInactive'
}
},

k_onChangeHandler: function(k_grid) {
if (!k_grid) {
k_grid = this;
}
k_grid.k_onChangeHandler(k_grid.k_batchId);
},

k_isInactiveRule: function(k_data) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_SOURCE_TYPES = k_CONSTANTS.SourceConditonEntityType,
k_USER_NOBODY = k_CONSTANTS.UserConditionType.Nobody,
ContentConditionEntityType = k_CONSTANTS.ContentConditionEntityType,
k_CONTENT_URL_GROUP = ContentConditionEntityType.ContentConditionEntityUrlGroup,
k_APPLICATION_CONDITION = ContentConditionEntityType.ContentConditionEntityApplication,
k_WEB_FILTER_TYPE = k_CONSTANTS.ApplicationType.ApplicationWebFilterCategory,
k_conditionList,
k_isInvalid,
k_item,
k_cnt, k_i;
if (kerio.waw.shared.k_methods.k_reportInactiveWebFilter.call(this, k_data)) {
return true;
}
if (k_data.sourceConditionList) {
k_conditionList = k_data.sourceConditionList;
k_cnt = k_conditionList.length;
k_isInvalid = true;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_conditionList[k_i];
switch(k_item.type) {
case k_SOURCE_TYPES.SourceConditonEntityAddressGroup:
if (k_item.ipAddressGroup && false === k_item.ipAddressGroup.invalid) {
k_isInvalid = false;
}
break;
case k_SOURCE_TYPES.SourceConditonEntityUsers:
if (k_item.userType && k_USER_NOBODY !== k_item.userType) {
k_isInvalid = false;
}
break;
case k_SOURCE_TYPES.SourceConditonEntityGuests:
k_isInvalid = false;
break;
}
if (false === k_isInvalid) {
break;
}
}
if (0 !== k_cnt && k_isInvalid) {
return true;
}
}
if (k_data.contentConditionList) {
k_conditionList = k_data.contentConditionList;
k_cnt = k_conditionList.length;
k_isInvalid = true;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_conditionList[k_i];
switch(k_item.type) {
case k_CONTENT_URL_GROUP:
if (k_item.urlGroup && false === k_item.urlGroup.invalid) {
k_isInvalid = false;
}
break;
case k_APPLICATION_CONDITION:
if (this.k_isWebFilterOn || (1 === k_item.types.length && k_WEB_FILTER_TYPE !== k_item.types[0]) || 2 === k_item.types.length) {
k_isInvalid = false;
}
break;
default:
k_isInvalid = false;
break;
}
if (false === k_isInvalid) {
break;
}
}
if (0 !== k_cnt && k_isInvalid) {
return true;
}
}
return false;
},
k_columns: {
prepareColumns: {
k_columnId: 'prepareColumns',
k_isHidden: true, k_isKeptHidden: true,

k_renderer: function(k_value, k_data) {
var
RuleAction = kerio.waw.shared.k_CONSTANTS.RuleAction,
k_action = k_data.action,
k_denialCondition = k_data.denialCondition,
k_actionRenderer = [];
k_actionRenderer.push({
k_type: this.k_ACTION_RENDERER.k_ACTION,
k_value: k_action
});
if (k_data.logEnabled
|| (RuleAction.Allow === k_action && (k_data.skipAvScan || k_data.skipKeywords || k_data.skipAuthentication))
|| (RuleAction.Deny === k_action && (k_denialCondition.denialText || k_denialCondition.sendEmail
|| (k_denialCondition.redirectUrl.enabled && k_denialCondition.redirectUrl.value)))
) {
k_actionRenderer.push({
k_type: this.k_ACTION_RENDERER.k_ADDITIONAL_SETTIGNS
});
}
k_data.actionRenderer = k_actionRenderer;
k_data.contentConditionList = k_data.contentCondition.entities;
k_data.sourceConditionList = k_data.sourceCondition.entities || [];
k_data.sourceConditionList.sort(this.k_compareSourceConditionList);
if (k_data.contentConditionList) {
this.k_renderContentConditionList(k_data);
}
return {k_data: ''};
}
},
contentCondition: {
k_columnId: 'contentCondition',
k_isHidden: true,
k_isKeptHidden: true
},
contentConditionList: {
k_columnId: 'contentConditionList',
k_caption: k_tr('Detected content', 'contentFilter'),
k_width: 200,
k_multilineRenderer: k_renderDetectedContent
},
sourceCondition: {
k_columnId: 'sourceCondition',
k_isHidden: true,
k_isKeptHidden: true
},
sourceConditionList: {
k_columnId: 'sourceConditionList',
k_caption: k_tr('Source', 'common'),
k_width: 200,
k_multilineRenderer: k_renderDetectedContent
},
actionRenderer: {
k_columnId: 'actionRenderer',
k_caption: k_tr('Action', 'common'),
k_width: 200,
k_multilineRenderer: k_renderAction
},
action: {
k_columnId: 'action',
k_isHidden: true,
k_isKeptHidden: true
}
},
k_columnOrder: [
'prepareColumns',
'name',
'contentCondition', 'contentConditionList',
'sourceCondition', 'sourceConditionList',
'actionRenderer', 'action',
'validTimeRange', 'validTimeRangeEditor',
'id', 'enabled', 'description', 'color'
],

k_onCellDblClick: function(k_grid, k_rowData, k_columnId) {
var
k_dialogName;
switch (k_columnId) {
case 'contentCondition':
case 'contentConditionList':
k_dialogName = 'contentFilterContentEditor';
break;
case 'action':
case 'actionRenderer':
k_dialogName = 'contentFilterActionEditor';
break;
case 'sourceCondition':
case 'sourceConditionList':
k_dialogName = 'contentFilterSourceEditor';
break;
default:
return;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: k_dialogName,
k_objectName: k_dialogName,
k_params: {
k_data: k_rowData,
k_relatedGrid: k_grid,
k_callback: function(k_data) {
var
k_newData = k_data.k_data;
if (k_newData.contentCondition) {
k_newData.contentConditionList = k_newData.contentCondition.entities;
if (k_newData.contentConditionList) {
this.k_renderContentConditionList(k_newData);
}
if (false === k_newData.inactive) {
k_newData.inactive = this._k_isInactiveRule(k_newData);
}
}
if (k_newData.sourceCondition) {
k_newData.sourceConditionList = k_newData.sourceCondition.entities;
}
this.k_updateRowStatus(k_newData);
this.k_updateRow(k_newData);
this.k_updateRowStatus(true);
this.k_updateRow(k_newData);
this._k_onChangeHandler();
return true;
}
}
});
},
k_bottomToolbarAdditionalGeneralItems: [
'->'
]
};
k_contentRules = new k_shared.k_widgets.K_RulesGrid(k_localNamespace + '_' + 'contentRulesGrid', k_contentRulesCfg);
k_contentRules.k_addReferences({
k_batchId: 'k_contentRules',
k_lineRenderAction: k_lineRenderAction,
k_lineRenderDetectedContent: k_lineRenderDetectedContent,
k_renderContentConditionList: k_renderContentConditionList,
k_ACTION_RENDERER: {
k_ACTION: 'k_action',
k_ADDITIONAL_SETTIGNS: 'k_additional_settings'
},
k_translations: {
k_any: k_tr('Any', 'common'),
k_allow: k_tr('Allow', 'common'),
k_deny: k_tr('Deny', 'common'),
k_drop: k_tr('Drop', 'common'),
k_nothing: k_tr('Nothing', 'common'),
k_noAction: k_tr('No action', 'trafficRuleList'),
k_invalidUserTooltip: k_tr('The user or group no longer exists', 'contentFilter'),
k_skipAntivirus: k_tr('Skip Antivirus scanning', 'contentFilter'),
k_logging: k_tr('Log the traffic', 'contentFilter'),
k_kerioWebFilter: k_tr('Kerio Control Web Filter', 'httpPolicy'),
k_skipKeywords: k_tr('Skip Forbidden words filtering', 'contentFilter'),
k_skipAuthentication: k_tr('Do not require authentication', 'contentFilter'),
k_allowRedirect: k_tr('Redirect to the specified URL', 'contentFilter'),
k_denialText: k_tr('The deny page has a custom deny text', 'contentFilter'),
k_sendEmailText: k_tr('Send notification to user', 'contentFilter'),
k_additionalSettings: k_tr('Additional settings', 'contentFilter'),
k_authenticatedUsers: k_tr('Authenticated users', 'trafficRuleList'),
k_webFilterDisabled: k_tr('Kerio Control Web Filter is disabled', 'contentEditor'),
k_applicationAwarenessDisabled: k_tr('Application awareness is disabled.', 'contentEditor'),
k_webFilterNotLicensed: k_tr('Kerio Control Web Filter is not licensed', 'contentEditor'),
k_bothDisabled: k_tr('Kerio Control Web Filter and application awareness are disabled.', 'contentEditor'),
k_guestInterfaces: k_tr('Guest Interfaces', 'trafficRuleList')
}
});
k_contentRulesForm = new k_lib.K_Form(k_localNamespace + 'contentRules', {
k_content: k_contentRules
});

k_forbiddenWordsGridCfg = {
k_loadMask: false,
k_autoExpandColumn: 'description',
k_isReadOnly: k_isAuditor,
k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'contentFilterForbiddenWordsEditor'
},
k_items: [
{
k_type: 'K_GRID_DEFAULT',

k_onRemove: function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget,
k_rows = k_grid.k_getRowsData(true),
k_ids = [],
k_cnt = (k_rows ? k_rows.length : 0),
k_i;
if (0 === k_cnt) {
return;
}
kerio.waw.shared.k_methods.k_maskMainScreen();
for (k_i = 0; k_i < k_cnt; k_i++) {
k_ids.push(k_rows[k_i].id);
}
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'ForbiddenWords.remove',
params: { 'ids': k_ids }
},
k_callback: k_grid.k_callbackRemoveForbiddenWords,
k_scope: k_grid
});
}
}
]
}
},
k_columns: {
k_sorting: {
k_columnId: 'keyword'
},
k_grouping: {
k_columnId: 'groupId', k_isMemberIndented: true,
k_startCollapsed: true
},
k_items: [
{	k_columnId: 'id' ,
k_isDataOnly  : true
},
{	k_columnId: 'keyword',
k_width: 200,
k_caption: k_tr('Item', 'common'),
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'enabled',

k_onChange: function(k_grid, k_value, k_data) {
kerio.waw.requests.k_sendBatch(
{
k_jsonRpc: {
method: 'ForbiddenWords.set',
params: {
ids: [k_data.id],
details: k_data
}
}
},
{
k_groupUserClicks: true, k_mask: false,           k_requestOwner: null     }
);
k_data.status = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusModified;
k_grid.k_updateRow(k_data);
k_grid.k_onChangeHandler(k_grid.k_batchId);
}
},

k_renderer: function(k_value, k_data) {
var
k_constStoreStatus = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_iconClass = 'forbiddenWordIcon';
switch (k_data.status) {
case k_constStoreStatus.kerio_web_StoreStatusNew:
k_iconClass += ' added';
break;
case k_constStoreStatus.kerio_web_StoreStatusModified:
k_iconClass += ' modified';
break;
}
return {
k_iconCls: k_iconClass,
k_data: k_value
};
}
},
{
k_columnId: 'groupId',
k_isKeptHidden: true,

k_groupRenderer: function(k_value, k_data) {
return {
k_data: k_data.groupName,
k_iconCls: 'forbiddenWordIcon k_groupIcon'
};
}
},
{	k_columnId: 'groupName',
k_isDataOnly  : true
},
{	k_columnId: 'weight',
k_caption: k_tr('Weight', 'httpForbiddenWords')
},
{	k_columnId: 'description',
k_caption: k_tr('Description', 'common')
},
{	k_columnId: 'enabled' ,
k_isDataOnly  : true
},
{	k_columnId: 'status' ,
k_isDataOnly  : true
}
]
},
k_remoteData: {
k_root: 'list',
k_isAutoLoaded: false,
k_jsonRpc: {
method: 'ForbiddenWords.get'
}
}
};
if (k_isAuditor) {
delete k_forbiddenWordsGridCfg.k_toolbars.k_bottom.k_dialogs;
k_forbiddenWordsGridCfg.k_toolbars.k_bottom.k_items.splice(0, 1);
k_forbiddenWordsGridCfg.k_toolbars.k_bottom.k_hasSharedMenu = false;
}
k_forbiddenWordsGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'forbiddenWordsGrid', k_forbiddenWordsGridCfg);
k_forbiddenWordsCfg = {
k_isReadOnly: k_isAuditor,

k_onChange: function () {
this.k_onChangeHandler(this.k_batchId);
this.k_grid.k_onChangeHandler(this.k_grid.k_batchId);
this.k_grid.k_onChangeHandler(this.k_safeSearchBatchId);
},
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('SafeSearch', 'common'),
k_height: 103,
k_labelWidth: kerio.lib.k_languageDependentValue({k_default: 290, pl: 320, ja: 320, ru: 340}),
k_items: [
{
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_isChecked: false,
k_id: 'safeSearchEnabled',
k_option: k_tr('Enforce SafeSearch', 'httpForbiddenWords'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled(['k_btnSafeSearchExceptions', 'k_safeSearchExceptions'], !k_isChecked);
}
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_template: [
k_tr('Supported search engines are: Google, YouTube, Bing and Yandex.', 'httpForbiddenWords'),
' <a id="learnMore">', kerio.lib.k_tr('Learn more…', 'common'), '</a>'
].join(''),
k_isSecure: true,
k_onLinkClick: function() {
kerio.waw.shared.k_methods.k_openSpecificKbArticle(1890);
}
},
{
k_type: 'k_columns',
k_isLabelHidden: true,
k_items: [
{
k_id: 'k_safeSearchExceptions',
k_isDisabled: true,
k_caption: k_tr('Do not enforce SafeSearch for the following users:', 'httpsFiltering'),
k_width: 270,
k_isReadOnly: true
},
{
k_type: 'k_formButton',
k_id: 'k_btnSafeSearchExceptions',
k_caption: k_tr('Select…', 'common'),
k_isDisabled: true,
k_onClick: function(k_form) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'membershipEditor',
k_objectName: 'k_httpsFilteringSafeSearchException',
k_params: {
k_data: k_form.k_dataStore.userExceptions,
k_relatedWidget: k_form,
k_callback: k_form.k_userExceptionsCallback
}
});
}
}
]
}
]
},
{	k_type: 'k_fieldset',
k_caption: k_tr('Forbidden Words', 'common'),
k_labelWidth: 250,
k_isResizeableVertically: true,
k_items: [
{
k_type: 'k_container',
k_height: 60,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'enabled',
k_option: k_tr('Enable Forbidden words filtering', 'httpForbiddenWords'),
k_isLabelHidden: true,
k_isChecked: true,

k_onChange: function(k_form, k_item, k_enable) {
var
k_disable = !k_enable;
k_form.k_setDisabled(['limit'], k_disable);
k_form.k_grid.k_setDisabled(k_disable);
}
},
{
k_id: 'limit',
k_type: 'k_number',
k_caption: k_tr('Deny pages if their weight reaches:', 'httpForbiddenWords'),
k_maxValue: 9999999,
k_minValue: 1,
k_maxLength: 7,
k_width: 55,
k_isReadOnly: k_isAuditor,
k_validator: {
k_allowBlank: false
}
}
]
},
{	k_type: 'k_container',
k_id: 'k_gridContainer',
k_minHeight: 160,
k_content: k_forbiddenWordsGrid
}
]
}
]
};
k_forbiddenWords = new k_lib.K_Form(k_localNamespace + 'forbiddenWords', k_forbiddenWordsCfg);
k_forbiddenWords.k_addReferences({
k_inputWeightLimit: k_forbiddenWords.k_getItem('limit'),
k_invalidMessage: k_tr('The forbidden weight limit is invalid.', 'httpForbiddenWords'),
k_invalidTitle: k_tr('Validation Warning', 'common'),
k_safeSearchExceptions: k_forbiddenWords.k_getItem('k_safeSearchExceptions'),
k_grid: k_forbiddenWordsGrid,
k_batchId: 'k_weightLimit',
k_safeSearchBatchId: 'k_safeSearch',
k_userExceptionsCallback: function(k_list) {
this.k_safeSearchExceptions.k_setValue(kerio.waw.shared.k_methods.k_parseUserReferenceListToNames(k_list) || kerio.lib.k_tr('None', 'common'));
this.k_dataStore.userExceptions = k_list;
}
});
k_forbiddenWordsGrid.k_addReferences({
k_batchId: 'k_forbiddenWords'
});

k_whiteListGridCfg = {
k_isReadOnly: k_isAuditor,
k_title: k_tr('URL whitelist:', 'securitySettingsList'),
k_className: 'gridWithSimpleTextAbove noLeftPadding',
k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'contentFilterWhiteListItemEditor'
},
k_items: [{
k_type: 'K_GRID_DEFAULT',

k_onRemove: function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget;
k_grid.k_removeSelectedRows();
k_grid.k_onChangeHandler(k_grid.k_batchId);
}
}]
}
},
k_columns: {
k_items: [
{
k_columnId: 'url',
k_caption: k_tr('URL', 'common'),
k_width: 220
},
{
k_columnId: 'description',
k_caption: k_tr('Description', 'common')
}
]
}
};
if (k_isAuditor) {
k_whiteListGridCfg.k_toolbars = {};
}
k_whiteListGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'whiteListGrid', k_whiteListGridCfg);
k_webFilterCfg = {
k_isReadOnly: k_isAuditor,

k_onChange: function () {
var
k_testedUrlValue = this.k_testedUrl.k_getValue();
if (k_testedUrlValue !== this.k_testedUrlChange) {
this.k_testedUrlChange = k_testedUrlValue;
return;
}
this.k_onChangeHandler(this.k_batchId);
},
k_items: [
{
k_type: 'k_display',
k_id: 'licensed',
k_icon: 'img/warning.png?v=8629',
k_className: 'warningImgIcon',
k_isHidden: true,
k_template: '{k_message} <a id="k_gotoRegister">{k_link}</a>',
k_value: {
k_message: k_tr('Kerio Control Web Filter is not activated, categorization is disabled.', 'httpWebFilter'),
k_link: ''
},
k_onLinkClick: k_shared.k_methods.k_gotoRegister
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Application Awareness', 'common'),
k_isLabelHidden: true,
k_height: 50,
k_items: [
{	k_type: 'k_checkbox',
k_id: 'appidEnabled',
k_option: k_tr('Enable application awareness', 'httpWebFilter')
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Kerio Control Web Filter', 'common'),
k_isResizeableVertically: true,
k_items: [
{
k_type: 'k_container',
k_height: 100,
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'enabled',
k_option: k_tr('Enable Kerio Control Web Filter', 'httpWebFilter'),

k_onChange: function(k_form, k_item, k_enable) {
var
k_disable = !k_enable;
k_form.k_setDisabled(['allowMiscategorizedReporting'], k_disable);
if (k_disable || (k_enable && k_form.k_isTestUrlEnabled)) {
k_form.k_setDisabled(['k_testUrlRow'], k_disable); }
k_form.k_whiteListGrid.k_setDisabled(k_disable);
}
},
{
k_type: 'k_checkbox',
k_id: 'allowMiscategorizedReporting',
k_isChecked: true,
k_option: k_tr('Allow authenticated users to report miscategorized URLs (on the Deny page)', 'httpWebFilter')
},
{
k_type: 'k_row',
k_id: 'k_testUrlRow',
k_style: 'padding-top: 5px',
k_items: [
{
k_id: 'url',
k_isLabelHidden: true,
k_value: k_initTextForTestKwf,
k_width: k_lib.k_isIPadCompatible ? undefined : 300,

k_onKeyDown: function(k_form, k_item, k_event) {
var
k_key = k_event.getKey();
if (k_key === kerio.lib.k_constants.k_EVENT.k_KEY_CODES.k_ENTER) {
k_event.preventDefault();
if (kerio.adm.k_framework.k_isScreenChanged()) {
kerio.waw.status.k_currentScreen.k_showContentChangedAlert();
}
else {
k_form.k_sendRequestForCategory(k_form);
}
}
}
},
{
k_type: 'k_formButton',
k_id: 'k_btnTest',
k_caption: k_tr('Test URL…', 'httpWebFilter'),

k_onClick: function(k_form) {
if (kerio.adm.k_framework.k_isScreenChanged()) {
kerio.waw.status.k_currentScreen.k_showContentChangedAlert();
}
else {
k_form.k_sendRequestForCategory(k_form);
}
}
}
]
},
{
k_type: 'k_display',
k_id: 'activated',
k_icon: 'img/warning.png?v=8629',
k_className: 'warningImgIcon',
k_isHidden: true,
k_template: '{k_message} <a id="k_gotoRegister">{k_link}</a>',
k_value: {
k_message: k_tr('Kerio Control Web Filter is not activated, categorization is disabled.', 'httpWebFilter'),
k_link: ''
},
k_onLinkClick: k_shared.k_methods.k_gotoRegister
}
]
},
{
k_type: 'k_container',
k_minHeight: 160,
k_id: 'k_gridContainer',
k_content: k_whiteListGrid
}
]
}
]
};
k_webFilter = new k_lib.K_Form(k_localNamespace + 'k_webFilter', k_webFilterCfg);
k_webFilter.k_addReferences({
k_whiteListGrid: k_whiteListGrid,
k_batchId: 'k_urlFilterConfig',
k_licensedMessageElement: k_webFilter.k_getItem('licensed'),
k_activatedMessageElement: k_webFilter.k_getItem('activated'),
k_testedUrl: k_webFilter.k_getItem('url'),
k_testedUrlChange: k_initTextForTestKwf,
k_initTextForTestKwf: k_initTextForTestKwf,
k_requestForTestUrl: {
k_jsonRpc: {
method: 'ContentFilter.getUrlCategories',
params: { 'url': null }
},
k_callback: undefined,
k_scope: k_webFilter
},
k_isTestUrlEnabled: false
});

k_servicesGridCfg = {
k_title: k_tr('In case that Kerio Control is unable to determine for certain whether a particular connection is P2P traffic or not, consider the following services as non-P2P.', 'p2pEliminatorEditor'),
k_className: 'noGridHeader serviceList gridWithSimpleTextAbove',
k_isStateful: false,
k_isReadOnly: k_isAuditor,
k_loadMask: false,
k_localData: [],
k_columns: {
k_items: [
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'name',
k_renderer: k_WAW_METHODS.k_renderers.k_renderServiceName
}
]
}
};
if (!k_isAuditor) {
k_servicesGridCfg.k_toolbars = {
k_bottom: {
k_items: [
{
k_id: 'k_btnAdd',
k_caption: k_tr('Add…', 'common'),
k_type: 'K_BTN_ADD',

k_onClick: function(k_toolbar) {
var
k_parentGrid = k_toolbar.k_relatedWidget,
k_params = {
k_onlyNew: false, k_parentGrid: k_parentGrid,
k_autoAdd: false, k_callback: k_parentGrid.k_addServices
};
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'selectItems',
k_objectName: 'selectServices',
k_params: k_params
});
}
},
{
k_id: 'k_btnRemove',
k_caption: k_tr('Remove', 'common'),
k_type: 'K_BTN_REMOVE',
k_onClick: function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget,
k_rows,
k_i, k_cnt;
if (0 < k_grid.k_selectionStatus.k_selectedRowsCount) {
k_rows = k_grid.k_selectionStatus.k_rows;
for (k_i = 0, k_cnt = k_rows.length; k_i < k_cnt; k_i++) {
k_grid._k_idsStore.remove(k_rows[k_i].k_data.id);
}
k_grid.k_removeSelectedRows();
k_grid.k_p2pEliminator.k_onChangeHandler(k_grid.k_p2pEliminator.k_batchId);
}
}
}
]
}
};
}
k_servicesGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'serviceGrid', k_servicesGridCfg);
k_p2pFormCfg = {
k_onChange: function () {
this.k_onChangeHandler(this.k_batchId);
},
k_useStructuredData: true,
k_isReadOnly: k_isAuditor,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Suspicious connections', 'p2pEliminatorEditor'),
k_height: 120,
k_labelWidth: 380, k_items: [
{
k_type: 'k_display',
k_value: k_tr('Peer-to-peer network activity will be suspected once a certain number of active suspicious connections is reached.', 'p2pEliminatorEditor')
},
{
k_id: 'ports',
k_caption: k_tr('Consider the following TCP/UDP port numbers as suspicious:', 'p2pEliminatorEditor'),
k_validator: {
k_functionName: 'k_isPortListWithRange',
k_allowBlank: true
}
},
{
k_type: 'k_number',
k_id: 'connectionCount',
k_caption: k_tr('Number of connections:', 'p2pEliminatorEditor'),
k_value: 5,
k_maxLength: 9,
k_minValue: 1,
k_width: 75,
k_validator: {
k_allowBlank: false
}
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Safe services', 'p2pEliminatorEditor'),
k_isResizeableVertically: true,
k_className: 'removeFieldsetMargin',
k_minHeight: 200,
k_items: [
{
k_type: 'k_container',
k_content: k_servicesGrid
}
]
}
]
}; k_p2pForm = new k_lib.K_Form(k_localNamespace + 'k_p2pEliminator', k_p2pFormCfg);
k_p2pForm.k_addReferences({
k_batchId: 'k_p2pEliminator',
k_params: {},
k_servicesGrid: k_servicesGrid
});
k_servicesGrid.k_addReferences({
_k_idsStore: [],
k_p2pEliminator: k_p2pForm,
k_getServices: function(){
return kerio.lib.k_cloneObject(this._k_idsStore);
},
k_addServices: function(k_newServices){
var
k_dataStore = this._k_idsStore,
k_addedServices = [],
k_item,
k_cnt, k_i;
k_cnt = k_newServices.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_newServices[k_i];
if (-1 === k_dataStore.indexOf(k_item)) {
k_addedServices.push(k_item);
}
}
if (0 < k_addedServices.length) {
this.k_loadServices(k_dataStore.concat(k_addedServices));
this.k_p2pEliminator.k_onChangeHandler(this.k_p2pEliminator.k_batchId);
}
},
k_loadServices: function(k_ids){
var
k_shared = kerio.waw.shared;
if (!k_ids || Array !== k_ids.constructor || k_ids.length === 0) {
return;
}
this._k_idsStore = kerio.lib.k_cloneObject(k_ids);
k_shared.k_methods.k_maskMainScreen(this, {k_isSaving: false});
k_shared.k_data.k_get('k_services');
k_shared.k_data.k_registerObserver('k_services', this.k_fillServices, this);
this.k_fillServices();
},
k_fillServices: function() {
var
k_shared = kerio.waw.shared,
k_ids = this._k_idsStore,
k_store = k_shared.k_data.k_get('k_services'),
k_services = k_store.k_getData(),
k_data = [],
k_service,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_services.length; k_i < k_cnt; k_i++) {
k_service = k_services[k_i];
if (-1 < k_ids.indexOf(k_service.id)) {
k_data.push(k_service);
}
}
this.k_setData(k_data);
k_shared.k_methods.k_unmaskMainScreen(this);
}
});
k_httpsFormCfg = {
k_onChange: function () {
this.k_parentWidget.k_onChangeHandler(this.k_batchId);
},
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('HTTPS decryption', 'httpsFiltering'),
k_labelWidth: 300,
k_items: [
{
k_isReadOnly: k_isAuditor,
k_type: 'k_checkbox',
k_id: 'enabled',
k_isLabelHidden: true,
k_option: k_tr('Decrypt and filter HTTPS traffic', 'httpsFiltering'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled(['k_httpsExceptions', 'disclaimer'], !k_isChecked);
}
},
{
k_isReadOnly: k_isAuditor,
k_type: 'k_checkbox',
k_id: 'disclaimer',
k_isChecked: true,
k_isLabelHidden: true,
k_isDisabled: true,
k_option: k_tr('Show Legal Notice to users', 'httpsFiltering')
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('%1Learn more%2 about HTTPS filtering and %3how to install certificate%4 on client OS or %5via Active Directory®%6.', 'httpsFiltering', {k_args: ['<a id="k_learnMore">','</a>','<a id="k_installCA">','</a>','<a id="k_activeDirectory">','</a>'], k_isSecure: true}),
k_isSecure: true,
k_onLinkClick: function(k_form, k_item, k_id) {
var k_starUrl = kerio.waw.shared.k_DEFINITIONS.k_CONTROL_URL.k_getWebifaceUrl();
switch(k_id) {
case 'k_learnMore':
kerio.waw.shared.k_methods.k_openSpecificKbArticle(1651);
break;
case 'k_installCA':
kerio.lib.k_openWindow(k_starUrl + 'nonauth/installCertificate.php#directLink', '_blank');
break;
case 'k_activeDirectory':
kerio.waw.shared.k_methods.k_openSpecificKbArticle(1649);
break;
}
}
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('HTTPS Filtering Exceptions', 'httpsFiltering'),
k_id: 'k_httpsExceptions',
k_isReadOnly: k_isAuditor,
k_isDisabled: true,
k_labelWidth: 270,
k_items: [
{
k_type: 'k_radio',
k_groupId: 'isExclusionMode',
k_option: k_tr('Exclude specified traffic from decryption', 'wlibCertificateImport'),
k_isLabelHidden: true,
k_value: true
},
{
k_type: 'k_radio',
k_groupId: 'isExclusionMode',
k_option: k_tr('Decrypt specified traffic only', 'wlibCertificateImport'),
k_isLabelHidden: true,
k_isChecked: true,
k_value: false
},
{
k_type: 'k_definitionSelect',
k_id: 'ipAddressGroup',
k_width: 270,
k_caption: k_tr('Traffic to/from IP addresses which belong to:', 'accountingList'),
k_definitionType: 'k_ipAddress',
k_showApplyReset: true,
k_allowFiltering: true,
k_pageSize: 500,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: [{
k_id: kerio.waw.shared.k_CONSTANTS.k_NONE,
k_name: k_tr('None', 'ipAddressGroupList')
}],
k_onApplyResetHandler: kerio.waw.shared.k_methods.k_definitionApplyResetHandler
},
{
k_type: 'k_columns',
k_isLabelHidden: true,
k_items: [
{
k_id: 'k_userExceptions',
k_caption: k_tr('Traffic from the following users:', 'httpsFiltering'),
k_width: 270,
k_isReadOnly: true
},
{
k_type: 'k_formButton',
k_id: 'k_btnUserExceptions',
k_caption: k_tr('Select…', 'common'),
k_onClick: function(k_form) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'membershipEditor',
k_objectName: 'k_httpsFilteringUsersException',
k_params: {
k_data: k_form.k_dataStore.userExceptions,
k_relatedWidget: k_form,
k_callback: k_form.k_userExceptionsCallback
}
});
}
}
]
}
]
}
]
};
k_httpsForm = new k_lib.K_Form(k_localNamespace + 'k_httpsForm', k_httpsFormCfg);
k_httpsForm.k_addReferences({
k_batchId: 'k_httpsFiltering',
k_params: {},
k_userExceptions: k_httpsForm.k_getItem('k_userExceptions'),
k_enableCheckbox: k_httpsForm.k_getItem('enabled'),

k_userExceptionsCallback: function(k_list) {
this.k_userExceptions.k_setValue(kerio.waw.shared.k_methods.k_parseUserReferenceListToNames(k_list) || kerio.lib.k_tr('None', 'common'));
this.k_dataStore.userExceptions = k_list;
}
});

k_tabPageCfg = {
k_className: 'mainList',
k_items: [
{
k_caption: k_tr('Content Rules', 'httpPolicy'),
k_content: k_contentRulesForm,
k_id: 'k_contentRules'
},
{
k_caption: k_tr('Applications and Web Categories', 'httpPolicy'),
k_content: k_webFilter,
k_id: 'k_webFilter'
},
{
k_caption: k_tr('HTTPS Filtering', 'httpPolicy'),
k_content: k_httpsForm,
k_id: 'k_httpsForm'
},
{
k_caption: k_tr('Safe Web', 'httpPolicy'),
k_content: k_forbiddenWords,
k_id: 'k_forbiddenWords'
},
{
k_caption: k_tr('Advanced Settings', 'contentFilter'),
k_content: k_p2pForm,
k_id: 'k_p2pEliminator'
}
],
k_onTabChange: function(k_tabPage, k_currentTabId) {
kerio.adm.k_framework._k_setHelpQuery(k_tabPage.k_id + '_' + k_currentTabId);
}
};
if (!k_isAuditor) {
k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function(){
this.k_relatedWidget.k_sendData();
return false;
},

k_onReset: function(){
this.k_relatedWidget.k_resetData();
return false;
}
};
k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
k_toolbar.k_items.k_btnApply._k_action._k_storedConfig.k_validate = false;
k_tabPageCfg.k_toolbars = {
k_bottom: k_toolbar
};
}
k_tabPage = new k_lib.K_TabPage(k_objectName, k_tabPageCfg);
k_contentFilterObject = 'ContentFilter';
k_forbiddenWordsObject = 'ForbiddenWords';

k_batchOptions = {

k_urlFilterConfig: {
k_isContentChanged: false,
k_root: 'config',
k_sendDataRequest: {
method: k_contentFilterObject + '.setUrlFilterConfig',
params: ''
},
k_getDataRequest: {
method: k_contentFilterObject + '.getUrlFilterConfig'
},

k_setTabData: function (k_data) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_webFilter = this.k_webFilter,
k_grid = k_webFilter.k_whiteListGrid,
k_isWebFilterActivated,
k_isWebFilterLicensed;
this.k_contentRules.k_isWebFilterOn = k_data.enabled && k_CONSTANTS.UrlFilterStatus.UrlFilterActivated === k_data.status;
this.k_contentRules.k_isApplicationAwarenessOn = k_data.appidEnabled;
k_isWebFilterLicensed = k_CONSTANTS.UrlFilterStatus.UrlFilterNotLicensed !== k_data.status;
this.k_contentRules.k_isWebFilterLicensed = k_isWebFilterLicensed;
k_webFilter.k_testedUrl.k_reset();
k_isWebFilterActivated = !(k_CONSTANTS.UrlFilterStatus.UrlFilterNotActivated === k_data.status || k_CONSTANTS.UrlFilterStatus.UrlFilterActivating === k_data.status);
k_webFilter.k_setReadOnly(['appidEnabled', 'enabled', 'allowMiscategorizedReporting', 'k_testUrlRow'], !k_isWebFilterLicensed || this.k_isAuditor);
if (k_isWebFilterLicensed && !this.k_isAuditor) {
k_webFilter.k_setReadOnly(['allowMiscategorizedReporting', 'k_testUrlRow'], !k_isWebFilterActivated);
}
k_webFilter.k_setDisabled(['k_testUrlRow'], !k_isWebFilterLicensed || !k_data.enabled);
k_webFilter.k_isTestUrlEnabled = k_isWebFilterLicensed && k_data.enabled;
k_grid.k_setDisabled(!k_isWebFilterLicensed || !k_data.enabled || !k_isWebFilterActivated);
k_webFilter.k_setData({
enabled: k_data.enabled,
allowMiscategorizedReporting: k_data.allowMiscategorizedReporting,
appidEnabled: k_data.appidEnabled
});
k_grid.k_setData(k_data.whiteList);
this.k_displayWebFilterMessage(k_data);
},

k_getTabData: function() {
var
k_webFilter = this.k_webFilter,
k_data;
k_data = k_webFilter.k_getData(true);
k_data.whiteList = k_webFilter.k_whiteListGrid.k_getData();
return {config: k_data};
}
},

k_contentRules: {
k_isContentChanged: true,
k_root: 'list',
k_sendDataRequest: {
method: k_contentFilterObject + '.set',
params: ''
},
k_getDataRequest: {
method: k_contentFilterObject + '.get'
},

k_setTabData: function (k_data) {
var
k_contentRulesGrid,
k_selectionStatus,
k_selectedIndexes,
k_cnt, k_i;
k_contentRulesGrid = this.k_contentRules;
k_contentRulesGrid.k_setData(k_data, {k_keepSelection: true});
k_contentRulesGrid.k_onLoad(this.k_contentRules);
if (this.k_selectionStatusBeforeApply) {
k_selectionStatus = this.k_selectionStatusBeforeApply;
k_selectedIndexes = [];
k_cnt = k_selectionStatus.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_selectedIndexes.push(k_selectionStatus[k_i].k_rowIndex);
}
k_contentRulesGrid.k_selectRows(k_selectedIndexes);
}
kerio.waw.shared.k_data.k_get('k_contentRules', true);
},

k_getTabData: function () {
var
k_INVALID_RULE_CONDITION = kerio.waw.shared.k_CONSTANTS.RuleConditionType.RuleInvalidCondition,
k_data,
k_contentRulesGrid,
k_rowData,
k_i, k_cnt,
k_entities,
k_entity,
k_iEntinty, k_cntEntinty;
this.k_stopUpload = false;
k_contentRulesGrid = this.k_contentRules;
if (k_contentRulesGrid.k_hasUnfinishedRules(k_contentRulesGrid.k_hasUndefinedActionProperty)) {
this.k_stopUpload = true;
return false;
}
k_data = k_contentRulesGrid.k_getData();
k_data = k_contentRulesGrid.k_removeDefaultRule(k_data);
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_rowData = k_data[k_i];
delete k_rowData.actionRenderer;
delete k_rowData.contentConditionList;
delete k_rowData.prepareColumns;
delete k_rowData.sourceConditionList;
delete k_rowData.validTimeRangeEditor;
delete k_rowData.k_isWebFilterOnly;
delete k_rowData.inactive;
if (k_INVALID_RULE_CONDITION === k_rowData.sourceCondition.type) {
k_rowData.sourceCondition.entities = [];
}
k_entities = k_rowData.contentCondition.entities;
for (k_iEntinty = 0, k_cntEntinty = k_entities.length; k_iEntinty < k_cntEntinty; k_iEntinty++) {
k_entity = k_entities[k_iEntinty];
delete k_entity.description;
delete k_entity.group;
delete k_entity.id;
delete k_entity.item;
delete k_entity.k_group;
delete k_entity.k_order;
delete k_entity.name;
delete k_entity.types;
delete k_entity.predefined;
}
}
this.k_selectionStatusBeforeApply = k_contentRulesGrid.k_selectionStatus.k_rows;
return {rules: k_data};
}
},

k_weightLimit: {
k_isContentChanged: false,
k_root: 'config',
k_sendDataRequest: {
method: k_forbiddenWordsObject + '.setConfig',
params: ''
},
k_getDataRequest: {
method: k_forbiddenWordsObject + '.getConfig'
},

k_setTabData: function (k_data) {
var
k_form = this.k_forbiddenWords;
k_form._k_originData = k_data;
k_form.k_setData(k_data);
},

k_getTabData: function () {
var
k_form = this.k_forbiddenWords,
k_data = k_form._k_originData;
if (!k_form.k_inputWeightLimit.k_isValid()) {
this.k_stopUpload = true;
this.k_setActiveTab('k_forbiddenWords');
k_form.k_inputWeightLimit.k_focus();
kerio.lib.k_alert(k_form.k_invalidTitle, k_form.k_invalidMessage);
return;
}
k_data = kerio.waw.shared.k_methods.k_mergeObjects(k_form.k_getData(), k_data);
delete k_data.safeSearchEnabled;
delete k_data.k_safeSearchExceptions;
return {config: k_data};
}
}, 
k_forbiddenWords: {
k_isContentChanged: false,
k_root: 'list',
k_sendDataRequest: {
method: k_forbiddenWordsObject + '.apply'
},
k_resetDataRequest: {
method: k_forbiddenWordsObject + '.reset'
},
k_getDataRequest: {
method: k_forbiddenWordsObject + '.get',
params: {'query': {'start': 0, 'limit': -1}}
},

k_setTabData: function (k_data) {
var
k_forbiddenWordsGrid = this.k_forbiddenWords.k_grid;
k_forbiddenWordsGrid.k_setData(k_data);
k_forbiddenWordsGrid.k_resortRows();k_forbiddenWordsGrid.k_toggleAllGroups(false);
}
},
k_safeSearch: {
k_isContentChanged: false,
k_root: 'config',
k_sendDataRequest: {
method: 'ContentFilter.setSafeSearchConfig'
},
k_getDataRequest: {
method: 'ContentFilter.getSafeSearchConfig'
},

k_setTabData: function (k_data) {
var
k_methods = kerio.waw.shared.k_methods,
k_form = this.k_forbiddenWords;
k_data.safeSearchEnabled = k_data.enabled;
k_data.k_safeSearchExceptions = k_methods.k_parseUserReferenceListToNames(k_data.userExceptions) || kerio.lib.k_tr('None','common');
delete k_data.enabled;
k_form.k_setData(k_data);
k_form.k_dataStore = k_data;
k_form.k_originalData = kerio.lib.k_cloneObject(k_data);
},

k_getTabData: function () {
var
k_form = this.k_forbiddenWords,
k_dataStore = kerio.lib.k_cloneObject(k_form.k_dataStore),
k_data = k_form.k_getData();
k_dataStore.enabled = k_data.safeSearchEnabled;
delete k_dataStore.safeSearchEnabled;
delete k_dataStore.k_safeSearchExceptions;
return { config: k_dataStore };
}
},

k_p2pEliminator: {
k_isContentChanged: false,
k_root: 'config',
k_sendDataRequest: {
method: 'P2pEliminator.set'
},
k_getDataRequest: {
method: 'P2pEliminator.get'
},

k_setTabData: function (k_data) {
var
k_p2pEliminator = this.k_p2pEliminator;
k_p2pEliminator.k_setData(k_data);
k_p2pEliminator.k_dataStore = k_data;
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_data: ['k_services'],
k_dialogs: ['selectItems']
});
k_p2pEliminator.k_servicesGrid.k_loadServices(k_data.trustedServiceIdList);
},

k_getTabData: function () {
var
k_form = this.k_p2pEliminator,
k_data = k_form.k_getData(true),
k_dataStore = k_form.k_dataStore;
if (false === k_form.k_isValid()) {
this.k_stopUpload = true;
return false;
}
k_data.trustedServiceIdList = k_form.k_servicesGrid.k_getServices();
kerio.waw.shared.k_methods.k_mergeObjects(k_data, k_dataStore);
return {config: k_dataStore};
}
},
k_httpsFiltering: {
k_isContentChanged: false,
k_root: 'config',
k_sendDataRequest: {
method: k_contentFilterObject + '.setHttpsConfig'
},
k_getDataRequest: {
method: k_contentFilterObject + '.getHttpsConfig'
},

k_setTabData: function (k_data) {
var
k_methods = kerio.waw.shared.k_methods,
k_httpsForm = this.k_httpsForm;
k_data.k_userExceptions = k_methods.k_parseUserReferenceListToNames(k_data.userExceptions) || kerio.lib.k_tr('None', 'common');
k_httpsForm.k_setData(k_data);
k_httpsForm.k_dataStore = k_data;
k_httpsForm.k_ipAddressGroup.k_selectValue(k_methods.k_prepareListValue(k_data.ipAddressGroup), true);
k_httpsForm.k_originalData = kerio.lib.k_cloneObject(k_data);
},

k_getTabData: function () {
var
k_form = this.k_httpsForm,
k_data = k_form.k_getData(true),
k_dataStore = k_form.k_dataStore,
k_tr = kerio.lib.k_tr,
k_httpsDisclaimerShowned = k_form.k_httpsDisclaimerShowned,
k_ipGroup;
k_ipGroup = k_form.k_ipAddressGroup.k_getValue();
k_data.ipAddressGroup = {
enabled: '' !== k_ipGroup.id,
value: k_ipGroup
};
if (true !== k_httpsDisclaimerShowned && k_data.enabled && false === k_form.k_originalData.enabled) {
this.k_setActiveTab('k_httpsForm');
this.k_stopUpload = true;
kerio.lib.k_confirm({
k_title: k_tr('Disclaimer', 'httpsFiltering'),
k_msg: k_tr('Switching on the HTTPS traffic inspection feature will cause the Kerio Control firewall to automatically decrypt and scan HTTPS traffic. While scanning is automated and involves no logging of decrypted data, you are required under certain laws to notify your users of such decryption and scanning, and gain their consent before you start decryption and scanning of their HTTPS traffic. By enabling this feature you agree that you are responsible for such decryption and scanning of secure content, and that you will obtain your users’ consent prior to performing such decryption and inspection.','httpsFiltering') + '<br /><br />' +
k_tr('For your convenience, we have created a notice to users who use your network after you trigger this feature, disclosing that HTTPS traffic would be decrypted and scanned and asking for their permission.  Also for your convenience, you may select to exclude certain HTTPS sessions from decryption and scanning.','httpsFiltering'),
k_icon: 'warning',
k_buttons: {
k_yes: k_tr('I Agree', 'httpsFiltering'),
k_no: k_tr('Cancel', 'wlibButtons')
},
k_callback: function(k_result) {
var
k_tabPage = this.k_getMainWidget();
if ('yes' === k_result) {
kerio.waw.status.k_userSettings.k_set('httpsDisclaimerShowned', true);
kerio.waw.status.k_userSettings.k_save();
this.k_httpsDisclaimerShowned = true;
k_tabPage.k_sendData();
}
else {
this.k_enableCheckbox.k_focus();
}
},
k_scope: k_form
});
}
kerio.waw.shared.k_methods.k_mergeObjects(k_data, k_dataStore);
k_dataStore = kerio.lib.k_cloneObject(k_dataStore);
delete k_dataStore.k_userExceptions;
return {config: k_dataStore};
}
}
};k_whiteListGrid.k_addReferences({
k_batchId: 'k_urlFilterConfig'
});
k_tabPage.k_addReferences({
k_contentRules: k_contentRules,
k_forbiddenWords: k_forbiddenWords,
k_webFilter: k_webFilter,
k_p2pEliminator: k_p2pForm,
k_httpsForm: k_httpsForm,
k_isAuditor: k_isAuditor
});
k_batchChangeHandler = {
k_onChangeHandler: k_onChangeHandler,
k_batchOptions: k_batchOptions
};
k_tabPage.k_addReferences(k_batchChangeHandler);
k_contentRules.k_addReferences(k_batchChangeHandler);
k_forbiddenWordsGrid.k_addReferences(k_batchChangeHandler);
k_forbiddenWords.k_addReferences(k_batchChangeHandler);
k_webFilter.k_addReferences(k_batchChangeHandler);
k_whiteListGrid.k_addReferences(k_batchChangeHandler);
k_p2pForm.k_addReferences(k_batchChangeHandler);
this.k_addControllers(k_tabPage);
k_tabPage.k_addReferences({
k_applyBatchCfg: {
k_scope: k_tabPage,
k_callback: k_tabPage.k_applyResetCallback
}
});
return k_tabPage;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function () {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
kerio.waw.shared.k_data.k_get('k_timeRanges');
kerio.waw.shared.k_data.k_get('k_ipAddressGroups');
kerio.waw.status.k_currentScreen.k_gotoTab(this, 'k_contentRules');
this.k_loadData();
this.k_httpsForm.k_httpsDisclaimerShowned =  kerio.waw.status.k_userSettings.k_get('httpsDisclaimerShowned');
};
k_kerioWidget.k_httpsForm.k_addReferences({
k_ipAddressGroup: new kerio.waw.shared.k_methods.K_ListLoader({
k_list: 'k_ipAddressGroupList',
k_select: 'ipAddressGroup',
k_form: k_kerioWidget.k_httpsForm,
k_excludingNoneOption: true
})
});
k_kerioWidget.k_httpsForm.k_ipAddressGroup.k_sendRequest();

k_kerioWidget.k_resetData = function() {
var
k_requests = [],
k_batchCfg,
k_batchOptions,
k_option,
k_batchId;
k_batchOptions = this.k_batchOptions;
for (k_batchId in k_batchOptions) {
k_option = k_batchOptions[k_batchId];
if (k_option.k_resetDataRequest) {
k_requests.push({ k_jsonRpc: k_option.k_resetDataRequest });
}
}
if (0 === k_requests.length) {
this.k_resetScreen();
return;
}
k_batchCfg = {
k_scope: this,
k_callback: this.k_applyResetCallback
};
kerio.waw.requests.k_sendBatch(k_requests, k_batchCfg);
};

k_kerioWidget.k_applyResetCallback = function(k_response, k_success) {
if (!k_success || !kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
return;
}
this.k_resetScreen();
};

k_kerioWidget.k_resetScreen = function() {
kerio.adm.k_framework.k_enableApplyReset(false);
if (kerio.adm.k_framework.k_leaveCurrentScreen()) {
return;
}
kerio.waw.shared.k_methods.k_updateDataStore('k_selectHttpRule');
this.k_loadData();
};

k_kerioWidget.k_loadData = function() {
var
k_requests = [],
k_batchCfg,
k_batchOptions,
k_option,
k_batchId;
k_batchOptions = this.k_batchOptions;
for (k_batchId in k_batchOptions) {
k_option = k_batchOptions[k_batchId];
if (k_option.k_getDataRequest) {
k_requests.push(k_option.k_getDataRequest);
}
}
k_batchCfg = {
k_requests: k_requests,
k_callback: this.k_loadDataCallback,
k_scope: this
};
kerio.waw.shared.k_methods.k_sendBatch(k_batchCfg);
};

k_kerioWidget.k_loadDataCallback = function (k_response, k_success) {
var
k_batchResponseIndex = 0,
k_batchOptions,
k_option,
k_batchResult,
k_batchId;
if (!k_success || ! k_response.k_isOk) {
return;
}
k_batchResult = k_response.k_decoded.batchResult;
k_batchOptions = this.k_batchOptions;
for (k_batchId in k_batchOptions) {
k_option = k_batchOptions[k_batchId];
if (k_option.k_setTabData) {
k_option.k_setTabData.call(this, k_batchResult[k_batchResponseIndex][k_option.k_root]);
k_option.k_isContentChanged = 'k_contentRules' === k_batchId ? true : false; }
k_batchResponseIndex++;
}
kerio.adm.k_framework.k_enableApplyReset(false);
kerio.waw.shared.k_data.k_cache({
k_screen: this,
k_data: ['k_urlGroups', 'k_applications', 'k_fileTypes', 'k_domains', 'k_users', 'k_groups'],
k_dialogs: ['contentFilterUrlEditor', 'contentFilterForbiddenWordsEditor', 'contentFilterWhiteListItemEditor', 'ruleDescriptionEditor']
});
};

k_kerioWidget.k_sendData = function() {
var
k_requests = [],
k_batchCfg = this.k_applyBatchCfg,
k_isContentRulesTabChanged = false,
k_batchOptions,
k_option,
k_batchId;
k_batchOptions = this.k_batchOptions;
this.k_stopUpload = false;
for (k_batchId in k_batchOptions) {
k_option = k_batchOptions[k_batchId];
if (k_option.k_isContentChanged && k_option.k_sendDataRequest) {
if (false === this.k_stopUpload && k_option.k_getTabData) {
k_option.k_sendDataRequest.params = k_option.k_getTabData.call(this);
}
k_requests.push({ k_jsonRpc: k_option.k_sendDataRequest });
if ('k_contentRules' === k_batchId) {
k_isContentRulesTabChanged = true;
}
}
}
if (0 === k_requests.length) {
if (!kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.finalVersion) {
kerio.lib.k_reportError('Internal error: nothing to apply', 'contentFilterList', 'k_sendData');
}
k_batchCfg.k_callback.apply(k_batchCfg.k_scope, [[], true]); return;
}
if (this.k_stopUpload) {
this.k_stopUpload = true;
return false;
}
kerio.waw.requests.k_sendBatch(k_requests, k_batchCfg);
if (k_isContentRulesTabChanged) {
this.k_contentRules._k_deferSendData();
}
};

k_kerioWidget.k_displayWebFilterMessage = function(k_data) {
var
UrlFilterStatus = kerio.waw.shared.k_CONSTANTS.UrlFilterStatus,
k_tr = kerio.lib.k_tr,
k_licensedMessageElement = this.k_webFilter.k_licensedMessageElement,
k_activatedMessageElement = this.k_webFilter.k_activatedMessageElement,
k_isTabMessageVisible = false,
k_isActivatedMessageVisisble = false,
k_message = '',
k_link = '';
if (kerio.waw.shared.k_methods.k_isTrial(false)) {
k_message = k_tr('Kerio Control Web Filter and application awareness are not available in the unregistered trial.', 'httpWebFilter');
k_link = k_tr('Please register to enable Kerio Control Web Filter.', 'httpWebFilter');
k_isTabMessageVisible = true;
}
else {
switch (k_data.status) {
case UrlFilterStatus.UrlFilterNotLicensed:
k_message = k_tr('Kerio Control Web Filter and application awareness are not licensed, categorization is disabled.', 'httpWebFilter');
k_link = k_tr('Register your purchased Kerio Control Web Filter license number to enable categorization.', 'httpWebFilter');
k_isTabMessageVisible = true;
break;
case UrlFilterStatus.UrlFilterNotActivated:
case UrlFilterStatus.UrlFilterActivating:
k_isActivatedMessageVisisble = true;
if (k_data.activationErrorDescr) {
k_message = k_tr('Kerio Control Web Filter activation failed', 'httpWebFilter') + ' - ' + k_tr(k_data.activationErrorDescr, 'serverMessage');
}
else {
k_message = k_tr('Kerio Control Web Filter is not activated, categorization is disabled.', 'httpWebFilter');
}
break;
default:
k_isTabMessageVisible = false;
}
}
if (k_isTabMessageVisible) {
k_licensedMessageElement.k_setValue({
k_message: k_message,
k_link: k_link
});
}
k_licensedMessageElement.k_setVisible(k_isTabMessageVisible);
if (k_isActivatedMessageVisisble) {
k_activatedMessageElement.k_setValue({
k_message: k_message,
k_link: k_link
});
}
k_activatedMessageElement.k_setVisible(k_isActivatedMessageVisisble);
};

k_kerioWidget.k_contentRules.k_hasUndefinedActionProperty = function(k_rowData) {
var
k_shared = kerio.waw.shared;
if (k_shared.k_CONSTANTS.RuleAction.k_REDIRECT === k_rowData.action && '' === k_rowData.denialCondition.redirectUrl) {
k_shared.k_methods.k_alertError(
kerio.lib.k_tr('Please set the redirect URL in column Properties of rule "%1"!', 'contentFilter',
{
k_args: [k_rowData.name] }
) );
return true;
}
return false;
};

k_kerioWidget.k_contentRules.k_compareSourceConditionList = function(k_first, k_second) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_entityType = k_WAW_CONSTANTS.SourceConditonEntityType,
k_firstType = k_first.type,
k_secondType = k_second.type,
k_KEEP_ORDER = -1,
k_CHANGE_ORDER = 1,
k_EQUAL = 0,
k_firstUser,
k_secondUser,
k_firstUserName,
k_secondUserName,
k_differentType;
k_differentType = k_firstType !== k_secondType;
switch (k_firstType) {
case k_entityType.SourceConditonEntityUsers:
if (k_differentType) {
return k_KEEP_ORDER;
}
k_firstUser = k_first.user;
k_secondUser = k_second.user;
if (k_firstUser.isGroup !== k_secondUser.isGroup) {
return k_firstUser.isGroup ? k_CHANGE_ORDER : k_KEEP_ORDER;
}
k_firstUserName = k_firstUser.name + '@' + k_firstUser.domainName;
k_secondUserName = k_secondUser.name + '@' + k_secondUser.domainName;
return k_firstUserName.localeCompare(k_secondUserName);
case k_entityType.SourceConditonEntityAddressGroup:
if (k_differentType) {
return k_entityType.SourceConditonEntityUsers === k_secondType ? k_CHANGE_ORDER : k_KEEP_ORDER;
}
return k_first.ipAddressGroup.name.localeCompare(k_second.ipAddressGroup.name);
case k_entityType.SourceConditonEntityGuests:
return k_CHANGE_ORDER;
}
return k_EQUAL;
};
k_kerioWidget.k_contentRules.k_compareEntityItems = function(k_first, k_second) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_entityType = k_WAW_CONSTANTS.ContentConditionEntityType,
k_firstType = k_first.type,
k_secondType = k_second.type,
k_KEEP_ORDER = -1,
k_EQUAL = 0;
if (k_firstType !== k_secondType) {
switch (k_firstType) {
case k_entityType.ContentConditionEntityApplication:
return k_KEEP_ORDER;
case k_entityType.ContentConditionEntityUrlGroup:
return k_KEEP_ORDER;
}
}
switch (k_firstType) {
case k_entityType.ContentConditionEntityApplication:
return k_first.application.name.localeCompare(k_second.application.name);
case k_entityType.ContentConditionEntityUrlGroup:
return k_first.urlGroup.name.localeCompare(k_second.urlGroup.name);
}
return k_EQUAL;
};
k_kerioWidget.k_contentRules.k_renderContentEntityItem = function(k_data, k_grid, k_itemIndex) {
var
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_TYPE = k_WAW_CONSTANTS.ContentConditionEntityType,
ApplicationType = k_WAW_CONSTANTS.ApplicationType,
ApplicationWebFilterCategory = ApplicationType.ApplicationWebFilterCategory,
ApplicationProtocol = ApplicationType.ApplicationProtocol,
k_FILE_NAME_GROUPS_TRANSLATIONS = k_shared.k_DEFINITIONS.k_FILE_NAME_GROUPS_TRANSLATIONS,
k_renderers = k_shared.k_methods.k_renderers,
k_entityType = k_data.type,
k_className = '',
k_iconCls = '',
k_rendererInput = {},
k_tooltip,
k_rowData,
k_rendererOutput;
switch (k_entityType) {
case k_TYPE.ContentConditionEntityApplication:
if (!k_grid.k_isWebFilterLicensed
|| (k_data.k_isWholeSubGroup && !k_grid.k_isWebFilterOn && !k_grid.k_isApplicationAwarenessOn)
|| (!k_data.k_isWholeSubGroup && k_data.types.length && !k_grid.k_isWebFilterOn && ApplicationWebFilterCategory === k_data.types[0])
|| (!k_data.k_isWholeSubGroup && k_data.types.length && !k_grid.k_isApplicationAwarenessOn && ApplicationProtocol === k_data.types[0])
) {
k_iconCls = 'cellIcon webFilterIcon invalid';
if (!k_grid.k_isWebFilterLicensed) {
k_tooltip = k_grid.k_translations.k_webFilterNotLicensed;
}
else if (k_data.k_isWholeSubGroup && !k_grid.k_isWebFilterOn && !k_grid.k_isApplicationAwarenessOn) {
k_tooltip = k_grid.k_translations.k_bothDisabled;
}
else if ((k_data.k_isWholeSubGroup && !k_grid.k_isWebFilterOn) || (!k_data.k_isWholeSubGroup && !k_grid.k_isWebFilterOn && ApplicationWebFilterCategory === k_data.types[0])) {
k_tooltip = k_grid.k_translations.k_webFilterDisabled;
}
else if ((k_data.k_isWholeSubGroup && !k_grid.k_isApplicationAwarenessOn) || (!k_data.k_isWholeSubGroup && !k_grid.k_isApplicationAwarenessOn && ApplicationProtocol === k_data.types[0])) {
k_tooltip = k_grid.k_translations.k_applicationAwarenessDisabled;
}
k_className = !k_grid.k_isWebFilterLicensed ? 'unlicensed' : '';
}
else {
k_iconCls = 'cellIcon webFilterIcon';
}
k_rowData = k_data.k_isWholeSubGroup ? k_data.subGroup : k_data.name;
break;
case k_TYPE.ContentConditionEntityFileGroup:
k_rowData = k_FILE_NAME_GROUPS_TRANSLATIONS[k_data.value];
k_iconCls = 'bandwidthManagement trafficTypeIcon';
break;
case k_TYPE.ContentConditionEntityFileName:
k_rowData = k_data.value;
k_iconCls = 'bandwidthManagement trafficTypeIcon';
break;
case k_TYPE.ContentConditionEntityUrl:
k_rowData = k_data.value;
k_iconCls = 'bandwidthManagement activity web';
break;
case k_TYPE.ContentConditionEntityUrlGroup:
k_rendererInput.urlGroup = k_data.urlGroup;
k_rendererOutput = k_renderers.k_urlGroupRenderer(null, k_rendererInput);
k_rowData = k_rendererOutput.k_data;
k_iconCls = k_rendererOutput.k_iconCls;
k_tooltip = k_rendererOutput.k_dataTooltip;
break;
default:
k_rowData = k_data.type;
break;
}
if (k_iconCls && -1 !== k_iconCls.indexOf('invalid')) {
k_className += ' invalid';
}
return {
k_data: k_rowData,
k_iconCls: 'gridListIcon ' + k_iconCls,
k_className: k_className,
k_dataTooltip: k_tooltip,
k_iconTooltip: k_tooltip
};
};
k_kerioWidget.k_contentRules.k_renderSourceEntityItem = function(k_data, k_grid) {
var
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_WAW_METHODS = k_shared.k_methods,
k_TYPE = k_WAW_CONSTANTS.SourceConditonEntityType,
k_renderers = k_shared.k_methods.k_renderers,
k_entityType = k_data.type,
k_rendererInput = {},
k_tooltip = '',
k_className = '',
k_iconCls = '',
k_rowData,
k_rendererOutput;
if (k_data.k_isNothing) {
k_iconCls = 'policyGrid gridListIcon objectNothing invalid';
k_rowData = k_grid.k_translations.k_nothing;
k_tooltip = k_grid.k_translations.k_invalidUserTooltip;
}
else {
switch (k_entityType) {
case k_TYPE.SourceConditonEntityAddressGroup:
k_rendererInput.validAddressGroup = k_data.ipAddressGroup;
k_rendererOutput = k_renderers.k_addressGroupRenderer(null, k_rendererInput);
k_rowData = k_rendererOutput.k_data;
k_iconCls = k_rendererOutput.k_iconCls;
k_tooltip = k_rendererOutput.k_dataTooltip;
break;
case k_TYPE.SourceConditonEntityUsers:
if (k_WAW_CONSTANTS.UserConditionType.AuthenticatedUsers === k_data.userType) {
k_rowData = k_grid.k_translations.k_authenticatedUsers;
k_iconCls = 'authUsersIcon';
}
else {
k_rendererOutput = k_WAW_METHODS.k_createReferencedUserName(k_data.user);
k_rowData = k_rendererOutput.k_userName;
k_iconCls = k_rendererOutput.k_iconClass;
}
break;
case k_TYPE.SourceConditonEntityGuests:
k_iconCls = 'groupIcon interfaceHeaderIcon groupGuest';
k_rowData = k_grid.k_translations.k_guestInterfaces;
break;
default:
k_iconCls = 'invalid';
k_rowData = k_data.type;
break;
}
}
if (k_iconCls && -1 !== k_iconCls.indexOf('invalid')) {
k_className = 'invalid';
}
return {
k_data: k_rowData,
k_iconCls: 'gridListIcon ' + k_iconCls,
k_className: k_className,
k_dataTooltip: k_tooltip,
k_iconTooltip: k_tooltip
};
};

k_kerioWidget.k_contentRules.k_updateInvalidUrlGroups = function() {
var
k_datastore,
k_urlGroupListMapped,
k_data,
k_columnData,
k_isSubItemInvalid,
k_isRuleInvalid,
k_rowData,
k_i, k_cnt,
k_cellData;
k_datastore = kerio.waw.shared.k_data.k_get('k_urlGroups');
if (!k_datastore) {
return;
}
k_urlGroupListMapped = k_datastore.k_urlGroupListMapped;
k_data = this.k_getData();
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_rowData = k_data[k_i];
k_isSubItemInvalid = false;
k_cellData = {};
k_columnData = kerio.lib.k_cloneObject(k_rowData.contentCondition);
if (this.k_checkUrlGroupEntities(k_columnData.entities, k_urlGroupListMapped)) {
k_isSubItemInvalid = true;
k_cellData.contentCondition = k_columnData;
}
if (k_isSubItemInvalid) {
k_isRuleInvalid = this._k_isInactiveRuleCustom(k_rowData);
if (k_isRuleInvalid) {
k_rowData.inactive = true;
}
this.k_updateRow(k_cellData, k_i);
this.k_updateRowStatus(k_rowData); this.k_updateRowStatus(true);      this.k_updateRow(k_cellData, k_i);
}
}
};

k_kerioWidget.k_contentRules.k_checkUrlGroupEntities = function(k_entities, k_urlGroupListMapped) {
var
k_CF_CONDITION_TYPE_URL_GROUP = kerio.waw.shared.k_CONSTANTS.ContentConditionEntityType.ContentConditionEntityUrlGroup,
k_isSubItemInvalid = false,
k_j, k_cntEntities,
k_item;
for (k_j = 0, k_cntEntities = k_entities.length; k_j < k_cntEntities; k_j++) {
k_item = k_entities[k_j];
if (k_CF_CONDITION_TYPE_URL_GROUP === k_item.type && undefined === k_urlGroupListMapped[k_item.urlGroup.id]) {
k_item.urlGroup.invalid = true;
k_isSubItemInvalid = true;
}
}
return k_isSubItemInvalid;
};

k_kerioWidget.k_contentRules.k_checkAddressGroupEntities = function(k_entities, k_ipGroupListMapped) {
var
k_CF_ENTITY_TYPE_ADDRESS_GROUP = kerio.waw.shared.k_CONSTANTS.SourceConditonEntityType.SourceConditonEntityAddressGroup,
k_isSubItemInvalid = false,
k_j, k_cntEntities,
k_item;
for (k_j = 0, k_cntEntities = k_entities.length; k_j < k_cntEntities; k_j++) {
k_item = k_entities[k_j];
if (k_CF_ENTITY_TYPE_ADDRESS_GROUP === k_item.type && undefined === k_ipGroupListMapped[k_item.ipAddressGroup.id]) {
k_item.ipAddressGroup.invalid = true;
k_isSubItemInvalid = true;
}
}
return k_isSubItemInvalid;
};

k_kerioWidget.k_contentRules.k_updateInvalidIpAddressGroups = function() {
var
k_datastore,
k_ipGroupListMapped,
k_data,
k_columnData,
k_isSubItemInvalid,
k_isRuleInvalid,
k_rowData,
k_i, k_cnt,
k_cellData;
k_datastore = kerio.waw.shared.k_data.k_get('k_ipAddressGroups');
if (!k_datastore) {
return;
}
k_ipGroupListMapped = k_datastore.k_ipGroupListMapped;
k_data = this.k_getData();
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_rowData = k_data[k_i];
k_isSubItemInvalid = false;
k_cellData = {};
k_columnData = kerio.lib.k_cloneObject(k_rowData.sourceCondition);
if (this.k_checkAddressGroupEntities(k_columnData.entities, k_ipGroupListMapped)) {
k_isSubItemInvalid = true;
k_cellData.sourceCondition = k_columnData;
}
if (k_isSubItemInvalid) {
k_isRuleInvalid = this._k_isInactiveRuleCustom(k_rowData);
if (k_isRuleInvalid) {
k_rowData.inactive = true;
}
this.k_updateRow(k_cellData, k_i);
this.k_updateRowStatus(k_rowData); this.k_updateRowStatus(true);      this.k_updateRow(k_cellData, k_i);
}
}
};

k_kerioWidget.k_forbiddenWords.k_grid.k_callbackRemoveForbiddenWords = function(k_response) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
if (!kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
return;
}
this.k_removeSelectedRows();
this.k_onChangeHandler(this.k_batchId);
};

k_kerioWidget.k_webFilter.k_openWebFilterCategoryDialog = function(k_response) {
var
k_httpPolicyData;
kerio.waw.shared.k_methods.k_unmaskMainScreen();
if (!k_response.k_isOk) {
return;
}
k_httpPolicyData = this.k_getData(true);
k_httpPolicyData.whiteList = this.k_whiteListGrid.k_getData();
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'webFilterCategoryDialog',
k_objectName: 'k_webFilterCategoryDialog',
k_callback: this.k_webFilterCategoryCallback,
k_params: {
k_parentWidget: this,
k_data: {
k_url: this.k_getItem('url').k_getValue(), k_categoryIds: k_response.k_decoded.categoryIds,
k_httpPolicyData: k_httpPolicyData
}
}
});
};

k_kerioWidget.k_webFilter.k_webFilterCategoryCallback = function(k_response) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
};

k_kerioWidget.k_webFilter.k_sendRequestForCategory = function(k_form) {
var
k_url = k_form.k_testedUrl.k_getValue(),
k_request = k_form.k_requestForTestUrl,
k_tr = kerio.lib.k_tr;
kerio.waw.shared.k_methods.k_maskMainScreen();
if ('' === k_url || k_form.k_initTextForTestKwf === k_url) {
kerio.lib.k_alert({
k_title: k_tr('Error', 'common'),
k_msg: k_tr('Enter a URL to check its categorization', 'httpWebFilter'),
k_icon: 'warning'
});
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
}
k_request.k_jsonRpc.params.url = k_url;
if (undefined === k_request.k_callback) {
k_request.k_callback = k_form.k_openWebFilterCategoryDialog;
}
kerio.lib.k_ajax.k_request(k_form.k_requestForTestUrl);
};
} }; 