
kerio.waw.ui.activation = {
k_appManagerUrl: '',

k_init: function(k_params) {
var
k_publicName = 'k_activationWizard',
k_localNamespace = k_publicName + '_',
k_widget = kerio.waw.ui.activation,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_isBoxEdition = k_shared.k_methods.k_isBoxEdition(),
k_productName = (k_isBoxEdition ? 'Kerio Control Box' : 'Kerio Control'),
k_USE_SOPHOS = k_shared.k_CONSTANTS.k_SERVER.k_USE_SOPHOS,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_WINDOWS     = k_WAW_CONSTANTS.k_SERVER.k_OS_WINDOWS,
k_LINUX       = k_WAW_CONSTANTS.k_SERVER.k_OS_LINUX,
k_NO_PAGE      = k_lib.K_Wizard2.prototype.k_NO_PAGE,
k_wizard, k_wizardCfg,
k_adminPasswordPage,
k_timeSettingsPage,
k_activationKeyPage,
k_registrationPage,
k_registrationSummaryPage,
k_subscriptionsPage,
k_connectionSettingsPage,
k_getSkipCfg,
k_sumarizeData,
k_summaryGridCfg,
k_summaryGrid,
k_isTrialAvailable = !k_isBoxEdition && 0 < k_shared.k_methods.k_licenseRemainingDays(k_WAW_CONSTANTS.kerio_web_SharedConstants.kerio_web_License), k_licenseNumberRegExp = new RegExp('[0-9a-z]{5}(\\-[0-9a-z]{5}){2}', 'i'),
k_licenceScreenAnchor,
k_notEmpty = {
k_allowBlank: false
},
k_myKerioUrlParams = '',
k_myKerioDefaultParams,
k_jSessionId,
k_eulaUrl,
k_preloader,
k_finishRegistration,
k_boxConnections,
k_setLicenseInfo,
k_registrationStart,
k_registrationValidate,
k_licenseNumberValidator,
k_patchSafariCrashInPasswordPage,
k_origOnBeforeUnload;
kerio.waw.ui.activation.k_appManagerUrl = kerio.waw.shared.k_CONSTANTS.k_APPMANAGER_URL;
k_widget.k_needLicense = kerio.waw.activation.k_needLicense;
k_widget.k_needPassword = kerio.waw.activation.k_needPassword; k_widget.k_needClientStatistics = kerio.waw.activation.k_needClientStatistics;
k_widget.k_needCentralManagement = kerio.waw.activation.k_needCentralManagement;
k_widget.k_licenseDialog = kerio.waw.activation.k_licenseDialog;
this._k_overwriteAjaxRequest(); k_origOnBeforeUnload = window.onbeforeunload;
window.onbeforeunload = this.k_warnBeforeClose;
kerio.waw.ui.activation.k_productName = k_productName;
kerio.lib.k_uiCacheManager.k_init({k_uiNamespace: kerio.waw.ui});
k_boxConnections = new kerio.waw.shared.k_widgets.K_BoxConnections(k_localNamespace + 'k_boxConnections');

k_patchSafariCrashInPasswordPage = function() {
var
k_browser = kerio.lib.k_browserInfo._k_currentBrowser,
k_adminPassword;
if (k_browser.k_name !== 'Safari') {
return;
}
if (k_browser.k_version < 6.2 || k_browser.k_version >= 8.0) {
return;
}
k_adminPassword = this.k_getPage('k_adminPassword');
if (!k_adminPassword) {
return;
}
k_adminPassword.k_extWidget.on('afterrender', function() {
var k_dummyPassword;
k_dummyPassword = document.createElement('input');
k_dummyPassword.setAttribute('readonly', 'readonly');
k_dummyPassword.type = 'password';
k_dummyPassword.style.width = '2px';
k_dummyPassword.style.height = '2px';
k_dummyPassword.style.border = '0px none';
this.form.el.dom.appendChild(k_dummyPassword);
k_dummyPassword = document.createElement('input');
k_dummyPassword.setAttribute('readonly', 'readonly');
k_dummyPassword.type = 'password';
k_dummyPassword.style.width = '2px';
k_dummyPassword.style.height = '2px';
k_dummyPassword.style.border = '0px none';
this.form.el.dom.appendChild(k_dummyPassword);
});
};

k_licenseNumberValidator = function(k_value){
var
k_wizard = this._kx.k_owner.k_getMainWidget();
if ('string' === typeof(k_value) && 17 === k_value.length && k_wizard.k_licenseNumberRegExp.test(k_value)) {
return true;}
return false;
};

k_getSkipCfg = function(k_registerOffline, k_skipRegistration, k_useAnchor) {
var
k_tr = kerio.lib.k_tr,
k_textRegisterOffline,
k_container,
k_languageCode;
k_registerOffline = (k_registerOffline && !kerio.waw.shared.k_methods.k_isIos()); if ('string' === typeof k_registerOffline) {
k_textRegisterOffline = k_registerOffline;
k_registerOffline = true;
k_skipRegistration = false;
}
else {
k_textRegisterOffline = k_tr('Register offline by license file', 'activation');
k_registerOffline = (false !== k_registerOffline);
k_skipRegistration = (false !== k_skipRegistration);
}
k_container = {
k_type: 'k_container',
k_className: 'bottomFormItem',
k_id: 'k_skipButtonsContainer',
k_isVisible: false,
k_items: []
};
if (undefined !== k_useAnchor) {
k_container.k_className = '';
}
if (k_registerOffline) {
k_container.k_items.push({
k_type: 'k_formLink',
k_id: 'k_goToLicenseUpload',
k_caption: k_textRegisterOffline,
k_onClick: this.k_startLicenseImport
});
}
if (k_skipRegistration) {
k_languageCode = kerio.waw.status.k_userSettings.k_get('calculatedLanguage');
if ('cs' === k_languageCode) {
k_languageCode = 'cz';
}
k_container.k_items.push({
k_type: 'k_display',
k_id: 'k_getTrialNumberLink',
k_value: {k_text: k_tr('Get a Trial License number', 'configWizard')},
k_template: '<a target="_blank" href="http://www.kerio.com/scripts/ctrl/ctrl.php?prod=kwf&lang=' + k_languageCode + '&plat=2">{k_text}</a>',
k_className: 'htmlLink',
k_width: '100%'
});
if (true !== this.k_licenseDialog) {
k_container.k_items.push({
k_type: 'k_display',
k_restrictions: { k_isTrialAvailable: [true] },
k_value: {k_text: k_tr('Activate in unregistered mode', 'activation')},
k_template: '<a href="#">{k_text}</a>',
k_id: 'k_goToUnregisteredTrial',
k_className: 'htmlLink',
k_onLinkClick: this.k_startUnregisteredTrial
});
}
}
return k_container;
}.createDelegate(this); 
k_registrationStart = function(k_page) {
var
k_isTrial = k_page.k_id !== 'k_startFullRegistration',
k_wizard = k_page.k_wizard,
k_settings;
this.k_activationKeyPage = k_wizard.k_getPage(k_isTrial ? 'k_licensingTrial' : 'k_licensingFullKey');
this.k_nextButton.k_setDisabled(false);
k_wizard.k_isOnlineRegSkipped = false;
k_settings = {
k_jsonRpc: {
method: 'ProductRegistration.start',
params: {
langId: kerio.lib.k_engineConstants.k_CURRENT_LANGUAGE
}
},
k_scope: this,

k_callback: function(k_response, k_success) {
var
k_lib = kerio.lib,
k_page = this.k_activationKeyPage;
if (k_success && !this.k_isOnlineRegSkipped) {
this.k_token = k_response.token;
k_page.k_reset();
k_page.k_setData({
k_captcha: kerio.lib.k_isMyKerio ? kerio.lib.k_ajax.k_changeDownloadUrlForMyKerio('/admin/' + k_response.image) : k_response.image
});
k_page.k_setVisible('k_loading', false);
k_page.k_setVisible('k_captcha', true);
if ('string' === typeof k_page.k_baseId) {
k_page.k_setData({
k_licenseNumber: k_page.k_baseId
});
delete k_page.k_baseId;
}
this.k_hideLoading(k_page.k_id);
}
else {
if (this.k_licenseDialog) {
k_lib.k_alert({
k_title: k_lib.k_tr('Registration Wizard', 'activation'),
k_icon: 'warning',
k_msg: k_lib.k_tr('There was a problem in communication with registration server, please try again later.', 'activation'),
k_callback: function() {
if (!this._k_backStack || 0 === this._k_backStack.length) {
this.k_onBeforeClose({});
}
else {
kerio.waw.ui.activation.k_wizard.k_hideLoading();
}
},
k_scope: k_page.k_wizard
});
}
else {
this.k_hideLoading('k_importLicense'); }
}
}
};
this.k_showLoading(kerio.lib.k_tr('Preparing registration…', 'activation'));
kerio.waw.requests.k_sendBatch(k_settings);
return false;
};

k_registrationValidate = function(k_page) {
if (!k_page.k_isValid()) {
return false;
}
this.k_showLoading(kerio.lib.k_tr('Retrieving registration info…', 'activation'));
var
k_isTrial = k_page.k_id !== 'k_licensingFullKey',
k_data = k_page.k_getData(),
k_baseId = k_data.k_licenseNumber,
k_requestCfg;
k_baseId = k_baseId.toUpperCase();
this.k_baseId = k_baseId;
this.k_isTrial = k_isTrial;
this.k_registrationPage.k_startingPageId = k_isTrial? 'k_startTrialRegistration' : 'k_startFullRegistration';
k_requestCfg = {
k_jsonRpc: {
method: 'ProductRegistration.get',
params: {
token: this.k_token,
securityCode: k_data.k_securityCode,
baseId: k_baseId
}
},
k_scope: this,

k_callback: function(k_response, k_success){
if (!k_success) {
this.k_hideLoading(this.k_registrationPage.k_startingPageId);
return;
}
var
k_registrationPage = this.k_registrationPage,
k_subscriptionsPage = this.k_subscriptionsPage,
k_isTrial = k_response.trial,
k_expirationDate,
k_expires,
k_registrationInfo,
k_details;
k_registrationInfo = k_response.registrationInfo;
this.k_isTrial = k_isTrial;
k_expirationDate = k_registrationInfo.expirationDate;
k_expires = kerio.waw.shared.k_methods.k_formatDate(
{
year: k_expirationDate.year,
month: k_expirationDate.month - 1,day: k_expirationDate.day
}
);
if (!k_isTrial) {
k_subscriptionsPage.k_setLicenseInfo(k_registrationInfo);
}
k_details = k_registrationInfo.details;
k_registrationPage.k_setData({
k_organization: k_details.organization,
k_person: k_details.person,
k_email: k_details.email,
k_phone: k_details.phone,
k_web: k_details.web,
k_country: k_details.country ? k_details.country.toUpperCase() : 'US',
k_state: k_details.state.toUpperCase(),
k_city: k_details.city,
k_street: k_details.street,
k_zip: k_details.zip,
k_comment: k_details.comment
});
k_registrationPage.k_setDisabled('k_organization', k_details.organization !== '');
k_registrationInfo.k_expires = k_expires;
k_registrationInfo.k_expirationDate = k_expirationDate;
k_registrationInfo.k_users = kerio.waw.shared.k_CONSTANTS.k_LICENSE_USERS_UNLIMITED === k_registrationInfo.subscribers ? kerio.lib.k_tr('Unlimited', 'tileLicense') : k_registrationInfo.subscribers;
k_registrationPage.k_registrationInfo = k_registrationInfo;
if (k_isTrial) {
this.k_finishRegistration();
} else {
this.k_hideLoading('k_licenseDetails');
}
} };kerio.waw.requests.k_sendBatch(k_requestCfg);
return false;
};

k_sumarizeData = function (k_page) {
var
k_productInfo = kerio.waw.shared.k_methods.k_productInfo.k_get(),
k_tr = kerio.lib.k_tr,
k_data = k_page.k_getData(true),
k_registrationInfo = this.k_registrationPage.k_registrationInfo,
k_subscriptions = '',
k_expirationCaption,
k_gridData;
if (!this.k_isTrial) {
k_expirationCaption = k_tr('Software Maintenance expires:', 'activation');
}
else {
k_expirationCaption = k_tr('Trial expires:', 'activation');
}
k_gridData = [
{caption: k_tr('Product:', 'activation'), value: k_productInfo.k_name + ' ' + k_productInfo.k_version},
{caption: k_tr('System:', 'activation'), value: k_productInfo.k_serverOs},
{caption: k_expirationCaption, value: k_registrationInfo.k_expires},
{caption: k_tr('Number of users:', 'activation'), value: k_registrationInfo.k_users},
{caption: k_tr('License numbers:', 'activation'), value: k_subscriptions},
{caption: k_tr('Organization:', 'activation'), value: k_data.k_organization},
{caption: k_tr('Country:', 'activation'), value: k_page.k_getItem('k_country').k_getText()},
{caption: k_tr('State:', 'activation'), value: k_page.k_getItem('k_state').k_getText()},
{caption: k_tr('Email:', 'activation'), value: k_data.k_email},
{caption: k_tr('Person:', 'activation'), value: k_data.k_person},
{caption: k_tr('Phone:', 'activation'), value: k_data.k_phone},
{caption: k_tr('Street:', 'activation'), value: k_data.k_street},
{caption: k_tr('City:', 'activation'), value: k_data.k_city},
{caption: k_tr('Web:', 'activation'), value: k_data.k_web},
{caption: k_tr('ZIP:', 'activation'), value: k_data.k_zip},
{caption: k_tr('Comment:', 'activation'), value: k_data.k_comment}
];
if (this.k_isTrial) {
k_gridData.splice(3, 2);
}
k_page.k_summaryGrid.k_setData(k_gridData);
};k_summaryGridCfg = {
k_selectionMode: 'k_none',
k_isRowHighlighting: false,
k_columns: {
k_sorting: false,
k_items: [
{k_columnId: 'caption', k_caption: k_tr('Item', 'activation'), k_width: 150,

k_renderer: function (k_value){
return {
k_data: '<b>' + kerio.lib.k_htmlEncode(k_value) + '</b>',
k_isSecure: true
};
}
},
{k_columnId: 'value', k_caption: k_tr('Value', 'activation')}
]
},
k_localData: []
};
k_summaryGrid = new kerio.lib.K_Grid(k_localNamespace + 'k_gridSummary', k_summaryGridCfg);

k_finishRegistration = function() {
var
k_data,
k_requestCfg,
k_saveRegistrationInfo,
k_sharedConstants,
k_lib = kerio.lib;
k_data = this.k_registrationPage.k_getData(true);
k_saveRegistrationInfo = {
details: {
organization: k_data.k_organization,
person: k_data.k_person,
email: k_data.k_email,
phone: k_data.k_phone,
web: k_data.k_web,
country: k_data.k_country,
state: k_data.k_state,
city: k_data.k_city,
street: k_data.k_street,
zip: k_data.k_zip,
comment: k_data.k_comment
},
expirationDate: this.k_registrationPage.k_registrationInfo.k_expirationDate
};
k_sharedConstants = kerio.lib.k_getSharedConstants();
k_saveRegistrationInfo.regNumbers = [];
k_requestCfg = {
k_jsonRpc: {
method: 'ProductRegistration.finish',
params: {
token: this.k_token,
baseId: this.k_baseId,
registrationInfo: k_saveRegistrationInfo,
finishType: this.k_isTrial ? k_sharedConstants.kerio_web_rfStore : k_sharedConstants.kerio_web_rfCreate
}
},
k_scope: this,
k_callbackParams: {
k_baseId: this.k_baseId
},

k_callback: function(k_response, k_isOk, k_params){
var
k_pageId;
if (k_response.k_isOk) {
if (kerio.waw.ui.activation.k_needClientStatistics) {
k_pageId = 'k_clientStatistics';
}
else if (kerio.waw.ui.activation.k_needPassword || kerio.waw.ui.activation.k_needCentralManagement) {
k_pageId = 'k_adminPassword';
}
else {
k_pageId = 'k_finish';
}
}
else {
this.k_hideLoading();
return;
}
this.k_hideLoading(k_pageId);
}};
this.k_showLoading(k_lib.k_tr('Sending registration data…', 'action'));
k_lib.k_ajax.k_request(k_requestCfg);
};k_setLicenseInfo = function(k_registrationInfo) {
var
k_regNumber = k_registrationInfo.regNumbers[0],
k_extensionList = k_registrationInfo.extensions,
k_extensions = [],
k_expirationDate,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_extensionList.length; k_i < k_cnt; k_i++) {
k_extensions.push(k_extensionList[k_i].name);
}
k_expirationDate = k_registrationInfo.expirationDate;
this.k_getItem('k_licenseInfo').k_setValue({
k_licenseNumber: k_regNumber.key,
k_product: k_regNumber.description,
k_subscribers: kerio.waw.shared.k_CONSTANTS.k_LICENSE_USERS_UNLIMITED === k_registrationInfo.subscribers ? kerio.lib.k_tr('Unlimited', 'tileLicense') : k_registrationInfo.subscribers,
k_expirationDate: kerio.waw.shared.k_methods.k_formatDate({
year: k_expirationDate.year,
month: k_expirationDate.month - 1, day: k_expirationDate.day
}),
k_extensions: k_extensions.join(', ')
});
};
k_licenceScreenAnchor = '0 -343';
if (k_lib.k_isSafari || k_lib.k_isChrome) {
k_licenceScreenAnchor = '0 -346';
}
else {
if (k_lib.k_isMSIE) {
k_licenceScreenAnchor = '0 -325';
if (k_lib.k_isMSIE7) {
k_licenceScreenAnchor = '0 -346';
}
else if (k_lib.k_isMSIE8) {
k_licenceScreenAnchor = '0 -345';
}
}
}
k_wizardCfg = {
k_restrictBy: {
k_serverOs: (k_shared.k_methods.k_isLinux() ? k_LINUX : k_WINDOWS),
k_boxEdition: k_isBoxEdition,
k_isTrialAvailable: k_isTrialAvailable
},
k_height: 560, k_width: 620,
k_isResizable: false, k_title: this.k_licenseDialog ? k_tr('Registration Wizard', 'activation') : k_tr('Activation Wizard', 'activation'),
k_onBeforeClose: this.k_closeHandler,
k_className: 'configWizard',
k_pages: [

{
k_id: 'k_welcome',
k_title: k_productName,
k_description: (this.k_needPassword || this.k_needClientStatistics || this.k_licenseDialog || this.k_needCentralManagement)
? k_tr('The complete gateway security, network monitoring and productivity solution.', 'activation')
: k_tr('Your license has expired. For full functionality of %1, it is necessary to activate a new license.', 'activation', { k_args: [ k_productName ]}),
k_labelWidth: 150,
k_nextPageId: 'k_eula',
k_items: [
{
k_id: 'k_textGuide',
k_type: 'k_display',
k_isHidden: this.k_licenseDialog,
k_value: k_tr('This wizard will guide you through the product activation and initial setup.', 'activation')
},
{
k_type: 'k_container',
k_className: 'bottomFormItem',
k_isHidden: this.k_licenseDialog,
k_items: [{
k_type: 'k_select',
k_caption: '',
k_localData: this.k_getLanguageList(),
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_id',
k_fieldIconClassName: 'k_className',
k_value: kerio.waw.status.k_userSettings.k_get('calculatedLanguage'),
k_onChange: this.k_changeLanguage
}]
}
],
k_onBeforeShow: this.k_initWizard
},

{
k_id: 'k_denyWizard',
k_title: k_tr('License has expired', 'activation'),
k_description: ' ',
k_nextPageId: k_NO_PAGE,
k_labelWidth: 200,
k_items: [
{
k_type: 'k_display',
k_value: k_tr('You can\'t login to the Kerio Control Administration because the license for %1 has expired.', 'activation', { k_args: [ k_productName ]})
},
{
k_type: 'k_display',
k_value: ' '
},
{
k_type: 'k_display',
k_value: k_tr('Please contact your Kerio Control administrator and ask them to activate %1.', 'activation', { k_args: [ k_productName ]})
}],
k_onBeforeShow: function() {
window.onbeforeunload = kerio.waw.shared.k_methods.k_emptyFunction;
this.k_onBeforeClose = function() {
document.location.href = '/admin/login/';
return true;
};
}
},

{
k_id: 'k_eula',
k_title: k_tr('Accept the End User License Agreement', 'activation'),
k_description: ' ',
k_isLabelHidden: true,
k_nextPageId: 'k_testConnection',
k_items: [
{
k_isLabelHidden: true,
k_type: 'k_display',
k_value: k_tr('The following End User License Agreement must be accepted in order to proceed with the activation:', 'activation')
},
{
k_id: 'k_eulaPanel',
k_type: 'k_textArea',
k_isReadOnly: true,
k_className: 'eulaPanel',
k_maxLength: kerio.lib.k_constants.k_TEXT_AREA_MAX_LENGTH,
k_height: 320 },
{
k_type: 'k_checkbox',
k_id: 'k_agree',
k_option: k_tr('I agree with the End User License Agreement', 'activation')
}
],
k_onBeforeShow: function(k_page) {
var
k_isReady,
k_callback = function(k_response, k_success) {
var k_eulaPanel = this.k_getItem('k_eulaPanel');
if (k_success) {
k_eulaPanel.k_setValue(k_response.k_xhrResponse.responseText);
}
else {
kerio.lib.k_reportError('Internal error: can\'t load content of EULA', 'activation', 'k_init');
}
}; k_isReady = this.k_preloader.k_isReady('k_eula', {
k_scope: k_page,
k_callback: k_callback
});
if (!k_isReady) { this.k_showLoading(kerio.lib.k_tr('Loading End User License Agreement…', 'activation'));
return false;
}
}, k_onBeforeNextPage: function(k_page) {
if (k_page.k_getItem('k_agree').k_getValue()) {
return true;
}
var
k_tr = kerio.lib.k_tr;
this.k_alert({
k_icon: 'warning',
k_msg: k_tr('You must agree with the End User License Agreement in order to proceed with the activation.', 'activation')
});
return false;
}
},

{
k_id: 'k_testConnection',
k_onBeforeShow: function() {
this.k_startTestConnection();
return false;
}
},

{
k_id: 'k_connectionSettings',
k_title: k_tr('Setup connection', 'activation'),
k_description: ' ',
k_nextPageId: 'k_testConnection',
k_labelWidth: 200,
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('%1 requires Internet connectivity in order to perform the online activation.', 'activation', { k_args: [ k_productName ] })
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: ' ',
k_id: 'k_spacer'
},
{
k_restrictions: {
k_boxEdition: [ false ]
},
k_type: 'k_container',
k_items: [
{
k_type: 'k_select',
k_id: 'k_interface',
k_caption: k_tr('Interface connected to the Internet:', 'activation'),
k_fieldDisplay: 'name',
k_fieldValue: 'id',
k_fieldIconClassName: 'icon',
k_listClassName: 'interfaceIcon',
k_localData: [],
k_onChange: this._k_changeInterface
}
]
},
{
k_restrictions: {
k_boxEdition: [ true ]
},
k_id: 'k_connectedPortWarning',
k_type: 'k_display',
k_isSecure: true,
k_value: [
'<b>',
k_tr('You are currently connected to %1 using Port %2. This port is reserved for the Internet connection. It is recommended to connect to the administration using another port.', 'activation', { k_args: [ k_productName, kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.boxEdition == kerio.waw.shared.k_CONSTANTS.box_id_ng310 ? "8" : "1"  ] }),
'</b>'
].join(''),
k_isHidden: true
},
{
k_type: 'k_select',
k_id: 'k_ethernetMode',
k_caption: k_tr('Mode:', 'activation'),
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',
k_localData: [
{
k_name: k_tr('Automatic', 'activation'),
k_value: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeAutomatic
},
{
k_name: k_tr('Static IP', 'activation'),
k_value: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeManual
},
{
k_restrictions: {
k_serverOs: [ k_LINUX ]
},
k_name: k_tr('PPPoE', 'activation'),
k_value: k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe
}
],
k_value: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeManual,
k_onChange: function(k_page, k_group, k_value) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_isPppoe = k_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe === k_value,
k_isDhcp  = k_CONSTANTS.InterfaceModeType.InterfaceModeAutomatic === k_value;
if (k_page.k_wizard.k_isLinux) {
k_page.k_setVisible(['k_networkSettings'], !k_isPppoe);
k_page.k_setVisible(['k_pppoeSettings'], k_isPppoe);
}
k_page.k_setDisabled(['k_networkSettings'], k_isDhcp);
}
},
k_shared.k_DEFINITIONS.k_get('k_ethernetIpSettings', { k_height: 100}),
k_shared.k_DEFINITIONS.k_get('k_ethernetPppoeSettings',
{
k_height: 100,
k_restrictions: {
k_serverOs: [ k_LINUX ]
},
k_isIpVisible: false,
k_passwordEmptyText: ''
}
),
{
k_restrictions: {
k_boxEdition: [ false ]
},
k_id: 'k_connectedInterfaceWarning',
k_type: 'k_display',
k_isSecure: true,
k_value: [
'<b>',
k_tr('This is the interface you are currently using to connect to the %1!', 'activation', { k_args: [ k_productName ] }),
'<br>',
k_tr('Changing the interface mode might result in lost connectivity. In that case connect to the new IP address.', 'activation'),
'</b>'
].join(''),
k_isHidden: true
},
{
k_id: 'k_connectedLanWarning',
k_type: 'k_display',
k_isSecure: true,
k_value: [
'<b>',
k_tr('If you continue with this configuration, a new traffic rule will be created to allow access to the administration from the Internet.', 'activation', { k_args: [ k_productName ] }),
'</b>'
].join(''),
k_isHidden: true
},
{
k_restrictions: {
k_boxEdition: [ true ]
},
k_type: 'k_container',
k_className: 'activationBoxConnections',
k_height: 165,
k_content: k_boxConnections
},
k_getSkipCfg(k_tr('Skip this step and continue offline', 'activation'))
],

k_onBeforeShow: function(k_page) {
k_page.k_setVisible('k_skipButtonsContainer', true);
k_page.k_setVisible('k_getTrialNumberLink', false);
if (kerio.waw.shared.k_methods.k_isLinux()) {
this.k_timeSettingsPage.k_isVisitedFromConnectivity = false;
}
if (null === this.k_interfaces) {
this._k_loadInterfaces();
return false;
}
}, k_onBeforeNextPage: this._k_checkLanCollision
},

