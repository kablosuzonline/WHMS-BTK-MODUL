{* WHMCS BTK Raporlama Modülü - Ayarlar Sayfası (config.tpl) - V3.0.0 - Tam Sürüm *}

{if $successmessage}
    <div class="alert alert-success text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-check-circle"></i> {$successmessage}
    </div>
{/if}
{if $errormessage}
    <div class="alert alert-danger text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-times-circle"></i> {$errormessage}
    </div>
{/if}
{if $infomessage}
    <div class="alert alert-info text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-info-circle"></i> {$infomessage}
    </div>
{/if}

<form method="post" action="{$modulelink}&action=config" id="btkConfigForm" class="form-horizontal">
    <input type="hidden" name="saveconfig" value="1">
    <input type="hidden" name="token" value="{$csrfToken}">
    <input type="hidden" name="current_tab" id="current_tab_input" value="{if $smarty.get.tab}{$smarty.get.tab}{else}genelAyarlar{/if}">

    <ul class="nav nav-tabs" role="tablist" id="btkConfigTabs">
        <li role="presentation" class="active"><a href="#genelAyarlar" aria-controls="genelAyarlar" role="tab" data-toggle="tab"><i class="fas fa-cogs"></i> {$_LANG.btk_tab_general_settings|default:"Genel Ayarlar"}</a></li>
        <li role="presentation"><a href="#ftpAyarlari" aria-controls="ftpAyarlari" role="tab" data-toggle="tab"><i class="fas fa-server"></i> {$_LANG.btk_tab_ftp_settings|default:"FTP Ayarları"}</a></li>
        <li role="presentation"><a href="#yedekFtpAyarlari" aria-controls="yedekFtpAyarlari" role="tab" data-toggle="tab"><i class="fas fa-hdd"></i> {$_LANG.btk_tab_backup_ftp_settings|default:"Yedek FTP Ayarları"}</a></li>
        <li role="presentation"><a href="#cronAyarlari" aria-controls="cronAyarlari" role="tab" data-toggle="tab"><i class="far fa-clock"></i> {$_LANG.btk_tab_cron_settings|default:"Cron Zamanlama"}</a></li>
        <li role="presentation"><a href="#yetkiTanimlari" aria-controls="yetkiTanimlari" role="tab" data-toggle="tab"><i class="fas fa-id-badge"></i> {$_LANG.btk_tab_yetki_tanimlari|default:"Yetki Türleri"}</a></li>
        <li role="presentation"><a href="#productGroupMappingsTab" aria-controls="productGroupMappingsTab" role="tab" data-toggle="tab" onclick="window.location='{$modulelink}&action=productgroupmap'; return false;"><i class="fas fa-sitemap"></i> {$_LANG.btk_tab_product_group_mappings_menu|default:"Ürün Grubu Eşleştirme"}</a></li>
        <li role="presentation"><a href="#digerAyarlar" aria-controls="digerAyarlar" role="tab" data-toggle="tab"><i class="fas fa-sliders-h"></i> {$_LANG.btk_tab_other_settings|default:"Diğer Ayarlar"}</a></li>
    </ul>

    <div class="tab-content btk-config-page" style="padding-top: 20px; border: 1px solid #ddd; border-top:0; padding:20px; background-color:#fff; border-radius:0 0 4px 4px;">
        {* Genel Ayarlar Sekmesi *}
        <div role="tabpanel" class="tab-pane active" id="genelAyarlar">
            <h4>{$_LANG.btk_operator_info_title|default:"Operatör Bilgileri"}</h4>
            <hr>
            <div class="form-group row">
                <label for="operator_code" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_operator_code|default:"Operatör Kodu"} {$tooltip_operator_code}</label>
                <div class="col-sm-4">
                    <input type="text" name="operator_code" id="operator_code" value="{$settings.operator_code}" class="form-control" placeholder="Örn: 123" maxlength="3" required>
                </div>
            </div>
            <div class="form-group row">
                <label for="operator_name" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_operator_name|default:"Operatör Adı (Dosya Adı İçin)"} {$tooltip_operator_name}</label>
                <div class="col-sm-6">
                    <input type="text" name="operator_name" id="operator_name" value="{$settings.operator_name}" class="form-control" placeholder="Örn: XYZTELEKOM" required>
                     <small class="form-text text-muted">{$_LANG.btk_operator_name_desc|default:"Dosya adlarında kullanılacak, boşluksuz, Türkçe karakter içermeyen kısa ad (örn: XYZTELEKOM)."}</small>
                </div>
            </div>
            <div class="form-group row">
                <label for="operator_unvani" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_operator_unvani|default:"Operatör Tam Ticari Unvanı"} {$tooltip_operator_unvani}</label>
                <div class="col-sm-8">
                    <input type="text" name="operator_unvani" id="operator_unvani" value="{$settings.operator_unvani}" class="form-control" placeholder="Örn: XYZ TELEKOMÜNİKASYON ANONİM ŞİRKETİ" required>
                    <small class="form-text text-muted">{$_LANG.btk_operator_unvani_desc|default:"Personel raporu gibi resmi belgelerde kullanılacak tam ticari unvan."}</small>
                </div>
            </div>
             <div class="form-group row">
                <label for="default_rapor_yetki_tipi" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_default_rapor_yetki_tipi|default:"Varsayılan Rapor Yetki Tipi"}</label>
                <div class="col-sm-4">
                    <select name="default_rapor_yetki_tipi" id="default_rapor_yetki_tipi" class="form-control">
                        {foreach from=$btk_dosya_tip_kodlari item=kod}
                            <option value="{$kod}" {if $settings.default_rapor_yetki_tipi == $kod}selected{/if}>{$kod}</option>
                        {/foreach}
                    </select>
                    <small class="form-text text-muted">{$_LANG.btk_tooltip_default_rapor_yetki_tipi|default:"Eğer bir WHMCS ürün grubu herhangi bir BTK Yetki Türü ile eşleştirilmemişse veya ürünün hizmet detaylarında özel bir Yetki Tipi belirtilmemişse, o gruptaki hizmetler için varsayılan olarak kullanılacak BTK dosya tipi kodu (örn: ISS, AIH)."}</small>
                </div>
            </div>
        </div>

        {* FTP Ayarları Sekmesi *}
        <div role="tabpanel" class="tab-pane" id="ftpAyarlari">
            <h4>{$_LANG.btk_main_ftp_settings_title|default:"Ana BTK FTP Sunucu Ayarları"}</h4>
            <hr>
            <div class="form-group row">
                <label for="ftp_host" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_ftp_host|default:"FTP Sunucu Adresi"}</label>
                <div class="col-sm-6"><input type="text" name="ftp_host" id="ftp_host" value="{$settings.ftp_host}" class="form-control" placeholder="ftp.btk.gov.tr veya IP"></div>
            </div>
            <div class="form-group row">
                <label for="ftp_username" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_ftp_username|default:"FTP Kullanıcı Adı"}</label>
                <div class="col-sm-4"><input type="text" name="ftp_username" id="ftp_username" value="{$settings.ftp_username}" class="form-control"></div>
            </div>
            <div class="form-group row">
                <label for="ftp_password" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_ftp_password|default:"FTP Şifre"}</label>
                <div class="col-sm-4"><input type="password" name="ftp_password" id="ftp_password" value="" class="form-control" placeholder="{if $settings.ftp_password_exists}{$_LANG.btk_ftp_password_placeholder_exists|default:"Değiştirmek için yeni şifre girin"}{else}{$_LANG.btk_ftp_password_placeholder_new|default:"FTP Şifresi"}{/if}"></div>
            </div>
            <div class="form-group row">
                <label for="ftp_port" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_ftp_port|default:"FTP Port"}</label>
                <div class="col-sm-2"><input type="number" name="ftp_port" id="ftp_port" value="{$settings.ftp_port|default:21}" class="form-control"></div>
            </div>
             <div class="form-group row">
                <label for="use_passive_ftp" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_use_passive_ftp|default:"Pasif Mod FTP"}</label>
                <div class="col-sm-6"><input type="checkbox" name="use_passive_ftp" id="use_passive_ftp" value="1" {if $settings.use_passive_ftp == '1'}checked{/if}> <label for="use_passive_ftp" class="font-weight-normal"> {$_LANG.btk_ftp_active|default:"Aktif"}</label></div>
            </div>
            <div class="form-group row">
                <label for="ftp_rehber_path" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_ftp_rehber_path|default:"Abone Rehber Yolu"}</label>
                <div class="col-sm-6"><input type="text" name="ftp_rehber_path" id="ftp_rehber_path" value="{$settings.ftp_rehber_path|default:'/REHBER/'}" class="form-control" placeholder="/REHBER/"></div>
            </div>
             <div class="form-group row">
                <label for="ftp_hareket_path" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_ftp_hareket_path|default:"Abone Hareket Yolu"}</label>
                <div class="col-sm-6"><input type="text" name="ftp_hareket_path" id="ftp_hareket_path" value="{$settings.ftp_hareket_path|default:'/HAREKET/'}" class="form-control" placeholder="/HAREKET/"></div>
            </div>
            <div class="form-group row">
                <label for="personel_ftp_path" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_personel_ftp_path|default:"Personel Listesi Yolu"}</label>
                <div class="col-sm-6"><input type="text" name="personel_ftp_path" id="personel_ftp_path" value="{$settings.personel_ftp_path|default:'/PERSONEL/'}" class="form-control" placeholder="/PERSONEL/"></div>
            </div>
             <small class="form-text text-muted offset-sm-3">{$_LANG.btk_ftp_path_help|default:"FTP yolları genellikle BTK tarafından belirtildiği gibi /abone/REHBER/ veya /abone/HAREKET/ şeklinde olabilir. Personel için /PERSONEL/ olabilir. Lütfen BTK'dan teyit ediniz."}</small>
        </div>

        {* Yedek FTP Ayarları Sekmesi *}
        <div role="tabpanel" class="tab-pane" id="yedekFtpAyarlari">
            <h4>{$_LANG.btk_backup_ftp_settings_title|default:"Yedek FTP Sunucu Ayarları"}</h4>
            <hr>
            <div class="form-group row">
                <label for="use_yedek_ftp" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_use_yedek_ftp|default:"Yedek FTP Kullan"}</label>
                <div class="col-sm-6"><input type="checkbox" name="use_yedek_ftp" id="use_yedek_ftp" value="1" {if $settings.use_yedek_ftp == '1'}checked{/if}> <label for="use_yedek_ftp" class="font-weight-normal"> {$_LANG.btk_ftp_active|default:"Aktif"}</label></div>
            </div>
            <div id="yedekFtpDetails" {if $settings.use_yedek_ftp != '1'}style="display:none;"{/if}>
                 <div class="form-group row">
                    <label for="yedek_ftp_host" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_yedek_ftp_host|default:"Yedek FTP Sunucu"}</label>
                    <div class="col-sm-6"><input type="text" name="yedek_ftp_host" id="yedek_ftp_host" value="{$settings.yedek_ftp_host}" class="form-control"></div>
                </div>
                 <div class="form-group row">
                    <label for="yedek_ftp_username" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_yedek_ftp_username|default:"Yedek FTP Kullanıcı"}</label>
                    <div class="col-sm-4"><input type="text" name="yedek_ftp_username" id="yedek_ftp_username" value="{$settings.yedek_ftp_username}" class="form-control"></div>
                </div>
                <div class="form-group row">
                    <label for="yedek_ftp_password" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_yedek_ftp_password|default:"Yedek FTP Şifre"}</label>
                    <div class="col-sm-4"><input type="password" name="yedek_ftp_password" id="yedek_ftp_password" value="" class="form-control" placeholder="{if $settings.yedek_ftp_password_exists}{$_LANG.btk_ftp_password_placeholder_exists|default:"Değiştirmek için yeni şifre girin"}{else}{$_LANG.btk_ftp_password_placeholder_new|default:"Yedek FTP Şifresi"}{/if}"></div>
                </div>
                <div class="form-group row">
                    <label for="yedek_ftp_port" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_yedek_ftp_port|default:"Yedek FTP Port"}</label>
                    <div class="col-sm-2"><input type="number" name="yedek_ftp_port" id="yedek_ftp_port" value="{$settings.yedek_ftp_port|default:21}" class="form-control"></div>
                </div>
                <div class="form-group row">
                    <label for="use_passive_yedek_ftp" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_use_passive_yedek_ftp|default:"Yedek Pasif Mod FTP"}</label>
                    <div class="col-sm-6"><input type="checkbox" name="use_passive_yedek_ftp" id="use_passive_yedek_ftp" value="1" {if $settings.use_passive_yedek_ftp == '1'}checked{/if}> <label for="use_passive_yedek_ftp" class="font-weight-normal"> {$_LANG.btk_ftp_active|default:"Aktif"}</label></div>
                </div>
                 <div class="form-group row">
                    <label for="yedek_ftp_rehber_path" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_yedek_ftp_rehber_path|default:"Yedek Abone Rehber Yolu"}</label>
                    <div class="col-sm-6"><input type="text" name="yedek_ftp_rehber_path" id="yedek_ftp_rehber_path" value="{$settings.yedek_ftp_rehber_path|default:'/REHBER/'}" class="form-control" placeholder="/REHBER/"></div>
                </div>
                 <div class="form-group row">
                    <label for="yedek_ftp_hareket_path" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_yedek_ftp_hareket_path|default:"Yedek Abone Hareket Yolu"}</label>
                    <div class="col-sm-6"><input type="text" name="yedek_ftp_hareket_path" id="yedek_ftp_hareket_path" value="{$settings.yedek_ftp_hareket_path|default:'/HAREKET/'}" class="form-control" placeholder="/HAREKET/"></div>
                </div>
                <div class="form-group row">
                    <label for="yedek_personel_ftp_path" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_yedek_personel_ftp_path|default:"Yedek Personel Listesi Yolu"}</label>
                    <div class="col-sm-6"><input type="text" name="yedek_personel_ftp_path" id="yedek_personel_ftp_path" value="{$settings.yedek_personel_ftp_path|default:'/PERSONEL/'}" class="form-control" placeholder="/PERSONEL/"></div>
                </div>
            </div>
        </div>

        {* Cron Zamanlama Sekmesi *}
        <div role="tabpanel" class="tab-pane" id="cronAyarlari">
            <h4>{$_LANG.btk_cron_settings_title|default:"Otomatik Rapor Gönderim Zamanlamaları"} {$tooltip_cron}</h4>
            <hr>
            <div class="form-group row">
                <label for="rehber_cron_schedule" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_rehber_cron_schedule|default:"Abone Rehber Raporu Zamanı"}</label>
                <div class="col-sm-4"><input type="text" name="rehber_cron_schedule" id="rehber_cron_schedule" value="{$settings.rehber_cron_schedule|default:'0 2 1 * *'}" class="form-control" placeholder="Örn: 0 2 1 * * (Her ayın 1''i 02:00)"></div>
            </div>
             <div class="form-group row">
                <label for="hareket_cron_schedule" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_hareket_cron_schedule|default:"Abone Hareket Raporu Zamanı"}</label>
                <div class="col-sm-4"><input type="text" name="hareket_cron_schedule" id="hareket_cron_schedule" value="{$settings.hareket_cron_schedule|default:'0 1 * * *'}" class="form-control" placeholder="Örn: 0 1 * * * (Her gün 01:00)"></div>
            </div>
            <div class="form-group row">
                <label for="personel_cron_schedule_haziran" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_personel_cron_schedule_haziran|default:"Personel Raporu (Haziran Dönemi)"}</label>
                <div class="col-sm-4"><input type="text" name="personel_cron_schedule_haziran" id="personel_cron_schedule_haziran" value="{$settings.personel_cron_schedule_haziran|default:'0 3 L 6 *'}" class="form-control" placeholder="Örn: 0 3 L 6 * (Haziran son günü 03:00)"></div>
            </div>
             <div class="form-group row">
                <label for="personel_cron_schedule_aralik" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_personel_cron_schedule_aralik|default:"Personel Raporu (Aralık Dönemi)"}</label>
                <div class="col-sm-4"><input type="text" name="personel_cron_schedule_aralik" id="personel_cron_schedule_aralik" value="{$settings.personel_cron_schedule_aralik|default:'0 3 L 12 *'}" class="form-control" placeholder="Örn: 0 3 L 12 * (Aralık son günü 03:00)"></div>
            </div>
             <div class="form-group row">
                <label for="hareket_arsivleme_periyodu_ay" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_hareket_arsivleme_periyodu_ay|default:"Hareket Log Arşivleme Periyodu (Ay)"}</label>
                <div class="col-sm-2"><input type="number" name="hareket_arsivleme_periyodu_ay" id="hareket_arsivleme_periyodu_ay" value="{$settings.hareket_arsivleme_periyodu_ay|default:6}" class="form-control" min="0"></div>
                 <div class="col-sm-7"><small class="form-text text-muted">{$_LANG.btk_hareket_arsivleme_periyodu_ay_desc|default:"Raporlanmış hareketlerin kaç ay sonra `mod_btk_abone_hareketler_arsiv` tablosuna taşınacağını belirtir. 0 girilirse arşivleme yapılmaz."}</small></div>
            </div>
            <div class="alert alert-info col-sm-offset-3 col-sm-9">
                {$_LANG.btk_whmcs_cron_info|default:"<strong>WHMCS Cron Kurulumu:</strong> Bu zamanlamaların çalışması için WHMCS sistem cronunun sunucunuzda doğru bir şekilde kurulmuş olması gerekmektedir. Genellikle her 5 dakikada bir çalışacak şekilde ayarlanır."}
            </div>
        </div>
        
        {* Yetki Türleri Tanımları Sekmesi *}
        <div role="tabpanel" class="tab-pane" id="yetkiTanimlari">
            <h4>{$_LANG.btk_yetki_tanimlari_title|default:"BTK Yetki Türü Tanımları"}</h4>
            <p>{$_LANG.btk_yetki_tanimlari_desc|default:"İşletmenizin sahip olduğu ve raporlama yapacağı BTK yetki türlerini burada tanımlayabilirsiniz. Bu tanımlar, ürün gruplarınızla eşleştirilerek hangi hizmetin hangi yetki tipi altında raporlanacağını belirler."}</p>
            <button type="button" class="btn btn-success" data-toggle="modal" data-target="#yetkiTuruModal" data-action="add" style="margin-bottom:15px;"><i class="fas fa-plus-circle"></i> {$_LANG.btk_add_new_yetki_turu|default:"Yeni Yetki Türü Ekle"}</button>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>{$_LANG.btk_yetki_kullanici_adi|default:"Yetki Adı (Açıklayıcı)"}</th>
                            <th>{$_LANG.btk_btk_dosya_tip_kodu|default:"BTK Dosya Tipi Kodu"}</th>
                            <th class="text-center">{$_LANG.btk_aktif_mi|default:"Aktif mi?"}</th>
                            <th class="text-center">{$_LANG.btk_bos_dosya_gonder|default:"Boş Dosya Gönder?"}</th>
                            <th width="100" class="text-center">{$_LANG.btk_actions|default:"İşlemler"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foreach from=$yetki_turleri_listesi item=yetki}
                        <tr>
                            <td>{$yetki->yetki_kullanici_adi}</td>
                            <td>{$yetki->btk_dosya_tip_kodu}</td>
                            <td class="text-center">{if $yetki->aktif_mi}<i class="fas fa-check text-success"></i>{else}<i class="fas fa-times text-danger"></i>{/if}</td>
                            <td class="text-center">{if $yetki->bos_dosya_gonder}<i class="fas fa-check text-success"></i>{else}<i class="fas fa-times text-danger"></i>{/if}</td>
                            <td class="text-center">
                                <button type="button" class="btn btn-xs btn-info edit-yetki-btn" data-id="{$yetki->id}" data-adi="{$yetki->yetki_kullanici_adi}" data-kodu="{$yetki->yetki_kullanici_kodu}" data-dosya_tipi="{$yetki->btk_dosya_tip_kodu}" data-aktif="{$yetki->aktif_mi}" data-bos_dosya="{$yetki->bos_dosya_gonder}" data-toggle="modal" data-target="#yetkiTuruModal"><i class="fas fa-edit"></i></button>
                                <a href="{$modulelink}&action=delete_yetki_turu&delete_id={$yetki->id}&token={$csrfToken}" class="btn btn-xs btn-danger delete-yetki-btn" onclick="return confirm('{$_LANG.btk_confirm_delete_yetki|default:"Bu yetki türünü silmek istediğinizden emin misiniz?"}')"><i class="fas fa-trash"></i></a>
                            </td>
                        </tr>
                        {foreachelse}
                        <tr><td colspan="5" class="text-center">Tanımlı yetki türü bulunmamaktadır.</td></tr>
                        {/foreach}
                    </tbody>
                </table>
            </div>
        </div>

        {* Diğer Ayarlar Sekmesi *}
        <div role="tabpanel" class="tab-pane" id="digerAyarlar">
            <h4>{$_LANG.btk_other_settings_title|default:"Çeşitli Ayarlar"}</h4>
            <hr>
            <div class="form-group row">
                <label for="password_confirm_timeout" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_password_confirm_timeout|default:"Şifre Onay Zaman Aşımı (Dakika)"}</label>
                <div class="col-sm-2">
                    <input type="number" name="password_confirm_timeout" id="password_confirm_timeout" value="{$settings.password_confirm_timeout|default:15}" class="form-control" min="5" max="120">
                </div>
                <div class="col-sm-7"><small class="form-text text-muted">{$_LANG.btk_password_confirm_timeout_desc|default:"Modülün hassas bölümlerine erişim için girilen şifrenin ne kadar süreyle geçerli olacağı."}</small></div>
            </div>
            <div class="form-group row">
                <label for="nvi_revalidate_days" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_nvi_revalidate_days|default:"NVI Yeniden Doğrulama Periyodu (Gün)"}</label>
                <div class="col-sm-2">
                    <input type="number" name="nvi_revalidate_days" id="nvi_revalidate_days" value="{$settings.nvi_revalidate_days|default:30}" class="form-control" min="0">
                </div>
                <div class="col-sm-7"><small class="form-text text-muted">{$_LANG.btk_nvi_revalidate_days_desc|default:"Raporlama sırasında, NVI ile doğrulanmış bir kimlik numarasının kaç gün sonra tekrar doğrulanacağını belirtir. 0 girilirse her raporlamada tekrar doğrulanır."}</small></div>
            </div>
            <div class="form-group row">
                <label for="delete_tables_on_deactivate" class="col-sm-3 col-form-label text-md-right">{$_LANG.btk_delete_tables_on_deactivate|default:"Modül Devre Dışı Bırakılınca Tabloları Sil"}</label>
                <div class="col-sm-6">
                    <input type="checkbox" name="delete_tables_on_deactivate" id="delete_tables_on_deactivate" value="1" {if $settings.delete_tables_on_deactivate == '1'}checked{/if}> 
                    <label for="delete_tables_on_deactivate" class="font-weight-normal"> {$_LANG.btk_delete_tables_on_deactivate_desc|default:"Evet, modül devre dışı bırakıldığında tüm BTK veritabanı tablolarını sil."}</label><br>
                    <strong class="text-danger">{$_LANG.btk_delete_tables_warning|default:"DİKKAT: Bu seçenek işaretliyse, modülü devre dışı bıraktığınızda tüm BTK verileriniz kalıcı olarak silinecektir!"}</strong>
                </div>
            </div>
        </div>

    </div>

    <div class="form-group text-center" style="margin-top: 30px;">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$_LANG.btk_save_changes|default:"Ayarları Kaydet"}</button>
        <a href="{$modulelink}" class="btn btn-default btn-lg">{$_LANG.btk_cancel|default:"İptal"}</a>
    </div>
