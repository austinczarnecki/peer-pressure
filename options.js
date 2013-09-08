// Save this script as `options.js`

//load current blocked sites into table
function reload_table() {
  $('#blocked-sites').empty();
  var keysArray = Object.keys(localStorage);
  for (var i=0;i<keysArray.length;i++) {
    if (keysArray[i] != "userToken" && keysArray[i] != "userId") {
      $('#blocked-sites').append('<tr><td class="delete">x</td><td class="site">'+keysArray[i]+'</td></tr>');
    }
  }
}

function append_site(site) {
  var keysArray = Object.keys(localStorage);
  $('#blocked-sites').append('<tr><td class="delete">x</td><td class="site">'+site+'</td></tr>');
  $('.delete').click(function() {
    localStorage.removeItem($(this).parent('tr').children('.site').text());
    $(this).parent('tr').remove();
  });
}

// Saves options to localStorage.
function save_options() {
  var url = document.getElementById("url").value;
  console.log(url);
  $('#url').val("");
  localStorage[url] = true;

  //update the table
  append_site(url);
}

$(document).ready(function() {
  reload_table();
  $('.delete').click(function() {
    localStorage.removeItem($(this).parent('tr').children('.site').text());
    $(this).parent('tr').remove();
  });
});

$('#input-site').submit(function() {
  console.log("test");
  save_options();
})

$('#user-auth').submit(function() {
  var userId = document.getElementById("userId").value;
  var userToken = document.getElementById("token").value;
  localStorage["userId"] = userId;
  localStorage["userToken"] = userToken;
})
