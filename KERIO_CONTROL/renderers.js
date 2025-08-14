
kerio.waw.shared = kerio.waw.shared || {};
kerio.waw.shared.k_methods = kerio.waw.shared.k_methods || {};
kerio.waw.shared.k_methods.k_renderers = {};

kerio.waw.shared.k_methods.k_renderers.k_renderAction = function (k_value, k_data) {
var
k_tr = kerio.lib.k_tr,
k_constRuleActions = kerio.waw.shared.k_CONSTANTS.RuleAction,
k_iconCls = 'ruleAction';
switch (k_value) {
case k_constRuleActions.Allow:
k_value = k_tr('Allow', 'common');
k_iconCls += ' allow';
break;
case k_constRuleActions.Deny:
k_value = k_tr('Deny', 'common');
k_iconCls += ' deny';
break;
case k_constRuleActions.Drop:
k_value = k_tr('Drop', 'common');
k_iconCls += ' drop';
break;
case k_constRuleActions.k_REDIRECT:
k_value = k_tr('Redirect', 'ruleList');
k_iconCls += ' redirect';
break;
default:
k_value = '';
k_iconCls += ' unset';
break;
}return {
k_data: k_value,
k_iconCls: k_iconCls
};
}; 
kerio.waw.shared.k_methods.k_renderers.k_renderServiceName = function(k_value, k_data) {
return kerio.waw.shared.k_methods.k_formatServiceName(k_value, k_data);
};

kerio.waw.shared.k_methods.k_renderers.k_renderServiceDescription = function(k_value, k_data) {
var
k_members = [],
k_membersNames = [],
k_i, k_cnt;
if (k_data.group) {
k_members = k_data.members;
if (k_members && 0 < k_members.length) {
k_cnt = k_members.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_membersNames.push(k_members[k_i].name);
}
k_membersNames = k_membersNames.join(', ');
return {
k_data: ['<b>', kerio.lib.k_tr('%1 [member|members]: ', 'serviceList', {k_args: [k_cnt], k_pluralityBy: k_cnt}), '</b> ', k_membersNames].join(''),
k_isSecure: true,
k_ignoreHtmlEncode: true
};
}
return {
k_data: kerio.lib.k_tr('Empty group', 'serviceList')
};
}
return {
k_data: k_value
};
};

