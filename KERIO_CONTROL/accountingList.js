

kerio.waw.ui.accountingList = {

k_init: function(k_objectName) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared =  kerio.waw.shared,
k_getDefinition = k_shared.k_DEFINITIONS.k_get,
k_localNamespace = k_objectName + '_',
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_isIPadCompatible = k_lib.k_isIPadCompatible,
k_selectWidth = k_isIPadCompatible ? '100%' : 190,
k_smptServerCfg = k_getDefinition('k_smtpServer'),
SnmpVersion = k_shared.k_CONSTANTS.SnmpVersion,
k_communityInvalidText = k_tr('Community password must contain only letters and numbers', 'accountingList'),
k_passwordInvalidText = k_tr('Password must be at least 8 characters in length', 'accountingList'),
k_noSpacesOnBeginningText = k_tr('Text cannot begin with whitespaces and may contain ASCII characters only', 'accountingList'),
k_tabPage, k_tabPageCfg,
k_toolbar, k_toolbarCfg,
k_starForm, k_starFormCfg,
k_statisticsForm, k_statisticsFormCfg,
k_statusbarCfg,
k_alertStatusbar,
k_reportRecipientStatusbar,
k_userExceptionGrid,
k_alertSettingsGrid, k_alertSettingsGridCfg,
k_alertSettingsForm, k_alertSettingsFormCfg,
k_reportRecipientGrid, k_reportRecipientGridCfg,
k_snmpForm, k_snmpFormCfg,
k_dataGatheringLabelWidth,
k_alertLineRenderer,
k_fillAlertListRenderer,
k_sortAlertList;

k_statusbarCfg = {
k_defaultConfig: 'k_noMessage',
k_configurations: {
k_noMessage: {
k_text: ''
},
k_ruleInactive: {
k_text: k_tr('Some rows are invalid as they refer to objects that do not exist.', 'policyList'),
k_iconCls: 'ruleInactive'
}
}
};
k_reportRecipientStatusbar = new kerio.lib.K_Statusbar(k_localNamespace + 'k_statusbar' + 'k_reportRecipient', k_statusbarCfg);
k_reportRecipientGridCfg = {
k_className: 'statusBarGrid reportRecipient',
k_statusbar: k_reportRecipientStatusbar,
k_isReadOnly: k_isAuditor,
k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'starAccessEditor'
},
k_items: [{
k_type: 'K_GRID_DEFAULT',

k_onRemove: function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget;
k_grid.k_removeSelectedRows();
k_grid.k_statisticsForm.k_setInactiveMessage();
kerio.adm.k_framework.k_enableApplyReset();
}
},
k_getDefinition('k_editorGridBtnDuplicate'),
'-',
{
k_id: 'k_btnSendNow',
k_caption: k_tr('Send again…', 'accountingList'),
k_isDisabled: true,

k_onClick: function() {
var
k_grid = this.k_parentWidget,
k_form = this.k_getMainWidget().k_statisticsForm,
k_tr = kerio.lib.k_tr,
k_cnt = k_grid.k_selectionStatus.k_selectedRowsCount,
k_rows = k_grid.k_selectionStatus.k_rows,
k_rowData,
k_reportConfig,
k_addressee,
k_emails = '', k_email,
k_i;
if (0 === k_cnt) {
return;
}
if (!k_form.k_definedSmtpDisplay.k_isVisible()) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Warning', 'common'),
k_msg: k_form.k_smptServerCfg.k_noSmtpServerMessage,
k_icon: 'warning'
});
return;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_rowData = (k_rows[k_i]).k_data;
k_addressee = k_rowData.addressee;
k_email = k_addressee.email;
if (k_addressee.user && k_addressee.user.isGroup) {
kerio.lib.k_alert({
k_title: k_tr('Warning', 'common'),
k_msg: k_tr('Cannot send report to group.', 'accountingList'),
k_icon: 'warning'
});
return;
}
k_reportConfig = k_rowData.reportConfig;
if (!(k_reportConfig.dailyEnabled || k_reportConfig.monthlyEnabled || k_reportConfig.weeklyEnabled)) {
kerio.lib.k_alert({
k_title: k_tr('Warning', 'common'),
k_msg: k_tr('The selected user doesn\'t have any type of report specified.', 'accountingList'),
k_icon: 'warning'
});
return;
}
if ('' === k_email) {
kerio.lib.k_alert({
k_title: k_tr('Warning', 'common'),
k_msg: k_tr('The selected user doesn\'t have an email address specified.', 'accountingList'),
k_icon: 'warning'
});
return;
}
k_emails += k_email;
if (k_i < k_cnt - 1) {
k_emails += ', ';
}
}
kerio.lib.k_confirm({
k_title: k_tr('Confirm Action', 'common'),
k_msg: k_tr('Do you really want to send all reports again to %1?', 'accountingList', {k_args: [k_emails]}),
k_callback: k_grid.k_parentWidget.k_form.k_sendAgainCallback,
k_scope: k_form
});
}
}
],

k_update: function(k_grid) {
this.k_enableItem('k_btnSendNow', (1 === k_grid.k_selectionStatus.k_selectedRowsCount));
this.k_enableItem('k_btnDuplicate', (1 === k_grid.k_selectionStatus.k_selectedRowsCount));
}
}
},
k_columns: {
k_sorting: {
k_columnId: 'recipient',
k_isAscending: true
},
k_items: [
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'enabled',
k_isDataOnly: true
},
{
k_columnId: 'addressee',
k_isDataOnly: true
},
{
k_columnId: 'recipient',
k_caption: k_tr('User', 'accountingList'),
k_width: 200,

k_renderer: function(k_value, k_data) {
var
k_render = kerio.waw.shared.k_methods.k_renderers.k_userOrEmailRenderer(k_data.addressee);
k_data.recipient = k_render.k_data;
return k_render;
},
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'enabled',
k_onChange: function(k_grid) {
k_grid.k_statisticsForm.k_setInactiveMessage();
kerio.adm.k_framework.k_enableApplyReset();
}
}
},
{
k_columnId: 'onlineAccess',
k_caption: k_tr('Online access', 'accountingList'),
k_width: 100,
k_renderer: function(k_value, k_data) {
var
k_render = '';
if (k_value && k_data.addressee && kerio.waw.shared.k_CONSTANTS.AddresseeType.AddresseeUser === k_data.addressee.type) {
k_render = kerio.lib.k_tr('Allowed', 'accountingList');
}
k_data.onlineAccess = k_render;
return {k_data: k_render};
}
},
{
k_columnId: 'users',
k_isDataOnly: true
},
{
k_columnId: 'usersRenderer',
k_caption: k_tr('Data', 'accountingList'),
k_width: 200,
k_multilineRenderer: function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_collapsedValue = ' ',
k_className = 'iconList';
k_value = k_value || [];
if (0 === k_value.length || k_value[0].k_isNothing) {
k_collapsedValue = kerio.lib.k_tr('No data', 'accountingList');
k_className += ' inactive';
}
return {
k_className: k_className,
k_isCollapsible: k_WAW_CONSTANTS.k_COLLAPSE_MULTILINE_LIST,
k_maxItems: k_WAW_CONSTANTS.k_LIMIT_MULTILINE_LIST_RENDERER,
k_collapsedValue: k_collapsedValue,
k_isSecure: true,
k_lineRenderer: k_grid.k_usersLineRenderer
};
}
},
{
k_columnId: 'reportConfig',
k_isDataOnly: true
},
{
k_columnId: 'reportConfigRenderer',
k_caption: k_tr('Regular email reports', 'accountingList'),
k_renderer: function(k_value, k_data) {
var
k_text = '',
k_tr = kerio.lib.k_tr,
k_className = '',
k_iconCls = '',
k_dataTooltip = '',
k_daily = k_data.reportConfig.dailyEnabled,
k_weekly = k_data.reportConfig.weeklyEnabled,
k_monthly  = k_data.reportConfig.monthlyEnabled,
k_report = k_daily || k_weekly || k_monthly,
k_weeklyText = k_tr('Weekly', 'accountingList'),
k_monthlyText = k_tr('Monthly', 'accountingList');
if (k_daily) {
k_text = k_tr('Daily', 'accountingList');
}
if (k_weekly && !k_daily) {
k_text = k_weeklyText;
}
else if (k_weekly && !k_monthly) {
k_text += k_tr(' and ', 'accountingList') + k_weeklyText;
}
else if (k_weekly) {
k_text += k_tr(', ', 'accountingList') + k_weeklyText;
}
if (k_monthly && '' === k_text) {
k_text = k_monthlyText;
}
else if (k_monthly) {
k_text += k_tr(' and ', 'accountingList') + k_monthlyText;
}
if (k_report && kerio.waw.shared.k_CONSTANTS.AddresseeType.AddresseeUser === k_data.addressee.type) {
if (k_data.addressee.user.isGroup) {
k_className = 'inactive';
k_iconCls += 'icon warningIcon';
k_dataTooltip = k_tr('Reports cannot be sent if the access is granted for a group', 'accountingList');
}
else if ('' === k_data.addressee.email) {
k_className = 'inactive';
k_iconCls += 'icon warningIcon';
k_dataTooltip = k_tr('Reports cannot be sent because the user has no email address set.', 'accountingList');
}
}
k_data.reportConfigRenderer = ((k_daily << 2) + (k_weekly << 1) + (k_monthly << 0));
return {
k_data: k_text,
k_iconCls: k_iconCls,
k_className: k_className,
k_dataTooltip: k_dataTooltip,
k_iconTooltip: k_dataTooltip
};
}
}
]
},

