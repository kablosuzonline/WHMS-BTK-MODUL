{* WHMCS BTK Raporları Modülü - Müşteri Paneli - BTK Müşteri Bilgileri Görüntüleme *}
{* Bu şablon, ClientAreaPageDetails veya ClientAreaPrimarySidebar gibi bir hook ile müşteri detayları sayfasına enjekte edilir, *}
{* ya da ClientAreaNavbars hook'u ile yeni bir menü öğesi ve bu şablonu kullanan özel bir sayfa oluşturulabilir. *}

{if $clientarea_flash_message}
    <div class="alert alert-{$clientarea_flash_message.type|default:'info'|escape:'html':'UTF-8'} text-center">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
        {$clientarea_flash_message.message|escape:'html':'UTF-8'}
    </div>
{/if}

{if $btkClientAreaError}
    <div class="alert alert-danger text-center">
        {$btkClientAreaError}
    </div>
{else if !$btk_client_data && $isBtkDataEntryRequiredForClient}
     <div class="alert alert-warning">
        <p>{$LANG.btk_clientarea_data_missing_info|default:'BTK için gerekli bazı bilgileriniz eksiktir. Güncellenmesi için lütfen destek talebi oluşturarak durumu bildiriniz.'}</p>
        <p><a href="submitticket.php" class="btn btn-sm btn-warning">{$LANG.supportticketsopenticket}</a></p>
    </div>
{else if $btk_client_data}
    <div class="panel panel-default btk-client-panel">
        <div class="panel-heading">
            <h3 class="panel-title">
                <i class="fas fa-shield-alt icon-spacer"></i>{$LANG.btk_clientarea_btk_info_title|default:'BTK Bilgilerim'}
            </h3>
        </div>
        <div class="panel-body">
            <p class="text-muted"><small>{$LANG.btk_clientarea_readonly_info|default:'Bu bilgiler sadece görüntüleme amaçlıdır. Değişiklik için lütfen bizimle iletişime geçiniz.'}</small></p>
            <hr>

            <div class="row">
                <div class="col-md-6">
                    <h5><i class="fas fa-user icon-spacer"></i>{$LANG.btk_clientarea_personal_info|default:'Kişisel Bilgiler (BTK)'}</h5>
                    <div class="table-responsive">
                        <table class="table table-sm table-btk-client-info">
                            {if $btk_client_data.MUSTERI_TIPI_ACIKLAMA}
                            <tr><td width="45%"><strong>{$LANG.MUSTERI_TIPI}:</strong></td><td>{$btk_client_data.MUSTERI_TIPI_ACIKLAMA|escape:'html'} ({$btk_client_data.MUSTERI_TIPI|escape:'html'})</td></tr>
                            {/if}
                            {if $btk_client_data.MUSTERI_TIPI == 'B'} {* Bireysel *}
                                {if $btk_client_data.ABONE_TC_KIMLIK_NO}<tr><td><strong>{$LANG.ABONE_TC_KIMLIK_NO}:</strong></td><td>******{$btk_client_data.ABONE_TC_KIMLIK_NO|substr:-5|escape:'html'}</td></tr>{/if}
                                {if $btk_client_data.ABONE_ADI}<tr><td><strong>{$LANG.ABONE_ADI}:</strong></td><td>{$btk_client_data.ABONE_ADI|escape:'html'}</td></tr>{/if}
                                {if $btk_client_data.ABONE_SOYADI}<tr><td><strong>{$LANG.ABONE_SOYADI}:</strong></td><td>{$btk_client_data.ABONE_SOYADI|escape:'html'}</td></tr>{/if}
                                {if $btk_client_data.ABONE_CINSIYET_ACIKLAMA}<tr><td><strong>{$LANG.ABONE_CINSIYET}:</strong></td><td>{$btk_client_data.ABONE_CINSIYET_ACIKLAMA|escape:'html'}</td></tr>{/if}
                            {else} {* Kurumsal *}
                                {if $btk_client_data.ABONE_UNVAN}<tr><td><strong>{$LANG.ABONE_UNVAN}:</strong></td><td>{$btk_client_data.ABONE_UNVAN|escape:'html'}</td></tr>{/if}
                                {if $btk_client_data.ABONE_VERGI_NUMARASI}<tr><td><strong>{$LANG.ABONE_VERGI_NUMARASI}:</strong></td><td>{$btk_client_data.ABONE_VERGI_NUMARASI|escape:'html'}</td></tr>{/if}
                                {if $btk_client_data.ABONE_MERSIS_NUMARASI}<tr><td><strong>{$LANG.ABONE_MERSIS_NUMARASI}:</strong></td><td>{$btk_client_data.ABONE_MERSIS_NUMARASI|escape:'html'}</td></tr>{/if}
                            {/if}
                            {if $btk_client_data.ABONE_UYRUK_ACIKLAMA}<tr><td><strong>{$LANG.ABONE_UYRUK}:</strong></td><td>{$btk_client_data.ABONE_UYRUK_ACIKLAMA|escape:'html'} ({$btk_client_data.ABONE_UYRUK|escape:'html'})</td></tr>{/if}
                            {if $btk_client_data.ABONE_PASAPORT_NO && $btk_client_data.ABONE_UYRUK != 'TUR'}<tr><td><strong>{$LANG.ABONE_PASAPORT_NO}:</strong></td><td>{$btk_client_data.ABONE_PASAPORT_NO|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_BABA_ADI}<tr><td><strong>{$LANG.btk_father_name}:</strong></td><td>{$btk_client_data.ABONE_BABA_ADI|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_ANA_ADI}<tr><td><strong>{$LANG.btk_mother_name}:</strong></td><td>{$btk_client_data.ABONE_ANA_ADI|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_ANNE_KIZLIK_SOYADI && $btk_client_data.MUSTERI_TIPI == 'B'}<tr><td><strong>{$LANG.btk_mother_maiden_name}:</strong></td><td>{$btk_client_data.ABONE_ANNE_KIZLIK_SOYADI|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_DOGUM_YERI}<tr><td><strong>{$LANG.btk_birth_place}:</strong></td><td>{$btk_client_data.ABONE_DOGUM_YERI|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_DOGUM_TARIHI}<tr><td><strong>{$LANG.btk_birth_date}:</strong></td><td>{$btk_client_data.ABONE_DOGUM_TARIHI|btkDateToDisplay}</td></tr>{/if}
                            {if $btk_client_data.ABONE_MESLEK_ACIKLAMA}<tr><td><strong>{$LANG.btk_profession_code}:</strong></td><td>{$btk_client_data.ABONE_MESLEK_ACIKLAMA|escape:'html'}</td></tr>{/if}
                        </table>
                    </div>
                </div>
                <div class="col-md-6">
                    <h5><i class="fas fa-id-badge icon-spacer"></i>{$LANG.ABONE_KIMLIK_BILGILERI} (BTK)</h5>
                    <div class="table-responsive">
                        <table class="table table-sm table-btk-client-info">
                            {if $btk_client_data.ABONE_KIMLIK_TIPI_ACIKLAMA}<tr><td width="45%"><strong>{$LANG.btk_id_card_type}:</strong></td><td>{$btk_client_data.ABONE_KIMLIK_TIPI_ACIKLAMA|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_KIMLIK_SERI_NO}<tr><td><strong>{$LANG.btk_id_card_serial_no}:</strong></td><td>{$btk_client_data.ABONE_KIMLIK_SERI_NO|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_KIMLIK_CILT_NO}<tr><td><strong>{$LANG.btk_id_card_volume_no}:</strong></td><td>{$btk_client_data.ABONE_KIMLIK_CILT_NO|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_KIMLIK_KUTUK_NO}<tr><td><strong>{$LANG.btk_id_card_family_serial_no}:</strong></td><td>{$btk_client_data.ABONE_KIMLIK_KUTUK_NO|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_KIMLIK_SAYFA_NO}<tr><td><strong>{$LANG.btk_id_card_sequence_no}:</strong></td><td>{$btk_client_data.ABONE_KIMLIK_SAYFA_NO|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_KIMLIK_IL}<tr><td><strong>{$LANG.btk_id_card_province}:</strong></td><td>{$btk_client_data.ABONE_KIMLIK_IL|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_KIMLIK_ILCE}<tr><td><strong>{$LANG.btk_id_card_district}:</strong></td><td>{$btk_client_data.ABONE_KIMLIK_ILCE|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_KIMLIK_MAHALLE_KOY}<tr><td><strong>{$LANG.btk_id_card_village}:</strong></td><td>{$btk_client_data.ABONE_KIMLIK_MAHALLE_KOY|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_KIMLIK_VERILDIGI_YER}<tr><td><strong>{$LANG.btk_id_card_issue_place}:</strong></td><td>{$btk_client_data.ABONE_KIMLIK_VERILDIGI_YER|escape:'html'}</td></tr>{/if}
                            {if $btk_client_data.ABONE_KIMLIK_VERILDIGI_TARIH}<tr><td><strong>{$LANG.btk_id_card_issue_date}:</strong></td><td>{$btk_client_data.ABONE_KIMLIK_VERILDIGI_TARIH|btkDateToDisplay}</td></tr>{/if}
                            {if $btk_client_data.ABONE_KIMLIK_AIDIYETI_ACIKLAMA}<tr><td><strong>{$LANG.btk_id_card_owner_relation}:</strong></td><td>{$btk_client_data.ABONE_KIMLIK_AIDIYETI_ACIKLAMA|escape:'html'}</td></tr>{/if}
                        </table>
                    </div>
                </div>
            </div>
            <hr>
            <h5><i class="fas fa-map-marker-alt icon-spacer"></i>{$LANG.btk_address_residential_title} (BTK)</h5>
            <div class="table-responsive">
                <table class="table table-sm table-btk-client-info">
                    <tr><td width="30%"><strong>{$LANG.btk_address_province}:</strong></td><td>{$btk_client_data.ABONE_ADRES_YERLESIM_IL|escape:'html'}</td></tr>
                    <tr><td><strong>{$LANG.btk_address_district}:</strong></td><td>{$btk_client_data.ABONE_ADRES_YERLESIM_ILCE|escape:'html'}</td></tr>
                    <tr><td><strong>{$LANG.btk_address_neighbourhood}:</strong></td><td>{$btk_client_data.ABONE_ADRES_YERLESIM_MAHALLE|escape:'html'}</td></tr>
                    {if $btk_client_data.ABONE_ADRES_YERLESIM_CADDE}<tr><td><strong>{$LANG.btk_address_street_avenue}:</strong></td><td>{$btk_client_data.ABONE_ADRES_YERLESIM_CADDE|escape:'html'}</td></tr>{/if}
                    {if $btk_client_data.ABONE_ADRES_YERLESIM_DIS_KAPI_NO}<tr><td><strong>{$LANG.btk_address_building_no}:</strong></td><td>{$btk_client_data.ABONE_ADRES_YERLESIM_DIS_KAPI_NO|escape:'html'}</td></tr>{/if}
                    {if $btk_client_data.ABONE_ADRES_YERLESIM_IC_KAPI_NO}<tr><td><strong>{$LANG.btk_address_apartment_no}:</strong></td><td>{$btk_client_data.ABONE_ADRES_YERLESIM_IC_KAPI_NO|escape:'html'}</td></tr>{/if}
                    {if $btk_client_data.ABONE_ADRES_YERLESIM_POSTA_KODU}<tr><td><strong>{$LANG.btk_address_postal_code}:</strong></td><td>{$btk_client_data.ABONE_ADRES_YERLESIM_POSTA_KODU|escape:'html'}</td></tr>{/if}
                    {if $btk_client_data.ABONE_ADRES_YERLESIM_ADRES_KODU}<tr><td><strong>{$LANG.btk_address_uavt_code} (Yerleşim):</strong></td><td>{$btk_client_data.ABONE_ADRES_YERLESIM_ADRES_KODU|escape:'html'}</td></tr>{/if}
                </table>
            </div>

            {if $btk_client_data.MUSTERI_TIPI != 'B'}
            <hr>
            <h5><i class="fas fa-building icon-spacer"></i>{$LANG.btk_corporate_info_title|default:'Kurum Yetkilisi Bilgileri'} (BTK)</h5>
            <div class="table-responsive">
                <table class="table table-sm table-btk-client-info">
                    {if $btk_client_data.KURUM_YETKILI_ADI}<tr><td width="30%"><strong>{$LANG.btk_corporate_authorized_name}:</strong></td><td>{$btk_client_data.KURUM_YETKILI_ADI|escape:'html'}</td></tr>{/if}
                    {if $btk_client_data.KURUM_YETKILI_SOYADI}<tr><td><strong>{$LANG.btk_corporate_authorized_surname}:</strong></td><td>{$btk_client_data.KURUM_YETKILI_SOYADI|escape:'html'}</td></tr>{/if}
                    {if $btk_client_data.KURUM_YETKILI_TCKIMLIK_NO}<tr><td><strong>{$LANG.btk_corporate_authorized_tckn}:</strong></td><td>******{$btk_client_data.KURUM_YETKILI_TCKIMLIK_NO|substr:-5|escape:'html'}</td></tr>{/if}
                    {if $btk_client_data.KURUM_YETKILI_TELEFON}<tr><td><strong>{$LANG.btk_corporate_authorized_phone}:</strong></td><td>{$btk_client_data.KURUM_YETKILI_TELEFON|escape:'html'}</td></tr>{/if}
                    {if $btk_client_data.KURUM_ADRES}<tr><td><strong>{$LANG.btk_corporate_address}:</strong></td><td>{$btk_client_data.KURUM_ADRES|escape:'html'|nl2br}</td></tr>{/if}
                </table>
            </div>
            {/if}
        </div>
    </div>
{else}
    {* Henüz müşteri için BTK kaydı oluşturulmamışsa veya veri yüklenemediyse bir mesaj gösterilebilir. *}
    {* Bu durum genellikle hook'lar veya admin arayüzünden ilk veri girişi yapılana kadar olabilir. *}
    {* <div class="alert alert-info">{$LANG.btk_clientarea_no_data_yet|default:'Sizin için kayıtlı BTK verisi bulunmamaktadır.'}</div> *}
{/if}

{* Bu şablon için özel stiller (örn: .table-btk-client-info, .btk-client-panel h5)
   merkezi bir clientarea CSS dosyasına (assets/css/btk_client_style.css) eklenmelidir.
*}

{*
Gerekli Smarty Değişkenleri (btkreports.php veya ilgili Controller/Hook'ta atanmalı):
- $clientarea_flash_message: (Array) Müşteri paneli için flash mesaj (opsiyonel)
- $btkClientAreaError: (String) Hata mesajı varsa.
- $btk_client_data: (Object/Array) mod_btk_abone_rehber tablosundan müşteriye ait BTK verileri.
  Bu dizi/nesne içinde *_ACIKLAMA (örn: MUSTERI_TIPI_ACIKLAMA, ABONE_UYRUK_ACIKLAMA) ve
  ABONE_DOGUM_TARIHI, ABONE_KIMLIK_VERILDIGI_TARIH gibi tarih alanları için
  insan tarafından okunabilir formatta bir yardımcı Smarty modifier'ı (örn: |btkDateToDisplay) veya
  PHP tarafında formatlanmış değerler gerekebilir.
- $isBtkDataEntryRequiredForClient: (Boolean) Müşteri için BTK veri girişinin zorunlu olup olmadığını belirtir.
- $LANG: Dil değişkenleri.
*}