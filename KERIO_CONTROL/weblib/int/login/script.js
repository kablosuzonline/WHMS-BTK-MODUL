

kerio.K_Element = function(k_element) {
this.k_dom = typeof k_element == "string" ? document.getElementById(k_element): k_element;
};
kerio.K_Element.prototype = {

k_show: function() {
this.k_dom.style.display = 'block';
},

k_hide: function() {
this.k_dom.style.display = 'none';
},

k_focus: function() {
try {
this.k_dom.focus();
}
catch(k_e) {}
},

k_setValue: function(k_value) {
var k_nodeName = this.k_dom.nodeName || this.k_dom.tagName;
this.k_dom[k_nodeName.toLowerCase() === 'input' ? 'value' : 'innerHTML'] = k_value || '';
},

k_getValue: function() {
var k_nodeName = this.k_dom.nodeName || this.k_dom.tagName;
return this.k_dom[k_nodeName.toLowerCase() === 'input' ? 'value' : 'innerHTML'];
}
};

kerio.k_flyweightElement = function(k_element) {
if (!this._k_flyweightElement) {
this._k_flyweightElement = new kerio.K_Element(k_element);
}
else if (k_element !== this._k_flyweightElement.k_dom.id){
this._k_flyweightElement.k_dom = typeof k_element == "string" ? document.getElementById(k_element): k_element;
}
return this._k_flyweightElement;
};


kerio.K_DomHelper = {

_k_id: 0,

k_append: function(k_parentElement, k_config) {
var
k_element,
k_attributeName,
k_htmlFragment,
k_tagName = k_config.tag || 'div';
delete k_config.tag;
if (window.ActiveXObject && 'input' == k_tagName.toLowerCase()) {
k_htmlFragment = '<' + k_tagName + ' ';
if (!k_config.id) {
k_config.id = 'k_gen' + '_' + (++this._k_id);
}
for (k_attributeName in k_config) {
k_htmlFragment += ('className' == k_attributeName ? 'class' : k_attributeName) + '="' + k_config[k_attributeName] + '" ';
}
k_htmlFragment += '>';
k_parentElement.innerHTML += k_htmlFragment;
k_element = document.getElementById(k_config.id);
}
else {
k_element = document.createElement(k_tagName);
if (k_config.className) {
k_element.className = k_config.className;
delete k_config.className;
}
if (k_config.html) {
try {
k_element.innerHTML = k_config.html;
}
catch (e) {
return null;
}
delete k_config.html;
}
for (k_attributeName in k_config) {
if (typeof k_config[k_attributeName] !== 'function') {
k_element.setAttribute(k_attributeName, k_config[k_attributeName]);
}
}
k_parentElement.appendChild(k_element);
}
return k_element;
}
};


