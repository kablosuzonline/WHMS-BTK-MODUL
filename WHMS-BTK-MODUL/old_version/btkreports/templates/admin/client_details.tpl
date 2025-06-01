{* modules/addons/btkreports/templates/admin/client_details.tpl (v1.0.23) *}

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

<form method="post" action="{$modulelink}&action=saveClientBtkData" class="form-horizontal" role="form" id="btkClientDetailsForm">
    <input type="hidden" name="token" value="{$csrfToken}">
    <input type="hidden" name="client_id" value="{$client.id|default:$smarty.get.userid}">
    <input type="hidden" name="nvi_token_name" id="nviCsrfTokenNameClientTab" value="{$nviCsrfTokenName}">
    <input type="hidden" name="nvi_token_value" id="nviCsrfTokenValueClientTab" value="{$nviCsrfTokenValue}">
    <input type="hidden" name="yerlesim_adresi_id_hidden" value="{$btkClientData.yerlesim_adresi_id|default:''}">
    <input type="hidden" name="kurum_adresi_id_hidden" value="{$btkClientData.kurum_adresi_id|default:''}">

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-user-tag"></i> {$_ADDONLANG.btkreports_client_tab_title|default:'BTK Abone Bilgileri'} (WHMCS ID: {$client.id|default:$smarty.get.userid})</h3>
        </div>
        <div class="panel-body">

            {* Genel Abone Bilgileri *}
            <fieldset>
                <legend><i class="fas fa-info-circle"></i> {$_ADDONLANG.btkreports_general_info|default:'Genel Abone Bilgileri'}</legend>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="musteri_tipi_kodu_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_musteri_tipi_label} <span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <select name="musteri_tipi_kodu" id="musteri_tipi_kodu_client" class="form-control" required>
                                    <option value="">{$_ADDONLANG.btkreports_select_option}</option>
                                    {foreach from=$musteriTipleri item=tip}
                                        <option value="{$tip->musteri_tipi_kodu}" {if $btkClientData.musteri_tipi_kodu == $tip->musteri_tipi_kodu}selected{/if}>
                                            {$tip->deger_aciklama} ({$tip->musteri_tipi_kodu})
                                        </option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                         <div class="form-group">
                            <label for="abone_baslangic_tarihi_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_baslangic_tarihi_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_baslangic_tarihi" id="abone_baslangic_tarihi_client" class="form-control date-picker" value="{$btkClientData.abone_baslangic_tarihi|default:$client.datecreated|date_format:'%Y-%m-%d'}" placeholder="YYYY-AA-GG">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                         <div class="form-group">
                            <label for="abone_bitis_tarihi_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_bitis_tarihi_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_bitis_tarihi" id="abone_bitis_tarihi_client" class="form-control date-picker" value="{$btkClientData.abone_bitis_tarihi|escape:'html'}" placeholder="YYYY-AA-GG">
                            </div>
                        </div>
                         <div class="form-group">
                            <label for="abone_tarife_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_tarife_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_tarife" id="abone_tarife_client" class="form-control" value="{$btkClientData.abone_tarife|escape:'html'}">
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <hr>
            {* Kimlik/Kurum Bilgileri *}
            <fieldset>
                <legend><i class="fas fa-id-badge"></i> {$_ADDONLANG.btkreports_identification_info|default:'Kimlik/Kurum Bilgileri'}</legend>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="abone_tc_kimlik_no_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_tckn_label}</label>
                            <div class="col-sm-6">
                                <input type="text" name="abone_tc_kimlik_no" id="abone_tc_kimlik_no_client" class="form-control" value="{$btkClientData.abone_tc_kimlik_no|escape:'html'}" maxlength="11" pattern="\d{11}">
                            </div>
                            <div class="col-sm-2">
                                <button type="button" id="btnNviTcknDogrulaClientTab" class="btn btn-xs btn-info" data-loading-text="<i class='fas fa-spinner fa-spin'></i>">{$_ADDONLANG.btkreports_client_nvi_tckn_label|default:'NVI TCKN Doğrula'}</button>
                            </div>
                        </div>
                        <div id="nviTcknDogrulamaSonucClientTab" class="form-group" style="margin-bottom:10px; display:none;">
                            <div class="col-sm-offset-4 col-sm-8">
                                <span class="nvi-status"></span>
                            </div>
                        </div>
                        {* Ad, Soyad, Doğum Yılı NVI için - WHMCS'ten gelenlerle karşılaştırılabilir veya manuel girilebilir. *}
                        {* Gizli alanlar veya sadece NVI için görünür alanlar eklenebilir. *}
                        <input type="hidden" id="client_firstname_for_nvi" value="{$client.firstname|escape:'html'}">
                        <input type="hidden" id="client_lastname_for_nvi" value="{$client.lastname|escape:'html'}">
                        <input type="hidden" id="client_birthyear_for_nvi" value="{if $btkClientData.abone_dogum_tarihi}{$btkClientData.abone_dogum_tarihi|date_format:'%Y'}{/if}">


                         <div class="form-group">
                            <label for="abone_pasaport_no_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_ykn_label}</label>
                            <div class="col-sm-6">
                                <input type="text" name="abone_pasaport_no" id="abone_pasaport_no_client" class="form-control" value="{$btkClientData.abone_pasaport_no|escape:'html'}" placeholder="{$_ADDONLANG.btkreports_ykn_pasaport_placeholder|default:'Yabancı Kimlik No / Pasaport No'}">
                            </div>
                             {* YKN NVI doğrulama butonu eklenebilir *}
                        </div>
                    </div>
                    <div class="col-md-6">
                         <div class="form-group">
                            <label for="abone_unvan_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_unvan_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_unvan" id="abone_unvan_client" class="form-control" value="{$btkClientData.abone_unvan|default:$client.companyname|escape:'html'}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="abone_vergi_numarasi_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_vergi_no_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_vergi_numarasi" id="abone_vergi_numarasi_client" class="form-control" value="{$btkClientData.abone_vergi_numarasi|default:$client.tax_id|escape:'html'}" maxlength="10">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="abone_mersis_numarasi_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_mersis_no_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_mersis_numarasi" id="abone_mersis_numarasi_client" class="form-control" value="{$btkClientData.abone_mersis_numarasi|escape:'html'}" maxlength="16">
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <hr>
            {* Bireysel Detaylar *}
            <fieldset>
                <legend><i class="fas fa-user-circle"></i> {$_ADDONLANG.btkreports_personal_details|default:'Bireysel Detaylar'}</legend>
                 <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="abone_cinsiyet_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_cinsiyet_label}</label>
                            <div class="col-sm-8">
                                <select name="abone_cinsiyet" id="abone_cinsiyet_client" class="form-control">
                                    <option value="">{$_ADDONLANG.btkreports_select_option}</option>
                                    <option value="E" {if $btkClientData.abone_cinsiyet == 'E'}selected{/if}>{$_ADDONLANG.btkreports_abone_cinsiyet_erkek}</option>
                                    <option value="K" {if $btkClientData.abone_cinsiyet == 'K'}selected{/if}>{$_ADDONLANG.btkreports_abone_cinsiyet_kadin}</option>
                                    <option value="D" {if $btkClientData.abone_cinsiyet == 'D'}selected{/if}>{$_ADDONLANG.btkreports_abone_cinsiyet_diger}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="abone_uyruk_iso_kodu_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_uyruk_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_uyruk_iso_kodu" id="abone_uyruk_iso_kodu_client" class="form-control" value="{$btkClientData.abone_uyruk_iso_kodu|default:$client.country|escape:'html'}" maxlength="2" placeholder="TR, DE, US vb.">
                            </div>
                        </div>
                         <div class="form-group">
                            <label for="abone_dogum_yeri_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_dogum_yeri_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_dogum_yeri" id="abone_dogum_yeri_client" class="form-control" value="{$btkClientData.abone_dogum_yeri|escape:'html'}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="abone_dogum_tarihi_client_form" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_dogum_tarihi_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_dogum_tarihi" id="abone_dogum_tarihi_client_form" class="form-control date-picker" value="{$btkClientData.abone_dogum_tarihi|escape:'html'}" placeholder="YYYY-AA-GG">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="abone_baba_adi_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_baba_adi_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_baba_adi" id="abone_baba_adi_client" class="form-control" value="{$btkClientData.abone_baba_adi|escape:'html'}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="abone_ana_adi_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_ana_adi_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_ana_adi" id="abone_ana_adi_client" class="form-control" value="{$btkClientData.abone_ana_adi|escape:'html'}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="abone_anne_kizlik_soyadi_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_anne_kizlik_soyadi_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_anne_kizlik_soyadi" id="abone_anne_kizlik_soyadi_client" class="form-control" value="{$btkClientData.abone_anne_kizlik_soyadi|escape:'html'}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="abone_meslek_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_meslek_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_meslek" id="abone_meslek_client" class="form-control" value="{$btkClientData.abone_meslek|escape:'html'}">
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <hr>

            {* Kimlik Detayları (NVI) *}
            <fieldset>
                <legend><i class="fas fa-address-card"></i> {$_ADDONLANG.btkreports_abone_kimlik_bilgileri_title}</legend>
                 <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="abone_kimlik_tipi_kodu_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_kimlik_tipi_label}</label>
                            <div class="col-sm-8">
                                <select name="abone_kimlik_tipi_kodu" id="abone_kimlik_tipi_kodu_client" class="form-control">
                                    <option value="">{$_ADDONLANG.btkreports_select_option}</option>
                                    {foreach from=$kimlikTipleri item=tip}
                                        <option value="{$tip->kimlik_tipi_kodu}" {if $btkClientData.abone_kimlik_tipi_kodu == $tip->kimlik_tipi_kodu}selected{/if}>
                                            {$tip->deger_aciklama} ({$tip->kimlik_tipi_kodu})
                                        </option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="abone_kimlik_seri_no_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_kimlik_seri_no_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_kimlik_seri_no" id="abone_kimlik_seri_no_client" class="form-control" value="{$btkClientData.abone_kimlik_seri_no|escape:'html'}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="abone_kimlik_verildigi_yer_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_kimlik_verildigi_yer_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_kimlik_verildigi_yer" id="abone_kimlik_verildigi_yer_client" class="form-control" value="{$btkClientData.abone_kimlik_verildigi_yer|escape:'html'}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="abone_kimlik_verildigi_tarih_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_kimlik_verildigi_tarih_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_kimlik_verildigi_tarih" id="abone_kimlik_verildigi_tarih_client" class="form-control date-picker" value="{$btkClientData.abone_kimlik_verildigi_tarih|escape:'html'}" placeholder="YYYY-AA-GG">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="abone_kimlik_aidiyeti_kodu_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_kimlik_aidiyeti_label}</label>
                            <div class="col-sm-8">
                                <select name="abone_kimlik_aidiyeti_kodu" id="abone_kimlik_aidiyeti_kodu_client" class="form-control">
                                    <option value="">{$_ADDONLANG.btkreports_select_option}</option>
                                    {foreach from=$kimlikAidiyetleri item=tip}
                                        <option value="{$tip->kimlik_aidiyeti_kodu}" {if $btkClientData.abone_kimlik_aidiyeti_kodu == $tip->kimlik_aidiyeti_kodu}selected{/if}>
                                            {$tip->deger_aciklama} ({$tip->kimlik_aidiyeti_kodu})
                                        </option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="abone_kimlik_cilt_no_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_kimlik_cilt_no_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_kimlik_cilt_no" id="abone_kimlik_cilt_no_client" class="form-control" value="{$btkClientData.abone_kimlik_cilt_no|escape:'html'}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="abone_kimlik_kutuk_no_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_kimlik_kutuk_no_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_kimlik_kutuk_no" id="abone_kimlik_kutuk_no_client" class="form-control" value="{$btkClientData.abone_kimlik_kutuk_no|escape:'html'}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="abone_kimlik_sayfa_no_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_kimlik_sayfa_no_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="abone_kimlik_sayfa_no" id="abone_kimlik_sayfa_no_client" class="form-control" value="{$btkClientData.abone_kimlik_sayfa_no|escape:'html'}">
                            </div>
                        </div>
                    </div>
                 </div>
                 <div class="row">
                     <div class="col-md-6">
                        <div class="form-group">
                            <label for="abone_kimlik_il_id_client_form" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_kimlik_nvi_il_label}</label>
                            <div class="col-sm-8">
                                <select name="abone_kimlik_il_id" id="abone_kimlik_il_id_client_form" class="form-control" data-initial="{$btkClientData.abone_kimlik_il_id|default:''}">
                                    <option value="">{$_ADDONLANG.btkreports_select_option}</option>
                                    {foreach from=$iller item=il}
                                        <option value="{$il->id}" {if $btkClientData.abone_kimlik_il_id == $il->id}selected{/if}>{$il->il_adi}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="form-group">
                            <label for="abone_kimlik_ilce_id_client_form" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_abone_kimlik_nvi_ilce_label}</label>
                            <div class="col-sm-8">
                                <select name="abone_kimlik_ilce_id" id="abone_kimlik_ilce_id_client_form" class="form-control" data-initial="{$btkClientData.abone_kimlik_ilce_id|default:''}" {if !$btkClientData.abone_kimlik_il_id}disabled{/if}>
                                    <option value="">{$_ADDONLANG.btkreports_select_option_ilce}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                     <div class="col-md-12">
                        <div class="form-group">
                            <label for="abone_kimlik_mahalle_koy_client" class="col-sm-2 control-label">{$_ADDONLANG.btkreports_abone_kimlik_mahalle_koy_label}</label>
                            <div class="col-sm-10">
                                <input type="text" name="abone_kimlik_mahalle_koy" id="abone_kimlik_mahalle_koy_client" class="form-control" value="{$btkClientData.abone_kimlik_mahalle_koy|escape:'html'}">
                            </div>
                        </div>
                     </div>
                 </div>
            </fieldset>
            <hr>

            {* Yerleşim Adresi *}
            <fieldset class="address-block">
                <legend><i class="fas fa-map-marker-alt"></i> {$_ADDONLANG.btkreports_yerlesim_adresi_title}</legend>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="yerlesim_il_id_client_form" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_il_label} <span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <select name="yerlesim_il_id" id="yerlesim_il_id_client_form" class="form-control" data-initial="{$yerlesimAdresi->il_id|default:''}" required>
                                    <option value="">{$_ADDONLANG.btkreports_select_option}</option>
                                    {foreach from=$iller item=il}
                                        <option value="{$il->id}" {if $yerlesimAdresi && $yerlesimAdresi->il_id == $il->id}selected{/if}>{$il->il_adi}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="yerlesim_ilce_id_client_form" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_ilce_label} <span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <select name="yerlesim_ilce_id" id="yerlesim_ilce_id_client_form" class="form-control" data-initial="{$yerlesimAdresi->ilce_id|default:''}" {if !($yerlesimAdresi && $yerlesimAdresi->il_id)}disabled{/if} required>
                                    <option value="">{$_ADDONLANG.btkreports_select_option_ilce}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="yerlesim_mahalle_id_client_form" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_mahalle_label}</label>
                            <div class="col-sm-8">
                                <select name="yerlesim_mahalle_id" id="yerlesim_mahalle_id_client_form" class="form-control" data-initial="{$yerlesimAdresi->mahalle_id|default:''}" {if !($yerlesimAdresi && $yerlesimAdresi->ilce_id)}disabled{/if}>
                                    <option value="">{$_ADDONLANG.btkreports_select_option_mahalle}</option>
                                </select>
                            </div>
                        </div>
                         <div class="form-group">
                            <label for="yerlesim_posta_kodu_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_posta_kodu_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="yerlesim_posta_kodu" id="yerlesim_posta_kodu_client" class="form-control" value="{$yerlesimAdresi->posta_kodu|default:$client.postcode|escape:'html'}">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="yerlesim_csbm_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_csbm_label} <span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <input type="text" name="yerlesim_csbm" id="yerlesim_csbm_client" class="form-control" value="{$yerlesimAdresi->csbm|default:$client.address1|escape:'html'}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="yerlesim_site_bina_adi_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_site_bina_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="yerlesim_site_bina_adi" id="yerlesim_site_bina_adi_client" class="form-control" value="{$yerlesimAdresi->site_bina_adi|escape:'html'}">
                            </div>
                        </div>
                         <div class="form-group">
                            <label for="yerlesim_dis_kapi_no_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_dis_kapi_label} <span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <input type="text" name="yerlesim_dis_kapi_no" id="yerlesim_dis_kapi_no_client" class="form-control" value="{$yerlesimAdresi->dis_kapi_no|escape:'html'}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="yerlesim_ic_kapi_no_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_ic_kapi_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="yerlesim_ic_kapi_no" id="yerlesim_ic_kapi_no_client" class="form-control" value="{$yerlesimAdresi->ic_kapi_no|escape:'html'}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="yerlesim_adres_kodu_uavt_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_uavt_kodu_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="yerlesim_adres_kodu_uavt" id="yerlesim_adres_kodu_uavt_client" class="form-control" value="{$yerlesimAdresi->adres_kodu_uavt|escape:'html'}">
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <hr>
            
            {* İrtibat Bilgileri *}
             <fieldset>
                <legend><i class="fas fa-phone-alt"></i> {$_ADDONLANG.btkreports_irtibat_bilgileri_title}</legend>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="irtibat_tel_no_1_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_irtibat_tel1_label} <span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <input type="text" name="irtibat_tel_no_1" id="irtibat_tel_no_1_client" class="form-control" value="{$btkClientData.irtibat_tel_no_1|default:$client.phonenumber|escape:'html'}" required>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="irtibat_tel_no_2_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_irtibat_tel2_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="irtibat_tel_no_2" id="irtibat_tel_no_2_client" class="form-control" value="{$btkClientData.irtibat_tel_no_2|escape:'html'}">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="irtibat_email_client" class="col-sm-2 control-label">{$_ADDONLANG.btkreports_irtibat_email_label} <span class="text-danger">*</span></label>
                    <div class="col-sm-10">
                        <input type="email" name="irtibat_email" id="irtibat_email_client" class="form-control" value="{$btkClientData.irtibat_email|default:$client.email|escape:'html'}" required>
                    </div>
                </div>
            </fieldset>
            <hr>

            {* Kurum Yetkilisi ve Adresi (Kurumsal ise) *}
             <fieldset>
                <legend><i class="fas fa-user-tie"></i> {$_ADDONLANG.btkreports_kurum_yetkilisi_title}</legend>
                 <div class="row">
                    <div class="col-md-6">
                        <p class="col-sm-offset-1 col-sm-11 help-block">({$_ADDONLANG.btkreports_if_corporate_fill|default:'Sadece müşteri tipi kurumsal ise doldurulması önerilir.'})</p>
                         <div class="form-group">
                            <label for="kurum_yetkili_adi_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_kurum_yetkili_ad_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="kurum_yetkili_adi" id="kurum_yetkili_adi_client" class="form-control" value="{$btkClientData.kurum_yetkili_adi|escape:'html'}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="kurum_yetkili_soyadi_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_kurum_yetkili_soyad_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="kurum_yetkili_soyadi" id="kurum_yetkili_soyadi_client" class="form-control" value="{$btkClientData.kurum_yetkili_soyadi|escape:'html'}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="kurum_yetkili_tckimlik_no_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_kurum_yetkili_tckn_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="kurum_yetkili_tckimlik_no" id="kurum_yetkili_tckimlik_no_client" class="form-control" value="{$btkClientData.kurum_yetkili_tckimlik_no|escape:'html'}" maxlength="11" pattern="\d{11}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="kurum_yetkili_telefon_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_kurum_yetkili_tel_label}</label>
                            <div class="col-sm-8">
                                <input type="text" name="kurum_yetkili_telefon" id="kurum_yetkili_telefon_client" class="form-control" value="{$btkClientData.kurum_yetkili_telefon|escape:'html'}">
                            </div>
                        </div>
                    </div>
                     <div class="col-md-6">
                        <fieldset class="address-block">
                            <legend><i class="fas fa-map-marked-alt"></i> {$_ADDONLANG.btkreports_kurum_adresi_title}</legend>
                            <div class="form-group">
                                <label for="kurum_il_id_client_form" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_il_label}</label>
                                <div class="col-sm-8">
                                    <select name="kurum_il_id" id="kurum_il_id_client_form" class="form-control" data-initial="{$kurumAdresi->il_id|default:''}">
                                        <option value="">{$_ADDONLANG.btkreports_select_option}</option>
                                        {foreach from=$iller item=il}
                                            <option value="{$il->id}" {if $kurumAdresi && $kurumAdresi->il_id == $il->id}selected{/if}>{$il->il_adi}</option>
                                        {/foreach}
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="kurum_ilce_id_client_form" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_ilce_label}</label>
                                <div class="col-sm-8">
                                    <select name="kurum_ilce_id" id="kurum_ilce_id_client_form" class="form-control" data-initial="{$kurumAdresi->ilce_id|default:''}" {if !($kurumAdresi && $kurumAdresi->il_id)}disabled{/if}>
                                        <option value="">{$_ADDONLANG.btkreports_select_option_ilce}</option>
                                    </select>
                                </div>
                            </div>
                            {* ... Kurum Adresi için Mahalle, CSBM, Dış Kapı vb. ... *}
                             <div class="form-group">
                                <label for="kurum_csbm_client" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_adres_csbm_label}</label>
                                <div class="col-sm-8">
                                    <input type="text" name="kurum_csbm" id="kurum_csbm_client" class="form-control" value="{$kurumAdresi->csbm|escape:'html'}">
                                </div>
                            </div>
                        </fieldset>
                     </div>
                </div>
            </fieldset>

            <div class="form-group text-center" style="margin-top:25px;">
                <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$_ADDONLANG.btkreports_save_btk_data}</button>
            </div>
        </div>
    </div>
