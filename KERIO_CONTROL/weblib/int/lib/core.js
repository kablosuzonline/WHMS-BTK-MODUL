

kerio.lib.k_uiCacheManager = {
_k_uiNamespace: null,
_k_uiCache: {},
_k_onDemandFiles: {},  _k_ajaxRequestStack: [],

k_init: function(k_config) {
this._k_uiNamespace = k_config.k_uiNamespace;
},

k_load: function(k_config) {
var
k_sourceName = k_config.k_sourceName,
k_appSourcePath = k_config.k_sourcePath || kerio.lib.k_getSharedConstants('kerio_web_AppSourcePath', false),
k_fullSourceName = (k_appSourcePath ? k_appSourcePath + '/' : '') + k_sourceName,
k_isLoadOnly = true === k_config.k_loadOnly,
k_requestOwner,
k_uiNamespace,
k_pos;
if (!k_sourceName) {
kerio.lib.k_reportError('Internal error: uiCacheManager.k_load - source name is not defined!', 'uiCacheManager.js');
return;
}
k_uiNamespace = this._k_uiNamespace;
k_requestOwner = k_isLoadOnly ? null : this;
if (k_uiNamespace[k_sourceName] && !k_isLoadOnly) {
this._k_createKerioWidget(k_uiNamespace[k_sourceName], k_config);
}
else { if (!k_isLoadOnly) {
kerio.lib.k_ajax.k_abortAllPendingRequests(this);
}
kerio.lib.k_ajax.k_request({
k_url: k_fullSourceName + '.js' + kerio.lib._k_kerioLibraryQuery,
k_method: 'get',
k_callback: this._k_loadCallback,
k_scope: this,
k_callbackParams: Ext.apply(k_config, {k_sourceName: k_sourceName}),
k_requestOwner: k_requestOwner,
k_errorMessages: {k_invalidResponse: ''}
});
}
}, 
k_get: function(k_sourceName, k_objectName) {
var k_widget = this._k_uiCache[k_sourceName];
return k_widget && undefined !== k_objectName ? k_widget[k_objectName] : k_widget;
},

_k_add: function (k_sourceName, k_objectName, k_uiWidget) {
if (undefined === k_objectName) {
this._k_uiCache[k_sourceName] = k_uiWidget;
}
else {
if (!this._k_uiCache[k_sourceName]) {
this._k_uiCache[k_sourceName] = {};
}
this._k_uiCache[k_sourceName][k_objectName] = k_uiWidget;
}
},

_k_remove: function (k_objectName) {
}, 
_k_clear: function() {

}, 
_k_loadCallback: function(k_response, k_success, k_callbackParams) {
var
k_sourceName = k_callbackParams.k_sourceName,
k_configurationObject,
k_status,
k_statusText;
if (k_success) {
this._k_onDemandFiles[k_sourceName] = 1;
if (!k_callbackParams.k_loadOnly) {
k_configurationObject = this._k_evalJsonConfig(k_sourceName, k_response.k_xhrResponse.responseText);
if (k_configurationObject) {
this._k_createKerioWidget(k_configurationObject, k_callbackParams);
}
}
}
else {
k_status = k_response.k_xhrResponse.status;
k_statusText = k_response.k_xhrResponse.statusText;
if (-1 !== k_status && 0 !== k_status) {
kerio.lib.k_reportError('Internal error: loadContent ' + k_sourceName + ' failed! - ' + k_status + ' ' + k_statusText, 'uiCacheManager');
}
kerio.lib.k_unmaskWidget(kerio.lib.k_ui._k_getActiveWidget());
}
}, 
_k_evalJsonConfig: function(k_sourceName, k_source) {
var
k_existingProperties = {},
k_newUIName = null,
k_newCnt = 0,
k_propertyName,
k_msg = '';
for (k_propertyName in this._k_uiNamespace) {
k_existingProperties[k_propertyName] = 1;
}
try {
eval(k_source);
}
catch (k_ex) {
k_msg = 'Error in on-demand loaded dialog "' + k_sourceName + '". ' + k_ex.name + ': ' + k_ex.message;
kerio.lib.k_reportError(k_msg, k_sourceName, k_ex.lineNumber, k_ex.stack);
return null;
}
for (k_propertyName in this._k_uiNamespace) {
if (!k_existingProperties[k_propertyName]) {  k_newCnt++;
k_newUIName = k_propertyName;
}
}
if (1 !== k_newCnt || k_newUIName !== k_sourceName) {
k_msg = 'ERROR: Invalid configuration file ' + k_sourceName + '.\n\n';
if (1 !== k_newCnt) {
k_msg += 'It has to contain exactly one new property (widget definition) in its namespace. Here are '
+ k_newCnt + ' actually.';
}
else {
k_msg += 'A name of property (widget definition) has to be equal to the file name (it is '
+ k_newUIName + ' actually).';
}
kerio.lib.k_reportError('Internal error: ' + k_msg, 'uiCacheManager.js');
return;
}
return this._k_uiNamespace[k_newUIName];
}, 
_k_createKerioWidget: function(k_configurationObject, k_destinationOptions) {
var
k_objectName = k_destinationOptions.k_objectName || k_destinationOptions.k_sourceName,
k_kerioWidget;
try {
k_kerioWidget = k_configurationObject.k_init(k_objectName, k_destinationOptions.k_initParams);
}
catch (k_ex) {
kerio.lib.k_reportError(k_ex.name + ': ' + k_ex.message + ' [initialization of "' + k_objectName + '"]', k_destinationOptions.k_sourceName, k_ex.lineNumber, k_ex.stack);
return null;
}
this._k_add(k_destinationOptions.k_sourceName, k_destinationOptions.k_objectName, k_kerioWidget);
k_destinationOptions._k_callback.call(k_destinationOptions._k_scope, k_destinationOptions);

if (k_kerioWidget.k_relatedDialogs) {
this._k_loadRelatedDialogs.defer(10000, k_kerioWidget);
}
return k_kerioWidget;
}, 
_k_loadRelatedDialogs: function() {
var
k_sourceName,
k_relatedDialogs = this.k_relatedDialogs;
for (var k_i = 0, k_cnt = k_relatedDialogs.length; k_i < k_cnt; k_i++) {
k_sourceName = k_relatedDialogs[k_i];
if (undefined === kerio.lib.k_uiCacheManager._k_onDemandFiles[k_sourceName]) {
kerio.lib.k_uiCacheManager.k_load({k_sourceName: k_sourceName, k_loadOnly: true});
}
}
},

k_releaseDOM: function() {
var
k_extWidget = this,
k_element = k_extWidget.getEl().dom,
k_parent = k_element.parentNode;
k_parent.removeChild(k_element);
k_extWidget.k_nodeInfo = {
k_element: k_element,
k_parent: k_parent,
k_isRemoved: true
};
kerio.lib.k_uiCacheManager._k_bypassExtGarbageCollector(k_element, true);
},

k_recoverDOM: function() {
var
k_nodeInfo = this.k_nodeInfo,
k_grids,
k_view,
k_i, k_cnt;
if (k_nodeInfo && k_nodeInfo.k_parent) {
k_nodeInfo.k_isRemoved = false;
k_nodeInfo.k_parent.appendChild(k_nodeInfo.k_element);
kerio.lib.k_uiCacheManager._k_bypassExtGarbageCollector(k_nodeInfo.k_element, false);
k_grids = this.findByType(Ext.grid.GridPanel);
for (k_i = 0, k_cnt = k_grids.length; k_i < k_cnt; k_i++) {
if (k_grids[k_i].viewReady) {
k_view = k_grids[k_i].getView();
if (k_view instanceof kerio.lib._K_GridBufferView) {
if (kerio.lib.k_isMSIE10) {
k_view.focusEl.dom.style.position = "absolute";
}
if (!k_view.isRowRendered(k_view.getVisibleRows().first)) {
k_view.update();
}
}
}
}
}
},

_k_bypassExtGarbageCollector: function(k_element, k_skip) {
var
k_children = k_element.getElementsByTagName('*'),
k_cnt = k_children.length,
k_cachedElement = Ext.elCache[k_element.id],
k_child,
k_i;
if (k_cachedElement) {
this._k_setSkipGCproperty(k_cachedElement, k_skip);
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_child = k_children[k_i];
if (k_child.id) {
k_cachedElement = Ext.elCache[k_child.id];
if (k_cachedElement) {
this._k_setSkipGCproperty(k_cachedElement, k_skip);
}
}
}
},

_k_setSkipGCproperty: function(k_cachedElement, k_skip) {
if (k_skip) {
k_cachedElement.k_originalSkipGC = k_cachedElement.skipGC;
k_cachedElement.skipGC = true;
}
else {
k_cachedElement.skipGC = k_cachedElement.k_originalSkipGC;
}
}
};


