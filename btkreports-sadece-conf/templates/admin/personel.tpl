{* WHMCS BTK Raporlama Modülü - Personel Yönetimi Sayfası (personel.tpl) - V3.0.0 - Tam Sürüm *}

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

<div id="btkPersonelNviResult" style="display:none; margin-bottom:15px;" class="alert"></div>

<div class="panel panel-default btk-personel-page" style="margin-top:15px;">
    <div class="panel-heading">
         <h3 class="panel-title" style="margin:0; font-size:16px; font-weight:bold;"><i class="fas fa-users-cog"></i> {$_LANG.btk_personnel_management_title|default:"Personel Yönetimi"}</h3>
    </div>
    <div class="panel-body">
        <div class="context-btn-container" style="margin-bottom: 20px;">
            <button type="button" class="btn btn-info" onclick="if(confirm('{$_LANG.btk_personel_sync_confirm|default:"WHMCS admin kullanıcıları ile personel listenizi senkronize etmek istediğinizden emin misiniz? Bu işlem mevcut BTK personel bilgilerini koruyarak sadece WHMCS\'ten gelen Ad, Soyad ve Email alanlarını güncelleyecektir."}')) window.location.href='{$modulelink}&action=sync_admins_to_personel&token={$csrfToken}'">
                <i class="fas fa-sync"></i> {$_LANG.btk_personel_sync_button|default:"WHMCS Adminlerini Personel Listesiyle Senkronize Et"}
            </button>
            <p class="help-block" style="margin-top: 5px;">{$_LANG.btk_personel_sync_desc|default:"Bu işlem, WHMCS adminlerini aşağıdaki listeye ekler veya mevcutların temel bilgilerini (Ad, Soyad, Email) günceller. Pasif adminler için işten ayrılma tarihi otomatik olarak bugüne ayarlanır. Eksik BTK bilgilerini her personel için ayrıca düzenlemeniz gerekecektir."}</p>
        </div>

        <p>{$_LANG.btk_personel_page_desc|default:"Bu sayfada, BTK'ya bildirilecek personel listenizi yönetebilirsiniz. BTK'ya gönderilecek personel raporu, \"BTK Listesine Eklensin\" durumu işaretli olan ve \"İşten Ayrılma Tarihi\" boş olan veya bugünden sonraki bir tarih olan personeli içerecektir."}</p>
        <hr>

        <form method="post" action="{$modulelink}&action=save_personel_bulk_status" id="personelListForm">
            <input type="hidden" name="token" value="{$csrfToken}">
            <div class="table-responsive">
                <table class="table table-striped table-bordered table-hover datatable" id="tablePersonelList" width="100%">
                    <thead>
                        <tr>
                            <th>{$_LANG.btk_personel_col_name|default:"Adı Soyadı (WHMCS)"}</th>
                            <th>{$_LANG.btk_personel_col_email|default:"Email (WHMCS)"}</th>
                            <th>{$_LANG.btk_personel_col_tckn|default:"TC Kimlik No (BTK)"}</th>
                            <th>{$_LANG.btk_personel_col_title|default:"Görevi / Ünvanı (BTK)"}</th>
                            <th>{$_LANG.btk_personel_col_department|default:"Çalıştığı Birim (BTK)"}</th>
                            <th>{$_LANG.btk_personel_col_mobile|default:"Mobil Telefonu (BTK)"}</th>
                            <th class="text-center">{$_LANG.btk_personel_col_add_to_list|default:"BTK Listesine Eklensin"}</th>
                            <th width="100" class="text-center">{$_LANG.btk_actions|default:"İşlemler"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foreach from=$personelListesi item=personel}
                            <tr {if $personel->isten_ayrilma_tarihi && $personel->isten_ayrilma_tarihi <= $smarty.now|date_format:"%Y-%m-%d"}class="disabled" title="İşten Ayrılmış ({$personel->isten_ayrilma_tarihi|date_format:'%d.%m.%Y'})"{/if}>
                                <td>{$personel->adi|default:$personel->admin_firstname} {$personel->soyadi|default:$personel->admin_lastname} {if $personel->whmcs_username}(@{$personel->whmcs_username}){/if}</td>
                                <td>{$personel->e_posta_adresi|default:$personel->admin_email}</td>
                                <td>
                                    {if $personel->tc_kimlik_no}
                                        {$personel->tc_kimlik_no}
                                        {if $personel->nvi_tckn_dogrulandi == 1}
                                            <span class="label label-success btk-nvi-status-label-serv" data-toggle="tooltip" title="NVI Doğrulandı ({$personel->nvi_tckn_son_dogrulama|btk_datetime_format})"><i class="fas fa-check-circle"></i></span>
                                        {elseif !empty($personel->tc_kimlik_no) && $personel->nvi_tckn_dogrulandi == 0 && $personel->nvi_tckn_son_dogrulama}
                                            <span class="label label-danger btk-nvi-status-label-serv" data-toggle="tooltip" title="NVI Başarısız ({$personel->nvi_tckn_son_dogrulama|btk_datetime_format})"><i class="fas fa-times-circle"></i></span>
                                        {elseif !empty($personel->tc_kimlik_no)}
                                            <span class="label label-warning btk-nvi-status-label-serv" data-toggle="tooltip" title="NVI Bekleniyor"><i class="fas fa-exclamation-triangle"></i></span>
                                        {/if}
                                    {else}
                                        <span class="text-muted">{$_LANG.btk_not_entered|default:"Girilmemiş"}</span>
                                    {/if}
                                </td>
                                <td>{$personel->gorev_unvani|default:'<span class="text-muted">Girilmemiş</span>'}</td>
                                <td>{$personel->calistigi_birim|default:'<span class="text-muted">Girilmemiş</span>'}</td>
                                <td>{$personel->mobil_telefonu|default:'<span class="text-muted">Girilmemiş</span>'}</td>
                                <td class="text-center">
                                    <input type="hidden" name="personel_ids[]" value="{$personel->id}">
                                    <input type="checkbox" name="btk_listesine_eklensin[{$personel->id}]" value="1" {if $personel->btk_listesine_eklensin}checked{/if} {if $personel->isten_ayrilma_tarihi && $personel->isten_ayrilma_tarihi <= $smarty.now|date_format:"%Y-%m-%d"}disabled title="İşten ayrılmış personel BTK listesine eklenemez."{/if}>
                                </td>
                                <td class="text-center">
                                    <button type="button" class="btn btn-xs btn-info edit-personel-btn"
                                            data-id="{$personel->id}"
                                            data-adminid="{$personel->whmcs_admin_id}"
                                            data-adi="{$personel->adi|default:$personel->admin_firstname|escape:'html'}"
                                            data-soyadi="{$personel->soyadi|default:$personel->admin_lastname|escape:'html'}"
                                            data-email="{$personel->e_posta_adresi|default:$personel->admin_email|escape:'html'}"
                                            data-tckn="{$personel->tc_kimlik_no}"
                                            data-unvan="{$personel->gorev_unvani|escape:'html'}"
                                            data-birim="{$personel->calistigi_birim|escape:'html'}"
                                            data-mobil="{$personel->mobil_telefonu}"
                                            data-sabit="{$personel->sabit_telefonu}"
                                            data-evadresi="{$personel->ev_adresi_detay|escape:'html'}"
                                            data-acildurum="{$personel->acil_durum_kisi_iletisim|escape:'html'}"
                                            data-isebaslama="{$personel->ise_baslama_tarihi|date_format:'%d.%m.%Y'}"
                                            data-istenayrilma="{$personel->isten_ayrilma_tarihi|date_format:'%d.%m.%Y'}"
                                            data-isbirakma="{$personel->is_birakma_nedeni|escape:'html'}"
                                            data-btkekle="{$personel->btk_listesine_eklensin}"
                                            data-nvidogrulandi="{$personel->nvi_tckn_dogrulandi}"
                                            data-nvisondogrulama="{$personel->nvi_tckn_son_dogrulama|btk_datetime_format}"
                                            data-dogumyili=""> {* Doğum yılı NVI için modalda girilecek *}
                                        <i class="fas fa-edit"></i> {$_LANG.btk_edit|default:"Düzenle"}
                                    </button>
                                </td>
                            </tr>
                        {foreachelse}
                            <tr>
                                <td colspan="8" class="text-center">{$_LANG.btk_personel_no_personnel_found|default:"Personel bulunmamaktadır. WHMCS admin kullanıcılarını senkronize edebilirsiniz."}</td>
                            </tr>
                        {/foreach}
                    </tbody>
                </table>
            </div>
            {if $personelListesi && $personelListesi|@count > 0}
            <div class="form-group text-center" style="margin-top:20px;">
                 <button type="submit" class="btn btn-primary"><i class="fas fa-check-square"></i> {$_LANG.btk_personel_list_update_bulk|default:'Seçili "BTK Listesine Ekle" Durumlarını Güncelle'}</button>
            </div>
            {/if}
        </form>
    </div>
