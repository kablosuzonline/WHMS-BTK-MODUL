{*
    WHMCS BTK Raporlama Modülü - Personel Yönetimi Şablonu
    Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX - Anayasal Uyum)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version}" rel="stylesheet">

<div id="btk-personel-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>{$LANG.personelIntroText}</p>

<div class="panel panel-default btk-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-filter"></i> Personel Filtrele</h3>
    </div>
    <div class="panel-body">
        <form method="get" action="{$modulelink}">
            <input type="hidden" name="module" value="btkreports">
            <input type="hidden" name="action" value="personel">
            <div class="row">
                <div class="col-sm-4"><input type="text" name="s_name" value="{$filter.s_name|escape}" class="form-control" placeholder="Ad Soyad"></div>
                <div class="col-sm-4"><input type="text" name="s_email" value="{$filter.s_email|escape}" class="form-control" placeholder="E-posta"></div>
                <div class="col-sm-4">
                    <div class="btn-group" style="width:100%;">
                        <button type="submit" class="btn btn-primary" style="width: calc(100% - 40px);"><i class="fas fa-search"></i> Filtrele</button>
                        <a href="{$modulelink}&action=personel" class="btn btn-default" style="width: 40px;" title="Sıfırla"><i class="fas fa-sync-alt"></i></a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

<p>
    <button type="button" class="btn btn-success" data-toggle="modal" data-target="#modalPersonel" data-mode="add">
        <i class="fas fa-plus"></i> {$LANG.addNewPersonelButton}
    </button>
</p>

<div class="table-responsive">
    <table class="table table-striped">
        <thead>
            <tr>
                <th>{$LANG.personelAdiSoyadiHeader}</th>
                <th>{$LANG.personelEpostaHeader}</th>
                <th>Departman</th>
                <th>Ünvan</th>
                <th class="text-center">{$LANG.personelBtkListesineEklensinHeader}</th>
                <th class="text-center" width="100">{$LANG.actionsHeader}</th>
            </tr>
        </thead>
        <tbody>
            {foreach from=$personelListesi item=personel}
                <tr>
                    <td>{$personel.ad|escape} {$personel.soyad|escape}</td>
                    <td>{$personel.eposta|escape}</td>
                    <td>{$personel.departman_adi|escape|default:'-'}</td>
                    <td>{$personel.unvan|escape|default:'-'}</td>
                    <td class="text-center">
                        {if $personel.btk_listesinde_goster}
                            <span class="label label-success"><i class="fas fa-check"></i> Evet</span>
                        {else}
                            <span class="label label-danger"><i class="fas fa-times"></i> Hayır</span>
                        {/if}
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-xs btn-primary btn-edit-personel" data-toggle="modal" data-target="#modalPersonel" data-mode="edit" data-id="{$personel.id}">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <a href="{$modulelink}&action=delete_personel&id={$personel.id}&{$csrfTokenName}={$csrfToken}" 
                           class="btn btn-xs btn-danger btn-delete-confirm"
                           data-message="{$personel.ad} {$personel.soyad} isimli personeli silmek istediğinizden emin misiniz?">
                            <i class="fas fa-trash"></i>
                        </a>
                    </td>
                </tr>
            {foreachelse}
                <tr><td colspan="6" class="text-center">{$LANG.noPersonelFound}</td></tr>
            {/foreach}
        </tbody>
    </table>
</div>
{$pagination_output}

