{*
    WHMCS BTK Raporlama Modülü - Hizmet Detayları BTK Bilgi Formu
    Dosya: templates/admin/service_details_btk_form.tpl
    Sürüm: 6.5
*}

{if $btkServiceValidationErrorMessages}
    <div class="alert alert-danger">
        <strong>{$LANG.validationErrorsOccurred}:</strong>
        <ul>
            {foreach from=$btkServiceValidationErrorMessages item=message}
                <li>{$message}</li>
            {/foreach}
        </ul>
    </div>
{/if}

<form method="post" action="{$modulelink}&action=save_service_btk_details&id={$serviceid}&userid={$clientid}"> 
    <input type="hidden" name="token" value="{$csrfToken}">
    <input type="hidden" name="btkservicedata[id]" value="{$btkServiceData.id|default:''}">
    <input type="hidden" name="btkservicedata[whmcs_service_id]" value="{$serviceid}">
    <input type="hidden" name="btkservicedata[whmcs_client_id]" value="{$clientid}">
    {* Bu formun post edildiğini PreAdminServiceEdit hook'unda anlamak için bir trigger *}
    <input type="hidden" name="btk_update_trigger_service" value="1">

    <h4><i class="fas fa-concierge-bell"></i> {$LANG.serviceBtkInfoTitle}</h4>
    <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label for="service_hat_no">{$LANG.serviceHatNoLabel} * <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.serviceHatNoTooltip|escape}"></i></label>
                <input type="text" name="btkservicedata[hat_no]" id="service_hat_no" value="{$btkServiceData.hat_no|default:$whmcsService.domain|default:$whmcsService.dedicatedip|escape}" class="form-control" required>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label for="service_hizmet_tipi">{$LANG.serviceHizmetTipiLabel} * <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.serviceHizmetTipiTooltip|escape}"></i></label>
                <select name="btkservicedata[hizmet_tipi]" id="service_hizmet_tipi" class="form-control" required>
                    <option value="">{$LANG.selectOption}</option>
                    {foreach from=$hizmetTipleri item=hizmet} 
                        <option value="{$hizmet.hizmet_tipi_kodu}" {if $btkServiceData.hizmet_tipi == $hizmet.hizmet_tipi_kodu}selected{/if}>{$hizmet.hizmet_tipi_aciklamasi|escape} ({$hizmet.hizmet_tipi_kodu})</option>
                    {/foreach}
                </select>
            </div>
        </div>
        <div class="col-md-4">
             <div class="form-group">
                <label for="service_abone_tarife">{$LANG.serviceAboneTarifeLabel}</label>
                <input type="text" name="btkservicedata[abone_tarife]" id="service_abone_tarife" value="{$btkServiceData.abone_tarife|default:$whmcsService.package.name|escape}" class="form-control">
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label for="service_abone_baslangic">{$LANG.serviceAboneBaslangicLabel} * <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.dateFormatYYYYMMDDHHMMSSTooltip|escape}"></i></label>
                <input type="text" name="btkservicedata[abone_baslangic]" id="service_abone_baslangic" value="{$btkServiceData.abone_baslangic|default:$whmcsService.regdate|date_format:"%Y%m%d%H%M%S"|escape}" class="form-control datetime-picker" placeholder="YYYYMMDDHHMMSS" required>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label for="service_statik_ip">{$LANG.serviceStatikIpLabel}</label>
                <input type="text" name="btkservicedata[statik_ip]" id="service_statik_ip" value="{$btkServiceData.statik_ip|default:$whmcsService.dedicatedip|escape}" class="form-control" placeholder="Örn: 192.168.1.100">
            </div>
        </div>
    </div>

    <hr>
    <h4><i class="fas fa-map-marked-alt"></i> {$LANG.serviceTesisAdresiTitle} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.serviceTesisAdresiTooltip|escape}"></i></h4>
    <div class="form-group">
        <label>
            <input type="checkbox" name="btkservicedata[tesis_adresi_yerlesimle_ayni]" id="tesis_adresi_yerlesimle_ayni" {if $tesisAdresiYerlesimleAyni}checked{/if}>
            {$LANG.tesisAdresiYerlesimleAyniLabel}
        </label>
    </div>

    <div id="tesisAdresiFormAlani" {if $tesisAdresiYerlesimleAyni}style="display:none;"{/if}>
        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label for="tesis_il_id">{$LANG.adresIlLabel} *</label>
                    <select name="btkservicedata[tesis_il_id]" id="tesis_il_id" class="form-control adres-il-select" data-target-ilce="tesis_ilce_id" {if !$tesisAdresiYerlesimleAyni}required{/if}>
                        <option value="">{$LANG.selectIlOption}</option>
                        {foreach from=$iller item=il}
                            <option value="{$il.id}" {if $btkServiceData.tesis_il_id == $il.id}selected{/if}>{$il.il_adi|escape}</option>
                        {/foreach}
                    </select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="tesis_ilce_id">{$LANG.adresIlceLabel} *</label>
                    <select name="btkservicedata[tesis_ilce_id]" id="tesis_ilce_id" class="form-control adres-ilce-select" data-target-mahalle="tesis_mahalle_id" {if !$tesisAdresiYerlesimleAyni}required{/if}>
                        <option value="">{$LANG.selectIlceOption}</option>
                         {if $tesis_ilceler}
                             {foreach from=$tesis_ilceler item=ilce}
                                <option value="{$ilce.id}" {if $btkServiceData.tesis_ilce_id == $ilce.id}selected{/if}>{$ilce.ilce_adi|escape}</option>
                            {/foreach}
                        {/if}
                    </select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="tesis_mahalle_id">{$LANG.adresMahalleLabel} *</label>
                    <select name="btkservicedata[tesis_mahalle_id]" id="tesis_mahalle_id" class="form-control adres-mahalle-select" {if !$tesisAdresiYerlesimleAyni}required{/if}>
                         <option value="">{$LANG.selectMahalleOption}</option>
                         {if $tesis_mahalleler}
                             {foreach from=$tesis_mahalleler item=mahalle}
                                <option value="{$mahalle.id}" {if $btkServiceData.tesis_mahalle_id == $mahalle.id}selected{/if}>{$mahalle.mahalle_adi|escape}</option>
                            {/foreach}
                        {/if}
                    </select>
                </div>
            </div>
        </div>
         <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="tesis_cadde">{$LANG.adresCaddeSokakLabel}</label>
                    <input type="text" name="btkservicedata[tesis_cadde]" id="tesis_cadde" value="{$btkServiceData.tesis_cadde|escape}" class="form-control">
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label for="tesis_dis_kapi_no">{$LANG.adresDisKapiNoLabel}</label>
                    <input type="text" name="btkservicedata[tesis_dis_kapi_no]" id="tesis_dis_kapi_no" value="{$btkServiceData.tesis_dis_kapi_no|escape}" class="form-control">
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label for="tesis_ic_kapi_no">{$LANG.adresIcKapiNoLabel}</label>
                    <input type="text" name="btkservicedata[tesis_ic_kapi_no]" id="tesis_ic_kapi_no" value="{$btkServiceData.tesis_ic_kapi_no|escape}" class="form-control">
                </div>
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