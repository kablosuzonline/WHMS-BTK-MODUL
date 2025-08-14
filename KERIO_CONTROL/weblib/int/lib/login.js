
if (!window.kerio) {
kerio = {lib: {k_reportError: window.alert}};
}

kerio.lib.k_setSupportedLanguages = function(k_languageArray) {
if (!kerio.lib._k_settings) {
kerio.lib._k_settings = {};
}
kerio.lib._k_settings._k_supportedLanguages = k_languageArray;
};

kerio.lib.k_getSupportedLanguages = function() {
if (kerio.lib._k_settings) {
return kerio.lib._k_settings._k_supportedLanguages;
}
else {
return undefined;
}
};

kerio.lib.k_getCalculatedLanguage = function(k_browserPreferred) {
var
k_supportedLanguages = kerio.lib.k_getSupportedLanguages().join(','),
k_browserLang,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_browserPreferred.length; k_i < k_cnt; k_i++) {
k_browserLang = k_browserPreferred[k_i].substring(0,2);
if (-1 !== k_supportedLanguages.indexOf(k_browserLang)) {
return k_browserPreferred[k_i];
}
}
return 'en'; };

kerio.lib.k_getGrammarCategory = function(k_amount) {
var
k_singularText = 'singular',
k_dualText = 'dual',
k_pluralText = 'plural',
k_amountMod10,
k_amountMod100,
k_language;
k_language = kerio.lib.k_translation.k_currentLanguage || kerio.lib.k_engineConstants.k_CURRENT_LANGUAGE;
switch (k_language) {
case 'cs':
case 'sk':
if (1 === k_amount) {
return k_singularText;
}
if ((k_amount > 1) && (k_amount < 5)) {
return k_dualText;
}
break;
case 'fr':
if (k_amount < 2) {
return k_singularText;
}
break;
case 'ru':
k_amountMod10  = k_amount % 10;
k_amountMod100 = k_amount % 100;
if ((1 === k_amountMod10) && (11 !== k_amountMod100)) {
return k_singularText;
}
if ((k_amountMod10 > 1) && (k_amountMod10 < 5) && ((k_amountMod100 < 10) || (k_amountMod100 > 20))) {
return k_dualText;
}
break;
case 'pl':
if (1 === k_amount) {
return k_singularText;
}
k_amountMod10  = k_amount % 10;
k_amountMod100 = k_amount % 100;
if ((k_amountMod10 > 1) && (k_amountMod10 < 5) && ((k_amountMod100 < 10) || (k_amountMod100 > 20))) {
return k_dualText;
}
break;
case 'hr':
k_amountMod10  = k_amount % 10;
k_amountMod100 = k_amount % 100;
if ((1 === k_amountMod10) && (11 !== k_amountMod100)) {
return k_singularText;
}
if ((k_amountMod10 > 1) && (k_amountMod10 < 5) && ((k_amountMod100 < 12) || (k_amountMod100 > 14))) {
return k_dualText;
}
break;
default:
if (1 === k_amount) {
return k_singularText;
}
}
return k_pluralText;
};