kerio.waw.shared.k_methods.k_renderers.k_renderUserName = function(k_value, k_data) {
var
k_userListStatus = kerio.waw.status.k_userList,
k_isCurrentDomainLocal = k_userListStatus.k_isCurrentDomainLocal,
k_isUserEnabled,
k_iconState;
k_data.adEnabled = k_isCurrentDomainLocal || k_data.adEnabled;
k_isUserEnabled = k_data.localEnabled && k_data.adEnabled;
k_iconState = (k_isUserEnabled) ? '' : ' disabled';
if (k_isCurrentDomainLocal) {
if (!k_userListStatus.k_isAdAuthEnabled && !k_userListStatus.k_isNtAuthEnabled && kerio.waw.shared.k_CONSTANTS.AuthType.Internal !== k_data.authType) {
k_iconState = ' userInactiveAuth';
}
}
else {
if (k_data.conflictWithLocal) {
k_iconState = (k_isUserEnabled) ? ' userConflict' : ' userInactiveAuth';
}
}
return {
k_data: k_data.credentials.userName,
k_iconCls: 'userIcon' + k_iconState
};
}; 
kerio.waw.shared.k_methods.k_renderers.k_renderSimpleUserName = function(k_value, k_data) {
var k_credentials = k_data.credentials || {};
if (k_credentials.userName && undefined !== k_data.k_name) {
k_data.k_name = k_credentials.userName;
}
return {
k_iconCls: 'userIcon',
k_data: k_value || k_credentials.userName || k_data.name || k_data.username || ''
};
}; 
kerio.waw.shared.k_methods.k_renderers.k_renderUserGroupName = function(k_value) {
return {
k_iconCls: 'userGroupIcon',
k_data: k_value
};
}; 
kerio.waw.shared.k_methods.k_renderers.k_renderDomainName = function(k_value, k_data) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_iconClass = 'domainIcon ';
if (k_WAW_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusNew === k_data.status) {
k_iconClass += 'added';
}
else if (k_WAW_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusModified === k_data.status) {
k_iconClass += 'modified';
}
return {
k_data: k_value,
k_iconCls: k_iconClass,
k_className: (k_data.primary) ? 'primaryDomain' : ''
};
}; 
kerio.waw.shared.k_methods.k_renderers.k_renderAllowDeny = function(k_value, k_data) {
var
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_trCache,
k_iconClass;
if (this.k_allowDenyTranslate) {
k_trCache = this.k_allowDenyTranslate;
}
else {
k_trCache = k_WAW_DEFINITIONS.k_trCache;
if (!k_trCache || !k_trCache.k_allow || !k_trCache.k_deny) {
k_trCache = {
k_allow: kerio.lib.k_tr('Allow', 'common'),
k_deny: kerio.lib.k_tr('Deny', 'common')
};
k_WAW_DEFINITIONS.k_trCache = k_WAW_DEFINITIONS.k_trCache || {};
k_WAW_METHODS.k_mergeObjects(k_trCache, k_WAW_DEFINITIONS.k_trCache);
k_trCache = k_WAW_DEFINITIONS.k_trCache;
}
}
k_iconClass = 'allowDenyIcon ' + (k_value ? 'allow' : 'deny');
return {
k_data: (k_value) ? k_trCache.k_allow : k_trCache.k_deny,
k_iconCls: k_iconClass,
k_className: (k_value) ? 'allow' : 'deny'
};
}; 
kerio.waw.shared.k_methods.k_renderers.k_addressGroupRenderer = function (k_value, k_data) {
var
k_tooltip = '',
k_iconCls, k_text;
k_value = k_data.validAddressGroup; k_text = k_value.name;
if ('' === k_text) {
return {k_data: ''};
}
if (k_value.invalid) {
k_iconCls = 'grpHeader ipGroupIcon invalid';
k_tooltip = kerio.lib.k_tr('This group no longer exists', 'ruleList');
}
else {
k_iconCls = 'grpHeader ipGroupIcon';
}
return {
k_data: k_text,
k_iconCls: k_iconCls,
k_dataTooltip: k_tooltip,
k_iconTooltip: k_tooltip
};
};

kerio.waw.shared.k_methods.k_renderers.k_urlGroupRenderer = function (k_value, k_data) {
var
k_tooltip = '',
k_iconCls,
k_text,
k_icon;
k_icon = 'urlGroupIcon';
k_value = k_data.urlGroup;
k_text = k_value.name;
if ('' === k_text) {
return {k_data: ''};
}
if (k_value.invalid) {
k_iconCls = 'grpHeader urlGroupIcon invalid ';
k_tooltip = kerio.lib.k_tr('This group no longer exists', 'ruleList');
}
else {
k_iconCls = 'grpHeader urlGroupIcon';
}
return {
k_data: k_text,
k_iconCls: k_iconCls,
k_dataTooltip: k_tooltip,
k_iconTooltip: k_tooltip
};
};

