{*
    WHMCS BTK Raporlama Modülü - Veri Seti Yöneticisi ve Araçlar Şablonu
    Sürüm: 20.0.0 (Operasyon PHOENIX)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version}" rel="stylesheet">

<div id="btk-data-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>{$LANG.dataManagementIntro}</p>

<div class="panel panel-default btk-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-database"></i> {$LANG.addressDataSetsTitle}</h3>
    </div>
    <div class="panel-body">
        
        <div class="row" style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
            <div class="col-md-3">
                <h4>{$LANG.ilDataSet}</h4>
                <span class="label {if $il_data_status}label-success{else}label-danger{/if}">
                    {if $il_data_status}
                        <i class="fas fa-check-circle"></i> {$LANG.statusLoaded}
                    {else}
                        <i class="fas fa-times-circle"></i> {$LANG.statusNotLoaded}
                    {/if}
                </span>
            </div>
            <div class="col-md-9" style="padding-top: 5px;">
                <button class="btn btn-primary btn-load-dataset" data-set-name="iller">
                    <i class="fas fa-cloud-upload-alt"></i> {$LANG.loadButton}
                </button>
                <span class="dataset-result" id="result-iller"></span>
            </div>
        </div>

        <div class="row" style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
            <div class="col-md-3">
                <h4>{$LANG.ilceDataSet}</h4>
                 <span class="label {if $ilce_data_status}label-success{else}label-danger{/if}">
                    {if $ilce_data_status}
                        <i class="fas fa-check-circle"></i> {$LANG.statusLoaded}
                    {else}
                        <i class="fas fa-times-circle"></i> {$LANG.statusNotLoaded}
                    {/if}
                </span>
            </div>
            <div class="col-md-9" style="padding-top: 5px;">
                <button class="btn btn-primary btn-load-dataset" data-set-name="ilceler">
                    <i class="fas fa-cloud-upload-alt"></i> {$LANG.loadButton}
                </button>
                 <span class="dataset-result" id="result-ilceler"></span>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-3">
                <h4>{$LANG.mahalleDataSet}</h4>
                <p class="help-block">{$LANG.selectIlForMahalle}</p>
            </div>
            <div class="col-md-9">
                <div class="form-inline">
                    <div class="form-group">
                        <label for="select_ilce_for_mahalle">{$LANG.selectIlceForMahalle}</label>
                        <select id="select_ilce_for_mahalle" class="form-control" style="width: 250px;">
                            <option value="">{$LANG.selectOption}</option>
                             {foreach $ilceler_for_mahalle_upload as $ilce}
                                <option value="{$ilce.ilce_kodu_str}">{$ilce.display_name|escape}</option>
                            {/foreach}
                        </select>
                    </div>
                     <button class="btn btn-primary btn-load-dataset" data-set-name="mahalleler" id="btn-load-mahalle" disabled style="margin-left: 15px;">
                        <i class="fas fa-cloud-upload-alt"></i> {$LANG.loadButton}
                    </button>
                </div>
                 <span class="dataset-result" id="result-mahalleler" style="display: block; margin-top: 10px;"></span>
            </div>
        </div>
    </div>
</div>

<div class="panel panel-danger btk-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-history"></i> {$LANG.rebuildHistoryTitle}</h3>
    </div>
    <div class="panel-body">
        <div class="alert alert-warning">{$LANG.rebuildHistoryWarning}</div>
        <form id="rebuildHistoryForm" method="post" action="{$modulelink}&action=rebuild_history">
            <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
            <div class="form-inline text-center">
                <div class="form-group">
                    <label for="milat_tarihi" style="margin-right: 10px;"><strong>{$LANG.rebuildHistoryLabel}</strong></label>
                    <input type="text" class="form-control date-picker" id="milat_tarihi" name="milat_tarihi" placeholder="GG/AA/YYYY" style="width: 200px; text-align: center;" required>
                </div>
                <button type="submit" id="rebuildHistoryBtn" class="btn btn-danger btn-lg" disabled style="margin-left: 15px;">
                    <span id="milat_tarihi_span"></span> {$LANG.rebuildHistoryButton}
                </button>
            </div>
        </form>
    </div>
</div>

<script type="text/javascript">
$(document).ready(function() {
    var modulelink_js = '{$modulelink|escape:"javascript"}';
    var csrfToken_js = '{$csrfToken|escape:"javascript"}';
    var csrfTokenName_js = '{$csrfTokenName|escape:"javascript"}';
    var LANG_js = {
        loadingData: '{$LANG.loadingData|escape:"javascript"}',
        dataSetLoading: '{$LANG.dataSetLoading|escape:"javascript"}',
        dataSetLoadSuccess: '{$LANG.dataSetLoadSuccess|escape:"javascript"}',
        dataSetLoadError: '{$LANG.dataSetLoadError|escape:"javascript"}'
    };

    function updateCsrfToken(newToken) {
        if (newToken) {
            csrfToken_js = newToken;
            $('input[name="' + csrfTokenName_js + '"]').val(newToken);
        }
    }

    $('.btn-load-dataset').on('click', function() {
        var $button = $(this);
        var setName = $button.data('set-name');
        var $resultSpan = $('#result-' + setName);
        
        var postData = {
            btk_ajax_action: 'load_data_set',
            set_name: setName
        };
        
        if (setName === 'mahalleler') {
            postData.ilce_kodu = $('#select_ilce_for_mahalle').val();
            if (!postData.ilce_kodu) {
                alert('Lütfen bir ilçe seçin.');
                return;
            }
        }
        
        postData[csrfTokenName_js] = csrfToken_js;

        $button.prop('disabled', true).find('i').removeClass().addClass('fas fa-spinner fa-spin');
        $resultSpan.removeClass('text-success text-danger').html(LANG_js.dataSetLoading);
        $('.btn-load-dataset').not($button).prop('disabled', true);

        $.post(modulelink_js, postData, function(response) {
            if (response && response.status === 'success') {
                $resultSpan.addClass('text-success').html('<i class="fas fa-check-circle"></i> ' + LANG_js.dataSetLoadSuccess);
                setTimeout(function(){ location.reload(); }, 1500);
            } else {
                var message = response.message || LANG_js.dataSetLoadError;
                $resultSpan.addClass('text-danger').html('<i class="fas fa-times-circle"></i> ' + message);
                $button.prop('disabled', false).find('i').removeClass().addClass('fas fa-cloud-upload-alt');
                $('.btn-load-dataset').not($button).prop('disabled', false);
            }
            if (response && response.new_token) {
                updateCsrfToken(response.new_token);
            }
        }, 'json').fail(function() {
            $resultSpan.addClass('text-danger').html('<i class="fas fa-exclamation-triangle"></i> ' + LANG_js.dataSetLoadError);
            $button.prop('disabled', false).find('i').removeClass().addClass('fas fa-cloud-upload-alt');
            $('.btn-load-dataset').not($button).prop('disabled', false);
        });
    });
    
    $('#select_ilce_for_mahalle').on('change', function() {
        var ilceKodu = $(this).val();
        $('#btn-load-mahalle').prop('disabled', !ilceKodu);
    });

    $('#milat_tarihi').on('change keyup', function() {
        var $button = $('#rebuildHistoryBtn');
        var $span = $('#milat_tarihi_span');
        var tarih = $(this).val();

        if (tarih && /^\d{2}\/\d{2}\/\d{4}$/.test(tarih)) {
            $span.text(tarih);
            $button.prop('disabled', false);
        } else {
            $span.text('');
            $button.prop('disabled', true);
        }
    }).trigger('change');
});
</script>