k_rowRenderer: function(k_rowData) {
var
k_className = '';
if (0 === k_rowData.usersRenderer.length || k_rowData.usersRenderer[0].k_isNothing) {
k_className = 'inactive';
}
if(1 < k_rowData.usersRenderer.length && k_rowData.usersRenderer[0].k_isNothing){
k_rowData.usersRenderer.shift();
}
this.k_statisticsForm.k_setInactiveMessage();
return k_className;
}
};
if (k_isAuditor) {
k_reportRecipientGridCfg.k_toolbars = {};
}
k_reportRecipientGrid = new kerio.waw.shared.k_widgets.K_ContextMenuList(k_localNamespace + 'reportRecipientGrid', k_reportRecipientGridCfg);

k_dataGatheringLabelWidth = 280;
k_starFormCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_isReadOnly: k_isAuditor,
k_items: [
{
k_type: 'k_container',
k_minHeight: 25,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'enabled',
k_isLabelHidden: true,
k_option: k_tr('Gather internet usage statistics', 'accountingList'),

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled(['activityLogEnabled'], !k_isChecked);
}
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Statistics', 'accountingList'),
k_labelWidth: k_dataGatheringLabelWidth,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'activityLogEnabled',
k_isLabelHidden: true,
k_isDisabled: true,
k_option: k_tr('Gather user\'s activity records', 'accountingList')
},
{
k_type: 'k_columns',
k_id: 'k_maxAgeContainer',
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_number',
k_id: 'maxAge',
k_caption: k_tr('Delete statistics older than:', 'accountingList'),
k_minValue: 1,
k_maxLength: 2,
k_width: 50,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_display',
k_value: k_tr('month(s)', 'accountingList')
}
]
},
{
k_type: 'k_columns',
k_isLabelHidden: true,
k_items: [
{
k_id: 'k_gatheredGroups',
k_caption: k_tr('Gather group statistics for these groups:', 'accountingList'),
k_width: 270,
k_isReadOnly: true
},
{
k_type: 'k_formButton',
k_id: 'k_btnGatheredGroups',
k_caption: k_tr('Select…', 'common'),
k_onClick: function(k_form) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'membershipEditor',
k_objectName: 'k_gatherGroupsEditor',
k_params: {
k_data: k_form.k_dataStore.k_gatheredGroups,
k_relatedWidget: k_form,
k_callback: k_form.k_gatheredGroupsCallback
}
});
}
}
]
},
{
k_type: 'k_formButton',
k_id: 'deleteStatsButton',
k_caption: k_tr('Delete All Statistics Data…', 'accountingList'),
k_onClick: function(k_form) {
kerio.lib.k_confirm({
k_title: kerio.lib.k_tr('Confirm Action', 'common'),
k_msg: '<b>' + kerio.lib.k_tr('Do you want to delete all statistics data now?', 'accountingList') + '</b>',
k_callback: k_form.k_deleteStarData,
k_scope: k_form
});
}
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Accounting periods for statistics and quota', 'accountingList'),
k_labelWidth: k_dataGatheringLabelWidth,
k_items: [
{
k_type: 'k_select',
k_id: 'startWeekDay',
k_caption: k_tr('First day of week:', 'accountingList'),
k_width: 100,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: k_getDefinition('k_WEEKDAY_NAMES_SELECT')
},
{
k_type: 'k_number',
k_id: 'startMonthDay',
k_caption: k_tr('First day of month:', 'accountingList'),
k_width: 50,
k_minValue: 1,
k_maxValue: 28,
k_maxLength: 2,
k_validator: {
k_allowBlank: false
}
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Accounting exceptions', 'accountingList'),
k_labelWidth: 360,
k_items: [
{
k_type: 'k_definitionSelect',
k_id: 'validTimeRange',
k_width: k_selectWidth,
k_caption: k_tr('Account traffic only in the given time interval:', 'accountingList'),
k_definitionType: 'k_timeRange',
k_showApplyReset: true,
k_allowFiltering: true,
k_pageSize: 500,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: [{
k_id: kerio.waw.shared.k_CONSTANTS.k_NONE,
k_name: k_tr('Always', 'timeRangeList')
}],
k_onApplyResetHandler: kerio.waw.shared.k_methods.k_definitionApplyResetHandler
},
{
k_type: 'k_definitionSelect',
k_id: 'urlGroup',
k_width: k_selectWidth,
k_caption: k_tr('Exclude website statistics for URLs which belong to:', 'accountingList'),
k_definitionType: 'k_urlGroup',
k_showApplyReset: true,
k_allowFiltering: true,
k_pageSize: 500,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: [{
k_id: kerio.waw.shared.k_CONSTANTS.k_NONE,
k_name: k_tr('None', 'urlGroupList')
}],
k_onApplyResetHandler: kerio.waw.shared.k_methods.k_definitionApplyResetHandler
},
{
k_type: 'k_definitionSelect',
k_id: 'ipAddressGroup',
k_width: k_selectWidth,
k_caption: k_tr('Exclude traffic to/from IP addresses which belong to:', 'accountingList'),
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
k_caption: k_tr('Exclude the following users from statistics:', 'accountingList'),
k_width: k_selectWidth,
k_isReadOnly: true
},
{
k_type: 'k_formButton',
k_id: 'k_btnUserExceptions',
k_caption: k_tr('Select…', 'common'),
k_onClick: function(k_form) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'membershipEditor',
k_objectName: 'k_accountingExceptionsEditor',
k_params: {
k_data: k_form.k_dataStore.k_userExceptions,
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
] }; k_starForm = new k_lib.K_Form(k_localNamespace + 'k_starForm', k_starFormCfg);
k_starForm.k_addReferences({
k_dataStore: {},
k_userExceptions: k_starForm.k_getItem('k_userExceptions'),
k_gatheredGroups: k_starForm.k_getItem('k_gatheredGroups')
});

k_statisticsFormCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_labelWidth: 200,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Settings', 'accountingList'),
k_labelWidth: 250,
k_items: [
{
k_type: 'k_display',
k_id: 'k_linkToStar',
k_isReadOnly: k_isAuditor,
k_template: k_tr('Internet usage statistics are available at', 'userStatisticsList') + ' <a href="{k_url}" onclick="kerio.lib.k_openWindow(\'{k_url}\', \'_blank\'); return false;">{k_url}</a>'
},
{
k_type: 'k_select',
k_id: 'userFormat',
k_caption: k_tr('Show user names in this format:', 'accoutingList'),
k_width: k_selectWidth,
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_id',
k_isReadOnly: k_isAuditor,
k_localData: k_getDefinition('k_fullNameFormats')
},
{
k_type: 'k_container',
k_minHeight: 30,
k_isReadOnly: k_isAuditor,
k_items: [{
k_id: 'starReportLanguage',
k_type: 'k_select',
k_caption: k_tr('Default email report language:', 'accountingList'),
k_localData: k_shared.k_methods.k_getLanguageList(true),
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_id',
k_fieldIconClassName: 'k_className',
k_width: k_selectWidth
}]
},
kerio.lib.k_cloneObject(k_smptServerCfg.k_undefinedSmtpDisplay),
kerio.lib.k_cloneObject(k_smptServerCfg.k_definedSmtpDisplay)
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Access rights and email reports', 'accountingList'),
k_anchor: '0 -260',
k_minHeight: 160,
k_isReadOnly: k_isAuditor,
k_items: [
{
k_type: 'k_container',
k_anchor: '0 -20',
k_content: k_reportRecipientGrid
}
] },
{
k_type: 'k_fieldset',
k_caption: k_tr('User access', 'accountingList'),
k_labelWidth: 200,
k_minHeight: 95,
k_isReadOnly: k_isAuditor,
k_items: [
{
k_type: 'k_checkbox',
k_id: 'allUsers.onlineAccess',
k_isLabelHidden: true,
k_option: k_tr('Users can access their own statistics online', 'accountingList')
},
{
k_type: 'k_display',
k_template: k_tr('Users receive their own individual email reports:', 'userStatisticsList')
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_checkbox',
k_id: 'allUsers.dailyEnabled',
k_isLabelHidden: true,
k_width: 100,
k_option: k_tr('Daily', 'accountingList')
},
{
k_type: 'k_checkbox',
k_id: 'allUsers.weeklyEnabled',
k_isLabelHidden: true,
k_width: 100,
k_option: k_tr('Weekly', 'accountingList')
},
{
k_type: 'k_checkbox',
k_id: 'allUsers.monthlyEnabled',
k_isLabelHidden: true,
k_width: 100,
k_option: k_tr('Monthly', 'accountingList')
}
]
}
]
}
] }; k_statisticsForm = new k_lib.K_Form(k_localNamespace + 'k_statisticsForm', k_statisticsFormCfg);
k_statisticsForm.k_addReferences({
k_definedSmtpDisplay: k_statisticsForm.k_getItem('k_definedSmtpDisplay'),
k_smptServerCfg: k_smptServerCfg
});
k_reportRecipientGrid.k_addReferences({
k_groupDataText: k_tr('Group statistics:', 'accountingList'),
k_userDataText: k_tr('Individual statistics:', 'accountingList'),
k_allDataText: k_tr('All Data', 'accountingList'),
k_noDataText: k_tr('No data', 'accountingList'),
k_statisticsForm: k_statisticsForm
});

