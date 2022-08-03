var sel=0;var data;var i=0;var now=0;var total=0;var arraysongs=[];var allsongs="";var loader = document.getElementById("loader");var table = document.getElementById("songst");
table.innerHTML="";var play_name="";
handle_data();
function handle_data()
{
    var sodata=JSON.parse(sessionStorage.getItem('songs'));
    console.log(sodata);
    data=sodata;
    if(data.tracks.total!=undefined)
    {
      play_name=data.name;
      var play_img=data.images[0].url;
      document.getElementById("play_image").src=play_img;
      document.getElementById("play_name").innerHTML=play_name+'<br><div id="refer_songs" class="table_title"> hello</div>';
      var des=data.description;
        sessionStorage.setItem("total_songs",data.tracks.total) ;
        sessionStorage.setItem("play_name",play_name) ;
        sessionStorage.setItem("description",des) ;
        total=data.tracks.total;
        arraysongs.push({"total":total,"sel":sel});
        loop();

    }
    
}
function playlist_creater(songname)
{
  var link="not found";
  var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          
          var data= JSON.parse(this.responseText);
          link=data.items[0].id.videoId;
          console.log(data.items[0].id.videoId);
           
           }
      else if(this.status=403)
      {
          link= "error 403";
      }
      };
      xhttp.open("GET", "https://www.googleapis.com/youtube/v3/search?par=snippet&key=AIzaSyBXAAmAkgeiZXckt3CmySVMdOLapKwRBIg&type=video&maxResults=1&q="+songname, false);
      xhttp.send();
      return link;
}
//next these functions work after finding all links to verify google login to move forward

