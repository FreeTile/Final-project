let GameId = 0;
let GameName = ""
function LoadLeaderBoard(id){
    section = document.getElementById("LeaderBoard");
    document.getElementById("Title").innerText = "";
    section.innerHTML = "";
    let LeaderBoard = document.createElement('table');
    fetch(`https://lime-faithful-hippo.cyclic.app/api/leaderBoard/${id}`)
        .then(response => response.json())
        .then(data => {
            let row = LeaderBoard.insertRow();
            let th1 = document.createElement('th');
            th1.innerHTML = "Player";
            let th2 = document.createElement('th');
            th2.innerHTML = "Score";
            let th3 = document.createElement('th');
            th3.innerHTML = "Time";
            row.appendChild(th1);
            row.appendChild(th2);
            row.appendChild(th3);


            data["Leaderboard"].forEach(game => {
                let row = LeaderBoard.insertRow();
                let cell1 = row.insertCell();
                cell1.innerHTML = game["Player"];
                let cell2 = row.insertCell();
                cell2.innerHTML = game["Score"];
                let cell3 = row.insertCell();
                cell3.innerHTML = game["Time"];
            });

            GameId = id;
            GameName = data["GameName"];
            document.getElementById("Title").innerText = GameName;
            section.appendChild(LeaderBoard);

            section.innerHTML += `<button type="button" id = "NGData" onclick="showSection('NData')">New Score</button>`;
            let LBbutton = document.getElementById("NGData");
            LBbutton.addEventListener('click', function() {
                document.getElementById("Title").innerText = "New score for " + GameName;
            });
        })
        .catch(error => {
            console.error("Server Error", error);
        });
}