
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

kerio = window.kerio ? window.kerio : {

skipLibraryLoad: false
};

kerio.lib = {
k_name: 'kerio.lib.js',
k_browserInfo: (kerio.lib && kerio.lib.k_browserInfo) ? kerio.lib.k_browserInfo : null,

k_version: '2.40',
k_extLibrary: 'ExtJS',

k_extLibraryVersion: '3.2.1',

k_extLibraryRoot: '../../ext/extjs',

k_extExtensionsRoot: '../../ext/extjsux',

k_kerioLibraryRoot: '',
k_libraryLoaded: false,

DOM : {
'ELEMENT_NODE'               : 1,
'ATTRIBUTE_NODE'             : 2,
'TEXT_NODE'                  : 3,
'CDATA_SECTION_NODE'         : 4,
'ENTITY_REFERENCE_NODE'      : 5,
'ENTITY_NODE'                : 6,
'PROCESSING_INSTRUCTION_NODE': 7,
'COMMENT_NODE'               : 8,
'DOCUMENT_NODE'              : 9,
'DOCUMENT_TYPE_NODE'         :10,
'DOCUMENT_FRAGMENT_NODE'     :11,
'NOTATION_NODE'              :12
},

k_widgets: {},

k_domElementsCache: {},

k_constants: {
k_TOOLBAR_BUTTON: 1,
k_TOOLBAR_MENUBUTTON: 2,
k_TOOLBAR_STRING: 3,
k_FORM_INDENT: 20, k_TEXT_FIELD_MAX_LENGTH: 255,
k_TEXT_AREA_MAX_LENGTH: 65536,
k_BUTTON_MIN_WIDTH: 82,
k_DEFAULT_LABEL_WIDTH: 100,
k_DEFAULT_VALIDATION_STATUS: true,
k_languageList: [],  k_maskCfg: {
k_message: 'Loading…',  k_delay: 1000
}
},  
_k_sharedConstants: null,

_k_preloadImagesList: [
'img/actionResult.png?v=8629',
'../../ext/extjs/resources/images/default/window/icon-info.gif?v=8629',
'../../ext/extjs/resources/images/default/window/icon-question.gif?v=8629',
'../../ext/extjs/resources/images/default/window/icon-warning.gif?v=8629',
'../../ext/extjs/resources/images/default/window/icon-error.gif?v=8629'
],

k_isSlowMachine: false,

k_browserSpeed: -1,

_k_generatedIdCnt: 0,

_k_GENERATED_ID_PREFIX: 'k_gen' + '_',

_k_placeholder: '%+',

_k_alertStack: [],

_k_externalClasses: {},

_k_regularExpressions: {
k_qouteRE: new RegExp('"', 'g'),
k_ampRE: new RegExp('&', 'g')
},

_k_msgBoxZIndex: 30000,

_k_backwardCompatibilityExtJS202: true,

_k_typeToConstructorMap: {
k_formUploadButton:  'K_UploadButton',
k_simpleText:        'K_SimpleText',
k_templateText:      'K_TemplateText',
k_display:           'K_DisplayField',
k_progressBar:       'K_ProgressBar',
k_formButton:        'K_FormButton',
k_checkbox:          'K_Checkbox',
k_radio:             'K_Radio',
k_select:            'K_Select',
k_selectLanguage:    'K_SelectLanguage',
k_selectTypeAhead:   'K_SelectTypeAhead',
k_number:            'K_NumberField',
k_spinner:           'K_SpinnerField',
k_date:              'K_DateField',
k_text:              'K_TextField',
k_email:             'K_EmailField',
k_textArea:          'K_TextArea',
k_image:             'K_ImageField',
k_multiTrigger:      'K_MultiTriggerField',
k_slider:			 'K_Slider',
k_htmlEditor:        'K_HtmlEditor',
k_container:         'K_FormContainer',
k_fieldset:          'K_FieldsetContainer',
k_columns:           'K_ColumnContainer',
k_row:               'K_RowContainer'
},

_k_debugMode: false,

_k_buildDescription: {
k_weblibFiles: {
k_path: '',
k_files: null
},
k_appFiles: {
k_path: '',
k_files: null
}
},

_k_todos: {},

_k_executionStack: {
k_afterLoad: []
},

k_onReady: null,

_extPublished: (kerio.lib && kerio.lib._extPublished) ? kerio.lib._extPublished : {},

k_isStateful: false,

k_loadJs : function(k_fileName, k_useAbsolutePath, k_isFilePathNormalized) {
var
k_filePath,
k_fileList,
k_i, k_cnt;
if (!k_isFilePathNormalized) {
k_filePath = this._k_normalizePath(k_fileName, k_useAbsolutePath);
}
else {
k_filePath = k_fileName;
}
k_fileList = this._k_getFileList(k_filePath);
for (k_i = 0, k_cnt = k_fileList.length; k_i < k_cnt; k_i++) {
document.write('<script type="text/javascript" src="' + k_fileList[k_i] + this._k_kerioLibraryQuery + '"></script>');
}
},

k_loadCss : function(k_fileName, k_useAbsolutePath, k_isFilePathNormalized) {
var k_filePath;
if (!k_isFilePathNormalized) {
k_filePath = this._k_normalizePath(k_fileName, k_useAbsolutePath);
}
else {
k_filePath = k_fileName;
}
k_filePath += this._k_kerioLibraryQuery;
var k_link = document.createElement('LINK');
k_link.setAttribute('type', 'text/css');
k_link.setAttribute('rel', 'stylesheet');
k_link.setAttribute('href', k_filePath);
this._k_headElement.appendChild(k_link);
},

k_loadFiles: function (k_files, k_baseDir, k_useAbsolutePath) {
var k_fileName,
k_fileExt,
k_i,
k_cnt = k_files.length,
k_regExp = new RegExp('^.*\\/$');
if (!k_baseDir) {
k_baseDir = './';
}
else if (false === k_regExp.test(k_baseDir)) {
k_baseDir += '/';
}
k_baseDir = this._k_normalizePath(k_baseDir, k_useAbsolutePath);
for (k_i = 0; k_i < k_cnt; k_i++) {
k_fileName = k_files[k_i];
k_fileExt = this._k_getFileExtension(k_fileName).toLowerCase();
k_fileName = k_baseDir + k_fileName;
switch (k_fileExt) {
case '.js':
this.k_loadJs(k_fileName, k_useAbsolutePath, true);
break;
case '.css':
this.k_loadCss(k_fileName, k_useAbsolutePath, true);
break;
default: kerio.lib.k_reportError('Internal error: Unknown file extension \'' + k_fileExt + '\'. File: ' + k_fileName, 'kLib');
}
}
},

_k_getFileExtension: function (k_fileName) {
return k_fileName.substring(k_fileName.lastIndexOf('.'));
},

_k_normalizePath: function(k_fileName, k_useAbsolutePath) {
var
k_filePath = (k_useAbsolutePath) ? k_fileName : this.k_kerioLibraryRoot + k_fileName,
k_p = k_filePath.indexOf('/../'),
k_path;
while (-1 !== k_p && !k_useAbsolutePath) {
k_path = k_filePath.substr(0, k_p);
k_path = k_path.substr(0, k_path.lastIndexOf('/'));
k_filePath = k_path + k_filePath.substr(k_p + 3);
k_p = k_filePath.indexOf('/../');
}
k_p = k_filePath.indexOf('://');
if (k_p) {
k_p += 3;
k_filePath = k_filePath.substr(0, k_p) + k_filePath.substr(k_p).replace('//', '/');
}
return k_filePath;
},

_k_getFileList: function (k_fileName) {
var
k_parts,
k_weblibFiles = kerio.lib._k_buildDescription.k_weblibFiles.k_files,
k_appFiles = kerio.lib._k_buildDescription.k_appFiles.k_files,
k_path,
k_cnt,
k_pos;
if (null === k_weblibFiles && null === k_appFiles) {
return [k_fileName];
}
k_parts = k_fileName.split('.');
k_cnt = k_parts.length;
if (k_cnt < 3 || 'min' !== k_parts[k_cnt - 2] || 'js' !== k_parts[k_cnt - 1]) {
return [k_fileName];
}
if (this._k_isWeblibFile(k_fileName) && k_weblibFiles) {
return this._k_getFileListFromBuildDescription(k_fileName, kerio.lib._k_buildDescription.k_weblibFiles, kerio.lib.k_kerioLibraryRoot);
}
if (this._k_isAppFile(k_fileName) && k_appFiles) {
k_path = document.location.origin + document.location.pathname;
k_pos = k_path.indexOf('.html');
if (k_pos > 0 && -1 !== k_path.lastIndexOf('/')) {
k_path = k_path.substr(0, k_path.lastIndexOf('/'));
}
if ('/' !== k_path.charAt(k_path.length - 1)) {
k_path += '/';
}
return this._k_getFileListFromBuildDescription(k_fileName, kerio.lib._k_buildDescription.k_appFiles, k_path);
}
return [k_fileName];
},

_k_isAppFile: function(k_fileName) {
return true;
},

_k_isWeblibFile: function(k_fileName) {
return false;
},
_k_getFileListFromBuildDescription: function(k_fileName, k_buildDescription, k_root) {
k_fileName = this._k_normalizePath(k_root + k_fileName, true);
k_fileName = k_fileName.replace('/./', '/');
return k_buildDescription.k_files[k_fileName] || [k_fileName];
},

k_registerWidget: function (k_widget, k_id) {
if (!k_id) {
k_id = k_widget.k_id;
}
if (this.k_widgets[k_id]) {
kerio.lib.k_reportError('Internal error: Widget ID "' + k_id + '" already exists.\n' +
'ID has to be unique across the application.', 'kLib.js');
}
this.k_widgets[k_id] = k_widget;
},

k_unregisterWidget: function(k_id) {
var k_widget = this.k_widgets[k_id];
var k_extWidget;
if (k_widget) {
k_extWidget = k_widget.k_extWidget;
if (k_extWidget.destroy) {
k_extWidget.destroy();
}
else {
delete k_widget.k_extWidget;
}
delete this.k_widgets[k_id];
}
},

k_getWidgetById: function(k_id) {
return this.k_widgets[k_id];
},
_k_processUrlArgs: function() {
var
k_search = document.location.search,
k_args,
k_property,
k_i, k_cnt;
if (!k_search) {
return;
}
k_args = k_search.substr(1).split('&');
for (k_i = 0, k_cnt = k_args.length; k_i < k_cnt; k_i++) {
k_property = k_args[k_i].split('=');
switch (k_property[0]) {
case 'k_debug':
this._k_debugMode = true;
break;
case 'weblibFiles':
kerio.lib._k_buildDescription.k_weblibFiles.k_path = this._k_getPath(k_property[1]);
this._k_getFile(k_property[1], 'kerio.lib._k_buildDescription.k_weblibFiles.k_files');
this._k_normalizeBuildDescription(kerio.lib._k_buildDescription.k_weblibFiles);
break;
case 'appFiles':
kerio.lib._k_buildDescription.k_appFiles.k_path = document.location.origin + this._k_getPath(k_property[1]);
this._k_getFile(k_property[1], 'kerio.lib._k_buildDescription.k_appFiles.k_files');
this._k_normalizeBuildDescription(kerio.lib._k_buildDescription.k_appFiles);
break;
}
}
},
_k_getPath: function(k_url) {
var k_p = k_url.lastIndexOf('/');
if (-1 !== k_p) {
k_url = k_url.substr(0, k_p);
}
return k_url;
},

_k_getFile: function(k_url, k_variableName) {
var k_xhr;
if (window.XMLHttpRequest) {
k_xhr = new window.XMLHttpRequest();
}
else if (window.ActiveXObject) {
k_xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
}
if (!k_xhr) {
this.k_reportError('Internal error: Cannot load ' + k_url, 'kLib.js');
return;
}
k_xhr.open('GET', k_url, false);
k_xhr.send(null);
if (k_variableName) {
eval(k_variableName + '=' + k_xhr.responseText + ';');
}
else {
eval(k_xhr.responseText);
}
},

_k_normalizeBuildDescription: function(k_buildDescription) {
var
k_files = k_buildDescription.k_files,
k_path = k_buildDescription.k_path,
k_normalizedFiles = {},
k_minFilePath,
k_minFileRoot,
k_name,
k_items,
k_i, k_cnt;
for (k_name in k_files) {
if (k_files.hasOwnProperty(k_name)) {
k_items = k_files[k_name];
k_minFilePath = this._k_normalizePath(k_path + '/' + k_name, true);
k_minFileRoot = this._k_getPath(k_minFilePath);
for (k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_items[k_i] = this._k_normalizePath(k_minFileRoot + '/' + k_items[k_i], true);
}
k_normalizedFiles[k_minFilePath] = k_items;
}
}
k_buildDescription.k_files = k_normalizedFiles;
},
_k_printHelp: function() {
var
k_browserName = kerio.lib.k_browserInfo._k_getBrowserInfo().k_name,
k_help = [
'If your app uses local building system for JS merging and minification (*.min.js files are used in your index.html),',
'then the minified files are used by default and changes in particular files are not propagated to the app during development.',
'For loading particular files instead *.min.js use an additional arg in URL with a path to JSON file',
'(see _k_buildDescription property documentation):',
'%c http://localhost:4040/admin/?appFiles=/admin/buildFiles.json ',
'Do not forget to mofify app url after login.'
],
k_sep = new Array(80).join('*'),
k_console = window.console,
k_line,
k_i, k_cnt;
if (!k_console) {
return;
}
k_console.log(k_sep);
for (k_i = 0, k_cnt = k_help.length; k_i < k_cnt; k_i++) {
k_line = k_help[k_i];
if (-1 !== k_line.indexOf('%c')) {
if ('MSIE' === k_browserName) {
k_console.log('*', k_line.replace('%c ', '\t'));
}
else {
k_console.log('*' + k_line, 'color: green; background: lightyellow; font-size: 10pt;');
}
}
else {
k_console.log('*', k_line);
}
}
k_console.log(k_sep);
},

_k_init : function() {
var
k_scripts = document.getElementsByTagName('script'),
k_extLibraryRoot = this.k_extLibraryRoot,
k_extExtensionsRoot = this.k_extExtensionsRoot,
k_regExp = new RegExp('(.*)\\bkLib.js\\b'),
k_skipLibraryLoad = kerio.skipLibraryLoad,
k_kerioLibraryRoot,
k_kerioLibraryQuery,
k_scriptSrc,
k_curDir,
k_p,
k_i,
k_cnt;
delete kerio.skipLibraryLoad;
for (k_i = 0, k_cnt = k_scripts.length; k_i < k_cnt; k_i++) {
k_scriptSrc = k_scripts[k_i].src;
if (k_scriptSrc && k_scriptSrc.match(k_regExp)) {
k_kerioLibraryRoot = RegExp.$1;
if (0 !== k_kerioLibraryRoot.indexOf('http') && 0 !== k_kerioLibraryRoot.indexOf('file:///') && 0 !== k_kerioLibraryRoot.indexOf('/')) {
k_curDir = document.location.href;
k_p = k_curDir.lastIndexOf('/');
k_curDir = k_curDir.substr(0, k_p + 1);
k_kerioLibraryRoot = this._k_normalizePath(k_curDir + k_kerioLibraryRoot, true);
}
this.k_kerioLibraryRoot = k_kerioLibraryRoot;
k_p = k_scriptSrc.indexOf('?');
k_kerioLibraryQuery = (-1 === k_p) ? '' : k_scriptSrc.substr(k_p);
if (-1 !== k_kerioLibraryQuery.indexOf('k_debug' )) {
this._k_debugMode = true;
}
this._k_kerioLibraryQuery = k_kerioLibraryQuery;
break;
}
}
this._k_processUrlArgs();
if (!this.k_browserInfo) {
this._k_getFile(k_kerioLibraryRoot + 'util/browser.js');
}
if (k_kerioLibraryQuery && -1 !== k_kerioLibraryQuery.indexOf('v=BUILD' + '_HASH')) {
this._k_printHelp();
}
this._k_setBrowserIdFlags();
this._k_setSystemIdFlags();
this._k_headElement = document.getElementsByTagName("head").item(0);
if (true !== k_skipLibraryLoad) {
if (this.k_isMSIE7) {
this.k_loadCss(k_extLibraryRoot + '/resources/css/ext-all-ie7.css');
}
else {
this.k_loadCss(k_extLibraryRoot + '/resources/css/ext-all.css');
}
if (this._k_debugMode) {
this.k_loadJs(k_extLibraryRoot + '/adapter/ext/ext-base-debug.js');
this.k_loadJs(k_extLibraryRoot + '/ext-all-debug.js');
}
else {
this.k_loadJs(k_extLibraryRoot + '/adapter/ext/ext-base.js');
this.k_loadJs(k_extLibraryRoot + '/ext-all.js');
}
this.k_loadJs (k_extExtensionsRoot + '/PrinterFriendly/PrinterGridPanel.js');
this.k_loadJs (k_extExtensionsRoot + '/PrinterFriendly/PrinterGridView.js');
this.k_loadJs (k_extExtensionsRoot + '/BufferView/BufferView.js');
this.k_loadCss(k_kerioLibraryRoot + '/kLib.css', true);
this.k_loadJs (k_kerioLibraryRoot + '/util.js', true);
this.k_loadJs (k_kerioLibraryRoot + '/core.js', true);
this.k_loadJs (k_kerioLibraryRoot + '/wrapper.js', true);
if (this.k_isIPadCompatible) {
this.k_loadJs (k_kerioLibraryRoot + '/../iPad/TouchController.js', true);
this.k_loadCss(k_kerioLibraryRoot + '/../iPad/iPad.css', true);
}
this._k_doAfterLoad();
}
},

_k_setBrowserIdFlags: function() {
var
k_browserInfo = kerio.lib.k_browserInfo._k_getBrowserInfo(),
k_browserName = k_browserInfo.k_name,
k_browserMajorVersion = parseInt(k_browserInfo.k_version, 10);
this.k_isMSIE = 'MSIE' === k_browserName;
this.k_isFirefox = 'Firefox' === k_browserName;
this.k_isSafari = 'Safari' === k_browserName;
this.k_isChrome = 'Chrome' === k_browserName;
this.k_isMSEdge = 'MS_Edge' === k_browserName;
this.k_isWebKit = this.k_isChrome || this.k_isSafari;
if (this.k_isMSIE) {
this.k_isMSIE7 = false;
this.k_isMSIE8 = false;
this.k_isMSIE9 = false;
this.k_isMSIE10 = false;
this.k_isMSIE11 = false;
switch (k_browserMajorVersion) {
case 7:
this.k_isMSIE7 = true;
break;
case 8:
this.k_isMSIE8 = true;
break;
case 9:
this.k_isMSIE9 = true;
break;
case 10:
this.k_isMSIE10 = true;
break;
case 11:
this.k_isMSIE11 = true;
this.k_isMSIE = false;
break;
default:
break;
}
}
if (this.k_isFirefox) {
this.k_isFirefox2 = false;
this.k_isFirefox3 = false;
this.k_isFirefox36 = false;
this.k_isFirefox4 = false;
this.k_isFirefox5 = false;
this.k_isFirefoxLess4 = false;
this.k_isFirefox25Plus = 25 <= k_browserMajorVersion;
switch (k_browserMajorVersion) {
case 2:
this.k_isFirefox2 = true;
this.k_isFirefoxLess4 = true;
break;
case 3:
this.k_isFirefox3 = true;
this.k_isFirefoxLess4 = true;
if (3.6 === k_browserInfo.k_version) {
this.k_isFirefox36 = true;
}
break;
case 4:
this.k_isFirefox4 = true;
break;
case 5:
this.k_isFirefox5 = true;
break;
default:
break;
}
}
if (this.k_isSafari) {
this.k_isSafari3 = false;
this.k_isSafari4 = false;
this.k_isSafari5 = false;
switch (k_browserMajorVersion) {
case 3:
this.k_isSafari3 = true;
break;
case 4:
this.k_isSafari4 = true;
break;
case 5:
this.k_isSafari5 = true;
break;
case 6:
this.k_isSafari6 = true;
break;
default:
break;
}
}
this.k_isIPad = Boolean(k_browserInfo.k_isIPad);
this.k_isIPhone = Boolean(k_browserInfo.k_isIPhone);
this.k_isAndroidTablet = Boolean(k_browserInfo.k_isAndroidTablet);
this.k_isIPadCompatible = this.k_isIPad || this.k_isIPhone || this.k_isAndroidTablet;
},

_k_setSystemIdFlags: function () {
var
k_userAgent = navigator.userAgent.toLowerCase(),
k_re = new RegExp('mac os x 10[_|.](\\d+)');
if (k_re.test(k_userAgent)) {
switch (RegExp.$1) {
case '4': this.k_isTiger = true; break;
case '5': this.k_isLeopard = true; break;
case '6': this.k_isSnowLeopard = true; break;
case '7': this.k_isLion = true; break;
}
this.k_isSnowLeopardOrLater = RegExp.$1 >= 6;
this.k_isLionOrLater = RegExp.$1 >= 7;
}
},

_k_doAfterLoad: function() {
var
k_lib = kerio.lib,
k_afterLoadStack = k_lib._k_executionStack.k_afterLoad,
k_i,
k_cnt,
k_startTime;
if (!window.Ext || !Ext.isReady || !document.body) {
setTimeout(k_lib._k_doAfterLoad, 100);
return;
}
if (k_lib.k_isIPadCompatible) {
k_lib._k_iPadAdapter();
}
if (k_lib.k_isMSIE) {
Ext.BLANK_IMAGE_URL = kerio.lib._k_normalizePath(kerio.lib.k_extLibraryRoot + '/s.gif?v=8629', false);
}
Ext.USE_NATIVE_JSON = true;
k_lib._k_fixJson();
Ext.QuickTip.prototype.dismissDelay = 10000; Ext.QuickTips.init();
if (k_lib._k_debugMode) {
for (k_i = 0, k_cnt = k_afterLoadStack.length; k_i < k_cnt; k_i++) {
k_afterLoadStack[k_i]();
}
}
k_startTime = new Date();
Ext.EventManager.onWindowResize(k_lib._k_resizeDialogs, k_lib);
k_lib._k_loadImages();
k_lib._k_initMsgBoxManager();
k_lib.k_ui.k_init();
k_lib._k_createScrollerElement();
k_lib.k_browserSpeed = new Date() - k_startTime;
k_lib.k_isSlowMachine = k_lib.k_browserSpeed > 500;
k_lib.k_libraryLoaded = true;
if (k_lib.k_onReady) {
k_lib.k_onReady();
}
}
};

