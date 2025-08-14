
kerio.waw.shared.k_widgets = kerio.waw.shared.k_widgets || {};

kerio.waw.shared.k_widgets.K_TabRights = function(k_id, k_config){
var
k_localNamespace = k_id + '_',
k_tr = kerio.lib.k_tr,
k_isAuditor = k_config.k_isAuditor || false,
k_multiEditorElement = kerio.waw.shared.k_methods.k_multiEditorElement,
k_isMultiEdit = k_config.k_isMultiEdit,
k_role,
k_additionalRights,
k_i,
k_formCfg;
this._k_localNamespace = k_localNamespace;
k_role = [
{
k_type: 'k_radio',
k_groupId: 'k_role',
k_option: k_tr('No access to administration', 'userEditor'),
k_value: kerio.waw.shared.k_CONSTANTS.k_NONE,
k_isChecked: true
},
{
k_type: 'k_radio',
k_groupId: 'k_role',
k_option: k_tr('Read only access to administration', 'userEditor'),
k_value: kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Auditor
},
{
k_type: 'k_radio',
k_groupId: 'k_role',
k_option: k_tr('Full access to administration', 'userEditor'),
k_value: kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_FullAdmin
}
];
if (k_isMultiEdit) {
k_role = k_multiEditorElement(k_role);
}
k_additionalRights = [
{
k_type: 'k_checkbox',
k_id: 'unlockRule',
k_option: k_tr('[User|Users] can unlock Content Filter rules', 'contentRules', { k_pluralityBy: k_isMultiEdit ? 10 : 1 })
},
{
k_type: 'k_checkbox',
k_id: 'dialRasConnection',
k_option: k_tr('[User|Users] can control dial-up lines', 'contentRules', { k_pluralityBy: k_isMultiEdit ? 10 : 1 })
},
{
k_type: 'k_checkbox',
k_id: 'connectVpn',
k_option: k_tr('[User|Users] can connect using VPN', 'contentRules', { k_pluralityBy: k_isMultiEdit ? 10 : 1 })
},
{
k_type: 'k_checkbox',
k_isHidden: true,
k_id: 'useP2p',
k_option: k_tr('[User|Users] [is|are] allowed to use P2P networks', 'contentRules', { k_pluralityBy: k_isMultiEdit ? 10 : 1 })
}
];
if (k_isMultiEdit) {
for (k_i = 0; k_i < k_additionalRights.length; k_i++) {
k_additionalRights[k_i] = k_multiEditorElement(k_additionalRights[k_i]);
}
}
k_formCfg = {
k_id: k_id,
k_width: '100%',
k_items: [
{
k_type: 'k_fieldset',
k_id: 'k_administrationRightsContainer',
k_caption: k_tr('Administration rights', 'userEditor'),
k_isLabelHidden: true,
k_items: k_role
},
{
k_type: 'k_fieldset',
k_id: 'k_additionalRightsContainer',
k_caption: k_tr('Additional rights', 'userEditor'),
k_isLabelHidden: true,
k_className: 'noBottomMargin',
k_items: k_additionalRights
}
]
};
kerio.waw.shared.k_widgets.K_TabRights.superclass.constructor.call(this, k_id, k_formCfg);
if (k_isAuditor) {
this.k_setReadOnlyAll();
}
this.k_addControllers(this);
}; 
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_TabRights', kerio.lib.K_Form, {

k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_getRightsData = function(){
var
k_formData = this.k_getData(),
k_data = {};
k_data.readConfig = true;
k_data.writeConfig = false;
switch (k_formData.k_role) {
case kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_FullAdmin:
k_data.writeConfig = true;
break;
case kerio.waw.shared.k_CONSTANTS.k_NONE:
k_data.readConfig = false;
}
k_data.unlockRule = k_formData.unlockRule;
k_data.dialRasConnection = k_formData.dialRasConnection;
k_data.connectVpn = k_formData.connectVpn;
k_data.connectSslVpn = k_formData.connectSslVpn;
k_data.useP2p = k_formData.useP2p;
k_data.viewStats = k_formData.viewStats;
return k_data;
};
k_kerioWidget.k_setRightsData = function(k_data){
var k_form = this;
if (!k_data.readConfig) {
k_data.k_role = kerio.waw.shared.k_CONSTANTS.k_NONE;
}
else if (!k_data.writeConfig) {
k_data.k_role = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Auditor;
}
else {
k_data.k_role = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_FullAdmin;
}
k_form.k_setData(k_data, true);
};}
});

kerio.waw.shared.k_widgets.K_SearchToolbar = function(k_id, k_config){
var k_localNamespace = k_id + '_';
this._k_localNamespace = k_localNamespace;
var k_configTextField = {
k_caption: kerio.lib.k_tr('Search:', 'userList'),
k_id: 'k_search',
k_value: '',
k_width: 200,
k_maxLength: 128,

k_onKeyPress: function(k_toolbar, k_textField, k_extEvent){
if (k_extEvent.ENTER !== k_extEvent.keyCode) {
return;
}
var k_searchValue = k_textField.k_getValue();
var k_hideDisabled = false;
if (k_toolbar.k_checkbox && k_toolbar.k_checkbox.k_getValue() === true) {
k_hideDisabled = true;
}
k_toolbar.k_relatedWidget.k_reloadData(k_toolbar._k_createQuery(k_searchValue, k_hideDisabled));
}
};
var k_searchField = new kerio.lib.K_TextField(k_localNamespace + 'k_searchField', k_configTextField);
var k_searchToolbarConfiguration = {
k_items: ['->', {
k_content: k_searchField
}]
};
kerio.waw.shared.k_widgets.K_SearchToolbar.superclass.constructor.call(this, k_id, k_searchToolbarConfiguration);
this.k_addReferences({
k_searchField: k_searchField,
k_config: k_config,
k_relatedWidget: {},
k_currentDomainId: '',
k_parent: this
});
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_SearchToolbar', kerio.lib.K_Toolbar, {

k_setRelatedGrid: function(k_grid){
this.k_relatedWidget = k_grid;
this.k_currentDomainId = this.k_getDomain();
},
k_getDomain: function(){
var k_domainId = this.k_domainSelect.k_getValue();
var k_return;
if (k_domainId) {
k_return = k_domainId;
}
else {
k_return = kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE;
}
this.k_loadDomains();
return k_return;
},
_k_createQuery: function(k_searchValue, k_hideDisabled){
var
k_WEB_CONSTANTS = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_get = kerio.waw.shared.k_DEFINITIONS.k_get,
k_queryValue = {
'start': 0, 'limit': this.k_relatedWidget.k_pageSize,
'query': {
'conditions': [],
'combining': k_WEB_CONSTANTS.kerio_web_And
}
};
if (k_searchValue && '' !== k_searchValue) {
k_queryValue.query.conditions.push(k_get('k_searchCondition', { k_value: k_searchValue}));
}
if (k_hideDisabled) {
k_queryValue.query.conditions.push(k_get('k_searchCondition', { k_fieldName: 'localEnabled', k_value: '1', k_match: true}));
if (!this.k_isCurrentDomainLocal) {
k_queryValue.query.conditions.push(k_get('k_searchCondition', { k_fieldName: 'adEnabled', k_value: '1', k_match: true}));
}
}
return k_queryValue;
}});
kerio.waw.shared.k_widgets.K_DomainSelectToolbar = function(k_id, k_config){
kerio.waw.shared.k_widgets.K_DomainSelectToolbar.superclass.constructor.call(this, k_id, k_config);
this.k_config = k_config;

var k_onChange = function(k_toolbar, k_select, k_domainId){
if (!this.k_parent) {
return;
}
k_toolbar = this.k_parent;
var k_hideDisabled = false;
if (k_toolbar.k_checkbox) {
k_hideDisabled = k_toolbar.k_checkbox.k_getValue();
}
k_toolbar.k_currentDomainId = k_domainId;
k_toolbar.k_isCurrentDomainLocal = kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE === k_domainId;
var k_queryParams = k_toolbar._k_createQuery('', k_hideDisabled);
k_toolbar.k_searchField.k_setValue('');
k_queryParams.domainId = k_domainId;
k_toolbar.k_relatedWidget.k_reloadData(k_queryParams);
kerio.waw.status.k_userGroupList.k_domainId = k_domainId;
if (this.k_customOnSelect) {
this.k_customOnSelect.call(this, k_toolbar, this, k_domainId);
}
}; var k_configSelect = {
k_caption: kerio.lib.k_tr('Domain:', 'userList'),
k_id: 'k_domain',
k_localData: [],
k_width: 250,
k_onChange: k_onChange,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_domainId',
k_useColumnsNames: true,
k_isDisabled: true
};
var k_domainSelect = new kerio.lib.K_Select(this._k_localNamespace + 'k_domainSelect', k_configSelect);
if (undefined !== k_config.k_onChange) {
k_domainSelect.k_customOnSelect = k_config.k_onChange;
}
k_domainSelect.k_parent = this;
this.k_addWidget(k_domainSelect, 0);
k_domainSelect.k_relatedWidget = this.k_relatedWidget;
this.k_domainSelect = k_domainSelect;
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_DomainSelectToolbar', kerio.waw.shared.k_widgets.K_SearchToolbar, {

k_loadDomains: function(){
var k_queryValue = {
'query': {
'start': 0,
'limit': -1
}
};
kerio.waw.shared.k_methods.k_maskMainScreen(this, { k_isSaving: false });
kerio.lib.k_ajax.k_request({
k_root: 'domainList',
k_jsonRpc: {
method: 'Domains.get',
params: k_queryValue
},
k_callback: this._k_fillData,
k_scope: this
});
},
_k_fillData: function(k_response, k_success){
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
if (!k_success || !k_response.k_isOk || !k_response.k_decoded) {
return;
}
var
k_data = k_response.k_decoded.domainList,
k_localData = [''], k_domainSelect = this.k_domainSelect,
k_currentDomainId = (kerio.waw.status.k_userGroupList.k_domainId ?
kerio.waw.status.k_userGroupList.k_domainId :
this.k_currentDomainId),
k_isUserList = (this.k_relatedWidget.k_id === this.k_relatedWidget._k_userListId),
k_userListStatus = kerio.waw.status.k_userList,
k_domainDbDisabled = false,
k_LOCAL_USER_DATABASE = kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE,
k_i, k_cnt,
k_domain,
k_details,
k_id,
k_isDomainUnchanged,
k_query;
k_userListStatus.k_isAdAuthEnabled = false;
k_userListStatus.k_isNtAuthEnabled = false;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_domain = k_data[k_i];
k_details = k_domain.primaryDetails;
k_id = k_data[k_i].id;
if (k_domain.id !== k_LOCAL_USER_DATABASE) {
if ('' === k_domain.name) {
continue;
}
if (k_domain.primary && k_isUserList) {
k_userListStatus.k_isAdAuthEnabled = k_details.enabled;
k_userListStatus.k_isNtAuthEnabled = k_details.ntAuthMode && k_details.ntAuthenticationDomain.enabled;
}
if (k_domain.primary && k_details.authenticationOnly) {
continue;
}
k_localData.push({
'k_name': k_domain.name,
'k_domainId': k_domain.id
});
if (k_domain.primary && !k_domain.primaryDetails.enabled) {
k_domainDbDisabled = true;
}
}
else {
k_localData[0] = {
'k_name': kerio.lib.k_tr('Local User Database', 'common'),
'k_domainId': k_id
};
if (k_isUserList) {
k_userListStatus = kerio.waw.status.k_userList;
k_userListStatus.k_localDomainParams = k_domain;
}
}
if (k_id === k_currentDomainId) {
this.k_relatedWidget.k_templateData = k_domain.templateData;
}
}
if (k_domainDbDisabled) {
k_localData = k_localData.slice(0,1); }
k_isDomainUnchanged = k_currentDomainId === k_domainSelect.k_getValue() && 0 < k_domainSelect.k_getValueCount();
k_domainSelect.k_clearData();
k_domainSelect.k_addData(k_localData);
if (k_domainSelect.k_containsValue(k_currentDomainId) && !k_domainDbDisabled) {
k_domainSelect.k_setValue(k_currentDomainId);
}
else {
k_domainSelect.k_setValue(k_LOCAL_USER_DATABASE);
}
k_domainSelect.k_setDisabled(false); if (k_isDomainUnchanged) {
k_query = this._k_createQuery('');
this.k_relatedWidget.k_reloadData(k_query);
}
}});
kerio.waw.shared.k_widgets.K_UserListToolbar = function(k_id, k_config){
var k_localNamespace = k_id + '_';
this._k_localNamespace = k_localNamespace;
kerio.waw.shared.k_widgets.K_UserListToolbar.superclass.constructor.call(this, k_id, k_config);

var k_onChange = function(k_toolbar, k_checkbox, k_hideDisabled){
if (k_toolbar.k_doNothing) {
return;
}
var k_domainId = k_toolbar.k_currentDomainId;
var k_queryParams = k_toolbar._k_createQuery(k_toolbar.k_searchField.k_getValue(), k_hideDisabled);
k_queryParams.domainId = k_domainId;
k_toolbar.k_relatedWidget.k_reloadData(k_queryParams);
k_toolbar.k_currentDomainId = k_domainId;
};
var k_configCheckbox = {
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: kerio.lib.k_tr('Hide disabled user accounts', 'userList'),
k_onChange: k_onChange
};
var k_checkbox = new kerio.lib.K_Checkbox(this._k_localNamespace + 'k_checkbox', k_configCheckbox);
k_checkbox.k_addReferences({
k_parent: this,
k_relatedWidget: this.k_relatedWidget
});
this.k_addWidget(k_checkbox, 2);
this.k_addReferences({
k_doNothing: false,
k_checkbox: k_checkbox
});
};

kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_UserListToolbar', kerio.waw.shared.k_widgets.K_DomainSelectToolbar, {});

kerio.waw.shared.k_widgets.K_TabQuota = function(k_id, k_config){
var
k_localNamespace = k_id + '_',
k_isAuditor = k_config.k_isAuditor || false,
k_tr = kerio.lib.k_tr,
k_isMultiEdit = k_config.k_isMultiEdit,
k_items = [],
k_formCfg,
k_userActionItems,
k_quotaContainer,
k_userAction,
k_notificationElement;
this._k_localNamespace = k_localNamespace;

k_quotaContainer = function(k_config){
var k_FIELDS_WIDTH = 150, k_checkbox, k_direction, k_quota;
k_checkbox = {
k_type: 'k_checkbox',
k_id: k_config.k_id,
k_name: k_config.k_id,
k_option: k_config.k_title,
k_isLabelHidden: true,
k_isChecked: false,

k_onChange: function(k_form, k_element, k_value){
k_form.k_quotaTypeObserver.apply(k_form, arguments);
} };
k_direction = kerio.waw.shared.k_DEFINITIONS.k_get('k_trafficDirectionSelect', {
k_id: k_config.k_id + '_' + 'k_direction',
k_isDisabled: true,
k_width: k_FIELDS_WIDTH,
k_indent: 1
});
k_quota = {
k_type: 'k_row',
k_indent: 1,
k_items: [{
k_type: 'k_number',
k_id: k_config.k_id + '_' + 'k_value',
k_isDisabled: true,
k_width: k_FIELDS_WIDTH,
k_caption: kerio.lib.k_tr('Quota:', 'userEditor'),
k_maxValue: 999999999,
k_maxLength: 9,
k_validator: {
k_allowBlank: false
}
}, kerio.waw.shared.k_DEFINITIONS.k_get('k_byteUnitsSelect', {
k_id: k_config.k_id + '_' + 'k_units',
k_isDisabled: true
})]
};
if (k_config.k_isMultiEdit) {
k_checkbox = kerio.waw.shared.k_methods.k_multiEditorElement(k_checkbox);
}
return [ k_checkbox, k_direction, k_quota ];
}; k_items = k_items.concat(k_quotaContainer({
k_id: 'k_daily',
k_title: k_tr('Enable daily limit', 'userEditor'),
k_isMultiEdit: k_isMultiEdit
}));
k_items = k_items.concat(k_quotaContainer({
k_id: 'k_weekly',
k_title: k_tr('Enable weekly limit', 'userEditor'),
k_isMultiEdit: k_isMultiEdit
}));
k_items = k_items.concat(k_quotaContainer({
k_id: 'k_monthly',
k_title: k_tr('Enable monthly limit', 'userEditor'),
k_isMultiEdit: k_isMultiEdit
}));
k_notificationElement = {
k_type: 'k_checkbox',
k_id: 'k_notifyUser',
k_option: k_tr('Notify user by email when quota is exceeded', 'userEditor')
};
k_userAction = [
{
k_type: 'k_radio',
k_groupId: 'k_blockTraffic',
k_option: k_tr('Block any further traffic', 'userEditor'),
k_value: true
},
{
k_type: 'k_radio',
k_groupId: 'k_blockTraffic',
k_option: k_tr('Don\'t block further traffic', 'userEditor'),
k_value: false,
k_isChecked: true
}
];
if (k_isMultiEdit) {
k_notificationElement = kerio.waw.shared.k_methods.k_multiEditorElement(k_notificationElement);
k_userAction = kerio.waw.shared.k_methods.k_multiEditorElement(k_userAction);
}
k_userActionItems = [
{
k_type: 'k_display',
k_id: 'k_notificationMessage',
k_indent: 1,
k_value: k_tr('(Limit bandwidth according to the Bandwidth Management settings only.)', 'userEditor')
},
k_notificationElement
];
k_userActionItems = k_userAction.concat(k_userActionItems);
k_formCfg = {
k_items: [
{
k_type: 'k_fieldset',
k_id: 'k_quotaContainer',
k_caption: k_tr('Transfer quota', 'userEditor'),
k_items: k_items
},
{
k_type: 'k_fieldset',
k_id: 'k_userAction',
k_caption: k_tr('Exceeded quota action', 'userEditor'),
k_isDisabled: !k_isMultiEdit,k_isLabelHidden: true,
k_items:  k_userActionItems}
] };kerio.waw.shared.k_widgets.K_TabQuota.superclass.constructor.call(this, k_id, k_formCfg);
this.k_addReferences({
k_daily: this.k_getItem('k_daily'),
k_weekly: this.k_getItem('k_weekly'),
k_monthly: this.k_getItem('k_monthly'),
k_isMultiEdit: k_isMultiEdit
});
if (k_isAuditor) {
this.k_setReadOnlyAll();
}
this.k_addControllers(this);
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_TabQuota', kerio.lib.K_Form, {

k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_quotaTypeObserver = function(k_form, k_element, k_enable){
var
k_id = k_element.k_name,
k_elements = [
k_id + '_' + 'k_direction',
k_id + '_' + 'k_value',
k_id + '_' + 'k_units'
],
k_enableAll;
k_enable = true === k_enable;
k_form.k_setDisabled(k_elements, !k_enable);
if (k_form.k_isMultiEdit) {
return;
}
k_enableAll = k_form.k_daily.k_getValue() || k_form.k_weekly.k_getValue() || k_form.k_monthly.k_getValue();
k_form.k_setDisabled(['k_userAction'], !k_enableAll);
};
k_kerioWidget.k_getQuotaData = function(){
var
k_formData = this.k_getData(true),
k_values = {
k_daily: 'daily',
k_weekly: 'weekly',
k_monthly: 'monthly'
},
k_data = {},
k_key, k_value, k_idPrefix;
for (k_value in k_values) {
k_key = k_values[k_value];
k_idPrefix = k_value + '_';
k_data[k_key] = {
'enabled': k_formData[k_value],
'type': k_formData[k_idPrefix + 'k_direction'],
'limit': {
'value': k_formData[k_idPrefix + 'k_value'],
'units': k_formData[k_idPrefix + 'k_units']
} }; } k_data.blockTraffic = k_formData.k_blockTraffic;
k_data.notifyUser = k_formData.k_notifyUser;
return k_data;
};
k_kerioWidget.k_setQuotaData = function(k_data){
var
k_formData = {},
k_values = {
k_daily: 'daily',
k_weekly: 'weekly',
k_monthly: 'monthly'
},
k_valueData, k_valueLimit,
k_key, k_value, k_idPrefix;
for (k_value in k_values) {
k_key = k_values[k_value];
k_idPrefix = k_value + '_';
k_valueData = k_data[k_key];
k_valueLimit = k_valueData.limit;
k_formData[k_value] = k_valueData.enabled;
k_formData[k_idPrefix + 'k_direction'] = k_valueData.type;
k_formData[k_idPrefix + 'k_value'] = k_valueLimit.value;
k_formData[k_idPrefix + 'k_units'] = k_valueLimit.units;
} k_formData.k_blockTraffic = k_data.blockTraffic;
k_formData.k_notifyUser = k_data.notifyUser;
this.k_setData(k_formData, true);
};}});
kerio.waw.shared.k_widgets.K_TabPreferences = function(k_id, k_config){
var
k_localNamespace = k_id + '_',
k_tr = kerio.lib.k_tr,
k_isAuditor = k_config.k_isAuditor || false,
k_multiEditorElement = kerio.waw.shared.k_methods.k_multiEditorElement,
k_isMultiEdit = k_config.k_isMultiEdit,
k_webOptions = [],
k_webOption,
k_languageSelect,
k_i,
k_item,
k_webOptionsDef,
k_formCfg;
this._k_localNamespace = k_localNamespace;
k_webOptionsDef = [
{
k_id: 'javaApplet',
k_option: k_tr('Filter out HTML Java applets', 'userEditor'),
k_value: k_tr('HTML <applet> tags (Java Applet)', 'userEditor')
},
{
k_id: 'embedObject',
k_option: k_tr('Filter out HTML ActiveX objects', 'userEditor'),
k_value: k_tr('Active objects at web pages', 'userEditor')
},
{
k_id: 'script',
k_option: k_tr('Filter out HTML Script tags', 'userEditor'),
k_value: k_tr('HTML <script> tags - commands of scripting languages, such as JavaScript, VBScript, etc.', 'userEditor')
},
{
k_id: 'popup',
k_option: k_tr('Filter out HTML JavaScript pop-up windows', 'userEditor'),
k_value: k_tr('Automatic opening of new browser windows - usually ad pop-up windows', 'userEditor')
},
{
k_id: 'referer',
k_option: k_tr('Filter out cross-domain referer', 'userEditor'),
k_value: k_tr('This option enables/disables the Referer item included in an HTTP header.', 'userEditor')
}
];for (k_i = 0; k_i < k_webOptionsDef.length; k_i++) {
k_item = k_webOptionsDef[k_i];
k_webOption = {
k_type: 'k_checkbox',
k_id: k_item.k_id,
k_option: k_item.k_option
};
if (k_isMultiEdit) {
k_webOption = k_multiEditorElement(k_webOption);
k_webOptions.push(k_webOption);
} else {
k_webOptions.push(k_webOption);
k_webOptions.push(
{
k_type: 'k_display',
k_indent: 1,
k_id: k_item.k_id + 'Caption',
k_value: k_item.k_value
}
);
}
}
k_languageSelect = {
k_type: 'k_select',
k_id: 'language',
k_width: 160,
k_caption: k_tr('Preferred language:', 'userEditor'),
k_localData: kerio.waw.shared.k_methods.k_getLanguageList(true, true),
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_id',
k_fieldIconClassName: 'k_className'
};
if (k_isMultiEdit) {
k_languageSelect = k_multiEditorElement(k_languageSelect);
}
k_formCfg = {
k_items: [{
k_type: 'k_fieldset',
k_id: 'k_webContentContainer',
k_caption: k_tr('Web content scanning options', 'userEditor'),
k_isLabelHidden: true,
k_items: k_webOptions
}, {
k_type: 'k_fieldset',
k_id: 'k_languageContainer',
k_caption: k_tr('Language options', 'userEditor'),
k_labelWidth: 120,
k_items: [
k_languageSelect
]
}]
};kerio.waw.shared.k_widgets.K_TabPreferences.superclass.constructor.call(this, k_id, k_formCfg);
if (k_isAuditor) {
this.k_setReadOnlyAll();
}
this.k_addControllers(this);
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_TabPreferences', kerio.lib.K_Form, {

k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_setPreferencesData = function(k_data){
this.k_setData(k_data.wwwFilter, true);
this.k_setData({
'language': k_data.language
}, true);
};
k_kerioWidget.k_getPreferencesData = function(){
var k_formData = this.k_getData();
var k_data = {
'wwwFilter': {
'javaApplet': k_formData.javaApplet,
'embedObject': k_formData.embedObject,
'script': k_formData.script,
'popup': k_formData.popup,
'referer': k_formData.referer
},
'language': k_formData.language
};
return k_data;
};}});
kerio.waw.shared.k_widgets.K_AddMembershipWidget = function(k_id, k_config){
var
k_localNamespace = k_id + '_',
k_tr = kerio.lib.k_tr,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_userListIds = kerio.waw.shared.k_DEFINITIONS.k_userListIds,
k_TYPES = {
k_DOMAIN_USER_GROUP: 'k_DOMAIN_USER_GROUP',
k_LOCAL_USER: 'k_LOCAL_USER',
k_LOCAL_GROUP: 'k_LOCAL_GROUP',
k_DOMAIN_USER: 'k_DOMAIN_USER',
k_DOMAIN_GROUP: 'k_DOMAIN_GROUP'
},
k_isUserGroupEditor = false,
k_displayDomain = true,k_useGrouping = false, k_widgetDefaults,
k_widgetSettings,
k_membershipToolbarCfg,
k_membershipToolBar,
k_gridCfg,
k_updateMembershipGrid;
this.k_localNamespace = k_localNamespace;
this.k_objectName = k_config.k_objectName;
this.k_isAuditor = k_isAuditor;
k_widgetDefaults = {
k_toolBar: {
k_btnAddCaption: k_tr('Add…', 'common'),
k_btnRemoveCaption: k_tr('Remove', 'common')
},
k_selectItemsObjectName: 'k_selectMembersForRule',
k_selectItemsRoot: 'list',
k_gridClassName: 'noGridHeader',
k_isStateful: false,
k_isFullNameDataOnly: true,
k_isDescriptionDataOnly: true
};
switch (k_config.k_type) {
case k_TYPES.k_LOCAL_GROUP:
k_widgetSettings = {
k_selectItemsObjectName: 'k_selectGroups'
};
k_displayDomain = false;
break;
case k_TYPES.k_LOCAL_USER:
k_widgetSettings = {
k_selectItemsObjectName: 'k_selectUsers'
};
k_displayDomain = false;
break;
case k_TYPES.k_DOMAIN_USER_GROUP:
k_widgetSettings = {
k_selectItemsObjectName: 'k_selectMembersForRule'
};
k_isUserGroupEditor = true;
k_useGrouping = true;
break;
case k_TYPES.k_DOMAIN_GROUP:
k_widgetSettings = {
k_selectItemsObjectName: 'k_selectGroupsFromDomain'
};
break;
case k_TYPES.k_DOMAIN_USER:
k_widgetSettings = {
k_selectItemsObjectName: 'k_selectMembersForReport'
};
break;
}
if (k_config.k_selectItemsObjectName) {
k_widgetSettings.k_selectItemsObjectName = k_config.k_selectItemsObjectName;
}
if (true === k_config.k_isHeader) {
k_widgetSettings = Ext.apply(
{},
{
k_gridClassName: undefined,
k_isStateful: true,
k_isFullNameDataOnly: false,
k_isDescriptionDataOnly: false
},
k_widgetSettings
);
}
k_widgetSettings = Ext.apply({}, k_widgetSettings,k_widgetDefaults);
this.k_widgetSettings = k_widgetSettings;

k_updateMembershipGrid = function(k_sender, k_event){
var
k_events,
k_constEventTypes,
k_constKeyCodes,
k_currentKeyCode,
k_selectionStatus,
k_allowRemove,
k_mainWidget;
if (k_sender instanceof kerio.lib.K_Grid) {
k_events = kerio.lib.k_constants.k_EVENT;
k_constEventTypes = k_events.k_TYPES;
k_constKeyCodes = k_events.k_KEY_CODES;
if (!this.k_relatedWidget.k_isDomainLocal) {
return;
}
k_selectionStatus = k_sender.k_selectionStatus;
k_allowRemove = (0 !== k_selectionStatus.k_selectedRowsCount);if (k_allowRemove && 'k_nobody' === k_selectionStatus.k_rows[0].k_data.id) {
k_allowRemove = false;
}
switch (k_event.k_type) {
case k_constEventTypes.k_SELECTION_CHANGED:
this.k_enableItem('k_btnRemove', k_allowRemove);
break; case k_constEventTypes.k_KEY_PRESSED:
k_currentKeyCode = k_event.k_browserEvent.keyCode;
if (k_allowRemove && ((k_constKeyCodes.k_BACKSPACE === k_currentKeyCode) || (k_constKeyCodes.k_DELETE === k_currentKeyCode))) {
this.k_relatedWidget.k_removeSelectedRows();
k_mainWidget = k_sender.k_getMainWidget();
if (k_mainWidget && k_mainWidget.k_isInstanceOf) {
if (!k_mainWidget.k_isInstanceOf('K_Dialog')) { kerio.adm.k_framework.k_enableApplyReset();
}
}
}
break; }
}
}; if (!k_isAuditor) {
k_membershipToolbarCfg = {
k_update: k_updateMembershipGrid,
k_items: [{
k_caption: k_widgetSettings.k_toolBar.k_btnAddCaption,
k_id: 'k_btnAdd',
k_isReadOnly: k_isAuditor,

k_onClick: function(k_toolbar){
var
k_parentGrid = k_toolbar.k_relatedWidget,
k_TYPES = k_parentGrid.k_TYPES,
k_widgetType = k_parentGrid.k_widgetType,
k_widgetSettings = k_parentGrid.k_widgetSettings,
k_objectName = k_widgetSettings.k_selectItemsObjectName,
k_selectItemsParams;
k_selectItemsParams = {
k_sourceName: 'selectItems',
k_objectName: k_objectName,
k_params: {
k_onlyNew: true,
k_parentGrid: k_parentGrid,
k_autoAdd: false, k_callback: (k_TYPES.k_LOCAL_GROUP === k_widgetType || k_TYPES.k_LOCAL_USER === k_widgetType) ? k_parentGrid.k_addMembers : k_parentGrid.k_addDomainMembers
}
};kerio.lib.k_ui.k_showDialog(k_selectItemsParams);
} }, {
k_caption: k_widgetSettings.k_toolBar.k_btnRemoveCaption,
k_id: 'k_btnRemove',
k_isDisabled: true,
k_mask: false,
k_onClick: function(k_toolbar){
k_toolbar.k_relatedWidget.k_removeSelectedRows();
}
}]
};
k_membershipToolbarCfg.k_hasSharedMenu = true; k_membershipToolBar = new kerio.lib.K_Toolbar(k_localNamespace + 'k_membershipToolbar', k_membershipToolbarCfg);
this.k_membershipToolBar = k_membershipToolBar;
this.k_membershipToolBar.k_localNamespace = k_localNamespace;
} k_gridCfg = {
k_toolbars: {
k_bottom: (k_isAuditor ? undefined : k_membershipToolBar)
},
k_className: k_widgetSettings.k_gridClassName,
k_isStateful: k_widgetSettings.k_isStateful,
k_contextMenu: (k_isAuditor ? undefined : k_membershipToolBar.k_sharedMenu), k_autoExpandColumn: 1,
k_selectionMode: (!k_isAuditor ? 'k_multi' : 'k_none')
};
if (k_TYPES.k_LOCAL_GROUP === k_config.k_type) {
k_gridCfg.k_settingsId = 'userMembershipGrid';
k_gridCfg.k_columns = {
k_items: [{
k_caption: k_tr('Name', 'common'),
k_columnId: 'name',
k_width: 200,

k_renderer: kerio.waw.shared.k_methods.k_renderers.k_renderUserGroupName
}, {
k_caption: k_tr('Description', 'common'),
k_columnId: 'description',
k_isDataOnly: k_widgetSettings.k_isDescriptionDataOnly
}, {
k_caption: 'id',
k_columnId: 'id',
k_isDataOnly: true
}] }; k_gridCfg.k_columns.k_sorting = false;
} else {
k_gridCfg.k_settingsId = 'groupMembersGrid';
k_gridCfg.k_columns = {
k_grouping: (k_useGrouping
? {
k_columnId: 'isGroup',
k_isMemberIndented: true
}
: undefined
),
k_items: [{
k_columnId: 'isGroup',
k_isHidden: true,
k_isKeptHidden: true,

k_groupRenderer: function(k_isGroup) {
return {
k_data: (k_isGroup ? this.k_trGroups : this.k_trUsers)
};
}
}, {
k_columnId: 'id',
k_isDataOnly: true
}, {
k_columnId: 'domainName',
k_isDataOnly: true
}, {
k_caption: (k_isUserGroupEditor ? k_tr('Name', 'common') : k_tr('Username', 'common')),
k_columnId: 'name',

k_renderer: function(k_value, k_data){
var k_referenced;
if ('k_nobody' === k_data.id) {
return {
k_className: 'userNobody',
k_data: kerio.lib.k_tr('Nobody', 'common')
};
}
if ('k_selectUsers' === this.k_widgetSettings.k_selectItemsObjectName) {
if (k_data.isGroup) {
return kerio.waw.shared.k_methods.k_renderers.k_renderUserGroupName(k_value, k_data);
}
return kerio.waw.shared.k_methods.k_renderers.k_renderSimpleUserName(k_value, k_data);
}
k_referenced = kerio.waw.shared.k_methods.k_createReferencedUserName(k_data);
return {
k_data: k_referenced.k_userName,
k_iconCls: k_referenced.k_iconClass,
k_dataTooltip: k_referenced.k_tooltip
};
}}, {
k_caption: k_tr('Full Name', 'common'),
k_columnId: 'fullName',
k_isDataOnly: k_widgetSettings.k_isFullNameDataOnly
}, {
k_caption: k_tr('Description', 'common'),
k_columnId: 'description',
k_isDataOnly: k_widgetSettings.k_isDescriptionDataOnly
}]
}; if (k_displayDomain) {
k_gridCfg.k_settingsId = 'ruleMembersGrid';
k_gridCfg.k_columns.k_items.push({
k_columnId: 'userGroupHash',
k_isDataOnly: true,
k_isSortable: true
});
k_gridCfg.k_columns.k_sorting = {
k_columnId: 'userGroupHash'
};
}
} 
this.k_addControllers(this);
kerio.waw.shared.k_widgets.K_AddMembershipWidget.superclass.constructor.call(this, k_localNamespace + 'membershipGrid', k_gridCfg);
if (!k_isAuditor) {
kerio.lib.k_registerObserver(this, k_membershipToolBar);
}
this.k_addReferences({
k_userListIds: k_userListIds,
k_isDomainLocal: true,
k_domainId: '',
k_toolbar: this.k_toolbars.k_right,
k_GET_USERS_REQUEST_INDEX: 0,
k_GET_GROUPS_REQUEST_INDEX: 1,
memberIds: undefined,
k_TYPES: k_TYPES,
k_widgetType: k_config.k_type,
k_trGroups: k_tr('Groups', 'menuTree'),
k_trUsers:  k_tr('Users', 'menuTree')
});
this.k_setReadOnly(k_isAuditor);
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_AddMembershipWidget', kerio.lib.K_Grid, {

k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_setMembers = function(k_members, k_domainId){
var
k_memberIds = {},
k_member,
k_i, k_cnt;
this.k_isDomainLocal = kerio.waw.status.k_userList.k_isCurrentDomainLocal;
this.k_resetGrid();
if (!this.k_isAuditor) {
this.k_toolbars.k_bottom.k_setReadOnly(!this.k_isDomainLocal);
}
if ((!k_members || Array !== k_members.constructor || k_members.length === 0) || !k_domainId) {
return;
}
this.k_domainId = k_domainId;
k_cnt = k_members.length;
k_memberIds[this.k_GET_USERS_REQUEST_INDEX] = {
k_ids: [],
k_totalItems: 0
};
k_memberIds[this.k_GET_GROUPS_REQUEST_INDEX] = {
k_ids: [],
k_totalItems: 0
};
for (k_i = 0; k_i < k_cnt; k_i++) {
k_member = k_members[k_i];
if (k_member.isGroup) {
k_memberIds[this.k_GET_GROUPS_REQUEST_INDEX].k_totalItems++;
k_memberIds[this.k_GET_GROUPS_REQUEST_INDEX].k_ids[k_member.id] = true;
} else {
k_memberIds[this.k_GET_USERS_REQUEST_INDEX].k_totalItems++;
k_memberIds[this.k_GET_USERS_REQUEST_INDEX].k_ids[k_member.id] = true;
}
}
this.k_memberIds = k_memberIds;
this.k_fillMembersData();
};
k_kerioWidget.k_getMemberIds = function(k_memberList){
var k_members,
k_i, k_cnt,
k_data = [];
if (!k_memberList) {
k_members = this.k_getRowsData();
} else {
k_members = k_memberList;
}
k_cnt = k_members.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_data.push(k_members[k_i].id);
}
return k_data;
};
k_kerioWidget.k_getMembers = function(){
var k_members = this.k_getRowsData();
var k_data = [];
var k_member;
for (var k_i = 0, k_cnt = k_members.length; k_i < k_cnt; k_i++) {
k_member = k_members[k_i];
k_data.push({
id: k_member.id,
name: k_member.name,
isGroup: k_member.isGroup || false,
domainName: k_member.domainName
});
}
return k_data;
};
k_kerioWidget.k_fillMembersData = function() {
var
k_sharedData = kerio.waw.shared.k_data,
k_membersData,
k_totalItems,
k_member,
k_tmp = [],
k_isGroup,
k_members,
k_usersStore,
k_groupsStore,
k_i, k_cnt, k_j, k_cnt2;
k_usersStore = 	k_sharedData.k_get('k_users', false, {k_domainId: this.k_domainId});
k_groupsStore = k_sharedData.k_get('k_groups', false, {k_domainId: this.k_domainId});
if (!k_usersStore.k_isLoaded() || !k_groupsStore.k_isLoaded()) {
k_sharedData.k_registerObserver(
k_usersStore,
function() {
if (!kerio.waw.shared.k_data.k_get('k_groups', false, {k_domainId: this.k_domainId}).k_isLoaded()) {
return;
}
this.k_fillMembersData();
},
this
);
k_sharedData.k_registerObserver(
k_groupsStore,
function() {
if (!kerio.waw.shared.k_data.k_get('k_users', false, {k_domainId: this.k_domainId}).k_isLoaded()) {
return;
}
this.k_fillMembersData();
},
this
);
return;
}
k_membersData = [];
k_membersData[this.k_GET_USERS_REQUEST_INDEX] = k_usersStore.k_getData();
k_membersData[this.k_GET_GROUPS_REQUEST_INDEX] = k_groupsStore.k_getData();
this._k_extSelectionModel.locked = !this.k_isDomainLocal;if (!this.k_isAuditor) {
this.k_membershipToolBar.k_enableItem('k_btnRemove', false);
}
for (k_i = 0, k_cnt = k_membersData.length; k_i < k_cnt; k_i++) {
k_members = k_membersData[k_i];
k_isGroup = this.k_GET_GROUPS_REQUEST_INDEX === k_i;
k_totalItems = this.k_memberIds[k_i].k_totalItems;
for (k_j = 0, k_cnt2 = k_members.length; k_j < k_cnt2; k_j++) {
k_member = k_members[k_j];
if (0 === k_totalItems) {
break;
}
if (!this.k_memberIds[k_i].k_ids[k_member.id]) {
continue;
}
k_totalItems--;
if (!k_isGroup) {
k_tmp.push({
id: k_member.id,
name: k_member.credentials.userName,
isGroup: k_isGroup,
fullName: k_member.fullName,
description: k_member.description
});
}
else {
k_tmp.push({
id: k_member.id,
name: k_member.name,
isGroup: k_isGroup,
fullName: '',
description: k_member.description
});
}
}
}
this.k_setGridData(k_tmp);
};
k_kerioWidget.k_setGridData = function(k_data){
if (k_data && k_data.length !== 0) {
this.k_setData(k_data);
}
else {
this.k_clearData();
}
};
k_kerioWidget.k_addMembers = function(k_newMembersIds, k_allMembers, k_returnData){
var
k_currentMembers = this.k_getRowsData(),
k_gridData = [],
k_selectId,
k_member,
k_memberId,
k_i, k_cnt,
k_j, k_cnt2,
k_index;
if (!k_returnData && k_newMembersIds && 0 < k_newMembersIds.length) {
k_selectId = k_newMembersIds[0];
}
k_newMembersIds = k_newMembersIds || [];
k_allMembers = k_allMembers || [];
for (k_i = 0, k_cnt = k_currentMembers.length; k_i < k_cnt; k_i++) {
k_newMembersIds.push(k_currentMembers[k_i].id);
}
for (k_i = 0, k_cnt = k_allMembers.length; k_i < k_cnt; k_i++) {
k_memberId = k_allMembers[k_i].id;
for (k_j = 0, k_cnt2 = k_newMembersIds.length; k_j < k_cnt2; k_j++) {
if (k_newMembersIds[k_j] === k_memberId) {
k_member = k_allMembers[k_i];
k_gridData.push(this.k_createRowData(k_member));
delete k_newMembersIds[k_j];
break;
}
}
if (k_newMembersIds.length === 0) {
break;
}
}
if (k_returnData) {
return k_gridData;
}
this.k_setGridData(k_gridData);
if (k_selectId) {
k_index = this.k_findRow('id', k_selectId);
if (-1 !== k_index) {
this.k_selectRows(k_index);
}
}
}; 
k_kerioWidget.k_addDomainMembers = function(k_newMembersIds, k_allMembers) {
var
k_currentMembers = this.k_getRowsData(),
k_tmpGridData = this.k_addMembers(k_newMembersIds, k_allMembers, true),
k_members = k_tmpGridData.concat(k_currentMembers),k_membersToGrid = [],
k_member, k_duplUser = [],
k_duplGroup = [],
k_selectId,
k_index,
k_i, k_cnt,
k_id;
if (k_newMembersIds && 0 < k_newMembersIds.length) {
k_selectId = k_newMembersIds[0];
}
for (k_i = 0, k_cnt = k_members.length; k_i < k_cnt; k_i++) {
k_member = k_members[k_i];
k_id = k_member.id;
if ('k_nobody' === k_id) {
continue;
}
k_member.userGroupHash = (k_member.isGroup ? 0 : 1) + k_member.name.toLocaleLowerCase() + k_member.domainName.toLocaleLowerCase();
if (true === k_member.isGroup && !k_duplGroup[k_id]) {
k_duplGroup[k_id] = k_member.name;
k_membersToGrid.push(k_member);
}
if (false === k_member.isGroup && !k_duplUser[k_id]) {
k_duplUser[k_id] = k_member.name;
k_membersToGrid.push(k_member);
}
}
this.k_setGridData(k_membersToGrid);
if (k_selectId) {
k_index = this.k_findRow('id', k_selectId);
if (-1 !== k_index) {
this.k_selectRows(k_index);
}
}
};

