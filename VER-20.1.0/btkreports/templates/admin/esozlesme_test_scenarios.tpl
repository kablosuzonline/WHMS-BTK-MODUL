{*
    WHMCS BTK Raporlama Modülü - E-Sözleşme Test Senaryoları Sayfası
    Sürüm: 20.0.0 (Operasyon PHOENIX)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version}" rel="stylesheet">

<div id="btk-test-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i> <strong>Uyarı:</strong> Bu sayfa sadece BTK E-Kayıt sistemi <strong>TEST</strong> modundayken görünür ve kullanılabilir. Buradan oluşturulan kayıtlar, BTK'nın test sorgularına cevap vermek için kullanılır ve gerçek abonelik oluşturmaz.
</div>

<p>Bu bölümden, BTK'nın talep ettiği test senaryolarını karşılamak üzere manuel olarak test başvuruları oluşturabilir ve yönetebilirsiniz. BTK, `eKayitBasvuruOnaySorgula` metodunu çağırdığında, sadece "Onay Bekliyor" durumundaki kayıtlar listelenecektir.</p>

<div class="panel panel-default btk-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-plus-circle"></i> Yeni Test Başvurusu Oluştur</h3>
    </div>
    <div class="panel-body">
        <form method="post" action="{$modulelink}&action=save_esozlesme_test_scenario" class="form-horizontal">
            <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">

            <div class="form-group">
                <label class="col-sm-3 control-label">Kişi Tipi</label>
                <div class="col-sm-8">
                    <label class="radio-inline"><input type="radio" name="kisi_tipi" value="gercek" checked> Gerçek Kişi</label>
                    <label class="radio-inline"><input type="radio" name="kisi_tipi" value="tuzel"> Tüzel Kişi</label>
                </div>
            </div>

            <div class="form-group">
                <label for="basvuru_durum" class="col-sm-3 control-label">Başvuru Durumu</label>
                <div class="col-sm-4">
                    <select name="basvuru_durum" id="basvuru_durum" class="form-control">
                        <option value="BEKLEMEDE">Onay Bekliyor</option>
                        <option value="ONAYLANDI">Onaylanmış</option>
                        <option value="REDDEDILDI">Reddedilmiş</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="basvuru_sayisi" class="col-sm-3 control-label">Oluşturulacak Adet</label>
                <div class="col-sm-2">
                    <input type="number" name="basvuru_sayisi" id="basvuru_sayisi" class="form-control" value="1" min="1" max="10">
                </div>
            </div>
            
            <div class="form-group">
                <div class="col-sm-offset-3 col-sm-8">
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-cogs"></i> Test Başvurularını Oluştur
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="panel panel-default btk-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-list-alt"></i> Mevcut Test Başvuruları</h3>
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
                        <th class="text-center">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    {foreach from=$test_basvurular item=basvuru}
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
                                {/if}
                            </td>
                            <td class="text-center">
                                <a href="{$modulelink}&action=delete_esozlesme_test_scenario&id={$basvuru.id}&{$csrfTokenName}={$csrfToken}" 
                                   class="btn btn-xs btn-danger btn-delete-confirm"
                                   data-message="Bu test başvurusunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.">
                                    <i class="fas fa-trash"></i> Sil
                                </a>
                            </td>
                        </tr>
                    {foreachelse}
                         <tr>
                            <td colspan="5" class="text-center">Henüz oluşturulmuş test başvurusu bulunmamaktadır.</td>
                        </tr>
                    {/foreach}
                </tbody>
            </table>
        </div>
        {if $test_basvurular}
        <div class="text-center">
            <a href="{$modulelink}&action=delete_all_esozlesme_test_scenarios&{$csrfTokenName}={$csrfToken}" 
               class="btn btn-danger btn-delete-confirm"
               data-message="TÜM test başvurularını kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.">
                <i class="fas fa-trash-alt"></i> Tüm Test Başvurularını Sil
            </a>
        </div>
        {/if}
    </div>
</div>