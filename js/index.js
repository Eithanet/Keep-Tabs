//open the start overlay
function on_onstart() {
    document.getElementById("overlay").style.visibility = "visible";
}

//close the start overlay
function off_onstart() {
    document.getElementById("overlay").style.visibility = "hidden";
}

//open the qr overlay
function on_qr() {
    document.getElementById("overlay_qr").style.visibility = "visible";
}

//close the qr overlay
function off_qr() {
    document.getElementById("overlay_qr").style.visibility = "hidden";
}

function on_update() {
    document.getElementById("overlay_update").style.visibility = "visible";
}
//open the error overlay
function on_error(error){
  switch(error) {
    case "PAIRING":
    document.getElementById("overlay_text_error").textContent = "No Connection!";
    break;

    case "CONFLICT":
    document.getElementById("overlay_text_error").textContent = "Whatsapp is open in another location! please press the green button:";
    webview.findInPage("השתמש/י כאן");
    webview.findInPage("use here");
    webview.stopFindInPage("activateSelection");
    break;

    case "TIMEOUT":
    document.getElementById("overlay_text_error").textContent = "No Connection!";
    break;
  }
  if(error != "QR") {
  document.getElementById("overlay_error").style.visibility = "visible";
    document.getElementById("overlay_view").style.visibility = "visible";
  } else {
    //console.log("qr relode");
    location.reload();
  }
}

//close the error overlay
function off_error() {
  document.getElementById("overlay_error").style.visibility = "hidden";
  document.getElementById("overlay_view").style.visibility = "hidden";
}
//Interval for the text while Whatsapp is loading
var dots = window.setInterval( function() {
    var wait = document.getElementById("wait");
    if ( wait.innerHTML.length > 3 )
        wait.innerHTML = "";
    else
        wait.innerHTML += ".";
    }, 1000);

//online order - online contacts need to be first
function online_order(id) {
  //old tab - the user currect tab
  //newtab - the user new tab

  // get the tab that the user is in
  var oldtab = document.getElementsByName(id + "_alldiv")[0].parentNode;
  var oldtab_num = document.getElementsByName(id + "_alldiv")[0].parentNode.id.replace('tab','');

  //find the first tab with offline
  for(var i = 0; i<=document.getElementById("tabs").children.length; i++) {
    if(document.getElementById("tab"+i) !== undefined && document.getElementById("tab"+i) !== null) {
    if(document.getElementById("tab"+i).children.offline !== undefined) {
      var newtab = document.getElementById("tab"+i);
      var newtab_num = i;
      break;
    }
  }
}
  var theonline = oldtab.children.online;
  var theoffline = newtab.children.offline;

  //replace and add theoffline
  newtab.replaceChild(theonline,theoffline);
  oldtab.appendChild(theoffline);
}

//move tabs with arrows
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
       // left arrow - back
       next(0,true);
    }
     if (e.keyCode == '39') {
       // right arrow - forword
       next(0,false,true);
    }
}

//next tab
function next(num,back = false,forword = false) {
  if(back == false && forword == false) {
    //x - the tab number user want to go
    // t - the active li in the slider

    //get the tab number that the user want to go
    var x = document.getElementById("tab" + num);

    //get the name for the currect active li in slider to know the tab number
    var t = document.getElementById("active").getAttribute("name");

    //set the currect tab to display:none
    document.getElementById("tab" + t).style.display = "none";

    //set the tab that the user want to go to display:block
    x.style.display = "block";

    //remove the active from the li
    document.getElementById("active").id = "";

    //set active to the new li
    document.getElementsByName(num)[0].id = "active";
  } else {
    //user used the arrow
    if(back == true) {
      //get the name for the currect active li in slider to know the tab number
      var t = document.getElementById("active").getAttribute("name");

      //check if we can go back
      if(t == 0) {
        //its the first tab, we cant go back, exit.
        return;
      } else {
        num = t-1;

        //get the tab number that the user want to go
        var x = document.getElementById("tab" + num);

        //set the currect tab to display:none
        document.getElementById("tab" + t).style.display = "none";

        //set the tab that the user want to go to display:block
        x.style.display = "block";

        //remove the active from the li
        document.getElementById("active").id = "";

        //set active to the new li
        document.getElementsByName(num)[0].id = "active";
      }
    }
    if(forword == true) {
      //get the name for the currect active li in slider to know the tab number
      var t = document.getElementById("active").getAttribute("name");

      //check if we can go forword
      if((parseInt(t)+1) == document.getElementById("tabs").children.length) {
        //we cant, its the last tab, exit.
        return;
      } else {
        num = (parseInt(t)+1);

        //get the tab number that the user want to go
        var x = document.getElementById("tab" + num);

        //set the currect tab to display:none
        document.getElementById("tab" + t).style.display = "none";

        //set the tab that the user want to go to display:block
        x.style.display = "block";

        //remove the active from the li
        document.getElementById("active").id = "";

        //set active to the new li
        document.getElementsByName(num)[0].id = "active";
      }
    }
  }
}
//config vars
var webview = document.getElementById("webview");
var online_to_check = {};
window.id_to_contact = {};
window.contact_to_id = {};

