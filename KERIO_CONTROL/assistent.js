
kerio.waw.ui.assistent = {
k_init: function(k_objectName) {
var
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isIos = k_WAW_METHODS.k_isIos(),
k_productInfo = k_WAW_METHODS.k_productInfo.k_get(),
k_closureOnLinkClick = this.k_onLinkClick,
k_isUnregisteredTrial = k_WAW_METHODS.k_isTrial(false),
k_isRegisteredTrial = k_WAW_METHODS.k_isTrial(true),
k_checkbox,
k_formCfg, k_form,
k_dialogCfg, k_dialog,
k_getItemCfg,
k_licenseCaption,
k_licenseDescription;

k_getItemCfg = function(k_config) {
return {
k_restrictions: k_config.k_restrictions,
k_id: k_config.k_id,
k_type: 'k_display',
k_height: 50,
k_isHidden: k_config.k_isHidden,
k_template: '<table class="assistentItem"><tbody>'
+'<tr>'
+ '<td rowspan="2"><a id="' + k_config.k_id + '_' + 'k_icon' + '" class="link assistentItemIcon {k_iconClass}">&nbsp;</a></td>' + '<td class="assistentItemCaption"><a id="' + k_config.k_id + '" class="link textLink">{k_caption}</a></td>'
+ '</tr><tr>'
+ '<td class="assistentItemDescription">{k_description}</td>'
+ '</tr>'
+ '</tbody></table>',
k_value: k_config.k_values || {},
k_onLinkClick: k_closureOnLinkClick };
};
if (k_isUnregisteredTrial) {
k_licenseCaption = k_tr('Register product…', 'assistant');
k_licenseDescription = k_tr('Register the product with a trial license, a license number or a license key.', 'assistant');
}
else if (k_isRegisteredTrial) {
k_licenseCaption = k_tr('Register product with a purchased license number…', 'assistant');
k_licenseDescription = k_tr('Use your license number to activate the purchased features and Software Maintenance.', 'assistant');
}
else {
k_licenseCaption = k_tr('Update license info…', 'assistant');
k_licenseDescription = k_tr('Upload license key, change license number or update your registration info.', 'assistant');
}
k_formCfg = {
k_restrictBy: {
k_isIos: k_isIos,
k_isUnregisteredTrial: k_isUnregisteredTrial
},
k_items: [
{ k_type: 'k_display',
k_height: 20
},
k_getItemCfg({ k_id: 'k_connection', k_values: {
k_iconClass: 'assistentConnection',
k_caption: k_tr('Configure Internet connection and the local network…', 'assistant'),
k_description: k_tr('Choose a persistent Internet connection, Link Load Balancing or Failover.', 'assistant')
}}),
k_getItemCfg({ k_id: 'k_policy', k_values: {
k_iconClass: 'assistentPolicy',
k_caption: k_tr('Define traffic policy…', 'assistant'),
k_description: k_tr('Configure basic traffic rules simply with few clicks.', 'assistant')
}}),
k_getItemCfg({ k_id: 'k_export', k_restrictions: { k_isIos: [false] }, k_values: {
k_iconClass: 'assistentExport',
k_caption: k_tr('Export your configuration…', 'assistant'),
k_description: k_tr('Save the configuration into a file which can be used as a backup.', 'assistant')
}}),
k_getItemCfg({ k_id: 'k_import', k_restrictions: { k_isIos: [false] }, k_values: {
k_iconClass: 'assistentImport',
k_caption: k_tr('Import configuration…', 'assistant'),
k_description: k_tr('Use the exported backup file to restore the configuration.', 'assistant')
}}),
k_getItemCfg({ k_id: 'k_register', k_values: {
k_iconClass: 'register',
k_caption: k_licenseCaption,
k_description: k_licenseDescription
}})
]
};
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 605,
k_height: k_isIos ? 250 : 410,
k_hasHelpIcon: false,
k_title: k_tr('Configuration Assistant', 'assistant'),
k_content: k_form,
k_buttons: [
'->',
{
k_caption: k_tr('Close', 'common'),
k_isCancel: true,
k_isDefault: true
}
]
}; k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
if (!kerio.lib.k_isIPadCompatible) {
k_checkbox = new kerio.lib.K_Checkbox(k_localNamespace + 'k_showAgainCheckbox', {
k_option: k_tr('Show automatically after login', 'assistant'),
k_onChange: function(k_toolbar, k_item, k_value) {
kerio.waw.status.k_userSettings.k_set('assistant.showAutomatically', k_value);
}
});
k_dialog.k_toolbar.k_addWidget(k_checkbox, 0);
k_dialog.k_addReferences({
k_checkbox: k_checkbox
});
}
k_form.k_addReferences({
k_dialog: k_dialog,
k_productInfo: k_productInfo
});
k_dialog.k_addReferences({
k_form: k_form
});
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
if (!kerio.lib.k_isIPadCompatible) {
var
k_showAutomatically = kerio.waw.status.k_userSettings.k_get('assistant.showAutomatically', true);
this.k_checkbox.k_setChecked(k_showAutomatically);
}
kerio.waw.shared.k_data.k_cache({
k_dialog: this,
k_dialogs: ['configurationImport', 'connectivityWizard', 'policyWizard', 'configurationExport']
});
kerio.waw.requests.k_updateLicense();
};k_kerioWidget.k_updateLicenseInfo = function(k_license) {
var
k_form = this.k_form,
k_productInfo = k_form.k_productInfo,
k_tmp,
k_element;
k_productInfo.k_license = k_license;
k_tmp = this.k_getLicenseText(k_productInfo);
k_element = k_form.k_getItem('k_updateInfo');
k_element.k_setValue({
k_iconClass: 'assistentUpdateInfo',
k_caption: k_tmp.k_caption,
k_description: k_tmp.k_description
});
if (Ext.isIE7) { this.k_hide.createSequence(this.k_show, this).defer(100, this);
}
};

