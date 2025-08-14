
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
k_webAssist = {};
window['k' + '_webAssist'] = k_webAssist;  
k_webAssist.k_init = function (k_config) {
this.k_productName = k_config.k_productName;
this.k_version = '9.4.5-8629';
this.k_module = k_config.k_module;
this.k_userAgent = navigator.userAgent;
this.k_platform = navigator.platform;
this.k_serverOs = k_config.k_serverOs;
this.k_language = k_config.k_language;
this.k_email = k_config.k_email || '';
this.k_isEnabled = k_config.k_isEnabled;
this.k_resolution = screen.width + 'x' + screen.height;
if (navigator.oscpu !== undefined) {
this.k_platform += ' ' + navigator.oscpu;
}
this.k_detectedBrowser = this.k_getBrowserInfo();
this.k_isSwitchOffPossible = false;
this.k_switchOffUrl = '';
this.k_startTime = new Date().getTime();
this.k_callStack = '';
this.k_cookieName = 'wa2userEmail';
if (this.k_detectedBrowser.indexOf('Safari') !== -1 && !this.k_email) {
this.k_email = this.k_getCookie();
}
this.k_browserSpeed = -1;
this.k_previousWidgetId = '';
this.k_externalError = '';
this.k_customAppData = {reportsCount: 0};
this.k_appCallback = {k_function: null, k_scope: null};
window.onerror = this.k_onErrorHandler;
};
var k_iconImg = 'data:image/png;base64,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';
var k_array = [
'<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">',
'<html>',
'<head>',
'	<meta http-equiv="content-type" content="text/html; charset=utf-8">',
'	<style type="text/css">',
'		html {',
'			height: 100%;',
'		}',
'		body {',
'			width: 100%;',
'			height: 100%;',
'			background-color: #D0DEF0;',
'			margin: 0;',
'			line-height: 13px;',
'		}',
'		body, input, textarea, button {',
'			font-family: tahoma,arial,sans-serif;',
'			font-size: 11px;',
'		}',
'		textarea {resize: none}',
'		input, textarea {',
'			background-color: white;',
'			margin: 0;',
'		}',
'		p {margin: 0}',
'		.textField {',
'			border: 1px solid #B5B8C8;',
'			width:100%;',
'			margin-bottom: 7px;',
'			height: 18px;',
'			line-height: 13px;',
'			vertical-align: top;',
'			padding:0;',
'		}',
'		#userComment {',
'			height: 55px;',
'		}',
'		.textFieldLabel {',
'			padding-bottom: 4px;',
'			_padding-bottom: 3px;',
'			display: block;',
'		}',
'		#k_switchOffWebAssist {',
'			width:15px;',
'			height:15px;',
'		}',
'		div.text {',
'			margin-bottom: 10px;',
'		}',
'		form {',
'			margin: 0px;',
'		}',
'		.buttons INPUT,',
'		.buttons button{',
'			margin-top: 11px;',
'			background-color: #E5E7ED;',
'			height: 20px;',
'			padding: 0 6px 3px 6px;',
'			min-width: 82px;',
'			width: auto;',
'		}',
'		.dialogContent {',
'			padding: 5px 5px 0 5px;',
'		}',
'		.formContainer {width: 100%;}',
'		.formContent {',
'			padding: 10px;',
'			background-color: white;',
'			border:1px solid #99BBE8;',
'			box-sizing: border-box;',
'			-webkit-box-sizing: border-box;',
'		}',
'		.formContent P,',
'		.formContent LABEL {',
'			line-height: 13px;',
'		}',
'		.dialogHeader {',
'			background-color: #D0DEF0;',
'			color: #15428B;',
'			width: 100%;',
'			font-weight: bold;',
'			padding-top: 0px;',
'			padding-bottom: 5px;',
'		}',
'		#detailInfo {',
'			width: 100%;',
'			margin: 0px;',
'			padding: 0px;',
'			text-overflow: auto;',
'			border: 1px solid #B5B8C8;',
'			box-sizing: border-box;',
'			-webkit-box-sizing: border-box;',
'		}',
'		.detailInfoContent {',
'			padding: 10px;',
'			background-color: white;',
'			border: 1px solid #99BBE8',
'		}',
'		.infoIcon {',
'			display: inline-block;',
'			vertical-align: text-bottom;',
'			padding-right: 5px;',
'			width: 16px;',
'			height:16px;',
'			background-image: url(' , k_iconImg, ');',
'			background-size: 16px 16px;',
'			background-repeat: no-repeat;',
'		}',
'		.infoRow {',
'			padding-top: 3px;',
'		}',
'	</style>',
'	<script type=\'text/javascript\'>',
'		function k_hideIframe() {',
'			var k_iframe = window.parent.document.getElementById(\'webAssist\');',
'			var k_mask = window.parent.document.getElementById(\'webAssistMask\');',
'			k_mask.style.display = \'none\';',
'			if ((k_iframe !== null) && (k_iframe !== undefined)) {',
'				k_iframe.style.display = \'none\';',
'			}',
'			if (!window.parent.k_webAssist.k_isHidden) {',
'				window.parent.k_webAssist.k_isActive = false;',
'			}',
'			if (window.isReportSent) {',
'				alert(\'Thank you for report.\');',
'			}',
'			try {',
'				k_iframe.blur();',
'			}',
'			catch (k_e_hideIframe) {',
'			}',
'		}',
'		function k_dontSendOnClick() {',
'			if (window.top != window) {',
'				k_hideIframe();',
'				window.parent.k_webAssist.k_isHidden = true;',
'			}',
'			else {',
'				window.close();',
'			}',
'		}',
'		function k_beforeWindowClose() {',
'			if (window.opener && window.opener.k_webAssist) {',
'				window.opener.k_webAssist.k_isActive = false;',
'			}',
'		}',
'		function k_setCookie() {',
'			k_webAssist.k_email = document.getElementById(\'userEmail\').value;',
'			if (k_webAssist.k_detectedBrowser.indexOf(\'Safari\') !== -1) {',
'				k_webAssist.k_setCookie();',
'			}',
'		}',
'		function k_focusDescription() {',
'			document.getElementById(\'userComment\').focus();',
'		}',
'	</script>',
'</head>',
'<body onunload="if (window.top != window) {k_hideIframe();} else {k_beforeWindowClose();}" onbeforeunload="if (window.top==window) k_beforeWindowClose();" onload="k_focusDescription();">',
'	<div id="mainWindow" class="dialogContent">',
'		<div class="dialogHeader" id="dialogHeader"></div>',
'		<div class="formContainer">',
'			<form action="https://assist.kerio.com/assist/index.php" method="POST">',
'				<div class="formContent" id="formContent">',
'					<div class="text" id="topDescription"></div>',
'					<label class="textFieldLabel" for="userComment" autofocus>What were you doing when the problem happened? (optional)</label>',
'					<textarea class="textField" id="userComment" name="userComment"></textarea>',
'					<label class="textFieldLabel" for="userEmail">Email address (optional):</label>',
'					<input class="textField" type="text" id="userEmail" name="userEmail">',
'					<p id="switchOffContainer"><input type="checkbox" onclick="k_webAssist.k_switchOff();" id="k_switchOffWebAssist"> <label for="k_switchOffWebAssist">Do not report problems in future.</label></p>',
'					<p id="switchOffText" style="display:none">Error reporting cannot be turned off in this version. <input type="checkbox" style="visibility: hidden"></p>',
'				</div>',
'				<div class="buttons">',
'					<table style="width: 100%">',
'					<tr>',
'					<td align="left">',
'						<button onclick="k_webAssist.k_showDetails(window.document); return false">Show Data</button>',
'					</td>',
'					<td align="right">',
'						<button type="submit" onclick="window.isReportSent = true;k_setCookie();" style="margin-right: 5px;">Send Report</button>',
'						<button type="button" onclick="k_dontSendOnClick(); return false">Cancel</button>',
'					</td>',
'					</tr>',
'					</table>',
'				</div>',
'				<input type="hidden" name="productName" id="productName">',
'				<input type="hidden" name="version" id="version">',
'				<input type="hidden" name="module" id="module">',
'				<input type="hidden" name="userAgent" id="userAgent">',
'				<input type="hidden" name="platform" id="platform">',
'				<input type="hidden" name="serverOs" id="serverOs">',
'				<input type="hidden" name="language" id="language">',
'				<input type="hidden" name="resolution" id="resolution">',
'				<input type="hidden" name="zoom" id="zoom">',
'				<input type="hidden" name="detectedBrowser" id="detectedBrowser">',
'				<input type="hidden" name="errorMessage" id="errorMessage">',
'				<input type="hidden" name="url" id="url">',
'				<input type="hidden" name="line" id="line">',
'				<input type="hidden" name="callStack" id="callStack">',
'				<input type="hidden" name="activeDialogId" id="activeDialogId">',
'				<input type="hidden" name="navigationItemId" id="navigationItemId">',
'				<input type="hidden" name="windowSize" id="windowSize">',
'				<input type="hidden" name="runTime" id="runTime">',
'				<input type="hidden" name="developerToolActive" id="developerToolActive">',
'				<input type="hidden" name="browserSpeed" id="browserSpeed">',
'				<input type="hidden" name="previousWidgetId" id="previousWidgetId">',
'				<input type="hidden" name="customAppData" id="customAppData">',
'			</form>',
'		</div>',
'	</div>',
'	<div id="detailsWindow" style="display:none" class="dialogContent">',
'		<div class="dialogHeader" id="detailsHeader">Problem Details</div>',
'		<div class="formContainer">',
'			<div class="detailInfoContent">',
'				<textarea id="detailInfo" readonly></textarea>',
'			</div>',
'			<div class="buttons" id="detailsFooter">',
'				<table style="width: 100%">',
'				<tr>',
'				<td align="right">',
'					<button onclick="k_webAssist.k_closeDetails(window.document);">Back</button>',
'				</td>',
'				</tr>',
'				</table>',
'			</div>',
'		</div>',
'	</div>',
'</body>',
'</html>'
];
k_webAssist.k_windowContent = k_array.join('\n');

