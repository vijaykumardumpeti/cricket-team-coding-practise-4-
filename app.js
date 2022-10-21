//importing the express third-party-package from NPM
//express is a "server-side web frame-work" & it is used to
//make API-calls(Application Process Interface-[users/server ===> server])
let express = require("express");
let app = express();

//during POST method
//for recognise the json object and parses it(middleware)
app.use(express.json());

module.exports = app;

let path = require("path");

// sqlite3 => is a tool is used to excute queries towards Database
//sqlite => SQLite package provides multiple methods to execute SQL queries on a database
let sqlite3 = require("sqlite3");
let { open } = require("sqlite");

//here "__dirname" is gives the path of DATABASE(cricketTeam.db)
let dbpath = path.join(__dirname, "cricketTeam.db");

//intializing(getting accessing from database or getting database object to manupulate upon database)
//and starting the server-thats listen to port no:3000

let db = null;
let intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server started at: https:localhost:3000");
    });
  } catch (e) {
    console.log(`Db Error: ${e.message}`);
    process.exit(1);
  }
};

intializeDBAndServer();
//API-call [GET]

app.get("/players/", async (request, response) => {
  let getPlayersQuery = `
        SELECT 
        *
        FROM
        cricket_team
 
    `;
  let playerArray = await db.all(getPlayersQuery);
  response.send(playerArray);
});

//API -call [POST]
//1)=> give the middle-ware(which recognises the json-object & parses it)

app.post("/players/", async (request, response) => {
  let playerDetails = request.body;
  let { playerName, jerseyNumber, role } = playerDetails;

  let addPlayerQuery = `
        INSERT INTO 
        cricket_team (player_name,jersey_number, role)
        VALUES 
        (
            ${playerName},
            ${jerseyNumber},
            ${role}
        );
    `;
  await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//API-call player:id [GET]

app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let getPlayerDetailsQuery = `
        SELECT 
        *
        FROM 
        cricket_team 
        WHERE
        player_id = ${playerId};
    `;
  let playerDetails = await db.get(getPlayerDetailsQuery);
  let object = {
    playerId: playerDetails.player_id,
    playerName: playerDetails.player_name,
    jerseyNumber: playerDetails.jersey_number,
    role: playerDetails.role,
  };

  response.send(object);
});

//API-call player:id [PUT]

app.put("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let {playerName,jerseyNumber,role}=request.body;

  let updatePlayersQuery = `
  UPDATE 
  cricket_team 
  SET
  playerName = ${playerName},
  jerseyNumber = ${jerseyNumber},
  role = ${role}
  WHERE 
  player_id = ${playerId}; 

  `;

  await db.run(updatePlayersQuery);
  response.send("Player Details Updated");
});


//API-call player:id [DELETE]

app.delete("/player/:playerId/", async (request,response)=>{
    let {playerId} = request.params;
    let deletePlayerQuery = `
        DELETE 
        FROM 
        cricket_team
        WHERE 
        player_id = ${playerId};
    `;
    await db.run(deletePlayerQuery)
    response.send("Player Removed");
});
