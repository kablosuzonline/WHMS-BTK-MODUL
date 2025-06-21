// --- BÖLÜM 1 / 1 BAŞI - (clientarea/client_btk_details.tpl, Müşteri Paneli BTK Bilgileri Görüntüleme)
{*
    WHMCS BTK Raporlama Modülü - Müşteri Paneli BTK Bilgileri
    Dosya: modules/addons/btkreports/templates/clientarea/client_btk_details.tpl
    Bu şablon, müşteri panelindeki Kişisel Bilgiler sayfasına
    BTK'ya özel (sadece okunur) bilgileri eklemek için kullanılır.
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
                    <p><strong>{$LANG.aboneTcKimlikNoLabel}:</strong> {$btkClientData.abone_tc_kimlik_no|default:$LANG.notAvailable}</p>
                    {if $btkClientData.abone_pasaport_no}
                        <p><strong>{$LANG.abonePasaportNoLabel}:</strong> {$btkClientData.abone_pasaport_no}</p>
                    {/if}
                    {if $btkClientData.abone_unvan}
                        <p><strong>{$LANG.aboneUnvanLabel}:</strong> {$btkClientData.abone_unvan|escape}</p>
                    {/if}
                    {if $btkClientData.abone_vergi_numarasi}
                        <p><strong>{$LANG.aboneVergiNumarasiLabel}:</strong> {$btkClientData.abone_vergi_numarasi|escape}</p>
                    {/if}
                    {if $btkClientData.abone_mersis_numarasi}
                        <p><strong>{$LANG.aboneMersisNumarasiLabel}:</strong> {$btkData.abone_mersis_numarasi|escape}</p>
                    {/if}
                </div>
                <div class="col-md-6">
                    <p><strong>{$LANG.aboneUyrukLabel}:</strong> {$btkClientData.abone_uyruk|default:$LANG.notAvailable}</p>
                    <p><strong>{$LANG.aboneCinsiyetLabel}:</strong> {$btkClientData.abone_cinsiyet_display|default:$LANG.notAvailable}</p>
                    <p><strong>{$LANG.aboneDogumTarihiLabel}:</strong> {$btkClientData.abone_dogum_tarihi_display|default:$LANG.notAvailable}</p>
                    {if $btkClientData.abone_dogum_yeri}
                        <p><strong>{$LANG.aboneDogumYeriLabel}:</strong> {$btkClientData.abone_dogum_yeri|escape}</p>
                    {/if}
                    {if $btkClientData.abone_meslek_display}
                        <p><strong>{$LANG.aboneMeslekLabel}:</strong> {$btkClientData.abone_meslek_display|escape}</p>
                    {/if}
                </div>
            </div>

            {if $btkClientData.abone_adres_yerlesim_il}
            <hr>
            <h5><strong>{$LANG.customerYerlesimAdresiTitleClientArea}</strong></h5>
            <p>
                {if $btkClientData.abone_adres_yerlesim_cadde}{$btkClientData.abone_adres_yerlesim_cadde|escape}<br>{/if}
                {if $btkClientData.abone_adres_yerlesim_mahalle}{$btkClientData.abone_adres_yerlesim_mahalle|escape}<br>{/if}
                {if $btkClientData.abone_adres_yerlesim_dis_kapi_no}Dış Kapı No: {$btkClientData.abone_adres_yerlesim_dis_kapi_no|escape} {/if}
                {if $btkClientData.abone_adres_yerlesim_ic_kapi_no}İç Kapı No: {$btkClientData.abone_adres_yerlesim_ic_kapi_no|escape}{/if}
                <br>
                {if $btkClientData.abone_adres_yerlesim_posta_kodu}{$btkClientData.abone_adres_yerlesim_posta_kodu|escape} {/if}
                {$btkClientData.abone_adres_yerlesim_ilce|escape} / {$btkClientData.abone_adres_yerlesim_il|escape}
                {if $btkClientData.abone_adres_tesis_adres_kodu}<br>{$LANG.adresKoduLabel}: {$btkClientData.abone_adres_tesis_adres_kodu|escape}{/if}
            </p>
            {/if}

            {* Kurumsal Müşteri Yetkili Bilgileri (Müşteri Tipi T-SIRKET veya T-KAMU ise gösterilir) *}
            {if $btkClientData.musteri_tipi == 'T-SIRKET' || $btkClientData.musteri_tipi == 'T-KAMU'}
                {if $btkClientData.kurum_yetkili_adi}
                    <hr>
                    <h5><strong>{$LANG.kurumYetkilisiBilgileriTitleClientArea}</strong></h5>
                    <p>
                        <strong>{$LANG.kurumYetkiliAdiSoyadiLabel}:</strong> {$btkClientData.kurum_yetkili_adi|escape} {$btkClientData.kurum_yetkili_soyadi|escape}<br>
                        {if $btkClientData.kurum_yetkili_tckimlik_no}<strong>{$LANG.kurumYetkiliTcKimlikNoLabel}:</strong> {$btkClientData.kurum_yetkili_tckimlik_no}<br>{/if}
                        {if $btkClientData.kurum_yetkili_telefon}<strong>{$LANG.kurumYetkiliTelefonLabel}:</strong> {$btkClientData.kurum_yetkili_telefon|escape}<br>{/if}
                        {if $btkClientData.kurum_adres}<strong>{$LANG.kurumAdresLabel}:</strong> {$btkClientData.kurum_adres|escape|nl2br}{/if}
                    </p>
                {/if}
            {/if}

            <p class="text-muted" style="margin-top:15px;"><small>{$LANG.btkInfoUpdateContactAdmin}</small></p>

        </div>
    </div>
{elseif $btkClientDataLoaded === false}
    {* Veri yüklenirken bir hata oluştuysa veya veri yoksa *}
    {* <p class="text-warning">{$LANG.btkInfoNotAvailableClientArea}</p> *}
    {* Genellikle bu bölüm hiç gösterilmez eğer $btkClientData yoksa *}
{/if}
// --- BÖLÜM 1 / 1 SONU - (clientarea/client_btk_details.tpl, Müşteri Paneli BTK Bilgileri Görüntüleme)