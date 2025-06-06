{*
 * WHMCS BTK Raporlama Modülü - Ana Sayfa (Dashboard)
 * Version: 6.0.3 (Tam Tasarım ve İşlevsellik)
*}

{* Sayfa Üstü WHMCS Admin Alanı Navigasyonu *}
<div class="context-bar">
    <div class="breadcrumbs">
        <a href="index.php">WHMCS Admin</a>
        <i class="far fa-angle-right"></i>
        <a href="addonmodules.php">Eklenti Modülleri</a>
        <i class="far fa-angle-right"></i>
        <a href="{$modulelink}">{$LANG.btkreports_modul_adi}</a>
        <i class="far fa-angle-right"></i>
        {$LANG.btkreports_anasayfa}
    </div>
</div>

{* Genel Modül Başlığı *}
<div class="btk-module-header">
    <i class="fas fa-tachometer-alt"></i> {$LANG.btkreports_anasayfa}
    <span class="version-text">v{$version}</span>
</div>

{* Modül İçi Sekme Navigasyonu *}
<ul class="nav nav-tabs admin-tabs btk-nav-tabs-override" role="tablist" id="btkModuleTabs">
    <li class="active"><a href="{$modulelink}&action=dashboard" data-action="dashboard">{$LANG.btkreports_anasayfa}</a></li>
    <li><a href="{$modulelink}&action=config" data-action="config">{$LANG.btkreports_ayarlar}</a></li>
    <li><a href="{$modulelink}&action=productgroupmap" data-action="productgroupmap">{$LANG.btkreports_urun_grup_eslestirme}</a></li>
    <li><a href="{$modulelink}&action=personel" data-action="personel">{$LANG.btkreports_personel_yonetimi}</a></li>
    <li><a href="{$modulelink}&action=generatereports" data-action="generatereports">{$LANG.btkreports_rapor_secimi_ve_islem}</a></li>
    <li><a href="{$modulelink}&action=viewlogs" data-action="viewlogs">{$LANG.btkreports_gunluk_kayitlari}</a></li>
</ul>