kerio.lib.k_ui = {

k_init: function() {
this.k_disableTextSelectionAndCtxMenu();
this.k_disableCtrlA();
this.k_initFocusSearchField();
this.k_preventAbortXhrOnEsc();
this.k_setBrowserIdToBodyClass();
this.k_createClipboardTextarea();
},

k_initFocusSearchField: function () {
Ext.getDoc().on('keydown', function(k_extEvent) {
var
k_key = k_extEvent.getKey(),
k_searchField,
k_window,
k_i,
k_cnt;
if (k_extEvent.ctrlKey && (70 === k_key || 102 === k_key)) {
k_extEvent.preventDefault();
if (Ext.isIE) {
try {
k_extEvent.browserEvent.keyCode = false;  }
catch(e) {}
}
k_window = kerio.lib._k_windowManager.k_getActiveWindow();  if (k_window) {
k_window = [k_window];
}
else {
k_window = kerio.lib._k_windowManager._k_mainLayout._k_focusableItems.items;
}
for (k_i = 0, k_cnt = k_window.length; k_i < k_cnt; k_i++) {
k_searchField = k_window[k_i]._k_searchField;
if (k_searchField) {
k_searchField.k_focus();
if ('function' === Ext.type(k_searchField._k_higlight)) {
k_searchField._k_higlight();
}
break;
}
}
}
});
},

k_disableCtrlA: function() {
Ext.getDoc().on('keydown', function (k_extEvent) {
var
k_key = k_extEvent.getKey(),
k_tagName;
if (k_extEvent.ctrlKey && (65 === k_key || 97 === k_key)) {
k_tagName = k_extEvent.target.tagName.toLowerCase();
if ('input' === k_tagName || 'textarea' === k_tagName) {
return; }
k_extEvent.stopEvent();
}
});
},

k_disableTextSelectionAndCtxMenu: function() {
var k_document = Ext.getDoc();
if (Ext.isIE) {
k_document.on('selectstart', this._k_disableSelectText);
}
k_document.on('contextmenu', this._k_disableSelectText);
},

k_preventAbortXhrOnEsc: function() {
if(Ext.isGecko){
Ext.getDoc().on('keydown', function(k_extEvent) {
if (k_extEvent.ESC === k_extEvent.getKey()) {
k_extEvent.preventDefault();
}
});
}
},

_k_disableSelectText: function() {
var k_event = Ext.EventObject,
k_targetEl = k_event.getTarget(),
k_extElement = Ext.get(k_targetEl),
k_tagName = '',
k_targetType = null;
if (Ext.isIE && (!k_extElement || (k_extElement && k_extElement.dom.disabled))) {
Ext.lib.Event.stopEvent(k_event);
return false;
}
if (k_extElement.findParent('.selectable')) {
return true;
}
if (k_targetEl.tagName) {
k_tagName = k_targetEl.tagName.toLowerCase();
}
if ('input' === k_tagName || 'textarea' === k_tagName) {
k_targetType = k_targetEl.type;
if (0 !== k_event.button) {
if ('radio' === k_targetType || 'checkbox' === k_targetType) {

Ext.lib.Event.stopEvent(k_event);
return false;
}
}
return true;
}

Ext.lib.Event.stopEvent(k_event);
return false;
},

k_setBrowserIdToBodyClass: function() {
var
k_body = Ext.getBody(),
k_classNameList = ['kerio'], k_lib = kerio.lib;
if (k_lib.k_isMSIE) {
k_classNameList.push('br-ie');
if (k_lib.k_isMSIE6) {
k_classNameList.push('br-ie6');
}
else if (k_lib.k_isMSIE7) {
k_classNameList.push('br-ie7');
}
else { k_classNameList.push('br-ie8');
if (k_lib.k_isMSIE9) {
k_classNameList.push('br-ie9');
}
else if (k_lib.k_isMSIE10) {
k_classNameList.push('br-ie9');
k_classNameList.push('br-ie10');
}
}
}
else if (k_lib.k_isFirefox) {
k_classNameList.push('br-ff');
if (k_lib.k_isFirefox2) {
k_classNameList.push('br-ff2');
}
else if (k_lib.k_isFirefox3) {
k_classNameList.push('br-ff3');
if (k_lib.k_isFirefox36) {
k_classNameList.push('br-ff36');
}
}
else { k_classNameList.push('br-ff4');
if (k_lib.k_isFirefox5) {
k_classNameList.push('br-ff5');
}
}
}
else if (k_lib.k_isWebKit) {
k_classNameList.push('br-webkit');
if (k_lib.k_isSafari) {
k_classNameList.push('br-sf');
if (k_lib.k_isSafari3) {
k_classNameList.push('br-sf3');
}
else if (k_lib.k_isSafari4) {
k_classNameList.push('br-sf4');
}
else { k_classNameList.push('br-sf5');
}
}
if (k_lib.k_isChrome) {
k_classNameList.push('br-chrome');
}
}
else if (k_lib.k_isMSIE11) {
k_classNameList.push('br-ie11');
Ext.util.CSS.createStyleSheet('* {font-family: "Segoe UI" !important;}', 'ie11font');
}
if (Ext.isWindows) {
k_classNameList.push('os-windows');
}
else if (Ext.isMac) {
k_classNameList.push('os-mac');
if (k_lib.k_isTiger) {
k_classNameList.push('os-tiger');
} else if (k_lib.k_isLeopard) {
k_classNameList.push('os-leopard');
} else if (k_lib.k_isSnowLeopard) {
k_classNameList.push('os-snowLeopard');
} else if (kerio.lib.k_isLion) {
k_classNameList.push('os-lion');
}
}
else if (Ext.isLinux) {
k_classNameList.push('os-linux');
}
k_body.addClass(k_classNameList);
},

k_createClipboardTextarea: function() {
var k_clipboard = Ext.getBody().createChild({
id: 'k_clipboardTextarea',
tag: 'textarea',
style: 'position: absolute; top: -1000px; left: -1000px; width: 100px; height: 100px'
});
k_clipboard.on('keyup', function() {
if (this.k_returnFocusTo) {
this.k_returnFocusTo.focus();
}
});
if (kerio.lib.k_isWebKit && kerio.lib.k_isSnowLeopardOrLater) {  k_clipboard.on('keydown', function(k_extEvent) {
if (k_extEvent.ctrlKey && 65 === k_extEvent.getKey()) {
if (this.k_relayKeyDown && this.k_relayKeyDown._k_onKeyDown) {
this.k_relayKeyDown._k_onKeyDown.call(this.k_relayKeyDown, k_extEvent);
if (this.k_returnFocusTo) {
this.k_returnFocusTo.focus();
}
}
}
});
}
kerio.lib.k_clipboardElement = k_clipboard;
},

_k_getActiveWidget: function() {
var k_widget = kerio.lib._k_windowManager.k_getActiveWindow();
if (undefined === k_widget) {
k_widget = kerio.lib.k_getViewport();
}
return k_widget;
},

k_showDialog: function(k_config) {
if (!k_config) {
return;
}
var
k_uiCacheManager = kerio.lib.k_uiCacheManager,
k_uiWidget = k_uiCacheManager.k_get(k_config.k_sourceName, k_config.k_objectName),
k_ui = kerio.lib.k_ui,
k_activeWidget = k_ui._k_getActiveWidget();
if (k_uiWidget) {
k_uiWidget.k_show();
kerio.lib.k_unmaskWidget(k_activeWidget);	if (k_uiWidget.k_applyParams) {
k_uiWidget.k_applyParams.call(k_uiWidget, k_config.k_params);
}
}
else {
kerio.lib.k_maskWidget(k_activeWidget);	k_config._k_callback = arguments.callee;
k_config._k_scope = k_ui;
k_uiCacheManager.k_load.call(k_uiCacheManager, k_config);
}
}
};
