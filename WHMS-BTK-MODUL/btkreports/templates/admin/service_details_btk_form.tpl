{* WHMCS BTK Raporları Modülü - Hizmet Detayları BTK ve Operasyonel Bilgiler Formu *}
{* Bu şablon, AdminAreaServiceDetailsOutput veya benzeri bir hook ile hizmet detayları sayfasına enjekte edilir. *}

{include file="./shared/alert_messages.tpl" flash_message_key="btk_service_flash_message"}

{if $btk_service_data_error}
    <div class="alert alert-danger text-center">
        {$btk_service_data_error}
    </div>
{/if}

<form method="post" action="{$modulelink}&action=saveservicebtkdata" class="form-horizontal" id="serviceBtkFormAdmin">
    <input type="hidden" name="token" value="{$csrfToken}" />
    <input type="hidden" name="userid" value="{$userid}" />
    <input type="hidden" name="serviceid" value="{$serviceid}" />
    <input type="hidden" name="rehber_id" value="{$btk_rehber_data.id|default:0}" />
    <input type="hidden" name="ek_detay_id" value="{$btk_ek_detay_data.id|default:0}" />

    {* BTK İçin Gerekli Hizmet Bilgileri *}
    <div class="panel panel-info btk-profile-injection-panel">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-file-invoice icon-spacer"></i>{$LANG.btk_form_section_title} (Hizmet Bazlı)</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="service_HAT_NO" class="col-sm-4 control-label">{$LANG.HAT_NO}</label>
                        <div class="col-sm-8">
                            <input type="text" name="HAT_NO" id="service_HAT_NO" value="{$btk_rehber_data.HAT_NO|default:$serviceid|escape:'html'}" class="form-control" readonly>
                            <small class="text-muted">Genellikle WHMCS Hizmet ID ({$serviceid}) kullanılır.</small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="service_HIZMET_TIPI" class="col-sm-4 control-label">{$LANG.btk_service_type} *</label>
                        <div class="col-sm-8">
                            <select name="HIZMET_TIPI" id="service_HIZMET_TIPI" class="form-control select-select2-basic" required>
                                <option value="">-- {$LANG.btk_select_service_type} --</option>
                                {foreach from=$ref_hizmet_tipleri item=tip}
                                    <option value="{$tip->kod}" {if $btk_rehber_data.HIZMET_TIPI == $tip->kod}selected{/if}>{$tip->aciklama|escape:'html'} ({$tip->kod})</option>
                                {/foreach}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="service_ABONE_TARIFE" class="col-sm-4 control-label">{$LANG.btk_tariff_name}</label>
                        <div class="col-sm-8">
                            <input type="text" name="ABONE_TARIFE" id="service_ABONE_TARIFE" value="{$btk_rehber_data.ABONE_TARIFE|default:$service_product_name|escape:'html'}" class="form-control">
                             <small class="text-muted">Varsayılan olarak WHMCS ürün adı gelir.</small>
                        </div>
                    </div>
                     <div class="form-group">
                        <label for="service_ISS_HIZ_PROFILI" class="col-sm-4 control-label">{$LANG.btk_iss_speed_profile}</label>
                        <div class="col-sm-8">
                            <input type="text" name="ISS_HIZ_PROFILI" id="service_ISS_HIZ_PROFILI" value="{$btk_rehber_data.ISS_HIZ_PROFILI|escape:'html'}" class="form-control" placeholder="Örn: 100 Mbps'e kadar">
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="service_HAT_DURUM" class="col-sm-4 control-label">{$LANG.btk_line_status_btk} *</label>
                        <div class="col-sm-8">
                            <select name="HAT_DURUM" id="service_HAT_DURUM" class="form-control select-select2-basic" required>
                                <option value="">-- {$LANG.btk_select_line_status} --</option>
                                {foreach from=$ref_hat_durum item=durum}
                                    <option value="{$durum->kod}" {if $btk_rehber_data.HAT_DURUM == $durum->kod}selected{/if}>{$durum->aciklama|escape:'html'} ({$durum->kod})</option>
                                {/foreach}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="service_HAT_DURUM_KODU" class="col-sm-4 control-label">{$LANG.btk_line_status_code_btk} *</label>
                        <div class="col-sm-8">
                            <select name="HAT_DURUM_KODU" id="service_HAT_DURUM_KODU" class="form-control select-select2" required>
                                <option value="">-- {$LANG.btk_select_line_status_code} --</option>
                                {foreach from=$ref_hat_durum_kodlari item=durumkodu}
                                    <option value="{$durumkodu->kod}" {if $btk_rehber_data.HAT_DURUM_KODU == $durumkodu->kod}selected{/if}>{$durumkodu->aciklama|escape:'html'} ({$durumkodu->kod})</option>
                                {/foreach}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">{$LANG.btk_line_status_code_desc_btk}</label>
                        <div class="col-sm-8">
                            <input type="text" name="HAT_DURUM_KODU_ACIKLAMA" id="service_HAT_DURUM_KODU_ACIKLAMA" value="{$btk_rehber_data.HAT_DURUM_KODU_ACIKLAMA|escape:'html'}" class="form-control" readonly>
                            <small class="text-muted">Hat Durum Kodu seçildiğinde otomatik dolar.</small>
                        </div>
                    </div>
                     <div class="form-group">
                        <label for="service_ABONE_BASLANGIC" class="col-sm-4 control-label">{$LANG.ABONE_BASLANGIC} *</label>
                        <div class="col-sm-8">
                            <input type="text" name="ABONE_BASLANGIC" id="service_ABONE_BASLANGIC" value="{$btk_rehber_data.ABONE_BASLANGIC|default:$service_reg_date_btk_format|escape:'html'}" class="form-control datetime-picker-btk" placeholder="YYYYAAGGSSDDSS" required>
                            <small class="text-muted">Varsayılan: Hizmet kayıt tarihi ({$service_reg_date_human_format})</small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="service_ABONE_BITIS" class="col-sm-4 control-label">{$LANG.ABONE_BITIS}</label>
                        <div class="col-sm-8">
                            <input type="text" name="ABONE_BITIS" id="service_ABONE_BITIS" value="{$btk_rehber_data.ABONE_BITIS|default:'00000000000000'|escape:'html'}" class="form-control datetime-picker-btk" placeholder="YYYYAAGGSSDDSS">
                             <small class="text-muted">İptal durumunda otomatik dolabilir. Aktifse 00000000000000.</small>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="service_STATIK_IP" class="col-sm-4 control-label">{$LANG.btk_static_ip_address}</label>
                        <div class="col-sm-8">
                            <input type="text" name="STATIK_IP" id="service_STATIK_IP" value="{$btk_rehber_data.STATIK_IP|default:$service_dedicated_ip|escape:'html'}" class="form-control" placeholder="x.x.x.x veya x.x.x.x/mask">
                            <small class="text-muted">Varsayılan: WHMCS Atanmış IP ({$service_dedicated_ip|default:'Yok'})</small>
                        </div>
                    </div>
                </div>
                 <div class="col-md-6">
                    <div class="form-group">
                        <label for="service_ISS_KULLANICI_ADI" class="col-sm-4 control-label">{$LANG.btk_iss_username}</label>
                        <div class="col-sm-8">
                            <input type="text" name="ISS_KULLANICI_ADI" id="service_ISS_KULLANICI_ADI" value="{$btk_rehber_data.ISS_KULLANICI_ADI|default:$service_username|escape:'html'}" class="form-control">
                            <small class="text-muted">Varsayılan: WHMCS Kullanıcı Adı ({$service_username|default:'Yok'})</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="service_ISS_POP_BILGISI_SSID" class="col-sm-2 control-label">{$LANG.btk_iss_pop_select_ssid}</label>
                <div class="col-sm-4">
                     <select name="ISS_POP_BILGISI_SSID" id="service_ISS_POP_BILGISI_SSID" class="form-control select-select2">
                        <option value="">-- {$LANG.please_select} --</option>
                        {foreach from=$pop_noktalari item=pop}
                            <option value="{$pop->yayin_yapilan_ssid|escape:'html'}" data-sunucu="{$pop->sunucu_bilgisi|escape:'html'}" {if $selected_pop_ssid == $pop->yayin_yapilan_ssid}selected{/if}>
                                {$pop->pop_adi|escape:'html'} ({$pop->yayin_yapilan_ssid|escape:'html'}) - {$pop->ilce_adi|escape:'html'}
                            </option>
                        {/foreach}
                    </select>
                </div>
                <div class="col-sm-6">
                    <input type="text" name="ISS_POP_BILGISI" id="service_ISS_POP_BILGISI_DISPLAY" value="{$btk_rehber_data.ISS_POP_BILGISI|escape:'html'}" class="form-control" readonly placeholder="{$LANG.btk_iss_pop_info}">
                    <small class="text-muted">WHMCS Sunucu Adı: <strong id="service_server_name_display">{$service_server_name|default:'Tanımsız'}</strong>. Seçilen SSID ile birleşir.</small>
                </div>
            </div>
        </div>
    </div>