k_kerioWidget.k_getLicenseText = function(k_productInfo) {
var
k_ENGINE_CONSTANTS = kerio.lib.k_getSharedConstants(),
k_tr = kerio.lib.k_tr,
k_caption = '',
k_description = '';
if (typeof k_productInfo.k_license === 'object') {
if (k_ENGINE_CONSTANTS.kerio_web_rsProductRegistered === k_productInfo.k_license.regType) {
k_caption = k_tr('Update registration info…', 'assistant');
k_description = k_tr('Extend your product by adding more users or an additional Software Maintenance.', 'assistant');
}
else if (true !== k_productInfo.k_noRegistration) {
k_caption = k_tr('Register product with a purchased license number…', 'assistant');
k_description = k_tr('Use your license number to activate the purchased features and Software Maintenance.', 'assistant');
}
}
return {
k_caption: k_caption,
k_description: k_description
};
};

k_kerioWidget.k_cancelCallback = function() {
kerio.waw.requests.on('afterLicenseUpdate', this._k_reopenAssistant, this, { single: true }); kerio.waw.requests.k_updateLicense();
};

k_kerioWidget._k_reopenAssistant = function() {
this.k_show();
this.k_applyParams();
};
}, 
k_onLinkClick: function(k_form, k_element, k_linkId) {
var
k_showDialog = kerio.lib.k_ui.k_showDialog,
k_assistent = k_form.k_dialog,
k_dialog = k_form.k_dialog,
k_params = {},
k_sourceName,
k_objectName;
switch (k_linkId) {
case 'k_connection':
k_sourceName = 'connectivityWizard';
break;
case 'k_policy':
k_sourceName = 'policyWizard';
break;
case 'k_export':
k_sourceName = 'configurationExport';
break;
case 'k_import':
k_sourceName = 'configurationImport';
break;
case 'k_register':
k_form.k_dialog.k_hide();
kerio.waw.shared.k_methods.k_startRegistration(
{
k_callbackScope: k_dialog,
k_callback: function() {
kerio.waw.requests.k_updateLicense();
this.k_cancelCallback();
}
}
);
return;
default:
return; }
k_params.k_assistent = k_assistent;
k_form.k_dialog.k_hide();
k_showDialog.defer(1, this, [{
k_sourceName: k_sourceName,
k_objectName: k_objectName,
k_params: k_params,
k_initParams: {}
}]);
}
}; 