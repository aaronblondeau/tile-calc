"use strict";

(function() {

	var root = this;
    var previous_tilelogic = root.tilelogic;

	var tilelogic = {

		tile2lng: function(x, z) {
		  return (x/Math.pow(2,z)*360-180);
		},

		tile2lat: function(y, z) {
		  var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
		  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
		},

		getTileBounds: function(x, y, z) {
			var nw_lng = this.tile2lng(x, z);
			var nw_lat = this.tile2lat(y, z);
			var se_lng = this.tile2lng(x + 1, z);
			var se_lat = this.tile2lat(y + 1, z);
			return [nw_lng, nw_lat, se_lng, se_lat];
		},

		getChildTiles: function(x, y, z) {
			z = z + 1;
			return[
				[2 * x, 2 * y, z],
				[(2 * x) + 1, 2 * y, z],
				[2 * x, (2 * y) + 1, z],
				[(2 * x) + 1, (2 * y) + 1, z]
			];
		},

		getParentTile: function(x, y, z) {
			return [Math.floor(x/2), Math.floor(y/2), z - 1];
		},

		getTile: function(lat, lng, z) {
			var n = Math.pow(2,z);
			var x = Math.floor((lng+180)/360*n);
			if(x > (Math.pow(2,z) - 1)) {
				x = 0;
			}
			if(y > (Math.pow(2,z) - 1)) {
				y = 0;
			}
			var y = (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 * n));
			return [x, y, z];
		},

		getTileNorthOf: function(x, y, z) {
			//subtract 1 from y
			var new_y = y - 1;
			if(new_y < 0) {
				new_y = Math.pow(2, z) - 1; //Y goes from 0 (top edge is 85.0511 °N) to 2^zoom − 1
			}
			return [x, new_y, z];
		},

		getTileSouthOf: function(x, y, z) {
			//add 1 to y
			//Y goes from 0 (top edge is 85.0511 °N) to 2^zoom − 1
			var max_y = Math.pow(2, z) - 1;
			var new_y = y + 1;
			if(new_y > max_y) {
				new_y = 0;
			}
			return [x, new_y, z];
		},

		getTileEastOf: function(x, y, z) {
			//add 1 to x
			//X goes from 0 (left edge is 180 °W) to 2^zoom − 1
			var max_x = Math.pow(2, z) - 1;
			var new_x = x + 1;
			if(new_x > max_x){
				new_x = 0;
			}
			return [new_x, y, z];
		},

		getTileWestOf: function(x, y, z) {
			//subtract 1 from x
			//X goes from 0 (left edge is 180 °W) to 2^zoom − 1
			var new_x = x - 1;
			if(new_x < 0){
				new_x = Math.pow(2, z) - 1;
			}
			return [new_x, y, z];
		},

		tilesInBounds: function(nw_lat, nw_lng, se_lat, se_lng, zoom) {

			//x = lon
			//y = lat
			var min_x = nw_lng;
			var min_y = se_lat;
			var max_x = se_lng;
			var max_y = nw_lat;

			var nw = this.getTile(max_y, min_x , zoom);
			var ne = this.getTile(max_y, max_x , zoom);
			var se = this.getTile(min_y, max_x , zoom);
			var sw = this.getTile(min_y, min_x , zoom);

			var tiles = [];

			//bad bounds can result in an endless loop, so check them first
			if((isNaN(nw[0])) || (isNaN(nw[1]))) {
				throw "Invalid Bounds!";
			}
			if((isNaN(se[0])) || (isNaN(se[1]))) {
				throw "Invalid Bounds!";
			}

			var current = nw;
			var row_start = nw;
			var row_end = ne;

			//visual test code (with Leaflet)
			//var m_nw = new L.marker([nw_lat,nw_lng], {}).addTo(map);
			//var m_ne = new L.marker([max_y,max_x], {}).addTo(map);
			//var m_se = new L.marker([se_lat,se_lng], {}).addTo(map);
			//var m_sw = new L.marker([min_y,min_x], {}).addTo(map);

			//go from left to right, top to bottom
			while(current+"" != se+""){

				tiles.push(current);
				
				current = this.getTileEastOf(current[0], current[1], current[2]);

				//check if we have reached right side
				if(current+"" == row_end+""){

					//if we have reached the right side, and this is not the last tile
					// ,calculate next row's start and end
					if(current+"" != se+""){
						tiles.push(current);
						row_end = this.getTileSouthOf(current[0], current[1], current[2]);
						current = this.getTileSouthOf(row_start[0], row_start[1], row_start[2]);
						row_start = current;
					}

				}

			}

			//make sure last tile gets added (if it is not the same as first tile)
			if(current+"" != tiles[0]+""){
				tiles.push(current);
			}

			//visual test code (with Leaflet)
			//for(var i = 0; i < tiles.length; i++) {
			//	tile = tiles[i];
			//	var bounds = this.getTileBounds(tile[0], tile[1], tile[2]);
			//	var selection = L.rectangle([[bounds[1],bounds[0]],[bounds[3],bounds[2]]], {color: "#ff7800", weight: 1}).addTo(map);
			//}

			return tiles;

		},

		getAllDescendantTiles: function(x, y, z, max_z) {

			if(typeof max_z == "undefined") {
				max_z = z + 1;
			}

			var result = [];
			if(z < max_z) {
				var children = this.getChildTiles(x, y, z);
				result = result.concat(children);
				var result_length = result.length;
				// add children to array
				for(var i = 0; i < result_length; i++){
					var child = result[i];
					var grandchildren = this.getAllDescendantTiles(child[0], child[1], child[2], max_z);
					result = result.concat(grandchildren);
				}
			}
			return result;
		},

		//TODO : use "yield" in the future instead of a callback
		generateAllDescendantTiles: function(x, y, z, max_z, callback) {

			if(typeof max_z == "undefined") {
				max_z = z + 1;
			}

			if(z < max_z) {
				var children = this.getChildTiles(x, y, z);
				var children_length = children.length;
				for(var i = 0; i < children_length; i++){
					callback(children[i]);
					var child = children[i];
					this.generateAllDescendantTiles(child[0], child[1], child[2], max_z, callback);
				}
			}
		},

		getAllAncestorTiles: function(x, y, z, min_z) {

			if((typeof min_z == "undefined") || (min_z < 0)){
				min_z = 0;
			}

			var result = [];
			while(z > min_z){
				var parent = this.getParentTile(x, y, z);
				result.push(parent);
				x = parent[0];
				y = parent[1];
				z = parent[2];
			}
			return result;
		},

		//TODO : use "yield" in the future instead of a callback
		generateAllAncestorTiles: function(x, y, z, min_z, callback) {

			if((typeof min_z == "undefined") || (min_z < 0)){
				min_z = 0;
			}

			while(z > min_z){
				var parent = this.getParentTile(x, y, z);
				callback(parent);
				x = parent[0];
				y = parent[1];
				z = parent[2];
			}
		},

		getAllRelatedTiles: function(x, y, z, min_z, max_z) {

			var me = [[x, y, z]];
			var descendants = this.getAllDescendantTiles(x, y, z, max_z);
			var ancestors = this.getAllAncestorTiles(x, y, z, min_z);
			var result = ancestors.reverse();
			result = result.concat(me);
			result = result.concat(descendants);
			return result;
		},

		generateAllRelatedTiles: function(x, y, z, min_z, max_z, callback) {
			this.generateAllAncestorTiles(x, y, z, min_z, callback);
			callback([x, y, z]);
			this.generateAllDescendantTiles(x, y, z, max_z, callback);
		}

	};

	tilelogic.noConflict = function() {
	  root.tilelogic = previous_tilelogic
	  return tilelogic
	}

	if( typeof exports !== 'undefined' ) {
		if( typeof module !== 'undefined' && module.exports ) {
			exports = module.exports = tilelogic;
		}
		exports.tilelogic = tilelogic;
	} 
	else {
		root.tilelogic = tilelogic;
	}

}).call(this);
