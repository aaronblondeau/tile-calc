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
			var y = (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 * n));
			return [x, y, z];
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
