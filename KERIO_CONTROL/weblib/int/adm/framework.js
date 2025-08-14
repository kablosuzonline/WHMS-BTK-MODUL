

kerio.adm = {

_k_builtInWidgets: [
'logs',
'logExport',
'logFind',
'logHighlighting',
'logMessages',
'logSettings',
'productRegistration',
'htmlDialog',
'definitionDialog',
'certificateList',
'certificateDetail',
'certificateImport',
'certificatePassword',
'certificateRequest',
'welcomeBeta',
'welcomeTrial',
'splashScreen',
'licenseInstall',
'reportProblem',
'suggestIdea',
'crashReport',
'domainServices',
'myKerioSettings'
],

_k_logList: [],

k_framework: null,

k_emailRegExp: new RegExp('^([a-zA-Z0-9_\\.-]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,5}|[0-9]{1,3})$'),

k_widgets: {},

k_fireOuterWebPageCallback: function(k_search) {
var
k_params = kerio.lib.k_getUrlParams(k_search),
k_outerWebPageWidget;
if (!k_params || !k_params.token) {
kerio.lib.k_warn('k_fireOuterWebPageCallback called with wrong arguments: ' + k_search);
return;
}
k_outerWebPageWidget = kerio.lib.k_getWidgetById(k_params.token);
if (k_outerWebPageWidget) {
k_outerWebPageWidget.k_fireCallback(k_params);
}
else {
kerio.lib.k_warn('k_fireOuterWebPageCallback called with invalid token: ' + k_params.token);
}
},

_k_kbMapping: null,

k_getKbLink: function (k_articleName, k_linkText) {
var
k_lib = kerio.lib,
k_url;
k_url = kerio.adm.k_getKbLinkUrl(k_articleName);
k_linkText = undefined === k_linkText ? k_lib.k_tr('Learn more…', 'wLibCommon') : k_linkText;
return [
'<a target="_blank" href="',
k_url,
'">',
k_linkText,
'</a>'
].join('');
},

k_getKbLinkUrl: function (k_articleName) {
var
k_kbUrl = 'http://kb.kerio.com/',
k_isNumericId = 'number' === typeof k_articleName,
k_lib = kerio.lib,
k_url;
if (!k_isNumericId) {
if (String(parseInt(k_articleName, 10)) === k_articleName) {
k_isNumericId = true;
}
}
if (k_isNumericId) {
k_url = k_kbUrl + k_articleName;
}
else {
k_url = [
k_kbUrl,
'show-article/?',
'product=' + k_lib.k_getSharedConstants('k_PRODUCT_NAME').toLowerCase().replace('kerio ', ''),
'&article=' + k_articleName,
'&lang=' + k_lib.k_engineConstants.k_CURRENT_LANGUAGE,
'&buildversion=' + k_lib.k_getSharedConstants('k_ENGINE_VERSION')
].join('');
}
return k_url;
}
};

