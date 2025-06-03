
$(function () {
    $(".gtelement").hide();
    $("." + $(".gateway").val()).show();
    $("." + $(".sgateway").val()).show();
    $(".gateway").change(function () {
        $(".gtelement").hide(800);
        $("." + $(this).val()).show(1000);
        $("." + $(".sgateway").val()).show(1000);
    });
    $(".sgateway").change(function () {
        $(".gtelement").hide(800);
        $("." + $(this).val()).show(1000);
        $("." + $(".gateway").val()).show(1000);
    });
    $('.mimsms_com_bd select').on('change', function () {
        if ($(this).val() === 'eWHATSAPP') {
            $('.mimsms_com_bd input[name*="password"]').parents('tr').hide();
        } else {
            $('.mimsms_com_bd input[name*="password"]').parents('tr').show();
        }
    });
    if ($('.mimsms_com_bd select').is(':visible')) {
        if ($('.mimsms_com_bd select').val() === 'eWHATSAPP') {
            $('.mimsms_com_bd input[name*="password"]').parents('tr').hide();
        } else {
            $('.mimsms_com_bd input[name*="password"]').parents('tr').show();
        }
    }
});