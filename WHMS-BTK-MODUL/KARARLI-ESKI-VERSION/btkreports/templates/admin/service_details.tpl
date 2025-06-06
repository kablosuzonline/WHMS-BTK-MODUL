{* modules/addons/btkreports/templates/admin/service_details.tpl (v1.0.23) *}
{* Bu şablon btkreports_AdminAreaViewProductDetailsPage hook'u veya getServiceBtkDetails action'ı ile render edilir. *}

{if isset($successMessage) && $successMessage}
    <div class="alert alert-success text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-check-circle"></i> {$successMessage}
    </div>
{/if}
{if isset($errorMessage) && $errorMessage}
    <div class="alert alert-danger text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-times-circle"></i> {$errorMessage}
    </div>
{/if}

<form method="post" action="{$modulelink}&action=saveServiceBtkData" class="form-horizontal" role="form" id="btkServiceDetailsForm">
    <input type="hidden" name="token" value="{$csrfToken}">
    {* service.id Smarty'de array olarak geliyorsa service.id, obje ise service->id kullanılmalı. Hook'tan gelen $vars['serviceid'] idi. *}
    <input type="hidden" name="service_id" value="{if isset($service.id)}{$service.id}{else}{$smarty.get.id}{/if}">
    <input type="hidden" name="client_id" value="{$clientId|default:$service.userid}">
    <input type="hidden" name="tesis_adresi_id_hidden" value="{$btkServiceData.tesis_adresi_id|default:''}">

    <h4>{$_ADDONLANG.btkreports_service_tab_title|default:'BTK Hizmet Bilgileri'}</h4>
    <p class="help-block">WHMCS Service ID: {if isset($service.id)}{$service.id}{else}{$smarty.get.id}{/if} - Müşteri ID: {$clientId|default:$service.userid}</p>
    <hr>

    <div class="row">
        <div class="col-md-6">
            <fieldset>
                <legend><i class="fas fa-concierge-bell"></i> {$_ADDONLANG.btkreports_service_general_info|default:'Genel Hizmet Bilgileri (BTK)'}</legend>
                <div class="form-group">
                    <label for="hat_durum_kodu_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_hat_durum_label}</label>
                    <div class="col-sm-8">
                        <select name="hat_durum_kodu" id="hat_durum_kodu_service" class="form-control">
                            <option value="">{$_ADDONLANG.btkreports_select_option}</option>
                            {foreach from=$hatDurumKodlari item=durum}
                                <option value="{$durum->kod}" {if $btkServiceData.hat_durum_kodu == $durum->kod}selected{/if}>
                                    {$durum->durum_adi} ({$durum->kod}) - {$durum->aciklama}
                                </option>
                            {/foreach}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="hat_aciklama_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_hat_aciklama_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="hat_aciklama" id="hat_aciklama_service" class="form-control" value="{$btkServiceData.hat_aciklama|escape:'html'}">
                    </div>
                </div>
                 <div class="form-group">
                    <label for="override_btk_yetki_turu_kodu_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_override_yetki_label}</label>
                    <div class="col-sm-8">
                        <select name="override_btk_yetki_turu_kodu" id="override_btk_yetki_turu_kodu_service" class="form-control btk-yetki-turu-select-service">
                            <option value="">{$_ADDONLANG.btkreports_pgmap_select_auth_type_override|default:'-- Yetki Türü Seçin (Ürün Grubundan Farklıysa) --'}</option>
                            {foreach from=$availableYetkiTurleri item=yetki}
                                <option value="{$yetki->yetki_kodu}" {if $btkServiceData.override_btk_yetki_turu_kodu == $yetki->yetki_kodu}selected{/if}>
                                    {$yetki->yetki_adi} ({$yetki->yetki_kodu})
                                </option>
                            {/foreach}
                        </select>
                         <p class="help-block">{$_ADDONLANG.btkreports_service_override_yetki_desc|default:'Boş bırakılırsa, ürün grubundan gelen yetki türü kullanılır.'}</p>
                    </div>
                </div>
                <div class="form-group">
                    <label for="override_hizmet_tipi_kodu_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_override_hizmet_label}</label>
                    <div class="col-sm-8">
                        <select name="override_hizmet_tipi_kodu" id="override_hizmet_tipi_kodu_service" class="form-control btk-hizmet-tipi-select-service">
                            <option value="">{$_ADDONLANG.btkreports_pgmap_select_service_type_override|default:'-- Hizmet Tipi Seçin (Ürün Grubundan Farklıysa) --'}</option>
                            {* Bu kısım seçilen override_btk_yetki_turu_kodu'na göre JS ile doldurulacak *}
                        </select>
                         <p class="help-block">{$_ADDONLANG.btkreports_service_override_hizmet_desc|default:'Boş bırakılırsa, ürün grubu eşleştirmesindeki varsayılan hizmet tipi veya yetki türüne göre otomatik belirlenen ilk hizmet tipi kullanılır.'}</p>
                    </div>
                </div>
            </fieldset>
        </div>
        <div class="col-md-6">
            <fieldset>
                <legend><i class="fas fa-network-wired"></i> {$_ADDONLANG.btkreports_service_network_info|default:'Ağ ve ISS Bilgileri'}</legend>
                <div class="form-group">
                    <label for="statik_ip_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_statik_ip_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="statik_ip" id="statik_ip_service" class="form-control" value="{$btkServiceData.statik_ip|default:$service.dedicatedip|escape:'html'}" placeholder="{$_ADDONLANG.btkreports_service_statik_ip_placeholder|default:'Örn: 192.168.1.100 veya 10.0.0.0/24'}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="iss_hiz_profili_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_iss_hiz_profili_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="iss_hiz_profili" id="iss_hiz_profili_service" class="form-control" value="{$btkServiceData.iss_hiz_profili|escape:'html'}" placeholder="{$_ADDONLANG.btkreports_service_iss_hiz_profili_placeholder|default:'Örn: 100 Mbps Fiber'}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="iss_kullanici_adi_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_iss_kullanici_adi_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="iss_kullanici_adi" id="iss_kullanici_adi_service" class="form-control" value="{$btkServiceData.iss_kullanici_adi|default:$service.username|escape:'html'}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="iss_pop_bilgisi_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_iss_pop_bilgisi_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="iss_pop_bilgisi" id="iss_pop_bilgisi_service" class="form-control" value="{$btkServiceData.iss_pop_bilgisi|escape:'html'}">
                    </div>
                </div>
            </fieldset>
        </div>
    </div>
    
    <hr>
    {* Hizmet Tesis Adresi *}
    <div class="row">
        <div class="col-md-12">
            <fieldset class="address-block">
                <legend><i class="fas fa-map-marked-alt"></i> {$_ADDONLANG.btkreports_service_tesis_adresi_title}</legend>
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <label class="checkbox-inline">
                            <input type="checkbox" name="tesis_adresi_ayni" id="tesis_adresi_ayni_service" value="1" {if $btkServiceData.tesis_adresi_yerlesimle_ayni}checked{/if}>
                            {$_ADDONLANG.btkreports_service_tesis_adresi_ayni_label}
                        </label>
                         <p class="help-block">{$_ADDONLANG.btkreports_service_tesis_adresi_ayni_desc|default:"Eğer işaretlenirse, abonenin yerleşim yeri adresi bu hizmet için de kullanılacaktır. İşaretlenmezse aşağıdaki adres alanları doldurulmalıdır."}</p>
                    </div>
                </div>
                <div id="tesisAdresiManuelGirisService" style="{if $btkServiceData.tesis_adresi_yerlesimle_ayni}display:none;{/if}">
                     <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="tesis_il_id_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_il_label}</label>
                                <div class="col-sm-8">
                                    <select name="tesis_il_id" id="tesis_il_id_service" class="form-control" data-initial="{$tesisAdresi->il_id|default:''}">
                                        <option value="">{$_ADDONLANG.btkreports_select_option}</option>
                                        {foreach from=$iller item=il}
                                            <option value="{$il->id}" {if $tesisAdresi && $tesisAdresi->il_id == $il->id}selected{/if}>{$il->il_adi}</option>
                                        {/foreach}
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="tesis_ilce_id_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_ilce_label}</label>
                                <div class="col-sm-8">
                                    <select name="tesis_ilce_id" id="tesis_ilce_id_service" class="form-control" data-initial="{$tesisAdresi->ilce_id|default:''}" {if !($tesisAdresi && $tesisAdresi->il_id)}disabled{/if}>
                                        <option value="">{$_ADDONLANG.btkreports_select_option_ilce}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="tesis_mahalle_id_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_mahalle_label}</label>
                                <div class="col-sm-8">
                                    <select name="tesis_mahalle_id" id="tesis_mahalle_id_service" class="form-control" data-initial="{$tesisAdresi->mahalle_id|default:''}" {if !($tesisAdresi && $tesisAdresi->ilce_id)}disabled{/if}>
                                        <option value="">{$_ADDONLANG.btkreports_select_option_mahalle}</option>
                                    </select>
                                </div>
                            </div>
                             <div class="form-group">
                                <label for="tesis_posta_kodu_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_posta_kodu_label}</label>
                                <div class="col-sm-8">
                                    <input type="text" name="tesis_posta_kodu" id="tesis_posta_kodu_service" class="form-control" value="{$tesisAdresi->posta_kodu|escape:'html'}">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="tesis_csbm_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_csbm_label}</label>
                                <div class="col-sm-8">
                                    <input type="text" name="tesis_csbm" id="tesis_csbm_service" class="form-control" value="{$tesisAdresi->csbm|escape:'html'}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="tesis_site_bina_adi_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_site_bina_label}</label>
                                <div class="col-sm-8">
                                    <input type="text" name="tesis_site_bina_adi" id="tesis_site_bina_adi_service" class="form-control" value="{$tesisAdresi->site_bina_adi|escape:'html'}">
                                </div>
                            </div>
                             <div class="form-group">
                                <label for="tesis_dis_kapi_no_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_dis_kapi_label}</label>
                                <div class="col-sm-8">
                                    <input type="text" name="tesis_dis_kapi_no" id="tesis_dis_kapi_no_service" class="form-control" value="{$tesisAdresi->dis_kapi_no|escape:'html'}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="tesis_ic_kapi_no_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_ic_kapi_label}</label>
                                <div class="col-sm-8">
                                    <input type="text" name="tesis_ic_kapi_no" id="tesis_ic_kapi_no_service" class="form-control" value="{$tesisAdresi->ic_kapi_no|escape:'html'}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="tesis_adres_kodu_uavt_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_uavt_kodu_label}</label>
                                <div class="col-sm-8">
                                    <input type="text" name="tesis_adres_kodu_uavt" id="tesis_adres_kodu_uavt_service" class="form-control" value="{$tesisAdresi->adres_kodu_uavt|escape:'html'}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    </div>
    
    <hr>
    {* Aktivasyon ve Güncelleme Bilgileri *}
    <div class="row">
        <div class="col-md-6">
            <fieldset>
                <legend><i class="fas fa-user-check"></i> {$_ADDONLANG.btkreports_service_aktivasyon_bilgileri_title}</legend>
                <div class="form-group">
                    <label for="aktivasyon_bayi_adi_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_aktivasyon_bayi_adi_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="aktivasyon_bayi_adi" id="aktivasyon_bayi_adi_service" class="form-control" value="{$btkServiceData.aktivasyon_bayi_adi|escape:'html'}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="aktivasyon_bayi_adresi_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_aktivasyon_bayi_adresi_label}</label>
                    <div class="col-sm-8">
                        <textarea name="aktivasyon_bayi_adresi" id="aktivasyon_bayi_adresi_service" class="form-control" rows="2">{$btkServiceData.aktivasyon_bayi_adresi|escape:'html'}</textarea>
                    </div>
                </div>
                <div class="form-group">
                    <label for="aktivasyon_kullanici_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_aktivasyon_kullanici_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="aktivasyon_kullanici" id="aktivasyon_kullanici_service" class="form-control" value="{$btkServiceData.aktivasyon_kullanici|escape:'html'}">
                    </div>
                </div>
            </fieldset>
        </div>
        <div class="col-md-6">
            <fieldset>
                <legend><i class="fas fa-history"></i> {$_ADDONLANG.btkreports_service_guncelleme_bilgileri_title}</legend>
                 <div class="form-group">
                    <label for="guncelleyen_bayi_adi_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_guncelleyen_bayi_adi_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="guncelleyen_bayi_adi" id="guncelleyen_bayi_adi_service" class="form-control" value="{$btkServiceData.guncelleyen_bayi_adi|escape:'html'}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="guncelleyen_bayi_adresi_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_guncelleyen_bayi_adresi_label}</label>
                    <div class="col-sm-8">
                        <textarea name="guncelleyen_bayi_adresi" id="guncelleyen_bayi_adresi_service" class="form-control" rows="2">{$btkServiceData.guncelleyen_bayi_adresi|escape:'html'}</textarea>
                    </div>
                </div>
                <div class="form-group">
                    <label for="guncelleyen_kullanici_service" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_service_guncelleyen_kullanici_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="guncelleyen_kullanici" id="guncelleyen_kullanici_service" class="form-control" value="{$btkServiceData.guncelleyen_kullanici|escape:'html'}">
                    </div>
                </div>
            </fieldset>
        </div>
    </div>

    <div class="form-group text-center" style="margin-top:25px;">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$_ADDONLANG.btkreports_save_btk_data}</button>
    </div>
