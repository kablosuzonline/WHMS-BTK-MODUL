

Ext4.define('kerio.lib._K_DataStore' + '4', {
extend: 'kerio.lib._K_BaseComponent' + '4',











k_DEFAULT_PAGE_SIZE: 50,
k_MAX_PAGE_SIZE: 999999,
_k_isOrderChangedColumnName: 'isOrderChanged',
_k_propertiesMapping: {
_k_isRemoteSort: 'remoteSort',
_k_isRemoteGroup: 'remoteGroup',
_k_groupField: 'groupField',
k_onLoadException: {k_extName: 'loadexception', k_listener: 'this._k_onLoadException', k_scope: 'this'},
k_onLoad:          {k_extName: 'load'         , k_listener: 'this._k_onLoad'         , k_scope: 'this'}
},

_k_jsonReaderDefaults: {
root: 'data',
totalProperty: 'totalItems'
},

_k_jsonReaderMapping: {
k_root: 'root',
k_totalProperty: 'totalProperty'
},

_k_recordMapping: {
k_columnId: 'name',
k_mapping: 'mapping'
},

constructor: function(k_owner, k_config) {
var
k_isAutoLoaded,
k_localData = k_config.k_localData,
k_remoteData = k_config.k_remoteData;
this._k_setStoredProperties([
{'k_sorting': 'k_sorting'},
{'k_remoteData.k_jsonRpc': 'k_jsonRpc'},
{'k_remoteData.k_startParamName': 'k_startParamName'},
{'k_remoteData.k_limitParamName': 'k_limitParamName'},
{'k_remoteData.k_bufferSize': 'k_bufferSize'},
{'k_remoteData.k_preBufferLimit': 'k_preBufferLimit'}
]);
this._k_owner = k_owner;  this.k_relatedWidget = k_owner;
this._k_lastRequestOptions = null;
this._k_isLocalData = (undefined === k_remoteData);
k_isAutoLoaded = (undefined !== k_localData);
if (!this._k_isLocalData) {
k_isAutoLoaded = (undefined === k_remoteData.k_isAutoLoaded) ? true : k_remoteData.k_isAutoLoaded;
this._k_isBuffered = true === k_remoteData.k_isBuffered;
}
this._k_isAutoLoaded = k_isAutoLoaded;
this._k_initPaging(k_config);
this._k_createReaderProxy(k_config);
this._k_additionalSortColumnsList = {};
this.callParent([k_config]);
kerio.lib._k_addKerioProperty(this.k_extWidget, {
k_relatedWidget: this.k_relatedWidget
});
var k_dataStore = this.k_extWidget;
k_dataStore.on('add'   , this._k_onDataStoreChanged, this);
k_dataStore.on('update', this._k_onDataStoreChanged, this);
k_dataStore.on('remove', this._k_onDataStoreChanged, this);
if (this._k_isLocalData && k_localData) {
this._k_loadData(k_localData);
}
},

_k_createReaderProxy: function(k_config) {
var
k_lib = kerio.lib,
k_recordsCfg = k_config.k_record,
k_cnt = k_recordsCfg.length,
k_remoteData = k_config.k_remoteData,
k_idColumnExists = false,
k_extJsonReaderCfg,
k_extRecordCfg,
k_primaryKey,
k_recordCfg,
k_proxyCfg,
k_idIndex,
k_reader,
k_proxy,
k_i;
k_extRecordCfg = k_lib._k_createConfig.call(this, k_recordsCfg, null, this._k_recordMapping);
for (k_i = 0; k_i < k_cnt; k_i++) {
k_recordCfg = k_recordsCfg[k_i];
if ('id' === k_recordCfg.k_columnId) {
k_idColumnExists = true;
k_idIndex = k_i;
}
if (true === k_recordCfg.k_isPrimaryKey) {
k_primaryKey = k_recordCfg.k_columnId;
k_idIndex = k_i;
break;
}
}
if (k_idColumnExists && !k_primaryKey) {
k_primaryKey = 'id';
}
this._k_primaryKey = k_primaryKey;
this._k_modelName = 'kerio.lib._k_models' + '.' + this._k_owner.k_id + '_' + 'k_model';
Ext4.define(this._k_modelName, {
extend: 'Ext4.data.Model',
fields: k_extRecordCfg
});
if (this._k_isLocalData) {
k_reader = Ext4.create('Ext4.data.reader.Array', {
idProperty: k_primaryKey
});
k_proxy = Ext4.create('Ext4.data.proxy.Memory', {
reader: k_reader,
model: this._k_modelName
});
}
else { k_extJsonReaderCfg = k_lib._k_createConfig.call(this, k_remoteData, this._k_jsonReaderDefaults, this._k_jsonReaderMapping);
k_extJsonReaderCfg.idProperty = k_primaryKey;
k_reader = Ext4.create('Ext4.data.reader.Json', k_extJsonReaderCfg);
k_proxyCfg = {
k_url: k_remoteData.k_url,
k_timeout: k_remoteData.k_timeout,
k_dataStore: this,  reader: k_reader,
model: this._k_modelName,
extraParams: k_remoteData.k_jsonRpc,
k_isQueryValueSent: false !== k_remoteData.k_isQueryValueSent,
k_onError: k_config.k_onError
};
if (k_remoteData.k_startParamName) {
k_proxyCfg.startParam = k_remoteData.k_startParamName;
}
if (k_remoteData.k_limitParamName) {
k_proxyCfg.limitParam = k_remoteData.k_limitParamName;
}
k_proxy = Ext4.create('kerio.lib._K_HttpProxy', k_proxyCfg);
this._k_dataSourceRoot = k_extJsonReaderCfg.root;
this._k_totalProperty = k_extJsonReaderCfg.totalProperty;
}
this._k_reader = k_reader;
this._k_proxy = k_proxy;
this._k_jsonDescriptionDefinitions = k_extRecordCfg;
}, 
_k_prepareConfig: function(k_config) {
var
k_sortingCfg = k_config.k_sorting,
k_groupingCfg = k_config.k_grouping,
k_isRemoteSort = false,
k_isRemoteGroup = false;
if (k_config.k_remoteData) {
k_isRemoteSort = true;
if (k_sortingCfg && undefined !== k_sortingCfg.k_isRemoteSort) {
k_isRemoteSort = k_sortingCfg.k_isRemoteSort;
}
if (k_groupingCfg) {
k_isRemoteGroup = true;
if (undefined !== k_groupingCfg.k_isRemoteGroup) {
k_isRemoteGroup = k_groupingCfg.k_isRemoteGroup;
}
}
}
if (k_groupingCfg) {
k_config._k_groupField = k_groupingCfg.k_columnId;
k_config._k_isRemoteGroup = k_isRemoteGroup;
}
k_config._k_isRemoteSort = k_isRemoteSort;
return k_config;
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
K_extDataStoreConstructor,
k_extWidget;
Ext4.apply(k_adaptedConfig,{
proxy: this._k_proxy,
model: this._k_modelName
});
if (this._k_isBuffered) {
K_extDataStoreConstructor = kerio.lib._K_DataStoreBuffered;
if (undefined !== k_storedConfig.k_preBufferLimit) {
k_adaptedConfig.k_preBufferLimit = k_storedConfig.k_preBufferLimit;
}
if (undefined !== k_storedConfig.k_bufferSize) {
k_adaptedConfig.k_bufferSize = k_storedConfig.k_bufferSize;
}
}
else {
K_extDataStoreConstructor = Ext4.data.Store;
}
this._k_isSortable = !!k_storedConfig.k_sorting;
if (this._k_isSortable) {
k_adaptedConfig.sorters = [{
property: k_storedConfig.k_sorting.k_columnId,
direction: false === k_storedConfig.k_sorting.k_isAscending ? 'DESC' : 'ASC'
}];
}
this._k_removeStoredProperties([
'k_sorting',
'k_startParamName',
'k_limitParamName',
'k_bufferSize',
'k_preBufferLimit'
]);
if (k_storedConfig.k_jsonRpc) {
this._k_baseRequestParams = kerio.lib._k_cloneObject(k_storedConfig.k_jsonRpc);
this._k_removeStoredProperties(['k_jsonRpc']);
}
k_extWidget = new K_extDataStoreConstructor(k_adaptedConfig);
return k_extWidget;
}, 
_k_initPaging: function(k_config) {
var
k_pageSize = k_config.k_pageSize,
k_isPaging = k_pageSize ? true : false,
k_startParamName = k_config.k_remoteData ? k_config.k_remoteData.k_startParamName || 'start' : 'start',
k_limitParamName = k_config.k_remoteData ? k_config.k_remoteData.k_limitParamName || 'limit' : 'limit',
k_autoLoadRequestParams = {};
if (!k_isPaging) {
k_pageSize = this.k_MAX_PAGE_SIZE;
}
else if (true === k_pageSize) {
k_pageSize = this.k_DEFAULT_PAGE_SIZE;
}
if (!this._k_isLocalData) {
k_autoLoadRequestParams[k_startParamName] = 0;
k_autoLoadRequestParams[k_limitParamName] = -1;
}
if (k_isPaging) {
if (!k_autoLoadRequestParams.query) {
k_autoLoadRequestParams.query = {};
}
k_autoLoadRequestParams[k_limitParamName] = k_pageSize;
}
this.k_pageSize = k_pageSize;
this._k_isPaging = k_isPaging;
this._k_autoLoadRequestParams = k_autoLoadRequestParams;
}, 
_k_onLoad: function(k_extStore, k_extRecords, k_successful,  k_operation) {
if (false !== k_successful) {
this._k_mappedListeners.k_onLoad.call(this.k_relatedWidget, this.k_relatedWidget, this.k_getLastJsonRpcCfg(), this._k_reader.jsonData);
}
},

_k_onLoadException: function(k_extHttpProxy, k_callbackParams, k_response, k_extException) {
if (200 != k_response.status) {
return;
}
this._k_mappedListeners.k_onLoadException.call(this.k_relatedWidget, this.k_relatedWidget, k_response);
},

_k_onDataStoreChanged: function(k_extStore, k_extRecords) {
if (!this._k_moveRecordsInAction) {
kerio.lib.k_notify(this.k_relatedWidget, kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED);
}
},

k_getRowsCount: function(k_returnTotalCount) {
var k_count;
if (this._k_isLocalData || (true !== k_returnTotalCount)) {
k_count = this.k_extWidget.getCount();
}
else {
k_count = this.k_extWidget.getTotalCount();
}
return k_count;
},

_k_mapDataObjectToArray: function (k_dataObject) {
var k_jsonDesc = this._k_jsonDescriptionDefinitions,
k_arrayData = [],
k_i, k_cnt = k_jsonDesc.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_arrayData.push(k_dataObject[k_jsonDesc[k_i].name]);
}
return k_arrayData;
},

k_getData: function () {
var
k_data = [],
k_storeItems = this.k_extWidget.getRange(),
k_i, k_cnt;
for (k_i = 0, k_cnt = k_storeItems.length; k_i < k_cnt; k_i++) {
k_data[k_i] = k_storeItems[k_i].data;
}
return k_data;
},

k_setData: function(k_data, k_append, k_mapping) {
this._k_loadData(k_data, false);
},

k_clearData: function (k_totalLength) {
var k_extDataStore = this.k_extWidget;
k_extDataStore.removeAll();
k_extDataStore.totalLength = undefined !== k_totalLength ? k_totalLength : 0; },

_k_createRowRecord: function(k_rowData) {
var
K_RowRecordTemplate = this.k_extWidget.model, k_fields,
k_i, k_cnt,
k_itemDesc;
if (k_rowData instanceof Array) {
k_rowData = this._k_remapData(k_rowData, this._k_jsonDescriptionDefinitions);
}
else {
k_rowData = kerio.lib.k_cloneObject(k_rowData);
}
k_fields = K_RowRecordTemplate.prototype.fields;
for (k_i = 0, k_cnt = k_fields.getCount(); k_i < k_cnt; k_i++) {
k_itemDesc = k_fields.getAt(k_i);
if (undefined === k_rowData[k_itemDesc.name]) {
k_rowData[k_itemDesc.name] = k_itemDesc.defaultValue;
}
}
return new K_RowRecordTemplate(k_rowData, this._k_primaryKey ? k_rowData[this._k_primaryKey] : undefined);
}, 
k_addRow: function(k_rowData, k_targetRowIndex) {
var
k_dataStore = this.k_extWidget,
k_rowRecord = this._k_createRowRecord(k_rowData),
k_numberOfRows = k_dataStore.data.items.length;
if ((undefined !== k_targetRowIndex) && (k_numberOfRows > k_targetRowIndex)) {
k_dataStore.insert(k_targetRowIndex, k_rowRecord);
}
else {
k_dataStore.add(k_rowRecord);
}
},

k_reloadData: function(k_jsonRpcCfg, k_config) {
if (k_jsonRpcCfg && (undefined !== k_jsonRpcCfg[this._k_proxy.startParam] || undefined !== k_jsonRpcCfg[this._k_proxy.limitParam])) {
kerio.lib.k_info('API of _K_DataStore.k_reloadData have changed!');
}
var k_options = this._k_prepareOptionsForLoad(k_jsonRpcCfg || {});
if (this._k_isBuffered) {
this.k_extWidget.load(k_options, k_config);
}
else {
this.k_extWidget.load(k_options);
}
},

_k_prepareOptionsForLoad: function (k_jsonRpcCfg) {
var
k_options = {},
k_proxy = this.k_extWidget.proxy,
k_query,
k_orderBy,
k_i, k_cnt;
k_options.params = k_jsonRpcCfg;
if (k_jsonRpcCfg.params) {
k_query = k_proxy.k_isQueryValueSent ? k_jsonRpcCfg.params.query : k_jsonRpcCfg.params;
}
if (k_query) {
if (k_proxy.startParam && undefined !== k_query[k_proxy.startParam]) {
k_options.start = k_query[k_proxy.startParam];
}
if (k_proxy.limitParam && undefined !== k_query[k_proxy.limitParam]) {
k_options.limit = k_query[k_proxy.limitParam];
}
if (k_proxy.sortParam && undefined !== k_query[k_proxy.sortParam]) {
k_orderBy = k_query[k_proxy.sortParam];
k_options.sorters = [];
for (k_i = 0, k_cnt = k_orderBy.length; k_i < k_cnt; k_i++) {
k_options.sorters[k_i] = {
property: k_orderBy[k_i][k_proxy.k_sortColumnParam],
direction: k_orderBy[k_i][k_proxy.directionParam]
};
}
}
}
return k_options;
},

k_updateRow: function(k_rowData, k_record, k_origRowIndex, k_targetRowIndex) {
var
k_extWidget = this.k_extWidget,
k_value,
k_field;
k_record.beginEdit();
for (k_field in k_rowData) {
k_value = k_rowData[k_field];
if (undefined !== k_value) {
k_record.set(k_field, k_value);
}
}
k_record.endEdit();
if (undefined !== k_targetRowIndex && k_targetRowIndex !== k_extWidget.indexOf(k_record)) {
k_extWidget.suspendEvents(true);
k_extWidget.remove(k_record);
k_extWidget.insert(k_targetRowIndex, k_record);
k_extWidget.resumeEvents();
}
},

k_appendRow: function(k_rowData) {
var k_targetRowIndex = this.k_extWidget.data.items.length;
this.k_addRow(k_rowData, k_targetRowIndex);
},

k_removeRow: function (k_record) {
this.k_extWidget.remove(k_record);
},

_k_remapData: function(k_data, k_mapVector) {
var k_remappedData = {},
k_currentData,
k_i,
k_cnt = k_mapVector.length,
k_currMap,
k_mapping;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_currMap = k_mapVector[k_i];
k_mapping = k_currMap.mapping;
if (undefined === k_mapping) {
k_mapping = k_i;
}
k_currentData = k_data[k_mapping];
if (k_currentData instanceof Object) {
k_remappedData[k_currMap.name] = kerio.lib.k_cloneObject(k_currentData);
}
else {
k_remappedData[k_currMap.name] = k_currentData;
}
}
return k_remappedData;
}, 
k_getLastRequestParams: function () {
kerio.lib.k_warn('_K_DataStore.k_getLastRequestParams() is deprecated! Use _K_DataStore.k_getLastJsonRpcCfg instead.');
return (this.k_getLastJsonRpcCfg() || {}).params || null;
},

