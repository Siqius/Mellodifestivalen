<?php 

$mysql_host = "localhost";
$mysql_user = "root";
$mysql_password = "";
$mysql_database = "melodifestivalen";

$url = (empty($_SERVER['HTTPS']) ? 'http' : 'https') . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

if(strpos($url, 'afa-mello')) {
    include './credentials.php';
}
$data = $_POST;

if(!empty(isset($data["addcontender"]))) {
    $mysqli = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_database);
    if($mysqli === false){
        die("ERROR: Could not connect. " . $mysqli->connect_error);
    }

    # Set the charset to utf8, create a prepared statement and execute it, we use prepared statements to avoid SQL injections
    $mysqli->set_charset("utf8");

    $SQLquery = "INSERT INTO bidrag(votes, contest) values(?,?)";

    $stmt = $mysqli->prepare($SQLquery);

    $votes = (int)$data["votes"];
    $stmt->bind_param("ii",$votes,$data["contest"]);

    $stmt->execute();

    $stmt->close();

    $SQLquery = "INSERT INTO artist(artistname,background,image) VALUES(?,?,?)";

    $stmt = $mysqli->prepare($SQLquery);

    $stmt->bind_param("sss",$data["artistname"],$data["artistbackground"],$data["artistimage"]);

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
    $mysqli = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_database);
    if($mysqli === false){
        die("ERROR: Could not connect. " . $mysqli->connect_error);
    }

    # Set the charset to utf8, create a prepared statement and execute it, we use prepared statements to avoid SQL injections
    $mysqli->set_charset("utf8");

    $SQLquery = "DELETE FROM bidrag WHERE ID=?";

    $stmt = $mysqli->prepare($SQLquery);

    $stmt->bind_param("i",$data["ID"]);

    $stmt->execute();

    $stmt->close();

    $SQLquery = "DELETE FROM artist WHERE ID=?";

    $stmt = $mysqli->prepare($SQLquery);

    $stmt->bind_param("i",$data["ID"]);

    $stmt->execute();

    $stmt->close();

    $SQLquery = "DELETE FROM song WHERE ID=?";

    $stmt = $mysqli->prepare($SQLquery);

    $stmt->bind_param("i",$data["ID"]);

    $stmt->execute();

    $stmt->close();

    $mysqli->close();

    echo "SUCCESS";
}

if(!empty(isset($data["retrievecontest"]))) {
    $mysqli = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_database);
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

if(!empty(isset($data["deleteall"]))) {
    
}
?>