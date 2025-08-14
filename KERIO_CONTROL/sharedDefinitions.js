


kerio.waw.init.k_initSharedDefinitions = function () {
var
k_tr = kerio.lib.k_tr,
k_WEB_CONSTANTS = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_createIpv6AddressRegExp;

kerio.waw.shared.k_DEFINITIONS = {

k_get: function(k_definitionName, k_config) {
var
k_getScope = kerio.lib._k_getPointerToObject,
k_clone,
k_definition,
K_Class; if ('string' !== typeof k_definitionName) {
kerio.lib.k_reportError('Internal error: name of definition must be String', 'k_DEFINITIONS', 'k_get');
return;
}
if ('kerio.' === k_definitionName.substr(0,6)) {
k_definition = k_getScope(k_definitionName.substr(6), 'kerio'); }
else if ('this.' === k_definitionName.substr(0,5)) {
k_definition = k_getScope.call(this, k_definitionName); }
else if (arguments.callee === this.k_get) {
k_definition = k_getScope.call(this, 'this.' + k_definitionName); }
else {
k_definition = k_getScope(k_definitionName, 'kerio.waw.shared.k_DEFINITIONS'); }
switch (typeof k_definition) { case 'undefined': kerio.lib.k_reportError('Definition ' + k_definitionName + ' not found.', 'k_DEFINITIONS', 'k_get');
return; case 'function': K_Class = k_definition;
return new K_Class(k_config);
case 'object': k_clone = kerio.lib.k_cloneObject(k_definition); if ('object' === typeof k_config) { kerio.waw.shared.k_methods.k_mergeObjects(k_config, k_clone);
}
return k_clone;
default: return k_definition; } } }; var
k_shared = kerio.waw.shared,
k_WAW_DEFINITIONS = k_shared.k_DEFINITIONS,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS;
k_WAW_DEFINITIONS.k_AUTOREFRESH_INTERVAL = 5000;
k_WAW_DEFINITIONS.k_AUTOREFRESH_DISABLED = 0;
k_WAW_DEFINITIONS.k_DASHBOARD_LIST_ID = 'dashboard';
k_WAW_DEFINITIONS.k_KB_STATUS = {
k_IMG: "kb.kerio.com/search/img/connectivityCheck.gif?v=8629",
k_CHECKING: 0,
k_AVAIABLE: 1,
k_OFFLINE: 2,
k_status: ''
};

k_WAW_DEFINITIONS.k_searchCondition = function(k_config) {
var
k_COMPARATORS = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_conditions = [],
k_singleCondition = false,
k_value,
k_comparator,
k_fieldName,
k_i, k_cnt;
if (Array !== k_config.constructor) {
k_config = [ k_config ];
k_singleCondition = true;
}
for (k_i = 0, k_cnt = k_config.length; k_i < k_cnt; k_i++) {
k_value = k_config[k_i];
if (!k_value || undefined === k_value.k_value) { kerio.lib.k_reportError('Missing value to search for', 'sharedDefinitions', 'k_searchQuery');
}
k_fieldName = (k_value.k_fieldName ? k_value.k_fieldName : 'QUICKSEARCH');
if (k_value.k_comparator) {
k_comparator = k_value.k_comparator;
}
else {
k_comparator = (true === k_value.k_match ? k_COMPARATORS.kerio_web_Eq : k_COMPARATORS.kerio_web_Like);
}
k_conditions.push({
fieldName: k_fieldName,
comparator: k_comparator,
value: k_value.k_value
});
}
return (k_singleCondition ? k_conditions[0] : k_conditions);
}; 
var k_PROTOCOL_ID = k_WAW_CONSTANTS.k_PROTOCOL_ID;
var k_WAW_PROTOCOLS = [
{k_value: k_PROTOCOL_ID.k_TCP,     k_caption: k_tr('TCP', 'serviceEditor')},
{k_value: k_PROTOCOL_ID.k_UDP,     k_caption: k_tr('UDP', 'serviceEditor')},
{k_value: k_PROTOCOL_ID.k_TCP_UDP, k_caption: k_tr('TCP/UDP', 'serviceEditor')},
{k_value: k_PROTOCOL_ID.k_ICMP,    k_caption: k_tr('ICMP', 'serviceEditor')},
{k_value: k_PROTOCOL_ID.k_OTHER,   k_caption: k_tr('Other', 'serviceEditor')}
];
k_WAW_DEFINITIONS.k_PROTOCOLS = k_WAW_PROTOCOLS;
var k_PROTOCOLS_MAPPED = [];
k_PROTOCOLS_MAPPED[k_PROTOCOL_ID.k_TCP]     = k_WAW_PROTOCOLS[0];
k_PROTOCOLS_MAPPED[k_PROTOCOL_ID.k_UDP]     = k_WAW_PROTOCOLS[1];
k_PROTOCOLS_MAPPED[k_PROTOCOL_ID.k_TCP_UDP] = k_WAW_PROTOCOLS[2];
k_PROTOCOLS_MAPPED[k_PROTOCOL_ID.k_ICMP]    = k_WAW_PROTOCOLS[3];
k_PROTOCOLS_MAPPED[k_PROTOCOL_ID.k_OTHER]   = k_WAW_PROTOCOLS[4];
k_WAW_DEFINITIONS.k_PROTOCOLS_MAPPED = k_PROTOCOLS_MAPPED;

var k_DIRECTIONS = k_WAW_CONSTANTS.QuotaType;
k_WAW_DEFINITIONS.k_DIRECTIONS_MAPPED = [
{k_value: k_DIRECTIONS.QuotaBoth,     k_caption: k_tr('all traffic', 'common')},
{k_value: k_DIRECTIONS.QuotaDownload, k_caption: k_tr('download', 'common')},
{k_value: k_DIRECTIONS.QuotaUpload,   k_caption: k_tr('upload', 'common')}
];

var kerio_web_SharedConstants = k_WAW_CONSTANTS.kerio_web_SharedConstants;
k_WAW_DEFINITIONS.k_DATA_UNITS_MAPPED = [
{k_value: kerio_web_SharedConstants.kerio_web_MegaBytes,  k_caption: 'MB'},
{k_value: kerio_web_SharedConstants.kerio_web_GigaBytes,  k_caption: 'GB'}
];
k_WAW_DEFINITIONS.k_DATA_UNITS_ORDERED = [
kerio_web_SharedConstants.kerio_web_Bytes, kerio_web_SharedConstants.kerio_web_KiloBytes, kerio_web_SharedConstants.kerio_web_MegaBytes,
kerio_web_SharedConstants.kerio_web_GigaBytes, kerio_web_SharedConstants.kerio_web_TeraBytes, kerio_web_SharedConstants.kerio_web_PetaBytes
];

var BandwidthUnit = k_WAW_CONSTANTS.BandwidthUnit;
k_WAW_DEFINITIONS.k_BANDWIDTH_UNITS_MAP = [
{k_value: BandwidthUnit.BandwidthUnitKilobits,   k_caption: 'Kbit/s' },
{k_value: BandwidthUnit.BandwidthUnitKiloBytes,  k_caption: 'KB/s'   },
{k_value: BandwidthUnit.BandwidthUnitMegabits,   k_caption: 'Mbit/s' },
{k_value: BandwidthUnit.BandwidthUnitMegaBytes,  k_caption: 'MB/s'   }
];
k_WAW_DEFINITIONS.k_BANDWIDTH_UNITS_MAP_PERCENT = kerio.lib.k_cloneObject(k_WAW_DEFINITIONS.k_BANDWIDTH_UNITS_MAP);
k_WAW_DEFINITIONS.k_BANDWIDTH_UNITS_MAP_PERCENT.push({k_value: BandwidthUnit.BandwidthUnitPercent,  k_caption: k_tr('%1 of the link', 'bandwidthManagementLinkEditor', { k_args: ['%']})});
var k_BITE_UNITS = k_WAW_CONSTANTS.k_BITE_UNITS;
var k_BANDWIDTH_UNITS_MAPPED = {};
k_BANDWIDTH_UNITS_MAPPED[BandwidthUnit.BandwidthUnitBits]      = 'bit/s';
k_BANDWIDTH_UNITS_MAPPED[k_BITE_UNITS.k_b]              = 'b/s';
k_BANDWIDTH_UNITS_MAPPED[BandwidthUnit.BandwidthUnitBytes]     = 'B/s';
k_BANDWIDTH_UNITS_MAPPED[kerio_web_SharedConstants.kerio_web_Bytes]              = 'B/s';
k_BANDWIDTH_UNITS_MAPPED[BandwidthUnit.BandwidthUnitKilobits]  = 'Kbit/s';
k_BANDWIDTH_UNITS_MAPPED[k_BITE_UNITS.k_Kb]             = 'Kb/s';
k_BANDWIDTH_UNITS_MAPPED[BandwidthUnit.BandwidthUnitKiloBytes] = 'KB/s';
k_BANDWIDTH_UNITS_MAPPED[kerio_web_SharedConstants.kerio_web_KiloBytes]             = 'KB/s';
k_BANDWIDTH_UNITS_MAPPED[BandwidthUnit.BandwidthUnitMegabits]  = 'Mbit/s';
k_BANDWIDTH_UNITS_MAPPED[k_BITE_UNITS.k_Mb]             = 'Mb/s';
k_BANDWIDTH_UNITS_MAPPED[BandwidthUnit.BandwidthUnitMegaBytes] = 'MB/s';
k_BANDWIDTH_UNITS_MAPPED[kerio_web_SharedConstants.kerio_web_MegaBytes]             = 'MB/s';
k_BANDWIDTH_UNITS_MAPPED[k_BITE_UNITS.k_Gb]             = 'Gb/s';
k_BANDWIDTH_UNITS_MAPPED[kerio_web_SharedConstants.kerio_web_GigaBytes]             = 'GB/s';
k_BANDWIDTH_UNITS_MAPPED[k_BITE_UNITS.k_Tb]             = 'Tb/s';
k_BANDWIDTH_UNITS_MAPPED[kerio_web_SharedConstants.kerio_web_TeraBytes]             = 'TB/s';
k_BANDWIDTH_UNITS_MAPPED[k_BITE_UNITS.k_Pb]             = 'Pb/s';
k_BANDWIDTH_UNITS_MAPPED[kerio_web_SharedConstants.kerio_web_PetaBytes]             = 'PB/s';
k_BANDWIDTH_UNITS_MAPPED[BandwidthUnit.BandwidthUnitPercent]  = '%';
k_WAW_DEFINITIONS.k_BANDWIDTH_UNITS_MAPPED = k_BANDWIDTH_UNITS_MAPPED;  k_WAW_DEFINITIONS.k_BYTE_UNITS_MAPPED      = k_BANDWIDTH_UNITS_MAPPED;  k_WAW_DEFINITIONS.k_DATA_BITES_UNITS_ORDERED = [
k_BITE_UNITS.k_b, k_BITE_UNITS.k_Kb, k_BITE_UNITS.k_Mb,
k_BITE_UNITS.k_Gb, k_BITE_UNITS.k_Tb, k_BITE_UNITS.k_Pb
];
var k_BITE_UNITS_STRING = {};
k_BITE_UNITS_STRING[k_BITE_UNITS.k_b] = 'b';
k_BITE_UNITS_STRING[k_BITE_UNITS.k_Kb] = 'Kb';
k_BITE_UNITS_STRING[k_BITE_UNITS.k_Mb] = 'Mb';
k_BITE_UNITS_STRING[k_BITE_UNITS.k_Gb] = 'Gb';
k_BITE_UNITS_STRING[k_BITE_UNITS.k_Tb] = 'Tb';
k_BITE_UNITS_STRING[k_BITE_UNITS.k_Pb] = 'Pb';
k_WAW_DEFINITIONS.k_BITE_UNITS_STRING = k_BITE_UNITS_STRING;
var k_BYTE_TO_BITE_MAPPED = {};
k_BYTE_TO_BITE_MAPPED[kerio_web_SharedConstants.kerio_web_Bytes] = k_BITE_UNITS.k_b;
k_BYTE_TO_BITE_MAPPED[kerio_web_SharedConstants.kerio_web_KiloBytes] = k_BITE_UNITS.k_Kb;
k_BYTE_TO_BITE_MAPPED[kerio_web_SharedConstants.kerio_web_MegaBytes] = k_BITE_UNITS.k_Mb;
k_BYTE_TO_BITE_MAPPED[kerio_web_SharedConstants.kerio_web_GigaBytes] = k_BITE_UNITS.k_Gb;
k_BYTE_TO_BITE_MAPPED[kerio_web_SharedConstants.kerio_web_TeraBytes] = k_BITE_UNITS.k_Tb;
k_BYTE_TO_BITE_MAPPED[kerio_web_SharedConstants.kerio_web_PetaBytes] = k_BITE_UNITS.k_Pb;
k_WAW_DEFINITIONS.k_BYTE_TO_BITE_MAPPED      = k_BYTE_TO_BITE_MAPPED;

var k_WAW_PORT_COMPARATOR_ID = k_WAW_CONSTANTS.PortComparator;
k_WAW_DEFINITIONS.k_PORT_COMPARATORS = [
{k_value: k_WAW_PORT_COMPARATOR_ID.Any,          k_caption: k_tr('Any', 'serviceEditor')},
{k_value: k_WAW_PORT_COMPARATOR_ID.Equal,     k_caption: k_tr('Equal to', 'serviceEditor')},
{k_value: k_WAW_PORT_COMPARATOR_ID.GreaterThan, k_caption: k_tr('Greater than', 'serviceEditor')},
{k_value: k_WAW_PORT_COMPARATOR_ID.LessThan,    k_caption: k_tr('Less than', 'serviceEditor')},
{k_value: k_WAW_PORT_COMPARATOR_ID.Range,        k_caption: k_tr('In range', 'serviceEditor')},
{k_value: k_WAW_PORT_COMPARATOR_ID.List,         k_caption: k_tr('List', 'serviceEditor')}
];
k_WAW_CONSTANTS.k_NONE = 'webadmin_none';
var k_constWeekdays = k_WAW_CONSTANTS.kerio_web_SharedConstants;
var k_WEEKDAY_NAMES = [];
k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Monday]    = k_tr('Monday', 'timeRangeList');
k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Tuesday]   = k_tr('Tuesday', 'timeRangeList');
k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Wednesday] = k_tr('Wednesday', 'timeRangeList');
k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Thursday]  = k_tr('Thursday', 'timeRangeList');
k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Friday]    = k_tr('Friday', 'timeRangeList');
k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Saturday]  = k_tr('Saturday', 'timeRangeList');
k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Sunday]    = k_tr('Sunday', 'timeRangeList');
k_WAW_DEFINITIONS.k_WEEKDAY_NAMES = k_WEEKDAY_NAMES;
var k_WEEKDAY_NAMES_SELECT = [];
k_WEEKDAY_NAMES_SELECT.push({ k_id: k_constWeekdays.kerio_web_Monday, k_name: k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Monday] });
k_WEEKDAY_NAMES_SELECT.push({ k_id: k_constWeekdays.kerio_web_Tuesday, k_name: k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Tuesday] });
k_WEEKDAY_NAMES_SELECT.push({ k_id: k_constWeekdays.kerio_web_Wednesday, k_name: k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Wednesday] });
k_WEEKDAY_NAMES_SELECT.push({ k_id: k_constWeekdays.kerio_web_Thursday, k_name: k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Thursday] });
k_WEEKDAY_NAMES_SELECT.push({ k_id: k_constWeekdays.kerio_web_Friday, k_name: k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Friday] });
k_WEEKDAY_NAMES_SELECT.push({ k_id: k_constWeekdays.kerio_web_Saturday, k_name: k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Saturday] });
k_WEEKDAY_NAMES_SELECT.push({ k_id: k_constWeekdays.kerio_web_Sunday, k_name: k_WEEKDAY_NAMES[k_constWeekdays.kerio_web_Sunday] });
k_WAW_DEFINITIONS.k_WEEKDAY_NAMES_SELECT = k_WEEKDAY_NAMES_SELECT;
var k_WEEKDAY_NAMES_SHORT = [];
k_WEEKDAY_NAMES_SHORT[k_constWeekdays.kerio_web_Monday]    = k_tr('Mon', 'timeRangeList');
k_WEEKDAY_NAMES_SHORT[k_constWeekdays.kerio_web_Tuesday]   = k_tr('Tue', 'timeRangeList');
k_WEEKDAY_NAMES_SHORT[k_constWeekdays.kerio_web_Wednesday] = k_tr('Wed', 'timeRangeList');
k_WEEKDAY_NAMES_SHORT[k_constWeekdays.kerio_web_Thursday]  = k_tr('Thu', 'timeRangeList');
k_WEEKDAY_NAMES_SHORT[k_constWeekdays.kerio_web_Friday]    = k_tr('Fri', 'timeRangeList');
k_WEEKDAY_NAMES_SHORT[k_constWeekdays.kerio_web_Saturday]  = k_tr('Sat', 'timeRangeList');
k_WEEKDAY_NAMES_SHORT[k_constWeekdays.kerio_web_Sunday]    = k_tr('Sun', 'timeRangeList');
k_WAW_DEFINITIONS.k_WEEKDAY_NAMES_SHORT = k_WEEKDAY_NAMES_SHORT;
var PortAssignmentType = k_WAW_CONSTANTS.PortAssignmentType;
var k_PORT_ASSIGNMENT_TYPE_NAMES = [];
k_PORT_ASSIGNMENT_TYPE_NAMES[PortAssignmentType.PortAssignmentSwitch]     = k_tr('LAN Switch', 'interfacePortEditor');
k_PORT_ASSIGNMENT_TYPE_NAMES[PortAssignmentType.PortAssignmentStandalone] = k_tr('Standalone interface', 'interfacePortEditor');
k_PORT_ASSIGNMENT_TYPE_NAMES[PortAssignmentType.PortAssignmentUnassigned] = k_tr('Unassigned', 'interfacePortEditor');
k_WAW_DEFINITIONS.k_PORT_ASSIGNMENT_TYPE_NAMES = k_PORT_ASSIGNMENT_TYPE_NAMES;
var WifiEncryptionType = k_WAW_CONSTANTS.WifiEncryptionType;
var k_WIFI_ENCRYPTION_NAMES = [];
k_WIFI_ENCRYPTION_NAMES[WifiEncryptionType['WifiEncryptionDisabled']] = k_tr('None', 'wifi');
k_WIFI_ENCRYPTION_NAMES[WifiEncryptionType['WifiEncryptionWpaPsk']] = k_tr('WPA PSK', 'wifi');
k_WIFI_ENCRYPTION_NAMES[WifiEncryptionType['WifiEncryptionWpaEnt']] = k_tr('WPA Enterprise', 'wifi');
k_WIFI_ENCRYPTION_NAMES[WifiEncryptionType['WifiEncryptionWpa2Psk']] = k_tr('WPA2 PSK', 'wifi');
k_WIFI_ENCRYPTION_NAMES[WifiEncryptionType['WifiEncryptionWpa2Ent']] = k_tr('WPA2 Enterprise', 'wifi');
k_WAW_DEFINITIONS.k_WIFI_ENCRYPTION_NAMES = k_WIFI_ENCRYPTION_NAMES;
var SpeedDuplexType = k_WAW_CONSTANTS.SpeedDuplexType;
var k_SPEED_DUPLEX_TYPE_LIST = [];
k_SPEED_DUPLEX_TYPE_LIST[SpeedDuplexType.SpeedDuplexAuto] = 0;
k_SPEED_DUPLEX_TYPE_LIST[SpeedDuplexType.SpeedDuplexHalf10] = 1;
k_SPEED_DUPLEX_TYPE_LIST[SpeedDuplexType.SpeedDuplexFull10] = 2;
k_SPEED_DUPLEX_TYPE_LIST[SpeedDuplexType.SpeedDuplexHalf100] = 3;
k_SPEED_DUPLEX_TYPE_LIST[SpeedDuplexType.SpeedDuplexFull100] = 4;
k_SPEED_DUPLEX_TYPE_LIST[SpeedDuplexType.SpeedDuplexFull1000] = 5;
k_WAW_DEFINITIONS.k_SPEED_DUPLEX_TYPE_LIST = k_SPEED_DUPLEX_TYPE_LIST;
var k_SPEED_DUPLEX_TYPE_NAMES = [];
k_SPEED_DUPLEX_TYPE_NAMES[SpeedDuplexType.SpeedDuplexAuto]      = {value: SpeedDuplexType.SpeedDuplexAuto,      name: k_tr('Auto Negotiation', 'interfaceManagePortsEditor')};
k_SPEED_DUPLEX_TYPE_NAMES[SpeedDuplexType.SpeedDuplexHalf10]   = {value: SpeedDuplexType.SpeedDuplexHalf10,   name: k_tr('10 Mbps Half Duplex', 'interfaceManagePortsEditor')};
k_SPEED_DUPLEX_TYPE_NAMES[SpeedDuplexType.SpeedDuplexFull10]   = {value: SpeedDuplexType.SpeedDuplexFull10,   name: k_tr('10 Mbps Full Duplex', 'interfaceManagePortsEditor')};
k_SPEED_DUPLEX_TYPE_NAMES[SpeedDuplexType.SpeedDuplexHalf100]  = {value: SpeedDuplexType.SpeedDuplexHalf100,  name: k_tr('100 Mbps Half Duplex', 'interfaceManagePortsEditor')};
k_SPEED_DUPLEX_TYPE_NAMES[SpeedDuplexType.SpeedDuplexFull100]  = {value: SpeedDuplexType.SpeedDuplexFull100,  name: k_tr('100 Mbps Full Duplex', 'interfaceManagePortsEditor')};
k_SPEED_DUPLEX_TYPE_NAMES[SpeedDuplexType.SpeedDuplexFull1000] = {value: SpeedDuplexType.SpeedDuplexFull1000, name: k_tr('1.0 Gbps Full Duplex', 'interfaceManagePortsEditor')};
k_WAW_DEFINITIONS.k_SPEED_DUPLEX_TYPE_NAMES = k_SPEED_DUPLEX_TYPE_NAMES;
var k_SPEED_DUPLEX_TYPE_NAMES_UNSUPPORTED = [];
k_SPEED_DUPLEX_TYPE_NAMES_UNSUPPORTED[SpeedDuplexType.SpeedDuplexAuto]      = {value: SpeedDuplexType.SpeedDuplexAuto,      name: k_tr('Auto Negotiation (unsupported by HW)', 'interfaceManagePortsEditor')};
k_SPEED_DUPLEX_TYPE_NAMES_UNSUPPORTED[SpeedDuplexType.SpeedDuplexHalf10]   = {value: SpeedDuplexType.SpeedDuplexHalf10,   name: k_tr('10 Mbps Half Duplex (unsupported by HW)', 'interfaceManagePortsEditor')};
k_SPEED_DUPLEX_TYPE_NAMES_UNSUPPORTED[SpeedDuplexType.SpeedDuplexFull10]   = {value: SpeedDuplexType.SpeedDuplexFull10,   name: k_tr('10 Mbps Full Duplex (unsupported by HW)', 'interfaceManagePortsEditor')};
k_SPEED_DUPLEX_TYPE_NAMES_UNSUPPORTED[SpeedDuplexType.SpeedDuplexHalf100]  = {value: SpeedDuplexType.SpeedDuplexHalf100,  name: k_tr('100 Mbps Half Duplex (unsupported by HW)', 'interfaceManagePortsEditor')};
k_SPEED_DUPLEX_TYPE_NAMES_UNSUPPORTED[SpeedDuplexType.SpeedDuplexFull100]  = {value: SpeedDuplexType.SpeedDuplexFull100,  name: k_tr('100 Mbps Full Duplex (unsupported by HW)', 'interfaceManagePortsEditor')};
k_SPEED_DUPLEX_TYPE_NAMES_UNSUPPORTED[SpeedDuplexType.SpeedDuplexFull1000] = {value: SpeedDuplexType.SpeedDuplexFull1000, name: k_tr('1.0 Gbps Full Duplex (unsupported by HW)', 'interfaceManagePortsEditor')};
k_WAW_DEFINITIONS.k_SPEED_DUPLEX_TYPE_NAMES_UNSUPPORTED = k_SPEED_DUPLEX_TYPE_NAMES_UNSUPPORTED;
var k_FILE_NAME_GROUPS_TRANSLATIONS = [];
k_FILE_NAME_GROUPS_TRANSLATIONS['Executable files']  = k_tr('Executable files', 'contentFilterFileNameGroup');
k_FILE_NAME_GROUPS_TRANSLATIONS['System files']      = k_tr('System files', 'contentFilterFileNameGroup');
k_FILE_NAME_GROUPS_TRANSLATIONS['Documents']         = k_tr('Documents', 'contentFilterFileNameGroup');
k_FILE_NAME_GROUPS_TRANSLATIONS['Web files']         = k_tr('Web files', 'contentFilterFileNameGroup');
k_FILE_NAME_GROUPS_TRANSLATIONS['Archive files']     = k_tr('Archive files', 'contentFilterFileNameGroup');
k_FILE_NAME_GROUPS_TRANSLATIONS['Disk Image files']  = k_tr('Disk image files', 'contentFilterFileNameGroup');
k_FILE_NAME_GROUPS_TRANSLATIONS['Audio files']       = k_tr('Audio files', 'contentFilterFileNameGroup');
k_FILE_NAME_GROUPS_TRANSLATIONS['Video files']       = k_tr('Video files', 'contentFilterFileNameGroup');
k_FILE_NAME_GROUPS_TRANSLATIONS['Image files']       = k_tr('Image files', 'contentFilterFileNameGroup');
k_FILE_NAME_GROUPS_TRANSLATIONS['Embedded objects']  = k_tr('Embedded objects', 'contentFilterFileNameGroup');
k_FILE_NAME_GROUPS_TRANSLATIONS['Mail message files']= k_tr('Mail message files', 'contentFilterFileNameGroup');
k_WAW_DEFINITIONS.k_FILE_NAME_GROUPS_TRANSLATIONS = k_FILE_NAME_GROUPS_TRANSLATIONS;
var k_BACKUP_TARGET = k_WAW_CONSTANTS.Target;
var k_BACKUP_SERVICES_SELECT = [];
k_BACKUP_SERVICES_SELECT.push({ k_id: k_BACKUP_TARGET.k_SAMEPAGE, k_name: 'Samepage'});
k_BACKUP_SERVICES_SELECT.push({ k_id: k_BACKUP_TARGET.TargetFtpServer, k_name: 'FTP'});
k_WAW_DEFINITIONS.k_BACKUP_SERVICES_SELECT = k_BACKUP_SERVICES_SELECT;
k_WAW_DEFINITIONS.k_CERTIFICATE_GRID_TRANSLATIONS = {
k_DEFAULT:       k_tr('Use default settings', 'certificate'),
k_DELETED:       k_tr('Deleted certificate', 'certificate'),
k_INVALID:       k_tr('Invalid certificate', 'certificate'),
k_EXPIRED:       k_tr('Expired certificate', 'certificate'),
k_NOT_VALID_YET: k_tr('Certificate not valid yet', 'certificate')
};

