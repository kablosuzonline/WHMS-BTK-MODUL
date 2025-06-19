{* --- BÖLÜM 1 / 1 BAŞI - (templates/admin/index.tpl, Minimal _output testi için güncellendi) --- *}

<h3>Minimal TPL Yüklendi (v1.0.26 btkreports.php testi)</h3>

<p>WHMCS Page Title (Üstte görünmeli): {$pagetitle}</p>
<p>Doğrudan Output Fonksiyonundan Gelen Mesaj: {$test_mesaji_tpl_icin}</p>
<p>Output Fonksiyonundan Gelen Başka Bir Değişken: {$pageTitleFromOutput}</p>
<hr>
<p>Modül Linki (WHMCS'den): {$modulelink}</p>
<p>Dil Dizisi Örneği (WHMCS'den): {$LANG.btk_module_name|default:"Dil Değişkeni Yok"}</p>

{if isset($btkModuleError)}
    <div class="alert alert-danger">HATA (tpl): {$btkModuleError|escape}</div>
{/if}

{* --- BÖLÜM 1 / 1 SONU - (templates/admin/index.tpl, Minimal _output testi için güncellendi) --- *}