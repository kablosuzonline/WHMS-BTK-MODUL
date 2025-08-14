
kerio.waw.ui.serviceGroupEditor = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_methods = k_shared.k_methods,
k_isAuditor = k_methods.k_isAuditor(),
k_isEditMode = ('serviceGroupEditorEdit' === k_objectName || k_isAuditor),
k_dialog, k_dialogCfg,
k_form, k_formCfg,
k_servicesGrid, k_servicesGridCfg,
k_servicesToolbar, k_servicesToolbarCfg,
k_constEventTypes,
k_title;
k_servicesGridCfg = {
k_className: 'noGridHeader serviceList',
k_isStateful: false,
k_emptyMsg: k_isAuditor ? undefined : k_tr('Click Add… to select services', 'serviceList'),
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
k_renderer: k_methods.k_renderers.k_renderServiceName
}
]
}
};
if (!k_isAuditor) {
k_servicesToolbarCfg = {
k_items: [
{
k_id: 'k_btnAdd',
k_caption: k_tr('Add…', 'common'),

k_onClick: function(k_toolbar) {
var
k_SHARED_CONSTANTS = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_parentGrid = k_toolbar.k_relatedWidget,
k_params = {
k_onlyNew: false, k_parentGrid: k_parentGrid,
k_getData: {
method: 'get',
object: 'IpServices',
params: {
query: {
conditions: [
{
fieldName: 'group',
comparator: k_SHARED_CONSTANTS.kerio_web_Eq,
value: '0'
}
],
combining: k_SHARED_CONSTANTS.kerio_web_And,
orderBy: [
{
columnName: 'name',
direction: k_SHARED_CONSTANTS.kerio_web_Asc
}
]
}
}
}
};
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'selectItems',
k_objectName: 'k_servicesWithoutGroups',
k_params: k_params
});
}
},
{
k_id: 'k_btnRemove',
k_isDisabled: true,
k_caption: k_tr('Remove', 'common'),

k_onClick: function(k_toolbar){
var
k_grid = k_toolbar.k_relatedWidget;
if (0 < k_grid.k_selectionStatus.k_selectedRowsCount) {
k_grid.k_removeSelectedRows();
}
}
}
],

k_update: function(k_sender, k_event){
var
k_events = kerio.lib.k_constants.k_EVENT,
k_constEventTypes = k_events.k_TYPES,
k_constKeyCodes = k_events.k_KEY_CODES,
k_currentKeyCode,
k_selectedRowsCount;
if (k_sender instanceof kerio.lib.K_Grid) {
switch (k_event.k_type) {
case k_constEventTypes.k_SELECTION_CHANGED:
k_selectedRowsCount = k_sender.k_selectionStatus.k_selectedRowsCount;
this.k_enableItem('k_btnRemove', (0 !== k_selectedRowsCount));
break; case k_constEventTypes.k_KEY_PRESSED:
k_currentKeyCode = k_event.k_browserEvent.keyCode;
if ((k_constKeyCodes.k_BACKSPACE === k_currentKeyCode) || (k_constKeyCodes.k_DELETE === k_currentKeyCode)) {
this.k_relatedWidget.k_removeSelectedRows();
}
break; }
}
},
k_hasSharedMenu: true
};
k_servicesToolbar = new k_lib.K_Toolbar(k_localNamespace + 'k_rightToolbar', k_servicesToolbarCfg);
k_servicesGridCfg.k_toolbars = {
k_bottom: k_servicesToolbar
};
k_servicesGridCfg.k_contextMenu = k_servicesToolbar.k_sharedMenu;
}
k_servicesGrid = new k_lib.K_Grid(k_localNamespace + 'serviceGrid', k_servicesGridCfg);
if (k_isAuditor) {
k_servicesGrid.k_setDisabled(false);
k_servicesGrid.k_setReadOnly(true); }
else {
k_constEventTypes = kerio.lib.k_constants.k_EVENT.k_TYPES;
kerio.lib.k_registerObserver(k_servicesGrid, k_servicesToolbar, [k_constEventTypes.k_SELECTION_CHANGED, k_constEventTypes.k_KEY_PRESSED]);
}
k_formCfg = {
k_items: [
{
k_type: 'k_container',
k_height: 35,
k_items: [
{
k_id: 'name',
k_caption: k_tr('Name:', 'common'),
k_labelWidth: 70,
k_maxLength: 63,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isName'
}
}
]
},
{
k_type: 'k_container',
k_content: k_servicesGrid
}
]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_formGeneral', k_formCfg);
if (k_isAuditor) {
k_form.k_setReadOnlyAll(true);
}
if (k_isEditMode) {
k_title = (k_isAuditor) ? k_tr('View Service Group', 'serviceEditor') : k_tr('Edit Service Group', 'serviceEditor');
}
else {
k_title = k_tr('Add Service Group', 'serviceEditor');
}
k_dialogCfg = {
k_width: 410,
k_height: 350,
k_isAuditor: k_isAuditor,
k_title: k_title,
k_content: k_form,
k_defaultItem: 'name',

k_onOkClick: function() {
this.k_dialog.k_sendData();
}
};
k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_form.k_addReferences({
k_dialog: k_dialog
});
k_dialog.k_addReferences({
k_form: k_form,
k_servicesGrid: k_servicesGrid,
k_objectName: k_objectName,
k_relatedGrid: {},
k_isAuditor: k_isAuditor,
k_isEditMode: k_isEditMode
});
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_sendDataRequest: {
k_callback: k_dialog.k_sendDataCallback,
k_scope: k_dialog
}
});
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_applyParams: function(k_params) {
var
k_form = this.k_form,
k_data = k_params.k_data || {},
k_relatedGrid = k_params.k_relatedWidget;
this.k_data = k_data;
this.k_relatedGrid = k_relatedGrid;
if (!this.k_isEditMode) {
return;
}
k_form.k_setData(k_data);
if (0 !== k_data.members.length) {
this.k_servicesGrid.k_setData(k_data.members);
}
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); },

k_sendData: function() {
var
k_form = this.k_form,
k_membersData,
k_data;
k_data = k_form.k_getData(true);
k_data.group = true;
k_membersData =  this.k_servicesGrid.k_getData();
k_data.members = k_membersData;
if (this.k_isEditMode) {
kerio.waw.shared.k_methods.k_mergeObjects(k_data, this.k_data);
k_data = {
serviceIds: [this.k_data.id],
details: this.k_data
};
this.k_sendDataRequest.k_jsonRpc = {
method: 'IpServices.set',
params: k_data
};
}
else {
k_data = kerio.waw.shared.k_DEFINITIONS.k_get('k_predefinedIpService', k_data);
k_data = {
services: [k_data]
};
this.k_sendDataRequest.k_jsonRpc = {
method: 'IpServices.create',
params: k_data
};
}
kerio.lib.k_ajax.k_request(this.k_sendDataRequest);
},

k_sendDataCallback: function(k_response) {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
if (k_response.k_decoded.errors.length !== 0) {
return;
}
kerio.waw.shared.k_methods.k_maskMainScreen(this.k_relatedGrid);
this.k_relatedGrid.k_onItemChange();
this.k_hide();
},

k_resetOnClose: function() {
this.k_form.k_reset();
this.k_servicesGrid.k_resetGrid();
}
});
} }; 