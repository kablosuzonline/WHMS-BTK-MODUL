

kerio.lib.K_Wizard2 = function(k_id, k_config) {
var
k_tr = kerio.lib.k_tr,
k_dontShowAgain = k_config.k_dontShowAgain || {},
k_pagesList = [],
k_visibleTabPages = [],
k_isWizardWithTabs = false,
k_i, k_cnt,
k_pagesCfg,
k_page, k_pageCfg,
k_tabPage, k_tabPageCfg,
k_hasTabTitle;
k_tabPageCfg = {
k_items: []
};
k_dontShowAgain.k_limitToPages = k_dontShowAgain.k_limitToPages || [];
k_dontShowAgain.k_isLimit = (0 < k_dontShowAgain.k_limitToPages.length);
k_dontShowAgain.k_isVisible = k_dontShowAgain.k_isVisible || false;
this._k_pages = [];
k_config.k_hasHelpIcon = k_config.k_hasHelpIcon || false;
k_pagesCfg = kerio.lib.k_applyRestrictionToConfig(k_config.k_pages, k_config.k_restrictBy);
delete k_config.k_pages; if (!k_pagesCfg || Array !== k_pagesCfg.constructor || 0 >= k_pagesCfg.length) {
kerio.lib.k_reportError('Missing or invalid pages for Wizard', 'K_Wizard2', 'constructor');
return;
}
this._k_loadingPageId = k_id + '_k_loading';
k_pagesCfg.unshift({
k_id: this._k_loadingPageId,
k_title: '',
k_description: '',
k_nextPageId: null,
k_backPageId: null,
k_className: 'loadingPage',
k_isClosePage: false,
k_isFinishPage: false,
k_containsDontShowAgain: false,
k_items: [
{
k_id: 'k_waiting',
k_type: 'k_display',
k_isSecure: true,
k_value: '<span class="loadingHeaderText">&nbsp;</span>' + k_tr('Please wait…', 'common'),
k_className: 'loadingMessage'
}

]
});
for (k_i = 0, k_cnt = k_pagesCfg.length; k_i < k_cnt; k_i++) {
k_pageCfg = k_pagesCfg[k_i];
if (!k_pageCfg.k_id || k_pagesList[k_pageCfg.k_id]) {
kerio.lib.k_reportError('Each Wizard page must have unique id defined.', 'K_Wizard2', 'constructor');
return;
}
if (undefined === k_pageCfg.k_containsDontShowAgain) {
k_pageCfg.k_containsDontShowAgain = k_dontShowAgain.k_isLimit ? (-1 < k_dontShowAgain.k_limitToPages.indexOf(k_pageCfg.k_id)) : k_dontShowAgain.k_isVisible;
}
if (!k_pageCfg.k_onBeforeFinish) {
k_pageCfg.k_onBeforeFinish = k_config.k_onBeforeFinish;
}
k_page = new kerio.lib.K_Wizard2Page(this, k_pageCfg);
k_hasTabTitle = undefined !== k_pageCfg.k_tabTitle;
k_isWizardWithTabs = k_isWizardWithTabs || k_hasTabTitle;
if (k_hasTabTitle) {
k_visibleTabPages.push(k_page.k_id);
}
k_tabPageCfg.k_items.push({
k_id: k_page.k_id,
k_caption: k_pageCfg.k_tabTitle,
k_isHidden: !k_hasTabTitle,
k_content: k_page
});
}
k_tabPageCfg.k_onBeforeTabChange = this._k_onNextByTab;
k_tabPageCfg.k_onTabChange = function(k_tabPage, k_newTabId) {
k_tabPage._k_isNextByClickOnTabPage = false;
};
k_tabPage = new kerio.lib.K_TabPage(k_id + '_' + 'k_pages', k_tabPageCfg);

k_tabPage.k_extWidget.onStripMouseDown = k_tabPage.k_extWidget.onStripMouseDown.createInterceptor(
function() {
this._kx.k_owner._k_isNextByClickOnTabPage = true;
}
);
k_tabPage.k_extWidget.k_origGetFrameHeight = k_tabPage.k_extWidget.getFrameHeight;
k_tabPage.k_extWidget.getFrameHeight = function() {
var
k_height = this.k_origGetFrameHeight();
if ('trafficPolicyRuleWizard' === this._kx.k_owner.k_wizard.k_id && this.header) {
k_height -= this.header.getHeight();
}
return k_height;
};
k_tabPage._k_propertiesDefault = kerio.lib._k_extendPropertiesDefault(kerio.lib.K_TabPage, { cls: 'wizard %+' });
k_config.k_content = k_tabPage;
k_config.k_className = 'wizard2' + (k_config.k_className ? ' ' + k_config.k_className : '');
k_config.k_className += k_isWizardWithTabs ? ' wizardWithTabs' : '';
k_config.k_defaultItem = undefined;
k_config.k_buttons = [
{
k_content: new kerio.lib.K_Checkbox(k_id + '_' + 'k_dontShowAgain', {
k_option: k_dontShowAgain.k_option || k_tr("Don't show again", 'common'),
k_value: k_dontShowAgain.k_value || false,
k_isVisible: k_dontShowAgain.k_isVisible || Boolean(k_dontShowAgain.k_value), k_onChange: k_dontShowAgain.k_onChange
})
},
'->',
{
k_id: 'k_btnBack',
k_caption: '< ' + k_tr('Back', 'common'),
k_onClick: this._k_onBackClick
},
{
k_id: 'k_btnNext',
k_caption: k_tr('Next', 'common') + ' >',
k_isDefault: true,
k_validateBeforeClick: false, k_onClick: this._k_onNextClick
},
{
k_id: 'k_btnFinish',
k_caption: (k_config.k_isOkCancel ? k_tr('OK', 'common') : k_tr('Finish', 'common')),
k_isDefault: true,
k_validateBeforeClick: false, k_onClick: this._k_onFinishClick
},
{
k_id: 'k_btnClose',
k_caption: (k_config.k_isOkCancel ? k_tr('Cancel', 'common') : k_tr('Close', 'common')),
k_isDefault: true,
k_validateBeforeClick: false, k_isCancel: true },
{
k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'common'),
k_validateBeforeClick: false, k_isCancel: true, k_onClick: this._k_onCancelClick
},
{
k_id: 'k_btnSkip',
k_caption: k_tr('Skip', 'common') + ' >',
k_isDefault: true,
k_validateBeforeClick: false, k_isHidden: true,
k_onClick: function() {
var
k_wizard = this.k_parentWidget, k_page = k_wizard._k_activePage,
k_onClickSkip;
if ('function' === typeof k_page.k_onClickSkip) {
k_onClickSkip = k_page.k_onClickSkip;
delete k_page.k_onClickSkip;
k_onClickSkip.call(k_wizard);
}
}
}
];
kerio.lib.K_Wizard2.superclass.constructor.call(this, k_id, k_config);
this.k_addReferences({
_k_pagesWidget: k_tabPage,
_k_visibleTabPages: k_visibleTabPages,
_k_backStack: [],
_k_activePage: null,
_k_forceClose: false, _k_isCancelable: k_config.k_isCancelable,
_k_isConfirmBeforeClosing: true === k_config.k_isConfirmBeforeClosing,
_k_isWizardWithTabs: k_isWizardWithTabs,
k_onBeforeShow: k_config.k_onBeforeShow, k_onBeforeClose: k_config.k_onBeforeClose,
k_onAfterCancel: k_config.k_onAfterCancel,
_k_cfgConfirmClosingWizard: {
k_title: k_tr('Cancel', 'common'),
k_msg: [
'<b>',
k_tr('Do you really want to close this wizard?', 'common'),
'</b><br><br>',
k_tr('All your changes will be lost.', 'common')
].join(''),
k_callback: null,
k_scope: this,
k_icon: 'question'
},
_k_currentPageSequence: []
});
k_tabPage.k_addReferences({
k_wizard: this,
_k_isNextByClickOnTabPage: false
});
this.k_extWidget.on('beforeHide', this._k_onBeforeClose, this);
};

