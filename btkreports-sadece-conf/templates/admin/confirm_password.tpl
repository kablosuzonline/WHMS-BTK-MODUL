{* WHMCS BTK Raporlama Modülü - Şifre Onay Formu (confirm_password.tpl) - V3.0.0 - Tam Sürüm *}

{if $errormessage}
    <div class="alert alert-danger text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-times-circle"></i> {$errormessage}
    </div>
{/if}
{if $successmessage} {* Genellikle bu sayfada success olmaz ama her ihtimale karşı *}
    <div class="alert alert-success text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-check-circle"></i> {$successmessage}
    </div>
{/if}

<div class="panel panel-default" style="margin-top: 20px; max-width: 600px; margin-left: auto; margin-right: auto;">
    <div class="panel-heading">
        <h3 class="panel-title" style="margin-bottom: 0; font-size: 16px; font-weight:bold;"><i class="fas fa-lock"></i> {$_LANG.btk_confirm_password_title|default:"Şifre Onayı"}</h3>
    </div>
    <div class="panel-body">
        <p>{$_LANG.btk_password_confirmation_required|default:"Bu bölüme güvenli erişim için lütfen WHMCS admin şifrenizi tekrar girin."}</p>
        <form method="post" action="{$modulelink}&action={$original_action_btk}{if $original_params_btk_query_string}&{$original_params_btk_query_string}{/if}" class="form-horizontal">
            {* CSRF token WHMCS tarafından otomatik olarak formlara eklenir (eğer $csrfToken smarty'ye atanmışsa ve formda kullanılıyorsa)
               WHMCS 7.2+ için $smarty.session.tkval kullanılabilir veya generate_token('plain') ile gelen $csrfToken.
               btkreports.php'de $csrfToken = generate_token('plain'); ataması yapıldığı için $csrfToken kullanılabilir.
            *}
            <input type="hidden" name="token" value="{$csrfToken}">
            <input type="hidden" name="confirmadminpassword_btk" value="1">
            <input type="hidden" name="original_action_btk" value="{$original_action_btk}">
            
            {* original_params_btk, URL-encoded JSON string olarak geliyordu ve btkreports.php'de
               original_params_btk_query_string olarak http_build_query ile oluşturuluyordu.
               Bu TPL'de direkt action URL'ine eklendiği için ayrıca hidden input'a gerek kalmayabilir,
               ancak her ihtimale karşı TPL'in action URL'ini kontrol edelim.
               Eğer action URL'i GET parametrelerini içermiyorsa, aşağıdaki gibi eklenebilir:
            *}
            {if $original_params_btk_array && $original_params_btk_array|@count > 0}
                {foreach from=$original_params_btk_array key=param_key item=param_val}
                    {if $param_key != 'action' && $param_key != 'module' && $param_key != 'token'}
                        <input type="hidden" name="{$param_key}" value="{$param_val}">
                    {/if}
                {/foreach}
            {/if}


            <div class="form-group row">
                <label for="adminpassword_btk" class="col-sm-4 control-label text-md-right">{$LANG.adminpassword}</label>
                <div class="col-sm-8">
                    <input type="password" name="adminpassword_btk" id="adminpassword_btk" class="form-control" autofocus required>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-8 col-sm-offset-4">
                    <button type="submit" class="btn btn-primary">{$LANG.submit}</button>
                    <a href="index.php" class="btn btn-default" style="margin-left: 10px;">{$LANG.cancel}</a>
                </div>
            </div>
        </form>
    </div>
</div>