kerio.lib.k_applyRestrictionToConfig = function(k_settings, k_restrictBy)
{
if (undefined === k_restrictBy) {
if (undefined === k_settings.k_restrictBy) {
return k_settings;
}
k_restrictBy = k_settings.k_restrictBy;    }
if (k_settings instanceof kerio.lib._K_BaseComponent) {  return k_settings;
}
var
k_lib = kerio.lib,
k_config,
k_setting,
k_property,
k_isArray,
k_isObject,
k_isRegExp,
k_isFunction,
k_isKerioWidget,
k_i, k_cnt;
if (k_settings instanceof Array) {
k_config = [];
for (k_i = 0, k_cnt = k_settings.length; k_i < k_cnt; k_i++) {
k_setting = k_settings[k_i];
if ('string' === typeof(k_setting) || 'number' === typeof(k_setting)) {
k_config.push(k_setting);
}
else {
if (undefined === k_setting.k_restrictions || k_lib._k_isRestrictionMatched(k_restrictBy, k_setting.k_restrictions)) {
k_config.push(k_lib.k_applyRestrictionToConfig(k_setting, k_restrictBy));
}
}
}
}
else {
if (undefined === k_settings.k_restrictions || k_lib._k_isRestrictionMatched(k_restrictBy, k_settings.k_restrictions)) {
k_config = {};
for (k_property in k_settings) {
if (k_settings.hasOwnProperty(k_property)) {
k_setting = k_settings[k_property];
k_isArray = k_setting instanceof Array;
k_isObject = k_setting instanceof Object;
k_isRegExp = k_setting instanceof RegExp;
k_isFunction = k_setting instanceof Function;
k_isKerioWidget = (k_isObject && undefined !== k_setting.k_isInstanceOf);
if (k_isArray || (k_isObject && !k_isRegExp && !k_isFunction && !k_isKerioWidget)) {
k_config[k_property] = k_lib.k_applyRestrictionToConfig(k_setting, k_restrictBy);
}
else {
k_config[k_property] = k_setting;
}
}
}
}
}
return k_config;
};

