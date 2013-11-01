<?php
if($_REQUEST['username'] == "admin" && $_REQUEST['password'] == "admin") {
	$result['status'] = "pass";
} else {
	$result['status'] = "failure";
}

print json_encode($result);
?>