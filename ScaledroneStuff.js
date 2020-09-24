//defineing elements
var userInput = document.getElementById("userInput");
var submitButton = document.getElementById("submitButton");
var chatWindow = document.getElementById("chatWindow");
var membersOnlineWindow = document.getElementById("membersOnline");
var membersOnline = document.getElementById("numberOfActiveUsers");
var header = document.getElementById("header");
var copyRight = document.getElementById("cp");
var latestNews = document.getElementById("latestNews");
//random color values
var colors20 = ["#fa9816", "#8c9cad", "#0022ff", "#62a75c", "#a9c12a", "#800000",  "#f99d82", "#6b456c", "#b74373", "#98d8f8", "#00c4d4", "#f6cb69", "#c6c69c", "#00897b", "#04515e", "#fa4716", "#b080a4", "#6b4e41", "#5b8c16", "#f0376b"];
var randomNumberColor = Math.floor(Math.random() * colors20.length);
var randomColor = colors20[randomNumberColor];
//random name values
var names20 = ["Grrlson", "Riveraka", "Piranharo", "Helles", "Bekora", "Hayesphira", "Slimewarren", "Dracoson", "Muheart", "Phitte", "Frankentler", "Crocoter", "Bradlesaurus", "Abalrose", "Tagmagog", "Serary", "Fangdoyle", "Nuarice", "Elkelly", "Wiskelis"];
var randomNumberName = Math.floor(Math.random() * names20.length);
var randomName = names20[randomNumberName];


//new Mujo user before entering
var drone = new Scaledrone('GoD2fJpmJLz6e9WX', {
  data: {
    newUser: true,
    color: "red",
    name: "Mujo"
  }
});


//Enter room and get names and colors that are online
var room = drone.subscribe('observable-my-room');
var activeMembers;
room.on('members', function(members){
  //filter Mujo out
  activeMembers =  members.filter(function(el){
     return el.clientData.newUser != true
  });
  // List of members as an array
  console.log(members.length);
  console.log(activeMembers);
  //remove existing user names and colors
  removeExistingColorAndName(members);
  //login only if room has less than 20 users online
  if(activeMembers.length <20){
    //login
    afterLogin();
  } else{
    alert("Looks like the room is occupied. Try again later.")
  }
});

//remove existing colors and names from list function
function removeExistingColorAndName(members){
  for(i = 0; i<members.length; i++){
    var currentMember = members[i];
    colors20 = colors20.filter(function(el) {
      return el != currentMember.clientData.color
    });
    names20 = names20.filter(function(el){
      return el != currentMember.clientData.name
    });
  }
};


//handle UI when page loads
function handleUIAfterLogin(){
  //focus user input upon loading chat
  userInput.focus();
  //reset color and name
  randomNumberColor = Math.floor(Math.random() * colors20.length);
  randomColor = colors20[randomNumberColor];
  randomNumberName = Math.floor(Math.random() * names20.length);
  randomName = names20[randomNumberName];
  //change UI to match user color
  chatWindow.style.borderLeft = "solid" + randomColor;
  chatWindow.style.borderRight = "solid" + randomColor;
  submitButton.style.color = randomColor;
  userInput.style.backgroundColor = randomColor;
  userInput.style.border = randomColor;
  userInput.setAttribute("placeholder", "Send message as " + randomName);
  submitButton.removeAttribute("hidden");
  submitButton.style.border = randomColor;
  submitButton.style.border = "solid";
  membersOnlineWindow.style.backgroundColor = randomColor;
  membersOnline.style.backgroundColor = randomColor;
  header.style.backgroundColor = randomColor;
  copyRight.style.color = randomColor;
};




