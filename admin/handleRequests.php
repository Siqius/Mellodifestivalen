<?php 

$data = file_get_contents('php://input');

$data = json_decode($data,true);

if(!empty(isset($data["addcontender"]))) {
    $mysqli = new mysqli("localhost", "root", "", "melodifestivalen");
    if($mysqli === false){
        die("ERROR: Could not connect. " . $mysqli->connect_error);
    }

    # Set the charset to utf8, create a prepared statement and execute it, we use prepared statements to avoid SQL injections
    $mysqli->set_charset("utf8");

    $SQLquery = "INSERT INTO bidrag(votes) values(?)";

    $stmt = $mysqli->prepare($SQLquery);

    $stmt->bind_param("i",0);

    $stmt->execute();

    $stmt->close();

    $SQLquery = "INSERT INTO "
}
?>