{*
    WHMCS BTK Raporlama Modülü - Personel Yönetimi Şablonu
    modules/addons/btkreports/templates/admin/personel.tpl
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">
{* Flatpickr veya başka bir datepicker CSS'i gerekirse buraya eklenebilir *}
{* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"> *}


<div class="btk-admin-page-header">
    <div class="btk-page-title">
        <img src="modules/addons/btkreports/logo.png" alt="BTK Modül Logo" style="height: 32px; vertical-align: middle; margin-right: 10px;">
        {$LANG.personeltitle|default:'Personel Yönetimi'}
    </div>
    <div class="btk-header-actions">
        <button type="button" class="btn btn-success" data-toggle="modal" data-target="#addEditPersonelModal" data-action="add">
            <i class="fas fa-user-plus"></i> {$LANG.addNewPersonel|default:'Yeni Personel Ekle'}
        </button>
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
        <h3 class="panel-title"><i class="fas fa-filter"></i> {$LANG.filterPersonel|default:'Personel Filtrele'}</h3>
    </div>
    <div class="panel-body">
        <form method="get" action="{$modulelink}&action=personel" class="form-inline">
            <input type="hidden" name="module" value="btkreports">
            <input type="hidden" name="action" value="personel">
            <input type="hidden" name="filter" value="1">

            <div class="row">
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_ad_filter">{$LANG.personelAdi}</label>
                    <input type="text" name="s_ad" id="s_ad_filter" value="{$filters.s_ad|escape}" class="form-control input-sm" style="width:100%;">
                </div>
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_soyad_filter">{$LANG.personelSoyadi}</label>
                    <input type="text" name="s_soyad" id="s_soyad_filter" value="{$filters.s_soyad|escape}" class="form-control input-sm" style="width:100%;">
                </div>
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_tckn_filter">{$LANG.personelTCKN}</label>
                    <input type="text" name="s_tckn" id="s_tckn_filter" value="{$filters.s_tckn|escape}" class="form-control input-sm" style="width:100%;">
                </div>
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_email_filter">{$LANG.personelEmail}</label>
                    <input type="text" name="s_email" id="s_email_filter" value="{$filters.s_email|escape}" class="form-control input-sm" style="width:100%;">
                </div>
            </div>
            <div class="row top-margin-10">
                 <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_departman_id_filter">{$LANG.personelDepartman}</label>
                    <select name="s_departman_id" id="s_departman_id_filter" class="form-control input-sm" style="width:100%;">
                        <option value="">-- {$LANG.all|escape} --</option>
                        {foreach from=$departmanlar item=dept}
                            <option value="{$dept.id}" {if $filters.s_departman_id == $dept.id}selected{/if}>{$dept.departman_adi|escape}</option>
                        {/foreach}
                    </select>
                </div>
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_btk_listesine_eklensin_filter">{$LANG.personelBtkListesineEkle}</label>
                    <select name="s_btk_listesine_eklensin" id="s_btk_listesine_eklensin_filter" class="form-control input-sm" style="width:100%;">
                        <option value="">-- {$LANG.all|escape} --</option>
                        <option value="1" {if $filters.s_btk_listesine_eklensin == '1'}selected{/if}>{$LANG.yes|escape}</option>
                        <option value="0" {if $filters.s_btk_listesine_eklensin == '0'}selected{/if}>{$LANG.no|escape}</option>
                    </select>
                </div>
                 <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_aktif_calisan_filter">{$LANG.personelDurumu|default:'Çalışma Durumu'}</label>
                    <select name="s_aktif_calisan" id="s_aktif_calisan_filter" class="form-control input-sm" style="width:100%;">
                        <option value="">-- {$LANG.all|escape} --</option>
                        <option value="1" {if $filters.s_aktif_calisan == '1'}selected{/if}>{$LANG.aktifCalisan|default:'Aktif Çalışan'}</option>
                        <option value="0" {if $filters.s_aktif_calisan == '0'}selected{/if}>{$LANG.ayrilmisCalisan|default:'İşten Ayrılmış'}</option>
                    </select>
                </div>
                <div class="col-md-3 col-sm-12 form-group text-right" style="padding-top: 20px;">
                    <button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-search"></i> {$LANG.filter|escape}</button>
                    <a href="{$modulelink}&action=personel&clearfilter=1" class="btn btn-default btn-sm"><i class="fas fa-times"></i> {$LANG.clearFilter|default:'Filtreyi Temizle'}</a>
                </div>
            </div>
        </form>
    </div>
</div>


<div class="btk-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-users"></i> {$LANG.personelList} ({$total_items|default:0} {$LANG.kayitBulundu|default:'kayıt bulundu'})</h3>
    </div>
    <div class="panel-body">
        <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover" id="personelTable">
                <thead>
                    <tr>
                        <th>{$LANG.personelAdi}</th>
                        <th>{$LANG.personelSoyadi}</th>
                        <th>{$LANG.personelTCKN}</th>
                        <th>{$LANG.personelUnvan}</th>
                        <th>{$LANG.personelDepartman}</th>
                        <th>{$LANG.personelEmail}</th>
                        <th>{$LANG.personelBtkListesineEkle}</th>
                        <th style="width: 150px;">{$LANG.actions}</th>
                    </tr>
                </thead>
                <tbody>
                    {if $personel_listesi}
                        {foreach from=$personel_listesi item=personel}
                            <tr {if $personel.isten_ayrilma_tarihi}class="danger"{/if}>
                                <td>{$personel.ad|escape}</td>
                                <td>{$personel.soyad|escape}</td>
                                <td>{$personel.tckn|escape}<br><small class="nvi-status-{$personel.tckn_dogrulama_durumu|lower}" title="{$personel.tckn_dogrulama_mesaji|escape}">({$personel.tckn_dogrulama_durumu})</small></td>
                                <td>{$personel.unvan|escape|default:'-'}</td>
                                <td>{$personel.departman_adi|escape|default:'-'}</td>
                                <td>{$personel.email|escape}</td>
                                <td>
                                    {if $personel.btk_listesine_eklensin == 1}
                                        <span class="label label-success">{$LANG.yes}</span>
                                    {else}
                                        <span class="label label-default">{$LANG.no}</span>
                                    {/if}
                                </td>
                                <td>
                                    <button type="button" class="btn btn-xs btn-primary btn-edit-personel"
                                            data-personelid="{$personel.id}"
                                            data-whmcsadminid="{$personel.whmcs_admin_id}"
                                            data-firmaunvani="{$personel.firma_unvani|escape}"
                                            data-ad="{$personel.ad|escape}"
                                            data-soyad="{$personel.soyad|escape}"
                                            data-tckn="{$personel.tckn|escape}"
                                            data-unvan="{$personel.unvan|escape}"
                                            data-departmanid="{$personel.departman_id}"
                                            data-mobiltel="{$personel.mobil_tel|escape}"
                                            data-sabittel="{$personel.sabit_tel|escape}"
                                            data-email="{$personel.email|escape}"
                                            data-evadresi="{$personel.ev_adresi|escape}"
                                            data-acildurum="{$personel.acil_durum_kisi_iletisim|escape}"
                                            data-isebaslama="{$personel.ise_baslama_tarihi}"
                                            data-istenayrilma="{$personel.isten_ayrilma_tarihi}"
                                            data-isbirakmanedeni="{$personel.is_birakma_nedeni|escape}"
                                            data-gorevbolgesiilceid="{$personel.gorev_bolgesi_ilce_id}"
                                            data-btklistesineekle="{$personel.btk_listesine_eklensin}"
                                            data-toggle="modal" data-target="#addEditPersonelModal">
                                        <i class="fas fa-pencil-alt"></i> {$LANG.edit}
                                    </button>
                                    <a href="{$modulelink}&action=delete_personel&id={$personel.id}&token={$csrfToken}"
                                       class="btn btn-xs btn-danger"
                                       onclick="return confirm('{$LANG.personelDeleteConfirm|replace:'%s':($personel.ad|cat:' '|cat:$personel.soyad)|escape}');">
                                        <i class="fas fa-trash"></i> {$LANG.delete}
                                    </a>
                                </td>
                            </tr>
                        {/foreach}
                    {else}
                        <tr>
                            <td colspan="8" class="text-center">{$LANG.personelNoPersonelFound}</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
        
        {* Sayfalandırma *}
        {if $total_pages > 1}
            <nav aria-label="Page navigation">
                <ul class="pagination">
                    {if $current_page > 1}
                        <li><a href="{$modulelink}&action=personel&page={$current_page-1}&{$pagination_params}">« {$LANG.previous|default:'Önceki'}</a></li>
                    {else}
                        <li class="disabled"><span>« {$LANG.previous|default:'Önceki'}</span></li>
                    {/if}

                    {for $i=1 to $total_pages}
                        <li {if $i == $current_page}class="active"{/if}><a href="{$modulelink}&action=personel&page={$i}&{$pagination_params}">{$i}</a></li>
                    {/for}

                    {if $current_page < $total_pages}
                        <li><a href="{$modulelink}&action=personel&page={$current_page+1}&{$pagination_params}">{$LANG.next|default:'Sonraki'} »</a></li>
                    {else}
                        <li class="disabled"><span>{$LANG.next|default:'Sonraki'} »</span></li>
                    {/if}
                </ul>
            </nav>
        {/if}
    </div>
</div>

{* Yeni Ekle / Düzenle Modal Penceresi (Bir önceki .tpl gönderimimdeki gibi detaylı form alanlarıyla) *}
<div class="modal fade" id="addEditPersonelModal" tabindex="-1" role="dialog" aria-labelledby="addEditPersonelModalLabel">
    {* ... Modal içeriği (form alanları) bir önceki `personel.tpl` gönderimimdeki gibi olacak ... *}
    {* ÖNEMLİ: Modal içindeki form alanlarının name attributeları BtkHelper::savePersonel fonksiyonunun beklediği $data anahtarlarıyla eşleşmeli. *}
    {* ÖNEMLİ: WHMCS Admin ID (whmcs_admin_id_modal) ve Dogum Yılı (dogum_yili_nvi) için modal formuna alanlar eklenebilir. *}
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=save_personel" id="personelFormModal">
                <input type="hidden" name="token" value="{$csrfToken}">
                <input type="hidden" name="personel_id" id="personel_id_modal" value="0">
                <input type="hidden" name="whmcs_admin_id_db" id="whmcs_admin_id_db_modal" value=""> {* Düzenlemede mevcut admin ID'yi tutmak için *}
                
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <h4 class="modal-title" id="addEditPersonelModalLabel">{$LANG.addEditPersonelTitle|default:'Personel Ekle/Düzenle'}</h4>
                </div>
                <div class="modal-body">
                    {* Firma Ünvanı (Readonly) *}
                    <div class="form-group">
                        <label for="firma_unvani_modal">{$LANG.personelFirmaUnvani}</label>
                        <input type="text" id="firma_unvani_modal" value="{$settings.operator_title|escape}" class="form-control" readonly>
                    </div>
                    <div class="row">
                        <div class="col-md-6 form-group">
                            <label for="ad_modal">{$LANG.personelAdi} *</label>
                            <input type="text" name="ad" id="ad_modal" class="form-control" required>
                        </div>
                        <div class="col-md-6 form-group">
                            <label for="soyad_modal">{$LANG.personelSoyadi} *</label>
                            <input type="text" name="soyad" id="soyad_modal" class="form-control" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 form-group">
                            <label for="tckn_modal">{$LANG.personelTCKN} *</label>
                            <div class="input-group">
                                <input type="text" name="tckn" id="tckn_modal" class="form-control" maxlength="11" required>
                                <span class="input-group-btn">
                                    <button type="button" class="btn btn-default nvi-dogrula-tckn-btn-personel" id="nviDogrulaBtnPersonelModal">{$LANG.nviTcDogrula}</button>
                                </span>
                            </div>
                            <span id="nviResultPersonelModal" class="help-block"></span>
                        </div>
                        <div class="col-md-6 form-group">
                            <label for="dogum_yili_nvi_modal">{$LANG.dogumYiliNvi|default:'Doğum Yılı (NVI için)'} * <i class="fas fa-info-circle btk-tooltip" title="{$LANG.dogumYiliNviDesc|default:'TCKN doğrulaması için gereklidir.'}"></i></label>
                            <input type="number" name="dogum_yili_nvi" id="dogum_yili_nvi_modal" class="form-control" min="1900" max="{$smarty.now|date_format:'%Y' - 18}" placeholder="YYYY" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 form-group">
                            <label for="email_modal">{$LANG.personelEmail} *</label>
                            <input type="email" name="email" id="email_modal" class="form-control" required>
                        </div>
                         <div class="col-md-6 form-group">
                            <label for="unvan_modal">{$LANG.personelUnvan}</label>
                            <input type="text" name="unvan" id="unvan_modal" class="form-control">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 form-group">
                            <label for="departman_id_modal">{$LANG.personelDepartman}</label>
                            <select name="departman_id" id="departman_id_modal" class="form-control">
                                <option value="">{$LANG.selectOne}</option>
                                {foreach from=$departmanlar item=dept}
                                    <option value="{$dept.id}">{$dept.departman_adi|escape}</option>
                                {/foreach}
                            </select>
                        </div>
                        <div class="col-md-6 form-group">
                            <label for="whmcs_admin_id_select_modal">{$LANG.whmcsAdminUser|default:'İlişkili WHMCS Yöneticisi (Opsiyonel)'}</label>
                            <select name="whmcs_admin_id_modal" id="whmcs_admin_id_select_modal" class="form-control">
                                <option value="">-- {$LANG.noWhmcsAdminLink|default:'WHMCS Yöneticisi ile İlişkilendirme Yok'} --</option>
                                {foreach from=$whmcs_admin_users_placeholder item=adminUser}
                                    <option value="{$adminUser.id}">{$adminUser.firstname} {$adminUser.lastname} ({$adminUser.username})</option>
                                {/foreach}
                            </select>
                             <span class="help-block">{$LANG.whmcsAdminLinkDesc|default:'Bu personel bir WHMCS admin hesabıyla ilişkiliyse seçin. Bu, bazı otomatik işlemlerde kullanılabilir.'}</span>
                        </div>
                    </div>
                    {* ... (Diğer tüm personel form alanları: mobil_tel, sabit_tel, İK bilgileri, btk_listesine_eklensin toggle) ... *}
                    <div class="form-group">
                        <label class="btk-switch">
                            <input type="checkbox" name="btk_listesine_eklensin" id="btk_listesine_eklensin_modal" value="1">
                            <span class="btk-slider round"></span>
                        </label>
                        {$LANG.personelBtkListesineEkle}
                        <i class="fas fa-info-circle btk-tooltip" title="{$LANG.personelBtkListesineEkleDesc}"></i>
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


<script type="text/javascript">
// Bu sayfaya özel JS (btk_admin_scripts.js'ye de taşınabilir)
$(document).ready(function() {
    // Personel Ekle/Düzenle Modalını Doldurma
    $('.btn-edit-personel').click(function() {
        $('#addEditPersonelModalLabel').text('{$LANG.editPersonelTitle|escape:"javascript"}');
        $('#personel_id_modal').val($(this).data('personelid'));
        $('#whmcs_admin_id_db_modal').val($(this).data('whmcsadminid')); // WHMCS Admin ID (mevcutsa)
        $('#whmcs_admin_id_select_modal').val($(this).data('whmcsadminid')); // Dropdown'ı ayarla

        $('#ad_modal').val($(this).data('ad'));
        $('#soyad_modal').val($(this).data('soyad'));
        $('#tckn_modal').val($(this).data('tckn'));
        $('#dogum_yili_nvi_modal').val(''); // NVI için doğum yılı her seferinde girilmeli veya DB'den çekilmeli
        $('#unvan_modal').val($(this).data('unvan'));
        $('#departman_id_modal').val($(this).data('departmanid'));
        $('#mobil_tel_modal').val($(this).data('mobiltel'));
        $('#sabit_tel_modal').val($(this).data('sabittel'));
        $('#email_modal').val($(this).data('email'));
        $('#ev_adresi_modal').val($(this).data('evadresi'));
        $('#acil_durum_kisi_iletisim_modal').val($(this).data('acildurum'));
        $('#ise_baslama_tarihi_modal').val($(this).data('isebaslama'));
        $('#isten_ayrilma_tarihi_modal').val($(this).data('istenayrilma'));
        $('#is_birakma_nedeni_modal').val($(this).data('isbirakmanedeni'));
        $('#gorev_bolgesi_ilce_id_modal').val($(this).data('gorevbolgesiilceid'));
        $('#btk_listesine_eklensin_modal').prop('checked', $(this).data('btklistesineekle') == 1);
        $('#nviResultPersonelModal').html('');
    });

    $('button[data-target="#addEditPersonelModal"][data-action="add"]').click(function() {
        $('#addEditPersonelModalLabel').text('{$LANG.addNewPersonel|escape:"javascript"}');
        $('#personelFormModal')[0].reset();
        $('#personel_id_modal').val('0');
        $('#whmcs_admin_id_modal').val('');
        $('#whmcs_admin_id_select_modal').val('');
        $('#btk_listesine_eklensin_modal').prop('checked', true); // Varsayılan olarak işaretli
        $('#nviResultPersonelModal').html('');
    });

    // NVI TCKN Doğrulama Butonu (Personel Modal)
    $('#nviDogrulaBtnPersonelModal').click(function(e) {
        e.preventDefault();
        var tckn = $('#tckn_modal').val();
        var ad = $('#ad_modal').val();
        var soyad = $('#soyad_modal').val();
        var dogumYili = $('#dogum_yili_nvi_modal').val(); // Doğum yılı NVI için
        var resultContainer = $('#nviResultPersonelModal');
        resultContainer.html('<i class="fas fa-spinner fa-spin"></i> {$LANG.dogrulaniyor|escape:"javascript"}');

        if (!tckn || !ad || !soyad || !dogumYili) {
            resultContainer.html('<span class="text-danger"><i class="fas fa-times-circle"></i> {$LANG.nviGerekliAlanlar|default:"TCKN, Ad, Soyad ve Doğum Yılı (NVI) alanları zorunludur."|escape:"javascript"}</span>');
            return;
        }

        $.ajax({
            url: '{$modulelink}&action=nvi_tckn_dogrula',
            type: 'POST',
            data: {
                tckn: tckn,
                ad: ad,
                soyad: soyad,
                dogum_yili_nvi: dogumYili, // NVI için özel alan adı
                token: '{$csrfToken}' // CSRF Token
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    resultContainer.html('<span class="text-success"><i class="fas fa-check-circle"></i> {$LANG.nviDogrulamaBasarili|escape:"javascript"}</span>');
                } else {
                    resultContainer.html('<span class="text-danger"><i class="fas fa-times-circle"></i> ' + (response.message || '{$LANG.nviDogrulamaBasarisiz|escape:"javascript"}') + '</span>');
                }
            },
            error: function() {
                resultContainer.html('<span class="text-danger"><i class="fas fa-exclamation-triangle"></i> {$LANG.nviDogrulamaHata|escape:"javascript"}</span>');
            }
        });
    });

    // Tarih seçiciler için (flatpickr veya WHMCS'in kendi datepicker'ı)
    // if (typeof flatpickr !== "undefined") {
    //     $(".btk-datepicker-yyyy-mm-dd").flatpickr({ dateFormat: "Y-m-d" });
    // }
});
</script>