kerio.lib.k_tr = function(k_enString, k_context, k_options) {
if ('' === k_enString) {
return k_enString;
}
var
k_translation = k_enString,
k_defaultContext = 'common',
k_pluralityDefined = false,
k_pluralityRequired,
k_placeholdersRequired,
k_placeholdersDefined,
k_args, k_i, k_cnt;
if (undefined === k_options) {
k_options = {};
}
if (undefined !== k_options.k_pluralityBy) {
k_pluralityDefined = true;
}
if (undefined === k_context) {
k_context = k_defaultContext;
}
if (kerio.lib.k_translation) {
if (kerio.lib.k_translation[k_context]) {
k_translation = kerio.lib.k_translation[k_context][k_enString];
if (undefined === k_translation && k_defaultContext !== k_context && kerio.lib.k_translation[k_defaultContext]) {
k_translation = kerio.lib.k_translation[k_defaultContext][k_enString];
}
if (undefined === k_translation) {
k_translation = kerio.lib._k_createEngPluralText(k_enString);
}
}
else {
k_translation = kerio.lib._k_createEngPluralText(k_enString);
}
}
k_pluralityRequired = false;
if ('object' === typeof k_translation) {
k_pluralityRequired = true;
}
if (k_pluralityRequired && !k_pluralityDefined) {
kerio.lib.k_reportError('Internal error: Translator error' + '\n' + 'enMessage: ' + k_enString + '\n' + 'Context: '
+ k_context + '\n' + '\n' + 'No plurality parameters defined but required!', 'translator.js');
return k_translation.k_singular;
}
if (k_pluralityRequired && k_pluralityDefined) {
switch (kerio.lib.k_getGrammarCategory(k_options.k_pluralityBy)) {
case 'singular':
if (undefined !== k_translation.k_singular) {
k_translation = k_translation.k_singular;
}
else {
kerio.lib.k_reportError('Internal error: Translator error' + '\n' + 'enMessage: ' + k_enString + '\n' + 'Context: ' + k_context + '\n' + '\n' + 'Singular not defined!', 'translator.js');
}
break;
case 'dual':
if (undefined !== k_translation.k_dual) {
k_translation = k_translation.k_dual;
}
else {
kerio.lib.k_reportError('Internal error: Translator error' + '\n' + 'enMessage: ' + k_enString + '\n' + 'Context: ' + k_context + '\n' + '\n' + 'Dual/Paucal not defined!', 'translator.js');
}
break;
default:
if (undefined !== k_translation.k_plural) {
k_translation = k_translation.k_plural;
}
else {
kerio.lib.k_reportError('Internal error: Translator error' + '\n' + 'enMessage: ' + k_enString + '\n' + 'Context: ' + k_context + '\n' + '\n' + 'Plural not defined!', 'translator.js');
}
}
}
k_placeholdersRequired = false;
if (-1 !== k_translation.toString().indexOf('%')) {
k_placeholdersRequired = true;
}
k_placeholdersDefined = false;
if (undefined !== k_options.k_args) {
k_placeholdersDefined = true;
}
if (k_placeholdersRequired && !k_placeholdersDefined) {
kerio.lib.k_reportError('Internal error: Translator error' + '\n' + 'enMessage: ' + k_enString + '\n' + 'Context: ' + k_context + '\n' + '\n' + 'No placeholder parameters defined but required!', 'translator.js');
return k_translation;
}
if ( k_placeholdersRequired && k_placeholdersDefined) {
k_args = k_options.k_args;
k_cnt = k_args.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_translation = k_translation.replace(('%' + (k_i + 1)), '{%' + (k_i + 1) + '%}');
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_translation = k_translation.replace(('{%' + (k_i + 1) + '%}'), true === k_options.k_isSecure ? k_args[k_i] : kerio.lib.k_htmlEncode(k_args[k_i]));
}
}
return k_translation;
}; 
kerio.lib._k_createEngPluralText = function(k_text) {
var
k_isCompoundMessageRegex = new RegExp('[^\\[]*(\\[([^\\[\\|\\]]{1,})\\|([^\\]\\|\\[]{1,})\\]).*'),
k_compoundText;
if (!k_isCompoundMessageRegex.test(k_text)) {
return k_text;
}
k_compoundText = {
k_singular: k_text,
k_plural: k_text
};
kerio.lib._k_compileCompoundText(k_compoundText, k_isCompoundMessageRegex);
return {
k_singular: k_compoundText.k_singular,
k_dual: k_compoundText.k_plural,
k_plural: k_compoundText.k_plural
};
};

kerio.lib._k_compileCompoundText = function(k_text, k_regex) {
var
k_parsedSingular,
k_parsedPlural;
if (!k_regex.test(k_text.k_singular) || !k_regex.test(k_text.k_plural)) {
return;
}
k_parsedSingular = k_regex.exec(k_text.k_singular);
k_parsedPlural = k_regex.exec(k_text.k_plural);
k_text.k_singular = k_parsedSingular[0].replace(k_parsedSingular[1],k_parsedSingular[2]);
k_text.k_plural = k_parsedPlural[0].replace(k_parsedPlural[1],k_parsedPlural[3]);
kerio.lib._k_compileCompoundText(k_text, k_regex);
};

kerio = window.kerio || {};
kerio.lib = kerio.lib || {};

