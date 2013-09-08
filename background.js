localStorage.clear();
postedTabURL = {}
postedFeeds = {}
feedsTabIDTable = {}

var now = new Date();
var strDateTime = [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("/"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");

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
    if (!postedTabURL[tab.id]) {
      console.log("posting to fb now!");
      postedTabURL[tab.id] = true;
      $.post('https://graph.facebook.com/' + localStorage["userId"] + '/feed', { access_token: localStorage["userToken"], message: "I am visiting " + tab.url + " again! # this is an api test message" }, function(response, status, request) {
        console.log(response);
        // set number of likes to 0
        postedFeeds[response.id] = 0;
        feedsTabIDTable[response.id] = tab.id;
        tab["postedToFB"] = true;
      });
    }
    // chrome.tabs.remove(tab.id);
  }
}

function checkInput() {
  if (!localStorage["userId"] || !localStorage["userToken"]) {
    alert("UserID or UserToken is not set yet");
    return;
  }
}

function countLikes(feedID, cb) {
  var count = 0
  $.get('https://graph.facebook.com/' + feedID, { fields: "id,likes.fields(id)", access_token: localStorage["userToken"] }, function(response, status, request) {
    count = -1;
    if (response["likes"]) {
      count = response.likes.data.length;
    }
    cb(count);
  });
}

function deleteFeed(feedID) {
  $.ajax({
    url: 'https://graph.facebook.com/' + feedID + "?access_token=" + localStorage["userToken"],
    type: 'DELETE'
  });
}

loadScript('jquery.min.js', function () {
  
  setInterval(function() {
    if (Object.keys(postedFeeds).length > 0) {
      for (f in postedFeeds) {
        if (feedsTabIDTable[f] > 0) {
          countLikes(f, function(c) {
            nLikes = c;
            if (nLikes > 0) postedFeeds[f] = nLikes;
            if (nLikes >= 1 && feedsTabIDTable[f] > 0) {
              chrome.tabs.remove(feedsTabIDTable[f]);
              deleteFeed(f);
              feedsTabIDTable[f] = -1; 
            }
          });
        }
      }
    }
  }, 10000);

  // now we have jquery enabled yay
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    punishUser(tab);
  });

  chrome.tabs.onCreated.addListener(function(tab) {
    checkInput();
  });

  chrome.tabs.onRemoved.addListener(function(tabID, removeInfo) {
    // mark posted as false if tab is closed
    postedTabURL[tabID] = false;
  });
});