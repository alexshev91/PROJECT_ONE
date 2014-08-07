module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.createTable('hashtags',
    	{id: {
    		type: DataTypes.INTEGER,
    		primaryKey: true,
    		autoIncrement: true
    	},
    	createdAt: DataTypes.DATE,
    	updatedAt: DataTypes.DATE,
    	hashtag_name: DataTypes.STRING,
        data_array: DataTypes.ARRAY(DataTypes.INTEGER),
        userID: {
    		type: DataTypes.INTEGER,
    		foreignKey: true
    	}
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.dropTable('hashtags')
    .complete(done);
  }
};