</form>

<script type="text/javascript">
$(document).ready(function() {
    // Bu TPL için global JS değişkenlerini tanımla (btk_admin_scripts.js'in kullanması için)
    var btkModuleLink = '{$modulelink|escape:"javascript"}';
    var btkCsrfToken = '{$csrfToken|escape:"javascript"}';
    var btkLang = {
        select_option_ilce: '{$_ADDONLANG.btkreports_select_option_ilce|escape:"javascript"}',
        select_option_mahalle: '{$_ADDONLANG.btkreports_select_option_mahalle|escape:"javascript"}',
        pgmap_select_service_type_override: '{$_ADDONLANG.btkreports_pgmap_select_service_type_override|escape:"javascript"|default:"-- Hizmet Tipi Seçin (Ürün Grubundan Farklıysa) --"}'
        // Diğer gerekli dil anahtarları
    };
    var hizmetTipleriByYetkiService = {$hizmetTipleriByYetkiJsonForService|default:'{}'};

    // Adres dropdown'larını başlat (btk_admin_scripts.js'deki fonksiyonları çağırır)
    if (typeof initializeAddressDropdowns === "function") {
        initializeAddressDropdowns('tesis_service'); // ID'leri TPL'dekiyle eşleşecek şekilde ayarla
    } else {
        console.error("initializeAddressDropdowns fonksiyonu bulunamadı. btk_admin_scripts.js yüklü mü?");
    }
    
    // Override Yetki Türü seçimine göre Hizmet Tipi dropdown'ını doldur
    function populateServiceHizmetTipi(selectedYetkiKodu, hizmetTipiSelectElement, selectedHizmetTipi) {
        var $hizmetTipiSelect = $(hizmetTipiSelectElement);
        $hizmetTipiSelect.empty();
        $hizmetTipiSelect.append($('<option>', {
            value: '',
            text: btkLang.pgmap_select_service_type_override
        }));

        if (selectedYetkiKodu && hizmetTipleriByYetkiService && hizmetTipleriByYetkiService[selectedYetkiKodu]) {
            $.each(hizmetTipleriByYetkiService[selectedYetkiKodu], function(index, hizmetTipi) {
                var optionText = hizmetTipi.deger_aciklama.substring(0,50) + (hizmetTipi.deger_aciklama.length > 50 ? '...' : '') + ' (' + hizmetTipi.hizmet_turu + ')';
                var option = $('<option>', {
                    value: hizmetTipi.hizmet_turu,
                    text: optionText
                });
                if (hizmetTipi.hizmet_turu === selectedHizmetTipi) {
                    option.prop('selected', true);
                }
                $hizmetTipiSelect.append(option);
            });
        }
    }

    var initialYetkiService = $('#override_btk_yetki_turu_kodu_service').val();
    var initialHizmetService = '{$btkServiceData.override_hizmet_tipi_kodu|escape:"javascript"}';
    if(initialYetkiService){
        populateServiceHizmetTipi(initialYetkiService, '#override_hizmet_tipi_kodu_service', initialHizmetService);
    }

    $('#override_btk_yetki_turu_kodu_service').on('change', function() {
        populateServiceHizmetTipi($(this).val(), '#override_hizmet_tipi_kodu_service', '');
    });


    // Tesis adresi yerleşimle aynı checkbox'ı
    $('#tesis_adresi_ayni_service').on('change', function() {
        if ($(this).is(':checked')) {
            $('#tesisAdresiManuelGirisService').slideUp();
        } else {
            $('#tesisAdresiManuelGirisService').slideDown();
        }
    }).trigger('change'); // Sayfa yüklendiğinde de durumu kontrol et

     // Tarih alanları için datepicker
    if (typeof $.fn.datepicker === 'function') {
        $('#btkServiceDetailsForm .date-picker').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            yearRange: "-100:+10"
        });
    }
});
</script>