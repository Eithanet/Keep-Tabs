document.addEventListener("DOMContentLoaded", function(event) {

  //var config + electron ipcRenderer
  const {ipcRenderer} = require('electron');
  var online = {};
  var online2 = {};
  var profile_img = {};
  var lastseen = {};

  //Some notes..
  //window.Store.Stream.info - "PAIRING" - מנסה להתחבר למכשיר הטלפון
  //window.Store.Stream.info - TIMEOUT - lost connection
  //window.Store.Stream.mode - "CONFLICT" - ווצאפ פתוח בעוד מקום
  //window.Store.Stream.info - "NORMAL" - הכל נורמאלי ועובד
  //window.Store.Stream.mode - "MAIN" - הכל נטען, לא אומר אבל אם יש בעיה
  //window.Store.Stream.mode - "QR" - צריך לסרוק קוד qr

  //check if we can start checking
  ipcRenderer.on('checkit', function(){
  if(window.Store.Stream.mode == "MAIN" && window.Store.Stream.info == "NORMAL") {
    ipcRenderer.sendToHost("start");
  } else {
    ipcRenderer.sendToHost("notstart");
  }

  //if we need qr to start
  if(window.Store.Stream.mode == "QR") {
      needqr();
  }
  });

  //start checking, loop is started
  ipcRenderer.on('start_check', function(){
  //set Interval in a var, so we can disable it
  var theloop = setInterval(CheckContacts, 1000);
  });

  //give the contacts to the host
  ipcRenderer.on('all', function(event,data,imgs){
  if(needqr() == false) { //if we dont need to scan qr
  if(data === undefined || imgs === undefined) {
  //we dont have online list or imgs
  console.log("data or imgs is undefined");
  //send it to the host, host will send another event and we will get it
  ipcRenderer.sendToHost("contacts",Store.Contact.toJSON());
  } else {
    //everything is ok
    console.log("there is data and imgs");
    ipcRenderer.sendToHost("contacts",Store.Contact.toJSON(), data, imgs);
  }
  } else {
    return; //we need qr code
  }
  });

  //host need the online list, CheckContacts on false will return it
  ipcRenderer.on('all_get_online_array', function(){
    CheckContacts('false');
    console.log("all_get_online_array ran the CheckContacts on false");
  });

  //host need the qr code
  ipcRenderer.on('checkqr', function(){
    needqr();
    //console.log("need qr");
  });

  //function to know if we need qr, and if we need, it will send it to the host
  function needqr() {
    if(window.Store.Stream.mode == "QR") {
      //console.log("mode is qr");
      var qr_imgdata = document.getElementsByClassName("_2EZ_m")[0].getElementsByTagName('img')[0].src;
      ipcRenderer.sendToHost("theqr",qr_imgdata);
      //console.log("the qr is sent");
      return true;
    } else {
      return false;
    }
  }

  //Check the contacts
  function CheckContacts(send = "true") {

    //Some notes..
    //window.Store.Stream.info - "PAIRING" - מנסה להתחבר למכשיר הטלפון
    //window.Store.Stream.info - TIMEOUT - lost connection
    //window.Store.Stream.mode - "CONFLICT" - ווצאפ פתוח בעוד מקום
    //window.Store.Stream.info - "NORMAL" - הכל נורמאלי ועובד
    //window.Store.Stream.mode - "MAIN" - הכל נטען, לא אומר אבל אם יש בעיה
    //window.Store.Stream.mode - "QR" - צריך לסרוק קוד qr

    //if there is no connection
    if (window.Store.Stream.info == "TIMEOUT") {
      ipcRenderer.sendToHost("error_overlay","TIMEOUT");
      return;
    } else {
      ipcRenderer.sendToHost("off_error_overlay");
    }

    //whatsapp web is open in a nother location
    if (window.Store.Stream.mode == "CONFLICT") {
      ipcRenderer.sendToHost("error_overlay","CONFLICT");
      return;
    } else {
      ipcRenderer.sendToHost("off_error_overlay");
    }

    //need to scan the qr code
    if (window.Store.Stream.mode == "QR") {
      ipcRenderer.sendToHost("error_overlay","QR");
      console.log("error");
      return;
    } else {
      ipcRenderer.sendToHost("off_error_overlay");
    }

    //phone still paring
    if (window.Store.Stream.info == "PAIRING") {
      ipcRenderer.sendToHost("error_overlay","PAIRING");
      return;
    } else {
      ipcRenderer.sendToHost("off_error_overlay");
    }

    //start checking every contact
    window.Store.Presence.toArray().forEach(function(user) {
      if (!user || !user.id) {
        return console.log("there is no user or user id");
      }

      //check if its a group, boardcast or temp (bug in Whatsapp)
      if (user.id.search("g.us") != -1 || user.id.search("broadcast") != -1 || user.id.search("temp") != -1) {
        return;
      }

      //subscribe for updates
      if (!user.isSubscribed) {
        user.subscribe();
      }

      //check if user isOnline is undefined
      if (user.isOnline === undefined) {
        return console.log("user isOnline is undefined");
      }

      //if we are need to send every thing to the host
      if (send == "true") {
        //if there is change in online status
        if (online[user.id] != user.isOnline) {
          //update the online list
            online[user.id] = user.isOnline;

          if (user.isOnline === true) {
            //send the host that there is new online
            ipcRenderer.sendToHost("new_online", user.id);
          } else {
            //if we cant see the last seen/the contact dont have
            if (user.chatstate.__x_t === undefined || user.chatstate.__x_t == 0) {
              ipcRenderer.sendToHost("new_offline", user.id, "no", parseInt(new Date().getTime() / 1000)); //this time
            } else {
              ipcRenderer.sendToHost("new_offline", user.id, "yes", parseInt(user.chatstate.__x_t)); //whatsapp last seen
            }
          }
        }
        //if the img we have is not the whatsapp img
        if (profile_img[user.id] != Store.Contact._indexes.id[user.id].__x_profilePicThumb.__x_img) {
          //update our list
          profile_img[user.id] = Store.Contact._indexes.id[user.id].__x_profilePicThumb.__x_img;
          //send it to the host
          ipcRenderer.sendToHost("new_img", user.id, Store.Contact._indexes.id[user.id].__x_profilePicThumb.__x_img);
        }
      } else {
        //if we dont need to send every thing - in this mode we just need to send the host just images and online status
        if (online2[user.id] != user.isOnline) {
          profile_img[user.id] = Store.Contact._indexes.id[user.id].__x_profilePicThumb.__x_img;
          online2[user.id] = user.isOnline;
        }
      }

    });
    //out of the loop - we need to send it one time, //if we dont need to send every thing - in this mode we just need to send the host just images and online status
    if (send != "true") {
      ipcRenderer.sendToHost("online_array", online2, profile_img);
      console.log("online_array sent + img"); //log it
    }
  }
});