k_webAssist.isCallstackSupported = (function() {
var a;
try {
a();
}
catch (ex) {
return !!ex.stack;
}
}());

k_webAssist.k_stackRe = (function() {
return window.opera ? new RegExp('\\)@(.*):(\\d+)') : new RegExp('\\((.*):(\\d+):(\\d+)\\)');
}());

k_webAssist.k_getErrorInfo = function(k_ex) {
var
k_err = null,
k_firstCallIdx,
k_stackLines,
k_message,
k_lineNumber,
k_columnNumber,
k_fileName,
k_errorOrigin;
if (undefined !== k_ex.lineNumber || undefined !== k_ex.line || !k_ex.stack) {
k_message = k_ex.message;
k_fileName = k_ex.fileName || k_ex.sourceURL;
k_lineNumber = k_ex.lineNumber || k_ex.line;
k_columnNumber = k_ex.columnNumber || k_ex.colno;
}
else {
k_stackLines = k_ex.stack.split('\n');
if (window.opera) {
k_message = k_ex.message;
k_firstCallIdx = 0;
}
else {
k_message = k_stackLines[0];
k_firstCallIdx = 1;
}
k_errorOrigin = k_webAssist.k_parseErrorOrigin(k_stackLines, k_firstCallIdx, true);
if (k_errorOrigin) {
k_fileName = k_errorOrigin.k_fileName;
k_lineNumber = k_errorOrigin.k_lineNumber;
k_columnNumber = k_errorOrigin.k_columnNumber;
}
}
if (k_fileName || k_lineNumber) {
k_err = {
k_message     : k_message,     k_exMessage   : k_ex.message,  k_fileName    : k_fileName,
k_lineNumber  : k_lineNumber,
k_columnNumber: k_columnNumber,
k_stack       : k_ex.stack
};
}
return k_err;
};

