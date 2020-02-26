var companyDao = require("../../persistance/company/companyDao");
var async = require("async");

var getAllCompany = (module.exports.getAllCompany	 = () => {
	return new Promise((resolve, reject) => {
		var companyListPromise = companyDao.getAllCompany();
		companyListPromise
			.then(resList => {
				resolve(resList);
			})
			.catch(err => {
				console.log(
					"================= Error in CompanyService (getAllCompany) ==============="
				);
				console.log(err);
				reject(err);
			});
	});
});