kerio.adm.k_framework = {
_k_lastWidget: null,

k_firstFocusableItemIndex: 1,


















_k_iPadMinMenuWidth: 50,

k_init: function(k_config) {
var k_lib = kerio.lib,
k_builtInWidgets = kerio.adm._k_builtInWidgets,
k_isIPadCompatible = (true === k_lib.k_isIPadCompatible),
k_isProductMenu = (true === k_config.k_menuTree.k_useTabs),
k_leftPane,
k_titleBarHeight,
k_builtInWidgetName,
k_titleBar,
k_menuTree,
k_layoutConfig,
k_mainLayout,
k_i,
k_cnt;
if (k_isProductMenu) {
this._k_historyInit(k_config.k_onHistoryChange);
}
for (k_i = 0, k_cnt = k_builtInWidgets.length; k_i < k_cnt; k_i++) {
k_builtInWidgetName = k_builtInWidgets[k_i];
k_config.k_uiNamespace[k_builtInWidgetName] = kerio.adm.k_widgets[k_builtInWidgetName];
}
this._k_uiCacheManager = k_lib.k_uiCacheManager;  this._k_uiCacheManager.k_init({k_uiNamespace: k_config.k_uiNamespace});
this._k_userRole = k_config.k_userRole;
if (k_config.k_logout.k_url) {
this._k_logoutUrl = k_config.k_logout.k_url;
if (-1 !== this._k_logoutUrl.indexOf('#')) {
kerio.lib.k_reportError('Internal error: The logout url contains hash, the bookmarks may not work properly.', 'adm/framework.js');
}
}
else {
this._k_logoutRequestCfg = k_config.k_logout.k_requestCfg || {};
}
k_titleBar = this._k_createTitleBar(k_config);
k_config.k_menuTree.k_onBeforeSwitchScreen = k_config.k_onBeforeSwitchScreen;
if (k_isProductMenu) {
this._k_onTreeNodeClick = this._k_onTreeNodeClick.createSequence(
kerio.adm.k_widgets.k_productMenu.prototype._k_onTreeNodeClick
);
k_menuTree = new kerio.adm.k_widgets.k_productMenu('k_admMenuTree', this._k_prepareTreeCfg(k_config.k_menuTree));
k_leftPane = {
k_showSplitter: !k_isIPadCompatible,
k_isCollapsed: k_isIPadCompatible,
k_forceLayout: true,
k_hideCollapseTool: true,
k_isAnimatedSplit: false
};
k_titleBarHeight = k_isIPadCompatible ? 30 : 44;
}
else {
k_menuTree = new k_lib.K_Tree('k_admMenuTree', this._k_prepareTreeCfg(k_config.k_menuTree));
k_menuTree.k_width = k_menuTree.k_extWidget.width;
k_leftPane = {
k_showSplitter: true
};
k_titleBarHeight = 44;
}
k_leftPane.k_id = 'k_leftPane';
k_leftPane.k_isCollapsible = k_isIPadCompatible;
k_leftPane.k_content = k_menuTree;
k_leftPane.k_iniSize = k_menuTree.k_width;
k_layoutConfig = {
k_isBrowserWindow: true,
k_horLayout: {
k_items: [
k_leftPane,
{k_verLayout: {
k_className: k_isProductMenu ? 'centralPane' : '',
k_items: [
{k_id: 'k_topPane', k_className: 'k_topPane', k_content: k_titleBar, k_iniSize: k_titleBarHeight},
{k_id: 'k_mainPane', k_hasMorePages: true}
]
}}
]
}
};
k_mainLayout = new k_lib.K_Layout('k_admDesktop', k_layoutConfig);
k_mainLayout.k_firstFocusableItemIndex = this.k_firstFocusableItemIndex;
k_mainLayout.k_menuTree = k_menuTree;
k_mainLayout.k_showLoading = this._k_showLoading;
if (k_isProductMenu) {
k_menuTree._k_afterLayoutRender();
}
else if (k_isIPadCompatible) {
this._k_modifyForIPad(k_mainLayout);
}
this._k_mainLayout = k_mainLayout;
this.k_uiNamespace = k_config.k_uiNamespace;
this._k_isProductMenu = k_isProductMenu;
this._k_confirmDlgStrings = {
k_title: k_lib.k_tr('Confirm', 'wlibAlerts'),
k_message: k_lib.k_tr('You have modified data in this section.', 'wlibAlerts') + '\n'
+ k_lib.k_tr('Do you want to save changes?', 'wlibAlerts'),
k_unloadMessage: k_lib.k_tr('You have modified data in this section.', 'wlibAlerts') + '\n'
+ k_lib.k_tr('If you continue, all changes will be lost.', 'wlibAlerts')
};

if (undefined === k_config.k_menuTree.k_onBeforeSwitchScreen) {
window.onbeforeunload = function(event) {
var k_framework = kerio.adm.k_framework;
if (k_framework.k_isDialogChanged() || k_framework.k_isScreenChanged()) {
return k_framework._k_confirmDlgStrings.k_unloadMessage;
}
else {
k_framework._k_abortAllRequestsBeforeUnload();
k_framework._k_saveSettingsOnUnload();
}
};
}
if (k_config.k_callResetOnLeaveScreen) {
this._k_callResetOnLeaveScreen = true;
}
if (this._k_automaticMenuTreeSelection) {
this._k_mainLayout.k_menuTree.k_selectNode(this._k_automaticMenuTreeSelection);
if (this._k_mainLayout.k_menuTree._k_lastNode.id === this._k_automaticMenuTreeSelection) {
this._k_historyChangedByApplication = true;
Ext.History.fireEvent('change', this._k_automaticMenuTreeSelection);
}
}
delete this._k_historyInit;
delete this._k_createTitleBar;
delete this._k_createUserMenuItems;
delete this._k_createSupportedLanguages;
delete this._k_prepareTreeCfg;
delete this._k_modifyNodeCfg;
delete this._k_createHelpActions;
delete this._k_modifyForIPad;
delete this._k_onIPadMaximizeScreen; 
delete this._k_onIPadRestoreScreen;
}, 
_k_saveSettingsOnUnload: function () {
var
k_lib = kerio.lib,
k_defaultRequestParams,
k_i, k_cnt,
k_currentSettings,
k_dialogs,
k_dialog,
k_settings,
k_width,
k_request,
k_xhr,
k_headers,
k_headerName;
if (!k_lib.k_isStateful) {
return;
}
k_dialogs = k_lib._k_windowManager._k_stack;
k_settings = null;
for (k_i = 0, k_cnt = k_dialogs.getCount(); k_i < k_cnt; k_i++) {
k_dialog = k_dialogs.itemAt(k_i);
if (k_dialog instanceof kerio.lib.K_Dialog) {
k_currentSettings = k_lib._k_prepareSettings(k_dialog);
if (null !== k_currentSettings) {
k_settings = k_lib.k_cloneObject(k_settings || {}, k_currentSettings);
}
}
}
k_currentSettings = k_lib._k_prepareSettings(kerio.adm.k_framework._k_mainLayout);
if (null !== k_currentSettings) {
if (kerio.lib.k_isIPadCompatible) {
try {
k_width = k_currentSettings.settings[kerio.lib._k_settings.k_root].admMenuTree.width;
if (this._k_mainLayout.k_extWidget.layout.west.isCollapsed) {
k_width = this._k_mainLayout.k_menuTree.k_expandedWidth || 0;
}
k_currentSettings.settings[kerio.lib._k_settings.k_root].admMenuTree.width = Math.max(this._k_iPadMinMenuWidth, k_width);
}
catch (k_ex) {}
}
k_settings = k_lib.k_cloneObject(k_settings || {}, k_currentSettings);
}
if (null === k_settings) { return;
}
k_xhr = null;
if (window.XMLHttpRequest) {
k_xhr = new window.XMLHttpRequest();
}
else if (window.ActiveXObject) {
k_xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
}
if (!k_xhr) {
return;
}
k_request = k_lib.k_jsonEncode({
jsonrpc: '2.0',
id: 1,
method: 'Session.setSettings',
params: k_settings
});
k_defaultRequestParams = k_lib.k_ajax.k_getDefaultRequestParams();
k_xhr.open('POST', k_defaultRequestParams.k_url, false);
k_headers = k_defaultRequestParams.k_headers;
if (k_headers) {
for(k_headerName in k_headers) {
if (k_headers.hasOwnProperty(k_headerName)) {
k_xhr.setRequestHeader(k_headerName, k_headers[k_headerName]);
}
}
}
else {
k_xhr.setRequestHeader('Content-Type', 'application/json-rpc');
k_xhr.setRequestHeader('Accept', 'application/json-rpc');
k_xhr.setRequestHeader('X-Token', k_lib.k_ajax.k_getToken());
}
if (k_lib.k_isMSIE && !k_lib.k_isMSIE7) { k_xhr.timeout = 3000; }
k_xhr.send(k_request);
},

_k_historyInit: function(k_onHistoryChangeConfig) {
var
k_historyForm;
k_historyForm = document.createElement('form');
k_historyForm.setAttribute('id', 'history-form');
k_historyForm.setAttribute('class', 'x-hide-display');
k_historyForm.innerHTML = '<input type="hidden" id="x-history-field" /><iframe id="x-history-frame"></iframe>';
document.body.appendChild(k_historyForm);
Ext.History.init();
this._k_onHistoryChange = k_onHistoryChangeConfig;
Ext.History.on('change', function(k_newSection) {
if (!this._k_historyChangedByApplication) {
if (kerio.lib._k_windowManager._k_stack.items.length > 0) {
return;
}
this._k_mainLayout.k_menuTree.k_selectNode(k_newSection);
}
delete this._k_historyChangedByApplication;
if (this._k_onHistoryChange) {
this._k_onHistoryChange(k_newSection);
}
}, this);
kerio.lib._k_windowManager.k_onWindowHide = kerio.lib._k_windowManager.k_onWindowHide.createSequence(function(k_dialog) {
Ext.History.suspendEvents();
Ext.History.add(this._k_mainLayout.k_menuTree._k_lastNode.id);
Ext.History.resumeEvents.defer(100, Ext.History); });
},

_k_createTitleBar: function(k_config) {
var
k_userMenuCfg = k_config.k_userMenu,
k_titleBarCfg,
k_titleBar;
k_titleBarCfg = {
k_className: 'admTitleBar',
k_items: [
'<span id="k_admTitleBarCaption" class="admTitleBarCaption"><img src="' + Ext.BLANK_IMAGE_URL + '"/>&nbsp;<span id="k_admTitleBarCaptionText"></span></span>',
'<span id="k_admTitleBarAddInfo"></span>',
'->',    '<div id="k_admTitleBarCustomButton" />',
'<div id="k_admTitleBarAdditionalStaticButton" />',
' '
]
};
if (k_config.k_hasSpotlight) {
k_titleBarCfg.k_items.push(new kerio.adm.k_widgets.K_SearchSpotlight());
}
k_titleBarCfg.k_items.push({
k_id: 'k_admUserMenu',
k_isMenuButton: true,
k_minWidth: 20,
k_caption: kerio.lib.k_htmlEncode(k_userMenuCfg.k_caption),
k_title: k_userMenuCfg.k_title || '',
k_className: 'userMenu',
k_items: this._k_createUserMenuItems(k_config)
});
k_titleBar = new kerio.lib.K_Toolbar('k_admTitleBar', k_titleBarCfg);
return k_titleBar;
},

_k_createUserMenuItems: function(k_config) {
var
k_items = [{
k_id: 'k_admLanguageMenu',
k_caption: kerio.lib.k_tr('Change language', 'wlibCommon'),
k_onClick: this._k_setLanguage,
k_items: this._k_createSupportedLanguages(k_config.k_language),
k_className: 'userMenuFlag', k_iconCls: 'flag ' + k_config.k_language.k_current
}],
k_customUserMenuItem = k_config.k_customUserMenuItem,
k_helpMenuItems;
if (kerio.lib.k_isIPad) {
delete k_config.k_language.k_title;
}
if (k_customUserMenuItem) {
if (!(k_customUserMenuItem instanceof Array)) {
k_customUserMenuItem = [k_customUserMenuItem];
}
k_items = k_items.concat(k_customUserMenuItem);
}
if (k_config.k_help) {
k_helpMenuItems = this._k_createHelpActions(k_config.k_help, k_config.k_language.k_current);
k_items = k_items.concat(k_helpMenuItems);
kerio.lib.k_setHelpHandler(this.k_showHelp);
}
if (!kerio.lib.k_isMyKerio) {
k_items.push('-');
k_items.push({
k_id: 'k_admLogout',
k_caption: kerio.lib.k_tr('Logout', 'wlibCommon'),
k_onClick: this._k_logout
});
}
return k_items;
},

_k_createSupportedLanguages: function(k_languageCfg) {
var
k_lib = kerio.lib,
k_languageList = k_lib.k_constants.k_languageList,
k_browserPref = k_languageCfg.k_browserPref,
k_useBritishFlag = false,
k_supportedLanguagesCfg = k_languageCfg.k_supported,
k_supportedLanguages = [],
k_requiredLanguages,
k_langId,
k_allLanguages,
k_i, k_cnt;
for (k_i = k_languageList.length - 1; k_i >= 0; k_i--) {
if ('sk' === k_languageList[k_i].k_id) {
k_languageList.splice(k_i, 1);
}
}
if (k_browserPref && k_browserPref.length > 2) {
k_browserPref = k_browserPref.substr(0, 2);
if ('en' === k_browserPref && 'en-gb' === k_languageCfg.k_browserPref) {
k_useBritishFlag = true;
}
}
this._k_defaultLang = k_browserPref || 'default';
k_allLanguages = [
{k_id: 'default', k_className: 'flag ' + this._k_defaultLang + (k_useBritishFlag ? ' gb' : ''), k_caption: k_languageCfg.k_textAutomatic}
].concat(k_languageList);
if (!k_supportedLanguagesCfg) {
k_supportedLanguagesCfg = k_lib.k_getSupportedLanguages();
if (!k_supportedLanguagesCfg) {
k_lib.k_reportError('Internal error: Supported laguages must be defined.', 'adm/framework.js');
return [];
}
}
k_requiredLanguages = k_supportedLanguagesCfg.join(':');
for (k_i = 0, k_cnt = k_allLanguages.length; k_i < k_cnt; k_i++) {
k_langId = k_allLanguages[k_i].k_id;
if ('en' === k_langId && k_useBritishFlag) {
k_allLanguages[k_i].k_className += ' gb';
}
if ('default' === k_langId || -1 !== k_requiredLanguages.indexOf(k_langId)) {
k_supportedLanguages.push(k_allLanguages[k_i]);
}
}
return k_supportedLanguages;
},

_k_createHelpActions: function(k_helpCfg, k_currentLanguage) {
var
k_items = k_helpCfg.k_items,
k_menuItems = [],
k_platform = k_helpCfg.k_platform ? '&platform=' + k_helpCfg.k_platform : '',
k_helpClick,
k_item,
k_cnt,
k_i,
k_url,
k_dialog;
if (1 === k_items.length && '' !== k_items[0].k_icon) {
k_items[0].k_iconCls = 'helpIcon';
}
if (kerio.lib.k_isIPadCompatible) {
k_items.push({
k_url: 'help/',
k_helpUrlQuery: 'ipad',
k_caption: kerio.lib.k_tr('Tablet Tips', 'wlibHelpPage')
});
}
k_helpClick = function(k_menu, k_menuItem) {
var k_framework = kerio.adm.k_framework;
k_framework._k_doHelpAction(k_framework._k_helpActions[k_menuItem.k_name]);
};
for (k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_item = k_items[k_i];
k_url = k_item.k_url;
k_dialog = k_item.k_dialog;
if (k_url) {
k_url += (-1 === k_url.indexOf('?')) ? '?' : '&';
k_url += 'lang=en'; k_url += k_platform;
k_item.k_url = k_url;
}
else {
this._k_helpDialog = k_dialog;
}
k_menuItems.push({
k_id: k_i,
k_className: 'helpAction ' + (k_item.k_className || ''),
k_caption: k_item.k_caption,
k_onClick: k_helpClick,
k_iconCls: k_item.k_iconCls,
k_icon: k_item.k_icon
});
}
this._k_helpActions = k_helpCfg.k_items;
return k_menuItems;
},

_k_prepareTreeCfg: function(k_treeCfg) {
var
k_treeTitle = k_treeCfg.k_title,
k_framework = kerio.adm.k_framework,
k_localData = k_treeCfg.k_nodes;
k_treeCfg.k_isParentNodeSelectable = false;
k_treeCfg.k_isSingleClickExpand = k_treeCfg.k_useTabs ? false : true;
k_treeCfg.k_isRootCollapsible = false;
k_treeCfg.k_className = 'admMenuTree';
k_treeCfg.k_width = k_treeCfg.k_width || 200;
if (kerio.lib.k_isStateful) {
k_treeCfg.k_settingsId = 'admMenuTree';
}
k_treeCfg.k_onClick = k_framework._k_onTreeNodeClick;
if (k_treeCfg.k_onBeforeSwitchScreen) {

k_framework._k_onBeforeSwitchScreenHandler = k_treeCfg.k_onBeforeSwitchScreen;
k_treeCfg.k_onBeforeClick = k_framework._k_onBeforeSwitchScreen;
}
else {
k_treeCfg.k_onBeforeClick = k_framework._k_onBeforeLeaveScreen;
}
if (k_treeTitle) {
k_treeCfg.k_isRootSelectable = k_treeTitle.k_isSelectable;
k_treeTitle.k_nodes = k_treeCfg.k_nodes;
k_localData = [k_treeTitle];
k_treeTitle.k_iconClass = 'nodeIcon' + (k_treeTitle.k_iconClass ? ' ' + k_treeTitle.k_iconClass : '');
}
this._k_automaticMenuTreeSelection = decodeURIComponent(document.location.hash.substr(1));
this._k_modifyNodeCfg(k_localData);
k_treeCfg.k_localData = k_localData;
delete k_treeCfg.k_title;
delete k_treeCfg.k_nodes;
if (!this._k_defaultMenuTreeSelection) {
kerio.lib.k_reportError('Internal error: One menu item must be with k_isSelected attribute.', 'adm/framework.js');
}
return k_treeCfg;
},
_k_onTreeNodeClick: function(k_treeNode, k_event) {
var
k_menuTree = this.k_parentWidget,
k_rawData = k_treeNode.k_rawData,
k_objectName,
k_framework;
if (!k_rawData) { return;
}
k_objectName = k_rawData.k_objectName || k_rawData.k_sourceName;
k_framework = kerio.adm.k_framework;
k_framework._k_currentMenuItem = k_treeNode;
k_rawData._k_isShiftKey = k_event._k_isShiftKey;
k_framework._k_setMainPaneContent(k_rawData);
k_framework._k_setHelpQuery(k_objectName);
k_framework._k_showAddInfo(k_rawData.k_addInfo);
if (k_framework._k_isProductMenu) {
if (Ext.History.getToken() !== k_treeNode.k_id) { k_framework._k_historyChangedByApplication = true;
}
k_framework._k_historyIsAdding = true;
Ext.History.add(k_treeNode.k_id);
}
if (kerio.lib.k_isIPadCompatible && !kerio.lib._k_isLandscapeMode() && !(k_menuTree instanceof kerio.adm.k_widgets.k_productMenu)) {
k_framework._k_mainLayout.k_extWidget.layout.west.panel.collapse(false);
}
},

_k_modifyNodeCfg: function(k_nodes) {
var
k_iconClass,
k_useBuiltinIcon,
k_node,
k_screenCfg,
k_pos,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_nodes.length; k_i < k_cnt; k_i++) {
k_node = k_nodes[k_i];
k_screenCfg = k_node.k_screenCfg;
k_node.k_iconCls = k_node.k_iconClass;
k_node.k_className = k_node.k_class;
k_useBuiltinIcon = false;
if (undefined === k_node.k_id) {
k_node.k_id = k_node.k_iconClass ? k_node.k_iconClass.replace(':', '_') : kerio.lib.k_getGeneratedId();
}
if (k_node.k_isSelected) {
this._k_defaultMenuTreeSelection = k_node.k_id; if (this._k_automaticMenuTreeSelection) {
delete k_node.k_isSelected;
}
}
if (k_node.k_iconCls && -1 !== (k_pos = k_node.k_iconCls.indexOf(':'))) {
k_useBuiltinIcon = true;
k_iconClass = k_node.k_iconCls.substr(k_pos + 1);
k_node.k_iconCls = 'admIcon ' + k_iconClass;
}
if (k_node.k_nodes) {
this._k_modifyNodeCfg(k_node.k_nodes);
}
if (k_screenCfg) {
if ('logs' === k_screenCfg.k_sourceName) {
k_node.k_caption = k_screenCfg.k_objectName.substr(0,1).toUpperCase() + k_screenCfg.k_objectName.substr(1);
k_screenCfg.k_title = k_node.k_caption;
}
else if (undefined === k_screenCfg.k_title) {
k_screenCfg.k_title = undefined !== k_node.k_title ? k_node.k_title : k_node.k_caption;
}
if (k_useBuiltinIcon) {
k_screenCfg.k_className = 'admIcon ' + k_iconClass;
}
else {
if (k_node.k_iconClass && undefined === k_screenCfg.k_className) {
k_screenCfg.k_className = k_node.k_iconClass;
}
}
k_node.k_rawData = k_screenCfg;
}
}
},

