module.exports = function(sequelize, DataTypes){


    var Hashtag = sequelize.define('hashtag',{
        hashtag_name: DataTypes.STRING,
        userId: {
            type: DataTypes.INTEGER,
            foreignKey: true
        },
        data_array: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    {
      classMethods: {
        associate: function(db){
          Hashtag.belongsTo(db.user);
        }
      }
    });
    return Hashtag;
};
