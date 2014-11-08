// **************** Game ****************
var game = {
  // Environment setup
  options: {
    height: 450,
    width: 700,
    nEnemies: 30,
    padding: 20
  },

  stats: {
    score: 0,
    highScore: 0,
    collisions: 0
  }
};

game.scaleAxes = {
  x: d3.scale.linear().domain([0,100]).range([0, game.options.width]),
  y: d3.scale.linear().domain([0,100]).range([0, game.options.height])
}

game.board = d3.select('.container').append('svg')
  .attr('width', game.options.width)
  .attr('height', game.options.height);
// Score setup
game.updateCollisions = function() {
  game.stats.collisions++;
  d3.select('.collisions').text('Collisions: ' + game.stats.collisions.toString());
};

game.updateScore = function(newScore) {
  if (newScore !== undefined) { game.stats.score = newScore; }
  d3.select('.current').text('Score: ' + game.stats.score.toString());
};

game.updateHighScore = function() {
  game.stats.highScore = Math.max(game.stats.highScore, game.stats.score);

  d3.select('.high').text('High Score: ' + game.stats.highScore.toString());
};

game.checkCollision = function(enemy, collisionCallback){
  dangerZone = parseFloat(enemy.attr('r')) + game.player.r;
  xDiff = parseFloat(enemy.attr('cx')) - game.player.x;
  yDiff = parseFloat(enemy.attr('cy')) - game.player.y;

  separation = Math.sqrt( Math.pow(xDiff, 2) + Math.pow(yDiff, 2) )
  if (separation < dangerZone) {
    collisionCallback(game.player, enemy);
  }
};

game.onCollision = function(){
  game.updateHighScore();
  game.updateScore(0);
  game.updateCollisions();
};

// *************** Players ***************
var Player = function(){
  this.path = 'm0,-13l-7,20l14,0z';
  this.fill = 'green';
  this.r = 7;
  this.x = 0;
  this.y = 0;
  this.angle = 0;
};

Player.prototype._dragMove = function() {
  this.transform(
    this.x + d3.event.dx,
    this.y + d3.event.dy,
    90 + 360 * (Math.atan2(d3.event.dy, d3.event.dx) / (Math.PI * 2))
  );
};

Player.prototype.render = function(){
  this.element = game.board.append('svg:path')
    .attr('d', this.path)
    .attr('fill', this.fill);

  this.transform(game.options.width*0.5, game.options.height*0.5);
  this.element.call(d3.behavior.drag().on('drag', this._dragMove.bind(this)));
};

Player.prototype.transform = function(x, y, angle){
  this.x = x || this.x;
  this.y = y || this.y;
  this.angle = angle || this.angle;
  this.element.attr('transform',
    'rotate('+this.angle+','+this.x+','+this.y+') '+
    'translate('+this.x+','+this.y+')');
};

// *************** Enemies ***************
var AllEnemies = function(n){
  this.enemies = [];

  for(var i=0; i<n; i++){
    this.enemies.push(new Enemy(i));
  }
};

AllEnemies.prototype._tweenWithCollisionDetection = function(endData) {
  var enemy = d3.select(this);
  var startPos = {
    x: parseFloat(enemy.attr('cx')),
    y: parseFloat(enemy.attr('cy'))
  }
  var endPos = {
    x: game.scaleAxes.x(endData.x),
    y: game.scaleAxes.y(endData.y)
  }

  return function(t){
    game.checkCollision(enemy, game.onCollision);

    enemy.attr('cx', startPos.x + (endPos.x - startPos.x) * t)
         .attr('cy', startPos.y + (endPos.y - startPos.y) * t);
  };
};

AllEnemies.prototype.render = function() {
  // Generate new positions first
  _(this.enemies).map(function(enemy){
    enemy.x = Math.random() * 100;
    enemy.y = Math.random() * 100;
  });
  // Grab / create some enemies
  var enemiesSelector = game.board.selectAll('circle.enemy')
    .data(this.enemies, function(d) { return d.id; })
  // Bind transition on position change
  enemiesSelector.transition().duration(2000)
    .tween('custom', this._tweenWithCollisionDetection);
    // .attr('cx', function(d) { return game.scaleAxes.x(d.x); })
    // .attr('cy', function(d) { return game.scaleAxes.y(d.y); })
  // If new enemies are created, append them to DOM and transition radius
  enemiesSelector.enter().append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(d){ return game.scaleAxes.x(d.x); })
    .attr('cy', function(d){ return game.scaleAxes.y(d.y); })
    .attr('r', 0).transition().duration(1000).attr('r',10);
};

var Enemy = function(id){
  this.id = id;
  this.x;
  this.y;
};

// ***************** Start *****************
var startGame = function () {
  game.allEnemies = new AllEnemies(game.options.nEnemies);
  game.player = new Player();
  var startMovement = function() {
    game.allEnemies.render.call(game.allEnemies);
    setInterval(game.allEnemies.render.bind(game.allEnemies), 2000);
  };
  var increaseScore = function() {
    game.updateScore(1 + game.stats.score);
    game.updateHighScore();
  };

  game.allEnemies.render();
  game.player.render();
  setTimeout(startMovement, 1000);
  setInterval(increaseScore, 50);
};

startGame();


