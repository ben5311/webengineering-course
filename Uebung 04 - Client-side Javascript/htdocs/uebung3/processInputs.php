<?php

require __DIR__ . '/vendor/autoload.php';

setcookie('last_visit', date(DateTime::RFC3339));

if (!isset($_REQUEST['mail']) || !filter_var($_REQUEST['mail'], FILTER_VALIDATE_EMAIL)) {
    echo 'ERROR: input email is not valid';
    return;
}
if (!isset($_REQUEST['password'])) {
    echo 'ERROR: password not set';
    return;
}
if (!isset($_REQUEST['status'])) {
    echo 'ERROR: status not set';
    return;
}

$mail = $_REQUEST['mail'];
$password = $_REQUEST['password'];
$status = $_REQUEST['status'];

class Pair
{
    public $key;
    public $value;

    public function __construct($key, $value)
    {
        $this->key = $key;
        $this->value = $value;
    }
}

$cookies = array();
foreach ($_COOKIE as $key => $value) {
    array_push($cookies, new Pair($key, $value));
}

$templateEngine = new Mustache_Engine;
$template = file_get_contents('./templates/loginConfirmation.mustache');
$templateArgs = array(
    'title' => 'Login Confirmation',
    'mail' => $mail,
    'password' => $password,
    'status' => $status,
    'cookies' => $cookies
);
echo $templateEngine->render($template, $templateArgs);
