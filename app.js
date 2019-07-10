let inquirer = require('inquirer');

let playersArr = [];

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
        message: "What's the Character's age?"
      },
      {
        type: 'input',
        name: 'strength',
        message: "What's the Character's strength?"
      },
      {
        type: 'input',
        name: 'hp',
        message: "What's the Character's hp?"
      }
    ])
    .then(answers => {
      let char = new Character(
        answers.name,
        answers.profession,
        answers.gender,
        answers.age,
        answers.strength,
        answers.hp
      );
      playersArr.push(char);
      console.log(playersArr);
      init();
    });
}
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
          if (playersArr.length > 1) {
            JSON.stringify(playersArr, null, 2);
          } else {
            console.log("There aren't any current players");
            init();
          }
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
