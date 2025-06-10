{*
    WHMCS BTK Raporlama Modülü - Müşteri Detayları BTK Bilgi Formu Şablonu
    (Admin panelindeki clientsprofile.php sayfasına enjekte edilecek - genellikle bir sekme içinde)
    modules/addons/btkreports/templates/admin/client_details_btk_form.tpl
*}

{* Bu şablon, AdminAreaClientSummaryPageOutput hook'u veya benzeri bir mekanizma ile
   müşteri profili sayfasındaki bir sekme içine (örn: "BTK Bilgileri") yerleştirilecek.
   Formun kendisi, ana müşteri profili formuyla birlikte submit edilebilir veya
   bu BTK alanları için ayrı bir AJAX kaydetme mekanizması (PreAdminProfileTabSave hook'u ile)
   kullanılabilir. Alan adları 'btk_...' prefix'i ile başlayacak.
*}

<div class="panel panel-default btk-widget" style="margin-top:15px;" id="btkClientDetailsFormContainer">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-user-check"></i> {$LANG.btkAboneBilgileriTitle|default:'BTK Abonelik Bilgileri'}</h3>
    </div>
    <div class="panel-body">
        <p class="text-info small"><i class="fas fa-info-circle"></i> {$LANG.btkClientFormDesc|default:'Bu alandaki bilgiler, müşterinin BTK\'ya raporlanacak ana abonelik verileridir. Lütfen eksiksiz ve doğru giriniz. Değişiklikler ana "Değişiklikleri Kaydet" butonu ile veya bu bölüme özel bir kaydet butonu (ileride eklenebilir) ile kaydedilecektir.'}</p>
        <hr>

        {* Bu form alanlarının name attribute'ları, ClientEdit veya PreAdminProfileTabSave hook'larında
           $_POST ile yakalanacak ve BtkHelper::saveClientBtkDetails() gibi bir fonksiyona gönderilecek.
           $client_btk_data Smarty değişkeni, btkreports.php'de BtkHelper aracılığıyla
           mod_btk_abone_rehber tablosundan (veya ilgili diğer tablolardan) çekilen mevcut BTK verilerini içerecektir.
        *}

        <div class="row">
            {* SOL SÜTUN - Kimlik Bilgileri *}
            <div class="col-md-6">
                <h4><i class="fas fa-id-card"></i> {$LANG.kimlikBilgileriTitle|default:'Kimlik Bilgileri'}</h4>
                
                <div class="form-group">
                    <label for="btk_abone_tc_kimlik_no">{$LANG.personelTCKN|default:'T.C. Kimlik No'}</label>
                    <i class="fas fa-info-circle btk-tooltip" title="{$LANG.aboneTcknDesc|escape:'html'|default:'Bireysel aboneler için 11 haneli T.C. Kimlik Numarası. Yabancı uyruklular için bu alan boş bırakılıp Pasaport No/YKN doldurulabilir veya 99 ile başlayan YKN girilebilir.'}"></i>
                    <div class="input-group">
                        <input type="text" name="btk_abone_tc_kimlik_no" id="btk_abone_tc_kimlik_no" value="{$client_btk_data.abone_tc_kimlik_no|escape:'html'}" class="form-control" maxlength="11" pattern="[0-9]{11}">
                        <span class="input-group-btn">
                            <button type="button" class="btn btn-default nvi-dogrula-tckn-btn" 
                                    data-tckn-field-id="btk_abone_tc_kimlik_no" 
                                    data-ad-field-id="btk_abone_adi_form_client" 
                                    data-soyad-field-id="btk_abone_soyadi_form_client" 
                                    data-dogumyili-field-id="btk_abone_dogum_yili_nvi_form_client"
                                    data-result-container-id="nviResultClientDetailsPage">
                                {$LANG.nviTcDogrula|default:'Doğrula'}
                            </button>
                        </span>
                    </div>
                    <span id="nviResultClientDetailsPage" class="help-block nvi-result-container"></span>
                </div>

                <div class="form-group">
                    <label for="btk_abone_pasaport_no">{$LANG.abonePasaportNo|default:'Pasaport No / YKN'}</label>
                    <i class="fas fa-info-circle btk-tooltip" title="{$LANG.abonePasaportNoDesc|escape:'html'|default:'Yabancı uyruklular için Pasaport Numarası veya 99 ile başlayan 11 haneli Yabancı Kimlik Numarası.'}"></i>
                    <input type="text" name="btk_abone_pasaport_no" id="btk_abone_pasaport_no" value="{$client_btk_data.abone_pasaport_no|escape:'html'}" class="form-control">
                     {* YKN doğrulaması için ayrı bir buton eklenebilir. *}
                </div>

                <div class="form-group">
                    <label for="btk_abone_adi_form_client">{$LANG.personelAdi|default:'Adı'}</label>
                    <input type="text" name="btk_abone_adi" id="btk_abone_adi_form_client" value="{$client_btk_data.abone_adi|escape:'html'}" class="form-control">
                </div>
                <div class="form-group">
                    <label for="btk_abone_soyadi_form_client">{$LANG.personelSoyadi|default:'Soyadı'}</label>
                    <input type="text" name="btk_abone_soyadi" id="btk_abone_soyadi_form_client" value="{$client_btk_data.abone_soyadi|escape:'html'}" class="form-control">
                </div>
                
                <div class="form-group">
                    <label for="btk_abone_dogum_yili_nvi_form_client">{$LANG.dogumYiliNvi|default:'Doğum Yılı (NVI için)'}</label>
                     <i class="fas fa-info-circle btk-tooltip" title="{$LANG.dogumYiliNviClientDesc|escape:'html'|default:'TCKN/YKN doğrulaması için gereklidir. 4 haneli yıl olarak giriniz.'}"></i>
                    <input type="number" name="btk_abone_dogum_yili_nvi" id="btk_abone_dogum_yili_nvi_form_client" value="{$client_btk_data.abone_dogum_yili_nvi|escape:'html'}" class="form-control" min="1900" max="{$smarty.now|date_format:'%Y'-10}" placeholder="YYYY">
                </div>

                <div class="form-group">
                    <label for="btk_abone_baba_adi">{$LANG.aboneBabaAdi|default:'Baba Adı'}</label>
                    <input type="text" name="btk_abone_baba_adi" id="btk_abone_baba_adi" value="{$client_btk_data.abone_baba_adi|escape:'html'}" class="form-control">
                </div>
                <div class="form-group">
                    <label for="btk_abone_ana_adi">{$LANG.aboneAnaAdi|default:'Anne Adı'}</label>
                    <input type="text" name="btk_abone_ana_adi" id="btk_abone_ana_adi" value="{$client_btk_data.abone_ana_adi|escape:'html'}" class="form-control">
                </div>
                 <div class="form-group">
                    <label for="btk_abone_anne_kizlik_soyadi">{$LANG.aboneAnneKizlikSoyadi|default:'Anne Kızlık Soyadı'}</label>
                    <input type="text" name="btk_abone_anne_kizlik_soyadi" id="btk_abone_anne_kizlik_soyadi" value="{$client_btk_data.abone_anne_kizlik_soyadi|escape:'html'}" class="form-control">
                </div>
                <div class="form-group">
                    <label for="btk_abone_dogum_yeri">{$LANG.aboneDogumYeri|default:'Doğum Yeri'}</label>
                    <input type="text" name="btk_abone_dogum_yeri" id="btk_abone_dogum_yeri" value="{$client_btk_data.abone_dogum_yeri|escape:'html'}" class="form-control">
                </div>
                <div class="form-group">
                    <label for="btk_abone_dogum_tarihi_form_client">{$LANG.aboneDogumTarihi|default:'Doğum Tarihi (YYYYMMDD)'}</label>
                    <input type="text" name="btk_abone_dogum_tarihi" id="btk_abone_dogum_tarihi_form_client" value="{$client_btk_data.abone_dogum_tarihi|escape:'html'}" class="form-control btk-datepicker-yyyymmdd" placeholder="YYYYMMDD">
                </div>
                <div class="form-group">
                    <label for="btk_abone_cinsiyet">{$LANG.aboneCinsiyet|default:'Cinsiyet'}</label>
                    <select name="btk_abone_cinsiyet" id="btk_abone_cinsiyet" class="form-control">
                        <option value="">{$LANG.selectOne|default:'Seçiniz...'}</option>
                        <option value="E" {if $client_btk_data.abone_cinsiyet == 'E'}selected{/if}>{$LANG.male|default:'Erkek'}</option>
                        <option value="K" {if $client_btk_data.abone_cinsiyet == 'K'}selected{/if}>{$LANG.female|default:'Kadın'}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="btk_abone_uyruk">{$LANG.aboneUyruk|default:'Uyruk'}</label>
                     <i class="fas fa-info-circle btk-tooltip" title="{$LANG.aboneUyrukDesc|escape:'html'|default:'ICAO 9303 standardına uygun 3 harfli ülke kodu (Örn: TUR, DEU, USA).'}"></i>
                    <input type="text" name="btk_abone_uyruk" id="btk_abone_uyruk" value="{$client_btk_data.abone_uyruk|default:'TUR'|escape:'html'}" class="form-control" maxlength="3" style="text-transform:uppercase;">
                </div>
                 <div class="form-group">
                    <label for="btk_abone_kimlik_tipi">{$LANG.aboneKimlikTipi|default:'Kimlik Tipi'}</label>
                    <select name="btk_abone_kimlik_tipi" id="btk_abone_kimlik_tipi" class="form-control">
                        <option value="">{$LANG.selectOne|default:'Seçiniz...'}</option>
                        {if $ek4_kimlik_tipleri_placeholder}
                            {foreach from=$ek4_kimlik_tipleri_placeholder item=kt}
                                <option value="{$kt.kod|escape:'html'}" {if $client_btk_data.abone_kimlik_tipi == $kt.kod}selected{/if}>{$kt.aciklama|escape:'html'} ({$kt.kod|escape:'html'})</option>
                            {/foreach}
                        {else}
                             <option value="TCNC" {if $client_btk_data.abone_kimlik_tipi == 'TCNC'}selected{/if}>TC Nüfus Cüzdanı (TCNC)</option>
                             <option value="TCKK" {if $client_btk_data.abone_kimlik_tipi == 'TCKK'}selected{/if}>TC Çipli Kimlik Kartı (TCKK)</option>
                             <option value="YP" {if $client_btk_data.abone_kimlik_tipi == 'YP'}selected{/if}>Yabancı Pasaport (YP)</option>
                        {/if}
                    </select>
                </div>
                {* Diğer Kimlik Alanları (Cilt No, Kütük No, Sayfa No, Kimlik İl/İlçe/Mahalle, Seri No, Verildiği Yer/Tarih, Aidiyet) BTK dökümanına göre eklenecek *}
            </div>

            {* SAĞ SÜTUN - Yerleşim Adresi Bilgileri *}
            <div class="col-md-6">
                <h4><i class="fas fa-map-marker-alt"></i> {$LANG.yerlesimAdresiTitle|default:'Yerleşim (İkamet) Adresi'}</h4>
                <div class="form-group">
                    <label for="btk_yerlesim_il_id">{$LANG.popIl}</label>
                    <select name="btk_yerlesim_il_id" id="btk_yerlesim_il_id_client" class="form-control btk-adres-il-select" data-target-ilce="btk_yerlesim_ilce_id_client" data-target-mahalle="btk_yerlesim_mahalle_id_client" data-target-postakodu="btk_yerlesim_posta_kodu_client">
                        <option value="">{$LANG.selectOne}</option>
                        {if $adres_iller}
                            {foreach from=$adres_iller item=il}
                                <option value="{$il.id}" {if $client_btk_data.yerlesim_il_id == $il.id}selected{/if}>{$il.il_adi|escape:'html'}</option>
                            {/foreach}
                        {/if}
                    </select>
                </div>
                <div class="form-group">
                    <label for="btk_yerlesim_ilce_id_client">{$LANG.popIlce}</label>
                    <select name="btk_yerlesim_ilce_id" id="btk_yerlesim_ilce_id_client" class="form-control btk-adres-ilce-select" data-target-mahalle="btk_yerlesim_mahalle_id_client" data-target-postakodu="btk_yerlesim_posta_kodu_client" {if !$client_btk_data.yerlesim_il_id}disabled{/if}>
                        <option value="">{$LANG.onceIliSecin}</option>
                        {if $client_btk_data.yerlesim_il_id && $adres_yerlesim_ilceler_list}
                            {foreach from=$adres_yerlesim_ilceler_list item=ilce}
                                 <option value="{$ilce.id}" {if $client_btk_data.yerlesim_ilce_id == $ilce.id}selected{/if}>{$ilce.ilce_adi|escape:'html'}</option>
                            {/foreach}
                        {/if}
                    </select>
                </div>
                <div class="form-group">
                    <label for="btk_yerlesim_mahalle_id_client">{$LANG.popMahalle}</label>
                    <select name="btk_yerlesim_mahalle_id" id="btk_yerlesim_mahalle_id_client" class="form-control btk-adres-mahalle-select" data-target-postakodu="btk_yerlesim_posta_kodu_client" {if !$client_btk_data.yerlesim_ilce_id}disabled{/if}>
                        <option value="">{$LANG.onceIlceyiSecin}</option>
                         {if $client_btk_data.yerlesim_ilce_id && $adres_yerlesim_mahalleler_list}
                            {foreach from=$adres_yerlesim_mahalleler_list item=mahalle}
                                 <option value="{$mahalle.id}" data-postakodu="{$mahalle.posta_kodu|escape:'html'}" {if $client_btk_data.yerlesim_mahalle_id == $mahalle.id}selected{/if}>{$mahalle.mahalle_adi|escape:'html'}</option>
                            {/foreach}
                        {/if}
                    </select>
                </div>
                <div class="form-group">
                    <label for="btk_yerlesim_cadde">{$LANG.caddeSokakBulvar}</label>
                    <input type="text" name="btk_yerlesim_cadde" id="btk_yerlesim_cadde" value="{$client_btk_data.yerlesim_cadde|escape:'html'}" class="form-control">
                </div>
                <div class="row">
                    <div class="col-xs-6 form-group">
                        <label for="btk_yerlesim_dis_kapi_no">{$LANG.disKapiNo}</label>
                        <input type="text" name="btk_yerlesim_dis_kapi_no" id="btk_yerlesim_dis_kapi_no" value="{$client_btk_data.yerlesim_dis_kapi_no|escape:'html'}" class="form-control">
                    </div>
                    <div class="col-xs-6 form-group">
                        <label for="btk_yerlesim_ic_kapi_no">{$LANG.icKapiNo}</label>
                        <input type="text" name="btk_yerlesim_ic_kapi_no" id="btk_yerlesim_ic_kapi_no" value="{$client_btk_data.yerlesim_ic_kapi_no|escape:'html'}" class="form-control">
                    </div>
                </div>
                 <div class="row">
                    <div class="col-xs-6 form-group">
                        <label for="btk_yerlesim_posta_kodu_client">{$LANG.postaKodu}</label>
                        <input type="text" name="btk_yerlesim_posta_kodu" id="btk_yerlesim_posta_kodu_client" value="{$client_btk_data.yerlesim_posta_kodu|escape:'html'}" class="form-control" readonly>
                        <span class="help-block">{$LANG.mahalleSecinceOto|default:'Mahalle seçildiğinde otomatik dolar.'}</span>
                    </div>
                    <div class="col-xs-6 form-group">
                        <label for="btk_yerlesim_adres_kodu_uavt">{$LANG.adresKoduUAVT}</label>
                        <input type="text" name="btk_yerlesim_adres_kodu_uavt" id="btk_yerlesim_adres_kodu_uavt" value="{$client_btk_data.yerlesim_adres_kodu_uavt|escape:'html'}" class="form-control">
                         <span class="help-block"><a href="https://adres.nvi.gov.tr/VatandasIslemleri/AdresSorgu" target="_blank" rel="noopener noreferrer">{$LANG.uavtSorgula|default:'UAVT Adres Kodu Sorgula'}</a></span>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-4 form-group">
                <label for="btk_musteri_tipi">{$LANG.musteriTipi|default:'Müşteri Tipi'}</label>
                <select name="btk_musteri_tipi" id="btk_musteri_tipi_client" class="form-control">
                    <option value="">{$LANG.selectOne}</option>
                    <option value="G-SAHIS" {if $client_btk_data.musteri_tipi == 'G-SAHIS'}selected{/if}>{$LANG.musteriTipiGSahis|default:'Bireysel-Şahıs (Gerçek Kişi)'}</option>
                    <option value="G-SIRKET" {if $client_btk_data.musteri_tipi == 'G-SIRKET'}selected{/if}>{$LANG.musteriTipiGSirket|default:'Bireysel-Şahıs Şirketi (Gerçek Kişi Tacir)'}</option>
                    <option value="T-SIRKET" {if $client_btk_data.musteri_tipi == 'T-SIRKET'}selected{/if}>{$LANG.musteriTipiTSirket|default:'Tüzel Kişi-Şirket'}</option>
                    <option value="T-KAMU" {if $client_btk_data.musteri_tipi == 'T-KAMU'}selected{/if}>{$LANG.musteriTipiTKamu|default:'Tüzel Kişi-Kamu Kurumu'}</option>
                    {* Diğer müşteri tipleri eklenebilir (ABONE_TIPI.pdf'den) *}
                </select>
            </div>
            <div class="col-md-4 form-group">
                <label for="btk_abone_meslek">{$LANG.aboneMeslek|default:'Meslek'}</label>
                 <i class="fas fa-info-circle btk-tooltip" title="{$LANG.aboneMeslekDesc|default:'BTK EK-5 Meslek Kodları listesinden seçiniz.'}"></i>
                <select name="btk_abone_meslek" id="btk_abone_meslek_client" class="form-control btk-select2-searchable">
                    <option value="">{$LANG.selectOne}</option>
                    {if $ek5_meslek_kodlari_placeholder}
                        {foreach from=$ek5_meslek_kodlari_placeholder item=meslek}
                            <option value="{$meslek.kod|escape:'html'}" {if $client_btk_data.abone_meslek == $meslek.kod}selected{/if}>{$meslek.aciklama|escape:'html'} ({$meslek.kod|escape:'html'})</option>
                        {/foreach}
                    {/if}
                </select>
            </div>
             <div class="col-md-4 form-group">
                <label for="btk_abone_tarife_client">{$LANG.aboneTarife|default:'Abone Tarife Bilgisi'}</label>
                 <i class="fas fa-info-circle btk-tooltip" title="{$LANG.aboneTarifeDesc|default:'Abonenin kullandığı ana tarife veya paket adı.'}"></i>
                <input type="text" name="btk_abone_tarife" id="btk_abone_tarife_client" value="{$client_btk_data.abone_tarife|escape:'html'}" class="form-control">
            </div>
        </div>
        
        {* Kurumsal Aboneler İçin Yetkili Bilgileri (Müşteri Tipi T-SIRKET veya T-KAMU ise gösterilebilir) *}
        {if $client_btk_data.musteri_tipi == 'T-SIRKET' || $client_btk_data.musteri_tipi == 'T-KAMU'}
            <hr>
            <h4><i class="fas fa-user-tie"></i> {$LANG.kurumYetkiliBilgileriTitle|default:'Kurum Yetkili Bilgileri'}</h4>
            <div class="row">
                <div class="col-md-6 form-group">
                    <label for="btk_kurum_yetkili_adi">{$LANG.kurumYetkiliAdi|default:'Yetkili Adı'}</label>
                    <input type="text" name="btk_kurum_yetkili_adi" id="btk_kurum_yetkili_adi" value="{$client_btk_data.kurum_yetkili_adi|escape:'html'}" class="form-control">
                </div>
                <div class="col-md-6 form-group">
                    <label for="btk_kurum_yetkili_soyadi">{$LANG.kurumYetkiliSoyadi|default:'Yetkili Soyadı'}</label>
                    <input type="text" name="btk_kurum_yetkili_soyadi" id="btk_kurum_yetkili_soyadi" value="{$client_btk_data.kurum_yetkili_soyadi|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="row">
                 <div class="col-md-6 form-group">
                    <label for="btk_kurum_yetkili_tckimlik_no">{$LANG.kurumYetkiliTckn|default:'Yetkili T.C. Kimlik No'}</label>
                    <input type="text" name="btk_kurum_yetkili_tckimlik_no" id="btk_kurum_yetkili_tckimlik_no" value="{$client_btk_data.kurum_yetkili_tckimlik_no|escape:'html'}" class="form-control" maxlength="11">
                </div>
                <div class="col-md-6 form-group">
                    <label for="btk_kurum_yetkili_telefon">{$LANG.kurumYetkiliTelefon|default:'Yetkili Telefon No'}</label>
                    <input type="text" name="btk_kurum_yetkili_telefon" id="btk_kurum_yetkili_telefon" value="{$client_btk_data.kurum_yetkili_telefon|escape:'html'}" class="form-control" placeholder="Örn: 5xxxxxxxxx">
                </div>
            </div>
             <div class="form-group">
                <label for="btk_kurum_adres">{$LANG.kurumAdres|default:'Kurum Adresi'}</label>
                <textarea name="btk_kurum_adres" id="btk_kurum_adres" class="form-control" rows="2">{$client_btk_data.kurum_adres|escape:'html'}</textarea>
            </div>
        {/if}


        {*
        <div class="form-group text-center top-margin-20">
            <button type="button" class="btn btn-info btk-save-client-details-ajax" disabled>
                <i class="fas fa-sync-alt"></i> {$LANG.saveBtkClientDetailsAjax|default:'BTK Bilgilerini Ayrı Kaydet (AJAX - Yapım Aşamasında)'}
            </button>
             <span class="help-block">{$LANG.clientDetailsSaveNote|default:'Müşteri bilgilerindeki BTK alanları, ana "Değişiklikleri Kaydet" butonuyla birlikte kaydedilecektir.'}</span>
        </div>
        *}
    </div>
</div>

{* Bu şablona özel JS kodları, btk_admin_scripts.js içine taşınacak.
   Özellikle NVI TCKN doğrulama butonu ve dinamik adres dropdown'ları için.
   btk-datepicker-yyyymmdd sınıfı için de JS eklenecek.
*}