{* modules/addons/btkreports/templates/admin/partials/address_fields.tpl *}
{* Yeniden Kullanılabilir Adres Giriş Alanları Alt Şablonu *}
{* Gerekli Parametreler: prefix, address_data, iller_for_select, lang *}
{* Opsiyonel Parametreler: required_fields (boolean, default false) *}

{assign var="isRequired" value=$required_fields|default:false}

<div class="row">
    <div class="col-md-4">
        <div class="form-group">
            <label for="{$prefix}_il_kodu" class="control-label">{$lang.adres_il_label}{if $isRequired}*{/if}</label>
            <select name="{$prefix}_il_kodu" id="{$prefix}_il_kodu" class="form-control select-il-{$prefix}" {if $isRequired}required{/if}>
                <option value="">{$lang.select_option}</option>
                {if $iller_for_select}
                    {foreach from=$iller_for_select item=il}
                        <option value="{$il.il_kodu}" {if $address_data.adres_il_ref_kodu == $il.il_kodu}selected{/if}>
                            {$il.il_adi|escape:'html'}
                        </option>
                    {/foreach}
                {/if}
            </select>
        </div>
    </div>
    <div class="col-md-4">
        <div class="form-group">
            <label for="{$prefix}_ilce_kodu" class="control-label">{$lang.adres_ilce_label}{if $isRequired}*{/if}</label>
            <select name="{$prefix}_ilce_kodu" id="{$prefix}_ilce_kodu" class="form-control select-ilce-{$prefix}" {if $isRequired}required{/if} data-selected="{$address_data.adres_ilce_ref_kodu|default:''}">
                <option value="">{$lang.select_option}</option>
                {* JavaScript ile doldurulacak *}
                {if $address_data.adres_ilce_ref_kodu && $address_data.ilce_opsiyonlari_icin}
                    {foreach from=$address_data.ilce_opsiyonlari_icin item=ilce_ops}
                         <option value="{$ilce_ops.id}" {if $address_data.adres_ilce_ref_kodu == $ilce_ops.id}selected{/if}>{$ilce_ops.name|escape:'html'}</option>
                    {/foreach}
                {/if}
            </select>
        </div>
    </div>
    <div class="col-md-4">
        <div class="form-group">
            <label for="{$prefix}_mahalle_kodu" class="control-label">{$lang.adres_mahalle_label}</label>
            <select name="{$prefix}_mahalle_kodu" id="{$prefix}_mahalle_kodu" class="form-control select-mahalle-{$prefix}" data-selected="{$address_data.adres_mahalle_ref_kodu|default:''}">
                <option value="">{$lang.select_option}</option>
                {* JavaScript ile doldurulacak *}
                 {if $address_data.adres_mahalle_ref_kodu && $address_data.mahalle_opsiyonlari_icin}
                    {foreach from=$address_data.mahalle_opsiyonlari_icin item=mah_ops}
                         <option value="{$mah_ops.id}" {if $address_data.adres_mahalle_ref_kodu == $mah_ops.id}selected{/if}>{$mah_ops.name|escape:'html'}</option>
                    {/foreach}
                {/if}
            </select>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-8">
        <div class="form-group">
            <label for="{$prefix}_cadde_sokak" class="control-label">{$lang.adres_cadde_sokak_label}{if $isRequired}*{/if}</label>
            <input type="text" name="{$prefix}_cadde_sokak" id="{$prefix}_cadde_sokak" value="{$address_data.adres_cadde_sokak_bulvar|default:''|escape:'html'}" class="form-control" {if $isRequired}required{/if}>
        </div>
    </div>
    <div class="col-md-4">
        <div class="form-group">
            <label for="{$prefix}_bina_adi_no" class="control-label">{$lang.adres_bina_adi_no_label}</label>
            <input type="text" name="{$prefix}_bina_adi_no" id="{$prefix}_bina_adi_no" value="{$address_data.adres_bina_adi_no|default:''|escape:'html'}" class="form-control">
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-3">
        <div class="form-group">
            <label for="{$prefix}_dis_kapi_no" class="control-label">{$lang.adres_dis_kapi_no_label}{if $isRequired}*{/if}</label>
            <input type="text" name="{$prefix}_dis_kapi_no" id="{$prefix}_dis_kapi_no" value="{$address_data.adres_dis_kapi_no|default:''|escape:'html'}" class="form-control" {if $isRequired}required{/if}>
        </div>
    </div>
    <div class="col-md-3">
        <div class="form-group">
            <label for="{$prefix}_ic_kapi_no" class="control-label">{$lang.adres_ic_kapi_no_label}</label>
            <input type="text" name="{$prefix}_ic_kapi_no" id="{$prefix}_ic_kapi_no" value="{$address_data.adres_ic_kapi_no|default:''|escape:'html'}" class="form-control">
        </div>
    </div>
    <div class="col-md-3">
        <div class="form-group">
            <label for="{$prefix}_posta_kodu" class="control-label">{$lang.adres_posta_kodu_label}</label>
            <input type="text" name="{$prefix}_posta_kodu" id="{$prefix}_posta_kodu" value="{$address_data.adres_posta_kodu|default:''|escape:'html'}" class="form-control" maxlength="5" pattern="[0-9]{5}">
        </div>
    </div>
    <div class="col-md-3">
        <div class="form-group">
            <label for="{$prefix}_uavt_kodu" class="control-label">{$lang.adres_uavt_kodu_label} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.adres_uavt_kodu_desc|escape:'html'}"></i></label>
            <input type="text" name="{$prefix}_uavt_kodu" id="{$prefix}_uavt_kodu" value="{$address_data.adres_uavt_kodu|default:''|escape:'html'}" class="form-control" pattern="[0-9]*">
        </div>
    </div>