kerio.lib.k_extend('kerio.lib.K_Wizard2', kerio.lib.K_Dialog,

{
k_DEFAULT_PAGE: undefined,
k_NO_PAGE: null,

k_show: function() {
var
k_showPage = this.k_getPage(1), k_result;
this.k_reset();
if ('function' === typeof this.k_onBeforeShow) {
k_result = this.k_onBeforeShow(k_showPage.k_id);
k_result = this.k_getPage(k_result);
if (k_result) {
k_showPage = k_result;
}
}
this.k_extWidget.show();
this.k_showPage(k_showPage);
},

k_getPage: function(k_pageId) {
var k_page;
if (k_pageId && k_pageId.k_isInstanceOf && k_pageId.k_isInstanceOf('K_Wizard2Page')) {
return k_pageId;
}
if ('string' === typeof k_pageId) {
k_page = this._k_pages[k_pageId];
}
else if ('number' === typeof k_pageId) {
if (0 < k_pageId) {
k_page = this._k_pages[k_pageId];
}
else if (0 > k_pageId) {  k_page = this._k_backStack[Math.abs(k_pageId) - 1];  }
else { k_page = this._k_activePage;
}
}
else {
return null;
}
return (k_page ? k_page : null);
},

k_showPage: function(k_pageId, k_storeBack) {
var
k_page = this.k_getPage(k_pageId),
k_result;
if (!k_page) {
kerio.lib.k_reportError('Page %1 does not exist in wizard %2'.replace('%1', k_pageId).replace('%2', this.k_id), 'K_Wizard2', 'k_showPage');
return;
}
if (k_page.k_isActive()) {
return; }
if (k_page.k_wasVisited()) {
this.k_goBack(k_pageId); return;
}
k_result = k_page.k_onBeforeShow.call(this, k_page);
if (false === k_result) {
return false;
}
if ('string' === typeof k_result) {
return this.k_showPage(k_result); }
if (this._k_activePage && false !== k_storeBack && this._k_loadingPageId !== this._k_activePage.k_id) { this._k_activePage._k_addToBackStack();
}
this._k_activePage = k_page;
if (true !== this._k_pagesWidget._k_isNextByClickOnTabPage) {
this._k_pagesWidget.k_setActiveTab(k_page.k_id);
}
k_page._k_focusDefaultItem();
if (this._k_isWizardWithTabs) {
this.k_toolbar.k_getItem('k_btnBack').k_setDisabled(!k_page._k_canGoBack() || this._k_loadingPageId === k_page.k_id);
}
else {
this.k_toolbar.k_showItem('k_btnBack', k_page._k_canGoBack() && this._k_loadingPageId !== k_page.k_id);
}
if ('trafficPolicyRuleWizard' === this.k_id) {
this.k_toolbar.k_getItem('k_btnNext').k_setDisabled(!k_page._k_canGoNext());
}
else {
this.k_toolbar.k_showItem('k_btnNext', k_page._k_canGoNext());
}
this.k_toolbar.k_showItem('k_btnFinish', true === k_page.k_isFinishPage);
this.k_toolbar.k_showItem('k_btnClose', k_page._k_isClosePage());
this.k_toolbar.k_showItem('k_btnCancel',  k_page._k_isCancelable());
this.k_toolbar.k_showItem('k_btnSkip', false);
this.k_toolbar.k_showItem(this.k_id + '_' + 'k_dontShowAgain', true === k_page.k_containsDontShowAgain);
return k_result;
},

k_goBack: function(k_pageId) {
var
k_page,
k_backStack = this._k_backStack;
if (undefined === k_pageId) {
k_page = this._k_activePage._k_canGoBack(true); }
else if ('number' === typeof k_pageId) {
k_page = k_backStack[Math.abs(k_pageId) - 1]; }
else {
k_page = this.k_getPage(k_pageId);
}
if (!k_page) {
return false;
}
if (k_page.k_wasVisited()) {           k_page._k_removeFromBackStack();   }
this.k_showPage(k_page, false);
return true;
},

k_showLoading: function(k_title, k_description, k_onClickSkip, k_storeBack) {
var
k_isSkipUsed = undefined !== k_onClickSkip;
if ('boolean' === typeof k_description) {
if (false === k_description) {
this.k_hideLoading(false); return;
}
k_description = '';
}
if (!this._k_activePage || this._k_loadingPageId !== this._k_activePage.k_id) {
this.k_showPage(this._k_loadingPageId, false !== k_storeBack); }
this._k_activePage.k_setTitle(k_title);
this._k_activePage.k_setDescription(k_description);
if (k_isSkipUsed) {
this._k_activePage.k_onClickSkip = k_onClickSkip;
this.k_toolbar.k_showItem('k_btnBack', false);
this.k_toolbar.k_showItem('k_btnNext', false);
this.k_toolbar.k_showItem('k_btnFinish', false);
this.k_toolbar.k_showItem('k_btnClose', false);
this.k_toolbar.k_showItem('k_btnCancel', false);
this.k_toolbar.k_showItem(this.k_id + '_' + 'k_dontShowAgain', false);
this.k_toolbar.k_showItem('k_btnSkip', true);
}
else {
this.k_toolbar.k_showItem('k_btnSkip', false); }
},

k_hideLoading: function(k_pageId) {
if (!this.k_extWidget.isVisible()) {
return;
}
if (!this.k_getPage(this._k_loadingPageId).k_isActive()) {
if ('string' === typeof k_pageId) {
this.k_showPage(k_pageId);
}
return;  }
if (k_pageId) {
this.k_showPage(k_pageId, false); }
else if (!this.k_goBack()) {
if (false !== k_pageId) {
kerio.lib.k_reportError('Cannot hide loading; invalid backStack', 'K_Wizard2', 'k_hideLoading');
return;
}
}
},

k_setPageSequence: function(k_sequence) {
if (this._k_currentPageSequence === k_sequence) {
return;
}
this._k_currentPageSequence = k_sequence;
},

k_setConfirmBeforeClose: function(k_showConfirmBeforeClose) {
if (Ext.isBoolean(k_showConfirmBeforeClose)) {
this._k_isConfirmBeforeClosing = k_showConfirmBeforeClose;
}
},

_k_onNextByTab: function(k_tabPage, k_newTabId, k_currentTabId) {
var
k_pageSequence,
k_pageList,
k_result,
k_wizard,
k_i, k_cnt;
if (true !== k_tabPage._k_isNextByClickOnTabPage) {
return;
}
k_wizard = this.k_parentWidget;
if (-1 === k_wizard._k_visibleTabPages.indexOf(k_currentTabId)) {
return;
}
k_pageSequence = k_wizard._k_currentPageSequence;
k_pageList = [];
k_cnt = k_pageSequence.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_currentTabId === k_pageSequence[k_i]) {
break;
}
}
k_i++;
for (; k_i < k_cnt; k_i++) {
if (k_newTabId === k_pageSequence[k_i]) {
break;
}
k_pageList.push(k_pageSequence[k_i]);
}
k_pageList.push(k_newTabId);
for (k_i = 0, k_cnt = k_pageList.length; k_i < k_cnt; k_i++) {
k_result = k_wizard._k_switchToPage(k_pageList[k_i]);
if (false === k_result) {
return false;
}
}
},

