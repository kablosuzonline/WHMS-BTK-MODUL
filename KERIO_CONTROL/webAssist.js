if (window.k_webAssist) { window.k_webAssist.k_showIframe_orig = window.k_webAssist.k_showIframe;
window.k_webAssist.k_openWindow_orig = window.k_webAssist.k_openWindow;
window.k_webAssist.k_showIframe = function() {
this.k_showIframe_orig();
this.k_showDetails(window.document.getElementById('webAssist').contentDocument || window.document.getElementById('webAssist').contentWindow.document);
};
window.k_webAssist.k_openWindow = function() {
this.k_openWindow_orig();
this.k_showDetails(this.k_window.document);
};
}