{
k_id: 'k_noConnection',
k_title: k_tr('No connection detected', 'activation'),
k_description: ' ',
k_backPageId: kerio.waw.shared.k_methods.k_isLinux() ? 'k_connectionSettings' : 'k_welcome',
k_nextPageId: k_NO_PAGE,
k_isClosePage: false,
k_items: [
{
k_isLabelHidden: true,
k_type: 'k_display',
k_value: k_tr('%1 could not contact the registration server.', 'activation', {
k_args: [kerio.waw.ui.activation.k_productName]
})
},
{
k_type: 'k_display',
k_value: ' '
},
{
k_isLabelHidden: true,
k_type: 'k_display',
k_value: (kerio.waw.shared.k_methods.k_isLinux()) ? ' '
: k_tr('Please setup correct connection in your Windows OS. After Internet connection is established, please try again.', 'activation')
},
{ k_restrictions: {
k_serverOs: [ k_WINDOWS ]
},
k_type: 'k_display'
},
{ k_restrictions: {
k_serverOs: [ k_WINDOWS ]
},
k_type: 'k_display'
},
{
k_restrictions: {
k_serverOs: [ k_WINDOWS ]
},
k_type: 'k_formButton',
k_caption: k_tr('Try Again', 'activation'),
k_onClick: function(k_form) {
k_form.k_wizard.k_startTestConnection(false, true);
}
},
k_getSkipCfg(true, true)
],

k_onBeforeShow: function(k_page) {
k_page.k_setVisible('k_skipButtonsContainer', true);
k_page.k_setVisible('k_getTrialNumberLink', false);
if (kerio.waw.shared.k_methods.k_isLinux()) {
this.k_timeSettingsPage.k_isVisitedFromConnectivity = false;
}
}
},

