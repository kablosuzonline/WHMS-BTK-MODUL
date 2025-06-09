{*
    WHMCS BTK Raporlama Modülü - Müşteri Detayları BTK Bilgi Formu Şablonu
    (clientsprofile.php sayfasına enjekte edilecek - genellikle bir sekme içinde)
    modules/addons/btkreports/templates/admin/client_details_btk_form.tpl
*}

{* Bu şablon, btkreports.php'deki (varsa) ClientDetailsAdminAreaOutput hook'u veya benzeri bir
   mekanizma ile çağrıldığında $client_btk_data, $adres_iller, $adres_yerlesim_ilceler_list,
   $adres_yerlesim_mahalleler_list, $meslek_kodlari, $kimlik_tipleri_referans gibi
   Smarty değişkenlerinin dolu olmasını bekler.
   Formun kaydedilmesi, WHMCS'in ana müşteri kaydetme formuyla birlikte PreClientEdit hook'u
   veya ayrı bir AJAX action'ı ile yönetilecektir. Alan adları buna göre düzenlenmelidir.
   Şimdilik, alan adlarını btk_client_[alan_adi] şeklinde bırakıyorum.
*}

<div id="btkClientDetailsFormContainer" class="btk-client-form-section">

    <h4 class="btk-form-section-title"><i class="fas fa-user-tag"></i> {$LANG.btkAboneBilgileriTitle|default:'BTK Abonelik Bilgileri'}</h4>
    <hr class="btk-hr">
    <p class="text-info small"><i class="fas fa-info-circle"></i> {$LANG.btkClientFormDesc|default:'Müşterinin BTK raporlaması için gerekli olan kimlik ve yerleşim adresi bilgilerini buradan giriniz/güncelleyiniz.'}</p>

    {* Müşteri Tipi, Meslek, Tarife gibi genel BTK alanları *}
    <div class="row">
        <div class="col-md-4 form-group">
            <label for="btk_client_musteri_tipi">{$LANG.musteriTipi|default:'Müşteri Tipi'}</label>
            <i class="fas fa-info-circle btk-tooltip" title="{$LANG.musteriTipiDesc|escape:'html'|default:'Abonenin BTK raporlarındaki sınıflandırması (G-SAHIS, T-SIRKET vb.)'}"></i>
            <select name="btk_client_musteri_tipi" id="btk_client_musteri_tipi" class="form-control">
                <option value="">{$LANG.selectOne|escape:'html'}</option>
                <option value="G-SAHIS" {if $client_btk_data.musteri_tipi == 'G-SAHIS'}selected{/if}>{$LANG.musteriTipiGSahis|default:'Bireysel-Şahıs'}</option>
                <option value="G-SIRKET" {if $client_btk_data.musteri_tipi == 'G-SIRKET'}selected{/if}>{$LANG.musteriTipiGSirket|default:'Bireysel-Şirket (Şahıs Şirketi)'}</option>
                <option value="T-SIRKET" {if $client_btk_data.musteri_tipi == 'T-SIRKET'}selected{/if}>{$LANG.musteriTipiTSirket|default:'Tüzel-Şirket (Ltd, A.Ş. vb.)'}</option>
                <option value="T-KAMU" {if $client_btk_data.musteri_tipi == 'T-KAMU'}selected{/if}>{$LANG.musteriTipiTKamu|default:'Tüzel-Kamu Kurumu'}</option>
            </select>
        </div>
        <div class="col-md-4 form-group">
            <label for="btk_client_abone_meslek">{$LANG.aboneMeslek|default:'Meslek'}</label>
            <i class="fas fa-info-circle btk-tooltip" title="{$LANG.aboneMeslekDesc|escape:'html'|default:'Abonenin BTK EK-5\'e göre meslek kodu.'}"></i>
            <select name="btk_client_abone_meslek" id="btk_client_abone_meslek" class="form-control select2-enable"> {* Select2 için class eklendi *}
                <option value="">{$LANG.selectOne|escape:'html'}</option>
                {if $meslek_kodlari_referans}
                    {foreach from=$meslek_kodlari_referans item=meslek}
                        <option value="{$meslek.kod|escape:'html'}" {if $client_btk_data.abone_meslek == $meslek.kod}selected{/if}>{$meslek.kod|escape:'html'} - {$meslek.aciklama|escape:'html'}</option>
                    {/foreach}
                {/if}
            </select>
        </div>
        <div class="col-md-4 form-group">
            <label for="btk_client_abone_tarife">{$LANG.aboneTarife|default:'Abone Tarife Adı'}</label>
            <i class="fas fa-info-circle btk-tooltip" title="{$LANG.aboneTarifeDesc|escape:'html'|default:'Abonenin kullandığı tarifenin adı (BTK formatına uygun).'}"></i>
            <input type="text" name="btk_client_abone_tarife" id="btk_client_abone_tarife" value="{$client_btk_data.abone_tarife|escape:'html'}" class="form-control">
        </div>
    </div>
    <hr class="btk-hr-light">

    {* Kimlik Bilgileri *}
    <h5 class="btk-form-subsection-title"><i class="fas fa-id-card"></i> {$LANG.kimlikBilgileriTitle|default:'Kimlik Bilgileri'}</h5>
    <div class="row">
        <div class="col-md-4 form-group">
            <label for="btk_client_abone_tc_kimlik_no">{$LANG.personelTCKN|default:'T.C. Kimlik No'}</label>
            <div class="input-group">
                <input type="text" name="btk_client_abone_tc_kimlik_no" id="btk_client_abone_tc_kimlik_no" value="{$client_btk_data.abone_tc_kimlik_no|escape:'html'}" class="form-control" maxlength="11">
                <span class="input-group-btn">
                    <button type="button" class="btn btn-default nvi-dogrula-tckn-btn" 
                            data-tckn-field="#btk_client_abone_tc_kimlik_no" 
                            data-ad-field="#btk_client_abone_adi" 
                            data-soyad-field="#btk_client_abone_soyadi" 
                            data-dogumyili-field="#btk_client_dogum_yili_for_nvi"
                            data-result-container="#nviResultClientTCKN">
                        {$LANG.nviTcDogrula|default:'Doğrula'}
                    </button>
                </span>
            </div>
            <span id="nviResultClientTCKN" class="help-block nvi-result-container"></span>
        </div>
        <div class="col-md-4 form-group">
            <label for="btk_client_abone_pasaport_no">{$LANG.abonePasaportNo|default:'Pasaport No / YKN'}</label>
             <i class="fas fa-info-circle btk-tooltip" title="{$LANG.abonePasaportNoDescClient|escape:'html'|default:'Yabancı uyruklular için Pasaport Numarası veya (99 ile başlayan) Yabancı Kimlik Numarası.'}"></i>
            <input type="text" name="btk_client_abone_pasaport_no" id="btk_client_abone_pasaport_no" value="{$client_btk_data.abone_pasaport_no|escape:'html'}" class="form-control">
        </div>
        <div class="col-md-4 form-group">
            <label for="btk_client_abone_kimlik_tipi">{$LANG.aboneKimlikTipi|default:'Kimlik Tipi'}</label>
            <select name="btk_client_abone_kimlik_tipi" id="btk_client_abone_kimlik_tipi" class="form-control">
                <option value="">{$LANG.selectOne|escape:'html'}</option>
                {if $kimlik_tipleri_referans}
                    {foreach from=$kimlik_tipleri_referans item=kt}
                        <option value="{$kt.kod|escape:'html'}" {if $client_btk_data.abone_kimlik_tipi == $kt.kod}selected{/if}>{$kt.aciklama|escape:'html'} ({$kt.kod|escape:'html'})</option>
                    {/foreach}
                {/if}
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-4 form-group">
            <label for="btk_client_abone_adi">{$LANG.aboneAdi|default:'Adı'}</label>
            <input type="text" name="btk_client_abone_adi" id="btk_client_abone_adi" value="{$client_btk_data.abone_adi|escape:'html'}" class="form-control">
        </div>
        <div class="col-md-4 form-group">
            <label for="btk_client_abone_soyadi">{$LANG.aboneSoyadi|default:'Soyadı'}</label>
            <input type="text" name="btk_client_abone_soyadi" id="btk_client_abone_soyadi" value="{$client_btk_data.abone_soyadi|escape:'html'}" class="form-control">
        </div>
        <div class="col-md-4 form-group">
            <label for="btk_client_abone_dogum_tarihi">{$LANG.aboneDogumTarihi|default:'Doğum Tarihi'}</label>
            <input type="text" name="btk_client_abone_dogum_tarihi" id="btk_client_abone_dogum_tarihi" value="{$client_btk_data.abone_dogum_tarihi|escape:'html'}" class="form-control btk-datepicker-yyyymmdd" placeholder="YYYYMMDD">
            <input type="hidden" id="btk_client_dogum_yili_for_nvi" value="{if $client_btk_data.abone_dogum_tarihi}{$client_btk_data.abone_dogum_tarihi|substr:0:4}{/if}">
        </div>
    </div>
     <div class="row">
        <div class="col-md-4 form-group">
            <label for="btk_client_abone_baba_adi">{$LANG.aboneBabaAdi|default:'Baba Adı'}</label>
            <input type="text" name="btk_client_abone_baba_adi" id="btk_client_abone_baba_adi" value="{$client_btk_data.abone_baba_adi|escape:'html'}" class="form-control">
        </div>
        <div class="col-md-4 form-group">
            <label for="btk_client_abone_ana_adi">{$LANG.aboneAnaAdi|default:'Anne Adı'}</label>
            <input type="text" name="btk_client_abone_ana_adi" id="btk_client_abone_ana_adi" value="{$client_btk_data.abone_ana_adi|escape:'html'}" class="form-control">
        </div>
         <div class="col-md-4 form-group">
            <label for="btk_client_abone_cinsiyet">{$LANG.aboneCinsiyet|default:'Cinsiyet'}</label>
            <select name="btk_client_abone_cinsiyet" id="btk_client_abone_cinsiyet" class="form-control">
                <option value="">{$LANG.selectOne|escape:'html'}</option>
                <option value="E" {if $client_btk_data.abone_cinsiyet == 'E'}selected{/if}>{$LANG.male|default:'Erkek'}</option>
                <option value="K" {if $client_btk_data.abone_cinsiyet == 'K'}selected{/if}>{$LANG.female|default:'Kadın'}</option>
            </select>
        </div>
    </div>
    {* ... Diğer kimlik alanları (Kimlik Seri No, Verildiği Yer/Tarih, Uyruk vb.) BTK dokümanına göre eklenecek ... *}
    <hr class="btk-hr-light">

    {* Yerleşim Adresi Bilgileri *}
    <h5 class="btk-form-subsection-title"><i class="fas fa-map-marker-alt"></i> {$LANG.yerlesimAdresiTitle|default:'Yerleşim (İkamet) Adresi'}</h5>
    <div class="row">
        <div class="col-md-4 form-group">
            <label for="btk_client_yerlesim_il_id">{$LANG.popIl}</label>
            <select name="btk_client_yerlesim_il_id" id="btk_client_yerlesim_il_id" class="form-control btk-adres-il-select" data-target-ilce="btk_client_yerlesim_ilce_id" data-target-mahalle="btk_client_yerlesim_mahalle_id">
                <option value="">{$LANG.selectOne|escape:'html'}</option>
                {if $adres_iller}
                    {foreach from=$adres_iller item=il}
                        <option value="{$il.id}" {if $client_btk_data.yerlesim_il_id == $il.id}selected{/if}>{$il.il_adi|escape:'html'}</option>
                    {/foreach}
                {/if}
            </select>
        </div>
        <div class="col-md-4 form-group">
            <label for="btk_client_yerlesim_ilce_id">{$LANG.popIlce}</label>
            <select name="btk_client_yerlesim_ilce_id" id="btk_client_yerlesim_ilce_id" class="form-control btk-adres-ilce-select" data-target-mahalle="btk_client_yerlesim_mahalle_id" {if !$client_btk_data.yerlesim_il_id}disabled{/if}>
                <option value="">{$LANG.onceIliSecin|escape:'html'}</option>
                {if $client_btk_data.yerlesim_il_id && $adres_yerlesim_ilceler_list}
                    {foreach from=$adres_yerlesim_ilceler_list item=ilce}
                         <option value="{$ilce.id}" {if $client_btk_data.yerlesim_ilce_id == $ilce.id}selected{/if}>{$ilce.ilce_adi|escape:'html'}</option>
                    {/foreach}
                {/if}
            </select>
        </div>
        <div class="col-md-4 form-group">
            <label for="btk_client_yerlesim_mahalle_id">{$LANG.popMahalle}</label>
            <select name="btk_client_yerlesim_mahalle_id" id="btk_client_yerlesim_mahalle_id" class="form-control btk-adres-mahalle-select" data-target-postakodu="btk_client_yerlesim_posta_kodu" {if !$client_btk_data.yerlesim_ilce_id}disabled{/if}>
                <option value="">{$LANG.onceIlceyiSecin|escape:'html'}</option>
                 {if $client_btk_data.yerlesim_ilce_id && $adres_yerlesim_mahalleler_list}
                    {foreach from=$adres_yerlesim_mahalleler_list item=mahalle}
                         <option value="{$mahalle.id}" data-postakodu="{$mahalle.posta_kodu|escape:'html'}" {if $client_btk_data.yerlesim_mahalle_id == $mahalle.id}selected{/if}>{$mahalle.mahalle_adi|escape:'html'}</option>
                    {/foreach}
                {/if}
            </select>
        </div>
    </div>
    <div class="form-group">
        <label for="btk_client_yerlesim_cadde">{$LANG.caddeSokakBulvar|default:'Cadde/Sokak/Bulvar/Meydan'}</label>
        <input type="text" name="btk_client_yerlesim_cadde" id="btk_client_yerlesim_cadde" value="{$client_btk_data.yerlesim_cadde|escape:'html'}" class="form-control">
    </div>
    <div class="row">
        <div class="col-sm-3 form-group"><label for="btk_client_yerlesim_dis_kapi_no">{$LANG.disKapiNo}</label><input type="text" name="btk_client_yerlesim_dis_kapi_no" id="btk_client_yerlesim_dis_kapi_no" value="{$client_btk_data.yerlesim_dis_kapi_no|escape:'html'}" class="form-control"></div>
        <div class="col-sm-3 form-group"><label for="btk_client_yerlesim_ic_kapi_no">{$LANG.icKapiNo}</label><input type="text" name="btk_client_yerlesim_ic_kapi_no" id="btk_client_yerlesim_ic_kapi_no" value="{$client_btk_data.yerlesim_ic_kapi_no|escape:'html'}" class="form-control"></div>
        <div class="col-sm-3 form-group"><label for="btk_client_yerlesim_posta_kodu">{$LANG.postaKodu}</label><input type="text" name="btk_client_yerlesim_posta_kodu" id="btk_client_yerlesim_posta_kodu" value="{$client_btk_data.yerlesim_posta_kodu|escape:'html'}" class="form-control" readonly></div>
        <div class="col-sm-3 form-group"><label for="btk_client_yerlesim_adres_kodu_uavt">{$LANG.adresKoduUAVT}</label><input type="text" name="btk_client_yerlesim_adres_kodu_uavt" id="btk_client_yerlesim_adres_kodu_uavt" value="{$client_btk_data.yerlesim_adres_kodu_uavt|escape:'html'}" class="form-control"><span class="help-block"><a href="https://adres.nvi.gov.tr/VatandasIslemleri/AdresSorgu" target="_blank">{$LANG.uavtSorgula}</a></span></div>
    </div>
    <hr class="btk-hr-light">

    {* Tesis Koordinatları (Google Maps - Saha Ekibi İçin) *}
    <h5 class="btk-form-subsection-title"><i class="fas fa-map-pin"></i> {$LANG.tesisKoordinatTitle|default:'Tesis Koordinat Bilgileri'} ({$LANG.teknikEkipIcin|default:'Saha Ekibi İçin'})</h5>
    <div class="row">
        <div class="col-md-6 form-group">
            <label for="btk_client_tesis_koordinat_enlem">{$LANG.tesisKoordinatEnlem|default:'Tesis Koordinat Enlem'}</label>
            <input type="text" name="btk_client_tesis_koordinat_enlem" id="btk_client_tesis_koordinat_enlem" value="{$client_btk_data.tesis_koordinat_enlem|escape:'html'}" class="form-control" placeholder="Örn: 41.008238">
        </div>
        <div class="col-md-6 form-group">
            <label for="btk_client_tesis_koordinat_boylam">{$LANG.tesisKoordinatBoylam|default:'Tesis Koordinat Boylam'}</label>
            <input type="text" name="btk_client_tesis_koordinat_boylam" id="btk_client_tesis_koordinat_boylam" value="{$client_btk_data.tesis_koordinat_boylam|escape:'html'}" class="form-control" placeholder="Örn: 28.978359">
        </div>
    </div>
     <span class="help-block">{$LANG.koordinatHelpText|default:'Bu koordinatlar, müşterinin ana yerleşim adresi veya en sık hizmet aldığı birincil tesis adresi için girilmelidir. Google Maps üzerinde gösterilecektir.'}</span>

    {* Formun kaydedilmesi WHMCS'in kendi mekanizmasıyla olacağı için ayrı bir kaydet butonu burada gerekmeyebilir.
       Eğer bu alanlar ayrı bir AJAX isteğiyle kaydedilecekse buton eklenebilir.
       Şimdilik WHMCS'in ana "Değişiklikleri Kaydet" butonunun bu alanları da alacağını varsayıyoruz
       ve PreClientEdit hook'unda bu `btk_client_` prefixli alanları yakalayıp işleyeceğiz.
    *}
    <input type="hidden" name="btk_client_update_trigger" value="1"> {* Hook'un bu formu işlemesi için bir işaretçi *}
</div>

{* Bu şablona özel JS (btk_admin_scripts.js'ye taşınabilir) *}
<script type="text/javascript">
// $(document).ready(function() {
//     // Dinamik adres dropdown'ları ve NVI doğrulama için JS kodları
//     // btk_admin_scripts.js içinde genel fonksiyonlar olarak tanımlanıp buradan çağrılabilir.
//     // Örneğin: initializeBtkAddressDropdowns('#btk_client_yerlesim_il_id', '#btk_client_yerlesim_ilce_id', '#btk_client_yerlesim_mahalle_id', '#btk_client_yerlesim_posta_kodu');
//     //          initializeNviTcknButton('.nvi-dogrula-tckn-btn', '#btk_client_abone_tc_kimlik_no', ...);
// });
</script>