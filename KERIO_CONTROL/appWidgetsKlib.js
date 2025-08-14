
kerio.waw.shared.k_widgets = kerio.waw.shared.k_widgets || {};

kerio.lib.k_loadJs('wizard2.js', true);

kerio.waw.shared.k_widgets.K_ButtonBar = function(k_id, k_config) {
kerio.waw.shared.k_widgets.K_ButtonBar.superclass.constructor.call(this, k_id, k_config);
this.k_addReferences({
_k_initValue: k_config.k_value,
_k_valueId: '',
_k_items: [],
_k_useEqualButtonWidth: (false !== k_config.k_useEqualButtonWidth)
});
if (k_config.k_onChange && 'function' === typeof k_config.k_onChange) {
this.k_onChange = k_config.k_onChange;
}
this.k_extWidget.on('render', this._k_initArrowsBehaviour, this);
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_ButtonBar',  kerio.lib._K_FormItem,

{

_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib._K_FormItem, {
k_id: 'k_id',
k_value: 'k_value',
k_items: 'k_items',
k_name: 'k_name',
k_caption: 'k_caption',
k_onClick: 'k_onClick'
}),
_k_initExtComponent: function(k_cfg, k_storedConfig) {
var
k_id = k_cfg.k_id,
k_localNamespace = k_id + '_',
k_cnt, k_i,
k_items,
k_extWidget,
k_extCfg;
k_extCfg = {
id: k_id,
border: false,
defaults: {
xtype: 'button',
allowDepress: false,
enableToggle: true
},
layout: 'hbox',
layoutConfig: {
pack: 'start',
align: 'left'
},
items: []
};
if (k_cfg.k_items) {
k_items = k_cfg.k_items;
k_cnt = k_items.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_extCfg.items.push(
{
id: k_localNamespace + k_items[k_i].k_id,
text: k_items[k_i].k_caption,
cls: 'innerButton',
minWidth: 50,
listeners:{
'click': {
fn: this._k_onChange,
scope: this
}
}
}
);
}
if (k_cnt > 1) {
k_extCfg.items[0].cls = 'leftButton';
k_extCfg.items[k_cnt - 1].cls = 'rightButton';
}
}
k_extWidget = new Ext.Container(k_extCfg);
k_extWidget.items.itemAt(k_extWidget.items.getCount() - 1).on('afterrender', function () {
this._k_initWidget();
}, this, {single: true});
kerio.lib._k_addKerioProperty(k_extWidget, {_k_localNamespace: k_localNamespace});
k_extWidget.focus = this._k_focus;
return k_extWidget;
},
_k_initWidget: function() {
var
k_i,
_k_items = this._k_items,
k_extWidget = this.k_extWidget,
k_items = k_extWidget.items.items,
k_isReadOnly = this.k_isReadOnlyByContainer(),
k_cnt = k_items.length,
k_max = -1,
k_sum = 0,
k_width,
k_item;
this._k_valueId = this._k_getLocalNamespaceId(this._k_initValue);
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_items[k_i];
_k_items.push(k_item);         _k_items[k_item.id] = k_item;  k_width = k_item.getWidth();
k_max = Math.max(k_max, k_width);
k_sum += k_width;
if (k_item.id === this._k_valueId) {
k_item.toggle(true, true);
}
else {
k_item.setDisabled(k_isReadOnly);
}
}
if (this._k_useEqualButtonWidth) {
for (k_i = 0; k_i < k_cnt; k_i++) {
k_items[k_i].setWidth(k_max);
}
k_extWidget.setWidth(k_max * k_cnt);
}
else {
k_extWidget.setWidth(k_sum);
}
this._k_originalValue = this._k_initValue;
delete this._k_initValue;
k_extWidget.ownerCt.ownerCt.setWidth(k_max * k_cnt + 5);
k_extWidget.ownerCt.ownerCt.doLayout();
},