k_webAssist.k_parseErrorOrigin = function(k_stackLines, k_firstCallIdx, k_tryNextLine) {
var k_errorOrigin;
if (k_stackLines.length > k_firstCallIdx && k_stackLines[k_firstCallIdx].match(k_webAssist.k_stackRe)) {
k_errorOrigin = {
k_fileName: RegExp.$1,
k_lineNumber: parseInt(RegExp.$2, 10),
k_columnNumber: parseInt(RegExp.$3, 10)
};
}
else if (k_tryNextLine) {
k_errorOrigin = k_webAssist.k_parseErrorOrigin(k_stackLines, k_firstCallIdx + 1, false);
}
return k_errorOrigin;
};

k_webAssist.KerioException = function(k_ex) {
var
k_errorInfo = k_webAssist.k_getErrorInfo(k_ex),
k_tmp;
if (!k_errorInfo) {
return k_ex;
}
k_tmp = Error.call(this);
k_webAssist.k_errorInfo = k_errorInfo;
this.name         = 'KerioException';
this.message      = k_errorInfo.k_message;
this.fileName     = k_errorInfo.k_fileName;
this.lineNumber   = k_errorInfo.k_lineNumber;
this.columnNumber = k_errorInfo.k_columnNumber;
this.stack = k_ex.stack;
this.k_backupStack = k_ex.stack;  };
k_webAssist.KerioException.prototype = new Error();
k_webAssist.KerioException.prototype.constructor = k_webAssist.KerioException;