function afterLogin(){
  //handle UI
  handleUIAfterLogin();
  //assing name and color to user after login
  drone = new Scaledrone('GoD2fJpmJLz6e9WX', {
    data: {
      name: randomName,
      color: randomColor,
    }
  });

  //subscribe to room
  room = drone.subscribe('observable-my-room');
  room.on('members', function(members) {
    // List of members as an array without Mujo
    console.log(members.length);
    console.log(members);
    activeMembers =  members.filter(function(el){
      return el.clientData.newUser != true
    }); 
    //show how many current users are online
    membersOnline.innerHTML = "Currently active: " + activeMembers.length;           
    //display names of online users
    for(i = 0; i<activeMembers.length; i++){
      var childUserDiv = document.createElement("div");
      childUserDiv.innerHTML = activeMembers[i].clientData.name;
      membersOnline.appendChild(childUserDiv);
      childUserDiv.classList.add("onlineUsersDisplay");
      childUserDiv.style.backgroundColor = activeMembers[i].clientData.color; 
      };       
  });
  //Display recieved messages
  function displayReceivedMessages(message){
    if(isThisMyMessage(message) == true){
      //display name div
      var childDivName = document.createElement("div");
      childDivName.innerHTML = randomName;
      chatWindow.appendChild(childDivName);
      childDivName.style.color = randomColor;
      childDivName.classList.add("leftSideName");
      //display message with the correct color div
      var childDiv = document.createElement("div");
      childDiv.innerHTML = message.data.message;
      chatWindow.appendChild(childDiv);
      childDiv.style.backgroundColor = randomColor;
      childDiv.classList.add("leftSideMessage");
      childDiv.scrollIntoView();
    }else{
      //display other member name div
      var childDivName = document.createElement("div");
      childDivName.innerHTML = message.member.clientData.name;
      chatWindow.appendChild(childDivName);
      childDivName.style.color = message.member.clientData.color;
      childDivName.classList.add("rightSideName");
      //display other member messages in correct color div
      var childDiv = document.createElement("div");
      childDiv.innerHTML = message.data.message;
      chatWindow.appendChild(childDiv);
      childDiv.style.backgroundColor = message.member.clientData.color;
      childDiv.classList.add("rightSideMessage");
      childDiv.scrollIntoView();         
    }  
  };
  //Check if messages are coming from me
  function isThisMyMessage(message){
    if(message.clientId === drone.clientId){
      return true;
    } else{
      return false;
    }
  };
  //display messages when any user sends one
  room.on('message', displayReceivedMessages); 
  //Publishing messages function
  function publishMessage(){
    var trimSpaces = userInput.value.trim();
    if(trimSpaces !== ""){
      drone.publish({
        room: 'observable-my-room',
        message: {message: trimSpaces},
      });
    } else{
    };
    //clear user input on submit
    userInput.value = "";
  };
  //on button send message
  submitButton.addEventListener("click", publishMessage);
  //function for enter key
  function enterKey(i){
    if(i.key === "Enter"){
      publishMessage();
    }
  };
  //on enter send message
  userInput.addEventListener("keydown", enterKey);
  //member joined
  room.on('member_join', function(member) {
    // the user logged in
    if(member.clientData.newUser != true){
      console.log("new member here", member);
      activeMembers.push(member); 
    };
    //show how many current users are online  
    membersOnline.innerHTML = "Currently active: " + activeMembers.length; 
    //display names of online users
    for(i = 0; i<activeMembers.length; i++){
      var childUserDiv = document.createElement("div");
      childUserDiv.innerHTML = activeMembers[i].clientData.name;
      membersOnline.appendChild(childUserDiv);
      childUserDiv.style.backgroundColor = activeMembers[i].clientData.color;
      childUserDiv.classList.add("onlineUsersDisplay");
    };   
  });  
  //member left handle
  room.on('member_leave', function(member) {
    //remove member that left
    var filteredMembers = activeMembers.filter(function(el) { return el.id != member.id; });
    activeMembers = filteredMembers;
    //show how many current users are online  
    membersOnline.innerHTML = "Currently active: " + activeMembers.length;     
    //display names of online users
    for(i = 0; i<activeMembers.length; i++){
      var childUserDiv = document.createElement("div");
      childUserDiv.innerHTML = activeMembers[i].clientData.name;
      membersOnline.appendChild(childUserDiv);
      childUserDiv.style.backgroundColor = activeMembers[i].clientData.color;
      childUserDiv.classList.add("onlineUsersDisplay");
    };
  });   
};

