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
    highScore: 0
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
game.updateScore = function() {
  d3.select('.current').text('Score: ' + game.stats.score.toString());
};

game.updateHighScore = function() {
  game.stats.highScore = Math.max(game.stats.highScore, game.stats.score);

  d3.select('.high').text('High Score: ' + game.stats.highScore.toString());
};

// *************** Players ***************
var Player = function(){
  this.path = 'm0,-10l-7,20l14,0l-7,-20';
  this.fill = 'green';
  this.x = 0;
  this.y = 0;
  this.r = 5;
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
  // TODO: implement
}

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
    .attr('cx', function(d) { return game.scaleAxes.x(d.x); })
    .attr('cy', function(d) { return game.scaleAxes.y(d.y); })
  // If new enemies are created, append them to DOM and transition radius
  enemiesSelector.enter().append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(d){ return game.scaleAxes.x(d.x); })
    .attr('cy', function(d){ return game.scaleAxes.y(d.y); })
    .attr('r', 0).transition().duration(1000).attr('r',10)
};

var Enemy = function(id){
  this.id = id;
  this.x;
  this.y;
};

// ***************** Start *****************
var startGame = function () {
  var allEnemies = new AllEnemies(game.options.nEnemies);
  var player = new Player();
  var startMovement = function() {
    allEnemies.render.call(allEnemies);
    setInterval(allEnemies.render.bind(allEnemies), 2000);
  };
  var increaseScore = function() {
    game.stats.score++;
    game.updateScore();
    game.updateHighScore();
  };

  allEnemies.render();
  player.render();
  setTimeout(startMovement, 1000);
  setInterval(increaseScore, 50);
};

startGame();


