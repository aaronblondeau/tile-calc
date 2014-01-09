if( typeof tilelogic === 'undefined' ) {
  var tilelogic = require('..')
}

describe('tilelogic', function(){

  it('x values convert to longitude', function(){
    expect( tilelogic.tile2lng(3368, 14).toFixed(6) ).toBe((-105.996094).toFixed(6));
  })

  it('y values convert to latitude', function(){
    expect( tilelogic.tile2lat(6288, 14).toFixed(6) ).toBe((38.548165).toFixed(6));
  })

})