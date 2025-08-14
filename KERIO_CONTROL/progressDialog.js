
kerio.waw.ui.progressDialog = {
k_init: function (k_objectName) {
var
k_isRetina = 1.49 < window.devicePixelRatio,
k_tr = kerio.lib.k_tr,
k_text,
k_dialogCfg,
k_dialog,
k_formCfg,
k_form;
k_formCfg = {
k_items: [
{
k_type: 'k_container',
k_items: [
{
k_type: 'k_display',
k_id: 'k_title',
k_value: '',
k_isLabelHidden: true,
k_style: 'text-align: center; font-size: 12px;'
},
{
k_type: 'k_display',
k_value: '',
k_className: 'progressDlgImg',
k_isSecure: true,
k_template: '<div class="progressDlgImgCont"><div class="progressDlgImg1"></div><div class="progressDlgImg2"></div><div class="progressDlgImg3"></div></div>',
}
]
}
]
};
k_form = new kerio.lib.K_Form(k_objectName + '_' + 'k_form', k_formCfg);
k_dialogCfg = {
k_height: 140,
k_width: 450,
k_title: '',
k_content: k_form,
k_hasHelpIcon: false,
k_className: 'noCloseButton progressDlg',
k_buttons: []
};
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_form: k_form
});
return k_dialog;
}, k_addControllers: function (k_kerioWidget) {

k_kerioWidget.k_applyParams = function (k_params) {
var k_params = k_params || {},
k_text = k_params.k_text || '',
k_onShow = k_params.k_onShow || function(){};
this.k_form.k_getItem('k_title').k_setValue(k_text);
k_onShow(k_kerioWidget);
};
}
};
