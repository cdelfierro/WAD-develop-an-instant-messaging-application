////////////////////////////////////////////////////////////////////////////////
//Subscriptions
////////////////////////////////////////////////////////////////////////////////

Meteor.subscribe("users");
Meteor.subscribe("chats");
Meteor.subscribe("emojis");

////////////////////////////////////////////////////////////////////////////////
// Routing
////////////////////////////////////////////////////////////////////////////////

Router.configure({
    layoutTemplate: "ApplicationLayout"
});

Router.route("/", function () {
    console.log("rendering root /");
    this.render("navbar", {to:"header"});
    this.render("lobby_page", {to:"main"});
});

Router.route("/chat/:_id", {
    waitOn: function() {
        return Meteor.subscribe("chats");
    },
    data: function() {
        var otherUserId = this.params._id;
        var filter = {$or: [
            {user1Id: Meteor.userId(), user2Id: otherUserId},
            {user2Id: Meteor.userId(), user1Id: otherUserId}
        ]};
        return Chats.findOne(filter);
    },
    action: function() {
        if (this.ready()) {
            var otherUserId = this.params._id;
            var chat = Router.current().data();
            if (!chat) {
                console.log("No hay chat.");
                chatId = Meteor.call("newChat", Meteor.userId(), otherUserId);
            } else {
                chatId = Router.current().data()._id;
            }

            console.log("Chat id: " + chatId);
            if (chatId) {
                Session.set("chatId", chatId);
                this.render("navbar", {to: "header"});
                this.render("chat_page", {to: "main"});
            } else {
                this.render("navbar", {to: "header"});
                this.render("forbidden_page", {to: "main"});
            }
        }
    }
});

////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////

Template.available_user.helpers({
    getUsername: function(userId) {
        user = Meteor.users.findOne({_id: userId});
        return user.profile.username;
    },
    isMyUser: function(userId) {
        if (userId == Meteor.userId()) {
            return true;
        }
        else {
            return false;
        }
    }
})

Template.available_user_list.helpers({
    users: function() {
        if (Meteor.users.find().count()) {
            return Meteor.users.find();
        }
        return false;
    }
})

Template.chat_message.helpers({
    avatar: function(author) {
        var user = Meteor.users.findOne({_id: author});
        return user.profile.avatar;
    },
    username: function(author) {
        if (author != Meteor.userId()) {
            var otherUser = Meteor.users.findOne({_id: author});
            return otherUser.profile.username;
        } else {
            return "You";
        }
    },
})

Template.chat_page.helpers({
    messages: function() {
        var chat = Chats.findOne({_id: Session.get("chatId")});
        return chat.messages;
    },
    otherUser: function() {
        var chat = Chats.findOne({_id: Session.get("chatId")});
        if (Meteor.userId() == chat.user1Id) {
            otherUser = Meteor.users.findOne({_id: chat.user2Id});
        } else {
            otherUser = Meteor.users.findOne({_id: chat.user1Id});
        }
        return otherUser.profile.username;
    },
})

////////////////////////////////////////////////////////////////////////////////
// Events
////////////////////////////////////////////////////////////////////////////////

Template.chat_page.events({
    "submit .js-send-chat": function(event) {
        // evita que el formulario recarge la página !!!
        event.preventDefault();
        var message = {
            author: Meteor.userId(),
            text: event.target.chat.value
        };
        Meteor.call("pushMessage", Session.get("chatId"), message);
        event.target.chat.value = ""; // resetea el formulario
    }
})