kerio.login.k_loginDialog = {
_k_minimalResolutionDefault: {
k_minWidth: 1024,
k_minHeight: 768
},
_k_urlParamToReason: {
failure: 'incorrect-username',
denied: 'access-denied',
expired: 'session-expired'
},
k_isPlaceholderSupported: (function() {
return 'placeholder' in document.createElement('input');  }()),

k_init: function() {
var k_browserName;
this._k_applyDefaults(k_defaults);
if (k_defaults.k_onAfterLoad) {
k_defaults.k_onAfterLoad.call(this);
}
this._k_show();
if (this._k_ssoConfig) {
setTimeout(function () {
var k_ssoConfig = kerio.login.k_loginDialog._k_ssoConfig;
delete kerio.login.k_loginDialog._k_ssoConfig;
k_ssoConfig.k_probeImgElement.src = k_ssoConfig.k_probeUrl;
}, 1);
}
setTimeout(function(){
kerio.login.k_loginDialog._k_preloadAppFiles();
}, 1000);
if (window.top !== window) {
k_browserName = kerio.lib.k_browserInfo._k_currentBrowser.k_name;
if ('Chrome' === k_browserName || 'Safari' === k_browserName) {
try { window.top.focus(); } catch (k_ex) {}
}
}
},

_k_show: function () {
var
k_loginButtonElStyle,
k_bodyClassName = '';
kerio.k_flyweightElement('main-container').k_dom.style.visibility = 'visible';
if (9 == document.documentMode) {
k_loginButtonElStyle = kerio.k_flyweightElement('login-button').k_dom.style;
k_loginButtonElStyle.position = '';
k_loginButtonElStyle.top = '';
k_loginButtonElStyle.left = '';
}
if (document.documentMode) {
k_bodyClassName += document.documentMode < 9 ? ' oldIE' : '';
}
else {
k_bodyClassName += -1 !== navigator.userAgent.indexOf('MSIE ') ? ' oldIE lessIE8' : '';
}
if (false === this.k_isPlaceholderSupported) {
k_bodyClassName += ' nph';  }
document.body.className = (document.body.className || '') + k_bodyClassName;
kerio.k_flyweightElement(k_defaults.k_defaultItem || 'username').k_focus();
},

k_generateGui: function(k_config) {
var
k_urlParams = kerio.login.k_getUrlParams(),
k_usernameContainer = new kerio.K_Element('username-container'),
k_passwordContainer = new kerio.K_Element('password-container'),
k_ssoContainer,
k_loginButton,
k_element,
k_elementCfg,
k_submitCfg,
k_continueButtonCaption;
if(!kerio.lib.k_translation) {
kerio.lib.k_translation = kerio.lib.translation;
}
k_continueButtonCaption = kerio.lib.k_tr('Continue anyway', 'wlibLoginPage');
k_config = k_config || {};

if (!this.k_isPlaceholderSupported) {
kerio.K_DomHelper.k_append(k_usernameContainer.k_dom, {
tag: 'label',
id: 'label-username',
'for': 'username',
html: kerio.lib.k_tr('Username', 'wlibLoginPage')
});
}
k_elementCfg = {
tag: 'input',
id: 'username',
type: 'email',
name: 'kerio_username',
maxlength: 1024,
className: 'textbox',
placeholder: kerio.lib.k_tr('Username', 'wlibLoginPage')
};
if (k_urlParams.zoom !== undefined) {
k_elementCfg.type = 'text';
k_elementCfg.readonly = 'readonly';
}
kerio.K_DomHelper.k_append(k_usernameContainer.k_dom, k_elementCfg);

if (!this.k_isPlaceholderSupported) {
kerio.K_DomHelper.k_append(k_passwordContainer.k_dom, {
tag: 'label',
id: 'label-password',
'for': 'password',
html: kerio.lib.k_tr('Password', 'wlibLoginPage')
});
}
k_elementCfg = {
tag: 'input',
id: 'password',
type: 'password',
name: 'kerio_password',
maxlength: 1024,
className: 'textbox',
placeholder: kerio.lib.k_tr('Password', 'wlibLoginPage')
};
if (k_urlParams.zoom !== undefined) {
k_elementCfg.type = 'text';
k_elementCfg.readonly = 'readonly';
}
kerio.K_DomHelper.k_append(k_passwordContainer.k_dom, k_elementCfg);
k_submitCfg = {
tag: 'input',
id: 'login-button',
type: 'submit',
value: kerio.lib.k_tr('Login', 'wlibLoginPage')
};
if (k_urlParams.zoom !== undefined) {
k_submitCfg.type = 'button';
}
if (9 == document.documentMode) {
k_submitCfg.style = 'visibility: visible; position: absolute; top: -10000px; left: -10000px;';
}
if (true === Boolean(k_config.k_isSsoEnabled)) {
k_ssoContainer = new kerio.K_Element('sso-container');
kerio.K_DomHelper.k_append(k_usernameContainer.k_dom, {
tag: 'input',
type: 'hidden',
id: 'kerio_sso',
name: 'kerio_sso',
value: 0
});
if (k_config.k_ssoSolveUrl) {
kerio.K_DomHelper.k_append(k_ssoContainer.k_dom, {
tag: 'div',
id: 'k_ssoInfoMsg',
className: 'ssoInfoMsg',
html: kerio.lib.k_tr('%1Confirm the certificate%2 for an automated login to other Kerio applications.', 'wlibLoginPage', { k_isSecure: true,
k_args: ['<a href="' + k_config.k_ssoSolveUrl + '">', '</a>']
})
});
}
k_element = kerio.K_DomHelper.k_append(k_ssoContainer.k_dom, {
tag: 'img'
});
this._k_ssoConfig = {
k_probeUrl: k_config.k_ssoProbeUrl,
k_probeImgElement: k_element
};
k_element.style.display = 'none';
k_element.onerror = function () {
var k_ssoInfoMsg = document.getElementById('k_ssoInfoMsg');
document.getElementById('kerio_sso').value = 0;
if (k_ssoInfoMsg) {
k_ssoInfoMsg.style.display = 'block';
}
};
k_element.onload = function () {
var k_ssoInfoMsg = document.getElementById('k_ssoInfoMsg');
document.getElementById('kerio_sso').value = 1;
if (k_ssoInfoMsg) {
k_ssoInfoMsg.style.display = 'none';
}
};
}
kerio.K_DomHelper.k_append(kerio.k_flyweightElement('loginbutton-container').k_dom, k_submitCfg);
k_loginButton = document.getElementById('login-button');
k_loginButton.onmousedown = function() {
document.getElementById('login-button').className = 'down';
};
k_loginButton.onkeydown = function(e) {
e = e || window.event;
if (13 === e.keyCode || 32 === e.keyCode) {
document.getElementById('login-button').className = 'down';
}
};
document.body.onmouseup= function() {
document.getElementById('login-button').className = '';
};
},

_k_generateRememberMe: function() {
var k_el = kerio.k_flyweightElement('remember').k_dom;
kerio.K_DomHelper.k_append(k_el, {
tag: 'input',
id: 'remember-checkbox',
name: 'kerio_remember',
type: 'checkbox'
});
kerio.K_DomHelper.k_append(k_el, {
tag: 'label',
id: 'checkbox-label',
'for': 'remember-checkbox',
html: kerio.lib.k_tr('Keep me logged in', 'wlibLoginPage')
});
k_el.style.display = 'block';
},

_k_prepareErrorMessages: function(k_defaults) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_supportedBrowsers = k_lib.k_browserInfo.k_mergeBrowsersVersions(k_defaults.k_supportedBrowsers, k_lib.k_browserInfo.k_supportedBrowsers),
k_supportedBrowsersString = '',
k_unsupportedBrowserVersionString = '',
k_supportedVerstions,
k_string,
k_tmp,
k_browser;
if (true !== k_defaults.k_allowAllBrowsers) {
k_supportedBrowsersString = '<ul>';
for (k_browser in k_supportedBrowsers) {
k_supportedVerstions = k_supportedBrowsers[k_browser];
if ('Chrome' === k_browser || 'Firefox' === k_browser || 'MS_Edge' === k_browser || 'Safari' === k_browser) { k_string = k_supportedVerstions.k_name + ' ' + k_supportedVerstions.k_min + ' ' + k_tr('and newer', 'wlibLoginPage');
}
else {
k_tmp = k_supportedVerstions.k_max - k_supportedVerstions.k_min;
if (0 === k_tmp) {
k_string = k_supportedVerstions.k_name + ' ' + k_supportedVerstions.k_min;
}
else if (k_tmp <= 1) {
k_string = k_tr('%1 %2 and %3', 'wlibLoginPage', {k_isSecure: true, k_args: [
k_supportedVerstions.k_name,
k_supportedVerstions.k_min,
k_supportedVerstions.k_max
]});
}
else {
k_string = k_tr('%1 %2 to %3',  'wlibLoginPage', {k_isSecure: true, k_args: [
k_supportedVerstions.k_name,
k_supportedVerstions.k_min,
k_supportedVerstions.k_max
]});
}
}
k_supportedBrowsersString += '<li>' + k_string + '</li>';
}
k_supportedBrowsersString += '</ul>';
}
k_unsupportedBrowserVersionString = k_tr('Your browser or its version is not supported.', 'wlibLoginPage');
this._k_errorMessages = {
'session-expired':
'<h2>' + k_tr('Your session has expired.', 'wlibLoginPage') + '</h2>'
+ '<p>'  + k_tr('Please login again.', 'wlibLoginPage') + '</p>',
'access-denied':
'<h2>' + k_tr('Access denied by administrator.', 'wlibLoginPage') + '</h2>',
'incorrect-username':
'<h2>' + k_tr('Incorrect username or password', 'wlibLoginPage') + '</h2>',
'unsupported-browser':
'<h2>' + k_unsupportedBrowserVersionString + '</h2>' + '<p>'
+ k_tr('Supported browsers:', 'wlibLoginPage')
+ '</p>' + k_supportedBrowsersString,
'blocked-browser':
'<h2>' + k_unsupportedBrowserVersionString + '</h2>' + '<p>'
+ k_tr('Please use one of the supported browsers:', 'wlibLoginPage')
+ '</p>' + k_supportedBrowsersString + '<p>'
+ k_tr('For the best user experience please use Google Chrome.', 'wlibLoginPage')
+ '</p>',
'unsupported-device':
'<h2>' + k_tr('Your device is not supported.', 'wlibLoginPage') + '</h2>'
+ '<p>' +  k_tr('The functionality is very limited. Using PC or Mac is recommended instead.', 'wlibLoginPage')  + '</p>',
'blocked-device':
'<h2>' + k_tr('Your device is not supported.', 'wlibLoginPage') + '</h2>'
+ '<p>' +  k_tr('Please use PC or Mac.', 'wlibLoginPage')  + '</p>',
'resolution-small': '<h2>' + k_tr('Your display resolution is too low.', 'wlibLoginPage') + '</h2>'
+  '<p>' + k_tr('Please use the recommended resolution of %1x%2 or higher.', 'wlibLoginPage',
{
k_isSecure: true,
k_args: [
k_defaults.k_minimalResolution.k_minWidth,
k_defaults.k_minimalResolution.k_minHeight
]
})
+ '</p>'
};
},

