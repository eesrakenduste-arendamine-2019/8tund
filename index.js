/*jshint esversion:6*/
class Typer{
  constructor(){
    this.wordsInGame = 5;
    this.startingWordLength = 5;
    this.wordsTyped = 0;
    this.wordDiv = $('#wordDiv');
    this.words = [];
    this.typeWords = [];
    this.word = "sõna";
    this.init();
  }

  init(){
    $.get("lemmad2013.txt", (data)=>this.getWords(data));
  }

  getWords(data){
    const dataFromFile = data.split('\n');
    //console.log(dataFromFile);
    this.separeteWordsByLength(dataFromFile);
  }

  separeteWordsByLength(data){
    for(let i = 0; i < data.length; i++){
      const wordLength = data[i].length;
      if(this.words[wordLength] === undefined){
        this.words[wordLength] = [];
      }
      this.words[wordLength].push(data[i]);
    }
    console.log(this.words);
    this.startTyper();
  }

  startTyper(){
    console.log("asdasd");
    this.generateWords();

    $(document).on('keypress', (e)=>this.shortenWord(e.key));
  }

  generateWords(){
    let typeWords = [];
    for(let i = 0; i < this.wordsInGame; i++){
      const wordLength = this.startingWordLength + i;
      const randomWord = Math.round(Math.random()*this.words[wordLength].length);
      this.typeWords[i] = this.words[wordLength][randomWord];
    }

    console.log(this.typeWords);
    this.selectWord();
  }

  selectWord(){
      this.word = this.typeWords[this.wordsTyped];
      this.drawWord(this.word);
  }

  drawWord(){
    console.log(this.wordsTyped, this.wordsInGame);
    if(this.wordsTyped != this.wordsInGame){
      this.wordDiv.html(this.word);
    }else{
      $(document).off('keypress');
      this.startNewGame();
    }
  }

  shortenWord(keypressed){
    console.log(keypressed);
    if(this.word.length > 1 && this.word.charAt(0)==keypressed){
      this.word = this.word.slice(1);
      this.drawWord();
    } else if(this.word.length == 1 && this.word.charAt(0)==keypressed){
      this.wordsTyped++;
      this.generateWords();
    }
  }

  startNewGame(){
    let newGame = confirm("Alusta uut mängu?");
    if(newGame == true){
      this.startTyper();
    } else {
      this.wordDiv.html("GAME OVER");
    }
  }
}

const typer = new Typer();
prompt("Please enter your name", "Harry Potter");

// kuvatakse trükitud sõnade arvu ja trükkimisele minevate sõnade arvu üleval vasakul nurgas "2 sõna 15-st trükitud."
// valesti tähe trükkimisel muudab taust/sõna korraks värvi
// moodustatakse edetabel kõige kiiremini sõnad trükkinud inimestest
// Kasutaja saab ise valida kui palju sõnu trükkida tahab