/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */

  
  function loadsongfromdatabase(song_query)
  {
      var resp="";
      var objXMLHttpRequest = new XMLHttpRequest();
    objXMLHttpRequest.onreadystatechange = function() {
    if(objXMLHttpRequest.readyState === 4) {
      if(objXMLHttpRequest.status === 200) {
  
             resp= objXMLHttpRequest.responseText;
           
      } else {
      
            alert('Error Code: ' +  objXMLHttpRequest.status);
            alert('Error Message: ' + objXMLHttpRequest.statusText);
      }
    }
    }
    objXMLHttpRequest.open('GET', './php/find_song.php?song_name='+song_query,false);
    objXMLHttpRequest.send();
    return resp;
  }
  function savesongindatabase(song_query,youtube)
  {
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
  
  //this functions try to work with loader 
  
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

  function check_click(click_id)
  {
    var box= document.getElementById("chk"+click_id);
    var row= document.getElementById(click_id+"row");
    if(box.checked)
    {
      sel--;
     row.classList.add("row_uncheck");
     box.checked=false;
     listchange(click_id,false);
    }
    else
    {
      sel++;
        row.classList.remove("row_uncheck");
     box.checked=true;
     listchange(click_id,true);
    }
  }
 function row_click(click_id)
  {
    var box= document.getElementById("chk"+click_id);
    var row= document.getElementById(click_id+"row");
    if(box.checked)
    {
      sel--;
     row.classList.add("row_uncheck");
     box.checked=false;
     listchange(click_id,false);
    }
    else
    {
      sel++;
        row.classList.remove("row_uncheck");
     box.checked=true;
     listchange(click_id,true);
    }
  }
  function listchange(click_id,yesno)
  {
    var allsongs= JSON.parse(sessionStorage.getItem("arraysongs"));
    allsongs[click_id].take=yesno;
    console.log(allsongs[click_id]);
    allsongs[0].sel=sel;
    document.getElementById("refer_songs").innerHTML=sel+" out of "+ allsongs[0].total+" Songs Selected";
    sessionStorage.setItem("arraysongs",JSON.stringify(allsongs));
  }
  function loop()
  {
    if(data.tracks.items[i]!=undefined)
    {
    if(data.tracks.items[i].track!=undefined)
    {
     
    if(data.tracks.items[i].track.name!=undefined)
    {
        
        if(data.tracks.items[i].track.artists[0]!=undefined)
        {
            artist=data.tracks.items[i].track.artists[0].name;
        }
        else 
        {
            artist=data.tracks.items[i].track.album.artists[0].name;
        }
        
        var year=" "+data.tracks.items[i].track.album.release_date.substring(0, 4);
        var search=data.tracks.items[i].track.name+year+" by "+artist;

        var songindata=loadsongfromdatabase(search);
        if(songindata==0)
        {
          
            var videoId=playlist_creater(search);
            if(videoId!="error 403"&&videoId!="none")
            {
              sel++;
        var link="<a class='you_button' target='_blank' rel='noopener noreferrer' href='https://www.youtube.com/watch?v="+videoId+"'><i class='fa fa-youtube' aria-hidden='true'></i></a> <a class='you_button' target='_blank' rel='noopener noreferrer' href='"+data.tracks.items[i].track.external_urls.spotify+"'><i class='fa fa-spotify' aria-hidden='true'></i></a> " ;
            savesongindatabase(search,videoId);
            allsongs='<tr class="row" id="row'+(now+1)+'" onclick="row_click('+(now+1)+');"><th>'+(now+1)+'</th><th><img alt="album image" loading="lazy"  class="imgt" src="'+data.tracks.items[i].track.album.images[0].url+'"></th><th>'+data.tracks.items[i].track.name+'</th><th>'+artist+'</th><th>'+link+'</th><th><input class="checkbox" type="checkbox" checked="checked" onclick="check_click('+(now+1)+');" id="chk'+(now+1)+'"/><label for="chk'+(now+1)+'"> </label></th></tr>';
           
             
            arraysongs.push({"index":now+1,"songname":data.tracks.items[i].track.name+" by "+artist,"youtubeurl":videoId,"take":true});
            }
            else {
                var link="no link";
          
                allsongs='<tr class="row_disabled" id="row'+(now+1)+'"><th>'+(now+1)+'</th><th><img alt="album image" loading="lazy"  class="img_disabled" src="'+data.tracks.items[i].track.album.images[0].url+'"></th><th>'+data.tracks.items[i].track.name+'</th><th>'+artist+'</th><th>'+link+'</th><th><input class="checkbox_disabled" type="checkbox"  id="chk'+(now+1)+'" disabled /><label for="chk'+(now+1)+'"> </label></th></tr>';
                    arraysongs.push({"index":now+1,"songname":data.tracks.items[i].track.name+" by "+artist,"youtubeurl":link,"take":false});
            }
        
        }
        else
        {
          sel++;
            videoId=songindata;
            var link="<a class='you_button' target='_blank' rel='noopener noreferrer' href='https://www.youtube.com/watch?v="+videoId+"'><i class='fa fa-youtube' aria-hidden='true'></i></a> <a class='you_button' target='_blank' rel='noopener noreferrer' href='"+data.tracks.items[i].track.external_urls.spotify+"'><i class='fa fa-spotify' aria-hidden='true'></i></a> " ;
            allsongs='<tr class="row" id="'+(now+1)+'row" onclick="row_click('+(now+1)+');"><th>'+(now+1)+'</th><th><img alt="album image" loading="lazy"  class="imgt" src="'+data.tracks.items[i].track.album.images[0].url+'"></th><th>'+data.tracks.items[i].track.name+'</th><th>'+artist+'</th><th>'+link+'</th><th><input class="checkbox" type="checkbox" checked="checked" onclick="check_click('+(now+1)+');" id="chk'+(now+1)+'"/><label for="chk'+(now+1)+'"> </label></th></tr>';
            arraysongs.push({"index":now+1,"songname":data.tracks.items[i].track.name+" by "+data.tracks.items[i].track.album.artists[0].name,"youtubeurl":songindata,"take":true});
        }

        table.innerHTML = table.innerHTML+allsongs;
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
       check_comp();
    }
  }
  function check_comp()
  {
    if(data.next!=undefined&&data.next!="null")
    {
                let body="limit=50";
                callApi(body,"GET",handelapiresponse,data.next);
      
    }
    else{
                      
        sessionStorage.setItem("arraysongs",JSON.stringify(arraysongs) );
        console.log(arraysongs);
    }  
    arraysongs[0].sel=sel;
    document.getElementById("refer_songs").innerHTML=sel+" out of "+ arraysongs[0].total+" Songs Selected";
   loader.classList.add("inv");
  }
 