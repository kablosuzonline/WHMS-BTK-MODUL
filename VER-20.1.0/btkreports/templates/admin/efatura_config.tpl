{*
    WHMCS BTK Raporlama Modülü - E-Fatura Ayarları Şablonu
    Sürüm: 20.0.0 (Operasyon PHOENIX)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version}" rel="stylesheet">

<div id="btk-efatura-config-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>Bu bölümden, BİMSA eDoksis E-Fatura/E-Arşiv entegratörü ile iletişim kurmak için gerekli olan tüm ayarları ve yasal firma bilgilerinizi yönetebilirsiniz.</p>

<form method="post" action="{$modulelink}&action=save_efatura_config" id="btkEFaturaConfigForm" class="form-horizontal">
    <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">

    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title">
                 <i class="fas fa-cogs"></i> Genel E-Fatura Ayarları
                <div class="pull-right">
                    <span class="mode-label {if $settings.edoksis_mode != 'canli'}mode-active{/if}">{$LANG.mode_test}</span>
                    <label class="btk-switch" for="edoksis_mode">
                        <input type="checkbox" name="edoksis_mode" id="edoksis_mode" {if $settings.edoksis_mode == 'canli'}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    <span class="mode-label {if $settings.edoksis_mode == 'canli'}mode-active{/if}">{$LANG.mode_canli}</span>
                </div>
            </h3>
        </div>
        <div class="panel-body">
            <div class="form-group">
                <label for="edoksis_auto_create" class="col-sm-3 control-label">Otomatik Fatura Oluşturma</label>
                <div class="col-sm-8" style="padding-top: 5px;">
                    <label class="btk-switch" for="edoksis_auto_create">
                        <input type="checkbox" name="edoksis_auto_create" id="edoksis_auto_create" value="1" {if $settings.edoksis_auto_create == '1'}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    <span class="help-block" style="display: inline-block; margin-left: 10px;">Aktif edildiğinde, WHMCS faturası "Ödendi" olarak işaretlendiği anda yasal E-Fatura/E-Arşiv otomatik olarak oluşturulur.</span>
                </div>
            </div>
        </div>
    </div>

    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-key"></i> BİMSA eDoksis API Bilgileri</h3></div>
        <div class="panel-body">
            <div class="form-group"><label for="edoksis_user" class="col-sm-3 control-label required">Kullanıcı Adı</label><div class="col-sm-8"><input type="text" name="edoksis_user" id="edoksis_user" value="{$settings.edoksis_user|escape}" class="form-control" required></div></div>
            <div class="form-group"><label for="edoksis_pass" class="col-sm-3 control-label required">Şifre</label><div class="col-sm-8"><input type="password" name="edoksis_pass" id="edoksis_pass" value="********" class="form-control" autocomplete="new-password" placeholder="{$LANG.ftpPassPlaceholder|escape}" required></div></div>
        </div>
    </div>

    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-building"></i> Yasal Firma Bilgileri</h3></div>
        <div class="panel-body">
            <p class="help-block" style="margin-bottom: 20px;">Bu bilgiler, E-Fatura ve E-Arşiv dökümanlarının "Gönderici" kısmında yer alacak olan resmi firma bilgilerinizdir.</p>
            <div class="form-group"><label for="edoksis_company_name" class="col-sm-3 control-label required">Firma Ticari Ünvanı</label><div class="col-sm-8"><input type="text" name="edoksis_company_name" id="edoksis_company_name" value="{$settings.edoksis_company_name|escape}" class="form-control" required></div></div>
            <div class="form-group"><label for="edoksis_tax_office" class="col-sm-3 control-label">Vergi Dairesi</label><div class="col-sm-8"><input type="text" name="edoksis_tax_office" id="edoksis_tax_office" value="{$settings.edoksis_tax_office|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="edoksis_tax_id" class="col-sm-3 control-label required">Vergi Kimlik Numarası</label><div class="col-sm-8"><input type="text" name="edoksis_tax_id" id="edoksis_tax_id" value="{$settings.edoksis_tax_id|escape}" class="form-control" required maxlength="10"></div></div>
            <div class="form-group"><label for="edoksis_mersis" class="col-sm-3 control-label">Mersis Numarası</label><div class="col-sm-8"><input type="text" name="edoksis_mersis" id="edoksis_mersis" value="{$settings.edoksis_mersis|escape}" class="form-control" maxlength="16"></div></div>
            <div class="form-group"><label for="edoksis_website" class="col-sm-3 control-label">Web Sitesi</label><div class="col-sm-8"><input type="text" name="edoksis_website" id="edoksis_website" value="{$settings.edoksis_website|escape}" class="form-control" placeholder="https://www.example.com"></div></div>
            <div class="form-group"><label for="edoksis_phone" class="col-sm-3 control-label">Telefon</label><div class="col-sm-8"><input type="text" name="edoksis_phone" id="edoksis_phone" value="{$settings.edoksis_phone|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="edoksis_fax" class="col-sm-3 control-label">Faks</label><div class="col-sm-8"><input type="text" name="edoksis_fax" id="edoksis_fax" value="{$settings.edoksis_fax|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="edoksis_email" class="col-sm-3 control-label">E-posta</label><div class="col-sm-8"><input type="email" name="edoksis_email" id="edoksis_email" value="{$settings.edoksis_email|escape}" class="form-control"></div></div>
            <hr>
            <div class="form-group"><label for="edoksis_street" class="col-sm-3 control-label">Cadde/Sokak</label><div class="col-sm-8"><input type="text" name="edoksis_street" id="edoksis_street" value="{$settings.edoksis_street|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="edoksis_building_name" class="col-sm-3 control-label">Bina Adı</label><div class="col-sm-8"><input type="text" name="edoksis_building_name" id="edoksis_building_name" value="{$settings.edoksis_building_name|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="edoksis_building_number" class="col-sm-3 control-label">Bina No</label><div class="col-sm-4"><input type="text" name="edoksis_building_number" id="edoksis_building_number" value="{$settings.edoksis_building_number|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="edoksis_door_number" class="col-sm-3 control-label">Kapı No</label><div class="col-sm-4"><input type="text" name="edoksis_door_number" id="edoksis_door_number" value="{$settings.edoksis_door_number|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="edoksis_town" class="col-sm-3 control-label">İlçe</label><div class="col-sm-8"><input type="text" name="edoksis_town" id="edoksis_town" value="{$settings.edoksis_town|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="edoksis_city" class="col-sm-3 control-label">Şehir</label><div class="col-sm-8"><input type="text" name="edoksis_city" id="edoksis_city" value="{$settings.edoksis_city|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="edoksis_zipcode" class="col-sm-3 control-label">Posta Kodu</label><div class="col-sm-4"><input type="text" name="edoksis_zipcode" id="edoksis_zipcode" value="{$settings.edoksis_zipcode|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="edoksis_country" class="col-sm-3 control-label">Ülke</label><div class="col-sm-8"><input type="text" name="edoksis_country" id="edoksis_country" value="{$settings.edoksis_country|default:'Türkiye'|escape}" class="form-control"></div></div>
        </div>
    </div>
    
    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-barcode"></i> Fatura Serisi</h3></div>
        <div class="panel-body">
             <div class="form-group"><label for="edoksis_invoice_prefix" class="col-sm-3 control-label required">Fatura Numarası Ön Eki</label><div class="col-sm-4"><input type="text" name="edoksis_invoice_prefix" id="edoksis_invoice_prefix" value="{$settings.edoksis_invoice_prefix|escape}" class="form-control" required maxlength="3"><span class="help-block">3 karakterli seri kodu (Örn: IZM)</span></div></div>
        </div>
    </div>

    <div class="text-center" style="margin-top: 30px; margin-bottom: 30px;">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$LANG.saveChanges}</button>
    </div>
</form>

<script type="text/javascript">
$(document).ready(function() {
    $('#btkEFaturaConfigForm input[type="password"]').each(function() {
        var $this = $(this);
        $this.focus(function() { if ($(this).val() === '********') { $(this).val(''); } })
          .blur(function() { if ($(this).val() === '') { $(this).val('********'); } });
    });
});
</script>