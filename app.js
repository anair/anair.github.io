$(function() {
  GameUtils.initGameMatrix();
});

var GameMatrix;

GameMatrix = function() {
  var x, y, _i, _j;
  this.matrix = [[], [], []];
  this.winnerState = null;
  this.winners = null;
  for (y = _i = 0; _i <= 2; y = ++_i) {
    for (x = _j = 0; _j <= 2; x = ++_j) {
      this.matrix[x][y] = new Square(x, y);
    }
  }
};

GameMatrix.prototype.clone = function() {
  var gameMatrix, matrix, x, y, _i, _j;
  matrix = [[], [], []];
  for (y = _i = 0; _i <= 2; y = ++_i) {
    for (x = _j = 0; _j <= 2; x = ++_j) {
      matrix[x][y] = this.matrix[x][y].clone();
    }
  }
  GameMatrix(gameMatrix = new GameMatrix());
  gameMatrix.matrix = matrix;
  return gameMatrix;
};

GameMatrix.prototype.reset = function() {
  var x, y, _i, _j;
  for (y = _i = 0; _i <= 2; y = ++_i) {
    for (x = _j = 0; _j <= 2; x = ++_j) {
      this.matrix[x][y].reset();
    }
  }
};

GameMatrix.prototype.unmarkWinners = function() {
  var x, y, _i, _j;
  for (y = _i = 0; _i <= 2; y = ++_i) {
    for (x = _j = 0; _j <= 2; x = ++_j) {
      this.matrix[x][y].unmarkWinner();
      if (this.matrix[x][y].state == null) {
        this.matrix[x][y].removeClickHandler();
        this.matrix[x][y].initClickHandler();
      }
    }
  }
};

GameMatrix.prototype.initClickHandlers = function() {
  var x, y, _i, _j;
  for (y = _i = 0; _i <= 2; y = ++_i) {
    for (x = _j = 0; _j <= 2; x = ++_j) {
      this.matrix[x][y].initClickHandler();
    }
  }
};

GameMatrix.prototype.removeClickHandlers = function() {
  var x, y, _i, _j;
  for (y = _i = 0; _i <= 2; y = ++_i) {
    for (x = _j = 0; _j <= 2; x = ++_j) {
      this.matrix[x][y].removeClickHandler();
    }
  }
};

GameMatrix.prototype.isGameOverInADraw = function() {
  var x, y, _i, _j;
  for (y = _i = 0; _i <= 2; y = ++_i) {
    for (x = _j = 0; _j <= 2; x = ++_j) {
      if (this.matrix[x][y].state == null) {
        return false;
      }
    }
  }
  return true;
};

GameMatrix.prototype.getWinningState = function() {
  var winnerState, winners;
  winners = this.getWinners();
  if ((winners != null) && winners.length === 3) {
    winnerState = winners[0].state;
    this.winnerState = winnerState;
    return winnerState;
  }
  return null;
};

GameMatrix.prototype.getTheNextBestMove = function(nextState) {
  var currentBestMove, nextMove, nextMoves, _i, _len;
  nextMoves = this.getNextMoves(nextState);
  currentBestMove = null;
  for (_i = 0, _len = nextMoves.length; _i < _len; _i++) {
    nextMove = nextMoves[_i];
    currentBestMove = nextMove.compareWith(currentBestMove, nextState);
  }
  if (currentBestMove == null) {
    return null;
  }
  return currentBestMove.lastAdded;
};

GameMatrix.prototype.getNextMoves = function(nextState) {
  var clonedGameMatrix, gameMatrix, matrix, nextMove, nextMoveResult, nextMoveResults, nextMoves, o, square, winningState, x, y, _i, _j, _k, _len;
  gameMatrix = this;
  matrix = this.matrix;
  nextMoves = [];
  for (y = _i = 0; _i <= 2; y = ++_i) {
    for (x = _j = 0; _j <= 2; x = ++_j) {
      square = matrix[x][y];
      if (square.state == null) {
        clonedGameMatrix = gameMatrix.clone();
        nextMove = new NextMove(clonedGameMatrix, clonedGameMatrix.matrix[x][y]);
        nextMove.lastAdded.state = nextState;
        nextMoves.push(nextMove);
        winningState = nextMove.gameMatrix.getWinningState();
        if (winningState != null) {
          if (winningState === "x") {
            nextMove.x = 1;
            nextMove.o = 0;
            return [nextMove];
          } else {
            nextMove.x = 0;
            nextMove.o = 1;
            return [nextMove];
          }
        } else {
          nextMoveResults = nextMove.gameMatrix.getNextMoves(GameUtils.toggleState(nextState));
          x = 0;
          o = 0;
          for (_k = 0, _len = nextMoveResults.length; _k < _len; _k++) {
            nextMoveResult = nextMoveResults[_k];
            x = nextMoveResult.x / 2 + x;
            o = nextMoveResult.o / 2 + o;
          }
          nextMove.x = x;
          nextMove.o = o;
        }
      }
    }
  }
  return nextMoves;
};

