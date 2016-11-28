/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T21:42:39+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-28T21:58:06+01:00
* @License: stijnvanhulle.be
*/

module.exports.calculateId = (model) => {
  return new Promise((resolve, reject) => {
    model.findOne({}).sort({'id': -1}).exec(function(err, doc) {
      if(err){
        reject(err);
      }else{
        let id = 1;
        try {
          if (doc) {
            var _id = doc.id;
            if (_id) {
              id = parseInt(_id) + 1;
            }
          }
        } catch (e) {
          reject(e);
        } finally {
          resolve(id);
        }
      }


    });
  });
};
