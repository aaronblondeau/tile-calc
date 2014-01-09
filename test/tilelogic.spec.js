if( typeof tilelogic === 'undefined' ) {
  var tilelogic = require('..')
}

describe('tilelogic', function(){

  it('x values convert to longitude', function(){
    expect( tilelogic.tile2lng(3368, 14) ).toBe(-105.99609375);
  })

  it('y values convert to latitude', function(){
    expect( tilelogic.tile2lat(6288, 14) ).toBe(38.54816542304658);
  })

})