k_getLastJsonRpcCfg: function () {
return Ext4.clone(this.k_extWidget.proxy._k_lastJsonRpcCfg) || null;
},

k_setLastJsonRpcCfg: function (k_jsonRpcCfg) {
this.k_extWidget.proxy._k_lastJsonRpcCfg = Ext4.clone(k_jsonRpcCfg);
},

k_setLastRequestParams: function (k_params) {
kerio.lib.k_warn('Is it really necessary to set last params manually? Use K_DataStore.k_setLastJsonRpcCfg instead!');
this.k_setLastJsonRpcCfg(Ext4.apply(this.k_getLastJsonRpcCfg(), {params: k_params}));
},

k_abortCurrentRequest: function() {
var k_requestId = this._k_proxy._k_activeRequest;
if (k_requestId) {
kerio.lib.k_ajax.k_abort(k_requestId);
}
},

k_abortDelayedRequest: function() {
var k_delayedRequest = this.k_extWidget._kx.k_delayedRequest;
k_delayedRequest.cancel();
},

k_loadData: function (k_data, k_options, k_append) {
this._k_loadData(k_data, k_append);
},

_k_loadData: function (k_data, k_append) {
this.k_extWidget.loadData(k_data, k_append);
},

_k_onAdd: function (k_extDataStore, k_records, k_index) {
var
k_addedRecords = this._k_addedRecords,
k_record,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_records.length; k_i < k_cnt; k_i++) {
k_record = k_records[k_i];
k_addedRecords.add(k_record.id, k_record);
}
},