_k_modifyForIPad: function(k_mainLayout) {
var
k_extLayout = k_mainLayout.k_extWidget,
k_westRegion = k_extLayout.layout.west,
k_menu,
k_screen,
k_title,
k_touchController;
k_menu = k_extLayout.items.get(0);
k_screen = k_extLayout.items.get(1);
k_title = k_screen.items.get(0);
k_menu.on('beforecollapse', function() {this.k_expandedWidth = this.k_extWidget.getWidth();}, k_mainLayout.k_menuTree);
k_menu.on('beforecollapse', this._k_onIPadMaximizeScreen, k_title);
k_menu.on('expand', this._k_onIPadRestoreScreen, k_title);
k_westRegion.split.on('click', Ext.emtyFn);  k_westRegion.cmargins = {
left: 0,
top: 0,
right: 0,
bottom: 0
};
k_westRegion.floatable = false;
k_westRegion.getCollapsedEl().on('click', k_westRegion.onExpandClick, k_westRegion);
k_westRegion.getCollapsedEl().setStyle('border-width', '0 0 0 1px');
k_westRegion.el.addClass('menuTreeContainer');
k_westRegion.panel.tools.toggle.createChild({
tag: 'div',
cls: 'toggleButton'
});
window.addEventListener('orientationchange', function(){
var	k_menuTreePanel = kerio.adm.k_framework._k_mainLayout.k_extWidget.layout.west.panel;
k_menuTreePanel[kerio.lib._k_isLandscapeMode() ? 'expand' : 'collapse'](false);
}, false);
k_touchController = new kerio.lib.K_TouchController({
k_element: k_westRegion.splitEl.dom,
k_onTouchMove: function(k_touchStatus) {
if (k_touchStatus.k_currentX > kerio.adm.k_framework._k_iPadMinMenuWidth) {
this.split.el.setX(k_touchStatus.k_currentX);
}
},
k_onTouchEnd: function(k_touchStatus) {
k_touchStatus.k_event.preventDefault();
k_touchStatus.k_event.stopPropagation();
this.onSplitMove(this.split, Math.max(kerio.adm.k_framework._k_iPadMinMenuWidth, k_touchStatus.k_currentX));
},
k_scope: k_extLayout.layout.west,
k_preventDefault: false
});
kerio.lib.K_Dialog.prototype._k_fixDialogSizeAndPos = kerio.lib.K_Dialog.prototype._k_fixDialogSizeAndPos.createInterceptor(function(k_viewportSize, k_beforeShow) {
var k_regionHeight = kerio.adm.k_framework._k_mainLayout.k_extWidget.items.items[1].getHeight();
return (Math.abs(k_regionHeight - k_viewportSize.height) <= 2);  });
kerio.lib.K_Dialog.prototype._k_onHide = kerio.lib.K_Dialog.prototype._k_onHide.createSequence(function() {
kerio.adm.k_framework._k_mainLayout.k_extWidget.syncSize();
});

Ext.getBody().on('orientationchange', function() {
kerio.adm.k_framework._k_mainLayout.k_extWidget.syncSize();
});
window.onpagehide = function(k_event) {
kerio.adm.k_framework._k_saveSettingsOnUnload();
};
},

