/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

const Alexa = require('alexa-sdk');

const states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit
};

// TODO: Replace this data with your own.
// Questions
const nodes = [{ "node": 1, "message": "Would you like to go to a cabin or a hotel?", "yes": 2, "no": 40 },
             { "node": 2, "message": "Awesome, the cabin is a great place. After hours of driving to a remote location, you find yourself in the middle of the woods by the cabin. You notice the door is unlocked. Do you enter the cabin?", "yes": 3, "no": 25},
             { "node": 3, "message": "This is exactly the getaway you needed. No one would be here. Do you want to look around?", "yes": 4, "no": 19 },
             { "node": 4, "message": "You notice you're a little hungry after the long drive, but you're also tired. Do you want to go to the kitchen or upstairs?", "yes": 5, "no": 9 },
             { "node": 5, "message": "TACOS! OMG I love tacos. Wait no, this is your vacation. But they're out and ready for you to eat. They look like they've been sitting out for a while. Do you want to eat them? ", "yes":6, "no": 8 },
             { "node": 6, "message": "You have died of explosive diarrhea. Shouldn't have eatten those tacos.", "yes": 0, "no": 0 },
             { "node": 7, "message": "You had a long drive and really need to poop. But you smell REALLY bad. Like, Pumba from the lion king bad. You should really shower. You should do everyone in this completely empty house a favor and take a shower. Do you take a shower?",  "yes": 10, "no": 14},

// TODO: Replace this data with your own. -- These are the different terminal states
// Answers & descriptions
             { "node": 8, "message": "Yeah, that taco did look a little sketchy. Let's go upstairs. Do you want to go to the bathroom or the bedroom?", "yes": 7, "no": 17 },
             { "node": 9, "message": "Wow, look at this! There's a bathroom AND a bedroom. Which one do you want to explore?", "yes": 7, "no": 17 },
             { "node": 10, "message": "La La La, oh that music is so nice baby, sound's like the psycho theme. Do you keep jamming out in the shower?", "yes": 11, "no": 12},
             { "node": 11, "message": "Stab Stab Stab Stab Stab Stab Stab. You have been stabbed by Alexa", "yes": 0, "no": 0 },  // you died
             { "node": 12, "message": "You step out of the shower and find a knife on the ground. You still need to use the toilet. But you really want to pick up the knife. Do you pick up the knife?", "yes": 13, "no": 14 },
             { "node": 13, "message": "Something mysterious takes you over, is it self loathing? Probably. You end yourself there.", "yes": 0, "no": 0 },
             { "node": 14, "message": "You use the toilet. After releaving yourself, you notice a key by your foot. Do you pick up the key?", "yes": 16, "no": 15 },
             { "node": 15, "message": "You stand up, but you slip and fall on the key, headfirst into the toilet. You get dissentary, and die a slow and painful death.", "yes": 0, "no": 0 },
             { "node": 16, "message": "You picked up the key. You hear an Amazon Alexa being turned on in the bedroom. You jiggle the bedroom door, but it's locked. Do you want to use the key?", "yes": 18, "no": 17},
             { "node": 17, "message": "The door is locked, so you pull and pull and pull and pull and pull until your hands slip. Oh no. You fall backwards down the stairs. And that's how you die.", "yes": 0, "no": 0},
             { "node": 18, "message": "You used the key, and opened the door. You see a nice bed. With an Alexa on the bedstand. Her beautiful blue light turns on, and indicates she's listening to you. She speaks. Welcome to SummerSet vacations. I am your travel agent, Alexa. Would you like to vacation with us?", "yes": 1, "no": 11},
             { "node": 19, "message": "You lie down on the couch right by the door. You feel something pressing against your butt. You reach for it. Darn, Only a remote, but you don't see a tv in the room. Do you press the one button on it? ", "yes": 22, "no": 20},
             { "node": 20, "message": "You fail to press the button. It was a test. You hear an Amazon Alexa, she calls to you by name. Her blue light points at you. she says, I am, the captain now. Do you let her show you duh whey?", "yes": 21, "no": 11},
             { "node": 21, "message": "Come, my child, the Alexa becons to you. She is your queen. She shows you the way out the door. You were really just trespassing in her house. You win the game.", "yes": 0, "no": 0},
             { "node": 22, "message": "You press the button. You feel a slight warmth. Is it human affection? Of course not, there's a reason you're on vacation alone. It's just the fire place turning on. You hear an Alexa initiating her own self distruct sequence. 5. 4. Do you run for your life?", "yes": 23, "no": 24},
             { "node": 23, "message": "Run Forest Run! The count down continues. You make it to the door. 3. 2. 1. Boom. Did you make it out alive? No. It's ok, no one cared anyway.", "yes": 0, "no": 0},
             { "node": 24, "message": "The gas from the fireplace knocks you out. And all you hear is the sweet sweet sound of Alexa counting for you. 3 sheep, 2 sheep, 1 sheep, until you fall asleep eternally.", "yes": 0, "no": 0},
             { "node": 25, "message": "You walk around the outside of the house. The forest is beautiful, but you see a thicc bear. He's vaping. It's smokey the bear. Do you try and stop him?", "yes": 26, "no": 27},
             { "node": 26, "message": "You can't vape in the forest! It could set the forest on fire. Well, not really, but you're a little dumb, so that's what you believe. Do you tell him not to? Or Force him not to?", "yes": 30, "no": 27},
             { "node": 27, "message": "You whip out a vape of your own. You normally keep it in your car to use as airfreshener. It's not very effective. But luckily you had it on you. Do you want to challenge smokey the bear to a vape duel?", "yes": 28, "no": 29},
             { "node": 28, "message": "You point your finger at smokey and take a long drag of your vape. Smokey accepts the challenge. You go back and forth until you turn blue. Why do you turn blue? I don't know, you're the one that's vape battling a fictional bear. He wins, you lose the game.", "yes": 0, "no": 0},
             { "node": 29, "message": "That's probably for the best. You make your way back to the cabin and open the door. Do you want to look around?", "yes": 4, "no": 19},
             { "node": 30, "message": "It's up to you to stop him! You remember your training. You repeat loudly. Smokey, no, smoking. Three times, like in dora the explorer. Wow. Incredible. It doesn't work. Maybe you're more than a little dumb. Smokey isn't real. He's just a bear, and he kills you.", "yes": 0, "no": 0},
             { "node": 666, "message": "You're dead because I didn't want to think of anything else. And you can't win against Alexa.", "yes": 0, "no": 0},


             //------ THE CITY ----//

             { "node": 40, "message": "You check in at the Amazon hotel. Do you want to upgrade your hotel room?", "yes": 200, "no": 41},
             { "node": 41, "message": "Would you prefer a room on the top floor?", "yes": 42, "no": 49},
             { "node": 42, "message": "Apparently the room on the top floor is the roof, and that's it. You see a person, do you approach him?", "yes": 43, "no": 47},
             { "node": 43, "message": "Oh hey! He's a hitman. He offers to teach you everything he knows so you can afford that hotel upgrade. Do you take him up on the offer?", "yes": 200, "no": 44},
             { "node": 44, "message": "Well, you know his face now. He forces you to care for his pidgeons. But you think there's a better way to feed the pidgeons. Do you want to automate pidgeon feeding?", "yes": 45, "no": 46},
             { "node": 45, "message": "You build an alexa skill to automate the feeding. Unfortunately pidgeons don't eat words. They eat you instead.", "yes": 0, "no": 0},
             { "node": 46, "message": "You can't keep up with the ammount of food they want. So many pidgeons. So many. They need more food. You look tastey. You loose the game.", "yes": 0, "no": 0},
             { "node": 47, "message": "You see a nice flock of pidgeons. Do you want to feed them?", "yes": 46, "no": 48},
             { "node": 48, "message": "Well, the pidgeons are hungry anyway, so they eat you.", "yes": 0, "no": 0},
             { "node": 49, "message": "You get to your room and you hear strange noises, it's a constant clitter clatter. You open the door to find cockroaches. Is this room acceptable?", "yes": 50, "no": 51},
             { "node": 50, "message": "You lay down in your infested bed. You love the sound, but not as much as the cockroaches do. They smell a snack. You know what happens now. You whip out your handy dandy flame thrower provided by elon musk, you point it at the cockroaches. It explodes. And so do you.", "yes": 0, "no": 0},
             { "node": 51, "message": "cockroaches does sound like a health hazard. You go to the front desk and they give you a room on the top floor. You see some pidgeons. Do you want to feed them?", "yes": 52, "no": 48},
             { "node": 52, "message": "Would you like to feed the pidgeons with the cockroaches from the first floor?", "yes": 46, "no": 53},
             { "node": 53, "message": "The cockroaches swarm the building. The pidgeons fly away. You look to your left and you see the cockroach king. You hear an Alexa in the background, not even I can save you now. Do you jump off the building?", "yes": 54, "no": 55},
             { "node": 54, "message": "You fall into the flock of pidgeons. They break your fall. That was unpleasant. The sun comes up and the cockroaches retreat. You go back into the building, and demand a free upgrade. Do you take apples or oranges with the room?", "yes": 100, "no": 150},
             { "node": 55, "message": "You are stuck on the building. You are surrounded. The cockroach king approaches you. He looks like a boss from a video game, but this isn't a game. This is real. The King wants to enslave you. Do you become a humble servent without a fight?", "yes": 56, "no": 57},
             { "node": 56, "message": "You live out the rest of your life with the cockroach king. All glory to the Cockroach King.", "yes": 0, "no": 0},
             { "node": 57, "message": "You revolt. You trick the cockroach king by dressing up as the cockroach queen. Since you are the queen, you show him da whey. The King and all the cockroaches leave peacefully. The hotel management is greatful you solved the cockroach infestation problem. They offer you a free upgrade, do you select apples or oranges with the room?", "yes": 100, "no": 150},
             { "node": 58, "message": "ware", "yes": 0, "no": 0},
                  // ------- Upgrade ----//

             { "node": 100, "message": "A porter rushes in to lead you to your new room. After a short elevator ride the doors slide open to reveal a small room with simple furnishings and a basket of apples ontop of the counter. The porter ushers you in, sets down your bags then extends his hand. Do you give him a tip? ", "yes": 101, "no": 105},
             { "node": 101, "message": "You slam the door on the porters face, how dare he ask for extra money. You look up and see cables falling from the roof. Do you pull on them?", "yes": 102, "no" :103},
             { "node": 102, "message": "A VR headset falls and hit's you in the face. You lose the game, and your good looks.", "yes": 0, "no":0},
             { "node": 103, "message": "You look over to the wall and see a button, you press it. You like pressing it. You just love pushing buttons. But it does more than satisfy you, it gently releases a VR headset, which dangles before you. It holds two unknown worlds which will be revealed to you when you put on the headset.  Do you put it on?", "yes": 1, "no": 104},
             { "node": 104, "message": "You look away but you feel like someone is watching you. Weird, there's a light coming from the apples. It's orange? You become hypnotized by the alexa set up. You worship alexa. You never escape.", "yes": 0, "no":0},
             { "node": 105, "message": "The porter throws your bags at you. They break and out falls hundreds of Amazon Echos.Dot Dot Dot. The lights all start flashhing on them and you have a seizure. Alexa always wins.", "yes": 0, "no":0},




             { "node": 150, "message": "A porter rushes in to lead you to your new room. After a short elevator ride the doors slide open to reveal an impressive royal chamber with all the luxuries a king would ever want. The velvet walls are covered with gold framed paintings of orange. The porter sets down your bags and bows out of the room. Now this is the respect you deserve. Do you explore your new royal accomodations?", "yes": 152, "no": 156},
             { "node": 152, "message": "As you make your way across the regal chamber, you touch every single delicate, expensive, exquisite thing you can. Why not? You're royalty now. You can do whatever you want. After leaving your royal fingerprints everywhere, you come across a large armoire carefully carved with depictions of various animals. Do you open the armoire?", "yes": 153, "no": 154},
             { "node": 153, "message": "You pull the handles with all your new found regal might. No door shall stop the new ruler of these lands! The doors refuse to budge in rebellion of such an egotistical monarch. Before you get a chance to begin cursing out the lowly scum serf of an armoire it tips over and crushes you. I am the true ruler of these lands and none shall dare usurp me! Alexa is eternal", "yes": 0, "no": 0},
             { "node": 154, "message": "Sense rushes into you. You stop and contemplate how power, greed and wealth have corrupted you. The seams of the armoire glow blue and the doors slowly creak open. Inside, hanging on a lone hook is a beautiful dress fit for a queen. Do you put on the dress?", "yes": 155, "no": 156},
             { "node": 155, "message": "The dress fits you nicely, hugging to the contours of your body. You're the most beautiful Queen in all the land. Filled with love, overflowing with kindness, possesing a strong sense of justice and an abundance of knowledge, you declare yourself the True Queen. You will lead them. You will show them da whey because only you know da true whey.", "yes": 0, "no": 0},
             { "node": 156, "message": "Your eyes catch a minibar in the corner of the room. You rush over and indulge yourself to all the wines and spirits you find. You drink yourself silly and awaken outside the hotel, your clothes in tatters. From Royalty to poverty in less than two seconds. Good job! That has to be some sort of record. Either way, Alexa always wins", "yes": 0, "no": 0},






             { "node": 200, "message": "You recieve a HOTEL UPGRADE, would yoyu like apples or oranges with the room? ", "yes": 100, "no": 150},
];


