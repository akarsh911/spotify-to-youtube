var list=0;var access_token;
if(window.location.search.length>0)
        {
            let error=getError();
            if(error)
            {window.location.href="http://localhost";}
            else
            {
             
                handelRedirect();
            }
        }
     else{
        window.location.href="http://localhost";
     }   

        function handelRedirect()
        {
            
            let code=getCode();
            if(code!=null)
            fetchAccessToken(code);
            else{
                window.location.href="http://localhost";
            }
        }


        function getCode()
        {
            let code=null;
            const querystring=window.location.search;
            if(querystring.length>0)
            {
                const urlParams= new URLSearchParams(querystring);
                code=urlParams.get('code');
                window.history.pushState("","","http://localhost/songs_list");
            }
            else
            {
                window.location.href="http://localhost";
            }
            return code;
        }


        function getError()
        {
            let code=null;
            const querystring=window.location.search;
            if(querystring.length>0)
            {
                const urlParams= new URLSearchParams(querystring);
                code=urlParams.get('error');
              
            }
            return code;
        }

        function fetchAccessToken(code)
      {
        let body="grant_type=authorization_code";
        body+="&code="+code;
        body+="&redirect_uri=http://localhost/songs_list";
        body+="&client_id=ceb2a08c000e483ebbbf457407e42fed";
        body+="&client_secret=52bcdc8d90744f9ebcfec6ea253d2df9";
        callAuthorizationApi(body);
      }


      function callAuthorizationApi(body)
      {
        let xhr= new XMLHttpRequest();
        xhr.open("POST","https://accounts.spotify.com/api/token",true);
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization','Basic '+ btoa("ceb2a08c000e483ebbbf457407e42fed:52bcdc8d90744f9ebcfec6ea253d2df9"));
        xhr.send(body);
        xhr.onload  =handleAuthorizationRespose;
      }
      

      function handleAuthorizationRespose()
      {
        if(this.status==200)
        {
            var data= JSON.parse(this.responseText);
            if(data.access_token!=undefined)
            {
                localStorage.setItem("access_token",data.access_token) ;
            }
            if(data.refresh_token!=undefined)
            {
                localStorage.setItem("refresh_token",data.refresh_token) ;
            }
            let body="limit=50";
            var playlist_url=getCookie  ("playlist_url");
            var call_url="https://api.spotify.com/v1/playlists/"+playlist_url;
         
                callApi(body,"GET",handelapiresponse,call_url);
        }
        else
        {
        
            alert(this.responseText);
        }
      }

      function callApi(body,method,callback,call_url)
      {
       
        let xhr= new XMLHttpRequest();
        xhr.open(method,call_url,true);
        xhr.setRequestHeader('Content-Type','application/json');
        var access_token=localStorage.getItem('access_token');
        xhr.setRequestHeader('Authorization','Bearer '+ access_token);
        xhr.send(body);
        xhr.onload  =callback;
      } 

      function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
       for(let i = 0; i < ca.length; i++) {
               let c = ca[i];
           while (c.charAt(0) == ' ') {
                 c = c.substring(1);
               }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
                }
           }
       return "";
   }

   //this functions handels response from spotify api
   
   function handelapiresponse()
   {
       if(this.status==200)
       {

           var data=JSON.parse(this.response);
           console.log(list+"=====>"+data);
           sessionStorage.setItem('songs'+list,this.responseText);
           /*
           if(list==0)
           {
           
            if(data.tracks.next!=null&&data.tracks.next!=undefined)
            {
             let body="limit=50";           
                 list++;
                 call_url=data.tracks.next;
                 callApi(body,"GET",handelapiresponse,call_url);
            }
           else{
            location.replace('http://localhost/songs');
         }
           }
           else{
            if(data.next!=null&&data.next!=undefined)
            {
             let body="limit=50";
                 list++;
                 call_url=data.next;
                 callApi(body,"GET",handelapiresponse,call_url);
            }
           else{
            location.replace('http://localhost/songs');
         }

         
           }*///remove above code commenting and make it live for more than 100 songs (for premium users)
           location.replace('http://localhost/songs');//remove this line for premium users
   }

   else if(this.status==401){
       //refresh token
       window.location.href="http://localhost";
   }
   else 
   {
       window.location.href="http://localhost";
   }
}
//this next function finds youtube links to spotify songs by song names 

  