{
k_id: 'k_timeSettings',
k_title: k_tr('Time and time zone', 'activation'),
k_description: ' ',
k_restrictions: {
k_serverOs: [ k_LINUX ]
},
k_items: [
{
k_isLabelHidden: true,
k_isHidden: true,
k_id: 'k_noteTimeNotSet',
k_type: 'k_display',
k_value: k_tr('Before you can register %1 you need to set time:', 'activation', { k_args: [ k_productName ] })
},
{
k_isLabelHidden: true,
k_id: 'k_noteTimeReview',
k_type: 'k_display',
k_value: k_tr('Please review your time and date settings.', 'activation')
},
{
k_isLabelHidden: true,
k_type: 'k_display',
k_value: ' '
},
{
k_id: 'k_selectTimeZone',
k_type: 'k_select',
k_caption: k_tr('Time zone:', 'activation'),
k_fieldDisplay: 'name',
k_fieldValue: 'id',
k_localData: [],
k_onChange: function(k_form, k_select, k_value) {
if (!k_form.k_changesAllowed) {
return;
}
var
k_timeZonesProperties = k_form.k_timeZonesProperties,
k_newOffset,
k_origOffset;
if(k_timeZonesProperties[k_value].k_hasDst){
k_form.k_dst.k_setValue(kerio.lib.k_tr('(This time zone has a daylight saving time period)', 'activation'));
} else {
k_form.k_dst.k_setValue(' ');
}
k_form.k_timeChanged = true;
if (k_timeZonesProperties && k_timeZonesProperties[k_select._k_prevValue]) {
k_newOffset = k_timeZonesProperties[k_value].k_offset;
k_origOffset = k_timeZonesProperties[k_select._k_prevValue].k_offset;
k_form.k_timeOffsetServerClient += k_newOffset - k_origOffset;
k_form.k_updateDateField(kerio.lib.k_isChrome || kerio.lib.k_isSafari); }
}
},
{
k_id: 'k_dst',
k_type: 'k_display',
k_caption: ' ',
k_value: ''
},
{
k_isLabelHidden: true,
k_type: 'k_display',
k_value: ' '
},
{
k_id: 'k_ntp',
k_type: 'k_checkbox',
k_isChecked: true,
k_option: k_tr('Keep the time synchronized with an Internet time server.', 'activation'),
k_caption: ' ', k_onChange: function(k_form, k_item, k_value ) {
k_form.k_systemConfiguration.ntpServer.enabled = k_value;
k_form.k_timeChanged = true;
}
},
{
k_isLabelHidden: true,
k_type: 'k_display',
k_value: ' '
},
{
k_type: 'k_columns',
k_items: [
{
k_id: 'k_date',
k_type: 'k_date',
k_caption: k_tr('Date:', 'activation'),
k_width: 100,
k_maxLength: 10,
k_dateFormat: 'Y-m-d',
k_value: '1970-01-01',
k_onChange: function(k_form) {
if (!k_form.k_changesAllowed || k_form.k_timeChanged) {
return;
}
k_form.k_timeChanged = true;
k_form.k_setTimeOffset();
}
}
] },
{
k_type: 'k_columns',
k_items: [
{
k_id: 'k_time',
k_type: 'k_text',
k_caption: k_tr('Time:', 'activation'),
k_labelWidth: 150,
k_width: 100,
k_value: '00:00:00',
k_maxLength: 8, k_validator: {
k_allowBlank: false,
k_functionName: 'k_isTimeWithSeconds'
},
k_onFocus: function(k_form) {
k_form.k_isFocused = true;
},
k_onBlur: function(k_form, k_item) {
k_form.k_isFocused = false;
if (k_item.k_isValid()) {
k_item.k_setValue(k_item.k_getValue(), true);
k_form.k_setTimeOffset();
kerio.waw.shared.k_tasks.k_resume(k_form.k_ANIMATE_CLOCKS);
}
} }
] }
],
k_onBeforeShow: function(k_page) {
var k_isOnline = this.k_isConnectivityOk; if (this.k_licenseDialog) {
if (kerio.waw.shared.k_methods.k_isTrial(false)) {
return 'k_licensingStart';
}
if (false === kerio.waw.shared.k_methods.k_isTrial(true) && kerio.waw.shared.k_CONSTANTS.k_SERVER.k_LICENSE.Id) {
this.k_baseId = this.k_baseId = kerio.waw.shared.k_CONSTANTS.k_SERVER.k_LICENSE.Id;
}
this.k_getPage('k_licensingFullKey').k_getItem('k_purchaseNote').k_setVisible(false);
return 'k_startFullRegistration';
}
else if (this.k_isBoxEdition) {
k_page.k_followingPageId = 'k_startFullRegistration';
}
if (k_isOnline && undefined === k_page.k_ntpStatus) {
this.k_showLoading(kerio.lib.k_tr('Loading time settings…', 'activation'));
k_page.k_synchronizeTime();
return false;
}
if (!k_page.k_timeReady) {
this.k_showLoading(kerio.lib.k_tr('Loading time settings…', 'activation'));
k_page.k_loadTimeSettings();
return false;
}
if (undefined !== k_page.k_followingPageId) {
k_page.k_getItem('k_noteTimeNotSet').k_setVisible(true);
k_page.k_getItem('k_noteTimeReview').k_setVisible(false);
}
k_page.k_getItem('k_ntp').k_setChecked(k_page.k_systemConfiguration.ntpServer.enabled, true);
k_page.k_updateDateField();
k_page.k_isFocused = false;
k_page.k_changesAllowed = true;
kerio.waw.shared.k_tasks.k_start(k_page.k_ANIMATE_CLOCKS);
this.k_nextButton.k_setDisabled(false);
}, k_onBeforeNextPage: function(k_page) {
var
k_shared = kerio.waw.shared;
k_shared.k_tasks.k_stop(k_page.k_ANIMATE_CLOCKS);
if (!k_page.k_timeChanged) {
if (undefined !== k_page.k_followingPageId) {
return k_page.k_followingPageId; }
return true; }
k_page.k_wizard.k_showLoading(
kerio.lib.k_tr('Applying time settings…', 'activation')
);
k_page.k_systemConfiguration.ntpServer.enabled = k_page.k_getItem('k_ntp').k_getValue();
k_page.k_systemConfiguration.timeZoneId = k_page.k_getItem('k_selectTimeZone').k_getValue();
kerio.waw.requests.k_sendBatch(
[
{
k_jsonRpc: {
method: 'SystemConfig.set',
params: { config: k_page.k_systemConfiguration }
}
},
{
k_jsonRpc: {
method: 'SystemConfig.setDateTime',
params: {
config: k_page.k_getTimeDateObject()
}
}
}
],
{
k_scope: k_page,
k_callback: function(k_response, k_success) {
var
k_followingPageId;
if (k_success) {
k_followingPageId = this.k_followingPageId ? this.k_followingPageId : 'k_licensingStart';
this.k_wizard.k_hideLoading(k_followingPageId);
}
else {
this.k_wizard.k_hideLoading(); }
},
k_mask: false
}
); return false; } },
{
k_id: 'k_licensingStart',
k_title: k_tr('Licensing', 'configWizard'),
k_description: ' ',
k_defaultItem: 'k_licenseButton',
k_backPageId: 'k_timeSettings',
k_labelWidth: 400,
k_items: [
{
k_type: 'k_display',
k_value: k_tr('How do you plan to use Kerio Control?', 'configWizard'),
k_className: 'biggerText'
},
{
k_type: 'k_row',
k_className: 'licenseType',
k_items: [
{
k_type: 'k_display',
k_caption: k_tr('I will use a commercial or NFR license', 'configWizard')
},
{
k_id: 'k_licenseButton',
k_type: 'k_formButton',
k_caption: k_tr('License', 'configWizard'),
k_onClick: function(k_form) {
var
k_wizard = k_form.k_parentWidget.k_wizard,
k_nextPage = k_wizard.k_getPage('k_licensingFullType');
k_wizard.k_showPage(k_nextPage);
}
}
]
},
{
k_type: 'k_row',
k_className: 'licenseType',
k_items: [
{
k_type: 'k_display',
k_caption: k_tr('I want to try it free for 30 days', 'configWizard')
},
{
k_id: 'k_trialButton',
k_type: 'k_formButton',
k_caption: k_tr('Trial', 'configWizard'),
k_onClick: function(k_form) {
var
k_wizard = k_form.k_parentWidget.k_wizard;
k_wizard.k_showPage('k_startTrialRegistration');
}
}
]
}
],
k_onBeforeNextPage: function() {
return false;
},
k_onBeforeShow: function() {
this.k_nextButton.k_setDisabled(true);
}
},
{
k_id: 'k_licensingFullType',
k_title: k_tr('Licensing', 'configWizard'),
k_className: 'configWizard enterOrBuy',
k_description: ' ',
k_defaultItem: 'k_enterLicenseButton',
k_backPageId: 'k_licensingStart',
k_labelWidth: 400,
k_items: [
{
k_type: 'k_display',
k_value: k_tr('I already have a license', 'configWizard'),
k_className: 'biggerText'
},
{
k_type: 'k_row',
k_className: 'licenseType',
k_items: [{
k_type: 'k_display',
k_caption: k_tr('Your license number was emailed to you if you purchased from Kerio online, or was provided to you by your reseller.', 'configWizard')
},
{
k_type: 'k_formButton',
k_id: 'k_enterLicenseButton',
k_caption: k_tr('Enter license', 'configWizard'),
k_className: 'defaultButton',
k_onClick: function(k_form) {
var
k_wizard = k_form.k_parentWidget.k_wizard,
k_nextPage = k_wizard.k_getPage('k_startFullRegistration');
k_wizard.k_showPage(k_nextPage);
}
}]
},
{
k_type: 'k_display',
k_value: k_tr('I want to buy a license', 'configWizard'),
k_className: 'biggerText biggerText2'
},
{
k_type: 'k_row',
k_className: 'licenseType',
k_items: [{
k_type: 'k_display',
k_caption: k_tr('Buy a license from a Kerio reseller near you or from the Kerio online store.', 'configWizard')
},
{
k_type: 'k_formButton',
k_id: 'k_btnFindReseller',
k_caption: k_tr('Buy', 'configWizard'),
k_onClick: function() {
kerio.lib.k_openWindow('http://www.kerio.com/how-to-buy', '_blank');
}
}]
}
],
k_onBeforeShow: function() {
this.k_nextButton.k_setDisabled(true);
}
},
{
k_id: 'k_startFullRegistration',
k_onBeforeShow: k_registrationStart
},
{
k_id: 'k_licensingFullKey',
k_title: k_tr('License Activation & Registration', 'configWizard'),
k_description: ' ',
k_defaultItem: 'k_licenseNumber',
k_backPageId: 'k_licensingFullType',
k_labelWidth: 400,
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Enter your License number:', 'configWizard'),
k_className: 'biggerText'
},
{
k_type: 'k_text',
k_id: 'k_licenseNumber',
k_isLabelHidden: true,
k_width: 250,
k_validator: k_notEmpty
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_id: 'k_purchaseNote',
k_value: k_tr("If you don't have a license number, click Back to purchase a license from a Kerio reseller or from Kerio online.", 'configWizard')
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('For security purposes, enter the security code below.', 'configWizard'),
k_style: 'margin-top: 20px;'
},
{
k_type: 'k_columns',
k_width: 250,
k_height: kerio.lib.k_isMSIE8 ? 100 : 80,
k_items: [{
k_isHidden: true,
k_id: 'k_captcha',
k_isLabelHidden: true,
k_width: 250,
k_height: 80,
k_type: 'k_image'
},
{
k_id: 'k_loading',
k_type: 'k_container',
k_style: 'width: 250px; height: 80px; padding-top: 32px; text-align: center;',
k_items: [{
k_type: 'k_image',
k_value: kerio.lib.k_getSharedConstants('kerio_web_WeblibPath') + '/ext/extjs/resources/images/default/grid/loading.gif?v=8629',
k_width: 16,
k_height: 16
}]
}]
},
{
k_type: 'k_text',
k_isLabelHidden: true,
k_id: 'k_securityCode',
k_width: 250,
k_validator: k_notEmpty
},
{
k_type: 'k_container',
k_className: 'bottomFormItem right',
k_items: [{
k_type: 'k_display',
k_id: 'k_linkGoToLicenseUpload',
k_value: {k_text: k_tr('Register offline by license file', 'configWizard')},
k_template: '<a href="#">{k_text}</a>',
k_className: 'htmlLink',
k_width: '100%',
k_onLinkClick: function() {
var
k_wizard = this.k_getMainWidget(),
k_nextPage = k_wizard.k_getPage('k_importLicense');
k_wizard.k_showPage(k_nextPage);
}
}]
}
],
k_onBeforeShow: function(k_page) {
if (this.k_baseId) {
k_page.k_items.k_licenseNumber.k_setValue(this.k_baseId);
}
if (this.k_isBoxEdition) {
k_page.k_backPageId = 'k_timeSettingsPage';
}
},
k_onBeforeNextPage: k_registrationValidate
},

{
k_id: 'k_registration',
k_title: k_tr('Contact details', 'configWizard'),
k_description: ' ',
k_backPageId: k_NO_PAGE,
k_items: [
{
k_type: 'k_display',
k_value: k_tr('Please fill or update your contact information:', 'configWizard')
},
{
k_type: 'k_columns',
k_labelWidth: 100,
k_width: '100%',
k_items: [{
k_width: '50%',
k_type: 'k_container',
k_items: [{
k_id: 'k_organization',
k_caption: k_tr('Organization:', 'activation'),
k_validator: k_notEmpty
},
{
k_id: 'k_person',
k_caption: k_tr('Person:', 'activation'),
k_validator: k_notEmpty
},
{
k_id: 'k_email',
k_caption: k_tr('Email:', 'activation'),
k_validator: {
k_regExp: new RegExp('^([a-zA-Z0-9_\\.-]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,5}|[0-9]{1,3})$'),
k_allowBlank: false
}
},
{
k_id: 'k_phone',
k_caption: k_tr('Phone:', 'activation'),
k_validator: k_notEmpty
},
{
k_id: 'k_web',
k_caption: k_tr('Web:', 'activation')
}]
},
{k_type: 'k_container',
k_items: [{
k_id: 'k_fake',
k_type: 'k_display',
k_value: ' ',
k_isLabelHidden: true,
k_width: 12
}]
},
{
k_type: 'k_container',
k_labelWidth: 100,
k_width: '50%',
k_items: [{
k_id: 'k_country',
k_caption: k_tr('Country:', 'activation'),
k_type: 'k_select',
k_localData: kerio.lib.k_getSortedCountries(),
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',

k_onChange: function(k_form, k_item, k_value) {
var
k_enable = false,
k_state = k_form.k_getItem('k_state');
if (k_value == 'AU' || k_value == 'CA' || k_value == 'US') {
k_state.k_setData(kerio.lib.k_constants.k_stateItems[k_value]);
k_enable = true;
}
k_state.k_setValue('');
k_state.k_setDisabled(!k_enable);
}
},
{
k_id: 'k_state',
k_type: 'k_select',
k_caption: k_tr('State:', 'activation'),
k_isDisabled: true,
k_localData: [],
k_emptyText: k_tr('Select state…', 'activation'),
k_emptyValuePrompt: {
k_value: '',
k_display: k_tr('Select state…', 'activation')
},
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',
k_validator: k_notEmpty
},
{
k_id: 'k_city',
k_caption: k_tr('City:', 'activation'),
k_validator: k_notEmpty
},
{
k_id: 'k_street',
k_caption: k_tr('Street:', 'activation'),
k_validator: k_notEmpty
},
{
k_id: 'k_zip',
k_caption: k_tr('ZIP:', 'activation'),
k_validator: k_notEmpty
}]
}]
},
{
k_id: 'k_comment',
k_type: 'k_textArea',
k_height: 100,
k_caption: k_tr('Comment:', 'activation')
},
{
k_id: 'k_policy',
k_type: 'k_checkbox',
k_isLabelHidden: true,
k_option: k_tr('I agree with the <span id="k_privacyPolicyLink" class="link textLink">Privacy Policy Terms</span>', 'activation')
}
],
k_onBeforeShow: function(k_page) {
k_page.k_backPageId = 'k_licenseDetails';
this.k_extWidget.mask.addClass('configWizard');
},
k_onBeforeNextPage: function(k_page) {
var
k_lib = kerio.lib;
if (!k_page.k_getItem('k_policy').k_isChecked()) {
k_lib.k_alert(
k_lib.k_tr('Privacy Policy', 'activation'),
k_lib.k_tr('If you want to continue in registration, you must agree with the Privacy Policy Terms.', 'activation'));
return false;
}
k_page.k_wizard.k_sumarizeData(k_page);
this.k_finishRegistration();
return false;
}},

{
k_id: 'k_questions',
k_title: k_tr('Survey question', 'activation'),
k_description: ' ',
k_backPageId: k_NO_PAGE,
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('This information is not required. However, we  appreciate if you answer these questions:', 'activation')
},
{
k_type: 'k_display',
k_value: k_tr('Number of computers in your company?', 'wlibProductRegistration')
},
{
k_type: 'k_select',
k_width: 200,
k_id: 'k_computerCount',
k_isLabelHidden: true,
k_value: '',
k_localData: [
{k_name: k_tr('1 - 19', 'wlibProductRegistration'), k_value: '1 - 19'},
{k_name: k_tr('20 - 49', 'wlibProductRegistration'), k_value: '20 - 49'},
{k_name: k_tr('50 - 99', 'wlibProductRegistration'), k_value: '50 - 99'},
{k_name: k_tr('100 - 249', 'wlibProductRegistration'), k_value: '100 - 249'},
{k_name: k_tr('250 - 999', 'wlibProductRegistration'), k_value: '250 - 999'},
{k_name: k_tr('1000 and more', 'wlibProductRegistration'), k_value: '1000 and more'}
],
k_emptyText: k_tr('Select number of computers…', 'wlibProductRegistration'),
k_emptyValuePrompt: {
k_value: '',
k_display: k_tr('Select number of computers…', 'wlibProductRegistration')
},
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value'
},
{
k_type: 'k_display',
k_value: k_tr('Where did you learn of the product?', 'wlibProductRegistration')
},
{
k_type: 'k_select',
k_width: 200,
k_id: 'k_origin',
k_isLabelHidden: true,
k_value: '',
k_localData: [
{k_name: k_tr('Internet search', 'wlibProductRegistration'), k_value: 'Internet search'},
{k_name: k_tr('Magazine', 'wlibProductRegistration'), k_value: 'Magazine'},
{k_name: k_tr('Personal recommendation', 'wlibProductRegistration'), k_value: 'Personal recommendation'},
{k_name: k_tr('Reseller', 'wlibProductRegistration'), k_value: 'Resseler'},
{k_name: k_tr('Exhibition', 'wlibProductRegistration'), k_value: 'Exhibition'},
{k_name: k_tr('Other', 'wlibProductRegistration'), k_value: 'Other'}
],
k_emptyText: k_tr('Select option…', 'wlibProductRegistration'),
k_emptyValuePrompt: {
k_value: '',
k_display: k_tr('Select option…', 'wlibProductRegistration')
},
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value'
},
{
k_type: 'k_display',
k_value: k_tr('Who did you buy your license number from? (please enter the reseller\'s name)', 'wlibProductRegistration'),
k_isHidden: this.k_isTrial
},
{
k_type: 'k_text',
k_id: 'k_reseller',
k_width: 200,
k_isLabelHidden: true,
k_isHidden: this.k_isTrial
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Thank you!', 'activation')
}
],
k_onBeforeShow: function(k_page) {
k_page.k_backPageId = 'k_registration';
},
k_onBeforeNextPage: function() {
this.k_finishRegistration();
return false;
}},

{
k_id: 'k_privacyPolicyTerms',
k_nextPageId: k_NO_PAGE,
k_backPageId: k_NO_PAGE,
k_items: [
{
k_type: 'k_container',
k_height: 'auto',
k_isResizeableVertically: true,
k_id: 'k_content'
}
],k_onBeforeClose: function() {
this.k_hideLoading('k_registration');
},

k_onBeforeShow: function(k_page) {
k_page.k_getItem('k_content').k_extWidget.on('render', function(k_extWidget) {
var
k_langFile = kerio.lib.k_getSharedConstants('kerio_web_WeblibPath') + '/int/adm/terms/' + kerio.lib.k_engineConstants.k_CURRENT_LANGUAGE + '/privacypolicy.html';
k_extWidget.html = '<iframe src="' + k_langFile + '" id="legalNotices" frameBorder="0" width="100%" height="100%"></iframe>';
});
} },

{
k_id: 'k_registrationSummary',
k_title: k_tr('Registration Summary', 'activation'),
k_items: [
{
k_type: 'k_display',
k_value: k_tr('The wizard has collected all necessary information and will now generate the registration.', 'activation')
},
{
k_type: 'k_container',
k_content: k_summaryGrid
},
{
k_type: 'k_display',
k_value: k_tr('If you have provided incorrect information or if your network setup changes, you may run this wizard again to generate a new one.', 'activation')
}
],
k_onBeforeNextPage: function() {
this.k_finishRegistration();
return false;
}},

