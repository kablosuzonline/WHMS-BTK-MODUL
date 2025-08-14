
kerio.waw.ui.systemHealthStorage = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
StorageDataType = k_CONSTANTS.StorageDataType,
k_methods = kerio.waw.shared.k_methods,
k_tr = kerio.lib.k_tr,
k_isAuditor = k_methods.k_isAuditor(),
k_isLinux = k_methods.k_isLinux(),
k_boldPlaceholders = {k_args: ['<b>', '</b>'], k_isSecure: true},
k_linkPlaceholders = {k_args: ['<a id="k_delete">', '</a>'], k_isSecure: true},
k_storageDef = [],
k_items = [],
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_dialogButtons,
k_storageTypes,
k_definition,
k_onLinkClick,
k_confirmClearStorage,
k_progressBarContainer,
k_templateElement,
k_template,
k_id,
k_item,
k_i,
k_cnt;
k_storageTypes = [
StorageDataType.StorageDataStar,
StorageDataType.StorageDataLogs,
StorageDataType.StorageDataCrash,
StorageDataType.StorageDataPktdump,
StorageDataType.StorageDataUpdate,
StorageDataType.StorageDataHttpCache
];
if (!k_isLinux) {
k_storageTypes.push(StorageDataType.StorageDataQuarantine);
}

k_onLinkClick = function(k_form, k_item, k_linkId) {
var
k_tr = kerio.lib.k_tr;
switch(k_linkId) {
case 'k_delete':
kerio.lib.k_confirm(
k_tr('Confirm Action', 'common'),
k_form.k_storageDef[k_form.k_elementReferences[k_item.k_name]].k_confirm,
k_form.k_confirmClearStorage,
this);
break;
case 'k_starRedirect':
kerio.lib.k_confirm(
k_tr('Confirm Action', 'common'),
k_tr('Do you want to close the current dialog and open the statistics settings?', 'systemHealthStorage'),

function(k_response) {
if ('no' === k_response) {
return;
}
this.k_parentWidget.k_hide();
kerio.waw.status.k_currentScreen.k_gotoNode('accountingAndMonitoring', 'k_starForm');
},
k_form);
break;
case 'k_httpCacheRedirect':
kerio.lib.k_confirm(
k_tr('Confirm Action', 'common'),
k_tr('Do you want to close the current dialog and open the settings of HTTP cache?', 'systemHealthStorage'),

function(k_response) {
if ('no' === k_response) {
return;
}
this.k_parentWidget.k_hide();
kerio.waw.status.k_currentScreen.k_gotoNode('proxyServer', 'k_cache');
},
k_form);
break;
}
};

k_confirmClearStorage = function (k_response) {
if ('no' === k_response) {
return;
}
this.k_form.k_parentWidget.k_storageCleared = true;
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Storage.remove',
params: {
type: this.k_form.k_elementReferences[this.k_name]
}
},

