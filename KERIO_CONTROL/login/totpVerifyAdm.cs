<?cs if:redirect ?>
	If your browser does not redirect automatically, please click this link: <a href="<?cs var:redirect ?>"><?cs var:redirect ?></a>
<?cs else ?>
	<?cs linclude:"webiface/nonauth/totpVerifyInc.cs" ?>
<?cs /if ?>