k_webAssist.buildException = function(ex) {
if (ex instanceof Error && ex.stack && !(ex instanceof window.k_webAssist.KerioException)) {
ex = new window.k_webAssist.KerioException(ex);
}
return ex;
};
k_webAssist.k_buildErrorInfo = function(k_message, k_url, k_line, k_colno, k_error) {
var
k_errorInfo = {  k_message: k_message,
k_url    : k_url,
k_line   : k_line
},
k_appErrorInfo = k_webAssist.k_errorInfo,
k_errMessage;
if (k_error && k_error instanceof k_webAssist.KerioException) {
k_errorInfo = {
k_message  : k_error.message,
k_url      : k_error.fileName,
k_line     : k_error.lineNumber,
k_colno    : k_error.columnNumber,
k_callStack: k_error.k_backupStack || k_error.stack
};
}
else if (k_appErrorInfo) {
k_errMessage = k_appErrorInfo.k_message;
if (k_errMessage && (-1 !== k_message.indexOf(k_errMessage) || -1 !== k_appErrorInfo.k_exMessage.indexOf(k_message))) {
k_errorInfo = {
k_message: k_errMessage,
k_url      : k_appErrorInfo.k_fileName,
k_line     : k_appErrorInfo.k_lineNumber,
k_colno    : k_appErrorInfo.k_columnNumber,
k_callStack: k_appErrorInfo.k_stack
};
}
}
delete k_webAssist.k_errorInfo;
if (!k_errorInfo.k_callStack) {
k_errorInfo.k_callStack = k_webAssist.k_callStack || (k_error && k_error.k_backupStack) || (k_error && k_error.stack) || '';
}
return k_errorInfo;
};

k_webAssist.k_getBrowserZoom = function () {
var k_zoom = kerio.lib.k_getZoom();
return (undefined === k_zoom) ? "unknow" : k_zoom;
};

k_webAssist.k_getBrowserInfo = function() {
var k_browserInfo = kerio.lib.k_browserInfo._k_getBrowserInfo();
return k_browserInfo.k_name + ' ' + k_browserInfo.k_version;
};

k_webAssist.k_afterLoad = function(k_config) {
if (k_config.k_isEnabled === false) {
window.onerror = function(){};
}
if (k_config.k_version) {
this.k_version = k_config.k_version;
}
if (k_config.k_serverOs !== undefined) {
this.k_serverOs = k_config.k_serverOs;
}
if (k_config.k_language !== undefined) {
this.k_language = k_config.k_language;
}
this.k_switchOffUrl = k_config.k_switchOffUrl;
this.k_token = k_config.k_token;
if (k_config.k_email) {
this.k_email = k_config.k_email;
}
if (k_config.k_isSwitchOffPossible !== undefined) {
this.k_isSwitchOffPossible = k_config.k_isSwitchOffPossible;
}
};

k_webAssist.k_getActiveDialog = function() {
var
k_dialogInfo;
k_dialogInfo = kerio.lib.k_getActiveDialog();
if ((k_dialogInfo !== null) && (k_dialogInfo !== undefined)) {
return k_dialogInfo.k_id;
}
else {
return 'desktop';
}
};

k_webAssist.k_getNavigationItemId = function() {
if (window.kerio && kerio.adm && kerio.adm.k_framework && kerio.adm.k_framework._k_lastWidget) {
return kerio.adm.k_framework._k_lastWidget.k_id;
}
else {
return 'unknown';
}
};

k_webAssist.k_getBrowserSpeed = function() {
return kerio.lib.k_browserSpeed;
};

k_webAssist.k_getPreviousWidgetId = function() {
if (window.kerio && kerio.adm && kerio.adm.k_framework) {
return kerio.adm.k_framework._k_previousWidgetId;
}
else {
return 'unknown';
}
};

k_webAssist.k_convertCustomDataToString = function(k_metadata) {
var k_metaDataAsString;
if (!k_metadata) { return '';
}
if (window.Ext && window.Ext.encode) {
try {
k_metaDataAsString = Ext.encode(k_metadata);
}
catch (k_extEncode) {
k_metaDataAsString = 'unknown';
}
return k_metaDataAsString;
}
if (window.JSON && window.JSON.stringify) {
try {
k_metaDataAsString = window.JSON.stringify(k_metadata);
}
catch (k_nativeEncode) {
k_metaDataAsString = 'unknown';
}
return k_metaDataAsString;
}
return 'unknown';
};