kerio.lib._k_isRestrictionMatched = function(k_restrictBy, k_restrictions) {
var
k_anyMatch,
k_restrictByItem,
k_restrictByValue,
k_itemRestrictions,
k_currentResult,
k_result;
if ('object' === Ext.type(k_restrictBy)) {
k_anyMatch = true === k_restrictions.k_anyMatch;
k_result = !k_anyMatch;
for (k_restrictByItem in k_restrictBy) {
k_restrictByValue = k_restrictBy[k_restrictByItem];
k_itemRestrictions = k_restrictions[k_restrictByItem];
k_currentResult = (undefined !== k_itemRestrictions) ? (-1 !== k_itemRestrictions.indexOf(k_restrictByValue)) : true;
if (k_anyMatch) {
k_result = k_result || k_currentResult;
}
else {
k_result = k_result && k_currentResult;
}
}
}
else {
k_result = (-1 !== k_restrictions.indexOf(k_restrictBy));
}
return k_result;
};

kerio.lib._k_isEnumerable = function(k_variable)
{
var k_type = Ext.type(k_variable);  if (k_variable && k_variable.k_isInstanceOf) {  k_type = 'kerioWidget';
}
return ('object' === k_type || 'array' === k_type);
};

kerio.lib._k_cloneObject = function(k_sourceObject)
{
if (!k_sourceObject) {
return k_sourceObject;
}
var
k_clonedObject,
k_propertyName,
k_propertyValue,
k_i, k_cnt;
if (k_sourceObject instanceof Array) {
k_clonedObject = [];
for (k_i = 0, k_cnt = k_sourceObject.length; k_i < k_cnt; k_i++) {
k_propertyValue = k_sourceObject[k_i];
if (kerio.lib._k_isEnumerable(k_propertyValue)) {
k_clonedObject[k_i] = kerio.lib._k_cloneObject(k_propertyValue);
}
else {
k_clonedObject[k_i] = k_propertyValue;
}
}
}
else {
k_clonedObject = {};
for (k_propertyName in k_sourceObject) {
k_propertyValue = k_sourceObject[k_propertyName];
if (undefined !== k_propertyValue) {
if (kerio.lib._k_isEnumerable(k_propertyValue)) {
k_clonedObject[k_propertyName] = kerio.lib._k_cloneObject(k_propertyValue);
}
else {
k_clonedObject[k_propertyName] = k_propertyValue;
}
}
}
}
return k_clonedObject;
};

kerio.lib.k_cloneObject = function(k_sourceObject, k_newProperties, k_config)
{
var
k_lib = kerio.lib,
k_normConfig,
k_clonedObject;
k_normConfig = k_lib._k_applyDefaults(k_config || {}, {
k_removeUndefinedProperties: false,
k_replaceExisting          : true,
k_addNonExisting           : true
});
k_clonedObject = k_lib._k_cloneObject(k_sourceObject);  if (undefined !== k_newProperties) {
k_clonedObject = k_lib._k_applyNewProperties(k_clonedObject, k_newProperties, k_normConfig);
}
if (true === k_normConfig.k_removeUndefinedProperties) {
k_clonedObject = k_lib.k_removeUndefinedProperties(k_clonedObject);
}
return k_clonedObject;
};

