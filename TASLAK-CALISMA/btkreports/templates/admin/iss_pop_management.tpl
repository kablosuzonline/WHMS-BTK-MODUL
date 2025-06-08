{*
    WHMCS BTK Raporlama Modülü - ISS POP Noktası Yönetimi Şablonu
    modules/addons/btkreports/templates/admin/iss_pop_management.tpl
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">
{* Select2, DataTables veya Flatpickr için CSS dosyaları gerekirse buraya eklenebilir *}

<div class="btk-admin-page-header">
    <div class="btk-page-title">
        <img src="modules/addons/btkreports/logo.png" alt="BTK Modül Logo" style="height: 32px; vertical-align: middle; margin-right: 10px;">
        {$LANG.isspoptitle|default:'ISS POP Noktası Yönetimi'}
    </div>
    <div class="btk-header-actions">
        <button type="button" class="btn btn-success" data-toggle="modal" data-target="#addEditIssPopModal" data-action="add">
            <i class="fas fa-plus-circle"></i> {$LANG.addNewIssPop|default:'Yeni POP Noktası Ekle'}
        </button>
        <button type="button" class="btn btn-info" data-toggle="modal" data-target="#importIssPopModal">
            <i class="fas fa-file-excel"></i> {$LANG.popImportExcel|default:"Excel'den İçe Aktar"}
        </button>
        <a href="{$modulelink}&action=export_isspop_excel&token={$csrfToken}" class="btn btn-warning">
            <i class="fas fa-file-download"></i> {$LANG.popExportExcel|default:"Excel'e Dışa Aktar"}
        </a>
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

{* Filtreleme Formu *}
<div class="btk-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-filter"></i> {$LANG.filterIssPop|default:'POP Noktası Filtrele'}</h3>
    </div>
    <div class="panel-body">
        <form method="get" action="{$modulelink}&action=isspop" class="form-inline">
            <input type="hidden" name="module" value="btkreports">
            <input type="hidden" name="action" value="isspop">
            <input type="hidden" name="filter_isspop" value="1">

            <div class="row">
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_pop_adi_filter">{$LANG.popAdi}</label>
                    <input type="text" name="s_pop_adi" id="s_pop_adi_filter" value="{$filters_isspop.s_pop_adi|escape}" class="form-control input-sm" style="width:100%;">
                </div>
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_yayin_yapilan_ssid_filter">{$LANG.yayinYapilanSSID}</label>
                    <input type="text" name="s_yayin_yapilan_ssid" id="s_yayin_yapilan_ssid_filter" value="{$filters_isspop.s_yayin_yapilan_ssid|escape}" class="form-control input-sm" style="width:100%;">
                </div>
                <div class="col-md-2 col-sm-6 form-group">
                    <label for="s_il_id_filter">{$LANG.popIl}</label>
                    <select name="s_il_id" id="s_il_id_filter" class="form-control input-sm btk-adres-il-select" data-target-ilce="s_ilce_id_filter" style="width:100%;">
                        <option value="">-- {$LANG.all|escape} --</option>
                        {foreach from=$adres_iller item=il}
                            <option value="{$il.id}" {if $filters_isspop.s_il_id == $il.id}selected{/if}>{$il.il_adi|escape}</option>
                        {/foreach}
                    </select>
                </div>
                <div class="col-md-2 col-sm-6 form-group">
                    <label for="s_ilce_id_filter">{$LANG.popIlce}</label>
                    <select name="s_ilce_id" id="s_ilce_id_filter" class="form-control input-sm btk-adres-ilce-select" data-source-il="s_il_id_filter" {if !$filters_isspop.s_il_id}disabled{/if} style="width:100%;">
                        <option value="">-- {$LANG.all|escape} --</option>
                        {* AJAX ile veya PHP'de seçili il'e göre doldurulacak *}
                        {if $filters_isspop.s_il_id && $filter_ilceler_list_placeholder}
                             {foreach from=$filter_ilceler_list_placeholder item=ilce}
                                <option value="{$ilce.id}" {if $filters_isspop.s_ilce_id == $ilce.id}selected{/if}>{$ilce.ilce_adi|escape}</option>
                            {/foreach}
                        {/if}
                    </select>
                </div>
                 <div class="col-md-2 col-sm-6 form-group">
                    <label for="s_aktif_pasif_durum_filter">{$LANG.popAktifPasif}</label>
                    <select name="s_aktif_pasif_durum" id="s_aktif_pasif_durum_filter" class="form-control input-sm" style="width:100%;">
                        <option value="">-- {$LANG.all|escape} --</option>
                        <option value="1" {if $filters_isspop.s_aktif_pasif_durum == '1'}selected{/if}>{$LANG.aktif|escape}</option>
                        <option value="0" {if $filters_isspop.s_aktif_pasif_durum == '0'}selected{/if}>{$LANG.pasif|escape}</option>
                    </select>
                </div>
            </div>
            <div class="row top-margin-10">
                <div class="col-md-12 text-right">
                    <button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-search"></i> {$LANG.filter|escape}</button>
                    <a href="{$modulelink}&action=isspop&clearfilter_isspop=1" class="btn btn-default btn-sm"><i class="fas fa-times"></i> {$LANG.clearFilter|default:'Filtreyi Temizle'}</a>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="btk-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-broadcast-tower"></i> {$LANG.issPopList} ({$total_items_isspop|default:0} {$LANG.kayitBulundu|default:'kayıt bulundu'})</h3>
    </div>
    <div class="panel-body">
        <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover" id="issPopTable">
                <thead>
                    <tr>
                        <th>{$LANG.popAdi}</th>
                        <th>{$LANG.yayinYapilanSSID}</th>
                        <th>{$LANG.popIl}</th>
                        <th>{$LANG.popIlce}</th>
                        <th>{$LANG.popTipi}</th>
                        <th>{$LANG.popAktifPasif}</th>
                        <th style="width: 150px;">{$LANG.actions}</th>
                    </tr>
                </thead>
                <tbody>
                    {if $pop_noktalari_listesi}
                        {foreach from=$pop_noktalari_listesi item=pop}
                            <tr>
                                <td>{$pop.pop_adi|escape}</td>
                                <td>{$pop.yayin_yapilan_ssid|escape}</td>
                                <td>{$pop.il_adi|escape|default:'-'}</td>
                                <td>{$pop.ilce_adi|escape|default:'-'}</td>
                                <td>{$pop.pop_tipi|escape|default:'-'}</td>
                                <td>
                                    {if $pop.aktif_pasif_durum == 1}
                                        <span class="label label-success">{$LANG.aktif}</span>
                                    {else}
                                        <span class="label label-danger">{$LANG.pasif}</span>
                                    {/if}
                                </td>
                                <td>
                                    <button type="button" class="btn btn-xs btn-primary btn-edit-isspop"
                                            data-popid="{$pop.id}"
                                            data-popadi="{$pop.pop_adi|escape}"
                                            data-ssid="{$pop.yayin_yapilan_ssid|escape}"
                                            data-ipadresi="{$pop.ip_adresi|escape}"
                                            data-cihazturu="{$pop.cihaz_turu|escape}"
                                            data-cihazmarkasi="{$pop.cihaz_markasi|escape}"
                                            data-cihazmodeli="{$pop.cihaz_modeli|escape}"
                                            data-poptipi="{$pop.pop_tipi|escape}"
                                            data-ilid="{$pop.il_id}"
                                            data-ilceid="{$pop.ilce_id}"
                                            data-mahalleid="{$pop.mahalle_id}"
                                            data-tamadres="{$pop.tam_adres|escape}"
                                            data-koordinatlar="{$pop.koordinatlar|escape}"
                                            data-aktif="{$pop.aktif_pasif_durum}"
                                            data-toggle="modal" data-target="#addEditIssPopModal">
                                        <i class="fas fa-pencil-alt"></i> {$LANG.edit}
                                    </button>
                                    <a href="{$modulelink}&action=delete_isspop&id={$pop.id}&token={$csrfToken}"
                                       class="btn btn-xs btn-danger"
                                       onclick="return confirm('{$LANG.deleteConfirmPop|replace:'%s':$pop.pop_adi|escape}');">
                                        <i class="fas fa-trash"></i> {$LANG.delete}
                                    </a>
                                </td>
                            </tr>
                        {/foreach}
                    {else}
                        <tr>
                            <td colspan="7" class="text-center">{$LANG.popNoPopFound}</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
        
        {* Sayfalandırma *}
        {if $total_pages_isspop > 1}
            <nav aria-label="Page navigation">
                <ul class="pagination">
                    {if $current_page_isspop > 1}
                        <li><a href="{$modulelink}&action=isspop&page_isspop={$current_page_isspop-1}&{$pagination_params_isspop}">« {$LANG.previous}</a></li>
                    {else}
                        <li class="disabled"><span>« {$LANG.previous}</span></li>
                    {/if}
                    {for $i=1 to $total_pages_isspop}
                        <li {if $i == $current_page_isspop}class="active"{/if}><a href="{$modulelink}&action=isspop&page_isspop={$i}&{$pagination_params_isspop}">{$i}</a></li>
                    {/for}
                    {if $current_page_isspop < $total_pages_isspop}
                        <li><a href="{$modulelink}&action=isspop&page_isspop={$current_page_isspop+1}&{$pagination_params_isspop}">{$LANG.next} »</a></li>
                    {else}
                        <li class="disabled"><span>{$LANG.next} »</span></li>
                    {/if}
                </ul>
            </nav>
        {/if}
    </div>
</div>

{* Yeni Ekle / Düzenle Modal Penceresi (Bir önceki .tpl gönderimimdeki gibi detaylı form alanlarıyla) *}
<div class="modal fade" id="addEditIssPopModal" tabindex="-1" role="dialog" aria-labelledby="addEditIssPopModalLabel">
    {* ... Modal içeriği (form alanları) bir önceki `iss_pop_management.tpl` gönderimimdeki gibi olacak ... *}
    {* ÖNEMLİ: Modal içindeki adres dropdown'ları (il, ilce, mahalle) dinamik olarak doldurulacak JS koduna ihtiyaç duyar. *}
    {*          Bu JS kodları btk_admin_scripts.js içinde yer alacak. *}
    <div class="modal-dialog modal-lg" role="document">
        {* ... (Form içeriği bir önceki gönderimdeki gibi) ... *}
    </div>
</div>

{* Excel İçe Aktarma Modal Penceresi (Bir önceki .tpl gönderimimdeki gibi) *}
<div class="modal fade" id="importIssPopModal" tabindex="-1" role="dialog" aria-labelledby="importIssPopModalLabel">
    {* ... Modal içeriği (form alanları) bir önceki gönderimimdeki gibi olacak ... *}
</div>

<script type="text/javascript">
$(document).ready(function() {
    // Dinamik İlçe Dropdown'ı (Filtreleme için)
    $('#s_il_id_filter').change(function() {
        var ilId = $(this).val();
        var ilceSelect = $('#s_ilce_id_filter');
        ilceSelect.empty().append('<option value="">-- {$LANG.all|escape:"javascript"} --</option>').prop('disabled', true);

        if (ilId) {
            $.ajax({
                url: '{$modulelink}&action=get_ilceler',
                type: 'GET',
                data: { il_id: ilId, token: '{$csrfToken}' /* GET için token? */ },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success' && response.data && response.data.length > 0) {
                        $.each(response.data, function(index, ilce) {
                            ilceSelect.append($('<option>', { value: ilce.id, text: ilce.ilce_adi.toString().escape() }));
                        });
                        ilceSelect.prop('disabled', false);
                        {if $filters_isspop.s_ilce_id} // Eğer önceden seçili ilçe varsa onu tekrar seç
                        ilceSelect.val('{$filters_isspop.s_ilce_id}');
                        {/if}
                    } else if (response.message) {
                        // console.error("İlçe yükleme hatası: " + response.message);
                    }
                },
                error: function() {
                    // alert('İlçeler yüklenirken bir sunucu hatası oluştu.');
                    console.error("İlçe yükleme AJAX hatası.");
                }
            });
        }
    }).trigger('change'); // Sayfa yüklendiğinde de çalıştır (eğer il seçiliyse ilçeleri doldurmak için)


    // ISS POP Ekle/Düzenle Modalını Doldurma ve Adres Dropdownları için JS
    // (Bir önceki personel.tpl'deki modal JS koduna benzer, ancak POP alanları için uyarlanacak)
    // Bu kısım btk_admin_scripts.js dosyasına taşınabilir daha derli toplu olması için.
    // Örnek:
    // $('.btn-edit-isspop').click(function() {
    //     $('#addEditIssPopModalLabel').text('{$LANG.editIssPopTitle|escape:"javascript"}');
    //     $('#pop_id').val($(this).data('popid'));
    //     // ... diğer tüm data-* attribute'larını modal form alanlarına ata ...
    //     var ilId = $(this).data('ilid');
    //     $('#pop_il_id_modal').val(ilId).trigger('btkLoadIlceler', [$(this).data('ilceid'), $(this).data('mahalleid')]);
    // });
    //
    // $('button[data-target="#addEditIssPopModal"][data-action="add"]').click(function() {
    //    $('#addEditIssPopModalLabel').text('{$LANG.addNewIssPop|escape:"javascript"}');
    //    $('#issPopForm')[0].reset();
    //    $('#pop_id').val('0');
    //    $('#pop_il_id_modal').val('').trigger('change');
    //    $('#aktif_pasif_durum_modal').prop('checked', true);
    // });
    //
    // $('.btk-adres-il-select[data-target-ilce]').on('change btkLoadIlceler', function(event, preselectIlceId, preselectMahalleId) {
    //    // ... (Dinamik ilçe ve mahalle yükleme JS kodu) ...
    // });


    // DataTables entegrasyonu (opsiyonel)
    // if (typeof $.fn.DataTable == 'function') {
    //     $('#issPopTable').DataTable({ /* ... ayarlar ... */ });
    // }
});
</script>