<?php
function encode($str) {
	$str = mb_convert_encoding($str , 'UTF-32', 'UTF-8');
	$chars = unpack("N*", $str); // converts $str to array of character numbers
	return implode("", array_map(function($n) { return "&#$n;"; }, $chars));
}
if ( count($argv) == 1 ) {
	echo "Please provide a string to convert. \n";
	exit;
}
echo encode(implode(" ", array_slice($argv, 1))) . "\n";
?>