k_onError: function() {
kerio.lib.k_alert(
{
k_title: kerio.lib.k_tr('Warning', 'common'),
k_msg: kerio.lib.k_tr('Some files were not deleted, they may be currently in use.', 'systemHealthStorage'),
k_icon: 'info'
}
);
return true;
},
k_callback: function(k_response, k_success) {
if (!k_success) {
return;
}
this.k_form.k_parentWidget.k_resetTemplates();
this.k_form.k_parentWidget.k_loadData();
this.k_form.k_deletingElement.k_setVisible(true);
},k_scope: this
});
};k_storageDef = [
{
k_id: StorageDataType.StorageDataStar,
k_caption: '<b>Kerio Control Statistics</b>',
k_template: k_tr('Statistics gathered by the product about users, Internet connection usage and so on.', 'systemHealthStorage')
+ (k_isAuditor ? '' : (' ' + k_tr('You can %1change retention policy%4 or %2delete all data%3 at once.', 'systemHealthStorage', {k_args: ['<a id="k_starRedirect">', '<a id="k_delete">', '</a>', '</a>'], k_isSecure: true}))),
k_confirm: k_tr('Delete all statistics data?', 'systemHealthStorage')
},
{
k_id: StorageDataType.StorageDataLogs,
k_caption: k_tr('%1Logs%2', 'systemHealthStorage', k_boldPlaceholders),
k_template: k_tr('Logs gathered by the product.', 'systemHealthStorage')
+ (k_isAuditor ? '' : (' ' + k_tr('You can limit individual log size, delete individual log content or %1delete all logs at once%2.', 'systemHealthStorage', k_linkPlaceholders))),
k_confirm: k_tr('Clear all logs?', 'systemHealthStorage')
},
{
k_id: StorageDataType.StorageDataCrash,
k_caption: k_tr('%1Crash reports%2', 'systemHealthStorage', k_boldPlaceholders),
k_template: k_tr('Information gathered when software failure occurs can be sent to Kerio Technologies for debugging purposes.', 'systemHealthStorage')
+ (k_isAuditor ? '' : (' ' + k_tr('You can %1delete%2 the reports now.', 'systemHealthStorage', k_linkPlaceholders))),
k_confirm: k_tr('Delete crash reports?', 'systemHealthStorage')
},
{
k_id: StorageDataType.StorageDataPktdump,
k_caption: k_tr('%1Packet dump%2', 'systemHealthStorage', k_boldPlaceholders),
k_template: k_tr('Network traffic captured by the firewall and used for debugging purposes.', 'systemHealthStorage')
+ (k_isAuditor ? '' : (' ' + k_tr('You can %1delete the file%2 now.', 'systemHealthStorage', k_linkPlaceholders))),
k_confirm: k_tr('Delete the packet dump file?', 'systemHealthStorage')
},
{
k_id: StorageDataType.StorageDataUpdate,
k_caption: k_tr('%1System updates%2', 'systemHealthStorage', k_boldPlaceholders),
k_template: k_tr('Kerio Control update files.', 'systemHealthStorage')
+ (k_isAuditor ? '' : (' ' + k_tr('You can %1delete all files%2 now.', 'systemHealthStorage', k_linkPlaceholders))),
k_confirm: k_tr('Delete the downloaded updates?', 'systemHealthStorage')
},
{
k_id: StorageDataType.StorageDataHttpCache,
k_caption: k_tr('%1HTTP cache%2', 'systemHealthStorage', k_boldPlaceholders),
k_template: k_tr('Cached web pages.', 'systemHealthStorage') + ' '
+ k_tr('Please note that the cache file system consumes disk space even if the cache is empty. This space could be released by turning the cache off.', 'systemHealthStorage')
+ (k_isAuditor ? '' : (' ' + k_tr('You can %1change HTTP cache configuration%4 or %2delete all cached files%3.', 'systemHealthStorage', {k_args: ['<a id="k_httpCacheRedirect">', '<a id="k_delete">', '</a>', '</a>'], k_isSecure: true}))),
k_confirm: k_tr('Clear the HTTP cache?', 'systemHealthStorage')
}
];if (!k_isLinux) {
k_storageDef.push({
k_id: StorageDataType.StorageDataQuarantine,
k_caption: k_tr('%1Quarantine%2', 'systemHealthStorage', k_boldPlaceholders),
k_template: k_tr('Files marked as infected by antivirus.', 'systemHealthStorage')
+ (k_isAuditor ? '' : (' ' + k_tr('You can %1delete all quarantine content%2 now.', 'systemHealthStorage', k_linkPlaceholders))),
k_confirm: k_tr('Clear quarantine?', 'systemHealthStorage')
});
}
k_template = {
k_type: 'k_columns',
k_minHeight: 52,
k_items: [
{
k_type: 'k_container',
k_width: 150,
k_items: [
{
k_type: 'k_progressBar'
},
{
k_type: 'k_display',
k_className: 'centered',
k_isLabelHidden: true
}
]
},
{
k_type: 'k_container',
k_width: 455,
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true
}
]
}
]
};
for (k_i = 0, k_cnt = k_storageDef.length; k_i < k_cnt; k_i++) {
k_definition = k_storageDef[k_i];
k_id = k_i;
k_item = kerio.lib.k_cloneObject(k_template);
k_progressBarContainer = k_item.k_items[0];
k_templateElement = k_item.k_items[1].k_items[0];
k_progressBarContainer.k_items[0].k_id = k_id + '_' + 'k_progressBar';
k_progressBarContainer.k_items[1].k_id = k_id + '_' + 'k_displayField';
k_templateElement.k_id = k_id + '_' + 'k_text';
k_templateElement.k_onLinkClick = k_onLinkClick;
k_items.push({
k_type: 'k_container',
k_id: k_id + '_' + 'k_container',
k_isHidden: true,
k_items: [
{
k_type: 'k_display',
k_id: k_id + '_' + 'k_caption',
k_isSecure: true
},
k_item
]
});
k_storageDef[k_definition.k_id] = k_definition;
}
k_items.push(
{
k_type: 'k_display',
k_id: 'k_deleting',
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_isHidden: true,
k_value: k_tr('Please note that it may take up to a few minutes to delete all the files.', 'systemHealthStorage')
}
);
k_items.push(
{
k_type: 'k_display',
k_id: 'k_noData',
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_isHidden: true,
k_value: k_tr('There are no temporary files on the disk.', 'systemHealthStorage')
}
);
k_formCfg = {
k_items: k_items
};
k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_form.k_addReferences({
k_storageDef: k_storageDef,
k_elementReferences: [],
k_confirmClearStorage: k_confirmClearStorage,
k_noDataElement: k_form.k_getItem('k_noData'),
k_deletingElement: k_form.k_getItem('k_deleting')
});
k_dialogButtons = [
{
k_caption: k_tr('Close', 'common'),
k_mask: {},
k_isDefault: true,
k_onClick: function(k_toolbar) {
var
k_dialog = k_toolbar.k_dialog;
k_dialog.k_hide(); if (k_dialog.k_storageCleared) {
k_dialog.k_parentWidget.k_manualRefresh();
}
}
}
];
k_dialogCfg = {
k_height: 555,
k_width: 650,
k_title: k_tr('Storage Space', 'systemHealthStorage'),
k_buttons: k_dialogButtons,
k_content: k_form
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_storageCleared: false,
k_parentWidget: undefined,
k_storageTypes: k_storageTypes,
k_diskTotal: 0
});
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function (k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); this.k_parentWidget = k_params.k_parentWidget;
this.k_storageCleared = false;
this.k_diskTotal = k_params.k_diskTotal;
this.k_resetTemplates();
this.k_loadData();
}; 
k_kerioWidget.k_loadData = function() {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Storage.get'
},
k_callback: this.k_loadDataCallback,
k_scope: this
});
};
k_kerioWidget.k_loadDataCallback = function(k_response, k_success) {
if (!k_success || !k_response.k_isOk) {
return;
}
var
k_formatDataUnits = kerio.waw.shared.k_methods.k_formatDataUnits,
k_storageData = k_response.k_decoded.data,
k_form = this.k_form,
k_elementReferences = [],
k_formData = {},
k_size,
k_type,
k_i,
k_cnt;
k_storageData.sort(
function(k_first, k_second) {
return k_first.size < k_second.size;
}
);
for (k_i = 0, k_cnt = k_storageData.length; k_i < k_cnt; k_i++) {
k_size = k_storageData[k_i].size;
k_type = k_storageData[k_i].type;
k_formData[k_i + '_' + 'k_progressBar'] = k_size;
k_formData[k_i + '_' + 'k_displayField'] = k_formatDataUnits({ k_value: k_size}).k_string;
k_formData[k_i + '_' + 'k_caption'] = k_form.k_storageDef[k_type].k_caption;
k_form.k_getItem(k_i + '_' + 'k_text').k_setSecureValue(k_form.k_storageDef[k_type].k_template);
k_form.k_getItem(k_i + '_' + 'k_container').k_setVisible(true);
k_elementReferences[k_i + '_' + 'k_text'] = k_type;
}
k_form.k_noDataElement.k_setVisible(0 === k_cnt && !k_form.k_deletingElement.k_isVisible());
k_form.k_setData(k_formData);
k_form.k_elementReferences = k_elementReferences;
}; 
k_kerioWidget.k_resetTemplates = function() {
var
k_form = this.k_form,
k_storageTypes = this.k_storageTypes,
k_i, k_cnt,
k_progressBar;
for (k_i = 0, k_cnt = k_storageTypes.length; k_i < k_cnt; k_i++) {
k_progressBar = k_form.k_getItem(k_i + '_' + 'k_progressBar');
k_progressBar.k_setMaxValue(this.k_diskTotal);
k_progressBar.k_setValue(0);
k_form.k_getItem(k_i + '_' + 'k_container').k_setVisible(false);
}
k_form.k_noDataElement.k_setVisible(false);
k_form.k_deletingElement.k_setVisible(false);
};} }; 