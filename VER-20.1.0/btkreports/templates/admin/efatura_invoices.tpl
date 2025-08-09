{*
    WHMCS BTK Raporlama Modülü - E-Fatura Yönetim Sayfası
    Sürüm: 20.0.0 (Operasyon PHOENIX)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version}" rel="stylesheet">

<div id="btk-efatura-invoices-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>Bu bölümden WHMCS faturalarını yönetebilir, filtreleyebilir ve manuel olarak E-Fatura veya E-Arşiv dökümanları oluşturabilirsiniz. "Otomatik Fatura Oluşturma" ayarı kapalıyken veya belirli faturaları yeniden oluşturmak istediğinizde bu arayüzü kullanabilirsiniz.</p>

<form method="get" action="{$modulelink}">
    <input type="hidden" name="module" value="btkreports">
    <input type="hidden" name="action" value="efatura_invoices">
    <div class="panel panel-default btk-widget">
         <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-filter"></i> Faturaları Filtrele</h3></div>
        <div class="panel-body">
            <div class="row">
                <div class="col-sm-3"><input type="text" name="s_client_name" value="{$filter.s_client_name|escape}" class="form-control" placeholder="Müşteri Adı..."></div>
                <div class="col-sm-2"><input type="text" name="s_invoice_num" value="{$filter.s_invoice_num|escape}" class="form-control" placeholder="Fatura #"></div>
                <div class="col-sm-3"><input type="text" name="s_date_range" value="{$filter.s_date_range|escape}" class="form-control date-picker-search" placeholder="Fatura Tarih Aralığı"></div>
                <div class="col-sm-2">
                     <select name="s_payment_status" class="form-control">
                        <option value="">Tüm Ödeme Durumları</option>
                        <option value="Paid" {if $filter.s_payment_status == 'Paid'}selected{/if}>Ödendi</option>
                        <option value="Unpaid" {if $filter.s_payment_status == 'Unpaid'}selected{/if}>Ödenmedi</option>
                    </select>
                </div>
                <div class="col-sm-2"><button type="submit" class="btn btn-primary btn-block"><i class="fas fa-search"></i> Filtrele</button></div>
            </div>
        </div>
    </div>
</form>

<form method="post" action="{$modulelink}&action=efatura_batch_create">
    <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
    <div class="table-responsive">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th width="20"><input type="checkbox" id="checkall"/></th>
                    <th>Fatura #</th>
                    <th>Müşteri Adı</th>
                    <th>Fatura Tarihi</th>
                    <th>Toplam</th>
                    <th class="text-center">Ödeme Durumu</th>
                    <th class="text-center">E-Fatura Durumu</th>
                    <th class="text-center">İşlem</th>
                </tr>
            </thead>
            <tbody>
                {foreach from=$invoices item=invoice}
                    <tr>
                        <td><input type="checkbox" name="selected_invoices[]" value="{$invoice.id}" class="checkall"/></td>
                        <td><a href="invoices.php?action=edit&id={$invoice.id}" target="_blank">{$invoice.invoicenum}</a></td>
                        <td><a href="clientssummary.php?userid={$invoice.userid}">{$invoice.client_name|escape}</a></td>
                        <td>{$invoice.date|date_format:"%d/%m/%Y"}</td>
                        <td>{$invoice.total} {$invoice.currencycode}</td>
                        <td class="text-center"><span class="label status status-{$invoice.status|strtolower}">{$invoice.status}</span></td>
                        <td class="text-center">
                            {if $invoice.efatura_durum == 'Kesinleşti'}
                                <a href="{$invoice.pdf_url}" target="_blank" class="label label-success"><i class="fas fa-check"></i> Oluşturuldu ({$invoice.fatura_no})</a>
                            {elseif $invoice.efatura_durum}
                                <span class="label label-danger">{$invoice.efatura_durum}</span>
                            {else}
                                <span class="label label-default">Oluşturulmadı</span>
                            {/if}
                        </td>
                        <td class="text-center">
                             <button type="submit" name="single_create" value="{$invoice.id}" class="btn btn-xs btn-info">
                                <i class="fas fa-bolt"></i> Şimdi Oluştur
                            </button>
                        </td>
                    </tr>
                {foreachelse}
                    <tr><td colspan="8" class="text-center">Filtre kriterlerine uygun WHMCS faturası bulunamadı.</td></tr>
                {/foreach}
            </tbody>
        </table>
    </div>
    {$pagination_output}

    <div class="text-center" style="margin-top: 20px;">
        <button type="submit" name="batch_create_submit" class="btn btn-success btn-lg">
            <i class="fas fa-file-signature"></i> Seçili Faturalar İçin E-Fatura/E-Arşiv Oluştur
        </button>
    </div>
</form>

<script type="text/javascript">
$(document).ready(function() {
    $("#checkall").click(function () {
        $(".checkall").prop('checked', $(this).prop('checked'));
    });
});
</script>