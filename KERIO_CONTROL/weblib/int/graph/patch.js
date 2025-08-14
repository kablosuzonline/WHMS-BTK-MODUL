
if (kerio.lib.k_isMSIE11) {
Ext4.override(Ext4.layout.container.Container, {
getLayoutTargetSize : function() {
var target = this.getTarget(),
ret;
if (target) {
ret = target.getViewSize();
if (ret.width == 0){
ret = target.getStyleSize();
}
ret.width -= target.getPadding('lr');
ret.height -= target.getPadding('tb');
}
return ret;
}
});
}
