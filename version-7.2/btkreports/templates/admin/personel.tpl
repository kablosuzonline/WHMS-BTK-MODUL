{*
    WHMCS BTK Raporlama Modülü - Personel Yönetimi Sayfası
    Sürüm: 7.2.5 (Operatör - Kritik Hata Düzeltmeleri)
*}

<div id="btk-personel-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>{$LANG.personelIntroText}</p>

<div class="text-right" style="margin-bottom: 15px;">
    <a href="{$modulelink}&action=export_personel_excel&token={$csrfToken}" class="btn btn-default"><i class="fas fa-file-excel"></i> {$LANG.excelExportButton}</a>
    <button type="button" class="btn btn-success" data-toggle="modal" data-target="#editPersonelModal" data-mode="add">
        <i class="fas fa-plus-circle"></i> {$LANG.addNewPersonelButton}
    </button>
</div>

<div class="tablebg">
    <table id="tblPersonelList" class="datatable" width="100%" border="0" cellspacing="1" cellpadding="3">
        <thead>
            <tr>
                <th>{$LANG.personelAdiSoyadiHeader}</th>
                <th>{$LANG.personelUnvanHeader}</th>
                <th>{$LANG.personelEpostaHeader}</th>
                <th class="text-center">{$LANG.personelBtkListesineEklensinHeader}</th>
                <th width="120" class="no-sort text-center">{$LANG.actionsHeader}</th>
            </tr>
        </thead>
        <tbody>
            {if $personelListesi}
                {foreach from=$personelListesi item=personel}
                    <tr>
                        <td>{$personel.ad|escape} {$personel.soyad|escape}</td>
                        <td>{$personel.unvan|escape}</td>
                        <td>{$personel.email|escape}</td>
                        <td class="text-center">
                            {if $personel.btk_listesine_eklensin}
                                <span class="label label-success">{$LANG.yes}</span>
                            {else}
                                <span class="label label-default">{$LANG.no}</span>
                            {/if}
                        </td>
                        <td class="text-center">
                            <button type="button" class="btn btn-xs btn-info" data-personel-id="{$personel.id}" data-mode="edit" data-toggle="modal" data-target="#editPersonelModal">
                                <i class="fas fa-edit"></i>
                            </button>
                             <a href="{$modulelink}&action=delete_personel&id={$personel.id}&token={$csrfToken}" class="btn btn-xs btn-danger btn-delete-confirm" data-message="{$LANG.confirmDeletePersonelText|sprintf:"`$personel.ad` `$personel.soyad`"|escape:'javascript'}">
                                <i class="fas fa-trash"></i>
                             </a>
                        </td>
                    </tr>
                {/foreach}
            {else}
                <tr>
                    <td colspan="5" class="text-center">{$LANG.noPersonelFound}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
{$pagination_output}

