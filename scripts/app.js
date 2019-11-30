new Vue({
    el: '#app',
    data: {
        playerHealth: 100,
        monsterHealth: 100,
        gameIsRunning: false,
        turns: [],
        healUsed: false,
        healCounter: 0,
        specialUsed: false,
        specialCounter: 0
    },
    computed: {
        canHeal: function() {
            if(!this.healUsed ||
                (this.healUsed && this.healCounter >= 2)
            ) {
                return true;
            } else {
                return false;
            }
        },
        canSpecialAttack: function() {
            if(!this.specialUsed ||
                (this.specialUsed && this.specialCounter >= 3)
            ) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        startNewGame: function() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.healUsed = 0;
            this.healCounter = 0;
            this.specialUsed = 0;
            this.specialCounter = 0;
            this.turns = [];
            this.gameIsRunning = true;
        },
        attack: function() {
            let damage = this.rollDice(10);
            this.monsterHealth -= damage;
            this.logAction(damage, "attack", true);
            this.increaseCounters();
            this.monsterAttack();
            this.checkResults();
        },
        specialAttack: function() {
            let damage = this.rollDice(20);
            this.monsterHealth -= damage;
            this.logAction(damage, "special", true);
            this.specialUsed = true;
            this.specialCounter = 0;
            this.increaseCounters();
            this.monsterAttack();
            this.checkResults();
        },
        heal: function() {
            let heal = this.rollDice(8);
            this.playerHealth += heal;
            this.logAction(heal, "heal", true);
            this.healUsed = true;
            this.healCounter = 0;
            this.increaseCounters();
            this.monsterAttack();
            this.checkResults();
        },
        giveUp: function() {
            let percentile = this.rollDice(100);
            if(percentile > 75) {
                this.monsterAttack();
            }
            if(this.playerHealth > 0) {
                if(confirm('You have narrowly escaped the monster. New game?')) {
                    this.startNewGame();
                } else {
                    this.gameIsRunning = false;
                }
            }
            this.checkResults();
        },
        monsterAttack: function() {
            let damage = this.rollDice(12);
            this.playerHealth -= damage;
            this.logAction(damage, "monster", false);
        },
        rollDice: function(die) {
            return Math.floor(Math.random() * die) + 1;
        },
        checkResults: function() {
            if(this.playerHealth > 0 && this.monsterHealth <= 0) {
                if(confirm('You have won! New game?')) {
                    this.startNewGame();
                } else {
                    this.gameIsRunning = false;
                }
            } else if (this.playerHealth <= 0 && this.monsterHealth <= 0) {
                if(confirm('You have both defeated each other with your final blows... New game?')) {
                    this.startNewGame();
                } else {
                    this.gameIsRunning = false;
                }
            } else if (this.playerHealth <= 0 && this.monsterHealth > 0) {
                if(confirm('The monster proved too much for you and you have been defeated... New game?')) {
                    this.startNewGame();
                } else {
                    this.gameIsRunning = false;
                }
            } 
        },
        logAction: function(value, action, isPlayer) {
            let text = "";
            if(isPlayer) {
                switch(action) {
                    case "attack":
                        text = "Player attacks monster for " + value + " points of damage!";
                        break;
                    case "special":
                        text = "Player blasts monster for " + value + " points of special attack damage!";
                        break;
                    case "heal":
                        text = "Players heals themself for " + value + " points of health!";
                        break;        
                }
            } else {
                text = "Monster attacks Player for " + value + " points of crushing damage!";
            }
            this.turns.unshift({
                isPlayer: isPlayer,
                text: text
            });
        },
        increaseCounters: function() {
            if(this.healUsed) {
                this.healCounter++;
            }
            if(this.specialUsed) {
                this.specialCounter++;
            }
        }
    }
});