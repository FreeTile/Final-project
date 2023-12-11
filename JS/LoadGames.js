function LoadGames(){
    document.getElementById("Title").innerText = "Games";
    section = document.getElementById("Games");
    section.innerHTML = "";
    let Games = document.createElement('table');
    fetch("https://lime-faithful-hippo.cyclic.app/api/games")
        .then(response => response.json())
        .then(data => {
            let row = Games.insertRow();
            let th1 = document.createElement('th');
            th1.innerHTML = "Game Name";
            let th2 = document.createElement('th');
            th2.innerHTML = "Platform";
            row.appendChild(th1);
            row.appendChild(th2);

            data.forEach(game => {
                let row = Games.insertRow();
                let cell1 = row.insertCell();
                cell1.innerHTML = `<a onclick="LoadLeaderBoard(${game["id"]}), showSection('LeaderBoard')">${game["GameName"]}</a>`;
                let cell2 = row.insertCell();
                cell2.innerHTML = game["Platform"];
            });

            section.appendChild(Games);
            section.innerHTML += `<button type="button" id = "NG" onclick="showSection('NGame')">New Game</button>`;
            let NGbutton = document.getElementById("NG");
            NGbutton.addEventListener('click', function() {
                document.getElementById("Title").innerText = "Add new Game";
            });

        })
        .catch(error => {
            console.error("Server Error", error);
        });
}
