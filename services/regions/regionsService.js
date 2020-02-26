var sequilizeinitialize = require("../../libraries/database/sequilizeInitialize");
var regionsModel = sequilizeinitialize.regionsModel;
var zonesModel = sequilizeinitialize.zonesModel;
var applicationConstants = require("../../config/applicationConstants");
//var dateUtils = require("../../libraries/dateUtils/dateUtils");
var regionDao = require("../../persistance/regions/regionDao");
var async = require("async");

var getAllRegionsOnBuId = (module.exports.getAllRegionsOnBuId = buId => {
	return new Promise((resolve, reject) => {
		var regionListPromise = regionDao.getAllRegionsOnBuId(buId);

		regionListPromise
			.then(resList => {
				resolve(resList);
			})
			.catch(err => {
				console.log(
					"================= Error in RegionService (getAllRegionsOnBuId) ==============="
				);
				console.log(err);
				reject(err);
			});
	});
});

var saveBrandRegion = (module.exports.saveBrandRegion = regionObj => {
	return new Promise((resolve, reject) => {
		var regionModel = regionsModel.build({
			buId: regionObj.buId,
			name: regionObj.name,
			status: "Active",
			district: regionObj.district,
			state: regionObj.state,
			country: regionObj.country,
			lat: regionObj.lat,
			lng: regionObj.lng,
			createdDate: dateUtils.getIstTime(
				applicationConstants.format_YYYY_MM_DD_HH_mm_ss
			),
			createdBy: regionObj.buId,
			modifiedDate: dateUtils.getIstTime(
				applicationConstants.format_YYYY_MM_DD_HH_mm_ss
			),
			modifiedBy: regionObj.buId
		});

		var saveRegionDataPromise = regionDao.saveBrandRegion(regionModel);

		saveRegionDataPromise
			.then(resData => {
				resolve(resData);
			})
			.catch(err => {
				console.log(
					"================= Error in RegionService (saveBrandRegion) ==============="
				);
				console.log(err);
				reject(err);
			});
	});
});

var getAllZonesOnBuId = (module.exports.getAllZonesOnBuId = buId => {
	return new Promise((resolve, reject) => {
		var zonesListPromise = regionDao.getAllZonesOnBuId(buId);

		zonesListPromise
			.then(resList => {
				resolve(resList);
			})
			.catch(err => {
				console.log(
					"================= Error in RegionService (getAllZonesOnBuId) ==============="
				);
				console.log(err);
				reject(err);
			});
	});
});

var saveBrandZone = (module.exports.saveBrandZone = zoneDataObj => {
	var statusFlag = true;
	return new Promise((resolve, reject) => {
		async.eachSeries(
			zoneDataObj.regions,
			function(regionId, cb) {
				var zoneDataModel = zonesModel.build({
					name: zoneDataObj.zoneName,
					regionId: regionId,
					buId: zoneDataObj.buId,
					status: "Active",
					createdDate: dateUtils.getIstTime(
						applicationConstants.format_YYYY_MM_DD_HH_mm_ss
					),
					createdBy: zoneDataObj.buId,
					modifiedDate: dateUtils.getIstTime(
						applicationConstants.format_YYYY_MM_DD_HH_mm_ss
					),
					modifiedBy: zoneDataObj.buId
				});

				var saveZonePromise = regionDao.saveBrandZone(zoneDataModel);

				saveZonePromise
					.then(savedRes => {
						if (typeof savedRes == "undefined" || savedRes == null) {
							statusFlag = false;
						}

						cb();
					})
					.catch(err => {
						console.log(
							"================= Error in RegionService (getAllZonesOnBuId) ==============="
						);
						console.log(err);
						statusFlag = false;
						cb();
					});
			},
			function(err) {
				if (statusFlag) {
					resolve(statusFlag);
				} else {
					reject(statusFlag);
				}
			}
		);
	});
});