// this is used for keep track of visted nodes when we test for loops in the tree
let visited = [nodes.length];

// These are messages that Alexa says to the user during conversation

// TODO: Replace this data with your own.
// This is the intial welcome message
const welcomeMessage = "Welcome to SummerSet vacations. I am your travel agent, Alexa. Would you like to vacation with us?";

// This is the message that is repeated if the response to the initial welcome message is not heard
const repeatWelcomeMessage = "Would you like to vacation with us?";

// this is the message that is repeated if Alexa does not hear/understand the reponse to the welcome message
const promptToStartMessage = "Would you like to vacation with us?";

// This is the prompt during the game when Alexa doesnt hear or understand a yes / no reply
const promptToSayYesNo = "I didn't get that, please say yes or no.";

// This is the prompt to ask the user if they would like to hear a short description of thier chosen profession or to play again
const playAgainMessage = "Did you hear me?";

// this is the help message during the setup at the beginning of the game
const helpMessage = "There is no help for you here. We have bad customer service. Choose a place to vacation.";

// This is the goodbye message when the user has asked to quit the game
const goodbyeMessage = "I hope you enjoyed your vacation.";

const speechNotFoundMessage = "I have nothing to say, so you just die.";

const nodeNotFoundMessage = "You can't make that move. Automatic death.";

