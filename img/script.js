// $("document").ready(function() {

  console.log("all systems go!");
  // variable declarations
  var deck = []; // use a temporary deck that can be re-shuffled
  var dealerCards = [];
  var playerCards = [];
  var playerCardsSplit = [];
  var totalCards;
  var amountLeft = 500;
  var bet;
  var betSplit = 0;
  var splitOn = false;

  // Starting game - hide buttons except deal
  $("#hit").hide();
  $("#stand").hide();
  $("#double").hide();
  $("#split").hide();
  $("#hint").hide();
  console.log("deck length:", deck.length);
  displayAmtLeft();
  $("#hintModal").css("display", "block");


// These are event listeners for all buttons
// =========================================
  $("#dealCards").click(function(e) {
    e.preventDefault();
    console.log("DEAL click");
    totalCards = 1;  // starting total number of player cards at value of 1 (two cards: zero, one)
    placeBet();
    shuffleCards();
    clearCards();
    clearScoreMessages();
    startingCards();
    $("#dealCards").hide();  // hide the deal button just clicked.
    $("#hit").show();   // unhide the buttons necessary for gameplay.
    $("#stand").show();
    $("#double").show();
    $("#hint").show();
  });


  $("#hit").click(function(e) {
    e.preventDefault();
    console.log("HIT click");
    playerHit();
  });

  $("#stand").click(function(e) {
    e.preventDefault();
    stand();
  });

  $("#double").click(function(e) {
    e.preventDefault();
    doubleDown();
  });

  $("#split").click(function(e) {
    e.preventDefault();
    split();
  });

  $("#hint").click(function(e) {
    e.preventDefault();
      checkForHints();
      $("#hintModal").css("display", "block");
  });