<div class="tab-content admin-tabs btk-tab-content-override">
    <div role="tabpanel" class="tab-pane active" id="dashboard_content_tab">

        {* Hata ve Başarı Mesajları için Alan *}
        {if $smarty.get.initial_data_result eq 'success' && !$successmessage_initial_data_shown_on_dashboard}
             <div class="alert alert-success text-center" role="alert" id="initialDataSuccessMsgGlobal">
                <i class="fas fa-check-circle"></i> {$smarty.get.message|urldecode|default:($LANG.btk_initial_data_success_button_gone|default:'Başlangıç verileri başarıyla yüklendi!')}
            </div>
            {assign var="successmessage_initial_data_shown_on_dashboard" value=true}
        {elseif $smarty.get.initial_data_result eq 'error' && !$errormessage_initial_data_shown_on_dashboard}
            <div class="alert alert-danger text-center" role="alert" id="initialDataErrorMsgGlobal">
                 <i class="fas fa-exclamation-circle"></i> {$smarty.get.message|urldecode|default:($LANG.btk_initial_data_error_generic|default:'Başlangıç verileri yüklenirken bir hata oluştu.')}
            </div>
            {assign var="errormessage_initial_data_shown_on_dashboard" value=true}
        {/if}

        {if $successmessage && !$successmessage_initial_data_shown_on_dashboard}
            <div class="alert alert-success text-center" role="alert">
                <i class="fas fa-check-circle"></i> {$successmessage}
            </div>
        {/if}
        {if $errormessage && !$successmessage_initial_data_shown_on_dashboard} {* Config'den gelen error varsa göster *}
            <div class="alert alert-danger text-center" role="alert">
                <i class="fas fa-exclamation-circle"></i> {$errormessage}
            </div>
        {/if}


        {* Başlangıç Verileri Yükleme Uyarısı ve Butonu (Eğer yüklenmemişse) *}
        {if $referansVeriDurumu && !$referansVeriDurumu.loaded}
            <div class="btk-section-container btk-warning-section">
                <div class="btk-section-title-bar btk-widget-title-orange">
                    <i class="fas fa-exclamation-triangle"></i> {$LANG.btk_initial_data_warning_title|default:'Önemli Kurulum Adımı'}
                </div>
                <div class="btk-section-content text-center">
                    <p>{$referansVeriDurumu.message|default:'Başlangıç verileri henüz yüklenmemiş. Modülün doğru çalışması için lütfen aşağıdaki butona tıklayarak referans verilerini yükleyin.'}</p>
                    <p>
                        <button type="button" id="loadInitialDataBtn" class="btn btn-warning btn-lg">
                            <i class="fas fa-database"></i> {$LANG.btk_load_initial_data_button|default:'Başlangıç Verilerini Şimdi Yükle'}
                        </button>
                    </p>
                    <div id="initialDataStatus" style="margin-top:10px; font-weight:bold;"></div>
                </div>
            </div>
        {/if}

        <div class="row btk-dashboard-row">
            {* Sol Kutu - Modül Bilgileri *}
            <div class="col-md-3">
                <div class="btk-section-container btk-dashboard-widget">
                    <div class="btk-section-title-bar btk-widget-title-blue">
                        <i class="fas fa-cube"></i> {$LANG.btk_module_info_title|default:'Modül Bilgileri'}
                    </div>
                    <div class="btk-section-content text-center">
                        <h4>Version: {$version}</h4>
                        <hr class="btk-hr-muted">
                        <p style="font-weight:bold; margin-bottom: 5px;">{$LANG.btkreports_surum_notlari_baslik|default:'Sürüm Notları ve Kılavuz'}</p>
                        <p><a href="{$modulelink}&action=readme" target="_blank" class="text-muted" title="{$LANG.btkreports_surum_notlari_link_aciklama|default:'Kullanım Kılavuzu ve Sürüm Notları'}">
                            <i class="fas fa-book-open"></i> {$LANG.btkreports_readme_link_text|default:'Kılavuzu Oku'}
                        </a></p>
                    </div>
                </div>
            </div>

            {* Orta Kutu - FTP Durumu ve Son Gönderimler *}
            <div class="col-md-5">
                <div class="btk-section-container btk-dashboard-widget">
                    <div class="btk-section-title-bar btk-widget-title-green">
                         <i class="fas fa-broadcast-tower"></i> {$LANG.btkreports_btk_sunucu_bilgileri_durumu|default:'BTK Sunucu Entegrasyonu'}
                    </div>
                    <div class="btk-section-content btk-ftp-status-content">
                        <table class="table table-sm btk-info-table">
                            <tr>
                                <td width="40%"><strong>{$LANG.btk_ana_ftp_durum|default:'Ana FTP Durumu'}</strong></td>
                                <td class="btk-ftp-status-cell">:
                                    <span id="ftpStatusAnaText" class="status-text {if $ftpDurumu.ana.status eq 'success'}text-success{elseif $ftpDurumu.ana.status eq 'error' || $ftpDurumu.ana.status eq 'config_needed'}text-danger{else}text-muted{/if}">
                                        {if $ftpDurumu.ana.status eq 'success'}<i class="fas fa-check-circle"></i> {$LANG.btkreports_aktif}{elseif $ftpDurumu.ana.status eq 'error' || $ftpDurumu.ana.status eq 'config_needed'}<i class="fas fa-times-circle"></i> {$LANG.btkreports_pasif}{else}<i class="fas fa-question-circle"></i> {$LANG.btkreports_test_bekleniyor|default:'Test Bekleniyor'}{/if}
                                    </span>
                                    {if $btk_operator_kodu_set && $currentConfig.ftp_host && $currentConfig.ftp_username}
                                        <button type="button" id="testFtpAnaIndex" class="btn btn-xs btn-info btk-test-btn" title="{$LANG.btk_ana_ftp_test_et_tooltip|default:'Ana FTP Bağlantısını Şimdi Test Et'}" data-resultdiv="ftpTestResultAnaIndex" data-ftptype="ana">
                                            <i class="fas fa-sync-alt"></i>
                                        </button>
                                    {/if}
                                    <div id="ftpTestResultAnaIndex" class="ftp-test-result-inline">{if $ftpDurumu.ana.status eq 'error' || $ftpDurumu.ana.status eq 'config_needed'}<small class="text-danger">({$ftpDurumu.ana.message})</small>{/if}</div>
                                </td>
                            </tr>
                            {if $currentConfig.ftp_yedek_aktif}
                            <tr>
                                <td><strong>{$LANG.btk_yedek_ftp_durum|default:'Yedek FTP Durumu'}</strong></td>
                                <td class="btk-ftp-status-cell">:
                                    <span id="ftpStatusYedekText" class="status-text {if $ftpDurumu.yedek.status eq 'success'}text-success{elseif $ftpDurumu.yedek.status eq 'error' || $ftpDurumu.yedek.status eq 'config_needed'}text-danger{elseif $ftpDurumu.yedek.status eq 'disabled'}text-warning{else}text-muted{/if}">
                                         {if $ftpDurumu.yedek.status eq 'success'}<i class="fas fa-check-circle"></i> {$LANG.btkreports_aktif}{elseif $ftpDurumu.yedek.status eq 'error' || $ftpDurumu.yedek.status eq 'config_needed'}<i class="fas fa-times-circle"></i> {$LANG.btkreports_pasif}{elseif $ftpDurumu.yedek.status eq 'disabled'}<i class="fas fa-ban"></i> {$ftpDurumu.yedek.message}{else}<i class="fas fa-question-circle"></i> {$LANG.btkreports_test_bekleniyor|default:'Test Bekleniyor'}{/if}
                                    </span>
                                     {if $btk_operator_kodu_set && $currentConfig.ftp_yedek_aktif && $currentConfig.ftp_host_yedek && $currentConfig.ftp_username_yedek}
                                        <button type="button" id="testFtpYedekIndex" class="btn btn-xs btn-info btk-test-btn" title="{$LANG.btk_yedek_ftp_test_et_tooltip|default:'Yedek FTP Bağlantısını Şimdi Test Et'}" data-resultdiv="ftpTestResultYedekIndex" data-ftptype="yedek">
                                            <i class="fas fa-sync-alt"></i>
                                        </button>
                                     {/if}
                                    <div id="ftpTestResultYedekIndex" class="ftp-test-result-inline">{if $ftpDurumu.yedek.status eq 'error' || $ftpDurumu.yedek.status eq 'config_needed'}<small class="text-danger">({$ftpDurumu.yedek.message})</small>{/if}</div>
                                </td>
                            </tr>
                            {/if}
                        </table>
                        <hr class="btk-hr-muted">
                        <table class="table table-sm btk-info-table">
                             <tr><td width="40%">{$LANG.btk_son_rehber_gonderim|default:'ABONE REHBER Son Gönderim'}</td><td>: <strong>{$sonGonderimler.rehber}</strong></td></tr>
                             <tr><td>{$LANG.btk_son_hareket_gonderim|default:'ABONE HAREKET Son Gönderim'}</td><td>: <strong>{$sonGonderimler.hareket}</strong></td></tr>
                             <tr><td>{$LANG.btk_son_personel_gonderim|default:'PERSONEL LİSTESİ Son Gönderim'}</td><td>: <strong>{$sonGonderimler.personel}</strong></td></tr>
                        </table>
                        {if $btk_operator_kodu_set}
                        <hr class="btk-hr-muted">
                        <p class="text-muted small btk-ftp-summary">
                            <strong>{$LANG.btk_ana_ftp|default:'Ana FTP'}:</strong> {$currentConfig.ftp_host|default:($LANG.btk_ayarlanmadi|default:'Ayarlanmadı')}
                            {if $currentConfig.ftp_path_rehber neq "/"} ({$LANG.btk_rehber_yol|default:'R'}: {$currentConfig.ftp_path_rehber|escape}){/if}
                            {if $currentConfig.ftp_path_hareket neq "/"} ({$LANG.btk_hareket_yol|default:'H'}: {$currentConfig.ftp_path_hareket|escape}){/if}
                            {if $currentConfig.ftp_path_personel neq "/"} ({$LANG.btk_personel_yol_kisa|default:'P'}: {$currentConfig.ftp_path_personel|escape}){/if}
                            {if $currentConfig.ftp_yedek_aktif}
                                <br><strong>{$LANG.btk_yedek_ftp|default:'Yedek FTP'}:</strong> {$currentConfig.ftp_host_yedek|default:($LANG.btk_ayarlanmadi|default:'Ayarlanmadı')}
                            {/if}
                        </p>
                        {/if}
                    </div>
                </div>
            </div>

            {* Sağ Kutu - Yardım ve Bilgilendirme *}
            <div class="col-md-4">
                <div class="btk-section-container btk-dashboard-widget">
                     <div class="btk-section-title-bar btk-widget-title-red">
                        <i class="fas fa-life-ring"></i> {$LANG.btkreports_yardim_bilgilendirme_baslik|default:'Yardım ve Bilgilendirme'}
                    </div>
                    <div class="btk-section-content btk-help-content">
                        <p><i class="fas fa-cog text-muted"></i> {$LANG.btkreports_yardim_bilgi_1|default:'Modülün doğru çalışması için lütfen öncelikle "Modül Genel Ayarları" bölümünden tüm yapılandırmaları yapın.'}</p>
                        <p><i class="fas fa-sitemap text-muted"></i> {$LANG.btkreports_yardim_bilgi_2|default:'"Ürün Grubu - BTK Yetki Eşleştirme" ile WHMCS ürünlerinizi BTK kategorileriyle eşleştirin.'}</p>
                        <p><i class="fas fa-user-edit text-muted"></i> {$LANG.btkreports_yardim_bilgi_3_v2|default:'Müşteri ve hizmet bazlı BTK verilerini ilgili sayfalardan (geliştiriliyor) yönetin.'}</p>
                        <p><i class="fas fa-upload text-muted"></i> {$LANG.btkreports_yardim_bilgi_4|default:"Raporlar, cron ayarlarınıza göre otomatik veya \"Rapor İşlemleri\" sayfasından manuel yönetilecektir."}</p>
                         <hr class="btk-hr-muted">
                         <p class="text-center">
                            <a href="{$LANG.btk_mevzuat_link_kanunlar|default:'https://www.btk.gov.tr/kanunlar'}" target="_blank" class="btn btn-default btn-xs"><i class="fas fa-balance-scale"></i> {$LANG.btk_kanunlar|default:'Kanunlar'}</a>
                            <a href="{$LANG.btk_mevzuat_link_yonetmelikler|default:'https://www.btk.gov.tr/yonetmelikler'}" target="_blank" class="btn btn-default btn-xs" style="margin-left:5px;"><i class="fas fa-gavel"></i> {$LANG.btk_yonetmelikler|default:'Yönetmelikler'}</a>
                            <a href="{$LANG.btk_teknik_dokuman_link|default:'https://www.btk.gov.tr/uploads/pages/elektronik-haberlesme-altyap-bilgilerinin-kuruma-raporlanmasina-iliskin-usul-ve-esaslar-hk-kurul-karar.pdf'}" target="_blank" class="btn btn-default btn-xs" style="margin-left:5px;"><i class="fas fa-file-pdf"></i> {$LANG.btk_teknik_dokuman_kisa|default:'Teknik Şartname'}</a>
                         </p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>

{* Global JS Değişkenleri ve JS Dosyasının Yüklenmesi (config.tpl ile aynı) *}
<script type="text/javascript">
    if (typeof BtkLang === 'undefined') { var BtkLang = {}; }
    BtkLang.test_ediliyor = "{str_replace('"', '\\"', $LANG.btkreports_test_ediliyor)}";
    BtkLang.lutfen_bekleyin = "{str_replace('"', '\\"', $LANG.btkreports_lutfen_bekleyin)}";
    BtkLang.ftp_test_basarili = "{str_replace('"', '\\"', $LANG.btkreports_ftp_test_basarili)}";
    BtkLang.ftp_test_basarisiz = "{str_replace('"', '\\"', $LANG.btkreports_ftp_test_basarisiz)}";
    BtkLang.btkreports_aktif = "{str_replace('"', '\\"', $LANG.btkreports_aktif)}";
    BtkLang.btkreports_pasif = "{str_replace('"', '\\"', $LANG.btkreports_pasif)}";
    BtkLang.btk_initial_data_loading = "{str_replace('"', '\\"', ($LANG.btk_initial_data_loading|default:'Başlangıç verileri yükleniyor, lütfen bekleyin...'))}";
    BtkLang.btk_initial_data_error_generic = "{str_replace('"', '\\"', ($LANG.btk_initial_data_error_generic|default:'Veri yüklenirken bir hata oluştu.'))}";

    var btkModuleLink = "{$modulelink|escape:'javascript'}";
    var btkCsrfToken = "{$csrfToken|escape:'javascript'}";
    var btkConfigDataForIndexTest = { // Ana sayfadaki FTP testi için kullanılacak veriler
        ana: {
            host: "{$currentConfig.ftp_host|escape:'javascript'}",
            port: "{$currentConfig.ftp_port|escape:'javascript'}",
            username: "{$currentConfig.ftp_username|escape:'javascript'}",
            // Şifre buradan gönderilmeyecek, PHP tarafı DB'den çözecek
            use_ssl: "{(($currentConfig.ftp_use_ssl == 1) ? 'true' : 'false')|escape:'javascript'}",
            passive_mode: "{(($currentConfig.ftp_passive_mode == 1) ? 'true' : 'false')|escape:'javascript'}"
        },
        yedek: {
            aktif: "{(($currentConfig.ftp_yedek_aktif == 1) ? 'true' : 'false')|escape:'javascript'}",
            host: "{$currentConfig.ftp_host_yedek|escape:'javascript'}",
            port: "{$currentConfig.ftp_port_yedek|escape:'javascript'}",
            username: "{$currentConfig.ftp_username_yedek|escape:'javascript'}",
            use_ssl: "{(($currentConfig.ftp_use_ssl_yedek == 1) ? 'true' : 'false')|escape:'javascript'}",
            passive_mode: "{(($currentConfig.ftp_passive_mode_yedek == 1) ? 'true' : 'false')|escape:'javascript'}"
        }
    };
</script>
<script type="text/javascript" src="../modules/addons/btkreports/assets/js/btk_admin_scripts.js?v={$version}"></script>