# tile-calc

JavaScript functions for working with map tiles.  Designed to work in both node.js and web browsers.

## Installation

### Node

    npm install tile-calc

And in your code:

    var TileCalc = require('tile-calc')

### Browser

    <script type="text/javascript" src="../tile-calc.js"></script>

## Tile Format

tile-calc represents each tile as an array of numbers : [x, y, z]

## Examples

Get latitude and longitude bounds for a tile

    TileCalc.getTileBounds(3368, 6288, 14, 5, 15);

Get all the parents of a tile

	TileCalc.getAllAncestorTiles(3368, 6288, 14);

Get the direct children of a tile

	TileCalc.getChildTiles(3368, 6288, 14);

Get the entire family tree of a tile (from min zoom of 5 to max zoom of 15)

	TileCalc.getAllRelatedTiles(3368, 6288, 14, 5, 15);
