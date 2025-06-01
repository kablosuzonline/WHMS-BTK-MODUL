{* modules/addons/btkreports/templates/admin/product_group_mappings.tpl (v1.0.23) *}

{if $action eq 'productGroupMappings'} {* Bu başlık sadece bu action için görünsün *}
    <div class="btk-header-container" style="margin-bottom: 15px;">
        <div class="btk-module-title">
            <i class="fas fa-link" style="font-size: 1.5em; margin-right: 8px; vertical-align: middle;"></i>
            <h2 style="display: inline-block; vertical-align: middle; margin-top: 0; margin-bottom: 0;">{$_ADDONLANG.btkreports_tab_product_mappings}</h2>
        </div>
    </div>
{/if}

{if isset($successMessage) && $successMessage}
    <div class="alert alert-success text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-check-circle"></i> {$successMessage}
    </div>
{/if}
{if isset($errorMessage) && $errorMessage}
    <div class="alert alert-danger text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-times-circle"></i> {$errorMessage}
    </div>
{/if}

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-sitemap"></i> {$_ADDONLANG.btkreports_pgmap_title|default:'Ürün Grubu - BTK Yetki Türü Eşleştirme'}</h3>
    </div>
    <div class="panel-body">
        <p>{$_ADDONLANG.btkreports_pgmap_description|default:'WHMCS ürün gruplarınızı, BTK Yetki Türü ve varsayılan Hizmet Tipi ile eşleştirin. Bu eşleştirmeler, yeni hizmetler için varsayılan değerleri belirleyecektir.'}</p>
        <p><strong>{$_ADDONLANG.btkreports_note|default:'Not'}:</strong> {$_ADDONLANG.btkreports_pgmap_note_auth_types|default:'"BTK Yetki Türü" dropdown menüsünde sadece modül ayarlarında aktif olarak seçtiğiniz yetki türleri listelenir.'}</p>

        <form method="post" action="{$modulelink}&action=productGroupMappings">
            <input type="hidden" name="token" value="{$csrfToken}">

            <div class="table-responsive">
                <table class="table table-striped datatable" width="100%" id="tableProductGroupMappings">
                    <thead>
                        <tr>
                            <th>{$_ADDONLANG.btkreports_pgmap_table_header_group|default:'WHMCS Ürün Grubu'}</th>
                            <th>{$_ADDONLANG.btkreports_pgmap_table_header_auth_type|default:'BTK Yetki Türü'}</th>
                            <th>{$_ADDONLANG.btkreports_pgmap_table_header_service_type|default:'Varsayılan Hizmet Tipi (EK-3)'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foreach from=$productGroups item=group}
                            <tr>
                                <td>{$group->groupname} (ID: {$group->gid})</td>
                                <td>
                                    <select name="mappings[{$group->gid}][btk_yetki_turu_kodu]" class="form-control btk-yetki-turu-select" data-group-id="{$group->gid}">
                                        <option value="">{$_ADDONLANG.btkreports_pgmap_select_auth_type|default:'-- Yetki Türü Seçin --'}</option>
                                        {foreach from=$availableYetkiTurleri item=yetki}
                                            <option value="{$yetki->yetki_kodu}" {if $group->btk_yetki_turu_kodu == $yetki->yetki_kodu}selected{/if}>
                                                {$yetki->yetki_adi} ({$yetki->yetki_kodu})
                                            </option>
                                        {/foreach}
                                    </select>
                                </td>
                                <td>
                                    <select name="mappings[{$group->gid}][default_btk_hizmet_tipi_kodu]" id="hizmet-tipi-group-{$group->gid}" class="form-control btk-hizmet-tipi-select">
                                        <option value="">{$_ADDONLANG.btkreports_pgmap_select_service_type|default:'-- Hizmet Tipi Seçin (Opsiyonel) --'}</option>
                                        {* Bu kısım JavaScript ile doldurulacak *}
                                    </select>
                                </td>
                            </tr>
                        {foreachelse}
                            <tr>
                                <td colspan="3" class="text-center">{$_ADDONLANG.btkreports_pgmap_no_groups_found|default:'Eşleştirilecek WHMCS ürün grubu bulunamadı.'}</td>
                            </tr>
                        {/foreach}
                    </tbody>
                </table>
            </div>

            {if $productGroups && count($productGroups) > 0}
                <div class="form-group text-center" style="margin-top: 20px;">
                    <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$_ADDONLANG.btkreports_save_changes}</button>
                    <a href="{$modulelink}&action=index" class="btn btn-default btn-lg" style="margin-left: 10px;">{$_ADDONLANG.btkreports_go_back}</a>
                </div>
            {/if}
        </form>
    </div>
