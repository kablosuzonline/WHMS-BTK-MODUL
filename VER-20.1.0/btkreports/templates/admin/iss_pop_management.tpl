{*
    WHMCS BTK Raporlama Modülü - ISS POP Noktası Yönetimi Şablonu
    Sürüm: 20.0.0 (Operasyon PHOENIX)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version}" rel="stylesheet">

<div id="btk-pop-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>{$LANG.issPopManagementIntro}</p>

<div class="panel panel-default btk-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-filter"></i> POP Noktalarını Filtrele</h3>
    </div>
    <div class="panel-body">
        <form method="get" action="{$modulelink}">
            <input type="hidden" name="module" value="btkreports">
            <input type="hidden" name="action" value="isspop">
            <div class="row">
                <div class="col-sm-5"><input type="text" name="s_pop_adi" value="{$filter.s_pop_adi|escape}" class="form-control" placeholder="POP Adı veya SSID içinde ara..."></div>
                <div class="col-sm-5">
                    <select name="s_il_id" class="form-control">
                        <option value="">Tüm İller</option>
                        {foreach from=$iller item=il}
                        <option value="{$il.id}" {if $filter.s_il_id == $il.id}selected{/if}>{$il.il_adi|escape}</option>
                        {/foreach}
                    </select>
                </div>
                <div class="col-sm-2">
                    <div class="btn-group" style="width:100%;">
                        <button type="submit" class="btn btn-primary" style="width: calc(100% - 40px);"><i class="fas fa-search"></i> Filtrele</button>
                        <a href="{$modulelink}&action=isspop" class="btn btn-default" style="width: 40px;" title="Sıfırla"><i class="fas fa-sync-alt"></i></a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

<p>
    <button type="button" class="btn btn-success" data-toggle="modal" data-target="#modalPop" data-mode="add">
        <i class="fas fa-plus"></i> {$LANG.addNewPopButton}
    </button>
</p>

<div class="table-responsive">
    <table class="table table-striped">
        <thead>
            <tr>
                <th>{$LANG.popAdiHeader}</th>
                <th>{$LANG.popYayinYapilanSsidHeader}</th>
                <th>{$LANG.popIlIlceHeader}</th>
                <th class="text-center">{$LANG.popLiveStatusHeader}</th>
                <th class="text-center">{$LANG.popMonitoringActiveHeader}</th>
                <th class="text-center" width="100">{$LANG.actionsHeader}</th>
            </tr>
        </thead>
        <tbody>
            {foreach from=$popDefinitions item=pop}
                <tr>
                    <td>{$pop.pop_adi|escape}</td>
                    <td>{$pop.yayin_yapilan_ssid|escape}</td>
                    <td>{$pop.il_adi|escape} / {$pop.ilce_adi|escape}</td>
                    <td class="text-center">
                        {if $pop.izleme_aktif}
                            {if $pop.canli_durum == 'ONLINE'}<span class="label label-success">Çevrimiçi ({$pop.son_yanit_suresi}ms)</span>
                            {elseif $pop.canli_durum == 'OFFLINE'}<span class="label label-danger">Çevrimdışı</span>
                            {elseif $pop.canli_durum == 'HIGH_LATENCY'}<span class="label label-warning">Yüksek Gecikme ({$pop.son_yanit_suresi}ms)</span>
                            {else}<span class="label label-default">Bilinmiyor</span>{/if}
                        {else}
                            <span class="label label-default">İzlenmiyor</span>
                        {/if}
                    </td>
                    <td class="text-center">
                        <label class="btk-switch" for="izleme_aktif_toggle_{$pop.id}"><input type="checkbox" class="pop-monitoring-toggle" data-id="{$pop.id}" id="izleme_aktif_toggle_{$pop.id}" {if $pop.izleme_aktif}checked{/if} {if !$monitoring_enabled}disabled title="Global izleme kapalı"{/if}><span class="btk-slider round"></span></label>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-xs btn-primary btn-edit-pop" data-toggle="modal" data-target="#modalPop" data-mode="edit" data-id="{$pop.id}">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <a href="{$modulelink}&action=delete_pop_definition&pop_id={$pop.id}&{$csrfTokenName}={$csrfToken}" 
                           class="btn btn-xs btn-danger btn-delete-confirm"
                           data-message="{$pop.pop_adi} adlı POP noktasını silmek istediğinizden emin misiniz?">
                            <i class="fas fa-trash"></i>
                        </a>
                    </td>
                </tr>
            {foreachelse}
                <tr><td colspan="6" class="text-center">Kayıtlı POP noktası bulunamadı.</td></tr>
            {/foreach}
        </tbody>
    </table>
</div>
{$pagination_output}

