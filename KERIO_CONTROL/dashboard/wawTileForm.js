

kerio.waw.ui.K_WawTileForm = function(k_id, k_config) {
k_config = k_config || {};
if (k_config.k_loadData) {
k_config.k_loadData = k_config.k_loadData.createInterceptor(this._k_isRefreshAllowed, this);
}
kerio.waw.ui.K_WawTileForm.superclass.constructor.call(this, k_id, k_config);
};
kerio.lib.k_extend('kerio.waw.ui.K_WawTileForm', kerio.adm.k_widgets.K_TileForm,
{
k_show: function() {
kerio.waw.ui.K_WawTileForm.superclass.k_show.call(this, arguments);
if (this._k_handlers.k_notificationsCallback) {
kerio.waw.requests.on('notificationUpdate', this.k_notificationsCallback, this);
}
},
k_onActivate: function() {
if (true === this._k_isClosed) {
return;
}
if (this._k_handlers.k_notificationsCallback) {
kerio.waw.requests.on('notificationUpdate', this.k_notificationsCallback, this);
}
kerio.waw.ui.K_WawTileForm.superclass.k_onActivate.call(this, arguments);
},
k_onDeactivate: function() {
kerio.waw.requests.k_abortByOwner(this);
if (this._k_handlers.k_notificationsCallback) {
kerio.waw.requests.removeListener('notificationUpdate', this.k_notificationsCallback, this);
}
kerio.waw.ui.K_WawTileForm.superclass.k_onDeactivate.call(this, arguments);
},

_k_isRefreshAllowed: function() {
return kerio.waw.requests.k_isConnectionOk();
}
});