_k_onIPadMaximizeScreen: function(){
this.collapse(false);
},

_k_onIPadRestoreScreen: function(){
this.expand(false);
},

_k_setLanguage: function(k_toolbar, k_menuItem, k_isForced) {
var
k_language = k_menuItem.k_name,
k_framework = kerio.adm.k_framework,
k_customSettings = {},
k_target,
k_params,
k_requestCfg;
if (true !== k_isForced &&  !k_framework._k_onBeforeSwitchScreenHandler) {
k_target = {k_function: arguments.callee, k_arguments: arguments, k_scope: this};
if (false === k_framework._k_onBeforeLeaveScreen(k_target, k_framework._k_currentMenuItem)) {
return;
}
}
k_menuItem.k_menu.k_hide();
k_menuItem.k_menu.k_topMenu.k_hide();
k_framework._k_mainLayout.k_mask();
if (kerio.lib.k_isStateful) {
k_customSettings[kerio.lib._k_settings.k_root] = {language: k_language};
kerio.lib.k_addCustomSettings(k_customSettings);
kerio.lib.k_saveSettings({
k_widget: kerio.adm.k_framework._k_mainLayout,
k_callback: k_framework._k_callbackSetLanguage,
k_scope: this
});
}
else {
k_params = {settings: {language: k_language}};
k_requestCfg = {
k_jsonRpc: {
'method': 'Session.setSettings',
'params': k_params
},
k_callback: k_framework._k_callbackSetLanguage,
k_scope: this
};
kerio.lib.k_ajax.k_request(k_requestCfg);
}
},

