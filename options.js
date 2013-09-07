// Save this script as `options.js`

//load current blocked sites into table
function reload_table() {
  $('#blocked-sites').empty();
  var keysArray = Object.keys(localStorage);
  for (var i=0;i<keysArray.length;i++) {
    $('#blocked-sites').append('<tr><td class="site">'+keysArray[i]+'</td></tr>');
  }
}

// Saves options to localStorage.
function save_options() {
  var url = document.getElementById("url").value;
  localStorage[url] = true;

  //update the table
  reload_table();

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

$(document).ready(reload_table);
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
