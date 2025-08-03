	{if empty($lara_options.cuser.permissions)}{$lara_options.cuser.permissions = []}{/if}
	{if {"lrchatwidget"|in_array:$lara_options.cuser.permissions}}	 
		 {include file="$template/widgets/chat/chat_pop_up.tpl"}
	{/if}


        </section><!-- /.content -->
      </div><!-- /.content-wrapper -->


	  
      <!-- Main Footer -->
      <footer class="main-footer">
        <!-- To the right -->
        <div class="pull-right hidden-xs">
          {$carbon->translateTimestampToFormat($smarty.now, "l, j F Y, H:i")}
        </div>
        <!-- Default to the left -->
        <strong>Copyright &copy; <a href="http://www.whmcs.com/" target="_blank">WHMCompleteSolution</a>.</strong> All rights reserved.
      </footer>
	  {include file="$template/sidebar.tpl"}

    </div><!-- ./wrapper -->
	{if {"lrchatwidget"|in_array:$lara_options.cuser.permissions}}
		<!-- https://notificationsounds.com/wake-up-tones/soft-bells-495 , license : https://creativecommons.org/licenses/by/4.0/legalcode -->
		<script type="text/javascript">
			var lrchataudio = new Audio(getlrFullPath('templates/{$template}/dist/media/soft-bells.mp3'));
		</script>
		<script src="templates/{$template}/dist/js/lrchat.js?larav={$lara_options.settings.version}"></script>	
	{/if}

    {include file="$template/includes.tpl"}	
	{$footeroutput}
	
  </body>
</html>
