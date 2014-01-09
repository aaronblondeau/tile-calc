if( typeof tilelogic === 'undefined' ) {
  var tilelogic = require('..')
}

describe('tilelogic', function(){

  it('x values convert to longitude', function(){
    expect( tilelogic.tile2lng(3368, 15) ).toBe(-142.998046875);
  })

})