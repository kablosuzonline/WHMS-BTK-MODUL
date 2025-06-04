{* WHMCS BTK Raporlama Modülü - Ürün Grubu Eşleştirme Sayfası (product_group_mappings.tpl) - V3.0.0 - Tam Sürüm *}

{if $successmessage}
    <div class="alert alert-success text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-check-circle"></i> {$successmessage}
    </div>
{/if}
{if $errormessage}
    <div class="alert alert-danger text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-times-circle"></i> {$errormessage}
    </div>
{/if}
{if $infomessage}
    <div class="alert alert-info text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-info-circle"></i> {$infomessage}
    </div>
{/if}

<div class="panel panel-default btk-config-page" style="margin-top:15px;">
    <div class="panel-heading">
        <h3 class="panel-title" style="margin:0; font-size:16px; font-weight:bold;"><i class="fas fa-sitemap"></i> {$_LANG.btk_product_group_mapping_title|default:"Ürün Grubu - BTK Yetki & Hizmet Tipi Eşleştirme"}</h3>
    </div>
    <div class="panel-body">
        <p>{$_LANG.btk_product_group_mapping_desc|default:'Bu sayfada, WHMCS ürün gruplarınızı, BTK raporlaması için kullanılacak varsayılan "BTK Yetki Türü" ve "BTK Hizmet Tipi (EK-3)" ile eşleştirebilirsiniz. Bir ürün grubuna yapılan atama, o gruptaki tüm ürünler için varsayılan olacaktır. Bu ayarlar, her bir hizmetin kendi detay sayfasından ayrıca özelleştirilebilir.'}</p>
        <p><small class="text-muted">{$_LANG.btk_product_mapping_note|default:"Bir ürün grubu için Yetki Türü veya Hizmet Tipi seçilmezse (Boş Bırak/Varsayılan), o gruptaki hizmetlerin BTK ayarları ya Modül Ayarları'ndaki varsayılanlardan ya da manuel olarak hizmet detay sayfasından girilen bilgilerden alınacaktır."}</small></p>
        <hr>

        <form method="post" action="{$modulelink}&action=productgroupmap">
            <input type="hidden" name="savegroupmappings" value="1">
            <input type="hidden" name="token" value="{$csrfToken}">

            {if $product_groups && $product_groups|@count > 0}
                <div class="table-responsive">
                    <table class="table table-striped table-bordered table-hover" id="tableProductGroupMappings" style="width:100%;">
                        <thead class="thead-light">
                            <tr>
                                <th style="width: 40%;">{$_LANG.btk_product_group_name|default:"WHMCS Ürün Grubu"}</th>
                                <th style="width: 30%;">{$_LANG.btk_yetki_tipi|default:"BTK Yetki Türü"} {$info_icon_product_map_yetki}</th>
                                <th style="width: 30%;">{$_LANG.btk_hizmet_tipi_ek3|default:"Varsayılan BTK Hizmet Tipi (EK-3)"} {$info_icon_product_map_hizmet}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foreach $product_groups as $group}
                                <tr>
                                    <td>{$group.name} (ID: {$group.id})</td>
                                    <td>
                                        <select name="group_map[{$group.id}][btk_yetki_kullanici_kodu]" class="form-control form-control-sm">
                                            <option value="">{$_LANG.btk_product_map_default_option|default:"-- Varsayılanı Kullan --"}</option>
                                            {foreach $defined_yetki_turleri as $yetki}
                                                <option value="{$yetki->btk_dosya_tip_kodu}" {if isset($group_mappings[$group.id]) && $group_mappings[$group.id]->btk_yetki_kullanici_kodu == $yetki->btk_dosya_tip_kodu}selected{/if}>
                                                    {$yetki->yetki_kullanici_adi} ({$yetki->btk_dosya_tip_kodu})
                                                </option>
                                            {/foreach}
                                        </select>
                                    </td>
                                    <td>
                                        <select name="group_map[{$group.id}][btk_hizmet_turu_kodu]" class="form-control form-control-sm">
                                            <option value="">{$_LANG.btk_product_map_default_option|default:"-- Varsayılanı Kullan --"}</option>
                                            {foreach $defined_hizmet_tipleri as $hizmet_tipi}
                                                <option value="{$hizmet_tipi->hizmet_turu_kodu}" {if isset($group_mappings[$group.id]) && $group_mappings[$group.id]->btk_hizmet_turu_kodu == $hizmet_tipi->hizmet_turu_kodu}selected{/if}>
                                                    {$hizmet_tipi->deger_aciklama} ({$hizmet_tipi->hizmet_turu_kodu})
                                                </option>
                                            {/foreach}
                                        </select>
                                    </td>
                                </tr>
                            {/foreach}
                        </tbody>
                    </table>
                </div>
                 <div class="form-group text-center" style="margin-top: 30px;">
                    <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$_LANG.btk_save_mappings|default:"Eşleştirmeleri Kaydet"}</button>
                    <a href="{$modulelink}" class="btn btn-default btn-lg" style="margin-left: 10px;">{$_LANG.btk_cancel|default:"İptal"}</a>
                </div>
            {else}
                <p class="text-center">{$_LANG.btk_no_product_groups_found|default:"WHMCS'te tanımlı ürün grubu bulunmamaktadır."}</p>
            {/if}
        </form>
    </div>
</div>
<script type="text/javascript">
$(document).ready(function() {
    // WHMCS admin teması genellikle DataTables'ı zaten yükler.
    // Eğer yüklenmemişse veya özel bir DataTable başlatma gerekiyorsa buraya eklenebilir.
    if ($.fn.dataTable && $('#tableProductGroupMappings').length > 0) {
        $('#tableProductGroupMappings').DataTable({
            "language": {
                // WHMCS'in kendi dil dosyalarından veya CDN'den Türkçe dil ayarı çekilebilir.
                // Örnek: "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json"
                // WHMCS admin teması bunu zaten sağlıyorsa bu satıra gerek olmayabilir.
                "sEmptyTable":     "Tabloda herhangi bir veri mevcut değil",
                "sInfo":           "_TOTAL_ kayıttan _START_ - _END_ arasındaki kayıtlar gösteriliyor",
                "sInfoEmpty":      "Kayıt yok",
                "sInfoFiltered":   "(_MAX_ kayıt içerisinden bulunan)",
                "sInfoPostFix":    "",
                "sInfoThousands":  ".",
                "sLengthMenu":     "Sayfada _MENU_ kayıt göster",
                "sLoadingRecords": "Yükleniyor...",
                "sProcessing":     "İşleniyor...",
                "sSearch":         "Ara:",
                "sZeroRecords":    "Eşleşen kayıt bulunamadı",
                "oPaginate": {
                    "sFirst":    "İlk",
                    "sLast":     "Son",
                    "sNext":     "Sonraki",
                    "sPrevious": "Önceki"
                },
                "oAria": {
                    "sSortAscending":  ": artan sütun sıralamasını aktifleştir",
                    "sSortDescending": ": azalan sütun sıralamasını aktifleştir"
                }
            },
            "paging": true,
            "lengthChange": false, // Sayfa başına kayıt sayısı seçeneğini gizle
            "searching": true,
            "ordering": true,
            "info": true, // "Showing x to y of z entries" bilgisini göster
            "autoWidth": false,
            "responsive": true,
            "pageLength": 25 // Varsayılan sayfa başına kayıt
        });
    }
    // Tooltip'leri etkinleştir (Bootstrap tooltip'leri için)
    if (typeof $().tooltip === 'function') {
        $('[data-toggle="tooltip"]').tooltip();
    }
});
</script>