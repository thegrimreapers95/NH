var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Area = require('../models/area');
var Service = require('../models/service');
var Order = require('../models/order');
var auth = require('../config/auth');
var isSystem = auth.isSystem;
var mongoose = require('mongoose');
var moment =  require('moment');
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
var converter = require('vietnamese-unicode-toolkit/src/index.js')

// Đổi Tiếng Việt có dấu sang không dấu, module node-thermal-printer chưa hỗ trợ Tiếng việt có dấu
function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/i|ì|í|ị|ỉ|ĩ|i|ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ|ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ|đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ|À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ|È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ|Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ|Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ|Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ|Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ|Đ/g, "D");
    return str;
}

async function getAvailableServices(my_area_id) {
    var myUserPromise = () => {
        return new Promise((resolve, reject) => {
            // lấy các mã dịch vụ mà khu vực này đang hỗ trợ (dịch vụ có nhân viên đang có mặt, trạng thái = đang chờ / đang rảnh / đang bận)
            User.find({area_id: my_area_id, status: {$lt: 3}, access: 0}).distinct('service_id', function(err, distinct_id_services){
                if (err) {
                    reject(err);
                } else {
                    resolve(distinct_id_services);
                }
            })
        });
    };

    //await myUserPromise
    var available_services_id = await myUserPromise();

    var services_info = [];
    if (available_services_id.length && available_services_id.length > 0) {
        for(var j = 0; j < available_services_id.length; j++){
            var myServicePromise = () => {
                return new Promise((resolve, reject) => {
                    Service.findById(available_services_id[j], function(err, service){
                        if (err) {
                            reject(err);
                        } else {
                            if (service) {
                                services_info.push(service)
                            }
                            resolve('ok');
                        }
                    })
                });
            };
        
            //await myUserPromise
            var result = await myServicePromise();
        }
    }
    
    
    return services_info;
}

async function print(areaName, serviceName, stt){
    let printer = new ThermalPrinter({
        type: PrinterTypes.EPSON, //
        interface: 'printer:SLK-TE203',
        driver: require('printer'),
        characterSet: 'WPC1258_VIETNAMESE'
    });

    printer.setCharacterSet("WPC1258_VIETNAMESE");
    let isConnected = await printer.isPrinterConnected();
    

    printer.alignCenter();
    printer.setTextQuadArea();   
    await printer.printImage('D:/file/project_namhai/public/assets/pages/img/logo.png');
    printer.newLine();
    printer.alignCenter();
    printer.bold(true); 
    printer.println("Cang Nam Dinh Vu");
    
    printer.bold(false);  
    printer.newLine();
    printer.println('---------------------'); 
    // printer.alignCenter();
    printer.println('So thu tu');
    printer.println('---------------------');
    printer.setTextSize(7, 7);
    printer.println(stt);
    printer.setTextSize(1, 1);
    printer.alignLeft();
    printer.println('---------------------');
    printer.println("Khu vuc: " + xoa_dau(converter(areaName)));
    printer.println("Dich vu: " + xoa_dau(converter(serviceName)));
    printer.println("Thoi gian: " + moment().format('h:mm:ss a'));
    printer.println("Ngay: " + moment().format('DD/MM/YYYY'));
    printer.cut();

    try {
        let execute = printer.execute()
        console.error("Print done!");
    } catch (error) {
        console.log("Print failed:", error);
    }
    
}

router.get('/get-order',isSystem, async function (req, res) {
    var my_area_id = res.locals.user.area_id;

    var myAreaPromise = () => {
        return new Promise((resolve, reject) => {
            // lấy tên của khu vực hiện tại để hiển thị trên giao diện
            Area.findById(my_area_id, function(err, area){
                if (err) {
                    reject(err);
                } else if (area) {
                    resolve(area.name);
                }
            })
        });
    };

    var my_area_name = await myAreaPromise();

    var services_info = await getAvailableServices(my_area_id);

    // Gửi các dịch vụ sang client để cho KH chọn dịch vụ tại khu vực này
    // res.send(res.locals.user.username); 
    
    res.render('get_order', {
        title: 'Lấy số thứ tự',
        area_id: my_area_id,
        area_name: my_area_name,
        available_services: services_info
    });
});

router.post('/get-order', async function (req, res) {

    
    var area_id = req.body.area_id;
    var service_id = req.body.service_id;

   
    var myAreaPromise = () => {
        return new Promise((resolve, reject) => {
            // lấy số order
            Area.findById(area_id, function(err, area){
                if (err) {
                    reject(err);
                } else if (area) {
                    resolve(area);
                }
            })
        });
    };

    var area = await myAreaPromise();

    var myUserPromise = () => {
        return new Promise((resolve, reject) => {
            // lấy các mã dịch vụ mà khu vực này đang hỗ trợ (dịch vụ có nhân viên đang có mặt, trạng thái = đang chờ / đang rảnh / đang bận)
            User.find({area_id: area_id, service_id: service_id, status: {$lt: 3}, access: 0}, function(err, users){
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
        });
    };
    var available_users = await myUserPromise();

    if (available_users.length == 0){ // nếu không có user nào online, thông báo lỗi
        var services_info = await getAvailableServices(area_id);

        req.flash('danger', 'Dịch vụ này hiện không có nhân viên hỗ trợ. Quý khách vui lòng quay lại sau!');
        res.render('get_order', {
            title: 'Lấy số thứ tự',
            area_id: area_id,
            area_name: area.name,
            available_services: services_info
        });
    } else {
        var myServicePromise = () => {
            return new Promise((resolve, reject) => {
                // lấy tên của dịch vụ để in ra Phiếu STT
                Service.findById(service_id, function(err, service){
                    if (err)
                        console.log(err);
                    else {
                        if (service){
                            resolve(service.name);
                        } else {
                            console.log("Khong tim thay service");
                            resolve("");
                        }
                    }
                })
            });
        };
        var serviceName = await myServicePromise();

        var new_order = area.today_order_count + 1;
        area.today_order_count = new_order;
    
        await area.save().then(savedArea => console.log('\nUpdated area {id: ' + savedArea._id + ', name: ' + savedArea.name + ', today_order_count: ' + savedArea.today_order_count + '}'));
    
        var order = new Order({
            stt: new_order,
            service_id: mongoose.Types.ObjectId(service_id),
            status: 0,
            order_time: moment().format(),
            area_id: mongoose.Types.ObjectId(area_id)
        });
    
        await order.save().then(savedOrder => console.log('Created order {stt: ' + savedOrder.stt + ', service_id: ' + savedOrder.service_id + ', area_id ' + savedOrder.area_id + '}'));
        

        print(area.name, serviceName, new_order);

        
        res.redirect('get-order');
    }    
});

module.exports = router;