_k_onBackClick: function() {
this.k_parentWidget.k_goBack();
},

_k_onNextClick: function() {
var
k_wizard = this.k_parentWidget,
k_result;
k_result = k_wizard._k_switchToPage();
if (false === k_result) {
return false;
}
},

_k_switchToPage: function(k_pageId) {
var
k_wizard = this, k_page = k_wizard._k_activePage,
k_followingPageId,
k_result;
if (!k_page.k_isValid()) {
return false;
}
k_result = k_page.k_onBeforeNextPage.call(k_wizard, k_page);
if (false === k_result) {
return false; }
if ('string' === typeof k_result) {
k_page = k_wizard.k_getPage(k_result);
}
else {
k_followingPageId = undefined !== k_pageId ? k_pageId : k_page._k_canGoNext(true);
k_page = k_wizard.k_getPage(k_followingPageId);
}
k_wizard.k_showPage(k_page);
},

_k_onFinishClick: function() {
var
k_wizard = this.k_parentWidget, k_page = k_wizard._k_activePage,
k_result;
if (!k_page.k_isValid()) {
return;
}
k_result = k_page.k_onBeforeFinish.call(k_wizard, k_page);
if (false === k_result) {
return; }
if ('string' === typeof k_result) {
k_wizard.k_showPage(k_result);
}
else { k_wizard.k_close(true); return;
}
}, 
_k_onBeforeClose: function() {
if (this._k_forceClose) {
this._k_forceClose = false; return true;                }
if (this._k_isConfirmBeforeClosing) {
this._k_cfgConfirmClosingWizard.k_callback = this._k_onBeforeCloseCallback;
kerio.lib.k_confirm(this._k_cfgConfirmClosingWizard);
return false; }
var
k_result;
k_result = this._k_onBeforeCloseCallback('yes', true);
if (false === k_result) {
return false;
}
return true;
},

