<?php
	$errorMSG = "";

	//FIRST NAME
	if (empty($_POST["firstName"])) {
		$errorMSG = "First Name is required";
	} else {
		$fname = $_POST["firstName"];
	}
	// LAST NAME
	if (empty($_POST["lastName"])) {
		$errorMSG = "Last Name is required";
	} else {
		$lname = $_POST["lastName"];
	}
	// EMAIL
	if (empty($_POST["email"])) {
		$errorMSG .= "Email is required";
	} else {
		$email = $_POST["email"];
	}
	// PHONE
	if (empty($_POST["phone"])) {
		$errorMSG .= "Phone is required";
	} else {
		$phone = $_POST["phone"];
	}
	// MESSAGE
	if (empty($_POST["message"])) {
		$errorMSG .= "Message is required";
	} else {
		$msg = $_POST["message"];
	}

	$subject = 'Contact Inquiry from Rosella Website';
    
	$EmailTo = "carrier@rosellahtml.com"; // Your domain email

	$headers = "From: noreply@wpthemeverse.com\r\n"; // Use domain email
	$headers .= "Reply-To: " . $email . "\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

	$Body = "<strong>Name:</strong> " . $fname . " ".$lname. "<br>";
	$Body .= "<strong>Email:</strong> " . $email . "<br>";
	$Body .= "<strong>Phone:</strong> " . $phone . "<br>";
	$Body .= "<strong>Message:</strong> " . nl2br($msg) . "<br>";

	$success = mail($EmailTo, $subject, $Body, $headers);

	//Show Message
	if ($success == 1 && $errorMSG == ""){
	   echo "success";
	}else{
		if($errorMSG == "") {
			echo "Something went wrong :(";
		} else {
			echo $errorMSG;
		}
	}

?>