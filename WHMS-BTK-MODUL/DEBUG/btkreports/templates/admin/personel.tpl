{*
    WHMCS BTK Raporlama Modülü - Personel Yönetimi Şablonu
    modules/addons/btkreports/templates/admin/personel.tpl
    Bu şablon, btkreports.php içindeki btk_page_personel() fonksiyonu tarafından doldurulur.
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">
{* Flatpickr veya başka bir datepicker CSS'i gerekirse buraya eklenebilir *}

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
        <h3 class="panel-title"><i class="fas fa-filter"></i> {$LANG.filterPersonel|default:'Personel Filtrele'}</h3>
    </div>
    <div class="panel-body">
        <form method="get" action="{$modulelink}&action=personel" class="form-inline">
            <input type="hidden" name="module" value="btkreports">
            <input type="hidden" name="action" value="personel">
            <input type="hidden" name="filter" value="1">

            <div class="row">
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_ad_filter_personel">{$LANG.personelAdi}</label>
                    <input type="text" name="s_ad" id="s_ad_filter_personel" value="{$filters.s_ad|escape:'html'}" class="form-control input-sm" style="width:100%;">
                </div>
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_soyad_filter_personel">{$LANG.personelSoyadi}</label>
                    <input type="text" name="s_soyad" id="s_soyad_filter_personel" value="{$filters.s_soyad|escape:'html'}" class="form-control input-sm" style="width:100%;">
                </div>
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_tckn_filter_personel">{$LANG.personelTCKN}</label>
                    <input type="text" name="s_tckn" id="s_tckn_filter_personel" value="{$filters.s_tckn|escape:'html'}" class="form-control input-sm" style="width:100%;">
                </div>
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_email_filter_personel">{$LANG.personelEmail}</label>
                    <input type="text" name="s_email" id="s_email_filter_personel" value="{$filters.s_email|escape:'html'}" class="form-control input-sm" style="width:100%;">
                </div>
            </div>
            <div class="row top-margin-10">
                 <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_departman_id_filter_personel">{$LANG.personelDepartman}</label>
                    <select name="s_departman_id" id="s_departman_id_filter_personel" class="form-control input-sm" style="width:100%;">
                        <option value="">-- {$LANG.all|escape:'html'} --</option>
                        {if $departmanlar}
                        {foreach from=$departmanlar item=dept}
                            <option value="{$dept.id}" {if isset($filters.s_departman_id) && $filters.s_departman_id == $dept.id}selected{/if}>{$dept.departman_adi|escape:'html'}</option>
                        {/foreach}
                        {/if}
                    </select>
                </div>
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_btk_listesine_eklensin_filter_personel">{$LANG.personelBtkListesineEkle}</label>
                    <select name="s_btk_listesine_eklensin" id="s_btk_listesine_eklensin_filter_personel" class="form-control input-sm" style="width:100%;">
                        <option value="">-- {$LANG.all|escape:'html'} --</option>
                        <option value="1" {if isset($filters.s_btk_listesine_eklensin) && $filters.s_btk_listesine_eklensin == '1'}selected{/if}>{$LANG.yes|escape:'html'}</option>
                        <option value="0" {if isset($filters.s_btk_listesine_eklensin) && $filters.s_btk_listesine_eklensin == '0'}selected{/if}>{$LANG.no|escape:'html'}</option>
                    </select>
                </div>
                 <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_aktif_calisan_filter_personel">{$LANG.personelDurumu|default:'Çalışma Durumu'}</label>
                    <select name="s_aktif_calisan" id="s_aktif_calisan_filter_personel" class="form-control input-sm" style="width:100%;">
                        <option value="">-- {$LANG.all|escape:'html'} --</option>
                        <option value="1" {if isset($filters.s_aktif_calisan) && $filters.s_aktif_calisan == '1'}selected{/if}>{$LANG.aktifCalisan|default:'Aktif Çalışan'}</option>
                        <option value="0" {if isset($filters.s_aktif_calisan) && $filters.s_aktif_calisan == '0'}selected{/if}>{$LANG.ayrilmisCalisan|default:'İşten Ayrılmış'}</option>
                    </select>
                </div>
                <div class="col-md-3 col-sm-12 form-group text-right" style="padding-top: 20px;">
                    <button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-search"></i> {$LANG.filter|escape:'html'}</button>
                    <a href="{$modulelink}&action=personel&clearfilter=1" class="btn btn-default btn-sm"><i class="fas fa-times"></i> {$LANG.clearFilter|default:'Filtreyi Temizle'}</a>
                </div>
            </div>
        </form>
    </div>
</div>


<div class="btk-widget">
    <div class="panel-heading" style="display:flex; justify-content:space-between; align-items:center;">
        <h3 class="panel-title" style="margin-bottom:0;"><i class="fas fa-users"></i> {$LANG.personelList} ({$total_items|default:0} {$LANG.kayitBulundu|default:'kayıt bulundu'})</h3>
        <div>
            <button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addEditPersonelModal" data-action="add">
                <i class="fas fa-user-plus"></i> {$LANG.addNewPersonel|default:'Yeni Ekle'}
            </button>
            <a href="{$modulelink}&action=export_personel_excel&token={$csrfToken}" class="btn btn-warning btn-sm">
                <i class="fas fa-file-download"></i> {$LANG.popExportExcel|default:"Excel'e Dışa Aktar"} {* Dil anahtarı düzeltilmeli: exportPersonelExcel *}
            </a>
        </div>
    </div>
    <div class="panel-body">
        <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover table-btk-list" id="personelTable">
                <thead>
                    <tr>
                        <th>{$LANG.personelAdi|default:'Adı'}</th>
                        <th>{$LANG.personelSoyadi|default:'Soyadı'}</th>
                        <th>{$LANG.personelTCKN|default:'T.C. No'}</th>
                        <th>{$LANG.personelUnvan|default:'Ünvanı'}</th>
                        <th>{$LANG.personelDepartman|default:'Departmanı'}</th>
                        <th>{$LANG.personelEmail|default:'E-posta'}</th>
                        <th class="text-center">{$LANG.personelBtkListesineEkle|default:'BTK Listesi'}</th>
                        <th style="width: 150px;" class="text-center">{$LANG.actions}</th>
                    </tr>
                </thead>
                <tbody>
                    {if $personel_listesi}
                        {foreach from=$personel_listesi item=personel}
                            <tr {if $personel.isten_ayrilma_tarihi}class="danger"{elseif $personel.tckn_dogrulama_durumu == 'Dogrulanamadi' || $personel.tckn_dogrulama_durumu == 'Hata' || $personel.tckn_dogrulama_durumu == 'GecersizTCKN'}class="warning"{/if}>
                                <td>{$personel.ad|escape:'html'}</td>
                                <td>{$personel.soyad|escape:'html'}</td>
                                <td>{$personel.tckn|escape:'html'}<br><small class="nvi-status-{$personel.tckn_dogrulama_durumu|lower}" title="{$personel.tckn_dogrulama_mesaji|escape:'html'}">({$personel.tckn_dogrulama_durumu|default:'Doğrulanmadı'})</small></td>
                                <td>{$personel.unvan|escape:'html'|default:'-'}</td>
                                <td>{$personel.departman_adi|escape:'html'|default:'-'}</td>
                                <td>{$personel.email|escape:'html'}</td>
                                <td class="text-center">
                                    {if $personel.btk_listesine_eklensin == 1}
                                        <span class="label label-success">{$LANG.yes}</span>
                                    {else}
                                        <span class="label label-default">{$LANG.no}</span>
                                    {/if}
                                </td>
                                <td class="text-center">
                                    <button type="button" class="btn btn-xs btn-primary btn-edit-personel"
                                            data-personelid="{$personel.id}"
                                            data-whmcsadminid="{$personel.whmcs_admin_id}"
                                            data-firmaunvani="{$personel.firma_unvani|escape:'html'}"
                                            data-ad="{$personel.ad|escape:'html'}"
                                            data-soyad="{$personel.soyad|escape:'html'}"
                                            data-tckn="{$personel.tckn|escape:'html'}"
                                            data-unvan="{$personel.unvan|escape:'html'}"
                                            data-departmanid="{$personel.departman_id}"
                                            data-mobiltel="{$personel.mobil_tel|escape:'html'}"
                                            data-sabittel="{$personel.sabit_tel|escape:'html'}"
                                            data-email="{$personel.email|escape:'html'}"
                                            data-evadresi="{$personel.ev_adresi|escape:'html'}"
                                            data-acildurum="{$personel.acil_durum_kisi_iletisim|escape:'html'}"
                                            data-isebaslama="{$personel.ise_baslama_tarihi}"
                                            data-istenayrilma="{$personel.isten_ayrilma_tarihi}"
                                            data-isbirakmanedeni="{$personel.is_birakma_nedeni|escape:'html'}"
                                            data-gorevbolgesiilceid="{$personel.gorev_bolgesi_ilce_id}"
                                            data-btklistesineekle="{$personel.btk_listesine_eklensin}"
                                            data-toggle="modal" data-target="#addEditPersonelModal">
                                        <i class="fas fa-pencil-alt"></i> {$LANG.edit}
                                    </button>
                                    <a href="{$modulelink}&action=delete_personel&id={$personel.id}&token={$csrfToken}&page={$current_page}&{$pagination_params|replace:'&':'&'}"
                                       class="btn btn-xs btn-danger"
                                       onclick="return confirm('{$LANG.personelDeleteConfirm|replace:'%s':($personel.ad|cat:' '|cat:$personel.soyad)|escape:'javascript'}');">
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
        {if isset($total_pages) && $total_pages > 1}
            <nav aria-label="Personel List Page navigation">
                <ul class="pagination">
                    {if $current_page > 1}
                        <li><a href="{$modulelink}&action=personel&page={$current_page-1}{$pagination_params}">« {$LANG.previous}</a></li>
                    {else}
                        <li class="disabled"><span>« {$LANG.previous}</span></li>
                    {/if}
                    {for $i=1 to $total_pages}
                        <li {if $i == $current_page}class="active"{/if}><a href="{$modulelink}&action=personel&page={$i}{$pagination_params}">{$i}</a></li>
                    {/for}
                    {if $current_page < $total_pages}
                        <li><a href="{$modulelink}&action=personel&page={$current_page+1}{$pagination_params}">{$LANG.next} »</a></li>
                    {else}
                        <li class="disabled"><span>{$LANG.next} »</span></li>
                    {/if}
                </ul>
            </nav>
        {/if}
    </div>
</div>

{* Yeni Ekle / Düzenle Modal Penceresi *}
<div class="modal fade" id="addEditPersonelModal" tabindex="-1" role="dialog" aria-labelledby="addEditPersonelModalLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=save_personel" id="personelFormModal">
                <input type="hidden" name="token" value="{$csrfToken}">
                <input type="hidden" name="personel_id" id="personel_id_modal" value="0">
                <input type="hidden" name="page" value="{$current_page|default:1}"> {* Sayfalamayı korumak için *}

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <h4 class="modal-title" id="addEditPersonelModalLabel">{$LANG.addEditPersonelTitle|default:'Personel Ekle/Düzenle'}</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="firma_unvani_modal">{$LANG.personelFirmaUnvani}</label>
                        <input type="text" id="firma_unvani_modal" value="{$settings.operator_title|escape:'html'}" class="form-control" readonly>
                        <span class="help-block">{$LANG.firmaUnvaniAutoDesc|default:'Bu alan Genel Ayarlar\'dan otomatik olarak çekilir.'}</span>
                    </div>
                    <div class="row">
                        <div class="col-md-6 form-group">
                            <label for="ad_modal" class="required">{$LANG.personelAdi}</label>
                            <input type="text" name="ad" id="ad_modal" class="form-control" required>
                        </div>
                        <div class="col-md-6 form-group">
                            <label for="soyad_modal" class="required">{$LANG.personelSoyadi}</label>
                            <input type="text" name="soyad" id="soyad_modal" class="form-control" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 form-group">
                            <label for="tckn_modal" class="required">{$LANG.personelTCKN}</label>
                            <div class="input-group">
                                <input type="text" name="tckn" id="tckn_modal" class="form-control" maxlength="11" required pattern="[0-9]{11}">
                                <span class="input-group-btn">
                                    <button type="button" class="btn btn-default nvi-dogrula-tckn-btn-personel" id="nviDogrulaBtnPersonelModal">{$LANG.nviTcDogrula}</button>
                                </span>
                            </div>
                            <span id="nviResultPersonelModal" class="help-block nvi-result-container"></span>
                        </div>
                        <div class="col-md-6 form-group">
                            <label for="dogum_yili_nvi_modal_personel" class="required">{$LANG.dogumYiliNvi|default:'Doğum Yılı (NVI için)'}</label>
                             <i class="fas fa-info-circle btk-tooltip" title="{$LANG.dogumYiliNviDesc|escape:'html'|default:'TCKN doğrulaması için personelin 4 haneli doğum yılı gereklidir.'}"></i>
                            <input type="number" name="dogum_yili_nvi" id="dogum_yili_nvi_modal_personel" class="form-control" min="1900" max="{$smarty.now|date_format:'%Y'-18}" placeholder="YYYY" required>
                        </div>
                    </div>
                     <div class="row">
                        <div class="col-md-6 form-group">
                            <label for="email_modal" class="required">{$LANG.personelEmail}</label>
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
                                {if $departmanlar}
                                {foreach from=$departmanlar item=dept}
                                    <option value="{$dept.id}">{$dept.departman_adi|escape:'html'}</option>
                                {/foreach}
                                {/if}
                            </select>
                        </div>
                        <div class="col-md-6 form-group">
                            <label for="whmcs_admin_id_select_modal">{$LANG.whmcsAdminUser|default:'İlişkili WHMCS Yöneticisi (Opsiyonel)'}</label>
                            <select name="whmcs_admin_id_modal" id="whmcs_admin_id_select_modal" class="form-control">
                                <option value="">-- {$LANG.noWhmcsAdminLink|default:'WHMCS Yöneticisi ile İlişkilendirme Yok'} --</option>
                                {if $whmcs_admin_users_placeholder}
                                {foreach from=$whmcs_admin_users_placeholder item=adminUser}
                                    <option value="{$adminUser->id}">{$adminUser->firstname} {$adminUser->lastname} ({$adminUser->username|escape:'html'})</option>
                                {/foreach}
                                {/if}
                            </select>
                             <span class="help-block">{$LANG.whmcsAdminLinkDesc|default:'Bu personel bir WHMCS admin hesabıyla ilişkiliyse seçin.'}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 form-group">
                            <label for="mobil_tel_modal">{$LANG.personelMobilTel}</label>
                            <input type="text" name="mobil_tel" id="mobil_tel_modal" class="form-control" placeholder="5xxxxxxxxx">
                        </div>
                        <div class="col-md-6 form-group">
                            <label for="sabit_tel_modal">{$LANG.personelSabitTel}</label>
                            <input type="text" name="sabit_tel" id="sabit_tel_modal" class="form-control" placeholder="312xxxxxxx">
                        </div>
                    </div>
                     <hr>
                    <h5><i class="fas fa-briefcase"></i> {$LANG.ikInformation|default:'İK Bilgileri (Opsiyonel - Modül İçi Kullanım)'}</h5>
                     <div class="row">
                        <div class="col-md-6 form-group">
                            <label for="gorev_bolgesi_ilce_id_modal">{$LANG.personelGorevBolgesiIlce}</label>
                             <select name="gorev_bolgesi_ilce_id" id="gorev_bolgesi_ilce_id_modal" class="form-control">
                                <option value="">{$LANG.selectOne}</option>
                                {if $tum_ilceler_listesi}
                                {foreach from=$tum_ilceler_listesi item=ilce_data}
                                    <option value="{$ilce_data.ilce_id}">{$ilce_data.il_adi_prefix|escape:'html'} - {$ilce_data.ilce_adi|escape:'html'}</option>
                                {/foreach}
                                {/if}
                            </select>
                        </div>
                        <div class="col-md-6 form-group">
                             <label for="ise_baslama_tarihi_modal">{$LANG.personelIseBaslama}</label>
                             <input type="text" name="ise_baslama_tarihi" id="ise_baslama_tarihi_modal" class="form-control btk-datepicker-yyyy-mm-dd" placeholder="YYYY-AA-GG">
                        </div>
                    </div>
                    <div class="row">
                         <div class="col-md-6 form-group">
                             <label for="isten_ayrilma_tarihi_modal">{$LANG.personelIstenAyrilma}</label>
                             <input type="text" name="isten_ayrilma_tarihi" id="isten_ayrilma_tarihi_modal" class="form-control btk-datepicker-yyyy-mm-dd" placeholder="YYYY-AA-GG">
                        </div>
                        <div class="col-md-6 form-group">
                            <label for="is_birakma_nedeni_modal">{$LANG.personelIsBirakmaNedeni}</label>
                            <input type="text" name="is_birakma_nedeni" id="is_birakma_nedeni_modal" class="form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="ev_adresi_modal">{$LANG.personelEvAdresi}</label>
                        <textarea name="ev_adresi" id="ev_adresi_modal" class="form-control" rows="2"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="acil_durum_kisi_iletisim_modal">{$LANG.personelAcilDurum}</label>
                        <textarea name="acil_durum_kisi_iletisim" id="acil_durum_kisi_iletisim_modal" class="form-control" rows="2"></textarea>
                    </div>

                    <div class="form-group">
                        <label class="btk-switch" for="btk_listesine_eklensin_modal_toggle">
                            <input type="checkbox" name="btk_listesine_eklensin" id="btk_listesine_eklensin_modal_toggle" value="1">
                            <span class="btk-slider round"></span>
                        </label>
                        <label for="btk_listesine_eklensin_modal_toggle" style="display:inline; font-weight:normal;">{$LANG.personelBtkListesineEkle}</label>
                        <i class="fas fa-info-circle btk-tooltip" title="{$LANG.personelBtkListesineEkleDesc|escape:'html'}"></i>
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

{* Bu sayfaya özel JavaScript etkileşimleri (modal doldurma, NVI doğrulama, datepicker)
   btk_admin_scripts.js dosyasına taşınacak ve oradan yönetilecektir.
   Şimdilik temel modal açma/kapama Bootstrap ile çalışır.
*}