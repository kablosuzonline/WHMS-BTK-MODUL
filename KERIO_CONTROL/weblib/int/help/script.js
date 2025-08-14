

kerio.help = {
_k_KB_URL: 'http://kb.kerio.com/',
_k_isMSIE7: /msie/i.test(navigator.userAgent) && !window.XDomainRequest,
_k_isInitailized: false,
k_header: null,
k_iframe: null,

k_init: function(k_languageHelp) {
var
k_urlParams = this.k_getUrlParams(),
k_tr = kerio.lib.k_tr;
this.k_languageHelp = k_languageHelp;
this._k_isInitailized = true;
this.k_iframe = document.getElementById('contentIFrm');
this.k_header = document.getElementById('helpHeader');
this.k_urlParams = k_urlParams;
this._k_weblibRoot = kerio.help.k_config.k_weblibRoot || '/';
if (this._k_isMSIE7) {
document.getElementsByTagName('html')[0].style.overflow = 'hidden';  }
this.k_fullProductName = document.getElementsByTagName('title')[0].innerHTML;
this.k_currentLocation = document.getElementById('currentLocation');
this.k_contentLink = document.getElementById('contentLink');
this.k_trHelp = k_tr('Help', 'wlibHelpPage');
this.k_contentLink.innerHTML = this.k_trHelp;
document.getElementById('trKnowledgeBase').innerHTML = k_tr('Knowledge Base', 'wlibHelpPage');
document.getElementById('trPrint').innerHTML = k_tr('Print', 'wlibCommon');
this.k_initTableOfContents();
if ('list' === k_urlParams.content) {
this.k_showTableOfContents();
}
else {
this.k_iframe.src = this.k_languageHelp + '/' + k_urlParams.k_mappedContent;
}
window.onresize = this.k_resizeInframe;
},

k_resizeInframe: function(){
kerio.help.k_iframe.style.paddingTop = (kerio.help.k_header.clientHeight + 10) + 'px';
kerio.help.k_iframe.style.height = document.documentElement.clientHeight + 'px';
if (kerio.help._k_isMSIE7) {
kerio.help._k_fixIE7Layout();
}
},

k_getUrlParams: function() {
var
k_urlParams = {content: 'list'},
k_location = window.location,
k_params = k_location.search.substr(1).split('&'),
k_config = kerio.help.k_config,
k_item,
k_currentContent,
k_currentHtmlPage,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_params.length; k_i < k_cnt; k_i++) {
k_item = k_params[k_i].split('=');
k_urlParams[k_item[0]] = k_item[1];
}
k_urlParams.buildversion = k_urlParams.buildversion || '';
k_urlParams.buildversion.replace('#', '');
k_urlParams.k_absolutePath = k_location.pathname;
k_urlParams.k_platformPrefix = k_urlParams.platform ? k_urlParams.platform + '-' : '';
if ('legalNotice' !== k_urlParams.content) {
k_urlParams.content = 'defaultPage';
}
k_currentContent = k_config.k_content[k_urlParams.content];
if (k_currentContent) {
if(k_currentContent.k_usePlatform) {
k_currentHtmlPage = k_currentContent.k_htmlPage.split('#');
if (2 == k_currentHtmlPage.length) {
k_urlParams.k_mappedContent = k_urlParams.k_platformPrefix + k_currentHtmlPage[0] + '#' + k_urlParams.k_platformPrefix + k_currentHtmlPage[1];
}
else {
k_urlParams.k_mappedContent = k_urlParams.k_platformPrefix + k_currentContent.k_htmlPage;
}
}
else {
k_urlParams.k_mappedContent = k_currentContent.k_htmlPage;
}
}
else {
k_urlParams.content = 'list';
k_urlParams.k_mappedContent = 'list';
}
return k_urlParams;
}, 
k_getIframeDocument: function() {
return this.k_iframe.contentWindow.document;
},

k_showTableOfContents: function(k_event) {
if (!top.kerio.help._k_isInitailized) {
return;  }
if (k_event) {  this._k_preventDefault(k_event);
}
if (!this._k_isTableOfContents()) {
this.k_iframe.contentWindow.location.assign(this._k_weblibRoot +'weblib/int/help/tableOfContents.html');
return;
}
this.k_contentLink.style.display = 'none';
this.k_getIframeDocument().getElementsByTagName('body')[0].innerHTML = this.k_tableOfContents;
this.k_afterIframeLoaded();
},

_k_isTableOfContents: function() {
return -1 !== this.k_iframe.contentWindow.location.href.indexOf('tableOfContents.html');
},

_k_getPageUrl: function(k_contentItem) {
var k_page = k_contentItem.k_htmlPage;
if (k_contentItem.k_usePlatform) {
k_page = this.k_urlParams.k_platformPrefix + k_page;
}
return this.k_urlParams.k_absolutePath + this.k_languageHelp + '/' + k_page;
},

k_initTableOfContents: function() {
var
k_content = kerio.help.k_config.k_content,
k_htmlOutput = [],
k_item;
for (k_item in k_content) {
if (k_content[k_item].k_contentText) {
if ('legalNotice' === k_item) {
k_htmlOutput.push('<br>'); }
k_htmlOutput.push('<a href="', this._k_getPageUrl(k_content[k_item]), '">',
k_content[k_item].k_contentText, '<\/a><br>');
}
}
this.k_tableOfContents = '<div id="printdiv">' + this.k_fullProductName + '<hr>' + '<\/div>'
+ '<h2 class="title">' + this.k_fullProductName + '<\/h2>' + '<p>' + k_htmlOutput.join('') +'<\/p>';
}, 
k_printIframe: function() {
kerio.help.k_getIframeDocument().body.focus();
kerio.help.k_iframe.contentWindow.print();
},

k_afterIframeLoaded: function() {
var k_caption;
if (!this._k_isInitailized) {
return;
}
if (this._k_isTableOfContents()) {
this.k_currentLocation.innerHTML = this.k_trHelp;
this.k_contentLink.style.display = 'none';
}
else {
k_caption = this.k_getIframeDocument().getElementsByTagName('title')[0].innerHTML;
this.k_currentLocation.innerHTML = '&gt; ' + k_caption;
this.k_contentLink.style.display = '';
}
this.k_resizeInframe();
},

k_showKnowledgeBase: function(k_event) {
var
k_link = k_event.target || k_event.srcElement,
k_href = k_link.href,
k_manual;
this._k_preventDefault(k_event);
if ('trKnowledgeBase' == k_link.id) {  if (this._k_isTableOfContents()) {
k_href = this._k_KB_URL + '?ln=' + this.k_languageHelp;
}
else {
k_link = this.k_getIframeDocument().getElementById('kbArticle');
k_href = k_link.getElementsByTagName('a')[0].href;
}
}
window.open(k_href, '_blank', 'toolbar,location,directories,status,menubar,scrollbars,copyhistory,resizable');
}, 
_k_preventDefault: function(k_event) {
if (k_event.preventDefault) {
k_event.preventDefault();
} else {
k_event.returnValue = false;
}
},

_k_fixIE7Layout: function() {
kerio.help.k_iframe.style.height = document.body.offsetHeight - 50 + 'px';
kerio.help.k_iframe.style.width = document.body.offsetWidth - 8 + 'px';
}
}; 