{*
    WHMCS BTK Raporlama Modülü - Müşteri Paneli BTK Abonelik Bilgileri Şablonu
    modules/addons/btkreports/templates/clientarea/client_btk_details.tpl
    Bu şablon, btkreports.php içindeki 'ClientAreaDetailsOutput' hook'u ile çağrılan
    bir PHP fonksiyonu (örn: BtkHelper::getBtkClientInfoForClientArea) tarafından doldurulur.
*}

{if $btk_client_data_enabled_for_client_area && $btk_client_data}
    {* Müşteri paneli için modülün genel CSS'i yerine daha sade stiller kullanılabilir veya
       WHMCS'in kendi panel stilleri yeterli olabilir. Gerekirse özel bir clientarea CSS dosyası
       ClientAreaHeadOutput hook'u ile eklenebilir.
       <link href="{$WEB_ROOT}/modules/addons/btkreports/assets/css/btk_client_style.css?v={$setting_version_placeholder}" rel="stylesheet">
    *}

    <div class="panel panel-default btk-client-panel" style="margin-top: 20px; margin-bottom:20px;">
        <div class="panel-heading">
            <h3 class="panel-title">
                <i class="fas fa-shield-alt"></i> {$LANG.btkAboneBilgileriTitleClientArea|default:'BTK Abonelik Bilgileriniz'}
            </h3>
        </div>
        <div class="panel-body">
            <p class="text-info small" style="margin-bottom: 15px;">
                <i class="fas fa-info-circle"></i> {$LANG.btkBilgileriAciklamaClient|default:'Aşağıdaki bilgiler yasal yükümlülükler gereği Bilgi Teknolojileri ve İletişim Kurumu\'na (BTK) raporlanmaktadır. Bu bilgilerde bir değişiklik olması veya bir yanlışlık olduğunu düşünüyorsanız, güncelleme talepleriniz için lütfen destek bileti oluşturarak veya müşteri hizmetlerimizle iletişime geçerek bizi bilgilendiriniz.'}
            </p>
            <hr style="margin-top: 0; margin-bottom: 20px;">
            
            <div class="row">
                <div class="col-sm-6">
                    <h4><i class="fas fa-id-card"></i> {$LANG.kimlikBilgileriTitle|default:'Kimlik Bilgileriniz'}</h4>
                    <dl class="dl-horizontal dl-btk-client">
                        {if $btk_client_data.abone_tc_kimlik_no_masked}
                            <dt>{$LANG.aboneTcknClient|default:'T.C. Kimlik No:'}</dt>
                            <dd>{$btk_client_data.abone_tc_kimlik_no_masked|escape:'html'}</dd>
                        {elseif $btk_client_data.abone_pasaport_no}
                             <dt>{$LANG.abonePasaportNoClient|default:'Pasaport No/YKN:'}</dt>
                             <dd>{$btk_client_data.abone_pasaport_no|escape:'html'}</dd>
                        {/if}

                        <dt>{$LANG.aboneAdiSoyadiClient|default:'Adınız Soyadınız:'}</dt>
                        <dd>{$btk_client_data.abone_adi|escape:'html'|default:($LANG.notApplicableShort|default:'N/A')} {$btk_client_data.abone_soyadi|escape:'html'|default:''}</dd>

                        {if $btk_client_data.abone_unvan}
                            <dt>{$LANG.aboneUnvanClient|default:'Firma Ünvanı:'}</dt>
                            <dd>{$btk_client_data.abone_unvan|escape:'html'}</dd>
                        {/if}
                        
                        <dt>{$LANG.musteriTipiClient|default:'Müşteri Tipiniz:'}</dt>
                        <dd>{$btk_client_data.musteri_tipi_aciklama|escape:'html'|default:($LANG.notApplicableShort|default:'N/A')}</dd>
                        
                        {* Diğer gösterilebilecek kimlik bilgileri (gizlilik politikasına uygun olarak) *}
                        {if $btk_client_data.abone_dogum_tarihi_formatted}
                             <dt>{$LANG.aboneDogumTarihiClient|default:'Doğum Tarihiniz:'}</dt>
                             <dd>{$btk_client_data.abone_dogum_tarihi_formatted|escape:'html'}</dd>
                        {/if}
                         {if $btk_client_data.abone_uyruk_aciklama}
                             <dt>{$LANG.aboneUyrukClient|default:'Uyruğunuz:'}</dt>
                             <dd>{$btk_client_data.abone_uyruk_aciklama|escape:'html'}</dd>
                        {/if}

                    </dl>
                </div>
                <div class="col-sm-6">
                    <h4><i class="fas fa-map-marker-alt"></i> {$LANG.yerlesimAdresiClient|default:'Yerleşim (İkamet) Adresiniz'}</h4>
                    {if $btk_client_data.yerlesim_il_adi_placeholder}
                        <address style="margin-bottom: 0;">
                            {if $btk_client_data.yerlesim_cadde}
                                {$btk_client_data.yerlesim_cadde|escape:'html'|nl2br}<br>
                            {/if}
                            {if $btk_client_data.yerlesim_mahalle_adi_placeholder}
                                {$btk_client_data.yerlesim_mahalle_adi_placeholder|escape:'html'}
                            {/if}
                            {if $btk_client_data.yerlesim_dis_kapi_no}
                                <br>{$LANG.disKapiNoClient|default:'D.No'}: {$btk_client_data.yerlesim_dis_kapi_no|escape:'html'}
                            {/if}
                            {if $btk_client_data.yerlesim_ic_kapi_no}
                                 {$LANG.icKapiNoClient|default:'İ.No'}: {$btk_client_data.yerlesim_ic_kapi_no|escape:'html'}
                            {/if}
                            <br>
                            {if $btk_client_data.yerlesim_posta_kodu}
                                {$btk_client_data.yerlesim_posta_kodu|escape:'html'} 
                            {/if}
                            {$btk_client_data.yerlesim_ilce_adi_placeholder|escape:'html'} / {$btk_client_data.yerlesim_il_adi_placeholder|escape:'html'}<br>
                            {if $btk_client_data.yerlesim_adres_kodu_uavt}
                                <small>({$LANG.adresKoduUAVTClient|default:'UAVT Adres Kodu'}: {$btk_client_data.yerlesim_adres_kodu_uavt|escape:'html'})</small>
                            {/if}
                        </address>
                    {else}
                        <p>{$LANG.addressNotAvailableClient|default:'Adres bilgisi bulunmamaktadır.'}</p>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{elseif $btk_client_data_enabled_for_client_area && !$btk_client_data && $is_client_logged_in_placeholder}
    {* Eğer modül ayarlarında "boşsa bile göster" aktifse ve müşteri için BTK verisi yoksa burası gösterilebilir. *}
    {* Veya bu durum tamamen BtkHelper::getBtkClientInfoForClientArea içinde yönetilip boş array döndürülür. *}
    {*
    <div class="panel panel-default btk-client-panel" style="margin-top: 20px; margin-bottom:20px;">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-shield-alt"></i> {$LANG.btkAboneBilgileriTitleClientArea}</h3></div>
        <div class="panel-body">
            <p class="text-warning">{$LANG.btkDataNotAvailableClient|default:'BTK raporlaması için gerekli bazı abonelik bilgileriniz henüz sistemimizde kayıtlı olmayabilir. Güncel bilgileriniz için lütfen bizimle iletişime geçiniz.'}</p>
        </div>
    </div>
    *}
{/if}

{* Müşteri paneli için özel CSS stilleri (eğer gerekirse) *}
<style type="text/css">
    .dl-btk-client dt {
        font-weight: bold;
        width: 160px; /* Etiket genişliği */
        text-align: left;
    }
    .dl-btk-client dd {
        margin-left: 180px; /* Etiket genişliğine göre ayarla */
        margin-bottom: 8px;
    }
    .btk-client-panel .panel-heading .panel-title i {
        margin-right: 6px;
    }
</style>