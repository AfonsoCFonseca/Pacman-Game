import {Tile} from '../Tile'
import { Position } from '../game-interfaces/position.interface'
import { directionEnum } from '../game-interfaces/direction.interface';
import { scene } from '../app'
import { giveLimitsOfMapByZone } from '../Utils/utils'
import { mapSetup1, mapSetup } from './Layouts'

export class Map {
    public MAP_WIDTH = 19;
    public MAP_HEIGHT = 21;
    private TILE_SIZE = 50
    private currentMap: Tile[][] = [[]]

    constructor( ){
        this.createMap()
    }

    private createMap(): void{
        for( let y = 0; y < this.MAP_HEIGHT; y++ ){
            this.currentMap[y] = []
            for( let x = 0; x < this.MAP_WIDTH; x++ ){

                if( mapSetup1[y][x] == 0 ) scene.maxPoints++  

                let tile = new Tile( x, y, mapSetup1[y][x] )
                this.currentMap[y][x] = tile

            }
        }
    }

    public getNeighborTile(tile:Tile, dir: directionEnum): Tile{
        var { x, y } = tile.getPosition()

        switch(dir) {
            case "SOUTH":
                y += 1
            break;
            case "NORTH":
                y -= 1
            break;
            case "WEST":
                x -= 1
            break;
            case "EAST":
                x += 1
            break;
        }

        return this.currentMap[y][x]
    }

    public getTile({ x, y }: Position, type: "index"|"position" = "position"): Tile{
        let currentX = type == "position" ? Math.floor( x / this.TILE_SIZE ) : x 
        let currentY = type == "position" ? Math.floor( y / this.TILE_SIZE ) : y
        return this.currentMap[currentY][currentX]
    }

    public getRandomAvailableTile( zone: string ): Tile {
        let destinyTile:Tile
        zone = zone.toUpperCase()

        do{
            let limits = giveLimitsOfMapByZone( zone )
            var randomX = Math.floor(Math.random() * (+limits.maxX - +limits.minX)) + +limits.minX; 
            var randomY = Math.floor(Math.random() * (+limits.maxY - +limits.minY)) + +limits.minY; 
            destinyTile = this.currentMap[randomY][randomX]
        }while( destinyTile.type == "WALL" || destinyTile.type == "DOOR" )

        return destinyTile
    }
}