GameMatrix.prototype.getWinners = function() {
  var isMatch, matrix, winners;
  isMatch = function(square1, square2, square3) {
    if (!square1 || !square2 || !square3) {
      return false;
    }
    if (square1.state === "x" && square2.state === "x" && square3.state === "x") {
      return true;
    }
    if (square1.state === "o" && square2.state === "o" && square3.state === "o") {
      return true;
    }
    return false;
  };
  matrix = this.matrix;
  winners = null;
  if (isMatch(matrix[0][0], matrix[1][0], matrix[2][0])) {
    winners = [matrix[0][0], matrix[1][0], matrix[2][0]];
  }
  if (isMatch(matrix[0][0], matrix[0][1], matrix[0][2])) {
    winners = [matrix[0][0], matrix[0][1], matrix[0][2]];
  }
  if (isMatch(matrix[0][0], matrix[1][1], matrix[2][2])) {
    winners = [matrix[0][0], matrix[1][1], matrix[2][2]];
  }
  if (isMatch(matrix[2][2], matrix[2][1], matrix[2][0])) {
    winners = [matrix[2][2], matrix[2][1], matrix[2][0]];
  }
  if (isMatch(matrix[2][2], matrix[1][2], matrix[0][2])) {
    winners = [matrix[2][2], matrix[1][2], matrix[0][2]];
  }
  if (isMatch(matrix[0][2], matrix[1][1], matrix[2][0])) {
    winners = [matrix[0][2], matrix[1][1], matrix[2][0]];
  }
  if (isMatch(matrix[1][0], matrix[1][1], matrix[1][2])) {
    winners = [matrix[1][0], matrix[1][1], matrix[1][2]];
  }
  if (isMatch(matrix[0][1], matrix[1][1], matrix[2][1])) {
    winners = [matrix[0][1], matrix[1][1], matrix[2][1]];
  }
  this.winners = winners;
  return winners;
};

var GameUtils;