_k_callbackSetLanguage: function() {
window.onbeforeunload = kerio.adm.k_framework._k_abortAllRequestsBeforeUnload;
window.location.reload();
},

_k_setMainPaneContent: function(k_config) {
if (!k_config) {
return;
}
var
k_uiWidget = this._k_uiCacheManager.k_get(k_config.k_sourceName, k_config.k_objectName),
k_lastWidget = this._k_lastWidget,
k_uiWidgetCover,
k_cfgLayout,
k_viewport,
k_element,
k_i, k_cnt;
delete this._k_mainLayout.k_maskOnAction;
if (k_uiWidget) {
this._k_mainLayout.k_maskOnAction = k_config.k_maskOnAction;
if (k_lastWidget) {
if (k_lastWidget.k_onDeactivate) {
k_lastWidget.k_onDeactivate.call(k_lastWidget);
}
kerio.lib.k_saveSettings({
k_widget: k_lastWidget
});
kerio.lib._k_unmaskNestedWidgets(k_lastWidget);
kerio.lib.k_unmaskWidget(k_lastWidget);
k_viewport = kerio.lib.k_getViewport();
if (k_viewport && k_viewport.k_extWidget && k_viewport.k_extWidget.getEl()) {
k_element = k_viewport.k_extWidget.getEl();
for (k_i = 0, k_cnt = 5; k_i < k_cnt; k_i++) {
if (0 === k_element._k_maskCount) {
break;
}
kerio.lib.k_unmaskWidget(k_lastWidget);
kerio.lib.k_unmaskWidget(k_viewport);
}
}
this._k_previousWidgetId = k_lastWidget.k_id;
this.k_screenIsChanging = true;
}
k_uiWidgetCover = k_uiWidget._k_mainPaneCover;
if (!k_uiWidgetCover) {
k_uiWidgetCover = this._k_wrapIntoPanel(k_uiWidget);
}
k_cfgLayout = {k_id: 'k_mainPane', k_content: k_uiWidgetCover};
this._k_mainLayout.k_setContent(k_cfgLayout);
if (false !== k_config._k_setTitle) {
this._k_updateTitle(k_config.k_title, k_config.k_className);
}
else {
delete k_config._k_setTitle;
}
if (k_uiWidget.k_applyParams) {
if (true === k_config._k_isShiftKey) {
k_config.k_params = Ext.apply(k_config.k_params || {}, {k_isShiftKey: true});
}
else if (k_config.k_params) {
delete k_config.k_params.k_isShiftKey;
}
delete k_config._k_isShiftKey;
k_uiWidget.k_applyParams.call(k_uiWidget, k_config.k_params);
}
if (k_uiWidget.k_onActivate) {
k_uiWidget.k_onActivate.call(k_uiWidget);
}
this._k_lastWidget = k_uiWidget;
this.k_screenIsChanging = false;
if (undefined === k_uiWidget._k_applyResetToolbar) {  k_uiWidget._k_applyResetToolbar = this._k_getApplyResetToolbar(k_uiWidget);
}
}
else {
this._k_updateTitle(k_config.k_title, k_config.k_className);
k_config._k_callback = arguments.callee;
k_config._k_scope = this;
k_config._k_setTitle = false;
this._k_uiCacheManager.k_load(k_config);
}
}, 
_k_updateTitle: function (k_title, k_className) {
kerio.lib.k_getDomElement('k_admTitleBarCaption').firstChild.className = 'admTitleIcon ' + k_className;
kerio.lib.k_getDomElement('k_admTitleBarCaptionText').innerHTML = k_title;
},

_k_getApplyResetToolbar: function(k_widget) {
var
k_toolbarName,
k_toolbars,
k_toolbar;
if (k_widget.k_isInstanceOf('_K_ToolbarContainer')) {
k_toolbars = k_widget.k_toolbars;
for (k_toolbarName in k_toolbars) {
k_toolbar = k_toolbars[k_toolbarName];
if (k_toolbar.k_isInstanceOf(['kerio.adm.k_widgets.K_ActionToolbar', 'kerio.adm.k_widgets.K_BasicToolbar'])) {
if (k_toolbar.k_items.k_btnApply) {
return k_toolbar;
}
}
}
}
return null;
},

k_enableApplyReset: function(k_enable) {
var
k_applyResetToolbar = kerio.adm.k_framework._k_lastWidget._k_applyResetToolbar,
k_disable;
if (k_applyResetToolbar) {
k_disable = false === k_enable;
if (k_applyResetToolbar.k_enableApplyReset) {
k_applyResetToolbar.k_enableApplyReset(!k_disable);
}
else { k_applyResetToolbar.k_setDisabledApplyReset(k_disable, k_disable);
}
}
},

