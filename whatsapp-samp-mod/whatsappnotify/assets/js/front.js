jQuery(document).ready(function () {
    var phoneInput = jQuery('.wssfield');
    if (phoneInput.length) {
        var countryInput = jQuery('[name^="country"], [name$="country"]'),
                initialCountry = '',
                inputName = phoneInput.attr('name');
        if (countryInput.length && phoneInput.val() === '') {
            initialCountry = countryInput.find('option:selected').val().toLowerCase();
            if (initialCountry === 'um') {
                initialCountry = 'us';
            }
            $(countryInput).on("keyup change", function () {
                $(phoneInput).intlTelInput("setCountry", countryInput.find('option:selected').val());
            });
        }
        phoneInput.intlTelInput({
            preferredCountries: [initialCountry, "us", "gb"].filter(function (value, index, self) {
                return self.indexOf(value) === index;
            }),
            initialCountry: initialCountry,
            autoPlaceholder: 'polite', //always show the helper placeholder
            separateDialCode: true
        });
        var wsformated = false;
        $("form[name=orderfrm]").submit(function (e) {
            wsformated = true;
            if ($(".wssfield").val().split("+").length == 1) {
                var valorOculto = $(".wssfield").intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);
                $(".wssfield").val(valorOculto);
            }

        });
        $("form[role=form]").submit(function (e) {
            if (wsformated === true) {
                return;
            }
            if ($(".wssfield").val().split("+").length == 1) {
                var valorOculto = $(".wssfield").intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);
                $(".wssfield").val(valorOculto);
            }			
        });
    }
});
