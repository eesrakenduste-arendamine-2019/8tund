/*jshint esversion:6*/
let name = prompt("Palun sisesta enda nimi");

class Typer{
  constructor(name){
    this.name = name;
    this.wordsInGame = 15;
    this.startingWordLength = 5;
    this.wordsTyped = 0;
    this.words = [];
    this.typeWords = [];
    this.word = "sõna";
    this.startTime = 0;
    this.endTime = 0;
    this.results = JSON.parse(localStorage.getItem("score")) || [];
    this.init();
  }

  init(){
    $.get("lemmad2013.txt", (data)=>this.getWords(data));
    $('#show-results').on('click', ()=>this.showResults());
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
    //console.log(this.words);
    this.startTyper();
  }

  startTyper(){
    this.generateWords();
    this.showInfo();
    this.startTime = performance.now();
    $(document).on('keypress', (e)=>this.shortenWord(e.key));

  }

  generateWords(){
    let typeWords = [];
    for(let i = 0; i < this.wordsInGame; i++){
      const wordLength = this.startingWordLength + i;
      const randomWord = Math.round(Math.random()*this.words[wordLength].length);
      this.typeWords[i] = this.words[wordLength][randomWord];
    }
    //console.log(this.typeWords);
    this.selectWord();
  }

  showInfo(){
    $('#info').html(this.wordsTyped+"/"+this.wordsInGame);
  }

  selectWord(){

      this.word = this.typeWords[this.wordsTyped];
      this.drawWord(this.word);
  }

  drawWord(){
    //console.log(this.wordsTyped, this.wordsInGame);
    $('#wordDiv').html(this.word);
  }

  shortenWord(keypressed){
    //console.log(keypressed);
    if(this.word.length > 1 && this.word.charAt(0) == keypressed){
      this.word = this.word.slice(1);
      this.drawWord();
    } else if(this.word.length == 1 && this.word.charAt(0) == keypressed && this.wordsTyped != this.wordsInGame-1){
      this.wordsTyped++;
      this.showInfo();
      this.selectWord();
    } else if(this.word.charAt(0) != keypressed){
      $("#container").css({"background-color":"red"});
      setTimeout(function(){
        $("#container").css({"background-color":"#ddd"});
      }, 100);
    } else if(this.word.length == 1 && this.word.charAt(0)==keypressed && this.wordsTyped == this.wordsInGame-1){
      this.endTime = performance.now();
      $('#score').html(this.name + ", sul kulus aega " + this.wordsInGame + " sõna kirjutamiseks " + (Math.round((this.endTime - this.startTime))/1000) + " sekundit.");
      $('#wordDiv').html("Vajuta enter-klahvi, et uuesti alustada.");
      this.wordsTyped++;
      this.showInfo();
      this.saveResult();
      $(document).off('keypress');
      $(document).on('keypress', (e)=>this.startNewGame(e.key));
    }
  }

  showResults(){
    $('#results').fadeToggle();
    if($('#show-results').html() == "X"){
      $('#show-results').html("TOP 15");
    }else{
      $('#show-results').html("X");
    }
    $('#results').html("");
    $('#results').html("<h1>Edetabel<h1>");
    for(let i = 0; i<=15; i++){
      $('#results').append((i+1) +". "+this.results[i].name + " " + this.results[i].time + "<br>");
    }
  }

  saveResult(){
    let result = {
      name: this.name,
      time: (Math.round((this.endTime - this.startTime))/1000)
    };

    this.results.push(result);
    this.results.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    localStorage.setItem("score", JSON.stringify(this.results));
    console.log(this.results);
  }

  startNewGame(keypressed){
    if(keypressed == "Enter"){
      this.wordsTyped = 0;
      $(document).off('keypress');
      $('#score').html("");
      this.startTyper();
    }
  }
}

let typer = new Typer(name);
