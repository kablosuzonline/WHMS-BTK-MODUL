
kerio.waw.status = kerio.waw.status || {};
kerio.waw.shared = kerio.waw.shared || {};
kerio.waw.shared.k_widgets = kerio.waw.shared.k_widgets || {};

kerio.waw.shared.k_widgets._K_UserSettings = function(){
var k_constructor = kerio.waw.shared.k_widgets._K_UserSettings;
if (k_constructor._k_instance) {
return k_constructor._k_instance;
}
else { k_constructor._k_instance = this;
}
k_constructor.superclass.constructor.call(this, {});
this.addEvents({
afterSet: true
});
this.on('afterSet', this._k_compareChanges, this);
kerio.lib.k_saveSettingsCallback = this._k_updateChanged.createDelegate(this);
this._k_loadRequestCfg = {
k_jsonRpc: {
method: 'Users.getMySettings'
},
k_callback: this._k_loadCallback,
k_scope: this
};
this._k_loadSettingsRequestCfg = {
k_jsonRpc: {
method: 'Session.getSettings'
},
k_callback: this._k_loadSettingsCallback,
k_scope: this
};
this._k_values = {};
this._k_changed = {};
};

kerio.waw.shared.k_widgets._K_UserSettings._k_instance = null;
kerio.lib.k_extend('kerio.waw.shared.k_widgets._K_UserSettings', Ext.util.Observable, {

k_isReady: false,

_k_globalValues: {
calculatedLanguage: 'en',
language: 'en',
detectedLanguage: 'en',
roles: [],
user: {}
}, _k_globalValuesReady: false,
_k_userSettingsReady: false,

k_getOrig: function(k_name, k_defaultValue) {
var k_result;
if (this._k_globalValues[k_name]) {
k_result = this._k_globalValues[k_name];
}
else {
k_result = this._k_get(k_name, this._k_values.admin);
}
if (undefined === k_result) {
return k_defaultValue;
}
return k_result;
}, 
k_get: function(k_name, k_defaultValue) {
var k_result, k_changes;
if (this._k_globalValues[k_name]) {
k_result = this._k_globalValues[k_name];
}
else {
k_result = this._k_get(k_name, this._k_values.admin);
k_changes = this._k_get(k_name, this._k_changed);
k_result = this._k_merge(k_changes, k_result);
}
if (undefined === k_result) {
return k_defaultValue;
}
return k_result;
}, 
_k_get: function(k_name, k_scope, k_fullPath) {
var
k_dotPos = k_name.indexOf('.'),
k_scopeName,
k_scopeValue,
k_tmp;
if (undefined === k_scope) {
return undefined;
}
if (-1 < k_dotPos) {
k_scopeName = k_name.slice(0, k_dotPos);
k_name = k_name.slice(k_dotPos + 1);
k_scopeValue = this._k_get(k_name, k_scope[k_scopeName], k_fullPath);
if (k_fullPath) {
k_tmp = {};
k_tmp[k_scopeName] = k_scopeValue;
return k_tmp;
}
return k_scopeValue;
}
else {
if (k_fullPath) {
return k_scope;
}
return k_scope[k_name];
}
}, 
k_set: function(k_name, k_value, k_autoSave) {
if (undefined !== this._k_globalValues[k_name]) {
kerio.lib.k_reportError('Internal error: ' + k_name + ' is reserved name and can\'t be changed.', 'userSettings', 'k_set');
return;
}
if (kerio.waw.shared.k_methods.k_compare(this.k_get(k_name), k_value)) {
return; }
this.suspendEvents(); this._k_set(k_name, k_value);
this.resumeEvents();
this.fireEvent('afterSet', k_name, k_value);
}, 
_k_set: function(k_name, k_value) {
var
k_compare = kerio.waw.shared.k_methods.k_compare,
k_dotPos = k_name.lastIndexOf('.'),
k_scope,
k_pendingChanges,
k_orig;
if (-1 < k_dotPos) {
k_scope = k_name.slice(0, k_dotPos);
k_name = k_name.slice(k_dotPos + 1);
k_pendingChanges = this._k_get(k_scope, this._k_changed) || {}; k_orig = this._k_get(k_scope, this._k_values.admin) || {};
if (k_compare(
k_orig[k_name],      k_value,           false)  ) {
delete k_pendingChanges[k_name];
}
else {
k_pendingChanges[k_name] = k_value;
}
this._k_set(k_scope, k_pendingChanges, false);
}
else {
if (k_compare(this._k_values.admin[k_name], k_value, false)) {
delete this._k_changed[k_name];
}
else {
this._k_changed[k_name] = k_value;
}
}
},

_k_merge: function(k_changes, k_origValue) {
if (undefined === k_changes) {
return k_origValue;
}
if ('object' === typeof k_origValue && 'object' === typeof k_changes) {
return kerio.waw.shared.k_methods.k_mergeObjects(k_changes, kerio.lib.k_cloneObject(k_origValue));
}
return k_changes;
},

_k_updateChanged: function() {
this._k_values.admin = this._k_merge(this._k_changed, this._k_values.admin);
this._k_changed = {};
},

_k_compareChanges: function(k_name, k_value) {
var
k_lib = kerio.lib,
k_root = k_lib.k_isIPadCompatible ? 'iPadAdmin' : 'admin',
k_new,
k_orig;
this.suspendEvents(); k_orig = this.k_getOrig(k_name);
if (k_lib.k_isEmpty(this._k_changed)) {
k_lib.k_todo('userSettings::_k_compareChanges - accessing directly k_lib._k_settings.k_custom');
delete k_lib._k_settings.k_custom[k_root];
}
else if (k_orig === k_value) {
k_lib.k_removeCustomSettings(k_root + '.' + k_name);
}
else {
k_new = {};
k_new[k_root] = this._k_get(k_name, this._k_changed, true);
k_lib.k_addCustomSettings(k_new);
}
this.resumeEvents();
},

k_getLoadRequest: function() {
this.k_isReady = false;
return this._k_loadRequestCfg;
},

k_getLoadSettingsRequest: function() {
this.k_isReady = false;
return this._k_loadSettingsRequestCfg;
},

k_load: function() {
this.k_isReady = false;
kerio.waw.requests.k_sendBatch([this._k_loadRequestCfg, this._k_loadSettingsRequestCfg]);
},

_k_loadCallback: function(k_response, k_success) {
var k_values;
if (!k_success) {
return;
}
k_values = k_response.settings;
this._k_globalValues.calculatedLanguage = k_values.calculatedLanguage;
this._k_globalValues.language = k_values.language;
this._k_globalValues.detectedLanguage = k_values.detectedLanguage;
this._k_globalValues.roles = k_values.roles;
this._k_globalValues.user = k_values.user;
this._k_globalValues.fullName = k_values.fullName;
this._k_globalValues.email    = k_values.email;
this.suspendEvents();
this.k_role = this.k_get('roles')[0];
this.k_language = this.k_get('calculatedLanguage');
this.k_browserLanguage = this.k_get('detectedLanguage');
this.k_calculatedLanguage = this.k_get('calculatedLanguage');
this.k_loggedUser = {
k_name: this.k_getName(),
k_domainName: this.k_getDomainName()
};
this.resumeEvents();
this._k_globalValuesReady = true;
this.k_isReady = this._k_globalValuesReady && this._k_userSettingsReady;
},

_k_loadSettingsCallback: function(k_response, k_success) {
var
k_root = kerio.lib.k_isIPadCompatible ? 'iPadAdmin' : 'admin',
k_values;
if (!k_success) {
return;
}
k_values = k_response.settings || {};
k_values.admin = k_values[k_root] || {};
kerio.lib.k_setSettings(k_values, k_root);
this._k_values = k_values;
this._k_userSettingsReady = true;
this.k_isReady = this._k_globalValuesReady && this._k_userSettingsReady;
},

k_save: function(k_config) {
var k_widget = kerio.waw.shared.k_methods._k_getMainScreen(); k_config = k_config || {};
kerio.lib.k_saveSettings({
k_widget: k_widget,
k_callback: k_config.k_callback
});
}, 
k_getDomainName: function() {
var
k_user = this.k_get('user'),
k_userDomain = k_user.domainName || 'localhost';
return k_user.name + '@' + k_userDomain;
}, 
k_getName: function() {
return this.k_get('user').name;
}, 
k_hasRole: function(k_role) {
var
k_roles = this.k_get('roles'),
k_i, k_cnt;
for (k_i = 0, k_cnt = k_roles.length; k_i < k_cnt; k_i++) {
if (k_role === k_roles[k_i]) {
return true;
}
}
return false;
}
});kerio.waw.status.k_userSettings = new kerio.waw.shared.k_widgets._K_UserSettings();
kerio.lib._k_saveSettingsOnError = function(k_response){
if (kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.finalVersion) {
return true;
}
if (!k_response || !k_response.k_decoded) {
kerio.lib.k_reportError('Developement error: Invalid response when saving user settings.', 'userSettings', 'onError');
return true;
}
if (k_response.k_decoded.error && k_response.k_decoded.error.message) {
kerio.lib.k_reportError('Developement error: ' + k_response.k_decoded.error.message, 'userSettings', 'onError');
return true;
}
return false;
};