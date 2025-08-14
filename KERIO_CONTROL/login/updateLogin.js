

window.k_updateLogin = function() {
var
k_isSupported = kerio.lib.k_browserInfo.k_isSupported(k_defaults.k_supportedBrowsers),
k_needLogin = window.k_activationNeedLogin,
k_upperMessage   = document.getElementById('k_upperMessage'),
k_loginContainer = document.getElementById('body-container'),
k_nextContainer,
k_probeImage,
k_nextMessage;
if (window.k_activationRequired) {
k_upperMessage.innerHTML = kerio.lib.k_tr('Product activation is required.', 'wlibLoginPage');
k_upperMessage.style.textAlign = 'center';
k_upperMessage.style.margin = '0 0 30px';
k_upperMessage.style.textShadow = '1px 1px 2px rgba(150,150,150,0.6)';
if (!k_needLogin) {
k_nextMessage = (k_isSupported
? kerio.lib.k_tr('Continue with activation…', 'wlibLoginPage') : kerio.lib.k_tr('I understand the risks and I want to continue with activation…', 'wlibLoginPage'));
k_nextContainer = document.createElement('div');
k_nextContainer.id = 'continue-container';
k_nextContainer.innerHTML = '<a href="../internal/dologin.php">' + k_nextMessage + '</a>';
k_loginContainer.appendChild(k_nextContainer);
} }
else if (window.k_autologin){
k_upperMessage.innerHTML = kerio.lib.k_tr('Contacting the Kerio Directory server, please wait a few seconds…', 'wlibLoginPage')
+ '<br>'
+ kerio.lib.k_tr('If you are not redirected, click on this', 'wlibLoginPage') + ' ' + '<a href="' + window.k_autologin.failsafeUrl + '">'
+ kerio.lib.k_tr('link', 'wlibLoginPage')
+ '</a>';
k_probeImage = document.createElement('img');
k_probeImage.id = 'probeImg';
k_probeImage.src = window.k_autologin.probeUrl;
k_probeImage.onload = function(){
delete window.k_autologin.failsafeUrl;
window.location = window.k_autologin.autologinUrl;
};
k_loginContainer.appendChild(k_probeImage);
window.setTimeout(function() {
if (window.k_autologin.failsafeUrl) {
window.location = window.k_autologin.failsafeUrl;
}
}, window.k_autologin.timeout);
}
document.getElementById('username').addEventListener( "invalid", function( event ) {
event.preventDefault();
});
};

window.k_getCss = function(){
var
k_isSupported = !window.k_unsupportedBrowser,
k_css = [];
if (window.k_autologin) {
return [
'autologin.css'
];
}
else {
k_css.push('../weblib/int/login/control/admin.css');
if (!window.k_activationNeedLogin && !k_isSupported) {
k_css.push('unsupported.css');
}
return k_css;
}
}