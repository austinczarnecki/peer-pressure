var token = "CAACEdEose0cBAExBljIifV3mGWrDZBpHhToojlmVfi3MEIHnLGUEngv5M0sYCbcwqgjmgu0fEgvWmAEr9Ejy7FZC3LiFAx7zhovQpn4WYEhueJeqWNp3uTPKPmeOgZAU5ZBytwBR4FmwD7n2lF0ufstZCRkkNC4gg08ZChwB29yq8ntMFhgRhG5YDKljhWAQAZD"

localStorage.clear();

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
    if (!tab["postedToFB"]) {
      $.post('https://graph.facebook.com/' + '100006458279825' + '/feed', { access_token: token, message: "I am visiting " + tab.url + " again!" }, function(response, status, request) {
        console.log(request.getAllResponseHeaders());
        tab["postedToFB"] = true;
      });
    }
    // chrome.tabs.remove(tab.id);
  }
}

loadScript('jquery.min.js', function () {
  // now we have jquery enabled yay
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    punishUser(tab);
  });

  // chrome.tabs.onCreated.addListener(function(tab) {
  //   punishUser(tab);
  // });
});