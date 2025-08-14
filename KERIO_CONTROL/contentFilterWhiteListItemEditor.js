
kerio.waw.ui.contentFilterWhiteListItemEditor = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_formCfg,
k_dialogCfg,
k_form,
k_isEditor,
k_dialog;
k_isEditor = ('contentFilterWhiteListItemEditorAdd' !== k_objectName);
k_formCfg = {
k_isReadOnly: k_isAuditor,
k_items: [
{	k_caption: k_tr('URL:', 'interfaceRasEditor'),
k_id: 'url',
k_maxLength: k_shared.k_CONSTANTS.k_MAX_LENGTH.k_HOSTNAME,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_hasNoSpaces'
}
},
{	k_caption: k_tr('Description:', 'common'),
k_id: 'description',
k_maxLength: 255,
k_checkByteLength: true,
k_validator: {
k_allowBlank: true,
k_functionName: 'k_isDescription'
}
}
]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_isReadOnly: k_isAuditor,
k_width: 350,
k_minWidth: 350,
k_height: 150,
k_minHeight: 150,
k_isResizable: true,
k_title: k_tr('Whitelist Item', 'httpWebFilter'),
k_content: k_form,
k_defaultItem: 'url',

k_onOkClick: function(k_toolbar) {
k_toolbar.k_dialog.k_sendData();
}
};
k_dialogCfg = k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences(
{	k_relatedGrid: {},
k_form: k_form,
k_dataStore: [],
k_isEditor: k_isEditor,
k_selectedRowIndex: -1
}
);
this.k_addControllers(k_dialog);
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_relatedGrid,
k_selectedRow,
k_dataStore;
k_relatedGrid = k_params.k_relatedWidget;
this.k_relatedGrid = k_relatedGrid;
k_dataStore = k_relatedGrid.k_getData();
this.k_dataStore = k_dataStore;
if (!this.k_isEditor || 0 === k_relatedGrid.k_selectionStatus.k_selectedRowsCount) {
return;
}
k_selectedRow = k_relatedGrid.k_selectionStatus.k_rows[0];
this.k_form.k_setData(k_selectedRow.k_data, true);
this.k_selectedRowIndex = k_selectedRow.k_rowIndex;
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };

k_kerioWidget.k_sendData = function() {
var
k_dataStore = this.k_dataStore,
k_isEditor = this.k_isEditor,
k_selectedRowIndex = this.k_selectedRowIndex,
k_relatedGrid = this.k_relatedGrid,
k_data = this.k_form.k_getData(),
k_isUnique = true,
k_listItem,
k_itemUrlToLower,
k_i, k_cnt;
k_data.url = kerio.waw.shared.k_methods.k_correctUri(
k_data.url.toLocaleLowerCase()
);
for (k_i = 0, k_cnt = k_dataStore.length; k_i < k_cnt; k_i++) {
k_listItem = k_dataStore[k_i];
k_itemUrlToLower = k_listItem.url.toLocaleLowerCase();
if (k_itemUrlToLower === k_data.url) {
if (k_isEditor && k_i === k_selectedRowIndex) {
continue;
}
k_isUnique = false;
break;
}
}
if (!k_isUnique) {
kerio.waw.shared.k_methods.k_alertError(kerio.lib.k_tr('This server name already exists', 'httpWebFilter'));
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
return;
}
if (k_isEditor) {
k_relatedGrid.k_updateRow(k_data);
} else {
k_relatedGrid.k_addRow(k_data);
}
k_relatedGrid.k_resortRows();
this.k_hide();
k_relatedGrid.k_onChangeHandler(k_relatedGrid.k_batchId);
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};
} }; 