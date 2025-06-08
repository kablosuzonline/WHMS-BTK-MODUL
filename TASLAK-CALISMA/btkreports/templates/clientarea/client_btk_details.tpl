{*
    WHMCS BTK Raporlama Modülü - Müşteri Paneli BTK Abonelik Bilgileri Şablonu
    (clientarea.php?action=details sayfasına enjekte edilecek)
    modules/addons/btkreports/templates/clientarea/client_btk_details.tpl
*}

{if $btk_client_data_enabled_for_client_area}
    <div class="panel panel-default btk-client-panel">
        <div class="panel-heading">
            <h3 class="panel-title">{$LANG.btkAboneBilgileriTitleClientArea|default:'BTK Abonelik Bilgileriniz'}</h3>
        </div>
        <div class="panel-body">
            <p class="text-info"><i class="fas fa-info-circle"></i> {$LANG.btkBilgileriAciklamaClient|default:'Bu bilgiler yasal yükümlülükler gereği BTK\'ya raporlanmaktadır. Değişiklik talepleriniz için lütfen bizimle iletişime geçin.'}</p>
            <hr>
            <div class="row">
                <div class="col-sm-6">
                    <strong>{$LANG.aboneTcknClient|default:'T.C. Kimlik No / YKN:'}</strong>
                    <p>{$btk_client_data.abone_tc_kimlik_no_masked|default:$LANG.notApplicableShort}</p>

                    <strong>{$LANG.aboneAdiSoyadiClient|default:'Adınız Soyadınız:'}</strong>
                    <p>{$btk_client_data.abone_adi|escape} {$btk_client_data.abone_soyadi|escape}</p>

                    {if $btk_client_data.abone_unvan}
                        <strong>{$LANG.aboneUnvanClient|default:'Firma Ünvanı:'}</strong>
                        <p>{$btk_client_data.abone_unvan|escape}</p>
                    {/if}
                </div>
                <div class="col-sm-6">
                    <strong>{$LANG.yerlesimAdresiClient|default:'Yerleşim (İkamet) Adresiniz:'}</strong>
                    <p>
                        {$btk_client_data.yerlesim_cadde|escape|nl2br}<br>
                        {if $btk_client_data.yerlesim_dis_kapi_no} {$LANG.disKapiNoClient|default:'D.No'}: {$btk_client_data.yerlesim_dis_kapi_no|escape}{/if}
                        {if $btk_client_data.yerlesim_ic_kapi_no} {$LANG.icKapiNoClient|default:'İ.No'}: {$btk_client_data.yerlesim_ic_kapi_no|escape}{/if}<br>
                        {$btk_client_data.yerlesim_mahalle_adi_placeholder|escape} / {$btk_client_data.yerlesim_ilce_adi_placeholder|escape} / {$btk_client_data.yerlesim_il_adi_placeholder|escape}<br>
                        {if $btk_client_data.yerlesim_posta_kodu} {$btk_client_data.yerlesim_posta_kodu|escape}{/if}
                    </p>
                </div>
            </div>
        </div>
    </div>
{/if}