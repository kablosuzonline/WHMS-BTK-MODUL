{*
    WHMCS BTK Raporlama Modülü - Müşteri Paneli Hizmet BTK Detayları Şablonu
    modules/addons/btkreports/templates/clientarea/service_btk_details.tpl
    Bu şablon, btkreports.php içindeki 'ClientAreaProductDetailsOutput' hook'u ile çağrılan
    bir PHP fonksiyonu (örn: BtkHelper::getBtkServiceInfoForClientArea) tarafından doldurulur.
*}

{if $btk_service_data_enabled_for_client_area && $btk_service_data}
    {* Müşteri paneli için modülün genel CSS'i yerine daha sade stiller kullanılabilir veya
       WHMCS'in kendi panel stilleri yeterli olabilir. Gerekirse özel bir clientarea CSS dosyası
       ClientAreaHeadOutput hook'u ile eklenebilir.
    *}

    <div class="panel panel-default btk-client-panel" style="margin-top: 20px; margin-bottom:20px;">
        <div class="panel-heading">
            <h3 class="panel-title">
                <i class="fas fa-cogs"></i> {$LANG.btkHizmetDetaylariTitleClientArea|default:'Hizmetinize Ait BTK Detayları'}
            </h3>
        </div>
        <div class="panel-body">
            <p class="text-info small" style="margin-bottom: 15px;">
                <i class="fas fa-info-circle"></i> {$LANG.btkBilgileriAciklamaClient|default:'Aşağıdaki bilgiler yasal yükümlülükler gereği Bilgi Teknolojileri ve İletişim Kurumu\'na (BTK) raporlanmaktadır. Bu bilgilerde bir değişiklik olması veya bir yanlışlık olduğunu düşünüyorsanız, güncelleme talepleriniz için lütfen destek bileti oluşturarak veya müşteri hizmetlerimizle iletişime geçerek bizi bilgilendiriniz.'}
            </p>
            <hr style="margin-top: 0; margin-bottom: 20px;">
            
            <div class="row">
                <div class="col-sm-6">
                    <h4><i class="fas fa-map-marked-alt"></i> {$LANG.tesisAdresiClient|default:'Hizmet Tesis Adresi'}</h4>
                    {if isset($btk_service_data.tesis_adresi_yerlesim_ile_ayni) && $btk_service_data.tesis_adresi_yerlesim_ile_ayni == 1}
                        <p>{$LANG.yerlesimAdresiIleAyniClient|default:'Yerleşim adresiniz ile aynıdır.'}</p>
                        {* Yerleşim adresini tekrar göstermek isteyebiliriz (opsiyonel) *}
                        {if $btk_service_data.yerlesim_adresi_full_placeholder}
                            <address style="margin-bottom: 0; font-style: italic; color: #777;">
                                {$btk_service_data.yerlesim_adresi_full_placeholder|escape:'html'|nl2br}
                            </address>
                        {/if}
                    {elseif $btk_service_data.tesis_il_adi_placeholder}
                        <address style="margin-bottom: 0;">
                            {if $btk_service_data.tesis_cadde}
                                {$btk_service_data.tesis_cadde|escape:'html'|nl2br}<br>
                            {/if}
                            {if $btk_service_data.tesis_mahalle_adi_placeholder}
                                {$btk_service_data.tesis_mahalle_adi_placeholder|escape:'html'}
                            {/if}
                            {if $btk_service_data.tesis_dis_kapi_no}
                                <br>{$LANG.disKapiNoClient|default:'D.No'}: {$btk_service_data.tesis_dis_kapi_no|escape:'html'}
                            {/if}
                            {if $btk_service_data.tesis_ic_kapi_no}
                                 {$LANG.icKapiNoClient|default:'İ.No'}: {$btk_service_data.tesis_ic_kapi_no|escape:'html'}
                            {/if}
                            <br>
                            {if $btk_service_data.tesis_posta_kodu}
                                {$btk_service_data.tesis_posta_kodu|escape:'html'} 
                            {/if}
                            {$btk_service_data.tesis_ilce_adi_placeholder|escape:'html'} / {$btk_service_data.tesis_il_adi_placeholder|escape:'html'}<br>
                            {if $btk_service_data.tesis_adres_kodu_uavt}
                                <small>({$LANG.adresKoduUAVTClient|default:'UAVT Adres Kodu'}: {$btk_service_data.tesis_adres_kodu_uavt|escape:'html'})</small>
                            {/if}
                        </address>
                    {else}
                        <p>{$LANG.tesisAddressNotAvailableClient|default:'Bu hizmet için özel bir tesis adresi tanımlanmamıştır veya yerleşim adresiniz kullanılmaktadır.'}</p>
                    {/if}
                </div>

                <div class="col-sm-6">
                    <h4><i class="fas fa-info-circle"></i> {$LANG.otherServiceBtkInfoClient|default:'Diğer BTK Bilgileri'}</h4>
                    <dl class="dl-horizontal dl-btk-client">
                        {if $btk_service_data.hizmet_tipi_aciklama_placeholder}
                            <dt>{$LANG.hizmetTipiClient|default:'Hizmet Türü (BTK):'}</dt>
                            <dd>{$btk_service_data.hizmet_tipi_aciklama_placeholder|escape:'html'}</dd>
                        {/if}

                        {if $btk_service_data.statik_ip}
                            <dt>{$LANG.statikIpClient|default:'Statik IP Adresiniz:'}</dt>
                            <dd>{$btk_service_data.statik_ip|escape:'html'}</dd>
                        {/if}

                        {if $btk_service_data.iss_pop_bilgisi_formatted}
                            <dt>{$LANG.issPopBilgisiClient|default:'Bağlı Olduğunuz POP:'}</dt>
                            <dd>{$btk_service_data.iss_pop_bilgisi_formatted|escape:'html'}</dd>
                        {/if}
                        
                        {if $btk_service_data.abone_tarife}
                            <dt>{$LANG.aboneTarifeClient|default:'Tarifeniz:'}</dt>
                            <dd>{$btk_service_data.abone_tarife|escape:'html'}</dd>
                        {/if}
                        
                        {* Yetki türüne özel diğer alanlar burada gösterilebilir (örn: GSM için ICCI, STH için Santral vb.) *}
                        {* Bu alanlar $btk_service_data dizisi içinde gelmelidir. *}
                        {if $btk_service_data.gsm_icci_placeholder}
                            <dt>{$LANG.gsmIcciClient|default:'SIM Kart No (ICCI):'}</dt>
                            <dd>{$btk_service_data.gsm_icci_placeholder|escape:'html'}</dd>
                        {/if}

                    </dl>
                </div>
            </div>
        </div>
    </div>
{elseif $btk_service_data_enabled_for_client_area && !$btk_service_data && $is_client_logged_in_placeholder}
    {* Eğer modül ayarlarında "boşsa bile göster" aktifse ve hizmet için BTK verisi yoksa burası gösterilebilir. *}
    {*
    <div class="panel panel-default btk-client-panel" style="margin-top: 20px; margin-bottom:20px;">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-cogs"></i> {$LANG.btkHizmetDetaylariTitleClientArea}</h3></div>
        <div class="panel-body">
            <p class="text-warning">{$LANG.btkServiceDataNotAvailableClient|default:'Bu hizmetiniz için BTK raporlamasına özel ek bilgiler bulunmamaktadır.'}</p>
        </div>
    </div>
    *}
{/if}

{* Müşteri paneli için özel CSS stilleri (client_btk_details.tpl ile aynı veya benzer olabilir) *}
{* Bu stiller, ana CSS dosyanıza veya ClientAreaHeadOutput hook'u ile eklenen bir CSS'e taşınabilir. *}
{*
<style type="text/css">
    .dl-btk-client dt { font-weight: bold; width: 180px; text-align: left; }
    .dl-btk-client dd { margin-left: 200px; margin-bottom: 8px; }
    .btk-client-panel .panel-heading .panel-title i { margin-right: 6px; }
</style>
*}