_k_onBeforeCloseCallback: function(k_answer, k_skipHiding) {
if ('no' === k_answer) {
return;
}
var
k_result;
if ('function' === typeof this.k_onBeforeClose) {
k_result = this.k_onBeforeClose(this._k_activePage);
if (false === k_result) {
return false; }
}
if (true !== k_skipHiding) {
this._k_forceClose = true;
this.k_hide();
}
},

_k_onCancelClick: function() {
var
k_wizard = this.k_parentWidget;
if (false === k_wizard._k_isConfirmBeforeClosing) {
k_wizard._k_onCancelCallback.call(k_wizard, 'yes');
return;
}
k_wizard._k_cfgConfirmClosingWizard.k_callback = k_wizard._k_onCancelCallback;
kerio.lib.k_confirm(k_wizard._k_cfgConfirmClosingWizard);
},

_k_onCancelCallback: function(k_answer) {
if ('no' === k_answer) {
return;
}
if ('function' === typeof this.k_onAfterCancel) {
this.k_onAfterCancel(this._k_activePage);
}
this.k_close(true); },

k_close: function(k_force) {
this._k_forceClose = true === k_force;
this.k_hide();
},

k_reset: function(k_pageId) {
var
k_i, k_cnt;
for (k_i = 0, k_cnt = this._k_pages.length; k_i < k_cnt; k_i++) {
this._k_pages[k_i].k_reset(); }
this._k_backStack = [];
this._k_activePage = null;
if (k_pageId) {
this.k_showPage(k_pageId);
}
},

