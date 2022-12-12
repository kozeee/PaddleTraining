var axios = require("axios").default;
require('dotenv').config()

vendor = process.env.Vendor
authcode = process.env.Auth
console.log(vendor, authcode)
let delCoupons = []
proxyProduct = 41270

async function updateCoupons() {
    var options = {
        method: 'POST',
        url: 'https://sandbox-vendors.paddle.com/api/2.1/product/update_coupon',
        headers: { 'Content-Type': 'application/json' },
        data: {
            vendor_id: vendor,
            vendor_auth_code: authcode,
            group: 'TEST',
            product_ids: '41270',
        }
    };

    await axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });
}

async function listCoupons() {
    var axios = require("axios").default;

    var options = {
        method: 'POST',
        url: 'https://sandbox-vendors.paddle.com/api/2.0/product/list_coupons',
        headers: { 'Content-Type': 'application/json' },
        data: { vendor_id: vendor, vendor_auth_code: authcode, product_id: proxyProduct }
    };

    await axios.request(options).then(function (response) {
        for (i in response.data.response) { delCoupons.push(response.data.response[i].coupon) }
    }).catch(function (error) {
        console.error(error);
    });
}

async function deletion(coupons) {
    var axios = require("axios").default;
    for (coupon in coupons) {
        console.log(coupons[coupon])
        var options = {
            method: 'POST',
            url: 'https://sandbox-vendors.paddle.com/api/2.0/product/delete_coupon',
            headers: { 'Content-Type': 'application/json' },
            data: { vendor_id: vendor, vendor_auth_code: authcode, coupon_code: coupons[coupon], product_id: proxyProduct }
        };

        axios.request(options).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }
}


async function main() {
    await updateCoupons()
    await listCoupons()
    console.log(delCoupons)
    await deletion(delCoupons)
}
main()
