{* WHMCS BTK Raporları Modülü - Müşteri Profili BTK Bilgileri Formu *}
{* Bu şablon, AdminAreaClientSummaryPageOutput veya ClientProfileTabFields hook'u ile müşteri profili sayfasına enjekte edilir. *}

{include file="./shared/alert_messages.tpl" flash_message_key="btk_client_flash_message"}
{* Flash mesajları için özel bir session key kullanılabilir, ana sayfa mesajlarıyla karışmaması için *}
{* Alternatif olarak, bu TPL'de flash mesaj gösterimi hiç olmayabilir, çünkü genellikle bir POST sonrası yönlendirme ile ana sayfaya dönülür. *}
{* Şimdilik, eğer bu form kendi kendine POST ediliyorsa diye bırakıyorum. *}


{if $btk_client_data_error}
    <div class="alert alert-danger text-center">
        {$btk_client_data_error}
    </div>
{/if}

{* Formun başlangıcı, action URL'si hook implementasyonuna göre ayarlanacak. *}
{* Bu örnekte, ana modül linkine POST ediliyor ve action ile hangi işlemi yapacağı belirtiliyor. *}
<form method="post" action="{$modulelink}&action=saveclientbtkdata" class="form-horizontal" id="clientBtkFormAdmin">
    <input type="hidden" name="token" value="{$csrfToken}" />
    <input type="hidden" name="userid" value="{$userid}" /> {* WHMCS Müşteri ID'si *}
    <input type="hidden" name="rehber_id" value="{$btk_data.id|default:0}" /> {* mod_btk_abone_rehber ID'si (varsa) *}

    <div class="panel panel-default btk-panel-no-margin btk-profile-injection-panel">
        <div class="panel-heading">
            <h3 class="panel-title">{$LANG.btk_form_section_title} - {$LANG.btk_address_residential_title}</h3>
        </div>
        <div class="panel-body">
            {* Müşteri Tipi *}
            <div class="form-group">
                <label class="col-sm-3 control-label">{$LANG.MUSTERI_TIPI}</label>
                <div class="col-sm-8">
                    <select name="MUSTERI_TIPI" id="client_MUSTERI_TIPI" class="form-control select-select2-basic">
                        {foreach from=$ref_musteri_tipleri item=tip}
                            <option value="{$tip->kod}" {if $btk_data.MUSTERI_TIPI == $tip->kod}selected{/if}>
                                {$tip->aciklama|escape:'html'} ({$tip->kod})
                            </option>
                        {/foreach}
                    </select>
                    <small class="text-muted">({$LANG.btk_musteri_tipi_auto_detect_info|default:'Müşterinin şirket adı olup olmamasına göre otomatik olarak belirlenir, gerekirse buradan güncelleyebilirsiniz.'})</small>
                </div>
            </div>

            {* Bireysel Abone Bilgileri Bölümü *}
            <div id="bireyselClientFields" {if $btk_data.MUSTERI_TIPI == 'G' || $btk_data.MUSTERI_TIPI == 'K' || $btk_data.MUSTERI_TIPI == 'D'}style="display:none;"{/if}>
                <div class="form-group">
                    <label for="client_ABONE_TC_KIMLIK_NO" class="col-sm-3 control-label">{$LANG.ABONE_TC_KIMLIK_NO} *</label>
                    <div class="col-sm-4">
                        <input type="text" name="ABONE_TC_KIMLIK_NO" id="client_ABONE_TC_KIMLIK_NO" value="{$btk_data.ABONE_TC_KIMLIK_NO|escape:'html'}" class="form-control" maxlength="11">
                    </div>
                    <div class="col-sm-4" id="tcknClientValidationResultAdmin" style="padding-top: 7px;">
                        {* NVI Doğrulama sonucu buraya AJAX ile gelebilir *}
                    </div>
                </div>
                <div class="form-group">
                    <label for="client_ABONE_ADI" class="col-sm-3 control-label">{$LANG.ABONE_ADI} *</label>
                    <div class="col-sm-8">
                        <input type="text" name="ABONE_ADI" id="client_ABONE_ADI" value="{$btk_data.ABONE_ADI|default:$clientdetails.firstname|escape:'html'}" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="client_ABONE_SOYADI" class="col-sm-3 control-label">{$LANG.ABONE_SOYADI} *</label>
                    <div class="col-sm-8">
                        <input type="text" name="ABONE_SOYADI" id="client_ABONE_SOYADI" value="{$btk_data.ABONE_SOYADI|default:$clientdetails.lastname|escape:'html'}" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="client_ABONE_CINSIYET" class="col-sm-3 control-label">{$LANG.ABONE_CINSIYET}</label>
                    <div class="col-sm-4">
                        <select name="ABONE_CINSIYET" id="client_ABONE_CINSIYET" class="form-control select-select2-basic">
                            <option value="">-- {$LANG.please_select} --</option>
                            {foreach from=$ref_cinsiyet item=cinsiyet}
                                <option value="{$cinsiyet->kod}" {if $btk_data.ABONE_CINSIYET == $cinsiyet->kod}selected{/if}>{$cinsiyet->aciklama|escape:'html'}</option>
                            {/foreach}
                        </select>
                    </div>
                </div>
                 <div class="form-group">
                    <label for="client_ABONE_ANNE_KIZLIK_SOYADI" class="col-sm-3 control-label">{$LANG.btk_mother_maiden_name}</label>
                    <div class="col-sm-8">
                        <input type="text" name="ABONE_ANNE_KIZLIK_SOYADI" id="client_ABONE_ANNE_KIZLIK_SOYADI" value="{$btk_data.ABONE_ANNE_KIZLIK_SOYADI|escape:'html'}" class="form-control">
                    </div>
                </div>
            </div>

            {* Kurumsal Abone Bilgileri Bölümü *}
            <div id="kurumsalClientFields" {if $btk_data.MUSTERI_TIPI != 'G' && $btk_data.MUSTERI_TIPI != 'K' && $btk_data.MUSTERI_TIPI != 'D'}style="display:none;"{/if}>
                <div class="form-group">
                    <label for="client_ABONE_UNVAN" class="col-sm-3 control-label">{$LANG.ABONE_UNVAN} *</label>
                    <div class="col-sm-8">
                        <input type="text" name="ABONE_UNVAN" id="client_ABONE_UNVAN" value="{$btk_data.ABONE_UNVAN|default:$clientdetails.companyname|escape:'html'}" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="client_ABONE_VERGI_NUMARASI" class="col-sm-3 control-label">{$LANG.ABONE_VERGI_NUMARASI}</label>
                    <div class="col-sm-4">
                        <input type="text" name="ABONE_VERGI_NUMARASI" id="client_ABONE_VERGI_NUMARASI" value="{$btk_data.ABONE_VERGI_NUMARASI|default:$clientdetails.tax_id|escape:'html'}" class="form-control" maxlength="10">
                    </div>
                </div>
                <div class="form-group">
                    <label for="client_ABONE_MERSIS_NUMARASI" class="col-sm-3 control-label">{$LANG.ABONE_MERSIS_NUMARASI}</label>
                    <div class="col-sm-4">
                        <input type="text" name="ABONE_MERSIS_NUMARASI" id="client_ABONE_MERSIS_NUMARASI" value="{$btk_data.ABONE_MERSIS_NUMARASI|escape:'html'}" class="form-control" maxlength="16">
                    </div>
                </div>
            </div>

            {* Ortak Alanlar *}
            <div class="form-group">
                <label for="client_ABONE_UYRUK" class="col-sm-3 control-label">{$LANG.ABONE_UYRUK} *</label>
                <div class="col-sm-5">
                    <select name="ABONE_UYRUK" id="client_ABONE_UYRUK" class="form-control select-select2">
                        <option value="">-- {$LANG.btk_select_nationality} --</option>
                        {foreach from=$ref_ulkeler item=ulke}
                            <option value="{$ulke->iso_kodu}" {if $btk_data.ABONE_UYRUK == $ulke->iso_kodu || (!$btk_data.ABONE_UYRUK && $ulke->iso_kodu == 'TUR')}selected{/if}>
                                {$ulke->ulke_adi_tr|escape:'html'} ({$ulke->iso_kodu|escape:'html'})
                            </option>
                        {/foreach}
                    </select>
                </div>
            </div>
            
            <div class="form-group" id="clientPasaportNoDiv" {if $btk_data.ABONE_UYRUK == 'TUR' || !$btk_data.ABONE_UYRUK}style="display:none;"{/if}>
                <label for="client_ABONE_PASAPORT_NO" class="col-sm-3 control-label">{$LANG.ABONE_PASAPORT_NO}</label>
                <div class="col-sm-4">
                    <input type="text" name="ABONE_PASAPORT_NO" id="client_ABONE_PASAPORT_NO" value="{$btk_data.ABONE_PASAPORT_NO|escape:'html'}" class="form-control">
                </div>
                 <div class="col-sm-4" id="yknClientValidationResultAdmin" style="padding-top: 7px;">
                    {* YKN Doğrulama sonucu buraya AJAX ile gelebilir *}
                </div>
            </div>

            <div class="form-group">
                <label for="client_ABONE_BABA_ADI" class="col-sm-3 control-label">{$LANG.btk_father_name}</label>
                <div class="col-sm-8">
                    <input type="text" name="ABONE_BABA_ADI" id="client_ABONE_BABA_ADI" value="{$btk_data.ABONE_BABA_ADI|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_ANA_ADI" class="col-sm-3 control-label">{$LANG.btk_mother_name}</label>
                <div class="col-sm-8">
                    <input type="text" name="ABONE_ANA_ADI" id="client_ABONE_ANA_ADI" value="{$btk_data.ABONE_ANA_ADI|escape:'html'}" class="form-control">
                </div>
            </div>
            
            <div class="form-group">
                <label for="client_ABONE_DOGUM_YERI" class="col-sm-3 control-label">{$LANG.btk_birth_place}</label>
                <div class="col-sm-5">
                    <input type="text" name="ABONE_DOGUM_YERI" id="client_ABONE_DOGUM_YERI" value="{$btk_data.ABONE_DOGUM_YERI|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_DOGUM_TARIHI" class="col-sm-3 control-label">{$LANG.btk_birth_date} *</label>
                <div class="col-sm-3">
                    <input type="text" name="ABONE_DOGUM_TARIHI" id="client_ABONE_DOGUM_TARIHI" value="{$btk_data.ABONE_DOGUM_TARIHI|date_format:'%Y-%m-%d'}" class="form-control date-picker" placeholder="YYYY-AA-GG">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_MESLEK" class="col-sm-3 control-label">{$LANG.btk_profession_code}</label>
                <div class="col-sm-5">
                    <select name="ABONE_MESLEK" id="client_ABONE_MESLEK" class="form-control select-select2">
                        <option value="">-- {$LANG.btk_select_profession} --</option>
                        {foreach from=$ref_meslek_kodlari item=meslek}
                            <option value="{$meslek->kod}" {if $btk_data.ABONE_MESLEK == $meslek->kod}selected{/if}>
                                {$meslek->aciklama|escape:'html'} ({$meslek->kod|escape:'html'})
                            </option>
                        {/foreach}
                    </select>
                </div>
            </div>

{* Müşteri Profili BTK Bilgileri Formu - Kimlik, Adres ve İletişim Bilgileri - Devam *}

            <hr>
            <h4><i class="fas fa-address-card icon-spacer"></i>{$LANG.ABONE_KIMLIK_BILGILERI}</h4>

            <div class="form-group">
                <label for="client_ABONE_KIMLIK_TIPI" class="col-sm-3 control-label">{$LANG.btk_id_card_type}</label>
                <div class="col-sm-5">
                    <select name="ABONE_KIMLIK_TIPI" id="client_ABONE_KIMLIK_TIPI" class="form-control select-select2-basic">
                        <option value="">-- {$LANG.btk_select_id_card_type} --</option>
                        {foreach from=$ref_kimlik_tipleri item=kimliktipi}
                            <option value="{$kimliktipi->kod}" {if $btk_data.ABONE_KIMLIK_TIPI == $kimliktipi->kod}selected{/if}>{$kimliktipi->aciklama|escape:'html'}</option>
                        {/foreach}
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_KIMLIK_SERI_NO" class="col-sm-3 control-label">{$LANG.btk_id_card_serial_no}</label>
                <div class="col-sm-4">
                    <input type="text" name="ABONE_KIMLIK_SERI_NO" id="client_ABONE_KIMLIK_SERI_NO" value="{$btk_data.ABONE_KIMLIK_SERI_NO|escape:'html'}" class="form-control">
                </div>
            </div>
             <div class="form-group">
                <label for="client_ABONE_KIMLIK_CILT_NO" class="col-sm-3 control-label">{$LANG.btk_id_card_volume_no}</label>
                <div class="col-sm-3">
                    <input type="text" name="ABONE_KIMLIK_CILT_NO" id="client_ABONE_KIMLIK_CILT_NO" value="{$btk_data.ABONE_KIMLIK_CILT_NO|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_KIMLIK_KUTUK_NO" class="col-sm-3 control-label">{$LANG.btk_id_card_family_serial_no}</label>
                <div class="col-sm-3">
                    <input type="text" name="ABONE_KIMLIK_KUTUK_NO" id="client_ABONE_KIMLIK_KUTUK_NO" value="{$btk_data.ABONE_KIMLIK_KUTUK_NO|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_KIMLIK_SAYFA_NO" class="col-sm-3 control-label">{$LANG.btk_id_card_sequence_no}</label>
                <div class="col-sm-3">
                    <input type="text" name="ABONE_KIMLIK_SAYFA_NO" id="client_ABONE_KIMLIK_SAYFA_NO" value="{$btk_data.ABONE_KIMLIK_SAYFA_NO|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_KIMLIK_IL" class="col-sm-3 control-label">{$LANG.btk_id_card_province}</label>
                <div class="col-sm-5">
                    <input type="text" name="ABONE_KIMLIK_IL" id="client_ABONE_KIMLIK_IL" value="{$btk_data.ABONE_KIMLIK_IL|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_KIMLIK_ILCE" class="col-sm-3 control-label">{$LANG.btk_id_card_district}</label>
                <div class="col-sm-5">
                    <input type="text" name="ABONE_KIMLIK_ILCE" id="client_ABONE_KIMLIK_ILCE" value="{$btk_data.ABONE_KIMLIK_ILCE|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_KIMLIK_MAHALLE_KOY" class="col-sm-3 control-label">{$LANG.btk_id_card_village}</label>
                <div class="col-sm-5">
                    <input type="text" name="ABONE_KIMLIK_MAHALLE_KOY" id="client_ABONE_KIMLIK_MAHALLE_KOY" value="{$btk_data.ABONE_KIMLIK_MAHALLE_KOY|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_KIMLIK_VERILDIGI_YER" class="col-sm-3 control-label">{$LANG.btk_id_card_issue_place}</label>
                <div class="col-sm-5">
                    <input type="text" name="ABONE_KIMLIK_VERILDIGI_YER" id="client_ABONE_KIMLIK_VERILDIGI_YER" value="{$btk_data.ABONE_KIMLIK_VERILDIGI_YER|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_KIMLIK_VERILDIGI_TARIH" class="col-sm-3 control-label">{$LANG.btk_id_card_issue_date}</label>
                <div class="col-sm-3">
                    <input type="text" name="ABONE_KIMLIK_VERILDIGI_TARIH" id="client_ABONE_KIMLIK_VERILDIGI_TARIH" value="{$btk_data.ABONE_KIMLIK_VERILDIGI_TARIH|date_format:'%Y-%m-%d'}" class="form-control date-picker" placeholder="YYYY-AA-GG">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_KIMLIK_AIDIYETI" class="col-sm-3 control-label">{$LANG.btk_id_card_owner_relation}</label>
                <div class="col-sm-5">
                    <select name="ABONE_KIMLIK_AIDIYETI" id="client_ABONE_KIMLIK_AIDIYETI" class="form-control select-select2-basic">
                        <option value="">-- {$LANG.btk_select_id_card_owner_relation} --</option>
                        {foreach from=$ref_kimlik_aidiyeti item=aidiyet}
                            <option value="{$aidiyet->kod}" {if $btk_data.ABONE_KIMLIK_AIDIYETI == $aidiyet->kod}selected{/if}>{$aidiyet->aciklama|escape:'html'}</option>
                        {/foreach}
                    </select>
                </div>
            </div>
            
            <hr>
            <h4><i class="fas fa-home icon-spacer"></i>{$LANG.btk_address_residential_title} (BTK Formatı)</h4>
            <p><small>WHMCS adres alanları BTK formatına tam uymayabilir. Lütfen aşağıdaki alanları BTK'nın istediği şekilde doldurunuz.</small></p>

            <div class="form-group">
                <label for="client_ABONE_ADRES_YERLESIM_IL" class="col-sm-3 control-label">{$LANG.btk_address_province} *</label>
                <div class="col-sm-5">
                    <select name="ABONE_ADRES_YERLESIM_IL" id="client_ABONE_ADRES_YERLESIM_IL" class="form-control select-select2 btk-adres-il">
                        <option value="">-- {$LANG.please_select} --</option>
                        {foreach from=$iller item=il}
                            <option value="{$il->il_adi|escape:'html'}" data-ilid="{$il->id}" {if $btk_data.ABONE_ADRES_YERLESIM_IL == $il->il_adi}selected{/if}>
                                {$il->il_adi|escape:'html'}
                            </option>
                        {/foreach}
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_ADRES_YERLESIM_ILCE" class="col-sm-3 control-label">{$LANG.btk_address_district} *</label>
                <div class="col-sm-5">
                    <select name="ABONE_ADRES_YERLESIM_ILCE" id="client_ABONE_ADRES_YERLESIM_ILCE" class="form-control select-select2 btk-adres-ilce" {if !$btk_data.ABONE_ADRES_YERLESIM_IL && !$yerlesim_ilceleri}disabled{/if}>
                        <option value="">-- {$LANG.please_select} --</option>
                         {if $yerlesim_ilceleri}
                            {foreach from=$yerlesim_ilceleri item=ilce}
                                <option value="{$ilce->ilce_adi|escape:'html'}" data-ilceid="{$ilce->id}" {if $btk_data.ABONE_ADRES_YERLESIM_ILCE == $ilce->ilce_adi}selected{/if}>
                                    {$ilce->ilce_adi|escape:'html'}
                                </option>
                            {/foreach}
                        {/if}
                    </select>
                </div>
            </div>
             <div class="form-group">
                <label for="client_ABONE_ADRES_YERLESIM_MAHALLE" class="col-sm-3 control-label">{$LANG.btk_address_neighbourhood} *</label>
                <div class="col-sm-7">
                    <input type="text" name="ABONE_ADRES_YERLESIM_MAHALLE" id="client_ABONE_ADRES_YERLESIM_MAHALLE" value="{$btk_data.ABONE_ADRES_YERLESIM_MAHALLE|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_ADRES_YERLESIM_CADDE" class="col-sm-3 control-label">{$LANG.btk_address_street_avenue}</label>
                <div class="col-sm-7">
                    <input type="text" name="ABONE_ADRES_YERLESIM_CADDE" id="client_ABONE_ADRES_YERLESIM_CADDE" value="{$btk_data.ABONE_ADRES_YERLESIM_CADDE|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_ADRES_YERLESIM_DIS_KAPI_NO" class="col-sm-3 control-label">{$LANG.btk_address_building_no}</label>
                <div class="col-sm-3">
                    <input type="text" name="ABONE_ADRES_YERLESIM_DIS_KAPI_NO" id="client_ABONE_ADRES_YERLESIM_DIS_KAPI_NO" value="{$btk_data.ABONE_ADRES_YERLESIM_DIS_KAPI_NO|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_ADRES_YERLESIM_IC_KAPI_NO" class="col-sm-3 control-label">{$LANG.btk_address_apartment_no}</label>
                <div class="col-sm-3">
                    <input type="text" name="ABONE_ADRES_YERLESIM_IC_KAPI_NO" id="client_ABONE_ADRES_YERLESIM_IC_KAPI_NO" value="{$btk_data.ABONE_ADRES_YERLESIM_IC_KAPI_NO|escape:'html'}" class="form-control">
                </div>
            </div>
             <div class="form-group">
                <label for="client_ABONE_ADRES_YERLESIM_POSTA_KODU" class="col-sm-3 control-label">{$LANG.btk_address_postal_code}</label>
                <div class="col-sm-3">
                    <input type="text" name="ABONE_ADRES_YERLESIM_POSTA_KODU" id="client_ABONE_ADRES_YERLESIM_POSTA_KODU" value="{$btk_data.ABONE_ADRES_YERLESIM_POSTA_KODU|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_ADRES_YERLESIM_ADRES_KODU" class="col-sm-3 control-label">{$LANG.btk_address_uavt_code} (Yerleşim)</label>
                <div class="col-sm-4">
                    <input type="text" name="ABONE_ADRES_YERLESIM_ADRES_KODU" id="client_ABONE_ADRES_YERLESIM_ADRES_KODU" value="{$btk_data.ABONE_ADRES_YERLESIM_ADRES_KODU|escape:'html'}" class="form-control">
                </div>
            </div>

            <hr>
            <h4><i class="fas fa-phone-alt icon-spacer"></i>İletişim Bilgileri (BTK Formatı)</h4>
             <div class="form-group">
                <label for="client_ABONE_ADRES_IRTIBAT_TEL_NO_1" class="col-sm-3 control-label">{$LANG.btk_contact_phone1} *</label>
                <div class="col-sm-4">
                    <input type="text" name="ABONE_ADRES_IRTIBAT_TEL_NO_1" id="client_ABONE_ADRES_IRTIBAT_TEL_NO_1" value="{$btk_data.ABONE_ADRES_IRTIBAT_TEL_NO_1|default:$clientdetails.phonenumber|escape:'html'}" class="form-control" placeholder="+90xxxxxxxxxx">
                </div>
            </div>
            <div class="form-group">
                <label for="client_ABONE_ADRES_IRTIBAT_TEL_NO_2" class="col-sm-3 control-label">{$LANG.btk_contact_phone2}</label>
                <div class="col-sm-4">
                    <input type="text" name="ABONE_ADRES_IRTIBAT_TEL_NO_2" id="client_ABONE_ADRES_IRTIBAT_TEL_NO_2" value="{$btk_data.ABONE_ADRES_IRTIBAT_TEL_NO_2|escape:'html'}" class="form-control" placeholder="+90xxxxxxxxxx">
                </div>
            </div>
             <div class="form-group">
                <label for="client_ABONE_ADRES_E_MAIL" class="col-sm-3 control-label">{$LANG.ABONE_ADRES_E_MAIL} *</label>
                <div class="col-sm-7">
                    <input type="email" name="ABONE_ADRES_E_MAIL" id="client_ABONE_ADRES_E_MAIL" value="{$btk_data.ABONE_ADRES_E_MAIL|default:$clientdetails.email|escape:'html'}" class="form-control">
                </div>
            </div>

            <div id="kurumsalClientYetkiliFields" {if $btk_data.MUSTERI_TIPI != 'G' && $btk_data.MUSTERI_TIPI != 'K' && $btk_data.MUSTERI_TIPI != 'D'}style="display:none;"{/if}>
                <hr>
                <h4><i class="fas fa-user-tie icon-spacer"></i>Kurum Yetkilisi Bilgileri</h4>
                <div class="form-group">
                    <label for="client_KURUM_YETKILI_ADI" class="col-sm-3 control-label">{$LANG.btk_corporate_authorized_name}</label>
                    <div class="col-sm-8">
                        <input type="text" name="KURUM_YETKILI_ADI" id="client_KURUM_YETKILI_ADI" value="{$btk_data.KURUM_YETKILI_ADI|escape:'html'}" class="form-control">
                    </div>
                </div>
                 <div class="form-group">
                    <label for="client_KURUM_YETKILI_SOYADI" class="col-sm-3 control-label">{$LANG.btk_corporate_authorized_surname}</label>
                    <div class="col-sm-8">
                        <input type="text" name="KURUM_YETKILI_SOYADI" id="client_KURUM_YETKILI_SOYADI" value="{$btk_data.KURUM_YETKILI_SOYADI|escape:'html'}" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="client_KURUM_YETKILI_TCKIMLIK_NO" class="col-sm-3 control-label">{$LANG.btk_corporate_authorized_tckn}</label>
                    <div class="col-sm-4">
                        <input type="text" name="KURUM_YETKILI_TCKIMLIK_NO" id="client_KURUM_YETKILI_TCKIMLIK_NO" value="{$btk_data.KURUM_YETKILI_TCKIMLIK_NO|escape:'html'}" class="form-control" maxlength="11">
                    </div>
                </div>
                <div class="form-group">
                    <label for="client_KURUM_YETKILI_TELEFON" class="col-sm-3 control-label">{$LANG.btk_corporate_authorized_phone}</label>
                    <div class="col-sm-4">
                        <input type="text" name="KURUM_YETKILI_TELEFON" id="client_KURUM_YETKILI_TELEFON" value="{$btk_data.KURUM_YETKILI_TELEFON|escape:'html'}" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="client_KURUM_ADRES" class="col-sm-3 control-label">{$LANG.btk_corporate_address}</label>
                    <div class="col-sm-8">
                        <textarea name="KURUM_ADRES" id="client_KURUM_ADRES" class="form-control" rows="3">{$btk_data.KURUM_ADRES|escape:'html'}</textarea>
                    </div>
                </div>
            </div>

        </div> {*<!-- ./panel-body -->*}
        <div class="panel-footer text-center">
            <button type="submit" class="btn btn-primary btn-lg">
                <i class="fas fa-save icon-spacer"></i>{$LANG.btk_button_save_changes}
            </button>
        </div>
    </div>
</form>

{* Bu şablon için gerekli JavaScript kodları (Tooltip, Select2, Tarih Seçici, Uyruk'a göre Pasaport No göster/gizle,
   Müşteri Tipine göre alanları göster/gizle, AJAX ile ilçe yükleme, TCKN/YKN doğrulama placeholder)
   btk_admin_scripts.js dosyasına taşınmıştır veya taşınacaktır.
*}

{* Gerekli Smarty Değişkenleri listesi bir önceki bölümde belirtilmiştir. *}