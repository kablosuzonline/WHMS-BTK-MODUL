{* WHMCS BTK Raporları Modülü - Müşteri Paneli - BTK Hizmet Bilgileri Görüntüleme *}
{* Bu şablon, ClientAreaPageViewProductDetails veya benzeri bir hook ile hizmet detayları sayfasına enjekte edilir. *}

{if $clientarea_service_flash_message}
    <div class="alert alert-{$clientarea_service_flash_message.type|default:'info'|escape:'html':'UTF-8'} text-center">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
        {$clientarea_service_flash_message.message|escape:'html':'UTF-8'}
    </div>
{/if}

{if $btkClientAreaServiceError}
    <div class="alert alert-danger text-center">
        {$btkClientAreaServiceError}
    </div>
{else if !$btk_service_rehber_data && !$isBtkDataEntryRequiredForService}
    {* Veri yoksa ve zorunlu değilse bir şey gösterme veya nazik bir mesaj *}
{else if !$btk_service_rehber_data && $isBtkDataEntryRequiredForService}
     <div class="alert alert-warning">
        <p>{$LANG.btk_clientarea_service_data_missing_info|default:'Bu hizmetiniz için BTK sisteminde kayıtlı bazı bilgiler eksiktir. Güncellenmesi için lütfen destek talebi oluşturunuz.'}</p>
        <p><a href="submitticket.php" class="btn btn-sm btn-warning">{$LANG.supportticketsopenticket}</a></p>
    </div>
{/if}