k_sortAlertList = function(k_first, k_second) {
var
AlertEventRuleType = kerio.waw.shared.k_CONSTANTS.AlertEventRuleType;
if (k_first.k_type === k_second.k_type) {
return k_first.k_value.localeCompare(k_second.k_value);
}
switch (k_first.k_type) {
case AlertEventRuleType.k_SYSTEM:
return -1;
case AlertEventRuleType.AlertTraffic:
return k_second.k_type === AlertEventRuleType.k_SYSTEM ? 1 : -1;
case AlertEventRuleType.AlertContent:
return k_second.k_type === AlertEventRuleType.k_LOG ? -1 : 1;
case AlertEventRuleType.k_LOG:
return 1;
}
};

k_fillAlertListRenderer = function(k_rowData) {
var
AlertEventRuleType = this.AlertEventRuleType,
k_ALERT_GROUP = this.k_ALERT_GROUP,
k_alertTypes = this.k_alertTypes,
k_alertRendered = [],
k_originItem,
k_item,
k_itemCnt, k_i;
for (k_i = 0, k_itemCnt = k_rowData.alertList.length; k_i < k_itemCnt; k_i++) {
k_originItem = k_rowData.alertList[k_i];
k_item = k_originItem;
if (k_alertTypes && k_alertTypes[k_item]) {
k_item = k_alertTypes[k_item];
}
k_item = {
k_value: k_item,
k_type: AlertEventRuleType.k_SYSTEM,
k_group: k_ALERT_GROUP.k_SYSTEM,
k_data: k_originItem
};
k_alertRendered.push(k_item);
}
for (k_i = 0, k_itemCnt = k_rowData.ruleEventList.length; k_i < k_itemCnt; k_i++) {
k_originItem = k_rowData.ruleEventList[k_i];
k_item = {
k_value: k_originItem.rule.name,
k_type: k_originItem.ruleType,
k_group: k_ALERT_GROUP.k_RULE,
k_data: k_originItem
};
k_alertRendered.push(k_item);
}
for (k_i = 0, k_itemCnt = k_rowData.logEventList.length; k_i < k_itemCnt; k_i++) {
k_originItem = k_rowData.logEventList[k_i];
k_item = {
k_value: k_originItem.name,
k_type: AlertEventRuleType.k_LOG,
k_group: k_ALERT_GROUP.k_LOG,
k_data: k_originItem,
k_index: k_i
};
k_alertRendered.push(k_item);
}
k_alertRendered.sort(this.k_sortAlertList);
k_rowData.alertListRenderer = k_alertRendered;
return k_rowData;
};

