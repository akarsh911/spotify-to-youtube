<?php
function OpenCon()
{
$dbhost = "localhost";
$dbuser = "connection";
$dbpass = "ork9Ld-dB7A3p(6M";
$db = "playlist_converter";
$conn = new mysqli($dbhost, $dbuser, $dbpass,$db) or die("Connect failed: %s\n". $conn -> error);

return $conn;
}

function CloseCon($conn)
{
$conn -> close();
}


    $song_name=$_GET["song_name"];
    $song_name=str_replace('"', "", $song_name);
$song_name=str_replace("'", "", $song_name);
    $youtube_url=$_GET["youtube_url"];
 
    $conn=OpenCon();
$sql = "INSERT INTO song_list_table (song_name,youtube_url) VALUES ('$song_name', '$youtube_url')";

if ($conn->query($sql) === TRUE) {
  echo "1";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
Closecon($conn);
?>