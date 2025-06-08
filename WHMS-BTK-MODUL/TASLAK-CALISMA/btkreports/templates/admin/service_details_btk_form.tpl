{*
    WHMCS BTK Raporlama Modülü - Hizmet Detayları BTK Bilgi Formu Şablonu
    (clientsservices.php sayfasına enjekte edilecek - genellikle bir sekme içinde)
    modules/addons/btkreports/templates/admin/service_details_btk_form.tpl
*}

{* Bu şablonun bir form içine dahil edilmesi veya kendi formunu oluşturması ve
   btkreports.php'deki bir action'a (veya PreAdminServiceEdit hook'una) veri göndermesi beklenir.
   WHMCS hizmet kaydetme formuyla entegre olması için, alan adlarının WHMCS'in
   kaydetme mekanizması tarafından alınabilecek şekilde (örn: btk_fields[alan_adi]) veya
   PreAdminServiceEdit hook'unda özel olarak işlenecek şekilde olması gerekir.
   Şimdilik, $_POST['btk_alan_adi'] gibi direkt okunabilecek name'ler kullanalım.
*}

<div id="btkServiceDetailsFormContainer"> {* JavaScript ile hedeflemek için bir ID *}

    <h4><i class="fas fa-concierge-bell"></i> {$LANG.btkHizmetDetaylariTitle|default:'BTK Hizmet Detayları'}</h4>
    <hr>
    <p class="text-info"><i class="fas fa-info-circle"></i> {$LANG.btkServiceFormDesc|default:'Bu hizmete ait BTK raporlaması için gerekli olan tesis ve diğer özel bilgileri buradan giriniz.'}</p>

    {* Tesis Adresi Yerleşim Adresiyle Aynı Mı? *}
    <div class="form-group">
        <label class="btk-switch">
            <input type="checkbox" name="btk_tesis_adresi_ayni_mi" id="btk_tesis_adresi_ayni_mi" value="1" {if $service_btk_data.tesis_adresi_ayni_mi == 1 || !$service_btk_data_mevcut}checked{/if}>
            <span class="btk-slider round"></span>
        </label>
        {$LANG.tesisAdresiAyniMi|default:'Yerleşim Adresi ile Tesis Adresi Aynı mı?'}
        <i class="fas fa-info-circle btk-tooltip" title="{$LANG.tesisAdresiAyniMiDesc|default:'Eğer bu hizmetin sunulduğu tesis adresi, müşterinin ana yerleşim adresi ile aynı ise işaretleyin. Farklı ise, aşağıdaki alanları doldurun. Yeni hizmetlerde varsayılan olarak işaretlidir.'}"></i>
    </div>

    <div id="btk_tesis_adresi_farkli_div" {if $service_btk_data.tesis_adresi_ayni_mi == 1 || !$service_btk_data_mevcut}style="display:none;"{/if}>
        <h5><i class="fas fa-map-marked-alt"></i> {$LANG.tesisAdresiTitle|default:'Tesis Adresi'} ({$LANG.farkliIseDoldurun|default:'Farklı İse Doldurun'})</h5>
        <div class="row">
            <div class="col-md-4 form-group">
                <label for="btk_tesis_il_id">{$LANG.popIl}</label>
                <select name="btk_tesis_il_id" id="btk_tesis_il_id" class="form-control btk-adres-il-select" data-target-ilce="btk_tesis_ilce_id" data-target-mahalle="btk_tesis_mahalle_id">
                    <option value="">{$LANG.selectOne}</option>
                    {foreach from=$adres_iller item=il}
                        <option value="{$il.id}" {if $service_btk_data.tesis_il_id == $il.id}selected{/if}>{$il.il_adi|escape}</option>
                    {/foreach}
                </select>
            </div>
            <div class="col-md-4 form-group">
                <label for="btk_tesis_ilce_id">{$LANG.popIlce}</label>
                <select name="btk_tesis_ilce_id" id="btk_tesis_ilce_id" class="form-control btk-adres-ilce-select" data-target-mahalle="btk_tesis_mahalle_id" {if !$service_btk_data.tesis_il_id}disabled{/if}>
                    <option value="">{$LANG.onceIliSecin}</option>
                    {if $service_btk_data.tesis_il_id && $adres_tesis_ilceler_list} {* PHP bu listeyi seçili ile göre doldurmalı *}
                        {foreach from=$adres_tesis_ilceler_list item=ilce}
                             <option value="{$ilce.id}" {if $service_btk_data.tesis_ilce_id == $ilce.id}selected{/if}>{$ilce.ilce_adi|escape}</option>
                        {/foreach}
                    {/if}
                </select>
            </div>
            <div class="col-md-4 form-group">
                <label for="btk_tesis_mahalle_id">{$LANG.popMahalle}</label>
                <select name="btk_tesis_mahalle_id" id="btk_tesis_mahalle_id" class="form-control btk-adres-mahalle-select" {if !$service_btk_data.tesis_ilce_id}disabled{/if}>
                    <option value="">{$LANG.onceIlceyiSecin}</option>
                    {if $service_btk_data.tesis_ilce_id && $adres_tesis_mahalleler_list} {* PHP bu listeyi seçili ilçeye göre doldurmalı *}
                        {foreach from=$adres_tesis_mahalleler_list item=mahalle}
                             <option value="{$mahalle.id}" {if $service_btk_data.tesis_mahalle_id == $mahalle.id}selected{/if}>{$mahalle.mahalle_adi|escape}</option>
                        {/foreach}
                    {/if}
                </select>
            </div>
        </div>
        <div class="form-group">
            <label for="btk_tesis_cadde">{$LANG.caddeSokakBulvar}</label>
            <input type="text" name="btk_tesis_cadde" id="btk_tesis_cadde" value="{$service_btk_data.tesis_cadde|escape}" class="form-control">
        </div>
        <div class="row">
            <div class="col-xs-6 form-group">
                <label for="btk_tesis_dis_kapi_no">{$LANG.disKapiNo}</label>
                <input type="text" name="btk_tesis_dis_kapi_no" id="btk_tesis_dis_kapi_no" value="{$service_btk_data.tesis_dis_kapi_no|escape}" class="form-control">
            </div>
            <div class="col-xs-6 form-group">
                <label for="btk_tesis_ic_kapi_no">{$LANG.icKapiNo}</label>
                <input type="text" name="btk_tesis_ic_kapi_no" id="btk_tesis_ic_kapi_no" value="{$service_btk_data.tesis_ic_kapi_no|escape}" class="form-control">
            </div>
        </div>
         <div class="row">
            <div class="col-xs-6 form-group">
                <label for="btk_tesis_posta_kodu">{$LANG.postaKodu}</label>
                <input type="text" name="btk_tesis_posta_kodu" id="btk_tesis_posta_kodu" value="{$service_btk_data.tesis_posta_kodu|escape}" class="form-control" readonly>
                <span class="help-block">{$LANG.mahalleSecinceOto|default:'Mahalle seçildiğinde otomatik dolabilir.'}</span>
            </div>
            <div class="col-xs-6 form-group">
                <label for="btk_tesis_adres_kodu_uavt">{$LANG.adresKoduUAVT}</label>
                <input type="text" name="btk_tesis_adres_kodu_uavt" id="btk_tesis_adres_kodu_uavt" value="{$service_btk_data.tesis_adres_kodu_uavt|escape}" class="form-control">
                <span class="help-block"><a href="https://adres.nvi.gov.tr/VatandasIslemleri/AdresSorgu" target="_blank">{$LANG.uavtSorgula}</a></span>
            </div>
        </div>
    </div>
    <hr>
    <h5><i class="fas fa-map-pin"></i> {$LANG.tesisKoordinatTitle|default:'Tesis Koordinat Bilgileri'} ({$LANG.teknikEkipIcin|default:'Google Maps - Saha Ekibi İçin'})</h5>
    <div class="row">
        <div class="col-md-6 form-group">
            <label for="btk_tesis_koordinat_enlem">{$LANG.tesisKoordinatEnlem|default:'Tesis Koordinat Enlem'}</label>
            <input type="text" name="btk_tesis_koordinat_enlem" id="btk_tesis_koordinat_enlem" value="{$service_btk_data.tesis_koordinat_enlem|escape}" class="form-control" placeholder="Örn: 41.008238">
        </div>
        <div class="col-md-6 form-group">
            <label for="btk_tesis_koordinat_boylam">{$LANG.tesisKoordinatBoylam|default:'Tesis Koordinat Boylam'}</label>
            <input type="text" name="btk_tesis_koordinat_boylam" id="btk_tesis_koordinat_boylam" value="{$service_btk_data.tesis_koordinat_boylam|escape}" class="form-control" placeholder="Örn: 28.978359">
        </div>
    </div>

    {* Sadece ISS Yetki Türüne sahip hizmetler için görünecek bölüm *}
    {if $hizmet_btk_yetki_grubu_placeholder == 'ISS'} {* Bu değişken PHP'den (BtkHelper::getYetkiGrupForService) gelmeli *}
        <hr>
        <h5><i class="fas fa-network-wired"></i> {$LANG.issPopBilgileriTitle|default:'ISS POP Bilgileri'}</h5>
        <div class="form-group">
            <label for="btk_iss_pop_filter_criteria">{$LANG.popFilterBy|default:'POP Filtreleme Kriteri:'}</label>
            <select name="btk_iss_pop_filter_criteria" id="btk_iss_pop_filter_criteria" class="form-control" style="width:auto; display:inline-block; margin-left:10px;">
                <option value="mahalle" {if $pop_filter_default_placeholder == 'mahalle'}selected{/if}>{$LANG.popFilterByMahalle|default:'Mahalleye Göre (Varsayılan)'}</option>
                <option value="ilce" {if $pop_filter_default_placeholder == 'ilce'}selected{/if}>{$LANG.popFilterByIlce|default:'İlçeye Göre'}</option>
                <option value="il" {if $pop_filter_default_placeholder == 'il'}selected{/if}>{$LANG.popFilterByIl|default:'İle Göre'}</option>
            </select>
        </div>
        <div class="form-group">
            <label for="btk_iss_pop_noktasi_id">{$LANG.issPopNoktasiSecimi|default:'ISS POP Noktası (Yayın SSID)'}</label>
            <select name="btk_iss_pop_noktasi_id" id="btk_iss_pop_noktasi_id" class="form-control btk-select2-searchable-pop" data-placeholder="{$LANG.popSearchPlaceholder|default:'SSID veya POP Adı ile ara...'}" style="width:100%;">
                {if $service_btk_data.iss_pop_noktasi_id && $mevcut_pop_noktasi_bilgisi_placeholder}
                    <option value="{$service_btk_data.iss_pop_noktasi_id}" selected>{$mevcut_pop_noktasi_bilgisi_placeholder.yayin_yapilan_ssid} ({$mevcut_pop_noktasi_bilgisi_placeholder.pop_adi})</option>
                {else}
                     <option value="">{$LANG.popSearchPlaceholder|default:'SSID veya POP Adı ile ara...'}</option>
                {/if}
            </select>
            <span class="help-block">{$LANG.issPopSecimNotu|default:"Hizmetin bağlı olduğu POP noktasının yayın SSID'sini seçin veya arayın. Filtre kriterini değiştirerek arama kapsamını daraltabilirsiniz."}</span>
        </div>
    {/if}

    {* Diğer hizmet türlerine özel BTK alanları (Statik IP, Hız Profili vb.) buraya eklenebilir *}
    <hr>
    <div class="row">
        <div class="col-md-6 form-group">
            <label for="btk_statik_ip">{$LANG.statikIp|default:'Statik IP Adresi (Varsa)'}</label>
            <input type="text" name="btk_statik_ip" id="btk_statik_ip" value="{$service_btk_data.statik_ip|escape}" class="form-control" placeholder="Örn: 192.168.1.100">
        </div>
        <div class="col-md-6 form-group">
            <label for="btk_hiz_profili">{$LANG.hizProfili|default:'Hız Profili (Varsa)'}</label>
            <input type="text" name="btk_hiz_profili" id="btk_hiz_profili" value="{$service_btk_data.hiz_profili|escape}" class="form-control" placeholder="Örn: 100 Mbps Download / 20 Mbps Upload">
        </div>
    </div>

    {* Bu formun verilerini kaydetmek için WHMCS'in ana "Değişiklikleri Kaydet" butonu kullanılacak.
       PreAdminServiceEdit hook'u ile bu BTK alanları yakalanıp modül tablolarına kaydedilecek.
       Formun submit olmasını sağlamak için gizli bir input (btk_update_trigger) eklenebilir.
    *}
    <input type="hidden" name="btk_update_trigger" value="1">

</div>

<script type="text/javascript">
// Bu şablona özel JS kodları, btk_admin_scripts.js içinde daha merkezi yönetilecek.
// $(document).ready(function() {
//     // Tesis Adresi Aynı Mı checkbox'ı
//     $('#btk_tesis_adresi_ayni_mi').change(function() {
//         if ($(this).is(":checked")) {
//             $('#btk_tesis_adresi_farkli_div').slideUp('fast');
//             // TODO: Yerleşim adresi bilgilerini tesis adresi alanlarına kopyala (veya PHP tarafında yap)
//             // ve tesis adresi alanlarını readonly yap.
//         } else {
//             $('#btk_tesis_adresi_farkli_div').slideDown('fast');
//             // TODO: Tesis adresi alanlarını temizle ve düzenlenebilir yap.
//         }
//     }).trigger('change'); // Sayfa yüklendiğinde de çalışsın
//
//     // Dinamik adres ve POP seçimi için JS çağrıları btk_admin_scripts.js'den gelecek.
//     // Örn: initializeBtkAddressDropdowns('#btk_tesis_il_id', '#btk_tesis_ilce_id', '#btk_tesis_mahalle_id');
//     // Örn: initializeBtkPopSearch('#btk_iss_pop_noktasi_id', '#btk_iss_pop_filter_criteria', '#btk_tesis_il_id', '#btk_tesis_ilce_id', '#btk_tesis_mahalle_id');
// });
</script>