_k_onRemove: function (k_extDataStore, k_record, k_index) {
var
k_addedRecords = this._k_addedRecords,
k_removedRecords = this._k_removedRecords,
k_modifiedRecords = this._k_modifiedRecords;
if (k_addedRecords.containsKey(k_record.id)) {
k_addedRecords.remove(k_record);
}
else {
if (k_modifiedRecords.containsKey(k_record.id)) {
k_modifiedRecords.remove(k_record);
}
k_removedRecords.add(k_record.id, k_record);
}
},

_k_onUpdate: function (k_extDataStore, k_record, k_operation) {
var
k_addedRecords = this._k_addedRecords,
k_modifiedRecords = this._k_modifiedRecords;
if (Ext4.data.Record.EDIT !== k_operation) {
return;
}
if (k_addedRecords.containsKey(k_record.id)) {
k_addedRecords.remove(k_record);
k_addedRecords.add(k_record.id, k_record);
}
else {
if (k_modifiedRecords.containsKey(k_record.id)) {
k_modifiedRecords.remove(k_record);
}
k_modifiedRecords.add(k_record.id, k_record);
}
},

_k_onClear: function (k_extDataStore) {
var
k_item,
k_i,
k_cnt;
this._k_addedRecords.clear();
this._k_modifiedRecords.clear();
for (k_i = 0, k_cnt = this.k_extWidget.data.getCount(); k_i < k_cnt; k_i++) {
k_item = this.k_extWidget.data.get(k_i);
this._k_removedRecords.add(k_item.id, k_item);
}
},

