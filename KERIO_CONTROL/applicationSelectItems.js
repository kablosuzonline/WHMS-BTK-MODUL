
kerio.waw.ui.applicationSelectItems = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_methods = k_shared.k_methods,
k_isAuditor = k_methods.k_isAuditor(),
k_gridId = k_localNamespace + 'grid',
k_gridCfg,
k_grid,
k_dialogCfg,
k_dialog,
k_searchField, k_searchFieldCfg,
k_checkboxField, k_checkboxFieldCfg,
filter;
k_gridCfg = {
k_isEnterMappedToDoubleClick: false,
k_isStateful: false,
k_isAutoSelectNewRow: false,
k_className: 'selectApplications',
k_toolbars: {},
k_filters: {},
k_statusbar: new kerio.lib.K_Statusbar(k_localNamespace + 'k_statusbar', {
k_isHidden: true,
k_defaultConfig: 'k_legendUnlicensed',
k_configurations: {
k_legendUnlicensed: {
k_text: '<span unselectable="on" class="cellIcon ruleCondition unlicensed">&nbsp; &nbsp; &nbsp;</span>&nbsp;' + k_tr('Kerio Control Web Filter is unlicensed, the functionality of Content Rules is limited.', 'contentFilter')
},
k_appDisabled: {
k_text: '<span unselectable="on" class="cellIcon ruleCondition warning">&nbsp; &nbsp;</span>&nbsp;' + k_tr('Application awareness is disabled.', 'contentFilter')
},
k_kwfDisabled: {
k_text: '<span unselectable="on" class="cellIcon ruleCondition warning">&nbsp; &nbsp;</span>&nbsp;' + k_tr('Kerio Control Web Filter is disabled.', 'contentFilter')
},
k_bothDisabled: {
k_text: '<span unselectable="on" class="cellIcon ruleCondition warning">&nbsp; &nbsp;</span>&nbsp;' + k_tr('Application awareness and Kerio Control Web Filter are disabled.', 'contentFilter')
}
}
}),
k_columns: {
k_isColumnHidable: false,
k_isColumnMovable: false,
k_sorting: {
k_columnId: 'sorting',
k_isAscending: true
},
k_items: [
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'sorting',
k_isDataOnly: true
},
{
k_columnId: 'name',
k_caption: k_tr('Name', 'common'),
k_width: 310,
k_isSortable: false,
k_renderer: function(k_value, k_data) {
var
k_APP_TYPE = kerio.waw.shared.k_CONSTANTS.ApplicationType,
k_tr = kerio.lib.k_tr,
k_iconCls = 'cellIcon webFilterIcon',
k_cls = '',
k_tooltip;
if (!this.k_isWebFilterLicensed) {
k_cls = 'selectItemsCell invalid';
k_iconCls += ' invalid';
}
else if (!this.k_isApplicationAwarenessOn &&k_APP_TYPE.ApplicationProtocol === k_data.types[0]) {
k_cls = 'selectItemsCell invalid';
k_tooltip = k_tr('Application awareness is disabled.', 'contentEditor');
}
else if (!this.k_isWebFilterOn &&k_APP_TYPE.ApplicationWebFilterCategory === k_data.types[0]) {
k_cls = 'selectItemsCell invalid';
k_tooltip = k_tr('Kerio Control Web Filter is disabled', 'contentEditor');
}
else {
k_iconCls = 'cellIcon webFilterIcon';
}
if (k_data.subGroup) {
k_iconCls = '';
}
k_data = kerio.waw.shared.k_methods.k_renderers.k_highlightSearchValueRenderer.call(this, k_value);
return {
k_iconCls: k_iconCls,
k_iconTooltip: k_tooltip,
k_data: k_tooltip ? k_data : '<span>' + k_data + '</span>', k_className: k_cls,
k_dataTooltip: k_tooltip,
k_isSecure: true
};
},
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'selected'
}
},
{
k_columnId: 'selected',
k_isDataOnly: true
},
{
k_columnId: 'group',
k_isKeptHidden: true,
k_groupRenderer: function(k_value, k_data) {
var
k_textShowWholeGroup = '',
k_group = k_data.group,
k_groupData;
k_groupData = kerio.waw.shared.k_methods.k_renderers.k_highlightSearchValueRenderer.call(this, k_group);
if ('' !== this._k_searchValue) {
if (-1 === this.k_showWholeGroups.k_groups.indexOf(k_group)) {
k_textShowWholeGroup = this.k_generateShowWholeGroupHtml(k_group, false);
}
}
return {
k_data: k_groupData + k_textShowWholeGroup,
k_isSecure: true
};
}
},
{
k_columnId: 'subGroup',
k_isKeptHidden: true,
k_groupRenderer: function(k_value, k_data) {
var
k_showWholeGroups = this.k_showWholeGroups,
k_cls = '',
k_textShowWholeGroup = '',
k_subGroup = k_data.subGroup,
k_subGroupData;
if (!this.k_isApplicationAwarenessOn && !this.k_isWebFilterLicensed) {
k_cls = 'selectItemsCell invalid';
}
k_subGroupData = kerio.waw.shared.k_methods.k_renderers.k_highlightSearchValueRenderer.call(this, k_subGroup);
if ('' !== this._k_searchValue) {
if (-1 === k_showWholeGroups.k_groups.indexOf(k_data.group) && -1 === k_showWholeGroups.k_subGroups.indexOf(k_subGroup)) {
k_textShowWholeGroup = this.k_generateShowWholeGroupHtml(k_subGroup, true);
}
}
return {
k_data: k_subGroupData + k_textShowWholeGroup,
k_iconCls: 'webFilterIcon',
k_className: k_cls,
k_isSecure: true
};
}
},
{
k_columnId: 'types',
k_isKeptHidden: true,
k_isDataOnly: true
},
{
k_columnId: 'description',
k_caption: k_tr('Description', 'common'),
k_isSortable: false,
k_renderer: function(k_value, k_data) {
var
k_searchedVaule = kerio.waw.shared.k_methods.k_renderers.k_highlightSearchValueRenderer.call(this, k_value);
return {
k_isSecure: true,
k_data: ['<span ',kerio.lib.k_buildTooltip(k_searchedVaule, true),'>', k_searchedVaule,'</span>'].join('')
};
}
}
],
k_grouping: {
k_columnId: 'group',
k_isMemberIndented: true,
k_groupingCheckboxColumn: 'name',
k_updateCheckboxesOnViewReady: false,
k_secondLevel: {
k_columnId: 'subGroup',
k_startCollapsed: true
},
k_onShowWholeGroup: function(k_extTarget, k_groupDom, k_extEvent) {
var
k_showWholeGroups = this.k_showWholeGroups,
k_active = false,
k_entityId;
k_entityId = k_extTarget.getAttribute('groupId');
if (k_entityId) {
if (-1 === k_showWholeGroups.k_groups.indexOf(k_entityId)) {
k_showWholeGroups.k_groups.push(k_entityId);
k_active = true;
}
}
k_entityId = k_extTarget.getAttribute('subGroupId');
if (k_entityId) {
if (-1 === k_showWholeGroups.k_subGroups.indexOf(k_entityId)) {
k_showWholeGroups.k_subGroups.push(k_entityId);
k_active = true;
}
}
if (k_active) {
this.k_extWidget.view.toggleGroup(k_groupDom, true);
this.k_customFilter(true);
}
return true !== k_active;
}
}
}
};
k_grid = new kerio.adm.k_widgets.K_BasicList(k_gridId, k_gridCfg);
k_grid.k_addReferences({
k_isWebFilterLicensed: true,
k_loading: k_tr('Loading…', 'common'),
k_originGroupsArray: [],
k_originData: [],
k_showWholeGroups: {},
k_initWholeGroupsReference: function() {
this.k_showWholeGroups = {
k_groups: [],
k_subGroups: []
};
},
k_generateShowWholeGroupHtml: function(k_groupId, k_isSubGroup) {
var
k_attributeName = k_isSubGroup ? 'subGroupId' : 'groupId';
return '<span ' + k_attributeName + '="' + k_groupId + '" class="tooltip expandGroup" ' + kerio.lib.k_buildTooltip(kerio.lib.k_tr('Show whole group', 'selectItems')) + '>&nbsp; &nbsp;</span>';
}
});
k_grid.k_initWholeGroupsReference();

