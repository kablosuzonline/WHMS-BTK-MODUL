{* modules/addons/btkreports/templates/admin/client_details.tpl *}
{* Müşteri Profili BTK Abone Bilgileri Sekmesi İçeriği - address_fields.tpl Kullanılarak Güncellendi *}
{* BÖLÜM 1 / 2 *}

{if $btk_client_action_result}
    <div class="alert alert-{if $btk_client_action_result.status == 'success'}success{else}danger{/if}">
        {$btk_client_action_result.message}
    </div>
{/if}

<form method="post" action="{$smarty.server.REQUEST_URI}" id="btkClientDetailsForm" class="form-horizontal">
    <input type="hidden" name="btk_client_details_save" value="1">
    <input type="hidden" name="userid" value="{$clientid|default:$smarty.get.userid}">
    <input type="hidden" name="token" value="{$btk_csrf_token_client}">

    <h4><i class="fas fa-user-tag"></i> {$lang.btk_musteri_bilgileri_tab_title}</h4>
    <hr>

    <div class="row">
        <div class="col-md-6">
            <div class="form-group">
                <label for="btk_musteri_tipi_kodu" class="col-sm-4 control-label">{$lang.musteri_tipi_label}*</label>
                <div class="col-sm-8">
                    <select name="btk_musteri_tipi_kodu" id="btk_musteri_tipi_kodu" class="form-control" required>
                        <option value="">{$lang.select_option}</option>
                        {if $btk_ref_musteri_tipleri}
                        {foreach from=$btk_ref_musteri_tipleri item=tip}
                            <option value="{$tip.kod}" {if $btk_musteri_data.musteri_tipi_kodu == $tip.kod}selected{/if}>
                                {$tip.aciklama|escape:'html'} ({$tip.kod|escape:'html'})
                            </option>
                        {/foreach}
                        {/if}
                    </select>
                    <span class="help-block">{$lang.musteri_tipi_desc}</span>
                </div>
            </div>

            <div class="form-group">
                <label for="btk_abone_tc_kimlik_no" class="col-sm-4 control-label">{$lang.abone_tc_kimlik_no_label}</label>
                <div class="col-sm-7">
                    <input type="text" name="btk_abone_tc_kimlik_no" id="btk_abone_tc_kimlik_no" value="{$btk_musteri_data.abone_tc_kimlik_no|escape:'html'}" class="form-control" maxlength="11" pattern="[0-9]{11}">
                    <span class="help-block">{$lang.abone_tc_kimlik_no_desc}</span>
                </div>
                <div class="col-sm-1" id="tckn_status_icon_client" style="padding-top: 8px;">
                    {if $btk_musteri_data.tckn_dogrulama_durumu === true}
                        <i class="fas fa-check-circle text-success" data-toggle="tooltip" title="{$lang.nvi_status_verified|sprintf:$btk_musteri_data.tckn_dogrulama_zamani|date_format:'%d.%m.%Y %H:%M'}"></i>
                    {elseif $btk_musteri_data.tckn_dogrulama_durumu === false && $btk_musteri_data.abone_tc_kimlik_no != ''}
                        <i class="fas fa-times-circle text-danger" data-toggle="tooltip" title="{$lang.nvi_status_not_verified|sprintf:$btk_musteri_data.tckn_dogrulama_zamani|date_format:'%d.%m.%Y %H:%M'}"></i>
                    {else}
                        {* <i class="fas fa-question-circle text-muted" data-toggle="tooltip" title="{$lang.nvi_status_pending}"></i> *}
                    {/if}
                </div>
            </div>

            <div class="form-group">
                <label for="btk_abone_pasaport_no" class="col-sm-4 control-label">{$lang.abone_pasaport_no_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_pasaport_no" id="btk_abone_pasaport_no" value="{$btk_musteri_data.abone_pasaport_no|escape:'html'}" class="form-control">
                    <span class="help-block">{$lang.abone_pasaport_no_desc}</span>
                </div>
            </div>
            
            <div id="tuzelKisiAlanlariClient" {if !($btk_musteri_data.musteri_tipi_kodu|startsWith:'G-') && $btk_musteri_data.musteri_tipi_kodu != ''}style="display:block;"{else}style="display:none;"{/if}>
                <div class="form-group">
                    <label for="btk_abone_unvan" class="col-sm-4 control-label">{$lang.abone_unvan_label}*</label>
                    <div class="col-sm-8">
                        <input type="text" name="btk_abone_unvan" id="btk_abone_unvan" value="{if $btk_musteri_data.abone_unvan}{$btk_musteri_data.abone_unvan|escape:'html'}{else if $clientcompanyname}{$clientcompanyname|escape:'html'}{else}{$clientfirstname|escape:'html'} {$clientlastname|escape:'html'}{/if}" class="form-control">
                        <span class="help-block">{$lang.abone_unvan_desc}</span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="btk_abone_vergi_numarasi" class="col-sm-4 control-label">{$lang.abone_vergi_numarasi_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="btk_abone_vergi_numarasi" id="btk_abone_vergi_numarasi" value="{$btk_musteri_data.abone_vergi_numarasi|default:$clienttax_id|escape:'html'}" class="form-control" maxlength="11">
                        <span class="help-block">{$lang.abone_vergi_numarasi_desc}</span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="btk_abone_mersis_numarasi" class="col-sm-4 control-label">{$lang.abone_mersis_numarasi_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="btk_abone_mersis_numarasi" id="btk_abone_mersis_numarasi" value="{$btk_musteri_data.abone_mersis_numarasi|escape:'html'}" class="form-control" maxlength="16" pattern="[0-9]{16}">
                        <span class="help-block">{$lang.abone_mersis_numarasi_desc}</span>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label for="btk_abone_cinsiyet_kodu" class="col-sm-4 control-label">{$lang.abone_cinsiyet_label}*</label>
                <div class="col-sm-8">
                    <select name="btk_abone_cinsiyet_kodu" id="btk_abone_cinsiyet_kodu" class="form-control" required>
                        <option value="">{$lang.select_option}</option>
                        {if $btk_ref_cinsiyet}
                        {foreach from=$btk_ref_cinsiyet item=cinsiyet}
                            <option value="{$cinsiyet.kod}" {if $btk_musteri_data.abone_cinsiyet_kodu == $cinsiyet.kod}selected{/if}>
                                {$cinsiyet.aciklama|escape:'html'}
                            </option>
                        {/foreach}
                        {/if}
                    </select>
                    <span class="help-block">{$lang.abone_cinsiyet_desc}</span>
                </div>
            </div>

            <div class="form-group">
                <label for="btk_abone_uyruk_ref_id" class="col-sm-4 control-label">{$lang.abone_uyruk_label}*</label>
                <div class="col-sm-8">
                    <select name="btk_abone_uyruk_ref_id" id="btk_abone_uyruk_ref_id" class="form-control" required>
                        <option value="">{$lang.select_option}</option>
                        {if $btk_ref_ulkeler}
                        {foreach from=$btk_ref_ulkeler item=ulke}
                            <option value="{$ulke.id}" {if $btk_musteri_data.abone_uyruk_ref_id == $ulke.id}selected{/if} data-iso3="{$ulke.iso_3166_1_alpha_3}">
                                {$ulke.ulke_adi_tr|escape:'html'}
                            </option>
                        {/foreach}
                        {/if}
                    </select>
                    <span class="help-block">{$lang.abone_uyruk_desc}</span>
                </div>
            </div>
        </div>
        <div class="col-md-6">
             <div class="form-group">
                <label for="btk_abone_baba_adi" class="col-sm-4 control-label">{$lang.abone_baba_adi_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_baba_adi" id="btk_abone_baba_adi" value="{$btk_musteri_data.abone_baba_adi|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="btk_abone_ana_adi" class="col-sm-4 control-label">{$lang.abone_ana_adi_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_ana_adi" id="btk_abone_ana_adi" value="{$btk_musteri_data.abone_ana_adi|escape:'html'}" class="form-control">
                </div>
            </div>
             <div class="form-group">
                <label for="btk_abone_anne_kizlik_soyadi" class="col-sm-4 control-label">{$lang.abone_anne_kizlik_soyadi_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_anne_kizlik_soyadi" id="btk_abone_anne_kizlik_soyadi" value="{$btk_musteri_data.abone_anne_kizlik_soyadi|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="btk_abone_dogum_yeri" class="col-sm-4 control-label">{$lang.abone_dogum_yeri_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_dogum_yeri" id="btk_abone_dogum_yeri" value="{$btk_musteri_data.abone_dogum_yeri|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="btk_abone_dogum_tarihi" class="col-sm-4 control-label">{$lang.abone_dogum_tarihi_label}</label>
                <div class="col-sm-8">
                    {* WHMCS genellikle datepicker için kendi class'larını kullanır, örn: 'date-picker' *}
                    <input type="text" name="btk_abone_dogum_tarihi" id="btk_abone_dogum_tarihi" value="{$btk_musteri_data.abone_dogum_tarihi|date_format:'%Y-%m-%d'}" class="form-control date-picker-btk-client">
                </div>
            </div>
            <div class="form-group">
                <label for="btk_abone_meslek_ref_id" class="col-sm-4 control-label">{$lang.abone_meslek_label}</label>
                <div class="col-sm-8">
                     <select name="btk_abone_meslek_ref_id" id="btk_abone_meslek_ref_id" class="form-control">
                        <option value="">{$lang.select_option}</option>
                        {if $btk_ref_meslekler}
                        {foreach from=$btk_ref_meslekler item=meslek}
                            <option value="{$meslek.id}" {if $btk_musteri_data.abone_meslek_ref_id == $meslek.id}selected{/if}>
                                {$meslek.meslek_adi|escape:'html'}
                            </option>
                        {/foreach}
                        {/if}
                    </select>
                    <span class="help-block">{$lang.abone_meslek_desc}</span>
                </div>
            </div>
            <div class="form-group">
                 <div class="col-sm-offset-4 col-sm-8">
                    <button type="button" id="btnVerifyNVIClient" class="btn btn-info btn-sm" data-userid="{$clientid|default:$smarty.get.userid}" data-token="{$btk_nvi_verify_token|default:$btk_csrf_token_client}">
                        <i class="fas fa-user-check"></i> {$lang.verify_tckn_button}
                    </button>
                    <span id="nviVerifyStatusClient" style="margin-left:10px;">
                         {if $btk_musteri_data.tckn_dogrulama_durumu === true}
                            <span class="text-success">{$lang.nvi_status_verified|sprintf:$btk_musteri_data.tckn_dogrulama_zamani|date_format:'%d.%m.%Y %H:%M'}</span>
                        {elseif $btk_musteri_data.tckn_dogrulama_durumu === false && ($btk_musteri_data.abone_tc_kimlik_no != '' || $btk_musteri_data.abone_pasaport_no != '')}
                            <span class="text-danger">{$lang.nvi_status_not_verified|sprintf:$btk_musteri_data.tckn_dogrulama_zamani|date_format:'%d.%m.%Y %H:%M'}</span>
                        {else}
                            <span class="text-muted">{$lang.nvi_status_pending}</span>
                        {/if}
                    </span>
                     {if $btk_musteri_data.vefat_durumu}
                        <span class="label label-danger" style="margin-left:10px; display: block; margin-top: 5px;">{$lang.nvi_vefat_evet|sprintf:$btk_musteri_data.tckn_dogrulama_zamani|date_format:'%d.%m.%Y'}</span>
                    {/if}
                 </div>
            </div>
        </div>
    </div>
    <hr>
    {* BÖLÜM 1 SONU - Devamı sonraki bölümde (Kimlik Bilgileri, Adresler vb.) *}
</form>
{* modules/addons/btkreports/templates/admin/client_details.tpl *}
{* Müşteri Profili BTK Abone Bilgileri Sekmesi İçeriği - address_fields.tpl Kullanılarak Güncellendi *}
{* BÖLÜM 2 / 2 (SON BÖLÜM) *}

    {* --- ÖNCEKİ BÖLÜMÜN DEVAMI --- *}
    {* Form tag'ı ilk bölümde açılmıştı. *}

    <hr>
    <h4><i class="far fa-id-card"></i> {$lang.abone_kimlik_bilgileri_title}</h4>
    <div class="row">
        <div class="col-md-6">
            <div class="form-group">
                <label for="btk_abone_kimlik_tipi_kodu" class="col-sm-4 control-label">{$lang.abone_kimlik_tipi_label}{if $btk_musteri_data.musteri_tipi_kodu|startsWith:'G-'}*{/if}</label>
                <div class="col-sm-8">
                    <select name="btk_abone_kimlik_tipi_kodu" id="btk_abone_kimlik_tipi_kodu" class="form-control" {if $btk_musteri_data.musteri_tipi_kodu|startsWith:'G-'}required{/if}>
                        <option value="">{$lang.select_option}</option>
                        {if $btk_ref_kimlik_tipleri}
                        {foreach from=$btk_ref_kimlik_tipleri item=tip}
                            <option value="{$tip.kod}" {if $btk_musteri_data.abone_kimlik_tipi_kodu == $tip.kod}selected{/if}>
                                {$tip.aciklama|escape:'html'}
                            </option>
                        {/foreach}
                        {/if}
                    </select>
                    <span class="help-block">{$lang.abone_kimlik_tipi_desc}</span>
                </div>
            </div>
            <div class="form-group">
                <label for="btk_abone_kimlik_seri_no" class="col-sm-4 control-label">{$lang.abone_kimlik_seri_no_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_kimlik_seri_no" id="btk_abone_kimlik_seri_no" value="{$btk_musteri_data.abone_kimlik_seri_no|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="btk_abone_kimlik_verildigi_yer" class="col-sm-4 control-label">{$lang.abone_kimlik_verildigi_yer_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_kimlik_verildigi_yer" id="btk_abone_kimlik_verildigi_yer" value="{$btk_musteri_data.abone_kimlik_verildigi_yer|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="btk_abone_kimlik_verildigi_tarih" class="col-sm-4 control-label">{$lang.abone_kimlik_verildigi_tarih_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_kimlik_verildigi_tarih" id="btk_abone_kimlik_verildigi_tarih" value="{$btk_musteri_data.abone_kimlik_verildigi_tarih|date_format:'%Y-%m-%d'}" class="form-control date-picker-btk-client">
                </div>
            </div>
            <div class="form-group">
                <label for="btk_abone_kimlik_aidiyeti_kodu" class="col-sm-4 control-label">{$lang.abone_kimlik_aidiyeti_label}{if $btk_musteri_data.musteri_tipi_kodu|startsWith:'G-'}*{/if}</label>
                <div class="col-sm-8">
                    <select name="btk_abone_kimlik_aidiyeti_kodu" id="btk_abone_kimlik_aidiyeti_kodu" class="form-control" {if $btk_musteri_data.musteri_tipi_kodu|startsWith:'G-'}required{/if}>
                        <option value="">{$lang.select_option}</option>
                         {if $btk_ref_kimlik_aidiyetleri}
                         {foreach from=$btk_ref_kimlik_aidiyetleri item=aidiyet}
                            <option value="{$aidiyet.kod}" {if $btk_musteri_data.abone_kimlik_aidiyeti_kodu == $aidiyet.kod}selected{/if}>
                                {$aidiyet.aciklama|escape:'html'}
                            </option>
                        {/foreach}
                        {/if}
                    </select>
                    <span class="help-block">{$lang.abone_kimlik_aidiyeti_desc}</span>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            {* Eski tip nüfus cüzdanı bilgileri *}
            <div class="form-group">
                <label for="btk_abone_kimlik_cilt_no" class="col-sm-4 control-label">{$lang.abone_kimlik_cilt_no_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_kimlik_cilt_no" id="btk_abone_kimlik_cilt_no" value="{$btk_musteri_data.abone_kimlik_cilt_no|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="btk_abone_kimlik_kutuk_no" class="col-sm-4 control-label">{$lang.abone_kimlik_kutuk_no_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_kimlik_kutuk_no" id="btk_abone_kimlik_kutuk_no" value="{$btk_musteri_data.abone_kimlik_kutuk_no|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="btk_abone_kimlik_sayfa_no" class="col-sm-4 control-label">{$lang.abone_kimlik_sayfa_no_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_kimlik_sayfa_no" id="btk_abone_kimlik_sayfa_no" value="{$btk_musteri_data.abone_kimlik_sayfa_no|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="btk_abone_kimlik_il_adi" class="col-sm-4 control-label">{$lang.abone_kimlik_il_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_kimlik_il_adi" id="btk_abone_kimlik_il_adi" value="{$btk_musteri_data.abone_kimlik_il_adi|escape:'html'}" class="form-control">
                </div>
            </div>
             <div class="form-group">
                <label for="btk_abone_kimlik_ilce_adi" class="col-sm-4 control-label">{$lang.abone_kimlik_ilce_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_kimlik_ilce_adi" id="btk_abone_kimlik_ilce_adi" value="{$btk_musteri_data.abone_kimlik_ilce_adi|escape:'html'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="btk_abone_kimlik_mahalle_koy" class="col-sm-4 control-label">{$lang.abone_kimlik_mahalle_koy_label}</label>
                <div class="col-sm-8">
                    <input type="text" name="btk_abone_kimlik_mahalle_koy" id="btk_abone_kimlik_mahalle_koy" value="{$btk_musteri_data.abone_kimlik_mahalle_koy|escape:'html'}" class="form-control">
                </div>
            </div>
        </div>
    </div>
    <hr>

    {* Kurum Yetkilisi Bilgileri - Müşteri tipine göre JS ile göster/gizle #tuzelKisiAlanlariClient ile yapılıyor *}
    <div id="kurumYetkilisiBilgileriClient" {if !($btk_musteri_data.musteri_tipi_kodu|startsWith:'G-') && $btk_musteri_data.musteri_tipi_kodu != ''}style="display:block;"{else}style="display:none;"{/if}>
        <h4><i class="fas fa-user-tie"></i> {$lang.kurum_yetkilisi_bilgileri_title}</h4>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="btk_kurum_yetkili_adi" class="col-sm-4 control-label">{$lang.kurum_yetkili_adi_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="btk_kurum_yetkili_adi" id="btk_kurum_yetkili_adi" value="{$btk_musteri_data.kurum_yetkili_adi|escape:'html'}" class="form-control">
                    </div>
                </div>
                 <div class="form-group">
                    <label for="btk_kurum_yetkili_tckimlik_no" class="col-sm-4 control-label">{$lang.kurum_yetkili_tckimlik_no_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="btk_kurum_yetkili_tckimlik_no" id="btk_kurum_yetkili_tckimlik_no" value="{$btk_musteri_data.kurum_yetkili_tckimlik_no|escape:'html'}" class="form-control" maxlength="11" pattern="[0-9]{11}">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="btk_kurum_yetkili_soyadi" class="col-sm-4 control-label">{$lang.kurum_yetkili_soyadi_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="btk_kurum_yetkili_soyadi" id="btk_kurum_yetkili_soyadi" value="{$btk_musteri_data.kurum_yetkili_soyadi|escape:'html'}" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="btk_kurum_yetkili_telefon" class="col-sm-4 control-label">{$lang.kurum_yetkili_telefon_label}</label>
                    <div class="col-sm-8">
                        <input type="text" name="btk_kurum_yetkili_telefon" id="btk_kurum_yetkili_telefon" value="{$btk_musteri_data.kurum_yetkili_telefon|escape:'html'}" class="form-control" placeholder="5xxxxxxxxx" maxlength="10" pattern="[0-9]{10}">
                    </div>
                </div>
            </div>
        </div>
        <hr>
    </div>

    {* Kurum Adresi - Müşteri tipine göre JS ile göster/gizle #tuzelKisiAlanlariClient ile yapılıyor *}
    <div id="kurumAdresiClient" {if !($btk_musteri_data.musteri_tipi_kodu|startsWith:'G-') && $btk_musteri_data.musteri_tipi_kodu != ''}style="display:block;"{else}style="display:none;"{/if}>
        <h4><i class="fas fa-building"></i> {$lang.kurum_adresi_title}</h4>
        {include file="./partials/address_fields.tpl" prefix="btk_kurum" address_data=$btk_kurum_adresi_data iller_for_select=$btk_ref_iller lang=$lang required_fields=false}
        <hr>
    </div>

    <h4><i class="fas fa-home"></i> {$lang.abone_yerlesim_adresi_title}*</h4>
    <p><small class="text-muted">WHMCS'deki varsayılan fatura adresi ile aynı olabilir. Farklıysa veya eksikse buradan güncelleyin. Bu adres BTK raporları için zorunludur.</small></p>
    {include file="./partials/address_fields.tpl" prefix="btk_yerlesim" address_data=$btk_yerlesim_adresi_data iller_for_select=$btk_ref_iller lang=$lang required_fields=true}

    {* Form Kaydetme Butonu bu sekme için WHMCS'in ana Müşteri Profili sayfasındaki "Değişiklikleri Kaydet" butonu tarafından yönetilir. *}
    {* AdminClientProfileTabFieldsSave hook'u POST verilerini yakalayacaktır. *}

</form> {* btkClientDetailsForm Sonu - İlk bölümde açılmıştı *}

{* Bu script bloğu btk_admin_scripts.js dosyasına taşınabilir veya ana TPL (client_details.tpl) içinde kalabilir. *}
<script type="text/javascript">
$(document).ready(function() {
    // Müşteri tipine göre Tüzel Kişi alanlarını göster/gizle (1. Bölümde zaten vardı, burada tekrar etmeye gerek yok)
    // function toggleTuzelAlanlariClient() { ... }
    // $('#btk_musteri_tipi_kodu').change(toggleTuzelAlanlariClient).trigger('change');

    // Tarih seçicileri etkinleştir (1. Bölümde zaten vardı)
    // if ($.fn.datepicker) { $('.date-picker-btk-client').datepicker({ ... }); }

    // NVI Doğrulama Butonu (1. Bölümde zaten vardı, AJAX kısmı PHP tarafı yazılınca tamamlanacak)
    // $('#btnVerifyNVIClient').click(function() { ... });

    // Dinamik Adres Dropdown'ları için genel fonksiyon
    // prefix: 'btk_yerlesim' veya 'btk_kurum'
    // Bu fonksiyon, bu TPL içinde birden fazla adres bloğu için kullanılacak.
    window.initBtkAddressDropdowns = function(prefix) {
        var ilSelect = $('#' + prefix + '_il_kodu');
        var ilceSelect = $('#' + prefix + '_ilce_kodu');
        var mahalleSelect = $('#' + prefix + '_mahalle_kodu');
        
        // data-selected attribute'undan başlangıç değerlerini al (düzenleme modu için)
        var initialSelectedIlce = ilceSelect.data('selected');
        var initialSelectedMahalle = mahalleSelect.data('selected');

        ilSelect.change(function() {
            var ilKodu = $(this).val();
            var currentIlceVal = ilceSelect.val(); // Mevcut ilçe seçimini sakla (eğer varsa)

            ilceSelect.empty().append($('<option></option>').attr('value', '').text('{$lang.select_option|escape:"javascript"}')).prop('disabled', true);
            mahalleSelect.empty().append($('<option></option>').attr('value', '').text('{$lang.select_option|escape:"javascript"}')).prop('disabled', true);

            if (ilKodu && ilKodu !== '') {
                ilceSelect.html('<option value="">{$lang.please_wait|escape:"javascript"}</option>');
                $.ajax({
                    url: '{$modulelink}&action=get_address_data&ajax=1',
                    type: 'POST',
                    data: { type: 'ilce', parent_id: ilKodu, token: '{$btk_csrf_token_client|default:$csrfToken}' }, // $btk_csrf_token_client hook tarafından sağlanmalı
                    dataType: 'json',
                    success: function(data) {
                        ilceSelect.empty().append($('<option></option>').attr('value', '').text('{$lang.select_option|escape:"javascript"}'));
                        if (data && data.success && data.items) {
                            $.each(data.items, function(key, entry) {
                                var option = $('<option></option>').attr('value', entry.id).text(entry.name);
                                // Eğer düzenleme modunda initialSelectedIlce varsa ve il kodu değişmediyse onu seç
                                if (initialSelectedIlce && entry.id == initialSelectedIlce && ilKodu == $('#' + prefix + '_il_kodu option:selected').data('original-il')) {
                                     option.prop('selected', true);
                                }
                                ilceSelect.append(option);
                            });
                        }
                        ilceSelect.prop('disabled', false);
                        // İlçe dropdown'ı yüklendikten sonra, eğer bir değer seçiliyse (ya da data-selected ile geliyorsa) mahalleleri yüklemek için change'i tetikle
                         if(initialSelectedIlce && ilceSelect.val() == initialSelectedIlce){
                            ilceSelect.trigger('change');
                        } else if (ilceSelect.val() === '' && initialSelectedIlce) {
                            // Eğer AJAX sonrası seçili değer yoksa ama data-selected varsa, onu set et ve tetikle.
                            ilceSelect.val(initialSelectedIlce).trigger('change');
                        } else {
                            ilceSelect.trigger('change'); // Normal akışta mahalleleri tetikle
                        }
                    },
                    error: function() {
                        ilceSelect.empty().append($('<option></option>').attr('value', '').text('{$lang.error_unexpected|escape:"javascript"}')).prop('disabled', false);
                    }
                });
            }
            // İl seçildiğinde, ilçe ve mahalle için data-selected değerlerini temizle, böylece yeniden yüklemede yanlış seçilmezler
            ilceSelect.data('selected', '');
            mahalleSelect.data('selected', '');
        });

        ilceSelect.change(function() {
            var ilceKodu = $(this).val();
            var currentMahalleVal = mahalleSelect.val();

            mahalleSelect.empty().append($('<option></option>').attr('value', '').text('{$lang.select_option|escape:"javascript"}')).prop('disabled', true);

            if (ilceKodu && ilceKodu !== '') {
                mahalleSelect.html('<option value="">{$lang.please_wait|escape:"javascript"}</option>');
                $.ajax({
                    url: '{$modulelink}&action=get_address_data&ajax=1',
                    type: 'POST',
                    data: { type: 'mahalle', parent_id: ilceKodu, token: '{$btk_csrf_token_client|default:$csrfToken}' },
                    dataType: 'json',
                    success: function(data) {
                        mahalleSelect.empty().append($('<option></option>').attr('value', '').text('{$lang.select_option|escape:"javascript"}'));
                        if (data && data.success && data.items) {
                            $.each(data.items, function(key, entry) {
                                var option = $('<option></option>').attr('value', entry.id).text(entry.name);
                                if (initialSelectedMahalle && entry.id == initialSelectedMahalle && ilceKodu == $('#' + prefix + '_ilce_kodu option:selected').data('original-ilce')) {
                                     option.prop('selected', true);
                                }
                                mahalleSelect.append(option);
                            });
                        }
                        mahalleSelect.prop('disabled', false);
                        // Eğer düzenleme modunda mahalle önceden seçiliyse onu set et
                        if(initialSelectedMahalle && mahalleSelect.val() === ''){
                            mahalleSelect.val(initialSelectedMahalle);
                        }
                    },
                    error: function() {
                        mahalleSelect.empty().append($('<option></option>').attr('value', '').text('{$lang.error_unexpected|escape:"javascript"}')).prop('disabled', false);
                    }
                });
            }
             mahalleSelect.data('selected', ''); // İlçe değiştiğinde mahalle için data-selected'ı temizle
        });

        // Sayfa yüklendiğinde, eğer il seçili ise ilçeleri ve ardından mahalleleri yükle
        // Bu, data-selected attribute'larının doğru set edilmiş olmasına dayanır
        if (ilSelect.val()) {
            // İl seçeneğine orijinal il değerini data attribute olarak ekleyelim (düzenleme durumu için)
             $('#' + prefix + '_il_kodu option:selected').data('original-il', ilSelect.val());
             if (initialSelectedIlce) {
                 $('#' + prefix + '_ilce_kodu option[value="' + initialSelectedIlce + '"]').data('original-ilce', initialSelectedIlce);
             }
            ilSelect.trigger('change');
        }
    };

    // Her adres bloğu için başlat
    initBtkAddressDropdowns('btk_yerlesim');
    initBtkAddressDropdowns('btk_kurum');

});
</script>