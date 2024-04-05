<?php 

$loggedin = false;
$user = "";
$pass = "";

if(!empty(isset($_POST["user"]))) {
    $user = $_POST["user"];
}
if(!empty(isset($_POST["pass"]))) {
    $user = $_POST["pass"];
}

if($user && $pass) {
    //make sqli statement
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
        <form action="./index.php" method="POST">
            <input type="text" name="user" placeholder="username">
            <input type="text" name="pass" placeholder="password">
            <button type="submit">Log in</button>
        </form>';
    }else {

        echo '
        <div id="createcontender">
            <h2>Lägg till bidrag</h2><br>
            <input type="text" name="artistname" placeholder="Artist namn"><br>
            <input type="text" name="songname" placeholder="Låt namn"><br>
            <input type="text" name="songurl" placeholder="Låt url"><br>
            <input type="text" name="artistbackground" placeholder="Artist bakgrund"><br>
            <input type="text" name="contest" placeholder="Deltävling"><br>
            <button type="button" onclick="addContender()">Lägg till</button>
        </div>
        ';

    }

    
    

    ?>

    

</body>
</html>