localStorage.clear();
blockedURL = {};
likeThreshold = 1;
hasShownAlert = {};

var now = new Date();
var strDateTime = [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("/"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");
var likedNames = [];

//Pad given value to the left with "0"
function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}

console.log(strDateTime);

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

function parseUri (str) {
  var o   = parseUri.options,
    m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
    uri = {},
    i   = 14;

  while (i--) uri[o.key[i]] = m[i] || "";

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2;
  });

  return uri;
};

parseUri.options = {
  strictMode: false,
  key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
  q:   {
    name:   "queryKey",
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};
//end parse uri code

// function to load another js file
function loadScript(url, callback)
{
    // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

   // then bind the event to the callback function
   // there are several events for cross browser compatibility
   script.onreadystatechange = callback;
   script.onload = callback;

   // fire the loading
   head.appendChild(script);
}

function punishUser(tab) {
  console.log(tab);
  console.log(localStorage);
  console.log('tabs.onUpdated --'
              + ' window: ' + tab.windowId
              + ' tab: '    + tab.id
              + ' index: '  + tab.index
              + ' url: '    + tab.url);
  console.log(parseUri(tab.url).host);
  var visited = parseUri(tab.url).host
  var keysArray = Object.keys(localStorage);
  console.log(visited);
  console.log(keysArray);
  if (keysArray.indexOf(visited) != -1) {
    // only post if it's not in the blocked URL hash yet
    if (!(visited in blockedURL)) {
      blockedURL[visited] = [tab.id];
      blockedURL[visited].posted = true;
      blockedURL[visited].feedLikeCount = 0;
      $.post('https://graph.facebook.com/' + localStorage["userId"] + '/feed', { access_token: localStorage["userToken"], message: "I am visiting " + tab.url + " again! # this is an api test message" }, function(response, status, request) {
        console.log("posting to FB");
        console.log(response);
        blockedURL[visited].feedID = response.id;
      });
    } else {
      // if it's in the blocked URL hash already
      // just add the tab.id
      if (!(tab.id in blockedURL[visited])) blockedURL[visited].push(tab.id);
    }
  }
}

function checkInput(tab) {
  if (!localStorage["userId"] || !localStorage["userToken"]) {
    // don't alert if we're in chrome-extensions or graph explorer
    var uri = parseUri(tab.url);
    if (uri.protocol == "chrome-extension" || uri.host == "developers.facebook.com" || uri.protocol == "chrome" || hasShownAlert[tab.id] ) return;
    hasShownAlert[tab.id] = true;
    alert("You've installed PeerPressure but haven't yet given us permission to post on facebook for you! Please go to chrome-extensions and select options to configure the app.");
    return;
  }

}

function countLikes(feedID, cb) {
  var count = 0;
  $.get('https://graph.facebook.com/' + feedID, { fields: "id,likes.fields(id)", access_token: localStorage["userToken"] }, function(response, status, request) {
    count = -1;
    if (response["likes"]) {
      count = response.likes.data.length;
    }
    cb(count);
  });
}

function whoLiked(feedID, cb) {
  var names = [];
  $.get('https://graph.facebook.com/' + feedID, { fields: "likes", access_token: localStorage["userToken"] }, function(response, status, request) {
    if (response["likes"]) {
      response["likes"].data.forEach(function(obj) {
        names.push(obj.name);
      });
    }
    console.log(names);
    cb(names);
  });
}

function deleteFeed(feedID) {
  $.ajax({
    url: 'https://graph.facebook.com/' + feedID + "?access_token=" + localStorage["userToken"],
    type: 'DELETE'
  });
}

loadScript('jquery.js', function () {
  // code used to to check number of likes and 
  // close tabs
  setInterval(function() {
    if (Object.keys(blockedURL).length > 0) {
      for (url in blockedURL) {
        var tabArr = blockedURL[url];
        countLikes(tabArr.feedID, function(count) {
          if (count > 0) tabArr.feedLikeCount = count;
          if (count >= likeThreshold) {
            deleteFeed(tabArr.feedID);
            tabArr.forEach(function(tabID) {
              chrome.tabs.remove(tabID);
            });
            chrome.tabs.create({url: 'chrome-extension://mlgjaikfffonidgallnbpopjlpdpgelk/splash.html'}, function(tab) {
              whoLiked(tabArr.feedID, function(names) {
                console.log(names);
                $(document).ready(function() {
                  names.forEach(function(name) {
                    console.log($('#datUniqueContentIDSwagz'));
                    $('#datUniqueContentIDSwag').append('<p>'+name+'</p>');
                  });
                });
              });
            });
            // remove that from the blockedURL hash
            // since we have removed all of its
            // open tabs already
            delete blockedURL[url];
          }
        });
      }
    }
  }, 5000);

  // now we have jquery enabled yay
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    checkInput(tab);
    punishUser(tab);
  });

  chrome.tabs.onCreated.addListener(function(tab) {
    hasShownAlert[tab.id] = false;
  });

  chrome.tabs.onRemoved.addListener(function(tabID, removeInfo) {
    // mark posted as false if tab is closed
    postedTabURL[tabID] = false;
  });
});