_k_logout: function(k_toolbar, k_menuItem, k_isForced) {
var
k_framework = kerio.adm.k_framework,
k_target;
if (true !== k_isForced &&  !k_framework._k_onBeforeSwitchScreenHandler) {
k_target = {k_function: arguments.callee, k_arguments: arguments, k_scope: k_framework};
if (false === k_framework._k_onBeforeLeaveScreen(k_target, k_framework._k_currentMenuItem)) {
return;
}
}
kerio.lib.k_saveSettings({
k_widget: k_framework._k_mainLayout,
k_callback: function () {
if (this._k_logoutUrl) {
kerio.adm.k_framework.k_setLocation(this._k_logoutUrl + kerio.lib.k_getHash());
return;
}
var k_requestCfg = Ext.applyIf(this._k_logoutRequestCfg, {
k_jsonRpc: {
'method': 'Session.logout'
},
k_callback: function(k_response, k_success) {
var k_redirection;
kerio.lib.k_unmaskWidget(kerio.lib.k_getViewport());
if (k_response.k_isOk) {
k_redirection = k_response.k_decoded.redirectUrl || './login/';
}
else {
k_redirection = './'; }
kerio.adm.k_framework.k_setLocation(k_redirection + kerio.lib.k_getHash());
}
});
kerio.lib.k_maskWidget(kerio.lib.k_getViewport(), {k_message : kerio.lib.k_tr('Logging out…', 'wlibCommon')});
kerio.lib.k_ajax.k_request(k_requestCfg);
},
k_scope: k_framework
});
}, 
k_setLocation: function (k_url) {
window.onbeforeunload = kerio.adm.k_framework._k_abortAllRequestsBeforeUnload;
window.location = k_url;
},


_k_onBeforeSwitchScreen: function(k_newNode, k_currentNode, k_event) {
if (!k_currentNode) {
return true;
}
return kerio.adm.k_framework._k_onBeforeSwitchScreenHandler(k_newNode, k_currentNode, k_event);
}, 
_k_onBeforeLeaveScreen: function(k_target, k_currentNode, k_event) {
var
k_framework = kerio.adm.k_framework,
k_confirmDlgStrings;
if (!k_currentNode) {
return true;
}
k_framework._k_targetChoice = k_target;
if (k_framework.k_isScreenChanged()) {
k_confirmDlgStrings = k_framework._k_confirmDlgStrings;
kerio.lib.k_confirm(
k_confirmDlgStrings.k_title, k_confirmDlgStrings.k_message,
k_framework._k_leaveScreenConfirmCallback, k_framework, 'Yes', true
);
return false;
}
return true;
},

k_isScreenChanged: function() {
var
k_widget = kerio.adm.k_framework._k_lastWidget,
k_isChanged = false,
k_applyResetToolbar;
if (k_widget) {
k_applyResetToolbar = k_widget._k_applyResetToolbar;
k_isChanged = k_applyResetToolbar && false === k_applyResetToolbar.k_isItemDisabled('k_btnApply');
}
return k_isChanged;
},

k_isDialogChanged: function(){
var
k_dialogs = kerio.lib._k_windowManager._k_stack.items,
k_dialog,
k_i;
for (k_i = k_dialogs.length - 1; k_i >= 0; k_i--) {
k_dialog = k_dialogs[k_i];
if (k_dialog instanceof kerio.lib.K_Dialog && k_dialog.k_isChanged()) {
return true;
}
}
return false;
},

_k_leaveScreenConfirmCallback: function(k_button) {
var
k_applyResetToolbar = this._k_lastWidget._k_applyResetToolbar,
k_applyButton = k_applyResetToolbar.k_items.k_btnApply,
k_resetButton = k_applyResetToolbar.k_items.k_btnReset,
k_screenCanBeLeft = 'no' === k_button,
k_menuTree = kerio.adm.k_framework._k_mainLayout.k_menuTree,
k_isScreenValid = kerio.adm.k_framework._k_lastWidget.k_isValid(false);
if ('yes' === k_button && k_isScreenValid) {
k_screenCanBeLeft = k_applyButton._k_action._k_onClick.call(k_applyButton._k_action, k_applyButton.k_extWidget);
if ('boolean' !== typeof k_screenCanBeLeft) {
kerio.lib.k_reportError('Internal error: k_onApply method has to return a boolean value ('
+ k_applyResetToolbar.k_id + ')', 'framework.js'
);
}
}
else if ('no' === k_button && this._k_callResetOnLeaveScreen) {
k_screenCanBeLeft = k_resetButton._k_action._k_onClick.call(k_resetButton._k_action, k_resetButton.k_extWidget);
if ('boolean' !== typeof k_screenCanBeLeft) {
k_screenCanBeLeft = true;
}
}
if (!k_isScreenValid && ("no" !== k_button || k_screenCanBeLeft === false)) {
kerio.adm.k_framework._k_lastWidget.k_isValid(true);
}
k_applyButton.k_isFiredByEvent = false;
k_resetButton.k_isFiredByEvent = false;
if (true === k_screenCanBeLeft) {
this.k_leaveCurrentScreen();
}
else if ('cancel' === k_button && k_menuTree instanceof kerio.adm.k_widgets.k_productMenu) {
k_menuTree.k_goBackToCurrentScreen();
}
},

k_leaveCurrentScreen: function() {
var
k_applyResetToolbarItems = this._k_lastWidget._k_applyResetToolbar.k_items,
k_applyButton = k_applyResetToolbarItems.k_btnApply,
k_resetButton = k_applyResetToolbarItems.k_btnReset,
k_targetChoice = kerio.adm.k_framework._k_targetChoice,
k_arguments,
k_viewport,
k_viewportElement;
if (k_applyButton.k_isFiredByEvent || k_resetButton.k_isFiredByEvent) {  return false;
}
k_viewport = kerio.lib.k_getViewport();
k_viewportElement = k_viewport.k_extWidget.getEl();
k_viewportElement._k_maskCount = 0;
kerio.lib.k_unmaskWidget(k_viewport);
if (k_targetChoice.k_function) {
k_arguments = k_targetChoice.k_arguments;
Array.prototype.push.call(k_arguments, true);  k_targetChoice.k_function.apply(k_targetChoice.k_scope, k_arguments);
}
else {
k_targetChoice.k_tree.k_selectNode(k_targetChoice.k_id);
}
return true;
},

_k_wrapIntoPanel: function(k_uiWidget) {
var k_extWidget = k_uiWidget.k_extCover || k_uiWidget.k_extWidget,
k_extPanel = new Ext.Panel({
id: k_uiWidget.k_id + '_wrap',
items: [k_extWidget],
layout: 'fit',
border: false,
cls: 'mainScreenWrapPanel',
listeners: {
'beforeshow': {fn: kerio.lib.k_uiCacheManager.k_recoverDOM},
'show': {fn: this._k_onShowScreen, scope: k_uiWidget},
'hide': {fn: this._k_onHideScreen, scope: k_uiWidget}
}
});
k_uiWidget.k_addReferences({_k_ajaxRequestStack: []});
if (!(k_uiWidget instanceof kerio.lib.K_ContentPanel)) {
k_extWidget.addClass('mainScreen');
if (k_uiWidget instanceof kerio.lib.K_Form) {
k_uiWidget.k_extWidget.bodyCssClass = 'formInMainScreenBody';
}
}
k_extPanel.k_nodeInfo = {};  k_uiWidget._k_mainPaneCover = {k_id: k_extPanel.id, k_extWidget: k_extPanel, k_uiWidget: k_uiWidget};
return k_uiWidget._k_mainPaneCover;
},