var deleteZoneOnZoneName = (module.exports.deleteZoneOnZoneName = (
	buId,
	name
) => {
	return new Promise((resolve, reject) => {
		var deleteZonePromise = regionDao.deleteZoneOnZoneName(buId, name);
		deleteZonePromise
			.then(statusFlag => {
				resolve(statusFlag);
			})
			.catch(err => {
				console.log(
					"=============== Error in Region (deleteZone) ============="
				);
				console.log(err);
				reject(err);
			});
	});
});

var getZonesAndRegionsOnBuId = (module.exports.getZonesAndRegionsOnBuId = buId => {
	var zoneRegionIdList = [];
	var finalZoneList = [];
	var finalZoneAndRegionList = [];

	var regionDetailsList = [];

	return new Promise((resolve, reject) => {
		var regionListPromise = regionDao.getAllRegionsOnBuId(buId);
		regionListPromise
			.then(regionListRes => {
				regionDetailsList = regionListRes;

				console.log("============ regionDetailsList ==============");
				console.log(regionDetailsList);

				return regionDao.getZonesAndRegionsOnBuId(buId);
			})
			.then(zoneListRes => {
				if (zoneListRes.length != 0) {
					for (var i = 0; i < zoneListRes.length; i++) {
						var zoneObj = zoneListRes[i];

						var regionName = zoneObj.dataset;

						regionName = regionName.split(",");

						var regionIdSet = zoneObj.regionSet;

						regionIdSet = regionIdSet.split(",");

						regionIdSet = regionIdSet.map(function(item) {
							zoneRegionIdList.push(parseInt(item, 10));
							return parseInt(item, 10);
						});

						zoneObj.dataset = regionName;
						zoneObj.regionSet = regionIdSet;
						finalZoneList.push(zoneObj);
					}

					for (var i = 0; i < finalZoneList.length; i++) {
						var zoneAndRegionObj = finalZoneList[i];

						var zoneName = zoneAndRegionObj.zonename;
						var regionNameList = zoneAndRegionObj.dataset;
						var regionIdList = zoneAndRegionObj.regionSet;

						var finalZoneObj = {
							zoneName: zoneName
						};

						var subRegionList = [];

						for (var j = 0; j < regionNameList.length; j++) {
							var subRegionObj = {};
							subRegionObj.regionName = regionNameList[j];
							subRegionObj.regionId = regionIdList[j];
							subRegionList.push(subRegionObj);
						}

						finalZoneObj.regions = subRegionList;
						finalZoneAndRegionList.push(finalZoneObj);
					}

					//Find regions which are not added in any of the zones
					var otherFinalZoneObj = {
						zoneName: "Others"
					};
					var otherSubRegionList = [];
					for (var i = 0; i < regionDetailsList.length; i++) {
						if (!zoneRegionIdList.includes(regionDetailsList[i].id)) {
							var otherSubRegionObj = {};
							otherSubRegionObj.regionName = regionDetailsList[i].name;
							otherSubRegionObj.regionId = regionDetailsList[i].id;
							otherSubRegionList.push(otherSubRegionObj);
						}
					}

					otherFinalZoneObj.regions = otherSubRegionList;
					finalZoneAndRegionList.push(otherFinalZoneObj);
				} else {
					
					//Find regions which are not added in any of the zones
					var otherFinalZoneObj = {
						zoneName: "Others"
					};
					var otherSubRegionList = [];
					for (var i = 0; i < regionDetailsList.length; i++) {
						
						if (!zoneRegionIdList.includes(regionDetailsList[i].id)) {
							
							var otherSubRegionObj = {};
							otherSubRegionObj.regionName = regionDetailsList[i].name;
							otherSubRegionObj.regionId = regionDetailsList[i].id;
							otherSubRegionList.push(otherSubRegionObj);

						}
					}

					otherFinalZoneObj.regions = otherSubRegionList;
					finalZoneAndRegionList.push(otherFinalZoneObj);

				}

				console.log("======== Final Others Data ===========");
				console.log(finalZoneAndRegionList);

				resolve(finalZoneAndRegionList);
			})
			.catch(err => {
				console.log("=============== Error in Region (getZonesAndRegionsOnBuId) =============");
				console.log(err);
				reject(err);
			});
	});
});