{* --- Personel Ekle/Düzenle Modal --- *}
<div class="modal fade" id="modalPersonel" tabindex="-1" role="dialog" aria-labelledby="modalPersonelLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=save_single_personel" id="formPersonel" class="form-horizontal">
                <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
                <input type="hidden" name="modal_personel_data[id]" id="modal_id" value="0">
                
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="modalPersonelLabel">Personel Bilgileri</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group"><label for="modal_ad" class="col-sm-4 control-label required">Adı</label><div class="col-sm-8"><input type="text" name="modal_personel_data[ad]" id="modal_ad" class="form-control" required></div></div>
                            <div class="form-group"><label for="modal_tckn" class="col-sm-4 control-label required">TC Kimlik No</label><div class="col-sm-8"><input type="text" name="modal_personel_data[tckn]" id="modal_tckn" class="form-control" maxlength="11" required></div></div>
                            <div class="form-group"><label for="modal_eposta" class="col-sm-4 control-label required">E-posta</label><div class="col-sm-8"><input type="email" name="modal_personel_data[eposta]" id="modal_eposta" class="form-control" required></div></div>
                            <div class="form-group"><label for="modal_mobil_tel" class="col-sm-4 control-label">Mobil Tel (GSM)</label><div class="col-sm-8"><input type="text" name="modal_personel_data[mobil_tel]" id="modal_mobil_tel" class="form-control"></div></div>
                            <div class="form-group"><label for="modal_cinsiyet" class="col-sm-4 control-label">Cinsiyet</label><div class="col-sm-8"><select name="modal_personel_data[cinsiyet]" id="modal_cinsiyet" class="form-control"><option value="">Seçiniz</option><option value="E">Erkek</option><option value="K">Kadın</option></select></div></div>
                            <div class="form-group">
                                <label for="modal_ogrenim_durumu" class="col-sm-4 control-label">Öğrenim Durumu</label>
                                <div class="col-sm-8">
                                    <select name="modal_personel_data[ogrenim_durumu]" id="modal_ogrenim_durumu" class="form-control">
                                        <option value="">Seçiniz</option>
                                        <option value="Lise">Lise</option>
                                        <option value="Ön Lisans">Ön Lisans</option>
                                        <option value="Lisans">Lisans</option>
                                        <option value="Yüksek Lisans">Yüksek Lisans</option>
                                        <option value="Doktora">Doktora</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group"><label for="modal_soyad" class="col-sm-4 control-label required">Soyadı</label><div class="col-sm-8"><input type="text" name="modal_personel_data[soyad]" id="modal_soyad" class="form-control" required></div></div>
                            <div class="form-group"><label for="modal_dogum_tarihi" class="col-sm-4 control-label">Doğum Tarihi</label><div class="col-sm-8"><input type="text" name="modal_personel_data[dogum_tarihi]" id="modal_dogum_tarihi" class="form-control date-picker" placeholder="GG/AA/YYYY"></div></div>
                            <div class="form-group"><label for="modal_unvan" class="col-sm-4 control-label">Ünvan</label><div class="col-sm-8"><input type="text" name="modal_personel_data[unvan]" id="modal_unvan" class="form-control"></div></div>
                             <div class="form-group"><label for="modal_sabit_tel" class="col-sm-4 control-label">Sabit Tel</label><div class="col-sm-8"><input type="text" name="modal_personel_data[sabit_tel]" id="modal_sabit_tel" class="form-control"></div></div>
                            <div class="form-group"><label for="modal_personel_statusu" class="col-sm-4 control-label">Personel Statüsü</label><div class="col-sm-8"><input type="text" name="modal_personel_data[personel_statusu]" id="modal_personel_statusu" class="form-control" placeholder="Örn: Teknik (Saha)"></div></div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group"><label for="modal_departman_id" class="col-sm-4 control-label">Çalıştığı Birim</label><div class="col-sm-8"><select name="modal_personel_data[departman_id]" id="modal_departman_id" class="form-control"><option value="">Departman Yok</option>{foreach $departmanlar as $dep}<option value="{$dep.id}">{$dep.departman_adi}</option>{/foreach}</select></div></div>
                            <div class="form-group"><label for="modal_ise_baslama_tarihi" class="col-sm-4 control-label">İşe Başlama Tarihi</label><div class="col-sm-8"><input type="text" name="modal_personel_data[ise_baslama_tarihi]" id="modal_ise_baslama_tarihi" class="form-control date-picker"></div></div>
                        </div>
                        <div class="col-sm-6">
                             <div class="form-group"><label for="modal_acik_adres" class="col-sm-4 control-label">Açık Adres</label><div class="col-sm-8"><textarea name="modal_personel_data[acik_adres]" id="modal_acik_adres" class="form-control" rows="2"></textarea></div></div>
                             <div class="form-group"><label for="modal_isten_ayrilma_tarihi" class="col-sm-4 control-label">İşten Ayrılma Tarihi</label><div class="col-sm-8"><input type="text" name="modal_personel_data[isten_ayrilma_tarihi]" id="modal_isten_ayrilma_tarihi" class="form-control date-picker"></div></div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group"><label for="modal_acil_durum_kisi_adi" class="col-sm-4 control-label">Acil Durum Kişisi</label><div class="col-sm-8"><input type="text" name="modal_personel_data[acil_durum_kisi_adi]" id="modal_acil_durum_kisi_adi" class="form-control"></div></div>
                            <div class="form-group" style="margin-top: 20px;">
                                <div class="col-sm-offset-4 col-sm-8">
                                    <label class="btk-switch" for="modal_engelli_mi"><input type="checkbox" name="modal_personel_data[engelli_mi]" id="modal_engelli_mi" value="1"><span class="btk-slider round"></span></label>
                                    <label for="modal_engelli_mi" style="font-weight:normal; cursor:pointer; margin-left:10px;">Engelli Personel</label>
                                </div>
                             </div>
                        </div>
                        <div class="col-sm-6">
                             <div class="form-group"><label for="modal_acil_durum_kisi_gsm" class="col-sm-4 control-label">Acil Durum GSM</label><div class="col-sm-8"><input type="text" name="modal_personel_data[acil_durum_kisi_gsm]" id="modal_acil_durum_kisi_gsm" class="form-control"></div></div>
                              <div class="form-group" style="margin-top: 20px;">
                                <div class="col-sm-offset-4 col-sm-8">
                                    <label class="btk-switch" for="modal_yabanci_uyruklu_mu"><input type="checkbox" name="modal_personel_data[yabanci_uyruklu_mu]" id="modal_yabanci_uyruklu_mu" value="1"><span class="btk-slider round"></span></label>
                                    <label for="modal_yabanci_uyruklu_mu" style="font-weight:normal; cursor:pointer; margin-left:10px;">Yabancı Uyruklu Personel</label>
                                </div>
                             </div>
                        </div>
                    </div>
                    <hr>
                    <div class="form-group">
                        <div class="col-sm-12">
                            <label class="btk-switch" for="modal_btk_listesinde_goster">
                                <input type="checkbox" name="modal_personel_data[btk_listesinde_goster]" id="modal_btk_listesinde_goster" value="1">
                                <span class="btk-slider round"></span>
                            </label>
                            <label for="modal_btk_listesinde_goster" style="font-weight:normal; cursor:pointer; margin-left:10px;"><strong>BTK Personel Raporuna Dahil Et</strong></label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">{$LANG.closeButton}</button>
                    <button type="submit" class="btn btn-primary">{$LANG.saveChanges}</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script type="text/javascript">
