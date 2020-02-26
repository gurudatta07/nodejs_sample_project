var dbConfig = require('../../config/databaseconfig');
var sequelize = require('sequelize')
var Sequelize = require('sequelize'),
    sequelize = new Sequelize(dbConfig.db_database, dbConfig.db_username, dbConfig.db_password, {
        dialect: "mysql",
        port: dbConfig.db_port,
        host: dbConfig.host,
        pool: { idle: 30000,
            min: 20,
            max: 30
        }
    });

var getAllCompany = module.exports.getAllCompany = () => {
    var query = "SELECT * FROM companies order by name";
    return new Promise(function(resolve, reject) {
        return sequelize.transaction(function(t) {
            return sequelize.query(query,{transaction: t}).spread(function(companyList, metadata) {   
                if (companyList == null || companyList.length == 0) {
                    companyList = [];
                    resolve(companyList);
                } else {
                    resolve(companyList)
                }
            });
        }).catch(function(err) {
            console.log("========= Error in companyDao  (getAllCompanyOnId) ===========");
            console.log(err);
            reject(err);

        });
    })
}