kerio.waw.shared.k_methods.k_renderers.k_addressGroupItemRenderer = function(k_value, k_data) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_constAddressGroupTypes = k_WAW_CONSTANTS.kerio_web_SharedConstants,
k_constStoreStatus = k_WAW_CONSTANTS.kerio_web_SharedConstants,
k_iconClass = 'ipGroupIcon ',
k_text;
switch (k_data.type) {
case k_constAddressGroupTypes.kerio_web_Host:
k_iconClass += 'agTypeHost';
k_text = k_data.host;
break;
case k_constAddressGroupTypes.kerio_web_IpPrefix:
k_iconClass += 'agTypeNetwork';
k_text = k_data.host;
break;
case k_constAddressGroupTypes.kerio_web_Network:
k_iconClass += 'agTypeNetwork';
k_text = k_data.addr1 + ' / ' + k_data.addr2;
break;
case k_constAddressGroupTypes.Range:
k_iconClass += 'agTypeRange';
k_text = k_data.addr1 + ' - ' + k_data.addr2;
break;
case k_constAddressGroupTypes.kerio_web_ChildGroup:
k_iconClass += 'agTypeGroup';
k_text = k_data.childGroupName;
break;
case k_constAddressGroupTypes.kerio_web_ThisMachine:
k_iconClass += 'agTypeFirewall';
k_text = kerio.lib.k_tr('Firewall', 'common');
break;
case k_constAddressGroupTypes.kerio_web_GeoCode:
k_iconClass = 'agTypeGeoCode';
k_text = k_data.geoCode;
break;
} switch (k_data.status) {
case k_constStoreStatus.kerio_web_StoreStatusNew:
k_iconClass += ' added';
break;
case k_constStoreStatus.kerio_web_StoreStatusModified:
k_iconClass += ' modified';
break;
} return {
k_iconCls:   k_iconClass,
k_data: k_text
};
};
kerio.waw.shared.k_methods.k_renderers.k_interfaceGroupNameRenderer = function(k_value) {
var
k_constGroupTypes = kerio.waw.shared.k_CONSTANTS.InterfaceGroupType,
k_tr = kerio.lib.k_tr,
k_iconCls = 'interfaceHeaderIcon ',
k_groupName;
switch (k_value) {
case k_constGroupTypes.Internet:
k_iconCls += 'groupInternet';
k_groupName = k_tr('Internet Interfaces', 'interfaceList');
break;
case k_constGroupTypes.Trusted:
k_iconCls += 'groupTrusted';
k_groupName = k_tr('Trusted/Local Interfaces', 'interfaceList');
break;
case k_constGroupTypes.Vpn:
k_iconCls += 'groupVpn';
k_groupName = k_tr('IPsec and Kerio VPN Interfaces', 'interfaceList');
break;
case k_constGroupTypes.Guest:
k_iconCls += 'groupGuest';
k_groupName = k_tr('Guest Interfaces', 'interfaceList');
break;
case k_constGroupTypes.Other:
k_iconCls += 'groupOther';
k_groupName = k_tr('Other Interfaces', 'interfaceList');
break;
}
return {
k_data: k_groupName,
k_iconCls: k_iconCls
};
};

kerio.waw.shared.k_methods.k_renderers.k_validTimeRangeRenderer = function(k_value, k_data) {
var
k_tooltip = '',
k_iconCls, k_text;
if (k_data.validTimeRange.invalid) {
k_iconCls = 'policyGrid gridListIcon objectNothing invalid';
}
k_value = k_data.validTimeRange; k_text = k_value.name;
if ('' === k_text) {
return {k_data: ''};
}
if (k_value.invalid) {
k_iconCls = 'grpHeader timeRangeIcon invalid';
k_tooltip = kerio.lib.k_tr('This group no longer exists', 'ruleList');
}
else {
k_iconCls = 'grpHeader timeRangeIcon';
}
if (this.k_highlightSearchValueRenderer) {
k_data.validTimeRangeEditor = k_text;
k_text = this.k_highlightSearchValueRenderer(k_text, k_data);
}
return {
k_data: k_text,
k_iconCls: k_iconCls,
k_dataTooltip: k_tooltip,
k_iconTooltip: k_tooltip,
k_isSecure: true
};
};

