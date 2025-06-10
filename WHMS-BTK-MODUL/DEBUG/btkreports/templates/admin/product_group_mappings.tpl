{*
    WHMCS BTK Raporlama Modülü - Ürün Grubu - BTK Yetki ve Hizmet Tipi Eşleştirme Şablonu
    modules/addons/btkreports/templates/admin/product_group_mappings.tpl
    Bu şablon, btkreports.php içindeki btk_page_product_group_mappings() fonksiyonu tarafından doldurulur.
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">
{* Select2 gibi kütüphaneler için CSS dosyası da buraya eklenebilir *}

{if $successMessage}
    <div class="alert alert-success text-center" role="alert"><i class="fas fa-check-circle"></i> {$successMessage|nl2br}</div>
{/if}
{if $infoMessage}
    <div class="alert alert-info" role="alert"><i class="fas fa-info-circle"></i> {$infoMessage|nl2br}</div>
{/if}
{if $errorMessage}
    <div class="alert alert-danger" role="alert"><i class="fas fa-exclamation-triangle"></i> {$errorMessage|nl2br}</div>
{/if}

<form method="post" action="{$modulelink}&action=save_product_group_mappings" id="productGroupMappingForm">
    <input type="hidden" name="token" value="{$csrfToken}">
    <div class="btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-link"></i> {$LANG.productgroupmappingstitle|default:'Ürün Grubu - BTK Yetki ve Hizmet Tipi Eşleştirme'}</h3>
        </div>
        <div class="panel-body">
            <p>{$LANG.productGroupMappingDescV2|default:'Bu sayfada, WHMCS sisteminizdeki ürün gruplarını, hangi <strong>Ana BTK Yetki Türü Grubu</strong> (dosya adındaki TİP için örn: ISS, STH) ve hangi spesifik <strong>BTK EK-3 Hizmet Tipi</strong> (rapor içindeki HIZMET_TIPI alanı için örn: ADSL, FIBER) kapsamında raporlanacağını belirleyebilirsiniz.'}</p>
            <p class="text-info small"><i class="fas fa-info-circle"></i> {$LANG.productGroupMappingInfoV2|default:'Sadece "Genel Ayarlar"da aktif ettiğiniz Ana BTK Yetki Türleri burada listelenir. Bir Ana Yetki Türü seçtikten sonra, o yetki türüyle ilişkili (veya tüm) EK-3 Hizmet Tipleri ikinci dropdown\'da görünecektir (JavaScript ile filtrelenir). Eşleştirme yapmazsanız, o gruptaki ürünler BTK raporlarına dahil edilmeyebilir.'}</p>

            {if $product_groups && $aktif_ana_yetki_turleri_referans}
                <div class="table-responsive top-margin-20">
                    <table class="table table-bordered table-striped table-btk-list" id="productGroupMappingsTable">
                        <thead>
                            <tr>
                                <th style="width:35%;">{$LANG.productGroupName|default:'WHMCS Ürün Grubu'}</th>
                                <th style="width:30%;">{$LANG.anaBtkYetkiTuru|default:'Ana BTK Yetki Türü (Rapor Dosya Tipi)'} <i class="fas fa-info-circle btk-tooltip" title="{$LANG.anaBtkYetkiTuruTooltip|default:'Bu seçim, rapor dosyasının adındaki TİP bölümünü (örn: ISS, STH) belirler. Sadece Genel Ayarlar\'da aktif edilenler listelenir.'|escape:'html'}"></i></th>
                                <th style="width:35%;">{$LANG.ek3HizmetTipi|default:'BTK EK-3 Hizmet Tipi (Rapor İçi Alan)'} <i class="fas fa-info-circle btk-tooltip" title="{$LANG.ek3HizmetTipiTooltip|default:'Bu seçim, rapor dosyasının içindeki HIZMET_TIPI alanını belirler. Seçilen Ana Yetki Türüne göre filtrelenecektir.'|escape:'html'}"></i></th>
                            </tr>
                        </thead>
                        <tbody>
                            {foreach from=$product_groups item=group}
                                <tr>
                                    <td>
                                        <strong>{$group.name|escape:'html'}</strong><br>
                                        <small>(ID: {$group.id})</small>
                                    </td>
                                    <td>
                                        <select name="mappings[{$group.id}][ana_btk_yetki_kodu]" class="form-control input-sm btk-ana-yetki-select" data-gid="{$group.id}" data-target-ek3="#ek3_hizmet_tipi_{$group.id}">
                                            <option value="">-- {$LANG.noMapping|default:'Eşleştirme Yok / Raporlama Dışı'} --</option>
                                            {if $aktif_ana_yetki_turleri_referans}
                                                {foreach from=$aktif_ana_yetki_turleri_referans item=yetki}
                                                    <option value="{$yetki->yetki_kodu|escape:'html'}" data-grup="{$yetki->grup|escape:'html'}" {if isset($current_mappings[$group.id]) && $current_mappings[$group.id].ana_btk_yetki_kodu == $yetki->yetki_kodu}selected{/if}>
                                                        {$yetki->yetki_adi|escape:'html'} ({$yetki->grup|escape:'html'})
                                                    </option>
                                                {/foreach}
                                            {/if}
                                        </select>
                                    </td>
                                    <td>
                                        <select name="mappings[{$group.id}][ek3_hizmet_tipi_kodu]" id="ek3_hizmet_tipi_{$group.id}" class="form-control input-sm btk-ek3-hizmet-tipi-select" {if !(isset($current_mappings[$group.id]) && !empty($current_mappings[$group.id].ana_btk_yetki_kodu))}disabled{/if}>
                                            <option value="">-- {if isset($current_mappings[$group.id]) && !empty($current_mappings[$group.id].ana_btk_yetki_kodu)}{$LANG.selectOne}{else}{$LANG.onceAnaYetkiSecin}{/if} --</option>
                                            {* Bu bölüm JavaScript ile dinamik olarak veya PHP'de önceden filtrelenmiş veri ile doldurulacak.
                                               $ek3_hizmet_tipleri_for_group[$ana_yetki_grup_kodu] gibi bir yapı PHP'den gelebilir.
                                               Şimdilik JS'e bırakıyoruz, ama mevcut seçimi göstermek için:
                                            *}
                                            {if isset($current_mappings[$group.id]) && !empty($current_mappings[$group.id].ana_btk_yetki_kodu) && isset($tum_ek3_hizmet_tipleri_referans)}
                                                {foreach from=$tum_ek3_hizmet_tipleri_referans item=ek3tip}
                                                    {if $ek3tip->ana_yetki_grup == $current_mappings[$group.id].ana_btk_yetki_kodu_grup || empty($ek3tip->ana_yetki_grup) || empty($current_mappings[$group.id].ana_btk_yetki_kodu_grup) } {* Basit filtreleme veya tümünü göster *}
                                                        <option value="{$ek3tip->hizmet_tipi_kodu|escape:'html'}" {if $current_mappings[$group.id].ek3_hizmet_tipi_kodu == $ek3tip->hizmet_tipi_kodu}selected{/if}>
                                                            {$ek3tip->hizmet_tipi_aciklamasi|escape:'html'} ({$ek3tip->hizmet_tipi_kodu|escape:'html'})
                                                        </option>
                                                    {/if}
                                                {/foreach}
                                            {/if}
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
                    {if !$aktif_ana_yetki_turleri_referans}
                        <p>{$LANG.noActiveBtkAuthTypesV2|default:'Genel Ayarlar\'da aktif edilmiş ve raporlama grubu (`grup` alanı) tanımlanmış Ana BTK Yetki Türü bulunamadı. Lütfen önce Genel Ayarlar sayfasından ana yetki türlerini seçip, bu yetki türlerinin referans tablosunda (`mod_btk_yetki_turleri_referans`) "grup" alanlarının (ISS, STH vb.) dolu olduğundan emin olun.'} <a href="{$modulelink}&action=config">{$LANG.goToConfig|default:'Genel Ayarlara Git'}</a></p>
                    {/if}
                </div>
            {/if}
        </div>
    </div>

    {if $product_groups && $aktif_ana_yetki_turleri_referans}
    <div class="text-center top-margin-20 bottom-margin-20">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$LANG.saveMappings|default:'Eşleştirmeleri Kaydet'}</button>
        <a href="{$modulelink}" class="btn btn-default btn-lg">{$LANG.cancel}</a>
    </div>
    {/if}
