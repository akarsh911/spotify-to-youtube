<?php
$song_name=$_GET["song_name"];
$song_name=str_replace('"', "", $song_name);
$song_name=str_replace("'", "", $song_name);
$conn=OpenCon();
$sql="SELECT youtube_url FROM song_list_table WHERE song_name='$song_name'";
$result = $conn->query($sql);
if ($result->num_rows > 0) {

while($row = $result->fetch_assoc()) {
echo $row["youtube_url"];
}
 } 
 else {
  echo 0;
  }
  CloseCon($conn);
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
?>