var sequilizeinitialize = require("../../libraries/database/sequilizeInitialize");
var sequelize = sequilizeinitialize.sequelize;
var applicationConstants = require("../../config/applicationConstants");
//var dateUtils = require("../../libraries/dateUtils/dateUtils");
var regionsModel = sequilizeinitialize.regionsModel;
var zonesModel = sequilizeinitialize.zonesModel;



var saveBrandRegion = module.exports.saveBrandRegion = (regionDataModel) => {

    return new Promise(function(resolve, reject) {

        return sequelize.transaction(function(t) {
                          
            return regionDataModel.save({ transaction: t }).then(function(result) {                
                
                resolve(result.dataValues);
                
            }).catch(function(err) {

                console.log("========= Error in teamDAO  (saveUserPermission) ===========");
                console.log(err)
                reject(err);

            });

        }).catch(function(err) {
            
            console.log("========= Error in teamDAO  (saveUserPermission) ===========");
            console.log(err)

        });

    })

}

var getAllZonesOnBuId = module.exports.getAllZonesOnBuId = (buId) => {

    var query = "select z.name as name, count(r.id) as regioncount from zones as z inner join regions as r on z.regionId = r.id and r.buId = z.buId where z.buId = :buId group by z.name order by name";

    return new Promise(function(resolve, reject) {

        return sequelize.transaction(function(t) {

            return sequelize.query(query,{replacements: {buId: buId},transaction: t}).spread(function(zonesList, metadata) {
                
               
                if (zonesList == null || zonesList.length == 0) {
                    zonesList = [];
                    resolve(zonesList);
                } else {
                    resolve(zonesList)
                }
            });


        }).catch(function(err) {
            
            console.log("========= Error in regionDao  (getAllZonesOnBuId) ===========");
            console.log(err);
            reject(err);

        });
    })

}

var saveBrandZone = module.exports.saveBrandZone = (zoneDataModel) => {

    return new Promise(function(resolve, reject) {

        return sequelize.transaction(function(t) {
                          
            return zoneDataModel.save({ transaction: t }).then(function(result) {                
                
                resolve(result.dataValues);
                
            }).catch(function(err) {

                console.log("========= Error in teamDAO  (saveUserPermission) ===========");
                console.log(err)
                reject(err);

            });

        }).catch(function(err) {
            
            console.log("========= Error in teamDAO  (saveUserPermission) ===========");
            console.log(err)

        });

    })

}


var deleteZoneOnZoneName = module.exports.deleteZoneOnZoneName = (buId, name) => {

    return new Promise((resolve, reject) => {
        
        var statusFlag = true;
        var query = 'Delete from zones where (name) in (\''+name+'\') and buId = :buId';

        return sequelize.transaction(function (t) {
            return sequelize.query(query, {
                replacements: {buId: buId}, transaction: t
            }).spread(function (status, metadata) {                                
                
                
                if (metadata != null && typeof metadata != 'undefined') {
                    statusFlag = true;
                } else {
                    statusFlag = false;
                }

                resolve(statusFlag);

            }).catch(function (err) {
                console.log("========= Error in PermissionDao  (deletePermissionGroupOnName) ===========");
                console.log(err)
                reject(err);
            })
        });
    });
}

var getZonesAndRegionsOnBuId = module.exports.getZonesAndRegionsOnBuId = (buId) => {

    var query = "select ANY_VALUE(z.name) as zonename, GROUP_CONCAT(r.name) as dataset, GROUP_CONCAT(r.id) as regionSet from zones as z join regions as r on z.regionId = r.id where z.buId=:buId group by z.name";
    
    return new Promise(function(resolve, reject) {
        
        return sequelize.transaction(function(t) {

            return sequelize.query(query,{replacements: {buId: buId},transaction: t}).spread(function(zoneAndRegionList, metadata) {
                if (zoneAndRegionList == null || zoneAndRegionList.length == 0) {
                    zoneAndRegionList = [];
                    resolve(zoneAndRegionList);
                } else {
                    resolve(zoneAndRegionList)
                }
            });
            
        }).catch(function(err) {
            console.log("========= Error in PermissionDao  (zoneAndRegionList) ===========");
            console.log(err)
            reject(err);
        });
    });
}