<input name="country" value="{$WHCONFIG.DefaultCountry}" type="hidden">
<form method="post" action="">
    <input type="hidden" name="save" value="1">
   {$table} 
   <div class="btn-container">
    <input id="saveChanges" type="submit" value="{$WALANG.SaveChanges}" class="btn btn-primary">
</div>
</form>
