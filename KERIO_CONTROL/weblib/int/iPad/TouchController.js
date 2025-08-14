
kerio.lib.K_TouchController = function(k_config) {
var k_element = k_config.k_element;
this.k_callbacks = {
touchstart   : k_config.k_onTouchStart,
touchmove    : k_config.k_onTouchMove,
touchend     : k_config.k_onTouchEnd,
k_onSingleTap: k_config.k_onSingleTap,
k_onDoubleTap: k_config.k_onDoubleTap,
k_scope      : k_config.k_scope
};
this.k_preventDefault = k_config.k_preventDefault;
k_element.addEventListener('touchstart', this, false);
k_element.addEventListener('touchmove' , this, false);
k_element.addEventListener('touchend'  , this, false);
};
kerio.lib.K_TouchController.prototype = {

_k_firstFingerTouched: false,

handleEvent: function(k_browserEvent) {
var
k_eventType = k_browserEvent.type,
k_callback = this.k_callbacks[k_eventType];
switch (k_eventType) {
case 'touchstart': this.k_onTouchStart(k_browserEvent); break;
case 'touchmove' : this.k_onTouchMove (k_browserEvent); break;
case 'touchend'  : this.k_onTouchEnd  (k_browserEvent); break;
}
if (k_callback) {
k_callback.call(this.k_callbacks.k_scope, this.k_status);
}
if (false !== this.k_preventDefault) {
k_browserEvent.preventDefault();
}
},

k_onTouchStart: function(k_browserEvent) {
var	k_touch = k_browserEvent.touches[0];
if (!this._k_firstFingerTouched) {
this.k_status = {
k_firstFingerId: k_touch.identifier,
k_startTime    : k_browserEvent.timeStamp,
k_startX       : k_touch.clientX,
k_startY       : k_touch.clientY,
k_totalOffsetX : 0,
k_totalOffsetY : 0,
k_offsetX      : 0,
k_offsetY      : 0,
k_count        : 0,
k_maxFingers   : 0,
k_hostStatus   : {},  k_createExtEventFromTouch: this._k_createExtEventFromTouch
};
}
this._k_updateStatus(k_browserEvent);
if (!this._k_firstFingerTouched) {
this.k_status.k_isFirstTouch = true;  this._k_firstFingerTouched = true;
}
},

k_onTouchMove:
kerio.lib.k_isAndroidTablet && kerio.lib.k_isChrome ?
function(k_browserEvent) {
k_browserEvent.preventDefault();
this._k_updateStatus(k_browserEvent);
}
: function(k_browserEvent) {
this._k_updateStatus(k_browserEvent);
},

k_onTouchEnd: function(k_browserEvent) {
var
k_status = this.k_status,
k_duration = k_browserEvent.timeStamp - k_status.k_startTime,
k_callback;
this._k_updateStatus(k_browserEvent);
if (0 === k_browserEvent.touches.length) {  this._k_firstFingerTouched = false;
k_status.k_velocityX = (k_status.k_currentX - k_status.k_startX) / k_duration;
k_status.k_velocityY = (k_status.k_currentY - k_status.k_startY) / k_duration;
k_status.k_duration = k_duration;
}
if (k_duration < 320) {  switch (k_status.k_maxFingers) {
case 1: k_callback = this.k_callbacks.k_onSingleTap; break;
case 2: k_callback = this.k_callbacks.k_onDoubleTap; break;
}
if (k_callback) {
k_callback.call(this.k_callbacks.k_scope, this.k_status);
}
}
},

_k_updateStatus: function(k_browserEvent) {
var
k_status = this.k_status,
k_touch,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_browserEvent.changedTouches.length; k_i < k_cnt; k_i++) {
if (k_status.k_firstFingerId === k_browserEvent.changedTouches[k_i].identifier) {
k_touch = k_browserEvent.changedTouches[k_i];
break;
}
}
k_status.k_isFirstTouch = false;
if (k_touch) { k_status.k_totalOffsetX = k_touch.clientX - k_status.k_startX;
k_status.k_totalOffsetY = k_touch.clientY - k_status.k_startY;
k_status.k_offsetX = k_touch.clientX - k_status.k_currentX;
k_status.k_offsetY = k_touch.clientY - k_status.k_currentY;
k_status.k_currentX = k_touch.clientX;
k_status.k_currentY = k_touch.clientY;
}
k_status.k_count += 1;
k_status.k_fingers = k_browserEvent.touches.length;
k_status.k_maxFingers = Math.max(k_browserEvent.touches.length, k_status.k_maxFingers);
k_status.k_event = k_browserEvent;
k_status.k_scale = k_browserEvent.scale;
k_status.k_rotation = k_browserEvent.rotation;
k_status.k_touchCollections = {  touches: k_browserEvent.touches,
changedTouches: k_browserEvent.changedTouches,
targetTouches: k_browserEvent.targetTouches
};
},

_k_createExtEventFromTouch: function(k_type, k_setNewTarget) {
var
k_touchStatus = this,
k_extEvent;
if (kerio.lib.k_isAndroidTablet) {
k_extEvent = Ext.EventObject.setEvent(k_touchStatus.k_event.touches[0]);
}
else {
k_extEvent = Ext.EventObject.setEvent(k_touchStatus.k_event);
}
k_extEvent.type = k_type;
k_extEvent.button = 0;
k_extEvent.xy = [k_touchStatus.k_currentX, k_touchStatus.k_currentY];
if (k_setNewTarget) {
k_extEvent.browserEvent = {
target: document.elementFromPoint(k_touchStatus.k_currentX, k_touchStatus.k_currentY)
};
}
return k_extEvent;
}
};