//send notification function
function sendnot(theTitle,theBody) {
  var options = {
    body: theBody,
  };
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var n = new Notification(theTitle,options);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var n = new Notification(theTitle,options);
      }
    });
  }
}

//the no img svg, in part becuse editor gave erros
var noimg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212" style="width: 100%; height: 100%;"><path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path><g fill="#FFF"><path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 ';
noimg += '0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.73';
noimg += '7a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path></g></svg>';

//when Whatsapp stopped loading
webview.addEventListener("did-finish-load", function() {
  //clear the Interval for the loading text
  clearInterval(dots);

  //hide the loading text
  document.getElementById("loading").style.display = "none";

  //mute the webview - becuse of the messages sound
  webview.setAudioMuted(true);

  //overlay for the start
  on_onstart();

  //start checking if we can start checking
  webview.send("checkit");

});

//turn on/off the bell and add/remove from checking list
function change(id) {
  if(id.value != "check") {
    online_to_check[id.getAttribute("name").replace("_alldiv","")] = "true";
    id.value = "check";
    document.getElementById(id.getAttribute("name").replace("_alldiv","")+"_bell").style.display = "block";
  } else {
    online_to_check[id.getAttribute("name").replace("_alldiv","")] = "false";
    id.value = "";
    document.getElementById(id.getAttribute("name").replace("_alldiv","")+"_bell").style.display = "none";
  }
}