k_WAW_DEFINITIONS.k_newHostsItem = {
id: '',
enabled: true,
ip: '',
hosts: ''
};

k_WAW_DEFINITIONS.k_newRouterAdvertisementsList = {
id: '',
enabled: true,
k_interface: '',
prefix: {
ip: '',
prefixLength: 64
}
};
var
k_IP_VERSIONS = k_WAW_CONSTANTS.TrafficIpVersion,
k_ipVersions = [
{ k_name: k_tr('Any', 'common'), k_value: k_IP_VERSIONS.IpAll},
{ k_name: 'IPv4', k_value: k_IP_VERSIONS.Ipv4},
{ k_name: 'IPv6', k_value: k_IP_VERSIONS.Ipv6}
];
k_WAW_DEFINITIONS.k_ipVersions = k_ipVersions;
var k_ipVersionsMapped = [],
k_cnt, k_i,
k_item;
for (k_i = 0, k_cnt = k_ipVersions.length; k_i < k_cnt; k_i++) {
k_item = k_ipVersions[k_i];
k_ipVersionsMapped[k_item.k_value] = k_item.k_name;
}
k_WAW_DEFINITIONS.k_ipVersionsMapped = k_ipVersionsMapped;
var k_trafficRuleName = k_tr('New Rule', 'list');
k_WAW_DEFINITIONS.k_predefinedTrafficRuleName = k_trafficRuleName;

k_WAW_DEFINITIONS.k_predefinedTrafficRule = {
id: '',
enabled: true,
name: k_trafficRuleName,
description: '',
color: k_WAW_CONSTANTS.k_POLICY_BCKG_COLORS.k_WHITE,
source: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleAny,
firewall: false,
entities: []
},
destination: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleAny,
firewall: false,
entities: []
},
service: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleAny,
entries: []
},
ipVersion: k_WAW_CONSTANTS.TrafficIpVersion.IpAll,
action: k_WAW_CONSTANTS.RuleAction.NotSet,
graphEnabled: false,
logEnabled: [
false,
false
],
natIpv4Only: true,
enableSourceNat: false,
natMode: k_WAW_CONSTANTS.SourceNatMode.NatDefault,
allowReverseConnection: false,
balancing: k_WAW_CONSTANTS.NatBalancing.BalancingPerHost,
natInterface: {
id: '',
name: '',
invalid: false
},
allowFailover: false,
ipAddress: '',
ipv6Address: '',
enableDestinationNat: false,
translatedHost: '',
translatedIpv6Host: '',
translatedPort: {
enabled: false,
value: 0
},
validTimeRange: {
id: '',
name: '',
invalid: false
},
inspector: k_WAW_CONSTANTS.k_DEFAULT_INSPECTORS.k_DEFAULT,
dscp: {
enabled: false,
value: 0
},
lastUsed: {
days: 0,
hours: 0,
minutes: 0,
isValid: false
}
};
k_WAW_DEFINITIONS.k_predefinedContentRule = {
id: "",
enabled: true,
name: k_tr('New Rule', 'list'),
description: "",
color: k_WAW_CONSTANTS.k_POLICY_BCKG_COLORS.k_WHITE,
action: "",
logEnabled: false,
skipAvScan: false,
skipKeywords: false,
skipAuthentication: false,
denialCondition: {
denialText: "",
redirectUrl: {
enabled: false,
value: ''
},
canUnlockRule: false,
sendEmail: false,
emailInterval: 3600 },
contentCondition: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleAny,
entities: []
},
sourceCondition: {
type: k_WAW_CONSTANTS.RuleConditionType.RuleAny,
entities: []
},
validTimeRange: {
id: "",
name: "",
invalid: false
}
};

k_WAW_DEFINITIONS.k_predefinedBmRule = {
id: "",
enabled: true,
name: k_tr('New Rule', 'list'),
color: k_WAW_CONSTANTS.k_POLICY_BCKG_COLORS.k_WHITE,
traffic: [], reservedDownload: {
enabled: false,
value: 0,
unit: k_WAW_CONSTANTS.BandwidthUnit.BandwidthUnitMegabits
},
reservedUpload: {
enabled: false,
value: 0,
unit: k_WAW_CONSTANTS.BandwidthUnit.BandwidthUnitMegabits
},
maximumDownload: {
enabled: false,
value: 0,
unit: k_WAW_CONSTANTS.BandwidthUnit.BandwidthUnitMegabits
},
maximumUpload: {
enabled: false,
value: 0,
unit: k_WAW_CONSTANTS.BandwidthUnit.BandwidthUnitMegabits
},
interfaceId: {
id: '',
name: '',
invalid: false
},
validTimeRange: {
id: '',
name: '',
invalid: false
},
chart: false
}; 
k_WAW_DEFINITIONS.k_predefinedInterface = {
enabled: true,
type: k_WAW_CONSTANTS.InterfaceType.Ras,
status: k_WAW_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusClean,
dhcpServerEnabled: false,
id: '',
group: k_WAW_CONSTANTS.InterfaceGroupType.Other,
name: '',
linkStatus: k_WAW_CONSTANTS.InterfaceStatusType.Up,
details: {},
mac: '',
systemName: '',
ip4Enabled: true,
mode: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeManual,
ip: '',
subnetMask: '',
secondaryAddresses: [],
dnsAutodetected: true,
dnsServers: '',
gatewayAutodetected: true,
gateway: '',
ip6Enabled: false,
ip6Mode: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeManual,
ip6Addresses: [],
linkIp6Address: '',
ip6Gateway: '',
routedIp6PrefixAutodetected: true,
connectivityParameters: {
failoverRole: k_WAW_CONSTANTS.FailoverRoleType.None,
loadBalancingWeight: {
enabled: false,
value: 1
},
onDemand: false
},
encap: k_WAW_CONSTANTS.InterfaceEncapType.InterfaceEncapNative,
mtuOverride: {
enabled: false,
value: k_WAW_CONSTANTS.k_INTERFACE_RAS_MTU_MAX.k_PPPoE
},
ras: {
dead: false,
entryName: '',
useOwnCredentials: false,
credentials: {
passwordChanged: false
},
timeout: {
enabled: false,
value: 0
},
connectTime: {
enabled: false,
id: '',
name: ''
},
noConnectTime: {
enabled: false,
id: '',
name: ''
},
bdScriptEnabled: false,
adScriptEnabled: false,
bhScriptEnabled: false,
ahScriptEnabled: false,
rasType: k_WAW_CONSTANTS.RasType.PPPoE,
pppoeIfaceId: k_WAW_CONSTANTS.k_NONE,
server: '',
papEnabled: true,
chapEnabled: true,
mschapEnabled: true,
mschapv2Enabled: true,
ikeVersion: '',
eapPskIdentity: '',
mppe: k_WAW_CONSTANTS.MppeType.Mppe128Enabled,
mppeStateful: false
},
server: {},
tunnel: {
type: k_WAW_CONSTANTS.VpnType.VpnIpsec,
peer: {
enabled: true,
value: ''
},
remoteFingerprint: '',
useLocalAutomaticRoutes: true,
useLocalCustomRoutes: false,
useRemoteAutomaticRoutes: true,
useRemoteCustomRoutes: false,
remoteRoutes: [],
localRoutes: [],
psk: {
enabled: true,
value: ''
},
certificate: {
id: '',
name: '',
invalid: false
},
cipherIke: '',
cipherEsp: '',
localIdValue: '',
remoteIdValue: ''
},
flags: {},
ports: [],
stp: false
};

k_WAW_DEFINITIONS.k_newDhcpExclusion = ['', '', ''];

