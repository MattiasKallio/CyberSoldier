function FBConnect()
 {
if(window.plugins.childBrowser == null)
{
    ChildBrowser.install();
}
 }

FBConnect.prototype.connect = function(client_id,redirect_uri,display)
{
 this.client_id = client_id;
 this.redirect_uri = redirect_uri;

 var authorize_url  = "https://graph.facebook.com/oauth/authorize?";
    authorize_url += "client_id=" + client_id;
    authorize_url += "&redirect_uri=" + redirect_uri;
    authorize_url += "&display="+ ( display ? display : "touch" );
    authorize_url += "&type=user_agent";

     var ref = window.open(authorize_url, 'random_string', 'location=no');
     ref.addEventListener('loadstart', function(event) {
                     //console.log(event.type + ' - ' + event.url);
} );
ref.addEventListener('loadstop', function(event) {
    var access_token = event.url.split("access_token=")[1];
    var error_reason = event.url.split("error_reason=")[1];

     if(access_token != undefined){
           access_token = access_token.split("&")[0];
           loginWithFacebookUserInfo(access_token);
         setTimeout(function() {
                    ref.close();
                    }, 5000);

     }
     if(error_reason != undefined){

          window.location.href = "register.html";
          setTimeout(function() {
                    ref.close();
                    }, 5000);
     }
        //console.log(event.url); alert(event.type + ' - ' + event.url);

 } );
 ref.addEventListener('exit', function(event) {
                     //console.log(event.type);
} );  

}
