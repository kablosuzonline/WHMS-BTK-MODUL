{*
    WHMCS BTK Raporlama Modülü - ISS POP Noktası Yönetimi Sayfası
    Sürüm: 7.2.5 (Operatör - Kritik Hata Düzeltmeleri)
*}

<div id="btk-pop-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>{$LANG.issPopManagementIntro}</p>

<div class="text-right" style="margin-bottom: 15px;">
    <button type="button" class="btn btn-success" data-toggle="modal" data-target="#addEditPopModal" data-mode="add">
        <i class="fas fa-plus-circle"></i> {$LANG.addNewPopButton}
    </button>
</div>

<div class="tablebg">
    <table id="tblPopDefinitions" class="datatable" width="100%" border="0" cellspacing="1" cellpadding="3">
        <thead>
            <tr>
                <th>{$LANG.popAdiHeader}</th>
                <th>{$LANG.popYayinYapilanSsidHeader}</th>
                <th>{$LANG.popIlIlceHeader}</th>
                {if $monitoring_enabled}
                    <th class="text-center">{$LANG.popLiveStatusHeader}</th>
                    <th class="text-center">{$LANG.popLatencyHeader}</th>
                    <th class="text-center no-sort">{$LANG.popMonitoringActiveHeader}</th>
                {/if}
                <th class="text-center">{$LANG.statusLabel}</th>
                <th width="120" class="no-sort text-center">{$LANG.actionsHeader}</th>
            </tr>
        </thead>
        <tbody>
            {if $popDefinitions}
                {foreach from=$popDefinitions item=pop}
                    <tr>
                        <td>{$pop.pop_adi|escape}</td>
                        <td>{$pop.yayin_yapilan_ssid|escape}</td>
                        <td>{$pop.il_adi|default:''}{if $pop.il_adi && $pop.ilce_adi} / {/if}{$pop.ilce_adi|default:''}</td>
                        {if $monitoring_enabled}
                            <td class="text-center">
                                {if $pop.canli_durum == 'ONLINE'}
                                    <span class="label label-success">ONLINE</span>
                                {elseif $pop.canli_durum == 'OFFLINE'}
                                    <span class="label label-danger">OFFLINE</span>
                                {elseif $pop.canli_durum == 'HIGH_LATENCY'}
                                    <span class="label label-warning" title="Gecikme: {$pop.son_ping_gecikmesi_ms} ms">YÜKSEK GECİKME</span>
                                {else}
                                    <span class="label label-default" title="Henüz izlenmedi veya izleme kapalı.">BİLİNMİYOR</span>
                                {/if}
                            </td>
                            <td class="text-center">{$pop.son_ping_gecikmesi_ms|default:'N/A'}</td>
                            <td class="text-center">
                                <input type="checkbox" class="btk-pop-monitor-toggle" data-toggle="toggle" data-size="mini" data-on="{$LANG.active}" data-off="{$LANG.passive}" data-onstyle="success" data-offstyle="danger" data-pop-id="{$pop.id}" {if $pop.izleme_aktif}checked{/if}>
                            </td>
                        {/if}
                        <td class="text-center">
                            {if $pop.aktif_pasif_durum == 1}
                                <span class="label label-success">{$LANG.statusActive}</span>
                            {else}
                                <span class="label label-danger">{$LANG.statusPassive}</span>
                            {/if}
                        </td>
                        <td class="text-center">
                            <button type="button" class="btn btn-xs btn-info" data-pop-id="{$pop.id}" data-mode="edit" data-toggle="modal" data-target="#addEditPopModal">
                                <i class="fas fa-edit"></i>
                            </button>
                            <a href="{$modulelink}&action=delete_pop_definition&pop_id={$pop.id}&token={$csrfToken}" class="btn btn-xs btn-danger btn-delete-confirm" data-message="{$LANG.confirmDeletePopText|sprintf:$pop.pop_adi|escape:'javascript'}">
                                <i class="fas fa-trash"></i>
                            </a>
                        </td>
                    </tr>
                {/foreach}
            {else}
                <tr>
                    <td colspan="{if $monitoring_enabled}8{else}5{/if}" class="text-center">{$LANG.noPopDefinitionsFound}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
{$pagination_output}

