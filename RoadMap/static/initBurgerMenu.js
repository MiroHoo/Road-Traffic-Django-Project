var burger;
var toggleState = false;

function initBurgerMenu() {
    if (toggleState == false) {
        burger = L.BurgerMenu(map, {
            items: {
                Show_Weather: {
                    onClick: function () {
                        showweathertgl();
                    }
                },
                Roadtraffic: {
                    onClick: function () {
                        renderTrafficMessages();
                    }
                },
                RoadWork: {
                    onClick: function () {
                        renderRoadWorks();
                    }
                },
                WeightRestriction: {
                    onClick: function(){
                        renderWeightRestrictions();
                    }
                },
                ExemptedTransport: {
                    onClick: function(){
                        renderExemptedTransport();
                    }
                },
                SearchHistory: { 
                    onClick: function () {
                        openSearchHistory();
                    }
                },
                Login: {
                    onClick: function () {
                        closeelement();
                    }
                },
                Logout: {
                    onClick: function () {
                        logout();
                    }
                },
                
            }
        });
    } else {
        burger = L.BurgerMenu(map, {
            items: {
                TrainStations: {
                    onClick: function () {
                        renderTrainStations();
                    }
                },
                TrainLocations: {
                    onClick: function () {
                        renderTrainLocations();
                    }
                },
                Login: {
                    onClick: function () {
                        closeelement();
                    }
                }
            }
        });
    }
    checkauthentication();  // Check if the user is authenticated
}

async function checkauthentication() {
    const csrfToken = getCookie('csrftoken');
    try {
        const response = await fetch("http://127.0.0.1:8000/user/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            mode: 'same-origin',
        });

        const data = await response.json();

        console.log("Authentication check response:", data);

        if (data.username && data.username !== "") {
            console.log("You are logged in!");
            setlogout();
            return true;
        } else {
            console.log("User is not logged in.");
            return false;
        }
    } catch (error) {
        console.error("There was an error with the connection to our servers.");
        return false;
    }
}