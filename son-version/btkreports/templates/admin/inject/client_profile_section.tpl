{*
    WHMCS BTK Raporlama Modülü - Müşteri Profili Enjeksiyon Bölümü
    Sürüm: 7.2 (Operatör) - Kusursuz Entegrasyon
    Bu şablon, AdminAreaClientProfilePage hook'u ile müşteri profili sayfasına enjekte edilir.
*}

<div class="clientssummarybox" style="margin-top:15px;">
    <div class="title"><i class="fas fa-user-tag"></i> {$LANG.aboneTemelBtkBilgileri}</div>
    
    {* Temel Kimlik Bilgileri *}
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.personelTcKimlikNoHeader}</div>
            <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_tc_kimlik_no]" value="{$btkClientData.abone_tc_kimlik_no|escape}" class="form-control input-sm" maxlength="11" placeholder="Vatandaşlar için 11 haneli TCKN"></div>
        </div>
    </div>
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.abonePasaportNoLabel}</div>
            <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_pasaport_no]" value="{$btkClientData.abone_pasaport_no|escape}" class="form-control input-sm" placeholder="Yabancı uyruklular için pasaport numarası"></div>
        </div>
    </div>
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.musteriTipiLabel}</div>
            <div class="col-sm-9">
                 <select name="btk_profile_data[musteri_tipi]" id="musteri_tipi_select" class="form-control input-sm">
                    <option value="">{$LANG.selectOption}</option>
                    <option value="G-SAHIS" {if $btkClientData.musteri_tipi == 'G-SAHIS'}selected{/if}>{$LANG.musteriTipiGSahis}</option>
                    <option value="T-SIRKET" {if $btkClientData.musteri_tipi == 'T-SIRKET'}selected{/if}>{$LANG.musteriTipiTSirket}</option>
                 </select>
            </div>
        </div>
    </div>
    
    {* Kişisel Detaylar *}
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.aboneCinsiyetLabel}</div>
            <div class="col-sm-9">
                 <select name="btk_profile_data[abone_cinsiyet]" class="form-control input-sm">
                    <option value="">{$LANG.selectOption}</option>
                    <option value="E" {if $btkClientData.abone_cinsiyet == 'E'}selected{/if}>{$LANG.genderMale}</option>
                    <option value="K" {if $btkClientData.abone_cinsiyet == 'K'}selected{/if}>{$LANG.genderFemale}</option>
                </select>
            </div>
        </div>
    </div>
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.aboneUyrukLabel}</div>
            <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_uyruk]" value="{$btkClientData.abone_uyruk|default:'TUR'|escape}" class="form-control input-sm" maxlength="3" placeholder="Örn: TUR, DEU, GBR"></div>
        </div>
    </div>
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.aboneBabaAdiLabel}</div>
            <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_baba_adi]" value="{$btkClientData.abone_baba_adi|escape}" class="form-control input-sm"></div>
        </div>
    </div>
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.aboneAnaAdiLabel}</div>
            <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_ana_adi]" value="{$btkClientData.abone_ana_adi|escape}" class="form-control input-sm"></div>
        </div>
    </div>
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.aboneDogumYeriLabel}</div>
            <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_dogum_yeri]" value="{$btkClientData.abone_dogum_yeri|escape}" class="form-control input-sm"></div>
        </div>
    </div>
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.aboneDogumTarihiLabel} (YYYYMMDD)</div>
            <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_dogum_tarihi]" value="{$btkClientData.abone_dogum_tarihi|escape}" class="form-control input-sm" placeholder="Örn: 19851231"></div>
        </div>
    </div>
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.aboneMeslekLabel}</div>
            <div class="col-sm-9">
                <select name="btk_profile_data[abone_meslek]" class="form-control input-sm">
                    <option value="">{$LANG.selectOption}</option>
                    {foreach from=$meslekKodlari item=meslek}
                        <option value="{$meslek.kod}" {if $btkClientData.abone_meslek == $meslek.kod}selected{/if}>{$meslek.aciklama|escape} ({$meslek.kod})</option>
                    {/foreach}
                </select>
            </div>
        </div>
    </div>

    {* Kimlik Detayları *}
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.aboneKimlikTipiLabel}</div>
            <div class="col-sm-9">
                <select name="btk_profile_data[abone_kimlik_tipi]" class="form-control input-sm">
                    <option value="">{$LANG.selectOption}</option>
                     {foreach from=$kimlikTipleri item=kimlik}
                        <option value="{$kimlik.kod}" {if $btkClientData.abone_kimlik_tipi == $kimlik.kod}selected{/if}>{$kimlik.aciklama|escape} ({$kimlik.kod})</option>
                    {/foreach}
                </select>
            </div>
        </div>
    </div>
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.aboneKimlikSeriNoLabel}</div>
            <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_kimlik_seri_no]" value="{$btkClientData.abone_kimlik_seri_no|escape}" class="form-control input-sm"></div>
        </div>
    </div>
</div>

{* Kurumsal Müşteriler İçin Yetkili Bilgileri (Dinamik olarak gösterilir/gizlenir) *}
<div id="btkKurumsalAlanlari" class="clientssummarybox" style="margin-top:15px; {if $btkClientData.musteri_tipi != 'T-SIRKET'}display:none;{/if}">
    <div class="title"><i class="fas fa-user-shield"></i> {$LANG.kurumYetkilisiBilgileriTitle}</div>
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.kurumYetkiliAdiLabel}</div>
            <div class="col-sm-9"><input type="text" name="btk_profile_data[kurum_yetkili_adi]" value="{$btkClientData.kurum_yetkili_adi|escape}" class="form-control input-sm"></div>
        </div>
    </div>
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.kurumYetkiliSoyadiLabel}</div>
            <div class="col-sm-9"><input type="text" name="btk_profile_data[kurum_yetkili_soyadi]" value="{$btkClientData.kurum_yetkili_soyadi|escape}" class="form-control input-sm"></div>
        </div>
    </div>
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.kurumYetkiliTcKimlikNoLabel}</div>
            <div class="col-sm-9"><input type="text" name="btk_profile_data[kurum_yetkili_tckimlik_no]" value="{$btkClientData.kurum_yetkili_tckimlik_no|escape}" class="form-control input-sm" maxlength="11"></div>
        </div>
    </div>
    <div class="fieldarea">
        <div class="row">
            <div class="col-sm-3">{$LANG.kurumYetkiliTelefonLabel}</div>
            <div class="col-sm-9"><input type="text" name="btk_profile_data[kurum_yetkili_telefon]" value="{$btkClientData.kurum_yetkili_telefon|escape}" class="form-control input-sm" placeholder="905xxxxxxxxx"></div>
        </div>
    </div>
</div>