k_alertLineRenderer = function(k_item, k_data, k_rowIndex, k_colIndex, k_grid, k_itemIndex) {
var
AlertEventRuleType = k_grid.AlertEventRuleType,
k_rowData = k_item,
k_iconCls = '';
if (k_item.k_isNothing) {
return {
k_data: k_grid.k_trNothing,
k_iconCls: 'policyGrid gridListIcon objectNothing invalid'
};
}
if ('string' === typeof k_item) {
k_rowData = k_data;
}
switch(k_rowData.k_type) {
case AlertEventRuleType.k_SYSTEM:
k_iconCls = 'systemAlertIcon';
break;
case AlertEventRuleType.AlertTraffic:
k_iconCls = 'packetsIcon';
break;
case AlertEventRuleType.AlertContent:
k_iconCls = 'contentFilterIcon';
break;
case AlertEventRuleType.k_LOG:
k_iconCls = 'logIcon';
break;
}
return {
k_data: k_rowData.k_value,
k_iconCls: 'bandwidthManagement gridListIcon ' + k_iconCls
};
};
kerio.waw.shared.k_methods.k_renderers.k_alertLineRenderer = k_alertLineRenderer;
k_alertStatusbar = new kerio.lib.K_Statusbar(k_localNamespace + 'k_statusbar' + 'k_alertSettings', k_statusbarCfg);
k_alertSettingsGridCfg = {
k_statusbar: k_alertStatusbar,
k_className: 'alerts policyGrid statusBarGrid',
k_isReadOnly: k_isAuditor,
k_toolbars: {
k_bottom: {
k_dialogs: {
k_sourceName: 'alertEditor'
},
k_items: [
{
k_type: 'K_GRID_DEFAULT',

k_onRemove: function(k_toolbar) {
var
k_grid = k_toolbar.k_relatedWidget;
k_grid.k_removeSelectedRows();
k_grid.k_alertSettingsForm.k_setInactiveMessage();
kerio.adm.k_framework.k_enableApplyReset(true);
}
},
k_getDefinition('k_editorGridBtnDuplicate')
],

k_update: function(k_grid) {
this.k_enableItem('k_btnDuplicate', (1 === k_grid.k_selectionStatus.k_selectedRowsCount));
}
}
},
k_columns: {
k_sorting: {
k_columnId: 'recipient',
k_isAscending: true
},
k_items: [
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'enabled',
k_isDataOnly: true
},
{
k_columnId: 'recipient',
k_caption: k_tr('User', 'accountingList'),
k_width: 250,

k_renderer: function(k_value, k_data) {
var
k_render = kerio.waw.shared.k_methods.k_renderers.k_userOrEmailRenderer(k_data.addressee),
k_tooltip = '',
k_className = '',
k_iconCls;
k_iconCls = k_render.k_iconCls;
if (kerio.waw.shared.k_CONSTANTS.AddresseeType.AddresseeUser === k_data.addressee.type && '' === k_data.addressee.email) {
k_iconCls = 'icon warningIcon';
k_tooltip = kerio.lib.k_tr('The alert cannot be sent because the user has no email address set.', 'accountingList');
k_className = 'inactive';
}
k_data.recipient = k_data.action + '_' + k_render.k_data;
return {
k_data: k_render.k_data,
k_iconCls: k_iconCls,
k_className: k_className,
k_dataTooltip: k_tooltip,
k_iconTooltip: k_tooltip
};
},
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'enabled',
k_onChange: kerio.adm.k_framework.k_enableApplyReset
}
},
{
k_columnId: 'alertList',
k_isDataOnly: true
},
{
k_columnId: 'ruleEventList',
k_isDataOnly: true
},
{
k_columnId: 'logEventList',
k_isDataOnly: true
},
{
k_columnId: 'alertListRenderer',
k_caption: k_tr('Alerts', 'alertEditor'),
k_width: 250,
k_multilineRenderer: function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
if (0 === k_value.length) {
k_data.data.alertListRenderer.push({k_isNothing: true});
}
return {
k_isCollapsible: false,
k_lineRenderer: k_grid.k_alertLineRenderer
};
}
},
{
k_columnId: 'addressee',
k_isDataOnly: true },
{
k_columnId: 'validTimeRangeRenderer',
k_caption: k_tr('Valid time', 'accountingList'),

k_renderer: function(k_value, k_data) {
k_data.validTimeRangeRenderer = k_data.validTimeRange.name;
return kerio.waw.shared.k_methods.k_renderers.k_validTimeRangeRenderer.apply(this, arguments);
}
},
{
k_columnId: 'validTimeRange',
k_isDataOnly: true }
]
},

