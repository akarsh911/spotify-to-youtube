
if(sessionStorage.getItem('songs0')!=null)
{ //Checking if songs are already present in session Storage
var set;var arraysongs=[];
var loader = document.getElementById("loader");
var table = document.getElementById("songst");
if(sessionStorage.getItem('list')!=null){
  if(sessionStorage.getItem('loop')!=null)
  {
    var list=sessionStorage.getItem('list');
    var i=0;
    if(sessionStorage.getItem('songs'+list)!=null)
    {
      var data=JSON.parse(sessionStorage.getItem('songs'+list));
      var now=parseInt(sessionStorage.getItem('now'));
      var sel=parseInt(sessionStorage.getItem('sel'));
      var total=sessionStorage.getItem('total');
      arraysongs=JSON.parse(sessionStorage.getItem('arraysongs'));
      table.innerHTML =sessionStorage.getItem('allsongs');
      var $foo = $("#tablecon");
      play_name=sessionStorage.getItem("play_name") ;
  play_img=sessionStorage.getItem("play_url");
  document.getElementById("play_image").src=play_img;//playlist image being set
document.getElementById("play_name").innerHTML=play_name+'<br><div id="refer_songs" class="table_title"> hello</div>';
      $foo.scrollTop($foo.scrollTop() + (70*now));
      allsongs2=sessionStorage.getItem('allsongs');
      if(list==0)
      {

        set=data.tracks;
      }
else {
  
    set=data;
    console.log(data);
}

      loop();
    }
  }
}
else{
var sel=0;
var data=JSON.parse(sessionStorage.getItem('songs0'));;
var i=0;
var now=0;
var total=0;
var arraysongs=[];
var allsongs="";
var allsongs2="";
var list=0;
var set;

table.innerHTML="";var play_name="";
handle_data();}
} //After declaring necessary global variables start to handle data

function handle_data()
{ //in this function we handle data from spotify

if(list==0)
{
    set=data.tracks;
}

if(set.total!=undefined)
{ //checking if there are any tracks present
play_name=data.name;//playlist name
var play_img=data.images[0].url;//playlist image
document.getElementById("play_image").src=play_img;//playlist image being set
document.getElementById("play_name").innerHTML=play_name+'<br><div id="refer_songs" class="table_title"> hello</div>';
  var des=data.description;//playlist description from spotify
  sessionStorage.setItem("total_songs",set.total) ;
  sessionStorage.setItem("play_name",play_name) ;
  sessionStorage.setItem("play_url",play_img)
  sessionStorage.setItem("description",des) ;
  total=set.total;//total songs in playlist sel represents selected songs in numbers
  arraysongs.push({"total":total,"sel":sel});
  loop();//starting recursive function so that we can have enough gap for UI changes
}//end of if

}//end of handler function

var link;//decleration once to improve speed

function playlist_creater(songname)
{//this function is responsible for finding youtube playlists
link="not found"; //initiallization required
var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
if (this.readyState == 4 && this.status == 200) {
    
    var data= JSON.parse(this.responseText);
    link=data.items[0].id.videoId;          
      }
else if(this.status=403)
{//check if user limit expired request for new api key if availaible
    link= "error 403";
}
};
key="AIzaSyCwHs3mRuCbBdplocS0RpFwoAF5PCyndZc"; //google api key a secret fetched from server then decrypted in a secret manner
xhttp.open("GET", "https://www.googleapis.com/youtube/v3/search?par=snippet&key="+key+"&type=video&maxResults=1&q="+songname, false);
xhttp.send();
return link;
}//end function


function loadsongfromdatabase(song_query)
{//this function load songs from presaved database 
var resp="";
var objXMLHttpRequest = new XMLHttpRequest();
objXMLHttpRequest.onreadystatechange = function() {
if(objXMLHttpRequest.readyState === 4) {
if(objXMLHttpRequest.status === 200) {
    //if fetch was successful save it in resp and return it later
        resp= objXMLHttpRequest.responseText;
      
} else {
  //fetch failed state error reason
      alert('Error Code: ' +  objXMLHttpRequest.status);
      alert('Error Message: ' + objXMLHttpRequest.statusText);
}
}
}
objXMLHttpRequest.open('GET', './php/find_song.php?song_name='+song_query,false);
objXMLHttpRequest.send();
return resp;
}//end of function


