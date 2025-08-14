

kerio.adm.k_widgets.certificateRequest = {

k_init: function(k_objectName, k_initParams) {
var
k_formCfg,
k_form,
k_dialogCfg,
k_dialog,
k_DURATION_CERTIFICATE_REQUEST = 0,
k_DURATION_YEAR = 1,
k_DURATION_YEARS_TWO = 2,
k_DURATION_YEARS_THREE = 3,
k_DURATION_YEARS_FIVE = 5,
k_DURATION_YEARS_TEN = 10,
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isNewCertificate = ('newCertificate' === k_objectName),
k_isRecreate = ('autorityRecreate' === k_objectName),
k_hasDuration = (k_isRecreate || k_isNewCertificate),
k_canRename = k_initParams.k_canRename;
k_formCfg = {
k_restrictBy: {
k_isRecreate: k_isRecreate,
k_hasDuration: k_hasDuration,
k_canRename: k_canRename
},
k_labelWidth: 170,
k_items: [{
k_restrictions: {
k_canRename: [true]
},
k_id: 'k_name',
k_caption: k_tr('Name:', 'wlibCertificateRequest'),
k_maxLength: 63,
k_value: (k_isRecreate ? k_tr('Local Authority', 'wlibCertificateRequest') : k_tr('New certificate', 'wlibCertificateRequest')),
k_isReadOnly: k_isRecreate,
k_validator: {
k_allowBlank: false
}
}, {
k_id: 'k_hostname',
k_caption: k_tr('Hostname:', 'wlibCertificateRequest'),
k_maxLength: 63,
k_validator: {
k_allowBlank: false
}
}, {
k_type: 'k_container',
k_id: 'k_alternativeNameContainer',
k_items: [
{
k_id: 'k_subjectAlternativeNameList',
k_caption: k_tr('Alternative hostnames:', 'wlibCertificateRequest'),
k_validator: {
k_allowBlank: true,
k_functionName: 'k_isHostsList'
}
}, {
k_type: 'k_display',
k_caption: ' ', k_value: k_tr('Use semicolons (%1) to separate individual hostnames.', 'wlibCertificateRequest', { k_args: [' ; '], k_isSecure: true})
}
]
}, {
k_id: 'k_organization',
k_maxLength: 63,
k_caption: k_tr('Organization name:', 'wlibCertificateRequest')
}, {
k_id: 'k_unit',
k_maxLength: 63,
k_caption: k_tr('Organization unit:', 'wlibCertificateRequest')
}, {
k_id: 'k_location',
k_maxLength: 127,
k_caption: k_tr('City:', 'wlibCertificateRequest')
}, {
k_id: 'k_state',
k_maxLength: 127,
k_caption: k_tr('State or Province:', 'wlibCertificateRequest')
}, {
k_id: 'k_country',
k_type: 'k_select',
k_localData: kerio.lib.k_getSortedCountries(),
k_value: 'US',
k_fieldValue: 'k_value',
k_fieldDisplay: 'k_name',
k_caption: k_tr('Country:', 'wlibProductRegistration')
}, {
k_restrictions: {
k_hasDuration: [ true ]
},
k_id: 'k_validFor',
k_type: 'k_select',
k_value: 1,
k_localData: [
{k_value: k_DURATION_YEAR,        k_name: k_tr('1 year', 'wlibCertificateRequest')},
{k_value: k_DURATION_YEARS_TWO,   k_name: k_tr('2 years', 'wlibCertificateRequest')},
{k_value: k_DURATION_YEARS_THREE, k_name: k_tr('3 years', 'wlibCertificateRequest')},
{k_value: k_DURATION_YEARS_FIVE,  k_name: k_tr('5 years', 'wlibCertificateRequest')},
{k_value: k_DURATION_YEARS_TEN,   k_name: k_tr('10 years', 'wlibCertificateRequest')}
],
k_fieldValue: 'k_value',
k_fieldDisplay: 'k_name',
k_caption: k_tr('Valid for:', 'wlibCertificateRequest')
}
]
};
k_form = new k_lib.K_Form(k_objectName + '_' + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: 470,
k_height: 310 + (k_hasDuration ? 22 : 0) + (k_canRename ? 22 : 0),
k_content: k_form,
k_title: (k_isNewCertificate)
? k_tr('New Certificate', 'wlibCertificateRequest')
: (k_isRecreate)
? k_tr('New Certificate for Local Authority', 'wlibCertificateRequest')
: k_tr('New Certificate Request', 'wlibCertificateRequest'),
k_buttons: [
{	k_id: 'k_btnOk',
k_isDefault: true,
k_caption: k_tr('OK', 'wlibButtons'),

k_onClick: function(k_toolbar) {
k_toolbar.k_dialog.k_saveData();
}
},
{	k_id: 'k_btnCancel',
k_caption: k_tr('Cancel', 'wlibButtons'),
k_isCancel: true
}
]
};
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_DURATION_CERTIFICATE_REQUEST: k_DURATION_CERTIFICATE_REQUEST,
k_DURATION_YEARS_TEN: k_DURATION_YEARS_TEN,
k_form: k_form,
k_isNewCertificate: k_isNewCertificate,
k_isRecreate: k_isRecreate,
k_hasDuration: k_hasDuration,
k_canRename: k_canRename,
k_certificateType: ''
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget){

k_kerioWidget.k_applyParams = function(k_params){
var
k_originData = k_params.k_data,
k_i, k_cnt,
k_subjects,
k_item,
k_data,
k_name,
k_subjectAlternativeNameList;
this.k_relatedGrid = k_params.k_relatedGrid;
this.k_certificateType = k_params.k_certificateType;
if (k_originData) {
k_data = {};
k_data.k_name = k_originData.name;
k_subjects = k_originData.subject;
if ('autorityRecreate' === this.k_id) {
this.k_form.k_setVisible('k_alternativeNameContainer', false);
}
else {
k_subjectAlternativeNameList = k_originData.subjectAlternativeNameList;
for (k_i = 0, k_cnt = k_subjectAlternativeNameList.length; k_i < k_cnt; k_i++) {
k_item = k_subjectAlternativeNameList[k_i];
if ('DNS' === k_item.name) {
k_data.k_subjectAlternativeNameList = k_item.value.join(';');
break;
}
}
}
for (k_i = 0, k_cnt = k_subjects.length; k_i < k_cnt; k_i++) {
k_item = k_subjects[k_i];
switch(k_item.name) {
case 'hostname':
k_name = 'k_hostname';
break;
case 'organizationName':
k_name = 'k_organization';
break;
case 'organizationalUnitName':
k_name = 'k_unit';
break;
case 'city':
k_name = 'k_location';
break;
case 'state':
k_name = 'k_state';
break;
case 'country':
k_name = 'k_country';
break;
}
k_data[k_name] = k_item.value;
}
if (this.k_isRecreate) {
k_data.k_validFor = this.k_DURATION_YEARS_TEN;
}
this.k_form.k_setData(k_data, true);
this.k_isRecreate = true;
}
};

k_kerioWidget.k_saveData = function() {
var
k_data = this.k_form.k_getData(true),
k_subject = [],
k_subjectAlternativeNameList = [],
k_request;
k_subject = [{
name: 'hostname',
value: k_data.k_hostname
}, {
name: 'organizationName',
value: k_data.k_organization ? k_data.k_organization : ''
}, {
name: 'organizationalUnitName',
value: k_data.k_unit ? k_data.k_unit : ''
}, {
name: 'city',
value: k_data.k_location ? k_data.k_location : ''
}, {
name: 'state',
value: k_data.k_state ? k_data.k_state : ''
}, {
name: 'country',
value: k_data.k_country
}];
if (k_data.k_subjectAlternativeNameList) {
k_subjectAlternativeNameList = [{
name: 'DNS',
value: k_data.k_subjectAlternativeNameList.split(';')
}];
}
k_request = {
k_jsonRpc: {
'method': this.k_relatedGrid.k_config.k_managerName + '.generateEx',
'params': {
type: this.k_certificateType,
name: k_data.k_name || '', subject: k_subject,
period: this.k_getPeriod(this.k_hasDuration ? k_data.k_validFor : this.k_DURATION_CERTIFICATE_REQUEST),
subjectAlternativeNameList: k_subjectAlternativeNameList
}
},

k_callback: function(k_response) {
kerio.lib.k_unmaskWidget(this);
if (k_response.k_isOk) {
kerio.adm.k_framework.k_enableApplyReset(true);this.k_relatedGrid.k_reloadData();
this.k_hide();
}
},
k_scope: this
};
kerio.lib.k_maskWidget(this);
kerio.lib.k_ajax.k_request(k_request);
};

k_kerioWidget.k_getPeriod = function(k_interval) {
var
k_dateToUnixTimestamp = kerio.waw.shared.k_methods.k_dateToUnixTimestamp,
k_localAuthority,
k_localCaValidToDate,
k_localCaValidToTime,
k_validToDate,
k_validToTime,
k_now;
if (this.k_DURATION_CERTIFICATE_REQUEST === k_interval) {
return {
validType: kerio.lib.k_getSharedConstants().kerio_web_NotValidYet,
validFromDate: {
year: 0,
month: 0,
day: 0
},
validFromTime: {
hour: 0,
min: 0
},
validToDate: {
year: 0,
month: 0,
day: 0
},
validToTime: {
hour: 0,
min: 0
}
};
}
k_now = this.k_relatedGrid.k_serverTime;
k_validToDate = {
year: k_now.getFullYear() + k_interval, month: k_now.getMonth(),
day: k_now.getDate()
};
k_validToTime = {
hour: 23, min: 59
};
if (!this.k_isRecreate) {
k_localAuthority = this.k_relatedGrid.k_getLocalAuthority();
k_localCaValidToDate = k_localAuthority.validPeriod.validToDate;
k_localCaValidToTime = k_localAuthority.validPeriod.validToTime;
if (!this.k_isRecreate && k_dateToUnixTimestamp(k_validToDate) >= k_dateToUnixTimestamp(k_localCaValidToDate)) {
k_validToDate = k_localCaValidToDate;
k_validToTime = k_localCaValidToTime;
}
}
return {
validType: kerio.lib.k_getSharedConstants().kerio_web_Valid,
validFromDate: {
year: k_now.getFullYear(), month: k_now.getMonth(),
day: k_now.getDate()
},
validFromTime: {
hour: 0,
min: 0
},
validToDate: k_validToDate,
validToTime: k_validToTime
};
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
this.k_form.k_setVisible('k_validFor', true);
};
}
};