kerio.lib._k_applyNewProperties = function (k_object, k_newProperties, k_config) {
var
k_replaceExisting = k_config.k_replaceExisting,
k_addNonExisting = k_config.k_addNonExisting,
k_lib = kerio.lib,
k_propertyName,
k_propertyValue,
k_newPropertyValue,
k_i,
k_cnt;
if (Ext.isArray(k_newProperties)) {
for (k_i = 0, k_cnt = k_newProperties.length; k_i < k_cnt; k_i++) {
k_propertyValue = k_object[k_i];
k_newPropertyValue = k_newProperties[k_i];
if (k_replaceExisting || (undefined === k_propertyValue)) {
if (!k_addNonExisting && (undefined === k_propertyValue)) {
continue;
}
if (k_lib._k_isEnumerable(k_newPropertyValue)) {
if (undefined === k_object[k_propertyName]) {
if (Ext.isArray(k_newPropertyValue)) {
k_object[k_i] = [];
}
else {
k_object[k_i] = {};
}
}
k_object[k_i] = k_lib._k_applyNewProperties.call(this, k_object[k_i], k_newPropertyValue, k_config);
}
else {
k_object[k_i] = k_newPropertyValue;
}
}
}
}
else {
for (k_propertyName in k_newProperties) {
k_propertyValue = k_object[k_propertyName];
k_newPropertyValue = k_newProperties[k_propertyName];
if (k_replaceExisting || (undefined === k_propertyValue)) {
if (!k_addNonExisting && (undefined === k_propertyValue)) {
continue;
}
if (k_lib._k_isEnumerable(k_newPropertyValue)) {
if (undefined === k_object[k_propertyName]) {
if (Ext.isArray(k_newPropertyValue)) {
k_object[k_propertyName] = [];
}
else {
k_object[k_propertyName] = {};
}
}
k_object[k_propertyName] = k_lib._k_applyNewProperties.call(this, k_object[k_propertyName], k_newPropertyValue, k_config);
}
else {
k_object[k_propertyName] = k_newPropertyValue;
}
}
}
}
return k_object;
};

kerio.lib._k_applyDefaults = function(k_sourceObject, k_defaults)
{
if (!k_sourceObject) {
return kerio.lib._k_cloneObject(k_defaults);
}
var
k_propertyName,
k_defaultPropertyValue,
k_sourcePropertyValue,
k_defaultPropertyType,
k_sourcePropertyType,
k_stringProperty,
k_numberProperty,
k_typeMismatch,
k_placeholder = kerio.lib._k_placeholder,
k_placeholderPos;
for (k_propertyName in k_defaults) {
k_defaultPropertyValue = k_defaults[k_propertyName];
k_sourcePropertyValue = k_sourceObject[k_propertyName];
k_defaultPropertyType = Ext.type(k_defaultPropertyValue);
k_sourcePropertyType = Ext.type(k_sourcePropertyValue);
if (undefined !== k_sourcePropertyValue &&  k_sourcePropertyType !== k_defaultPropertyType) {
k_typeMismatch = true;
k_stringProperty = 'string' === k_sourcePropertyType ? k_sourcePropertyValue : ('string' === k_defaultPropertyType ? k_defaultPropertyValue : null);
k_numberProperty = 'number' === k_sourcePropertyType ? k_sourcePropertyValue : ('number' === k_defaultPropertyType ? k_defaultPropertyValue : null);
if (null !== k_stringProperty && null !== k_numberProperty) {
if ('auto' === k_stringProperty || k_stringProperty.lastIndexOf('%') === k_stringProperty.length - 1) {
k_typeMismatch = false;
}
else if ('value' === k_propertyName) {
k_typeMismatch = false;
}
}
if (k_typeMismatch) {
kerio.lib.k_reportError('Internal error: Type mismatch in _k_applyDefaults: ' + k_propertyName, 'kLib.js');
}
}
if (kerio.lib._k_isEnumerable(k_defaultPropertyValue)) {
if (undefined === k_sourcePropertyValue) {
if ('array' === k_defaultPropertyType) {
k_sourceObject[k_propertyName] = [];
}
else {
k_sourceObject[k_propertyName] = {};
}
kerio.lib._k_applyDefaults(k_sourceObject[k_propertyName], k_defaultPropertyValue);
}
else {
kerio.lib._k_applyDefaults(k_sourcePropertyValue, k_defaultPropertyValue);
}
}
else {
k_placeholderPos = ('string' === k_defaultPropertyType) ? k_defaultPropertyValue.indexOf(k_placeholder) : -1;
if (undefined === k_sourcePropertyValue || -1 !== k_placeholderPos) {
if (undefined === k_sourcePropertyValue) {
k_sourcePropertyValue = '';
}
if (-1 !== k_placeholderPos) {
k_defaultPropertyValue = k_defaultPropertyValue.replace(k_placeholder, k_sourcePropertyValue).trim();
k_defaultPropertyValue = k_defaultPropertyValue.replace('  ', ' ');
}
k_sourceObject[k_propertyName] = k_defaultPropertyValue;
}
}
}
return k_sourceObject;
};

kerio.lib._k_applyMapping = function(k_sourceObject, k_mapping)
{
if (!k_sourceObject) {
return k_sourceObject;
}
var
k_lib = kerio.lib,
k_propertyName,
k_propertyValue,
k_mappedObject,
k_mappedPropertyName,
k_i, k_cnt;
if ('array' === Ext.type(k_sourceObject)) {
k_mappedObject = [];
for (k_i = 0, k_cnt = k_sourceObject.length; k_i < k_cnt; k_i++) {
k_propertyValue = k_sourceObject[k_i];
if (kerio.lib._k_isEnumerable(k_propertyValue)) {
k_mappedObject[k_i] = k_lib._k_applyMapping.call(this, k_propertyValue, k_mapping);
}
else {
k_mappedObject[k_i] = k_propertyValue;
}
}
}
else {
k_mappedObject = {};
for (k_propertyName in k_sourceObject) {
k_propertyValue = k_sourceObject[k_propertyName];
k_mappedPropertyName = k_mapping[k_propertyName];
if (k_mappedPropertyName) {
if ('object' === typeof(k_mappedPropertyName)) {
kerio.lib._k_applyObjectMapping.call(this, k_mappedObject, k_propertyName, k_propertyValue, k_mappedPropertyName);
}
else if (kerio.lib._k_isEnumerable(k_propertyValue)) {
k_mappedObject[k_mappedPropertyName] = k_lib._k_applyMapping.call(this, k_propertyValue, k_mapping);
}
else {
k_mappedObject[k_mappedPropertyName] = k_propertyValue;
}
}
}
}
return k_mappedObject;
};

kerio.lib._k_applyObjectMapping = function(k_mappedObject, k_propertyName, k_propertyValue, k_mappingCfg) {
var
k_extPropertyName,
k_businessLogic,
k_value;
if (k_mappingCfg.k_handler || k_mappingCfg.k_listener) {
kerio.lib._k_applyHandlerMapping.call(this, k_mappedObject, k_propertyName, k_propertyValue, k_mappingCfg);
}
else {
for (k_extPropertyName in k_mappingCfg) {
k_businessLogic = k_mappingCfg[k_extPropertyName];
k_value = k_businessLogic[String(k_propertyValue)];
if (undefined !== k_value) {
k_mappedObject[k_extPropertyName] = k_value;
}
}
}
};

kerio.lib._k_applyHandlerMapping = function(k_mappedObject, k_propertyName, k_apiFunction, k_handlerMapping) {
var k_lib = kerio.lib,
k_addKerioProperty = k_lib._k_addKerioProperty,
k_extPropertyName = k_handlerMapping.k_extName,
k_tmpObject = {};
if (k_handlerMapping.k_handler) {
k_tmpObject[k_propertyName] = k_apiFunction;
k_mappedObject[k_extPropertyName] = k_lib._k_getPointerToObject.call(this, k_handlerMapping.k_handler);
k_addKerioProperty(k_mappedObject, k_tmpObject);
}
else if (k_handlerMapping.k_listener) {
if (undefined !== k_apiFunction) {
if (undefined === k_mappedObject.listeners) {
k_mappedObject.listeners = {};
}
k_tmpObject[k_extPropertyName] = {
fn: k_lib._k_getPointerToObject.call(this, k_handlerMapping.k_listener),
scope: k_lib._k_getPointerToObject.call(this, k_handlerMapping.k_scope)
};
Ext.apply(k_mappedObject.listeners, k_tmpObject);
this._k_mappedListeners[k_propertyName] = k_apiFunction;
}
}
};

kerio.lib._k_createConfig = function(k_sourceObject, k_defaults, k_mapping)
{
var k_configObject;
if (undefined !== k_sourceObject && 'object' !== typeof k_sourceObject) {
return k_sourceObject;
}
if (k_mapping) {
k_configObject = kerio.lib._k_applyMapping.call(this, k_sourceObject, k_mapping);
}
else {
k_configObject = kerio.lib._k_cloneObject(k_sourceObject);
}
if (k_defaults) {
k_configObject = kerio.lib._k_applyDefaults(k_configObject, k_defaults);
}
return k_configObject;
};

kerio.lib.k_autoCreateElement = function(k_id, k_className)
{
var k_element = document.getElementById(k_id);
if (!k_element) {
k_element = document.createElement('div');
if (k_id) {
k_element.id = k_id;
}
document.body.appendChild(k_element);
}
if (k_className) {
k_element.className = k_className;
}
return k_element;
};

kerio.lib.k_getDomElement = function(k_id)
{
var k_domElement = this.k_domElementsCache[k_id];
if (!k_domElement) {
k_domElement = document.getElementById(k_id);
if (k_domElement) {
this.k_domElementsCache[k_id] = k_domElement;
}
}
return k_domElement;
};

kerio.lib.k_registerObserver = function(k_subject, k_observer, k_eventType) {
if (undefined === k_eventType) {
k_eventType = kerio.lib.k_constants.k_EVENT.k_TYPES.k_ALL;
}
if (!k_subject.k_observers) {
k_subject.k_observers = [];
}
if (!(k_eventType instanceof Array)) {
k_eventType = [k_eventType];
}
var k_observers = k_subject.k_observers;
var k_currentEventType;
for (var k_i = 0, k_cnt = k_eventType.length; k_i < k_cnt; k_i++) {
k_currentEventType = k_eventType[k_i];
if (!k_observers[k_currentEventType]) {
k_observers[k_currentEventType] = [];
}
k_subject.k_observers[k_currentEventType].push(k_observer);
}
}; 
kerio.lib.k_unregisterObserver = function() {
};