filter = function(k_isShowWholeGroup) {
var
k_enableGroupCheckboxes,
k_originGroupData,
k_originSubGroupsArray,
k_filteredGroups;
k_isShowWholeGroup = true === k_isShowWholeGroup;
this.k_selectRows([]);
this._k_searchValue = this.k_searchField.k_getValue();
this.k_filterRowsBy(function(k_rowData) {
var
k_getValue = kerio.lib._k_getPointerToObject, k_search = this.k_searchField.k_getValue().toLowerCase(), k_selected = this.k_checkboxField.k_getValue(),
k_fields = ['name', 'group', 'subGroup', 'description'],
k_value,
k_i, k_cnt,
k_showWholeGroups;
if ('' === k_search && false === k_selected) {
return true;
}
if ('' === k_search) {
return k_rowData.selected;
}
k_showWholeGroups = this.k_showWholeGroups;
if (-1 < k_showWholeGroups.k_groups.indexOf(k_rowData.group) || -1 < k_showWholeGroups.k_subGroups.indexOf(k_rowData.subGroup)) {
return true;
}
for (k_i = 0, k_cnt = k_fields.length; k_i < k_cnt; k_i++) {
k_value = k_getValue.call(k_rowData, k_fields[k_i], 'this');
if (undefined === k_value || 'boolean' === typeof k_value) {
continue;
}
k_value = k_value.toLowerCase();
if (-1 < k_value.indexOf(k_search)) {
if (false === k_selected) {
return true;
}
else {
return k_rowData.selected;
}
}
}
return false;
}, this);
k_enableGroupCheckboxes = this.k_parentWidget._k_enableGroupCheckboxes;
k_originGroupData = this.k_originGroupsArray;
k_originSubGroupsArray = this.k_originSubGroupsArray;
k_filteredGroups = this.k_getGroups();
if (k_filteredGroups && k_originGroupData) {
k_enableGroupCheckboxes.call(this, k_filteredGroups, k_originGroupData);
k_filteredGroups = this.k_getSubGroups();
k_enableGroupCheckboxes.call(this, k_filteredGroups, k_originSubGroupsArray);
this.k_updateAllGroupingCheckboxes(false);
}
if (!k_isShowWholeGroup) {
this.k_extWidget.view.toggleAllGroups(true);
if ('' === this._k_searchValue && false === this.k_checkboxField.k_getValue()) {
this.k_extWidget.view.toggleAllSubGroups(false);
}
else {
this.k_extWidget.view.toggleAllSubGroups(true);
}
}
};
k_checkboxFieldCfg = {
k_width: 200,
k_option: k_tr('Show only checked', 'httpWebFilter'),
k_onChange: function(k_parent) {
k_parent.k_relatedWidget.k_customFilter();
}
};
k_checkboxField = new kerio.lib.K_Checkbox(k_objectName + '_' + 'k_checkbox', k_checkboxFieldCfg);
k_grid.k_toolbars.k_top.k_addWidget(k_checkboxField);
k_grid.k_toolbars.k_top.k_extWidget.addFill();
k_searchFieldCfg = {
k_id: k_objectName + '_' + 'k_filter',
k_width: 200,
k_className: 'searchField',
k_isLabelHidden: true,
k_value: '',
k_onKeyDown: function(k_toolbar, k_searchInput, k_event) {
if (13 === k_event.keyCode) {
k_event.stopPropagation();
k_event.preventDefault();
}
},
k_onKeyUp: function(k_parent) {
var
k_closureNewSearchValue = this.k_getValue(),
k_closureGrid = k_parent.k_relatedWidget;
if (k_closureNewSearchValue !== k_closureGrid._k_oldSearchValue) { clearTimeout(this._k_searchTimethout);
this._k_searchTimethout = setTimeout(function(){
k_closureGrid.k_initWholeGroupsReference();
k_closureGrid.k_customFilter();
k_closureGrid._k_oldSearchValue = k_closureNewSearchValue;
}, 300);
}
}
};
k_searchField = kerio.waw.shared.k_DEFINITIONS.k_get('k_gridSearchField', k_searchFieldCfg);
k_grid.k_toolbars.k_top.k_addWidget(k_searchField);
k_grid.k_addReferences({
k_searchField: k_searchField,
k_checkboxField: k_checkboxField,
k_customFilter: filter,
_k_searchValue: ''
});
k_dialogCfg = {
k_width: 650,
k_height: 600,
k_content: k_grid,
k_title: k_tr('Applications and Web Categories', 'contentEditor'),
k_isReadOnly: k_isAuditor,
k_defaultItem: k_searchField.k_id,
k_hasHelpIcon: false,
k_onOkClick: function(k_toolbar) {
var k_dialog = k_toolbar.k_dialog;
k_dialog.k_selectItems.call(k_dialog);
}
};
k_dialogCfg = k_shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_grid: k_grid,
k_objectName: k_objectName,
k_loadParams: undefined,
k_searchField: k_searchField,
k_checkboxField: k_checkboxField
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget){
k_kerioWidget.k_applyParams = function(k_params){
var k_grid = this.k_grid;
this.k_parentGrid = k_params.k_parentGrid;
this.k_selectionCallback = k_params.k_callback;
k_grid.k_isApplicationAwarenessOn = this.k_parentGrid.k_isApplicationAwarenessOn;
k_grid.k_isWebFilterOn = this.k_parentGrid.k_isWebFilterOn;
k_grid.k_isWebFilterLicensed = this.k_parentGrid.k_isWebFilterLicensed;
if (!k_grid.k_isWebFilterLicensed) {
k_grid.k_statusbar.k_setVisible(true);
k_grid.k_statusbar.k_switchConfig('k_legendUnlicensed');
}
else if (!k_grid.k_isApplicationAwarenessOn && !k_grid.k_isWebFilterOn) {
k_grid.k_statusbar.k_setVisible(true);
k_grid.k_statusbar.k_switchConfig('k_bothDisabled');
}
else if (!k_grid.k_isApplicationAwarenessOn) {
k_grid.k_statusbar.k_setVisible(true);
k_grid.k_statusbar.k_switchConfig('k_appDisabled');
}
else if (!k_grid.k_isWebFilterOn) {
k_grid.k_statusbar.k_setVisible(true);
k_grid.k_statusbar.k_switchConfig('k_kwfDisabled');
}
else {
k_grid.k_statusbar.k_setVisible(false);
}
k_grid.k_clearData();
this.k_loadItems(k_params);
};

k_kerioWidget._k_enableGroupCheckboxes = function(k_groups, k_originGroups) {
var
k_groupCheckboxEnabled,
k_groupName,
k_group;
for (k_groupName in k_groups) {
if ('object' === typeof k_groups[k_groupName]) {
k_group = k_groups[k_groupName];
k_groupCheckboxEnabled = k_group.length === k_originGroups[k_groupName].length;
this.k_enableGroupCheckbox(k_groupName, k_groupCheckboxEnabled);
}
}
};
k_kerioWidget.k_loadItems = function(k_params) {
var
k_data = kerio.waw.shared.k_CONSTANTS.k_contentFilterApplications,
k_grid = this.k_grid,
k_selectedItems,
k_i, k_cnt,
k_iSelectedItem, k_cntSelectedItem,
k_item,
k_dataId;
k_grid.k_beginUpdate(false);
this.k_showMask(kerio.lib.k_tr('Loading…', 'common'));
k_selectedItems = k_params.k_selectedItems;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_item = k_data[k_i];
k_dataId = k_item['id'];
k_item.selected = false;
for (k_iSelectedItem = 0, k_cntSelectedItem = k_selectedItems.length; k_iSelectedItem < k_cntSelectedItem; k_iSelectedItem++) {
if (k_dataId === k_selectedItems[k_iSelectedItem]) {
k_item.selected = true;
}
}
}
k_grid.k_setData(k_data);
k_grid.k_originData = k_grid.k_getData();
k_grid.k_originGroupsArray = k_grid.k_getGroups();
k_grid.k_originSubGroupsArray = k_grid.k_getSubGroups();
k_grid.k_endUpdate();
this.k_hideMask();
kerio.lib.k_unmaskWidget.defer(550, this, [k_grid]);
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };
k_kerioWidget.k_isAnyRowSelectedByCheckbox = function(k_data) {
return k_data.selected;
};
k_kerioWidget.k_selectItems = function() {
var
k_lib = kerio.lib,
k_grid = this.k_grid,
k_isNothingSelected,
k_selectedRows;
this.k_searchField.k_reset();
this.k_checkboxField.k_reset();
k_grid.k_customFilter();
k_selectedRows = k_grid.k_findRowBy(this.k_isAnyRowSelectedByCheckbox, k_grid, 0, true);
k_isNothingSelected = null === k_selectedRows;
if (k_isNothingSelected) {
k_lib.k_alert({
k_title: k_lib.k_tr('Select Items', 'common'),
k_msg: k_lib.k_tr('Please select at least one item from the list.', 'selectItems'),
k_scope: k_grid
});
this.k_hideMask();
return;
}
this.k_selectionCallback.call(this.k_parentGrid, k_selectedRows);
this.k_hide();
};
k_kerioWidget.k_resetOnClose = function() {
this.k_searchField.k_reset();
this.k_checkboxField.k_reset();
this.k_grid.k_customFilter();
};
}
};