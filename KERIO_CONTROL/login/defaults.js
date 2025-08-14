
var k_defaults = {
k_title: (window.k_activationRequired ? 'Kerio Control Activation' : 'Kerio Control Administration'),
k_name: (window.k_activationRequired ? 'Kerio Control Activation' : 'Kerio Control Administration'),
k_weblibRoot:  '../weblib',
k_css: (window.k_getCss ? window.k_getCss() : [ '../weblib/int/login/control/admin.css' ]),
k_onAfterLoad: (window.k_activationRequired || window.k_autologin
? window.k_updateLogin
: undefined
),
k_upperMessage: (window.k_activationRequired || window.k_autologin
? '<h2 id="k_upperMessage" class="upperMessage"></h2>'  : undefined
),
k_hideRememberMe: true,
k_allowLoginFromUnsupported: true,
k_preloadExtJs: true,
k_favIconUrl: '../img/favicon.ico'
};