_k_getChangedRecordData: function (k_record) {
var
k_data = {},
k_recordData = k_record.data,
k_modifiedFields = k_record.modified,
k_isModified = false,
k_field;
for (k_field in k_modifiedFields) {
if (String(k_recordData[k_field]) !== String(k_modifiedFields[k_field])) {
k_data[k_field] = k_recordData[k_field];
k_isModified = true;
}
}
return k_isModified ? k_data : null;
},

_k_getRecordId: function (k_record) {
return k_record.id;
},

k_startTracing: function (k_resetTraceLog) {
var
k_extWidget = this.k_extWidget,
K_MixedCollection;
if (true === this._k_isTracing) {
return;
}
k_extWidget.on({
'add'   : this._k_onAdd,
'remove': this._k_onRemove,
'update': this._k_onUpdate,
scope: this
});
this._k_origExtRemoveAll = k_extWidget.removeAll;
k_extWidget.removeAll = Ext4.Function.createInterceptor(k_extWidget.removeAll, this._k_onClear, this);
if (false !== k_resetTraceLog) {
K_MixedCollection = Ext4.util.MixedCollection;
if (!this._k_addedRecords) {
this._k_addedRecords    = new K_MixedCollection(false, this._k_getRecordId);
this._k_removedRecords  = new K_MixedCollection(false, this._k_getRecordId);
this._k_modifiedRecords = new K_MixedCollection(false, this._k_getRecordId);
this._k_movedRecords    = new K_MixedCollection(false, this._k_getRecordId);
}
else {
this._k_addedRecords.clear();
this._k_removedRecords.clear();
this._k_modifiedRecords.clear();
this._k_movedRecords.clear();
}
}
this._k_isTracing = true;
},

