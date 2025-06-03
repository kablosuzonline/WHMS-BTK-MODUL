{literal}
    <div style="margin-top:10px; " class="alert alert-info">
    <strong>Available Merge Fields:</strong>
        <div class="row">
            <div class="col-md-6">
                <br>{CompanyName} - Your Company Name
                <br>{ClientID} - Clients ID
                <br>{ClientFullName} - Clients Full Name
                <br>{ClientCompany} - Clients Company Name    
                <br>{ClientFirstName} - Clients First Name
                <br>{ClientLastName} - Clients Last Name
                <br>{ClientEmail} - Clients Email
                <br>{ClientCredit} - Clients Credit
                <br>{ClientCountry} - Clients Country
                <br>{ClientCurrency} - Clients Currency
                {/literal}
                {if $mergeFields['invoices'] && count($mergeFields['invoices']) > 0}
                <br>
                <br>
                <strong>Extra Merge Fields:</strong>
                {foreach from=$mergeFields['invoices'] key=field item=description}
                    <br>{$field} - {$description}
                {/foreach}
                {/if}
            </div>
            <div class="col-md-6">
                {literal}
                <br>{InvoiceID} - Invoice ID (Format: #123)
                <br>{InvoiceDueDate} - Invoice Due Date
                <br>{InvoiceTotal} - Invoice Total (Format: $1.00 USD - In client currency)
                <br>{InvoiceDomain} - Invoice related domain
                <br>{InvoiceDate} - Invoice Date Created
                <br>{InvoicePaymentLink} - Invoice Payment Link
                <br>{InvoiceFile} - Invoice View File
                <br>{InvoicePaymentMethod} - Invoice Payment Method
                <br>{InvoiceStatus} - Invoice Status
                <br>{InvoiceTaxRate} - Invoice TaxRate
                <br>{InvoiceTax} - Invoice Tax
                <br>{InvoiceSubtotal} - Invoice Sub Total
                <br>{InvoiceDatePaid} - Invoice Date Paid
                <br>{InvoiceItems} - Invoice Items
                {/literal}
            </div>
        </div>
    </div>