k_webAssist.k_onErrorHandler = function(k_message, k_url, k_line, k_colno, k_error) {
var
k_showInFrame = true,
k_errorInfo = k_webAssist.k_buildErrorInfo(k_message, k_url, k_line, k_colno, k_error),
k_currentTime;
k_message = k_errorInfo.k_message;
k_url = k_errorInfo.k_url;
k_line = k_errorInfo.k_line;
k_colno = k_errorInfo.k_colno;
k_url = k_webAssist.k_formatUrl(k_message, k_url, k_line);
if (null === k_url) {
return;
}
if (k_webAssist.k_isActive) {
return;
}
k_webAssist.k_customAppData.reportsCount++;
k_webAssist.k_message = k_message;
k_webAssist.k_url = k_url;
k_webAssist.k_line = k_line;
if (!k_webAssist.k_callStack) {
k_webAssist.k_callStack = k_errorInfo.k_callStack;
}
try {
k_webAssist.k_zoom = k_webAssist.k_getBrowserZoom();
}
catch (k_e_k_zoom) {
k_webAssist.k_zoom = 'unknown';
}
try {
k_webAssist.k_activeDialogId = k_webAssist.k_getActiveDialog();
}
catch (k_e_dialog) {
k_webAssist.k_activeDialogId = 'unknown';
}
try {
k_webAssist.k_navigationItemId = k_webAssist.k_getNavigationItemId();
}
catch (k_e_nav) {
k_webAssist.k_navigationItemId = 'unknown';
}
try {
if (document.body) {
k_webAssist.k_windowSize = document.body.clientWidth + 'x' + document.body.clientHeight;
}
else {
k_webAssist.k_windowSize = 'unknown';
}
}
catch (k_e_win) {
k_webAssist.k_windowSize = 'unknown';
}
k_currentTime = new Date().getTime();
k_webAssist.k_runTime = Math.round((k_currentTime - k_webAssist.k_startTime) / 1000);
try {
k_webAssist.k_developerToolActive = (undefined === window.console ? 'No' : 'Yes');
}
catch (k_e_devel) {
k_webAssist.k_developerToolActive = 'unknown';
}
try {
if (k_webAssist.k_callStack) {
k_webAssist.k_reformatCallstack();
}
if (k_webAssist.k_externalError) {
k_webAssist.k_callStack = k_webAssist.k_externalError + '\n' + (k_webAssist.k_callStack || '');
k_webAssist.k_externalError = '';
}
}
catch (k_e_callStack) {
}
try {
if (kerio && kerio.lib) {
k_webAssist.k_browserSpeed = k_webAssist.k_getBrowserSpeed();
}
}
catch (k_e_browserSpeed) {
k_webAssist.k_browserSpeed = -1;
}
try {
k_webAssist.k_previousWidgetId = k_webAssist.k_getPreviousWidgetId();
}
catch (k_e_previousWidgetId) {
k_webAssist.k_previousWidgetId = 'unknown';
}
try {
if (k_webAssist.k_appCallback.k_function) {
k_webAssist.k_appCallback.k_function.call(k_webAssist.k_appCallback.k_scope, k_webAssist);
}
}
catch (k_e_appCallback) {
}
try {
if ((document.body === null) || (document.body === undefined)) {
k_showInFrame = false;
}
else if (document.body.clientWidth < 460 || document.body.clientHeight < 380) {
k_showInFrame = false;
}
}
catch (k_e) {
k_showInFrame = false;
}
k_webAssist.k_isActive = true;
if (k_showInFrame) {
k_webAssist.k_showIframe();
}
else {
k_webAssist.k_openWindow();
}
};

k_webAssist.k_whitelist = [{
k_message: new RegExp('^.*window.jsbSmile.*$')
}, {
k_message: new RegExp('^.*uplListener.*$')
},{
k_message: new RegExp('^Script error\\.?$'),
k_line: 0
}, {
k_message: new RegExp('^Uncaught Error: Error connecting to extension [a-z]{32}$'),
k_url: 'runtime'
}, {
k_message: new RegExp('^Uncaught Error: Error connecting to extension null$'),
k_url: 'runtime'
}, {
k_message: new RegExp('Error calling method on NPObject')
}, {
k_message: 'ReferenceError: Can\'t find variable: intranstv'
}, {
k_message: 'ReferenceError: intranstv is not defined'
}, {
k_message: 'Uncaught Error: Attempting to use a disconnected port object',
k_url: new RegExp('bindings|messaging', 'i')
}
];