{
k_id: 'k_licenseDetails',
k_title: k_tr('License details', 'activation'),
k_nextPageId: 'k_registration',
k_description: '',
k_items: [
{
k_id: 'k_licenseInfo',
k_type: 'k_display',
k_value: '',
k_template: [
'<br><br>',
'<table style="amargin-left: 20px;"><tbody>',
'<tr><td style="width: 220px;">' + k_tr('License number:', 'wlibProductRegistration') + '</td><td>{k_licenseNumber}</td></tr>',
'<tr><td>' + k_tr('Product:', 'wlibProductRegistration') + '</td><td>{k_product}</td></tr>',
'<tr><td>' + k_tr('Number of users:', 'wlibSplashScreen') + '</td><td>{k_subscribers}</td></tr>',
'<tr><td>' + k_tr('Software Maintenance expires:', 'wlibProductRegistration') + '</td><td>{k_expirationDate}</td></tr>',
'<tr><td>' + k_tr('Extensions:', 'wlibProductRegistration') + '</td><td>{k_extensions}</td></tr>',
'</tbody></table><br>',
'<a href="https://secure.kerio.com/reg_info/" target="_blank">',
k_tr('Register multiple license numbers', 'wlibProductRegistration') + '</a><br>',
k_tr('The earlier licensing system used multiple numbers, such as for adding users, Software Maintenance renewal or enabling the antivirus module.', 'wlibProductRegistration')
].join('')
}
]
},

{
k_id: 'k_importLicense',
k_title: k_tr('Import your license', 'activation'),
k_description: ' ',
k_isClosePage: false, k_items: [
{
k_type: 'k_display',
k_id: 'k_blockActivation',
k_isHidden: true,
k_isSecure: true,
k_value: [
k_tr('We are very sorry, but you cannot activate your %1 from this web browser.', 'activation', { k_args: [ kerio.waw.ui.activation.k_productName ]}),
'<br><br>',
k_tr('You should either configure the Internet connection to activate using your product key or connect from a browser that supports the license file upload.', 'activation')
].join('')
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('License file:', 'configWizard'),
k_className: 'biggerText'
},
{
k_type: 'k_row',
k_id: 'k_importLicenseRow',
k_labelWidth: 50,
k_items: [
{
k_type: 'k_text',
k_id: 'licenseFileName',
k_isLabelHidden: true,
k_emptyText: k_tr('Please select your license…', 'activation'),
k_isReadOnly: true
},
{
k_type: 'k_formUploadButton',
k_id: 'licenseFile',
k_caption: k_tr('Browse…', 'activation'),
k_remoteData: {
k_isAutoUpload: false,
k_jsonRpc: {
method: 'ProductInfo.uploadLicense'
}
},
k_onChange: this.k_checkLicenseKey,
k_onUpload: this.k_finishLicenseImport
}
] },
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('You can import the license file to activate your %1 offline.', 'activation', { k_args: [kerio.waw.ui.activation.k_productName] })
},
k_getSkipCfg(false)
],
k_onBeforeShow: this.k_resetImportLicensePage,
k_onBeforeNextPage: this.k_importLicense
},
{
k_id: 'k_startTrialRegistration',
k_onBeforeShow: k_registrationStart
},
{
k_id: 'k_licensingTrial',
k_title: k_tr('Registered trial activation', 'configWizard'),
k_description: ' ',
k_defaultItem: 'k_licenseNumber',
k_backPageId: 'k_licensingStart',
k_labelWidth: 400,
k_items: [
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('Enter your Trial License number:', 'configWizard'),
k_className: 'biggerText'
},
{
k_type: 'k_text',
k_id: 'k_licenseNumber',
k_isLabelHidden: true,
k_width: 250,
k_validator: k_notEmpty
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('An email with your Trial License number was sent to you when you requested the trial. Enter it here.', 'configWizard')
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_tr('For security purposes, enter the security code below.', 'configWizard'),
k_style: 'margin-top: 20px;'
},
{
k_type: 'k_columns',
k_width: 250,
k_height: kerio.lib.k_isMSIE8 ? 100 : 80,
k_items: [{
k_isHidden: true,
k_id: 'k_captcha',
k_isLabelHidden: true,
k_width: 250,
k_height: 80,
k_type: 'k_image'
},
{
k_id: 'k_loading',
k_type: 'k_container',
k_style: 'width: 250px; height: 80px; padding-top: 32px; text-align: center;',
k_items: [{
k_type: 'k_image',
k_value: kerio.lib.k_getSharedConstants('kerio_web_WeblibPath') + '/ext/extjs/resources/images/default/grid/loading.gif?v=8629',
k_width: 16,
k_height: 16
}]
}]
},
{
k_type: 'k_text',
k_isLabelHidden: true,
k_id: 'k_securityCode',
k_width: 250,
k_validator: k_notEmpty
},
k_getSkipCfg(false, true)
],
k_onBeforeShow: function(k_page) {
k_page.k_setVisible('k_skipButtonsContainer', true);
},
k_onBeforeNextPage: k_registrationValidate
},

{
k_restrictions: {
k_boxEdition: [ false ]
},
k_id: 'k_unregisteredTrial',
k_title: k_tr('Use unregistered trial', 'activation'),
k_description: ' ',
k_items: [
{ k_type: 'k_display', k_value: k_tr('In unregistered trial version, the following features will be unavailable:', 'activation') },
{ k_type: 'k_display', k_value: k_USE_SOPHOS ? k_tr('- integrated Sophos® antivirus', 'activation') : k_tr('- integrated Kerio Antivirus', 'activation') },
{ k_type: 'k_display', k_value: k_tr('- Intrusion Prevention System', 'activation') },
{ k_type: 'k_display', k_value: k_tr('- Kerio Control Web Filter (web page categorization)', 'activation') },
{ k_type: 'k_display', k_value: k_tr('- Application awareness', 'activation') },
{ k_type: 'k_display', k_value: k_tr('- technical support', 'activation') },
{ k_type: 'k_display', k_value: '' },
{ k_type: 'k_display', k_value: k_tr('If you want to evaluate the features above, click Get a Trial License number, then click Back and enter the license number. If you proceed in unregistered mode, you can register later from the Kerio Control Administration.', 'activation') },
k_getSkipCfg(false, true)
],
k_onBeforeShow: function(k_page) {
k_page.k_setVisible('k_skipButtonsContainer', true);
k_page.k_setVisible('k_goToUnregisteredTrial', false);
},
k_isFinishPage: (!this.k_needPassword && !this.k_needClientStatistics && !this.k_needCentralManagement),
k_nextPageId: (this.k_needClientStatistics ? 'k_clientStatistics' : (this.k_needPassword || this.k_needCentralManagement ? 'k_adminPassword' : k_NO_PAGE)),
k_onBeforeNextPage: this.k_acceptUnregisteredTrial,
k_onBeforeFinish: this.k_acceptUnregisteredTrial
},

{
k_id: 'k_clientStatistics',
k_title: k_tr('Help us make Kerio Control even better', 'activation'),
k_description: ' ',
k_isFinishPage: !this.k_needPassword && !this.k_needCentralManagement,
k_nextPageId: this.k_needPassword || this.k_needCentralManagement ? 'k_adminPassword' : k_NO_PAGE,
k_backPageId: !this.k_needLicense ? 'k_welcome' : k_NO_PAGE,
k_defaultItem: 'sendClientStatistics',
k_items: [
{
k_type: 'k_display',
k_value: k_tr('As a part of our commitment to offer the best quality product on the market, Kerio Control\'s development team would like to have your permission to collect anonymous usage statistics addressing the server hardware, software clients and operating systems interacting with our products.', 'activation'),
k_isLabelHidden: true
},
{
k_type: 'k_display',
k_value: ' '
},
{
k_type: 'k_checkbox',
k_id: 'sendClientStatistics',
k_option: k_tr('Allow Kerio Control to send anonymous usage statistics to Kerio Technologies', 'activation'),
k_isLabelHidden: true,
k_isChecked: true
},
{
k_type: 'k_display',
k_template: ' <a>{k_link}</a>',
k_value: {
k_link: k_tr('View sample data', 'advancedOptionsList')
},
k_onLinkClick: function() {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'contributeDialogSample'
});
}
},
{
k_type: 'k_display',
k_value: ' '
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('You can change this setting later in %1.', 'activation', {
k_args: [
k_tr('Advanced Options', 'menuTree')
]
})
}
], k_onBeforeNextPage: this.k_onSetClientStatistics,
k_onBeforeFinish: this.k_onSetClientStatistics
},

{
k_id: 'k_adminPassword',
k_title: k_tr('Administrator account', 'configWizard'),
k_description: ' ',
k_backPageId: (this.k_needClientStatistics ? 'k_clientStatistics' : (!this.k_needLicense ? 'k_welcome' : k_NO_PAGE)),
k_defaultItem: 'k_password',
k_items: [
{
k_id: 'k_needPasswordContainer',
k_type: 'k_container',
k_items: [
{
k_type: 'k_display',
k_value: k_tr('Please set a password for the administrator user account:', 'configWizard')
},
{
k_type: 'k_display',
k_caption: k_tr('Username:', 'common'),
k_value: 'Admin'
},
{
k_type: 'k_text',
k_id: 'k_password',
k_caption: k_tr('Password:', 'common'),
k_isPasswordField: true,
k_width: 300,
k_emptyText: '',
k_maxLength: 110, k_checkByteLength: true,
k_onChange: this.k_onPasswordChange
},
{
k_type: 'k_text',
k_id: 'k_passwordConfirm',
k_caption: k_tr('Confirm password:', 'userEdit'),
k_isPasswordField: true,
k_width: 300,
k_emptyText: '',
k_maxLength: 110, k_checkByteLength: true,
k_preventExtValidation: true,
k_onChange: this.k_onPasswordChange
},
{
k_type: 'k_display',
k_id: 'k_emailAddressSpace',
k_value: ' '
},
{
k_type: 'k_checkbox',
k_id: 'k_emailAddressCheckbox',
k_isChecked: false,
k_isLabelHidden: true,
k_option: k_tr('Do you want to receive alerts?', 'userEdit'),
k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled('k_emailAddress', !k_isChecked);
if (k_isChecked) {
k_form.k_getItem('k_emailAddress').k_focus();
}
}
},
{
k_id: 'k_emailAddress',
k_isDisabled: true,
k_caption: k_tr('Email address:', 'userEditor'),
k_width: 300,
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_EMAIL_ADDRESS,
k_validator: {
k_functionName: 'k_isEmail'
},
k_onChange: function(k_form, k_element, k_value) {
if (k_form.k_emptyEmailValidation) {
k_element.k_markInvalid(false);
}
k_form.k_emptyEmailValidation = false;
}
},
{
k_type: 'k_display',
k_value: ' '
}
]
},
{
k_type: 'k_display',
k_id: 'k_centralManagementClaim',
k_className: 'centralManagementClaim',
k_value: k_tr('Manage all your Kerio Control deployments through one centralized web interface. Register all your Kerio Control deployments in AppManager so that you can monitor them easily and securely. Apply configuration changes remotely anytime, from anywhere.', 'activation'),
k_isLabelHidden: true
},
{
k_type: 'k_display',
k_id: 'k_centralManagerSpacer1',
k_value: ' '
},
{
k_type: 'k_checkbox',
k_id: 'k_openAppManager',
k_isChecked: true,
k_isLabelHidden: true,
k_option: k_tr('Open AppManager and register this appliance after finishing the wizard', 'userEdit'),
k_isSecure: true,
k_width: 'auto'
},
{
k_type: 'k_display',
k_id: 'k_centralManagerSpacer2',
k_value: ' '
},
{
k_type: 'k_display',
k_id: 'k_infoCentralManagementNotReached',
k_isLabelHidden: true,
k_isHidden: true,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('Kerio Control cannot reach AppManager right now. Please go back to these settings in %1.', 'activation2', {
k_args: [
k_tr('Remote Services', 'menuTree')
]
})
},
{
k_type: 'k_display',
k_id: 'k_infoCentralManagementChange',
k_isLabelHidden: true,
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_value: k_tr('You can change these settings later in %1.', 'activation2', {
k_args: [
k_tr('Remote Services', 'menuTree')
]
})
}
], k_onBeforeShow: function(k_page) {
var
k_activationWidget = kerio.waw.activation,
k_needPassword = k_activationWidget.k_needPassword,
k_isFinishPage = !this.k_k_needLicense && !this.k_needClientStatistics,
k_isReady = true,
k_isPreloaderReady,
k_callback;
if (k_needPassword) {

k_callback = function(k_response, k_success) {
var
k_isAlertListEmpty = k_response.config && 0 === k_response.config.length;
this.k_setVisible(['k_emailAddressSpace', 'k_emailAddressCheckbox', 'k_emailAddress'], k_isAlertListEmpty);
this.k_doSetDefaultAlert = k_isAlertListEmpty;
};
k_isReady = this.k_preloader.k_isReady('k_alertsData', {
k_scope: k_page,
k_callback: k_callback
});

k_callback = function(k_response, k_success) {
var k_adminData = k_response.list[0];
if (k_adminData.email) {
this.k_setData({
k_emailAddress: k_adminData.email
});
}
};
k_isPreloaderReady = this.k_preloader.k_isReady('k_adminData', {
k_scope: k_page,
k_callback: k_callback
});
k_isReady = k_isReady && k_isPreloaderReady;
}
else {
k_page.k_setVisible('k_needPasswordContainer', false);
}
if (k_activationWidget.k_needCentralManagement && !kerio.lib.k_isMyKerio) {
if (k_isFinishPage) {
k_page.k_openAppManager.k_setOption(kerio.lib.k_tr('Open AppManager and register this appliance after you finish', 'userEdit'));
}
if (!k_needPassword) {
k_page.k_setTitle(kerio.lib.k_tr('Central management', 'configWizard'));
}
else {
k_page.k_setVisible(['k_centralManagementClaim', 'k_centralManagerSpacer1', 'k_centralManagerSpacer2'], false);
}
k_callback = function(k_response, k_success) {
var k_status = k_response.status;
};
k_isPreloaderReady = this.k_preloader.k_isReady('k_centralManagementData', {
k_scope: k_page,
k_callback: k_callback
});
k_isReady = k_isReady && k_isPreloaderReady;
k_callback = function(k_response, k_success) {
var
k_openAppManager = this.k_openAppManager;
};
k_isPreloaderReady = this.k_preloader.k_isReady('k_centralManagementJoin', {
k_scope: k_page,
k_callback: k_callback
});
k_isReady = k_isReady && k_isPreloaderReady;
}
else {
k_page.k_setVisible(['k_centralManagementClaim', 'k_centralManagementRow', 'k_centralManagerSpacer1', 'k_openAppManager', 'k_centralManagerSpacer2', 'k_infoCentralManagementChange'], false);
}
if (!k_isReady && !k_isFinishPage) {
this.k_showLoading(kerio.lib.k_tr('Loading…', 'activation'));
return false;
}
},
k_isFinishPage: !this.k_needLicense,
k_nextPageId: !this.k_needLicense ? k_NO_PAGE : 'k_finish',
k_onBeforeFinish: this.k_onPasswordFinish,
k_onBeforeNextPage: this.k_onPasswordFinish
},

