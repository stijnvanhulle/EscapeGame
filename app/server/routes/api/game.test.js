const axios = require('axios');
const {assert} = require('chai');
const url = require('./lib/url');
/*
describe('API', function() {
  it(url.GAME, () => {
    return axios.post(url.GAME, {players, teamName, duration}).then((response) => {
      var data = response.data;
      console.log(response);
      assert.typeOf({
        tea: 'chai'
      }, 'object', 'we have an object');

    }).catch((err) => {
      throw err;
    });
  });
});

*/
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