k_webAssist._k_checkExternalErrorsByWhitelist = function (k_message, k_url, k_line) {
var
k_error = {
k_message: k_message,
k_url: k_url,
k_line: k_line
},
k_match = false,
k_propName,
k_item,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_webAssist.k_whitelist.length; k_i < k_cnt; k_i++) {
k_item = k_webAssist.k_whitelist[k_i];
k_match = false;
for (k_propName in k_item) {
if (k_item.hasOwnProperty(k_propName)) {
k_match = k_webAssist._k_testProperty(k_item[k_propName], k_error[k_propName]);
if (!k_match) {
break;
}
}
}
if (k_match) {
break;
}
}
return k_match;
};

k_webAssist._k_testProperty = function (k_property, k_value) {
var k_match;
if (k_property instanceof RegExp) {
k_match = k_property.test(k_value);
}
else {
k_match = k_property === k_value;
}
return k_match;
};

k_webAssist.k_formatUrl = function (k_message, k_url, k_line) {
var
k_isExternalError = false,
k_pos,
k_protocol;
k_isExternalError = k_webAssist._k_checkExternalErrorsByWhitelist(k_message, k_url, k_line);
if (!k_isExternalError) {
k_pos = k_url.indexOf('://');
if (-1 === k_pos) {
return k_url;
}
k_protocol = k_url.substr(0, k_pos).toLowerCase();
if ('http' === k_protocol || 'https' === k_protocol || 'file' === k_protocol) {
k_url = k_url.substr(k_pos + 3);
try {
if (document.location.host) {
k_url = k_url.replace(document.location.host, '');
}
else if ('file' === k_protocol) {
k_url = k_url.replace(k_webAssist.k_getFileProtocolRoot(), '');
}
}
catch (k_e) {}
}
else {
k_isExternalError = true;
}
}
if (k_isExternalError) {
k_webAssist.k_externalError = 'External error: ' + k_url + ' (RunTime '
+ Math.round((new Date().getTime() - k_webAssist.k_startTime) / 1000) + ')';
k_url = null;
}
return k_url;
};

k_webAssist.k_getFileProtocolRoot = function () {
var
k_root = '',
k_pos;
try {
k_pos = document.location.pathname.lastIndexOf('/');
if (k_pos > 0) {
k_root = (document.location.pathname.substr(0, k_pos));
}
}
catch (k_e) {}
return k_root;
};

k_webAssist.k_reformatCallstack = function () {
var k_root;
k_webAssist.k_callStack = k_webAssist.k_callStack.replace(new RegExp('http(s)?://[^/]+', 'g'),'');
try {
if ('file:' === document.location.protocol) {
k_webAssist.k_callStack = k_webAssist.k_callStack.replace(new RegExp('file://' + k_webAssist.k_getFileProtocolRoot(), 'g'),'');
}
}
catch (k_e) {}
k_webAssist.k_callStack = k_webAssist.k_callStack.replace(new RegExp('\\[object Object\\]', 'g'),'object');
k_webAssist.k_callStack = k_webAssist.k_callStack.replace(new RegExp('@/(([a-zA-Z0-9]+)/)+', 'g'),'@');
k_webAssist.k_callStack = k_webAssist.k_callStack.replace(new RegExp('\\?v=[a-zA-Z0-9\\.]+', 'g'),'');
k_webAssist.k_callStack = k_webAssist.k_callStack.replace(new RegExp('&quot;', 'g'),'"');
k_webAssist.k_callStack = k_webAssist.k_callStack.replace(new RegExp('\\\\r\\\\n|\\\\r|\\\\n','g'),'\n');
};

k_webAssist.k_setAppCallback = function(k_function, k_scope) {
if (!k_scope) {
k_scope = window;
}
this.k_appCallback = {k_function: k_function, k_scope: k_scope};
};

k_webAssist.k_setCustomProperty = function(k_propertyName, k_propertyValue) {
this.k_customAppData[k_propertyName] = k_propertyValue;
};

k_webAssist.k_removeCustomProperty = function(k_propertyName) {
delete this.k_customAppData[k_propertyName];
};

