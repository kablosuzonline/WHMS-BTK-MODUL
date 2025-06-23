{* WHMCS BTK Raporlama Modülü - Hizmet Detayları BTK Veri Giriş Formu (service_details_btk_form.tpl) - V3.0.0 - Tam Sürüm *}
{* Bu TPL, AdminAreaServiceDetailsOutput hook'u ile hizmet detayları sayfasına enjekte edilir. *}

<style>
    /* Bu TPL'e özel stiller (eğer btk_admin_style.css'de olmayanlar varsa) */
    .btk-service-custom-fields .form-group {
        margin-bottom: 1rem;
    }
    .btk-service-custom-fields h5 {
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 0.5rem;
        font-size: 1.1em;
        color: #007bff;
    }
    .btk-service-custom-fields h6 {
        font-size: 1em;
        color: #333;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }
    .btk-service-custom-fields .text-info {
        cursor: help;
        color: #17a2b8 !important;
    }
    .btk-service-custom-fields .nav-tabs > li > a {
        color: #007bff;
        border-radius: .25rem .25rem 0 0;
    }
    .btk-service-custom-fields .nav-tabs > li.active > a,
    .btk-service-custom-fields .nav-tabs > li.active > a:hover,
    .btk-service-custom-fields .nav-tabs > li.active > a:focus {
        color: #495057;
        background-color: #fff;
        border-color: #dee2e6 #dee2e6 #fff;
    }
    .btk-service-custom-fields .tab-content {
        padding-top: 15px;
        border: 1px solid #dee2e6;
        border-top: none;
        padding: 20px;
        border-radius: 0 0 .35rem .35rem;
        background-color: #fff;
    }
    .btk-form-section {
        margin-bottom: 25px;
        padding-bottom: 15px;
    }
     .btk-nvi-status-label-serv {
        font-size: 0.85em;
        padding: .3em .6em .3em;
        margin-top: 5px;
        display: inline-block;
        border-radius: .25em;
        font-weight: bold;
    }
    .btk-nvi-status-label-serv.label-success { background-color: #5cb85c; color: white; }
    .btk-nvi-status-label-serv.label-danger { background-color: #d9534f; color: white; }
    .btk-nvi-status-label-serv.label-warning { background-color: #f0ad4e; color: white; }
    .btk-nvi-status-label-serv.label-info { background-color: #5bc0de; color: white; }
    .yetki-fields-grup {
        margin-top: 15px;
        padding: 15px;
        border: 1px dashed #ccc;
        border-radius: 4px;
        background-color: #fdfdfd;
     }
    .yetki-fields-grup .row .col-md-6:nth-child(odd) { padding-right: 7px; }
    .yetki-fields-grup .row .col-md-6:nth-child(even) { padding-left: 7px; }
    .btk-disabled-field {
        background-color: #eee !important;
        opacity: 0.7;
        cursor: not-allowed;
    }
</style>

<div class="btk-service-custom-fields-container" style="margin-top: 25px; padding: 20px; border: 1px solid #cad1d7; border-radius: .35rem; background-color: #f0f3f5;">
    <h4><i class="fas fa-concierge-bell"></i> {$_LANG.btk_hizmet_btk_bilgileri_title|default:"Hizmete Özel BTK ve Operasyonel Bilgiler"} (Hizmet ID: #{$serviceId})</h4>
    <hr style="margin-bottom:20px;">

    {* Hook'tan gelen veya session'dan gelen mesajlar için alan *}
    {if $smarty.session.btk_successmessage_service && $smarty.session.btk_successmessage_service_id == $serviceId}
        <div class="alert alert-success text-center">{$smarty.session.btk_successmessage_service}</div>
        {$smarty.session.btk_successmessage_service = null} {$smarty.session.btk_successmessage_service_id = null}
    {/if}
    {if $smarty.session.btk_errormessage_service && $smarty.session.btk_errormessage_service_id == $serviceId}
        <div class="alert alert-danger text-center">{$smarty.session.btk_errormessage_service}</div>
        {$smarty.session.btk_errormessage_service = null} {$smarty.session.btk_errormessage_service_id = null}
    {/if}
     {if $smarty.session.btk_infomessage_service && $smarty.session.btk_infomessage_service_id == $serviceId}
        <div class="alert alert-info text-center">{$smarty.session.btk_infomessage_service}</div>
        {$smarty.session.btk_infomessage_service = null} {$smarty.session.btk_infomessage_service_id = null}
    {/if}
    <div id="btkServiceFormNviResultHook_{$serviceId}" style="display:none; margin-bottom:15px;" class="alert"></div>


    <form method="post" action="{$formActionLink}" id="btkServiceDetailForm_{$serviceId}">
        <input type="hidden" name="serviceid" value="{$serviceId}">
        <input type="hidden" name="userid" value="{$clientId}">
        <input type="hidden" name="token" value="{$csrfToken}">
        <input type="hidden" name="current_service_tab" id="current_service_tab_input_{$serviceId}" value="hizmetGenel_{$serviceId}">


        <ul class="nav nav-tabs" role="tablist" id="btkServiceTabs_{$serviceId}">
            <li role="presentation" class="active"><a href="#hizmetGenel_{$serviceId}" aria-controls="hizmetGenel_{$serviceId}" role="tab" data-toggle="tab"><i class="fas fa-digital-tachograph"></i> {$_LANG.btk_tab_temel_hizmet|default:"Temel Hizmet"}</a></li>
            <li role="presentation"><a href="#kimlikBilgileri_{$serviceId}" aria-controls="kimlikBilgileri_{$serviceId}" role="tab" data-toggle="tab"><i class="fas fa-id-card"></i> {$_LANG.btk_tab_abone_kimlik|default:"Abone Kimlik"}</a></li>
            <li role="presentation"><a href="#tesisAdresi_{$serviceId}" aria-controls="tesisAdresi_{$serviceId}" role="tab" data-toggle="tab"><i class="fas fa-map-marked-alt"></i> {$_LANG.btk_tab_tesis_adresi|default:"Tesis Adresi"}</a></li>
            <li role="presentation"><a href="#yetkiOzel_{$serviceId}" aria-controls="yetkiOzel_{$serviceId}" role="tab" data-toggle="tab"><i class="fas fa-puzzle-piece"></i> {$_LANG.btk_tab_yetki_ozel|default:"Yetki Özel"}</a></li>
            <li role="presentation"><a href="#operasyonel_{$serviceId}" aria-controls="operasyonel_{$serviceId}" role="tab" data-toggle="tab"><i class="fas fa-cogs"></i> {$_LANG.btk_tab_operasyonel|default:"Operasyonel"}</a></li>
            <li role="presentation"><a href="#bayiBilgileri_{$serviceId}" aria-controls="bayiBilgileri_{$serviceId}" role="tab" data-toggle="tab"><i class="fas fa-handshake"></i> {$_LANG.btk_tab_bayi|default:"Bayi"}</a></li>
        </ul>

        <div class="tab-content">
            {* Temel Hizmet Bilgileri Sekmesi *}
            <div role="tabpanel" class="tab-pane active btk-form-section" id="hizmetGenel_{$serviceId}">
                <h5><i class="fas fa-info-circle"></i> {$_LANG.btk_temel_hizmet_bilgileri|default:"Temel Hizmet Bilgileri"}</h5>
                <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_hat_no_{$serviceId}">{$_LANG.btk_hat_no|default:"Hat Numarası / Tanımlayıcı"} {$info_icon_hat_no}</label>
                    <div class="col-sm-9">
                        <input type="text" name="btk_abone_data[hat_no]" id="btk_abone_data_hat_no_{$serviceId}" value="{$btkAboneData.hat_no|default:$defaultHatNo}" class="form-control" required>
                    </div>
                </div>
                 <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_btk_rapor_yetki_tipi_kodu_{$serviceId}">{$_LANG.btk_rapor_yetki_tipi|default:"Raporlanacak BTK Yetki Tipi"} {$info_icon_rapor_yetki_tipi}</label>
                    <div class="col-sm-9">
                        <select name="btk_abone_data[btk_rapor_yetki_tipi_kodu]" id="btk_abone_data_btk_rapor_yetki_tipi_kodu_{$serviceId}" class="form-control" required>
                            <option value="">{$_LANG.pleaseselectone}</option>
                            {foreach from=$tanimliYetkiTurleri item=yetki}
                                <option value="{$yetki->btk_dosya_tip_kodu}" {if $btkAboneData.btk_rapor_yetki_tipi_kodu == $yetki->btk_dosya_tip_kodu}selected{/if}>{$yetki->yetki_kullanici_adi} ({$yetki->btk_dosya_tip_kodu})</option>
                            {/foreach}
                        </select>
                    </div>
                </div>
                <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_hizmet_tipi_{$serviceId}">{$_LANG.btk_hizmet_tipi_ek3|default:"Hizmet Tipi (BTK EK-3)"} {$info_icon_hizmet_tipi}</label>
                    <div class="col-sm-9">
                        <select name="btk_abone_data[hizmet_tipi]" id="btk_abone_data_hizmet_tipi_{$serviceId}" class="form-control" required>
                            <option value="">{$_LANG.pleaseselectone}</option>
                            {foreach from=$hizmetTipleri item=tip}
                                <option value="{$tip->hizmet_turu_kodu}" {if $btkAboneData.hizmet_tipi == $tip->hizmet_turu_kodu}selected{/if}>{$tip->deger_aciklama} ({$tip->hizmet_turu_kodu})</option>
                            {/foreach}
                        </select>
                    </div>
                </div>
                <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_abone_tarife_{$serviceId}">{$_LANG.btk_abone_tarife|default:"Abone Tarife Adı"} {$info_icon_tarife}</label>
                    <div class="col-sm-9">
                        <input type="text" name="btk_abone_data[abone_tarife]" id="btk_abone_data_abone_tarife_{$serviceId}" value="{$btkAboneData.abone_tarife|default:$defaultTarife}" class="form-control" required>
                    </div>
                </div>
                <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_statik_ip_{$serviceId}">{$_LANG.btk_statik_ip|default:"Statik IP Adresi"}</label>
                    <div class="col-sm-9">
                        <input type="text" name="btk_abone_data[statik_ip]" id="btk_abone_data_statik_ip_{$serviceId}" value="{$btkAboneData.statik_ip|default:$defaultStatikIp}" class="form-control">
                        <small class="text-muted">Birden fazla IP varsa virgülle ayırarak giriniz.</small>
                    </div>
                </div>
                 <div class="row form-group">
                    <label class="col-sm-3 control-label">{$_LANG.btk_btk_onay_durumu|default:"BTK Onay Durumu"}</label>
                    <div class="col-sm-9">
                        <p class="form-control-static">
                            {if $btkAboneData.btk_onay_durumu == 'Onaylandi'}
                                <span class="label label-success">{$_LANG.btk_onay_durumu_onaylandi|default:"Onaylandı (Aktif)"}</span>
                            {elseif $btkAboneData.btk_onay_durumu == 'OnayBekliyor'}
                                <span class="label label-warning">{$_LANG.btk_onay_durumu_onaybekliyor|default:"Onay Bekliyor"}</span>
                            {elseif $btkAboneData.btk_onay_durumu == 'Reddedildi'}
                                <span class="label label-danger">{$_LANG.btk_onay_durumu_reddedildi|default:"Reddedildi"}</span>
                            {elseif $btkAboneData.btk_onay_durumu == 'IptalEdildi'}
                                <span class="label label-danger">{$_LANG.btk_onay_durumu_iptaledildi|default:"İptal Edildi"}</span>
                            {else}
                                <span class="label label-default">{$_LANG.btk_onay_durumu_verigiristamamlanmadi|default:"Veri Girişi Tamamlanmadı"}</span>
                            {/if}
                        </p>
                        {if $btkAboneData.btk_onay_durumu == 'VeriGirisTamamlanmadi' || $btkAboneData.btk_onay_durumu == 'OnayBekliyor' || !$btkAboneData.id}
                            <a href="{$modulelink}&action=complete_btk_and_accept_order&serviceid={$serviceId}&token={$csrfToken}" class="btn btn-sm btn-success" onclick="return confirm('{$_LANG.btk_confirm_complete_btk_and_accept_order|default:"Bu hizmet için BTK veri girişini tamamlayıp siparişi onaylamak istediğinizden emin misiniz? Bu işlem \"YENİ ABONELİK KAYDI\" hareketi oluşturacaktır."}');">
                                <i class="fas fa-check-circle"></i> {$_LANG.btk_btn_complete_and_accept_order|default:"BTK Kaydını Tamamla ve Aktif Et"}
                            </a>
                            <small class="help-block">Bu buton, girilen BTK verilerini doğrular, hizmeti "Onaylandı" ve "Aktif" durumuna getirir, ilgili BTK hareketini loglar.</small>
                        {/if}
                    </div>
                </div>
                <div class="row form-group">
                    <label class="col-sm-3 control-label">{$_LANG.btk_hat_durum_kodu|default:"Hat Durum Kodu"}</label>
                    <div class="col-sm-9">
                         <p class="form-control-static">{$btkAboneData.hat_durum_kodu|default:'N/A'} ({$btkAboneData.hat_durum_kodu_aciklama|default:'Belirlenmemiş'})</p>
                         <small class="text-muted">Hizmet durumu değişiklikleri (askıya alma, iptal vb.) WHMCS üzerinden yapıldığında bu alan otomatik güncellenir ve ilgili hareket loglanır.</small>
                    </div>
                </div>
                <div class="row form-group">
                    <label class="col-sm-3 control-label">{$_LANG.btk_abone_baslangic|default:"Abonelik Başlangıç Tarihi"}</label>
                    <div class="col-sm-4">
                        <input type="text" name="btk_abone_data[abone_baslangic_display]" value="{$btkAboneData.abone_baslangic|btk_datetime_format:'d.m.Y H:i:s'}" class="form-control datetime-picker-btk-service" placeholder="GG.AA.YYYY SS:DD:SS">
                        <input type="hidden" name="btk_abone_data[abone_baslangic]" id="abone_baslangic_btk_service_{$serviceId}" value="{$btkAboneData.abone_baslangic}">
                    </div>
                </div>
                <div class="row form-group">
                    <label class="col-sm-3 control-label">{$_LANG.btk_abone_bitis|default:"Abonelik Bitiş Tarihi"}</label>
                    <div class="col-sm-4">
                        <input type="text" name="btk_abone_data[abone_bitis_display]" value="{$btkAboneData.abone_bitis|btk_datetime_format:'d.m.Y H:i:s'}" class="form-control datetime-picker-btk-service" placeholder="GG.AA.YYYY SS:DD:SS">
                         <input type="hidden" name="btk_abone_data[abone_bitis]" id="abone_bitis_btk_service_{$serviceId}" value="{$btkAboneData.abone_bitis}">
                        <small class="text-muted">Sözleşme bitiş tarihi. İptal durumunda otomatik olarak güncellenir.</small>
                    </div>
                </div>
            </div>

            {* Abone Kimlik Bilgileri Sekmesi *}
            <div role="tabpanel" class="tab-pane btk-form-section" id="kimlikBilgileri_{$serviceId}">
                <h5><i class="fas fa-id-card-alt"></i> {$_LANG.btk_abone_kimlik_bilgileri|default:"Abone Kimlik Bilgileri"}</h5>
                <p><small class="text-muted">Bu hizmete özel abone kimlik bilgilerini buradan düzenleyebilirsiniz. Boş bırakılırsa, müşteri profilindeki genel BTK bilgileri (varsa) kullanılır.</small></p>
                 <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_musteri_tipi_serv_{$serviceId}">{$_LANG.btk_musteri_tipi|default:"Müşteri Tipi"} {$info_icon_musteri_tipi}</label>
                    <div class="col-sm-9">
                        <select name="btk_abone_data[musteri_tipi]" id="btk_abone_data_musteri_tipi_serv_{$serviceId}" class="form-control">
                            <option value="">{$_LANG.pleaseselectone}</option>
                            {foreach from=$musteriTipleri item=tip}
                                <option value="{$tip->musteri_tipi_kodu}" {if $btkAboneData.musteri_tipi == $tip->musteri_tipi_kodu}selected{/if}>{$tip->aciklama}</option>
                            {/foreach}
                        </select>
                    </div>
                </div>
                <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_abone_adi_serv_{$serviceId}">{$_LANG.clientareafirstname|default:"Adı"}</label>
                    <div class="col-sm-9"><input type="text" name="btk_abone_data[abone_adi]" id="btk_abone_data_abone_adi_serv_{$serviceId}" value="{$btkAboneData.abone_adi|escape:'html'}" class="form-control"></div>
                </div>
                <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_abone_soyadi_serv_{$serviceId}">{$_LANG.clientarealastname|default:"Soyadı"}</label>
                    <div class="col-sm-9"><input type="text" name="btk_abone_data[abone_soyadi]" id="btk_abone_data_abone_soyadi_serv_{$serviceId}" value="{$btkAboneData.abone_soyadi|escape:'html'}" class="form-control"></div>
                </div>
                <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_abone_unvan_serv_{$serviceId}">{$_LANG.btk_abone_unvan|default:"Ticari Unvan (Kurumsal ise)"}</label>
                    <div class="col-sm-9"><input type="text" name="btk_abone_data[abone_unvan]" id="btk_abone_data_abone_unvan_serv_{$serviceId}" value="{$btkAboneData.abone_unvan|escape:'html'}" class="form-control"></div>
                </div>
                 <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_abone_tc_kimlik_no_serv_{$serviceId}">{$_LANG.btk_abone_tc_kimlik_no|default:"T.C. Kimlik No"} {$info_icon_tckn}</label>
                    <div class="col-sm-6">
                        <div class="input-group">
                            <input type="text" name="btk_abone_data[abone_tc_kimlik_no]" id="btk_abone_data_abone_tc_kimlik_no_serv_{$serviceId}" value="{$btkAboneData.abone_tc_kimlik_no}" class="form-control" maxlength="11" pattern="\d{11}">
                            <span class="input-group-btn">
                                <button type="button" class="btn btn-default btk-nvi-verify-btn-service" data-type="tckn" data-targetfieldid="btk_abone_data_abone_tc_kimlik_no_serv_{$serviceId}" data-namefieldid="btk_abone_data_abone_adi_serv_{$serviceId}" data-surnamefieldid="btk_abone_data_abone_soyadi_serv_{$serviceId}" data-birthyearfieldid="btk_abone_data_abone_dogum_tarihi_yil_service_{$serviceId}_kimlik" data-statusdivid="tckn_nvi_status_serv_{$serviceId}">{$_LANG.btk_nvi_dogrula|default:"NVI Doğrula"}</button>
                            </span>
                        </div>
                        <input type="hidden" name="btk_abone_data[nvi_tckn_dogrulandi]" id="nvi_tckn_dogrulandi_serv_hidden_{$serviceId}" value="{$btkAboneData.nvi_tckn_dogrulandi|default:0}">
                        <input type="hidden" name="btk_abone_data[nvi_tckn_son_dogrulama]" id="nvi_tckn_son_dogrulama_serv_hidden_{$serviceId}" value="{$btkAboneData.nvi_tckn_son_dogrulama}">
                        <div id="tckn_nvi_status_serv_{$serviceId}" style="margin-top:5px;">
                            {if $btkAboneData.abone_tc_kimlik_no && $btkAboneData.nvi_tckn_dogrulandi == 1}
                                <span class="label label-success btk-nvi-status-label-serv"><i class="fas fa-check-circle"></i> NVI Doğrulandı ({$btkAboneData.nvi_tckn_son_dogrulama|btk_datetime_format})</span>
                            {elseif $btkAboneData.abone_tc_kimlik_no && $btkAboneData.nvi_tckn_dogrulandi == 0 && $btkAboneData.nvi_tckn_son_dogrulama}
                                <span class="label label-danger btk-nvi-status-label-serv"><i class="fas fa-times-circle"></i> NVI Başarısız ({$btkAboneData.nvi_tckn_son_dogrulama|btk_datetime_format})</span>
                            {elseif $btkAboneData.abone_tc_kimlik_no}
                                <span class="label label-warning btk-nvi-status-label-serv"><i class="fas fa-exclamation-triangle"></i> NVI Bekleniyor</span>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_abone_dogum_tarihi_display_{$serviceId}_kimlik">{$_LANG.btk_abone_dogum_tarihi_display|default:"Doğum Tarihi (TCKN/YKN için)"}</label>
                    <div class="col-sm-4">
                        <input type="text" name="btk_abone_data[abone_dogum_tarihi_display]" id="btk_abone_data_abone_dogum_tarihi_display_{$serviceId}_kimlik" value="{$formatted_abone_dogum_tarihi}" class="form-control date-picker" placeholder="GG.AA.YYYY">
                        <input type="hidden" name="btk_abone_data[abone_dogum_tarihi]" id="btk_abone_data_abone_dogum_tarihi_btk_service_{$serviceId}" value="{$btkAboneData.abone_dogum_tarihi}">
                        <input type="hidden" id="btk_abone_data_abone_dogum_tarihi_yil_service_{$serviceId}_kimlik" value="{$clientBirthYearForNviService}">
                    </div>
                </div>
                 <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_abone_pasaport_no_serv_{$serviceId}">{$_LANG.btk_abone_pasaport_no|default:"Yabancı Kimlik No / Pasaport No"} {$info_icon_pasaport}</label>
                    <div class="col-sm-6">
                        <div class="input-group">
                            <input type="text" name="btk_abone_data[abone_pasaport_no]" id="btk_abone_data_abone_pasaport_no_serv_{$serviceId}" value="{$btkAboneData.abone_pasaport_no}" class="form-control">
                            <span class="input-group-btn">
                                <button type="button" class="btn btn-default btk-nvi-verify-btn-service" data-type="ykn" data-targetfieldid="btk_abone_data_abone_pasaport_no_serv_{$serviceId}" data-namefieldid="btk_abone_data_abone_adi_serv_{$serviceId}" data-surnamefieldid="btk_abone_data_abone_soyadi_serv_{$serviceId}" data-birthdatefieldid="btk_abone_data_abone_dogum_tarihi_btk_service_{$serviceId}" data-statusdivid="ykn_nvi_status_serv_{$serviceId}">{$_LANG.btk_nvi_dogrula|default:"NVI Doğrula"} (YKN)</button>
                            </span>
                        </div>
                         <input type="hidden" name="btk_abone_data[nvi_ykn_dogrulandi]" id="nvi_ykn_dogrulandi_serv_hidden_{$serviceId}" value="{$btkAboneData.nvi_ykn_dogrulandi|default:0}">
                        <input type="hidden" name="btk_abone_data[nvi_ykn_son_dogrulama]" id="nvi_ykn_son_dogrulama_serv_hidden_{$serviceId}" value="{$btkAboneData.nvi_ykn_son_dogrulama}">
                        <div id="ykn_nvi_status_serv_{$serviceId}" style="margin-top:5px;">
                            {if $btkAboneData.abone_pasaport_no && $btkAboneData.nvi_ykn_dogrulandi == 1}
                                <span class="label label-success btk-nvi-status-label-serv"><i class="fas fa-check-circle"></i> NVI Doğrulandı ({$btkAboneData.nvi_ykn_son_dogrulama|btk_datetime_format})</span>
                            {elseif $btkAboneData.abone_pasaport_no && $btkAboneData.nvi_ykn_dogrulandi == 0 && $btkAboneData.nvi_ykn_son_dogrulama}
                                <span class="label label-danger btk-nvi-status-label-serv"><i class="fas fa-times-circle"></i> NVI Başarısız ({$btkAboneData.nvi_ykn_son_dogrulama|btk_datetime_format})</span>
                            {elseif $btkAboneData.abone_pasaport_no}
                                <span class="label label-warning btk-nvi-status-label-serv"><i class="fas fa-exclamation-triangle"></i> NVI Bekleniyor</span>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_abone_uyruk_serv_{$serviceId}">{$_LANG.btk_abone_uyruk|default:"Uyruk"} {$info_icon_uyruk}</label>
                    <div class="col-sm-4">
                        <input type="text" name="btk_abone_data[abone_uyruk]" id="btk_abone_data_abone_uyruk_serv_{$serviceId}" value="{$btkAboneData.abone_uyruk}" class="form-control" placeholder="TUR" maxlength="3">
                    </div>
                </div>
                <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_abone_kimlik_tipi_serv_{$serviceId}">{$_LANG.btk_kimlik_tipi|default:"Kimlik Tipi (EK-4)"}</label>
                    <div class="col-sm-9">
                        <select name="btk_abone_data[abone_kimlik_tipi]" id="btk_abone_data_abone_kimlik_tipi_serv_{$serviceId}" class="form-control">
                            <option value="">{$_LANG.pleaseselectone}</option>
                            {foreach from=$kimlikTipleri item=tip}
                                <option value="{$tip->belge_tip_kodu}" {if $btkAboneData.abone_kimlik_tipi == $tip->belge_tip_kodu}selected{/if}>{$tip->belge_adi} ({$tip->belge_tip_kodu})</option>
                            {/foreach}
                        </select>
                    </div>
                </div>
                 <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_abone_kimlik_seri_no_serv_{$serviceId}">{$_LANG.btk_kimlik_seri_no|default:"Kimlik Seri No"}</label>
                    <div class="col-sm-9">
                        <input type="text" name="btk_abone_data[abone_kimlik_seri_no]" id="btk_abone_data_abone_kimlik_seri_no_serv_{$serviceId}" value="{$btkAboneData.abone_kimlik_seri_no}" class="form-control">
                    </div>
                </div>
                {* Diğer isteğe bağlı kimlik alanları: baba_adi, ana_adi, anne_kizlik_soyadi, dogum_yeri, meslek, kimlik_cilt_no vb. *}
            </div>

            {* Tesis Adresi Sekmesi *}
            <div role="tabpanel" class="tab-pane btk-form-section" id="tesisAdresi_{$serviceId}">
                <h5><i class="fas fa-building"></i> {$_LANG.btk_tesis_adresi_title|default:"Hizmet Tesis Adresi (Kurulum Adresi)"}</h5>
                 <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <label for="btk_abone_data_yerlesim_adresi_ayni_{$serviceId}" class="checkbox-inline">
                            <input type="checkbox" name="btk_abone_data[yerlesim_adresi_ayni]" id="btk_abone_data_yerlesim_adresi_ayni_{$serviceId}" value="1" {if $btkAboneData.yerlesim_adresi_ayni == 1}checked{/if}>
                            {$_LANG.btk_yerlesim_adresi_ayni_label|default:"Tesis Adresi, Müşteri Yerleşim Adresi ile aynı."}
                        </label>
                    </div>
                </div>
                <div id="tesisAdresiFields_{$serviceId}">
                    <div class="row form-group">
                        <label class="col-sm-3 control-label" for="btk_abone_data_abone_adres_tesis_il_{$serviceId}">{$_LANG.btk_il|default:"İl"}</label>
                        <div class="col-sm-5">
                            <select name="btk_abone_data[abone_adres_tesis_il]" id="btk_abone_data_abone_adres_tesis_il_{$serviceId}" class="form-control select-il-service" data-target-ilce="btk_abone_data_abone_adres_tesis_ilce_{$serviceId}">
                                <option value="">{$_LANG.pleaseselectone}</option>
                                {foreach from=$iller item=il}
                                    <option value="{$il->il_adi}" {if $btkAboneData.abone_adres_tesis_il == $il->il_adi}selected{/if}>{$il->il_adi}</option>
                                {/foreach}
                            </select>
                        </div>
                    </div>
                    <div class="row form-group">
                        <label class="col-sm-3 control-label" for="btk_abone_data_abone_adres_tesis_ilce_{$serviceId}">{$_LANG.btk_ilce|default:"İlçe"}</label>
                        <div class="col-sm-5">
                            <select name="btk_abone_data[abone_adres_tesis_ilce]" id="btk_abone_data_abone_adres_tesis_ilce_{$serviceId}" class="form-control select-ilce-service" data-selected-ilce="{$btkAboneData.abone_adres_tesis_ilce}">
                                <option value="">{if !$btkAboneData.abone_adres_tesis_il}{$_LANG.pleaseselectilfirst}{else}{$_LANG.pleaseselectone}{/if}</option>
                            </select>
                        </div>
                    </div>
                    {* Diğer tesis adresi alanları: mahalle, cadde, kapı no vb. *}
                    <div class="row form-group">
                        <label class="col-sm-3 control-label" for="btk_abone_data_abone_adres_tesis_mahalle_{$serviceId}">{$_LANG.btk_mahalle_koy|default:"Mahalle/Köy"}</label>
                        <div class="col-sm-9"><input type="text" name="btk_abone_data[abone_adres_tesis_mahalle]" id="btk_abone_data_abone_adres_tesis_mahalle_{$serviceId}" value="{$btkAboneData.abone_adres_tesis_mahalle}" class="form-control"></div>
                    </div>
                    <div class="row form-group">
                        <label class="col-sm-3 control-label" for="btk_abone_data_abone_adres_tesis_cadde_{$serviceId}">{$_LANG.btk_cadde_sokak|default:"Cadde/Sokak"}</label>
                        <div class="col-sm-9"><input type="text" name="btk_abone_data[abone_adres_tesis_cadde]" id="btk_abone_data_abone_adres_tesis_cadde_{$serviceId}" value="{$btkAboneData.abone_adres_tesis_cadde}" class="form-control"></div>
                    </div>
                    <div class="row">
                        <div class="col-md-3"><div class="form-group"><label for="btk_abone_data_abone_adres_tesis_dis_kapi_no_{$serviceId}">{$_LANG.btk_dis_kapi_no|default:"Dış Kapı No"}</label><input type="text" name="btk_abone_data[abone_adres_tesis_dis_kapi_no]" id="btk_abone_data_abone_adres_tesis_dis_kapi_no_{$serviceId}" value="{$btkAboneData.abone_adres_tesis_dis_kapi_no}" class="form-control input-sm"></div></div>
                        <div class="col-md-3"><div class="form-group"><label for="btk_abone_data_abone_adres_tesis_ic_kapi_no_{$serviceId}">{$_LANG.btk_ic_kapi_no|default:"İç Kapı No"}</label><input type="text" name="btk_abone_data[abone_adres_tesis_ic_kapi_no]" id="btk_abone_data_abone_adres_tesis_ic_kapi_no_{$serviceId}" value="{$btkAboneData.abone_adres_tesis_ic_kapi_no}" class="form-control input-sm"></div></div>
                        <div class="col-md-3"><div class="form-group"><label for="btk_abone_data_abone_adres_tesis_posta_kodu_{$serviceId}">{$_LANG.btk_posta_kodu|default:"Posta Kodu"}</label><input type="text" name="btk_abone_data[abone_adres_tesis_posta_kodu]" id="btk_abone_data_abone_adres_tesis_posta_kodu_{$serviceId}" value="{$btkAboneData.abone_adres_tesis_posta_kodu}" class="form-control input-sm"></div></div>
                        <div class="col-md-3"><div class="form-group"><label for="btk_abone_data_abone_adres_tesis_adres_kodu_{$serviceId}">{$_LANG.btk_uavt_adres_kodu|default:"UAVT Adres Kodu"}</label><input type="text" name="btk_abone_data[abone_adres_tesis_adres_kodu]" id="btk_abone_data_abone_adres_tesis_adres_kodu_{$serviceId}" value="{$btkAboneData.abone_adres_tesis_adres_kodu}" class="form-control input-sm"></div></div>
                    </div>
                </div>
            </div>

            {* Yetki Türüne Özel Alanlar Sekmesi *}
            <div role="tabpanel" class="tab-pane btk-form-section" id="yetkiOzel_{$serviceId}">
                <h5><i class="fas fa-cogs"></i> {$_LANG.btk_yetki_ozel_alanlar|default:"Yetki Türüne Özel Alanlar"} (<span id="selectedYetkiTipiLabelService_{$serviceId}">{$btkAboneData.btk_rapor_yetki_tipi_kodu|default:"Seçilmedi"}</span>)</h5>
                <p><small class="text-muted">{$_LANG.btk_yetki_ozel_alanlar_desc|default:"Temel Hizmet sekmesinde \"Raporlanacak BTK Yetki Tipi\" seçiminize göre bu alanda ilgili ek form alanları görünecektir."}</small></p>
                <div id="yetkiOzelAlanlarContainerService_{$serviceId}">
                    {* ISS Alanları *}
                    <div class="yetki-fields-grup yetki-ISS" {if $btkAboneData.btk_rapor_yetki_tipi_kodu != 'ISS'}style="display:none;"{/if}>
                        <h6>ISS (İnternet Servis Sağlayıcı) Özel Alanları</h6>
                        <div class="form-group"><label for="btk_abone_data_iss_hiz_profili_{$serviceId}">ISS Hız Profili</label><input type="text" class="form-control" name="btk_abone_data[iss_hiz_profili]" id="btk_abone_data_iss_hiz_profili_{$serviceId}" value="{$btkAboneData.iss_hiz_profili}"></div>
                        <div class="form-group"><label for="btk_abone_data_iss_kullanici_adi_{$serviceId}">ISS Kullanıcı Adı</label><input type="text" class="form-control" name="btk_abone_data[iss_kullanici_adi]" id="btk_abone_data_iss_kullanici_adi_{$serviceId}" value="{$btkAboneData.iss_kullanici_adi}"></div>
                        <div class="form-group"><label for="btk_abone_data_iss_pop_bilgisi_{$serviceId}">ISS POP Bilgisi</label><input type="text" class="form-control" name="btk_abone_data[iss_pop_bilgisi]" id="btk_abone_data_iss_pop_bilgisi_{$serviceId}" value="{$btkAboneData.iss_pop_bilgisi}"></div>
                    </div>

                    {* AIH Alanları *}
                     <div class="yetki-fields-grup yetki-AIH" {if $btkAboneData.btk_rapor_yetki_tipi_kodu != 'AIH'}style="display:none;"{/if}>
                        <h6>AIH (Altyapı İşletmeciliği Hizmeti) Özel Alanları</h6>
                        {* ... AIH alanları ... *}
                    </div>

                    {* GSM/MOBIL Alanları *}
                    <div class="yetki-fields-grup yetki-GSM yetki-MOBIL" {if !in_array($btkAboneData.btk_rapor_yetki_tipi_kodu, ['GSM', 'MOBIL'])}style="display:none;"{/if}>
                        <h6>GSM/Mobil Özel Alanları</h6>
                        {* ... GSM/Mobil alanları ... *}
                    </div>

                    {* STH/TT Alanları *}
                    <div class="yetki-fields-grup yetki-STH yetki-TT" {if !in_array($btkAboneData.btk_rapor_yetki_tipi_kodu, ['STH', 'TT'])}style="display:none;"{/if}>
                        <h6>STH/TT (Sabit Telefon) Özel Alanları</h6>
                        {* ... STH/TT alanları ... *}
                    </div>

                    {* UYDU/UHH/GMPCS Alanları *}
                    <div class="yetki-fields-grup yetki-UYDU yetki-UHH yetki-GMPCS" {if !in_array($btkAboneData.btk_rapor_yetki_tipi_kodu, ['UYDU', 'UHH', 'GMPCS'])}style="display:none;"{/if}>
                        <h6>UYDU/UHH/GMPCS Özel Alanları</h6>
                        {* ... UYDU/UHH/GMPCS alanları ... *}
                    </div>
                    
                    <p id="noSpecificFieldsMsg_{$serviceId}" style="display:none;">
                        {$_LANG.btk_no_specific_fields_for_yetki|default:"Bu yetki tipi için özel alanlar henüz tanımlanmamış veya gösterim için ayarlanmamış."}
                    </p>
                </div>
            </div>

            {* Operasyonel Veriler Sekmesi *}
            <div role="tabpanel" class="tab-pane btk-form-section" id="operasyonel_{$serviceId}">
                <h5><i class="fas<seg_49>tools"></i> {$_LANG.btk_operasyonel_veriler|default:"Operasyonel Veriler"}</h5>
                <div class="row form-group">
                    <label class="col-sm-3 control-label" for="op_tesis_adres_koordinat_enlem_{$serviceId}">{$_LANG.btk_tesis_koordinat_enlem|default:"Tesis Adresi Enlem"}</label>
                    <div class="col-sm-9"><input type="text" name="op_tesis_adres_koordinat_enlem" id="op_tesis_adres_koordinat_enlem_{$serviceId}" value="{$btkOperasyonelData.tesis_adres_koordinat_enlem}" class="form-control" placeholder="Örn: 40.7128"></div>
                </div>
                <div class="row form-group">
                    <label class="col-sm-3 control-label" for="op_tesis_adres_koordinat_boylam_{$serviceId}">{$_LANG.btk_tesis_koordinat_boylam|default:"Tesis Adresi Boylam"}</label>
                    <div class="col-sm-9"><input type="text" name="op_tesis_adres_koordinat_boylam" id="op_tesis_adres_koordinat_boylam_{$serviceId}" value="{$btkOperasyonelData.tesis_adres_koordinat_boylam}" class="form-control" placeholder="Örn: -74.0060"></div>
                </div>
                {* ... Diğer operasyonel alanlar ... *}
            </div>
            
            {* Bayi Bilgileri Sekmesi *}
            <div role="tabpanel" class="tab-pane btk-form-section" id="bayiBilgileri_{$serviceId}">
                <h5><i class="fas fa-store"></i> {$_LANG.btk_bayi_bilgileri|default:"Bayi Bilgileri"}</h5>
                 <div class="row form-group">
                    <label class="col-sm-3 control-label" for="btk_abone_data_aktivasyon_bayi_adi_{$serviceId}">{$_LANG.btk_aktivasyon_bayi_adi|default:"Aktivasyon Bayi Adı"}</label>
                    <div class="col-sm-9"><input type="text" name="btk_abone_data[aktivasyon_bayi_adi]" id="btk_abone_data_aktivasyon_bayi_adi_{$serviceId}" value="{$btkAboneData.aktivasyon_bayi_adi}" class="form-control"></div>
                </div>
                {* ... Diğer bayi alanları ... *}
            </div>

        </div>
        <hr>
        <div class="text-center" style="margin-top: 20px;">
            <button type="submit" class="btn btn-success btn-lg"><i class="fas fa-save"></i> {$_LANG.btk_save_service_btk_data|default:"BTK ve Operasyonel Bilgileri Kaydet"}</button>
            <a href="clientsservices.php?id={$serviceId}" class="btn btn-default btn-lg" style="margin-left: 10px;">{$_LANG.btk_cancel|default:"İptal"}</a>
        </div>
    </form>
</div>

<script type="text/javascript">
$(document).ready(function() {
    var serviceId = parseInt('{$serviceId}'); 
    var moduleLink = '{$modulelink}';
    var csrfToken = '{$csrfToken}';
    var langPleaseSelectOne = '{$_LANG.pleaseselectone|default:"Lütfen Seçiniz..."|escape:"javascript"}';
    var langLoading = '{$_LANG.loading|default:"Yükleniyor..."|escape:"javascript"}';
    var langNoResults = '{$_LANG.noresultsfound|default:"Sonuç bulunamadı"|escape:"javascript"}';
    var langError = '{$_LANG.error|default:"Hata!"|escape:"javascript"}';
    var langPleaseSelectIlFirst = '{$_LANG.pleaseselectilfirst|default:"Önce İl Seçin"|escape:"javascript"}';

    // Aktif sekmeyi hatırla ve yükle
    $('#btkServiceTabs_{$serviceId} a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var targetTab = $(e.target).attr("href"); 
        $('#current_service_tab_input_{$serviceId}').val(targetTab.substring(1));
        localStorage.setItem('btk_last_service_tab_{$serviceId}', targetTab.substring(1));
    });
    var lastTab = localStorage.getItem('btk_last_service_tab_{$serviceId}');
    var currentUrlTab = window.location.hash;
    if (currentUrlTab && $('#btkServiceTabs_{$serviceId} a[href="' + currentUrlTab + '"]').length) {
        $('#btkServiceTabs_{$serviceId} a[href="' + currentUrlTab + '"]').tab('show');
        $('#current_service_tab_input_{$serviceId}').val(currentUrlTab.substring(1));
    } else if (lastTab && $('#btkServiceTabs_{$serviceId} a[href="#' + lastTab + '"]').length) {
        $('#btkServiceTabs_{$serviceId} a[href="#' + lastTab + '"]').tab('show');
        $('#current_service_tab_input_{$serviceId}').val(lastTab);
    } else {
        var defaultTab = $('#btkServiceTabs_{$serviceId} li.active a').attr('href');
        if(defaultTab){ $('#current_service_tab_input_{$serviceId}').val(defaultTab.substring(1)); }
    }

    // Tarih ve DateTime seçiciler
    if ($.fn.datepicker) {
        $('#btkServiceDetailForm_{$serviceId} .date-picker').datepicker({ 
            dateFormat: 'dd.mm.yy', changeMonth: true, changeYear: true, yearRange: "-100:+5"
        });
        // Eğer datetimepicker kütüphanesi varsa (örn: jquery-ui-timepicker-addon.js)
        if($.fn.datetimepicker){
             $('#btkServiceDetailForm_{$serviceId} .datetime-picker-btk-service').datetimepicker({
                dateFormat: 'dd.mm.yy', timeFormat: 'HH:mm:ss',
                changeMonth: true, changeYear: true, yearRange: "-100:+5",
                controlType: 'select', oneLine: true
            });
        } else { // Sadece datepicker varsa, saat manuel girilir
             $('#btkServiceDetailForm_{$serviceId} .datetime-picker-btk-service').datepicker({ 
                dateFormat: 'dd.mm.yy', changeMonth: true, changeYear: true, yearRange: "-100:+5"
            });
        }
    }
    
    // Tarih/Datetime Display -> Hidden Input (YYYYMMDD veya YYYYMMDDHHMMSS)
    $('#btk_abone_data_abone_dogum_tarihi_display_{$serviceId}_kimlik').on('change input', function() {
        var displayDate = $(this).val();
        var dbDate = btkFormatDateToDb(displayDate); 
        $('#btk_abone_data_abone_dogum_tarihi_btk_service_{$serviceId}').val(dbDate);
        if (dbDate && dbDate.length === 8) {
            $('#btk_abone_data_abone_dogum_tarihi_yil_service_{$serviceId}_kimlik').val(dbDate.substring(0,4));
        } else {
            $('#btk_abone_data_abone_dogum_tarihi_yil_service_{$serviceId}_kimlik').val('');
        }
    }).trigger('change');

    $('input[name="btk_abone_data[abone_baslangic_display]"]').on('change input', function(){
        var displayDateTime = $(this).val(); // GG.AA.YYYY SS:DD:SS
        var btkDateTime = btkFormatFullDateTimeToBTK(displayDateTime);
        $('#abone_baslangic_btk_service_{$serviceId}').val(btkDateTime);
    });
     $('input[name="btk_abone_data[abone_bitis_display]"]').on('change input', function(){
        var displayDateTime = $(this).val();
        var btkDateTime = btkFormatFullDateTimeToBTK(displayDateTime);
        $('#abone_bitis_btk_service_{$serviceId}').val(btkDateTime);
    });


    // İlçe yükleme
    var initialIlTesis = $('#btk_abone_data_abone_adres_tesis_il_{$serviceId}').val();
    var initialIlceTesis = $('#btk_abone_data_abone_adres_tesis_ilce_{$serviceId}').data('selected-ilce');
    if(initialIlTesis){
        btkLoadIlceler(initialIlTesis, $('#btk_abone_data_abone_adres_tesis_ilce_{$serviceId}'), initialIlceTesis, moduleLink, csrfToken, {
            pleaseselectone: langPleaseSelectOne, loading: langLoading, noresultsfound: langNoResults, error: langError, pleaseselectilfirst: langPleaseSelectIlFirst
        });
    }
    $('#btk_abone_data_abone_adres_tesis_il_{$serviceId}.select-il-service').on('change', function() {
        btkLoadIlceler($(this).val(), $('#' + $(this).data('target-ilce')), null, moduleLink, csrfToken, {
             pleaseselectone: langPleaseSelectOne, loading: langLoading, noresultsfound: langNoResults, error: langError, pleaseselectilfirst: langPleaseSelectIlFirst
        });
    });

    // Yerleşke adresi aynı checkbox'ı
    $('#btk_abone_data_yerlesim_adresi_ayni_{$serviceId}').on('change', function() {
        var isChecked = this.checked;
        var fieldsDiv = $('#tesisAdresiFields_{$serviceId}');
        var fieldInputs = fieldsDiv.find('input[type="text"], input[type="number"], select, textarea');
        
        if (isChecked) {
            fieldInputs.prop('disabled', true).addClass('btk-disabled-field');
            fieldsDiv.slideUp();
            var clientIdForYerlesim = {$clientId};
            $.ajax({
                url: moduleLink + '&action=get_client_yerlesim_adresi', 
                type: 'POST', dataType: 'json',
                data: { client_id: clientIdForYerlesim, token: csrfToken },
                success: function(data) {
                    if(data && data.status === 'success' && data.adres) {
                        $('#btk_abone_data_abone_adres_tesis_il_{$serviceId}').val(data.adres.abone_adres_yerlesim_il).trigger('change'); // trigger change ilçeleri yüklesin
                        setTimeout(function(){ // İlçe yüklemesi için küçük bir bekleme
                             $('#btk_abone_data_abone_adres_tesis_ilce_{$serviceId}').val(data.adres.abone_adres_yerlesim_ilce);
                        }, 800); 
                        $('#btk_abone_data_abone_adres_tesis_mahalle_{$serviceId}').val(data.adres.abone_adres_yerlesim_mahalle);
                        $('#btk_abone_data_abone_adres_tesis_cadde_{$serviceId}').val(data.adres.abone_adres_yerlesim_cadde);
                        $('#btk_abone_data_abone_adres_tesis_dis_kapi_no_{$serviceId}').val(data.adres.abone_adres_yerlesim_dis_kapi_no);
                        $('#btk_abone_data_abone_adres_tesis_ic_kapi_no_{$serviceId}').val(data.adres.abone_adres_yerlesim_ic_kapi_no);
                        $('#btk_abone_data_abone_adres_tesis_posta_kodu_{$serviceId}').val(data.adres.abone_adres_yerlesim_posta_kodu);
                        $('#btk_abone_data_abone_adres_tesis_adres_kodu_{$serviceId}').val(data.adres.abone_adres_yerlesim_no);
                    } else {
                         console.warn("Müşteri yerleşim adresi alınamadı: ", data.message);
                    }
                },
                error: function(){ console.error("Müşteri yerleşim adresi alınırken sunucu hatası.");}
            });
        } else {
            fieldInputs.prop('disabled', false).removeClass('btk-disabled-field');
            fieldsDiv.slideDown();
        }
    }).trigger('change'); 


    // Yetki türüne özel alanları göster/gizle
    $('#btk_abone_data_btk_rapor_yetki_tipi_kodu_{$serviceId}').on('change', function(){
        var selectedYetkiTipi = $(this).val();
        $('#selectedYetkiTipiLabelService_{$serviceId}').text(selectedYetkiTipi || "Seçilmedi");
        var container = $('#yetkiOzelAlanlarContainerService_{$serviceId}');
        container.find('.yetki-fields-grup').hide(); 
        var noSpecificFieldsMsg = $('#noSpecificFieldsMsg_{$serviceId}');

        if(selectedYetkiTipi){
            var targetGroup = container.find('.yetki-' + selectedYetkiTipi.toUpperCase());
            if (targetGroup.length > 0) {
                targetGroup.show();
                noSpecificFieldsMsg.hide();
            } else {
                noSpecificFieldsMsg.html('Bu yetki tipi ('+selectedYetkiTipi+') için özel alanlar henüz tanımlanmamış veya gösterim için ayarlanmamış.').show();
            }
        } else {
             noSpecificFieldsMsg.hide();
        }
    }).trigger('change'); 

    // NVI Doğrulama Butonu
    $('.btk-nvi-verify-btn-service').on('click', function() {
        var btn = $(this);
        var originalBtnText = btn.html();
        btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
        
        var type = btn.data('type');
        var idNo = $('#' + btn.data('targetfieldid')).val();
        var name = $('#' + btn.data('namefieldid')).val(); 
        var surname = $('#' + btn.data('surnamefieldid')).val(); 
        var dogumInputForNvi = '';

        if(type === 'tckn'){
            dogumInputForNvi = $('#' + btn.data('birthyearfieldid')).val(); // Sadece yıl
            if (!dogumInputForNvi || !/^\d{4}$/.test(dogumInputForNvi)) {
                 var errorMsg = 'Lütfen TCKN doğrulaması için geçerli bir Doğum Yılı (YYYY) girin.';
                 $('#' + btn.data('statusdivid')).html('<span class="label label-danger btk-nvi-status-label-serv">' + errorMsg + '</span>');
                 $('#btkServiceFormNviResultHook_{$serviceId}').removeClass('alert-success alert-info').addClass('alert-danger').html(errorMsg).show().delay(7000).fadeOut();
                 btn.prop('disabled', false).html(originalBtnText);
                 return;
            }
        } else if (type === 'ykn') {
            dogumInputForNvi = $('#' + btn.data('birthdatefieldid')).val(); // YYYYMMDD
             if (!dogumInputForNvi || !/^\d{8}$/.test(dogumInputForNvi)) {
                 var errorMsg = 'Lütfen YKN doğrulaması için geçerli bir Doğum Tarihi (GG.AA.YYYY formatında girilmiş ve YYYYMMDD olarak alınmış) girin.';
                 $('#' + btn.data('statusdivid')).html('<span class="label label-danger btk-nvi-status-label-serv">' + errorMsg + '</span>');
                 $('#btkServiceFormNviResultHook_{$serviceId}').removeClass('alert-success alert-info').addClass('alert-danger').html(errorMsg).show().delay(7000).fadeOut();
                 btn.prop('disabled', false).html(originalBtnText);
                 return;
            }
        }
        
        var params = {
            type: type, id_no: idNo, ad: name, soyad: surname, 
            dogum_input: dogumInputForNvi, token: csrfToken,
            client_id: clientId, service_id: serviceId
        };
        
        var resultDiv = $('#' + btn.data('statusdivid'));
        var nviResultContainer = $('#btkServiceFormNviResultHook_{$serviceId}');
        var hiddenStatusField = (type === 'tckn' ? $('#nvi_tckn_dogrulandi_serv_hidden_{$serviceId}') : $('#nvi_ykn_dogrulandi_serv_hidden_{$serviceId}'));
        var hiddenTimestampField = (type === 'tckn' ? $('#nvi_tckn_son_dogrulama_serv_hidden_{$serviceId}') : $('#nvi_ykn_son_dogrulama_serv_hidden_{$serviceId}'));

        btkPerformNviAjaxVerification(params, moduleLink, resultDiv, hiddenStatusField, hiddenTimestampField, nviResultContainer, function(data) {
            btn.prop('disabled', false).html(originalBtnText);
        });
    });

    // Tarih formatlama fonksiyonları (eğer global btk_admin_scripts.js içinde değilse)
    if (typeof btkFormatDateToDb !== 'function') {
        function btkFormatDateToDb(displayDate) { 
            if (displayDate && typeof displayDate === 'string' && displayDate.length === 10 && displayDate.includes('.')) {
                var parts = displayDate.split('.');
                if (parts.length === 3 && parts[2].length === 4 && parts[1].length === 2 && parts[0].length === 2) {
                    return parts[2] + parts[1] + parts[0];
                }
            } return '';
        }
    }
    function btkFormatFullDateTimeToBTK(displayDateTime){ // GG.AA.YYYY SS:DD:SS -> YYYYMMDDHHMMSS
        if(displayDateTime && typeof displayDateTime === 'string' && displayDateTime.length >= 19){
            var parts = displayDateTime.split(' ');
            if(parts.length === 2){
                var datePart = btkFormatDateToDb(parts[0]);
                var timePart = parts[1].replace(/:/g, '');
                if(datePart && timePart.length === 6){
                    return datePart + timePart;
                } else if (datePart && timePart.length === 4){ // Sadece SS:DD girilmişse
                     return datePart + timePart + '00'; // Saniyeyi 00 ekle
                }
            }
        }
        return '';
    }
     // Global ilçe yükleme ve NVI AJAX fonksiyonları btk_admin_scripts.js içinde olmalı veya burada tanımlanmalı
});
</script>