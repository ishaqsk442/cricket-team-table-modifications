const express = require("express");

const app = express();
app.use(express.json());

const path = require("path");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const dbpath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initandStartserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("server running");
    });
  } catch (e) {
    console.log(`${e.message}`);
    process.exit(1);
  }
};

initandStartserver();

app.get("/players/", async (request, response) => {
  const getPlayers = `select * from cricket_team`;

  const results = await db.all(getPlayers);

  response.send(results);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;

  //   console.log(playerDetails);

  const { playerName, jerseyNumber, role } = playerDetails;

  const addDetails = `INSERT INTO cricket_team (player_name,jersey_number,role)
     VALUES
    (${playerName},${jerseyNumber},${role})`;

  const results = await db.run(addDetails);

  //   const id = result.lastId;

  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getplayer = `select * from cricket_team where player_id = ${playerId}`;

  const player = await db.get(getplayer);
  response.send(player);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const playerDetails = request.body;

  const { playerName, jerseyNumber, role } = playerDetails;

  const updated = `
    UPDATE cricket_team SET player_name = '${playerName}',jersey_number = ${jerseyNumber},role = '${role}'
    where player_id = ${playerId}
    `;
  await db.get(updated);

  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const query = `delete from cricket_team where player_id = ${playerId};`;

  await db.run(query);
  response.send("Player Removed");
});
module.exports = app;