k_kerioWidget.k_createRowData = function(k_data) {
if (!k_data) {
return {};
}
var
k_returnObject,
k_TYPES = this.k_TYPES;
switch (this.k_widgetType) {
case k_TYPES.k_LOCAL_USER:
k_returnObject = {
id: k_data.id,
name: k_data.credentials.userName,
fullName: k_data.fullName,
description: k_data.description
};
break;
case k_TYPES.k_LOCAL_GROUP:
k_returnObject = {
id: k_data.id,
name: k_data.name,
description: k_data.description
};
break;
default:
k_returnObject = {
id: k_data.id,
name: k_data.name,
description: k_data.description,
fullName: k_data.fullName,
isGroup: k_data.isGroup,
domainName: k_data.domainName
};
break;
}
return k_returnObject;
};

k_kerioWidget.k_setReadOnlyAll = k_kerioWidget.k_setReadOnly;
} });
kerio.waw.shared.k_widgets.K_CustomRoutesGrid = function(k_config){
var
k_localNamespace = k_config.k_localNamespace,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isAuditor = k_config.k_isAuditor,
k_customRoutesGridUpdate,
k_customRoutesToolbar, k_customRoutesToolbarCfg,
k_customRoutesGridCfg;

k_customRoutesGridUpdate = function(k_sender, k_event){
var
k_events,
k_constEventTypes,
k_constKeyCodes,
k_currentKeyCode,
k_selectedRowsCount;
if (k_sender instanceof kerio.lib.K_Grid) {
k_events = kerio.lib.k_constants.k_EVENT;
k_constEventTypes = k_events.k_TYPES;
k_constKeyCodes = k_events.k_KEY_CODES;
switch (k_event.k_type) {
case k_constEventTypes.k_SELECTION_CHANGED:
k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount;
this.k_enableItem('k_btnRemove', (0 !== k_selectedRowsCount));
this.k_enableItem('k_btnEdit', (1 === k_selectedRowsCount));
break; case k_constEventTypes.k_KEY_PRESSED:
k_currentKeyCode = k_event.k_browserEvent.keyCode;
if ((k_constKeyCodes.k_BACKSPACE === k_currentKeyCode) || (k_constKeyCodes.k_DELETE === k_currentKeyCode)) {
this.k_relatedWidget.k_removeSelectedRows();
}
break; }
}
};k_customRoutesToolbarCfg = {
k_update: k_customRoutesGridUpdate,
k_items: [{
k_caption: k_tr('Add…', 'common'),
k_id: 'k_btnAdd',
k_isDisabled: k_isAuditor,

k_onClick: function(k_toolbar){
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'routeEditor',
k_objectName: 'k_routeAdd',
k_params: {
k_parentGrid: k_toolbar.k_relatedWidget
}
});
}}, {
k_caption: k_tr('Edit…', 'common'),
k_id: 'k_btnEdit',
k_isDisabled: true,
k_onClick: this._k_editRoute
}, {
k_caption: k_tr('Remove', 'common'),
k_id: 'k_btnRemove',
k_isDisabled: true,

k_onClick: function(k_toolbar){
k_toolbar.k_relatedWidget.k_removeSelectedRows();
}}]
};k_customRoutesToolbar = (k_isAuditor ? undefined : new kerio.lib.K_Toolbar(k_localNamespace + 'k_customRoutesToolbar', k_customRoutesToolbarCfg));
k_customRoutesGridCfg = {
k_toolbars: {
k_bottom: k_customRoutesToolbar
},
k_autoExpandColumn: 1,
k_onDblClick: this._k_editRoute,
k_columns: {
k_sorting: {
k_columnId: 'network',
k_isAscending: true
},
k_items: [
{
k_caption: k_tr('Network', 'common'),
k_columnId: 'network',
k_width: 120,
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'enabled'
}
}, {
k_caption: k_tr('Mask', 'common'),
k_columnId: 'mask'
}, {
k_caption: k_tr('Description', 'common'),
k_columnId: 'description'
}, {
k_columnId: 'enabled',
k_isDataOnly: true
}, {
k_columnId: 'id',
k_isDataOnly: true
}]
}
};if (k_isAuditor) {
k_customRoutesGridCfg.k_isReadOnly = true;
k_customRoutesGridCfg.k_onDblClick = undefined;
}
if (k_config.k_simpleTextAboveGrid) {
k_customRoutesGridCfg.k_className = 'gridWithSimpleTextAbove';
k_customRoutesGridCfg.k_title = k_config.k_simpleTextAboveGrid;
}
this._k_isSnapshot = false;
kerio.waw.shared.k_widgets.K_CustomRoutesGrid.superclass.constructor.call(this, k_localNamespace + 'customRoutesGrid', k_customRoutesGridCfg);
if (!k_isAuditor) {
kerio.lib.k_registerObserver(this, k_customRoutesToolbar);
}
};

kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_CustomRoutesGrid', kerio.lib.K_Grid, {

_k_editRoute: function(){
var k_grid;
if (this instanceof kerio.lib.K_Grid) {
k_grid = this;
}
else {
k_grid = this.k_relatedWidget;
}
if (0 === k_grid.k_selectionStatus.k_selectedRowsCount) {
return;
}
var k_selectedRowProperties = k_grid.k_selectionStatus.k_rows[0];
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'routeEditor',
k_objectName: 'k_routeEdit',
k_params: {
k_parentGrid: k_grid,
k_data: k_selectedRowProperties.k_data
}
});
}, 
k_reset: function() {
this.k_stopTracing();
this.k_setData([]);
}
});

kerio.waw.shared.k_widgets.K_HistogramPane = function(k_id, k_config){
var
k_localNamespace = k_id + '_',
k_tr = kerio.lib.k_tr,
k_canvasId = k_localNamespace + 'k_graphArea',
k_legendId = k_localNamespace + 'k_legend',
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_webSharedConstants = k_CONSTANTS.kerio_web_SharedConstants,
k_DATE_TIME_FORMATS = k_CONSTANTS.k_DATE_TIME_FORMATS,
k_HISTOGRAM_TWO_HOURS = k_webSharedConstants.kerio_web_HistogramTwoHours,
k_HISTOGRAM_ONE_DAY = k_webSharedConstants.kerio_web_HistogramOneDay,
k_HISTOGRAM_ONE_WEEK = k_webSharedConstants.kerio_web_HistogramOneWeek,
k_HISTOGRAM_ONE_MONTH = k_webSharedConstants.kerio_web_HistogramOneMonth,
k_manager = k_config.k_manager,
k_histogramType = kerio.waw.status.k_userSettings.k_get(k_id + '.' + 'type', k_HISTOGRAM_TWO_HOURS),
k_histogramTypes = [],
k_titleTemplateElement,
k_batchRequests = [],
k_INDEX_GET_SERVER_TIME = 0,
k_INDEX_GET_GRAPH_DATA = 1,
k_formCfg;
k_batchRequests[k_INDEX_GET_SERVER_TIME] = { method: 'SystemConfig.getDateTime' };
k_batchRequests[k_INDEX_GET_GRAPH_DATA] = {
method: k_manager + '.getHistogram',
params: {id: '1', type: k_histogramType}
};
k_formCfg = {
k_items: [
{
k_type: 'k_display',
k_id: 'k_textSelectInterface',
k_isLabelHidden: true,
k_value: k_config.k_promptToSelect
},
{
k_type: 'k_display',
k_id: 'k_textMultiselect',
k_isLabelHidden: true,
k_isHidden: true,
k_value: k_config.k_promptMultiselect || kerio.lib.k_tr('Please select just one item to display its histogram.', 'common')
},
{
k_type: 'k_container',
k_labelWidth: 130,
k_items: [
{
k_type: 'k_select',
k_id: 'k_histogramType',
k_isVisible: false,
k_width: 180,
k_caption: k_tr('Time interval:', 'activeHostsList'),
k_localData: [
{value: k_HISTOGRAM_TWO_HOURS, name: k_tr('2 hours', 'systemHealth')},
{value: k_HISTOGRAM_ONE_DAY,   name: k_tr('1 day', 'systemHealth')},
{value: k_HISTOGRAM_ONE_WEEK,  name: k_tr('1 week', 'systemHealth')},
{value: k_HISTOGRAM_ONE_MONTH, name: k_tr('1 month', 'systemHealth')}
],
k_value: k_histogramType,

k_onChange: function(k_form, k_item, k_value) {
kerio.waw.status.k_userSettings.k_set(k_form._k_objectName + '.' + 'type', k_value);
k_form._k_getData(k_value);
}}
]},
{
k_type: 'k_display',
k_id: 'k_textDeadInterface',
k_isLabelHidden: true,
k_isHidden: true,
k_value: k_config.k_promptToNoData || kerio.lib.k_tr('There are no data for the selected item.', 'common')
},
{
k_type: 'k_display',
k_id: 'k_title',
k_isLabelHidden: true,
k_isHidden: true
},
{
k_type: 'k_container',
k_className: 'ext4Charts',
k_id: 'k_container',
k_content: '',
k_isResizeableVertically: true
}
]};k_titleTemplateElement = new Ext.XTemplate(
k_tr(
'%1 - %2, traffic since %3',
'activeHostsList',
{k_args: [
'{k_dataFor}', '{k_intervalCaption}', '{k_intervalStart}'
],
k_isSecure: true})
);k_histogramTypes[k_HISTOGRAM_TWO_HOURS] = {
k_caption: k_tr('20-second intervals', 'activeHostsList'),
k_format: k_DATE_TIME_FORMATS.k_TIME_SEC,
k_unit: 'k_minute',
k_step: 5,
k_interval: 20, k_wholeTime: 7200000 };
k_histogramTypes[k_HISTOGRAM_ONE_DAY] = {
k_caption: k_tr('5-minute intervals', 'activeHostsList'),
k_format: k_DATE_TIME_FORMATS.k_TIME,
k_unit: 'k_hour',
k_step: 1,
k_interval: 300, k_wholeTime: 86400000 };
k_histogramTypes[k_HISTOGRAM_ONE_WEEK] = {
k_caption: k_tr('30-minute intervals', 'activeHostsList'),
k_format: k_DATE_TIME_FORMATS.k_DATE,
k_unit: 'k_day',
k_step: 1,
k_interval: 1800, k_wholeTime: 604800000 };
k_histogramTypes[k_HISTOGRAM_ONE_MONTH] = {
k_caption: k_tr('2-hour intervals', 'activeHostsList'),
k_format: k_DATE_TIME_FORMATS.k_DATE,
k_unit: 'k_day',
k_step: 1,
k_interval: 7200, k_wholeTime: 2678400000 };
k_shared.k_widgets.K_HistogramPane.superclass.constructor.call(this, k_id, k_formCfg);
this.k_addReferences({
k_charts: {
k_canvas: null,
k_files: [],
k_fileId: 0
},
_k_isInboundVisible: true,
_k_isOutboundVisible: true,
_k_manager: k_config.k_manager,
_k_graphContainer: this.k_getItem('k_container'),
_k_graph: undefined,
_k_graphData: {},
_k_objectName: k_id,
_k_canvasId: k_canvasId,
_k_legendId: k_legendId,
_k_titleTemplateElement: k_titleTemplateElement,
_k_histogramType: k_histogramType,
_k_histogramTypes: k_histogramTypes,
_k_translations: {
k_incoming: k_tr('Incoming', 'activeHostsList'),
k_outgoing: k_tr('Outgoing', 'activeHostsList'),
k_current:  k_tr('Current:', 'activeHostsList'),
k_average:  k_tr('Average:', 'activeHostsList'),
k_maximum:  k_tr('Maximum:', 'activeHostsList'),
k_space:    k_tr('%1 %2', 'common', {k_args: ['', '']}),
k_comma:    k_tr('%1, %2', 'common', {k_args: ['', '']})
},
k_BYTE_UNITS_MAPPED: k_shared.k_DEFINITIONS.k_BYTE_UNITS_MAPPED,
_k_formatNumber: k_shared.k_methods.k_formatNumber,
_k_titleElement: this.k_getItem('k_title'),
_k_graphWidth: 0,
_k_batchRequests: k_batchRequests,
_k_batchParam: {
k_requests: k_batchRequests,
k_scope: this,
k_callback: this._k_drawData,
k_mask: false,
k_onError: k_config.k_onErrorLoadingHistogram  },
k_INDEX_GET_SERVER_TIME: k_INDEX_GET_SERVER_TIME,
k_INDEX_GET_GRAPH_DATA: k_INDEX_GET_GRAPH_DATA,
k_HISTOGRAM_ONE_DAY: k_HISTOGRAM_ONE_DAY,
_k_getDataForCaption: k_config.k_getDataForCaption,
_k_dataForCaption: '',
_k_relatedGrid: k_config.k_relatedGrid,
k_gridHosts: k_config.k_relatedGrid,  _k_hostId: undefined
});
};kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_HistogramPane', kerio.lib.K_Form, {

