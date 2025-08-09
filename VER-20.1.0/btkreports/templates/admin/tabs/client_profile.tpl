{*
    WHMCS BTK Raporlama Modülü - Müşteri Profili Sekmesi Şablonu
    Sürüm: 20.0.0 (Operasyon PHOENIX)
    AMAÇ: Bu dosya, WHMCS'in "AdminClientProfileTabFields" kancası aracılığıyla
          müşteri profiline eklenen "BTK Bilgileri" sekmesinin tüm HTML
          içeriğini ve JavaScript mantığını barındırır.
*}

<div id="btkClientProfileTab" class="btk-tab-content">
    
    <input type="hidden" name="btk_data[submitted]" value="1">
    
    <h4><i class="fas fa-id-card"></i> Yasal Bilgiler</h4>
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_musteri_tipi" class="control-label">Müşteri Tipi</label>
                <select name="btk_data[musteri_tipi]" id="btk_musteri_tipi" class="form-control">
                    <option value="">Seçiniz</option>
                    <option value="G-SAHIS" {if $btk_data.rehber.musteri_tipi == 'G-SAHIS'}selected{/if}>Gerçek Kişi</option>
                    <option value="T-SIRKET" {if $btk_data.rehber.musteri_tipi == 'T-SIRKET'}selected{/if}>Tüzel Kişi</option>
                </select>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_abone_uyruk" class="control-label">Uyruk</label>
                <input type="text" name="btk_data[abone_uyruk]" id="btk_abone_uyruk" value="{$btk_data.rehber.abone_uyruk|default:'TUR'|escape}" class="form-control" maxlength="3">
            </div>
        </div>
    </div>
    
    <div class="row btk-bireysel-alan">
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_abone_tc_kimlik_no" class="control-label">T.C. Kimlik No</label>
                <input type="text" name="btk_data[abone_tc_kimlik_no]" id="btk_abone_tc_kimlik_no" value="{$btk_data.rehber.abone_tc_kimlik_no|escape}" class="form-control" maxlength="11">
            </div>
        </div>
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_abone_pasaport_no" class="control-label">Pasaport No</label>
                <input type="text" name="btk_data[abone_pasaport_no]" id="btk_abone_pasaport_no" value="{$btk_data.rehber.abone_pasaport_no|escape}" class="form-control">
            </div>
        </div>
    </div>

    <div class="row btk-kurumsal-alan" style="display:none;">
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_abone_vergi_numarasi" class="control-label">Vergi Numarası</label>
                <input type="text" name="btk_data[abone_vergi_numarasi]" id="btk_abone_vergi_numarasi" value="{$btk_data.rehber.abone_vergi_numarasi|escape}" class="form-control" maxlength="10">
            </div>
        </div>
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_abone_mersis_numarasi" class="control-label">Mersis Numarası</label>
                <input type="text" name="btk_data[abone_mersis_numarasi]" id="btk_abone_mersis_numarasi" value="{$btk_data.rehber.abone_mersis_numarasi|escape}" class="form-control" maxlength="16">
            </div>
        </div>
    </div>

    <div class="row btk-bireysel-alan">
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_abone_baba_adi" class="control-label">Baba Adı</label>
                <input type="text" name="btk_data[abone_baba_adi]" id="btk_abone_baba_adi" value="{$btk_data.rehber.abone_baba_adi|escape}" class="form-control">
            </div>
        </div>
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_abone_ana_adi" class="control-label">Ana Adı</label>
                <input type="text" name="btk_data[abone_ana_adi]" id="btk_abone_ana_adi" value="{$btk_data.rehber.abone_ana_adi|escape}" class="form-control">
            </div>
        </div>
    </div>

    <div class="row btk-bireysel-alan">
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_abone_cinsiyet" class="control-label">Cinsiyet</label>
                <select name="btk_data[abone_cinsiyet]" id="btk_abone_cinsiyet" class="form-control">
                    <option value="">Seçiniz</option>
                    <option value="E" {if $btk_data.rehber.abone_cinsiyet == 'E'}selected{/if}>Erkek</option>
                    <option value="K" {if $btk_data.rehber.abone_cinsiyet == 'K'}selected{/if}>Kadın</option>
                </select>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_abone_dogum_tarihi" class="control-label">Doğum Tarihi</label>
                <input type="text" name="btk_data[abone_dogum_tarihi]" id="btk_abone_dogum_tarihi" value="{$btk_data.rehber.abone_dogum_tarihi|escape}" class="form-control date-picker-yyyymmdd" placeholder="YYYYAAGG">
            </div>
        </div>
    </div>
    
    <div class="row">
        <div class="col-sm-6">
             <div class="form-group">
                <label for="btk_nvi_verify_btn" class="control-label">NVI KPS Doğrulama</label>
                <div>
                    <button type="button" id="btk_nvi_verify_btn" class="btn btn-info"><i class="fas fa-user-check"></i> {$LANG.nviVerifyButton}</button>
                    <span id="nvi_verify_result" class="nvi-verify-result" style="margin-left:15px; display:inline-block;"></span>
                </div>
            </div>
        </div>
    </div>
    
    <hr>
    
    <h4><i class="fas fa-map-marker-alt"></i> Yerleşim Adresi</h4>
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_yerlesim_il_id" class="control-label">İl</label>
                <select name="btk_data[yerlesim_il_id]" id="btk_yerlesim_il_id" class="form-control"><option value="">{$LANG.selectIlOption}</option>{foreach from=$btk_data.iller item=il}<option value="{$il.id}" {if $btk_data.rehber.yerlesim_il_id == $il.id}selected{/if}>{$il.il_adi|escape}</option>{/foreach}</select>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_yerlesim_ilce_id" class="control-label">İlçe</label>
                <select name="btk_data[yerlesim_ilce_id]" id="btk_yerlesim_ilce_id" class="form-control" disabled><option value="">{$LANG.selectIlceOption}</option>{if $btk_data.yerlesim_ilceler}{foreach $btk_data.yerlesim_ilceler as $ilce}<option value="{$ilce.id}" {if $btk_data.rehber.yerlesim_ilce_id == $ilce.id}selected{/if}>{$ilce.name}</option>{/foreach}{/if}</select>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_yerlesim_mahalle_id" class="control-label">Mahalle</label>
                <select name="btk_data[yerlesim_mahalle_id]" id="btk_yerlesim_mahalle_id" class="form-control" disabled><option value="">{$LANG.selectMahalleOption}</option>{if $btk_data.yerlesim_mahalleler}{foreach $btk_data.yerlesim_mahalleler as $mahalle}<option value="{$mahalle.id}" {if $btk_data.rehber.yerlesim_mahalle_id == $mahalle.id}selected{/if}>{$mahalle.name}</option>{/foreach}{/if}</select>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_yerlesim_cadde" class="control-label">Cadde/Sokak</label>
                <input type="text" name="btk_data[yerlesim_cadde]" id="btk_yerlesim_cadde" value="{$btk_data.rehber.yerlesim_cadde|escape}" class="form-control">
            </div>
        </div>
    </div>
     <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_yerlesim_dis_kapi_no" class="control-label">Kapı Numarası</label>
                <div class="row" style="margin: 0 -5px;">
                    <div class="col-sm-6" style="padding: 0 5px;"><input type="text" name="btk_data[yerlesim_dis_kapi_no]" id="btk_yerlesim_dis_kapi_no" value="{$btk_data.rehber.yerlesim_dis_kapi_no|escape}" class="form-control" placeholder="Dış Kapı No"></div>
                    <div class="col-sm-6" style="padding: 0 5px;"><input type="text" name="btk_data[yerlesim_ic_kapi_no]" id="btk_yerlesim_ic_kapi_no" value="{$btk_data.rehber.yerlesim_ic_kapi_no|escape}" class="form-control" placeholder="İç Kapı No"></div>
                </div>
            </div>
        </div>
    </div>
</div>

{* Bu sekme için gerekli olan tüm JavaScript kodları, hooks.php içindeki AdminAreaHeadOutput kancası ile yüklenir *}