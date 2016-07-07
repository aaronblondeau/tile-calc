if( typeof TileCalc === 'undefined' ) {
  var TileCalc = require('..')
}

describe('TileCalc', function(){

  it('x values convert to longitude', function(){
    expect( TileCalc.tile2lng(3368, 14).toFixed(6) ).toBe((-105.996094).toFixed(6));
  })

  it('y values convert to latitude', function(){
    expect( TileCalc.tile2lat(6288, 14).toFixed(6) ).toBe((38.548165).toFixed(6));
  })

  it('tile bounds are correct', function(){
  	bounds = TileCalc.getTileBounds(3368, 6288, 14);
    expect(bounds[0].toFixed(6) ).toBe((-105.99609375).toFixed(6));
    expect(bounds[1].toFixed(6) ).toBe((38.54816542304658).toFixed(6));
    expect(bounds[2].toFixed(6) ).toBe((-105.97412109375).toFixed(6));
    expect(bounds[3].toFixed(6) ).toBe((38.53097889440025).toFixed(6));
  })

  it('child tiles are correct', function(){
  	bounds = TileCalc.getChildTiles(3368, 6288, 14);
    expect(bounds[0]+"").toBe("6736,12576,15");
    expect(bounds[1]+"").toBe("6737,12576,15");
    expect(bounds[2]+"").toBe("6736,12577,15");
    expect(bounds[3]+"").toBe("6737,12577,15");
  })

  it('parent tile is correct', function(){
  	parent = TileCalc.getParentTile(3368, 6288, 14);
    expect(parent+"").toBe("1684,3144,13");
  })

  it('tile from lat lng in hemisphere 1,1 is correct', function(){
  	tile = TileCalc.getTile(60.19206,24.968748, 14);
    expect(tile+"").toBe("9328,4740,14");
  })

  it('tile from lat lng in hemisphere 1,-1 is correct', function(){
  	tile = TileCalc.getTile(38.539573,-105.999237, 14);
    expect(tile+"").toBe("3367,6288,14");
  })

  it('tile from lat lng in hemisphere -1,1 is correct', function(){
  	tile = TileCalc.getTile(-20.263566,57.506634, 14);
    expect(tile+"").toBe("10809,9134,14");
  })

	it('tile from lat lng in hemisphere -1,-1 is correct', function(){
  	tile = TileCalc.getTile(-53.146564,-70.910279, 14);
    expect(tile+"").toBe("4964,11057,14");
  })

  it('tiles from lat lng at map corners is correct', function(){
    se = TileCalc.getTile(-85.05019204319093, 179.98472213745117, 14);
    expect(se+"").toBe("16383,16383,14");

    ne = TileCalc.getTile(85.05015501439495, 179.9897003173828, 14);
    expect(ne+"").toBe("16383,0,14");

    nw = TileCalc.getTile(85.050266099954, 180.0083255767822, 14);
    expect(nw+"").toBe("0,0,14");

    sw = TileCalc.getTile(-85.05019204319093, 180.0083255767822, 14);
    expect(sw+"").toBe("0,16383,14");
  })

	it('descendant tiles with no max depth parameter are correct', function(){
  	tiles = TileCalc.getAllDescendantTiles(3368, 6288, 14);
    expect(tiles.length).toBe(4);
    expect(tiles[3]+"").toBe("6737,12577,15");
  })

  it('descendant tiles with max depth parameter are correct', function(){
  	tiles = TileCalc.getAllDescendantTiles(3368, 6288, 14, 16);
    expect(tiles.length).toBe(20);
    expect(tiles[19]+"").toBe("13475,25155,16");
  })

  it('no descendant tiles with invalid max depth', function(){
  	tiles = TileCalc.getAllDescendantTiles(3368, 6288, 14, -1);
    expect(tiles.length).toBe(0);
  })

  it('ancestor tiles with no min depth parameter are correct', function(){
  	tiles = TileCalc.getAllAncestorTiles(3368, 6288, 14);
    expect(tiles.length).toBe(14);
    expect(tiles[0]+"").toBe("1684,3144,13");
    expect(tiles[13]+"").toBe("0,0,0");
  })

  it('ancestor tiles with min depth parameter are correct', function(){
  	tiles = TileCalc.getAllAncestorTiles(3368, 6288, 14, 5);
    expect(tiles.length).toBe(9);
    expect(tiles[0]+"").toBe("1684,3144,13");
    expect(tiles[8]+"").toBe("6,12,5");
  })
  
  it('no ancestor tiles with invalid min depth', function(){
  	tiles = TileCalc.getAllAncestorTiles(3368, 6288, 14, 15);
    expect(tiles.length).toBe(0);
  })

  it('related tiles with no min or max depth parameter are correct', function(){
  	tiles = TileCalc.getAllRelatedTiles(3368, 6288, 14);
    expect(tiles.length).toBe(19);
    expect(tiles[0]+"").toBe("0,0,0");
    expect(tiles[18]+"").toBe("6737,12577,15");
  })

  it('related tiles with min and max depth parameter are correct', function(){
  	tiles = TileCalc.getAllRelatedTiles(3368, 6288, 14, 5, 16);
    expect(tiles.length).toBe(30);
    expect(tiles[0]+"").toBe("6,12,5");
    expect(tiles[29]+"").toBe("13475,25155,16");
  })

  it('related tiles with invalid min and max depth parameter are correct', function(){
  	tiles = TileCalc.getAllRelatedTiles(3368, 6288, 14, 15, 13);
    expect(tiles.length).toBe(1);
    expect(tiles[0]+"").toBe("3368,6288,14");
  })

  it('can generate descendant tiles', function(){
  	var processor = {
      processTile: function(value) {
      }
    };
    spyOn(processor, 'processTile');
  	TileCalc.generateAllDescendantTiles(3368, 6288, 14, 16, processor.processTile);
  	//till node-jasmine gets to 2.0 we can't do these test on node
  	if(typeof processor.processTile.calls.count == "function"){
    	expect(processor.processTile.calls.count()).toEqual(20);
    	expect(processor.processTile.calls.argsFor(19)+"").toBe("13475,25155,16");
  	}
  	else{
  		console.log("spy.calls.count assertions not run!");
  	}
  })

  it('can generate ancestor tiles', function(){
  	var processor = {
      processTile: function(value) {
      }
    };
    spyOn(processor, 'processTile');
  	TileCalc.generateAllAncestorTiles(3368, 6288, 14, 0, processor.processTile);
  	//till node-jasmine gets to 2.0 we can't do these test on node
  	if(typeof processor.processTile.calls.count == "function"){
	    expect(processor.processTile.calls.count()).toEqual(14);
	    expect(processor.processTile.calls.argsFor(0)+"").toBe("1684,3144,13");
	    expect(processor.processTile.calls.argsFor(13)+"").toBe("0,0,0");
    }
  	else{
  		console.log("spy.calls.count assertions not run!");
  	}
  })

  it('can generate related tiles', function(){
  	var processor = {
      processTile: function(value) {
      }
    };
    spyOn(processor, 'processTile');
  	TileCalc.generateAllRelatedTiles(3368, 6288, 14, 5, 16, processor.processTile);
  	//till node-jasmine gets to 2.0 we can't do these test on node
  	if(typeof processor.processTile.calls.count == "function"){
    	expect(processor.processTile.calls.count()).toEqual(30);
    }
  	else{
  		console.log("spy.calls.count assertions not run!");
  	}
  })

  it('neighbor tiles are correct', function(){
    var tile = TileCalc.getTile(38.556014, -106.062253, 14);

    var north = TileCalc.getTileNorthOf(tile[0],tile[1],tile[2]);
    expect(north+"").toBe("3364,6286,14");

    var south = TileCalc.getTileSouthOf(tile[0],tile[1],tile[2]);
    expect(south+"").toBe("3364,6288,14");

    var east = TileCalc.getTileEastOf(tile[0],tile[1],tile[2]);
    expect(east+"").toBe("3365,6287,14");

    var west = TileCalc.getTileWestOf(tile[0],tile[1],tile[2]);
    expect(west+"").toBe("3363,6287,14");

  })

  it('neighbor tiles at map\'s south east boundary are correct', function(){
    var tile = TileCalc.getTile(-85.05019204319093, 179.98472213745117, 14);
    
    var north = TileCalc.getTileNorthOf(tile[0],tile[1],tile[2]);
    expect(north+"").toBe("16383,16382,14");

    var south = TileCalc.getTileSouthOf(tile[0],tile[1],tile[2]);
    expect(south+"").toBe("16383,0,14");

    var east = TileCalc.getTileEastOf(tile[0],tile[1],tile[2]);
    expect(east+"").toBe("0,16383,14");

    var west = TileCalc.getTileWestOf(tile[0],tile[1],tile[2]);
    expect(west+"").toBe("16382,16383,14");

  })

  it('neighbor tiles at map\'s north east boundary are correct', function(){
    var tile = TileCalc.getTile(85.05015501439495, 179.9897003173828, 14);
    
    var north = TileCalc.getTileNorthOf(tile[0],tile[1],tile[2]);
    expect(north+"").toBe("16383,16383,14");

    var south = TileCalc.getTileSouthOf(tile[0],tile[1],tile[2]);
    expect(south+"").toBe("16383,1,14");

    var east = TileCalc.getTileEastOf(tile[0],tile[1],tile[2]);
    expect(east+"").toBe("0,0,14");

    var west = TileCalc.getTileWestOf(tile[0],tile[1],tile[2]);
    expect(west+"").toBe("16382,0,14");

  })

  it('neighbor tiles at map\'s north west boundary are correct', function(){
    var tile = TileCalc.getTile(85.050266099954, 180.0083255767822, 14);
    
    var north = TileCalc.getTileNorthOf(tile[0],tile[1],tile[2]);
    expect(north+"").toBe("0,16383,14");

    var south = TileCalc.getTileSouthOf(tile[0],tile[1],tile[2]);
    expect(south+"").toBe("0,1,14");

    var east = TileCalc.getTileEastOf(tile[0],tile[1],tile[2]);
    expect(east+"").toBe("1,0,14");

    var west = TileCalc.getTileWestOf(tile[0],tile[1],tile[2]);
    expect(west+"").toBe("16383,0,14");

  })

  it('neighbor tiles at map\'s south west boundary are correct', function(){
    var tile = TileCalc.getTile(-85.05019204319093, 180.0083255767822, 14);
    
    var north = TileCalc.getTileNorthOf(tile[0],tile[1],tile[2]);
    expect(north+"").toBe("0,16382,14");

    var south = TileCalc.getTileSouthOf(tile[0],tile[1],tile[2]);
    expect(south+"").toBe("0,0,14");

    var east = TileCalc.getTileEastOf(tile[0],tile[1],tile[2]);
    expect(east+"").toBe("1,16383,14");

    var west = TileCalc.getTileWestOf(tile[0],tile[1],tile[2]);
    expect(west+"").toBe("16383,16383,14");

  })

  it('tiles in bounds for a span are correct', function(){
    tiles = TileCalc.tilesInBounds(38.556014, -106.062253, 38.508477, -105.945695, 14);
    expect(tiles.length).toBe(28);
    expect(tiles[0]+"").toBe("3364,6287,14");
    expect(tiles[27]+"").toBe("3370,6290,14");
  })

  it('tiles in bounds for a single tile are correct', function(){
    tiles = TileCalc.tilesInBounds(38.556014, -106.062253, 38.555, -106.0621, 14);
    expect(tiles.length).toBe(1);
    expect(tiles[0]+"").toBe("3364,6287,14");
  })

})