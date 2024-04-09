<?php 

$input = file_get_contents('php://input');

$data = json_decode($input,true);

if(!empty(isset($data["addcontender"]))) {
    $mysqli = new mysqli("localhost", "root", "", "melodifestivalen");
    if($mysqli === false){
        die("ERROR: Could not connect. " . $mysqli->connect_error);
    }

    # Set the charset to utf8, create a prepared statement and execute it, we use prepared statements to avoid SQL injections
    $mysqli->set_charset("utf8");

    $SQLquery = "INSERT INTO bidrag(votes, contest) values(?,?)";

    $stmt = $mysqli->prepare($SQLquery);

    $votes = 0;
    $stmt->bind_param("ii",$votes,$data["contest"]);

    $stmt->execute();

    $stmt->close();

    $SQLquery = "INSERT INTO artist(artistname,background) VALUES(?,?)";

    $stmt = $mysqli->prepare($SQLquery);

    $stmt->bind_param("ss",$data["artistname"],$data["artistbackground"]);

    $stmt->execute();

    $stmt->close();

    $SQLquery = "INSERT INTO song(songname,url) VALUES(?,?)";

    $stmt = $mysqli->prepare($SQLquery);

    $stmt->bind_param("ss",$data["songname"],$data["songurl"]);

    $stmt->execute();

    $stmt->close();

    $mysqli->close();
}

if(!empty(isset($data["deletecontender"]))) {
    $mysqli = new mysqli("localhost", "root", "", "melodifestivalen");
    if($mysqli === false){
        die("ERROR: Could not connect. " . $mysqli->connect_error);
    }

    # Set the charset to utf8, create a prepared statement and execute it, we use prepared statements to avoid SQL injections
    $mysqli->set_charset("utf8");

    $SQLquery = "DELETE FROM bidrag, artist, song WHERE ID=?";

    $stmt = $mysqli->prepare($SQLquery);

    $stmt->bind_param("i",$data["deletecontender"]);

    $stmt->execute();

    $stmt->close();

    $mysqli->close();
}

if(!empty(isset($data["retrievecontest"]))) {
    $mysqli = new mysqli("localhost", "root", "", "melodifestivalen");
    if($mysqli === false){
        die("ERROR: Could not connect. " . $mysqli->connect_error);
    }

    # Set the charset to utf8, create a prepared statement and execute it, we use prepared statements to avoid SQL injections
    $mysqli->set_charset("utf8");

    $SQLquery = "SELECT *
    FROM bidrag
    JOIN artist ON bidrag.ID = artist.ID
    JOIN song ON bidrag.ID = song.ID
    WHERE contest=?";

    $stmt = $mysqli->prepare($SQLquery);

    $stmt->bind_param("i",$data["contest"]);

    $stmt->execute();

    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    echo json_encode($result);
}
?>