GameUtils = (function() {
  var self;
  self = {};
  self.clickableClass = "clickable";
  self.oClass = ".fa-circle-o";
  self.xClass = ".fa-times";
  self.inProgressClass = "inProgress";
  self.gameGridId = "#gameGrid";
  self.nextToPlay = "x";
  self.matrix = null;
  self.lastAdded = null;
  self.playerRole = "x";
  self.aiRole = "o";
  self.moves = [];
  self.$backButton = $("#backButton");
  self.initGameMatrix = function() {
    self.matrix = new GameMatrix();
    self.matrix.initClickHandlers();
    self.initGameFromUrl();
    $(window).bind('hashchange', function(e) {
      return self.parseUrl();
    });
    self.$backButton.on("click", function(e) {
      if (self.moves.length > 0) {
        return window.history.back();
      }
    });
  };
  self.resetGameMatrix = function() {
    if (self.matrix != null) {
      self.matrix.reset();
    }
    self.matrix = new GameMatrix();
    self.matrix.initClickHandlers();
    self.moves = [];
  };
  self.toggleNextToPlay = function() {
    if (self.nextToPlay === "o") {
      self.nextToPlay = "x";
    } else {
      self.nextToPlay = "o";
    }
  };
  self.toggleState = function(state) {
    if (state === "o") {
      return "x";
    }
    if (state === "x") {
      return "o";
    }
    return null;
  };
  self.isFirstAiMove = function() {
    return self.moves.length === 0;
  };
  self.getTimeToWaitBetweenMoves = function() {
    if (self.isFirstAiMove()) {
      return 300;
    }
    return 600;
  };
  self.plotWinner = function() {
    var winner, winners, _i, _len;
    if (self.matrix != null) {
      winners = self.matrix.getWinners();
      if (winners != null) {
        for (_i = 0, _len = winners.length; _i < _len; _i++) {
          winner = winners[_i];
          winner.markWinner();
        }
        self.matrix.removeClickHandlers();
      }
    }
    return winners;
  };
  self.replay = function(url) {
    var aiSquare, square, x, y;
    if (((url != null ? url.length : void 0) == null) || url.length < 4) {
      return;
    }
    square = null;
    aiSquare = null;
    x = url.charAt(1);
    y = url.charAt(3);
    if (x <= 2 && y <= 2) {
      square = self.matrix.matrix[x][y];
      square.aiClick();
    }
    if (url.length === 8) {
      x = url.charAt(5);
      y = url.charAt(7);
      if (x <= 2 && y <= 2) {
        aiSquare = self.matrix.matrix[x][y];
        aiSquare.aiClick();
      }
    }
    self.moves.push({
      square: square,
      aiSquare: aiSquare,
      url: url
    });
    if (self.matrix.winners != null) {
      self.rewindBackToStart(1400);
    } else if (self.matrix.isGameOverInADraw()) {
      self.rewindBackToStart();
    } else {
      self.showBackButton();
    }
  };
  self.popMoves = function(newLength) {
    var i, move, totalElementsToPop, _i, _ref;
    if ((newLength == null) || newLength >= self.moves.length) {
      return;
    }
    totalElementsToPop = self.moves.length - newLength;
    for (i = _i = 0, _ref = totalElementsToPop - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      move = self.moves.pop();
      move.square.reset();
      move.square.initClickHandler();
      if (move.aiSquare != null) {
        move.aiSquare.reset();
        move.aiSquare.initClickHandler();
      } else {
        self.toggleNextToPlay();
      }
    }
    if (totalElementsToPop > 0) {
      self.matrix.unmarkWinners();
    }
    if (self.moves.length === 0) {
      self.hideBackButton();
    }
  };
  self.pushMove = function(square, aiSquare) {
    var url, x, y;
    if (square == null) {
      return;
    }
    x = square.x;
    y = square.y;
    url = "x" + x + "y" + y;
    if (aiSquare != null) {
      x = aiSquare.x;
      y = aiSquare.y;
      url += "x" + x + "y" + y;
    }
    self.moves.push({
      square: square,
      aiSquare: aiSquare,
      url: url
    });
    location.hash = location.hash + "/" + url;
    if (self.matrix.winners != null) {
      self.rewindBackToStart(1400);
    } else if (self.matrix.isGameOverInADraw()) {
      self.rewindBackToStart();
    } else {
      self.showBackButton();
    }
  };
  self.showBackButton = function() {
    self.$backButton.removeClass("hideButton");
  };
  self.hideBackButton = function() {
    self.$backButton.addClass("hideButton");
  };
  self.rewindBackToStart = function(time) {
    if (time == null) {
      time = 1000;
    }
    self.hideBackButton();
    setTimeout(function() {
      var goBackInHistory;
      $(self.gameGridId).addClass(self.inProgressClass);
      goBackInHistory = function() {
        window.history.back();
        if (self.moves.length > 1) {
          return setTimeout(goBackInHistory, time / 2);
        } else {
          return $(self.gameGridId).removeClass(self.inProgressClass);
        }
      };
      return goBackInHistory();
    }, time);
  };
  self.parseUrl = function() {
    var exisitingPlayerMove, i, locationHash, mismatch, newMove, newMoves, newPlayerMove, _i, _j, _k, _len, _ref, _ref1, _ref2;
    locationHash = location.hash;
    if ((locationHash == null) || locationHash === "") {
      self.popMoves(0);
      return;
    }
    locationHash = locationHash.substring(2);
    newMoves = locationHash.split("/");
    mismatch = false;
    for (i = _i = 0, _ref = newMoves.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      newPlayerMove = newMoves[i];
      if (i < self.moves.length) {
        exisitingPlayerMove = self.moves[i];
        if (exisitingPlayerMove.url !== newPlayerMove) {
          mismatch = true;
          break;
        }
      }
    }
    if (mismatch) {
      self.resetGameMatrix();
      for (_j = 0, _len = newMoves.length; _j < _len; _j++) {
        newMove = newMoves[_j];
        self.replay(newMove);
      }
      return;
    }
    if (newMoves.length < self.moves.length) {
      self.popMoves(newMoves.length);
    } else if (newMoves.length > self.moves.length) {
      for (i = _k = _ref1 = self.moves.length, _ref2 = newMoves.length - 1; _ref1 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = _ref1 <= _ref2 ? ++_k : --_k) {
        self.replay(newMoves[i]);
      }
    }
  };
  self.initGameFromUrl = function() {
    var locationHash, newMove, newMoves, _i, _len;
    locationHash = location.hash;
    if ((locationHash == null) || locationHash === "") {
      return;
    }
    locationHash = locationHash.substring(2);
    newMoves = locationHash.split("/");
    for (_i = 0, _len = newMoves.length; _i < _len; _i++) {
      newMove = newMoves[_i];
      self.replay(newMove);
    }
  };
  return self;
})();