</form>

<script type="text/javascript">
$(document).ready(function() {
    // Bu TPL'e özel global JS değişkenlerini tanımla
    // btkModuleLink ve btkCsrfToken zaten ana sayfa (index.tpl) üzerinden veya
    // btkreports_AdminAreaHeadOutput hook'u ile yüklenmiş olmalı.
    // Eğer btk_admin_scripts.js ayrı bir dosyaysa ve bu değişkenlere ihtiyacı varsa,
    // burada window objesine atanabilir veya data attribute'lar ile okunabilir.

    // Adres dropdown'larını başlat (btk_admin_scripts.js'deki fonksiyonları çağırır)
    if (typeof initializeAddressDropdowns === "function") {
        initializeAddressDropdowns('yerlesim_client_form'); 
        initializeAddressDropdowns('kurum_client_form');
        initializeAddressDropdowns('abone_kimlik_client_form', false); // Kimlik için mahalle yok
    } else {
        console.error("initializeAddressDropdowns fonksiyonu bulunamadı. btk_admin_scripts.js doğru yüklendi mi ve btkModuleLink/btkCsrfToken global değişkenleri tanımlı mı?");
    }

    // NVI TCKN Doğrulama
    $('#btnNviTcknDogrulaClientTab').off('click').on('click', function() {
        var btn = $(this);
        var statusDiv = $('#nviTcknDogrulamaSonucClientTab'); // ID'yi benzersiz yap
        btn.button('loading');
        statusDiv.html('').removeClass('alert alert-success alert-danger alert-warning').hide();

        var tckn = $('#abone_tc_kimlik_no_client').val();
        // Ad, Soyad ve Doğum Yılı müşteri panelindeki WHMCS standart alanlarından alınabilir
        // Veya bu forma NVI için ayrı inputlar eklenebilir (şu an WHMCS'ten alınıyor)
        var ad = "{strtoupper($client.firstname|escape:'javascript')}"; 
        var soyad = "{strtoupper($client.lastname|escape:'javascript')}"; 
        var dogumTarihiFull = $('#abone_dogum_tarihi_client_form').val();
        var dogumYili = dogumTarihiFull ? dogumTarihiFull.substring(0,4) : '';

        if (!tckn || !ad || !soyad || !dogumYili) {
            statusDiv.html('<i class="fas fa-times-circle"></i> ' + (btkLang.client_nvi_error_fill_fields_tckn || 'TCKN Doğrulaması için TCKN, Ad, Soyad ve Doğum Yılı alanları gereklidir.')).addClass('alert alert-warning').show();
            btn.button('reset');
            return;
        }

        $.ajax({
            url: btkModuleLink, 
            type: "POST",
            data: {
                action: "nviTcknDogrula",
                token: btkCsrfToken,
                nvi_token_name: $('#nviCsrfTokenNameClientTab').val(),
                nvi_token_value: $('#nviCsrfTokenValueClientTab').val(),
                client_id: $('input[name="client_id"]').val(),
                tckn: tckn,
                ad: ad,
                soyad: soyad,
                dogum_yili: dogumYili
            },
            dataType: "json",
            success: function(response) {
                if (response && response.message) {
                    if (response.success) {
                        statusDiv.html('<i class="fas fa-check-circle"></i> ' + response.message).addClass('alert alert-success').show();
                    } else {
                        statusDiv.html('<i class="fas fa-times-circle"></i> ' + response.message).addClass('alert alert-danger').show();
                    }
                } else {
                     statusDiv.html('<i class="fas fa-exclamation-triangle"></i> ' + (btkLang.error_unknown || 'Bilinmeyen bir NVI yanıtı alındı.')).addClass('alert alert-warning').show();
                }
            },
            error: function() {
                statusDiv.html('<i class="fas fa-exclamation-triangle"></i> ' + (btkLang.error_server_nvi || 'NVI TCKN doğrulama sırasında bir sunucu hatası oluştu.')).addClass('alert alert-danger').show();
            },
            complete: function() {
                btn.button('reset');
            }
        });
    });

     // Tarih alanları için datepicker
    if (typeof $.fn.datepicker === 'function') {
        $('#btkClientDetailsForm .date-picker').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            yearRange: "-100:+10"
        });
    }
     // Sayısal alanlar için sadece sayı girişi
    $('#abone_tc_kimlik_no_client, #kurum_yetkili_tckimlik_no, #abone_vergi_numarasi, #abone_mersis_numarasi, #abone_kimlik_cilt_no, #abone_kimlik_kutuk_no, #abone_kimlik_sayfa_no, #irtibat_tel_no_1, #irtibat_tel_no_2, #kurum_yetkili_telefon, #yerlesim_posta_kodu_client, #kurum_posta_kodu_client').on('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});
</script>