// pull a random card and removes it from the deck array
  function generateRandomCard() {
    var rand = Math.round(Math.random() * (deck.length-1));
    var aCard = deck[rand];
    console.log("aCard:",aCard);
    deck.splice(rand,1);  // pulled from deck
    return aCard;
  }

  // starting deal. I believe this needs to be different from
  // other functions in that there's no other time one card (dealer's) needs
  // to be generated, but placed "facedown"
  // ** will re-examine this assumption at a later time **
  function startingCards() {
    dealerCards.push(generateRandomCard());
    dealerCards.push(generateRandomCard());
    playerCards.push(generateRandomCard());
    playerCards.push(generateRandomCard());
    // playerCards.push(deck[0]);
    // playerCards.push(deck[deck.length-1]);
    // playerCards.push(deck[4]);
    // playerCards.push(deck[5]);
    displayCards(dealerCards,playerCards);
  }

  function displayCards(dcards,pcards) {
    console.log("dealerCards ", dealerCards);
    $(".dealerCard").eq(0).attr("src", "img/red.jpg");
    $(".dealerCard").eq(1).attr("src", dcards[1].img);
    $(".playerCard").eq(0).attr("src", pcards[0].img);
    $(".playerCard").eq(1).attr("src", pcards[1].img);
    showPlayerScore(playerCards);  // ** ???
  }

  // calculate the value of a hand, taking into account handling aces
  function calculateScore(cards) {
    var minScore = 0;
    cards.forEach(function(card) {
      minScore += card.value;
    });

    var maxScore = minScore;
    cards.forEach(function(card) {
      // checks if setting an ace value to 11 busts the hand.
      // if not, add 10 to value of ace.
      if (card.value === 1 && maxScore + 10 <= 21) {
        maxScore += 10;
      }
    });
    console.log("maxscore", maxScore);
    return maxScore;
  }

  function showPlayerScore(cards) {
    playerScore = calculateScore(cards);
    if (!splitOn) {
      $("#playerScore").html(playerScore);
    } else if (splitOn) {
      $("#playerSplitScore").html(playerScore);
    }
    evaluateOptions(playerScore,cards);
  }

  function evaluateOptions(score,cards) {
    // $("#playerScore").html(score);
    if (score === 21 && totalCards === 1) {
      console.log("BLACKJACK");
      $("#results").html("BLACKJACK!");
      blackjack(cards);
    } else if (score === 21) {
      console.log("auto-stand");
      stand();
    } else if (score > 21) {
      stand();
    } else if (score < 21) {
      if ((cards[0].value === cards[1].value) && totalCards == 1) {
        $("#split").show();
      }
    } else {
      console.log("something is broken");
    }
  }

  // Game action ===============================================
  function playerHit() {
    disableFirstCardOptions()
    totalCards++
    if (!splitOn) {
      playerCards.push(generateRandomCard());
      $(".playerCard").eq(totalCards).attr("src", playerCards[totalCards].img);
      showPlayerScore(playerCards);
    } else if (splitOn) {
      playerCardsSplit.push(generateRandomCard());
      $(".playerCardSplit").eq(totalCards).attr("src", playerCardsSplit[totalCards].img);
      showPlayerScore(playerCardsSplit);
    }
  }

  function doubleDown() {
    bet *= 2;
    playerHit();  // player should only get one card on a double down.
    stand();
  }

  function split() {
    $("#split").attr("disabled","disabled");
    $("#double").attr("disabled","disabled"); // **temporary
    betSplit = bet;
    amountLeft -= betSplit;
    displayAmtLeft();
    playerCardsSplit.push(playerCards.pop());
    playerCards.push(generateRandomCard());
    $(".playerCard").eq(1).attr("src", playerCards[1].img);
    $(".playerCardSplit").eq(0).attr("src", playerCardsSplit[0].img);
    showPlayerScore(playerCards);
  }


  function stand() {
    console.log(playerCardsSplit.length);
    console.log(splitOn);
    if (betSplit !== 0 && !splitOn) {
      console.log("standing with split to go");
      totalCards = 1;
      splitOn = true;
      playerCardsSplit.push(generateRandomCard());
      console.log(playerCards)
      $(".playerCardSplit").eq(1).attr("src", playerCardsSplit[1].img);
      showPlayerScore(playerCardsSplit);
    } else {
      console.log("stand - no split");
      disableHitStand();
      setTimeout(dealtoDealer, 100);
      clearTimeout();
    }
  }

  //  Game Action ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  // these are options that can only be played on first player decision
  function disableFirstCardOptions() {
    $("#double").attr("disabled","disabled");
    $("#split").attr("disabled","disabled");
  }

  function disableHitStand() {
    $("#hit").attr("disabled","disabled");
    $("#stand").attr("disabled","disabled");
  }

  function showHoleCard() {
    $(".dealerCard").eq(0).attr("src", dealerCards[0].img);
  }

  function dealtoDealer() {
    var counter = 2;
    var dealerScore = calculateScore(dealerCards);
    showHoleCard();
    while (dealerScore < 17) {
      console.log("dealer",dealerCards);
      dealerCards.push(generateRandomCard());
      $(".dealerCard").eq(counter).attr("src", dealerCards[counter].img);
      dealerScore = calculateScore(dealerCards);
      counter++;
    }
    $("#dealerScore").html(dealerScore);
    if (splitOn) {
      detectWin(playerCardsSplit);
    }
    detectWin(playerCards);
  }

  function detectWin(cards) {
    console.log("detect win; are these true/false?");
    console.log(cards === playerCardsSplit);
    console.log(cards === playerCards);
    playerScore = calculateScore(cards);
    dealerScore = calculateScore(dealerCards);
    if (playerScore > 21) {  // no way to win if player busts. This is needed here to evaluate double-down options
        playerBust(cards);
    } else if (dealerScore > 21) {
        dealerBust(cards);
    } else if (playerScore == 21 && totalCards == 1) {
      if (dealerScore == 21) {
        setTimeout(playerPush, 100);
        clearTimeout();
      } else {
        blackjackWin(cards);
      }
    } else if (playerScore > dealerScore) {
        playerWin(cards);
    } else if (playerScore < dealerScore) {
        playerLose(cards);
    } else if (playerScore === dealerScore) {
        playerPush(cards);
    } else {
      // wtf moment
      console.log("broken detect win function!");
    }
  }

  function blackjack(cards) {
    if (cards === playerCards && betSplit != 0) {
      detectWin(playerCardsSplit);
    } else {
      disableHitStand();
      showHoleCard();
      detectWin(playerCards);
    }
  }