_k_onShowScreen: function() {
kerio.lib.k_ajax.k_setDefaultOwner(this);
},

_k_onHideScreen: function() {
kerio.lib.k_ajax.k_abortAllPendingRequests(this);
kerio.lib.k_uiCacheManager.k_releaseDOM.call(this._k_mainPaneCover.k_extWidget);
},

_k_setHelpQuery: function(k_objectName) {
this._k_helpUrlQuery = this.k_getHelpUrlQuery(k_objectName);
},

_k_helpClick: function(k_extEvent) {
var k_framework = kerio.adm.k_framework;
if (k_framework._k_helpMenu) {
k_framework._k_helpMenu.k_show(kerio.lib.k_getDomElement('k_admHelpIcon'));
}
else {
k_framework._k_doHelpAction(k_framework._k_helpActions[0]);
}
},

_k_doHelpAction: function(k_helpAction) {
if (k_helpAction.k_url) {
this._k_showWindow(k_helpAction.k_url, k_helpAction.k_helpUrlQuery);
}
else {
kerio.lib.k_ui.k_showDialog(k_helpAction.k_dialog);
}
},

_k_getParamsForHelpWindow: function() {
var
k_screenWidth = screen.availWidth,
k_windowTop = window.screenY || window.screenTop || 0,
k_windowLeft = window.screenX || window.screenLeft || 0,
k_windowWidth = (window.outerWidth || document.body.offsetWidth || 0),
k_windowHeight = window.outerHeight || document.body.offsetHeight || 0,
k_params = {resizable: 1, scrollbars: 1, width: this.k_isKnowledgeBaseAvailable() ? 1050 : 675},
k_helpHeight = 670,
k_helpRightOffset = 12,
k_helpTopOffset = 31,
k_windowBorder = 1;
if (Ext.isIE) {
k_helpTopOffset = 40;
k_windowBorder = (0 < navigator.appVersion.indexOf('Windows NT 6.')) ? 11 : 8;  }
else if (Ext.isGecko) {
k_helpTopOffset = Ext.isMac ? 20 : 44;
k_windowBorder = Ext.isMac ? 1 : -1;
}
k_windowWidth += k_windowBorder;
if (k_windowLeft + k_windowWidth + k_params.width < k_screenWidth) {
k_params.left = k_windowLeft + k_windowWidth;
k_params.top = k_windowTop;
k_helpHeight = k_windowHeight - (Ext.isIE ? k_windowBorder/2 : (Ext.isSafari ? 23 : 0));  k_params[Ext.isGecko ? 'outerHeight' : 'height'] = k_helpHeight;
}
else {
k_params.left = k_screenWidth - k_params.width - k_helpRightOffset - k_windowBorder;
k_params.top = k_helpTopOffset;
k_params.height = k_helpHeight;
}
return k_params;
},

_k_showWindow: function(k_url, k_helpUrlQuery, k_directUrlToKb) {
var
k_helpWindow = this._k_helpWindow,
k_windowName = 'Help',
k_sharedConstants = kerio.lib.k_getSharedConstants(),
k_params = this._k_getParamsForHelpWindow(),
k_productName;
k_helpUrlQuery = k_helpUrlQuery || this._k_helpUrlQuery;
if (this.k_isKnowledgeBaseAvailable()) {
if (k_directUrlToKb) {
k_url = k_directUrlToKb;
}
else {
k_productName = kerio.lib.k_getSharedConstants('k_PRODUCT_NAME').toLowerCase().replace('kerio ', '');
k_url = 'http://kb.kerio.com/search/?product=' + k_productName + '&keywords=' + k_helpUrlQuery;
}
}
else {
k_url += '&content=' + k_helpUrlQuery;
if (k_sharedConstants) {
if (k_sharedConstants.k_ENGINE_VERSION) {
k_url += '&buildversion=' + k_sharedConstants.k_ENGINE_VERSION;  }
if (k_sharedConstants.k_SHOW_ACCOUNTS_ONLY) {
k_url += '&accountsOnly=1';
}
}
}
if ((Ext.isSafari && Ext.isWindows || kerio.lib.k_isAndroidTablet) && k_helpWindow && !k_helpWindow.closed) {
k_params.height = k_helpWindow.innerHeight;
k_params.left = k_helpWindow.screenLeft;
k_params.top = k_helpWindow.screenTop;
k_params.width = k_helpWindow.innerWidth;
k_helpWindow.close();
k_windowName += new Date().valueOf();
k_helpWindow = null;
}
if (k_helpWindow && !k_helpWindow.closed) {
k_helpWindow.location.href = k_url;
}
else {
k_helpWindow = kerio.lib.k_openWindow(k_url, k_windowName, this._k_serializeParams(k_params));
this._k_helpWindow = k_helpWindow;
}
if (k_helpWindow) {  k_helpWindow.focus();
}
},

_k_serializeParams: function(k_params) {
var
k_s = '',
k_prop;
for (k_prop in k_params) {
if (k_params.hasOwnProperty(k_prop)) {
k_s += (k_s ? ',' : '') + k_prop + '=' + k_params[k_prop];
}
}
return k_s;
},

k_isKnowledgeBaseAvailable: function() {
return true;
},

k_getPredefinedUrl: function(k_pageName) {
var
k_lib = kerio.lib,
k_language = k_lib.k_engineConstants.k_CURRENT_LANGUAGE,
k_url = '';
switch (k_pageName) {
case 'privacypolicy.html':
k_url = k_lib.k_kerioLibraryRoot + '../adm/terms/' + k_language + '/privacypolicy.html';
break;
case 'legalnotices.html' :
k_language = 'en';  k_url = kerio.adm.k_framework._k_helpActions[0].k_url;
k_url = k_url.substr(0, k_url.indexOf('?'));  k_url += k_language + '/legalnotices.html';
break;
}
return k_url;
},

_k_showAddInfo: function(k_addInfo) {
var
k_admTitleBarAddInfo = kerio.lib.k_getDomElement('k_admTitleBarAddInfo'),
k_text = '';
if (k_addInfo) {
k_text = k_addInfo.k_infoText + (k_addInfo.k_link || '');
}
k_admTitleBarAddInfo.innerHTML = k_text;
},

_k_showAddInfoDetail: function() {
var k_addInfo = this._k_currentMenuItem.k_extWidget._kx.k_rawData.k_addInfo;
kerio.lib.k_alert(k_addInfo.k_dlgCaption, k_addInfo.k_dlgText);
},

