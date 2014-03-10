console.log('eventpage');

chrome.browserAction.onClicked.addListener(function(tab) {
  console.log('onClicked', tab);
  console.log('sendMessage', arguments);
  chrome.extension.sendMessage("data", function() {
    console.log('replyRecieved', arguments);
  })
  chrome.tabs.sendMessage(tab.id, 'alksjd', function() {
    console.log('tabReplyRecieved', arguments);
  });
});