</div>


{* Hizmet tiplerini JSON olarak JavaScript'e aktaralım *}
<script type="text/javascript">
    // Bu değişkenlerin TPL içinde <script> tag'leri arasında global olarak tanımlanması GEREKİR
    // VEYA btk_admin_scripts.js dosyasından önce yüklenmesi.
    // En iyisi bu script'i btk_admin_scripts.js'e taşımak ve bu değişkenleri
    // PHP'den JS'e data attribute veya inline script ile aktarmak.
    // Şimdilik TPL içinde bırakıyorum, btkModuleLink ve btkCsrfToken'ın
    // ya bu TPL'de ya da ana index.tpl'de global JS değişkeni olarak tanımlandığını varsayıyorum.
    // Aynı şekilde btkLang objesi de global olmalı.

    var hizmetTipleriByYetki = {$hizmetTipleriByYetkiJson|default:'{}'};
    var initialMappings = {
        {foreach from=$productGroups item=group name=maploop}
            '{$group->gid}': {
                btk_yetki_turu_kodu: '{$group->btk_yetki_turu_kodu|escape:"javascript"}',
                default_btk_hizmet_tipi_kodu: '{$group->default_btk_hizmet_tipi_kodu|escape:"javascript"}'
            }{if !$smarty.foreach.maploop.last},{/if}
        {/foreach}
    };
    var langSelectServiceType = '{$_ADDONLANG.btkreports_pgmap_select_service_type|escape:"javascript"|default:"-- Hizmet Tipi Seçin (Opsiyonel) --"}';
    var langSelectOptionService = '{$_ADDONLANG.btkreports_select_option|escape:"javascript"|default:"-- Seçiniz --"}'; // Genel bir seçiniz metni

    function populateHizmetTipiOptions(selectedYetkiKodu, hizmetTipiSelectElement, selectedHizmetTipi) {
        var $hizmetTipiSelect = $(hizmetTipiSelectElement);
        $hizmetTipiSelect.empty();
        $hizmetTipiSelect.append($('<option>', {
            value: '',
            text: langSelectServiceType
        }));

        if (selectedYetkiKodu && hizmetTipleriByYetki && hizmetTipleriByYetki[selectedYetkiKodu]) {
            $.each(hizmetTipleriByYetki[selectedYetkiKodu], function(index, hizmetTipi) {
                var optionText = hizmetTipi.deger_aciklama.substring(0,50) + (hizmetTipi.deger_aciklama.length > 50 ? '...' : '') + ' (' + hizmetTipi.hizmet_turu + ')';
                var option = $('<option>', {
                    value: hizmetTipi.hizmet_turu,
                    text: optionText
                });
                if (hizmetTipi.hizmet_turu === selectedHizmetTipi) {
                    option.prop('selected', true);
                }
                $hizmetTipiSelect.append(option);
            });
        }
        // Yetki kodu seçili değilse veya eşleşen hizmet tipi yoksa, "Seçiniz" seçeneği kalır.
    }

    $(document).ready(function() {
        // WHMCS datatable'ı tabloya uygula
        if ($.fn.dataTable) {
            $('#tableProductGroupMappings').DataTable({
                "language": {
                    // Türkçe dil dosyası için CDN linki veya lokal dosya yolu
                    "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json"
                },
                "paging": true,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
                "pageLength": 25 // Sayfa başına gösterilecek kayıt sayısı
            });
        }


        $('.btk-yetki-turu-select').each(function() {
            var groupId = $(this).data('group-id');
            var hizmetTipiSelect = $('#hizmet-tipi-group-' + groupId);
            var selectedYetkiKodu = $(this).val();
            var initialSelectedHizmetTipi = initialMappings[groupId] ? initialMappings[groupId].default_btk_hizmet_tipi_kodu : '';
            
            populateHizmetTipiOptions(selectedYetkiKodu, hizmetTipiSelect, initialSelectedHizmetTipi);
        });

        $(document).on('change', '.btk-yetki-turu-select', function() {
            var selectedYetkiKodu = $(this).val();
            var groupId = $(this).data('group-id');
            var hizmetTipiSelectElement = $('#hizmet-tipi-group-' + groupId);
            populateHizmetTipiOptions(selectedYetkiKodu, hizmetTipiSelectElement, '');
        });
    });
</script>