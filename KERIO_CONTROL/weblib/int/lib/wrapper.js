

Ext.lib.Ajax._k_abortOrig = Ext.lib.Ajax.abort;
Ext.lib.Ajax._k_isCallInProgressOrig = Ext.lib.Ajax.isCallInProgress;
Ext.lib.Ajax._k_isCallInProgressForAbort = function(o) {
return o.conn;
};

Ext.lib.Ajax.abort = function(o, callback, isTimeout) {
var k_ret;
if (isTimeout) {
if (callback && callback.argument && callback.argument.options && callback.argument.options._kx) {
callback.argument.options._kx.k_isTimeout = true;
}
return this._k_abortOrig(o, callback, isTimeout);
}
this.isCallInProgress = this._k_isCallInProgressForAbort;
k_ret = this._k_abortOrig(o, callback, isTimeout);
this.isCallInProgress = this._k_isCallInProgressOrig;
return k_ret;
};

Ext.data.Connection.prototype.doFormUpload = function(o, ps, url){
var id = Ext.id(),
doc = document,
frame = doc.createElement('iframe'),
form = Ext.getDom(o.form),
hiddens = [],
hd,
encoding = 'multipart/form-data',
buf = {
target: form.target,
method: form.method,
encoding: form.encoding,
enctype: form.enctype,
action: form.action
},
cb;

Ext.fly(frame).set({
id: id,
name: id,
cls: 'x-hidden',
src: Ext.SSL_SECURE_URL
});
doc.body.appendChild(frame);
if(Ext.isIE){
document.frames[id].name = id;
}
Ext.fly(form).set({
target: id,
method: 'POST',
enctype: encoding,
encoding: encoding,
action: url || buf.action
});
Ext.iterate(Ext.urlDecode(ps, false), function(k, v){
hd = doc.createElement('input');
Ext.fly(hd).set({
type: 'hidden',
value: v,
name: k
});
form.appendChild(hd);
hiddens.push(hd);
});
if (kerio.lib.k_isMyKerio) {

cb = function(k_extEvent) {
var
me = this,
k_data = k_extEvent.browserEvent.data,
r = {responseText : typeof k_data === 'object' ? JSON.stringify(k_data) : k_data,
responseXML : null,
argument : o.argument};
Ext.EventManager.removeListener(window, 'message', cb, me);
me.fireEvent("requestcomplete", me, r, o);
function runCallback(fn, scope, args){
if(Ext.isFunction(fn)){
fn.apply(scope, args);
}
}
runCallback(o.success, o.scope, [r, o]);
runCallback(o.callback, o.scope, [o, true, r]);
if(!me.debugUploads){
setTimeout(function(){Ext.removeNode(frame);}, 100);
}
};
Ext.EventManager.addListener(window, 'message', cb, this);
}
else {
function cb(){
var me = this,
r = {responseText : '',
responseXML : null,
argument : o.argument},
doc,
firstChild;
try{
doc = frame.contentWindow.document || frame.contentDocument || window.frames[id].document;
if(doc){
if(doc.body){
if(/textarea/i.test((firstChild = doc.body.firstChild || {}).tagName)){ r.responseText = firstChild.value;
}else{
r.responseText = doc.body.innerHTML;
}
}
r.responseXML = doc.XMLDocument || doc;
}
}
catch(e) {}
Ext.EventManager.removeListener(frame, 'load', cb, me);
me.fireEvent("requestcomplete", me, r, o);
function runCallback(fn, scope, args){
if(Ext.isFunction(fn)){
fn.apply(scope, args);
}
}
runCallback(o.success, o.scope, [r, o]);
runCallback(o.callback, o.scope, [o, true, r]);
if(!me.debugUploads){
setTimeout(function(){Ext.removeNode(frame);}, 100);
}
}
Ext.EventManager.on(frame, 'load', cb, this);
}
form.submit();
Ext.fly(form).set(buf);
Ext.each(hiddens, function(h) {
Ext.removeNode(h);
});
};


if (Ext.isWebKit) {

Ext.Button.prototype.onClick = Ext.Button.prototype.onClick.createSequence(function () {
this.btnEl.focus();
});
} 

if (Ext.isIE) {

Ext.layout.ColumnLayout.prototype.getLayoutTargetSize = function() {
var target = this.container.getLayoutTarget(), ret;
if (target) {
ret = target.getViewSize();
if (Ext.isIE && Ext.isStrict && 0 === ret.width){
if (this.container._kx && false === this.container._kx.k_owner.k_isVisible()) {
ret = {width: 0, height: 0};
}
else {
ret =  target.getStyleSize();
}
}
ret.width -= target.getPadding('lr');
ret.height -= target.getPadding('tb');
}
return ret;
};
}



Ext.form.ComboBox.prototype.k_getIndexByDataValue = function(k_fieldName, k_value) {
var
k_data = this.store.data.items,
k_cnt = k_data.length,
k_i;
if (k_cnt > 0) {
for (k_i = 0; k_i < k_cnt; k_i++) {
if(k_data[k_i].data[k_fieldName] == k_value){
return k_i;
}
}
}
return -1;
};


Ext.form.ComboBox.prototype.assertValue = function(){
var val = this.getRawValue(),
rec;
if(this.valueField && Ext.isDefined(this.value)){
rec = this.findRecord(this.valueField, this.value);
}
if(!rec || rec.get(this.displayField) != val){
rec = this.findRecord(this.displayField, val);
}
if(!rec && this.forceSelection){
if(val.length > 0 && val != this.emptyText){
this.el.dom.value = Ext.value(this.lastSelectionText, '');
this.applyEmptyText();
}else{
this.clearValue();
}
}else{
if(rec && this.valueField){
if (this.value == val){
return;
}
val = rec.get(this.valueField || this.displayField);
}
this.setValue(val);
}
};



Ext.Container.prototype.bufferResize = false;



Ext.form.DateField.prototype.onTriggerClick = function(){
if(this.disabled){
return;
}
if(this.menu == null){
this.menu = new Ext.menu.DateMenu({
hideOnClick: false,
focusOnSelect: false
});
}
this.onFocus();
Ext.apply(this.menu.picker,  {
minDate : this.minValue,
maxDate : this.maxValue,
disabledDatesRE : this.disabledDatesRE,
disabledDatesText : this.disabledDatesText,
disabledDays : this.disabledDays,
disabledDaysText : this.disabledDaysText,
format : this.format,
showToday : this.showToday,
minText : String.format(this.minText, this.formatDate(this.minValue)),
maxText : String.format(this.maxText, this.formatDate(this.maxValue)),
startDay: this.startDay });
this.menu.on(Ext.apply({}, this.menuListeners, { scope:this
}));
this.menu.picker.setValue(this.getValue() || new Date());
this.menu.show(this.el, "tl-bl?");
this.menuEvents('on');
};


if (Ext.isGecko) {

Ext.Editor.prototype.onRender = Ext.Editor.prototype.onRender.createSequence(function () {
this.field.el.on('keydown', function (k_extEvent) {
if (k_extEvent.ESC === k_extEvent.getKey()) {
k_extEvent.preventDefault();
}
});
});
}



Ext.grid.EditorGridPanel.prototype._k_origStartEditing = Ext.grid.EditorGridPanel.prototype.startEditing;
Ext.grid.EditorGridPanel.prototype.startEditing = function () {
if (!this.activeEditor || (this.activeEditor && this.activeEditor.field._kx.k_owner.k_isValid())) {
this._k_origStartEditing.apply(this, arguments);
}
};


if (Ext.isIE || Ext.isWebKit) {

Ext.Element.prototype.unmask = function() {
var me = this,
dom = me.dom,
XMASKEDRELATIVE = "x-masked-relative",
XMASKED = "x-masked",
data = Ext.Element.data,
mask = data(dom, 'mask'),
maskMsg = data(dom, 'maskMsg'),
k_maskEl;
if(mask){
if(maskMsg){
maskMsg.remove();
data(dom, 'maskMsg', undefined);
}
k_maskEl = mask.dom;
k_maskEl.style.cursor = 'default';
if (Ext.isWebKit) {
k_maskEl.style.overflow = 'hidden';
k_maskEl.innerHTML = '<div style="width: 3000px; height: 3000px"/>';
k_maskEl.scrollLeft = 200;
}
mask.remove();
data(dom, 'mask', undefined);
}
me.removeClass([XMASKED, XMASKEDRELATIVE]);
};
} if (Ext.isWebKit) {

Ext.Element.prototype.getStyle = function(prop){
var el = this.dom,
v,
cs,
out,
display,
wk = Ext.isWebKit,
k_isWebKitFixApplied = false;
if(el == document){
return null;
}
prop = kerio.lib._extPublished['Ext.Element.chkCache'](prop);
if(wk && /marginRight/.test(prop)){
display = this.getStyle('display');
if ('none' !=  display && 'inline-block' != display) {
this.addClass('fixWebKitRightMarginSize');
k_isWebKitFixApplied = true;
}
}
out = (v = el.style[prop]) ? v :
(cs = document.defaultView.getComputedStyle(el, "")) ? cs[prop] : null;
if(wk){
if (out == 'rgba(0, 0, 0, 0)') {
out = 'transparent';
}
else if (k_isWebKitFixApplied) {
this.removeClass('fixWebKitRightMarginSize');
}
}
return out;
};
}
if (Ext.isGecko || Ext.isChrome || Ext.isSafari) {
kerio.lib.k_todo('Ext.Element.prototype.getWidth - Firefox 20.0.1, so this fix can be used only for older version of FF. Needed for Chrome 37');

Ext.Element.prototype.getWidth = function(contentWidth){
var w = this.dom.offsetWidth || 0;
var k_clientRect = this.dom.getBoundingClientRect(),
k_right = Math.abs(k_clientRect.right);
if (k_right > parseInt(k_right, 10)) {  w++;
}
w = contentWidth !== true ? w : w-this.getBorderWidth("lr")-this.getPadding("lr");
return w < 0 ? 0 : w;
};
}
if (kerio.lib.k_isMSIE8 || kerio.lib.k_isMSIE9 || kerio.lib.k_isMSIE10) {

Ext.Element.prototype.mask = function(msg, msgCls) {
var me = this,
dom = me.dom,
dh = Ext.DomHelper,
EXTELMASKMSG = "ext-el-mask-msg",
XMASKEDRELATIVE = "x-masked-relative",
XMASKED = "x-masked",
data = Ext.Element.data,
el,
mask;
if(!/^body/i.test(dom.tagName) && me.getStyle('position') == 'static'){
me.addClass(XMASKEDRELATIVE);
}
if((el = data(dom, 'maskMsg'))){
el.remove();
}
if((el = data(dom, 'mask'))){
el.remove();
}
mask = dh.append(dom, {cls : "ext-el-mask"}, true);
data(dom, 'mask', mask);
me.addClass(XMASKED);
mask.setDisplayed(true);
if(typeof msg == 'string'){
var mm = dh.append(dom, {cls : EXTELMASKMSG, cn:{tag:'div'}}, true);
data(dom, 'maskMsg', mm);
mm.dom.className = msgCls ? EXTELMASKMSG + " " + msgCls : EXTELMASKMSG;
mm.dom.firstChild.innerHTML = msg;
mm.setDisplayed(true);
mm.center(me);
}

return mask;
};
} if (kerio.lib.k_isMSIE9 || kerio.lib.k_isMSIE10) {

Ext.Element.prototype.getAttribute = function(name, ns){
var d = this.dom;
return d.getAttribute(ns + ":" + name) || d[name];
};

Ext.Element.prototype.getStyle = function(prop) {
var el = this.dom,
opacityRe = new RegExp('alpha\\(opacity=(.*)\\)', 'i'),
m,
cs;
if(el === document) {
return null;
}
if (prop === 'opacity') {
if (el.style.filter.match) {
if(m = el.style.filter.match(opacityRe)){
var fv = parseFloat(m[1]);
if(!isNaN(fv)){
return fv ? fv / 100 : 0;
}
}
}
return 1;
}
prop = kerio.lib._extPublished['Ext.Element.chkCache'](prop);
return el.style[prop] || ((cs = el.currentStyle) ? cs[prop] : null);
};
Ext.Element.prototype._k_origGetWidth = Ext.Element.prototype.getWidth;

Ext.Element.prototype.getWidth = function(contentWidth){
var
k_realWidth,
k_width;
k_width = Ext.Element.prototype._k_origGetWidth.call(this, contentWidth);
k_realWidth = parseFloat(document.defaultView.getComputedStyle(this.dom, '').width);
if (!isNaN(k_realWidth) && k_realWidth > Math.floor(k_realWidth)) {  k_width += 1;
}
return k_width;
};
}


if (Ext.isGecko) {

Ext.lib.Event.resolveTextNode = function(node){
var k_node;
if(!node){
return;
}
var s = window.HTMLElement.prototype.toString.call(node);
if(s === '[xpconnect wrapped native prototype]' || s === '[object XULElement]'){
return;
}
try {
k_node = 3 === node.nodeType ? node.parentNode : node;
}
catch (k_e) {}
return k_node;
};
}



Ext.EventObjectImpl.prototype.isSpecialKey = function () {
var k = this.normalizeKey(this.keyCode);
return (this.type === 'keypress' && this.ctrlKey) ||
this.isNavKeyPress() ||
(k === this.BACKSPACE) || (k >= 16 && k <= 20) || (Ext.isMac && k === 224) || (k >= 44 && k <= 46);   };



Ext.grid.GridPanel.prototype.doLayout = Ext.grid.GridPanel.prototype.doLayout.createSequence(function () {
var
k_view = this.view,
k_gridElSize;
if (!k_view || !k_view.mainBody) {
return; }
k_gridElSize = this.getGridEl().getSize(true);
if (!(k_gridElSize.width < 20 || k_gridElSize.height < 20)) {  k_view.layout();
}
});


Ext.override(Ext.grid.GridView, {

getEditorParent: function(ed) {
return this.mainWrap.dom;
},

autoExpand: function(preventUpdate){
var g = this.grid, cm = this.cm;
if(!this.userResized && (false !== g.autoExpandColumn)){ var tw = cm.getTotalWidth(false);
var aw = this.grid.getGridEl().getWidth(true)-this.scrollOffset;
if(tw !== aw){
var ci = cm.getIndexById(g.autoExpandColumn);
var currentWidth = cm.getColumnWidth(ci);
var cw = Math.min(Math.max(((aw-tw)+currentWidth), g.autoExpandMin), g.autoExpandMax);
if(cw !== currentWidth){
cm.setColumnWidth(ci, cw, true);
if(preventUpdate !== true){
this.updateColumnWidth(ci, cw);
}
}
}
}
},

render: function(){
if(this.autoFill){
var ct = this.grid.ownerCt;
if (ct && ct.getLayout()){
ct.on('afterlayout', function(){
this.fitColumns(true, true);
this.updateHeaders();
}, this, {single: true});
}else{
this.fitColumns(true, true);
}
}else if(this.forceFit){
this.fitColumns(true, false);
}else if(false !== this.grid.autoExpandColumn){ this.autoExpand(true);
}
this.renderUI();
},

applyEmptyText: Ext.grid.GridView.prototype.applyEmptyText.createSequence(function () {
var k_hasRows = this.hasRows();
if (this.emptyText) {
this.mainBody[k_hasRows ? 'removeClass' : 'addClass']('emptyGridBody');
}
if (!k_hasRows && this.focusEl && this.focusEl.getTop(true) > this.mainBody.getHeight()) {
this.focusEl.setTop(0);
}
}),

insertRows: function(dm, firstRow, lastRow, isUpdate){
var last = dm.getCount() - 1;
if(!isUpdate && firstRow === 0 && lastRow >= last){
this.fireEvent('beforefirstrowinserted', this, firstRow, lastRow);
this.refresh();
this.fireEvent('firstrowinserted', this, firstRow, lastRow);
}else{
if(!isUpdate){
this.fireEvent("beforerowsinserted", this, firstRow, lastRow);
}
var html = this.renderRows(firstRow, lastRow),
before = this.getRow(firstRow);
if(before){
if(firstRow === 0){
Ext.fly(this.getRow(0)).removeClass(this.firstRowCls);
}
Ext.DomHelper.insertHtml('beforeBegin', before, html);
}else{
var r = this.getRow(last - 1);
if(r){
Ext.fly(r).removeClass(this.lastRowCls);
}
var fc = this.mainBody.dom.firstChild;
if (fc && fc.nodeType === 1 && fc.className === 'x-grid-empty') {
this.mainBody.update(html);
}
else {
Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html);
}
}
if(!isUpdate){
this.fireEvent("rowsinserted", this, firstRow, lastRow);
this.processRows(firstRow);
}else if(firstRow === 0 || firstRow >= last){
Ext.fly(this.getRow(firstRow)).addClass(firstRow === 0 ? this.firstRowCls : this.lastRowCls);
}
}
this.syncFocusEl(firstRow);
}
});
if (kerio.lib.k_isIPadCompatible) {

Ext.grid.GridView.prototype.handleHdOver = Ext.grid.GridView.prototype.handleHdOver.createInterceptor(function (e, t) {
var hd = Ext.fly(this.findHeaderCell(t));
if (hd) {
hd.child('.x-grid3-hd-btn').setStyle('marginLeft', (hd.child('.x-grid3-hd-inner').getWidth() - this.innerHd.scrollLeft - 20) + 'px');
}
});
}
if (kerio.lib.k_isWebKit) {

(function () { var
k_ua = window.navigator.userAgent.toLowerCase(),
k_webKitVersion = 0,
k_re = new RegExp('applewebkit/(\\d+)');
k_re.exec(k_ua);
k_webKitVersion = parseInt(RegExp.$1, 10);
if (k_webKitVersion >= 536) {
Ext.grid.GridView.prototype.getColumnWidth = function(col){
var w = this.cm.getColumnWidth(col);
if(Ext.isNumber(w)){
return (w - this.borderWidth > 0 ? w - this.borderWidth : 0) + 'px';
}
return w;
};
}
}());
}
if (kerio.lib.k_isMSIE10) {

Ext.grid.GridView.prototype.syncFocusEl = function(row, col, hscroll) {
var
xy = row,
k_clientRect,
k_xy;
if(!Ext.isArray(xy)){
row = Math.min(row, Math.max(0, this.getRows().length-1));
if (isNaN(row)) {
return;
}
xy = this.getResolvedXY(this.resolveCell(row, col, hscroll));
}
k_xy = xy || this.scroller.getXY();
try {
k_clientRect = this.focusEl.dom.getBoundingClientRect();
if (Math.floor(k_clientRect.left) < Math.round(k_clientRect.left)) {
k_xy[0] = k_xy[0] + 1;
}
if (Math.floor(k_clientRect.top) < Math.round(k_clientRect.top)) {
k_xy[1] = k_xy[1] + 1;
}
}
catch (k_exception) {
}
this.focusEl.setXY(k_xy);
};
}
if (kerio.lib.k_isMSEdge) {
Ext.grid.GridView.prototype.getColumnWidth = function(col){
var w = this.cm.getColumnWidth(col);
if(Ext.isNumber(w)){
return (w - this.borderWidth > 0 ? w - this.borderWidth : 0 ) + 'px';
}
return w;
};
}


if (Ext.isGecko) {

Ext.form.HtmlEditor.prototype.getWin = function () {
return this.iframe.contentWindow;
};
}



Ext.slider.MultiSlider.prototype.setValue = function(index, v, animate, changeComplete){
var thumb = this.thumbs[index];
v = this.normalizeValue(v);
if (v !== thumb.value && this.fireEvent('beforechange', this, v, thumb.value, thumb) !== false) {
thumb.value = v;
if (this.rendered) {
this.moveThumb(index, this.translateValue(v), animate !== false);
}
this.fireEvent('change', this, v, thumb);
if (changeComplete) {
this.fireEvent('changecomplete', this, v, thumb);
}
}
};

Ext.slider.MultiSlider.prototype.reverseValue = function(pos){
var ratio = this.getRatio();
return (pos - this.thumbs[0]._kx.k_offset +  (this.minValue * ratio))/ratio;
};


Ext.slider.Thumb.prototype.onDragStart = Ext.slider.Thumb.prototype.onDragStart.createInterceptor(function (k_xy) {
var k_offset = k_xy[0] - this.el.getRegion().left - this.slider.halfThumb;
kerio.lib._k_addKerioProperty(this, {k_offset: k_offset});
});

Ext.slider.MultiSlider.prototype.onClickChange = Ext.slider.MultiSlider.prototype.onClickChange.createInterceptor(function () {
kerio.lib._k_addKerioProperty(this.thumbs[0], {k_offset: 0});
});
if (Ext.isIE) {

Ext.slider.MultiSlider.prototype.moveThumb = function(index, v, animate){
var thumb = this.thumbs[index].el;
if (!animate || this.animate === false) {
thumb.setLeft(v);
}
else {
thumb.shift({
left: v,
stopFx: true,
duration: 0.35
});
}
if (this.thumbHolder) {
this.thumbHolder.setLeft(v);
}
};
if (kerio.lib.k_isMSIE9 || kerio.lib.k_isMSIE10) {


Ext.dd.DragTracker.prototype.onMouseMove = function(e, target){

e.preventDefault();
var xy = e.getXY(), s = this.startXY;
this.lastXY = xy;
if (!this.active) {
if (Math.abs(s[0] - xy[0]) > this.tolerance || Math.abs(s[1] - xy[1]) > this.tolerance) {
this.triggerStart();
}
else {
return;
}
}
this.fireEvent('mousemove', this, e);
this.onDrag(e);
this.fireEvent('drag', this, e);
};
}
}


if (Ext.isGecko) {
Ext.form.NumberField.prototype._k_origFilterKeys = Ext.form.NumberField.prototype.filterKeys;

Ext.form.NumberField.prototype.filterKeys = function(e){
if (e.DELETE === e.keyCode && 0 === e.charCode) { return;
}
this._k_origFilterKeys.apply(this, arguments);
};
}



Ext.Panel.prototype.getFrameHeight = function() {
var h  = this.el.getFrameWidth('tb') + this.bwrap.getFrameWidth('tb');
h += (this.tbar ? this.tbar.getHeight() : 0) + (this.bbar ? this.bbar.getHeight() : 0);
if(this.frame) {
h += this.el.dom.firstChild.offsetHeight + this.ft.dom.offsetHeight + this.mc.getFrameWidth('tb');
}
else {
h += (this.header ? this.header.getHeight() : 0) + (this.footer ? this.footer.getHeight() : 0);
}
return h;
};



Ext.data.Store.prototype.storeOptions = function(o){
o = Ext.apply({}, o);
delete o.scope;
delete o.callback;
o = kerio.lib._k_cloneObject(o);
this.lastOptions = o; };


if (Ext.isIE) {
if (kerio.lib.k_isMSIE9) {

Ext.TabPanel.prototype.onStripMouseDown = function(e){
if (e.button !== 0) {
return;
}
var t = this.findTargets(e);
if (t.close) {
if (t.item.fireEvent('beforeclose', t.item) !== false) {
t.item.fireEvent('close', t.item);
this.remove(t.item);
}
return;
}
if (t.item && t.item !== this.activeTab) {
this.setActiveTab(t.item);
}
};
} }



Ext.form.TriggerField.prototype.initTrigger = Ext.form.TriggerField.prototype.initTrigger.createSequence(function () {
if (!this.hideTrigger) {
this.trigger.getWidth = Ext.Element.prototype.getComputedWidth;
}
if (!Ext.isIE) { this.el.getWidth = Ext.Element.prototype.getComputedWidth;
}
});

Ext.form.TriggerField.prototype.updateEditState = function(){
if(this.rendered){
if (this.readOnly) {
this.el.dom.readOnly = true;
this.el.addClass('x-trigger-noedit');
this.mun(this.el, 'click', this.onTriggerClick, this);
} else {
if (!this.editable) {
this.el.dom.readOnly = true;
this.el.addClass('x-trigger-noedit');
this.mon(this.el, 'click', this.onTriggerClick, this);
} else {
this.el.dom.readOnly = false;
this.el.removeClass('x-trigger-noedit');
this.mun(this.el, 'click', this.onTriggerClick, this);
}
}
this.trigger.setDisplayed(!this.hideTrigger); var k_width = Ext.isIE7 ? parseInt(this.wrap.getStyle('width'), 10) : this.wrap.getComputedWidth();
this.onResize(this.width || k_width);
}
};
if (Ext.isIE) {

Ext.form.TriggerField.prototype.onResize = function(w, h){
Ext.form.TriggerField.superclass.onResize.call(this, w, h);
var tw = this.getTriggerWidth();
if(Ext.isNumber(w)){
this.el.setWidth(w - tw);
}
this.wrap.setWidth(w || (this.el.getWidth() + tw));
};
}



Ext.Window.prototype.afterShow = Ext.Window.prototype.afterShow.createSequence(function () {
if (this._kx && this._kx.k_owner && this._kx.k_owner._k_focusManager) {
kerio.lib._k_windowManager.k_onWindowShow(this._kx && this._kx.k_owner);
}
});

Ext.Window.prototype.afterHide = Ext.Window.prototype.afterHide.createSequence(function () {
if (this._kx && this._kx.k_owner && this._kx.k_owner._k_focusManager) {
kerio.lib._k_windowManager.k_onWindowHide(this._kx && this._kx.k_owner);
}
var k_activeWindow = kerio.lib._k_windowManager.k_getActiveWindow();
if (k_activeWindow && k_activeWindow.k_extWidget.modal) {
Ext.getBody().addClass('x-body-masked');
}
});



Ext.dd.DragDropMgr.handleMouseDown = function(e, oDD) {
if(Ext.QuickTips){
Ext.QuickTips.disable();
}
if(this.dragCurrent){
this.handleMouseUp(e);
}
this.currentTarget = e.getTarget();
this.dragCurrent = oDD;
var el = oDD.getEl();
this.startX = e.getPageX();
this.startY = e.getPageY();
this.deltaX = this.startX - el.offsetLeft;
this.deltaY = this.startY - el.offsetTop;
this.dragThreshMet = false;
if (kerio.lib.k_isIPadCompatible) {
this.clickTimeout = setTimeout(
function() {
var DDM = Ext.dd.DDM;
DDM.startDrag(DDM.startX, DDM.startY);
},
this.clickTimeThresh );
}
};


Ext.menu.Menu.prototype.show = Ext.menu.Menu.prototype.show.createInterceptor(function () {
if (this.ownerCt instanceof Ext.Button && this.floating && this.ul) {
this.ul.setHeight('auto');
}
});

if (kerio.lib.k_isMSIE10) {


Ext.Shadow = function(config){
Ext.apply(this, config);
if(typeof this.mode != "string"){
this.mode = this.defaultMode;
}
var o = this.offset, a = {h: 0};
var rad = Math.floor(this.offset/2);
switch(this.mode.toLowerCase()){ case "drop":
a.w = 0;
a.l = a.t = o;
a.t -= 1;
break;
case "sides":
a.w = (o*2);
a.l = -o;
a.t = o-1;
break;
case "frame":
a.w = a.h = (o*2);
a.l = a.t = -o;
a.t += 1;
a.h -= 2;
break;
};
this.adjusts = a;
};
Ext.Shadow.prototype = {


offset: 4,
defaultMode: "drop",

show : function(target){
target = Ext.get(target);
if(!this.el){
this.el = Ext.Shadow.Pool.pull();
if(this.el.dom.nextSibling != target.dom){
this.el.insertBefore(target);
}
}
this.el.setStyle("z-index", this.zIndex || parseInt(target.getStyle("z-index"), 10)-1);
this.realign(
target.getLeft(true),
target.getTop(true),
target.getWidth(),
target.getHeight()
);
this.el.dom.style.display = "block";
},

isVisible : function(){
return this.el ? true : false;
},

realign : function(l, t, w, h){
if(!this.el){
return;
}
var a = this.adjusts, d = this.el.dom, s = d.style;
var iea = 0;
s.left = (l+a.l)+"px";
s.top = (t+a.t)+"px";
var sw = (w+a.w), sh = (h+a.h), sws = sw +"px", shs = sh + "px";
if(s.width != sws || s.height != shs){
s.width = sws;
s.height = shs;
var cn = d.childNodes;
var sww = Math.max(0, (sw-12))+"px";
cn[0].childNodes[1].style.width = sww;
cn[1].childNodes[1].style.width = sww;
cn[2].childNodes[1].style.width = sww;
cn[1].style.height = Math.max(0, (sh-12))+"px";
}
},

hide : function(){
if(this.el){
this.el.dom.style.display = "none";
Ext.Shadow.Pool.push(this.el);
delete this.el;
}
},

setZIndex : function(z){
this.zIndex = z;
if(this.el){
this.el.setStyle("z-index", z);
}
}
};
Ext.Shadow.Pool = function(){
var p = [];
var markup = '<div class="x-shadow"><div class="xst"><div class="xstl"></div><div class="xstc"></div><div class="xstr"></div></div><div class="xsc"><div class="xsml"></div><div class="xsmc"></div><div class="xsmr"></div></div><div class="xsb"><div class="xsbl"></div><div class="xsbc"></div><div class="xsbr"></div></div></div>';
return {
pull : function(){
var sh = p.shift();
if(!sh){
sh = Ext.get(Ext.DomHelper.insertHtml("beforeBegin", document.body.firstChild, markup));
sh.autoBoxAdjust = false;
}
return sh;
},
push : function(sh){
p.push(sh);
}
};
}();
}  
Ext.History = (function () {
var
iframe, hiddenField,
ready = false,
currentToken,
k_isOldIE = kerio.lib.k_isMSIE7 || kerio.lib.k_isMSIE8;
function getHash() {
var href = window.location.href, i = href.indexOf("#");
return i >= 0 ? href.substr(i + 1) : null;
}
function doSave() {
hiddenField.value = currentToken;
}
function handleStateChange(token) {
currentToken = token;
Ext.History.fireEvent('change', token);
}
function updateIFrame (token) {
var html = ['<html><body><div id="state">',Ext.util.Format.htmlEncode(token),'</div></body></html>'].join('');
try {
var doc = iframe.contentWindow.document;
doc.open();
doc.write(html);
doc.close();
return true;
} catch (e) {
return false;
}
}
function checkIFrame() {
if (!iframe.contentWindow || !iframe.contentWindow.document) {
setTimeout(checkIFrame, 10);
return;
}
var doc = iframe.contentWindow.document;
var elem = doc.getElementById("state");
var token = elem ? elem.innerText : null;
var hash = getHash();
setInterval(function () {
doc = iframe.contentWindow.document;
elem = doc.getElementById("state");
var newtoken = elem ? elem.innerText : null;
var newHash = getHash();
if (newtoken !== token) {
token = newtoken;
handleStateChange(token);
window.location.hash = token;
hash = token;
doSave();
} else if (newHash !== hash) {
hash = newHash;
updateIFrame(newHash);
}
}, 50);
ready = true;
Ext.History.fireEvent('ready', Ext.History);
}
function startUp() {
currentToken = hiddenField.value ? hiddenField.value : getHash();
if (k_isOldIE) {
checkIFrame();
} else {
var hash = getHash();
setInterval(function () {
var newHash = getHash();
if (newHash !== hash) {
hash = newHash;
handleStateChange(hash);
doSave();
}
}, 50);
ready = true;
Ext.History.fireEvent('ready', Ext.History);
}
}
return {

fieldId: 'x-history-field',

iframeId: 'x-history-frame',
events:{},

init: function (onReady, scope) {
if(ready) {
Ext.callback(onReady, scope, [this]);
return;
}
if(!Ext.isReady){
Ext.onReady(function(){
Ext.History.init(onReady, scope);
});
return;
}
hiddenField = Ext.getDom(Ext.History.fieldId);
if (k_isOldIE) {
iframe = Ext.getDom(Ext.History.iframeId);
}
this.addEvents(

'ready',

'change'
);
if(onReady){
this.on('ready', onReady, scope, {single:true});
}
startUp();
},

add: function (token, preventDup) {
if(preventDup !== false){
if(this.getToken() == token){
return true;
}
}
if (k_isOldIE) {
return updateIFrame(token);
} else {
window.location.hash = token;
return true;
}
},

back: function(){
history.go(-1);
},

forward: function(){
history.go(1);
},

getToken: function() {
return ready ? currentToken : getHash();
}
};
})();
Ext.apply(Ext.History, new Ext.util.Observable());

Ext.namespace('kerio.ext.ux');

kerio.ext.ux.K_IconCombo = function (k_config) {
kerio.ext.ux.K_IconCombo.superclass.constructor.call(this, k_config);
};
Ext.extend(kerio.ext.ux.K_IconCombo, Ext.form.ComboBox, {

iconWidth: 21,
isIconVisible: true,




initComponent:function() {
this.listAlign = ['tl-bl?', [-this.iconWidth, 0]];
this.tpl = '<tpl for="."><div class="x-combo-list-item">'
+ '<div class="icon '+ this.listClass +' {' + this.iconClsField + '}"'
+ (this.iconTooltipField ? ' {[kerio.lib.k_buildTooltip(values.' + this.iconTooltipField + ')]}' : '')
+ '></div>'
+ (this.initialConfig.k_isSecure ? '{' + this.displayField + '}' : '{[fm.htmlEncode(values.' + this.displayField + ')]}')
+ '</div></tpl>';
kerio.ext.ux.K_IconCombo.superclass.initComponent.call(this);
this.on('focus', function() {this.icon.addClass('x-form-focus');});
this.on('blur' , function() {this.icon.removeClass('x-form-focus');});
},

onRender:function(ct, position) {
kerio.ext.ux.K_IconCombo.superclass.onRender.call(this, ct, position);
this.wrap.addClass('iconCombo');
this.el.addClass('iconInput');
this.icon = Ext.DomHelper.insertFirst(this.el.up('div.x-form-field-wrap'),
{tag: 'div', cls:'x-form-text iconWrap', children: [{tag: 'div', cls:'icon'}]}, true
);
this.icon.on('mousedown', this.k_switchExpand, this);
this.setIconCls();
},

onResize: function(w, h) {
var k_iconWidth = this.isIconVisible ? this.iconWidth : 0;
kerio.ext.ux.K_IconCombo.superclass.onResize.call(this, w, h);
if (typeof w === 'number') {
this.el.setWidth(w - this.trigger.getWidth() - k_iconWidth);
this.wrap.setWidth(w);
if (kerio.lib.k_isMSIE10) {
if (undefined === this.innerList) {
this.initList();
}
this.innerList.setWidth(w);
}
}
},

setIconCls:function() {
var
k_index = this.k_getIndexByDataValue(this.valueField, this.getValue()),
k_rec = null,
k_className = 'icon ' + this.listClass + ' ';
if (-1 != k_index) {
k_rec = this.store.getAt(k_index);
}
if (this.icon) {
k_className += (k_rec ? k_rec.get(this.iconClsField) : 'empty');
this.icon.dom.firstChild.className = k_className;
}
},

showIcon: function(k_isShow){
this.isIconVisible = k_isShow !== false;
if (this.isIconVisible) {
this.listAlign[1][0] = -this.iconWidth;
this.wrap.removeClass('hiddenIcon');
}
else {
this.listAlign[1][0] = 0;
this.wrap.addClass('hiddenIcon');
}
this.onResize(this.getResizeEl().getComputedWidth(), this.getResizeEl().getHeight());
},

setValue: function(value) {
kerio.ext.ux.K_IconCombo.superclass.setValue.call(this, value);
this.setIconCls();
},

k_switchExpand: function() {
var k_delay = Ext.isIE || kerio.lib.k_isMSIE11 ? 10 : 0;
this.focus();
if (this.isExpanded()) {
this.collapse.defer(k_delay, this);
}
else {
this.k_expand.defer(k_delay, this);
}
},

k_expand: function () {
if (!this.disabled && !this.readOnly) {
this.expand();
this.restrictHeight();
}
}
});
Ext.reg('k_iconcombo', kerio.ext.ux.K_IconCombo);
Ext.namespace('kerio.ext.ux');
kerio.ext.ux.DoubleGroupingView = Ext.extend(Ext.grid.GroupingView, {
k_secondLevelGrouping: undefined,
constructor: function(config) {
this.k_secondLevelGrouping = config.k_secondLevelGrouping;
if(!this.startSubGroup){
this.startSubGroup = new Ext.XTemplate(
'<div id="{groupId}" class="x-grid-group x-grid-subgroup {cls}">',
'<div id="{groupId}-hd" class="x-grid-group-hd x-grid-subgroup-hd" style="{style}"><div class="x-grid-group-title x-grid-subgroup-title">', this.groupTextTpl ,'</div></div>',
'<div id="{groupId}-bd" class="x-grid-group-body x-grid-subgroup-body">'
);
}
this.startSubGroup.compile();
kerio.ext.ux.DoubleGroupingView.superclass.constructor.call(this, config);
},
renderRows: function(){
if (this.k_secondLevelGrouping) {
var k_colIndex = this.cm.findColumnIndex(this.k_secondLevelGrouping.k_columnId);
this.cm.setHidden(k_colIndex, true);
}
return kerio.ext.ux.DoubleGroupingView.superclass.renderRows.apply(this, arguments);
},

doRender: function(cs, rs, ds, startRow, colCount, stripe){
if(rs.length < 1){
return '';
}
if(!this.canGroup() || this.isUpdating){
return Ext.grid.GroupingView.superclass.doRender.apply(this, arguments);
}
var groupField = this.getGroupField(),
colIndex = this.cm.findColumnIndex(groupField),
scolIndex = this.cm.findColumnIndex(this.k_secondLevelGrouping.k_columnId),
g, sg,
gstyle = 'width:' + this.getTotalWidth() + ';',
cfg = this.cm.config[colIndex],
groupRenderer = cfg.groupRenderer || cfg.renderer,
prefix = this.showGroupName ? (cfg.groupName || cfg.header)+': ' : '',
groups = [],
sgvalue,
curSGroup,
sgGroups = {},
gi = -1,
sgid,
curGroup, i, len, gid;
for(i = 0, len = rs.length; i < len; i++){
var rowIndex = startRow + i,
r = rs[i],
gvalue = r.data[groupField];
g = this.getGroup(gvalue, r, groupRenderer, rowIndex, colIndex, ds).k_displayValue;
if(!curGroup || curGroup.group !== g){
gi++;
gid = this.constructId(gvalue, groupField, colIndex);
this.state[gid] = !(Ext.isDefined(this.state[gid]) ? !this.state[gid] : this.startCollapsed);
curGroup = {
group: g,
gvalue: gvalue,
text: prefix + g,
groupId: gid,
startRow: rowIndex,
rs: [r],
cls: this.state[gid] ? '' : 'x-grid-group-collapsed',
style: gstyle
};
groups.push(curGroup);
sgvalue = r.data[this.k_secondLevelGrouping.k_columnId];
if (sgvalue) {
sg = this.getSecondLevelGroup(sgvalue, r, groupRenderer, rowIndex, scolIndex, ds).k_displayValue;
sgid = this.constructId(sgvalue, this.k_secondLevelGrouping.k_columnId, scolIndex);
sgid = sgid.replace('&amp;', '&');
this.state[sgid] = !(Ext.isDefined(this.state[sgid]) ? !this.state[sgid] : this.k_secondLevelGrouping.k_startCollapsed);
curSGroup = {
group: sg,
gvalue: sgvalue,
text: prefix + sg,
groupId: sgid,
startRow: rowIndex,
rs: [r],
cls: this.state[sgid] ? '' : 'x-grid-group-collapsed',
style: gstyle
};
sgGroups[sgvalue] = curSGroup;
}
}
else {
sgvalue = r.data[this.k_secondLevelGrouping.k_columnId];
if (sgvalue) {
if(sgGroups.hasOwnProperty(sgvalue)){
sgGroups[sgvalue].rs.push(r);
}
else {
sg = this.getSecondLevelGroup(sgvalue, r, groupRenderer, rowIndex, scolIndex, ds).k_displayValue;
sgid = this.constructId(sgvalue, this.k_secondLevelGrouping.k_columnId, scolIndex);
sgid = sgid.replace('&amp;', '&');
this.state[sgid] = !(Ext.isDefined(this.state[sgid]) ? !this.state[sgid] : this.k_secondLevelGrouping.k_startCollapsed);
curSGroup = {
group: sg,
gvalue: sgvalue,
text: prefix + sg,
groupId: sgid,
startRow: rowIndex,
rs: [r],
cls: this.state[sgid] ? '' : 'x-grid-group-collapsed',
style: gstyle
};
sgGroups[sgvalue] = curSGroup;
curGroup.rs.push(r);
}
}
else {
curGroup.rs.push(r);
}
}
r._groupId = gid;
}
var buf = [];
var j;
var startIndex; for(i = 0, len = groups.length; i < len; i++){
g = groups[i];
startIndex = g.startRow;
this.doGroupStart(buf, g, cs, ds, colCount);
for (var j = 0; j < g.rs.length; j++) {
var row = g.rs[j];
startIndex += j;
sgvalue = row.data[this.k_secondLevelGrouping.k_columnId];
if(sgGroups.hasOwnProperty(sgvalue)){
this.doSubGroupStart(buf, sgGroups[sgvalue], cs, ds, colCount);
buf[buf.length] = Ext.grid.GroupingView.superclass.doRender.call(
this, cs, sgGroups[sgvalue].rs, ds, startIndex, colCount, stripe);
startIndex = startIndex + sgGroups[sgvalue].rs.length;
this.doGroupEnd(buf);
}
else {
buf[buf.length] = Ext.grid.GroupingView.superclass.doRender.call(
this, cs, [row], ds, startIndex, colCount, stripe);
}
}
this.doGroupEnd(buf);
}
return buf.join('');
},

doSubGroupStart : function(buf, g, cs, ds, colCount){
buf[buf.length] = this.startSubGroup.apply(g);
},

getSecondLevelGroup : function(v, r, groupRenderer, rowIndex, colIndex, ds){
var g = groupRenderer ? groupRenderer(v, {}, r, rowIndex, colIndex, ds) : String(v);
if(g === '' || g === '&#160;'){
g = this.cm.config[colIndex].emptyGroupText || this.emptyGroupText;
}
return g;
},

getSubGroups : function(){
return this.hasRows() ? this.mainBody.dom.getElementsByClassName('x-grid-subgroup') : this.getGroups();
},

getRows : function(){
return this.hasRows() ? this.mainBody.dom.getElementsByClassName('x-grid3-row') : [];
},
toggleAllSubGroups: function(k_expanded) {
var groups = this.getSubGroups();
for(var i = 0, len = groups.length; i < len; i++){
this.toggleGroup(groups[i], k_expanded);
}
}
});


kerio.lib.K_Error = function (k_message, k_fileName) {
var
k_arguments,
k_propName,
k_tmpError;
if (Ext.isIE) {
k_arguments = [0, k_message];
}
else if (Ext.isGecko) {
k_arguments = [k_message, k_fileName];
}
else {
k_arguments = [k_message];
}
k_tmpError = window.Error.apply(this, k_arguments);
this.fileName = k_fileName;
this.message = k_message;
this.stack = k_tmpError.stack;
if (window.k_webAssist) {
window.k_webAssist.k_callStack = this.stack || null;
}
};
Ext.extend(kerio.lib.K_Error, window.Error, {
name: 'Internal Error'
});


kerio.lib._K_Scroller = function(k_config) {
var
k_element = k_config.k_element,
k_proxyScroller = k_config.k_proxyScroller,
k_scrollbarSize = kerio.lib.k_getScrollbarSize(),
k_owner;
k_owner = k_config.k_owner;
this.k_owner = k_owner;
k_owner.k_extWidget.focus = this._k_focus;
k_owner.k_extWidget.blur = this._k_blur;
kerio.lib._k_addKerioProperty(k_owner.k_extWidget, {k_scroller: this});
if ('string' === Ext.type(k_element)) { k_element = Ext.get(k_element);
}
this._k_element = k_element;
k_element.addClass('scroller');
if (kerio.lib.k_isLionOrLater && 0 === k_scrollbarSize.k_width && 0 === k_scrollbarSize.k_height) {
k_element.addClass('iScroll');
k_scrollbarSize = {k_width: 7, k_height: 7};  }
if (kerio.lib.k_isIPadCompatible) {
k_scrollbarSize = {k_width: 4, k_height: 4};  }
this._k_elementContent = k_element.insertFirst({tag: 'div', style: 'width: 1px; height: 1px;'});
if ('string' === Ext.type(k_proxyScroller)) { k_proxyScroller = Ext.get(k_proxyScroller);
}
this._k_proxyScrollerEl = k_proxyScroller;
k_proxyScroller.insertAfter(k_element);
k_proxyScroller.setLeftTop(k_element.dom.offsetLeft, k_element.dom.offsetTop);
k_proxyScroller.on('mouseup'      , function () {
this.k_focus();
}, this);
k_element.on('keydown', this._k_onKeyDown, this);
k_proxyScroller.on('mousewheel', this._k_onMouseWheel, this);
this._k_initFocusEl();
this._k_initMaxHeight();
this._k_status = {
k_scrollbarSize: k_scrollbarSize,
k_lineHeight: k_config.k_lineHeight,
k_lineWidth: k_config.k_lineWidth,
k_totalLines: -1,
k_currentLine: 0,
k_scrollTopPosition: 0,
k_scrollLeftPosition: 0,
k_isLastLineVisible: false,
k_isBottomPosition: false,
k_displayOffsetDirection: +1
};
this._k_updateStatus();
if (Ext.isGecko) {
this._k_isSmoothScrollFirefox = this._k_detectSmoothScrollFirefox();
}
else {
this._k_isSmoothScrollFirefox = false;
}
this._k_initEvents(k_config);
};
kerio.lib._K_Scroller.prototype = {
_k_maxHeight: 16000000,
_k_isScrolling: false,
_k_isNativeScroll: true,   k_SCROLL_TYPES: {
k_LINE_UP: 0,
k_LINE_DOWN: 1,
k_PAGE_UP: 2,
k_PAGE_DOWN: 3,
k_MOVE_UP: 4,
k_MOVE_DOWN: 5,
k_SMOOTH_SCROLL: 6
},
_k_suppressNextScrollEvent: false,
_k_lastScrollPosition: 0,
_k_scrollbarAction: null,
_k_scrollStepSumFirefox: 0,
_k_isMouseButtonPressedFirefox: false,
_k_safari3LineStep: 40, _k_safariMinWheelDelta: 12,
_k_scrollbarActionAfterKeyIE: null,

_k_updateStatus: function(k_statusFragment) {
if (undefined === k_statusFragment) {
this._k_status.k_viewHeight = this._k_getViewHeight();
k_statusFragment = {
k_pageScrollStep: this._k_getPageScrollStep(),
k_lineScrollStep: this._k_getLineScrollStep(),
k_linesPerPage: this._k_getLinesPerPage(),
k_pageStepInLines: this._k_getPageStepInLines(),
k_displayOffset: this._k_getDisplayOffset()
};
}
this._k_status = Ext.apply(this._k_status, k_statusFragment);
},

k_getStatus: function() {
var
k_status = this._k_status,
k_displayOffset = k_status.k_displayOffset,
k_hasVerticalScrollbar = k_status.k_totalLines >= k_status.k_linesPerPage,
k_invisiblePartOfLine = 0;
if (k_hasVerticalScrollbar && k_displayOffset && 1 === k_status.k_displayOffsetDirection) {
k_invisiblePartOfLine = k_status.k_lineHeight - k_displayOffset;
}
this._k_updateStatus({
k_hasVerticalScrollbar: k_hasVerticalScrollbar,
k_isScrollPending: k_status.k_scrollTopPosition !== this._k_element.dom.scrollTop,
k_invisiblePartOfLine: k_invisiblePartOfLine
});
k_status.k_nativeScrollPosition = this._k_getNativeScrollerPositionFromLine(k_status.k_currentLine);  return k_status;
},

_k_onKeyDown: function(k_extEvent) {
var
k_rowView = this.k_owner,
k_key = k_extEvent.getKey(),
k_aKeyCode = 65,
k_cKeyCode = 67,
k_insertKeyCode = 45;
if (kerio.lib.k_isFirefox && !kerio.lib.k_isFirefoxLess4) {
this._k_lastKeyDown = k_key;
}
if (k_extEvent.ctrlKey) {
if (k_cKeyCode === k_key || (Ext.isWindows && k_insertKeyCode === k_key)) {
k_rowView._k_doCopyToClipboard();
}
else if (k_aKeyCode === k_key) {
k_extEvent.stopEvent();
k_rowView._k_selectAll();
}
else if (kerio.lib.k_isWebKit && kerio.lib.k_isSnowLeopardOrLater) { k_rowView._k_fillClipboard();
}
}
else if (!this._k_isShiftKeyDown && k_extEvent.SHIFT === k_extEvent.getKey()) {
if (k_rowView._k_extDataView.store.getCount() > 0) {  k_rowView._k_insertCaret();
this._k_isShiftKeyDown = true;
Ext.getBody().on('keyup', this._k_onKeyUp, this);
}
}
},

_k_onKeyUp: function(k_extEvent) {
if (k_extEvent.SHIFT === k_extEvent.getKey()) {
this._k_isShiftKeyDown = false;
Ext.getBody().un('keyup', this._k_onKeyUp, this);
}
},


_k_initEvents: function (k_config) {
var
k_onScrollHandler = Ext.emptyFn,
k_element = this._k_element;
if (k_config.k_onScroll) {
this._k_onScroll = k_config.k_onScroll;
}
if (k_config.k_onNativeScroll) {
this._k_onNativeScroll = k_config.k_onNativeScroll;
}
if (Ext.isIE || kerio.lib.k_isMSIE11 || kerio.lib.k_isMSEdge) {
k_onScrollHandler = this._k_onScrollHandlerIE;
k_element.on('mousedown', this._k_onMouseDownHandlerIE, this);
}
if (Ext.isGecko) {
k_onScrollHandler = this._k_onScrollHandlerFirefox;
k_element.on('mousedown', this._k_onMouseDownHandlerFirefox, this);
k_element.on('mouseup', this._k_onMouseUpHandlerFirefox, this);
}
if (Ext.isWebKit) {
k_onScrollHandler = this._k_onScrollHandlerSafari;
}
this._k_browserSpecOnScrollHandler = k_onScrollHandler;
k_element.on('scroll', this._k_onScrollHandler, this);
},

_k_getRowFromMouseCoords: function (k_mouseX, k_mouseY) {
var
k_rowEl = null,
k_status = this.k_getStatus(),
k_clientY = k_mouseY - this._k_element.getTop(),
k_itemSelector = this.k_owner._k_extDataView.itemSelector,
k_lineIndex;
k_clientY += k_status.k_invisiblePartOfLine;
k_lineIndex = Math.floor(k_clientY / k_status.k_lineHeight);
k_rowEl = this._k_proxyScrollerEl.child('.data').query(k_itemSelector)[k_lineIndex];
return k_rowEl;
},

_k_onMouseWheel: function (k_extEvent) {
if (-1 === this.k_getStatus().k_totalLines) {
return;
}
var
k_wheelDelta = this._k_getWheelDelta(k_extEvent),
k_floorWheelDelta = Math.floor(k_wheelDelta),
k_status = this.k_getStatus(),
k_currentLine = k_status.k_currentLine,
k_browserEvent,
k_wheelDeltaX,
k_direction,
k_lines;
k_extEvent.preventDefault();
if (kerio.lib.k_isLionOrLater) {
k_browserEvent = k_extEvent.browserEvent;
k_wheelDeltaX = k_browserEvent.wheelDeltaX;
if (undefined === k_wheelDeltaX) {
if (undefined !== k_browserEvent.axis && k_browserEvent.axis === k_browserEvent.HORIZONTAL_AXIS) {
k_wheelDeltaX = k_browserEvent.detail * -13; }
}
if (k_wheelDeltaX) {
this._k_element.dom.scrollLeft -= k_wheelDeltaX;
return;
}
}
if (k_wheelDelta != k_floorWheelDelta) {
k_wheelDelta = k_floorWheelDelta;
}
k_lines = Math.abs(k_wheelDelta); k_direction = k_wheelDelta > 0 ? -1 : 1; k_currentLine += k_direction * k_lines * 4; k_currentLine = Math.max(0, k_currentLine);
if (k_currentLine < k_status.k_maxStartLine) {
this.k_scrollToLine(k_currentLine);
}
else {
this.k_scrollToBottom();
}
},

_k_initFocusEl: function () {
var
k_focusEl,
k_ownerExtWidget = this.k_owner.k_extWidget;
k_focusEl = this._k_elementContent.createChild({
tag: 'a',
href: '#',
cls: 'x-grid3-focus',
tabindex: -1,
style: 'top: 0, left: 0;'
});
if (Ext.isIE || kerio.lib.k_isMSIE11 || kerio.lib.k_isMSEdge) {
this._k_element.on('keydown', this._k_onKeyDownHandlerIE, this);
}
else if (kerio.lib.k_isWebKit) {
if (Ext.isMac) {
this._k_element.on('keydown', this._k_fixWebkitKeys, this);
}
if (Ext.isWindows) {
this._k_element.on('keydown', this._k_fixSafariPageUpDownKeys, this);
}
}
else if (kerio.lib.k_isFirefox && !kerio.lib.k_isFirefoxLess4) {
this._k_element.on('keyup', this._k_resetLastKeyDown, this);
}
k_focusEl.on('focus', this._k_fireFocusEvent, k_ownerExtWidget);
k_focusEl.on('blur', this._k_fireBlurEvent, k_ownerExtWidget);
this._k_focusEl = k_focusEl;
},

k_focus: function () {
this._k_focus.call(this.k_owner.k_extWidget);
},

_k_focus: function () {
var k_scroller = this._kx.k_scroller;
if ((kerio.lib.k_isMSIE8 || kerio.lib.k_isMSIE9 || kerio.lib.k_isMSIE10 || kerio.lib.k_isMSIE11) && k_scroller._k_element.dom.scrollTop !== k_scroller._k_lastScrollPosition) {
k_scroller._k_suppressNextScrollEvent = true;
k_scroller._k_element.dom.scrollTop = k_scroller._k_lastScrollPosition;
}
this._kx.k_scroller._k_focusEl.focus();
},

_k_blur: function () {
this._kx.k_scroller._k_focusEl.blur();
},

_k_fireFocusEvent: function () {
this.fireEvent('focus', this);
},

_k_fireBlurEvent: function () {
this.fireEvent('blur', this);
},

_k_initMaxHeight: function () {
var k_maxHeight = 0x1000000;
if (kerio.lib.k_isFirefox) {
k_maxHeight = 0x444444;  }
else if ((kerio.lib.k_isMSIE && !kerio.lib.k_isMSIE7) || kerio.lib.k_isMSIE11 || kerio.lib.k_isMSEdge) {
k_maxHeight = 0x123000;
}
this._k_maxHeight = k_maxHeight;
},

k_initOnResize: function () {
var
k_status = this.k_getStatus(),
k_totalLines = k_status.k_totalLines,
k_scrollTop,
k_currentLine;
this._k_updateStatus({
k_totalLines: -1,
k_viewHeight: this._k_getViewHeight(), k_viewPort: this._k_getViewPort()
});
if (false === k_status.k_isBottomPosition) {
k_currentLine = k_status.k_currentLine;
}
this.k_setTotalLines(k_totalLines, k_currentLine);
k_scrollTop = this._k_element.dom.scrollTop;
this._k_updateStatus({
k_scrollTopPosition: k_scrollTop
});
this._k_lastScrollPosition = k_scrollTop;
this._k_updateStatus();
},

_k_getViewPort: function() {
var
k_element = this._k_element,
k_viewSize = k_element.getViewSize(),
k_region = k_element.getRegion(),
k_top = k_region.top + k_element.getBorderWidth('t'),
k_left = k_region.left + k_element.getBorderWidth('l');
return {
k_top   : k_top,
k_left  : k_left,
k_bottom: k_top + k_viewSize.height,
k_right : k_left + k_viewSize.width
};
},

_k_initElements: function () {
var
k_status = this.k_getStatus(),
k_element = this._k_element,
k_proxyScrollerEl = this._k_proxyScrollerEl,
k_width,
k_viewHeight = k_status.k_viewHeight,
k_elementContent = this._k_elementContent;
if (0 === k_elementContent.getHeight()) {
k_elementContent.setHeight(1);
}
k_width = k_status.k_totalLines <= 0 ? k_element.getWidth(true) : k_proxyScrollerEl.child('.data').getWidth();
k_elementContent.setWidth(k_width);
k_width = k_element.getWidth();
this._k_updateStatus();
k_proxyScrollerEl.setSize({
width: k_status.k_totalLines >= k_status.k_linesPerPage ? k_width -  k_status.k_scrollbarSize.k_width : k_width,
height: k_viewHeight + k_proxyScrollerEl.getBorderWidth('tb')
});
this._k_setFakeScrollersPosition();
},

k_setTotalLines: function (k_totalLines, k_currentLine) {
var
k_status = this.k_getStatus(),
k_maxHeight = this._k_maxHeight,
k_lineHeight = k_status.k_lineHeight,
k_scrollerLineHeight = k_status.k_lineScrollStep,
k_height,
k_maxStartLine,
k_maxNativeScrollPosition;
if (k_totalLines < k_status.k_linesPerPage) {
this._k_updateStatus({k_displayOffsetDirection: -1});
}
if (k_status.k_totalLines === k_totalLines) {
return;
}
this._k_updateStatus({k_totalLines: k_totalLines});
this._k_initElements();
k_status = this.k_getStatus();
k_scrollerLineHeight = k_status.k_lineScrollStep;
this._k_isLineRepositionRequested = false;
this._k_isPageRepositionRequested = true;
if (kerio.lib.k_isMSIE || kerio.lib.k_isMSIE11 || kerio.lib.k_isMSEdge) {
if (k_totalLines < 1000) {
k_scrollerLineHeight = k_lineHeight;
if (k_totalLines > k_status.k_linesPerPage) {
this._k_addFakeScrollers();
this._k_setFakeScrollersPosition();
}
else {
this._k_removeFakeScrollers();
}
}
else {
this._k_removeFakeScrollers();
}
}
if (kerio.lib.k_isWebKit && k_totalLines < 1000) {
k_scrollerLineHeight = k_lineHeight;
this._k_isLineRepositionRequested = true;
}
k_maxStartLine = k_totalLines - k_status.k_linesPerPage;
if (k_maxStartLine < 0) {
k_maxStartLine = 0;
}
this._k_updateStatus({k_maxStartLine: k_maxStartLine});
k_height = k_totalLines * k_scrollerLineHeight;
if (k_scrollerLineHeight < k_lineHeight) {
k_height += k_status.k_linesPerPage * (k_lineHeight - k_scrollerLineHeight);
}
else if (k_scrollerLineHeight > k_lineHeight) {
k_height = (k_maxStartLine * k_scrollerLineHeight) + k_status.k_viewHeight;
}
if (k_height > k_maxHeight) {
this._k_isNativeScroll = false;
this._k_isLineRepositionRequested = true;
this._k_isPageRepositionRequested = true;
this._k_threshold = Math.floor(1.5 * k_status.k_pageScrollStep);
k_height = k_maxHeight;
this._k_updateStatus({k_smallMoveLimit: 10 * k_status.k_pageScrollStep});
}
else {
this._k_isNativeScroll = true;
}
this._k_elementContent.setHeight(k_height);
k_maxNativeScrollPosition = k_maxStartLine * k_status.k_lineScrollStep;
if ((k_status.k_viewHeight < k_status.k_lineHeight * k_totalLines) && 0 !== k_status.k_displayOffset) {
k_maxNativeScrollPosition += k_lineHeight - k_status.k_displayOffset;
}
this._k_updateStatus({
k_maxScrollPosition: this._k_getScrollBottom(),
k_maxNativeScrollPosition: k_maxNativeScrollPosition
});
if (undefined === k_currentLine) {
if (k_status.k_isBottomPosition) {
k_currentLine = k_maxStartLine;
}
else {
k_currentLine = this._k_getLineFromScrollPosition();
}
}
if (kerio.lib.k_isFirefox && !kerio.lib.k_isFirefoxLess4 && 0 === k_totalLines) {
this._k_focusEl.setStyle({top: '0px', left: '0px'});
}
if (k_currentLine === k_maxStartLine) {  this.k_scrollToBottom(true);
}
this._k_updateStatus({
k_currentLine: k_currentLine,
k_viewPort: this._k_getViewPort()
});
this._k_updateLastPageFlags(k_currentLine);
this._k_buggyDifference = Math.min( 6, Math.ceil(k_totalLines / 500000) + 1);  },

k_scrollToLine: function (k_line, k_suppressScrollEvent) {
var
k_status = this.k_getStatus(),
k_scrollTypes = this.k_SCROLL_TYPES,
k_newScrollerPosition;
if (k_line >= k_status.k_totalLines - 1) {
this.k_scrollToBottom(k_suppressScrollEvent);
return;
}
k_line = Math.max(0, Math.min(k_line, k_status.k_maxStartLine));
k_newScrollerPosition = this._k_getScrollerPositionFromLine(k_line);
this._k_updateStatus({k_displayOffsetDirection: -1});
if (this._k_isNativeScroll) {
this._k_setScrollPosition(k_newScrollerPosition, k_suppressScrollEvent);
if (k_suppressScrollEvent) {
this._k_updateStatus({k_currentLine: k_line});
this._k_updateLastPageFlags(k_line);
}
}
else {
this._k_updateStatus({k_currentLine: k_line + 1});
this._k_updateCurrentLine(k_scrollTypes.k_LINE_UP);
if (!k_suppressScrollEvent) {
this._k_callUserDefinedHandler(k_scrollTypes.k_LINE_UP);
}
this._k_lastScrollPosition = this._k_element.getScroll().top;
}
},

_k_getViewHeight: function () {
var
k_status = this.k_getStatus(),
k_viewHeight,
k_hasHorizontalScrollbar;
if (k_status.k_lineWidth > this._k_element.dom.clientWidth) {
k_hasHorizontalScrollbar = true;
k_viewHeight = this._k_element.getHeight(true) - k_status.k_scrollbarSize.k_height;
}
else {
k_hasHorizontalScrollbar = false;
k_viewHeight = this._k_element.dom.clientHeight;
}
this._k_updateStatus({k_hasHorizontalScrollbar: k_hasHorizontalScrollbar});
return k_viewHeight;
},

_k_getDisplayOffset: function () {
var
k_displayOffset,
k_status = this.k_getStatus();
k_displayOffset = k_status.k_viewHeight % k_status.k_lineHeight;
return k_displayOffset;
},

_k_getLineScrollStep: function () {
var k_lineStep;
if (Ext.isIE || kerio.lib.k_isMSIE11 || kerio.lib.k_isMSEdge) {
k_lineStep = Math.floor(this.k_getStatus().k_viewHeight * 25 / 200);
}
else {
if (kerio.lib.k_isFirefox) {
k_lineStep = Ext.util.TextMetrics.measure(this._k_element, 'test').height;
}
if (Ext.isWebKit) {
k_lineStep = this._k_safari3LineStep;
}
}
return k_lineStep;
},

_k_getPageScrollStep: function () {
var
k_pageStep,
k_viewHeight = this.k_getStatus().k_viewHeight;
k_pageStep = k_viewHeight - (Ext.isIE || kerio.lib.k_isMSIE11  || kerio.lib.k_isMSEdge ? Math.ceil(k_viewHeight * 25 / 200) : this._k_getLineScrollStep());
return k_pageStep;
},

_k_getLinesPerPage: function () {
var
k_linesPerPage,
k_status = this.k_getStatus();
k_linesPerPage = Math.ceil(k_status.k_viewHeight / k_status.k_lineHeight);
return k_linesPerPage;
},

_k_getPageStepInLines: function () {
var
k_pageStepInLines,
k_lineHeight = this.k_getStatus().k_lineHeight,
k_offset = this._k_getDisplayOffset();
k_pageStepInLines = this._k_getLinesPerPage() - 1;
if (k_offset > 0 && k_offset < k_lineHeight / 2) {  k_pageStepInLines -= 1;
}
return k_pageStepInLines;
},

_k_getScrollStep: function () {
return Math.abs(this._k_getRawStep());
},

_k_doHScroll: function () {
var k_scrollLeft = this._k_element.getScroll().left;
this._k_status.k_scrollLeftPosition = k_scrollLeft;
this._k_proxyScrollerEl.dom.scrollLeft = k_scrollLeft;
},

_k_onScrollHandler: function () {
var
k_scrollPosition = this._k_element.getScroll(),
k_scrollTop = k_scrollPosition.top,
k_scrollLeft = k_scrollPosition.left,
k_status = this.k_getStatus(),
k_displayOffsetDirection = k_status.k_displayOffsetDirection,
k_focusElPosition = this._k_focusEl.getStyles('top', 'left'),
k_scrollType;
if (kerio.lib.k_isChrome && 0 === k_status.k_totalLines && 0 !== k_scrollTop) {
this._k_setScrollPosition(0, true);
}
if (parseInt(k_focusElPosition.left, 10) !== k_scrollLeft || parseInt(k_focusElPosition.top, 10) !== k_scrollTop) {
this._k_focusEl.setStyle({
top: k_scrollTop + 'px',
left: k_scrollLeft + 'px'
});
}
if (kerio.lib.k_isWebKit && document.activeElement && 'BODY' === document.activeElement.tagName) {
this._k_focusEl.focus();
}
if (k_scrollLeft !== k_status.k_scrollLeftPosition) {
this._k_doHScroll();
return;
}
if (0 === k_scrollTop) {
k_displayOffsetDirection = -1;
}
else if (k_scrollTop >= k_status.k_maxScrollPosition) {  k_displayOffsetDirection = +1;
}
this._k_updateStatus({
k_scrollTopPosition: k_scrollTop,
k_displayOffsetDirection: k_displayOffsetDirection
});
if (this._k_suppressNextScrollEvent) {
this._k_suppressNextScrollEvent = false;
return;
}
if (this._k_isNativeScroll) {
this._k_isScrolling = false;
}
else {
this._k_isScrolling = false;
}
k_scrollType = this._k_browserSpecOnScrollHandler.apply(this, arguments);
k_scrollType = this._k_updateCurrentLine(k_scrollType);
this._k_callUserDefinedHandler(k_scrollType);
this._k_lastScrollPosition = this._k_element.getScroll().top;
},

_k_callUserDefinedHandler: function (k_scrollType) {
var
k_status = this.k_getStatus(),
k_currentLine = k_status.k_currentLine;
if (this._k_onScroll && (true !== this._k_isScrolling)) {
this._k_onScroll.call(this.k_owner || this, this, k_scrollType, k_currentLine);
}
},

_k_updateCurrentLine: function (k_scrollType) {
var
k_status = this.k_getStatus(),
k_currentLine = k_status.k_currentLine,
k_scrollTypes = this.k_SCROLL_TYPES,
k_scrollPosition = k_status.k_scrollTopPosition,
k_isDirectionDown = this._k_getRawStep() > 0 ? true : false,
k_pageStepInLines = k_status.k_pageStepInLines,
k_maxStartLine = k_status.k_maxStartLine,
k_multiplier = 1,
k_proxyScrollerScrollTop;
if (this._k_proxyScrollerEl) {
k_proxyScrollerScrollTop = this._k_proxyScrollerEl.dom.scrollTop;
}
if (true === this._k_isScrolling) {
return k_scrollType;
}
if (this._k_isNativeScroll && 0 === k_scrollPosition) {
this._k_updateStatus({
k_currentLine: 0,
k_scrollTopPosition: 0
});
this._k_lastScrollPosition = 0;
this._k_updateLastPageFlags(0);
return k_scrollType;
}
if ('object' === Ext.type(k_scrollType)) {
k_multiplier = k_scrollType.k_multiplier;
k_scrollType = k_scrollType.k_scrollType;
}
switch (k_scrollType) {
case k_scrollTypes.k_LINE_UP:
k_currentLine -= k_multiplier;
break;
case k_scrollTypes.k_LINE_DOWN:
k_currentLine += k_multiplier;
break;
case k_scrollTypes.k_PAGE_UP:
k_currentLine -= k_pageStepInLines * k_multiplier;
break;
case k_scrollTypes.k_PAGE_DOWN:
k_currentLine += k_pageStepInLines * k_multiplier;
break;
case k_scrollTypes.k_MOVE_UP:
k_currentLine = this._k_getLineFromScrollPosition();
break;
case k_scrollTypes.k_MOVE_DOWN:
k_currentLine = this._k_getLineFromScrollPosition();
break;
default: }
if (k_currentLine < 0) {
k_currentLine = 0;
}
else if (k_currentLine > k_maxStartLine) {
k_currentLine = k_maxStartLine;
}
this._k_updateStatus({
k_currentLine: k_currentLine,
k_isDirectionDown: k_isDirectionDown
});
this._k_updateLastPageFlags(k_currentLine);
if ((this._k_isPageRepositionRequested && (k_scrollType === k_scrollTypes.k_PAGE_DOWN || k_scrollType === k_scrollTypes.k_PAGE_UP)) ||
(this._k_isLineRepositionRequested && (k_scrollType === k_scrollTypes.k_LINE_DOWN || k_scrollType === k_scrollTypes.k_LINE_UP))) {
this._k_updateScrollerPosition(k_scrollType);
}
return k_scrollType;
},

_k_getLineFromScrollPosition: function() {
var k_maxStartLine = this.k_getStatus().k_maxStartLine;
return Math.round(k_maxStartLine * this._k_getRelativeScrollPosition());  },

_k_updateScrollerPosition: function(k_scrollType) {
var
k_status = this.k_getStatus(),
k_newScrollerPosition;
if (true === k_status.k_isBottomPosition && this._k_isNativeScroll) {
return;
}
k_newScrollerPosition = this._k_getScrollerPositionFromLine(k_status.k_currentLine);
this._k_setScrollPosition(k_newScrollerPosition, true);
},

_k_getScrollerPositionFromLine: function (k_currentLine) {
var
k_status = this.k_getStatus(),
k_maxScrollPosition = k_status.k_maxScrollPosition,
k_nativeScrollPosition,
k_lineHeight,
k_scrollerPosition,
k_maxNativeScrollPosition;
if (this._k_isNativeScroll) {
if (this._k_fakeScrollers || this._k_isLineRepositionRequested) {
k_lineHeight = k_status.k_lineHeight;
}
else {
k_lineHeight = k_status.k_lineScrollStep;
}
k_scrollerPosition = k_currentLine * k_lineHeight;
}
else {
k_nativeScrollPosition = this._k_getNativeScrollerPositionFromLine(k_currentLine);
k_maxNativeScrollPosition = k_status.k_maxNativeScrollPosition;
k_scrollerPosition = Math.floor(k_nativeScrollPosition / k_maxNativeScrollPosition * k_maxScrollPosition);
if (0 === k_nativeScrollPosition || k_maxNativeScrollPosition === k_nativeScrollPosition) {
if (0 === k_nativeScrollPosition) {
k_scrollerPosition = 0;
}
else {
k_scrollerPosition = k_maxScrollPosition;
}
}
else {
if (k_scrollerPosition < this._k_threshold) {
k_scrollerPosition = this._k_threshold;
}
else if (k_scrollerPosition > k_maxScrollPosition - this._k_threshold) {
k_scrollerPosition = k_maxScrollPosition - this._k_threshold;
}
}
}
return k_scrollerPosition;
},

_k_getNativeScrollerPositionFromLine: function (k_currentLine) {
return k_currentLine * this._k_status.k_lineScrollStep + this._k_status.k_invisiblePartOfLine;
},

_k_updateLastPageFlags: function(k_currentLine) {
var
k_status = this.k_getStatus(),
k_isLastLineVisible,
k_isBottomPosition;
if (k_status.k_maxStartLine === k_currentLine) {
k_isLastLineVisible = true;
k_isBottomPosition = k_status.k_nativeScrollPosition === k_status.k_maxNativeScrollPosition;
}
else {
k_isLastLineVisible = false;
k_isBottomPosition = false;
}
this._k_updateStatus({
k_isLastLineVisible: k_isLastLineVisible,
k_isBottomPosition: k_isBottomPosition
});
},

_k_getRawStep: function () {
return this.k_getStatus().k_scrollTopPosition - this._k_lastScrollPosition;
},

_k_getRelativeScrollPosition: function () {
var
k_status = this.k_getStatus(),
k_correction = k_status.k_displayOffset ? k_status.k_lineHeight - k_status.k_displayOffset : 0;
return 0 === k_status.k_maxScrollPosition ? 0 : k_status.k_scrollTopPosition / (k_status.k_maxScrollPosition - k_correction);
},

_k_getScrollBottom: function () {
var
k_element = this._k_element,
k_scrollBottom;
k_scrollBottom = this._k_elementContent.getHeight() - k_element.dom.clientHeight;
if (k_scrollBottom < 0) {  k_scrollBottom = 0;
}
return k_scrollBottom;
},

_k_setScrollPosition: function (k_scrollPosition, k_suppressScrollEvent) {
var
k_status = this.k_getStatus(),
k_maxScrollPosition = k_status.k_maxScrollPosition;
this._k_suppressNextScrollEvent = (true === k_suppressScrollEvent);
if (k_scrollPosition < 0) {
k_scrollPosition = 0;
}
if (k_scrollPosition > k_maxScrollPosition) {
k_scrollPosition = k_maxScrollPosition;
}
this._k_lastScrollPosition = k_scrollPosition;
if (k_status.k_scrollTopPosition === k_scrollPosition) {
this._k_suppressNextScrollEvent = false;
}
else {
this._k_updateStatus({k_scrollTopPosition: k_scrollPosition});
this._k_element.dom.scrollTop = k_scrollPosition;
}
},

k_scrollToBottom: function (k_suppressScrollEvent) {
var k_status = this.k_getStatus();
if (k_suppressScrollEvent) {
this._k_updateStatus({k_currentLine: k_status.k_maxStartLine});
}
this._k_updateStatus({k_displayOffsetDirection: k_status.k_totalLines < k_status.k_linesPerPage ? -1 : +1});
k_suppressScrollEvent = true === k_suppressScrollEvent;
this._k_setScrollPosition(k_status.k_maxScrollPosition, k_suppressScrollEvent);
this._k_updateLastPageFlags(k_status.k_maxStartLine);
},


_k_onMouseDownHandlerIE: function (k_extEvent) {
this._k_scrollbarAction = this._k_getActScrollbarActionIE(k_extEvent.getXY());
},

_k_getActScrollbarActionIE: function(k_coords) {
var k_action;
if (kerio.lib.k_isMSIE8 || kerio.lib.k_isMSIE9 || kerio.lib.k_isMSIE10 || kerio.lib.k_isMSIE11 || kerio.lib.k_isMSEdge) {
k_action = this._k_fixComponentFromPoint(k_coords[0], k_coords[1]);
}
else {
k_action = this._k_element.dom.componentFromPoint(k_coords[0], k_coords[1]);
}
if ('' === k_action) {
if (null !== this._k_scrollbarActionAfterKeyIE) {
k_action = this._k_scrollbarActionAfterKeyIE;
this._k_scrollbarActionAfterKeyIE = null;
this._k_scrollbarAction = null;
}
}
return k_action;
},

_k_fixComponentFromPoint: function(k_x, k_y) {
var
k_status = this.k_getStatus(),
k_viewHeight = k_status.k_viewHeight,
k_scrollbarSize = k_status.k_scrollbarSize,
k_scrollbarWidth = k_scrollbarSize.k_width,
k_scrollbarHeight = k_status.k_hasHorizontalScrollbar ? k_scrollbarSize.k_height : 0,
k_box = this._k_element.getBox(),
k_right = k_box.right - this._k_element.getFrameWidth('r'),
k_top = k_box.y + this._k_element.getFrameWidth('t'),
k_bottom = k_box.bottom + this._k_element.getFrameWidth('b') - k_scrollbarHeight,
k_arrowHeight = k_scrollbarSize.k_arrowHeight,
k_minThumbHeight = k_scrollbarSize.k_minThumbHeight,
k_action = '',
k_scrollArea,
k_thumbHeight,
k_thumbPosition;
if (!k_status.k_hasVerticalScrollbar) {
return '';
}
if (k_x < k_right && k_x >= k_right - k_scrollbarWidth) {  if (k_y >= k_top && k_y < k_top + k_arrowHeight) {
k_action = 'scrollbarUp';
}
else if (k_y < k_bottom && k_y >= k_bottom - k_arrowHeight) {
k_action = 'scrollbarDown';
}
else {
k_scrollArea = k_viewHeight - 2 * k_arrowHeight;  k_thumbHeight = k_scrollArea / ((k_viewHeight + k_status.k_maxScrollPosition) / k_viewHeight);
k_thumbHeight = Math.max(k_thumbHeight, k_minThumbHeight);
k_scrollArea -= k_thumbHeight;  k_thumbPosition = k_top + k_arrowHeight + k_status.k_scrollTopPosition / k_status.k_maxScrollPosition * k_scrollArea;
if (k_y < k_thumbPosition) {
k_action = 'scrollbarPageUp';
}
else {
if (k_y > k_thumbPosition + k_thumbHeight) {
k_action = 'scrollbarPageDown';
}
else {
k_action = 'scrollbarVThumb';
}
}
}
}
return k_action;
},

_k_onKeyDownHandlerIE: function (k_extEvent) {
var
k_key = k_extEvent.getKey(),
k_pageStep = this._k_getPageScrollStep(),
k_lineStep = this._k_getLineScrollStep(),
k_element =  this._k_element,
k_maxScrollPosition = this._k_getScrollBottom(),
k_currentPosition = k_element.getScroll().top,
k_scrollbarAction = null,
k_newPosition,
k_direction,
k_step;
if (this._k_focusEl !== k_extEvent.getTarget()) {
this.k_focus();
}
switch (k_key) {
case k_extEvent.DOWN:
k_scrollbarAction = 'scrollbarDown';
k_direction = 1;
k_step = k_lineStep;
break;
case k_extEvent.UP:
k_scrollbarAction = 'scrollbarUp';
k_direction = -1;
k_step = k_lineStep;
break;
case k_extEvent.PAGEDOWN:
k_scrollbarAction = 'scrollbarPageDown';
k_direction = 1;
k_step = k_pageStep;
break;
case k_extEvent.PAGEUP:
k_scrollbarAction = 'scrollbarPageUp';
k_direction = -1;
k_step = k_pageStep;
break;
}
if (null === k_scrollbarAction) {
this._k_scrollbarActionAfterKeyIE = null;
return;
}
k_extEvent.preventDefault();
this._k_scrollbarActionAfterKeyIE = k_scrollbarAction;
k_newPosition = k_currentPosition + k_direction * k_step;
if (k_newPosition < 0) {
k_newPosition = 0;
}
else if (k_newPosition > k_maxScrollPosition) {
k_newPosition = k_maxScrollPosition;
}
k_element.dom.scrollTop = k_newPosition;
},

_k_onScrollHandlerIE: function (k_extEvent) {
var
k_status = this.k_getStatus(),
k_pos = k_status.k_scrollTopPosition,
k_scrollBottom = k_status.k_maxScrollPosition,
k_lineStep = k_status.k_lineScrollStep,
k_pageStep = k_status.k_pageScrollStep,
k_step = this._k_getScrollStep(),
k_scrollbarAction = this._k_getActScrollbarActionIE(k_extEvent.getXY()),
k_scrollTypes = this.k_SCROLL_TYPES,
k_scrollType = null,
k_buggyDiff = kerio.lib.k_isMSIE7 ? 0 : 1,  k_koef;
if (this._k_scrollbarAction && (k_scrollbarAction !== this._k_scrollbarAction)) {
k_scrollbarAction = this._k_scrollbarAction;
}
k_koef = (('scrollbarUp' === k_scrollbarAction) || ('scrollbarPageUp' === k_scrollbarAction)) ? -1 : 1;
if (('scrollbarDown' === k_scrollbarAction) || ('scrollbarUp' === k_scrollbarAction)) {
if (Math.abs(k_step - k_lineStep) > k_buggyDiff) { if (0 === k_step || 0 === k_pos || k_scrollBottom === k_pos) { this._k_scrollbarAction = null;
k_scrollType = (1 === k_koef) ? k_scrollTypes.k_LINE_DOWN : k_scrollTypes.k_LINE_UP;
this._k_isScrolling = false;
}
}
else {
this._k_scrollbarAction = null;
k_scrollType = (1 === k_koef) ? k_scrollTypes.k_LINE_DOWN : k_scrollTypes.k_LINE_UP;
this._k_isScrolling = false;
}
}
else {
if (('scrollbarPageDown' === k_scrollbarAction) || ('scrollbarPageUp' === k_scrollbarAction)) {
if (Math.abs(k_step - k_pageStep) > k_buggyDiff) {
if (0 === k_step || 0 === k_pos || k_scrollBottom === k_pos) {
this._k_scrollbarAction = null;
k_scrollType = (1 === k_koef) ? k_scrollTypes.k_PAGE_DOWN : k_scrollTypes.k_PAGE_UP;
this._k_isScrolling = false;
}
}
else {
this._k_scrollbarAction = null;
k_scrollType = (1 === k_koef) ? k_scrollTypes.k_PAGE_DOWN : k_scrollTypes.k_PAGE_UP;
this._k_isScrolling = false;
}
}
else { if (('scrollbarPageDown' === this._k_scrollbarAction) || 'scrollbarPageUp' === this._k_scrollbarAction) {
k_koef = (('scrollbarPageUp' === this._k_scrollbarAction) ? -1 : 1);
if (k_step !== k_pageStep) {
if (0 === k_step || 0 === k_pos || k_scrollBottom === k_pos) {
this._k_scrollbarAction = null;
k_scrollType = (1 === k_koef) ? k_scrollTypes.k_PAGE_DOWN : k_scrollTypes.k_PAGE_UP;
this._k_isScrolling = false;
}
}
else {
this._k_scrollbarAction = null;
k_scrollType = (1 === k_koef) ? k_scrollTypes.k_PAGE_DOWN : k_scrollTypes.k_PAGE_UP;
this._k_isScrolling = false;
}
}
else {
k_scrollType = this._k_getRawStep() > 0 ? k_scrollTypes.k_MOVE_DOWN : k_scrollTypes.k_MOVE_UP;
this._k_isScrolling = false;
}
}
}
return k_scrollType;
},


_k_onScrollHandlerFirefox: function () {
var
k_status = this.k_getStatus(),
k_lineStep = k_status.k_lineScrollStep,
k_pageStep = k_status.k_pageScrollStep,
k_step = this._k_getScrollStep(),
k_koef = this._k_getRawStep(),
k_scrollTypes = this.k_SCROLL_TYPES,
k_scrollType = null;
if (this._k_isSmoothScrollFirefox) {
k_scrollType = this._k_onSmoothScrollFirefox();
return k_scrollType;
}
if (k_step === k_lineStep) {
k_scrollType = 0 < k_koef ? k_scrollTypes.k_LINE_DOWN : k_scrollTypes.k_LINE_UP;
}
else if (k_step === k_pageStep) {
k_scrollType = 0 < k_koef ? k_scrollTypes.k_PAGE_DOWN : k_scrollTypes.k_PAGE_UP;
}
else {
k_scrollType = 0 < k_koef ? k_scrollTypes.k_MOVE_DOWN : k_scrollTypes.k_MOVE_UP;
if (kerio.lib.k_isFirefox3) {
k_scrollType = this._k_firefox3Fix(k_status, k_step, k_koef);
}
if (kerio.lib.k_isFirefox && !kerio.lib.k_isFirefoxLess4 && this._k_isScrollKey(this._k_lastKeyDown)) {
k_scrollType = this._k_firefox4Fix();
}
}
this._k_isScrolling = false;
return k_scrollType;
},

_k_firefox3Fix: function(k_status, k_step, k_koef) {
var
k_lineStep = k_status.k_lineScrollStep,
k_pageStep = k_status.k_pageScrollStep,
k_scrollTypes = this.k_SCROLL_TYPES,
k_scrollType = 0 < k_koef ? k_scrollTypes.k_MOVE_DOWN : k_scrollTypes.k_MOVE_UP,
k_potentialPages,
k_potentialPagesDiff,
k_potentialLines,
k_potentialLinesDiff;
if (this._k_isNativeScroll) {
if (k_status.k_totalLines > 500000) {
if (this._k_getRelativeScrollPosition() > 0.5) {
if (k_lineStep > Math.abs(k_lineStep - k_step)) {
k_scrollType = 0 < k_koef ? k_scrollTypes.k_LINE_DOWN : k_scrollTypes.k_LINE_UP;
}
else if (this._k_buggyDifference >= Math.abs(k_pageStep - k_step)) {
k_scrollType = 0 < k_koef ? k_scrollTypes.k_PAGE_DOWN : k_scrollTypes.k_PAGE_UP;
}
}
}
}
else {
if (k_step >= k_pageStep) {
k_potentialPages = Math.floor(k_step / k_pageStep);
k_potentialPagesDiff = k_step % k_pageStep;
if (k_step < k_status.k_smallMoveLimit && k_potentialPages * this._k_buggyDifference >= k_potentialPagesDiff) {
k_scrollType = {
k_scrollType: 0 < k_koef ? k_scrollTypes.k_PAGE_DOWN : k_scrollTypes.k_PAGE_UP,
k_multiplier: k_potentialPages
};
}
}
else {
k_potentialLines = Math.ceil(k_step / k_lineStep);
k_potentialLinesDiff = k_step % k_lineStep;
if (k_potentialLines * this._k_buggyDifference >= k_potentialLinesDiff) {
k_scrollType = {
k_scrollType: 0 < k_koef ? k_scrollTypes.k_LINE_DOWN : k_scrollTypes.k_LINE_UP,
k_multiplier: k_potentialLines
};
}
}
}
return k_scrollType;
},

_k_firefox4Fix: function() {
var
k_eventObject = Ext.EventObject,
k_scrollTypes = this.k_SCROLL_TYPES,
k_scrollType;
switch (this._k_lastKeyDown) {
case k_eventObject.DOWN    : k_scrollType = k_scrollTypes.k_LINE_DOWN; break;
case k_eventObject.UP      : k_scrollType = k_scrollTypes.k_LINE_UP; break;
case k_eventObject.PAGEDOWN: k_scrollType = k_scrollTypes.k_PAGE_DOWN; break;
case k_eventObject.PAGEUP  : k_scrollType = k_scrollTypes.k_PAGE_UP; break;
}
return k_scrollType;
},

_k_isScrollKey: function(k_key) {
var k_eventObject = Ext.EventObject;
return k_eventObject.DOWN === k_key || k_eventObject.UP === k_key || k_eventObject.PAGEDOWN === k_key || k_eventObject.PAGEUP === k_key;
},

_k_resetLastKeyDown: function() {
this._k_lastKeyDown = null;
},

_k_onSmoothScrollFirefox: function () {
var
k_status = this.k_getStatus(),
k_lineStep = k_status.k_lineScrollStep,
k_pageStep = k_status.k_pageScrollStep,
k_step = this._k_getScrollStep(),
k_koef = this._k_getRawStep(),
k_scrollTypes = this.k_SCROLL_TYPES,
k_scrollType = null,
k_scrollStepSum = this._k_scrollStepSumFirefox;
k_scrollStepSum += k_step;
if (k_step < k_lineStep && (k_scrollStepSum === k_lineStep || (k_scrollStepSum > k_lineStep && 'line' === this._k_lastScrollAction))) { k_scrollType = (0 < k_koef) ? k_scrollTypes.k_LINE_DOWN : k_scrollTypes.k_LINE_UP;
k_scrollStepSum -= k_lineStep;
if (true === this._k_isMouseButtonPressedFirefox) {
this._k_lastScrollAction = 'line';
}
this._k_isScrolling = false;
}
else if (k_scrollStepSum === k_pageStep || (k_scrollStepSum > k_pageStep && 'page' === this._k_lastScrollAction)) { k_scrollType = (0 < k_koef) ? k_scrollTypes.k_PAGE_DOWN : k_scrollTypes.k_PAGE_UP;
k_scrollStepSum -= k_pageStep;
if (true === this._k_isMouseButtonPressedFirefox) {
this._k_lastScrollAction = 'page';
}
this._k_isScrolling = false;
}
else {
if (this._k_isNativeScroll) {
if ((k_scrollStepSum > k_lineStep && k_step < k_lineStep) || (k_scrollStepSum > k_pageStep)) { k_scrollType = k_scrollTypes.k_SCROLLER_MOVE;
k_scrollStepSum = 0;
this._k_isScrolling = false;
}
else { k_scrollType = k_scrollTypes.k_SMOOTH_SCROLL;
}
}
else {
if (k_step > k_pageStep) { k_scrollType = k_scrollTypes.k_SCROLLER_MOVE;
k_scrollStepSum = 0;
this._k_isScrolling = false;
}
else { k_scrollType = k_scrollTypes.k_SMOOTH_SCROLL;
}
}
}
this._k_scrollStepSumFirefox = k_scrollStepSum;
return k_scrollType;
},

_k_detectSmoothScrollFirefox: function () {
return false;
},

_k_onMouseDownHandlerFirefox: function () {
this._k_isMouseButtonPressedFirefox = true;
},

_k_onMouseUpHandlerFirefox: function () {
this._k_isMouseButtonPressedFirefox = false;
},


_k_onScrollHandlerSafari: function () {
var
k_status = this.k_getStatus(),
k_lineStep = k_status.k_lineScrollStep,
k_pageStep = k_status.k_pageScrollStep,
k_step = this._k_getScrollStep(),
k_koef = this._k_getRawStep(),
k_scrollTypes = this.k_SCROLL_TYPES,
k_scrollType = null;
if (k_step === k_lineStep) {
k_scrollType = 0 < k_koef ? k_scrollTypes.k_LINE_DOWN : k_scrollTypes.k_LINE_UP;
this._k_isScrolling = false;
}
else {
if (k_step === k_pageStep) {
k_scrollType = 0 < k_koef ? k_scrollTypes.k_PAGE_DOWN : k_scrollTypes.k_PAGE_UP;
this._k_isScrolling = false;
}
else {
k_scrollType = 0 < k_koef ? k_scrollTypes.k_MOVE_DOWN : k_scrollTypes.k_MOVE_UP;
this._k_isScrolling = false;
}
}
return k_scrollType;
},

_k_addFakeScrollers: function() {
if (this._k_fakeScrollers) {
return;  }
var
k_status = this.k_getStatus(),
k_scrollbarWidth = k_status.k_scrollbarSize.k_width,
k_arrowHeight = k_status.k_scrollbarSize.k_arrowHeight,
k_element = this._k_element,
k_container = k_element.parent(),
k_htmlTemplate,
k_fakeArrowUp,
k_fakeArrowDn,
k_arrowUp,
k_arrowDn;
k_htmlTemplate = {tag: 'div', cls: 'scrollArrowClip', children: [
{tag: 'div', cls: 'fakeScroller', children: [{tag: 'div'}]}
]};
k_fakeArrowUp = k_container.createChild(k_htmlTemplate);
k_fakeArrowDn = k_container.createChild(k_htmlTemplate);
k_arrowUp = k_fakeArrowUp.first();
k_arrowDn = k_fakeArrowDn.first();
k_arrowUp.setLeftTop(k_scrollbarWidth - 30, 0);                       k_arrowDn.setLeftTop(k_scrollbarWidth - 30, k_arrowHeight - 100);  k_fakeArrowUp.setSize(k_scrollbarWidth, k_arrowHeight);
k_fakeArrowDn.setSize(k_scrollbarWidth, k_arrowHeight);
k_arrowUp.on('scroll', this._k_fakeScrollerOnScroll, this, {k_scroller: k_arrowUp});
k_arrowDn.on('scroll', this._k_fakeScrollerOnScroll, this, {k_scroller: k_arrowDn});
this._k_fakeScrollers = {
k_fakeArrowUp: k_fakeArrowUp,
k_fakeArrowDn: k_fakeArrowDn,
k_arrowUp: k_arrowUp,
k_arrowDn: k_arrowDn
};
k_arrowUp.dom.scrollTop = 50;  },

_k_removeFakeScrollers: function() {
var k_fakeScrollers = this._k_fakeScrollers;
if (k_fakeScrollers) {
k_fakeScrollers.k_fakeArrowUp.remove();
k_fakeScrollers.k_fakeArrowDn.remove();
delete this._k_fakeScrollers;
}
},

_k_fakeScrollerOnScroll: function(k_extEvent, k_targetElement, k_options) {
var
k_status = this.k_getStatus(),
k_scrollPosition = k_status.k_scrollTopPosition,
k_lineHeight = k_status.k_lineHeight,
k_fakeScroller = k_options.k_scroller;
if (50 == k_fakeScroller.dom.scrollTop) {
return;
}
if (k_fakeScroller === this._k_fakeScrollers.k_arrowUp) {
k_scrollPosition -= k_lineHeight;
}
else {
k_scrollPosition += k_lineHeight;
}

this._k_scrollbarAction = this._k_getActScrollbarActionIE(k_extEvent.getXY());
this._k_setScrollPosition(k_scrollPosition);
k_fakeScroller.dom.scrollTop = 50;
},

_k_setFakeScrollersPosition: function() {
var
k_status = this.k_getStatus(),
k_fakeScrollers = this._k_fakeScrollers,
k_element = this._k_element,
k_bottomBorderWidth,
k_rightBorderWidth,
k_topOffset,
k_bottomOffset;
if (k_fakeScrollers) {
k_bottomBorderWidth = k_element.getBorderWidth('b');
k_rightBorderWidth = k_element.getBorderWidth('r');
k_topOffset = k_element.getBorderWidth('t');
k_bottomOffset = k_status.k_scrollbarSize.k_width + k_bottomBorderWidth;
k_fakeScrollers.k_fakeArrowUp.alignTo(k_element, 'tr-tr', [-k_rightBorderWidth,  k_topOffset   ]);
k_fakeScrollers.k_fakeArrowDn.alignTo(k_element, 'br-br', [-k_rightBorderWidth, -k_bottomOffset]);
}
},

_k_fixWebkitKeys: function (k_extEvent) {
var
k_key = k_extEvent.getKey(),
k_status = this._k_status,
k_currentLine = k_status.k_currentLine,
k_newLine = null;
switch (k_key) {
case k_extEvent.UP:
k_newLine = k_currentLine - 1;
break;
case k_extEvent.DOWN:
k_newLine = k_currentLine + 1;
break;
case k_extEvent.PAGE_UP:
k_newLine = k_currentLine - k_status.k_pageStepInLines;
break;
case k_extEvent.PAGE_DOWN:
k_newLine = k_currentLine + k_status.k_pageStepInLines;
break;
case k_extEvent.HOME:
k_newLine = 0;
break;
case k_extEvent.END:
k_extEvent.stopEvent();
this.k_scrollToBottom();
break;
default:
}
if (null !== k_newLine) {
k_extEvent.stopEvent();
this.k_scrollToLine(k_newLine);
}
},

_k_fixSafariPageUpDownKeys: function(k_extEvent) {
var
k_key = k_extEvent.getKey(),
k_pageStepInLines = this._k_status.k_pageStepInLines,
k_line;
if (k_extEvent.PAGEDOWN === k_key || k_extEvent.PAGEUP === k_key) {
k_extEvent.stopEvent();
k_line = this._k_status.k_currentLine  + (k_extEvent.PAGEDOWN === k_key ? k_pageStepInLines : -k_pageStepInLines);
this.k_scrollToLine(k_line);
}
},

_k_getWheelDelta: (function() {
if (Ext.isMac) {
if (Ext.isGecko) {
return function(k_extEvent) {
return -k_extEvent.browserEvent.detail;  };
}
else if (kerio.lib.k_isSafari4 || kerio.lib.k_browserInfo._k_currentBrowser.k_webKitVersion >= 534) {
return function(k_extEvent) {
var k_browserWheelDelta = k_extEvent.browserEvent.wheelDelta;
if (Math.abs(k_browserWheelDelta) < this._k_safariMinWheelDelta) {
this._k_safariMinWheelDelta = Math.max(Math.abs(k_browserWheelDelta), 1);
}
return k_browserWheelDelta / this._k_safariMinWheelDelta;
};
}
}
return function(k_extEvent) {
return k_extEvent.getWheelDelta();
};
})(),  
_k_setScrollLeft: function (k_scrollLeft) {
this._k_element.dom.scrollLeft = k_scrollLeft;
}
};


kerio.lib._K_SelectionContainer = function() {
this._k_visibleSelection = null;
this._k_rowSelector = 'singleRow';
this._k_rowContentSelector = 'rowContent';
if (kerio.lib.k_isMSEdge) {
this.k_applyMSEdgePatch();
}
};
kerio.lib._K_SelectionContainer.prototype = (function () {
if (kerio.lib.k_isMSIE) {

return {

_k_isUserSelection: function() {
return 'Text' === document.selection.type;
},

_k_getSelectedRange: function() {
var
k_selection = document.selection,
k_range = k_selection.createRange(),
k_tmpRange = k_range.duplicate(),
k_collapsed = 0 === k_range.text.length,
k_startNode,
k_endNode,
k_row,
k_startNodeInfo,
k_endNodeInfo,
k_startPos,
k_endPos,
k_direction;
if (!this._k_hasExpectedParent(k_range)) {
k_selection.empty();
this.k_removeCurrentSelection();
return null;
}
if (this._k_visibleSelection && this._k_visibleSelection.k_caret) {
k_direction = 0 === k_range.compareEndPoints('EndToEnd', this._k_visibleSelection.k_caret) ? 'BACKWARD' : 'FORWARD';
}
k_tmpRange.collapse();
k_startNode = k_tmpRange.parentElement();
k_tmpRange.setEndPoint('EndToEnd', k_range);
k_tmpRange.collapse(false);
k_endNode = k_tmpRange.parentElement();
k_row = this._k_findRow(k_startNode);
if (!k_row) {  return null;
}
k_tmpRange.moveToElementText(k_row);
k_tmpRange.setEndPoint('EndToStart', k_range);
k_startPos = k_tmpRange.text.length;
k_startNodeInfo = this._k_getSelectedTextNodeInfo(k_row, k_tmpRange);
if (k_startNode !== k_endNode) {
k_row = this._k_findRow(k_endNode);
k_tmpRange.moveToElementText(k_row);
}
k_tmpRange.setEndPoint('EndToEnd', k_range);
k_endPos = k_tmpRange.text.length;
k_endNodeInfo = this._k_getSelectedTextNodeInfo(k_row, k_tmpRange);
k_selection.empty();
return {
k_startNode   : k_startNodeInfo.k_node,
k_startOffset : k_startNodeInfo.k_length,
k_endNode     : k_endNodeInfo.k_node,
k_endOffset   : k_endNodeInfo.k_length,
k_startPos    : k_startPos,
k_endPos      : k_endPos,
k_collapsed   : k_collapsed,
k_direction   : k_direction
};
},  
_k_getSelectedTextNodeInfo: function(k_row, k_range) {
var
k_node = k_row.cloneNode(),
k_htmlText,
k_char,
k_path;
if ('' === k_range.text) {  k_node = this._k_getTextNode(k_row, 'FIRST');
}
else {
k_htmlText = k_range.htmlText;
if (kerio.lib.k_isMSIE10) {
k_char = k_htmlText.charCodeAt(0);
while (13 === k_char || 10 === k_char) {
k_htmlText = k_htmlText.substr(1);
k_char = k_htmlText.charCodeAt(0);
}
}
k_node.innerHTML = k_htmlText;
while (k_node.lastChild) {
k_node = k_node.lastChild;
}
}
k_path = this._k_getDOMWalkerToTextNode(k_node);
return {
k_node: this._k_getNodeByDOMWalker(k_row, k_path),
k_length: '' === k_range.text ? 0 : k_node.data.length
};
},

_k_highlightPartOfText: function(k_range) {
var
k_startOffset = k_range.k_startOffset,
k_endOffset = k_range.k_endOffset - k_range.k_startOffset,
k_textRange,
k_span,
k_parentNode,
k_selectedTextNode,
k_restTextNode,
k_htmlText;
if (k_range.k_startNode === k_range.k_endNode) {
if (0 === k_endOffset) {  return;
}
k_span = document.createElement('span');
k_span.className = 'selectedText ' + k_range.k_className;
k_span.id = kerio.lib.k_getGeneratedId();  k_selectedTextNode = k_range.k_startNode;
k_parentNode = k_selectedTextNode.parentNode;
if (k_range.k_endOffset < k_selectedTextNode.data.length) { k_restTextNode = k_selectedTextNode.splitText(k_range.k_endOffset);
if (k_selectedTextNode.nextSibling) {
k_parentNode.insertBefore(k_restTextNode, k_selectedTextNode.nextSibling);
}
else {
k_parentNode.appendChild(k_restTextNode);
}
}
k_parentNode.insertBefore(k_span, k_selectedTextNode);
if (0 !== k_range.k_startOffset) { k_restTextNode = k_selectedTextNode.splitText(k_range.k_startOffset);
k_parentNode.insertBefore(k_selectedTextNode, k_span);
k_selectedTextNode = k_restTextNode;
}
k_span.appendChild(k_selectedTextNode);
}
else {
k_startOffset = k_range.k_startPos;
k_endOffset = k_range.k_endPos - k_range.k_startPos;
k_textRange = document.body.createTextRange();
k_textRange.moveToElementText(k_range.k_startNode.parentNode);
k_textRange.collapse(true);
k_textRange.moveStart('character', k_startOffset);
k_textRange.moveEnd('character', k_endOffset);
k_htmlText = k_textRange.htmlText;
k_htmlText = '<span class="selectedText ' + k_range.k_className + '">' + k_textRange.htmlText + '</span>';
k_textRange.pasteHTML(k_htmlText);
}
},

_k_getTextLength: function(k_element) {
return k_element.innerText.length;
},

_k_insertCaret: function() {
var
k_visibleSelection = this._k_visibleSelection,
k_range = k_visibleSelection.k_range,
k_visibleRange = document.body.createTextRange(),
k_tmpRange = k_visibleRange.duplicate();
k_visibleRange.moveToElementText(k_visibleSelection.k_firstRow);
k_visibleRange.moveStart('character', k_range.k_startPos);
k_visibleRange.collapse();
k_tmpRange.moveToElementText(k_visibleSelection.k_lastRow);
k_tmpRange.moveStart('character', k_range.k_endPos);
k_visibleRange.setEndPoint('EndToStart', k_tmpRange);
k_visibleRange.collapse('FORWARD' === (k_visibleSelection.k_range.k_direction || k_visibleSelection.k_direction));
k_visibleRange.select();
k_visibleSelection.k_caret = k_visibleRange.duplicate();
},

k_clearBrowserSelection: function() {
document.selection.empty();
}
};
}  else {

return {

_k_isUserSelection: function() {
var k_selection = window.getSelection();
return k_selection.rangeCount > 0;
},

_k_getSelectedRange: function() {
var
k_selection = window.getSelection(),
k_range,
k_direction,
k_tmpRange,
k_row,
k_startPos,
k_endPos;
k_range = k_selection.getRangeAt(0);
if (!this._k_hasExpectedParent(k_range)) {
k_selection.removeAllRanges();
this.k_removeCurrentSelection();
return null;
}
if (this._k_visibleSelection && this._k_visibleSelection.k_caret) {
k_direction = 0 === k_range.compareBoundaryPoints(window.Range.END_TO_END, this._k_visibleSelection.k_caret) ? 'BACKWARD' : 'FORWARD';
}
k_selection.removeAllRanges();
k_row = this._k_findRow(k_range.startContainer);
if (!k_row) {
return null;  }
k_tmpRange = k_range.cloneRange();
k_tmpRange.collapse(true);  k_tmpRange.setStart(k_row, 0);
k_startPos = k_tmpRange.toString().length;
if (k_range.startContainer !== k_range.endContainer) {
k_row = this._k_findRow(k_range.endContainer);
}
k_tmpRange = k_range.cloneRange();
k_tmpRange.collapse(false);  k_tmpRange.setStart(k_row, 0);
k_endPos = k_tmpRange.toString().length;
return {
k_startNode   : k_range.startContainer,
k_endNode     : k_range.endContainer,
k_startOffset : k_range.startOffset,
k_endOffset   : k_range.endOffset,
k_startPos    : k_startPos,
k_endPos      : k_endPos,
k_collapsed   : k_range.collapsed,
k_direction   : k_direction
};
},

_k_highlightPartOfText: function(k_range) {
var
k_textRange = document.createRange(),
k_coverNode = document.createElement('span');
k_coverNode.className = 'selectedText ' + k_range.k_className;
k_range.k_startOffset = Math.max(0, Math.min(k_range.k_startOffset, k_range.k_startNode.data.length));
k_range.k_endOffset = Math.max(0, Math.min(k_range.k_endOffset, k_range.k_endNode.data.length));
k_textRange.setStart(k_range.k_startNode, k_range.k_startOffset);
k_textRange.setEnd(k_range.k_endNode, k_range.k_endOffset);
k_textRange.surroundContents(k_coverNode);
},

_k_getTextLength: function(k_element) {
return k_element.textContent.length;
},

_k_insertCaret: function() {
var
k_browserSelection = window.getSelection(),
k_visibleSelection = this._k_visibleSelection,
k_anchorNodeDom,
k_anchorNodeEl,
k_hiddenAnchorEnvelope,
k_tmpRange = document.createRange(),
k_range = k_visibleSelection.k_range;
k_anchorNodeDom = k_browserSelection.anchorNode;
if (k_browserSelection.rangeCount > 0 && k_anchorNodeDom) {
if (3 === k_anchorNodeDom.nodeType) { k_anchorNodeDom = k_anchorNodeDom.parentNode;
}
if (1 === k_anchorNodeDom.nodeType) { k_anchorNodeEl = Ext.get(k_anchorNodeDom);
}
if (k_anchorNodeEl) { k_hiddenAnchorEnvelope = k_anchorNodeEl.findParent('{display=none}');
}
if (k_hiddenAnchorEnvelope) {
k_hiddenAnchorEnvelope.style.display = 'block';
}
k_browserSelection.removeAllRanges();
if (k_hiddenAnchorEnvelope) {
k_hiddenAnchorEnvelope.style.display = 'none';
}
}
k_range.k_startNode = null;
k_range = this._k_normalizeSelection(k_visibleSelection);
k_visibleSelection.k_range = k_range;
k_tmpRange.setStart(k_range.k_startNode, k_range.k_startOffset);
k_tmpRange.setEnd(k_range.k_endNode, k_range.k_endOffset);
k_tmpRange.collapse('FORWARD' === (k_visibleSelection.k_range.k_direction || k_visibleSelection.k_direction));
k_browserSelection.addRange(k_tmpRange);
k_visibleSelection.k_caret = k_tmpRange.cloneRange();
},

k_clearBrowserSelection: function() {
window.getSelection().removeAllRanges();
}
};
}  }());
Ext.apply(kerio.lib._K_SelectionContainer.prototype, {
_k_SELECTION_USER: 'user',
_k_SELECTION_HIGHLIGHT: 'find',
_k_SELECTION_CARET: 'CARET',

_k_hasExpectedParent: function(k_browserRange) {
var
k_rangeParentElement = k_browserRange.commonAncestorContainer || k_browserRange.parentElement(),
k_className;
try {
k_className = k_rangeParentElement.className;
}
catch (k_e) {
return false;
}
if (3 === k_rangeParentElement.nodeType) {  return true;
}
if (!k_className) {
return false;
}
return (-1 !== k_className.indexOf(this._k_rowContentSelector)
|| -1 !== k_className.indexOf(this._k_rowSelector)
|| (-1 !== k_className.indexOf('data') && -1 !== k_className.indexOf('selectable')));
},

k_keepUserSelection: function(k_direction) {
var k_range;
if (this._k_isUserSelection()) {
k_range = this._k_getSelectedRange();
}
if (k_range) {
k_range.k_className = k_range.k_collapsed ? this._k_SELECTION_CARET : this._k_SELECTION_USER;
this._k_visibleSelection = this.k_createSelection(k_range);
if (null === this._k_visibleSelection) {
return null;
}
if (k_direction) {
this._k_visibleSelection.k_direction = k_direction;
this._k_visibleSelection.k_range.k_direction = null;
}
}
else {
this.k_removeCurrentSelection();
this._k_visibleSelection = null;
}
return this._k_visibleSelection;
},

k_createSelection: function(k_range) {
var
k_startNode = k_range.k_startNode,
k_endNode = k_range.k_endNode,
k_firstRow,
k_lastRow,
k_selection;
if (!k_startNode || !k_endNode) {
return null;
}
k_firstRow = this._k_findRow(k_startNode);
k_lastRow = this._k_findRow(k_endNode);
k_selection = {
k_firstRow: k_firstRow,
k_lastRow: k_lastRow,
k_range: k_range,
k_direction: this._k_visibleSelection ? this._k_visibleSelection.k_direction : null  };
this.k_removeCurrentSelection();
k_selection.k_range.k_startNode = null;
k_range = this._k_normalizeSelection(k_selection);
k_selection.k_range = k_range;
k_startNode = k_range.k_startNode;
k_endNode = k_range.k_endNode;
k_selection.k_pathToStartNode = this._k_getDOMWalkerToTextNode(k_startNode);
k_selection.k_pathToEndNode = this._k_getDOMWalkerToTextNode(k_endNode);
if (k_range.k_className !== this._k_SELECTION_CARET) {
if (k_firstRow === k_lastRow) {
if (k_startNode === k_endNode || this._k_areSiblings(k_startNode, k_endNode)) {
this._k_highlightPartOfText(k_range);
}
else {
this._k_highlightPartOfRow(k_range);
}
}
else {
if (0 !== k_range.k_startOffset || k_startNode !== this._k_getTextNode(k_firstRow, 'FIRST')) {
this._k_highlightRestOfRow(k_firstRow, k_range);
k_firstRow = k_firstRow.nextSibling;
}
this._k_highlightRows(k_firstRow, k_lastRow, k_range.k_className);
this._k_highlightBeginOfRow(k_lastRow, k_range);
}
}
this._k_visibleSelection = k_selection;
return k_selection;
},

_k_normalizeSelection: function(k_selection) {
var
k_range = k_selection.k_range,
k_lastRow = k_selection.k_lastRow,
k_endPos = this._k_getTextLength(k_lastRow);
if (!k_range.k_startNode || !k_range.k_endNode) {
k_range = this._k_getRangeFromAbsPositions(k_selection.k_firstRow, k_selection.k_lastRow, k_range.k_startPos, k_range.k_endPos);
}
else {
if (-1 === k_range.k_startOffset) {
k_range.k_startNode = this._k_getTextNode(k_selection.k_firstRow, 'FIRST');
k_range.k_startOffset = 0;
k_range.k_startPos = 0;
}
else {
k_range.k_startNode = this._k_getNodeByDOMWalker(k_selection.k_firstRow, k_selection.k_pathToStartNode);
}
if (-1 === k_range.k_endOffset) {
k_range.k_endNode = this._k_getTextNode(k_lastRow, 'LAST');
k_range.k_endOffset = k_range.k_endNode.data.length;
k_range.k_endPos = k_endPos;
}
else {
k_range.k_endNode = this._k_getNodeByDOMWalker(k_lastRow, k_selection.k_pathToEndNode);
}
}
k_range.k_className = k_selection.k_range.k_className;
k_range.k_direction = k_selection.k_range.k_direction;
return k_range;
},

_k_getRangeFromAbsPositions: function(k_firstRow, k_lastRow, k_startPos, k_endPos) {
var
k_startNode = this._k_getTextNode(k_firstRow, 'FIRST'),
k_endNode = this._k_getTextNode(k_lastRow, 'LAST'),
k_startOffset,
k_endOffset,
k_textNodeInfo;
if (k_startNode === k_endNode) {
k_startOffset = k_startPos;
k_endOffset = k_endPos;
}
else {
k_textNodeInfo = this._k_findTextNodeAtPosition(k_firstRow, k_startPos);
k_startNode = k_textNodeInfo.k_node;
k_startOffset = k_textNodeInfo.k_offset;
k_textNodeInfo = this._k_findTextNodeAtPosition(k_lastRow, k_endPos);
k_endNode = k_textNodeInfo.k_node;
k_endOffset = k_textNodeInfo.k_offset;
}
return {
k_startNode   : k_startNode,
k_endNode     : k_endNode,
k_startOffset : k_startOffset,
k_endOffset   : k_endOffset,
k_startPos    : k_startPos,
k_endPos      : k_endPos
};
},

_k_findTextNodeAtPosition: function(k_element, k_position) {
var
k_textNodes = this._k_getAllTextNodes(k_element),
k_offset = 0,
k_cnt = k_textNodes.length,
k_textLength,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_textLength = k_textNodes[k_i].data.length;
if (k_offset + k_textLength >= k_position) {
return {
k_node: k_textNodes[k_i],
k_offset: k_position - k_offset
};
}
k_offset += k_textLength;
}
return null;
},

_k_getAllTextNodes: function(k_element) {
var
k_childNodes = k_element.childNodes,
k_cnt = k_childNodes.length,
k_nodeList = [],
k_node,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_node = k_childNodes[k_i];
if (3 === k_node.nodeType) {
k_nodeList.push(k_node);
}
else {
k_nodeList = k_nodeList.concat(this._k_getAllTextNodes(k_node));
}
}
return k_nodeList;
},

_k_getDOMWalkerToTextNode: function(k_node, k_skipAdditionalNodes) {
var k_path = [];
while (k_node.parentNode && !(1 === k_node.nodeType && -1 !== k_node.className.indexOf(this._k_rowSelector))) {
while (k_node.previousSibling) {
if (true !== k_skipAdditionalNodes || !this._k_isAdditionalNode(k_node.previousSibling)) {
k_path.push('nextSibling');
}
k_node = k_node.previousSibling;
}
if (true !== k_skipAdditionalNodes || !this._k_isAdditionalNode(k_node.parentNode)) {
k_path.push('firstChild');
}
k_node = k_node.parentNode;
}
return k_path.reverse();
},

_k_getNodeByDOMWalker: function(k_rootNode, k_path) {
var
k_node = k_rootNode,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_path.length; k_i < k_cnt; k_i++) {
k_node = k_node[k_path[k_i]];
}
return k_node;
},

_k_isAdditionalNode: function(k_node) {
return 1 === k_node.nodeType && 'SPAN' === k_node.tagName && -1 !== k_node.className.indexOf('selectedText')  && -1 === k_node.className.indexOf('keepNode');
},

_k_findRow: function(k_element) {
var
k_maxDepth = 6,
k_iteration = 0;
while (!(1 === k_element.nodeType && -1 !== k_element.className.indexOf(this._k_rowSelector))) {
k_element = k_element.parentNode;
k_iteration++;
if (!k_element || k_iteration > k_maxDepth) {
return null;
}
}
return k_element;
},

_k_areSiblings: function(k_nodeOne, k_nodeTwo) {
return k_nodeOne.parentNode === k_nodeTwo.parentNode;
},

_k_highlightRows: function(k_firstRow, k_lastRow, k_className, k_removeClass) {
var
k_currentClassName,
k_pos;
while (k_firstRow !== k_lastRow) {
if (1 === k_firstRow.nodeType) {
k_currentClassName = k_firstRow.firstChild.className;
k_pos = k_currentClassName.indexOf(' selectedText');
if (true === k_removeClass) {
if (-1 !== k_pos) {
k_firstRow.firstChild.className = k_currentClassName.substr(0, k_pos);
}
}
else if (-1 === k_pos) {
k_firstRow.firstChild.className += ' selectedText ' + k_className;
}
}
k_firstRow = k_firstRow.nextSibling;
}
},

_k_highlightPartOfRow: function(k_range) {
var
k_firstRange = {
k_startNode   : k_range.k_startNode,
k_endNode     : k_range.k_startNode,
k_startOffset : k_range.k_startOffset,
k_endOffset   : k_range.k_startNode.data.length,
k_startPos    : k_range.k_startPos,
k_endPos      : k_range.k_endPos,
k_className   : k_range.k_className
},
k_secondRange = {
k_startNode   : k_range.k_endNode,
k_endNode     : k_range.k_endNode,
k_startOffset : 0,
k_endOffset   : k_range.k_endOffset,
k_startPos    : k_range.k_startPos,
k_endPos      : k_range.k_endPos,
k_className   : k_range.k_className
},
k_nodesBetween = this._k_getNodesBetween(k_range.k_startNode, k_range.k_endNode),
k_node,
k_i, k_cnt;
this._k_highlightPartOfText(k_secondRange);
this._k_highlightPartOfText(k_firstRange);
if (k_nodesBetween) {
for (k_i = 0, k_cnt = k_nodesBetween.length; k_i < k_cnt; k_i++) {
k_node = k_nodesBetween[k_i];
if (1 === k_node.nodeType) {
if (-1 === k_node.className.indexOf(' selectedText')) {
k_node.className += ' selectedText ' + k_range.k_className + ' keepNode';
}
}
else {
k_firstRange = {
k_startNode   : k_node,
k_endNode     : k_node,
k_startOffset : 0,
k_endOffset   : k_node.data.length,
k_startPos    : 0,
k_endPos      : k_node.data.length,
k_className   : k_range.k_className
};
this._k_highlightPartOfText(k_firstRange);
}
}
}
},

_k_highlightRestOfRow: function(k_row, k_range) {
var
k_textNode = this._k_getTextNode(k_row, 'LAST'),
k_newRange = {
k_startNode   : k_range.k_startNode,
k_endNode     : k_textNode,
k_startOffset : k_range.k_startOffset,
k_endOffset   : k_textNode.data.length,
k_startPos    : k_range.k_startPos,
k_endPos      : this._k_getTextLength(k_row),
k_className   : k_range.k_className
};
if (k_newRange.k_startNode === k_newRange.k_endNode || this._k_areSiblings(k_range.k_startNode, k_newRange.k_endNode)) {
this._k_highlightPartOfText(k_newRange);
}
else {
this._k_highlightPartOfRow(k_newRange);
}
},

_k_highlightBeginOfRow: function(k_row, k_range) {
var
k_textNode = this._k_getTextNode(k_row, 'FIRST'),
k_newRange = {
k_startNode   : k_textNode,
k_endNode     : k_range.k_endNode,
k_startOffset : 0,
k_endOffset   : k_range.k_endOffset,
k_startPos    : 0,
k_endPos      : k_range.k_endPos,
k_className   : k_range.k_className
};
if (k_newRange.k_startNode === k_newRange.k_endNode || this._k_areSiblings(k_newRange.k_startNode, k_newRange.k_endNode)) {
this._k_highlightPartOfText(k_newRange);
}
else {
this._k_highlightPartOfRow(k_newRange);
}
},

_k_getTextNode: function(k_element, k_which) {
var
k_childNodes = k_element.childNodes,
k_cnt = k_childNodes.length,
k_textNode,
k_i, k_index;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_index = 'LAST' === k_which ? k_cnt - k_i - 1 : k_i;
if (3 === k_childNodes[k_index].nodeType) {
k_textNode = k_childNodes[k_index];
break;
}
else {
k_textNode = this._k_getTextNode(k_childNodes[k_index], k_which);
if (k_textNode) {
break;
}
}
}
return k_textNode;
},

_k_getNodesBetween: function(k_startNode, k_endNode) {
var
k_nodesBetween = [],
k_start = false,
k_commonParentInfo,
k_commonParent,
k_childNodes,
k_node,
k_i, k_cnt;
k_commonParentInfo = this._k_getFirstCommonParentInfo(k_startNode, k_endNode);
if (!k_commonParentInfo) {
return null;
}
k_commonParent = k_commonParentInfo.k_node;
k_childNodes = k_commonParent.childNodes;
for (k_i = 0, k_cnt = k_childNodes.length; k_i < k_cnt; k_i++) {
k_node = k_childNodes[k_i];
if (k_start) {
if (k_node === k_commonParentInfo.k_endNodeTop) {
break;
}
k_nodesBetween.push(k_node);
}
if (k_node === k_commonParentInfo.k_startNodeTop) {
k_start = true;
}
}
k_node = k_startNode;
while (k_node && k_node !== k_commonParent) {
while (k_node.nextSibling && k_node.nextSibling !== k_commonParentInfo.k_endNodeTop) {
k_node = k_node.nextSibling;
k_nodesBetween.push(k_node);
}
k_node = k_node.parentNode;
}
k_node = k_endNode;
while (k_node && k_node !== k_commonParent) {
while (k_node.previousSibling && k_node.previousSibling !== k_commonParentInfo.k_startNodeTop) {
k_node = k_node.previousSibling;
k_nodesBetween.push(k_node);
}
k_node = k_node.parentNode;
}
return 0 === k_nodesBetween.length ? null : k_nodesBetween;
},

_k_getFirstCommonParentInfo: function(k_startNode, k_endNode) {
var
k_parentNodes = [],
k_node,
k_startNodeTop,
k_endNodeTop,
k_i, k_cnt;
k_node = k_startNode.parentNode;
while (k_node && -1 === k_node.className.indexOf(this._k_rowSelector)) {
k_parentNodes.push(k_node);
k_node = k_node.parentNode;
}
k_cnt = k_parentNodes.length;
k_node = k_endNode.parentNode;
k_endNodeTop = k_endNode;
while (k_node && -1 === k_node.className.indexOf(this._k_rowSelector)) {
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_node === k_parentNodes[k_i]) {
k_startNodeTop = k_parentNodes[k_i - 1] || k_startNode;
return {
k_node: k_node,
k_startNodeTop: k_startNodeTop,
k_endNodeTop: k_endNodeTop
};
}
}
k_endNodeTop = k_node;
k_node = k_node.parentNode;
}
},

k_removeSelection: function(k_selection) {
if (!k_selection) {
return;
}
var
k_firstRow = k_selection.k_firstRow,
k_lastRow = k_selection.k_lastRow,
k_range = k_selection.k_range;
if (!k_firstRow.parentNode) {  return;
}
if (0 !== k_range.k_startPos) {
this._k_removeHighlightingTags(k_firstRow);
}
this._k_highlightRows(k_firstRow, k_lastRow, k_range.k_className, true);
this._k_removeHighlightingTags(k_lastRow);
},

k_removeCurrentSelection: function() {
if (this._k_visibleSelection) {
this.k_removeSelection(this._k_visibleSelection);
}
},

_k_removeHighlightingTags: function(k_element) {
var
k_childNodes = k_element.childNodes,
k_cnt = k_childNodes.length,
k_parent,
k_child,
k_node,
k_i;
for (k_i = k_cnt - 1; k_i >= 0; k_i--) {
k_child = k_childNodes[k_i];
if (!k_child || 1 !== k_child.nodeType) {  continue;
}
if (k_child.hasChildNodes()) {
this._k_removeHighlightingTags(k_child);
}
if (-1 !== k_child.className.indexOf('selectedText')) {  if (-1 !== k_child.className.indexOf('keepNode')) {
Ext.get(k_child).removeClass(['selectedText', 'keepNode', this._k_SELECTION_HIGHLIGHT, this._k_SELECTION_USER]);
}
else {
k_parent = k_child.parentNode;
while (k_child.firstChild) {
k_node = k_child.removeChild(k_child.firstChild);
if (3 === k_node.nodeType && k_child.previousSibling && 3 === k_child.previousSibling.nodeType) {
k_child.previousSibling.appendData(k_node.data);
}
else {
k_parent.insertBefore(k_node, k_child);
}
k_node = null;
}
k_node = k_parent.removeChild(k_child);
k_node = null;
k_parent.innerHTML = k_parent.innerHTML;
}
}
}
},

k_highlightTextInRow: function(k_element, k_startPos, k_endPos, k_keepExisting) {
var k_selection = {
k_firstRow: k_element,
k_lastRow : k_element,
k_range   : {
k_startPos : k_startPos,
k_endPos   : k_endPos,
k_className: this._k_SELECTION_HIGHLIGHT
}
};
if (true !== k_keepExisting) {
this.k_removeCurrentSelection();
}
k_selection.k_range = this._k_normalizeSelection(k_selection);
k_selection = this.k_createSelection(k_selection.k_range);
if (!k_selection) {
return null;
}
k_selection.k_direction = 'FORWARD';
return k_selection;
},

k_selectWordAtMousePosition: function(k_extEvent) {
var k_textRange = document.body.createTextRange();
this.k_removeCurrentSelection();
try {
k_textRange.moveToPoint(k_extEvent.xy[0], k_extEvent.xy[1]);
k_textRange.expand('word');
if ('' === k_textRange.text) {
return false;
}
k_textRange.select();
}
catch (k_ex) {
return false;
}
return true;
},
k_applyMSEdgePatch: function() {

this.k_selectWordAtMousePosition = function(k_extEvent) {
var k_textRange;
this.k_removeCurrentSelection();
try {
k_textRange = document.caretRangeFromPoint(k_extEvent.xy[0], k_extEvent.xy[1]);
k_textRange.expand('word');
document.getSelection().addRange(k_textRange);
}
catch (k_ex) {
return false;
}
return true;
};
}
});


kerio.lib.k_inputValidator = {
_k_restrictionsLoaded: false,

_k_restrictions: {},

_k_validationFunctions: {},

k_setRestrictionList: function (k_requestParams) {
if (!this._k_restrictionsLoaded) {
this._k_getRestrictionList(k_requestParams);
}
},

k_getFunctionByName: function (k_name) {
return this._k_validationFunctions[k_name];
},

k_registerFunctions: function (k_validationFunctions) {
Ext.apply(this._k_validationFunctions, k_validationFunctions);
},

_k_getRestrictionList: function (k_requestCfg) {
if (k_requestCfg.k_callback) {
k_requestCfg.k_callback = this._k_getRestrictionListCallback.createSequence(k_requestCfg.k_callback);
}
else {
k_requestCfg.k_callback = this._k_getRestrictionListCallback;
}
kerio.lib.k_ajax.k_request(
Ext.applyIf(k_requestCfg, {
k_method: 'post',
k_scope: this
})
);
},

_k_getRestrictionListCallback: function(k_response, k_success) {
var k_responseDecoded = k_response.k_decoded;
if (!k_responseDecoded) {
return;
}
if (k_response.k_isOk) {
this._k_parseRestrictions(k_responseDecoded.restrictions);
this._k_restrictionsLoaded = true;
}
},

_k_parseRestrictions: function(k_restrictionsFromServer) {
var k_rest;
var k_restrictions = this._k_restrictions;
for (var k_i = 0, k_len = k_restrictionsFromServer.length; k_i < k_len; k_i++) {
k_rest = k_restrictionsFromServer[k_i];
k_restrictions[k_rest[0]] = {};
var k_tuples = k_rest[1].tuples;
for (var k_j = 0, k_len2 = k_tuples.length; k_j < k_len2; k_j++) {
var k_name = k_tuples[k_j].name;
if (undefined === k_restrictions[k_rest[0]][k_name]) {
k_restrictions[k_rest[0]][k_name] = [];
}
k_restrictions[k_rest[0]][k_name].push(k_tuples[k_j]);
}
}
},

_k_getValidationFunction: function(k_verificationType, k_verificationPattern) {
var
k_sharedConstants = kerio.lib.k_getSharedConstants(),
k_reStr,
k_function,
k_searchEnd,
k_subString,
k_lastDash,
k_dashString,
k_i,
k_len;
switch (k_verificationType) {
case k_sharedConstants.kerio_web_ByteLength:
k_function = function(k_value){
return k_value.length <= k_verificationPattern[0];
};
break;
case k_sharedConstants.kerio_web_Regex:
k_reStr = k_verificationPattern[0];
k_reStr = k_reStr.substring(1, k_reStr.length-1);
k_function = this.k_getRegExpValidator(k_reStr);
break;
case k_sharedConstants.kerio_web_ForbiddenNameList:
k_function = function (k_value) {
return -1 === k_verificationPattern.indexOf(k_value);
};
break;
case k_sharedConstants.kerio_web_ForbiddenPrefixList:
k_function = function (k_value) {
var
k_searchEnd = k_value.indexOf('.'),
k_subString;
if (-1 === k_searchEnd) {
k_searchEnd = k_value.length;
}
k_subString = k_value.substring(0, k_searchEnd);
return -1 === k_verificationPattern.indexOf(k_subString);
};
break;
case k_sharedConstants.kerio_web_ForbiddenSuffixList:
k_function = function(k_value){
var
k_lastDash = k_value.lastIndexOf('-'),
k_dashString;
if (-1 === k_lastDash) {
return true;
}
k_dashString = k_value.substring(k_lastDash);
return -1 === k_verificationPattern.indexOf(k_dashString);
};
break;
case k_sharedConstants.kerio_web_ForbiddenCharacterList:
k_function = function (k_value) {
var
k_cnt = k_verificationPattern.length,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (-1 !== k_value.indexOf(k_verificationPattern[k_i])) {
return false;
}
}
return true;
};
break;
default:
k_function = function (k_value) {return false;};
}
return k_function;
},

k_getRegExpValidator: function (k_regExpPattern, k_flags) {
var
k_function,
k_regExp;
if (undefined === k_regExpPattern) {
kerio.lib.k_reportError('Internal error: kerio.lib.k_inputValidator.k_getRegExpValidator: RegExp pattern is undefined', 'inputValidator.js');
k_regExpPattern = '.*';
}
k_regExp = new RegExp(k_regExpPattern, k_flags);
k_function = function (k_value) {
return k_regExp.test(k_value);
};
return k_function;
},

k_getRestrictionsValidator: function(k_entityName, k_itemName) {
if (!this._k_restrictionsLoaded) {
kerio.lib.k_reportError('Internal error: kerio.lib.k_inputValidator.k_createValidationFunction: Restrictions have to be loaded!', 'inputValidator.js');
}
var
k_entity = this._k_restrictions[k_entityName],
k_functionList = [],
k_r,
k_i,
k_cnt;
if (!k_entity) {
kerio.lib.k_reportError('Internal error: Input Validator: Entity "' + k_entityName +  '" is not defined in restrictions', 'inputValidator.js');
return;
}
k_r = k_entity[k_itemName];
if (!k_r) {
kerio.lib.k_reportError('Internal error: Input Validator: Item "' + k_itemName + '" is not defined in ' + k_entityName, 'inputValidator.js');
return;
}
for (k_i = 0, k_cnt = k_r.length; k_i < k_cnt; k_i++) {
k_functionList.push(this._k_getValidationFunction(k_r[k_i].kind, k_r[k_i].values));
}
return function (k_value) {
var
k_cnt = k_functionList.length,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (false === k_functionList[k_i].call(this, k_value)) {
return false;
}
}
return true;
};
}
};


kerio.lib.K_Event = function(k_eventType, k_extEvent) {

this.k_type = k_eventType;

this.k_browserEvent = (k_extEvent) ? k_extEvent.browserEvent : {};

this.k_isTriggeredByUser = (k_extEvent && k_extEvent.browserEvent);
this._k_isShiftKey = this.k_isTriggeredByUser ? true === k_extEvent.shiftKey : false;
};
kerio.lib.K_Event.prototype = {

k_isShiftKey: function () {
return this._k_isShiftKey;
}
};

kerio.lib.k_constants.k_EVENT = {

k_TYPES:  {
k_ALL: 1,
k_SELECTION_CHANGED: 2,
k_KEY_PRESSED: 3,
k_CLICK: 4,
k_DOUBLE_CLICK: 5,
k_FOCUS: 6,
k_CHECK_CHANGED: 7
},

k_KEY_CODES: {
k_BACKSPACE: Ext.EventObject.BACKSPACE,
k_DELETE:    Ext.EventObject.DELETE,
k_END:       Ext.EventObject.END,
k_ENTER:     Ext.EventObject.ENTER,
k_ESC:       Ext.EventObject.ESC,
k_HOME:      Ext.EventObject.HOME,
k_PAGEDOWN:  Ext.EventObject.PAGEDOWN,
k_PAGEUP:    Ext.EventObject.PAGEUP,
k_CHAR_A: 65,
k_CHAR_a: 97
}
};


kerio.lib._K_BaseComponent = function(k_config) {
var
k_lib = kerio.lib,
k_adaptedConfig,
k_extWidget;
this._k_constructorName = this._k_getConstructorName();
this._k_references = [];
this._k_mappedListeners = {};
if (!this._k_storedPropertiesList) {  this._k_storedPropertiesList = [];
}
if (k_config) {
k_config = this._k_modifyConfig(k_config);
k_config = this._k_prepareConfig(k_config);
this._k_saveStoredProperties(k_config);
k_adaptedConfig = k_lib._k_createConfig.call(this, k_config, this._k_propertiesDefault, this._k_propertiesMapping);
this._k_adaptedConfig = k_adaptedConfig;
}
this._k_beforeInitExtComponent(this._k_adaptedConfig, this._k_storedConfig);
if (this._k_initExtComponent) {
this.k_extWidget = this._k_initExtComponent(this._k_adaptedConfig, this._k_storedConfig);
k_extWidget = this.k_extWidget;
k_lib._k_addKerioProperty(k_extWidget, {k_owner: this});
if (k_extWidget instanceof Ext.Component) {
k_extWidget.on('destroy', this._k_destroyComponent, this);
}
}
else {
k_lib.k_reportError('Internal error: Class "' + this._k_constructorName + '" doesn\'t have defined _k_initExtComponent method!', 'baseComponent.js');
}
this._k_afterInitExtComponent(this._k_adaptedConfig, this._k_storedConfig);
delete this._k_adaptedConfig;
};
kerio.lib._K_BaseComponent.prototype = {

_k_constructorName: null,


_k_propertiesMapping: null,

_k_propertiesDefault: null,

_k_adaptedConfig: null,

_k_storedConfig: null,

_k_prepareConfig: function(k_config) {
return k_config;
},

_k_beforeInitExtComponent: Ext.emptyFn,

_k_initExtComponent: null,

_k_afterInitExtComponent: Ext.emptyFn,

_k_getConstructorName: function() {
var
k_prototype = this.constructor.prototype,
k_constructorName = k_prototype._k_constructorName,
k_lib = kerio.lib,
k_propertyName;
if (!k_prototype.hasOwnProperty('_k_constructorName')) {
for (k_propertyName in k_lib) {
if (this.constructor === k_lib[k_propertyName]) {
k_constructorName = k_propertyName;
k_prototype._k_constructorName = k_constructorName;
break;
}
}
}
return k_constructorName;
},

k_isInstanceOf: function(k_constructorList, k_directInstance) {
var
k_lib = kerio.lib,
k_constructorInfo,
k_namespace,
k_constructorName,
k_pointerToSuperclass,
k_i,
k_cnt;
if ('string' === typeof k_constructorList) {
k_constructorList = [k_constructorList];
}
for (k_i = 0, k_cnt = k_constructorList.length; k_i < k_cnt; k_i++) {
k_constructorName = k_constructorList[k_i];
if (true === k_directInstance) {
if (this._k_constructorName === k_constructorName) {
return true;
}
}
else {
k_constructorInfo = k_lib._k_parseConstructorName(k_constructorName);
k_namespace = k_constructorInfo.k_namespace;
if (undefined === k_namespace) {
k_pointerToSuperclass = kerio.lib[k_constructorName];
}
else {
k_pointerToSuperclass = k_lib._k_getPointerToObject(k_constructorInfo.k_constructorName, k_namespace);
}
if (k_pointerToSuperclass && this instanceof k_pointerToSuperclass) {
return true;
}
}
}
return false;
},

k_addReferences: function (k_references) {
for (var k_propertyName in k_references) {
if (undefined === this[k_propertyName]) {
this[k_propertyName] = k_references[k_propertyName];
this._k_references.push(k_propertyName);
}
else {
kerio.lib.k_reportError('Internal error: An attempt to redefine property "' + k_propertyName + '" in the widget "'
+ this.k_id + '"', 'baseComponent.js');
}
}
},

_k_saveStoredProperties: function (k_config) {
var
k_propertyList = this._k_storedPropertiesList,
k_getPointerToObject = kerio.lib._k_getPointerToObject,
k_storedConfig = {},
k_cnt = k_propertyList.length,
k_i,
k_propertyName,
k_composedPropertyName,
k_propertyValue;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_propertyName = k_propertyList[k_i];
if ('object' === typeof k_propertyName) {
for (k_composedPropertyName in k_propertyName) {
k_propertyValue = k_getPointerToObject.call(k_config, 'this.' + k_composedPropertyName);
k_propertyName = k_propertyName[k_composedPropertyName];
break;
}
}
else {
k_propertyValue = k_config[k_propertyName];
}
k_storedConfig[k_propertyName] = k_propertyValue;
}
if (null === this._k_storedConfig) {
this._k_storedConfig = {};
}
this._k_storedConfig = Ext.apply(this._k_storedConfig, k_storedConfig);
delete this._k_storedPropertiesList;
},

_k_removeStoredProperties: function (k_propertyList) {
var
k_storedConfig = this._k_storedConfig,
k_cnt = k_propertyList.length,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
delete k_storedConfig[k_propertyList[k_i]];
}
},

_k_setStoredProperties: function (k_propertyList) {
if (!this._k_storedPropertiesList) {
this._k_storedPropertiesList = [];
}
this._k_storedPropertiesList = this._k_storedPropertiesList.concat(k_propertyList);
},

_k_destroyComponent: function (k_component) {
delete kerio.lib.k_widgets[k_component._kx.k_owner.k_id];
},

_k_hasListener: function (k_eventName, k_handler, k_scope) {
var
k_extWidget = this.k_extWidget, k_hasListener = k_extWidget.hasListener(k_eventName);
if (!k_hasListener) {
return false;
}
return -1 !== k_extWidget.events[k_eventName].findListener(k_handler, k_scope);
},

_k_modifyConfig: function (k_config) {
return kerio.lib.k_applyRestrictionToConfig(k_config);
}
};


kerio.lib._K_BaseWidget = function(k_id, k_config) {
this.k_id = k_id;
this._k_afterRenderStack = [];
this._k_childWidgets = null;
if (false === k_config.k_isVisible) {
delete k_config.k_isVisible;
k_config.k_isHidden = true;
}
kerio.lib._K_BaseWidget.superclass.constructor.call(this, k_config);
kerio.lib.k_registerWidget(this, k_id);
this.k_extWidget.on('afterrender', this._k_deferredExecution, this);
if (true === k_config.k_isHidden) {
this.k_setVisible(false);
}
if (true === k_config.k_isDisabled) {
this.k_setDisabled(true);
}
if (true === k_config.k_isReadOnly) {
this.k_setReadOnly(true);
}
if (this._k_isStateful) {
this.k_extWidget.on('afterrender', this._k_initChangeEvents, this);
}
};
Ext.extend(kerio.lib._K_BaseWidget, kerio.lib._K_BaseComponent,
{





_k_isVisible: true,
_k_isDisabled: false,
_k_isReadOnly: false,

_k_isExecutionDeferredAfterRender: function (k_origFunction, k_arguments, k_stackLength) {
if (this.k_extWidget.rendered) {
return false;
}
var k_afterRenderStack = this._k_afterRenderStack;

if (undefined !== k_stackLength) {
k_afterRenderStack.length = k_stackLength;
}
var k_length = k_afterRenderStack.length;
var k_addToStack = true;
var k_lastEntry;
var k_lastArguments;
if (k_length > 0) {
k_lastEntry = k_afterRenderStack[k_length - 1];
k_lastArguments = k_lastEntry.k_arguments;
if (k_origFunction === k_lastEntry.k_function && k_arguments.length === k_lastArguments.length) {
k_addToStack = false;
for (var k_i = 0, k_cnt = k_arguments.length; k_i < k_cnt; k_i++) {
if (k_arguments[k_i] !== k_lastArguments[k_i]) {
k_addToStack = true;
break;
}
}
}
}
if (k_addToStack) {
k_afterRenderStack.push({k_function: k_origFunction, k_arguments: k_arguments});
}
return true;
},

_k_deferredExecution: function () {
var k_afterRenderStack = this._k_afterRenderStack;
var k_toExecute;
for (var k_i = 0, k_cnt = k_afterRenderStack.length; k_i < k_cnt; k_i++) {
k_toExecute = k_afterRenderStack[k_i];
k_toExecute.k_function.apply(this, k_toExecute.k_arguments);
delete k_afterRenderStack[k_i];
}
delete this._k_afterRenderStack;
},

_k_clearDeferredExecutionStack: function () {
var k_childWidgets;
var k_widget;
this._k_afterRenderStack = [];    if (null === this._k_childWidgets) {
k_childWidgets = this._k_getChildWidgets.call(this.k_extWidget);
}
else {
k_childWidgets = this._k_childWidgets;
}
for (var k_i = 0, k_cnt = k_childWidgets.length; k_i < k_cnt; k_i++) {
k_widget = k_childWidgets[k_i];
k_widget._k_clearDeferredExecutionStack.call(k_widget);
}
},

_k_getChildWidgets: function () {
if (!this.items || !this.items.items) {
return [];
}
var k_extItems = this.items.items;
var k_extWidget;
var k_childWidgets = [];
for (var k_i = 0, k_cnt = k_extItems.length; k_i < k_cnt; k_i++) {
k_extWidget = k_extItems[k_i];
if (k_extWidget._kx && k_extWidget._kx.k_owner) {
k_childWidgets.push(k_extWidget._kx.k_owner);
}
else {
k_childWidgets = k_childWidgets.concat(kerio.lib._K_BaseWidget.prototype._k_getChildWidgets.call(k_extWidget));
}
}
if (this._kx && this._kx.k_owner) {
this._kx.k_owner._k_childWidgets = k_childWidgets;
}
return k_childWidgets;
},

_k_getStackLength: function () {
return this._k_afterRenderStack ? this._k_afterRenderStack.length : 0;
},

_k_setParentWidget: function (k_parentWidget) {
var
k_childWidgets = this._k_getChildWidgets.call(this.k_extWidget),
k_cnt = k_childWidgets.length,
k_i;
delete this._k_fullPath; this.k_parentWidget = k_parentWidget;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_childWidgets[k_i]._k_setParentWidget(this);
}
},

k_getFullPath: function() {
var k_path = this._k_fullPath;
if (!k_path) {
k_path = this._k_getPath(this.k_extWidget);
this._k_fullPath = k_path;
}
return k_path;
},

k_resetFullPath: function() {
var
k_path = this._k_fullPath,
k_i, k_cnt;
if (k_path) {
for (k_i = 0, k_cnt = k_path.length; k_i < k_cnt; k_i++) {
delete k_path[k_i]._k_fullPath;
}
delete this._k_fullPath;
this._k_resetChildrenFullPath();
}
},

_k_resetChildrenFullPath: function() {
var
k_childWidgets = this._k_getChildWidgets.call(this.k_extWidget),
k_cnt = k_childWidgets.length,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
delete k_childWidgets[k_i]._k_fullPath;
k_childWidgets[k_i]._k_resetChildrenFullPath();
}
},

k_getParentWidget: function () {
var k_fullPath = this.k_getFullPath();
return k_fullPath[1] || null;
},

k_getTopLevelParent: function () {
var
k_fullPath = this.k_getFullPath(),
k_topLevelParentIndex = k_fullPath.length - 1,
k_topLevelParent = k_fullPath[k_topLevelParentIndex];
if (0 === k_topLevelParentIndex) {
if (!k_topLevelParent.k_isInstanceOf('K_Dialog') && (!k_topLevelParent.k_isInstanceOf('K_Layout') || !k_topLevelParent._k_isBrowserWindow)) {
return null;
}
}
return k_topLevelParent;
},

k_getMainWidget: function() {
return this.k_getTopLevelParent();
},

_k_getPath: function (k_extWidget, k_path) {
var
k_isDialog = k_extWidget instanceof Ext.Window,
k_isMainScreen = k_extWidget instanceof Ext.Viewport,
k_parentExtWidget = k_extWidget.ownerCt,
k_parentWidget;
if (undefined === k_path) {
k_path = [];
}
if (k_extWidget._kx && k_extWidget._kx.k_owner) {
k_path.push(k_extWidget._kx.k_owner);
k_parentWidget = k_extWidget._kx.k_owner.k_parentWidget;
if (k_parentWidget) {
k_parentExtWidget = k_parentWidget.k_extWidget;
}
}
if (k_isDialog || k_isMainScreen || !k_parentExtWidget) {
return k_path;
}
if (k_parentWidget && k_parentWidget._k_fullPath) { return k_path.concat(k_parentWidget._k_fullPath);
}
return this._k_getPath(k_parentExtWidget, k_path);
},

k_showItem: function () {
var
k_path = this.k_getFullPath(),
k_pathLength = k_path.length,
k_lib = kerio.lib,
k_parentWidget,
k_widget,
k_tabId,
k_i;
for (k_i = k_pathLength - 1; k_i >= 0 ; k_i--) { k_widget = k_path[k_i];
k_parentWidget = k_widget.k_getParentWidget();
if (k_parentWidget instanceof k_lib.K_TabPage) {
k_tabId = k_parentWidget._k_getTabIdFromContentId(k_widget.k_id);
k_parentWidget.k_setActiveTab(k_tabId);
}
}
},

k_focusItem: function () {
this.k_showItem();
this.k_focus();
},

k_isDisabled: function () {
return this._k_isDisabled;
},

k_isReadOnly: function () {
return this._k_isReadOnly;
},

k_isVisible: function () {
return this._k_isVisible;
},

_k_initSettings: function (k_config) {
var
k_isStatefulCfg = k_config.k_isStateful,
k_settings;
if (true !== kerio.lib.k_isStateful) {
this._k_isStateful = false;
}
else if (undefined !== k_isStatefulCfg) {
this._k_isStateful = k_isStatefulCfg;
}
else if (undefined !== k_config.k_settingsId) {
this._k_isStateful = true;
}
else {
this._k_isStateful = Boolean(this._k_isStateful);
}
if (!this._k_isStateful) {
return;
}
this._k_settingsId = k_config.k_settingsId || this.k_id;
this._k_isStateChanged = false; k_settings = kerio.lib.k_getSettings(this._k_settingsId);
this._k_storeInitialSettings(k_config);
if (k_settings) {
this._k_applySettingsToConfig(k_settings, k_config);
}
},

k_getSettingsId: function () {
return this._k_settingsId;
},

_k_storeInitialSettings: function (k_config) {
kerio.lib.k_reportError('Internal error: kerio.lib._K_BaseWidget._k_storeInitialSettings has to be overloaded in subclass: ' + this.k_id, 'baseWidget.js');
this._k_initialSettings = {};
},

_k_getSettings: function () {
kerio.lib.k_reportError('Internal error: kerio.lib._K_BaseWidget._k_getSettings has to be overloaded in subclass: ' + this.k_id, 'baseWidget.js');
return {};
},

k_getSettings: function () {
var
k_settings,
k_sizeWidget,
k_region;
if (true !== this._k_isStateChanged) {
return null;
}
this._k_isStateChanged = false;
k_settings = this._k_getSettings();
k_sizeWidget = this._k_settingsSizeWidget || this.k_extWidget;
k_region = k_sizeWidget.region;
if (k_region && 'center' !== k_region) {
if ('west' === k_region || 'east' === k_region) {
k_settings.width = k_sizeWidget.getWidth();
}
else if ('south' === k_region || 'north' === k_region) {
k_settings.height = k_sizeWidget.getHeight();
}
}
if (this._k_initialSettings.width === k_settings.width) {
delete k_settings.width;
}
if (this._k_initialSettings.height === k_settings.height) {
delete k_settings.height;
}
if (kerio.lib.k_isEmpty(k_settings)) {
return null;
}
return k_settings;
},

_k_applySettingsToConfig: function (k_settings) {
kerio.lib.k_reportError('Internal error: kerio.lib._K_BaseWidget._k_applySettingsToConfig has to be overloaded in subclass: ' + this.k_id, 'baseWidget.js');
},

_k_addSettingsChangeEvents: function  (k_events) {
if (!k_events) {
return;
}
this._k_settingsEvents = (this._k_settingsEvents || []).concat(k_events);
},

_k_initChangeEvents: function () {
var
k_extWidget = this.k_extWidget,
k_events = this._k_settingsEvents,
k_sizeWidget,
k_function,
k_event,
k_i, k_cnt;
k_sizeWidget = this._k_settingsSizeWidget || k_extWidget;
if (k_sizeWidget.region || 'center' !== k_sizeWidget.region) {
k_events.push({
k_eventName: 'resize',
k_observable: k_sizeWidget
});
}
for (k_i = 0, k_cnt = k_events.length; k_i < k_cnt; k_i++) {
k_event = k_events[k_i];
if ('string' === Ext.type(k_event)) {
k_event = {k_eventName: k_event};
}
if ('resize' === k_event.k_eventName) {
k_function = this._k_onStateSizeChanged;
}
else {
k_function = this._k_onStateChanged;
}
k_extWidget.mon(k_event.k_observable || k_extWidget, k_event.k_eventName, k_function, this);
}
delete this._k_settingsEvents;
},

_k_onStateSizeChanged: function(k_extPanel, k_adjWidth, k_adjHeight, k_rawWidth, k_rawHeight) {
var
k_monitorWidth,
k_monitorHeight,
k_region;
if (this._k_isResizeInitialized) {
k_region = k_extPanel.region;
k_monitorWidth = 'west' === k_region || 'east' === k_region;
k_monitorHeight = 'north' === k_region || 'south' === k_region;
if (k_monitorWidth && k_rawWidth !== this._k_lastSize.k_width) {
this._k_onStateChanged();
this._k_lastSize.k_width = k_rawWidth;
}
if (k_monitorHeight && k_rawHeight !== this._k_lastSize.k_height) {
this._k_onStateChanged();
this._k_lastSize.k_height = k_rawHeight;
}
}
else if (undefined !== k_rawWidth && undefined !== k_rawHeight) {
this._k_isResizeInitialized = true;
this._k_lastSize = {
k_width: k_rawWidth,
k_height: k_rawHeight
};
}
},

_k_onStateChanged: function () {
this._k_isStateChanged = true;
},

_k_modifyConfig: function (k_config) {
k_config = kerio.lib._K_BaseWidget.superclass._k_modifyConfig.call(this, k_config);
this._k_initSettings(k_config);
return k_config;
}
});


kerio.lib.K_Action = function(k_config) {
this._k_setStoredProperties([
'k_onBeforeShow',
'k_onClick',
'k_validateBeforeClick',
'k_mask',
'k_items',
'_k_preventOnClickInMenu' ]);
this.k_itemId = k_config.k_id || kerio.lib.k_getGeneratedId();
this._k_isAction = true;
kerio.lib.K_Action.superclass.constructor.call(this, k_config);
};
Ext.extend(kerio.lib.K_Action, kerio.lib._K_BaseComponent,
{












_k_propertiesMapping: {
k_itemId: 'itemId',
k_caption: 'text',
k_icon: 'icon',
k_className: 'cls',
k_iconCls: 'iconCls',
k_isDisabled: 'disabled',
k_isHidden: 'hidden',
k_minWidth: 'minWidth', k_title: 'tooltip', k_radioGroup: 'group',
k_isChecked: 'checked'
},

_k_propertiesDefault: {
hideOnClick: false, groupClass: 'radioMenu'
},

_k_beforeInitExtComponent: function (k_adaptedConfig, k_storedConfig) {
if (k_storedConfig.k_onClick) {
if (!k_adaptedConfig.listeners) {
k_adaptedConfig.listeners = {};
}
k_adaptedConfig.listeners.click = {
fn: this._k_onClick,
scope: this
};
}
if (k_storedConfig.k_validateBeforeClick) {
k_storedConfig.k_validate = true;
k_storedConfig.k_validationWidget = 'object' === typeof k_storedConfig.k_validateBeforeClick ? k_storedConfig.k_validateBeforeClick : null;
}
delete k_storedConfig.k_validateBeforeClick;
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
return new Ext.Action(k_adaptedConfig);
},

_k_onClickHandler: function (k_extAction, k_eventName) {
var
k_scope,
k_item,
k_masterParent,
k_maskCfg,
k_validationWidget,
k_handler,
k_isValid = true,
k_isMasked = false,
k_validate = this._k_storedConfig.k_validate,
k_returnValue = false;
if (k_extAction instanceof Ext.menu.Item) {
if (k_extAction.menu) {
return false;
}
if (k_extAction.setChecked) {  k_extAction.setChecked(true);
}
k_extAction.parentMenu.hide.defer(k_extAction.hideDelay, k_extAction.parentMenu, [true]);
}
k_item = k_extAction._kx.k_owner;
k_scope = k_item.k_relatedWidget || k_item.k_topMenu;
if (k_scope.k_relatedButton) {
k_scope = k_scope.k_relatedButton.k_relatedWidget;
}
if (k_scope.k_relatedToolbar) {
k_scope = k_scope.k_relatedToolbar;
}
k_masterParent = k_scope.k_getTopLevelParent();
if (k_masterParent && k_masterParent.k_maskOnAction) {
k_maskCfg = this._k_storedConfig.k_mask;
if (false !== k_maskCfg) {  k_isMasked = true;
k_maskCfg = k_maskCfg ? k_maskCfg : k_masterParent.k_maskOnAction;
kerio.lib.k_maskWidget(k_masterParent, k_maskCfg);
}
}
if (k_validate) {
k_validationWidget = this._k_storedConfig.k_validationWidget || k_scope.k_parentWidget;
k_isValid = k_validationWidget.k_isValid();
}
if (k_isValid) { switch (k_eventName) {
case 'k_globalItemClick':
k_handler = k_extAction._kx.k_owner.k_topMenu._k_storedConfig.k_onClick;
break;
case 'k_itemClick':
k_handler = k_extAction._kx.k_owner.k_menu._k_storedConfig.k_onClick;
break;
case 'k_click':
k_handler = this._k_storedConfig.k_onClick;
break;
}
k_returnValue = k_handler.call(k_scope, k_scope, k_item);
}
if (k_isMasked) {
kerio.lib.k_unmaskWidget(k_masterParent);
}
return k_returnValue;
},

_k_onClick: function (k_extAction, k_extEvent) {
k_extAction._kx.k_owner.k_isFiredByEvent = undefined !== k_extEvent;  return this._k_onClickHandler(k_extAction, 'k_click');
},

k_setDisabled: function (k_disable) {
this.k_extWidget.setDisabled(k_disable);
},

k_setReadOnly: function (k_readOnly) {
this.k_setDisabled(k_readOnly);
},

k_setVisible: function (k_visible) {
this.k_extWidget.setHidden(!k_visible);
},

k_setCaption: function (k_caption) {
this.k_extWidget.setText(k_caption);
}
});


kerio.lib.K_MenuItem = function (k_id, k_config, k_topMenu) {
var k_action;
this._k_setStoredProperties(['k_items', 'k_onClick', 'k_isColorPicker']);
if (!k_config._k_isAction) {
k_action = new kerio.lib.K_Action(k_config);
this.k_name = k_config.k_id;
}
else {
k_action = k_config;
this.k_name = k_action.k_itemId;
}
this._k_action = k_action;
this.k_topMenu = k_topMenu;
kerio.lib.K_MenuItem.superclass.constructor.call(this, k_id, k_config);
if (true === k_config.k_isHidden) {
this.k_setVisible(false);
}
if (true === k_config.k_isDisabled) {
this.k_setDisabled(true);
}
if (true === k_config.k_isReadOnly) {
this.k_setReadOnly(true);
}
};
Ext.extend(kerio.lib.K_MenuItem, kerio.lib._K_BaseWidget,
{





_k_propertiesMapping: {},

_k_propertiesDefault: {},

_k_beforeInitExtComponent: function (k_adaptedConfig, k_storedConfig) {
var
k_submenuId  = this.k_id + '_' + 'k_submenu',
k_menuConfig = this._k_action._k_storedConfig,
k_menu;
k_adaptedConfig = this._k_action.k_extWidget.initialConfig;
k_adaptedConfig.id = this.k_id;
if (k_storedConfig.k_isColorPicker) {
k_menu = new kerio.lib.K_ColorPicker(k_submenuId, k_storedConfig);
k_menu.k_relatedButton = this;
}
else if (k_menuConfig.k_items) {
k_menu = new kerio.lib.K_Menu(k_submenuId, k_menuConfig, this.k_topMenu);
}
if (k_menu) {
k_adaptedConfig.menu = k_menu.k_extWidget;
this.k_submenu = k_menu;
}
this._k_removeStoredProperties(['k_items']);
},

_k_initExtComponent: function (k_adaptedConfig, k_storedConfig) {
if (this._k_action.k_extWidget.initialConfig.group) {
return new Ext.menu.CheckItem(this._k_action.k_extWidget);
}
else {
return new Ext.menu.Item(this._k_action.k_extWidget);
}
},

k_setDisabled: function (k_disable) {
k_disable = false !== k_disable;
if (this.k_isDisabled() === k_disable) {
return;
}
this._k_isDisabled = k_disable;
if (!this.k_isReadOnly()) {
this._k_action.k_setDisabled(k_disable);
}
},

k_setReadOnly: function (k_readOnly) {
k_readOnly = false !== k_readOnly;
if (this.k_isReadOnly() === k_readOnly) {
return;
}
this._k_isReadOnly = k_readOnly;
if (!this.k_isDisabled()) {
this._k_action.k_setDisabled(k_readOnly);
}
},

k_setVisible: function (k_visible) {
k_visible = false !== k_visible;
if (this.k_isVisible() === k_visible) {
return;
}
this._k_isVisible = k_visible;
this._k_action.k_setVisible(k_visible);
},

k_setCaption: function (k_caption) {
this._k_action.k_setCaption(k_caption);
},

k_remove: function () {
this.k_menu.k_extWidget.remove(this.k_extWidget);
delete this.k_menu.k_items[this.k_name];
delete kerio.lib.k_widgets[this.k_id];
},

k_add: function (k_menu) {
this.k_menu = k_menu;
this.k_menu.k_extWidget.add(this.k_extWidget);
},

k_setIconClass: function (k_className) {
this.k_extWidget.setIconClass(k_className);
},

k_getCaption: function () {
return this.k_extWidget.text;
}
});


kerio.lib._K_SimpleButton = Ext.extend(Ext.BoxComponent, {

hidden : false,

disabled : false,

pressed : false,



enableToggle : false,



menuAlign : 'tl-bl?',



type : 'button',
menuClassTarget : 'tr',

clickEvent : 'click',

handleMouseEvents : true,

tooltipType : 'qtip',

buttonSelector : 'button:first-child',

scale : 'small',


iconAlign : 'left',

arrowAlign : 'right',





overClass: 'sbOver',
initComponent : function(){
Ext.Button.superclass.initComponent.call(this);
this.addEvents(

'click',

'toggle',

'mouseover',

'mouseout',

'menushow',

'menuhide',

'menutriggerover',

'menutriggerout'
);
if(this.menu){
this.menu = Ext.menu.MenuMgr.get(this.menu);
}
if(Ext.isString(this.toggleGroup)){
this.enableToggle = true;
}
},

getTemplateArgs : function(){
return [this.text || '&#160;', this.type, this.id];
},
setButtonClass : function(){
if(this.useSetClass){
if(!Ext.isEmpty(this.oldCls)){
this.el.removeClass([this.oldCls, 'sbPressed']);
}
this.oldCls = (this.iconCls || this.icon) ? (this.text ? 'sbTextIcon' : 'sbIcon') : 'sbNoIcon';
this.el.addClass([this.oldCls, this.pressed ? 'sbPressed' : null]);
}
},
onRender : function(ct, position){
if(!this.template){
if(!kerio.lib._K_SimpleButton.buttonTemplate){
kerio.lib._K_SimpleButton.buttonTemplate = new Ext.Template(
'<table id="{2}" border="0" cellpadding="0" cellspacing="0" class="simpleButton sbWrap"><tbody><tr>',
'<td class="sbLeft"><i>&#160;</i></td><td class="sbCenter"><em unselectable="on"><button class="sbText" type="{1}">{0}</button></em></td><td class="sbRight"><i>&#160;</i></td>',
"</tr></tbody></table>");
kerio.lib._K_SimpleButton.buttonTemplate.compile();
}
this.template = kerio.lib._K_SimpleButton.buttonTemplate;
}
var btn, targs = this.getTemplateArgs();
if(position){
btn = this.template.insertBefore(position, targs, true);
}else{
btn = this.template.append(ct, targs, true);
}

this.btnEl = btn.child(this.buttonSelector);
this.mon(this.btnEl, {
scope: this,
focus: this.onFocus,
blur: this.onBlur
});
this.initButtonEl(btn, this.btnEl);
Ext.ButtonToggleMgr.register(this);
},
initButtonEl : function(btn, btnEl){
this.el = btn;
this.setIcon(this.icon);
this.setIconClass(this.iconCls);
if(Ext.isDefined(this.tabIndex)){
btnEl.dom.tabIndex = this.tabIndex;
}
if(this.tooltip){
this.setTooltip(this.tooltip, true);
}
if(this.handleMouseEvents){
this.mon(btn, {
scope: this,
mouseover: this.onMouseOver,
mousedown: this.onMouseDown
});
}
if(this.menu){
this.mon(this.menu, {
scope: this,
show: this.onMenuShow,
hide: this.onMenuHide
});
this.el.child(this.menuClassTarget).addClass("sbWithMenu");
}
if(this.repeat){
var repeater = new Ext.util.ClickRepeater(btn, Ext.isObject(this.repeat) ? this.repeat : {});
this.mon(repeater, 'click', this.onClick, this);
}
this.mon(btn, this.clickEvent, this.onClick, this);
},
afterRender : function(){
Ext.Button.superclass.afterRender.call(this);
this.useSetClass = true;
this.setButtonClass();
this.doc = Ext.getDoc();
this.doAutoWidth();
},

setIconClass : function(cls){
this.iconCls = cls;
if(this.el){
this.btnEl.dom.className = '';
this.btnEl.addClass(['sbText', cls || '']);
this.setButtonClass();
}
return this;
},

setTooltip : function(tooltip,  initial){
if(this.rendered){
if(!initial){
this.clearTip();
}
if(Ext.isObject(tooltip)){
Ext.QuickTips.register(Ext.apply({
target: this.btnEl.id
}, tooltip));
this.tooltip = tooltip;
}else{
this.btnEl.dom[this.tooltipType] = tooltip;
}
}else{
this.tooltip = tooltip;
}
return this;
},
clearTip : function(){
if(Ext.isObject(this.tooltip)){
Ext.QuickTips.unregister(this.btnEl);
}
},
beforeDestroy : function(){
if(this.rendered){
this.clearTip();
}
if(this.menu && this.destroyMenu !== false) {
Ext.destroy(this.menu);
}
Ext.destroy(this.repeater);
},
onDestroy : function(){
if(this.rendered){
this.doc.un('mouseover', this.monitorMouseOver, this);
this.doc.un('mouseup', this.onMouseUp, this);
delete this.doc;
delete this.btnEl;
Ext.ButtonToggleMgr.unregister(this);
}
Ext.Button.superclass.onDestroy.call(this);
},
doAutoWidth : function(){
if(this.autoWidth !== false && this.el && this.text && this.width === undefined){
this.el.setWidth('auto');
if(Ext.isIE7 && Ext.isStrict){
var ib = this.btnEl;
if(ib && ib.getWidth() > 20){
ib.clip();
ib.setWidth(Ext.util.TextMetrics.measure(ib, this.text).width+ib.getFrameWidth('lr'));
}
}
if(this.minWidth){
if(this.el.getWidth() < this.minWidth){
this.el.setWidth(this.minWidth);
}
}
}
},

setHandler : function(handler, scope){
this.handler = handler;
this.scope = scope;
return this;
},

setText : function(text){
this.text = text;
if(this.el){
this.btnEl.update(text || '&#160;');
this.setButtonClass();
}
this.doAutoWidth();
return this;
},

setIcon : function(icon){
this.icon = icon;
if(this.el){
this.btnEl.setStyle('background-image', icon ? 'url(' + icon + ')' : '');
this.setButtonClass();
}
return this;
},

getText : function(){
return this.text;
},

toggle : function(state, suppressEvent){
state = state === undefined ? !this.pressed : !!state;
if(state != this.pressed){
if(this.rendered){
this.el[state ? 'addClass' : 'removeClass']('sbPressed');
}
this.pressed = state;
if(!suppressEvent){
this.fireEvent('toggle', this, state);
if(this.toggleHandler){
this.toggleHandler.call(this.scope || this, this, state);
}
}
}
return this;
},
onDisable : function(){
this.onDisableChange(true);
},
onEnable : function(){
this.onDisableChange(false);
},
onDisableChange : function(disabled){
if(this.el){
if(!Ext.isIE6 || !this.text){
this.el[disabled ? 'addClass' : 'removeClass'](this.disabledClass);
}
this.el.dom.disabled = disabled;
}
this.disabled = disabled;
},

showMenu : function(){
if(this.rendered && this.menu){
if(this.tooltip){
Ext.QuickTips.getQuickTip().cancelShow(this.btnEl);
}
if(this.menu.isVisible()){
this.menu.hide();
}
this.menu.ownerCt = this;
this.menu.show(this.el, this.menuAlign);
}
return this;
},

hideMenu : function(){
if(this.hasVisibleMenu()){
this.menu.hide();
}
return this;
},

hasVisibleMenu : function(){
return this.menu && this.menu.ownerCt === this && this.menu.isVisible();
},
onClick : function(e){
if(e){
e.preventDefault();
}
if(e.button !== 0){
return;
}
if(!this.disabled){
if(this.enableToggle && (this.allowDepress !== false || !this.pressed)){
this.toggle();
}
if(this.menu && !this.hasVisibleMenu() && !this.ignoreNextClick){
this.showMenu();
}
this.fireEvent('click', this, e);
if(this.handler){
this.handler.call(this.scope || this, this, e);
}
}
},
isMenuTriggerOver : function(e, internal){
return this.menu && !internal;
},
isMenuTriggerOut : function(e, internal){
return this.menu && !internal;
},
onMouseOver : function(e){
if(!this.disabled){
var internal = e.within(this.el,  true);
if(!internal){
this.el.addClass(this.overClass);
if(!this.monitoringMouseOver){
this.doc.on('mouseover', this.monitorMouseOver, this);
this.monitoringMouseOver = true;
}
this.fireEvent('mouseover', this, e);
}
if(this.isMenuTriggerOver(e, internal)){
this.fireEvent('menutriggerover', this, this.menu, e);
}
}
},
monitorMouseOver : function(e){
if(e.target !== this.el.dom && !e.within(this.el)){
if(this.monitoringMouseOver){
this.doc.un('mouseover', this.monitorMouseOver, this);
this.monitoringMouseOver = false;
}
this.onMouseOut(e);
}
},
onMouseOut : function(e){
var internal = e.within(this.el) && e.target !== this.el.dom;
this.el.removeClass(this.overClass);
this.fireEvent('mouseout', this, e);
if(this.isMenuTriggerOut(e, internal)){
this.fireEvent('menutriggerout', this, this.menu, e);
}
},
focus : function() {
this.btnEl.focus();
},
blur : function() {
this.btnEl.blur();
},
onFocus : function(e){
if(!this.disabled){
this.el.addClass('sbFocus');
this.fireEvent('focus', this);
}
},
onBlur : function(e){
this.el.removeClass('sbFocus');
this.fireEvent('blur', this);
},
getClickEl : function(e, isUp){
return this.el;
},
onMouseDown : function(e){
if(!this.disabled && e.button === 0){
this.getClickEl(e).addClass('sbClick');
this.doc.on('mouseup', this.onMouseUp, this);
}
},
onMouseUp : function(e){
if(e.button === 0){
this.getClickEl(e, true).removeClass('sbClick');
this.doc.un('mouseup', this.onMouseUp, this);
}
},
onMenuShow : function(e){
if(this.menu.ownerCt === this){
this.menu.ownerCt = this;
this.ignoreNextClick = 0;
this.el.addClass('sbMenuActive');
this.fireEvent('menushow', this, this.menu);
}
},
onMenuHide : function(e){
if(this.menu.ownerCt === this){
this.el.removeClass('sbMenuActive');
this.ignoreNextClick = this.restoreClick.defer(250, this);
this.fireEvent('menuhide', this, this.menu);
delete this.menu.ownerCt;
}
},
restoreClick : function(){
this.ignoreNextClick = 0;
}






});
Ext.ButtonToggleMgr = function(){
var groups = {};
function toggleGroup(btn, state){
if(state){
var g = groups[btn.toggleGroup];
for(var i = 0, l = g.length; i < l; i++){
if(g[i] !== btn){
g[i].toggle(false);
}
}
}
}
return {
register : function(btn){
if(!btn.toggleGroup){
return;
}
var g = groups[btn.toggleGroup];
if(!g){
g = groups[btn.toggleGroup] = [];
}
g.push(btn);
btn.on('toggle', toggleGroup);
},
unregister : function(btn){
if(!btn.toggleGroup){
return;
}
var g = groups[btn.toggleGroup];
if(g){
g.remove(btn);
btn.un('toggle', toggleGroup);
}
},

getPressed : function(group){
var g = groups[group];
if(g){
for(var i = 0, len = g.length; i < len; i++){
if(g[i].pressed === true){
return g[i];
}
}
}
return null;
}
};
}();

kerio.lib._K_SimpleSplitButton = Ext.extend(kerio.lib._K_SimpleButton, {
arrowSelector : 'em',
split: true,
initComponent : function(){
kerio.lib._K_SimpleSplitButton.superclass.initComponent.call(this);

this.addEvents("arrowclick");
},
onRender : function(){
if(!this.template){
if(!kerio.lib._K_SimpleSplitButton.buttonTemplate){
kerio.lib._K_SimpleSplitButton.buttonTemplate = new Ext.Template(
'<table id="{2}" cellspacing="0" class="sbMenuWrap simpleButton"><tr><td>',
'<table cellspacing="0" class="sbWrap sbMenuTextWrap"><tbody>',
'<tr><td class="sbLeft"><i>&#160;</i></td><td class="sbCenter"><button class="sbText" type="{1}">{0}</button></td></tr>',
"</tbody></table></td><td>",
'<table cellspacing="0" class="sbWrap sbMenuArrowWrap"><tbody>',
'<tr><td class="sbCenter"><button class="sbMenuArrowEl" type="button">&#160;</button></td><td class="sbRight"><i>&#160;</i></td></tr>',
"</tbody></table></td></tr></table>"
);
kerio.lib._K_SimpleSplitButton.buttonTemplate.compile();
}
this.template = kerio.lib._K_SimpleSplitButton.buttonTemplate;
}
kerio.lib._K_SimpleSplitButton.superclass.onRender.apply(this, arguments);
if(this.arrowTooltip){
this.el.child(this.arrowSelector).dom[this.tooltipType] = this.arrowTooltip;
}
},

setArrowHandler : function(handler, scope){
this.arrowHandler = handler;
this.scope = scope;
},
isClickOnArrow : function(e){
return e.getTarget(".sbMenuArrowWrap");
},
onClick : function(e, t){
e.preventDefault();
if(!this.disabled){
if(this.isClickOnArrow(e)){
if(this.menu && !this.menu.isVisible() && !this.ignoreNextClick){
this.showMenu();
}
this.fireEvent("arrowclick", this, e);
if(this.arrowHandler){
this.arrowHandler.call(this.scope || this, this, e);
}
}else{
if(this.enableToggle){
this.toggle();
}
this.fireEvent("click", this, e);
if(this.handler){
this.handler.call(this.scope || this, this, e);
}
}
}
},
isMenuTriggerOver : function(e){
return this.menu && e.target.tagName === this.arrowSelector;
},
isMenuTriggerOut : function(e, internal){
return this.menu && e.target.tagName !== this.arrowSelector;
},
doAutoWidth: function () {
if(this.el){
var tbl = this.el.child("table:first");
var tbl2 = this.el.child("table:last");
this.el.setWidth("auto");
tbl.setWidth("auto");
if(Ext.isIE7 && Ext.isStrict){
var ib = this.el.child(this.buttonSelector);
if(ib && ib.getWidth() > 20){
ib.clip();
ib.setWidth(Ext.util.TextMetrics.measure(ib, this.text).width+ib.getFrameWidth('lr'));
}
}
if(this.minWidth){
if((tbl.getWidth()+tbl2.getWidth()) < this.minWidth){
tbl.setWidth(this.minWidth-tbl2.getWidth());
}
}
this.el.setWidth(tbl.getWidth()+tbl2.getWidth());
}
}
});
Ext.Button.prototype = kerio.lib._K_SimpleButton.prototype;
Ext.Button = kerio.lib._K_SimpleButton;
Ext.SplitButton.prototype = kerio.lib._K_SimpleSplitButton.prototype;
Ext.SplitButton = kerio.lib._K_SimpleSplitButton;
Ext.Toolbar.Button.prototype = kerio.lib._K_SimpleButton.prototype;
Ext.Toolbar.Button = kerio.lib._K_SimpleButton;
Ext.Toolbar.SplitButton.prototype = kerio.lib._K_SimpleSplitButton.prototype;
Ext.Toolbar.SplitButton = kerio.lib._K_SimpleSplitButton;
Ext.PagingToolbar.prototype.cls = 'flatToolbarButtons';


kerio.lib.K_Button = function (k_id, k_config) {
var k_action;
this.k_name = k_config.k_id;
this._k_setStoredProperties([
'k_isDefault',
'k_items',
'k_isColorPicker'
]);
if (!k_config._k_isAction) {
k_action = new kerio.lib.K_Action(k_config);
}
else {
k_action = k_config;
}
this._k_action = k_action;
kerio.lib.K_Button.superclass.constructor.call(this, k_id, k_config);
if (true === k_config.k_isHidden) {
this.k_setVisible(false);
}
if (true === k_config.k_isDisabled) {
this.k_setDisabled(true);
}
if (true === k_config.k_isReadOnly) {
this.k_setReadOnly(true);
}
};
Ext.extend(kerio.lib.K_Button, kerio.lib._K_BaseWidget,
{




_k_propertiesMapping: {},

_k_propertiesDefault: {},
_k_isDisabledByContainer: false,
_k_isReadOnlyByContainer: false,
_k_isVisibleByContainer: true,

_k_beforeInitExtComponent: function (k_adaptedConfig, k_storedConfig) {
var
k_menu,
k_menuConstructor;
if (this._k_action) {
k_adaptedConfig = this._k_action.k_extWidget.initialConfig;
k_adaptedConfig.id = this.k_id;
}
if (k_storedConfig.k_isColorPicker) {
k_menuConstructor = kerio.lib.K_ColorPicker;
}
else {
k_menuConstructor = kerio.lib.K_Menu;
}
if (k_storedConfig.k_items || k_storedConfig.k_isColorPicker) {
k_menu = new k_menuConstructor(this.k_id + '_' + 'k_menu', k_storedConfig);
k_adaptedConfig.menu = k_menu.k_extWidget;
this.k_submenu = k_menu;
k_menu.k_relatedButton = this;
}
if (k_adaptedConfig.text) {
k_adaptedConfig.minWidth = k_adaptedConfig.minWidth || kerio.lib.k_constants.k_BUTTON_MIN_WIDTH;
}
else {
k_adaptedConfig.minWidth = k_adaptedConfig.minWidth || 22;
}
if (true === k_storedConfig.k_isDefault) {
k_adaptedConfig.cls = kerio.lib._k_addClassName(k_adaptedConfig.cls, 'defaultButton');
}
this._k_removeStoredProperties(['k_items']);
},

_k_initExtComponent: function (k_adaptedConfig, k_storedConfig) {
return new kerio.lib._K_SimpleButton(this._k_action ? this._k_action.k_extWidget : k_adaptedConfig);
},

_k_getMenu: function (k_menuItemId) {
return this.k_relatedWidget.k_items[k_menuItemId].k_submenu;
},

k_removeMenuItem: function (k_menuItemId) {
var k_menuItem = this.k_submenu.k_items[k_menuItemId];
k_menuItem.k_remove();
},

k_removeAllMenuItems: function (k_menuItemId) {
var k_menu = this._k_getMenu(k_menuItemId);
k_menu.k_removeAllItems();
k_menu._k_localItem = {};
},

k_addMenuItem: function(k_parentMenuId, k_menuItemCfg) {
var k_menu = this._k_getMenu(k_parentMenuId);
k_menu.k_addItem(k_menuItemCfg);
},

k_setDisabled: function (k_disable) {
kerio.lib._K_FormItem.prototype.k_setDisabled.call(this, k_disable);
},

_k_setDisabledByContainer: function (k_disable)	{
kerio.lib._K_FormItem.prototype._k_setDisabledByContainer.call(this, k_disable);
},

_k_setDisabledItem: function (k_disable) {
if (!this.k_isReadOnly()) {
this._k_action.k_setDisabled(k_disable);
this._k_setDisabledDeferred(k_disable);
}
},

k_isDisabled: function () {
return kerio.lib._K_FormItem.prototype.k_isDisabled.call(this);
},

k_isDisabledByContainer: function () {
return this._k_isDisabledByContainer;
},

k_isReadOnlyByContainer: function () {
return this._k_isReadOnlyByContainer;
},

k_isVisibleByContainer: function() {
return this._k_isVisibleByContainer;
},

_k_setDisabledDeferred: function (k_disable) {
var
k_removeClassName,
k_addClassName;
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
k_removeClassName = k_disable ? 'enabled' : 'disabled';
k_addClassName    = k_disable ? 'disabled' : 'enabled';
this.k_extWidget.el.replaceClass(k_removeClassName, k_addClassName);
},

k_setReadOnly: function (k_readOnly) {
kerio.lib._K_FormItem.prototype.k_setReadOnly.call(this, k_readOnly);
},

_k_setReadOnlyByContainer: function (k_readOnly) {
kerio.lib._K_FormItem.prototype._k_setReadOnlyByContainer.call(this, k_readOnly);
},

_k_setReadOnlyItem: function (k_readOnly) {
if (!this.k_isDisabled()) {
this._k_action.k_setReadOnly(k_readOnly);
}
},

k_isReadOnly: function () {
return kerio.lib._K_FormItem.prototype.k_isReadOnly.call(this);
},

k_setVisible: function (k_visible) {
k_visible = false !== k_visible;
if (this._k_isVisible === k_visible) {
return;
}
this._k_isVisible = k_visible;
this._k_action.k_setVisible(k_visible);
},

_k_setVisibleByParent: function (k_visible) {
kerio.lib._K_FormItem.prototype._k_setVisibleByParent.call(this, k_visible);
},

k_isVisible: function () {
return kerio.lib._K_FormItem.prototype.k_isVisible.call(this);
},

k_setCaption: function (k_caption) {
this._k_action.k_setCaption(k_caption);
}
});

kerio.lib.K_SplitButton = function (k_id, k_config) {
kerio.lib.K_SplitButton.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_SplitButton, kerio.lib.K_Button,
{

_k_initExtComponent: function (k_adaptedConfig, k_storedConfig) {
return new kerio.lib._K_SimpleSplitButton(this._k_action ? this._k_action.k_extWidget : k_adaptedConfig);
}
});


kerio.lib._K_FocusableContainer = function (k_id, k_config) {
this._k_focusableItems = new Ext.util.MixedCollection();
this._k_actFocusedItemIndex = null;
this._k_isArraySorted = false;
this._k_isLastDirectionReverse = false;
kerio.lib._K_FocusableContainer.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib._K_FocusableContainer, kerio.lib._K_BaseWidget, {

_k_sortItems: function () {
this._k_focusableItems.sort('ASC', function (k_a, k_b) {
var k_aTabIndex = (kerio.lib._k_isKerioWidget(k_a) ? k_a._k_tabIndex : k_a._kx._k_tabIndex);
var k_bTabIndex = (kerio.lib._k_isKerioWidget(k_b) ? k_b._k_tabIndex : k_b._kx._k_tabIndex);
if (undefined === k_aTabIndex || undefined === k_bTabIndex) {  k_aTabIndex = 0;
k_bTabIndex = 0;
}
return (k_aTabIndex - k_bTabIndex);
});
},

k_getFocusableItems: function () {
if (!this._k_isArraySorted) {
this._k_sortItems();
this._k_isArraySorted = true;
}
return this._k_focusableItems;
},

k_addFocusableItem: function (k_item) {
var k_id = this._k_initFocusableItem(k_item);
if (k_id) {
this._k_focusableItems.add(k_id, k_item);
}
},

_k_initFocusableItem: function (k_item) {
if (!k_item) {
return null;
}
var k_addKerioProperty = kerio.lib._k_addKerioProperty;
var k_isKerioWidget = kerio.lib._k_isKerioWidget(k_item);
var k_id;
var k_kerioProperties = {};
if (k_isKerioWidget) {
if (undefined === k_item._k_tabIndex) {
k_item._k_tabIndex = 0;
}
k_id = k_item.k_extWidget.id;
}
else {
if (undefined === k_item._k_tabIndex) {
k_kerioProperties._k_tabIndex = 0;
}
k_id = k_item.id;
}
if (!k_id) {
k_id = Ext.id();
k_item.id = k_id;
}
if (!this._k_isFocusableContainer(k_item)) {
if (k_item instanceof Ext.Toolbar.Item) {
var k_tabIndex = k_item._k_tabIndex;
k_item = Ext.get(k_item.getEl().id);
k_kerioProperties._k_tabIndex = k_tabIndex;
}
k_kerioProperties._k_focusableContainer = this;
}
k_addKerioProperty(k_item, k_kerioProperties);
return k_id;
},

_k_isFocusableContainer: function (k_item) {
return (k_item instanceof kerio.lib._K_FocusableContainer);
},

k_getFocusedItemIndex: function () {
return this._k_actFocusedItemIndex;
},

k_setFocusedItemIndex: function (k_index) {
this._k_actFocusedItemIndex = k_index;
},

_k_isValid: function(k_markInvalid) {
var
k_myWidgets = this.k_getFocusableItems().items,
k_cnt = k_myWidgets.length,
k_results = new kerio.lib._K_ValidationResults(),
k_i,
k_widget;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_widget = k_myWidgets[k_i];
if (!k_widget) {
continue; }
if (k_widget._kx && k_widget._kx.k_owner) {
k_widget = k_widget._kx.k_owner; }
if (k_widget._k_isValid) {
k_results.k_add(k_widget._k_isValid(k_markInvalid), k_results.k_valid); }
else if (k_widget instanceof kerio.lib._K_FormItem){
if (k_widget.k_isValid) {
if (!k_widget.k_isValid(k_markInvalid)) {
if (k_results.k_isValid()) { k_results.k_addMethod(k_widget.k_focusItem, [], k_widget);
}
k_results.k_inc('' === k_widget.k_getValue());
}
}
}
} return k_results;
},

k_isValid: function(k_notifyUser) {
var
k_notify = (false !== k_notifyUser), k_result;
k_result = this._k_isValid(k_notify);
return k_result.k_isValid(k_notify);
}
});


kerio.lib._k_windowManager = {

_k_stack: new Ext.util.MixedCollection(false, function (k_object) {
return k_object.k_id;
}),

_k_mainLayout: null,

k_setMainLayout: function (k_mainLayout) {
this._k_mainLayout = k_mainLayout;
if (kerio.lib.k_isIPadCompatible) {
this._k_moveTouchScrollingCls(null, k_mainLayout);
}
},

_k_moveTouchScrollingCls: function (k_windowToRemove, k_windowToAdd){
if (k_windowToRemove) {
k_windowToRemove.k_extWidget.removeClass('touchScrolling');
}
if (k_windowToAdd) {
k_windowToAdd.k_extWidget.addClass('touchScrolling');
}
},

k_onWindowShow: function (k_window) {
var
k_focusManager = k_window._k_focusManager,
k_defaultItem;
k_defaultItem = k_focusManager.k_getDefaultItem(k_window);
if (kerio.lib.k_isIPadCompatible) {
this._k_moveTouchScrollingCls(this._k_stack.last() || this._k_mainLayout, k_window);
}
this._k_stack.add(k_window);
k_focusManager._k_focusItem(k_defaultItem);
},

k_onWindowHide: function (k_window) {
var k_focusManager = k_window._k_focusManager;
this._k_stack.remove(k_window);
if (kerio.lib.k_isIPadCompatible) {
this._k_moveTouchScrollingCls(k_window, this._k_stack.last() || this._k_mainLayout);
}
k_focusManager._k_setFocusedItemIndex(0);
k_window = this._k_stack.last();
k_focusManager = k_window ? k_window._k_focusManager : this._k_mainLayout ? this._k_mainLayout._k_focusManager : null;
if (k_focusManager) {
k_focusManager._k_focusCurrentItem();
}
},

k_getActiveWindow: function (k_ignoreMessageBox) {
var
k_stack = this._k_stack,
k_i;
if (true !== k_ignoreMessageBox) {
return k_stack.last();
}
for (k_i = k_stack.getCount() - 1; k_i >= 0; k_i--) {
if (k_stack.itemAt(k_i).k_isInstanceOf('K_Dialog')) {
return k_stack.itemAt(k_i);
}
}
return null;
}
};


kerio.lib.K_FocusManager = function (k_owner) {
var
k_focusableItems,
k_i, k_cnt;
this._k_owner = k_owner;
if (k_owner.k_extWidget.rendered) {
this._k_initOnRender();
}
else {
k_owner.k_extWidget.on('render', this._k_initOnRender, this);
}
k_focusableItems = this._k_getFocusableItems(k_owner.k_extWidget, undefined, true);
k_cnt = k_focusableItems.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
this._k_initItemHandlers(k_focusableItems[k_i]);
}
this._k_initCardLayouts();
this._k_currentItemIndex = 0; };
kerio.lib.K_FocusManager.prototype = {
_k_isActive: true,
_k_maskedClassName: '.x-masked',

_k_initOnRender: function () {
var k_ownerExtWidget = this._k_owner.k_extWidget;
this._k_focusEl = k_ownerExtWidget.focusEl || k_ownerExtWidget.getEl().createChild({
tag: 'a',
cls: 'x-grid3-focus',
href: '#',
tabIndex: '-1'
});
this._k_keyNav = new Ext.KeyNav(k_ownerExtWidget.getEl(), {
tab: this._k_tabKeyEventHandler,
defaultEventAction: 'preventDefault',
scope: this
});
},

_k_tabKeyEventHandler: function (k_e) {
var k_window;
if (true !== k_e.ctrlKey) {
k_e.stopEvent();
k_window = kerio.lib._k_windowManager.k_getActiveWindow();
if (k_window && k_window !== this._k_owner) { k_window._k_focusManager._k_focusCurrentItem();
}
else {
this._k_focusNextItem(true === k_e.shiftKey);
}
}
},

_k_initCardLayouts: function () {
var
k_cardLayouts,
k_cardLayoutsCount,
k_cardLayoutIndex,
k_panel,
k_panelItems,
k_panelItemsCount,
k_panelItemIndex;
k_cardLayouts = this._k_owner.k_extWidget.findBy(
function(k_component) {
var k_layout = k_component.layout;
return ('card' === k_layout || 'k_singlecard' === k_layout || k_layout instanceof Ext.layout.CardLayout);
}
);
k_cardLayoutsCount = k_cardLayouts.length;
for (k_cardLayoutIndex = 0; k_cardLayoutIndex < k_cardLayoutsCount; k_cardLayoutIndex++) {
k_panel = k_cardLayouts[k_cardLayoutIndex];
k_panel.on('add', this._k_onPanelAdd, this);
k_panelItems = k_panel.items;
if (k_panel instanceof Ext.TabPanel && k_panelItems) {
k_panelItemsCount = k_panelItems.getCount();
for (k_panelItemIndex = 0; k_panelItemIndex < k_panelItemsCount; k_panelItemIndex++) {
this._k_initTabPanelEvents(k_panelItems.itemAt(k_panelItemIndex));
}
}
}
},

_k_onPanelAdd: function () {
this._k_initCardLayouts();
},

_k_initTabPanelEvents: function (k_extComponent) {
k_extComponent.on('beforehide', this._k_saveCurrentItemBeforeDeactivate, this);
k_extComponent.on('activate', this._k_updateFocusManagerOnTabActivate, this);
},

_k_saveCurrentItemBeforeDeactivate: function () {
var
k_currentItem = this._k_getCurrentItem() || {},
k_kx = k_currentItem._kx || {},
k_toolbar = k_kx.k_toolbar || {},
k_parentWidget = k_toolbar.k_parentWidget;
if (k_parentWidget && (k_parentWidget.k_isInstanceOf('K_Dialog') || k_parentWidget.k_isInstanceOf('K_TabPage'))) {
this._k_tabCurrentItem = k_currentItem;
}
else {
delete this._k_tabCurrentItem;
}
},

_k_updateFocusManagerOnTabActivate: function (k_extPanel) {
var
k_topLevelParent = this._k_owner,
k_itemIndex,
k_currentItem;
if (k_topLevelParent.k_extWidget.isVisible()) {
k_itemIndex = this._k_tabCurrentItem ? this._k_getItems().indexOf(this._k_tabCurrentItem) : 0;
if (k_topLevelParent._k_isBrowserWindow && 0 === k_itemIndex) {
k_itemIndex = k_topLevelParent.k_firstFocusableItemIndex || 0;  }
this._k_setFocusedItemIndex(k_itemIndex);
delete this._k_tabCurrentItem;
if (Ext.isGecko) { k_currentItem = this._k_getCurrentItem();
this._k_focusCurrentItem.defer(k_currentItem instanceof Ext.tree.TreePanel ? 10 : 0, this);
}
else {
this._k_focusCurrentItem();
}
}
},

_k_onItemFocus: function (k_item) {
this._k_currentItemIndex = this._k_getItems(this).indexOfKey(k_item.id);
k_item.on({
'disable' : this._k_focusNextItemOnStateChanged,
'hide' : this._k_focusNextItemOnStateChanged,
'readonly' : this._k_focusNextItemOnStateChanged,
scope: this
});
},

_k_onItemBlur: function (k_item) {
k_item.un('disable', this._k_focusNextItemOnStateChanged, this);
k_item.un('hide', this._k_focusNextItemOnStateChanged, this);
k_item.un('readonly', this._k_focusNextItemOnStateChanged, this);
},

_k_focusNextItem: function (k_reverse) {
var k_newItemIndex = this._k_getNextItemIndex(k_reverse);
if (null === k_newItemIndex) {
this._k_owner.k_extWidget.focusEl.focus();
}
else {
this._k_focusItem(k_newItemIndex, k_reverse);
}
},

_k_isItemFocusable: function (k_item) {
var
k_kerioWidget = k_item._kx ? k_item._kx.k_owner : null,
k_result;
if (k_kerioWidget) {
k_result = (k_kerioWidget.k_isVisible() && !k_kerioWidget.k_isDisabled() && !k_kerioWidget.k_isReadOnly());
}
else {
k_result = ((true !== k_item.hidden) && (true !== k_item.disabled) && (true !== k_item.readOnly));
}
if (k_result && k_item.rendered) {
if (k_kerioWidget instanceof kerio.lib.K_RadioGroup) {
k_item = k_kerioWidget._k_items[0].k_extWidget;
}
k_result = !Boolean(k_item.getEl().findParent(this._k_maskedClassName));
}
k_result = k_result && k_item.rendered; return k_result;
},

_k_focusItem: function (k_item, k_reverse) {
var k_owner = this._k_owner;
if ('number' === Ext.type(k_item)) {
k_item = this._k_getItemByIndex(k_item);
}
if (!k_item) { return;
}
if (k_item.k_extWidget) { k_item = k_item.k_extWidget;
}
if (k_owner.k_extWidget.isVisible()) {
this._k_focusItemDeferred.defer(10, this, [k_item, k_reverse]);
}
else {
this._k_setFocusedItemIndex(this._k_getItemIndex(k_item));
}
},

_k_focusItemDeferred: function (k_item, k_reverse) {
if (!this._k_isActive) {
return;
}
var
k_owner = this._k_owner,
k_activeWindow = kerio.lib._k_windowManager.k_getActiveWindow(),
k_mainLayout = kerio.lib._k_windowManager._k_mainLayout;
if ((k_activeWindow && k_owner !== k_activeWindow) || (!k_activeWindow && k_owner !== k_mainLayout)) {
return;
}
if (this._k_isItemFocusable(k_item)) {
k_item.focus();
}
else {
this._k_setFocusedItemIndex(this._k_getItemIndex(k_item));
this._k_focusNextItem(k_reverse);
}
},

_k_focusNextItemOnStateChanged: function (k_item) {
this._k_focusNextItem();
},

_k_getNextItemIndex: function (k_reverse) {
var
k_currentItemIndex = this._k_currentItemIndex,
k_newItemIndex = k_currentItemIndex,
k_increment = (k_reverse ? -1 : 1),
k_items = this._k_getItems(),
k_itemsCount = k_items.getCount(),
k_item;
do {
k_newItemIndex += k_increment;
if (k_currentItemIndex == k_newItemIndex) {
k_newItemIndex = null;
break;
}
if (k_newItemIndex >= k_itemsCount) {
k_newItemIndex = 0;
break;
}
if (k_newItemIndex < 0) {
k_newItemIndex = k_itemsCount - 1;
break;
}
k_item = k_items.itemAt(k_newItemIndex);
}
while (!this._k_isItemFocusable(k_item));
return k_newItemIndex;
},

_k_focusCurrentItem: function () {
var
k_index = this._k_currentItemIndex,
k_item;
if (-1 !== k_index) {
k_item = this._k_getItemByIndex(k_index);
}
if (k_item && this._k_isItemFocusable(k_item)) {
this._k_focusItem(k_index);
}
else {
this._k_focusNextItem(false);
}
},

_k_setFocusedItemIndex: function (k_index) {
this._k_currentItemIndex = k_index;
},

_k_getCurrentItemIndex: function () {
return this._k_currentItemIndex;
},

_k_getCurrentItem: function () {
return this._k_getItems().itemAt(this._k_currentItemIndex);
},

_k_getItemByIndex: function (k_index) {
return this._k_getItems().itemAt(k_index);
},

_k_getItemIndex: function (k_item) {
return this._k_getItems().indexOf(k_item);
},

_k_getItems: function () {
var k_mc = new Ext.util.MixedCollection();
k_mc.addAll(this._k_getFocusableItems(this._k_owner.k_extWidget));
return k_mc;
},

_k_initItemHandlers: function (k_item) {
var k_kerioWidget;
if (k_item.k_extWidget) {
k_kerioWidget = k_item;
k_item = k_item.k_extWidget;
}
else {
k_kerioWidget = k_item._kx ? k_item._kx.k_owner : null;
}
k_item.on('focus', this._k_onItemFocus, this);
k_item.on('blur', this._k_onItemBlur, this);
if (!(k_kerioWidget instanceof kerio.lib.K_Grid)) {
k_item.on('focus', function (k_extWidget) {
k_extWidget.addClass('focusedItem');
}, k_item);
k_item.on('blur', function (k_extWidget) {
k_extWidget.removeClass('focusedItem');
}, k_item);
}
kerio.lib._k_addKerioProperty(k_item, {k_isFocusHandlerInitialized: true});
},

_k_getFocusableItems: function (k_extWidget, k_itemList, k_getAll) {
var
k_extItems,
k_extItemsCount,
k_extItem,
k_kerioWidget,
k_i,
k_layout,
k_radioGroup;
if (!k_itemList) {
k_itemList = [];
}
k_layout = k_extWidget.layout;
if ((true !== k_getAll) && (k_layout instanceof Ext.layout.CardLayout) && (null !== k_layout.activeItem)) {
k_kerioWidget = k_extWidget._kx ? k_extWidget._kx.k_owner : null;
k_itemList = k_itemList.concat(this._k_getToolbarContainerFocusableItems(k_kerioWidget));
k_extWidget = k_layout.activeItem;
}
k_extItems = k_extWidget.items;
if(k_extItems){
for(k_i = 0, k_extItemsCount = k_extItems.getCount(); k_i < k_extItemsCount; k_i++){
k_extItem = k_extItems.itemAt(k_i);
k_itemList = this._k_getFocusableItems(k_extItem, k_itemList, k_getAll);
}
}
k_kerioWidget = k_extWidget._kx ? k_extWidget._kx.k_owner : null;
k_itemList = k_itemList.concat(this._k_getToolbarContainerFocusableItems(k_kerioWidget));
if (k_kerioWidget instanceof kerio.lib.K_Dialog) {
k_itemList = k_itemList.concat(this._k_getToolbarFocusableItems(k_kerioWidget.k_toolbar));
}
if (k_extWidget._kx && k_extWidget._kx.k_isMessageBox) {
k_itemList = k_itemList.concat(this._k_getMessageBoxFocusableItems(k_extWidget));
}
if (k_kerioWidget && (k_kerioWidget.k_isInstanceOf('K_Radio') && !k_kerioWidget.k_isInstanceOf('K_Checkbox'))) {
k_radioGroup = k_kerioWidget.k_getRadioGroup();
k_kerioWidget = k_radioGroup;
k_extWidget = k_kerioWidget.k_extWidget;
if (-1 !== k_itemList.indexOf(k_extWidget)) {
k_kerioWidget = null;
}
}
if (this._k_isFocusableWidget(k_kerioWidget)) {
k_itemList.push(k_extWidget);
}
return k_itemList;
},

_k_getToolbarContainerFocusableItems: function (k_kerioWidget) {
var
k_itemList = [],
k_toolbars,
k_toolbarPos,
k_toolbar;
if (!(k_kerioWidget instanceof kerio.lib._K_ToolbarContainer)) {
return [];
}
k_toolbars = k_kerioWidget.k_toolbars;
for (k_toolbarPos in k_toolbars) {
k_toolbar = k_toolbars[k_toolbarPos];
k_itemList = k_itemList.concat(this._k_getToolbarFocusableItems(k_toolbar));
}
return k_itemList;
},

_k_getMessageBoxFocusableItems: function (k_extMessageBox) {
var
k_buttons = k_extMessageBox.buttons,
k_items = [],
k_buttonsCount = k_buttons.length,
k_button,
k_i;
for (k_i = 0; k_i < k_buttonsCount; k_i++) {
k_button = k_buttons[k_i];
if (this._k_isItemFocusable(k_button)) {
k_items.push(k_button);
}
}
return k_items;
},

_k_getToolbarFocusableItems: function (k_toolbar) {
var
k_buttons = [],
k_toolbarItems = k_toolbar.k_items,
k_item,
k_extItem,
k_itemName;
for (k_itemName in k_toolbarItems) {
k_item = k_toolbarItems[k_itemName];
if ('function' === Ext.type(k_item)) {
continue;
}
if (k_item.k_extWidget) {
k_extItem = k_item.k_extWidget;
}
else {
k_extItem = k_item;
}
if (this._k_isFocusableWidget(k_item)) {
k_buttons.push(k_extItem);
}
}
return k_buttons;
},

_k_isFocusableWidget: function (k_widget) {
if (!k_widget) {
return false;
}
var k_isFocusable = false;
if (k_widget && k_widget.k_isInstanceOf) {
k_isFocusable = k_widget.k_isInstanceOf(['K_Grid', 'K_Tree', 'K_RowView', 'K_Button']);
if (k_isFocusable && k_widget.k_isInstanceOf('K_Grid')) {
if (false === k_widget._k_isSelection) {
k_isFocusable = false;
}
else if (0 === k_widget.k_getRowsCount()){
if (!k_widget.k_extWidget._kx || !k_widget.k_extWidget._kx.k_isFocusHandlerInitialized) {
this._k_initItemHandlers(k_widget);
}
k_isFocusable = false;
}
}
if (!k_isFocusable && k_widget.k_isInstanceOf('_K_FormItem')) {
k_isFocusable = !k_widget.k_isInstanceOf([
'K_SimpleText',
'K_TemplateText',
'K_DisplayField',
'K_ProgressBar',
'K_ImageField',
'K_UploadButton' ]);
if (k_isFocusable && 'hidden' === k_widget.k_extWidget.inputType) {
k_isFocusable = false;
}
}
}
if (!k_isFocusable && k_widget instanceof Ext.Button || k_widget instanceof kerio.lib._K_SimpleButton) { k_isFocusable = true;
}
if (k_isFocusable) {
if (k_widget.k_extWidget) {
k_widget = k_widget.k_extWidget;
}
if (!k_widget._kx || !k_widget._kx.k_isFocusHandlerInitialized) {
this._k_initItemHandlers(k_widget);
}
}
return k_isFocusable;
},

k_getDefaultItem: function (k_window) {
var
k_defaultItem = k_window._k_defaultItem,
k_defaultItemId = k_window._k_defaultItemId,
k_content,
k_items;
if (k_defaultItem) {
return k_defaultItem;
}
if (k_defaultItemId) {
k_defaultItem = Ext.getCmp(k_defaultItemId);
if (!k_defaultItem) {
kerio.lib.k_reportError('Internal Error: Default item \'' + k_defaultItemId + '\' defined for \'' + k_window.k_id + '\' not found.', 'focusManager.js');
return;
}
}
else {
k_content = k_window._k_storedConfig.k_content;
if (k_content) {
k_items = this._k_getFocusableItems(k_content.k_extWidget);
k_defaultItem = k_items[0];
}
if (!k_defaultItem) {
k_defaultItem = k_window._k_defaultButton;
}
}
k_window._k_defaultItem = k_defaultItem;
return k_defaultItem;
},

k_activate: function () {
this._k_isActive = true;
this._k_focusEl.un('keydown', this._k_onFocusElKeyDown, this);
this._k_focusCurrentItem();
},

k_deactivate: function () {
this._k_isActive = false;
this._k_focusEl.on('keydown', this._k_onFocusElKeyDown, this);
this._k_focusEl.focus();
},

_k_onFocusElKeyDown: function (k_event) {
k_event.stopEvent();
},

_k_controlFocus: function(k_event) {
var
k_targetEl = Ext.get(k_event.getTarget()),
k_targetWidget = null,
k_focusableHtmlElements = ['a', 'input', 'select', 'textarea', 'button'],
k_isFocusableElement = false,
k_scopeName,
k_tmpEl,
k_focusedItem;
if (k_targetEl) {
k_scopeName = k_targetEl.dom.scopeName;
if ((kerio.lib.k_isMSIE7 || kerio.lib.k_isMSIE8) && k_scopeName && 'HTML' !== k_scopeName) {
try {
if ('urn:schemas-microsoft-com:vml' === document.namespaces.item(k_scopeName).urn.toLowerCase()) {
return;
}
}
catch (k_ex) {
return;
}
}
if ('file' === k_targetEl.dom.type) {
k_targetWidget = Ext.getCmp(k_targetEl.dom.parentNode.firstChild.id);
}
else {
k_targetWidget = Ext.getCmp(k_targetEl.id);
if (!k_targetWidget && (k_targetEl.hasClass('x-form-trigger') || k_targetEl.hasClass('x-form-cb-label'))) {
k_tmpEl = k_targetEl.prev('.x-form-field');
if (!k_tmpEl) { k_tmpEl = k_targetEl.parent('span.multiTrigger');
if (k_tmpEl) {
k_tmpEl = k_tmpEl.prev('.x-form-field');
}
}
if (k_tmpEl) {
k_targetWidget = Ext.getCmp(k_tmpEl.id);
}
}
}
if (k_targetWidget instanceof Ext.form.Field && !(k_targetWidget instanceof Ext.form.DisplayField)) {
k_isFocusableElement = true;
}
else if (-1 !== k_focusableHtmlElements.indexOf(k_targetEl.dom.tagName.toLowerCase())
|| k_targetEl.parent('.x-grid3') || k_targetEl.parent('.x-tree') || k_targetEl.parent('.selectable') || k_targetEl.parent('.rowView')) {
k_isFocusableElement = true;
}
}
if (!k_isFocusableElement) {
if (Ext.isIE || kerio.lib.k_isMSIE11) {
this._k_focusCurrentItem();
}
else {
Ext.EventObject.preventDefault();
k_focusedItem = this._k_getCurrentItem();
if (k_focusedItem && k_focusedItem.validateBlur) {
k_focusedItem._k_origValidateBlur = k_focusedItem.validateBlur;
k_focusedItem.validateBlur = function() {return false;};
setTimeout(function() {
k_focusedItem.validateBlur = k_focusedItem._k_origValidateBlur;
}, 50);
}
}
}
}
};

kerio.lib._K_FocusableMessageBox = function(k_extWindow) {
this.k_extWidget = k_extWindow;
kerio.lib._K_FocusableMessageBox.superclass.constructor.call(this, '_k_messageBox', {});
};
Ext.extend(kerio.lib._K_FocusableMessageBox, kerio.lib._K_FocusableContainer,
{

_k_initExtComponent: function() {
return this.k_extWidget;
}
});

Ext.MessageBox.show = Ext.MessageBox.show.createInterceptor(function (k_options){
var k_extWindow = this.getDialog(),
k_lib = kerio.lib,
k_addKerioProperty = k_lib._k_addKerioProperty,
k_owner,
k_focusManager;
k_addKerioProperty(k_extWindow, {k_options: k_options});
if (!k_extWindow._kx || !k_extWindow._kx.k_owner) {
k_owner = new k_lib._K_FocusableMessageBox(k_extWindow);
k_owner.k_extWidget = k_extWindow;
k_addKerioProperty(k_extWindow, {
k_owner: k_owner,
k_isMessageBox: true
});
k_focusManager = new k_lib.K_FocusManager(k_owner);
k_owner._k_focusManager = k_focusManager;
k_focusManager._k_initOnRender.call(k_focusManager);
k_addKerioProperty(k_extWindow, {
k_nameToIndexMap: {
ok: 0,
yes: 1,
no: 2,
cancel: 3
}
});

k_owner._k_changeButtonByArrow = function (k_reverse) {
var
k_focusManager = this._k_focusManager,
k_focusableItems,
k_lastItemIndex,
k_newItemIndex, k_item;
k_focusableItems = k_focusManager._k_getItems();
k_lastItemIndex = k_focusableItems.getCount() - 1;
k_newItemIndex = k_focusManager._k_getCurrentItemIndex() + (k_reverse ? -1 : 1);
if ((k_newItemIndex < 0) || (k_newItemIndex > k_lastItemIndex)) {
k_newItemIndex = k_reverse ? k_lastItemIndex : 0;
}
k_item = k_focusableItems.itemAt(k_newItemIndex);
k_focusManager._k_focusItem(k_item);
};

k_extWindow.on('show', function (k_extWindow) {
this._k_keyNav = new Ext.KeyNav(k_extWindow.getEl(), {
left: function (k_e) {
this._k_changeButtonByArrow(true);
},
right: function (k_e) {
this._k_changeButtonByArrow(false);
},
scope: this,
defaultEventAction: 'doNothingWithEvent'
});
}, k_owner, {
single: true,
scope: k_owner
});
k_extWindow.show = k_extWindow.show.createInterceptor(function () {
var k_kx = this._kx,
k_owner = k_kx.k_owner,
k_optButtons = k_kx.k_options.buttons,
k_buttons = this.buttons,
k_defaultButtonName = k_kx.k_defaultButton || '',
k_defaultButton = null,
k_nameToIndexMap = k_kx.k_nameToIndexMap,
k_hiddenButtonBefore = 0,
k_buttonName,
k_index;
delete k_kx.k_defaultButton;
for (k_buttonName in k_buttons) {
if ('function' !== Ext.type(k_buttons[k_buttonName])) {
k_buttons[k_buttonName].removeClass('defaultButton');
}
}
if (k_optButtons) {
k_defaultButtonName = k_defaultButtonName.toLowerCase();
if (k_optButtons[k_defaultButtonName]) {
k_defaultButton = k_buttons[k_nameToIndexMap[k_defaultButtonName]];
}
else {
if (k_optButtons.cancel) {
k_defaultButton = k_buttons[k_nameToIndexMap.cancel];
}
else if (k_optButtons.no) {
k_defaultButton = k_buttons[k_nameToIndexMap.no];
}
else if (k_optButtons.ok) {
k_defaultButton = k_buttons[k_nameToIndexMap.ok];
}
}
}
if (k_defaultButton) {
k_defaultButton.addClass('defaultButton');
this.focusEl = k_defaultButton;
}
k_owner._k_isFirstShow = true;
k_owner._k_defaultItem = this.focusEl;
}, k_extWindow);
}
});
Ext.tree.TreeNodeUI.prototype.render = Ext.tree.TreeNodeUI.prototype.render.createSequence(function () {
var
k_tree = this.node.getOwnerTree(),
k_anchor = Ext.get(this.anchor);
if (Ext.isIE && !kerio.lib.k_isMSIE10) {
k_anchor.on('focus', function () {
this._kx.k_focusEl.focus();
}, k_tree);
}
else {
k_anchor.on('focus', function () {
this.fireEvent('focus', this);
}, k_tree);
k_anchor.on('blur', function () {
this.fireEvent('blur', this);
}, k_tree);
}
});
Ext.tree.TreeNodeUI.prototype.focus = function () {
var
k_ownerTree = this.node.getOwnerTree(),
k_treeElDom = k_ownerTree.getTreeEl().dom,
k_preventHScroll = this.node.preventHScroll,
k_scrollLeft = k_treeElDom.scrollLeft;
try{
if (Ext.isIE && !kerio.lib.k_isMSIE10) {
k_ownerTree.focus();
}
else {
if (this.anchor) {
if (Ext.isGecko) {
this.anchor.focus.defer(10, this.anchor);
}
else {
this.anchor.focus();
}
}
}
}
catch (k_ex){}
if (k_preventHScroll) {
k_treeElDom.scrollLeft = k_scrollLeft;
}
};
Ext.tree.TreePanel.prototype.focus = function () {
var k_node;
if (Ext.isIE && !kerio.lib.k_isMSIE10) {
this._kx.k_focusEl.focus();
}
else {
k_node = this.selModel.getSelectedNode();
if (!k_node) {
k_node = this.getRootNode();
if (k_node.rendered) {
k_node.select();
}
}
k_node.getUI().focus();
}
};
if (Ext.isGecko || kerio.lib.k_isMSIE10) {
Ext.tree.DefaultSelectionModel.prototype.onKeyDown = Ext.tree.DefaultSelectionModel.prototype.onKeyDown.createSequence(function () {
var k_selectedNode = this.selNode || this.lastSelNode;
if(!k_selectedNode){
return;
}
k_selectedNode.ui.anchor.focus();
});
}
if (Ext.isIE && !kerio.lib.k_isMSIE10) { Ext.tree.TreePanel.prototype.render = Ext.tree.TreePanel.prototype.render.createSequence(function () {
var k_focusEl = this.body.createChild({
tag: 'a',
href: '#',
tabindex: -1,
style: 'top: 0px; left: 0px; height: 16px;',
cls: 'x-grid3-focus'
});
kerio.lib._k_addKerioProperty(this, {k_focusEl: k_focusEl});
k_focusEl.on('click', function (k_e) {
this.selModel.getSelectedNode().ui.onClick(k_e);
}, this);
k_focusEl.on('focus', function () {
this.fireEvent('focus', this);
}, this);
k_focusEl.on('blur', function () {
this.fireEvent('blur', this);
}, this);
});
Ext.tree.DefaultSelectionModel.prototype.select = Ext.tree.DefaultSelectionModel.prototype.select.createInterceptor(function (k_treeNode) {
var
k_tree = this.tree,
k_indentNode = k_treeNode.ui.indentNode,
k_body = k_tree.body.dom,
k_minVisiblePartOfNodeText = 12;
k_tree._kx.k_focusEl.setStyle({
top: k_indentNode.offsetTop + 'px',
left: k_indentNode.offsetWidth + 'px'
});
if (k_treeNode.ui.anchor.offsetLeft + k_minVisiblePartOfNodeText > k_body.scrollLeft + k_body.clientWidth) {
k_body.scrollLeft = k_indentNode.offsetWidth;
}
k_tree._kx.k_focusEl.focus();
});
}
if (kerio.lib.k_isMSIE10) {
Ext.grid.GridPanel.prototype.focus = function () {
var
k_extView = this.getView(),
k_sm = this.getSelectionModel(),
k_focusEl = k_extView.focusEl,
k_scrollerPosition = k_extView.scroller.getScroll(),
k_boundingRect,
k_positionLeft,
k_positionTop;
if (k_focusEl) {
k_boundingRect = k_focusEl.dom.getBoundingClientRect();
k_positionLeft = k_scrollerPosition.left;
k_positionTop = k_scrollerPosition.top;
if (Math.round(k_boundingRect.left) > Math.floor(k_boundingRect.left)) {
k_positionLeft += 1;
}
if (Math.round(k_boundingRect.top) > Math.floor(k_boundingRect.top)) {
k_positionTop += 1;
}
k_focusEl.setLeftTop(k_positionLeft, k_positionTop);
k_focusEl.focus();
if (!k_sm.hasSelection()) {
k_sm.selectFirstRow();
}
}
};
}
else {
Ext.grid.GridPanel.prototype.focus = function () {
var
k_extView = this.getView(),
k_sm = this.getSelectionModel(),
k_focusEl = k_extView.focusEl,
k_scrollerPosition = k_extView.scroller.getScroll();
if (k_focusEl) {
k_focusEl.setLeftTop(k_scrollerPosition.left, k_scrollerPosition.top);
k_focusEl.focus();
if (!k_sm.hasSelection()) {
k_sm.selectFirstRow();
}
}
};
}
Ext.grid.GridView.prototype.renderUI = Ext.grid.GridView.prototype.renderUI.createSequence(function () {
var
k_focusEl = this.focusEl,
k_extGrid = this.grid;
k_focusEl.on('focus', function () {
this.fireEvent('focus', this);
}, k_extGrid);
k_focusEl.on('blur', function () {
this.fireEvent('blur', this);
}, k_extGrid);
k_extGrid.fireEvent('viewrender', k_extGrid);
});
Ext.Window.prototype.onRender = Ext.Window.prototype.onRender.createSequence(function () {
var k_focusEl = this.focusEl;
k_focusEl.on('focus', function () {
this.fireEvent('focus', this);
}, this);
k_focusEl.on('blur', function () {
this.fireEvent('blur', this);
}, this);
});
Ext.override(Ext.Button, {
onFocus : function(k_e){
if(!this.disabled){
this.el.addClass('x-btn-focus');
this.fireEvent('focus', this);
}
},
onBlur : function(k_e){
this.el.removeClass('x-btn-focus');
this.fireEvent('blur', this);
}
});
Ext.Button.prototype.afterRender = Ext.Button.prototype.afterRender.createSequence(function () {
var k_buttonEl = this.el.child('button');
this.el.on('mouseup', function () {
if (!this.disabled) {
this.el.child('button').focus();
}
}, this);
if (Ext.isGecko) {
if (k_buttonEl) {
k_buttonEl.on('mousedown', function () {
if (this.disabled) {
Ext.EventObject.preventDefault();
}
}, this);
}
}
});
Ext.Slider.prototype.onRender = Ext.Slider.prototype.onRender.createSequence(function () {
this.focusEl.on({
'focus': function () {this.fireEvent('focus', this);},
'blur':  function () {this.fireEvent('blur', this);},
scope: this
});
});

Ext.EventObject.doNothingWithEvent = Ext.emptyFn;

Ext.Window.prototype.focus = Ext.emptyFn;


kerio.lib._K_ToolbarContainer = function(k_id, k_config) {
this._k_setStoredProperties(['k_toolbars', 'k_statusbar']);
kerio.lib._K_ToolbarContainer.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib._K_ToolbarContainer, kerio.lib._K_FocusableContainer,
{



_k_additionalbarWrapElCfg: {
tag: 'div'
},

_k_defaultToolbarClassNames: {
k_top: 'topToolbar',
k_bottom: 'bottomToolbar',
k_right: 'rightToolbar'
},

_k_defaultStatusbarClassName: 'bottomStatusBar',

_k_beforeInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
kerio.lib._K_ToolbarContainer.superclass._k_beforeInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
this._k_additionalBarWrapEl = {};
this.k_toolbars = null; this.k_statusbar = null; },

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
kerio.lib._K_ToolbarContainer.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
this._k_initToolbars();
this._k_removeStoredProperties(['k_toolbars', 'k_statusbar']);
},

_k_initToolbars: function() {
var
k_extWidget = this.k_extWidget,
k_toolbars = this._k_storedConfig.k_toolbars,
k_statusbar = this._k_storedConfig.k_statusbar,
k_defaultToolbarClassNames = this._k_defaultToolbarClassNames,
k_toolbar,
k_toolbarType;
if (k_statusbar) {
k_statusbar.k_relatedWidget = this;
k_statusbar._k_setParentWidget(this);
k_statusbar.k_extWidget.addClass(this._k_defaultStatusbarClassName);
k_statusbar.k_extWidget.on({
'configchanged': this._k_syncHeight,
'textchanged'  : this._k_syncHeight,
scope: this
});
this._k_initShowHideEvents(k_statusbar, 'k_statusbar');
this.k_statusbar = k_statusbar;
}
if (k_toolbars) {
this.k_toolbars = {};
for (k_toolbarType in k_toolbars) {
k_toolbar = k_toolbars[k_toolbarType];
if ('object' !== Ext.type(k_toolbar)) {
continue;
}
k_toolbar.k_relatedWidget = this;
k_toolbar._k_setParentWidget(this);
k_toolbar.k_extWidget.addClass(k_defaultToolbarClassNames[k_toolbarType]);
this.k_toolbars[k_toolbarType] = k_toolbar;
this.k_addFocusableItem(k_toolbar);
this._k_initShowHideEvents(k_toolbar, k_toolbarType);
}
this._k_initRightToolbar(k_extWidget);
}
if (k_statusbar || k_toolbars) {
k_extWidget.on('render', this._k_doOnRender, this);
if (k_toolbars && (k_toolbars.k_top || k_toolbars.k_bottom)) {
this.k_extWidget.on('resize', this._k_fitToSize, this);
}
}
},

_k_fitToSize: function (k_extPanel, k_adjWidth, k_adjHeight) {
var k_toolbars = this.k_toolbars;
if ('number' !== Ext.type(k_adjWidth)) {
return;
}
k_adjWidth = k_extPanel.adjustBodyWidth(k_adjWidth - k_extPanel.getFrameWidth());
if (k_toolbars.k_top) {
k_toolbars.k_top.k_extWidget.setWidth(k_adjWidth);
}
if (k_toolbars.k_bottom) {
k_toolbars.k_bottom.k_extWidget.setWidth(k_adjWidth);
}
},

_k_initShowHideEvents: function (k_item, k_itemType) {
var k_extWidget = k_item.k_extWidget;
k_extWidget.on({
hide: function(){
var k_this = this.k_this;
k_this._k_onToolbarShowHide.call(k_this, k_this, this.k_item, this.k_itemType, false);
},
show: function(){
var k_this = this.k_this;
k_this._k_onToolbarShowHide.call(k_this, k_this, this.k_item, this.k_itemType, true);
},
scope: {k_this: this, k_itemType: k_itemType, k_item: k_item}
});
},

_k_onToolbarShowHide: function (k_toolbarContainer, k_item, k_itemType, k_isVisible) {
var
k_extWidget = k_toolbarContainer.k_extWidget,
k_toolbars = this.k_toolbars || {},
k_isTopToolbar = 'k_top' === k_itemType,
k_isBottomToolbar = 'k_bottom' === k_itemType,
k_rightToolbarClassName;
if (k_isBottomToolbar || 'k_statusbar' === k_itemType) {
k_extWidget.bbar.setDisplayed(this._k_isStatusbarVisible() || this._k_isToolbarVisible('k_bottom'));
}
if (k_toolbars.k_right && (k_isTopToolbar || k_isBottomToolbar)) {
k_rightToolbarClassName = k_isTopToolbar ? 'topRightToolbar' : 'bottomRightToolbar';
k_toolbars.k_right.k_extWidget[k_isVisible ? 'addClass' : 'removeClass'](k_rightToolbarClassName);
}
if (k_isTopToolbar) {
this._k_additionalBarWrapEl.k_top.setDisplayed(k_isVisible);
}
if ('k_right' === k_itemType) {
this.k_extCover.doLayout(false, true);
}
else {
this._k_syncHeight();
}
},

_k_syncHeight: function () {
if (this.k_extWidget.lastSize) {
this.k_extWidget.syncHeight();
}
},

_k_isToolbarVisible: function (k_toolbarType) {
var k_toolbars = this.k_toolbars || {};
return k_toolbars[k_toolbarType] ? k_toolbars[k_toolbarType].k_isVisible() : false;
},

_k_isStatusbarVisible: function () {
return this.k_statusbar ? this.k_statusbar.k_isVisible() : false;
},

_k_initRightToolbar: function (k_extWidget) {
var
k_toolbar = this.k_toolbars ? this.k_toolbars.k_right: null,
k_extToolbar, k_extCover;
if (!k_toolbar) {
return;
}
k_extToolbar = k_toolbar.k_extWidget;
k_extToolbar.region = 'east';
if (this.k_toolbars.k_top) {
k_extToolbar.addClass('topRightToolbar');
}
if (this.k_toolbars.k_bottom) {
k_extToolbar.addClass('bottomRightToolbar');
}
k_extWidget.region = 'center';
k_extToolbar.on('afterlayout', function (k_extToolbar) {
k_extToolbar.setWidth(this._k_maxButtonWidth + k_extToolbar.el.getFrameWidth('lr'));
k_extToolbar.ownerCt.doLayout();
}, k_toolbar, {single: true});
k_extCover = new Ext.Panel({
border: false,
cls: 'rightToolbarCover',
layout: 'border',
items: [
k_extWidget,
k_extToolbar
]
});

if (!Ext.isIE) {
k_extCover.on('afterlayout', function () {
this.doLayout();
}, k_extCover, {single: true, delay: 1});
}
this.k_extCover = k_extCover;
},

_k_addStatusbarOnRender: function (k_extWidget) {
var
k_barWrapEl = this._k_getAdditionalBarWrapEl('k_bottom'),
k_extStatusBar = this.k_statusbar.k_extWidget;
k_extStatusBar.render(k_barWrapEl);
k_extWidget.toolbars.push(k_extStatusBar);
},

_k_addToolbarOnRender: function (k_extWidget) {
var k_barWrapEl, k_toolbarType, k_toolbar,
k_toolbars = this.k_toolbars;
for (k_toolbarType in k_toolbars) {
k_toolbar = k_toolbars[k_toolbarType];
if ('object' !== Ext.type(k_toolbar)) {
continue;
}
if ('k_right' === k_toolbarType) { continue;
}
k_barWrapEl = this._k_getAdditionalBarWrapEl(k_toolbarType);
k_extWidget['k_top' === k_toolbarType ? 'topToolbar' : 'bottomToolbar'] = k_toolbar.k_extWidget;
k_extWidget.toolbars.push(k_toolbar.k_extWidget);
k_toolbar.k_extWidget.render(k_barWrapEl);
}
},

_k_getAdditionalBarWrapEl: function (k_position) {
var k_barEl,
k_el = this._k_additionalBarWrapEl[k_position],
k_isTopBar = false;
if (!k_el) {
k_isTopBar = ('k_top' === k_position);
k_barEl = this._k_getBarEl(k_position);
k_el = k_barEl[k_isTopBar ? 'insertFirst' : 'createChild']({tag: 'div'});
this._k_additionalBarWrapEl[k_position] = k_el;
}
return k_el;
},

_k_getBarEl: function (k_position) {
var k_isTop = ('k_top' === k_position),
k_propertyName = k_isTop ? 'tbar' : 'bbar',
k_extWidget = this.k_extWidget,
k_toolbarElement = k_extWidget[k_propertyName];
if (!k_toolbarElement) {
k_toolbarElement = k_extWidget.bwrap[k_isTop ? 'insertFirst' : 'createChild']({
tag: 'div',
cls: k_extWidget[k_isTop ? 'tbarCls' : 'bbarCls']
});
k_extWidget[k_propertyName] = k_toolbarElement;
}
return k_toolbarElement;
},

_k_doOnRender: function (k_extWidget) {
if (this.k_statusbar) {
this._k_addStatusbarOnRender(k_extWidget);
}
if (this.k_toolbars) {
this._k_addToolbarOnRender(k_extWidget);
}
},

k_setDisabled: function (k_disabled){
var k_toolbars = this.k_toolbars,
k_statusbar = this.k_statusbar,
k_toolbarType, k_toolbar;
for (k_toolbarType in k_toolbars) {
k_toolbar = k_toolbars[k_toolbarType];
if ('object' !== Ext.type(k_toolbar)) {
continue;
}
k_toolbar.k_setDisabled(k_disabled);
}
if (k_statusbar) {
k_statusbar.k_setDisabled(k_disabled);
}
},

k_setReadOnly: function (k_readOnly) {
var k_toolbars = this.k_toolbars,
k_statusbar = this.k_statusbar,
k_toolbarType, k_toolbar;
for (k_toolbarType in k_toolbars) {
k_toolbar = k_toolbars[k_toolbarType];
if ('object' !== Ext.type(k_toolbar)) {
continue;
}
k_toolbar.k_setReadOnly(k_readOnly);
}
if (k_statusbar) {
k_statusbar.k_setReadOnly(k_readOnly);
}
},

k_setVisible: function (k_visible) {
var k_toolbars = this.k_toolbars,
k_statusbar = this.k_statusbar,
k_toolbarType, k_toolbar;
k_visible = (false !== k_visible);
for (k_toolbarType in k_toolbars) {
k_toolbar = k_toolbars[k_toolbarType];
if ('object' !== Ext.type(k_toolbar)) {
continue;
}
k_toolbar._k_isVisible = k_visible;
}
if (k_statusbar) {
k_statusbar._k_isVisible = k_visible;
}
}
});


kerio.lib.K_Layout = function(k_id, k_config) {
this._k_setStoredProperties([
'k_isBrowserWindow',
'k_horLayout',
'k_verLayout'
]);
this._k_isBrowserWindow = k_config.k_isBrowserWindow;
this.k_items = {};    kerio.lib.K_Layout.superclass.constructor.call(this, k_id, k_config);
if (this._k_isBrowserWindow) {
this._k_focusManager = new kerio.lib.K_FocusManager(this);
kerio.lib._k_windowManager.k_setMainLayout(this);
this.k_extWidget.render(this.k_extWidget.el);
this.k_extWidget.el.on('mousedown', this._k_focusManager._k_controlFocus, this._k_focusManager);
}
};
Ext.extend(kerio.lib.K_Layout, kerio.lib._K_ToolbarContainer,
{



_k_horMap : ['west' , 'center', 'east'],
_k_verMap : ['north', 'center', 'south'],
_k_regionPropertiesMappingTemplate: {
k_minSize: 'minSize',
k_maxSize: 'maxSize',
k_showTitlebar: 'titlebar',
k_showSplitter: 'split',
k_isCollapsible: 'collapsible',
k_title: 'title',
k_className: 'cls',
k_isCollapsed: 'collapsed',
k_forceLayout: 'forceLayout',
k_hideCollapseTool: 'hideCollapseTool',
k_isAnimatedSplit: 'animFloat'
},

_k_propertiesDefault: {
layout: 'border',
items: [],
cls: 'layout %+'
},

_k_propertiesMapping: {
k_className: 'cls'
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var	k_extWidget;
k_adaptedConfig.id = this.k_id;
this._k_createRegions(k_adaptedConfig, k_storedConfig);
this._k_removeStoredProperties(['k_isBrowserWindow', 'k_horLayout', 'k_verLayout']);
if (this._k_isBrowserWindow) {
k_extWidget = new kerio.lib._K_Viewport(k_adaptedConfig);
}
else {
k_extWidget = new Ext.Panel(k_adaptedConfig);
}
return k_extWidget;
},

_k_createRegions: function(k_extConfig, k_config) {
var k_currentRegionType;
var k_items;
var k_item;
var k_nestedItems;
var k_addKerioProperty = kerio.lib._k_addKerioProperty;
if (!k_extConfig._kx) {
k_extConfig._kx = {};
}
if (undefined === k_extConfig._kx.k_verIdx) {
k_addKerioProperty(k_extConfig, {
k_verIdx: 0,    k_horIdx: 0,
k_centerIsUsed: false
});
if (k_extConfig._kx.k_regionType) {
if ('H' === k_extConfig._kx.k_regionType) {
k_config.k_horLayout = {};
k_config.k_horLayout.k_items = k_config;
}
else {
k_config.k_verLayout = {};
k_config.k_verLayout.k_items = k_config;
}
}
}
if (k_config.k_horLayout || k_config.k_verLayout) {
if (k_config.k_horLayout) {
k_addKerioProperty(k_extConfig, {k_regionType: 'H'});
k_items = k_config.k_horLayout.k_items;
}
else {
k_addKerioProperty(k_extConfig, {k_regionType: 'V'});
k_items = k_config.k_verLayout.k_items;
}
}
else {
k_items = k_config;
}
var k_masterRegionType = k_extConfig._kx.k_regionType;    for (var k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_item = k_items[k_i];
k_extConfig._kx.k_regionType = k_masterRegionType;    k_addKerioProperty(k_extConfig, {k_isAutoExpand: k_item.k_isAutoExpand});
if (k_item.k_horLayout || k_item.k_verLayout) {
k_currentRegionType = k_item.k_horLayout ? 'H' : 'V';
if (k_masterRegionType !== k_currentRegionType) {
if (!('V' === k_masterRegionType && 1 === k_extConfig._kx.k_verIdx && !k_extConfig._kx.k_centerIsUsed)) {
if (this._k_createNestedRegion(k_extConfig, k_items, k_i)) {
break;
}
continue;
}
}
if (k_item.k_horLayout) {
k_extConfig._kx.k_regionType = 'H';
k_nestedItems = k_item.k_horLayout.k_items;
}
else {
k_extConfig._kx.k_regionType = 'V';
k_nestedItems = k_item.k_verLayout.k_items;
}
this._k_createRegions(k_extConfig, k_nestedItems);
}
else {
if (this._k_createNestedRegion(k_extConfig, k_items, k_i)) {
k_extConfig._kx.k_regionType = k_masterRegionType;
break;
}
else {
k_extConfig.defaults = {
border: false
};
}
}
}
k_extConfig.listeners = {'add': {fn: this._k_onAddHandler, scope: this}};
k_extConfig._kx.k_regionType = k_masterRegionType;
},

_k_createNestedRegion: function(k_extConfig, k_items, k_from) {
var
k_isVertical,
k_indexName,
k_regionName,
k_cnt = k_items.length,
k_isNestedNeeded = 1 < k_extConfig._kx[k_indexName] && 1 < k_cnt - k_from,
k_currentItem = k_items[k_from],
k_extRegionCfg,
k_currentRegion,
k_nestedWidget = {items: [], _kx: {}},
k_restItems = [],
k_kerioObject,
k_regionPropertiesMapping,
k_currentItemContent;
if ('V' === k_extConfig._kx.k_regionType) {
k_isVertical = true;
k_indexName = 'k_verIdx';
k_regionName = this._k_verMap[k_extConfig._kx.k_verIdx];
}
else {
k_isVertical = false;
k_indexName = 'k_horIdx';
k_regionName = this._k_horMap[k_extConfig._kx.k_horIdx];
}
if (k_extConfig._kx.k_centerIsUsed && 1 === k_extConfig._kx[k_indexName]) {
k_extConfig._kx[k_indexName]++;
if ('V' === k_extConfig._kx.k_regionType) {
k_regionName = this._k_verMap[k_extConfig._kx.k_verIdx];
}
else {
k_regionName = this._k_horMap[k_extConfig._kx.k_horIdx];
}
}
if (k_extConfig._kx.k_isAutoExpand) {
k_regionName = 'center';
k_extConfig._kx.k_centerIsUsed = true;
k_extConfig._kx[k_indexName]++;
}
if (k_currentItem.k_horLayout) {
k_extRegionCfg = kerio.lib._k_createConfig(k_currentItem.k_horLayout, null, this._k_regionPropertiesMapping.H);
}
else if (k_currentItem.k_verLayout) {
k_extRegionCfg = kerio.lib._k_createConfig(k_currentItem.k_verLayout, null, this._k_regionPropertiesMapping.V);
}
else {
k_regionPropertiesMapping = this._k_regionPropertiesMapping[k_extConfig._kx.k_regionType];
k_currentItemContent = k_currentItem.k_content && k_currentItem.k_content.k_extWidget;
if (k_currentItemContent && undefined !== k_currentItemContent[k_regionPropertiesMapping.k_iniSize]) {
k_currentItem.k_iniSize = k_currentItemContent[k_regionPropertiesMapping.k_iniSize];
delete k_currentItemContent[k_regionPropertiesMapping.k_iniSize];
}
k_extRegionCfg = kerio.lib._k_createConfig(k_currentItem, null, k_regionPropertiesMapping);
}

k_extRegionCfg.region = k_regionName;
if ('center' === k_regionName) {
k_extRegionCfg.layout = 'fit';
if (this._k_isBrowserWindow) { k_extRegionCfg.bodyStyle = 'border-top-width: 0';
}
}
if (k_currentItem.k_hasMorePages) {
k_extRegionCfg.layout = 'k_singlecard';
k_extRegionCfg.activeItem = 0;
}
Ext.apply(k_extRegionCfg,
kerio.lib._k_createConfig(k_currentItem, null, this._k_regionPropertiesMapping[k_extConfig._kx.k_regionType]), {
_kx: {k_id: k_currentItem.k_id},
listeners: {
'add': {
fn: this._k_onAddHandler,
scope: this
}
}
}
);
k_extConfig.items.push(k_extRegionCfg);
k_currentRegion = k_extConfig.items[k_extConfig.items.length-1];
if (k_currentItem.k_horLayout || k_currentItem.k_verLayout || k_isNestedNeeded) {
if (k_isNestedNeeded) {
k_nestedWidget._kx.k_regionType = k_extConfig._kx.k_regionType;
for (var k_i = k_from; k_i < k_cnt; k_i++) {
k_restItems.push(k_items[k_i]);
}
}
else {
k_restItems = k_items[k_from];
}
this._k_createRegions(k_nestedWidget, k_restItems);
k_currentRegion.layout = 'border';
k_currentRegion.items = k_nestedWidget.items;
}
else {
if (k_currentItem.k_content) {
k_kerioObject = k_currentItem.k_content;
k_kerioObject._k_setParentWidget(this);
this.k_addFocusableItem(k_kerioObject);
var k_extContent = k_kerioObject.k_extCover || k_kerioObject.k_extWidget;
if (this._k_isBrowserWindow) {
k_currentRegion.items = [k_extContent];
}
else {
k_currentRegion = this._k_replaceRegionByWidget(k_currentRegion, k_extContent);
k_extConfig.items[k_extConfig.items.length-1] = k_currentRegion;
}
if (k_kerioObject.k_extWidget.rendered) {
k_currentRegion.cls = k_kerioObject.k_extWidget.initialConfig.ctCls;
}
}
}
if (1 === k_extConfig._kx[k_indexName]) {
k_extConfig._kx.k_centerIsUsed = true;
}
k_extConfig._kx[k_indexName]++;
return k_isNestedNeeded;
},

_k_onAddHandler: function (k_extContainer, k_extComponent) {
var k_widget = k_extComponent._kx && k_extComponent._kx.k_owner;
if (k_widget && k_extContainer.region && 'center' !== k_extContainer.region) {
k_widget._k_settingsSizeWidget = k_extContainer;
}
this._k_registerItem(k_extComponent);
},

_k_registerItem: function(k_extRegion) {
var k_regionId;
if (k_extRegion._kx && k_extRegion._kx.k_regionId) {  k_regionId = k_extRegion._kx.k_regionId;
}
else if (k_extRegion.initialConfig._kx && k_extRegion.initialConfig._kx.k_id) {
k_regionId = k_extRegion.initialConfig._kx.k_id;
}
if (k_regionId) {
this.k_items[k_regionId] = k_extRegion;
}
},

k_setContent: function(k_config) {
var k_content = k_config.k_content,
k_uiWidget;
if (!k_content) {    return;
}
var k_id = k_config.k_id;
var k_extRegion = this.k_items[k_id];
k_extRegion.add(k_content.k_extWidget);
if (k_extRegion.layout.setActiveItem) {    var k_activeItemId = null;
if (k_extRegion.layout.activeItem) {
if (k_extRegion.layout.activeItem._kx) {
k_activeItemId = k_extRegion.layout.activeItem._kx.k_owner;
}
else { k_activeItemId = k_extRegion.layout.activeItem.items.items[0].id;
}
}
k_extRegion.layout.setActiveItem(k_content.k_id);
if (null !== k_activeItemId) {
this._k_focusableItems.removeKey(k_activeItemId);
}
k_uiWidget = k_content.k_uiWidget ? k_content.k_uiWidget : k_content;  if (!k_uiWidget.k_parentWidget) {
k_uiWidget._k_setParentWidget(this);
}
this.k_addFocusableItem(k_uiWidget);
}
},

k_mask: function() {
this.k_extWidget.el.mask();
},

k_unmask: function() {
this.k_extWidget.el.unmask();
},

_k_replaceRegionByWidget: function(k_extRegionCfg, k_extWidget) {
var k_listeners = k_extRegionCfg.listeners,
k_function,
k_scope,
k_eventName;
for (k_eventName in k_listeners) {
k_function = k_listeners[k_eventName];
k_scope = k_function.scope;
if (k_function.fn) {
k_function = k_function.fn;
}
k_extWidget.addListener(k_eventName, k_function, k_scope);
}
delete k_extRegionCfg.layout;
delete k_extRegionCfg.listeners;
if (k_extRegionCfg._kx.k_id) {
kerio.lib._k_addKerioProperty(k_extWidget, {k_regionId: k_extRegionCfg._kx.k_id});
}
k_extRegionCfg = Ext.applyIf(k_extWidget, k_extRegionCfg);
k_extRegionCfg.initialConfig = Ext.apply(k_extRegionCfg.initialConfig || {}, {
minSize: k_extRegionCfg.minSize,
maxSize: k_extRegionCfg.maxSize
});
return k_extRegionCfg;
},

k_collapseRegion: function (k_regionId, k_collapse) {
var k_region = this.k_items[k_regionId];
k_collapse = false !== k_collapse;
if (!k_region.rendered) {
k_region.collapsed = k_collapse;
}
else {
k_region[k_collapse ? 'collapse' : 'expand'](false);
}
},

k_isRegionCollapsed: function (k_regionId) {
return true === this.k_items[k_regionId].collapsed;
}
});    
(function () {
var k_prototype = kerio.lib.K_Layout.prototype;
k_prototype._k_regionPropertiesMapping = {
'H': Ext.apply({}, k_prototype._k_regionPropertiesMappingTemplate, {k_iniSize: 'width'}),
'V': Ext.apply({}, k_prototype._k_regionPropertiesMappingTemplate, {k_iniSize: 'height'})
};
})();

kerio.lib._K_Viewport = Ext.extend(Ext.Viewport, {
initComponent: function() {
kerio.lib._K_Viewport.superclass.initComponent.call(this);
delete this.renderTo;  }
});

kerio.lib._K_CardLayout = function (k_config) {
kerio.lib._K_CardLayout.superclass.constructor.call(this, k_config);
};
Ext.extend(kerio.lib._K_CardLayout, Ext.layout.CardLayout, {

isValidParent: function(k_c, k_target) {
if (k_c.k_nodeInfo && k_c.k_nodeInfo.k_isRemoved) {  return true;
}
else {
return kerio.lib._K_CardLayout.superclass.isValidParent.call(this, k_c, k_target);
}
}
});
Ext.Container.LAYOUTS['k_singlecard'] = kerio.lib._K_CardLayout;


kerio.lib.K_Toolbar = function(k_id, k_config) {
this.k_items = {};    this._k_isShowVertically = (true === k_config.k_showVertically);
this._k_hasSharedMenu = true === k_config.k_hasSharedMenu;
this._k_setStoredProperties(['k_items', 'k_className', 'k_isCentered']);
kerio.lib.K_Toolbar.superclass.constructor.call(this, k_id, k_config);
if (k_config.k_update) {
this.k_update = k_config.k_update;
}
this.k_extWidget.on('render', this._k_initArrowsBehaviour, this);
};
Ext.extend(kerio.lib.K_Toolbar, kerio.lib._K_FocusableContainer,
{










_k_propertiesMapping: {
k_id: 'id',
k_className: 'cls',
k_isHidden: 'hidden'
},

_k_propertiesDefault: {
cls: 'toolbarButtons %+'
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
K_ToolbarConstructor,
K_ItemConstructor,
k_item,
k_itemCfg,
k_itemId,
k_caption,
k_isInSharedMenu,
k_sharedMenuCfg = [],
k_items = k_storedConfig.k_items,
k_hasSharedMenu = this._k_hasSharedMenu,
k_isShowVertically = this._k_isShowVertically;
if (!k_items) {
return;
}
k_adaptedConfig.id = this.k_id;
k_adaptedConfig.items = [];
for (var k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_itemCfg = k_items[k_i];
k_caption = k_itemCfg.k_caption;
if (k_caption && (' ' === k_caption || '-' === k_caption || '->' === k_caption)) {  k_itemCfg = k_caption;
}
if ('string' === typeof k_itemCfg) {
if ('->' === k_itemCfg) {
this._k_isRightAlign = true;
}
k_adaptedConfig.items.push(k_itemCfg);
if (k_hasSharedMenu) {
if ('->' === k_itemCfg) {
k_itemCfg = '-';
}
if (k_itemCfg !== k_sharedMenuCfg[k_sharedMenuCfg.length - 1]) {
k_sharedMenuCfg.push(k_itemCfg);
}
}
}
else if ((k_itemCfg.k_isInstanceOf && k_itemCfg.k_isInstanceOf('_K_FormItem')) || k_itemCfg.k_content) {
k_itemCfg = k_itemCfg.k_content || k_itemCfg;
k_adaptedConfig.items = k_adaptedConfig.items.concat(this._k_getFormItemConfig(k_itemCfg));
this.k_items[k_itemCfg.k_name] = k_itemCfg; k_itemCfg.k_parent = this;
this._k_addButtonSpacer(k_itemCfg.k_extWidget);
this.k_addFocusableItem(k_itemCfg.k_extWidget);
}
else { k_itemId = k_itemCfg.k_id;
if (undefined === k_itemId) {
k_itemId = kerio.lib.k_getGeneratedId();
k_itemCfg.k_id = k_itemId;
}
if (true === k_itemCfg.k_isColorPicker) {
k_itemCfg.k_isMenuButton = true;
}
if (k_itemCfg.k_items && true !== k_itemCfg.k_isMenuButton) {
K_ItemConstructor = kerio.lib.K_SplitButton;
}
else {
K_ItemConstructor = kerio.lib.K_Button;
}
if (k_itemCfg.k_items && k_itemCfg.k_onClick && k_itemCfg.k_isMenuButton) {
kerio.lib.k_reportError('Internal Error: k_item.k_onClick can\'t be used for menu button. Button ID: ' + k_itemCfg.k_id, 'toolbar.js');
return;
}
k_isInSharedMenu = k_hasSharedMenu && false !== k_itemCfg.k_isInSharedMenu;
if (k_isInSharedMenu && k_itemCfg.k_items && k_itemCfg.k_onClick) {
k_itemCfg._k_preventOnClickInMenu = true;
}
k_item = new K_ItemConstructor(this.k_id + '_' + k_itemId, k_itemCfg);
if (k_isInSharedMenu) {
k_item._k_action.k_addReferences({
k_isColorPicker: k_itemCfg.k_isColorPicker
});
k_sharedMenuCfg.push(k_item._k_action);
}
this.k_items[k_itemId] = k_item; this.k_addFocusableItem(k_item.k_extWidget);
k_item.k_relatedWidget = this;
if (k_isShowVertically) {
k_item.k_extWidget.on('render', this._k_initButtonWidth, this);
}
k_adaptedConfig.items.push(k_item.k_extWidget);
this._k_addButtonSpacer(k_item.k_extWidget);
if (k_item.k_submenu) { this.k_items = Ext.apply(this.k_items, k_item.k_submenu.k_items);
}
}
}
if (k_isShowVertically) {
kerio.lib._k_addKerioProperty(k_adaptedConfig, {
k_isCentered: true === k_storedConfig.k_isCentered
});
K_ToolbarConstructor = kerio.lib._K_VerticalToolbar;
}
else {
K_ToolbarConstructor = Ext.Toolbar;
}
if (k_hasSharedMenu) {
if ('-' === k_sharedMenuCfg[0]) {
k_sharedMenuCfg.shift();
}
if ('-' === k_sharedMenuCfg[k_sharedMenuCfg.length - 1]) {
k_sharedMenuCfg.pop();
}
this.k_sharedMenu = new kerio.lib.K_Menu(this.k_id + '_' + 'k_sharedMenu', {
k_items: k_sharedMenuCfg
});
this.k_sharedMenu.k_relatedToolbar = this;
}
return new K_ToolbarConstructor(k_adaptedConfig);
},

_k_initButtonWidth: function (k_component) {
this._k_maxButtonWidth = Math.max(Math.max(this._k_maxButtonWidth || 0, k_component.minWidth), k_component.getWidth());
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
kerio.lib.K_Toolbar.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
this._k_removeStoredProperties(['k_items', 'k_className', 'k_isCentered']);
},

_k_addButtonSpacer: function (k_item) {
var k_className;
if (true === this._k_isShowVertically) {
return;
}
k_className = 'toolbarItemSpacer';
if (k_item.container) {
k_item.container.addClass(k_className);
}
else {
k_item.ctCls = kerio.lib._k_addClassName(k_item.ctCls, k_className);
}
},

k_addFormElement: function(k_formItem) {
this.k_addWidget(k_formItem);
},

_k_getFormItemConfig: function (k_formItem) {
var
k_formItemCfg = [],
k_extWidget = k_formItem.k_extWidget,
k_caption = k_extWidget.fieldLabel;
if (k_caption && '' !== k_caption) {
k_formItemCfg.push(new Ext.form.Label({
forId: k_extWidget.id,
text: k_caption,
ctCls: 'fieldLabelContainer'
}));
}
k_formItemCfg.push(k_extWidget);
k_formItem._k_isInToolbar = true;
return k_formItemCfg;
},

k_addWidget: function(k_kerioWidget, k_index) {
var
k_extWidget = this.k_extWidget,
k_itemCfg,
k_i, k_cnt;
k_kerioWidget.k_parent = this;
k_kerioWidget._k_setParentWidget(this);
this.k_items[k_kerioWidget.k_name] = k_kerioWidget;
k_itemCfg = this._k_getFormItemConfig(k_kerioWidget);
if (undefined === k_index) {
k_extWidget.add.apply(k_extWidget, k_itemCfg);
}
else {
for (k_i = 0, k_cnt = k_itemCfg.length; k_i < k_cnt; k_i++) {
k_extWidget.insert(k_index++, k_itemCfg[k_i]);
}
}
this._k_addButtonSpacer(k_kerioWidget.k_extWidget);
},

k_setItemCaption: function(k_itemId, k_caption) {
var k_item = this.k_items[k_itemId];
k_item.k_setCaption(k_caption);
},

k_setDisabled: function (k_disable) {
var
k_itemId,
k_items = this.k_items;
k_disable = false !== k_disable;
this._k_isDisabled = k_disable;
for (k_itemId in k_items) {
if ('function' !== Ext.type(k_items[k_itemId]) && k_items[k_itemId]._k_setDisabledByContainer) {
k_items[k_itemId]._k_setDisabledByContainer(k_disable);
}
}
},

k_setDisabledAll: function (k_disable) {
var
k_items = this.k_items,
k_itemId;
k_disable = false !== k_disable;
for (k_itemId in k_items) {
if ('function' !== Ext.type(k_items[k_itemId])) {
k_items[k_itemId].k_setDisabled(k_disable);
}
}
},

k_isDisabled: function () {
return this._k_isDisabled;
},

k_enableItem: function(k_itemId, k_enable) {
var
k_items = this.k_items,
k_i, k_cnt;
k_enable = false !== k_enable;
if (!Ext.isArray(k_itemId)) {
k_itemId = [k_itemId];
}
for (k_i = 0, k_cnt = k_itemId.length; k_i < k_cnt; k_i++) {
if (kerio.lib._k_backwardCompatibilityExtJS202 && !k_items[k_itemId[k_i]]) {
continue;
}
k_items[k_itemId[k_i]].k_setDisabled(!k_enable);
}
},

k_disableItem: function(k_itemId) {
this.k_enableItem(k_itemId, false);
},

k_showItem: function(k_itemIds, k_show) {
var
k_i,
k_cnt,
k_items = this.k_items;
k_show = false !== k_show;
if (!Ext.isArray(k_itemIds)) {
k_itemIds = [k_itemIds];
}
for (k_i = 0, k_cnt = k_itemIds.length; k_i < k_cnt; k_i++) {
if (kerio.lib._k_backwardCompatibilityExtJS202 && !k_items[k_itemIds[k_i]]) {
continue;
}
k_items[k_itemIds[k_i]].k_setVisible(k_show);
}
},

k_hideItem: function(k_itemId) {
this.k_showItem(k_itemId, false);
},

k_setVisible: function (k_visible) {
var
k_items = this.k_items,
k_itemId,
k_item;
k_visible = false !== k_visible;
this._k_isVisible = k_visible;
this.k_extWidget.setVisible(k_visible);
for (k_itemId in k_items) {
k_item = k_items[k_itemId];
if ('function' !== typeof(k_item) && k_item._k_setVisibleByParent) {
k_item._k_setVisibleByParent(k_visible);
}
}
},

k_getWidth: function() {
return 82;
},

k_update: function(k_sender, k_event) {
kerio.lib.k_reportError('Internal error: Override k_update method in object with ID ' + this.k_id
+ ' to make this object behaving as an observer', 'toolbar.js');
},

_k_initArrowsBehaviour: function () {
this._k_keyNav = new Ext.KeyNav(this.k_extWidget.getEl(), {
left: function (k_e) {
if (!this._k_isEventTargetInputField(k_e)) {
k_e.stopEvent();
this._k_changeFocusedItem(true);
}
},
right: function (k_e) {
if (!this._k_isEventTargetInputField(k_e)) {
k_e.stopEvent();
this._k_changeFocusedItem(false);
}
},
up: this._k_onArrowUpDown,
down: this._k_onArrowUpDown,
scope: this,
defaultEventAction: 'doNothingWithEvent'
});
},

_k_onArrowUpDown: function (k_event) {
if (!Ext.isMac && this._k_isEventTargetInputField(k_event)) {
k_event.stopEvent();
}
},

_k_isEventTargetInputField: function (k_extEvent) {
var k_targetCmp = Ext.getCmp(k_extEvent.getTarget().id);
return k_targetCmp instanceof Ext.form.Field;
},

_k_changeFocusedItem: function (k_reverse) {
k_reverse = (undefined === k_reverse) ? false : k_reverse;
var k_focusableItems = this.k_getFocusableItems();
var k_increment = (k_reverse ? -1 : 1);
var k_nextItemIndex = this.k_getFocusedItemIndex();
k_nextItemIndex = (null === k_nextItemIndex) ? 0 : k_nextItemIndex;
var k_actFocusedItemIndex = k_nextItemIndex;
var k_focusableItemsCount = k_focusableItems.length;
do {
k_nextItemIndex += k_increment;
if (k_actFocusedItemIndex === k_nextItemIndex) {
break;
}
if (k_nextItemIndex >= k_focusableItemsCount) {
k_nextItemIndex = 0;
}
if (k_nextItemIndex < 0) {
k_nextItemIndex = k_focusableItemsCount - 1;
}
}
while (k_focusableItems.get(k_nextItemIndex).hidden || k_focusableItems.get(k_nextItemIndex).disabled);
this.k_setFocusedItemIndex(k_nextItemIndex);
k_focusableItems.get(k_nextItemIndex).focus();
},

k_isItemDisabled: function (k_itemId) {
if (kerio.lib._k_backwardCompatibilityExtJS202) {
if (this.k_items[k_itemId]) {
return this.k_items[k_itemId].k_isDisabled();
}
else {
return false;
}
}
return this.k_items[k_itemId].k_isDisabled();
},

k_setReadOnly: function (k_readOnly) {
var
k_itemId,
k_items = this.k_items;
k_readOnly = false !== k_readOnly;
this._k_isReadOnly = k_readOnly;
for (k_itemId in k_items) {
if ('function' !== Ext.type(k_items[k_itemId]) && k_items[k_itemId]._k_setReadOnlyByContainer) {
k_items[k_itemId]._k_setReadOnlyByContainer(k_readOnly);
}
}
},

k_setReadOnlyItem: function (k_itemId, k_readOnly) {
var
k_items = this.k_items,
k_item,
k_i, k_cnt;
k_readOnly = false !== k_readOnly;
if (!Ext.isArray(k_itemId)) {
k_itemId = [k_itemId];
}
for (k_i = 0, k_cnt = k_itemId.length; k_i < k_cnt; k_i++) {
k_items[k_itemId[k_i]].k_setReadOnly(k_readOnly);
}
},

k_isReadOnly: function () {
return this._k_isReadOnly;
},

k_isItemReadOnly: function (k_itemId) {
return this.k_items[k_itemId].k_isReadOnly();
},

k_setReadOnlyAll: function (k_readOnly) {
var
k_items = this.k_items,
k_itemId;
k_readOnly = false !== k_readOnly;
for (k_itemId in k_items) {
if ('function' !== Ext.type(k_items[k_itemId])) {
k_items[k_itemId].k_setReadOnly(k_readOnly);
}
}
},

k_isItemVisible: function (k_itemId) {
return this.k_items[k_itemId].k_isVisible();
},

k_getItem: function (k_itemId) {
return this.k_items[k_itemId] || null;
},

k_setMenuItemIconCls: function (k_menuItemId, k_className) {
var k_menuItem = this.k_items[k_menuItemId];
if (!k_menuItem) {
return;
}
k_menuItem.k_setIconClass(k_className);
},

_k_getButtonRelatedToMenuItem: function (k_menuItemId) {
var k_button = this.k_items[k_menuItemId];
if (!k_button.k_isInstanceOf('K_Button')) {
k_button = k_button.k_topMenu.k_relatedButton;
}
return k_button;
},

k_removeMenuItem: function (k_menuItemId) {
var k_button = this._k_getButtonRelatedToMenuItem(k_menuItemId);
delete this.k_items[k_menuItemId];
k_button.k_removeMenuItem(k_menuItemId);
if (this._k_hasSharedMenu) {
this.k_sharedMenu.k_removeItem(k_menuItemId);
}
},

k_addMenuItem: function (k_parentMenuId, k_menuItemCfg) {
var k_button = this._k_getButtonRelatedToMenuItem(k_parentMenuId);
k_button.k_addMenuItem(k_parentMenuId, k_menuItemCfg);
if (this._k_hasSharedMenu) {
this.k_sharedMenu.k_items[k_parentMenuId].k_submenu.k_addItem(k_menuItemCfg);
}
},

k_removeAllMenuItems: function (k_menuItemId) {
var k_button = this._k_getButtonRelatedToMenuItem(k_menuItemId);
k_button.k_removeAllMenuItems(k_menuItemId);
if (this._k_hasSharedMenu) {
this.k_sharedMenu.k_items[k_menuItemId].k_submenu.k_removeAllItems();
}
}
});

kerio.lib._K_VerticalToolbarLayout = Ext.extend(Ext.layout.ToolbarLayout, {
onLayout : function(ct, target){
if(!this.leftTr){
target.addClass('x-toolbar-layout-ct');
target.addClass('verticalToolbar');
target.insertHtml('beforeEnd', [
'<table cellspacing="0" class="x-toolbar-ct"><tbody>',
'<tr><td class="x-toolbar-top" align="left">',
'<table cellspacing="0" width="100%"><tbody><tr class="x-toolbar-top-row"><td>',
'<table cellspacing="0" width="100%"><tbody class="toolbarTopRowBody"></tbody></table>',
'</td></tr></tbody></table>',
'</td></tr>',
'<tr><td class="x-toolbar-bottom" align="left">',
'<table cellspacing="0" width="100%"><tbody><tr><td>',
'<table cellspacing="0" width="100%"><tbody><tr class="x-toolbar-bottom-row"><td>',
'<table cellspacing="0" width="100%"><tbody class="toolbarBottomRowBody"></tbody></table>',
'</td></tr></tbody></table>',
'</td>',
'<td style="display: none;"><table cellspacing="0"><tbody><tr class="x-toolbar-extras-row"></tr></tbody></table></td>',
'</tr></tbody></table></td></tr>',
'</tbody></table>'].join(''));
this.leftTr = target.child('tr.x-toolbar-top-row', true);
this.rightTr = target.child('tr.x-toolbar-bottom-row', true);
this.extrasTr = target.child('tr.x-toolbar-extras-row', true);
kerio.lib._k_addKerioProperty(this, {
k_toolbarTopRowBody: target.child('tbody.toolbarTopRowBody', true),
k_toolbarBottomRowBody: target.child('tbody.toolbarBottomRowBody', true)
});
}
var
side = this._kx.k_toolbarTopRowBody,
pos = 0,
items = ct.items.items;
for(var i = 0, len = items.length, c; i < len; i++, pos++) {
c = items[i];
if (undefined === c.width) {
c.width = '100%';
}
if(c.isFill){
side = this._kx.k_toolbarBottomRowBody;
pos = -1;
}
else if(!c.rendered){
c.render(this.insertCell(c, side, pos));
}
}
this.fitToSize(target);
},
insertCell: function(c, side, pos){
var
tr = document.createElement('tr'),
td = document.createElement('td');
td.className='x-toolbar-cell';
tr.appendChild(td);
side.insertBefore(tr, side.childNodes[pos]||null);
return td;
}
});

kerio.lib._K_ToolbarVerticalSeparator = Ext.extend(Ext.Toolbar.Separator, {
onRender : function(ct, position){
this.el = ct.createChild({tag:'div', cls:'vSeparator'}, position);
}
});

kerio.lib._K_VerticalToolbar = function(k_config) {
k_config.layout = new kerio.lib._K_VerticalToolbarLayout(this.layoutConfig);
k_config.enableOverflow = false;
kerio.lib._K_VerticalToolbar.superclass.constructor.call(this, k_config);
};
Ext.extend(kerio.lib._K_VerticalToolbar, Ext.Toolbar, {
render: function () {
kerio.lib._K_VerticalToolbar.superclass.render.apply(this, arguments);
if (this._kx && true === this._kx.k_isCentered) {
this.el.addClass('centered');
}
},
lookupComponent: function(c){
var T = Ext.Toolbar;
if(Ext.isString(c)){
if(c === '-'){
c = new kerio.lib._K_ToolbarVerticalSeparator();
}else if(c === ' '){
c = new T.Spacer();
}else if(c === '->'){
c = new T.Fill();
}else{
c = new T.TextItem(c);
}
this.applyDefaults(c);
}else{
if(c.isFormField || c.render){ c = this.createComponent(c);
}else if(c.tag){ c = new T.Item({autoEl: c});
}else if(c.tagName){ c = new T.Item({el:c});
}else if(Ext.isObject(c)){ c = c.xtype ? this.createComponent(c) : this.constructButton(c);
}
}
return c;
},
addSeparator: function(){
return this.add(new kerio.lib._K_ToolbarVerticalSeparator());
}
});  
Ext.layout.ToolbarLayout.prototype.initMore = function(){
var k_toolbarId;
if(!this.more){
k_toolbarId = this.container.id;
this.moreMenu = (new kerio.lib.K_Menu(k_toolbarId + '_' + 'k_moreMenu', {k_items: []})).k_extWidget;
this.moreMenu.on('beforeshow', this.beforeMoreShow, this);
this.more = new Ext.Button({
iconCls: 'x-toolbar-more-icon',
cls: 'x-toolbar-more',
menu: this.moreMenu,
id: k_toolbarId + '_' + 'k_moreButton'
});
var td = this.insertCell(this.more, this.extrasTr, 100);
this.more.render(td);
}
};
Ext.layout.ToolbarLayout.prototype.createMenuConfig = function(c, hideOnClick){

var
k_menuItem,
k_id;
k_id = this.container.id + '_' + 'k_moreMenu' + kerio.lib.k_getGeneratedId();
k_menuItem = new kerio.lib.K_MenuItem(k_id, c._kx.k_owner._k_action);
k_menuItem.k_relatedWidget = this.container._kx.k_owner;
return k_menuItem.k_extWidget;
};


kerio.lib.K_Tree = function(k_id, k_config) {
if (k_config.k_update) {
this.k_update = k_config.k_update;
}
this.k_items = {};
this._k_setStoredProperties([
'k_localData',
'k_remoteData',
'k_isParentNodeSelectable',
'k_isSingleClickExpand',
'k_isElbowClickExpandOnly',
'k_isRootSelectable',
'k_isRootCollapsible',
'k_isRootVisible',
'k_isProductMenu'
]);
kerio.lib.K_Tree.superclass.constructor.call(this, k_id, k_config);
if (this._k_isStateful) {
this._k_addSettingsChangeEvents(['expandnode', 'collapsenode']);
}
};
Ext.extend(kerio.lib.K_Tree, kerio.lib._K_ToolbarContainer,
{



















_k_isStateful: false,
k_eventTypes: kerio.lib.k_constants.k_EVENT.k_TYPES,

_k_propertiesDefault: {
cls: 'baseTree %+',
autoShow: true,
animate: false,
lines: false,
containerScroll: true,
enableDD: false,
ddGroup: 'message',
ddAppendOnly: true
},

_k_propertiesMapping: {
k_width: 'width',
k_className: 'cls',
k_onClick:       {k_extName: 'click'      , k_listener: 'this._k_onClickNode'      , k_scope: 'this'},
k_onDblClick:    {k_extName: 'dblclick'   , k_listener: 'this._k_onDblClickNode'   , k_scope: 'this'},
k_onBeforeClick: {k_extName: 'beforeclick', k_listener: 'this._k_onBeforeClickNode', k_scope: 'this'},
k_onNodeExpanding: { k_extName: 'beforeexpandnode', k_listener: 'this._k_onBeforeExpandNode', k_scope: 'this' },
k_onNodeExpanded:  { k_extName: 'expandnode',       k_listener: 'this._k_onExpandNode',       k_scope: 'this' }
},

_k_rootNodeDefaults: {
cls: 'rootNode %+',  draggable: false,
expanded: true,
expandable: false,
iconCls: 'rootIcon %+',
text: 'root'
},

_k_nodeDefaults: {
cls: 'treeNode %+',
draggable: false,
expanded: false,
expandable: false,
iconCls: 'nodeIcon %+',
text: 'node',
singleClickExpand: false
},

_k_nodePropertiesMapping: {
k_id: 'id',
k_caption: 'text',
k_className: 'cls',
k_iconCls: 'iconCls',
k_isExpanded: 'expanded',
k_isExpandable: 'expandable',
k_isSingleClickExpand: 'singleClickExpand',
k_href: 'href'
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_localData = k_storedConfig.k_localData,
k_remoteData = k_storedConfig.k_remoteData,
k_selectionModel,
k_extWidget,
k_isRootVisible = k_storedConfig.k_isRootVisible;
k_adaptedConfig.id = this.k_id;
if (!k_localData && !k_remoteData) {
k_localData = [{
k_className: 'emptyTree',
k_iconCls: '',
k_caption: Ext.grid.GridView.prototype.emptyText
}];
}
if (k_localData) {
k_isRootVisible = undefined === k_isRootVisible ? (1 === k_localData.length) : k_isRootVisible;
this._k_createTreeFromData(k_localData);
}
else {
kerio.lib.k_reportError('Internal error: Remote data for K_Tree is not implemented yet!');

}
k_adaptedConfig.rootVisible = k_isRootVisible;
this._k_isRootVisible = k_isRootVisible;
this._k_isRootSelectable = false !== k_storedConfig.k_isRootSelectable;
this._k_isRootCollapsible = false !==  k_storedConfig.k_isRootCollapsible;
if (!k_adaptedConfig.cls) {
k_adaptedConfig.cls = '';
}
k_adaptedConfig.selModel = new kerio.lib._K_TreeSelectionModel({
k_isParentNodeSelectable: k_storedConfig.k_isParentNodeSelectable
});
k_extWidget = new Ext.tree.TreePanel(k_adaptedConfig);
k_extWidget.on('render', this._k_initKeyNav, this);
k_selectionModel = k_extWidget.getSelectionModel();
if (this._k_extRootNode) {
k_extWidget.setRootNode(this._k_extRootNode);
if (this._k_isRootVisible) {
this._k_setRootBehavior();
}
}
k_selectionModel.on('selectionchange', this._k_onSelectionChanged, this);
if (k_adaptedConfig.k_contextMenu) {
this._k_createContextMenu(k_adaptedConfig.k_contextMenu, k_extWidget);
}
k_extWidget.on('render', this._k_onRender, this);
k_extWidget.on('collapsenode', this._k_updateBackgroundWidth, this);
k_extWidget.on('expandnode', this._k_updateBackgroundWidth, this);
k_selectionModel.on('selectionchange', this._k_updateBackgroundWidth, this);
this._k_removeStoredProperties([
'k_isParentNodeSelectable',
'k_isRootSelectable',
'k_isRootCollapsible'
]);
return k_extWidget;
}, 
_k_initKeyNav: function (k_extTreePanel) {
this._k_keyNav = new Ext.KeyMap(k_extTreePanel.getTreeEl(), {
key: 32,
fn: function () {
Ext.EventObject.preventDefault();
var k_selectedNode = this.k_extWidget.getSelectionModel().getSelectedNode();
if (k_selectedNode) {
k_selectedNode.ui.onClick(Ext.EventObject);
}
},
scope: this
});
},

_k_isNodeSelectable: function (k_node) {
var k_selectionModel = this.k_extWidget.getSelectionModel();
return k_selectionModel._kxp._k_isNodeSelectable.call(k_selectionModel, k_node);
},

_k_setRootBehavior: function() {
var
k_extRootNode = this._k_extRootNode,
k_extTree = k_extRootNode.ownerTree,
k_extAttributes = k_extRootNode.attributes,
k_cls = k_extAttributes.cls;
if (!this._k_isRootCollapsible) {
k_extTree.addClass('nonCollapsible');
k_extRootNode.on('beforecollapse', this._k_cancelEvent, this);
}
if (!this._k_isRootSelectable) {
k_extAttributes.cls = kerio.lib._k_addClassName(k_cls, 'unselectableRoot');
k_extRootNode.on('beforeclick', this._k_cancelEvent, this);
k_extRootNode.on('beforedblclick', this._k_cancelEvent, this);
}
},

_k_updateBackgroundWidth: function() {
var
k_extTree = this.k_extWidget,
k_domTreeContainer = k_extTree.body.dom,
k_domTreeInner = k_extTree.innerCt,
k_marginLeft = k_domTreeInner.getMargins('l'),
k_offset = 0,
k_width;
k_domTreeInner.dom.style.width = 'auto';
if (kerio.lib.k_isMSIE) {
k_offset = (k_domTreeContainer.scrollWidth < k_domTreeContainer.clientWidth)
? (k_domTreeContainer.clientWidth - k_domTreeContainer.scrollWidth)
: Math.abs(k_domTreeInner.dom.offsetLeft);
}
k_width = ((k_domTreeContainer.scrollWidth + k_offset) === k_domTreeContainer.clientWidth) ? 'auto' : ((k_domTreeContainer.scrollWidth + k_marginLeft) + 'px');
if (kerio.lib.k_isMSIE && ('auto' === k_width) && (k_domTreeContainer.scrollWidth < k_domTreeContainer.clientWidth)) {
k_width = k_domTreeContainer.clientWidth;
}
k_domTreeInner.dom.style.width = k_width;
}, 
_k_registerItem: function(k_id, k_item) {
if (k_id) {
if (undefined === this.k_items[k_id]) {
this.k_items[k_id] = k_item;
}
else {
kerio.lib.k_reportError('Internal error: Duplicate node ID: ' + k_id, 'tree.js');
}
}
},

_k_onContextMenu: function(k_extWidget, k_extEvent) {
var k_contextMenu = k_extWidget.ownerTree._kx.k_contextMenu;
k_contextMenu.show(k_extEvent.target);
k_contextMenu.k_relatedItem = k_extWidget;
},

_k_createTreeFromData: function(k_data, k_node) {
var
k_addProperty = kerio.lib._k_addKerioProperty,
k_createConfig = kerio.lib._k_createConfig,
k_customNodeUI = true === this._k_storedConfig.k_isElbowClickExpandOnly && kerio.lib._K_TreeNodeUI,
k_nodeDefaults = k_node ? this._k_nodeDefaults : this._k_rootNodeDefaults,
k_location = window.location,
k_nodeData,
k_newNodeCfg,
k_newNode,
k_cnt, k_i;
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_nodeData = k_data[k_i];
k_nodeData.k_isSingleClickExpand = this._k_storedConfig.k_isSingleClickExpand;
if (true === this._k_storedConfig.k_isProductMenu) {
k_nodeData.k_href = k_location.protocol + '//' + k_location.host + k_location.pathname + k_location.search + '#' + k_nodeData.k_id;
}
k_newNodeCfg = k_createConfig.call(this, k_nodeData, k_nodeDefaults, this._k_nodePropertiesMapping);
if (k_customNodeUI) {
k_newNodeCfg.uiProvider = k_customNodeUI;
}
k_newNode = new Ext.tree.TreeNode(k_newNodeCfg);
if (k_node) {
k_node.appendChild(k_newNode);
}
else {
this._k_extRootNode = k_newNode;
this._k_rootNodeCfg = Ext.apply({}, k_nodeData);  this._k_rootNodeCfg.k_nodes = null;
}
k_addProperty(k_newNode, {k_rawData: k_nodeData.k_rawData});
k_newNode.loaded = true;
if (k_nodeData.k_nodes) {
this._k_createTreeFromData(k_nodeData.k_nodes, k_newNode);
}
this._k_registerItem(k_nodeData.k_id, k_newNode);
if (k_nodeData.k_isSelected) {
this._k_selectedNode = k_newNode;
}
}
}, 
_k_createContextMenu: function(k_config, k_extTreePanel) {
var k_contextMenu = new kerio.lib.K_Menu(this.k_id + '_contextMenu', k_config, this);
kerio.lib._k_addKerioProperty(k_extTreePanel, {k_contextMenu: k_contextMenu.k_extWidget});
k_extTreePanel.on('contextmenu', this._k_onContextMenu);
},

_k_onClickNode: function(k_extNode, k_extEvent) {
if (!this._k_isNodeSelectable(k_extNode)) {
return;
}
var
k_event = new kerio.lib.K_Event(this.k_eventTypes.k_CLICK, k_extEvent),
k_treeNode = this._k_getTreeNode(k_extNode);
this._k_mappedListeners.k_onClick.call(this, k_treeNode, k_event);
},

_k_onDblClickNode: function(k_extNode, k_extEvent) {
var k_event = new kerio.lib.K_Event(this.k_eventTypes.k_DOUBLE_CLICK, k_extEvent),
k_treeNode = this._k_getTreeNode(k_extNode);
this._k_mappedListeners.k_onDblClick.call(this, k_treeNode, k_event);
},

_k_onBeforeClickNode: function(k_extNode, k_extEvent) {
var
k_browserEvent = k_extEvent.browserEvent,
k_returnValue,
k_event,
k_currentNode,
k_newNode;
if (this._k_isNodeSelectable(k_extNode)) {
k_event = new kerio.lib.K_Event(this.k_eventTypes.k_CLICK, k_extEvent);
k_currentNode = this.k_extWidget.selModel.selNode;
k_newNode = this._k_getTreeNode(k_extNode);
if (k_currentNode) {
k_currentNode = this._k_getTreeNode(k_currentNode);
}
k_returnValue = this._k_mappedListeners.k_onBeforeClick.call(this, k_newNode, k_currentNode, k_event);
}

if (Ext.isGecko && (false === k_returnValue)) {
k_browserEvent.preventDefault();
}
return k_returnValue;
}, 
_k_onBeforeExpandNode: function(k_extNode, k_deep, k_anim) {
var k_node = this._k_getTreeNode(k_extNode);
return this._k_mappedListeners.k_onNodeExpanding.call(this, k_node, k_deep, k_anim);
},

_k_onExpandNode: function(k_extNode) {
var k_node = this._k_getTreeNode(k_extNode);
this._k_mappedListeners.k_onNodeExpanded.call(this, k_node);
},

_k_cancelEvent: function() {
return false;
},

_k_getTreeNode: function(k_extNode) {
var k_treeNode = {
k_id: k_extNode.id,
k_caption: k_extNode.text,
k_isExpanded: k_extNode.expanded,
k_isExpandable: k_extNode.isExpandable(),
k_isSelected: k_extNode.isSelected(),
k_rawData: k_extNode._kx ? k_extNode._kx.k_rawData : undefined,
k_extWidget: k_extNode,
k_tree: this
};
return k_treeNode;
},

k_getSelectedNode: function () {
var k_extNode = this.k_extWidget.getSelectionModel().getSelectedNode();
if (k_extNode) {
return this._k_getTreeNode(k_extNode);
}
return null;
},

k_selectNode: function(k_nodeId) {
var k_extNode = this.k_items[k_nodeId];
if (k_extNode) {
this._k_selectNode(k_extNode);
}
},

_k_selectNode: function(k_extNode) {
if (this._k_mappedListeners && this._k_mappedListeners.k_onClick) { this.k_extWidget.expandPath(k_extNode.getPath());
k_extNode.select();
this._k_onClickNode.call(this, k_extNode);
}
},

_k_onRender: function(k_extTreePanel) {
this.k_addFocusableItem(k_extTreePanel.body);
var k_ownerContainer = k_extTreePanel.ownerCt;
if (k_ownerContainer && (undefined !== k_ownerContainer.layout)) {
this._k_adjustStylesForLayout();
if (kerio.lib.k_isMSIE) {
k_ownerContainer.on('afterlayout', this._k_updateBackgroundWidth, this);
}
k_ownerContainer.on('resize', this._k_updateBackgroundWidth, this);
if (this._k_selectedNode) {
this._k_selectNode.defer(100, this, [this._k_selectedNode]);
}
}
},

_k_adjustStylesForLayout: function() {
var k_extElement = this.k_extWidget.el.query('ul')[0];
k_extElement = Ext.get(k_extElement.parentNode);
k_extElement.setStyle({height: '100%', overflow: 'auto'});
k_extElement = k_extElement.parent();
k_extElement.setStyle({height: '100%'});
k_extElement = k_extElement.parent();
k_extElement.setStyle({height: '100%'});
},

k_setData: function (k_data, k_nodeId, k_append) {
var k_node = null;
if (k_nodeId) {
k_node = this.k_extWidget.getNodeById(k_nodeId);
if (!k_node) {
kerio.lib.k_reportError('Internal error: Attempt to set data for non-existing tree node with ID ' + k_nodeId);
return;
}
}
else {
k_node = this._k_extRootNode;
if (1 === k_data.length) {
this.k_setRootNode(k_data[0]);
k_data = k_data[0].k_nodes;
}
}
if (true !== k_append) {
this._k_removeRegisteredItems(k_node);
}
this._k_selectedNode = null;
k_node.beginUpdate();
this._k_createTreeFromData(k_data, k_node);
k_node.expand();
k_node.endUpdate();
if (this._k_selectedNode) {
this._k_selectedNode.select();
}
},

k_getData: function (k_node) {
var k_startNode,
k_nodeId,
k_treeData = [];
if (k_node) {
if ('object' === Ext.type(k_node)) {
k_nodeId = k_node.k_id;
}
else {
k_nodeId = k_node;
}
k_startNode = this.k_extWidget.getNodeById(k_nodeId);
}
else {
k_startNode = this._k_extRootNode;
}
if (!k_startNode) {
return null;
}
k_treeData = this._k_getNodeData(k_startNode);
if (!k_node && this._k_isRootVisible) {
k_startNode = this.k_getRootNode();
k_startNode.k_nodes = k_treeData;
k_treeData = [k_startNode];
}
return k_treeData;
},

_k_getNodeData: function (k_node) {
var k_childNodes = k_node.childNodes,
k_extChildNode,
k_childNode,
k_i, k_cnt,
k_nodeData = [];
for (k_i = 0, k_cnt = k_childNodes.length; k_i < k_cnt; k_i++) {
k_extChildNode = k_childNodes[k_i];
k_childNode = this._k_getTreeNode(k_extChildNode);
k_childNode.k_isSelected = k_extChildNode.isSelected();
delete k_childNode.k_extWidget;
delete k_childNode.k_tree;
if (k_extChildNode.childNodes.length > 0) {
k_childNode.k_nodes = this._k_getNodeData(k_extChildNode);
}
k_nodeData.push(k_childNode);
}
return k_nodeData;
},

_k_removeRegisteredItems: function (k_node, k_unregisterOnly) {
var
k_childNodes = k_node.childNodes,
k_bodyEl = this.k_extWidget.body,
k_items = this.k_items,
k_childNode,
k_i;
if (k_node === this._k_extRootNode) {
if (k_bodyEl) {  k_bodyEl.dom.scrollTop = 0;
k_bodyEl.dom.scrollLeft = 0;
}
}
for (k_i = k_childNodes.length - 1; k_i >= 0; k_i--) {
k_childNode = k_childNodes[k_i];
this._k_removeRegisteredItems(k_childNode, true);
if (true !== k_unregisterOnly) {
k_node.removeChild(k_childNode);  }
else if (k_childNode.isSelected()) {
k_childNode.unselect(true);      }
if (undefined !== k_items[k_childNode.id]) {
delete k_items[k_childNode.id];
}
}
},

k_setRootNode: function (k_newRootCfg) {
var k_rootNode = this._k_extRootNode,
k_nodeUI = k_rootNode.getUI(),
k_rootNodeEl = Ext.get(k_nodeUI.elNode),
k_iconNodeEl = Ext.get(k_nodeUI.iconNode),
k_rootNodeCfg = this._k_rootNodeCfg,
k_extWidget = this.k_extWidget;
this._k_updateClass(k_rootNodeEl, k_rootNodeCfg.k_className, k_newRootCfg.k_className);
this._k_updateClass(k_iconNodeEl, k_rootNodeCfg.k_iconCls  , k_newRootCfg.k_iconCls  );
if (k_rootNodeCfg.k_id !== k_newRootCfg.k_id) {
if (undefined === k_newRootCfg.k_id) {
k_newRootCfg.k_id = k_rootNodeCfg.k_id;
}
if (this.k_items[k_rootNodeCfg.k_id]) {
delete this.k_items[k_rootNodeCfg.k_id];
}
delete k_extWidget.nodeHash[k_rootNode.id];
k_rootNode.id = k_newRootCfg.k_id;
k_nodeUI.elNode.setAttribute('ext:tree-node-id', k_newRootCfg.k_id);
k_extWidget.nodeHash[k_rootNode.id] = k_rootNode;
this._k_registerItem(k_newRootCfg.k_id, k_rootNode);
}
kerio.lib._k_addKerioProperty(k_rootNode, {k_rawData: k_newRootCfg.k_rawData});
if (k_rootNodeCfg.k_caption !== k_newRootCfg.k_caption) {
k_rootNode.setText(k_newRootCfg.k_caption);
}
if (k_newRootCfg.k_isSelected) {
k_rootNode.select();
}
this._k_rootNodeCfg = k_newRootCfg;
}, 
_k_updateClass: function (k_extElement, k_currentClass, k_newClass) {
if ((k_currentClass || k_newClass) && k_currentClass !== k_newClass) {
if (undefined !== k_currentClass) {
k_extElement.removeClass(k_currentClass);
}
if (undefined !== k_newClass) {
k_extElement.addClass(k_newClass);
}
}
},

k_getRootNode: function () {
var k_data = this._k_getTreeNode(this._k_extRootNode);
delete k_data.k_tree;
delete k_data.k_extWidget;
return k_data;
},

_k_onSelectionChanged: function (k_extSelectionModel, k_extNode) {
kerio.lib.k_notify(this, this.k_eventTypes.k_SELECTION_CHANGED);
},

k_update: function(k_sender, k_event) {
kerio.lib.k_reportError('Internal error: Override k_update method in object with ID ' + this.k_id
+ ' to make this object behaving as an observer', 'tree.js');
},

_k_storeInitialSettings: function (k_config) {
var
k_initialSettings = {
expandedNodeList: [],
collapsedNodeList: []
};
this._k_getInitialSettings(k_config.k_localData, k_initialSettings);
k_initialSettings.width = k_config.k_width;
this._k_initialSettings = k_initialSettings;
},

_k_getSettings: function () {
var
k_settings = this._k_getNodesState(this.k_extWidget.getRootNode()),
k_appliedSettings = this._k_appliedSettings;
if (!k_appliedSettings) {
if (kerio.lib.k_isEmpty(k_settings.expandedNodeList)) {
delete k_settings.expandedNodeList;
}
if (kerio.lib.k_isEmpty(k_settings.collapsedNodeList)) {
delete k_settings.collapsedNodeList;
}
}
else {
if (!k_appliedSettings.k_expandedNodeList && kerio.lib.k_isEmpty(k_settings.expandedNodeList)) {
delete k_settings.expandedNodeList;
}
if (!k_appliedSettings.k_collapsedNodeList && kerio.lib.k_isEmpty(k_settings.collapsedNodeList)) {
delete k_settings.collapsedNodeList;
}
}
return k_settings;
},

_k_applySettingsToConfig: function (k_settings, k_config) {
var k_lib = kerio.lib;
this._k_appliedSettings = {
k_collapsedNodeList: !k_lib.k_isEmpty(k_settings.collapsedNodeList),
k_expandedNodeList: !k_lib.k_isEmpty(k_settings.expandedNodeList),
k_width: !k_lib.k_isEmpty(k_settings.width)
};
this._k_setNodesState(k_config.k_localData, k_settings);
if (Ext.isDefined(k_settings.width)) {
k_config.k_width = k_settings.width;
}
},

_k_getNodesState: function (k_node, k_settings) {
var
k_initialSettings = this._k_initialSettings,
k_expandedNodes,
k_child,
k_i, k_cnt;
if (!k_settings) {
k_settings = {
collapsedNodeList: [],
expandedNodeList: []
};
}
for (k_i = 0, k_cnt = k_node.childNodes.length; k_i < k_cnt; k_i++) {
k_child = k_node.childNodes[k_i];
if (k_child.hasChildNodes()) {
if(k_child.isExpanded() && -1 === k_initialSettings.expandedNodeList.indexOf(k_child.id)) {
k_settings.expandedNodeList.push(k_child.id);
}
else if (!k_child.isExpanded() && -1 === k_initialSettings.collapsedNodeList.indexOf(k_child.id)) {
k_settings.collapsedNodeList.push(k_child.id);
}
this._k_getNodesState(k_child, k_settings);
}
}
return k_settings;
},

_k_setNodesState: function (k_nodes, k_settings) {
var
k_expandedNodes = k_settings.expandedNodeList,
k_collapsedNodes = k_settings.collapsedNodeList,
k_node,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_nodes.length; k_i < k_cnt; k_i++) {
k_node = k_nodes[k_i];
if (k_node.k_id) {
if (k_expandedNodes && -1 !== k_expandedNodes.indexOf(k_node.k_id)) {
k_node.k_isExpanded = true;
}
if (k_collapsedNodes && -1 !== k_collapsedNodes.indexOf(k_node.k_id)) {
k_node.k_isExpanded = false;
}
}
if (k_node.k_nodes) {
this._k_setNodesState(k_node.k_nodes ,k_settings);
}
}
},

_k_getInitialSettings: function (k_nodes, k_initialSettings) {
var
k_expandedNodes = k_initialSettings.expandedNodeList,
k_collapsedNodes = k_initialSettings.collapsedNodeList,
k_node,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_nodes.length; k_i < k_cnt; k_i++) {
k_node = k_nodes[k_i];
if (k_node.k_id) {
if (k_node.k_nodes) {
if (k_node.k_isExpanded) {
k_expandedNodes.push(k_node.k_id);
}
else {
k_collapsedNodes.push(k_node.k_id);
}
}
}
if (k_node.k_nodes) {
this._k_getInitialSettings(k_node.k_nodes, k_initialSettings);
}
}
}
}); 
kerio.lib._K_TreeSelectionModel = function (k_config) {
kerio.lib._k_addKerioProperty(this, {
k_isParentNodeSelectable: false !== k_config.k_isParentNodeSelectable
});
delete k_config.k_isParentNodeSelectable;
kerio.lib._K_TreeSelectionModel.superclass.constructor.call(this, k_config);
};
Ext.extend(kerio.lib._K_TreeSelectionModel, Ext.tree.DefaultSelectionModel,
{


onNodeClick: function(k_node, k_e) {
if (this._kxp._k_isNodeSelectable.call(this, k_node)) {
this.select(k_node);
}
}
});
kerio.lib._K_TreeSelectionModel.prototype._kxp = Ext.apply(kerio.lib._K_TreeSelectionModel.prototype._kxp || {}, {

_k_isNodeSelectable: function (k_node) {
var
k_kerioWidget = this.tree._kx.k_owner,
k_isParentNodeSelectable = this._kx.k_isParentNodeSelectable,
k_isSelectable = false;
if (k_node.isRoot) {
k_isSelectable = k_kerioWidget._k_isRootSelectable;
}
else {
k_isSelectable = k_isParentNodeSelectable || false === k_node.hasChildNodes();
}
return k_isSelectable;
}
});

kerio.lib._K_TreeNodeUI = function (k_config) {
kerio.lib._K_TreeNodeUI.superclass.constructor.call(this, k_config);
};
Ext.extend(kerio.lib._K_TreeNodeUI, Ext.tree.TreeNodeUI,
{

onClick: function (k_extEvent) {
if(this.dropping){
k_extEvent.stopEvent();
return;
}
if(false !== this.fireEvent('beforeclick', this.node, k_extEvent)){
var k_anchor = k_extEvent.getTarget('a');
if(!this.disabled && this.node.attributes.href && k_anchor){
this.fireEvent('click', this.node, k_extEvent);
return;
}else if(k_anchor && k_extEvent.ctrlKey){
k_extEvent.stopEvent();
}
k_extEvent.preventDefault();
if(this.disabled){
return;
}
this.fireEvent('click', this.node, k_extEvent);
}
else{
k_extEvent.stopEvent();
}
},

onDblClick: function (k_extEvent) {
k_extEvent.preventDefault();
if(this.disabled){
return;
}
if(this.checkbox){
this.toggleCheck();
}
if (this.ecNode !== k_extEvent.getTarget()) {
this.fireEvent('dblclick', this.node, k_extEvent);
}
}
});


kerio.lib.K_Menu = function(k_id, k_config, k_topMenu ) {
this._k_localItems = {};    this._k_setStoredProperties(['k_items', 'k_onClick', '_k_preventOnClickInMenu', 'k_onBeforeShow']);
k_topMenu = k_topMenu || null;
this.k_items = k_topMenu ? k_topMenu.k_items : {}; this.k_topMenu = k_topMenu;
this.k_conditionallyVisibleItems = [];
kerio.lib.K_Menu.superclass.constructor.call(this, k_id, k_config);
if (k_config.k_update) {
this.k_update = k_config.k_update;
}
};
Ext.extend(kerio.lib.K_Menu, kerio.lib._K_BaseWidget,
{






_k_propertiesMapping: {
k_id: 'id',
k_className: 'cls',
k_isDisabled: 'disabled',
k_isHidden: 'hidden'
},

_k_propertiesDefault: {},

_k_beforeInitExtComponent: function (k_adaptedConfig, k_storedConfig) {
var
k_itemsCfg = k_storedConfig.k_items,
k_cnt = k_itemsCfg.length,
k_itemCfg,
k_menuItem,
k_extMenuItem,
k_i;
k_adaptedConfig.items = [];
for (k_i = 0; k_i < k_cnt; k_i++) {
k_itemCfg = k_itemsCfg[k_i];
if ('string' === Ext.type(k_itemCfg) || ('-' === k_itemCfg.k_caption)) { k_extMenuItem = new Ext.menu.Separator();
}
else {
if (k_itemCfg.k_isVisibleIfShift) {
this.k_conditionallyVisibleItems.push(k_itemCfg.k_id);
k_itemCfg.k_isHidden = true;
}
k_menuItem = this._k_createMenuItem(k_itemCfg);
k_extMenuItem = k_menuItem.k_extWidget;
k_storedConfig.k_items[k_i] = k_menuItem._k_action; }
k_adaptedConfig.items.push(k_extMenuItem);
}
k_adaptedConfig.listeners = Ext.apply(k_adaptedConfig.listeners || {}, {
add: {
fn: this._k_onItemAdd,
scope: this
}
});
this._k_removeStoredProperties(['k_items']);
},

_k_onItemAdd: function (k_extMenu, k_extMenuItem, k_index) {
if (k_extMenuItem instanceof Ext.menu.Separator) {
return;
}
k_extMenuItem.on({
show: this._k_onMenuItemVisibilityChange,
hide: this._k_onMenuItemVisibilityChange,
scope: this
});
},

_k_createMenuItem: function (k_itemCfg) {
var
k_itemId = k_itemCfg._k_isAction ? k_itemCfg.k_itemId : k_itemCfg.k_id,
k_onMenuClick = this._k_storedConfig.k_onClick,
k_menuItem;
if (undefined === k_itemId) {
k_itemId = kerio.lib.k_getGeneratedId();
k_itemCfg[k_itemCfg._k_isAction ? 'k_itemId' : 'k_id'] = k_itemId;
}
k_menuItem = new kerio.lib.K_MenuItem(this.k_id + '_' + k_itemId, k_itemCfg, this.k_topMenu || this);
k_menuItem.k_menu = this;
this.k_items[k_itemId] = k_menuItem;
this._k_localItems[k_itemId] = k_menuItem;
return k_menuItem;
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget;
k_extWidget = new Ext.menu.Menu(k_adaptedConfig);
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_extWidget = this.k_extWidget,
k_topMenu = this.k_topMenu || {_k_storedConfig: {}};
if (k_storedConfig.k_onClick && !k_storedConfig._k_preventOnClickInMenu) {
k_extWidget.on('itemclick', this._k_onItemClick, this);
this._k_removeStoredProperties(['_k_preventOnClickInMenu']);
}
if (k_topMenu._k_storedConfig.k_onClick) {
k_extWidget.on('itemclick', this._k_onGlobalClickHandler, this);
}
this._k_setVisibleSeparator();
k_extWidget.on({
beforeshow: this._k_onBeforeShow,
show      : this._k_onShow,
hide      : this._k_onHide,
scope     : this
});
},

_k_onGlobalClickHandler: function (k_extMenuItem, k_extEvent) {
if (!(k_extMenuItem instanceof Ext.menu.Item)) {
return false;
}
return k_extMenuItem._kx.k_owner._k_action._k_onClickHandler(k_extMenuItem, 'k_globalItemClick');
},

_k_onItemClick: function (k_extMenuItem, k_extEvent) {
if (!(k_extMenuItem instanceof Ext.menu.Item)) {
return false;
}
return k_extMenuItem._kx.k_owner._k_action._k_onClickHandler(k_extMenuItem, 'k_itemClick');
},

_k_onBeforeShow: function(k_extMenu) {
var
k_conditionallyVisibleItems = this.k_conditionallyVisibleItems,
k_isShiftKey,
k_i, k_cnt,
k_event;
if (k_conditionallyVisibleItems.length > 0) {
k_isShiftKey = Ext.EventObject.shiftKey || Ext.EventObject.altKey;
for (k_i = 0, k_cnt = k_conditionallyVisibleItems.length; k_i < k_cnt; k_i++) {
this.k_showItem(k_conditionallyVisibleItems[k_i], k_isShiftKey);
}
}
if (this._k_storedConfig.k_onBeforeShow) {
k_event = new kerio.lib.K_Event(kerio.lib.k_constants.k_EVENT.k_TYPES.k_CLICK, Ext.EventObject);
this._k_storedConfig.k_onBeforeShow.call(this, this, this._k_localItems, k_event);
}
},

_k_onShow: function (k_extMenu) {
var
k_ownerCt = k_extMenu.ownerCt,
k_el = k_extMenu.getEl(),
k_xy;
this._k_isVisible = true;
if (!k_ownerCt) {
return;
}
},

_k_onHide: function(k_extMenu) {
this._k_isVisible = false;
},

k_show: function(k_el, k_pos, k_parentMenu) {
this.k_extWidget.show(k_el, k_pos, k_parentMenu);
},

k_hide: function() {
this.k_extWidget.hide();
},

k_showAt: function(k_xy, k_parentMenu) {
this.k_extWidget.showAt(k_xy, k_parentMenu);
},

k_enableItem: function(k_itemId, k_enable) {
var k_item = this.k_items[k_itemId];
k_enable = false !== k_enable;
k_item.k_setDisabled(!k_enable);
},

k_disableItem: function(k_itemId) {
this.k_enableItem(k_itemId, false);
},

k_showItem: function(k_itemId, k_show) {
var k_item = this.k_items[k_itemId];
k_item.k_setVisible(false !== k_show);
},

k_hideItem: function(k_itemId) {
this.k_showItem(k_itemId, false);
},

k_update: function(k_sender, k_event) {
kerio.lib.k_reportError('Internal error: Override k_update method in object with ID ' + this.k_id
+ ' to make this object behaving as an observer', 'menu.js');
},

k_addItem: function (k_itemCfg, _k_itemCfg) {
var
k_menuItem,
k_menu = this;
if ('string' === Ext.type(k_itemCfg)) {
k_menu = this.k_items[k_itemCfg].k_submenu;
k_itemCfg = _k_itemCfg;
}
k_menuItem = k_menu._k_createMenuItem.call(k_menu, k_itemCfg);
k_menuItem.k_add(k_menu);
},

k_addSeparator: function() {
this.k_extWidget.add(new Ext.menu.Separator());
},

k_removeItem: function (k_itemId) {
var k_item = this.k_items[k_itemId];
k_item.k_remove();
},

k_removeAllItems: function (k_menuItemId) {
var
k_itemId,
k_localItems = undefined === k_menuItemId ? this._k_localItems : this.k_items[k_menuItemId].k_submenu._k_localItems;
for (k_itemId in k_localItems) {
if (k_localItems[k_itemId].k_remove) {
k_localItems[k_itemId].k_remove();
}
}
},

k_setDisabled: function (k_disabled) {
k_disabled = false !== k_disabled;
this._k_isDisabled = k_disabled;
if (!this.k_isReadOnly()) {
this.k_extWidget.setDisabled(k_disabled);
}
},

k_setReadOnly: function (k_readOnly) {
k_readOnly = false !== k_readOnly;
if (!this.k_isDisabled()) {
this.k_extWidget.setDisabled(k_readOnly);
}
},

k_checkItem: function(k_itemId) {
var k_item = this.k_items[k_itemId];
k_item.k_extWidget.setChecked(true);
},

k_setVisible: function (k_visible) {
k_visible = false !== k_visible;
this.k_extWidget.setVisible(k_visible);
},

_k_setVisibleSeparator: function () {
var
k_items = this.k_extWidget.items.items,
k_lastVisibleSeparator = null,
k_itemsBeforeSeparator = 0,
k_itemsAfterSeparator = 0,
k_cnt = k_items.length,
k_i = 0,
k_item;
for (k_i; k_i < k_cnt; k_i++) {
k_item = k_items[k_i];
if (k_item instanceof Ext.menu.Separator) {
if (!k_itemsBeforeSeparator && !k_item.hidden) {
k_item.setVisible(false);
}
if (k_itemsBeforeSeparator && k_item.hidden) {
k_item.setVisible(true);
}
if (!k_item.hidden) {
k_lastVisibleSeparator = k_item;
k_itemsBeforeSeparator = 0;
}
}
else if (!k_item.hidden) { k_itemsBeforeSeparator++;
}
}
if (k_lastVisibleSeparator) {
k_i = this.k_extWidget.items.indexOf(k_lastVisibleSeparator) + 1;
while ((k_item = k_items[k_i++])) {
if (!k_item.hidden) {
k_itemsAfterSeparator++;
}
}
if (0 === k_itemsAfterSeparator) {
k_lastVisibleSeparator.setVisible(false);
}
}
},

_k_onMenuItemVisibilityChange: function () {
this._k_setVisibleSeparator();
this.k_extWidget.doLayout();
}
}); 

kerio.lib.K_ContentPanel = function(k_id, k_config) {
kerio.lib.K_ContentPanel.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_ContentPanel, kerio.lib._K_BaseWidget,
{



_k_propertiesDefault: {
autoScroll: true, fitToFrame: true,
monitorResize: true,
border: false
},

_k_propertiesMapping: {
k_html: 'html'
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget;
k_adaptedConfig.id = this.k_id;
k_extWidget = new Ext.Panel(k_adaptedConfig);
return k_extWidget;
},

k_setContent: function(k_htmlString) {
this.k_extWidget.body.update(k_htmlString);
},

_k_isValid: function(k_markInvalid) {
var k_results = new kerio.lib._K_ValidationResults();
if (this.k_isValid) {
if (!this.k_isValid(k_markInvalid)) {
k_results.k_inc();
}
}
return k_results;
}
});

Ext.lib.Ajax.defaultPostHeader = 'application/json-rpc';
Ext.data.JsonReader.prototype.read = function(response){
var o = response._kx.k_decoded;
if(!o) {
throw new kerio.lib.K_Error('JsonReader.read: Json object not found', 'ajax.js');
}
if(o.metaData){
delete this.ef;
this.meta = o.metaData;
this.recordType = Ext.data.Record.create(o.metaData.fields);
this.onMetaChange(this.meta, this.recordType, o);
}
return this.readRecords(o);
};

kerio.lib.k_ajax = {

_k_propertiesMapping: {
k_url: 'url',
k_method: 'method',
k_callback: {k_extName: 'callback', k_handler: 'k_ajax._k_responseCallback'},
k_timeout: 'timeout',
k_invalidResponse: 'k_invalidResponse',
k_isFileUpload: 'isUpload',
k_form: 'form'
},

_k_propertiesDefault: {
timeout: 60000,
method: 'post',
disableCaching: false
},

_k_errorMessagesDefaults: {
},
k_EXPIRED_SESSION_ERROR_CODE: -32001,
k_TIMEOUT_ERROR_CODE: -32002,
k_FORBIDEN_HTTP_STATUS: 403,
k_MYKERIO_ERROR_CODE_APPLIANCE_NOT_CONNECTED: 1000,
k_MYKERIO_ERROR_CODE_APPLIANCE_DOES_NOT_EXIST: 1002,
k_MYKERIO_ERROR_CODE_ACCESS_DENIED: 1004,
k_MYKERIO_ERROR_CODE_PRODUCT_SESSION_EXPIRED: 1007,
k_MYKERIO_ERROR_CODE_REQUEST_TIMEOUT: 1008,
k_MYKERIO_ERROR_CODE_APPLIANCE_COMMAND_TIMEOUT: 2535,
k_WEBASSIST_MESSAGE_LENGTH: 500,

_k_contentTypeRegExp: new RegExp('^application\/json-rpc(;.*)?$'),

_k_unregisteredRequestsStack: [],

_k_defaultOwner: null, 
_k_apiMethodCreate: ['create', 'generate', 'importCertificate'],

k_request: function(k_options) {
var
k_isMyKerio = kerio.lib.k_isMyKerio,
k_headerItems = [],
k_transaction,
k_apiMethodScope,
k_config,
k_errorMessages,
k_token;
if (this._k_defaultRequestParams) {
Ext.applyIf(k_options, this._k_defaultRequestParams);
}
if (undefined === k_options.k_url) {
kerio.lib.k_reportError('Internal error: kerio.lib.k_ajax::k_request - no URL specified, nothing can be sent', 'ajax.js');
return;
}
k_config = kerio.lib._k_createConfig(k_options, this._k_propertiesDefault, this._k_propertiesMapping);
k_config.method = k_config.method.toUpperCase();  k_options.k_method = k_config.method; if (!k_options.k_callback) {
k_config.callback = this._k_responseCallback;
}
if (k_options.k_isFileUpload) {
if (k_isMyKerio) {
k_headerItems = this._k_listHeaderItems(k_config);
k_config.url = this._k_removeJSessionIdFromUrl(k_config);
this.k_changeUploadButtonName(k_config);
}
if (k_isMyKerio || k_config.url === this._k_defaultRequestParams.k_url) {
k_config.url += 'upload/';  k_config.url = this._k_addHeaderItemsToUrl(k_config.url, k_headerItems);
}
}
if (true !== k_options._k_isDataExport && 'GET' !== k_options.k_method) {
if (!k_options.k_jsonRpc) {
kerio.lib.k_reportError('Internal error: kerio.lib.k_ajax.k_request: k_options.k_jsonRpc has to be defined!', 'ajax.js');
}
if (undefined === k_options.k_jsonRpc.params) {
k_options.k_jsonRpc.params = {};  }
k_config.jsonRpc = {
jsonrpc: '2.0',
id: 1,
method: k_options.k_jsonRpc.method,
params: k_options.k_jsonRpc.params
};
}
if (true === k_options._k_isDataExport) {
this._k_doFileDownload(k_config.url);
return;
}
if (this._k_isApiMethodCreate(k_options)) {
k_apiMethodScope = k_options.k_requestOwner || kerio.lib._k_windowManager.k_getActiveWindow();
}
k_errorMessages = kerio.lib._k_createConfig(k_options.k_errorMessages, this._k_errorMessagesDefaults, this._k_propertiesMapping);
kerio.lib._k_addKerioProperty(k_config, {
k_errorMessages: k_errorMessages,
k_callbackParams: k_options.k_callbackParams,
k_scope: k_options.k_scope,
k_apiMethodScope: k_apiMethodScope,
k_httpProxyLoadResponseParams: k_options.k_httpProxyLoadResponseParams, k_requestOwner: k_options.k_requestOwner,
k_origConfig: k_options,
k_isBatch: k_options.k_jsonRpc ? 'Batch.run' === k_options.k_jsonRpc.method : false });
k_token = this.k_getToken();
k_config.headers = undefined === k_options.k_headers ? {} : k_options.k_headers;
Ext.apply(k_config.headers, {'Accept': 'application/json-rpc'});
if ('GET' !== k_options.k_method) {
Ext.apply(k_config.headers, {'Cache-Control': 'no-cache'});
}
if (k_token) { Ext.apply(k_config.headers, {'X-Token': k_token});
}
k_config.jsonData = k_config.jsonRpc;
delete k_config.jsonRpc;
k_transaction = Ext.Ajax.request(k_config);
if (k_transaction) {
this._k_registerRequest(k_transaction, k_options.k_requestOwner);
}
return k_transaction;
},

k_getMyKerioDefaultParams: function () {
return this._k_myKerioDefaultParams;
},

k_setMyKerioDefaultParams: function (k_params) {
this._k_myKerioDefaultParams = k_params;
kerio.lib.k_isMyKerio = true;
},

_k_getFormInputByName: function(k_form, k_name) {
var
k_elements = k_form.elements,
k_cnt = k_elements.length,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_name === k_elements[k_i].name) {
return k_elements[k_i];
}
}
return false;
},

k_getJSessionIdFromDefaultParams: function() {
var
k_JSESSION_ID_TEMPLATE,
k_jSessionIdPrefix,
k_jSessionIdIndex,
k_jSessionId,
k_appUrl;
if (!kerio.lib.k_isMyKerio) {
return false;
}
k_JSESSION_ID_TEMPLATE = this._k_myKerioDefaultParams.k_JSESSION_ID_TEMPLATE;
k_appUrl = this._k_defaultRequestParams.k_url;
k_jSessionIdPrefix = k_JSESSION_ID_TEMPLATE + '=';
k_jSessionIdIndex = k_appUrl.indexOf(k_jSessionIdPrefix);
if (-1 === k_jSessionIdIndex) {
return false;
}
k_jSessionId = k_appUrl.substring(k_jSessionIdIndex);
k_jSessionId = k_jSessionId.substring(k_jSessionIdPrefix.length);
return k_jSessionId;
},

_k_listHeaderItems: function(k_config) {
var
k_myKerioDefaultParams = this._k_myKerioDefaultParams,
k_items = [],
k_jSessionId,
k_headers,
k_i, k_cnt;
k_jSessionId = this.k_getJSessionIdFromDefaultParams();
if (false === k_jSessionId) {
return k_items;
}
k_items.push({
name: k_myKerioDefaultParams.k_JSESSION_ID_TEMPLATE,
value: k_jSessionId
});
if (k_myKerioDefaultParams.k_headers) {
k_headers = k_myKerioDefaultParams.k_headers;
for (k_i = 0, k_cnt = k_headers.length; k_i < k_cnt; k_i++) {
k_items.push({
name: k_headers[k_i].name,
value: k_headers[k_i].value
});
}
}
return k_items;
},

_k_removeJSessionIdFromUrl: function(k_config) {
var
k_myKerioDefaultParams = this._k_myKerioDefaultParams,
k_JSESSION_ID_TEMPLATE = k_myKerioDefaultParams.k_JSESSION_ID_TEMPLATE,
k_url = k_config.url,
k_jSessionIdPrefix,
k_jSessionIdIndex,
k_jSessionId;
k_jSessionIdPrefix = k_JSESSION_ID_TEMPLATE + '=';
k_jSessionIdIndex = k_url.indexOf(k_jSessionIdPrefix);
if (-1 === k_jSessionIdIndex) {
return k_url;
}
k_jSessionId = k_url.substring(k_jSessionIdIndex);
k_url = k_url.substring(0, k_jSessionIdIndex);
return k_url;
},

_k_addHeaderItemsToUrl: function (k_url, k_headerItems) {
if (!kerio.lib.k_isMyKerio) {
return k_url;
}
var
k_searchDelimeter = '?',
k_i, k_cnt;
if (-1 !== k_url.indexOf(k_searchDelimeter)) {
k_searchDelimeter = '&';
}
for (k_i = 0, k_cnt = k_headerItems.length; k_i < k_cnt; k_i++) {
k_url += k_searchDelimeter + k_headerItems[k_i].name + '=' + k_headerItems[k_i].value;
k_searchDelimeter = '&';
}
return k_url;
},

k_changeUploadButtonName: function(k_config) {
var
k_form = k_config.form,
k_items = k_form.childNodes,
k_i, k_cnt,
k_item;
for (k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_item = k_items[k_i];
if ('file' === k_item.type) {
k_item.name = 'file';
}
}
},

k_abort: function (k_transaction) {
Ext.Ajax.abort(k_transaction);
},

k_getToken: function() {
var k_engineConstants = kerio.lib.k_engineConstants;
if (!k_engineConstants || !k_engineConstants.k_TOKEN_NAME) {
return false;
}
if (!this._k_tokenRegExp) {
this._k_tokenRegExp = new RegExp(k_engineConstants.k_TOKEN_NAME + '=([a-z0-9\\-]+)', 'i');
}

var k_arrayResult = this._k_tokenRegExp.exec(document.cookie);
return ((null === k_arrayResult) ? false : k_arrayResult[1]);
}, 
_k_responseCallback: function(k_extOptions, k_success, k_extResponse) {
var
k_options = k_extOptions._kx,
k_ajax = kerio.lib.k_ajax,
k_errorMessages = k_options.k_errorMessages,
k_appCallbackWasCalled = false,
k_response,
k_isTimeout;
if (null === k_options.k_requestOwner) {
k_ajax._k_unregisterRequestWithoutOwner(k_extResponse.tId);
}
k_isTimeout = k_ajax._k_checkTimeout(k_extResponse, k_errorMessages.k_connectionTimeout, k_options.k_isTimeout);
if ('GET' === k_extOptions.method) {
k_response = k_ajax._k_buildBaseResponse(k_extOptions, k_success, k_extResponse);
k_response.k_isOk = k_success; if (k_isTimeout) {
k_response.k_decoded = kerio.lib.k_jsonDecode(k_extResponse.responseText);
k_appCallbackWasCalled = k_ajax._k_handleResponseError(k_response);
}
}
else {
try {
if (!k_isTimeout && true !== k_options.k_origConfig.k_isFileUpload) {
k_ajax._k_checkContentType(k_extResponse);
}
k_response = k_ajax._k_buildPostResponse(k_extOptions, k_success, k_extResponse);
k_appCallbackWasCalled = k_ajax._k_handleResponseError(k_response, k_options.k_isBatch);
}
catch (k_ex) {
kerio.lib.k_reportError(k_ex.name + ': ' + k_ex.message, 'ajax.js', k_ex.lineNumber, k_ex.stack);
return;
}
}
if (false === k_appCallbackWasCalled) {
k_ajax._k_callAppCallback.call(k_response); }
},

k_getCreatedItemId: function(k_response) {
var
k_decoded = k_response.k_decoded,
k_responseRoot;
if (k_response._k_appCallback.k_isBatch && k_decoded.result && 0 < k_decoded.result.length) {
k_responseRoot = k_decoded.result[0];
}
else {
k_responseRoot = k_decoded;
}
if (k_responseRoot.result) {
if (undefined !== k_responseRoot.result.id) {
return k_responseRoot.result.id;
}
if (k_responseRoot.result.result && k_responseRoot.result.result[0] && undefined !== k_responseRoot.result.result[0].id) {
return k_responseRoot.result.result[0].id;
}
}
return '-1';
},

_k_isApiMethodCreate: function(k_options) {
var
k_method,
k_commandList,
k_i, k_cnt;
if (!k_options.k_jsonRpc || !k_options.k_jsonRpc.method) {
return false;
}
k_method = k_options.k_jsonRpc.method.split('.');
k_method = k_method[1];
if (-1 !== this._k_apiMethodCreate.indexOf(k_method)) {
return true;
}
if ('Batch.run' === k_options.k_jsonRpc.method) {
k_commandList = k_options.k_jsonRpc.params.commandList;
for (k_i = 0, k_cnt = k_commandList.length; k_i < k_cnt; k_i++) {
k_method = k_commandList[k_i].method.split('.');
k_method = k_method[1];
if (-1 !== this._k_apiMethodCreate.indexOf(k_method)) {
return true;
}
}
}
return false;
},

_k_remoteDataCreated: function(k_response) {
if (this.k_remoteDataCreated) {
if (!kerio.lib.k_ajax._k_isErrorInResponse(k_response.k_decoded)) {
this.k_remoteDataCreated(k_response);
}
}
},

_k_checkTimeout: function(k_extResponse, k_errorMessage, k_isAbortedByTimeout) {
if (true === k_isAbortedByTimeout || -1 === k_extResponse.status || 0 === k_extResponse.status) {
k_extResponse.responseText = '{"error":{"code":' + this.k_TIMEOUT_ERROR_CODE
+',"message":"' + k_errorMessage	+ '"},"jsonrpc":"2.0","id":1}';
return true;
}
return false;
},

_k_checkContentType: function(k_extResponse) {
var
k_contentType = k_extResponse.getResponseHeader('Content-Type'),
k_responseText = k_extResponse.responseText;
if (!kerio.lib.k_ajax._k_contentTypeRegExp.test(k_contentType) && kerio.lib.k_ajax.k_FORBIDEN_HTTP_STATUS !== k_extResponse.status) {
k_responseText = k_extResponse.status + ' ' + k_responseText;
throw new kerio.lib.K_Error('Unexpected Content-Type: ' + k_contentType + ' '
+ Ext.util.Format.stripTags(k_responseText.substring(0, kerio.lib.k_ajax.k_WEBASSIST_MESSAGE_LENGTH)), 'ajax.js');
}
},

_k_buildBaseResponse: function(k_extOptions, k_success, k_extResponse) {
var
k_options = k_extOptions._kx,
k_response;
k_response = {
k_xhrResponse: k_extResponse,
_k_appCallback: {
k_callback: k_options.k_callback,
k_scope: k_options.k_scope,
k_callbackParams: k_options.k_callbackParams,
k_success: k_success,
k_firstStepRequest: k_options,
k_apiMethodScope: k_options.k_apiMethodScope,
k_origConfig: k_options.k_origConfig,
k_isBatch: k_options.k_isBatch
},
_k_httpProxyParams: { k_extOptions: k_extOptions,
k_extResponse: k_extResponse
}
};
return k_response;
},

_k_buildPostResponse: function(k_extOptions, k_success, k_extResponse) {
var
k_options = k_extOptions._kx,
k_responseText = k_extResponse.responseText,
k_isOk,
k_responseDecoded,
k_response,
k_result,
k_i, k_cnt,
k_commandResponse;
k_responseDecoded = kerio.lib.k_jsonDecode(k_responseText);
if (!k_responseDecoded || 'object' !== typeof k_responseDecoded) {  k_responseText = k_extResponse.status + ' ' + k_responseText;
if (200 == k_extResponse.status) {
throw new kerio.lib.K_Error('-32603 Invalid response. '
+ Ext.util.Format.stripTags(k_responseText.substring(0, kerio.lib.k_ajax.k_WEBASSIST_MESSAGE_LENGTH)), 'ajax.js');
}
else if (kerio.lib.k_ajax.k_FORBIDEN_HTTP_STATUS == k_extResponse.status) {
k_responseDecoded = {
error: {
code: kerio.lib.k_ajax.k_FORBIDEN_HTTP_STATUS,
message: kerio.lib.k_tr("403 Forbidden: You don't have permission to access the server.", 'wlibAlerts'),
messageParameters: {
positionalParameters: [],
plurality: 0
}
}
};
}
else {
throw new kerio.lib.K_Error('Unexpected http status: ' + k_extResponse.status + ' ' + k_extResponse.statusText, 'ajax.js');
}
}
if (undefined === k_responseDecoded.error && undefined === k_responseDecoded.result) {
throw new kerio.lib.K_Error('-32603 Invalid JSON-RPC2 response. '
+ Ext.util.Format.stripTags(k_responseText.substring(0, kerio.lib.k_ajax.k_WEBASSIST_MESSAGE_LENGTH)), 'ajax.js');
}
k_response = kerio.lib.k_ajax._k_buildBaseResponse(k_extOptions, k_success, k_extResponse);
k_isOk = undefined !== k_responseDecoded.result;
if (k_isOk && k_options.k_isBatch) {
k_result = k_responseDecoded.result;
for (k_i = 0, k_cnt = k_result.length; k_i < k_cnt; k_i++) {
k_commandResponse = k_responseDecoded.result[k_i];
if (k_commandResponse.error) {
k_isOk = false;
break;
}
}
}
kerio.lib._k_addKerioProperty(k_response.k_xhrResponse, {
k_decoded: k_responseDecoded  });
Ext.apply(k_response, {
k_isOk: k_isOk,
k_decoded: k_responseDecoded
});
return k_response;
},

_k_handleResponseError: function(k_response, k_isBatch) {
var
k_responseDecoded = k_response.k_decoded,
k_origConfig = k_response._k_appCallback.k_origConfig,
k_isError = false,
k_skipInternalErrorHandler = false;
if (k_responseDecoded.error && k_responseDecoded.error.data && k_responseDecoded.error.data.logoutURL) { window.onunload = Ext.emptyFn;
window.location = k_responseDecoded.error.data.logoutURL;
return false;
}
k_isError =  this._k_isErrorInResponse(k_responseDecoded);
if (k_isBatch && !k_isError) {
k_isError = this._k_isErrorInBatch(k_responseDecoded);
}
if (!k_isError) {
return false;
}
if (k_origConfig.k_onError) {
k_skipInternalErrorHandler = k_origConfig.k_onError.call(k_origConfig.k_scope,
k_response,
k_response._k_appCallback.k_success,
k_origConfig.k_callbackParams
);
}
if (!k_skipInternalErrorHandler && (!kerio.lib.k_isMyKerio || !k_responseDecoded.error || kerio.lib.k_ajax.k_MYKERIO_ERROR_CODE_APPLIANCE_COMMAND_TIMEOUT !== k_responseDecoded.error.code)) {
return kerio.lib.k_ajax._k_internalErrorHandler(k_response, k_isBatch);
}
return false;
},

_k_internalErrorHandler: function(k_response, k_isBatch) {
var
k_responseDecoded = k_response.k_decoded,
k_messages = [],
k_appCallbackWasCalled = false,
k_isFileUpload = k_response._k_appCallback.k_origConfig.k_isFileUpload,
k_result,
k_i, k_cnt;
if (false === this._k_checkResponseException(k_responseDecoded, k_isFileUpload)) {
return true; }
k_messages = this._k_getErrorMessages(k_responseDecoded);
if (k_isBatch && k_responseDecoded.result) {
k_result = k_responseDecoded.result;
k_cnt = k_result.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
this._k_checkResponseException(k_result[k_i]);
k_messages = k_messages.concat(this._k_getErrorMessages(k_result[k_i]));
}
}
if (k_messages.length > 0) {
k_appCallbackWasCalled = this._k_showErrorMessages(k_messages, k_response);  }
return k_appCallbackWasCalled;
}, 
_k_checkResponseException: function (k_responseDecoded, k_isFileUpload) {
var
k_errorCode,
k_message;
k_isFileUpload = true === k_isFileUpload;
k_errorCode = k_responseDecoded.error && k_responseDecoded.error.code;
if (k_errorCode < 1000 && this.k_TIMEOUT_ERROR_CODE != k_errorCode) {  if (this.k_EXPIRED_SESSION_ERROR_CODE == k_errorCode) { if (kerio.lib.k_isMyKerio) {
window.document.location.reload(true);
return false;
}
document.location = './login/?reason=expired' + kerio.lib.k_getHash();
return false;
}
if (kerio.lib.k_ajax.k_FORBIDEN_HTTP_STATUS != k_errorCode && (413 != k_errorCode || !k_isFileUpload)) {
k_message = this._k_translateErrorMessage(k_responseDecoded.error);
throw new kerio.lib.K_Error('Unexpected response: ' + k_responseDecoded.error.code + ' ' + k_message, 'ajax.js');
}
}
},

_k_isErrorInBatch: function (k_responseDecoded) {
var
k_result = k_responseDecoded.result,
k_i, k_cnt,
k_commandResponse;
for (k_i = 0, k_cnt = k_result.length; k_i < k_cnt; k_i++) {
k_commandResponse = k_responseDecoded.result[k_i];
if (this._k_isErrorInResponse(k_commandResponse)) {
return true;
}
}
return false;
},

_k_isErrorInResponse: function (k_responseDecoded) {
var k_result = k_responseDecoded.result;
return Boolean((k_responseDecoded.error || (k_result && k_result.errors && 0 < k_result.errors.length)));
},

_k_onRequestExceptionHandler: function (k_connection, k_extResponse, k_extOptions) {
var
k_errorMessages = (k_extOptions._kx && k_extOptions._kx.k_errorMessages) ? k_extOptions._kx.k_errorMessages : null,
k_lib = kerio.lib;
if ('GET' !== k_extOptions.method || !k_errorMessages) {
return;
}
if (-1 === k_extResponse.status || 0 === k_extResponse.status) {
return;
}
if ('' !== k_errorMessages.k_invalidResponse) {
k_lib.k_alert({
k_title: k_lib.k_tr('Error', 'wlibAlerts'),
k_msg: k_errorMessages.k_invalidResponse,
k_icon: 'ERROR'
});
}
},

_k_callAppCallback: function() {
var
k_ajax = kerio.lib.k_ajax,
k_response = this, k_appCallback = k_response._k_appCallback,
k_responseDecoded = k_response.k_decoded,
k_i, k_cnt,
k_commandResponse;
if (k_appCallback.k_apiMethodScope) {
k_ajax._k_remoteDataCreated.call(k_appCallback.k_apiMethodScope, k_response);
}
if ('GET' !== k_appCallback.k_origConfig.k_method && k_responseDecoded) {
if (undefined !== k_responseDecoded.result) {
k_responseDecoded = k_responseDecoded.result;
}
else {
k_responseDecoded = k_responseDecoded.error;
}
k_response.k_decoded = k_responseDecoded;
k_response.k_xhrResponse._kx.k_decoded = k_responseDecoded;
if (k_appCallback.k_isBatch) {
for (k_i = 0, k_cnt = k_responseDecoded.length; k_i < k_cnt; k_i++) {
k_commandResponse = k_responseDecoded[k_i];
k_responseDecoded[k_i] = k_commandResponse.result || k_commandResponse.error;
}
}
}
if (k_appCallback.k_origConfig.k_isFileUpload && !k_appCallback.k_origConfig.k_isOneStepUpload && k_response.k_isOk) {
k_ajax._k_fileUploadSecondStep(k_response);
return;
}
if (k_appCallback.k_callback) {
k_appCallback.k_callback.call(
k_appCallback.k_scope, k_response, k_appCallback.k_success, k_appCallback.k_callbackParams
);
}
if (k_responseDecoded && k_responseDecoded.fileDownload) {
if (undefined === k_responseDecoded.operationProgress || 100 === k_responseDecoded.operationProgress) {
k_ajax._k_fileDownloadSecondStep(k_responseDecoded.fileDownload.url);
}
}
},

_k_fileDownloadSecondStep: function (k_fileUrl) {
if (!k_fileUrl) {
throw new kerio.lib.K_Error('-32603 Invalid response. The response doesn\'t contain property \'url\' of FileDownload object.', 'ajax.js');
}
if (kerio.lib.k_isMyKerio) {
k_fileUrl = this.k_changeDownloadUrlForMyKerio(k_fileUrl);
}
kerio.lib.k_ajax.k_request({
_k_isDataExport: true,
k_url: k_fileUrl
});
},

k_changeDownloadUrlForMyKerio: function (k_fileUrl) {
if (!kerio.lib.k_isMyKerio) {
return k_fileUrl;
}
var
k_myKerioDefaultParams = this._k_myKerioDefaultParams,
k_INSTANCE_ID = k_myKerioDefaultParams.k_INSTANCE_ID_PARAM_NAME,
k_headers = k_myKerioDefaultParams.k_headers,
k_url = this._k_defaultRequestParams.k_url,
k_urlParts = k_url.split('/'),
k_searchDelimeter = '?',
k_host,
k_instanceIdValue,
k_i, k_cnt;
k_host = k_urlParts[0] + '//' + k_urlParts[2];
if (-1 !== k_fileUrl.indexOf(k_searchDelimeter)) {
k_searchDelimeter = '&';
}
if (this._k_instaceIdValue) {
k_instanceIdValue = this._k_instaceIdValue;
}
else {
for (k_i = 0, k_cnt = k_headers.length; k_i < k_cnt; k_i++) {
if (k_INSTANCE_ID === k_headers[k_i].name) {
k_instanceIdValue = k_headers[k_i].value;
this._k_instaceIdValue = k_instanceIdValue;
break;
}
}
}
return k_host + k_fileUrl + k_searchDelimeter + k_INSTANCE_ID + '=' + k_instanceIdValue;
},

_k_fileUploadSecondStep: function(k_response) {
var
k_origConfig = k_response._k_appCallback.k_origConfig,
k_fileUpload = k_response.k_decoded.fileUpload;
if (!k_fileUpload || undefined === k_fileUpload.id) {
throw new kerio.lib.K_Error('-32603 Invalid response. The response doesn\'t contain fileUpload object.', 'ajax.js');
}
k_origConfig.k_jsonRpc = kerio.lib.k_cloneObject(k_origConfig.k_jsonRpc, {params: {fileId: k_fileUpload.id}});
delete k_origConfig.k_form;
delete k_origConfig.k_isFileUpload;
k_origConfig.k_callbackParams = Ext.apply(k_origConfig.k_callbackParams || {}, {k_fileId: k_fileUpload.id});
kerio.lib.k_ajax.k_request(k_origConfig);
},

_k_getErrorMessages: function(k_response) {
var
k_messages = [],
k_errorList,
k_i, k_cnt;
if (k_response.error) {
k_messages.push(k_response.error);
} else if (k_response.result && k_response.result.errors && k_response.result.errors.length > 0){
k_errorList = k_response.result.errors;
for (k_i = 0, k_cnt = k_errorList.length; k_i < k_cnt; k_i++) {
k_messages.push(k_errorList[k_i]);
}
}
return k_messages;
}, 
_k_translateErrorMessage: function(k_errorMessage) {
var
k_options = {},
k_messageParameters = k_errorMessage.data ? k_errorMessage.data.messageParameters || {} : k_errorMessage.messageParameters || {},
k_args = k_messageParameters.positionalParameters,
k_pluralityBy = k_messageParameters.plurality,
k_message = k_errorMessage.message;
if (k_args) {
k_options.k_args = k_args;
}
if (k_pluralityBy) {
k_options.k_pluralityBy = k_pluralityBy;
}
return kerio.lib.k_tr(k_message, 'serverMessage', k_options);
}, 
_k_alertError: function(k_errorMsgList, k_response) {
var
k_tr = kerio.lib.k_tr,
k_returnValue = false,
k_errorMessage,
k_composedMessage = [],
k_composedReport = [],  k_i,
k_cnt = k_errorMsgList.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_errorMessage = k_errorMsgList[k_i];
if ('object' === typeof k_errorMessage) {
k_composedMessage.push(this._k_translateErrorMessage(k_errorMessage));
}
else {
k_composedReport.push('Internal error: k_alertError called with unsupported error message!');
}
}
if (k_composedReport.length > 0) {
kerio.lib.k_reportError(k_composedReport.join('<br>'), 'ajax.js');
}
if (k_composedMessage.length > 0) {
kerio.lib.k_alert({
k_title: k_tr('Error', 'wlibAlerts'),
k_msg: k_composedMessage.join('<br>'),
k_icon: 'ERROR',
k_callback: this._k_callAppCallback,
k_scope: k_response
});
k_returnValue = true;
}
return k_returnValue;
}, 
_k_showErrorMessages: function(k_messages, k_response) {
var
k_errorMsgList = [],
k_tr = kerio.lib.k_tr,
k_i, k_cnt;
k_cnt = k_messages.length;
switch (k_cnt) {
case 0:
k_errorMsgList[0] = k_tr('Unknown error!<br>No error message received.', 'wlibAlerts');
break;
case 1: case 2: case 3:
for (k_i = 0; k_i < k_cnt; k_i++) {
k_errorMsgList.push(k_messages[k_i]);
}
break;
default:
k_errorMsgList.push(k_messages[0]);
k_errorMsgList.push(k_messages[1]);
k_errorMsgList.push({
message: k_tr('There [is|are] another %1 error [message|messages]!', 'wlibAlerts', {k_args: [k_cnt - 2], k_pluralityBy: k_cnt - 2})
});
break;
}
return this._k_alertError(k_errorMsgList, k_response);
},  
_k_getSubmitForm: function () {
var k_form = this._k_submitForm;
if (!k_form) {
k_form = Ext.DomHelper.append(document.body, {
tag: 'form',
method: 'post',
style: 'display: none;'
});
this._k_submitForm = k_form;
}
return k_form;
},

k_getDefaultRequestParams: function () {
return this._k_defaultRequestParams;
},

k_setDefaultRequestParams: function (k_params) {
this._k_defaultRequestParams = k_params;
},

k_setDefaultOwner: function(k_owner) {
this._k_defaultOwner = k_owner;
},

_k_registerRequest: function(k_transaction, k_requestOwner) {
if (null === k_requestOwner) {
kerio.lib.k_ajax._k_unregisteredRequestsStack.push(k_transaction);
}
if (undefined === k_requestOwner) {
k_requestOwner = kerio.lib._k_windowManager.k_getActiveWindow(true) || this._k_defaultOwner;
}
if (k_requestOwner) {
if (k_requestOwner._k_ajaxRequestStack) {
k_requestOwner._k_ajaxRequestStack.push(k_transaction);
}
else {
kerio.lib.k_reportError('Internal error: kerio.lib.k_ajax::_k_registerRequest() expects _k_ajaxRequestStack property!', 'ajax.js');
}
}
},

_k_unregisterRequestWithoutOwner: function(k_transactionId) {
var
k_unregisteredRequestsStack = this._k_unregisteredRequestsStack,
k_cnt = k_unregisteredRequestsStack,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_unregisteredRequestsStack[k_i].tId === k_transactionId) {
k_unregisteredRequestsStack.splice(k_i, 1);
break;
}
}
},

k_abortAllPendingRequests: function(k_owner, k_abortUnregistered) {
var
k_extAjax = Ext.lib.Ajax,
k_stack = k_owner._k_ajaxRequestStack,
k_cnt = k_stack.length,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_extAjax.abort.call(k_extAjax, k_stack[k_i]);
}
k_owner._k_ajaxRequestStack = [];
if (true === k_abortUnregistered) {
k_stack = kerio.lib.k_ajax._k_unregisteredRequestsStack;
k_cnt = k_stack.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_extAjax.abort.call(k_extAjax, k_stack[k_i]);
}
kerio.lib.k_ajax._k_unregisteredRequestsStack = [];
}
},

_k_doFileDownload: function (k_url) {
var
k_iframeId = 'k_fileDownloadIframe',
k_params = '',
k_urlParams,
k_qMarkPos,
k_i,
k_cnt,
k_param,
k_form,
k_iFrame;
k_form = this._k_fileDownloadForm;
if (!k_form) {
k_form = Ext.DomHelper.append(document.body, {
tag: 'form',
method: 'GET',
target: k_iframeId,
style: 'display: none;',
id: 'k_fileDownloadForm'
});
k_iFrame = Ext.DomHelper.append(document.body, {
tag: 'iframe',
style: 'display: none;',
id: k_iframeId,
name: k_iframeId
});
if(Ext.isIE) {
k_iFrame.src = Ext.SSL_SECURE_URL;
document.frames[k_iframeId].name = k_iframeId;
}
this._k_fileDownloadForm = k_form;
}
k_form.innerHTML = '';
k_qMarkPos = k_url.indexOf('?');
if (k_qMarkPos > -1) {
k_urlParams = k_url.substr(k_qMarkPos + 1).split('&');
for (k_i = 0, k_cnt = k_urlParams.length; k_i < k_cnt; k_i++) {
k_param = k_urlParams[k_i].split('=');
k_params += '<input type="hidden" name="' + k_param[0] + '" value="' + k_param[1] + '" >\n';
}
k_form.innerHTML = k_params;
}
k_form.action = k_url;
k_form.submit();
},

k_getFile: function(k_url) {
this._k_doFileDownload(k_url);
}
};
Ext.Ajax.on('requestexception', kerio.lib.k_ajax._k_onRequestExceptionHandler, kerio.lib.k_ajax);


kerio.lib._K_HttpProxy = function (k_requestCfg) {
k_requestCfg = k_requestCfg || {};
kerio.lib._K_HttpProxy.superclass.constructor.call(this, {
url: k_requestCfg.k_url || kerio.lib.k_ajax._k_defaultRequestParams.k_url
});
kerio.lib._k_addKerioProperty(this, {k_requestCfg: k_requestCfg});
this.useAjax = true;
};
Ext.extend(kerio.lib._K_HttpProxy, Ext.data.HttpProxy,
{

getConnection: function() {
return kerio.lib.k_ajax;
},

doRequest : function(action, rs, k_params, k_reader, k_callback, k_scope, k_arg) {
var
k_ajax = kerio.lib.k_ajax,
k_relatedWidget,
k_options;
k_options = {
k_jsonRpc: k_params || {},
k_scope: this,
k_callback: this.createCallback(action, rs),
k_requestOwner: this._kxp._k_getRequestOwner.call(this),
k_httpProxyLoadResponseParams: {
k_request: {
callback: k_callback,
scope: k_scope,
arg: k_arg
},
k_reader: k_reader
}
};
Ext.applyIf(k_options, this._kx.k_requestCfg);
if (this.activeRequest[action]) {
k_ajax.k_abort(this.activeRequest[action]);
k_relatedWidget = this._kx.k_requestCfg.k_dataStore.k_relatedWidget;
if (k_relatedWidget instanceof kerio.lib.K_Grid) {
k_relatedWidget.k_showLoadingMask(false);
}
}
this.activeRequest[action] = k_ajax.k_request(k_options);
},

createCallback: function(action, rs) {
return function(o, success, response) {
var
k_httpProxyParams,
k_loadResponseParams;
k_httpProxyParams = o._k_httpProxyParams;
k_loadResponseParams = k_httpProxyParams.k_extOptions._kx.k_httpProxyLoadResponseParams;
response = k_httpProxyParams.k_extResponse;
o = {
reader: k_loadResponseParams.k_reader,
request: k_loadResponseParams.k_request
};
this.activeRequest[action] = undefined;
if (!success) {
if (action === Ext.data.Api.actions.read) {
this.fireEvent('loadexception', this, o, response);
}
this.fireEvent('exception', this, 'response', action, o, response);
o.request.callback.call(o.request.scope, null, o.request.arg, false);
return;
}
if (action === Ext.data.Api.actions.read) {
this.onRead(action, o, response);
} else {
this.onWrite(action, o, response, rs);
}
};
}
});
kerio.lib._K_HttpProxy.prototype._kxp = Ext.apply({}, kerio.lib._K_HttpProxy.prototype._kxp, {

_k_getRequestOwner: function() {
var
k_relatedWidget = this._kx.k_requestCfg.k_dataStore.k_relatedWidget,
k_requestOwner = this._kx.k_requestOwner,
k_hasFullPath;
if (!k_requestOwner && k_relatedWidget) {
k_hasFullPath = Boolean(k_relatedWidget._k_fullPath);
k_requestOwner = k_relatedWidget.k_getMainWidget();
if (!k_hasFullPath) {
k_relatedWidget.k_resetFullPath();
}
if (k_requestOwner) {
kerio.lib._k_addKerioProperty(this, {k_requestOwner: k_requestOwner});
}
}
return k_requestOwner;
}
});


kerio.lib._K_DataStore = function(k_owner, k_config) {
var
k_isAutoLoaded,
k_localData = k_config.k_localData,
k_remoteData = k_config.k_remoteData;
this._k_setStoredProperties([
{'k_sorting': 'k_sorting'},
{'k_remoteData.k_jsonRpc': 'k_jsonRpc'},
{'k_remoteData.k_startParamName': 'k_startParamName'},
{'k_remoteData.k_limitParamName': 'k_limitParamName'},
{'k_remoteData.k_bufferSize': 'k_bufferSize'},
{'k_remoteData.k_preBufferLimit': 'k_preBufferLimit'},
{'k_remoteData.k_onError': 'k_onError'}
]);
this._k_owner = k_owner;  this.k_relatedWidget = k_owner;
this._k_lastRequestOptions = null;
this._k_isLocalData = (undefined === k_remoteData);
this._k_isQueryValueSent = (k_remoteData && (false !== k_remoteData.k_isQueryValueSent));
k_isAutoLoaded = (undefined !== k_localData);
if (!this._k_isLocalData) {
k_isAutoLoaded = (undefined === k_remoteData.k_isAutoLoaded) ? true : k_remoteData.k_isAutoLoaded;
this._k_isBuffered = true === k_remoteData.k_isBuffered;
}
this._k_isAutoLoaded = k_isAutoLoaded;
this._k_initPaging(k_config);
this._k_createReaderProxy(k_config);
this._k_additionalSortColumnsList = {};
kerio.lib._K_DataStore.superclass.constructor.call(this, k_config);
kerio.lib._k_addKerioProperty(this.k_extWidget, {
k_relatedWidget: this.k_relatedWidget
});
var k_dataStore = this.k_extWidget;
k_dataStore.on('add'   , this._k_onDataStoreChanged, this);
k_dataStore.on('update', this._k_onDataStoreChanged, this);
k_dataStore.on('remove', this._k_onDataStoreChanged, this);
if (k_localData && k_localData.length > 0) {
this._k_setProxyData(k_localData);
this.k_reloadData();
}
};
Ext.extend(kerio.lib._K_DataStore, kerio.lib._K_BaseComponent,
{










k_DEFAULT_PAGE_SIZE: 50,
k_MAX_PAGE_SIZE: 999999,
_k_isOrderChangedColumnName: 'isOrderChanged',
_k_propertiesMapping: {
_k_isRemoteSort: 'remoteSort',
_k_isRemoteGroup: 'remoteGroup',
_k_groupField: 'groupField',
k_onLoadException: {k_extName: 'loadexception', k_listener: 'this._k_onLoadException', k_scope: 'this'},
k_onLoad:          {k_extName: 'load'         , k_listener: 'this._k_onLoad'         , k_scope: 'this'}
},

_k_jsonReaderDefaults: {
root: 'data',
totalProperty: 'totalItems'
},

_k_jsonReaderMapping: {
k_root: 'root',
k_totalProperty: 'totalProperty'
},

_k_recordMapping: {
k_columnId: 'name',
k_mapping: 'mapping'
},

_k_createReaderProxy: function(k_config) {
var
k_lib = kerio.lib,
k_recordsCfg = k_config.k_record,
k_cnt = k_recordsCfg.length,
k_remoteData = k_config.k_remoteData,
k_idColumnExists = false,
k_extJsonReaderCfg,
k_extRecordCfg,
k_primaryKey,
k_recordCfg,
k_idIndex,
k_reader,
k_proxy,
k_i;
k_extRecordCfg = k_lib._k_createConfig.call(this, k_recordsCfg, null, this._k_recordMapping);
for (k_i = 0; k_i < k_cnt; k_i++) {
k_recordCfg = k_recordsCfg[k_i];
if ('id' === k_recordCfg.k_columnId) {
k_idColumnExists = true;
k_idIndex = k_i;
}
if (true === k_recordCfg.k_isPrimaryKey) {
k_primaryKey = k_recordCfg.k_columnId;
k_idIndex = k_i;
break;
}
}
if (k_idColumnExists && !k_primaryKey) {
k_primaryKey = 'id';
}
this._k_primaryKey = k_primaryKey;
if (this._k_isLocalData) {
k_proxy = new k_lib._K_BufferedMemoryProxy([]);  k_reader = new Ext.data.ArrayReader({
idProperty: k_primaryKey,
idIndex: k_idIndex
}, k_extRecordCfg);
}
else { k_proxy = new kerio.lib._K_HttpProxy({
k_url: k_remoteData.k_url,
k_timeout: k_remoteData.k_timeout,
k_onError: k_remoteData.k_onError ? this._k_onErrorHandler : undefined,
k_dataStore: this  });
k_proxy.on('beforeload', this._k_onBeforeLoadProxy, this);
k_extJsonReaderCfg = k_lib._k_createConfig.call(this, k_remoteData, this._k_jsonReaderDefaults, this._k_jsonReaderMapping);
k_extJsonReaderCfg.idProperty = k_primaryKey;
k_reader = new Ext.data.JsonReader(k_extJsonReaderCfg, k_extRecordCfg);
this._k_dataSourceRoot = k_extJsonReaderCfg.root;
this._k_totalProperty = k_extJsonReaderCfg.totalProperty;
}
this._k_reader = k_reader;
this._k_proxy = k_proxy;
this._k_jsonDescriptionDefinitions = k_extRecordCfg;
}, 
_k_onErrorHandler: function () {
var k_dataStore = this._kx.k_requestCfg.k_dataStore;
return k_dataStore._k_storedConfig.k_onError.apply(k_dataStore._k_owner || k_dataStore, arguments);
},

_k_prepareConfig: function(k_config) {
var
k_sortingCfg = k_config.k_sorting,
k_groupingCfg = k_config.k_grouping,
k_isRemoteSort = false,
k_isRemoteGroup = false;
if (k_config.k_remoteData) {
k_isRemoteSort = true;
if (k_sortingCfg && undefined !== k_sortingCfg.k_isRemoteSort) {
k_isRemoteSort = k_sortingCfg.k_isRemoteSort;
}
if (k_groupingCfg) {
k_isRemoteGroup = true;
if (undefined !== k_groupingCfg.k_isRemoteGroup) {
k_isRemoteGroup = k_groupingCfg.k_isRemoteGroup;
}
}
}
if (k_groupingCfg) {
k_config._k_groupField = k_groupingCfg.k_columnId;
k_config._k_isRemoteGroup = k_isRemoteGroup;
}
k_config._k_isRemoteSort = k_isRemoteSort;
return k_config;
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
K_extDataStoreConstructor,
k_dataStore;
Ext.apply(k_adaptedConfig,{
proxy: this._k_proxy,
reader: this._k_reader
});
if (k_adaptedConfig.hasOwnProperty('groupField')) {  K_extDataStoreConstructor = Ext.data.GroupingStore;
}
else {
if (this._k_isBuffered) {
K_extDataStoreConstructor = kerio.lib._K_BufferedDataStore;
if (k_storedConfig.k_startParamName) {
k_adaptedConfig.k_startParamName = k_storedConfig.k_startParamName;
}
if (k_storedConfig.k_limitParamName) {
k_adaptedConfig.k_limitParamName = k_storedConfig.k_limitParamName;
}
if (undefined !== k_storedConfig.k_preBufferLimit) {
k_adaptedConfig.k_preBufferLimit = k_storedConfig.k_preBufferLimit;
}
if (undefined !== k_storedConfig.k_bufferSize) {
k_adaptedConfig.k_bufferSize = k_storedConfig.k_bufferSize;
}
}
else {
K_extDataStoreConstructor = Ext.data.Store;
}
}
this._k_isSortable = !!k_storedConfig.k_sorting;
if (this._k_isSortable) {
k_adaptedConfig.sortInfo = {
field: k_storedConfig.k_sorting.k_columnId,
direction: false === k_storedConfig.k_sorting.k_isAscending ? 'DESC' : 'ASC'
};
}
this._k_removeStoredProperties([
'k_sorting',
'k_startParamName',
'k_limitParamName',
'k_bufferSize',
'k_preBufferLimit'
]);
if (k_storedConfig.k_jsonRpc) {
this._k_baseRequestParams = kerio.lib._k_cloneObject(k_storedConfig.k_jsonRpc);
this._k_removeStoredProperties(['k_jsonRpc']);
}
k_dataStore = new K_extDataStoreConstructor(k_adaptedConfig);
k_dataStore.on('beforeload', this._k_onBeforeLoadStore, this);
this._k_dataStore = k_dataStore;
return k_dataStore;
}, 
_k_onBeforeLoadStore: function (k_extDataStore, k_options) {
var
k_params = k_options.params || {},
k_baseRequestParams = this._k_baseRequestParams || {},
k_lastRequestParams = this.k_getLastRequestParams() || {};
if (this._k_autoLoadRequestParams) {
k_params = Ext.applyIf(k_params, this._k_autoLoadRequestParams);
delete this._k_autoLoadRequestParams;
}
if (k_params.hasOwnProperty('params') && !Ext.isObject(k_params.params)) {
delete k_params.params;
}
k_params = kerio.lib.k_cloneObject(k_baseRequestParams, k_params, {k_replaceExisting: true, k_removeUndefinedProperties: true});
k_params = kerio.lib.k_cloneObject(k_params, k_lastRequestParams, {k_replaceExisting: false, k_removeUndefinedProperties: true});
if (k_params.params && k_lastRequestParams.params) {
k_params.params = kerio.lib.k_cloneObject(k_params.params, k_lastRequestParams.params, {k_replaceExisting: false, k_removeUndefinedProperties: true});
}
if (k_params.params) {
if (k_params.params.hasOwnProperty('fromLine') || k_params.params.hasOwnProperty('countLines')) {
k_params.fromLine = k_params.params.fromLine;
k_params.countLines = k_params.params.countLines;
}
if (k_params.query) {
k_params.params.query = k_params.query;
}
if (k_params.params.params) {  delete k_params.params.params;
}
}
k_options.params = k_params;
this.k_setLastRequestParams(kerio.lib._k_cloneObject(k_params));
},

_k_onBeforeLoadProxy: function(k_proxy, k_params) {
if (!this._k_isLocalData) {
k_params = this._k_prepareRequestParams(k_params);
}
},

_k_prepareRequestParams: function (k_params, k_storeParams) {
var
k_store = this._k_dataStore,
k_isQueryValueNeeded = false,
k_isOrderByNeeded = false,
k_sharedConstants = kerio.lib.k_getSharedConstants(),
k_transformedParams = {},
k_isRemoteSort = true === k_store.remoteSort,
k_query = (k_params.params && k_params.params.query) || {},
k_orderBy = [],
k_sortInfo = undefined !== k_store.sortInfo ? k_store.sortInfo : false,
k_lib = kerio.lib,
k_orderByColumnName,
k_orderByDirection,
k_encodedParams,
k_additionalSortColumns,
k_i;
if (this._k_isQueryValueSent) {
k_isOrderByNeeded = k_isRemoteSort && ((undefined !== k_params.dir) || (undefined !== k_params.sort) || k_sortInfo);
k_isQueryValueNeeded = k_isOrderByNeeded || (undefined !== k_params.start) || (undefined !== k_params.limit);
if (k_isQueryValueNeeded) {
k_query.start = k_params.start;
k_query.limit = k_params.limit;
if (k_isOrderByNeeded) {
if (k_sortInfo) {
k_orderByColumnName = k_sortInfo.field;
k_orderByDirection = k_sortInfo.direction;
}
else {
k_orderByColumnName = k_params.sort;
k_orderByDirection = k_params.dir;
}
k_orderByDirection = 'ASC' === k_orderByDirection ? k_sharedConstants.kerio_web_Asc : k_sharedConstants.kerio_web_Desc;
k_orderBy[0] = {
columnName: k_orderByColumnName,
direction: k_orderByDirection
};
k_additionalSortColumns = this._k_additionalSortColumnsList[k_orderByColumnName];
if (undefined !== k_additionalSortColumns) {
for (k_i = 0; k_i < k_additionalSortColumns.length; k_i++) {
k_orderBy.push({
columnName: k_additionalSortColumns[k_i],
direction: k_orderByDirection
});
}
}
k_query.orderBy = k_orderBy;
}
k_query = k_lib.k_removeUndefinedProperties(k_query);
k_params.query = k_query;
}
}
k_params = Ext.applyIf(k_params || {}, k_params.params);
delete k_params.params;
if (false !== k_storeParams) {
this.k_extWidget.storeOptions({
params: k_params
});
}
k_transformedParams = k_lib._k_cloneObject(k_params);
delete k_transformedParams.start;
delete k_transformedParams.limit;
delete k_transformedParams.sort;
delete k_transformedParams.dir;
delete k_transformedParams.method;
delete k_transformedParams.object;
delete k_transformedParams.groupBy;
delete k_transformedParams.groupDir;
if (!this._k_isQueryValueSent && k_transformedParams.query) {
delete k_transformedParams.query;
}
k_encodedParams = Ext.encode(k_transformedParams);
if (!('{}' === k_encodedParams)) { k_params.params = k_encodedParams;
}
k_params.params = k_transformedParams;
return k_params;
},

_k_initPaging: function(k_config) {
var
k_pageSize = k_config.k_pageSize,
k_isPaging = k_pageSize ? true : false,
k_startParamName = k_config.k_remoteData ? k_config.k_remoteData.k_startParamName || 'start' : 'start',
k_limitParamName = k_config.k_remoteData ? k_config.k_remoteData.k_limitParamName || 'limit' : 'limit',
k_autoLoadRequestParams = {};
if (!k_isPaging) {
k_pageSize = this.k_MAX_PAGE_SIZE;
}
else if (true === k_pageSize) {
k_pageSize = this.k_DEFAULT_PAGE_SIZE;
}
if (!this._k_isLocalData) {
k_autoLoadRequestParams[k_startParamName] = 0;
k_autoLoadRequestParams[k_limitParamName] = -1;
}
if (k_isPaging) {
if (!k_autoLoadRequestParams.query) {
k_autoLoadRequestParams.query = {};
}
k_autoLoadRequestParams[k_limitParamName] = k_pageSize;
}
this.k_pageSize = k_pageSize;
this._k_isPaging = k_isPaging;
this._k_autoLoadRequestParams = k_autoLoadRequestParams;
}, 
_k_onLoad: function(k_extStore, k_extRecords, k_options) {
this._k_mappedListeners.k_onLoad.call(this.k_relatedWidget, this.k_relatedWidget, k_options, this._k_reader.jsonData);
},

_k_onLoadException: function(k_extHttpProxy, k_callbackParams, k_response, k_extException) {
if (200 != k_response.status) {
return;
}
this._k_mappedListeners.k_onLoadException.call(this.k_relatedWidget, this.k_relatedWidget, k_response);
},

_k_onDataStoreChanged: function(k_extStore, k_extRecords) {
if (!this._k_moveRecordsInAction) {
kerio.lib.k_notify(this.k_relatedWidget, kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED);
}
},

k_getRowsCount: function(k_returnTotalCount) {
var k_count;
if (this._k_isLocalData || (true !== k_returnTotalCount)) {
k_count = this.k_extWidget.getCount();
}
else {
k_count = this.k_extWidget.getTotalCount();
}
return k_count;
},

_k_mapDataObjectToArray: function (k_dataObject) {
var k_jsonDesc = this._k_jsonDescriptionDefinitions,
k_arrayData = [],
k_i, k_cnt = k_jsonDesc.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_arrayData.push(k_dataObject[k_jsonDesc[k_i].name]);
}
return k_arrayData;
},

k_getData: function () {
var
k_data = [],
k_storeItems = this.k_extWidget.data.items,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_storeItems.length; k_i < k_cnt; k_i++) {
k_data[k_i] = k_storeItems[k_i].data;
}
return k_data;
},

k_setData: function(k_data, k_append, k_mapping) {
var
k_dataStore = this._k_dataStore,
k_rowRecords = [],
k_itemName,
k_record,
k_row,
k_cnt,
k_i;
k_append = (true === k_append);
if (!k_append) {
this.k_clearData();
}
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_row = k_data[k_i];
if ('object' === Ext.type(k_mapping)) {
for (k_itemName in k_mapping) {
k_row[k_mapping[k_itemName]] = k_row[k_itemName];
}
}
k_record = this._k_createRowRecord(k_row);
k_rowRecords.push(k_record);
}
k_dataStore.add(k_rowRecords);
if (this._k_isLocalData) { if (this._k_isSortable) {
if (k_dataStore.hasMultiSort) {
k_dataStore.multiSort(k_dataStore.multiSortInfo.sorters, k_dataStore.multiSortInfo.direction);
}
else {
k_dataStore.singleSort(k_dataStore.sortInfo.field, k_dataStore.sortInfo.direction);
}
}
this._k_setProxyData(k_data, k_append);
}
},

_k_setProxyData: function (k_data, k_append) {
var
k_proxy = this._k_proxy,
k_newData = [],
k_i, k_cnt;
if (k_data.length > 0 && 'object' === Ext.type(k_data[0])) {
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_newData.push(this._k_mapDataObjectToArray(k_data[k_i]));
}
}
else {
k_newData = k_data;
}
k_proxy.data = k_append ? k_proxy.data.concat(k_newData) : k_newData;
},

k_clearData: function (k_totalLength) {
var k_extDataStore = this.k_extWidget;
k_extDataStore.removeAll();
k_extDataStore.totalLength = undefined !== k_totalLength ? k_totalLength : 0; },

_k_createRowRecord: function(k_rowData) {
var
K_RowRecordTemplate = this.k_extWidget.recordType, k_fields,
k_i, k_cnt,
k_itemDesc;
if (k_rowData instanceof Array) {
k_rowData = this._k_remapData(k_rowData, this._k_jsonDescriptionDefinitions);
}
else {
k_rowData = kerio.lib.k_cloneObject(k_rowData);
}
k_fields = K_RowRecordTemplate.prototype.fields;
for (k_i = 0, k_cnt = k_fields.getCount(); k_i < k_cnt; k_i++) {
k_itemDesc = k_fields.itemAt(k_i);
if (undefined === k_rowData[k_itemDesc.name]) {
k_rowData[k_itemDesc.name] = k_itemDesc.defaultValue;
}
}
return new K_RowRecordTemplate(k_rowData, this._k_primaryKey ? k_rowData[this._k_primaryKey] : undefined);
}, 
k_addRow: function(k_rowData, k_targetRowIndex) {
var
k_dataStore = this._k_dataStore,
k_rowRecord = this._k_createRowRecord(k_rowData),
k_numberOfRows = k_dataStore.data.items.length;
if ((undefined !== k_targetRowIndex) && (k_numberOfRows > k_targetRowIndex)) {
k_dataStore.insert(k_targetRowIndex, k_rowRecord);
}
else {
k_dataStore.add(k_rowRecord);
}
},

k_reloadData: function(k_requestParams, k_forceCache) {
var
k_params = this.k_getLastRequestParams(),
k_options;
if (k_requestParams) {
k_params = Ext.apply(k_params || {}, k_requestParams);
}
k_options = {
params: {
params: k_params
}
};
if (this._k_isBuffered) {
this._k_dataStore.load(k_options, k_forceCache);
}
else {
this._k_dataStore.load(k_options);
}
},

k_updateRow: function(k_rowData, k_record, k_origRowIndex, k_targetRowIndex) {
var
k_extWidget = this.k_extWidget,
k_value,
k_field;
k_record.beginEdit();
for (k_field in k_rowData) {
k_value = k_rowData[k_field];
if (undefined !== k_value) {
k_record.set(k_field, k_value);
}
}
k_record.endEdit();
if (undefined !== k_targetRowIndex && k_targetRowIndex !== k_extWidget.indexOf(k_record)) {
k_extWidget.suspendEvents(true);
k_extWidget.remove(k_record);
k_extWidget.insert(k_targetRowIndex, k_record);
k_extWidget.resumeEvents();
}
},

k_getItemsCount: function() {
return this._k_dataStore.data.items.length;
},

k_appendRow: function(k_rowData) {
var k_targetRowIndex = this._k_dataStore.data.items.length;
this.k_addRow(k_rowData, k_targetRowIndex);
},

k_removeRow: function (k_record) {
this._k_dataStore.remove(k_record);
},

_k_remapData: function(k_data, k_mapVector) {
var k_remappedData = {},
k_currentData,
k_i,
k_cnt = k_mapVector.length,
k_currMap,
k_mapping;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_currMap = k_mapVector[k_i];
k_mapping = k_currMap.mapping;
if (undefined === k_mapping) {
k_mapping = k_i;
}
k_currentData = k_data[k_mapping];
if (k_currentData instanceof Object) {
k_remappedData[k_currMap.name] = kerio.lib.k_cloneObject(k_currentData);
}
else {
k_remappedData[k_currMap.name] = k_currentData;
}
}
return k_remappedData;
}, 
k_getLastRequestParams: function () {
var k_lastOptions = this._k_isBuffered ? this.k_extWidget.lastOptions : this._k_lastRequestOptions;
return k_lastOptions ? k_lastOptions.params || null : null;
},

k_setLastRequestParams: function (k_params) {
var k_lastOptions = (this._k_isBuffered ? this.k_extWidget.lastOptions : this._k_lastRequestOptions) || {};
if (this._k_isBuffered) {
k_lastOptions.params = k_params;
this.k_extWidget.storeOptions(k_lastOptions);  }
else {
this._k_lastRequestOptions = Ext.apply(k_lastOptions, {params: k_params});
}
},

k_abortCurrentRequest: function() {
var k_requestId = this._k_proxy.activeRequest.read;
if (k_requestId) {
kerio.lib.k_ajax.k_abort(k_requestId);
}
},

k_abortDelayedRequest: function() {
var k_delayedRequest = this.k_extWidget._kx.k_delayedRequest;
k_delayedRequest.cancel();
},

k_loadData: function (k_data, k_options, k_append) {
var
k_extDataStore = this.k_extWidget,
k_records = this._k_reader.readRecords(k_data);
if (undefined !== k_append) {
if (!k_options) {
k_options = {};
}
k_options.add = k_append;
}
k_extDataStore.loadRecords(k_records, k_options, true);
if (this._k_isBuffered) {
kerio.lib._k_addKerioProperty(k_extDataStore, {
k_buffer: {
k_data: k_extDataStore.data.items,
k_start: k_options.params[k_extDataStore._kx.k_startParamName],
k_limit: k_options.params[k_extDataStore._kx.k_limitParamName]
}
});
}
},

_k_onAdd: function (k_extDataStore, k_records, k_index) {
var
k_addedRecords = this._k_addedRecords,
k_record,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_records.length; k_i < k_cnt; k_i++) {
k_record = k_records[k_i];
k_addedRecords.add(k_record.id, k_record);
}
},

_k_onRemove: function (k_extDataStore, k_record, k_index) {
var
k_addedRecords = this._k_addedRecords,
k_removedRecords = this._k_removedRecords,
k_modifiedRecords = this._k_modifiedRecords;
if (k_addedRecords.containsKey(k_record.id)) {
k_addedRecords.remove(k_record);
}
else {
if (k_modifiedRecords.containsKey(k_record.id)) {
k_modifiedRecords.remove(k_record);
}
k_removedRecords.add(k_record.id, k_record);
}
},

_k_onUpdate: function (k_extDataStore, k_record, k_operation) {
var
k_addedRecords = this._k_addedRecords,
k_modifiedRecords = this._k_modifiedRecords;
if (Ext.data.Record.EDIT !== k_operation) {
return;
}
if (k_addedRecords.containsKey(k_record.id)) {
k_addedRecords.remove(k_record);
k_addedRecords.add(k_record.id, k_record);
}
else {
if (k_modifiedRecords.containsKey(k_record.id)) {
k_modifiedRecords.remove(k_record);
}
k_modifiedRecords.add(k_record.id, k_record);
}
},

_k_onClear: function (k_extDataStore) {
var
k_item,
k_i,
k_cnt;
this._k_addedRecords.clear();
this._k_modifiedRecords.clear();
for (k_i = 0, k_cnt = this.k_extWidget.data.getCount(); k_i < k_cnt; k_i++) {
k_item = this.k_extWidget.data.get(k_i);
this._k_removedRecords.add(k_item.id, k_item);
}
},

_k_getChangedRecordData: function (k_record) {
var
k_data = {},
k_recordData = k_record.data,
k_modifiedFields = k_record.modified,
k_isModified = false,
k_field;
for (k_field in k_modifiedFields) {
if (String(k_recordData[k_field]) !== String(k_modifiedFields[k_field])) {
k_data[k_field] = k_recordData[k_field];
k_isModified = true;
}
}
return k_isModified ? k_data : null;
},

_k_getRecordId: function (k_record) {
return k_record.id;
},

k_startTracing: function (k_resetTraceLog) {
var
k_extWidget = this.k_extWidget,
K_MixedCollection;
if (true === this._k_isTracing) {
return;
}
k_extWidget.on({
'add'   : this._k_onAdd,
'remove': this._k_onRemove,
'update': this._k_onUpdate,
scope: this
});
this._k_origExtRemoveAll = k_extWidget.removeAll;
k_extWidget.removeAll = k_extWidget.removeAll.createInterceptor(this._k_onClear, this);
if (false !== k_resetTraceLog) {
K_MixedCollection = Ext.util.MixedCollection;
if (!this._k_addedRecords) {
this._k_addedRecords    = new K_MixedCollection(false, this._k_getRecordId);
this._k_removedRecords  = new K_MixedCollection(false, this._k_getRecordId);
this._k_modifiedRecords = new K_MixedCollection(false, this._k_getRecordId);
this._k_movedRecords    = new K_MixedCollection(false, this._k_getRecordId);
}
else {
this._k_addedRecords.clear();
this._k_removedRecords.clear();
this._k_modifiedRecords.clear();
this._k_movedRecords.clear();
}
}
this._k_isTracing = true;
},

k_stopTracing: function () {
var k_extWidget;
if (!this._k_isTracing) {
return;
}
k_extWidget = this.k_extWidget;
k_extWidget.un('add'   , this._k_onAdd   , this);
k_extWidget.un('remove', this._k_onRemove, this);
k_extWidget.un('update', this._k_onUpdate, this);
k_extWidget.removeAll = this._k_origExtRemoveAll;
this._k_origExtRemoveAll = null;
this._k_isTracing = false;
},

k_isChanged: function () {
if (!this._k_addedRecords) {
if (kerio.lib._k_debugMode) {
kerio.lib.k_warn('K_DataStore.k_isChanged: Tracing of changes has not been enabled!');
}
return false;
}
return (0 < this._k_addedRecords.getCount())    ||
(0 < this._k_modifiedRecords.getCount()) ||
(0 < this._k_removedRecords.getCount())  ||
(0 < this._k_movedRecords.getCount());
},

_k_getRecordsData: function (k_recordCollection, k_updatedFieldsOnly) {
var
k_primaryKey = this._k_primaryKey,
k_data = [],
k_recordData,
k_record,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_recordCollection.getCount(); k_i < k_cnt; k_i++) {
k_record = k_recordCollection.itemAt(k_i);
if (true === k_updatedFieldsOnly) {
k_recordData = this._k_getChangedRecordData(k_record);
if (k_primaryKey) {
k_recordData[k_primaryKey] = k_record.data[k_primaryKey];
}
}
else {
k_recordData = k_record.data;
}
k_data.push(k_recordData);
}
return k_data;
},

_k_getRecordsPrimaryKeys: function (k_recordCollection) {
var
k_primaryKey = this._k_primaryKey,
k_data = [],
k_item,
k_i, k_cnt;
if (k_primaryKey) {
for (k_i = 0, k_cnt = k_recordCollection.getCount(); k_i < k_cnt; k_i++) {
k_item = {};
k_item[k_primaryKey] = k_recordCollection.itemAt(k_i).data[k_primaryKey];
k_data.push(k_item);
}
}
return k_data;
},

k_getChangedData: function (k_updatedFieldsOnly) {
var k_data;
k_data = {
k_added:    this._k_getRecordsData(this._k_addedRecords),
k_removed:  this._k_getRecordsData(this._k_removedRecords),
k_modified: this._k_getRecordsData(this._k_modifiedRecords, k_updatedFieldsOnly),
k_moved:    this._k_getRecordsPrimaryKeys(this._k_movedRecords)
};
return k_data;
},

k_getChangedDataForSet: function () {
var
k_records = this.k_extWidget.data,
k_recordsCount = k_records.getCount(),
k_data = [],
k_primaryKey = this._k_primaryKey,
k_isOrderChangedColumnName = this._k_isOrderChangedColumnName,
k_addedRecords = this._k_addedRecords,
k_movedRecords = this._k_movedRecords,
k_recordData,
k_record,
k_i;
for (k_i = 0; k_i < k_recordsCount; k_i++) {
k_record = k_records.itemAt(k_i);
if (!k_addedRecords.contains(k_record)) {
k_recordData = this._k_getChangedRecordData(k_record);
if (null === k_recordData) { k_recordData = {};
}
k_recordData[k_primaryKey] = k_record.data[k_primaryKey];
if (k_movedRecords.contains(k_record)) {
k_recordData[k_isOrderChangedColumnName] = true;
}
}
else {
k_recordData = k_record.data;
}
k_data.push(k_recordData);
}
return k_data;
},

k_moveRecords: function (k_records, k_step, k_compact) {
var
k_extWidget = this.k_extWidget,
k_recordsCount = k_records.length,
k_movedRecords = this._k_movedRecords,
k_targetRowIndexes = [],
k_originRowIndexes = [],
k_up = 0 > k_step,
k_isTracing = this._k_isTracing,
k_originRowIndex,
k_targetRowIndex,
k_recordIndex,
k_record,
k_i;
if (k_compact && k_recordsCount > 0) {
k_step = this._k_compactSelection(k_records, k_step);
}
for (k_i = 0; k_i < k_recordsCount; k_i++) {
k_record = k_records[k_i];
k_originRowIndexes.push(k_extWidget.indexOf(k_record));
}
k_originRowIndexes.sort(kerio.lib._k_sortNumbers);
if (false === k_up) {
k_originRowIndexes.reverse();
}
k_recordIndex = k_originRowIndexes[0];
if ((true === k_up) && (0 === k_recordIndex) ||
(true !== k_up) && ((this.k_getRowsCount() - 1) === k_recordIndex)) {
return [];
}
if (k_isTracing) {
k_extWidget.un('add'   , this._k_onAdd   , this);
k_extWidget.un('remove', this._k_onRemove, this);
}
this._k_moveRecordsInAction = true;
for (k_i = 0; k_i < k_recordsCount; k_i++) {
k_originRowIndex = k_originRowIndexes[k_i];
k_record = k_extWidget.getAt(k_originRowIndex);
k_targetRowIndex = k_originRowIndex + k_step;
k_extWidget.remove(k_record);
k_extWidget.insert(k_targetRowIndex, k_record);
if (k_isTracing) {
k_movedRecords.add(k_record.id, k_record);
}
k_targetRowIndexes.push(k_targetRowIndex);
}
this._k_moveRecordsInAction = false;
if (k_isTracing) {
k_extWidget.on({
'add'   : this._k_onAdd,
'remove': this._k_onRemove,
scope: this
});
}
return k_targetRowIndexes;
},

_k_compactSelection: function(k_records, k_step) {
var
k_extWidget = this.k_extWidget,
k_indexedRecords = [],
k_orderedIndexes = [],
k_orderedRecords = [],
k_offset = 1,
k_item,
k_index,
k_refIndex,
k_targetIndex,
k_localStep,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_records.length; k_i < k_cnt; k_i++) {
k_item = k_records[k_i];
k_index = k_extWidget.indexOf(k_item);
k_orderedIndexes.push(k_index);
k_indexedRecords.push({k_record: k_item, k_index: k_index});
}
k_orderedIndexes.sort(kerio.lib._k_sortNumbers);
for (k_i = 0, k_cnt = k_indexedRecords.length; k_i < k_cnt; k_i++) {
k_item = k_indexedRecords[k_i];
k_index = k_orderedIndexes.indexOf(k_item.k_index);
k_orderedRecords[k_index] = k_item;
}
k_indexedRecords = null;
k_orderedIndexes = null;
k_refIndex = k_orderedRecords[0].k_index;
k_targetIndex = k_refIndex + k_step;
for (k_i = 1, k_cnt = k_orderedRecords.length; k_i < k_cnt; k_i++) {
k_item = k_orderedRecords[k_i];
k_localStep = k_refIndex + k_offset - k_item.k_index;
if (0 !== k_localStep) {
this.k_moveRecords([k_item.k_record], k_localStep, false);
}
if (k_step > 1 && k_item.k_index <= k_targetIndex) {
k_step--;
}
k_offset++;
}
return  k_step;
},

_k_setAdditionalSortColumns: function(k_columnId, k_additionalSortColumns) {
this._k_additionalSortColumnsList[k_columnId] = k_additionalSortColumns;
},
k_dummy: null
});

kerio.lib._K_BufferedDataStore = function (k_config) {
kerio.lib._k_addKerioProperty(this, {
k_startParamName: k_config.k_startParamName || 'start',
k_limitParamName: k_config.k_limitParamName || 'limit',
k_preBufferLimit: k_config.k_preBufferLimit || 'auto',
k_bufferSize: k_config.k_bufferSize || 'auto',
k_isDataBuffer: false,
k_delayedRequest: new Ext.util.DelayedTask(this._k_sendDelayedRequest, this),
k_buffer: { k_start: null,
k_limit: null,
k_data: []
}
});
delete k_config.k_startParamName;
delete k_config.k_limitParamName;
delete k_config.k_preBufferLimit;
delete k_config.k_bufferSize;
kerio.lib._K_BufferedDataStore.superclass.constructor.call(this, k_config);
};
Ext.extend(kerio.lib._K_BufferedDataStore, Ext.data.Store, {





load: function(k_options, k_forceCache){
var
k_buffer = this._kx.k_buffer,
k_bStart = k_buffer.k_start,
k_startParamName = this._kx.k_startParamName,
k_limitParamName = this._kx.k_limitParamName,
k_preBufferLimit = this._kx.k_preBufferLimit,
k_bufferSize = this._kx.k_bufferSize,
k_lastParams = this.lastOptions,
k_proxy = this.proxy,
k_action = 'read', k_activeRequest = k_proxy.activeRequest[k_action],
k_proxyLoadCallback,
k_prebufferBottomLine,
k_records,
k_start,
k_limit,
k_params;
k_options = k_options || {};
k_forceCache = true === k_forceCache;
if(false === this.fireEvent("beforeload", this, k_options)){
return false;
}
this.storeOptions(k_options);
k_params = Ext.apply(k_options.params || {}, this.baseParams);
k_start = k_params[k_startParamName];
k_limit = k_params[k_limitParamName];
k_prebufferBottomLine = k_bStart + k_buffer.k_data.length;
if (k_prebufferBottomLine !== this.getTotalCount()) {
k_prebufferBottomLine -= k_preBufferLimit;
}
if (!k_forceCache && this._kx.k_isDataBuffer && (k_start >= k_bStart && k_start + k_limit <= k_bStart + k_buffer.k_data.length)) {
k_records = k_buffer.k_data.slice(k_start - k_bStart, k_start - k_bStart + k_limit);
this.loadRecords({
records: k_records,
totalRecords: this.totalLength
}, k_options, true);
}
k_options.k_origParams = {
k_start: k_start,
k_limit: k_limit
};
if (k_forceCache || !this._kx.k_isDataBuffer || (k_start < k_bStart || k_start + k_limit > k_bStart + k_buffer.k_data.length)) {
if (!this._kx.k_isDataBuffer) {
if ('auto' === k_bufferSize) {
k_bufferSize = 2 * k_limit; this._kx.k_bufferSize = k_bufferSize;
}
if ('auto' === k_preBufferLimit) {
k_preBufferLimit = Math.floor(0.75 * k_limit);
this._kx.k_preBufferLimit = k_preBufferLimit;
}
}
if (-1 === k_start) {
k_params[k_limitParamName] = k_limit + k_bufferSize;
}
else {
k_params[k_startParamName] = Math.max(0, k_start - k_bufferSize);
k_params[k_limitParamName] = k_start - k_params[k_startParamName] + k_limit + k_bufferSize;
}
this.fireEvent('cacheout', this);
k_options.k_initBuffer = true;
k_proxyLoadCallback = this.loadRecords;
this.data.clear();
}
else if ((k_bStart > 0 && k_start <= k_bStart + k_preBufferLimit) || k_start + k_limit > k_prebufferBottomLine) {
if (!k_activeRequest || (k_activeRequest && Math.abs(k_params[k_startParamName] - k_lastParams[k_startParamName]) <= k_preBufferLimit / 2)) {
k_params[k_startParamName] = Math.max(0, k_start - k_bufferSize); k_params[k_limitParamName] = k_start - k_params[k_startParamName] + k_limit + k_bufferSize;
k_options.k_initBuffer = true;
k_proxyLoadCallback = this._kxp.k_bufferData;
}
}
if (true === k_options.k_initBuffer) {
if (k_activeRequest) {
kerio.lib.k_ajax.k_abort(k_activeRequest);
k_proxy.activeRequest[k_action] = null;
}
this._kx.k_delayedRequest.delay(150, null, null, [k_action, null, k_params, this.reader, k_proxyLoadCallback, this, k_options]);
}
return true;

},

_k_sendDelayedRequest: function() {
this.proxy.request.apply(this.proxy, arguments);
},

loadRecords: function(k_o, k_options, k_success){
var
k_origParams = k_options.k_origParams,
k_startParamName = this._kx.k_startParamName,
k_recordsCount,
k_start;
if (k_o && false !== k_success && k_options.k_initBuffer) {
k_recordsCount = k_o.records.length;
k_start = k_options.params[k_startParamName];
this._kxp.k_bufferData.call(this, k_o, k_options, k_success);
if (k_recordsCount > k_origParams.k_limit) {
if (-1 === k_start) {
k_o.records = k_o.records.slice(k_recordsCount - k_origParams.k_limit);
}
else {
k_o.records = k_o.records.slice(k_origParams.k_start - k_start, k_origParams.k_start - k_start + k_origParams.k_limit);
}
}
delete k_options.k_initBuffer;
}
kerio.lib._K_BufferedDataStore.superclass.loadRecords.call(this, k_o, k_options, k_success);
},

add: function (k_records) {
kerio.lib._K_BufferedDataStore.superclass.add.call(this, k_records);
kerio.lib.k_reportError('Internal error: kerio.lib._K_BufferedDataStore::add - add into buffer is not implemented yet', 'dataStore.js');
},

insert: function (k_index, k_records) {
kerio.lib._K_BufferedDataStore.superclass.insert.call(this, k_index, k_records);
kerio.lib.k_reportError('Internal error: kerio.lib._K_BufferedDataStore::insert - insert into buffer is not implemented yet', 'dataStore.js');
},

remove: function (k_record, k_onlyFromData) {
kerio.lib._K_BufferedDataStore.superclass.remove.call(this, k_record);
kerio.lib.k_reportError('Internal error: kerio.lib._K_BufferedDataStore::remove - remove from buffer is not implemented yet', 'dataStore.js');
},
_kxp: Ext.apply(Ext.data.Store.prototype._kxp || {}, {

k_bufferData: function (k_o, k_options, k_success) {
var
k_origParams = k_options.k_origParams,
k_lastParams = this.lastOptions.params,
k_startParamName = this._kx.k_startParamName,
k_limitParamName = this._kx.k_limitParamName,
k_origStart = k_origParams.k_start,
k_origLimit = k_origParams.k_limit,
k_buffer = this._kx.k_buffer;
delete k_options.k_origParams;
if (!k_o || k_success === false) {
return;
}
k_buffer.k_data = k_o.records;
k_buffer.k_start = -1 !== k_origStart ? k_options.params[k_startParamName] : k_o.totalRecords - k_o.records.length;
k_buffer.k_limit = k_options.params[k_limitParamName];
k_options.params[k_startParamName] = k_origStart;
k_options.params[k_limitParamName] = k_origLimit;
k_lastParams[k_startParamName] = k_origStart;
k_lastParams[k_limitParamName] = k_origLimit;
kerio.lib._k_addKerioProperty(this, {k_isDataBuffer: true});
}
})
});


kerio.lib.K_DataStoreShared = function(k_config) {
kerio.lib.K_DataStoreShared.superclass.constructor.call(this, this , k_config);
this.k_addReferences({
k_sortingParams: k_config.k_sorting
});
this.k_setLastRequestParams(k_config.k_remoteData.k_jsonRpc.params);
};
kerio.lib.k_extend('kerio.lib.K_DataStoreShared', kerio.lib._K_DataStore, {

_k_isLoaded: false,

_k_isLoading: false,

_k_maskedWidget: null,

k_reset: function() {
this._k_isLoaded = false;
},

k_isLoaded: function() {
return this._k_isLoaded;
},

_k_currentRecord: null,

k_setCurrentRecord: function(k_record) {
this._k_currentRecord = k_record;
},

k_getCurrentRecord: function() {
return this._k_currentRecord;
},

k_setCurrentKey: function(k_value) {
var
k_extDataStore = this.k_extWidget,
k_index = k_extDataStore.findExact(this._k_primaryKey, k_value),
k_currentRecord;
if (-1 === k_index) {
k_currentRecord = k_extDataStore.getTotalCount() ? k_extDataStore.getAt(0) : null;
}
else {
k_currentRecord = k_extDataStore.getAt(k_index);
}
this._k_currentRecord = k_currentRecord && k_currentRecord.data;
return Boolean(this._k_currentRecord);
},

k_getCurrentKey: function() {
return this._k_currentRecord instanceof Object ? this._k_currentRecord[this._k_primaryKey] : undefined;
},

k_init: function(k_callback, k_scope) {
this._k_isLoaded = false;
this.k_extWidget.on('load', k_callback, k_scope, {single: true});
this.k_reloadData();
},

k_setMaskedWidget: function(k_widget) {
this._k_maskedWidget = k_widget;
},

k_resortData: function() {
if (!this.k_extWidget.remoteSort) {
this.k_extWidget.sort(this.k_sortingParams.k_columnId, 'ASC');  }
},

k_reloadData: function(k_requestParams, k_forceCache) {
if (!this._k_isLoading) {
kerio.lib.K_DataStoreShared.superclass.k_reloadData.call(this, k_requestParams, k_forceCache);
}
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = this.k_extWidget;
kerio.lib.K_DataStoreShared.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
k_extWidget.on('beforeload'   , this._k_onBeforeSharedDataLoad, this);
k_extWidget.on('load'         , this._k_onSharedDataLoad, this);
k_extWidget.on('loadexception', this._k_onSharedDataLoadException, this);
},

_k_maskWidget: function(k_mask) {
if (this._k_maskedWidget) {
if (k_mask) {
kerio.lib.k_maskWidget(this._k_maskedWidget);
}
else {
kerio.lib.k_unmaskWidget(this._k_maskedWidget);
}
}
},

_k_onBeforeSharedDataLoad: function() {
this._k_isLoaded = false;
this._k_isLoading = true;
this._k_maskWidget(true);
return true;
},

_k_onSharedDataLoad: function() {
this._k_isLoaded = true;
this._k_isLoading = false;
this._k_maskWidget(false);
this.k_resortData();
},

_k_onSharedDataLoadException: function() {
this._k_isLoading = false;
this._k_maskWidget(false);
},
k_getMainWidget: Ext.emptyFn,
k_resetFullPath: Ext.emptyFn  });


kerio.lib.K_Statusbar = function(k_id, k_config) {
this._k_setStoredProperties([
'k_defaultConfig',
'k_configurations'
]);
this._k_storedConfigutations = k_config.k_configurations; kerio.lib.K_Statusbar.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_Statusbar, kerio.lib._K_BaseWidget,
{




_k_propertiesMapping: {
k_className: 'cls'
},

_k_initExtComponent: function (k_adaptedConfig, k_storedConfig) {
var k_extWidget;
this._k_config = k_storedConfig.k_configurations[k_storedConfig.k_defaultConfig];
this._k_removeStoredProperties(['k_defaultConfig']);
k_adaptedConfig.id = this.k_id;
k_extWidget = new kerio.lib._K_StatusBar(k_adaptedConfig);
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
this.k_extWidget.on({
'linkclick':   this._k_onLinkClick,
'afterrender': this._k_setConfigOnAfterRender,
scope: this
});
},

_k_setConfigOnAfterRender: function () {
this.k_setConfig(this._k_config);
},

_k_onLinkClick: function () {
var k_dialogCfg = this._k_dialogCfg;
if (this._k_onClick) {
this._k_onClick.call(this, this);
}
if (k_dialogCfg) {
if (k_dialogCfg.k_text) {
kerio.lib.k_alert(k_dialogCfg.k_title, k_dialogCfg.k_text);
}
else if (k_dialogCfg.k_sourceName || k_dialogCfg.k_objectName) {
kerio.lib.k_ui.k_showDialog(k_dialogCfg);
}
}
},

k_switchConfig: function (k_configId) {
var k_config = this._k_storedConfigutations[k_configId];
if (k_config) {
this.k_setConfig(k_config);
if (!this._k_isVisible) {
this.k_setVisible(true);
}
}
else {
kerio.lib.k_reportError('Internal error: K_Statusbar.k_switchConfig - invalid config id \'' + k_configId + '\'!', 'statusBar.js');
}
},

k_setConfig: function (k_config) {
var
k_origConfig = this._k_config,
k_linkCfg = k_config.k_link;
if (k_origConfig.k_link && k_origConfig.k_link.k_className) {
this.k_removeLinkClassName(k_origConfig.k_link.k_className);
}
if (k_linkCfg) {
this.k_addLinkClassName(k_linkCfg.k_className);
this.k_setLink(k_linkCfg.k_text);
}
this._k_setLinkDisaplyed(undefined !== k_linkCfg);
this.k_removeIconClassName(k_origConfig.k_iconCls);
this.k_addIconClassName(k_config.k_iconCls);
this._k_setIconDisaplyed(undefined !== k_config.k_iconCls);
this._k_onClick = null;
this._k_dialogCfg = null;
if (k_linkCfg) {
this._k_onClick = k_linkCfg.k_onClick;
this._k_dialogCfg = k_linkCfg.k_dialog;
}
if (undefined !== k_config.k_text) {
this.k_setText(k_config.k_text, true);
}
if (k_origConfig.k_className) {
this.k_removeTextClassName(k_origConfig.k_className);
}
this.k_addTextClassName(k_config.k_className);
this._k_config = k_config;
this.k_extWidget.fireEvent('configchanged', this, k_config);
},

k_setText: function (k_text, k_suppressChangeEvent) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
if (!k_text) {
k_text = '';
}
this.k_extWidget._kx.k_textEl.update(k_text);
if (true !== k_suppressChangeEvent) {
this.k_extWidget.fireEvent('textchanged', this, k_text);
}
},

k_setLink: function (k_text) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
if (!k_text) {
k_text = '';
}
this.k_extWidget._kx.k_linkEl.update(k_text);
},

k_addLinkClassName: function (k_className) {
this._k_updateElementClassName('k_add', this.k_extWidget._kx.k_linkId, k_className);
},

k_removeLinkClassName: function (k_className) {
this._k_updateElementClassName('k_remove', this.k_extWidget._kx.k_linkId, k_className);
},

k_addIconClassName: function (k_className) {
this._k_updateElementClassName('k_add', this.k_extWidget._kx.k_iconId, k_className);
},

k_removeIconClassName: function (k_className) {
this._k_updateElementClassName('k_remove', this.k_extWidget._kx.k_iconId, k_className);
},

k_addTextClassName: function (k_className) {
this._k_updateElementClassName('k_add', this.k_extWidget._kx.k_textId, k_className);
},

k_removeTextClassName: function (k_className) {
this._k_updateElementClassName('k_remove', this.k_extWidget._kx.k_textId, k_className);
},

_k_updateElementClassName: function (k_action, k_elementId, k_className) {
var k_element;
if (!k_className) {
return;
}
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
k_element = Ext.get(k_elementId);
k_element[('k_remove' === k_action) ? 'removeClass' : 'addClass'](k_className);
},

_k_setIconDisaplyed: function (k_disaplyed) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
if (!this.k_extWidget._kx.k_iconEl) {
return;
}
k_disaplyed = (undefined === k_disaplyed) ? true : k_disaplyed;
this.k_extWidget._kx.k_iconEl.setDisplayed(k_disaplyed);
},

_k_setLinkDisaplyed: function (k_disaplyed) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
if (!this.k_extWidget._kx.k_linkEl) {
return;
}
k_disaplyed = (undefined === k_disaplyed) ? true : k_disaplyed;
this.k_extWidget._kx.k_linkEl.setDisplayed(k_disaplyed);
},

k_setDisabled: function (k_disabled) {

},

k_setReadOnly: function (k_readOnly) {

},

k_setVisible: function (k_visible) {
var k_extRelatedWidget,
k_relatedWidget;
k_visible = (undefined === k_visible) ? true : k_visible;
this._k_isVisible = k_visible;
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
this.k_extWidget.setVisible(k_visible);
}
}); 
kerio.lib._K_StatusBar = function(k_config) {
kerio.lib._K_StatusBar.superclass.constructor.call(this, k_config);
kerio.lib._k_addKerioProperty(this, {
k_linkId: this.id + '_' + 'k_link',
k_textId: this.id + '_' + 'k_text',
k_iconId: this.id + '_' + 'k_icon',
k_linkEl: null,
k_textEl: null,
k_iconEl: null
});
var k_kx = this._kx;
this.addClass('statusBar'); this.html = new Ext.Template(this._kxp.k_htmlTemplateDefinition).apply({
k_linkId: k_kx.k_linkId,
k_textId: k_kx.k_textId,
k_iconId: k_kx.k_iconId,
k_text: ''
});
};
Ext.extend(kerio.lib._K_StatusBar, Ext.Panel,
{
height: 'auto', border: false, bodyBorder: false,
afterRender: function () {
kerio.lib._K_StatusBar.superclass.afterRender.call(this);
var k_linkEl,
k_kx = this._kx,
k_linkId = k_kx.k_linkId,
k_textId = k_kx.k_textId,
k_iconId = k_kx.k_iconId;
if (k_textId) {
k_kx.k_textEl = Ext.get(k_textId);
}
if (k_iconId) {
k_kx.k_iconEl = Ext.get(k_iconId);
}
if (k_linkId) {
k_linkEl = Ext.get(k_linkId);
if (k_linkEl) {
k_linkEl.on('click', function () {
this.fireEvent('linkclick', this);
}, this);
}
k_kx.k_linkEl = k_linkEl;
}
}
});
kerio.lib._K_StatusBar.prototype._kxp = Ext.apply({}, kerio.lib._K_StatusBar.prototype._kxp, {
k_htmlTemplateDefinition: '<span id="{k_iconId}" class="statusBarIcon">&nbsp; &nbsp; &nbsp; &nbsp;</span><span id="{k_textId}" class="statusBarText"></span>' +
' <a id="{k_linkId}" class="statusBarLink" href="#" onclick="return false;"></a>'
});


kerio.lib.K_TabPage = function(k_id, k_config)
{
this.k_items = {};    this._k_focusableContentList = {};
this._k_idMapping = {};
this._k_setStoredProperties(['k_items']);
kerio.lib.K_TabPage.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_TabPage, kerio.lib._K_ToolbarContainer,
{




_k_tabPageIdPrefix: 'k_tab' + '_',

_k_propertiesDefault: {
plain: true,
border: true,
enableTabScroll: true,
layoutOnTabChange: true
},

_k_propertiesMapping: {
k_className: 'cls',
k_onBeforeTabChange: {k_extName: 'beforetabchange'    , k_listener: 'this._k_onBeforeTabChange'    , k_scope: 'this'},
k_onTabChange      : {k_extName: 'tabchange'          , k_listener: 'this._k_onTabChange'    , k_scope: 'this'}
},

_k_panelDefaults: {
disabled: false,
border: false,
cls: 'tabPage',
defaults: {
border: false
},
title: '',
disabledClass: Ext.Component.prototype.disabledClass
},

_k_panelPropertiesMapping: {
k_isDisabled: 'disabled',
k_caption: 'title'
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_panelDefaults = this._k_panelDefaults,
k_panelPropertiesMapping = this._k_panelPropertiesMapping,
k_items = k_storedConfig.k_items,
k_createConfig = kerio.lib._k_createConfig,
k_tabCfg,
k_tabId,
k_tabIdFull,
k_content,
k_panel,
k_extWidget,
k_panelClassName,
k_cfg;
Ext.apply(k_adaptedConfig, {
id: this.k_id, listeners: Ext.apply(k_adaptedConfig.listeners || {}, {
resize: (Ext.isWebKit ? this._k_fixScrolledTabsWidth : Ext.emptyFn)
}),
items: []
});
for (var k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
if (!k_items[k_i]) {
continue;
}
k_tabCfg = k_items[k_i];
k_tabId = (undefined === k_tabCfg.k_id) ? k_i : k_tabCfg.k_id;
k_tabIdFull = this._k_expandTabId(k_tabId);
if (k_tabCfg.k_content) {
if ('string' === typeof k_tabCfg.k_content) {
k_panel = new Ext.Panel({
html: k_tabCfg.k_content,
id: k_tabIdFull
});
}
else {
k_content = k_tabCfg.k_content;
k_content._k_setParentWidget(this);
this._k_focusableContentList[k_tabIdFull] = k_content;
if (k_content.k_extCover) {
k_panel = k_content.k_extCover;
}
else {
k_panel = k_content.k_extWidget;

if (Ext.isIE && k_content.k_isInstanceOf('K_Layout')) {
}
}
}
k_panelClassName = k_panel.cls;
k_cfg = k_createConfig(k_tabCfg, k_panelDefaults, k_panelPropertiesMapping);
Ext.apply(k_panel, k_cfg);
if (k_panelClassName) {
k_panel.cls += ' ' + k_panelClassName;
}
k_adaptedConfig.items.push(k_panel);
this._k_idMapping[k_tabId] = k_panel.id;
this.k_items[this._k_getInternalId(k_tabId)] = k_panel;
if ((undefined === k_adaptedConfig.activeTab) || k_tabCfg.k_active) {
k_adaptedConfig.activeTab = k_panel;
}
}
}
k_extWidget = new Ext.TabPanel(k_adaptedConfig);
k_extWidget.on('tabchange', this._k_layoutOnTabChange, this);
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_items = k_storedConfig.k_items,
k_lib = kerio.lib,
k_tabCfg,
k_tab,
k_i, k_cnt;
kerio.lib.K_TabPage.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
for (k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_tabCfg = k_items[k_i];
if (k_tabCfg && k_tabCfg.k_isHidden) {
k_tab = this._k_getTab(k_tabCfg.k_id || k_i);
k_tab.tabCls = 'displayNone';
k_lib._k_addKerioProperty(k_tab, {k_isHidden: true});
}
}
},

_k_layoutOnTabChange: function (k_tabPanel, k_activeTab) {
var k_el;
if (Ext.isIE7) {
k_el = k_activeTab.getEl();
if (k_el) {
k_el.repaint();
}
}
},

_k_getTabIdFromContentId: function (k_contentId) {
for (var k_tabId in this._k_idMapping) {
if (this._k_idMapping[k_tabId] === k_contentId) {
return k_tabId;
}
}
return null;
},

k_setActiveTab: function(k_tabId) {
var k_requiredTab = this._k_getTab(k_tabId);
var k_activeTab = this.k_extWidget.activeTab;
if (k_activeTab && k_requiredTab && (k_activeTab.id === k_requiredTab.id)) {
return;
}
this.k_extWidget.setActiveTab(k_requiredTab);
},

_k_fixScrolledTabsWidth: function(k_extTabPanel) {
var k_tabStripWidth = k_extTabPanel.el.child('div.x-tab-strip-spacer').getWidth();
var k_scrollArea = k_extTabPanel.getScrollArea();
var k_arrowsWidth = (k_extTabPanel.scrollLeft && k_extTabPanel.scrollLeft.isVisible()) ? 36 : 0;
if (k_tabStripWidth - k_scrollArea !== k_arrowsWidth) {
k_extTabPanel.stripWrap.setWidth(k_tabStripWidth - k_arrowsWidth);
}
},

k_setDisabledTab: function (k_tabIds, k_disable) {
var
k_tab,
k_i, k_cnt;
k_disable = false !== k_disable;
if (!Ext.isArray(k_tabIds)) {
k_tabIds = [k_tabIds];
}
for (k_i = 0, k_cnt = k_tabIds.length; k_i < k_cnt; k_i++) {
k_tab = this._k_getTab(k_tabIds[k_i]);
if (k_tab) {
k_tab.setDisabled(k_disable);
}
}
},

k_setVisibleTab: function(k_tabIds, k_visible) {
var
k_isVisible = false !== k_visible,
k_func = k_isVisible ? 'unhideTabStripItem' : 'hideTabStripItem',
k_lib = kerio.lib,
k_isRepaintRequired = false,
k_tab,
k_tabStripEl,
k_i, k_cnt;
if (!Ext.isArray(k_tabIds)) {
k_tabIds = [k_tabIds];
}
for (k_i = 0, k_cnt = k_tabIds.length; k_i < k_cnt; k_i++) {
k_tab = this._k_getTab(k_tabIds[k_i]);
this.k_extWidget[k_func](k_tab);
k_lib._k_addKerioProperty(k_tab, {k_isHidden: !k_isVisible});
if (k_isVisible) {
k_tabStripEl = this.k_extWidget.getTabEl(k_tab);
if (k_tabStripEl.className && -1 !== k_tabStripEl.className.indexOf('displayNone')) {  k_tabStripEl.className = k_tabStripEl.className.replace('displayNone', '');
k_isRepaintRequired = true;
}
}
}
if (k_isRepaintRequired) {
this.k_extWidget.syncSize();
}
},

_k_getInternalId: function(k_tabId) {
return this._k_tabPageIdPrefix + k_tabId;
},

_k_getTab: function(k_tabId) {
return this.k_items[this._k_getInternalId(k_tabId)];
},

_k_expandTabId: function(k_tabId) {
return this.k_id + '_' + this._k_tabPageIdPrefix + k_tabId;
},

k_getCount: function() {
return this.k_extWidget.items.length;
},

k_getTabContent: function(k_tabId) {
if (!k_tabId) {
return null;
}
k_tabId = this._k_expandTabId(k_tabId);
return this._k_focusableContentList[k_tabId];
},

_k_isValid: function(k_markInvalid) {
var
k_results = new kerio.lib._K_ValidationResults(),
k_tabs = this.k_items,  k_tabId,                k_extTab,               k_childWidget;          for (k_tabId in k_tabs) {
k_extTab = k_tabs[k_tabId];
if (!k_extTab || !k_extTab._kx || !k_extTab._kx.k_owner) {
continue; }
k_childWidget = k_extTab._kx.k_owner; if (!k_childWidget._k_isValid) {
continue; }
if (k_extTab.disabled || k_extTab._kx.k_isHidden) {
continue;
}
k_results.k_add(              k_childWidget._k_isValid(k_markInvalid),
k_results.k_valid         );
} return k_results;
}, 
_k_onBeforeTabChange: function (k_extTabPanel, k_extNewTab, k_extCurrentTab) {
var
k_newTabId = this._k_getTabIdFromContentId(k_extNewTab.id),
k_currentTabId = null;
if (k_extCurrentTab) {
k_currentTabId = this._k_getTabIdFromContentId(k_extCurrentTab.id);
}
return this._k_mappedListeners.k_onBeforeTabChange.call(this, this, k_newTabId, k_currentTabId);
},

_k_onTabChange: function (k_extTabPanel, k_extTab) {
var k_tabId =  this._k_getTabIdFromContentId(k_extTab.id);
this._k_mappedListeners.k_onTabChange.call(this, this, k_tabId);
}
});    

Ext.grid.Column.prototype.renderer = function(k_value) {
if ('string' === Ext.type(k_value)) {
k_value = k_value.length >= 1 ? Ext.util.Format.htmlEncode(k_value) : '&#160;';
}
return k_value;
};

Ext.grid.GridView.prototype.findRow = function(k_el){
if(!k_el){
return false;
}
return this.fly(k_el).findParent(this.rowSelector, 15);
};

Ext.grid.GroupingView.prototype.toggleGroup = Ext.grid.GroupingView.prototype.toggleGroup.createSequence(function (k_group) {
k_group = Ext.getDom(k_group);
var k_gel = Ext.fly(k_group);
var k_expanded = !k_gel.hasClass('x-grid-group-collapsed');
this.fireEvent('groupstatechanged', this.grid, Ext.get(k_group), k_expanded);
});

Ext.grid.GroupingView.prototype.interceptMouse = function(e){
var hd = e.getTarget('.x-grid-group-hd', this.mainBody);
if (hd && !kerio.lib._k_isContextMenuAllowed(e)) {
if (false !== this.fireEvent('beforegroupstatechanged', this.grid, Ext.get(hd.parentNode), e)) {
e.stopEvent();
this.toggleGroup(hd.parentNode);
}
}
};
Ext.grid.GroupingView.prototype.doRender = function(cs, rs, ds, startRow, colCount, stripe){
if(rs.length < 1){
return '';
}
var _kx = { k_redererResult: null };
var groupField = this.getGroupField();
var colIndex = this.cm.findColumnIndex(groupField);
this.enableGrouping = !!groupField;
if(!this.enableGrouping || this.isUpdating){
return Ext.grid.GroupingView.superclass.doRender.apply(this, arguments);
}
var gstyle = 'width:'+this.getTotalWidth()+';';
var gidPrefix = this.grid.getGridEl().id;
var cfg = this.cm.config[colIndex];
var groupRenderer = cfg.groupRenderer || cfg.renderer;
var prefix = this.showGroupName ? (cfg.groupName || cfg.header)+': ' : '';
var rowIndex;
var r, gvalue;
var isCollapsed;
var gcls;
var g;
var groups = [], curGroup, i, len, gid;
for(i = 0, len = rs.length; i < len; i++){
rowIndex = startRow + i;
r = rs[i];
gvalue = r.data[groupField];
_kx.k_redererResult = this.getGroup(gvalue, r, groupRenderer, rowIndex, colIndex, ds);  if ('object' === typeof _kx.k_redererResult) {
g = gvalue;
}
else {
g = _kx.k_redererResult;
}
if(!curGroup || curGroup.group != g){
gid = gidPrefix + '-gp-' + groupField + '-' + Ext.util.Format.htmlEncode(g);
isCollapsed  = typeof this.state[gid] !== 'undefined' ? !this.state[gid] : this.startCollapsed;
gcls = isCollapsed ? 'x-grid-group-collapsed' : '';
curGroup = {
group: g,
gvalue: gvalue,
text: prefix + g,
groupId: gid,
startRow: rowIndex,
rs: [r],
cls: gcls,
style: gstyle
};
if ('object' === typeof _kx.k_redererResult && _kx.k_redererResult != null) {
curGroup.text = _kx.k_redererResult.k_displayValue;  }
groups.push(curGroup);
}else{
curGroup.rs.push(r);
}
r._groupId = gid;
}
var buf = [];
for(i = 0, len = groups.length; i < len; i++){
g = groups[i];
this.doGroupStart(buf, g, cs, ds, colCount);
buf[buf.length] = Ext.grid.GroupingView.superclass.doRender.call(this, cs, g.rs, ds, g.startRow, colCount, stripe);
this.doGroupEnd(buf, g, cs, ds, colCount);
}
return buf.join('');
};

kerio.lib._K_BufferedMemoryProxy = function(k_data){
kerio.lib._K_BufferedMemoryProxy.superclass.constructor.call(this);
this.data = k_data;
};
Ext.extend(kerio.lib._K_BufferedMemoryProxy, Ext.data.MemoryProxy,
{
doRequest : function(k_action, k_rs, k_params, k_reader, k_callback, k_scope, k_options){
var
k_result,
k_sortInfo,
k_i, k_cnt;
k_params = k_params || {};
if (isNaN(k_params.start)) {
k_params.start = 0;
}
try {
k_result = k_reader.readRecords(this.data);
}
catch (e) {
this.fireEvent('exception', this, k_options, null, e);
k_callback.call(k_scope, null, k_options, false);
return;
}
for (k_i = 0, k_cnt = k_result.records.length; k_i < k_cnt; k_i ++) {
k_result.records[k_i].join(k_scope);
}
if (undefined !== k_scope.sortInfo) {
k_sortInfo = k_scope.sortInfo;
k_result.records.sort(function(a, b){
var
v = 0,
fn = a.store.proxy._k_sortFn,
k_sortInfo = a.store.sortInfo,
dir = 'DESC' === String(k_sortInfo.direction).toUpperCase() ? -1 : 1;
if ('object' === typeof a) {
v = fn(a.data[k_sortInfo.field], b.data[k_sortInfo.field]) * dir;
}
else {
v = fn(a, b) * dir;
}
if (v === 0) {
v = (a.index < b.index ? -1 : 1);
}
return v;
});
}
if (k_params.start !== undefined && k_params.limit !== undefined) {
k_result.records = k_result.records.slice(k_params.start, k_params.start + k_params.limit);
}
k_callback.call(k_scope, k_result, k_options, true);
},

_k_sortFn: function(r1, r2){
return r1 === r2 ? 0 : r1 < r2 ? -1 : 1;
}
}); 
kerio.lib._K_PagingToolbar = function(k_config){
if (true === k_config.k_keepPagingVisible) {
this.autoCreate.cls = this.autoCreate.cls.replace('hiddenPaging', '');
delete k_config.k_keepPagingVisible;
}
kerio.lib._K_PagingToolbar.superclass.constructor.call(this, k_config);
}; Ext.extend(kerio.lib._K_PagingToolbar, Ext.PagingToolbar, {

autoCreate: {
cls:'x-toolbar x-small-editor hiddenPaging',
html:'<table cellspacing="0"><tr></tr></table>'
},

onPagingKeydown: function(k_extEvent) {
switch (k_extEvent.keyCode) {
case k_extEvent.UP:
case k_extEvent.RIGHT:
case k_extEvent.DOWN:
case k_extEvent.LEFT:
case k_extEvent.PAGEUP:
case k_extEvent.PAGEDOWN:
case k_extEvent.HOME:
case k_extEvent.END:
k_extEvent.stopEvent();
break; default:
kerio.lib._K_PagingToolbar.superclass.onPagingKeydown.call(this, k_extEvent);
break; }
}, 
enable: function () {
kerio.lib._K_PagingToolbar.superclass.enable.call(this);
this._kxp._k_updateButtonsStateOnEnable.call(this);
}
}); kerio.lib._K_PagingToolbar.prototype._kxp = Ext.apply(kerio.lib._K_PagingToolbar.prototype._kxp || {}, {

_k_updateButtonsStateOnEnable: function () {
if (!this.rendered) {
return;
}
var
k_data = this.getPageData(),
k_activePage = k_data.activePage,
k_pages = k_data.pages;
this.first.setDisabled(k_activePage === 1);
this.prev.setDisabled(k_activePage === 1);
this.next.setDisabled(k_activePage === k_pages);
this.last.setDisabled(k_activePage === k_pages);
}
}, Ext.PagingToolbar.prototype._kxp);

Ext.grid.CheckColumn = function(config){
Ext.apply(this, config);
this.origRenderer = this.renderer;
this.renderer = this.complexRenderer.createDelegate(this);
};
Ext.grid.CheckColumn.prototype = {
init : function(grid){
this.grid = grid;
this.grid.on('render', function() {
var view = this.grid.getView();
view.mainBody.on('click', this.onMouseEvent, this);
view.mainBody.on('dblclick', this.onMouseEvent, this);
}, this
);
},
isColumnWithCbx: function(t) {
return (t && t.className && -1 !== t.className.indexOf('x-grid3-cc-'+this._kx.k_id));
},
onMouseEvent : function(e, t) {

if (kerio.lib._k_isContextMenuAllowed(e) || (true === this.grid._kx.k_owner._k_isReadOnly)) {
return;
}
var k_event = e.browserEvent,
k_cbxCoordinateMin = 2,  k_cbxCoordinateMax = 14,
k_extCheckColumnKx = this._kx,
k_clickX,
k_cell,
k_distance,
k_extGrid,
k_extView,
k_extEditInfo,
k_rowIndex,
k_record,
k_dataIndex,
k_origValue
if (Ext.isIE && t.tagName && 'PRE' === t.tagName) {  t = t.parentElement;
}
if (this.isColumnWithCbx(t)) {
k_clickX = (undefined === k_event.offsetX) ? k_event.layerX : k_event.offsetX;
if (!k_extCheckColumnKx.k_editColumnId && !k_extCheckColumnKx.k_linkedOption) {
k_cell = Ext.get(e.getTarget());
if (k_cell) {
k_distance = Math.round(k_cell.getWidth() / 2) - Math.round((k_cbxCoordinateMax + k_cbxCoordinateMin) / 2);
k_cbxCoordinateMin += k_distance;
k_cbxCoordinateMax += k_distance;
}
}
if (k_clickX < k_cbxCoordinateMin || k_clickX > k_cbxCoordinateMax) {
return true;
}
e.stopEvent();
if ('dblclick' === e.type) {
return true;
}
k_extGrid = this.grid;
k_extView = k_extGrid.getView();
k_rowIndex = k_extView.findRowIndex(t);
k_record = k_extGrid.store.getAt(k_rowIndex);
k_dataIndex = k_extCheckColumnKx.k_editColumnId || this.dataIndex;
k_origValue = k_record.data[k_dataIndex];
if (k_extGrid.activeEditor) {
k_extGrid.stopEditing();
}
k_extEditInfo = {
grid    : k_extGrid,
record  : k_record,
field   : k_dataIndex,
value   : k_origValue,
newValue: !k_origValue,
row     : k_rowIndex,
column  : k_extView.findCellIndex(t)
};
this._k_updateCheckColumnValue(k_extEditInfo);
}
},

_k_updateCheckColumnValue: function (k_extEditInfo) {
var
k_grid = this.grid._kx.k_owner,
k_extCheckColumnKx = this._kx,
k_origValue = k_extEditInfo.value,
k_newValue = k_extEditInfo.newValue,
k_record = k_extEditInfo.record,
k_dataIndex = k_extEditInfo.field;
delete k_extEditInfo.newValue;
if (k_grid._k_mappedListeners.k_onBeforeEdit) {
if (false === k_grid._k_onBeforeGridEdit.call(k_grid, k_extEditInfo)) {
return;
}
}
if (k_extCheckColumnKx.k_onBeforeEdit) {
if (false === k_extCheckColumnKx.k_onBeforeEdit.call(k_grid, k_grid, k_dataIndex, k_origValue, k_record.data)) {
return;
}
}
k_record.set(k_dataIndex, k_newValue);
if (k_extCheckColumnKx.k_onChange) {
k_extEditInfo.value = k_newValue;
k_grid._k_setEditInfo(k_extEditInfo);
k_extCheckColumnKx.k_onChange(k_grid, k_newValue, k_record.data);
}
},
cbxRenderer : function(k_value, k_extMetaData, k_record, k_rowIndex, k_colIndex, k_store, k_rawValue) {
var k_dispValue;
var k_addClass = '';
var k_cbxValue = (undefined === k_rawValue) ? k_value : k_rawValue;
if (this._kx.k_editColumnId || this._kx.k_linkedOption) {
if (this._kx.k_editColumnId) {
k_dispValue = k_value;
k_cbxValue = k_record.data[this._kx.k_editColumnId];
}
else {
k_dispValue = k_record.data[this._kx.k_linkedOption];
}
k_dispValue = '&nbsp; &nbsp; &nbsp; ' + k_dispValue;
k_addClass = ' gridColCbxWithText';
}
else {
k_dispValue =  '&#160';
}
k_extMetaData.css += ' x-grid3-check-col-td';
return '<div unselectable="on" class="x-grid3-check-col' + (k_cbxValue?'-on':'') + ' x-grid3-cc-'
+ this._kx.k_id + k_addClass + '">' + k_dispValue + '</div>';
},
complexRenderer: function(k_value, k_extMetaData, k_record, k_rowIndex, k_colIndex, k_store) {
var k_rawValue = k_value;
if (this.origRenderer) {
k_value = this.origRenderer(k_value, k_extMetaData, k_record, k_rowIndex, k_colIndex, k_store);
}
else {
k_value = Ext.util.Format.htmlEncode(k_value);
}
k_value = this.cbxRenderer(k_value, k_extMetaData, k_record, k_rowIndex, k_colIndex, k_store, k_rawValue);
return k_value;
}
};

kerio.lib._K_PrinterGridView = Ext.extend(Ext.ux.grid.PrinterGridView, {
templates: {
'header': new Ext.Template(
'<thead><tr class="x-grid3-header x-grid3-hd-row">{cells}</tr></thead>'
),
'hcell': new Ext.Template(
'<td class="x-grid3-hd x-grid3-cell {css}x-grid3-td-{id}" style="{style}">',
'<pre>{value}</pre>',
'</td>'
),
'cell': new Ext.Template(
'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>' +
'<div class="x-grid3-cell-inner x-grid3-col-{id}">',
Ext.isIE ? '<pre>{value}</pre>' : '{value}',
'</div></td>'
)
},
syncFocusEl: Ext.emptyFn,
destroy : function(){
if(this.grid.enableColumnMove){
var dds = Ext.dd.DDM.ids['gridHeader' + this.grid.getGridEl().id];
if(dds){
for(var dd in dds){
if(!dds[dd].config.isTarget && dds[dd].dragElId){
var elid = dds[dd].dragElId;
dds[dd].unreg();
Ext.get(elid).remove();
} else if(dds[dd].config.isTarget){
dds[dd].proxyTop.remove();
dds[dd].proxyBottom.remove();
dds[dd].unreg();
}
if(Ext.dd.DDM.locationCache[dd]){
delete Ext.dd.DDM.locationCache[dd];
}
}
delete Ext.dd.DDM.ids['gridHeader' + this.grid.getGridEl().id];
}
}
Ext.destroy(this.resizeMarker, this.resizeProxy, this.focusEl, this.mainBody,
this.scroller, this.mainHd, this.mainWrap, this.dragZone,
this.splitZone, this.columnDrag, this.columnDrop);
this.initData(null, null);
Ext.EventManager.removeResizeListener(this.onWindowResize, this);
this.purgeListeners();
}
});  
kerio.lib._K_PrinterGrid = Ext.extend(Ext.grid.GridPanel, {
getView : function(){
if(!this.view){
this.view = new kerio.lib._K_PrinterGridView(this.viewConfig);
}
return this.view;
}
});

kerio.lib._K_RowSelectionModel = Ext.extend(Ext.grid.RowSelectionModel, {
_k_rangeSelectionActions: 0, 
selectRange: function(startRow, endRow, keepExisting){
this._k_callFunction('selectRange', [startRow, endRow, keepExisting]);
},

selectAll: function(){
this._k_callFunction('selectAll');
},

deselectRange: function(startRow, endRow, preventViewNotify){
this._k_callFunction('deselectRange', [startRow, endRow, preventViewNotify]);
},

clearSelections: function(fast){
this._k_callFunction('clearSelections', [fast]);
},

_k_callFunction: function (k_actionName, k_arguments) {
if (!k_arguments) {
k_arguments = [];
}
this._k_rangeSelectionActions++;
this.constructor.superclass[k_actionName].apply(this, k_arguments);
this._k_rangeSelectionActions--;
this.fireEvent('rangeselectionchange', this);
},

k_isRangeSelectionInProgress: function () {
return 0 !== this._k_rangeSelectionActions;
},

onRefresh: function () {
this.suspendEvents();
Ext.grid.RowSelectionModel.prototype.onRefresh.apply(this, arguments);
this.resumeEvents();
this.fireEvent('selectionchange', this);
}
});

kerio.lib._K_CheckboxSelectionModel = function (k_config) {
kerio.lib._K_CheckboxSelectionModel.superclass.constructor.call(this, k_config);
kerio.lib._k_addKerioProperty(this, {
k_isAllChecked: false,
k_checkedRows: new Ext.util.MixedCollection(false, function (k_object) {
return k_object.id;
})
});
};
Ext.extend(kerio.lib._K_CheckboxSelectionModel, Ext.grid.CheckboxSelectionModel,
{

initEvents: function(){
Ext.grid.RowSelectionModel.prototype.initEvents.call(this);
var
k_grid = this.grid,
k_kxp = this._kxp;
k_grid.store.on('load', k_kxp.k_clearCheckedOnStoreChanged, this);
k_grid.store.on('clear', k_kxp.k_clearCheckedOnStoreChanged, this);
k_grid.on('viewready', k_kxp.k_initEventOnRender, this);
},

onMouseDown: Ext.emptyFn,

onHdMouseDown: Ext.emptyFn,
_k_rangeSelectionActions: kerio.lib._K_RowSelectionModel.prototype._k_rangeSelectionActions, 
selectRange: kerio.lib._K_RowSelectionModel.prototype.selectRange,

selectAll: kerio.lib._K_RowSelectionModel.prototype.selectAll,

deselectRange: kerio.lib._K_RowSelectionModel.prototype.deselectRange,

clearSelections: kerio.lib._K_RowSelectionModel.prototype.clearSelections,

_k_callFunction: kerio.lib._K_RowSelectionModel.prototype._k_callFunction,

k_isRangeSelectionInProgress: kerio.lib._K_RowSelectionModel.prototype.k_isRangeSelectionInProgress
});

kerio.lib._K_CheckboxSelectionModel.prototype._kxp = Ext.apply({}, kerio.lib._K_CheckboxSelectionModel.prototype._kxp, {

k_checkRow: function (k_index, k_fireCheckChanged) {
var
k_grid = this.grid,
k_row;
if (this.locked || (k_index < 0 || k_index >= k_grid.store.getCount())) {
return;
}
k_row = k_grid.store.getAt(k_index);
k_fireCheckChanged = (false !== k_fireCheckChanged);
if (k_row && this.fireEvent('beforerowcheck', this, k_index, k_row) !== false) {
this._kx.k_checkedRows.add(k_row);
k_grid.getView().addRowClass(k_index, 'checkedRow');
this.fireEvent('rowcheck', this, k_index, k_row);
}
if (k_fireCheckChanged) {
this.fireEvent('checkchanged', this);
}
},

k_uncheckRow: function (k_index, k_fireCheckChanged) {
if (this.locked) {
return;
}
var
k_row = this.grid.store.getAt(k_index),
k_kerioProperties = this._kx;
k_fireCheckChanged = (false !== k_fireCheckChanged);
if (k_row) {
this._kx.k_checkedRows.remove(k_row);
this.grid.getView().removeRowClass(k_index, 'checkedRow');
this.fireEvent('rowunchecked', this, k_index, k_row);
if (k_kerioProperties.k_isAllChecked) {
k_kerioProperties.k_isAllChecked = false;
this._kxp.k_updateHeaderCbx.call(this);
}
}
if (k_fireCheckChanged) {
this.fireEvent('checkchanged', this);
}
},

k_checkAll: function (k_check) {
var
k_i,
k_cnt,
k_actionAllowed,
k_function,
k_kerioProperties = this._kx;
k_check = (false !== k_check);
k_actionAllowed = (k_check !== k_kerioProperties.k_isAllChecked);
if (this.locked || !k_actionAllowed) {
return;
}
this._kx.k_checkedRows.clear();
k_function = this._kxp[k_check ? 'k_checkRow' : 'k_uncheckRow'];
for (k_i = 0, k_cnt = this.grid.store.getCount(); k_i < k_cnt; k_i++) {
k_function.call(this, k_i, false);
}
k_kerioProperties.k_isAllChecked = k_check;
this.fireEvent('checkchanged', this);
},

k_uncheckAll: function () {
this._kxp.k_checkAll.call(this, false);
},

k_isChecked: function(k_index){
var k_row = 'number' === typeof k_index ? this.grid.store.getAt(k_index) : k_index;
return (k_row && this._kx.k_checkedRows.key(k_row.id) ? true : false);
},

k_checkSelected: function (k_uncheck) {
var k_selections = this.selections,
k_dataStore = this.grid.store,
k_fnName = (false !== k_uncheck) ? 'k_checkRow' : 'k_uncheckRow',
k_i,
k_cnt;
for (k_i = 0, k_cnt = k_selections.getCount(); k_i < k_cnt; k_i++) {
this._kxp[k_fnName].call(this, k_dataStore.indexOf(k_selections.itemAt(k_i)), false);
}
this.fireEvent('checkchanged', this);
},

k_uncheckSelected: function () {
this._kxp.k_checkSelected.call(this, false);
},

k_getChecked: function () {
var
k_dataStore = this.grid.store,
k_checkedRows = this._kx.k_checkedRows,
k_returnedCheckedRows = [],
k_cnt = k_checkedRows.getCount(),
k_i,
k_row;
if (k_dataStore.isFiltered()) {
for (k_i = 0; k_i < k_cnt; k_i++) {
k_row = k_checkedRows.get(k_i);
if (-1 !== k_dataStore.indexOf(k_row)) {
k_returnedCheckedRows.push(k_row);
}
}
}
else {
k_returnedCheckedRows = k_returnedCheckedRows.concat(k_checkedRows.items);
}
return k_returnedCheckedRows;
},

k_onViewRefresh: function (k_extGridView) {
var
k_kerioProperties = this._kx,
k_checkedRows = k_kerioProperties.k_checkedRows,
k_cnt = k_checkedRows.getCount(),
k_dataStore = this.grid.store,
k_i,
k_rowIndex;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_rowIndex = k_dataStore.indexOf(k_checkedRows.get(k_i));
if (-1 !== k_rowIndex) {
k_extGridView.addRowClass(k_rowIndex, 'checkedRow');
}
}
if (k_kerioProperties.k_isAllChecked && (this.grid.store.getCount() !== k_cnt)) {
k_kerioProperties.k_isAllChecked = false;
this._kxp.k_updateHeaderCbx.call(this);
}
this.fireEvent('checkchanged', this);
},

k_clearCheckedOnStoreChanged: function () {
var k_kerioProperties = this._kx;
k_kerioProperties.k_checkedRows.clear();
k_kerioProperties.k_isAllChecked = false;
this._kxp.k_updateHeaderCbx.call(this);
this.fireEvent('checkchanged', this);
},

k_updateHeaderCbx: function () {
var
k_headerCheckboxEl = this._kx.k_headerCheckboxEl,
k_isAllChecked = this._kx.k_isAllChecked;
if (!k_headerCheckboxEl) {
return;
}
k_headerCheckboxEl[k_isAllChecked ? 'addClass' : 'removeClass']('x-grid3-hd-checker-on');
},

k_initEventOnRender: function () {
var
k_view = this.grid.getView(),
k_kerioPrototype = this._kxp;
k_view.mainBody.on('mousedown', k_kerioPrototype.k_onMouseDown, this);
k_view.on('refresh', k_kerioPrototype.k_onViewRefresh, this);
k_kerioPrototype.k_addHeaderHandlers.call(this);
},

k_addHeaderHandlers: function() {
var
k_view = this.grid.getView(),
k_cbxEl = Ext.fly(k_view.innerHd).child('.x-grid3-hd-checker');
Ext.EventManager.removeListener(k_cbxEl, 'mousedown', this._kxp.k_onHdMouseDown, this);
k_cbxEl.on('mousedown', this._kxp.k_onHdMouseDown, this);
kerio.lib._k_addKerioProperty(this, {k_headerCheckboxEl: k_cbxEl});
},

k_onMouseDown: function (k_event, k_target) {
var
k_row,
k_index,
k_isChecked;
if (!kerio.lib._k_isContextMenuAllowed(k_event) && ('x-grid3-row-checker' === k_target.className)) {
k_event.stopEvent();
k_row = k_event.getTarget('.x-grid3-row');
if (k_row) {
k_index = k_row.rowIndex;
k_isChecked = this._kxp.k_isChecked.call(this, k_index);
this._kxp[k_isChecked ? 'k_uncheckRow' : 'k_checkRow'].call(this, k_index);
this.selectRow(k_index);
this.grid.getView().focusRow(k_index);
}
}
},

k_onHdMouseDown: function (k_event, k_target) {
k_event.stopEvent();
this._kxp[this._kx.k_isAllChecked ? 'k_uncheckAll' : 'k_checkAll'].call(this);
this._kxp.k_updateHeaderCbx.call(this);
}
});

Ext.grid.GridView.prototype.findCell = function(el){
if(!el){
return false;
}
var
k_depth = kerio.lib.k_isAndroidTablet ? 7 : 5;
return this.fly(el).findParent(this.cellSelector, k_depth);  };


kerio.lib._K_GridBufferView = function (k_config) {
this._k_hasMultilineRenderer = true === k_config.k_hasMultilineRenderer;
delete k_config.k_hasMultilineRenderer;
if (this._k_hasMultilineRenderer) {
this._k_bufferViewLimit = 20;
}
kerio.lib._K_GridBufferView.superclass.constructor.call(this, k_config);
this.renderTask = new Ext.util.DelayedTask(this.doUpdate, this);
};
Ext.extend(kerio.lib._K_GridBufferView, Ext.ux.grid.BufferView, {

scrollDelay: 10, _k_bufferViewLimit: 200, _k_updateStarted: false,

_k_useBufferView: function() {
return this.ds.getCount() > this._k_bufferViewLimit;
},

doRender: function (cs, rs, ds, startRow, colCount, stripe, onlyBody, onlyVisible) {
var
k_result,
k_grid,
k_selectionModel,
k_scrollOffset,
k_updateScrollOffset;
if (Ext.isIE) {
k_updateScrollOffset = !(this.mainBody.getWidth() < 20 || this.mainBody.getHeight() < 20);
}
else { k_updateScrollOffset = Boolean(this.mainBody.dom.offsetParent);
}
if (k_updateScrollOffset) { k_grid = this.grid._kx && this.grid._kx.k_owner;
if (this.ds.getCount() * this.getCalculatedRowHeight() > this.scroller.dom.clientHeight) {
k_scrollOffset = kerio.lib.k_getScrollbarSize().k_width + 2;
}
else {
k_scrollOffset = 2;
}
if (k_scrollOffset !== this.scrollOffset) {
this.scrollOffset = k_scrollOffset;
if (k_grid) {
k_grid._k_scrollOffset = k_scrollOffset;
}
delete this.lastViewWidth; this.updateHeaders();
this.updateHeaderSortState();
this.layout();
k_selectionModel = this.grid.getSelectionModel();
if (k_selectionModel instanceof kerio.lib._K_CheckboxSelectionModel) {
k_selectionModel._kxp.k_addHeaderHandlers.call(k_selectionModel);
}
cs = this.getColumnData(); }
}
if (undefined === onlyVisible) {
onlyVisible = this._k_useBufferView();
if (this._k_hasMultilineRenderer) {
onlyVisible = false;
}
}
k_result = this.constructor.superclass.doRender.call(this, cs, rs, ds, startRow, colCount, stripe, onlyBody, onlyVisible);
return k_result;
},

clean: function(k_prevVisibleRows){
this.doClean(k_prevVisibleRows);
},

doClean: function(k_prevVisibleRows) {
if (!this._k_useBufferView() || (this.getVisibleRowCount() <= 0) || !k_prevVisibleRows) {
return;
}
var
vr = this.getVisibleRows(),
k_prevVisibleFirstRow = k_prevVisibleRows.first,
k_prevVisibleLastRow = k_prevVisibleRows.last,
k_hasMultilineRenderer = this._k_hasMultilineRenderer,
k_i = 0,
rows,
row,
len;
if (-1 === k_prevVisibleLastRow) {
return;
}
rows = this.getRows();
if (!rows.item) {
return;
}
k_prevVisibleFirstRow -= this.cacheSize;
k_prevVisibleLastRow += this.cacheSize;
k_prevVisibleFirstRow = k_prevVisibleFirstRow < 0 ? 0 : k_prevVisibleFirstRow;
k_prevVisibleLastRow = k_prevVisibleLastRow > this.ds.getCount() ? this.ds.getCount() : k_prevVisibleLastRow;
for (k_i = k_prevVisibleFirstRow; k_i < k_prevVisibleLastRow; k_i++) {
if (k_i < vr.first || k_i > vr.last) {
row = rows.item(k_i);
if (row && row.hasChildNodes()) {
if (k_hasMultilineRenderer && 'auto' === row.style.height) {
row.style.height = Ext.Element.prototype.addUnits(row.clientHeight);
}
row.innerHTML = '';
}
}
}
},

update: function(){
this.renderTask.delay(this.scrollDelay);
},

doUpdate: function(){
var
k_useBufferView = this._k_useBufferView(),
g = this.grid,
cm = g.colModel,
ds = g.store,
k_areAllVisibleRowsRendered,
html,
row,
cs,
vr,
i, cnt;
if (!k_useBufferView) {
k_areAllVisibleRowsRendered = true;
for (i = 0, cnt = ds.getCount() - 1; i <= cnt; i++) {
if (!this.isRowRendered(i)) {
k_areAllVisibleRowsRendered = false;
break;
}
}
if (k_areAllVisibleRowsRendered) {
return;
}
}
if (this.getVisibleRowCount() > 0) {
cs = this.getColumnData();
vr = this.getVisibleRows();
if (!k_useBufferView) {
vr = {
first: 0,
last: ds.getCount() - 1
};
}
for (i = vr.first; i <= vr.last; i++) {
if (!this.isRowRendered(i) && (row = this.getRow(i))) {
html = this.doRender(cs, [ds.getAt(i)], ds, i, cm.getColumnCount(), g.stripeRows, true, k_useBufferView);
row.innerHTML = html;
}
}
if (k_useBufferView && this._k_prevVisibleRows) {
this.clean(this._k_prevVisibleRows);
}
else if (!k_useBufferView) {
this.processRows();
}
this._k_prevVisibleRows = k_useBufferView ? vr : undefined;
if (this._k_hasMultilineRenderer) {
g._kx.k_owner._k_addHandlersForMultilineCells();
}
}
},

isRowRendered: function(index){
var row = this.getRow(index);
return row && row.hasChildNodes();
},

updateAllColumnWidths: function(){
var tw   = this.getTotalWidth(),
clen = this.cm.getColumnCount(),
ws   = [],
len,
i;
for(i = 0; i < clen; i++){
ws[i] = this.getColumnWidth(i);
}
var
k_tmpNode;
k_tmpNode = this.innerHd.firstChild;
k_tmpNode.style.width = this.getOffsetWidth();
k_tmpNode.firstChild.style.width = tw;
this.mainBody.dom.style.width = tw;
for(i = 0; i < clen; i++){
var hd = this.getHeaderCell(i);
hd.style.width = ws[i];
}
var ns = this.getRows(), row, trow;
for(i = 0, len = ns.length; i < len; i++){
row = ns.item(i);
row.style.width = tw;
k_tmpNode = row.firstChild;
if(k_tmpNode && k_tmpNode.rows){
k_tmpNode.style.width = tw;
trow = k_tmpNode.rows[0];
for (var j = 0; j < clen; j++) {
trow.childNodes[j].style.width = ws[j];
}
}
}
this.onAllColumnWidthsUpdated(ws, tw);
},

updateColumnWidth: function(col, width){
var w = this.getColumnWidth(col);
var tw = this.getTotalWidth();
var k_tmpNode;
k_tmpNode = this.innerHd.firstChild;
k_tmpNode.style.width = this.getOffsetWidth();
k_tmpNode.firstChild.style.width = tw;
this.mainBody.dom.style.width = tw;
var hd = this.getHeaderCell(col);
hd.style.width = w;
var ns = this.getRows(), row,
i, len;
for(i = 0, len = ns.length; i < len; i++){
row = ns.item(i);
row.style.width = tw;
k_tmpNode = row.firstChild;
if(k_tmpNode && k_tmpNode.rows){
k_tmpNode.style.width = tw;
k_tmpNode.rows[0].childNodes[col].style.width = w;
}
}
this.onColumnWidthUpdated(col, w, tw);
},

updateColumnHidden: function(col, hidden){
if (!this._k_useBufferView()) {
this.constructor.superclass.updateColumnHidden.apply(this, arguments);
return;
}
var
tw = this.getTotalWidth(),
k_tmpNode = this.innerHd.firstChild,
display = hidden ? 'none' : '',
hd = this.getHeaderCell(col),
ns = this.getRows(),
row, i, len;
k_tmpNode.style.width = this.getOffsetWidth();
k_tmpNode.firstChild.style.width = tw;
this.mainBody.dom.style.width = tw;
hd.style.display = display;
for(i = 0, len = ns.length; i < len; i++){
row = ns.item(i);
row.style.width = tw;
k_tmpNode = row.firstChild;
if(k_tmpNode){
k_tmpNode.style.width = tw;
k_tmpNode.rows[0].childNodes[col].style.display = display;
}
}
this.onColumnHiddenUpdated(col, hidden, tw);
delete this.lastViewWidth; this.layout();
},

processRows: function(startRow, skipStripe) {
if (this._k_updateStarted) {
return;
}
if (!this.ds || this.ds.getCount() < 1) {
return;
}
var rows = this.getRows(),
len  = rows.length,
i, r;
skipStripe = skipStripe || !this.grid.stripeRows;
startRow   = startRow   || 0;
for (i = 0; i<len; i++) {
r = rows.item(i);
if (r) {
r.rowIndex = i;
if (!skipStripe) {
r.className = r.className.replace(this.rowClsRe, ' ');
if ((i + 1) % 2 === 0){
r.className += ' x-grid3-row-alt';
}
}
}
}
if (startRow === 0) {
Ext.fly(rows[0]).addClass(this.firstRowCls);
}
Ext.fly(rows[rows.length - 1]).addClass(this.lastRowCls);
},

getCell: function (k_row, k_col, k_hscroll) {
var
k_grid = this.grid,
k_store = k_grid.store,
k_kerioWidget,
k_html;
if (!this.isRowRendered(k_row)) {
k_html = this.doRender(this.getColumnData(), [k_store.getAt(k_row)], k_store, k_row, k_grid.colModel.getColumnCount(),  k_grid.stripeRows, true, false);
this.getRow(k_row).innerHTML = k_html;
}
k_kerioWidget = (k_grid._kx && k_grid._kx.k_owner) || {
_k_hasInlineEditors: false,
_k_hasMultilineRenderer: false
};
if (k_kerioWidget._k_hasMultilineRenderer && k_kerioWidget._k_hasInlineEditors) {
return this._k_getCellMultilineRenderer(k_row, k_col);
}
return kerio.lib._K_GridBufferView.superclass.getCell.apply(this, arguments);
},

_k_getCellMultilineRenderer: function (k_row, k_col) {
return Ext.get(this.getRow(k_row)).query('td.x-grid3-cell')[k_col];
},

k_beginUpdate: function () {
this._k_updateStarted = true;
},

k_endUpdate: function () {
this._k_updateStarted = false;
this.processRows();
if (this.ds) {
this.syncFocusEl(this.ds.getCount());
}
},

syncFocusEl: function () {
if (this._k_updateStarted) {
return;
}
kerio.lib._K_GridBufferView.superclass.syncFocusEl.apply(this, arguments);
},

_k_doCleanOnRefresh: function () {
var
k_dataCount = this.grid.getStore().getCount(),
k_visibleRows;
if (0 === k_dataCount) {
return;
}
k_visibleRows = this.getVisibleRows();
if (k_visibleRows.first > 0) {
this._k_prevVisibleRows = {
first: 0,
last:  k_visibleRows.first - 1
};
this.clean(this._k_prevVisibleRows);
}
if (k_visibleRows.last < k_dataCount - 1) {
this._k_prevVisibleRows = {
first: k_visibleRows.last + 1,
last:  k_dataCount - 1
};
this.clean(this._k_prevVisibleRows);
}
},

getVisibleRows: function () {
if (!this._k_hasMultilineRenderer) {
return kerio.lib._K_GridBufferView.superclass.getVisibleRows.apply(this, arguments);
}
var
k_rows = this.mainBody.select('.x-grid3-row').elements,
k_scrollTop = this.scroller.dom.scrollTop,
k_viewHeight = this.scroller.getHeight(),
k_first = null,
k_last = null,
k_rowOffsetTop,
k_rowEl,
k_i,
k_cnt;
for (k_i = 0, k_cnt = k_rows.length; k_i < k_cnt; k_i++) {
k_rowEl = k_rows[k_i];
k_rowOffsetTop = k_rowEl.offsetTop;
if (null === k_first && k_rowOffsetTop + Ext.fly(k_rowEl).getHeight() > k_scrollTop) {
k_first = k_i;
}
if (null === k_last && k_rowOffsetTop > k_scrollTop + k_viewHeight) {
k_last = k_i - 1;
}
if (null !== k_first && null !== k_last) {
break;
}
}
return {
first: k_first,
last: null !== k_last ? k_last : k_rows.length - 1
};
},

getVisibleRowCount: function () {
if (!this._k_hasMultilineRenderer) {
return kerio.lib._K_GridBufferView.superclass.getVisibleRowCount.apply(this, arguments);
}
var k_visibleRows = this.getVisibleRows();
return k_visibleRows.last - k_visibleRows.first + 1;
},

getStyleRowHeight: function () {
if (!this._k_hasMultilineRenderer) {
return kerio.lib._K_GridBufferView.superclass.getStyleRowHeight.apply(this, arguments);
}
return 'auto';
},

_k_resetHeightOfMultilineCells: function() {
var
k_currentBody = this.dom.parentNode.parentNode,
k_currentRowEl = this.parent('.x-grid3-row');
k_currentRowEl.setHeight('auto');
if (k_currentBody === k_currentBody.parentNode.tBodies[0]) {
this._kx.k_owner.k_extWidget.getView().doUpdate();
}
},

init: function () {
var
k_extGrid,
k_grid;
kerio.lib._K_GridBufferView.superclass.init.apply(this, arguments);
if (this._k_hasMultilineRenderer) {
k_extGrid = this.grid;
k_grid = k_extGrid._kx.k_owner;
k_extGrid.on('viewready', this._k_doCleanOnRefresh, this);
this.on('refresh', this._k_doCleanOnRefresh, this);
k_extGrid.getColumnModel().on('hiddenchange', this.refresh, this);
k_grid._k_clickOnCollapsibleCell = k_grid._k_clickOnCollapsibleCell.createSequence(
this._k_resetHeightOfMultilineCells
);
}
}
});


kerio.lib._K_StatusProxy = function (k_config) {
kerio.lib._K_StatusProxy.superclass.constructor.call(this, k_config);
};
Ext.extend(kerio.lib._K_StatusProxy, Ext.dd.StatusProxy,
{

reset: function () {
kerio.lib._K_StatusProxy.superclass.reset.call(this);
this.el.addClass('gridDragGhost');
}
});

kerio.lib._K_GridRowDragZone = function(k_grid, k_config) {
var
k_gridEl = k_grid.getGridEl(),
k_colModelCfg = k_grid.colModel.config,
k_view = k_grid.getView(),
k_dragProxyColId,
k_handleMouseDown,
k_i, k_cnt;
this._k_grid = k_grid;
if (k_config.k_dragColumnId) {
k_dragProxyColId = k_config.k_dragColumnId;
}
else {
for (k_i = 0, k_cnt = k_colModelCfg.length; k_i < k_cnt; k_i++) {
if (true !== k_colModelCfg[k_i].hidden && k_colModelCfg[k_i].dataIndex !== k_grid.store.groupField) {
k_dragProxyColId = k_colModelCfg[k_i].dataIndex;
break;
}
}
}
this._k_dragProxyColId = k_dragProxyColId;
delete k_config.k_dragColumnId;
k_gridEl.on({
'keydown': this._k_onKeyDown,
'keyup': this._k_onKeyUp,
scope: this
});
k_handleMouseDown = k_grid.getSelectionModel().handleMouseDown;
k_grid.un('rowmousedown', k_handleMouseDown);
k_grid.on('rowclick', this.k_handleMouseClick);
this._k_onBeforeDrag = k_config.k_onBeforeDrag;
delete k_config.k_onBeforeDrag;
this.proxy = new kerio.lib._K_StatusProxy();
kerio.lib._K_GridRowDragZone.superclass.constructor.call(this, k_view.mainBody.dom, k_config);
if(k_view.lockedBody){
this.setHandleElId(Ext.id(k_view.mainBody.dom));
this.setOuterHandleElId(Ext.id(k_view.lockedBody.dom));
}
};
Ext.extend(kerio.lib._K_GridRowDragZone, Ext.dd.DragZone,
{
containerScroll: true,
_k_maxDragRows: 10,        _k_regExpNbsp: new RegExp('&nbsp;', 'g'),

getDragData : function(k_event){
var
k_targer = Ext.lib.Event.getTarget(k_event),
k_grid = this._k_grid,
k_view = k_grid.getView(),
k_rowIndex = k_view.findRowIndex(k_targer),
k_store = k_grid.store,
k_rowEls = [],
k_data = [],
k_srcIndexes = [],
k_index,
k_record,
k_selections,
k_collection,
k_sm,
k_i, k_cnt;
if(k_rowIndex === false){
return false;
}
k_sm = k_grid.getSelectionModel();
if (Ext.isIE && k_grid.activeEditor && k_grid.activeEditor.field instanceof Ext.form.TriggerField) {
k_grid.activeEditor.field.mimicBlur(k_event);
}
if (!k_sm.isSelected(k_rowIndex) && (undefined === this._k_onBeforeDrag || !k_event.hasModifier()) || (k_event.hasModifier() && !k_event.ctrlKey)) {
k_sm.handleMouseDown(k_grid, k_rowIndex, k_event);
k_grid._kx._k_isMouseDownHandled = true;
}
else {
k_grid._kx._k_isMouseDownHandled = false;
}
k_selections = k_sm.getSelections();
k_collection = new Ext.util.MixedCollection();
k_collection.addAll(k_selections);
k_collection.sort('ASC', function (k_itemA, k_itemB) {
var k_store = k_itemA.store;
return k_store.indexOf(k_itemA) - k_store.indexOf(k_itemB);
});
k_selections = k_collection.items;
for (k_i = 0, k_cnt = k_selections.length; k_i < k_cnt; k_i++) {
k_record = k_selections[k_i];
k_index = k_store.indexOf(k_record);
k_data.push(k_record.data);
k_srcIndexes.push(k_index);
k_rowEls.push(k_view.getRow(k_grid.store.indexOf(k_record)));
}
return {
k_grid: k_grid,
k_firstRowIndex: k_store.indexOf(k_selections[0]),
k_rowIndex: k_rowIndex,
k_selections: k_selections,
k_indexes: k_srcIndexes,
k_data: k_data,
k_rowEls: k_rowEls
};
},

handleMouseDown: function (k_event, k_oDD) {
if (0 !== k_event.button) {
return;
}
k_event = new Ext.EventObjectImpl(k_event.browserEvent);
kerio.lib._K_GridRowDragZone.superclass.handleMouseDown.call(this, k_event, k_oDD);
},

k_handleMouseClick: function(k_grid, k_rowIndex, k_event) {
var
k_sm = k_grid.getSelectionModel();
if (!k_grid._kx._k_isMouseDownHandled) {
k_sm.handleMouseDown(k_sm, k_rowIndex, k_event);
}
else {
k_grid._kx._k_isMouseDownHandled = false;
}
},

onInitDrag : function(k_x, k_y){
var
k_tmp = document.createElement('div'),
k_colIndex = this._k_grid.getColumnModel().findColumnIndex(this._k_dragProxyColId),
k_regExpNbsp = this._k_regExpNbsp,
k_i, k_cnt,
k_node,
k_rowCount = 0,
k_addingDots = false;
for (k_i = 0, k_cnt = this.dragData.k_rowEls.length; k_i < k_cnt; k_i++ ) {
k_node = Ext.fly(this.dragData.k_rowEls[k_i]).query('div.x-grid3-cell-inner')[k_colIndex];
if (k_node && k_rowCount < this._k_maxDragRows) {
k_node = k_tmp.appendChild(k_node.cloneNode(true));
if ('' === k_node.innerHTML.replace(k_regExpNbsp, '').trim()) {
k_node.innerHTML = this._k_emptyDraggedRowMsg;
Ext.fly(k_node).addClass('emptyDraggedRow');
}
k_rowCount++;
k_addingDots = false;
}
else {
if (!k_addingDots) {
k_addingDots = true;
k_node = document.createElement('div');
k_node.innerHTML = '...';
k_tmp.appendChild(k_node);
}
}
}
this._k_processDraggedRows('addClass', ['dragged']);
this.proxy.update(k_tmp);
this.onStartDrag(k_x, k_y);
return true;
},

onBeforeDrag: function (k_ddData, k_event) {
var
k_extGrid = this._k_grid,
k_grid = k_extGrid._kx.k_owner,
k_selections = k_extGrid.getSelectionModel().getSelections(),
k_widget = k_extGrid._kx.k_owner,
k_gridEl,
k_returnValue,
k_target,
k_toolTip;
if (k_widget.k_isReadOnly()) {
return false;
}
if (k_grid._k_hasInlineEditors && k_grid.k_isEditing() && k_extGrid.activeEditor) {
k_grid.k_stopCellEdit(!k_extGrid.activeEditor.field._kx.k_owner.k_isValid());
}
if (this._k_onBeforeDrag) {
k_returnValue = this._k_onBeforeDrag.call(k_widget, k_widget, k_ddData.k_data, k_ddData.k_firstRowIndex);
if (false === k_returnValue || 'string' === Ext.type(k_returnValue)) {
k_target = k_event.getTarget('.x-grid3-row', 20, true);
k_toolTip = this._k_dragNotAllowedToolTip;
if (!k_toolTip) {
k_gridEl = k_extGrid.getEl();
k_toolTip = new Ext.ToolTip({
header: true,
target: k_gridEl,
hidden: true,
trackMouse: true,
autoHide: false,
showDelay: 0,
listeners: {
show: this._k_onBodyMouseMove,
hide: this._k_unBodyMouseMove
}
});
k_gridEl.on({
'mousedown': this._k_onGridMouseDown,
'mouseup'  : k_toolTip.disable,
'mousemove': k_toolTip.onTargetOver,
scope: k_toolTip
});
this._k_dragNotAllowedToolTip = k_toolTip;
}
Ext.getBody().on('mouseup', k_toolTip.disable, k_toolTip, {single: true});
k_toolTip._k_targetRowDom = k_target.dom;
k_toolTip.setTitle(k_returnValue || k_widget._k_dragNotAllowedText);
k_toolTip.enable();
return false;
}
}
return kerio.lib._K_GridRowDragZone.superclass.onBeforeDrag.apply(this, arguments);
},

_k_onGridMouseDown: function (k_extEvent, k_targetEl) {
if (Ext.fly(k_targetEl).parent('div.x-grid3-row')) {
this.enable();
}
},

_k_onBodyMouseMove: function (k_toolTip) {
Ext.getBody().on('mousemove', k_toolTip.onMouseMove, k_toolTip);
},

_k_unBodyMouseMove: function (k_toolTip) {
Ext.getBody().un('mousemove', k_toolTip.onMouseMove, k_toolTip);
},

_k_hideToolTipOnMouseOut: function (k_event) {
if (k_event.getTarget('.x-grid3-row') !== this._k_targetRowDom) {
this.disable();
}
},

_k_onKeyDown: function (k_event) {
var k_proxy = this.proxy;
if (!this.dragging) {
return;
}
if (k_event.getKey() === Ext.EventObject.ESC) {
this.cacheTarget = null;
if (this.dragData && this.dragData.k_data) {
k_proxy.repair(this.getRepairXY(k_event, this.dragData), this.afterRepair, this);
}
}
else if (k_event.getKey() === Ext.EventObject.CONTROL) {
k_proxy.el.removeClass(k_proxy.dropAllowed);
k_proxy.el.addClass(k_proxy.dropAllowed + '-add');
this._k_processDraggedRows('removeClass', ['dragged']);
}
},

_k_onKeyUp: function (k_event) {
var k_proxy;
if (k_event.getKey() === Ext.EventObject.CONTROL && this.dragging) {
k_proxy = this.proxy;
k_proxy.el.removeClass(k_proxy.dropAllowed + '-add');
k_proxy.el.addClass(k_proxy.dropAllowed);
this._k_processDraggedRows('addClass', ['dragged']);
}
},

afterRepair : function(){
var k_data = this.dragData;
this.dragging = false;
this._k_grid.getSelectionModel().selectRecords(k_data.k_selections);
this._k_grid.getView().focusRow(k_data.k_rowIndex);
this._k_processDraggedRows('removeClass', ['dragged']);
},

getRepairXY : function(k_event, k_data){
var k_xy;
try {
k_xy = Ext.lib.Dom.getXY(k_data.k_rowEls[0]);
}
catch (k_ex) {
k_xy = Ext.lib.Dom.getXY(k_data.k_grid.el);
}
return k_xy;
},

hideProxy: function () {},

_k_animateDrop: function (k_el) {
this.proxy.repair(Ext.lib.Dom.getXY(k_el), this._k_repairCallback, this);
},

_k_repairCallback: function () {
kerio.lib._K_GridRowDragZone.superclass.hideProxy.apply(this, arguments);
this._k_processDraggedRows('removeClass', ['dragged']);
},

_k_processDraggedRows: function (k_functionName, k_arguments) {
var
k_els = this.dragData.k_rowEls,
k_i, k_cnt,
k_el;
for (k_i = 0, k_cnt = k_els.length; k_i < k_cnt; k_i++) {
k_el = Ext.get(k_els[k_i]);
k_el[k_functionName].apply(k_el, k_arguments);
}
}
});

kerio.lib._K_GridRowDropZone = function(k_grid, k_config) {
this._k_grid = k_grid;
this._k_onDrag = k_config.k_onDrag;
delete k_config.k_onDrag;
this._k_onDrop = k_config.k_onDrop;
delete k_config.k_onDrop;
this._k_useDropProxy = false !== k_config.k_useDropProxy;
delete k_config.k_useDropProxy;
if (this._k_useDropProxy) {
this._k_proxyLeft = Ext.DomHelper.append(document.body, {
tag: 'div',
cls: 'rowMoveLeft',
html: '&#160;'
}, true);
this._k_proxyRight = Ext.DomHelper.append(document.body, {
tag: 'div',
cls: 'rowMoveRight',
html: '&#160;'
}, true);
}
kerio.lib._K_GridRowDropZone.superclass.constructor.call(this, k_grid.view.scroller.dom, k_config);
};
Ext.extend(kerio.lib._K_GridRowDropZone, Ext.dd.DropZone,
{
containerScroll: true,
_k_copyOnCtrlKey: true, 
notifyEnter: function () {
var
k_mainWrap,
k_left,
k_view;
if (!this._k_useDropProxy) {
return;
}
this._k_grid.addClass('hideRowHighlighting');
k_view = this._k_grid.getView();
k_mainWrap = k_view.mainWrap;
k_left = k_mainWrap.getLeft();
this._k_proxyLeft.setLeft(k_left - this._k_proxyLeft.getWidth());
this._k_proxyRight.setLeft(k_left + k_mainWrap.getWidth() - k_view.scrollOffset);
},

onContainerOver: function(k_ddSource, k_event, k_ddData){
if (!k_ddSource.dragging) {
return;
}
if (this._k_grid._kx.k_owner.k_isReadOnly()) {
if (this._k_useDropProxy) {
if (this._k_isProxyVisible()) {
this._k_showProxy(false);
}
}
this._k_isDropAllowed = false;
return this.dropNotAllowed;
}
var
k_destGrid = this._k_grid,
k_target = k_event.getTarget(),
k_targetIndex = k_destGrid.getView().findRowIndex(k_target),
k_widget = k_destGrid._kx.k_owner,
k_targetRowEl,
k_targetRowCenter,
k_proxyTop,
k_className,
k_mouseY,
k_removeClassList;
this._k_clearDDStyles();
if ('number' === Ext.type(k_targetIndex)) {
k_targetRowEl = Ext.get(k_destGrid.getView().getRow(k_targetIndex));
k_targetRowCenter = k_targetRowEl.getY() + Math.floor(k_targetRowEl.getHeight() / 2);
k_mouseY = k_event.getXY()[1];
this._k_point = k_mouseY >= k_targetRowCenter ? 'k_below' : 'k_above';
}
else {
k_targetIndex = k_destGrid.store.getCount() - 1;
this._k_point = 'k_below';
k_targetRowEl = Ext.get(k_destGrid.view.getRow(k_targetIndex));
}
this._k_isDropAllowed = true;
if (this._k_onDrag) {
if (false === this._k_onDrag.call(k_widget,
k_widget,
k_ddData.k_data,
k_ddData.k_rowIndex,
k_targetIndex + ('k_below' === this._k_point ? +1 : 0),
true === k_event.ctrlKey
)
) {
this._k_isDropAllowed = false;
}
}
if (this._k_useDropProxy) {
if (!this._k_isProxyVisible()) {
this._k_showProxy();
}
k_proxyTop = k_targetRowEl.getY() - (Math.round(this._k_proxyLeft.getHeight() / 2));
if ('k_below' === this._k_point) {
k_proxyTop += k_targetRowEl.getHeight();
}
this._k_setProxyTop(k_proxyTop);
}
k_removeClassList = ['notAllowed'];
if (this._k_isDropAllowed) {
if ('k_below' === this._k_point) {
k_targetRowEl.addClass('gridRowInsertBottomLine');
k_removeClassList.push('gridRowInsertTopLine');
}
else if ('k_above' === this._k_point) {
k_targetRowEl.addClass('gridRowInsertTopLine');
k_removeClassList.push('gridRowInsertBottomLine');
}
}
k_targetRowEl.removeClass(k_removeClassList);
if (false === this._k_isDropAllowed) {
k_className = this.dropNotAllowed;
this._k_addProxyClass('notAllowed');
}
else {
k_className = this.dropAllowed;
this._k_removeProxyClass('notAllowed');
}
this._k_overRow = k_targetRowEl;
this._k_targetIndex = k_targetIndex;
return k_className + (k_event.ctrlKey ? '-add' : '');
},

_k_isProxyVisible: function () {
return this._k_proxyLeft.isVisible() && this._k_proxyRight.isVisible();
},

_k_showProxy: function (k_show) {
if (false !== k_show) {
this._k_proxyLeft.show();
this._k_proxyRight.show();
}
else {
this._k_proxyLeft.hide();
this._k_proxyRight.hide();
}
},

_k_setProxyTop: function (k_top) {
this._k_proxyLeft.setTop(k_top);
this._k_proxyRight.setTop(k_top);
},

_k_addProxyClass: function (k_className) {
this._k_proxyLeft.addClass(k_className);
this._k_proxyRight.addClass(k_className);
},

_k_removeProxyClass: function (k_className) {
this._k_proxyLeft.removeClass(k_className);
this._k_proxyRight.removeClass(k_className);
},

notifyOut: function() {
this._k_clearDDStyles();
if (this._k_useDropProxy) {
this._k_showProxy(false);
this._k_grid.removeClass('hideRowHighlighting');
this._k_removeProxyClass('notAllowed');
}
},

_k_clearDDStyles: function() {
if (this._k_overRow) {
this._k_overRow.removeClass(['gridRowInsertBottomLine', 'gridRowInsertTopLine']);
}
},

onContainerDrop: function(k_ddSource, k_event, k_ddData) {
if (!k_ddSource.dragging) {
return;
}
if (true !== this._k_isDropAllowed) {
return false;
}
if (undefined === this._k_targetIndex) {
return;
}
var
k_grid = this._k_grid,
k_store = k_grid.store,
k_targetIndex = this._k_targetIndex,
k_records = k_ddSource.dragData.k_selections,
k_isCopy = k_event.ctrlKey,
k_isInternalMove = k_ddSource._k_grid === this._k_grid && !k_isCopy,   k_firstRowIndex = k_ddData.k_firstRowIndex,
k_indexes = k_ddData.k_indexes,
k_isContinuos = true,
k_insertRowIndex,
k_totalRows,
k_isLast,
k_i, k_cnt,
k_diff;
this._k_clearDDStyles();
k_targetIndex = k_targetIndex.constrain(0, k_store.getCount());
k_insertRowIndex = k_targetIndex;
k_isLast = k_insertRowIndex >= k_store.getCount() - 1;
if (k_store.getCount() - k_records.length <= 0) {
return false;
}
if (!k_isInternalMove) {  k_records = this._k_processRecords(k_records, k_ddSource._k_grid.store, k_isCopy);
}
if (!k_isLast) {
if ('k_above' === this._k_point) {
if (k_ddSource.dragData.k_rowIndex < k_targetIndex) {
k_insertRowIndex -= k_records.length;
}
}
else {
if (k_ddSource.dragData.k_rowIndex > k_targetIndex) {
k_insertRowIndex += 1;
}
}
}
k_totalRows = k_store.getCount();
k_insertRowIndex = k_insertRowIndex.constrain(0, k_totalRows - 1);
if ((k_isLast || k_isCopy) && 'k_below' === this._k_point) {
k_insertRowIndex += 1;
}
if (k_isInternalMove) {
k_targetIndex = k_targetIndex.constrain(0, k_totalRows - 1);
k_diff = k_targetIndex - k_firstRowIndex;
for (k_i = 0, k_cnt = k_ddData.k_data.length; k_i < k_cnt; k_i++) {
if (k_indexes[k_i] !== k_firstRowIndex + k_i) {
k_isContinuos = false;
}
}
if (k_isContinuos && (-1 !== k_indexes.indexOf(k_targetIndex) || ('k_above' === this._k_point && k_targetIndex === k_firstRowIndex + k_cnt))) {
k_diff = 0;
}
if (k_diff) {
if (k_firstRowIndex > k_targetIndex) {  k_diff++;
}
if ('k_above' === this._k_point) {
k_diff--;
}
}
this._k_grid._kx.k_owner.k_moveSelectedRows(k_diff < 0, Math.abs(k_diff), true);
}
else {  for (k_i = 0, k_cnt = k_records.length; k_i < k_cnt; k_i++) {
k_store.insert(k_insertRowIndex + k_i, k_records[k_i]);
}
}
if (this._k_useDropProxy) {
this._k_showProxy(false);
this._k_grid.removeClass('hideRowHighlighting');
this._k_removeProxyClass('notAllowed');
}
return this._k_finishDrop(k_records, k_ddSource, k_isCopy);
},

_k_processRecords: function (k_records, k_sourceStore, k_isCtrlPressed) {
var
k_copy = this._k_copyOnCtrlKey && true === k_isCtrlPressed,
k_recordsCopy,
k_i, k_cnt;
if (!k_copy) {
for (k_i = 0, k_cnt = k_records.length; k_i < k_cnt; k_i++) {
k_sourceStore.remove(k_records[k_i]);
}
return k_records;
}
k_recordsCopy = [];
for (k_i = 0, k_cnt = k_records.length; k_i < k_cnt; k_i++) {
k_recordsCopy.push(new k_sourceStore.reader.recordType(kerio.lib._k_cloneObject(k_records[k_i].data)));
}
return k_recordsCopy;
},

_k_finishDrop: function (k_records, k_ddSource, k_isCopy, k_firstDraggedRow) {
var
k_target,
k_grid = this._k_grid,
k_widget = k_grid._kx.k_owner,
k_rowIndex = k_grid.store.indexOf(k_records[0]),
k_data = [],
k_view =k_grid.getView(),
k_i, k_cnt;
if (k_grid.store.remoteGroup) {
k_rowIndex = k_firstDraggedRow.k_rowIndex;
k_view.focusRow(k_rowIndex);
k_ddSource._k_animateDrop(k_firstDraggedRow.k_rowEl);
k_target = k_firstDraggedRow.k_destGroup;
}
else {
k_grid.getSelectionModel().selectRecords(k_records);
k_view.focusRow(k_rowIndex);
k_ddSource._k_animateDrop(k_view.getRow(k_rowIndex));
k_target = k_grid.store instanceof Ext.data.GroupingStore ? k_records[0].get(k_grid.store.groupField) : k_rowIndex;
}
if (this._k_onDrop) {
for (k_i = 0, k_cnt = k_records.length; k_i < k_cnt; k_i++) {
k_data.push(k_records[k_i].data);
}
this._k_onDrop.call(k_widget, k_widget, k_data, k_target, true === k_isCopy);
}
this._k_isDropAllowed = true;
return true;
}
});

kerio.lib._K_GroupingGridRowDropZone = function(k_grid, k_config) {
k_config.k_useDropProxy = false;
kerio.lib._K_GroupingGridRowDropZone.superclass.constructor.call(this, k_grid, k_config);
};
Ext.extend(kerio.lib._K_GroupingGridRowDropZone, kerio.lib._K_GridRowDropZone,
{
_k_groupElSelector: 'div.x-grid-group',
_k_overClass: 'insertToGroup',

onContainerOver: function(k_ddSource, k_event, k_ddData){
if (!k_ddSource.dragging) {
return;
}
if (this._k_grid._kx.k_owner.k_isReadOnly()) {
this._k_isDropAllowed = false;
return this.dropNotAllowed;
}
var
k_destGrid = this._k_grid,
k_widget = k_destGrid._kx.k_owner,
k_targetGroupEl = k_event.getTarget(this._k_groupElSelector, k_destGrid.getGridEl(), true),
k_groupEls = k_destGrid.getView().mainBody.query(this._k_groupElSelector),
k_isOwenGroup = false,
k_i, k_cnt;
this._k_clearDDStyles();
if (!k_targetGroupEl) {
k_targetGroupEl = Ext.get(k_groupEls[k_groupEls.length - 1]);
}
this._k_overEl = k_targetGroupEl;
for (k_i = 0, k_cnt = k_ddData.k_rowEls.length; k_i < k_cnt; k_i++) {
if (k_targetGroupEl.dom === Ext.fly(k_ddData.k_rowEls[k_i]).findParent(this._k_groupElSelector, k_destGrid.getGridEl(), false)) {
k_isOwenGroup = true;
break;
}
}
k_targetGroupEl.addClass('insertToGroup');
if (k_isOwenGroup || (!k_isOwenGroup && this._k_onDrag && false === this._k_onDrag.call(k_widget,
k_widget,
k_ddData.k_data,
k_ddData.k_rowIndex,
this._k_getGroupFromEl(k_event.getTarget()),
true === k_event.ctrlKey
)
)) {
this._k_isDropAllowed = false;
return this.dropNotAllowed;
}
this._k_isDropAllowed = true;
return this.dropAllowed;
},

onDragOut: function (k_event) {
this._k_clearDDStyles();
},

_k_clearDDStyles: function() {
if (this._k_overEl) {
this._k_overEl.removeClass(this._k_overClass);
}
},

_k_getGroupEl: function (k_el) {
var
k_grid = this._k_grid,
k_targetGroupEl = null;
if (k_el === k_grid.getView().scroller.dom) {
k_targetGroupEl = k_grid.getView().mainBody.last(this._k_groupElSelector);
}
else {
k_targetGroupEl = Ext.fly(k_el).findParent(this._k_groupElSelector, k_grid.getEl());
}
return k_targetGroupEl;
},

_k_getGroupFromEl: function (k_el) {
var
k_grid = this._k_grid,
k_view = k_grid.getView(),
k_idPrefix,
k_groupId,
k_groupEl;
k_groupEl = this._k_getGroupEl(k_el);
if (!k_groupEl) {
return null;
}
k_idPrefix = k_grid.getGridEl().id + '-gp-' + k_grid.store.groupField + '-';
k_groupId = k_groupEl.id.substr(k_idPrefix.length);
if (!isNaN(Number(k_groupId))) {
k_groupId = Number(k_groupId);
}
else {
k_groupId = Ext.util.Format.htmlDecode(k_groupId);
}
return k_groupId;
},

onContainerDrop: function(k_ddSource, k_event, k_ddData) {
if (!k_ddSource.dragging) {
return false;
}
if (true !== this._k_isDropAllowed) {
return false;
}
var
k_grid = this._k_grid,
k_store = k_grid.store,
k_records = k_ddSource.dragData.k_selections,
k_rowEls = [],
k_rows,
k_targetGroupEl,
k_firstDraggedRow,
k_rowEl,
k_group,
k_i, k_cnt;
this._k_clearDDStyles();
k_group = this._k_getGroupFromEl(k_event.getTarget());
if (k_store.remoteGroup) { k_targetGroupEl = this._k_getGroupEl(k_event.getTarget());
k_cnt = k_records.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_rowEls.push(k_grid.getView().getRow(k_store.indexOf(k_records[k_i])));
}
k_cnt = k_rowEls.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_rowEl = k_rowEls[k_i];
k_rowEl.parentNode.removeChild(k_rowEl);
Ext.fly(k_rowEl).removeClass('dragged');
k_targetGroupEl.appendChild(k_rowEl);
}
k_rows = Ext.get(k_targetGroupEl).query('.x-grid3-row');
k_firstDraggedRow = {
k_rowIndex: k_rows.length - k_cnt,
k_rowEl: k_rows[k_rows.length - k_cnt],
k_destGroup: k_group
};
}
else {
k_records = this._k_processRecords(k_records, k_ddSource._k_grid.store, k_event.ctrlKey);
for (k_i = 0, k_cnt = k_records.length; k_i < k_cnt; k_i++) {
k_records[k_i].data[k_store.groupField] = k_group;
k_store.addSorted(k_records[k_i]);
}
k_store.groupBy(k_store.groupField, true);
}
return this._k_finishDrop(k_records, k_ddSource, k_event.ctrlKey, k_firstDraggedRow);
}
});


kerio.lib.K_Grid = function(k_id, k_config) {
this._k_scrollOffset = 2;
this._k_currentTabIndex = 0;
this._k_plugins = [];
this.k_id = k_id;  this._k_setStoredProperties([
'k_emptyMsg',
'k_isPrinted',
'k_isPrintable',
'k_fieldset',
'k_isEnterMappedToDoubleClick',
'k_rowRenderer',
'k_contextMenu',
'_k_stateId',
'k_loadMask',
{'k_columns.k_grouping': 'k_grouping'},
'k_keepPagingVisible',
'k_isDragDropRow',
'k_dragColumnId',
'k_onBeforeDrag', 'k_onDrag', 'k_onDrop',
'k_isAutoSelectNewRow',
'k_isScrolledPositionKept',
'k_onRowSelect'
]);
if (kerio.lib.k_isIPadCompatible) {
kerio.lib.K_Grid.prototype._k_propertiesMapping.k_onCellDblClick = {k_extName: 'cellclick',    k_listener: 'this._k_onDblClickCell', k_scope: 'this'};
}
kerio.lib.K_Grid.superclass.constructor.call(this, k_id, k_config);
var k_extWidget = this.k_extWidget;

if (!k_config.k_isPrinted) {
k_extWidget.on('render', this._k_setFocusBehavior, this);
k_extWidget.on('render', this._k_reapplyClasses, this);
this._k_initGridEvents(k_config, k_extWidget);
}
if (k_config.k_update) {
this.k_update = k_config.k_update;
}
k_extWidget.on('resize', this._k_recalculateSpaceForScrollbar, this);
if (kerio.lib.k_isFirefox2) {
k_extWidget.on('mousedown', function(k_extEvent) {
if ('INPUT' !== k_extEvent.getTarget().tagName) {
k_extEvent.preventDefault();
}
});
}
if (this._k_isStateful) {
this._k_addSettingsChangeEvents([
'sortchange',
'columnresize',
'columnmove',
{
k_eventName: 'hiddenchange',
k_observable: this.k_extWidget.getColumnModel()
}
]);
}
if (kerio.lib.k_isIPadCompatible) {
this.k_iPadStatus = {
k_selectedRowIndex: -1,    k_extSelectedRowIndex: -1  };
k_extWidget._kx.origOnCellDblClick = k_extWidget.onCellDblClick;
k_extWidget.onCellDblClick = function(g, row, col) {
if (this._kx.k_owner.k_iPadStatus.k_extSelectedRowIndex !== row) {
this._kx.k_owner.k_iPadStatus.k_extSelectedRowIndex = row;
return true;
}
this._kx.origOnCellDblClick.call(this, g, row, col);
};
}
if (k_config.k_remoteData && this._k_isAutoLoaded) {
this.k_reloadData();
}
}; Ext.extend(kerio.lib.K_Grid, kerio.lib._K_ToolbarContainer,
{








































_k_isStateful: true,
k_eventTypes: kerio.lib.k_constants.k_EVENT.k_TYPES,
_k_selectionMode: {
k_NONE: 'k_none',
k_SINGLE: 'k_single',
k_MULTI: 'k_multi'
},

_k_propertiesDefault: {
autoExpandMax: 2500,
enableColumnHide: true,
enableColumnMove: true,
enableDragDrop: false,
loadMask: false,
sm: false,
trackMouseOver: true,
_kx: {
k_sorting: {
k_isAscending: true
},
k_paging: {
k_isPagingInHeader: true,
k_isPagingInFooter: false
}
}
},
_k_propertiesMapping: {
_kx: '_kx',
k_autoExpandColumn: 'autoExpandColumn',
k_autoExpandMin: 'autoExpandMin', k_isPagingInHeader: 'k_isPagingInHeader',
k_isPagingInFooter: 'k_isPagingInFooter',
k_pageSize: 'pageSize',
k_viewConfig: 'viewConfig',
k_forceFit: 'forceFit', k_className: 'cls',
k_isColumnHidable: 'enableColumnHide',
k_isColumnMovable: 'enableColumnMove',
k_isRowHighlighting: 'trackMouseOver',
k_title: 'title',  k_isRemoteGroup: 'remoteGroup',
k_loadMask: 'loadMask',
k_onClick:               {k_extName: 'rowclick'    , k_listener: 'this._k_onClickRow'    , k_scope: 'this'},
k_onDblClick:            {k_extName: 'rowdblclick' , k_listener: 'this._k_onDblClickRow' , k_scope: 'this'},
k_onCellDblClick:        {k_extName: 'celldblclick', k_listener: 'this._k_onDblClickCell', k_scope: 'this'},
k_onBeforeEdit:          {k_extName: 'beforeedit'  , k_listener: 'this._k_onBeforeGridEdit', k_scope: 'this'},
k_onBeforeCompleteEdit:  {k_extName: 'validateedit'  , k_listener: 'this._k_onBeforeCompleteGridEdit', k_scope: 'this'},
k_onBeforeRowCheck:      {k_extName: 'beforerowcheck'  , k_listener: 'this._k_onBeforeRowCheckHandler', k_scope: 'this'}
},
_k_columnPropertiesMapping: {
k_align: 'align',
k_caption: 'header',
k_columnId: 'dataIndex',
k_id: 'id',
k_isHidden: 'hidden',
k_isResizable: 'resizable',
k_isSortable: 'sortable',
k_width: 'width',
k_renderer         : {k_extName: 'renderer'     , k_handler: 'K_Grid.prototype._k_rendererHandler'},
k_multilineRenderer: {k_extName: 'renderer'     , k_handler: 'K_Grid.prototype._k_multilineRendererHandler'},
k_groupRenderer    : {k_extName: 'groupRenderer', k_handler: 'K_Grid.prototype._k_groupRendererHandler'}
},
_k_groupingMapping: {
k_columnId: 'groupField',
k_isInMenu: 'enableGroupingMenu',
k_isSwitchable: 'enableNoGroup',
k_template: 'groupTextTpl', k_startCollapsed: 'startCollapsed'
},
_k_groupingDefaults: {
hideGroupedColumn: true,
enableGroupingMenu: false,
enableNoGroup: false,
enableRowBody: false,
showGroupName: false
},

_k_extEditorInfoMapping: {
k_value: 'value',
k_cancel: 'cancel'
},

_k_groupCheckboxStates: {
k_CHECKED: 'checked',
K_UNCHECKED: 'unchecked',
k_SOME_CHECKED: 'someChecked'
},

_k_sharedProperties: {
k_printPreviewDialog: null
},


_k_STATUS_TYPE: {
k_SELECTED_ROW: 'SelectedRow'
},
_k_status: {},

_k_prepareConfig: function(k_config) {
var
k_addClassName = kerio.lib._k_addClassName,
k_toolbarPos,
k_toolbars,
k_button;
if (undefined !== k_config.k_className) {
this._k_coverClassName = k_config.k_className;
}
k_config.k_className = k_addClassName(k_config.k_className, 'baseGrid'); if (true === k_config.k_isCellBorderHidden) {
k_config.k_className = k_addClassName(k_config.k_className, 'gridNoCellBorders');
}
if (true === k_config.k_isRaster) {
k_config.k_className = k_addClassName(k_config.k_className, 'gridRaster');
}
if (k_config.k_isSelectedByCheckbox) {
this._k_isSelectedByCheckbox = true;
k_config.k_className = k_addClassName(k_config.k_className, 'selectionByCbx');
}
this._k_hasOnCellDblClickHandler = undefined !== k_config.k_onCellDblClick;
this._k_isRowHighlighting = false !== k_config.k_isRowHighlighting;
if (k_config.k_isPrintable) {
this._k_initialConfig = k_config;  }
if (k_config.k_dblClickMapToButton) {
k_toolbars = k_config.k_toolbars;
for (k_toolbarPos in k_toolbars) {
k_button = k_toolbars[k_toolbarPos].k_items[k_config.k_dblClickMapToButton];
if (k_button) {
if (!this._k_dblClickMappedButton) {
this._k_dblClickMappedButton = k_button;
}
else {
kerio.lib.k_reportError('Internal error: Button ID used in k_doubleClickMapToButton has to be unique across all grid\'s toolbars', 'grid.js', '_k_prepareConfig');
}
}
}
if (!k_config.k_onDblClick) {
k_config.k_onDblClick = Ext.emptyFn;
}
}
k_config = this._k_setColumnBehavior(k_config);
this._k_createSelectionModel(k_config);  this._k_createColumns(k_config);
this._k_createDataStore(k_config);		 this._k_setDataStoreBehavior(k_config);
return k_config;
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_grouping = k_storedConfig.k_grouping,
k_extWidget,
k_extGridView,
k_coveredWidget;
k_adaptedConfig.store = this._k_extDataStore;
k_adaptedConfig.cm = this._k_columnModel;
k_adaptedConfig.sm = this._k_extSelectionModel;
k_adaptedConfig = this._k_createToolbars(k_adaptedConfig);
k_adaptedConfig.viewConfig = k_adaptedConfig.viewConfig || {};
k_adaptedConfig.viewConfig.deferEmptyText = false;
k_adaptedConfig.viewConfig.splitHandleWidth = 15;
Ext.apply(k_adaptedConfig.viewConfig, {
emptyText: undefined === k_storedConfig.k_emptyMsg ? Ext.grid.GridView.prototype.emptyText : k_storedConfig.k_emptyMsg,
scrollOffset: 2,
listeners: {
rowsinserted: {fn: this._k_recalculateSpaceForScrollbar, scope: this},
rowremoved  : {fn: this._k_recalculateSpaceForScrollbar, scope: this}
}
});
if (Ext.isIE7 && !k_storedConfig.k_isPrinted) {
if (!k_adaptedConfig.viewConfig.templates) {
k_adaptedConfig.viewConfig.templates = {};
}
Ext.apply(k_adaptedConfig.viewConfig.templates, {
cell: new Ext.Template(
'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr} unselectable="on">',
'<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}><pre unselectable="on">{value}</pre></div>',
'</td>'
)
});
}
else {
k_adaptedConfig.cls = k_adaptedConfig.cls ? k_adaptedConfig.cls + ' whiteSpace' : 'whiteSpace';
}
k_adaptedConfig.id = this.k_id; k_adaptedConfig.viewConfig.enableRowBody = this._k_isColSpan;
this._k_isGrouping = false;
this._k_updateGroupingCheckboxesOnViewReady = true;
if (k_grouping) {
if (false === k_grouping.k_hasHeader) {
k_adaptedConfig.cls = k_adaptedConfig.cls ? (k_adaptedConfig.cls + ' noGroupHeader') : 'noGroupHeader';
k_grouping.k_template = '';
}
else {
this._k_groupCheckboxIdPrefix = this.k_id + '_' + 'k_groupingHeaderCheckbox' + '_';
this._k_hasGroupingCheckbox = undefined !== k_grouping.k_groupingCheckboxColumn;
this._k_onShowWholeGroupCustom = k_grouping.k_onShowWholeGroup;
this._k_updateGroupingCheckboxesOnViewReady = false !== k_grouping.k_updateCheckboxesOnViewReady;
this._k_groupingCheckboxColumn = k_grouping.k_groupingCheckboxColumn;
}
Ext.apply(k_adaptedConfig.viewConfig,
kerio.lib._k_createConfig.call(this, k_grouping, this._k_groupingDefaults, this._k_groupingMapping)
);
k_adaptedConfig.viewConfig.enableRowBody = this._k_isColSpan;
if (k_grouping.k_secondLevel) {
this._k_isDoubleGrouping = true;
this._k_secondLevelGrouping = k_grouping.k_secondLevel;
k_adaptedConfig.viewConfig.k_secondLevelGrouping = k_grouping.k_secondLevel;
k_adaptedConfig.view = new kerio.ext.ux.DoubleGroupingView(k_adaptedConfig.viewConfig);
}
else {
k_adaptedConfig.view = new Ext.grid.GroupingView(k_adaptedConfig.viewConfig);
}
delete k_adaptedConfig.viewConfig;
if (false === k_grouping.k_isCollapsible) {
k_adaptedConfig.view.interceptMouse = Ext.emptyFn;
k_adaptedConfig.cls = k_adaptedConfig.cls ? (k_adaptedConfig.cls + ' nonCollapsibleGroup') : 'nonCollapsibleGroup';
}
this._k_isGrouping = true;
this._k_groupBy = k_grouping.k_columnId;
}
else if (!this._k_isPaging && !k_storedConfig.k_isPrinted) {
k_adaptedConfig.view = new kerio.lib._K_GridBufferView(Ext.apply(k_adaptedConfig.viewConfig, {
k_hasMultilineRenderer: this._k_hasMultilineRenderer
}));
delete k_adaptedConfig.viewConfig;
}
k_adaptedConfig.plugins = this._k_plugins;
if (k_storedConfig.k_isPrinted) {  k_adaptedConfig.renderTo = 'k_printedBody';
k_adaptedConfig.stateId = k_storedConfig._k_stateId;
k_extWidget = new kerio.lib._K_PrinterGrid(k_adaptedConfig);
k_extWidget.on('render', this._k_formatForPrint, this);
}
else {
if (k_storedConfig.k_isPrintable) {  this._k_initialConfig._k_stateId = this.k_id;
k_adaptedConfig.stateId = this.k_id;
}
if (this._k_hasInlineEditors) {
k_extWidget = new Ext.grid.EditorGridPanel(k_adaptedConfig);
if (!this._k_mappedListeners.k_onBeforeEdit) {
k_extWidget.on('beforeedit', this._k_setEditInfo);
}
}
else {
k_extWidget = new Ext.grid.GridPanel(k_adaptedConfig);
}
k_extWidget.on('viewready', this._k_onViewReady, this);
if (this._k_isLocalData) {
k_extWidget.on('render', this._k_setPagingToolbarVisibility, this);
}
}
k_extGridView = k_extWidget.getView();
if (this._k_isColSpan || k_storedConfig.k_rowRenderer) {
k_extGridView.getRowClass = this._k_getRowClassHandler;
if (k_storedConfig.k_rowRenderer) {
this._k_rowRenderer = k_storedConfig.k_rowRenderer;
}
}
if (k_storedConfig.k_fieldset) {
this._k_fieldset = k_storedConfig.k_fieldset;
k_coveredWidget = this.k_extCover ? this.k_extCover : k_extWidget;
this.k_extCover = new Ext.form.FieldSet({
layout: 'fit',
title: this._k_fieldset,
items: k_coveredWidget,
cls: 'gridInFieldset gridFieldsetCover' + (this._k_coverClassName ? ' ' + this._k_coverClassName : ''),
listeners: {
render: function(k_extPanel) {
if (k_extPanel.ownerCt && k_extPanel.ownerCt.syncSize) {
k_extPanel.ownerCt.syncSize();
}
}
}
});
}
this._k_initSelectionStatus();
if (this._k_hasMultilineRenderer) {
if (true === this._k_isLocalData) {
k_extGridView.afterRender = k_extGridView.afterRender.createSequence(this._k_addHandlersForMultilineCells, this);
}
k_extGridView.on('refresh'     , this._k_addHandlersForMultilineCells, this);
k_extGridView.on('rowupdated'  , this._k_addHandlersForMultilineCells, this);
k_extGridView.on('rowsinserted', this._k_addHandlersForMultilineCells, this);
if (this._k_hasInlineEditors && !(k_extGridView instanceof kerio.lib._K_GridBufferView)) {
k_extGridView.getCell = kerio.lib._K_GridBufferView._k_getCellMultilineRenderer;
}
this._k_getCntVisibleRows = this._k_getCntVisibleRowsForMultiline;
}
if (this._k_isGrouping) {
if (this._k_onShowWholeGroupCustom) {
k_extGridView.on('beforegroupstatechanged', this._k_onShowWholeGroup, this);
}
if (this._k_hasGroupingCheckbox) {
k_extGridView.on('beforegroupstatechanged', this._k_onClickGroupingCheckbox, this);
}
k_extGridView.on('groupstatechanged', this._k_recalculateSpaceForScrollbar, this);
}
k_extWidget.on('render', this._k_applyEmptyText, this);
if (this._k_hasInlineEditors) {
k_extWidget.on('bodyscroll', this._k_alignEditorOnBodyScroll, this);
k_extWidget.on('focus', this._k_focusInlineEditor, this);
}
this._k_isEnterMappedToDoubleClick = (false !== k_storedConfig.k_isEnterMappedToDoubleClick);
if (true === this._k_isLocalData) {
k_extGridView.afterRender = k_extGridView.afterRender.createSequence(this._k_recalculateSpaceForScrollbar, this);
}
if (Ext.isWebKit || kerio.lib.k_isMSIE9) {
k_extGridView.on('rowupdated', this._k_fixScrollbars);
}
if (!k_storedConfig.k_isPrinted) {
k_extWidget.on({
'viewready': this._k_setLastVisibleColumnClassName,
'columnmove': this._k_setLastVisibleColumnClassName,
scope: k_extGridView
});
k_extGridView.onColumnHiddenUpdated = this._k_setLastVisibleColumnClassName;
}
return k_extWidget;
}, 
_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_extWidget = this.k_extWidget,
k_gridView;
var k_extDataStore = this._k_extDataStore;
kerio.lib.K_Grid.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
if (k_storedConfig.k_contextMenu) {
this.k_createContextMenu(k_storedConfig.k_contextMenu);
}
if (this._k_keptHiddenColumns) {
k_gridView = this.k_extWidget.getView();
k_gridView.beforeColMenuShow = k_gridView.beforeColMenuShow.createSequence(this._k_removeKeptHiddenColumnsFromHdMenu, this);
}
if (false !== k_storedConfig.k_loadMask) {
k_extDataStore.on('beforeload',     this._k_showLoadingMask.createDelegate(this, [true]), this);
k_extDataStore.on('load',           this._k_showLoadingMask.createDelegate(this, [false]), this);
k_extDataStore.on('loadexception',  this._k_showLoadingMask.createDelegate(this, [false]), this);
}
if (!this._k_isLocalData) {
if (this._k_isPaging) {
k_extDataStore.on('load', this._k_fixUnavailablePage, this);
}
k_extDataStore.on('loadexception',  this.k_clearData, this);
}
if (true === k_storedConfig.k_isDragDropRow) {
this._k_initDragDropRow();
}
if (this._k_isStateful) {
k_extWidget.on('columnresize', function (k_columnIndex) {
var k_extWidget = this.k_extWidget;
if (k_extWidget.autoExpandColumn === k_extWidget.getColumnModel().getDataIndex(k_columnIndex)) {
this._k_isAutoExpandColumnResized = k_columnIndex !== k_extWidget.getColumnModel().config.length - 1; }
}, this);
k_extWidget.on('columnmove', function (k_oldIndex, k_newIndex) {
var k_extWidget = this.k_extWidget;
if (k_extWidget.autoExpandColumn === k_extWidget.getColumnModel().getDataIndex(k_newIndex)) {
this._k_isAutoExpandColumnMoved = k_oldIndex === k_extWidget.getColumnModel().config.length - 1; }
}, this);
}
k_extWidget.on('headerdblclick', this._k_onHeaderDblClick, this);
this._k_initCheckAllMenu();
this._k_removeStoredProperties(['k_emptyMsg', 'k_isPrinted', 'k_isPrintable', 'k_fieldset', 'k_isEnterMappedToDoubleClick',
'k_rowRenderer', 'k_grouping', 'k_loadMask', 'k_isDragDropRow']);
this._k_isAutoSelectNewRow = false !== k_storedConfig.k_isAutoSelectNewRow;
this._k_isScrolledPositionKept = false !== k_storedConfig.k_isScrolledPositionKept;
this._k_setOnRowsInsertedHandler(true);
if (this._k_isScrolledPositionKept) {
if (this._k_isLocalData) {
k_extWidget.getView().refresh = k_extWidget.getView().refresh.createSequence(this._k_scrollToFirstSelectedRow, this);
}
else {
k_extWidget.getView().onLoad = k_extWidget.getView().onLoad.createInterceptor(this._k_keepScrolledPosition, this);
}
}
},

_k_setOnRowsInsertedHandler: function(k_enable) {
if (this._k_isAutoSelectNewRow && this._k_isLocalData) {
if (false !== k_enable) {
this.k_extWidget.getView().on('rowsinserted', this._k_selectNewRows, this);
this.k_extWidget.getView().on('firstrowinserted', this._k_selectNewRows, this);
}
else {
this.k_extWidget.getView().un('rowsinserted', this._k_selectNewRows, this);
this.k_extWidget.getView().un('firstrowinserted', this._k_selectNewRows, this);
}
}
},

_k_selectNewRows: function(k_extView, k_firstInsertedRow) {
this.k_selectRows(k_firstInsertedRow);
},

_k_keepScrolledPosition: function() {
if (this._k_isScrolledPositionKept) {
return false;
}
},

k_initStatus: function(k_status) {
if (this._k_STATUS_TYPE.k_SELECTED_ROW === k_status.k_type && this._k_isAutoSelectNewRow) {
this._k_status[this._k_STATUS_TYPE.k_SELECTED_ROW] = k_status;
}
},

k_applyStatus: function() {
var
k_selectedRow = this._k_status[this._k_STATUS_TYPE.k_SELECTED_ROW],
k_rowIndexList,
k_id;
if (k_selectedRow) {
k_id = k_selectedRow.k_id;
k_rowIndexList = this.k_findRow(this._k_dataStore._k_primaryKey, k_id);
if (-1 !== k_rowIndexList && 0 < k_rowIndexList.length) {
this.k_selectRows(k_rowIndexList[0]);
}
delete this._k_status[this._k_STATUS_TYPE.k_SELECTED_ROW];
}
else {
if (this._k_isAutoSelectNewRow && this._k_isScrolledPositionKept && 0 < this.k_selectionStatus.k_selectedRowsCount) {
this._k_scrollToFirstSelectedRow();
}
}
},

_k_fixUnavailablePage: function (k_extDataStore, k_records) {
var
k_totalItems = k_extDataStore.getTotalCount(),
k_pageSize = this.k_pageSize,
k_params = {};
if (k_totalItems > 0 && 0 === k_records.length) {
k_params.start = (Math.ceil(k_totalItems / k_pageSize) - 1) * k_pageSize;
this._k_dataStore.k_reloadData(k_params);
}
},

_k_createDataStore: function(k_config) {
if (k_config.k_remoteData && k_config.k_remoteData.k_jsonRpc && k_config.k_remoteData.k_jsonRpc.query && !k_config.k_remoteData.k_jsonRpc.params) {
k_config.k_remoteData.k_jsonRpc.params = {
query: k_config.k_remoteData.k_jsonRpc.query
};
delete k_config.k_remoteData.k_jsonRpc.query;
if (true === kerio.lib._k_debugMode) {
kerio.lib.k_warn('Grid \'' + this.k_id + '\': Check remote data definition! Param \'query\' has to be member of \'params\'.');
}
}
var k_dataStoreCfg = {
k_localData: k_config.k_localData,
k_remoteData: k_config.k_remoteData,
k_record: k_config.k_columns.k_items,
k_pageSize: k_config.k_pageSize,
k_sorting: k_config.k_columns.k_sorting,
k_grouping: k_config.k_columns.k_grouping,
k_onLoad: k_config.k_onLoad,
k_onLoadException: k_config.k_onLoadException
},
_k_dataStore,
k_additionalSortColumns = this._k_additionalSortColumns;
_k_dataStore = new kerio.lib._K_DataStore(this, k_dataStoreCfg);
if (k_additionalSortColumns) {
_k_dataStore._k_setAdditionalSortColumns(k_additionalSortColumns.k_columnId, k_additionalSortColumns.k_columns);
delete this._k_additionalSortColumns;
}
this._k_dataStore = _k_dataStore;
this._k_isLocalData = _k_dataStore._k_isLocalData;
this._k_extDataStore = _k_dataStore._k_dataStore;
this._k_isAutoLoaded = _k_dataStore._k_isAutoLoaded;
this.k_pageSize = _k_dataStore.k_pageSize;
this._k_isPaging = _k_dataStore._k_isPaging;
},

_k_createSelectionModel: function(k_config) {
var
k_extSelectionModel,
k_selectionMode = k_config.k_selectionMode || this._k_selectionMode.k_MULTI,
k_isSelection = (k_selectionMode !== this._k_selectionMode.k_NONE),
K_Constructor = this._k_isSelectedByCheckbox ? kerio.lib._K_CheckboxSelectionModel : kerio.lib._K_RowSelectionModel;
k_extSelectionModel = new K_Constructor({
singleSelect: k_selectionMode === this._k_selectionMode.k_SINGLE,
moveEditorOnEnter: false
});
k_extSelectionModel.on('beforerowselect', this._k_onBeforeRowSelect, this);
k_extSelectionModel.on('selectionchange', this._k_onSelectionChanged, this);
k_extSelectionModel.on('rangeselectionchange', this._k_onSelectionChanged, this);
k_extSelectionModel.on('rowselect', this._k_onRowSelect, this);
if (this._k_isSelectedByCheckbox) {
k_extSelectionModel.on('checkchanged', this._k_onCheckChanged, this);
if (k_config.k_onBeforeRowCheck) {
k_extSelectionModel.on('beforerowcheck', this._k_onBeforeRowCheckHandler, this);
}
}
this._k_extSelectionModel = k_extSelectionModel;
this._k_isSelection = k_isSelection;
this._k_isMultiSelection = k_isSelection && !k_extSelectionModel.singleSelect;
},

_k_initGridEvents: function(k_config, k_extWidget) {
k_extWidget.on('render', this._k_initKeyNav, this);
if (k_config.k_onFocus) {
this._k_onFocus = k_config.k_onFocus;
}
k_extWidget.on('rowclick', this._k_focusGridOnRowClick, this);
if (kerio.lib.k_isIPadCompatible) {
k_extWidget.on('render', this._k_setTouchEvents, this);
}
},

_k_setDataStoreBehavior: function(k_config) {
var k_dataStore = this._k_extDataStore;
k_dataStore.on({
'beforeload': this._k_onBeforeLoadStore,
'load': this._k_onStoreLoad,
'loadexception': function () {this.k_extWidget.removeClass('hiddenEmptyText');},
scope: this
});
},

_k_onStoreLoad: function (k_extStore, k_extRecords, k_options) {
this.k_applyStatus();
this._k_recalculateSpaceForScrollbar();
this.k_extWidget.removeClass('hiddenEmptyText');
this._k_setPagingToolbarVisibility();
if (this._k_hasGroupingCheckbox) {
this.k_updateAllGroupingCheckboxes(false);
}
},

_k_setColumnBehavior: function(k_config) {
var
k_columnsCfg = k_config.k_columns,
k_lastVisibleColumnId = '',
k_cntVisibleColumns = 0,
k_items = k_columnsCfg.k_items,
k_cntColumns = k_items.length,
k_groupingCfg = k_config.k_columns && k_config.k_columns.k_grouping,
k_lastVisibleColumnIndex = -1,
k_columnCfg,
k_i;
for (k_i = 0; k_i < k_cntColumns; k_i++) {
k_columnCfg = k_items[k_i];
if (true !== k_columnCfg.k_isHidden && true !== k_columnCfg.k_isDataOnly
&& (!k_groupingCfg || k_groupingCfg.k_columnId !== k_columnCfg.k_columnId)) {
k_lastVisibleColumnId = k_columnCfg.k_columnId;
k_lastVisibleColumnIndex = k_i;
k_cntVisibleColumns++;
}
}
if (false === k_columnsCfg.k_autoExpandColumn) {
delete k_columnsCfg.k_autoExpandColumn;
}
else if (undefined === k_columnsCfg.k_autoExpandColumn) {
k_columnsCfg.k_autoExpandColumn = k_lastVisibleColumnId;
}
this._k_cntVisibleColumns = k_cntVisibleColumns;
return k_config;
},

_k_getColumnConfigIndexById: function(k_columnItems, k_columnId) {
var
k_columnCfg,
k_i,
k_cnt;
for (k_i = 0, k_cnt = k_columnItems.length; k_i < k_cnt; k_i++) {
k_columnCfg = k_columnItems[k_i];
if (k_columnId === k_columnCfg.k_columnId) {
return k_i;
}
}
return null;
},

_k_setFocusBehavior: function (k_grid) {
var
k_focusEl = k_grid.getView().focusEl,
k_kerioWidget = k_grid._kx.k_owner;
k_focusEl.on('focus', this._k_onFocusGrid, k_kerioWidget);
k_focusEl.on('blur' , this._k_onBlurGrid , k_kerioWidget);
},

_k_onFocusGrid: function () {
this.k_extWidget.addClass('focusedItem');
if (this._k_onFocus) {
this._k_onFocus.call(this, this);
}
},

_k_onBlurGrid: function () {
var
k_extWidget = this.k_extWidget;
if (Ext.isGecko && !kerio.lib.k_isFirefox2) {
this._k_removeFocusedItemClass.defer(10, this);
}
else {
k_extWidget.removeClass('focusedItem');
}
},

_k_removeFocusedItemClass: function() {
var
k_gridElement = this.k_extWidget.getView().mainWrap.dom,
k_focusedElement = document.activeElement,  k_masterElement;
if (k_focusedElement) {
try {
k_masterElement = Ext.fly(k_focusedElement).parent('div.x-grid3-viewport');
}
catch (k_e) {}
}
if (!k_masterElement || k_gridElement !== k_masterElement.dom) {
this.k_extWidget.removeClass('focusedItem');
}
},

_k_createToolbars: function(k_widgetConfig) {
var k_pagingToolbarCfg,
k_extPagingToolbar,
k_isPagingInHeader,
k_isPagingInFooter,
k_mappedCfgPaging = {};
if (this._k_isPaging) {
k_mappedCfgPaging[this._k_propertiesMapping.k_pageSize] = this.k_pageSize;
k_pagingToolbarCfg = kerio.lib._k_createConfig.call(this, k_mappedCfgPaging, this._k_propertiesDefault._kx.k_paging);
k_pagingToolbarCfg.store = this._k_extDataStore;
k_pagingToolbarCfg.items = ['-'];
k_pagingToolbarCfg.height = 0;
if (true === this._k_storedConfig.k_keepPagingVisible) {
k_pagingToolbarCfg.k_keepPagingVisible = true;
}
k_isPagingInHeader = k_pagingToolbarCfg.k_isPagingInHeader;
k_isPagingInFooter = k_pagingToolbarCfg.k_isPagingInFooter;
delete k_pagingToolbarCfg.k_isPagingInHeader;
delete k_pagingToolbarCfg.k_isPagingInFooter;
if (k_isPagingInHeader) {
k_extPagingToolbar = new kerio.lib._K_PagingToolbar(k_pagingToolbarCfg);
k_extPagingToolbar.setHeight('auto');
k_widgetConfig.tbar = k_extPagingToolbar;
this._k_headerPagingToolbar = k_extPagingToolbar;
}
if (k_isPagingInFooter) {
k_extPagingToolbar = new kerio.lib._K_PagingToolbar(k_pagingToolbarCfg);
k_extPagingToolbar.setHeight('auto');
k_widgetConfig.bbar = k_extPagingToolbar;
this._k_footerPagingToolbar = k_extPagingToolbar;
}
k_extPagingToolbar.on('render', this._k_removeRefreshButton, this);
this._k_extPagingToolbar = k_extPagingToolbar;  this._k_extPagingToolbarForceLayout = true;
}
return k_widgetConfig;
},

_k_createColumns: function(k_config) {
var k_i, k_cnt,
k_columnsCfg = k_config.k_columns,
k_sorting = kerio.lib._k_createConfig.call(this, k_columnsCfg.k_sorting, this._k_propertiesDefault._kx.k_sorting),
k_isDefaultSortable = false !== k_sorting,
k_grouping = k_columnsCfg.k_grouping,
k_isSortingEnabled = false,
k_columnItemsAll = k_columnsCfg.k_items, k_columnItems = [], k_columnItem,
k_colSpanColumns = [],
k_isColSpan = false,
k_firstVisibleColumnIndex = null,
k_columnModelCfg,
k_columnCfg,
k_extColumnModelCfg,
k_isRemoteSort,
k_autoExpandColumnInitialWidth,
k_additionalSortColumns;
if (k_isDefaultSortable) {
if (undefined === k_sorting.k_columnId) {
for (k_i = 0, k_cnt = k_columnItemsAll.length; k_i < k_cnt; k_i++) {
k_columnItem = k_columnItemsAll[k_i];
if ((true !== k_columnItem.k_isDataOnly) &&
(true !== k_columnItem.k_isHidden) &&
(false !== k_columnItem.k_isSortable)) {
k_isSortingEnabled = true;
k_sorting.k_columnId = k_columnItem.k_columnId;
break;
}
}
}
else {
k_isSortingEnabled = true;
}
}
for (k_i = 0, k_cnt = k_columnItemsAll.length; k_i < k_cnt; k_i++) {
k_columnItem = k_columnItemsAll[k_i];
if (true !== k_columnItem.k_isDataOnly) {
k_columnItems.push(k_columnItem);
if (undefined === k_columnItem.k_id) {
k_columnItem.k_id = k_columnItem.k_columnId;
}
if (true === k_columnItem.k_isKeptHidden) {
if (!this._k_keptHiddenColumns) {
this._k_keptHiddenColumns = [];
}
this._k_keptHiddenColumns.push(k_columnItem.k_id);
}
if (null === k_firstVisibleColumnIndex && !k_columnItem.k_isKeptHidden) {
k_firstVisibleColumnIndex = k_columnItems.length - 1;
}
}
k_additionalSortColumns = k_columnItem.k_additionalSortColumns;
if (undefined !== k_additionalSortColumns) {
if (!Ext.isArray(k_additionalSortColumns)) {
k_additionalSortColumns = [k_additionalSortColumns];
}
this._k_additionalSortColumns = {
k_columnId: k_columnItem.k_columnId,
k_columns: k_additionalSortColumns
};
}
if (k_columnItem.k_editor && 'k_multilineCheckbox' === k_columnItem.k_editor.k_type) {
k_columnItem.k_multilineRenderer = k_columnItem.k_editor.k_multilineRenderer;
delete k_columnItem.k_editor.k_multilineRenderer;
}
}
k_config.k_isColumnHidable = k_columnsCfg.k_isColumnHidable;
k_config.k_isColumnMovable = k_columnsCfg.k_isColumnMovable;
if (k_columnsCfg.k_autoExpandColumn) {
k_config.k_autoExpandColumn = k_columnsCfg.k_autoExpandColumn;
k_autoExpandColumnInitialWidth = k_columnItems[this._k_getColumnConfigIndexById(k_columnItems, k_columnsCfg.k_autoExpandColumn)].k_width;
if (k_autoExpandColumnInitialWidth) {
k_config.k_autoExpandMin = k_autoExpandColumnInitialWidth;
}
}
k_columnModelCfg = kerio.lib._k_createConfig.call(this, k_columnItems, null, this._k_columnPropertiesMapping);
if (k_grouping && k_grouping.k_isMemberIndented && null !== k_firstVisibleColumnIndex) {
if (k_columnModelCfg[k_firstVisibleColumnIndex].dataIndex === k_columnsCfg.k_autoExpandColumn) {
k_config.k_autoExpandColumn = 'indentGroupMembers'; }
k_columnModelCfg[k_firstVisibleColumnIndex].id = 'indentGroupMembers';
}
for (k_i = 0; k_i<k_columnItems.length; k_i++) {
k_columnCfg = k_columnItems[k_i];
k_extColumnModelCfg = k_columnModelCfg[k_i];
if (k_columnCfg.k_multilineRenderer) {
this._k_hasMultilineRenderer = true;
}
if (undefined !== k_columnCfg.k_colSpanIf) {
if (k_extColumnModelCfg.renderer) {
k_columnCfg._k_rendererHandler = k_extColumnModelCfg.renderer;
}
k_colSpanColumns.push(k_columnCfg);
k_isColSpan = true;
}
}
this._k_setEditors(k_columnItems, k_columnModelCfg);
if (this._k_hasInlineEditors && !k_config.k_onBeforeEdit) {
k_config.k_onBeforeEdit = Ext.emptyFn;
}
if (this._k_isSelectedByCheckbox) {
k_columnModelCfg.unshift(this._k_extSelectionModel);
}
k_columnModelCfg = {
columns: k_columnModelCfg,
defaults: {
sortable: k_isDefaultSortable
}
};
this._k_columnModel = new Ext.grid.ColumnModel(k_columnModelCfg);
this._k_modifyEditors();
k_isRemoteSort = k_config.k_remoteData ? true : false;
if (undefined !== k_sorting.k_isRemoteSort) {
k_isRemoteSort = k_sorting.k_isRemoteSort;
}
k_columnsCfg.k_sorting = k_sorting; this._k_isSortingEnabled = k_isSortingEnabled;
this._k_columnItems = k_columnItems;
this._k_sorting = k_sorting;
this._k_isRemoteSort = k_isRemoteSort;
this._k_colSpanColumns = k_colSpanColumns;
this._k_isColSpan = k_isColSpan;
},

_k_setEditors: function(k_columnItems, k_columnModelCfg) {
var k_columnCfg,
k_editorList,
k_editor,
k_extColumnModelCfg,
k_editorColumn = null,
k_lib = kerio.lib,
k_addKerioProperty = k_lib._k_addKerioProperty,
k_kerioWidget,
k_extWidget,
k_i, k_j,
k_cnt = k_columnItems.length,
k_editCnt,
K_Constructor;
this._k_multiEditColumns = [];
for (k_i = 0; k_i < k_cnt; k_i++) {
k_columnCfg = k_columnItems[k_i];
k_editorList = k_columnCfg.k_editor;
if (undefined === k_editorList) {
continue;
}
if ('array' === Ext.type(k_editorList)) {
this._k_multiEditColumns.push(k_i);
}
else {
k_editorList = [k_editorList];
}
k_extColumnModelCfg = k_columnModelCfg[k_i];
for (k_j = 0, k_editCnt = k_editorList.length; k_j < k_editCnt; k_j++) {
k_editor = k_editorList[k_j];
if ('k_checkbox' === k_editor.k_type) {
k_editorColumn = new Ext.grid.CheckColumn(k_extColumnModelCfg);
k_addKerioProperty(k_editorColumn, {
k_id: Ext.id(),
k_linkedOption: k_editor.k_linkedOption,
k_editColumnId: k_editor.k_columnId,
k_onChange: this._k_onChangeInlineCheckbox,
k_onChangeCustom: k_editor.k_onChange,
k_onBeforeEdit: k_editor.k_onBeforeEdit
});
k_columnModelCfg[k_i] = k_editorColumn;
Ext.applyIf(k_columnModelCfg[k_i], k_extColumnModelCfg);
this._k_plugins.push(k_editorColumn);
if (false !== k_editor.k_useCheckAllMenu) {
k_columnModelCfg[k_i]._k_editorColumnPlugin = k_editorColumn; if (!this._k_checkColumnsInfo) {
this._k_checkColumnsInfo = [];
}
this._k_checkColumnsInfo.push({
k_cellName: k_extColumnModelCfg.id || k_extColumnModelCfg.dataIndex,
k_columnName: k_extColumnModelCfg.dataIndex
});
k_addKerioProperty(k_editorColumn, {
k_onGroupCheck: k_editor.k_onGroupCheck
});
}
}
else if ('k_multilineCheckbox' === k_editor.k_type) {
k_addKerioProperty(k_columnModelCfg[k_i], {
k_showAsCheckboxes: true,
k_onChange: k_editor.k_onChange,
k_onBeforeEdit: k_editor.k_onBeforeEdit
});
}
else {
this._k_hasInlineEditors = true;
K_Constructor = k_lib._k_getItemConstructor(k_editor.k_type);
k_kerioWidget = new K_Constructor(this.k_id + '_' + 'k_editor' + '_' + k_columnCfg.k_columnId, k_editor);
k_extWidget = k_kerioWidget.k_extWidget;
if (k_editor.k_onBeforeEdit) {
k_addKerioProperty(k_extWidget, {k_onBeforeEdit: k_editor.k_onBeforeEdit});
}
k_columnModelCfg[k_i].editor = k_extWidget;
}
}
}
},

_k_modifyEditors: function () {
var k_columnModel = this._k_columnModel,
k_multiEditColumns = this._k_multiEditColumns,
k_i, k_cnt = k_multiEditColumns.length,
k_columnIndex,
k_extEditor,
k_extWidget,
k_extWidgetKx,
k_widget,
k_addKerioProperty = kerio.lib._k_addKerioProperty,
k_onBeforeEdit;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_columnIndex = k_multiEditColumns[k_i];
k_extEditor = k_columnModel.getCellEditor(k_columnIndex, 0);
k_extEditor.addClass('cbxMultiEdit');         k_extEditor.on('show', this._k_justifyMultiEdit);
k_extEditor.on('hide', this._k_justifyMultiEdit);
}
for (k_i = 0, k_cnt = k_columnModel.getColumnCount(); k_i < k_cnt; k_i++) {
k_extEditor = k_columnModel.getCellEditor(k_i, 0);
if (k_extEditor) {
Ext.apply(k_extEditor, {
revertInvalid: false,
cancelOnEsc: true,
completeOnEnter: true
});
k_extEditor.on('canceledit', this._k_onCancelEdit, this);
k_extWidget = k_extEditor.field;
k_extWidgetKx = k_extWidget._kx;
k_widget = k_extWidgetKx.k_owner;
k_onBeforeEdit = k_extWidgetKx.k_onBeforeEdit;
k_extEditor.setSize = this._k_setEditorSize;  if (k_widget.k_isInstanceOf('K_Select')) {
k_extEditor.on('beforecomplete', this._k_handleEscOnSelectEditor);
if (kerio.lib.k_isFirefox && k_widget._k_emptyValuePrompt) {
k_extEditor.on('specialkey', this._k_hideSelectEditor);
}
}
if (k_widget.k_isInstanceOf('K_TextField')) {
k_extEditor.on('startedit', this._k_onStartCellEdit, k_widget);
}
if (k_onBeforeEdit) {
k_addKerioProperty(k_extEditor, {k_onBeforeEdit: k_onBeforeEdit});
delete k_extWidgetKx.k_onBeforeEdit;
k_extEditor.on('beforestartedit', this._k_onBeforeCellEdit, this);
}
k_extEditor.on('canceledit', this._k_focusGridOnCancelEdit, this);
if (k_widget.k_parent) {
kerio.lib.k_reportError('Internal error: Parent for editor with ID ' + k_widget.k_id + ' is already set!');
}
k_widget.k_parent = this;
}
}
},

_k_setEditorSize: function(k_width, k_height) {
var k_correction = this.el.hasClass('cbxMultiEdit') ? 20 : 2;  delete this.field.lastSize;
this.field.setSize(k_width - k_correction, k_height);
if(this.el){
this.el.sync();
}
},

_k_justifyMultiEdit: function() {
var k_element = this.getEl(),
k_left;
if (this.isVisible()) {
k_left = parseInt(k_element.getStyle('left'), 10);
k_element.setStyle('left', k_left + 17 + 'px');
k_element.setStyle('padding-left', '1px');
}
else {
k_element.setStyle('padding-left', '18px');  }
},

_k_setEditInfo: function(k_extEditInfo) {
var k_grid = k_extEditInfo.grid._kx.k_owner,
k_formItem,
k_extEditor,
k_value = k_extEditInfo.value;
if (k_grid._k_hasInlineEditors) {
k_extEditor = k_grid._k_columnModel.getCellEditor(k_extEditInfo.column, 0);
if (k_extEditor) {
k_formItem = k_extEditor.field._kx.k_owner;
k_formItem._k_prevValue = k_value;  }
}
k_grid._k_lastEditedCell = {
k_rowData    : k_extEditInfo.record.data,
k_columnId   : k_extEditInfo.field,
k_origValue  : k_value,
k_rowIndex   : k_extEditInfo.row,
k_columnIndex: k_extEditInfo.column
};
},

_k_focusGridOnCancelEdit: function () {
this.k_extWidget.focus();
},

_k_focusInlineEditor: function () {
if (this.k_extWidget.activeEditor) {
this.k_extWidget.activeEditor.field.focus();
}
},

k_getEditInfo: function() {
return this._k_lastEditedCell;
},

k_getColumnEditor: function(k_columnId) {
var k_columnModel = this._k_columnModel,
k_columnIndex = k_columnModel.findColumnIndex(k_columnId),
k_editor = null;
if (-1 !== k_columnIndex) {
k_editor = k_columnModel.getCellEditor(k_columnIndex, 0);
}
if (k_editor) {
k_editor = k_editor.field._kx.k_owner;
}
return k_editor;
},

_k_handleEscOnSelectEditor: function(k_extEditor, k_value, k_origValue) {
var k_extWidget = k_extEditor.field,
k_widget = k_extWidget._kx.k_owner;
if (k_value == k_origValue && k_widget._k_isValueChanged()) {
k_widget.k_setValue(k_value);  }
},

_k_onBeforeCellEdit: function(k_extEditor, k_extElement, k_origValue) {
var k_editInfo = this.k_getEditInfo();
return k_extEditor._kx.k_onBeforeEdit.call(this, this, k_editInfo.k_columnId, k_origValue, k_editInfo.k_rowData);
},

_k_onStartCellEdit: function() {
this.k_markInvalid(false);
},

_k_onBeforeGridEdit: function(k_extEditInfo) {
if (this.k_isReadOnly()) {
return false;
}
this._k_setEditInfo(k_extEditInfo);
return this._k_mappedListeners.k_onBeforeEdit.call(this, this, k_extEditInfo.field, k_extEditInfo.value, k_extEditInfo.record.data);
},

_k_onBeforeCompleteGridEdit: function (k_extEditorInfo) {
var
k_newEditInfo,
k_columnId;
if (this.k_isReadOnly()) {
return;
}
k_columnId = this.k_extWidget.getColumnModel().getDataIndex(k_extEditorInfo.column);
k_newEditInfo = this._k_mappedListeners.k_onBeforeCompleteEdit.call(this, this, k_columnId, k_extEditorInfo.originalValue, k_extEditorInfo.value);
k_newEditInfo = kerio.lib._k_applyMapping.call(this, k_newEditInfo, this._k_extEditorInfoMapping);
Ext.apply(k_extEditorInfo, k_newEditInfo);
},

k_startCellEdit: function(k_rowIndex, k_columnId) {
var
k_extWidget = this.k_extWidget,
k_colIndex = k_extWidget.getColumnModel().findColumnIndex(k_columnId);
this.k_selectRows(k_rowIndex);
k_extWidget.startEditing(k_rowIndex, k_colIndex);
},

k_stopCellEdit: function(k_cancel) {
var k_extWidget = this.k_extWidget;
k_extWidget.stopEditing(k_cancel);
return this.k_isEditing();
},

k_isEditing: function () {
return true === this.k_extWidget.editing;
},

_k_alignEditorOnBodyScroll: function () {
var
k_activeEditor = this.k_extWidget.activeEditor,
k_colsBeforeWidth = 0,
k_x = 0,
k_scroller,
k_cm,
k_colWidth,
k_width,
k_i,
k_cnt;
if (k_activeEditor) {
if (k_activeEditor.row < this.k_getRowsCount() && k_activeEditor.col < this.k_extWidget.getColumnModel().getColumnCount()) {
k_x = Ext.fly(this.k_extWidget.getView().getCell(k_activeEditor.row, k_activeEditor.col)).hasClass('x-grid3-check-col-td') ? 17 : 0;
}
k_activeEditor.el.alignTo(k_activeEditor.boundEl, k_activeEditor.alignment, [k_x, k_activeEditor.offsets[1]]);
k_scroller = this.k_extWidget.getView().scroller;
k_cm = this.k_extWidget.getColumnModel();
k_colWidth = k_cm.getColumnWidth(k_activeEditor.col);
k_width = k_scroller.getWidth();
if (k_colWidth > k_width && k_scroller.dom.clientHeight < k_scroller.dom.scrollHeight) {
k_width -= kerio.lib.k_getScrollbarSize().k_width;
for (k_i = 0, k_cnt = k_activeEditor.col; k_i < k_cnt; k_i++) {
if (!k_cm.isHidden(k_i)) {
k_colsBeforeWidth += k_cm.getColumnWidth(k_i);
}
}
k_width = Math.min(k_width + k_scroller.dom.scrollLeft - k_colsBeforeWidth, k_colWidth);
k_width -= k_x;
k_activeEditor.el.setWidth(k_width);
k_activeEditor.field.setWidth(k_width - k_activeEditor.el.getPadding('lr'));
}
if (k_activeEditor && k_activeEditor.row === this.k_getRowsCount()) {
this._k_onCancelEdit();
}
}
},

k_isRowValid: function (k_rowIndex) {
var k_invalidColumns = this.k_getInvalidColumns(k_rowIndex);
return 0 === k_invalidColumns.length;
},

k_getInvalidColumns: function (k_rowIndex) {
var
k_columnModel = this.k_extWidget.getColumnModel(),
k_invalidColumns = [],
k_isRowEdited,
k_editor,
k_rowData,
k_columnId,
k_value,
k_i, k_cnt,
k_editorExtWidget,
k_activeEditor,
k_isValid;
k_activeEditor = this.k_extWidget.activeEditor;
k_isRowEdited = k_activeEditor && k_rowIndex === k_activeEditor.row;
if (k_isRowEdited && false === k_activeEditor.field._kx.k_owner.k_isValid()) {
k_columnId = k_columnModel.getDataIndex(k_activeEditor.col);
k_invalidColumns.push(k_columnId);
}
else {
if (k_isRowEdited)	{
this.k_stopCellEdit();
}
k_rowData = this._k_dataStore.k_extWidget.getAt(k_rowIndex).data;
for (k_i = 0, k_cnt = k_columnModel.getColumnCount(); k_i < k_cnt; k_i++) {
k_columnId = k_columnModel.getDataIndex(k_i);
k_editor = this.k_getColumnEditor(k_columnId);
if (k_editor) {
k_editorExtWidget = k_editor.k_extWidget;
k_value = k_rowData[k_columnId];
k_value = k_editorExtWidget.processValue(k_value);
if ('' === k_value) {
k_editorExtWidget._k_getRawValue = k_editorExtWidget.getRawValue;
k_editorExtWidget.getRawValue = this._k_fixEmptyStringValidator;
}
k_isValid = k_editorExtWidget.validateValue(k_value);
if (k_editorExtWidget._k_getRawValue) {
k_editorExtWidget.getRawValue = k_editorExtWidget._k_getRawValue;
delete k_editorExtWidget._k_getRawValue;
}
if (!k_isValid) {
k_invalidColumns.push(k_columnId);
}
}
}
}
return k_invalidColumns;
},

_k_fixEmptyStringValidator: function () {
return '';
},

_k_isValid: function (k_markInvalid) {
var
k_results = new kerio.lib._K_ValidationResults(),
k_rowCount = this.k_getRowsCount(),
k_i;
if (!this._k_hasInlineEditors) {
return k_results;
}
for (k_i = 0; k_i < k_rowCount; k_i++) {
if (!this.k_isRowValid(k_i)) {
k_results.k_inc();
k_results.k_addMethod(this._k_onInvalidData, [], this);
break;
}
}
return k_results;
},

_k_onInvalidData: function () {
var
k_activeEditor = this.k_extWidget.activeEditor,
k_invalidRows = this.k_getInvalidRowIndexes(),
k_invalidColumn = this.k_getInvalidColumns(k_invalidRows[0])[0],
k_invalidColumnIndex = this.k_extWidget.getColumnModel().findColumnIndex(k_invalidColumn);
if (k_activeEditor && k_activeEditor.row === k_invalidRows[0] && k_activeEditor.col === k_invalidColumnIndex) {
return;
}
this.k_startCellEdit(k_invalidRows[0], this.k_getInvalidColumns(k_invalidRows[0])[0]);
},

k_getInvalidRowIndexes: function () {
var
k_invalidRowsIndexes = [],
k_rowCount = this.k_getRowsCount(),
k_i;
for (k_i = 0; k_i < k_rowCount; k_i++) {
if (!this.k_isRowValid(k_i)) {
k_invalidRowsIndexes.push(k_i);
}
}
return k_invalidRowsIndexes;
},

_k_onCancelEdit: function () {
this.k_extWidget.activeEditor = null;
this.k_extWidget.editing = false;
},

_k_rendererHandler: function(k_extValue, k_extMetaData, k_extRecord, k_extRowIndex, k_extColIndex, k_extDataStore) {
var k_grid = k_extDataStore._kx.k_relatedWidget,
k_columnCfg = k_grid._k_columnModel.config[k_extColIndex],
k_rendererFunction = k_columnCfg._kx.k_renderer,
k_buildTooltip = kerio.lib.k_buildTooltip,
k_rendererInfo,
k_iconDefinition = '',
k_dataDefinition,
k_rowData = k_extRecord.data,
k_colSpanColumns = k_grid._k_colSpanColumns,
k_colSpanCfg, k_colSpanColumn,
k_i, k_cnt;
if (k_grid._k_isColSpan) {
for (k_i=0, k_cnt=k_colSpanColumns.length; k_i<k_cnt; k_i++) {
k_colSpanColumn = k_colSpanColumns[k_i];
k_colSpanCfg = k_colSpanColumn.k_colSpanIf;
if (-1 !== k_colSpanCfg.k_columnValues.indexOf(k_extRecord.data[k_colSpanCfg.k_columnId])) {
if (k_colSpanColumn.k_columnId !== k_columnCfg.dataIndex) {
return k_extValue;
}
}
}
}
k_rendererInfo = k_rendererFunction.call(k_grid, k_extValue, k_rowData, k_extRowIndex, k_extColIndex, k_grid);
if (k_rendererInfo.k_className) {
k_extMetaData.css += k_rendererInfo.k_className;
}
if (k_rendererInfo.k_iconCls) {
k_iconDefinition = '<span unselectable="on" class="cellIcon ' + k_rendererInfo.k_iconCls + '"';
if (kerio.lib.k_isMSIE8) {
k_extMetaData.css += ' gridCellWithIcon ie8';
}
if (k_rendererInfo.k_iconTooltip) {
k_iconDefinition += k_buildTooltip(k_rendererInfo.k_iconTooltip, k_rendererInfo.k_isSecure);
}
k_iconDefinition += '>&nbsp; &nbsp; &nbsp;</span>';
}
k_dataDefinition = k_rendererInfo.k_data;
if (!k_rendererInfo.k_isSecure) {
k_dataDefinition = Ext.util.Format.htmlEncode(k_dataDefinition);
}
if (k_rendererInfo.k_dataTooltip) {
k_dataDefinition = '<span unselectable="on"' + k_buildTooltip(k_rendererInfo.k_dataTooltip, k_rendererInfo.k_isSecure) + '">' + k_dataDefinition + '</span>';
}
return k_iconDefinition + k_dataDefinition;
},

k_enable: function(k_enable) {
k_enable = (undefined === k_enable) ? true : k_enable;
this.k_setDisabled(!k_enable);
},

k_setDisabled: function (k_disabled) {
k_disabled = ((undefined === k_disabled) ? true : k_disabled);
this._k_isDisabled = k_disabled;
kerio.lib.K_Grid.superclass.k_setDisabled.call(this, k_disabled);
this._k_setDisabledItem(k_disabled);
},

_k_setDisabledItem: function (k_disabled) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var
k_extWidget = this.k_extWidget,
k_gridEl = k_extWidget.getEl(),
k_bodyEl = k_extWidget.body;
if (this._k_headerPagingToolbar) {
this._k_headerPagingToolbar.setDisabled(k_disabled);
}
if (this._k_footerPagingToolbar) {
this._k_footerPagingToolbar.setDisabled(k_disabled);
}
if (k_disabled) {
k_gridEl.addClass('gridDisabled');
k_bodyEl.mask();
}
else {
k_gridEl.removeClass('gridDisabled');
k_bodyEl.unmask();
}
this._k_setDisabledAllToolbars(k_disabled);
},

k_setReadOnly: function(k_isReadOnly) {
k_isReadOnly = (false !== k_isReadOnly);
this._k_isReadOnly = k_isReadOnly;
kerio.lib.K_Grid.superclass.k_setReadOnly.call(this, k_isReadOnly);
this._k_setReadOnlyItem(k_isReadOnly);
},

_k_setReadOnlyItem: function (k_isReadOnly) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_gridEl = this.k_extWidget.getEl();
if (k_isReadOnly) {
k_gridEl.addClass('gridReadOnly');
}
else {
k_gridEl.removeClass('gridReadOnly');
}
},

k_isReadOnly: function () {
return this._k_isReadOnly;
},

k_isDisabled: function () {
return this._k_isDisabled;
},

k_setVisible: function(k_visible) {
kerio.lib.K_Grid.superclass.k_setVisible.call(this, k_visible);
k_visible = ((undefined === k_visible) ? true : k_visible);
this._k_isVisible = k_visible;
this.k_extWidget.setVisible(k_visible);
this._k_recalculateSpaceForScrollbar();
},

k_isVisible: function () {
return (false !== this._k_isVisible);
},

k_focus: function() {
var k_extWidget;
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
k_extWidget = this.k_extWidget;
if (!k_extWidget.getSelectionModel().hasSelection()) {
k_extWidget.getSelectionModel().selectFirstRow();
}
k_extWidget.getView().focusEl.focus();
},

_k_initKeyNav: function (k_extGrid) {
var
k_element = k_extGrid.getView().scroller,
k_keyMapEventName = kerio.lib._k_getKeyEventName();
this._k_keyNav = new Ext.KeyNav(k_element, {
enter: this._k_onEnterHandler,
up: this._k_onNavigationKeyHandler,
down: this._k_onNavigationKeyHandler,
pageUp: this._k_onNavigationKeyHandler,
pageDown: this._k_onNavigationKeyHandler,
home: this._k_onNavigationKeyHandler,
end: this._k_onNavigationKeyHandler,
del: this._k_onDeleteKeyHandler,
defaultEventAction: 'doNothingWithEvent',
scope: this
});
if (this._k_isMultiSelection) {
this._k_keyMapCtrlA = new Ext.KeyMap(k_element, {
key: [65, 97],
ctrl:true,
scope: this,
fn: this._k_onCtrlAKeyHandler
}, k_keyMapEventName);
}
this._k_keyMapBackspace = new Ext.KeyMap(k_element, {
key: Ext.EventObject.BACKSPACE,
scope: this,
fn: this._k_onBackspaceKeyHandler
}, k_keyMapEventName);
},

_k_onEnterHandler: function (k_extEvent) {
if (this._k_isEnterMappedToDoubleClick && this._k_mappedListeners.k_onDblClick) {
if (0 < this.k_selectionStatus.k_selectedRowsCount) {
k_extEvent.stopEvent();
this._k_onDblClickRow(this.k_extWidget, this.k_selectionStatus.k_rows[0].k_rowIndex, k_extEvent);
}
}
},

_k_onNavigationKeyHandler: function (k_extEvent) {
var
k_direction,
k_pagingToolbar,
k_step,
k_last,
k_targetRowIndex,
k_keyCode = k_extEvent.getKey(),
k_recordsCount = this._k_extDataStore.getCount(),
k_extSelectionModel = this._k_extSelectionModel,
k_pageMove = k_keyCode === k_extEvent.PAGEUP || k_keyCode ===  k_extEvent.PAGEDOWN,
k_homeEndMove = k_keyCode === k_extEvent.HOME || k_keyCode === k_extEvent.END;
if (0 === k_recordsCount || (!k_pageMove && !k_homeEndMove)) {
return;
}
k_extEvent.stopEvent();
if (this._k_isPaging && !this._k_isLocalData && !k_extEvent.shiftKey) { if (k_pageMove) {
k_direction = (k_extEvent.PAGEUP === k_keyCode) ? 'prev' : 'next';
k_pagingToolbar = this._k_headerPagingToolbar || this._k_footerPagingToolbar;
if (k_pagingToolbar) {  if (!k_pagingToolbar[k_direction].disabled) {
k_pagingToolbar['prev' === k_direction ? 'movePrevious' : 'moveNext']();
return;
}
}
}
}
if (k_pageMove) {
k_step = this._k_getCntVisibleRows() * (k_extEvent.PAGEUP === k_keyCode ? -1 : +1);
}
else {  k_step = (k_extEvent.HOME === k_keyCode ? 0 : k_recordsCount - 1) - k_extSelectionModel.lastActive;
}
k_targetRowIndex = k_extSelectionModel.lastActive + k_step;
k_targetRowIndex = k_targetRowIndex.constrain(0, k_recordsCount - 1);
if (k_extEvent.shiftKey) {
if (k_extSelectionModel.last !== false && k_extSelectionModel.lastActive !== false) {
k_last = k_extSelectionModel.last;
k_extSelectionModel.selectRange(k_extSelectionModel.last, k_targetRowIndex);
if(k_last !== false) {
k_extSelectionModel.last = k_last;
}
}
}
else {
k_extSelectionModel.selectRow(k_targetRowIndex);
}
k_extSelectionModel.grid.getView().focusRow(k_targetRowIndex);
},

_k_onDeleteKeyHandler: function (k_extEvent) {
k_extEvent.stopEvent();
kerio.lib.k_notify(this, this.k_eventTypes.k_KEY_PRESSED, k_extEvent);
},

_k_onBackspaceKeyHandler: function () {
this._k_onDeleteKeyHandler(Ext.EventObject);
},

_k_onCtrlAKeyHandler: function () {
this._k_extSelectionModel.selectAll();
},

k_hideKeptHiddenColumns: function() {
var
k_keptHiddenColumns = this._k_keptHiddenColumns,
k_columnModel = this.k_extWidget.getColumnModel(),
k_i, k_cnt;
for (k_i = 0, k_cnt=k_keptHiddenColumns.length; k_i < k_cnt; k_i++) {
k_columnModel.setHidden(k_columnModel.getIndexById(k_keptHiddenColumns[k_i]), true);
}
},

k_revealKeptHiddenColumn: function(k_columnId) {
var	k_columnModel = this.k_extWidget.getColumnModel();
k_columnModel.setHidden(k_columnModel.getIndexById(k_columnId), false);
},

_k_removeKeptHiddenColumnsFromHdMenu: function () {
var
k_columnHdMenu = this.k_extWidget.getView().colMenu,
k_columnModel = this.k_extWidget.getColumnModel(),
k_keptHiddenColumns = this._k_keptHiddenColumns,
k_columnId,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_keptHiddenColumns.length; k_i < k_cnt; k_i++) {
k_columnId = k_keptHiddenColumns[k_i];
if (k_columnModel.isHidden(k_columnModel.getIndexById(k_columnId))) {
k_columnHdMenu.remove('col-' + k_columnId);
}
}
},

_k_onBeforeLoadStore: function(k_store, k_options) {
this.k_extWidget.addClass('hiddenEmptyText');
},

_k_onBeforeRowSelect: function(k_extSelectionModel, k_rowIndex, k_keepSelection) {
if (false === this._k_isSelection) {
return false;
}
var k_activeEditor;
if (this._k_hasInlineEditors && this.k_isEditing()) {
k_activeEditor = this.k_extWidget.activeEditor;
if (k_activeEditor.field._kx.k_owner.k_isValid()) {
return true;
}
else {
k_activeEditor.field.el.focus.defer(10, k_activeEditor.field.el);
return false;
}
}
},

_k_onContextMenu: function(k_extWidget, k_rowIndex, k_extEvent) {
k_extEvent.stopEvent();
var
k_position = k_extEvent.getXY(),
k_sm = k_extWidget.getSelectionModel(),
k_contextMenu = k_extWidget._kx.k_contextMenu,
k_printMenuItem;
if (undefined !== k_rowIndex) {
if (!k_sm.isSelected(k_rowIndex)) {
k_sm.selectRow(k_rowIndex);
k_extWidget.view.focusRow(k_rowIndex);
}
}
k_extWidget.focus();
if (this._k_initialConfig && !k_contextMenu._kx.k_hasPrintMenu) {
k_printMenuItem = new Ext.menu.Item({text: this._k_printText});
k_printMenuItem.on('click', this.k_print, this);
k_contextMenu.add('-', k_printMenuItem);
k_contextMenu._kx.k_hasPrintMenu = true;
}
k_contextMenu.showAt(k_position);
k_contextMenu.k_relatedItem = k_extWidget;
k_contextMenu._kx.k_owner.k_relatedWidget = this;
},

_k_onContextMenuEmptyArea: function(k_extEvent) {
if (k_extEvent.getTarget('.x-grid3-row') || !k_extEvent.getTarget('.x-grid3-viewport')) {
return;
}
this._k_onContextMenu(this.k_extWidget, undefined, k_extEvent);
},

k_createContextMenu: function(k_config) {
var k_contextMenu,
k_extWidget = this.k_extWidget;
if (k_config.k_isInstanceOf && k_config.k_isInstanceOf('K_Menu')) {
k_contextMenu = k_config;
}
else {
k_contextMenu = new kerio.lib.K_Menu(this.k_id + '_contextMenu', k_config);
}
kerio.lib._k_addKerioProperty(k_extWidget, {k_contextMenu: k_contextMenu.k_extWidget});
k_extWidget.on('rowcontextmenu', this._k_onContextMenu, this);
},

_k_onClickRow: function(k_extWidget, k_rowIndex, k_extEvent) {
var k_store = k_extWidget.getStore();
var k_rowData = k_store.data.items[k_rowIndex].data;
var k_event = new kerio.lib.K_Event(kerio.lib.k_constants.k_EVENT.k_TYPES.k_CLICK, k_extEvent);
this._k_mappedListeners.k_onClick.call(this, this, k_rowData, k_event);
},

_k_onRowSelect: function(k_extSelectionStatus, k_rowIndex) {
if (this._k_storedConfig.k_onRowSelect) {
this._k_storedConfig.k_onRowSelect.call(this, this, k_rowIndex);
}
},

_k_onDblClickRow: function(k_extWidget, k_rowIndex, k_extEvent) {
var
k_store = k_extWidget.getStore(),
k_rowData = k_store.data.items[k_rowIndex].data,
k_event = new kerio.lib.K_Event(kerio.lib.k_constants.k_EVENT.k_TYPES.k_DOUBLE_CLICK, k_extEvent),
k_dblClickMappedButton = this._k_dblClickMappedButton;
if (k_extEvent.ctrlKey || k_extEvent.browserEvent.metaKey) {
return;
}
this._k_mappedListeners.k_onDblClick.call(this, this, k_rowData, k_event);
if (k_dblClickMappedButton && !k_dblClickMappedButton.k_isReadOnly() && !k_dblClickMappedButton.k_isDisabled()) {
k_dblClickMappedButton._k_action._k_onClick(k_dblClickMappedButton.k_extWidget, 'k_click');
}
},

_k_onDblClickCell: function() { var
k_function;
k_function = function(k_extWidget, k_rowIndex, k_columnIndex, k_extEvent) {
var k_store = k_extWidget.getStore(),
k_rowData = k_store.data.items[k_rowIndex].data,
k_columnId = k_extWidget.colModel.getDataIndex(k_columnIndex),
k_event = new kerio.lib.K_Event(kerio.lib.k_constants.k_EVENT.k_TYPES.k_DOUBLE_CLICK, k_extEvent);
this._k_mappedListeners.k_onCellDblClick.call(this, this, k_rowData, k_columnId, k_event);
};
if (kerio.lib.k_isIPadCompatible) {
return k_function.createInterceptor(
function(k_extWidget, k_rowIndex, k_columnIndex, k_extEvent) {
if (k_extWidget._kx.k_owner.k_iPadStatus.k_selectedRowIndex !== k_rowIndex) {
k_extWidget._kx.k_owner.k_iPadStatus.k_selectedRowIndex = k_rowIndex;
return false;
}
}
);
}
return k_function;
}(),

_k_onSelectionChanged: function(k_extSelectionModel, k_selectedCells) {
if (k_extSelectionModel.k_isRangeSelectionInProgress()) {
return;
}
var k_selection = null,
k_selectionStatus,
k_dataStore = this._k_extDataStore,
k_rows,
k_rowProperties,
k_i, k_cnt;
if (k_extSelectionModel instanceof Ext.grid.RowSelectionModel) {
k_selection = k_extSelectionModel.getSelections();
}
else {
if (k_extSelectionModel instanceof Ext.grid.CellSelectionModel) {
return;

}
}
this._k_initSelectionStatus();
k_selectionStatus = this.k_selectionStatus;
k_rows = k_selectionStatus.k_rows;
k_cnt = k_selection.length;
k_selectionStatus.k_selectedRowsCount = k_cnt;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_rowProperties = k_selection[k_i];
k_rows[k_i] = {
k_rowIndex: k_dataStore.indexOfId(k_rowProperties.id),
k_data: k_rowProperties.data,
k_extRecord: k_rowProperties
};
}
kerio.lib.k_notify(this, this.k_eventTypes.k_SELECTION_CHANGED);
},

_k_initSelectionStatus: function() {
this.k_selectionStatus = {
k_rows: [],
k_selectedRowsCount: 0,
k_totalRows: this._k_extDataStore.data.items.length
};
},

k_update: function(k_sender, k_event) {
kerio.lib.k_reportError('Internal error: Override k_update method in object with ID ' + this.k_id
+ ' to make this object behaving as an observer', 'grid.js');
},

k_findRow: function(k_columnId, k_data) {
var k_dataStore = this._k_extDataStore,
k_foundRows = k_dataStore.query(k_columnId, k_data),
k_cnt = k_foundRows.getCount(),
k_rowIndexList = [],
k_rowData,
k_i;
if (0 === k_cnt) {
return -1;
}
k_foundRows = k_foundRows.items;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_rowData = k_foundRows[k_i];
k_rowIndexList.push(k_dataStore.indexOfId(k_rowData.id));
}
return k_rowIndexList;
},

_k_findRowByHandler: function(k_record, k_id) {
return this.k_callback.call(this.k_scope, k_record.data);
},

k_findRowIndexBy: function(k_function, k_scope, k_startIndex, k_findAll) {
var
k_dataStore = this._k_extDataStore,
k_findRowByHandler = this._k_findRowByHandler,
k_rowDataList = [],
k_rowIndex,
k_handlerScope;
if ('function' !== typeof k_function) {
kerio.lib.k_reportError('Internal error: Invalid callback for k_findRowBy method.', 'grid.js', 'k_findRowBy');
return null;
}
k_handlerScope = {
k_callback: k_function,
k_scope:    k_scope || this
};
k_rowIndex = k_dataStore.findBy(k_findRowByHandler, k_handlerScope, k_startIndex);
if (-1 === k_rowIndex) {
return null;
}
if (!k_findAll) {
return [k_rowIndex];
}
do {
k_startIndex = k_rowIndex + 1;
k_rowDataList.push(k_rowIndex);
k_rowIndex = k_dataStore.findBy(k_findRowByHandler, k_handlerScope, k_startIndex);
} while ((-1 !== k_rowIndex) && (k_rowIndex >= k_startIndex));
delete this._k_findRowByCustom;
return k_rowDataList;
},

k_findRowBy: function(k_function, k_scope, k_startIndex, k_findAll) {
var
k_data,
k_rowDataList,
k_foundRows,
k_i, k_cnt;
k_scope = k_scope || this;
k_startIndex = k_startIndex || 0;
k_findAll = true === k_findAll;
k_foundRows = this.k_findRowIndexBy(k_function, k_scope || this, k_startIndex || 0, true === k_findAll);
if (null === k_foundRows) {
return null;
}
k_data = this._k_extDataStore.data.items;
k_rowDataList = [];
for (k_i = 0, k_cnt = k_foundRows.length; k_i < k_cnt; k_i++) {
k_rowDataList.push(k_data[k_foundRows[k_i]].data);
}
return k_rowDataList;
},

k_moveSelectedRows: function(k_up, k_step) {
var
k_extWidget = this.k_extWidget,
k_selectionModel = k_extWidget.getSelectionModel(),
k_selectedRows = k_selectionModel.getSelections(),
k_newRowIndexes;
if (k_selectedRows.length <= 0) { return;
}
k_step = undefined === k_step ? 1 : k_step;
k_step = false !== k_up ? k_step * -1 : k_step;
k_selectionModel.suspendEvents();
k_newRowIndexes = this._k_dataStore.k_moveRecords(k_selectedRows, k_step, true);
if (k_newRowIndexes.length > 0) {
k_selectionModel.selectRows(k_newRowIndexes, true);
k_extWidget.getView().focusRow(k_newRowIndexes[0]);
}
k_selectionModel.resumeEvents();
this._k_onSelectionChanged(k_selectionModel);
},

_k_updatePagingToolbar: function(k_startRow) {
var k_options = {},
k_extPagingToolbar = this._k_headerPagingToolbar;
if (undefined !== k_startRow) {
k_options = {params: {start: k_startRow}};
}
if (k_extPagingToolbar) {
k_extPagingToolbar.onLoad(this._k_extDataStore, [], k_options);
}
k_extPagingToolbar = this._k_footerPagingToolbar;
if (k_extPagingToolbar) {
k_extPagingToolbar.onLoad(this._k_extDataStore, [], k_options);
}
},

k_getRowsData: function(k_selectedOnly) {
var k_extRecords,
k_dataPropertyName,
k_data = [],
k_i, k_cnt;
if (k_selectedOnly) {
k_extRecords = this.k_selectionStatus;
k_extRecords = k_extRecords.k_rows;
k_dataPropertyName = 'k_data';
}
else {
k_extRecords = this._k_extDataStore.getRange();
k_dataPropertyName = 'data';
}
for (k_i = 0, k_cnt = k_extRecords.length; k_i < k_cnt; k_i++) {
k_data[k_i] = k_extRecords[k_i][k_dataPropertyName];
}
return k_data;
},

k_clearData: function(k_totalLength, k_updatePagingToolbar) {
this._k_lastSelectedRows = null;
if (this.k_extWidget.rendered) {
this.k_scrollToTop();
}
this._k_dataStore.k_clearData(k_totalLength);
if (false !== k_updatePagingToolbar) {
this._k_updatePagingToolbar();
}
this._k_setPagingToolbarVisibility();
this._k_clearDataDeferred();
},

_k_clearDataDeferred: function () {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
this.k_clearSelections();
},

k_setSingleRowSelection: function(k_isSingleRowSelection) {
this._k_extSelectionModel.singleSelect = k_isSingleRowSelection;
},

k_isRowSelected: function(k_index) {
var k_rows = this.k_selectionStatus.k_rows,
k_cnt = this.k_selectionStatus.k_selectedRowsCount,
k_dataStore = this._k_extDataStore,
k_i,
k_record;
for(k_i = 0; k_i < k_cnt; k_i++) {
k_record = k_rows[k_i].k_extRecord;
if (k_index === k_dataStore.indexOf(k_record)) {
return true;
}
}
return false;
},

k_removeRow: function(k_record, k_isNotSelectionChangedFired) {
this._k_dataStore.k_removeRow(k_record);
if (true !== k_isNotSelectionChangedFired) {
this._k_onSelectionChanged(this._k_extSelectionModel);
}
},

k_removeRowByIndex: function (k_rowIndex, k_isNotSelectionChangedFired) {
var k_record = this._k_extDataStore.getAt(k_rowIndex);
this.k_removeRow(k_record, k_isNotSelectionChangedFired);
},

k_removeSelectedRows: function() {
var
k_selectionStatus = this.k_selectionStatus,
k_extWidget = this.k_extWidget,
k_store = k_extWidget.store,
k_dataCount = k_store.getCount(),
k_maxIndex = 0,
k_records = [],
k_rows,
k_row,
k_i, k_cnt;
if (0 >= k_selectionStatus.k_selectedRowsCount) {
return;
}
if (k_selectionStatus.k_selectedRowsCount === k_dataCount && !k_store.isFiltered()) {
k_store.removeAll();
return;
}
this.k_beginUpdate();
k_rows = k_selectionStatus.k_rows;
for(k_i = 0, k_cnt = k_rows.length; k_i < k_cnt; k_i++) {
k_row = k_rows[k_i];
if (k_row.k_rowIndex > k_maxIndex) {
k_maxIndex = k_row.k_rowIndex;
}
k_records[k_records.length] = k_row.k_extRecord;
}
this.k_clearSelections();
this.k_removeRow(k_records, true);
this.k_endUpdate();
this.k_extWidget.getSelectionModel().selectRow(k_maxIndex + 1 - k_cnt);
},

k_selectRecords: function(k_records, k_keepSelection) {
var k_extSelectionModel = this._k_extSelectionModel;
if (!Ext.isArray(k_records)) {
k_records = [k_records];
}
k_extSelectionModel.selectRecords(k_records, k_keepSelection);
this._k_scrollToFirstSelectedRow();
},

k_clearSelections: function() {
this._k_extSelectionModel.clearSelections();
},

k_selectRows: function(k_rowIndex, k_keepSelection) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_extSelectionModel = this._k_extSelectionModel;
if (!Ext.isArray(k_rowIndex)) {
k_rowIndex = [k_rowIndex];
}
k_extSelectionModel.selectRows(k_rowIndex, k_keepSelection);
this._k_scrollToFirstSelectedRow();
},

k_selectRange: function(k_isMultiSelect, k_endRowIndex, k_startRowIndex, k_keepSelection, k_scrollToFirstSelectedRow) {
var k_extSelectionModel = this._k_extSelectionModel;
k_isMultiSelect = this._k_isMultiSelection && k_isMultiSelect;
if (k_isMultiSelect && (undefined !== k_startRowIndex)) {
k_keepSelection = true === k_keepSelection;
k_extSelectionModel.selectRange(k_startRowIndex, k_endRowIndex, k_keepSelection);
if (false !== k_scrollToFirstSelectedRow) {
this._k_scrollToFirstSelectedRow();
}
}
else {
this.k_selectRows(k_endRowIndex);
}
},

k_scrollToTop: function() {
this.k_extWidget.getView().scrollToTop();
},

_k_scrollToFirstSelectedRow: function() {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var
k_extWidget = this.k_extWidget,
k_gridView = k_extWidget.getView(),
k_focusEl = k_gridView.focusEl,
k_selectedRows = k_extWidget.getSelectionModel().getSelections(),
k_dataStore = this._k_extDataStore,
k_firstSelectedRow = Number.MAX_VALUE,
k_lastSelectedRow = 0,
k_cnt = k_selectedRows.length,
k_hscroll,
k_rowIndex,
k_i;
if (0 === k_cnt) {
return;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_rowIndex = k_dataStore.indexOf(k_selectedRows[k_i]);
k_firstSelectedRow = Math.min(k_firstSelectedRow, k_rowIndex);
k_lastSelectedRow = Math.max(k_lastSelectedRow, k_rowIndex);
}
if (!this.k_isRowInView(k_firstSelectedRow) || !this.k_isRowInView(k_lastSelectedRow)) {
k_gridView.scroller.dom.scrollTop = k_gridView.getRow(k_firstSelectedRow).offsetTop;
}
k_hscroll = k_focusEl.getX() + k_gridView.scroller.getScroll().left;  k_gridView.syncFocusEl(k_firstSelectedRow);
k_focusEl.setX(k_hscroll);
k_focusEl.focus();
},

k_isRowInView: function (k_rowIndex) {
var
k_gridView = this.k_extWidget.getView(),
k_row = k_gridView.getRow(k_rowIndex),
k_scroller = k_gridView.scroller,
k_rowOffsetTop;
if (!k_row) {
kerio.lib.k_todo('[bug 87214] K_Grid::k_isRowInView - workaround applied');
return true;
}
k_rowOffsetTop = k_row.offsetTop;
return k_rowOffsetTop >= k_scroller.dom.scrollTop && k_rowOffsetTop + Ext.get(k_row).getHeight() <= k_scroller.getHeight() + k_scroller.dom.scrollTop;
},

k_setColumnWidth: function(k_columnIndex, k_width, k_refreshGrid) {
this._k_columnModel.setColumnWidth(k_columnIndex, k_width);
if (false !== k_refreshGrid) {
this.k_extWidget.getView().refresh();
}
},

k_getColumnWidth: function(k_columnIndex) {
return this._k_columnModel.getColumnWidth(k_columnIndex);
},

k_setColumnResizable: function(k_columnIndex, k_isResizable) {
var k_extColumnModel = this._k_columnModel,
k_columnConfig = k_extColumnModel.config[k_columnIndex];
k_columnConfig.resizable = k_isResizable;
k_extColumnModel.fireEvent("columnlockchange", k_extColumnModel, k_columnIndex, k_extColumnModel.isLocked(k_columnIndex));
},

k_resortRows: function() {
var k_dataStore = this._k_extDataStore,
k_sortInfo = k_dataStore.sortInfo;
if (k_dataStore.sortInfo) {
k_dataStore.sort(k_sortInfo.field, k_sortInfo.direction);
}
},

k_filterRowsBy: function(k_filterFunction, k_scope) {
k_scope = k_scope || this;
this._k_filterFunction = k_filterFunction;
this._k_filterFunctionScope = k_scope;
this._k_extDataStore.filterBy(this._k_filterFunctionHandler, this);
},

_k_filterFunctionHandler: function (k_extRecord, k_id) {
var k_rowData = k_extRecord.data;
return this._k_filterFunction.call(this._k_filterFunctionScope || this, k_rowData, k_id);
},

k_clearRowFilter: function(k_suppressEvent) {
this._k_extDataStore.clearFilter(true === k_suppressEvent);
},

_k_requestData: function(k_start, k_limit, k_callback, k_callbackParams) {
var
k_lastParams = this._k_dataStore.k_getLastRequestParams(),
k_queryValue,
k_requestCfg,
k_params;
if (!k_lastParams) {
return;
}

k_params = kerio.lib._k_cloneObject(k_lastParams);
k_queryValue = k_params.query;
k_queryValue.limit = k_params.limit = k_limit;
k_queryValue.start = k_params.start = k_start;
k_params = this._k_dataStore._k_prepareRequestParams(k_params, false);
k_requestCfg = {
k_url: this._k_extDataStore.proxy._kx.k_requestCfg.k_url,
k_jsonRpc: k_params,
k_callback: k_callback,
k_scope: this
};
if (undefined !== k_callbackParams) {
k_requestCfg.k_callbackParams = k_callbackParams;
}
kerio.lib.k_ajax.k_request(k_requestCfg);
},

k_loadRestOfPage: function(k_callback) {
var k_extDataStore = this._k_extDataStore,
k_start = k_extDataStore.data.items.length,
k_limit = this.k_pageSize,
k_origin = this._k_dataStore.k_getLastRequestParams().start;
if (k_extDataStore.getCount() === 0) {
k_start = k_origin - k_limit;  this.k_reloadData({start: Math.max(k_start, 0)});
}
else if (k_limit > k_start) {
if (k_callback) {
k_callback.k_scope = k_callback.k_scope || this;
}
this._k_requestData(k_start + k_origin, k_limit - k_start, this._k_callbackLoadRestOfPage, k_callback);
}
},

_k_callbackLoadRestOfPage: function(k_response, k_success, k_params) {
if (!k_success) {
if (k_params) {
k_params.k_callback.call(k_params.k_scope, this, [], false);
}
return;
}
var k_responseData = k_response.k_decoded,
k_rowData = k_responseData[this._k_dataStore._k_dataSourceRoot];
if (k_params) {
k_params.k_callback.call(k_params.k_scope, this, k_rowData, k_success);
}
if (!k_rowData) {
kerio.lib.k_reportError('Internal error: K_Grid::_k_callbackLoadRestOfPage: Missing data in successful request in ' + this.k_id + '!');
}
this.k_setData(k_rowData, true);
this._k_extDataStore.totalLength = k_responseData[this._k_dataStore._k_totalProperty];
this._k_updatePagingToolbar(this._k_dataStore.k_getLastRequestParams().start);
this._k_setPagingToolbarVisibility();
},

k_resetGrid: function() {
this.k_clearData();
},

_k_getCntVisibleRows: function() {
var
k_view = this.k_extWidget.getView(),
k_viewHeight = k_view.scroller.dom.clientHeight,
k_rowHeight = Ext.fly(k_view.getRow(0)).getHeight();
return Math.floor(k_viewHeight / k_rowHeight);
},

_k_getCntVisibleRowsForMultiline: function () {
var
k_view = this.k_extWidget.getView(),
k_scrollTop = k_view.scroller.dom.scrollTop,
k_scrollBottom = k_scrollTop + k_view.scroller.dom.clientHeight,
k_rows = k_view.getRows(),
k_cnt = k_rows.length,
k_visibleRowsCnt = 0,
k_rowBottomEdge,
k_rowOffsetTop,
k_row,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_row = k_rows[k_i];
k_rowOffsetTop = k_row.offsetTop;
k_rowBottomEdge = k_rowOffsetTop + Ext.fly(k_row).getHeight();
if (k_rowOffsetTop >= k_scrollTop &&  k_rowBottomEdge <= k_scrollBottom) { k_visibleRowsCnt++;
}
else if (k_rowBottomEdge > k_scrollBottom) {
break;
}
}
return k_visibleRowsCnt;
},

_k_loadPageFromArray: function(k_rowDataList, k_totalLength, k_startRow) {
var k_records = [],
k_i, k_cnt;
this.k_clearData(k_totalLength, false);
if (!(k_rowDataList[0] instanceof Ext.data.Record)) {
for (k_i = 0, k_cnt = k_rowDataList.length; k_i < k_cnt; k_i++) {
k_records[k_i] = this._k_createRowRecord(k_rowDataList[k_i]);
}
}
else {
k_records = k_rowDataList;
}
this._k_extDataStore.add(k_records);
this._k_updatePagingToolbar(k_startRow);
},

_k_showMask: function(k_show, k_loadMaskCfg) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_element = this.k_extWidget.getEl();
k_loadMaskCfg.k_owner = this;
if (false !== k_show) {
kerio.lib._k_maskElement(k_element, k_loadMaskCfg);
}
else {
kerio.lib._k_unmaskElement(k_element, k_loadMaskCfg.k_owner);
}
},

_k_showLoadingMask: function(k_show, k_loadMaskCfg) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
if (!this._k_isDisabled) {
k_loadMaskCfg = k_loadMaskCfg || {};
this._k_showMask(k_show, k_loadMaskCfg);
}
},

k_showLoadingMask: function(k_show, k_loadMaskCfg) {
this._k_showLoadingMask(k_show, k_loadMaskCfg);
},

_k_setDisabledAllToolbars: function (k_disable) {
var
k_toolbars = this.k_toolbars,
k_toolbarType,
k_toolbar;
if (this.k_isDisabled() || this.k_isReadOnly()) {
return;
}
k_disable = false !== k_disable;
if (this._k_headerPagingToolbar) {
this._k_headerPagingToolbar.setDisabled(k_disable);
}
if (this._k_footerPagingToolbar) {
this._k_footerPagingToolbar.setDisabled(k_disable);
}
for (k_toolbarType in k_toolbars) {
k_toolbar = k_toolbars[k_toolbarType];
if (k_toolbar.k_isInstanceOf('K_Toolbar')) {
k_toolbar.k_setDisabled(k_disable);
}
}
},

k_beginUpdate: function(k_queueSuspended) {
var k_view = this.k_extWidget.getView();
k_queueSuspended = false !== k_queueSuspended;
this._k_extDataStore.suspendEvents(k_queueSuspended);
this._k_storeEventsSuspended = true;
this._k_suppressRecalculationForScrollbar = true;
if (k_view instanceof kerio.lib._K_GridBufferView) {
k_view.k_beginUpdate();
}
},

k_endUpdate: function() {
var k_view;
if (true !== this._k_storeEventsSuspended) {
return;
}
k_view = this.k_extWidget.getView();
this._k_storeEventsSuspended = false;
this._k_extDataStore.resumeEvents();
this._k_suppressRecalculationForScrollbar = false;
if (k_view instanceof kerio.lib._K_GridBufferView) {
k_view.k_endUpdate();
}
this._k_recalculateSpaceForScrollbar();
if (this._k_isGrouping) {
this.k_regroup();
}
},

k_regroup: function(k_groupBy, k_forceRegroup) {
k_groupBy = k_groupBy || this._k_groupBy;
k_forceRegroup = (false !== k_forceRegroup);
this._k_extDataStore.groupBy(k_groupBy, k_forceRegroup);
},

k_setData: function(k_data, k_config) {
var
k_selectionModel,
k_selection;
if (3 === arguments.length || (2 === arguments.length && !Ext.isObject(arguments[1]))) {
k_config = {
k_append: arguments[1], k_mapping: arguments[2] };
if (true === kerio.lib._k_debugMode) {
kerio.lib.k_warn('K_Grid.k_setData - API has changed, see documentation! Widget ID: ' + this.k_id);
}
}
k_config = k_config || {};
if (k_config.k_keepSelection && !k_config.k_append) {
k_selectionModel = this.k_extWidget.getSelectionModel();
k_selection = k_selectionModel.getSelections();
}
this._k_setOnRowsInsertedHandler(false);
this._k_dataStore.k_setData(k_data, k_config.k_append, k_config.k_mapping);
this._k_setOnRowsInsertedHandler(true);
if (k_selection && k_selection.length) {
k_selectionModel.selections.addAll(k_selection);
k_selectionModel.onRefresh();
}
this._k_updatePagingToolbar();
this._k_recalculateSpaceForScrollbar();
if (this._k_hasGroupingCheckbox) {
this.k_updateAllGroupingCheckboxes.defer(10, this, false);
}
},

k_getData: function() {
return this._k_dataStore.k_getData();
},

k_getRowByIndex: function (k_index) {
return this.k_extWidget.store.getAt(k_index).data;
},

_k_recalculateSpaceForScrollbar: function () {
var
k_extWidget = this.k_extWidget,
k_extView = k_extWidget.getView(),
k_scrollerDom,
k_hiddenContainer,
k_scrollOffset;
if (!k_extView || (k_extView && !k_extView.scroller) || !this.k_isVisible() || this._k_suppressRecalculationForScrollbar) {
return;
}
if (k_extWidget.rendered) {
k_hiddenContainer = k_extWidget.findParentBy(this._k_isContainerHidden);
if (k_hiddenContainer) {
k_hiddenContainer.on('show', this._k_recalculateSpaceForScrollbar, this, {single: true});
return;
}
}
k_scrollerDom = k_extView.scroller.dom;
if (k_scrollerDom.scrollHeight > k_scrollerDom.clientHeight) { k_scrollOffset = kerio.lib.k_getScrollbarSize().k_width + 2;
}
else {
k_scrollOffset = 2;
}
if (k_scrollOffset !== this._k_scrollOffset) {
k_extView.scrollOffset = k_scrollOffset;
this._k_scrollOffset = k_scrollOffset;
k_extWidget.syncSize();
k_extView.updateAllColumnWidths();
if (1 === this._k_cntVisibleColumns) {
k_extView.fitColumns();
}
}
},

_k_isContainerHidden: function (k_container) {
return !k_container.isVisible();
},

_k_setPagingToolbarVisibility: function() {
if (true === this._k_storedConfig.k_keepPagingVisible || !this._k_isPaging) {
return;
}
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var
k_extPagingToolbar = this._k_extPagingToolbar,
k_isPagingToolbarNecessary = (this._k_extDataStore.totalLength > k_extPagingToolbar.pageSize),
k_extWidget = this.k_extWidget;
if (this._k_extPagingToolbarForceLayout || (k_isPagingToolbarNecessary === k_extPagingToolbar.el.hasClass('hiddenPaging'))) {
this._k_extPagingToolbarForceLayout = false;  if (k_isPagingToolbarNecessary) {
k_extPagingToolbar.el.removeClass('hiddenPaging');
}
else {
k_extPagingToolbar.el.addClass('hiddenPaging');
}
if (k_extWidget.lastSize) {
k_extWidget.syncHeight();
}
}
},

_k_removeRefreshButton: function() {
var
k_extPagingToolbar = this._k_extPagingToolbar,
k_itemId = k_extPagingToolbar.items.indexOf(k_extPagingToolbar.refresh) - 1;
k_extPagingToolbar.items.get(k_itemId).hide();
k_extPagingToolbar.refresh.hide();
},

_k_focusGridOnRowClick: function (k_extGrid, k_rowIndex) {
k_extGrid.getView().focusRow(k_rowIndex);
},

k_enableGroupCheckbox: function(k_groupName, k_enable) {
var
k_checkbox = Ext.get(this._k_groupCheckboxIdPrefix + k_groupName),
k_checkboxParentElement = k_checkbox.parent();
k_enable = false !== k_enable;
k_checkbox.dom.disabled = !k_enable;
if (k_enable) {
k_checkboxParentElement.removeClass('disabled');
}
else {
k_checkboxParentElement.addClass('disabled');
}
},

k_updateAllGroupingCheckboxes: function (k_processSelectedOnly) {
var
k_groupIds = [],
k_subgroupIds = [],
k_groupBy = this._k_groupBy,
k_mappedIds = [],
k_mappedSubIds = [],
k_secondLvlGroupBy,
k_groupId,
k_records,
k_i, k_cnt;
if (k_processSelectedOnly) {
k_records = this.k_extWidget.getSelectionModel().getSelections();
}
else {
k_records = this.k_extWidget.getStore().getRange();
}
for (k_i = 0, k_cnt = k_records.length; k_i < k_cnt; k_i++) {
k_groupId = k_records[k_i].get(k_groupBy);
if (undefined === k_mappedIds[k_groupId]) {
k_groupIds.push(k_groupId);
k_mappedIds[k_groupId] = k_groupId;
}
if (this._k_isDoubleGrouping) {
k_secondLvlGroupBy = this._k_secondLevelGrouping.k_columnId;
k_groupId = k_records[k_i].get(k_secondLvlGroupBy);
if (k_groupId && undefined === k_mappedSubIds[k_groupId]) {
k_subgroupIds.push(k_groupId);
k_mappedSubIds[k_groupId] = k_groupId;
}
}
}
for (k_i = 0, k_cnt = k_groupIds.length; k_i < k_cnt; k_i++) {
this._k_updateGroupingCheckboxOfOneGroup(this, k_groupIds[k_i]);
}
if (this._k_isDoubleGrouping) {
for (k_i = 0, k_cnt = k_subgroupIds.length; k_i < k_cnt; k_i++) {
this._k_updateGroupingCheckboxOfOneGroup(this, k_subgroupIds[k_i], true);
}
}
},

_k_onChangeInlineCheckbox: function (k_grid, k_newValue, k_rowData) {
if (k_grid._k_hasGroupingCheckbox) {
k_grid._k_updateGroupingCheckboxOfOneGroup.call(k_grid, k_grid, k_rowData[k_grid._k_groupBy]);
if (k_grid._k_isDoubleGrouping && k_rowData[k_grid._k_secondLevelGrouping.k_columnId]) {
k_grid._k_updateGroupingCheckboxOfOneGroup.call(k_grid, k_grid, k_rowData[k_grid._k_secondLevelGrouping.k_columnId], true);
}
}
if (this.k_onChangeCustom) {
this.k_onChangeCustom.call(this, k_grid, k_newValue, k_rowData);
}
},

_k_checkAllGroupingCheckboxes: function (k_checked) {
var
k_groupCheckboxStates = kerio.lib.K_Grid.prototype._k_groupCheckboxStates,
k_elements = Ext.query('.groupingHeaderCheckbox'),
k_checkType = k_checked ? k_groupCheckboxStates.k_CHECKED : k_groupCheckboxStates.K_UNCHECKED,
k_element,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_elements.length; k_i < k_cnt; k_i++) {
k_element = Ext.get(k_elements[k_i].id);
this._k_checkGroupingCheckbox(k_element, k_checkType);
}
},

_k_checkGroupingCheckbox: function (k_checkbox, k_checkType, k_updateCheckedInDom) {
var
k_groupCheckboxStates = kerio.lib.K_Grid.prototype._k_groupCheckboxStates,
k_checkboxParentElement;
if (k_checkbox) {
k_checkboxParentElement = k_checkbox.parent();
k_checkboxParentElement.removeClass([k_groupCheckboxStates.k_CHECKED, k_groupCheckboxStates.K_UNCHECKED, k_groupCheckboxStates.k_SOME_CHECKED]);
k_checkboxParentElement.addClass(k_checkType);
if (false !== k_updateCheckedInDom) {
k_checkbox.dom.checked = k_groupCheckboxStates.k_CHECKED === k_checkType;
}
}
},

_k_updateGroupingCheckboxOfOneGroup: function (k_grid, k_groupId, k_secondLevel) {
var
k_columnId,
k_extGrid,
k_columnModel,
k_columnIndex,
k_column,
k_dataIndex,
k_store,
k_groupBy,
k_cntGroupItems,
k_cntEnabled,
k_records,
k_record,
k_i, k_cnt,
k_checkboxId,
k_checkboxElement,
k_checkboxParentElement,
k_groupCheckboxStates,
k_checkboxStatus;
if (k_grid._k_isGroupCbxChangeInProgress) {
return;
}
k_checkboxId = k_grid._k_groupCheckboxIdPrefix + k_groupId;
k_checkboxElement = Ext.get(k_checkboxId);
k_checkboxParentElement = k_checkboxElement.parent();
if (k_checkboxParentElement.hasClass('disabled')) {
return;
}
k_groupCheckboxStates = kerio.lib.K_Grid.prototype._k_groupCheckboxStates;
k_columnId = k_grid._k_groupingCheckboxColumn;
k_extGrid = k_grid.k_extWidget;
k_columnModel = k_extGrid.colModel;
k_columnIndex = k_columnModel.findColumnIndex(k_columnId);
k_column = k_columnModel.getColumnAt(k_columnIndex);
k_dataIndex = k_column._kx.k_editColumnId;
k_store = k_extGrid.getStore();
k_groupBy = k_secondLevel ? k_grid.k_extWidget.view.k_secondLevelGrouping.k_columnId : k_grid._k_groupBy; k_cntGroupItems = 0;
k_cntEnabled = 0;
k_records = k_store.getRange();
for (k_i = 0, k_cnt = k_records.length; k_i < k_cnt; k_i++) {
k_record = k_records[k_i];
if (k_groupId === k_record.get(k_groupBy)) {
if (k_record.get(k_dataIndex)) {
k_cntEnabled++;
}
k_cntGroupItems++;
}
}
switch (k_cntEnabled) {
case 0:
k_checkboxStatus = k_groupCheckboxStates.K_UNCHECKED;
break;
case k_cntGroupItems:
k_checkboxStatus = k_groupCheckboxStates.k_CHECKED;
break;
default:
k_checkboxStatus = k_groupCheckboxStates.k_SOME_CHECKED;
break;
}
k_grid._k_checkGroupingCheckbox(k_checkboxElement, k_checkboxStatus);
},

_k_onShowWholeGroup: function(k_extGrid, k_extGroup, k_extEvent) {
var
k_extTarget = Ext.get(k_extEvent.target);
if (k_extTarget && k_extTarget.hasClass('expandGroup')) {
return this._k_onShowWholeGroupCustom(k_extTarget, k_extGroup.dom, k_extEvent);
}
return true;
},

_k_onClickGroupingCheckbox: function(k_extGrid, k_extGroup, k_extEvent) {
var
k_grid = k_extGrid._kx.k_owner,
k_checkbox,
k_check,
k_groupId,
k_groupCheckboxStates,
k_isSecondLvlGroup = false;
if (k_extEvent.target && k_extEvent.target.id && 0 === k_extEvent.target.id.indexOf(k_grid._k_groupCheckboxIdPrefix)) {
k_checkbox = Ext.get(k_extEvent.target.id);
if (k_checkbox.parent().hasClass('disabled')) {
return false;
}
k_groupId = k_checkbox.dom.getAttribute('groupId');
k_isSecondLvlGroup = null !== k_checkbox.findParent('.x-grid-subgroup-hd', 5); k_check = true !== k_checkbox.dom.checked; k_groupCheckboxStates = kerio.lib.K_Grid.prototype._k_groupCheckboxStates;
k_grid._k_checkGroupingCheckbox(k_checkbox, k_check ? k_groupCheckboxStates.k_CHECKED : k_groupCheckboxStates.K_UNCHECKED, false);
k_grid._k_checkRecords(k_grid._k_groupingCheckboxColumn, false, k_check, k_groupId, k_isSecondLvlGroup);
return false;
}
},

k_getGroups: function() {
var
k_data = this.k_getData(),
k_groupColumn,
k_groupData,
k_item,
k_cnt, k_i;
if (!this._k_isGrouping) {
return k_data;
}
k_groupColumn = this._k_groupBy;
k_groupData = [];
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_item = k_data[k_i];
if (undefined === k_groupData[k_item[k_groupColumn]]) {
k_groupData[k_item[k_groupColumn]] = [];
}
k_groupData[k_item[k_groupColumn]].push(k_item);
}
return k_groupData;
},

k_getSubGroups: function() {
var
k_data = this.k_getData(),
k_groupColumn,
k_groupData,
k_subGroupData,
k_item,
k_cnt, k_i;
k_groupColumn = this._k_secondLevelGrouping.k_columnId;
k_groupData = [];
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
k_item = k_data[k_i];
k_subGroupData = k_item[k_groupColumn];
if (k_subGroupData) {
if (undefined === k_groupData[k_subGroupData]) {
k_groupData[k_subGroupData] = [];
}
k_groupData[k_subGroupData].push(k_item);
}
}
return k_groupData;
},

_k_groupRendererHandler: function(k_extNewValue, k_extUnused, k_extRecord, k_extRowIndex, k_extColIndex, k_extDataStore) {
var k_grid = k_extDataStore._kx.k_relatedWidget,
k_columnCfg = k_grid._k_columnModel.config[k_extColIndex],
k_rendererFunction = k_columnCfg._kx.k_groupRenderer,
k_buildTooltip = kerio.lib.k_buildTooltip,
k_rowData = k_extRecord.data,
k_iconDefinition = '',
k_groupHeaderClass = '',
k_groupHeaderInner = '',
k_checked = '',
k_groupHeaderHtml,
k_dataDefinition,
k_rendererInfo,
k_groupId,
k_checkbox,
k_checkboxId,
k_checkboxParentElement;
k_rendererInfo = k_rendererFunction.call(k_grid, k_extNewValue, k_rowData, k_extRowIndex, k_extColIndex, k_grid);
if (k_rendererInfo.k_className) {
k_groupHeaderClass += k_rendererInfo.k_className;
}
if (k_grid._k_hasGroupingCheckbox) {
k_groupHeaderClass += ' groupingHeaderWithCheckbox';
}
if (k_grid._k_hasGroupingCheckbox) {
k_groupId = k_rowData[k_columnCfg.id];
k_checkboxId = k_grid._k_groupCheckboxIdPrefix + k_groupId;
k_checkbox = Ext.get(k_checkboxId);
if (k_checkbox) {
k_checkboxParentElement = k_checkbox.parent();
if (k_checkboxParentElement) {
if (k_checkboxParentElement.hasClass('disabled')) {
k_groupHeaderClass += ' disabled';
}
}
if (k_checkbox.dom.checked) {
k_checked = ' checked="checked" ';
k_groupHeaderClass += ' checked';
}
}
k_groupHeaderInner = '<input id="' + k_checkboxId + '" type="checkbox" class="groupingHeaderCheckbox" ' + k_checked + ' groupId="' + k_groupId + '"/>';
}
k_groupHeaderHtml = [
'<span class="',
k_groupHeaderClass,
'">',
k_groupHeaderInner
].join('');
if (k_rendererInfo.k_iconCls) {
k_iconDefinition = '<span class="groupIcon ' + k_rendererInfo.k_iconCls + '"';
if (k_rendererInfo.k_iconTooltip) {
k_iconDefinition += k_buildTooltip(k_rendererInfo.k_iconTooltip, k_rendererInfo.k_isSecure);
}
k_iconDefinition += '>&nbsp; &nbsp; &nbsp;</span>';
}
k_dataDefinition = k_rendererInfo.k_data;
if (!k_rendererInfo.k_isSecure) {
k_dataDefinition = Ext.util.Format.htmlEncode(k_dataDefinition);
}
if (k_rendererInfo.k_dataTooltip) {
k_dataDefinition = '<span' + k_buildTooltip(k_rendererInfo.k_dataTooltip, k_rendererInfo.k_isSecure) + '>' + k_dataDefinition + '</span>';
}
if (k_grid._k_hasGroupingCheckbox && Ext.isIE7) {
k_groupHeaderHtml += k_iconDefinition + '</span>' + k_dataDefinition;
}
else {
k_groupHeaderHtml += k_iconDefinition + k_dataDefinition + '</span>';
}
return {
k_displayValue: k_groupHeaderHtml
};
},

_k_multilineRendererHandler: function(k_extValue, k_extMetaData, k_extRecord, k_extRowIndex, k_extColIndex, k_extDataStore) {
var k_grid = k_extDataStore._kx.k_relatedWidget,
k_columnCfg = k_grid._k_columnModel.config[k_extColIndex],
k_multilineRenderer = k_columnCfg._kx.k_multilineRenderer,
k_cellRendererInfo = k_multilineRenderer(k_extValue, k_extRecord, k_extRowIndex, k_extColIndex, k_grid),
k_rendererFunction = k_cellRendererInfo.k_lineRenderer,
k_buildTooltip = kerio.lib.k_buildTooltip,
k_htmlEncode = Ext.util.Format.htmlEncode,
k_i,
k_maxItems = Math.min( k_cellRendererInfo.k_maxItems || k_extValue.length, k_extValue.length), k_isCollapsible    = false !== k_cellRendererInfo.k_isCollapsible,    k_isCollapsed      = true  === k_cellRendererInfo.k_isCollapsed,      k_showAsCheckboxes = k_columnCfg._kx.k_showAsCheckboxes,
k_collapsedValue,
k_collapsedTooltip = k_cellRendererInfo.k_collapsedTooltip ? k_buildTooltip(k_cellRendererInfo.k_collapsedTooltip, k_cellRendererInfo.k_isSecure) : '',
k_newValue = '<table unselectable="on" class="multilineCell"><tbody'+(k_isCollapsed?' style="display:none"':'')+'>', k_rendererInfo,
k_rowClass = [],
k_cbxCol = [],
k_iconCol = [],
k_dataCol = [],
k_controlCol,
k_iconDefinition,
k_dataDefinition,
k_dataValue,
k_isSecure,
k_cbxClass,
k_hasIcons = false,
k_rowData = k_extRecord.data;
if (undefined !== k_cellRendererInfo.k_collapsedValue) {
k_collapsedValue = k_cellRendererInfo.k_isSecure
? k_cellRendererInfo.k_collapsedValue
: k_htmlEncode(k_cellRendererInfo.k_collapsedValue);
}
else {
k_collapsedValue = kerio.lib.k_tr('Items: ', 'wlibCommon') + k_extValue.length; }
if (k_cellRendererInfo.k_className) {
k_extMetaData.css += k_cellRendererInfo.k_className + ' multilineCellContainer';
}
if (0 >= k_maxItems) { k_newValue += '<tr><td unselectable="on" '+ k_collapsedTooltip +'>' + k_collapsedValue + '</td></tr></tbody>';
}
else { for (k_i = 0; k_i < k_maxItems; k_i++) {
k_rendererInfo = k_rendererFunction.call(k_grid, k_extValue[k_i], k_rowData, k_extRowIndex, k_extColIndex, k_grid, k_i);
k_iconDefinition = '';
k_dataDefinition = '';
k_dataValue = k_rendererInfo.k_data;
k_isSecure = k_rendererInfo.k_isSecure;
k_rowClass.push(k_rendererInfo.k_className ? ' class="' + k_rendererInfo.k_className + '"' : '');
if (!k_isSecure) {
k_dataValue = k_htmlEncode(k_dataValue);
}
if (k_showAsCheckboxes) {
k_cbxClass = 'cbx' + (k_extValue[k_i] ? 'On' : 'Off') + (k_rendererInfo.k_isCbxDisabled ? ' disabled' : '');
k_cbxCol.push('<td unselectable="on" class="cbx"><div unselectable="on" class="' + k_cbxClass + '"></div></td>');
}
if (k_rendererInfo.k_iconCls) {
k_iconDefinition = ' class="' + k_rendererInfo.k_iconCls + '"';
k_hasIcons = true;
if (k_rendererInfo.k_iconTooltip) {
k_iconDefinition += k_buildTooltip(k_rendererInfo.k_iconTooltip, k_isSecure);
}
}
k_iconCol.push('<td unselectable="on" ' + k_iconDefinition + '>');
if (k_rendererInfo.k_dataTooltip) {
k_dataDefinition = k_buildTooltip(k_rendererInfo.k_dataTooltip, k_isSecure);
}
k_dataCol.push('<td unselectable="on" ' + k_dataDefinition + '>' + k_dataValue + '</td>');
}
for (k_i = 0; k_i < k_maxItems; k_i++) {
k_controlCol = '';
if (k_isCollapsible) {
k_controlCol = '<td  unselectable="on" ' + (0 === k_i ? ' class="collapsible expanded"' : '') + '></td>';
}
k_newValue += '<tr' + k_rowClass[k_i] + '>'
+ (k_showAsCheckboxes ? k_cbxCol[k_i] : '')
+ (k_hasIcons ? k_iconCol[k_i] : '') + k_dataCol[k_i] + k_controlCol
+ '</tr>';
}
k_newValue += '</tbody>';
if (k_isCollapsible) {
k_dataDefinition = k_collapsedTooltip;
k_dataDefinition += (k_hasIcons ? ' colspan="2"' : '');
k_newValue += '<tbody' + ((!k_isCollapsed) ? ' style="display:none"' : '') + '><tr>';
k_newValue += '<td unselectable="on" ' + k_dataDefinition + '>' + k_collapsedValue + '</td>';
k_newValue += '<td unselectable="on" class="collapsible collapsed">&nbsp;</td></tbody>';
}
} k_newValue += '</table>';
return k_newValue;
},

_k_getRowClassHandler: function(k_record, k_rowIndex, k_rowParams, k_store) {
var k_grid = this.grid._kx.k_owner,
k_className = '',
k_colspanClassName;
if (k_grid._k_rowRenderer) {
k_className = k_grid._k_rowRenderer.call(k_grid, k_record.data, k_rowIndex, k_grid);
}
if (k_grid._k_isColSpan) {
k_colspanClassName = k_grid._k_getRowClassColSpan(k_record, k_rowIndex, k_rowParams, k_store);
k_className = kerio.lib._k_addClassName(k_className, k_colspanClassName);
}
return k_className;
},

_k_getRowClassColSpan: function(k_record, k_rowIndex, k_rowParams, k_store) {
var k_colSpanColumns = k_store._kx.k_relatedWidget._k_colSpanColumns,
k_colspanId,
k_colspanValues,
k_columnId,
k_colSpanDef,
k_body,
k_colIndex,
k_colSpanColumn,
k_metaData = {css: '', attr: ''},
k_i, k_cnt;
if ((undefined === k_colSpanColumns) || (0 === k_colSpanColumns.length)) {
return '';
}
for (k_i = 0, k_cnt = k_colSpanColumns.length; k_i < k_cnt; k_i++) {
k_colSpanColumn = k_colSpanColumns[k_i];
k_colSpanDef = k_colSpanColumn.k_colSpanIf;
k_colspanId = k_colSpanDef.k_columnId;
k_colspanValues = k_colSpanDef.k_columnValues;
k_metaData.css = '';
k_metaData.attr = '';
if (-1 !== k_colspanValues.indexOf(k_record.data[k_colspanId])) {
k_columnId = k_colSpanColumn.k_columnId;
k_colIndex = k_store._kx.k_relatedWidget._k_columnModel.findColumnIndex(k_columnId);
k_body = k_record.data[k_columnId] || '';
if (k_colSpanColumn._k_rendererHandler) {
k_body = k_colSpanColumn._k_rendererHandler(k_body, k_metaData, k_record, k_rowIndex, k_colIndex, k_store);
}
if (Ext.isIE7) { k_rowParams.body = '<span class="' + k_metaData.css + '"><div class="x-grid3-cell-inner x-grid3-col-' + k_colIndex + '"><pre unselectable="on">' + k_body + '</pre></div></span>';
}
else {
k_rowParams.body = '<span class="' + k_metaData.css + '"><div class="x-grid3-cell-inner x-grid3-col-' + k_colIndex + '">' + k_body + '</div></span>';
}
k_rowParams.bodyStyle = 'display: ' + (Ext.isGecko ? 'table-row' : 'block');
return 'colSpanRow';
}
}
k_rowParams.bodyStyle= 'display: none';
return '';
},

k_print: function () {
this._k_printerPreview();
},

_k_printerPreview: function() {
var
k_body = document.body,
k_children = k_body.childNodes,
k_printedGrid = Ext.getCmp('k_printedGrid'),
k_config = kerio.lib._k_cloneObject(this._k_initialConfig),
k_remoteData = k_config.k_remoteData,
k_child,
k_i, k_cnt,
k_appReferences,
k_appReferenceName,
k_lastParams;
if (k_printedGrid) {
kerio.lib.k_unregisterWidget(k_printedGrid._kx.k_owner.k_id);
}
this.k_extWidget.saveState();
for (k_i = 0, k_cnt = k_children.length; k_i < k_cnt; k_i++) {
k_child = k_children[k_i];
if (1 === k_child.nodeType && 'k_printPreviewDialog' !== k_child.id) {
Ext.get(k_child).addClass('noPrint');
}
}
delete k_config.k_autoExpandColumn;
delete k_config.k_toolbars;
delete k_config.k_statusbar;
delete k_config.k_update;
delete k_config.k_pageSize;
delete k_config.k_contextMenu;
k_config.k_isPrinted = true;
if (k_remoteData) {
k_lastParams = this._k_dataStore.k_getLastRequestParams();
k_remoteData.k_isAutoLoaded = false;
k_remoteData.k_jsonRpc = Ext.apply(k_remoteData.k_jsonRpc || {}, {
start: 0,
limit: -1
}, k_lastParams);
}
this._k_showPrintPreviewDialog(k_config.k_printTitle);
k_printedGrid = new kerio.lib.K_Grid('k_printedGrid', k_config);  k_appReferences = this._k_references;
if (k_appReferences) {
for (k_i = 0, k_cnt = k_appReferences.length; k_i < k_cnt; k_i++) {
k_appReferenceName = k_appReferences[k_i];
k_printedGrid[k_appReferenceName] = this[k_appReferenceName];
}
}
k_printedGrid._k_extDataStore.on('load', this._k_formatForPrint, this);
k_printedGrid.k_reloadData();
},

_k_showPrintPreviewDialog: function(k_gridTitle) {
var k_lib = kerio.lib,
k_printPreviewDialog = this._k_sharedProperties.k_printPreviewDialog;
k_gridTitle = k_gridTitle || '';
if (!k_printPreviewDialog) {
k_printPreviewDialog = new k_lib.K_Dialog('k_printPreviewDialog', {
k_title: this._k_printPreviewText,
k_hasHelpIcon: false,
k_width: 600,
k_height: 400,
k_content: new k_lib.K_ContentPanel('k_printPreviewPanel', {
k_html: '<div id="k_printedTitle" class="printedTitle">'+ k_gridTitle +'</div><div id="k_printedBody"></div>'
}),
k_buttons: [
{k_id: 'k_btnPrint', k_caption: this._k_printText, k_onClick: function() {
if (kerio.lib.k_isWebKit) {
document.getElementById('k_printedBody').parentNode.scrollLeft = 0;
}
window.print();
}},
{k_id: 'k_btnCancel', k_caption: Ext.MessageBox.buttonText.cancel, k_isCancel: true}
]
});
this._k_sharedProperties.k_printPreviewDialog = k_printPreviewDialog;
}
k_printPreviewDialog.k_toolbar.k_disableItem('k_btnPrint');
k_printPreviewDialog.k_show();
k_lib.k_getDomElement('k_printedTitle').innerHTML = k_gridTitle;
},

_k_formatForPrint: function () {
var k_extColumnModel = this.k_extWidget.getColumnModel(),
k_printedBody = Ext.get('k_printedBody'),
k_tdElements = k_printedBody.dom.getElementsByTagName('TD'),
k_colCount = k_extColumnModel.getColumnCount(),
k_width,
k_colWidth = [],
k_totalWidth = 0,
k_i, k_cnt,
k_firstChild;
for (k_i = 0; k_i < k_colCount; k_i++) {
k_width = k_extColumnModel.getColumnWidth(k_i);
k_colWidth.push(k_width - 14);  if (!k_extColumnModel.isHidden(k_i)) {
k_totalWidth += k_width;
}
}
for (k_i = 0, k_cnt = k_tdElements.length; k_i < k_cnt; k_i++) {
k_width = k_colWidth[k_i % k_colCount];
k_tdElements[k_i].style.width = k_width + 'px';
k_firstChild = k_tdElements[k_i].firstChild;
if (k_firstChild && 1 === k_firstChild.nodeType) {
k_tdElements[k_i].firstChild.style.width = k_width + 3 + 'px';  }
}
k_printedBody.setWidth(k_totalWidth);
this._k_sharedProperties.k_printPreviewDialog.k_toolbar.k_enableItem('k_btnPrint');
},

_k_addHandlersForMultilineCells: function() {
var
k_addKerioProperty = kerio.lib._k_addKerioProperty,
k_multilineCells,
k_extElementList,
k_cbxElementList,
k_extElement,
k_cbxIndex,
k_i, k_cnt;
k_multilineCells = Ext.select('table.multilineCell', true, this.k_id);
k_extElementList = k_multilineCells.elements;
for (k_i = 0, k_cnt = k_extElementList.length; k_i < k_cnt; k_i++) {
k_extElement = k_extElementList[k_i];
if (undefined === k_extElement._kx || undefined === k_extElement._kx.k_owner) {
if (this._k_hasOnCellDblClickHandler) {
k_extElement.addListener('dblclick', this._k_dblClickOnMultilineCell);
if (kerio.lib.k_isIPadCompatible) {
k_extElement.addListener('click', this._k_dblClickOnMultilineCell);
}
}
if (this._k_isRowHighlighting) {
k_extElement.parent('div.x-grid3-row').addClassOnOver('mlCellOver');
}
k_cbxElementList = k_extElement.select('td.cbx', true).elements;
for (k_cbxIndex = 0; k_cbxIndex < k_cbxElementList.length; k_cbxIndex++) {
k_cbxElementList[k_cbxIndex].first().addListener('click', this._k_cbxClickOnMultilineCell,
k_extElement, {k_cbxIndex: k_cbxIndex}
);
}
k_addKerioProperty(k_extElement, {k_owner: this});
}
}
this._k_makeMultineCellsCollapsible();
},

_k_makeMultineCellsCollapsible: function() {
var
k_addKerioProperty = kerio.lib._k_addKerioProperty,
k_collapsibleCells = Ext.select('td.collapsible', true, this.k_id).elements,     k_extView = this.k_extWidget.getView(),
k_extElement,
k_currentBody, k_rowEl,
k_colIndex,
k_colName,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_collapsibleCells.length; k_i < k_cnt; k_i++) {
k_extElement = k_collapsibleCells[k_i];
if (undefined === k_extElement._kx || undefined === k_extElement._kx.k_owner) {
k_extElement.addListener('click', this._k_clickOnCollapsibleCell);
k_addKerioProperty(k_extElement, {k_owner: this});
k_rowEl = k_extElement.parent('div.x-grid3-row').dom;
if (k_rowEl.k_mlCellCollapsed) {
k_colIndex = k_extView.findCellIndex(k_extElement.dom.parentNode.parentNode);
k_colName = this.k_extWidget.colModel.getDataIndex(k_colIndex);
k_currentBody = k_extElement.dom.parentNode.parentNode;
if (k_rowEl.k_mlCellCollapsed[k_colName] && k_currentBody.parentNode.tBodies[0] === k_currentBody) {
this._k_clickOnCollapsibleCell.call(k_extElement);
}
}
}
}
},

_k_clickOnCollapsibleCell: function() {
var
k_currentBody = this.dom.parentNode.parentNode,
k_table = k_currentBody.parentNode,
k_collapseIt = k_currentBody === k_table.tBodies[0],
k_secondBody = k_collapseIt ? k_table.tBodies[1] : k_table.tBodies[0],
k_owner = this._kx.k_owner,
k_extGrid = k_owner.k_extWidget,
k_currentRowEl = this.parent('.x-grid3-row'),
k_columnIndex = k_extGrid.getView().findCellIndex(k_currentBody),
k_columnId = k_extGrid.colModel.getDataIndex(k_columnIndex);
if (!k_currentRowEl.dom.k_mlCellCollapsed) {
k_currentRowEl.dom.k_mlCellCollapsed = {};
}
k_currentRowEl.dom.k_mlCellCollapsed[k_columnId] = k_collapseIt;
k_currentBody.style.display = 'none';
k_secondBody.style.display = Ext.isIE ? 'block' : 'table-row-group';
k_owner._k_recalculateSpaceForScrollbar.call(k_owner);
},

_k_dblClickOnMultilineCell: function(k_extEvent) {
k_extEvent.stopEvent();
var k_currentCell = this.dom.parentNode.parentNode,
k_grid = this._kx.k_owner,
k_extWidget = k_grid.k_extWidget,
k_gridView = k_extWidget.getView(),
k_rowIndex = k_gridView.findRowIndex(k_currentCell),
k_columnIndex = k_gridView.findCellIndex(k_currentCell);
k_grid._k_onDblClickCell.call(k_grid, k_extWidget, k_rowIndex, k_columnIndex, k_extEvent);
},

_k_cbxClickOnMultilineCell: function(k_extEvent, k_domElement, k_options) {
var
k_currentCell = this.dom.parentNode.parentNode,
k_grid = this._kx.k_owner,
k_extWidget = k_grid.k_extWidget,
k_gridView = k_extWidget.getView(),
k_rowIndex = k_gridView.findRowIndex(k_currentCell),
k_columnIndex = k_gridView.findCellIndex(k_currentCell),
k_columnModel = k_extWidget.getColumnModel(),
k_columnId = k_columnModel.getDataIndex(k_columnIndex),
k_extColumn = k_columnModel.getColumnById(k_columnId),
k_record = k_extWidget.store.getAt(k_rowIndex),
k_itemIndex = k_options.k_cbxIndex,
k_processOnChange = true,
k_cellData,
k_oldValue,
k_newValue;
if (-1 !== k_domElement.className.indexOf('disabled') || k_grid.k_isReadOnly()) {
return;  }
k_oldValue = k_record.data[k_columnId][k_itemIndex];
k_grid._k_setEditInfo({
grid  : k_extWidget,
record: k_record,
field : k_columnId,
value : k_oldValue,
row   : k_rowIndex,
column: k_columnIndex,
k_itemIndex: k_itemIndex
});
k_newValue = !k_oldValue;
if (k_grid._k_mappedListeners.k_onBeforeEdit) {
if (false === k_grid._k_mappedListeners.k_onBeforeEdit.call(k_grid, k_grid, k_columnId, k_oldValue, k_record.data)) {
return;
}
}
if (k_extColumn._kx && k_extColumn._kx.k_onBeforeEdit) {
if (false === k_extColumn._kx.k_onBeforeEdit.call(k_grid, k_grid, k_columnId, k_oldValue, k_record.data, k_itemIndex)) {
return;
}
}
k_cellData = k_record.data[k_columnId].concat([]);
k_cellData[k_itemIndex] = k_newValue;
k_record.set(k_columnId, k_cellData);
if (k_processOnChange && k_extColumn._kx && k_extColumn._kx.k_onChange) {
k_extColumn._kx.k_onChange.call(k_grid, k_grid, k_newValue, k_record.data, k_itemIndex);
}
},

_k_applyEmptyText: function(k_extGridPanel){
k_extGridPanel.getView().applyEmptyText();
},

k_refresh: function (k_headersToo) {
var k_extWidget = this.k_extWidget;
if (k_extWidget.rendered) {
k_extWidget.getView().refresh(k_headersToo);
}
},

_k_reapplyClasses: function() {
var k_extWidget = this.k_extWidget,
k_cfgBorder = false !== k_extWidget.initialConfig.border;
if (k_cfgBorder && k_extWidget.border !== k_cfgBorder) {
k_extWidget.el.removeClass(k_extWidget.baseCls + '-noborder');
k_extWidget.body.removeClass(k_extWidget.bodyCls + '-noborder');
}
},


k_checkSelectedRows: function (k_check) {
var
k_selectionModel = this.k_extWidget.getSelectionModel(),
k_kxp = k_selectionModel._kxp;
if (false === k_check) {
k_kxp.k_uncheckSelected.call(k_selectionModel);
}
else {
k_kxp.k_checkSelected.call(k_selectionModel);
}
},

k_uncheckSelectedRows: function () {
this.k_checkSelectedRows(false);
},

k_getCheckedRows: function() {
var
k_selectionModel = this.k_extWidget.getSelectionModel(),
k_dataStore = this._k_extDataStore,
k_extCheckedRows = k_selectionModel._kxp.k_getChecked.call(k_selectionModel),
k_checkedRows = {},
k_rows = [],
k_rowProperties,
k_cnt,
k_i;
k_cnt = k_extCheckedRows.length;
k_checkedRows.k_checkedRowsCount = k_cnt;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_rowProperties = k_extCheckedRows[k_i];
k_rows.push({
k_rowIndex: k_dataStore.indexOfId(k_rowProperties.id),
k_data: k_rowProperties.data,
k_extRecord: k_rowProperties
});
}
k_checkedRows.k_rows = k_rows;
return k_checkedRows;
},

k_isRowChecked: function (k_index) {
var k_selectionModel = this.k_extWidget.getSelectionModel();
return k_selectionModel._kxp.k_isChecked.call(k_selectionModel, k_index);
},

_k_onCheckChanged: function (k_extSelectionModel) {
kerio.lib.k_notify(this, this.k_eventTypes.k_CHECK_CHANGED);
},

_k_onBeforeRowCheckHandler: function (k_extSelectionModel, k_rowIndex, k_rowRecord) {
return this._k_mappedListeners.k_onBeforeRowCheck.call(this, this, k_rowRecord.data, k_rowIndex);
},

k_updateRow: function(k_rowData, k_origRowIndex, k_targetRowIndex) {
var
k_dataStore = this._k_dataStore.k_extWidget,
k_rowRecord,
k_isRowSelected,
k_selectionStatus;
k_dataStore = this._k_dataStore.k_extWidget;
k_isRowSelected = false;
if (undefined === k_origRowIndex) {
k_selectionStatus = this.k_selectionStatus;
if (0 >= k_selectionStatus.k_selectedRowsCount) {
return;
}
k_rowRecord = k_selectionStatus.k_rows[0].k_extRecord;
k_isRowSelected = true;
}
else {
k_rowRecord = k_dataStore.getAt(k_origRowIndex);
}
if (undefined === k_targetRowIndex) {
k_targetRowIndex = (undefined !== k_origRowIndex) ? k_origRowIndex : k_dataStore.indexOf(k_rowRecord);
}
this._k_dataStore.k_updateRow.call(this._k_dataStore, k_rowData, k_rowRecord, k_origRowIndex, k_targetRowIndex);
if (k_isRowSelected) {
this.k_selectRows([k_targetRowIndex]);
}
},

k_reloadData: function(k_requestParams) {
this._k_dataStore.k_reloadData.call(this._k_dataStore, k_requestParams);
},

k_addRow: function(k_rowData, k_targetRowIndex) {
this._k_dataStore.k_addRow.call(this._k_dataStore, k_rowData, k_targetRowIndex);
if (this._k_isLocalData) {
this._k_updatePagingToolbar();
}
},

k_getRowsCount: function(k_returnTotalCount) {
return this._k_dataStore.k_getRowsCount.call(this._k_dataStore, k_returnTotalCount);
},

k_appendRow: function(k_rowData) {
var k_targetRowIndex = this._k_dataStore.k_getItemsCount();
this.k_addRow(k_rowData, k_targetRowIndex);
},

k_toggleAllGroups: function(k_isExpanded) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
this.k_extWidget.view.toggleAllGroups(k_isExpanded);
},

k_toggleGroups: function(k_groupStrings, k_isExpanded) {
var
k_item,
k_i, k_cnt;
if (!Ext.isArray(k_groupStrings)) {
k_groupStrings = [k_groupStrings];
}
if (0 === k_groupStrings.length) {
return;
}
for (k_i=0, k_cnt=k_groupStrings.length; k_i < k_cnt; k_i++) {
k_item = k_groupStrings[k_i];
this.k_toggleGroup(k_item, k_isExpanded);
}
},

k_toggleGroup: function(k_groupSubstring, k_isExpanded) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var
k_view = this.k_extWidget.view;

k_view.toggleGroup(k_view.getGroupId(k_groupSubstring), k_isExpanded);
},

k_setDisabledDragDrop: function(k_disable) {
k_disable = (undefined === k_disable) ? true : k_disable;
if (k_disable) {
this._k_dragZone.lock();
}
else {
this._k_dragZone.unlock();
}
},

_k_hideSelectEditor: function(k_extSelect, k_extEvent) {
if (k_extEvent.ESC === k_extEvent.getKey()) {
k_extSelect.hide();
}
},

k_getDataStore: function () {
return this._k_dataStore;
},

k_startTracing: function(k_resetTraceLog) {
this._k_dataStore.k_startTracing(k_resetTraceLog);
},

k_stopTracing: function() {
this._k_dataStore.k_stopTracing();
},

k_isChanged: function() {
return this._k_dataStore.k_isChanged();
},

k_getChangedData: function(k_updatedFieldsOnly) {
return this._k_dataStore.k_getChangedData(k_updatedFieldsOnly);
},

k_getChangedDataForSet: function() {
return this._k_dataStore.k_getChangedDataForSet();
},

k_setTitle: function(k_title) {
this.k_extWidget.setTitle(k_title);
},

k_getColumnId: function (k_columnIndex) {
return this._k_columnModel.getDataIndex(k_columnIndex);
},

_k_initDragDropRow: function () {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var
k_ddGroup = this.k_id + '_' + 'k_dragDropGroup',
k_storedConfig = this._k_storedConfig,
K_DropZone = this._k_isGrouping ? kerio.lib._K_GroupingGridRowDropZone : kerio.lib._K_GridRowDropZone;
this._k_dragZone = new kerio.lib._K_GridRowDragZone(this.k_extWidget, {
ddGroup: k_ddGroup,
k_dragColumnId: k_storedConfig.k_dragColumnId,
k_onBeforeDrag: k_storedConfig.k_onBeforeDrag
});
this._k_dropZone = new K_DropZone(this.k_extWidget, {
ddGroup: k_ddGroup,
k_onDrag: k_storedConfig.k_onDrag,
k_onDrop: k_storedConfig.k_onDrop
});
this._k_removeStoredProperties(['k_dragColumnId', 'k_onBeforeDrag', 'k_onDrag', 'k_onDrop']);
},

_k_onViewReady: function(){
var
k_extWidget = this.k_extWidget,
k_view = k_extWidget.getView();
this._k_recalculateSpaceForScrollbar();
if (false !== k_extWidget.enableHdMenu) {
Ext.fly(k_view.innerHd).on('contextmenu', this._k_onHeaderContextMenu, this);
}
if (this._k_storedConfig.k_contextMenu) {
k_view.scroller.on('contextmenu', this._k_onContextMenuEmptyArea, this);
this._k_removeStoredProperties(['k_contextMenu']);
}
if (this._k_hasGroupingCheckbox && this._k_updateGroupingCheckboxesOnViewReady) {
this.k_updateAllGroupingCheckboxes(false);
}
},

_k_onHeaderContextMenu: function (k_extEvent, k_target) {
var
k_view = this.k_extWidget.getView(),
k_hd = k_view.findHeaderCell(k_target),
k_index = k_view.getCellIndex(k_hd),
k_menu = k_view.hmenu,
k_menuItems = k_menu.items,
k_columnModel = k_view.cm;
k_extEvent.stopEvent();
if (false === k_index) {  return;
}
k_view.hdCtxIndex = k_index;
k_menuItems.get('asc').setDisabled(!k_columnModel.isSortable(k_index));
k_menuItems.get('desc').setDisabled(!k_columnModel.isSortable(k_index));
k_menu.showAt(k_extEvent.getXY());
},

_k_storeInitialSettings: function (k_config) {
var
k_settings = {columns: [], order: [], sortedBy: {}},
k_columns = k_config.k_columns,
k_sort = k_settings.sortedBy,
k_columnIndex = 0,
k_groupingColumn = (k_columns.k_grouping && k_columns.k_grouping.k_columnId) || null,
k_i,
k_column;
if (k_columns.k_sorting) {
k_sort.columnId = k_columns.k_sorting.k_columnId;
k_sort.direction = false !== k_columns.k_sorting.k_isAscending ? 'ASC' : 'DESC';
}
for(k_i = 0; (k_column = k_columns.k_items[k_i]); k_i++) {
if (true === k_column.k_isDataOnly) {
continue;
}
k_settings.columns[k_columnIndex] = {
columnId: k_column.k_columnId,
width: undefined === k_column.k_width ? Ext.grid.ColumnModel.prototype.defaultWidth : k_column.k_width,
hidden: null === k_groupingColumn ? Boolean(k_column.k_isHidden) : k_column.k_columnId === k_groupingColumn ? true : Boolean(k_column.k_isHidden)
};
k_settings.order.push(k_column.k_columnId);
if (!k_columns.k_sorting && false !== k_column.k_isHidden && undefined === k_sort.columnId) {
k_sort.columnId = k_column.k_columnId;
k_sort.direction = 'ASC';
}
k_columnIndex++;
}
this._k_initialSettings = k_settings;
},

_k_getSettings: function(){
var
k_settings = {order: []},
k_extWidget = this.k_extWidget,
k_store = k_extWidget.store,
k_initialSettings = this._k_initialSettings,
k_isDefaultSortColumnMoved = false,
k_isOrderChanged = false,
k_lib = kerio.lib,
k_appliedSettings = this._k_appliedSettings,
k_initialColumnSettings,
k_columnSettings,
k_getColumnsBy,
k_columnIndex,
k_column,
k_sort,
k_i;
k_getColumnsBy = function (k_columnConfig) {
return this.columnId === k_columnConfig.dataIndex;
};
for(k_i = 0; (k_initialColumnSettings = k_initialSettings.columns[k_i]); k_i++) {
k_column = k_extWidget.getColumnModel().getColumnsBy(k_getColumnsBy, k_initialColumnSettings)[0];
k_columnSettings = {
width: k_column.width,
hidden: k_column.hidden
};
if (k_initialColumnSettings.width === k_column.width
|| (k_column.dataIndex === k_extWidget.autoExpandColumn && (!this._k_isAutoExpandColumnResized && !this._k_isAutoExpandColumnMoved))) {
delete k_columnSettings.width;
}
if (k_initialColumnSettings.hidden === Boolean(k_column.hidden)) {
delete k_columnSettings.hidden;
}
if (!k_lib.k_isEmpty(k_columnSettings)) {
k_columnSettings.columnId = k_column.dataIndex;
if (!k_settings.columns) {
k_settings.columns = [];
}
k_settings.columns.push(k_columnSettings);
}
k_columnIndex = k_extWidget.getColumnModel().getIndexById(k_column.id);
k_settings.order[k_columnIndex] = k_column.dataIndex;
if (k_columnIndex !== k_initialSettings.order.indexOf(k_column.dataIndex)) {
if (!this._k_initialSettings.sortedBy && k_column.dataIndex === this._k_sorting.k_columnId) {
k_isDefaultSortColumnMoved = true;
}
k_isOrderChanged = true;
}
}
if (k_appliedSettings) {
if (k_appliedSettings.k_columnState && !k_settings.columns) {
k_settings.columns = [];
}
if (!k_isOrderChanged) {
if (k_appliedSettings.k_columnOrder) {
k_settings.order = [];
}
else {
delete k_settings.order;
}
}
}
else if (!k_isOrderChanged) {
delete k_settings.order;
}
if (k_store) {
k_sort = k_store.getSortState();
if (k_sort) {
if (!k_initialSettings.sortedBy) {
k_initialSettings.sortedBy = {
columnId: this._k_sorting.k_columnId,
direction: false !== this._k_sorting.k_isAscending ? 'ASC' : 'DESC'
};
}
k_settings.sortedBy = {
columnId: k_sort.field,
direction: k_sort.direction
};
if (!k_isDefaultSortColumnMoved || (k_isDefaultSortColumnMoved && k_sort.field !== this._k_sorting.k_columnId)) {
if (!k_appliedSettings && k_settings.sortedBy.columnId === k_initialSettings.sortedBy.columnId
&& k_settings.sortedBy.direction === k_initialSettings.sortedBy.direction) {
delete k_settings.sortedBy;
}
}
}
}
return k_settings;
},

_k_getCfgColumnIndex: function(k_columnId, k_columnsCfg) {
var
k_i,
k_cnt,
k_columnIndex = 0;
for (k_i = 0, k_cnt = k_columnsCfg.length; k_i < k_cnt; k_i++) {
if (true === k_columnsCfg[k_i].k_isDataOnly) {
continue;
}
k_columnIndex++;
if (k_columnsCfg[k_i].k_columnId === k_columnId) {
return {
k_index: k_columnIndex, k_globalIndex: k_i      };
}
}
return null;
},

_k_applySettingsToConfig: function (k_settings, k_config) {
var
k_columnState = k_settings.columns,
k_columnOrder = k_settings.order,
k_columnsCfg = k_config.k_columns.k_items,
k_isSortingColumnPresented = null,
k_lib = kerio.lib,
k_columnIndexes,
k_columnId,
k_columnCfg,
k_i, k_j, k_cnt, k_cnt2;
this._k_appliedSettings = {
k_columnState: !k_lib.k_isEmpty(k_columnState),
k_columnOrder: !k_lib.k_isEmpty(k_columnOrder),
k_sorting: !k_lib.k_isEmpty(k_settings.sortedBy)
};
if (k_columnState) {
for(k_i = 0, k_cnt = k_columnsCfg.length; k_i < k_cnt; k_i++) {
k_columnCfg = k_columnsCfg[k_i];
if (k_columnCfg.k_isDataOnly) {
continue;
}
for (k_j = 0, k_cnt2 = k_columnState.length; k_j < k_cnt2; k_j++) {
if (k_columnState[k_j].columnId === k_columnCfg.k_columnId) {
k_columnCfg.k_width = k_columnState[k_j].width;
if (k_columnState[k_j].columnId === k_config.k_columns.k_autoExpandColumn && k_columnState[k_j].width) {
delete k_config.k_columns.k_autoExpandColumn;
}
if (undefined !== k_columnState[k_j].hidden) {
k_columnCfg.k_isHidden = k_columnState[k_j].hidden;
}
break;
}
}
}
}
if (k_columnOrder) {
k_isSortingColumnPresented = false;
k_j = 0;
for (k_i = 0, k_cnt = k_columnsCfg.length; k_i < k_cnt; k_i++) {
if (k_columnsCfg[k_i].k_isDataOnly)	 {
continue;
}
if (k_settings.sortedBy && k_settings.sortedBy.columnId === k_columnsCfg[k_i].k_columnId) {
k_isSortingColumnPresented = true;
}
if (-1 === k_columnOrder.indexOf(k_columnsCfg[k_i].k_columnId)) {
k_columnOrder = k_columnOrder.slice(0, k_j).concat([k_columnsCfg[k_i].k_columnId]).concat(k_columnOrder.slice(k_j));
}
k_j++;
}
for (k_i = 0, k_cnt = k_columnOrder.length; k_i < k_cnt; k_i++) {
k_columnId = k_columnOrder[k_i];
k_columnIndexes = this._k_getCfgColumnIndex(k_columnId, k_columnsCfg);
if (null === k_columnIndexes) {
continue;
}
if (k_columnIndexes.k_index !== k_i) {
k_columnCfg = k_columnsCfg[k_columnIndexes.k_globalIndex];
k_columnsCfg.splice(k_columnIndexes.k_globalIndex, 1);
k_columnsCfg.splice(k_i, 0, k_columnCfg);
}
}
}
if (k_settings.sortedBy) {
if (null === k_isSortingColumnPresented) { k_isSortingColumnPresented = false;
for (k_i = 0, k_cnt = k_columnsCfg.length; k_i < k_cnt; k_i++) {
if (k_columnsCfg[k_i].k_isDataOnly)	 {
continue;
}
if (k_settings.sortedBy.columnId === k_columnsCfg[k_i].k_columnId) {
k_isSortingColumnPresented = true;
}
}
}
if (k_isSortingColumnPresented) {
k_config.k_columns.k_sorting = Ext.apply(k_config.k_columns.k_sorting || {}, {
k_columnId: k_settings.sortedBy.columnId,
k_isAscending: 'DESC' !== k_settings.sortedBy.direction
});
}
}
},

_k_fixScrollbars: function (k_gridView) {
var k_scroller = k_gridView.scroller;
if (k_scroller.getHeight() >= k_gridView.mainBody.getHeight()) {
kerio.lib._k_fixScrollbars(k_scroller);
}
},

_k_setTouchEvents: function() {
var
k_config,
k_touchControler;
k_config = {
k_element: this.k_extWidget.getView().el.dom,
k_onSingleTap: this._k_onSingleTap,
k_onTouchStart: this._k_onTouchStart,
k_onTouchMove: this._k_onTouchMove,
k_onTouchEnd: this._k_onTouchEnd,
k_scope: this,
k_preventDefault: false
};
if (this._k_storedConfig.k_contextMenu) {
k_config.k_onDoubleTap = this._k_onDoubleTap;
}
k_touchControler = new kerio.lib.K_TouchController(k_config);
},

_k_onSingleTap: function(k_touchStatus) {
var
k_extEvent = k_touchStatus.k_createExtEventFromTouch('click'),
k_target = k_extEvent.getTarget(),
k_extView = this.k_extWidget.getView(),
k_headerCell = k_extView.findHeaderCell(k_target),
k_headerButtons,
k_i, k_cnt;
if (!k_headerCell) {
return;  }
if ('A' === k_target.tagName && -1 !== k_target.className.indexOf('x-grid3-hd-btn')) {
return;  }
if (-1 === k_headerCell.className.indexOf('-hd-over')) {  k_headerButtons = k_extView.mainHd.dom.getElementsByTagName('td');
for (k_i = 0, k_cnt = k_headerButtons.length; k_i < k_cnt; k_i++) {
if (-1 !== k_headerButtons[k_i].className.indexOf('-hd-over')) {
k_extView.handleHdOut(k_extEvent, k_headerButtons[k_i]);
}
}
k_extView.handleHdOver(k_extEvent, k_headerCell);
k_extView.handleHdOut.defer(2000, k_extView, [k_extEvent, k_headerCell]);  }
else {
k_extView.onHeaderClick(this.k_extWidget, k_extView.getCellIndex(k_headerCell));
}
},

_k_onDoubleTap: function(k_touchStatus) {
var
k_extEvent = k_touchStatus.k_createExtEventFromTouch('click'),
k_extView = this.k_extWidget.getView(),
k_row = document.elementFromPoint(k_touchStatus.k_currentX, k_touchStatus.k_currentY),
k_rowIndex;
k_row = k_extView.findRow(k_row);
k_rowIndex = k_extView.findRowIndex(k_row);
this._k_onContextMenu(this.k_extWidget, k_rowIndex, k_extEvent);
},

_k_onTouchStart: function(k_touchStatus) {
var k_extEvent = k_touchStatus.k_createExtEventFromTouch('mousedown');
this.k_extWidget.getView().splitZone.handleMouseDown(k_extEvent);
},

_k_onTouchMove: function(k_touchStatus) {
var
k_extEvent = k_touchStatus.k_createExtEventFromTouch('mousemove', true),
k_extView = this.k_extWidget.getView(),
k_offset = 50;
if (this.k_extWidget.enableColumnMove) {
if (kerio.adm && kerio.adm.k_framework._k_mainLayout.k_extWidget.items.get(0).collapsed) {
k_offset = -20;  }
k_extView.columnDrag.setDelta(50, k_offset);
}
k_extView.handleHdOut(k_extEvent, k_extView.activeHdRef);
Ext.dd.DragDropMgr.handleMouseMove(k_extEvent);
},

_k_onTouchEnd: function(k_touchStatus) {
var k_extEvent = k_touchStatus.k_createExtEventFromTouch('mouseup', true);
Ext.dd.DragDropMgr.handleMouseUp(k_extEvent);
},

_k_fitColumnWidth: function (k_columnId) {
var
k_extWidget = this.k_extWidget,
k_view = k_extWidget.getView(),
k_colModel = k_extWidget.getColumnModel(),
k_columnIndex = k_colModel.getIndexById(k_columnId),
k_cellWidths = [],
k_collapsibleToolWidth,
k_hasCollapsibleTool,
k_cellFirstChildDom,
k_maxMlCellWidth,
k_cellToMeasure,
k_mlCellWidth,
k_cellParent,
k_lastMlCell,
k_mlRowsCnt,
k_cellDom,
k_mlCells,
k_mlRows,
k_width,
k_cells,
k_cell,
k_i, k_j, k_cnt;
k_cells = k_view.mainBody.select('.x-grid3-col-' + k_columnId).elements;
k_cell = Ext.fly(k_view.getHeaderCell(k_columnIndex)).child('.x-grid3-hd-' + k_columnId, true);  if (k_cell) {
k_cells.push(k_cell);
}
if (!k_cells.length) { return;
}
for (k_i = 0, k_cnt = k_cells.length; k_i < k_cnt; k_i++) {
k_cellDom = k_cells[k_i];
k_cell = Ext.get(k_cellDom);
k_cellFirstChildDom = !Ext.isIE7 ? k_cellDom.firstChild : k_cellDom.firstChild.firstChild; if (!k_cellFirstChildDom) {
continue;
}
if (Ext.fly(k_cellFirstChildDom).hasClass('multilineCell')) {
if (!Ext.fly(k_cellFirstChildDom.firstChild).isDisplayed()) { continue;
}
k_mlRows = k_cellFirstChildDom.firstChild.childNodes;
k_maxMlCellWidth = 0;
k_mlCells = k_mlRows[0].childNodes;
k_lastMlCell = Ext.fly(k_mlCells[k_mlCells.length - 1]);
k_hasCollapsibleTool = k_lastMlCell.hasClass('collapsible');
k_collapsibleToolWidth = k_hasCollapsibleTool ? k_lastMlCell.getWidth() : 0;
for (k_j = 0, k_mlRowsCnt = k_mlRows.length; k_j < k_mlRowsCnt; k_j++) {
k_mlCells = k_mlRows[k_j].childNodes;
k_mlCellWidth = 0;
if (3 === k_mlCells.length || Ext.fly(k_mlCells[0]).hasClass('cbx')) { k_mlCellWidth += Ext.fly(k_mlCells[0]).getWidth();
k_cellToMeasure = k_mlCells[1];
}
else if (2 === k_mlCells.length) { if (k_hasCollapsibleTool) {
k_cellToMeasure = k_mlCells[0];
}
else {
k_mlCellWidth += Ext.fly(k_mlCells[0]).getWidth();
k_cellToMeasure = k_mlCells[1]; }
}
else {
k_cellToMeasure = k_mlCells[0];
}
k_mlCellWidth += Ext.util.TextMetrics.measure(k_cellToMeasure, k_cellToMeasure.innerHTML).width;
if (k_hasCollapsibleTool) {
k_mlCellWidth += k_collapsibleToolWidth;
}
k_maxMlCellWidth = Math.max(k_mlCellWidth, k_maxMlCellWidth);
}
k_width = k_maxMlCellWidth + 2 * (k_mlCells.length + 1); }
else {
k_width = Ext.util.TextMetrics.measure(k_cell, k_cellDom.innerHTML).width;
k_width += 3; }
k_cellParent = k_cell.parent();
k_width += k_cell.getFrameWidth('lr') + k_cell.getMargins('lr');
k_width += k_cellParent.getFrameWidth('lr') + k_cellParent.getMargins('lr');
k_cellWidths.push(k_width);
}
if (k_colModel.isSortable(k_columnIndex) && (k_cell = k_cell.child('.x-grid3-sort-icon'))) {
k_width = k_cell.getComputedWidth() + k_cell.getMargins('lr'); k_cellWidths[k_cellWidths.length - 1] += k_width; }
if (!k_colModel.isMenuDisabled(k_columnIndex)) {
k_cellWidths[k_cellWidths.length - 1] += 13; if (Ext.fly(k_view.getHeaderCell(k_columnIndex)).hasClass('lastVisibleColumn')) {
k_cellWidths[k_cellWidths.length - 1] += 5; }
}
k_cellWidths.push(k_extWidget.minColumnWidth);
k_width = Math.max.apply(Math, k_cellWidths);
k_view.onColumnSplitterMoved(k_columnIndex, k_width);
},

_k_onHeaderDblClick: function (k_extGrid, k_columnIndex, k_extEvent) {
var
k_view = k_extGrid.getView(),
k_columnModel = k_extGrid.getColumnModel(),
k_activeHdIndex = k_view.activeHdIndex,
k_adjust = 0,
k_handleWidth,
k_columnId,
k_target,
k_ex,
k_x;
k_target = k_view.findHeaderCell(k_extEvent.getTarget());
if (k_target) {
k_x = k_view.fly(k_target).getXY()[0];
k_ex = k_extEvent.getXY()[0];
k_handleWidth = this.k_extWidget.getView().splitHandleWidth || 5;
if ((k_ex - k_x) <= k_handleWidth) {
k_adjust = -1;
}
if (-1 === k_adjust) {
if (k_activeHdIndex + k_adjust < 0) {
return;
}
while (k_columnModel.isHidden(k_activeHdIndex + k_adjust)){
--k_adjust;
if(k_activeHdIndex + k_adjust < 0){
return;
}
}
}
}
if (this._k_isMouseInHeaderResizeArea(k_extEvent)) {
k_columnId = k_columnModel.getColumnId(k_activeHdIndex + k_adjust);
this._k_fitColumnWidth(k_columnId);
}
},

_k_isMouseInHeaderResizeArea: function (k_extEvent) {
var
k_view  = this.k_extWidget.getView(),
k_headerEl = k_view.findHeaderCell(k_view.activeHdRef),
k_handleDefaultWidth,
k_handleWidth,
k_activeHdRegion,
k_pageX;
if (k_headerEl) {
k_handleDefaultWidth = parseInt(Ext.fly(k_headerEl).child('.x-grid3-hd-btn').getStyle('right'), 10) || 2;
}
else {
k_handleDefaultWidth = 2;
}
if (k_headerEl) {
k_handleWidth = k_view.splitHandleWidth || 5;
k_activeHdRegion = k_view.activeHdRegion;
k_pageX = k_extEvent.getPageX();
if (this.k_extWidget.enableColumnResize !== false) {
if ((k_pageX - k_activeHdRegion.left <= k_handleWidth && k_view.cm.isResizable(k_view.activeHdIndex - 1)) ||
(k_activeHdRegion.right - k_pageX <= (!k_view.activeHdBtn ? k_handleWidth : k_handleDefaultWidth) && k_view.cm.isResizable(k_view.activeHdIndex))) {
return true;
}
}
}
return false;
},

_k_setLastVisibleColumnClassName: function () {
var
k_elements = this.mainWrap.child('.x-grid3-header').select('.x-grid3-hd').elements,
k_el, k_i, k_cnt;
for (k_i = 0, k_cnt = k_elements.length; k_i < k_cnt; k_i++) {
Ext.fly(k_elements[k_i]).removeClass('lastVisibleColumn');
}
for (k_i = k_elements.length - 1; k_i >=0; k_i--) {
k_el = Ext.fly(k_elements[k_i]);
if (k_el.isDisplayed()) {
k_el.addClass('lastVisibleColumn');
break;
}
}
},

_k_initCheckAllMenu: function () {
var
k_checkColumnsInfo = this._k_checkColumnsInfo,
k_menu,
k_extWidget,
k_extView,
k_i, k_cnt;
if (!k_checkColumnsInfo) {
return;
}
k_extWidget = this.k_extWidget;
this._k_checkAllMenus = {};
for (k_i = 0, k_cnt = k_checkColumnsInfo.length; k_i < k_cnt; k_i++) {
k_menu = this._k_createCheckAllMenu(k_checkColumnsInfo[k_i].k_columnName);
k_menu.k_extWidget.on('beforeshow', this._k_onBeforeShowCheckAllMenu, {
k_menu: k_menu,
k_selectionModel: k_extWidget.getSelectionModel(),
k_store: k_extWidget.getStore(),
k_grid: this
});
this._k_checkAllMenus[k_checkColumnsInfo[k_i].k_columnName] = k_menu;
}
k_extWidget.on('viewready', this._k_createCheckAllMenuButton, this);
k_extView = k_extWidget.getView();
k_extView.updateHeaders = k_extView.updateHeaders.createSequence(this._k_createCheckAllMenuButton, this);
},

_k_createCheckAllMenuButton: function () {
var
k_mainHd = this.k_extWidget.getView().mainHd,
k_checkColumnsInfo = this._k_checkColumnsInfo,
k_cell,
k_menu,
k_tooltip,
k_btnEl,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_checkColumnsInfo.length; k_i < k_cnt; k_i++) {
k_cell = k_mainHd.child('.x-grid3-hd-' + k_checkColumnsInfo[k_i].k_cellName);
if (!k_cell) {
continue;
}
if (!k_cell.child('.checkAllButton')) {
k_btnEl = k_cell.insertFirst({
tag: 'div',
cls: 'checkAllButtonWrap',
children: [{
tag: 'div',
cls: 'checkAllButton'
}]
});
k_menu = this._k_checkAllMenus[k_checkColumnsInfo[k_i].k_columnName];
k_tooltip = new Ext.ToolTip({
target: k_btnEl.down('.checkAllButton').id,
html: this._k_checkAllButtonToolTip
});
k_tooltip.on('show', this._k_onShowCheckAllTooltip, k_menu.k_extWidget);
k_menu.k_extWidget.on({
show: this._k_onShowCheckAllMenu,
hide: this._k_onHideCheckAllMenu,
scope: k_tooltip
});
k_cell.addClass('checkAllButtonCell');
k_btnEl.on('click', this._k_onClickCheckAllMenuBtn, k_menu);
}
}
},

_k_onShowCheckAllMenu: function () {
this.hide();
this.disable();
},

_k_onHideCheckAllMenu: function () {
this.enable();
},

_k_onShowCheckAllTooltip: function (k_tooltip) {
if (this.isVisible()) {
k_tooltip.hide();
}
},

_k_onClickCheckAllMenuBtn: function () {
Ext.EventObject.stopEvent();
this.k_extWidget.show(Ext.EventObject.getTarget());
},

_k_createCheckAllMenu: function (k_columnId) {
var
k_captions = this._k_checkAllMenuCaptions,
k_menu;
k_menu = new kerio.lib.K_Menu(this.k_id + '_' + 'k_checkAllMenu' + '_' + k_columnId, {
k_items: [{
k_caption: k_captions.k_checkAll,
k_id: 'k_checkAll',
k_onClick: this._k_checkRecordsByMenu
}, {
k_caption: k_captions.k_uncheckAll,
k_id: 'k_uncheckAll',
k_onClick: this._k_checkRecordsByMenu
}, {
k_caption: k_captions.k_checkSelected,
k_id: 'k_checkSelected',
k_onClick: this._k_checkRecordsByMenu
}, {
k_caption: k_captions.k_uncheckSelected,
k_id: 'k_uncheckSelected',
k_onClick: this._k_checkRecordsByMenu
}]
});
k_menu.k_relatedWidget = this;
k_menu._k_relatedColumnId = k_columnId;
return k_menu;
},

_k_onBeforeShowCheckAllMenu: function () {
var
k_isNotSelection,
k_isNotData,
k_items;
if (this.k_grid.k_isReadOnly() || this.k_grid.k_isDisabled()) {
return false;
}
k_items = this.k_menu.k_items;
k_isNotSelection = !this.k_selectionModel.hasSelection();
k_isNotData = !Boolean(this.k_store.getCount());
k_items.k_checkAll.k_setDisabled(k_isNotData);
k_items.k_uncheckAll.k_setDisabled(k_isNotData);
k_items.k_checkSelected.k_setDisabled(k_isNotSelection || k_isNotData);
k_items.k_uncheckSelected.k_setDisabled(k_isNotSelection || k_isNotData);
},

_k_checkRecordsByMenu: function (k_menu, k_menuItem) {
var
k_menuItemName = k_menuItem.k_name,
k_grid = k_menu.k_relatedWidget,
k_processSelectedOnly,
k_check;
k_processSelectedOnly = 'k_checkAll' !== k_menuItemName && 'k_uncheckAll' !== k_menuItemName;
k_check = 'k_checkAll' === k_menuItemName || 'k_checkSelected' === k_menuItemName;
k_grid._k_checkRecords(k_menu._k_relatedColumnId, k_processSelectedOnly, k_check);
if (k_grid._k_hasGroupingCheckbox) {
if (k_processSelectedOnly) {
k_grid.k_updateAllGroupingCheckboxes(true);
}
else {
k_grid._k_checkAllGroupingCheckboxes(k_check);
}
}
},

_k_checkRecords: function (k_columnId, k_processSelectedOnly, k_check, k_groupId, k_isSecondLvlGroup) {
var
k_grid = this,
k_extGrid = k_grid.k_extWidget,
k_columnModel = k_extGrid.colModel,
k_columnIndex = k_columnModel.findColumnIndex(k_columnId),
k_column = k_columnModel.getColumnAt(k_columnIndex),
k_dataIndex = k_column._kx.k_editColumnId,
k_store = k_extGrid.getStore(),
k_extView = k_extGrid.getView(),
k_data = [],
k_subgroupIds = [],
k_filterGroupId = undefined !== k_groupId,
k_groupBy,
k_extEditInfo,
k_origRecords,
k_records,
k_record,
k_subGroupId,
k_i, k_cnt;
k_grid._k_isGroupCbxChangeInProgress = true;
if (k_processSelectedOnly && !k_filterGroupId) {
k_records = k_extGrid.getSelectionModel().getSelections();
}
else {
k_records = k_store.getRange();
}
if (k_extView.k_beginUpdate) {
k_extView.k_beginUpdate();
}
if (k_filterGroupId) {
k_groupBy = k_isSecondLvlGroup ? k_grid._k_secondLevelGrouping.k_columnId : k_grid._k_groupBy;
k_origRecords = k_records;
k_records = [];
for (k_i = 0, k_cnt = k_origRecords.length; k_i < k_cnt; k_i++) {
k_record = k_origRecords[k_i];
if (k_groupId === k_record.get(k_groupBy)) {
k_records.push(k_record);
}
}
}
for (k_i = 0, k_cnt = k_records.length; k_i < k_cnt; k_i++) {
k_record = k_records[k_i];
k_extEditInfo = {
grid  : k_extGrid,
record: k_record,
field : k_dataIndex,
value : k_record.get(k_dataIndex),
newValue: k_check,
row   : k_store.indexOf(k_record),
column: k_columnIndex
};
k_data[k_data.length] = k_record.data;
k_column._k_editorColumnPlugin._k_updateCheckColumnValue(k_extEditInfo);
if (k_grid._k_isDoubleGrouping) {
k_subGroupId = k_record.get(k_grid._k_secondLevelGrouping.k_columnId);
if (!k_isSecondLvlGroup && k_subGroupId && !k_subgroupIds[k_subGroupId]) {
k_subgroupIds.push(k_subGroupId);
}
}
}
if (k_extView.k_beginUpdate) {
k_extView.k_endUpdate();
}
k_grid._k_isGroupCbxChangeInProgress = false;
if (k_isSecondLvlGroup && k_records.length) {
this._k_updateGroupingCheckboxOfOneGroup(this, k_records[0].data[k_grid._k_groupBy]);
}
else if (k_grid._k_isDoubleGrouping) {
for (k_i = 0, k_cnt = k_subgroupIds.length; k_i < k_cnt; k_i++) {
this._k_updateGroupingCheckboxOfOneGroup(this, k_subgroupIds[k_i], true);
}
}
if (k_column._kx.k_onGroupCheck) {
k_column._kx.k_onGroupCheck.call(k_grid, k_grid, k_data, k_check);
}
},

k_isGroupCbxChangeInProgress: function () {
return true === this._k_isGroupCbxChangeInProgress;
}
}); 
Ext.grid.GridView.prototype.onHeaderClick = function(k_grid, k_index) {
var
k_direction,
k_sortInfo,
k_columnId;
if (this.grid._kx && this.grid._kx.k_owner._k_isMouseInHeaderResizeArea(Ext.EventObject)) {
return;
}
if(this.headersDisabled || !this.cm.isSortable(k_index)) {
return;
}
k_sortInfo = k_grid.store.sortInfo;
k_columnId = this.cm.getDataIndex(k_index);
if (k_sortInfo && k_sortInfo.field !== k_columnId) {
k_direction = k_sortInfo.direction;
}
k_grid.stopEditing(true);
k_grid.store.sort(k_columnId, k_direction);
};

Ext.grid.GridView.prototype.handleHdMove = function(e, t){
var hd = this.findHeaderCell(this.activeHdRef);
if(hd && !this.headersDisabled){
var hw = this.splitHandleWidth || 5,
r = this.activeHdRegion,
x = e.getPageX(),
ss = hd.style,
cur = '';
if(this.grid.enableColumnResize !== false){
if(x - r.left <= hw && this.cm.isResizable(this.activeHdIndex-1)){
cur = Ext.isAir ? 'move' : Ext.isWebKit ? 'e-resize' : 'col-resize'; }else if(r.right - x <= (!this.activeHdBtn ? hw : parseInt(Ext.fly(hd).child('.x-grid3-hd-btn').getStyle('right'), 10) || 2) && this.cm.isResizable(this.activeHdIndex)){
cur = Ext.isAir ? 'move' : Ext.isWebKit ? 'w-resize' : 'col-resize';
}
}
ss.cursor = cur;
}
};


kerio.lib.K_Dialog = function(k_id, k_config) {
this._k_setStoredProperties([
'k_content',
'k_buttons',
'k_hasHelpIcon',
'k_buttonUpdate',
'k_maskOnAction',
'k_defaultItem',
'k_isFixedCenter'
]);
this._k_masksCfg = {};
this._k_actionTimeout = null;
this.k_maskOnAction = k_config.k_maskOnAction;
this._k_ajaxRequestStack = [];
kerio.lib.K_Dialog.superclass.constructor.call(this, k_id, k_config);
this._k_focusManager = new kerio.lib.K_FocusManager(this); };
Ext.extend(kerio.lib.K_Dialog, kerio.lib._K_FocusableContainer,
{


















_k_minSpace: 4,

_k_propertiesDefault: {
modal: true,          resizable: true,      shadow: kerio.lib.k_isMSIE8 ? false : true, layout: 'fit',		  closeAction: 'hide',   plain: true,
border: true,
cls: 'dialog %+',
buttonAlign: 'left',  footerCssClass: 'dialogButtonsContainer' },

_k_propertiesMapping: {
k_height: 'height',
k_width: 'width',
k_minHeight: 'minHeight',
k_minWidth: 'minWidth',
k_isModal: 'modal',
k_isResizable: 'resizable',
k_hasShadow: 'shadow',
k_title: 'title',
k_className: 'cls',
k_onResize: {k_extName: 'resize', k_listener: 'this._k_onResize', k_scope: 'this'}
},

_k_prepareConfig: function(k_config) {
k_config.k_minWidth = undefined !== k_config.k_minWidth ? k_config.k_minWidth : k_config.k_width;
k_config.k_minHeight = undefined !== k_config.k_minHeight ? k_config.k_minHeight : k_config.k_height;
return k_config;
},

_k_fixDialogSizeAndPos: function (k_viewportSize, k_beforeShow) {
var
k_extWidget = this.k_extWidget,
k_dialogSize = k_extWidget.getSize(),
k_lastSize,
k_isSizeChanged,
k_newWidth,
k_newHeight,
k_newMinWidth,
k_newMinHeight;
if (k_beforeShow) {
k_newWidth = k_dialogSize.width;
k_newHeight = k_dialogSize.height;
if (k_dialogSize.width > k_viewportSize.width) {
k_newWidth = k_viewportSize.width - this._k_minSpace;
}
if (k_dialogSize.height > k_viewportSize.height) {
k_newHeight = k_viewportSize.height - this._k_minSpace;
}
}
else {
k_lastSize = this._k_lastSize || {
width: k_extWidget.initialConfig.width,
height: k_extWidget.initialConfig.height
};
k_newWidth = Math.min(k_viewportSize.width - this._k_minSpace, Math.max(k_dialogSize.width, k_lastSize.width));
k_newHeight = Math.min(k_viewportSize.height - this._k_minSpace, Math.max(k_dialogSize.height, k_lastSize.height));
}
k_isSizeChanged = k_newWidth !== k_dialogSize.width || k_newHeight !== k_dialogSize.height;
k_newMinWidth = Math.min(k_newWidth, k_extWidget.initialConfig.minWidth);
k_newMinHeight = Math.min(k_newHeight, k_extWidget.initialConfig.minHeight);
if (k_isSizeChanged) {
Ext.apply(k_extWidget, {
minWidth: k_newMinWidth,
minHeight: k_newMinHeight
});
k_extWidget.setSize({
width: k_newWidth,
height: k_newHeight
});
}
if (k_isSizeChanged || false !== this._k_storedConfig.k_isFixedCenter) {
k_extWidget.center();
}
},

_k_beforeInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
kerio.lib.K_Dialog.superclass._k_beforeInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
this._k_defaultItemId = k_storedConfig.k_defaultItem;
if (k_storedConfig.k_content) {
this._k_initContent(k_storedConfig.k_content);
}
if (k_storedConfig.k_buttons) {
this._k_createToolbar(k_storedConfig.k_buttons);
}
if (false !== k_storedConfig.k_hasHelpIcon && kerio.lib._k_helpHandler) {
this._k_initHelpIcon();
}
this._k_removeStoredProperties([
'k_defaultItem',
'k_maskOnAction',
'k_buttons',
'k_buttonUpdate',
'k_hasHelpIcon'
]);
},

_k_initHelpIcon: function () {
Ext.apply(this._k_adaptedConfig, {
tools: [{
id: 'help',
handler: kerio.lib._k_helpHandler,
scope: this
}]
});
},

_k_initContent: function (k_content) {
var k_extWidgetConfig = this._k_adaptedConfig;
k_content._k_setParentWidget(this);
this.k_addFocusableItem(k_content);
k_extWidgetConfig.items = k_content.k_extCover || k_content.k_extWidget;
if (k_content.k_isInstanceOf(['K_TabPage', 'K_Layout'])){
k_extWidgetConfig.border = false;
if (k_content.k_isInstanceOf('K_TabPage')) {
k_extWidgetConfig.cls = kerio.lib._k_addClassName(k_extWidgetConfig.cls, 'dialogWithTabs');
}
}
},

_k_createToolbar: function (k_buttons) {
var
k_extWidgetConfig = this._k_adaptedConfig,
k_addFillToMoveButtons = -1 === k_buttons.indexOf('->'),
k_i, k_cnt,
k_buttonCfg,
k_buttonId,
k_defaultButtonId,
k_toolbarCfg,
k_toolbar;
for (k_i = 0, k_cnt = k_buttons.length; k_i < k_cnt; k_i++) {
k_buttonCfg = k_buttons[k_i];
k_buttonId = k_buttonCfg.k_id;
if (k_buttonCfg.k_isDefault) {
if (!k_buttonId) {
k_buttonId = kerio.lib.k_getGeneratedId();
k_buttonCfg.k_id = k_buttonId;
}
k_defaultButtonId = k_buttonId;
if (undefined === k_buttonCfg.k_validateBeforeClick) {
k_buttonCfg.k_validateBeforeClick = kerio.lib.k_constants.k_DEFAULT_VALIDATION_STATUS; }
}
if (k_buttonCfg.k_isCancel && !k_buttonCfg.k_onClick) {
k_buttonCfg.k_onClick = this._k_onCancelButtonClick;
}
if (undefined !== k_buttonCfg.k_mask) {
if (!k_buttonId) {
k_buttonId = kerio.lib.k_getGeneratedId();
k_buttonCfg.k_id = k_buttonId;
}
this._k_masksCfg[k_buttonId] = k_buttonCfg.k_mask;
if (!this.k_maskOnAction) {
this._k_masksCfg[k_buttonId].k_onButtonClick = k_buttonCfg.k_onClick;
k_buttonCfg.k_onClick = this._k_onButtonWithMaskClick.createDelegate(this);
}
}
}
if (k_addFillToMoveButtons) {
k_buttons.splice(0, 0, '->');
}
if (!k_defaultButtonId) {
if (!k_defaultButtonId) {
k_buttonCfg = k_buttons.pop();
k_buttonCfg.k_isDefault = true;
if (!k_buttonCfg.k_id) {
k_buttonCfg.k_id = kerio.lib.k_getGeneratedId();
}
k_defaultButtonId = k_buttonCfg.k_id;
k_buttons.push(k_buttonCfg);
}
}
k_toolbarCfg = {
k_items: k_buttons
};
if (this._k_storedConfig.k_buttonUpdate) {
k_toolbarCfg.k_update = this._k_storedConfig.k_buttonUpdate;
}
k_toolbar = new kerio.lib.K_Toolbar(this.k_id + '_' + 'k_tb', k_toolbarCfg);
this._k_defaultButton = k_toolbar.k_items[k_defaultButtonId];
k_toolbar.k_dialog = this;
k_extWidgetConfig.fbar = k_toolbar.k_extWidget;
this.k_toolbar = k_toolbar;
this.k_addFocusableItem(k_toolbar);
k_toolbar.k_extWidget.on('beforerender', function (k_extToolbar) {
k_extToolbar.toolbarCls += ' x-toolbar';
k_extToolbar.enableOverflow = true;
}, k_toolbar);
k_toolbar._k_setParentWidget(this);
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var	k_extWidget;
k_adaptedConfig.id = this.k_id; k_extWidget = new Ext.Window(k_adaptedConfig);
return k_extWidget;
},

_k_afterInitExtComponent: function (k_adaptedConfig, k_storedConfig) {
var k_extWidget = this.k_extWidget;
k_extWidget.on('beforeshow', this._k_initDialogSize, this, {single: true});
k_extWidget.on({
'render':     this._k_doAfterRender,
'hide':       this._k_onHide,
'beforeshow': this._k_onBeforeShow,
scope: this
});
},

_k_onBeforeShow: function () {
kerio.lib.k_uiCacheManager.k_recoverDOM.call(this.k_extWidget);
this._k_fixDialogSizeAndPos(Ext.getBody().getSize(), true);
},

_k_doAfterRender: function () {
this._k_initKeyMap();
},

_k_onCancelButtonClick: function(k_toolbar) {
k_toolbar.k_dialog.k_hide.call(k_toolbar.k_dialog);
},

_k_initDialogSize: function (k_extDialog) {
var k_initConfig = k_extDialog.initialConfig,
k_width = (undefined !== this._k_width) ? this._k_width : k_initConfig.width,
k_height = (undefined !== this._k_height) ? this._k_height : k_initConfig.height;
k_extDialog.setSize(k_width, k_height);
},

k_show: function() {
this.k_extWidget.show();
},

k_hide: function() {
if (Ext.isGecko && !Ext.isWindows) {  this.k_extWidget.focusEl.focus();
}
this.k_extWidget.hide();
},

_k_onHide: function() {
var
k_activeItem = this._k_focusManager._k_getCurrentItem(),
k_activeItemEl = k_activeItem && k_activeItem.getEl(),
k_event;
kerio.lib.k_ajax.k_abortAllPendingRequests(this);
kerio.lib.k_saveSettings({
k_widget: this
});
if (this.k_resetOnClose) {
if (kerio.lib.k_isFirefox2) {
this.k_resetOnClose.defer(1, this);
}
else {
this.k_resetOnClose();
}
}
if (k_activeItemEl) {
if (kerio.lib.k_isMSIE) {
k_event = document.createEventObject();
k_activeItemEl.dom.fireEvent('onblur', k_event);
}
else {
k_activeItemEl.blur();
}
}
this._k_lastSize = this.k_extWidget.getSize();
this.k_setChanged(false);
this.k_hideMask();
kerio.lib._k_unmaskNestedWidgets(this);
kerio.lib.k_uiCacheManager.k_releaseDOM.call(this.k_extWidget);
},	
k_showButton: function(k_id, k_show) {
if (!this.k_toolbar) {
return;
}
this.k_toolbar.k_showItem(k_id, k_show);
},

k_setTitle: function(k_text) {
this.k_extWidget.setTitle(k_text);
},

_k_initKeyMap: function () {
var k_extWidgetEl = this.k_extWidget.getEl();
this._k_keyNav = new Ext.KeyNav(k_extWidgetEl, {
enter: this._k_onEnterAction,
defaultEventAction: 'doNothingWithEvent',
scope: this,
forceKeyDown: true
});
},

_k_onEnterAction: function (k_e) {
var
k_defaultButton = this._k_defaultButton,
k_dialogButtons,
k_button,
k_buttonId,
k_activeItem;
if (!k_e.hasModifier()) {
if (!k_defaultButton) {
k_dialogButtons = this.k_toolbar.k_items;
for (k_buttonId in k_dialogButtons) {
k_button = k_dialogButtons[k_buttonId];
if ('function' !== typeof k_button) {
if (k_button._k_storedConfig.k_isDefault) {
k_defaultButton = k_button;
break;
}
}
}
this._k_defaultButton = k_defaultButton;
}
if (k_defaultButton && k_defaultButton._k_action._k_storedConfig.k_onClick) {
k_activeItem = this._k_focusManager._k_getCurrentItem();
if (k_activeItem &&
((k_activeItem instanceof Ext.Button) ||
(k_activeItem instanceof Ext.form.TextArea) ||
(k_activeItem.hasClass && k_activeItem.hasClass('x-grid3-focus')))) {
return;
}
if (!k_defaultButton.k_isDisabled() && !k_defaultButton.k_isReadOnly() && k_defaultButton.k_isVisible()) {
k_e.stopEvent();
k_defaultButton.k_extWidget.focus();
if (kerio.lib.k_isMSIE || kerio.lib.k_isMSIE11) {
k_defaultButton._k_action._k_onClick.defer(10, k_defaultButton._k_action, [k_defaultButton.k_extWidget, k_e]);
}
else {
k_defaultButton._k_action._k_onClick(k_defaultButton.k_extWidget, k_e);
}
}
}
}
},

k_setDefaultButton: function(k_buttonId) {
var
k_defaultButtonClassName = 'defaultButton',
k_toolbarItems = this.k_toolbar.k_items,
k_defaultButton;
k_defaultButton = this._k_defaultButton;
k_defaultButton.k_extWidget.removeClass(k_defaultButtonClassName);
k_defaultButton = k_toolbarItems[k_buttonId];
k_defaultButton.k_extWidget.addClass(k_defaultButtonClassName);
this._k_defaultButton = k_defaultButton;
},

k_mask: function(k_mask, k_message, k_delay) {
if (true === k_mask) {
this.k_showMask(k_message, k_delay);
}
else {
this.k_hideMask();
}
},

k_showMask: function (k_message, k_delay) {
if (!this.k_extWidget.rendered) {
return;
}
var k_maskCfg = {
k_message: k_message || this._k_maskCfgDefaults.k_message,
k_delay: k_delay
};
kerio.lib.k_unmaskWidget(this);
kerio.lib.k_maskWidget(this, k_maskCfg);
},

k_hideMask: function() {
kerio.lib.k_unmaskWidget(this);
},

k_showLoading: function (k_message, k_show) {
var
k_headerEl = this.k_extWidget.header,
k_config;
k_config = {
k_owner: this,
k_element: k_headerEl,
k_className: 'loadingHeader',
k_message: k_message,
k_show: k_show
};
kerio.lib._k_showLoading(k_config);
k_headerEl.down('span.x-window-header-text',true).style.visibility = k_show ? 'hidden' : 'visible';
},

_k_onButtonWithMaskClick: function (k_toobar, k_button) {
var k_maskCfg = this._k_masksCfg[k_button._k_action.k_itemId];
this.k_showMask(k_maskCfg.k_message, k_maskCfg.k_delay);
k_maskCfg.k_onButtonClick.apply(k_toobar, arguments);
},

k_setSize: function(k_size) {
var k_extWidget = this.k_extWidget,
k_lib = kerio.lib,
k_extSize = k_lib.k_removeUndefinedProperties( k_lib._k_applyMapping(k_size, this._k_propertiesMapping) );
Ext.apply(k_extWidget, k_extSize);
if (!k_extWidget.boxReady) {
this._k_width = k_size.k_width; this._k_height = k_size.k_height;
return;
}
k_extWidget.setWidth(k_extSize);
},

k_getSize: function() {
var k_extWidget = this.k_extWidget,
k_extSize = k_extWidget.boxReady ? k_extWidget.getSize() : {width: this._k_width, height: this._k_width},
k_size = {
k_width: k_extSize.width,
k_height: k_extSize.height,
k_minWidth: k_extWidget.minWidth,
k_minHeight: k_extWidget.minHeight
};
return kerio.lib.k_removeUndefinedProperties(k_size);
},

_k_onResize: function(k_extWidget, k_width, k_height) {
this._k_mappedListeners.k_onResize.call(this, this, k_width, k_height);
},

k_isChanged: function () {
var k_scope;
if (this._k_isChangedSet) {
return true;
}
k_scope = {
k_dialog: this,
k_isChanged: false
};
this.k_extWidget.cascade(this._k_checkChangeInItems, k_scope);
return k_scope.k_isChanged;
},

_k_checkChangeInItems: function(k_component){
var k_isChanged;
k_component = k_component._kx && k_component._kx.k_owner;
if (!k_component || k_component === this.k_dialog) { return;
}
if (Ext.isFunction(k_component.k_isChanged)) {
if (k_component instanceof kerio.lib.K_Grid) {
k_isChanged = (k_component._k_dataStore && k_component._k_dataStore._k_isTracing) ? k_component.k_isChanged() : false;
}
else {
k_isChanged = k_component.k_isChanged();
}
if (k_isChanged) {
this.k_isChanged = k_isChanged;
this.k_component = k_component;
return false;
}
}
},

k_setChanged: function (k_changed) {
this._k_isChangedSet = false !== k_changed;
},

k_remoteDataCreated: function(k_response) {
var
k_id;
if (this.k_relatedGrid) {
k_id = kerio.lib.k_ajax.k_getCreatedItemId(k_response);
this.k_relatedGrid.k_initStatus({k_type: this.k_relatedGrid._k_STATUS_TYPE.k_SELECTED_ROW, k_id: k_id});
}
}
}); 
Ext.Window.prototype._k_mousedownOnMask = function() {
var k_dialog;
if (!Ext.isIE) {
Ext.EventObject.preventDefault();
}
else {
k_dialog = kerio.lib._k_windowManager.k_getActiveWindow();
if (k_dialog) {
k_dialog._k_focusManager._k_focusCurrentItem();
}
}
};
Ext.Window.prototype.onRender = Ext.Window.prototype.onRender.createSequence(function(){
var
k_mask = this.mask,
k_focusManager;
if (k_mask) {
k_mask.addClass('modalMask');
k_mask.on('mousedown', this._k_mousedownOnMask);
}
if (this._kx) {
k_focusManager = this._kx.k_owner._k_focusManager;
this.getEl().on('mousedown', k_focusManager._k_controlFocus, k_focusManager);
}
});

Ext.Window.prototype.hide = Ext.Window.prototype.hide.createSequence(function () {
if (this.mask && this.mask.dom) { this.mask.addClass('disableClickMask');
this.mask.show();
}
});
Ext.Window.prototype.afterHide = Ext.Window.prototype.afterHide.createSequence(function () {
this._k_deferredUnmaskingId = this._k_removeDisableClickMask.defer(10, this);
});
Ext.Window.prototype._k_removeDisableClickMask = function () {
if (this.mask && this.mask.dom) {
this.mask.removeClass('disableClickMask');
this.mask.hide();
}
};

Ext.Window.prototype.show = Ext.Window.prototype.show.createSequence(function () {
if (this._k_deferredUnmaskingId) {
clearTimeout(this._k_deferredUnmaskingId);
delete this._k_deferredUnmaskingId;
if (this.mask && this.mask.dom) {
this.mask.removeClass('disableClickMask');
}
}
});


kerio.lib._K_FormItem = function(k_id, k_config) {
var k_extWidget;
this._k_setStoredProperties(['k_onFocus', 'k_onChange']);
k_config.k_name = k_config.k_id;
k_config.k_id = k_id;
this.k_name = k_config.k_name;
kerio.lib._K_FormItem.superclass.constructor.call(this, k_id, k_config);
k_extWidget = this.k_extWidget;
this._k_updatePrevValue();
this.k_setInitialValue(this._k_prevValue);
if (true === k_config.k_isAutoLabelWidth) {
this._k_isAutoLabelWidth = true;
k_extWidget.on('render', this._k_adjustAutoLabelWidth, this);
}
if (undefined !== k_config.k_indent) {
this._k_indent = k_config.k_indent;
this.k_indent(k_config.k_indent);
}

this._k_isLabelHidden = (true === k_config.k_isLabelHidden);
if (Ext.isIE) {
this.k_extWidget.on('render', function (k_extFormItem) {
var
k_formElement = Ext.get(k_extFormItem.getEl().findParent('.x-form-element')),
k_ownerCt = k_extFormItem.ownerCt;
if (k_formElement && (k_ownerCt.hideLabels || this._k_isLabelHidden)) {
k_formElement.setStyle({position: 'static'});
}
}, this);
}
};
Ext.extend(kerio.lib._K_FormItem, kerio.lib._K_BaseWidget,
{














_k_originalValue: null,

_k_hasImpactOnContainer: true,

_k_isHtmlReadOnly: true,
_k_isVisibleByContainer: true,
_k_isDisabledByContainer: false,
_k_isReadOnlyByContainer: false,

_k_propertiesMapping: {
k_id: 'id',
k_name: 'name',
k_caption: 'fieldLabel',
k_value: 'value',
k_style: 'style',
k_isDisabled: 'disabled',
k_isHidden: 'hidden',
k_isReadOnly: 'readOnly',
k_width: 'width',
k_anchor: 'anchor',
k_className: 'cls',
k_itemClassName: 'itemCls',
k_isLabelHidden: 'hideLabel',
k_onFocus: {k_extName: 'focus', k_listener: 'this._k_onFocus', k_scope: 'this'},
k_onBlur: {k_extName: 'blur', k_listener: 'this._k_onBlur', k_scope: 'this'}
},

_k_runtimePropertiesMapping: {
k_maxValue:  {k_object: 'this.k_extWidget', k_propertyName: 'maxValue'},
k_minValue:  {k_object: 'this.k_extWidget', k_propertyName: 'minValue'},
k_maxLength: {k_object: 'this'            , k_function: 'k_setMaxLength'}
},

_k_propertiesDefault: {
selectOnFocus: true
},

_k_readOnlyClassName: 'readonly',

_k_prevValue: null,

_k_initExtComponent: Ext.emptyFn,

_k_doAfterRender: Ext.emptyFn,

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = this.k_extWidget;
k_extWidget.on('render', this._k_doAfterRender, this);
if (k_extWidget.selectOnFocus) {
this._k_initEventsForSelectOnFocus();
}
},

_k_onChangeHandler: function (k_extWidget) {
var k_form;
if (!this._k_isValueChanged()) {
return;
}
k_form = this.k_parent || null;
if (k_form && (true === k_form._k_isOnChangeHandler || true === k_form._k_isFormManagerOnChangeHandler)) {
k_form._k_onChangeHandler.call(k_form, k_form, this);
}
this._k_callUserDefinedOnChangeHandler();
this._k_updatePrevValue();
},

_k_callUserDefinedOnChangeHandler: function() {
var k_storedCofig = this._k_storedConfig || {};
if (k_storedCofig.k_onChange) {
k_storedCofig.k_onChange.call(this, this.k_parent || null, this, this.k_getValue());
}
},

_k_updatePrevValue: function () {
this._k_prevValue = this.k_getValue();
},

_k_isValueChanged: function () {
return (this._k_prevValue !== this.k_getValue());
},

k_isDisabled: function() {
return (this._k_isDisabledByContainer || this._k_isDisabled);
},

k_isDisabledByContainer: function () {
return this._k_isDisabledByContainer;
},

k_setDisabled: function(k_disable) {
var
k_origState,
k_newState;
k_disable = false !== k_disable;
k_origState = this.k_isDisabled();
k_newState = (k_disable || this._k_isDisabledByContainer);
this._k_isDisabled = k_disable;
if (k_origState !== k_newState) {
this._k_setDisabledItem(k_newState);
}
},

_k_setDisabledByContainer: function (k_disable) {
var
k_origState,
k_newState;
k_origState = this.k_isDisabled();
k_newState = (k_disable || this._k_isDisabled);
this._k_isDisabledByContainer = k_disable;
if (k_origState !== k_newState) {
this._k_setDisabledItem(k_newState);
}
},

_k_setDisabledItem: function (k_disable) {
var k_extWidget = this.k_extWidget;
if (true === this._k_isHtmlReadOnly) {
k_extWidget.setDisabled(k_disable);
}
else {
if (this.k_isReadOnly()) {
k_extWidget.setDisabled(true);
}
else {
k_extWidget.setDisabled(k_disable);
}
}
this._k_setDisabledDeferred(k_disable);
},

_k_setDisabledDeferred: function (k_disable) {
var
k_extWidget = this.k_extWidget,
k_disabledClass = k_extWidget.disabledClass,
k_extElement,
k_label;
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
k_extElement = this._k_hasImpactOnContainer ? k_extWidget.container : k_extWidget.el;
k_label = Ext.get(k_extWidget.container.dom.previousSibling);
if (k_label && k_label.dom.htmlFor == k_extWidget.id) {
k_label[k_disable ? 'addClass' : 'removeClass'](k_disabledClass);
}
k_extElement[k_disable ? 'addClass' : 'removeClass'](k_disabledClass);
if (k_disable) {
k_extWidget.el.removeClass('x-form-focus', 'focusedItem');
}
},

k_isVisible: function() {
return (this._k_isVisibleByContainer && this._k_isVisible);
},

k_isVisibleByContainer: function() {
return this._k_isVisibleByContainer;
},

k_setVisible: function(k_visible) {
var	k_origVisible;
k_visible = false !== k_visible;
k_origVisible = this._k_isVisible;
this._k_isVisible = k_visible;
if (k_origVisible !== k_visible) {
this.k_extWidget.setVisible(k_visible);
this._k_setVisibleDeferred(k_visible);
}
},

_k_setVisibleDeferred: function (k_visible) {
var
k_extWidget = this.k_extWidget,
k_elementParent,
k_extElement;
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
if (this._k_isInToolbar) {
k_extElement = k_extWidget.el;
k_elementParent = Ext.fly(k_extElement.findParent('td'));
k_elementParent.setDisplayed(k_visible);
if (k_extWidget.fieldLabel) {
k_extElement = k_elementParent.prev('td');
k_extElement.setDisplayed(k_visible);
}
}
else {
k_extElement = this._k_hasImpactOnContainer ? k_extWidget.el.parent('.x-form-item') : k_extWidget.el;
if(k_extElement) {
k_extElement[k_visible ? 'removeClass' : 'addClass']('x-hide-display');
}
}
},

k_isReadOnly: function() {
return (this._k_isReadOnlyByContainer || this._k_isReadOnly);
},

k_isReadOnlyByContainer: function () {
return this._k_isReadOnlyByContainer;
},

k_setReadOnly: function(k_readOnly) {
var
k_origState,
k_newState;
k_readOnly = false !== k_readOnly;
k_origState = this.k_isReadOnly();
k_newState = k_readOnly || this._k_isReadOnlyByContainer;
this._k_isReadOnly = k_readOnly;
if (k_origState !== k_newState) {
this._k_setReadOnlyItem(k_newState);
}
},

k_forceSetWritable: function () {
if (this.k_isReadOnly()) {
this._k_isReadOnly = false;
this._k_isReadOnlyByContainer = false;
this._k_setReadOnlyItem(false);
}
},

_k_setReadOnlyByContainer: function (k_readOnly) {
var
k_origState,
k_newState;
k_origState = this.k_isReadOnly();
k_newState = k_readOnly || this._k_isReadOnly;
this._k_isReadOnlyByContainer = k_readOnly;
if (k_origState !== k_newState) {
this._k_setReadOnlyItem(k_newState);
}
},

_k_setReadOnlyItem: function (k_readOnly) {
var k_extWidget = this.k_extWidget;
if ((false === this._k_isHtmlReadOnly) && !this.k_isDisabled()) { k_extWidget.setDisabled(k_readOnly);
}
if ('function' === Ext.type(k_extWidget.setReadOnly)) {
k_extWidget.setReadOnly(k_readOnly);
}
k_extWidget.fireEvent('readonly', k_extWidget);
this._k_setReadOnlyDeferred(k_readOnly);
},

_k_setReadOnlyDeferred: function (k_readOnly) {
var k_extWidget = this.k_extWidget,
k_extElement,
k_dom;
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
k_dom = k_extWidget.getEl().dom;
if (k_readOnly) {
this._k_qTipMessage = k_dom.qtip;
k_dom.qtip = '';
}
else if (undefined !== this._k_qTipMessage) {
k_dom.qtip = this._k_qTipMessage;
delete this._k_qTipMessage;
}
k_extElement = this._k_hasImpactOnContainer ? k_extWidget.container : k_extWidget.el;
k_extWidget.readOnly = k_readOnly;
k_dom.readOnly = k_readOnly;
if (k_readOnly) {
k_extElement.removeClass(['x-form-focus', 'focusedItem']);
k_extElement.addClass('readonly');
}
else {
k_extElement.removeClass('readonly');
}
},

_k_getIndentEl: function () {
return this.k_extWidget.getEl().up('.x-form-item');
},

k_indent: function(k_indentSize) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_formItemEl = this._k_getIndentEl();
if (k_formItemEl) {
k_formItemEl.setStyle('margin-left', (k_indentSize * kerio.lib.k_constants.k_FORM_INDENT) + 'px');
}
},

k_focus: function() {
var k_focusManager;
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
k_focusManager = this.k_getTopLevelParent()._k_focusManager;
if (k_focusManager) {
k_focusManager._k_setFocusedItemIndex(k_focusManager._k_getItemIndex(this.k_extWidget));
k_focusManager._k_focusCurrentItem();
}
else {
this.k_extWidget.focus();
}
},

k_getInitialValue: function (k_configValue) {
var k_value;
if (true === k_configValue) {
k_value = this.k_extWidget.initialConfig.value;
}
else {
k_value = this._k_originalValue;
}
return k_value;
},

k_reset: function () {
this.k_setValue(this.k_getInitialValue(true), true);
},

_k_onFocus: function(k_extItem) {
this._k_mappedListeners.k_onFocus.call(this, this.k_parent || null, this);
},

_k_onBlur: function(k_extItem) {
this._k_mappedListeners.k_onBlur.call(this, this.k_parent || null, this);
},

_k_setVisibleByParent: function (k_visible) {
k_visible = (undefined === k_visible) ? true : k_visible;
this._k_isVisibleByContainer = k_visible;
},

_k_adjustAutoLabelWidth: function (k_extFormItem) {
var
k_itemEl = Ext.get(k_extFormItem.getEl().findParent('.x-form-item')),
k_elementEl = Ext.get(k_extFormItem.getEl().findParent('.x-form-element')),
k_labelWidth = 0,
k_origLabelWidth,
k_ownerCt,
k_labelEl;
if (k_itemEl) {
k_labelEl = k_itemEl.child('.x-form-item-label');
}
if (!k_labelEl) {
return;
}
k_labelWidth = Ext.util.TextMetrics.measure(k_labelEl.id, k_extFormItem.fieldLabel).width;
k_origLabelWidth = k_labelEl.getWidth();
k_labelEl.setStyle({width: k_labelWidth + 'px'});
k_elementEl.setStyle({paddingLeft: (k_labelWidth + 5) + 'px'});
this._k_labelWidth = k_labelWidth;
k_ownerCt = k_extFormItem.ownerCt;
if (k_ownerCt && k_ownerCt.ownerCt) {
if (k_ownerCt.ownerCt.layout instanceof Ext.layout.ColumnLayout) { k_ownerCt.setWidth(k_ownerCt.getWidth() + k_labelWidth - k_origLabelWidth + 3);
k_ownerCt.ownerCt.doLayout();
}
}
},

k_addClassName: function (k_className) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_extWidget = this.k_extWidget,
k_el = k_extWidget.wrap || k_extWidget.el;
if (k_el) {
k_el.addClass(k_className);
}
},

k_removeClassName: function (k_className) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_extWidget = this.k_extWidget,
k_el = k_extWidget.wrap || k_extWidget.el;
if (k_el) {
k_el.removeClass(k_className);
}
},

k_addItemClassName: function (k_className) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_itemEl = this.k_extWidget.getEl().parent('.x-form-item');
if (k_itemEl) {
k_itemEl.addClass(k_className);
}
},

k_removeItemClassName: function (k_className) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_itemEl = this.k_extWidget.getEl().parent('.x-form-item');
if (k_itemEl) {
k_itemEl.removeClass(k_className);
}
},

k_getValue: function () {
return this.k_extWidget.getValue();
},

k_setMaxLength: function (k_maxLength) {
this._k_maxLength = k_maxLength;
this.k_extWidget.maxLength = k_maxLength;
},

k_setProperties: function (k_definitions) {
var
k_runtimePropertiesMapping = this._k_runtimePropertiesMapping,
k_lib = kerio.lib,
k_newValue,
k_mapping,
k_object,
k_propertyName;
for (k_propertyName in k_definitions) {
k_newValue = k_definitions[k_propertyName];
k_mapping = k_runtimePropertiesMapping[k_propertyName];
k_object = k_lib._k_getPointerToObject.call(this, k_mapping.k_object);
if (k_mapping.k_propertyName) {
k_object[k_mapping.k_propertyName] = k_newValue;
}
else if (k_mapping.k_function) {
k_object[k_mapping.k_function].apply(k_object, [k_newValue]);
}
}
},

k_isDirty: function() {
return this._k_originalValue != this.k_getValue();
},

k_setValue: function (k_value, k_isInitial) {
var k_extWidget = this.k_extWidget;
k_extWidget.setValue(k_value);
if (true === k_isInitial) {
this.k_setInitialValue(k_value);
}
this._k_onChangeHandler(k_extWidget);
},

k_setInitialValue: function (k_value) {
this._k_originalValue = k_value;
},

k_syncSizeWith: function(k_widget, k_side) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
if (!k_widget.k_extWidget.rendered) {
return;
}
var
k_setWidth = 'h' !== k_side,
k_setHeight = 'w' !== k_side,
k_extWidget = this.k_extWidget,
k_element = k_extWidget.el,
k_targetSize;
if (k_widget.k_isVisible()) {
k_targetSize = k_widget.k_extWidget.el.getSize();
}
else {
k_targetSize = k_widget.k_extWidget.el.getStyles('width', 'height');
}
if (k_setWidth) {
k_element.setWidth(k_targetSize.width);
k_extWidget.minWidth = k_targetSize.width;
}
if (k_setHeight) {
k_element.setHeight(k_targetSize.height);
k_extWidget.minHeight = k_targetSize.height;
}
},

_k_initEventsForSelectOnFocus: function () {
var k_element;
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
k_element = this.k_extWidget.getEl();
k_element.on('mousedown', this._k_onMouseDown, this);
k_element.on('mouseup', this._k_onMouseUp, this);
if (kerio.lib.k_isFirefox) {
k_element.on('blur', function(){
var k_value = this.value;
this.value = '';
this.value = k_value;
}, k_element.dom);
}
},

_k_onMouseDown: function () {
this.k_extWidget.selectOnFocus = false;
},

_k_onMouseUp: function () {
this.k_extWidget.selectOnFocus = true;
}
});


kerio.lib.K_FormContainer = function(k_id, k_config) {
this._k_ownerForm = k_config.k_ownerForm;
this._k_items = {}; this.k_items = {};
this._k_setStoredProperties([
'k_items',
'k_content',
'k_isResizeableVertically',
'k_height',
'k_minHeight',
'k_indent',
'k_caption',
'k_labelWidth',
'k_isLabelHidden'
]);
if (this._k_defaultClassName) {
if (!k_config.k_className) {
k_config.k_className = this._k_defaultClassName;
}
else {
k_config.k_className += ' ' + this._k_defaultClassName;
}
}
kerio.lib.K_FormContainer.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_FormContainer, kerio.lib._K_ToolbarContainer,
{















_k_isVisibleByContainer: true,
_k_isDisabledByContainer: false,
_k_isReadOnlyByContainer: false,
_k_defaultClassName: 'formContainer',
_k_propertiesMapping: {
k_className: 'cls',
k_caption: 'title',
k_isLabelHidden: 'hideLabels',
k_labelWidth: 'labelWidth',
k_height: 'height',
k_width: 'width',
k_columnWidth: 'columnWidth',
k_style: 'style',
k_anchor: 'anchor',
k_labelAlign: 'labelAlign'
},
_k_propertiesDefault: {
layout: 'form',
border: false,
bodyBorder: false,
layoutConfig: {
labelSeparator: ''
},
autoWidth: false,
labelSeparator: '',
anchor: '0'	,
labelWidth: kerio.lib.k_constants.k_DEFAULT_LABEL_WIDTH
},
_k_defaultItemType: 'k_text',

_K_ExtPanelConstructor: Ext.Panel,

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var	k_extWidget;
this._k_labelWidth = k_adaptedConfig.labelWidth;
this._k_applyIndent(k_adaptedConfig, k_storedConfig);
k_adaptedConfig.id = this.k_id;
k_adaptedConfig.items = this._k_getExtItems(k_storedConfig);
k_extWidget = new this._K_ExtPanelConstructor(k_adaptedConfig);
k_extWidget.on('render', this._k_addLastContainerClassName, this);
this._k_isResizeableVertically = (true === k_storedConfig.k_isResizeableVertically);
if (this._k_isResizeableVertically ||
((undefined !== k_storedConfig.k_content)) && (!k_storedConfig.k_height)) {
k_extWidget.on('render', this._k_adjustAnchor, this);
}
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
kerio.lib.K_FormContainer.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
if (k_storedConfig.k_minHeight) {
this.k_extWidget.on('resize', this._k_adjustMinHeight, this);
}
this._k_removeStoredProperties([
'k_items', 'k_content', 'k_isResizeableVertically', 'k_height', 'k_indent',
'k_caption', 'k_labelWidth', 'k_isLabelHidden'
]);
},

_k_addLastContainerClassName: function (k_extPanel) {
var k_extOwner = k_extPanel.ownerCt,
k_ownerItems, k_itemsCount, k_extItem;
if (k_extOwner._kx && k_extOwner._kx._k_isLastContainerClassAdded) {
return;
}
k_ownerItems = k_extOwner.items;
k_itemsCount = k_ownerItems.getCount();
k_extItem = k_ownerItems.itemAt(k_itemsCount - 1);
if (k_extItem._kx && (k_extItem._kx.k_owner instanceof kerio.lib.K_FormContainer)) {
k_extItem.addClass('lastFormItem');
kerio.lib._k_addKerioProperty(k_extOwner, {_k_isLastContainerClassAdded: true});
}
},

_k_applyIndent: function (k_extWidgetCfg, k_config) {
var k_indentStyle = 'padding-left',
k_indent = k_config.k_indent,
k_formIndentConst = kerio.lib.k_constants.k_FORM_INDENT,
k_indentSize;
if (k_indent) {
k_indentSize = (k_indent * k_formIndentConst) + 'px';
if (!k_extWidgetCfg.style) {
k_extWidgetCfg.style = k_indentStyle + ': ' + k_indentSize;
}
else {
k_extWidgetCfg.style += ' ;' + k_indentStyle + ': '  + k_indentSize;
}
}
},

_k_getExtItems: function (k_config) {
var k_itemsConfig = this._k_storedConfig.k_items,
k_content = k_config.k_content,
k_items = [],
k_item,
k_i, k_cnt,
k_itemCfg,
k_ownerForm = this._k_ownerForm,
k_mainForm = true === this._k_isMainForm ? this : k_ownerForm;
if (!k_itemsConfig && !k_content) {
return undefined;
}
if (k_content) {
k_content = k_content.k_extCover || k_content.k_extWidget;
k_content.anchor = '0 0';
k_content.addClass('formContent');
k_mainForm.k_addFocusableItem(k_content);
return k_content;
}
for(k_i=0, k_cnt=k_itemsConfig.length; k_i<k_cnt; k_i++) {
k_itemCfg = k_itemsConfig[k_i];
k_itemCfg.k_ownerForm = k_ownerForm;
k_item = this._k_initFormItem(k_itemCfg).k_extWidget;
k_items.push(k_item);
}
return k_items;
},

_k_initFormItem: function(k_config) {
var K_Constructor,
k_elementId, k_registeredItemId,
k_mainForm = (true === this._k_isMainForm) ? this : this._k_ownerForm,
k_formId = k_mainForm.k_id,
k_itemType = k_config.k_type || this._k_defaultItemType,
k_lib = kerio.lib,
k_item,
k_radioGroup;
if (k_config.k_id) {
k_elementId = k_config.k_id;
}
else {
k_elementId = k_lib.k_getGeneratedId();
}
if (undefined === k_config.k_anchor && ('number' !== typeof k_config.k_width)) {
k_config.k_anchor = '0';
}
else if (false === k_config.k_anchor) {
delete k_config.k_anchor;
}
k_registeredItemId = k_elementId;
if ('k_radio' === k_itemType) {
k_registeredItemId = k_config.k_groupId;
k_elementId = k_registeredItemId + '_' + k_config.k_value;
}
K_Constructor = k_lib._k_getItemConstructor(k_itemType);
if (!k_config.k_labelWidth) {
k_config.k_labelWidth = this._k_labelWidth;
}
k_item = new K_Constructor(k_formId + '_' + k_elementId, k_config);
k_item._k_setParentWidget(this);
if (k_item.k_isInstanceOf('K_Radio') && !k_item.k_isInstanceOf('K_Checkbox')) {
k_radioGroup = k_mainForm.k_items[k_registeredItemId];
if (undefined === k_radioGroup) { k_radioGroup = new k_lib.K_RadioGroup(k_formId + '_' + k_registeredItemId);
this._k_items[k_registeredItemId] = k_radioGroup;
k_mainForm.k_items[k_registeredItemId] = k_radioGroup;
k_mainForm._k_formItems[k_registeredItemId] = k_radioGroup;
k_radioGroup._k_setParentWidget(this);
}
k_radioGroup.k_registerRadio(k_item, k_config);
}
else {
this._k_items[k_registeredItemId] = k_item;
k_mainForm.k_items[k_registeredItemId] = k_item;
if (k_item instanceof kerio.lib._K_FormItem) {
k_mainForm._k_formItems[k_registeredItemId] = k_item;
}
}
k_item.k_form = k_mainForm; k_item.k_parent = k_mainForm; if (false === k_item.k_isInstanceOf(['K_DisplayField', 'K_SimpleText', 'K_TemplateText', 'K_ImageField', 'K_ProgressBar'])) {
if (k_item instanceof k_lib._K_FormItem) {
k_mainForm.k_addFocusableItem(k_item.k_extWidget);
}
}
return k_item;
},

_k_forEachItem: function (k_functionName, k_arguments) {
var k_items = this._k_items,
k_item,
k_itemName,
k_function;
if (!Ext.isArray(k_arguments)) {
k_arguments = [k_arguments];
}
for (k_itemName in k_items) {
k_item = k_items[k_itemName];
if (!k_item || 'function' === Ext.type(k_item)) {
continue;
}
k_function = k_item[k_functionName];
if ('function' === Ext.type(k_function)) {
k_function.apply(k_item, k_arguments);
}
}
},

k_setDisabled: function (k_disable) {
var
k_origState,
k_newState;
kerio.lib.K_FormContainer.superclass.k_setDisabled.call(this, k_disable);
k_disable = (undefined === k_disable) ? true : k_disable;
k_origState = this.k_isDisabled();
k_newState = k_disable || this._k_isDisabledByContainer;
this._k_isDisabled = k_disable;
if (k_origState !== k_newState) {
this._k_forEachItem('_k_setDisabledByContainer', k_newState);
}
},

_k_setDisabledByContainer: function (k_disable) {
var
k_origState,
k_newState;
k_origState = this.k_isDisabled();
k_newState = (k_disable || this._k_isDisabled);
this._k_isDisabledByContainer = k_disable;
if (k_origState !== k_newState) {
this._k_forEachItem('_k_setDisabledByContainer', k_newState);
}
},

k_setReadOnly: function (k_readOnly) {
var
k_origState,
k_newState;
k_readOnly = (undefined === k_readOnly) ? true : k_readOnly;
kerio.lib.K_FormContainer.superclass.k_setReadOnly.call(this, k_readOnly);
k_origState = this.k_isReadOnly();
k_newState = (k_readOnly || this._k_isReadOnlyByContainer);
this._k_isReadOnly = k_readOnly;
if (k_origState !== k_newState) {
this._k_forEachItem('_k_setReadOnlyByContainer', k_newState);
}
},

_k_setReadOnlyByContainer: function (k_readOnly) {
var
k_origState,
k_newState;
k_newState = (k_readOnly || this._k_isReadOnly);
k_origState = this.k_isReadOnly();
this._k_isReadOnlyByContainer = k_readOnly;
if (k_origState !== k_newState) {
this._k_forEachItem('_k_setReadOnlyByContainer', k_newState);
}
},

k_setVisible: function (k_visible) {
var
k_extWidget = this.k_extWidget,
k_origVisible;
kerio.lib.K_FormContainer.superclass.k_setVisible.call(this, k_visible);
k_visible = (undefined === k_visible) ? true : k_visible;
k_origVisible = this._k_isVisible;
this._k_isVisible = k_visible;
if (k_origVisible === k_visible) {
return;
}
if (true === k_visible) {
k_visible = this._k_isVisibleByContainer;
}
k_extWidget.setVisible(this._k_isVisible);
this._k_forEachItem('_k_setVisibleByParent', k_visible);
this._k_setVisibleDeferred(k_visible);
},

_k_setVisibleDeferred: function (k_visible) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
if (this.k_extWidget.layout.layout) {
this.k_extWidget.doLayout();
}
},

k_isDisabled: kerio.lib._K_FormItem.prototype.k_isDisabled,

k_isDisabledByContainer: kerio.lib._K_FormItem.prototype.k_isDisabledByContainer,

k_isReadOnly: kerio.lib._K_FormItem.prototype.k_isReadOnly,

k_isReadOnlyByContainer: kerio.lib._K_FormItem.prototype.k_isReadOnlyByContainer,

k_isVisible: kerio.lib._K_FormItem.prototype.k_isVisible,

k_isVisibleByContainer: kerio.lib._K_FormItem.prototype.k_isVisibleByContainer,

_k_setVisibleByParent: function (k_visible) {
k_visible = (undefined === k_visible) ? true : k_visible;
this._k_isVisibleByContainer = k_visible;
if (true === k_visible) {
k_visible = this._k_isVisible;
}
this._k_forEachItem('_k_setVisibleByParent', k_visible);
},

_k_adjustAnchor: function (k_extPanel) {
var k_ownerItems = k_extPanel.ownerCt.items,
k_itemsHeight = 0,
k_cnt = k_ownerItems.length,
k_i,
k_item;
for (k_i=0; k_i<k_cnt; k_i++) {
k_item = k_ownerItems.itemAt(k_i);
if (k_item._kx) {
if (k_item._kx.k_owner.k_id === this.k_id) {
continue;
}
if (!k_item._kx.k_isOnResize) {
k_item.on('resize', this._k_updateBottomAnchor, this);
kerio.lib._k_addKerioProperty(k_item, {k_isOnResize: true});
}
}
if (k_item.rendered) {
k_itemsHeight += k_item.getSize().height || 0;
}
else {
k_itemsHeight += k_item.height || 0;
}
}
k_extPanel.anchor = '0 -' + k_itemsHeight;
},

_k_updateBottomAnchor: function (k_extPanel, k_adjWidth, k_adjHeight) {
var
k_extWidget,
k_lastHeight;
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
k_lastHeight = k_extPanel.lastSize.height;
if (undefined !== k_lastHeight && k_extPanel.getHeight() !== k_lastHeight) {
k_extWidget = this.k_extWidget;
this._k_adjustAnchor(k_extWidget);
k_extWidget.anchorSpec = null;
}
},

k_setSize: function (k_size) {
var k_extWidget = this.k_extWidget,
k_newSize = {width: k_size.k_width, height: k_size.k_height};
if (!k_extWidget.boxReady) {
k_newSize.width  = (undefined === k_newSize.width ) ? k_extWidget.initialConfig.width  : k_newSize.width;
k_newSize.height = (undefined === k_newSize.height) ? k_extWidget.initialConfig.height : k_newSize.height;
}
k_extWidget.setSize(k_newSize);
},

_k_adjustMinHeight: function (k_extPanel, k_adjWidth, k_adjHeight) {
var k_minHeight = this._k_storedConfig.k_minHeight;
if (k_adjHeight < k_minHeight) {
k_extPanel.setHeight(k_minHeight);
}
},

k_setIndent: function (k_indent) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var k_extWidget = this.k_extWidget;
k_extWidget.el.setStyle('paddingLeft', (k_indent || 0) * kerio.lib.k_constants.k_FORM_INDENT + 'px');
k_extWidget.lastSize = null;
k_extWidget.anchorSpec = null;
k_extWidget.ownerCt.lastSize = null;
k_extWidget.ownerCt.doLayout();
},

k_addClassName: function (k_className) {
this.k_extWidget.addClass(k_className);
},

k_removeClassName: function (k_className) {
this.k_extWidget.removeClass(k_className);
}
}); 
kerio.lib.K_FieldsetContainer = function (k_id, k_config) {
kerio.lib.K_FieldsetContainer.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_FieldsetContainer, kerio.lib.K_FormContainer, {

_k_defaultClassName: 'formFieldsetContainer',
_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib.K_FormContainer, {
border: true,
height: 'auto' }),
_K_ExtPanelConstructor: Ext.form.FieldSet
});

kerio.lib.K_ColumnContainer = function (k_id, k_config) {
this._k_coverPanelsIndexes = [];
kerio.lib.K_ColumnContainer.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_ColumnContainer, kerio.lib.K_FormContainer, {

_k_defaultClassName: 'formColumnContainer',
_k_columnClassNamePrefix: 'column',

_k_coverContainerCfg: {
k_type: 'k_container',
k_className: ''
},
_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib.K_FormContainer, {
height: 'auto',
layout: 'column'
}),

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_columns = k_storedConfig.k_items,
k_column,
k_columnWidth,
k_extWidget,
k_columnClassName,
k_i, k_cnt = k_columns.length;
for (k_i=0; k_i<k_cnt; k_i++) {
k_column = k_columns[k_i];
k_columnWidth = k_column.k_width;
k_columnClassName = this._k_columnClassNamePrefix + k_i;
if (!k_column.k_items && !k_column.k_content) { k_column = this._k_addCoverPanel(k_column, k_i);
k_columns[k_i] = k_column;
}
if (k_columnWidth && ('string' === Ext.type(k_columnWidth)) && (k_columnWidth.lastIndexOf('%') === k_columnWidth.length - 1)) {
k_column.k_columnWidth = parseInt(k_columnWidth, 10) / 100;
delete k_column.k_width;
}
if (!k_column.k_className) {
k_column.k_className = k_columnClassName;
}
else {
k_column.k_className += ' ' + k_columnClassName;
}
}
k_extWidget = kerio.lib.K_ColumnContainer.superclass._k_initExtComponent.call(this, k_adaptedConfig, k_storedConfig);
if (this._k_coverPanelsIndexes.length > 0) {
this._k_initCoverPanelShowHide(k_extWidget);
}
if (this._k_isResizeableVertically)	 {
k_extWidget.on('resize', this._k_resizeContent, this);
}
k_extWidget.on('afterrender', k_extWidget.doLayout, k_extWidget);
return k_extWidget;
},

_k_initCoverPanelShowHide: function (k_extWidget) {
var
k_items = k_extWidget.items,
k_coverPanelsIndexes = this._k_coverPanelsIndexes,
k_container,
k_item,
k_cnt,
k_i;
for (k_i = 0, k_cnt = k_coverPanelsIndexes.length; k_i < k_cnt; k_i++) {
k_container = k_items.get(k_coverPanelsIndexes[k_i]);
k_item = k_container.items.get(0);
if (k_item.hidden) {
k_container.hide();
}
k_item.on({
'beforeshow': k_container.show,
'show'      : this._k_showCoverPanel,
'hide'      : this._k_hideCoverPanel,
scope: k_container
});
}
delete this._k_coverPanelsIndexes;
},

_k_showCoverPanel: function () {
if (this.ownerCt) {
this.ownerCt.doLayout();
}
},

_k_hideCoverPanel: function () {
this.hide();
if (this.ownerCt) {
this.ownerCt.doLayout();
}
},

_k_addCoverPanel: function (k_column, k_index) {
var k_coveredColumn = kerio.lib._k_cloneObject(this._k_coverContainerCfg);
k_coveredColumn.k_items = [k_column];
if (Ext.isIE7 && 'k_formUploadButton' === k_column.k_type) {
k_coveredColumn.k_className = kerio.lib._k_addClassName(k_coveredColumn.k_className, 'formUploadButtonInColumn');
}
this._k_coverPanelsIndexes.push(k_index);
return k_coveredColumn;
},

_k_setVisibleByParent: function (k_visible) {
k_visible = (undefined === k_visible) ? true : k_visible;
kerio.lib.K_ColumnContainer.superclass._k_setVisibleByParent.call(this, k_visible);
this._k_resizeContentOnShow();
},

k_setVisible: function (k_visible) {
k_visible = (undefined === k_visible) ? true : k_visible;
kerio.lib.K_ColumnContainer.superclass.k_setVisible.call(this, k_visible);
this._k_resizeContentOnShow();
},

_k_resizeContentOnShow: function () {
var k_extWidget = this.k_extWidget,
k_lastHeight,
k_items,
k_item,
k_i,
k_cnt;
if (!this._k_isResizeableVertically || !this.k_isVisible() || !this._k_isHeightUpdateNeeded) {
return;
}
this._k_isHeightUpdateNeeded = false;
k_lastHeight = k_extWidget.lastSize.height;
delete k_extWidget.lastSize.height;
k_items = k_extWidget.items;
for (k_i = 0, k_cnt = k_items.getCount(); k_i < k_cnt;k_i++) {
k_item = k_items.get(k_i);
if (k_item._kx && k_item._kx._k_isResizeableVertically) {
delete k_items.get(k_i).lastSize.height;
}
}
this.k_setSize({k_height: k_lastHeight});
},

_k_resizeContent: function (k_extPanel, k_adjWidth, k_adjHeight) {
var k_items = k_extPanel.items,
k_itemsCount = k_items.getCount(),
k_item,
k_i,
k_height,
k_kerioWidget = null,
K_ExtFieldSet = Ext.form.FieldSet,
K_FormContainer = kerio.lib.K_FormContainer,
k_isFormContainer;
if (false === this.k_isVisible()) {
this._k_isHeightUpdateNeeded = true;
return;
}
for (k_i=0; k_i < k_itemsCount; k_i++) {
k_item = k_items.get(k_i);
k_kerioWidget = k_item._kx ? k_item._kx.k_owner : null;
k_isFormContainer = (k_kerioWidget instanceof K_FormContainer);
if (!k_kerioWidget || !k_kerioWidget._k_isResizeableVertically || !k_isFormContainer || ('number' !== Ext.type(k_adjHeight))) {
continue;
}
if (Ext.isIE && (k_item instanceof K_ExtFieldSet)) {
k_height = k_adjHeight - 10;
}
else {
k_height = k_adjHeight;
}
k_kerioWidget.k_setSize({k_height: k_height});
}
}
}); 
kerio.lib.K_RowContainer = function (k_id, k_config) {
this._k_setStoredProperties(['k_caption']);
kerio.lib.K_RowContainer.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_RowContainer, kerio.lib.K_ColumnContainer, {

_k_defaultClassName: 'formRowContainer',
_k_rightSeparatorConfig: {
k_type: 'k_simpleText',
k_isLabelHidden: true,
k_value: ''
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_columns = k_storedConfig.k_items,
k_column,
k_columnWidth,
k_extWidget,
k_i, k_cnt = k_columns.length,
k_itemsWithoutWidth = 0,
k_itemsWidthInPerc = 100,
k_cloneObject = kerio.lib._k_cloneObject,
k_indentSize = kerio.lib.k_constants.k_FORM_INDENT,
k_rightAlignColumnIndex = null,
k_isAllRightAligned = ( '->' === k_columns[0]),
k_firstItemIndex = (k_isAllRightAligned) ? 1 : 0;
if (k_storedConfig.k_caption) {
k_column = k_columns[(!k_isAllRightAligned) ? 0 : 1];
k_column.k_caption = k_storedConfig.k_caption;
delete k_storedConfig.k_caption;
delete this._k_adaptedConfig.title;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_column = k_columns[k_i];
if (('string' === Ext.type(k_column)) && ('->' === k_column)) {
k_rightAlignColumnIndex = k_i;
continue;
}
k_columnWidth = k_column.k_width;
if ((undefined === k_columnWidth) && ('k_formButton' !== k_column.k_type)) {
k_itemsWithoutWidth++;
}
else if ('string' === Ext.type(k_columnWidth)) {
if ('auto' !== k_columnWidth) {
k_itemsWidthInPerc -= parseInt(k_columnWidth, 10);
}
}
}
if (null !== k_rightAlignColumnIndex) {
k_columns[k_rightAlignColumnIndex] = k_cloneObject(this._k_rightSeparatorConfig);
k_columns[k_rightAlignColumnIndex].k_width = k_itemsWidthInPerc + '%';
k_itemsWidthInPerc = 0;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_column = k_columns[k_i];
k_columnWidth = k_column.k_width;
if (k_i > k_firstItemIndex) {
k_column.k_isLabelHidden = (false === k_column.k_isLabelHidden) ? false : true;
}
if ((undefined === k_columnWidth) && ('k_formButton' !== k_column.k_type)) {
k_columnWidth = Math.round(k_itemsWidthInPerc / k_itemsWithoutWidth) + '%';
}
if (k_columnWidth) {
if (!(('string' === Ext.type(k_columnWidth)) && (k_columnWidth.lastIndexOf('%') === k_columnWidth.length - 1))) {
if (true !== k_column.k_isLabelHidden) {
k_columnWidth += ((undefined !== k_column.k_labelWidth) ? k_column.k_labelWidth : k_storedConfig.k_labelWidth);
k_columnWidth += 5; }
if (k_column.k_indent) {
k_columnWidth += (k_column.k_indent * k_indentSize);
}
}
}
k_columns[k_i] = this._k_addCoverPanel(k_columns[k_i], k_i);
k_columns[k_i].k_width = k_columnWidth;
}
k_extWidget = kerio.lib.K_RowContainer.superclass._k_initExtComponent.call(this, k_adaptedConfig, k_storedConfig);
return k_extWidget;
}
}); 
Ext.layout.FormLayout.prototype.adjustHeightAnchor = function(k_value, k_comp){
var
k_ownerItems = k_comp.ownerCt.items,
k_i, k_cnt = k_ownerItems.length,
k_itemEl = null,
k_item, k_margins = 0, k_resizeableItems = 0;
if (isNaN(k_value)) {
return k_value;
}
k_value += k_comp.getPositionEl().getMargins('tb');
for (k_i = 0; k_i<k_cnt; k_i++) {
k_item = k_ownerItems.itemAt(k_i);
if (k_item.rendered) {
if (k_item instanceof Ext.form.Field) {
k_itemEl = Ext.get(k_item.getEl().findParent('.x-form-item'));
}
else {
k_itemEl = k_item.getPositionEl();
}
if (k_itemEl) {
k_margins += k_itemEl.getMargins('tb');
}
}
if (k_item.anchor && (2 === k_item.anchor.split(' ').length)) {
k_resizeableItems++;
}
}
if (Ext.isIE && k_item instanceof Ext.form.FieldSet) {
k_value -= 10;
}
if (0 === k_resizeableItems) {
return k_value;
}
return k_value - Math.floor(k_margins / k_resizeableItems);
};

Ext.layout.FormLayout.prototype.adjustWidthAnchor = function(k_value, k_comp){
var k_kerioWidget = k_comp._kx ? k_comp._kx.k_owner : null;
if (k_comp.isFormField) {
if (k_kerioWidget && k_kerioWidget._k_indent) {
k_value -= k_kerioWidget._k_indent * kerio.lib.k_constants.k_FORM_INDENT;
}
if (!k_comp.hideLabel) {
if (k_kerioWidget && k_kerioWidget._k_labelWidth) {
k_value -= (k_kerioWidget._k_labelWidth + 5); }
else {
k_value -= this.labelAdjust;
}
}
}
return k_value;
};

if (kerio.lib.k_isFirefox || kerio.lib.k_isWebKit || kerio.lib.k_isMSIE11) {
Ext.form.FieldSet.prototype.adjustSize = function (k_width, k_height) {
var
k_isNotHeightAnchored = this.anchor && (this.anchor.split(' ').length < 2);
if(this.rendered && k_isNotHeightAnchored && 'number' === Ext.type(k_height)) {
k_height = k_height + this.getEl().getPadding('t');
}
return Ext.form.FieldSet.superclass.adjustSize.call(this, k_width, k_height);
};
}


kerio.lib.K_Form = function(k_id, k_config) {
this._k_formItems = {};
k_config.k_ownerForm = this;
if (k_config.k_onChange) {
this._k_onChange = k_config.k_onChange;
this._k_isOnChangeHandler = true;
}
kerio.lib.K_Form.superclass.constructor.call(this, k_id, k_config);
this._k_useStructuredData = true === k_config.k_useStructuredData;
if (k_config.k_update) {
this.k_update = k_config.k_update;
}
};
Ext.extend(kerio.lib.K_Form, kerio.lib.K_FormContainer,
{







_k_isMainForm: true,
_k_defaultClassName: 'form',
_K_ExtPanelConstructor: Ext.form.FormPanel,
_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib.K_FormContainer, {
k_actionUrl: 'url'
}),
_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib.K_FormContainer, {
fileUpload: true,
autoScroll: true,
method: 'post',
url: '',
baseParams: ''
}),

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget;
this._k_labelWidth = k_adaptedConfig.labelWidth;
k_adaptedConfig.id = this.k_id;
k_adaptedConfig.items = this._k_getExtItems(k_storedConfig);
k_extWidget = new this._K_ExtPanelConstructor(k_adaptedConfig);
if ((Ext.isWebKit || kerio.lib.k_isMSIE9) && k_extWidget.autoScroll) {
k_extWidget.on({
'afterlayout'  : this._k_fixScrollbars,
'activate'     : this._k_fixScrollbars,
'resize'       : this._k_fixScrollbars,
scope: this
});
}
if (kerio.lib.k_isFirefox) {
k_extWidget.on('render', this._k_slowRenderMask, this);
k_extWidget.on('afterrender', this._k_slowRenderUnmask, this, {delay: 10});
}
return k_extWidget;
},

_k_fixScrollbars: function (k_extFormPanel) {
kerio.lib._k_fixScrollbars(k_extFormPanel.body);
},

_k_onChangeHandler: function (k_form, k_item) {
var k_isRadio = k_item.k_isInstanceOf('K_Radio') && !k_item.k_isInstanceOf('K_Checkbox');
if (true === this._k_isUpdateStarted) {
this._k_isChange = true;
}
else {
if (!k_isRadio || (k_isRadio && k_item.k_isChecked())) {
this._k_callOnChangeHandler();
}
}
},

_k_callOnChangeHandler: function () {
var k_formManager;
if (true === this._k_isOnChangeHandler) {
this._k_onChange.call(this, this);
}
k_formManager = this.k_formManager;
if (k_formManager && k_formManager._k_isOnChangeHandler) {
k_formManager._k_onChangeHandler(this);
}
},

_k_beginUpdate: function () {
this._k_isUpdateStarted = true;
},

_k_endUpdate: function () {
this._k_isUpdateStarted = false;
if (true === this._k_isChange) {
this._k_isChange = false;
this._k_callOnChangeHandler();
}
},

k_getItem: function (k_itemId) {
return this.k_items[k_itemId];
},

k_getData: function(k_getDisabled) {
return this._k_getData(k_getDisabled);
},

_k_getStructuredData: function(k_data, k_nodes, k_value) {
var
k_cnt = k_nodes.length - 1,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {	if (undefined === k_data[k_nodes[k_i]]) {	k_data[k_nodes[k_i]] = {};
}
k_data = k_data[k_nodes[k_i]];
}
k_data[k_nodes[k_i]] = k_value;		},

_k_getData: function(k_getDisabled, k_changedOnly, k_relatedFieldsDef, k_forceUnstructured) {
var
k_data = {},
k_formItems = this._k_formItems,
k_itemName,
k_item,
k_relatedFields,
k_relatedFieldIndex,
k_relatedFieldsCount,
k_relatedFieldId,
k_relatedField,
k_dataWithRelated,
k_i, k_cnt;
for (k_itemName in k_formItems) {
k_item = k_formItems[k_itemName];
if ('function' === Ext.type(k_item)) {
continue;
}
if (k_item && (!k_item.k_isDisabled() || k_getDisabled)) { if (false === k_item.k_isInstanceOf(['K_SimpleText', 'K_TemplateText', 'K_DisplayField', 'K_FormButton', 'K_ProgressBar'])) {
if (!k_changedOnly || k_item.k_isDirty()) {
k_data[k_itemName] = k_item.k_getValue();
}
}
}
}
if (k_changedOnly && k_relatedFieldsDef) {
k_dataWithRelated = kerio.lib._k_cloneObject(k_data);
k_cnt = k_relatedFieldsDef.length;
for (k_itemName in k_data) {
for (k_i = 0; k_i < k_cnt; k_i++) {
k_relatedFields = k_relatedFieldsDef[k_i];
if (-1 !== k_relatedFields.indexOf(k_itemName)) {
k_relatedFieldsCount = k_relatedFields.length;
for (k_relatedFieldIndex = 0; k_relatedFieldIndex < k_relatedFieldsCount; k_relatedFieldIndex++) {
k_relatedFieldId = k_relatedFields[k_relatedFieldIndex];
k_relatedField = this.k_getItem(k_relatedFieldId);
if (k_relatedField) {
if ((undefined === k_data[k_relatedFieldId]) && (!k_relatedField.k_isDisabled() || k_getDisabled)) {
k_dataWithRelated[k_relatedFieldId] = k_relatedField.k_getValue();
}
}
else {
kerio.lib.k_reportError('Internal error: A form "' + this.k_id + '" refers to unknown releated item "'
+ k_relatedFieldId + '"', 'form.js');
}
}
}
}
}
k_data = k_dataWithRelated;
}
if (this._k_useStructuredData && !k_forceUnstructured) {
k_data = this._k_transformData(k_data, true);
}
return k_data;
},

_k_transformData: function (k_data, k_toStructured) {
var
k_transformedData = {},
k_tmp,
k_fieldName,
k_fieldValue,
k_nodes,
k_cnt,
k_i;
k_toStructured = true === k_toStructured;
if (k_toStructured) { for (k_fieldName in k_data) {
k_nodes = k_fieldName.split('.');
k_fieldValue = k_data[k_fieldName];
k_tmp = k_transformedData;
for (k_i = 0, k_cnt = k_nodes.length - 1; k_i < k_cnt; k_i++) {	if (undefined === k_tmp[k_nodes[k_i]]) { k_tmp[k_nodes[k_i]] = {};
}
k_tmp = k_tmp[k_nodes[k_i]];
}
k_tmp[k_nodes[k_i]] = k_fieldValue; }
}
else {
this._k_transformStructuredDataToPlain(k_data, k_transformedData);
}
return k_transformedData;
},

_k_transformStructuredDataToPlain: function(k_dataStructured, k_data, k_parentFieldName) {
var
k_property,
k_fieldName;
for (k_property in k_dataStructured) {
k_fieldName = k_parentFieldName ? k_parentFieldName + '.' + k_property : k_property;
if ('object' === Ext.type(k_dataStructured[k_property])) {
this._k_transformStructuredDataToPlain(k_dataStructured[k_property], k_data, k_fieldName);
}
else {
k_data[k_fieldName] = k_dataStructured[k_property];
}
}
},

k_getChangedData: function (k_getDisabled, k_relatedFieldsDef) {
return this._k_getData(k_getDisabled, true, k_relatedFieldsDef);
},

k_isChanged: function (k_includeDisabled) {
var
k_item,
k_formItems = this._k_formItems,
k_itemName;
for (k_itemName in k_formItems) {
k_item = k_formItems[k_itemName];
if ('object' !== Ext.type(k_item)) {
continue;
}
if (!k_item.k_isDisabled() || k_includeDisabled) {
if (false === k_item.k_isInstanceOf(['K_SimpleText', 'K_TemplateText', 'K_DisplayField', 'K_FormButton', 'K_ProgressBar'])) {
if (k_item.k_isDirty()) {
return true;
}
}
}
}
return false;
},

k_setData: function(k_data, k_isInitial) {
this._k_setData(k_data, false, k_isInitial);
},

k_setDataIfNew: function(k_data, k_isInitial) {
this._k_setData(k_data, true, k_isInitial);
},

_k_setData: function(k_data, k_newOnly, k_isInitial) {
var k_formItems = this._k_formItems,
k_item,
k_itemName,
k_value,
k_currentData;
this._k_beginUpdate();
if (k_newOnly) {
k_currentData = this.k_getData(true);
}
if (this._k_useStructuredData) {
k_data = this._k_transformData(k_data, false);
}
for (k_itemName in k_data) {
if ('function' !== typeof k_data[k_itemName]) {
k_value = k_data[k_itemName];
k_item = k_formItems[k_itemName];
if (k_item) {
if ('function' === typeof k_item.k_setValue) {
if (!k_newOnly || k_currentData[k_itemName] !== k_value) {
k_item.k_setValue(k_value, k_isInitial);
}
else if (k_newOnly && k_currentData[k_itemName] === k_value) {
k_item.k_setInitialValue(k_value);
}
}
}
}
}
this._k_endUpdate();
},

k_reset: function() {
var
k_formItems = this._k_formItems,
k_item,
k_itemName;
this._k_beginUpdate();
for (k_itemName in k_formItems) {
k_item = k_formItems[k_itemName];
if (!k_item || 'function' === Ext.type(k_item)) {
continue;
}
k_item.k_reset();
}
this._k_endUpdate();
this.k_clearInvalid();
},

k_setReadOnly: function(k_elements, k_readOnly) {
if (('boolean' === Ext.type(arguments[0])) || (0 === arguments.length)) {
kerio.lib.K_Form.superclass.k_setReadOnly.apply(this, arguments);
return;
}
k_readOnly = (undefined === k_readOnly) ? true : k_readOnly;
var k_item,
k_items = this.k_items,
k_i,
k_cnt;
if (!Ext.isArray(k_elements)) {
k_elements = [k_elements];
}
for (k_i=0, k_cnt=k_elements.length; k_i < k_cnt; k_i++) {
k_item = k_items[k_elements[k_i]];
if (!k_item || 'function' === Ext.type(k_item)) {
continue;
}
k_item.k_setReadOnly(k_readOnly);
}
},

k_setReadOnlyAll: function(k_readOnly) {
kerio.lib.K_Form.superclass.k_setReadOnly.call(this, k_readOnly);
},

k_setDisabledAll: function(k_disabled) {
kerio.lib.K_Form.superclass.k_setDisabled.call(this, k_disabled);
},

k_setVisibleAll: function(k_visible) {
kerio.lib.K_Form.superclass.k_setVisible.call(this, k_visible);
},

k_setDisabled: function(k_elements, k_disabled) {
if (('boolean' === Ext.type(arguments[0])) || (0 === arguments.length)) {
kerio.lib.K_Form.superclass.k_setDisabled.apply(this, arguments);
return;
}
k_disabled = (undefined === k_disabled) ? true : k_disabled;
var k_item,
k_items = this.k_items,
k_i,
k_cnt;
if (!Ext.isArray(k_elements)) {
k_elements = [k_elements];
}
for (k_i=0, k_cnt=k_elements.length; k_i < k_cnt; k_i++) {
k_item = k_items[k_elements[k_i]];
if (!k_item || 'function' === Ext.type(k_item)) {
continue;
}
k_item.k_setDisabled(k_disabled);
}
},

k_setVisible: function (k_elements, k_show) {
if (('boolean' === Ext.type(arguments[0])) || (0 === arguments.length)) {
kerio.lib.K_Form.superclass.k_setVisible.apply(this, arguments);
return;
}
k_show = (undefined === k_show) ? true : k_show;
var k_item,
k_items = this.k_items,
k_i,
k_cnt;
if (!Ext.isArray(k_elements)) {
k_elements = [k_elements];
}
for (k_i=0, k_cnt=k_elements.length; k_i < k_cnt; k_i++) {
k_item = k_items[k_elements[k_i]];
if (!k_item || 'function' === Ext.type(k_item)) {
continue;
}
k_item.k_setVisible(k_show);
}
},

k_clearInvalid: function () {
var k_items = this.k_items;
var k_item;
for (var k_itemName in k_items) {
k_item = k_items[k_itemName];
if (k_item.k_markInvalid) {
k_item.k_markInvalid(false);
}
}
},

k_focus: function(k_element) {
var k_item = this.k_items[k_element];
if (k_item) {
k_item.k_focus();
return true;
}
return false;
},

k_update: function(k_sender, k_event) {
kerio.lib.k_reportError('Internal error: Override k_update method in object with ID ' + this.k_id
+ ' to make this object behaving as an observer', 'form.js');
},

k_uploadFiles: function () {
var
k_fileUploadItems = this._k_fileUploadItems,
k_items = this.k_items,
k_item, k_itemName;
if (!k_fileUploadItems) { k_fileUploadItems = {};
for (k_itemName in k_items) {
k_item = k_items[k_itemName];
if (k_item instanceof kerio.lib.K_UploadButton) {
k_fileUploadItems[k_itemName] = k_item;
k_item.k_upload();
}
}
this._k_fileUploadItems = k_fileUploadItems;
}
else { for (k_itemName in k_fileUploadItems) {
k_item = k_fileUploadItems[k_itemName];
if ('object' !== Ext.type(k_item)) {
continue;
}
k_item.k_upload();
}
}
},

_k_slowRenderMask: function() {
this.k_extWidget.addClass('hideForRendering');
if (kerio.lib.k_isSlowMachine) {
kerio.lib._k_maskElement(this.k_extWidget.container, {
k_owner: this,
k_keepInvisible: true,
k_message: kerio.lib.k_tr('Please wait…', 'wlibWait')
});
}
},

_k_slowRenderUnmask: function() {
if (kerio.lib.k_isSlowMachine) {
kerio.lib._k_unmaskElement(this.k_extWidget.container, this);
}
this.k_extWidget.removeClass('hideForRendering');
if (this._k_layoutAfterSlowRender) {
this._k_layoutAfterSlowRender.doLayout();
}
}
}); 
Ext.form.FormPanel.prototype.onEnable = function () {
Ext.form.FormPanel.superclass.onEnable.call(this);
};
Ext.form.FormPanel.prototype.onDisable = function () {
Ext.form.FormPanel.superclass.onDisable.call(this);
};


kerio.lib.K_FormManager = function(k_id, k_config) {
var
k_isOnChangeHandler = false,
k_form,
k_forms,
k_items,
k_itemId,
k_i, k_cnt;
if (Ext.isArray(k_config)) {
k_forms = k_config;
}
else {
k_forms = k_config.k_forms;
}
kerio.lib.k_registerWidget(this, k_id);
if (k_config.k_onChange) {
this._k_onChange = k_config.k_onChange;
k_isOnChangeHandler = true;
}
this._k_isOnChangeHandler = k_isOnChangeHandler;
this.k_id = k_id;
this.k_forms = []; this.k_items = {}; for (k_i = 0, k_cnt = k_forms.length; k_i < k_cnt; k_i++) {
k_form = k_forms[k_i];
this.k_forms.push(k_form);
k_form.k_formManager = this;
k_form._k_isFormManagerOnChangeHandler = k_isOnChangeHandler;
k_items = k_form.k_items;
for (k_itemId in k_items) {
if (undefined === this.k_items[k_itemId]) {
this.k_items[k_itemId] = k_items[k_itemId];
}
else {
kerio.lib.k_reportError('Internal error: An attempt to register forms into form manager which items are not unique!"'
+ '\nForm manager: ' + k_id + '\nForm: ' + k_form.k_id + '\nItem: ' + k_itemId, 'formManager.js');
}
}
}
this.k_owner = this;
};
kerio.lib.K_FormManager.prototype = {

k_getData: function(k_getDisabled) {
return this._k_getData(k_getDisabled);
},

_k_getData: function(k_getDisabled, k_changedOnly, k_relatedFieldsDef) {
var
k_data = {},
k_useStructuredData = false,
k_form,
k_formData,
k_i, k_cnt;
for (k_i = 0, k_cnt = this.k_forms.length; k_i < k_cnt; k_i++) {
k_form = this.k_forms[k_i];
k_useStructuredData = k_useStructuredData || k_form._k_useStructuredData;
k_formData = k_form._k_getData(k_getDisabled, k_changedOnly, null, true);
Ext.apply(k_data, k_formData);
}
if (k_changedOnly && k_relatedFieldsDef) {
k_data = this._k_addRelatedFields(k_data, k_relatedFieldsDef);
}
if (k_useStructuredData) {
k_data = kerio.lib.K_Form.prototype._k_transformData(k_data, true);
}
return k_data;
},

_k_addRelatedFields: function(k_data, k_relatedFieldsDef) {
var
k_relatedFields,
k_relatedFieldId,
k_i, k_cnt, k_j, k_relatedCnt;
for (k_i = 0, k_cnt = k_relatedFieldsDef.length; k_i < k_cnt; k_i++) {
k_relatedFields = k_relatedFieldsDef[k_i];
for (k_j = 0, k_relatedCnt = k_relatedFields.length; k_j < k_relatedCnt; k_j++) {
if (undefined !== k_data[k_relatedFields[k_j]]) {
for (k_j = 0; k_j < k_relatedCnt; k_j++) {
k_relatedFieldId = k_relatedFields[k_j];
if (undefined === k_data[k_relatedFieldId]) {
k_data[k_relatedFieldId] = this.k_getItem(k_relatedFieldId).k_getValue();
}
}
break;
}
}
}
return k_data;
},

k_getChangedData: function (k_getDisabled, k_relatedFieldsDef) {
return this._k_getData(k_getDisabled, true, k_relatedFieldsDef);
},

k_isChanged: function (k_includeDisabled) {
var
k_forms = this.k_forms,
k_cnt = k_forms.length,
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_forms[k_i].k_isChanged()) {
return true;
}
}
return false;
},

k_setData: function(k_data, k_isInitial) {
this._k_setData(k_data, false, k_isInitial);
},

k_setDataIfNew: function(k_data, k_isInitial) {
this._k_setData(k_data, true, k_isInitial);
},

_k_setData: function(k_data, k_newOnly, k_isInitial) {
var k_forms = this.k_forms;
this._k_beginUpdate();
if ('string' === typeof k_data) {
k_data = Ext.util.JSON.decode(k_data);
}
for (var k_i = 0, k_cnt = k_forms.length; k_i < k_cnt; k_i++) {
k_forms[k_i]._k_setData(k_data, k_newOnly, k_isInitial);
}
this._k_endUpdate();
},

k_reset: function() {
this._k_beginUpdate();
for (var k_i = 0, k_cnt = this.k_forms.length; k_i < k_cnt; k_i++) {
this.k_forms[k_i].k_reset();
}
this._k_endUpdate();
},

k_setDisabled: function(k_elements, k_disabled) {
k_disabled = (undefined === k_disabled) ? true : k_disabled;
for (var k_i = 0, k_cnt = this.k_forms.length; k_i < k_cnt; k_i++) {
this.k_forms[k_i].k_setDisabled(k_elements, k_disabled);
}
},

k_setVisible: function(k_elements, k_show) {
k_show = (undefined === k_show) ? true : k_show;
for (var k_i = 0, k_cnt = this.k_forms.length; k_i < k_cnt; k_i++) {
this.k_forms[k_i].k_setVisible(k_elements, k_show);
}
},

k_setReadOnly: function(k_elements, k_readOnly) {
for (var k_i = 0, k_cnt = this.k_forms.length; k_i < k_cnt; k_i++) {
this.k_forms[k_i].k_setReadOnly(k_elements, k_readOnly);
}
},

k_hide: function(k_elements) {
this.k_setVisible(k_elements);
},

k_show: function(k_elements, k_show) {
this.k_setVisible(k_elements, k_show);
},

k_disable: function(k_elements) {
this.k_setDisabled(k_elements);
},

k_enable: function(k_elements, k_enable) {
k_enable = (undefined === k_enable) ? true : k_enable;
this.k_setDisabled(k_elements, !k_enable);
},

k_setDisabledAll: function(k_disable) {
var k_i, k_cnt;
k_disable = (false !== k_disable);
for (k_i = 0, k_cnt = this.k_forms.length; k_i < k_cnt; k_i++) {
this.k_forms[k_i].k_setDisabledAll(k_disable);
}
},

k_setReadOnlyAll: function(k_unset) {
for (var k_i = 0, k_cnt = this.k_forms.length; k_i < k_cnt; k_i++) {
this.k_forms[k_i].k_setReadOnlyAll(k_unset);
}
},

k_focus: function(k_element) {
for (var k_i = 0, k_cnt = this.k_forms.length; k_i < k_cnt; k_i++) {
if (this.k_forms[k_i].k_focus(k_element)) {
return true;
}
}
},

k_getForm: function(k_id) {
var
k_form,
k_i, k_cnt;
for (k_i = 0, k_cnt = this.k_forms.length; k_i < k_cnt; k_i++) {
k_form = this.k_forms[k_i];
if (k_form.k_id === k_id) {
return k_form;
}
}
return false;
},

k_getItem: function (k_itemId) {
return this.k_items[k_itemId];
},

_k_isValid: function(k_markInvalid) {
var
k_myForms = this.k_forms,
k_cnt     = k_myForms.length,
k_results = new kerio.lib._K_ValidationResults(),
k_i,
k_form;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_form = k_myForms[k_i];
if (!k_form) {
continue; }
if (k_form._k_isValid) { k_results.k_add(k_form._k_isValid(k_markInvalid), k_results.k_valid); }
} return k_results;
},

k_isValid: function(k_notifyUser) {
var
k_notify = (false !== k_notifyUser), k_result;
k_result = this._k_isValid(k_notify);
return k_result.k_isValid(k_notify);
},

_k_onChangeHandler: function () {
if (true === this._k_isUpdateStarted) {
this._k_isChange = true;
}
else {
this._k_callOnChangeHandler();
}
},

_k_callOnChangeHandler: function () {
if (true === this._k_isOnChangeHandler) {
this._k_onChange.call(this, this);
}
},

_k_beginUpdate: function () {
this._k_isUpdateStarted = true;
},

_k_endUpdate: function () {
this._k_isUpdateStarted = false;
if (true === this._k_isChange) {
this._k_isChange = false;
this._k_callOnChangeHandler();
}
}
};


kerio.lib.K_Radio = function(k_id, k_config)
{
this._k_setStoredProperties(['k_option', 'k_value']);
kerio.lib.K_Radio.superclass.constructor.call(this, k_id, k_config);

if (Ext.isWebKit) {
this.k_extWidget.on('render', this._k_initFieldOptionClick, this);
}
};
Ext.extend(kerio.lib.K_Radio, kerio.lib._K_FormItem,
{





_k_isHtmlReadOnly: false,

_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib._K_FormItem, {
k_option: 'boxLabel',
k_isChecked: 'checked',
k_groupId: 'name',
k_name: undefined }),

_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib._K_FormItem, {
selectOnFocus: false,
checked: false
}),

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = new kerio.lib._K_Radio(k_adaptedConfig);
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = this.k_extWidget;
kerio.lib.K_Radio.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
if (k_extWidget.boxLabel) {
k_extWidget.on({
focus: this._k_highlightLabelOnFocus.createDelegate(this, ['addClass']),
blur: this._k_highlightLabelOnFocus.createDelegate(this, ['removeClass']),
scope: this
});
}
},

_k_doAfterRender: function () {
kerio.lib.K_Radio.superclass._k_doAfterRender.call(this);
this._k_optionLabelEl = this.k_extWidget.el.next('.x-form-cb-label');
},

_k_highlightLabelOnFocus: function (k_action) {
this._k_optionLabelEl[k_action]('formRadioFocus');
},

k_setChecked: function(k_checked) {
if (this._k_radioGroup) {
this._k_radioGroup.k_setChecked(this, k_checked);
}
else {
this.k_extWidget.setValue(k_checked);
}
},

k_isChecked: function() {
return this.k_extWidget.checked;
},

k_setOption: function(k_option, k_useConfigValueAsPrefix){
this.k_setSecureOption(kerio.lib.k_htmlEncode(k_option), k_useConfigValueAsPrefix);
},

k_setSecureOption: function(k_option, k_useConfigValueAsPrefix){
var
k_labelEl,
k_prefix = '',
k_storedConfig = this._k_storedConfig || {};
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
k_labelEl = this.k_extWidget.wrap.dom.getElementsByTagName('label')[0];
if (k_useConfigValueAsPrefix && k_storedConfig.k_option) {
k_prefix = k_storedConfig.k_option;
}
k_labelEl.innerHTML = k_prefix + k_option;
},

k_getValue: function() {
return this.k_extWidget.value;
},

k_getGroupInitValue: function() {
return this._k_radioGroup ? this._k_radioGroup._k_initialValue : this.k_extWidget.value;
},

k_getInitialValue: function (k_configValue) {
var k_value;
if (true === k_configValue) {
k_value = this.k_extWidget.initialConfig.checked;
}
else {
k_value = this._k_originalValue;
}
return k_value;
},

_k_setRadioGroup: function(k_id, k_config) {
var k_radioGroupId = k_config.k_groupId;
if (!k_radioGroupId) {
return;
}
var k_radioGroup = kerio.lib.k_getWidgetById(k_radioGroupId);
if (!k_radioGroup) {
k_radioGroup = new kerio.lib.K_RadioGroup(k_radioGroupId);
}
k_radioGroup.k_registerRadio(this, k_config);
this._k_radioGroup = k_radioGroup;
},

k_getRadioGroup: function() {
return this._k_radioGroup;
},

_k_initFieldOptionClick: function(k_extWidget){
var k_option = k_extWidget.wrap.down('label.x-form-cb-label');
if (k_option && (k_option.dom.htmlFor == k_extWidget.getEl().dom.id)) {
k_option.on('click', k_extWidget.focus, k_extWidget);
}
},

_k_callUserDefinedOnChangeHandler: function() {
var
k_value,
k_storedConfig = this._k_storedConfig || {};
if (!k_storedConfig.k_onChange) {
return;
}
if (this._k_radioGroup) {
k_value = this._k_radioGroup.k_getValue();
}
else {
k_value = this.k_getValue();
}
k_storedConfig.k_onChange.call(this, this.k_parent || null, this, k_value);
},

_k_isValueChanged: function () {
var k_radioGroup = this.k_getRadioGroup(),
k_result = false;
if (k_radioGroup) {
k_result = (this._k_prevValue !== k_radioGroup.k_getValue());
}
else {
k_result = kerio.lib.K_Radio.superclass._k_isValueChanged.call(this);
}
return k_result;
},

_k_updatePrevValue: function (k_value) {
var k_radioGroup = this.k_getRadioGroup();
if (k_radioGroup) {
this._k_prevValue = k_radioGroup.k_getValue();
}
else {
kerio.lib.K_Radio.superclass._k_updatePrevValue.call(this);
}
}
});

kerio.lib._K_Radio = function(k_config) {
kerio.lib._K_Radio.superclass.constructor.call(this, k_config);
};

Ext.extend(kerio.lib._K_Radio, Ext.form.Radio,
{
setValue: function(v){
this.checked = (v === true || v === 'true' || v == '1' || String(v).toLowerCase() === 'on');
if(this.el && this.el.dom){
this.el.dom.checked = this.checked;
this.el.dom.defaultChecked = this.checked;
}
},
onClick: function() {
if(this.el.dom.checked != this.checked){
this._kx.k_owner._k_radioGroup.k_setChecked(this._kx.k_owner, true);
}
}
});


kerio.lib.K_Checkbox = function(k_id, k_config) {
kerio.lib.K_Checkbox.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_Checkbox, kerio.lib.K_Radio,
{




_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib.K_Radio, {
k_name: 'name',
k_groupId: undefined }),

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = new Ext.form.Checkbox(k_adaptedConfig);
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
kerio.lib.K_Checkbox.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
this.k_extWidget.on('check', this._k_onChangeHandler, this);
},

k_setChecked: function(k_checked) {
this.k_extWidget.setValue(k_checked);
},

k_getValue: function() {
return this.k_isChecked();
},

k_getRawValue: function() {
return this._k_storedConfig.k_value;
}
});


kerio.lib.K_RadioGroup = function(k_id, k_config) {
kerio.lib.K_RadioGroup.superclass.constructor.call(this, k_id, k_config || {});
this._k_items = [];
};
Ext.extend(kerio.lib.K_RadioGroup, kerio.lib._K_FormItem,
{
_k_value: null,

_k_propertiesMapping: {},

_k_propertiesDefault: {},

k_registerRadio: function(k_radio, k_config) {
this._k_items.push(k_radio);
k_radio.k_extWidget.on({
focus: {
fn: this._k_fireEvent,
scope: {
k_eventName: 'focus',
k_radioGroup: this
}
},
blur: {
fn: this._k_fireEvent,
scope: {
k_eventName: 'blur',
k_radioGroup: this
}
},
hide: {
fn: this._k_fireEvent,
scope: {
k_eventName: 'hide',
k_radioGroup: this
}
},
disable: {
fn: this._k_fireEvent,
scope: {
k_eventName: 'disable',
k_radioGroup: this
}
},
readonly: {
fn: this._k_fireEvent,
scope: {
k_eventName: 'readonly',
k_radioGroup: this
}
},
render: {
fn: this._k_setRenderedFlag,
scope: this
}
});
k_radio._k_radioGroup = this;
var
k_allItemsDisabled = true,
k_allItemsReadOnly = true,
k_allItemsVisible = true;
for (var k_i=0, k_cnt=this._k_items.length; k_i<k_cnt; k_i++) {
if (!this._k_items[k_i].k_isDisabled()) {
k_allItemsDisabled = false;
}
if (!this._k_items[k_i].k_isReadOnly()) {
k_allItemsReadOnly = false;
}
if (!this._k_items[k_i].k_isVisible()) {
k_allItemsVisible = false;
}
}
this._k_isDisabled = k_allItemsDisabled;
this._k_isReadOnly = k_allItemsReadOnly;
this._k_isVisible =  k_allItemsVisible;
if (k_config.k_isChecked) {
this._k_configValue = k_config.k_value;
this._k_originalValue = k_config.k_value;
this._k_value = k_config.k_value;
}
k_radio._k_updatePrevValue();
}, 
_k_setRenderedFlag:	function () {
var
k_items = this._k_items,
k_i, k_cnt;
this.k_extWidget.rendered = true;
for (k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_items[k_i].k_extWidget.un('render', this._k_setRenderedFlag, this);
}
},

_k_fireEvent: function () {
var k_extWidget = this.k_radioGroup.k_extWidget;
k_extWidget.fireEvent(this.k_eventName, k_extWidget);
},

_k_beforeInitExtComponent: Ext.emptyFn,

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = new kerio.lib._K_RadioGroup();
return k_extWidget;
},

_k_afterInitExtComponent: Ext.emptyFn,

k_setChecked: function(k_currentRadio, k_checked) {
var k_radio,
k_extRadio,
k_isChecked,
k_items = this._k_items,
k_i, k_cnt = k_items.length;
this._k_value = (true === k_checked) ? k_currentRadio.k_getValue() : null;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_radio = k_items[k_i];
k_isChecked = (k_radio === k_currentRadio) ? k_checked : false;
k_extRadio = k_radio.k_extWidget;
k_extRadio.setValue(k_isChecked);
}
for (k_i=0; k_i < k_cnt; k_i++) {
k_radio = k_items[k_i];
k_radio._k_onChangeHandler.call(k_radio, k_radio.k_extWidget);
}
},

_k_uncheckAll: function () {
var k_items = this._k_items;
var k_radio;
for (var k_i = 0, k_cnt = k_items.length; k_i<k_cnt; k_i++) {
k_radio = k_items[k_i];
if (k_radio.k_isChecked()) {
this.k_setChecked(k_radio, false);
return;
}
}
},

k_setValue: function (k_value, k_isInitial) {
var k_items = this._k_items,
k_storedConfig,
k_radio;
if (undefined === k_value) {
return;
}
if ((null === k_value) || ('' === k_value)) {
if (true === k_isInitial) {
this.k_setInitialValue(k_value);
}
this._k_uncheckAll();
return;
}
for (var k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_radio = k_items[k_i];
k_storedConfig = k_radio._k_storedConfig || {};
if (k_value == k_storedConfig.k_value) {
this.k_setChecked(k_radio, true);
if (true === k_isInitial) {
this.k_setInitialValue(this.k_getValue());
}
return;
}
}
},

k_getValue: function () {
return this._k_value;
},

k_getInitialValue: function (k_configValue) {
var k_value;
if (true === k_configValue) {
k_value = this._k_configValue;
}
else {
k_value = this._k_originalValue;
}
return undefined !== k_value ? k_value : null;
},

_k_setDisabledItem: function(k_disabled) {
k_disabled = (undefined === k_disabled) ? true : k_disabled;
var k_items = this._k_items;
for (var k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_items[k_i].k_setDisabled(k_disabled);
}
},

_k_setReadOnlyItem: function (k_readOnly) {
k_readOnly = (undefined === k_readOnly) ? true : k_readOnly;
var k_items = this._k_items;
for (var k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_items[k_i].k_setReadOnly(k_readOnly);
}
},

k_setVisible: function (k_show) {
k_show = (undefined === k_show) ? true : k_show;
var k_items = this._k_items;
for (var k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_items[k_i].k_setVisible(k_show);
}
this._k_isVisible = k_show;
},

k_setItemDisabled: function (k_itemValue, k_disabled) {
k_disabled = (undefined === k_disabled) ? true : k_disabled;
var k_radio = this._k_findItemByValue(k_itemValue);
if (k_radio) {
k_radio.k_setDisabled(k_disabled);
}
},

k_setItemVisible: function (k_itemValue, k_show) {
k_show = (undefined === k_show) ? true : k_show;
var k_radio = this._k_findItemByValue(k_itemValue);
if (k_radio) {
k_radio.k_setVisible(k_show);
}
},

k_setItemReadOnly: function (k_itemValue, k_readOnly) {
k_readOnly = (undefined === k_readOnly) ? true : k_readOnly;
var k_radio = this._k_findItemByValue(k_itemValue);
if (k_radio) {
k_radio.k_setReadOnly(k_readOnly);
}
},

k_setItemOption: function (k_itemValue, k_option, k_useConfigValueAsPrefix) {
var k_radio = this._k_findItemByValue(k_itemValue);
if (k_radio) {
k_radio.k_setOption(k_option, k_useConfigValueAsPrefix);
}
},

k_setItemSecureOption: function (k_itemValue, k_option, k_useConfigValueAsPrefix) {
var k_radio = this._k_findItemByValue(k_itemValue);
if (k_radio) {
k_radio.k_setSecureOption(k_option, k_useConfigValueAsPrefix);
}
},

_k_findItemByValue: function (k_itemValue) {
var
k_items = this._k_items,
k_radio,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_items.length; k_i < k_cnt; k_i++) {
k_radio = k_items[k_i];
if (k_itemValue == k_radio.k_getValue()) {
return k_radio;
}
}
return false;
},

k_addItemClassName: function (k_itemValue, k_className) {
var k_radio = this._k_findItemByValue(k_itemValue);
if (k_radio) {
k_radio.k_addClassName(k_className);
}
},

k_removeItemClassName: function (k_itemValue, k_className) {
var k_radio = this._k_findItemByValue(k_itemValue);
if (k_radio) {
k_radio.k_removeClassName(k_className);
}
}
});  
kerio.lib._K_RadioGroup = Ext.extend(Ext.Component, {

onRender: Ext.emptyFn,

focus: function () {
var
k_kerioWidget = this._kx.k_owner,
k_radio = k_kerioWidget._k_findItemByValue(k_kerioWidget.k_getValue()),
k_extRadio;
if (k_radio) {
k_extRadio = k_radio.k_extWidget;
}
else {
k_extRadio = k_kerioWidget._k_items[0].k_extWidget;
}
k_extRadio.focus();
}
});


kerio.lib.K_TextField = function(k_id, k_config) {
this._k_setStoredProperties([
'k_isFileField',
'k_onKeyUp',
'k_onKeyPress',
'k_onKeyDown',
'k_validator',
'k_maxLength',
'k_isSearchField'
]);
kerio.lib.K_TextField.superclass.constructor.call(this, k_id, k_config);
this.k_addReferences({ _k_checkByteLength: true === k_config.k_checkByteLength });
this._k_checkMaxLength = this._k_checkByteLength;
};
Ext.extend(kerio.lib.K_TextField,  kerio.lib._K_FormItem,
{

















_k_checkMaxLength: false,

_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib._K_FormItem, {
k_emptyText: 'emptyText',
k_maxLength: 'maxLength',
k_invalidText: 'invalidText',
k_isPasswordField: {inputType: {'true': 'password'}},
k_isHiddenField:  {inputType: {'true': 'hidden'}},
k_isFileField:  {inputType: {'true': 'file'}}
}),

_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib._K_FormItem, {
value: '',
preventMark: true, cls: kerio.lib.k_isIPadCompatible ? 'x-form-text %+' : '' }),

_k_initAllowBlank: function () {
var k_validatorCfg = this._k_storedConfig.k_validator || {};
this._k_adaptedConfig.allowBlank = false !== k_validatorCfg.k_allowBlank;
},

_k_beforeInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var	k_maxLength = k_storedConfig.k_maxLength;
if (-1 === k_maxLength) {
delete k_adaptedConfig.maxLength;
}
else {
k_maxLength = k_maxLength || kerio.lib.k_constants.k_TEXT_FIELD_MAX_LENGTH;
this._k_maxLength = k_maxLength;
k_adaptedConfig.maxLength = k_maxLength;
}
delete k_storedConfig.k_maxLength;
this._k_initAllowBlank();
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var	k_extWidget;
k_extWidget = new Ext.form.TextField(k_adaptedConfig);
if (k_adaptedConfig.k_autoTrimWhitespaces !== false) {
k_extWidget.processValue = function(value) {
return Ext.form.TextField.prototype.processValue.call(this, value.trim());
};
k_extWidget.getValue = function() {
var k_value = Ext.form.TextField.prototype.getValue.call(this);
if ('string' === typeof k_value) {
k_value = k_value.trim();
}
return k_value;
};
}
if (true === k_storedConfig.k_isFileField) {
k_extWidget.onFocus = Ext.emptyFn;
}
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_validatorCfg = k_storedConfig ? k_storedConfig.k_validator : undefined;
kerio.lib.K_TextField.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
if (this._k_maxLength) {
this.k_extWidget.on({
'focus': this._k_applyMaxLength,
'blur':  this._k_removeMaxLength,
scope: this
});
}
if (k_validatorCfg) {
if (k_validatorCfg.hasOwnProperty('k_regExp')) {
this.k_setRegexValidator(k_validatorCfg.k_regExp, k_validatorCfg.k_invalidText);
}
if (k_validatorCfg.hasOwnProperty('k_functionName')) {
this.k_setValidationFunction(k_validatorCfg.k_functionName,  k_validatorCfg.k_invalidText);
}
}
if (k_storedConfig.k_isSearchField) {
this.k_extWidget.on('render', this._k_registerSearchField, this);
delete k_storedConfig.k_isSearchField;
}
if (kerio.lib.k_isIPadCompatible) {
this.k_extWidget.applyEmptyText = Ext.emptyFn;
this._k_setEmptyTextForIPad(this.k_extWidget.initialConfig.emptyText);
}
},

_k_preventMarkOnBlur: function () {
var k_extWidget = this.k_extWidget;
if (k_extWidget.preventMark && this.k_isDirty()) {
k_extWidget.un('blur', this._k_preventMarkOnBlur, this);
k_extWidget.preventMark = false;
this._k_validateValue();
}
},

_k_preventMarkOnKeyPress: function (k_extEvent) {
var k_extWidget = this.k_extWidget;
if (Ext.EventObject.TAB === k_extEvent.getKey()) {
return;
}
k_extWidget.getEl().un((Ext.isIE ? 'keydown' : 'keypress'), this._k_preventMarkOnKeyPress, this);
if (k_extWidget.preventMark) {
k_extWidget.preventMark = false;
}
},

k_setValue: function(k_value, k_isInitial) {
var
k_extWidget = this.k_extWidget,
k_origValue = this.k_getValue(),
k_isRenewSelectionNeeded = false,
k_selectedText = null,
k_valueType;
if (this._k_maxLength) {
k_valueType = Ext.type(k_value);
if ('string' !== k_valueType) {
if (undefined === k_value || null === k_value) {
k_value = '';
}
else {
k_value = String(k_value);
}
}
k_value = k_value.substring(0, this._k_maxLength);
if ('number' === k_valueType) {
k_value = Number(k_value);
}
}
if (!kerio.lib.k_isFirefox) {
if (k_extWidget.rendered && k_extWidget.hasFocus && k_value == k_origValue) {
k_selectedText = this.k_getSelectedText() || null;
}
}
kerio.lib.K_TextField.superclass.k_setValue.call(this, k_value, k_isInitial);
if (k_selectedText && k_value == k_selectedText) {
k_extWidget.el.dom.select();
}
this._k_onChangeHandler(this.k_extWidget);
},

k_setEmptyText: function(k_emptyText) {
var k_extWidget = this.k_extWidget;
if (kerio.lib.k_isIPadCompatible) {
this._k_setEmptyTextForIPad(k_emptyText);
return;
}
if (!k_extWidget.rendered) {
k_extWidget.emptyText = k_emptyText;
return;
}
if (!this._k_hasListener('focus', k_extWidget.preFocus, k_extWidget)) {
k_extWidget.on('focus', k_extWidget.preFocus, k_extWidget);
}
if (!this._k_hasListener('blur', k_extWidget.postBlur, k_extWidget)) {
k_extWidget.on('blur', k_extWidget.postBlur, k_extWidget);
}
if(k_extWidget.el.dom.value == k_extWidget.emptyText){
k_extWidget.setRawValue('');
if (!k_emptyText) {
k_extWidget.el.removeClass(k_extWidget.emptyClass);
}
}
k_extWidget.emptyText = k_emptyText;
k_extWidget.applyEmptyText();
},

_k_setEmptyTextForIPad: function (k_emptyText) {
var k_extWidget = this.k_extWidget;
k_extWidget.emptyText = k_emptyText;
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
if (k_emptyText) {
k_extWidget.getEl().dom.setAttribute('placeholder', k_emptyText);
}
else {
k_extWidget.getEl().dom.removeAttribute('placeholder');
}
},

k_getEmptyText: function() {
return this.k_extWidget.emptyText;
},

k_applyEmptyText: function() {
this.k_extWidget.applyEmptyText();
},

k_setRawValue: function(k_value) {
this.k_extWidget.setRawValue(k_value);
},

k_isValid: function(k_markInvalid) {
var
k_isValid,
k_extWidget = this.k_extWidget;
if(!this.k_isVisible() || this.k_isDisabled() || this.k_isReadOnly()) {
return true;
}
k_markInvalid = (false !== k_markInvalid);
k_isValid = k_extWidget.isValid(!k_markInvalid);

if (!k_extWidget.rendered && !k_isValid && k_markInvalid) {
this._k_markInvalid();
}
return k_isValid;
},

k_setRegexValidator: function(k_regExp, k_regexText) {
var k_extWidget = this.k_extWidget;
if (null === k_regExp) {
return;
}
if (!k_regExp || '[object RegExp]' !== Object.prototype.toString.call(k_regExp)) {
kerio.lib.k_warn('K_TextField.k_setRegexValidator: k_regex param has to be instance of RegExp object! Widget ID: ' + this.k_id);
return;
}
k_extWidget.regex = k_regExp;
if (k_regexText) {
k_extWidget.regexText = k_regexText;
}
},

k_unsetRegexValidator: function () {
delete this.k_extWidget.regex;
},

k_setValidationFunction: function(k_functionName, k_invalidText) {
var
k_extWidget = this.k_extWidget,
k_function;
if (null === k_functionName) {
return;
}
if (!Ext.isString(k_functionName)) {
kerio.lib.k_warn('K_TextField.k_setValidationFunction: k_functionName param has to be a string! Widget ID: ' + this.k_id);
return;
}
k_function = kerio.lib.k_inputValidator.k_getFunctionByName(k_functionName);
if (!k_function) {
kerio.lib.k_warn('K_TextField.k_setValidationFunction: Function ' + k_functionName + ' has to be registered in kerio.lib.k_inputValidator! Widget ID: ' + this.k_id);
return;
}
kerio.lib._k_addKerioProperty(k_extWidget, {
k_validatorFunction: k_function.k_function ? k_function.k_function : k_function,
k_validatorInvalidText: k_function.k_invalidText ? k_function.k_invalidText : k_invalidText
});
k_extWidget.validator = function(k_value) {
var k_res;
if(k_value.length < 1 || k_value === this.emptyText){ if(this.allowBlank){
this.clearInvalid();
return true;
}
this.markInvalid(this.blankText);
return false;
}
k_res = this._kx.k_validatorFunction.call(kerio.lib.k_inputValidator, k_value);
return true !== k_res ? this._kx.k_validatorInvalidText || '' : true;
};
},

k_setAllowBlank: function(k_allowBlank) {
if (!Ext.isBoolean(k_allowBlank)) {
kerio.lib.k_warn('K_TextField.k_setBlankValidator: k_allowBlank param has to be a boolean! Widget ID: ' + this.k_id);
return;
}
this.k_extWidget.allowBlank = k_allowBlank;
},

_k_initValidation: function() {
var k_extWidget = this.k_extWidget;
if (!k_extWidget.rendered) {
return;
}
k_extWidget.on('blur', this._k_preventMarkOnBlur, this);
k_extWidget.getEl().on(kerio.lib._k_getKeyEventName(), this._k_preventMarkOnKeyPress, this);
},

_k_doAfterRender: function () {
var
k_extWidget = this.k_extWidget,
k_element = k_extWidget.getEl(),
k_config = this._k_storedConfig;
this._k_initValidation();
k_extWidget.mon(k_element, {
'keyup'   : this._k_onChangeHandler,
'blur'    : this._k_onChangeHandler,
'mouseout': this._k_onMouseInputHandler,
'paste'   : this._k_onPasteHandler,
scope: this
});
if (this._k_checkMaxLength) {
k_extWidget.mon(k_element, 'keypress', this._k_maxLengthValidation, this);
}
if (k_config.k_onKeyDown) {
this.k_onKeyDown = k_config.k_onKeyDown;
k_extWidget.mon(k_element, 'keydown', this._k_onKeyDownHandler, this);
}
if (k_config.k_onKeyPress) {
this.k_onKeyPress = k_config.k_onKeyPress;
k_extWidget.mon(k_element, kerio.lib._k_getKeyEventName(), this._k_onKeyPressHandler, this);
}
if (k_config.k_onKeyUp) {
this.k_onKeyUp = k_config.k_onKeyUp;
k_extWidget.mon(k_element, 'keyup', this._k_onKeyUpHandler, this);
}
if (Ext.isIE) { this.k_extWidget.el.dom.attachEvent('onkeydown', function(){return !(window.event.keyCode === 27);});
}
},

_k_onKeyUpHandler: function(k_event) {
this.k_onKeyUp(this.k_parent || null, this, k_event);
},

_k_onMouseInputHandler: function() {
var k_extWidget = this.k_extWidget;
if (!this._k_isValueChanged()) {
return;
}
if (k_extWidget.hasFocus) {
k_extWidget.preventMark = false;
this._k_validateValue();
this._k_onChangeHandler(k_extWidget);
}
},

_k_onPasteHandler: function () {
this._k_onMouseInputHandler.defer(1, this);
},

_k_onKeyPressHandler: function(k_event) {
this.k_onKeyPress(this.k_parent || null, this, k_event);
},

_k_onKeyDownHandler: function(k_event) {
this.k_onKeyDown(this.k_parent || null, this, k_event);
},

_k_applyMaxLength: function(k_apply) {
var
k_extWidget = this.k_extWidget,
k_extEvent = Ext.EventObject,
k_element;
k_apply = false !== k_apply;
if (k_extWidget.rendered) {
k_element = k_extWidget.getEl();
if (kerio.lib.k_isWebKit && k_extWidget.emptyText) {
if(k_element.dom.value == k_extWidget.emptyText){
k_extWidget.setRawValue('');
}
k_element.removeClass(k_extWidget.emptyClass);
}
if (k_apply) {
k_element.dom.maxLength = this._k_maxLength;
}
else {
k_element.dom.removeAttribute('maxLength');
}
}
},

_k_removeMaxLength: function() {
this._k_applyMaxLength(false);
},

k_markInvalid: function(k_invalid, k_invalidMessage) {
kerio.lib._k_addKerioProperty(this.k_extWidget, {_k_isMarkedInvalid: k_invalid});
this._k_markInvalid(k_invalid, k_invalidMessage);
},

_k_markInvalid: function(k_invalid, k_invalidMessage) {
var
k_extWidget = this.k_extWidget,
k_origPreventMark;
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
k_invalid = (undefined === k_invalid) ? true : k_invalid;
k_origPreventMark = k_extWidget.preventMark;

k_extWidget.preventMark = false;
if (k_invalid) {
k_extWidget.markInvalid(k_invalidMessage);
}
else {
k_extWidget.clearInvalid();
}
k_extWidget.preventMark = k_origPreventMark; },

k_setInvalidText: function(k_text) {
var k_extWidget = this.k_extWidget;
k_extWidget._kx.k_validatorInvalidText = k_text;
k_extWidget.invalidText = k_text;
if (k_extWidget.rendered && (k_extWidget.getEl().dom.qtip && ('' !== k_extWidget.getEl().dom.qtip))) {
k_extWidget.getEl().dom.qtip = k_text;
}
},

_k_setDisabledItem: function (k_disabled) {
var k_extWidget = this.k_extWidget;
k_disabled = (false !== k_disabled);
kerio.lib.K_TextField.superclass._k_setDisabledItem.call(this, k_disabled);

if (true === k_extWidget.rendered) {
if (k_disabled) {
this._k_markInvalid(false);
}
else {
this._k_validateValue();
}
}
},

_k_validateValue: function () {
var k_extWidget = this.k_extWidget;
k_extWidget.validateValue(k_extWidget.processValue(k_extWidget.getRawValue()));
},

k_reset: function () {
var k_extWidget = this.k_extWidget;
kerio.lib.K_TextField.superclass.k_reset.call(this);
k_extWidget.preventMark = false;
k_extWidget.clearInvalid();
k_extWidget.preventMark = true;
this._k_initValidation();
if (k_extWidget.initialConfig.emptyText !== k_extWidget.emptyText) {
this.k_setEmptyText(k_extWidget.initialConfig.emptyText);
}
},

_k_maxLengthValidation: function(k_extEvent) {
var
k_maxLength = this._k_maxLength,
k_charCode = k_extEvent.charCode,
k_getLen,
k_oldValue,
k_target,
k_forceAscii,
k_selLength,
k_newLength;
if (0 === k_charCode || k_extEvent.isSpecialKey() || !k_maxLength) {
return;
}
k_getLen = kerio.lib.k_getLengthInBytes;
k_oldValue = String(this.k_getValue());
k_target = k_extEvent.getTarget();
k_forceAscii = !this._k_checkByteLength;
k_selLength = k_getLen( k_oldValue.slice(k_target.selectionStart, k_target.selectionEnd), k_forceAscii );
k_newLength = k_getLen(k_oldValue, k_forceAscii) + k_getLen(String.fromCharCode(k_charCode), k_forceAscii) - k_selLength;
if (k_maxLength < k_newLength) {
k_extEvent.stopEvent();
}
},

_k_onChangeHandler: function (k_extWidget) {
var
k_newValue = this.k_getValue(),
k_maxLength = this._k_maxLength;
if (this._k_checkMaxLength && k_maxLength < kerio.lib.k_getLengthInBytes(k_newValue, !this._k_checkByteLength)) {
if (this._k_checkByteLength) {
this.k_setValue(kerio.lib.k_sliceInBytes(k_newValue, 0, k_maxLength));
}
else {
this.k_setValue(k_newValue.substr(0, k_maxLength));
}
}
kerio.lib.K_TextField.superclass._k_onChangeHandler.call(this, k_extWidget);
},

_k_registerSearchField: function () {
this.k_getMainWidget().k_addReferences({_k_searchField: this});
},

k_getSelectedText: function () {
if (!this.k_extWidget.rendered) {
return '';
}
var
k_elementDom = this.k_extWidget.getEl().dom,
k_selectedText = '',
k_range,
k_selection;
if (Ext.isIE){
k_range = document.selection.createRange();
if (k_range.parentElement() === k_elementDom) {
k_selection = k_elementDom.createTextRange();
k_selectedText = k_selection.text;
}
}
else { if (k_elementDom.selectionEnd > k_elementDom.selectionStart){
k_selectedText = k_elementDom.value.substr(k_elementDom.selectionStart, k_elementDom.selectionEnd - k_elementDom.selectionStart);
}
}
return k_selectedText;
}
});

Ext.form.TextField.prototype._kxp = {
_k_validate: Ext.form.TextField.prototype.validate,
_k_preFocus: Ext.form.TextField.prototype.preFocus
};

Ext.form.TextField.prototype.validate = function() {
if (this._kx && (true !== this._kx._k_isMarkedInvalid)) {
this._kxp._k_validate.call(this);
}
}; 
Ext.form.TextField.prototype.preFocus = function () {
if (!this._kx || !this._kx.k_owner.k_isReadOnly()) {
this._kxp._k_preFocus.call(this);
}
};
if (kerio.lib.k_isFirefox) {
Ext.Element.prototype.unmask = Ext.Element.prototype.unmask.createSequence(function() {
var
k_activeElement,
k_activeWidget,  k_activeExtWidget,
k_str;
try {
k_activeElement = document.activeElement;
}
catch (k_ex) {
return;  }
if (!k_activeElement) {
return;
}
k_str = window.HTMLElement.prototype.toString.call(k_activeElement);
if(k_str === '[xpconnect wrapped native prototype]' || k_str === '[object XULElement]'){
return;
}
if (k_activeElement.tagName && 'input' === k_activeElement.tagName.toLowerCase()) {
k_activeExtWidget = Ext.getCmp(k_activeElement.id) || {};
if (k_activeExtWidget._kx) {
k_activeWidget = k_activeExtWidget._kx.k_owner || null;
}
if (k_activeWidget instanceof kerio.lib._K_FormItem && true === k_activeExtWidget.selectOnFocus) {
if (this.id && Ext.get(k_activeElement).findParent('[id=' + this.id + ']')) {
k_activeElement.select();
}
}
}
});
}


kerio.lib.K_EmailField = function(k_id, k_config) {
kerio.lib.K_EmailField.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_EmailField, kerio.lib.K_TextField,
{





_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib.K_TextField, {
inputType: kerio.lib.k_isIPadCompatible ? 'email' : 'text'
}),
_k_defaultCaption: 'Email:', _k_defaultInvalidMessage: 'Enter a valid email address.', 
_k_prepareConfig: function(k_config) {
var
k_lib = kerio.lib,
k_inputValidator,
k_validatorCfg;
k_config.k_maxLength = k_config.k_maxLength || 195;
k_validatorCfg = k_config.k_validator || {};
if (undefined === k_config.k_caption && true !== k_config.k_isLabelHidden) {
k_config.k_caption = this._k_defaultCaption;
}
if (!k_validatorCfg.k_functionName && !k_validatorCfg.k_regExp) {
k_inputValidator = k_lib.k_inputValidator;
if (!k_inputValidator._k_validationFunctions.k_weblibEmailValidator) {
k_inputValidator.k_registerFunctions({

k_weblibEmailValidator: {
k_function: k_inputValidator.k_getRegExpValidator(k_lib.k_getSharedConstants('kerio_web_EmailRegExp')),
k_invalidText: Ext.isDefined(this.k_invalidText) ? this.k_invalidText : this._k_defaultInvalidMessage
}
});
}
k_validatorCfg = Ext.apply(k_validatorCfg, {
k_functionName: 'k_weblibEmailValidator'
});
}
k_config.k_validator = k_validatorCfg;
return kerio.lib.K_EmailField.superclass._k_prepareConfig.call(this, k_config);
}
});


kerio.lib.K_NumberField = function(k_id, k_config) {
kerio.lib.K_NumberField.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_NumberField, kerio.lib.K_TextField,
{






_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib.K_TextField, {
k_allowDecimals:    'allowDecimals',
k_decimalPrecision: 'decimalPrecision',
k_allowNegative:    'allowNegative',
k_maxValue:         'maxValue',
k_minValue:         'minValue'
}),

_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib.K_TextField, {
allowNegative: false,
allowDecimals: false,
inputType: kerio.lib.k_isIPadCompatible ? 'number' : 'text' }),

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = new Ext.form.NumberField(k_adaptedConfig);
return k_extWidget;
},

k_getValue: function () {
var k_value = kerio.lib.K_NumberField.superclass.k_getValue.call(this);
return '' === k_value ? 0 : k_value
}
});


kerio.lib._K_TriggerField = function(k_id, k_config) {
kerio.lib._K_TriggerField.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib._K_TriggerField, kerio.lib.K_TextField,
{
});


kerio.lib.K_MultiTriggerField = function(k_id, k_config) {
this._k_setStoredProperties(['k_triggers', 'k_defaultTrigger', 'k_isFocusedByTrigger']);
this._k_triggerOnClickHandlers = {};
kerio.lib.K_MultiTriggerField.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_MultiTriggerField, kerio.lib._K_TriggerField,
{



_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib._K_TriggerField, {
k_triggers: 'triggers',
k_title: 'title',
k_toggle: 'toggle',
k_isPressed: 'isPressed',
k_groupId: 'groupId'
}),

_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib._K_TriggerField, {
isPressed: false
}),

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_extWidget,
k_trigger,
k_triggerId,
k_triggers = k_storedConfig.k_triggers,
k_triggerOnClickHandlers = this._k_triggerOnClickHandlers,
k_lib = kerio.lib;
for (var k_i = 0, k_cnt = k_triggers.length; k_i < k_cnt; k_i++) {
k_trigger = k_triggers[k_i];
k_trigger.k_onClick = k_trigger.k_onClick || Ext.emptyFn;
k_triggerId = k_trigger.k_id;
if (undefined === k_triggerId) {
k_triggerId = k_lib.k_getGeneratedId();
k_triggers[k_i].k_id = k_triggerId;
}
k_triggerOnClickHandlers[k_triggerId] = k_trigger.k_onClick;
}
this._k_defaultTriggerId = k_storedConfig.k_defaultTrigger || k_triggers[0].k_id;
k_extWidget = new kerio.lib._K_MultiTriggerField(k_adaptedConfig);
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
kerio.lib.K_MultiTriggerField.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
this.k_extWidget.on({
'triggerclick': this._k_onTriggerClick,
'specialkey': this._k_onSpecialKeyHandler,
scope: this
});
},

_k_doAfterRender: function () {
kerio.lib.K_MultiTriggerField.superclass._k_doAfterRender.call(this);
this._k_initProgerssEl();
},

_k_onTriggerClick: function (k_extMultiTriggerField, k_triggerEl) {
var k_triggerId = k_triggerEl._kx.k_id;
this._k_triggerOnClickHandlers[k_triggerId].call(this, this.k_parent || null, this, k_triggerId);
},

_k_getTriggerEl: function (k_triggerId) {
return this.k_extWidget.getTrigger(k_triggerId);
},

_k_onSpecialKeyHandler: function (k_extTriggerField, k_extEvent) {
if (Ext.EventObject.ENTER === k_extEvent.getKey()) {
this._k_onTriggerClick(k_extTriggerField, this._k_getTriggerEl(this._k_defaultTriggerId), k_extEvent);
}
},

k_setVisibleTrigger: function (k_triggerId, k_visible) {
var
k_i,
k_cnt,
k_trigegrEl,
k_element,
k_width;
if (!Ext.isArray(k_triggerId)) {
k_triggerId = [k_triggerId];
}
for (k_i = 0, k_cnt = k_triggerId.length; k_i < k_cnt; k_i++) {
k_trigegrEl = this._k_getTriggerEl(k_triggerId[k_i]);
if (false !== k_visible) {
k_trigegrEl.show();
}
else {
k_trigegrEl.hide();
}
}
if (this.k_isInProgress()) {
k_element = this.k_extWidget.getEl();
k_width = k_element.getWidth() - k_element.getBorderWidth('lr');
this._k_fieldProgressTextEl.setWidth(k_width);
this._k_fieldProgressEl.setWidth(k_width);
}
},

k_isVisibleTrigger: function (k_triggerId) {
var k_trigegrEl = this._k_getTriggerEl(k_triggerId);
return k_trigegrEl.isDisplayed();
},

k_isTriggerPressed: function(k_triggerId) {
return (true === this.k_extWidget.getTrigger(k_triggerId)._kx.k_isPressed);
},

_k_initProgerssEl: function () {
var
k_size,
k_extWidget = this.k_extWidget,
k_extWidgetEl = k_extWidget.getEl(),
k_width = k_extWidgetEl.getWidth(),
k_height = k_extWidgetEl.getHeight(),
k_lBorder = k_extWidgetEl.getBorderWidth('l'),
k_tBorder = k_extWidgetEl.getBorderWidth('t'),
k_progressEl = this._k_fieldProgressEl,
k_textEl = this._k_fieldProgressTextEl;
if (!k_progressEl) {
k_progressEl = k_extWidgetEl.parent().createChild({
tag: 'div',
style: 'border: none; position: absolute; z-index: 950; background: transparent'
}, k_extWidgetEl);
this._k_progressBarEl = k_progressEl.createChild({
tag: 'div',
cls: 'formFieldProgress'
});
k_textEl = k_extWidgetEl.parent().createChild({
tag: 'input',
type: 'text',
cls: 'x-form-field x-form-text',
style: 'border: none; position: absolute; z-index: 1000; background: transparent;'
}, k_extWidgetEl);
this._k_fieldProgressEl = k_progressEl;
this._k_fieldProgressTextEl = k_textEl;
k_extWidget.on('resize', this._k_initProgerssEl, this);
}
k_size = {
width: k_width - k_lBorder - k_extWidgetEl.getBorderWidth('r'),
height: k_height - k_tBorder - k_extWidgetEl.getBorderWidth('b')
};
k_progressEl.setSize(k_size);
k_textEl.setSize(k_size);
k_progressEl.setTop(k_tBorder + 'px');
k_progressEl.setLeft(k_lBorder + 'px');
k_textEl.setTop(k_tBorder + 'px');
k_textEl.setLeft(k_lBorder + 'px');
k_textEl.on('keyup', function () {
this.k_setValue(this._k_fieldProgressTextEl.dom.value);
}, this);
k_textEl.on('focus', function () {
this.k_extWidget.focus();
}, this);
if (Ext.isIE) {
k_textEl.setStyle('padding-top', '2px');
}
this._k_setProgressVisible(false);
},

_k_setProgressVisible: function (k_visible) {
k_visible = (false !== k_visible);
if (k_visible) { this.k_extWidget.getEl().setStyle('color', 'white');
}
else {
this.k_extWidget.getEl().setStyle('color', '');
}
this._k_fieldProgressEl.setDisplayed(k_visible);
this._k_fieldProgressTextEl.setDisplayed(k_visible);
},

k_startProgress: function () {
if (true === this._k_isProgressStarted) {
this.k_stopProgress();
}
this._k_initProgerssEl();
this._k_progressBarEl.setWidth(0);
this._k_fieldProgressTextEl.dom.value = this.k_extWidget.getEl().getValue();
this._k_setProgressVisible(true);
this._k_isProgressStarted = true;
},

k_setProgressValueInPerc: function (k_value) {
if (k_value > 100) {
k_value = 100;
}
this._k_progressBarEl.setWidth(k_value + '%');
},

k_doProgress: function (k_value, k_maxValue) {
var k_progressValue = Math.floor(k_value * 100 / k_maxValue);
if (true !== this._k_isProgressStarted) {
this.k_startProgress();
}
this.k_setProgressValueInPerc(k_progressValue);
if (k_value > 100) {
this.k_stopProgress();
}
},

k_stopProgress: function () {
if (true === this._k_isProgressStarted) {
this._k_setProgressVisible(false);
this._k_isProgressStarted = false;
}
},
k_isInProgress: function () {
return (true === this._k_isProgressStarted);
}
});


kerio.lib._K_MultiTriggerField = function (k_config) {
kerio.lib._k_addKerioProperty(this, {
k_elementIdToTriggerIdMap: {}
});
kerio.lib._K_MultiTriggerField.superclass.constructor.call(this, k_config);
};

Ext.extend(kerio.lib._K_MultiTriggerField, Ext.form.TriggerField,
{

initComponent : function(){
var
k_triggerConfig,
k_i,
k_trigger,
k_triggerId,
k_triggerHtmlCfg,
k_blankImage = Ext.BLANK_IMAGE_URL,
k_triggers = this.initialConfig.triggers,
k_cnt = k_triggers.length,
k_lib = kerio.lib,
k_initiallyHiddneTriggers = {},
k_toggleTriggers = {};
k_lib._K_MultiTriggerField.superclass.initComponent.call(this);
k_triggerConfig = {tag:'span', cls:'multiTrigger', cn:[]};
for (k_i = 0; k_i < k_cnt; k_i++) {
k_trigger = k_triggers[k_i];
k_triggerId = k_trigger.id;
k_triggerHtmlCfg = {
id: this.id + '_' + k_triggerId,
tag: 'img',
src: k_blankImage,
cls: 'x-form-trigger ' + k_trigger.cls
};
this._kx.k_elementIdToTriggerIdMap[this.id + '_' + k_triggerId] = k_triggerId;
if (undefined !== k_trigger.title) {
k_triggerHtmlCfg.qtip = k_trigger.title;
}
k_triggerConfig.cn.push(k_triggerHtmlCfg);
if (true === k_trigger.hidden) {
k_initiallyHiddneTriggers[k_triggerId] = true;
}
if (undefined !== k_trigger.toggle) {
k_toggleTriggers[k_triggerId] = {
k_isPressed: (true === k_trigger.toggle.isPressed),
k_groupId: k_trigger.toggle.groupId
};
}
}
kerio.lib._k_addKerioProperty(this, {
k_initiallyHiddneTriggers: k_initiallyHiddneTriggers,
k_toggleTriggers: k_toggleTriggers
});
this.triggerConfig = k_triggerConfig;
},

getTrigger : function(k_index){
return this._kx.k_triggersCollection.get(k_index);
},

initTrigger : function(){
var
k_i,
k_cnt,
k_triggerEl,
k_triggerId,
k_triggers = this.trigger.select('.x-form-trigger', true).elements,
k_initiallyHiddneTriggers = this._kx.k_initiallyHiddneTriggers,
k_toggleTriggers = this._kx.k_toggleTriggers,
k_triggersCollection = new Ext.util.MixedCollection(false, function (k_item) {return k_item._kx.k_id;}),
k_lib = kerio.lib;
if (!Ext.isIE) { this.el.getWidth = Ext.Element.prototype.getComputedWidth;
}
k_lib._k_addKerioProperty(this.trigger, {k_triggerField: this});
this.wrap.addClass('multiTriggerField');
for (k_i = 0, k_cnt = k_triggers.length; k_i < k_cnt; k_i++) {
k_triggerEl = k_triggers[k_i];
k_triggerId = this._kx.k_elementIdToTriggerIdMap[k_triggerEl.id];
k_lib._k_addKerioProperty(k_triggerEl, {
k_triggerField: this,
k_id: k_triggerId
});
k_triggerEl.hide = this._kxp.k_hideTrigger;
k_triggerEl.show = this._kxp.k_showTrigger;
if (true === k_initiallyHiddneTriggers[k_triggerId]) {
k_triggerEl.setDisplayed(false);
}
if (undefined !== k_toggleTriggers[k_triggerId]) {
k_lib._k_addKerioProperty(k_triggerEl, {
k_isToggle: true,
k_isPressed: k_toggleTriggers[k_triggerId].k_isPressed,
k_toggleGroupId: k_toggleTriggers[k_triggerId].k_groupId
});
if (k_triggerEl._kx.k_isPressed) {
k_triggerEl.addClass('triggerPressed');
}
k_triggerEl.on('mousedown', this._kxp.k_onTriggerToggle, this);
}
k_triggerEl.on('click', this._kxp.k_onTriggerClick, this, {preventDefault:true});
k_triggerEl.addClassOnOver('x-form-trigger-over');
k_triggerEl.addClassOnClick('x-form-trigger-click');
}
delete this._kx.k_initiallyHiddneTriggers;
delete this._kx.k_toggleTriggers;
k_triggersCollection.addAll(k_triggers);
k_lib._k_addKerioProperty(this, {k_triggersCollection: k_triggersCollection});
k_lib._k_addKerioProperty(this.trigger, {k_triggersCollection: k_triggersCollection});
},

getTriggerWidth: function () {
var
k_triggers = this._kx ? this._kx.k_triggersCollection : null,
k_triggerWidth = 0,
k_triggerEl,
k_i, k_cnt;
if (!k_triggers) {
return 0;
}
for (k_i = 0, k_cnt = k_triggers.getCount(); k_i < k_cnt; k_i++) {
k_triggerEl = k_triggers.get(k_i);
if ('none' !== k_triggerEl.getStyle('display')) {
k_triggerWidth += k_triggerEl.getComputedWidth();
}
}
return k_triggerWidth;
}
});

kerio.lib._K_MultiTriggerField.prototype._kxp = Ext.apply({}, kerio.lib._K_MultiTriggerField.prototype._kxp, {

k_onTriggerToggle: function (k_extEvent) {
this._kxp.k_doTriggerToggle.call(this, this._kxp.k_getTriggerElFromEvent.call(this, k_extEvent));
},

k_doTriggerToggle: function (k_triggerEl) {
var
k_toggleTrigger,
k_i,
k_togglerTriggers = this._kx.k_triggersCollection,
k_triggersCount = k_togglerTriggers.getCount(),
k_isPressed = k_triggerEl._kx ? k_triggerEl._kx.k_isPressed : false,
k_groupId = k_triggerEl._kx ? k_triggerEl._kx.k_toggleGroupId : null;
if (k_groupId) {
if (k_isPressed) {
return;
}
for (k_i = 0; k_i < k_triggersCount; k_i++) {
k_toggleTrigger = k_togglerTriggers.get(k_i);
if ((k_toggleTrigger._kx.k_toggleGroupId == k_groupId) && k_toggleTrigger._kx.k_isPressed) {
k_toggleTrigger.removeClass('triggerPressed');
k_toggleTrigger._kx.k_isPressed = false;
break;
}
}
}
if (k_isPressed) {
k_triggerEl.removeClass('triggerPressed');
}
else {
k_triggerEl.addClass('triggerPressed');
}
k_triggerEl._kx.k_isPressed = !k_isPressed;
},

k_onTriggerClick: function (k_extEvent) {
var k_triggerEl = this._kxp.k_getTriggerElFromEvent.call(this, k_extEvent);
if (false !== this._kx.k_owner._k_storedConfig.k_isFocusedByTrigger) {
this.el.focus();
}
this.fireEvent('triggerclick', this, k_triggerEl);
},

k_getTriggerElFromEvent: function (k_extEvent) {
return this.getTrigger(this._kx.k_elementIdToTriggerIdMap[k_extEvent.getTarget().id]);
},

k_hideTrigger: function () {
var k_triggerField = this._kx.k_triggerField;
k_triggerField._kxp.k_setVisibleTrigger.call(k_triggerField, this, false);
},

k_showTrigger: function () {
var k_triggerField = this._kx.k_triggerField;
k_triggerField._kxp.k_setVisibleTrigger.call(k_triggerField, this, true);
},

k_setVisibleTrigger: function (k_triggerEl, k_visible) {
var k_wrapWidth = this.wrap.getWidth();
k_triggerEl.setDisplayed(k_visible);
this.el.setWidth(k_wrapWidth - this.getTriggerWidth());
}
});


kerio.lib.K_TextArea = function(k_id, k_config) {
this._k_setStoredProperties(['k_anchor', 'k_height']);
kerio.lib.K_TextArea.superclass.constructor.call(this, k_id, k_config);
this._k_checkMaxLength = true;  };
Ext.extend(kerio.lib.K_TextArea,  kerio.lib.K_TextField,
{



_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib.K_TextField, {
k_height: 'height',
k_minHeight: 'boxMinHeight'
}),

_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib.K_TextField, {
maxLength: kerio.lib.k_constants.k_TEXT_AREA_MAX_LENGTH,
style: 'overflow: auto; %+'
}),

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = new Ext.form.TextArea(k_adaptedConfig);
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_isBottomAnchorDefined = false,
k_bottomAnchor;
kerio.lib.K_TextArea.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
if (k_storedConfig.k_anchor) {
k_bottomAnchor = k_storedConfig.k_anchor.split(' ')[1];
k_isBottomAnchorDefined = (undefined !== k_bottomAnchor) && ('' !== k_bottomAnchor); }
if ((undefined === k_storedConfig.k_height) && !k_isBottomAnchorDefined) {
this.k_extWidget.on('render', this._k_adjustAnchor, this);
}
},

_k_adjustAnchor: kerio.lib.K_FormContainer.prototype._k_adjustAnchor,

_k_updateBottomAnchor: kerio.lib.K_FormContainer.prototype._k_updateBottomAnchor
});


kerio.lib.K_HtmlEditor = function(k_id, k_config) {
this._k_setStoredProperties(['k_controls']);
kerio.lib.K_HtmlEditor.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_HtmlEditor,  kerio.lib.K_TextArea,
{













_k_isHtmlReadOnly: false,

_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib.K_TextArea, {
k_height: 'height'
}), 
_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib.K_TextArea, {
enableAlignments: true,
enableColors: true,
enableFont: true,
enableFontSize: true,
enableFormat: true,
enableLinks: true,
enableLists: true,
enableSourceEdit: false
}),

_k_controlNamesList: [
'k_alignment',
'k_color',
'k_font',
'k_fontSize',
'k_format',
'k_link',
'k_list',
'k_sourceEdit'
],

_k_beforeInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_controls = k_storedConfig.k_controls,
k_controlNamesList = this._k_controlNamesList,
k_cnt, k_i,
k_buttonName,
k_isButtonDefined;
this._k_removeStoredProperties(['k_controls']);
if (!k_controls) {
return;
}
for (k_i = 0, k_cnt = k_controlNamesList.length; k_i < k_cnt; k_i++) {
k_buttonName = k_controlNamesList[k_i];
k_isButtonDefined = -1 !== k_controls.indexOf(k_buttonName);
switch (k_buttonName) {
case 'k_alignment':
k_adaptedConfig.enableAlignments = k_isButtonDefined;
break;
case 'k_color':
k_adaptedConfig.enableColors = k_isButtonDefined;
break;
case 'k_font':
k_adaptedConfig.enableFont = k_isButtonDefined;
break;
case 'k_fontSize':
k_adaptedConfig.enableFontSize = k_isButtonDefined;
break;
case 'k_format':
k_adaptedConfig.enableFormat = k_isButtonDefined;
break;
case 'k_link':
k_adaptedConfig.enableLinks = k_isButtonDefined;
break;
case 'k_list':
k_adaptedConfig.enableLists = k_isButtonDefined;
break;
case 'k_sourceEdit':
k_adaptedConfig.enableSourceEdit = k_isButtonDefined;
break;
}
}
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = new Ext.form.HtmlEditor(k_adaptedConfig);
this._k_configureExtComponentAfterInit(k_extWidget, k_adaptedConfig, k_storedConfig);
return k_extWidget;
},

_k_configureExtComponentAfterInit: function(k_extWidget, k_adaptedConfig, k_storedConfig) {
if (kerio.lib.k_isMSIE9 || kerio.lib.k_isMSIE10) {
k_extWidget.iframePad = 0;
}
k_extWidget.on('initialize', function (k_extHtmlEditor) {
Ext.EventManager.on(k_extHtmlEditor.getDoc(), 'keyup', this._k_fireOnChange, this);
k_extHtmlEditor.getEditorBody().style.color = '';
}, this);
if (Ext.isGecko || Ext.isWebKit || kerio.lib.k_isMSIE9 || kerio.lib.k_isMSIE10) {  k_extWidget.on('initialize', function(k_editor){
Ext.get(k_editor.iframe).on('load', kerio.lib.k_isMSIE9 || kerio.lib.k_isMSIE10 || kerio.lib.k_isMSIE11 ? this._k_fixEditorOnLoadIe9 : this._k_fixEditorOnLoad, this);
}, this, {single: true});
}
k_extWidget.on('render', this._k_setClassToToolbar, this);
if (kerio.lib.k_isMSIE9 || kerio.lib.k_isMSIE10) {
this._k_fixOrphanedElements();
}
},

_k_fixEditorOnLoad: function () {
var k_extWidget = this.k_extWidget;
k_extWidget.initialized = false;
k_extWidget.activated = false;
k_extWidget.initFrame();
},

_k_fixEditorOnLoadIe9: function () {
if (this._k_isInitInProgress) {
return;
}
this._k_fixOrphanedElements();
this._k_isInitInProgress = true;
this._k_fixEditorOnLoad();
this._k_isInitInProgress = false;
},

_k_fixOrphanedElements: function(){
var
k_specialElCache = kerio.lib._extPublished['Ext.EventManager.specialElCache'],
k_i = 0,
k_obj;
while ((k_obj = k_specialElCache[k_i])) {
try {
if (k_obj.el.getElementById || k_obj.el.navigator) {
}
k_i++;
}
catch (k_e) {
k_specialElCache.splice(k_i, 1);
}
}
},

_k_setClassToToolbar: function () {
this.k_extWidget.getToolbar().addClass('flatToolbarButtons');
},

_k_adjustAnchor: function (k_extWidget) {
var k_anchor, k_anchorY;
kerio.lib.K_FormContainer.prototype._k_adjustAnchor.call(this, k_extWidget);
k_anchor = k_extWidget.anchor.split(' ');
k_anchorY = parseInt(k_anchor[1], 10);
k_anchorY -= k_extWidget.wrap.getBorderWidth('tb');
k_extWidget.anchor = k_anchor[0] + ' ' + k_anchorY; },

k_insertAtCursor: function (k_value) {
this.k_extWidget.insertAtCursor(k_value);
},

_k_setDesignMode: function (k_enableDesignMode) {
var
k_extWidget = this.k_extWidget,
k_content,
k_scope;
if (!k_extWidget.initialized) {
k_scope = {
k_htmlEditor: this,
k_enableDesignMode: k_enableDesignMode
};
k_extWidget.on('initialize', function(){
this.k_htmlEditor._k_setDesignMode(this.k_enableDesignMode);
}, k_scope);
return;
}
if (Ext.isIE) {
k_content = k_extWidget.getDoc().getElementsByTagName('html')[0].innerHTML;
}
k_extWidget.getDoc().designMode = false !== k_enableDesignMode ? 'on' : 'off';
if (Ext.isIE) {
k_extWidget.getDoc().open();
k_extWidget.getDoc().write('<html>' + k_content + '</html>');
k_extWidget.getDoc().close();
}
},

_k_setReadOnlyDeferred: function (k_readOnly) {
var
k_extWidget = this.k_extWidget,
k_toolbar,
k_extElement;
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
k_extElement = k_extWidget.wrap;
k_toolbar = k_extWidget.getToolbar();
k_readOnly = false !== k_readOnly;
this._k_setDesignMode(!k_readOnly);
if (k_readOnly) {
k_extElement.addClass('readonly');
k_toolbar.items.each(function(item){ item.disable(); });
}
else {
k_extElement.removeClass('readonly');
k_toolbar.items.each(function(item){ item.enable(); });
}
if (!k_extWidget.activated && k_readOnly) {
k_extWidget.on('activate', function () {
if (!this.k_isReadOnly()) {
return;
}
var k_toolbar = this.k_extWidget.getToolbar();
k_toolbar.items.each(function(item){ item.disable(); });
}, this);
}
},

_k_setDisabledDeferred: function (k_disable) {
var
k_extWidget = this.k_extWidget,
k_disabledClass = k_extWidget.disabledClass,
k_toolbar,
k_label,
k_extElement;
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
k_extElement = k_extWidget.wrap;
k_toolbar = k_extWidget.getToolbar();
k_disable = false !== k_disable;
k_label = Ext.get(k_extWidget.container.dom.previousSibling);
if (k_label && k_label.dom.htmlFor == k_extWidget.id) {
k_label[k_disable ? 'addClass' : 'removeClass'](k_disabledClass);
}
if (k_disable) {
k_extElement.addClass('disabled');
k_toolbar.items.each(function(item){ item.disable(); });
}
else {
k_extElement.removeClass('disabled');
k_toolbar.items.each(function(item){ item.enable(); });
}
this._k_addDisabledClassToEditorBody(k_disable);
if (!k_extWidget.activated && k_disable) {
k_extWidget.on('activate', function () {
if (!this.k_isDisabled()) {
return;
}
var k_toolbar = this.k_extWidget.getToolbar();
k_toolbar.items.each(function(item){ item.disable(); });
}, this);
}
},

_k_addDisabledClassToEditorBody: function (k_disable) {
var
k_extWidget = this.k_extWidget,
k_className;
if (!k_extWidget.initialized) {
k_extWidget.on('initialize', function () {
var k_widget = this._kx.k_owner;
k_widget._k_addDisabledClassToEditorBody(k_widget.k_isDisabled());
});
k_extWidget = null;
return;
}
k_className = k_extWidget.getEditorBody().className;
if (k_disable) {
if (-1 === k_className.indexOf('htmlEditorDisabledIframe')) {
k_className += ' htmlEditorDisabledIframe';
}
}
else {
k_className = k_className.replace('htmlEditorDisabledIframe', '');
}
k_extWidget.getEditorBody().className = k_className;
},

_k_fireOnChange: function () {
this._k_onChangeHandler(this.k_extWidget);
}
});

Ext.form.HtmlEditor.prototype._k_getDocMarkup = Ext.form.HtmlEditor.prototype.getDocMarkup;
Ext.form.HtmlEditor.prototype.getDocMarkup = function () {
var
k_markup = Ext.form.HtmlEditor.prototype._k_getDocMarkup.call(this),
k_part1,
k_part2;
k_part1 = k_markup.substring(0, k_markup.indexOf('<head>') + '<head>'.length);
k_part2 = k_markup.substring(k_part1.length);
k_markup = k_part1 + '<style type="text/css">.htmlEditorDisabledIframe, .htmlEditorDisabledIframe * {color: gray!important;}</style>' + k_part2;
return k_markup;
};


kerio.lib.K_SpinnerField = function(k_id, k_config) {
this._k_setStoredProperties(['k_width']);
kerio.lib.K_SpinnerField.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_SpinnerField, kerio.lib.K_NumberField,
{


_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib.K_NumberField, {
k_increment: 'incrementValue'
}),

_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib.K_NumberField, {
width: 60
}),

_k_beforeInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
kerio.lib.K_SpinnerField.superclass._k_beforeInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
if ('auto' !== k_storedConfig.k_width) {
delete k_adaptedConfig.anchor;
}
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = new kerio.lib._K_SpinnerField(k_adaptedConfig);
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
kerio.lib.K_SpinnerField.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
this.k_extWidget.on('spinchanged', this._k_onChangeHandler, this);
}
});

kerio.lib._K_SpinnerField = function (k_config) {
kerio.lib._K_SpinnerField.superclass.constructor.call(this, k_config);
this.addEvents({
'spinup' : true,
'spindown' : true
});
};
Ext.extend(kerio.lib._K_SpinnerField, Ext.form.NumberField,
{
defaultAutoCreate : {tag: "input", type: "text", size: "16", autocomplete: "off"},
autoSize: Ext.emptyFn,
monitorTab : true,
deferHeight : true,
mimicing : false,
triggerClass: 'spinnerTrigger',
splitterClass: 'spinnerSplitter',
fieldClass: 'x-form-field spinnerField',
defaultValue: 0,
incrementValue: 1,
editable: true,

onRender: function(ct, position){
kerio.lib._K_SpinnerField.superclass.onRender.call(this, ct, position);
Ext.form.TriggerField.prototype.onRender.call(this, ct, position);
var k_splitter = this.wrap.createChild({tag: 'div', cls: this.splitterClass, style: 'width:13px; height:2px;'});
k_splitter.setRight(2);
k_splitter.setTop(10);
this.splitter = k_splitter;
this._kxp.k_initSpinner.call(this);
},

onDestroy: function(){
if(this.trigger){
this.trigger.removeAllListeners();
this.trigger.remove();
}
if(this.wrap){
this.wrap.remove();
}
kerio.lib._K_SpinnerField.superclass.onDestroy.call(this);
},

onFocus: function(){
kerio.lib._K_SpinnerField.superclass.onFocus.call(this);
if(!this.mimicing){
this.wrap.addClass('x-trigger-wrap-focus');
this.mimicing = true;
Ext.get(Ext.isIE ? document.body : document).on("mousedown", this.mimicBlur, this, {delay: 10});
if(this.monitorTab){
this.el.on("keydown", this.checkTab, this);
}
}
},

checkTab : function(e){
if(e.getKey() === e.TAB){
this.triggerBlur();
}
},

mimicBlur: function(e){
if(!this.wrap.contains(e.target) && this.validateBlur(e)){
this.triggerBlur();
}
},

triggerBlur: function(){
this.mimicing = false;
Ext.get(Ext.isIE ? document.body : document).un("mousedown", this.mimicBlur);
if(this.monitorTab){
this.el.un("keydown", this.checkTab, this);
}
this.beforeBlur();
this.wrap.removeClass('x-trigger-wrap-focus');
kerio.lib._K_SpinnerField.superclass.onBlur.call(this);
},

validateBlur : function(e){
return true;
},

onDisable: function(){
kerio.lib._K_SpinnerField.superclass.onDisable.call(this);
if(this.wrap){
this.wrap.addClass('x-item-disabled');
}
},

onEnable: function(){
kerio.lib._K_SpinnerField.superclass.onEnable.call(this);
if(this.wrap){
this.wrap.removeClass('x-item-disabled');
}
},

initTrigger: function() {
Ext.form.TriggerField.prototype.initTrigger.call(this);
},
onTriggerClick: Ext.emptyFn,
onShow: Ext.form.TriggerField.prototype.onShow,
onHide: Ext.form.TriggerField.prototype.onHide,
onResize: Ext.form.TriggerField.prototype.onResize,
adjustSize: Ext.form.TriggerField.prototype.adjustSize,
getResizeEl: Ext.form.TriggerField.prototype.getResizeEl,
getPositionEl: Ext.form.TriggerField.prototype.getPositionEl,
alignErrorIcon: Ext.form.TriggerField.prototype.alignErrorIcon,
getTriggerWidth: Ext.form.TriggerField.prototype.getTriggerWidth,
autoSize: Ext.emptyFn
});

kerio.lib._K_SpinnerField.prototype._kxp = Ext.apply({}, kerio.lib._K_SpinnerField.prototype._kxp, {
_k_spinChangeDelay: 100, 
k_initSpinner: function(){
this.keyNav = new Ext.KeyNav(this.el, {
'up': function(k_event){
this._kxp.k_doSpin.call(this, false);
},
'down': function(k_event) {
this._kxp.k_doSpin.call(this, true);
},
scope: this
});
this._k_spinChangeTask = new Ext.util.DelayedTask(this._kxp._k_fireSpinChangeEvent, this);
var k_eventConfig = {preventDefault: true};
this.repeater = new Ext.util.ClickRepeater(this.trigger);
this.repeater.on('click', this._kxp.k_onTriggerClick, this, k_eventConfig);
var k_trigger = this.trigger;
k_trigger.on('mouseover', this._kxp.k_onMouseOver, this, k_eventConfig);
k_trigger.on('mouseout',  this._kxp.k_onMouseOut,  this, k_eventConfig);
k_trigger.on('mousemove', this._kxp.k_onMouseMove, this, k_eventConfig);
k_trigger.on('mousedown', this._kxp.k_onMouseDown, this, k_eventConfig);
k_trigger.on('mouseup',   this._kxp.k_onMouseUp,   this, k_eventConfig);
this.wrap.on('mousewheel',   this._kxp.k_handleMouseWheel, this);
},

_k_fireSpinChangeEvent: function () {
this.fireEvent('spinchanged', this, this.getValue());
},

k_onMouseOver: function(){
if(this.disabled){
return;
}
var k_middle = this._kxp.k_getMiddle.call(this);
this.__tmphcls = (Ext.EventObject.getPageY() < k_middle) ? 'spinnerOverup' : 'spinnerOverdown';
this.trigger.addClass(this.__tmphcls);
},

k_onMouseOut: function(){
this.trigger.removeClass(this.__tmphcls);
},

k_onMouseMove: function(){
if(this.disabled){
return;
}
var k_middle = this._kxp.k_getMiddle.call(this);
if( ((Ext.EventObject.getPageY() > k_middle) && 'spinnerOverup' === this.__tmphcls) ||
((Ext.EventObject.getPageY() < k_middle) && 'spinnerOverdown' === this.__tmphcls)){
}
},

k_onMouseDown: function(){
if(this.disabled){
return;
}
var k_middle = this._kxp.k_getMiddle.call(this);
this.__tmpccls = (Ext.EventObject.getPageY() < k_middle) ? 'spinnerClickup' : 'spinnerClickdown';
this.trigger.addClass(this.__tmpccls);
},

k_onMouseUp: function(){
this.trigger.removeClass(this.__tmpccls);
},

k_onTriggerClick: function(){
if (this.disabled || this.getEl().dom.readOnly) {
return;
}
var k_middle = this._kxp.k_getMiddle.call(this);
this._kxp.k_doSpin.call(this, Ext.EventObject.getPageY() > k_middle);
this._kx.k_owner._k_preventMarkOnBlur();
},

k_getMiddle: function(){
var k_top = this.trigger.getTop();
var k_height = this.trigger.getHeight();
var k_middle = k_top + (k_height / 2);
return k_middle;
},

k_handleMouseWheel : function(k_event){
if(this.disabled || this.getEl().dom.readOnly){
Ext.EventObject.preventDefault();	return;
}
var k_delta = k_event.getWheelDelta();
if (0 !== k_delta) {
k_event.stopEvent();
this._kxp.k_doSpin.call(this, k_delta < 0);
this._kx.k_owner._k_preventMarkOnBlur();
}
},

k_doSpin: function (k_down) {
var k_value = parseFloat(this.getValue());
var k_direction = (true === k_down) ? -1 : 1;
var k_increment = this.incrementValue;
k_value += (k_increment * k_direction);
k_value = isNaN(k_value) ? this.defaultValue : k_value;
k_value = this._kxp.k_fixBoundaries.call(this, k_value);
if (this.emptyText) {
this.el.removeClass(this.emptyClass);
}
this.setRawValue(k_value);
this.validate();
var k_eventName = (true === k_down) ? 'spindown' : 'spinup';
this.fireEvent(k_eventName, this, k_value);
this._k_spinChangeTask.delay(this._kxp._k_spinChangeDelay);
},

k_fixBoundaries: function(k_value){
if((undefined !== this.minValue) && k_value < this.minValue){
k_value = this.minValue;
}
if((undefined !== this.maxValue) && k_value > this.maxValue){
k_value = this.maxValue;
}
if ((false === this.allowNegative) && (k_value < 0)) {
k_value = 0;
}
return this._kxp.k_fixPrecision.call(this, k_value);
},

k_fixPrecision: function(k_value){
var k_nan = isNaN(k_value);
if(!this.allowDecimals || this.decimalPrecision == -1 || k_nan || !k_value){
return k_nan ? '' : k_value;
}
return parseFloat(parseFloat(k_value).toFixed(this.decimalPrecision));
}
});


kerio.lib.K_SimpleText = function(k_id, k_config) {
this._k_setStoredProperties([
'k_safeValue',
'k_value',
'k_caption',
'k_isLabelHidden'
]);
kerio.lib.K_SimpleText.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_SimpleText, kerio.lib._K_FormItem,
{






_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib._K_FormItem, {
k_width: 'width',
k_icon: 'k_icon',
k_iconPos: 'k_iconPos',
k_isAutoScroll: 'k_isAutoScroll',
k_height: 'height'
}),

_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib._K_FormItem, {
value: '',
k_icon: '',
k_iconPos: 'left top',
k_isAutoScroll: false,
selectOnFocus: false
}),

_k_beforeInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_value = '';
kerio.lib.K_SimpleText.superclass._k_beforeInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
if (k_storedConfig.k_safeValue) {
k_value = k_storedConfig.k_safeValue;
}
else if (k_storedConfig.k_value) {
k_value = Ext.util.Format.htmlEncode(k_storedConfig.k_value);
}
k_adaptedConfig.value = k_value;
if (!k_storedConfig.k_caption && (false !== k_storedConfig.k_isLabelHidden)) {
k_adaptedConfig.hideLabel = true;
}
delete k_storedConfig.k_safeValue;
delete k_storedConfig.k_value;
delete k_storedConfig.k_caption;
delete k_storedConfig.k_isLabelHidden;
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = new kerio.lib._K_SimpleText(k_adaptedConfig);
return k_extWidget;
},

k_setValue: function(k_value) {
this.k_safeSetValue(Ext.util.Format.htmlEncode(k_value));
},

k_safeSetValue: function(k_value) {
this.k_extWidget.setValue(k_value);
},

k_reset: function () {
this.k_safeSetValue(this.k_getInitialValue(true));
}
});

kerio.lib._K_SimpleText = function(k_config) {
if (undefined === k_config.width) {
k_config.autoWidth = true;
}
kerio.lib._k_addKerioProperty(this, {
k_icon:         k_config.k_icon,
k_iconPos:      k_config.k_iconPos,
k_isAutoScroll: k_config.k_isAutoScroll
});
delete k_config.k_icon;
delete k_config.k_iconPos;
delete k_config.k_isAutoScroll;
kerio.lib._K_SimpleText.superclass.constructor.call(this, k_config);
this.onFocus = Ext.emptyFn; };

Ext.extend(kerio.lib._K_SimpleText, Ext.form.Field, {

onRender: function(k_ct, k_position) {
var k_oDiv,
k_dom,
k_firstChild;
if (!this.el) {
this.el = k_ct.createChild({
tag: 'div',
cls: 'template-text'
});
if (this._kx.k_isAutoScroll) {
this.el.addClass('autoScroll');
}
k_oDiv = Ext.DomHelper.append(this.el, {tag: 'div'});
Ext.DomHelper.append(k_oDiv, {tag: 'div'});
var k_icon = this._kx.k_icon;
if ((undefined !== k_icon) && ('' !== k_icon)) {
k_oDiv.style.backgroundImage = 'url(' + k_icon + '.png?v=8629' + ')';
var k_iconPos = this._kx.k_iconPos;
k_oDiv.style.backgroundPosition = 'top ' + k_iconPos;
k_oDiv.className = 'template-text-icon-' + k_iconPos;
}
}
kerio.lib._K_SimpleText.superclass.onRender.call(this, k_ct, k_position);
},

onResize: function (k_adjWidth, k_adjHeight, k_rawWidth, k_rawHeight) {
var
k_el = this.getEl(),
k_contentEl = k_el.first();
kerio.lib._K_SimpleText.superclass.onResize.apply(this, arguments);
if ('number' === Ext.type(k_adjWidth)) {
k_contentEl.setWidth(k_adjWidth - k_el.getFrameWidth('lr'));
}
if ('number' === Ext.type(k_adjHeight)) {
k_contentEl.setHeight(k_adjHeight - k_el.getFrameWidth('tb'));
}
},

setValue: function(k_value) {
if (this.rendered){
this.el.dom.firstChild.innerHTML = k_value;
}
this.value = k_value;
var k_ownerCt = this.ownerCt,
k_ownerCtInitialConfigWidth;
if (k_ownerCt) {
k_ownerCtInitialConfigWidth = k_ownerCt.initialConfig.width;
if ('auto' === k_ownerCtInitialConfigWidth && k_ownerCt.ownerCt && k_ownerCt.ownerCt.layout instanceof Ext.layout.ColumnLayout) {
this._kxp.k_doAutoWidth.call(this);
}
}
},

onDisable: function () {
this.getActionEl().addClass(this.disabledClass);
},

getPositionEl: function () {
return this.el;
}
});
kerio.lib._K_SimpleText.prototype._kxp = Ext.apply({}, kerio.lib._K_SimpleText.prototype._kxp, {

k_doAutoWidth: function () {
var
k_width,
k_ownerCt;
if (!this.rendered) {
this.on('afterrender', this._kxp.k_doAutoWidth, this);
return;
}
k_ownerCt = this.ownerCt;
k_width = Ext.util.TextMetrics.measure(this.el.first(), this.value).width;
k_width += this.el.getFrameWidth('lr');
this.setWidth(k_width);
k_width += k_ownerCt.getFrameWidth('lr');
if (this._kx.k_owner._k_indent) {
k_width += this._kx.k_owner._k_indent * kerio.lib.k_constants.k_FORM_INDENT;
}
k_ownerCt.setWidth(k_width);
k_ownerCt.ownerCt.doLayout();
}
});


kerio.lib.K_TemplateText = function(k_id, k_config) {
this._k_setStoredProperties(['k_templateValues', 'k_safeTemplateValues']);
kerio.lib.K_TemplateText.superclass.constructor.call(this, k_id, k_config);  };
Ext.extend(kerio.lib.K_TemplateText, kerio.lib.K_SimpleText,
{





_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib.K_SimpleText, {
k_template: 'k_template',
k_templateValues: 'k_templateValues',
k_safeTemplateValues: 'k_safeTemplateValues',
k_templateClass: 'k_templateClass'
}),

_k_beforeInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
kerio.lib.K_TemplateText.superclass._k_beforeInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
k_adaptedConfig.k_templateValues = k_storedConfig.k_templateValues;
k_adaptedConfig.k_safeTemplateValues = k_storedConfig.k_safeTemplateValues;
delete k_storedConfig.k_templateValues;
delete k_storedConfig.k_safeTemplateValues;
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = new kerio.lib._K_TemplateText(k_adaptedConfig);
return k_extWidget;
},

k_setValue: function(k_values) {
for (var k_value in k_values) {
k_values[k_value] = kerio.lib.k_htmlEncode(k_values[k_value]);
}
this.k_safeSetValue(k_values);
},

k_safeSetValue: function(k_values) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
this.k_extWidget.setValue(k_values);
},

k_getValue: function() {
return this.k_extWidget.getValue();
},

k_reset: function () {
this.k_safeSetValue(this.k_getInitialValue());
},

k_getInitialValue: function () {
return this.k_extWidget.initialConfig._kx.k_templateValues;
}
});

kerio.lib._K_TemplateText = function(k_config) {
var
k_templateValues = {},
k_addKerioProperty = kerio.lib._k_addKerioProperty,
k_templateValuesCfg,
k_value;
delete k_config.k_value;
k_templateValuesCfg = k_config.k_templateValues;
for (k_value in k_templateValuesCfg) {
if ('function' === Ext.type(k_templateValuesCfg[k_value])) {
continue;
}
k_templateValues[k_value] = kerio.lib.k_htmlEncode(k_templateValuesCfg[k_value]);
}
k_templateValuesCfg = k_config.k_safeTemplateValues;
for (k_value in k_templateValuesCfg) {
if ('function' === Ext.type(k_templateValuesCfg[k_value])) {
continue;
}
k_templateValues[k_value] = k_templateValuesCfg[k_value];
}
k_addKerioProperty(this, {
k_template:       k_config.k_template,
k_templateClass:  k_config.k_templateClass,
k_templateValues: k_templateValues
});
delete k_config.k_template;
delete k_config.k_templateClass;
delete k_config.k_templateValues;
delete k_config.k_safeTemplateValues;
kerio.lib._K_TemplateText.superclass.constructor.call(this, k_config);
this.value = k_templateValues;
this.hiddenName = k_config.name;
k_addKerioProperty(this.initialConfig, {
k_templateValues: k_templateValues
});
};
Ext.extend(kerio.lib._K_TemplateText, kerio.lib._K_SimpleText, {

onRender: function(k_ct, k_position) {
var k_regExp = new RegExp('{(.*?)}', 'g');
if ('string' === typeof this._kx.k_templateClass) {
this._kx.k_template = this._kx.k_template.replace(k_regExp, '<span class="{cls:trim}">{$1}</span>');
this._kx.k_templateValues.cls = this._kx.k_templateClass;
}
this._kx.k_templateObject = new Ext.Template('<div>' + this._kx.k_template + '</div>');
kerio.lib._K_TemplateText.superclass.onRender.call(this, k_ct, k_position);
},

setValue: function(k_value) {
for (var k_property in this._kx.k_templateValues) {
if (undefined === k_value[k_property]) {
k_value[k_property] = this._kx.k_templateValues[k_property];
}
}
this._kx.k_templateObject.overwrite(this.el.dom.firstChild.firstChild, k_value);
this.value = k_value;
}
});


kerio.lib.K_DisplayField = function (k_id, k_config) {
this._k_setStoredProperties([
'k_isSecure',
'k_onLinkClick',
'k_icon',
'k_value',
'k_iconPos',
'k_templateClassName'
]);
kerio.lib.K_DisplayField.superclass.constructor.call(this, k_id, k_config);
if (true === k_config.k_forceWritable) {
this._k_setReadOnlyByContainer = Ext.emptyFn;
this.k_setReadOnly = Ext.emptyFn;
}
};
Ext.extend(kerio.lib.K_DisplayField, kerio.lib._K_FormItem, {













_k_templateClassNameRegExp: new RegExp('{(.*?)}', 'g'),

_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib._K_FormItem, {
k_width       : 'width',
k_height      : 'height',
k_template    : 'tpl',
k_isAutoScroll: 'autoScroll'
}),

_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib._K_FormItem, {
htmlEncode   : true,
selectOnFocus: false,
autoScroll   : false
}),

_k_beforeInitExtComponent: function (k_adaptedConfig, k_storedConfig) {
var k_removeProperties = ['k_isSecure'];
if (true === k_storedConfig.k_isSecure) {
k_adaptedConfig.htmlEncode = false;
}
if (!k_adaptedConfig.fieldLabel && false !== k_adaptedConfig.hideLabel) {
k_adaptedConfig.hideLabel = true;
}
if (undefined !== k_adaptedConfig.tpl) {
this._k_isTemplate = true;
if (k_storedConfig.k_templateClassName) {
k_adaptedConfig.tpl = k_adaptedConfig.tpl.replace(this._k_templateClassNameRegExp, '<span class="{cls:trim}">{$1}</span>');
}
this._k_setValueAfterInit = true;
delete k_adaptedConfig.value;
}
else {
k_adaptedConfig.value = k_storedConfig.k_value;
k_removeProperties.push('k_value');
}
this._k_removeStoredProperties(k_removeProperties);
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = new Ext.form.DisplayField(k_adaptedConfig);
return k_extWidget;
},

_k_afterInitExtComponent: function (k_adaptedConfig, k_storedConfig) {
if (undefined !== this._k_setValueAfterInit) {
this.k_setValue(k_storedConfig.k_value);
delete this._k_setValueAfterInit;
}
else if (k_storedConfig.k_onLinkClick) {
this._k_initOnLinkClick();
}
if (k_storedConfig.k_icon) {
this._k_initIcon();
}
},

_k_initOnLinkClick: function () {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var
k_extWidget = this.k_extWidget,
k_anchors = k_extWidget.getContentTarget().query('a'),
k_anchorId,
k_anchorName,
k_i, k_cnt, k_el;
this._k_anchors = {};
for (k_i = 0, k_cnt = k_anchors.length; k_i < k_cnt; k_i++) {
k_anchorName = Ext.isEmpty(k_anchors[k_i].id) ? Ext.id() : k_anchors[k_i].id;
k_anchorId = this.k_id + '_' + k_anchorName;
k_anchors[k_i].id = k_anchorId;
k_el = Ext.get(k_anchors[k_i]);
k_el.addClass(['link', 'textLink']);
this._k_anchors[k_anchorId] = {
k_element: k_el,
k_name: k_anchorName
};
k_extWidget.mon(k_el, 'click', this._k_onLinkClick, this);
}
},

_k_onLinkClick: function (k_extEvent, k_anchorDomEl) {
if (this.k_isDisabled() || this.k_isReadOnly()) {
return;
}
var k_anchorId = this._k_anchors[k_anchorDomEl.id].k_name;
this._k_storedConfig.k_onLinkClick.call(this, this.k_form || this.k_parent, this, k_anchorId);
},

_k_initIcon: function () {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var
k_el = this.k_extWidget.getContentTarget(),
k_iconPos = this._k_storedConfig.k_iconPos || 'left',
k_icon = this._k_storedConfig.k_icon;
if (-1 === k_icon.indexOf('?v=8629')) {
k_icon += '?v=8629';
}
k_el.addClass(['displayFieldIcon', k_iconPos]);
k_el.setStyle('background-image', 'url(' + k_icon + ')');
this._k_removeStoredProperties([
'k_icon',
'k_iconPos'
]);
},

k_setValue: function (k_value) {
if (this._k_isTemplate) {
this._k_setTemplateValues(k_value);
}
else {
kerio.lib.K_DisplayField.superclass.k_setValue.call(this, k_value);
this._k_doAutoWidth();
if (this._k_storedConfig.k_onLinkClick && this.k_extWidget.rendered) {
this._k_initOnLinkClick();
}
}
},

_k_setTemplateValues: function (k_values) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var
k_extWidget = this.k_extWidget,
k_value;
if (undefined === k_values) {
k_values = {};
}
k_values = Ext.applyIf(k_values, this._k_storedConfig.k_value);
if (false !== k_extWidget.htmlEncode) {
for (k_value in k_values) {
k_values[k_value] = kerio.lib.k_htmlEncode(k_values[k_value]);
}
}
if (this._k_storedConfig.k_templateClassName) {
k_values.cls = this._k_storedConfig.k_templateClassName;
}
k_extWidget.tpl[k_extWidget.tplWriteMode](k_extWidget.getContentTarget(), k_values);
if (this._k_storedConfig.k_onLinkClick) {
this._k_initOnLinkClick();
}
},

k_setSecureValue: function(k_value) {
var
k_extWidget = this.k_extWidget,
k_htmlEncode = k_extWidget.htmlEncode;
k_extWidget.htmlEncode = false;
this.k_setValue(k_value);
k_extWidget.htmlEncode = k_htmlEncode;
},

k_getValue: function () {
return '';
},

k_getInitialValue: function () {
var k_initialValue;
if (this._k_isTemplate) {
k_initialValue = this._k_storedConfig.k_value;
}
else {
k_initialValue = kerio.lib.K_DisplayField.superclass.k_getInitialValue.call(this, true);
}
return k_initialValue;
},

k_reset: function () {
if (this.k_extWidget.htmlEncode) {
this.k_setValue(this.k_getInitialValue());
}
else {
this.k_setSecureValue(this.k_getInitialValue());
}
},

_k_doAutoWidth: function() {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var
k_extWidget = this.k_extWidget,
k_ownerCt = k_extWidget.ownerCt,
k_el = k_extWidget.getEl(),
k_ownerCtInitialWidth,
k_width;
if (!k_ownerCt) {
return;
}
k_ownerCtInitialWidth = k_ownerCt.initialConfig.width;
if ('auto' === k_ownerCtInitialWidth && k_ownerCt.ownerCt && k_ownerCt.ownerCt.layout instanceof Ext.layout.ColumnLayout) {
k_width = Ext.util.TextMetrics.measure(k_el, this.k_extWidget.getValue()).width;
k_width += k_el.getFrameWidth('lr');
k_extWidget.setWidth(k_width);
k_width += k_ownerCt.getFrameWidth('lr');
if (this._k_indent) {
k_width += this._k_indent * kerio.lib.k_constants.k_FORM_INDENT;
}
k_ownerCt.setWidth(k_width);
k_ownerCt.ownerCt.doLayout();
}
},

k_forceSetEnabled: function () {
if (this.k_isDisabled()) {
this._k_isDisabled = false;
this._k_isDisabledByContainer = false;
this._k_setDisabledItem(false);
}
}
});


kerio.lib.K_DateField = function(k_id, k_config) {
this._k_setStoredProperties([
'k_minDate',
'k_maxDate',
'k_value',
'k_width'
]);
kerio.lib.K_DateField.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_DateField, kerio.lib._K_TriggerField,
{







_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib._K_TriggerField, {
k_dateFormat: 'format',
k_startDay: 'startDay',
k_minDate: 'minValue',
k_maxDate: 'maxValue'
}),

_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib._K_TriggerField, {
format: 'Y-m-d',
width: 100,
startDay: 1,
selectOnFocus: false,
editable: false
}),
_k_hasImpactOnContainer: true,

_k_beforeInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_minDate = k_storedConfig.k_minDate,
k_maxDate = k_storedConfig.k_maxDate,
k_isAutoWidth = ('auto' === k_storedConfig.k_width),
k_value = k_storedConfig.k_value,
k_dateFormat, k_date,
k_parseDate = Date.parseDate;
if (k_isAutoWidth) {
delete k_adaptedConfig.width;
}
k_dateFormat = k_adaptedConfig.format;
if (k_value) {
k_date = k_parseDate(k_value, k_dateFormat);
if (!Ext.isDate(k_date)) {
k_date = k_parseDate(k_value, 'U');
}
k_adaptedConfig.value = k_parseDate(k_date.format(k_dateFormat), k_dateFormat);
}
if (k_minDate && !Ext.isDate(k_minDate)) {
k_date = k_parseDate(k_minDate, k_dateFormat);
if (!Ext.isDate(k_date)) {
k_date = k_parseDate(k_minDate, 'U');
}
k_adaptedConfig.minValue = k_parseDate(k_date.format(k_dateFormat), k_dateFormat);
}
if (!k_maxDate) {
k_maxDate = 2145826800; }
if (!Ext.isDate(k_maxDate)) {
k_date = k_parseDate(k_maxDate, k_dateFormat);
if (!Ext.isDate(k_date)) {
k_date = k_parseDate(k_maxDate, 'U');
}
k_adaptedConfig.maxValue = k_parseDate(k_date.format(k_dateFormat), k_dateFormat);
}
if (!k_isAutoWidth) {
delete k_adaptedConfig.anchor;
}
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = new Ext.form.DateField(k_adaptedConfig);
if (k_extWidget.initialConfig.value) {
this._k_configValue = k_extWidget.initialConfig.value.format('U');
}
return k_extWidget;
},

_k_setDisabledItem: function(k_disabled) {
kerio.lib.K_DateField.superclass._k_setDisabledItem.call(this, k_disabled);
if (this.k_isReadOnly()) {
this.k_extWidget.setDisabled(true);
}
},

_k_setReadOnlyDeferred: function(k_isReadOnly) {
var
k_stackLength = this._k_getStackLength(),
k_extWidget,
k_isDisabled,
k_widgetEl,
k_widgetWrapEl;
k_isReadOnly = (false !== k_isReadOnly);
kerio.lib.K_DateField.superclass._k_setReadOnlyDeferred.call(this, k_isReadOnly);
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments, k_stackLength)) {
return;
}
k_extWidget = this.k_extWidget;
k_widgetEl = k_extWidget.getEl();
if (k_isReadOnly) {
k_widgetEl.un('focus', k_extWidget.onFocus);
k_widgetEl.un('blur', k_extWidget.onBlur);
}
else {
k_widgetEl.on('focus', k_extWidget.onFocus, k_extWidget);
k_widgetEl.on('blur', k_extWidget.onBlur, k_extWidget);
}
},

k_getValue: function() {
var k_value = this.k_extWidget.getValue();
return k_value.format ? k_value.format('U') : k_value;
},

k_setValue: function(k_value, k_isInitial) {
k_value = Date.parseDate(k_value, 'U');
kerio.lib.K_DateField.superclass.k_setValue.call(this, k_value, k_isInitial);
},

_k_doAfterRender: function (k_extDateField) {
var k_el = k_extDateField.getEl();
k_el.dom.setAttribute('readOnly', true);
k_el.on('mousedown', k_extDateField.onTriggerClick, k_extDateField);
k_el.addClass('x-date-noedit');
},

k_getInitialValue: function (k_configValue) {
var k_value;
if (true === k_configValue) {
k_value = this._k_configValue;
}
else {
k_value = this._k_originalValue;
}
return k_value;
},

k_setInitialValue: function (k_value) {
if (k_value instanceof Date) {
k_value = k_value.format('U');
}
this._k_originalValue = k_value;
},

k_isDirty: function () {
var k_originalValue = this._k_originalValue;
if (undefined !== k_originalValue) {
k_originalValue = Date.parseDate(Date.parseDate(this._k_originalValue, 'U').format('d-m-Y'), 'd-m-Y').format('U');
}
return k_originalValue != this.k_getValue();
},

_k_fixChineseShortDayNames: function() {
var
k_daysEl = this.k_extWidget.menu.el.child('table.x-date-inner').down('thead').select('th').elements,
k_dayNames = this.k_extWidget.menu.picker.dayNames,
k_cnt = k_dayNames.length,
k_dayEl,
k_i;
for (k_i=0; k_i < k_cnt; k_i++) {
k_dayEl = Ext.get(k_daysEl[k_i]);
k_dayEl.addClass('dayNameAlignForChinese');
k_dayEl.update(k_dayNames[k_i].substr(2));
}
this._k_isChineseFixed = true;
}
});

kerio.lib.K_DateField.k_setStartDay = function (k_startDay) {
kerio.lib.K_DateField.prototype._k_propertiesDefault.startDay = k_startDay;
};

Ext.form.DateField.prototype.setValue = Ext.form.DateField.prototype.setValue.createSequence(function (k_date) {
if (!k_date) {
return;
}
var k_dateField = (this._kx ? this._kx.k_owner : false);
if (k_dateField) {
if (!Ext.isDate(k_date)) {
k_date = Date.parseDate(k_date, 'U');
}
k_dateField._k_onChangeHandler.call(k_dateField, this);
}
});

Ext.form.DateField.prototype.menuListeners = Ext.apply(Ext.form.DateField.prototype.menuListeners || {}, {
beforeshow: function () {
var k_owner = this._kx ? this._kx.k_owner : null;
if (!k_owner) {
return;
}
if (kerio.lib.k_engineConstants && 'zh' === kerio.lib.k_engineConstants.k_CURRENT_LANGUAGE && !k_owner._k_isChineseFixed) {
kerio.lib.K_DateField.prototype._k_fixChineseShortDayNames.call(k_owner);
}
return !k_owner.k_isReadOnly();
}
});


kerio.lib.K_FormButton = function(k_id, k_config) {
this._k_setStoredProperties(['k_mask']);
kerio.lib.K_FormButton.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_FormButton, kerio.lib._K_FormItem,
{



_k_hasImpactOnContainer: false,
_k_isHtmlReadOnly: false,

_k_propertiesMapping: {
k_id: 'id',
k_caption: 'text',
k_name: 'name',
k_isDisabled: 'disabled',
k_isHidden: 'hidden',
k_style: 'style',
k_className: 'cls',
k_onClick: {k_extName: 'click' , k_listener: 'this._k_onClick', k_scope: 'this'}
},

_k_propertiesDefault: {
cls: 'toolbarButtons %+',
minWidth: kerio.lib.k_constants.k_BUTTON_MIN_WIDTH
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
return new kerio.lib._K_SimpleButton(k_adaptedConfig);
},

_k_doAfterRender: function () {
var k_extOwnerCt = this.k_extWidget.ownerCt;
if (k_extOwnerCt) {
k_extOwnerCt.addClass('buttonInForm');
}
},

_k_onClick: function(k_extItem, k_extEvent) {
var
k_masterParent = this.k_getTopLevelParent(),
k_storedConfig = this._k_storedConfig || {},
k_event,
k_maskCfg;
if (k_masterParent && k_masterParent.k_maskOnAction) {
k_maskCfg = k_storedConfig.k_mask;
if (false !== k_maskCfg) {  k_maskCfg = k_maskCfg ? k_maskCfg : k_masterParent.k_maskOnAction;
kerio.lib.k_maskWidget(k_masterParent, k_maskCfg);
}
}
k_event = new kerio.lib.K_Event(kerio.lib.k_constants.k_EVENT.k_TYPES.k_CLICK, k_extEvent);
this._k_mappedListeners.k_onClick.call(this, this.k_parent, this, k_event);
},

_k_getIndentEl: function () {
return this.k_extWidget.getEl();
},

k_reset: Ext.emptyFn,

k_getValue: Ext.emptyFn
});


kerio.lib.K_Select = function(k_id, k_config) {
this._k_setStoredProperties([
'k_checkPreselectedValue',
'k_emptyValuePrompt',
'k_emptyText',
'k_onInit',
'k_isEditable',
'k_remoteData',
'k_dataStore',
'k_name',
'k_fieldIconClassName',
'k_fieldIconTooltip',
'k_useColumnsNames',
'k_localData',
'k_value'
]);
kerio.lib.K_Select.superclass.constructor.call(this, k_id, k_config);
this._k_isLoading = false;    if (this._k_isAutoLoaded) {
this.k_reload.defer(10, this);
}
};
Ext.extend(kerio.lib.K_Select, kerio.lib._K_TriggerField,
{

















_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib._K_TriggerField, {
k_listWidth: 'listWidth',
k_fieldDisplay: 'displayField',
k_fieldValue: 'valueField',
k_emptyText: 'emptyText',
k_isEditable: 'editable',
k_listClassName: 'listClass'
}),

_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib._K_TriggerField, {
listWidth: 'auto', hiddenName: '',
typeAhead: false,
editable: false,
triggerAction: 'all',  minChars: 0, displayField: 'name',
valueField: 'value',
lastQuery: '', enableKeyEvents: true }),
_k_selectedItemIndex: -1,
_k_isValueEdited: false,

_k_beforeInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_remoteData = k_storedConfig.k_remoteData || {};
kerio.lib.K_Select.superclass._k_beforeInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
this._k_isCache = false !== k_remoteData.k_isCache;
this._k_isEditable = Boolean(k_storedConfig.k_isEditable);
k_adaptedConfig.selectOnFocus = this._k_isEditable; k_adaptedConfig.enableKeyEvents = !this._k_isEditable; k_adaptedConfig.tpl = '<tpl for="."><div class="x-combo-list-item">{[fm.htmlEncode(values.' + k_adaptedConfig.displayField + ')]}</div></tpl>';
this._k_fieldDisplay = k_adaptedConfig.displayField;
this._k_fieldValue = k_adaptedConfig.valueField;
k_adaptedConfig.hiddenName = k_adaptedConfig.name; k_adaptedConfig.hiddenId = this.k_id + '_hidden';
this._k_createDataStore();
k_adaptedConfig.store = this._k_dataStore.k_extWidget;
k_adaptedConfig.mode = this._k_isLocalData ? 'local' : 'remote';
if (k_storedConfig.k_fieldIconClassName) {
this._k_hasIcons = true;
k_adaptedConfig.iconClsField = k_storedConfig.k_fieldIconClassName;
k_adaptedConfig.iconTooltipField = k_storedConfig.k_fieldIconTooltip;
this._k_removeStoredProperties(['k_fieldIconClassName', 'k_fieldIconTooltip']);
}
this._k_removeStoredProperties(['k_isEditable']);
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
K_WidgetConstructor,
k_extWidget;
if (true === this._k_hasIcons) {
K_WidgetConstructor = kerio.ext.ux.K_IconCombo;
}
else {
this._k_isListWidthUpdateNeeded = Ext.isIE && 'auto' !== k_adaptedConfig.listWidth;
K_WidgetConstructor = Ext.form.ComboBox;
}
k_extWidget = new K_WidgetConstructor(k_adaptedConfig);
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_extWidget = this.k_extWidget,
k_extDataStore = this._k_dataStore.k_extWidget,
k_checkPreselectedValue = false !== k_storedConfig.k_checkPreselectedValue;
kerio.lib.K_Select.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
if (true === this._k_isEditable) {
k_extWidget.onKeyUp = Ext.emptyFn;
kerio.lib._k_addKerioProperty(k_extWidget, {_k_getValue: k_extWidget.getValue});
k_extWidget.getValue = this._k_getValueEditable;
}
this._k_isFirstTimeExpand = true;
k_extWidget.on({
'expand': this._k_onExpand,
'collapse': this._k_onCollapse,
'select' : this._k_onSelectHandler,
'keypress' : this._k_onKeyPress,
scope: this
});
if (false === this._k_isCache) {
k_extWidget.on('beforequery', this._k_cacheControl, this);
}
if (k_storedConfig.k_emptyValuePrompt) {
if (k_storedConfig.k_emptyValuePrompt.k_display === k_storedConfig.k_emptyText) {
k_extWidget.preFocus = k_extWidget.preFocus.createSequence(this._k_fixPromptPreFocus);
}
}
if (this._k_isLocalData) {
if (k_checkPreselectedValue) {
this._k_initialValue = k_storedConfig.k_value;
this._k_checkPreselectedValue = true;
this._k_onStoreInited(k_extDataStore, k_extDataStore.getRange());
}
if (undefined !== k_storedConfig.k_onInit) {
k_storedConfig.k_onInit.call(this);
}
}
else {
if (k_checkPreselectedValue || (undefined !== k_storedConfig.k_onInit) || (undefined === k_storedConfig.k_value)) {
this._k_checkPreselectedValue = k_checkPreselectedValue;
this._k_initialValue = k_storedConfig.k_value;
k_extDataStore.on('load', this._k_onStoreInited, this);
}
}
if (kerio.lib.k_isIPadCompatible) {
k_extWidget.on({
expand: function () {
Ext.getDoc().on('touchstart', this.collapseIf, this);
},
collapse: function () {
Ext.getDoc().un('touchstart', this.collapseIf, this);
},
scope: this.k_extWidget
});
}
this._k_removeStoreOnLoadHandler();
},

_k_cacheControl: function() {
delete this.k_extWidget.lastQuery;
},

_k_removeStoreOnLoadHandler: function () {
var k_extWidget = this.k_extWidget;
k_extWidget.initList = k_extWidget.initList.createSequence(function () {
this.store.un('load', this.onLoad, this);
}, k_extWidget);
},

_k_createDataStore: function() {
var
k_storedConfig = this._k_storedConfig || {},
k_remoteData = k_storedConfig.k_remoteData,
k_dataStoreCfg = {k_record: this._k_createRecordDefiniton()};
if (k_remoteData) {
this._k_isLocalData = false;
k_dataStoreCfg.k_remoteData = k_remoteData;
k_dataStoreCfg.k_remoteData.k_isQueryValueSent = true === k_remoteData.k_isQueryValueSent;
this._k_isAutoLoaded = (false !== k_remoteData.k_isAutoLoaded);
this._k_jsonRpc = k_remoteData.k_jsonRpc || {};
}
else {
this._k_isLocalData = true;
k_dataStoreCfg.k_localData = k_storedConfig.k_localData;
}
if (k_storedConfig.k_dataStore) {
this._k_dataStore = k_storedConfig.k_dataStore;
}
else {
this._k_dataStore = new kerio.lib._K_DataStore(this, k_dataStoreCfg);
}
},

_k_createRecordDefiniton: function() {
var
k_storedConfig = this._k_storedConfig || {},
k_recordDef = [
{k_columnId: this._k_fieldDisplay},
{k_columnId: this._k_fieldValue}
],
k_i, k_cnt;
if (k_storedConfig.k_fieldIconClassName) {
k_recordDef.push({k_columnId: k_storedConfig.k_fieldIconClassName});
}
if (k_storedConfig.k_fieldIconTooltip) {
k_recordDef.push({k_columnId: k_storedConfig.k_fieldIconTooltip});
}
if (!k_storedConfig.k_useColumnsNames) {
for (k_i = 0, k_cnt = k_recordDef.length; k_i < k_cnt; k_i++) {
k_recordDef[k_i].k_mapping = k_i;
}
}
return k_recordDef;
},

_k_onStoreInited: function(k_extStore, k_extRecords, k_options) {
this._k_isLoading = false;
var k_fieldValue = this._k_fieldValue,
k_extWidget = this.k_extWidget,
k_value,
k_isPreselectedValueInvalid,
k_foundRecords;
if (undefined === this._k_initialValue) {
if (0 < k_extRecords.length) {
k_value = k_extRecords[0].data[k_fieldValue];
k_extWidget.setValue(k_value);
this._k_initialValue = k_value;
}
}
else if (this._k_checkPreselectedValue) {
k_value = k_extWidget.getValue();
if (0 < k_extRecords.length) {
k_isPreselectedValueInvalid = true;
if ('' !== k_value) {
k_foundRecords = k_extStore.query(k_fieldValue, k_value, false, true);
k_isPreselectedValueInvalid = (0 === k_foundRecords.length);
}
if (k_isPreselectedValueInvalid) {
k_value = k_extRecords[0].data[k_fieldValue];
k_extWidget.setValue(k_value);
}
else {
if (!this._k_isLocalData) {
k_extWidget.setValue(k_value);
}
}
}
}
this._k_selectedItemIndex = this.k_getIndexByDataValue(k_fieldValue, this.k_getValue());
this.k_setInitialValue(k_value);
this._k_updatePrevValue();
if (this._k_storedConfig && undefined !== this._k_storedConfig.k_onInit) {
k_extStore.un('load', this._k_onStoreInited);
this._k_storedConfig.k_onInit.call(this);
}
},

_k_doAfterRender: function() {
var
k_extWidget = this.k_extWidget,
k_storedConfig = this._k_storedConfig || {};
kerio.lib.K_Select.superclass._k_doAfterRender.call(this);
if (k_storedConfig.k_emptyValuePrompt) {
if (k_extWidget.inEditor) {
k_extWidget.on('beforeshow', this._k_showPrompt, this);
}
else {
k_extWidget.on('focus', this._k_showPrompt, this);
}
k_extWidget.beforeBlur = k_extWidget.beforeBlur.createInterceptor(this._k_hidePrompt, this);
}
},

_k_selectFirst: function() {
var k_cnt = this.store.getCount();
if(k_cnt > 0 && this.selectedIndex !== 0) {
this.select(0);
}
},

_k_selectLast: function() {
var k_cnt = this.store.getCount();
if(k_cnt > 0 && this.selectedIndex !== k_cnt - 1){
this.select(k_cnt - 1);
}
},

_k_selectPageUp: function() {
var
k_cnt = this.store.getCount(),
k_listHeight = this.list.getHeight(),
k_itemHeight = this.list.dom.children[0].children[0].offsetHeight,
k_pageItems = Math.floor(k_listHeight / k_itemHeight);
if(k_cnt > 0) {
if (0 < this.selectedIndex - k_pageItems) {
this.select(this.selectedIndex - k_pageItems);
}
else {
this._kx.k_owner._k_selectFirst.call(this);
}
}
},

_k_selectPageDown: function() {
var
k_cnt = this.store.getCount(),
k_listHeight = this.list.getHeight(),
k_itemHeight = this.list.dom.children[0].children[0].offsetHeight,
k_pageItems = Math.floor(k_listHeight / k_itemHeight);
if(k_cnt > 0) {
if (k_cnt > this.selectedIndex + k_pageItems) {
this.select(this.selectedIndex + k_pageItems);
}
else {
this._kx.k_owner._k_selectLast.call(this);
}
}
},

_k_onCollapse: function(k_extComboBox) {
k_extComboBox.wrap.removeClass('x-trigger-wrap-focus');
},

_k_onExpand: function(k_extComboBox) {
var k_listWidth;
k_extComboBox.wrap.addClass('x-trigger-wrap-focus');
if (this._k_isFirstTimeExpand || this.k_extWidget.inEditor) {
this._k_filterHiddenItems();
delete this._k_isFirstTimeExpand;
}
if (true === this._k_isListWidthUpdateNeeded) {
k_listWidth = k_extComboBox.el.getComputedWidth() + k_extComboBox.trigger.getWidth();
k_extComboBox.list.setWidth(k_listWidth);
k_extComboBox.innerList.setWidth(k_listWidth - k_extComboBox.list.getFrameWidth('lr'));
this._k_isListWidthUpdateNeeded = false;
}
},

_k_onChangeHandler: function() {
var	k_extRecord;
if (this._k_isEditable && 'keyup' === Ext.EventObject.type && this.k_extWidget.getRawValue() !== this.k_getValue()) {
this._k_isValueEdited = true;
this._k_selectedItemIndex = -1;
}
if (true !== this._k_isEditable) {
k_extRecord = this._k_dataStore.k_extWidget.getAt(this._k_selectedItemIndex);
if (!k_extRecord) { return;
}
}
kerio.lib.k_notify(this, kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED);
kerio.lib.K_Select.superclass._k_onChangeHandler.call(this, this.k_extWidget);
},

k_reload: function() {
this._k_dataStore.k_reloadData(this._k_jsonRpc.params);
},

k_setRequestParam: function(k_name, k_value) {
var k_params = this._k_jsonRpc.params;
k_params[k_name] = k_value;
},

k_setRequestParams: function(k_params) {
var k_jsonRpc = this._k_jsonRpc.params;
Ext.apply(k_jsonRpc, k_params);
},

k_getAdditionalParams: function() {
var k_item = this._k_dataStore.k_extWidget.data.items[this._k_selectedItemIndex];
if (undefined === k_item) {
return null;
}
return k_item.json || k_item.data;
},

k_containsValue: function(k_value) {
var
k_extWidget = this.k_extWidget,
k_extRecord = k_extWidget.findRecord(k_extWidget.valueField, k_value);
return (k_extRecord ? true : false);
},

k_getValueCount: function() {
return this._k_dataStore.k_getRowsCount();
},

k_getValue: function() {
return this.k_extWidget.getValue();
},

_k_getValueEditable: function () {
var
k_value,
k_kerioWidget = this._kx.k_owner;
if (true === k_kerioWidget._k_isValueEdited) {
k_value = Ext.form.ComboBox.superclass.getValue.call(this);
}
else {
k_value = this._kx._k_getValue.call(this);
}
return k_value;
},

k_setValue: function(k_value, k_isInitial) {
var
k_extDataStore = this._k_dataStore.k_extWidget,
k_fieldValue = this._k_fieldValue,
k_index = this.k_getIndexByDataValue(k_fieldValue, k_value),
k_extRecord = k_extDataStore.getAt(k_index);
if (undefined === k_value) {
return;
}
this._k_selectedItemIndex = k_index;
if (this._k_isEditable && -1 !== k_index) {
this._k_isValueEdited = false;
}
if (!this._k_isEditable && (-1 === k_index)) {
}
if (this._k_hiddenItems && this._k_hiddenItems[k_value]) {
k_index = 0;
k_extRecord = k_extDataStore.getAt(k_index);
k_value = k_extRecord.data[k_fieldValue];
}
kerio.lib.K_Select.superclass.k_setValue.call(this, k_value, k_isInitial);
},

k_getText: function() {
var k_extDataStore = this._k_dataStore.k_extWidget,
k_selectedItemIndex = this._k_selectedItemIndex,
k_text;
if (-1 !== k_selectedItemIndex)	{
k_text = k_extDataStore.getAt(k_selectedItemIndex).get(this._k_fieldDisplay);
}
else {
k_text = this.k_extWidget.value;
}
return k_text;
},

k_getSelectedItemIndex: function () {
return this._k_selectedItemIndex;
},

k_selectByIndex: function(k_index) {
var k_extRecord = this._k_dataStore.k_extWidget.getAt(k_index);
this.k_setValue(k_extRecord.data[this._k_fieldValue]);
this.k_extWidget.collapse();
},

k_selectByName: function (k_name) {
var k_index = this.k_getIndexByDataValue(this._k_fieldDisplay, k_name);
if (-1 === k_index) {
kerio.lib.k_reportError('Internal error: Record with display field (' + this._k_fieldDisplay + ') \'' + k_name + '\' is not in DataStore', 'formSelect.js');
return;
}
this.k_selectByIndex(k_index);
},

_k_setReadOnlyDeferred: function(k_isReadOnly) {
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
var
k_extWidget = this.k_extWidget,
k_widgetEl = k_extWidget.getEl(),
k_readOnlyClassEl = k_extWidget.container || k_widgetEl,
k_isEditable = this._k_isEditable,
k_hasReadOnlyClass = k_readOnlyClassEl.hasClass(this._k_readOnlyClassName);
if ((k_hasReadOnlyClass && k_isReadOnly) || (!k_hasReadOnlyClass && !k_isReadOnly)) {
return;
}
if (k_isReadOnly) {
if (k_isEditable) {
k_widgetEl.dom.setAttribute('readOnly', true);
}
k_readOnlyClassEl.addClass(this._k_readOnlyClassName);
}
else {
if (k_isEditable) {
k_widgetEl.dom.removeAttribute('readOnly');
}
k_readOnlyClassEl.removeClass(this._k_readOnlyClassName);
}
this._k_setKeyNavDisabled(k_isReadOnly);
},

_k_setKeyNavDisabled: function (k_disabled) {
var k_keyNav = this.k_extWidget.keyNav;
k_disabled = false !== k_disabled;
if (k_keyNav) {
k_keyNav[k_disabled ? 'disable' : 'enable']();
}
},

_k_setAdditionalKeyNav: function() {
var k_keyNav = this.k_extWidget.keyNav;
if (k_keyNav) {
if (!this._k_isEditable) {
k_keyNav.home = this._k_selectFirst;
k_keyNav.end = this._k_selectLast;
}
k_keyNav.pageUp = this._k_selectPageUp;
k_keyNav.pageDown = this._k_selectPageDown;
}
},

k_clearData: function() {
this._k_dataStore.k_clearData();
this._k_selectedItemIndex = -1;
},

k_addData: function(k_newData, k_targetRowIndex) {
var
k_dataStore = this._k_dataStore,
k_i, k_cnt;
if (!(k_newData instanceof Array)) {
k_newData = [k_newData];
}
if (undefined === k_targetRowIndex) {
k_dataStore.k_setData(k_newData, true);
}
else {
for (k_i = 0, k_cnt = k_newData.length; k_i < k_cnt; k_i++) {
k_dataStore.k_addRow(k_newData[k_i], k_targetRowIndex + k_i);
}
}
},

k_setData: function (k_data, k_append, k_selectedValue) {
var
k_value,
k_extRecord,
k_emptyValuePrompt,
k_index = 0,
k_fieldValue = this._k_fieldValue,
k_dataStore = this._k_dataStore;
k_dataStore.k_setData(k_data, k_append);
if (0 === k_data.length) {
return;
}
k_emptyValuePrompt = this._k_storedConfig.k_emptyValuePrompt;
if (k_emptyValuePrompt && k_emptyValuePrompt.k_value == this.k_extWidget.getValue() && undefined === k_selectedValue) {
return;
}
if (undefined !== k_selectedValue) {
k_index = this.k_getIndexByDataValue(k_fieldValue, k_selectedValue);
if (k_index < 0) {
k_index = 0;
}
}
k_extRecord = k_dataStore.k_extWidget.getAt(k_index);
k_value = k_extRecord.data[k_fieldValue];
this.k_setValue(k_value);
},

_k_filterItems: function(k_extRecord) {
return !this._k_hiddenItems[k_extRecord.data[this._k_fieldValue]];
}, 
_k_filterHiddenItems: function() {
if (this._k_hiddenItems && this._k_hiddenItemsCount > 0 ) {
this._k_dataStore.k_extWidget.filterBy(this._k_filterItems, this);
}
},

k_setVisibleItem: function(k_value, k_show) {
var
k_hiddenItems = this._k_hiddenItems || {},
k_hiddenItemsCount = this._k_hiddenItemsCount || 0,
k_refreshStore = false;
k_show = false !== k_show;
if (0 === k_hiddenItemsCount && k_show) {
return; }
if (k_show) {
if (k_hiddenItems[k_value]) {
delete k_hiddenItems[k_value];
k_hiddenItemsCount--;
k_refreshStore = true;
if (k_hiddenItemsCount <= 0) {
k_hiddenItems = {};
k_hiddenItemsCount = 0;
this._k_dataStore.k_extWidget.clearFilter();
}
}
}
else {
if (!k_hiddenItems[k_value]) {
k_hiddenItems[k_value] = true;
k_hiddenItemsCount++;
k_refreshStore = true;
}
}
this._k_hiddenItems = k_hiddenItems;
this._k_hiddenItemsCount = k_hiddenItemsCount;
if (k_refreshStore) {
this._k_filterHiddenItems();
}
}, 
_k_onMouseInputHandler: function () {
if (this._k_isValueChanged()) {
this._k_selectedItemIndex = -1;
this._k_isValueEdited = true;
}
kerio.lib.K_Select.superclass._k_onMouseInputHandler.apply(this, arguments);
},

_k_onPasteValidationTimer: function(k_event) {
if (this.k_rawValue != this.k_extWidget.getRawValue()) {
this._k_selectedItemIndex = -1;
this._k_isValueEdited = true;
}
kerio.lib.K_Select.superclass._k_onPasteValidationTimer.apply(this, arguments);
},

_k_initValidation: function() {
if (true === this._k_isEditable) {
kerio.lib.K_Select.superclass._k_initValidation.apply(this, arguments);
}
},

_k_onSelectHandler: function (k_extSelect, k_extRecord, k_index) {
if (true === this._k_isEditable) {
this._k_isValueEdited = false;
}
this._k_selectedItemIndex = k_index;
this._k_onChangeHandler.apply(this, arguments);
},

_k_onKeyPress: function (k_extSelect, k_event) {
var
k_valueFieldName = k_extSelect.valueField,
k_displayFieldName = k_extSelect.displayField,
k_typedChar = String.fromCharCode(k_event.getCharCode()),
k_selectedItems = k_extSelect.view.getSelectedIndexes(),
k_selectedIndex = (k_selectedItems.length > 0) ? k_selectedItems[0] : -1, k_startIndex = ++k_selectedIndex,
k_foundIndex,
k_record;
if (k_event.browserEvent.metaKey) {
return;
}
k_foundIndex = k_extSelect.store.find(k_displayFieldName, k_typedChar, k_startIndex, false);
if (k_foundIndex === -1 && k_startIndex > 0) {
k_foundIndex = k_extSelect.store.find(k_displayFieldName, k_typedChar, 0, false);
}
if (k_foundIndex >= 0) {
this._k_selectedItemIndex = k_foundIndex;
k_record = k_extSelect.store.getAt(k_foundIndex);
k_extSelect.setValue(k_record.get(k_valueFieldName));
if (k_extSelect.isExpanded) {
k_extSelect.select(k_foundIndex);
}
}
},

k_isEditable: function () {
return (true === this._k_isEditable);
},

_k_showPrompt: function() {
var
k_emptyValuePrompt = this._k_storedConfig ? this._k_storedConfig.k_emptyValuePrompt : null,
k_extWidget = this.k_extWidget;
if (k_emptyValuePrompt.k_value == k_extWidget.getValue()) {
k_extWidget.setRawValue(k_emptyValuePrompt.k_display);
if (k_extWidget.setIconCls) {
k_extWidget.setIconCls.call(k_extWidget);
}
}
},

_k_hidePrompt: function() {
var
k_emptyValuePrompt = this._k_storedConfig ? this._k_storedConfig.k_emptyValuePrompt : null,
k_extWidget = this.k_extWidget;
if (k_emptyValuePrompt.k_value == k_extWidget.getValue()) {
k_extWidget.setRawValue(k_emptyValuePrompt.k_value);
}
},

_k_fixPromptPreFocus: function() {
var k_widget = this._kx.k_owner;
k_widget._k_showPrompt.call(k_widget);
},

k_getInitialValue: function (k_configValue) {
if (true === k_configValue) {
return this._k_initialValue;
}
return kerio.lib.K_Select.superclass.k_getInitialValue.call(this, false);
},

k_getIndexByDataValue: function(k_fieldName, k_value) {
return this.k_extWidget.k_getIndexByDataValue(k_fieldName, k_value);
},

k_reset: function () {
var
k_initialValue = this.k_getInitialValue(true),
k_emptyValuePrompt = (this._k_storedConfig || {}).k_emptyValuePrompt;
if (undefined === k_initialValue && k_emptyValuePrompt) {
this.k_extWidget.setValue('');
kerio.lib.k_notify(this, kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED);
kerio.lib.K_Select.superclass._k_onChangeHandler.call(this, this.k_extWidget);
}
else {
kerio.lib.K_Select.superclass.k_reset.apply(this, arguments);
}
}
}); Ext.form.ComboBox.prototype._kxp = Ext.apply({}, Ext.form.ComboBox.prototype._kxp, {
_k_restrictHeight: Ext.form.ComboBox.prototype.restrictHeight,
_k_onTriggerClick: Ext.form.ComboBox.prototype.onTriggerClick
});
Ext.form.ComboBox.prototype.onTriggerClick = function(){
var k_kerioWidget = this._kx ? this._kx.k_owner : null;
if (!k_kerioWidget || true !== k_kerioWidget.k_isReadOnly()) {
this._kxp._k_onTriggerClick.apply(this, arguments);
}
};

Ext.form.ComboBox.prototype.initEvents = Ext.form.ComboBox.prototype.initEvents.createSequence(function() {
var k_kerioWidget = this._kx.k_owner;
k_kerioWidget._k_setKeyNavDisabled(k_kerioWidget.k_isReadOnly());
k_kerioWidget._k_setAdditionalKeyNav();
});
Ext.form.ComboBox.prototype._k_initList = Ext.form.ComboBox.prototype.initList;
Ext.form.ComboBox.prototype.initList = function () {
var
k_initList = !this.list,
k_listWidth = this.listWidth;
if ('auto' != k_listWidth) {
Ext.form.ComboBox.prototype._k_initList.apply(this, arguments);
return;
}
if (k_initList) {
delete this.listWidth;
}
Ext.form.ComboBox.prototype._k_initList.apply(this, arguments);
if (k_initList) {
this.listWidth = k_listWidth;
this.list.setWidth('auto');
this.innerList.setWidth('auto');
}
};
Ext.form.ComboBox.prototype.expand = Ext.form.ComboBox.prototype.expand.createSequence(function(){
if ('auto' !== this.listWidth) {
return;
}
var
k_listWidth,
k_width;
if ('auto' != this.list.getStyle('width')) {
this.list.setWidth('auto');
this.innerList.setStyle('width', '');
}
k_width = Ext.isIE ?  this.el.getComputedWidth() + this.trigger.getWidth() : this.wrap.getWidth();
if (this.list.getWidth() < k_width) {
k_listWidth = this.listWidth;
delete this.listWidth;
this.doResize(k_width);
this.listWidth = k_listWidth;
}
if (Ext.isIE7 && this.isExpanded()) {
this.innerList.setWidth(this.innerList.getWidth());
}
});

Ext.form.ComboBox.prototype.select = function(index, scrollIntoView){
this.selectedIndex = index;
this.view.select(index);
if (scrollIntoView !== false) {
var
el = this.view.getNode(index),
k_listEl = this.list,
k_widgetEl = this.getEl();
if (el) {
if (k_listEl.getTop() == k_widgetEl.getBottom()) { this.innerList.dom.scrollTop = el.offsetTop;
}
else {
this.innerList.scrollChildIntoView(el, false);
}
}
}
};


kerio.lib.K_SelectLanguage = function(k_id, k_config) {
var k_allLanguages = kerio.lib.k_constants.k_languageList,
k_supportedLanguages = (k_config.k_supportedLanguages || kerio.lib.k_getSupportedLanguages() || []).join(':'),
k_languageList = [],
k_langId,
k_i,
k_cnt = k_allLanguages.length;
if ('' === k_supportedLanguages) {
k_languageList = k_allLanguages;
}
else {
for (k_i = 0; k_i < k_cnt; k_i++) {
k_langId = k_allLanguages[k_i].k_id;
if (-1 !== k_supportedLanguages.indexOf(k_langId)) {
k_languageList.push(k_allLanguages[k_i]);
}
}
}
Ext.apply(k_config, {
k_className          : 'selectLanguage',
k_fieldDisplay       : 'k_localizedCaption',
k_fieldValue         : 'k_id',
k_fieldIconClassName : 'k_className',
k_localData          : k_languageList,
k_listClassName      : 'flag'
});
kerio.lib.K_SelectLanguage.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_SelectLanguage, kerio.lib.K_Select,
{


});


kerio.lib.K_SelectTypeAhead = function(k_id, k_config) {
this._k_setStoredProperties([
'k_highlightClassName'
]);
Ext.apply(k_config.k_remoteData, {
k_isAutoLoaded: false,
k_isCache: false
});
kerio.lib.K_SelectTypeAhead.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_SelectTypeAhead, kerio.lib.K_Select,
{





k_blur: function() {
this.k_extWidget.blur();
},

_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib.K_Select, {
k_isTriggerHidden: 'hideTrigger',
k_onSelect: {k_extName: 'select', k_listener: 'this._k_onSelect', k_scope: 'this'}
}),

_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib.K_Select, {
hideTrigger: true,
enableKeyEvents: false
}),

_k_onStoreInited: function() {
if (this._k_storedConfig && undefined !== this._k_storedConfig.k_onInit) {
this._k_storedConfig.k_onInit.call(this);
}
},

_k_setAdditionalKeyNav: function() {
var k_keyNav = this.k_extWidget.keyNav;
if (k_keyNav) {
k_keyNav.pageUp = this._k_selectPageUp;
k_keyNav.pageDown = this._k_selectPageDown;
}
},

k_setValue: function(k_value, k_isInitial) {
var k_params = {};
kerio.lib.K_SelectTypeAhead.superclass.k_setValue.call(this, k_value, k_isInitial);
this.k_setRequestParam(this._k_searchParamName, k_value);
k_params[this._k_searchParamName] = k_value;
this._k_dataStore.k_setLastRequestParams(k_params);
},

_k_doAfterRender: function() {
kerio.lib.K_SelectTypeAhead.superclass._k_doAfterRender.call(this);
this._k_searchParamName = this._k_storedConfig.k_remoteData.k_searchParamName || 'searchQuery';
this.k_extWidget.queryParam = this._k_searchParamName;
this.k_extWidget.el.on('keyup', this._k_startRemoteSearch, this);
},

_k_startRemoteSearch: function(k_event) {
var
k_key,
k_value;
if (this.k_isReadOnly()) {
return;
}
if (k_event.isSpecialKey()) {
k_key = k_event.getKey();
if (k_event.BACKSPACE !== k_key && k_event.DELETE !== k_key) {
return;
}
}
k_value = this.k_extWidget.getRawValue();
this.k_setRequestParam(this._k_searchParamName, k_value);
this.k_extWidget.lastQuery = k_value;  this.k_reload();
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
kerio.lib.K_SelectTypeAhead.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
var k_extWidget = this.k_extWidget;
k_extWidget.initList = this.k_extWidget.initList.createSequence(this._k_initList, this);
},

_k_onSelect: function () {
this._k_mappedListeners.k_onSelect.call(this, this.k_parent, this, this.k_getValue());
},

_k_initList: function() {
this.k_extWidget.view.prepareData = this._k_listRowRenderer.createDelegate(this);
},

_k_listRowRenderer: function(k_data) {
var
k_searchValue = this.k_extWidget.getRawValue(),
k_fieldDisplay = this._k_fieldDisplay,
k_htmlEncode = kerio.lib.k_htmlEncode,
k_displayValue = k_htmlEncode(k_data[k_fieldDisplay]);
k_data = kerio.lib.k_cloneObject(k_data);
k_searchValue = k_htmlEncode(k_searchValue);
k_searchValue = kerio.lib.k_escapeRe(k_searchValue);
if ('' !== k_searchValue) {
k_displayValue = k_displayValue.replace(
new RegExp('(' + k_searchValue + ')', 'gi'),
'<span class="' + this._k_storedConfig.k_highlightClassName + '">$1</span>'
);
}
k_data[k_fieldDisplay] = k_displayValue;
return k_data;
},

_k_beforeInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
k_adaptedConfig.k_isSecure = true;
kerio.lib.K_SelectTypeAhead.superclass._k_beforeInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
delete k_adaptedConfig.tpl;
},

_k_removeStoreOnLoadHandler: Ext.emptyFn
});


kerio.lib.K_ProgressBar = function(k_id, k_config) {
this._k_setStoredProperties([
'k_value',
'k_maxValue',
'k_exceeded',
'k_isValueHidden'
]);
kerio.lib.K_ProgressBar.superclass.constructor.call(this, k_id, k_config);
}; Ext.extend(kerio.lib.K_ProgressBar, kerio.lib._K_FormItem,
{







_k_numberRegexp: new RegExp('^[0-9]{1,}[.0-9]{0,}$'),
_k_hasImpactOnContainer: false,

_k_propertiesDefault: {
width: 10, cls: 'x-form-item %+',
hideLabel: true
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_extWidget,
k_value;
this._k_value = k_storedConfig.k_value || 0;
this._k_maxValue = k_storedConfig.k_maxValue || 0;
this._k_exceededMessageParams = k_storedConfig.k_exceeded || {k_message: '', k_messageClassName: ''};
delete k_storedConfig.k_value;
delete k_storedConfig.k_maxValue;
delete k_storedConfig.k_exceeded;
k_value = this._k_getRecalculatedValue(this._k_value, this._k_maxValue);
k_adaptedConfig.value = k_value;
if (!k_storedConfig.k_isValueHidden) {
k_adaptedConfig.text = Math.floor(k_value * 100) + '%';
}
k_extWidget = new kerio.lib._K_ProgressBar(k_adaptedConfig);
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
this._k_update();
},

_k_getRecalculatedValue: function (k_value, k_maxValue) {
return  0 === k_maxValue ? 0 : k_value / k_maxValue;
},

_k_isNumber: function(k_value) {
return this._k_numberRegexp.test(k_value);
},

_k_isValueExceeded: function () {
return this._k_value > this._k_maxValue;
},

_k_update: function () {
var
k_showProgressbar = false,
k_showExceededMessage = false,
k_isValueExceeded = this._k_isValueExceeded(),
k_extWidget = this.k_extWidget,
k_text = null,
k_progressBarValue = this._k_getRecalculatedValue(this._k_value, this._k_maxValue);
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments)) {
return;
}
k_showProgressbar = !k_isValueExceeded && 0 < this._k_maxValue;
k_showExceededMessage = k_isValueExceeded || 0 === this._k_maxValue;
this._k_progressBarInnerEl.setDisplayed(k_showProgressbar);
this._k_exceededMessageEl.setDisplayed(k_showExceededMessage);
k_extWidget.getEl()[k_showExceededMessage ? 'addClass': 'removeClass']('progressbarValueExceeded');
if (k_showProgressbar) {
if (!this._k_storedConfig || !this._k_storedConfig.k_isValueHidden) {
k_text = Math.floor(k_progressBarValue * 100) + '%';
}
}
k_extWidget.value = k_progressBarValue;
k_extWidget.text = k_text;
k_extWidget.syncProgressBar();
},

k_setValue: function(k_newValue) {
if (!this._k_isNumber(k_newValue)) {
return;
}
this._k_value = k_newValue;
this._k_update();
},

k_setMaxValue: function(k_newMaxValue) {
if (this._k_isNumber(k_newMaxValue)) {
this._k_maxValue = k_newMaxValue;
this._k_update();
}
},

k_getExceededText: function() {
if (this._k_exceededMessageParams) {
return this._k_exceededMessageParams.k_message;
}
return '';
},

k_setExceededText: function(k_message) {
if (this._k_exceededMessageParams) {
this._k_exceededMessageParams.k_message = k_message;
if (this.k_extWidget.rendered) {
this._k_exceededMessageEl.update(k_message);
}
}
},

k_getValue: Ext.emptyFn
}); 
kerio.lib._K_ProgressBar = Ext.extend(Ext.ProgressBar, {

onRender: function (k_container, k_position) {
kerio.lib._K_ProgressBar.superclass.onRender.apply(this, arguments);
var
k_owner = this._kx ? this._kx.k_owner : null,
k_exceededMessageEl;
if (!k_owner) {
return;
}
k_exceededMessageEl = this.getEl().createChild({
tag: 'div',
style: 'display: none',
cls: k_owner._k_exceededMessageParams.k_messageClassName
});
k_exceededMessageEl.update(k_owner._k_exceededMessageParams.k_message);
k_owner._k_exceededMessageEl = k_exceededMessageEl;
k_owner._k_progressBarInnerEl = Ext.get(this.el.dom.firstChild);
},

setSize: function () {
kerio.lib._K_ProgressBar.superclass.setSize.apply(this, arguments);
this.syncProgressBar();
return this;
},

syncProgressBar: function () {
var
k_inner = this.el.dom.firstChild,
k_width = this._kxp._k_getInnerWidth.call(this),
k_height = this._kxp._k_getInnerHeight.call(this);
if (undefined !== this.value) {
this.updateProgress(this.value, this.text);
}
this.progressBar.setHeight(k_height);
this.textEl.setSize(k_width, k_height);
return this;
},

onShow: function () {
kerio.lib._K_ProgressBar.superclass.onShow.apply(this, arguments);
this.syncProgressBar.defer(1, this);
},

updateProgress : function(value, text){
this.value = value || 0;
if(text){
this.updateText(text);
}
var w = Math.floor(value * this._kxp._k_getInnerWidth.call(this));
this.progressBar.setWidth(w);
if(this.textTopEl){
this.textTopEl.removeClass('x-hidden').setWidth(w);
}
this.fireEvent('update', this, value, text);
return this;
}
});

kerio.lib._K_ProgressBar.prototype._kxp = {

_k_getInnerWidth: function () {
return this.el.isVisible(true) ? this.el.dom.firstChild.offsetWidth : parseInt(this.el.getStyle('width'), 10) || 0;
},

_k_getInnerHeight: function () {
var k_inner = this.el.dom.firstChild;
var k_height = Ext.get(k_inner).getComputedHeight(); return k_height;
}
};


kerio.lib.K_UploadButton = function(k_id, k_config) {
this._k_setStoredProperties(['k_onBeforeUpload', 'k_onUpload', 'k_onError', 'k_remoteData']);
kerio.lib.K_UploadButton.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_UploadButton, kerio.lib.K_FormButton,
{







_k_hasImpactOnContainer: true,

_k_propertiesMapping: {
k_id: 'id',
k_caption: 'text',
k_url: 'url',
k_name: 'inputName' },
_k_additionalRequestParams: null,

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget;
k_extWidget = new kerio.lib._K_FileUploadButton(k_adaptedConfig);
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
this.k_extWidget.on('fileselected', this._k_onChangeHandler, this);
},

_k_uploadCallback: function (k_response, k_success, k_callbackParams) {
var k_storedConfig = this._k_storedConfig || {};
if (k_storedConfig.k_onUpload) {
k_storedConfig.k_onUpload.call(this, this.k_parent, this, k_response, k_success, k_callbackParams || {});
}
},

_k_errorCallback: function (k_response) {
var
k_storedConfig = this._k_storedConfig || {},
k_skipInternalErrorHandler = false;
if (k_storedConfig.k_onError) {
k_skipInternalErrorHandler = k_storedConfig.k_onError.call(this, this.k_parent, this, k_response);
}
return k_skipInternalErrorHandler;
},

_k_onChangeHandler: function (k_extWidget, k_value) {
var k_storedConfig = this._k_storedConfig;
k_value = this.k_getValue();
if (k_storedConfig.k_onChange) {
k_storedConfig.k_onChange.call(this, this.k_parent, this, k_value);
}
if (false !== k_storedConfig.k_remoteData.k_isAutoUpload) {
this.k_upload();
}
},

k_getValue: function () {
var
k_value = this.k_extWidget.getValue(),
k_fakePath = 'C:\\fakepath\\';
if (k_value && 0 === k_value.indexOf(k_fakePath)) {
k_value = k_value.substr(k_fakePath.length);
}
return k_value;
},

_k_initUploadForm: function() {
var k_form = Ext.DomHelper.append(document.body, {
tag: 'form',
method: 'post',
style: 'position:absolute; left:-10000px; top:-10000px; width:0px; height:0px;'
});
return k_form;
},

_k_onBeforeUploadHandler: function () {
var k_returnValue = true,
k_inputValue = this.k_getValue(),
k_storedConfig = this._k_storedConfig || {};
if (k_storedConfig.k_onBeforeUpload) {
k_returnValue = k_storedConfig.k_onBeforeUpload.call(this, this.k_parent, this, k_inputValue);
}
return k_returnValue;
},

k_upload: function (k_reset) {
k_reset = false !== k_reset;
if (false === this._k_onBeforeUploadHandler()) {
return;
}
if (!this.k_getValue()) {  return;
}
var k_inputFile = this.k_extWidget._kx.k_fileInput,
k_uploadForm = this._k_uploadForm,
k_remoteData = this._k_storedConfig.k_remoteData,
k_jsonRpc = kerio.lib._k_cloneObject(k_remoteData.k_jsonRpc) || {},
k_requestCfg;
if (!k_uploadForm) {
k_uploadForm = this._k_initUploadForm();
this._k_uploadForm = k_uploadForm;
}
k_inputFile.appendTo(k_uploadForm);
k_jsonRpc.params = Ext.apply(k_jsonRpc.params || {}, this._k_additionalRequestParams);
k_requestCfg = {
k_url: k_remoteData.k_url,
k_method: 'post',
k_jsonRpc: k_jsonRpc,
k_form: k_uploadForm,
k_isFileUpload: true,
k_isOneStepUpload: k_remoteData.k_isOneStepUpload,
k_timeout: k_remoteData.k_timeout || 3600000, k_scope: this,
k_callback: this._k_uploadCallback,
k_onError: this._k_errorCallback
};
kerio.lib.k_ajax.k_request(k_requestCfg);
if (k_reset) {
this.k_resetInputFile();
}
},

k_resetInputFile: function() {
var k_inputFile = this.k_extWidget._kx.k_fileInput;
k_inputFile.removeAllListeners();
k_inputFile.remove();
this.k_extWidget._kxp.k_initFileInput.call(this.k_extWidget);
},

k_setAdditionalRequestParams: function (k_params) {
if (!this._k_additionalRequestParams) {
this._k_additionalRequestParams = {};
}
this._k_additionalRequestParams = Ext.apply(this._k_additionalRequestParams, k_params);
},

k_reset: function () {
var k_extWidget = this.k_extWidget,
k_inputFile = k_extWidget._kx.k_fileInput;
kerio.lib.K_UploadButton.superclass.k_reset.call(this);

if (k_extWidget.rendered) {
k_inputFile.removeAllListeners();
k_inputFile.remove();
k_extWidget._kxp.k_initFileInput.call(k_extWidget);
}
},

_k_setReadOnlyItem: function(k_readOnly){
var k_extWidget = this.k_extWidget,
k_fileInput = k_extWidget._kx.k_fileInput,
k_stackLength = this._k_getStackLength();
kerio.lib.K_UploadButton.superclass._k_setReadOnlyItem.call(this);
if (this._k_isExecutionDeferredAfterRender(arguments.callee, arguments, k_stackLength)) {
return;
}
if (kerio.lib.k_browserInfo._k_currentBrowser.k_webKitVersion >= 534) {
k_fileInput.dom.style.visibility = (k_readOnly || this.k_isDisabled()) ? 'hidden' : 'visible';
}
else {
k_fileInput.dom.disabled = k_readOnly || this.k_isDisabled();
}
k_fileInput[k_readOnly ? 'addClass' : 'removeClass']('readonly');
k_extWidget.button[k_readOnly ? 'addClass' : 'removeClass']('readonly');
},

_k_getIndentEl: function () {
return kerio.lib._K_FormItem.prototype._k_getIndentEl.apply(this, arguments);
}
});

kerio.lib._K_FileUploadButton = Ext.extend(Ext.form.TextField, {
hideLabel: true,
defaultAutoCreate: Ext.applyIf({
type: 'hidden'
}, Ext.form.TextField.prototype.defaultAutoCreate),

onRender: function (k_ct, k_position) {
kerio.lib._K_FileUploadButton.superclass.onRender.call(this, k_ct, k_position);
this.wrap = this.el.wrap({cls:'x-form-field-wrap fileUploadWrap'});
this.el.dom.removeAttribute('name');
var k_btnCfg = {
id: this.id + '_' + 'k_button',
text: this.text,
renderTo: this.wrap,
cls: 'fileInputButton',
minWidth: this.minWidth
};
this.button = new kerio.lib._K_SimpleButton(k_btnCfg);
this.wrap.setWidth(this.button.getEl().getWidth());
this._kxp.k_initFileInput.call(this);
},

onResize: function (w, h){
kerio.lib._K_FileUploadButton.superclass.onResize.call(this, w, h);
this.wrap.setWidth(w);
},

preFocus: Ext.emptyFn,

getResizeEl: function (){
return this.wrap;
},

getPositionEl: function (){
return this.wrap;
},

disable: function () {
kerio.lib._K_FileUploadButton.superclass.disable.call(this);
this._kxp._k_setDisabled.call(this, true);
},

enable: function () {
kerio.lib._K_FileUploadButton.superclass.enable.call(this);
this._kxp._k_setDisabled.call(this, false);
},

show: function() {
kerio.lib._K_FileUploadButton.superclass.show.call(this);
this._kxp._k_setVisible.call(this, true);
},

hide: function () {
kerio.lib._K_FileUploadButton.superclass.hide.call(this);
this._kxp._k_setVisible.call(this, false);
}
});

kerio.lib._K_FileUploadButton.prototype._kxp = Ext.apply({}, kerio.lib._K_FileUploadButton.prototype._kxp, {
k_initFileInput: function () {
var
k_fontSize = 50,
k_button = this.button,
k_buttonWidth = k_button.getEl().getWidth(),
k_fileInput = null;
k_fileInput = this.wrap.createChild({
id: this.id + '_' + 'k_file',
name: this.inputName,
cls: 'fileInput',
tag: 'input',
type: 'file',
size: 1
});
k_fileInput.on({
'change': this._kxp.k_onInputFileChange,
'touchstart': this._kxp.k_onInputFileOpen,
'click': this._kxp.k_onInputFileOpen,
scope: this
});
if (k_buttonWidth > 0) {
k_fontSize = Math.ceil(k_buttonWidth / 2);
}
k_fileInput.setStyle('font-size', k_fontSize + 'px');
k_fileInput.on({
'mouseover': this._kxp._k_addOverClass,
'mouseout' : this._kxp._k_removeOverClass,
scope: this
});
k_fileInput.on('mousedown', k_button.onMouseDown, k_button);
kerio.lib._k_addKerioProperty(this, {k_fileInput: k_fileInput});
this._kxp._k_setDisabled.call(this, true === this.disabled);
},
k_onInputFileOpen: function () {
this._kx.k_fileInput.dom.value = '';
},
k_onInputFileChange: function () {
var k_value = this._kx.k_fileInput.dom.value;
if (Ext.isGecko) { this._kxp._k_removeOverClass.call(this);
}
this.setValue(k_value);
this.fireEvent('fileselected', this, k_value);
},

_k_addOverClass: function () {
this.button.el.addClass(this.button.overClass);
},

_k_removeOverClass: function () {
this.button.el.removeClass(this.button.overClass);
},

_k_setDisabled: function (k_disable) {
var k_fileInput;
if (!this.rendered) {
return;
}
k_fileInput = this._kx.k_fileInput;
this.button[k_disable ? 'disable' : 'enable']();
if (kerio.lib.k_browserInfo._k_currentBrowser.k_webKitVersion >= 534) {
k_fileInput.dom.style.visibility = (k_disable || this._kx.k_owner.k_isReadOnly()) ? 'hidden' : 'visible';
}
else {
k_fileInput.dom.disabled = k_disable || this._kx.k_owner.k_isReadOnly();
}
k_fileInput[k_disable ? 'addClass' : 'removeClass']('disabled');
},

_k_setVisible: function (k_show) {
if (!this.rendered) {
return;
}
this.wrap.setDisplayed(k_show);
}
});


kerio.lib.K_ImageField = function(k_id, k_config) {
kerio.lib.K_ImageField.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_ImageField, kerio.lib._K_FormItem,
{




_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib._K_FormItem, {
k_height: 'height'
}),

_k_propertiesDefault: {
cls: 'formImage %+'
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = new kerio.lib._K_ImageField(k_adaptedConfig);
return k_extWidget;
}
});

kerio.lib._K_ImageField = Ext.extend(Ext.form.Field, {
hideLabel: true,
defaultAutoCreate: {
tag: 'img',
border: 0
},

onRender: function (k_ct, k_position) {
var k_dom = null,
k_baseSourceName = '',
k_id;
kerio.lib._K_ImageField.superclass.onRender.call(this, k_ct, k_position);
k_dom = this.el.dom;
k_baseSourceName = this._kxp._k_getBaseSourceName.call(this, this.value);
this._kxp._k_setAltText.call(this, k_baseSourceName);
if (Ext.isSafari && k_dom.hasAttribute('id')) {
k_id = k_dom.id;
k_dom.removeAttribute('id');
k_dom.removeAttribute('name');
k_dom.id = k_id;
}
else {
k_dom.removeAttribute('name');
}
},

preFocus: Ext.emptyFn,

initValue: function () {
if (undefined !== this.value) {
this.setValue(this.value);
}
},

setValue: function (k_value) {
var k_baseSourceName = '';
this.value = k_value;
if(this.rendered){
this.el.dom.src = k_value || '';
k_baseSourceName = this._kxp._k_getBaseSourceName.call(this, k_value);
this._kxp._k_setAltText.call(this, k_baseSourceName);
}
},

getValue: function () {
return this.value;
},

setSize: function(k_width, k_height) {
var	k_size = {};
kerio.lib._K_ImageField.superclass.setSize.call(this, k_width, k_height);
if (this.rendered) {
if('object' !== Ext.type(k_width)){
k_size.k_width = k_width;
k_size.k_height = k_height;
}
else {
k_size = k_width;
}
this._kxp._k_setImageSize.call(this, k_size);
}
}
});

kerio.lib._K_ImageField.prototype._kxp = Ext.apply({}, kerio.lib._K_ImageField.prototype._kxp, {

_k_setImageSize: function (k_size) {
var k_dom = null;
if (!this.rendered) {
return;
}
k_dom = this.el.dom;
if (undefined !== k_size.k_width) {
k_dom.setAttribute('width', k_size.k_width);
}
if (undefined !== k_size.k_height) {
k_dom.setAttribute('height', k_size.k_height);
}
},

_k_getBaseSourceName: function (k_source) {
if (!k_source) {
return '';
}
var k_baseSourceName = k_source.substr(k_source.lastIndexOf('/') + 1),
k_lastQuestionMark = k_baseSourceName.lastIndexOf('?');
if (-1 !== k_lastQuestionMark) {
k_baseSourceName = k_baseSourceName.substr(0, k_lastQuestionMark);
}
return k_baseSourceName;
},

_k_setAltText: function (k_altText) {
if (this.rendered) {
this.el.dom.setAttribute('alt', k_altText);
}
}
});


kerio.lib.K_Slider = function(k_id, k_config) {
kerio.lib.K_Slider.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_Slider, kerio.lib._K_FormItem,
{




_k_propertiesMapping: kerio.lib._k_extendPropertiesMapping(kerio.lib._K_FormItem, {
k_minValue: 'minValue',
k_maxValue: 'maxValue',
k_increment: 'increment'
}),

_k_propertiesDefault: {
cls: 'formSlider %+',
hideLabel: true, animate: false },
_k_isHtmlReadOnly: false,
_k_beforeInitExtComponent: function (k_adaptedConfig, k_storedConfig) {
var k_multiplier = 1;
if (k_adaptedConfig.increment < 1) {
k_multiplier = 1 / k_adaptedConfig.increment;
k_adaptedConfig.increment *= k_multiplier;
k_adaptedConfig.value *= k_multiplier;
k_adaptedConfig.minValue *= k_multiplier;
k_adaptedConfig.maxValue *= k_multiplier;
}
k_adaptedConfig.hideLabel =	!k_adaptedConfig.fieldLabel;
this._k_multiplier = k_multiplier;
},

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_extWidget = new Ext.slider.SingleSlider(k_adaptedConfig);
k_extWidget.on('change', this._k_onChangeHandler, this);
if (kerio.lib.k_isIPadCompatible) {
k_extWidget.on('render', this._k_setTouchEvents, this);
k_extWidget.clickRange = [0, 30];
}
return k_extWidget;
},
k_getValue: function () {
return this.k_extWidget.getValue() / this._k_multiplier;
},

k_setValue: function (k_value, k_isInitial) {
k_value = k_value * this._k_multiplier;
kerio.lib.K_Slider.superclass.k_setValue.call(this, k_value, k_isInitial);
},

_k_setTouchEvents: function() {
var
k_config,
k_touchControler;
k_config = {
k_element: this.k_extWidget.el.dom,
k_onSingleTap: this._k_onSingleTap,
k_onTouchMove: this._k_onTouchMove,
k_scope: this,
k_preventDefault: true
};
if (this._k_storedConfig.k_contextMenu) {
k_config.k_onDoubleTap = this._k_onDoubleTap;
}
k_touchControler = new kerio.lib.K_TouchController(k_config);
},

_k_onSingleTap: function(k_touchStatus) {
this.k_extWidget.onMouseDown(k_touchStatus.k_createExtEventFromTouch('click'));
},

_k_onTouchMove: function(k_touchStatus) {
var k_local;
if (this.k_isDisabled() || this.k_isReadOnly()) {
return;
}
k_local = this.k_extWidget.innerEl.translatePoints([k_touchStatus.k_currentX, k_touchStatus.k_currentY]);
this.k_extWidget.onClickChange(k_local);
}
});
Ext.Slider.prototype.isFormField = true;

kerio.lib.K_Form.prototype.k_patchAutoFill = (function() {
var
k_patchFormAutofill = false,
k_webKitVersion = kerio.lib.k_browserInfo._k_currentBrowser.k_webKitVersion;
if (Ext.isWebKit && k_webKitVersion >= 537) {
k_patchFormAutofill = true;
if (k_webKitVersion === 537) {
k_patchFormAutofill = false;
if (new RegExp('WebKit/\\d+\\.(\\d+)').test(navigator.userAgent) && RegExp.$1 > (Ext.isSafari ? 73 : 35)) {
k_patchFormAutofill = true;
}
}
}
if (k_patchFormAutofill) {
return function() {
this.k_extWidget.on('afterrender', function() {
var k_dummyPassword = document.createElement('input');
k_dummyPassword.setAttribute('readonly', 'readonly');
k_dummyPassword.type = 'password';
k_dummyPassword.style.width = '2px';
k_dummyPassword.style.height = '2px';
k_dummyPassword.style.border = '0px none';
this.form.el.dom.appendChild(k_dummyPassword);
});
};
}
else {
return Ext.emptyFn;
}
}());


kerio.lib.K_Wizard = function(k_id, k_config) {
this._k_showPageHeader = false !== k_config.k_showPageHeader;
this._k_pageHeaderTemplateDef = '<div class="wizardHeader">{k_tabTitle} - {k_translation}</div>';
this._k_tabsByIndex = [];
this.k_hiddenTabsByIndex = [];
this.k_activeTabIndex = 0;
this._k_status = {
k_firstTabReached: false,
k_lastTabReached: false,
k_toolbar: null,
k_prevButtonId: null,
k_nextButtonId: null,
k_finishButtonId: null
};
this._k_pageHeaderTemplate = null;
kerio.lib.K_Wizard.superclass.constructor.call(this, k_id, k_config);
this._k_createIndexMap();
this.k_extWidget.on('render', function(){
this._k_hideTabBar();
this._k_moveTab(0);
}, this);
this.k_extWidget.on('tabchange', this._k_updateWizardStatus, this);
};
Ext.extend(kerio.lib.K_Wizard, kerio.lib.K_TabPage,
{



_k_propertiesDefault: kerio.lib._k_extendPropertiesDefault(kerio.lib.K_TabPage, {
cls: 'wizard %+'
}),

_k_hideTabBar: function() {
var k_tabBarElement = this.k_extWidget.header.child('.x-tab-strip-wrap');
if (this._k_showPageHeader) {
k_tabBarElement.applyStyles('display: none');
}
else {
k_tabBarElement.applyStyles('display: none');
}
},

_k_initHeaderTemplate: function () {
var k_tabBarElement = this.k_extWidget.header.child('.x-tab-strip-wrap');
var k_pageHeaderTemplate = new Ext.Template(this._k_pageHeaderTemplateDef);
k_pageHeaderTemplate.compile();
k_pageHeaderTemplate.k_parent = k_tabBarElement.insertSibling({tag: 'div', id: this.k_id + '_header'}, 'before');
this._k_pageHeaderTemplate = k_pageHeaderTemplate;
},

_k_createIndexMap: function() {
var k_extTabItem;
var _k_tabsByIndex = this._k_tabsByIndex;
var k_extWidget = this.k_extWidget;
var k_activeTab = k_extWidget.getActiveTab();
for (var k_tabId in this.k_items) {
if (k_tabId.indexOf(this._k_tabPageIdPrefix) !== -1) {
k_tabId = k_tabId.substr(this._k_tabPageIdPrefix.length);
}
k_extTabItem = this._k_getTab(k_tabId);
if (k_extTabItem instanceof Ext.Panel) {    _k_tabsByIndex.push(k_tabId);
if (k_activeTab && (k_activeTab.getId() === k_extTabItem.getId())) {
this.k_activeTabIndex = _k_tabsByIndex.length - 1;
}
}
}
},

_k_moveTab: function(k_direction) {
var
k_activeTabIndex = this.k_activeTabIndex,
k_newIndex = k_activeTabIndex + k_direction,
k_tabsCount = this.k_extWidget.items.getCount(),
k_hiddenCount = this.k_hiddenTabsByIndex.length,
k_tabId, k_i;
if (k_hiddenCount > 0) {
if (0 !== k_direction) {
for (k_i = k_newIndex; k_i >= 0; k_i--) {
if (this._k_isHidden(k_newIndex)) {
k_newIndex += k_direction;
}
}
}
else if (0 === k_activeTabIndex) { for (k_i = 0; k_i < k_tabsCount; k_i++) {
if (this._k_isHidden(k_activeTabIndex)) {
k_activeTabIndex++;
k_newIndex++;
}
}
}
}
if (k_newIndex < k_tabsCount && k_newIndex >= 0) {
k_tabId = this._k_tabsByIndex[k_newIndex];
if (this._k_getTab(k_tabId).id !== this.k_extWidget.getActiveTab().id) {
kerio.lib.K_TabPage.prototype.k_setActiveTab.call(this, k_tabId);
}
else {
this._k_updateWizardStatus();
}
}
},

k_prev: function(k_validate) {
var k_step = -1;
if (true === k_validate) { this._k_validateBeforeMoveTab(k_step);
}
else {
this._k_moveTab(k_step);
}
},

k_next: function(k_validate) {
var k_step = +1;
if (true === k_validate) { this._k_validateBeforeMoveTab(k_step);
}
else {
this._k_moveTab(k_step);
}
},

_k_validateBeforeMoveTab: function(k_step) {
var
k_tabIndex = this.k_getActiveTabIndex(),
k_widget = this.k_getTabContent(this._k_tabsByIndex[k_tabIndex]),
k_results = new kerio.lib._K_WizardValidationResults(this);
if (!k_widget || !k_widget._k_isValid) {
this._k_moveTab(k_step);
return;
}
k_results.k_add(k_widget._k_isValid(true));
if (k_results.k_isValid(true, k_step)) {
this._k_moveTab(k_step);
}
},

k_registerWizardButtons: function(k_config) {
var
k_buttonExtWidget,
k_toolbar = k_config.k_toolbar,
k_status = this._k_status,
k_validateBeforeClick = k_config.k_validateBeforeClick,
k_toolbarPrevButton = k_toolbar.k_items[k_config.k_prevButtonId],
k_toolbarNextButton = k_toolbar.k_items[k_config.k_nextButtonId];
if (false !== k_validateBeforeClick && true !== k_validateBeforeClick) { k_validateBeforeClick = kerio.lib.k_constants.k_DEFAULT_VALIDATION_STATUS;
}
k_status.k_toolbar = k_toolbar;
k_status.k_prevButtonId = k_config.k_prevButtonId;
k_status.k_nextButtonId = k_config.k_nextButtonId;
k_status.k_finishButtonId = k_config.k_finishButtonId;
k_status.k_validateBeforeClick = k_validateBeforeClick;
k_toolbarPrevButton.k_addReferences({
k_wizard: this,
k_validateBeforeClick: k_validateBeforeClick });
k_buttonExtWidget = k_toolbarPrevButton.k_extWidget;
k_buttonExtWidget.un('click', k_toolbarPrevButton._k_action._k_onClick, k_toolbarPrevButton._k_action);
k_buttonExtWidget.on('click', this._k_onPrevButtonClick, k_toolbarPrevButton);
k_toolbarNextButton.k_addReferences({
k_wizard: this,
k_validateBeforeClick: k_validateBeforeClick });
k_buttonExtWidget = k_toolbarNextButton.k_extWidget;
k_buttonExtWidget.un('click', k_toolbarNextButton._k_action._k_onClick, k_toolbarNextButton._k_action);
k_buttonExtWidget.on('click', this._k_onNextButtonClick, k_toolbarNextButton);
if (k_status.k_finishButtonId) {
k_toolbar.k_hideItem(k_status.k_finishButtonId);
}
},

_k_onPrevButtonClick: function() {
this.k_wizard._k_onPrevNextButtonClick.call(this, 'k_prev');
},

_k_onNextButtonClick: function() {
this.k_wizard._k_onPrevNextButtonClick.call(this, 'k_next');
},

_k_onPrevNextButtonClick: function (k_button) {
if (this._k_action._k_storedConfig.k_onClick) {
if (false === this._k_action._k_onClick(this.k_extWidget, Ext.EventObject)) {
return;
}
}
this.k_wizard[k_button](this.k_validateBeforeClick);
},

k_reset: function() {
this.k_setActiveTab(0);
},

k_setActiveTab: function(k_tabId) {
this.k_activeTabIndex = Ext.isString(k_tabId) ? this._k_getTabIndexFromId(k_tabId) : k_tabId;
this._k_moveTab(0);
},

k_hideTab: function(k_tabId) {
var k_hidden = this.k_hiddenTabsByIndex;
for (var k_i = 0, k_cnt = k_hidden.length; k_i < k_cnt; k_i++) {
if (k_hidden[k_i] === k_tabId) {
return;
}
}
k_hidden.push(k_tabId);
this._k_moveTab(0);
},

k_showTab: function(k_tabId) {
var k_hidden = this.k_hiddenTabsByIndex;
var k_newHiddenTabs = [];
for (var k_i = 0, k_cnt = k_hidden.length; k_i < k_cnt; k_i++) {
if (k_hidden[k_i] !== k_tabId) {
k_newHiddenTabs.push(k_hidden[k_i]);
}
}
this.k_hiddenTabsByIndex = k_newHiddenTabs;
this._k_moveTab(0);
},

k_getActiveTabIndex: function() {
return this.k_activeTabIndex;
},

_k_getTabIndexFromId: function (k_tabId) {
var
k_tabByIndex = this._k_tabsByIndex,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_tabByIndex.length; k_i < k_cnt; k_i++) {
if (k_tabByIndex[k_i] === k_tabId) {
return k_i;
}
}
return -1;
},

_k_isHidden: function(k_tabIndex) {
var
k_hiddenTabsByIndex = this.k_hiddenTabsByIndex,
k_cnt = k_hiddenTabsByIndex.length,
k_tabId = this._k_tabsByIndex[k_tabIndex],
k_i;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_tabId == k_hiddenTabsByIndex[k_i]) {
return true;
}
}
return false;
},

_k_isValid: function(k_markInvalid) {
var
k_results = new kerio.lib._K_ValidationResults(),
k_tabs = this.k_items,  k_tabIndex = -1,        k_tabId,                k_extTab,               k_childWidget;          for (k_tabId in k_tabs) {
k_extTab = k_tabs[k_tabId];
k_tabIndex++; if (!k_extTab || !k_extTab._kx || !k_extTab._kx.k_owner) {
continue; }
k_childWidget = k_extTab._kx.k_owner; if (!k_childWidget._k_isValid) {
continue; }
if (this._k_isHidden(k_tabIndex) || k_extTab.disabled) {
continue;
}
k_results.k_add(              k_childWidget._k_isValid(k_markInvalid),
k_results.k_valid         );
}
return k_results;
}, 
_k_updateWizardStatus: function () {
var
k_trConfig,
k_message,
k_i, k_j,
k_activeTabIndex,
k_extTab = this.k_extWidget.activeTab,
k_tabsCount = this.k_extWidget.items.getCount(),
k_hiddenCount = this.k_hiddenTabsByIndex.length,
k_status = this._k_status,
k_toolbar = k_status.k_toolbar,
k_tabsByIndex = this._k_tabsByIndex,
k_hiddenTabsByIndex = this.k_hiddenTabsByIndex,
k_hiddenBeforeCount = 0,
k_hiddenAfterCount = 0,
k_tr = kerio.lib.k_tr;
k_activeTabIndex = this._k_getTabIndexFromId(this._k_getTabIdFromContentId(k_extTab.id));
for (k_i = 0; k_i < k_tabsCount; k_i++) {
for (k_j = 0; k_j < k_hiddenCount; k_j++) {
if (k_i < k_activeTabIndex) { if (k_tabsByIndex[k_i] == k_hiddenTabsByIndex[k_j]) {
k_hiddenBeforeCount++;
}
}
else if (k_i > k_activeTabIndex) { if (k_tabsByIndex[k_i] == k_hiddenTabsByIndex[k_j]) {
k_hiddenAfterCount++;
}
}
}
}
if (this._k_showPageHeader) {
k_trConfig = { k_args: [k_activeTabIndex + 1 - k_hiddenBeforeCount], k_pluralityBy: k_tabsCount };
switch ((k_tabsCount - k_hiddenCount)) {
case 2: k_message = k_tr(	'page %1 of 2', 'wlibWizard', k_trConfig); break;
case 3: k_message = k_tr(	'page %1 of 3', 'wlibWizard', k_trConfig); break;
case 4: k_message = k_tr(	'page %1 of 4', 'wlibWizard', k_trConfig); break;
case 5: k_message = k_tr(	'page %1 of 5', 'wlibWizard', k_trConfig); break;
case 6: k_message = k_tr(	'page %1 of 6', 'wlibWizard', k_trConfig); break;
case 7: k_message = k_tr(	'page %1 of 7', 'wlibWizard', k_trConfig); break;
case 8: k_message = k_tr(	'page %1 of 8', 'wlibWizard', k_trConfig); break;
}
if (!this._k_pageHeaderTemplate) {
this._k_initHeaderTemplate();
}
this._k_pageHeaderTemplate.overwrite(this._k_pageHeaderTemplate.k_parent,
{k_tabTitle: k_extTab.title, k_translation: k_message}
);
}
k_status.k_firstTabReached = (k_activeTabIndex - k_hiddenBeforeCount <= 0);
k_status.k_lastTabReached = (k_activeTabIndex + k_hiddenAfterCount >= k_tabsCount - 1);
if (k_toolbar) {
k_toolbar.k_enableItem(k_status.k_prevButtonId, !k_status.k_firstTabReached);
k_toolbar.k_enableItem(k_status.k_nextButtonId, !k_status.k_lastTabReached);
if (k_status.k_finishButtonId) {
k_toolbar.k_showItem(k_status.k_nextButtonId, !k_status.k_lastTabReached);
k_toolbar.k_showItem(k_status.k_finishButtonId, k_status.k_lastTabReached);
}
}
this.k_activeTabIndex = k_activeTabIndex;
}
});    

kerio.lib.k_applyTranslations = function() {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_CURRENT_LANGUAGE = k_lib.k_engineConstants ? k_lib.k_engineConstants.k_CURRENT_LANGUAGE || null : null;
if (!k_CURRENT_LANGUAGE) {
k_lib.k_reportError('Internal Error: Engine constant \'k_CURRENT_LANGUAGE\' has to be set before kerio.lib.k_applyTranslations()', 'extLang.js');
return;
}
if (k_lib.k_isMSIE && ('zh' === k_CURRENT_LANGUAGE || 'ja' === k_CURRENT_LANGUAGE)) {
Ext.getBody().addClass('fixLangZhJa');
}
Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">' + k_tr("Loading…", "wlibWait") + '</div>';
if(Ext.DataView){
Ext.DataView.prototype.emptyText = '';
}
if(Ext.grid.GridPanel){
Ext.grid.GridPanel.prototype.ddText = k_tr("{0} selected row{1}", "wlibGrid");
}
if(Ext.TabPanelItem){
Ext.TabPanelItem.prototype.closeText = k_tr("Close this tab", "wlibCommon");
}
if(Ext.LoadMask){
Ext.LoadMask.prototype.msg = k_tr("Loading…", "wlibWait");
}
Date.monthNames = [
k_tr("January", "wlibCalendar"),
k_tr("February", "wlibCalendar"),
k_tr("March", "wlibCalendar"),
k_tr("April", "wlibCalendar"),
k_tr("May", "wlibCalendar"),
k_tr("June", "wlibCalendar"),
k_tr("July", "wlibCalendar"),
k_tr("August", "wlibCalendar"),
k_tr("September", "wlibCalendar"),
k_tr("October", "wlibCalendar"),
k_tr("November", "wlibCalendar"),
k_tr("December", "wlibCalendar")
];
Date.getShortMonthName = function(month) {
return Date.monthNames[month].substring(0, 3);
};
Date.monthNumbers = {
Jan : 0,
Feb : 1,
Mar : 2,
Apr : 3,
May : 4,
Jun : 5,
Jul : 6,
Aug : 7,
Sep : 8,
Oct : 9,
Nov : 10,
Dec : 11
};
Date.getMonthNumber = function(name) {
return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};
Date.dayNames = [
k_tr("Sunday", "wlibCalendar"),
k_tr("Monday", "wlibCalendar"),
k_tr("Tuesday", "wlibCalendar"),
k_tr("Wednesday", "wlibCalendar"),
k_tr("Thursday", "wlibCalendar"),
k_tr("Friday", "wlibCalendar"),
k_tr("Saturday", "wlibCalendar")
];
Date.getShortDayName = function(day) {
return Date.dayNames[day].substring(0, 3);
};
if(Ext.MessageBox){
Ext.MessageBox.buttonText = {
ok     : k_tr("OK", "wlibButtons"),
cancel : k_tr("Cancel", "wlibButtons"),
yes    : k_tr("Yes", "wlibButtons"),
no     : k_tr("No", "wlibButtons")
};
}
if(Ext.util.Format){
Ext.util.Format.date = function(v, format){
if(!v) {return '';}
if(!(v instanceof Date)) {v = new Date(Date.parse(v));}
return v.dateFormat(format || "m/d/Y");  };
}
if(Ext.DatePicker){
Ext.apply(Ext.DatePicker.prototype, {
todayText         : k_tr("Today", "wlibCalendar"),
minText           : k_tr("This date is before the earliest possible date", "wlibCalendar"),
maxText           : k_tr("This date is after the latest possible date", "wlibCalendar"),
disabledDaysText  : '',
disabledDatesText : '',
monthNames        : Date.monthNames,
dayNames          : Date.dayNames,
nextText          : k_tr("Next Month (Control+Right)", "wlibCalendar"),
prevText          : k_tr("Previous Month (Control+Left)", "wlibCalendar"),
monthYearText     : k_tr("Choose a month (Control+Up/Down to move years)", "wlibCalendar"),
todayTip          : k_tr("{0} (Spacebar)", "wlibCalendar"),
format            : "m/d/y", okText            : "&#160;" + k_tr("OK", "wlibButtons") + "&#160;",
cancelText        : k_tr("Cancel", "wlibButtons"),
startDay          : 0
});
}
if(Ext.PagingToolbar){
Ext.apply(Ext.PagingToolbar.prototype, {
beforePageText : k_tr("Page", "wlibGrid"),
afterPageText  : k_tr("of {0}", "wlibGrid"),
firstText      : k_tr("First Page", "wlibGrid"),
prevText       : k_tr("Previous Page", "wlibGrid"),
nextText       : k_tr("Next Page", "wlibGrid"),
lastText       : k_tr("Last Page", "wlibGrid"),
refreshText    : k_tr("Refresh", "wlibGrid"),
displayMsg     : k_tr("Displaying {0} - {1} of {2}", "wlibGrid"),
emptyMsg       : k_tr("No data to display", "wlibGrid")
});
}
if(Ext.form.Field){
Ext.form.Field.prototype.invalidText = k_tr("The value in this field is invalid", "wlibAlerts");
}
if(Ext.form.TextField){
Ext.apply(Ext.form.TextField.prototype, {
minLengthText : k_tr("The minimum length for this field is {0}", "wlibAlerts"),
maxLengthText : k_tr("The maximum length for this field is {0}", "wlibAlerts"),
blankText     : k_tr("This field is required", "wlibAlerts"),
regexText     : '',
emptyText     : null
});
}
if(Ext.form.NumberField){
Ext.apply(Ext.form.NumberField.prototype, {
decimalSeparator : ".",
decimalPrecision : 2,
minText : k_tr("The minimum value for this field is {0}", "wlibAlerts"),
maxText : k_tr("The maximum value for this field is {0}", "wlibAlerts"),
nanText : k_tr("{0} is not a valid number", "wlibAlerts")
});
}
if(Ext.form.DateField){
Ext.apply(Ext.form.DateField.prototype, {
disabledDaysText  : k_tr("Disabled", "wlibCalendar"),
disabledDatesText : k_tr("Disabled", "wlibCalendar"),
minText           : k_tr("The date in this field must be after {0}", "wlibCalendar"),
maxText           : k_tr("The date in this field must be before {0}", "wlibCalendar"),
invalidText       : k_tr("{0} is not a valid date - it must follow the pattern {1}", "wlibCalendar"),
format            : "m/d/y",  altFormats        : "m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d"  });
}
if(Ext.form.ComboBox){
Ext.apply(Ext.form.ComboBox.prototype, {
loadingText       : k_tr("Loading…", "wlibWait"),
valueNotFoundText : undefined
});
}
if(Ext.form.VTypes){
Ext.apply(Ext.form.VTypes, {
emailText    : k_tr("You have made some changes. Please click on the Apply button to save the changes first.", "wlibAlerts"),
urlText      : k_tr("This field should be a URL following the pattern ", "wlibAlerts")+k_tr("/www.domain.com", "wlibAlerts"),
alphaText    : k_tr("This field should only contain letters and _", "wlibAlerts"),
alphanumText : k_tr("This field should only contain letters, numbers and _", "wlibAlerts")
});
}
if(Ext.form.HtmlEditor){
Ext.apply(Ext.form.HtmlEditor.prototype, {
createLinkText : k_tr("Please enter the URL for the link:", "wlibHtmlEditor"),
buttonTips : {
bold : {
title: k_tr("Bold (Ctrl+B)", "wlibHtmlEditor"),
text: k_tr("Make the selected text bold.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
},
italic : {
title: k_tr("Italic (Ctrl+I)", "wlibHtmlEditor"),
text: k_tr("Make the selected text italic.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
},
underline : {
title: k_tr("Underline (Ctrl+U)", "wlibHtmlEditor"),
text: k_tr("Underline the selected text.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
},
increasefontsize : {
title: k_tr("Grow Text", "wlibHtmlEditor"),
text: k_tr("Increase the font size.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
},
decreasefontsize : {
title: k_tr("Shrink Text", "wlibHtmlEditor"),
text: k_tr("Decrease the font size.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
},
backcolor : {
title: k_tr("Text Highlight Color", "wlibHtmlEditor"),
text: k_tr("Change the background color of the selected text.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
},
forecolor : {
title: k_tr("Font Color", "wlibHtmlEditor"),
text: k_tr("Change the color of the selected text.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
},
justifyleft : {
title: k_tr("Align Text Left", "wlibHtmlEditor"),
text: k_tr("Align text to the left.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
},
justifycenter : {
title: k_tr("Center Text", "wlibHtmlEditor"),
text: k_tr("Center text in the editor.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
},
justifyright : {
title: k_tr("Align Text Right", "wlibHtmlEditor"),
text: k_tr("Align text to the right.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
},
insertunorderedlist : {
title: k_tr("Bullet List", "wlibHtmlEditor"),
text: k_tr("Start a bulleted list.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
},
insertorderedlist : {
title: k_tr("Numbered List", "wlibHtmlEditor"),
text: k_tr("Start a numbered list.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
},
createlink : {
title: k_tr("Hyperlink", "wlibHtmlEditor"),
text: k_tr("Make the selected text a hyperlink.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
},
sourceedit : {
title: k_tr("Source Edit", "wlibHtmlEditor"),
text: k_tr("Switch to the source editing mode.", "wlibHtmlEditor"),
cls: "x-html-editor-tip"
}
}
}
);
}
if(Ext.grid.GridView){
Ext.apply(Ext.grid.GridView.prototype, {
sortAscText  : k_tr("Sort Ascending", "wlibGrid"),
sortDescText : k_tr("Sort Descending", "wlibGrid"),
columnsText  : k_tr("Columns", "wlibGrid"),
emptyText    : k_tr("Nothing to display", "wlibGrid")
});
}
if(Ext.grid.GroupingView){
Ext.apply(Ext.grid.GroupingView.prototype, {
emptyGroupText : k_tr("(None)", "wlibGrid"),
groupByText    : k_tr("Group By This Field", "wlibGrid"),
showGroupsText : k_tr("Show in Groups", "wlibGrid")
});
}

if(Ext.grid.BooleanColumn){
Ext.apply(Ext.grid.BooleanColumn.prototype, {
trueText  : k_tr('true', 'wlibGrid'),
falseText : k_tr('false', 'wlibGrid'),
undefinedText: '&#160;'
});
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
splitTip            : k_tr("Drag to resize.", "wlibCommon"),
collapsibleSplitTip : k_tr("Drag to resize. Double-click to hide.", "wlibCommon")
});
}
if(Ext.form.TimeField){
Ext.apply(Ext.form.TimeField.prototype, {
minText : k_tr("The time in this field must be equal to or after {0}", "wlibTime"),
maxText : k_tr("The time in this field must be equal to or before {0}", "wlibTime"),
invalidText : k_tr("{0} is not a valid time", "wlibTime"),
format : "g:i A",  altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H"  });
}
if(Ext.form.CheckboxGroup){
Ext.apply(Ext.form.CheckboxGroup.prototype, {
blankText : k_tr("You must select at least one item in this group", "wlibAlerts")
});
}
if(Ext.form.RadioGroup){
Ext.apply(Ext.form.RadioGroup.prototype, {
blankText : k_tr("You must select one item in this group", "wlibAlerts")
});
}
if (k_lib.k_ajax) {
Ext.apply(k_lib.k_ajax, { _k_errorMessagesDefaults: {
k_connectionTimeout: k_tr('The server is not responding.', 'wlibAjax'),
k_invalidResponse: k_tr('The server returned an invalid response.', 'wlibAjax')
}
});
}
if (k_lib.K_Dialog) {
k_lib.K_Dialog.prototype._k_maskCfgDefaults = {
k_message: k_tr('Saving…', 'wlibWait')
};
}
if (k_lib.K_Grid) {
Ext.apply(k_lib.K_Grid.prototype, {
_k_printText: k_tr('Print', 'wlibCommon'),
_k_printPreviewText: k_tr('Print Preview', 'wlibCommon'),
_k_dragNotAllowedText: k_tr('This row is not draggable', 'wlibGrid'),
_k_checkAllMenuCaptions: {
k_checkAll: k_tr('Check All', 'wlibGrid'),
k_uncheckAll: k_tr('Uncheck All', 'wlibGrid'),
k_checkSelected: k_tr('Check Selected', 'wlibGrid'),
k_uncheckSelected: k_tr('Uncheck Selected', 'wlibGrid')
},
_k_checkAllButtonToolTip: k_tr('Check/uncheck items', 'wlibGrid')
});
}
if (k_lib._K_GridRowDragZone) {
Ext.apply(k_lib._K_GridRowDragZone.prototype, {
_k_emptyDraggedRowMsg: k_tr('empty', 'wlibGrid')
});
}
if (k_lib._K_FileUploadButton) {
Ext.apply(k_lib._K_FileUploadButton.prototype, {
text: k_tr('Browse…', 'wlibButtons')
});
}
if (k_lib.K_EmailField) {
Ext.apply(k_lib.K_EmailField.prototype, {
_k_defaultCaption: k_tr('Email:', 'wlibCommon'),
_k_defaultInvalidMessage: k_tr('Enter a valid email address.', 'wlibCommon')
});
}
k_lib.k_constants.k_languageList = [
{k_id: 'cs', k_className: 'flag cs', k_caption: 'Čeština'   , k_localizedCaption: k_tr('Czech'     , 'wlibLanguages'), k_name: 'Czech'     },
{k_id: 'de', k_className: 'flag de', k_caption: 'Deutsch'   , k_localizedCaption: k_tr('German'    , 'wlibLanguages'), k_name: 'German'    },
{k_id: 'en', k_className: 'flag en', k_caption: 'English'   , k_localizedCaption: k_tr('English'   , 'wlibLanguages'), k_name: 'English'   },
{k_id: 'es', k_className: 'flag es', k_caption: 'Español'   , k_localizedCaption: k_tr('Spanish'   , 'wlibLanguages'), k_name: 'Spanish'   },
{k_id: 'fr', k_className: 'flag fr', k_caption: 'Français'  , k_localizedCaption: k_tr('French'    , 'wlibLanguages'), k_name: 'French'    },
{k_id: 'hr', k_className: 'flag hr', k_caption: 'Hrvatski'  , k_localizedCaption: k_tr('Croatian'  , 'wlibLanguages'), k_name: 'Croatian'  },
{k_id: 'hu', k_className: 'flag hu', k_caption: 'Magyar'    , k_localizedCaption: k_tr('Hungarian' , 'wlibLanguages'), k_name: 'Hungarian' },
{k_id: 'it', k_className: 'flag it', k_caption: 'Italiano'  , k_localizedCaption: k_tr('Italian'   , 'wlibLanguages'), k_name: 'Italian'   },
{k_id: 'ja', k_className: 'flag ja', k_caption: '日本語'     , k_localizedCaption: k_tr('Japanese'  , 'wlibLanguages'), k_name: 'Japanese'  },
{k_id: 'nl', k_className: 'flag nl', k_caption: 'Nederlands', k_localizedCaption: k_tr('Dutch'     , 'wlibLanguages'), k_name: 'Dutch'     },
{k_id: 'pl', k_className: 'flag pl', k_caption: 'Polski'    , k_localizedCaption: k_tr('Polish'    , 'wlibLanguages'), k_name: 'Polish'    },
{k_id: 'pt', k_className: 'flag pt', k_caption: 'Português' , k_localizedCaption: k_tr('Portuguese', 'wlibLanguages'), k_name: 'Portuguese'},
{k_id: 'ru', k_className: 'flag ru', k_caption: 'Русский'   , k_localizedCaption: k_tr('Russian'   , 'wlibLanguages'), k_name: 'Russian'   },
{k_id: 'sk', k_className: 'flag sk', k_caption: 'Slovenčina', k_localizedCaption: k_tr('Slovak'    , 'wlibLanguages'), k_name: 'Slovak'    },
{k_id: 'sv', k_className: 'flag sv', k_caption: 'Svenska'   , k_localizedCaption: k_tr('Swedish'   , 'wlibLanguages'), k_name: 'Swedish'   },
{k_id: 'zh', k_className: 'flag zh', k_caption: '中文'       , k_localizedCaption: k_tr('Chinese'   , 'wlibLanguages'), k_name: 'Chinese'   }
];
k_lib.k_constants.k_maskCfg.k_message = k_tr('Loading…', 'wlibWait');
k_lib.k_constants.k_countryItems = [
{k_value: 'AF', k_name: k_tr('Afghanistan', 'wlibCountries')},
{k_value: 'AX', k_name: k_tr('Aland Islands', 'wlibCountries')},
{k_value: 'AL', k_name: k_tr('Albania', 'wlibCountries')},
{k_value: 'DZ', k_name: k_tr('Algeria', 'wlibCountries')},
{k_value: 'AS', k_name: k_tr('American Samoa', 'wlibCountries')},
{k_value: 'AD', k_name: k_tr('Andorra', 'wlibCountries')},
{k_value: 'AO', k_name: k_tr('Angola', 'wlibCountries')},
{k_value: 'AI', k_name: k_tr('Anguilla', 'wlibCountries')},
{k_value: 'AQ', k_name: k_tr('Antarctica', 'wlibCountries')},
{k_value: 'AG', k_name: k_tr('Antigua and Barbuda', 'wlibCountries')},
{k_value: 'AN', k_name: k_tr('Antilles - Netherlands', 'wlibCountries')},
{k_value: 'AR', k_name: k_tr('Argentina', 'wlibCountries')},
{k_value: 'AM', k_name: k_tr('Armenia', 'wlibCountries')},
{k_value: 'AW', k_name: k_tr('Aruba', 'wlibCountries')},
{k_value: 'AU', k_name: k_tr('Australia', 'wlibCountries')},
{k_value: 'AT', k_name: k_tr('Austria', 'wlibCountries')},
{k_value: 'AZ', k_name: k_tr('Azerbaijan', 'wlibCountries')},
{k_value: 'BS', k_name: k_tr('Bahamas', 'wlibCountries')},
{k_value: 'BH', k_name: k_tr('Bahrain', 'wlibCountries')},
{k_value: 'BD', k_name: k_tr('Bangladesh', 'wlibCountries')},
{k_value: 'BB', k_name: k_tr('Barbados', 'wlibCountries')},
{k_value: 'BY', k_name: k_tr('Belarus', 'wlibCountries')},
{k_value: 'BE', k_name: k_tr('Belgium', 'wlibCountries')},
{k_value: 'BZ', k_name: k_tr('Belize', 'wlibCountries')},
{k_value: 'BJ', k_name: k_tr('Benin', 'wlibCountries')},
{k_value: 'BM', k_name: k_tr('Bermuda', 'wlibCountries')},
{k_value: 'BT', k_name: k_tr('Bhutan', 'wlibCountries')},
{k_value: 'BO', k_name: k_tr('Bolivia', 'wlibCountries')},
{k_value: 'BQ', k_name: k_tr('Bonaire, Sint Eustatius and Saba', 'wlibCountries'), k_hidden: true},
{k_value: 'BA', k_name: k_tr('Bosnia and Herzegovina', 'wlibCountries')},
{k_value: 'BW', k_name: k_tr('Botswana', 'wlibCountries')},
{k_value: 'BV', k_name: k_tr('Bouvet Island', 'wlibCountries')},
{k_value: 'BR', k_name: k_tr('Brazil', 'wlibCountries')},
{k_value: 'IO', k_name: k_tr('British Indian Ocean Territory', 'wlibCountries')},
{k_value: 'BN', k_name: k_tr('Brunei Darussalam', 'wlibCountries')},
{k_value: 'BG', k_name: k_tr('Bulgaria', 'wlibCountries')},
{k_value: 'BF', k_name: k_tr('Burkina Faso', 'wlibCountries')},
{k_value: 'BI', k_name: k_tr('Burundi', 'wlibCountries')},
{k_value: 'KH', k_name: k_tr('Cambodia', 'wlibCountries')},
{k_value: 'CM', k_name: k_tr('Cameroon', 'wlibCountries')},
{k_value: 'CA', k_name: k_tr('Canada', 'wlibCountries')},
{k_value: 'CV', k_name: k_tr('Cape Verde', 'wlibCountries')},
{k_value: 'KY', k_name: k_tr('Cayman Islands', 'wlibCountries')},
{k_value: 'CF', k_name: k_tr('Central African Republic', 'wlibCountries')},
{k_value: 'TD', k_name: k_tr('Chad', 'wlibCountries')},
{k_value: 'CL', k_name: k_tr('Chile', 'wlibCountries')},
{k_value: 'CN', k_name: k_tr('China', 'wlibCountries')},
{k_value: 'CX', k_name: k_tr('Christmas Island', 'wlibCountries')},
{k_value: 'CC', k_name: k_tr('Cocos (Keeling) Islands', 'wlibCountries')},
{k_value: 'CO', k_name: k_tr('Colombia', 'wlibCountries')},
{k_value: 'KM', k_name: k_tr('Comoros', 'wlibCountries')},
{k_value: 'CG', k_name: k_tr('Congo', 'wlibCountries')},
{k_value: 'CK', k_name: k_tr('Cook Islands', 'wlibCountries')},
{k_value: 'CR', k_name: k_tr('Costa Rica', 'wlibCountries')},
{k_value: 'CI', k_name: k_tr('Cote D\'Ivoire (Ivory Coast)', 'wlibCountries')},
{k_value: 'HR', k_name: k_tr('Croatia (Hrvatska)', 'wlibCountries')},
{k_value: 'CU', k_name: k_tr('Cuba', 'wlibCountries')},
{k_value: 'CW', k_name: k_tr('Curaçao', 'wlibCountries'), k_hidden: true},
{k_value: 'CY', k_name: k_tr('Cyprus', 'wlibCountries')},
{k_value: 'CZ', k_name: k_tr('Czech Republic', 'wlibCountries')},
{k_value: 'CD', k_name: k_tr('Democratic Republic of the Congo', 'wlibCountries')},
{k_value: 'DK', k_name: k_tr('Denmark', 'wlibCountries')},
{k_value: 'DJ', k_name: k_tr('Djibouti', 'wlibCountries')},
{k_value: 'DM', k_name: k_tr('Dominica', 'wlibCountries')},
{k_value: 'DO', k_name: k_tr('Dominican Republic', 'wlibCountries')},
{k_value: 'TP', k_name: k_tr('East Timor', 'wlibCountries')},
{k_value: 'EC', k_name: k_tr('Ecuador', 'wlibCountries')},
{k_value: 'EG', k_name: k_tr('Egypt', 'wlibCountries')},
{k_value: 'SV', k_name: k_tr('El Salvador', 'wlibCountries')},
{k_value: 'GQ', k_name: k_tr('Equatorial Guinea', 'wlibCountries')},
{k_value: 'ER', k_name: k_tr('Eritrea', 'wlibCountries')},
{k_value: 'EE', k_name: k_tr('Estonia', 'wlibCountries')},
{k_value: 'ET', k_name: k_tr('Ethiopia', 'wlibCountries')},
{k_value: 'FK', k_name: k_tr('Falkland Islands (Malvinas)', 'wlibCountries')},
{k_value: 'FO', k_name: k_tr('Faroe Islands', 'wlibCountries')},
{k_value: 'FM', k_name: k_tr('Federated States of Micronesia', 'wlibCountries')},
{k_value: 'FJ', k_name: k_tr('Fiji', 'wlibCountries')},
{k_value: 'FI', k_name: k_tr('Finland', 'wlibCountries')},
{k_value: 'FR', k_name: k_tr('France', 'wlibCountries')},
{k_value: 'FX', k_name: k_tr('France, Metropolitan', 'wlibCountries')},
{k_value: 'GF', k_name: k_tr('French Guiana', 'wlibCountries')},
{k_value: 'PF', k_name: k_tr('French Polynesia', 'wlibCountries')},
{k_value: 'TF', k_name: k_tr('French Southern Territories', 'wlibCountries'), k_hidden: true},
{k_value: 'GA', k_name: k_tr('Gabon', 'wlibCountries')},
{k_value: 'GM', k_name: k_tr('Gambia', 'wlibCountries')},
{k_value: 'GE', k_name: k_tr('Georgia', 'wlibCountries')},
{k_value: 'DE', k_name: k_tr('Germany', 'wlibCountries')},
{k_value: 'GH', k_name: k_tr('Ghana', 'wlibCountries')},
{k_value: 'GI', k_name: k_tr('Gibraltar', 'wlibCountries')},
{k_value: 'GR', k_name: k_tr('Greece', 'wlibCountries')},
{k_value: 'GL', k_name: k_tr('Greenland', 'wlibCountries')},
{k_value: 'GD', k_name: k_tr('Grenada', 'wlibCountries')},
{k_value: 'GP', k_name: k_tr('Guadeloupe', 'wlibCountries')},
{k_value: 'GU', k_name: k_tr('Guam', 'wlibCountries')},
{k_value: 'GT', k_name: k_tr('Guatemala', 'wlibCountries')},
{k_value: 'GG', k_name: k_tr('Guernsey, C.I.', 'wlibCountries'), k_hidden: true},
{k_value: 'GN', k_name: k_tr('Guinea', 'wlibCountries')},
{k_value: 'GW', k_name: k_tr('Guinea-Bissau', 'wlibCountries')},
{k_value: 'GY', k_name: k_tr('Guyana', 'wlibCountries')},
{k_value: 'HT', k_name: k_tr('Haiti', 'wlibCountries')},
{k_value: 'HM', k_name: k_tr('Heard Island and McDonald Islands', 'wlibCountries')},
{k_value: 'HN', k_name: k_tr('Honduras', 'wlibCountries')},
{k_value: 'HK', k_name: k_tr('Hong Kong', 'wlibCountries')},
{k_value: 'HU', k_name: k_tr('Hungary', 'wlibCountries')},
{k_value: 'IS', k_name: k_tr('Iceland', 'wlibCountries'), k_hidden: true},
{k_value: 'IN', k_name: k_tr('India', 'wlibCountries')},
{k_value: 'ID', k_name: k_tr('Indonesia', 'wlibCountries')},
{k_value: 'IR', k_name: k_tr('Iran', 'wlibCountries')},
{k_value: 'IQ', k_name: k_tr('Iraq', 'wlibCountries')},
{k_value: 'IE', k_name: k_tr('Ireland', 'wlibCountries')},
{k_value: 'IM', k_name: k_tr('Isle of Man', 'wlibCountries'), k_hidden: true},
{k_value: 'IL', k_name: k_tr('Israel', 'wlibCountries')},
{k_value: 'IT', k_name: k_tr('Italy', 'wlibCountries')},
{k_value: 'JM', k_name: k_tr('Jamaica', 'wlibCountries')},
{k_value: 'JP', k_name: k_tr('Japan', 'wlibCountries')},
{k_value: 'JE', k_name: k_tr('Jersey', 'wlibCountries'), k_hidden: true},
{k_value: 'JO', k_name: k_tr('Jordan', 'wlibCountries')},
{k_value: 'KZ', k_name: k_tr('Kazakhstan', 'wlibCountries')},
{k_value: 'KE', k_name: k_tr('Kenya', 'wlibCountries')},
{k_value: 'KI', k_name: k_tr('Kiribati', 'wlibCountries')},
{k_value: 'KP', k_name: k_tr('Korea (North)', 'wlibCountries')},
{k_value: 'KR', k_name: k_tr('Korea (South)', 'wlibCountries')},
{k_value: 'XK', k_name: k_tr('Kosovo', 'wlibCountries'), k_hidden: true},
{k_value: 'KW', k_name: k_tr('Kuwait', 'wlibCountries')},
{k_value: 'KG', k_name: k_tr('Kyrgyzstan', 'wlibCountries')},
{k_value: 'LA', k_name: k_tr('Laos', 'wlibCountries')},
{k_value: 'LV', k_name: k_tr('Latvia', 'wlibCountries')},
{k_value: 'LB', k_name: k_tr('Lebanon', 'wlibCountries')},
{k_value: 'LS', k_name: k_tr('Lesotho', 'wlibCountries')},
{k_value: 'LR', k_name: k_tr('Liberia', 'wlibCountries')},
{k_value: 'LY', k_name: k_tr('Libya', 'wlibCountries')},
{k_value: 'LI', k_name: k_tr('Liechtenstein', 'wlibCountries')},
{k_value: 'LT', k_name: k_tr('Lithuania', 'wlibCountries')},
{k_value: 'LU', k_name: k_tr('Luxembourg', 'wlibCountries')},
{k_value: 'MO', k_name: k_tr('Macao', 'wlibCountries')},
{k_value: 'MK', k_name: k_tr('Macedonia', 'wlibCountries')},
{k_value: 'MG', k_name: k_tr('Madagascar', 'wlibCountries')},
{k_value: 'MW', k_name: k_tr('Malawi', 'wlibCountries')},
{k_value: 'MY', k_name: k_tr('Malaysia', 'wlibCountries')},
{k_value: 'MV', k_name: k_tr('Maldives', 'wlibCountries')},
{k_value: 'ML', k_name: k_tr('Mali', 'wlibCountries')},
{k_value: 'MT', k_name: k_tr('Malta', 'wlibCountries')},
{k_value: 'MH', k_name: k_tr('Marshall Islands', 'wlibCountries')},
{k_value: 'MQ', k_name: k_tr('Martinique', 'wlibCountries')},
{k_value: 'MR', k_name: k_tr('Mauritania', 'wlibCountries')},
{k_value: 'MU', k_name: k_tr('Mauritius', 'wlibCountries')},
{k_value: 'YT', k_name: k_tr('Mayotte', 'wlibCountries')},
{k_value: 'MX', k_name: k_tr('Mexico', 'wlibCountries')},
{k_value: 'MD', k_name: k_tr('Moldova', 'wlibCountries')},
{k_value: 'MC', k_name: k_tr('Monaco', 'wlibCountries')},
{k_value: 'MN', k_name: k_tr('Mongolia', 'wlibCountries')},
{k_value: 'ME', k_name: k_tr('Montenegro', 'wlibCountries')},
{k_value: 'MS', k_name: k_tr('Montserrat', 'wlibCountries')},
{k_value: 'MA', k_name: k_tr('Morocco', 'wlibCountries')},
{k_value: 'MZ', k_name: k_tr('Mozambique', 'wlibCountries')},
{k_value: 'MM', k_name: k_tr('Myanmar', 'wlibCountries')},
{k_value: 'NA', k_name: k_tr('Namibia', 'wlibCountries')},
{k_value: 'NR', k_name: k_tr('Nauru', 'wlibCountries')},
{k_value: 'NP', k_name: k_tr('Nepal', 'wlibCountries')},
{k_value: 'NL', k_name: k_tr('Netherlands', 'wlibCountries')},
{k_value: 'NC', k_name: k_tr('New Caledonia', 'wlibCountries')},
{k_value: 'NZ', k_name: k_tr('New Zealand (Aotearoa)', 'wlibCountries')},
{k_value: 'NI', k_name: k_tr('Nicaragua', 'wlibCountries')},
{k_value: 'NE', k_name: k_tr('Niger', 'wlibCountries')},
{k_value: 'NG', k_name: k_tr('Nigeria', 'wlibCountries')},
{k_value: 'NU', k_name: k_tr('Niue', 'wlibCountries')},
{k_value: 'NF', k_name: k_tr('Norfolk Island', 'wlibCountries')},
{k_value: 'MP', k_name: k_tr('Northern Mariana Islands', 'wlibCountries')},
{k_value: 'NO', k_name: k_tr('Norway', 'wlibCountries')},
{k_value: 'OM', k_name: k_tr('Oman', 'wlibCountries')},
{k_value: 'PK', k_name: k_tr('Pakistan', 'wlibCountries')},
{k_value: 'PW', k_name: k_tr('Palau', 'wlibCountries')},
{k_value: 'PS', k_name: k_tr('Palestinian Territory', 'wlibCountries')},
{k_value: 'PA', k_name: k_tr('Panama', 'wlibCountries')},
{k_value: 'PG', k_name: k_tr('Papua New Guinea', 'wlibCountries')},
{k_value: 'PY', k_name: k_tr('Paraguay', 'wlibCountries')},
{k_value: 'PE', k_name: k_tr('Peru', 'wlibCountries')},
{k_value: 'PH', k_name: k_tr('Philippines', 'wlibCountries')},
{k_value: 'PN', k_name: k_tr('Pitcairn', 'wlibCountries')},
{k_value: 'PL', k_name: k_tr('Poland', 'wlibCountries')},
{k_value: 'PT', k_name: k_tr('Portugal', 'wlibCountries')},
{k_value: 'PR', k_name: k_tr('Puerto Rico', 'wlibCountries')},
{k_value: 'QA', k_name: k_tr('Qatar', 'wlibCountries')},
{k_value: 'RE', k_name: k_tr('Reunion', 'wlibCountries')},
{k_value: 'RO', k_name: k_tr('Romania', 'wlibCountries')},
{k_value: 'RU', k_name: k_tr('Russian Federation', 'wlibCountries')},
{k_value: 'RW', k_name: k_tr('Rwanda', 'wlibCountries')},
{k_value: 'GS', k_name: k_tr('S. Georgia and S. Sandwich Islands', 'wlibCountries')},
{k_value: 'BL', k_name: k_tr('Saint Barthélemy', 'wlibCountries'), k_hidden: true},
{k_value: 'SH', k_name: k_tr('Saint Helena', 'wlibCountries')},
{k_value: 'KN', k_name: k_tr('Saint Kitts and Nevis', 'wlibCountries')},
{k_value: 'LC', k_name: k_tr('Saint Lucia', 'wlibCountries')},
{k_value: 'MF', k_name: k_tr('Saint Martin', 'wlibCountries'), k_hidden: true},
{k_value: 'PM', k_name: k_tr('Saint Pierre and Miquelon', 'wlibCountries')},
{k_value: 'VC', k_name: k_tr('Saint Vincent and the Grenadines', 'wlibCountries')},
{k_value: 'WS', k_name: k_tr('Samoa', 'wlibCountries')},
{k_value: 'SM', k_name: k_tr('San Marino', 'wlibCountries')},
{k_value: 'ST', k_name: k_tr('Sao Tome and Principe', 'wlibCountries')},
{k_value: 'SA', k_name: k_tr('Saudi Arabia', 'wlibCountries')},
{k_value: 'SN', k_name: k_tr('Senegal', 'wlibCountries')},
{k_value: 'RS', k_name: k_tr('Serbia', 'wlibCountries')},
{k_value: 'CS', k_name: k_tr('Serbia and Montenegro', 'wlibCountries'), k_hidden: true},
{k_value: 'SC', k_name: k_tr('Seychelles', 'wlibCountries')},
{k_value: 'SL', k_name: k_tr('Sierra Leone', 'wlibCountries')},
{k_value: 'SG', k_name: k_tr('Singapore', 'wlibCountries')},
{k_value: 'SX', k_name: k_tr('Sint Maarten (Dutch part)', 'wlibCountries'), k_hidden: true},
{k_value: 'SK', k_name: k_tr('Slovakia', 'wlibCountries')},
{k_value: 'SI', k_name: k_tr('Slovenia', 'wlibCountries')},
{k_value: 'SB', k_name: k_tr('Solomon Islands', 'wlibCountries')},
{k_value: 'SO', k_name: k_tr('Somalia', 'wlibCountries')},
{k_value: 'ZA', k_name: k_tr('South Africa', 'wlibCountries')},
{k_value: 'SS', k_name: k_tr('South Sudan', 'wlibCountries'), k_hidden: true},
{k_value: 'ES', k_name: k_tr('Spain', 'wlibCountries')},
{k_value: 'LK', k_name: k_tr('Sri Lanka', 'wlibCountries')},
{k_value: 'SD', k_name: k_tr('Sudan', 'wlibCountries')},
{k_value: 'SR', k_name: k_tr('Suriname', 'wlibCountries')},
{k_value: 'SJ', k_name: k_tr('Svalbard and Jan Mayen', 'wlibCountries')},
{k_value: 'SZ', k_name: k_tr('Swaziland', 'wlibCountries')},
{k_value: 'SE', k_name: k_tr('Sweden', 'wlibCountries')},
{k_value: 'CH', k_name: k_tr('Switzerland', 'wlibCountries')},
{k_value: 'SY', k_name: k_tr('Syria', 'wlibCountries')},
{k_value: 'TW', k_name: k_tr('Taiwan', 'wlibCountries')},
{k_value: 'TJ', k_name: k_tr('Tajikistan', 'wlibCountries')},
{k_value: 'TZ', k_name: k_tr('Tanzania', 'wlibCountries')},
{k_value: 'TH', k_name: k_tr('Thailand', 'wlibCountries')},
{k_value: 'TL', k_name: k_tr('Timor-Leste', 'wlibCountries')},
{k_value: 'TG', k_name: k_tr('Togo', 'wlibCountries')},
{k_value: 'TK', k_name: k_tr('Tokelau', 'wlibCountries')},
{k_value: 'TO', k_name: k_tr('Tonga', 'wlibCountries')},
{k_value: 'TT', k_name: k_tr('Trinidad and Tobago', 'wlibCountries')},
{k_value: 'TN', k_name: k_tr('Tunisia', 'wlibCountries')},
{k_value: 'TR', k_name: k_tr('Turkey', 'wlibCountries')},
{k_value: 'TM', k_name: k_tr('Turkmenistan', 'wlibCountries')},
{k_value: 'TC', k_name: k_tr('Turks and Caicos Islands', 'wlibCountries')},
{k_value: 'TV', k_name: k_tr('Tuvalu', 'wlibCountries')},
{k_value: 'UG', k_name: k_tr('Uganda', 'wlibCountries')},
{k_value: 'UA', k_name: k_tr('Ukraine', 'wlibCountries')},
{k_value: 'AE', k_name: k_tr('United Arab Emirates', 'wlibCountries')},
{k_value: 'GB', k_name: k_tr('United Kingdom', 'wlibCountries')},
{k_value: 'US', k_name: k_tr('United States', 'wlibCountries')},
{k_value: 'UM', k_name: k_tr('United States Minor Outlying Islands', 'wlibCountries')},
{k_value: 'UY', k_name: k_tr('Uruguay', 'wlibCountries')},
{k_value: 'SU', k_name: k_tr('USSR (former)', 'wlibCountries')},
{k_value: 'UZ', k_name: k_tr('Uzbekistan', 'wlibCountries')},
{k_value: 'VU', k_name: k_tr('Vanuatu', 'wlibCountries')},
{k_value: 'VA', k_name: k_tr('Vatican City State', 'wlibCountries')},
{k_value: 'VE', k_name: k_tr('Venezuela', 'wlibCountries')},
{k_value: 'VN', k_name: k_tr('Viet Nam', 'wlibCountries')},
{k_value: 'VG', k_name: k_tr('Virgin Islands (British)', 'wlibCountries')},
{k_value: 'VI', k_name: k_tr('Virgin Islands (U.S.)', 'wlibCountries')},
{k_value: 'WF', k_name: k_tr('Wallis and Futuna', 'wlibCountries')},
{k_value: 'EH', k_name: k_tr('Western Sahara', 'wlibCountries')},
{k_value: 'YE', k_name: k_tr('Yemen', 'wlibCountries')},
{k_value: 'YU', k_name: k_tr('Yugoslavia (former)', 'wlibCountries')},
{k_value: 'ZR', k_name: k_tr('Zaire (former)', 'wlibCountries')},
{k_value: 'ZM', k_name: k_tr('Zambia', 'wlibCountries')},
{k_value: 'ZW', k_name: k_tr('Zimbabwe', 'wlibCountries')}
];

k_lib.k_constants.k_localizedCountriesOrder = {
};
k_lib.k_constants._k_sortedAllCountries = null;
k_lib.k_constants._k_sortedVisibleCountries = null;

k_lib.k_getSortedCountries = function(k_includeHiddenCountries) {
var
k_cacheKey = k_includeHiddenCountries ? '_k_sortedAllCountries' : '_k_sortedVisibleCountries',
k_currentLanguage,
k_countryItems,
k_localizedCountriesOrder,
k_sortedCountries,
k_i, k_cnt, k_index;
if (!k_lib.k_constants[k_cacheKey]) {
k_currentLanguage = this.k_engineConstants.k_CURRENT_LANGUAGE;
k_countryItems = this.k_constants.k_countryItems;
if (!k_includeHiddenCountries) {
k_countryItems = k_countryItems.filter(function(k_countryItem) {
return !k_countryItem.k_hidden;
});
}
if ('en' === k_currentLanguage) {
k_sortedCountries = k_countryItems;
} else {
k_localizedCountriesOrder = this.k_constants.k_localizedCountriesOrder[k_currentLanguage];
if (k_localizedCountriesOrder) {
k_sortedCountries = [];
for (k_i = 0, k_cnt = k_countryItems.length; k_i < k_cnt; k_i++) {
k_index = k_localizedCountriesOrder.indexOf(k_countryItems[k_i].k_value) / 3;  k_sortedCountries[k_index] = k_countryItems[k_i];
}
} else {
k_sortedCountries = k_countryItems;
k_sortedCountries.sort(function(countryA, countryB) {
return countryA.k_name.localeCompare(countryB.k_name, {
sensitivity: 'base'
});
});
}
}
k_cnt = k_sortedCountries.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_sortedCountries[k_i].k_sortingIndex = k_i;
}
k_lib.k_constants[k_cacheKey] = k_sortedCountries;
}
return k_lib.k_constants[k_cacheKey];
};
k_lib.k_constants.k_stateItems = {
AU: [
{k_value: '53', k_name: k_tr('New South Wales', 'wlibStates')},
{k_value: '54', k_name: k_tr('Australian Capital Territory', 'wlibStates')},
{k_value: '55', k_name: k_tr('Northern Territory', 'wlibStates')},
{k_value: '56', k_name: k_tr('Western Australia', 'wlibStates')},
{k_value: '57', k_name: k_tr('South Australia', 'wlibStates')},
{k_value: '58', k_name: k_tr('Victoria', 'wlibStates')},
{k_value: '59', k_name: k_tr('Tasmania', 'wlibStates')},
{k_value: '60', k_name: k_tr('Queensland', 'wlibStates')}
],
CA: [
{k_value: '61', k_name: k_tr('Alberta', 'wlibStates')},
{k_value: '62', k_name: k_tr('British Columbia', 'wlibStates')},
{k_value: '63', k_name: k_tr('Manitoba', 'wlibStates')},
{k_value: '64', k_name: k_tr('New Brunswick', 'wlibStates')},
{k_value: '65', k_name: k_tr('Newfoundland and Labrador', 'wlibStates')},
{k_value: '66', k_name: k_tr('Northwest Territories', 'wlibStates')},
{k_value: '67', k_name: k_tr('Nova Scotia', 'wlibStates')},
{k_value: '68', k_name: k_tr('Ontario', 'wlibStates')},
{k_value: '69', k_name: k_tr('Prince Edward Island', 'wlibStates')},
{k_value: '70', k_name: k_tr('Québec', 'wlibStates')},
{k_value: '71', k_name: k_tr('Saskatchewan', 'wlibStates')},
{k_value: '72', k_name: k_tr('Yukon Territory', 'wlibStates')},
{k_value: '73', k_name: k_tr('Nunavut', 'wlibStates')}
],
US: [
{k_value: '1', k_name: k_tr('Alabama', 'wlibStates')},
{k_value: '2', k_name: k_tr('Alaska', 'wlibStates')},
{k_value: '3', k_name: k_tr('Arizona', 'wlibStates')},
{k_value: '4', k_name: k_tr('Arkansas', 'wlibStates')},
{k_value: '5', k_name: k_tr('California', 'wlibStates')},
{k_value: '6', k_name: k_tr('Colorado', 'wlibStates')},
{k_value: '7', k_name: k_tr('Connecticut', 'wlibStates')},
{k_value: '8', k_name: k_tr('Delaware', 'wlibStates')},
{k_value: '9', k_name: k_tr('Florida', 'wlibStates')},
{k_value: '10', k_name: k_tr('Georgia', 'wlibStates')},
{k_value: '11', k_name: k_tr('Hawaii', 'wlibStates')},
{k_value: '12', k_name: k_tr('Idaho', 'wlibStates')},
{k_value: '13', k_name: k_tr('Illinois', 'wlibStates')},
{k_value: '14', k_name: k_tr('Indiana', 'wlibStates')},
{k_value: '15', k_name: k_tr('Iowa', 'wlibStates')},
{k_value: '16', k_name: k_tr('Kansas', 'wlibStates')},
{k_value: '17', k_name: k_tr('Kentucky', 'wlibStates')},
{k_value: '18', k_name: k_tr('Louisiana', 'wlibStates')},
{k_value: '19', k_name: k_tr('Maine', 'wlibStates')},
{k_value: '20', k_name: k_tr('Marshall Islands', 'wlibStates')},
{k_value: '21', k_name: k_tr('Maryland', 'wlibStates')},
{k_value: '22', k_name: k_tr('Massachusetts', 'wlibStates')},
{k_value: '23', k_name: k_tr('Michigan', 'wlibStates')},
{k_value: '24', k_name: k_tr('Minnesota', 'wlibStates')},
{k_value: '25', k_name: k_tr('Mississippi', 'wlibStates')},
{k_value: '26', k_name: k_tr('Missouri', 'wlibStates')},
{k_value: '27', k_name: k_tr('Montana', 'wlibStates')},
{k_value: '28', k_name: k_tr('Nebraska', 'wlibStates')},
{k_value: '29', k_name: k_tr('Nevada', 'wlibStates')},
{k_value: '30', k_name: k_tr('New Hampshire', 'wlibStates')},
{k_value: '31', k_name: k_tr('New Jersey', 'wlibStates')},
{k_value: '32', k_name: k_tr('New Mexico', 'wlibStates')},
{k_value: '33', k_name: k_tr('New York', 'wlibStates')},
{k_value: '34', k_name: k_tr('North Carolina', 'wlibStates')},
{k_value: '35', k_name: k_tr('North Dakota', 'wlibStates')},
{k_value: '36', k_name: k_tr('Ohio', 'wlibStates')},
{k_value: '37', k_name: k_tr('Oklahoma', 'wlibStates')},
{k_value: '38', k_name: k_tr('Oregon', 'wlibStates')},
{k_value: '39', k_name: k_tr('Pennsylvania', 'wlibStates')},
{k_value: '40', k_name: k_tr('Rhode Island', 'wlibStates')},
{k_value: '41', k_name: k_tr('South Carolina', 'wlibStates')},
{k_value: '42', k_name: k_tr('South Dakota', 'wlibStates')},
{k_value: '43', k_name: k_tr('Tennessee', 'wlibStates')},
{k_value: '44', k_name: k_tr('Texas', 'wlibStates')},
{k_value: '45', k_name: k_tr('Utah', 'wlibStates')},
{k_value: '46', k_name: k_tr('Vermont', 'wlibStates')},
{k_value: '47', k_name: k_tr('Virginia', 'wlibStates')},
{k_value: '48', k_name: k_tr('Washington', 'wlibStates')},
{k_value: '49', k_name: k_tr('Washington D.C.', 'wlibStates')},
{k_value: '50', k_name: k_tr('West Virginia', 'wlibStates')},
{k_value: '51', k_name: k_tr('Wisconsin', 'wlibStates')},
{k_value: '52', k_name: k_tr('Wyoming', 'wlibStates')}
]
};
};  

kerio.lib.K_ExecutionStack = function() {
this._k_stack = [];
};
Ext.apply(kerio.lib.K_ExecutionStack.prototype, {

k_add: function(k_function, k_params, k_scope, k_addToStart) {
var
k_stack = this._k_stack,
k_stackItem;
if ('function' !== typeof k_function) {
return;
}
if (!k_params || Array !== k_params.constructor) {
k_params = [ k_params ];
}
k_stackItem = {
k_function: k_function,
k_params: k_params,
k_scope: k_scope
};
if (true === k_addToStart) {
k_stack.unshift(k_stackItem);  }
else {
k_stack.push(k_stackItem);  }
},

k_getLength: function() {
return this._k_stack.length;
},

k_isClear: function() {
return 0 === this.k_getLength();
},

k_clear: function() {
var k_lengthBefore = this.k_getLength();
this._k_stack = [];
return k_lengthBefore;
},

_k_execute: function(k_globalScope, k_forceGlobalScope) {
var
k_stack = this._k_stack,
k_toExecute,
k_executeOn,
k_i,
k_cnt;
for (k_i = 0, k_cnt = k_stack.length; k_i < k_cnt; k_i++) {
k_toExecute = k_stack[k_i];
k_executeOn = (k_forceGlobalScope)
? k_globalScope
: k_toExecute.k_scope || k_globalScope || window;
k_toExecute.k_function.apply(k_executeOn, k_toExecute.k_params);
delete k_stack[k_i];
}
this.k_clear();
},

k_execute: function() {
this._k_execute(this);
},

k_executeOn: function(k_scope) {
this._k_execute(k_scope, true);
},

k_clone: function() {
var k_newStack = new kerio.lib.K_ExecutionStack();
k_newStack._k_stack = kerio.lib.k_cloneObject(this._k_stack);
return k_newStack;
},

k_merge: function(k_mergeWith) {
if (k_mergeWith instanceof kerio.lib.K_ExecutionStack) {
this._k_stack = this._k_stack.concat(k_mergeWith._k_stack);
return this.k_getLength();
}
else {
return -1;
}
}
});


kerio.lib._K_ValidationResults = function() {
this._k_invalidCount = 0;
this._k_missingCount = 0;
this._k_executionStack = new kerio.lib.K_ExecutionStack();
this._k_wizard = null;
this.k_valid = true; };
Ext.apply(kerio.lib._K_ValidationResults.prototype, {

k_inc: function(k_isMissing) {
if (k_isMissing) {
this._k_missingCount++;
}
else {
this._k_invalidCount++;
}
return this.k_getCount(); },

k_add: function(k_mergeWith, k_includeMethods) {
if (k_mergeWith instanceof kerio.lib._K_ValidationResults) {
if (false !== k_includeMethods) {
this._k_executionStack.k_merge(k_mergeWith._k_executionStack);
}
this._k_missingCount += k_mergeWith._k_missingCount;
this._k_invalidCount += k_mergeWith._k_invalidCount;
return this.k_getCount(); }
else {
kerio.lib.k_reportError('Internal error: invalid result of k_isValid method!');
return -1;
}
},

k_addMethod: function(k_function, k_params, k_scope, k_addToStart) {
this._k_executionStack.k_add(k_function, k_params, k_scope, k_addToStart);
},

k_getCount: function(k_getMissing) {
var
k_invalid = this._k_invalidCount,
k_missing = this._k_missingCount;
this.k_valid = (0 === k_invalid && 0 === k_missing);
switch (k_getMissing) {
case true:
return k_missing;
case false:
return k_invalid;
default:
return (k_invalid + k_missing);
}
},

k_isValid: function(k_notifyUser) {
if (true === k_notifyUser) {
this._k_notifyUser();
}
return 0 === this.k_getCount();
},

_k_notifyUser: function() {
var k_message;
if (this.k_isValid()) {
return; }
k_message = this._k_getMessage();
this._k_executionStack.k_execute();
kerio.lib.k_alert(k_message.k_title, k_message.k_message);
},

_k_getMessage: function() {
var
k_totalInvalidCount = this.k_getCount(),
k_invalidCount      = this.k_getCount(false),
k_missingCount      = this.k_getCount(true),
k_tr = kerio.lib.k_tr,
k_message,
k_title;
switch (k_totalInvalidCount) {
case 0:
k_message = ''; break;
case 1:
if (k_missingCount) {
k_message = k_tr('Highlighted field is required.', 'wlibAlerts');
} else {
k_message = k_tr('Highlighted field is incorrect.', 'wlibAlerts');
} break;
default: if (0 === k_invalidCount) { k_message = k_tr('Highlighted fields are required.', 'wlibAlerts');
} else if (0 === k_missingCount) { k_message = k_tr('Highlighted fields are incorrect.', 'wlibAlerts');
} else { k_message = k_tr('Highlighted fields are required or incorrect.', 'wlibAlerts');
} break;
}
k_title = k_tr('Validation warning', 'wlibAlerts');
return {
k_message: k_message,
k_title:   k_title
};
} }); 
kerio.lib._K_WizardValidationResults = function(k_wizard) {
kerio.lib._K_WizardValidationResults.superclass.constructor.call(this);
if (k_wizard && k_wizard.k_isInstanceOf && k_wizard.k_isInstanceOf('K_Wizard')) {
this._k_wizard = k_wizard;
}
else {
kerio.lib.k_reportError('Internal error: invalid widget for WizardValidationResults constructor!');
return null;
}
this._k_step = 0; };
Ext.extend(kerio.lib._K_WizardValidationResults, kerio.lib._K_ValidationResults, {

k_isValid: function(k_notifyUser, k_step) {
if (true === k_notifyUser) { this._k_notifyUser(k_step);
}
return 0 === this.k_getCount();
},

_k_notifyUser: function(k_step) {
var k_message;
if (this.k_isValid()) {
return; }
k_message = this._k_getMessage();
this._k_step = k_step;
kerio.lib.k_confirm(k_message.k_title, k_message.k_message, this._k_notifyUserCallback, this, 'Yes');
},

_k_notifyUserCallback: function(k_response) {
var k_wizard = this._k_wizard;
if ('yes' === k_response) {
this._k_executionStack.k_execute();
}
else {
if (0 > this._k_step) {
k_wizard.k_prev();
}
else {
k_wizard.k_next();
}
}
},

_k_getMessage: function() {
var
k_totalInvalidCount = this.k_getCount(),
k_invalidCount      = this.k_getCount(false),
k_missingCount      = this.k_getCount(true),
k_wizard = this._k_wizard,
k_isWizardMode = (null !== k_wizard),
k_tr = kerio.lib.k_tr,
k_br = '<br>', k_message,
k_title;
k_message = this.constructor.superclass._k_getMessage.call(this); k_message = k_message.k_message; k_message += k_br;
switch (k_totalInvalidCount) {
case 0:
k_message = '';  break;
case 1:
if (k_missingCount) {
k_message += k_tr('Do you want to specify it now?', 'wlibAlerts');
} else {
k_message += k_tr('Do you want to fix it now?', 'wlibAlerts');
} break;
default: if (0 === k_invalidCount) { k_message += k_tr('Do you want to specify them now?', 'wlibAlerts');
} else if (0 === k_missingCount) { k_message += k_tr('Do you want to fix them now?', 'wlibAlerts');
} else { k_message += k_tr('Do you want to fix them now?', 'wlibAlerts');
} break;
} k_title = k_tr('Page validation warning', 'wlibAlerts');
return {
k_message: k_message,
k_title:   k_title
};
}
}); 

kerio.lib._K_Spotlight = function(k_config) {
Ext.apply(this, k_config);
};
kerio.lib._K_Spotlight.prototype = {
k_active: false,
_k_createElements : function(){
var k_body = Ext.getBody();
this.right = k_body.createChild({cls:'x-spotlight'});
this.left = k_body.createChild({cls:'x-spotlight'});
this.top = k_body.createChild({cls:'x-spotlight'});
this.bottom = k_body.createChild({cls:'x-spotlight'});
if (this.k_onMouseOver) {
this.left.on  ('mouseover', this.k_onMouseOver.k_function, this.k_onMouseOver.k_scope);
this.right.on ('mouseover', this.k_onMouseOver.k_function, this.k_onMouseOver.k_scope);
this.top.on   ('mouseover', this.k_onMouseOver.k_function, this.k_onMouseOver.k_scope);
this.bottom.on('mouseover', this.k_onMouseOver.k_function, this.k_onMouseOver.k_scope);
}
this.all = new Ext.CompositeElement([this.right, this.left, this.top, this.bottom]);
},
k_show: function(k_extElement) {
this.el = Ext.get(k_extElement);
if(!this.right) {
this._k_createElements();
}
if(!this.k_active) {
this.all.setDisplayed('');
this.k_applyBounds(true);
this.k_active = true;
Ext.EventManager.onWindowResize(this.k_syncSize, this);
this.k_applyBounds(false);
}else{
this.k_applyBounds(false);
}
},
k_hide: function() {
Ext.EventManager.removeResizeListener(this.k_syncSize, this);
if (this.k_active) {
this.k_active = false;
this.all.setDisplayed(false);
this.k_applyBounds(true);
}
},
k_syncSize : function(){
this.k_applyBounds(false);
},
k_applyBounds : function(basePts){
var rg = this.el.getRegion();
var dw = Ext.lib.Dom.getViewWidth(true);
var dh = Ext.lib.Dom.getViewHeight(true);
this.right.setBounds(
rg.right,
basePts ? dh : rg.top,
dw - rg.right,
basePts ? 0 : (dh - rg.top)
);
this.left.setBounds(
0,
0,
rg.left,
basePts ? 0 : rg.bottom
);
this.top.setBounds(
basePts ? dw : rg.left,
0,
basePts ? 0 : dw - rg.left,
rg.top
);
this.bottom.setBounds(
0,
rg.bottom,
basePts ? 0 : rg.right,
dh - rg.bottom
);
},
k_destroy : function(){
this.k_active = false;
this.all.setDisplayed(false);
Ext.destroy(
this.right,
this.left,
this.top,
this.bottom);
delete this.el;
delete this.all;
}
};


kerio.lib._K_SpotlightIframe = function(k_config) {
kerio.lib._K_SpotlightIframe.superclass.constructor.call(this, k_config);
this._k_createElements();
};
Ext.extend(kerio.lib._K_SpotlightIframe, kerio.lib._K_Spotlight,
{
_k_currentOwner: null,  
_k_createElements: function() {
var
k_body = Ext.getBody(),
k_iframeCfg = {tag: 'iframe', cls:'x-spotlight', src: kerio.lib.k_kerioLibraryRoot + 'emptyPage.html', frameborder: '0'};
this.right  = k_body.createChild(k_iframeCfg);
this.left   = k_body.createChild(k_iframeCfg);
this.top    = k_body.createChild(k_iframeCfg);
this.bottom = k_body.createChild(k_iframeCfg);
this.right.on ('load', this._k_initIframeContent);
this.left.on  ('load', this._k_initIframeContent);
this.top.on   ('load', this._k_initIframeContent);
this.bottom.on('load', this._k_initIframeContent);
this.all = new Ext.CompositeElement([this.right, this.left, this.top, this.bottom]);
},

_k_initIframeContent: function() {
var
k_body = this.dom.contentWindow.document.body,
k_div,
k_style;
k_style = k_body.style;
k_style.overflow = 'hidden';
k_style.margin = '0px';
k_div = k_body.ownerDocument.createElement('DIV');
k_body.appendChild(k_div);
k_style = k_div.style;
k_style.position = 'absolute';
k_style.top = '0px';
k_style.height = '10000px';  k_style.width = '10000px';
k_div.onmouseup = kerio.lib._K_SpotlightIframe.prototype._k_onMouseUp;
},

_k_onMouseUp: function(k_event) {
var k_window;
if (this.ownerDocument) {
k_window = this.ownerDocument.parentWindow || this.ownerDocument.defaultView;
}
else if (this.document && this.document.parentWindow) {
k_window = this.document.parentWindow;
}
if (k_window) {
k_event = k_event || k_window.event;
k_window.k_owner._k_onMouseUpInSpotlight(k_event);
}
},

k_show: function(k_extElement, k_owner) {
if (this._k_currentOwner !== k_owner) {
this._k_setOwner(k_owner);
}
kerio.lib._K_SpotlightIframe.superclass.k_show.call(this, k_extElement);
},

_k_setOwner: function(k_owner) {
var
k_elements = this.all.elements,
k_cnt = k_elements.length,
k_i;
this._k_currentOwner = k_owner;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_elements[k_i].dom.contentWindow.k_owner = k_owner;
}
}
});


kerio.lib._K_RowDataView = function (k_config) {
kerio.lib._K_RowDataView.superclass.constructor.call(this, k_config);
};
Ext.extend(kerio.lib._K_RowDataView, Ext.DataView,
{

onContextMenu: function(k_event){
var
k_item = k_event.getTarget(this.itemSelector, this.el),
k_itemIndex = -1;
if(k_item){
k_itemIndex = this.indexOf(k_item);
}
this.fireEvent('contextmenu', this, k_itemIndex, k_item, k_event);
},

refresh: Ext.emptyFn,
_kxp: {

_k_createEmptyTextEl: function() {
var k_emptyTextEl;
k_emptyTextEl = this.container.createChild({
tag: 'div',
html: this.emptyText,
cls: 'rowDataViewEmptyText',
style: 'display: none'
});
k_emptyTextEl.on('contextmenu', this.onContextMenu, this);
this._kx.k_rowView._k_scrollerWidget._k_element.on('contextmenu', this.onContextMenu, this);
this._k_emptyTextEl = k_emptyTextEl;
return k_emptyTextEl;
},

k_refresh: function(){
kerio.lib._K_RowDataView.superclass.refresh.call(this);
var
k_records = this.store.getRange(),
k_emptyTextEl = this._k_emptyTextEl;
if(k_records.length < 1){
this.el.update('');
if (!k_emptyTextEl) {
k_emptyTextEl = this._kxp._k_createEmptyTextEl.call(this);
}
k_emptyTextEl.setDisplayed(true);
if (Ext.isIE7) {
this._kx.k_rowView._k_scrollerWidget._k_element.repaint();
}
}
else {
if (k_emptyTextEl) {
k_emptyTextEl.setDisplayed(false);
}
}
this.fireEvent('refresh', this);
}
}
});

kerio.lib._K_BufferedRowDataView = function (k_config) {
kerio.lib._K_BufferedRowDataView.superclass.constructor.call(this, k_config);
this.store.on('cacheout', this._kxp.k_onCacheOutOfRange, this);
};
Ext.extend(kerio.lib._K_BufferedRowDataView, kerio.lib._K_RowDataView,
{
_kxp: Ext.apply(kerio.lib._K_RowDataView.prototype._kxp || {}, {

k_onCacheOutOfRange: function (k_store) {
this.el.update('');
}
})
});


kerio.lib.K_RowView = function(k_id, k_config) {
this._k_propertiesDefault.k_rowTemplate = '<div class="singleRow" id="' + k_id + '_row_{[xindex]}">'
+ '<span class="rowContent" id="' + k_id + '_rowtxt_{[xindex]}">{row}</span></div>';
this._k_setStoredProperties(['k_onClipboardIsTooLarge', 'k_onSelectionChange', 'k_onBeforeSelect', 'k_onSelectionRenewed']);
kerio.lib.K_RowView.superclass.constructor.call(this, k_id, k_config);
};
Ext.extend(kerio.lib.K_RowView, kerio.lib._K_ToolbarContainer,
{























_k_propertiesDefault: {
k_className: 'rowView %+',
k_rowHeight: 16,
k_maxRowLength: 1024,
k_delayBeforeFetch: 200
},

k_isLoaded: false,

_k_initExtComponent: function(k_adaptedConfig, k_storedConfig) {
var
k_idPrefix = this.k_id + '_',
k_dataStore,
k_extWidget;
this.k_addReferences({
_k_onScrollFetch: k_adaptedConfig.k_onScrollFetch,
_k_onScroll: k_adaptedConfig.k_onScroll,
_k_elementIds: {  k_scrollerId: k_idPrefix + 'k_scroller',
k_spacerId: k_idPrefix + 'k_spacer',
k_proxyScrollerId: k_idPrefix + 'k_proxyScroller',
k_touchScrollerId: k_idPrefix + 'k_touchScroller',
k_pageBeforeId: k_idPrefix + 'k_pageBeforeId',
k_pageAfterId: k_idPrefix + 'k_pageAfterId',
k_dataViewId: k_idPrefix + 'k_dataViewId'
}
});
k_dataStore = this._k_createDataStore(k_adaptedConfig);
k_extWidget = this._k_createCoveringPanel(k_adaptedConfig);
this.k_addReferences({
_k_extDataStore: k_dataStore.k_extWidget,
_k_dataStore: k_dataStore
});
return k_extWidget;
},

_k_afterInitExtComponent: function(k_adaptedConfig, k_storedConfig) {
var k_dataCfg = k_adaptedConfig.k_remoteData;
kerio.lib.K_RowView.superclass._k_afterInitExtComponent.call(this, k_adaptedConfig, k_storedConfig);
this._k_settings = {
k_rowHeight: k_adaptedConfig.k_rowHeight,
k_maxRowLength: k_adaptedConfig.k_maxRowLength,
k_delayBeforeFetch: k_adaptedConfig.k_delayBeforeFetch,
k_rowTemplate: k_adaptedConfig.k_rowTemplate,
k_rowRenderer: k_adaptedConfig.k_rowRenderer,
k_totalProperty: k_dataCfg.k_totalProperty || 'totalItems',
k_root: k_dataCfg.k_root || 'data',
k_startParamName: k_dataCfg.k_startParamName || 'start',
k_limitParamName: k_dataCfg.k_limitParamName || 'limit',
k_isMultiSelect: k_adaptedConfig.k_isMultiSelect
};
this._k_status = {};
this._k_isAutoLoaded = false !== k_adaptedConfig.k_isAutoLoaded;
this._k_loadingHtmlFragment = '<div style="height: ' + k_adaptedConfig.k_rowHeight + 'px" class="loadingText singleRow">'
+ Ext.LoadMask.prototype.msg + '</div>\n';
if (k_adaptedConfig.k_contextMenu) {
this._k_createContextMenu(k_adaptedConfig.k_contextMenu);
}
if (this._k_isAutoLoaded) {
this._k_dataStore.k_reloadData();
}
},

_k_createCoveringPanel: function(k_config) {
var k_extPanel;
k_extPanel = new Ext.Panel({
cls: k_config.k_className,
autoWidth:true,
layout:'fit',
autoScroll: false
});
k_extPanel.on({
'afterrender': this._k_createDataView,
'bodyresize' : this._k_onBodyResize,
scope: this
});
if (kerio.lib.k_isWebKit) {
k_extPanel.on('blur', this._k_onBlurWebkit, this);
}
return k_extPanel;
},

_k_createDataStore: function(k_config) {
var
k_dataStore,
k_dataStoreConfig;
k_dataStoreConfig = {
k_record: k_config.k_record,
k_remoteData: k_config.k_remoteData,
k_localData: k_config.k_localData,
k_onLoad: this._k_onLoad
};
k_dataStore = new kerio.lib._K_DataStore(this, k_dataStoreConfig);
k_dataStore.k_extWidget.on('cacheout', this._k_onDataOutOfCache, this);
return k_dataStore;
},

_k_onDataOutOfCache: function () {
if (!this._k_isMasked) {
this._k_isMasked = true;
kerio.lib._k_maskElement(this._k_proxyScroller, {k_owner: this});
}
},

_k_createDataView: function() {
var
k_proxyScroller,
k_template,
k_extDataView,
k_extDataViewElement,
k_elementIds = this._k_elementIds,
k_settings = this._k_settings,
k_maxRowLengthWithUnits = k_settings.k_maxRowLength + 'em',
k_config,
K_DataViewConstructor,
k_childrenCfg,
k_spotlight;
k_template = new Ext.XTemplate(
'<tpl for=".">',
k_settings.k_rowTemplate,
'</tpl>'
);
k_childrenCfg = [{tag: 'div', id: k_elementIds.k_dataViewId  , cls: 'data selectable'}];
this.k_extWidget.bwrap.createChild({
tag: 'div',
id: k_elementIds.k_proxyScrollerId,
cls: 'proxyScroller',
children: k_childrenCfg
});
this._k_internalMask = this.k_extWidget.bwrap.createChild({
tag: 'div',
cls: 'internalMask ext-el-mask'
});
k_proxyScroller = Ext.get(k_elementIds.k_proxyScrollerId);
k_config = {
store: this._k_extDataStore,
tpl: k_template,
width: k_maxRowLengthWithUnits,
multiSelect: false,
overClass:'x-view-over',
selectedClass: 'selectedRow',
itemSelector:'div.singleRow',
applyTo: k_elementIds.k_dataViewId,
emptyText: '<div class="x-grid-empty">' + Ext.grid.GridView.prototype.emptyText + '</div>'
};
K_DataViewConstructor = kerio.lib._K_BufferedRowDataView;
k_extDataView = new K_DataViewConstructor(k_config);
k_extDataViewElement = k_extDataView.getEl();
if (k_settings.k_rowRenderer) {
k_extDataView.prepareData = this._k_prepareRowData;
}
kerio.lib._k_addKerioProperty(k_extDataView, {k_rowView: this});
this.k_addReferences({
_k_extDataView: k_extDataView,
_k_proxyScroller: k_proxyScroller,
_k_onScrollDelayed: new Ext.util.DelayedTask(this._k_onScrollForDelayedTask, this)
});
this.k_addReferences({
_k_scrollerWidget: this._k_createScroller()
});
if (Ext.isIE || kerio.lib.k_isMSIE11 || kerio.lib.k_isMSEdge || (kerio.lib.k_isFirefox && !kerio.lib.k_isFirefoxLess4)) {
k_spotlight = kerio.lib._k_sharedSpotlightForRowView;
if (!k_spotlight) {
k_spotlight = new kerio.lib._K_SpotlightIframe();
kerio.lib._k_sharedSpotlightForRowView = k_spotlight;
}
this.k_addReferences({_k_spotlight: k_spotlight});
}
this._k_selectionContainer = new kerio.lib._K_SelectionContainer();
if (kerio.lib.k_isIPadCompatible) {
k_extDataView.on('refresh', this._k_copyRowsToTouchScroller, this, {buffer: 600});
k_extDataView._kxp._k_createEmptyTextEl.call(k_extDataView);  this._k_setTouchEvents();
}
else {
k_extDataView.on('contextmenu', this._k_showContextMenu, this);
k_extDataViewElement.on('mousedown', this._k_onMouseDown, this);
k_extDataViewElement.on('mouseup'  , this._k_onMouseUp, this);
if (kerio.lib.k_isMSIE || kerio.lib.k_isMSIE11 || kerio.lib.k_isMSEdge) {
k_extDataViewElement.on('dblclick', this._k_onDblClick, this);
}
}
},

_k_createScroller: function() {
var k_scrollerWidget = new kerio.lib._K_Scroller({
k_element: this.k_extWidget.body,
k_proxyScroller: this._k_elementIds.k_proxyScrollerId,
k_owner: this,
k_lineWidth: this._k_proxyScroller.getWidth(),
k_onScroll: this._k_scrollerOnScroll,
k_lineHeight: this._k_settings.k_rowHeight
});
return k_scrollerWidget;
},

_k_initView: function() {
var
k_elementIds = this._k_elementIds,
k_dataView = Ext.get(k_elementIds.k_dataViewId),
k_status = this.k_getStatus(),
k_scrollerStatus = k_status.k_scrollerStatus,
k_viewHeight = k_scrollerStatus.k_viewHeight,
k_rowHeight = k_scrollerStatus.k_lineHeight,
k_normalizedViewHeight;
k_normalizedViewHeight = Math.ceil(k_viewHeight / k_rowHeight) * k_rowHeight;
k_dataView.setHeight(k_normalizedViewHeight);
this._k_updateStatus({
k_limit: k_scrollerStatus.k_linesPerPage,
k_normalizedViewHeight: k_normalizedViewHeight,
k_rowHeight: k_rowHeight
});
if (kerio.lib.k_isIPadCompatible) {
Ext.get(k_elementIds.k_touchScrollerId).setSize({width: k_dataView.getWidth(), height: k_viewHeight});
}
this._k_internalMask.setSize(this.k_extWidget.body.getSize());
},

_k_updateStatus: function(k_statusFragment) {
this._k_status = Ext.apply(this._k_status, k_statusFragment);
},

k_getStatus: function() {
var k_scrollerStatus = this._k_scrollerWidget.k_getStatus();
this._k_updateStatus({
k_scrollerStatus: k_scrollerStatus
});
return this._k_status;
},

_k_onBodyResize: function(k_extPanel, k_width, k_height) {
if (k_height && this._k_scrollerWidget) {
this._k_scrollerWidget.k_initOnResize();
this._k_initView();
if (this.k_isLoaded) {
this._k_fetchOnDemand.call(this);
}
}
},

_k_onScrollForDelayedTask : function() {
this._k_fetchOnDemand.call(this);
},

_k_onLoad: function(k_relatedWidget, k_options, k_jsonData) {
var
k_settings = this._k_settings,
k_totalRows = k_jsonData[k_settings.k_totalProperty],
k_start = k_options.params[k_settings.k_startParamName],
k_limit = k_options.params[k_settings.k_limitParamName],
k_status = this.k_getStatus(),
k_scrollerStatus = k_status.k_scrollerStatus,
k_currentLine = k_scrollerStatus.k_currentLine,  k_invisiblePartOfLine = k_scrollerStatus.k_invisiblePartOfLine,
k_params;
if (k_scrollerStatus.k_isScrollPending) {
return;
}
if (this._k_isMasked) {
this._k_isMasked = false;
kerio.lib._k_unmaskElement(this._k_proxyScroller, this);
}
if (this.k_isLoaded && k_totalRows < k_status.k_totalRows) {
k_params = this._k_dataStore.k_getLastRequestParams();
if (k_totalRows <= k_currentLine) { k_currentLine = k_totalRows - k_scrollerStatus.k_linesPerPage;
}
else if (k_currentLine > k_totalRows - k_scrollerStatus.k_linesPerPage) {
k_currentLine = Math.floor(k_totalRows / k_status.k_totalRows * k_currentLine);
}
k_params[k_settings.k_startParamName] = k_currentLine;
this._k_scrollerWidget._k_updateStatus({k_currentLine: k_currentLine});
this._k_updateStatus({k_totalRows: undefined});
this.k_resetSelection();
this.k_isLoaded = false;
this._k_dataStore.k_reloadData(k_params);
return;
}
if (-1 !== k_start && k_start !== k_currentLine) {
return;
}
if (k_totalRows !== k_status.k_totalRows && false === this.k_isLoaded) {
k_currentLine = -1 === k_start ? k_totalRows - k_limit : k_currentLine;
if (k_currentLine < 0) {
k_currentLine = 0;
}
this.k_setTotalRows(k_totalRows, k_currentLine);
k_invisiblePartOfLine = this.k_getStatus().k_scrollerStatus.k_invisiblePartOfLine;
}
this._k_updateStatus({k_currentLine: k_currentLine});
this._k_extDataView._kxp.k_refresh.call(this._k_extDataView);
this._k_proxyScroller.dom.scrollTop = k_invisiblePartOfLine;
this.k_isLoaded = true;
k_status = this.k_getStatus();
this._k_updateStatus({
k_start: k_start,
k_limit: k_limit,
k_lastProxyScrollerPosition: this._k_proxyScroller.dom.scrollTop,
k_isBottomPosition: k_status.k_scrollerStatus.k_isLastLineVisible
});
this._k_addRowsNumber();
if (this._k_selection) {
this._k_renewSelection();
}
if (this._k_onScrollFetch) {
this._k_onScrollFetch(this, this.k_getStatus());
}
return;
},

k_setTotalRows: function(k_totalRows, k_currentLine) {
var k_scrollerWidget = this._k_scrollerWidget;
k_scrollerWidget.k_setTotalLines(k_totalRows, k_currentLine);
this._k_updateStatus({
k_totalRows: k_totalRows
});
if (undefined !== k_currentLine) {
this._k_updateStatus({
k_start: k_currentLine,
k_currentLine: k_currentLine
});
}
},

_k_fetchOnDemand: function() {
var
k_status = this.k_getStatus(),
k_start = k_status.k_scrollerStatus.k_currentLine,  k_limit = k_status.k_limit,
k_totalRows = k_status.k_totalRows,
k_params = {},
k_dataStore = this._k_dataStore,
k_scrollerWidget = this._k_scrollerWidget,
k_startParamName = this._k_settings.k_startParamName,
k_limitParamName = this._k_settings.k_limitParamName,
k_lastRequestOptions = k_dataStore.k_getLastRequestParams();
if (k_start + k_limit > k_totalRows - 1) {
k_start = k_totalRows - k_limit;
if (k_start < 0) {
k_start = 0;
}
k_scrollerWidget._k_updateStatus({k_currentLine: k_start});  k_scrollerWidget._k_updateLastPageFlags(k_start);
if (this._k_startAutoUpdate) {  this._k_startAutoUpdate();
}
}
if (k_lastRequestOptions[k_startParamName] != k_start || k_lastRequestOptions[k_limitParamName] != k_limit) {
k_params[k_startParamName] = k_start;
k_params[k_limitParamName] = k_limit;
k_dataStore.k_reloadData(k_params);
}
},

k_load: function(k_start) {
var k_params = {};
k_params[this._k_settings.k_startParamName] = k_start;
k_params[this._k_settings.k_limitParamName] = this.k_getStatus().k_limit;
this._k_dataStore.k_reloadData(k_params);
},

_k_createContextMenu: function(k_config) {
var k_contextMenu;
if (k_config.k_isInstanceOf && k_config.k_isInstanceOf('K_Menu')) {
k_contextMenu = k_config;
}
else {
k_contextMenu = new kerio.lib.K_Menu(this.k_id + '_contextMenu', k_config);
}
k_contextMenu.k_addReferences({k_relatedWidget: this});
this.k_addReferences({_k_contextMenu: k_contextMenu});
},

_k_showContextMenu: function(k_dataView, k_rowIndex, k_nodeEl, k_extEvent) {
var
k_position = k_extEvent.getXY(),
k_contextMenu = this._k_contextMenu;
if (k_contextMenu) {
k_contextMenu = k_contextMenu.k_extWidget;
k_extEvent.stopEvent();
k_contextMenu.showAt(k_position);
}
},

k_getContextMenu: function () {
return this._k_contextMenu;
},

_k_keepUserSelection: function(k_direction) {
var
k_currentSelection = this._k_selection,
k_selectionContainer = this._k_selectionContainer,
k_visibleSelection = k_selectionContainer.k_keepUserSelection(k_direction),
k_command = 'DoNothing',
k_selection,
k_status,
k_initialDirection,
k_currentDirection;
if (k_visibleSelection) {
k_selection = Ext.apply({}, k_visibleSelection);
k_selection.k_range = Ext.apply({}, k_visibleSelection.k_range);
k_status = this.k_getStatus();
k_selection.k_firstRowNumber = this._k_extDataView.getRecord(k_selection.k_firstRow).data.k_recordNumber;
k_selection.k_lastRowNumber  = this._k_extDataView.getRecord(k_selection.k_lastRow ).data.k_recordNumber;
if (k_currentSelection && this._k_isSelectionExtended) {
k_initialDirection = k_visibleSelection.k_direction;
k_currentDirection = k_visibleSelection.k_range.k_direction;
if (null === k_initialDirection) {
k_initialDirection = k_currentDirection;
k_visibleSelection.k_direction = k_initialDirection;
}
if (k_currentSelection.k_firstRowNumber < k_status.k_currentLine) {
if ('FORWARD' === k_initialDirection) {
k_command = 'StartToStart';
}
else { if ('FORWARD' === k_currentDirection) {
if (k_currentSelection.k_lastRowNumber < k_status.k_currentLine) {
k_command = 'EndToStart';
}
k_visibleSelection.k_direction = 'FORWARD';
}
}
this._k_setBoundaries(k_currentSelection, k_selection, k_command);
}
if (k_currentSelection.k_lastRowNumber >= k_status.k_currentLine + k_status.k_limit) {
if ('BACKWARD' === k_initialDirection) {
k_command = 'EndToEnd';
}
else { if ('BACKWARD' === k_currentDirection) {
if (k_currentSelection.k_firstRowNumber > k_status.k_currentLine + k_status.k_limit) {
k_command = 'StartToEnd';
}
k_visibleSelection.k_direction = 'BACKWARD';
}
}
this._k_setBoundaries(k_currentSelection, k_selection, k_command);
}
}
}
this._k_isSelectionExtended = false;
this._k_selection = k_selection;
},

_k_setBoundaries: function(k_sourceSelection, k_targetSelection, k_command) {
switch (k_command) {
case 'StartToStart':
k_targetSelection.k_firstRowNumber = k_sourceSelection.k_firstRowNumber;
k_targetSelection.k_pathToStartNode = k_sourceSelection.k_pathToStartNode;
k_targetSelection.k_range.k_startOffset = k_sourceSelection.k_range.k_startOffset;
k_targetSelection.k_range.k_startPos = k_sourceSelection.k_range.k_startPos;
break;
case 'StartToEnd':
k_targetSelection.k_lastRowNumber = k_sourceSelection.k_firstRowNumber;
k_targetSelection.k_pathToEndNode = k_sourceSelection.k_pathToStartNode;
k_targetSelection.k_range.k_endOffset = k_sourceSelection.k_range.k_startOffset;
k_targetSelection.k_range.k_endPos = k_sourceSelection.k_range.k_startPos;
break;
case 'EndToStart':
k_targetSelection.k_firstRowNumber = k_sourceSelection.k_lastRowNumber;
k_targetSelection.k_pathToStartNode = k_sourceSelection.k_pathToEndNode;
k_targetSelection.k_range.k_startOffset = k_sourceSelection.k_range.k_endOffset;
k_targetSelection.k_range.k_startPos = k_sourceSelection.k_range.k_endPos;
break;
case 'EndToEnd':
k_targetSelection.k_lastRowNumber = k_sourceSelection.k_lastRowNumber;
k_targetSelection.k_pathToEndNode = k_sourceSelection.k_pathToEndNode;
k_targetSelection.k_range.k_endOffset = k_sourceSelection.k_range.k_endOffset;
k_targetSelection.k_range.k_endPos = k_sourceSelection.k_range.k_endPos;
break;
default:
break;
}
},

_k_renewSelection: function() {
var
k_selection = this._k_selection,
k_status = this.k_getStatus(),
k_start = k_status.k_currentLine,
k_limit = k_status.k_limit,
k_firstRowNumber = k_selection.k_firstRowNumber,
k_lastRowNumber = k_selection.k_lastRowNumber,
k_isFirstSelectedRowInView = this.k_isRowInView(k_firstRowNumber, true),
k_isLastSelectedRowInView  = this.k_isRowInView(k_lastRowNumber, true),
k_extDataView = this._k_extDataView,
k_range,
k_isSelectionVisible;
if (0 === k_extDataView.store.getCount()) {
return;  }
k_selection = Ext.apply({}, this._k_selection);
k_selection.k_range = Ext.apply({}, this._k_selection.k_range);
k_range = k_selection.k_range;
if (k_isFirstSelectedRowInView || k_isLastSelectedRowInView || (k_firstRowNumber < k_start && k_lastRowNumber > k_start + k_limit - 1)) {
k_isSelectionVisible = true;
if (k_isFirstSelectedRowInView) {
k_selection.k_firstRow = k_extDataView.getNode(k_firstRowNumber - k_start);
}
else {
k_selection.k_firstRow = k_extDataView.getNode(0);
k_range.k_startOffset = -1;  }
if (k_isLastSelectedRowInView) {
k_selection.k_lastRow = k_extDataView.getNode(k_lastRowNumber - k_start);
}
else {
k_selection.k_lastRow = k_extDataView.getNode(k_limit - 1);
k_range.k_endOffset = -1;
}
if ('scrollHorizontally' === k_range.k_command) {
this.k_highlightText(k_firstRowNumber, k_range.k_startPos, k_range.k_endPos);
delete k_range.k_command;
}
}
else {
k_isSelectionVisible = false;
if (k_lastRowNumber < k_start) {
k_selection.k_firstRow = k_extDataView.getNode(0);
k_range.k_startPos = 0;
}
else {
k_selection.k_firstRow = k_extDataView.getNode(k_limit - 1);
k_range.k_startPos = this._k_selectionContainer._k_getTextLength(k_selection.k_firstRow);
}
k_selection.k_lastRow = k_selection.k_firstRow;
k_range.k_endPos = k_range.k_startPos;
k_range.k_startNode = null;
k_range.k_collapsed = true;
k_range.k_className = this._k_selectionContainer._k_SELECTION_CARET;
}
if (kerio.lib.k_isMSIE7) {
this._k_proxyScroller.repaint();
}
this._k_selectionContainer.k_createSelection(this._k_selectionContainer._k_normalizeSelection(k_selection));
if (this._k_scrollerWidget._k_isShiftKeyDown) {
this._k_insertCaret();
}
if (this._k_storedConfig.k_onSelectionRenewed) {
this._k_storedConfig.k_onSelectionRenewed.call(this, this, this.k_getSelection(), k_isSelectionVisible);
}
},

_k_addRowsNumber: function() {
var
k_records = this._k_extDataView.store.data.items,
k_start = this.k_getStatus().k_currentLine,
k_i,
k_cnt;
for (k_i = 0, k_cnt = k_records.length; k_i < k_cnt; k_i++) {
k_records[k_i].data.k_recordNumber = k_start + k_i;
}
},

_k_scrollerOnScroll: function(k_scroller, k_scrollType, k_currentLine) {
this._k_updateStatus({k_scrollerScrollType: k_scrollType});
if (this._k_onScroll) {
this._k_onScroll.call(this, this, this.k_getStatus());
}
this._k_fetchOnDemand.call(this);
},

k_getPageSize: function() {
return this.k_getStatus().k_limit;
},

k_getSelection: function() {
return this._k_selection;
},

k_isSelection: function () {
var k_selection = this._k_selection;
if (!k_selection) {
return false;
}
return k_selection.k_firstRowNumber !== k_selection.k_lastRowNumber || k_selection.k_range.k_startPos !== k_selection.k_range.k_endPos;
},

k_resetSelection: function () {
this._k_selection = null;
},

k_getSelectedText: function(k_columnId) {
var
k_buffer = this._k_dataStore.k_extWidget._kx.k_buffer,
k_data = k_buffer.k_data,
k_currentSelection = this.k_getSelection(),
k_text = '',
k_lastLine,
k_from,
k_to,
k_i;
if (!k_currentSelection) {
return '';
}
k_from = Math.max(k_currentSelection.k_firstRowNumber, k_buffer.k_start) - k_buffer.k_start;
k_to = Math.min(k_currentSelection.k_lastRowNumber, k_buffer.k_start + k_buffer.k_limit) - k_buffer.k_start;
if (k_from === k_to) {
k_text = k_data[k_from].data[k_columnId].substring(k_currentSelection.k_range.k_startPos, k_currentSelection.k_range.k_endPos);
}
else {
k_text = k_data[k_from].data[k_columnId].substring(k_currentSelection.k_range.k_startPos) + '\n';
for (k_i = k_from + 1; k_i < k_to; k_i++) {
k_text += k_data[k_i].data[k_columnId] + '\n';
}
k_lastLine = k_data[k_to].data[k_columnId];
if (-1 !== k_currentSelection.k_range.k_endOffset) {  k_lastLine = k_lastLine.substring(0, k_currentSelection.k_range.k_endPos);
}
k_text += k_lastLine;
}
return k_text;
},

_k_fillClipboard: function() {
var
k_clipboard = kerio.lib.k_clipboardElement,
k_selection = this.k_getSelection(),
k_selectedText = '',
k_buffer,
k_from,
k_to;
if (k_selection) {
k_buffer = this.k_getDataStore().k_extWidget._kx.k_buffer;
k_from = Math.max(k_selection.k_firstRowNumber, k_buffer.k_start) - k_buffer.k_start;
k_to = Math.min(k_selection.k_lastRowNumber, k_buffer.k_start + k_buffer.k_limit) - k_buffer.k_start;
if (k_selection.k_lastRowNumber - k_selection.k_firstRowNumber > k_to - k_from) {
return false;
}
k_selectedText = this.k_getSelectedText('content');   }
k_clipboard.k_returnFocusTo = this._k_scrollerWidget._k_focusEl;
k_clipboard.dom.value = k_selectedText;
k_clipboard.focus();
k_clipboard.dom.select();
if (kerio.lib.k_isWebKit && kerio.lib.k_isSnowLeopardOrLater) {
k_clipboard.k_relayKeyDown = this._k_scrollerWidget;
}
return true;
},

_k_doCopyToClipboard: function () {
var k_selectedText = null;
if (this._k_fillClipboard()) {
k_selectedText = this.k_getSelectedText('content');   }
else {
if (this._k_storedConfig.k_onClipboardIsTooLarge) {
this._k_storedConfig.k_onClipboardIsTooLarge.call(this, this, this.k_getSelection());
}
}
return k_selectedText;
},

k_scrollToRow: function (k_rowIndex, k_suppressScrollEvent, k_reachBottom) {
if (k_reachBottom && k_rowIndex >= this.k_getStatus().k_scrollerStatus.k_maxStartLine) {
this._k_scrollerWidget.k_scrollToBottom(k_suppressScrollEvent);
}
else {
this._k_scrollerWidget.k_scrollToLine(k_rowIndex, k_suppressScrollEvent);
}
},

k_scrollToBottom: function (k_suppressScrollEvent) {
this._k_scrollerWidget.k_scrollToBottom(k_suppressScrollEvent);
},

k_isRowInView: function (k_rowIndex, k_allowPartiallyVisible) {
var
k_status = this.k_getStatus(),
k_startRow = k_status.k_currentLine,
k_endRow = k_startRow + k_status.k_limit - 1;
if (true !== k_allowPartiallyVisible) {
if (0 !== k_status.k_scrollerStatus.k_displayOffset) {
if (1 === k_status.k_scrollerStatus.k_displayOffsetDirection) {
k_startRow += 1;
}
else {
k_endRow -= 1;
}
}
}
return k_rowIndex >= k_startRow && k_rowIndex <= k_endRow;
},

k_getDataStore: function () {
return this._k_dataStore;
},

_k_prepareRowData: function (k_rowData) {
var k_rowView = this._kx.k_rowView;
return k_rowView._k_settings.k_rowRenderer.call(k_rowView, k_rowView, k_rowData);
},

k_fixScrollPosition: function() {
var
k_status = this.k_getStatus(),
k_scroller = this._k_scrollerWidget,
k_scrollTopPosition = k_status.k_scrollerStatus.k_scrollTopPosition,
k_scrollLeftPosition = k_status.k_scrollerStatus.k_scrollLeftPosition;
if ((kerio.lib.k_isMSIE || kerio.lib.k_isMSIE11) && k_scroller._k_fakeScrollers) {
k_scroller._k_fakeScrollers.k_arrowUp.dom.scrollTop = 50;  k_scroller._k_fakeScrollers.k_arrowDn.dom.scrollTop = 50;
}
this._k_proxyScroller.dom.scrollTop = k_status.k_lastProxyScrollerPosition;
if (0 !== k_scrollTopPosition) {
k_scroller._k_updateStatus({k_scrollTopPosition: 0});
k_scroller._k_setScrollPosition(k_scrollTopPosition, true);
}
if (0 !== k_scrollLeftPosition) {
k_scroller._k_updateStatus({k_scrollLeftPosition: 0});
k_scroller._k_element.dom.scrollLeft = k_scrollLeftPosition;
}
},

_k_onMouseDown: function (k_extEvent) {
var
k_extDataView = this._k_extDataView,
k_selectionContainer = this._k_selectionContainer;
if (0 !== k_extEvent.button) {
return;
}
this._k_updateStatus({k_selectionStart: {
k_XY: k_extEvent.getXY(),
k_rowEl: k_extEvent.getTarget(this._k_extDataView.itemSelector)
}});
k_extDataView.addClass('hideSelection');
if (this._k_spotlight) {
if (kerio.lib.k_isMSIE9 || kerio.lib.k_isMSIE10 || kerio.lib.k_isMSIE11) {
this._k_spotlight.k_show.defer(10, this._k_spotlight, [this._k_proxyScroller, this]);
}
else {
this._k_spotlight.k_show(this._k_proxyScroller, this);
}
}
if (this._k_storedConfig.k_onBeforeSelect) {
this._k_storedConfig.k_onBeforeSelect.call(this, this);
}
if (kerio.lib.k_isMSIE || kerio.lib.k_isMSIE11) {
k_extDataView.addClass('selectable');
}
this._k_isSelectionStarted = true;
if (k_extEvent.shiftKey) {
if (!k_selectionContainer._k_visibleSelection) {
if (kerio.lib.k_isMSIE || kerio.lib.k_isMSIE11) {
k_extDataView.removeClass('selectable');
}
this._k_isSelectionStarted = false;
k_selectionContainer.k_clearBrowserSelection();
k_extEvent.stopEvent();
return;
}
this._k_isSelectionExtended = true;
if (kerio.lib.k_isWebKit) {
this._k_scrollerWidget._k_focusEl.focus();
}
}
},

_k_onMouseUp: function(k_extEvent) {
var k_visibleSelection = this._k_selectionContainer._k_visibleSelection;
this._k_extDataView.removeClass('hideSelection');
if (this._k_spotlight) {
this._k_spotlight.k_hide(this._k_proxyScroller);
}
if (this._k_isSelectionStarted) {
this._k_isSelectionStarted = false;
if (k_visibleSelection && 'CARET' === k_visibleSelection.k_range.k_className && null === this._k_getDirection(k_extEvent)) {
k_visibleSelection.k_direction = null;
}
this._k_keepUserSelection(this._k_isSelectionExtended ? null : this._k_getDirection(k_extEvent));
if (this._k_selection && k_extEvent.shiftKey) {
if (Ext.isGecko) {
this._k_insertCaret.defer(10, this);
}
else if (Ext.isIE) {
this._k_insertCaret();
}
}
if (this._k_storedConfig.k_onSelectionChange) {
this._k_storedConfig.k_onSelectionChange.call(this, this, this.k_getSelection());
}
}
},

_k_onDblClick: function(k_extEvent) {
var
k_range,
k_rect;
if (k_extEvent.shiftKey) {
return;
}
if (this._k_selectionContainer.k_selectWordAtMousePosition(k_extEvent)) {
this._k_isSelectionStarted = true;
this._k_scrollerWidget._k_focusEl.focus();  if (document.selection) {
k_range = document.selection.createRange();
}
else {
k_range = window.getSelection().getRangeAt(0);
}
k_rect = k_range.getBoundingClientRect();
k_extEvent.xy = [parseInt(k_rect.right, 10), k_extEvent.xy[1]];
this._k_onMouseUp(k_extEvent);
}
},

k_highlightText: function(k_rowIndex, k_startPos, k_endPos, k_keepExisting) {
var
k_start = this.k_getStatus().k_currentLine,
k_relativeRowIndex,
k_searchResultEl,
k_scrollerWidget,
k_selection,
k_viewWidth,
k_rowEl,
k_elLeft,
k_elRight,
k_scrollLeftPosition;
k_relativeRowIndex = k_rowIndex - k_start;
k_rowEl = this._k_extDataView.getNode(k_relativeRowIndex);
k_selection = this._k_selectionContainer.k_highlightTextInRow(k_rowEl, k_startPos, k_endPos, k_keepExisting);
if (!k_selection) {
return;
}
k_selection = Ext.apply({}, k_selection);
k_selection.k_range = Ext.apply({}, k_selection.k_range);
k_selection.k_firstRowNumber = k_rowIndex;
k_selection.k_lastRowNumber = k_rowIndex;
this._k_selection = k_selection;
k_scrollerWidget = this._k_scrollerWidget;
k_viewWidth = this._k_proxyScroller.getWidth();
k_searchResultEl = Ext.fly(k_rowEl).child('.' + this._k_selectionContainer._k_SELECTION_HIGHLIGHT).dom;
k_elLeft = k_searchResultEl.offsetLeft;
k_elRight = k_elLeft + k_searchResultEl.offsetWidth;
k_scrollLeftPosition = k_scrollerWidget.k_getStatus().k_scrollLeftPosition;
if (k_elRight - k_scrollLeftPosition > k_viewWidth) {
k_scrollLeftPosition = k_elRight - k_viewWidth + 5;
}
else if (k_elLeft < k_scrollLeftPosition) {
k_scrollLeftPosition = k_elLeft <= k_viewWidth ? 0 : k_elLeft - 5;
}
k_scrollerWidget._k_setScrollLeft(k_scrollLeftPosition); this._k_insertCaret();
},

_k_highlightTextInBuffer: function(k_rowIndex, k_startPos, k_endPos) {
if (this.k_isRowInView(k_rowIndex)) {
this.k_highlightText(k_rowIndex, k_startPos, k_endPos);
}
else {
this._k_selection = {
k_firstRowNumber: k_rowIndex,
k_lastRowNumber: k_rowIndex,
k_range: {
k_startPos: k_startPos,
k_endPos: k_endPos,
k_className: kerio.lib._K_SelectionContainer.prototype._k_SELECTION_HIGHLIGHT,
k_command: 'scrollHorizontally'
}
};
if (k_rowIndex < this.k_getStatus().k_totalRows - 1) {
this.k_scrollToRow(k_rowIndex);
}
else {
this.k_scrollToBottom();
}
}
},

_k_onBlurWebkit: function() {
var k_keepEndOffset;
if (this._k_selection) {
k_keepEndOffset = -1 === this._k_selection.k_range.k_endOffset;
this._k_insertCaret();
if (k_keepEndOffset) {
this._k_selection.k_range.k_endOffset = -1;
}
}
},

_k_selectAll: function() {
var
k_extDataView = this._k_extDataView,
k_status = this.k_getStatus(),
k_dataLength = k_extDataView.store.data.length,
k_lastRow,
k_selection;
if (0 === k_dataLength) {
return;
}
k_lastRow = k_extDataView.getNode(k_dataLength - 1);
k_selection = {
k_firstRow: k_extDataView.getNode(0),
k_lastRow: k_lastRow,
k_range: {
k_startNode: null,
k_startPos: 0,
k_endNode: null,
k_endPos: this._k_selectionContainer._k_getTextLength(k_lastRow),  k_className: this._k_selectionContainer._k_SELECTION_USER
}
};
k_selection = this._k_selectionContainer.k_createSelection(this._k_selectionContainer._k_normalizeSelection(k_selection));
k_selection.k_firstRowNumber = 0;
k_selection.k_lastRowNumber = k_status.k_totalRows - 1;
k_selection.k_range.k_endOffset = -1;    this._k_selection = k_selection;
if (this._k_storedConfig.k_onSelectionChange) {
this._k_storedConfig.k_onSelectionChange.call(this, this, this.k_getSelection());
}
},

_k_showInternalMask: function(k_show) {
this._k_internalMask.dom.style.display = k_show ? 'block' : 'none';
},

_k_cancelTextSelection: function() {
if (document.selection) {
document.selection.clear();
}
if (this._k_spotlight) {
this._k_spotlight.k_hide(this._k_proxyScroller);
}
this._k_isSelectionStarted = false;
},

_k_getDirection: function(k_extEvent) {
var
k_selectionStart = this.k_getStatus().k_selectionStart,
k_selectionStartXY = k_selectionStart.k_XY,
k_selectionEndXY = k_extEvent.getXY(),
k_rowEl = k_extEvent.getTarget(this._k_extDataView.itemSelector),
k_direction;
if (k_rowEl === k_selectionStart.k_rowEl) {  k_direction = k_selectionEndXY[0] > k_selectionStartXY[0] ? 'FORWARD' : k_selectionEndXY[0] < k_selectionStartXY[0] ? 'BACKWARD' : null;
}
else if (k_selectionEndXY[1] > k_selectionStartXY[1]) {
k_direction = 'FORWARD';
}
else {
k_direction = 'BACKWARD';
}
return k_direction;
},

_k_insertCaret: function () {
var
k_proxyScrollerElement,
k_scrollerScrollLeft,
k_activeElement,
k_focusEl;
if (!this._k_selectionContainer._k_visibleSelection || kerio.lib.k_getActiveDialog()) {
return;
}
if (kerio.lib.k_isMSIE) {
k_activeElement = document.activeElement;
}
this._k_selectionContainer._k_insertCaret();
if (kerio.lib.k_isMSIE) {
k_scrollerScrollLeft = this._k_scrollerWidget._k_element.dom.scrollLeft;
k_proxyScrollerElement = this._k_proxyScroller.dom;
if (k_scrollerScrollLeft !== k_proxyScrollerElement.scrollLeft) {
k_proxyScrollerElement.scrollLeft = k_scrollerScrollLeft;
}
k_focusEl = this._k_scrollerWidget._k_focusEl;
if (k_activeElement && k_activeElement !== k_focusEl.dom && -1 === k_activeElement.className.indexOf('singleRow')) {
k_activeElement.focus();
}
else {
k_focusEl.focus.defer(10, k_focusEl);
}
}
},

_k_onMouseUpInSpotlight: function(k_event) {
var k_extEvent = new Ext.EventObjectImpl(k_event);
this._k_onMouseUp(k_extEvent);
},

_k_setTouchEvents: function() {
var
k_touchScroller,
k_touchController;
this._k_scrollerWidget._k_element.addClass('permanentScrollbars');
k_touchScroller = this._k_proxyScroller.createChild({
tag: 'div',
id: this._k_elementIds.k_touchScrollerId,
cls: 'selectable touchScroller'
});
k_touchController = new kerio.lib.K_TouchController({
k_element: k_touchScroller.dom,
k_onTouchStart: this._k_onTouchStart,
k_onTouchMove: this._k_onTouchMove,
k_onTouchEnd: this._k_onTouchEnd,
k_onSingleTap: this._k_onSingleTap,
k_onDoubleTap: this._k_onDoubleTap,
k_scope: this,
k_preventDefault: false
});
this._k_momentumStack = [];
},

_k_onTouchStart: function(k_touchStatus) {
var
k_status = this.k_getStatus(),
k_momentumStack = this._k_momentumStack,
k_i, k_cnt;
if ('Range' === window.getSelection().type) { return;
}
if (!k_touchStatus.k_isFirstTouch) {
return;
}
if (this._k_contextMenu.k_extWidget.isVisible()) {  this._k_contextMenu.k_setVisible(false);
}
for (k_i = 0, k_cnt = k_momentumStack.length; k_i < k_cnt; k_i++) {
window.clearTimeout(k_momentumStack[k_i]);
}
k_momentumStack.length = 0;
k_touchStatus.k_hostStatus = {
k_lastX: k_touchStatus.k_currentX,
k_lastY: k_touchStatus.k_currentY,
k_startLine: k_status.k_currentLine,
k_thresholdX: 3,
k_thresholdY: parseInt(0.5 * k_status.k_scrollerStatus.k_lineHeight, 10)  };
},

_k_onTouchMove: function(k_touchStatus) {
var
k_status = this.k_getStatus(),
k_scrollerStatus = k_status.k_scrollerStatus,
k_myTouchStatus = k_touchStatus.k_hostStatus,
k_diffY = k_touchStatus.k_currentY - k_myTouchStatus.k_lastY, k_directionY = k_diffY > 0 ? 1 : -1,
k_fingers = k_touchStatus.k_fingers,
k_lines;
if (Math.abs(k_diffY) >= k_myTouchStatus.k_thresholdY) {
k_myTouchStatus.k_lastY = k_touchStatus.k_currentY;
k_lines = parseInt(k_touchStatus.k_totalOffsetY / k_scrollerStatus.k_lineHeight, 10);
if (0 === k_lines) {
k_myTouchStatus.k_lastY -= k_directionY * (k_scrollerStatus.k_lineHeight - k_myTouchStatus.k_thresholdY);
k_lines = k_directionY;
}
if (k_fingers > 1) {
k_lines = Math.pow(10 ,k_fingers - 2) * k_lines * k_scrollerStatus.k_pageStepInLines;
}
this.k_scrollToRow(k_myTouchStatus.k_startLine - k_lines, false, true);
}
if (Math.abs(k_touchStatus.k_offsetX) >= k_myTouchStatus.k_thresholdX) {
this._k_scrollerWidget._k_element.dom.scrollLeft -= k_touchStatus.k_offsetX;
}
k_touchStatus.k_event.preventDefault();
},

_k_onTouchEnd: function(k_touchStatus) {
var
k_minVelocity = 0.5,
k_velocity = k_touchStatus.k_velocityY,
k_absVelocity = Math.abs(k_velocity);
if (0 === k_touchStatus.k_fingers && k_absVelocity > k_minVelocity) {
this.k_doMomentum(this.k_getStatus().k_currentLine, k_velocity / k_absVelocity, k_absVelocity);
}
},

k_doMomentum: function(k_startLine, k_direction, k_absVelocity) {
var
k_momentumStack = this._k_momentumStack,
k_scrollerStatus = this.k_getStatus().k_scrollerStatus,
k_interval = 20,
k_koef = 1.15,
k_maxLines,
k_line,
k_i;
k_maxLines = k_scrollerStatus.k_linesPerPage * k_absVelocity / 1.2;  for (k_i = 0; k_i < k_maxLines; k_i++) {
k_line = k_startLine - k_i * k_direction;
k_momentumStack.push(this.k_scrollToRow.defer(k_interval, this, [k_line, false, true]));
k_interval = k_koef * k_interval;
}
},

_k_onSingleTap: function(k_touchStatus) {
var
k_row = this._k_getTouchedRow(k_touchStatus);
if (k_row) {
this._k_doTouchOnLink(k_row, k_touchStatus);
}
},

_k_onDoubleTap: function(k_touchStatus) {
var k_fakeEvent = {
k_x: k_touchStatus.k_currentX,
k_y: k_touchStatus.k_currentY,
getXY: function() {return [this.k_x, this.k_y];},
stopEvent: Ext.emptyFn
};
this._k_showContextMenu(null, null, null, k_fakeEvent);
},

_k_getTouchedRow: function(k_touchStatus) {
var
k_offset = this._k_extDataView.getPosition(),
k_y = k_touchStatus.k_currentY - k_offset[1],
k_rowIndex = parseInt(k_y / this._k_settings.k_rowHeight, 10);
return this._k_extDataView.getNode(k_rowIndex);
},

_k_doTouchOnLink: function(k_row, k_touchStatus) {
var
k_links = k_row.getElementsByTagName('a'),
k_rect,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_links.length; k_i < k_cnt; k_i++) {
k_rect = k_links[k_i].getBoundingClientRect();
if (k_touchStatus.k_currentX >= k_rect.left && k_touchStatus.k_currentX <= k_rect.right) {
kerio.lib.k_openWindow(k_links[k_i].href);
break;
}
}
},

_k_copyRowsToTouchScroller: function (k_dataView) {
var
k_rows = k_dataView.el.dom.childNodes,
k_touchScroller = Ext.get(this._k_elementIds.k_touchScrollerId),
k_innerHtml = '',
k_selection,
k_activeElement,
k_i, k_cnt;
if (!k_touchScroller) {
return;
}
k_selection = window.getSelection();
k_activeElement = document.activeElement;
if (
k_activeElement
&& 'input' === k_activeElement.tagName.toLowerCase()
&& k_selection
&& k_selection.focusNode
&& k_selection.focusNode.contains(k_activeElement)
) {
return;
}
k_selection.removeAllRanges();
for (k_i = 0, k_cnt = k_rows.length; k_i < k_cnt; k_i++) {
k_innerHtml += k_rows[k_i].firstChild.innerHTML + '<br>';
}
k_touchScroller.dom.innerHTML = k_innerHtml;
},

_k_fixSize: function() {
if (this._k_proxyScroller && 0 === this._k_proxyScroller.getWidth(true)) {
this.k_extWidget.syncSize();
}
}
});


kerio.lib.K_TaskRunner = function(k_config) {
var k_tasks = k_config.k_taskList;
this.k_extWidget = new Ext.util.TaskRunner(k_config.k_precision);
this._k_tasks = {}; this.k_add(k_tasks);
};
kerio.lib.K_TaskRunner.prototype =
{



k_start: function(k_taskId) {
if (!this.k_isDefined(k_taskId)) {
kerio.lib.k_reportError('Cannot start undefined task ' + k_taskId, 'taskRunner', 'k_start');
return;
}
var k_task = this._k_tasks[k_taskId];
if (false === k_task._kx.k_isRunning) {
k_task._kx.k_isRunning = true;
k_task._kx.k_isSuspended = false; this.k_extWidget.start(k_task);
return true;
}
return false;
},

k_stop: function(k_taskId) {
if (!this.k_isDefined(k_taskId)) {
kerio.lib.k_reportError('Cannot stop undefined task ' + k_taskId, 'taskRunner', 'k_stop');
return;
}
var k_task = this._k_tasks[k_taskId];
if (true === k_task._kx.k_isRunning) {
k_task._kx.k_isRunning = false;
if (false === k_task._kx.k_isSuspended) { 
this.k_extWidget.stop(k_task);
}
return true;
}
return false;
},

k_suspend: function(k_taskId) {
if (!this.k_isDefined(k_taskId)) {
kerio.lib.k_reportError('Cannot suspend undefined task ' + k_taskId, 'taskRunner', 'k_suspend');
return;
}
var k_task = this._k_tasks[k_taskId];
if (true === k_task._kx.k_isRunning && false === k_task._kx.k_isSuspended) {
k_task._kx.k_isSuspended = true;
this.k_extWidget.stop(k_task);
return true;
}
return false;
},

k_resume: function(k_taskId, k_startDeferred) {
if (!this.k_isDefined(k_taskId)) {
kerio.lib.k_reportError('Cannot resume undefined task ' + k_taskId, 'taskRunner', 'k_resume');
return;
}
var k_task = this._k_tasks[k_taskId];
k_task._kx.k_startSuspended = false; if (true === k_task._kx.k_isRunning && true === k_task._kx.k_isSuspended) {
k_task._kx.k_isSuspended = false;
k_task._kx.k_startDeferred = (true === k_startDeferred);
this.k_extWidget.start(k_task);
return true;
}
return false;
},

k_isDefined: function(k_taskId) {
var
k_task = this._k_tasks[k_taskId],
k_exists = (k_task && k_task.run);  return k_exists;
},

k_add: function(k_taskList) {
var
k_tasks = this._k_tasks,
k_i,
k_cnt,
k_singleTask;
if (!k_taskList) {
return;
}
if (Array !== k_taskList.constructor) {
k_taskList = [ k_taskList ];
}
for (k_i = 0, k_cnt = k_taskList.length; k_i < k_cnt; k_i++) {
k_singleTask = k_taskList[k_i];
this.k_remove(k_singleTask.k_id, true); k_tasks[k_singleTask.k_id] = {
run     : this._k_runWrapper,
interval: k_singleTask.k_interval,

_kx: {
k_isRunning: false,
k_isSuspended: false,
k_tasks: this,
k_taskId: k_singleTask.k_id,
k_run: k_singleTask.k_run,
k_scope: k_singleTask.k_scope || this,
k_params: k_singleTask.k_params || [],
k_startDeferred: (true === k_singleTask.k_startDeferred),
k_startSuspended: (true === k_singleTask.k_startSuspended)
}
}; if (true === k_singleTask.k_startNow) {
this._k_startNewTask.defer(1, this, [k_singleTask.k_id]); }
}
}, 
k_remove: function(k_taskId, k_silentRemove) {
if (!this.k_isDefined(k_taskId)) {
if (true !== k_silentRemove) {
kerio.lib.k_reportError('Cannot remove task ' + k_taskId + '; it was already removed or was not defined', 'taskRunner', 'k_remove');
}
return false;
}
if (true === this._k_tasks[k_taskId]._kx.k_isRunning) {
this.k_stop(k_taskId);
}
delete this._k_tasks[k_taskId];
return true;
}, 
_k_runWrapper: function() {
var
k_params = this._kx,
k_tasks = k_params.k_tasks,
k_myId  = k_params.k_taskId,
k_result;
if (!k_tasks._k_tasks[k_myId]) { k_tasks.k_extWidget.stop(this);
return;
}
if (!k_params.k_isRunning || k_params.k_isSuspended) { k_tasks.k_extWidget.stop(this);
return;
}
if (k_params.k_startSuspended) { k_tasks.k_suspend(k_myId);
k_params.k_startSuspended = false; return;
}
if (k_params.k_startDeferred && 2 > this.taskRunCount) { return; }
k_result = k_params.k_run.apply(k_params.k_scope, k_params.k_params);
if (false === k_result) {
k_tasks.k_suspend(k_myId);
}
},

_k_startNewTask: function(k_taskId) {
if (this.k_isDefined(k_taskId)) {
this.k_start(k_taskId);
} } };


kerio.lib.K_ColorPicker = function(k_id, k_config) {
kerio.lib.K_ColorPicker.superclass.constructor.call(this, k_id, k_config);
this.k_addReferences({
k_relatedGrid: undefined
});
};
Ext.extend(kerio.lib.K_ColorPicker, kerio.lib._K_BaseWidget,
{

_k_propertiesMapping: {},

_k_propertiesDefault: {
width: 130,
height: 80
},

_k_beforeInitExtComponent: function () {},

_k_initExtComponent: function() {
var k_extWidget = new Ext.menu.ColorMenu({
handler: this._k_colorizeSelectedRow
});
k_extWidget.palette.colors = ['FFFFFF', 'FFFFCE', 'FEF6E3', 'FFE4E4', 'F0DAF7', 'E2ECF8', 'E2F9E0',
'E8E8E8', 'FFFFB2', 'FDE8CA', 'FFCCCC', 'DDBFEB', 'C9D8ED', 'C9EEC6',
'D4D4D4', 'FFFF9A', 'F9D4B1', 'FFB3B3', 'C6A6D9', 'B0C0DB', 'B0DDAD',
'C6C6C6', 'FFFF81', 'F6C69E', 'FFA1A1', 'B693CB', 'A5B7D6', '9DD09A'];
return k_extWidget;
},

_k_afterInitExtComponent: function() {
this.k_extWidget.on('beforeshow', this._k_markUsedColor, this);
},

_k_colorizeSelectedRow: function(k_colorPalette, k_color) {
var
k_grid = this._kx.k_owner._k_getRelatedGrid(),
k_selectionStatus = k_grid.k_selectionStatus,
k_selection = k_selectionStatus.k_rows,
k_row,
k_cnt, k_i;
for (k_i = 0, k_cnt = k_selectionStatus.k_selectedRowsCount; k_i < k_cnt; k_i++) {
k_grid.k_updateRow({color: k_color}, k_selection[k_i].k_rowIndex);
}
kerio.adm.k_framework.k_enableApplyReset();
},

_k_getRelatedGrid: function() {
if (this.k_relatedGrid) {
return this.k_relatedGrid;
}
var
k_mainWidget = this.k_getMainWidget();
k_mainWidget = k_mainWidget.k_isInstanceOf('K_Menu') ? k_mainWidget.k_relatedToolbar.k_relatedWidget : k_mainWidget;
k_mainWidget = k_mainWidget.k_isInstanceOf('K_Dialog') ? k_mainWidget.k_grid : k_mainWidget;
this.k_relatedGrid = k_mainWidget;
return k_mainWidget;
},

_k_markUsedColor: function() {
var
k_grid = this._k_getRelatedGrid(),
k_selection,
k_extPalette = this.k_extWidget.palette,
k_color;
if (k_grid.k_isInstanceOf('K_Grid')) {
k_selection = k_grid.k_selectionStatus.k_rows;
}
else {
return;
}
if (1 === k_selection.length) {
k_color = k_selection[0].k_data.color.toUpperCase();
if (k_grid._k_convertColor) {
k_color = k_grid._k_convertColor(k_color);
}
if (-1 !== k_extPalette.colors.indexOf(k_color)) {
k_extPalette.select(k_color, true);
}
}
}
});