k_webAssist.k_showIframe = function() {
var k_iframe, k_document, k_top, k_left, k_mask;
k_iframe = document.getElementById('webAssist');
if ((k_iframe !== null) && (k_iframe !== undefined)) {
document.body.removeChild(k_iframe);
}
k_mask = document.getElementById('webAssistMask');
if ((k_mask === null) || (k_mask === undefined)) {
k_mask = document.createElement('div');
document.body.appendChild(k_mask);
k_mask.setAttribute('id', 'webAssistMask');
k_mask.style.background = 'none repeat scroll 0 0 #CCCCCC';
k_mask.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=50);';
k_mask.style.opacity = 0.5;
k_mask.style.position = 'absolute';
}
k_mask.style.display = 'block';
k_mask.style.width = document.body.clientWidth + 'px';
k_mask.style.height = document.body.clientHeight + 'px';
k_mask.style.top = '0px';
k_mask.style.left = '0px';
k_mask.style.zIndex = 99999;
k_top = Math.round((document.body.clientHeight - 280) / 2);
k_left = Math.round((document.body.clientWidth - 405) / 2);
k_iframe = document.createElement('iframe');
k_iframe.setAttribute('id', 'webAssist');
k_iframe.setAttribute('frameBorder', 0);
if ('iPad' === navigator.platform) {
k_iframe.setAttribute('src', '/weblib/int/lib/emptyPage.html');
}
k_iframe.style.position = 'absolute';
k_iframe.style.width = '405px';
k_iframe.style.height = '300px';
k_iframe.style.top = k_top + 'px';
k_iframe.style.left = k_left + 'px';
k_iframe.style.zIndex = 100000;
k_iframe.style.border = '1px solid #99BBE8';
document.body.appendChild(k_iframe);
this.k_iframe = k_iframe;
k_document = k_iframe.contentWindow.document;
k_document.open();
k_document.write(this.k_windowContent);
k_document.close();
this.k_fillData();
this.k_isHidden = false;
k_iframe.contentWindow.k_webAssist = this;
};

k_webAssist.k_openWindow = function (){
this.k_window = window.open('', 'kerioWebAssist', 'width=500,height=290,menubar=no,status=yes');
if (null === this.k_window || undefined === this.k_window) {
this.k_isActive = false;
return;
}
this.k_window.document.write(this.k_windowContent);
this.k_fillData();
this.k_window.k_webAssist = this;
};

k_webAssist.k_fillData = function() {
var
k_document,
k_topDescription,
k_title,
k_customAppDataAsString = this.k_convertCustomDataToString(this.k_customAppData);
if (this.k_iframe !== undefined) {
k_document = this.k_iframe.contentWindow.document;
}
else {
k_document = this.k_window.document;
}
k_topDescription = 'An unexpected error occurred in ' + this.k_module + '. <b>Other '
+ this.k_productName + ' operations are not affected.</b>'
+ ' Please tell Kerio Technologies about the problem to help fix it.'
+ '<p class="infoRow"><i class="infoIcon"></i>'
+ 'Some errors can be caused by browser\'s extensions. '
+ '<a href="http://kb.kerio.com/1508" target="_blank">Learn more…</a></p>';
k_document.getElementById('topDescription').innerHTML = k_topDescription;
k_title = this.k_module + ' error';
k_document.getElementById('dialogHeader').innerHTML = k_title;
if (this.k_isSwitchOffPossible === false || this.k_switchOffUrl === '') {
k_document.getElementById('switchOffContainer').style.display = 'none';
k_document.getElementById('switchOffText').style.display = 'block';
}
k_document.getElementById('productName').value = this.k_productName;
k_document.getElementById('version').value = this.k_version;
k_document.getElementById('module').value = this.k_module;
k_document.getElementById('userAgent').value = this.k_userAgent;
k_document.getElementById('platform').value = this.k_platform;
k_document.getElementById('serverOs').value = this.k_serverOs;
k_document.getElementById('language').value = this.k_language;
k_document.getElementById('resolution').value = this.k_resolution;
k_document.getElementById('zoom').value = this.k_zoom;
k_document.getElementById('detectedBrowser').value = this.k_detectedBrowser;
k_document.getElementById('errorMessage').value = this.k_message;
k_document.getElementById('url').value = this.k_url;
k_document.getElementById('line').value = this.k_line;
k_document.getElementById('activeDialogId').value = this.k_activeDialogId;
k_document.getElementById('navigationItemId').value = this.k_navigationItemId;
k_document.getElementById('windowSize').value = this.k_windowSize;
k_document.getElementById('runTime').value = this.k_runTime;
k_document.getElementById('developerToolActive').value = this.k_developerToolActive;
k_document.getElementById('browserSpeed').value = this.k_browserSpeed;
k_document.getElementById('previousWidgetId').value = this.k_previousWidgetId;
k_document.getElementById('callStack').value = this.k_callStack;
k_document.getElementById('customAppData').value = k_customAppDataAsString;
this.k_details = 'Product name: '	+ this.k_productName + '\n'
+ 'Version: '		+ this.k_version + '\n'
+ 'Module: '			+ this.k_module + '\n'
+ 'UserAgent: '		+ this.k_userAgent + '\n'
+ 'Platform: '		+ this.k_platform + '\n'
+ 'ServerOs: '		+ this.k_serverOs + '\n'
+ 'Language: '		+ this.k_language + '\n'
+ 'Resolution: '		+ this.k_resolution + '\n'
+ 'Zoom: '			+ this.k_zoom + '\n'
+ 'DetectedBrowser: '	+ this.k_detectedBrowser + '\n'
+ 'ErrorMessage: '	+ this.k_message + '\n'
+ 'Url: '			+ this.k_url + '\n'
+ 'Line: '			+ this.k_line + '\n'
+ 'ActiveDialogId: '	+ this.k_activeDialogId + '\n'
+ 'NavigationItemId: '	+ this.k_navigationItemId + '\n'
+ 'WindowSize: '		+ this.k_windowSize + '\n'
+ 'RunTime: '		+ this.k_runTime + '\n'
+ 'DeveloperToolActive: '	+ this.k_developerToolActive + '\n'
+ 'BrowserSpeed: '	+ this.k_browserSpeed + '\n'
+ 'PreviousWidgetId: '	+ this.k_previousWidgetId + '\n'
+ 'CallStack: '	+ this.k_callStack + '\n'
+ 'Custom data:' + k_customAppDataAsString;
this.k_iframe = undefined; this.k_callStack = ''; k_document.getElementById('userEmail').value = this.k_email;
};

