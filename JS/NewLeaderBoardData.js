document.getElementById("Title").innerText = "New score for ", GameName;
function NewData(id){
    let Data = {
        "gameID": id,
        "player": document.getElementById("Player").value.trim(),
        "score": document.getElementById("Score").value.trim(),
        "time": document.getElementById("Time").value.trim()
    };
    Data["score"] = Data["score"] ? parseInt(Data["score"]) : null;
    const time = /^([0-9]{2}:){3}[0-9]{2}$/;

    if (!Data["player"] || !Data["time"]) {
        alert("Please fill in all fields.");
        return
    } else if (!time.test(Data["time"])){
        alert("Time should be like xx:xx:xx:xx");
        return
    }


    fetch(`https://lime-faithful-hippo.cyclic.app/api/leaderBoard/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(Data)
    })
    .then(data => {
        if (data.ok) {
            document.getElementById("Player").value = "";
            document.getElementById("Score").value = "";
            document.getElementById("Time").value = "";
            showSection("LeaderBoard")
            LoadLeaderBoard(id);
        } else {
            alert("Error adding Score: " + data.error);
        }
    })
    .catch(error => {
        alert("Server Error");
    });
}