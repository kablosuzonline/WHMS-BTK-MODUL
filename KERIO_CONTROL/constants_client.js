kerio.waw.shared.k_CONSTANTS = {
"k_WEB_PORT_UNSECURED": 4080,
"k_WEB_PORT_SECURED": 4081,
"k_WEB_PORT_SSL_VPN": 443, "k_VPN_SERVICE_PORT_IKE": 500,
"k_VPN_SERVICE_PORT_IPSEC": 50,
"k_VPN_SERVICE_PORT_IPSEC_NAT": 4500,
"k_VPN_SERVICE_PORT_KVPN": 4090,
"k_WEB_SERVICE_PORT_HTTP": 80,
"k_WEB_SERVICE_PORT_HTTPS": 443,
"k_GUESTS_TRAFFIC_SERVICE_PORT_DNS": 53,
"k_GUESTS_TRAFFIC_SERVICE_PORT_DHCP_BOOTP_FROM": 67,
"k_GUESTS_TRAFFIC_SERVICE_PORT_DHCP_BOOTP_TO": 68,
"k_LOG_TYPES": {
"k_LOG_CONFIG": "config",
"k_LOG_DEBUG": "debug",
"k_LOG_DIAL": "dial",
"k_LOG_ERROR": "error",
"k_LOG_SECURITY": "security",
"k_LOG_WARNING": "warning"
},
"k_BATCH_MAX_COMMAND_COUNT": 100,
"k_ERROR_BATCH_MAX_COMMAND_EXCEEDED": -32606,
"k_ICMP_MESSAGES_ID": {
"k_ANY": "any",
"k_ECHO_REPLY": "0",
"k_ECHO": "8",
"k_REDIRECT": "5",
"k_DEST_UNREACHABLE": "3",
"k_TIME_EXCEEDED": "11",
"k_SOURCE_QUENCH": "4",
"k_PARAM_PROBLEM": "12"
},
"k_BITE_UNITS": {
"k_b": "kerio_web_Bites",
"k_Kb": "kerio_web_KiloBites",
"k_Mb": "kerio_web_MegaBites",
"k_Gb": "kerio_web_GigaBites",
"k_Tb": "kerio_web_TeraBites",
"k_Pb": "kerio_web_PetaBites"
},
"k_TIME_UNITS_SETTINGS": {
"k_BITE_PER_SECOND": "bps",
"k_BYTE_PER_SECOND": "Bps"
},
"k_USER_LIST_WARNINGS": { "k_AD_DISABLED_ID": 8004,
"k_USER_COLLISION_ID": 8003
},
"k_LANGUAGE_SETTINGS": {
"k_IS_BRITISH_PREFERRED": false,
"k_LANGUAGE_ENGLISH": "en",
"k_LANGUAGE_BRITISH_ENGLISH": "en-gb"
},
"k_IPSEC_IDS_DENY_VALUES": {
"k_EMPTY_IP": "0.0.0.0",
"k_ANY": "%any"
},
"k_SNAPSHOT_OPERATION_TYPES": {
"k_CREATE": 0,
"k_DISCARD": 1,
"k_APPLY": 2
},
"k_POLICY_BCKG_COLORS": {
"k_WHITE": "FFFFFF",
"k_YELLOW": "FFFFB2",
"k_BLUE": "C9D8ED",
"k_RED": "FFCCCC",
"k_GREEN": "C9EEC6",
"k_MAGENTA": "DDBFEB",
"k_ORANGE": "FDE8CA",
"k_GREY": "E8E8E8"
},
"k_WEB_CATEGORIZATION_URL": "http:\/\/www.kerio.com\/firewall\/user-management\/web-content-filter\/test-a-site",
"k_FILE_TYPE_DEFINITION_TYPE": {
"k_PREDEFINED": "webadmin_FileTypePredefined",
"k_CUSTOM": "webadmin_FileTypeCustom"
},
"k_LIMIT_MULTILINE_LIST_RENDERER": 10,
"k_COLLAPSE_MULTILINE_LIST": false,"k_TRAFFIC_ENTITY_TYPES_NUMBER": {
"k_HOST": 0,
"k_NETWORK": 0,
"k_RANGE": 0,
"k_FIREWALL": 0,
"k_ADDRESS_GROUP": 1,
"k_INTERFACE": 2,
"k_VPN": 3,
"k_USERS": 4,
"k_INVALID": 5
},
"k_TRAFFIC_MESSAGES": {
"k_SET_CONFIRM": "If you apply these traffic rules, you may be disconnected from the firewall. Are you sure you want to apply these traffic rules?"
},
"k_CERTIFICATE_TYPE": {
"k_WEBIFACE": "webadmin_ServiceTypeWebInterface",
"k_VPN_SERVER": "webadmin_ServiceTypeVpnServer"
},
"k_SMTP_TYPE": {
"k_KERIO_MANAGER": "kerioManager",
"k_APP_MANAGER": "appManager",
"k_SMTP_SERVER": "smtpServer"
},
"k_LLB_INCOMPATIBILITY_URL": "http:\/\/www.kerio.com\/control\/llb2008r2",
"k_DEFAULT_INSPECTORS": {
"k_NONE": "none",
"k_DEFAULT": "default"
},
"k_DEFAULT_MAC_ADDRESS": "000000000000",
"k_IP_ADDRESS_EDITOR_TYPES": {
"k_IPv4_ADDRESS": 1,
"k_IPv4_MASK": 2,
"k_IPv6_ADDRESS": 4,
"k_IPv6_PREFIX": 8
},
"k_ALERT_GROUP": {
"k_SYSTEM": "1",
"k_RULE": "2",
"k_LOG": "3"
},
"k_ALERT_SYSTEM_ID": {
"k_P2PNETWORK": "P2PNETWORK",
"k_AVCHECK": "AVCHECK",
"k_BACKUP": "BACKUP",
"k_CHECKSUM": "CHECKSUM",
"k_DHCP": "DHCP",
"k_CONNLIMIT": "CONNLIMIT",
"k_CONNECTIVITY": "CONNECTIVITY",
"k_LICENSE": "LICENSE",
"k_LICENSESIZE": "LICENSESIZE",
"k_LOCALCA": "LOCALCA",
"k_LOWSPACE": "LOWSPACE",
"k_NEWVERSION": "NEWVERSION",
"k_RASLINE": "RASLINE",
"k_QUOTA": "QUOTA",
"k_VIRUS": "VIRUS",
"k_TUNNELSTATUS": "TUNNELSTATUS",
"k_HA": "HA"
},
"k_TIME_CONSTANTS": {
"k_SECONDS_IN_DAY": 86400,
"k_SECONDS_IN_HOUR": 3600,
"k_SECONDS_IN_MIN": 60,
"k_HOURS_IN_DAY": 24
},
"k_VALUE_SIZES": {
"k_UNSIGNED_BYTE": { "k_min": 0,
"k_max": 255
},
"k_UNSIGNED_WORD": { "k_min": 0,
"k_max": 65535
},
"k_UNSIGNED_DWORD": { "k_min": 0,
"k_max": 4294967295
},
"k_SIGNED_BYTE": { "k_min": -128,
"k_max": 127
},
"k_SIGNED_WORD": { "k_min": -32768,
"k_max": 32767
},
"k_SIGNED_DWORD": { "k_min": -2147483648,
"k_max": 2147483647
}
},
"k_CHART_TICKS_COUNT": {
"k_PERCENT": 3, "k_TRAFFIC": 3 },
"k_MAX_MULTI_IPV4": 1000, "k_MAX_IPV4_LIST": 32, "k_MAX_PORT_LIST": 32, "k_MAX_INT_LIST": 32, "k_MAX_VLAN_LIST": 1000,
"k_TIMEOUT_REQUEST_DOMAIN_CONTROLLER": 120000, "k_TIMEOUT_REQUEST_DEFAULT": 30000,
"k_DATE_TIME_FORMATS": {
"k_DATE": "Y-m-d",
"k_TIME": "H:i",
"k_TIME_SEC": "H:i:s",
"k_TIME_PARSE": "G:i:s",
"k_DATE_TIME": "Y-m-d H:i"
},
"k_SERVICE_TYPE": {
"k_SERVICE": 0,
"k_PORT": 1
},
"k_VALUE_UNCHANGED": -1,
"k_USER_TEMPLATE": {
"k_UPDATABLE_FIELDS": [
"localEnabled",
"description"
],
"k_NOT_USED": 0,
"k_USED": 1
},
"k_MAX_LENGTH": {
"k_IP_ADDRESS": 15,
"k_MAC_ADDRESS": 17, "k_IPV6_ADDRESS": 39, "k_IPV6_PREFIX": 43, "k_RULE_NAME": 127,
"k_DOMAIN_NAME": 255,
"k_HOSTNAME": 255,
"k_HOSTNAME_OR_IP_ADDRESS": 255,
"k_HOST_WITH_PORT": 255,
"k_IP_ADDRESS_LIST": 127,
"k_EMAIL_ADDRESS": 255,
"k_FILE_TYPE_LIST": 255
},
"k_REVERSE_PROXY_DEFAULT_CERTIFICATE_ID":"k_REVERSE_PROXY_DEFAULT_CERTIFICATE_ID",
"k_LOGS": {
"k_DEBUG_SHOW_STATUS_PREFIX": "k_logDebugShowStatus.",
"k_HTTP_TYPE_PREFIX": "k_logHttpFormat."
},
"k_ALLOW_DRAG_AND_DROP": true,
"RuleConditionType":{
"k_NONE":"k_none" },
"InterfaceType": {
"k_RAS_PPPoE": "Ras_PPPoE",
"k_RAS_PPTP": "Ras_PPTP",
"k_RAS_L2TP": "Ras_L2TP",
"k_EMPTY": "empty",
"k_UNASSIGNED": "unassigned"
},
"ContentConditionEntityType": {
"k_INVALID": "webadmin_ContentConditionEntityInvalid"
},
"SourceConditonEntityType": {
"k_INVALID": "webadmin_SourceConditonEntityType"
},
"TrafficEntityType": {
"k_FIREWALL": "k_firewall", "k_INVALID": "webadmin_TrafficEntityInvalid"
},
"WarningType": {
"k_CONNECTION_TIMEOUT": "webadmin_ServerConnectionTimeout"
},
"AlertEventRuleType": {
"k_SYSTEM": "systemAlert",
"k_LOG": "logAlert",
"k_RULE": "ruleAlert"
}
};
