

kerio.waw.ui.notifications = {
k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_NOTIFICATIONS_TYPES = k_CONSTANTS.NotificationType,
k_tr = kerio.lib.k_tr,
k_notificationsArray = [],
k_dismissText = k_tr('Don\'t show this again', 'notifications'),
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_showDismissLink = !k_isAuditor,
k_formCfg,
k_form,
k_dialog,
k_goToInterfaces,
k_closeDialog,
k_goToNodeAndCloseDialog,
k_generateNotification,
k_licenseInstall;

k_goToInterfaces = function(k_form) {
k_form.k_closeDialog();
kerio.waw.status.k_currentScreen.k_gotoNode('interfaces');
};

k_goToNodeAndCloseDialog = function(k_nodeId, k_tabId) {
this.k_closeDialog();
kerio.waw.status.k_currentScreen.k_gotoNode(k_nodeId, k_tabId);
};

k_closeDialog = function() {
this.k_dialog.k_hide();
this.k_reset();
};

k_licenseInstall = function(k_form, k_item, k_linkId) {
if ('k_confAssistant' === k_linkId) {
kerio.waw.shared.k_methods.k_startRegistration(
{
k_callback: function() {
kerio.waw.requests.k_updateLicense();
}
}
);
k_form.k_closeDialog();
}
};

k_generateNotification = function(k_id, k_config) {
var
k_onBodyLinkClick = k_config.k_onBodyLinkClick || kerio.waw.shared.k_methods.k_emptyFunction,
k_onHeaderLinkClick = k_config.k_onHeaderLinkClick || kerio.waw.shared.k_methods.k_emptyFunction,
k_dismissLink,
k_header;
k_header = {
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_id: k_config.k_headerId,
k_template: '<b>' + k_config.k_title + '</b>',
k_className: 'titleNotification warning',
k_icon: 'weblib/int/lib/img/warning.png?v=8629',
k_onLinkClick: k_onHeaderLinkClick
}
]
};
if (k_config.k_dismissLink) {
k_dismissLink = {
k_type: 'k_display',
k_isSecure: true,
k_value: '<a id="' + k_id + '" class="link textLink">' + kerio.lib.k_tr('Dismiss', 'notifications') + '</a>',
k_onLinkClick: function (k_form, k_item, k_linkId) {
var
k_notificationType = k_linkId;
k_form.k_clearRequest.k_jsonRpc.params.notification = k_form.k_notificationsArray[k_notificationType].k_notification;
kerio.lib.k_ajax.k_request(k_form.k_clearRequest);
k_form.k_notificationsArray[k_notificationType].k_item.k_setVisible(false);
k_form.k_notificationsCount--;
}
};
k_header.k_items.push('->');
k_header.k_items.push(k_dismissLink);
}
return {
k_type: 'k_container',
k_id: k_id,
k_isHidden: true,
k_items: [
k_header,
{
k_type: 'k_display',
k_id: k_config.k_bodyId,
k_style: 'margin-top: -10px',
k_isSecure: true,
k_template: k_config.k_bodyMessage,
k_value: k_config.k_bodyMessageValue,
k_onLinkClick: k_onBodyLinkClick
}
]
};
};
k_formCfg = {
k_className: 'notifications',
k_isLabelHidden: true,
k_items: [
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationDump,{
k_title: k_tr('System fault', 'notifications'),
k_bodyId: 'k_kassistMessage',
k_bodyMessage: '{k_value}',
k_bodyMessageValue: {
k_value: k_isAuditor ?
k_tr('Kerio Control encountered a problem and was restarted. We apologize for the inconvenience.','notifications')
: ('<span class="loading inlineLoading">&nbsp; &nbsp; &nbsp; &nbsp;</span>' + k_tr('Analyzing error report. Please wait…', 'notifications'))
},
k_onBodyLinkClick: function(k_form) {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'crashReport',
k_initParams: {
k_productName: 'Kerio Control',
k_crashTime: k_form.k_notificationsArray[k_form.k_NOTIFICATIONS_TYPES.NotificationDump].k_value,
k_importance: k_form.k_importance,
k_callback: function(){
var
NotificationDump = this.k_NOTIFICATIONS_TYPES.NotificationDump;
this.k_notificationsArray[NotificationDump].k_item.k_setVisible(false);
this.k_notificationsCount--;
if (0 >= this.k_notificationsCount) {
this.k_closeDialog();
}
},
k_scope: k_form
}
});
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationLicExpired,{
k_title: k_tr('The license for Kerio Control has expired.', 'notifications'),
k_bodyMessage: k_tr('Your product license has expired. Kerio Control functionality is limited.', 'notifications')
+ '<ul><li>'
+ k_tr('To obtain a new license, please contact your authorized Kerio reseller or call your local Kerio office for purchasing options.', 'notifications')
+ '</li><li>'
+ k_tr('If you already have a valid license, you should install it.', 'notifications') + ' <a id="k_confAssistant">' + k_tr('Go to Install license…','notifications') + '</a>'
+ '</li></ul>',
k_onBodyLinkClick: k_licenseInstall
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationDomains,{
k_title: k_tr('Problem with connection to domain controller', 'notifications'),
k_bodyId: 'k_domainsDisplayField',
k_bodyMessage: '{k_domains} <a>' + k_tr('Review domain settings…','notifications') + '</a>',
k_onBodyLinkClick: function(k_form) {
k_form.k_goToNodeAndCloseDialog('domainsAndUserLogin', 'k_adDomainForm');
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationCertificateError,{
k_title: k_tr('Non-existing certificate is used', 'notifications'),
k_bodyId: 'k_certificateErrorField',
k_bodyMessage:  '{k_message}', k_onBodyLinkClick: function(k_form, k_item, k_linkId) {
switch(k_linkId) {
case 'k_interfaces':
k_form.k_goToInterfaces(k_form, k_item, k_linkId);
break;
case 'k_reverseProxy':
k_form.k_goToNodeAndCloseDialog('proxyServer', 'k_reverseProxy');
break;
case 'k_domains':
k_form.k_goToNodeAndCloseDialog('domainsAndUserLogin', 'k_authenticationForm');
break;
case 'k_advancedOptions':
default:
k_form.k_goToNodeAndCloseDialog('advancedOptions', 'k_webForm');
break;
}
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationCertificateExpired,{
k_title: k_tr('Certificate has expired or is untrusted', 'notifications'),
k_bodyId: 'k_certificateExpiredField',
k_bodyMessage:  '{k_message}', k_dismissLink: k_showDismissLink,
k_onBodyLinkClick: function(k_form) {
k_form.k_goToNodeAndCloseDialog('sslCertificates');
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationCaExpired,{
k_title: k_tr('Certification Authority has expired', 'notifications'),
k_bodyId: 'k_certAuthorityExpiredField',
k_bodyMessage:  '{k_message}', k_dismissLink: k_showDismissLink,
k_onBodyLinkClick: function(k_form) {
k_form.k_goToNodeAndCloseDialog('sslCertificates');
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationCertificateWillExpire,{
k_title: k_tr('Certificate is expiring', 'notifications'),
k_bodyId: 'k_certificateWillExpiredField',
k_bodyMessage:  '{k_message}', k_dismissLink: k_showDismissLink,
k_onBodyLinkClick: function(k_form) {
k_form.k_goToNodeAndCloseDialog('sslCertificates');
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationCaWillExpire,{
k_title: k_tr('Certification Authority is expiring', 'notifications'),
k_bodyId: 'k_certAuthorityWillExpiredField',
k_bodyMessage:  '{k_message}', k_dismissLink: k_showDismissLink,
k_onBodyLinkClick: function(k_form) {
k_form.k_goToNodeAndCloseDialog('sslCertificates');
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationConnectionBalancing,{
k_title: k_tr('A problem with default gateway was detected', 'notifications'),
k_bodyMessage: k_tr('Kerio Control has detected that there are default gateways configured on other interfaces than those configured for load balancing. This is often wrong as the default gateway should be typically left blank on any other interfaces.', 'notifications') + ' <a>' + k_tr('Check line status…','notifications') + '</a>',
k_onBodyLinkClick: k_goToInterfaces
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationConnectionFailover,{
k_title: k_tr('A problem with default gateway was detected', 'notifications'),
k_bodyMessage: k_tr('Kerio Control has detected that there are default gateways configured on other interfaces than those configured for Internet connection failover. This is often wrong as the default gateway should be typically left blank on any other interfaces.', 'notifications') + ' <a>' + k_tr('Check line status…','notifications') + '</a>',
k_onBodyLinkClick: k_goToInterfaces
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationConnectionOnDemand,{
k_title: k_tr('Duplicate default gateway was detected', 'notifications'),
k_bodyMessage: k_tr('Kerio Control is configured for on-demand dialing. However it has been detected that there are gateways configured on other interfaces than the one designed for dialing. Dialing on demand cannot be performed.', 'notifications') + ' <a>' + k_tr('Check line status…','notifications') + '</a>',
k_onBodyLinkClick: k_goToInterfaces
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationConnectionPersistent,{
k_title: k_tr('Duplicate default gateway was detected', 'notifications'),
k_bodyMessage: k_tr('Kerio Control has detected that multiple default gateways are configured on the machine. This is often wrong as the default gateway should be typically configured only on the interface that is connected to the Internet. On any other interfaces it should be left blank.', 'notifications') + ' <a>' + k_tr('Check line status…','notifications') + '</a>',
k_onBodyLinkClick: k_goToInterfaces
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationLlb,{
k_title: k_tr('Dial-up line compatibility problem', 'notifications'),
k_dismissLink: k_showDismissLink,
k_bodyMessage: k_tr('Due to a problem in the TCP/IP implementation in Windows 7 and Windows Server 2008 R2, Kerio Control is unable to perform link load balancing and connection failover using dial-up lines properly.', 'notifications')
+ ' <a class="link textLink selectable" href="' + kerio.waw.shared.k_CONSTANTS.k_LLB_INCOMPATIBILITY_URL + '" target="_blank">'
+ k_tr('Learn more…', 'notifications')
+ '</a>'
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationLlbLine,{
k_title: k_tr('Internet line failure', 'notifications'),
k_bodyMessage: k_tr('One of the lines used for load balancing has failed.', 'notifications') + ' <a>' + k_tr('Check line status…','notifications') + '</a>',
k_onBodyLinkClick: k_goToInterfaces
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationBackupLine,{
k_title: k_tr('Backup line active', 'notifications'),
k_bodyMessage: k_tr('Internet connectivity through the primary line has failed. The backup line is currently used for Internet connection.', 'notifications') + ' <a>' + k_tr('Check line status…','notifications') + '</a>',
k_onBodyLinkClick: k_goToInterfaces
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationInterfaceSpeed,{
k_title: k_tr('Bandwidth management must know link speed', 'notifications'),
k_bodyMessage: k_tr('There is a bandwidth management rule with bandwidth reservation or percentual speed limit. In such case, it is necessary to set the link speed of the Internet connection to make the bandwidth management work properly.', 'notifications') + ' <a>' + (k_isAuditor ? k_tr('Review the settings…', 'notifications') : k_tr('Set the link speed…', 'notifications')) + '</a>',
k_onBodyLinkClick: function(k_form){
k_form.k_goToNodeAndCloseDialog('bandwidthManagement');
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationSmtp,{
k_title: k_tr('No SMTP server is defined', 'notifications'),
k_bodyMessage: k_tr('One or more features of Kerio Control is configured to send email messages but no SMTP server is defined.', 'notifications') + ' <a>' + (k_isAuditor ? k_tr('See the SMTP server settings…', 'notifications') :k_tr('Configure the SMTP server…', 'notifications')) + '</a>',
k_onBodyLinkClick: function(k_form){
k_form.k_goToNodeAndCloseDialog('remoteServices', 'k_smtpForm');
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationLowMemory,{
k_title: k_tr('Low memory warning', 'notifications'),
k_dismissLink: k_showDismissLink,
k_bodyMessage: k_tr('Available memory is lower than Kerio Control requires. We cannot guarantee smooth run of your system and some features may not work.', 'notifications')
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationBackupFailed,{
k_title: k_tr('Backup failed', 'notifications'),
k_bodyId: 'k_backupFailedField',
k_bodyMessage: k_tr('Automatic configuration backup failed with error message "%1".', 'notifications', {k_args: ['{k_message}']}) + ' <a>' + k_tr('Check the backup settings…', 'notifications') + '</a>',
k_onBodyLinkClick: function(k_form){
k_form.k_goToNodeAndCloseDialog('remoteServices', 'k_backupForm');
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationPacketDump,{
k_title: k_tr('Packet dump in progress', 'notifications'),
k_bodyMessage: [
k_tr('A packet dump is in progress.', 'notifications'),
' <a>',
k_tr('Open the Packet dump dialog…', 'notifications'),
'</a>'].join(''),
k_onBodyLinkClick: function(k_form) {
k_form.k_closeDialog();
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'packetDump',
k_params: {
k_dumpInProgress: true
}
});
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationLicWillExpire,{
k_title: '{k_title}',
k_dismissLink: k_showDismissLink,
k_headerId: 'k_notificationLicenseWillExpireTitle',
k_bodyMessage:k_tr('When your product license expires, Kerio Control will stop functioning or its features will be limited.', 'notifications')
+ ' ' + k_tr('To obtain a new license, please contact your authorized Kerio reseller or call your local Kerio office for purchasing options.', 'notifications')
+ '<br />'
+ k_tr('If you already have a valid license, you should install it.', 'notifications') + (k_isAuditor ? '' : ' <a id="k_confAssistant">' + k_tr('Go to Install license…','notifications') + '</a>')
+ '<br />',
k_onBodyLinkClick: k_licenseInstall
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationSubWillExpire,{
k_title: '{k_title}',
k_dismissLink: k_showDismissLink,
k_headerId: 'k_notificationSubWillExpireTitle',
k_bodyMessage: k_tr('After the subscription expires, the product will stop working, firewall and security services will be disabled. You will need to renew the subscription to continue using the product as usual.', 'notifications')									+ '<br>'
+ k_tr('To obtain a Software Maintenance renewal, please contact your authorized GFI reseller.', 'notifications')
+ (k_isAuditor ? '' : ' <a id="k_upgradeInfo">' + k_tr('Update registration information…', 'notifications') + '</a>')
+ '<br>',
k_onBodyLinkClick: function(k_form, k_item, k_linkId) {
if ('k_upgradeInfo' === k_linkId) {
kerio.waw.shared.k_methods.k_startRegistration();
k_form.k_closeDialog();
}
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationSubExpired,{
k_title: k_tr('The Software Maintenance for this product has expired', 'notifications'),
k_dismissLink: k_showDismissLink,
k_bodyMessage: k_tr('The product has stopped working, firewall and security services are disabled. You need to renew the subscription to continue using the product as usual.', 'notifications')									+ '<br>'
+ k_tr('To obtain a Software Maintenance renewal, please contact your authorized GFI reseller.', 'notifications')
+ (k_isAuditor ? '' : ' <a id="k_upgradeSubInfo">' + k_tr('Update registration information…', 'notifications') + '</a>')
+ '<br>',
k_onBodyLinkClick: function(k_form, k_item, k_linkId) {
if ('k_upgradeSubInfo' === k_linkId) {
kerio.waw.shared.k_methods.k_startRegistration();
k_form.k_closeDialog();
}
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationUpdate,{
k_title: k_tr('New update is available', 'notifications'),
k_dismissLink: k_showDismissLink,
k_bodyMessage: k_tr('A new version of Kerio Control is ready for update.', 'notifications') + ' <a>' + k_tr('Go to Update Checker…','notifications') + '</a>',
k_onBodyLinkClick: function(k_form){
k_form.k_goToNodeAndCloseDialog('advancedOptions', 'k_updateForm');
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationDataEncryptionFatal,{
k_headerId: 'k_notificationDataEncryptionFatalTitle',
k_bodyMessage: k_tr('Kerio Control encountered a problem while trying to mount encrypted volume. Please contact support before enabling encryption again.', 'notifications'),
k_title:k_tr('Data encryption error'),
k_onHeaderLinkClick: function(k_form, k_item, k_linkId) {
k_form.k_closeDialog();
k_form.k_goToNodeAndCloseDialog('advancedOptions', 'k_dataEncryptionForm');
}
}),
k_generateNotification(k_NOTIFICATIONS_TYPES.NotificationDataEncryption,{
k_headerId: 'k_notificationDataEncryptionTitle',
k_title: '{k_text}',
k_onHeaderLinkClick: function(k_form, k_item, k_linkId) {
k_form.k_closeDialog();
k_form.k_goToNodeAndCloseDialog('advancedOptions', 'k_dataEncryptionForm');
}
}),
]
};
k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_dialog = new kerio.lib.K_Dialog(k_objectName, {
k_width: 518,
k_title: k_tr('Notifications', 'notifications'),
k_isResizable: true,
k_buttons: [
{
k_isCancel: true,
k_caption: k_tr('Close', 'common')
}
],
k_hasHelpIcon: false,
k_content: k_form
});
k_dialog.k_addReferences({
k_form: k_form
});
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationUpdate] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationUpdate), k_size: 70, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationDump] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationDump), k_size: 85, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationLowMemory] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationLowMemory), k_size: 100, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationDomains] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationDomains), k_size: 85, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationSubWillExpire] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationSubWillExpire), k_size: 180, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationSubExpired] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationSubExpired), k_size: 180, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationLicWillExpire] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationLicWillExpire), k_size: 170, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationLicExpired] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationLicExpired), k_size: 170, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationBackupLine] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationBackupLine), k_size: 85, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationInterfaceSpeed] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationInterfaceSpeed), k_size: 100, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationSmtp] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationSmtp), k_size: 70, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationLlbLine] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationLlbLine), k_size: 70, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationLlb] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationLlb), k_size: 110, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationConnectionOnDemand] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationConnectionOnDemand), k_size: 110, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationConnectionFailover] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationConnectionFailover), k_size: 110, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationConnectionBalancing] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationConnectionBalancing), k_size: 110, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationConnectionPersistent] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationConnectionPersistent), k_size: 110, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationCertificateError] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationCertificateError), k_size: 110, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationCertificateWillExpire] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationCertificateWillExpire), k_size: 110, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationCertificateExpired] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationCertificateExpired), k_size: 110, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationCaWillExpire] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationCaWillExpire), k_size: 110, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationCaExpired] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationCaExpired), k_size: 110, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationBackupFailed] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationBackupFailed), k_size: 100, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationPacketDump] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationPacketDump), k_size: 70, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationDataEncryption] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationDataEncryption), k_size: 70, k_value: '', k_notification: {}};
k_notificationsArray[k_NOTIFICATIONS_TYPES.NotificationDataEncryptionFatal] = {k_item: k_form.k_getItem(k_NOTIFICATIONS_TYPES.NotificationDataEncryptionFatal), k_size: 70, k_value: '', k_notification: {}};
k_form.k_addReferences({
k_NOTIFICATIONS_TYPES: k_NOTIFICATIONS_TYPES,
k_dialog: k_dialog,
k_notificationsCount: 0,
k_notificationsArray: k_notificationsArray,
k_closeDialog: k_closeDialog,
k_goToNodeAndCloseDialog: k_goToNodeAndCloseDialog,
k_domainsDisplayField: k_form.k_getItem('k_domainsDisplayField'),
k_certificateErrorField: k_form.k_getItem('k_certificateErrorField'),
k_certificateExpiredField: k_form.k_getItem('k_certificateExpiredField'),
k_certificateWillExpiredField: k_form.k_getItem('k_certificateWillExpiredField'),
k_certAuthorityWillExpiredField: k_form.k_getItem('k_certAuthorityWillExpiredField'),
k_certAuthorityExpiredField: k_form.k_getItem('k_certAuthorityExpiredField'),
k_notificationLicenseWillExpireTitle: k_form.k_getItem('k_notificationLicenseWillExpireTitle'),
k_notificationSubWillExpireTitle: k_form.k_getItem('k_notificationSubWillExpireTitle'),
k_backupFailedField: k_form.k_getItem('k_backupFailedField'),
k_notificationDataEncryptionTitle: k_form.k_getItem('k_notificationDataEncryptionTitle'),
k_notificationDataEncryptionFatalTitle: k_form.k_getItem('k_notificationDataEncryptionFatalTitle'),
k_dismissText: k_dismissText,
k_importance: undefined, k_goToInterfaces: k_goToInterfaces,
k_isAuditor: k_isAuditor,
k_clearRequest: {
k_jsonRpc: {
method: 'Notifications.clear',
params: {
notification: []
}
},
k_scope: k_form,
k_callback: function(k_response) {
if (k_response.k_isOk && 0 === this.k_notificationsCount) {
this.k_closeDialog();
}
}
}
});
this.k_addControllers(k_dialog);
return k_dialog;
}, k_addControllers: function (k_kerioWidget) {

k_kerioWidget.k_applyParams = function(k_params) {
var
k_form = this.k_form,
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_DEFINITIONS_GET = kerio.waw.shared.k_DEFINITIONS.k_get,
k_NOTIFICATIONS_TYPES = k_form.k_NOTIFICATIONS_TYPES,
k_CERT_TYPES = k_CONSTANTS.k_NOTIFICATION_CERTIFICATE_TYPES,
k_ERROR_SEVERITY = k_CONSTANTS.NotificationSeverity.NotificationError,
k_VALUES_LIMIT = 4,
k_tr = kerio.lib.k_tr,
k_notificationsArray = k_form.k_notificationsArray,
k_currentNotifications = k_params.k_notifications,
k_currentNotificationsCount = 0,
k_increaseHeight = 100, k_sizeOrigin,
k_link,
k_cnt, k_i,
k_texts,
k_lastText,
k_links,
k_notification,
k_notificationValue,
k_notificationField,
k_expireDays,
k_valuesCount,
k_parsedValues,
k_message,
k_headerEl,
k_text;
for (k_i in k_notificationsArray) {
if (k_notificationsArray.hasOwnProperty(k_i)) {
k_notificationField = k_notificationsArray[k_i];
if (typeof k_notificationField === 'object') {
k_notificationField.k_item.k_setVisible(false);
}
}
}
k_cnt = k_currentNotifications.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_notification = k_currentNotifications[k_i];
k_notificationField = k_notificationsArray[k_notification.type];
k_notificationValue = k_notification.value;
if (k_notification.type === k_NOTIFICATIONS_TYPES.NotificationDump && !k_form.k_isAuditor) {
this._k_initKassist(k_notificationField);
}
if (k_ERROR_SEVERITY === k_notification.severity) {
k_headerEl = k_notificationField.k_item.k_extWidget.el.query('.displayFieldIcon')[0];
k_headerEl.classList.remove('warning');
k_headerEl.classList.add('error');
k_headerEl.style.backgroundImage = 'url("img/error.png?v=8629")';
}
if (typeof k_notificationField === 'object') {
k_increaseHeight += k_notificationField.k_size;
k_notificationField.k_value = k_notificationValue;
k_notificationField.k_notification = k_notification;
k_currentNotificationsCount++;
switch(k_notification.type) {
case k_NOTIFICATIONS_TYPES.NotificationDomains:
k_valuesCount = k_notificationValue.split(',').length;
k_form.k_domainsDisplayField.k_setValue({
k_domains: k_tr('Kerio Control cannot connect to [controller|controllers] of [domain|domains] "%1". Users from [this|these] [domain|domains] may not be able to login to access the Internet.', 'notifications', {k_args:[k_notificationValue], k_pluralityBy: k_valuesCount})
});
break;
case k_NOTIFICATIONS_TYPES.NotificationLicWillExpire:
k_expireDays = kerio.waw.shared.k_methods.k_licenseRemainingDays(k_CONSTANTS.kerio_web_SharedConstants.kerio_web_License);
k_form.k_notificationLicenseWillExpireTitle.k_setValue({
k_title: k_tr('The license will expire in %1 [day|days].', 'notifications', {k_args: [k_expireDays], k_pluralityBy: k_expireDays})
});
break;
case k_NOTIFICATIONS_TYPES.NotificationSubWillExpire:
k_expireDays = kerio.waw.shared.k_methods.k_licenseRemainingDays(k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Subscription);
k_form.k_notificationSubWillExpireTitle.k_setValue({
k_title: k_tr('The Software Maintenance will expire in %1 [day|days].', 'notifications', {k_args: [k_expireDays], k_pluralityBy: k_expireDays})
});
break;
case k_NOTIFICATIONS_TYPES.NotificationCertificateError:
k_parsedValues = k_notificationValue.split(',');
k_valuesCount = k_parsedValues.length;
k_texts = [];
k_links = [];
if (-1 !== k_parsedValues.indexOf(k_CERT_TYPES.k_VPN_SERVER)) {
k_link = k_DEFINITIONS_GET('k_MENU_TREE_NODES.interfaceList');
k_texts.push(k_tr('VPN server', 'notifications'));
k_links.push(['<a id="k_interfaces">', k_tr('Go to %1…','notifications',{k_args: [ k_link ]}),'</a>'].join(''));
}
if (-1 !== k_parsedValues.indexOf(k_CERT_TYPES.k_VPN_TUNNEL)) {
k_texts.push(k_tr('VPN tunnels', 'notifications'));
if (-1 === k_parsedValues.indexOf(k_CERT_TYPES.k_VPN_SERVER)) {
k_link = k_DEFINITIONS_GET('k_MENU_TREE_NODES.interfaceList');
k_links.push(['<a id="k_interfaces">', k_tr('Go to %1…','notifications',{k_args: [ k_link ]}),'</a>'].join(''));
}
}
if (-1 !== k_parsedValues.indexOf(k_CERT_TYPES.k_REVERSE_PROXY)) {
k_link = k_DEFINITIONS_GET('k_MENU_TREE_NODES.proxyServerList');
k_texts.push(k_link);
k_links.push(['<a id="k_reverseProxy">', k_tr('Go to %1…','notifications',{k_args: [ k_link ]}),'</a>'].join(''));
}
if (-1 !== k_parsedValues.indexOf(k_CERT_TYPES.k_WEB_INTERFACE)) {
k_link = k_DEFINITIONS_GET('k_MENU_TREE_NODES.advancedOptionsList');
k_texts.push(k_link);
k_links.push(['<a>', k_tr('Go to %1…','notifications',{k_args: [ k_link ]}),'</a>'].join(''));
}
if (-1 !== k_parsedValues.indexOf(k_CERT_TYPES.k_RADIUS)) {
k_link = k_DEFINITIONS_GET('k_MENU_TREE_NODES.domainsAuthenticationList');
k_texts.push(k_tr('RADIUS server', 'notifications'));
k_links.push(['<a id="k_domains">', k_tr('Go to %1…','notifications',{k_args: [ k_link ]}),'</a>'].join(''));
}
if (1 === k_texts.length) {
k_texts = k_texts[0];
}
else if (2 === k_texts.length) {
k_texts = k_tr('in %1 and in %2', 'notification', {k_args: [ k_texts[0], k_texts[1] ]});
}
else {
k_lastText = k_texts.pop();
k_texts = k_tr('in %1 and in %2', 'notification', {k_args: [ k_texts.join(', '), k_lastText ]});
}
k_message = [
k_tr('Non-existing certificate is used in %1 or the certificate cannot be loaded.', 'notifications', {k_args: [ k_texts ]}),
' ',
k_links.join(' ')
].join('');
k_form.k_certificateErrorField.k_setValue({
k_message: k_message
});
break;
case k_NOTIFICATIONS_TYPES.NotificationCertificateWillExpire:
k_parsedValues = k_notificationValue.split(',');
k_valuesCount = k_parsedValues.length;
k_link = k_DEFINITIONS_GET('k_MENU_TREE_NODES.sslCertificates');
if (k_VALUES_LIMIT >= k_valuesCount) {
k_notificationValue = k_parsedValues.join(', ');
k_message = [
k_tr('[Certificate|Certificates] "%1" will expire in a week. Connections using [this|these] [certificate|certificates] may not work.', 'notifications', {k_args:[k_notificationValue], k_pluralityBy: k_valuesCount}),
' <a>',
k_tr('Go to %1…','notifications',{k_args: [k_link]}),
'</a>'
].join('');
}
else {
k_notificationValue = k_parsedValues.slice(0,k_VALUES_LIMIT-1).join(', ');
k_message = [
k_tr('Certificates "%1" and %2 others will expire in a week. Connections using these certificates may not work.', 'notifications', {k_args:[k_notificationValue, k_valuesCount-k_VALUES_LIMIT+1]}),
' <a>',
k_tr('Go to %1…','notifications',{k_args: [k_link]}),
'</a>'
].join('');
}
k_form.k_certificateWillExpiredField.k_setValue({
k_message: k_message
});
break;
case k_NOTIFICATIONS_TYPES.NotificationCertificateExpired:
k_parsedValues = k_notificationValue.split(',');
k_valuesCount = k_parsedValues.length;
k_link = k_DEFINITIONS_GET('k_MENU_TREE_NODES.sslCertificates');
if (k_VALUES_LIMIT >= k_valuesCount) {
k_notificationValue = k_parsedValues.join(', ');
k_message = [
k_tr('[Certificate|Certificates] "%1" [has|have] expired or [is|are] untrusted. Connections using [this|these] [certificate|certificates] may not work.', 'notifications', {k_args:[k_notificationValue], k_pluralityBy: k_valuesCount}),
' <a>',
k_tr('Go to %1…','notifications',{k_args: [k_link]}),
'</a>'
].join('');
}
else {
k_notificationValue = k_parsedValues.slice(0,k_VALUES_LIMIT-1).join(', ');
k_message = [
k_tr('Certificates "%1" and %2 others have expired or are untrusted. Connections using these certificates may not work.', 'notifications', {k_args:[k_notificationValue, k_valuesCount-k_VALUES_LIMIT+1]}),
' <a>',
k_tr('Go to %1…','notifications',{k_args: [k_link]}),
'</a>'
].join('');
}
k_form.k_certificateExpiredField.k_setValue({
k_message: k_message
});
break;
case k_NOTIFICATIONS_TYPES.NotificationCaWillExpire:
k_parsedValues = k_notificationValue.split(',');
k_valuesCount = k_parsedValues.length;
k_link = k_DEFINITIONS_GET('k_MENU_TREE_NODES.sslCertificates');
if (k_VALUES_LIMIT >= k_valuesCount) {
k_notificationValue = k_parsedValues.join(', ');
k_message = [
k_tr('Certification [Authority|Authorities] "%1" will expire in a week. Connections using certificates signed by [this|these] [authority|authorities] may not work.', 'notifications', {k_args:[k_notificationValue], k_pluralityBy: k_valuesCount}),
' <a>',
k_tr('Go to %1…','notifications',{k_args: [k_link]}),
'</a>'
].join('');
}
else {
k_notificationValue = k_parsedValues.slice(0,k_VALUES_LIMIT-1).join(', ');
k_message = [
k_tr('Certification Authority "%1" and %2 others will expire in a week. Connections using certificates signed by these authorities may not work.', 'notifications', {k_args:[k_notificationValue, k_valuesCount-k_VALUES_LIMIT+1]}),
' <a>',
k_tr('Go to %1…','notifications',{k_args: [k_link]}),
'</a>'
].join('');
}
k_form.k_certAuthorityWillExpiredField.k_setValue({
k_message: k_message
});
break;
case k_NOTIFICATIONS_TYPES.NotificationCaExpired:
k_parsedValues = k_notificationValue.split(',');
k_valuesCount = k_parsedValues.length;
k_link = k_DEFINITIONS_GET('k_MENU_TREE_NODES.sslCertificates');
if (k_VALUES_LIMIT >= k_valuesCount) {
k_notificationValue = k_parsedValues.join(', ');
k_message = [
k_tr('Certification [Authority|Authorities] "%1" [has|have] expired. Connections using certificates signed by [this|these] [authority|authorities] may not work.', 'notifications', {k_args:[k_notificationValue], k_pluralityBy: k_valuesCount}),
' <a>',
k_tr('Go to %1…','notifications',{k_args: [k_link]}),
'</a>'
].join('');
}
else {
k_notificationValue = k_parsedValues.slice(0,k_VALUES_LIMIT-1).join(', ');
k_message = [
k_tr('Certification Authority "%1" and %2 others have expired. Connections using certificates signed by these authorities may not work.', 'notifications', {k_args:[k_notificationValue, k_valuesCount-k_VALUES_LIMIT+1]}),
' <a>',
k_tr('Go to %1…','notifications',{k_args: [k_link]}),
'</a>'
].join('');
}
k_form.k_certAuthorityExpiredField.k_setValue({
k_message: k_message
});
break;
case k_NOTIFICATIONS_TYPES.NotificationBackupFailed:
k_form.k_backupFailedField.k_setValue({
k_message: kerio.lib.k_tr(k_notificationValue, 'serverMessage')
});
break;
case k_NOTIFICATIONS_TYPES.NotificationDataEncryption:
k_text = kerio.waw.ui.notifications.k_getDataEncryptionNotificationText(k_notification);
if (k_text) {
k_form.k_notificationDataEncryptionTitle.k_setValue({
k_text: k_text + ' <a>' + k_tr('Click here to add disk space.','notifications') + '</a>'
});
}
break;
case k_NOTIFICATIONS_TYPES.NotificationDataEncryptionFatal:
k_form.k_notificationDataEncryptionFatalTitle.k_setValue({
k_text: "Kerio Control encountered a problem while trying to mount encrypted volume."+
" Please contact support before enabling encryption again."
});
break;
}
k_notificationField.k_item.k_setVisible(true);
}
}
k_sizeOrigin = this.k_getSize();
k_sizeOrigin.k_height = window.innerHeight < k_increaseHeight ? window.innerHeight : k_increaseHeight;
k_sizeOrigin.k_minHeight = k_sizeOrigin.k_height;
this.k_setSize(k_sizeOrigin);
this.k_extWidget.center();
k_form.k_notificationsCount = k_currentNotificationsCount;
}; 
k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
this.k_form.k_importance = undefined;
};