k_WAW_DEFINITIONS.k_newStarReportData = {
id: '',
enabled: true,
addressee: {
type: k_WAW_CONSTANTS.AddresseeType.AddresseeEmail,
email: ''
},
allData: false,
reportConfig: {
dailyEnabled: false,
weeklyEnabled: false,
monthlyEnabled: false,
onlineAccess: false
},
users: [],
reportType: []
};
k_WAW_DEFINITIONS.k_invalidUserStatusBarCfg = {
k_text: k_tr('Unknown/invalid users are specified in the rule.', 'policyList'),
k_iconCls: 'userUnknown'
};
var k_SNAPSHOT_OPERATION_TYPES = k_WAW_CONSTANTS.k_SNAPSHOT_OPERATION_TYPES;
var k_SNAPSHOT_OPERATION_TYPES_MAPPED = [];
k_SNAPSHOT_OPERATION_TYPES_MAPPED[k_SNAPSHOT_OPERATION_TYPES.k_CREATE] = 'createSnapshot';
k_SNAPSHOT_OPERATION_TYPES_MAPPED[k_SNAPSHOT_OPERATION_TYPES.k_DISCARD] = 'discardSnapshot';
k_SNAPSHOT_OPERATION_TYPES_MAPPED[k_SNAPSHOT_OPERATION_TYPES.k_APPLY] = 'applySnapshot';
k_WAW_DEFINITIONS.k_SNAPSHOT_OPERATION_TYPES_MAPPED = k_SNAPSHOT_OPERATION_TYPES_MAPPED;
var k_POLICY_BCKG_COLORS = k_WAW_CONSTANTS.k_POLICY_BCKG_COLORS;
var k_POLICY_BCKG_COLOR_NAMES_MAPPED = [];
k_shared.k_methods.k_mergeObjects({
'k_btnColorWhite'       : k_POLICY_BCKG_COLORS.k_WHITE,
'k_btnColorYellow'      : k_POLICY_BCKG_COLORS.k_YELLOW,
'k_btnColorBlue'        : k_POLICY_BCKG_COLORS.k_BLUE,
'k_btnColorRed'         : k_POLICY_BCKG_COLORS.k_RED,
'k_btnColorGreen'       : k_POLICY_BCKG_COLORS.k_GREEN,
'k_btnColorMagenta'     : k_POLICY_BCKG_COLORS.k_MAGENTA,
'k_btnColorOrange'      : k_POLICY_BCKG_COLORS.k_ORANGE,
'k_btnColorGrey'        : k_POLICY_BCKG_COLORS.k_GREY
}, k_POLICY_BCKG_COLOR_NAMES_MAPPED);
k_WAW_DEFINITIONS.k_POLICY_BCKG_COLOR_NAMES_MAPPED = k_POLICY_BCKG_COLOR_NAMES_MAPPED;

k_WAW_DEFINITIONS.k_predefinedProtocolInspector = {
k_id: k_WAW_CONSTANTS.k_PROTOCOL_ID.k_NONE,
k_name: kerio.lib.k_tr('None', 'serviceEditor'),
k_ipProtocol: k_WAW_CONSTANTS.k_PROTOCOL_ID.k_ALL
};
var k_ruleActions = k_WAW_CONSTANTS.RuleAction;
k_WAW_DEFINITIONS.k_VALID_POLICY_ACTIONS_STRING  =
'[' + k_ruleActions.Allow + ']' +
'[' + k_ruleActions.Deny + ']' +
'[' + k_ruleActions.Drop + ']';

k_WAW_DEFINITIONS.k_trafficEntity = {
type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityHost,
host: "",
addr1: "",
addr2: "",
addressGroup: {
id: "",
name: "",
invalid: false
},
interfaceCondition: {
type: k_WAW_CONSTANTS.InterfaceConditionType.InterfaceInternet,
interfaceType: k_WAW_CONSTANTS.InterfaceType.Ethernet,
selectedInterface: {
id: "",
name: "",
invalid: false
},
enabled: true
},
vpnCondition: {
type: k_WAW_CONSTANTS.VpnConditionType.IncomingClient,
tunnel: {
id: "",
name: "",
invalid: false
},
enabled: true
},
userType: k_WAW_CONSTANTS.UserConditionType.AnyUser,
user: {
id: "",
name: "",
isGroup: false,
domainName: ""
}
};

k_WAW_DEFINITIONS.k_contentConditionEntity = {
type: k_WAW_CONSTANTS.ContentConditionEntityType.ContentConditionEntityApplication,
applications: [],
value: '',
isRegex: true,
urlGroup: {
id: "",
name: "",
invalid: false
},
ipAddressGroup: {
id: "",
name: "",
invalid: false
}
};

k_WAW_DEFINITIONS.k_sourceConditionEntity = {
type: k_WAW_CONSTANTS.SourceConditonEntityType.SourceConditonEntityAddressGroup,
ipAddressGroup: {
id: "",
name: "",
invalid: false
},
userType: k_WAW_CONSTANTS.UserConditionType.AnyUser,
user: {
id: "",
name: "",
isGroup: false,
domainName: ""
}
};

k_WAW_DEFINITIONS.k_trafficEntityFirewall = k_WAW_DEFINITIONS.k_get('k_trafficEntity', {
type: k_WAW_CONSTANTS.TrafficEntityType.k_FIREWALL
});

k_WAW_DEFINITIONS.k_trafficEntityAuthUsers = k_WAW_DEFINITIONS.k_get('k_trafficEntity', {
type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityUsers,
userType: k_WAW_CONSTANTS.UserConditionType.AuthenticatedUsers
});

k_WAW_DEFINITIONS.k_trafficEntityAllVpnTunnels = k_WAW_DEFINITIONS.k_get('k_trafficEntity', {
type: k_WAW_CONSTANTS.TrafficEntityType.TrafficEntityVpn,
vpnCondition: {
type: k_WAW_CONSTANTS.VpnConditionType.AllTunnels
}
});

k_WAW_DEFINITIONS.k_trafficService = {
definedService: false,
service: {
id: '',
name: '',
invalid: false
},
protocol: 0,
port: {
comparator: k_WAW_CONSTANTS.PortComparator.Any,
ports: []
}
};

k_WAW_DEFINITIONS.k_predefinedIpService = {
id: '',
name: '',
description: '',
status: k_WAW_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusNew,
protocol: 0,
srcPort: {
comparator: k_WAW_CONSTANTS.PortComparator.Any,
ports: []
},
dstPort: {
comparator: k_WAW_CONSTANTS.PortComparator.Any,
ports: []
},
inspector: '',
protoNumber: 0,
icmpTypes: []
};

k_WAW_DEFINITIONS.k_policySelectAction = function(k_config) {
var
RuleAction = kerio.waw.shared.k_CONSTANTS.RuleAction,
k_tr = kerio.lib.k_tr,
k_default;
k_default = {
k_type: 'k_select',
k_fieldDisplay: 'k_value',
k_fieldValue: 'k_id',
k_fieldIconClassName: 'k_iconClass',
k_listClassName: 'ruleAction',
k_checkPreselectedValue: false,
k_localData: [
{ k_id: RuleAction.Allow, k_value: k_tr('Allow', 'common'), k_iconClass: 'allow'},
{ k_id: RuleAction.Deny, k_value: k_tr('Deny', 'common'), k_iconClass: 'deny'},
{ k_id: RuleAction.Drop, k_value: k_tr('Drop', 'common'), k_iconClass: 'drop'}
]
};
if (true !== k_config.k_avoidEmptyValuePrompt) {
k_default.k_emptyValuePrompt = {
k_value: true === k_config.k_clearEmptyValue ? '' :  RuleAction.NotSet,
k_display: k_tr('Select action', 'list')
};
}
delete k_config.k_avoidEmptyValuePrompt;
return kerio.waw.shared.k_methods.k_mergeObjects(k_config, k_default);
};
k_WAW_DEFINITIONS.k_MIME_TYPES_MAPPED = [
{ name: '*', value: '*' },
{ name: 'application/'+'*', value: 'application/'+'*' },
{ name: 'application/octet-stream', value: 'application/octet-stream' },
{ name: '*/ms-download', value: '*/ms-download' },
{ name: 'image/'+'*', value: 'image/'+'*' },
{ name: 'image/gif', value: 'image/gif' },
{ name: 'image/jpeg', value: 'image/jpeg' },
{ name: 'text/'+'*', value: 'text/'+'*' },
{ name: 'text/html', value: 'text/html' },
{ name: 'text/plain', value: 'text/plain' }
];
var
InterfaceStatusType = k_WAW_CONSTANTS.InterfaceStatusType,
k_INTERFACE_STATUS_MAPPED = [];
k_INTERFACE_STATUS_MAPPED[InterfaceStatusType.Up] = k_tr('Up', 'interfaceList');
k_INTERFACE_STATUS_MAPPED[InterfaceStatusType.Down] = k_tr('Down', 'interfaceList');
k_INTERFACE_STATUS_MAPPED[InterfaceStatusType.Backup] = k_tr('Backup', 'interfaceList');
k_INTERFACE_STATUS_MAPPED[InterfaceStatusType.Error] = k_tr('Connectivity problem', 'interfaceList');
k_INTERFACE_STATUS_MAPPED[InterfaceStatusType.Connecting] = k_tr('Connecting', 'interfaceList');
k_INTERFACE_STATUS_MAPPED[InterfaceStatusType.Disconnecting] = k_tr('Disconnecting', 'interfaceList');
k_INTERFACE_STATUS_MAPPED[InterfaceStatusType.CableDisconnected] = k_tr('Cable disconnected', 'interfaceList');
k_WAW_DEFINITIONS.k_INTERFACE_STATUS_MAPPED = k_INTERFACE_STATUS_MAPPED;
var
k_NOTIFICATIONS_TYPES = k_WAW_CONSTANTS.NotificationType,
k_NOTIFICATIONS_HEADER_TEXT = [],
k_defaultGatewayText = k_tr('Problem with default gateway', 'notifications');

