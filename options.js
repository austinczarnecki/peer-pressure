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
  if (url == "") {
    return;
  }
  $('#url').val("");
  localStorage[url] = true;

  //update the table
  append_site(url);
}

$(document).ready(function() {
  reload_table();
  if ("userToken" in localStorage) {
    $('#need-facebook-auth').hide();
  } else {
    $('#have-facebook-auth').hide();
  }

  $('.delete').click(function() {
    localStorage.removeItem($(this).parent('tr').children('.site').text());
    $(this).parent('tr').remove();
  });

  $('body').on("click", "#delete-fb-auth", function() {
    $.ajax({
      url: 'https://graph.facebook.com/' + localStorage["userId"] + '/permissions',
      data: { access_token: localStorage["userToken"] },
      type: 'DELETE'
    });
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    $('#have-facebook-auth').hide();
    $('#need-facebook-auth').show();
  });
  $('#url').focus();

});

$('#input-site').submit(function() {
  save_options();
})