kerio.lib.k_notify = function(k_sender, k_eventType, k_extEvent) {
var k_lib = kerio.lib,
k_event = new k_lib.K_Event(k_eventType, k_extEvent),
k_observers = k_sender.k_observers,
k_eventTypeAll = k_lib.k_constants.k_EVENT.k_TYPES.k_ALL,
k_eventObservers,
k_i, k_cnt;
k_extEvent = k_extEvent || {};
if (!k_observers) {
return;
}
if (!k_eventType) {
k_lib.k_reportError('Internal error: kerio.lib.k_notify: unspecified event type!', 'kLib.js');
return;
}
if (k_eventTypeAll === k_eventType) {
k_lib.k_reportError('Internal error: kerio.lib.k_notify: event type cannot be k_EVENT.k_TYPES.k_ALL!', 'kLib.js');
return;
}
if (k_observers[k_eventTypeAll] && k_observers[k_eventType]) {
k_eventObservers = k_observers[k_eventTypeAll].concat(k_observers[k_eventType]);
}
else {
k_eventObservers = k_observers[k_eventTypeAll] || k_observers[k_eventType];
}
if (k_eventObservers) {
for (k_i = 0, k_cnt = k_eventObservers.length; k_i < k_cnt; k_i++) {
k_eventObservers[k_i].k_update.call(k_eventObservers[k_i], k_sender, k_event);
}
}
}; 
kerio.lib.k_alert = function(k_config, k_msg, k_callback, k_scope) {
if (!(k_config instanceof Object)) {
k_config = {
k_title: k_config,
k_msg: k_msg,
k_callback: k_callback,
k_scope: k_scope,
k_icon: 'INFO'
};
}
else {
if (undefined === k_config.k_icon) {
k_config.k_icon = 'INFO';
}
else {
k_config.k_icon = k_config.k_icon.toUpperCase();
}
}

if (undefined === k_config.k_callback) {
k_config.k_callback = kerio.lib._k_removeAlertFromStack;
}
else {
k_config.k_callback = kerio.lib._k_createFinallySequence(k_config.k_callback, kerio.lib._k_removeAlertFromStack);
}
kerio.lib._k_alertStack.push(k_config);
if (1 === kerio.lib._k_alertStack.length) {
kerio.lib._k_showAlertFromStack();
}
};

kerio.lib._k_showAlertFromStack = function() {
var k_alertStack = kerio.lib._k_alertStack,
k_alertInfo,
k_callback,
k_dialog;
if (k_alertStack.length > 0) {
k_alertInfo = k_alertStack[0];
k_callback = k_alertInfo.k_callback.createSequence(kerio.lib._k_showAlertFromStack);
Ext.Msg.show({
title : k_alertInfo.k_title,
msg : k_alertInfo.k_msg,
buttons: Ext.Msg.OK,
fn: k_callback,
scope : k_alertInfo.k_scope,
icon: Ext.MessageBox[k_alertInfo.k_icon]
});
if (Ext.isWebKit && '3.2.1' === kerio.lib.k_extLibraryVersion) {
k_dialog = Ext.MessageBox.getDialog();
k_dialog.setWidth('auto');
k_dialog.center();
if (k_dialog.getWidth() > Ext.MessageBox.maxWidth) {
k_dialog.setWidth(Ext.MessageBox.maxWidth);
}
k_dialog.center();
}
}
};

kerio.lib._k_removeAlertFromStack = function() {
kerio.lib._k_alertStack.shift();
};

kerio.lib._k_initMsgBoxManager = function () {
var
k_extDialog = Ext.Msg.getDialog(),
k_originalManager = k_extDialog.manager,
k_newManager = new Ext.WindowGroup();
k_newManager.zseed = this._k_msgBoxZIndex;
k_originalManager.unregister(k_extDialog);
k_extDialog.manager = k_newManager;
k_newManager.register(k_extDialog);
};

kerio.lib.k_confirm = function(k_config, k_msg, k_callback, k_scope, k_defaultButton, k_isCancelable) {
var
k_buttons,
k_configButtons;
if (!(k_config instanceof Object)) {
k_config = {
title: k_config,
msg: kerio.lib._k_addEllipsisToLongWords(k_msg),
buttons: k_isCancelable ? Ext.Msg.YESNOCANCEL : Ext.Msg.YESNO,
fn: k_callback,
scope: k_scope,
icon: Ext.MessageBox.QUESTION
};
}
else {
k_configButtons = k_config.k_buttons;
k_defaultButton = k_config.k_defaultButton;
if (k_configButtons) {
k_buttons = {
ok: k_configButtons.k_ok,
yes: k_configButtons.k_yes,
no: k_configButtons.k_no,
cancel: k_configButtons.k_cancel
};
}
k_config = {
title: k_config.k_title,
msg: k_config.k_msg,
buttons: k_buttons ? k_buttons : (k_config.k_isCancelable ? Ext.Msg.YESNOCANCEL : Ext.Msg.YESNO),
fn: k_config.k_callback,
scope: k_config.k_scope,
icon: undefined !== k_config.k_icon ? Ext.MessageBox[k_config.k_icon.toUpperCase()] : Ext.MessageBox.QUESTION
};
}
kerio.lib._k_addKerioProperty(Ext.Msg.getDialog(), {k_defaultButton: k_defaultButton});
Ext.Msg.show(k_config);
};

kerio.lib.k_extend = function(k_subclassName, k_superclass, k_overrides) {
var
k_nodes = k_subclassName.split('.'),
k_constructorInfo,
k_namespace,
k_constructorName,
k_subclass;
if (k_nodes.length < 2) {
this.k_reportError('Internal error: A subclass name ' + k_subclassName + ' doesn\'t contain a namespace', 'kLib.js');
return;
}
k_constructorInfo = this._k_parseConstructorName(k_subclassName);
k_namespace = k_constructorInfo.k_namespace;
k_constructorName = k_constructorInfo.k_constructorName;
k_subclass = this._k_getPointerToObject(k_constructorName, k_namespace);
Ext.extend(k_subclass, k_superclass, k_overrides);
if (k_namespace !== 'kerio.lib') {
k_subclass.prototype._k_constructorName = k_subclassName;
this._k_registerExternalClass(k_namespace, k_constructorName);
}
};

kerio.lib._k_parseConstructorName = function(k_constructorName) {
var
k_nodes = k_constructorName.split('.'),
k_namespace;
if (k_nodes.length > 1) {
k_constructorName = k_nodes.pop();
k_namespace = k_nodes.join('.');
}
return {
k_namespace: k_namespace,
k_constructorName: k_constructorName
};
};

kerio.lib._k_registerExternalClass = function(k_namespace, k_constructorName) {
var k_externalClasses = this._k_externalClasses;
if (undefined === k_externalClasses[k_namespace]) {
k_externalClasses[k_namespace] = [];
}
k_externalClasses[k_namespace].push(k_constructorName);
};

kerio.lib.k_jsonDecode = function(k_jsonString) {
var k_response = null;
try {
k_response = Ext.util.JSON.decode(k_jsonString);
}
catch (k_exception) {
}
return k_response;
};

kerio.lib.k_jsonEncode = function(k_object) {
return Ext.util.JSON.encode(k_object);
};

kerio.lib.k_getGeneratedId = function() {
return this._k_GENERATED_ID_PREFIX + (this._k_generatedIdCnt++);
};

kerio.lib.k_htmlEncode = function(k_string) {
return Ext.util.Format.htmlEncode(k_string);
};

kerio.lib.k_setEngineConstants = function(k_constants) {
if (!kerio.lib.k_engineConstants) {
kerio.lib.k_engineConstants = {};
}
Ext.apply(kerio.lib.k_engineConstants, k_constants);
};

kerio.lib.k_setSharedConstants = function(k_constants) {
if (null === kerio.lib._k_sharedConstants) {
kerio.lib._k_sharedConstants = {};
}
else {
kerio.lib.k_reportError('Internal error: k_setSharedConstants() - Shared constants are already initialized', 'framework.js');
}
Ext.apply(kerio.lib._k_sharedConstants, k_constants);
};

kerio.lib.k_getSharedConstants = function(k_propertyName, k_mustExist) {
var k_constants = this._k_sharedConstants,
k_reportError = kerio.lib.k_reportError;
if (null === k_constants) {
k_reportError('Internal error: k_getSharedConstants() - Shared constants are not initialized yet!', 'kLib.js');
return null;
}
if (k_propertyName) {
k_constants = k_constants[k_propertyName];
if (undefined === k_constants && false !== k_mustExist) {
k_reportError('Internal error: k_getSharedConstants() - required constant "' + k_propertyName +'" doesn\'t exist', 'kLib.js');
}
}
return k_constants;
};

kerio.lib._k_addKerioProperty = function(k_extWidget, k_object) {
if (!k_extWidget._kx) {
k_extWidget._kx = {};
}
Ext.apply(k_extWidget._kx, k_object);
};

kerio.lib._k_isKerioWidget = function(k_widget) {
return (k_widget instanceof kerio.lib._K_BaseWidget);
};

kerio.lib._k_addEllipsisToLongWords = function (k_string, k_maxWordLength) {
var k_regExp = new RegExp('\\b|\\s');
var k_stringArray = k_string.split(k_regExp);
k_maxWordLength = k_maxWordLength || 50;
var k_word;
for (var k_i=0, k_cnt=k_stringArray.length; k_i<k_cnt; k_i++) {
k_word = k_stringArray[k_i];
if (k_word.length > k_maxWordLength) {
k_string = k_string.replace(k_word, Ext.util.Format.ellipsis(k_word, k_maxWordLength));
}
}
return k_string;
};

kerio.lib.k_addElipsis = function (k_string, k_length) {
return Ext.util.Format.ellipsis(k_string, k_length);
};

