

kerio.waw.k_hacks = {};

kerio.waw.k_hacks.k_store = {
k_hacks: [],

k_checkAndApply: function() {
var
k_actual,
k_original,
k_hack, k_hackId;
for (k_hackId in this.k_hacks) {
k_hack = this.k_hacks[k_hackId];
if (typeof k_hack === 'object') {
k_original = k_hack.k_original.toString().replace(this._k_reg, '');
k_actual = k_hack.k_actual.toString().replace(this._k_reg, '');
if (k_original !== k_actual) {
this.k_warn(k_hackId);
}
k_hack.k_applyHack();
}
}
this.k_hacks = [];
},
k_warn: function(k_hackId) {
if (window.console) {
window.console[window.console.warn ? 'warn' : 'log']('Check the hack id \'' + k_hackId + '\'!');
}
},_k_reg: new RegExp('\\s+', 'g')};

kerio.waw.k_hacks.k_renderHtmlWithTooltip = function(k_rendererData) {
kerio.lib.k_todo('kerio.waw.k_hacks.k_renderHtmlWithTooltip applied');
if (!k_rendererData.k_isSecure || !k_rendererData.k_dataTooltip) {
return k_rendererData;
}
var
k_htmlRegExp = new RegExp('(<[^\ \/>]+)([\ >])', 'g'),
k_data = k_rendererData.k_data,
k_tooltip = k_rendererData.k_dataTooltip;
k_tooltip = kerio.lib.k_buildTooltip(k_tooltip, true);
k_data = k_data.replace(k_htmlRegExp, '$1' + k_tooltip + '$2');
k_rendererData.k_data = k_data;
return k_rendererData;
};

kerio.waw.k_hacks.k_fixGridOnLoadError = function(k_grid){
kerio.lib.k_todo('kerio.waw.k_hacks.k_fixGridOnLoadError applied');
k_grid._k_extDataStore.on('loadexception', function(){
kerio.lib.k_todo('kerio.waw.k_hacks.k_fixGridOnLoadError - extDataStore.onLoadexception applied');
if ('function' === typeof this.k_onLoadError) {
this.k_onLoadError();
}
}, k_grid);
};

kerio.lib.K_FieldsetContainer.prototype.k_setTitle = function(k_title) {
kerio.lib.k_todo('kerio.lib.K_FieldsetContainer.prototype.k_setTitle called');
this.k_extWidget.setTitle(k_title);
};

kerio.waw.k_hacks.k_fixFlip = function(k_flipResult, k_removeMethods) {
kerio.lib.k_todo('kerio.waw.k_hacks.k_fixFlip applied');
var
k_i,
k_output = {};
for (k_i in k_flipResult) {
if (false !== k_removeMethods && 'function' === k_flipResult[k_i]) {
continue;
}
k_output[k_i] = k_flipResult[k_i]; }
return k_output;
};

kerio.lib.K_Grid.prototype.k_isDragging = function() {
kerio.lib.k_todo('kerio.lib.K_Grid.prototype.k_isDragging applied');
return ( this._k_dragZone ? this._k_dragZone.dragging : false );
};

kerio.lib._K_DataStore.prototype._k_createRowRecordOrig = kerio.lib._K_DataStore.prototype._k_createRowRecord;
kerio.lib._K_DataStore.prototype._k_createRowRecord = function(k_rowData) {
kerio.lib.k_todo('kerio.lib._K_DataStore.prototype._k_createRowRecord applied');
if (!kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.finalVersion) {
if (k_rowData instanceof Array) {
kerio.lib.k_reportError('Internal error: rowData passed as array. It is deprecated, it should be an object.', 'kerio.lib._K_DataStore', '_k_createRowRecord');
}
}
return this._k_createRowRecordOrig(k_rowData);
};