k_loadData: function(k_hostId) {
if (this._k_hostId === k_hostId && this._k_loadingInProgress) { return;
}
this._k_hostId = k_hostId;
this._k_loadingInProgress = true;
if (!kerio.lib.K_TimeChart) {
kerio.waw.shared.k_methods.k_maskMainScreen(this);
this._k_isLoadMask = true;
this._k_loadLibraryFiles();
} else {
this._k_getData();
}
},
_k_loadLibraryFiles: function(){
if (kerio.lib.K_TimeChart) {
this.k_charts.k_files = []; this._k_getData();
return;
}
if (!this.k_charts.k_files.length) {
this.k_charts.k_files = [
'weblib/int/graph/BaseComponent4.js?v=8629',
'weblib/int/graph/DataStore4.js?v=8629',
'weblib/int/graph/BaseChart.js?v=8629',
'weblib/int/graph/LineChart.js?v=8629',
'weblib/int/graph/TimeChart.js?v=8629'
];
kerio.lib.k_loadCss('weblib/ext/sandbox/ext-sandbox.css', true);
}
kerio.lib.k_ajax.k_request({
k_url: this.k_charts.k_files[this.k_charts.k_fileId],
k_method: 'GET',

k_callback: function (k_response) {
try {
eval(k_response.k_xhrResponse.responseText);
}
catch (k_err) {
kerio.lib.k_reportError('Internal error: Error during file loading ' + this.k_charts.k_files[this.k_charts.k_fileId], 'systemHealth');
}
this.k_charts.k_fileId++;
this._k_loadLibraryFiles();
}, k_scope: this
});
},
_k_getData: function(k_histogramType){
var
k_batchRequests = this._k_batchRequests,
k_params;
if (undefined === k_histogramType) {
k_histogramType = this._k_histogramType;
}
this._k_histogramType = k_histogramType;
k_params = k_batchRequests[this.k_INDEX_GET_GRAPH_DATA].params;
k_params.type = k_histogramType;
k_params.id = this._k_hostId;
kerio.waw.shared.k_methods.k_sendBatch(this._k_batchParam);
},