_k_focus: function () {
var
k_valueId = this._kx.k_owner._k_valueId;
this.items.get(k_valueId).focus();
this.fireEvent('focus', this);
},

_k_onChange: function(k_button) {
this._k_setActiveButton(k_button.id);
},

k_onChange: function(k_form, k_buttonBar, k_value) {},
_k_setActiveButton: function(k_buttonId, k_force) {
var
k_setForce = k_force || false,
k_isReadOnly = this.k_isReadOnlyByContainer(),
k_items = this._k_items,
k_cnt = k_items.length,
k_i, k_item;
if (!k_items[k_buttonId] || k_buttonId === this._k_valueId) {
return;
}
if (k_isReadOnly && false === k_setForce) {
return;
}
this._k_valueId = k_buttonId;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_items[k_i];
k_item.setDisabled(false);
if (k_buttonId === k_item.id) {
k_item.toggle(true, true);
}
else {
k_item.toggle(false, true);
k_item.setDisabled(k_isReadOnly);
}
}
this.k_onChange(this.k_form, this, this.k_getValue());
},
k_setValue: function(k_value, k_isInitial) {
var
buttonId = this._k_getLocalNamespaceId(k_value),
k_isRendered = this.k_extWidget.el !== undefined;
if(k_isRendered) {
this._k_setActiveButton(buttonId, k_isInitial);
if (k_isInitial) {
this._k_originalValue = this.k_getValue();
}
}
else {
if (k_isInitial) {
this._k_initValue = k_value;
}
}
},

_k_getLocalNamespaceId: function(k_id) {
return this._k_getLocalNamespace() + k_id;
},

_k_getLocalNamespace: function() {
return this.k_extWidget._kx._k_localNamespace;
},

_k_initArrowsBehaviour: function () {
this._k_keyNav = new Ext.KeyNav(this.k_extWidget.getEl(), {
left: function (k_e) {
this._k_focusNextItem(k_e.target, true);
},
right: function (k_e) {
this._k_focusNextItem(k_e.target);
},
up: function (k_e) {
this._k_focusNextItem(k_e.target, true);
},
down: function (k_e) {
this._k_focusNextItem(k_e.target);
},
enter : function(k_e){
var
k_item = this._k_getItem(k_e.target),
k_itemIndex;
if (false === k_item.pressed) {
this._k_setActiveButton(k_item.id, false);
this.k_focus();
}
k_e.stopEvent();
},
scope: this,
defaultEventAction: 'doNothingWithEvent'
});
},

_k_focusNextItem: function(k_button, k_reverse) {
if ('button' !== k_button.tagName.toLowerCase()) {
return;
}
var
k_reverseDirection = true === k_reverse,
k_extWidget = this.k_extWidget,
k_extItems = k_extWidget.items,
k_parent = this._k_getItem(k_button),
k_focusedItemIndex,
k_nextItemIndex;
k_focusedItemIndex = k_extItems.indexOf(k_parent);
if (k_reverseDirection) {
k_nextItemIndex = 0 === k_focusedItemIndex ? k_extItems.length - 1 : k_focusedItemIndex - 1;
}
else {
k_nextItemIndex = k_focusedItemIndex + 1 === k_extItems.length ? 0 : k_focusedItemIndex + 1;
}
this._k_items[k_nextItemIndex].focus();
},

_k_getItem: function(k_button) {
if ('button' !== k_button.tagName.toLowerCase()) {
return;
}
var
k_extItems= this.k_extWidget,
k_parent = k_button.parentNode;
while (k_parent && 'table' !== k_parent.tagName.toLowerCase()) {
k_parent = k_parent.parentNode;
}
return k_extItems.get(k_parent.id);
},

_k_onArrowUpDown: function (k_event) {
if (!Ext.isMac && this._k_isEventTargetInputField(k_event)) {
k_event.stopEvent();
}
},

k_getValue: function() {
return this._k_valueId ? this._k_valueId.substring(this._k_getLocalNamespace().length) : undefined;
},