kerio.waw.k_hacks.k_initCallOnLoadBeforeRender = function(k_gridView) {
kerio.lib.k_todo('kerio.waw.k_hacks.k_initCallOnLoadBeforeRender applied');
k_gridView.initData = k_gridView.initData.createInterceptor(function (ds, cm) {
kerio.lib.k_todo('kerio.waw.k_hacks.k_initCallOnLoadBeforeRender - k_gridView.initData applied');
var
k_onDataChange;
if(this.ds) {
this.ds.un('beforeload', this._k_onBeforeLoad, this);
this.ds.un('load', this._k_onLoad, this);
}
if (ds) {
k_onDataChange = this.onDataChange;

Ext.apply(this, {
_k_onDataChange: k_onDataChange,

onDataChange: function () {
kerio.lib.k_todo('kerio.waw.k_hacks.k_initCallOnLoadBeforeRender - onDataChange applied');
if (this._k_dataLoaded) {
this._k_onDataChange.apply(this);
}
else {
this._k_refreshOnLoad = true;
}
},
_k_onBeforeLoad: function () {
kerio.lib.k_todo('kerio.waw.k_hacks.k_initCallOnLoadBeforeRender - _k_onBeforeLoad applied');
this._k_dataLoaded = false;
},
_k_onLoad: function () {
kerio.lib.k_todo('kerio.waw.k_hacks.k_initCallOnLoadBeforeRender - _k_onLoad applied');
this._k_dataLoaded = true;
if (this._k_refreshOnLoad) {
this._k_onDataChange.apply(this);
delete this._k_refreshOnLoad;
}
this.grid._kx.k_owner._k_recalculateSpaceForScrollbar();
}
}); ds.on({
scope: this,
beforeload: this._k_onBeforeLoad,
load: this._k_onLoad
});
} }); }; 
kerio.waw.k_hacks.k_suspendStoreEvents = function(k_grid) {
kerio.lib.k_todo('kerio.waw.k_hacks.k_suspendStoreEvents applied');
k_grid._k_dataStore.k_extWidget.suspendEvents();
};

kerio.waw.k_hacks.k_resumeStoreEvents = function(k_grid) {
kerio.lib.k_todo('kerio.waw.k_hacks.k_resumeStoreEvents applied');
k_grid._k_dataStore.k_extWidget.resumeEvents();
};

kerio.waw.k_hacks.k_initReduceDomAfterRefresh = function(k_gridView) {
kerio.lib.k_todo('kerio.waw.k_hacks.k_initReduceDomAfterRefresh applied');
k_gridView.on('refresh', function() {
kerio.lib.k_todo('kerio.lib.wawHotfix(k_initReduceDomAfterRefresh) applied');
this.wawHotfix = new kerio.lib.wawHotfix(this);
}, this, {single: true});
k_gridView.on('refresh', function() {
kerio.lib.k_todo('this.wawHotfix.k_reduceInvisibleRowsDOM applied');
this.wawHotfix.k_reduceInvisibleRowsDOM();
}, this);
};