{* --- POP Ekle/Düzenle Modal --- *}
<div class="modal fade" id="modalPop" tabindex="-1" role="dialog" aria-labelledby="modalPopLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=save_pop_definition" id="formPop" class="form-horizontal">
                <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
                <input type="hidden" name="popdata[id]" id="modal_pop_id" value="0">
                
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="modalPopLabel">POP Noktası Bilgileri</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group"><label for="modal_pop_adi" class="col-sm-3 control-label required">POP Adı / Cihaz Adı</label><div class="col-sm-8"><input type="text" name="popdata[pop_adi]" id="modal_pop_adi" class="form-control" required></div></div>
                    <div class="form-group"><label for="modal_yayin_yapilan_ssid" class="col-sm-3 control-label required">Yayın Yapılan SSID</label><div class="col-sm-8"><input type="text" name="popdata[yayin_yapilan_ssid]" id="modal_yayin_yapilan_ssid" class="form-control" required></div></div>
                    <div class="form-group"><label for="modal_pop_tipi" class="col-sm-3 control-label">POP Tipi</label><div class="col-sm-8"><input type="text" name="popdata[pop_tipi]" id="modal_pop_tipi" class="form-control" placeholder="Örn: Baz İstasyonu, Dağıtım Kabini"></div></div>
                    <div class="form-group"><label for="modal_cihaz_markasi" class="col-sm-3 control-label">Cihaz Markası/Modeli</label><div class="col-sm-4"><input type="text" name="popdata[cihaz_markasi]" id="modal_cihaz_markasi" class="form-control" placeholder="Marka"></div><div class="col-sm-4"><input type="text" name="popdata[cihaz_modeli]" id="modal_cihaz_modeli" class="form-control" placeholder="Model"></div></div>
                    <div class="form-group"><label class="col-sm-3 control-label">Adres</label><div class="col-sm-4"><select name="popdata[il_id]" id="modal_il_id" class="form-control"><option value="">İl Seçin</option>{foreach from=$iller item=il}<option value="{$il.id}">{$il.il_adi|escape}</option>{/foreach}</select></div><div class="col-sm-4"><select name="popdata[ilce_id]" id="modal_ilce_id" class="form-control" disabled><option value="">Önce İl Seçin</option></select></div></div>
                    <div class="form-group"><label class="col-sm-3 control-label"></label><div class="col-sm-8"><textarea name="popdata[tam_adres]" id="modal_tam_adres" class="form-control" rows="2" placeholder="Açık Adres"></textarea></div></div>
                    <div class="form-group"><label class="col-sm-3 control-label">Koordinatlar</label><div class="col-sm-4"><input type="text" name="popdata[pop_koordinat_enlem]" id="modal_pop_koordinat_enlem" class="form-control" placeholder="Enlem (Örn: 41.015137)"></div><div class="col-sm-4"><input type="text" name="popdata[pop_koordinat_boylam]" id="modal_pop_koordinat_boylam" class="form-control" placeholder="Boylam (Örn: 28.979530)"></div></div>
                    <div class="form-group"><label class="col-sm-3 control-label">Durum</label><div class="col-sm-8" style="padding-top: 5px;"><label class="btk-switch" for="modal_aktif_pasif_durum"><input type="checkbox" name="popdata[aktif_pasif_durum]" id="modal_aktif_pasif_durum" value="1"><span class="btk-slider round"></span></label><label for="modal_aktif_pasif_durum" style="margin-left:5px; font-weight:normal; cursor:pointer;">Aktif (Raporlara Dahil Et)</label></div></div>
                    <hr>
                    <div class="form-group"><label class="col-sm-3 control-label">Ağ İzleme</label><div class="col-sm-8" style="padding-top: 5px;"><label class="btk-switch" for="modal_izleme_aktif"><input type="checkbox" name="popdata[izleme_aktif]" id="modal_izleme_aktif" value="1"><span class="btk-slider round"></span></label><label for="modal_izleme_aktif" style="margin-left:5px; font-weight:normal; cursor:pointer;">Bu POP Noktasını İzle</label></div></div>
                    <div class="form-group"><label for="modal_izleme_ip_adresi" class="col-sm-3 control-label">İzlenecek IP Adresi</label><div class="col-sm-8"><input type="text" name="popdata[izleme_ip_adresi]" id="modal_izleme_ip_adresi" class="form-control"></div></div>
                    <div class="form-group"><label for="modal_izleme_tipi" class="col-sm-3 control-label">İzleme Tipi</label><div class="col-sm-4"><select name="popdata[izleme_tipi]" id="modal_izleme_tipi" class="form-control"><option value="PING">PING</option><option value="PORT">PORT</option></select></div></div>
                    <div class="form-group" id="port_izleme_alani" style="display:none;"><label for="modal_izleme_portlari" class="col-sm-3 control-label">İzlenecek Port(lar)</label><div class="col-sm-8"><input type="text" name="popdata[izleme_portlari]" id="modal_izleme_portlari" class="form-control" placeholder="Örn: 80, 443, 22"><span class="help-block">Birden fazla portu virgülle ayırın.</span></div></div>
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
    var modulelink_js = 'addonmodules.php?module=btkreports';
    var csrfToken_js = '{$csrfToken|escape:"javascript"}';
    var csrfTokenName_js = '{$csrfTokenName|escape:"javascript"}';
    function updateCsrfToken(newToken) { if (newToken) { csrfToken_js = newToken; $('input[name="' + csrfTokenName_js + '"]').val(newToken); } }

    $('#modalPop').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var mode = button.data('mode');
        var modal = $(this);
        var form = modal.find('form');
        form[0].reset();
        $('#modal_ilce_id').html('<option value="">Önce İl Seçin</option>').prop('disabled', true);
        
        if (mode === 'edit') {
            modal.find('.modal-title').text('POP Noktasını Düzenle');
            var popId = button.data('id');
            form.find('#modal_pop_id').val(popId);

            var postData = { btk_ajax_action: 'get_pop_details', id: popId };
            postData[csrfTokenName_js] = csrfToken_js;

            $.post(modulelink_js, postData, function(response) {
                if (response && response.status === 'success' && response.data) {
                    var p = response.data;
                    form.find('#modal_pop_adi').val(p.pop_adi);
                    form.find('#modal_yayin_yapilan_ssid').val(p.yayin_yapilan_ssid);
                    form.find('#modal_pop_tipi').val(p.pop_tipi);
                    form.find('#modal_cihaz_markasi').val(p.cihaz_markasi);
                    form.find('#modal_cihaz_modeli').val(p.cihaz_modeli);
                    form.find('#modal_il_id').val(p.il_id);
                    form.find('#modal_tam_adres').val(p.tam_adres);
                    form.find('#modal_pop_koordinat_enlem').val(p.pop_koordinat_enlem);
                    form.find('#modal_pop_koordinat_boylam').val(p.pop_koordinat_boylam);
                    form.find('#modal_aktif_pasif_durum').prop('checked', p.aktif_pasif_durum == 1);
                    form.find('#modal_izleme_aktif').prop('checked', p.izleme_aktif == 1);
                    form.find('#modal_izleme_ip_adresi').val(p.izleme_ip_adresi);
                    form.find('#modal_izleme_tipi').val(p.izleme_tipi).trigger('change');
                    form.find('#modal_izleme_portlari').val(p.izleme_portlari);

                    if (p.il_id) {
                        populateDropdown('#modal_ilce_id', 'get_ilceler', p.il_id, 'Lütfen İlçe Seçin', p.ilce_id);
                    }
                }
                if (response && response.new_token) { updateCsrfToken(response.new_token); }
            }, 'json');

        } else if (mode === 'add') {
            modal.find('.modal-title').text('Yeni POP Noktası Ekle');
            form.find('#modal_pop_id').val('0');
            form.find('#modal_aktif_pasif_durum').prop('checked', true);
        }
    });

    function populateDropdown(targetElement, action, parentId, defaultText, selectedValue) {
        var $target = $(targetElement);
        $target.html('<option value="">' + defaultText + '</option>').prop('disabled', true);
        if (parentId && parentId > 0) {
            $target.prop('disabled', false).html('<option value="">Yükleniyor...</option>');
            var postData = { 'btk_ajax_action': action, 'parent_id': parentId };
            postData[csrfTokenName_js] = csrfToken_js;
            $.post(modulelink_js, postData, function(data) {
                $target.html('<option value="">' + defaultText + '</option>');
                if (data && data.status === 'success' && data.items) {
                    $.each(data.items, function(key, item) {
                        var option = $('<option></option>').val(item.id).text(item.name);
                        if (selectedValue && item.id == selectedValue) {
                            option.prop('selected', true);
                        }
                        $target.append(option);
                    });
                }
            }, "json");
        }
    }

    $('#modal_il_id').on('change', function() {
        populateDropdown('#modal_ilce_id', 'get_ilceler', $(this).val(), 'Lütfen İlçe Seçin');
    });

    $('#modal_izleme_tipi').on('change', function() {
        if ($(this).val() === 'PORT') {
            $('#port_izleme_alani').slideDown('fast');
        } else {
            $('#port_izleme_alani').slideUp('fast');
        }
    }).trigger('change');

    $('.pop-monitoring-toggle').on('change', function() {
        var $checkbox = $(this);
        var popId = $checkbox.data('id');
        var isEnabled = $checkbox.is(':checked');

        var postData = {
            btk_ajax_action: 'toggle_pop_monitoring',
            id: popId,
            status: isEnabled
        };
        postData[csrfTokenName_js] = csrfToken_js;

        $.post(modulelink_js, postData, function(response) {
            if (response && response.new_token) {
                updateCsrfToken(response.new_token);
            }
        }, 'json');
    });
});
</script>