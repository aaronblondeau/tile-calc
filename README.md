# tilelogic

JavaScript functions for working with map tiles.  Designed to work in both node.js and web browsers.

[![Build Status](https://travis-ci.org/aaronblondeau/tilelogic.png?branch=master)](https://travis-ci.org/aaronblondeau/tilelogic)

## Installation

### Node

    npm install tilelogic

And in your code:

    var tilelogic = require('tilelogic')

### Browser

    <script type="text/javascript" src="../tilelogic.js"></script>

## Tile Format

tilelogic represents each tile as an array of numbers : [x, y, z]

## Examples

Get latitude and longitude bounds for a tile

    tilelogic.getTileBounds(3368, 6288, 14, 5, 15);

Get all the parents of a tile

	tilelogic.getAllAncestorTiles(3368, 6288, 14);

Get the direct children of a tile

	tilelogic.getChildTiles(3368, 6288, 14);

Get the entire family tree of a tile (from min zoom of 5 to max zoom of 15)

	tilelogic.getAllRelatedTiles(3368, 6288, 14, 5, 15);
