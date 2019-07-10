let inquirer = require('inquirer');

let playersArr = [];

//character object constructor fx
function Character(name, profession, gender, age, strength, hp) {
  this.name = name;
  this.profession = profession;
  this.gender = gender;
  this.age = age;
  this.strength = strength;
  this.hp = hp;
  this.printStats = function() {
    console.log(`
      STATS FOR THE CHARACTER:
        Name: ${this.name},
        Profession: ${this.profession},
        Gender: ${this.gender},
        Age: ${this.age},
        Strength: ${this.strength},
        HitPoints: ${this.hp}
        `);
  };
  this.isAlive = function() {
    console.log(
      `${this.hp > 0 ? `${this.name} is alive` : `${this.name} is dead`}`
    );
  };
  this.Attack = function(opponent) {
    opponent.hp -= this.strength;
    console.log(
      `${this.name} attacked ${opponent.name} with ${this.strength} dmg`
    );
  };
  this.levelUp = function() {
    this.age++;
    this.strength += 5;
    this.hp += 25;
  };
}

// let Rick = new character('Rick', 'Scientist', 'Alien', 100, 100, 999);

// let Morty = new character('Morty', 'morty', 'Male', 20, 10, 100);

// Rick.printStats();
// Morty.printStats();

// Morty.Attack(Rick);
// Rick.printStats();
// Rick.isAlive();

// Morty.levelUp();
// Morty.printStats();

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
}

function listPlayers() {
  console.log(
    `Found ${playersArr.length} player${playersArr.length > 1 ? 's' : ''}`
  );
  for (let key in playersArr) {
    let player = playersArr[key];
    console.log(`${JSON.stringify(player, null, 2)}`);
  }
  init();
}

//main menu of the game
function init() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'createChar',
        choices: [
          'Create Character',
          'List Players',
          'Who is alive?',
          'Attack',
          'Level Up',
          'Print Stats',
          'Exit'
        ]
      }
    ])
    .then(answer => {
      switch (answer.createChar) {
        case 'Create Character':
          promptCreateChar();
          break;
        case 'List Players':
          if (playersArr.length >= 1) {
            listPlayers();
          } else {
            console.log("There aren't any current players");
            init();
          }
          break;
        case 'Who is alive?':
          whoIsAlive();
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

init();
