# Pacman-Game
Classic pacman game developed from scratch with my own logic and strucutre, written with Phaser and Typescript.


# Structure
Created 3 main Classes:
### Map ###

### Tile ###

### Pacman ###

### Enemy ###
An abstract class that represents the basics of the enemy, movement, enum modes ( scatter, frightened or chase ).
This class will be used by derived class, depending on the type of the enemy:
- Red Ghost

- Pink Ghost

- Blue Ghost

- Orange Ghost

---------------------------------------------------------------

# Development
Started with the creation of the 4 main classes, gave them getters and setters and created the main structure of the map based in an 2D array, where each position represents a Tile of the game.

Pacman makes a movement each time it passes the middle of a title, if a key is pressed in between, it will be stored in a variable and used when requested.

For each time pacman changes Tile, it predicts the next one, depending on the face direction.If it's a Wall, it will change for one of the others intercardinal directions, except the oposite direction, until it finds an Empty Tile.
This rule will be overwritten if the player presses one of the direction keys ( Arrow Keys ) and if that Tile is an empty one.

The points are removed when pacman collides with the point hitbox, a point is incremented to the player score and verification happens to check if the player reached the MAX_POINTS. If this happens, the scene changes for the next level

# Scratches & Evolution

<img src='https://github.com/AfonsoCFonseca/Pacman-Game/blob/master/screenshots/02-04.png'>
<img src='https://github.com/AfonsoCFonseca/Pacman-Game/blob/master/screenshots/04-04.png'>
