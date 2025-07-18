{*
    WHMCS BTK Raporlama Modülü - Hizmet Detayları Enjeksiyon Bölümü
    Sürüm: 8.0.3 (Zirve) - Kusursuz Entegrasyon
    Bu şablon, AdminAreaViewServicePage hook'u ile hizmet detayları sayfasına enjekte edilir.
*}

{* Bu gizli alan, form gönderildiğinde AdminServiceEdit hook'unun bizim verilerimizi tanımasını sağlar. *}
<input type="hidden" name="btk_service_data_submitted" value="1">

<div style="margin: 15px 0;">
    <div class="section-title">{$LANG.btkServiceInformationTitle}</div>
    <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
        <tbody>
            <tr>
                <td class="fieldlabel" width="20%">{$LANG.serviceHatNoLabel} *</td>
                <td class="fieldarea">
                    <input type="text" name="btk_service_data[hat_no]" value="{$btkServiceData.hat_no|default:$domain|default:$dedicatedip|default:$serviceid|escape}" class="form-control" required>
                    <small class="text-muted">{$LANG.serviceHatNoTooltip}</small>
                </td>
            </tr>
            <tr>
                <td class="fieldlabel">{$LANG.serviceHizmetTipiLabel} *</td>
                <td class="fieldarea">
                    <select name="btk_service_data[hizmet_tipi]" class="form-control select-inline" required>
                        <option value="">{$LANG.selectOption}</option>
                        {if $uygunHizmetTipleri}
                            {foreach from=$uygunHizmetTipleri item=hizmet} 
                                <option value="{$hizmet.hizmet_tipi_kodu}" {if $btkServiceData.hizmet_tipi == $hizmet.hizmet_tipi_kodu}selected{/if}>{$hizmet.hizmet_tipi_aciklamasi|escape} ({$hizmet.hizmet_tipi_kodu})</option>
                            {/foreach}
                        {else}
                            <option value="" disabled>{$LANG.noMatchingServiceType}</option>
                        {/if}
                    </select>
                </td>
            </tr>
            <tr>
                <td class="fieldlabel">{$LANG.serviceAboneBaslangicLabel}</td>
                <td class="fieldarea">
                    <input type="text" name="btk_service_data[abone_baslangic]" value="{$btkServiceData.abone_baslangic|default:$regdate|date_format:"%Y%m%d%H%M%S"|escape}" class="form-control input-150" placeholder="YYYYMMDDHHMMSS">
                    <small class="text-muted">(Format: YYYYAAGGSSddss UTC)</small>
                </td>
            </tr>
            <tr>
                <td class="fieldlabel">{$LANG.serviceAboneTarifeLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_service_data[abone_tarife]" value="{$btkServiceData.abone_tarife|default:$package.name|escape}" class="form-control"></td>
            </tr>
            <tr>
                <td class="fieldlabel">{$LANG.serviceStatikIpLabel}</td>
                <td class="fieldarea"><input type="text" name="btk_service_data[statik_ip]" value="{$btkServiceData.statik_ip|default:$dedicatedip|escape}" class="form-control"></td>
            </tr>

            {* ISS'e Özel Alanlar (Dinamik olarak gösterilir) *}
            {if $mapping.grup == 'ISS'}
                <tr>
                    <td class="fieldlabel">{$LANG.issHizProfiliLabel}</td>
                    <td class="fieldarea"><input type="text" name="btk_service_data[iss_hiz_profili]" value="{$btkServiceData.iss_hiz_profili|escape}" class="form-control" placeholder="Örn: 100 Mbps'e kadar"></td>
                </tr>
                <tr>
                    <td class="fieldlabel">{$LANG.issKullaniciAdiLabel}</td>
                    <td class="fieldarea"><input type="text" name="btk_service_data[iss_kullanici_adi]" value="{$btkServiceData.iss_kullanici_adi|default:$username|escape}" class="form-control"></td>
                </tr>
                 <tr>
                    <td class="fieldlabel">{$LANG.issPopNoktasiLabel}</td>
                    <td class="fieldarea">
                         <select name="btk_service_data[iss_pop_noktasi_id]" class="form-control select-inline">
                            <option value="">{$LANG.selectOption}</option>
                            {if $uygunPopNoktalari}
                                {foreach from=$uygunPopNoktalari item=pop}
                                    <option value="{$pop.id}" {if $btkServiceData.iss_pop_noktasi_id == $pop.id}selected{/if}>{$pop.pop_adi|escape} ({$pop.yayin_yapilan_ssid|escape})</option>
                                {/foreach}
                            {/if}
                        </select>
                    </td>
                </tr>
            {/if}

            {* Tesis Adresi Alanları *}
            <tr>
                <td class="fieldlabel" rowspan="2">{$LANG.serviceTesisAdresiTitle}</td>
                <td class="fieldarea">
                    <div class="bootstrap-switch-wrapper">
                        <input type="checkbox" name="btk_service_data[tesis_adresi_yerlesimle_ayni]" id="tesis_adresi_yerlesimle_ayni" class="bootstrap-switch" {if $tesisAdresiYerlesimleAyni}checked{/if}>
                    </div>
                    <label for="tesis_adresi_yerlesimle_ayni" style="margin-left:5px;">{$LANG.tesisAdresiYerlesimleAyniLabel}</label>
                </td>
            </tr>
            <tr>
                <td class="fieldarea" id="tesisAdresiFormAlani" {if $tesisAdresiYerlesimleAyni}style="display:none;"{/if}>
                    <div class="row">
                        <div class="col-sm-4"><select name="btk_service_data[tesis_il_id]" id="tesis_il_id" class="form-control input-sm adres-il-select" data-target-ilce="tesis_ilce_id" data-preselect-ilce-id="{$btkServiceData.tesis_ilce_id}"><option value="">{$LANG.selectIlOption}</option>{foreach from=$iller item=il}<option value="{$il.id}" {if $btkServiceData.tesis_il_id == $il.id}selected{/if}>{$il.il_adi|escape}</option>{/foreach}</select></div>
                        <div class="col-sm-4"><select name="btk_service_data[tesis_ilce_id]" id="tesis_ilce_id" class="form-control input-sm adres-ilce-select" data-target-mahalle="tesis_mahalle_id" data-preselect-mahalle-id="{$btkServiceData.tesis_mahalle_id}" disabled><option value="">{$LANG.selectIlceOption}</option>{if $tesis_ilceler}{foreach from=$tesis_ilceler item=ilce}<option value="{$ilce.id}" {if $btkServiceData.tesis_ilce_id == $ilce.id}selected{/if}>{$ilce.ilce_adi|escape}</option>{/foreach}{/if}</select></div>
                        <div class="col-sm-4"><select name="btk_service_data[tesis_mahalle_id]" id="tesis_mahalle_id" class="form-control input-sm" disabled><option value="">{$LANG.selectMahalleOption}</option>{if $tesis_mahalleler}{foreach from=$tesis_mahalleler item=mahalle}<option value="{$mahalle.id}" {if $btkServiceData.tesis_mahalle_id == $mahalle.id}selected{/if}>{$mahalle.mahalle_adi|escape}</option>{/foreach}{/if}</select></div>
                    </div>
                    <div class="row" style="margin-top: 10px;">
                        <div class="col-sm-12"><input type="text" name="btk_service_data[tesis_cadde]" value="{$btkServiceData.tesis_cadde|escape}" class="form-control input-sm" placeholder="Cadde / Sokak / Bulvar / Meydan"></div>
                    </div>
                     <div class="row" style="margin-top: 10px;">
                        <div class="col-sm-6"><input type="text" name="btk_service_data[tesis_dis_kapi_no]" value="{$btkServiceData.tesis_dis_kapi_no|escape}" class="form-control input-sm" placeholder="Dış Kapı No"></div>
                        <div class="col-sm-6"><input type="text" name="btk_service_data[tesis_ic_kapi_no]" value="{$btkServiceData.tesis_ic_kapi_no|escape}" class="form-control input-sm" placeholder="İç Kapı No"></div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>