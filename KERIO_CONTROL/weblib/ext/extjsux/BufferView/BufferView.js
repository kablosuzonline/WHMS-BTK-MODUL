/*!
 * Ext JS Library 3.2.1
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.ns('Ext.ux.grid');

/**
 * @class Ext.ux.grid.BufferView
 * @extends Ext.grid.GridView
 * A custom GridView which renders rows on an as-needed basis.
 */
Ext.ux.grid.BufferView = Ext.extend(Ext.grid.GridView, {
	/**
	 * @cfg {Number} rowHeight
	 * The height of a row in the grid.
	 */
	rowHeight: 19,

	/**
	 * @cfg {Number} borderHeight
	 * The combined height of border-top and border-bottom of a row.
	 */
	borderHeight: 2,

	/**
	 * @cfg {Boolean/Number} scrollDelay
	 * The number of milliseconds before rendering rows out of the visible
	 * viewing area. Defaults to 100. Rows will render immediately with a config
	 * of false.
	 */
	scrollDelay: 100,

	/**
	 * @cfg {Number} cacheSize
	 * The number of rows to look forward and backwards from the currently viewable
	 * area.  The cache applies only to rows that have been rendered already.
	 */
	cacheSize: 20,

	/**
	 * @cfg {Number} cleanDelay
	 * The number of milliseconds to buffer cleaning of extra rows not in the
	 * cache.
	 */
	cleanDelay: 500,

	/**
	 * @cfg {Number} firefoxVrAdjust
	 * Adjust the visible row count by this value since firefox incorrectly reports grid size on zoom. see Bug CONTROL-25682
	 */
	firefoxVrAdjust: 100,

	/**
	 *
	 */
	initTemplates : function(){
		Ext.ux.grid.BufferView.superclass.initTemplates.call(this);
		var ts = this.templates;
		// empty div to act as a place holder for a row
	        ts.rowHolder = new Ext.Template(
		        '<div class="x-grid3-row {alt}" style="{tstyle}"></div>'
		);
		ts.rowHolder.disableFormats = true;
		ts.rowHolder.compile();

		ts.rowBody = new Ext.Template(
		        '<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
			'<tbody><tr>{cells}</tr>',
			(this.enableRowBody ? '<tr class="x-grid3-row-body-tr" style="{bodyStyle}"><td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on"><div class="x-grid3-row-body">{body}</div></td></tr>' : ''),
			'</tbody></table>'
		);
		ts.rowBody.disableFormats = true;
		ts.rowBody.compile();
	},

	/**
	 *
	 */
	getStyleRowHeight : function(){
		return Ext.isBorderBox ? (this.rowHeight + this.borderHeight) : this.rowHeight;
	},

	/**
	 *
	 */
	getCalculatedRowHeight : function(){
		return this.rowHeight + this.borderHeight;
	},

	/**
	 *
	 */
	getVisibleRowCount : function(){
		var firefoxVrAdj = 0;
		if (kerio.lib.k_isFirefox) {
			firefoxVrAdj = this.firefoxVrAdjust;
		}
		var rh = this.getCalculatedRowHeight(),
		    visibleHeight = this.scroller.dom.clientHeight;
		return (visibleHeight < 1) ? 0 : Math.ceil(visibleHeight / rh) + firefoxVrAdj;
	},

	/**
	 *
	 */
	getVisibleRows: function(){
		var count = this.getVisibleRowCount(),
		    sc = this.scroller.dom.scrollTop,
		    start = (sc === 0 ? 0 : Math.floor(sc/this.getCalculatedRowHeight())-1);

		return {
			first: Math.max(start, 0),
			last: Math.min(start + count + 2, this.ds.getCount()-1)
		};
	},

	/**
	 * Renders all of the rows to a string buffer and returns the string. This is called internally
	 * by renderRows and performs the actual string building for the rows - it does not inject HTML into the DOM.
	 * Overrides {@link Ext.ux.grid.BufferView#doRender}
	 * @param {Array} columns The column data acquired from getColumnData.
	 * @param {Array} records The array of records to render.
	 * @param {Ext.data.Store} store The store to render the rows from.
	 * @param {Number} startRow The index of the first row being rendered. Sometimes we only render a subset of
	 * the rows so this is used to maintain logic for striping etc.
	 * @param {Number} colCount The total number of columns in the column model.
	 * @param {Boolean} stripe True to stripe the rows.
	 * @param {Boolean} onlyBody True to render only body of the row.
	 * @param {Boolean} onlyVisible False to render all rows, not only visible.
	 * @return {String} A string containing the HTML for the rendered rows
	 */
	doRender : function(cs, rs, ds, startRow, colCount, stripe, onlyBody, onlyVisible){
		var ts = this.templates,
            ct = ts.cell,
            rt = ts.row,
            rb = ts.rowBody,
            last = colCount-1,
		    rh = this.getStyleRowHeight(),
		    vr = this.getVisibleRows(),
		    tstyle = 'width:'+this.getTotalWidth()+';height:' + Ext.Element.prototype.addUnits(rh),
		    // buffers
		    buf = [],
            cb,
            c,
            p = {},
            rp = {tstyle: tstyle},
            r;
		for (var j = 0, len = rs.length; j < len; j++) {
			r = rs[j]; cb = [];
			var rowIndex = (j+startRow),
			    visible = false === onlyVisible ? true : rowIndex >= vr.first && rowIndex <= vr.last;
			if (visible) {
				for (var i = 0; i < colCount; i++) {
					c = cs[i];
					p.id = c.id;
					p.css = i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
					p.attr = p.cellAttr = "";
					p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
					p.style = c.style;
					if (p.value === undefined || p.value === "") {
						p.value = "&#160;";
					}
					if (r.dirty && typeof r.modified[c.name] !== 'undefined') {
						p.css += ' x-grid3-dirty-cell';
					}
					cb[cb.length] = ct.apply(p);
				}
			}
			var alt = [];
			if(stripe && ((rowIndex+1) % 2 === 0)){
			    alt[0] = "x-grid3-row-alt";
			}
			if(r.dirty){
			    alt[1] = " x-grid3-dirty-row";
			}
			rp.cols = colCount;
			if(this.getRowClass){
			    alt[2] = this.getRowClass(r, rowIndex, rp, ds);
			}
			rp.alt = alt.join(" ");
			rp.cells = cb.join("");
			buf[buf.length] =  !visible ? ts.rowHolder.apply(rp) : (onlyBody ? rb.apply(rp) : rt.apply(rp));
		}
		return buf.join("");
	},

	/**
	 *
	 * @param {Object} index
	 */
	isRowRendered: function(index){
		var row = this.getRow(index);
		return row && row.childNodes.length > 0;
	},

	/**
	 *
	 */
	syncScroll: function(){
		Ext.ux.grid.BufferView.superclass.syncScroll.apply(this, arguments);
		this.update();
	},

	/**
	 * 	a (optionally) buffered method to update contents of gridview
	 */
	update: function(){
		if (this.scrollDelay) {
			if (!this.renderTask) {
				this.renderTask = new Ext.util.DelayedTask(this.doUpdate, this);
			}
			this.renderTask.delay(this.scrollDelay);
		}else{
			this.doUpdate();
		}
	},

	/**
	 *
	 * @param {Object} ds
	 * @param {Object} record
	 * @param {Object} index
	 * @param {Object} isUpdate
	 */
    onRemove : function(ds, record, index, isUpdate){
        Ext.ux.grid.BufferView.superclass.onRemove.apply(this, arguments);
        if(isUpdate !== true){
            this.update();
        }
    },

	/**
	 *
	 */
	doUpdate: function(){
		if (this.getVisibleRowCount() > 0) {
			var g = this.grid,
                cm = g.colModel,
                ds = g.store,
    	        cs = this.getColumnData(),
		        vr = this.getVisibleRows(),
                row;
			for (var i = vr.first; i <= vr.last; i++) {
				// if row is NOT rendered and is visible, render it
				if(!this.isRowRendered(i) && (row = this.getRow(i))){
					var html = this.doRender(cs, [ds.getAt(i)], ds, i, cm.getColumnCount(), g.stripeRows, true);
					row.innerHTML = html;
				}
			}
			this.clean();
		}
	},

	/**
	 * 	a buffered method to clean rows
	 */
	clean : function(){
		if(!this.cleanTask){
			this.cleanTask = new Ext.util.DelayedTask(this.doClean, this);
		}
		this.cleanTask.delay(this.cleanDelay);
	},

	/**
	 *
	 */
	doClean: function(){
		if (this.getVisibleRowCount() > 0) {
			var vr = this.getVisibleRows();
			vr.first -= this.cacheSize;
			vr.last += this.cacheSize;

			var i = 0, rows = this.getRows();
			// if first is less than 0, all rows have been rendered
			// so lets clean the end...
			if(vr.first <= 0){
				i = vr.last + 1;
			}
			for(var len = this.ds.getCount(); i < len; i++){
				// if current row is outside of first and last and
				// has content, update the innerHTML to nothing
				if ((i < vr.first || i > vr.last) && rows[i].innerHTML) {
					rows[i].innerHTML = '';
				}
			}
		}
	},

	/**
	 *
	 * @param {Object} name
	 */
    removeTask: function(name){
        var task = this[name];
        if(task && task.cancel){
            task.cancel();
            this[name] = null;
        }
    },

	/**
	 *
	 */
    destroy : function(){
        this.removeTask('cleanTask');
        this.removeTask('renderTask');
        Ext.ux.grid.BufferView.superclass.destroy.call(this);
    },

	/**
	 *
	 */
	layout: function(){
		Ext.ux.grid.BufferView.superclass.layout.call(this);
		this.update();
	}
});