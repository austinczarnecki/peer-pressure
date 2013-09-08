// Save this script as `options.js`

//load current blocked sites into table
function reload_table() {
  $('#blocked-sites').empty();
  var keysArray = Object.keys(localStorage);
  for (var i=0;i<keysArray.length;i++) {
    $('#blocked-sites').append('<tr><td class="delete">x</td><td class="site">'+keysArray[i]+'</td></tr>');
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
  localStorage[url] = true;

  //update the table
  append_site(url);

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Saving site to blacklist.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var favorite = localStorage["favorite_color"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("color");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}

$(document).ready(function() {
  reload_table();
  $('.delete').click(function() {
    localStorage.removeItem($(this).parent('tr').children('.site').text());
    $(this).parent('tr').remove();
  });
});

document.addEventListener('DOMContentLoaded', restore_options);
$('form').submit(function() {
  var userId = document.getElementById("userId").value;
  var userToken = document.getElementById("token").value;
  localStorage["userId"] = userId;
  localStorage["userToken"] = userToken;
})
document.querySelector('#save').addEventListener('click', save_options);