{if $btk_service_rehber_data}
    <div class="panel panel-info btk-client-panel" style="margin-top: 15px;">
        <div class="panel-heading">
            <h3 class="panel-title">
                <i class="fas fa-info-circle icon-spacer"></i>{$LANG.btk_clientarea_service_btk_info_title|default:'Hizmetinize Ait BTK Bilgileri'}
            </h3>
        </div>
        <div class="panel-body">
            <p class="text-muted"><small>{$LANG.btk_clientarea_readonly_info|default:'Bu bilgiler sadece görüntüleme amaçlıdır. Değişiklik için lütfen bizimle iletişime geçiniz.'}</small></p>
            <hr>

            <div class="row">
                <div class="col-md-6">
                    <h5><i class="fas fa-concierge-bell icon-spacer"></i>{$LANG.btk_clientarea_service_main_info|default:'Temel Hizmet Bilgileri (BTK)'}</h5>
                    <div class="table-responsive">
                        <table class="table table-sm table-btk-client-info">
                            {if $btk_service_rehber_data.HAT_NO}<tr><td width="45%"><strong>{$LANG.HAT_NO}:</strong></td><td>{$btk_service_rehber_data.HAT_NO|escape:'html'}</td></tr>{/if}
                            {if $btk_service_rehber_data.HIZMET_TIPI_ACIKLAMA}<tr><td><strong>{$LANG.btk_service_type}:</strong></td><td>{$btk_service_rehber_data.HIZMET_TIPI_ACIKLAMA|escape:'html'} ({$btk_service_rehber_data.HIZMET_TIPI|escape:'html'})</td></tr>{/if}
                            {if $btk_service_rehber_data.ABONE_TARIFE}<tr><td><strong>{$LANG.btk_tariff_name}:</strong></td><td>{$btk_service_rehber_data.ABONE_TARIFE|escape:'html'}</td></tr>{/if}
                            {if $btk_service_rehber_data.ISS_HIZ_PROFILI}<tr><td><strong>{$LANG.btk_iss_speed_profile}:</strong></td><td>{$btk_service_rehber_data.ISS_HIZ_PROFILI|escape:'html'}</td></tr>{/if}
                            {if $btk_service_rehber_data.HAT_DURUM_ACIKLAMA}<tr><td><strong>{$LANG.btk_line_status_btk}:</strong></td><td>{$btk_service_rehber_data.HAT_DURUM_ACIKLAMA|escape:'html'} ({$btk_service_rehber_data.HAT_DURUM|escape:'html'})</td></tr>{/if}
                            {if $btk_service_rehber_data.HAT_DURUM_KODU_ACIKLAMA}<tr><td><strong>{$LANG.btk_line_status_code_btk}:</strong></td><td>{$btk_service_rehber_data.HAT_DURUM_KODU_ACIKLAMA|escape:'html'} ({$btk_service_rehber_data.HAT_DURUM_KODU|escape:'html'})</td></tr>{/if}
                            {if $btk_service_rehber_data.ABONE_BASLANGIC}<tr><td><strong>{$LANG.ABONE_BASLANGIC}:</strong></td><td>{$btk_service_rehber_data.ABONE_BASLANGIC|btkToHumanDate}</td></tr>{/if}
                            {if $btk_service_rehber_data.ABONE_BITIS && $btk_service_rehber_data.ABONE_BITIS != '00000000000000'}<tr><td><strong>{$LANG.ABONE_BITIS}:</strong></td><td>{$btk_service_rehber_data.ABONE_BITIS|btkToHumanDate}</td></tr>{/if}
                        </table>
                    </div>
                </div>
                <div class="col-md-6">
                    <h5><i class="fas fa-network-wired icon-spacer"></i>{$LANG.btk_clientarea_service_technical_info|default:'Teknik Bilgiler (BTK)'}</h5>
                    <div class="table-responsive">
                        <table class="table table-sm table-btk-client-info">
                            {if $btk_service_rehber_data.STATIK_IP}<tr><td width="45%"><strong>{$LANG.btk_static_ip_address}:</strong></td><td>{$btk_service_rehber_data.STATIK_IP|escape:'html'}</td></tr>{/if}
                            {if $btk_service_rehber_data.ISS_KULLANICI_ADI}<tr><td><strong>{$LANG.btk_iss_username}:</strong></td><td>{$btk_service_rehber_data.ISS_KULLANICI_ADI|escape:'html'}</td></tr>{/if}
                            {if $btk_service_rehber_data.ISS_POP_BILGISI}<tr><td><strong>{$LANG.btk_iss_pop_info}:</strong></td><td>{$btk_service_rehber_data.ISS_POP_BILGISI|escape:'html'}</td></tr>{/if}
                        </table>
                    </div>
                </div>
            </div>

            <hr>
            <h5><i class="fas fa-map-pin icon-spacer"></i>{$LANG.btk_address_service_title} (BTK)</h5>
            <div class="table-responsive">
                <table class="table table-sm table-btk-client-info">
                    <tr><td width="30%"><strong>{$LANG.btk_address_province}:</strong></td><td>{$btk_service_rehber_data.ABONE_ADRES_TESIS_IL|escape:'html'}</td></tr>
                    <tr><td><strong>{$LANG.btk_address_district}:</strong></td><td>{$btk_service_rehber_data.ABONE_ADRES_TESIS_ILCE|escape:'html'}</td></tr>
                    <tr><td><strong>{$LANG.btk_address_neighbourhood}:</strong></td><td>{$btk_service_rehber_data.ABONE_ADRES_TESIS_MAHALLE|escape:'html'}</td></tr>
                    {if $btk_service_rehber_data.ABONE_ADRES_TESIS_CADDE}<tr><td><strong>{$LANG.btk_address_street_avenue}:</strong></td><td>{$btk_service_rehber_data.ABONE_ADRES_TESIS_CADDE|escape:'html'}</td></tr>{/if}
                    {if $btk_service_rehber_data.ABONE_ADRES_TESIS_DIS_KAPI_NO}<tr><td><strong>{$LANG.btk_address_building_no}:</strong></td><td>{$btk_service_rehber_data.ABONE_ADRES_TESIS_DIS_KAPI_NO|escape:'html'}</td></tr>{/if}
                    {if $btk_service_rehber_data.ABONE_ADRES_TESIS_IC_KAPI_NO}<tr><td><strong>{$LANG.btk_address_apartment_no}:</strong></td><td>{$btk_service_rehber_data.ABONE_ADRES_TESIS_IC_KAPI_NO|escape:'html'}</td></tr>{/if}
                    {if $btk_service_rehber_data.ABONE_ADRES_TESIS_POSTA_KODU}<tr><td><strong>{$LANG.btk_address_postal_code}:</strong></td><td>{$btk_service_rehber_data.ABONE_ADRES_TESIS_POSTA_KODU|escape:'html'}</td></tr>{/if}
                    {if $btk_service_rehber_data.ABONE_ADRES_TESIS_ADRES_KODU}<tr><td><strong>{$LANG.btk_address_uavt_code} (Tesis):</strong></td><td>{$btk_service_rehber_data.ABONE_ADRES_TESIS_ADRES_KODU|escape:'html'}</td></tr>{/if}
                </table>
            </div>

            {* Operasyonel Ek Bilgiler (mod_btk_hizmet_detaylari tablosundan) *}
            {if $btk_service_ek_detay_data}
            <hr>
            <h5><i class="fas fa-cogs icon-spacer"></i>{$LANG.btk_clientarea_service_operational_info|default:'Diğer Hizmet Detayları'}</h5>
            <div class="table-responsive">
                <table class="table table-sm table-btk-client-info">
                    {if isset($btk_service_ek_detay_data.aile_filtresi_aktif)}
                    <tr>
                        <td width="30%"><strong>{$LANG.btk_family_filter_active}:</strong></td>
                        <td>{if $btk_service_ek_detay_data.aile_filtresi_aktif == 1}{$LANG.yes}{else}{$LANG.no}{/if}</td>
                    </tr>
                    {/if}
                    {if $btk_service_ek_detay_data.mac_adresleri}<tr><td><strong>{$LANG.btk_mac_addresses}:</strong></td><td>{$btk_service_ek_detay_data.mac_adresleri|escape:'html'|nl2br}</td></tr>{/if}
                    {if $btk_service_ek_detay_data.cihaz_modeli}<tr><td><strong>{$LANG.btk_device_model}:</strong></td><td>{$btk_service_ek_detay_data.cihaz_modeli|escape:'html'}</td></tr>{/if}
                    {if $btk_service_ek_detay_data.cihaz_seri_no}<tr><td><strong>{$LANG.btk_device_serial_no}:</strong></td><td>{$btk_service_ek_detay_data.cihaz_seri_no|escape:'html'|nl2br}</td></tr>{/if}
                    {if $btk_service_ek_detay_data.wifi_sifresi}<tr><td><strong>{$LANG.btk_wifi_password}:</strong></td><td><span class="text-muted">{$LANG.btk_clientarea_wifi_password_info|default:'Güvenlik nedeniyle gösterilmemektedir.'}</span></td></tr>{/if}
                    {* Diğer operasyonel alanlar (kurulum notları, sinyal kalitesi vb.) buraya eklenebilir *}
                </table>
            </div>
            {/if}
        </div>
    </div>
{else}
    {* Henüz bu hizmet için BTK kaydı oluşturulmamışsa veya veri yüklenemediyse bir mesaj gösterilebilir. *}
{/if}