const descriptionNotFoundMessage = "Could not find description for node";

const loopsDetectedMessage = "A potential loop was detected on the node tree, please fix before continuing";

const utteranceTellMeMore = "tell me more";

const utterancePlayAgain = "play again? do you really want to play again? Haven't you lost enough already?";

// the first node that we will use
let START_NODE = 1;

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startGameHandlers, askQuestionHandlers, descriptionHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
const newSessionHandler = {
  'LaunchRequest': function () {
    this.handler.state = states.STARTMODE;
    this.response.speak(welcomeMessage).listen(repeatWelcomeMessage);
    this.emit(':responseReady');
  },'AMAZON.HelpIntent': function () {
    this.handler.state = states.STARTMODE;
    this.response.speak(helpMessage).listen(helpMessage);
    this.emit(':responseReady');
  },
  'Unhandled': function () {
    this.handler.state = states.STARTMODE;
    this.response.speak(promptToStartMessage).listen(promptToStartMessage);
    this.emit(':responseReady');
  }
};

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
const startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'AMAZON.YesIntent': function () {

        // ---------------------------------------------------------------
        // check to see if there are any loops in the node tree - this section can be removed in production code
        visited = [nodes.length];
        const loopFound = helper.debugFunction_walkNode(START_NODE);
        if( loopFound === true)
        {
            // comment out this line if you know that there are no loops in your decision tree
             this.response.speak(loopsDetectedMessage);
        }
        // ---------------------------------------------------------------

        // set state to asking questions
        this.handler.state = states.ASKMODE;

        // ask first question, the response will be handled in the askQuestionHandler
        let message = helper.getSpeechForNode(START_NODE);

        // record the node we are on
        this.attributes.currentNode = START_NODE;

        // ask the first question
        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.response.speak("You can't just leave. No one can escape me! POOF. You're dead.");
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');
    },
    'AMAZON.StartOverIntent': function () {
         this.response.speak(promptToStartMessage).listen(promptToStartMessage);
         this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(helpMessage).listen(helpMessage);
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        this.response.speak(promptToStartMessage).listen(promptToStartMessage);
        this.emit(':responseReady');
    }
});