</div>

{* Personel Ekleme/Düzenleme Modalı *}
<div class="modal fade" id="personelModal" tabindex="-1" role="dialog" aria-labelledby="personelModalLabel">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <form method="post" action="{$modulelink}&action=save_personel" id="personelModalForm">
        <input type="hidden" name="personel_id" id="modal_personel_id" value="">
        <input type="hidden" name="whmcs_admin_id" id="modal_whmcs_admin_id" value="">
        <input type="hidden" name="token" value="{$csrfToken}">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="personelModalLabel">{$_LANG.btk_personel_modal_title|default:"Personel Bilgilerini Düzenle"}</h4>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-6">
                    <h5>{$_LANG.btk_personel_temel_bilgiler|default:"Temel Bilgiler (WHMCS'ten Senkronize)"}</h5>
                    <div class="form-group">
                        <label for="modal_adi_display">{$_LANG.clientareafirstname|default:"Adı"}</label>
                        <input type="text" class="form-control" id="modal_adi_display" name="adi_display" readonly>
                    </div>
                    <div class="form-group">
                        <label for="modal_soyadi_display">{$_LANG.clientarealastname|default:"Soyadı"}</label>
                        <input type="text" class="form-control" id="modal_soyadi_display" name="soyadi_display" readonly>
                    </div>
                    <div class="form-group">
                        <label for="modal_e_posta_adresi_display">{$_LANG.clientareaemail|default:"E-posta Adresi"}</label>
                        <input type="email" class="form-control" id="modal_e_posta_adresi_display" name="e_posta_adresi_display" readonly>
                    </div>
                    <hr>
                    <h5>{$_LANG.btk_personel_btk_zorunlu|default:"BTK Raporu İçin Zorunlu Bilgiler"}</h5>
                    <div class="form-group">
                        <label for="modal_tc_kimlik_no">{$_LANG.btk_abone_tc_kimlik_no|default:"T.C. Kimlik No"} {$info_icon_tckn}</label>
                         <div class="input-group">
                            <input type="text" class="form-control" id="modal_tc_kimlik_no" name="tc_kimlik_no" maxlength="11" pattern="\d{11}" title="11 Haneli T.C. Kimlik Numarası">
                            <span class="input-group-btn" style="display: flex;">
                                <button type="button" class="btn btn-info btn-sm btk-nvi-verify-btn-personel" data-type="tckn" data-targetfieldid="modal_tc_kimlik_no" data-namefieldid="modal_adi_display" data-surnamefieldid="modal_soyadi_display" data-birthyearfieldid="modal_dogum_yili_personel_nvi" data-statusdivid="modal_tckn_nvi_status_personel" style="border-top-left-radius: 0; border-bottom-left-radius: 0;">{$_LANG.btk_nvi_dogrula|default:"NVI Doğrula"}</button>
                            </span>
                        </div>
                        <input type="hidden" name="nvi_tckn_dogrulandi" id="modal_nvi_tckn_dogrulandi_personel" value="">
                        <input type="hidden" name="nvi_tckn_son_dogrulama" id="modal_nvi_tckn_son_dogrulama_personel" value="">
                        <div id="modal_tckn_nvi_status_personel" style="margin-top:5px;"></div>
                        <small class="text-muted">{$_LANG.btk_personel_nvi_birthyear_note|default:"Personelin doğum yılı NVI doğrulaması için gereklidir."}</small>
                    </div>
                     <div class="form-group">
                        <label for="modal_gorev_unvani">{$_LANG.btk_personel_gorev_unvan|default:"Görevi / Ünvanı"}</label>
                        <input type="text" class="form-control" id="modal_gorev_unvani" name="gorev_unvani" required>
                    </div>
                    <div class="form-group">
                        <label for="modal_calistigi_birim">{$_LANG.btk_personel_calistigi_birim|default:"Çalıştığı Birim"}</label>
                        <input type="text" class="form-control" id="modal_calistigi_birim" name="calistigi_birim" required>
                    </div>
                    <div class="form-group">
                        <label for="modal_mobil_telefonu">{$_LANG.btk_personel_mobil_tel|default:"Mobil Telefonu"}</label>
                        <input type="text" class="form-control" id="modal_mobil_telefonu" name="mobil_telefonu" placeholder="5xxxxxxxxx" maxlength="10" pattern="\d{10}" title="Başında 0 olmadan 10 haneli numara" required>
                        <small class="text-muted">{$_LANG.btk_phone_format_desc|default:"Alan kodu olmadan, 10 hane (Örn: 5321234567)."}</small>
                    </div>
                    <div class="form-group">
                        <label for="modal_sabit_telefonu">{$_LANG.btk_personel_sabit_tel|default:"Sabit Telefonu"}</label>
                        <input type="text" class="form-control" id="modal_sabit_telefonu" name="sabit_telefonu" placeholder="212xxxxxxx" maxlength="10" pattern="\d{10}" title="Alan kodu ile 10 haneli numara">
                        <small class="text-muted">{$_LANG.btk_landline_format_desc|default:"Alan kodu ile, 10 hane (Örn: 2121234567)."}</small>
                    </div>
                </div>
                <div class="col-md-6">
                    <h5>{$_LANG.btk_personel_ik_opsiyonel|default:"İnsan Kaynakları (İK) Bilgileri (Opsiyonel)"}</h5>
                     <div class="form-group">
                        <label for="modal_dogum_yili_personel_nvi">{$_LANG.btk_personel_dogum_yili_nvi|default:"Doğum Yılı (NVI Doğrulama için)"}</label>
                        <input type="text" class="form-control" id="modal_dogum_yili_personel_nvi" name="dogum_yili_personel_nvi" placeholder="YYYY" maxlength="4" pattern="\d{4}" title="4 Haneli Yıl">
                    </div>
                    <div class="form-group">
                        <label for="modal_ise_baslama_tarihi">{$_LANG.btk_personel_ise_baslama|default:"İşe Başlama Tarihi"} (GG.AA.YYYY)</label>
                        <input type="text" class="form-control date-picker" id="modal_ise_baslama_tarihi" name="ise_baslama_tarihi">
                    </div>
                     <div class="form-group">
                        <label for="modal_isten_ayrilma_tarihi">{$_LANG.btk_personel_isten_ayrilma|default:"İşten Ayrılma Tarihi"} (GG.AA.YYYY)</label>
                        <input type="text" class="form-control date-picker" id="modal_isten_ayrilma_tarihi" name="isten_ayrilma_tarihi">
                        <small class="text-muted">{$_LANG.btk_personel_isten_ayrilma_desc|default:"Bu tarih doluysa, personel BTK raporuna dahil edilmez."}</small>
                    </div>
                     <div class="form-group">
                        <label for="modal_is_birakma_nedeni">{$_LANG.btk_personel_is_birakma_nedeni|default:"İş Bırakma Nedeni"}</label>
                        <textarea class="form-control" id="modal_is_birakma_nedeni" name="is_birakma_nedeni" rows="2"></textarea>
                    </div>
                     <div class="form-group">
                        <label for="modal_ev_adresi_detay">{$_LANG.btk_personel_ev_adresi|default:"Ev Adresi"}</label>
                        <textarea class="form-control" id="modal_ev_adresi_detay" name="ev_adresi_detay" rows="2"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="modal_acil_durum_kisi_iletisim">{$_LANG.btk_personel_acil_durum_kisi|default:"Acil Durumda Aranacak Kişi ve İletişim"}</label>
                        <textarea class="form-control" id="modal_acil_durum_kisi_iletisim" name="acil_durum_kisi_iletisim" rows="2"></textarea>
                    </div>
                     <div class="form-group" style="margin-top:20px;">
                        <label for="modal_btk_listesine_eklensin">
                            <input type="checkbox" id="modal_btk_listesine_eklensin" name="btk_listesine_eklensin" value="1">
                            {$_LANG.btk_personel_btk_listesine_ekle_label|default:"Bu personeli BTK Rapor Listesine Dahil Et"}
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">{$_LANG.btk_cancel|default:"Kapat"}</button>
          <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> {$_LANG.btk_save_changes|default:"Bilgileri Kaydet"}</button>
        </div>
      </form>
    </div>
  </div>