{* Bu şablon için özel stiller (örn: .table-btk-client-info h5)
   merkezi bir clientarea CSS dosyasına (assets/css/btk_client_style.css) eklenmelidir.
*}

{*
Gerekli Smarty Değişkenleri (btkreports.php veya ilgili Controller/Hook'ta atanmalı):
- $clientarea_service_flash_message: (Array) Müşteri paneli hizmet detayları için flash mesaj (opsiyonel)
- $btkClientAreaServiceError: (String) Hata mesajı varsa.
- $btk_service_rehber_data: (Object/Array) mod_btk_abone_rehber tablosundan bu hizmete ait BTK verileri.
  Bu dizi/nesne içinde *_ACIKLAMA (örn: HIZMET_TIPI_ACIKLAMA) gibi yardımcı alanlar da bulunmalı.
  Tarih alanları için |btkToHumanDate gibi bir modifier veya PHP'de formatlanmış değerler.
- $btk_service_ek_detay_data: (Object/Array) mod_btk_hizmet_detaylari tablosundan bu hizmete ait operasyonel ek bilgiler.
- $isBtkDataEntryRequiredForService: (Boolean) Bu hizmet için BTK veri girişinin zorunlu olup olmadığını belirtir.
- $LANG: Dil değişkenleri.
*}