k_stopTracing: function () {
var k_extWidget;
if (!this._k_isTracing) {
return;
}
k_extWidget = this.k_extWidget;
k_extWidget.un('add'   , this._k_onAdd   , this);
k_extWidget.un('remove', this._k_onRemove, this);
k_extWidget.un('update', this._k_onUpdate, this);
k_extWidget.removeAll = this._k_origExtRemoveAll;
this._k_origExtRemoveAll = null;
this._k_isTracing = false;
},

k_isChanged: function () {
if (!this._k_addedRecords) {
if (kerio.lib._k_debugMode) {
kerio.lib.k_warn('K_DataStore.k_isChanged: Tracing of changes has not been enabled!');
}
return false;
}
return (0 < this._k_addedRecords.getCount())    ||
(0 < this._k_modifiedRecords.getCount()) ||
(0 < this._k_removedRecords.getCount())  ||
(0 < this._k_movedRecords.getCount());
},

_k_getRecordsData: function (k_recordCollection, k_updatedFieldsOnly) {
var
k_primaryKey = this._k_primaryKey,
k_data = [],
k_recordData,
k_record,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_recordCollection.getCount(); k_i < k_cnt; k_i++) {
k_record = k_recordCollection.getAt(k_i);
if (true === k_updatedFieldsOnly) {
k_recordData = this._k_getChangedRecordData(k_record);
if (k_primaryKey) {
k_recordData[k_primaryKey] = k_record.data[k_primaryKey];
}
}
else {
k_recordData = k_record.data;
}
k_data.push(k_recordData);
}
return k_data;
},