{* Personel Detaylı Düzenleme/Ekleme Modal Penceresi *}
<div class="modal fade" id="editPersonelModal" tabindex="-1" role="dialog" aria-labelledby="editPersonelModalLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=save_single_personel" id="editPersonelForm">
                <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
                <input type="hidden" name="modal_personel_data[id]" id="personel_id_modal" value="">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <h4 class="modal-title" id="editPersonelModalLabel"></h4>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <h4>BTK İçin Zorunlu Bilgiler</h4>
                    <hr>
                    <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_ad">Adı *</label><input type="text" name="modal_personel_data[ad]" id="modal_ad" class="form-control" required></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_soyad">Soyadı *</label><input type="text" name="modal_personel_data[soyad]" id="modal_soyad" class="form-control" required></div></div>
                    </div>
                    <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_tc_kimlik_no">TC/Yabancı Kimlik No *</label><input type="text" name="modal_personel_data[tckn]" id="modal_tc_kimlik_no" class="form-control" maxlength="11" required><span class="tckn-validation-status-modal"></span></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_dogum_yili">Doğum Yılı (TCKN Doğrulama için) *</label><input type="number" name="modal_personel_data[dogum_yili]" id="modal_dogum_yili" class="form-control" placeholder="Örn: 1985" required></div></div>
                    </div>
                     <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_unvan">Ünvan *</label><input type="text" name="modal_personel_data[unvan]" id="modal_unvan" class="form-control" required></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_departman_id">Çalıştığı Birim *</label><select name="modal_personel_data[departman_id]" id="modal_departman_id" class="form-control" required><option value="">{$LANG.selectOption}</option>{foreach from=$departmanlar item=dept}<option value="{$dept.id}">{$dept.departman_adi}</option>{/foreach}</select></div></div>
                    </div>
                     <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_mobil_tel">Mobil Telefonu</label><input type="text" name="modal_personel_data[mobil_tel]" id="modal_mobil_tel" class="form-control" placeholder="905xxxxxxxxx"></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_email">E-posta Adresi *</label><input type="email" name="modal_personel_data[email]" id="modal_email" class="form-control" required></div></div>
                    </div>
                    <div class="form-group">
                        <label>Bu Personel BTK Listesine Eklensin mi?</label>
                        <div><input type="checkbox" name="modal_personel_data[btk_listesine_eklensin]" id="modal_btk_listesine_eklensin" data-toggle="toggle" data-on="EVET" data-off="HAYIR"></div>
                    </div>

                    <h4 class="text-info" style="margin-top: 30px;">İsteğe Bağlı İK Bilgileri</h4>
                    <hr>
                    <div class="row">
                        {* Tam doğum tarihi alanı *}
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_dogum_tarihi">Doğum Tarihi</label>
                                <input type="text" name="modal_personel_data[dogum_tarihi]" id="modal_dogum_tarihi" class="form-control date-picker" placeholder="YYYY-MM-DD">
                            </div>
                        </div>
                        {* Cinsiyet alanı *}
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_cinsiyet">Cinsiyet</label>
                                <select name="modal_personel_data[cinsiyet]" id="modal_cinsiyet" class="form-control">
                                    <option value="">{$LANG.selectOption}</option>
                                    <option value="E" {if $personel.cinsiyet == 'E'}selected{/if}>{$LANG.genderMale}</option>
                                    <option value="K" {if $personel.cinsiyet == 'K'}selected{/if}>{$LANG.genderFemale}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {* Medeni durum alanı *}
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_medeni_durum">Medeni Durum</label>
                                <input type="text" name="modal_personel_data[medeni_durum]" id="modal_medeni_durum" class="form-control" placeholder="Evli, Bekar, Boşanmış...">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_ise_baslama_tarihi">İşe Başlama Tarihi</label><input type="text" name="modal_personel_data[ise_baslama_tarihi]" id="modal_ise_baslama_tarihi" class="form-control date-picker"></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_isten_ayrilma_tarihi">İşten Ayrılma Tarihi</label><input type="text" name="modal_personel_data[isten_ayrilma_tarihi]" id="modal_isten_ayrilma_tarihi" class="form-control date-picker"></div></div>
                    </div>
                    <div class="form-group"><label for="modal_is_birakma_nedeni">İş Bırakma Nedeni</label><textarea name="modal_personel_data[is_birakma_nedeni]" id="modal_is_birakma_nedeni" class="form-control" rows="2"></textarea></div>
                    
                    {* Ev Adresi ve Acil Durum Kişi İletişim *}
                    <div class="form-group"><label for="modal_ev_adresi">Ev Adresi</label><textarea name="modal_personel_data[ev_adresi]" id="modal_ev_adresi" class="form-control" rows="2"></textarea></div>
                    <div class="form-group"><label for="modal_acil_durum_kisisi">Acil Durum Kişi ve İletişim</label><textarea name="modal_personel_data[acil_durum_kisi_iletisim]" id="modal_acil_durum_kisisi" class="form-control" rows="2" placeholder="Ad Soyad, Telefon Numarası, Yakınlık Derecesi"></textarea></div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">{$LANG.closeButton}</button>
                    <button type="button" class="btn btn-info" id="validateNviButton">TCKN Doğrula</button>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> {$LANG.saveChangesButton}</button>
                </div>
            </form>
        </div>
    </div>
</div>