_k_drawData: function(k_response){
var
k_graph = this.k_charts.k_canvas,
k_translations = this._k_translations,
k_formatNumber = this._k_formatNumber,
k_data,k_samples,
k_chartCfg;
if (!k_response || !k_response.k_isOk) {
this.k_setVisible(['k_textSelectInterface'], true);
this.k_setVisible(['k_histogramType', 'k_container', 'k_textDeadInterface', 'k_title'], false);
if (this._k_isLoadMask) {
this._k_isLoadMask = false;
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
}
this._k_loadingInProgress = false;
return;
}
this.k_setVisible(['k_textSelectInterface', 'k_textDeadInterface', 'k_title'], false);
this.k_setVisible(['k_histogramType', 'k_container'], true);
k_data = k_response.k_decoded.batchResult;
k_samples = this._k_processData(k_data[this.k_INDEX_GET_SERVER_TIME].config, k_data[this.k_INDEX_GET_GRAPH_DATA].hist);
this._k_samples = k_samples;
if (!k_samples.k_data.length) { this.k_setVisible(['k_textDeadInterface'], true);
this.k_setVisible(['k_container', 'k_textSelectInterface', 'k_title'], false);
if (this._k_isLoadMask) {
this._k_isLoadMask = false;
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
}
this._k_loadingInProgress = false;
return;
}
if (!k_graph) {
k_chartCfg = {
k_container: this._k_graphContainer,
k_xAxis: {
k_fieldId: 'time',
k_renderer: function(k_value, k_data) {
if (!this.k_extWidget) {
return {k_data: ''};
}
if (k_value === k_data[0].time) {
return { k_data: kerio.lib.k_tr('Now', 'common') };
}
var
k_date = new Date(k_value),
k_format = this.k_relatedWidget.k_currentIntervalSettings.k_format,
k_time = k_date.format(k_format);
return {
k_data: k_time
};
}
},
k_yAxis: {
k_minValue: 0,
k_maxValue: k_samples.k_max,
k_ticks: kerio.waw.shared.k_CONSTANTS.k_CHART_TICKS_COUNT.k_TRAFFIC,
k_renderer: function(k_value) {
if (!this.k_relatedWidget) {
return { k_data: ''};
}
return kerio.waw.shared.k_methods.k_trafficChartRenderer(k_value, this.k_relatedWidget._k_samples.k_max, this.k_relatedWidget.k_data.k_units);
}
},
k_series: [
{
k_fieldId: 'inbound',
k_color: 0,
k_label: k_translations.k_incoming,
k_renderer: function(k_xValue, k_yValue, k_data) {
if (!this.k_relatedWidget) {
return { k_data: ''};
}
var
k_samples = this.k_relatedWidget._k_samples,
k_date = new Date(k_xValue),
k_day = k_date.format(kerio.waw.shared.k_CONSTANTS.k_DATE_TIME_FORMATS.k_DATE),
k_time = k_date.format(kerio.waw.shared.k_CONSTANTS.k_DATE_TIME_FORMATS.k_TIME_SEC),
k_formatDataUnits = kerio.waw.shared.k_methods.k_formatDataUnits;
return {
k_data: kerio.lib.k_tr('Date: %1', 'common', { k_args: [k_day]})
+ '<br />'
+ kerio.lib.k_tr('Time: %1', 'common', { k_args: [k_time]})
+ '<br />'
+ kerio.lib.k_tr('Incoming: %1', 'common', { k_args: [
k_formatDataUnits({ k_value: k_data.inbound, k_units: k_samples.k_units }).k_string
]})
+ '<br />'
+ kerio.lib.k_tr('Outgoing: %1', 'common', { k_args: [
k_formatDataUnits({ k_value: k_data.outbound, k_units: k_samples.k_units }).k_string
]})
,
k_height: 70,
k_width: 250
};
}
},
{
k_fieldId: 'outbound',
k_color: 1,
k_label: k_translations.k_outgoing,
k_renderer: function(k_xValue, k_yValue, k_data) {
if (!this.k_relatedWidget) {
return { k_data: ''};
}
var
k_samples = this.k_relatedWidget._k_samples,
k_date = new Date(k_xValue),
k_day = k_date.format(kerio.waw.shared.k_CONSTANTS.k_DATE_TIME_FORMATS.k_DATE),
k_time = k_date.format(kerio.waw.shared.k_CONSTANTS.k_DATE_TIME_FORMATS.k_TIME_SEC),
k_formatDataUnits = kerio.waw.shared.k_methods.k_formatDataUnits;
return {
k_data: kerio.lib.k_tr('Date: %1', 'common', { k_args: [k_day]})
+ '<br />'
+ kerio.lib.k_tr('Time: %1', 'common', { k_args: [k_time]})
+ '<br />'
+ kerio.lib.k_tr('Incoming: %1', 'common', { k_args: [
k_formatDataUnits({ k_value: k_data.inbound, k_units: k_samples.k_units }).k_string
]})
+ '<br />'
+ kerio.lib.k_tr('Outgoing: %1', 'common', { k_args: [
k_formatDataUnits({ k_value: k_data.outbound, k_units: k_samples.k_units }).k_string
]})
,
k_height: 70,
k_width: 250
};
}
}
],
k_legend: true,
k_onSerieShow: function(k_serie) {
var
k_histogram = this.k_relatedWidget,
k_max;
k_max = k_histogram._k_getNewMaxY(k_serie, true);
if (k_max) {
this.k_setAxes.defer(10, this, [{ k_yMaxValue: k_max, k_refresh: true }]);
return false; }
},
k_onSerieHide: function(k_serie) {
var
k_histogram = this.k_relatedWidget,
k_max;
k_max = k_histogram._k_getNewMaxY(k_serie, false);
if (k_max) {
this.k_setAxes.defer(10, this, [{ k_yMaxValue: k_max, k_refresh: true }]);
return false; }
}
}; k_graph = new kerio.lib.K_TimeChart(this.k_id + '_' + 'k_chart', k_chartCfg);
k_graph.k_relatedWidget = this;
this.k_charts.k_canvas = k_graph;
} if (k_samples.k_units === kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Bytes && 10 > k_samples.k_max) {
k_samples.k_max = 10; }
k_graph.k_setAxes({
k_yMaxValue: k_samples.k_max
});
k_chartCfg = {
k_unit: this.k_currentIntervalSettings.k_unit,
k_step: this.k_currentIntervalSettings.k_step,
k_maxValue: k_samples.k_endTime,
k_minValue: k_samples.k_startTime
};
k_graph.k_setTimeAxis(k_chartCfg);
k_graph.k_setSerieLabel('inbound', k_translations.k_incoming
+ ' ('
+ [
[k_translations.k_average, k_formatNumber(k_samples.k_avgIn), k_samples.k_unitsTr].join(k_translations.k_space),
[k_translations.k_maximum, k_formatNumber(k_samples.k_maxIn), k_samples.k_unitsTr].join(k_translations.k_space)
].join(k_translations.k_comma) + ')'
);
k_graph.k_setSerieLabel('outbound', k_translations.k_outgoing
+ ' ('
+ [
[k_translations.k_average, k_formatNumber(k_samples.k_avgOut), k_samples.k_unitsTr].join(k_translations.k_space),
[k_translations.k_maximum, k_formatNumber(k_samples.k_maxOut), k_samples.k_unitsTr].join(k_translations.k_space)
].join(k_translations.k_comma) + ')'
);
this.k_data = k_samples;
k_graph.k_setData(k_samples.k_data);
k_graph.k_syncSize(); this._k_titleElement.k_setSecureValue(this._k_titleTemplateElement.apply({
k_dataFor: this._k_getDataForCaption(),
k_intervalCaption: this._k_histogramTypes[this._k_histogramType].k_caption,
k_intervalStart: kerio.waw.shared.k_methods.k_formatDateTime(k_samples.k_startTime/1000)
}));
if (this._k_isLoadMask) {
this._k_isLoadMask = false;
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
}
this._k_loadingInProgress = false;
},
k_getMaxY: kerio.waw.shared.k_methods.k_charts.k_getMaxY,

