n2win = 20;
nSequence = 0;
tSeq = 500; //milliseconds
colorSequence = ["green", "red","yellow","blue"];
strictMode = false;
gameState = 0; // is game on or off

function Model() {
  this.outSequence = [];
  var self = this;
  this.nextIndex = 0; //next index to check in sequence
  this.addToSequence = function(){
    //add one color (and sound) to sequence
      nSequence += 1;
      var ind = Math.floor(Math.random()*4);
      var chosenColor = colorSequence[ind];
      self.outSequence.push(chosenColor);
      return self.outSequence;
    }
    
   
 

this.resetSequence = function(){
  self.outSequence = [];
  nSequence = 0;
}

  this.checkNext = function(color) {
    if (color == self.outSequence[self.nextIndex]) {
      self.nextIndex++;
      return true;
      
    } else {
      return false;
    }
  }
    

}

function View() {
  var self = this;
  
  this.lightButton = function(id, sp) {
    // this method returns a promise, it does not fire animation immediately
    //var col = $("#"+id).css("background-color");
   
    switch (id) {
      case "green":
          var col = "#01FF16";
          var lightCol = "#BAFFC0";
          var sound = 2;
        break;
      case "red":
          var col = "#FF0000"; 
          var lightCol = "#FFABAB";
          var sound = 1;
       
        break;
      case "yellow":
          var col = "yellow"; 
          var lightCol = "#FEFFBB";
          var sound = 3;
        break;
      case "blue":
          var col = "blue"; 
          var lightCol = "#ADD8E6";
          var sound = 4;
        break;
           };
   
    return new Promise(function(resolve, reject) {
      var audioTag = id + "_sound";
      
     if (gameState == 1) {
      $("#"+audioTag).get(0).play(); //play sound corresponding to color;
      $("#"+id).animate({
        backgroundColor: lightCol},100).delay(
        sp).animate({backgroundColor: col},100, function(){resolve()});
    } else {
      reject("game stopped");
    }
    
    })
 
  }
  
  this.message = function(msg) {
    $("#message").text(msg);
  }
   
}

function Controller(model,view){
  
  
  self = this;
  
  this.playSequence = function(sp) {
   
    self.disableButtons();
    //play color sequence
    (model.outSequence).reduce(function(prev,cur){
      return prev.then(function(){return view.lightButton(cur,sp)}).catch(function(e) {console.log(e);})
    }, Promise.resolve());
    self.enableButtons();
     model.nextIndex = 0;
  };
  
  
  this.enableButtons = function() {
    $("#green").on("click",function(){self.getButtonClick("green");});
    $("#red").on("click",function(){self.getButtonClick("red");});
    $("#blue").on("click",function(){self.getButtonClick("blue");});
    $("#yellow").on("click",function(){self.getButtonClick("yellow");});
    
  }; //enable button clicking
  

  this.getButtonClick = function(color) {
    
    view.lightButton(color,tSeq);
    //check nseq index
    var chk = model.checkNext(color);
    console.log(model.outSequence);
    if (chk) {
            //alert("right color!");
              if (model.nextIndex == model.outSequence.length) {
                    if ((model.nextIndex) == n2win) {
                      view.message("You won!");
                      model.resetSequence();
                      
                      setTimeout(self.stDebug, 1500);
                    }
                      else{
                      setTimeout(self.stDebug,1500); }
                    }
             
             } else if (!strictMode) {
               //self.disableButtons();
               view.message("Wrong!");
               
              
              setTimeout(function(){
                view.message(model.outSequence.length);
                self.playSequence(tSeq);
              },1500); // will this work ?
              //self.checkSequence();
              
             } else {
               view.message("Nein!");
               model.resetSequence();
               setTimeout(self.stDebug, 1500);
              
             }
    
    
    
  }; 
  
  this.disableButtons = function() {
    $("#green").off();
    $("#red").off();
    $("#blue").off();
    $("#yellow").off();
  }; //disable button clicking
  
  this.win = function(){
    alert('You won!');
    self.startGame();
  }
  
  this.stDebug = function() {
   // model.resetSequence();
    gameState = 1;
    model.addToSequence();
    view.message(model.outSequence.length);
    self.playSequence(tSeq);
    //self.enableButtons();
    //self.checkSequence();
  }
 
          
    
  this.stopGame = function() { //to be implemented
    gameState = 0;
    view.message("--");
    self.disableButtons();
  }
  
  }
  
 

$(document).ready(function(){
  
  /*TODO:
  

  -rework graphics;
  -take off debugging statements, increase n2win to 20
  -DONE
  */
 
  var model = new Model();
  var view = new View();
  var controller = new Controller(model,view);

 //model.outSequence = ["red","blue"];
 model.resetSequence();
  //controller.playSequence();
  $("#start").on("click",model.resetSequence);
 $("#start").on("click",controller.stDebug);
  
  $("#stop").on("click",controller.stopGame);
  $("#strict").on("click", function(){
    if (strictMode == false) {
    strictMode = true; $("#strict").addClass("button-on"); 
    } else {
    strictMode = false; $("#strict").removeClass("button-on");
    }
  
  console.log(strictMode);
  });
  
  
  
})