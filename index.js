const api_key = "abb3832d5557f9cc0db254d5a79cf470";
// const url = `https://api.openweathermap.org/data/2.5/weather?q=${}&appid=${api_key}&units=metric`;
// url for 5 days = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}&units=metric"
// url 5 days by city = "https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid={API key}&units=metric"
// url for latitude and logitue = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
// to get icon of weather = var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
// working icon link = https://openweathermap.org/img/w/04d.png;






document.getElementById("city").addEventListener("keypress", function(event){
    if (event.key === "Enter") {
      event.preventDefault();
        getWeather();
    }
  });
  
async function getWeather() {
    let city = document.getElementById("city").value;
    document.getElementById("forecast7days").innerText = "";
    document.getElementById("forecast").innerHTML = "";
    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`);
        let res1 = await res.json();
        // console.log(res1);
        // if (res1.main != undefined) {

        // }
        appendIt(res1);

    } catch (err) {
        console.log("error:- ", err);
        // let city = document.getElementById("city").value;
        let content = document.getElementById("content");
        let card = `<h2 id="cityHeading">Wrong city Entered ${city}</h2>`
        content.innerHTML = card;
        // document.querySelector(".mapouter").innerHTML = "";
        document.getElementById("forecast7days").innerText = `Wrong city Entered ${city}`;
    }

/// 7 days weather-----------------------------------
    try{
        // let chk = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`);
        let chk = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`);
        let chk1 = await chk.json();
        // console.log(chk1, "+++++++++++++++++++++++");

        append7Days(chk1);
    }catch(err){
        console.log("error:- ", err);
    }
    document.getElementById("city").value = "";
}


// auto location tracking


function getPosition() {
    async function success(pos) {
        const crd = pos.coords;

        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        try {
            let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=${api_key}&units=metric`);
            let res1 = await res.json();
            appendIt(res1);
        } catch (err) {
            console.log("error:- ", err);
            let content = document.getElementById("content");
            let card = `<h2 id="cityHeading">Could Not fetch location..!</h2>`
            content.innerHTML = card;
            
        }


// 7 days weather-------------------------------------
        try{
            let chk = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${crd.latitude}&lon=${crd.longitude}&appid=${api_key}&units=metric`);
            let chk1 = await chk.json();
            // console.log(chk1, "---------------");
            append7Days(chk1);
        }catch(err){
            console.log("error:- ", err);
        }
    }

    navigator.geolocation.getCurrentPosition(success);
}


function appendIt(res1) {
    if(res1.name==undefined){
        throw(new Error("Wrong city entered"));
        // return;
    }
    // console.log(res1, "111111111111111111111111111111");

    if(res1.name != undefined){
        document.getElementById("forecast7days").innerText = `7 Days forecast of your city ${res1.name}`;
    }

    let currentdate = new Date(); 
    
    let content = document.getElementById("content");
    let gmap_canvas = document.getElementById("gmap_canvas");
    let card = `<p id="date">${currentdate}</p>
        <h2 id="cityHeading">${res1.name}</h2>
        <div id="temp"><img src="https://openweathermap.org/img/w/${res1.weather[0].icon}.png">  <p>${res1.main.temp} °C</p></div>
        <div id="desc"><p>Feels like ${res1.main.feels_like} °C ${res1.weather[0].description}</p></div>
        
        <div id="humidity"><p>Humidity: ${res1.main.humidity}%</p>
        <p><i class="fa-solid fa-wind"></i> Winds: ${res1.wind.speed} m/s</p>
        </div>`
//////////////////////////////////////////////////////////////////////////////////////////////////////
    content.innerHTML = card;
    // let city = res1.name;
    // console.log(city, "--------------")
    gmap_canvas.src = `https://maps.google.com/maps?q=${res1.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
}



function append7Days(data){
    if(data.list==undefined){
        throw(new Error("Wrong City entered"));
        // return;
    }
    // console.log(data.list);
    var forecastBox = document.getElementById("forecast");
    forecastBox.innerHTML = "";
    let app = "";
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for(var i=0; i<data.list.length; i=i+8){
        let d = new Date(data.list[i].dt * 1000);
        let dayName = days[d.getDay()];
        // console.log(dayName)

        app = app + `<div>
        <h2>${dayName}</h2>
        <img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="">
        <h2>${data.list[i].main.temp_max} °</h2>
        <h2>${data.list[i].main.temp_min} °</h2>
    </div>`
    }


    let d = new Date(data.list[data.list.length-1].dt * 1000);
        let dayName = days[d.getDay()];
        // console.log(dayName)
        app = app + `<div>
        <h2>${dayName}</h2>
        <img src="https://openweathermap.org/img/w/${data.list[data.list.length-1].weather[0].icon}.png" alt="">
        <h2>${data.list[data.list.length-1].main.temp_max} °</h2>
        <h2>${data.list[data.list.length-1].main.temp_min} °</h2>
    </div>`

    forecastBox.innerHTML = app;
    // data.list.map(function(elem){
    //     let d = new Date(elem.dt * 1000);
    //     let dayName = days[d.getDay()];
    //     console.log(dayName)
    // })
    
}