k_rowRenderer: function(k_rowData) {
var
k_className = '';
if (0 === k_rowData.alertListRenderer.length || k_rowData.alertListRenderer[0].k_isNothing || k_rowData.validTimeRange.invalid) {
k_className = 'inactive';
}
return k_className;
}
};
if (k_isAuditor) {
k_alertSettingsGridCfg.k_toolbars = {};
}
k_alertSettingsGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'alertSettingsGrid', k_alertSettingsGridCfg);
k_alertSettingsFormCfg  = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_fieldset',
k_caption: k_tr('Settings', 'accountingList'),
k_labelWidth: 250,
k_items: [
{
k_id: 'lang',
k_type: 'k_select',
k_caption: k_tr('Default language for alerts:', 'accountingList'),
k_localData: k_shared.k_methods.k_getLanguageList(true),
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_id',
k_fieldIconClassName: 'k_className',
k_width: k_selectWidth,
k_isReadOnly: k_isAuditor
},
kerio.lib.k_cloneObject(k_smptServerCfg.k_undefinedSmtpDisplay),
kerio.lib.k_cloneObject(k_smptServerCfg.k_definedSmtpDisplay)
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Alerts', 'accountingList'),
k_labelWidth: 250,
k_anchor: '0 -110',
k_minHeight: 200,
k_isReadOnly: k_isAuditor,
k_items: [
{
k_type: 'k_container',
k_content: k_alertSettingsGrid
}
]
}
]
};
k_alertSettingsForm = new k_lib.K_Form(k_localNamespace + 'k_alertForm', k_alertSettingsFormCfg);
k_alertSettingsForm.k_addReferences({
k_alertSettingsGrid: k_alertSettingsGrid
});
k_alertSettingsGrid.k_addReferences({
AlertEventRuleType: k_shared.k_CONSTANTS.AlertEventRuleType,
k_ALERT_GROUP: k_shared.k_CONSTANTS.k_ALERT_GROUP,
k_alertSettingsForm: k_alertSettingsForm,
k_alertLineRenderer: k_alertLineRenderer,
k_fillAlertListRenderer: k_fillAlertListRenderer,
k_sortAlertList: k_sortAlertList,
k_alertTypes: null,
k_alertTypesList: [],
k_trNothing: k_tr('Nothing', 'common')
});
k_snmpFormCfg  = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_useStructuredData: true,
k_isReadOnly: k_isAuditor,
k_items: [
{
k_id: 'enabled',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('Enable SNMP monitoring', 'accountingList'),
k_isChecked: false,

k_onChange: function(k_form, k_checkbox, k_isChecked) {
var
k_email;
k_form.k_setDisabled(['k_general','k_configuration'], !k_isChecked);
k_form.k_getItem('location').k_focus();
if (k_isChecked && '' === k_form.k_contactField.k_getValue()) {
k_email = kerio.waw.status.k_userSettings.k_get('email');
if (k_email) {
k_form.k_contactField.k_setValue(k_email);
}
}
}
},
{
k_id: 'k_general',
k_type: 'k_fieldset',
k_caption: k_tr('Settings', 'common'),
k_labelWidth: 120,
k_isDisabled: true,
k_items: [
{
k_id: 'location',
k_caption: k_tr('Location:', 'accountingList'),
k_width: k_isIPadCompatible ? undefined : 300,
k_validator: {
k_functionName: 'k_isSnmpValue',
k_allowBlank: false,
k_invalidText: k_noSpacesOnBeginningText
}
},
{
k_id: 'contact',
k_caption: k_tr('Contact:', 'accountingList'),
k_width: k_isIPadCompatible ? undefined : 300,
k_validator: {
k_functionName: 'k_isSnmpValue',
k_allowBlank: false,
k_invalidText: k_noSpacesOnBeginningText
}
},
{
k_type: 'k_radio',
k_groupId: 'version',
k_option: k_tr('Version 2c', 'accountingList'),
k_value: SnmpVersion.SnmpV2c,
k_isLabelHidden: true,
k_isChecked: true,
k_onChange: function(k_form, k_radio, k_value) {
k_form.k_changeVersion(k_value);
}
},
{
k_id: 'k_v2cConfiguration',
k_type: 'k_container',
k_labelWidth: 100,
k_indent: 1,
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_isSecure: true,
k_value: [
'<span ',
kerio.lib.k_buildTooltip(k_communityInvalidText),
'>',
k_tr('Community:', 'accountingList'),
'<span class="tooltip" ',
kerio.lib.k_buildTooltip(k_communityInvalidText),
'>&nbsp; &nbsp; &nbsp;</span></span>'
].join(''),
k_width: 100
},
k_getDefinition('k_passwordField', {
k_id: 'community.value',
k_isCaptionHidden: true,
k_validator: {
k_functionName: 'k_snmpCommunityValidator'
}
})
]
}
]
},
{
k_type: 'k_radio',
k_groupId: 'version',
k_option: k_tr('Version 3', 'accountingList'),
k_isLabelHidden: true,
k_value: SnmpVersion.SnmpV3
},
{
k_id: 'k_v3Configuration',
k_type: 'k_container',
k_labelWidth: 100,
k_indent: 1,
k_items: [
k_getDefinition('k_userNameField', {
k_id: 'username',
k_validator: {
k_functionName: 'k_isUserNameDomain'
}
}),
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_isSecure: true,
k_value: [
'<span ',
kerio.lib.k_buildTooltip(k_passwordInvalidText),
'>',
k_tr('Password:', 'accountingList'),
'<span class="tooltip" ',
kerio.lib.k_buildTooltip(k_passwordInvalidText),
'>&nbsp; &nbsp; &nbsp;</span></span>'
].join(''),
k_width: 100
},
k_getDefinition('k_passwordField', {
k_id: 'password.value',
k_isCaptionHidden: true,
k_validator: {
k_functionName: 'k_snmpV3PasswordValidator'
}
})
]
}
]
}
]
}
]
};
k_snmpForm = new k_lib.K_Form(k_localNamespace + 'k_snmpForm', k_snmpFormCfg);
k_snmpForm.k_patchAutoFill();
k_snmpForm.k_addReferences({
k_V3_VERSION: SnmpVersion.SnmpV3,
k_isVersion3: false,
k_contactField: k_snmpForm.k_getItem('contact'),
k_v2cConfiguration: k_snmpForm.k_getItem('k_v2cConfiguration'),
k_v3Configuration: k_snmpForm.k_getItem('k_v3Configuration'),
k_passwordField: k_snmpForm.k_getItem('password.value'),
k_passwordInvalidText: k_passwordInvalidText,
k_communityField: k_snmpForm.k_getItem('community.value'),
k_communityInvalidText: k_communityInvalidText,
k_originalData: {}
});

k_tabPageCfg = {
k_className: 'mainList',
k_items: [
{
k_id: 'k_starForm',
k_caption: k_tr('Data Gathering', 'accountingList'),
k_content: k_starForm
},
{
k_id: 'k_statisticsForm',
k_caption: k_tr('Access to Statistics', 'accountingList'),
k_content: k_statisticsForm
},
{
k_id: 'k_alertSettingsGrid',
k_caption: k_tr('Alert Settings', 'accountingList'),
k_content: k_alertSettingsForm
},
{
k_id: 'k_snmpForm',
k_caption: 'SNMP',
k_content: k_snmpForm
}
],
k_onTabChange: function(k_tabPage, k_currentTabId) {
kerio.adm.k_framework._k_setHelpQuery(k_tabPage.k_id + '_' + k_currentTabId);
}
};

