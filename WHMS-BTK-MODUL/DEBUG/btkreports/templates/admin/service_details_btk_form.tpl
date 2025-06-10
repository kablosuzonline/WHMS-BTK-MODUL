{*
    WHMCS BTK Raporlama Modülü - Hizmet Detayları BTK Bilgi Formu Şablonu
    (clientsservices.php sayfasına enjekte edilecek - genellikle bir sekme içinde)
    modules/addons/btkreports/templates/admin/service_details_btk_form.tpl
    Bu şablon, btkreports.php içindeki bir fonksiyon (örn: PreAdminServiceEdit hook'u ile çağrılan veya
    doğrudan hizmet detay sayfasını oluşturan bir btk_page_servicedetails) tarafından gerekli
    Smarty değişkenleriyle ($service_btk_data, $adres_iller, $hizmet_btk_yetki_grubu_placeholder,
    $mevcut_pop_noktasi_bilgisi_placeholder, $LANG, $serviceid_placeholder vb.) doldurulur.
*}

{* Bu şablonun bir form içine dahil edilmesi veya kendi formunu oluşturması ve
   btkreports.php'deki bir action'a (veya PreAdminServiceEdit hook'una) veri göndermesi beklenir.
   Alan adları 'btk_...' prefix'i ile başlayacak.
*}

<div id="btkServiceDetailsFormContainer_s{$serviceid_placeholder|default:0}"> {* Her hizmet için unique ID, 's' prefixi eklendi *}

    <h4><i class="fas fa-concierge-bell"></i> {$LANG.btkHizmetDetaylariTitle|default:'BTK Hizmet Detayları'}</h4>
    <hr>
    <p class="text-info small"><i class="fas fa-info-circle"></i> {$LANG.btkServiceFormDesc|default:'Bu hizmete ait BTK raporlaması için gerekli olan tesis ve diğer özel bilgileri buradan giriniz. Değişiklikler ana "Değişiklikleri Kaydet" butonu ile kaydedilecektir.'}</p>

    {* Tesis Adresi Yerleşim Adresiyle Aynı Mı? *}
    <div class="form-group">
        <label class="btk-switch" for="btk_tesis_adresi_ayni_mi_s{$serviceid_placeholder|default:0}">
            <input type="checkbox" name="btk_tesis_adresi_ayni_mi" id="btk_tesis_adresi_ayni_mi_s{$serviceid_placeholder|default:0}" value="1" {if !isset($service_btk_data) || $service_btk_data.tesis_adresi_ayni_mi == 1 || ($service_btk_data.tesis_adresi_ayni_mi === null && true) }checked{/if}> {* Veri yoksa veya null ise varsayılan işaretli *}
            <span class="btk-slider round"></span>
        </label>
        <label for="btk_tesis_adresi_ayni_mi_s{$serviceid_placeholder|default:0}" style="display:inline; font-weight:normal;">
            {$LANG.tesisAdresiAyniMi|default:'Yerleşim Adresi ile Tesis Adresi Aynı mı?'}
        </label>
        <i class="fas fa-info-circle btk-tooltip" title="{$LANG.tesisAdresiAyniMiDesc|escape:'html'|default:'Eğer bu hizmetin sunulduğu tesis adresi, müşterinin ana yerleşim adresi ile aynı ise işaretleyin. Farklı ise, aşağıdaki alanları doldurun. Yeni hizmetlerde varsayılan olarak işaretlidir.'}"></i>
    </div>

    <div id="btk_tesis_adresi_farkli_div_s{$serviceid_placeholder|default:0}" {if !isset($service_btk_data) || $service_btk_data.tesis_adresi_ayni_mi == 1 || ($service_btk_data.tesis_adresi_ayni_mi === null && true) }style="display:none;"{/if}>
        <h5><i class="fas fa-map-marked-alt"></i> {$LANG.tesisAdresiTitle|default:'Tesis Adresi'} ({$LANG.farkliIseDoldurun|default:'Farklı İse Doldurun'})</h5>
        <div class="row">
            <div class="col-md-4 form-group">
                <label for="btk_tesis_il_id_s{$serviceid_placeholder|default:0}">{$LANG.popIl}</label>
                <select name="btk_tesis_il_id" id="btk_tesis_il_id_s{$serviceid_placeholder|default:0}" class="form-control btk-adres-il-select" data-prefix="s{$serviceid_placeholder|default:0}_tesis_" data-target-ilce="btk_tesis_ilce_id_s{$serviceid_placeholder|default:0}" data-target-mahalle="btk_tesis_mahalle_id_s{$serviceid_placeholder|default:0}" data-target-postakodu="btk_tesis_posta_kodu_s{$serviceid_placeholder|default:0}">
                    <option value="">{$LANG.selectOne}</option>
                    {if $adres_iller}
                        {foreach from=$adres_iller item=il}
                            <option value="{$il.id}" {if isset($service_btk_data.tesis_il_id) && $service_btk_data.tesis_il_id == $il.id}selected{/if}>{$il.il_adi|escape:'html'}</option>
                        {/foreach}
                    {/if}
                </select>
            </div>
            <div class="col-md-4 form-group">
                <label for="btk_tesis_ilce_id_s{$serviceid_placeholder|default:0}">{$LANG.popIlce}</label>
                <select name="btk_tesis_ilce_id" id="btk_tesis_ilce_id_s{$serviceid_placeholder|default:0}" class="form-control btk-adres-ilce-select" data-prefix="s{$serviceid_placeholder|default:0}_tesis_" data-target-mahalle="btk_tesis_mahalle_id_s{$serviceid_placeholder|default:0}" data-target-postakodu="btk_tesis_posta_kodu_s{$serviceid_placeholder|default:0}" {if !(isset($service_btk_data.tesis_il_id) && $service_btk_data.tesis_il_id)}disabled{/if}>
                    <option value="">{$LANG.onceIliSecin}</option>
                    {if isset($service_btk_data.tesis_il_id) && $service_btk_data.tesis_il_id && isset($adres_tesis_ilceler_list_for_service)}
                        {foreach from=$adres_tesis_ilceler_list_for_service item=ilce}
                             <option value="{$ilce.id}" {if isset($service_btk_data.tesis_ilce_id) && $service_btk_data.tesis_ilce_id == $ilce.id}selected{/if}>{$ilce.ilce_adi|escape:'html'}</option>
                        {/foreach}
                    {/if}
                </select>
            </div>
            <div class="col-md-4 form-group">
                <label for="btk_tesis_mahalle_id_s{$serviceid_placeholder|default:0}">{$LANG.popMahalle}</label>
                <select name="btk_tesis_mahalle_id" id="btk_tesis_mahalle_id_s{$serviceid_placeholder|default:0}" class="form-control btk-adres-mahalle-select" data-prefix="s{$serviceid_placeholder|default:0}_tesis_" data-target-postakodu="btk_tesis_posta_kodu_s{$serviceid_placeholder|default:0}" {if !(isset($service_btk_data.tesis_ilce_id) && $service_btk_data.tesis_ilce_id)}disabled{/if}>
                    <option value="">{$LANG.onceIlceyiSecin}</option>
                    {if isset($service_btk_data.tesis_ilce_id) && $service_btk_data.tesis_ilce_id && isset($adres_tesis_mahalleler_list_for_service)}
                        {foreach from=$adres_tesis_mahalleler_list_for_service item=mahalle}
                             <option value="{$mahalle.id}" data-postakodu="{$mahalle.posta_kodu|escape:'html'}" {if isset($service_btk_data.tesis_mahalle_id) && $service_btk_data.tesis_mahalle_id == $mahalle.id}selected{/if}>{$mahalle.mahalle_adi|escape:'html'}</option>
                        {/foreach}
                    {/if}
                </select>
            </div>
        </div>
        <div class="form-group">
            <label for="btk_tesis_cadde_s{$serviceid_placeholder|default:0}">{$LANG.caddeSokakBulvar}</label>
            <input type="text" name="btk_tesis_cadde" id="btk_tesis_cadde_s{$serviceid_placeholder|default:0}" value="{$service_btk_data.tesis_cadde|escape:'html'}" class="form-control">
        </div>
        <div class="row">
            <div class="col-xs-6 form-group">
                <label for="btk_tesis_dis_kapi_no_s{$serviceid_placeholder|default:0}">{$LANG.disKapiNo}</label>
                <input type="text" name="btk_tesis_dis_kapi_no" id="btk_tesis_dis_kapi_no_s{$serviceid_placeholder|default:0}" value="{$service_btk_data.tesis_dis_kapi_no|escape:'html'}" class="form-control">
            </div>
            <div class="col-xs-6 form-group">
                <label for="btk_tesis_ic_kapi_no_s{$serviceid_placeholder|default:0}">{$LANG.icKapiNo}</label>
                <input type="text" name="btk_tesis_ic_kapi_no" id="btk_tesis_ic_kapi_no_s{$serviceid_placeholder|default:0}" value="{$service_btk_data.tesis_ic_kapi_no|escape:'html'}" class="form-control">
            </div>
        </div>
         <div class="row">
            <div class="col-xs-6 form-group">
                <label for="btk_tesis_posta_kodu_s{$serviceid_placeholder|default:0}">{$LANG.postaKodu}</label>
                <input type="text" name="btk_tesis_posta_kodu" id="btk_tesis_posta_kodu_s{$serviceid_placeholder|default:0}" value="{$service_btk_data.tesis_posta_kodu|escape:'html'}" class="form-control" readonly>
                <span class="help-block">{$LANG.mahalleSecinceOto|default:'Mahalle seçildiğinde otomatik dolar.'}</span>
            </div>
            <div class="col-xs-6 form-group">
                <label for="btk_tesis_adres_kodu_uavt_s{$serviceid_placeholder|default:0}">{$LANG.adresKoduUAVT}</label>
                <input type="text" name="btk_tesis_adres_kodu_uavt" id="btk_tesis_adres_kodu_uavt_s{$serviceid_placeholder|default:0}" value="{$service_btk_data.tesis_adres_kodu_uavt|escape:'html'}" class="form-control">
                 <span class="help-block"><a href="https://adres.nvi.gov.tr/VatandasIslemleri/AdresSorgu" target="_blank" rel="noopener noreferrer">{$LANG.uavtSorgula|default:'UAVT Adres Kodu Sorgula'}</a></span>
            </div>
        </div>
    </div>
    <hr>
    <h5><i class="fas fa-map-pin"></i> {$LANG.tesisKoordinatTitle|default:'Tesis Koordinat Bilgileri'} ({$LANG.teknikEkipIcin|default:'Google Maps - Saha Ekibi İçin'})</h5>
    <div class="row">
        <div class="col-md-6 form-group">
            <label for="btk_tesis_koordinat_enlem_s{$serviceid_placeholder|default:0}">{$LANG.tesisKoordinatEnlem|default:'Tesis Koordinat Enlem'}</label>
            <input type="text" name="btk_tesis_koordinat_enlem" id="btk_tesis_koordinat_enlem_s{$serviceid_placeholder|default:0}" value="{$service_btk_data.tesis_koordinat_enlem|escape:'html'}" class="form-control" placeholder="Örn: 41.008238">
        </div>
        <div class="col-md-6 form-group">
            <label for="btk_tesis_koordinat_boylam_s{$serviceid_placeholder|default:0}">{$LANG.tesisKoordinatBoylam|default:'Tesis Koordinat Boylam'}</label>
            <input type="text" name="btk_tesis_koordinat_boylam" id="btk_tesis_koordinat_boylam_s{$serviceid_placeholder|default:0}" value="{$service_btk_data.tesis_koordinat_boylam|escape:'html'}" class="form-control" placeholder="Örn: 28.978359">
        </div>
    </div>

    {* Sadece ISS Yetki Türüne sahip hizmetler için görünecek bölüm *}
    {if $hizmet_btk_yetki_grubu_placeholder == 'ISS'}
        <hr>
        <h5><i class="fas fa-network-wired"></i> {$LANG.issPopBilgileriTitle|default:'ISS POP Bilgileri'}</h5>
        <div class="form-group">
            <label for="btk_iss_pop_filter_criteria_s{$serviceid_placeholder|default:0}">{$LANG.popFilterBy|default:'POP Filtreleme Kriteri:'}</label>
            <select name="btk_iss_pop_filter_criteria" id="btk_iss_pop_filter_criteria_s{$serviceid_placeholder|default:0}" class="form-control btk-pop-filter-criteria" data-serviceid="s{$serviceid_placeholder|default:0}" style="width:auto; display:inline-block; margin-left:10px;">
                <option value="mahalle" {if !isset($service_btk_data.pop_filter_criteria) || $service_btk_data.pop_filter_criteria == 'mahalle'}selected{/if}>{$LANG.popFilterByMahalle|default:'Mahalleye Göre (Varsayılan)'}</option>
                <option value="ilce" {if isset($service_btk_data.pop_filter_criteria) && $service_btk_data.pop_filter_criteria == 'ilce'}selected{/if}>{$LANG.popFilterByIlce|default:'İlçeye Göre'}</option>
                <option value="il" {if isset($service_btk_data.pop_filter_criteria) && $service_btk_data.pop_filter_criteria == 'il'}selected{/if}>{$LANG.popFilterByIl|default:'İle Göre'}</option>
            </select>
        </div>
        <div class="form-group">
            <label for="btk_iss_pop_noktasi_id_s{$serviceid_placeholder|default:0}">{$LANG.issPopNoktasiSecimi|default:'ISS POP Noktası (Yayın SSID)'}</label>
            <select name="btk_iss_pop_noktasi_id" id="btk_iss_pop_noktasi_id_s{$serviceid_placeholder|default:0}" class="form-control btk-select2-searchable-pop" data-serviceid="s{$serviceid_placeholder|default:0}" data-placeholder="{$LANG.popSearchPlaceholder|default:'SSID veya POP Adı ile ara...'}" style="width:100%;">
                {if $service_btk_data.iss_pop_noktasi_id && $mevcut_pop_noktasi_bilgisi_placeholder}
                    <option value="{$service_btk_data.iss_pop_noktasi_id}" selected>{$mevcut_pop_noktasi_bilgisi_placeholder.yayin_yapilan_ssid|escape:'html'} ({$mevcut_pop_noktasi_bilgisi_placeholder.pop_adi|escape:'html'})</option>
                {else}
                     <option value="">{$LANG.popSearchPlaceholder|default:'SSID veya POP Adı ile ara...'}</option>
                {/if}
            </select>
            <span class="help-block">{$LANG.issPopSecimNotu|default:"Hizmetin bağlı olduğu POP noktasının yayın SSID'sini seçin veya arayın. Filtre kriterini ve tesis adresini doğru girdiğinizden emin olun."}</span>
        </div>
    {/if}

    <hr>
    <h5><i class="fas fa-cogs"></i> {$LANG.otherServiceBtkInfo|default:'Diğer Hizmete Özel BTK Bilgileri'}</h5>
    <div class="row">
        <div class="col-md-6 form-group">
            <label for="btk_statik_ip_s{$serviceid_placeholder|default:0}">{$LANG.statikIp|default:'Statik IP Adresi (Varsa)'}</label>
            <input type="text" name="btk_statik_ip" id="btk_statik_ip_s{$serviceid_placeholder|default:0}" value="{$service_btk_data.statik_ip|escape:'html'}" class="form-control" placeholder="Örn: 192.168.1.100 veya birden fazlaysa virgülle ayırın">
        </div>
        <div class="col-md-6 form-group">
            <label for="btk_abone_tarife_service_s{$serviceid_placeholder|default:0}">{$LANG.aboneTarife|default:'Abone Tarife Bilgisi'}</label>
            <input type="text" name="btk_abone_tarife" id="btk_abone_tarife_service_s{$serviceid_placeholder|default:0}" value="{$service_btk_data.abone_tarife|escape:'html'}" class="form-control" placeholder="{$LANG.whmcsProductNamePlaceholder|default:'WHMCS Ürün Adı veya Özel Tarife'}">
        </div>
    </div>
    {* Yetki türüne özel alanlar (alan71-85/94) buraya eklenecek.
       Bu alanlar, $hizmet_btk_yetki_grubu_placeholder değişkenine göre koşullu olarak gösterilebilir.
    *}
    {if $hizmet_btk_yetki_grubu_placeholder == 'GSM'}
        {* GSM'e özel alanlar için form elemanları *}
    {elseif $hizmet_btk_yetki_grubu_placeholder == 'STH'}
        {* STH'ye özel alanlar için form elemanları *}
    {elseif $hizmet_btk_yetki_grubu_placeholder == 'AIH'}
        {* AIH'e özel alanlar için form elemanları *}
    {elseif $hizmet_btk_yetki_grubu_placeholder == 'UYDU'}
        {* UYDU'ya özel alanlar için form elemanları *}
    {/if}

    <input type="hidden" name="btk_update_trigger_service" value="{$serviceid_placeholder|default:0}">
    <input type="hidden" name="serviceid_for_btk_form" value="{$serviceid_placeholder|default:0}">
</div>

<script type="text/javascript">
$(document).ready(function() {
    var serviceId = "{$serviceid_placeholder|escape:'javascript'}";
    var formContainerId = "#btkServiceDetailsFormContainer_s" + serviceId;
    var tesisAdresAyniMiCheckbox = $('#btk_tesis_adresi_ayni_mi_s' + serviceId);
    var tesisAdresiFarkliDiv = $('#btk_tesis_adresi_farkli_div_s' + serviceId);

    tesisAdresAyniMiCheckbox.change(function() {
        if ($(this).is(":checked")) {
            tesisAdresiFarkliDiv.slideUp('fast');
            // İsteğe bağlı: Farklı adres alanlarını temizle veya yerleşim adresinden kopyala
            // $(formContainerId + ' #btk_tesis_il_id_s' + serviceId).val('').trigger('change'); // vs.
        } else {
            tesisAdresiFarkliDiv.slideDown('fast');
        }
    });
    // Sayfa ilk yüklendiğinde de durumu ayarla (checkbox'ın checked durumuna göre)
    if (tesisAdresAyniMiCheckbox.is(":checked")) {
        tesisAdresiFarkliDiv.hide();
    } else {
        tesisAdresiFarkliDiv.show();
    }

    // Dinamik adres dropdown'ları ve POP seçimi için JS çağrıları
    // btk_admin_scripts.js içinde genel fonksiyonlar tanımlanıp buradan çağrılacak.
    // Örnek:
    // initializeBtkAddressDropdowns(formContainerId + ' .btk-adres-il-select', formContainerId + ' .btk-adres-ilce-select', formContainerId + ' .btk-adres-mahalle-select', formContainerId + ' input[name="btk_tesis_posta_kodu"]');
    // initializeBtkPopSearch(formContainerId + ' .btk-select2-searchable-pop', formContainerId + ' .btk-pop-filter-criteria', formContainerId + ' #btk_tesis_il_id_s'+serviceId, formContainerId + ' #btk_tesis_ilce_id_s'+serviceId, formContainerId + ' #btk_tesis_mahalle_id_s'+serviceId);
});
</script>