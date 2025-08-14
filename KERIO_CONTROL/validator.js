
kerio.waw.init.k_initValidators = function() {
var k_methods = kerio.waw.shared.k_methods,
k_inputValidator = kerio.lib.k_inputValidator,
k_VALIDATOR = kerio.waw.shared.k_CONSTANTS.k_VALIDATOR;
k_methods.k_validators = {

k_isPortList: function(k_value) {
var
k_validators = kerio.waw.shared.k_methods.k_validators,
k_tmpValue,
k_values = k_value.split(','),
k_cnt = k_values.length,
k_i;
if (kerio.waw.shared.k_CONSTANTS.k_MAX_PORT_LIST < k_cnt) {
return false;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_tmpValue = parseInt(k_values[k_i], 10);
if (!k_validators.k_isInRange(k_tmpValue)) {
return false; }
}
return true;
}, 
k_isVlanList: function(k_value) {
var
k_validators = kerio.waw.shared.k_methods.k_validators,
k_values = k_value.split(';'),
k_cnt = k_values.length,
k_i;
if (kerio.waw.shared.k_CONSTANTS.k_MAX_VLAN_LIST < k_cnt) {
return false;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
if (!k_validators.k_isInRange(k_values[k_i], 0, 4095)) {
return false; }
}
return true;
}, 
k_isPortListWithRange: function(k_value) {
var
k_validators = kerio.waw.shared.k_methods.k_validators,
k_isInRangeValidator = k_validators.k_isInRange,
k_values,
k_currentValue,
k_indexOfDash,
k_i, k_cnt,
k_from, k_to;
if (-1 === k_value.indexOf('-')) {
return k_validators.k_isPortList(k_value);
}
k_values = k_value.split(',');
for (k_i = 0, k_cnt = k_values.length; k_i < k_cnt; k_i++) {
k_currentValue = k_values[k_i];
k_indexOfDash = k_currentValue.indexOf('-');
if (-1 === k_indexOfDash) { if (!k_isInRangeValidator(parseInt(k_currentValue, 10))) {
return false; }
}
else { k_from = parseInt(k_currentValue.substring(0, k_indexOfDash),  10);
k_to   = parseInt(k_currentValue.substring(k_indexOfDash + 1), 10);
if (!k_isInRangeValidator(k_from) || !k_isInRangeValidator(k_to) || k_from >= k_to) {
return false; }
}
}
return true;
}, 
k_isPortListWithLimitedRange: function(k_value) {
var
k_validators = kerio.waw.shared.k_methods.k_validators,
k_isInRangeValidator = k_validators.k_isInRange,
k_values,
k_currentValue,
k_indexOfDash,
k_i, k_cnt,
k_from, k_to;
if (-1 === k_value.indexOf('-')) {
return k_validators.k_isPortList(k_value);
}
k_values = k_value.split(',');
for (k_i = 0, k_cnt = k_values.length; k_i < k_cnt; k_i++) {
k_currentValue = k_values[k_i];
k_indexOfDash = k_currentValue.indexOf('-');
if (-1 === k_indexOfDash) { if (!k_isInRangeValidator(parseInt(k_currentValue, 10))) {
return false; }
}
else { k_from = parseInt(k_currentValue.substring(0, k_indexOfDash),  10);
k_to   = parseInt(k_currentValue.substring(k_indexOfDash + 1), 10);
if (!k_isInRangeValidator(k_from) || !k_isInRangeValidator(k_to) || k_from >= k_to) {
return false; }
if (100 < (k_to - k_from)) { return false;
}
}
}
return true;
}, 
k_isInRange: function(k_value, k_min, k_max) {
if (undefined === k_min) { k_min = 0; }
if (undefined === k_max) { k_max = 65536; } if (/^-?[0-9][0-9]*$/.test(k_value)) {
k_value = parseInt(k_value, 10);
return (k_min < k_value) && (k_value < k_max);
} else {
return false; }
},

k_isIpAddress: function(k_ip, k_allowZeroIp) {
if (!kerio.waw.shared.k_DEFINITIONS.k_ipAddressRegExp.test(k_ip)) {  return false;
}
if (kerio.waw.shared.k_DEFINITIONS.k_zeroIpAddressRegExp.test(k_ip)) { return (true === k_allowZeroIp);
}
return true;
},

k_isIpv6Address: function(k_ip) {
return kerio.waw.shared.k_DEFINITIONS.k_ipv6AddressRegExp.test(k_ip);
},

k_isIpv4Or6Address: function(k_value) {
var
k_validators = kerio.waw.shared.k_methods.k_validators,
k_addressLength = k_value.length;
if (k_validators.k_isIpAddress(k_value, true)) {
return true;
}
if (-1 === k_value.indexOf('[')) {
return k_validators.k_isIpv6Address(k_value);
}
if (0 === k_value.indexOf('[') && k_addressLength - 1 === k_value.indexOf(']')) {
return k_validators.k_isIpv6Address(k_value.substring(1, k_addressLength - 1));
}
return false;
},

k_isIpv4Or6Prefix: function(k_value) {
var
k_methods = kerio.waw.shared.k_methods,
k_validators = k_methods.k_validators,
k_isIpAddress,
k_parts;
k_parts = k_value.split('/');
if (2 !== k_parts.length) {
return false;
}
k_parts[0] = k_parts[0].trim();
k_parts[1] = k_parts[1].trim();
k_isIpAddress = k_validators.k_isIpAddress(k_parts[0], true);
if (k_isIpAddress && k_validators.k_isCidrMask(k_parts[1])) {
return k_validators.k_isNetwork(k_parts[0], k_methods.k_convertCidrToMask(k_parts[1]));
}
return k_validators.k_isIpv6Address(k_parts[0]) && k_validators.k_isIpv6Network(k_parts[0], k_parts[1]);
},

k_isIpMask: function(k_mask, k_allowAllZeros) {
var
k_normalize = kerio.waw.shared.k_methods.k_normalize,
k_lastBit = '1',
k_parts,
k_part,
k_i, k_j;
if (!kerio.waw.shared.k_DEFINITIONS.k_ipAddressRegExp.test(k_mask)) {  return false;
}
k_parts = k_mask.split('.');
for (k_i = 0; k_i < 4; k_i++) {
k_part = k_normalize(k_parts[k_i], 8, { k_binary: true });
if (8 < k_part.length) {
return false; }
k_parts[k_i] = k_part;
}
if (true !== k_allowAllZeros && '1' !== k_parts[0].charAt(0)) {
return false; }
for (k_i = 0; k_i < 4; k_i++) { k_part = k_parts[k_i];
for (k_j = 0; k_j < 8; k_j++) { if (k_lastBit < k_part[k_j]) { return false;
}
k_lastBit = k_part[k_j];
}
}
return true;
},

k_isCidrMask: function(k_value) {
return kerio.waw.shared.k_DEFINITIONS.k_cidrMaskRegExp.test(k_value);
},

k_isIpAddressList: function(k_value, k_itemValidator) {
var
k_validators = kerio.waw.shared.k_methods.k_validators,
k_values = k_value.split(';'),
k_cnt = k_values.length,
k_tmpValue,
k_i;
k_itemValidator = k_itemValidator || k_validators.k_isIpAddress;
if (kerio.waw.shared.k_CONSTANTS.k_MAX_IPV4_LIST < k_cnt) {
return false;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_tmpValue = k_values[k_i];
if (!k_itemValidator(k_tmpValue)) {
return false; }
}
return true;
}, k_isMacAddress: function(k_value) {
if (!k_value || k_value.length < 12) {
return false;
}
return kerio.waw.shared.k_DEFINITIONS.k_macAddressRegExp.test(k_value);
},

k_isMacAddressList: function(k_value) {
var
k_validators = kerio.waw.shared.k_methods.k_validators;
return k_validators.k_isIpAddressList(k_value,k_validators.k_isMacAddress);
},

k_isHostsList: function(k_value) {
var
k_hasNoSpaces = kerio.lib.k_inputValidator.k_getFunctionByName('k_hasNoSpaces'),
k_i, k_cnt,
k_list,
k_listTrimmed;
k_list = k_value.split(';');
for (k_i = 0, k_cnt = k_list.length; k_i < k_cnt; k_i++) {
k_listTrimmed = k_list[k_i].trim();
if ('' === k_listTrimmed || k_listTrimmed.length > 255 || !k_hasNoSpaces(k_listTrimmed)) {
return false;
}
}
return true;
},
k_isIntList: function(k_value, k_bitLength) {
var
k_maxValue = Math.pow(2, k_bitLength) - 1,
k_values = k_value.split(';'),
k_cnt = k_values.length,
k_i,
k_strValue, k_intValue; if (kerio.waw.shared.k_CONSTANTS.k_MAX_INT_LIST < k_cnt) {
return false;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_strValue = k_values[k_i];
k_intValue = parseInt(k_strValue, 10);
if (isNaN(k_intValue) || k_intValue.toString() !== k_strValue) {
return false; }
if (0 > k_intValue || k_maxValue < k_intValue) {
return false; }
} return true;
}, 
k_isPortOrPortRange: function(k_value) {
var
k_ports,
k_portsCount;
k_ports = k_value.split('-');
k_portsCount = k_ports.length;
if (k_portsCount > 2) {
return false;
}
if ("" === k_ports[1]) {
return false;
}
if (!kerio.waw.shared.k_methods.k_validators.k_isInRange(k_ports[0]) || (k_ports[1] && !kerio.waw.shared.k_methods.k_validators.k_isInRange(k_ports[1]))) {
return false;
}
if (2 === k_portsCount &&
parseInt(k_ports[0], 10) > parseInt(k_ports[1], 10)) {
return false;
}
return true;
},
k_isIpRange: function(k_rangeFrom, k_rangeTo, k_allowSingleIp) {
var
k_key = 0,
k_cnt,
k_rangeFromPart,
k_rangeToPart,
k_rangeFromParts,
k_rangeToParts;
if (!k_rangeFrom || !k_rangeTo) {
kerio.lib.k_reportError('Invalid IPs to validate range: %1 - %2'.replace('%1', k_rangeFrom).replace('%2', k_rangeTo), 'Validators', 'k_isIpRange');
}
k_rangeFromParts = k_rangeFrom.split('.');
k_rangeToParts = k_rangeTo.split('.');
for (k_cnt = k_rangeFromParts.length; k_key < k_cnt; k_key++) {
k_rangeFromPart = parseInt(k_rangeFromParts[k_key], 10);
k_rangeToPart = parseInt(k_rangeToParts[k_key], 10);
if ((k_rangeToPart < k_rangeFromPart)) {
return false; }
else if (k_key === (k_cnt - 1) && k_rangeToPart === k_rangeFromPart) {
return (true === k_allowSingleIp); } else if (k_rangeToPart > k_rangeFromPart) {
break;
}
}
return true; },

k_isIpv6Range: function(k_rangeFrom, k_rangeTo, k_allowSingleIp) {
var
k_result;
k_result = kerio.waw.shared.k_methods.k_compareIpv6Addresses(k_rangeFrom, k_rangeTo);
if (0 === k_result) {
return true === k_allowSingleIp;
}
return 1 === k_result;
},

k_isNetwork: function(k_networkIp, k_networkMask) {
var
k_methods = kerio.waw.shared.k_methods,
k_net = k_methods.k_ipToNumber(k_networkIp),
k_mask = k_methods.k_ipToNumber(k_networkMask);
return (0 === (k_net  &  ~  k_mask));
},

k_isIpv6Network: function(k_networkIp, k_prefixLength) {
var
k_methods = kerio.waw.shared.k_methods,
k_isIpv6Address = k_methods.k_validators.k_isIpv6Address(k_networkIp),
k_ADDRESS_BITS_PER_DIGIT = 4,
k_ADDRESS_DIGITS_PER_GROUP = 4,
k_ADDRESS_DIGIT_MAX_VALUE = k_ADDRESS_DIGITS_PER_GROUP * k_ADDRESS_BITS_PER_DIGIT - 1,
k_parsedPrefixLength,
k_ipv6AddressPaddedWithZeroes,
k_remainingPrefixLength,
k_currentMask,
k_currentGroupValue,
k_iGroup, k_cntGroups,
k_iBit,
k_groups,
k_digit;
k_parsedPrefixLength = parseInt(k_prefixLength, 10);
if (!k_isIpv6Address || isNaN(k_parsedPrefixLength) || 0 > k_parsedPrefixLength || 129 <= k_parsedPrefixLength) {
return false;
}
k_ipv6AddressPaddedWithZeroes = k_methods.k_padIpv6AddressWithZeroes(k_networkIp);
k_groups = k_ipv6AddressPaddedWithZeroes.split(':');
k_currentMask = k_ADDRESS_DIGIT_MAX_VALUE;
k_remainingPrefixLength = k_parsedPrefixLength;
k_iGroup = Math.floor(k_remainingPrefixLength / (k_ADDRESS_DIGITS_PER_GROUP * k_ADDRESS_BITS_PER_DIGIT));
k_remainingPrefixLength -= k_iGroup * k_ADDRESS_DIGITS_PER_GROUP * k_ADDRESS_BITS_PER_DIGIT;
for (k_cntGroups = k_groups.length; k_iGroup < k_cntGroups; k_iGroup++) {
k_currentGroupValue = k_groups[k_iGroup];
for (k_iBit = 0; k_iBit < k_ADDRESS_BITS_PER_DIGIT; k_iBit++) {
if (k_ADDRESS_BITS_PER_DIGIT > k_remainingPrefixLength) {
if (0 < k_remainingPrefixLength) {
k_currentMask = 1 << k_remainingPrefixLength;
k_currentMask--;
k_currentMask = k_currentMask << (k_ADDRESS_BITS_PER_DIGIT - k_remainingPrefixLength);
}
else {
k_currentMask = 0;
}
}
k_digit = parseInt(k_currentGroupValue.charAt(k_iBit), 16);
if (k_digit != (k_digit & k_currentMask)) {
return false;
}
k_remainingPrefixLength -= k_ADDRESS_BITS_PER_DIGIT;
}
}
return true;
},

k_isHexNumber: function(k_value) {
if (!k_value || 'string' !== typeof k_value) {
return false; }
if (1 === k_value.length %2) { return false; }
return (/^([0-9A-Fa-f]+)$/.test(k_value));
},

k_isAsciiString: function(k_value) {
if ('string' !== typeof k_value) {
return false;
}
var
k_i, k_length;
for (k_i = 0, k_length = k_value.length; k_i < k_length; k_i++) {
if (k_value.charCodeAt(k_i) >= 127) {
return false;
}
}
return true;
},

k_devNameMinLength: function(k_value) {
if (k_value.length < 6) {
return false;
} else {
return true;
}
},

k_shaSecMinLength: function(k_value) {
if (k_value.length < 10) {
return false;
} else {
return true;
}
},

k_isHostWithPort: function(k_value) {
var
k_validators = kerio.waw.shared.k_methods.k_validators,
k_parsed;
if (-1 < k_value.indexOf(' ')) { return false;
}
k_parsed = k_value.split(':');
if (!k_parsed[0]) { return false;
}
if (2 > k_parsed.length) { return true;
}
if (2 < k_parsed.length) { return false;
}
return k_validators.k_isInRange(k_parsed[1]); },

k_isIpMaskOrCidr: function(k_value) {
var
k_validators = kerio.waw.shared.k_methods.k_validators;
return k_validators.k_isCidrMask(k_value) || k_validators.k_isIpMask(k_value);
},

k_isIpv4Or6MaskOrCidr: function(k_value) {
var
k_validators = kerio.waw.shared.k_methods.k_validators,
k_parsedPrefixLength;
if (k_validators.k_isCidrMask(k_value) || k_validators.k_isIpMask(k_value)) {
return true;
}
k_parsedPrefixLength = parseInt(k_value, 10);
return !isNaN(k_parsedPrefixLength) && 0 <= k_parsedPrefixLength && 129 > k_parsedPrefixLength;
},

k_isPortListServer: k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_SERVICE, k_VALIDATOR.k_PORT_LIST),
k_isPortListWithRangeServer: k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_SERVICE, k_VALIDATOR.k_PORT_LIST_WITH_RANGE)
};
kerio.lib.k_inputValidator.k_registerFunctions({
k_isProtocolNumber:  k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_SERVICE, k_VALIDATOR.k_PROTOCOL),
k_isPortNumber:      k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_SERVICE, k_VALIDATOR.k_PROTOCOL),
k_isDescription:     k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_SERVICE, k_VALIDATOR.k_DESCRIPTION),
k_isName:            k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_SERVICE, k_VALIDATOR.k_NAME),
k_isTimeWithSeconds: k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_SYSTEM_CONFIG, k_VALIDATOR.k_TIME_WITH_SECONDS),
k_isDate:            k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_TIME_RANGE, k_VALIDATOR.k_DATE),
k_isUserName:        k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_USER, k_VALIDATOR.k_USER_NAME),
k_isUserNameDomain:  k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_USER, k_VALIDATOR.k_USER_NAME_DOMAIN),
k_isUserGroupName:   k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_USER, k_VALIDATOR.k_USER_NAME),
k_isEmail:           k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_USER, k_VALIDATOR.k_EMAIL),
k_isFingerprint:     k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_INTERFACE, k_VALIDATOR.k_FINGERPRINT),
k_isUuidFormat:      k_inputValidator.k_getRestrictionsValidator(k_VALIDATOR.k_ENTITY_INTERFACE, k_VALIDATOR.k_UUID_FORMAT),
k_isPortOrPortRange: k_methods.k_validators.k_isPortOrPortRange,
k_isIpAddress:       k_methods.k_validators.k_isIpAddress,
k_isIpv6Address:     k_methods.k_validators.k_isIpv6Address,
k_isIpv4Or6Address:  k_methods.k_validators.k_isIpv4Or6Address,
k_isIpv4Or6Prefix:   k_methods.k_validators.k_isIpv4Or6Prefix,
k_isIpAddressList:   k_methods.k_validators.k_isIpAddressList,
k_isIpMask:          k_methods.k_validators.k_isIpMask,
k_isHexNumber:       k_methods.k_validators.k_isHexNumber,
k_isHostsList:       k_methods.k_validators.k_isHostsList,
k_isHostWithPort:    k_methods.k_validators.k_isHostWithPort,
k_devNameMinLength:  k_methods.k_validators.k_devNameMinLength,
k_shaSecMinLength:  k_methods.k_validators.k_shaSecMinLength,
k_isMacAddressList:  k_methods.k_validators.k_isMacAddressList,
k_isMacAddress:      k_methods.k_validators.k_isMacAddress,
k_isIpMaskOrCidr: function(k_value) {
return kerio.waw.shared.k_methods.k_validators.k_isIpMaskOrCidr(k_value);
},
k_isIpv4Or6MaskOrCidr: function(k_value) {
return kerio.waw.shared.k_methods.k_validators.k_isIpv4Or6MaskOrCidr(k_value);
},
k_isIpv6PrefixLength: function(k_value) {
return kerio.waw.shared.k_methods.k_validators.k_isInRange(k_value, 0, 128);
},
k_isPortList: function(k_value) {
return (kerio.waw.shared.k_methods.k_validators.k_isPortListServer(k_value) && kerio.waw.shared.k_methods.k_validators.k_isPortList(k_value));
},
k_isVlanList: function(k_value) {
return kerio.waw.shared.k_methods.k_validators.k_isVlanList(k_value);
},
k_isPortListWithRange: function(k_value) {
return (kerio.waw.shared.k_methods.k_validators.k_isPortListWithRangeServer(k_value) && kerio.waw.shared.k_methods.k_validators.k_isPortListWithRange(k_value));
},
k_isPortListWithLimitedRange: function(k_value) {
return (kerio.waw.shared.k_methods.k_validators.k_isPortListWithRangeServer(k_value) && kerio.waw.shared.k_methods.k_validators.k_isPortListWithLimitedRange(k_value));
},
k_hasNoSpaces: function(k_value) {
return (-1 === k_value.indexOf(' '));
},
k_hasNoQuotes: function(k_value) {
return (-1 === k_value.indexOf('"'));
},
k_isRouteIpAddress: function(k_value) { return kerio.waw.shared.k_methods.k_validators.k_isIpAddress(k_value, true);
},
k_isRouteMask: function(k_value) { return kerio.waw.shared.k_methods.k_validators.k_isIpMask(k_value, true);
},
k_isRouteMaskOrCidr: function(k_value) { var k_validators = kerio.waw.shared.k_methods.k_validators;
return k_validators.k_isCidrMask(k_value) || k_validators.k_isIpMask(k_value, true);
},
k_isInt8List: function(k_value) {
return kerio.waw.shared.k_methods.k_validators.k_isIntList(k_value, 8);
},
k_isInt16List: function(k_value) {
return kerio.waw.shared.k_methods.k_validators.k_isIntList(k_value, 16);
},
k_isInt32List: function(k_value) {
return kerio.waw.shared.k_methods.k_validators.k_isIntList(k_value, 32);
},
k_isNumber: function(k_value) {
return kerio.waw.shared.k_methods.k_validators.k_isInRange(k_value, 0, 999999999);
},
k_isPercentage: function(k_value) {
return kerio.waw.shared.k_methods.k_validators.k_isInRange(k_value, 0, 100);
},
k_isTime: function(k_value) {
return kerio.waw.shared.k_DEFINITIONS.k_timeRegExp.test(k_value);
},
k_isHttpProtocol: function(k_value) {
return kerio.waw.shared.k_DEFINITIONS.k_httpProtocolExp.test(k_value);
},
k_isHostIp: function(k_value){
return kerio.waw.shared.k_DEFINITIONS.k_isHostIpRegExp.test(k_value);
},
k_ipToolsTargetValidator: function(k_value) {
return kerio.waw.shared.k_DEFINITIONS.k_isIpToolsTargetRegExp.test(k_value);
},
k_snmpCommunityValidator: function(k_value) {
return kerio.waw.shared.k_DEFINITIONS.k_snmpCommunityRegExp.test(k_value);
},
k_snmpV3PasswordValidator: function(k_value) {
return kerio.waw.shared.k_DEFINITIONS.k_snmpV3PassworRegExp.test(k_value);
},
k_configurationBackupValidator: function(k_value) {
return kerio.waw.shared.k_DEFINITIONS.k_backupPassworRegExp.test(k_value);
},
k_isIpsecTunnelIdValid: function(k_value) {
var
k_IPSEC_IDS_DENY_VALUES = kerio.waw.shared.k_CONSTANTS.k_IPSEC_IDS_DENY_VALUES;
return k_IPSEC_IDS_DENY_VALUES.k_EMPTY_IP !== k_value && k_IPSEC_IDS_DENY_VALUES.k_ANY !== k_value.toLowerCase();
},
k_isIpsecTunnelIdValidWithoutSpaces: function(k_value) {
var
k_hasNoSpaces = kerio.lib.k_inputValidator.k_getFunctionByName('k_hasNoSpaces'),
k_isIpsecTunnelIdValid = kerio.lib.k_inputValidator.k_getFunctionByName('k_isIpsecTunnelIdValid');
return k_hasNoSpaces(k_value) && k_isIpsecTunnelIdValid(k_value);
},
k_isSnmpValue: function(k_value) {
var
k_isAsciiString = kerio.waw.shared.k_methods.k_validators.k_isAsciiString,
k_noLeadingSpacesRegExp = kerio.waw.shared.k_DEFINITIONS.k_noLeadingSpacesRegExp;
return k_isAsciiString(k_value) && k_noLeadingSpacesRegExp.test(k_value);
},
k_radiusSecretValidator: function(k_value) {
return -1 === k_value.indexOf('"');
},

