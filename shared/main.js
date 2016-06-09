Meteor.methods({
    newChat: function(user1, user2) {
        console.log("New chat created!");
        Chats.insert({user1Id: user1, user2Id: user2});
    },
    pushMessage: function(chatId, msg) {
        var chat = Chats.findOne({_id: chatId});
        if (chat) {
            var msgs = chat.messages;
            if (!msgs) {
                msgs = [];
            }
            msgs.push(msg);
            chat.messages = msgs;
            Chats.update(chat._id, chat);
        }
    }
});