kerio.lib.wawHotfix = function(k_grid) {
this.k_init(k_grid);
};
kerio.lib.wawHotfix.prototype = {

k_init: function(k_grid) {
kerio.lib.k_todo('kerio.lib.wawHotfix.k_init applied');
var
k_extGrid = k_grid.k_extWidget,
k_extGridView = k_extGrid.getView(),
k_viewBody = k_extGridView.scroller.dom,
k_columnModel,
k_handlerColumnChanged;
this._k_additionalRows = 2;
this._k_grid = k_grid;
this._k_extGridView = k_extGridView;
this._k_viewBody = k_viewBody;
this._k_rowWidgetStack = [];
this._k_visibleRows = null;  k_extGrid.on({
'bodyscroll': this.k_onGridScroll,
'bodyresize': this.k_onGridScroll,  scope: this
});
k_extGrid.store.on({
'remove': this._k_onRemove,
'add'   : this._k_onAdd,
scope   : this
});

k_handlerColumnChanged = function(k_extColumnModel) {
this.k_refresh();
};
k_columnModel = k_extGrid.getColumnModel();
k_columnModel.on('hiddenchange', k_handlerColumnChanged, k_grid);
k_extGrid.on('columnresize', k_handlerColumnChanged, k_grid);
},

k_onGridScroll: function(k_rowIndex) {
kerio.lib.k_todo('kerio.lib.wawHotfix.k_onGridScroll applied');
var
k_previousVisibleRows = this._k_visibleRows,
k_visibleRows = this.k_findVisibleRows(),
k_i;
for (k_i = k_previousVisibleRows.k_visibleStart; k_i < k_previousVisibleRows.k_visibleEnd; k_i++) {
if (k_i < k_visibleRows.k_visibleStart || k_i > k_visibleRows.k_visibleEnd) {
this.k_reduceRowDOM(k_i);
}
}
for (k_i = k_visibleRows.k_visibleStart; k_i < k_visibleRows.k_visibleEnd; k_i++) {
this.k_recoverRowDOM(k_i);
}
this._k_visibleRows = k_visibleRows;
},

k_isRowVisible: function(k_rowIndex) {
kerio.lib.k_todo('kerio.lib.wawHotfix.k_isRowVisible applied');
var
k_row = this._k_extGridView.getRow(k_rowIndex),
k_rowTop,
k_rowBottom,
k_viewTop,
k_viewBottom;
if (undefined === k_row) {
return true;
}
k_rowTop = k_row.offsetTop;
k_rowBottom = k_row.offsetTop + k_row.clientHeight;
k_viewTop = this._k_viewBody.scrollTop;
k_viewBottom = k_viewTop + this._k_viewBody.clientHeight;
return (
(k_rowTop >= k_viewTop && k_rowTop <= k_viewBottom) ||
(k_rowBottom >= k_viewTop && k_rowBottom <= k_viewBottom) ||
(k_rowTop < k_viewTop && k_rowBottom > k_viewBottom)  );
},

k_findVisibleRows: function() {
kerio.lib.k_todo('kerio.lib.wawHotfix.k_findVisibleRows applied');
var
k_rowCount = this._k_grid.k_getRowsCount(),
k_scrollTop = this._k_viewBody.scrollTop,
k_minRowHeight = 20, k_minRowIndex = parseInt(k_scrollTop / k_minRowHeight, 10),
k_visibleStart,
k_visibleEnd,
k_isVisible,
k_i;
if (k_minRowIndex > 0) {
k_minRowIndex--;
}
k_minRowIndex = 0;  for (k_i = k_minRowIndex; k_i < k_rowCount; k_i++) {
k_isVisible = this.k_isRowVisible(k_i);
if (undefined === k_visibleStart) {
if (true == k_isVisible) {
k_visibleStart = Math.max(0, k_i - this._k_additionalRows);
}
}
else {
if (false == k_isVisible) {
k_visibleEnd = Math.min(k_rowCount, k_i + this._k_additionalRows);
break;
}
}
}
return {
k_visibleStart: k_visibleStart,
k_visibleEnd: undefined === k_visibleEnd ? k_rowCount : k_visibleEnd
};
},

k_reduceInvisibleRowsDOM: function() {
kerio.lib.k_todo('kerio.lib.wawHotfix.k_reduceInvisibleRowsDOM applied');
var
k_visibleRows = this.k_findVisibleRows(),
k_rowCount = this._k_grid.k_getRowsCount(),
k_i;
this._k_visibleRows = k_visibleRows;
for (k_i = 0; k_i < k_rowCount; k_i++) {
if (k_i < k_visibleRows.k_visibleStart || k_i > k_visibleRows.k_visibleEnd) {
this.k_reduceRowDOM(k_i);
}
}
},

k_reduceRowDOM: function(k_rowIndex) {
kerio.lib.k_todo('kerio.lib.wawHotfix.k_reduceRowDOM applied');
var
k_row = this._k_extGridView.getRow(k_rowIndex),
k_rowHeight,
k_rowWidget;
if (undefined === k_row) {
return;
}
k_rowHeight = k_row.clientHeight;
k_rowWidget = this._k_getRowWidget(k_row.firstChild, k_rowIndex);
k_row.style.height = k_rowHeight + 'px';
kerio.lib.k_uiCacheManager.k_releaseDOM.call(k_rowWidget);
},

k_recoverRowDOM: function(k_rowIndex) {
kerio.lib.k_todo('kerio.lib.wawHotfix.k_recoverRowDOM applied');
var
k_row = this._k_extGridView.getRow(k_rowIndex),
k_rowHeight,
k_rowWidget;
if (undefined === k_row) {
return;
}
k_rowHeight = k_row.clientHeight;
k_rowWidget = this._k_rowWidgetStack[k_rowIndex];  if (k_rowWidget && k_rowWidget.k_nodeInfo && k_rowWidget.k_nodeInfo.k_isRemoved) {
k_row.style.height = '';
kerio.lib.k_uiCacheManager.k_recoverDOM.call(k_rowWidget);
}
},

_k_getRowWidget: function(k_row, k_rowIndex) {
kerio.lib.k_todo('kerio.lib.wawHotfix._k_getRowWidget applied');
var k_rowWidget = this._k_rowWidgetStack[k_rowIndex];
if (!k_rowWidget || k_row != k_rowWidget.getEl().dom) {  k_rowWidget = this._k_createFakeExtWidget(k_row);
this._k_rowWidgetStack[k_rowIndex] = k_rowWidget;
}
return k_rowWidget;
},

_k_createFakeExtWidget: function(k_domElement) {
kerio.lib.k_todo('kerio.lib.wawHotfix._k_createFakeExtWidget applied');
return {
_k_domElement: k_domElement,
getEl: function() {
return {dom: this._k_domElement};
}
};
},

_k_onRemove: function (k_dataStore, k_record, k_index) {
kerio.lib.k_todo('kerio.lib.wawHotfix._k_onRemove applied');
this._k_rowWidgetStack.splice(k_index, 1);
this.k_onGridScroll(k_index);
},

_k_onAdd: function(k_dataStore, k_record, k_index){
kerio.lib.k_todo('kerio.lib.wawHotfix._k_onAdd applied');
var
k_row = this._k_grid.k_extWidget.getView().getRow(k_index).firstChild,
k_rowWidget = this._k_createFakeExtWidget(k_row);
this._k_rowWidgetStack.splice(k_index, 0, k_rowWidget);
}
}; kerio.lib.K_Statusbar.prototype.k_removeIconClassName = function (k_className) {
kerio.lib.k_todo('kerio.lib.K_Statusbar.prototype.k_removeIconClassName applied');
if ('string' === typeof k_className) {
k_className = k_className.split(' ');
}
this._k_updateElementClassName('k_remove', this.k_extWidget._kx.k_iconId, k_className);
};

