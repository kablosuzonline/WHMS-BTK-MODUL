{literal}
    <div style="margin-top:10px; " class="alert alert-info">
    <strong>Available Merge Fields:</strong>
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
    <br>{domain} - Domain name
    {/literal}
    {if $mergeFields['domains'] && count($mergeFields['domains']) > 0}
    <br>
    <br>
    <strong>Extra Merge Fields:</strong>
    {foreach from=$mergeFields['domains'] key=field item=description}
        <br>{$field} - {$description}
    {/foreach}
    {/if}
</div>