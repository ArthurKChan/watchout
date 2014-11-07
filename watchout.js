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

var enemy = {id: 0, x: 50, y:50};
gameBoard.selectAll('.enemy')
  .data([enemy], function(d){ return d.id })
  .enter().append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(d){ return axes.x(d.x); })
    .attr('cy', function(d){ return axes.y(d.y); })
    .attr('r', 15)

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

