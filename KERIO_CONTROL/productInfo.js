

if (!kerio.waw.shared.k_methods) {
kerio.lib.k_reportError('Internal error: no shared methods defined.', 'productInfo', 15);
}
kerio.waw.shared.k_methods.k_productInfo = {

k_get: function() {
var
k_shared = kerio.waw.shared,
k_SERVER = k_shared.k_CONSTANTS.k_SERVER;
return {
k_name: 'Kerio Control',
k_version: k_SERVER.k_PRODUCT_INFO.versionString,
k_isFinal: k_SERVER.k_PRODUCT_INFO.finalVersion,
k_isBox: k_shared.k_methods.k_isBoxEdition(),
k_serverName: k_SERVER.k_HOST_NAME,
k_serverOs: k_SERVER.k_PRODUCT_INFO.osDescription,
k_noRegistration: kerio.waw.shared.k_methods.k_isAuditor()
};
},
_k_isReady: false,
_k_initParams: null,
_k_forceAssistent: false,

k_setReady: function() {
this._k_isReady = true;
this.k_nextMessage();
},

k_getWarningsRequest: function(k_options) {
return {
k_jsonRpc: {
method: 'ProductInfo.getWarnings'
},
k_callback: this.k_warningCallback,
k_scope: this,
k_callbackParams: k_options,
k_requestOwner: null
};
},

k_getWarnings: function(k_options) {
kerio.waw.requests.k_send(this.k_getWarningsRequest(k_options));
},

k_warningCallback: function(k_data, k_success, k_options) {
var
k_nextMessage = this.k_nextMessage, k_messages;
if (!k_success) {
k_nextMessage();
return;
}
k_messages = (k_data.k_decoded) ? k_data.k_decoded.warnings : k_data.warnings;
if (k_options && k_options.k_callback) {
if (false === k_options.k_callback.call(k_options.k_scope || this, k_messages, k_options.k_callbackParams)) {
k_nextMessage();
return;
}
}
if (!k_messages || !k_messages.length) {
k_nextMessage();
return;
}
this._k_initParams = {
k_index: -1,
k_messages: k_messages
};
k_nextMessage();
},

_k_showWarnings: function() {
if (!this._k_isReady) { if (this._k_initParams) {
this._k_initParams.k_index--;
}
return;
}
var
k_tr = kerio.lib.k_tr,
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_warnings = k_CONSTANTS.WarningType,
k_sourceName = 'alertWithCheckbox',
k_params = this._k_initParams,
k_displayWelcomeDialog = false,
k_licenseExpireType,
k_expireDays,
k_initParams,
k_warning,
k_warningType,
k_message,
k_shortMessage,
k_objectName,k_width,     k_height,    k_noDisable, k_dialogParams;
k_warning = k_params.k_messages[k_params.k_index];
k_noDisable = !k_warning.suppressable;
k_warningType = k_warning.type;
switch (k_warningType) {
case k_warnings.WarnBetaVersion:
k_displayWelcomeDialog = true;
k_sourceName = 'welcomeBeta';
k_initParams = {
k_image: 'img/welcomeBeta.png?v=8629'
};
break;
case k_warnings.k_EXPIRED_SUBSCRIPTION:
case k_warnings.k_EXPIRED_LICENSE:
k_width = 450;
k_height = 380;
if (k_warnings.k_EXPIRED_SUBSCRIPTION === k_warningType) {
k_licenseExpireType = k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Subscription;
}
else {
k_licenseExpireType = k_CONSTANTS.kerio_web_SharedConstants.kerio_web_License;
}
k_expireDays = kerio.waw.shared.k_methods.k_licenseRemainingDays(k_licenseExpireType);
if (k_warnings.k_EXPIRED_SUBSCRIPTION === k_warningType) {
var k_statusMessage = (0 === k_expireDays)
? k_tr('The subscription has expired and the product is not working. Firewall and security services are disabled. You need to renew the subscription to continue using the product as usual.', 'startupWarnings')
: k_tr('After the subscription expires, the product will stop working, firewall and security services will be disabled. You will need to renew the subscription to continue using the product as usual.', 'startupWarnings');
k_message = k_statusMessage
+ '<br><br>'
+ k_tr('To obtain a Software Maintenance renewal, please contact your authorized GFI reseller.', 'startupWarnings')
+ '<br>'
k_shortMessage = 0 === k_expireDays
? k_tr('The Software Maintenance for this product has expired.', 'startupWarnings')
: k_tr('The Software Maintenance will expire in %1 [day|days].', 'startupWarnings', {k_args: [k_expireDays], k_pluralityBy: k_expireDays});
}
else {
k_message = k_tr('When your product license expires, Kerio Control will stop functioning or its abilities will be limited.', 'startupWarnings')
+ '<br><br>'
+ k_tr('To obtain new license, please contact your authorized Kerio reseller or call your local Kerio office for purchasing options.', 'startupWarnings')
+ '<br>'
k_shortMessage = 0 === k_expireDays
? k_tr('The license for this product has expired.', 'startupWarnings')
: k_tr('The license will expire in %1 [day|days].', 'startupWarnings', {k_args: [k_expireDays], k_pluralityBy: k_expireDays});
}
break;
case k_warnings.k_CONNECTION_ONDEMAND:
k_message = k_tr('Kerio Control is configured for on demand dialing. However it has been detected that there are gateways configured on other interfaces than the one designed for dialing. Dialing on demand cannot be performed. Please review your TCP/IP configuration.', 'startupWarnings');
k_shortMessage = k_tr('Problem with Internet connectivity was detected!', 'startupWarnings');
k_height = 275;
break;
case k_warnings.k_CONNECTION_FAILOVER:
k_message = k_tr('Kerio Control has detected that there are default gateways configured on other interfaces than those configured for Internet connection failover. This is often wrong as the default gateway should be typically left blank on any other interfaces. Please review your TCP/IP configuration.', 'startupWarnings');
k_shortMessage = k_tr('Wrong default gateways detected!', 'startupWarnings');
k_width = 350;
k_height = 280;
break;
case k_warnings.k_CONNECTION_BALANCING:
k_message = k_tr('Kerio Control has detected that there are default gateways configured on other interfaces than those configured for load balancing. This is often wrong as the default gateway should be typically left blank on any other interfaces. Please review your TCP/IP configuration.', 'startupWarnings');
k_shortMessage = k_tr('Wrong default gateways detected!', 'startupWarnings');
k_width = 350;
k_height = 280;
break;
case k_warnings.k_CONNECTION_PERSISTENT:
k_message = k_tr('Kerio Control has detected that multiple default gateways are configured on the machine. This is often wrong as the default gateway should be typically configured only on the interface that is connected to the Internet. On any other interfaces it should be left blank. Please review your TCP/IP configuration.', 'startupWarnings');
k_shortMessage = k_tr('Multiple default gateways detected!', 'startupWarnings');
k_width = 350;
k_height = 280;
break;
case k_warnings.WarnUpdateFailed:
k_message = k_tr('Unable to boot the new version. The previous version has been restored.', 'startupWarnings');
k_shortMessage = k_tr('Update of Kerio Control has failed!', 'startupWarnings');
k_noDisable = true;
break;
case k_warnings.WarnConfigurationReverted:
case k_warnings.k_CONNECTION_TIMEOUT:
kerio.lib.k_alert({
k_msg: (k_warnings.WarnConfigurationReverted === k_warningType)
? kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_revertWarningMessage
: kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_serverTimeout,
k_title: kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_alertTitle,
k_icon: 'warning',
k_scope: { k_scope: this,
k_callback: this.k_nextMessage
},

k_callback: function() {
this.k_callback.apply(this.k_scope, this.k_params);
kerio.waw.shared.k_methods.k_unmaskMainScreen();
}
});
return; case k_warnings.k_LLB_INCOMPATIBILITY:
k_message = k_tr('Due to a problem in the TCP/IP implementation in Windows 7 and Windows Server 2008 R2, Kerio Control is unable to perform link load balancing and failover using dial-up lines properly.', 'startupWarnings')
+ '<br><br>'
+ '<a class="link textLink selectable" href="' + kerio.waw.shared.k_CONSTANTS.k_LLB_INCOMPATIBILITY_URL + '" target="_blank">'
+ k_tr('Learn more…', 'startupWarnings')
+ '</a>';
k_shortMessage = k_tr('Compatibility problem', 'startupWarnings');
k_width = 400;
k_height = 250;
break;
case k_warnings.k_LOW_MEMORY:
k_message = k_tr('Memory required for Kerio Control is higher than the memory available. We cannot guarantee smooth running of your system.', 'startupWarnings');
k_shortMessage = k_tr('Low memory warning!', 'startupWarnings');
k_width = 300;
k_height = 250;
break;
default:
k_message = 'Server reports a problem for which there is no message available.<br>Internal warning code is: ' + k_warningType;
k_shortMessage = 'No description available!';
k_noDisable = true;
}
if (k_displayWelcomeDialog) {
k_dialogParams = {
k_sourceName: k_sourceName,
k_initParams: kerio.waw.shared.k_methods.k_mergeObjects(k_initParams,
{
k_productName: 'Kerio Control',
k_isAuditor: k_noDisable,
k_onClickProperties: this,

k_onOkClick: function(k_toolbar, k_toolbarItem) {
var
k_dialog = k_toolbar.k_dialog;
k_dialog.k_avoidResetOnClose = true;
k_dialog.k_hide();
if (undefined === k_toolbar.k_checkbox) {
k_dialog.k_onClickProperties.k_nextMessage();
}
else {
k_dialog.k_onClickProperties.k_warningAlertCallback({}, k_toolbar.k_checkbox.k_getValue()); }
},

k_resetOnClose: function() {
this.k_onClickProperties.k_nextMessage();
}
}
)
};
}
else {
k_dialogParams = {
k_sourceName: k_sourceName,
k_objectName: k_objectName,
k_params: {
k_message: k_message,
k_showDisable: !k_noDisable,
k_shortMessage: k_shortMessage,
k_size: {k_width: k_width, k_height: k_height},
k_callback: this.k_warningAlertCallback,
k_scope: this
}
};
}
kerio.lib.k_ui.k_showDialog(k_dialogParams);
},

k_warningAlertCallback: function(k_params, k_disable) {
if (k_disable) {
k_params = this._k_initParams;
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'ProductInfo.disableWarning',
params: {type: k_params.k_messages[k_params.k_index].type}
},
k_callback: kerio.waw.shared.k_methods.k_emptyFunction });
}
this.k_nextMessage();
},

k_nextMessage: function() {
var
k_this = kerio.waw.shared.k_methods.k_productInfo, k_params = k_this._k_initParams;
if (k_params) {
k_params.k_index++;
if (k_params.k_index < k_params.k_messages.length) {
k_this._k_showWarnings();
return;
}
}
k_this.k_showAssistent(k_this._k_forceAssistent);
},

k_showAssistent: function(k_force) {
if (kerio.waw.shared.k_methods.k_isAuditor()) {
return; }
if (!this._k_isReady) {
this._k_forceAssistent = (true === k_force);
return; }
var k_display = true;
if (true !== k_force) {
if (true === kerio.waw.status.k_assistentDisplayed) { k_display = false;
}
else if (kerio.lib.k_isIPadCompatible || ('' !== window.location.hash && '#' !== window.location.hash && '#dashboard' !== window.location.hash)) { k_display = false;
}
else {
kerio.waw.status.k_assistentDisplayed = true;
k_display = kerio.waw.status.k_userSettings.k_get('assistant.showAutomatically', true);
}
}
if (k_display) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'assistent'
});
}
}
}; 