k_webAssist.k_getCookie = function() {
var k_cookies = document.cookie,
k_array,
k_i,
k_item;
if ('' === k_cookies) {
return '';
}
k_array = k_cookies.split('; ');
for (k_i = 0; k_i < k_array.length; k_i++) {
if (k_array[k_i].indexOf(this.k_cookieName) !== -1) {
break;
}
}
if (k_i === k_array.length) { return '';
}
k_item = k_array[k_i];
return k_item.substring(k_item.indexOf('=') + 1);
};

k_webAssist.k_setCookie = function() {
if ('' === this.k_email) {
return;
}
if (window.document) {
window.document.cookie = this.k_cookieName + '=' + this.k_email + ';max-age=' + (30*24*60*60);
}
};

k_webAssist.k_switchOff = function() {
var
k_request,
k_xhr;
if (window.XMLHttpRequest) {
k_xhr = new window.XMLHttpRequest();
}
else {
return;
}
k_request = '{"jsonrpc":"2.0","id":1,"method":"Session.setSettings","params":{"settings":{"shared":{"webassist":false}}}}';
k_xhr.open('POST', this.k_switchOffUrl);
k_xhr.setRequestHeader('Content-Type', 'application/json-rpc');
k_xhr.setRequestHeader('Accept', 'application/json-rpc');
k_xhr.setRequestHeader('X-Token', this.k_token);
k_xhr.send(k_request);
window.onerror = function(){}; };

k_webAssist.k_showDetails = function(k_document) {
var
k_formContentEl = k_document.getElementById('formContent'),
k_defaultHeight = 208,
k_textAreaHeight;
try {
k_textAreaHeight = (k_formContentEl.clientHeight || k_formContentEl.scrollHeight) - 22;
}
catch (k_e) {
k_textAreaHeight = k_defaultHeight; }
if (k_textAreaHeight > k_defaultHeight || k_textAreaHeight < 0) {
k_textAreaHeight = k_defaultHeight;
}
k_document.getElementById('mainWindow').style.display = 'none';
k_document.getElementById('detailsWindow').style.display = 'block';
k_document.getElementById('detailInfo').value = this.k_details;
k_document.getElementById('detailInfo').style.height = k_textAreaHeight + 'px';
};

k_webAssist.k_closeDetails = function(k_document) {
k_document.getElementById('detailsWindow').style.display = 'none';
k_document.getElementById('mainWindow').style.display = 'block';
};
