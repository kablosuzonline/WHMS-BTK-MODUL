{*
    WHMCS BTK Raporlama Modülü - Ürün Grubu - BTK Yetki Eşleştirme Şablonu
    modules/addons/btkreports/templates/admin/product_group_mappings.tpl
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">

<div class="btk-admin-page-header">
    <div class="btk-page-title">
        <img src="modules/addons/btkreports/logo.png" alt="BTK Modül Logo" style="height: 32px; vertical-align: middle; margin-right: 10px;">
        {$LANG.productgroupmappingstitle|default:'Ürün Grubu - BTK Yetki Eşleştirme'}
    </div>
</div>

{if $successMessage}
    <div class="alert alert-success text-center"><i class="fas fa-check-circle"></i> {$successMessage|nl2br}</div>
{/if}
{if $infoMessage}
    <div class="alert alert-info"><i class="fas fa-info-circle"></i> {$infoMessage|nl2br}</div>
{/if}
{if $errorMessage}
    <div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i> {$errorMessage|nl2br}</div>
{/if}

<form method="post" action="{$modulelink}&action=save_product_group_mappings">
    <input type="hidden" name="token" value="{$csrfToken}">
    <div class="btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-link"></i> {$LANG.mapProductGroupsToBtkAuth|default:'WHMCS Ürün Gruplarını BTK Yetki Türleriyle Eşleştirin'}</h3>
        </div>
        <div class="panel-body">
            <p>{$LANG.productGroupMappingDesc|default:'Bu sayfada, WHMCS sisteminizdeki ürün gruplarını, hangi BTK Yetki Türü (ve dolayısıyla hangi raporlama Tip\'i) kapsamında raporlanacağını belirleyebilirsiniz. Sadece Genel Ayarlar\'da aktif ettiğiniz BTK yetki türleri burada listelenecektir.'}</p>
            <p class="text-info"><i class="fas fa-info-circle"></i> {$LANG.productGroupMappingInfo|default:'Bir ürün grubunu bir BTK Yetki Türü ile eşleştirdiğinizde, o ürün grubundaki tüm hizmetler (ürünler) seçilen yetki türünün gerektirdiği rapor formatına göre (örn: ISS, STH, AIH) raporlanacaktır.'}</p>

            {if $product_groups && $aktif_yetki_turleri_referans}
                <div class="table-responsive top-margin-20">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th style="width:40%;">{$LANG.productGroupName|default:'WHMCS Ürün Grubu'}</th>
                                <th>{$LANG.btkYetkiTuru|default:'Eşleştirilecek BTK Yetki Türü'} <i class="fas fa-info-circle btk-tooltip" title="{$LANG.productGroupMappingTooltip|default:'Her ürün grubu için sadece bir BTK yetki türü seçebilirsiniz. Seçim yapmazsanız veya \'Eşleştirme Yok\' seçerseniz, o gruptaki ürünler BTK raporlarına dahil edilmeyebilir veya varsayılan bir işleme tabi tutulabilir.'}"></i></th>
                            </tr>
                        </thead>
                        <tbody>
                            {foreach from=$product_groups item=group}
                                <tr>
                                    <td><strong>{$group->name|escape}</strong> (ID: {$group->id})</td>
                                    <td>
                                        <select name="mappings[{$group->id}]" class="form-control">
                                            <option value="">-- {$LANG.noMapping|default:'Eşleştirme Yok / Raporlama Dışı'} --</option>
                                            {foreach from=$aktif_yetki_turleri_referans item=yetki}
                                                {* $current_mappings dizisi PHP tarafında gid => yetki_kodu şeklinde hazırlanacak *}
                                                <option value="{$yetki->yetki_kodu|escape}" {if isset($current_mappings[$group->id]) && $current_mappings[$group->id] == $yetki->yetki_kodu}selected{/if}>
                                                    {$yetki->yetki_adi|escape} ({$yetki->grup|escape} - {$yetki->yetki_kodu|escape})
                                                </option>
                                            {/foreach}
                                        </select>
                                    </td>
                                </tr>
                            {/foreach}
                        </tbody>
                    </table>
                </div>
            {else}
                <div class="alert alert-warning top-margin-20">
                    {if !$product_groups}
                        <p>{$LANG.noProductGroupsFound|default:'Sistemde tanımlı ürün grubu bulunamadı. Lütfen önce WHMCS\'te ürün grupları oluşturun.'}</p>
                    {/if}
                    {if !$aktif_yetki_turleri_referans}
                        <p>{$LANG.noActiveBtkAuthTypes|default:'Genel Ayarlar\'da aktif edilmiş ve raporlama grubu tanımlanmış (ISS, AIH, STH vb.) BTK Yetki Türü bulunamadı. Lütfen önce Genel Ayarlar sayfasından yetki türlerini seçip, bu yetki türlerinin referans tablosunda (`mod_btk_yetki_turleri_referans`) "grup" alanlarının dolu olduğundan emin olun.'} <a href="{$modulelink}&action=config">{$LANG.goToConfig|default:'Genel Ayarlara Git'}</a></p>
                    {/if}
                </div>
            {/if}
        </div>
    </div>

    {if $product_groups && $aktif_yetki_turleri_referans}
    <div class="text-center top-margin-20 bottom-margin-20">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$LANG.saveMappings|default:'Eşleştirmeleri Kaydet'}</button>,
        <a href="{$modulelink}" class="btn btn-default btn-lg">{$LANG.cancel}</a>
    </div>
    {/if}
</form>

<script type="text/javascript">
$(document).ready(function() {
    // Tooltip'leri etkinleştir
    if (typeof $.fn.tooltip == 'function') {
        $('.btk-tooltip').tooltip({
            placement: 'top',
            container: 'body'
        });
    }
    // Select2 gibi bir kütüphane ile dropdown'lar daha kullanıcı dostu hale getirilebilir.
    // $('.form-control[name^="mappings["]').select2();
});
</script>