{* BTK İçin Gerekli Hizmet Bilgileri - Tesis Adresi - Devam *}
    <div class="panel panel-default btk-profile-injection-panel">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-map-marked-alt icon-spacer"></i>{$LANG.btk_address_service_title}</h3>
        </div>
        <div class="panel-body">
            <div class="form-group">
                <label class="col-sm-3 control-label">{$LANG.btk_service_address_same_as_residential}</label>
                <div class="col-sm-9">
                    <label class="btk-switch">
                        <input type="checkbox" name="tesis_adresi_yerlesimle_ayni" id="service_tesis_adresi_yerlesimle_ayni" value="1" {if $tesis_adresi_yerlesimle_ayni_checked}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    <small class="help-block">İşaretliyse, müşterinin yerleşim adresi bilgileri aşağıdaki tesis adresi alanlarına otomatik olarak kopyalanır.</small>
                </div>
            </div>
            <div id="serviceTesisAdresiAlanlari">
                <div class="form-group">
                    <label for="service_ABONE_ADRES_TESIS_IL" class="col-sm-3 control-label">{$LANG.btk_address_province} *</label>
                    <div class="col-sm-5">
                        <select name="ABONE_ADRES_TESIS_IL" id="service_ABONE_ADRES_TESIS_IL" class="form-control select-select2 btk-adres-il-tesis" required>
                            <option value="">-- {$LANG.please_select} --</option>
                            {foreach from=$iller item=il}
                                <option value="{$il->il_adi|escape:'html'}" data-ilid="{$il->id}" {if $btk_rehber_data.ABONE_ADRES_TESIS_IL == $il->il_adi}selected{/if}>
                                    {$il->il_adi|escape:'html'}
                                </option>
                            {/foreach}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="service_ABONE_ADRES_TESIS_ILCE" class="col-sm-3 control-label">{$LANG.btk_address_district} *</label>
                    <div class="col-sm-5">
                        <select name="ABONE_ADRES_TESIS_ILCE" id="service_ABONE_ADRES_TESIS_ILCE" class="form-control select-select2 btk-adres-ilce-tesis" {if !$btk_rehber_data.ABONE_ADRES_TESIS_IL && !$tesis_ilceleri}disabled{/if} required>
                            <option value="">-- {$LANG.please_select} --</option>
                             {if $tesis_ilceleri}
                                {foreach from=$tesis_ilceleri item=ilce}
                                    <option value="{$ilce->ilce_adi|escape:'html'}" data-ilceid="{$ilce->id}" {if $btk_rehber_data.ABONE_ADRES_TESIS_ILCE == $ilce->ilce_adi}selected{/if}>
                                        {$ilce->ilce_adi|escape:'html'}
                                    </option>
                                {/foreach}
                            {/if}
                        </select>
                    </div>
                </div>
                 <div class="form-group">
                    <label for="service_ABONE_ADRES_TESIS_MAHALLE" class="col-sm-3 control-label">{$LANG.btk_address_neighbourhood} *</label>
                    <div class="col-sm-7">
                        <input type="text" name="ABONE_ADRES_TESIS_MAHALLE" id="service_ABONE_ADRES_TESIS_MAHALLE" value="{$btk_rehber_data.ABONE_ADRES_TESIS_MAHALLE|escape:'html'}" class="form-control" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="service_ABONE_ADRES_TESIS_CADDE" class="col-sm-3 control-label">{$LANG.btk_address_street_avenue}</label>
                    <div class="col-sm-7">
                        <input type="text" name="ABONE_ADRES_TESIS_CADDE" id="service_ABONE_ADRES_TESIS_CADDE" value="{$btk_rehber_data.ABONE_ADRES_TESIS_CADDE|escape:'html'}" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="service_ABONE_ADRES_TESIS_DIS_KAPI_NO" class="col-sm-3 control-label">{$LANG.btk_address_building_no}</label>
                    <div class="col-sm-3">
                        <input type="text" name="ABONE_ADRES_TESIS_DIS_KAPI_NO" id="service_ABONE_ADRES_TESIS_DIS_KAPI_NO" value="{$btk_rehber_data.ABONE_ADRES_TESIS_DIS_KAPI_NO|escape:'html'}" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="service_ABONE_ADRES_TESIS_IC_KAPI_NO" class="col-sm-3 control-label">{$LANG.btk_address_apartment_no}</label>
                    <div class="col-sm-3">
                        <input type="text" name="ABONE_ADRES_TESIS_IC_KAPI_NO" id="service_ABONE_ADRES_TESIS_IC_KAPI_NO" value="{$btk_rehber_data.ABONE_ADRES_TESIS_IC_KAPI_NO|escape:'html'}" class="form-control">
                    </div>
                </div>
                 <div class="form-group">
                    <label for="service_ABONE_ADRES_TESIS_POSTA_KODU" class="col-sm-3 control-label">{$LANG.btk_address_postal_code}</label>
                    <div class="col-sm-3">
                        <input type="text" name="ABONE_ADRES_TESIS_POSTA_KODU" id="service_ABONE_ADRES_TESIS_POSTA_KODU" value="{$btk_rehber_data.ABONE_ADRES_TESIS_POSTA_KODU|escape:'html'}" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="service_ABONE_ADRES_TESIS_ADRES_KODU" class="col-sm-3 control-label">{$LANG.btk_address_uavt_code} (Tesis) *</label>
                    <div class="col-sm-4">
                        <input type="text" name="ABONE_ADRES_TESIS_ADRES_KODU" id="service_ABONE_ADRES_TESIS_ADRES_KODU" value="{$btk_rehber_data.ABONE_ADRES_TESIS_ADRES_KODU|escape:'html'}" class="form-control" required>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {* Bayi ve Kullanıcı Bilgileri *}
    <div class="panel panel-default btk-profile-injection-panel">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-user-tag icon-spacer"></i>Aktivasyon ve Güncelleyen Bilgileri</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="service_AKTIVASYON_BAYI_ADI" class="col-sm-4 control-label">{$LANG.btk_activation_dealer_name}</label>
                        <div class="col-sm-8">
                            <input type="text" name="AKTIVASYON_BAYI_ADI" id="service_AKTIVASYON_BAYI_ADI" value="{$btk_rehber_data.AKTIVASYON_BAYI_ADI|escape:'html'}" class="form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="service_AKTIVASYON_BAYI_ADRESI" class="col-sm-4 control-label">{$LANG.btk_activation_dealer_address}</label>
                        <div class="col-sm-8">
                            <textarea name="AKTIVASYON_BAYI_ADRESI" id="service_AKTIVASYON_BAYI_ADRESI" class="form-control" rows="2">{$btk_rehber_data.AKTIVASYON_BAYI_ADRESI|escape:'html'}</textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="service_AKTIVASYON_KULLANICI" class="col-sm-4 control-label">{$LANG.btk_activation_user}</label>
                        <div class="col-sm-8">
                            <input type="text" name="AKTIVASYON_KULLANICI" id="service_AKTIVASYON_KULLANICI" value="{$btk_rehber_data.AKTIVASYON_KULLANICI|escape:'html'}" class="form-control">
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="service_GUNCELLEYEN_BAYI_ADI" class="col-sm-4 control-label">{$LANG.btk_updating_dealer_name}</label>
                        <div class="col-sm-8">
                            <input type="text" name="GUNCELLEYEN_BAYI_ADI" id="service_GUNCELLEYEN_BAYI_ADI" value="{$btk_rehber_data.GUNCELLEYEN_BAYI_ADI|escape:'html'}" class="form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="service_GUNCELLEYEN_BAYI_ADRESI" class="col-sm-4 control-label">{$LANG.btk_updating_dealer_address}</label>
                        <div class="col-sm-8">
                            <textarea name="GUNCELLEYEN_BAYI_ADRESI" id="service_GUNCELLEYEN_BAYI_ADRESI" class="form-control" rows="2">{$btk_rehber_data.GUNCELLEYEN_BAYI_ADRESI|escape:'html'}</textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="service_GUNCELLEYEN_KULLANICI" class="col-sm-4 control-label">{$LANG.btk_updating_user}</label>
                        <div class="col-sm-8">
                            <input type="text" name="GUNCELLEYEN_KULLANICI" id="service_GUNCELLEYEN_KULLANICI" value="{$btk_rehber_data.GUNCELLEYEN_KULLANICI|escape:'html'}" class="form-control">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

