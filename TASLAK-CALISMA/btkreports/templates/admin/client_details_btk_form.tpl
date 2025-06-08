{*
    WHMCS BTK Raporlama Modülü - Müşteri Detayları BTK Bilgi Formu Şablonu
    (clientsprofile.php sayfasına enjekte edilecek)
    modules/addons/btkreports/templates/admin/client_details_btk_form.tpl
*}

{* Bu şablon, bir WHMCS tab'ı içine veya uygun bir bölüme yerleştirilecek *}
{* Örneğin, yeni bir "BTK Bilgileri" sekmesi oluşturulabilir veya mevcut bir sekmeye eklenebilir *}

<h4><i class="fas fa-user-check"></i> {$LANG.btkAboneBilgileriTitle|default:'BTK Abonelik Bilgileri'}</h4>
<hr>

{*
    Bu form, btkreports.php'deki bir AJAX action'ına veya PreAdminProfileTabSave hook'una veri gönderebilir.
    Şimdilik sadece HTML yapısını oluşturuyoruz.
    Mevcut müşteri verileri ($client_btk_data gibi bir Smarty değişkeninden çekilecek)
*}

<div class="row">
    {* SOL SÜTUN - Kimlik Bilgileri *}
    <div class="col-md-6">
        <h5><i class="fas fa-id-card"></i> {$LANG.kimlikBilgileriTitle|default:'Kimlik Bilgileri'}</h5>
        <div class="form-group">
            <label for="btk_abone_tc_kimlik_no">{$LANG.personelTCKN|default:'T.C. Kimlik No'}</label>
            <div class="input-group">
                <input type="text" name="btk_abone_tc_kimlik_no" id="btk_abone_tc_kimlik_no" value="{$client_btk_data.abone_tc_kimlik_no|escape}" class="form-control" maxlength="11">
                <span class="input-group-btn">
                    <button type="button" class="btn btn-default nvi-dogrula-tckn-btn" data-tckn-field="btk_abone_tc_kimlik_no" data-ad-field="btk_abone_adi" data-soyad-field="btk_abone_soyadi" data-dogumyili-field="btk_abone_dogum_yili_for_nvi">{$LANG.nviTcDogrula|default:'Doğrula'}</button>
                </span>
            </div>
            <span class="nvi-result-container help-block"></span>
            <span class="help-block">{$LANG.aboneTcknDesc|default:'11 Haneli T.C. Kimlik Numarası.'}</span>
        </div>

        <div class="form-group">
            <label for="btk_abone_pasaport_no">{$LANG.abonePasaportNo|default:'Pasaport No'}</label>
            <input type="text" name="btk_abone_pasaport_no" id="btk_abone_pasaport_no" value="{$client_btk_data.abone_pasaport_no|escape}" class="form-control">
            <span class="help-block">{$LANG.abonePasaportNoDesc|default:'Yabancı uyruklular için pasaport numarası.'}</span>
        </div>

        {* Diğer kimlik bilgileri (Baba Adı, Anne Adı, Doğum Yeri, Doğum Tarihi vb.) BTK teknik dökümanına göre buraya eklenecek *}
        <div class="form-group">
            <label for="btk_abone_baba_adi">{$LANG.aboneBabaAdi|default:'Baba Adı'}</label>
            <input type="text" name="btk_abone_baba_adi" id="btk_abone_baba_adi" value="{$client_btk_data.abone_baba_adi|escape}" class="form-control">
        </div>
        <div class="form-group">
            <label for="btk_abone_ana_adi">{$LANG.aboneAnaAdi|default:'Anne Adı'}</label>
            <input type="text" name="btk_abone_ana_adi" id="btk_abone_ana_adi" value="{$client_btk_data.abone_ana_adi|escape}" class="form-control">
        </div>
        <div class="form-group">
            <label for="btk_abone_dogum_yeri">{$LANG.aboneDogumYeri|default:'Doğum Yeri'}</label>
            <input type="text" name="btk_abone_dogum_yeri" id="btk_abone_dogum_yeri" value="{$client_btk_data.abone_dogum_yeri|escape}" class="form-control">
        </div>
        <div class="form-group">
            <label for="btk_abone_dogum_tarihi">{$LANG.aboneDogumTarihi|default:'Doğum Tarihi'}</label>
            <input type="text" name="btk_abone_dogum_tarihi" id="btk_abone_dogum_tarihi" value="{$client_btk_data.abone_dogum_tarihi|escape}" class="form-control btk-datepicker-yyyymmdd" placeholder="YYYYMMDD">
             <input type="hidden" id="btk_abone_dogum_yili_for_nvi"> {* NVI doğrulaması için sadece yıl *}
        </div>
         <div class="form-group">
            <label for="btk_abone_cinsiyet">{$LANG.aboneCinsiyet|default:'Cinsiyet'}</label>
            <select name="btk_abone_cinsiyet" id="btk_abone_cinsiyet" class="form-control">
                <option value="">{$LANG.selectOne|default:'Seçiniz...'}</option>
                <option value="E" {if $client_btk_data.abone_cinsiyet == 'E'}selected{/if}>{$LANG.male|default:'Erkek'}</option>
                <option value="K" {if $client_btk_data.abone_cinsiyet == 'K'}selected{/if}>{$LANG.female|default:'Kadın'}</option>
            </select>
        </div>
        {* ... Diğer kimlik alanları ... *}
    </div>

    {* SAĞ SÜTUN - Yerleşim Adresi Bilgileri *}
    <div class="col-md-6">
        <h5><i class="fas fa-map-marker-alt"></i> {$LANG.yerlesimAdresiTitle|default:'Yerleşim (İkamet) Adresi'}</h5>
        <div class="form-group">
            <label for="btk_yerlesim_il_id">{$LANG.popIl|default:'İl'}</label>
            <select name="btk_yerlesim_il_id" id="btk_yerlesim_il_id" class="form-control btk-adres-il-select" data-target-ilce="btk_yerlesim_ilce_id" data-target-mahalle="btk_yerlesim_mahalle_id">
                <option value="">{$LANG.selectOne|default:'Seçiniz...'}</option>
                {foreach from=$adres_iller item=il}
                    <option value="{$il.id}" {if $client_btk_data.yerlesim_il_id == $il.id}selected{/if}>{$il.il_adi|escape}</option>
                {/foreach}
            </select>
        </div>
        <div class="form-group">
            <label for="btk_yerlesim_ilce_id">{$LANG.popIlce|default:'İlçe'}</label>
            <select name="btk_yerlesim_ilce_id" id="btk_yerlesim_ilce_id" class="form-control btk-adres-ilce-select" data-target-mahalle="btk_yerlesim_mahalle_id" disabled>
                <option value="">{$LANG.onceIliSecin|default:'Önce İl Seçiniz'}</option>
                {* AJAX ile doldurulacak. Eğer mevcut veri varsa, o da PHP tarafında hazırlanıp buraya basılabilir. *}
                {if $client_btk_data.yerlesim_ilce_id && $adres_yerlesim_ilceler_list}
                    {foreach from=$adres_yerlesim_ilceler_list item=ilce}
                         <option value="{$ilce.id}" {if $client_btk_data.yerlesim_ilce_id == $ilce.id}selected{/if}>{$ilce.ilce_adi|escape}</option>
                    {/foreach}
                {/if}
            </select>
        </div>
        <div class="form-group">
            <label for="btk_yerlesim_mahalle_id">{$LANG.popMahalle|default:'Mahalle/Köy'}</label>
            <select name="btk_yerlesim_mahalle_id" id="btk_yerlesim_mahalle_id" class="form-control btk-adres-mahalle-select" disabled>
                <option value="">{$LANG.onceIlceyiSecin|default:'Önce İlçe Seçiniz'}</option>
                {* AJAX ile doldurulacak. *}
                 {if $client_btk_data.yerlesim_mahalle_id && $adres_yerlesim_mahalleler_list}
                    {foreach from=$adres_yerlesim_mahalleler_list item=mahalle}
                         <option value="{$mahalle.id}" {if $client_btk_data.yerlesim_mahalle_id == $mahalle.id}selected{/if}>{$mahalle.mahalle_adi|escape}</option>
                    {/foreach}
                {/if}
            </select>
        </div>
        <div class="form-group">
            <label for="btk_yerlesim_cadde">{$LANG.caddeSokakBulvar|default:'Cadde/Sokak/Bulvar'}</label>
            <input type="text" name="btk_yerlesim_cadde" id="btk_yerlesim_cadde" value="{$client_btk_data.yerlesim_cadde|escape}" class="form-control">
        </div>
        <div class="row">
            <div class="col-xs-6">
                <div class="form-group">
                    <label for="btk_yerlesim_dis_kapi_no">{$LANG.disKapiNo|default:'Dış Kapı No'}</label>
                    <input type="text" name="btk_yerlesim_dis_kapi_no" id="btk_yerlesim_dis_kapi_no" value="{$client_btk_data.yerlesim_dis_kapi_no|escape}" class="form-control">
                </div>
            </div>
            <div class="col-xs-6">
                <div class="form-group">
                    <label for="btk_yerlesim_ic_kapi_no">{$LANG.icKapiNo|default:'İç Kapı No'}</label>
                    <input type="text" name="btk_yerlesim_ic_kapi_no" id="btk_yerlesim_ic_kapi_no" value="{$client_btk_data.yerlesim_ic_kapi_no|escape}" class="form-control">
                </div>
            </div>
        </div>
        <div class="row">
             <div class="col-xs-6">
                <div class="form-group">
                    <label for="btk_yerlesim_posta_kodu">{$LANG.postaKodu|default:'Posta Kodu'}</label>
                    <input type="text" name="btk_yerlesim_posta_kodu" id="btk_yerlesim_posta_kodu" value="{$client_btk_data.yerlesim_posta_kodu|escape}" class="form-control" readonly>
                </div>
            </div>
            <div class="col-xs-6">
                <div class="form-group">
                    <label for="btk_yerlesim_adres_kodu_uavt">{$LANG.adresKoduUAVT|default:'Adres Kodu (UAVT)'}</label>
                    <input type="text" name="btk_yerlesim_adres_kodu_uavt" id="btk_yerlesim_adres_kodu_uavt" value="{$client_btk_data.yerlesim_adres_kodu_uavt|escape}" class="form-control">
                     <span class="help-block"><a href="https://adres.nvi.gov.tr/VatandasIslemleri/AdresSorgu" target="_blank">{$LANG.uavtSorgula|default:'UAVT Sorgula'}</a></span>
                </div>
            </div>
        </div>
    </div>
</div>

{* Diğer BTK Alanları: Müşteri Tipi, Meslek, Tarife vb. buraya eklenecek *}
{*
<div class="row top-margin-20">
    <div class="col-md-4">
        <div class="form-group">
            <label for="btk_musteri_tipi">{$LANG.musteriTipi|default:'Müşteri Tipi'}</label>
            <select name="btk_musteri_tipi" id="btk_musteri_tipi" class="form-control">
                <option value="">Seçiniz...</option>
                <option value="G-SAHIS" {if $client_btk_data.musteri_tipi == 'G-SAHIS'}selected{/if}>Bireysel-Şahıs</option>
                ...
            </select>
        </div>
    </div>
    <div class="col-md-4">
        <div class="form-group">
            <label for="btk_abone_meslek">{$LANG.aboneMeslek|default:'Meslek'}</label>
            <select name="btk_abone_meslek" id="btk_abone_meslek" class="form-control">
                <option value="">Seçiniz...</option>
                {foreach from=$meslek_kodlari item=meslek}
                    <option value="{$meslek.kod}" {if $client_btk_data.abone_meslek == $meslek.kod}selected{/if}>{$meslek.kod} - {$meslek.aciklama|escape}</option>
                {/foreach}
            </select>
        </div>
    </div>
</div>
*}

{* Kaydet butonu WHMCS'in kendi "Save Changes" butonu ile entegre olacak veya bu form ayrı bir AJAX ile kaydedilecek *}
{* <button type="submit" class="btn btn-primary">BTK Bilgilerini Kaydet</button> *}

<script type="text/javascript">
// Bu şablona özel JS kodları, btk_admin_scripts.js içinde veya burada tanımlanabilir.
// Özellikle TCKN doğrulama butonu ve dinamik adres dropdown'ları için.
// Örnek:
// $(document).ready(function() {
//     // NVI TCKN Doğrulama Butonu
//     $('.nvi-dogrula-tckn-btn').click(function() {
//         var tckn = $('#' + $(this).data('tckn-field')).val();
//         // ... (btk_admin_scripts.js'deki NVI doğrulama AJAX kodu buraya gelebilir veya oradan çağrılabilir)
//         console.log("TCKN Doğrula: " + tckn);
//     });
// });
</script>