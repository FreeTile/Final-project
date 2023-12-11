document.getElementById("Title").innerText = "AddGame";
function AddGame(){
    let gameData = {
        "name": document.getElementById("GameName").value.trim(),
        "platform": document.getElementById("Platform").value.trim()
    };

    if (!gameData["name"] || !gameData["platform"]) {
        alert("Please fill in all fields.");
        return;
    }

    fetch("https://lime-faithful-hippo.cyclic.app/api/games", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(gameData)
    })
    .then(data => {
        if (data.ok) {
            document.getElementById("GameName").value = "";
            document.getElementById("Platform").value = "";
            showSection("Games")
            LoadGames();
        } else {
            alert("Error adding game: " + data.error);
        }
    })
    .catch(error => {
        alert("Server Error");
    });
}
