async function process(){
    var myPromise = () => {
        return new Promise((resolve, reject) => {
            order.findOne({service_id: result_us.fullDocument.service_id,area_id: result_us.fullDocument.area_id,status:0},function(err, data){
                if (err)
                    reject(err);
                else if ( data) {
                    
                    data.status = 1;
                    data.save().then(saved => console.log("Thay doi status nhan vien", saved)); 

                    var username = result_us.fullDocument.username;
                    var name = result_us.fullDocument.name;
                    user.updateOne({username: username}, {status: 1},function(err,req){
                        if (err) {  
                            console.log(err);
                        } 
                    });
                    resolve(data);
                    var session = new sessions1({
                        order_id: data.stt,
                        area_id: data.area_id,
                        order_time: data.order_time,
                        service_id: data.service_id,
                        username: username,
                        time_start: moment().format(),
                        time_end: moment().format()
                    });
                    session.save(function (err,ses) {
                        if (err) {  
                            console.log(err);
                        }
                    });                  
                        clientList.forEach((client) => {
                            client.socket.emit(username,{
                                name:name,
                                username:username,
                                session_id: session._id,
                                order_id: order_id,
                                
                            });	
      
                }
});    
        });
    }
    var data = await myPromise();
}