if (!k_isAuditor) {
k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function(k_toolbar, k_button){
var k_tabPage = k_toolbar.k_relatedWidget;
if (k_tabPage.k_isValid()) {
k_tabPage.k_saveBatchData(k_button.k_isFiredByEvent);
return false;
}
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return true;
}, 
k_onReset: function(k_toolbar, k_button){
k_toolbar.k_relatedWidget.k_loadBatchData();
} }; k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
k_tabPageCfg.k_toolbars = {
k_bottom: k_toolbar
};
}
k_tabPage = new k_lib.K_TabPage(k_objectName, k_tabPageCfg);
if (!k_isAuditor) {
k_tabPage.k_toolbar = k_toolbar;
}
k_tabPage.k_addReferences({
k_starForm: k_starForm,
k_statisticsForm: k_statisticsForm,
k_userExceptionGrid: k_userExceptionGrid, k_alertSettingsForm: k_alertSettingsForm,
k_alertSettingsGrid: k_alertSettingsGrid,
k_reportRecipientGrid: k_reportRecipientGrid,
k_snmpForm: k_snmpForm,
k_isAuditor: k_isAuditor
});
k_shared.k_methods.k_addBatchControllers(k_tabPage, [k_starForm, k_statisticsForm, k_alertSettingsForm, k_snmpForm]);
this.k_addControllers(k_tabPage);
return k_tabPage;
}, 
k_addControllers: function(k_kerioWidget){
var K_ListLoader = kerio.waw.shared.k_methods.K_ListLoader;

k_kerioWidget.k_applyParams = function() {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
kerio.waw.status.k_currentScreen.k_gotoTab(this, 'k_starForm');
kerio.waw.requests.k_sendNow();
this.k_loadBatchData();
}; k_kerioWidget.k_starForm.k_addReferences({
k_parent: k_kerioWidget,
k_selectReportLanguage: k_kerioWidget.k_starForm.k_getItem('starReportLanguage'),
k_reportSendRequest: k_kerioWidget.k_reportSendRequest,
_k_loadRequests: null,
_k_saveRequests: [
{
k_method: 'Accounting.set',
k_params: null
},
{
k_method: 'StarReports.set',
k_params: null
}
],
k_validTimeRange: new K_ListLoader({
k_list: 'k_timeRangeList',
k_select: 'validTimeRange',
k_form: k_kerioWidget.k_starForm
}),
k_ipAddressGroup: new K_ListLoader({
k_list: 'k_ipAddressGroupList',
k_select: 'ipAddressGroup',
k_form: k_kerioWidget.k_starForm,
k_excludingNoneOption: true
}),
k_urlGroup: new K_ListLoader({
k_list: 'k_urlGroupList',
k_select: 'urlGroup',
k_form: k_kerioWidget.k_starForm,
k_excludingNoneOption: true
}),

k_getLoadRequests: function(k_canReloadData) {
if (!k_canReloadData) {
return [];
}
var k_requests = this._k_loadRequests;
if (!k_requests) {
this._k_loadRequests = [
{
k_method: 'Accounting.get',
k_callback: this.k_applyParams
},
{
k_method: 'SmtpRelay.get',
k_callback: this.k_smtpCallback
}
];
k_requests = this._k_loadRequests;
}
return this._k_loadRequests;
},
k_applyParams: function(k_params) {
var
k_methods = kerio.waw.shared.k_methods,
k_config = k_params.config,
k_tabPage = this.k_parent;
kerio.waw.shared.k_data.k_get('k_timeRanges');
kerio.waw.shared.k_data.k_get('k_ipAddressGroups');
kerio.waw.shared.k_data.k_get('k_urlGroups');
kerio.waw.shared.k_data.k_cache({
k_screen: k_tabPage,
k_stores: ['k_domains', 'k_users', 'k_groups'],
k_dialogs: ['selectItems', 'alertEditor', 'starAccessEditor']
});
if('detect' === k_config.starReportLanguage || '' === k_config.starReportLanguage) {
k_config.starReportLanguage = kerio.waw.status.k_userSettings.k_get('calculatedLanguage');
}
this.k_reset();
this.k_dataStore = {
k_gatheredGroups: k_config.gatheredGroups,
k_userExceptions: k_config.userExceptions
};
k_config.k_gatheredGroups = k_methods.k_parseUserReferenceListToNames(k_config.gatheredGroups);
k_config.k_userExceptions = k_methods.k_parseUserReferenceListToNames(k_config.userExceptions) || kerio.lib.k_tr('None', 'common');
this.k_setData(k_config, true);
this.k_getParentWidget().k_statisticsForm.k_setData(k_config, true);
this.k_validTimeRange.k_selectValue(k_methods.k_prepareListValue(k_config.validTimeRange), true);
this.k_ipAddressGroup.k_selectValue(k_methods.k_prepareListValue(k_config.ipAddressGroup), true);
this.k_urlGroup.k_selectValue(k_methods.k_prepareListValue(k_config.urlGroup), true);
},
_k_prepareListValue: function(k_optionalIdReference) {
var
k_enabled = k_optionalIdReference.enabled,
k_value   = k_optionalIdReference.value; if (!k_enabled) {
k_value = {
k_id: kerio.waw.shared.k_DEFINITIONS.k_NONE
};
}
return k_value;
},

k_getSaveRequests: function() {
this._k_saveRequests[0].k_params = this.k_saveData();
this._k_saveRequests[1].k_params = this.k_saveRecipientGridData();
return this._k_saveRequests;
}, 
k_saveData: function() {
var
k_tabPage = this.k_parent,
k_statisticsForm = k_tabPage.k_statisticsForm,
k_data = this.k_getData(true),
k_secondTabData = k_statisticsForm.k_getData(true),
k_timeRange = this.k_validTimeRange.k_getValue(),
k_ipGroup   = this.k_ipAddressGroup.k_getValue(),
k_urlGroup  = this.k_urlGroup.k_getValue();
k_data.validTimeRange = {
enabled: ('' !== k_timeRange.id),
value: k_timeRange
};
k_data.ipAddressGroup = {
enabled: ('' !== k_ipGroup.id),
value: k_ipGroup
};
k_data.urlGroup = {
enabled: ('' !== k_urlGroup.id),
value: k_urlGroup
};
k_data.userExceptions = this.k_dataStore.k_userExceptions;
k_data.gatheredGroups = this.k_dataStore.k_gatheredGroups;
delete k_data.k_gatheredGroups;
delete k_data.k_userExceptions;
k_data.starReportLanguage = k_secondTabData.starReportLanguage;
k_data.userFormat = k_secondTabData.userFormat;
return {config: k_data};
}, 
k_saveRecipientGridData: function() {
var
k_reportRecipientGrid = this.k_parent.k_reportRecipientGrid,
k_tabData = this.k_parent.k_statisticsForm.k_getData(true),
k_data = k_reportRecipientGrid.k_getData(),
k_gatheredGroups,
k_gatheredGroupTemp = [],
k_i, k_cnt,
k_row,
k_j, k_cnt2,
k_item;
k_gatheredGroups = this.k_dataStore.k_gatheredGroups || [];
k_cnt = k_gatheredGroups.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_gatheredGroups[k_i];
k_gatheredGroupTemp[k_item.id] = k_item;
}
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_row = k_data[k_i];
k_row.usersRenderer = k_row.usersRenderer || [];
k_cnt2 = k_row.usersRenderer.length;
k_row.users = [];
for (k_j = 0; k_j < k_cnt2; k_j++) {
k_item = k_row.usersRenderer[k_j];
if (k_item.isGroup && undefined === k_gatheredGroupTemp[k_item.id]) {
k_gatheredGroups.push(k_item);
}
if (true !== k_item.allData && !k_item.k_isNothing) {
k_row.users.push(k_item);
}
}
delete k_row.onlineAccess;
delete k_row.usersRenderer;
delete k_row.reportConfigRenderer;
}
delete k_tabData.starReportLanguage;
delete k_tabData.userFormat;
return {
reports: k_data,
allUsers: k_tabData.allUsers
};
},

k_saveRow: function(k_rowData, k_rowIndex) {
if (undefined === k_rowIndex) {
this.k_appendRow(k_rowData);
}
else {
this.k_updateRow(k_rowData, k_rowIndex);
}
this.k_resortRows(); kerio.adm.k_framework.k_enableApplyReset();
return true;
},

k_deleteStarData: function(k_response) {
if ('no' === k_response) {
return;
}
kerio.lib.k_ajax.k_request({
k_requestOwner: null, k_jsonRpc: {
method: 'Storage.remove',
params: {
type: kerio.waw.shared.k_CONSTANTS.StorageDataType.StorageDataStar
}
},
k_onError: function() {
return true;
},
k_callback: function(k_response) {
if (k_response.k_isOk) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Information', 'common'),
k_msg: kerio.lib.k_tr('All statistics data have been removed successfully.', 'accountingList'),
k_icon: 'info'
});
return;
}
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Warning', 'common'),
k_msg: kerio.lib.k_tr('Unable to delete statistics data.', 'accountingList'),
k_icon: 'warning'
});
},
k_scope: this
});
}, 
k_smtpCallback: function(k_data) {
this.k_smtpRequest = this.k_smtpRequest || kerio.waw.shared.k_DEFINITIONS.k_get('k_smtpServer').k_request;
this.k_smtpRequest.k_callback.call(this.k_parent.k_statisticsForm, k_data);
this.k_smtpRequest.k_callback.call(this.k_parent.k_alertSettingsForm, k_data);
},

k_userExceptionsCallback: function(k_list) {
this.k_userExceptions.k_setValue(kerio.waw.shared.k_methods.k_parseUserReferenceListToNames(k_list) || kerio.lib.k_tr('None', 'common'));
this.k_dataStore.k_userExceptions = k_list;
},

