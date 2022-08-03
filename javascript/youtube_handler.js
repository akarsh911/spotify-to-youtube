let acess=null;var loader = document.getElementById("loader");
alert(sessionStorage.getItem("playlist"));
if(sessionStorage.getItem("playlist")!=null)
{

var text = window.location.hash;
acess =text.substring(text.indexOf("=")+1,text.indexOf("&tok"));
window.history.pushState("","","http://localhost/playlist");
   if(text==undefined||text==""||acess=="")
   {
    window.location.href="http://localhost";
   }     
title="spotify playlist-"+sessionStorage.getItem("play_name");
description= "playlist created from spotify to youtube converter"+sessionStorage.getItem("description");
      
var body={
snippet: {
  title: title,
  description:description,
  resourceId: {
    kind: "youtube#video",
    videoId: "3df1s9bPBnc"
  
    }},
status: {
  privacyStatus: "public"
}


};

var body2=JSON.stringify(body);
var id=null;
var xhr = new XMLHttpRequest();

xhr.open('POST',
  'https://youtube.googleapis.com/youtube/v3/playlists?key=AIzaSyCwHs3mRuCbBdplocS0RpFwoAF5PCyndZc&part=snippet,status',false );
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.setRequestHeader("Authorization","Bearer "+acess);
  
  xhr.onreadystatechange = function (e) {
    var data=JSON.parse(xhr.response);
    id=data.id;
    console.log(xhr.response);
  } ;
xhr.send(body2);

var index=1;
var allsongs= JSON.parse(sessionStorage.getItem("arraysongs"));
add_video(id,index,allsongs);}
else{
  var divlink=document.getElementById("link");
  divlink.value=sessionStorage.setItem("playlist",link);;
  
loader.classList.add("inv");

}
function add_video()
{   

if(index<=allsongs[0].total)
{
if(id!=null&&allsongs[index].youtubeurl!=undefined&&allsongs[index].take==true)
{
var xhr = new XMLHttpRequest();
body={
"snippet": {
  "playlistId": id,
  "resourceId": {
    "kind": "youtube#video",
    "videoId": allsongs[index].youtubeurl
  }
}
};
body2=JSON.stringify(body);
xhr.open('POST',
   'https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyCwHs3mRuCbBdplocS0RpFwoAF5PCyndZc&part=snippet',false );
   xhr.setRequestHeader("Content-Type","application/json");
   xhr.setRequestHeader("Authorization","Bearer "+acess);
   
   xhr.onreadystatechange = function (e) {
     var data=JSON.parse(xhr.response);
     if(this.status==200)
     {
   
     }
   } ;
xhr.send(body2);

}
++index;
move(index,allsongs[0].total);
setTimeout(add_video, 100);
}
else{
  next_step();
}

}
function next_step()
{

var link="https://www.youtube.com/playlist?list="+id;
var divlink=document.getElementById("link");
divlink.value=link;
loader.classList.add("inv");
sessionStorage.setItem("playlist",link);
}

function move(current,total) {
  console.log("in move at "+Math.round(((current/total)*100)) + "%");
  var elem = document.getElementById("myBar");
  var percent = document.getElementById("percentshow");
  var msg=document.getElementById("msg");
      percent.innerHTML= Math.round(((current/total)*100)) + "%";
      elem.style.width = Math.round(((current/total)*100)) + "%";
   
      console.log( elem.offsetWidth);
      msg.innerHTML = current  + " of "+total+" completed";

}
function copy()
{
  var copyText = document.getElementById("link");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

   /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);
}