$(document).ready(function() {
    var modulelink_js = '{$modulelink|escape:"javascript"}';
    var csrfToken_js = '{$csrfToken|escape:"javascript"}';
    var csrfTokenName_js = '{$csrfTokenName|escape:"javascript"}';

    function updateCsrfToken(newToken) {
        if (newToken) {
            csrfToken_js = newToken;
            $('input[name="' + csrfTokenName_js + '"]').val(newToken);
        }
    }

    $('#modalPersonel').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var mode = button.data('mode');
        var modal = $(this);
        var form = modal.find('form');
        form[0].reset();
        
        if (mode === 'edit') {
            modal.find('.modal-title').text('Personel Düzenle');
            var personelId = button.data('id');
            form.find('#modal_id').val(personelId);

            var postData = {
                btk_ajax_action: 'get_personel_details',
                id: personelId
            };
            postData[csrfTokenName_js] = csrfToken_js;

            $.post(modulelink_js, postData, function(response) {
                if (response && response.status === 'success' && response.data) {
                    var p = response.data;
                    form.find('#modal_ad').val(p.ad);
                    form.find('#modal_soyad').val(p.soyad);
                    form.find('#modal_tckn').val(p.tckn);
                    form.find('#modal_dogum_tarihi').val(p.dogum_tarihi);
                    form.find('#modal_unvan').val(p.unvan);
                    form.find('#modal_eposta').val(p.eposta);
                    form.find('#modal_mobil_tel').val(p.mobil_tel);
                    form.find('#modal_sabit_tel').val(p.sabit_tel);
                    form.find('#modal_departman_id').val(p.departman_id);
                    form.find('#modal_ise_baslama_tarihi').val(p.ise_baslama_tarihi);
                    form.find('#modal_isten_ayrilma_tarihi').val(p.isten_ayrilma_tarihi);
                    form.find('#modal_acik_adres').val(p.acik_adres);
                    form.find('#modal_acil_durum_kisi_adi').val(p.acil_durum_kisi_adi);
                    form.find('#modal_acil_durum_kisi_gsm').val(p.acil_durum_kisi_gsm);
                    form.find('#modal_cinsiyet').val(p.cinsiyet);
                    form.find('#modal_ogrenim_durumu').val(p.ogrenim_durumu);
                    form.find('#modal_personel_statusu').val(p.personel_statusu);
                    form.find('#modal_engelli_mi').prop('checked', p.engelli_mi == 1);
                    form.find('#modal_yabanci_uyruklu_mu').prop('checked', p.yabanci_uyruklu_mu == 1);
                    form.find('#modal_btk_listesinde_goster').prop('checked', p.btk_listesinde_goster == 1);
                }
                if (response && response.new_token) {
                    updateCsrfToken(response.new_token);
                }
            }, 'json').fail(function() {
                 alert("Personel bilgileri yüklenirken bir hata oluştu.");
            });

        } else if (mode === 'add') {
            modal.find('.modal-title').text('Yeni Personel Ekle');
            form.find('#modal_id').val('0');
            form.find('#modal_btk_listesinde_goster').prop('checked', true);
        }
    });
});
</script>