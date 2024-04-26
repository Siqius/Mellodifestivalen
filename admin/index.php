<?php 

$loggedin = false;
$user = "";
$pass = "";

$mysql_host = "localhost";
$mysql_user = "root";
$mysql_password = "";
$mysql_database = "melodifestivalen";

$url = (empty($_SERVER['HTTPS']) ? 'http' : 'https') . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

if(str_contains($url, 'afa-mello')) {
    $mysql_host = "localhost";
    $mysql_user = "ntigskov_afa-mello";
    $mysql_password = "q8GyQyP;a~nN";
    $mysql_database = "ntigskov_afa-mello";
}

if(!empty(isset($_POST["user"]))) {
    $user = $_POST["user"];
}
if(!empty(isset($_POST["pass"]))) {
    $pass = $_POST["pass"];
}
if($user && $pass) {
    $mysqli = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_database);
    if($mysqli === false){
        die("ERROR: Could not connect. " . $mysqli->connect_error);
    }

    # Set the charset to utf8, create a prepared statement and execute it, we use prepared statements to avoid SQL injections
    $mysqli->set_charset("utf8");

    $SQLquery = "SELECT ID FROM admin WHERE user=? AND pass=?";

    $stmt = $mysqli->prepare($SQLquery);

    $stmt->bind_param("ss",$user,$pass);

    $stmt->execute();

    $ID = $stmt->get_result()->fetch_all(MYSQLI_ASSOC)[0];
    if(!empty($ID["ID"])) {
        $loggedin = true;
    } 
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/admin.css">
    <script src="../js/admin.js" defer></script>
    <title>Admin page</title>
</head>
<body>
    <?php 
    if(!$loggedin) {
        echo '
        <form action="./" method="POST">
            <h2>Log in</h2>
            <input type="text" name="user" placeholder="username">
            <input type="text" name="pass" placeholder="password">
            <button type="submit">Log in</button>
        </form>
        ';
    }else {
        echo '
        <div id="sidebar">
        ';
        echo '
        <div id="createcontender">
            <h2>Lägg till bidrag</h2><br>
            <input type="text" name="artistname" placeholder="Artist namn"><br>
            <input type="text" name="songname" placeholder="Låt namn"><br>
            <input type="text" name="artistimage" placeholder="Imgur länk på artisten"><br>
            <input type="text" name="songurl" placeholder="Låt url"><br>
            <input type="text" name="artistbackground" placeholder="Artist bakgrund"><br>
            <input type="text" name="contest" placeholder="Deltävling"><br>
            <input type="text" name="votes" placeholder="Röster"><br>
            <button type="button" onclick="addContender()">Lägg till</button>
        </div>
        ';

        echo '
        <div id="selectcontest">
            <h2>Välj deltävling</h2><br>
            <button type="button" onclick="retrieveContest(1)">1</button>
            <button type="button" onclick="retrieveContest(2)">2</button>
            <button type="button" onclick="retrieveContest(3)">3</button>
            <button type="button" onclick="retrieveContest(4)">4</button>
        </div>
        ';
        echo '
        </div>
        ';

        echo '
        <div id="content">
            
        </div>
        ';
    }

    ?>
    <footer>
        <div>
            <h1> Mello är riktigt bra <h1>
        </div>
    </footer>
</body>
</html>