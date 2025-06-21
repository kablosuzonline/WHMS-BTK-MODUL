// --- BÖLÜM 1 / 1 BAŞI - (clientarea/service_btk_details.tpl, Müşteri Paneli Hizmet BTK Bilgileri Görüntüleme)
{*
    WHMCS BTK Raporlama Modülü - Müşteri Paneli Hizmet BTK Bilgileri
    Dosya: modules/addons/btkreports/templates/clientarea/service_btk_details.tpl
    Bu şablon, müşteri panelindeki hizmet detayları sayfasına
    BTK'ya özel (sadece okunur) hizmet bilgilerini eklemek için kullanılır.
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
                    {* Hizmet tipine göre gösterilecek ISS veya AIH'e özel alanlar buraya eklenebilir *}
                    {if $btkServiceDetailsData.hizmet_tipi_kategori == 'ISS'} {* PHP tarafında belirlenecek bir kategori *}
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
                         {* AIH'e özel alanlar *}
                        {if $btkServiceDetailsData.aih_hiz_profil}
                            <p><strong>{$LANG.aihHizProfiliLabelClientArea}:</strong> {$btkServiceDetailsData.aih_hiz_profil|escape}</p>
                        {/if}
                        {if $btkServiceDetailsData.aih_devre_adlandirmasi}
                             <p><strong>{$LANG.aihDevreAdlandirmasiLabelClientArea}:</strong> {$btkServiceDetailsData.aih_devre_adlandirmasi|escape}</p>
                        {/if}
                    {/if}
                </div>
            </div>

            {if $btkServiceDetailsData.abone_adres_tesis_il}
            <hr>
            <h5><strong>{$LANG.serviceTesisAdresiTitleClientArea}</strong></h5>
            <p>
                {if $btkServiceDetailsData.abone_adres_tesis_cadde}{$btkServiceDetailsData.abone_adres_tesis_cadde|escape}<br>{/if}
                {if $btkServiceDetailsData.abone_adres_tesis_mahalle}{$btkServiceDetailsData.abone_adres_tesis_mahalle|escape}<br>{/if}
                {if $btkServiceDetailsData.abone_adres_tesis_dis_kapi_no}{$LANG.adresDisKapiNoLabel}: {$btkServiceDetailsData.abone_adres_tesis_dis_kapi_no|escape} {/if}
                {if $btkServiceDetailsData.abone_adres_tesis_ic_kapi_no}{$LANG.adresIcKapiNoLabel}: {$btkServiceDetailsData.abone_adres_tesis_ic_kapi_no|escape}{/if}
                <br>
                {if $btkServiceDetailsData.abone_adres_tesis_posta_kodu}{$btkServiceDetailsData.abone_adres_tesis_posta_kodu|escape} {/if}
                {$btkServiceDetailsData.abone_adres_tesis_ilce|escape} / {$btkServiceDetailsData.abone_adres_tesis_il|escape}
                {if $btkServiceDetailsData.abone_adres_tesis_adres_kodu}<br>{$LANG.adresKoduLabel}: {$btkServiceDetailsData.abone_adres_tesis_adres_kodu|escape}{/if}
            </p>
            {else}
                <hr>
                <h5><strong>{$LANG.serviceTesisAdresiTitleClientArea}</strong></h5>
                <p>{$LANG.tesisAdresiYerlesimleAyniClientArea}</p> {* Veya "Tesis adresi müşteri yerleşim adresi ile aynıdır." *}
            {/if}
            <p class="text-muted" style="margin-top:15px;"><small>{$LANG.btkInfoUpdateContactAdmin}</small></p>
        </div>
    </div>
{elseif $btkServiceDataLoaded === false && $serviceid} {* $serviceid varsa ve veri yüklenemediyse *}
    {* <p class="text-warning">{$LANG.btkServiceInfoNotAvailableClientArea}</p> *}
{/if}
// --- BÖLÜM 1 / 1 SONU - (clientarea/service_btk_details.tpl, Müşteri Paneli Hizmet BTK Bilgileri Görüntüleme)