function savesongindatabase(song_query,youtube)
{//this function saves song url found in database for future queries
var objXMLHttpRequest = new XMLHttpRequest();
objXMLHttpRequest.onreadystatechange = function() {
if(objXMLHttpRequest.readyState === 4) {
if(objXMLHttpRequest.status === 200) {

      var resp= objXMLHttpRequest.responseText;
        if(resp=="error")
        {
            console.log(resp);
        }
} else {

      alert('Error Code: ' +  objXMLHttpRequest.status);
      alert('Error Message: ' + objXMLHttpRequest.statusText);
}
}
}
objXMLHttpRequest.open('GET', './php/save_song.php?song_name='+song_query+'&youtube_url='+youtube,false);
objXMLHttpRequest.send();
}



function move(current,total)
{//this functions try to work with preloader bar increment
var elem = document.getElementById("myBar");
var percent = document.getElementById("percentshow");
var msg=document.getElementById("msg");
    percent.innerHTML= Math.round(((current/total)*100)) + "%";
    elem.style.width = Math.round(((current/total)*100)) + "%";
    msg.innerHTML = current  + " of "+total+" completed";
}

function check_click(click_id)
{//this function is responible for row clicks
var box= document.getElementById("chk"+click_id);
var row= document.getElementById("row"+click_id);
if(box.checked)
{
sel--;
row.classList.add("row_uncheck");
box.checked=false;
listchange(click_id,false);
inform_user("One song removed from list")
}
else
{
sel++;
  row.classList.remove("row_uncheck");
box.checked=true;
listchange(click_id,true);
inform_user("One song is added to list");
}
}

function listchange(click_id,yesno)
{
var allsongs= JSON.parse(sessionStorage.getItem("arraysongs"));
allsongs[click_id].take=yesno;
allsongs[0].sel=sel;
document.getElementById("refer_songs").innerHTML=sel+" out of "+ allsongs[0].total+" Songs Selected";
sessionStorage.setItem("arraysongs",JSON.stringify(allsongs));
}