_k_getRecordsPrimaryKeys: function (k_recordCollection) {
var
k_primaryKey = this._k_primaryKey,
k_data = [],
k_item,
k_i, k_cnt;
if (k_primaryKey) {
for (k_i = 0, k_cnt = k_recordCollection.getCount(); k_i < k_cnt; k_i++) {
k_item = {};
k_item[k_primaryKey] = k_recordCollection.getAt(k_i).data[k_primaryKey];
k_data.push(k_item);
}
}
return k_data;
},

k_getChangedData: function (k_updatedFieldsOnly) {
var k_data;
k_data = {
k_added:    this._k_getRecordsData(this._k_addedRecords),
k_removed:  this._k_getRecordsData(this._k_removedRecords),
k_modified: this._k_getRecordsData(this._k_modifiedRecords, k_updatedFieldsOnly),
k_moved:    this._k_getRecordsPrimaryKeys(this._k_movedRecords)
};
return k_data;
},

k_getChangedDataForSet: function () {
var
k_records = this.k_extWidget.data,
k_recordsCount = k_records.getCount(),
k_data = [],
k_primaryKey = this._k_primaryKey,
k_isOrderChangedColumnName = this._k_isOrderChangedColumnName,
k_addedRecords = this._k_addedRecords,
k_movedRecords = this._k_movedRecords,
k_recordData,
k_record,
k_i;
for (k_i = 0; k_i < k_recordsCount; k_i++) {
k_record = k_records.getAt(k_i);
if (!k_addedRecords.contains(k_record)) {
k_recordData = this._k_getChangedRecordData(k_record);
if (null === k_recordData) { k_recordData = {};
}
k_recordData[k_primaryKey] = k_record.data[k_primaryKey];
if (k_movedRecords.contains(k_record)) {
k_recordData[k_isOrderChangedColumnName] = true;
}
}
else {
k_recordData = k_record.data;
}
k_data.push(k_recordData);
}
return k_data;
},

