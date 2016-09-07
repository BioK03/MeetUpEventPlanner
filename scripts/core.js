
var core = {
    users: [
        /**/
    ],

    events: [
        /**/
    ],

    /* Called to initialize user storage */
    initialization: function(){
        if(localStorage.getItem("users") == null){
            localStorage.setItem("users", JSON.stringify(
                [
                    {email:"john.doe@gmail.com", lastname:"Doe", firstname:"John", password:"97443f1382071a1aa99e133cda6c54b3", key:"Ac764zecz6f4zecjzeklc", birthdate:""}, //password : john
                    {email:"jane.doe@hotmail.fr", lastname:"Doe", firstname:"Jane", password:"2a5f196048f9e5220cb0336653164ee3", key:"65vze6c51ze65c1ze51c", birthdate:""} // password : jane
                ]
            ));
        }
        core.users = JSON.parse(localStorage.getItem("users"));

        if(localStorage.getItem("events") == null){
            localStorage.setItem("events", JSON.stringify(
                [
                    {
                        creator:"john.doe@gmail.com",
                        name:"Meeting at Vilette !",
                        start:core.formatDate(new Date()),
                        end:core.formatDate(new Date()+2),
                        type:"birthday",
                        host:"John",
                        public:true,
                        guestList: [
                            "jane.doe@hotmail.fr"
                        ],
                        location:"Parc de la Villette, Avenue Jean Jaurès, Paris",
                        messageToGuests: "It's my birthday !"
                    },
                    {
                        creator:"jane.doe@hotmail.fr",
                        name:"Birthday at Louvre",
                        start:core.formatDate(new Date()+6),
                        end:core.formatDate(new Date()+6),
                        type:"birthday",
                        host:"Jane",
                        public:true,
                        guestList: [
                            "john.doe@gmail.com"
                        ],
                        location:"Musée du Louvre, Paris",
                        messageToGuests: "It's my birthday too !"
                    }
                ]
            ));
        }
        core.events = JSON.parse(localStorage.getItem("events"));
    },
    
    /* Return the username of the connected user*/
    getUsername: function(){
        if(localStorage.getItem("currentUser") != null)
        {
            return localStorage.getItem("currentUser").split("|")[1];
        }
        return "";
    },

    /* Return the email of the connected user*/
    getEmail: function(){
        if(localStorage.getItem("currentUser") != null)
        {
            return localStorage.getItem("currentUser").split("|")[0];
        }
        return "";
    },

    /* Called to save user list in localStorage */
    saveUsers: function(){
        localStorage.setItem("users", JSON.stringify(core.users));
    },

    /* Called to save event list in localStorage */
    saveEvents: function(){
        localStorage.setItem("events", JSON.stringify(core.events));
    },
    
    /* Called to register a new user */
    registration: function($email, $firstname, $lastname, $password, $birthdate) {
        for($i=0; $i<core.users.length; $i++)
        {
            if(core.users[$i].email == $email)
            {
                return false;
            }
        }

        $key = core.generateKey();
        core.users.push({email: $email, lastname: $lastname, firstname: $firstname, password: core.hashPassword($password, $key), key: $key, birthdate: $birthdate});
        core.saveUsers();

        return true;
    },

    /* Called to login a user */
    login: function($email, $password){
        $currentUser = -1;
        for($i=0; $i<core.users.length; $i++)
        {
            if(core.users[$i].email == $email)
            {
                $currentUser = $i;
            }
        }
        console.log("a");
        if($currentUser > -1)
        {
            if(core.hashPassword($password, core.users[$currentUser].key) == core.users[$currentUser].password)
            {
                localStorage.setItem("currentUser", core.users[$currentUser].email+"|"+core.users[$currentUser].firstname+" "+core.users[$currentUser].lastname);
                return true;
            }
        }
        return false;
    },

    /* Called to generate a 20-charcater-long random string*/
    generateKey: function(){
        var key = "";
        var possibleCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for($i=0; $i<20 ; $i++)
        {
            key += possibleCharacters.charAt(Math.floor(Math.random()*possibleCharacters.length));
        }
        return key;
    },

    /* Format a date to a convnient string for lecture*/
    formatDate: function($dateString){
        var date = new Date($dateString);
        $monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        return date.getDate()+" "+$monthArray[date.getMonth()]+" "+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
    },

    /* Called to hash a password from the real password and the hash key*/
    hashPassword: function(password, key){
        return $.md5(password, key);
    },

    /* Used to load personal events on the dashboard */
    loadPersonalEvents: function(){
        $html = "";
        $email = core.getEmail();
        
        for($i=0; $i<core.events.length; $i++)
        {
           
            if(core.events[$i].creator == $email)
            {
                $html += "<a class='carousel-item'>"
                    +"<h3>"+core.events[$i].name+"</h3>"
                    +"<p><i class='material-icons'>person_pin</i> "+core.events[$i].host+"<br/>"
                    +"<span class='blackActionBlock' onclick=\"core.location('https://www.google.fr/maps/search/"+core.events[$i].location.replace(" ", "+")+"/');\"><i class='material-icons'>place</i> "+core.events[$i].location+"</span><br/>"
                    +"<i class='material-icons'>access_time</i> "+core.events[$i].start+"<br/>"
                    +"<i class='material-icons'>group</i> "+core.events[$i].guestList.length+" guest(s)<br/>"

                    +"</p></a>";
            }
        }
        $("#personalEvents").html($html);
    },

    /* Used to load public events on the dashboard*/
    loadPublicEvents: function(){
        $html = "";
        
        for($i=0; $i<core.events.length; $i++)
        {
           
            if(core.events[$i].public)
            {
                $html += "<a class='carousel-item'>"
                    +"<h3>"+core.events[$i].name+"</h3>"
                    +"<p><i class='material-icons'>person_pin</i> "+core.events[$i].host+"<br/>"
                    +"<span class='blackActionBlock' onclick=\"core.location('https://www.google.fr/maps/search/"+core.events[$i].location.replace(" ", "+")+"/');\"><i class='material-icons'>place</i> "+core.events[$i].location+"</span><br/>"
                    +"<i class='material-icons'>access_time</i> "+core.events[$i].start+"<br/>"
                    +"<i class='material-icons'>group</i> "+core.events[$i].guestList.length+" guest(s)<br/>"

                    +"</p></a>";
            }
        }
        $("#publicEvents").html($html);
    },

    /* Used to open a new Google Maps tab */
    location: function($url)
    {
        var win = window.open($url, '_blank');
    },

    /* Called to verify forms and to perform page changes */
    dispatcher: function($actionName){
        $correctForm = true;
        switch($actionName){
            case "signup":
                $("#firstname").get(0).setCustomValidity("");
                $("#lastname").get(0).setCustomValidity("");
                $("#password").get(0).setCustomValidity("");
                
                if($("#firstname").val().length < 3)
                {
                    console.log("a");
                    $("#firstname").get(0).setCustomValidity("Your firstname must be at least 3-character long !");
                    $correctForm = false;
                }
                if($("#lastname").val().length < 3)
                {
                    $("#lastname").get(0).setCustomValidity("Your lastname must be at least 3-character long !");
                    $correctForm = false;
                }
                if($("#password").val().length < 8)
                {
                    $("#password").get(0).setCustomValidity("Your password must be at least 8-character long !");
                    $correctForm = false;
                }
                if($("#password").val() != $("#password2").val())
                {
                    $("#password").get(0).setCustomValidity("Your passwords must match !");
                    $correctForm = false;
                }
                if($correctForm)
                {
                    core.registration($("#email").val() , $("#firstname").val(), $("#lastname").val(), $("#password").val(), $("#birthdate").val());
                }
                break;
            case "signin":
                if(core.login($("#emailS").val(), $("#passwordS").val()))
                {
                    window.location.href = "index.html";
                }
                else {
                    $("#fillMessage").html("E-mail or password is incorrect !");
                }
                break;
            case 'addeventform':
                $("#startdate").get(0).setCustomValidity("");
                $("#enddate").get(0).setCustomValidity("");

                $startDate = new Date(document.getElementById("startdate").value);
                $endDate = new Date(document.getElementById("enddate").value);
                $today = new Date();
                if($startDate < $today)
                {
                    $("#startdate").get(0).setCustomValidity("The start date must be today at minimum !");
                    $correctForm = false;
                }
                if($startDate > $endDate)
                {
                    $("#enddate").get(0).setCustomValidity("The end date must be after the start date !");
                    $correctForm = false;
                }

                if($correctForm)
                {
                    core.events.push({
                        creator:core.getEmail(),
                        name:$("#name").val(),
                        start:core.formatDate(document.getElementById("startdate").value),
                        end:core.formatDate(document.getElementById("enddate").value),
                        type:$("#type").val(),
                        host:$("#host").val(),
                        public:$("#public").is(':checked'),
                        guestList: $('#guests').tokenize().toArray(),
                        location:$("#location").val(),
                        messageToGuests: $("#msg").val()
                    });
                    core.saveEvents();
                    window.location.href = "index.html";
                }
                break;
            case "logout":
                localStorage.removeItem("currentUser");
                window.location.href = "index.html";
                break;
            case "cache":
                localStorage.removeItem("users");
                localStorage.removeItem("events");
                localStorage.removeItem("currentUser");
                core.initialization();
                console.log("Cache cleared, added "+core.events.length+" events, "+core.users.length+" users");
                break;
            case "addevent":
                window.location.href = "addEvent.html";
                break;
            case "index":
                window.location.href = "index.html";
                break;
        }

        return false;
    }
}