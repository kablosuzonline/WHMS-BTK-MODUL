{*
    WHMCS BTK Raporlama Modülü - Müşteri Paneli BTK Bilgileri
    Sürüm: 13.0.1 (Mimari Sürüm)
*}

{if $btkClientData}
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">{$LANG.btkInformationTitleClientArea}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-6">
                    {if $btkClientData.musteri_tipi_display}
                        <p><strong>{$LANG.musteriTipiLabel}:</strong> {$btkClientData.musteri_tipi_display}</p>
                    {/if}
                    {if $btkClientData.abone_tc_kimlik_no}
                        <p><strong>TC Kimlik No:</strong> {$btkClientData.abone_tc_kimlik_no|substr:0:2}*******{$btkClientData.abone_tc_kimlik_no|substr:-2}</p>
                    {/if}
                    {if $btkClientData.abone_pasaport_no}
                        <p><strong>Pasaport No:</strong> {$btkClientData.abone_pasaport_no|substr:0:3}*****{$btkClientData.abone_pasaport_no|substr:-2}</p>
                    {/if}
                    {if $btkClientData.abone_unvan}
                        <p><strong>Ünvan:</strong> {$btkClientData.abone_unvan|escape}</p>
                    {/if}
                </div>
                <div class="col-md-6">
                    {if $btkClientData.abone_uyruk}
                        <p><strong>Uyruk:</strong> {$btkClientData.abone_uyruk|escape}</p>
                    {/if}
                    {if $btkClientData.abone_cinsiyet_display}
                        <p><strong>Cinsiyet:</strong> {$btkClientData.abone_cinsiyet_display}</p>
                    {/if}
                    {if $btkClientData.abone_dogum_tarihi_display}
                        <p><strong>Doğum Tarihi:</strong> {$btkClientData.abone_dogum_tarihi_display}</p>
                    {/if}
                    {if $btkClientData.abone_dogum_yeri}
                        <p><strong>Doğum Yeri:</strong> {$btkClientData.abone_dogum_yeri|escape}</p>
                    {/if}
                </div>
            </div>

            {if $btkClientData.yerlesim_il_id}
            <hr>
            <h5><strong>{$LANG.customerYerlesimAdresiTitleClientArea}</strong></h5>
            <address>
                {if $btkClientData.yerlesim_cadde}
                    {$btkClientData.yerlesim_cadde|escape}<br>
                {/if}
                {if $btkClientData.yerlesim_mahalle_adi} 
                    {$btkClientData.yerlesim_mahalle_adi|escape}<br>
                {/if}
                {if $btkClientData.yerlesim_dis_kapi_no}
                    {$LANG.adresDisKapiNoLabel}: {$btkClientData.yerlesim_dis_kapi_no|escape}
                {/if}
                {if $btkClientData.yerlesim_ic_kapi_no}
                      {$LANG.adresIcKapiNoLabel}: {$btkClientData.yerlesim_ic_kapi_no|escape}
                {/if}
                <br>
                {$btkClientData.yerlesim_ilce_adi|escape} / {$btkClientData.yerlesim_il_adi|escape}
            </address>
            {/if}

            <p class="text-muted" style="margin-top:15px;"><small>{$LANG.btkInfoUpdateContactAdmin}</small></p>

        </div>
    </div>
{/if}