{* Operasyonel Hizmet Bilgileri (BTK Raporlarında Yok) - mod_btk_hizmet_detaylari tablosu için *}
    <div class="panel panel-warning btk-profile-injection-panel">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-tools icon-spacer"></i>{$LANG.btk_operational_info_title}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="col-sm-4 control-label">{$LANG.btk_family_filter_active}</label>
                        <div class="col-sm-8">
                            <label class="btk-switch">
                                <input type="checkbox" name="aile_filtresi_aktif" value="1" {if $btk_ek_detay_data.aile_filtresi_aktif == 1}checked{/if}>
                                <span class="btk-slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="service_mac_adresleri" class="col-sm-4 control-label">{$LANG.btk_mac_addresses} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_mac_addresses_desc|escape:'html'}"></i></label>
                        <div class="col-sm-8">
                            <textarea name="mac_adresleri" id="service_mac_adresleri" class="form-control" rows="2" placeholder="AA:BB:CC:11:22:33;XX-YY-ZZ-AA-BB-CC">{$btk_ek_detay_data.mac_adresleri|escape:'html'}</textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="service_cihaz_seri_no" class="col-sm-4 control-label">{$LANG.btk_device_serial_no} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_device_serial_no_desc|escape:'html'}"></i></label>
                        <div class="col-sm-8">
                             <textarea name="cihaz_seri_no" id="service_cihaz_seri_no" class="form-control" rows="2">{$btk_ek_detay_data.cihaz_seri_no|escape:'html'}</textarea>
                        </div>
                    </div>
                     <div class="form-group">
                        <label for="service_cihaz_modeli" class="col-sm-4 control-label">{$LANG.btk_device_model}</label>
                        <div class="col-sm-8">
                            <input type="text" name="cihaz_modeli" id="service_cihaz_modeli" value="{$btk_ek_detay_data.cihaz_modeli|escape:'html'}" class="form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="service_cihaz_turu" class="col-sm-4 control-label">{$LANG.btk_device_type}</label>
                        <div class="col-sm-8">
                            <select name="cihaz_turu" id="service_cihaz_turu" class="form-control select-select2-basic">
                                <option value="">-- {$LANG.please_select} --</option>
                                <option value="INDOOR" {if $btk_ek_detay_data.cihaz_turu == "INDOOR"}selected{/if}>{$LANG.btk_device_type_indoor}</option>
                                <option value="OUTDOOR" {if $btk_ek_detay_data.cihaz_turu == "OUTDOOR"}selected{/if}>{$LANG.btk_device_type_outdoor}</option>
                                <option value="DIGER" {if $btk_ek_detay_data.cihaz_turu == "DIGER"}selected{/if}>{$LANG.btk_device_type_other}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="service_wifi_sifresi" class="col-sm-4 control-label">{$LANG.btk_wifi_password} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_wifi_password_desc|escape:'html'}"></i></label>
                        <div class="col-sm-8">
                             <div class="input-group">
                                <input type="password" name="wifi_sifresi" id="service_wifi_sifresi" value="{$btk_ek_detay_data.wifi_sifresi|escape:'html'}" class="form-control" autocomplete="new-password">
                                <span class="input-group-btn">
                                    <button class="btn btn-default btk-show-password" type="button"><i class="fas fa-eye"></i></button>
                                </span>
                            </div>
                        </div>
                    </div>
                     <div class="form-group">
                        <label for="service_kurulum_sinyal_kalitesi" class="col-sm-4 control-label">{$LANG.btk_installation_signal_quality}</label>
                        <div class="col-sm-8">
                            <input type="text" name="kurulum_sinyal_kalitesi" id="service_kurulum_sinyal_kalitesi" value="{$btk_ek_detay_data.kurulum_sinyal_kalitesi|escape:'html'}" class="form-control" placeholder="Örn: -65 dBm / SNR: 25">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="service_tesis_koordinatlari" class="col-sm-4 control-label">{$LANG.btk_facility_coordinates} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_facility_coordinates_desc|escape:'html'}"></i></label>
                        <div class="col-sm-8">
                            <div class="input-group">
                                <input type="text" name="tesis_koordinatlari" id="service_tesis_koordinatlari" value="{$btk_ek_detay_data.tesis_koordinatlari|escape:'html'}" class="form-control" placeholder="örn: 40.7128, -74.0060">
                                <span class="input-group-btn">
                                    {if $btk_ek_detay_data.tesis_koordinatlari}
                                    <a href="https://www.google.com/maps?q={$btk_ek_detay_data.tesis_koordinatlari|escape:'url'}&z=15&t=k" target="_blank" class="btn btn-info" data-toggle="tooltip" title="{$LANG.btk_show_on_map} (Uydu)">
                                        <i class="fas fa-satellite-dish"></i>
                                    </a>
                                    {/if}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="service_kurulum_notlari" class="col-sm-4 control-label">{$LANG.btk_installation_notes}</label>
                        <div class="col-sm-8">
                            <textarea name="kurulum_notlari" id="service_kurulum_notlari" class="form-control" rows="3">{$btk_ek_detay_data.kurulum_notlari|escape:'html'}</textarea>
                        </div>
                    </div>
                </div>
            </div>

            {* Teknik Ekibe Konum Gönderme *}
            {if $settings.btk_teknik_ekip_konum_gonderme_aktif == '1'}
            <hr>
            <h4><i class="fas fa-map-signs icon-spacer"></i>{$LANG.btk_send_location_to_personnel}</h4>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="service_konum_gonder_personel_id" class="col-sm-4 control-label">{$LANG.btk_select_personnel_for_location}</label>
                        <div class="col-sm-8">
                            <select name="konum_gonder_personel_id" id="service_konum_gonder_personel_id" class="form-control select-select2">
                                <option value="">-- {$LANG.please_select} --</option>
                                {if $teknik_personeller}
                                    {foreach from=$teknik_personeller item=personel}
                                        <option value="{$personel->id}">{$personel->firstname|escape:'html'} {$personel->lastname|escape:'html'} ({$personel->gorev_bolgesi_ilce_adi|default:'Bölge Yok'|escape:'html'})</option>
                                    {/foreach}
                                {else}
                                    <option value="" disabled>{$LANG.btk_no_technical_personnel_found|default:'Uygun teknik personel bulunamadı.'}</option>
                                {/if}
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                         <label class="col-sm-4 control-label"> </label>
                        <div class="col-sm-8">
                            <button type="button" id="btnSendServiceLocationEmail" class="btn btn-warning" {if !$btk_ek_detay_data.tesis_koordinatlari}disabled{/if}>
                                <i class="fas fa-envelope-open-text icon-spacer"></i>E-posta Gönder
                            </button>
                            <span id="serviceLocationEmailSpinner" style="display:none; margin-left:10px;"><i class="fas fa-spinner fa-spin"></i></span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="serviceLocationEmailResult" style="margin-top:10px;"></div>
            {/if}

        </div>
    </div>

    <div class="panel-footer text-center" style="margin-top: 20px; padding-top:15px; border-top: 1px solid #ddd;">
        <button type="submit" class="btn btn-primary btn-lg">
            <i class="fas fa-save icon-spacer"></i>{$LANG.btk_button_save_changes}
        </button>
    </div>
