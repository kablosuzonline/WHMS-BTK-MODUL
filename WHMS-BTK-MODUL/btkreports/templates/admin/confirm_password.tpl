{*
    WHMCS BTK Raporlama Modülü - Şifre Onay Şablonu
    modules/addons/btkreports/templates/admin/confirm_password.tpl
    Bu şablon, btkreports.php içindeki _output fonksiyonunda hassas bir action'a
    yönlendirmeden önce şifre onayı istendiğinde çağrılır.
*}

{* Modül ana menüsü ve CSS bu sayfada genellikle gösterilmez, daha izole bir onay ekranıdır.
   Ancak istenirse admin_header_menu.tpl buraya da include edilebilir.
   Şimdilik, btkreports_output içinde menü çağrısının bu action için
   atlandığını varsayıyoruz. Eğer menü gösterilecekse, assets_url ve logo_url
   burada da çağrılmalı (btkreports_output'ta zaten atanıyorlar).
*}
<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">

<div class="btk-module-container" style="padding-top: 50px;"> {* Sayfayı biraz ortalamak için *}

    <div class="panel panel-default btk-widget" style="max-width: 550px; margin: 0 auto;">
        <div class="panel-heading">
            <h3 class="panel-title" style="display: flex; align-items: center;">
                <img src="{$logo_url}" alt="{$LANG.btkreports_addon_name|default:'BTK Modülü Logo'}" style="height: 28px; vertical-align: middle; margin-right: 10px;">
                <i class="fas fa-lock" style="margin-right: 8px;"></i> {$LANG.confirmPasswordTitle|default:'İşlem Onayı: Lütfen Şifrenizi Girin'}
            </h3>
        </div>
        <div class="panel-body" style="padding: 25px;">
            {if $errorMessage}
                <div class="alert alert-danger text-center" role="alert">
                    <i class="fas fa-exclamation-triangle"></i> {$errorMessage|nl2br}
                </div>
            {/if}
            {if $infoMessage}
                <div class="alert alert-info text-center" role="alert">
                    <i class="fas fa-info-circle"></i> {$infoMessage|nl2br}
                </div>
            {/if}

            <p class="text-center" style="margin-bottom: 20px;">{$LANG.enterYourPasswordToContinue|default:'Bu önemli işlemi gerçekleştirmek için lütfen WHMCS yönetici şifrenizi tekrar girin:'}</p>
            
            <form method="post" action="{$modulelink}&action=doconfirmpassword" class="form-horizontal">
                <input type="hidden" name="token" value="{$csrfToken}">
                <input type="hidden" name="return_action" value="{$return_action|escape:'html'}">
                {* Gerekirse, return_action için ek parametreler de hidden input olarak eklenebilir *}
                {if $return_params && is_array($return_params)}
                    {foreach $return_params as $param_key => $param_value}
                        <input type="hidden" name="return_params[{$param_key|escape:'html'}]" value="{$param_value|escape:'html'}">
                    {/foreach}
                {/if}

                <div class="form-group">
                    <label class="col-sm-4 control-label">{$LANG.adminUsername|default:'Yönetici Adınız'}:</label>
                    <div class="col-sm-8">
                        <p class="form-control-static" style="padding-top: 7px;"><strong>{$loggedInAdminUsername|escape:'html'|default:'(Bilinmiyor)'}</strong></p>
                    </div>
                </div>

                <div class="form-group">
                    <label for="admin_password_confirm" class="col-sm-4 control-label required">{$LANG.adminPassword|default:'Yönetici Şifreniz'}:</label>
                    <div class="col-sm-8">
                        <input type="password" name="admin_password_confirm" id="admin_password_confirm" class="form-control" autofocus required autocomplete="current-password">
                    </div>
                </div>

                <div class="form-group text-center top-margin-20">
                    <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-check-circle"></i> {$LANG.confirm|default:'Onayla ve Devam Et'}</button>
                    <a href="{$modulelink}&action={$return_action_on_cancel|default:'index'}" class="btn btn-default btn-lg" style="margin-left: 10px;">
                        <i class="fas fa-times"></i> {$LANG.cancelAndReturn|default:'İptal Et ve Geri Dön'}
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>

<script type="text/javascript">
    $(document).ready(function() {
        $('#admin_password_confirm').focus();
    });
</script>