var NextMove;

NextMove = function(gameMatrix, lastAdded) {
  this.gameMatrix = gameMatrix;
  this.lastAdded = lastAdded;
  this.x = 0;
  return this.o = 0;
};

NextMove.prototype.compareWith = function(move, state) {
  var moveScore, thisScore, toggledState;
  if (move == null) {
    return this;
  }
  toggledState = GameUtils.toggleState(state);
  if (this[state] !== 0) {
    if (move[state] === 0) {
      return this;
    }
    moveScore = move[state] / (move[state] + move[toggledState]);
    thisScore = this[state] / (this[state] + this[toggledState]);
    if (thisScore > moveScore) {
      return this;
    }
  } else {
    if (move[state] !== 0) {
      return move;
    }
    if (move[toggledState] > this[toggledState]) {
      return this;
    }
  }
  return move;
};

var Square;

Square = function(x, y) {
  var self;
  self = this;
  self.x = x;
  self.y = y;
  self.state = null;
};

Square.prototype.clone = function() {
  var clonedSquare;
  clonedSquare = new Square(this.x, this.y);
  clonedSquare.state = this.state;
  return clonedSquare;
};

Square.prototype.removeClickHandler = function() {
  this.getElement().removeClass(GameUtils.clickableClass);
  this.getElement().off("click");
};

Square.prototype.click = function() {
  var self, timeToWait;
  self = this;
  if ($(GameUtils.gameGridId).hasClass(GameUtils.inProgressClass)) {
    return;
  }
  $(GameUtils.gameGridId).addClass(GameUtils.inProgressClass);
  self.aiClick();
  timeToWait = GameUtils.getTimeToWaitBetweenMoves();
  setTimeout(function() {
    var square;
    square = GameUtils.matrix.getTheNextBestMove(GameUtils.nextToPlay);
    if (square != null) {
      square = GameUtils.matrix.matrix[square.x][square.y];
      square.aiClick();
    }
    GameUtils.pushMove(self, square);
    return $(GameUtils.gameGridId).removeClass(GameUtils.inProgressClass);
  }, timeToWait);
};

Square.prototype.aiClick = function() {
  var $square;
  $square = this.getElement();
  if ($square.hasClass(GameUtils.clickableClass)) {
    this.removeClickHandler();
    if (GameUtils.nextToPlay === "o") {
      $square.children(GameUtils.oClass).removeClass("hide");
      GameUtils.toggleNextToPlay();
      this.state = "o";
    } else {
      $square.children(GameUtils.xClass).removeClass("hide");
      GameUtils.toggleNextToPlay();
      this.state = "x";
    }
  }
  GameUtils.plotWinner();
};

Square.prototype.getElement = function() {
  return $("#x" + this.x + "y" + this.y);
};

Square.prototype.initClickHandler = function() {
  var self;
  self = this;
  this.getElement().addClass(GameUtils.clickableClass);
  this.getElement().on("click", function() {
    return self.click();
  });
};

Square.prototype.markWinner = function() {
  this.getElement().addClass("winner");
};

Square.prototype.unmarkWinner = function() {
  this.getElement().removeClass("winner");
};

Square.prototype.reset = function() {
  var $square;
  this.removeClickHandler();
  this.state = null;
  $square = this.getElement();
  $square.removeClass("winner");
  $square.children(GameUtils.oClass).addClass("hide");
  $square.children(GameUtils.xClass).addClass("hide");
};
