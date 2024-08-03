


var roundtripButton = document.querySelector("#round-trip");
roundtripButton.addEventListener("click", ()=>{
    
    document.querySelector("#arrival-date").disabled = false;
    document.querySelector("#arrival-date").type="date";
    console.log("XX");
    
});

var onewaytripButton = document.querySelector("#one-way-trip");
onewaytripButton.addEventListener("click", ()=>{
    
    document.querySelector("#arrival-date").disabled = true;
    document.querySelector("#arrival-date").type="text";
    document.querySelector("#arrival-date").value = "SELECT ROUND TRIP";
    console.log("XX");
    
});

