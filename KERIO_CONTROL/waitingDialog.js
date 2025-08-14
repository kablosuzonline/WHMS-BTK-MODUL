
kerio.waw.ui.waitingDialog = {

k_init: function(k_objectName) {
var
k_DEFAULT_WIDTH = 300,
k_DEFAULT_HEIGHT = 125,
k_form, k_formCfg,
k_dialog, k_dialogCfg;
k_formCfg = {
k_className: 'waitingDialog',
k_items: [
{
k_type: 'k_container',
k_anchor: '0 -32', k_items: [
{
k_type: 'k_display',
k_id: 'k_message',
k_isLabelHidden: true,
k_isSecure: true
}
]
},
{
k_type: 'k_container',
k_height: 32,
k_width: 200,
k_className: 'removeItemsMargin',
k_items: [
{
k_type: 'k_display',
k_id: 'k_waitingContainer',
k_height: 32,
k_width: 200,
k_className: 'waitingContainer',
k_value: [
'<div id="k_waitingUserContainer" class="waitingLeft"></div>',
'<div id="k_waitingDotContainer" class="waitingCenter"></div>',
'<div id="k_waitingServerContainer" class="waitingRight"></div>'
].join(''),
k_isSecure: true
}
]
}
] }; k_form = new kerio.lib.K_Form(k_objectName + '_' + 'k_form', k_formCfg);
k_dialogCfg = {
k_width: k_DEFAULT_WIDTH,
k_height: k_DEFAULT_HEIGHT,
k_isResizable: false,
k_hasHelpIcon: false,
k_content: k_form,
k_className: 'noCloseButton',
k_title: '', k_buttons: [] };
k_dialog = new kerio.lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_isReady: false,
k_message: k_form.k_getItem('k_message')
});
this.k_addControllers(k_dialog);
k_dialog.k_addReferences({
k_hideOrig: k_dialog.k_hide
});
k_dialog.k_hide = function() {
var
k_ajax = kerio.lib.k_ajax,
k_registerRequest = k_ajax._k_registerRequest,
k_defaultOwner = k_ajax._k_defaultOwner || null,
k_ajaxRequestStack = this._k_ajaxRequestStack || [],
k_i, k_cnt;
for (k_i = 0, k_cnt = k_ajaxRequestStack.length; k_i < k_cnt; k_i++) {
k_registerRequest(k_ajaxRequestStack[k_i], k_defaultOwner);
}
this._k_ajaxRequestStack = [];
this.k_hideOrig();
};
return k_dialog;
}, 
k_addControllers: function(k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_applyParams: function(k_message) {
if (!this.k_isReady) {
this._k_getIcons();
}
kerio.waw.requests._k_waitingDialog = this;
this.k_setSize({k_height: 125, k_width: 300});
this.k_extWidget.center();
this.k_form.k_removeClassName('loginWarning');
this.k_message.k_setValue(k_message);
},

_k_getIcons: function() {
var k_img, k_container;
if (false === kerio.waw.requests._k_isWaitingReady) { arguments.callee.defer(30000, this, arguments); return;
}
k_img = document.getElementById('k_waitingUserIcon');
k_container = document.getElementById('k_waitingUserContainer');
k_container.appendChild(k_img);
k_img.className = k_img.className.replace("hidePrecachedImage", "");
k_img = document.getElementById('k_waitingServerIcon');
k_container = document.getElementById('k_waitingServerContainer');
k_container.appendChild(k_img);
k_img.className = k_img.className.replace("hidePrecachedImage", "");
k_img = document.getElementById('k_waitingDotIcon');
k_container = document.getElementById('k_waitingDotContainer');
k_container.appendChild(k_img);
k_img.className = k_img.className.replace("hidePrecachedImage", "");
k_img = null; k_container = null; this.k_isReady = true; },

k_resetOnClose: function() {
kerio.waw.requests._k_waitingDialog = null;
},

k_onGetMainScreen: function(){
var k_windows = kerio.lib._k_windowManager._k_stack, k_myIndex = k_windows.indexOf(this);
if (0 === k_myIndex) { return null; }
return k_windows.get(k_myIndex - 1); }
}); } }; if (!kerio.waw.requests) {
kerio.lib.k_reportError('Internal error: invalid loading order - waw.requests are required!', 'waitingDialog', 'extend');
}
Ext.apply(kerio.waw.requests, {
_k_isWaitingReady:   false,
_k_WAITING_TASK_ID: 'k_waitingTask',
_k_waitingState:    '', _k_WAITING_IDLE:    'k_waitingIdle',
_k_WAITING_START:   'k_waitingStart',
_k_WAITING_WAITING: 'k_waitingNow',
_k_WAITING_RESET:   'k_waitingStop',
_k_WAITING_SHUTDOWN:'k_waitingShutdown',
_k_waitingDialog:    null,
_k_waitingStepCount: 0,
_k_waitingSpeed:     4, _k_waitingMessage:  '',

k_startWaiting: function(k_message) {
if (kerio.waw.activation) {
return; }
if (this._k_WAITING_START === this._k_waitingState) {
return; }
if (!k_message) {
k_message = kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_keepAliveTitle;
}
if (undefined === kerio.waw.shared.k_tasks) {
kerio.waw.shared.k_tasks = new kerio.lib.K_TaskRunner({});
}
if (!kerio.waw.shared.k_tasks.k_isDefined(this._k_WAITING_TASK_ID)) {
kerio.waw.shared.k_tasks.k_add({
k_id: this._k_WAITING_TASK_ID,
k_interval: 100, k_scope: this,
k_run: this._k_waitingStep,
k_startNow: true
});
}
else {
kerio.waw.shared.k_tasks.k_resume(this._k_WAITING_TASK_ID);
}
this._k_waitingState = this._k_WAITING_START;
this._k_waitingMessage = k_message;
}, 
k_startRestart: function(k_isConfigurationImport) {
kerio.waw.status.k_userSettings.k_save(); this.k_sendNow(); this._k_isVeryDangerous = false; this._k_isConfigurationImport = true === k_isConfigurationImport;
this._k_waitingStepCount = 0; this.k_startWaiting(kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_restartTitle);
this._k_waitingState = this._k_WAITING_WAITING;
this.k_stopKeepAlive();
this._k_connectionState = this._k_CONNECTION_RESTART;
this._k_cntQuickResponse = 0;
this._k_sendServices.k_start(this._K_TASK_ID_RESTARTING);
},

_k_hideWaitingDotIcon: function() {
var
element = document.getElementById('k_waitingDotIcon');
if (!element) {
arguments.callee.defer(100, this);
return;
}
document.getElementById('k_waitingDotIcon').style.display = "none";
},

k_startShutdown: function(k_isExpected) {
var
k_shared = kerio.waw.shared,
k_cutOffTrCache = k_shared.k_DEFINITIONS.k_cutOffTrCache,
k_CONSTANTS = k_shared.k_CONSTANTS,
boxEdition = k_shared.k_CONSTANTS.k_SERVER.k_PRODUCT_INFO.boxEdition,
k_title;
this._k_hideWaitingDotIcon();
this._k_waitingStepCount = 0; this._k_isManualSwitch = k_CONSTANTS.bigBox1 === boxEdition || k_CONSTANTS.bigBox2 === boxEdition;if (false !== k_isExpected) {
k_title = this._k_isManualSwitch ? k_cutOffTrCache.k_manualShutdownTitle : k_cutOffTrCache.k_shutdownTitle;
}
else {
k_title = k_cutOffTrCache.k_serverLostTitle;
}
this.k_startWaiting(k_title);
this._k_waitingState = this._k_WAITING_SHUTDOWN;
this.k_stopKeepAlive();
this._k_sendServices.k_stop(this._K_TASK_ID_RESTARTING);
this.k_startWaiting = k_shared.k_methods.k_emptyFunction;
this.k_stopWaiting = k_shared.k_methods.k_emptyFunction;
}, 
k_stopWaiting: function(k_force) {
if (true === k_force) {
this._k_connectionState = this._k_CONNECTION_TRY;
}
if (this._k_WAITING_IDLE !== this._k_waitingState) { this._k_waitingState = this._k_WAITING_RESET; }
}, 
k_reportRestartFail: function() {
this.k_stopWaiting(true);
this.k_startKeepAlive();
this._k_connectionState = this._k_CONNECTION_OK;
this._k_isRequestPending = false;
this._k_sendServices.k_stop(this._K_TASK_ID_RESTARTING);
},

_k_waitingStep: function() {
var
k_el;
if (this._k_WAITING_RESET === this._k_waitingState) {
if (this._k_CONNECTION_RESTART !== this._k_connectionState) {
this._k_waitingState = this._k_WAITING_IDLE;
if (this._k_waitingDialog) { this._k_waitingDialog.k_hide();
}
return false; }
}
if (this._k_WAITING_START === this._k_waitingState) { this._k_waitingState = this._k_WAITING_WAITING;
this._k_waitingStepCount = -50; if (this._k_waitingDialog) {
this._k_waitingDialog.k_hide();
}
return;
}
if (0 > this._k_waitingStepCount) {
this._k_waitingStepCount++;
return; }
if (0 === this._k_waitingStepCount) { kerio.lib.k_ui.k_showDialog({
k_sourceName: 'waitingDialog',
k_params: this._k_waitingMessage
});
if (this._k_isManualSwitch && this._k_waitingDialog) {
this._k_waitingDialog.k_setSize({ k_width: 400 });
this._k_waitingDialog.k_extWidget.center();
this._k_waitingDialog.k_form.k_addClassName('manualShutdown');
}
}
if (this._k_WAITING_SHUTDOWN === this._k_waitingState) {
k_el = document.getElementById('k_waitingServerContainer');
k_el = new Ext.Element(k_el);
k_el.setOpacity(0.1, {duration:5});
Ext.getBody().addClass('hideAll');
return false;
}
if (this._k_isVeryDangerous && 200 === this._k_waitingStepCount && this._k_waitingDialog) {
this._k_waitingDialog.k_setSize({k_height: 200, k_width: 500});
this._k_waitingDialog.k_extWidget.center();
this._k_waitingDialog.k_form.k_addClassName('loginWarning');
this._k_waitingDialog.k_message.k_setValue(kerio.waw.shared.k_DEFINITIONS.k_cutOffTrCache.k_veryDangerousTitle);
}
this._k_waitingStepCount++;
}, 
_k_cacheWaitingDialogImages: function() {
var
k_isRetina = 1.49 < window.devicePixelRatio;
if (this._k_isWaitingReady) {
return;
}
if (!document.body) {
arguments.callee.defer(100, this, arguments); return false;
}
var k_el;
k_el = document.createElement('img');
k_el.src = k_isRetina ? "img/user_big@2x.png?v=8629" : "img/user_big.png?v=8629";
k_el.width = k_isRetina ? "50%" : "100%";
k_el.id = "k_waitingUserIcon";
k_el.className = "bigIcon hidePrecachedImage";
document.body.appendChild(k_el);
k_el = document.createElement('img');
k_el.src = k_isRetina ? "img/server_big@2x.png?v=8629" : "img/server_big.png?v=8629";
k_el.width = k_isRetina ? "50%" : "100%";
k_el.id = "k_waitingServerIcon";
k_el.className = "bigIcon hidePrecachedImage";
document.body.appendChild(k_el);
k_el = document.createElement('img');
k_el.src = k_isRetina ? "img/waiting@2x.gif?v=8629" : "img/waiting.gif?v=8629";
k_el.width = k_isRetina ? "50%" : "100%";
k_el.id = "k_waitingDotIcon";
k_el.className = "progressIcon hidePrecachedImage";
document.body.appendChild(k_el);
this._k_waitingState = this._k_WAITING_IDLE;
this._k_isWaitingReady = true;
} });
