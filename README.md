# Pacman-Game
Classic Pacman game developed from scratch with my logic and structure, written with Phaser and Typescript.

<p align="center">
  <img src='https://github.com/AfonsoCFonseca/Pacman-Game/blob/master/screenshots/separator1.png'>
</p>

---------------------------------------------------------------
# How to Deploy
On the project terminal run: 
```
npm i;
npm run build;
node index
```
then access on your browser to: localhost:8080

To access a live version running on a server ( the server may take a few seconds to boot, before starting the game )

-> https://pacman1991.onrender.com <-
( also, it's a slow server )

# Structure
Created 3 main Classes:
### Map ###
The map works as a 2D array of the class Tile. This class is the main structure of the map, from the drawing to the Pacman and ghost navigation

### Tile ###
The Tile represents each position of the matrix, stores value as int's, where 0 is an empty Tile, 1 a point Tile, 2 a wall Tile, 3 power-up Tile.
This class carries the content that allows the player and the ghosts to know their surroundings.

### Pacman ###
The main class of the player, responsible for the movement of Pacman, the animation of the sprite sheet, the verification and limitation of movements and prediction of Tiles 

### Enemy ###
An abstract class that represents the basics of the enemy, movement, enum modes ( scatter, frightened or chase ).
This class will be used by the derived class, depending on the type of the enemy:

**Red Ghost**
  The red ghost is the more aggressive of the group of enemies, he simply tracks the Tile where the player is located at.
  
**Pink Ghost**
The pink one simulates the ambush, tracking, 2 Tiles ahead of the direction Pacman is facing.

**Blue Ghost**
  The blue works as an extension of the Vector between the red ghost and Pacman. His vector represents twice the length of the red ghost vector. The end of this vector will be the Tile where the blue ghost will go for.
  
**Orange Ghost**
  The orange ghost got 2 states in Chase Mode, if he's at least 4 Tiles away from Pacman, he'll behave like the red ghost, if got to 3 or fewer Tiles near Pacman, he states ll change to his Scatter Behaviour, going for the bottom left corner, when he reaches it, I'll change to the first state again.

---------------------------------------------------------------
# Development
Started with the creation of the 4 main classes, gave them getters and setters and created the main structure of the map-based in a 2D array, where each position represents a Tile of the game.

**Pacman & Prediction** Pacman moves each time it passes the middle of a title, if a key is pressed in between, it will be stored in a variable and used when requested.
For each time Pacman changes Tile, it predicts the next one, depending on the face direction. If it's a Wall, it will change for one of the other intercardinal directions, except the opposite direction, until it finds an Empty Tile.
This rule will be overwritten if the player presses one of the direction keys ( Arrow Keys ) and if that Tile is an empty one.

**Points** The points are removed when Pacman collides with the point hitbox, a point is incremented to the player score and verification happens to check if the player reached the MAX_POINTS. If this happens, the scene changes for the next level

**Ghosts** The ghosts will have different behaviour depending on each ghost, they will, for every time their position changes, check for the best route/direction to go to arrive the quickest to the destined Tile.
This choice is made depending on where the x and y of the destined Tile is and if the chosen direction is not the type tileType.WALL

**Modes** There are 3 types of Modes in-game, Chase mode, Scatter, and Frightened. These modes are dictated by the Enemy and Pacman. Chase mode is the default one where the ghost will chase Pacman, for x to x time, they'll change to scatter mode, where each ghost will position themselves on each corner of the screen for a limited time and finally there's Frightened mode, triggered when Pacman gets the power-up, where the ghosts flee from Pacman for limited time

**Fruti** Created a simple Fruit class for managing the different type of fruits and their spawn points in available areas of the map. The Fruit spawning works with 2 different timers, the time until spawns of the Fruit, and the duration of the Fruit in map. If the players catch it before the timer runs outs, the timer will keep the same previous rules. For each level I randomize 2 types of fruits, increasing their score points, in each level, with a total of 4 levels and 8 fruits.

---------------------------------------------------------------
# Sketches & Evolution

<p float="left">
  <img width="460" height="300"  src='https://github.com/AfonsoCFonseca/Pacman-Game/blob/master/screenshots/IMG_5620.jpg' >
 </p>
 <p float="left">
  <img width="186" height="260" src='https://github.com/AfonsoCFonseca/Pacman-Game/blob/master/screenshots/02-04.png'>
  <img width="186" height="260" src='https://github.com/AfonsoCFonseca/Pacman-Game/blob/master/screenshots/04-04 - Copy.png'>
  <img width="186" height="260" src='https://github.com/AfonsoCFonseca/Pacman-Game/blob/master/screenshots/11-04.png' >  
 </p>