k_gatheredGroupsCallback: function(k_list) {
var
k_reportGrid = this.k_getMainWidget().k_reportRecipientGrid,
k_reportGridData = k_reportGrid.k_getData(),
k_gatheredGroupTemp = [],
k_change = false,
k_users,
k_i, k_cnt,k_item,
k_j, k_cnt2, k_row;
this.k_gatheredGroups.k_setValue(kerio.waw.shared.k_methods.k_parseUserReferenceListToNames(k_list));
this.k_dataStore.k_gatheredGroups = k_list;
k_cnt = k_list.length; for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_list[k_i];
k_gatheredGroupTemp[k_item.id] = k_item;
}
k_cnt = k_reportGridData.length;  for (k_i = 0; k_i < k_cnt; k_i++) {
k_row = k_reportGridData[k_i];
k_row.usersRenderer = k_row.usersRenderer || [];
k_cnt2 = k_row.usersRenderer.length;
k_users = kerio.lib.k_cloneObject(k_row.usersRenderer);
for (k_j = 0; k_j < k_cnt2; k_j++) {
k_item = k_users[k_j];
if (k_item.isGroup && undefined === k_gatheredGroupTemp[k_item.id]) {
k_users.splice(k_j, 1);
k_change = true;
k_j--;
k_cnt2--;
}
}
k_row.usersRenderer = k_users;
}
if (k_change) {
k_reportGrid.k_setData(k_reportGridData);
k_reportGrid.k_resortRows();
}
}
}); k_kerioWidget.k_starForm.k_validTimeRange.k_sendRequest();
k_kerioWidget.k_starForm.k_ipAddressGroup.k_sendRequest();
k_kerioWidget.k_starForm.k_urlGroup.k_sendRequest();
k_kerioWidget.k_statisticsForm.k_addReferences({
k_parent: k_kerioWidget,
k_reportRecipientGrid: k_kerioWidget.k_reportRecipientGrid,
k_linkToStar: k_kerioWidget.k_statisticsForm.k_getItem('k_linkToStar'),
k_selectReportLanguage: k_kerioWidget.k_statisticsForm.k_getItem('starReportLanguage'),
k_reportSendRequest: undefined,
_k_loadRequests: null,

k_getLoadRequests: function(k_canReloadData) {
if (!k_canReloadData) {
return [];
}
var k_requests = this._k_loadRequests;
if (!k_requests) {
this._k_loadRequests = [
{
k_method: 'StarReports.get',
k_callback: this.k_recipientsCallback
}
];
k_requests = this._k_loadRequests;
}
this.k_linkToStar.k_setValue({k_url: kerio.waw.shared.k_DEFINITIONS.k_CONTROL_URL.k_getWebifaceUrl()});
return this._k_loadRequests;
},

k_recipientsCallback: function(k_response) {
var
k_data = k_response.list || [],
k_item,
k_i, k_cnt;
k_cnt = k_data.length;
if (0 < k_cnt) {
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_data[k_i];
k_item.usersRenderer = kerio.lib.k_cloneObject(k_item.users) || [];
k_item.onlineAccess = k_item.reportConfig.onlineAccess;
if (k_item.allData) {
k_item.usersRenderer.splice(0, 0, {allData: k_item.allData});
}
if (0 === k_item.usersRenderer.length) {
k_item.usersRenderer.push({k_isNothing: true});
}
}
this.k_reportRecipientGrid.k_setData(k_data);
this.k_reportRecipientGrid.k_extWidget.on('afterrender', function() {
this.k_resortRows.defer(100, this);
}, this.k_reportRecipientGrid);
this.k_setData(k_response);
}
else {
this.k_reportRecipientGrid.k_clearData();
}
this.k_setInactiveMessage();
this.k_reportRecipientGrid.k_stopTracing();
this.k_reportRecipientGrid.k_startTracing();
},

k_setInactiveMessage: function() {
var
k_grid = this.k_reportRecipientGrid;
k_grid.k_statusbar.k_switchConfig('k_noMessage');
k_grid.k_getData().some(function(currentData) {
if (0 === currentData.usersRenderer.length || currentData.usersRenderer[0].k_isNothing) {
this.k_statusbar.k_switchConfig('k_ruleInactive');
return true;
}
}, k_grid);
},

k_sendAgainCallback: function(k_response) {
var
k_grid = this.k_reportRecipientGrid,
k_rows = k_grid.k_selectionStatus.k_rows,
k_cnt = k_grid.k_selectionStatus.k_selectedRowsCount,
k_reports = [],
k_i = 0;
if ('no' === k_response && 0 <= k_cnt) {
return;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_reports.push(k_rows[k_i].k_data);
}
if (!this.k_reportSendRequest) {
this.k_reportSendRequest = {
k_requestOwner: null, k_jsonRpc: {
method: 'StarReports.send',
params: {
reports: k_reports,
language: k_grid.k_getMainWidget().k_statisticsForm.k_selectReportLanguage.k_getValue()
}
},
k_onError: function() {
return true;
},
k_callback: function(k_response) {
var
k_translateErrorMessage = kerio.waw.shared.k_methods.k_translateErrorMessage,
k_errorsText = [],
k_decoded = k_response.k_decoded || [],
k_errors,
k_i, k_cnt;
if (k_response.k_isOk) {
k_errors = k_decoded.errors || [];
if (0 === k_errors.length) {
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Information', 'common'),
k_msg: kerio.lib.k_tr('The reports have been sent.', 'accountingList'),
k_icon: 'info'
});
} else {
k_cnt = k_errors.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_errorsText.push(k_translateErrorMessage(k_errors[k_i]));
}
k_errorsText = k_errorsText.join('<br />');
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Warning', 'common'),
k_msg: k_errorsText,
k_icon: 'warning'
});
}
return;
}
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Warning', 'common'),
k_msg: kerio.lib.k_tr('Unable to send reports!', 'accountingList'),
k_icon: 'warning'
});
},
k_scope: this
};
}
else {
this.k_reportSendRequest.k_jsonRpc.params.reports = k_reports;
this.k_reportSendRequest.k_jsonRpc.params.language = k_grid.k_parentWidget.k_form.k_selectReportLanguage.k_getValue();
}
kerio.lib.k_ajax.k_request(this.k_reportSendRequest);
}}); k_kerioWidget.k_alertSettingsForm.k_addReferences({
k_parent: k_kerioWidget,
k_ALERT_MESSAGES_ACTIONS: kerio.waw.shared.k_CONSTANTS.k_ALERT_MESSAGES_ACTIONS,
k_usedDestinations: {},
k_smtpServer: '',
k_data: {},
_k_loadRequests: null,
_k_SAVE_REQUESTS_GRID: 0,
_k_SAVE_REQUESTS_FORM: 1,
_k_saveRequests: [
{
k_method: 'Alerts.setSettings',
k_params: {}
},
{
k_method: 'Alerts.setDefaultLanguage',
k_params: {}
}
],

k_getLoadRequests: function(k_canReloadData, k_isUserCalled) {
if (!k_canReloadData) {
return [];
}
var k_requests = this._k_loadRequests;
if (!k_requests) {
this._k_loadRequests = [
{
k_method: 'Alerts.getSettings',
k_callback: this.k_settingsCallback
},
{
k_method: 'Alerts.getDefaultLanguage',
k_callback: this.k_settingsLangCallback
}
]; k_requests = kerio.lib.k_cloneObject(this._k_loadRequests);
k_requests.unshift({
k_method: 'Alerts.getAlertTypes',
k_callback: this.k_alertTypesCallback
});
if (!kerio.waw.shared.k_methods.k_isAuditor()) {
this.k_alertSettingsGrid.k_toolbars.k_bottom.k_setDialogAdditionalParams({
k_saveCallback: this.k_saveRow
});
}
}
return k_requests;
},
k_alertTypesCallback: function(k_data) {
var
k_grid = this.k_alertSettingsGrid,
k_tr = kerio.lib.k_tr,
k_i, k_cnt,
k_types;
k_types = k_data.types || [];
k_cnt = k_types.length;
k_grid.k_alertTypes = {};
for (k_i = 0; k_i < k_cnt; k_i++) {
k_grid.k_alertTypes[k_types[k_i].id] = k_tr(k_types[k_i].name, 'serverMessages');
}
k_grid.k_alertTypesList = k_types;
kerio.waw.ui.accountingList.k_alertTypesList = k_types; },

k_settingsCallback: function(k_data) {
var
k_grid = this.k_alertSettingsGrid,
k_gridData = k_data.config,
k_i, k_rowCnt,
k_row;
k_data.config = k_data.config || [];
if (k_gridData.length) {
for (k_i = 0, k_rowCnt = k_data.config.length; k_i < k_rowCnt; k_i++) {
k_row = k_gridData[k_i];
k_gridData[k_i] = k_grid.k_fillAlertListRenderer(k_row);
}
k_grid.k_setData(k_gridData);
}
else {
k_grid.k_clearData();
}
this.k_setInactiveMessage();
k_grid.k_stopTracing();
k_grid.k_startTracing(); },

k_settingsLangCallback: function(k_data) {
if('' === k_data.lang) {
k_data.lang = kerio.waw.status.k_userSettings.k_get('calculatedLanguage');
}
this.k_data = k_data;
this.k_setData(k_data, true);
},

k_getSaveRequests: function() {
var
k_grid = this.k_alertSettingsGrid,
k_saveRequest = [];
if (this.k_isChanged() || '' === this.k_data.lang) {
this._k_saveRequests[this._k_SAVE_REQUESTS_FORM].k_params = this.k_getData();
k_saveRequest.push(this._k_saveRequests[this._k_SAVE_REQUESTS_FORM]);
}
if (k_grid.k_isChanged() ) {
this._k_saveRequests[this._k_SAVE_REQUESTS_GRID].k_params = this.k_saveData();
k_saveRequest.push(this._k_saveRequests[this._k_SAVE_REQUESTS_GRID]);
}
return k_saveRequest;
},

k_saveData: function() {
var
k_grid = this.k_alertSettingsGrid,
k_data = k_grid.k_getData(true),
k_cnt, k_i;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
delete k_data[k_i].k_alertRendered;
}
return {config: k_data};
},

k_setInactiveMessage: function() {
var
k_grid = this.k_alertSettingsGrid;
k_grid.k_statusbar.k_switchConfig('k_noMessage');
k_grid.k_getData().some(function(currentData) {
if (0 === currentData.alertListRenderer.length || currentData.alertListRenderer[0].k_isNothing || currentData.validTimeRange.invalid) {
this.k_statusbar.k_switchConfig('k_ruleInactive');
return true;
}
}, k_grid);
},

k_saveRow: function(k_rowData, k_rowIndex) {
if (undefined === k_rowIndex) {
this.k_appendRow(k_rowData);
}
else {
this.k_updateRow(k_rowData, k_rowIndex);
}
this.k_alertSettingsForm.k_setInactiveMessage();
this.k_resortRows(); kerio.adm.k_framework.k_enableApplyReset();
return true;
}
}); 
k_kerioWidget.k_reportRecipientGrid.k_usersLineRenderer = function(k_value, k_data, k_rowIndex, k_colIndex, k_grid, k_itemIndex) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_displayLimit = k_WAW_CONSTANTS.k_LIMIT_MULTILINE_LIST_RENDERER - 1, k_iconCls = 'icon',
k_isLimited,
k_rendererOutput,
k_rowData,
k_tooltip,
k_cnt;
k_data.usersRenderer = k_data.usersRenderer || [];
k_cnt = k_data.usersRenderer.length - k_displayLimit;
k_isLimited = (k_displayLimit === k_itemIndex && 1 < k_cnt); if (k_value.allData) {
k_rowData = k_grid.k_allDataText;
k_iconCls += ' starDataIcon';
}
else if (k_value.k_isNothing){
k_rowData = k_grid.k_noDataText;
k_iconCls = 'gridListIcon objectNothing invalid';
}
else {
if (k_isLimited) {
k_rowData = kerio.lib.k_tr('…and %1 more', 'accountingList', {k_args:[k_cnt]});
k_iconCls = '';
k_tooltip = kerio.lib.k_htmlEncode(
kerio.waw.shared.k_methods.k_joinReferenceList(
{	k_referenceList: k_data.usersRenderer,
k_start: k_displayLimit,
k_method: k_WAW_METHODS.k_createReferencedUserName,
k_grid: k_grid,
k_stringProperty: 'k_userName'
}
)
);
}
else {
k_rendererOutput = k_WAW_METHODS.k_createReferencedUserName(k_value);
k_rowData = k_rendererOutput.k_userName;
if (k_value.isGroup) {
k_rowData = k_grid.k_groupDataText + ' ' + k_rowData;
k_iconCls += ' groupDataIcon';
}
else {
k_rowData = k_grid.k_userDataText + ' ' + k_rowData;
k_iconCls += ' userDataIcon';
}
}
}
return {
k_isSecure: k_isLimited,
k_data: k_rowData,
k_iconCls: k_iconCls,
k_dataTooltip: k_tooltip,
k_iconTooltip: k_tooltip
};
};
k_kerioWidget.k_snmpForm.k_addReferences({
k_parent: k_kerioWidget,
_k_loadRequests: null,
_k_saveRequests: [
{
k_method: 'Snmp.set',
k_params: {}
}
],

k_getLoadRequests: function(k_canReloadData) {
if (!k_canReloadData) {
return [];
}
if (!this._k_loadRequests) {
this._k_loadRequests = [
{
k_method: 'Snmp.get',
k_callback: this.k_applyParams
}
];
}
return this._k_loadRequests;
},

k_applyParams: function(k_params) {
var
k_data = k_params.settings || {},
k_initPasswordField = kerio.waw.shared.k_methods.k_initPasswordField;
this.k_originalData = k_data;
this.k_setData(k_data, true);
this.k_changeVersion(k_data.version);
k_initPasswordField(this.k_passwordField);
k_initPasswordField(this.k_communityField);
if (k_data.password && false === k_data.password.isSet) {
this.k_passwordField.k_setAllowBlank(false);
}
if (k_data.community && false === k_data.community.isSet) {
this.k_communityField.k_setAllowBlank(false);
}
},

k_changeVersion: function(k_newVersion) {
var
k_shared =  kerio.waw.shared,
k_isVersion3 = k_shared.k_CONSTANTS.SnmpVersion.SnmpV3 === k_newVersion;
this.k_isVersion3 = k_isVersion3;
this.k_v2cConfiguration.k_setDisabled(k_isVersion3);
this.k_v3Configuration.k_setDisabled(!k_isVersion3);
},

k_getSaveRequests: function() {
var
k_data = this.k_originalData;
kerio.waw.shared.k_methods.k_mergeObjects(this.k_getData(), k_data);
if (k_data.password && 0 === k_data.password.value.length) {
delete k_data.password;
}
if (k_data.community && 0 === k_data.community.value.length) {
delete k_data.community;
}
this._k_saveRequests[0].k_params.settings = k_data;
return this._k_saveRequests;
}
});
} }; 