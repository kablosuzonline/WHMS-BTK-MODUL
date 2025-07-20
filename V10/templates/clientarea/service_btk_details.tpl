{*
    WHMCS BTK Raporlama Modülü - Müşteri Paneli Hizmet BTK Bilgileri
    Sürüm: 8.2.0 (Operasyon Merkezi)
    
    Bu şablon, ClientAreaProductDetailsOutput hook'u ile müşteri paneli
    "Ürün/Hizmet Detayları" sayfasına enjekte edilir ve müşteriye hizmetine
    özel BTK bilgilerini gösterir.
*}

{* Sadece BTK verisi varsa veya veri yüklenebildiyse bu bölümü göster *}
{if $btkServiceDetailsData}
    <div class="panel panel-default m-t-20">
        <div class="panel-heading">
            <h3 class="panel-title">{$LANG.btkServiceInformationTitleClientArea}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-6">
                    {if $btkServiceDetailsData.hat_no}
                        <p><strong>{$LANG.serviceHatNoLabelClientArea}:</strong> {$btkServiceDetailsData.hat_no|escape}</p>
                    {/if}
                    {if $btkServiceDetailsData.hizmet_tipi_display}
                        <p><strong>{$LANG.serviceHizmetTipiLabel}:</strong> {$btkServiceDetailsData.hizmet_tipi_display}</p>
                    {/if}
                    {if $btkServiceDetailsData.abone_baslangic_display}
                        <p><strong>{$LANG.serviceAboneBaslangicLabelClientArea}:</strong> {$btkServiceDetailsData.abone_baslangic_display}</p>
                    {/if}
                </div>
                <div class="col-md-6">
                    {if $btkServiceDetailsData.abone_tarife}
                        <p><strong>{$LANG.serviceAboneTarifeLabel}:</strong> {$btkServiceDetailsData.abone_tarife|escape}</p>
                    {/if}
                    {if $btkServiceDetailsData.statik_ip}
                        <p><strong>{$LANG.serviceStatikIpLabel}:</strong> {$btkServiceDetailsData.statik_ip|escape}</p>
                    {/if}
                    
                    {* ISS'e Özel Alanlar *}
                    {if $btkServiceDetailsData.hizmet_tipi_kategori == 'ISS'}
                        {if $btkServiceDetailsData.iss_hiz_profili}
                            <p><strong>{$LANG.issHizProfiliLabel}:</strong> {$btkServiceDetailsData.iss_hiz_profili|escape}</p>
                        {/if}
                        {if $btkServiceDetailsData.iss_kullanici_adi}
                            <p><strong>{$LANG.issKullaniciAdiLabel}:</strong> {$btkServiceDetailsData.iss_kullanici_adi|escape}</p>
                        {/if}
                    {/if}
                </div>
            </div>

            {if $btkServiceDetailsData.tesis_il_id}
            <hr>
            <h5><strong>{$LANG.serviceTesisAdresiTitleClientArea}</strong></h5>
            <address>
                {if $btkServiceDetailsData.tesis_cadde}
                    {$btkServiceDetailsData.tesis_cadde|escape}<br>
                {/if}
                {if $btkServiceDetailsData.tesis_mahalle_adi}
                    {$btkServiceDetailsData.tesis_mahalle_adi|escape}<br>
                {/if}
                {if $btkServiceDetailsData.tesis_dis_kapi_no}
                    {$LANG.adresDisKapiNoLabel}: {$btkServiceDetailsData.tesis_dis_kapi_no|escape}
                {/if}
                {if $btkServiceDetailsData.tesis_ic_kapi_no}
                      {$LANG.adresIcKapiNoLabel}: {$btkServiceDetailsData.tesis_ic_kapi_no|escape}
                {/if}
                <br>
                {$btkServiceDetailsData.tesis_ilce_adi|escape} / {$btkServiceDetailsData.tesis_il_adi|escape}
            </address>
            {else}
            <hr>
            <h5><strong>{$LANG.serviceTesisAdresiTitleClientArea}</strong></h5>
            <p>{$LANG.tesisAdresiYerlesimleAyniClientArea}</p>
            {/if}

            <p class="text-muted" style="margin-top:15px;"><small>{$LANG.btkInfoUpdateContactAdmin}</small></p>
        </div>
    </div>
{/if}