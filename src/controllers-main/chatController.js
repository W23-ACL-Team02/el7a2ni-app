const conversationModel = require('../models/conversation');
const messageModel = require('../models/message');
const userModel = require('../models/user');

module.exports = {
    sendMessage: async (req, res) => {
        const userId = req.session?.userId;
        if (userId === undefined) {
            res.status(400).json({errors: ["User does not exist in session"]})
            return;
        }

        try {
            // Fetch conversation

            // Ensure sender is participant

            // Check if conversation is open
                // If sender is not conversation creator
                    // Set conversation receiver to message sender and close conversation
            
        } catch (error) {
            
        }
    },
    newConversationWithUser: async (req, res) => {
        const userId = req.session?.userId;
        if (userId === undefined) {
            res.status(400).json({errors: ["User does not exist in session"]})
            return;
        }

        try {
            // Check if user already has conversation with this receiveing user
                // Return existing conversation's messages

            // Create new conversation
        } catch (error) {
            
        }
    },
    newConversationWithPharmacist: async (req, res) => {
        const userId = req.session?.userId;
        if (userId === undefined) {
            res.status(400).json({errors: ["User does not exist in session"]})
            return;
        }

        try {
            // Check if user has another open conversation for pharmacists
                // Return existing conversation

            // Create new open conversation to be accepted by a pharmacist

        } catch (error) {

        }
    },
    getConversationMessages: async (req, res) => {
        const userId = req.session?.userId;
        if (userId === undefined) {
            res.status(400).json({errors: ["User does not exist in session"]})
            return;
        }

        const convoId = req.query?.convoId;
        if (convoId === undefined) {
            res.status(400).json({errors: ["Expected conversation ID but was undefined."]})
            return;
        }

        // Try fetching conversation and ensure current user is either sender or receiver
        try {
            let conversation = await conversationModel.findById(convoId);
            
            if (conversation === null) {
                return res.status(404).json({errors: [`Conversation with ID ${convoId} not found.`]})
            }

            if (!conversation.checkUserParticipant(userId, req.session?.userType)) {
                return res.status(403).json({errors: [`User not a participant in this conversation`]})
            }

            // Try fetching all conversation messages
            try {
                let conversationMessages = await messageModel.find({
                    $and: [{
                        conversationId: convoId
                    }, {
                        $or: [{
                            receiverId: userId
                        }, {
                            senderId: userId
                        }]
                    }]
                })

                // TODO: sort messages based on timestamp

                res.status(200).json(conversationMessages);

                // Update conversation to be read by the user who opened
                if (conversation.creatorId == userId) {
                    conversation.creatorRead = true;
                    conversation.save();
                } else if (!conversation.isOpenConversation && conversation.receiverId == userId) {
                    conversation.receiverRead = true;
                    conversation.save();
                }
            } catch (error) {
                return res.status(500).json({errors: ["Error fetching conversation messages."]})
            }
        } catch (error) {
            return res.status(500).json({errors: ["Error authenticating user in conversation."]})
        }
    },
    /**
     * Respond with all conversations visible to current user in session
     */
    getAllConversations: async (req, res) => {
        const userId = req.session?.userId;
        if (userId === undefined) {
            res.status(400).json({errors: ["User does not exist in session"]})
            return;
        }

        try {
            let conversations = await conversationModel.find({
                $or: [{
                    creatorId: userId
                }, {
                    receiverId: userId
                }, {
                    receiverType: req.session?.userType,
                    isOpenConversation: true
                }]
            })

            // Store extra data inside conversation object for payload
            for (let conversation of conversations) {
                // Store name of other conversation participant
                let participantId = (conversation.creatorId == userId) ? conversation.receiverId : conversation.creatorId;
                let participant = await userModel.findById(participantId);

                conversation.participantName = participant.name;

                // Store content of last message
                if (conversation?.lastMessage != undefined) {
                    conversation.lastMessage = await messageModel.findById(conversation.lastMessage)
                }
            }

            res.status(200).json({conversations});
        } catch (error) {
            res.status(500).json({errors: ["Error fetching conversations."]})
        }
    }
}