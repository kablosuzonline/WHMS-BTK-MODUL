
kerio.waw.ui.tileNews = {
k_init: function(k_objectName, k_initParams) {
var
k_renderTile,
k_form, k_formCfg,
k_tr = kerio.lib.k_tr;
k_formCfg = {
k_items: [
{
k_id: 'k_loading',
k_type: 'k_container',
k_style: 'text-align: center;',
k_items: [{
k_type: 'k_image',
k_value: kerio.lib.k_getSharedConstants('kerio_web_WeblibPath') + '/ext/extjs/resources/images/default/grid/loading.gif?v=8629',
k_width: 16,
k_height: 16
}]
},
{
k_type: 'k_container',
k_id: 'k_onlineContent',
k_isHidden: true,
k_content: new kerio.lib.K_ContentPanel(k_objectName + '_' + 'k_panelOnline', {
k_html: '<iframe src="' + this.k_getUrl() + '" width="100%" height="99%" frameborder="0"></iframe>'
})
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_id: 'k_offlineContent',
k_isHidden: true,
k_value: k_tr('Your browser cannot fetch the news. Check the Internet connectivity.', 'dashboardList'),
k_itemClassName: 'lastFormItem'
}
],
k_tile: k_initParams.k_tile,
k_initTile: function() {
kerio.waw.requests.on('afterConnectivityChecked', this.k_renderTile, this);
if ('' !== kerio.waw.shared.k_DEFINITIONS.k_KB_STATUS.k_status) {
this.k_renderTile();
}
},
k_loadData: function() {
kerio.waw.shared.k_methods.k_checkConnectivityToKb();
}
};

k_renderTile = function() {
var
k_isOnline = kerio.adm.k_framework.k_isKnowledgeBaseAvailable();
this.k_setVisible('k_loading', false);
this.k_setVisible('k_onlineContent', k_isOnline);
this.k_setVisible('k_offlineContent', !k_isOnline);
this.k_setSize({
k_height: k_isOnline ? 400 : 'auto'
});
};
k_form = new kerio.waw.ui.K_WawTileForm(k_objectName, k_formCfg);
k_form.k_addReferences({
k_renderTile: k_renderTile
});
return k_form;
},
k_getUrl: function() {
var k_url = window.location.protocol + '//www.kerio.com/interface/keriocontrol/linux';
return k_url;
}
};
