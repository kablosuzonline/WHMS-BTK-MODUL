kerio.login = {

_k_buildHash: '?v=8629',

k_load: function(k_config) {
var k_i;
for (k_i=0; k_i < k_config.k_css.length; k_i++) {
this.k_loadCss(k_config.k_css[k_i]);
}
for (k_i=0; k_i < k_config.k_js.length; k_i++) {
this.k_loadJs(k_config.k_js[k_i]);
}
},

k_loadJs: function(k_path) {
document.write('<script type="text/javascript" src="' + this._k_addBuildHash(k_path) + '"></'+'script>');
},

_k_createLinkTag: function (k_config) {
document.write('<link href="' + this._k_addBuildHash(k_config.href) + '" rel="' + k_config.rel + '" type="' + k_config.type + '">');
},

k_loadCss: function(k_path) {
var k_linkCfg;
k_linkCfg = {
type: 'text/css',
rel: 'stylesheet',
href: k_path,
media: 'screen'
};
this._k_createLinkTag(k_linkCfg);
},

_k_initFavIcon: function(k_path) {
var k_linkCfg;
k_linkCfg = {
type: 'image/vnd.microsoft.icon',
rel: 'shortcut icon',
href: k_path
};
this._k_createLinkTag(k_linkCfg);
},

_k_initHomeScreenIcon: function(k_path) {
document.write('<meta name="apple-mobile-web-app-capable" content="yes">');
document.write('<link rel="apple-touch-icon" href="' + this._k_addBuildHash(k_path) + '">');
},

k_init: function () {
var
k_weblibRoot = k_defaults.k_weblibRoot || '/weblib',
k_favIconUrl = k_defaults.k_favIconUrl || '../img/favicon.ico?v=8629',
k_iOsAppIcon = k_defaults.k_iOsAppIcon || '../img/appleTouchIcon.png?v=8629',
k_filesToLoad;
try {  window.onload = function () {
kerio.login.k_loginDialog.k_init();
};
}
catch (e) {}
if ('iPad' === navigator.platform) {
this._k_initHomeScreenIcon(k_iOsAppIcon);
}
this._k_initFavIcon(k_favIconUrl);
k_filesToLoad = {
k_js: [
k_weblibRoot + '/int/lib/login.js',
k_weblibRoot + '/int/login/script.js'
].concat(k_defaults.k_scripts || []),
k_css: [
k_weblibRoot + '/int/login/style.css'
].concat(k_defaults.k_css)
};
this._k_weblibRoot = k_weblibRoot;
this.k_load(k_filesToLoad);
},

_k_addBuildHash: function(k_url) {
if (-1 === k_url.indexOf(this._k_buildHash)) {
k_url += this._k_buildHash;
}
return k_url;
},

k_initTranslations: function (k_langConfig) {
var
k_language,
k_pathToTranslations = k_defaults.k_pathToTranslations || '../translations';
kerio.lib.k_setSupportedLanguages(k_langConfig._k_supportedLanguages);
k_language = kerio.lib.k_getCalculatedLanguage(k_langConfig._k_acceptedLanguages);
this.k_loadJs(k_pathToTranslations + '/' + k_language + '_login.js');
},

k_getUrlParams: function() {
var
k_output = {},
k_params,
k_i,
k_splittedItem,
k_searchString;
k_searchString = location.search.replace('?', '');
if (!k_searchString) {
return k_output;
}
k_params = k_searchString.split('&');
for (k_i = 0; k_i < k_params.length; k_i++) {
k_splittedItem = k_params[k_i].split('=');
k_output[k_splittedItem[0]] = k_splittedItem[1];
}
return k_output;
}
};
kerio.login.k_init();