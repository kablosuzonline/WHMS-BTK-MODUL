{*
    WHMCS BTK Raporlama Modülü - Hizmet Detayları Paneli Şablonu
    Sürüm: 20.0.0 (Operasyon PHOENIX)
    AMAÇ: Bu dosya, WHMCS'in "AdminAreaServicesView" kancası aracılığıyla
          hizmet detayları sayfasının altına eklenen panelin tüm HTML
          içeriğini ve JavaScript mantığını barındırır.
*}

<div class="btk-tab-content">
    <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 15px;">
        <h3 style="margin-top: 5px; margin-bottom: 15px; font-size: 18px; color: #4a6785; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">
            <i class="fas fa-satellite-dish"></i> BTK Raporlama Bilgileri
        </h3>
    </div>
    
    <input type="hidden" name="btk_data[submitted]" value="1">
    
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_hat_no" class="control-label required">Hat Numarası *</label>
                <input type="text" name="btk_data[hat_no]" id="btk_hat_no" value="{$btk_data.rehber.hat_no|default:$domain|default:$dedicatedip|default:"S`$serviceid`"|escape}" class="form-control" required>
            </div>
        </div>
        <div class="col-sm-6">
             <div class="form-group">
                <label for="btk_hizmet_tipi" class="control-label required">Hizmet Tipi (EK-3) *</label>
                <select name="btk_data[hizmet_tipi]" id="btk_hizmet_tipi" class="form-control" required>
                    <option value="">Seçiniz</option>
                    {foreach from=$btk_data.uygunHizmetTipleri item=hizmet} 
                        <option value="{$hizmet.hizmet_tipi_kodu}" {if $btk_data.rehber.hizmet_tipi == $hizmet.hizmet_tipi_kodu}selected{/if}>{$hizmet.hizmet_tipi_aciklamasi|escape} ({$hizmet.hizmet_tipi_kodu})</option>
                    {/foreach}
                </select>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_abone_baslangic" class="control-label">Abonelik Başlangıç</label>
                <input type="text" name="btk_data[abone_baslangic]" id="btk_abone_baslangic" value="{$btk_data.rehber.abone_baslangic|default:$regdate|date_format:"%Y%m%d%H%M%S"|escape}" class="form-control" placeholder="YYYYAAGGSSDDSS">
            </div>
        </div>
        <div class="col-sm-6">
             <div class="form-group">
                <label for="btk_abone_bitis" class="control-label">Abonelik Bitiş</label>
                <input type="text" name="btk_data[abone_bitis]" id="btk_abone_bitis" value="{$btk_data.rehber.abone_bitis|escape}" class="form-control" placeholder="YYYYAAGGSSDDSS">
            </div>
        </div>
    </div>
    
     <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <label for="btk_abone_tarife" class="control-label">Tarife Adı</label>
                <input type="text" name="btk_data[abone_tarife]" id="btk_abone_tarife" value="{$btk_data.rehber.abone_tarife|default:$productinfo.name|escape}" class="form-control">
            </div>
        </div>
        <div class="col-sm-6">
             <div class="form-group">
                <label for="btk_statik_ip" class="control-label">Statik IP Adresi</label>
                <input type="text" name="btk_data[statik_ip]" id="btk_statik_ip" value="{$btk_data.rehber.statik_ip|default:$dedicatedip|escape}" class="form-control">
            </div>
        </div>
    </div>
    
    {if $btk_data.mapping.grup == 'ISS'}
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="btk_iss_hiz_profili" class="control-label">Hız Profili</label>
                    <input type="text" name="btk_data[iss_hiz_profili]" id="btk_iss_hiz_profili" value="{$btk_data.rehber.iss_hiz_profili|escape}" class="form-control" placeholder="Örn: 100 Mbps'e kadar">
                </div>
            </div>
            <div class="col-sm-6">
                 <div class="form-group">
                    <label for="btk_iss_pop_noktasi_id" class="control-label">POP Noktası</label>
                    <select name="btk_data[iss_pop_noktasi_id]" id="btk_iss_pop_noktasi_id" class="form-control">
                        <option value="">Seçiniz</option>
                        {foreach from=$btk_data.uygunPopNoktalari item=pop}
                            <option value="{$pop.id}" {if $btk_data.rehber.iss_pop_noktasi_id == $pop.id}selected{/if}>{$pop.pop_adi|escape}</option>
                        {/foreach}
                    </select>
                </div>
            </div>
        </div>
    {/if}
    
    <hr>
    
    <h4><i class="fas fa-map-marked-alt"></i> Tesis / Fatura Adresi</h4>
    <div class="row">
        <div class="col-sm-12">
            <div class="form-group">
                <label class="control-label">Fatura Adresi Seçimi</label>
                <div class="radio">
                    <label class="radio-inline"><input type="radio" name="btk_data[fatura_adresi_secimi]" value="YERLESIM" {if $btk_data.rehber.fatura_adresi_secimi == 'YERLESIM' || !$btk_data.rehber.fatura_adresi_secimi}checked{/if}> Yerleşim (Müşteri Profili) Adresini Kullan</label>
                    <label class="radio-inline"><input type="radio" name="btk_data[fatura_adresi_secimi]" value="TESIS" {if $btk_data.rehber.fatura_adresi_secimi == 'TESIS'}checked{/if}> Aşağıdaki Tesis Adresini Kullan</label>
                </div>
            </div>
        </div>
    </div>

    <div id="btkTesisAdresForm" {if $btk_data.rehber.fatura_adresi_secimi != 'TESIS'}style="display:none;"{/if}>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="btk_tesis_il_id" class="control-label">İl</label>
                    <select name="btk_data[tesis_il_id]" id="btk_tesis_il_id" class="form-control"><option value="">{$LANG.selectIlOption}</option>{foreach from=$btk_data.iller item=il}<option value="{$il.id}" {if $btk_data.rehber.tesis_il_id == $il.id}selected{/if}>{$il.il_adi|escape}</option>{/foreach}</select>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="btk_tesis_ilce_id" class="control-label">İlçe</label>
                    <select name="btk_data[tesis_ilce_id]" id="btk_tesis_ilce_id" class="form-control" disabled><option value="">{$LANG.selectIlceOption}</option>{if $btk_data.tesis_ilceler}{foreach $btk_data.tesis_ilceler as $ilce}<option value="{$ilce.id}" {if $btk_data.rehber.tesis_ilce_id == $ilce.id}selected{/if}>{$ilce.name}</option>{/foreach}{/if}</select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="btk_tesis_mahalle_id" class="control-label">Mahalle</label>
                    <select name="btk_data[tesis_mahalle_id]" id="btk_tesis_mahalle_id" class="form-control" disabled><option value="">{$LANG.selectMahalleOption}</option>{if $btk_data.tesis_mahalleler}{foreach $btk_data.tesis_mahalleler as $mahalle}<option value="{$mahalle.id}" {if $btk_data.rehber.tesis_mahalle_id == $mahalle.id}selected{/if}>{$mahalle.name}</option>{/foreach}{/if}</select>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="btk_tesis_cadde" class="control-label">Cadde/Sokak</label>
                    <input type="text" name="btk_data[tesis_cadde]" id="btk_tesis_cadde" value="{$btk_data.rehber.tesis_cadde|escape}" class="form-control">
                </div>
            </div>
        </div>
         <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="btk_tesis_dis_kapi_no" class="control-label">Kapı Numarası</label>
                    <div class="row" style="margin: 0 -5px;">
                        <div class="col-sm-6" style="padding: 0 5px;"><input type="text" name="btk_data[tesis_dis_kapi_no]" id="btk_tesis_dis_kapi_no" value="{$btk_data.rehber.tesis_dis_kapi_no|escape}" class="form-control" placeholder="Dış Kapı No"></div>
                        <div class="col-sm-6" style="padding: 0 5px;"><input type="text" name="btk_data[tesis_ic_kapi_no]" id="btk_tesis_ic_kapi_no" value="{$btk_data.rehber.tesis_ic_kapi_no|escape}" class="form-control" placeholder="İç Kapı No"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>