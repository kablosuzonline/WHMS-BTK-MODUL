{*
    WHMCS BTK Raporlama Modülü - Müşteri Paneli BTK Bilgileri
    Dosya: modules/addons/btkreports/templates/clientarea/client_btk_details.tpl
    Sürüm: 6.5
*}

{if $btkClientData && $btkClientDataLoaded}
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">{$LANG.btkInformationTitleClientArea}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-6">
                    <p><strong>{$LANG.musteriTipiLabel}:</strong> {$btkClientData.musteri_tipi_display|default:$LANG.notAvailable}</p>
                    <p><strong>TC Kimlik No:</strong> {$abone_tc_kimlik_no_masked}</p>
                    {if $abone_pasaport_no_masked != ($LANG.notProvidedOrApplicable|default:'N/A')}
                        <p><strong>Pasaport No:</strong> {$abone_pasaport_no_masked}</p>
                    {/if}
                    {if $btkClientData.abone_unvan}
                        <p><strong>Ünvan:</strong> {$btkClientData.abone_unvan|escape}</p>
                    {/if}
                    {if $btkClientData.abone_vergi_numarasi}
                        <p><strong>Vergi Numarası:</strong> {$btkClientData.abone_vergi_numarasi|escape}</p>
                    {/if}
                </div>
                <div class="col-md-6">
                    <p><strong>Uyruk:</strong> {$btkClientData.abone_uyruk|default:$LANG.notAvailable}</p>
                    <p><strong>Cinsiyet:</strong> {$btkClientData.abone_cinsiyet_display|default:$LANG.notAvailable}</p>
                    <p><strong>Doğum Tarihi:</strong> {$btkClientData.abone_dogum_tarihi_display|default:$LANG.notAvailable}</p>
                    {if $btkClientData.abone_dogum_yeri}
                        <p><strong>Doğum Yeri:</strong> {$btkClientData.abone_dogum_yeri|escape}</p>
                    {/if}
                </div>
            </div>

            {if $btkClientData.yerlesim_il_id}
            <hr>
            <h5><strong>{$LANG.customerYerlesimAdresiTitleClientArea}</strong></h5>
            <p>
                {$btkClientData.yerlesim_cadde|escape}<br>
                {if $btkClientData.yerlesim_mahalle_adi} {$btkClientData.yerlesim_mahalle_adi|escape}<br>{/if}
                {if $btkClientData.yerlesim_dis_kapi_no}{$LANG.adresDisKapiNoLabel}: {$btkClientData.yerlesim_dis_kapi_no|escape} {/if}
                {if $btkClientData.yerlesim_ic_kapi_no}{$LANG.adresIcKapiNoLabel}: {$btkClientData.yerlesim_ic_kapi_no|escape}{/if}
                <br>
                {if $btkClientData.yerlesim_posta_kodu}{$btkClientData.yerlesim_posta_kodu|escape} {/if}
                {$btkClientData.yerlesim_ilce_adi|escape} / {$btkClientData.yerlesim_il_adi|escape}
                {if $btkClientData.yerlesim_adres_kodu_uavt}<br>{$LANG.adresKoduLabel}: {$btkClientData.yerlesim_adres_kodu_uavt|escape}{/if}
            </p>
            {/if}

            <p class="text-muted" style="margin-top:15px;"><small>{$LANG.btkInfoUpdateContactAdmin}</small></p>

        </div>
    </div>
{elseif $btkClientDataLoaded === false}
    {* Bilerek boş bırakıldı, veri yoksa müşteri panelinde gösterilmeyecek. *}
{/if}