kerio.waw.k_hacks.k_addSortingHack = function(k_grid) {
kerio.lib.k_todo('kerio.waw.k_hacks.k_addSortingHack applied');
var
k_dataStore = k_grid._k_extDataStore;
k_dataStore.load = k_dataStore.load.createInterceptor(
function(k_options, k_forceCache) {
kerio.lib.k_todo('kerio.waw.k_hacks.k_addSortingHack - k_dataStore.load.createInterceptor applied');
var
k_connectionsGrid = this._kx.k_relatedWidget,
k_sortInfo = this._kx.k_owner._k_dataStore.sortInfo;
if (k_connectionsGrid.k_parentFormElements.k_showDnsNames && false === k_connectionsGrid.k_showDnsNames) {
k_sortInfo.fieldOriginal = k_sortInfo.field;
switch (k_sortInfo.field){
case 'srcHost':
k_sortInfo.field = 'srcIp';
break;
case 'dstHost':
k_sortInfo.field = 'dstIp';
break;
}
}
}
);
k_dataStore.loadRecords = k_dataStore.loadRecords.createInterceptor(
function (o, options, success) {
kerio.lib.k_todo('kerio.waw.k_hacks.k_addSortingHack - k_dataStore.loadRecords.createInterceptor applied');
var
k_connectionsGrid = this._kx.k_relatedWidget;
if (k_connectionsGrid.k_parentFormElements.k_showDnsNames && false === k_connectionsGrid.k_showDnsNames) {
this._kx.k_owner._k_dataStore.sortInfo.field = this._kx.k_owner._k_dataStore.sortInfo.fieldOriginal;
}
}
);
};kerio.waw.k_hacks.k_store.k_hacks['k_bug64871'] = {
k_actual: kerio.lib.K_TextField.prototype._k_beforeInitExtComponent,
k_original: function(k_adaptedConfig, k_storedConfig) {
var k_maxLength = k_storedConfig.k_maxLength;
if (-1 === k_maxLength) {
delete k_adaptedConfig.maxLength;
}
else {
k_maxLength = k_maxLength || kerio.lib.k_constants.k_TEXT_FIELD_MAX_LENGTH;
this._k_maxLength = k_maxLength;
k_adaptedConfig.maxLength = k_maxLength;
}
delete k_storedConfig.k_maxLength;
this._k_initAllowBlank();
},
k_applyHack: function() {
kerio.lib.K_TextField.prototype._k_beforeInitExtComponent = kerio.lib.K_TextField.prototype._k_beforeInitExtComponent.createSequence(function() {
kerio.lib.k_todo('kerio.lib.K_TextField.prototype._k_beforeInitExtComponent applied');
var k_validatorCfg = this._k_storedConfig.k_validator;
if (k_validatorCfg && k_validatorCfg.k_inputFilter) {
this._k_adaptedConfig.maskRe = k_validatorCfg.k_inputFilter;
}
});
}
};