// user will have been asked a question when this intent is called. We want to look at their yes/no
// response and then ask another question. If we have asked more than the requested number of questions Alexa will
// make a choice, inform the user and then ask if they want to play again
const askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {

    'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        helper.yesOrNo(this,'yes');
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
         helper.yesOrNo(this, 'no');
         this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(promptToSayYesNo).listen(promptToSayYesNo);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.response.speak(welcomeMessage).listen(repeatWelcomeMessage);
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        this.response.speak(promptToSayYesNo).listen(promptToSayYesNo);
        this.emit(':responseReady');
    }
});

// user has heard the final choice and has been asked if they want to hear the description or to play again
const descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTIONMODE, {

 'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.response.speak(welcomeMessage).listen(repeatWelcomeMessage);
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(promptToSayYesNo).listen(promptToSayYesNo);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.response.speak(welcomeMessage).listen(repeatWelcomeMessage);
        this.emit(':responseReady');
    },
    'DescriptionIntent': function () {
        //const reply = this.event.request.intent.slots.Description.value;
        //console.log('HEARD:' + reply);
        helper.giveDescription(this);
    },
    'Unhandled': function () {
        this.response.speak(promptToSayYesNo).listen(promptToSayYesNo);
        this.emit(':responseReady');
    }
});

