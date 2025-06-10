{*
    WHMCS BTK Raporlama Modülü - ISS POP Noktası Yönetimi Şablonu
    modules/addons/btkreports/templates/admin/iss_pop_management.tpl
    Bu şablon, btkreports.php içindeki btk_page_isspop() fonksiyonu tarafından doldurulur.
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">
{* Select2, DataTables veya Flatpickr için CSS dosyaları gerekirse buraya eklenebilir (btk_admin_style.css içinde de olabilir) *}

{if $successMessage}
    <div class="alert alert-success text-center" role="alert"><i class="fas fa-check-circle"></i> {$successMessage|nl2br}</div>
{/if}
{if $infoMessage}
    <div class="alert alert-info" role="alert"><i class="fas fa-info-circle"></i> {$infoMessage|nl2br}</div>
{/if}
{if $errorMessage}
    <div class="alert alert-danger" role="alert"><i class="fas fa-exclamation-triangle"></i> {$errorMessage|nl2br}</div>
{/if}

{* Filtreleme Formu *}
<div class="panel panel-default btk-widget">
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
                    <label for="s_pop_adi_filter_isspop">{$LANG.popAdi}</label>
                    <input type="text" name="s_pop_adi" id="s_pop_adi_filter_isspop" value="{$filters_isspop.s_pop_adi|escape:'html'}" class="form-control input-sm" style="width:100%;">
                </div>
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_yayin_yapilan_ssid_filter_isspop">{$LANG.yayinYapilanSSID}</label>
                    <input type="text" name="s_yayin_yapilan_ssid" id="s_yayin_yapilan_ssid_filter_isspop" value="{$filters_isspop.s_yayin_yapilan_ssid|escape:'html'}" class="form-control input-sm" style="width:100%;">
                </div>
                <div class="col-md-2 col-sm-6 form-group">
                    <label for="s_il_id_filter_isspop">{$LANG.popIl}</label>
                    <select name="s_il_id" id="s_il_id_filter_isspop" class="form-control input-sm btk-adres-il-select" data-target-ilce="s_ilce_id_filter_isspop" style="width:100%;">
                        <option value="">-- {$LANG.all|escape:'html'} --</option>
                        {if $adres_iller}
                        {foreach from=$adres_iller item=il}
                            <option value="{$il.id}" {if isset($filters_isspop.s_il_id) && $filters_isspop.s_il_id == $il.id}selected{/if}>{$il.il_adi|escape:'html'}</option>
                        {/foreach}
                        {/if}
                    </select>
                </div>
                <div class="col-md-2 col-sm-6 form-group">
                    <label for="s_ilce_id_filter_isspop">{$LANG.popIlce}</label>
                    <select name="s_ilce_id" id="s_ilce_id_filter_isspop" class="form-control input-sm btk-adres-ilce-select" data-source-il="s_il_id_filter_isspop" {if !(isset($filters_isspop.s_il_id) && $filters_isspop.s_il_id)}disabled{/if} style="width:100%;">
                        <option value="">-- {$LANG.all|escape:'html'} --</option>
                        {if isset($filters_isspop.s_il_id) && $filters_isspop.s_il_id && $filter_ilceler_list_isspop_placeholder}
                             {foreach from=$filter_ilceler_list_isspop_placeholder item=ilce}
                                <option value="{$ilce.id}" {if isset($filters_isspop.s_ilce_id) && $filters_isspop.s_ilce_id == $ilce.id}selected{/if}>{$ilce.ilce_adi|escape:'html'}</option>
                            {/foreach}
                        {/if}
                    </select>
                </div>
                 <div class="col-md-2 col-sm-6 form-group">
                    <label for="s_aktif_pasif_durum_filter_isspop">{$LANG.popAktifPasif}</label>
                    <select name="s_aktif_pasif_durum" id="s_aktif_pasif_durum_filter_isspop" class="form-control input-sm" style="width:100%;">
                        <option value="">-- {$LANG.all|escape:'html'} --</option>
                        <option value="1" {if isset($filters_isspop.s_aktif_pasif_durum) && $filters_isspop.s_aktif_pasif_durum == '1'}selected{/if}>{$LANG.aktif|escape:'html'}</option>
                        <option value="0" {if isset($filters_isspop.s_aktif_pasif_durum) && $filters_isspop.s_aktif_pasif_durum == '0'}selected{/if}>{$LANG.pasif|escape:'html'}</option>
                    </select>
                </div>
            </div>
            <div class="row top-margin-10">
                <div class="col-md-12 text-right">
                    <button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-search"></i> {$LANG.filter|escape:'html'}</button>
                    <a href="{$modulelink}&action=isspop&clearfilter_isspop=1" class="btn btn-default btn-sm"><i class="fas fa-times"></i> {$LANG.clearFilter|default:'Filtreyi Temizle'}</a>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="btk-widget">
    <div class="panel-heading" style="display:flex; justify-content:space-between; align-items:center;">
        <h3 class="panel-title" style="margin-bottom:0;"><i class="fas fa-broadcast-tower"></i> {$LANG.issPopList|default:'ISS POP Noktaları Listesi'} ({$total_items_isspop|default:0} {$LANG.kayitBulundu|default:'kayıt bulundu'})</h3>
        <div>
            <button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addEditIssPopModal" data-action="add" style="margin-right: 5px;">
                <i class="fas fa-plus-circle"></i> {$LANG.addNewIssPop|default:'Yeni Ekle'}
            </button>
            <button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#importIssPopModal" style="margin-right: 5px;">
                <i class="fas fa-file-excel"></i> {$LANG.popImportExcel|default:"İçe Aktar"}
            </button>
            <a href="{$modulelink}&action=export_isspop_excel&token={$csrfToken}" class="btn btn-warning btn-sm">
                <i class="fas fa-file-download"></i> {$LANG.popExportExcel|default:"Dışa Aktar"}
            </a>
        </div>
    </div>
    <div class="panel-body">
        <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover table-btk-list" id="issPopTable">
                <thead>
                    <tr>
                        <th>{$LANG.popAdi|default:'POP Adı'}</th>
                        <th>{$LANG.yayinYapilanSSID|default:'Yayın SSID'}</th>
                        <th>{$LANG.popIl|default:'İl'}</th>
                        <th>{$LANG.popIlce|default:'İlçe'}</th>
                        <th>{$LANG.popTipi|default:'POP Tipi'}</th>
                        <th>{$LANG.popAktifPasif|default:'Durum'}</th>
                        <th style="width: 150px; text-align:center;">{$LANG.actions}</th>
                    </tr>
                </thead>
                <tbody>
                    {if $pop_noktalari_listesi}
                        {foreach from=$pop_noktalari_listesi item=pop}
                            <tr>
                                <td>{$pop.pop_adi|escape:'html'}</td>
                                <td>{$pop.yayin_yapilan_ssid|escape:'html'}</td>
                                <td>{$pop.il_adi|escape:'html'|default:'-'}</td>
                                <td>{$pop.ilce_adi|escape:'html'|default:'-'}</td>
                                <td>{$pop.pop_tipi|escape:'html'|default:'-'}</td>
                                <td class="text-center">
                                    {if $pop.aktif_pasif_durum == 1}
                                        <span class="label label-success">{$LANG.aktif}</span>
                                    {else}
                                        <span class="label label-danger">{$LANG.pasif}</span>
                                    {/if}
                                </td>
                                <td class="text-center">
                                    <button type="button" class="btn btn-xs btn-primary btn-edit-isspop"
                                            data-popid="{$pop.id}"
                                            data-popadi="{$pop.pop_adi|escape:'html'}"
                                            data-ssid="{$pop.yayin_yapilan_ssid|escape:'html'}"
                                            data-ipadresi="{$pop.ip_adresi|escape:'html'}"
                                            data-cihazturu="{$pop.cihaz_turu|escape:'html'}"
                                            data-cihazmarkasi="{$pop.cihaz_markasi|escape:'html'}"
                                            data-cihazmodeli="{$pop.cihaz_modeli|escape:'html'}"
                                            data-poptipi="{$pop.pop_tipi|escape:'html'}"
                                            data-ilid="{$pop.il_id}"
                                            data-ilceid="{$pop.ilce_id}"
                                            data-mahalleid="{$pop.mahalle_id}"
                                            data-tamadres="{$pop.tam_adres|escape:'html'}"
                                            data-koordinatlar="{$pop.koordinatlar|escape:'html'}"
                                            data-aktif="{$pop.aktif_pasif_durum}"
                                            data-toggle="modal" data-target="#addEditIssPopModal">
                                        <i class="fas fa-pencil-alt"></i> {$LANG.edit}
                                    </button>
                                    <a href="{$modulelink}&action=delete_isspop&id={$pop.id}&token={$csrfToken}&page_isspop={$current_page_isspop}&{$pagination_params_isspop|replace:'&':'&'}"
                                       class="btn btn-xs btn-danger"
                                       onclick="return confirm('{$LANG.deleteConfirmPop|replace:'%s':$pop.pop_adi|escape:'javascript'}');">
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
        {if isset($total_pages_isspop) && $total_pages_isspop > 1}
            <nav aria-label="POP List Page navigation">
                <ul class="pagination">
                    {if $current_page_isspop > 1}
                        <li><a href="{$modulelink}&action=isspop&page_isspop={$current_page_isspop-1}{$pagination_params_isspop}">« {$LANG.previous}</a></li>
                    {else}
                        <li class="disabled"><span>« {$LANG.previous}</span></li>
                    {/if}
                    {for $i=1 to $total_pages_isspop}
                        <li {if $i == $current_page_isspop}class="active"{/if}><a href="{$modulelink}&action=isspop&page_isspop={$i}{$pagination_params_isspop}">{$i}</a></li>
                    {/for}
                    {if $current_page_isspop < $total_pages_isspop}
                        <li><a href="{$modulelink}&action=isspop&page_isspop={$current_page_isspop+1}{$pagination_params_isspop}">{$LANG.next} »</a></li>
                    {else}
                        <li class="disabled"><span>{$LANG.next} »</span></li>
                    {/if}
                </ul>
            </nav>
        {/if}
    </div>
</div>

{* Yeni Ekle / Düzenle Modal Penceresi *}
<div class="modal fade" id="addEditIssPopModal" tabindex="-1" role="dialog" aria-labelledby="addEditIssPopModalLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=save_isspop" id="issPopFormModal">
                <input type="hidden" name="token" value="{$csrfToken}">
                <input type="hidden" name="pop_id" id="pop_id_modal" value="0">
                {* Sayfalamayı korumak için gizli input *}
                <input type="hidden" name="page_isspop" value="{$current_page_isspop|default:1}">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <h4 class="modal-title" id="addEditIssPopModalLabel">{$LANG.addEditIssPopTitle|default:'POP Noktası Ekle/Düzenle'}</h4>
                </div>
                <div class="modal-body">
                    {* Form alanları (pop_adi, yayin_yapilan_ssid, ip_adresi, cihaz_turu vb.) *}
                    <div class="row">
                        <div class="col-md-6 form-group">
                            <label for="pop_adi_modal" class="required">{$LANG.popAdi}</label>
                            <input type="text" name="pop_adi" id="pop_adi_modal" class="form-control" required>
                        </div>
                        <div class="col-md-6 form-group">
                            <label for="yayin_yapilan_ssid_modal" class="required">{$LANG.yayinYapilanSSID}</label>
                            <input type="text" name="yayin_yapilan_ssid" id="yayin_yapilan_ssid_modal" class="form-control" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 form-group">
                            <label for="ip_adresi_modal">{$LANG.popIpAdresi}</label>
                            <input type="text" name="ip_adresi" id="ip_adresi_modal" class="form-control">
                        </div>
                         <div class="col-md-6 form-group">
                            <label for="pop_tipi_modal">{$LANG.popTipi}</label>
                            <input type="text" name="pop_tipi" id="pop_tipi_modal" class="form-control" placeholder="Örn: BAZ İSTASYONU, SANTRAL, VERİ MERKEZİ">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 form-group">
                            <label for="cihaz_turu_modal">{$LANG.popCihazTuru}</label>
                            <input type="text" name="cihaz_turu" id="cihaz_turu_modal" class="form-control" placeholder="Örn: Router, Switch, AP">
                        </div>
                        <div class="col-md-4 form-group">
                            <label for="cihaz_markasi_modal">{$LANG.popCihazMarkasi}</label>
                            <input type="text" name="cihaz_markasi" id="cihaz_markasi_modal" class="form-control">
                        </div>
                        <div class="col-md-4 form-group">
                            <label for="cihaz_modeli_modal">{$LANG.popCihazModeli}</label>
                            <input type="text" name="cihaz_modeli" id="cihaz_modeli_modal" class="form-control">
                        </div>
                    </div>
                     <hr>
                    <h5><i class="fas fa-map-marker-alt"></i> {$LANG.popLocationInfo|default:'POP Lokasyon Bilgileri'}</h5>
                    <div class="row">
                        <div class="col-md-4 form-group">
                            <label for="pop_il_id_modal">{$LANG.popIl}</label>
                            <select name="il_id" id="pop_il_id_modal" class="form-control btk-adres-il-select" data-target-ilce="pop_ilce_id_modal" data-target-mahalle="pop_mahalle_id_modal" data-target-postakodu="pop_posta_kodu_modal">
                                <option value="">{$LANG.selectOne}</option>
                                {if $adres_iller}
                                {foreach from=$adres_iller item=il}
                                    <option value="{$il.id}">{$il.il_adi|escape:'html'}</option>
                                {/foreach}
                                {/if}
                            </select>
                        </div>
                        <div class="col-md-4 form-group">
                            <label for="pop_ilce_id_modal">{$LANG.popIlce}</label>
                            <select name="ilce_id" id="pop_ilce_id_modal" class="form-control btk-adres-ilce-select" data-target-mahalle="pop_mahalle_id_modal" data-target-postakodu="pop_posta_kodu_modal" disabled>
                                <option value="">{$LANG.onceIliSecin}</option>
                            </select>
                        </div>
                        <div class="col-md-4 form-group">
                            <label for="pop_mahalle_id_modal">{$LANG.popMahalle}</label>
                            <select name="mahalle_id" id="pop_mahalle_id_modal" class="form-control btk-adres-mahalle-select" data-target-postakodu="pop_posta_kodu_modal" disabled>
                                <option value="">{$LANG.onceIlceyiSecin}</option>
                            </select>
                        </div>
                    </div>
                     <div class="form-group" style="display:none;"> {/* Posta kodu gizli, mahalleden alınacak */}
                        <input type="hidden" name="posta_kodu" id="pop_posta_kodu_modal">
                    </div>
                    <div class="form-group">
                        <label for="tam_adres_modal">{$LANG.popTamAdres}</label>
                        <textarea name="tam_adres" id="tam_adres_modal" class="form-control" rows="2" placeholder="Cadde, Sokak, Bina No, Daire No vb."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="koordinatlar_modal">{$LANG.popKoordinatlar}</label>
                        <input type="text" name="koordinatlar" id="koordinatlar_modal" class="form-control" placeholder="Örn: 41.0082,28.9784">
                    </div>
                    <div class="form-group">
                        <label class="btk-switch" for="aktif_pasif_durum_modal_toggle">
                            <input type="checkbox" name="aktif_pasif_durum" id="aktif_pasif_durum_modal_toggle" value="1" checked>
                            <span class="btk-slider round"></span>
                        </label>
                        <label for="aktif_pasif_durum_modal_toggle" style="display:inline; font-weight:normal;">{$LANG.popAktifPasif}</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">{$LANG.close}</button>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> {$LANG.saveChanges}</button>
                </div>
            </form>
        </div>
    </div>
</div>

{* Excel İçe Aktarma Modal Penceresi *}
<div class="modal fade" id="importIssPopModal" tabindex="-1" role="dialog" aria-labelledby="importIssPopModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=import_isspop_excel" enctype="multipart/form-data" id="importIssPopForm">
                <input type="hidden" name="token" value="{$csrfToken}">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <h4 class="modal-title" id="importIssPopModalLabel">{$LANG.popImportExcel}</h4>
                </div>
                <div class="modal-body">
                    <p>{$LANG.excelImportDesc|default:'Lütfen iss_pop_nokta_listesi.xlsx formatına uygun bir Excel dosyası seçin. İlk satır başlık olmalıdır. Mevcut kayıtlar "Yayın Yapılan SSID", "POP Adı" ve "İlçe" bazında güncellenecek, olmayanlar eklenecektir.'}</p>
                    <div class="form-group">
                        <label for="excel_file_isspop">{$LANG.excelFile|default:'Excel Dosyası (.xlsx)'}</label>
                        <input type="file" name="excel_file" id="excel_file_isspop" class="form-control" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" required>
                    </div>
                     <p class="small"><a href="{$assets_url}/samples/iss_pop_nokta_listesi_ornek.xlsx" target="_blank">{$LANG.downloadSampleExcel|default:'Örnek Excel Şablonunu İndir'}</a></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">{$LANG.close}</button>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-upload"></i> {$LANG.upload|default:'Yükle ve İçe Aktar'}</button>
                </div>
            </form>
        </div>
    </div>
</div>

{* Bu sayfaya özel JavaScript kodları btk_admin_scripts.js içinde yönetilecek.
   Örn: Dinamik ilçe/mahalle dropdown'ları, modal doldurma, DataTables.
*}