k_setAddInfo: function(k_id, k_infoText, k_linkText, k_dlgCaption, k_dlgText) {
var
k_menuTree = this._k_mainLayout.k_menuTree,
k_link = null,
k_node,
k_addInfo;
if (k_menuTree instanceof kerio.adm.k_widgets.k_productMenu) {
k_node = k_menuTree.k_getNodeById(k_id).k_extWidget;
}
else {
k_node = k_menuTree.k_items[k_id];
}
if (k_linkText && '' !== k_linkText) {
k_link = ' <a href="javascript:void(0)" onclick="kerio.adm.k_framework._k_showAddInfoDetail()">' + k_linkText + '</a>';
}
k_addInfo = {k_infoText: k_infoText, k_link: k_link, k_dlgCaption: k_dlgCaption, k_dlgText: k_dlgText};
if (k_node) {
k_node._kx.k_rawData.k_addInfo = k_addInfo;
if (this._k_currentMenuItem.k_extWidget === k_node) {
this._k_showAddInfo(k_addInfo);
}
}
},

k_removeAddInfo: function(k_id) {
var
k_menuTree = this._k_mainLayout.k_menuTree,
k_node;
if (k_menuTree instanceof kerio.adm.k_widgets.k_productMenu) {
k_node = k_menuTree.k_getNodeById(k_id).k_extWidget;
}
else {
k_node = k_menuTree.k_items[k_id];
}
if (k_node) {
delete k_node._kx.k_rawData.k_addInfo;
if (this._k_currentMenuItem.k_extWidget === k_node) {
this._k_showAddInfo(null);
}
}
},

k_showHelp: function(k_content) {
var
k_framework = kerio.adm.k_framework,
k_url = k_framework._k_helpActions[0].k_url,
k_currentQuery = k_framework._k_helpUrlQuery;
k_framework._k_helpUrlQuery = k_framework.k_getHelpUrlQuery(('string' === typeof k_content) ? k_content : this.k_id);
k_framework._k_showWindow.call(k_framework, k_url);
k_framework._k_helpUrlQuery = k_currentQuery;
if (Ext.isIE && 'string' === typeof k_content && !kerio.lib.k_isMSIE10) {
setTimeout(function() {
if (kerio.adm.k_framework._k_helpWindow) {  kerio.adm.k_framework._k_helpWindow.focus();
}
}, 1);
}
},

k_getHelpUrlQuery: function(k_id) {
return (this._k_kbMapping && this._k_kbMapping[k_id]) || k_id;
},

k_getCurrentMenuItem: function () {
return this._k_currentMenuItem;
},

k_formatDate: function(k_date) {
if ('number' === typeof k_date) {
k_date = new Date(k_date * 1000);
}
else {
k_date = new Date(k_date.year, k_date.month, k_date.day);
}
return k_date.format('Y-m-d'); }, 
k_setCustomStaticButton: function(k_config) {
var
k_framework = kerio.adm.k_framework,
k_extEl = Ext.get('k_admTitleBarAdditionalStaticButton'),
k_tooltip;
if (!k_extEl) {  kerio.lib.k_widgets.k_admTitleBar.k_extWidget.on('render', k_framework.k_setCustomButton, k_framework, k_config);
return;
}
if (k_config.k_title) {
k_tooltip = document.createAttribute("ext:qtip");
k_tooltip.value = k_config.k_title;
k_extEl.dom.attributes.setNamedItem (k_tooltip);
}
k_extEl.addClass(k_config.k_className + ' link');
k_extEl.on('click', k_config.k_action.k_fn, k_config.k_action.k_scope || window, k_config.k_action.k_params);
},

k_setCustomButton: function(k_config) {
var
k_framework = kerio.adm.k_framework,
k_extEl = Ext.get('k_admTitleBarCustomButton'),
k_parent,
k_button,
k_buttonSpec,
k_className;
if (!k_extEl) {  kerio.lib.k_widgets.k_admTitleBar.k_extWidget.on('render', k_framework.k_setCustomButton, k_framework, k_config);
return;
}
k_parent = k_extEl.parent();
k_button = k_parent.first();
if (k_button) {
k_button.remove();
}
k_className = kerio.lib._k_addClassName(k_config.k_className, 'link textLink');
k_buttonSpec = {tag: 'div', html: k_config.k_caption, 'ext:qtip': k_config.k_title, cls: k_className, id: 'k_admTitleBarCustomButton'};
k_button = k_parent.createChild(k_buttonSpec);
k_framework._k_customButtonCfg = k_config.k_dialog || k_config.k_action;
k_button.on('click', k_framework._k_onCustomButtonClick, k_framework);
},

k_showCustomButton: function(k_show) {
var
k_framework = kerio.adm.k_framework,
k_extEl = Ext.get('k_admTitleBarCustomButton');
if (k_extEl) {
if (k_show && undefined !== k_show.k_show) {  k_show = k_show.k_show;
}
Ext.get('k_admTitleBarCustomButton').setVisible(false !== k_show);
}
else {
kerio.lib.k_widgets.k_admTitleBar.k_extWidget.on('render', k_framework.k_showCustomButton, k_framework, {k_show: k_show});
}
},

_k_onCustomButtonClick: function() {
var k_handlerCfg = this._k_customButtonCfg;
if (k_handlerCfg.k_sourceName) {
kerio.lib.k_ui.k_showDialog(k_handlerCfg);
}
else {
k_handlerCfg.k_fn.call(k_handlerCfg.k_scope || this);
}
},

_k_abortAllRequestsBeforeUnload: function () {
var k_lastWidget = kerio.adm.k_framework._k_lastWidget;
if (k_lastWidget) {
kerio.lib.k_ajax.k_abortAllPendingRequests(k_lastWidget, true);
}
},

_k_showLoading: function (k_message, k_show) {
var k_config;
k_config = {
k_owner: this,
k_element: Ext.get('k_admTitleBar'),
k_className: 'loadingTitle',
k_message: k_message,
k_show: k_show
};
kerio.lib._k_showLoading(k_config);
},

k_setKbMapping: function(k_kbMapping, k_includeId) {
var
k_internalMapping = {},
k_keywords,
k_idList,
k_id,
k_i, k_cnt;
for (k_keywords in k_kbMapping) {
if (k_kbMapping.hasOwnProperty(k_keywords)) {
k_idList = k_kbMapping[k_keywords];
if (!Ext.isArray(k_idList)) {
k_idList = [k_idList];
}
for (k_i = 0, k_cnt = k_idList.length; k_i < k_cnt; k_i++) {
k_id = k_idList[k_i];
if (k_internalMapping[k_id]) {
k_internalMapping[k_id] += ' ';
}
else {
k_internalMapping[k_id] = k_includeId ? k_id + ' ' : '';
}
k_internalMapping[k_id] += k_keywords;
}
}
}
this._k_kbMapping = k_internalMapping;
}
}; 
kerio.lib._K_BaseWidget.prototype.k_getMainWidget = function() {
var
k_topLevelParent = this.k_getTopLevelParent(),
k_fullPath;
if (k_topLevelParent && k_topLevelParent._k_isBrowserWindow) {
k_fullPath = this.k_getFullPath();
k_topLevelParent = k_fullPath[k_fullPath.length - 2];
}
return k_topLevelParent;
};