k_setDisabled: function(k_disable) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var
k_items = this._k_items,
k_cnt = k_items.length,
k_i,
k_origState,
k_newState,
k_method;
k_disable = (false !== k_disable);
k_origState = this.k_isDisabled();
k_newState = (k_disable || this._k_isDisabledByContainer);
this._k_isDisabled = k_disable;
if (k_origState !== k_newState) {
this._k_setDisabledItem(k_newState);
}
k_method = (k_disable ? 'disable' : 'enable');
for (k_i = 0; k_i < k_cnt; k_i++) {
k_items[k_i][k_method]();
}
}}
);

kerio.waw.shared.k_widgets.K_SelectTypeAheadLocal = function(k_id, k_config) {
k_config.k_isTriggerHidden = (true !== k_config.k_hasTrigger) && (true !== k_config.k_isEditable); k_config.k_isEditable = true;
k_config.k_useColumnsNames = true;
k_config.k_className = 'typeAheadSelect';
k_config.k_value = (undefined === k_config.k_value ? '' : k_config.k_value); if ('function' === typeof k_config.k_rowFilter) {
this.k_rowFilter = k_config.k_rowFilter;
}
else if (false === k_config.k_rowFilter) {
this.k_rowFilter = this._k_disabledRowFilter;
}
kerio.waw.shared.k_widgets.K_SelectTypeAheadLocal.superclass.constructor.call(this, k_id, k_config);
};

kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_SelectTypeAheadLocal', kerio.lib.K_SelectTypeAhead,

