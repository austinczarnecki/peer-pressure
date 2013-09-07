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

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
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
    chrome.tabs.remove(tab.id);
  }
});

chrome.tabs.onCreated.addListener(function(tab) {
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
    chrome.tabs.remove(tab.id);
  }
});