{* POP Ekleme/Düzenleme Modal Penceresi *}
<div class="modal fade" id="addEditPopModal" tabindex="-1" role="dialog" aria-labelledby="addEditPopModalLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=save_pop_definition" id="popDefinitionForm">
                <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
                <input type="hidden" name="popdata[id]" id="pop_id_modal" value="">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <h4 class="modal-title" id="addEditPopModalLabel"></h4>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_pop_adi">{$LANG.popAdiLabel} *</label><input type="text" name="popdata[pop_adi]" id="modal_pop_adi" class="form-control" required></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_yayin_yapilan_ssid">{$LANG.popYayinYapilanSsidHeader} *</label><input type="text" name="popdata[yayin_yapilan_ssid]" id="modal_yayin_yapilan_ssid" class="form-control" required></div></div>
                    </div>
                    <div class="row">
                         <div class="col-md-6"><div class="form-group"><label for="modal_pop_tipi">{$LANG.popTipiHeader}</label><input type="text" name="popdata[pop_tipi]" id="modal_pop_tipi" class="form-control" placeholder="Örn: Ana POP, Baz İstasyonu"></div></div>
                         <div class="col-md-6"><div class="form-group"><label for="modal_ip_adresi">Ana IP Adresi</label><input type="text" name="popdata[ip_adresi]" id="modal_ip_adresi" class="form-control" placeholder="IPv4 veya IPv6"></div></div>
                    </div>

                    <hr><h4><i class="fas fa-map-marker-alt"></i> Lokasyon Bilgileri</h4>
                    <div class="row">
                        <div class="col-md-4"><div class="form-group"><label for="modal_il_id">{$LANG.adresIlLabel} *</label><select name="popdata[il_id]" id="modal_il_id" class="form-control adres-il-select" data-target-ilce="modal_ilce_id" required><option value="">{$LANG.selectIlOption}</option>{foreach from=$iller item=il}<option value="{$il.id}">{$il.il_adi|escape}</option>{/foreach}</select></div></div>
                        <div class="col-md-4"><div class="form-group"><label for="modal_ilce_id">{$LANG.adresIlceLabel} *</label><select name="popdata[ilce_id]" id="modal_ilce_id" class="form-control adres-ilce-select" data-target-mahalle="modal_mahalle_id" required><option value="">{$LANG.selectIlceOption}</option></select></div></div>
                        <div class="col-md-4"><div class="form-group"><label for="modal_mahalle_id">{$LANG.adresMahalleLabel}</label><select name="popdata[mahalle_id]" id="modal_mahalle_id" class="form-control adres-mahalle-select"><option value="">{$LANG.selectMahalleOption}</option></select></div></div>
                    </div>
                    <div class="form-group"><label for="modal_tam_adres">Tam Adres Detayı</label><textarea name="popdata[tam_adres]" id="modal_tam_adres" class="form-control" rows="2"></textarea></div>

                    <hr><h4><i class="fas fa-network-wired"></i> Teknik Detaylar</h4>
                     <div class="row">
                        <div class="col-md-4"><div class="form-group"><label for="modal_cihaz_markasi">Cihaz Markası</label><input type="text" name="popdata[cihaz_markasi]" id="modal_cihaz_markasi" class="form-control"></div></div>
                        <div class="col-md-4"><div class="form-group"><label for="modal_cihaz_modeli">Cihaz Modeli</label><input type="text" name="popdata[cihaz_modeli]" id="modal_cihaz_modeli" class="form-control"></div></div>
                     </div>
                     
                    {if $monitoring_enabled}
                    <hr><h4><i class="fas fa-heartbeat"></i> İzleme Ayarları</h4>
                    <div class="form-group"><label>Bu POP Noktası İzlensin mi?</label><div><input type="checkbox" name="popdata[izleme_aktif]" id="modal_izleme_aktif" data-toggle="toggle" data-on="{$LANG.yes}" data-off="{$LANG.no}"></div></div>
                    <div class="form-group"><label for="modal_izleme_ip_adresi">İzlenecek IP Adresi</label><input type="text" name="popdata[izleme_ip_adresi]" id="modal_izleme_ip_adresi" class="form-control" placeholder="Boş bırakılırsa Ana IP kullanılır"><small class="help-block">Eğer cihazın ana IP'si yerine farklı bir yönetim/izleme IP'si varsa buraya girin.</small></div>
                    <div class="form-group"><label for="modal_izleme_portu">İzlenecek Port</label><input type="number" name="popdata[izleme_portu]" id="modal_izleme_portu" class="form-control" placeholder="Örn: 80, 443, 22"><small class="help-block">Boş bırakılırsa genel izleme portu kullanılır (Genel Ayarlar'dan).</small></div>
                    {/if}

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">{$LANG.closeButton}</button>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> {$LANG.saveButton}</button>
                </div>
            </form>
        </div>
    </div>
</div>