// Save this script as `options.js`

// Saves options to localStorage.
function save_options() {
  var url = document.getElementById("url").value;
  localStorage[url] = true;

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
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);