{
k_id: 'k_finish',
k_title: k_tr('Thank you!', 'activation'),
k_description: ' ',
k_isClosePage: this.k_licenseDialog,
k_isFinishPage: !this.k_licenseDialog,
k_backPageId: k_NO_PAGE,
k_labelWidth: 400,
k_items: [
{
k_type: 'k_display',
k_value: this.k_licenseDialog ?
k_tr('You have successfully completed the licensing of Kerio Control.', 'configWizard')
: k_tr('You have successfully completed the initial configuration of Kerio Control.', 'configWizard'),
k_className: 'biggerText'
},
{
k_type: 'k_display',
k_value: k_tr('Click the Finish button to  proceed with login to Kerio Control Administration.', 'configWizard'),
k_style: 'margin-top: 30px; margin-right: 20px',
k_isHidden: this.k_licenseDialog
}
],
k_onBeforeFinish: function(k_page) {
window.onbeforeunload = kerio.waw.shared.k_methods.k_emptyFunction;
kerio.waw.requests.k_stopKeepAlive(); if (this.k_openAppManager) {
kerio.lib.k_openWindow(k_page.k_wizard.k_adminPasswordPage.k_appManagerRegistrationUrl, '_blank');
}
document.location.reload(true);
}
}
] }; if (!this.k_licenseDialog) {
k_wizardCfg.k_className += ' noCloseButton';
}
k_wizard = new kerio.lib.K_Wizard2(k_publicName, k_wizardCfg);
kerio.waw.ui.activation.k_wizard = k_wizard; k_preloader = new kerio.waw.ui.activation.K_Preloader();
if (k_isBoxEdition) {
k_boxConnections.k_setRowData([k_tr('Internet Link', 'connectivityWizard'), k_tr('Local Network', 'connectivityWizard')]);
}
if (this.k_needPassword) {
if (kerio.lib.k_isMyKerio) {
k_jSessionId = kerio.lib.k_ajax.k_getJSessionIdFromDefaultParams();
if (false !== k_jSessionId) {
k_myKerioDefaultParams = kerio.lib.k_ajax.k_getMyKerioDefaultParams();
k_myKerioUrlParams = k_myKerioDefaultParams.k_JSESSION_ID_TEMPLATE + '=' + k_jSessionId;
}
}
k_eulaUrl = '/admin/internal/eula.txt' + k_myKerioUrlParams;
k_preloader.k_add({
k_id: 'k_eula',
k_url: kerio.lib.k_ajax.k_changeDownloadUrlForMyKerio(k_eulaUrl),
k_method: 'GET',
k_keepXhr: true
});
k_preloader.k_add({
k_id: 'k_adminData',
k_jsonRpc: {
method: 'Users.get',
params: {
query: {
conditions: [kerio.waw.shared.k_DEFINITIONS.k_get('k_searchCondition', {
k_fieldName: 'id',
k_value: kerio.waw.status.k_userSettings._k_globalValues.user.id })],
combining: kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_And,
start: 0,
limit: 1
},
domainId: kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE
}
},
k_scope: k_wizard
});
k_preloader.k_add({ k_id: 'k_initLanguage',
k_jsonRpc: {
method: 'Session.setSettings',
params: { settings: { admin: { language: kerio.waw.status.k_userSettings.k_get('calculatedLanguage')}}}
}
});
k_preloader.k_add({
k_id: 'k_alertsData',
k_jsonRpc: {
method: 'Alerts.getSettings'
},
k_scope: k_wizard
});
}
else {
k_wizard.k_getPage('k_welcome').k_nextPageId = 'k_testConnection';
}
if (this.k_needCentralManagement) {
k_preloader.k_add({
k_id: 'k_centralManagementData',
k_jsonRpc: {
method: 'CentralManagement.getAppManager',
params: {
extendedInfo: false
}
},
k_scope: k_wizard
});
}
if (kerio.waw.shared.k_methods.k_isLinux()) {
k_timeSettingsPage = k_wizard.k_getPage('k_timeSettings');
k_timeSettingsPage.k_addReferences({
k_isVisitedFromConnectivity: false,
k_isOnlineRegSkipped: false,
NtpUpdatePhase: k_WAW_CONSTANTS.NtpUpdatePhase,
k_ntpStatus: undefined, k_followingPageId: undefined,
k_ANIMATE_CLOCKS: 'k_animateClocks',
k_isFocused: false,
k_timeReady: false,
k_timeChanged: false,
k_changesAllowed: false,
k_timeZonesProperties: undefined,
k_fieldTime: k_timeSettingsPage.k_getItem('k_time'),
k_fieldDate: k_timeSettingsPage.k_getItem('k_date'),
k_dst: k_timeSettingsPage.k_getItem('k_dst'),
k_timeOffsetServerClient: 0,
k_currentZoneOffset: 0,
k_timeZoneList: [],
k_systemConfiguration: {
hostname: 'control',
ntpServer: {
enabled: true,
value: '1.kerio.pool.ntp.org'
},
timeZoneId: 'Greenwich Mean Time'
},
k_caretPosition: 0,
k_synchronizeTime: this.k_synchronizeTime,
k_loadTimeSettings: this.k_loadTimeSettings,

k_updateDateField: function(k_updateTime) {
var
k_time;
k_time = (new Date()).add(Date.MILLI, this.k_timeOffsetServerClient);
this.k_fieldDate.k_setValue(Math.round(k_time.getTime() / 1000), true);
if (k_updateTime) {
this.k_saveTimeCaretPosition();
this.k_fieldTime.k_setValue(kerio.waw.shared.k_methods.k_formatTime({
hour: k_time.getHours(),
min: k_time.getMinutes(),
sec: k_time.getSeconds()
}), true);
this.k_restoreTimeCaretPosition();
}
},

k_getTimeDateObject: function() {
var
k_shared = kerio.waw.shared,
k_methods = k_shared.k_methods,
k_date = this.k_fieldDate.k_getValue(),
k_time = Date.parseDate(this.k_fieldTime.k_getValue(), k_shared.k_CONSTANTS.k_DATE_TIME_FORMATS.k_TIME_PARSE);
return {
date: k_methods.k_unixTimestampToDate(k_date),                  time: k_methods.k_unixTimestampToTime(k_time.getTime() / 1000)  };
},

k_setTimeOffset: function(k_timeDate) {
var
k_serverTime,
k_clientTime;
k_clientTime = new Date();
if (undefined === k_timeDate) {
k_timeDate = this.k_getTimeDateObject();
}
k_serverTime = new Date(k_timeDate.date.year, k_timeDate.date.month, k_timeDate.date.day, k_timeDate.time.hour, k_timeDate.time.min, k_timeDate.time.sec);
this.k_timeOffsetServerClient = k_serverTime.getTime() - k_clientTime.getTime();
}
}); if (kerio.lib.k_isMSIE) {
k_timeSettingsPage.k_fieldTime.k_getSelectedText = function() {
return false;
};
k_timeSettingsPage.k_addReferences({

k_saveTimeCaretPosition: function() {
var
k_input = this.k_fieldTime.k_extWidget.itemCt.dom.children[1].lastChild,
k_caretPosition = 0,
k_selection;
if (!this.k_isFocused) {
return;
}
k_selection = document.selection.createRange();
k_selection.moveStart('character', -k_input.value.length);
k_caretPosition = k_selection.text.length;
this.k_caretPosition = k_caretPosition;
}, 
k_restoreTimeCaretPosition: function() {
var
k_input = this.k_fieldTime.k_extWidget.itemCt.dom.children[1].lastChild,
k_caretPosition = this.k_caretPosition,
k_selection;
if (!this.k_isFocused) {
return;
}
k_selection = document.selection.createRange();
k_selection.moveStart('character', -k_input.value.length);
k_selection.moveEnd('character', -k_input.value.length + k_caretPosition);
k_selection.moveStart('character', k_caretPosition);
k_selection.moveEnd('character', 0);
k_selection.select();
} }); } else {
if (kerio.lib.k_isFirefox || kerio.lib.k_isSafari || kerio.lib.k_isChrome) {
k_timeSettingsPage.k_addReferences({

k_saveTimeCaretPosition: function() {
var
k_input;
try {
k_input = this.k_fieldTime.k_extWidget.itemCt.dom.children[1].lastChild;
this.k_caretPosition = k_input.selectionStart;
}
catch (k_err) {
}
}, 
k_restoreTimeCaretPosition: function() {
var
k_input,
k_caretPosition = this.k_caretPosition;
try {
k_input = this.k_fieldTime.k_extWidget.itemCt.dom.children[1].lastChild;
k_input.selectionStart = k_caretPosition;
k_input.selectionEnd = k_caretPosition;
}
catch (k_err) {
}
} }); } else {
k_timeSettingsPage.k_addReferences({

k_saveTimeCaretPosition: function() {
var
k_input = this.k_fieldTime.k_extWidget.itemCt.dom.children[1].lastChild;
try {
if (k_input.selectionStart || '0' == k_input.selectionStart) {
this.k_caretPosition = k_input.selectionStart;
}
}
catch (k_err) {
}
}, 
k_restoreTimeCaretPosition: function() {
var
k_input = this.k_fieldTime.k_extWidget.itemCt.dom.children[1].lastChild,
k_caretPosition;
try {
if (k_input.selectionStart || '0' == k_input.selectionStart) {
k_caretPosition = this.k_caretPosition;
k_input.selectionStart = k_caretPosition;
k_input.selectionEnd = k_caretPosition;
}
}
catch (k_err) {
}
} }); } } k_connectionSettingsPage = k_wizard.k_getPage('k_connectionSettings');
k_connectionSettingsPage.k_addReferences({

k_setPppoeData: function(k_data, k_page) {
var
k_userName = k_page.k_getItem('k_userName').k_getValue(),
k_dnsAutodetected = k_page.k_getItem('k_pppoeDnsAutodetected').k_getValue(),
k_dnsServers = k_page.k_getItem('k_pppoeDnsServers').k_getValue();
k_data.ras = {
rasType: kerio.waw.shared.k_CONSTANTS.RasType.PPPoE,
credentials: {
userName: k_userName,
password: k_data.k_password,
passwordChanged: ('' === this.k_getItem('k_password').k_getEmptyText())
}
};
k_data.dnsAutodetected = k_dnsAutodetected;
k_data.dnsServers = k_dnsServers;
k_data.encap = kerio.waw.shared.k_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe;
k_data.mode = kerio.waw.shared.k_CONSTANTS.InterfaceModeType.InterfaceModeAutomatic;
delete k_data.k_userName;
delete k_data.k_password;
delete k_data.k_pppoeDnsAutodetected;
delete k_data.k_pppoeDnsServers;
}
});
} k_adminPasswordPage = k_wizard.k_getPage('k_adminPassword');
k_adminPasswordPage.k_addReferences({
k_validatePassword: this.k_validatePassword,
k_saveCentralManagement: this.k_saveCentralManagement,
k_getDefaultAlertRule: this.k_getDefaultAlertRule,
k_isPasswordEdited: false,
k_emptyEmailValidation: false,
k_doSetDefaultAlert: false,
k_appManagerRegistrationUrl: kerio.waw.shared.k_CONSTANTS.k_APPMANAGER_URL,
k_openAppManager: k_adminPasswordPage.k_getItem('k_openAppManager')
});
k_activationKeyPage = k_wizard.k_getPage('k_licensingFullKey');
k_wizard.k_getPage('k_licensingTrial').k_getItem('k_licenseNumber').k_extWidget.validator = k_licenseNumberValidator;
k_wizard.k_getPage('k_licensingFullKey').k_getItem('k_licenseNumber').k_extWidget.validator = k_licenseNumberValidator;
k_registrationPage = k_wizard.k_getPage('k_registration');
k_registrationPage.k_addReferences({
k_registrationInfo: {},
k_summaryGrid: k_summaryGrid});
k_registrationPage.k_setLink(
'k_privacyPolicyLink',

function() {
this.k_wizard.k_hideLoading('k_privacyPolicyTerms');
});
k_subscriptionsPage = k_wizard.k_getPage('k_licenseDetails');
k_subscriptionsPage.k_addReferences({
k_setLicenseInfo: k_setLicenseInfo
});
k_registrationSummaryPage = k_wizard.k_getPage('k_registrationSummary');
k_wizard.k_addReferences({
k_isBoxEdition: k_isBoxEdition,
k_isLinux: kerio.waw.shared.k_methods.k_isLinux(),
k_alert: this.k_alert,
k_changeLanguage: this.k_changeLanguage,
k_timeSettingsPage: k_timeSettingsPage,
k_adminPasswordPage: k_adminPasswordPage,
k_registrationPage: k_registrationPage,
k_registrationSummaryPage: k_registrationSummaryPage,
k_activationKeyPage: k_activationKeyPage,
k_subscriptionsPage: k_subscriptionsPage,
k_saveAdminPassword: this.k_saveAdminPassword,
k_isConnectivityOk: false,
k_isFirstNoConnection: true,
k_startTestConnection: this.k_startTestConnection,
_k_testConnectionStatus: this._k_testConnectionStatusSimple, _k_testConnectionStatusSimple: this._k_testConnectionStatusSimple,
_k_testConnectionStatusFinish: this._k_testConnectionStatusFinish,
_k_loadInterfaces: this._k_loadInterfaces,
_k_saveConnectivitySettings: (k_isBoxEdition ? this._k_saveBoxSettings : this._k_saveEthernetSettings),
_k_allowInternetAccess: this._k_allowInternetAccess,
_k_callback: undefined,
_k_callbackScope: undefined,
k_preloader: k_preloader,
k_isTrial: false,
k_isTrialAvailable: k_isTrialAvailable,
k_sumarizeData: k_sumarizeData,
k_finishRegistration: k_finishRegistration,
k_token: undefined,
k_baseId: undefined,
k_interfaces: null,
k_connectivityData: null,
k_interfacePorts: null,
k_licenseDialog: kerio.waw.ui.activation.k_licenseDialog,
k_nextButton: k_wizard.k_toolbar.k_getItem('k_btnNext'),
k_licenseNumberRegExp: k_licenseNumberRegExp,
k_startLicenseImport: this.k_startLicenseImport,
_k_origOnBeforeUnload: k_origOnBeforeUnload,
k_openAppManager: false,
k_interfaceMap: k_shared.k_methods.k_flip({
k_ip: 'ip',
subnetMask: function(k_from, k_value) {
return { k_subneMask: k_value };
},
k_subnetMask: function(k_from, k_value) {
return { subnetMask: kerio.waw.shared.k_methods.k_convertCidrToMask(k_value) };
},
k_gateway: 'gateway',
k_dnsServers: 'dnsServers',
k_ethernetMode: 'mode',
k_userName: 'k_userName',
k_password: 'k_password',
k_pppoeDnsAutodetected: 'k_pppoeDnsAutodetected',
k_pppoeDnsServers: 'k_pppoeDnsServers'
}, true)
});
k_wizard.k_addReferences({
k_patchSafariCrashInPasswordPage: k_patchSafariCrashInPasswordPage,
k_applyParams: function(k_params) {
this._k_callback = k_params.k_callback;
this._k_callbackScope = k_params.k_callbackScope;
}
});
if (!k_isBoxEdition) {
k_wizard.k_addReferences({
k_unregisteredTrialPage: k_wizard.k_getPage('k_unregisteredTrial')
});
}
window.document.title = kerio.waw.shared.k_CONSTANTS.k_SERVER.k_HOST_NAME + ' - ' + 'Kerio Control' + ' - ' + k_tr('Activation Wizard', 'activation');
kerio.waw.requests._k_cacheWaitingDialogImages(); if (kerio.waw.ui.activation && k_params.k_showOnLoad) {
k_wizard.k_patchSafariCrashInPasswordPage();
k_wizard.k_show();
}
else {
return k_wizard;
}
}, 
k_alert: function(k_config) {
k_config.k_title = kerio.lib.k_tr('Activation Wizard', 'activation');
kerio.lib.k_alert(k_config);
},

_k_overwriteAjaxRequest: function() {
var
k_requests = kerio.waw.requests,
k_onError,
k_afterConfirm,
k_beforeMask,
k_afterReconnect,
k_img;
k_onError = function(k_response) {
var k_i, k_cnt, k_requests, k_error;
if (true !== kerio.waw.ui.activation.k_wizard.k_licenseDialog) {
kerio.waw.ui.activation.k_wizard.k_hideLoading(); }
if (k_response.k_decoded && k_response.k_decoded.result instanceof Array) {
k_requests = k_response.k_decoded.result;
for (k_i = 0, k_cnt = k_requests.length; k_i < k_cnt; k_i++) {
if (k_requests[k_i].error) {
k_error = k_requests[k_i].error;
break;
}
} if (!k_error) {
return;
}
}
else {
k_error = k_response.k_decoded.error;
}
if (kerio.lib.k_ajax.k_EXPIRED_SESSION_ERROR_CODE === k_error.code) { window.onbeforeunload = function() {
return kerio.lib.k_tr('The server was probably restarted before the activation wizard could have finished. Activation wizard needs to be restarted in order to proceed with the activation.', 'activation');
};
}
};
k_afterConfirm = function(k_confirmed, k_wasTimeout) {
if (k_wasTimeout) {
kerio.waw.ui.activation.k_wizard.k_hideLoading();
kerio.lib.k_alert({ k_title: kerio.lib.k_tr('Activation Wizard', 'activation'),
k_msg: kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_serverTimeout,
k_icon: 'error'
});
}
};
k_beforeMask = function() {
return false;
};
k_afterReconnect = function(k_success, k_revert) {
if (k_success) {
if (k_revert) { window.onbeforeunload = kerio.waw.shared.k_methods.k_emptyFunction;
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Activation Wizard', 'activation'),
k_msg: [
kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_revertWarningMessage,
'<br><br>',
kerio.lib.k_tr('Activation wizard will now restart to ensure activation will proceed correctly.', 'activation')
].join(''),
k_icon: 'warning',
k_callback: function() {
kerio.waw.k_restart(true, true); }
});
}
else { kerio.waw.ui.activation.k_wizard.k_hideLoading();
kerio.lib.k_alert({ k_title: kerio.lib.k_tr('Activation Wizard', 'activation'),
k_msg: kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_serverTimeout,
k_icon: 'error'
});
}
}
else { window.onbeforeunload = kerio.waw.shared.k_methods.k_emptyFunction;
kerio.waw.ui.activation.k_wizard.k_getPage(kerio.waw.ui.activation.k_wizard._k_loadingPageId).k_setVisible('k_waiting', false);
kerio.waw.ui.activation.k_wizard.k_showLoading(
kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_serverLostTitle,
kerio.lib.k_tr('Please make sure that %1 is still running and that you can connect to it from the browser.', 'activation', {k_args:['Kerio Control']})
);
kerio.lib.k_alert({ k_title: kerio.lib.k_tr('Activation Wizard', 'activation'),
k_msg: kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_serverLostTitle,
k_icon: 'error'
});
}
};
k_requests.on('beforeError', k_onError, this);
k_requests.on('beforeReconnectError', k_onError, this);
k_requests.on('beforeMask', k_beforeMask, this); k_requests.on('afterConfirm', k_afterConfirm);
k_requests.on('afterReconnect', k_afterReconnect);
k_img = document.createElement('img');
k_img.src = 'weblib/int/lib/img/errorBig.png?v=8629';
k_img.id = 'k_alertErrorIcon';
k_img.className = 'bigIcon hidePrecachedImage';
document.body.appendChild(k_img);
},