kerio.lib._k_loadImages = function () {
var k_dlg;
k_dlg = new Ext.Window({
id: 'k_dialogImagePreloader',
draggable: true,
modal: false,
resizable: true,
width: 100,
height: 100,
pageX: -10000,
pageY: -10000,
buttons: [{text: 'TestButton'}],
listeners: {
render: function () {
var
k_preloadImages = kerio.lib._k_preloadImagesList,
k_cnt = k_preloadImages.length,
k_dialogBody = this.body,
k_i;
for (k_i=0; k_i < k_cnt; k_i++) {
k_dialogBody.createChild({
tag: 'div',
style: 'background-image: url(' + kerio.lib.k_kerioLibraryRoot + k_preloadImages[k_i] + ')'
});
}
}
}
});
k_dlg.show();
};

kerio.lib.k_reportError = function(k_message, k_sourceName, k_line, k_callStack) {
if (undefined === k_line) {
k_line = 'N/A';
}
if (window.k_webAssist && k_callStack !== undefined) {
window.k_webAssist.k_callStack = k_callStack;
}
if (window.onerror) {
if (k_sourceName.lastIndexOf('.js') !== k_sourceName.length - 3) {
k_sourceName += '.js';
}
k_sourceName = document.location.protocol + '//' +document.location.host + '/' + k_sourceName;
window.onerror(k_message, k_sourceName, k_line);
}
else {
throw new Error(k_message + ' [' + k_sourceName + ':' + k_line + ']');
}
};

kerio.lib.k_setHelpHandler = function(k_helpHandler) {
kerio.lib._k_helpHandler = k_helpHandler;
};

kerio.lib._k_getPointerToObject = function(k_objectPath, k_namespace) {
var
k_pointer = null,
k_nodes,
k_i,
k_cnt,
k_startIndex;
if (undefined === k_namespace) {
k_pointer = kerio.lib;
}
else {
k_objectPath = k_namespace + '.' + k_objectPath;
}
k_nodes = k_objectPath.split('.');
if ('this' === k_nodes[0]) {
k_pointer = this;
k_startIndex = 1;
}
else {
if (k_pointer) {
k_startIndex = 0;
}
else {
k_pointer = window[k_nodes[0]];
k_startIndex = 1;
}
}
for (k_i = k_startIndex, k_cnt = k_nodes.length; k_i < k_cnt; k_i++) {
k_pointer = k_pointer[k_nodes[k_i]];
if (undefined === k_pointer) {
break;
}
}
return k_pointer;
};

kerio.lib.k_buildTooltip = function(k_text, k_isSecure) {
var k_regularExpressions = kerio.lib._k_regularExpressions;
if (!k_text) {
return '';
}
if (!k_isSecure) {
k_text = Ext.util.Format.htmlEncode(k_text);
}
else {
k_text = k_text.replace(k_regularExpressions.k_qouteRE, '&quot;');
}
k_text = k_text.replace(k_regularExpressions.k_ampRE, '&amp;');
return ' ext:qtip="' + k_text + '"';
};

kerio.lib._k_addClassName = function(k_classString, k_className) {
if (undefined === k_classString) {
return k_className;
}
if (-1 === k_classString.indexOf(k_className)) {
k_classString = '' === k_classString ? k_className : k_classString + ' ' + k_className;
}
return k_classString;
};

kerio.lib._k_removeClassName = function(k_classString, k_className) {
if (undefined === k_classString) {
return '';
}
if (-1 !== k_classString.indexOf(k_className)) {
k_classString = k_classString.replace(k_className, '');
k_classString = k_classString.replace('  ', ' ');
}
return k_classString;
};

kerio.lib._k_isContextMenuAllowed = function (k_extEvent) {
var k_isLeftButton = (0 === k_extEvent.button);
if (Ext.isIE && -1 === k_extEvent.button && 0 === k_extEvent.browserEvent.button && 'dblclick' === k_extEvent.type) {
k_isLeftButton = true;
}
if ((true === Ext.isMac) && k_isLeftButton) {
k_isLeftButton = (true !== k_extEvent.ctrlKey);
}
return !k_isLeftButton;
};

kerio.lib._k_getItemConstructor = function (k_itemType) {
var k_lib = kerio.lib,
K_Constructor;
K_Constructor = k_lib[k_lib._k_typeToConstructorMap[k_itemType]];
if (undefined === K_Constructor) {
kerio.lib.k_reportError('Internal error: undefined constructor for item type ' + k_itemType, 'kLib.js');
}
return K_Constructor;
};

kerio.lib.k_removeUndefinedProperties = function (k_sourceObject) {
return kerio.lib.k_removePropertiesBy(k_sourceObject, function(k_propertyName, k_value) {
return undefined === k_value;
});
};

kerio.lib._k_removeEmptyObjects = function(k_sourceObject) {
return kerio.lib.k_removePropertiesBy(k_sourceObject, function (k_propertyName, k_value) {
return Ext.isObject(k_value) && kerio.lib.k_isEmptyObject(k_value);
});
};

kerio.lib.k_removePropertiesBy = function (k_sourceObject, k_function) {
if (!k_sourceObject) {
return;
}
var
k_propertyName,
k_propertyValue,
k_i, k_cnt;
if (k_sourceObject instanceof Array) {
for (k_i = 0, k_cnt = k_sourceObject.length; k_i < k_cnt; k_i++) {
k_propertyValue = k_sourceObject[k_i];
if (k_function(k_i, k_propertyValue)) {
k_sourceObject.splice(k_i, 1);
}
else if (kerio.lib._k_isEnumerable(k_propertyValue)) {
kerio.lib.k_removePropertiesBy(k_propertyValue, k_function);
}
}
}
else {
for (k_propertyName in k_sourceObject) {
k_propertyValue = k_sourceObject[k_propertyName];
if (k_function(k_propertyName, k_propertyValue)) {
delete k_sourceObject[k_propertyName];
}
else if (kerio.lib._k_isEnumerable(k_propertyValue)) {
kerio.lib.k_removePropertiesBy(k_propertyValue, k_function);
}
}
}
return k_sourceObject;
};

kerio.lib.k_getLengthInBytes = function(k_str, k_forceAscii) {
var
k_charCode,
k_length = k_str.length,
k_lengthInBytes = 0,
k_i;
if (true === k_forceAscii) {
return k_length;
}
for (k_i = 0; k_i < k_length; k_i++) {
k_charCode = k_str.charCodeAt(k_i);
if (0x80 > k_charCode) { k_lengthInBytes += 1; continue;
}
if (0x800 > k_charCode) { k_lengthInBytes += 2;
continue;
}
k_lengthInBytes += 3;
}
return k_lengthInBytes;
};

kerio.lib.k_sliceInBytes = function(k_str, k_start, k_end) {
var
k_charCode,
k_length = k_str.length,
k_posInBytes = 0,
k_slice = '', k_i, k_charSize;
k_start = k_start || 0;
k_end = k_end || (0 === k_end ? 0 : Number.MAX_VALUE);
if (k_start >= k_end) {
return ''; }
for (k_i = 0; k_i < k_length; k_i++, k_posInBytes += k_charSize) {
k_charCode = k_str.charCodeAt(k_i);
if (0x80 > k_charCode) { k_charSize = 1; }
else if (0x800 > k_charCode) { k_charSize = 2;
}
else { k_charSize = 3;
}
if (k_posInBytes >= k_start) {
if ((k_posInBytes + k_charSize) > k_end) {
return k_slice; }
k_slice += k_str.charAt(k_i);
}
}
return k_slice;
};

kerio.lib._k_sortNumbers = function(k_a, k_b) {
return k_a - k_b;
};

kerio.lib._k_createScrollerElement = function () {
var
k_element,
k_innerElement;
if (!this._k_scrollerTestEl) {
k_element = document.createElement('div');
k_innerElement = document.createElement('div');
k_element.style.width = '100px';
k_element.style.height = '100px';
k_element.style.position = 'absolute';
k_element.style.top = '-100000px';
k_element.style.left = '-100000px';
k_element.style.overflow = 'scroll';
k_innerElement.style.height = '200px';
k_innerElement.style.width = '200px';
k_element.appendChild(k_innerElement);
document.body.appendChild(k_element);
this._k_scrollerTestEl = k_element;
}
};

kerio.lib.k_getScrollbarSize = function () {
if (undefined !== this._k_scrollbarSize) {
return this._k_scrollbarSize;
}
var
k_width = 100 - this._k_scrollerTestEl.clientWidth,
k_height = 100 - this._k_scrollerTestEl.clientHeight,
k_arrowHeight = k_height,
k_minThumbHeight = 10;  if (this.k_isMSIE10 || this.k_isMSIE11) {
if (navigator.userAgent.indexOf('Windows NT 6.')) {  k_arrowHeight = 2 * k_arrowHeight - 1;
k_minThumbHeight = k_width;
}
}
this._k_scrollbarSize = {
k_width: k_width,
k_height: k_height,
k_arrowHeight: k_arrowHeight,
k_minThumbHeight: k_minThumbHeight
};
return this._k_scrollbarSize;
};

kerio.lib._k_fixNewBrowsers = function () {
var	k_lib = kerio.lib;
if (true === k_lib.k_isMSIE) {
if (true === k_lib.k_isMSIE8) {
Ext.isIE8 = true;
Ext.isIE7 = false;
Ext.isIE6 = false;
}
if (true === k_lib.k_isMSIE9 || true === k_lib.k_isMSIE10) {
Ext.isIE8 = true;
Ext.isIE7 = false;
Ext.isIE6 = false;
}
if (true === k_lib.k_isMSIE11) {
Ext.isGecko = true;
}
}
if (true === k_lib.k_isSafari4 || true === k_lib.k_isSafari5 || true === k_lib.k_isSafari6) {
Ext.isSafari3 = false;
}
};

