{literal}
    <div style="margin-top:10px; " class="alert alert-info">
    <strong>Available Merge Fields:</strong>
    <div class="row">
            <div class="col-md-6">
                <br>{CompanyName} - Your Company Name
                <br>{ClientID} - Clients ID
                <br>{ClientFullName} - Clients Full Name
                <br>{ClientFirstName} - Clients First Name
                <br>{ClientCompany} - Clients Company Name    
                <br>{ClientLastName} - Clients Last Name
                <br>{ClientEmail} - Clients Email
                <br>{ClientCredit} - Clients Credit
                <br>{ClientCountry} - Clients Country
                <br>{ClientCurrency} - Clients Currency
                {/literal}
                {if $mergeFields['admin'] && count($mergeFields['admin']) > 0}
                <br>
                <br>
                <strong>Extra Merge Fields:</strong>
                {foreach from=$mergeFields['admin'] key=field item=description}
                    <br>{$field} - {$description}
                {/foreach}
                {/if}
            </div>
            <div class="col-md-6">
                {literal}
                <br>{ServiceID} - Service ID (For product WHATSAPP)
                <br>{OrderID} - Order ID (For Order WHATSAPP)
                <br>{TicketID} - Ticket ID (For Ticket WHATSAPP)
                <br>{TicketStatus} - Ticket Status (close/open/hold)
                <br>{InvoiceID} - Invoice ID (Format: #123)
                <br>{InvoiceDueDate} - Invoice Due Date
                <br>{InvoiceTotal} - Invoice Total (Format: $1.00 USD - In client currency)
                <br>{InvoiceDomain} - Invoice related domain
                <br>{domain} - Domain name (For Domain Reminder)
                {/literal}
            </div> 
    </div>    
</div>