k_closeHandler: function(k_page) {
if ('k_privacyPolicyTerms' === k_page.k_id) {
this.k_hideLoading('k_registration');
}
else if (this.k_licenseDialog) {
this.k_reset();
this.k_close(true);
if (this._k_callbackScope) {
this._k_callback.call(this._k_callbackScope);
}
if (this._k_origOnBeforeUnload) {
window.onbeforeunload = this._k_origOnBeforeUnload;
}
}
else {
this.k_alert({
k_icon: 'warning',
k_msg: kerio.lib.k_tr('You can\'t close this Activation wizard before completing all steps!', 'activation')
});
}
return false;
}, 
k_warnBeforeClose: function() {
return kerio.lib.k_tr('In case you close this Activation wizard before completing all steps, you leave your %1 unsecured!', 'activation', { k_args: [ kerio.waw.ui.activation.k_productName ]});
}, 
k_initWizard: function(k_page) {
var
k_activation =   kerio.waw.ui.activation,
k_needPassword = k_activation.k_needPassword,
k_needClientStatistics = k_activation.k_needClientStatistics,
k_needCentralManagement = k_activation.k_needCentralManagement,
k_needLicense =  k_activation.k_needLicense;
if (kerio.waw.shared.k_methods.k_isAuditor()) {
return 'k_denyWizard';
}
if (this.k_licenseDialog) {
return 'k_testConnection';
}
k_page = this.k_getPage('k_eula');
k_page.k_wizard.k_isOnlineRegSkipped = false;
if (k_needLicense) {
if (kerio.waw.shared.k_methods.k_isLinux()) {
if (this.k_isFirstNoConnection) {
this.k_startTestConnection(true); k_page.k_nextPageId = 'k_testConnection';
}
else {
k_page.k_nextPageId = 'k_connectionSettings';
}
}
else {
this.k_startTestConnection(true); k_page.k_nextPageId = 'k_testConnection';
}
if (k_needPassword || k_needClientStatistics || k_needCentralManagement) {
k_page.k_setVisible('k_textGuide', false);
}
}
else if (k_needClientStatistics) {
return 'k_clientStatistics';
}
else if (k_needPassword || k_needCentralManagement) {
return 'k_adminPassword';
}
else { k_page.k_nextPageId = this.k_NO_PAGE;
k_page.k_isClosePage = false;
kerio.lib.k_reportError('Activation wizard started but both license and admin password are reported to be valid.', 'activation', 'k_initWizard');
}
}, 
k_onPasswordChange: function(k_page, k_element, k_value) {
if (k_value) {
k_page.k_isPasswordEdited = true;
}
k_page.k_validatePassword();
}, 
k_onSetClientStatistics: function(k_page) {
this.k_showLoading(kerio.lib.k_tr('Saving…', 'common'));
kerio.waw.requests.k_send({
k_jsonRpc: {
method: 'ProductInfo.setClientStatistics',
params: { setting: k_page.k_getItem('sendClientStatistics').k_getValue() }
},
k_scope: this,
k_callback: function() {
var
k_activation = kerio.waw.ui.activation,
k_pageId;
if (k_activation.k_needPassword || k_activation.k_needCentralManagement) {
k_pageId = 'k_adminPassword';
}
else {
k_pageId = 'k_finish';
}
this.k_hideLoading(k_pageId);
}
});
return false; },

k_onPasswordFinish: function(k_page) {
var k_passwrodFieldsValid;
if (kerio.waw.activation.k_needPassword) {
k_passwrodFieldsValid = k_page.k_validatePassword(false);
if (false === k_passwrodFieldsValid) {
return false;
}
}
if (kerio.waw.activation.k_needCentralManagement) {
k_page.k_saveCentralManagement();
}
return false; }, 
k_getDefaultAlertRule: function(k_admin) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_ALERT_SYSTEM_ID = k_CONSTANTS.k_ALERT_SYSTEM_ID,
k_emailAddressCheckbox = this.k_getItem('k_emailAddressCheckbox');
return {
addressee: {
email: '',
type: k_CONSTANTS.AddresseeType.AddresseeUser,
user: {
id: k_admin.id,
name: k_admin.name,
isGroup: k_admin.isGroup,
domainName: k_admin.domainName
}
},
alertList: [
k_ALERT_SYSTEM_ID.k_BACKUP,
k_ALERT_SYSTEM_ID.k_DHCP,
k_ALERT_SYSTEM_ID.k_CONNECTIVITY,
k_ALERT_SYSTEM_ID.k_LICENSE,
k_ALERT_SYSTEM_ID.k_LICENSESIZE,
k_ALERT_SYSTEM_ID.k_LOCALCA,
k_ALERT_SYSTEM_ID.k_LOWSPACE,
k_ALERT_SYSTEM_ID.k_NEWVERSION
],
enabled: k_emailAddressCheckbox.k_getValue(),
logEventList: [],
ruleEventList: [],
validTimeRange: {
id: '',
invalid: false,
name: ''
}
};
},

k_validatePassword: function(k_silent) {
var
k_closureWizard = this.k_wizard,
k_tr = kerio.lib.k_tr,
k_passwordElement = this.k_getItem('k_password'),
k_passwordConfirmationElement = this.k_getItem('k_passwordConfirm'),
k_password = k_passwordElement.k_getValue(),
k_passwordConfirmation = k_passwordConfirmationElement.k_getValue(),
k_emailAddressCheckbox = this.k_getItem('k_emailAddressCheckbox'),
k_emailAddressElement = this.k_getItem('k_emailAddress'),
k_callback;
if (false === k_silent) {

k_callback = function(k_answer){

if ('no' !== k_answer) {
k_closureWizard.k_showLoading(
kerio.lib.k_tr('Setting Admin password…', 'activation'),
kerio.lib.k_tr('Activation wizard is now setting the new password for Admin user.', 'activation')
);
kerio.waw.ui.activation.k_translateTrafficRules(function() {
k_closureWizard.k_preloader.k_isReady('k_adminData', {
k_scope: k_closureWizard,
k_callback: k_closureWizard.k_saveAdminPassword
});
});
}
}; }
k_passwordElement.k_markInvalid(false);
k_passwordConfirmationElement.k_markInvalid(false);
k_emailAddressElement.k_markInvalid(false);
if (false === k_silent && '' === k_password) {
kerio.lib.k_alert({
k_title: k_tr('Admin Password', 'activation'),
k_msg: k_tr('The password of the Admin user cannot be empty.', 'activation'),
k_icon: 'warning',
k_scope: this
}); k_passwordElement.k_markInvalid(true);
return false;
}
if (kerio.waw.shared.k_methods.k_isLinux()) { if (!kerio.waw.shared.k_methods.k_validators.k_isAsciiString(k_password)) {
if (false === k_silent) {
this.k_wizard.k_alert({
k_msg: k_tr('For technical reasons, the password of the Admin user may contain ASCII characters only.', 'activation'),
k_icon: 'warning'
});
}
k_passwordElement.k_markInvalid(true);
return false;
}
}
if (k_password !== k_passwordConfirmation) {
if (false === k_silent) {
this.k_wizard.k_alert({
k_icon: 'warning',
k_msg: k_tr('Password and password confirmation do not match.', 'activation')
});
}
k_passwordConfirmationElement.k_markInvalid(true);
return false;
}
if (this.k_doSetDefaultAlert && k_emailAddressCheckbox.k_isChecked() && '' === k_emailAddressElement.k_getValue()) {
k_emailAddressElement.k_markInvalid(true);
k_emailAddressElement.k_focus();
this.k_emptyEmailValidation = true;
return false;
}
if (k_callback) {
k_callback.call(k_closureWizard);
}
return true;
},
k_translateTrafficRules: function(k_onComplete) {
kerio.waw.requests.k_sendBatch(
[
{
k_jsonRpc: {
method: 'TrafficPolicy.get'
}
},
{
k_jsonRpc: {
method: 'TrafficPolicy.getDefaultRule'
}
}
],
{
k_scope: this,
k_callback: function(k_responses, k_success) {
var
k_trafficRules = k_responses[0].list,
k_defaultTrafficRule = k_responses[1].rule;
k_trafficRules.forEach(function(k_rule) {
k_rule.name = kerio.lib.k_tr(k_rule.name, 'policyWizard');
k_rule.description = kerio.lib.k_tr(k_rule.description, 'policyWizard');
});
kerio.waw.requests.k_send({
k_scope: this,
k_jsonRpc: {
method: 'TrafficPolicy.set',
params: {
rules: k_trafficRules,
defaultRule: k_defaultTrafficRule
}
},
k_callback: function(k_response, k_success) {
if ('function' === typeof k_onComplete) {
k_onComplete.apply(this, arguments);
}
}
});
}
}
);
},

k_saveCentralManagement: function() {
var k_adminPasswordPage = this.k_wizard.k_adminPasswordPage;
this.k_wizard.k_openAppManager = k_adminPasswordPage.k_openAppManager.k_getValue();
this.k_wizard.k_showLoading(kerio.lib.k_tr('Saving…', 'common'));
kerio.waw.requests.k_send({
k_jsonRpc: {
method: 'CentralManagement.confirmAppManager',
params: {}
},
k_scope: this.k_wizard,
k_callback: function() {
if (k_adminPasswordPage.k_isFinishPage) {
window.onbeforeunload = kerio.waw.shared.k_methods.k_emptyFunction;
if (this.k_openAppManager) {
this.k_showLoading(kerio.lib.k_tr('Starting registration…', 'common'));
kerio.waw.requests.k_send({
k_jsonRpc: {
method: 'CentralManagement.registerInAppManager',
params: {}
},
k_scope: this,
k_callback: function(k_response, k_success) {
if (k_success && k_response.k_decoded.info && k_response.k_decoded.info.registrationbUrl) {
k_adminPasswordPage.k_appManagerRegistrationUrl = k_response.k_decoded.info.registrationbUrl;
}
if (k_adminPasswordPage.k_appManagerRegistrationUrl) {
kerio.lib.k_openWindow(k_adminPasswordPage.k_appManagerRegistrationUrl, '_blank');
}
document.location.reload(true);
}
});
}
else {
document.location.reload(true);
}
}
}
});
return false; },

k_saveAdminPassword: function(k_response, k_isOk) {
if (!k_isOk) {
kerio.lib.k_reportError('Cannot get Admin\'s data to set the password', 'activation', 'k_saveAdminPassword');
return;
}
var
k_adminPasswordPage = this.k_getPage('k_adminPassword'),
k_shared = kerio.waw.shared,
k_admin = k_response.list[0],
k_requests = [];
k_shared.k_methods.k_mergeObjects({
password: k_adminPasswordPage.k_getItem('k_password').k_getValue(),
passwordChanged: true
}, k_admin.credentials);
if (k_adminPasswordPage.k_doSetDefaultAlert) {
if (k_adminPasswordPage.k_getItem('k_emailAddressCheckbox').k_isChecked()) {
k_admin.email = k_adminPasswordPage.k_getItem('k_emailAddress').k_getValue();
}
k_requests.push({
k_jsonRpc: {
method: 'Alerts.setSettings',
params: {
config: [ k_adminPasswordPage.k_getDefaultAlertRule(k_admin) ]
}
}
});
}
k_requests.push({
k_jsonRpc: {
method: 'Users.set',
params: {
userIds: [ k_admin.id ],
domainId: k_shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE,
details: k_admin
}
}
});
kerio.waw.requests.k_sendBatch(
k_requests,
{
k_scope: this,

k_callback: function(k_response, k_success) {
var
k_passwordResponse = k_response instanceof Array ? k_response[k_response.length - 1] : k_response;
if (!k_success || 0 !== k_passwordResponse.errors.length) {
this.k_hideLoading();
return;
}
kerio.waw.requests.k_send({
k_jsonRpc: {
method: 'Session.logout'
},
k_scope: this,

k_callback: function() {
this.k_showPage('k_finish');
}
});
}
}
);
}, 
k_changeLanguage: function(k_page, k_item, k_language) {
var
k_tr = kerio.lib.k_tr,
k_wizard = k_page.k_wizard,
k_trCache = {
k_title: k_tr('Loading selected language…', 'activation'),
k_description: k_tr('Activation wizard will be restarted in order to use a different language.', 'activation')
};
k_wizard.k_showLoading(k_trCache.k_title, k_trCache.k_description);
k_wizard.k_preloader.k_remove('k_initLanguage'); kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Session.setSettings',
params: { settings: { admin: { language: k_language } } }
},
k_callback: function(){
window.onbeforeunload = kerio.waw.shared.k_methods.k_emptyFunction; document.location.reload();
}
});
}, 
k_goToCorrectPage: function(k_followingPageId) {
if (kerio.waw.shared.k_methods.k_isLinux() && !this.k_wizard.k_timeSettingsPage.k_isVisitedFromConnectivity) {
this.k_wizard.k_timeSettingsPage.k_followingPageId = k_followingPageId;
k_followingPageId = 'k_timeSettings';
}
this.k_wizard.k_showPage(k_followingPageId);
},

k_startUnregisteredTrial: function() {
kerio.waw.ui.activation.k_goToCorrectPage('k_unregisteredTrial');
},

k_acceptUnregisteredTrial: function(k_page) {
var k_tr = kerio.lib.k_tr;
k_page.k_wizard.k_showLoading(
k_tr('Activating unregistered trial…', 'activation'),
k_tr('Activation wizard is applying unregistered trial limitations.', 'activation', { k_args: [ kerio.waw.ui.activation.k_productName ] })
);
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'ProductInfo.acceptUnregisteredTrial'
},
k_scope: k_page.k_wizard,
k_onError: kerio.waw.shared.k_methods.k_ignoreErrors, 
k_callback: function(k_response, k_success) {
var
k_pageId;
if (k_success && k_response.k_isOk) {
k_pageId = this.k_unregisteredTrialPage.k_nextPageId;
k_pageId = (kerio.lib.K_Wizard2.prototype.k_NO_PAGE === k_pageId) ? 'k_finish' : k_pageId;
this.k_showPage(k_pageId);
}
else {
this.k_hideLoading(); this.k_goBack();      kerio.lib.k_alert({
k_title: kerio.lib.k_tr('Unregistered trial', 'activation'),
k_msg: [
kerio.lib.k_tr('The server could not activate an unregistered trial version.', 'activation'),
'<br/><br/>',
kerio.lib.k_tr('Please check your server connection and try again later.', 'activation')
].join(''),
k_icon: 'warning'
});
}
}
});
return false; }, 
k_skipToLicenseImport: function() {
this.k_isOnlineRegSkipped = true;
kerio.waw.requests.k_sendBatch({ k_jsonRpc: { method: 'Interfaces.cancelConnectivityTest' }}, { k_isSilent: true });
this.k_startLicenseImport();
},

k_startLicenseImport: function() {
var
k_wizard = this.k_wizard || this;
k_wizard.k_hideLoading('k_importLicense');
if (kerio.waw.shared.k_methods.k_isLinux()) {
k_wizard.k_timeSettingsPage.k_isVisitedFromConnectivity = true;
}
},

