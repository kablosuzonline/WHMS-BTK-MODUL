{*
 * WHMCS BTK Raporlama Modülü - Ana Sayfa (Dashboard) - Sizin Tasarımınıza Göre
 * Version: 6.0.1 BETA
*}

<div class="btk-dashboard">
    <div class="page-header" style="margin-bottom: 0;">
        <h2 style="display: inline-block; margin-right: 10px;"><i class="fas fa-file-signature"></i> {$LANG.btkreports_modul_adi_anasayfa|default:'BTK Abone Veri Raporlama'}</h2>
        {* <small>v{$version}</small>  İsterseniz versiyonu burada da gösterebiliriz *}
    </div>

    <ul class="nav nav-tabs btk-nav-tabs" role="tablist" style="margin-bottom: 20px;" id="btkModuleTabs">
        <li role="presentation" class="active"><a href="#anasayfa_content" aria-controls="anasayfa_content" role="tab" data-toggle="tab">{$LANG.btkreports_anasayfa}</a></li>
        <li role="presentation"><a href="{$modulelink}&action=config" data-target="#config_content_placeholder" aria-controls="ayarlar" role="tab">{$LANG.btkreports_ayarlar}</a></li>
        <li role="presentation"><a href="{$modulelink}&action=productgroupmap" data-target="#productgroupmap_content_placeholder">{$LANG.btkreports_urun_grup_eslestirme}</a></li>
        <li role="presentation"><a href="{$modulelink}&action=personel" data-target="#personel_content_placeholder">{$LANG.btkreports_personel_yonetimi}</a></li>
        <li role="presentation"><a href="{$modulelink}&action=generatereports" data-target="#generatereports_content_placeholder">{$LANG.btkreports_rapor_secimi_ve_islem}</a></li>
        <li role="presentation"><a href="{$modulelink}&action=viewlogs" data-target="#viewlogs_content_placeholder">{$LANG.btkreports_gunluk_kayitlari}</a></li>
    </ul>

    <div class="tab-content btk-tab-content" style="padding:0; border:none;">
        <div role="tabpanel" class="tab-pane active" id="anasayfa_content">

            {if $successmessage}
                <div class="alert alert-success text-center" style="margin: 15px;">
                    <i class="fas fa-check-circle"></i> {$successmessage}
                </div>
            {/if}
            {if $errormessage}
                <div class="alert alert-danger text-center" style="margin: 15px;">
                    <i class="fas fa-exclamation-circle"></i> {$errormessage}
                </div>
            {/if}

            <div class="row" style="margin-left: -5px; margin-right: -5px;">
                <div class="col-md-3" style="padding-left: 5px; padding-right: 5px;">
                    <div class="panel panel-default btk-info-box" style="border-top: 3px solid #00c0ef; margin-bottom:10px;">
                        <div class="panel-body text-center">
                            <div style="margin-bottom: 10px;"><i class="fas fa-cube fa-3x" style="color: #00c0ef;"></i></div>
                            <h4 style="font-weight: bold; margin-top:0; margin-bottom: 5px; background-color: #00c0ef; color:white; padding: 5px 0; border-radius: 3px;">Module Version :V{$version}</h4>
                            <p style="font-weight:bold; margin-bottom: 5px; margin-top:10px;">{$LANG.btkreports_surum_notlari_baslik|default:'Sürüm Notlarına İlişkin'}</p>
                            <p><a href="{$modulelink}&action=readme" target="_blank" class="text-muted" title="{$LANG.btkreports_surum_notlari_link_aciklama|default:'Kullanım Kılavuzu ve Sürüm Notları'}">({$LANG.btkreports_txt_dokuman_link|default:'TXT Döküman Linki'})</a></p>
                        </div>
                    </div>
                </div>
                <div class="col-md-5" style="padding-left: 5px; padding-right: 5px;">
                    <div class="panel panel-default btk-info-box" style="border-top: 3px solid #00a65a; margin-bottom:10px;">
                        <div class="panel-heading" style="background-color: #00a65a; color:white; text-align:center; font-weight:bold;">
                             <i class="fas fa-server"></i> {$LANG.btkreports_btk_sunucu_bilgileri_durumu|default:'BTK SUNUCU BİLGİLERİ / DURUMU (AKTİF / PASİF)'}
                        </div>
                        <div class="panel-body" style="padding-top: 8px; padding-bottom: 8px;">
                            <table class="table table-condensed" style="margin-bottom: 0;">
                                <tr>
                                    <td style="width:50%; border-top:none; vertical-align:middle;"><strong>FTP Sunucu Durumu</strong></td>
                                    <td style="border-top:none; vertical-align:middle;">:
                                        <span id="ftpStatusAnaText" style="font-weight: bold; margin-right: 5px;" class="{if $ftpDurumu.ana.status === 'success'}status-aktif{elseif $ftpDurumu.ana.status === 'error'}status-pasif{else}text-muted{/if}">
                                            {if $ftpDurumu.ana.status === 'success'}{$LANG.btkreports_aktif}{elseif $ftpDurumu.ana.status === 'error'}{$LANG.btkreports_pasif}{else}{$LANG.btkreports_test_edilemedi|default:'Test Edilmedi'}{/if}
                                        </span>
                                        <button type="button" id="testFtpAnaIndex" class="btn btn-xs btn-info" title="Ana FTP Bağlantısını Şimdi Test Et"><i class="fas fa-sync-alt"></i></button>
                                        <div id="ftpTestResultAnaIndex" style="font-size:0.9em; margin-top:3px; clear:both;">{if $ftpDurumu.ana.status === 'error'}<small class="text-danger">({$ftpDurumu.ana.message})</small>{/if}</div>
                                    </td>
                                </tr>
                                <tr><td><strong>REHBER Dosya Son Gönderim</strong></td><td>: {$sonGonderimler.rehber|default:($LANG.btk_veri_yok|default:'Veri Yok')}</td></tr>
                                <tr><td><strong>HAREKET Dosya Son Gönderim</strong></td><td>: {$sonGonderimler.hareket|default:($LANG.btk_veri_yok|default:'Veri Yok')}</td></tr>
                                <tr><td><strong>PERSONEL Dosya Son Gönderim</strong></td><td>: {$sonGonderimler.personel|default:($LANG.btk_veri_yok|default:'Veri Yok')}</td></tr>
                                <tr><td colspan="2" style="padding: 3px 0;"><hr style="margin:2px 0;"></td></tr>
                                <tr><td>FTP Kullanıcı Adı</td><td>: {$currentConfig.ftp_username|default:($LANG.btk_ayarlanmadi|default:'Ayarlanmadı')}</td></tr>
                                <tr><td>FTP Sunucu Adresi (Host)</td><td>: {$currentConfig.ftp_host|default:($LANG.btk_ayarlanmadi|default:'Ayarlanmadı')}</td></tr>
                                <tr><td>FTP REHBER Dosya Yolu</td><td>: {$currentConfig.ftp_path_rehber|default:($LANG.btk_ayarlanmadi|default:'Ayarlanmadı')}</td></tr>
                                <tr><td>FTP HAREKET Dosya Yolu</td><td>: {$currentConfig.ftp_path_hareket|default:($LANG.btk_ayarlanmadi|default:'Ayarlanmadı')}</td></tr>
                                {if $currentConfig.ftp_yedek_aktif}
                                    <tr><td colspan="2" style="padding-top:10px; font-weight:bold; color:#3c8dbc; border-top: 1px dashed #ddd;">Yedek FTP Bilgileri:</td></tr>
                                    <tr>
                                        <td style="width:50%; vertical-align:middle;"><strong>Yedek FTP Sunucu Durumu</strong></td>
                                        <td style="vertical-align:middle;">:
                                            <span id="ftpStatusYedekText" style="font-weight: bold; margin-right: 5px;" class="{if $ftpDurumu.yedek.status === 'success'}status-aktif{elseif $ftpDurumu.yedek.status === 'error'}status-pasif{else}text-muted{/if}">
                                                {if $ftpDurumu.yedek.status === 'success'}{$LANG.btkreports_aktif}{elseif $ftpDurumu.yedek.status === 'error'}{$LANG.btkreports_pasif}{else}{$LANG.btkreports_test_edilemedi|default:'Test Edilmedi'}{/if}
                                            </span>
                                            <button type="button" id="testFtpYedekIndex" class="btn btn-xs btn-info" title="Yedek FTP Bağlantısını Şimdi Test Et"><i class="fas fa-sync-alt"></i></button>
                                            <div id="ftpTestResultYedekIndex" style="font-size:0.9em; margin-top:3px; clear:both;">{if $ftpDurumu.yedek.status === 'error'}<small class="text-danger">({$ftpDurumu.yedek.message})</small>{/if}</div>
                                        </td>
                                    </tr>
                                    <tr><td>Yedek FTP Kullanıcı Adı</td><td>: {$currentConfig.ftp_username_yedek|default:($LANG.btk_ayarlanmadi|default:'Ayarlanmadı')}</td></tr>
                                    <tr><td>Yedek FTP Sunucu Adresi (Host)</td><td>: {$currentConfig.ftp_host_yedek|default:($LANG.btk_ayarlanmadi|default:'Ayarlanmadı')}</td></tr>
                                {/if}
                            </table>
                        </div>
                    </div>
                </div>
                <div class="col-md-4" style="padding-left: 5px; padding-right: 5px;">
                    <div class="panel panel-default btk-info-box" style="border-top: 3px solid #dd4b39;  margin-bottom:10px;">
                         <div class="panel-heading" style="background-color: #dd4b39; color:white; text-align:center; font-weight:bold;">
                            <i class="fas fa-info-circle"></i> {$LANG.btkreports_yardim_bilgilendirme_baslik|default:'BTK SUNUCULARINA VERİ GÖNDERİM MODÜLÜ HAKKINDA YARDIM VE BİLGİLENDİRME'}
                        </div>
                        <div class="panel-body" style="font-size:13px;">
                            <p>{$LANG.btkreports_yardim_bilgi_1|default:'Modülün doğru çalışması için lütfen öncelikle "Modül Genel Ayarları" bölümünden gerekli tüm yapılandırmaları yapın.'}</p>
                            <p>{$LANG.btkreports_yardim_bilgi_2|default:'Daha sonra "Ürün Grubu - BTK Yetki Eşleştirme" bölümünden WHMCS ürün gruplarınızı ilgili BTK kategorileri ile eşleştirin.'}</p>
                            <p>{$LANG.btkreports_yardim_bilgi_3|default:'Müşteri ve hizmet bazlı BTK verilerini, ilgili müşteri özet sayfasındaki "BTK Bilgileri" sekmesinden ve hizmet detay sayfasındaki "BTK Hizmet Bilgileri" bölümünden yönetebilirsiniz (Bu özellikler sonraki BETA sürümlerinde eklenecektir).'}</p>
                            <p>{$LANG.btkreports_yardim_bilgi_4|default:"Raporlar, cron job ayarlarınıza bağlı olarak otomatik oluşturulacak ve FTP'ye yüklenecektir. Manuel rapor oluşturma ve gönderme işlemleri için \"Rapor Seçimi ve İşlem\" sayfasını kullanabilirsiniz."}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {* Diğer sekmeler için placeholder div'ler (JS ile içerik yüklenecek veya PHP yönlendirecek) *}
        <div role="tabpanel" class="tab-pane" id="config_content_placeholder"></div>
        <div role="tabpanel" class="tab-pane" id="productgroupmap_content_placeholder"></div>
        <div role="tabpanel" class="tab-pane" id="personel_content_placeholder"></div>
        <div role="tabpanel" class="tab-pane" id="generatereports_content_placeholder"></div>
        <div role="tabpanel" class="tab-pane" id="viewlogs_content_placeholder"></div>
    </div>
</div>

<script type="text/javascript">
    if (typeof BtkLang === 'undefined') { var BtkLang = {}; }
    BtkLang.test_ediliyor = "{str_replace('"', '\"', $LANG.btkreports_test_ediliyor)}";
    BtkLang.lutfen_bekleyin = "{str_replace('"', '\"', $LANG.btkreports_lutfen_bekleyin)}";
    BtkLang.ftp_test_basarili = "{str_replace('"', '\"', $LANG.btkreports_ftp_test_basarili)}";
    BtkLang.ftp_test_basarisiz = "{str_replace('"', '\"', $LANG.btkreports_ftp_test_basarisiz)}";
    var btkModuleLink = "{$modulelink}";
</script>
<script type="text/javascript" src="../modules/addons/btkreports/assets/js/btk_admin_scripts.js?v={$version}"></script>