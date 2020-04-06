import { scene } from '../app'

export function pacmanAnimInit( ){

    let namesArray = [
        'pacmanEastAnim',
        'pacmanNorthAnim',
        'pacmanSouthAnim',
        'pacmanWestAnim',
    ]
    let indexArray = 0
    for( var i = 0; i < 12; i += 3 ){
        scene.anims.create({
            frames: scene.anims.generateFrameNumbers('pacman', { start: i+1, end: i+3 }),
            key: namesArray[indexArray],
            frameRate: 10,
            repeat: -1
        });
        indexArray++
    }

}

export function ghostsAnimInit( ){

    let namesArray = [
        'ghostRedEast',
        'ghostRedNorth',
        'ghostRedSouth',
        'ghostRedWest',
        'ghostBlueEast',
        'ghostBlueNorth',
        'ghostBlueSouth',
        'ghostBlueWest',
        'ghostPinkEast',
        'ghostPinkNorth',
        'ghostPinkSouth',
        'ghostPinkWest',
        'ghostOrangeEast',
        'ghostOrangeNorth',
        'ghostOrangeSouth',
        'ghostOrangeWest',

    ]
    for( var i = 0; i < namesArray.length; i++ ){   
        scene.anims.create({
            frames: scene.anims.generateFrameNumbers('ghosts', {start:i, end: i}),
            key: namesArray[i],
        })
    }
}