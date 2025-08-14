
Ext4.define('kerio.lib._K_BaseComponent' + '4', {

constructor: function(k_config) {
var
k_lib = kerio.lib,
k_adaptedConfig,
k_extWidget;
this._k_constructorName = this._k_getConstructorName();
this._k_references = [];
this._k_mappedListeners = {};
if (!this._k_storedPropertiesList) {  this._k_storedPropertiesList = [];
}
if (k_config) {
k_config = k_lib.k_applyRestrictionToConfig(k_config);
k_config = this._k_prepareConfig(k_config);
this._k_saveStoredProperties(k_config);
k_adaptedConfig = k_lib._k_createConfig.call(this, k_config, this._k_propertiesDefault, this._k_propertiesMapping);
this._k_adaptedConfig = k_adaptedConfig;
}
this._k_beforeInitExtComponent(this._k_adaptedConfig, this._k_storedConfig);
if (this._k_initExtComponent) {
this.k_extWidget = this._k_initExtComponent(this._k_adaptedConfig, this._k_storedConfig);
k_extWidget = this.k_extWidget;
k_lib._k_addKerioProperty(k_extWidget, {k_owner: this});
if (k_extWidget instanceof Ext4.Component) {
k_extWidget.on('destroy', this._k_destroyComponent, this);
}
}
else {
k_lib.k_reportError('Internal error: Class "' + this._k_constructorName + '" doesn\'t have defined _k_initExtComponent method!', 'baseComponent.js');
}
this._k_afterInitExtComponent(this._k_adaptedConfig, this._k_storedConfig);
delete this._k_adaptedConfig;
},

_k_constructorName: null,


_k_propertiesMapping: null,

_k_propertiesDefault: null,

_k_adaptedConfig: null,

_k_storedConfig: null,

_k_prepareConfig: function(k_config) {
return k_config;
},

_k_beforeInitExtComponent: Ext4.emptyFn,

_k_initExtComponent: null,

_k_afterInitExtComponent: Ext4.emptyFn,

_k_getConstructorName: function() {

return this.$className.substr(this.$className.lastIndexOf('.') + 1);
},

k_isInstanceOf: function(k_constructorList, k_directInstance) {
var
k_lib = kerio.lib,
k_constructorInfo,
k_namespace,
k_constructorName,
k_pointerToSuperclass,
k_i,
k_cnt;
if ('string' === typeof k_constructorList) {
k_constructorList = [k_constructorList];
}
for (k_i = 0, k_cnt = k_constructorList.length; k_i < k_cnt; k_i++) {
k_constructorName = k_constructorList[k_i];
if (true === k_directInstance) {
if (this._k_constructorName === k_constructorName) {
return true;
}
}
else {
k_constructorInfo = k_lib._k_parseConstructorName(k_constructorName);
k_namespace = k_constructorInfo.k_namespace;
if (undefined === k_namespace) {
k_pointerToSuperclass = kerio.lib[k_constructorName];
}
else {
k_pointerToSuperclass = k_lib._k_getPointerToObject(k_constructorInfo.k_constructorName, k_namespace);
}
if (k_pointerToSuperclass && this instanceof k_pointerToSuperclass) {
return true;
}
}
}
return false;
},

k_addReferences: function (k_references) {
for (var k_propertyName in k_references) {
if (undefined === this[k_propertyName]) {
this[k_propertyName] = k_references[k_propertyName];
this._k_references.push(k_propertyName);
}
else {
kerio.lib.k_reportError('Internal error: An attempt to redefine property "' + k_propertyName + '" in the widget "'
+ this.k_id + '"', 'baseComponent.js');
}
}
},

_k_saveStoredProperties: function (k_config) {
var
k_propertyList = this._k_storedPropertiesList,
k_getPointerToObject = kerio.lib._k_getPointerToObject,
k_storedConfig = {},
k_cnt = k_propertyList.length,
k_i,
k_propertyName,
k_composedPropertyName,
k_propertyValue;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_propertyName = k_propertyList[k_i];
if ('object' === typeof k_propertyName) {
for (k_composedPropertyName in k_propertyName) {
k_propertyValue = k_getPointerToObject.call(k_config, 'this.' + k_composedPropertyName);
k_propertyName = k_propertyName[k_composedPropertyName];
break;
}
}
else {
k_propertyValue = k_config[k_propertyName];
}
k_storedConfig[k_propertyName] = k_propertyValue;
}
if (null === this._k_storedConfig) {
this._k_storedConfig = {};
}
this._k_storedConfig = Ext4.apply(this._k_storedConfig, k_storedConfig);
delete this._k_storedPropertiesList;
},

_k_removeStoredProperties: function (k_propertyList) {
var
k_storedConfig = this._k_storedConfig,
k_cnt = k_propertyList.length,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
delete k_storedConfig[k_propertyList[k_i]];
}
},

_k_setStoredProperties: function (k_propertyList) {
if (!this._k_storedPropertiesList) {
this._k_storedPropertiesList = [];
}
this._k_storedPropertiesList = this._k_storedPropertiesList.concat(k_propertyList);
},

_k_destroyComponent: function (k_component) {
delete kerio.lib.k_widgets[k_component._kx.k_owner.k_id];
},

_k_hasListener: function (k_eventName, k_handler, k_scope) {
var
k_extWidget = this.k_extWidget, k_hasListener = k_extWidget.hasListener(k_eventName);
if (!k_hasListener) {
return false;
}
return -1 !== k_extWidget.events[k_eventName].findListener(k_handler, k_scope);
}
});




if (kerio.lib.k_isMSIE10 && 10 === document.documentMode) {
Ext4.Element.prototype.getAttribute = function(name, ns) {
var d = this.dom;
if (ns) {
return d.getAttributeNS(ns, name) || d.getAttribute(ns + ":" + name);
}
return  d.getAttribute(name) || d[name] || null;
};
}