{

_k_doAfterRender: function() {
kerio.lib.K_Select.prototype._k_doAfterRender.call(this);
this.k_extWidget.el.on('keyup', this._k_startLocalSearch, this);
},

k_setValue: function(k_value) {
kerio.lib.K_Select.prototype.k_setValue.apply(this, arguments);
this._k_startLocalSearch();
},

_k_startLocalSearch: function(k_event) {
if (k_event && k_event.isSpecialKey() && k_event.BACKSPACE !== k_event.keyCode && k_event.DELETE !== k_event.keyCode ) {
return;
}
if (this.k_isDisabled() || this.k_isReadOnly()) { this.k_extWidget.collapse();
return;
}
var
k_value = this.k_extWidget.getRawValue(),
k_data = this._k_dataStore.k_extWidget;
k_data.filter([{
fn: this._k_rowFilterFactory(k_value),
scope: this
}]);
if (0 < k_data.getCount() && this.k_extWidget.hasFocus) { this._k_expand.defer(10, this); this.k_extWidget.restrictHeight();
this.k_extWidget.select(-1); }
else {
this.k_extWidget.collapse();
}
},

_k_expand: function() {
var
k_extWidget = this.k_extWidget,
k_mainWidget = this.k_getMainWidget(),
k_isInDialog = (null !== k_mainWidget);  if (k_extWidget
&& !this.k_isDisabled() && !this.k_isReadOnly()      && !k_extWidget.isExpanded()                         && (!k_isInDialog                                    || k_mainWidget.k_extWidget.isVisible())         && k_extWidget.hasFocus) {                           k_extWidget.expand();
}
},

_k_rowFilterFactory: function(k_closureValue) {
return function(k_record) {
return this.k_rowFilter(k_closureValue, k_record.data);
};
},

k_rowFilter: function(k_value, k_item) {
return (-1 < k_item[this._k_fieldValue].indexOf(k_value));
},

_k_disabledRowFilter: function() {
return true; }
});    
kerio.lib.K_DataStoreSharedLocal = function(k_config) {
this._k_references = [];
this.k_addReferences({
k_sortingParams: k_config.k_sorting
});
if (k_config.k_remoteData) {
kerio.lib.K_DataStoreSharedLocal.superclass.constructor.call(this, this , k_config);
}
else if (k_config.k_localData) {
kerio.lib._K_DataStore.call(this, this , k_config);
}
else {
kerio.lib.k_reportError('No data for dataStore', 'DataStoreSharedLocal');
}
};
kerio.lib.k_extend('kerio.lib.K_DataStoreSharedLocal', kerio.lib._K_DataStore, {
});
kerio.waw.shared.k_widgets.K_CertificateDefinitionSelect = function(k_id, k_config) {
var
k_selectId,
k_selectCfg,
k_button,
k_dialogObjectName,
k_dialogWidgetType;
k_selectCfg = kerio.lib.k_cloneObject(k_config, {
k_width: 150,
k_fieldValue: 'id',
k_fieldDisplay: 'name',
k_isLabelHidden: !k_config.k_caption,
k_localData: [],
k_definitionType: 'k_certificates',
k_showApplyReset: true,
k_validateCutOff: true,
k_pageSize: 250 }, {
k_replaceExisting: false
});
k_selectCfg.k_type = 'k_select';
k_selectId = k_selectCfg.k_id;
k_dialogObjectName = 'certificateDialog';
k_dialogWidgetType = 'k_certificatesType';
delete k_selectCfg.k_isDisabled;
delete k_selectCfg.k_isHidden;
delete k_selectCfg.k_indent;
k_config.k_items = [
k_selectCfg,
{
k_type: 'k_formButton',
k_id: k_selectId + '_' + 'k_button',
k_caption: kerio.lib.k_tr('Edit…', 'wlibButtons'),

k_onClick: function(k_form, k_item) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'certificateDialog',
k_objectName:  k_item._k_dialogObjectName,
k_initParams: {
k_showApplyReset: k_item._k_showApplyReset,
k_widgetType: k_item._k_dialogWidgetType,
k_validateCutOff: k_item._k_validateCutOff,
k_onApplyResetHandler: k_item._k_onApplyResetHandler,
k_pageSize: k_item._k_pageSize
},
k_params: {
k_relatedWidget: k_item._k_definitionWidget,
k_relatedSelectCfg: k_item.k_selectCfg
}
});
}
}
];
delete k_config.k_width;
delete k_config.k_showApplyReset;
k_config.k_id = k_selectId + '_' + 'k_container';
this._k_localData = k_selectCfg.k_localData;
kerio.adm.k_widgets.K_DefinitionSelect.superclass.constructor.call(this, k_id + '_' + 'k_container', k_config);
this._k_select = this._k_ownerForm.k_getItem(k_selectId);
k_button = this._k_ownerForm.k_getItem(k_selectId + '_' + 'k_button');

k_button.k_extWidget.on('render', this._k_fixDefinitionSelectWidth, this.k_extWidget);
k_button.k_addReferences({
_k_dialogObjectName: k_dialogObjectName,
_k_dialogWidgetType: k_dialogWidgetType,
_k_showApplyReset: k_selectCfg.k_showApplyReset,
_k_onApplyResetHandler: k_selectCfg.k_onApplyResetHandler,
_k_validateCutOff: k_selectCfg.k_validateCutOff,
_k_pageSize: k_selectCfg.k_pageSize,
_k_definitionWidget: this,
k_selectCfg: k_selectCfg
});
};
kerio.lib.k_extend('kerio.waw.shared.k_widgets.K_CertificateDefinitionSelect', kerio.lib.K_DefinitionSelect, {});


kerio.lib.k_registerType({
k_type: 'k_buttonBar',
k_constructorName: 'K_ButtonBar',
k_constructor: kerio.waw.shared.k_widgets.K_ButtonBar
});
kerio.lib.k_registerType({
k_type: 'k_selectTypeAhead',
k_constructorName: 'K_SelectTypeAheadLocal',
k_constructor: kerio.waw.shared.k_widgets.K_SelectTypeAheadLocal
});
kerio.lib.k_registerType({
k_type: 'k_certificateDefinitionSelect',
k_constructorName: 'K_CertificateDefinitionSelect',
k_constructor: kerio.waw.shared.k_widgets.K_CertificateDefinitionSelect
});