kerio.waw.shared.k_methods.k_renderers.k_tooltipRenderer = function (k_value) {
return {
k_data: k_value,
k_dataTooltip: k_value
};
};
kerio.waw.shared.k_methods.k_renderers.k_userOrEmailRenderer = function (k_addressee) {
var
k_class = '',
k_recipient = '',
k_recipientOutput;
if (k_addressee && kerio.waw.shared.k_CONSTANTS.AddresseeType.AddresseeUser === k_addressee.type) {
k_recipientOutput = kerio.waw.shared.k_methods.k_createReferencedUserName(k_addressee.user);
k_recipient = k_recipientOutput.k_userName;
k_class = k_recipientOutput.k_iconClass;
}
else if ('' !== k_addressee.email) {
k_recipient = k_addressee.email;
k_class = 'sendMail';
}
return {
k_data: k_recipient,
k_iconCls: k_class
};
};

kerio.waw.shared.k_methods.k_renderers.k_highlightSearchValueRenderer = function(k_value, k_data, k_ignoreHtmlEncode) {
var
k_searchValue = this._k_searchValue,
k_encodedValue = kerio.lib.k_htmlEncode(k_value).replace('&amp;', '&'),
k_highlightedValue = k_encodedValue;
if(k_ignoreHtmlEncode === true){
k_highlightedValue = k_value;
}
if (k_searchValue) {
k_highlightedValue = kerio.waw.shared.k_methods.k_renderers.k_findSearchValue(k_highlightedValue, k_searchValue, false);
if (k_data && !k_data.k_isFound) {
k_data.k_isFound = k_encodedValue !== k_highlightedValue;
}
}
return k_highlightedValue;
};

kerio.waw.shared.k_methods.k_renderers.k_highlightPassedValue = function(k_passedValue, k_dataValue, k_data) {
var
k_searchValue = this._k_searchValue,
k_highlightedValue = kerio.lib.k_htmlEncode(k_passedValue),
k_tooltip = k_dataValue,
k_isFound = false;
if (k_searchValue) {
k_tooltip = kerio.waw.shared.k_methods.k_renderers.k_findSearchValue(k_tooltip, k_searchValue, true);
if (k_tooltip !== k_dataValue) {
k_highlightedValue = kerio.waw.shared.k_methods.k_renderers.k_doHighlighting(k_highlightedValue, k_tooltip);
k_isFound = true;
if (k_data) {
k_data.k_isFound = true;
}
}
}
return {
k_isFound: k_isFound,
k_data: k_highlightedValue,
k_tooltip: k_tooltip
};
};

kerio.waw.shared.k_methods.k_renderers.k_findSearchValue = function(k_text, k_searchValue, k_isTooltip) {
var
k_beginMark = k_isTooltip ? '<b>' : '<span class="searchHighlighting">',
k_endMark = k_isTooltip ? '</b>' : '</span>',
k_searchStartPosition = 0,
k_searchValueLength = k_searchValue.length,
k_searchtPositionIncrement = k_searchValueLength + k_beginMark.length + k_endMark.length,
k_index;
k_searchValue = k_searchValue.toLowerCase();
k_index = k_text.toLowerCase().indexOf(k_searchValue);
while (0 <= k_index) {
k_text = [
k_text.substring(0,k_index),
k_beginMark,
k_text.substring(k_index, k_index + k_searchValueLength),
k_endMark,
k_text.substring(k_index + k_searchValueLength)
].join('');
k_searchStartPosition = k_index + k_searchtPositionIncrement;
k_index = k_text.toLowerCase().indexOf(k_searchValue, k_searchStartPosition);
}
return k_text;
};

kerio.waw.shared.k_methods.k_renderers.k_doHighlighting = function(k_value, k_tooltipValue) {
var
k_tooltip = k_tooltipValue ? kerio.lib.k_buildTooltip(k_tooltipValue, true) : '',
k_highlightedValue;
k_highlightedValue = [
'<span class="searchHighlighting" ', k_tooltip, ' >',
k_value,
'</span>'
].join('');
return k_highlightedValue;
};

