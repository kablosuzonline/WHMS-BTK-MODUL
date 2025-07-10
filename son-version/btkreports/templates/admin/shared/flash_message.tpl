{*
    WHMCS BTK Raporlama Modülü - Flash Mesaj Gösterim Şablonu
    Sürüm: 7.2.8 (Operatör)
    
    Bu şablon, bir işlem sonrası (örn: ayarları kaydetme) oturuma (session)
    kaydedilen başarı, uyarı veya hata mesajlarını arayüzde göstermek için kullanılır.
*}

{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert" style="margin: 0 15px 15px 15px;">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error' or $flashMessage.type == 'danger'}fa-exclamation-circle{elseif $flashMessage.type == 'warning'}fa-exclamation-triangle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message|unescape:'html'}
    </div>
{/if}