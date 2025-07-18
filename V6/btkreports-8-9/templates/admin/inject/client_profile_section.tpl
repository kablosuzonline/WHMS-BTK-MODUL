{*
    WHMCS BTK Raporlama Modülü - Müşteri Profili Enjeksiyon Bölümü
    Sürüm: 8.0.3 (Zirve) - Kusursuz Entegrasyon
    Bu şablon, AdminAreaClientProfilePage hook'u ile müşteri profili sayfasına enjekte edilir.
*}

{* Bu gizli alan, form gönderildiğinde ClientEdit hook'unun bizim verilerimizi tanımasını sağlar. *}
<input type="hidden" name="btk_profile_data_submitted" value="1">

<div style="margin: 15px 0;">
    <div class="section-title">{$LANG.aboneTemelBtkBilgileri}</div>
    <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
        <tbody>
            <tr>
                <td class="fieldlabel" width="20%">{$LANG.personelTcKimlikNoHeader}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[abone_tc_kimlik_no]" value="{$btkClientData.abone_tc_kimlik_no|escape}" class="form-control input-250" maxlength="11"></td>
                <td class="fieldlabel" width="20%">{$LANG.abonePasaportNoLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[abone_pasaport_no]" value="{$btkClientData.abone_pasaport_no|escape}" class="form-control input-250"></td>
            </tr>
             <tr>
                <td class="fieldlabel">{$LANG.musteriTipiLabel}</td>
                <td class="fieldarea">
                     <select name="btk_profile_data[musteri_tipi]" id="musteri_tipi_select" class="form-control select-inline">
                        <option value="">{$LANG.selectOption}</option>
                        <option value="G-SAHIS" {if $btkClientData.musteri_tipi == 'G-SAHIS'}selected{/if}>{$LANG.musteriTipiGSahis}</option>
                        <option value="T-SIRKET" {if $btkClientData.musteri_tipi == 'T-SIRKET'}selected{/if}>{$LANG.musteriTipiTSirket}</option>
                     </select>
                </td>
                <td class="fieldlabel">{$LANG.aboneCinsiyetLabel}</td>
                <td class="fieldarea">
                     <select name="btk_profile_data[abone_cinsiyet]" class="form-control select-inline">
                        <option value="">{$LANG.selectOption}</option>
                        <option value="E" {if $btkClientData.abone_cinsiyet == 'E'}selected{/if}>{$LANG.genderMale}</option>
                        <option value="K" {if $btkClientData.abone_cinsiyet == 'K'}selected{/if}>{$LANG.genderFemale}</option>
                    </select>
                </td>
            </tr>
             <tr>
                <td class="fieldlabel">{$LANG.aboneUyrukLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[abone_uyruk]" value="{$btkClientData.abone_uyruk|default:'TUR'|escape}" class="form-control input-100" maxlength="3"></td>
                <td class="fieldlabel">{$LANG.aboneDogumYeriLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[abone_dogum_yeri]" value="{$btkClientData.abone_dogum_yeri|escape}" class="form-control input-250"></td>
            </tr>
             <tr>
                <td class="fieldlabel">{$LANG.aboneDogumTarihiLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[abone_dogum_tarihi]" value="{$btkClientData.abone_dogum_tarihi|escape}" class="form-control date-picker-yyyymmdd" placeholder="YYYYMMDD"></td>
                 <td class="fieldlabel">{$LANG.aboneMeslekLabel}</td>
                <td class="fieldarea">
                    <select name="btk_profile_data[abone_meslek]" class="form-control select-inline">
                        <option value="">{$LANG.selectOption}</option>
                        {foreach from=$meslekKodlari item=meslek}
                            <option value="{$meslek.kod}" {if $btkClientData.abone_meslek == $meslek.kod}selected{/if}>{$meslek.aciklama|escape} ({$meslek.kod})</option>
                        {/foreach}
                    </select>
                </td>
            </tr>
            <tr>
                <td class="fieldlabel">{$LANG.aboneBabaAdiLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[abone_baba_adi]" value="{$btkClientData.abone_baba_adi|escape}" class="form-control input-250"></td>
                <td class="fieldlabel">{$LANG.aboneAnaAdiLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[abone_ana_adi]" value="{$btkClientData.abone_ana_adi|escape}" class="form-control input-250"></td>
            </tr>
             <tr>
                <td class="fieldlabel">{$LANG.aboneKimlikTipiLabel}</td>
                <td class="fieldarea">
                    <select name="btk_profile_data[abone_kimlik_tipi]" class="form-control select-inline">
                        <option value="">{$LANG.selectOption}</option>
                         {foreach from=$kimlikTipleri item=kimlik}
                            <option value="{$kimlik.kod}" {if $btkClientData.abone_kimlik_tipi == $kimlik.kod}selected{/if}>{$kimlik.aciklama|escape} ({$kimlik.kod})</option>
                        {/foreach}
                    </select>
                </td>
                <td class="fieldlabel">{$LANG.aboneKimlikSeriNoLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[abone_kimlik_seri_no]" value="{$btkClientData.abone_kimlik_seri_no|escape}" class="form-control input-250"></td>
            </tr>
            <tr>
                <td class="fieldlabel">{$LANG.aboneVergiNumarasiLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[abone_vergi_numarasi]" value="{$btkClientData.abone_vergi_numarasi|escape}" class="form-control input-250"></td>
                <td class="fieldlabel">{$LANG.aboneMersisNumarasiLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[abone_mersis_numarasi]" value="{$btkClientData.abone_mersis_numarasi|escape}" class="form-control input-250"></td>
            </tr>
            <tr>
                <td class="fieldlabel">{$LANG.aboneKimlikVerildigiYerLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[abone_kimlik_verildigi_yer]" value="{$btkClientData.abone_kimlik_verildigi_yer|escape}" class="form-control input-250"></td>
                <td class="fieldlabel">{$LANG.aboneKimlikVerildigiTarihLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[abone_kimlik_verildigi_tarih]" value="{$btkClientData.abone_kimlik_verildigi_tarih|escape}" class="form-control date-picker-yyyymmdd" placeholder="YYYYMMDD"></td>
            </tr>
            <tr>
                <td class="fieldlabel">{$LANG.aboneKimlikAidiyetiLabel}</td>
                <td class="fieldarea">
                     <select name="btk_profile_data[abone_kimlik_aidiyeti]" class="form-control select-inline">
                        <option value="">{$LANG.selectOption}</option>
                        <option value="B" {if $btkClientData.abone_kimlik_aidiyeti == 'B'}selected{/if}>{$LANG.aboneKimlikAidiyetiB}</option>
                        <option value="Y" {if $btkClientData.abone_kimlik_aidiyeti == 'Y'}selected{/if}>{$LANG.aboneKimlikAidiyetiY}</option>
                    </select>
                </td>
                <td class="fieldlabel"></td>
                <td class="fieldarea"></td>
            </tr>
        </tbody>
    </table>
</div>

{* Kurumsal Müşteriler İçin Yetkili Bilgileri (Dinamik olarak gösterilir/gizlenir) *}
<div id="btkKurumsalAlanlari" style="margin: 15px 0; {if $btkClientData.musteri_tipi != 'T-SIRKET'}display:none;{/if}">
    <div class="section-title">{$LANG.kurumYetkilisiBilgileriTitle}</div>
    <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
        <tbody>
            <tr>
                <td class="fieldlabel" width="20%">{$LANG.kurumYetkiliAdiLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[kurum_yetkili_adi]" value="{$btkClientData.kurum_yetkili_adi|escape}" class="form-control input-250"></td>
                <td class="fieldlabel" width="20%">{$LANG.kurumYetkiliSoyadiLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[kurum_yetkili_soyadi]" value="{$btkClientData.kurum_yetkili_soyadi|escape}" class="form-control input-250"></td>
            </tr>
             <tr>
                <td class="fieldlabel">{$LANG.kurumYetkiliTcKimlikNoLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[kurum_yetkili_tckimlik_no]" value="{$btkClientData.kurum_yetkili_tckimlik_no|escape}" class="form-control input-250" maxlength="11"></td>
                <td class="fieldlabel">{$LANG.kurumYetkiliTelefonLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[kurum_yetkili_telefon]" value="{$btkClientData.kurum_yetkili_telefon|escape}" class="form-control input-250" placeholder="905xxxxxxxxx"></td>
            </tr>
        </tbody>
    </table>
</div>

{* Yerleşim Adresi Bilgileri *}
<div style="margin: 15px 0;">
    <div class="section-title">{$LANG.aboneYerlesimAdresiTitle}</div>
    <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
        <tbody>
            <tr>
                <td class="fieldlabel" width="20%">{$LANG.adresIlLabel}</td>
                <td class="fieldarea">
                    <select name="btk_profile_data[yerlesim_il_id]" id="yerlesim_il_id" class="form-control select-inline adres-il-select" data-target-ilce="yerlesim_ilce_id" data-preselect-ilce-id="{$btkClientData.yerlesim_ilce_id}">
                        <option value="">{$LANG.selectIlOption}</option>
                        {foreach from=$iller item=il}
                            <option value="{$il.id}" {if $btkClientData.yerlesim_il_id == $il.id}selected{/if}>{$il.il_adi|escape}</option>
                        {/foreach}
                    </select>
                </td>
                <td class="fieldlabel" width="20%">{$LANG.adresIlceLabel}</td>
                <td class="fieldarea">
                    <select name="btk_profile_data[yerlesim_ilce_id]" id="yerlesim_ilce_id" class="form-control select-inline adres-ilce-select" data-target-mahalle="yerlesim_mahalle_id" data-preselect-mahalle-id="{$btkClientData.yerlesim_mahalle_id}" disabled>
                        <option value="">{$LANG.selectIlceOption}</option>
                        {if $yerlesim_ilceler}
                            {foreach from=$yerlesim_ilceler item=ilce}
                                <option value="{$ilce.id}" {if $btkClientData.yerlesim_ilce_id == $ilce.id}selected{/if}>{$ilce.ilce_adi|escape}</option>
                            {/foreach}
                        {/if}
                    </select>
                </td>
            </tr>
            <tr>
                <td class="fieldlabel">{$LANG.adresMahalleLabel}</td>
                <td class="fieldarea">
                    <select name="btk_profile_data[yerlesim_mahalle_id]" id="yerlesim_mahalle_id" class="form-control select-inline" disabled>
                        <option value="">{$LANG.selectMahalleOption}</option>
                        {if $yerlesim_mahalleler}
                            {foreach from=$yerlesim_mahalleler item=mahalle}
                                <option value="{$mahalle.id}" {if $btkClientData.yerlesim_mahalle_id == $mahalle.id}selected{/if}>{$mahalle.mahalle_adi|escape}</option>
                            {/foreach}
                        {/if}
                    </select>
                </td>
                <td class="fieldlabel">{$LANG.adresCaddeLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[yerlesim_cadde]" value="{$btkClientData.yerlesim_cadde|escape}" class="form-control"></td>
            </tr>
            <tr>
                <td class="fieldlabel">{$LANG.adresDisKapiNoLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[yerlesim_dis_kapi_no]" value="{$btkClientData.yerlesim_dis_kapi_no|escape}" class="form-control input-100"></td>
                <td class="fieldlabel">{$LANG.adresIcKapiNoLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_profile_data[yerlesim_ic_kapi_no]" value="{$btkClientData.yerlesim_ic_kapi_no|escape}" class="form-control input-100"></td>
            </tr>
        </tbody>
    </table>
</div>