kerio.lib.k_browserInfo = kerio.lib.k_browserInfo || {

k_supportedBrowsers: {
MSIE: {
k_min: 11,
k_max: 11,
k_name: 'Internet Explorer'
},
MS_Edge: {
k_min: 20,
k_name: 'Microsoft Edge'
},
Firefox: {
k_min: 23,
k_name: 'Firefox'
},
Safari: {
k_min: 5,
k_name: 'Safari'
},
Chrome: {
k_min: 31,
k_name: 'Google Chrome'
}
},

k_blockedBrowsers: {
MSIE: {
k_min: 0,
k_max: 6
},
Firefox: {
k_min: 0,
k_max: 2
}
},

_k_currentBrowser: null,

k_isSupported: function(k_requiredBrowsers, k_type) {
k_requiredBrowsers = this.k_mergeBrowsersVersions(k_requiredBrowsers, this.k_supportedBrowsers);
if ('k_min' === k_type) {
return this._k_isSupportedMin(k_requiredBrowsers);
}
if ('k_max' === k_type) {
return this._k_isSupportedMax(k_requiredBrowsers);
}
return this._k_isSupportedMin(k_requiredBrowsers) && this._k_isSupportedMax(k_requiredBrowsers);
},

_k_isSupportedMin: function (k_requiredBrowsers) {
var
k_browserInfo = this._k_getBrowserInfo(),
k_requiredVersion = k_requiredBrowsers[k_browserInfo.k_name];
if (k_requiredVersion) {
k_requiredVersion = k_requiredVersion.k_min;
return k_browserInfo.k_version >= k_requiredVersion;
}
return false;
},

_k_isSupportedMax: function (k_requiredBrowsers) {
var
k_browserInfo = this._k_getBrowserInfo(),
k_requiredVersion;
if ('Chrome' === k_browserInfo.k_name || 'Firefox' === k_browserInfo.k_name || 'MS_Edge' === k_browserInfo.k_name || 'Safari' === k_browserInfo.k_name || k_browserInfo.k_isIPad || this.k_isSupportedAndroid()) {
return true;
}
k_requiredVersion = k_requiredBrowsers[k_browserInfo.k_name];
if (k_requiredVersion) {
k_requiredVersion = k_requiredVersion.k_max;
return k_browserInfo.k_version <= k_requiredVersion;
}
return false;
},

k_isSupportedAndroid: function() {
var
k_ANDROID_MINIMAL_SIZE = 600,
k_browserInfo = this._k_getBrowserInfo();
return k_browserInfo.k_isAndroidTablet && k_ANDROID_MINIMAL_SIZE <= k_browserInfo.k_androidProperties.k_smallerSize;
},

k_isBlocked: function(k_blockedBrowsers) {
var
k_browserInfo = this._k_getBrowserInfo(),
k_requiredVersion;
k_blockedBrowsers = this.k_mergeBrowsersVersions(k_blockedBrowsers, this.k_blockedBrowsers);
k_requiredVersion = k_blockedBrowsers[k_browserInfo.k_name];
if (!k_requiredVersion) {
return false; }
return k_browserInfo.k_version >= k_requiredVersion.k_min && k_browserInfo.k_version <= k_requiredVersion.k_max;
},

_k_getBrowserInfo: function () {
if (this._k_currentBrowser) {
return this._k_currentBrowser;
}
var
k_BROWSER_CHROME = 'Chrome',
k_navigator = navigator.userAgent.toLowerCase(),
k_firefoxPattern = new RegExp('firefox[/\\s](\\d+)\\.(\\d+)'),
k_safariPattern = new RegExp('safari/(\\d+)'),
k_chromePattern = new RegExp('(?:chrome|crios)/(\\d+)'),
k_msiePattern = new RegExp('msie (\\d+)\\.(\\d+)'),
k_msieGeckoPattern = new RegExp('trident/.*like gecko'),  k_operaWebkit = new RegExp('webkit.*\\Wopr/(\\d+)\\.(\\d+)'),
k_msEdgePattern = new RegExp('edge/(\\d+)'),
k_isAndroid = -1 !== k_navigator.indexOf('android'),
k_browser = '',
k_browserMajorVersion,
k_browserMinorVersion,
k_osVersion,
k_size;
if (window.opera || k_operaWebkit.test(k_navigator)) {
k_browser = 'Opera';
}
else if (k_firefoxPattern.test(k_navigator)) {
k_browser = 'Firefox';
}
else if (k_msEdgePattern.test(k_navigator)) {
k_browser = 'MS_Edge';
}
else if (k_chromePattern.test(k_navigator)) {
k_browser = k_BROWSER_CHROME;
}
else if (k_safariPattern.test(k_navigator)) {
k_browser = 'Safari';
}
else if (k_msiePattern.test(k_navigator) || k_msieGeckoPattern.test(k_navigator)) {
k_browser = 'MSIE';
}
else {
k_browser = 'OTHER';
}
k_browserMajorVersion = Number(RegExp.$1);
k_browserMinorVersion = Number(RegExp.$2);
if ('MSIE' === k_browser) {
if (document.documentMode) {
k_browserMajorVersion = document.documentMode;
}
if (6 === k_browserMajorVersion) {
if (document.documentElement && 'undefined' !== typeof document.documentElement.style.maxHeight) {
k_browserMajorVersion = 7;
}
}
}
else if ('Safari' === k_browser) {
k_browserMinorVersion = 0;
if (k_browserMajorVersion > 419) {
k_browserMajorVersion = 3;
if (new RegExp('version/(\\d+)\\.(\\d+)').test(k_navigator)) {
k_browserMajorVersion = Number(RegExp.$1);
k_browserMinorVersion = Number(RegExp.$2);
}
}
else if (k_browserMajorVersion > 412) {
k_browserMajorVersion = 2;
}
else {
k_browserMajorVersion = 1;
}
}
else if ('Opera' === k_browser && window.opera) {
k_browserMajorVersion = 0;
k_browserMinorVersion = 0;
if (window.opera.version) {
k_browserMajorVersion = window.opera.version();
if (new RegExp('(\\d+)\\.(\\d+)').test(k_browserMajorVersion)) {
k_browserMajorVersion = Number(RegExp.$1);
k_browserMinorVersion = Number(RegExp.$2);
}
}
}
else if ('MS_Edge' === k_browser) {
if (k_browserMajorVersion < 12) {
k_browserMajorVersion = 19;
}
else if (12 === k_browserMajorVersion) {
k_browserMajorVersion = 20;
}
else if (13 === k_browserMajorVersion) {
k_browserMajorVersion = 25;
}
else if (14 === k_browserMajorVersion) {
k_browserMajorVersion = 31;
}
else {
k_browserMajorVersion = 31; }
}
this._k_currentBrowser = {
k_name: k_browser,
k_version: Number(k_browserMajorVersion + '.' + k_browserMinorVersion) };
if (new RegExp('applewebkit/(\\d+)\\.(\\d+)').test(k_navigator)) {
this._k_currentBrowser.k_webKitVersion = Number(RegExp.$1);
}
if (-1 !== navigator.platform.indexOf('iPad')) {
if (new RegExp('os (.*) like mac').test(k_navigator)) {
k_osVersion = RegExp.$1.split('_');
if (parseInt(k_osVersion[0], 10) >= 5) {
this._k_currentBrowser.k_isIPad = true;
if ('OTHER' === this._k_currentBrowser.k_name) {
this._k_currentBrowser.k_name = 'Safari';
this._k_currentBrowser.k_version = 'wk' + this._k_currentBrowser.k_webKitVersion;
}
}
}
}
if (-1 !== navigator.platform.indexOf('iPhone')) {
this._k_currentBrowser.k_isIPhone = true;
if ('OTHER' === this._k_currentBrowser.k_name) {
this._k_currentBrowser.k_name = 'Safari';
this._k_currentBrowser.k_version = 'wk' + this._k_currentBrowser.k_webKitVersion;
}
}
if (k_isAndroid) {
if ('Safari' === k_browser) {
this._k_currentBrowser.k_name = k_BROWSER_CHROME;
this._k_currentBrowser.k_version = this.k_supportedBrowsers.Chrome.k_min;
}
k_size = Math.min(screen.width, screen.height);
this._k_currentBrowser.k_isAndroidTablet = true;
this._k_currentBrowser.k_androidProperties = {
k_smallerSize: k_size
};
}
return this._k_currentBrowser;
},

k_mergeBrowsersVersions: function (k_browsers, k_weblibDefault) {
var
k_mergedBrowsers = {},
k_weblibDefaultVersions,
k_appRequiredVersions,
k_browserName;
if (undefined === k_browsers) {
k_browsers = {};
}
for (k_browserName in k_weblibDefault) {
k_weblibDefaultVersions = k_weblibDefault[k_browserName];
k_appRequiredVersions = k_browsers[k_browserName];
if (!k_appRequiredVersions) {
k_mergedBrowsers[k_browserName] = k_weblibDefaultVersions;
}
else {
k_mergedBrowsers[k_browserName] = {
k_min: k_appRequiredVersions.k_min,
k_max: k_appRequiredVersions.k_max,
k_name: k_appRequiredVersions.k_name
};
if (undefined === k_appRequiredVersions.k_min) {
k_mergedBrowsers[k_browserName].k_min = k_weblibDefaultVersions.k_min;
}
if (undefined === k_appRequiredVersions.k_max) {
k_mergedBrowsers[k_browserName].k_max = k_weblibDefaultVersions.k_max;
}
if (undefined === k_appRequiredVersions.k_name) {
k_mergedBrowsers[k_browserName].k_name = k_weblibDefaultVersions.k_name;
}
}
}
for (k_browserName in k_browsers) {
if (undefined === k_mergedBrowsers[k_browserName]) {
k_mergedBrowsers[k_browserName] = k_browsers[k_browserName];
}
}
return k_mergedBrowsers;
},

k_isMobileDevice: function () {
var k_mobileDeviceStrings;
k_mobileDeviceStrings = [
'avantgo',
'blackberry',
'bb10',
'blazer',
'compal',
'elaine',
'fennec',
'hiptop',
'iemobile',
'ip(hone|od|ad)',
'iris',
'kindle',
'lge ',
'maemo',
'midp',
'mmp',
'opera m(ob|in)i',
'palm( os)?',
'phone',
'p(ixi|re)/',
'plucker',
'pocket',
'psp',
'symbian',
'treo',
'up.(browser|link)',
'vodafone',
'wap',
'windows (ce|phone)',
'xda',
'xiino'
];
if (this.k_isSupportedAndroid()) {
return false;
}
return new RegExp(k_mobileDeviceStrings.join('|'), 'i').test(navigator.userAgent);
}
};  