kerio.waw.shared.k_methods.k_renderers.k_renderCertificate = function(k_certificate, k_invalidOnly, k_expiredIsFine) {
var
k_shared = kerio.waw.shared,
kerio_web_SharedConstants = k_shared.k_CONSTANTS.kerio_web_SharedConstants,
k_TRANSLATIONS_CERTIFICATES = k_shared.k_DEFINITIONS.k_CERTIFICATE_GRID_TRANSLATIONS,
k_isCertificateInvalid = false,
k_iconCls = '',
k_text = '',
k_className,
k_certificateData,
k_certificates,
k_validType;
if ('' === k_certificate.name && k_certificate.invalid) {
k_text = k_TRANSLATIONS_CERTIFICATES.k_DELETED;
k_iconCls = 'removedCertificateIcon';
k_isCertificateInvalid = true;
}
else {
k_certificates = kerio.waw.shared.k_data.k_get('k_certificates');
k_certificateData = k_certificates.k_getCertificateData(k_certificate.id);
if (!k_certificate.invalid) {
if (!k_certificateData || !k_certificateData.valid) {
k_text = k_TRANSLATIONS_CERTIFICATES.k_INVALID;
k_iconCls = 'expiredCertificateIcon';
k_isCertificateInvalid = true;
}
else {
k_validType = k_certificateData.validPeriod.validType;
if (k_expiredIsFine || kerio_web_SharedConstants.kerio_web_Valid === k_validType || kerio_web_SharedConstants.kerio_web_ExpireSoon === k_validType) {
if (k_invalidOnly) {
return false;
}
k_text = k_certificateData.name;
k_iconCls = 'certificateIcon';
}
else {
k_text = kerio_web_SharedConstants.kerio_web_NotValidYet === k_validType ? k_TRANSLATIONS_CERTIFICATES.k_NOT_VALID_YET : k_TRANSLATIONS_CERTIFICATES.k_EXPIRED;
k_iconCls = 'expiredCertificateIcon';
k_isCertificateInvalid = true;
}
}
}
}
if (k_isCertificateInvalid) {
k_className = 'grayedText';
}
return {
k_data: k_text,
k_iconCls: k_iconCls,
k_className: k_className
};
};

kerio.waw.shared.k_methods.k_renderers.k_interfaceIconsForListLoader = function(k_data) {
var
k_interfaceData = {
id: k_data.id,
type: k_data.type,
enabled: true
},
k_rendererData;
k_rendererData = kerio.waw.shared.k_methods.k_formatInterfaceName('', k_interfaceData);
if (this.k_interfaceStore) {
this.k_interfaceStore[k_interfaceData.id] = k_interfaceData.type;
}
return k_rendererData.k_iconCls;
};

kerio.waw.shared.k_methods.k_renderers.k_renderMBColumn = function(k_value) {
var
kerio_web_SharedConstants = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_formatedValue = kerio.waw.shared.k_methods.k_formatDataUnits({
k_value: k_value,
k_units: kerio_web_SharedConstants.kerio_web_KiloBytes,
k_outputUnits: kerio_web_SharedConstants.kerio_web_MegaBytes,
k_isInTime: false,
k_numberFormat: {k_decimalPlaces: 0}
});
return {
k_data: k_formatedValue.k_formatedValue,
k_dataTooltip: k_formatedValue.k_tooltipString
};
};

kerio.waw.shared.k_methods.k_renderers.k_decorateWithHighlighting = function(k_closureRenderFunction) {
return function (k_value, k_data) {
var
k_renderedData;
k_renderedData = k_closureRenderFunction(k_value, k_data);
k_renderedData.k_data = kerio.waw.shared.k_methods.k_renderers.k_highlightSearchValueRenderer.call(this, k_renderedData.k_data, k_renderedData, k_renderedData.k_ignoreHtmlEncode);
k_renderedData.k_isSecure = true;
return k_renderedData;
}
};
kerio.waw.shared.k_methods.k_renderers.k_lineRenderTraffic = function() {};