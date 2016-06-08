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

Router.route("/chat/:_id", function () {
    // El id del otro usuario es el id de la URL ruteada.
    var otherUserId = this.params._id;
    // Encuentra el chat que tiene dos usuarios que corresponden al user id
    // actual y al solicitado en la sentencia anteriror.
    var filter = {$or: [
        {user1Id: Meteor.userId(), user2Id: otherUserId},
        {user2Id: Meteor.userId(), user1Id: otherUserId}
    ]};
    var chat = Chats.findOne(filter);

    if (!chat) { // no hay chat para el filtro - hay que insertar uno nuevo.
        chatId = Chats.insert(
            {user1Id: Meteor.userId(), user2Id: otherUserId}
        );
    }
    else { // ya hay un chat - usar ese.
        chatId = chat._id;
    }

    if (chatId) {
        Session.set("chatId", chatId);
    }

    this.render("navbar", {to: "header"});
    this.render("chat_page", {to: "main"});
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
        return Meteor.users.find();
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
    other_user: function() {
        return "";
    },
})

////////////////////////////////////////////////////////////////////////////////
// Events
////////////////////////////////////////////////////////////////////////////////

Template.chat_page.events({
    "submit .js-send-chat": function(event) {
        // evita que el formulario recarge la página !!!
        event.preventDefault();

        var chat = Chats.findOne({_id: Session.get("chatId")});
        if (chat) { // ok - tenemos un chat
            var msgs = chat.messages;
            if (!msgs) {
                msgs = [];
            }
            // is a good idea to insert data straight from the form
            // (i.e. the user) into the database?? certainly not.
            // push adds the message to the end of the array
            msgs.push({
                author: Meteor.userId(),
                text: event.target.chat.value
            });
            event.target.chat.value = ""; // resetea el formulario
            chat.messages = msgs;
            Chats.update(chat._id, chat);
        }
    }
})
