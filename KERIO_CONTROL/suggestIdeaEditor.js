
kerio.waw.ui.suggestIdeaEditor = {
k_init: function(k_objectName) {
var
k_tr = kerio.lib.k_tr,
k_dialogCfg, k_dialog,
k_formCfg, k_form;
k_formCfg = {
k_items: [
{
k_type: 'k_display',
k_value: k_tr('You are going to suggest your first idea.', 'suggestIdeaEditor')
},
{
k_type: 'k_display',
k_height: 10
},
{
k_type: 'k_display',
k_value: k_tr('You will be redirected to the idea management website.', 'suggestIdeaEditor')
},
{
k_type: 'k_display',
k_height: 10
},
{
k_type: 'k_display',
k_value: k_tr('Optionally, provide your name and email to track your suggestions and receive weekly email updates on the items you submitted or have interacted with.', 'suggestIdeaEditor')
},
{
k_type: 'k_display',
k_height: 20
},
{
k_id: 'name',
k_caption: k_tr('Your name:', 'suggestIdeaEditor'),
k_maxLength: 127,
k_checkByteLength: true
},
{
k_id: 'email',
k_caption: k_tr('Email address:', 'suggestIdeaEditor'),
k_maxLength: kerio.waw.shared.k_CONSTANTS.k_MAX_LENGTH.k_EMAIL_ADDRESS,
k_validator: {
k_functionName: 'k_isEmail'
}
}
]
};
k_form = new kerio.lib.K_Form(k_objectName + '_k_form' , k_formCfg);
k_dialogCfg = {
k_width: 380,
k_height: 400,
k_title: k_tr('Suggest Idea', 'suggestIdeaEditor'),
k_content: k_form,
k_defaultItem: 'name',
k_onOkClick: function() {
var
k_data = this.k_dialog.k_form.k_getData(),
k_request;
k_request = {
k_jsonRpc: {
method: 'UserVoice.set',
params: {
settings: k_data
}
},
k_callback: function(k_response) {
if (!k_response.k_isOk) {
return;
}
this.k_getUrl();
},
k_scope: this.k_dialog
};
kerio.lib.k_ajax.k_request(k_request);
}
};
k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form
});
this.k_addControllers(k_dialog);
return k_dialog;
},

k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
};

k_kerioWidget.k_getUrl = function() {
var
k_request;
k_request = {
k_jsonRpc: {
method: 'UserVoice.getUrl'
},
k_callback: this.k_getUrlCallback,
k_scope: this
};
kerio.lib.k_ajax.k_request(k_request);
};
k_kerioWidget.k_getUrlCallback = function(k_response) {
this.k_hide();
if (k_response.k_isOk) {
kerio.lib.k_openWindow(k_response.k_decoded.url);
}
};}};