k_resetImportLicensePage: function(k_page) {
var k_WAW_METHODS = kerio.waw.shared.k_methods;
if (k_WAW_METHODS.k_isIos()) {
if (k_WAW_METHODS.k_isBoxEdition()) {
k_page.k_setVisible('k_blockActivation', true);
k_page.k_setVisible(['k_importLicenseRow', 'k_skipButtonsContainer'], false);
k_page.k_nextPageId = this.k_NO_PAGE; }
else {
this.k_showPage('k_unregisteredTrial');
}
}
else {
k_page.k_getItem('licenseFile').k_reset();
k_page.k_getItem('licenseFileName').k_reset();
}
}, 
k_checkLicenseKey: function(k_page, k_item, k_value) {
var
k_name = k_value.split('.'),
k_valueParts;
if (('key' === k_name[k_name.length - 1]) || ('KEY' === k_name[k_name.length - 1])) {
k_valueParts = k_value.split(/[\\\/]/);
k_value = k_valueParts[k_valueParts.length - 1];
k_page.k_getItem('licenseFileName').k_setValue(k_value);
k_page.k_wizard.k_nextButton.k_setDisabled(false);
}
else {
k_page.k_wizard.k_alert({
k_icon: 'warning',
k_msg: kerio.lib.k_tr('Please select only files with the *.key extension!', 'activation')
});
k_item.k_reset();
}
}, 
k_importLicense: function(k_page) {
var
k_tr = kerio.lib.k_tr,
k_defaultRequestParams;
if ('' === k_page.k_getItem('licenseFileName').k_getValue()) {
this.k_alert({
k_icon: 'warning',
k_msg: k_tr('Please select a valid file.', 'activation')
});
return false;
}
k_defaultRequestParams = kerio.lib.k_ajax.k_getDefaultRequestParams();
k_defaultRequestParams = k_defaultRequestParams || {};
k_defaultRequestParams.k_timeout = 120000;
kerio.lib.k_ajax.k_setDefaultRequestParams(k_defaultRequestParams);
k_page.k_getItem('licenseFile').k_upload();
this.k_showLoading(
k_tr('Uploading license file…', 'activation'),
k_tr('Activation wizard is sending your license file to %1 and will continue as soon as the license is accepted.', 'activation', { k_args: [ kerio.waw.ui.activation.k_productName ] })
);
return false;
}, 
k_finishLicenseImport: function(k_page, k_item, k_response) {
var
k_pageId;
if (k_response.k_isOk) {
if (kerio.waw.ui.activation.k_needClientStatistics) {
k_pageId = 'k_clientStatistics';
}
else if (kerio.waw.ui.activation.k_needPassword) {
k_pageId = 'k_adminPassword';
}
else {
k_pageId = 'k_finish';
}
k_page.k_wizard.k_showPage(k_pageId);
}
else {
k_page.k_wizard.k_hideLoading(); }
},