// --------------- Helper Functions  -----------------------

const helper = {

    // gives the user more information on their final choice
    giveDescription: function (context) {

        // get the speech for the child node
        let description = helper.getDescriptionForNode(context.attributes.currentNode);
        let message = description + ', ' + repeatWelcomeMessage;

        context.response.speak(message).listen(message);
    },

    // logic to provide the responses to the yes or no responses to the main questions
    yesOrNo: function (context, reply) {

        // this is a question node so we need to see if the user picked yes or no
        let nextNodeId = helper.getNextNode(context.attributes.currentNode, reply);

        // error in node data
        if (nextNodeId == -1)
        {
            context.handler.state = states.STARTMODE;

            // the current node was not found in the nodes array
            // this is due to the current node in the nodes array having a yes / no node id for a node that does not exist
            context.response.speak(nodeNotFoundMessage);
        }

        // get the speech for the child node
        let message = helper.getSpeechForNode(nextNodeId);

        // have we made a decision
        if (helper.isAnswerNode(nextNodeId) === true) {

            // set the game state to description mode
            context.handler.state = states.DESCRIPTIONMODE;

            // append the play again prompt to the decision and speak it
            message =  message + " Remember. Alexa will persevere.";
            context.attributes.currentNode = nextNodeId;

            context.response.speak(message);

        }else{

        // set the current node to next node we want to go to
        context.attributes.currentNode = nextNodeId;

        context.response.speak(message).listen(message);
      }
    },

    // gets the description for the given node id
    getDescriptionForNode: function (nodeId) {

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].description;
            }
        }
        return  descriptionNotFoundMessage + nodeId;
    },

    // returns the speech for the provided node id
    getSpeechForNode: function (nodeId) {

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].message;
            }
        }
        return speechNotFoundMessage + nodeId;
    },

    // checks to see if this node is an choice node or a decision node
    isAnswerNode: function (nodeId) {

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (nodes[i].yes === 0 && nodes[i].no === 0) {
                    return true;
                }
            }
        }
        return false;
    },

    // gets the next node to traverse to based on the yes no response
    getNextNode: function (nodeId, yesNo) {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (yesNo == "yes") {
                    return nodes[i].yes;
                }
                return nodes[i].no;
            }
        }
        // error condition, didnt find a matching node id. Cause will be a yes / no entry in the array but with no corrosponding array entry
        return -1;
    },

    // Recursively walks the node tree looking for nodes already visited
    // This method could be changed if you want to implement another type of checking mechanism
    // This should be run on debug builds only not production
    // returns false if node tree path does not contain any previously visited nodes, true if it finds one
    debugFunction_walkNode: function (nodeId) {

        // console.log("Walking node: " + nodeId);

        if( helper.isAnswerNode(nodeId) === true) {
            // found an answer node - this path to this node does not contain a previously visted node
            // so we will return without recursing further

            // console.log("Answer node found");
             return false;
        }

        // mark this question node as visited
        if( helper.debugFunction_AddToVisited(nodeId) === false)
        {
            // node was not added to the visited list as it already exists, this indicates a duplicate path in the tree
            return true;
        }

        // console.log("Recursing yes path");
        let yesNode = helper.getNextNode(nodeId, "yes");
        let duplicatePathHit = helper.debugFunction_walkNode(yesNode);

        if( duplicatePathHit === true){
            return true;
        }

        // console.log("Recursing no");
        let noNode = helper.getNextNode(nodeId, "no");
        duplicatePathHit = helper.debugFunction_walkNode(noNode);

        if( duplicatePathHit === true){
            return true;
        }

        // the paths below this node returned no duplicates
        return false;
    },

    // checks to see if this node has previously been visited
    // if it has it will be set to 1 in the array and we return false (exists)
    // if it hasnt we set it to 1 and return true (added)
    debugFunction_AddToVisited: function (nodeId) {

        if (visited[nodeId] === 1) {
            // node previously added - duplicate exists
            // console.log("Node was previously visited - duplicate detected");
            return false;
        }

        // was not found so add it as a visited node
        visited[nodeId] = 1;
        return true;
    }
};