kerio.adm.k_framework._k_doHelpAction = function(k_helpAction) {
kerio.lib.k_todo('kerio.adm.k_framework._k_doHelpAction applied');
if ('ipad' === k_helpAction.k_helpUrlQuery) {
kerio.waw.shared.k_methods.k_openSpecificKbArticle(1298);
return;
}
if (this._k_helpUrlQuery) {
kerio.waw.shared.k_methods.k_checkConnectivityToKb(k_helpAction, this._k_helpUrlQuery);
}
else {
kerio.lib.k_ui.k_showDialog(k_helpAction.k_dialog);
}
};

kerio.adm.k_framework.k_isKnowledgeBaseAvailable = function() {
kerio.lib.k_todo('kerio.adm.k_framework.k_isKnowledgeBaseAvailable applied');
var
k_KB_STATUS = kerio.waw.shared.k_DEFINITIONS.k_KB_STATUS;
if (k_KB_STATUS.k_AVAIABLE === k_KB_STATUS.k_status) {
return true;
}
return false;
};
kerio.waw.k_hacks.k_store.k_checkAndApply();
kerio.adm.k_framework.k_showHelp = function(k_content) {
kerio.lib.k_todo('kerio.adm.k_framework.k_showHelp applied');
var
k_framework = kerio.adm.k_framework,
k_helpUrlQuery;
k_helpUrlQuery = k_framework.k_getHelpUrlQuery(k_framework._k_helpUrlQuery);
kerio.waw.shared.k_methods.k_checkConnectivityToKb(k_framework._k_helpActions[0], k_helpUrlQuery);
};

kerio.waw.k_hacks.k_setImageBackgroundForImageField = function(k_imageField, k_imagePath) {
var
k_timestamp = new Date().getTime(),
k_imageElement = k_imageField.k_extWidget.getEl();
if (k_imageElement) {
k_imageElement.parent('.x-form-element').dom.style.backgroundImage = 'url(' + kerio.lib.k_ajax.k_changeDownloadUrlForMyKerio(k_imagePath + '?t=' + k_timestamp) + ')';
}
else {
k_imageField.k_backgrounImagePath = k_imagePath;
k_imageField.k_extWidget.afterRender.createSequence(function(){
kerio.waw.k_hacks.k_setImageBackgroundForImageField(this, this.k_backgrounImagePath);
}, k_imageField);
}
};

kerio.lib.k_todo('kerio.lib.k_inputValidator._k_parseRestrictions overriden');
kerio.lib.k_inputValidator._k_parseRestrictions = function(k_restrictionsFromServer) {
var k_rest;
var k_restrictions = this._k_restrictions;
for (var k_i = 0, k_len = k_restrictionsFromServer.length; k_i < k_len; k_i++) {
k_rest = k_restrictionsFromServer[k_i];
k_restrictions[k_rest.entityName] = {};
var k_tuples = k_rest.tuples;
for (var k_j = 0, k_len2 = k_tuples.length; k_j < k_len2; k_j++) {
var k_name = k_tuples[k_j].name;
if (undefined === k_restrictions[k_rest.entityName][k_name]) {
k_restrictions[k_rest.entityName][k_name] = [];
}
k_restrictions[k_rest.entityName][k_name].push(k_tuples[k_j]);
}
}
};