</div>

<div class="form-group">
    <label for="{$prefix}_acik_full" class="control-label">{$lang.adres_acik_full_label}</label>
    <textarea name="{$prefix}_acik_full" id="{$prefix}_acik_full" class="form-control" rows="2">{$address_data.adres_acik_full|default:''|escape:'html'}</textarea>
    <span class="help-block">{$lang.adres_acik_full_desc}</span>
</div>

{* JavaScript bu partial'ı çağıran ana TPL dosyasında (client_details.tpl veya service_details.tpl) olmalıdır. *}
{* Ana TPL'deki script, bu partial'daki select elementlerinin ID'lerini (prefix'i kullanarak) hedefleyecektir. *}
{* Örnek: $('.select-il-' + prefix).change(...) *}
<script type="text/javascript">
// Bu script sadece bu partial'a özgü ve onu include eden TPL'de tekrar tanımlanmamalı.
// Bu nedenle, dinamik dropdown JS'i ana TPL'lerde (client_details.tpl, service_details.tpl)
// veya merkezi btk_admin_scripts.js içinde bir fonksiyon olarak tanımlanmalı ve
// bu partial'daki elementlere prefix ile uygulanmalı.

// Şimdilik, bu partial'ı include eden ana TPL'in JavaScript'inin
// '.select-il-{$prefix}', '.select-ilce-{$prefix}', '.select-mahalle-{$prefix}' class'larını
// hedefleyerek çalışacağını varsayıyoruz.

// Düzenleme modunda, önceden yüklenmiş ilçe ve mahalle opsiyonlarını
// PHP tarafı $address_data.ilce_opsiyonlari_icin ve $address_data.mahalle_opsiyonlari_icin
// ile gönderebilir. Bu, sayfa ilk yüklendiğinde AJAX çağırmadan dropdown'ların dolu gelmesini sağlar.
// Ancak bu, PHP tarafında ek mantık gerektirir.
// Daha basit bir yaklaşım, JS'nin her zaman AJAX ile doldurmasıdır,
// `data-selected` attribute'u ile hangi değerin seçileceğini bilerek.
// Yukarıdaki select elementlerine `data-selected` eklendi.
</script>