kerio.lib._k_maskElement = function(k_extElement, k_config) {
var
k_owner = k_config.k_owner,
k_topWidget = k_owner.k_getTopLevelParent(),
k_mainWidget = k_owner.k_getMainWidget(),
k_isMaskVisible = true,
k_message,
k_delay,
k_maskElement;
k_config = kerio.lib._k_createConfig(k_config, kerio.lib.k_constants.k_maskCfg);
k_message = k_config.k_message;
k_delay = k_config.k_delay;
if ('' === k_message) {
k_message = null;
}
if (true === k_config.k_keepInvisible) {
k_isMaskVisible = false;
}
else {
if (0 !== k_delay) {
kerio.lib._k_maskElementDelayed.defer(k_delay, kerio.lib, [k_extElement, k_message, k_owner, k_topWidget]);
k_message = null;  k_isMaskVisible = false;
}
}
if (k_extElement) {
k_maskElement = k_extElement.mask(null);  k_extElement._k_maskCount = undefined === k_extElement._k_maskCount ? 1 : k_extElement._k_maskCount + 1;
if (k_topWidget && k_topWidget.k_showLoading) {
k_topWidget._k_maskCount = undefined === k_topWidget._k_maskCount ? 1 : k_topWidget._k_maskCount + 1;
}
if (false === k_isMaskVisible) {
k_maskElement.addClass('invisible');
}
if (k_mainWidget && k_extElement !== k_mainWidget.k_extWidget.getEl()) {
if (!k_mainWidget._k_maskedElements) {
k_mainWidget._k_maskedElements = [];
}
k_mainWidget._k_maskedElements.push({k_extElement: k_extElement, k_owner: k_owner});
}
}
};

kerio.lib.k_maskWidget = function(k_widget, k_config) {
var
k_extElement = k_widget.k_extWidget.getEl(),
k_topLevelParent,
k_currentItem;
k_config = k_config || {};
k_config.k_owner = k_widget;
kerio.lib._k_maskElement(k_extElement, k_config);
if (k_widget._k_focusManager) {
k_widget._k_focusManager.k_deactivate();
}
else {
k_topLevelParent = k_widget.k_getTopLevelParent();
if (k_topLevelParent && k_topLevelParent._k_focusManager) {
k_currentItem = k_topLevelParent._k_focusManager._k_getCurrentItem();
k_currentItem = k_currentItem && k_currentItem._kx && k_currentItem._kx.k_owner;
if (k_currentItem && -1 !== k_currentItem.k_getFullPath().indexOf(k_widget)) {
k_topLevelParent._k_focusManager._k_focusNextItem();
}
}
}
};

kerio.lib._k_maskElementDelayed = function(k_extElement, k_message, k_owner, k_topWidget) {
if (k_extElement && true !== k_extElement.isMasked()) {
return;  }
if (k_topWidget) {
if (k_topWidget.k_showLoading) {
k_topWidget.k_showLoading(k_message, true);
}
else {
kerio.lib.k_reportError('Internal Error: An owner of the masked element has to have method k_showLoading implemented.', 'kLib.js');
}
}
};

kerio.lib._k_unmaskElement = function(k_extElement, k_owner) {
if (!k_extElement) {
return;
}
var
k_topWidget = k_owner.k_getTopLevelParent(),
k_mainWidget = k_owner.k_getMainWidget();
k_extElement._k_maskCount = undefined === k_extElement._k_maskCount ? 0 : k_extElement._k_maskCount - 1;
if (k_mainWidget && k_mainWidget._k_maskedElements && k_extElement !== k_mainWidget.k_extWidget.getEl()) {
k_mainWidget._k_maskedElements.remove({k_extElement: k_extElement, k_owner: k_owner});
}
if (0 >= k_extElement._k_maskCount) {
k_extElement._k_maskCount = 0;
k_extElement.unmask();
}
if (k_topWidget) {
if (k_topWidget.k_showLoading) {
k_topWidget._k_maskCount = undefined === k_topWidget._k_maskCount ? 0 : k_topWidget._k_maskCount - 1;
if (0 >= k_topWidget._k_maskCount) {
k_topWidget._k_maskCount = 0;
k_topWidget.k_showLoading('', false);
}
}
else {
kerio.lib.k_reportError('Internal Error: An owner of the masked element has to have method k_showLoading implemented.', 'kLib.js');
}
}
};

kerio.lib.k_unmaskWidget = function(k_widget) {
var	k_extElement = k_widget.k_extWidget.getEl();
kerio.lib._k_unmaskElement(k_extElement, k_widget);
if (k_widget._k_focusManager) {
k_widget._k_focusManager.k_activate();
}
};

kerio.lib._k_unmaskNestedWidgets = function(k_mainWidget) {
var k_nestedWidget;
while (k_mainWidget._k_maskedElements && k_mainWidget._k_maskedElements.length > 0) {
k_nestedWidget = k_mainWidget._k_maskedElements[0];
kerio.lib._k_unmaskElement(k_nestedWidget.k_extElement, k_nestedWidget.k_owner);
k_mainWidget._k_maskedElements.remove(k_nestedWidget);
}
};

kerio.lib.k_getViewport = function() {
return kerio.lib._k_windowManager._k_mainLayout;
};

kerio.lib._k_extendObjectPrototypeObject = function (k_class, k_objectName, k_extensions) {
return  kerio.lib.k_cloneObject(k_class.prototype[k_objectName], k_extensions);
};

kerio.lib._k_extendPropertiesMapping = function (k_superclass, k_mapping) {
return kerio.lib._k_extendObjectPrototypeObject(k_superclass, '_k_propertiesMapping', k_mapping);
};

kerio.lib._k_extendPropertiesDefault = function (k_superclass, k_defaults) {
return kerio.lib._k_extendObjectPrototypeObject(k_superclass, '_k_propertiesDefault', k_defaults);
};

kerio.lib.k_registerType = function(k_config) {
kerio.lib._k_typeToConstructorMap[k_config.k_type] = k_config.k_constructorName;
kerio.lib[k_config.k_constructorName] = k_config.k_constructor;
};

kerio.lib._k_showLoading = function(k_config) {
var
k_owner = k_config.k_owner,
k_loadingEl = k_owner._k_loadingEl,
k_element = k_config.k_element,
k_size = k_element.getSize(),
k_show = k_config.k_show,
k_width;
if (!k_loadingEl) {
if (false === k_show) {
return;  }
k_loadingEl = k_element.createChild({
tag: 'div',
cls: k_config.k_className,
children: [{
tag: 'span',
cls: 'loadingHeaderText'
}]
});
k_owner._k_loadingEl = k_loadingEl;
}
if (k_show) {
k_loadingEl.dom.style.display = 'block';
k_loadingEl.dom.firstChild.innerHTML = k_config.k_message;
k_width = Ext.get(k_loadingEl.dom.firstChild).getWidth();
k_loadingEl.setWidth(k_width);
k_loadingEl.dom.style.left = (k_size.width - k_width) / 2 + 'px';
}
else {
k_loadingEl.setWidth('auto');
k_loadingEl.dom.style.display = 'none';
}
};

kerio.lib.k_getActiveDialog = function (k_ignoreMessageBox) {
return kerio.lib._k_windowManager.k_getActiveWindow(k_ignoreMessageBox);
};

kerio.lib._k_getKeyEventName = function () {
return Ext.EventManager.useKeydown || (Ext.isGecko && Ext.isMac && kerio.lib.k_isFirefox25Plus) ? 'keydown' : 'keypress';
};

kerio.lib.k_setSettings = function (k_settings, k_appSettingsRoot) {
this._k_settings = Ext.apply(this._k_settings || {}, {
k_guiSettings: this.k_cloneObject(k_settings),
k_root: k_appSettingsRoot || 'admin'
});
this.k_isStateful = true;
};

kerio.lib.k_getSettings = function (k_settingsId) {
var
k_lib = kerio.lib,
k_settings = k_lib._k_settings ? k_lib._k_settings.k_guiSettings || {} : {};
k_settings = k_settings[k_lib._k_settings.k_root] || {};
return k_settings[k_settingsId] || null;
};

kerio.lib.k_addCustomSettings = function (k_settings) {
var k_lib = kerio.lib;
if (!k_lib._k_settings) {
k_lib._k_settings = {};
}
k_lib._k_settings.k_custom = k_lib.k_cloneObject(k_lib._k_settings.k_custom || {}, k_settings);
};

kerio.lib.k_removeCustomSettings = function (k_objPath) {
var k_lib = kerio.lib;
if (!k_lib._k_settings || (k_lib._k_settings && !k_lib._k_settings.k_custom)) {
return;
}
var
k_propertyName,
k_obj;
k_objPath = k_objPath.split('.');
k_propertyName = k_objPath.pop();
k_objPath = k_objPath.join('.');
k_obj = k_lib._k_getPointerToObject(k_objPath, 'kerio.lib._k_settings.k_custom');
delete k_obj[k_propertyName];
};

kerio.lib.k_saveSettings = function (k_config) {
var
k_lib = kerio.lib,
k_settings;
if (true !== k_lib.k_isStateful) {
if (k_config.k_callback) {
k_config.k_callback.call(k_config.k_scope || window);
}
return;
}
k_settings = this._k_prepareSettings(k_config.k_widget);
if (null === k_settings) { if (k_config.k_callback) {
k_config.k_callback.call(k_config.k_scope || window);
}
return;
}
k_lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Session.setSettings',
params: k_settings
},
k_requestOwner: null,
k_onError: k_lib._k_saveSettingsOnError,
k_callback: k_lib._k_saveSettingsCallback,
k_callbackParams: {
k_callback: k_config.k_callback,
k_scope: k_config.k_scope,
k_widget: k_config.k_widget
}
});
};