//ipc-messages from the webview
webview.addEventListener('ipc-message', event => {
  var count = 0;
  var tabcount = 0;
  var opencount = 0;
  var opentab = false;
  var closetab = false;
  var wrote = 0;

  //the qr event - we got the qr and display it
  if(event.channel == "theqr") {
    document.getElementById("qr_toscan").src = event.args[0];
    //make sure the start overlay is off
    off_onstart();

    //turn on the qr overlay
    on_qr();
    //console.log("qr updated");
  }

  //we can start checking! send all!
  if(event.channel == "start") {
    webview.send('all');
  }

  //we cant start checking
  if(event.channel == "notstart") {
    webview.send('checkit'); // send the event again, if we can it will start from the start event
  }

  //error in Whatsapp, we cant check any more and need to turn on the overlay
  if(event.channel == "error_overlay") {
    switch(event.args[0]) {
      case "PAIRING":
      on_error("PAIRING");
      break;

      case "CONFLICT":
      on_error("CONFLICT");
      break;

      case "TIMEOUT":
      on_error("PAIRING");
      break;

      case "QR":
      on_error("QR");
      break;

    }
  }

  //no more error - we can check again and need to turn off the error over lay
  if(event.channel == "off_error_overlay") {
    off_error();
  }

//get the contacts and write them in tabs in the div tabs
if(event.channel == "contacts") {
//event.args[0] - the contacts list
//event.args[1] - the online list
//event.args[2] - images list

//make sure the overlay for start and qr is off
off_onstart();
off_qr();


//if we dont have the online list or images, we need to request them from the webview
if(event.args[1] === undefined || event.args[2] === undefined) {
  webview.send("all_get_online_array");
  console.log("online is undefined and all_get_online_array was send"); //log it for cheking when there is a problem
} else {
  //we have all what we need - start writing them
  console.log("the var online is exist");
  var contacts = event.args[0];
  var profile_img = event.args[2];

  //loop for every contact
  for (let id in contacts) {
    //if id is undefined - continue
    if(contacts[id].id === undefined) { continue; } else {
      //if its a group, boadcast or a temp (bug in Whatsapp) dont check it, continue
        if(contacts[id].id.search("g.us") != -1 || contacts[id].id.search("broadcast") != -1 || contacts[id].id.search("temp") != -1) {
          continue;
        }
      }
      //if there is no name - continue
      if(contacts[id].name === undefined) { continue; }

      //the div - the tabs div
      var thediv = document.getElementById("tabs");

      //the slider - the ul
      var theslider = document.getElementById("slider");

      //if contact is in the online list
      if(event.args[1].hasOwnProperty(contacts[id].id)) {

        //handeling the tabs
        if(count == 0) {
          var opentab = true;
        } else {
          var opentab = false;
        }

        if(opentab) {
          if(tabcount == 0) {
            // special case, the tab dont need display:none and the li need the id to be active
            thediv.innerHTML += "<div id='tab"+tabcount+"'></div>";
            theslider.innerHTML += "<li id='active' name='0' onclick='next(0)'></li>";
          } else {
            theslider.innerHTML += "<li name='"+tabcount+"' onclick='next("+tabcount+")'></li>";
            thediv.innerHTML += "<div id='tab"+tabcount+"' style='display:none;'></div>";
          }
        }

        //the tab we are going to write to
        var thetab = document.getElementById('tab'+tabcount);

        //if we have the contact in the profile img list
        if(profile_img.hasOwnProperty(contacts[id].id)) {
          //store ids and contacts on window for later
          window.id_to_contact[contacts[id].id] = contacts[id].name;
          window.contact_to_id[contacts[id].name] = contacts[id].id;

          //if there is an imgs
          if(profile_img[contacts[id].id] != null) {
            thetab.innerHTML += "<div class='contact' onclick='change(this);' name='"+contacts[id].id+"_alldiv'><p class='bell' id='"+contacts[id].id+"_bell' style='display: none;'><i class='fas fa-bell'></i></p><div class='profileimg' id='"+contacts[id].id+"_img_div'><img style='width: 100%; height: 100%;' id='"+contacts[id].id+"_img' src='"+profile_img[contacts[id].id]+"' /></div><p>" + contacts[id].name + "<span id='"+contacts[id].id +"_status_text'>Checking..</span></p><div id='"+contacts[id].id +"_status' class='status'></div>";
          } else {
            //if the contact dont have an imgs, use the noimg var (svg)
            thetab.innerHTML += "<div class='contact' onclick='change(this);' name='"+contacts[id].id+"_alldiv'><p class='bell' id='"+contacts[id].id+"_bell' style='display: none;'><i class='fas fa-bell'></i></p><div class='profileimg' id='"+contacts[id].id+"_img_div'><div id='"+contacts[id].id+"_img'>"+noimg+"</div></div><p>" + contacts[id].name + "<span id='"+contacts[id].id +"_status_text'>Checking..</span></p><div id='"+contacts[id].id +"_status' class='status'></div>";
          }
        } else {
          //if the user is not in the img list (bug) - give it a no img and save it
          thetab.innerHTML += "<div class='contact' onclick='change(this);' name='"+contacts[id].id+"_alldiv'><p class='bell' id='"+contacts[id].id+"_bell' style='display: none;'><i class='fas fa-bell'></i></p><div class='profileimg' id='"+contacts[id].id+"_img_div'><div id='"+contacts[id].id+"_img'>"+noimg+"</div></div><p>" + contacts[id].name + "<span id='"+contacts[id].id +"_status_text'>Checking..</span></p><div id='"+contacts[id].id +"_status' class='status'></div>";
          //store ids and contacts on window for later
          window.id_to_contact[contacts[id].id] = contacts[id].name;
          window.contact_to_id[contacts[id].name] = contacts[id].id;
        }

        //haneling the tabs
        if(count == 8) {
          count = 0;
          tabcount++;
          var closetab = true;
        } else {
          var closetab = false;
          count++;
        }

      }
    }
    //start time for know when to show offline or last seen
    window.start_time = parseInt(new Date().getTime() / 1000);

    //start cheking
    webview.send("start_check");

  }
}
//if we dont have the online list or the img list, we requested it from the webview and we need to request checking again
if(event.channel == "online_array") {
var online = {};
var profile_img = {};
var profile_img = event.args[1];
var online = event.args[0];
webview.send("all",online,profile_img);
console.log("online_array, the online var and all was send + img"); //log it if we have a problem, we can find it
}

//there is new online contact
if(event.channel == "new_online") {

//check if we need to notify if he is online
if(online_to_check[event.args[0]] == "true") {
  console.log("online alret"); //log it if we ever need to know if the code know that it need to notify but didnt
  sendnot(window.id_to_contact[event.args[0]] + " Is online!",":D");
}

//try to give online class - some contact is not in the tabs
try {
//if the contact have offline class, we need to remove it
if (document.getElementById(event.args[0] + "_status").classList.contains("offline") || document.getElementsByName(event.args[0] + "_alldiv")[0].classList.contains("offline")) {
  document.getElementById(event.args[0] + "_status_text").textContent = "Online";
  document.getElementById(event.args[0] + "_status").classList.remove("offline");
  document.getElementById(event.args[0] + "_status").classList.add("online");
  document.getElementsByName(event.args[0] + "_alldiv")[0].classList.remove("offline");
  document.getElementsByName(event.args[0] + "_alldiv")[0].classList.add("online");
  document.getElementsByName(event.args[0] + "_alldiv")[0].setAttribute("id", "online");
} else {
  document.getElementById(event.args[0] + "_status").classList.add("online");
  document.getElementsByName(event.args[0] + "_alldiv")[0].classList.add("online");
  document.getElementById(event.args[0] + "_status_text").textContent = "Online";
  document.getElementsByName(event.args[0] + "_alldiv")[0].setAttribute("id", "online");
}
online_order(event.args[0]); //online need to be first
}
//oops! there is no contact in the tab div
catch(err) {
console.log("-----");
console.log(event.args[0] + " online"); //log it
console.log("-----");
}
}

//time conventor with all the times
function timeConverter(time){
var a = new Date((time*1000)+7200);
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var year = a.getFullYear();
var month = months[a.getMonth()];
var date = a.getDate();
var hour = a.getHours();
var min = (a.getMinutes()<10?'0':'') + a.getMinutes();
var sec = a.getSeconds();
var time = hour + ':' + min;
return time;
}

//there is new offline
if(event.channel == "new_offline") {

//try to give offline class - some contact is not in the tabs
try {
  //if the contact have online class, we need to remove it
  if (document.getElementById(event.args[0] + "_status").classList.contains("online") || document.getElementsByName(event.args[0] + "_alldiv")[0].classList.contains("online")) {
    document.getElementById(event.args[0] + "_status").classList.remove("online");
    document.getElementById(event.args[0] + "_status").classList.add("offline");
    document.getElementsByName(event.args[0] + "_alldiv")[0].classList.remove("online");
    document.getElementsByName(event.args[0] + "_alldiv")[0].classList.add("offline");
    document.getElementsByName(event.args[0] + "_alldiv")[0].setAttribute("id", "offline");

    //if we dont know his last seen, we need to write it
    if(event.args[1] == "no") {

      //if its just 3 sec after we started checking, dont show the last seen
      if(event.args[2] < (window.start_time+3)) {
        document.getElementById(event.args[0] + "_status_text").textContent = "Offline";
      } else {
        document.getElementById(event.args[0] + "_status_text").textContent = "Last seen: " + timeConverter(event.args[2]);
      }

    } else {
      document.getElementById(event.args[0] + "_status_text").textContent = "Last seen: " + timeConverter(event.args[2]);
    }

  } else {
    document.getElementById(event.args[0] + "_status").classList.add("offline");
    document.getElementsByName(event.args[0] + "_alldiv")[0].classList.add("offline");

    //if we dont know his last seen, we need to write it
    if(event.args[1] == "no") {

      //if its just 3 sec after we started checking, dont show the last seen
      if(event.args[2] < (start_time+3)) {
        document.getElementById(event.args[0] + "_status_text").textContent = "Offline";
      } else {
        document.getElementById(event.args[0] + "_status_text").textContent = "Last seen: " + timeConverter(event.args[2]);
      }
    } else {
      document.getElementById(event.args[0] + "_status_text").textContent = "Last seen: " + timeConverter(event.args[2]);
    }
    document.getElementsByName(event.args[0] + "_alldiv")[0].setAttribute("id", "offline");
  }
}

//oops! there is no contact in the tab div
catch(err) {
  console.log("-----");
  console.log(event.args[0] + " offline"); //log it
  console.log("-----");
}
}

//if the user have new img
if(event.channel == "new_img") {
if(document.getElementById(event.args[0] + '_img_div') === undefined) {} else {
  if(event.args[1] != null) {
    document.getElementById(event.args[0] + '_img_div').innerHTML = "<img style='width: 100%; height: 100%;' id='"+event.args[0]+"_img' src='"+event.args[1]+"' />";
  } else {
    document.getElementById(event.args[0] + '_img_div').innerHTML = "<div id='"+event.args[0]+"_img'>"+noimg+"</div>";
  }
}
}

}) // and of the webview events