_k_applyDefaults: function(k_defaults) {
k_defaults = k_defaults || {};
var
k_params = kerio.login.k_getUrlParams(),
k_errorCode = k_defaults.k_errorCode,
k_formContainer = new kerio.K_Element('container'),
k_hiddenFields = new kerio.K_Element('hiddenfields-container'),
k_loginButton = document.getElementById('login-button'),
k_formAction = k_defaults.k_formAction,
k_browserInfo = kerio.lib.k_browserInfo,
k_isBlocked,
k_isSupported,
k_paramName,
k_paramValue;
document.title = k_defaults.k_title;
k_defaults.k_minimalResolution = k_defaults.k_minimalResolution || {
k_minWidth: this._k_minimalResolutionDefault.k_minWidth || 0,
k_minHeight: this._k_minimalResolutionDefault.k_minHeight || 0
};
this._k_prepareErrorMessages(k_defaults);
if (undefined === k_formAction) {
k_formAction = k_formContainer.k_dom.action;
}
for (k_paramName in k_params) {
k_paramValue = k_params[k_paramName];
switch (k_paramName) {
case 'reason':
k_errorCode = this._k_urlParamToReason[k_paramValue];
break;
case 'zoom':
if ('Firefox' === k_browserInfo._k_getBrowserInfo().k_name) {
document.body.style.MozTransform = 'scale(' + k_paramValue + ')';
document.body.style.MozTransformOrigin = '15px top';
}
else {
document.body.style.zoom = k_paramValue;
}
document.body.style.overflow = 'hidden';
setTimeout(function() {
document.body.scrollTop = 0;
}, 100);
document.getElementById('up-spacer').style.height = '0px';
k_defaults.k_preloadExtJs = false;
k_defaults.k_preloadScripts = [];
break;
default:
if (true === k_defaults.k_preserveGetMethod) {
if (-1 === k_formAction.indexOf('?')) {
k_formAction += '?';
}
else {
k_formAction += '&';
}
k_formAction += k_paramName + '=' + k_paramValue;
}
else {
kerio.K_DomHelper.k_append(k_hiddenFields.k_dom, {
tag: 'input',
name: k_paramName,
value: k_paramValue,
type: 'hidden'
});
}
}
}
if (!k_browserInfo._k_getBrowserInfo().k_isIPad) {
if (k_browserInfo.k_isMobileDevice()) {
if (!k_errorCode) {
if (false !== k_defaults.k_allowMobileDevices) {
k_errorCode = 'unsupported-device';
}
else {
k_errorCode = 'blocked-device';
k_formContainer.k_hide();
}
}
}
else {
if (!k_errorCode && true !== k_defaults.k_allowAllBrowsers) {
k_isBlocked = k_browserInfo.k_isBlocked(k_defaults.k_blockedBrowsers);
k_isSupported = k_browserInfo.k_isSupported(k_defaults.k_supportedBrowsers);
if (k_isBlocked) {
k_errorCode = 'blocked-browser';
k_formContainer.k_hide();
}
else if (!k_isSupported) {
k_errorCode = 'unsupported-browser';
}
}
if (!k_errorCode && (screen.height < k_defaults.k_minimalResolution.k_minHeight
|| screen.width < k_defaults.k_minimalResolution.k_minWidth)
&& !k_browserInfo.k_isSupportedAndroid()) {
k_errorCode = 'resolution-small';
}
}
}
if (k_formAction !== k_formContainer.k_dom.action) {
k_formContainer.k_dom.action = k_formAction;
}
if (document.location.hash) {
k_formContainer.k_dom.action += -1 === k_formContainer.k_dom.action.indexOf('?') ? '?' : '&'; k_formContainer.k_dom.action += 'hash=' + encodeURIComponent(document.location.hash.substr(1)); }
if (undefined !== k_errorCode) {
kerio.k_flyweightElement('error-message-text').k_setValue(this._k_errorMessages[k_errorCode]);
}
kerio.k_flyweightElement('error-message')[undefined !== k_errorCode ? 'k_show' : 'k_hide']();
kerio.k_flyweightElement('product-name').k_setValue(k_defaults.k_name);
if (!k_defaults.k_hideRememberMe) {
this._k_generateRememberMe();
}
if (k_defaults.k_upperMessage) {
kerio.k_flyweightElement('upper-message-container').k_setValue(k_defaults.k_upperMessage);
}
if (k_defaults.k_lowerMessage) {
kerio.k_flyweightElement('lower-message-container').k_setValue(k_defaults.k_lowerMessage);
}
if (k_defaults.k_loginAdditionalInfo) {
kerio.k_flyweightElement('additional-message-container').k_setValue(k_defaults.k_loginAdditionalInfo);
}
if (k_defaults.k_logoUrl) {
document.getElementById('logo').style.backgroundImage = 'url("' + k_defaults.k_logoUrl + '")';
document.getElementById('logo').style.backgroundSize = 'auto';
}
if (k_defaults.k_loginButtonTextColor) {
k_loginButton.style.color = k_defaults.k_loginButtonTextColor;
}
if (k_defaults.k_loginButtonBackgroundColor) {
k_loginButton.style.backgroundColor = k_defaults.k_loginButtonBackgroundColor;
}
if (k_params.zoom !== undefined) {
k_formContainer.k_dom.action = '';
k_formContainer.k_dom.method = '';
k_formContainer.k_dom.onsbumit = function() {return false};
}
},