kerio.lib._k_saveSettingsCallback = function (k_response, k_success, k_callbackParams) {
if (k_callbackParams.k_callback) {
k_callbackParams.k_callback.call(k_callbackParams.k_scope || window);
}
kerio.lib.k_saveSettingsCallback.call(k_callbackParams.k_widget, k_callbackParams.k_widget);
};

kerio.lib.k_saveSettingsCallback = function (k_widget) {};

kerio.lib._k_saveSettingsOnError = function () {
return true;
};

kerio.lib._k_prepareSettings = function (k_widget) {
var
k_lib = kerio.lib,
k_widgetSettings = k_lib.k_getWidgetSettings(k_widget),
k_customSettings = k_lib._k_removeEmptyObjects(k_lib.k_cloneObject(k_lib._k_settings.k_custom)),
k_settings = {};
if (k_lib.k_isEmpty(k_widgetSettings) && k_lib.k_isEmpty(k_customSettings)) {
return null;
}
k_settings[k_lib._k_settings.k_root] = k_widgetSettings;
if (!k_lib._k_settings.k_guiSettings) {
k_lib._k_settings.k_guiSettings = {};
}
k_lib._k_settings.k_guiSettings[k_lib._k_settings.k_root] = Ext.apply(
k_lib._k_settings.k_guiSettings[k_lib._k_settings.k_root] || {},
k_widgetSettings
);
if (k_customSettings) {
k_settings = k_lib.k_cloneObject(k_settings, k_customSettings);
delete k_lib._k_settings.k_custom;
}
return {
settings: k_settings
};
};

kerio.lib.k_saveLocalSettings = function (k_widget) {
kerio.lib._k_prepareSettings(k_widget);
};

kerio.lib.k_getWidgetSettings = function (k_widget) {
var k_settings = kerio.lib._k_getWidgetSettings(k_widget.k_extWidget);
return k_settings;
};

kerio.lib._k_getWidgetSettings = function (k_extWidget, k_settings) {
var
k_items = k_extWidget.items,
k_widgetSettings,
k_widget,
k_item,
k_i, k_cnt;
if (!k_settings) {
k_settings = {};
}
k_widget = k_extWidget._kx && k_extWidget._kx.k_owner;
if (k_widget && k_widget._k_isStateful) {
k_widgetSettings = k_widget.k_getSettings();
if (null !== k_widgetSettings) {
k_settings[k_widget.k_getSettingsId()] = k_widgetSettings;
}
}
if (k_items) {
for (k_i = 0, k_cnt = k_items.getCount(); k_i < k_cnt; k_i++) {
k_item = k_items.itemAt(k_i);
kerio.lib._k_getWidgetSettings(k_item, k_settings);
}
}
return k_settings;
};

kerio.lib.k_isEmpty = function (k_value) {
if (!Ext.isObject(k_value)) {
return Ext.isEmpty(k_value);
}
return kerio.lib.k_isEmptyObject(k_value);
};

kerio.lib.k_isEmptyObject = function (k_object) {
var	k_propertyName;
for (k_propertyName in k_object) {
if (k_object.hasOwnProperty(k_propertyName)) {
return false;
}
}
return true;
};

kerio.lib.k_getZoom = function() {
var
k_zoom,
k_rect;
if (this.k_browserInfo.k_isMobileDevice()) {
return k_zoom; }
if (window.devicePixelRatio) {
k_zoom = window.devicePixelRatio * 100;
}
else if (this.k_isMSIE) {
k_zoom = window.screen.deviceXDPI / window.screen.logicalXDPI * 100;
}
if (k_zoom) {
k_zoom = parseInt(k_zoom, 10);
}
return k_zoom;
};

kerio.lib._k_resizeDialogs = function (k_viewportWidth, k_viewportHeight) {
var
k_opennedWindows = kerio.lib._k_windowManager._k_stack,
k_cnt = k_opennedWindows.getCount(),
k_win,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_win = k_opennedWindows.itemAt(k_i);
if (k_win.k_isInstanceOf('K_Dialog')) {
k_win._k_fixDialogSizeAndPos({width: k_viewportWidth, height: k_viewportHeight});
}
}
};

kerio.lib._k_fixJson = function() {
var k_function;
if (this._k_isBuggyJson()) {
k_function = this._extPublished['Ext.util.JSON.doEncode'];
Ext.encode = k_function;
Ext.util.JSON.encode = k_function;
}
};

kerio.lib._k_isBuggyJson = function () {
var
k_result = false,
k_input;
if (this.k_isMSIE8) {
k_input = document.createElement('input');
k_input.type = 'text';
document.body.appendChild(k_input);
if (window.JSON && JSON.stringify({x: k_input.value}).indexOf('null') > 0) {
k_result = true;
}
document.body.removeChild(k_input);
k_input = null;
}
else if (this.k_isSafari && !this.k_browserInfo.k_isMobileDevice()) {
k_result = true;
}
return k_result;
};

kerio.lib._k_fixScrollbars = function (k_element) {
if (k_element && 'auto' === k_element.getStyle('overflow-y')) {
k_element.setStyle('overflow-y', 'hidden');
k_element.setStyle.defer(10, k_element, ['overflow-y', 'auto']);
}
};

kerio.lib.k_parseTranslations = function (k_translationString) {
k_translationString = k_translationString.substr('kerio.lib.k_translation = '.length);
k_translationString = k_translationString.substr(0, k_translationString.lastIndexOf('}') + 1);
try {
kerio.lib.k_translation = Ext.decode(k_translationString);
if (kerio.lib.k_translation.k_currentLanguage) {
kerio.lib.k_setEngineConstants({k_CURRENT_LANGUAGE: kerio.lib.k_translation.k_currentLanguage});
}
}
catch (k_ex) {
kerio.lib.k_reportError('Internal error: Error during translation file parsing', 'kLib.js', k_ex.lineNumber, k_ex.stack);
}
};

kerio.lib.k_escapeRe = function (k_str) {
return Ext.escapeRe(k_str);
};

kerio.lib._k_iPadAdapter = function() {
var
k_metaTags = document.getElementsByTagName('meta'),
k_zoom,
k_i, k_cnt;
Ext.grid.EditorGridPanel.prototype.clicksToEdit = 1;
Ext.Viewport.prototype.fireResize = function (w, h) {
if (Math.abs(Ext.getBody().getHeight() - h) <= 2) {
this.fireEvent('resize', this, w, h, w, h);
}
};
if (this.k_isIPad) {
k_zoom = 1 === window.devicePixelRatio ? 1.4 : 1.2;  for (k_i = 0, k_cnt = k_metaTags.length; k_i < k_cnt; k_i++) {
if (k_metaTags[k_i] && 'viewport' === k_metaTags[k_i].name) {
k_metaTags[k_i].content = 'width=548' + ', initial-scale='+ k_zoom +
', minimum-scale=' + k_zoom + ', maximum-scale=' + k_zoom + ', user-scalable=no';
break;
}
}
}
};

kerio.lib._k_isLandscapeMode = function () {
return 90 === Math.abs(window.orientation);
};

kerio.lib.k_log = function (k_message, k_logType) {
var k_console = window.console;
if (k_console) {
k_logType = k_logType in k_console ? k_logType : 'log';
k_console[k_logType](k_message);
}
};

kerio.lib.k_warn = function (k_message) {
kerio.lib.k_log(k_message, 'warn');
};

kerio.lib.k_info = function (k_message) {
kerio.lib.k_log(k_message, 'info');
};

kerio.lib.k_todo = function (k_message) {
if (this._k_debugMode && !this._k_todos[k_message]) {
this._k_todos[k_message] = 1;
kerio.lib.k_log('TODO: ' + k_message, 'warn');
}
};

kerio.lib.k_openWindow = function(k_url, k_name, k_specs, k_replace) {
var
k_window = window.open(k_url, k_name, k_specs || '', k_replace),
k_link = k_url,
k_pos;
if (!k_window && kerio.lib.k_isSafari) {
if (-1 !== (k_pos = k_url.indexOf('?'))) {
k_link = k_link.substr(0, k_pos);
}
k_link = '<a href="' + k_url + '" target="_blank">' + k_link + '<\/a>';
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Warning', 'wlibAlerts'),
k_msg: kerio.lib.k_tr('Your browser prevented this site from opening a popup window. You can click the link to show the blocked window:', 'wlibAlerts')
+ '<br><p style="text-align:center; padding:10px 0; margin-left:-47px">' + k_link + '<\/p>', k_icon: 'warning'
});
}
return k_window;
};

kerio.lib.k_getUrlParams = function(k_search) {
var
k_searchString = k_search || document.location.search,
k_output = {},
k_params,
k_i,
k_splittedItem;
k_searchString = k_searchString.replace('?', '');
if (!k_searchString) {
return k_output;
}
k_params = k_searchString.split('&');
for (k_i = 0; k_i < k_params.length; k_i++) {
k_splittedItem = k_params[k_i].split('=');
k_output[k_splittedItem[0]] = k_splittedItem[1];
}
return k_output;
};

kerio.lib.k_getHash = function() {
var
k_hash = document.location.hash;
if (!k_hash) {
return '';
}
return '#' + encodeURIComponent(k_hash.substr(1));
};

kerio.lib._k_createFinallySequence = function(k_originalFn, k_newFn, k_scope) {
if (!k_newFn) {
return k_originalFn;
}
else {
return function() {
var k_result;
try {
k_result = k_originalFn.apply(this, arguments);
}
finally {
k_newFn.apply(k_scope || this, arguments);
}
return k_result;
};
}
};

kerio.lib._k_init();