k_kerioWidget._k_initKassist = function() {
kerio.waw.requests.k_sendBatch({
k_jsonRpc: {
method: 'Dumps.getWithImportance'
},
k_callback: this._k_initKassistCallback,
k_scope: this
}, {k_mask: false, k_silent: true});
};

k_kerioWidget._k_initKassistCallback = function(k_response, k_success) {
var
k_SHARED_CONSTANTS = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_form = this.k_form,
k_field = k_form.k_getItem('k_kassistMessage'),
k_tr = kerio.lib.k_tr,
k_dump;
if (k_success) {
k_dump = k_response.dumps[0];
if (k_dump) {
k_form.k_importance = k_dump.importance;
switch (k_dump.importance) {
case k_SHARED_CONSTANTS.kerio_assist_OtherProcess:
k_field.k_setValue({k_value: k_tr('An external process has stopped working and has been restarted. This did not affect the Kerio Control itself, however the affected feature was not available for a moment.', 'notifications') + ' <a>' + k_tr('Open the report problem dialog…','notifications') + '</a>'});
break;
default: k_success = false;
}
}
else {
k_success = false;
}
}
if (!k_success) { k_form.k_importance = k_SHARED_CONSTANTS.kerio_assist_MainProcess;
k_field.k_setValue({k_value: k_tr('Kerio Control encountered a problem and was restarted.','notifications') + ' <a>' + k_tr('Open the report problem dialog…','notifications') + '</a>'});
}
};
}, 
k_setNotificationCaption: function(k_notifications) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_NOTIFICATIONS_TYPES = k_CONSTANTS.NotificationType,
k_NOTIFICATIONS_HEADER_TEXT = kerio.waw.shared.k_DEFINITIONS.k_NOTIFICATIONS_HEADER_TEXT,
k_ERROR_SEVERITY = k_CONSTANTS.NotificationSeverity.NotificationError,
k_notificationsCount = k_notifications ? k_notifications.length : 0,
k_tr = kerio.lib.k_tr,
k_unknownNotificationsCount = 0,
k_displayedNotifications = [],
k_texts = [],
k_title = '',
k_icon = '',
k_text,
k_notification,
k_cnt, k_i,k_item;
for (k_i = 0; k_i < k_notificationsCount; k_i++) {
k_notification = k_notifications[k_i];
k_item = k_notification.type;
if (k_NOTIFICATIONS_HEADER_TEXT[k_item]) {
if (k_item === k_NOTIFICATIONS_TYPES.NotificationDataEncryption) {
k_displayedNotifications.push({k_text: this.k_getDataEncryptionNotificationText(k_notification)});
}
else {
k_displayedNotifications.push(k_NOTIFICATIONS_HEADER_TEXT[k_item]);
}
k_icon = k_ERROR_SEVERITY === k_notification.severity ? 'error' : 'warning';
}
else {
k_unknownNotificationsCount++;
}
}
k_displayedNotifications.sort(function(k_item1, k_item2) {
return k_item1.k_priority - k_item2.k_priority;
});
k_cnt = k_displayedNotifications.length;
for(k_i = 0; k_i < k_cnt; k_i++) {
k_texts.push(k_displayedNotifications[k_i].k_text);
}
k_notificationsCount -= k_unknownNotificationsCount;
if (0 === k_notificationsCount) { kerio.adm.k_framework.k_showCustomButton(false);
return;
}
if (1 === k_notificationsCount) { k_text = k_texts[0];
}
else {
k_text = k_tr('%1 [notification|notifications] pending…', 'startupWarnings', {k_args: [k_notificationsCount], k_pluralityBy: k_notificationsCount});
k_title = k_texts.join('<br />');
}
kerio.adm.k_framework.k_setCustomButton({
k_caption: k_text,
k_className: 'titleNotification ' + k_icon,
k_title: k_title,
k_dialog: {k_sourceName: 'notifications', k_params: {k_notifications: k_notifications}}
});
kerio.adm.k_framework.k_showCustomButton(true);
},
k_getDataEncryptionNotificationText: function(k_notification) {
var k_tr = kerio.lib.k_tr,
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_text = '';
switch (k_notification.code) {
case k_CONSTANTS.EncryptionDiskStatus.LOW_SPACE:k_text = k_tr('Not enough free space on encrypted volume.', 'notifications');
break;
case k_CONSTANTS.EncryptionDiskStatus.CRITICALLY_LOW_SPACE:k_text = k_tr('Critically low free space on encrypted volume.', 'notifications');
break;
}
return k_text;
},
k_startNotifications: function() {
kerio.waw.requests.on('notificationUpdate', this.k_setNotificationCaption, this);
}
}; 