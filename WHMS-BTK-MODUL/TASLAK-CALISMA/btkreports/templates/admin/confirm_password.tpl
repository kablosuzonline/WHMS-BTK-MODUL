{*
    WHMCS BTK Raporlama Modülü - Şifre Onay Şablonu
    modules/addons/btkreports/templates/admin/confirm_password.tpl
*}

<div class="btk-admin-page-header">
    <div class="btk-page-title">
        <img src="modules/addons/btkreports/logo.png" alt="BTK Modül Logo" style="height: 32px; vertical-align: middle; margin-right: 10px;">
        {$LANG.confirmPasswordTitle|default:'İşlem Onayı'}
    </div>
</div>

{if $errorMessage}
    <div class="alert alert-danger">
        <i class="fas fa-exclamation-triangle"></i> {$errorMessage}
    </div>
{/if}

<div class="panel panel-default btk-widget" style="max-width: 500px; margin: 20px auto;">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-lock"></i> {$LANG.enterYourPasswordToContinue|default:'Devam etmek için lütfen WHMCS admin şifrenizi girin:'}</h3>
    </div>
    <div class="panel-body">
        <form method="post" action="{$modulelink}&action=doconfirmpassword">
            <input type="hidden" name="return_action" value="{$return_action|escape}">
            {* Diğer gerekli parametreler de hidden input olarak eklenebilir *}

            <div class="form-group">
                <label for="admin_password">{$LANG.adminPassword|default:'Admin Şifreniz'}</label>
                <input type="password" name="admin_password" id="admin_password" class="form-control" autofocus>
            </div>

            <div class="text-center">
                <button type="submit" class="btn btn-primary"><i class="fas fa-check"></i> {$LANG.confirm|default:'Onayla'}</button>
                <a href="{$modulelink}&action={$return_action|default:'index'}" class="btn btn-default">{$LANG.cancel}</a>
            </div>
        </form>
    </div>
</div>