_k_processData: function(k_endTime, k_data) {
var
k_out = {
k_endTime: 0,
k_startTime: 0,
k_data: [],
k_avgIn: 0,
k_avgOut: 0,
k_maxIn: 0,
k_maxOut: 0,
k_max: 1024,
k_units: null,
k_unitsTr: null
},
k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_UNITS = k_DEFINITIONS.k_BYTE_UNITS_MAPPED,
k_BYTE_TO_BITE_MAPPED = k_DEFINITIONS.k_BYTE_TO_BITE_MAPPED,
k_DATA_UNITS_ORDERED = k_DEFINITIONS.k_DATA_UNITS_ORDERED,
k_TIME_UNITS_SETTINGS = kerio.waw.shared.k_CONSTANTS.k_TIME_UNITS_SETTINGS,
k_date = k_endTime.date,
k_time = k_endTime.time,
k_max = [],
k_bytesToBitesModificator = 1,
k_interval,
k_i, k_cnt,
k_unitIndex;
if (k_TIME_UNITS_SETTINGS.k_BITE_PER_SECOND === kerio.waw.status.k_userSettings.k_get('timeUnits', k_TIME_UNITS_SETTINGS.k_BYTE_PER_SECOND)) {
k_unitIndex = k_DATA_UNITS_ORDERED.indexOf(k_data.units);
k_bytesToBitesModificator = 8;
if ((k_data.maxIn * 8) / 1024 > 1 || (k_data.maxOut * 8) / 1024 > 1) {
k_bytesToBitesModificator /= 1024;
k_unitIndex++;
}
k_out.k_units = k_BYTE_TO_BITE_MAPPED[k_DATA_UNITS_ORDERED[k_unitIndex]];
k_out.k_unitsTr = k_UNITS[k_out.k_units];
k_out.k_maxIn = k_data.maxIn * k_bytesToBitesModificator;
k_out.k_maxOut = k_data.maxOut * k_bytesToBitesModificator;
k_out.k_avgIn = k_data.averageIn * k_bytesToBitesModificator;
k_out.k_avgOut = k_data.averageOut * k_bytesToBitesModificator;
}
else {
k_out.k_units = k_data.units;
k_out.k_unitsTr = k_UNITS[k_data.units];
k_out.k_maxIn = k_data.maxIn;
k_out.k_maxOut = k_data.maxOut;
k_out.k_avgIn = k_data.averageIn;
k_out.k_avgOut = k_data.averageOut;
}
if (this._k_isInboundVisible) {
k_max.push(k_out.k_maxIn);
}
if (this._k_isOutboundVisible) {
k_max.push(k_out.k_maxOut);
}
if (!k_max.length) {
k_max = this._k_lastMaxY ? [this._k_lastMaxY] : [k_out.k_maxIn, k_out.k_maxOut]; }
k_out.k_max = this.k_getMaxY(k_max);
this.k_currentIntervalSettings = this._k_histogramTypes[this._k_histogramType];
k_interval = this.k_currentIntervalSettings.k_interval;
k_endTime = new Date(k_date.year, k_date.month, k_date.day, k_time.hour, k_time.min, k_time.sec);
k_endTime = Math.floor(k_endTime / k_interval) * k_interval; k_out.k_endTime = k_endTime;
k_out.k_startTime = k_endTime - this.k_currentIntervalSettings.k_wholeTime;
for (k_i = 0, k_cnt = k_data.data.length; k_i < k_cnt; k_i++) {
k_out.k_data.push({
time: k_endTime - (k_i*k_interval*1000),
inbound: k_data.data[k_i].inbound * k_bytesToBitesModificator,
outbound: k_data.data[k_i].outbound * k_bytesToBitesModificator
});
}
return k_out;
}, 
_k_getNewMaxY: function(k_serie, k_show) {
var k_max = [];
if ('inbound' === k_serie) {
this._k_isInboundVisible = k_show;
}
else if ('outbound' === k_serie) {
this._k_isOutboundVisible = k_show;
}
if (this._k_isInboundVisible) {
k_max.push(this.k_data.k_maxIn);
}
if (this._k_isOutboundVisible) {
k_max.push(this.k_data.k_maxOut);
}
if (!k_max.length) {
return null; }
k_max = Math.max.apply(Math, k_max); k_max = this.k_getMaxY(k_max);
if (k_max !== this.k_data.k_max) {
this.k_data.k_max = k_max;
return k_max;
}
return null;
}
});
kerio.waw.shared.k_widgets.K_BoxConnections = function(k_id){
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_boxModel = k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.boxEdition,
k_boxTypes = k_CONSTANTS, k_rowClasses = [],
k_curveT = 'curve_t',
k_curveL = 'curve_l',
k_lineH = 'line_h',
k_lineV = 'line_v',
k_portNumber = 'portNumber',
k_spacer = 'spacer',
k_bigSpacer = 'bigSpacer',
k_bigHeight = 'bigHeight',
k_longLine = k_lineV + ' ' + k_bigHeight,
k_isSmallBox = false,
k_template,
k_generateRow,
k_generatedRows,
k_labels,
k_class;

k_generateRow = function(k_classes, k_values) {
var
k_cells = [],
k_value,
k_i;
k_values = k_values || [];
k_classes = k_classes || [];
for (k_i = 0; k_i < k_classes.length; k_i++) {
if (k_values[k_i]) {
k_value = k_values[k_i];
} else {
k_value = '';
}
if ('' !== k_classes[k_i]) {
k_cells.push('<td class="' + k_classes[k_i] + '">' + k_value + '</td>');
} else {
k_cells.push('<td>' + k_value + '</td>');
}
}
return '<tr>' + k_cells.join('') + '</tr>';
};k_labels =
'<table border="0" cellpadding="0" cellspacing="0" class="labels">' +
k_generateRow([''], ['{k_label1}']) + k_generateRow([''], ['{k_label2}']) + k_generateRow([''], ['{k_label3}']) +
'</table>';
switch (k_boxModel) {
case k_boxTypes.bigBox1:
case k_boxTypes.bigBox2:
case k_boxTypes.bigBox3:
k_class = 'box8';
k_rowClasses[2] = {
k_row1_class1: '', k_row1_class2: '', k_row1_class3: '', k_row1_class4: '',
k_row1_class5: k_spacer,
k_row1_class6: '', k_row1_class7: '', k_row1_class8: '', k_row1_class9: '',
k_row2_class2: k_curveT, k_row2_class3: k_curveT, k_row2_class4: k_curveT,
k_row2_class5: k_spacer + ' ' + k_lineH,
k_row2_class6: k_curveT, k_row2_class7: k_curveT, k_row2_class8: k_curveT, k_row2_class9: k_curveL
};
k_rowClasses[3] = {
k_row1_class1: k_lineH, k_row1_class2: k_lineH, k_row1_class3: k_curveT, k_row1_class4: k_curveT,
k_row1_class5: k_spacer + ' ' + k_lineH,
k_row1_class6: k_curveT, k_row1_class7: k_curveT, k_row1_class8: k_curveT, k_row1_class9: k_curveL,
k_row2_class2: k_curveL, k_row2_class3: k_lineV, k_row2_class4: k_lineV,
k_row2_class5: k_spacer,
k_row2_class6: k_lineV, k_row2_class7: k_lineV, k_row2_class8: k_lineV, k_row2_class9: k_lineV
};
k_generatedRows = '' +
k_generateRow(
[
'{k_row1_class1}', '{k_row1_class2}', '{k_row1_class3}', '{k_row1_class4}',
'{k_row1_class5}',
'{k_row1_class6}', '{k_row1_class7}', '{k_row1_class8}', '{k_row1_class9}'
]
) +
k_generateRow(
[
k_lineH, '{k_row2_class2}', '{k_row2_class3}', '{k_row2_class4}',
'{k_row2_class5}',
'{k_row2_class6}', '{k_row2_class7}', '{k_row2_class8}', '{k_row2_class9}'
]
) +
k_generateRow([k_curveL, k_lineV, k_lineV, k_lineV, k_spacer, k_lineV, k_lineV, k_lineV, k_lineV]) +
k_generateRow(
[k_portNumber, k_portNumber, k_portNumber, k_portNumber, k_spacer, k_portNumber, k_portNumber, k_portNumber, k_portNumber],
['1','2', '3', '4', '', '5', '6', '7', '8']
) +
k_generateRow(
[
k_longLine, k_longLine, k_longLine, k_longLine,
k_spacer + ' ' + k_bigHeight,
k_longLine, k_longLine, k_longLine, k_longLine
]
);
break;
case k_boxTypes.bigBox4:
k_class = 'bigBox4';
k_rowClasses[2] = {
k_row1_class1: '', k_row1_class2: '',
k_row1_class4: '', k_row1_class5: '',
k_row1_class7: '', k_row1_class8: '',
k_row2_class2: k_curveT,
k_row2_class4: k_curveT, k_row2_class5: k_curveT,
k_row2_class7: k_curveT, k_row2_class8: k_curveL
};
k_rowClasses[3] = {
k_row1_class1: k_lineH, k_row1_class2: k_lineH,
k_row1_class4: k_curveT, k_row1_class5: k_curveT,
k_row1_class7: k_curveT, k_row1_class8: k_curveL,
k_row2_class2: k_curveL,
k_row2_class4: k_lineV, k_row2_class5: k_lineV,
k_row2_class7: k_lineV, k_row2_class8: k_lineV
};
k_generatedRows = '' +
k_generateRow(
[
'{k_row1_class1}', '{k_row1_class2}',
'{k_row1_class4}', '{k_row1_class5}',
'{k_row1_class7}', '{k_row1_class8}'
]
) +
k_generateRow(
[
k_lineH, '{k_row2_class2}',
'{k_row2_class4}', '{k_row2_class5}',
'{k_row2_class7}', '{k_row2_class8}'
]
) +
k_generateRow([k_curveL, k_lineV, k_lineV, k_lineV, k_lineV, k_lineV]) +
k_generateRow(
[k_portNumber, k_portNumber, k_portNumber, k_portNumber, k_portNumber, k_portNumber],
['1','2', '3', '4', '5', '6']
) +
k_generateRow(
[
k_longLine, k_longLine,
k_longLine, k_longLine,
k_longLine, k_longLine
]
);
break;
case k_boxTypes.smallBox2:
k_class = 'box6';
k_rowClasses[2] = {
k_row1_class1: '', k_row1_class2: '', k_row1_class3: k_bigSpacer,
k_row1_class4: '', k_row1_class5: '', k_row1_class6: k_spacer,
k_row1_class7: '', k_row1_class8: '',
k_row2_class2: k_curveT, k_row2_class3: k_bigSpacer + ' ' + k_lineH,
k_row2_class4: k_curveT, k_row2_class5: k_curveT, k_row2_class6: k_spacer + ' ' + k_lineH,
k_row2_class7: k_curveT, k_row2_class8: k_curveL
};
k_rowClasses[3] = {
k_row1_class1: k_lineH, k_row1_class2: k_lineH, k_row1_class3: k_bigSpacer + ' ' + k_lineH,
k_row1_class4: k_curveT, k_row1_class5: k_curveT, k_row1_class6: k_spacer + ' ' + k_lineH,
k_row1_class7: k_curveT, k_row1_class8: k_curveL,
k_row2_class2: k_curveL, k_row2_class3: k_bigSpacer,
k_row2_class4: k_lineV, k_row2_class5: k_lineV, k_row2_class6: k_spacer,
k_row2_class7: k_lineV, k_row2_class8: k_lineV
};
k_generatedRows = '' +
k_generateRow(
[
'{k_row1_class1}', '{k_row1_class2}', '{k_row1_class3}',
'{k_row1_class4}', '{k_row1_class5}', '{k_row1_class6}',
'{k_row1_class7}', '{k_row1_class8}'
]
) +
k_generateRow(
[
k_lineH, '{k_row2_class2}', '{k_row2_class3}',
'{k_row2_class4}', '{k_row2_class5}', '{k_row2_class6}',
'{k_row2_class7}', '{k_row2_class8}'
]
) +
k_generateRow([k_curveL, k_lineV, k_bigSpacer, k_lineV, k_lineV, k_spacer, k_lineV, k_lineV]) +
k_generateRow(
[k_portNumber, k_portNumber, k_bigSpacer, k_portNumber, k_portNumber, k_spacer, k_portNumber, k_portNumber],
['1','2', '', '3', '4', '', '5', '6']
) +
k_generateRow(
[
k_longLine, k_longLine,
k_bigSpacer + ' ' + k_bigHeight,
k_longLine, k_longLine,
k_spacer + ' ' + k_bigHeight,
k_longLine, k_longLine
]
);
break;
case k_boxTypes.smallBox3:
k_class = 'smallBox2'; k_rowClasses[2] ={
k_cellA1: '', k_cellA2: '', k_cellA3: '', k_cellA4: '', k_cellA5: '', k_cellA6: '', k_cellA7: '', k_cellA8: '',
k_cellB1: k_lineH, k_cellB2: k_lineH, k_cellB3: k_lineH, k_cellB4: k_curveT, k_cellB5: k_lineH, k_cellB6: k_curveT, k_cellB7: k_lineH, k_cellB8: k_curveL,
k_cellC1: k_lineH, k_cellC2: k_curveL, k_cellC3: k_spacer, k_cellC4: k_lineV, k_cellC5: k_spacer, k_cellC6: k_lineV, k_cellC7: k_spacer, k_cellC8: k_lineV
};
k_rowClasses[3] ={
k_cellA1: k_lineH, k_cellA2: k_lineH, k_cellA3: k_lineH, k_cellA4: k_lineH, k_cellA5: k_lineH, k_cellA6: k_curveT, k_cellA7: k_lineH, k_cellA8: k_curveL,
k_cellB1: k_lineH, k_cellB2: k_lineH, k_cellB3: k_lineH, k_cellB4: k_curveL, k_cellB5: k_spacer, k_cellB6: k_lineV, k_cellB7: k_spacer, k_cellB8: k_lineV,
k_cellC1: k_lineH, k_cellC2: k_curveL, k_cellC3: k_spacer, k_cellC4: k_lineV, k_cellC5: k_spacer, k_cellC6: k_lineV, k_cellC7: k_spacer, k_cellC8: k_lineV
};
k_generatedRows = '' +
k_generateRow(['{k_cellA1}', '{k_cellA2}','{k_cellA3}', '{k_cellA4}','{k_cellA5}', '{k_cellA6}','{k_cellA7}', '{k_cellA8}']) +
k_generateRow(['{k_cellB1}', '{k_cellB2}','{k_cellB3}', '{k_cellB4}','{k_cellB5}', '{k_cellB6}','{k_cellB7}', '{k_cellB8}']) +
k_generateRow(['{k_cellC1}', '{k_cellC2}','{k_cellC3}', '{k_cellC4}','{k_cellC5}', '{k_cellC6}','{k_cellC7}', '{k_cellC8}']) +
k_generateRow([k_spacer, k_portNumber,k_spacer, k_portNumber,k_spacer, k_portNumber,k_spacer, k_portNumber],
['', '1', '', '2', '', '3', '', '4']) +
k_generateRow([k_spacer, k_lineV, k_spacer, k_lineV, k_spacer, k_lineV, k_spacer, k_lineV]);
break;
case k_boxTypes.smallBox1:
k_class = 'box4';
k_isSmallBox = true;
k_rowClasses[2] ={
k_row1_class1: '', k_row1_class2: '', k_row1_class3: '', k_row1_class4: '',
k_row2_class3: k_lineH, k_row2_class4: k_curveL, k_row3_class2: k_curveT, k_row3_class3: k_curveL
};
k_rowClasses[3] ={
k_row1_class1: k_lineH, k_row1_class2: k_lineH, k_row1_class3: k_lineH, k_row1_class4: k_curveL,
k_row2_class3: k_curveL, k_row2_class4: k_lineV, k_row3_class2: k_curveL, k_row3_class3: k_lineV
};
k_generatedRows = '' +
k_generateRow(['{k_row1_class1}', '{k_row1_class2}', '{k_row1_class3}', '{k_row1_class4}']) +
k_generateRow([k_lineH, k_lineH, '{k_row2_class3}', '{k_row2_class4}']) +
k_generateRow([k_curveT, '{k_row3_class2}', '{k_row3_class3}', k_lineV]) +
k_generateRow([k_portNumber, k_portNumber, k_portNumber, k_portNumber], ['4', '3', '2', '1']) +
k_generateRow([k_longLine, k_longLine, k_longLine, k_longLine]);
break;
case k_boxTypes.tinyBox1:
k_class = 'box3';
k_isSmallBox = true;
k_rowClasses[2] ={
k_cellA1: '', k_cellA2: '', k_cellA3: '', k_cellA4: '', k_cellA5: '', k_cellA6: '',
k_cellB1: k_lineH, k_cellB2: k_lineH, k_cellB3: k_lineH, k_cellB4: k_lineH, k_cellB5: k_lineH, k_cellB6: k_curveL,
k_cellC1: k_lineH, k_cellC2: k_curveT, k_cellC3: k_lineH, k_cellC4: k_curveL, k_cellC5: '', k_cellC6: k_lineV
};
k_rowClasses[3] ={
k_cellA1: k_lineH, k_cellA2: k_lineH, k_cellA3: k_lineH, k_cellA4: k_lineH, k_cellA5: k_lineH, k_cellA6: k_curveL,
k_cellB1: k_lineH, k_cellB2: k_lineH, k_cellB3: k_lineH, k_cellB4: k_curveL, k_cellB5: '', k_cellB6: k_lineV,
k_cellC1: k_lineH, k_cellC2: k_curveL, k_cellC3: '', k_cellC4: k_lineV, k_cellC5: '', k_cellC6: k_lineV
};
k_generatedRows = '' +
k_generateRow(['{k_cellA1}', '{k_cellA2}','{k_cellA3}', '{k_cellA4}','{k_cellA5}', '{k_cellA6}']) +
k_generateRow(['{k_cellB1}', '{k_cellB2}','{k_cellB3}', '{k_cellB4}','{k_cellB5}', '{k_cellB6}']) +
k_generateRow(['{k_cellC1}', '{k_cellC2}','{k_cellC3}', '{k_cellC4}','{k_cellC5}', '{k_cellC6}']) +
k_generateRow(['', k_portNumber, '', k_portNumber,'', k_portNumber], ['', '3', '', '2', '', '1']) +
k_generateRow(['', k_longLine, '', k_longLine,'', k_longLine]);
break;
case k_boxTypes.box_id_ng110:
k_class = 'box_id_ng110 activation_wizard';
k_generatedRows = '';
k_labels = '';
k_rowClasses[2] = {};
k_rowClasses[3] = {};
break;
case k_boxTypes.box_id_ng310:
k_class = 'box_id_ng310 activation_wizard';
k_generatedRows = '';
k_labels = '';
k_rowClasses[2] = {};
k_rowClasses[3] = {};
break;
case k_boxTypes.box_id_ng510:
k_class = 'box_id_ng510 activation_wizard';
k_generatedRows = '';
k_labels = '';
k_rowClasses[2] = {};
k_rowClasses[3] = {};
break;
case k_boxTypes.box_id_ng511:
k_class = 'box_id_ng511 activation_wizard';
k_generatedRows = '';
k_labels = '';
k_rowClasses[2] = {};
k_rowClasses[3] = {};
break;
}
if ('' !== k_boxModel) {
k_template =
'<div class="' + k_class + ' boxConnections">' +
k_labels +
'<table class="lines" cellpadding="0" cellspacing="0" border="0">' +
k_generatedRows +
'</table>' +
'</div>';
}
kerio.waw.shared.k_widgets.K_BoxConnections.superclass.constructor.call(this, k_id, {k_template: k_template});
this.k_addReferences(
{
k_rowClasses: k_rowClasses,
k_isSmallBox: k_isSmallBox
}
);
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_BoxConnections', kerio.lib.K_DisplayField, {

k_setRowData: function(k_labels) {
if (!k_labels) {
return;
}
var
k_data;
if (!this.k_isSmallBox) {
k_labels.reverse();
}
if (3 === k_labels.length) {
k_data = this.k_rowClasses[3];
} else {
k_data = this.k_rowClasses[2];
k_labels.unshift('');
}
kerio.waw.shared.k_methods.k_mergeObjects(
{
k_label1: k_labels[0],
k_label2: k_labels[1],
k_label3: k_labels[2]
},
k_data
);
this.k_setValue(k_data);
}});

