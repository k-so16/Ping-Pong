class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.moveX = 5;
    this.moveY = 5;
    this.DOM = $('<div>').addClass('ball');
    this.DOM.css({left: x, top: y});

    $('#table').append(this.DOM);
  }

  move() {
    var posX = this.x + this.moveX;
    var posY = this.y + this.moveY;
    var width = $('#table').width() - this.DOM.width();
    var height = $('#table').height() - this.DOM.height();

    // operations when ball touched wall
    if(posX < 0) {
      posX = -posX;
      this.moveX = -this.moveX;
    } else if(posX > width) {
      posX = width - (posX - width);
      this.moveX = -this.moveX;
    }
    if(posY < 0) {
      posY = -posY;
      this.moveY = -this.moveY;
    } else if(posY >= $('#table').height() - this.DOM.height()) {
      // game over
      this.moveX = 0;
      this.moveY = 0;
    }

    this.x = posX;
    this.y = posY;
    this.DOM.css({left: posX, top: posY});
  }

  rebound() {
    this.moveY = -this.moveY;
    this.moveX = (Math.random() > 0.5) ? this.moveX : -this.moveX; 
  }
}

class Racket {
  constructor(x) {
    this.DOM = $('<div>').addClass('racket');
    $('#table').append(this.DOM);
    this.x = x;
    this.y = $('#table').height() - this.DOM.height();
    this.DOM.css({'left': x});
  }

  move(dx) {
    var posX = this.x + dx;
    var width = $('#table').width() - this.DOM.width();

    // no moving if racket touching wall
    if(posX < 0) {
      posX = 0;
    } else if(posX > width) {
      posX = width;
    }

    this.x = posX;
    this.DOM.css({left: posX});
  }

  isCollided(ball) {
    if(ball.y + ball.DOM.height() >= this.y) {
      var result =
        (ball.x >= this.x - ball.DOM.width()) 
        && (ball.x + ball.DOM.width() <= this.x + this.DOM.width());

      return result;
    }
    return false;
  }
}


$(() => {
  var b = new Ball(200, 20);
  var r = new Racket($('#table').width() / 2);

  var originX;
  // control the racket from mouse
  $(window).on('mousemove', e => {
    if(originX === undefined) {
      originX = e.screenX;
    } else {
      r.move(e.screenX - originX);
      originX = e.screenX;
    }
  });

  // control the racket from smartphone
  $(window).on('touchstart', e => {
    e.preventDefault();
    if(e.originalEvent.touches.length > 1) {
      return;
    }

    originX = e.originalEvent.touches[0].screenX;
  });

  $(window).on('touchmove', e => {
    if(originX === undefined) {
      return;
    }

    r.move(e.originalEvent.touches[0].screenX - originX);
    originX = e.originalEvent.touches[0].screenX;
  });

  setInterval(() => {
    b.move();
    if(r.isCollided(b)) {
      b.rebound();
    }
  }, 50);
});