</form>

{* Yetki Türü Ekleme/Düzenleme Modalı *}
<div class="modal fade" id="yetkiTuruModal" tabindex="-1" role="dialog" aria-labelledby="yetkiTuruModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <form method="post" action="{$modulelink}&action=save_yetki_turu" id="yetkiTuruModalForm">
        <input type="hidden" name="token" value="{$csrfToken}">
        <input type="hidden" name="yetki_id" id="modal_yetki_id" value="0">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="yetkiTuruModalLabel">{$_LANG.btk_add_new_yetki_turu|default:"Yeni Yetki Türü Ekle"}</h4>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="modal_yetki_kullanici_adi">{$_LANG.btk_yetki_kullanici_adi|default:"Yetki Adı (Açıklayıcı)"}</label>
            <input type="text" class="form-control" id="modal_yetki_kullanici_adi" name="yetki_kullanici_adi" required>
          </div>
          <div class="form-group">
            <label for="modal_btk_dosya_tip_kodu">{$_LANG.btk_btk_dosya_tip_kodu|default:"BTK Dosya Tipi Kodu"} {$info_icon_yetki_dosya_tipi}</label>
            <select name="btk_dosya_tip_kodu" id="modal_btk_dosya_tip_kodu" class="form-control" required>
                <option value="">{$_LANG.pleaseselectone}</option>
                {foreach from=$btk_dosya_tip_kodlari item=kod}
                    <option value="{$kod}">{$kod}</option>
                {/foreach}
            </select>
             <small class="form-text text-muted">{$_LANG.btk_yetki_kodu_dosya_tipi_aciklama|default:"BTK'nın belirlediği dosya tipi kodları (ISS, AIH, STH, GSM, UYDU, MOBIL, TT)."}</small>
          </div>
           <div class="form-group">
                <label for="modal_yetki_aktif_mi">{$_LANG.btk_aktif_mi|default:"Aktif mi?"}</label>
                <div><input type="checkbox" name="aktif_mi" id="modal_yetki_aktif_mi" value="1" checked> <label for="modal_yetki_aktif_mi" class="font-weight-normal">Bu yetki türü için raporlama aktif olsun.</label></div>
           </div>
           <div class="form-group">
                <label for="modal_yetki_bos_dosya">{$_LANG.btk_bos_dosya_gonder|default:"Boş Dosya Gönder?"}</label>
                <div><input type="checkbox" name="bos_dosya_gonder" id="modal_yetki_bos_dosya" value="1"> <label for="modal_yetki_bos_dosya" class="font-weight-normal">Bu yetki tipi için veri olmasa bile FTP'ye boş rapor dosyası gönderilsin.</label></div>
           </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">{$_LANG.btk_cancel|default:"İptal"}</button>
          <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> {$_LANG.btk_save_changes|default:"Kaydet"}</button>
        </div>
      </form>
    </div>
  </div>