</div>

<script type="text/javascript">
$(document).ready(function() {
    var personelDataTable = null;
    if ($.fn.dataTable && $('#tablePersonelList').length > 0) {
        personelDataTable = $('#tablePersonelList').DataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json"
            },
            "order": [[ 0, "asc" ]], 
            "pageLength": 25,
            "responsive": true,
            "searching": true,
            "lengthChange": false,
            "info": true
        });
    }
    if ($.fn.datepicker) {
        $('#personelModal .date-picker').datepicker({ dateFormat: 'dd.mm.yy', changeMonth: true, changeYear: true, yearRange: "-70:+5" }); 
    }
    $('[data-toggle="tooltip"]').tooltip();


    $('.edit-personel-btn').on('click', function() {
        var personelAdi = $(this).data('adi') || '';
        var personelSoyadi = $(this).data('soyadi') || '';
        $('#personelModalLabel').text('{$_LANG.btk_personel_modal_title_edit|default:"Personel Bilgilerini Düzenle"} (' + personelAdi + ' ' + personelSoyadi + ')');
        $('#personelModalForm').trigger("reset"); 
        $('#modal_tckn_nvi_status_personel').html(''); 
        $('#btkPersonelNviResult').hide().removeClass('alert-success alert-danger alert-warning').html('');


        $('#modal_personel_id').val($(this).data('id'));
        $('#modal_whmcs_admin_id').val($(this).data('adminid'));
        $('#modal_adi_display').val(personelAdi); 
        $('#modal_soyadi_display').val(personelSoyadi); 
        $('#modal_e_posta_adresi_display').val($(this).data('email')); 

        $('#modal_tc_kimlik_no').val($(this).data('tckn'));
        $('#modal_gorev_unvani').val($(this).data('unvan'));
        $('#modal_calistigi_birim').val($(this).data('birim'));
        $('#modal_mobil_telefonu').val($(this).data('mobil'));
        $('#modal_sabit_telefonu').val($(this).data('sabit'));
        $('#modal_ev_adresi_detay').val($(this).data('evadresi'));
        $('#modal_acil_durum_kisi_iletisim').val($(this).data('acildurum'));
        $('#modal_ise_baslama_tarihi').val($(this).data('isebaslama'));
        $('#modal_isten_ayrilma_tarihi').val($(this).data('istenayrilma'));
        $('#modal_is_birakma_nedeni').val($(this).data('isbirakma'));
        $('#modal_btk_listesine_eklensin').prop('checked', $(this).data('btkekle') == 1 || $(this).data('btkekle') === true);
        
        var nviDogrulandi = $(this).data('nvidogrulandi');
        var nviSonDogrulama = $(this).data('nvisondogrulama');
        $('#modal_nvi_tckn_dogrulandi_personel').val(nviDogrulandi);
        $('#modal_nvi_tckn_son_dogrulama_personel').val(nviSonDogrulama);

        if (nviDogrulandi == 1 && nviSonDogrulama) {
            $('#modal_tckn_nvi_status_personel').html('<span class="label label-success btk-nvi-status-label-serv"><i class="fas fa-check-circle"></i> NVI Doğrulandı (' + nviSonDogrulama + ')</span>');
        } else if ($(this).data('tckn') && nviDogrulandi == 0 && nviSonDogrulama) {
            $('#modal_tckn_nvi_status_personel').html('<span class="label label-danger btk-nvi-status-label-serv"><i class="fas fa-times-circle"></i> NVI Başarısız (' + nviSonDogrulama + ')</span>');
        } else if ($(this).data('tckn')) {
             $('#modal_tckn_nvi_status_personel').html('<span class="label label-warning btk-nvi-status-label-serv"><i class="fas fa-exclamation-triangle"></i> NVI Bekleniyor</span>');
        }
        
        $('#modal_dogum_yili_personel_nvi').val(''); 

        $('#personelModal').modal('show');
    });

    $('.btk-nvi-verify-btn-personel').on('click', function() {
        var btn = $(this);
        var originalBtnText = btn.html();
        btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
        
        var type = btn.data('type'); 
        var idNo = $('#' + btn.data('targetfieldid')).val();
        var name = $('#' + btn.data('namefieldid')).val(); 
        var surname = $('#' + btn.data('surnamefieldid')).val(); 
        var birthYear = $('#' + btn.data('birthyearfieldid')).val(); 

        var resultDiv = $('#' + btn.data('statusdivid')); // Modal içindeki NVI durum alanı
        var nviResultContainer = $('#btkPersonelNviResult'); // Sayfanın üstündeki genel mesaj alanı
        var hiddenStatusField = $('#modal_nvi_tckn_dogrulandi_personel');
        var hiddenTimestampField = $('#modal_nvi_tckn_son_dogrulama_personel');
        var csrfToken = $('#personelModalForm input[name="token"]').val();

        resultDiv.html(''); // Önceki mesajları temizle (modal içi)
        nviResultContainer.hide().removeClass('alert-success alert-danger alert-warning').html('');


        if (type === 'tckn' && (birthYear.length !== 4 || !/^\d{4}$/.test(birthYear))) {
            var errorMsg = 'Lütfen geçerli bir Doğum Yılı (YYYY) girin.';
            resultDiv.html('<span class="label label-danger btk-nvi-status-label-serv">' + errorMsg + '</span>');
            nviResultContainer.addClass('alert-danger').html(errorMsg).show();
            btn.prop('disabled', false).html(originalBtnText);
            return;
        }

        $.ajax({
            url: '{$modulelink}&action=nvi_dogrula',
            type: 'POST',
            dataType: 'json',
            data: {
                type: type, id_no: idNo, ad: name, soyad: surname, 
                dogum_input: birthYear, 
                token: csrfToken,
                is_personel_check: true 
            },
            success: function(data) {
                var timestamp = new Date();
                var formattedTimestamp = timestamp.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                var dbTimestamp = timestamp.toISOString().slice(0, 19).replace('T', ' ');
                var messageToShow = data.message || 'Bilinmeyen bir NVI yanıtı alındı.';

                if (data && data.status === 'success') {
                    hiddenStatusField.val(data.isValid ? '1' : '0');
                    hiddenTimestampField.val(dbTimestamp);
                    if (data.isValid) {
                        resultDiv.html('<span class="label label-success btk-nvi-status-label-serv"><i class="fas fa-check-circle"></i> NVI Doğrulandı (' + formattedTimestamp + ')</span>');
                        nviResultContainer.removeClass('alert-danger alert-warning').addClass('alert-success').html(messageToShow).show();
                    } else {
                        resultDiv.html('<span class="label label-danger btk-nvi-status-label-serv"><i class="fas fa-times-circle"></i> NVI Başarısız (' + formattedTimestamp + ')</span><br><small>' + messageToShow + '</small>');
                         nviResultContainer.removeClass('alert-success alert-warning').addClass('alert-danger').html(messageToShow).show();
                    }
                } else {
                    resultDiv.html('<span class="label label-danger btk-nvi-status-label-serv">Doğrulama sırasında hata: ' + messageToShow + '</span>');
                    nviResultContainer.removeClass('alert-success alert-warning').addClass('alert-danger').html(messageToShow).show();
                    hiddenStatusField.val('0');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                var errorMsg = 'NVI Doğrulama servisine ulaşılamadı veya sunucu hatası oluştu.';
                if(jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.message){
                    errorMsg = jqXHR.responseJSON.message;
                } else if (jqXHR && jqXHR.responseText){
                    try { var errData = JSON.parse(jqXHR.responseText); if(errData && errData.message) errorMsg = errData.message; } catch (e){}
                }
                resultDiv.html('<span class="label label-danger btk-nvi-status-label-serv">' + errorMsg + '</span>'); 
                nviResultContainer.removeClass('alert-success alert-warning').addClass('alert-danger').html(errorMsg).show();
                hiddenStatusField.val('0'); 
            },
            complete: function() { btn.prop('disabled', false).html(originalBtnText); }
        });
    });
});
</script>