function loop()
{

if(set.items[i]!=undefined)
{
if(set.items[i].track!=undefined)
{

if(set.items[i].track.name!=undefined)
{
  
  if(set.items[i].track.artists[0]!=undefined)
  {
      artist=set.items[i].track.artists[0].name;
  }
  else 
  {
      artist=set.items[i].track.album.artists[0].name;
  }
  var current_item=set.items[i];
  var current_track=current_item.track;
  var year=" "+current_track.album.release_date.substring(0, 4);
  var search=current_track.name+year+" by "+artist;

  var songindata=loadsongfromdatabase(search);
  if(songindata==0)
  {
    
      var videoId=playlist_creater(search);
      if(videoId!="error 403"&&videoId!="none")
      {
        sel++;
          var link="<a class='you_button' target='_blank' rel='noopener noreferrer' href='https://www.youtube.com/watch?v="+videoId+"'><i class='fa fa-youtube' aria-hidden='true'></i></a> <a class='you_button' target='_blank' rel='noopener noreferrer' href='"+set.items[i].track.external_urls.spotify+"'><i class='fa fa-spotify' aria-hidden='true'></i></a> " ;
      savesongindatabase(search,videoId);
      allsongs='<tr class="row" id="row'+(now+1)+'"><th onclick="check_click('+(now+1)+');">'+(now+1)+'</th><th onclick="check_click('+(now+1)+');"><img alt="album image" loading="lazy"  class="imgt" src="'+current_track.album.images[0].url+'"></th><th onclick="check_click('+(now+1)+');">'+current_track.name+'</th><th onclick="check_click('+(now+1)+');">'+artist+'</th><th>'+link+'</th><th onclick="check_click('+(now+1)+');"><input class="checkbox" type="checkbox" checked="checked" onclick="check_click('+(now+1)+');" id="chk'+(now+1)+'"/><label for="chk'+(now+1)+'"> </label></th></tr>';
      
        
      arraysongs.push({"index":now+1,"songname":current_track.name+" by "+artist,"youtubeurl":videoId,"take":true});
      }
      else {
          var link="no link";
        
          allsongs='<tr class="row_disabled" id="row'+(now+1)+'"><th>'+(now+1)+'</th><th><img alt="album image" loading="lazy"  class="img_disabled" src="'+current_track.album.images[0].url+'"></th><th>'+current_track.name+'</th><th>'+artist+'</th><th>'+link+'</th><th><input class="checkbox_disabled" type="checkbox"  id="chk'+(now+1)+'" disabled /><label for="chk'+(now+1)+'"> </label></th></tr>';
              arraysongs.push({"index":now+1,"songname":current_track.name+" by "+artist,"youtubeurl":link,"take":false});
      }
  
  }
  else
  {
    sel++;
      videoId=songindata;
      var link="<a class='you_button' target='_blank' rel='noopener noreferrer' href='https://www.youtube.com/watch?v="+videoId+"'><i class='fa fa-youtube' aria-hidden='true'></i></a> <a class='you_button' target='_blank' rel='noopener noreferrer' href='"+set.items[i].track.external_urls.spotify+"'><i class='fa fa-spotify' aria-hidden='true'></i></a> " ;
      allsongs='<tr class="row" id="'+(now+1)+'row" ><th onclick="check_click('+(now+1)+');">'+(now+1)+'</th><th onclick="check_click('+(now+1)+');"><img alt="album image" loading="lazy"  class="imgt" src="'+set.items[i].track.album.images[0].url+'"></th><th onclick="check_click('+(now+1)+');">'+set.items[i].track.name+'</th><th onclick="check_click('+(now+1)+');">'+artist+'</th><th>'+link+'</th><th onclick="check_click('+(now+1)+');"><input class="checkbox" type="checkbox" checked="checked" onclick="check_click('+(now+1)+');" id="chk'+(now+1)+'"/><label for="chk'+(now+1)+'"> </label></th></tr>';
      arraysongs.push({"index":now+1,"songname":current_track.name+" by "+current_track.album.artists[0].name,"youtubeurl":songindata,"take":true});
  }

  table.innerHTML = table.innerHTML+allsongs;
allsongs2+=allsongs;
move(now,total) ;
  now++;i++;
  $("#myBar").width( (now/total)*100+'%');
  if(i>8){
  var $foo = $("#tablecon");
  $foo.scrollTop($foo.scrollTop() + 50);}
  
  setTimeout(loop, 100);
  }
}
}

else{
  check_comp(list);
}
}
function check_comp(list)
{

if(set.next!=undefined&&set.next!="null")
{
          list++;
          sessionStorage.setItem('list',list);
          sessionStorage.setItem('loop',i);
          sessionStorage.setItem('now',now);
          sessionStorage.setItem('total',total);
          sessionStorage.setItem('arraysongs',JSON.stringify(arraysongs));
          sessionStorage.setItem('sel',sel);
          sessionStorage.setItem('allsongs',allsongs2);
          location.reload();

          console.log(set);

}
else{
sessionStorage.setItem("arraysongs",JSON.stringify(arraysongs) );   
arraysongs[0].sel=sel;
document.getElementById("refer_songs").innerHTML=sel+" out of "+ arraysongs[0].total+" Songs Selected";
loader.classList.add("inv");
$('.alert').css({ top: '25px' });;

if(total-sel!=0)
{
$('.alert').removeClass("hide"); $('.alert').addClass("show");
$('#error').text("Warning! "+(total-sel)+" songs could not be fetched");
}
}
}
$('.close-btn').click(function(){$('.alert').removeClass("show"); $('.alert').addClass("hide");});


function inform_user(message)
{
$('.alert').removeClass("hide");
$('#error').text("Warning! "+message);
$('.alert').addClass("show"); 
setTimeout(function() { 
  $('.alert').removeClass("show");
  $('.alert').addClass("hide");},3000)


}