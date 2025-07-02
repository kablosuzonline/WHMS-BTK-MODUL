{*
    WHMCS BTK Raporlama Modülü - Müşteri Detayları BTK Bilgi Formu
    Dosya: templates/admin/client_details_btk_form.tpl
    Bu şablon, WHMCS müşteri profili sayfasına bir sekme olarak enjekte edilecektir.
    Sürüm: 6.5 - Tüm Alanlar Eklendi
*}

{if $btkClientValidationErrorMessages}
    <div class="alert alert-danger">
        <strong>{$LANG.validationErrorsOccurred}:</strong>
        <ul>
            {foreach from=$btkClientValidationErrorMessages item=message}
                <li>{$message}</li>
            {/foreach}
        </ul>
    </div>
{/if}

<form method="post" action="{$modulelink}&action=save_client_btk_details&userid={$clientid}" id="btkClientDetailsForm">
    <input type="hidden" name="token" value="{$csrfToken}">
    <input type="hidden" name="btkdata[whmcs_client_id]" value="{$clientid}">
    {* Bu formun post edildiğini PreClientEdit hook'unda anlamak için bir trigger *}
    <input type="hidden" name="btk_update_trigger_client" value="1">

    <h4><i class="fas fa-user-tag"></i> {$LANG.aboneTemelBtkBilgileri}</h4>
    <div class="row">
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_tc_kimlik_no">{$LANG.personelTcKimlikNoHeader} *</label>
                <input type="text" name="btkdata[abone_tc_kimlik_no]" id="abone_tc_kimlik_no" value="{$btkData.abone_tc_kimlik_no|escape}" class="form-control" maxlength="11" required>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_pasaport_no">{$LANG.abonePasaportNoLabel}</label>
                <input type="text" name="btkdata[abone_pasaport_no]" id="abone_pasaport_no" value="{$btkData.abone_pasaport_no|escape}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
             <div class="form-group">
                <label for="abone_uyruk">{$LANG.aboneUyrukLabel} *</label>
                <input type="text" name="btkdata[abone_uyruk]" id="abone_uyruk" value="{$btkData.abone_uyruk|default:'TUR'|escape}" class="form-control" maxlength="3" required>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_cinsiyet">{$LANG.aboneCinsiyetLabel} *</label>
                 <select name="btkdata[abone_cinsiyet]" id="abone_cinsiyet" class="form-control" required>
                    <option value="">{$LANG.selectOption}</option>
                    <option value="E" {if $btkData.abone_cinsiyet == 'E'}selected{/if}>{$LANG.genderMale}</option>
                    <option value="K" {if $btkData.abone_cinsiyet == 'K'}selected{/if}>{$LANG.genderFemale}</option>
                </select>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label for="abone_baba_adi">{$LANG.aboneBabaAdiLabel}</label>
                <input type="text" name="btkdata[abone_baba_adi]" id="abone_baba_adi" value="{$btkData.abone_baba_adi|escape}" class="form-control">
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label for="abone_ana_adi">{$LANG.aboneAnaAdiLabel}</label>
                <input type="text" name="btkdata[abone_ana_adi]" id="abone_ana_adi" value="{$btkData.abone_ana_adi|escape}" class="form-control">
            </div>
        </div>
         <div class="col-md-4">
            <div class="form-group">
                <label for="abone_dogum_tarihi">{$LANG.aboneDogumTarihiLabel} * <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.dateFormatYYYYMMDDTooltip|escape}"></i></label>
                <input type="text" name="btkdata[abone_dogum_tarihi]" id="abone_dogum_tarihi" value="{$btkData.abone_dogum_tarihi|escape}" class="form-control date-picker-yyyymmdd" placeholder="YYYYMMDD" required>
            </div>
        </div>
    </div>
     <div class="row">
         <div class="col-md-4">
             <div class="form-group">
                 <label for="musteri_tipi">{$LANG.musteriTipiLabel} *</label>
                 <select name="btkdata[musteri_tipi]" id="musteri_tipi" class="form-control" required>
                    <option value="">{$LANG.selectOption}</option>
                    <option value="G-SAHIS" {if $btkData.musteri_tipi == 'G-SAHIS'}selected{/if}>{$LANG.musteriTipiGSahis}</option>
                    <option value="T-SIRKET" {if $btkData.musteri_tipi == 'T-SIRKET'}selected{/if}>{$LANG.musteriTipiTSirket}</option>
                 </select>
             </div>
         </div>
          <div class="col-md-4">
            <div class="form-group">
                <label for="abone_mersis_numarasi">{$LANG.aboneMersisNumarasiLabel}</label>
                <input type="text" name="btkdata[abone_mersis_numarasi]" id="abone_mersis_numarasi" value="{$btkData.abone_mersis_numarasi|escape}" class="form-control">
            </div>
        </div>
    </div>

    <hr>
    <h4><i class="fas fa-map-marker-alt"></i> {$LANG.customerYerlesimAdresiTitle}</h4>
    <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label for="yerlesim_il_id">{$LANG.adresIlLabel} *</label>
                <select name="btkdata[yerlesim_il_id]" id="yerlesim_il_id" class="form-control adres-il-select" data-target-ilce="yerlesim_ilce_id" required>
                    <option value="">{$LANG.selectIlOption}</option>
                    {foreach from=$iller item=il}
                        <option value="{$il.id}" {if $btkData.yerlesim_il_id == $il.id}selected{/if}>{$il.il_adi|escape}</option>
                    {/foreach}
                </select>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label for="yerlesim_ilce_id">{$LANG.adresIlceLabel} *</label>
                <select name="btkdata[yerlesim_ilce_id]" id="yerlesim_ilce_id" class="form-control adres-ilce-select" data-target-mahalle="yerlesim_mahalle_id" required>
                    <option value="">{$LANG.selectIlceOption}</option>
                     {if $yerlesim_ilceler}
                         {foreach from=$yerlesim_ilceler item=ilce}
                            <option value="{$ilce.id}" {if $btkData.yerlesim_ilce_id == $ilce.id}selected{/if}>{$ilce.ilce_adi|escape}</option>
                        {/foreach}
                    {/if}
                </select>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label for="yerlesim_mahalle_id">{$LANG.adresMahalleLabel} *</label>
                <select name="btkdata[yerlesim_mahalle_id]" id="yerlesim_mahalle_id" class="form-control adres-mahalle-select" required>
                     <option value="">{$LANG.selectMahalleOption}</option>
                     {if $yerlesim_mahalleler}
                         {foreach from=$yerlesim_mahalleler item=mahalle}
                            <option value="{$mahalle.id}" {if $btkData.yerlesim_mahalle_id == $mahalle.id}selected{/if}>{$mahalle.mahalle_adi|escape}</option>
                        {/foreach}
                    {/if}
                </select>
            </div>
        </div>
    </div>
     <div class="row">
        <div class="col-md-6">
            <div class="form-group">
                <label for="yerlesim_cadde">{$LANG.adresCaddeSokakLabel}</label>
                <input type="text" name="btkdata[yerlesim_cadde]" id="yerlesim_cadde" value="{$btkData.yerlesim_cadde|escape}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="yerlesim_dis_kapi_no">{$LANG.adresDisKapiNoLabel}</label>
                <input type="text" name="btkdata[yerlesim_dis_kapi_no]" id="yerlesim_dis_kapi_no" value="{$btkData.yerlesim_dis_kapi_no|escape}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="yerlesim_ic_kapi_no">{$LANG.adresIcKapiNoLabel}</label>
                <input type="text" name="btkdata[yerlesim_ic_kapi_no]" id="yerlesim_ic_kapi_no" value="{$btkData.yerlesim_ic_kapi_no|escape}" class="form-control">
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div class="form-group">
                <label for="yerlesim_posta_kodu">{$LANG.adresPostaKoduLabel}</label>
                <input type="text" name="btkdata[yerlesim_posta_kodu]" id="yerlesim_posta_kodu" value="{$btkData.yerlesim_posta_kodu|escape}" class="form-control">
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group">
                <label for="yerlesim_adres_kodu_uavt">{$LANG.adresKoduLabel}</label>
                <input type="text" name="btkdata[yerlesim_adres_kodu_uavt]" id="yerlesim_adres_kodu_uavt" value="{$btkData.yerlesim_adres_kodu_uavt|escape}" class="form-control">
            </div>
        </div>
    </div>

    {* Kurumsal Müşteriler İçin Yetkili Bilgileri (Müşteri Tipi T-SIRKET ise gösterilir) *}
    <div id="kurumsalYetkiliBilgileri" {if $btkData.musteri_tipi != 'T-SIRKET'}style="display:none;"{/if}>
        <hr>
        <h4><i class="fas fa-user-shield"></i> {$LANG.kurumYetkilisiBilgileriTitle}</h4>
        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label for="kurum_yetkili_adi">{$LANG.kurumYetkiliAdiLabel}</label>
                    <input type="text" name="btkdata[kurum_yetkili_adi]" id="kurum_yetkili_adi" value="{$btkData.kurum_yetkili_adi|escape}" class="form-control">
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="kurum_yetkili_soyadi">{$LANG.kurumYetkiliSoyadiLabel}</label>
                    <input type="text" name="btkdata[kurum_yetkili_soyadi]" id="kurum_yetkili_soyadi" value="{$btkData.kurum_yetkili_soyadi|escape}" class="form-control">
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="kurum_yetkili_tckimlik_no">{$LANG.kurumYetkiliTcKimlikNoLabel}</label>
                    <input type="text" name="btkdata[kurum_yetkili_tckimlik_no]" id="kurum_yetkili_tckimlik_no" value="{$btkData.kurum_yetkili_tckimlik_no|escape}" class="form-control" maxlength="11">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="kurum_yetkili_telefon">{$LANG.kurumYetkiliTelefonLabel}</label>
                    <input type="text" name="btkdata[kurum_yetkili_telefon]" id="kurum_yetkili_telefon" value="{$btkData.kurum_yetkili_telefon|escape}" class="form-control">
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="kurum_adres">{$LANG.kurumAdresLabel}</label>
                    <textarea name="btkdata[kurum_adres]" id="kurum_adres" class="form-control" rows="2">{$btkData.kurum_adres|escape}</textarea>
                </div>
            </div>
        </div>
    </div>

    <hr>
    <h4><i class="fas fa-id-card-alt"></i> {$LANG.aboneKimlikDetayTitle}</h4>
     <div class="row">
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_dogum_yeri">{$LANG.aboneDogumYeriLabel}</label>
                <input type="text" name="btkdata[abone_dogum_yeri]" id="abone_dogum_yeri" value="{$btkData.abone_dogum_yeri|escape}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_anne_kizlik_soyadi">{$LANG.aboneAnneKizlikSoyadiLabel}</label>
                <input type="text" name="btkdata[abone_anne_kizlik_soyadi]" id="abone_anne_kizlik_soyadi" value="{$btkData.abone_anne_kizlik_soyadi|escape}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_meslek">{$LANG.aboneMeslekLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.aboneMeslekTooltip|escape}"></i></label>
                <select name="btkdata[abone_meslek]" id="abone_meslek" class="form-control">
                    <option value="">{$LANG.selectOption}</option>
                    {foreach from=$meslekKodlari item=meslek}
                        <option value="{$meslek.kod}" {if $btkData.abone_meslek == $meslek.kod}selected{/if}>{$meslek.kod} - {$meslek.aciklama|escape}</option>
                    {/foreach}
                </select>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_kimlik_tipi">{$LANG.aboneKimlikTipiLabel} * <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.aboneKimlikTipiTooltip|escape}"></i></label>
                <select name="btkdata[abone_kimlik_tipi]" id="abone_kimlik_tipi" class="form-control" required>
                    <option value="">{$LANG.selectOption}</option>
                     {foreach from=$kimlikTipleri item=kimlik}
                        <option value="{$kimlik.kod}" {if $btkData.abone_kimlik_tipi == $kimlik.kod}selected{/if}>{$kimlik.aciklama|escape} ({$kimlik.kod})</option>
                    {/foreach}
                </select>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_kimlik_seri_no">{$LANG.aboneKimlikSeriNoLabel}</label>
                <input type="text" name="btkdata[abone_kimlik_seri_no]" id="abone_kimlik_seri_no" value="{$btkData.abone_kimlik_seri_no|escape}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_kimlik_verildigi_yer">{$LANG.aboneKimlikVerildigiYerLabel}</label>
                <input type="text" name="btkdata[abone_kimlik_verildigi_yer]" id="abone_kimlik_verildigi_yer" value="{$btkData.abone_kimlik_verildigi_yer|escape}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_kimlik_verildigi_tarih">{$LANG.aboneKimlikVerildigiTarihLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.dateFormatYYYYMMDDTooltip|escape}"></i></label>
                <input type="text" name="btkdata[abone_kimlik_verildigi_tarih]" id="abone_kimlik_verildigi_tarih" value="{$btkData.abone_kimlik_verildigi_tarih|escape}" class="form-control date-picker-yyyymmdd" placeholder="YYYYMMDD">
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_kimlik_aidiyeti">{$LANG.aboneKimlikAidiyetiLabel} *</label>
                 <select name="btkdata[abone_kimlik_aidiyeti]" id="abone_kimlik_aidiyeti" class="form-control" required>
                    <option value="B" {if $btkData.abone_kimlik_aidiyeti == 'B' || !$btkData.abone_kimlik_aidiyeti}selected{/if}>{$LANG.kimlikAidiyetiBireysel}</option>
                    <option value="Y" {if $btkData.abone_kimlik_aidiyeti == 'Y'}selected{/if}>{$LANG.kimlikAidiyetiYetkili}</option>
                </select>
            </div>
        </div>
    </div>

    <div class="form-group text-center" style="margin-top: 30px;">
        <button type="submit" class="btn btn-success btn-lg"><i class="fas fa-save"></i> {$LANG.saveChanges}</button>
    </div>
</form>

<script type="text/javascript">
{* JS kodları btk_admin_scripts.js içine taşındı. *}
</script>