kerio.waw.shared.k_widgets.K_FindField = function(k_id, k_config) {
k_config = k_config || {};
if (!k_config.k_grid || !k_config.k_grid.k_isInstanceOf('K_Grid')) {
kerio.lib.k_reportError('FindField requires a grid to be defined in configuration.', 'K_FindField');
return;
}
var
k_tr = kerio.lib.k_tr,
k_fieldCfg;
k_fieldCfg = {
k_isSearchField: (false !== k_config.k_registerShortcut),
k_defaultTrigger: 'k_triggerFindNext',
k_triggers: [
{
k_id: 'k_triggerFindNext',
k_onClick: function (k_toolbar, k_findField) {
k_findField.k_findNext();
},
k_className: 'findNext',
k_title: k_tr('Find Next', 'wlibLogs'), k_isHidden: false
},
{
k_id: 'k_triggerFindPrev',
k_onClick: function (k_toolbar, k_findField) {
k_findField.k_findPrev();
},
k_className: 'findPrev',
k_title: k_tr('Find Prev', 'wlibLogs'),
k_isHidden: false
}
],
k_onKeyPress: function (k_toolbar, k_findField, k_extEvent) {
var k_key = k_extEvent.getKey();
if (k_extEvent.ESC == k_key){
k_extEvent.stopEvent(); k_findField.k_reset();
}
else if (k_extEvent.ENTER == k_key) {
k_extEvent.stopEvent(); }
},
k_caption: k_config.k_caption || k_tr('Find:', 'wlibLogs'),
k_value: '',
k_width: 200
}; kerio.waw.shared.k_widgets.K_FindField.superclass.constructor.call(this, k_id, k_fieldCfg);
this._k_grid = k_config.k_grid;
this.k_reset(); this._k_columns = k_config.k_columns || [];
}; kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_FindField', kerio.lib.K_MultiTriggerField, {

k_reset: function() {
this._k_lastPosition = undefined;
this._k_grid._k_searchValue = undefined;
kerio.lib.K_MultiTriggerField.prototype.k_reset.call(this);
},

k_findNext: function() {
this._k_getStartPosition();
this._k_find(+1);
},

k_findPrev: function() {
this._k_getStartPosition();
this._k_find(-1);
},

_k_getStartPosition: function(k_step) {
var
k_grid = this._k_grid,
k_selection;
k_selection = k_grid.k_selectionStatus;
if (k_selection && 0 < k_selection.k_selectedRowsCount) {
this._k_lastPosition = k_selection.k_rows[0].k_rowIndex;
}
else if (undefined === this._k_lastPosition) {
this._k_lastPosition = -1;
} },

_k_find: function(k_step) {
var
k_grid = this._k_grid,
k_anyText = k_grid.k_translations ? k_grid.k_translations.k_any : '',
k_data = k_grid.k_getData(),
k_searchValue = this.k_getValue(),
k_isFound = false,
k_row,
k_rowCnt,
k_rowData,
k_column,
k_columnData,
k_searchParams,
k_i, k_cnt;
if ('' === k_searchValue) {
k_grid._k_searchValue = undefined;
k_grid.k_refresh();
return;
}
k_grid._k_searchValue = k_searchValue;
k_row = this._k_lastPosition;
k_rowCnt = k_data.length;
while (true) { if (0 <= k_row && k_row < k_rowCnt && k_data[k_row] && k_data[k_row].k_isHidden) {
while (0 <= k_row && k_row < k_rowCnt && k_data[k_row] && k_data[k_row].k_isHidden) {
k_row += k_step;
}
}
else {
k_row += k_step; }
if (0 > k_row) {
this._k_showConfirmSearchDialog(false);
return;
}
if (k_row >= k_rowCnt) {
this._k_showConfirmSearchDialog(true);
return;
}
k_rowData = k_data[k_row];
if (!k_rowData) {
kerio.lib.k_reportError('Missing data for row %1 in grid %2'.replace('%1', k_row).replace('%2', this._k_grid.k_id), 'K_FindField');
}
for (k_column in k_rowData) {
k_columnData = k_rowData[k_column];
k_searchParams = this._k_getColumnSearchParams(k_column, k_columnData);
if (!k_searchParams) { continue;
}
switch(typeof k_columnData) {
case 'string':
k_isFound = this._k_compare(k_columnData, k_searchValue, k_searchParams);
break;
case 'object':
if (Ext.isArray(k_columnData)) {
k_cnt = k_columnData.length;
if (0 === k_cnt) { k_isFound = this._k_compare(k_anyText, k_searchValue, k_searchParams); }
else { for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_columnData[k_i].k_searchValue) {
k_isFound = this._k_compare(k_columnData[k_i].k_searchValue, k_searchValue, k_searchParams);
if (k_isFound) {
break;
}
}
}
}
break;
}
else {
if (k_columnData.k_searchValue) {
k_isFound = this._k_compare(k_columnData.k_searchValue, k_searchValue, k_searchParams);
break;
}
k_isFound = false;
}
break;
default:
k_isFound = false;
}
if (k_isFound) {
this._k_focusGridRow(k_row);
k_grid.k_refresh();
return;
}
}
}
},

_k_compare: function(k_haystack, k_needle, k_params) {
if (k_params.k_ignoreCase) {
k_haystack = k_haystack.toLowerCase();
k_needle = k_needle.toLowerCase();
}
if (k_params.k_fullText) {
return (0 <= k_haystack.indexOf(k_needle)); }
else {
return (k_needle === k_haystack.substr(0, k_needle.length)); }
},

_k_getColumnSearchParams: function(k_column) {
var
k_columnData;
k_columnData = this._k_grid._k_columnModel.getColumnById(k_column);
if ((!k_columnData || k_columnData.hidden) && -1 === this._k_columns.indexOf(k_column)) {
k_columnData = false;
}
else {
k_columnData = {
k_columnId: k_column,
k_fullText: true,
k_ignoreCase: true
};
}
return k_columnData;
},

_k_focusGridRow: function(k_rowIndex) {
this._k_grid.k_selectRows(k_rowIndex);
this.k_focus();
this._k_lastPosition = k_rowIndex; },

_k_showConfirmSearchDialog: function (k_isBottom) {
var
k_searchValue = this.k_getValue(),
k_tr = kerio.lib.k_tr,
k_msg;
if (k_isBottom) {
k_msg = k_tr('Text %1 not found. <br>Would you like to search from the top?', 'wlibLogs', {k_args: [k_searchValue]});
}
else {
k_msg = k_tr('Text %1 not found. <br>Would you like to search from the bottom?', 'wlibLogs', {k_args: [k_searchValue]});
}
kerio.lib.k_confirm({
k_title: k_tr('Confirm Action', 'wlibAlerts'),
k_msg: k_msg,
k_callback: this._k_onConfirmSearchCallback.createDelegate(this, [k_isBottom], true),
k_defaultButton: 'Yes'
});
},

_k_onConfirmSearchCallback: function (k_response, k_text, k_params, k_isBottom) {
if ('yes' === k_response) {
if (k_isBottom) {
this._k_lastPosition = -1;
this._k_find(+1);
}
else {
this._k_lastPosition = this._k_grid.k_getRowsCount();
this._k_find(-1);
}
}
},

_k_higlight: function () {
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
} }); 
kerio.waw.shared.k_widgets.K_CommonTable = function(k_id, k_config){
var
k_template,
k_i, k_cnt,
k_headers = '',
k_header,
k_width, k_colspan, k_caption, k_className,
k_headerString = '',
k_columnClass,
k_columnDef = [];
if (k_config.k_headers) {
for (k_i = 0, k_cnt = k_config.k_headers.length; k_i < k_cnt; k_i++) {
k_header = k_config.k_headers[k_i];
k_width = k_header.k_width ? ' width="' + k_header.k_width + '"' : '';
k_colspan = k_header.k_colspan ? ' colspan="' + k_header.k_colspan + '"' : '';
k_caption = k_header.k_caption ? k_header.k_caption : '';
k_className = k_header.k_className ? ' class="' + k_header.k_className + '"' : '';
k_headers += '<th' + k_width + k_colspan + k_className + '>' + k_caption + '</th>';
}
k_headerString = '<tr>' + k_headers + '</tr>';
}
if (k_config.k_columnClasses) {
for (k_i = 0, k_cnt = k_config.k_columnClasses.length; k_i < k_cnt; k_i++) {
k_columnClass = k_config.k_columnClasses[k_i];
k_columnDef[k_columnClass.k_id] = k_columnClass.k_className;
}
}
k_template = '<table class="commonTable"><thead>' + k_headerString + '</thead><tbody>{k_rows}</tbody></table>';
kerio.waw.shared.k_widgets.K_CommonTable.superclass.constructor.call(
this,
k_id,
{
k_template: k_template
}
);
this.k_addReferences({
_k_rowsString: '',
_k_parentContainer: null,
_k_columnDef: k_columnDef
});
};kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_CommonTable', kerio.lib.K_DisplayField, {

k_appendRow: function(k_rowData, k_rowClassName) {
var
k_i, k_cnt,
k_className,
k_rowClass,
k_rowString = '';
for (k_i = 0, k_cnt = k_rowData.length; k_i < k_cnt; k_i++) {
k_className = this._k_columnDef[k_i] ? ' class="' + this._k_columnDef[k_i] + '"' : '';
k_rowString += '<td' + k_className + '>' + k_rowData[k_i] + '</td>';
}
k_rowClass = k_rowClassName && k_rowClassName != '' ? ' class="' + k_rowClassName + '"' : '';
this._k_rowsString += '<tr' + k_rowClass + '>' + k_rowString + '</tr>';
},

k_showData: function() {
var
k_parentContainer = this._k_parentContainer;
if (!k_parentContainer && this.k_parentWidget && this.k_parentWidget.k_isInstanceOf('K_FormContainer')) {
k_parentContainer = this.k_extWidget.ownerCt;
this._k_parentContainer = k_parentContainer;
k_parentContainer._kx.k_owner.k_addReferences({
k_commonTable: this
});
k_parentContainer.on('bodyresize',
function() {
var
k_widget = this._kx.k_owner;
this.setHeight(k_widget.k_commonTable.k_extWidget.getEl().child('table').getHeight() + 5);
this.doLayout();
});
}
this.k_setSecureValue({k_rows: this._k_rowsString});
this._k_rowsString = '';
if (k_parentContainer) {
k_parentContainer.setHeight(this.k_extWidget.getEl().child('table').getHeight() + 5);
k_parentContainer.doLayout();
}
}});