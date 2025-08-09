{*
    WHMCS BTK Raporlama Modülü - E-Sözleşme Başvuruları Sayfası
    Sürüm: 20.0.0 (Operasyon PHOENIX)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version}" rel="stylesheet">

<div id="btk-basvuru-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>Bu bölüm, E-Devlet Kapısı üzerinden işletmenize yapılan ve onayınızı bekleyen gerçek abonelik başvurularını listeler. Başvuruları buradan inceleyebilir, WHMCS üzerinde müşteri ve hizmet kaydı oluşturabilir ve E-Devlet test/canlı ortamından nihai onayı verebilirsiniz.</p>

<div class="panel panel-default btk-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-file-signature"></i> Gelen Başvurular</h3>
    </div>
    <div class="panel-body">
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Başvuru Ref No</th>
                        <th>TCKN / VKN</th>
                        <th>Ad Soyad / Ünvan</th>
                        <th class="text-center">Durum</th>
                        <th class="text-center">Başvuru Tarihi</th>
                        <th width="220" class="text-center">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    {foreach from=$basvurular item=basvuru}
                        <tr>
                            <td>{$basvuru.basvuru_referans_no|escape}</td>
                            <td>{$basvuru.tckn|escape}{$basvuru.vkn|escape}</td>
                            <td>{$basvuru.ad|escape} {$basvuru.soyad|escape}{$basvuru.unvan|escape}</td>
                            <td class="text-center">
                                {if $basvuru.durum == 'BEKLEMEDE'}
                                    <span class="label label-warning">Onay Bekliyor</span>
                                {elseif $basvuru.durum == 'ONAYLANDI'}
                                    <span class="label label-success">Onaylanmış</span>
                                {elseif $basvuru.durum == 'REDDEDILDI'}
                                    <span class="label label-danger">Reddedilmiş</span>
                                {else}
                                     <span class="label label-danger">{$basvuru.durum|escape}</span>
                                {/if}
                            </td>
                            <td class="text-center">
                                {$basvuru.basvuru_tarihi|date_format:"%d.%m.%Y %H:%M"}
                            </td>
                            <td class="text-center">
                                <button type="button" class="btn btn-xs btn-info btn-view-details" data-json='{$basvuru.full_request_json|escape:"html"}' data-toggle="modal" data-target="#modalBasvuruDetay">
                                    <i class="fas fa-eye"></i> Detaylar
                                </button>
                                {if $basvuru.durum == 'BEKLEMEDE'}
                                <a href="{$modulelink}&action=approve_esozlesme_basvuru&ref={$basvuru.basvuru_referans_no|escape:'url'}&{$csrfTokenName}={$csrfToken}" 
                                   class="btn btn-xs btn-success btn-approve-confirm">
                                    <i class="fas fa-user-plus"></i> Onayla & Müşteri Oluştur
                                </a>
                                {elseif $basvuru.whmcs_client_id > 0}
                                    <a href="clientssummary.php?userid={$basvuru.whmcs_client_id}" class="btn btn-xs btn-primary" target="_blank">
                                        <i class="fas fa-user"></i> Müşteriyi Gör
                                    </a>
                                {/if}
                            </td>
                        </tr>
                    {foreachelse}
                         <tr>
                            <td colspan="6" class="text-center">İşlem bekleyen yeni başvuru bulunmamaktadır.</td>
                        </tr>
                    {/foreach}
                </tbody>
            </table>
        </div>
        {$pagination_output}
    </div>
</div>

<div class="modal fade" id="modalBasvuruDetay" tabindex="-1" role="dialog" aria-labelledby="modalBasvuruDetayLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="modalBasvuruDetayLabel">Başvuru Detayları (Ham Veri)</h4>
            </div>
            <div class="modal-body">
                <p>E-Devlet üzerinden gelen ham başvuru verisi aşağıdadır:</p>
                <pre id="basvuruDetayJson" style="max-height: 500px;"></pre>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Kapat</button>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
$(document).ready(function() {
    $('#modalBasvuruDetay').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var jsonDataString = button.data('json');
        var modal = $(this);
        
        try {
            var parsedJson = JSON.parse(jsonDataString);
            var formattedJson = JSON.stringify(parsedJson, null, 4);
            modal.find('#basvuruDetayJson').text(formattedJson);
        } catch (e) {
            modal.find('#basvuruDetayJson').text("JSON verisi ayrıştırılamadı. Ham Veri:\n\n" + jsonDataString);
        }
    });

    $('.btn-approve-confirm').on('click', function(e) {
        if (!confirm('Bu başvuru için WHMCS üzerinde yeni bir müşteri ve hizmet oluşturulacaktır. BTK sistemine ONAY gönderilecektir. Devam etmek istediğinizden emin misiniz?')) {
            e.preventDefault();
        }
    });
});
</script>