</form>

{* Hizmet Detayları BTK ve Operasyonel Bilgiler Formu - JavaScript ve Smarty Değişken Notları *}

{*
    Bu şablon için gerekli olan tüm JavaScript kodları (Tooltip, Select2, Tarih/Saat Seçici placeholder'ları,
    Hat Durum Kodu Açıklamasını otomatik doldurma, ISS POP Bilgisi oluşturma, Tesis Adresi Yerleşimle Aynı mı checkbox mantığı,
    dinamik il/ilçe yükleme, şifre gösterme/gizleme, Konum E-postası gönderme AJAX'ı vb.)
    merkezi `assets/js/btk_admin_scripts.js` dosyasına taşınmıştır veya taşınacaktır.
    Bu TPL dosyası sadece HTML yapısını ve Smarty değişkenlerini içermelidir.

    Aşağıda, bu TPL dosyasının ihtiyaç duyacağı temel JavaScript etkileşimleri için `btk_admin_scripts.js`
    içinde olması beklenen fonksiyonlara dair bir hatırlatma bulunmaktadır.
*}

{*
<script type="text/javascript">
    jQuery(document).ready(function($) {
        // Tooltip'ler
        // Select2
        // Tarih/Saat seçicileri için placeholder'lar var, gerçek implementasyon JS'de olacak.

        // Hat Durum Kodu -> Açıklama (service_HAT_DURUM_KODU -> service_HAT_DURUM_KODU_ACIKLAMA)
        // ISS POP Bilgisi (service_ISS_POP_BILGISI_SSID + service_server_name_display -> service_ISS_POP_BILGISI_DISPLAY)
        // Tesis Adresi Yerleşimle Aynı mı? (service_tesis_adresi_yerlesimle_ayni checkbox'ı)
        // Tesis Adresi Dinamik İlçe Yükleme (service_ABONE_ADRES_TESIS_IL -> service_ABONE_ADRES_TESIS_ILCE)
        // Şifre Gösterme/Gizleme (service_wifi_sifresi için)
        // Konumu Personele E-posta Gönder AJAX (btnSendServiceLocationEmail)

        // Örnek: Tesis Adresi Yerleşimle Aynı mı? için JS'den çağrılacak fonksiyon
        // $('#service_tesis_adresi_yerlesimle_ayni').on('change', function() {
        //     var isChecked = $(this).is(':checked');
        //     var yerlesimData = {if isset($btk_client_residential_address_json)}{$btk_client_residential_address_json}{else}null{/if};
        //     btkHandleTesisAdresiAyni(isChecked, '#serviceTesisAdresiAlanlari', yerlesimData, {
        //         il: '#service_ABONE_ADRES_TESIS_IL',
        //         ilce: '#service_ABONE_ADRES_TESIS_ILCE',
        //         // ... diğer alanlar
        //     });
        // }).trigger('change');
    });
</script>
*}

{*
    Gerekli Smarty Değişkenleri (btkreports.php -> SaveServiceBtkData action'ı ve AdminAreaServiceDetailsOutput hook'unda atanmalı):
    - $flash_message (opsiyonel, alert_messages.tpl tarafından kullanılır)
    - $modulepath, $modulelink, $version, $LANG, $csrfToken (standart)
    - $userid, $serviceid (ilgili müşteri ve hizmet ID'leri)
    - $btk_rehber_data: (Object/Array) mod_btk_abone_rehber tablosundan bu hizmete ait BTK verileri.
    - $btk_ek_detay_data: (Object/Array) mod_btk_hizmet_detaylari'ndan bu hizmete ait operasyonel veriler.
    - $service_product_name: WHMCS ürün adı ($service->product->name)
    - $service_reg_date_btk_format, $service_reg_date_human_format: Hizmet kayıt tarihi (BTK ve insan okunabilir formatta)
    - $service_dedicated_ip, $service_username, $service_server_name: WHMCS hizmetinden gelen temel bilgiler.
    - $ref_hizmet_tipleri, $ref_hat_durum, $ref_hat_durum_kodlari: İlgili referans tablo listeleri.
    - $pop_noktalari: (Array of Objects) mod_btk_iss_pop_noktalari tablosundan uygun POP noktaları.
    - $selected_pop_ssid: (String) Eğer bu hizmet için daha önce bir POP SSID seçilmişse.
    - $iller: (Array of Objects) mod_btk_adres_il tablosundan il listesi.
    - $tesis_ilceleri: (Array of Objects) (Düzenleme formu için) Kayıtlı tesis iline ait ilçeler (PHP tarafında önceden yüklenmiş veya AJAX ile yüklenecek).
    - $btk_client_residential_address: (Array) Müşterinin `mod_btk_abone_rehber` tablosundan gelen YERLEŞİM adresi bilgileri (otomatik doldurma için).
        (veya $btk_client_residential_address_json: JSON formatında JS'e aktarmak için)
    - $tesis_adresi_yerlesimle_ayni_checked: (Boolean) "Tesis adresi yerleşimle aynı" checkbox'ının başlangıç durumu.
    - $teknik_personeller: (Array of Objects) Konum göndermek için uygun teknik personellerin listesi.
    - $settings.btk_teknik_ekip_konum_gonderme_aktif: (String '0' veya '1') İlgili ayarın Config'den gelen değeri.
    - $btk_service_data_error: (String) Eğer veri yüklenirken bir hata oluştuysa.
*}

{* TPL Dosyasının Sonu *}