</div>


<script type="text/javascript">
$(document).ready(function() {
    // Aktif sekmeyi hatırla ve URL hash'ine göre ayarla
    var hash = window.location.hash;
    if (hash) {
        $('#btkConfigTabs a[href="' + hash + '"]').tab('show');
        $('#current_tab_input').val(hash.substring(1));
    }

    $('#btkConfigTabs a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
      var newHash = $(this).attr('href');
      $('#current_tab_input').val(newHash.substring(1));
      // Tarayıcı geçmişini çok fazla kirletmemek için URL hash'ini sadece submit sonrası güncelleyebiliriz
      // window.location.hash = newHash; 
    });
    
    // Form submit edildiğinde aktif sekmeyi de gönder
    $('#btkConfigForm').submit(function() {
        var activeTab = $('#btkConfigTabs li.active a').attr('href');
        if (activeTab) {
            $('#current_tab_input').val(activeTab.substring(1));
        }
    });

    // Yedek FTP ayarlarını göster/gizle
    $('#use_yedek_ftp').change(function() {
        if($(this).is(":checked")) {
            $('#yedekFtpDetails').slideDown();
        } else {
            $('#yedekFtpDetails').slideUp();
        }
    }).trigger('change'); // Sayfa yüklendiğinde durumu ayarla

    // Yetki Türü Modal İşlemleri
    $('#yetkiTuruModal').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget); 
      var action = button.data('action');
      var modal = $(this);
      if (action === 'add') {
        modal.find('.modal-title').text('{$_LANG.btk_add_new_yetki_turu|default:"Yeni Yetki Türü Ekle"}');
        modal.find('#modal_yetki_id').val('0');
        modal.find('#yetkiTuruModalForm').trigger("reset");
        modal.find('#modal_yetki_aktif_mi').prop('checked', true);
        modal.find('#modal_yetki_bos_dosya').prop('checked', false);
      } else {
        modal.find('.modal-title').text('{$_LANG.btk_edit_yetki_turu|default:"Yetki Türünü Düzenle"}');
        modal.find('#modal_yetki_id').val(button.data('id'));
        modal.find('#modal_yetki_kullanici_adi').val(button.data('adi'));
        // modal.find('#modal_yetki_kullanici_kodu').val(button.data('kodu')); // Artık btk_dosya_tip_kodu ile aynı
        modal.find('#modal_btk_dosya_tip_kodu').val(button.data('dosya_tipi'));
        modal.find('#modal_yetki_aktif_mi').prop('checked', button.data('aktif') == 1);
        modal.find('#modal_yetki_bos_dosya').prop('checked', button.data('bos_dosya') == 1);
      }
    });

    $('[data-toggle="tooltip"]').tooltip();
});
</script>