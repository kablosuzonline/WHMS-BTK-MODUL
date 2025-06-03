{if $searchQuery}
    <div class="alert alert-warning">{$WALANG.Searchresultsfor} {$searchQuery}</div>
{/if}
{if $sent && $sent == 'success'}
    <div class="alert alert-success">{$WALANG.WHATSAPPsentsuccessfully}</div>
{elseif  $sent && $sent == 'error'}
    <div class="alert alert-danger">{$WALANG.WHATSAPPnotsend}</div>
{/if}
<form method="post" action="">
    <input type="hidden" name="clearlog" value="1">
    <input type="submit"  onclick="return confirm('are you sure?')" class=" btn btn-danger" value="{$WALANG.Clearlogs}">
</form>
<br>
<div class="table-responsive">
    <table id="sortable1" class="table table-striped table-bordered">
        <thead>
            <tr>
                <th>{$WALANG.client}</th>
                <th>{$WALANG.datetime}</th>
                <th>{$WALANG.phonenumber}</th>
                <th>{$WALANG.message}</th>
                <th>URL</th>
                <th>{$WALANG.status}</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>

<script>
$(document).ready(function() {
    $('#sortable1').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "?module=whatsappnotify&controller=WhatsAppLogs",
            "type": "POST"
        },
        "pageLength": 10,
        "order": [[1, "desc"]],
        "columns": [
            { "data": 0, "name": "client" },
            { "data": 1, "name": "datetime" },
            { "data": 2, "name": "phone" },
            { "data": 3, "name": "message" },
            { "data": 4, "name": "url" },
            { "data": 5, "name": "status" },
            { "data": 6, "name": "actions", "orderable": false }
        ]
    });
});
</script>
