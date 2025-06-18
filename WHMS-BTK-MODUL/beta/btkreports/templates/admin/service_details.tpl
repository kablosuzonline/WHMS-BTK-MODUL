{* modules/addons/btkreports/templates/admin/service_details.tpl *}
{* Müşteri Hizmet Detayları BTK Bilgileri Sekmesi İçeriği *}
{* Bu dosya doğrudan bir sayfa olarak çağrılmaz, AdminClientServicesTabFields hook'u tarafından içeriği döndürülür. *}

{if $btk_service_action_result}
    <div class="alert alert-{if $btk_service_action_result.status == 'success'}success{else}danger{/if}">
        {$btk_service_action_result.message}
    </div>
{/if}

<form method="post" action="{$smarty.server.REQUEST_URI}" id="btkServiceDetailsForm" class="form-horizontal">
    <input type="hidden" name="btk_service_details_save" value="1">
    <input type="hidden" name="id" value="{$serviceid}"> {* WHMCS $serviceid değişkenini sağlar *}
    <input type="hidden" name="userid" value="{$userid}"> {* WHMCS $userid değişkenini sağlar *}
    <input type="hidden" name="token" value="{$btk_csrf_token_service}"> {* Hook save için CSRF token *}

    <h4><i class="fas fa-concierge-bell"></i> {$lang.btk_hizmet_bilgileri_tab_title}</h4>
    <hr>

    {if $btk_hizmet_data.is_cancelled_for_btk}
        <div class="alert alert-danger">
            <strong>{$lang.hizmet_iptal_korumasi_aktif}</strong>
        </div>
    {/if}

    {if $btk_hizmet_data.is_pending_btk_activation}
        <div class="alert alert-warning">
            <strong>{$lang.hizmet_onay_bekliyor_btk_veri_girisi_gerekli}</strong>
        </div>
    {/if}

    <div class="row">
        <div class="col-md-6">
            <div class="form-group">
                <label for="btk_hizmet_yetki_turu_id" class="col-sm-4 control-label">{$lang.hizmet_yetki_turu_label}*</label>
                <div class="col-sm-8">
                    <select name="btk_hizmet_yetki_turu_id" id="btk_hizmet_yetki_turu_id" class="form-control" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if} required>
                        <option value="">{$lang.select_option}</option>
                        {if $btk_ref_yetki_turleri}
                        {foreach from=$btk_ref_yetki_turleri item=yetki}
                            <option value="{$yetki->id}" {if $btk_hizmet_data.yetki_turu_id == $yetki->id}selected{/if}>
                                {$yetki->yetki_adi|escape:'html'} ({$yetki->yetki_kodu_kisa|escape:'html'})
                            </option>
                        {/foreach}
                        {/if}
                    </select>
                    <span class="help-block">{$lang.hizmet_yetki_turu_desc}</span>
                </div>
            </div>

            <div class="form-group">
                <label class="col-sm-4 control-label">{$lang.hat_no_label}</label>
                <div class="col-sm-8">
                    <p class="form-control-static">{$serviceid} <small>({$lang.hat_no_desc})</small></p>
                </div>
            </div>

            <div class="form-group">
                <label for="btk_hat_durum" class="col-sm-4 control-label">{$lang.hat_durum_label}*</label>
                <div class="col-sm-8">
                    <select name="btk_hat_durum" id="btk_hat_durum" class="form-control" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if} required>
                        <option value="">{$lang.select_option}</option>
                        <option value="A" {if $btk_hizmet_data.hat_durum == 'A'}selected{/if}>A - Aktif</option>
                        <option value="I" {if $btk_hizmet_data.hat_durum == 'I'}selected{/if}>I - İptal</option>
                        <option value="D" {if $btk_hizmet_data.hat_durum == 'D'}selected{/if}>D - Dondurulmuş</option>
                        <option value="K" {if $btk_hizmet_data.hat_durum == 'K'}selected{/if}>K - Kısıtlı</option>
                    </select>
                     <span class="help-block">{$lang.hat_durum_desc}</span>
                </div>
            </div>

            <div class="form-group">
                <label for="btk_hat_durum_kodu_ref" class="col-sm-4 control-label">{$lang.hat_durum_kodu_label}*</label>
                <div class="col-sm-8">
                    <select name="btk_hat_durum_kodu_ref" id="btk_hat_durum_kodu_ref" class="form-control" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if} required>
                        <option value="">{$lang.select_option}</option>
                        {if $btk_ref_hat_durum_kodlari}
                        {foreach from=$btk_ref_hat_durum_kodlari item=durumkod}
                            <option value="{$durumkod.kod}" data-aciklama="{$durumkod.aciklama|escape:'html'}" {if $btk_hizmet_data.hat_durum_kodu_ref == $durumkod.kod}selected{/if}>
                                {$durumkod.kod} - {$durumkod.aciklama|escape:'html'}
                            </option>
                        {/foreach}
                        {/if}
                    </select>
                    <span class="help-block">{$lang.hat_durum_kodu_desc}</span>
                </div>
            </div>

             <div class="form-group">
                <label class="col-sm-4 control-label">{$lang.hat_durum_aciklama_label}</label>
                <div class="col-sm-8">
                    <p class="form-control-static" id="btk_hat_durum_aciklama_display">{$btk_hizmet_data.hat_durum_aciklama_calculated|default:'-'}</p>
                    <span class="help-block">{$lang.hat_durum_aciklama_desc}</span>
                </div>
            </div>

            <div class="form-group">
                <label for="btk_hizmet_tipi_kodu" class="col-sm-4 control-label">{$lang.hizmet_tipi_label}*</label>
                <div class="col-sm-8">
                    <select name="btk_hizmet_tipi_kodu" id="btk_hizmet_tipi_kodu" class="form-control" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if} required>
                        <option value="">{$lang.select_option}</option>
                        {if $btk_ref_hizmet_tipleri}
                        {foreach from=$btk_ref_hizmet_tipleri item=tip}
                            <option value="{$tip.kod}" {if $btk_hizmet_data.hizmet_tipi_kodu == $tip.kod}selected{/if}>
                                {$tip.aciklama|escape:'html'} ({$tip.kod|escape:'html'})
                            </option>
                        {/foreach}
                        {/if}
                    </select>
                    <span class="help-block">{$lang.hizmet_tipi_desc}</span>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="form-group">
                <label for="btk_abone_baslangic_tarihi" class="col-sm-4 control-label">{$lang.abone_baslangic_tarihi_label_hizmet}*</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_baslangic_tarihi" id="btk_abone_baslangic_tarihi" value="{$btk_hizmet_data.abone_baslangic_tarihi|default:$regdate|date_format:'%Y-%m-%d %H:%M:%S'}" class="form-control datetime-picker-btk" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if} required>
                    <span class="help-block">{$lang.abone_baslangic_tarihi_desc_hizmet}</span>
                </div>
            </div>
            <div class="form-group">
                <label for="btk_abone_bitis_tarihi" class="col-sm-4 control-label">{$lang.abone_bitis_tarihi_label_hizmet}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_bitis_tarihi" id="btk_abone_bitis_tarihi" value="{$btk_hizmet_data.abone_bitis_tarihi|date_format:'%Y-%m-%d %H:%M:%S'}" class="form-control datetime-picker-btk" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if}>
                    <span class="help-block">{$lang.abone_bitis_tarihi_desc_hizmet}</span>
                </div>
            </div>
            <div class="form-group">
                <label for="btk_tarife_bilgisi" class="col-sm-4 control-label">{$lang.tarife_bilgisi_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_tarife_bilgisi" id="btk_tarife_bilgisi" value="{$btk_hizmet_data.tarife_bilgisi|default:$productname|escape:'html'}" class="form-control" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if}>
                    <span class="help-block">{$lang.tarife_bilgisi_desc}</span>
                </div>
            </div>
            <div class="form-group">
                <label for="btk_statik_ip_blogu" class="col-sm-4 control-label">{$lang.statik_ip_blogu_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_statik_ip_blogu" id="btk_statik_ip_blogu" value="{$btk_hizmet_data.statik_ip_blogu|default:$dedicatedip|escape:'html'}" class="form-control" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if}>
                    <span class="help-block">{$lang.statik_ip_blogu_desc}</span>
                </div>
            </div>
            <div class="form-group">
                <label for="btk_iss_hiz_profili" class="col-sm-4 control-label">{$lang.iss_hiz_profili_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_iss_hiz_profili" id="btk_iss_hiz_profili" value="{$btk_hizmet_data.iss_hiz_profili|escape:'html'}" class="form-control" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if}>
                    <span class="help-block">{$lang.iss_hiz_profili_desc}</span>
                </div>
            </div>
             <div class="form-group">
                <label for="btk_iss_kullanici_adi" class="col-sm-4 control-label">{$lang.iss_kullanici_adi_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_iss_kullanici_adi" id="btk_iss_kullanici_adi" value="{$btk_hizmet_data.iss_kullanici_adi|default:$username|escape:'html'}" class="form-control" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if}>
                    <span class="help-block">{$lang.iss_kullanici_adi_desc}</span>
                </div>
            </div>
        </div>
    </div>
    <hr>

    {* BÖLÜM 1 SONU - Devamı sonraki bölümde (POP Bilgileri, Adresler, Aktivasyon vb.) *}
</form>
{* modules/addons/btkreports/templates/admin/service_details.tpl *}
{* Müşteri Hizmet Detayları BTK Bilgileri Sekmesi İçeriği *}
{* BÖLÜM 2 / 2 (SON BÖLÜM) *}

    {* --- ÖNCEKİ BÖLÜMÜN DEVAMI --- *}
    {* Form tag'ı ilk bölümde açılmıştı. *}

    <h4><i class="fas fa-network-wired"></i> {$lang.iss_pop_bilgisi_label}</h4>
    <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-sm-12 control-label" style="text-align:left;">{$lang.pop_server_name_label}</label>
                <div class="col-sm-12">
                    <p class="form-control-static">{$serverhostname|default:$servername|escape:'html'} <small>({$lang.pop_server_name_desc})</small></p>
                    <input type="hidden" name="btk_iss_pop_bilgisi_sunucu" value="{$serverhostname|default:$servername|escape:'html'}">
                </div>
            </div>
        </div>
        <div class="col-md-5">
            <div class="form-group">
                <label for="btk_iss_pop_bilgisi_ref_id" class="col-sm-12 control-label" style="text-align:left;">{$lang.select_pop_point_label} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.iss_pop_bilgisi_desc|escape:'html'}"></i></label>
                <div class="col-sm-12">
                     <select name="btk_iss_pop_bilgisi_ref_id" id="btk_iss_pop_bilgisi_ref_id" class="form-control select2-popsearch" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if} data-placeholder="{$lang.select_option} / {$lang.search}...">
                        <option value="">{$lang.select_option}</option>
                        {if $btk_pop_noktalari_listesi}
                        {foreach from=$btk_pop_noktalari_listesi item=pop}
                            <option value="{$pop.id}" {if $btk_hizmet_data.iss_pop_bilgisi_ref_id == $pop.id}selected{/if}
                                    data-il="{$pop.adres_il_adi|escape:'html'}"
                                    data-ilce="{$pop.adres_ilce_adi|escape:'html'}"
                                    data-mahalle="{$pop.adres_mahalle_adi|escape:'html'}">
                                {$pop.pop_adi|escape:'html'}{if $pop.yayin_yapilan_ssid} - {$pop.yayin_yapilan_ssid|escape:'html'}{/if} ({$pop.adres_il_adi|escape:'html'}{if $pop.adres_ilce_adi}, {$pop.adres_ilce_adi|escape:'html'}{/if})
                            </option>
                        {/foreach}
                        {/if}
                    </select>
                    {* Alternatif olarak, eğer POP listesi çok uzunsa ve AJAX ile arama yapılacaksa: *}
                    {* <input type="text" name="btk_iss_pop_bilgisi_manual" id="btk_iss_pop_bilgisi_manual" value="{$btk_hizmet_data.iss_pop_bilgisi_manual|escape:'html'}" class="form-control" placeholder="SunucuAdi.SSID formatında veya sadece POP Adı"> *}
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="btk_pop_filter_by" class="col-sm-12 control-label" style="text-align:left;">{$lang.pop_point_filter_by_label}</label>
                 <div class="col-sm-12">
                    <select name="btk_pop_filter_by" id="btk_pop_filter_by" class="form-control input-sm" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if}>
                        <option value="mahalle">{$lang.pop_filter_mahalle}</option>
                        <option value="ilce">{$lang.pop_filter_ilce}</option>
                        <option value="il">{$lang.pop_filter_il}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
    <hr>

    <h4><i class="fas fa-user-check"></i> {$lang.aktivasyon_bilgileri_title}</h4>
    <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label for="btk_aktivasyon_bayi_adi" class="col-sm-4 control-label">{$lang.aktivasyon_bayi_adi_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_aktivasyon_bayi_adi" id="btk_aktivasyon_bayi_adi" value="{$btk_hizmet_data.aktivasyon_bayi_adi|escape:'html'}" class="form-control" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if}>
                </div>
            </div>
        </div>
        <div class="col-md-5">
             {* Aktivasyon Bayi Adresi için partials/address_fields.tpl kullanılabilir veya basit bir textarea *}
             <div class="form-group">
                <label for="btk_aktivasyon_bayi_adresi_text" class="col-sm-3 control-label">{$lang.aktivasyon_bayi_adresi_label}</label>
                <div class="col-sm-9">
                    <textarea name="btk_aktivasyon_bayi_adresi_text" id="btk_aktivasyon_bayi_adresi_text" class="form-control" rows="1" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if}>{$btk_hizmet_data.aktivasyon_bayi_adresi_text|escape:'html'}</textarea>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="btk_aktivasyon_kullanici" class="col-sm-5 control-label">{$lang.aktivasyon_kullanici_label}</label>
                <div class="col-sm-7">
                    <input type="text" name="btk_aktivasyon_kullanici" id="btk_aktivasyon_kullanici" value="{$btk_hizmet_data.aktivasyon_kullanici|default:$admin_username|escape:'html'}" class="form-control" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if}>
                </div>
            </div>
        </div>
    </div>
    <hr>
    
    <h4><i class="fas fa-user-edit"></i> {$lang.guncelleyen_bilgileri_title}</h4>
     <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label for="btk_guncelleyen_bayi_adi" class="col-sm-4 control-label">{$lang.guncelleyen_bayi_adi_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_guncelleyen_bayi_adi" id="btk_guncelleyen_bayi_adi" value="{$btk_hizmet_data.guncelleyen_bayi_adi|escape:'html'}" class="form-control" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if}>
                </div>
            </div>
        </div>
        <div class="col-md-5">
             <div class="form-group">
                <label for="btk_guncelleyen_bayi_adresi_text" class="col-sm-3 control-label">{$lang.guncelleyen_bayi_adresi_label}</label>
                <div class="col-sm-9">
                    <textarea name="btk_guncelleyen_bayi_adresi_text" id="btk_guncelleyen_bayi_adresi_text" class="form-control" rows="1" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if}>{$btk_hizmet_data.guncelleyen_bayi_adresi_text|escape:'html'}</textarea>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="btk_guncelleyen_kullanici" class="col-sm-5 control-label">{$lang.guncelleyen_kullanici_label}</label>
                <div class="col-sm-7">
                    <input type="text" name="btk_guncelleyen_kullanici" id="btk_guncelleyen_kullanici" value="{$btk_hizmet_data.guncelleyen_kullanici|default:$admin_username|escape:'html'}" class="form-control" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if}>
                </div>
            </div>
        </div>
    </div>
    <hr>

    <h4><i class="fas fa-map-marker-alt"></i> {$lang.hizmet_tesis_adresi_title}*</h4>
    <div class="form-group">
        <div class="col-sm-offset-1 col-sm-11">
            <label class="toggle-switch">
                <input type="checkbox" name="btk_tesis_adresi_ayni_mi" id="btk_tesis_adresi_ayni_mi" value="1" {if $btk_hizmet_data.tesis_adresi_ayni_mi|default:true}checked{/if} {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if}>
                <span class="slider round"></span>
            </label>
            <span style="margin-left: 5px;">{$lang.tesis_adresi_ayni_mi_yerlesimle_label}</span>
            <span class="help-block" style="margin-left:45px;">{$lang.tesis_adresi_ayni_mi_yerlesimle_desc}</span>
        </div>
    </div>

    <div id="tesisAdresiFarkliAlanlari" {if $btk_hizmet_data.tesis_adresi_ayni_mi|default:true}style="display:none;"{/if}>
        {include file="./partials/address_fields.tpl" prefix="btk_tesis" address_data=$btk_tesis_adresi_data iller_for_select=$btk_ref_iller lang=$lang required_fields=true disabled_override=$btk_hizmet_data.is_cancelled_for_btk}
    </div>
    <hr>
    <div class="form-group">
        <label for="btk_google_maps_link" class="col-sm-3 control-label">{$lang.adres_google_maps_link_label}</label>
        <div class="col-sm-9">
            <input type="url" name="btk_google_maps_link" id="btk_google_maps_link" value="{$btk_hizmet_data.google_maps_link|escape:'html'}" class="form-control" {if $btk_hizmet_data.is_cancelled_for_btk}disabled{/if} placeholder="https://maps.google.com/...">
            <span class="help-block">{$lang.adres_google_maps_link_desc}</span>
        </div>
    </div>


    {* Form Kaydetme Butonu WHMCS tarafından sağlanır (Hizmet Detayları sayfasının kendi "Değişiklikleri Kaydet" butonu). *}
    {* AdminClientServicesTabFieldsSave hook'u POST verilerini yakalayacaktır. *}
    {* Eğer sipariş onay sürecinde özel bir buton gerekiyorsa (is_pending_btk_activation), o PHP tarafında eklenecek. *}
    {if $btk_hizmet_data.is_pending_btk_activation && !$btk_hizmet_data.is_cancelled_for_btk}
        <div class="text-center" style="margin-top: 20px;">
            <button type="submit" name="btk_service_approve_action" value="approve" class="btn btn-success btn-lg">
                <i class="fas fa-check-double"></i> {$lang.btk_siparis_onayla_button_text}
            </button>
        </div>
    {/if}

</form> {* btkServiceDetailsForm Sonu - İlk bölümde açılmıştı *}

<script type="text/javascript">
$(document).ready(function() {
    // Tooltip'leri etkinleştir
    $('[data-toggle="tooltip"]').tooltip({ container: 'body' });

    // Tarih ve Saat seçicileri etkinleştir (WHMCS'in kendi datetimepicker'ını veya uyumlu bir kütüphaneyi kullan)
    if ($.fn.datetimepicker) { // Varsayılan WHMCS datetimepicker
        $('.datetime-picker-btk').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:ss', // MySQL DATETIME formatına uygun
            showTodayButton: true,
            showClear: true,
            showClose: true,
            allowInputToggle: true,
            // Türkçe için locale ayarı gerekebilir
            // locale: 'tr'
        });
    } else if ($.fn.datepicker && typeof $.datepicker.regional['tr'] !== 'undefined') { // Fallback jQuery UI Datepicker
        console.warn("BTK Modülü: WHMCS datetimepicker bulunamadı, jQuery UI datepicker kullanılıyor (sadece tarih).");
        $('.datetime-picker-btk').datepicker({
            dateFormat: 'yy-mm-dd', // YYYY-AA-GG formatı
            monthNames: $.datepicker.regional['tr'].monthNames,
            dayNamesMin: $.datepicker.regional['tr'].dayNamesMin,
            firstDay: 1,
            changeMonth: true,
            changeYear: true,
            yearRange: "-5:+5"
        });
    } else {
        console.warn("BTK Modülü: Tarih/Saat seçici kütüphanesi bulunamadı.");
    }

    // Hat Durum Kodu seçildiğinde Açıklamasını güncelle
    $('#btk_hat_durum_kodu_ref').change(function() {
        var selectedOption = $(this).find('option:selected');
        var aciklama = selectedOption.data('aciklama');
        $('#btk_hat_durum_aciklama_display').text(aciklama ? aciklama : '-');
    }).trigger('change'); // Sayfa yüklendiğinde de çalıştır

    // Tesis Adresi Aynı mı? anahtarını yönet
    $('#btk_tesis_adresi_ayni_mi').change(function() {
        if ($(this).is(':checked')) {
            $('#tesisAdresiFarkliAlanlari').slideUp('fast');
            // Tesis adresi alanlarını temizle veya PHP tarafında bu durum dikkate alınarak yerleşim adresi kullanılır
        } else {
            $('#tesisAdresiFarkliAlanlari').slideDown('fast');
        }
    });
    // Sayfa yüklendiğinde de durumu kontrol et
    if (!$('#btk_tesis_adresi_ayni_mi').is(":checked")) {
         $('#tesisAdresiFarkliAlanlari').show();
    }


    // ISS POP Noktası Seçimi ve Filtreleme
    // Select2 gibi bir kütüphane ile arama özelliği eklenebilir veya basit filtreleme.
    // Varsayım: $btk_pop_noktalari_listesi PHP tarafından tüm aktif POP'ları içeriyor.
    // Tesis adresindeki İl/İlçe/Mahalle bilgisine göre bu listeyi filtreleyeceğiz.
    // Tesis adresi için initBtkAddressDropdowns('btk_tesis') çağrılmalı.

    var allPopOptions = [];
    $('#btk_iss_pop_bilgisi_ref_id option').each(function() {
        if ($(this).val() !== '') { // Boş seçeneği alma
            allPopOptions.push({
                value: $(this).val(),
                text: $(this).text(),
                il: $(this).data('il') ? $(this).data('il').toLowerCase() : '',
                ilce: $(this).data('ilce') ? $(this).data('ilce').toLowerCase() : '',
                mahalle: $(this).data('mahalle') ? $(this).data('mahalle').toLowerCase() : ''
            });
        }
    });

    function filterPopOptions() {
        var filterType = $('#btk_pop_filter_by').val(); // 'mahalle', 'ilce', 'il'
        var tesisIl = ($('#btk_tesis_il_kodu option:selected').text() || '').toLowerCase().trim(); // Seçilen ilin adı
        var tesisIlce = ($('#btk_tesis_ilce_kodu option:selected').text() || '').toLowerCase().trim(); // Seçilen ilçenin adı
        var tesisMahalle = ($('#btk_tesis_mahalle_kodu option:selected').text() || '').toLowerCase().trim(); // Seçilen mahallenin adı

        var currentSelectedPop = $('#btk_iss_pop_bilgisi_ref_id').val();
        $('#btk_iss_pop_bilgisi_ref_id').empty().append($('<option value="">{$lang.select_option|escape:"javascript"}</option>'));

        $.each(allPopOptions, function(index, pop) {
            var match = false;
            if (filterType === 'mahalle' && tesisMahalle && pop.mahalle.includes(tesisMahalle) && tesisIlce && pop.ilce.includes(tesisIlce) && tesisIl && pop.il.includes(tesisIl)) {
                match = true;
            } else if (filterType === 'ilce' && tesisIlce && pop.ilce.includes(tesisIlce) && tesisIl && pop.il.includes(tesisIl)) {
                match = true;
            } else if (filterType === 'il' && tesisIl && pop.il.includes(tesisIl)) {
                match = true;
            } else if (!tesisIl) { // Eğer tesis adresi girilmemişse hepsini göster
                 match = true;
            }


            if (match) {
                $('#btk_iss_pop_bilgisi_ref_id').append($('<option></option>').attr('value', pop.value).text(pop.text));
            }
        });
        $('#btk_iss_pop_bilgisi_ref_id').val(currentSelectedPop); // Önceki seçimi korumaya çalış
        
        // Eğer Select2 kullanılıyorsa:
        // if ($.fn.select2) { $('#btk_iss_pop_bilgisi_ref_id').select2({ theme: 'bootstrap', placeholder: '{$lang.select_option|escape:"javascript"}' }); }
    }

    // Tesis adresi alanları ve filtre tipi değiştiğinde POP listesini güncelle
    $('#btk_tesis_il_kodu, #btk_tesis_ilce_kodu, #btk_tesis_mahalle_kodu, #btk_pop_filter_by').change(filterPopOptions);
    
    // Sayfa yüklendiğinde ilk filtrelemeyi yap (eğer tesis adresi dolu geliyorsa)
    // Bunun için initBtkAddressDropdowns('btk_tesis') çağrıldıktan sonra filterPopOptions çağrılmalı.
    // Adres dropdownları yüklendikten sonra tetiklenmesi için bir callback veya gecikme eklenebilir.
    // Şimdilik, ana TPL'deki adres scriptinin sonunda bu fonksiyon çağrılabilir.
    // Ya da adres dropdownlarının `success` callback'lerinden çağrılabilir.

    // Adres dropdown'ları için (client_details.tpl'deki gibi, sadece 'btk_tesis' prefix'i ile)
    if (typeof window.initBtkAddressDropdowns === 'function') {
        window.initBtkAddressDropdowns('btk_tesis');
        // Adresler yüklendikten sonra POP filtresini tetikle
        // Bu, AJAX tamamlandıktan sonra yapılmalı. Şimdilik basit bir timeout ile deneyelim
        // veya adres scriptinin success callback'ine ekleyelim.
        // setTimeout(filterPopOptions, 1500); // Geçici çözüm
    } else {
        console.error("initBtkAddressDropdowns fonksiyonu bulunamadı. Adres dropdownları çalışmayabilir.");
    }
     // POP Filtreleme için Select2 entegrasyonu (opsiyonel)
    if ($.fn.select2) {
        $('.select2-popsearch').select2({
            theme: 'bootstrap',
            placeholder: $(this).data('placeholder'),
            allowClear: true
        });
    }


});
</script>