k_moveRecords: function (k_records, k_step, k_compact) {
var
k_extWidget = this.k_extWidget,
k_recordsCount = k_records.length,
k_movedRecords = this._k_movedRecords,
k_targetRowIndexes = [],
k_originRowIndexes = [],
k_up = 0 > k_step,
k_isTracing = this._k_isTracing,
k_originRowIndex,
k_targetRowIndex,
k_recordIndex,
k_record,
k_i;
if (k_compact && k_recordsCount > 0) {
k_step = this._k_compactSelection(k_records, k_step);
}
for (k_i = 0; k_i < k_recordsCount; k_i++) {
k_record = k_records[k_i];
k_originRowIndexes.push(k_extWidget.indexOf(k_record));
}
k_originRowIndexes.sort(kerio.lib._k_sortNumbers);
if (false === k_up) {
k_originRowIndexes.reverse();
}
k_recordIndex = k_originRowIndexes[0];
if ((true === k_up) && (0 === k_recordIndex) ||
(true !== k_up) && ((this.k_getRowsCount() - 1) === k_recordIndex)) {
return [];
}
if (k_isTracing) {
k_extWidget.un('add'   , this._k_onAdd   , this);
k_extWidget.un('remove', this._k_onRemove, this);
}
this._k_moveRecordsInAction = true;
for (k_i = 0; k_i < k_recordsCount; k_i++) {
k_originRowIndex = k_originRowIndexes[k_i];
k_record = k_extWidget.getAt(k_originRowIndex);
k_targetRowIndex = k_originRowIndex + k_step;
k_extWidget.remove(k_record);
k_extWidget.insert(k_targetRowIndex, k_record);
if (k_isTracing) {
k_movedRecords.add(k_record.id, k_record);
}
k_targetRowIndexes.push(k_targetRowIndex);
}
this._k_moveRecordsInAction = false;
if (k_isTracing) {
k_extWidget.on({
'add'   : this._k_onAdd,
'remove': this._k_onRemove,
scope: this
});
}
return k_targetRowIndexes;
},

_k_compactSelection: function(k_records, k_step) {
var
k_extWidget = this.k_extWidget,
k_indexedRecords = [],
k_orderedIndexes = [],
k_orderedRecords = [],
k_offset = 1,
k_item,
k_index,
k_refIndex,
k_targetIndex,
k_localStep,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_records.length; k_i < k_cnt; k_i++) {
k_item = k_records[k_i];
k_index = k_extWidget.indexOf(k_item);
k_orderedIndexes.push(k_index);
k_indexedRecords.push({k_record: k_item, k_index: k_index});
}
k_orderedIndexes.sort(kerio.lib._k_sortNumbers);
for (k_i = 0, k_cnt = k_indexedRecords.length; k_i < k_cnt; k_i++) {
k_item = k_indexedRecords[k_i];
k_index = k_orderedIndexes.indexOf(k_item.k_index);
k_orderedRecords[k_index] = k_item;
}
k_indexedRecords = null;
k_orderedIndexes = null;
k_refIndex = k_orderedRecords[0].k_index;
k_targetIndex = k_refIndex + k_step;
for (k_i = 1, k_cnt = k_orderedRecords.length; k_i < k_cnt; k_i++) {
k_item = k_orderedRecords[k_i];
k_localStep = k_refIndex + k_offset - k_item.k_index;
if (0 !== k_localStep) {
this.k_moveRecords([k_item.k_record], k_localStep, false);
}
if (k_step > 1 && k_item.k_index <= k_targetIndex) {
k_step--;
}
k_offset++;
}
return  k_step;
},

_k_setAdditionalSortColumns: function(k_columnId, k_additionalSortColumns) {
this.k_extWidget.proxy._k_setAdditionalSortColumns(k_columnId, k_additionalSortColumns);
},
k_dummy: null
});