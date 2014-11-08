// start slingin' some d3 here.

// Environment setup
var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
}

var gameStats = {
  score: 0,
  highScore: 0
}

// Game board setup
var axes = {
  x: d3.scale.linear().domain([0,100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0, gameOptions.height])
}

var gameBoard = d3.select('.container').append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);

// Score setup
var updateScore = function() {
  d3.select('.current').text(gameStats.score.toString());
};

var updateBestScore = function() {
  gameStats.highScore = _.max(gameStats.highScore, gameStats.score);

  d3.select('.high').text(gameStats.highScore.toString());
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

Player.prototype.render = function(){
  this.element = gameBoard.append('svg:path')
    .attr('d', this.path)
    .attr('fill', this.fill)
  this.transform(gameOptions.width*0.5, gameOptions.height*0.5)

  // TODO: implement drag listener


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

AllEnemies.prototype.render = function() {
  // Generate new positions first
  _(this.enemies).map(function(enemy){
    enemy.x = Math.random() * 100;
    enemy.y = Math.random() * 100;
  });
  // Grab / create some enemies
  var enemiesSelector = gameBoard.selectAll('circle.enemy')
    .data(this.enemies, function(d) { return d.id; })
  // Bind transition on position change
  enemiesSelector.transition().duration(2000)
    .attr('cx', function(d) { return axes.x(d.x); })
    .attr('cy', function(d) { return axes.y(d.y); })
  // If new enemies are created, append them to DOM and transition radius
  enemiesSelector.enter().append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(d){ return axes.x(d.x); })
    .attr('cy', function(d){ return axes.y(d.y); })
    .attr('r', 0).transition().duration(1000).attr('r',10)
};

var Enemy = function(id){
  this.id = id;
  this.x;
  this.y;
};
// ***************************************



/* our ship
M360,180L371.5470053837925,206.66666666666666L348.4529946162075,206.66666666666669L360,180
 */

// ***************** Start *****************
var allEnemies = new AllEnemies(gameOptions.nEnemies);
allEnemies.render();

setTimeout(function(){
  allEnemies.render.call(allEnemies);
  setInterval(allEnemies.render.bind(allEnemies), 2000);
}, 1000);

    // d3.scale.linear().domain([0,100]).range([0, gameOptions.width])(x)

// // Player setup
// var Player = function(){
//   this.path;
//   this.fill;
//   this.x;
//   this.y;
//   this.angle;
//   this.r;
//   this.gameOptions = gameOptions;
// };

// Player.prototype.render = function(to) {
//   this.el = to.append('svg:path')
//     .attr('d', this.path)
//     .attr('fill', this.fill);

// }

