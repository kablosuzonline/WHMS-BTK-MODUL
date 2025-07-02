{*
    WHMCS BTK Raporlama Modülü - Müşteri Paneli Hizmet BTK Bilgileri
    Dosya: modules/addons/btkreports/templates/clientarea/service_btk_details.tpl
    Sürüm: 6.5
*}

{if $btkServiceDetailsData && $btkServiceDataLoaded}
    <div class="panel panel-default m-t-20"> {* WHMCS 8+ stilinde margin-top *}
        <div class="panel-heading">
            <h3 class="panel-title">{$LANG.btkServiceInformationTitleClientArea}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-6">
                    <p><strong>{$LANG.serviceHatNoLabelClientArea}:</strong> {$btkServiceDetailsData.hat_no|default:$LANG.notAvailable}</p>
                    <p><strong>{$LANG.serviceHizmetTipiLabelClientArea}:</strong> {$btkServiceDetailsData.hizmet_tipi_display|default:$LANG.notAvailable}</p>
                    <p><strong>{$LANG.serviceAboneBaslangicLabelClientArea}:</strong> {$btkServiceDetailsData.abone_baslangic_display|default:$LANG.notAvailable}</p>
                </div>
                <div class="col-md-6">
                    {if $btkServiceDetailsData.abone_tarife}
                        <p><strong>{$LANG.serviceAboneTarifeLabelClientArea}:</strong> {$btkServiceDetailsData.abone_tarife|escape}</p>
                    {/if}
                    {if $btkServiceDetailsData.statik_ip}
                        <p><strong>{$LANG.serviceStatikIpLabelClientArea}:</strong> {$btkServiceDetailsData.statik_ip|escape}</p>
                    {/if}
                    {if $btkServiceDetailsData.hizmet_tipi_kategori == 'ISS'}
                        {if $btkServiceDetailsData.iss_hiz_profili}
                            <p><strong>{$LANG.issHizProfiliLabelClientArea}:</strong> {$btkServiceDetailsData.iss_hiz_profili|escape}</p>
                        {/if}
                        {if $btkServiceDetailsData.iss_kullanici_adi}
                            <p><strong>{$LANG.issKullaniciAdiLabelClientArea}:</strong> {$btkServiceDetailsData.iss_kullanici_adi|escape}</p>
                        {/if}
                        {if $btkServiceDetailsData.iss_pop_bilgisi}
                            <p><strong>{$LANG.issPopBilgisiLabelClientArea}:</strong> {$btkServiceDetailsData.iss_pop_bilgisi|escape}</p>
                        {/if}
                    {elseif $btkServiceDetailsData.hizmet_tipi_kategori == 'AIH'}
                        {if $btkServiceDetailsData.aih_hiz_profil}
                            <p><strong>{$LANG.aihHizProfiliLabelClientArea}:</strong> {$btkServiceDetailsData.aih_hiz_profil|escape}</p>
                        {/if}
                        {if $btkServiceDetailsData.aih_devre_adlandirmasi}
                             <p><strong>{$LANG.aihDevreAdlandirmasiLabelClientArea}:</strong> {$btkServiceDetailsData.aih_devre_adlandirmasi|escape}</p>
                        {/if}
                    {/if}
                </div>
            </div>

            {if $btkServiceDetailsData.tesis_il_id}
            <hr>
            <h5><strong>{$LANG.serviceTesisAdresiTitleClientArea}</strong></h5>
            <p>
                {if $btkServiceDetailsData.tesis_cadde}{$btkServiceDetailsData.tesis_cadde|escape}<br>{/if}
                {if $btkServiceDetailsData.tesis_mahalle_adi}{$btkServiceDetailsData.tesis_mahalle_adi|escape}<br>{/if}
                {if $btkServiceDetailsData.tesis_dis_kapi_no}{$LANG.adresDisKapiNoLabel}: {$btkServiceDetailsData.tesis_dis_kapi_no|escape} {/if}
                {if $btkServiceDetailsData.tesis_ic_kapi_no}{$LANG.adresIcKapiNoLabel}: {$btkServiceDetailsData.tesis_ic_kapi_no|escape}{/if}
                <br>
                {if $btkServiceDetailsData.tesis_posta_kodu}{$btkServiceDetailsData.tesis_posta_kodu|escape} {/if}
                {$btkServiceDetailsData.tesis_ilce_adi|escape} / {$btkServiceDetailsData.tesis_il_adi|escape}
                {if $btkServiceDetailsData.tesis_adres_kodu_uavt}<br>{$LANG.adresKoduLabel}: {$btkServiceDetailsData.tesis_adres_kodu_uavt|escape}{/if}
            </p>
            {else}
                <hr>
                <h5><strong>{$LANG.serviceTesisAdresiTitleClientArea}</strong></h5>
                <p>{$LANG.tesisAdresiYerlesimleAyniClientArea}</p> 
            {/if}
            <p class="text-muted" style="margin-top:15px;"><small>{$LANG.btkInfoUpdateContactAdmin}</small></p>
        </div>
    </div>
{elseif $btkServiceDataLoaded === false && $serviceid}
    {* Bilerek boş bırakıldı, veri yoksa müşteri panelinde gösterilmeyecek. *}
{/if}