_k_getXmlHttprequest: function () {
var k_httpRequest = false;
if (window.XMLHttpRequest) {
k_httpRequest = new XMLHttpRequest();
}
else if (window.ActiveXObject) {
k_httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
}
return k_httpRequest;
},

_k_preloadAppFiles: function () {
var
k_httpRequest = this._k_getXmlHttprequest(),
k_files = k_defaults.k_preloadScripts || [],
k_weblibRoot = kerio.login._k_weblibRoot,
k_extCssFile = '/ext/extjs/resources/css/ext-all.css',
k_filesCount,
k_currentBrowser,
k_i;
if (!k_httpRequest) {
return;
}
if (false !== k_defaults.k_preloadExtJs) {
k_currentBrowser = kerio.lib.k_browserInfo._k_getBrowserInfo();
if ('MSIE' == k_currentBrowser.k_name && 7 == k_currentBrowser.k_version) {
k_extCssFile = '/ext/extjs/resources/css/ext-all-ie7.css';
}
k_files = k_files.concat([
k_weblibRoot + '/ext/extjs/ext-all.js',
k_weblibRoot + k_extCssFile
]);
}
k_filesCount = k_files.length;
if (0 === k_filesCount) {
return;
}
for (k_i=0; k_i < k_filesCount; k_i++) {
k_httpRequest = this._k_getXmlHttprequest();
k_httpRequest.open('GET', k_files[k_i] + kerio.login._k_buildHash);
k_httpRequest.send(null);
}
}
};