k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationDump] =                   {k_priority: 1, k_text: k_tr('System fault', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationLicExpired] =           {k_priority: 2, k_text: k_tr('Expired license', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationDomains] =                   {k_priority: 3, k_text: k_tr('Problem with mapped domain', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationCertificateError] =         {k_priority: 4, k_text: k_tr('Deleted certificate', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationCertificateExpired] = {k_priority: 5, k_text: k_tr('Untrustworthy certificate', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationCaExpired]=     {k_priority: 6, k_text: k_tr('Expired Authority', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationConnectionBalancing] =      {k_priority: 7, k_text: k_defaultGatewayText};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationConnectionFailover] =       {k_priority: 8, k_text: k_defaultGatewayText};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationConnectionOnDemand] =      {k_priority: 9, k_text: k_defaultGatewayText};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationConnectionPersistent] =     {k_priority: 10,k_text: k_defaultGatewayText};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationLlb] =       {k_priority: 11,k_text: k_tr('Compatibility problem', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationLlbLine] =                  {k_priority: 12,k_text: k_tr('Internet line failure', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationBackupLine] =               {k_priority: 13,k_text: k_tr('Backup line active', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationInterfaceSpeed] =           {k_priority: 14,k_text: k_tr('Missing link speed', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationSmtp] =                      {k_priority: 15,k_text: k_tr('No SMTP server', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationLowMemory] =                {k_priority: 16,k_text: k_tr('Low memory', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationBackupFailed] =             {k_priority: 17,k_text: k_tr('Backup failed', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationPacketDump] =               {k_priority: 18,k_text: k_tr('Packet dump in progress', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationCertificateWillExpire]=    {k_priority: 19,k_text: k_tr('Certificate will expire', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationCaWillExpire]= {k_priority: 20,k_text: k_tr('Authority will expire', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationLicWillExpire] =       {k_priority: 21,k_text: k_tr('Expiring license', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationSubWillExpire]=   {k_priority: 22,k_text: k_tr('Expiring Software Maintenance', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationSubExpired] =      {k_priority: 23,k_text: k_tr('Expired Software Maintenance', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationUpdate] =          {k_priority: 24,k_text: k_tr('Update available', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationDataEncryption] =          {k_priority: 25,k_text: k_tr('Data Encryption Error', 'notifications')};
k_NOTIFICATIONS_HEADER_TEXT[k_NOTIFICATIONS_TYPES.NotificationDataEncryptionFatal] =          {k_priority: 25,k_text: k_tr('Data Encryption Error', 'notifications')};
k_WAW_DEFINITIONS.k_NOTIFICATIONS_HEADER_TEXT = k_NOTIFICATIONS_HEADER_TEXT;

var DnsType = k_WAW_CONSTANTS.DnsType;
k_WAW_DEFINITIONS.k_DNS_LOOKUP_TYPE_MAP = [
{ k_id: DnsType.DnsTypeAny, k_name: k_tr('Any', 'ipToolsList')},
{ k_id: DnsType.DnsTypeA, k_name: 'A'},
{ k_id: DnsType.DnsTypeAAAA, k_name: 'AAAA'},
{ k_id: DnsType.DnsTypeCname, k_name: 'CNAME'},
{ k_id: DnsType.DnsTypeMx, k_name: 'MX'},
{ k_id: DnsType.DnsTypeNs, k_name: 'NS'},
{ k_id: DnsType.DnsTypePtr, k_name: 'PTR'},
{ k_id: DnsType.DnsTypeSoa, k_name: 'SOA'},
{ k_id: DnsType.DnsTypeSpf, k_name: 'SPF'},
{ k_id: DnsType.DnsTypeSrv, k_name: 'SRV'},
{ k_id: DnsType.DnsTypeTxt, k_name: 'TXT'}
];

var IpVersion = k_WAW_CONSTANTS.IpVersion;
k_WAW_DEFINITIONS.k_IP_TOOL_PROTOCOL_MAP = [
{ k_id: IpVersion.IpVersionAny, k_name: k_tr('Automatic', 'ipToolsList')},
{ k_id: IpVersion.IpVersion4, k_name: 'IPv4'},
{ k_id: IpVersion.IpVersion6, k_name: 'IPv6'}
];

k_WAW_DEFINITIONS.k_interfaceInternetCondition = k_WAW_DEFINITIONS.k_get('k_searchCondition', {
k_fieldName: 'group',
k_match: true,
k_value: k_WAW_CONSTANTS.InterfaceGroupType.Internet
});

k_WAW_DEFINITIONS.k_interfaceTrustedCondition = k_WAW_DEFINITIONS.k_get('k_searchCondition', {
k_fieldName: 'group',
k_match: true,
k_value: k_WAW_CONSTANTS.InterfaceGroupType.Trusted
});

k_WAW_DEFINITIONS.k_interfaceOtherCondition = k_WAW_DEFINITIONS.k_get('k_searchCondition', {
k_fieldName: 'group',
k_match: true,
k_value: k_WAW_CONSTANTS.InterfaceGroupType.Other
});

k_WAW_DEFINITIONS.k_interfaceEthernetCondition = k_WAW_DEFINITIONS.k_get('k_searchCondition', {
k_fieldName: 'type',
k_match: true,
k_value: k_WAW_CONSTANTS.InterfaceType.Ethernet
});

k_WAW_DEFINITIONS.k_interfaceRasCondition = k_WAW_DEFINITIONS.k_get('k_searchCondition', {
k_fieldName: 'type',
k_match: true,
k_value: k_WAW_CONSTANTS.InterfaceType.Ras
});

k_WAW_DEFINITIONS.k_interfaceDialInCondition = k_WAW_DEFINITIONS.k_get('k_searchCondition', {
k_fieldName: 'type',
k_match: true,
k_value: k_WAW_CONSTANTS.InterfaceType.DialIn
});

k_WAW_DEFINITIONS.k_interfaceVpnTunnelCondition = k_WAW_DEFINITIONS.k_get('k_searchCondition', {
k_fieldName: 'type',
k_match: true,
k_value: k_WAW_CONSTANTS.InterfaceType.VpnTunnel
});

k_WAW_DEFINITIONS.k_interfaceVpnServerCondition = k_WAW_DEFINITIONS.k_get('k_searchCondition', {
k_fieldName: 'type',
k_match: true,
k_value: k_WAW_CONSTANTS.InterfaceType.VpnServer
});

k_WAW_DEFINITIONS.k_interfaceInternetQuery = {
conditions: [ k_WAW_DEFINITIONS.k_interfaceInternetCondition ],
combining: k_WEB_CONSTANTS.kerio_web_Or,
orderBy: [
{
columnName: "name",
direction: k_WEB_CONSTANTS.kerio_web_Asc
}
]
};

k_WAW_DEFINITIONS.k_interfaceEthernetQuery = {
conditions: [ k_WAW_DEFINITIONS.k_interfaceEthernetCondition ],
combining: k_WEB_CONSTANTS.kerio_web_Or,
orderBy: [
{
columnName: "name", direction: k_WEB_CONSTANTS.kerio_web_Asc
}
]
};

k_WAW_DEFINITIONS.k_interfaceEthernetRasQuery = {
conditions: [
k_WAW_DEFINITIONS.k_interfaceEthernetCondition,
k_WAW_DEFINITIONS.k_interfaceRasCondition
],
combining: k_WEB_CONSTANTS.kerio_web_Or,
orderBy: [
{
columnName: "name", direction: k_WEB_CONSTANTS.kerio_web_Asc
}
]
}; 
k_WAW_DEFINITIONS.k_interfaceOutgoingQuery = {
conditions: [
k_WAW_DEFINITIONS.k_interfaceEthernetCondition,
k_WAW_DEFINITIONS.k_interfaceRasCondition,
k_WAW_DEFINITIONS.k_interfaceDialInCondition
],
combining: k_WEB_CONSTANTS.kerio_web_Or,
orderBy: [
{
columnName: "name", direction: k_WEB_CONSTANTS.kerio_web_Asc
}
]
}; 
k_WAW_DEFINITIONS.k_interfaceVpnQuery = {
conditions: [ k_WAW_DEFINITIONS.k_interfaceVpnTunnelCondition ],
combining: k_WEB_CONSTANTS.kerio_web_Or,
orderBy: [{
columnName: "name",
direction: k_WEB_CONSTANTS.kerio_web_Asc
}]
};

k_WAW_DEFINITIONS.k_interfaceVpnServerQuery = {
conditions: [ k_WAW_DEFINITIONS.k_interfaceVpnServerCondition ],
combining: k_WEB_CONSTANTS.kerio_web_Or,
orderBy: [{
columnName: "name",
direction: k_WEB_CONSTANTS.kerio_web_Asc
}]
};

k_WAW_DEFINITIONS.k_activeCertificatesQuery = {
conditions: [
{
fieldName: 'type',
comparator: k_WEB_CONSTANTS.kerio_web_Eq,
value: k_WEB_CONSTANTS.kerio_web_ActiveCertificate
},
{
fieldName: 'type',
comparator: k_WEB_CONSTANTS.kerio_web_Eq,
value: k_WEB_CONSTANTS.kerio_web_InactiveCertificate
}
],
combining: k_WEB_CONSTANTS.kerio_web_Or,
orderBy: [{
columnName: 'name',
direction: k_WEB_CONSTANTS.kerio_web_Asc
}]
};

k_WAW_DEFINITIONS.k_ipsecTunnelQuery = {
conditions: [
{
fieldName: 'type',
comparator: k_WEB_CONSTANTS.kerio_web_Eq,
value: k_WEB_CONSTANTS.kerio_web_ActiveCertificate
},
{
fieldName: 'type',
comparator: k_WEB_CONSTANTS.kerio_web_Eq,
value: k_WEB_CONSTANTS.kerio_web_InactiveCertificate
},
{
fieldName: 'type',
comparator: k_WEB_CONSTANTS.kerio_web_Eq,
value: k_WEB_CONSTANTS.kerio_web_ServerCertificate
}
],
combining: k_WEB_CONSTANTS.kerio_web_Or,
orderBy: [{
columnName: 'name',
direction: k_WEB_CONSTANTS.kerio_web_Asc
}]
};

k_WAW_DEFINITIONS.k_zeroConfigNetworkInterfacesQuery = {
conditions: [
k_WAW_DEFINITIONS.k_interfaceTrustedCondition,
k_WAW_DEFINITIONS.k_interfaceOtherCondition,
k_WAW_DEFINITIONS.k_interfaceVpnTunnelCondition
],
combining: k_WEB_CONSTANTS.kerio_web_Or,
orderBy: [
{
columnName: "name",
direction: k_WEB_CONSTANTS.kerio_web_Asc
}
]
};

k_WAW_DEFINITIONS.K_SimpleDialog = function(k_config){
if ('object' !== typeof k_config) {
kerio.lib.k_reportError('Internal error: cannot create WAW dialog without configuration!', 'Shared Definitions', 'Simple Dialog');
return null;
}
if (!k_config.k_title || !k_config.k_onOkClick || !k_config.k_content) {
kerio.lib.k_reportError('Internal error: missing WAW dialog configuration (required: k_content, k_title, k_onOkClick)!', 'Shared Definitions', 'Simple Dialog');
return null;
}
var
k_dialogCfg,
k_isAuditor = (undefined !== k_config.k_isAuditor)
? k_config.k_isAuditor
: (kerio.waw.shared.k_methods.k_isAuditor()),
k_tr = kerio.lib.k_tr,
k_content = k_config.k_content,
k_defaultItem = k_config.k_defaultItem,
k_isFinal = kerio.waw.shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.finalVersion,
k_tabId, k_tabForm;
if (k_defaultItem) {
if (!kerio.lib.k_getWidgetById(k_defaultItem)) {
if (k_content.k_isInstanceOf('K_Form')) {
if (k_content.k_getItem(k_defaultItem)) {
k_defaultItem = k_content.k_getItem(k_defaultItem).k_id; }
else {
k_defaultItem = null;
if (!k_isFinal) {
kerio.lib.k_reportError('Internal error: Invalid id "' + k_config.k_defaultItem + '" of default item in dialog "' + k_config.k_title +
'". No such element exists in the form.', 'sharedDefinition', 'K_SimpleDialog');
}
}
}
else if (k_content.k_isInstanceOf('K_TabPage')) {
for (k_tabId in k_content.k_items) {
k_tabForm = k_content.k_items[k_tabId]._kx.k_owner; if (k_tabForm.k_getItem(k_defaultItem)) {
k_defaultItem = k_tabForm.k_getItem(k_defaultItem).k_id; break;
}
}
if (!kerio.lib.k_getWidgetById(k_defaultItem)) {
k_defaultItem = null;
if (!k_isFinal) {
kerio.lib.k_reportError('Internal error: Invalid id "' + k_config.k_defaultItem + '" of default item in dialog "' + k_config.k_title +
'". No such element exists in any form of the tabPage.', 'sharedDefinition', 'K_SimpleDialog');
}
}
}
else {
k_defaultItem = null;
if (!k_isFinal) {
kerio.lib.k_reportError('Internal error: Invalid id "' + k_config.k_defaultItem + '" of default item in dialog "' + k_config.k_title
+ '". No such element exists; note that only K_Form and simple K_TabPage are supported for searching the element!', 'sharedDefinition', 'K_SimpleDialog');
}
}
} }
else if (null === k_defaultItem) { k_defaultItem = undefined;
}
else { k_defaultItem = undefined;
if (!k_isFinal) {
kerio.lib.k_reportError('Internal error: Undefined id of default item in dialog "' + k_config.k_title
+ '". Define correct k_defaultItem id or set NULL to override this message.', 'sharedDefinition', 'K_SimpleDialog');
}
}
k_dialogCfg = {
k_width: k_config.k_width || 500,
k_height: k_config.k_height || 600,
k_isResizable: k_config.k_isResizable || true,
k_title: k_config.k_title,
k_content: k_content,
k_defaultItem: k_defaultItem,
k_buttons: [{
k_isDefault: !k_isAuditor,
k_id: 'k_btnOK',
k_caption: k_config.k_okCaption || k_tr('OK', 'common'),
k_isHidden: k_isAuditor,
k_mask: (false !== k_config.k_mask) ?
{
k_message: (k_config.k_mask || k_tr('Saving…', 'common'))
}
: undefined, k_validateBeforeClick: (false !== k_config.k_validateOk),
k_onClick: k_config.k_onOkClick
}, {
k_isCancel: true,
k_isDefault: k_isAuditor,
k_id: 'k_btnCancel',
k_caption: (k_isAuditor) ? k_tr('Close', 'common') : k_tr('Cancel', 'common'),
k_onClick: (k_config.k_onCancelClick ? k_config.k_onCancelClick : undefined)
}] }; kerio.waw.shared.k_methods.k_mergeObjects(k_dialogCfg, this);
}; 
k_WAW_DEFINITIONS.K_BANDWIDTH_UNITS_SELECT = function(k_config) {
k_config = k_config || {};
return {
k_type: 'k_select',
k_width: (k_config.k_hasPercents) ? 100 : 60,
k_id: k_config.k_id || 'k_bandwidthUnit',
k_isDisabled: (true === k_config.k_isDisabled),
k_isLabelHidden: true,
k_localData: (k_config.k_hasPercents)
? kerio.waw.shared.k_DEFINITIONS.k_BANDWIDTH_UNITS_MAP_PERCENT
: kerio.waw.shared.k_DEFINITIONS.k_BANDWIDTH_UNITS_MAP,
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_value: kerio.waw.shared.k_CONSTANTS.BandwidthUnit.BandwidthUnitMegabits,
k_onChange: k_config.k_onChange
};
};

k_WAW_DEFINITIONS.k_interfaceFailoverSettings = function(k_config) {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
FailoverRoleType = k_WAW_CONSTANTS.FailoverRoleType,
k_tr = kerio.lib.k_tr,
k_id;
k_config = k_config || {};
k_id = (k_config.k_id ? (k_config.k_id) : k_WAW_CONSTANTS.k_CONNECTIVITY_ITEM_IDS.Failover.k_ID);
this.k_type = 'k_container';
this.k_id = k_id + '_' + 'k_container';
this.k_isHidden = true;
this.k_isLabelHidden = true;
this.k_isDisabled = false;
this.k_items = [
{
k_type: 'k_container',
k_id: k_id + '_' + 'k_innerContainer',
k_items: [
{
k_type: 'k_checkbox',
k_id: k_id + '.enabled',
k_isLabelHidden: true,
k_option: kerio.lib.k_tr('Use for Connection Failover', 'interfaceEditor'),
k_onChange: kerio.waw.shared.k_methods.k_enableCheckboxObserver([k_id + '_' + 'k_valueRow'])
},
{
k_type: 'k_row',
k_id: k_id + '_' + 'k_valueRow',
k_indent: 1,
k_isDisabled: true,
k_items: [
{
k_type: 'k_display',
k_value: kerio.lib.k_tr('Link priority:', 'interfaceEditor', { k_args: [1, 100]})
},
'->',
{
k_type: 'k_select',
k_id: k_id + '.value',
k_width: 100,
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_localData: [
{
k_caption: k_tr('Primary', 'interfaceList'),
k_value: FailoverRoleType.Primary
},
{
k_caption: k_tr('Backup', 'interfaceList'),
k_value: FailoverRoleType.Secondary
}
]
}
]
}
]
}
];
}; 
k_WAW_DEFINITIONS.k_interfaceLoadBalancingSettings = function(k_config) {
var k_id, k_forceEnable;
k_config = k_config || {};
k_id = (k_config.k_id ? (k_config.k_id) : kerio.waw.shared.k_CONSTANTS.k_CONNECTIVITY_ITEM_IDS.LoadBalancing.k_ID);
k_forceEnable = (true === k_config.k_forceEnable);
this.k_type = 'k_container';
this.k_id = k_id + '_' + 'k_container';
this.k_isHidden= true;
this.k_isDisabled = false;
this.k_items = [
{
k_type: 'k_container',
k_id: k_id + '_' + 'k_innerContainer',
k_items: [
{
k_type: 'k_checkbox',
k_id: k_id + '.enabled',
k_isLabelHidden: true,
k_isHidden: k_forceEnable,
k_option: kerio.lib.k_tr('Use for Link Load Balancing', 'interfaceEditor'),
k_onChange: (k_forceEnable)
? undefined : kerio.waw.shared.k_methods.k_enableCheckboxObserver([k_id + '_' + 'k_valueRow'])
},
{
k_type: 'k_row',
k_id: k_id + '_' + 'k_valueRow',
k_indent: 1,
k_isDisabled: !k_forceEnable,
k_items: [
{
k_type: 'k_display',
k_value: kerio.lib.k_tr('Link weight (%1 - %2):', 'interfaceEditor', { k_args: [1, 100]})
},
'->',
{
k_type: 'k_number',
k_id: k_id + '.value',
k_width: 50,
k_value: 1,
k_minValue: 1,
k_maxValue: 100,
k_maxLength: 3,
k_validator: {
k_allowBlank: false
}
}
]
}
]
}
];
}; 
k_WAW_DEFINITIONS.k_interfaceDialOnDemandSettings = function(k_config) {
var k_id;
k_config = k_config || {};
k_id = (k_config.k_id ? (k_config.k_id) : kerio.waw.shared.k_CONSTANTS.k_CONNECTIVITY_ITEM_IDS.DialOnDemand.k_ID);
this.k_type = 'k_container';
this.k_id = k_id + '_' + 'k_container';
this.k_isHidden = true;
this.k_isDisabled = true;
this.k_items = [
{
k_type: 'k_checkbox',
k_id: 'connectivityParameters.onDemand',
k_isLabelHidden: true,
k_option: kerio.lib.k_tr('Use as a dial-on-demand link', 'interfaceEditor')
}
];
}; 
k_WAW_DEFINITIONS.k_interfaceGroupSelector = function(k_config) {
var
InterfaceGroupType = kerio.waw.shared.k_CONSTANTS.InterfaceGroupType,
k_tr = kerio.lib.k_tr,
k_select,
k_select = {
k_type: 'k_select',
k_id: 'group',
k_caption: k_tr('Interface Group:', 'interfaceEditor'),
k_value: InterfaceGroupType.Other,
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_localData: [
{
k_caption: k_tr('Internet Interfaces', 'interfaceList'),
k_value: InterfaceGroupType.Internet
},
{
k_caption: k_tr('Trusted/Local Interfaces', 'interfaceList'),
k_value: InterfaceGroupType.Trusted
},
{
k_caption: k_tr('Guest Interfaces', 'interfaceList'),
k_value: InterfaceGroupType.Guest
},
{
k_caption: k_tr('Other Interfaces', 'interfaceList'),
k_value: InterfaceGroupType.Other
}
]
};
kerio.waw.shared.k_methods.k_mergeObjects(k_config, k_select);
return k_select;
};

k_WAW_DEFINITIONS.k_moveRowsToolbar = {
k_hasSharedMenu: false,
k_showVertically: true,
k_isCentered: true,
k_buttonMinWidth: 24,         k_className: 'toolbarSprite', k_items: [
{
k_id: 'k_btnMoveUp',
k_className: 'k_btnMoveUp',
k_icon: 'weblib/int/lib/img/moveUp.png?v=8629',
k_isDisabled: true,
k_mask: false,

k_onClick: function() {
var k_parentGrid = this.k_relatedWidget;
this.k_relatedWidget.k_moveSelectedRows(true);
if ('function' === typeof k_parentGrid.k_enableApplyOnRowMove) {
k_parentGrid.k_enableApplyOnRowMove.call(k_parentGrid);
}
else if (k_parentGrid.k_enableApplyOnRowMove) {
k_parentGrid = this.k_relatedWidget;
if (k_parentGrid.k_batchId) {
if (k_parentGrid.k_parentWidget.k_onChangeHandler) {
k_parentGrid.k_parentWidget.k_onChangeHandler(k_parentGrid.k_batchId);
}
else {
k_parentGrid.k_parentWidget.k_parentWidget.k_onChangeHandler(k_parentGrid.k_batchId);
}
} else {
kerio.adm.k_framework.k_enableApplyReset();
}
}
} }, {
k_id: 'k_btnMoveDown',
k_className: 'k_btnMoveDown',
k_icon: 'weblib/int/lib/img/moveDown.png?v=8629',
k_isDisabled: true,
k_mask: false,

k_onClick: function() {
var k_parentGrid = this.k_relatedWidget;
this.k_relatedWidget.k_moveSelectedRows(false);
if ('function' === typeof k_parentGrid.k_enableApplyOnRowMove) {
k_parentGrid.k_enableApplyOnRowMove.call(k_parentGrid);
}
else if (k_parentGrid.k_enableApplyOnRowMove) {
if (k_parentGrid.k_batchId) {
if (k_parentGrid.k_parentWidget.k_onChangeHandler) {
k_parentGrid.k_parentWidget.k_onChangeHandler(k_parentGrid.k_batchId);
}
else {
k_parentGrid.k_parentWidget.k_parentWidget.k_onChangeHandler(k_parentGrid.k_batchId);
}
} else {
kerio.adm.k_framework.k_enableApplyReset();
}
}
} } ],

k_update: function(k_sender){
var
k_selected = k_sender.k_selectionStatus,
k_selectedCount = k_selected.k_selectedRowsCount,
k_totalCount = k_sender.k_getRowsCount(), k_isDefaultRuleSelected = kerio.waw.shared.k_methods.k_isRuleRowWithPropertySelected.call(k_sender, 'k_isDefaultRule'),
k_isAnyHiddenRuleSelecetd = kerio.waw.shared.k_methods.k_isRuleRowWithPropertySelected.call(k_sender, 'k_isHidden'),
k_lastRowIndex = k_totalCount - 1,
k_defaultRules = k_sender.k_findRow('k_isDefaultRule', true),
k_selectedRows,
k_i,
k_rowIndex,
k_previousRow,
k_nextRow;
if (Array === k_defaultRules.constructor && 0 < k_totalCount) {
if (1 === k_defaultRules.length && k_lastRowIndex === k_defaultRules[0]) {
k_lastRowIndex--; }
else {
this.k_enableItem('k_btnMoveUp', false);   this.k_enableItem('k_btnMoveDown', false); kerio.lib.k_reportError('Internal error: Default rule is not the last one or there are more default rules!', 'k_WAW_DEFINITIONS.k_moveRowsToolbar', 'update');
}
}
if (0 === k_lastRowIndex) {
this.k_enableItem('k_btnMoveUp', false);
this.k_enableItem('k_btnMoveDown', false);
return;
}
if (0 === k_selectedCount || k_isDefaultRuleSelected || k_isAnyHiddenRuleSelecetd) {
this.k_disableItem(['k_btnMoveUp', 'k_btnMoveDown']);
}
else {
k_selectedRows = k_selected.k_rows;
k_rowIndex = Number.MAX_VALUE;
for (k_i = 0; k_i < k_selectedCount; k_i++) {
if (k_selectedRows[k_i].k_rowIndex < k_rowIndex) {
k_rowIndex = k_selectedRows[k_i].k_rowIndex;
}
}
if (0 !== k_rowIndex) {
k_previousRow = k_sender.k_getRowByIndex(k_rowIndex - 1);
this.k_enableItem('k_btnMoveUp', !k_previousRow.k_isHidden); }
else {
this.k_enableItem('k_btnMoveUp', !k_sender.k_isRowSelected(0)); }
k_rowIndex = Number.MIN_VALUE;
for (k_i = 0; k_i < k_selectedCount; k_i++) {
if (k_selectedRows[k_i].k_rowIndex > k_rowIndex) {
k_rowIndex = k_selectedRows[k_i].k_rowIndex;
}
}
if (k_lastRowIndex !== k_rowIndex) {
k_nextRow = k_sender.k_getRowByIndex(k_rowIndex + 1);
this.k_enableItem('k_btnMoveDown', !k_nextRow.k_isHidden); }
else {
this.k_enableItem('k_btnMoveDown', !k_sender.k_isRowSelected(k_lastRowIndex)); }
}
} }; 
k_WAW_DEFINITIONS.k_editorGridBtnAdd = {
k_id: 'k_btnAdd',
k_caption: k_tr('Add', 'common'), k_isVisibleInToolbar: true,

k_onClick: function() {
var
k_grid = this.k_relatedWidget,
k_isDefaultRuleSelected,
k_selected, k_index;
if ('trafficPolicyList_trafficPolicyGrid' === k_grid.k_id) {
k_grid.k_openNewRuleWizard();
return;
}
if ('string' === typeof k_grid.k_newItemDefinition) {
k_selected = k_grid.k_selectionStatus;
k_isDefaultRuleSelected = kerio.waw.shared.k_methods.k_isRuleRowWithPropertySelected.call(k_grid, 'k_isDefaultRule'); k_index = (k_isDefaultRuleSelected) ? 0 : (1 === k_selected.k_selectedRowsCount) ? k_selected.k_rows[0].k_rowIndex + 1 : 0;
k_grid.k_addRow(kerio.waw.shared.k_DEFINITIONS.k_get(k_grid.k_newItemDefinition), k_index);
if ('function' === typeof k_grid.k_addItem) {
k_grid.k_addItem.call(k_grid, k_index);
}
return;
}
if ('function' === typeof k_grid.k_addItem) {
k_grid.k_addItem.call(k_grid);
return;
}
kerio.lib.k_reportError('Internal error: EditorGridToolbar expects either method "addItem" or string "newItemDefinition" to be defined in grid');
} };
k_WAW_DEFINITIONS.k_editorGridBtnRemove = {
k_id: 'k_btnRemove',
k_caption: k_tr('Remove', 'common'),
k_isVisibleInToolbar: true,

k_onClick: function() {
var
k_grid = this.k_relatedWidget;
if (!k_grid || !k_grid.k_removeItem) {
kerio.lib.k_reportError('Internal error: EditorGridToolbar expects method k_removeItem to be defined in grid');
return;
}
k_grid.k_removeItem.call(k_grid);
} };
k_WAW_DEFINITIONS.k_editorGridBtnDuplicate = function(k_config) {
k_config = k_config || {};
var
k_isVisibleInToolbar = k_config.k_isVisibleInToolbar,
k_closureEditColunm = k_config.k_editColumn || undefined,
k_closureNewValues = k_config.k_newValues || { id: '' },
k_onAfterDuplicate = k_config.k_onAfterDuplicate,
k_closureAfter = 'function' === typeof k_onAfterDuplicate ? k_onAfterDuplicate : (false !== k_onAfterDuplicate);
k_config = null; return {
k_id: 'k_btnDuplicate',
k_caption: kerio.lib.k_tr('Duplicate', 'common'),
k_isDisabled: true,
k_isVisibleInToolbar: k_isVisibleInToolbar,

k_onClick: function(){
var
k_grid = this.k_relatedWidget,
k_row, k_index;
if (1 !== k_grid.k_selectionStatus.k_selectedRowsCount) {
return;
}
k_row = k_grid.k_selectionStatus.k_rows[0];
k_index = k_row.k_rowIndex + 1;
k_grid.k_addRow(
kerio.lib.k_cloneObject(k_row.k_data, k_closureNewValues),
k_index
);
if ('string' === typeof k_closureEditColunm) {
k_grid.k_startCellEdit(k_index, k_closureEditColunm);
}
else {
k_grid.k_selectRows(k_index);
}
if ('function' === typeof k_closureAfter) {
k_closureAfter.call(k_grid, k_index);
}
if (k_grid._k_isTabPage) {
k_grid._k_onChangeHandler();
}
else if (false !== k_closureAfter) {
kerio.adm.k_framework.k_enableApplyReset();
}
} };
};
k_WAW_DEFINITIONS.k_preselectRowById = function() {
var
k_value = new RegExp('^' + this.k_preselectRowId + '$');
this.k_selectRows(this.k_findRow('id', k_value));
this.k_preselectRowId = null;
};

k_WAW_DEFINITIONS.k_editorGridToolbar = function(k_config) {
k_config = k_config || {};
var
k_get = kerio.waw.shared.k_DEFINITIONS.k_get, k_toolbarItems = k_config.k_toolbarItems,
k_tr = kerio.lib.k_tr,
k_toolbarCfg,
k_onClickColorItem;

k_onClickColorItem = function(k_menu, k_menuItem) {
var
k_grid = k_menu.k_relatedWidget,
k_color = kerio.waw.shared.k_DEFINITIONS.k_POLICY_BCKG_COLOR_NAMES_MAPPED[k_menuItem.k_name],
k_selectionStatus = k_grid.k_selectionStatus,
k_rows = k_grid.k_selectionStatus.k_rows,
k_parentGrid,
k_i, k_cnt,
k_row;
for (k_i = 0, k_cnt = k_selectionStatus.k_selectedRowsCount; k_i < k_cnt; k_i++) {
k_row = k_rows[k_i];
k_grid.k_updateRow({color: k_color}, k_row.k_rowIndex);
}
k_parentGrid = this.k_relatedWidget;
if (k_parentGrid.k_batchId) {
if (k_parentGrid.k_parentWidget.k_onChangeHandler) {
k_parentGrid.k_parentWidget.k_onChangeHandler(k_parentGrid.k_batchId);
}
else {
k_parentGrid.k_parentWidget.k_parentWidget.k_onChangeHandler(k_parentGrid.k_batchId);
}
} else {
kerio.adm.k_framework.k_enableApplyReset();
}
}; if (!k_toolbarItems || Array !== k_toolbarItems.constructor || 0 === k_toolbarItems.length) {
k_toolbarItems = [
k_get('k_editorGridBtnAdd'),
k_get('k_editorGridBtnRemove'),
k_get('k_editorGridBtnDuplicate', k_config.k_duplicateConfig),
'-',
{
k_id: 'k_btnChangeColor',
k_caption: k_tr('Change Color', 'ruleList'),
k_isDisabled: true,
k_isColorPicker: true,
k_isMenuButton: true
}
];
}
k_toolbarCfg = {
k_items: k_toolbarItems,

k_update: function(k_sender, k_event){
var
k_selected,
k_enableForSelectedOneOnly, k_enableForSelectedSomething,
k_enableForSelectedAny,
k_isDefaultRuleSelected;
if (k_sender instanceof kerio.lib.K_Grid && kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED === k_event.k_type) {
k_isDefaultRuleSelected = kerio.waw.shared.k_methods.k_isRuleRowWithPropertySelected.call(k_sender, 'k_isDefaultRule');
k_selected = k_sender.k_selectionStatus;
k_enableForSelectedOneOnly   = (1 === k_selected.k_selectedRowsCount) && !k_isDefaultRuleSelected;
k_enableForSelectedAny  = 0 < k_selected.k_selectedRowsCount;
k_enableForSelectedSomething = k_enableForSelectedAny && !k_isDefaultRuleSelected;
if (this.k_items.k_btnRemove) {
this.k_enableItem('k_btnRemove', k_enableForSelectedSomething);
}
if (this.k_items.k_btnDuplicate) {
this.k_enableItem('k_btnDuplicate', k_enableForSelectedOneOnly);
}
if (this.k_items.k_btnChangeDescription) {
this.k_enableItem('k_btnChangeDescription', k_enableForSelectedOneOnly);
}
if (this.k_items.k_btnChangeColor) {
this.k_enableItem('k_btnChangeColor', k_enableForSelectedSomething);
}
if (this.k_items.k_btnTrafficChart) {
this.k_enableItem('k_btnTrafficChart', k_enableForSelectedOneOnly &&
(true === k_selected.k_rows[0].k_data.chart || true === k_selected.k_rows[0].k_data.graphEnabled));
}
if (this.k_items.k_btnCollapseRows) {
this.k_enableItem('k_btnCollapseRows', k_enableForSelectedAny);
}
}
}
};
return k_toolbarCfg;
};
k_WAW_DEFINITIONS.k_userNameField = {
k_caption: k_tr('Username:', 'common'),
k_value: '',
k_maxLength: 127,
k_checkByteLength: true,
k_width: kerio.lib.k_isIPadCompatible ? undefined : 300,
k_validator: {
k_functionName: 'k_isUserName',
k_allowBlank: false
}
};

k_WAW_DEFINITIONS.k_passwordField = {
k_isPasswordField: true,
k_caption: k_tr('Password:', 'common'),
k_value: '',
k_emptyText: 'NoPassword',
k_maxLength: 110, k_checkByteLength: true,
k_width: kerio.lib.k_isIPadCompatible ? undefined : 300,
k_validator: {
k_allowBlank: true
},

k_onChange: function(k_form, k_element, k_value) {
if (k_value) {
k_element.k_setEmptyText('');
k_element.k_setAllowBlank(false);
}
}
};

k_WAW_DEFINITIONS.k_autodetectRow = function(k_config) {
var
k_shared = kerio.waw.shared,
k_DEFINITIONS = k_shared.k_DEFINITIONS,
k_isIpv4List = true === k_config.k_isList,
k_maxLength,
k_validatorFunction,
k_inputFilter,
k_onChange;
if (k_config.k_isIpv6) {
k_validatorFunction = 'k_isIpv4Or6Prefix';
k_inputFilter = k_DEFINITIONS.k_ipv4Or6Prefix.k_allowedChars;
k_onChange = k_shared.k_methods.k_allowOnlyIpv4Chars;
k_maxLength = k_shared.k_CONSTANTS.k_MAX_LENGTH.k_IPV6_PREFIX;
}
else {
k_validatorFunction = k_isIpv4List ? 'k_isIpAddressList' : 'k_isIpAddress';
k_inputFilter = k_isIpv4List ? k_DEFINITIONS.k_ipv4List.k_allowedChars : k_DEFINITIONS.k_ipv4.k_allowedChars;
k_onChange = k_shared.k_methods.k_allowOnlyIpv4Or6Chars;
k_maxLength = k_isIpv4List ? k_shared.k_CONSTANTS.k_MAX_LENGTH.k_IP_ADDRESS_LIST : k_shared.k_CONSTANTS.k_MAX_LENGTH.k_IP_ADDRESS;
}
return {
k_type: 'k_row',
k_restrictions: k_config.k_restrictions,
k_isHidden: k_config.k_isHidden,
k_isDisabled: k_config.k_isDisabled,
k_id: k_config.k_rowId || k_config.k_fieldId + '_' + 'k_container',
k_items: [
{
k_caption: k_config.k_caption,
k_id: k_config.k_fieldId,
k_maxLength: k_maxLength,
k_isDisabled: true === k_config.k_autodetectChecked,
k_validator: {
k_allowBlank: true, k_functionName: k_validatorFunction,
k_inputFilter: k_inputFilter
},
k_onChange: k_onChange
},
{
k_restrictions: k_config.k_autodetectRestrictions,
k_type: 'k_checkbox',
k_id: k_config.k_autodetectId,
k_isVisible: k_config.k_autodetectVisible,
k_isChecked: true === k_config.k_autodetectChecked,
k_width: 120,
k_option: kerio.lib.k_tr('Autodetect', 'interfaceEditor'),
k_onChange: k_shared.k_methods.k_enableCheckboxObserver([], [k_config.k_fieldId]) }
]
};
};

k_WAW_DEFINITIONS.k_trafficDirectionSelect = {
k_type: 'k_select',
k_caption: k_tr('Direction:', 'common'),
k_width: 150,
k_localData: k_WAW_DEFINITIONS.k_DIRECTIONS_MAPPED,
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_value: k_WAW_CONSTANTS.QuotaType.QuotaBoth
};

k_WAW_DEFINITIONS.k_byteUnitsSelect = {
k_type: 'k_select',
k_width: 50,
k_isLabelHidden: true,
k_localData: k_WAW_DEFINITIONS.k_DATA_UNITS_MAPPED,
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_value: k_WAW_CONSTANTS.kerio_web_SharedConstants.kerio_web_MegaBytes
};

k_WAW_DEFINITIONS.k_MASK_DEFAULT_LOADING = {}; k_WAW_DEFINITIONS.k_MASK_DEFAULT_SAVING = {k_message: kerio.lib.k_tr('Saving…', 'common')};
k_WAW_DEFINITIONS.k_actionColumnWidth = kerio.lib.k_languageDependentValue(
{	k_default: 120,
cs: 110,
de: 140,
es: 165,
fr: 160,
hr: 125,
hu: 135,
it: 130,
ja: 130,
nl: 130,
pl: 135,
pt: 140,
ru: 140,
zh: 95
});
var k_dhcpIntLimits = {};
k_dhcpIntLimits[k_WAW_CONSTANTS.DhcpOptionType.DhcpInt8]  = k_WAW_CONSTANTS.k_VALUE_SIZES.k_UNSIGNED_BYTE.k_max;
k_dhcpIntLimits[k_WAW_CONSTANTS.DhcpOptionType.DhcpInt16] = k_WAW_CONSTANTS.k_VALUE_SIZES.k_UNSIGNED_WORD.k_max;
k_dhcpIntLimits[k_WAW_CONSTANTS.DhcpOptionType.DhcpInt32] = k_WAW_CONSTANTS.k_VALUE_SIZES.k_UNSIGNED_DWORD.k_max;
k_dhcpIntLimits[k_WAW_CONSTANTS.DhcpOptionType.DhcpInt8List]  = k_WAW_CONSTANTS.k_VALUE_SIZES.k_UNSIGNED_BYTE.k_max;
k_dhcpIntLimits[k_WAW_CONSTANTS.DhcpOptionType.DhcpInt16List] = k_WAW_CONSTANTS.k_VALUE_SIZES.k_UNSIGNED_WORD.k_max;
k_dhcpIntLimits[k_WAW_CONSTANTS.DhcpOptionType.DhcpInt32List] = k_WAW_CONSTANTS.k_VALUE_SIZES.k_UNSIGNED_DWORD.k_max;
k_WAW_DEFINITIONS.k_DHCP_INT_LIMITS = k_dhcpIntLimits;
var k_macDelimeters = [':','-'];
k_WAW_DEFINITIONS.k_macAddressRegExp    = new RegExp('^[0-9a-fA-F]{2}(' + k_macDelimeters.join('|') + ')?[0-9a-fA-F]{2}(\\1[0-9a-fA-F]{2}){4}$');
k_WAW_DEFINITIONS.k_macDelimeterRegExp  = new RegExp('[' + k_macDelimeters.join('') + ']','g');
k_WAW_DEFINITIONS.k_ipAddressRegExp     = new RegExp(k_WAW_CONSTANTS.kerio_web_SharedConstants.kerio_web_IpAddressRegExp);
k_WAW_DEFINITIONS.k_cidrMaskRegExp      = new RegExp('^([0-9]|[1-2][0-9]|3[0-2])$'); k_WAW_DEFINITIONS.k_cidrValuesMap       = [ 0, 128, 192, 224, 240, 248, 252, 254, 255 ]; k_WAW_DEFINITIONS.k_defaultMasks        = [ '0.0.0.0', '255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255' ]; k_WAW_DEFINITIONS.k_placeholderMasks    = [ '0.0.0.0',  '%1.0.0.0', '255.%1.0.0' , '255.255.%1.0' , '255.255.255.%1', '255.255.255.255' ]; k_WAW_DEFINITIONS.k_ipv4 = {
k_allowedChars: new RegExp('[0-9\\., ]'),
k_allowedSeparator: new RegExp('[,\\s]{1}','g'),
k_separator: '.'
};
k_WAW_DEFINITIONS.k_ipv4List = {
k_allowedChars: new RegExp('[0-9\\., ;]')
};
k_WAW_DEFINITIONS.k_ipv6 = {
k_allowedChars: new RegExp('[0-9a-fA-F\\., :]'),
k_allowedSeparator:  [
new RegExp('[ ]{1}','g'),
new RegExp('[,]{1}','g')
],
k_separator: [
':',
'.'
]
};
k_WAW_DEFINITIONS.k_ipv4Or6Prefix = {
k_allowedChars: new RegExp('[0-9a-fA-F\\., :\/]'),
k_separator: [
':',
'.'
]
};
if (kerio.lib.k_isIPadCompatible) { k_WAW_DEFINITIONS.k_ipv4.k_allowedChars = new RegExp('[0-9\\.]');
k_WAW_DEFINITIONS.k_ipv4List.k_allowedChars = new RegExp('[0-9\\.]');
k_WAW_DEFINITIONS.k_ipv6.k_allowedChars = new RegExp('[0-9a-fA-F\\.:]');
}
k_WAW_DEFINITIONS.k_isHostIpRegExp      = new RegExp('^([^\\s;,"\'+/\\\\&#?!\\(\\){}\\[\\]|°*÷×¤%=<>\\^]*)$');
k_WAW_DEFINITIONS.k_zeroIpAddressRegExp = new RegExp('^0+(\\.)'); k_WAW_DEFINITIONS.k_timeRegExp          = new RegExp(k_WAW_CONSTANTS.kerio_web_SharedConstants.kerio_web_TimeRegExp);
k_WAW_DEFINITIONS.k_httpProtocolExp     = new RegExp('^(([\?\*]*(http[s]?://)[^\\s]*)|([^:^\\s]*))$');
k_WAW_DEFINITIONS.k_uriSchemeRegExp     = new RegExp('^[a-z][a-z0-9\+\.\-]*:(?![0-9]+)[/]*', 'i');
k_WAW_DEFINITIONS.k_uriSchemeStarRegExp = new RegExp('^[^:/]*:(?![0-9]+)[/]*', 'i');  k_WAW_DEFINITIONS.k_uriPortRegExp       = new RegExp('^([^:*?]*(:/'+'*)?[^/:*?]*)(:[0-9]+)(/.*)?$');
k_WAW_DEFINITIONS.k_uriPortStarRegExp   = new RegExp('^([^:]*(:/'+'*)?[^/:]*)(:[\*\?0-9]+)(/.*)?$');
k_WAW_DEFINITIONS.k_clientParamRegExp   = new RegExp('#.*$');
k_WAW_DEFINITIONS.k_isIpToolsTargetRegExp=new RegExp('^[^-\\s]([^\\s]*)$');
k_WAW_DEFINITIONS.k_snmpPasswordsRegExp = new RegExp('^[a-zA-Z0-9]*$');
k_WAW_DEFINITIONS.k_backupPassworRegExp = new RegExp('^.{6,}$'); k_WAW_DEFINITIONS.k_snmpV3PassworRegExp = new RegExp('^.{8,}$'); k_WAW_DEFINITIONS.k_snmpCommunityRegExp = new RegExp('^[a-zA-Z0-9]*$'); k_WAW_DEFINITIONS.k_noLeadingSpacesRegExp = new RegExp('^[^\\s].*$');
k_createIpv6AddressRegExp = function(){
var
k_s		= '[0-9a-fA-F]{1,4}', k_ipv4 = kerio.waw.shared.k_DEFINITIONS.k_ipAddressRegExp.source,
k_ipv4Length = k_ipv4.length;
if ('^' === k_ipv4.substring(0,1) && '$' === k_ipv4.substring(k_ipv4Length-1)) {
k_ipv4 = k_ipv4.substring(1, k_ipv4Length - 1); }
else {
kerio.lib.k_reportError('Internal error: IPv4 validator is not in right format for IPv6 validator', 'sharedDefinitions', 'k_createIpv6AddressRegExp');
}
return '^(' +
'(('+k_s+':){7}('+k_s+')*$)|' + 					'(::('+k_s+':){0,6}(?='+k_s+')('+k_s+')?)|' + 		'(('+k_s+':){1,7}:$)|' +							'(('+k_s+':){1}:('+k_s+':){0,5}('+k_s+'){1})|' +	'(('+k_s+':){2}:('+k_s+':){0,4}('+k_s+'){1})|' +	'(('+k_s+':){3}:('+k_s+':){0,3}('+k_s+'){1})|' +	'(('+k_s+':){4}:('+k_s+':){0,2}('+k_s+'){1})|' +	'(('+k_s+':){5}:('+k_s+':){0,1}('+k_s+'){1})|' +	'(('+k_s+':){6}:('+k_s+'){1})|' +					'(::)|' +											'(((('+k_s+':){0,3}(?='+k_s+')('+k_s+')?)?((::)|(:[0]{0,4}:[0]{1,4}:)|(:[0]{0,4}:[fF]{4}:)){1}('+k_ipv4+')))|' + '(::('+k_s+':){1,3}[0]{1,4}:(([0]{1,4})|([fF]{4})){1}:('+k_ipv4+'))|' +											 '(('+k_s+':){0,2}(?='+k_s+')('+k_s+'):((:[0]{1,4}:[0]{1,4}:)|(:[0]{1,4}:[fF]{4}:)){1}('+k_ipv4+'))|' + 			 '(('+k_s+'){1}::('+k_s+':)?('+k_s+'){1}:(([0]{1,4}:[0]{1,4}:)|([0]{1,4}:[fF]{4}:)){1}('+k_ipv4+'))|' +			 '(('+k_s+':){2}:('+k_s+'){1}:(([0]{1,4}:[0]{1,4}:)|([0]{1,4}:[fF]{4}:)){1}('+k_ipv4+'))' +						 ')$';
};
k_WAW_DEFINITIONS.k_ipv6AddressRegExp = new RegExp(k_createIpv6AddressRegExp());

k_WAW_DEFINITIONS.k_ipListField = {
k_maxLength: k_WAW_CONSTANTS.k_MAX_LENGTH.k_IP_ADDRESS_LIST,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddressList',
k_inputFilter: k_WAW_DEFINITIONS.k_ipv4List.k_allowedChars
},
k_onChange: k_shared.k_methods.k_allowOnlyIpv4Chars
};

k_WAW_DEFINITIONS.k_dnsListField = k_WAW_DEFINITIONS.k_get('k_ipListField', { k_validator: { k_allowBlank: true }});

k_WAW_DEFINITIONS.k_ipv4MaskField = {
k_type: 'k_selectTypeAhead',
k_dataStore: k_shared.k_data.k_ipMaskTemplates,
k_caption: k_tr('Mask:', 'common'),
k_maxLength: 15,
k_fieldDisplay: 'value',
k_fieldValue: 'value',
k_highlightClassName: 'highlightTypeAheadResult',
k_validator: {
k_functionName: 'k_isIpMaskOrCidr',
k_allowBlank: false,
k_inputFilter: k_WAW_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: k_shared.k_methods.k_allowOnlyIpv4Chars
};

k_WAW_DEFINITIONS.k_ipv4RouteMaskField = k_WAW_DEFINITIONS.k_get('k_ipv4MaskField', {
k_dataStore: k_shared.k_data.k_ipRouteMaskTemplates,
k_validator: {
k_functionName: 'k_isRouteMaskOrCidr'
}
});

k_WAW_DEFINITIONS.k_portField = {
k_type: 'k_number',
k_id: 'port',
k_caption: k_tr('Port:', 'common'),
k_width: 50,
k_minValue: 1,
k_maxValue: 65535,
k_maxLength: 5,
k_validator: {
k_allowBlank: false
}
}; 
k_WAW_DEFINITIONS.k_portWithType = function(k_config) {
var
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_tr = kerio.lib.k_tr,
k_isInsideRadioOption = k_config.k_isInsideRadioOption,
k_id;
k_config = k_config || {};
k_id = k_config.k_id ? (k_config.k_id + '_') : '';
delete k_config.k_isInsideRadioOption;
return kerio.waw.shared.k_methods.k_mergeObjects(k_config, {
k_type: 'k_container',
k_id: k_id + 'k_portWithType',
k_items: [
{	k_type: 'k_display',
k_isLabelHidden: true,
k_isVisible: !k_isInsideRadioOption,
k_value: k_tr('Port or port range:', 'trafficRuleEditor')
},
{
k_type: 'k_radio',
k_groupId: 'k_serviceType',
k_isLabelHidden: true,
k_isVisible: k_isInsideRadioOption,
k_option: k_tr('Custom port:', 'inboundPolicyEditor'),
k_value: k_WAW_CONSTANTS.k_SERVICE_TYPE.k_PORT,
k_onChange: function(k_form, k_item, k_value) {
k_form.k_setDisabled(['k_serviceTypeRow'], kerio.waw.shared.k_CONSTANTS.k_SERVICE_TYPE.k_PORT !== k_value);
}
},
{	k_type: 'k_row',
k_id: 'k_serviceTypeRow',
k_isDisabled: true,
k_indent: k_isInsideRadioOption ? 1 : 0,
k_items: [
{ 	k_type: 'k_select',
k_id: 'protocol',
k_width: 75,
k_isLabelHidden: true,
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',
k_localData: [
k_WAW_DEFINITIONS.k_PROTOCOLS_MAPPED[k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP],
k_WAW_DEFINITIONS.k_PROTOCOLS_MAPPED[k_WAW_CONSTANTS.k_PROTOCOL_ID.k_UDP],
k_WAW_DEFINITIONS.k_PROTOCOLS_MAPPED[k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP_UDP]
],
k_value: k_WAW_CONSTANTS.k_PROTOCOL_ID.k_TCP,
k_onChange: function(k_form) {
k_form.k_getItem('port').k_focus();
}
},
{	k_id: 'port',
k_isLabelHidden: true,
k_width: 90,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isPortOrPortRange'
}
}
]
}
]
}); }; 
k_WAW_DEFINITIONS.K_AutoRefreshCheckbox = function(k_config) {
var
k_tr = kerio.lib.k_tr,
k_onChange;
if (k_config && undefined !== k_config.k_onChange) {
k_onChange = k_config.k_onChange;
}
else {
if (undefined === kerio.waw.shared.k_DEFINITIONS.k_onChangeAutorefreshCheckbox) {
kerio.waw.shared.k_DEFINITIONS.k_onChangeAutorefreshCheckbox = function(k_form, k_checkbox, k_isChecked) {
var
k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_timeout;
if (k_checkbox.k_ignoreOnChange) {
return;
}
k_timeout = true === k_isChecked ? k_DEFINITIONS.k_AUTOREFRESH_INTERVAL : k_DEFINITIONS.k_AUTOREFRESH_DISABLED;
k_checkbox.k_ignoreOnChange = true;
k_checkbox.k_grid.k_handleAutorefresh(k_timeout);
};
}
k_onChange = kerio.waw.shared.k_DEFINITIONS.k_onChangeAutorefreshCheckbox;
}
return {
k_type: 'k_checkbox',
k_id:   'k_autoRefreshCheckbox',
k_option: k_tr('Auto-refresh', 'common'),
k_isLabelHidden: true,
k_isChecked: true, k_onChange: k_onChange,
k_width: kerio.lib.k_isMSIE7 ? 160 : undefined };
};
var UserFormatType = k_WAW_CONSTANTS.UserFormatType;
k_WAW_DEFINITIONS.k_fullNameFormats = [

{
k_id: UserFormatType.UserFormatFL,
k_caption: 'John Smith'
},
{
k_id: UserFormatType.UserFormatFLU,
k_caption: 'John Smith (jsmith)'
},
{
k_id: UserFormatType.UserFormatFLD,
k_caption: 'John Smith (jsmith@domain.com)'
},
{
k_id: UserFormatType.UserFormatLF,
k_caption: 'Smith, John'
},
{
k_id: UserFormatType.UserFormatLFU,
k_caption: 'Smith, John (jsmith)'
},
{
k_id: UserFormatType.UserFormatLFD,
k_caption: 'Smith, John (jsmith@domain.com)'
}
];

k_WAW_DEFINITIONS.k_optionalEdit = function(k_config) {
var
k_definition;
k_definition = {
k_type: 'k_container',
k_id: k_config.k_id + '_container',
k_isLabelHidden: true,
k_indent: k_config.k_indent,
k_height: 50,
k_items: [
{
k_type: 'k_checkbox',
k_id: k_config.k_id + '.enabled',
k_option: k_config.k_caption,
k_onChange: kerio.waw.shared.k_methods.k_optionalCheckboxObserver
},
{
k_id: k_config.k_id + '.value',
k_width: (k_config.k_isMainScreen ? 300 : undefined),
k_isDisabled: true,
k_indent: 1,
k_maxLength: k_config.k_maxLength || 255,
k_checkByteLength: true,
k_validator: {
k_allowBlank: false
}
}
]
};
if (undefined !== k_config.k_validator) {
k_definition.k_items[1].k_validator.k_functionName = k_config.k_validator;
}
return k_definition;
};

k_WAW_DEFINITIONS.k_optionalNumber = function(k_config) {
var k_cfg = {
k_type: 'k_container',
k_id: k_config.k_id + '_container',
k_isLabelHidden: true,
k_indent: k_config.k_indent,
k_height: 50,
k_items: [
{
k_type: 'k_checkbox',
k_id: k_config.k_id + '.enabled',
k_option: k_config.k_caption,
k_onChange: kerio.waw.shared.k_methods.k_optionalCheckboxObserver
},
{
k_type: 'k_number',
k_id: k_config.k_id + '.value',
k_isLabelHidden: true,
k_width: (k_config.k_isMainScreen ? 100 : undefined),
k_isDisabled: true,
k_indent: 1,
k_minValue: k_config.k_minValue || 0,
k_maxValue: k_config.k_maxValue || 999999999,
k_maxLength: (k_config.k_maxValue ? k_config.k_maxValue.length : 9),
k_validator: {
k_allowBlank: false
}
}
]
};
if (k_config.k_units) {
k_cfg.k_items[1] = {
k_type: 'k_row',
k_items: [
k_cfg.k_items[1],
{
k_type: 'k_display',
k_id: k_config.k_id + '.units',
k_value: k_config.k_units,
k_isDisabled: true
}
]
};
}
return k_cfg;
};

k_WAW_DEFINITIONS.k_optionalList = function(k_config) {
return {
k_type: 'k_container',
k_id: k_config.k_id + '_container',
k_isLabelHidden: true,
k_indent: k_config.k_indent,
k_height: 50,
k_items: [
{
k_type: 'k_checkbox',
k_id: k_config.k_id + '.enabled',
k_option: k_config.k_caption,
k_onChange: kerio.waw.shared.k_methods.k_optionalCheckboxObserver
},
{
k_type: 'k_select',
k_id: k_config.k_id + '.value',
k_width: (k_config.k_isMainScreen ? 300 : undefined),
k_isDisabled: true,
k_indent: 1,
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_localData: []
}
]
};
};

var
k_gridDataColumns = ['today', 'week', 'month', 'total'],
k_gridDataAppendixes = ['', 'In', 'Out'],
k_renderTrafficStats,
k_formatNumberColumn, k_j;

k_formatNumberColumn = function(k_from, k_value) {
var k_output = {};
k_output[k_from] = kerio.waw.shared.k_methods.k_formatNumber(k_value);
return k_output;
};
k_renderTrafficStats = function(k_value, k_data, k_rowIndex, k_columnIndex, k_grid) {
var
k_columnId = k_grid.k_getColumnId(k_columnIndex);
return kerio.waw.shared.k_methods.k_renderers.k_renderMBColumn(k_data.data[k_columnId]);
};
k_WAW_DEFINITIONS.k_trafficStatisticsMap = {}; for (k_i = 0; k_i < k_gridDataColumns.length; k_i++) {
for (k_j = 0; k_j < k_gridDataAppendixes.length; k_j++) {
k_WAW_DEFINITIONS.k_trafficStatisticsMap[k_gridDataColumns[k_i] + k_gridDataAppendixes[k_j]] = k_formatNumberColumn;
} } k_WAW_DEFINITIONS.k_prepareTrafficStatisticsColumns = {
k_isHidden: true,   k_columnId: 'prepareColumns', k_isKeptHidden: true,

k_renderer: function(k_value, k_data) {
var k_shared = kerio.waw.shared;
k_shared.k_methods.k_mergeObjects(
k_shared.k_methods.k_mapProperties(k_data.data, k_shared.k_DEFINITIONS.k_trafficStatisticsMap),
k_data
);
return {
k_data: ''
};
}
};
k_WAW_DEFINITIONS.k_trafficStatisticsColumns = [
{k_columnId: 'data', k_isDataOnly: true},
{k_caption: k_tr('Today [MB]',       'trafficStatisticsList'),        k_columnId: 'today',    k_align: 'right'                  , k_renderer: k_renderTrafficStats},
{k_caption: k_tr('Week [MB]',        'trafficStatisticsList'),        k_columnId: 'week',     k_align: 'right'                  , k_renderer: k_renderTrafficStats},
{k_caption: k_tr('Month [MB]',       'trafficStatisticsList'),        k_columnId: 'month',    k_align: 'right'                  , k_renderer: k_renderTrafficStats},
{k_caption: k_tr('Total [MB]',       'trafficStatisticsList'),        k_columnId: 'total',    k_align: 'right'                  , k_renderer: k_renderTrafficStats},
{k_caption: k_tr('Today IN [MB]',    'trafficStatisticsList'),        k_columnId: 'todayIn',  k_align: 'right', k_isHidden: true, k_renderer: k_renderTrafficStats},
{k_caption: k_tr('Today OUT [MB]',   'trafficStatisticsList'),        k_columnId: 'todayOut', k_align: 'right', k_isHidden: true, k_renderer: k_renderTrafficStats},
{k_caption: k_tr('Week IN [MB]',     'trafficStatisticsList'),        k_columnId: 'weekIn',   k_align: 'right', k_isHidden: true, k_renderer: k_renderTrafficStats},
{k_caption: k_tr('Week OUT [MB]',    'trafficStatisticsList'),        k_columnId: 'weekOut',  k_align: 'right', k_isHidden: true, k_renderer: k_renderTrafficStats},
{k_caption: k_tr('Month IN [MB]',    'trafficStatisticsList'),        k_columnId: 'monthIn',  k_align: 'right', k_isHidden: true, k_renderer: k_renderTrafficStats},
{k_caption: k_tr('Month OUT [MB]',   'trafficStatisticsList'),        k_columnId: 'monthOut', k_align: 'right', k_isHidden: true, k_renderer: k_renderTrafficStats},
{k_caption: k_tr('Total IN [MB]',    'trafficStatisticsList'),        k_columnId: 'totalIn',  k_align: 'right', k_isHidden: true, k_renderer: k_renderTrafficStats},
{k_caption: k_tr('Total OUT [MB]',   'trafficStatisticsList'),        k_columnId: 'totalOut', k_align: 'right', k_isHidden: true, k_renderer: k_renderTrafficStats}
];


k_WAW_DEFINITIONS.k_mtuInput = function(k_config) {
var
k_sharedMethods = kerio.waw.shared.k_methods,
k_tr = kerio.lib.k_tr,
k_isIpv6Avaible = k_sharedMethods.k_isIpv6Available(),
k_id = 'mtuOverride',
k_items;
k_items = [
{
k_type: 'k_checkbox',
k_id: k_id + '.enabled',
k_option: kerio.lib.k_tr('Override MTU', 'interfaceRasAdvancedEditor'),
k_onChange: kerio.waw.shared.k_methods.k_optionalCheckboxObserver
},
{
k_id: k_id + '.value',
k_type: 'k_number',
k_indent: 1,
k_isDisabled: true,
k_value: 1492,
k_minValue: 1,
k_maxValue: 65535,
k_maxLength: 5,
k_validator: {
k_allowBlank: false
}
}
];
if (k_isIpv6Avaible) {
k_items.push({
k_type: 'k_display',
k_id: 'k_mtuInfo',
k_className: 'k_mtuInfo infoImgIcon',
k_isLabelHidden: true,
k_indent: 1,
k_icon: 'img/info.png?v=8629',
k_value: k_tr('For IPv6, the value should be greater or equal to 1280 bytes.','interfaceRasAdvancedEditor')
});
}
return {
k_type: 'k_container',
k_id: k_id + '_' + 'k_container',
k_isLabelHidden: true,
k_height: k_isIpv6Avaible ? 80 : 50,
k_restrictions: {
k_isLinux: [ true ] },
k_items: k_items
};
}; 
k_WAW_DEFINITIONS.k_initCountryMap = function() {
var
k_libCountries = kerio.lib.k_getSortedCountries(true),
k_mappedList = {};
k_libCountries.forEach(function(k_country) {
k_mappedList[k_country.k_value] = k_country;
});
kerio.waw.shared.k_DEFINITIONS.k_MAP_COUNTRIES = k_mappedList;
};
k_WAW_DEFINITIONS.k_initCountryMap();
k_WAW_DEFINITIONS.k_COUNTRIES_LIMITED = {};

k_WAW_DEFINITIONS.k_getLimitedSortedCountries = function(k_id, k_listOfCountries) {
var
k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_localizedCountries = kerio.lib.k_getSortedCountries(true), k_countryList = [],
k_countryIndex,
k_country,
k_i, k_cnt;
if (k_DEFINITIONS.k_COUNTRIES_LIMITED[k_id]) {
return k_DEFINITIONS.k_COUNTRIES_LIMITED[k_id];
}
k_cnt = k_localizedCountries.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_country = k_localizedCountries[k_i];
k_countryIndex = k_listOfCountries.indexOf(k_country.k_value);
if (-1 !== k_countryIndex) {
k_countryList.push(k_country);
k_listOfCountries.splice(k_countryIndex, 1);
if (0 === k_listOfCountries.length) {
break;
}
}
}
if (0 !== k_listOfCountries.length) {
kerio.lib.k_reportError('Unknown country: ' + k_listOfCountries[0] + ' in country list: ' +  k_id, 'sharedDefinitions', 'k_getLimitedSortedCountries');
}
k_DEFINITIONS.k_COUNTRIES_LIMITED[k_id] = k_countryList;
return k_countryList;
};

k_WAW_DEFINITIONS.k_ethernetTypeSelection = function(k_config) {
var
k_tr = kerio.lib.k_tr,
InterfaceModeType = kerio.waw.shared.k_CONSTANTS.InterfaceModeType,
k_fullId = (k_config ? k_config.k_fullId : undefined),
k_id = (k_config && k_config.k_id ? (k_config.k_id + '_') : '');
return kerio.waw.shared.k_methods.k_mergeObjects(k_config, {
k_restrictions: {
k_serverOs: [ kerio.waw.shared.k_CONSTANTS.k_SERVER.k_OS_LINUX ] },
k_type: 'k_container',
k_items: [
{
k_type: 'k_select',
k_id: k_fullId || (k_id + 'k_ethernetType'),
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',
k_caption: k_tr('Mode:', 'connectivityWizard'),
k_width: 130,
k_value: InterfaceModeType.InterfaceModeAutomatic,
k_localData: [
{k_name: k_tr('Automatic', 'connectivityWizard'), k_value: InterfaceModeType.InterfaceModeAutomatic},
{k_name: k_tr('Manual', 'connectivityWizard'), k_value: InterfaceModeType.InterfaceModeManual},
{k_name: k_tr('PPPoE', 'connectivityWizard'), k_value: InterfaceModeType.k_PPPoE}
],
k_onChange: k_config.k_onChange
}
]
});
};

k_WAW_DEFINITIONS.k_ethernetModeForWizard = function(k_config) {
k_config = k_config || {};
var
k_tr = kerio.lib.k_tr,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
InterfaceModeType = k_WAW_CONSTANTS.InterfaceModeType,
InterfaceEncapType = k_WAW_CONSTANTS.InterfaceEncapType,
k_fullId = k_config.k_fullId,
k_id = (k_config.k_id ? (k_config.k_id + '_') : '');
return kerio.waw.shared.k_methods.k_mergeObjects(k_config, {
k_restrictions: {
k_serverOs: [ k_WAW_CONSTANTS.k_SERVER.k_OS_LINUX ] },
k_type: 'k_container',
k_items: [
{
k_type: 'k_select',
k_id: k_fullId || (k_id + 'k_ethernetMode'),
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_value',
k_caption: k_tr('Mode:', 'connectivityWizard'),
k_width: 130,
k_value: InterfaceModeType.InterfaceModeAutomatic,
k_localData: [
{k_name: k_tr('Automatic', 'connectivityWizard'), k_value: InterfaceModeType.InterfaceModeAutomatic},
{k_name: k_tr('Manual', 'connectivityWizard'), k_value: InterfaceModeType.InterfaceModeManual},
{k_name: k_tr('PPPoE', 'connectivityWizard'), k_value: InterfaceEncapType.InterfaceEncapPppoe}
],
k_onChange: k_config.k_onChange
}
]
});
};

k_WAW_DEFINITIONS.k_ethernetIpSettings = function(k_config) {
var
k_tr = kerio.lib.k_tr,
k_isWindows = !kerio.waw.shared.k_methods.k_isLinux(),
k_id,
k_return,
k_getObserver;
if (k_isWindows) {

k_getObserver = function(k_closureId){


return function(k_form, k_checkbox, k_isChecked){
k_form.k_setDisabled(k_closureId, k_isChecked);
};
};
}
k_config = k_config || {};
k_id = k_config.k_id ? (k_config.k_id + '_') : '';
k_return = kerio.waw.shared.k_methods.k_mergeObjects(k_config, {
k_type: 'k_container',
k_indent: 1,
k_items: [
{
k_caption: k_tr('IP Address:', 'ipAddressGroupEditor'),
k_id: k_id + 'k_ip',
k_isReadOnly: k_isWindows,
k_maxLength: 15,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},

k_onBlur: function(k_form, k_element) {
var
k_value = k_element.k_getValue(),
k_id = k_element.k_name,
k_prefix = k_id.substr(0, k_id.indexOf('k_ip'));
kerio.waw.shared.k_methods.k_generateMaskForIp(k_value, { k_form: k_form, k_maskFieldId: k_prefix + 'k_subnetMask' });
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
},
kerio.waw.shared.k_DEFINITIONS.k_get('k_ipv4MaskField', {
k_id: k_id + 'k_subnetMask',
k_isReadOnly: k_isWindows
}),
{
k_caption: k_tr('Gateway:', 'interfaceEthernetEditor'),
k_id: k_id + 'k_gateway',
k_maxLength: 15,
k_validator: {
k_allowBlank: true, k_functionName: 'k_isIpAddress',
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
},
{
k_restrictions: {
k_serverOs: [ kerio.waw.shared.k_CONSTANTS.k_SERVER.k_OS_WINDOWS ]
},
k_type: 'k_checkbox',
k_id: k_id + 'k_gatewayAutodetected',
k_option: k_tr('Autodetect gateway from the operating system', 'interfaceEthernetEditor'),
k_onChange: (k_isWindows ? k_getObserver(k_id + 'k_gateway') : undefined)
},
kerio.waw.shared.k_DEFINITIONS.k_get('k_dnsListField', {
k_caption: k_tr('DNS Server:', 'interfaceEthernetEditor'),
k_id: k_id + 'k_dnsServers'
}),
{
k_restrictions: {
k_serverOs: [ kerio.waw.shared.k_CONSTANTS.k_SERVER.k_OS_WINDOWS ]
},
k_type: 'k_checkbox',
k_id: k_id + 'k_dnsAutodetected',
k_option: k_tr('Autodetect DNS server from the operating system', 'interfaceEthernetEditor'),
k_onChange: (k_isWindows ? k_getObserver(k_id + 'k_dnsServers') : undefined)
}
]
});
k_return.k_id = k_id + 'k_networkSettings';
return k_return;
}; 
k_WAW_DEFINITIONS.k_ethernetPppoeSettings = function(k_config) {
var
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_tr = kerio.lib.k_tr,
k_mergeObjects = kerio.waw.shared.k_methods.k_mergeObjects,
k_configDefaults,
k_return,
k_closureId;
k_config = k_config || {};
k_configDefaults = {
k_isIpVisible: true,
k_passwordEmptyText: 'NoPassword'
};
k_config = k_mergeObjects(k_config, k_configDefaults); k_closureId = k_config.k_id ? (k_config.k_id + '_') : '';
k_return = k_mergeObjects(k_config, {
k_type: 'k_container',
k_isVisible: false,
k_indent: 1,
k_restrictions: {
k_serverOs: [ kerio.waw.shared.k_CONSTANTS.k_SERVER.k_OS_LINUX ]
},
k_items: [
k_WAW_DEFINITIONS.k_get('k_userNameField', {k_id: k_closureId + 'k_userName', k_width: undefined, k_validator: { k_functionName: 'k_isUserNameDomain' }}),
k_WAW_DEFINITIONS.k_get('k_passwordField', {k_id: k_closureId + 'k_password', k_emptyText: k_config.k_passwordEmptyText, k_width: undefined}),
{
k_caption: k_tr('IP Address:', 'ipAddressGroupEditor'),
k_id: k_closureId + 'k_pppoeIp',
k_isVisible: k_config.k_isIpVisible,
k_isReadOnly: true
},
kerio.waw.shared.k_DEFINITIONS.k_get('k_dnsListField', {
k_caption: k_tr('DNS Server:', 'interfaceEthernetEditor'),
k_id: k_closureId + 'k_pppoeDnsServers',
k_isDisabled: true
}),
{
k_type: 'k_checkbox',
k_id: k_closureId + 'k_pppoeDnsAutodetected',
k_isChecked: true, k_option: k_tr('Autodetect DNS server from the operating system', 'interfaceEthernetEditor'),

k_onChange: function(k_form, k_checkbox, k_isChecked) {
k_form.k_setDisabled([k_closureId + 'k_pppoeDnsServers'], k_isChecked);
}
}
]
});
k_return.k_id = k_closureId + 'k_pppoeSettings';
return k_return;
}; 
k_WAW_DEFINITIONS.k_interfaceIpSettings = function(k_config) {
var
k_tr = kerio.lib.k_tr,
k_get = kerio.waw.shared.k_DEFINITIONS.k_get,
k_isWindows = !kerio.waw.shared.k_methods.k_isLinux(),
k_id,
k_return;
k_config = k_config || {};
k_id = k_config.k_id ? (k_config.k_id + '_') : '';
k_return = kerio.waw.shared.k_methods.k_mergeObjects(k_config, {
k_type: 'k_container',
k_indent: 1,
k_items: [
{
k_caption: k_tr('IP Address:', 'ipAddressGroupEditor'),
k_id: k_id + 'k_ip',
k_isReadOnly: k_isWindows,
k_maxLength: 15,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},

k_onBlur: function(k_form, k_element) {
var
k_value = k_element.k_getValue(),
k_id = k_element.k_name,
k_prefix = k_id.substr(0, k_id.indexOf('k_ip'));
kerio.waw.shared.k_methods.k_generateMaskForIp(k_value, { k_form: k_form, k_maskFieldId: k_prefix + 'k_subnetMask' });
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
},
kerio.waw.shared.k_DEFINITIONS.k_get('k_ipv4MaskField', {
k_id: k_id + 'k_subnetMask',
k_isReadOnly: k_isWindows
}),
k_get('k_autodetectRow', {
k_fieldId: k_id + 'k_gateway',
k_autodetectId: k_id + 'k_gatewayAutodetected',
k_caption: k_tr('Gateway:', 'interfaceEthernetEditor'),
k_autodetectRestrictions: {
k_serverOs: [ kerio.waw.shared.k_CONSTANTS.k_SERVER.k_OS_WINDOWS ]
}
}),
k_get('k_autodetectRow', {
k_fieldId: k_id + 'k_dnsServers',
k_autodetectId: k_id + 'k_dnsAutodetected',
k_caption: k_tr('DNS Server:', 'interfaceEthernetEditor'),
k_isList: true,
k_autodetectRestrictions: {
k_serverOs: [ kerio.waw.shared.k_CONSTANTS.k_SERVER.k_OS_WINDOWS ]
}
})
]
});
k_return.k_id = k_id + 'k_networkSettings';
return k_return;
}; 
k_WAW_DEFINITIONS.k_interfacePppoeSettings = function(k_config) {
var
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_tr = kerio.lib.k_tr,
k_mergeObjects = kerio.waw.shared.k_methods.k_mergeObjects,
k_configDefaults,
k_return,
k_id;
k_config = k_config || {};
k_configDefaults = {
k_isIpVisible: true,
k_passwordEmptyText: 'NoPassword'
};
k_config = k_mergeObjects(k_config, k_configDefaults); k_id = k_config.k_id ? (k_config.k_id + '_') : '';
k_return = k_mergeObjects(k_config, {
k_type: 'k_container',
k_isVisible: false,
k_indent: 1,
k_restrictions: {
k_serverOs: [ kerio.waw.shared.k_CONSTANTS.k_SERVER.k_OS_LINUX ]
},
k_items: [
k_WAW_DEFINITIONS.k_get('k_userNameField', {k_id: k_id + 'k_userName', k_width: undefined, k_validator: { k_functionName: 'k_isUserNameDomain' }}),
k_WAW_DEFINITIONS.k_get('k_passwordField', {k_id: k_id + 'k_password', k_emptyText: k_config.k_passwordEmptyText, k_width: undefined}),
{
k_caption: k_tr('IP Address:', 'ipAddressGroupEditor'),
k_id: k_id + 'k_pppoeIp',
k_isVisible: k_config.k_isIpVisible,
k_isReadOnly: true
},
k_WAW_DEFINITIONS.k_get('k_autodetectRow', {
k_fieldId: k_id + 'k_pppoeDnsServers',
k_autodetectId: k_id + 'k_pppoeDnsAutodetected',
k_caption: k_tr('DNS Server:', 'interfaceEthernetEditor'),
k_isList: true,
k_autodetectChecked: true
})
]
});
k_return.k_id = k_id + 'k_pppoeSettings';
return k_return;
}; 
k_WAW_DEFINITIONS.k_userListStatus = function() {
return {
k_isCurrentDomainLocal: true,
k_isAdAuthEnabled: false,
k_isNtAuthEnabled: false,
k_currentDomainId: kerio.waw.shared.k_CONSTANTS.k_USER_DOMAINS.k_LOCAL_USER_DATABASE
};
};
k_WAW_DEFINITIONS.k_userEditorEnableUserCfg = {};k_WAW_DEFINITIONS.k_userEditorUseTemplateCfg = [];
k_WAW_DEFINITIONS.k_bandwidthTrafficDataTemplate = {
type: k_WAW_CONSTANTS.BMConditionType.BMConditionInvalid,
valueId: {
id: '',
name: '',
invalid: false
},
service: {
id: '',
name: '',
invalid: false,
isGroup: false
},
dscp: 0,
trafficType: k_WAW_CONSTANTS.BMTrafficType.BMTrafficWeb,
user: {
id: '',
name: '',
isGroup: false,
domainName: ''
}
};

k_WAW_DEFINITIONS.k_dscpField = function(k_config) {
var
k_isDisabled = true === k_config.k_isDisabled ? true : false;
return {
k_type: 'k_number',
k_caption: kerio.lib.k_tr('DSCP value (0 - 63):', 'trafficActionEditor'),
k_id: k_config.k_id,
k_isDisabled: k_isDisabled,
k_indent: 1,
k_width: 40,
k_value: 0,
k_minValue: 0,
k_maxValue: 63,
k_maxLength: 2,
k_validator: {
k_allowBlank: false
}
};
};

k_WAW_DEFINITIONS.k_gridSearchField = function(k_config) {
var
k_id = k_config.k_id,
k_fieldConfig,
k_default,
k_el;
k_default = {
k_className: 'searchField',
k_isLabelHidden: true,
k_value: '',
k_onKeyUp: function(k_parent, k_searchField) {
k_searchField.k_filter();
}
};
delete k_config.k_id;
k_config.k_isSearchField = false !== k_config.k_isSearchField;
k_fieldConfig = kerio.waw.shared.k_methods.k_mergeObjects(k_config, k_default);
k_el = new kerio.lib.K_TextField(k_id, k_fieldConfig);
k_el.k_addReferences({
_k_searchFields:   k_config.k_searchFields,
_k_groupColumn:    k_config.k_groupColumn,
_k_searchGrid:     k_config.k_parentGrid,
_k_searchCallback: k_config.k_onAfterFilter,
_k_onBeforeFilterChange: k_config.k_onBeforeFilterChange,

k_filter: function() {
var
k_closureFitGroups = [],
k_closureFitRows = 0;
if ('function' === typeof this._k_onBeforeFilterChange) {
this._k_onBeforeFilterChange.call(this._k_searchGrid, k_closureFitRows, k_closureFitGroups);
}
this.k_getMainWidget().k_searchedValue = this.k_getValue().toLowerCase();
this._k_searchGrid.k_filterRowsBy(function(k_rowData) {
var
k_getValue = kerio.lib._k_getPointerToObject, k_search = this.k_getValue().toLowerCase(), k_fields = this._k_searchFields,
k_group  = this._k_groupColumn,
k_value,
k_iMember, k_cntMembers,
k_members,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_fields.length; k_i < k_cnt; k_i++) {
k_value = k_getValue.call(k_rowData, k_fields[k_i], 'this');
if (undefined === k_value || 'boolean' === typeof k_value) {
continue;
}
k_value = k_value.toLowerCase();
if (-1 < k_value.indexOf(k_search)) {
k_closureFitRows++;
if (k_group) {
k_value = k_getValue.call(k_rowData, k_group, 'this');
if (-1 < k_value.toLowerCase().indexOf(k_search) && -1 === k_closureFitGroups.indexOf(k_value)) { k_closureFitGroups.push(k_value);
}
}
return true;
}
if (this.k_parentWidget.k_relatedWidget && this.k_parentWidget.k_relatedWidget.k_isSelectServices) {
if (k_rowData.group) {
k_members = k_rowData.members;
for (k_iMember = 0, k_cntMembers = k_members.length; k_iMember < k_cntMembers; k_iMember++) {
k_value = k_members[k_iMember].name.toLowerCase();
if (-1 < k_value.indexOf(k_search)) {
return true;
}
}
}
}
}
return false;
}, this);
if ('function' === typeof this._k_searchCallback) {
this._k_searchCallback.call(this._k_searchGrid, k_closureFitRows, k_closureFitGroups);
}
}
});
return k_el;
};

k_WAW_DEFINITIONS.k_predefinedDhcpReservation = {
name:    '',
leaseId: '',
scopeId: '',
status:  k_WAW_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusNew,
type:    k_WAW_CONSTANTS.DhcpLeaseType.DhcpTypeReservation,
leased:  false,
isRas:   false,
options: [],
ipAddress:  '',
macDefined: true,
macAddress: '',
hostName:   '',
userName:   '',
cardManufacturer: '',
expirationDate: {year:0,month:0,day:0},
expirationTime: {hour:0,min:0},
requestDate:    {year:0,month:0,day:0},
requestTime:    {hour:0,min:0}
};
var BMConditionType = k_WAW_CONSTANTS.BMConditionType;
k_WAW_DEFINITIONS.k_BM_TYPE_ORDER = [
BMConditionType.BMConditionApplication,
BMConditionType.BMConditionTrafficType,
BMConditionType.BMConditionLargeData,   BMConditionType.BMConditionUsers,        BMConditionType.BMConditionHosts,
BMConditionType.BMConditionQuota,        BMConditionType.BMConditionTrafficRule, BMConditionType.BMConditionContentRule, BMConditionType.BMConditionService,
BMConditionType.BMConditionDscp,
BMConditionType.BMConditionGuests,
BMConditionType.BMConditionInvalid       ];
var BMTrafficType = k_WAW_CONSTANTS.BMTrafficType;
var k_BM_TRAFFIC_TYPE_TRANSLATIONS = [];
k_BM_TRAFFIC_TYPE_TRANSLATIONS[BMTrafficType.BMTrafficEmail] = k_tr('Email', 'bandwidthManagement');
k_BM_TRAFFIC_TYPE_TRANSLATIONS[BMTrafficType.BMTrafficFtp] = k_tr('FTP', 'bandwidthManagement');
k_BM_TRAFFIC_TYPE_TRANSLATIONS[BMTrafficType.BMTrafficInstantMessaging] = k_tr('Instant Messaging', 'bandwidthManagement');
k_BM_TRAFFIC_TYPE_TRANSLATIONS[BMTrafficType.BMTrafficMultimedia] = k_tr('Multimedia', 'bandwidthManagement');
k_BM_TRAFFIC_TYPE_TRANSLATIONS[BMTrafficType.BMTrafficP2p] = k_tr('P2P', 'bandwidthManagement');
k_BM_TRAFFIC_TYPE_TRANSLATIONS[BMTrafficType.BMTrafficRemoteAccess] = k_tr('Remote Access', 'bandwidthManagement');
k_BM_TRAFFIC_TYPE_TRANSLATIONS[BMTrafficType.BMTrafficSip] = k_tr('SIP VoIP', 'bandwidthManagement');
k_BM_TRAFFIC_TYPE_TRANSLATIONS[BMTrafficType.BMTrafficVpn] = k_tr('VPN', 'bandwidthManagement');
k_BM_TRAFFIC_TYPE_TRANSLATIONS[BMTrafficType.BMTrafficWeb] = k_tr('Web Browsing', 'bandwidthManagement');
k_WAW_DEFINITIONS.k_BM_TRAFFIC_TYPE_TRANSLATIONS = k_BM_TRAFFIC_TYPE_TRANSLATIONS;
var ContentConditionEntityType = k_WAW_CONSTANTS.ContentConditionEntityType;
k_WAW_DEFINITIONS.k_CF_TYPE_ORDER = [
ContentConditionEntityType.ContentConditionEntityApplication,
ContentConditionEntityType.ContentConditionEntityFileGroup,
ContentConditionEntityType.ContentConditionEntityFileName,
ContentConditionEntityType.ContentConditionEntityUrl,
ContentConditionEntityType.ContentConditionEntityUrlGroup,
ContentConditionEntityType.k_ADDRESS_GROUP,
ContentConditionEntityType.k_IP_ADDRESS,
ContentConditionEntityType.k_INVALID
];

k_WAW_DEFINITIONS.k_cutOffTrCache = {
k_alertTitle:                '',
k_veryDangerousTitle:        k_tr('Your recent changes may have affected your connection to the Kerio Control Administration.', 'connectivityWarning')
+ '<br><br>'
+ k_tr('To confirm them, please login again within the next 10 minutes. Otherwise, Kerio Control will revert your changes.', 'connectivityWarning'),
k_restartWarningTitle:       k_tr('Your changes have caused the Kerio Control Administration to be unable to communicate with the server.', 'connectivityWarning')
+ '<br><br><b>'
+ k_tr('To confirm them, please login again within the next 10 minutes. Otherwise, Kerio Control will revert your changes.', 'connectivityWarning')
+ '</b><br><br><i>'
+ k_tr('Note: some browsers may have a problem with the new kind of connection. If the login page or the Kerio Control Administration fails to load, please close all the browser windows and start it again.', 'connectivityWarning')
+ '</i>',
k_revertWarningMessage:      k_tr('Your recent configuration changes were not saved because they would break your connection to the Kerio Control Administration.', 'connectivityWarning'),
k_keepAliveTitle:            k_tr('Waiting for server connection…', 'connectivityWarning'),
k_loginMessage:              k_tr('You have confirmed that you are able to login to Kerio Control Administration. Your recent configuration changes have been saved.', 'connectivityWarning'),
k_restartTitle:              k_tr('Waiting for server restart…', 'connectivityWarning'),
k_shutdownTitle:             k_tr('The Kerio Control server has shut down.', 'connectivityWarning'),
k_manualShutdownTitle:       k_tr('Please wait for 2 minutes, then switch off the %1.', 'connectivityWarning', {k_args: ['Kerio Control Box']}),
k_serverLostTitle:           k_tr('The Kerio Control server does not respond.', 'connectivityWarning'),
k_serverTimeout:             k_tr('The Kerio Control server did not respond in the given time limit.', 'connectivityWarning')
+ '<br><br>'
+ k_tr('This seems to be only a temporary communication error. Please try again later.', 'connectivityWarning'),
k_invalidSessionCutOff:      k_tr('Your changes have caused your account to lose its administration rights.', 'connectivityWarning')
+ '<br><br>'
+ k_tr('Now you will be redirected to the login page. There you can login as another user with administration rights and confirm your changes. Alternativately, you can wait for 10 minutes for the configuration to revert and then login using current user account again.', 'connectivityWarning')
};

k_WAW_DEFINITIONS.k_trLibraryMessageMap = {
"License directory %1 does not exist."                 : k_tr("The license directory %1 does not exist."                     , 'libraries', {k_args: ['']}),
"Cannot write new license file"                        : k_tr("Cannot write a new license file"                              , 'libraries'),
"Cannot load new license file"                         : k_tr("The license file was not accepted"                            , 'libraries'),
"Cannot install the new license file"                  : k_tr("Cannot install the new license file"                          , 'libraries'),
"Cannot check null license"                            : k_tr("Cannot check the null license"                                , 'libraries'),
"Product edition does not match"                       : k_tr("The product edition does not match"                           , 'libraries'),
"Product version doesn't fit required minimal version" : k_tr("The product version doesn't fit the minimal required version" , 'libraries'),
"License is not for this hardware"                     : k_tr("The license is not suitable for this hardware"                , 'libraries'),
"License is not for this operating system"             : k_tr("The license is not suitable for this operating system"        , 'libraries'),
"Product name does not match"                          : k_tr("The product name does not match"                              , 'libraries'),
"License is expired"                                   : k_tr("The license is expired"                                       , 'libraries'),
"License subscription is expired"                      : k_tr("The Software Maintenance is expired"                          , 'libraries')
};
k_WAW_DEFINITIONS.k_userListIds = {
k_userList:      'userList',
k_userGroupList: 'groupList',
k_userAdd:       'userAdd',
k_userGroupAdd:  'userGroupAdd',
k_userEdit:      'userEdit',
k_userMultiEdit: 'userMultiEdit',
k_userGroupEdit: 'userGroupEdit',
k_userView:      'userView',
k_userGroupView: 'userGroupView',
k_userMultiEditor: 'userMultiEditor',
k_userEditor:      'userEditor',
k_userGroupEditor: 'userGroupEditor',
k_userTemplateEditor: 'userTemplateEditor',
k_userImportServer:   'userImportServer',
k_excludedUsers:      'excludedUsers',
k_ruleEditor:         'ruleEditor'
};
k_WAW_DEFINITIONS.k_unchangedText = '[' + k_tr('Unchanged', 'userMultiEditor') + ']';
k_WAW_DEFINITIONS.k_IP_RANGE_ERROR =  k_tr('The range of IP addresses is not valid.', 'trafficHostEditor');
k_WAW_DEFINITIONS.k_smtpServer = function() {
var
k_tr = kerio.lib.k_tr,
k_link = kerio.waw.shared.k_DEFINITIONS.k_get('k_MENU_TREE_NODES.remoteServicesList'),
k_linkAction = kerio.waw.status.k_currentScreen.k_gotoNode.createDelegate(kerio.waw.status.k_currentScreen, ['remoteServices', 'k_smtpForm']),
k_noSmtpServerMessage = k_tr('Email messages can\'t be sent because no SMTP server is configured.', 'smtpServer'); return {
k_noSmtpServerMessage: k_noSmtpServerMessage,
k_undefinedSmtpDisplay: {
k_type: 'k_display',
k_id: 'k_undefinedSmtpDisplay',
k_icon: 'img/warning.png?v=8629',
k_className: 'warningImgIcon',
k_isHidden: true,
k_template: '{k_message} <a>{k_link}</a>',
k_isReadOnly: false,
k_value: {
k_message: k_noSmtpServerMessage,
k_link: k_tr('SMTP server can be configured in %1…', 'smtpServer', {
k_args: [k_link]
})
},
k_onLinkClick: k_linkAction
},
k_definedSmtpDisplay: {
k_type: 'k_display',
k_id: 'k_definedSmtpDisplay',
k_icon: 'img/info.png?v=8629',
k_className: 'infoImgIcon',
k_isHidden: true,
k_isReadOnly: false,
k_template: '{k_message} <a>{k_link}</a>',
k_value: {
k_message: '', k_link: k_tr('SMTP server can be configured in %1…', 'smtpServer', {
k_args: [k_link]
})
},
k_onLinkClick: k_linkAction
},
k_request: {
k_jsonRpc: {
method: 'SmtpRelay.get'
},
k_scope: {},
k_callback: function(k_data){
var
k_text = '',
k_undefinedSmtpDisplay = this.k_getItem('k_undefinedSmtpDisplay'),
k_definedSmtpDisplay = this.k_getItem('k_definedSmtpDisplay');
if (k_data.config.useKManager) {
k_text = kerio.lib.k_tr('Email messages will be sent via the MyKerio notification service.', 'smtpServer');
k_definedSmtpDisplay.k_setValue({k_message: k_text});
k_definedSmtpDisplay.k_setVisible(true);
k_undefinedSmtpDisplay.k_setVisible(false);
}
else if (k_data.config.useAppManager) {
k_text = kerio.lib.k_tr('Email messages will be sent via the AppManager notification service.', 'smtpServer');
k_definedSmtpDisplay.k_setValue({k_message: k_text});
k_definedSmtpDisplay.k_setVisible(true);
k_undefinedSmtpDisplay.k_setVisible(false);
}
else if (k_data.config && k_data.config.server) {
k_text = kerio.lib.k_tr('Email messages will be sent via the %1 server.', 'smtpServer', {k_args: [ k_data.config.server]});
k_definedSmtpDisplay.k_setValue({k_message: k_text});
k_definedSmtpDisplay.k_setVisible(true);
k_undefinedSmtpDisplay.k_setVisible(false);
}
else { k_definedSmtpDisplay.k_setVisible(false);
k_undefinedSmtpDisplay.k_setVisible(true);
}
}
}
};
};

k_WAW_DEFINITIONS.k_CHART_MAX_VALUES = [
1, 2, 4,8,16,32,64,
20,40,80,
256,512,
100,200,400,600,800,
1024 ].sort(function(a,b) { return a - b; }); k_WAW_DEFINITIONS.k_DEFINITON_APPLY_RESET_REQUEST = {
k_jsonRpc: {
method: null
},
k_callback: kerio.waw.shared.k_methods.k_definitionApplyResetCallback,
k_scope: null
};
k_WAW_DEFINITIONS.k_CONTROL_URL = {
k_configOrigin: {},
k_PROTOCOL: 'https',
k_HOSTNAME: window.location.hostname,
k_PORT: ':4081',
k_ADMIN_PATH: '/admin', k_GUEST_PATH: '/nonauth/guest.php',
k_sendRequest: function() {
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'WebInterface.get'
},
k_callback: function(k_response) {
if (k_response.k_isOk && k_response.k_decoded && k_response.k_decoded.config) {
kerio.waw.shared.k_DEFINITIONS.k_CONTROL_URL.k_set(k_response.k_decoded.config);
}
}
});
},
k_getWebifaceUrl: function(k_hash) {
var k_specificPage = k_hash ? 'index.php#' + k_hash : '';
return this.k_PROTOCOL + '://' + this.k_HOSTNAME + this.k_PORT + '/' + k_specificPage;
},
k_getGuestUrl: function() {
return this.k_getWebifaceUrl() + this.k_GUEST_PATH;
},
k_getAdminUrl: function() {
return this.k_getWebifaceUrl() + this.k_ADMIN_PATH;
},
k_set: function(k_config, k_tempConfig) {
if (true !== k_tempConfig) {
this.k_configOrigin = k_config;
}
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS;
k_CONSTANTS.k_WEB_PORT_SECURED = k_config.sslPort;
k_CONSTANTS.k_WEB_PORT_UNSECURED = k_config.port;
this.k_PROTOCOL = k_config.useSsl ? 'https' : 'http';
this.k_PORT = ':' + (k_config.useSsl ? k_config.sslPort : k_config.port);
this.k_HOSTNAME = k_config.hostname && k_config.hostname.enabled ? k_config.hostname.value : k_config.detectedHostname;
this.k_ADMIN_PATH = k_config.adminPath;
},
k_getTempUrls: function(k_config) {
var k_adminUrl,k_starUrl;
this.k_set(k_config, true);
k_adminUrl = this.k_getAdminUrl();
k_starUrl = this.k_getWebifaceUrl();
this.k_set(this.k_configOrigin);
return {
k_star: k_starUrl,
k_admin: k_adminUrl
};
}
};
k_WAW_DEFINITIONS.k_APPLICATION_DATA_STORE_GROUP = {
k_add: function(k_item) {
var
k_group = k_item.group,
k_data = this.k_data,
k_isAppAlreadyListed = false,
k_i, k_cnt,
k_iApp, k_cntApp,
k_id,
k_applications;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_data[k_i].group === k_group) {
k_id = k_item.id;
k_applications = k_data[k_i].applications;
for (k_iApp = 0, k_cntApp = k_applications.length; k_iApp < k_cntApp; k_iApp++) {
if (k_id === k_applications[k_i]) {
k_isAppAlreadyListed = true;
break;
}
}
if (true !== k_isAppAlreadyListed) {
k_data[k_i].applications.push(k_id);
}
return;
}
}
k_item.applications = [k_item.id];
k_data.push(k_item);
},
k_data: [],
k_sort: kerio.waw.shared.k_methods.k_sortSubGroups,
k_compare: function(k_first, k_second) {
return k_first.id === k_second.id;
}
};
}; 