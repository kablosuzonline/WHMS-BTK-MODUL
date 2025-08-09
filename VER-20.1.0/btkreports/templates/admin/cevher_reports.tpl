{*
    WHMCS BTK Raporlama Modülü - CEVHER Raporları Sayfası
    Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX - Anayasal Uyum)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version}" rel="stylesheet">

<div id="btk-cevher-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>Bu bölümden, BTK'nın CEVHER platformu için talep ettiği, yılın her çeyreğinde gönderilmesi gereken bütünsel Excel (.xlsx) formatındaki faaliyet raporlarını oluşturabilirsiniz.</p>

<div class="panel panel-default btk-widget">
    <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-calendar-alt"></i> Rapor Dönemi Seçimi</h3></div>
    <div class="panel-body">
        <form id="cevherReportForm" class="form-inline text-center">
            <div class="form-group">
                <label for="report_year">Yıl:</label>
                <select id="report_year" name="report_year" class="form-control">
                    {for $year=$start_year to $end_year}
                        <option value="{$year}">{$year}</option>
                    {/for}
                </select>
            </div>
            <div class="form-group" style="margin-left: 20px;">
                <label for="report_ceyrek">Çeyrek:</label>
                <select id="report_ceyrek" name="report_ceyrek" class="form-control">
                    <option value="1">1. Çeyrek (Ocak - Mart)</option>
                    <option value="2">2. Çeyrek (Nisan - Haziran)</option>
                    <option value="3">3. Çeyrek (Temmuz - Eylül)</option>
                    <option value="4">4. Çeyrek (Ekim - Aralık)</option>
                </select>
            </div>
        </form>
    </div>
</div>

<div class="panel panel-default btk-widget">
    <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-file-excel"></i> Oluşturulacak Raporlar</h3></div>
    <div class="panel-body">
        <div class="alert alert-warning">
            <i class="fas fa-exclamation-triangle"></i> <strong>Önemli Not:</strong> Oluşturulan raporlardaki 'Trafik Bilgileri' gibi bazı teknik veriler, sistem tarafından otomatik olarak doldurulamamaktadır. Lütfen dosyayı BTK'ya göndermeden önce bu alanları kendi ağ kayıtlarınıza göre <strong>manuel olarak doldurduğunuzdan</strong> emin olunuz.
        </div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Rapor Adı</th>
                    <th>Açıklama</th>
                    <th class="text-center">İşlem</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Genel Bilgiler Raporu</strong></td>
                    <td>İşletmenin genelini kapsayan (personel, toplam gelir vb.) ana rapor.</td>
                    <td class="text-center">
                        <button class="btn btn-success btn-generate-cevher" data-yetki-grup="GENEL"><i class="fas fa-info-circle"></i> Oluştur ve İndir</button>
                    </td>
                </tr>
                <tr><td colspan="3" style="background-color:#f9f9f9; font-weight:bold;">Faaliyet Raporları (Yetki Türüne Göre)</td></tr>
                {foreach from=$activeBtkAuthGroups item=grup}
                <tr>
                    <td><strong>{$grup} Faaliyet Raporu</strong></td>
                    <td>Sadece {$grup} yetkisi kapsamındaki faaliyetler (aboneler, gelirler, altyapı vb.).</td>
                    <td class="text-center">
                        <button class="btn btn-primary btn-generate-cevher" data-yetki-grup="{$grup}"><i class="fas fa-briefcase"></i> Oluştur ve İndir</button>
                    </td>
                </tr>
                {foreachelse}
                <tr><td colspan="3" class="text-center">Rapor oluşturmak için <a href="{$modulelink}&action=config">Genel Ayarlar</a> sayfasından en az bir yetki türünü aktifleştirmeniz gerekmektedir.</td></tr>
                {/foreach}
            </tbody>
        </table>
        <div id="cevher-result-container" class="alert" style="display: none; margin-top: 20px;"></div>
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

    $('.btn-generate-cevher').on('click', function(e) {
        e.preventDefault();
        var $button = $(this);
        var yetkiGrup = $button.data('yetki-grup');
        var year = $('#report_year').val();
        var ceyrek = $('#report_ceyrek').val();
        var $resultContainer = $('#cevher-result-container');
        
        $('.btn-generate-cevher').prop('disabled', true).addClass('disabled');
        $resultContainer.removeClass('alert-danger alert-success alert-info').addClass('alert-info').html('<i class="fas fa-spinner fa-spin"></i> Rapor oluşturuluyor, lütfen bekleyin...').slideDown();

        var postData = {
            btk_ajax_action: 'generate_cevher_report',
            yetki_grup: yetkiGrup,
            year: year,
            ceyrek: ceyrek
        };
        postData[csrfTokenName_js] = csrfToken_js;

        $.post(modulelink_js, postData, function(response) {
            if (response && response.status === true) {
                var message = response.message;
                if (response.download_link) {
                    message += ' <a href="' + response.download_link + '" class="alert-link"><strong>Şimdi İndir</strong></a>';
                }
                $resultContainer.removeClass('alert-info').addClass('alert-success').html('<i class="fas fa-check-circle"></i> ' + message);
            } else {
                var errorMessage = response.message || 'Bilinmeyen bir hata oluştu. Lütfen modül loglarını kontrol edin.';
                $resultContainer.removeClass('alert-info').addClass('alert-danger').html('<i class="fas fa-exclamation-triangle"></i> ' + errorMessage);
            }
            if (response && response.new_token) {
                updateCsrfToken(response.new_token);
            }
        }, 'json').fail(function() {
            $resultContainer.removeClass('alert-info').addClass('alert-danger').html('<i class="fas fa-exclamation-triangle"></i> Sunucuya ulaşılamadı veya bir AJAX hatası oluştu.');
        }).always(function() {
            $('.btn-generate-cevher').prop('disabled', false).removeClass('disabled');
        });
    });
});
</script>