k_isReverseProxyPublicHost: function(k_value) {
if (kerio.waw.shared.k_DEFINITIONS.k_isHostIpRegExp.test(k_value)) {
return true;
}
var
k_valueLength = k_value.length,
k_ip;
if (2 < k_valueLength && '[' === k_value.charAt(0) && ']' === k_value.charAt(k_valueLength - 1)) {
k_ip = k_value.slice(1, k_valueLength - 1);
return kerio.waw.shared.k_DEFINITIONS.k_ipv6AddressRegExp.test(k_ip);
}
return '*' === k_value;
},

k_isReverseProxyInternalHost: function(k_value) {
var
k_validators = kerio.waw.shared.k_methods.k_validators,
k_countOfColons = (k_value.split(':').length - 1),
k_addressLength = k_value.length,
k_parts;
if (-1 !== k_value.indexOf('/')) {
return false;
}
if (1 >= k_countOfColons) {
return k_validators.k_isHostWithPort(k_value);
}
if (-1 === k_value.indexOf('[')) {
return k_validators.k_isIpv6Address(k_value);
}
if (0 === k_value.indexOf('[') && k_addressLength - 1 === k_value.indexOf(']')) {
return k_validators.k_isIpv6Address(k_value.substring(1, k_addressLength - 1));
}
if (0 === k_value.indexOf('[') && -1 !== k_value.indexOf(']:')) {
k_parts = k_value.split(']:');
return k_validators.k_isIpv6Address(k_parts[0].substring(1)) && k_validators.k_isInRange(k_parts[1]);
}
return false;
},
k_emptyValidator: function() {
return true;
}
}); k_methods = null;
k_inputValidator = null;
k_VALIDATOR = null;
kerio.waw.init.k_asyncOperations--; };