</form>

{* Tüm EK-3 Hizmet Tiplerini JavaScript'e aktaralım (Ana Yetki Grubuna göre filtrelemek için) *}
{* Bu değişken btk_page_product_group_mappings fonksiyonunda Smarty'ye atanmalı *}
<script type="text/javascript">
    var allEk3HizmetTipleriByGroup = {$tum_ek3_hizmet_tipleri_by_grup_json|default:'{}'};
    var langSelectOne = '{$LANG.selectOne|escape:"javascript"}';
    var langNoEk3ForThisGroup = '{$LANG.noEk3ForThisGroup|escape:"javascript"|default:"Bu gruba uygun EK-3 hizmet tipi yok."}';
    var langOnceAnaYetkiSecin = '{$LANG.onceAnaYetkiSecin|escape:"javascript"}';
</script>

{* Bu sayfaya özel JavaScript etkileşimleri btk_admin_scripts.js dosyasına taşınacak.
   Şimdilik temel dinamik dropdown mantığını burada bırakıyorum, daha sonra merkezi JS'e alınacak.
*}
<script type="text/javascript">
$(document).ready(function() {
    if (typeof $.fn.tooltip == 'function') {
        $('.btk-tooltip').tooltip({ placement: 'top', container: 'body', html: true });
    }

    function populateEk3Dropdown(anaYetkiSelect) {
        var selectedAnaYetkiGrup = $(anaYetkiSelect).find('option:selected').data('grup');
        var targetEk3SelectId = $(anaYetkiSelect).data('target-ek3');
        var targetEk3Select = $(targetEk3SelectId);
        var currentEk3Value = targetEk3Select.data('current-value'); // Mevcut değeri saklamak için

        targetEk3Select.empty().prop('disabled', true);

        if (selectedAnaYetkiGrup && allEk3HizmetTipleriByGroup[selectedAnaYetkiGrup]) {
            targetEk3Select.append($('<option>', { value: "", text: langSelectOne }));
            var hasOptions = false;
            $.each(allEk3HizmetTipleriByGroup[selectedAnaYetkiGrup], function(index, ek3tip) {
                targetEk3Select.append($('<option>', {
                    value: ek3tip.kod,
                    text: ek3tip.ad + ' (' + ek3tip.kod + ')'
                }));
                hasOptions = true;
            });
            targetEk3Select.prop('disabled', !hasOptions);
            if (!hasOptions){
                 targetEk3Select.append($('<option>', { value: "", text: langNoEk3ForThisGroup }));
            } else if (currentEk3Value) {
                 targetEk3Select.val(currentEk3Value); // Eğer önceden seçili bir değer varsa onu tekrar seç
            }
        } else if (selectedAnaYetkiGrup) { // Ana grup seçili ama ona uygun EK-3 yoksa
            targetEk3Select.append($('<option>', { value: "", text: langNoEk3ForThisGroup }));
        } else { // Ana grup seçilmemişse
             targetEk3Select.append($('<option>', { value: "", text: langOnceAnaYetkiSecin }));
        }
    }

    // Ana BTK Yetki Türü seçildiğinde, EK-3 Hizmet Tipi dropdown'ını dinamik olarak doldur
    $('.btk-ana-yetki-select').change(function() {
        // Mevcut değeri sıfırla ki yeniden seçilsin
        var targetEk3SelectId = $(this).data('target-ek3');
        $(targetEk3SelectId).data('current-value', ''); 
        populateEk3Dropdown(this);
    });

    // Sayfa yüklendiğinde mevcut seçili ana yetkilere göre EK-3'leri doldur
    $('.btk-ana-yetki-select').each(function(){
        // TPL içinde PHP'den gelen $current_mappings ile EK-3 select'inin <option>'ları zaten doldurulmuş olabilir.
        // Bu JS kodu, o anki ana yetki seçimine göre EK-3'ü yeniden doldurur.
        // Eğer PHP tarafı EK-3'ü doğru dolduruyorsa, bu ilk tetiklemeye gerek kalmayabilir
        // veya sadece `data-current-value` set edilebilir.
        var targetEk3SelectId = $(this).data('target-ek3');
        $(targetEk3SelectId).data('current-value', $(targetEk3SelectId).val()); // Mevcut seçili değeri JS'e aktar
        populateEk3Dropdown(this); // Ana yetki seçimine göre EK-3'leri doldur
    });
});
</script>