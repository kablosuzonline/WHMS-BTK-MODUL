{if $mobileid != "whmcs"}
    <div class="alert alert-warning">{$WALANG.adminclientsresults}</div>
{/if}
{$listtable}
{literal}
    <script>
        $(function () {
            $(document).on('change', 'select[name=sortable1_length]', function () {
                $('[type="checkbox"]').bootstrapSwitch();
                $('[type="checkbox"]').on('switchChange.bootstrapSwitch', function () {
                    var state = $(this).bootstrapSwitch('state');
                    if (state) {
                        $.ajax({
                            type: 'POST',
                            url: "?module=whatsappnotify&controller=WhatsAppClients&action=saveclient",
                            data: {client: $(this).val(), checked: '1'},
                            dataType: "text",
                            success: function (resultData) {
                                alert("{/literal}{$WALANG.SaveSuccessfully}{literal}");
                            }
                        })
                    } else {
                        $.ajax({
                            type: 'POST',
                            url: "?module=whatsappnotify&controller=WhatsAppClients&action=saveclient",
                            data: {client: $(this).val(), checked: '0'},
                            dataType: "text",
                            success: function (resultData) {
                                alert("{/literal}{$WALANG.SaveSuccessfully}{literal}");
                            }
                        })
                    }
                });
            });
            $(document).on('click', '.paginate_button', function () {
                $('[type="checkbox"]').bootstrapSwitch();
                $('[type="checkbox"]').on('switchChange.bootstrapSwitch', function () {
                    var state = $(this).bootstrapSwitch('state');
                    if (state) {
                        $.ajax({
                            type: 'POST',
                            url: "?module=whatsappnotify&controller=WhatsAppClients&action=saveclient",
                            data: {client: $(this).val(), checked: '1'},
                            dataType: "text",
                            success: function (resultData) {
                                alert("{/literal}{$WALANG.SaveSuccessfully}{literal}");
                            }
                        })
                    } else {
                        $.ajax({
                            type: 'POST',
                            url: "?module=whatsappnotify&controller=WhatsAppClients&action=saveclient",
                            data: {client: $(this).val(), checked: '0'},
                            dataType: "text",
                            success: function (resultData) {
                                alert("{/literal}{$WALANG.SaveSuccessfully}{literal}");
                            }
                        })
                    }
                });
            });
            $('document').ready(function () {
                $('[type="checkbox"]').bootstrapSwitch();
            });

            $('[type="checkbox"]').on('switchChange.bootstrapSwitch', function () {
                var state = $(this).bootstrapSwitch('state');
                if (state) {
                    $.ajax({
                        type: 'POST',
                        url: "?module=whatsappnotify&controller=WhatsAppClients&action=saveclient",
                        data: {client: $(this).val(), checked: '1'},
                        dataType: "text",
                        success: function (resultData) {
                            alert("{/literal}{$WALANG.SaveSuccessfully}{literal}");
                        }
                    })
                } else {
                    $.ajax({
                        type: 'POST',
                        url: "?module=whatsappnotify&controller=WhatsAppClients&action=saveclient",
                        data: {client: $(this).val(), checked: '0'},
                        dataType: "text",
                        success: function (resultData) {
                            alert("{/literal}{$WALANG.SaveSuccessfully}{literal}");
                        }
                    })
                }
            });

            $("#sortable1").on('search.dt', function () {
                setTimeout(function () {
                    $('[type="checkbox"]').bootstrapSwitch('destroy', true);
                    $('[type="checkbox"]').bootstrapSwitch();
                    $('[type="checkbox"]').on('switchChange.bootstrapSwitch', function () {
                        var state = $(this).bootstrapSwitch('state');
                        if (state) {
                            $.ajax({
                                type: 'POST',
                                url: "?module=whatsappnotify&controller=WhatsAppClients&action=saveclient",
                                data: {client: $(this).val(), checked: '1'},
                                dataType: "text",
                                success: function (resultData) {
                                    alert("{/literal}{$WALANG.SaveSuccessfully}{literal}");
                                }
                            })
                        } else {
                            $.ajax({
                                type: 'POST',
                                url: "?module=whatsappnotify&controller=WhatsAppClients&action=saveclient",
                                data: {client: $(this).val(), checked: '0'},
                                dataType: "text",
                                success: function (resultData) {
                                    alert("{/literal}{$WALANG.SaveSuccessfully}{literal}");
                                }
                            })
                        }
                    });
                }, 400);
            });
        });
    </script>
{/literal}