k_startTestConnection: function(k_background, k_forceReset) {
var k_preloader = this.k_preloader;
if (true === k_forceReset) {
k_preloader.k_remove('k_startConnection');
k_preloader.k_remove('k_testConnection');
}
this.k_preloader.k_add({
k_id: 'k_startConnection',
k_jsonRpc: {
method: 'Interfaces.startConnectivityTest'
},
k_scope: this,

k_callback: function(k_response, k_success) {
if (k_success) {
this.k_preloader.k_add({
k_id: 'k_testConnection',
k_jsonRpc: {
method: 'Interfaces.connectivityTestStatus'
},
k_scope: this,
k_callback: this._k_testConnectionStatus
});
}
else {
kerio.lib.k_reportError('Cannot start connection test', 'activation', 'k_startTestConnection');
}
}
});
if (true === k_background) {
this._k_testConnectionStatus = this._k_testConnectionStatusSimple;
}
else {
this.k_isOnlineRegSkipped = false;
this.k_showLoading(
kerio.lib.k_tr('Testing connectivity…', 'activation'),
kerio.lib.k_tr('%1 is testing connectivity to the Internet which is required for online activation.', 'activation', { k_args: [ kerio.waw.ui.activation.k_productName ] }),
kerio.waw.ui.activation.k_skipToLicenseImport
);
this._k_testConnectionStatus = this._k_testConnectionStatusFinish;
}
}, 
_k_testConnectionStatusSimple: function(k_result, k_isOk) {
return (k_isOk && k_result.status !== kerio.waw.shared.k_CONSTANTS.ConnectivityStatus.ConnectivityChecking); }, 
_k_testConnectionStatusFinish: function(k_result, k_isOk) {
var
ConnectivityStatus = kerio.waw.shared.k_CONSTANTS.ConnectivityStatus;
if (!k_isOk) {
return false;
}
switch (k_result.status) {
case ConnectivityStatus.ConnectivityOk:
this.k_isConnectivityOk = true;
if (kerio.waw.shared.k_methods.k_isLinux()) { this.k_timeSettingsPage.k_isVisitedFromConnectivity = true;
this.k_timeSettingsPage.k_followingPageId = undefined; this.k_hideLoading('k_timeSettings');
}
return true; case ConnectivityStatus.ConnectivityError:
if (!this.k_isOnlineRegSkipped) {
if (kerio.waw.shared.k_methods.k_isLinux() && this.k_isFirstNoConnection) {
this.k_isFirstNoConnection = false;
this.k_hideLoading('k_connectionSettings');
}
else {
this.k_hideLoading('k_noConnection');
}
}
return true; case ConnectivityStatus.ConnectivityChecking:
return false; default:
kerio.lib.k_reportError('Unsupported connection status ' + k_result.status, 'activation', '_k_testConnectionStatusFinish');
return true; } }, 
k_getLanguageList: function(){
var
k_LANGUAGE_SETTINGS = kerio.waw.shared.k_CONSTANTS.k_LANGUAGE_SETTINGS,
k_allLanguages = kerio.lib.k_constants.k_languageList,
k_supportedLanguages = [],
k_i, k_cnt,
k_lang;
for (k_i = 0, k_cnt = k_allLanguages.length; k_i < k_cnt; k_i++) {
if ('sk' == k_allLanguages[k_i].k_id) {
continue;
}
k_lang = kerio.lib.k_cloneObject(k_allLanguages[k_i]);
if (k_LANGUAGE_SETTINGS.k_IS_BRITISH_PREFERRED && k_LANGUAGE_SETTINGS.k_LANGUAGE_ENGLISH == k_lang.k_id) {
k_lang.k_className += ' gb';
}
k_supportedLanguages.push(k_lang);
}
return k_supportedLanguages;
}, 
_k_loadInterfaces: function() {
var
k_methods = kerio.waw.shared.k_methods,
k_isBox = k_methods.k_isBoxEdition(),
k_isLinux = k_methods.k_isLinux(),
k_requests,
k_query;
if (k_isLinux) {
k_query = kerio.waw.shared.k_DEFINITIONS.k_get('k_interfaceEthernetRasQuery');
}
else {
k_query = kerio.waw.shared.k_DEFINITIONS.k_get('k_interfaceEthernetQuery');
}
this.k_showLoading(
kerio.lib.k_tr('Loading interface settings…', 'activation'),
kerio.lib.k_tr('Connectivity test failed. Activation wizard is loading interface settings for manual configuration.', 'activation'),
undefined,
false );
k_requests = [
{
k_restrictions: {
k_isBox: [true]
},
k_jsonRpc: {
method: 'Ports.get'
},
k_scope: this,

k_callback: function(k_response, k_success) {
if (k_success) {
this.k_interfacePorts = k_response.list;
}
} },
{
k_jsonRpc: {  method: 'Session.getConnectedInterface'
},
k_callback: function(k_interface, k_success) {
if (k_success) {
this.k_connectedInterfaceId = k_interface.id;
}
},
k_scope: this
},
{
k_jsonRpc: {
method: 'Interfaces.get',
params: {
sortByGroup:true, query: k_query
}
}, k_scope: this,

k_callback: function(k_response, k_success) {
if (!k_success) {
this.k_hideLoading('k_welcome'); return;
}
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_isBox = kerio.waw.shared.k_methods.k_isBoxEdition(),
InterfaceType = k_CONSTANTS.InterfaceType,
k_PPPoE_ENCAPSULATION = k_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe,
k_interfaces = k_response.list,
k_unsupportedIndexList = [],
k_cnt = k_interfaces.length,
k_i,
k_interface;
this.k_interfaces = k_interfaces;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_interface = k_interfaces[k_i];
if (k_isBox) { var internetPortId = kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.boxEdition == kerio.waw.shared.k_CONSTANTS.box_id_ng310 ? "8" : "1";
if (-1 < k_interface.ports.indexOf(internetPortId)) {
this.k_interfaces._k_port1 = k_interface;
if (k_interface.id === this.k_connectedInterfaceId) {
k_interface.k_isLanCollision = true;
this.k_getPage('k_connectionSettings').k_setVisible('k_spacer', false); this.k_getPage('k_connectionSettings').k_setVisible('k_connectedPortWarning');
this.k_getPage('k_connectionSettings').k_setVisible('k_connectedLanWarning'); }
break; }
}
else { if (k_interface.group !== kerio.waw.shared.k_CONSTANTS.InterfaceGroupType.Internet) {
k_interface.k_isLanCollision = true; }
switch (k_interface.type) {
case InterfaceType.Ethernet:
k_interface.k_icon = 'interfaceEthernet';
k_interface.k_ethernetMode = k_interface.mode;
if (k_PPPoE_ENCAPSULATION === k_interface.encap) {
k_interface.k_ethernetMode = k_PPPoE_ENCAPSULATION;
}
k_interfaces[k_interface.id] = k_interface; break;
default:
k_unsupportedIndexList.push(k_i);
break;
}
}
} if (k_isBox) {
this.k_getPage('k_connectionSettings').k_setData(
kerio.waw.shared.k_methods.k_mapProperties(this.k_interfaces._k_port1, this.k_interfaceMap),
true
); }
else {
k_unsupportedIndexList.reverse();
for (k_i = 0, k_cnt = k_unsupportedIndexList.length; k_i < k_cnt; k_i++) {
k_interfaces.splice(k_unsupportedIndexList[k_i], 1);
}
this.k_getPage('k_connectionSettings').k_getItem('k_interface').k_setData(k_interfaces);
this.k_getPage('k_connectionSettings').k_getItem('k_interface').k_setValue(k_interfaces[0].id, true); this.k_getPage('k_connectionSettings').k_getItem('k_ethernetMode').k_setValue(k_interfaces[0].k_ethernetMode, true); }
this.k_hideLoading('k_connectionSettings');
} },
{
k_jsonRpc: {
method: 'Interfaces.getConnectivityConfig'
},
k_scope: this,

k_callback: function(k_response, k_success) {
if (k_success) {
this.k_connectivityData = k_response.config;
}
} },
{
k_jsonRpc: {
method: 'TrafficPolicy.get'
},
k_scope: this,
k_callback: function(k_response, k_success) {
this.k_trafficRules = [];
if (k_success) {
this.k_trafficRules = k_response.list; }
}
},
{
k_jsonRpc: {
method: 'TrafficPolicy.getDefaultRule'
},
k_scope: this,
k_callback: function(k_response, k_success) {
if (k_success) {
this.k_trafficRules.k_defaultRule = k_response.rule; }
}
}
]; kerio.waw.requests.k_sendBatch(kerio.lib.k_applyRestrictionToConfig(k_requests, { k_isBox: k_isBox }),

{ k_callback: function(k_response, k_success) {
if (!k_success) {
this.k_hideLoading();
}
}
});
}, 
_k_changeInterface: function(k_page, k_item, k_value) {
var
k_WAW_METHODS = kerio.waw.shared.k_methods,
InterfaceType = kerio.waw.shared.k_CONSTANTS.InterfaceType,
k_interfaces = k_page.k_wizard.k_interfaces,
k_interface = k_interfaces[k_value]; switch (k_interface.type) {
case InterfaceType.Ethernet:
k_page.k_setVisible('k_connectedInterfaceWarning', (k_page.k_wizard.k_connectedInterfaceId === k_interface.id));
k_page.k_setVisible('k_connectedLanWarning', (k_page.k_wizard.k_connectedInterfaceId === k_interface.id && true === k_interface.k_isLanCollision));
if (kerio.waw.shared.k_CONSTANTS.InterfaceModeType.k_PPPoE === k_interface.mode) {
k_interface.k_userName = k_interface.ras.credentials.userName;
k_interface.k_password = k_interface.ras.credentials.password;
k_interface.k_pppoeDnsAutodetected = k_interface.dnsAutodetected;
k_interface.k_pppoeDnsServers = k_interface.dnsServers;
}
k_page.k_setData(k_WAW_METHODS.k_mapProperties(k_interface, k_page.k_wizard.k_interfaceMap), true); delete k_interface.k_userName;
delete k_interface.k_password;
delete k_interface.k_pppoeDnsAutodetected;
delete k_interface.k_pppoeDnsServers;
break;
case InterfaceType.Ras:
break;
default:
kerio.lib.k_reportError('Switched to unsupported interface', 'activationWizard', '_k_changeInterface');
} }, 
_k_checkLanCollision: function(k_page) {
var k_isBox = kerio.waw.shared.k_methods.k_isBoxEdition(),
k_interfaces = this.k_interfaces,
k_interface = (k_isBox) ? k_interfaces._k_port1 : k_interfaces[k_page.k_getData().k_interface], k_isLanCollision = (k_interface.k_isLanCollision && k_page.k_wizard.k_connectedInterfaceId === k_interface.id);
if (!k_isLanCollision) {
return k_page.k_wizard._k_saveConnectivitySettings(k_page);
}
kerio.lib.k_confirm({
k_title: kerio.lib.k_tr('Confirm Action', 'common'),
k_msg: [
'<b>',
kerio.lib.k_tr('A new traffic rule to allow access to the administration from the Internet will be created.', 'activation'),
'</b><br><br><i>',
kerio.lib.k_tr('Your interfaces settings and traffic policy rules will be changed. After the activation is finished, you can consolidate the rules using the Policy wizard.', 'activation'),
'</i><br><br>',
kerio.lib.k_tr('Do you want to continue?', 'common')
].join(''),
k_scope:  {
k_wizard: k_page.k_wizard,
k_page: k_page
},
k_callback: function(k_answer) {
if ('yes' === k_answer) {
this.k_wizard._k_saveConnectivitySettings(this.k_page);
}
}
});
return false; }, 
_k_saveEthernetSettings: function(k_page) {
var
k_shared = kerio.waw.shared,
k_WAW_METHODS = k_shared.k_methods,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
InterfaceType = k_WAW_CONSTANTS.InterfaceType,
InterfaceModeType = k_WAW_CONSTANTS.InterfaceModeType,
InterfaceEncapType = k_WAW_CONSTANTS.InterfaceEncapType,
InterfaceGroupType = k_WAW_CONSTANTS.InterfaceGroupType,
ConnectivityType = k_WAW_CONSTANTS.ConnectivityType,
k_interfaces = this.k_interfaces,
k_interface = k_interfaces[k_page.k_getData().k_interface], k_isChanged = k_page.k_isChanged(),
k_data = k_page.k_getChangedData(),
k_ethernetMode = k_page.k_getItem('k_ethernetMode').k_getValue(),
k_requests = [],
k_i, k_cnt, k_item;
if (!k_isChanged && InterfaceModeType.InterfaceModeAutomatic !== k_ethernetMode) { this.k_startTestConnection(false, true);
return false;
}
if (k_interface.k_isLanCollision) {
this._k_allowInternetAccess(k_interface);
}

k_requests.k_add = function(k_item) {
this.push({
k_jsonRpc: {
method: 'Interfaces.set',
params: {
ids: [ k_item.id ],
details: k_item
}
}
});
}; switch (k_interface.type) {
case InterfaceType.Ethernet:
k_data = k_WAW_METHODS.k_mapProperties(k_data, this.k_interfaceMap); if (InterfaceEncapType.InterfaceEncapPppoe === k_ethernetMode) {
k_page.k_setPppoeData(k_data, k_page);
}
k_data.group = InterfaceGroupType.Internet; k_WAW_METHODS.k_mergeObjects(k_data, k_interface); delete k_interface.k_ethernetMode;
delete k_interface.k_icon;
delete k_interface.k_isLanCollision;
k_requests.k_add(k_interface);
for (k_i = 0, k_cnt = k_interfaces.length; k_i < k_cnt; k_i++) {
k_item = k_interfaces[k_i];
if (k_item.id !== k_interface.id) {
k_item.group = (InterfaceGroupType.Internet === k_item.group ? InterfaceGroupType.Other : k_item.group); k_requests.k_add(k_item);
}
}
if (this.k_connectivityData.mode !== ConnectivityType.Persistent) {
k_requests.push({
k_jsonRpc: {
method: 'Interfaces.setConnectivityConfig',
params: {
config: k_WAW_METHODS.k_mergeObjects({mode: ConnectivityType.Persistent}, this.k_connectivityData)
}
}
});
}
k_requests.push({
k_jsonRpc: {
method: 'Interfaces.apply',
params: {
revertTimeout: 600
}
},
k_isLastRequest: true });
this.k_showLoading(
kerio.lib.k_tr('Saving new interfaces configuration…', 'activation'),
kerio.lib.k_tr('When new configuration will be ready to use, %1 will test connectivity again.', 'activation', { k_args: [ kerio.waw.ui.activation.k_productName ] } )
);
kerio.waw.requests.k_sendBatch(
k_requests,
{
k_scope: this,

k_callback: function(k_response, k_success) {
if (k_success) {
this.k_interfaces = null; this.k_startTestConnection(false, true);
}
else {
this.k_hideLoading();
}
}, k_mask: false
}
);
break;
case InterfaceType.Ras:
break;
default:
kerio.lib.k_reportError('Switched to unsupported interface', 'activationWizard', '_k_changeInterface');
} return false;
}, 
_k_saveBoxSettings: function(k_page) {
var
k_shared = kerio.waw.shared,
k_WAW_METHODS = k_shared.k_methods,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
InterfaceModeType = k_WAW_CONSTANTS.InterfaceModeType,
InterfaceGroupType = k_WAW_CONSTANTS.InterfaceGroupType,
ConnectivityType = k_WAW_CONSTANTS.ConnectivityType,
PortAssignmentType = k_WAW_CONSTANTS.PortAssignmentType,
k_interfaces = this.k_interfaces,
k_interfacePorts = this.k_interfacePorts,
k_port1 = k_interfaces._k_port1,
k_isChanged = k_page.k_isChanged(),
k_data = k_page.k_getData(),
k_ethernetMode = k_page.k_getItem('k_ethernetMode').k_getValue(),
k_requests = [],
k_i, k_cnt;
if (!k_isChanged && InterfaceModeType.InterfaceModeAutomatic !== k_ethernetMode) { this.k_startTestConnection(false, true);
return false;
}
if (k_port1.k_isLanCollision) {
this._k_allowInternetAccess(k_port1);
}
k_interfacePorts[0].assignment = PortAssignmentType.PortAssignmentStandalone;
for (k_i = 1, k_cnt = k_interfacePorts.length; k_i < k_cnt; k_i++) {
k_interfacePorts[k_i].assignment = PortAssignmentType.PortAssignmentSwitch;
}
k_data = k_WAW_METHODS.k_mapProperties(k_data, this.k_interfaceMap); if (k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapPppoe === k_ethernetMode) {
k_page.k_setPppoeData(k_data, k_page);
}
k_data.group = InterfaceGroupType.Internet; k_WAW_METHODS.k_mergeObjects(k_data, k_port1); delete k_port1.k_ethernetMode;
delete k_port1.k_icon;
delete k_port1.k_isLanCollision;
k_requests.push(
{
k_jsonRpc: {
method: 'Ports.set',
params: {
ports: k_interfacePorts,
revertTimeout: 600
}
}
},
{
k_jsonRpc: {
method: 'Interfaces.set',
params: {
ids: [ k_port1.id ],
details: k_port1
}
}
},
{
k_jsonRpc: {
method: 'Interfaces.setConnectivityConfig',
params: {
config: k_WAW_METHODS.k_mergeObjects({mode: ConnectivityType.Persistent}, this.k_connectivityData)
}
}
},
{
k_jsonRpc: {
method: 'Interfaces.apply',
params: {
revertTimeout: 600
}
},
k_isLastRequest: true }
);
this.k_showLoading(
kerio.lib.k_tr('Saving new interfaces configuration…', 'activation'),
kerio.lib.k_tr('When new configuration will be ready to use, %1 will test connectivity again.', 'activation', { k_args: [ kerio.waw.ui.activation.k_productName ] } )
);
kerio.waw.requests.k_sendBatch(
k_requests,
{
k_scope: this,

k_callback: function(k_response, k_success) {
if (k_success && kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
this.k_interfaces = null; this.k_startTestConnection(false, true);
}
else {
this.k_hideLoading();
}
},
k_mask: false
}
);
return false;
}, 
_k_allowInternetAccess: function(k_interface) {
var
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_WAW_DEFINITIONS = k_shared.k_DEFINITIONS,
k_rules = this.k_trafficRules,
k_rule;
k_rule = k_WAW_DEFINITIONS.k_get('k_predefinedTrafficRule', {
name: kerio.lib.k_tr('Remote administration', 'activation'), description: kerio.lib.k_tr('This rule was created by the Activation wizard to allow correct activation.', 'activation'),
color: k_WAW_CONSTANTS.k_POLICY_BCKG_COLORS.k_ORANGE,
source: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities,
firewall: false,
entities: [
k_WAW_DEFINITIONS.k_get('k_trafficEntity', {
type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityInterface,
interfaceCondition: {
type: k_WAW_CONSTANTS.InterfaceConditionType.RuleSelectedEntities,
interfaceType: k_interface.type,
enabled: k_interface.enabled,
selectedInterface: {
id: k_interface.id,
name: k_interface.name
}
}
}) ] },
destination: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities,
firewall: true,
entities: []
},
service: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleSelectedEntities,
entries: [
k_WAW_DEFINITIONS.k_get('k_trafficService', {
definedService: false,
protocol: k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP,
port: {
comparator: k_WAW_CONSTANTS.PortComparator.Equal,
ports: [( k_shared.k_methods.k_isConnectionSecured() ? k_WAW_CONSTANTS.k_WEB_PORT_SECURED : k_WAW_CONSTANTS.k_WEB_PORT_UNSECURED )]
}
})
]
},
action: k_WAW_CONSTANTS.RuleAction.Allow,
inspector: k_WAW_CONSTANTS.k_DEFAULT_INSPECTORS.k_NONE }); k_rules.unshift(k_rule); kerio.waw.requests.k_sendBatch({
k_jsonRpc: {
method: 'TrafficPolicy.set',
params: {
rules: k_rules,
defaultRule: k_rules.k_defaultRule
}
}
});
}, 
k_synchronizeTime: function() {
var
NtpUpdateProgress = this.NtpUpdatePhase.NtpUpdateProgress,
k_requests = [];
if (NtpUpdateProgress !== this.k_ntpStatus) {
k_requests.push({
k_jsonRpc: {
method: 'SystemConfig.setTimeFromNtp'
} });
this.k_ntpStatus = NtpUpdateProgress;
this.k_ntpSyncStart = new Date();
}
if (-1 === this.k_timeSynchronizationRequest) {
return;
}
k_requests.push({
k_jsonRpc: {
method: 'SystemConfig.getNtpStatus'
},

k_callback: function(k_response, k_success) {
var NtpUpdatePhase = this.NtpUpdatePhase;
if (k_success) {
this.k_ntpStatus = k_response.status.phase;
switch (k_response.status.phase) {
case NtpUpdatePhase.NtpUpdateProgress:
if (-1 !== this.k_timeSynchronizationRequest) { if (15000 > (new Date()) - this.k_ntpSyncStart) { this.k_synchronizeTime.defer(1000, this); }
else { this.k_loadTimeSettings();
}
}
return;
case NtpUpdatePhase.NtpUpdateError:
break;
}
}
else {
this.k_ntpStatus = NtpUpdatePhase.NtpUpdateError;
}
this.k_wizard.k_hideLoading('k_timeSettings');
}, k_scope: this
});
this.k_timeSynchronizationRequest = kerio.waw.requests.k_sendBatch(k_requests, {
k_mask: false
});
}, 
k_loadTimeSettings: function() {
kerio.waw.shared.k_tasks.k_add({
k_id: this.k_ANIMATE_CLOCKS,
k_interval: 500, k_scope: this,

k_run: function(){
var k_time;
if (this.k_isFocused) {
return false;
}
if (this.k_fieldTime.k_getInitialValue() !== this.k_fieldTime.k_getValue()) {
this.k_timeChanged = true;
return false;
}
k_time = (new Date()).add(Date.MILLI, this.k_timeOffsetServerClient);
this.k_saveTimeCaretPosition();
this.k_fieldTime.k_setValue(kerio.waw.shared.k_methods.k_formatTime({
hour: k_time.getHours(),
min: k_time.getMinutes(),
sec: k_time.getSeconds()
}), true);
this.k_restoreTimeCaretPosition();
return true;
}
}); kerio.waw.requests.k_sendBatch([{
k_jsonRpc: {
method: 'SystemConfig.get'
},
k_scope: this,
k_callback: function(k_response, k_success){
if (k_success) {
this.k_systemConfiguration = k_response.config;
}
} },
{
k_jsonRpc: {
method: 'SystemConfig.getTimeZones',
params: {
currentDate: kerio.waw.shared.k_methods.k_unixTimestampToDate((new Date()).getTime()/1000)
}
},
k_scope: this,
k_callback: function(k_response, k_success){
var
k_activation = kerio.waw.ui.activation,
k_selectTimeZone = this.k_getItem('k_selectTimeZone'),
k_dst = this.k_getItem('k_dst'),
k_currentDate = new Date(),
k_currentYear = k_currentDate.getFullYear ? k_currentDate.getFullYear() : k_currentDate.getYear(),
k_currentOffset = k_currentDate.getTimezoneOffset() * 60 * (-1),
k_winterOffset = (new Date(k_currentYear,0,1)).getTimezoneOffset() * 60 * (-1), k_summerOffset = (new Date(k_currentYear,6,31)).getTimezoneOffset() * 60 * (-1), k_timeSettingsPage = kerio.waw.ui.activation.k_wizard.k_getPage('k_timeSettings'),
k_defaultTimeZone = '(GMT) Greenwich Mean Time',
k_timeZoneBeijing = {
k_id: 'Beijing, Hong Kong, Kuala Lumpur, Singapore, Taipei, Urumqi',
k_winterOffset: 28800,
k_summerOffset: 28800
},
k_timeZoneMountain = {
k_id: 'Mountain Time (US & Canada)',
k_winterOffset: -25200,
k_summerOffset: -21600
},
k_timeZoneMoscow = {
k_id: 'Moscow, St.Petersburg, Volgograd',
k_winterOffset: 14400,
k_winterOffsetOld: 10800, k_summerOffset: 14400
},
k_timeZones,
k_timeZone,
k_timeZonesProperties,
k_name,
k_i,
k_cnt,
k_currentTimeZone = false;
if (k_success) {
this.k_timeChanged = true; k_timeZones = k_response.timeZones;
k_selectTimeZone.k_setData(k_timeZones);
k_timeZonesProperties = {};
if (!k_activation.k_needPassword && k_activation.k_needLicense) {
k_currentTimeZone = this.k_systemConfiguration.timeZoneId;
this.k_timeChanged = false;
}
else if ((k_timeZoneMoscow.k_winterOffset === k_winterOffset
|| k_timeZoneMoscow.k_winterOffsetOld === k_winterOffset)
&& k_timeZoneMoscow.k_summerOffset === k_summerOffset
) {
k_currentTimeZone = k_timeZoneMoscow.k_id;
}
else if (k_timeZoneMountain.k_winterOffset === k_winterOffset
&& k_timeZoneMountain.k_summerOffset === k_summerOffset
) {
k_currentTimeZone = k_timeZoneMountain.k_id;
}
else if (k_timeZoneBeijing.k_winterOffset === k_winterOffset
&& k_timeZoneBeijing.k_summerOffset === k_summerOffset
) {
k_currentTimeZone = k_timeZoneBeijing.k_id;
}
for (k_i = 0, k_cnt = k_timeZones.length; k_i < k_cnt; k_i++) {
k_timeZone = k_timeZones[k_i];
k_name = k_timeZone.name;
k_timeZonesProperties[k_timeZone.id] = {
k_id: k_timeZone.id,
k_name: k_name,
k_offset: k_timeZone.currentOffset * 1000,
k_hasDst: k_timeZone.winterOffset == k_timeZone.summerOffset ? false : true
};
if (
!k_currentTimeZone &&
k_timeZone.currentOffset === k_currentOffset &&
k_timeZone.winterOffset === k_winterOffset &&
k_timeZone.summerOffset === k_summerOffset
){
k_currentTimeZone = k_timeZone.id;
}
}
this.k_timeZonesProperties = k_timeZonesProperties;
if (!k_currentTimeZone) {
k_currentTimeZone = k_defaultTimeZone;
}
if (this.k_systemConfiguration
&& this.k_systemConfiguration.timeZoneId
&& this.k_systemConfiguration.timeZoneId === k_currentTimeZone
) {
this.k_timeChanged = false;
}
if (k_currentTimeZone) {
k_timeSettingsPage.k_systemConfiguration.timeZoneId = k_currentTimeZone;
k_selectTimeZone.k_setValue(k_currentTimeZone, true);
if(k_timeZonesProperties[k_currentTimeZone].k_hasDst){
k_dst.k_setValue(kerio.lib.k_tr('(This time zone has a daylight saving time period)', 'activation'));
}
}
k_timeSettingsPage.k_currentZoneOffset = (-1) * (new Date()).getTimezoneOffset() * 60 * 1000;
}
} },
{
k_jsonRpc: {
method: 'SystemConfig.getDateTime'
},
k_scope: this,
k_callback: function(k_response, k_success){
if (!k_success) {
return;
}
var
k_activation = kerio.waw.ui.activation;
if (!k_activation.k_needPassword && k_activation.k_needLicense) { this.k_setTimeOffset(k_response.config);
}
} }],
{
k_mask: false,
k_callback: function(k_response, k_success, k_params){
this.k_timeReady = true;
this.k_wizard.k_hideLoading('k_timeSettings');
},
k_scope: this
}); }, k_goToAppManagerWeb: function() {
kerio.lib.k_openWindow(kerio.waw.ui.activation.k_appManagerUrl, '_blank');
}
}; 
kerio.waw.ui.activation.K_Preloader = function() {
kerio.waw.ui.activation.K_Preloader.superclass.constructor.call(this);
this._k_requests = {};
};
kerio.lib.k_extend('kerio.waw.ui.activation.K_Preloader', Object, {


k_add: function(k_config) {
this._k_requests[k_config.k_id] = k_config;
kerio.waw.shared.k_methods.k_mergeObjects({
k_isReady: false,
k_isFailed: false,
k_result: null,
k_request: null
}, k_config);
this._k_send(k_config.k_id);
},

k_reset: function(k_id) {
var k_preload = this._k_getPreload(k_id);
this.k_remove(k_id);
this.k_add(k_preload);
},

k_abort: function(k_id) {
var k_preload = this._k_getPreload(k_id);
if (k_preload.k_isXhr) {
kerio.lib.k_ajax.k_abort(k_preload.k_request);
}
else {
kerio.waw.requests.k_abort(k_preload.k_request);
}
},

k_remove: function(k_id) {
var k_preload = this._k_getPreload(k_id, false);
if (!k_preload) { return;
}
this.k_abort(k_id);
k_preload.k_result = null;
k_preload.k_request = null;
delete this._k_requests[k_id];
},

_k_send: function(k_id) {
var k_preload = this._k_getPreload(k_id, false);
if (!k_preload) { return;
}
if ((k_preload.k_method && k_preload.k_method !== 'POST') || (k_preload.k_url && k_preload.k_url !== kerio.lib.k_ajax._k_defaultRequestParams.k_url)) {
k_preload.k_isXhr = true; k_preload.k_request = kerio.lib.k_ajax.k_request({
k_jsonRpc: k_preload.k_jsonRpc,
k_url: k_preload.k_url,
k_method: k_preload.k_method,
k_scope: this,
k_onError: kerio.waw.shared.k_methods.k_ignoreAllErrors,
k_callback: this._k_preloadCallback,
k_callbackParams: {
k_id: k_id
}
});
}
else { k_preload.k_request = kerio.waw.requests.k_send({
k_jsonRpc: k_preload.k_jsonRpc,
k_scope: this,
k_callback: this._k_preloadCallback,
k_callbackParams: {
k_id: k_id
}
});
}
},

_k_call: function(k_id) {
var k_preload = this._k_getPreload(k_id);
if ('function' === typeof k_preload.k_callback) {
return k_preload.k_callback.call(k_preload.k_scope || window, k_preload.k_result, !k_preload.k_isFailed, k_id);
}
return true;
},

_k_preloadCallback: function(k_response, k_success, k_params) {
var
k_id = k_params.k_id,
k_preload = this._k_getPreload(k_id);
k_preload.k_result = (k_preload.k_keepXhr ? k_response : k_response.k_decoded);
k_preload.k_isFailed = (!k_success || !k_response.k_isOk);
k_preload.k_isReady = (false !== this._k_call(k_id));
if (!k_preload.k_isReady) { this._k_send.defer(1000, this, [k_id]);
}
},

_k_getPreload: function(k_id, k_strict) {
var k_preload = this._k_requests[k_id];
if (!k_preload) {
if (false !== k_strict) {
kerio.lib.k_reportError('Invalid preload request ' + k_id, 'K_Preloader', '_k_getPreload');
}
return null;
}
return k_preload;
},

k_isReady: function(k_id, k_config) {
var k_preload = this._k_getPreload(k_id, false);
if (!k_preload) { return;
}
if ('object' === typeof k_config) {
kerio.waw.shared.k_methods.k_mergeObjects(k_config, k_preload);
if (k_preload.k_isReady && 'function' === typeof k_config.k_callback) { this._k_call(k_id);
}
}
return k_preload.k_isReady;
}
}); 