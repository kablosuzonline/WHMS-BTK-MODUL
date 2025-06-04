<style>
    .login-form
    {
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
    }

    .login-form .row
    {
        margin-left: 0;
        margin-right: 0;
    }

    .login-form
    {
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
    }

    .login-form .row
    {
        margin-left: 0;
        margin-right: 0;
    }
</style>
<main class="login-form">
    <div class="cotainer">
        <div class="row justify-content-center">
            <div class="col-md-offset-3 col-md-6">
                <div class="card">
                    <div class="card-header" style="text-align: center">
                        <h4>{$lang.TwoFactorAuthenticationRequired}</h4>
                    </div>
                    <div class="card-body">
                        {if $error}
                            <div class="alert alert-danger">{$lang.Errorcodeiswrong}</div>
                        {/if}
                        <form action="" method="post">
                            <div class="form-group row">
                                <label for="verify_code" style="padding: 5px;text-align: right" class="col-md-4 col-form-label text-md-right">{$lang.VerifyCode}</label>
                                <div class="col-md-6">
                                    <input type="text" id="verify_code" class="form-control" name="code" required autofocus>
                                </div>
                            </div>

                            <div class="col-md-12" style="text-align: center">
                                <button type="submit" class="btn btn-success">
                                    {$lang.Verify}
                                </button>
                                <a href="logout.php" class="btn btn-link">
                                    {$lang.Logout}
                                </a>
                            </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</main>