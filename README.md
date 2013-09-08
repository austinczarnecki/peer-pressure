Peer Pressure
=============
This is a chrome browser extension intended to leverage social pressures to prevent procrastination. 

It works by allowing the user to add urls to a blacklist maintained by the extension. Whenever a blacklisted site is visited, the extension posts to the user's Facebook wall with a message like:

```
I am visiting http://www.blacklistedurl.com/ again! Help me get back on track by liking this post!
```

After a certain threshold of likes is reached (the current value is 2) then the extension closes all tabs accessing that blacklisted url and deletes the post from Facebook.

In addition, comments on the post that contain a valid url will immediately redirect and bring to the front the tab that was accessing the blacklisted site. This can be used at the user's friends' discretion, and could actually encourage procrastination.


TODO
=============
* The user is asked to provide Graph API Explorer credentials to facilitate posting, but we hope to work around the limitations to the current Facebook SDK less intrusively in future iterations of the plugin.

* Better tab tracking -- Ideally, we would be able to make one post to Facebook and then track all blacklisted tabs to be closed when the like threshold is reached. Currently, a new post is made for each unique url (but not for multiple tabs accessing the same blacklisted site).

* Closing the loopholes
  * A user can currently delete their post from Facebook and never have their tabs auto-closed -- maybe block Facebook automatically?
  * Stronger blocking of sites -- instead of just closing them, close and block irrevocably for a set period of time. This amount of time could even be influenced or set by friends commenting on the post or the number of likes it gets.

* More robust url matching -- currently, having www.stackoverflow.com on the blacklist will not prevent the user from typing in stackoverflow.com into the browser directly.
