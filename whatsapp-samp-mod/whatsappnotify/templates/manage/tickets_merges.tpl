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
            {if $mergeFields['tickets'] && count($mergeFields['tickets']) > 0}
            <br>
            <br>
            <strong>Extra Merge Fields:</strong>
            {foreach from=$mergeFields['tickets'] key=field item=description}
                <br>{$field} - {$description}
            {/foreach}
            {/if}
        </div>
        <div class="col-md-6">
            {literal}
            <br>{TicketID} - Ticket ID (For Ticket WHATSAPP)
            <br>{TicketStatus} - Ticket Status (close/open/hold)
            <br>{TicketSubject} - Ticket Subject
            <br>{TicketPriority} - Ticket Priority
            <br>{TicketDate} - Ticket Created Date
            <br>{TicketNumber} - Ticket Number
            <br>{TicketMessage} - Ticket Message
            <br>{TicketDeparteman} - Ticket Departeman
            <br>{TicketLastReplyMessage} - Ticket Last Reply Message
            <br>{TicketLastReplyDate} - Ticket Last Reply Date
            {/literal}
        </div>
    </div>   
</div>