var likeNames = [];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.names) {
      console.log("we have names!");
      console.log(request.names);
      likeNames = request.names;
      likeNames.forEach(function(name) {
        $('#content').append('<p>' + name + '</p>');
      });
    }
  }
);


