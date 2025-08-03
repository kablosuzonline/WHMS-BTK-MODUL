          <div class="tab-pane" id="control-sidebar-layout-tab">
		  
            <ul class="control-sidebar-menu">
              <li>
                <a href="#">
                  <i class="menu-icon fa fa-wrench bg-red "></i>
                  <div class="menu-info">
                    <h4 class="control-sidebar-subheading">Layout Options </h4>
                    <p><div class="progress progress-xxs"><div class="progress-bar progress-bar-danger" style="width: 100%"></div></div></p>
                  </div>
                </a>
              </li>
            </ul>
			<p>Select your desired layout options.<br><br></p>

			<div class="form-group">
				<label class="control-sidebar-subheading"><input data-lrlayout="fixed" class="pull-right" type="checkbox" {if $lara_lrlayout eq "fixed"} checked {/if}> Fixed layout</label>
				<p>Activate the fixed layout, allowing the page to scroll while the side menu is fixed.</p>
			</div>

			<div class="form-group">
				<label class="control-sidebar-subheading"><input data-lrsidebar="expandonhover" class="pull-right" type="checkbox" {if $lara_lrlayout eq "fixed"} disabled {/if}{if {$lara_lrsidebar eq "expandonhover"} || {$lara_lrlayout eq "fixed"} } checked {/if}> Sidebar Expand on Hover</label>
				<p>Minimize the sidebar and let it expand on hover (enabled by default in Fixed layout).</p>
			</div>
			
			<div class="form-group">
			    <button class="btn btn-danger btn-block" data-layout-settings="save" disabled><span><i class="fa fa-refresh"></i></span> Apply Layout</button>
			</div>			
		</div>