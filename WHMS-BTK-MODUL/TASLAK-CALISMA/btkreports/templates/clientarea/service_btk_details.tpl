{*
    WHMCS BTK Raporlama Modülü - Müşteri Paneli Hizmet BTK Detayları Şablonu
    (clientareaproductdetails.php sayfasına enjekte edilecek)
    modules/addons/btkreports/templates/clientarea/service_btk_details.tpl
*}

{if $btk_service_data_enabled_for_client_area}
    <div class="panel panel-default btk-client-panel top-margin-20">
        <div class="panel-heading">
            <h3 class="panel-title">{$LANG.btkHizmetDetaylariTitleClientArea|default:'Hizmetinize Ait BTK Detayları'}</h3>
        </div>
        <div class="panel-body">
            <p class="text-info"><i class="fas fa-info-circle"></i> {$LANG.btkBilgileriAciklamaClient}</p>
            <hr>
            <div class="row">
                <div class="col-sm-6">
                    <strong>{$LANG.tesisAdresiClient|default:'Hizmet Tesis Adresi:'}</strong>
                    {if $btk_service_data.tesis_adresi_yerlesim_ile_ayni}
                        <p>{$LANG.yerlesimAdresiIleAyniClient|default:'Yerleşim adresiniz ile aynıdır.'}</p>
                    {else}
                        <p>
                            {$btk_service_data.tesis_cadde|escape|nl2br}<br>
                            {if $btk_service_data.tesis_dis_kapi_no} {$LANG.disKapiNoClient}: {$btk_service_data.tesis_dis_kapi_no|escape}{/if}
                            {if $btk_service_data.tesis_ic_kapi_no} {$LANG.icKapiNoClient}: {$btk_service_data.tesis_ic_kapi_no|escape}{/if}<br>
                            {$btk_service_data.tesis_mahalle_adi_placeholder|escape} / {$btk_service_data.tesis_ilce_adi_placeholder|escape} / {$btk_service_data.tesis_il_adi_placeholder|escape}<br>
                            {if $btk_service_data.tesis_posta_kodu} {$btk_service_data.tesis_posta_kodu|escape}{/if}
                        </p>
                    {/if}
                </div>
                <div class="col-sm-6">
                    {if $btk_service_data.statik_ip}
                        <strong>{$LANG.statikIpClient|default:'Statik IP Adresiniz:'}</strong>
                        <p>{$btk_service_data.statik_ip|escape}</p>
                    {/if}

                    {if $btk_service_data.iss_pop_bilgisi}
                        <strong>{$LANG.issPopBilgisiClient|default:'Bağlı Olduğunuz POP Bilgisi:'}</strong>
                        <p>{$btk_service_data.iss_pop_bilgisi|escape}</p>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}