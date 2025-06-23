{* WHMCS BTK Raporları Modülü - Admin Paneli Ortak Uyarı/Bilgi Mesajları Şablonu *}
{* Bu şablon, diğer admin .tpl dosyalarının başına include edilir. *}
{* Flash mesajını göstermek için $flash_message Smarty değişkeni kullanılır. *}
{* $flash_message değişkeni, btkreports.php'deki output fonksiyonunda $_SESSION['btk_flash_message'] üzerinden set edilir. *}
{* $flash_message = ['type' => 'success|danger|warning|info', 'message' => 'Mesaj içeriği'] *}

{if isset($flash_message) && $flash_message}
    <div class="alert alert-{$flash_message.type|default:'info'|escape:'html':'UTF-8'} text-center btk-flash-message" role="alert" id="btkModuleGlobalFlashMessage">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
        {$flash_message.message|escape:'html':'UTF-8'}
    </div>

    {* 
        Bu script bloğu, mesajın bir süre sonra otomatik olarak kaybolmasını sağlar.
        Eğer bu işlevsellik isteniyorsa, bu TPL dosyası içinde kalabilir veya
        merkezi bir admin JS dosyasına (btk_admin_scripts.js) taşınabilir.
        Şimdilik burada bırakıyorum, çünkü bu TPL'in bir parçası olarak düşünülebilir.
    *}
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            var globalFlashMessage = $('#btkModuleGlobalFlashMessage');
            if (globalFlashMessage.length) {
                // Mesajın tipine göre farklı süreler ayarlanabilir
                var- autoHideDelay = 7000; // Varsayılan 7 saniye
                if (globalFlashMessage.hasClass('alert-success')) {
                    autoHideDelay = 5000; // Başarı mesajları 5 saniye
                } else if (globalFlashMessage.hasClass('alert-danger')) {
                    autoHideDelay = 10000; // Hata mesajları 10 saniye kalsın
                }

                setTimeout(function() {
                    globalFlashMessage.fadeOut('slow', function() {
                        $(this).remove(); // DOM'dan tamamen kaldır
                    });
                }, autoHideDelay);

                // Kapatma butonuna basıldığında da DOM'dan kaldır
                globalFlashMessage.find('.close').on('click', function() {
                    $(this).closest('.alert').remove();
                });
            }
        });
    </script>
{/if}

{*
Not: Bu şablonun düzgün çalışması için, btkreports.php dosyasındaki btkreports_output() fonksiyonunda,
$_SESSION['btk_flash_message'] içeriğinin $smartyvalues['flash_message'] olarak atanması
ve ardından session'daki bu değişkenin unset edilmesi gerekmektedir. Örneğin:

if (isset($_SESSION['btk_flash_message'])) {
    $smartyvalues['flash_message'] = $_SESSION['btk_flash_message'];
    unset($_SESSION['btk_flash_message']);
}
*}