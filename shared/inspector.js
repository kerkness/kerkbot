var Inspector = new Object();

Inspector.isInfluencer = function ( $user ) {

    return $user.followers_count && $user.followers_count > 30000;

};

module.exports = Inspector;