<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit('Ongeldige aanvraag.');
}

$configPath = __DIR__ . '/config.local.php';

if (!file_exists($configPath)) {
    die('config.local.php ontbreekt.');
}

$config = require $configPath;

require __DIR__ . '/vendor/phpmailer/phpmailer/src/Exception.php';
require __DIR__ . '/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require __DIR__ . '/vendor/phpmailer/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

$to = 'info@boldandbrighttattoos.nl';
$from = 'info@boldandbrighttattoos.nl';

$fullname = trim($_POST['fullname'] ?? '');
$email = trim($_POST['emailaddress'] ?? '');
$subjectLine = trim($_POST['inquiry_type'] ?? 'Nieuw contactformulier bericht');
$messageText = trim($_POST['message'] ?? '');

if ($fullname === '' || $email === '' || $subjectLine === '' || $messageText === '') {
    exit('Vul alle verplichte velden in.');
}

$message = "Naam: {$fullname}\n";
$message .= "Email: {$email}\n";
$message .= "Onderwerp: {$subjectLine}\n\n";
$message .= "Bericht:\n{$messageText}\n";

try {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port = $config['smtp_port'];

    $mail->CharSet = 'UTF-8';
    $mail->setFrom($from, 'Bold & Bright Tattoo');
    $mail->addAddress($to);

    if ($email !== '') {
        $mail->addReplyTo($email, $fullname);
    }

    $mail->Subject = $subjectLine;
    $mail->Body = $message;

    $uploadErrors = [];
    
    if (!empty($_FILES['reference_images']['name'][0])) {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        $maxFileSize = 8 * 1024 * 1024;
        $maxFiles = 5;

        if (count($_FILES['reference_images']['name']) > $maxFiles) {
            $uploadErrors[] = "Je kunt maximaal {$maxFiles} foto's uploaden.";
        }

        foreach ($_FILES['reference_images']['tmp_name'] as $index => $tmpName) {

            $fileError = $_FILES['reference_images']['error'][$index] ?? UPLOAD_ERR_NO_FILE;
            $fileName = $_FILES['reference_images']['name'][$index] ?? '';
            $fileSize = $_FILES['reference_images']['size'][$index] ?? 0;

            if ($fileError !== UPLOAD_ERR_OK || $fileName === '') {
                continue;
            }

            if ($fileSize > $maxFileSize) {
                $uploadErrors[] = $fileName . " is te groot. Max 8 MB per foto.";
                continue;
            }

            $fileType = mime_content_type($tmpName);

            if (!in_array($fileType, $allowedTypes, true)) {
                $uploadErrors[] = $fileName . " is geen geldig bestandstype.";
                continue;
            }

            $mail->addAttachment($tmpName, $fileName);
        }
    }

    if (!empty($uploadErrors)) {
        exit(implode('<br>', $uploadErrors));
    }

    $mail->send();

    echo 'Thanks! Je bericht is verzonden. Ink incoming!';
} catch (Exception $e) {
    http_response_code(500);
    echo 'Er ging iets mis bij het verzenden van je bericht.';
}

?>
