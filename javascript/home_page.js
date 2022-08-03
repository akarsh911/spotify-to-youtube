function get_form_data()
{
  const url=document.querySelector('#spotify_url');
  var val=url.value;
  var url_array=val.split("https://open.spotify.com/playlist/");
 
  if(url_array[0]!=""||url_array=="")
  {
    alert("not a valid spotify url")
  }
  else
  {
    var url_extra=url_array[1].split("?");
    WriteCookie("playlist_url",url_extra[0])
    let url2="https://accounts.spotify.com/authorize";
    url2+= "?client_id=ceb2a08c000e483ebbbf457407e42fed";
    url2+="&response_type=code";
    url2+='&redirect_uri='+encodeURI("http://localhost/songs_list");
    url2+="&show_dialog=false";
    url2+="&scope=user-read-private"
    window.location.href=url2;

  }
 
}
function WriteCookie(cookiename,cookievalue) {
     var now = new Date();
     var minutes = 30;
     now.setTime(now.getTime() + (minutes * 60 * 1000));
     document.cookie=cookiename + "=" + cookievalue;
     document.cookie = "expires=" + now.toUTCString() + ";"
}
sessionStorage.clear();
localStorage.clear();