# Instant messaging application using Meteor
This is a little message application in which registered user can talk to each other in a cahtroom. This project has the following features:
* Only registered users can chat.
* Only one-to-one chat allowed.
* It has support of emoji through the package [lookback:emoji](https://atmospherejs.com/lookback/emoji) and the Emoji art is supplied by [Emoji One](http://emojione.com/)
* It has security implemented through Meteor methods and publish & subscribe (e.g an user may not see the chats that he/she is not taking part).

##Usage for testing

1. First you want to unzip the app and run the meteor app

  ```bash
  $ unzip WAD-develop-an-instant-messaging-application-1.0.zip
  $ cd WAD-develop-an-instant-messaging-application-1.0/
  $ meteor
  ```
   
2. Go to the webpage [http://localhost:3000/](http://localhost:3000/)

3. Login with two of the users in different browsers as user1@test.com ... user8@test.com with the password test123 and start chatting.

4. To test the emoticons put their shorcut in the message box and they will be rendered in the chat. Try to discover them!

----
<dl>
  <dt>Meteor version</dt>
  <dd>1.3.2.4<dd>
</dl>
