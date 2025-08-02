<?php 
$imgSrc      =  "turkhost-logo.png";
/*
 function binaryImages($imgSrc,$width = null,$height = null){
 //   $img_src = $imgSrc;
   // $imgbinary = fread(fopen($img_src, "r"), filesize($img_src));
    $img_str = base64_encode(file_get_contents($imgSrc));
	return '<img alt="Firma Logo" style="margin-top: 5px; margin-left: 0px; margin-right: 0px;margin-bottom: -30px" src="data:image/png;base64,'.$img_str.'"/>';
//	echo $img_str;

	//	echo base64_encode(file_get_contents($imgSrc));
 }
 */
//  binaryImages($imgSrc,200,44); 
  function xsltGetir()
  {
  $xslt =  base64_encode(file_get_contents(dirname( __FILE__ ) .'/AAA2016000010000.xslt'));
  
  
  return $xslt;
    }
	//echo xsltGetir();
  