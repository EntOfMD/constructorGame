let inquirer = require('inquirer');
let faker = require('faker');

let playersArr = [];

//character object constructor fx
function Character(name, profession, gender, age, strength, hp) {
  this.name = name;
  this.profession = profession;
  this.gender = gender;
  this.age = age;
  this.strength = strength;
  this.hp = hp;
  this.xp = 0;
  this.level = 1;
  this.printStats = function() {
    console.log(`
      STATS FOR THE ${this.name.toUpperCase()}:
        Name: ${this.name},
        Profession: ${this.profession},
        Gender: ${this.gender},
        Age: ${this.age},
        Strength: ${this.strength},
        HitPoints: ${this.hp},
        XP: ${this.xp},
        Level: ${this.level}
        `);
  };
  this.isAlive = function() {
    console.log(
      `${this.hp > 0 ? `${this.name} is alive` : `${this.name} is dead`}`
    );
  };
  this.Attack = function(opponent) {
    this.xp = opponent.strength * 0.1 + this.strength;
    opponent.hp -= this.strength;
    this.strength = opponent.strength * 0.25 + this.strength;
    if (this.xp >= 100) {
      this.levelUp();
    }
    console.log(
      `${this.name} attacked ${opponent.name} with ${this.strength} dmg`
    );
    if (opponent.hp <= 0) {
      opponent.isAlive();
    }
  };
  this.levelUp = function() {
    this.xp = 0;
    this.age++;
    this.strength += 5;
    this.hp += 25;
    this.level += 1;
  };
}

let Rick = new Character('Rick', 'Scientist', 'Male', 100, 100, 999);

let Morty = new Character('Morty', 'Subject', 'Male', 20, 10, 100);
playersArr.push(Rick, Morty);

//seed
function seedChars() {
  for (let i = 0; i < 20; i++) {
    let newChar = new Character(
      faker.name.firstName(),
      faker.name.jobTitle(),
      faker.name.suffix(),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100)
    );
    playersArr.push(newChar);
  }
  console.log('Added 20 new random players');
}

//character creation
function promptCreateChar() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: "What's the Character's name?"
      },
      {
        type: 'input',
        name: 'profession',
        message: "What's the Character's profession?"
      },
      {
        type: 'input',
        name: 'gender',
        message: "What's the Character's gender?"
      },
      {
        type: 'input',
        name: 'age',
        message: "What's the Character's age?",
        validate: function(input) {
          if (parseInt(input)) {
            return true;
          } else {
            console.log('\nType in  an integer\n');
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'strength',
        message: "What's the Character's strength?",
        validate: function(input) {
          if (parseInt(input) || parseFloat(input)) {
            return true;
          } else {
            console.log('\nType in  an integer\n');
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'hp',
        message: "What's the Character's hp?",
        validate: function(input) {
          if (parseInt(input) || parseFloat(input)) {
            return true;
          } else {
            console.log('\nType in  an integer\n');
            return false;
          }
        }
      }
    ])
    .then(answers => {
      let char = new Character(
        answers.name,
        answers.profession,
        answers.gender,
        parseInt(answers.age),
        parseFloat(answers.strength),
        parseFloat(answers.hp)
      );
      playersArr.push(char);
      init();
    });
}

//finds out who is alive currently
function whoIsAlive() {
  if (playersArr.length <= 0) {
    console.log('No players currently');
    init();
  } else {
    for (let key in playersArr) {
      if (playersArr[key].hp > 0) {
        console.log(playersArr[key].name);
      }
    }
  }
  init();
}

function listPlayers() {
  console.log(
    `Found ${playersArr.length} player${playersArr.length > 1 ? 's' : ''}`
  );
  for (let key in playersArr) {
    let player = playersArr[key];
    console.log(`${player.name}`);
  }
  init();
}

function attackPlayer() {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Who is the attacker?',
        name: 'attacker',
        choices: function() {
          let players = [];
          playersArr.forEach(i => {
            if (i.hp > 0) {
              players.push(i.name);
            }
          });
          return players;
        }
      }
    ])
    .then(answer => {
      inquirer
        .prompt([
          {
            type: 'list',
            message: `Who is ${answer.attacker} attacking?`,
            name: 'foe',
            validate: function() {
              for (let key in playersArr) {
                if (
                  playersArr[key].name !== answer.attacker &&
                  playersArr[key].hp > 0
                ) {
                  return true;
                } else {
                  return false;
                }
              }
            },
            choices: function() {
              let foes = [];
              for (let key in playersArr) {
                if (
                  playersArr[key].name !== answer.attacker &&
                  playersArr[key].hp > 0
                ) {
                  foes.push(playersArr[key].name);
                }
              }
              return foes;
            }
          }
        ])
        .then(newAnswer => {
          let attackerObj = {};
          let foeObj = {};

          //Finds if an object exist
          for (let key in playersArr) {
            if (
              playersArr[key].name === answer.attacker &&
              playersArr[key] instanceof Object
            ) {
              attackerObj = playersArr[key];
              // console.log('Attacker = ' + JSON.stringify(attackerObj, null, 2));
              // console.log(attackerObj);
            } else if (
              playersArr[key].name === newAnswer.foe &&
              playersArr[key] instanceof Object
            ) {
              foeObj = playersArr[key];
              // console.log('Foe = ' + JSON.stringify(foeObj, null, 2));
              // console.log(foeObj);
            }
          }

          //prints stats
          attackerObj.printStats();
          foeObj.printStats();

          //attacks
          if (foeObj.hp > 0) {
            attackerObj.Attack(foeObj);
          } else {
            foeObj.isAlive();
          }
          // attackerObj.printStats();
          // foeObj.printStats();
          init();
        });
    });
}

//main menu of the game
function init() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'mainMenu',
        choices: [
          'Create Character',
          'List Players',
          'Who is alive?',
          'Attack',
          'Print Stats',
          'Seed Players',
          'Exit'
        ]
      }
    ])
    .then(answer => {
      switch (answer.mainMenu) {
        case 'Create Character':
          promptCreateChar();
          break;
        case 'List Players':
          if (playersArr.length >= 1) {
            listPlayers();
          } else {
            console.log('No current players');
            init();
          }
          break;
        case 'Who is alive?':
          whoIsAlive();
          break;

        case 'Attack':
          attackPlayer();
          break;

        case 'Print Stats':
          if (playersArr.length >= 1) {
            for (key in playersArr) {
              playersArr[key].printStats();
              console.log('***************');
            }
          }
          init();
          break;
        case 'Seed Players':
          seedChars();
          init();
          break;
        case 'Exit':
          console.log(`Okay Byee!!`);
          process.exit();
          break;
        default:
          console.log('Okay, byee');
          break;
      }
    });
}

// This is how to start the game
init();
