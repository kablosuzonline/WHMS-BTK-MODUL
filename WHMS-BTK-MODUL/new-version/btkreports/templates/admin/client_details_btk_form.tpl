{* WHMCS BTK Raporlama Modülü - Müşteri Detayları BTK Veri Giriş Formu (client_details_btk_form.tpl) - V3.0.0 - Tam Sürüm *}
{* Bu TPL, AdminAreaClientProfileTabFields hook'u ile müşteri profili düzenleme formuna enjekte edilir. *}
{* Bu TPL kendi başına bir form göndermez, WHMCS'in ana "Değişiklikleri Kaydet" butonu ile veriler gönderilir. *}
{* Alan adları btk_client_data[alan_adi] şeklinde olmalıdır. *}

{* Stil tanımlamaları btk_admin_style.css içinde veya ana TPL'de (eğer hook bir div içine render ediyorsa) yapılabilir. *}
{* Bu TPL'in doğrudan HTML döndürmesi ve bir dizi içinde olması beklenir. *}

<div class="btk-client-custom-fields-section" style="margin-top: 15px; padding-top:15px; border-top: 1px solid #eee;">
    <h4><i class="fas fa-address-card"></i> {$_LANG.btk_musteri_btk_bilgileri_title|default:"Müşteriye Ait BTK Bilgileri (Genel)"}</h4>
    <p><small class="text-muted">{$_LANG.btk_musteri_btk_bilgileri_desc|default:"Burada girilen bilgiler, müşterinin tüm hizmetleri için varsayılan BTK verileri olarak kullanılabilir ve hizmet bazında ayrıca düzenlenebilir. Özellikle \"Yerleşim Adresi\" ve \"Kimlik Bilgileri\" önemlidir."}</small></p>
    <hr style="margin-bottom: 15px;">

    {* AJAX NVI Sonuçları için genel mesaj alanı (JavaScript ile yönetilecek) *}
    <div id="btkClientFormNviResultHook" style="display:none; margin-bottom:15px;" class="alert"></div>

    {* Müşteri Tipi ve Temel Kimlik Bilgileri *}
    <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_musteri_tipi_hook">{$_LANG.btk_musteri_tipi|default:"Müşteri Tipi"} {$info_icon_musteri_tipi}</label>
        <div class="col-sm-9">
            <select name="btk_client_data[musteri_tipi]" id="btk_client_data_musteri_tipi_hook" class="form-control">
                <option value="">{$_LANG.pleaseselectone|default:"Lütfen Seçiniz..."}</option>
                {foreach from=$musteriTipleri item=tip}
                    <option value="{$tip->musteri_tipi_kodu}" {if $btkClientData.musteri_tipi == $tip->musteri_tipi_kodu}selected{/if}>{$tip->aciklama}</option>
                {/foreach}
            </select>
        </div>
    </div>

    <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_unvan_hook">{$_LANG.btk_abone_unvan|default:"Ticari Unvan (Kurumsal ise)"}</label>
        <div class="col-sm-9">
            <input type="text" name="btk_client_data[abone_unvan]" id="btk_client_data_abone_unvan_hook" value="{$btkClientData.abone_unvan|default:$clientcompanyname|escape:'html'}" class="form-control">
        </div>
    </div>
    
    <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_tc_kimlik_no_hook">{$_LANG.btk_abone_tc_kimlik_no|default:"T.C. Kimlik No"} {$info_icon_tckn}</label>
        <div class="col-sm-6">
            <div class="input-group">
                <input type="text" name="btk_client_data[abone_tc_kimlik_no]" id="btk_client_data_abone_tc_kimlik_no_hook" value="{$btkClientData.abone_tc_kimlik_no}" class="form-control" maxlength="11" pattern="\d{11}">
                <span class="input-group-btn">
                    <button type="button" class="btn btn-default btk-nvi-verify-btn-client" data-type="tckn" data-targetfieldid="btk_client_data_abone_tc_kimlik_no_hook" data-namefieldid="client_firstname_hook_val" data-surnamefieldid="client_lastname_hook_val" data-birthyearfieldid="abone_dogum_tarihi_yil_hook_val" data-statusdivid="tckn_nvi_status_hook">{$_LANG.btk_nvi_dogrula|default:"NVI Doğrula"}</button>
                </span>
            </div>
            {* WHMCS müşteri ad/soyadını JS'in okuyabilmesi için gizli alanlar (veya data attribute) *}
            <input type="hidden" id="client_firstname_hook_val" value="{$clientfirstname|escape:'html'}">
            <input type="hidden" id="client_lastname_hook_val" value="{$clientlastname|escape:'html'}">
            <input type="hidden" name="btk_client_data[nvi_tckn_dogrulandi]" id="nvi_tckn_dogrulandi_hook_hidden" value="{$btkClientData.nvi_tckn_dogrulandi|default:0}">
            <input type="hidden" name="btk_client_data[nvi_tckn_son_dogrulama]" id="nvi_tckn_son_dogrulama_hook_hidden" value="{$btkClientData.nvi_tckn_son_dogrulama}">
             <div id="tckn_nvi_status_hook" style="margin-top:5px;">
                {if $btkClientData.abone_tc_kimlik_no && $btkClientData.nvi_tckn_dogrulandi == 1}
                    <span class="label label-success btk-nvi-status-label"><i class="fas fa-check-circle"></i> NVI Doğrulandı ({$btkClientData.nvi_tckn_son_dogrulama|btk_datetime_format})</span>
                {elseif $btkClientData.abone_tc_kimlik_no && $btkClientData.nvi_tckn_dogrulandi == 0 && $btkClientData.nvi_tckn_son_dogrulama}
                    <span class="label label-danger btk-nvi-status-label"><i class="fas fa-times-circle"></i> NVI Başarısız ({$btkClientData.nvi_tckn_son_dogrulama|btk_datetime_format})</span>
                {elseif $btkClientData.abone_tc_kimlik_no}
                     <span class="label label-warning btk-nvi-status-label"><i class="fas fa-exclamation-triangle"></i> NVI Bekleniyor</span>
                {/if}
            </div>
        </div>
    </div>

    <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_dogum_tarihi_display_hook">{$_LANG.btk_abone_dogum_tarihi_display|default:"Doğum Tarihi (TCKN/YKN için)"}</label>
        <div class="col-sm-4">
            <input type="text" name="btk_client_data[abone_dogum_tarihi_display]" id="btk_client_data_abone_dogum_tarihi_display_hook" value="{$formatted_dogum_tarihi}" class="form-control date-picker-btk-client" placeholder="GG.AA.YYYY">
            <input type="hidden" name="btk_client_data[abone_dogum_tarihi]" id="abone_dogum_tarihi_btk_client_hook" value="{$btkClientData.abone_dogum_tarihi}">
            <input type="hidden" id="abone_dogum_tarihi_yil_hook_val" value="{if $btkClientData.abone_dogum_tarihi}{$btkClientData.abone_dogum_tarihi|substr:0:4}{/if}">
        </div>
    </div>

    <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_pasaport_no_hook">{$_LANG.btk_abone_pasaport_no|default:"Yabancı Kimlik No / Pasaport No"} {$info_icon_pasaport}</label>
        <div class="col-sm-6">
             <div class="input-group">
                <input type="text" name="btk_client_data[abone_pasaport_no]" id="btk_client_data_abone_pasaport_no_hook" value="{$btkClientData.abone_pasaport_no}" class="form-control">
                 <span class="input-group-btn">
                    <button type="button" class="btn btn-default btk-nvi-verify-btn-client" data-type="ykn" data-targetfieldid="btk_client_data_abone_pasaport_no_hook" data-namefieldid="client_firstname_hook_val" data-surnamefieldid="client_lastname_hook_val" data-birthdatefieldid="abone_dogum_tarihi_btk_client_hook" data-statusdivid="ykn_nvi_status_hook">{$_LANG.btk_nvi_dogrula|default:"NVI Doğrula"} (YKN)</button>
                </span>
            </div>
            <input type="hidden" name="btk_client_data[nvi_ykn_dogrulandi]" id="nvi_ykn_dogrulandi_hook_hidden" value="{$btkClientData.nvi_ykn_dogrulandi|default:0}">
            <input type="hidden" name="btk_client_data[nvi_ykn_son_dogrulama]" id="nvi_ykn_son_dogrulama_hook_hidden" value="{$btkClientData.nvi_ykn_son_dogrulama}">
            <div id="ykn_nvi_status_hook" style="margin-top:5px;">
                 {if $btkClientData.abone_pasaport_no && $btkClientData.nvi_ykn_dogrulandi == 1}
                    <span class="label label-success btk-nvi-status-label"><i class="fas fa-check-circle"></i> NVI Doğrulandı ({$btkClientData.nvi_ykn_son_dogrulama|btk_datetime_format})</span>
                {elseif $btkClientData.abone_pasaport_no && $btkClientData.nvi_ykn_dogrulandi == 0 && $btkClientData.nvi_ykn_son_dogrulama}
                    <span class="label label-danger btk-nvi-status-label"><i class="fas fa-times-circle"></i> NVI Başarısız ({$btkClientData.nvi_ykn_son_dogrulama|btk_datetime_format})</span>
                {elseif $btkClientData.abone_pasaport_no}
                     <span class="label label-warning btk-nvi-status-label"><i class="fas fa-exclamation-triangle"></i> NVI Bekleniyor</span>
                {/if}
            </div>
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_uyruk_hook">{$_LANG.btk_abone_uyruk|default:"Uyruk"} {$info_icon_uyruk}</label>
        <div class="col-sm-4">
            <input type="text" name="btk_client_data[abone_uyruk]" id="btk_client_data_abone_uyruk_hook" value="{$btkClientData.abone_uyruk|default:$clientcountrycode_iso3|upper}" class="form-control" placeholder="TUR" maxlength="3">
        </div>
    </div>

    {* Diğer Kimlik Bilgileri (EK-4 Kimlik Tipi, Seri No vb.) *}
    <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_kimlik_tipi_hook">{$_LANG.btk_kimlik_tipi|default:"Kimlik Tipi (EK-4)"}</label>
        <div class="col-sm-9">
            <select name="btk_client_data[abone_kimlik_tipi]" id="btk_client_data_abone_kimlik_tipi_hook" class="form-control">
                <option value="">{$_LANG.pleaseselectone}</option>
                {foreach from=$kimlikTipleri item=tip}
                    <option value="{$tip->belge_tip_kodu}" {if $btkClientData.abone_kimlik_tipi == $tip->belge_tip_kodu}selected{/if}>{$tip->belge_adi} ({$tip->belge_tip_kodu})</option>
                {/foreach}
            </select>
        </div>
    </div>
     <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_kimlik_seri_no_hook">{$_LANG.btk_kimlik_seri_no|default:"Kimlik Seri No"}</label>
        <div class="col-sm-9">
            <input type="text" name="btk_client_data[abone_kimlik_seri_no]" id="btk_client_data_abone_kimlik_seri_no_hook" value="{$btkClientData.abone_kimlik_seri_no}" class="form-control">
        </div>
    </div>


    <h5 style="margin-top:20px;"><i class="fas fa-map-marker-alt"></i> {$_LANG.btk_yerlesim_adresi_title|default:"Müşteri Yerleşim Adresi (İkametgah/Fatura)"}</h5>
    <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_adres_yerlesim_il_hook">{$_LANG.btk_il|default:"İl"}</label>
        <div class="col-sm-4">
            <select name="btk_client_data[abone_adres_yerlesim_il]" id="btk_client_data_abone_adres_yerlesim_il_hook" class="form-control select-il-client-hook" data-target-ilce="btk_client_data_abone_adres_yerlesim_ilce_hook">
                <option value="">{$_LANG.pleaseselectone}</option>
                {foreach from=$iller item=il}
                    <option value="{$il->il_adi}" {if $btkClientData.abone_adres_yerlesim_il == $il->il_adi}selected{/if}>{$il->il_adi}</option>
                {/foreach}
            </select>
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_adres_yerlesim_ilce_hook">{$_LANG.btk_ilce|default:"İlçe"}</label>
        <div class="col-sm-4">
            <select name="btk_client_data[abone_adres_yerlesim_ilce]" id="btk_client_data_abone_adres_yerlesim_ilce_hook" class="form-control select-ilce-client-hook" data-selected-ilce="{$btkClientData.abone_adres_yerlesim_ilce}">
                <option value="">{if !$btkClientData.abone_adres_yerlesim_il}{$_LANG.pleaseselectilfirst|default:"Önce İl Seçin"}{else}{$_LANG.pleaseselectone}{/if}</option>
            </select>
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_adres_yerlesim_mahalle_hook">{$_LANG.btk_mahalle_koy|default:"Mahalle/Köy"}</label>
        <div class="col-sm-9">
            <input type="text" name="btk_client_data[abone_adres_yerlesim_mahalle]" id="btk_client_data_abone_adres_yerlesim_mahalle_hook" value="{$btkClientData.abone_adres_yerlesim_mahalle}" class="form-control">
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_adres_yerlesim_cadde_hook">{$_LANG.btk_cadde_sokak|default:"Cadde/Sokak/Bulvar/Meydan"}</label>
        <div class="col-sm-9">
            <input type="text" name="btk_client_data[abone_adres_yerlesim_cadde]" id="btk_client_data_abone_adres_yerlesim_cadde_hook" value="{$btkClientData.abone_adres_yerlesim_cadde|default:$clientaddress1}" class="form-control">
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            <div class="form-group">
                <label for="btk_client_data_abone_adres_yerlesim_dis_kapi_no_hook">{$_LANG.btk_dis_kapi_no|default:"Dış Kapı No"}</label>
                <input type="text" name="btk_client_data[abone_adres_yerlesim_dis_kapi_no]" id="btk_client_data_abone_adres_yerlesim_dis_kapi_no_hook" value="{$btkClientData.abone_adres_yerlesim_dis_kapi_no}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
             <div class="form-group">
                <label for="btk_client_data_abone_adres_yerlesim_ic_kapi_no_hook">{$_LANG.btk_ic_kapi_no|default:"İç Kapı No"}</label>
                <input type="text" name="btk_client_data[abone_adres_yerlesim_ic_kapi_no]" id="btk_client_data_abone_adres_yerlesim_ic_kapi_no_hook" value="{$btkClientData.abone_adres_yerlesim_ic_kapi_no}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
             <div class="form-group">
                <label for="btk_client_data_abone_adres_yerlesim_posta_kodu_hook">{$_LANG.btk_posta_kodu|default:"Posta Kodu"}</label>
                <input type="text" name="btk_client_data[abone_adres_yerlesim_posta_kodu]" id="btk_client_data_abone_adres_yerlesim_posta_kodu_hook" value="{$btkClientData.abone_adres_yerlesim_posta_kodu|default:$clientpostcode}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="btk_client_data_abone_adres_yerlesim_no_hook">{$_LANG.btk_uavt_yerlesim_yeri_no|default:"UAVT Yerleşim Yeri No"}</label>
                <input type="text" name="btk_client_data[abone_adres_yerlesim_no]" id="btk_client_data_abone_adres_yerlesim_no_hook" value="{$btkClientData.abone_adres_yerlesim_no}" class="form-control">
            </div>
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_adres_e_mail_hook">{$_LANG.clientareaemail|default:"E-posta Adresi"}</label>
        <div class="col-sm-9">
            <input type="email" name="btk_client_data[abone_adres_e_mail]" id="btk_client_data_abone_adres_e_mail_hook" value="{$btkClientData.abone_adres_e_mail|default:$clientemail}" class="form-control">
        </div>
    </div>
    
    {* Diğer İsteğe Bağlı Alanlar (Kimlik Cilt No, Baba Adı vb.) buraya eklenebilir *}
    {* Bu alanlar BTK dökümanındaki ortak alanlar listesine göre tamamlanmalıdır. *}
    <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_baba_adi_hook">{$_LANG.btk_baba_adi|default:"Baba Adı"}</label>
        <div class="col-sm-9">
            <input type="text" name="btk_client_data[abone_baba_adi]" id="btk_client_data_abone_baba_adi_hook" value="{$btkClientData.abone_baba_adi}" class="form-control">
        </div>
    </div>
     <div class="row form-group">
        <label class="col-sm-3 control-label" for="btk_client_data_abone_ana_adi_hook">{$_LANG.btk_ana_adi|default:"Anne Adı"}</label>
        <div class="col-sm-9">
            <input type="text" name="btk_client_data[abone_ana_adi]" id="btk_client_data_abone_ana_adi_hook" value="{$btkClientData.abone_ana_adi}" class="form-control">
        </div>
    </div>

</div>

<script type="text/javascript">
// Bu scriptler AdminClientProfileTabFieldsSave hook'u ile birlikte çalışır.
// Formun ID'si btkClientDetailFormHook (WHMCS ana formuna dahil edilecek)
$(document).ready(function() {
    var moduleLink = '{$modulelink}'; 
    var csrfToken = '{$csrfToken}';   
    var clientId = {$clientId};

    var langPleaseSelectOne = '{$_LANG.pleaseselectone|default:"Lütfen Seçiniz..."|escape:"javascript"}';
    var langLoading = '{$_LANG.loading|default:"Yükleniyor..."|escape:"javascript"}';
    var langNoResults = '{$_LANG.noresultsfound|default:"Sonuç bulunamadı"|escape:"javascript"}';
    var langError = '{$_LANG.error|default:"Hata!"|escape:"javascript"}';
    var langPleaseSelectIlFirst = '{$_LANG.pleaseselectilfirst|default:"Önce İl Seçin"|escape:"javascript"}';

    // Tarih seçiciyi sadece bu formdaki .date-picker-btk-client sınıfına uygula
    if ($.fn.datepicker) {
        $('#btkClientCustomFieldsContainer .date-picker-btk-client').datepicker({ 
            dateFormat: 'dd.mm.yy', 
            changeMonth: true, 
            changeYear: true, 
            yearRange: "-100:+0" 
        });
    }

    // Doğum Tarihi Display -> Hidden Input (YYYYMMDD) ve Yıl Input (YYYY)
    $('#btk_client_data_abone_dogum_tarihi_display_hook').on('change input', function() {
        var displayDate = $(this).val();
        var dbDate = btkFormatDateToDb(displayDate); 
        $('#abone_dogum_tarihi_btk_client_hook').val(dbDate);
        if (dbDate && dbDate.length === 8) {
            $('#abone_dogum_tarihi_yil_hook_val').val(dbDate.substring(0,4)); // NVI için yıl
        } else {
            $('#abone_dogum_tarihi_yil_hook_val').val('');
        }
    }).trigger('change');


    // İl seçildiğinde ilçeleri yükle
    var initialIlClientHook = $('#btk_client_data_abone_adres_yerlesim_il_hook').val();
    var initialIlceClientHook = $('#btk_client_data_abone_adres_yerlesim_ilce_hook').data('selected-ilce');
    if(initialIlClientHook){
        btkLoadIlceler(initialIlClientHook, $('#btk_client_data_abone_adres_yerlesim_ilce_hook'), initialIlceClientHook, moduleLink, csrfToken, {
            pleaseselectone: langPleaseSelectOne, loading: langLoading, noresultsfound: langNoResults, error: langError, pleaseselectilfirst: langPleaseSelectIlFirst
        });
    }

    $('#btk_client_data_abone_adres_yerlesim_il_hook.select-il-client-hook').on('change', function() {
        btkLoadIlceler($(this).val(), $('#' + $(this).data('target-ilce')), null, moduleLink, csrfToken, {
            pleaseselectone: langPleaseSelectOne, loading: langLoading, noresultsfound: langNoResults, error: langError, pleaseselectilfirst: langPleaseSelectIlFirst
        });
    });

    // NVI Doğrulama Butonu
    $('.btk-nvi-verify-btn-client').on('click', function() {
        var btn = $(this);
        var originalBtnText = btn.html();
        btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
        
        var type = btn.data('type');
        var idNoField = $('#' + btn.data('targetfieldid'));
        var idNo = idNoField.val();
        var name = $('#' + btn.data('namefieldid')).val(); 
        var surname = $('#' + btn.data('surnamefieldid')).val(); 
        var dogumInputForNvi = '';

        if(type === 'tckn'){
            dogumInputForNvi = $('#' + btn.data('birthyearfieldid')).val(); // Sadece yıl
            if (!dogumInputForNvi || !/^\d{4}$/.test(dogumInputForNvi)) {
                 var errorMsg = 'Lütfen TCKN doğrulaması için geçerli bir Doğum Yılı (YYYY) girin.';
                 $('#' + btn.data('statusdivid')).html('<span class="label label-danger btk-nvi-status-label">' + errorMsg + '</span>');
                 $('#btkClientFormNviResultHook').removeClass('alert-success alert-info').addClass('alert-danger').html(errorMsg).show().delay(5000).fadeOut();
                 btn.prop('disabled', false).html(originalBtnText);
                 return;
            }
        } else if (type === 'ykn') {
            dogumInputForNvi = $('#' + btn.data('birthdatefieldid')).val(); // YYYYMMDD formatında hidden input
             if (!dogumInputForNvi || !/^\d{8}$/.test(dogumInputForNvi)) {
                 var errorMsg = 'Lütfen YKN doğrulaması için geçerli bir Doğum Tarihi (GG.AA.YYYY formatında girip YYYYMMDD olarak alınacak) girin.';
                 $('#' + btn.data('statusdivid')).html('<span class="label label-danger btk-nvi-status-label">' + errorMsg + '</span>');
                 $('#btkClientFormNviResultHook').removeClass('alert-success alert-info').addClass('alert-danger').html(errorMsg).show().delay(5000).fadeOut();
                 btn.prop('disabled', false).html(originalBtnText);
                 return;
            }
        }
        
        var params = {
            type: type, id_no: idNo, ad: name, soyad: surname, 
            dogum_input: dogumInputForNvi, token: csrfToken,
            client_id: clientId 
        };
        
        var resultDiv = $('#' + btn.data('statusdivid'));
        var nviResultContainer = $('#btkClientFormNviResultHook');
        var hiddenStatusField = (type === 'tckn' ? $('#nvi_tckn_dogrulandi_hook_hidden') : $('#nvi_ykn_dogrulandi_hook_hidden'));
        var hiddenTimestampField = (type === 'tckn' ? $('#nvi_tckn_son_dogrulama_hook_hidden') : $('#nvi_ykn_son_dogrulama_hook_hidden'));

        btkPerformNviAjaxVerification(params, moduleLink, resultDiv, hiddenStatusField, hiddenTimestampField, nviResultContainer, function(data) {
            btn.prop('disabled', false).html(originalBtnText);
        });
    });

    // Global fonksiyonlar (eğer btk_admin_scripts.js'de tanımlı değilse burada olmalı)
    if (typeof btkFormatDateToDb !== 'function') {
        function btkFormatDateToDb(displayDate) { 
            if (displayDate && typeof displayDate === 'string' && displayDate.length === 10 && displayDate.includes('.')) {
                var parts = displayDate.split('.');
                if (parts.length === 3 && parts[2].length === 4 && parts[1].length === 2 && parts[0].length === 2) {
                    return parts[2] + parts[1] + parts[0];
                }
            }
            return '';
        }
    }
    if (typeof btkLoadIlceler !== 'function') {
        function btkLoadIlceler(ilAdi, ilceSelectElement, selectedIlce, moduleLink, csrfToken, lang) {
            lang = lang || {};
            var langPleaseSelectOne = lang.pleaseselectone || "Lütfen Seçiniz...";
            var langLoading = lang.loading || "Yükleniyor...";
            var langNoResults = lang.noresultsfound || "Sonuç bulunamadı";
            var langError = lang.error || "Hata!";
            var langPleaseSelectIlFirst = lang.pleaseselectilfirst || "Önce İl Seçin";

            ilceSelectElement.empty().append($('<option>', { value: '', text: langLoading }));
            if (ilAdi) {
                $.ajax({
                    url: moduleLink + '&action=get_ilceler', 
                    type: 'POST', dataType: 'json',
                    data: { il_adi: ilAdi, token: csrfToken },
                    success: function(data) {
                        ilceSelectElement.empty().append($('<option>', { value: '', text: langPleaseSelectOne }));
                        if (data && data.status === 'success' && data.ilceler && data.ilceler.length > 0) {
                            $.each(data.ilceler, function(idx, ilce) {
                                ilceSelectElement.append($('<option>', { value: ilce.ilce_adi, text: ilce.ilce_adi, selected: (ilce.ilce_adi == selectedIlce) }));
                            });
                            if (selectedIlce) ilceSelectElement.val(selectedIlce);
                        } else { ilceSelectElement.append($('<option>', { value: '', text: langNoResults})); }
                    },
                    error: function() { ilceSelectElement.empty().append($('<option>', { value: '', text: langError})); }
                });
            } else { ilceSelectElement.empty().append($('<option>', { value: '', text: langPleaseSelectIlFirst})); }
        }
    }
    if (typeof btkPerformNviAjaxVerification !== 'function') {
        function btkPerformNviAjaxVerification(params, moduleLink, resultDiv, hiddenStatusField, hiddenTimestampField, nviResultContainer, callback) {
            resultDiv.html('<span class="label label-info btk-nvi-status-label">Doğrulanıyor...</span>');
            if(nviResultContainer) nviResultContainer.hide().removeClass('alert-success alert-danger alert-warning').html('');
            $.ajax({
                url: moduleLink + '&action=nvi_dogrula', type: 'POST', dataType: 'json', data: params,
                success: function(data) {
                    var timestamp = new Date();
                    var formattedTimestamp = timestamp.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                    var dbTimestamp = timestamp.toISOString().slice(0, 19).replace('T', ' ');
                    var messageToShow = data.message || 'Bilinmeyen bir NVI yanıtı alındı.';
                    if (data && data.status === 'success') {
                        if(hiddenStatusField) hiddenStatusField.val(data.isValid ? '1' : '0');
                        if(hiddenTimestampField) hiddenTimestampField.val(dbTimestamp);
                        if (data.isValid) {
                            resultDiv.html('<span class="label label-success btk-nvi-status-label"><i class="fas fa-check-circle"></i> NVI Doğrulandı (' + formattedTimestamp + ')</span>');
                            if(nviResultContainer) nviResultContainer.removeClass('alert-danger alert-warning').addClass('alert-success').html(messageToShow).show().delay(5000).fadeOut();
                        } else {
                            resultDiv.html('<span class="label label-danger btk-nvi-status-label"><i class="fas fa-times-circle"></i> NVI Başarısız (' + formattedTimestamp + ')</span><br><small>' + messageToShow + '</small>');
                             if(nviResultContainer) nviResultContainer.removeClass('alert-success alert-warning').addClass('alert-danger').html(messageToShow).show().delay(5000).fadeOut();
                        }
                    } else {
                        resultDiv.html('<span class="label label-danger btk-nvi-status-label">Doğrulama sırasında hata: ' + messageToShow + '</span>');
                        if(nviResultContainer) nviResultContainer.removeClass('alert-success alert-warning').addClass('alert-danger').html(messageToShow).show().delay(5000).fadeOut();
                        if(hiddenStatusField) hiddenStatusField.val('0');
                    }
                    if(typeof callback === 'function') callback(data);
                },
                error: function(jqXHR) { 
                    var errorMsg = 'NVI Doğrulama servisine ulaşılamadı veya sunucu hatası oluştu.';
                    if(jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.message) errorMsg = jqXHR.responseJSON.message;
                    else if (jqXHR && jqXHR.responseText) { try { var errData = JSON.parse(jqXHR.responseText); if(errData && errData.message) errorMsg = errData.message; } catch (e){} }
                    resultDiv.html('<span class="label label-danger btk-nvi-status-label">' + errorMsg + '</span>'); 
                    if(nviResultContainer) nviResultContainer.removeClass('alert-success alert-warning').addClass('alert-danger').html(errorMsg).show().delay(5000).fadeOut();
                    if(hiddenStatusField) hiddenStatusField.val('0'); 
                    if(typeof callback === 'function') callback({ status: 'error', isValid: false, message: errorMsg });
                }
            });
        }
    }
});
</script>