k_resetOnClose: function() {
this.k_reset();
},

k_enableConfirmBeforeClosing: function(k_enable) {
this._k_forceClose = true !== k_enable;
},

k_getData: function(k_getDisabled, k_usePagedStructure) {
var
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_pages = this._k_pages,
k_result = {},
k_data,
k_page,
k_i, k_cnt;
k_usePagedStructure = (false !== k_usePagedStructure);
for (k_i = 0, k_cnt = k_pages.length; k_i < k_cnt; k_i++) {
k_page = k_pages[k_i];
if (this._k_loadingPageId === k_page.k_id) {
continue; }
k_data = k_page.k_getData(k_getDisabled);
if (k_usePagedStructure) {
k_result[k_page.k_id] = k_data;
}
else {
k_WAW_METHODS.k_mergeObjects(k_data, k_result);
}
}
return k_result;
}
});    
kerio.lib.K_Wizard2Page = function(k_owner, k_config){
if (!k_owner || arguments.callee.caller !== kerio.lib.K_Wizard2) { kerio.lib.k_reportError('Wizard page cannot be created outside parent Wizard', 'K_Wizard2Page', 'constructor');
return null;
}
var
k_emptyFunction = function() {}, k_linkList = [],
k_items = k_config.k_items || [],
k_i, k_cnt,
k_className;
if (undefined !== k_config.k_title || undefined !== k_config.k_description) {
if ('k_welcome' === k_config.k_id) {
k_className = 'welcomeLogo';
}
else {
k_className = 'wizardHeader';
}
k_config.k_className = k_config.k_className || '';
k_config.k_className += ('' === k_config.k_className ? '' : ' ') + k_className;
}
this._k_processItems(k_linkList, k_items, k_config.k_id);
k_items.unshift(
{
k_id: 'k_pageTitle',
k_type: 'k_display',
k_value: k_config.k_title,
k_className: 'wizardPageTitle',
k_isHidden: (!k_config.k_title),
k_isSecure: true
},
{
k_id: 'k_pageDescription',
k_type: 'k_display',
k_value: k_config.k_description || '',
k_className: 'wizardPageDescription',
k_isHidden: (!k_config.k_description)
}
);
k_config.k_items = k_items; kerio.lib.K_Wizard2Page.superclass.constructor.call(this, k_config.k_id, k_config);
for (k_i = 0, k_cnt = k_linkList.length; k_i < k_cnt; k_i++) {
this.k_setLinkAction(k_linkList[k_i].k_id, k_linkList[k_i].k_onClick);
}
this.k_addReferences({
_k_index: k_owner._k_pages.length, k_wizard: k_owner,
k_defaultItem: k_config.k_defaultItem,
k_nextPageId: k_config.k_nextPageId,
k_backPageId: k_config.k_backPageId,
k_isFinishPage: k_config.k_isFinishPage,
k_isClosePage: k_config.k_isClosePage,
k_containsDontShowAgain: k_config.k_containsDontShowAgain,
k_containsCancelButton: k_config.k_containsCancelButton,
k_onBeforeShow: ('function' === typeof k_config.k_onBeforeShow ? k_config.k_onBeforeShow : k_emptyFunction),
k_onBeforeNextPage: ('function' === typeof k_config.k_onBeforeNextPage ? k_config.k_onBeforeNextPage : k_emptyFunction),
k_onBeforeFinish: ('function' === typeof k_config.k_onBeforeFinish ? k_config.k_onBeforeFinish : k_emptyFunction)
});
k_owner._k_pages.push(this);
k_owner._k_pages[k_config.k_id] = this; }; 
kerio.lib.k_extend('kerio.lib.K_Wizard2Page', kerio.lib.K_Form,

{

k_isActive: function() {
return (this === this.k_wizard._k_activePage);
},

k_isValid: function() {
var k_results = new kerio.lib._K_ValidationResults();
k_results.k_add(this._k_isValid(true));
return k_results.k_isValid(true);
},

_k_addToBackStack: function() {
this.k_wizard._k_backStack.unshift(this);
},

_k_getBackStackIndex: function() {
return this.k_wizard._k_backStack.indexOf(this);
},

_k_removeFromBackStack: function(k_trim) {
var k_wizard = this.k_wizard;
if (!this.k_wasVisited()) { kerio.lib.k_reportError('Page %1 was not visited yet.'.replace('%1', this.k_id), 'K_Wizard2Page', '_k_removeFromBackStack');
return;
}
if (false !== k_trim) {
k_wizard._k_backStack = k_wizard._k_backStack.slice(this._k_getBackStackIndex()); }
k_wizard._k_backStack.remove(this); },

k_wasVisited: function() {
return (-1 < this._k_getBackStackIndex()); },

_k_canGoBack: function(k_getPage) {
var
k_wizard = this.k_wizard,
k_backStack = k_wizard._k_backStack,
k_backPage;
if (0 === k_backStack.length) { return false;
}
if (k_wizard._k_loadingPageId === this.k_id) {
k_backPage = k_wizard.k_getPage(-1);
}
else {
k_backPage = k_wizard.k_getPage(this.k_backPageId);
}
if (k_backPage) { return (k_getPage ? k_backPage : true);
}
if (k_wizard.k_NO_PAGE === this.k_backPageId) {
return false; }
return (k_getPage ? k_backStack[0] : true); }, 
_k_canGoNext: function(k_getPage) {
var
k_wizard = this.k_wizard,
k_nextPage;
k_nextPage = k_wizard.k_getPage(this.k_nextPageId);
if (k_nextPage) {
return (k_getPage ? k_nextPage : true); }
if (k_wizard.k_NO_PAGE === this.k_nextPageId) {
return false; }
k_nextPage = k_wizard.k_getPage(this._k_index + 1); return (k_nextPage ? (k_getPage ? k_nextPage : true) : false); },

_k_isClosePage: function() {
if ('boolean'=== typeof this.k_isClosePage) {
return this.k_isClosePage; }
return (!this._k_canGoNext() && !this.k_isFinishPage);
},

_k_processItems: function(k_linkList, k_items, k_prefixId) {
var k_i, k_cnt, k_item;
if (!k_items) {
return;
}
for (k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_item = k_items[k_i];
if (k_item && k_item.k_items && k_item.k_items.length) {
this._k_processItems(k_linkList, k_item.k_items, k_prefixId);
}
else if ('string' === typeof k_item && '->' !== k_item) {
k_items[k_i] = { k_value: k_item };
}
else if (k_item && 'k_formLink' === k_item.k_type) {
k_item.k_parentId = k_prefixId;
this._k_prepareLinkCfg(k_linkList, k_item);
}
}
},

_k_createLinkHandler: function(k_closureCallback, k_closureScope, k_closureParams) {

return function() {
try {
k_closureCallback.apply(k_closureScope, k_closureParams);
}
catch (e) {
kerio.lib.k_reportError.defer(1, kerio.lib, ['onClick handler failed with error: ' + e, 'Wizard2', '_k_createLinkHandler']);
return false;
}
return false;
};
},

_k_openUrl: function(k_url) {
window.open(k_url);
},

_k_prepareLinkCfg: function(k_linkList, k_itemCfg) {
k_linkList.push({
k_id: k_itemCfg.k_id,
k_onClick: k_itemCfg.k_onClick
});
k_itemCfg.k_type = 'k_display';
k_itemCfg.k_value = '<a id="'+ k_itemCfg.k_parentId + '_' + k_itemCfg.k_id + '_' + 'k_link' + '" href="#">' + k_itemCfg.k_caption + '</a>';
k_itemCfg.k_isSecure = true;
k_itemCfg.k_isLabelHidden = true;
k_itemCfg.k_className = 'link textLink';
delete k_itemCfg.k_onClick;
delete k_itemCfg.k_caption;
delete k_itemCfg.k_parentId;
},

k_setLinkAction: function(k_id, k_onClick) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
this.k_setLink(this.k_id + '_' + k_id + '_' + 'k_link', k_onClick);
},

k_setLink: function(k_id, k_onClick) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_el = Ext.get(k_id);
if (!k_el) {
arguments.callee.defer(10, this, arguments); return;
}
k_el.dom.href = '#';
if ('string' === typeof k_onClick) { k_el.dom.href = k_onClick;
k_onClick = this._k_openUrl.createCallback(k_onClick); }
k_el.dom.onclick = this._k_createLinkHandler(k_onClick, this, [this, this.k_getItem(k_id)]);
},

_k_focusDefaultItem: function() {
var
k_defaultItemId = this.k_defaultItem,
k_defaultItem;
if (k_defaultItemId) { k_defaultItem = this.k_getItem(k_defaultItemId);
if (k_defaultItem && k_defaultItem.k_focus) {
k_defaultItem.k_focus.defer(1, k_defaultItem); }
}
},

k_setTitle: function(k_title) {
this.k_getItem('k_pageTitle').k_setValue(k_title);
this.k_setVisible('k_pageTitle', Boolean(k_title));
},

k_setDescription: function(k_description) {
this.k_getItem('k_pageDescription').k_setValue(k_description);
this.k_setVisible('k_pageDescription', Boolean(k_description));
},

_k_isCancelable: function() {
return (!this._k_isClosePage() && this.k_id !== this.k_wizard._k_loadingPageId && true === this.k_wizard._k_isCancelable && false !== this.k_containsCancelButton);
}
}); 