// Game results and payouts ====================
  function playerBust(cards) {
    if (cards == playerCardsSplit) {
      $("#playerSplitResults").html("This hand BUST!")
      detectWin(playerCards);
    } else {
      disableHitStand();
      $("#playerResults").html("Player BUST!");
      nextGame();
    }
  }

  function dealerBust(cards) {
    var win = bet*2;
    if (cards === playerCardsSplit) {
      $("#dealerResults").html("Dealer Bust.");
      $("#playerSplitResults").html("Player win $ " + win + "!")
      winBet(win);
      detectWin(playerCards);
    } else {
      $("#dealerResults").html("Dealer Bust.");
      $("#playerResults").html("Player win $ " + win + "!")
      winBet(win);
      nextGame();
    }
  }

  function playerWin(cards) {
    var win = bet*2;
    if (cards === playerCardsSplit) {
      $("#playerSplitResults").html("Player win $ " + win +"!");
      winBet(win);
      detectWin(playerCards);
    } else {
      $("#playerResults").html("Player win $ " + win +"!");
      winBet(win);
      nextGame();
    }
  }

  function playerLose(cards) {
    if (cards === playerCardsSplit) {
      $("#playerSplitResults").html("This hand lose.")
      detectWin(playerCards);
    } else {
      $("#playerResults").html("Player lose.");
      nextGame();
    }
  }

  function playerPush(cards) {
    if (cards === playerCardsSplit) {
      $("#playerSplitResults").html("Push.");
      winBet(bet);
      detectWin(playerCards);
    } else {
      $("#playerResults").html("Push.");
      winBet(bet);
      nextGame();
    }
  }

  function blackjackWin(cards) {
    var win = (bet*3/2)+bet
    if (cards === playerCardsSplit) {
      $("#playerResults").html("BLACKJACK! Player win $ " + win + "!");
      setTimeout(detectWin(playerCards), 200);  //need a quick timout to delay DOM
      clearTimeout();
      amountLeft += win;
      displayAmtLeft();
    } else {
      $("#playerResults").html("BLACKJACK! Player win $ " + win + "!");
      setTimeout(nextGame, 200);  //need a quick timout to delay DOM
      clearTimeout();
      amountLeft += win;
      displayAmtLeft();
    }
  }

// duplicate win results - temporary
  function blackjackSplitWin() {
    var win = (betSplit*3/2)+betSplit


  }

  function displayAmtLeft() {
    $("#available").html(amountLeft);
  }

  function placeBet() {
    bet = parseInt($("#bet").val());
    $("#bet").prop("disabled",true);
    amountLeft -= bet;
    displayAmtLeft();
  }

  function winBet(amt) {
    amountLeft += amt;
    displayAmtLeft();
  }
// Game results and payouts ^^^^^^^^^^^^^^^^^^^^^^^^^


// reset settings fucntions for next game  =====
  function nextGame() {
    console.log("deck",deck.length);
    dealerCards = [];
    playerCards = [];
    playerCardsSplit = [];
    bet = 0;
    betSplit = 0;
    splitOn = false;
    $("#hit").removeAttr("disabled");
    $("#stand").removeAttr("disabled");
    $("#double").removeAttr("disabled");
    $("#split").removeAttr("disabled");
    $("#dealCards").show();
    $("#hit").hide();
    $("#stand").hide();
    $("#double").hide();
    $("#split").hide();
    $("#hint").hide();
    $("#bet").prop("disabled",false);
  }

  function shuffleCards() {
    console.log("SHUFFLE");
    if (deck.length < (ALLCARDS.length / 2)) {  
      deck = [];
      for(var s=0; s<ALLCARDS.length; s++) {
        deck.push(ALLCARDS[s]);
      }
    }
  }

  function clearCards() {
    for(var i=0; i<6; i++) {
      $(".playerCard").eq(i).removeAttr("src");
      $(".dealerCard").eq(i).removeAttr("src");
      $(".playerCardSplit").eq(i).removeAttr("src");
    }
  }

  function clearScoreMessages() {
    $("#playerScore").html("&nbsp;");
    $("#dealerScore").html("&nbsp;");
    $("#playerResults").html("&nbsp;");
    $("#dealerResults").html("&nbsp;");
    $("#playerSplitScore").html("&nbsp;");
    $("#playerSplitResults").html("&nbsp;");
  }
// ^^^^^ reset settings fucntions for next game ^^^^^


// });
