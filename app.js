// 导入模块
let Crawler = require("crawler");
let fs = require("fs");
// 导入模块
const MongoClient = require("mongodb").MongoClient;

// 定义mongoDB的地址 本机
const url = "mongodb://localhost:27017";

// 库的名字
const dbName = "test";

let c = new Crawler({
  maxConnections: 10,
  rateLimit: 1000,
  // This will be called for each crawled page
  callback: function(error, res, done) {
    if (error) {
      console.log(error);
    } else {
      // 官网
      /*
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
        // console.log($("title").text());
        
        // 如何用jq 获取 .head_index head_nav li a 的内容
        // console.log($('.head_index li a').text());
        // let total = [];
        // $('.head_index li a').each((i,e)=>{
                //     // e dom jQ
                //     let obj ={
                    //         title:$(e).text(),
                    //         href:$(e).attr('href')
                    //     }
                    //     total.push(obj)
                    // })
                    // console.log(total);
                    */
      MongoClient.connect(
        url,
        function(err, client) {
        //   assert.equal(null, err);
          console.log("Connected successfully to server");

          const db = client.db(dbName);
          // 获取数据
          var $ = res.$;
          let foodList = [];
          // 下厨房
          $(".normal-recipe-list li").each((i, e) => {
            let name = $(e)
              .find("p.name a")
              .text();
            let ing = $(e)
              .find("p.ing a")
              .text();
            let stats = $(e)
              .find("p.stats")
              .text();
            let author = $(e)
              .find("p.author a")
              .text();

            // 图片名
            let imgName = $(e)
              .find(".cover img")
              .attr("data-src");
            foodList.push({
              name,
              ing,
              stats,
              author,
              imgName
            });
          });
          // 插入数据
          // 获取集合
          let connection = db.collection("foodList");
          //   插入大量数据
          connection.insertMany(foodList, () => {
            console.log("success");
          });

          client.close();
        }
      );

      //   打印数据;
      //   console.log(foodList);
      //   fs.createWriteStream(res.options.filename).write(res.body);
    }
    done();
  }
});

// Queue just one URL, with default callback
// c.queue('http://www.itcast.cn/');
c.queue(
  "http://www.xiachufang.com/search/?keyword=%E8%A5%BF%E5%85%B0%E8%8A%B1%E7%82%92%E8%9B%8B&cat=1001"
);
c.queue(
  "http://www.xiachufang.com/search/?keyword=%E8%A5%BF%E5%85%B0%E8%8A%B1%E7%82%92%E8%9B%8B&cat=1001&page=2"
);
c.queue(
  "http://www.xiachufang.com/search/?keyword=%E8%A5%BF%E5%85%B0%E8%8A%B1%E7%82%92%E8%9B%8B&cat=1001&page=3"
);
c.queue(
  "http://www.xiachufang.com/search/?keyword=%E8%A5%BF%E5%85%B0%E8%8A%B1%E7%82%92%E8%9B%8B&cat=1001&page=4"
);
c.queue(
  "http://www.xiachufang.com/search/?keyword=%E8%A5%BF%E5%85%B0%E8%8A%B1%E7%82%92%E8%9B%8B&cat=1001&page=5"
);
c.queue(
  "http://www.xiachufang.com/search/?keyword=%E8%A5%BF%E5%85%B0%E8%8A%B1%E7%82%92%E8%9B%8B&cat=1001&page=6"
);
c.queue(
  "http://www.xiachufang.com/search/?keyword=%E8%A5%BF%E5%85%B0%E8%8A%B1%E7%82%92%E8%9B%8B&cat=1001&page=7"
);

// 请求图片
// c.queue({
//   uri:
//     "http://i1.chuimg.com/d155b1cc871311e6a9a10242ac110002_496w_372h.jpg",
//   filename: "496w_372h.jpg"
// });
