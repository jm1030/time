require('dotenv').config();
const express = require('express');
var fs = require('fs')
const nunjucks = require('nunjucks');
const app = express();
// const port = process.env.SERVER_PORT || 3000; 
const mysql = require('mysql');
const bodyParser = require('body-parser');
// const {response} = require('express');
// const error = require('response');
//const response = require('express');
// var router = express.Router();
var path = require('path');
var sql = 'select * from member';



nunjucks.configure('views', {
    express:app,
    watch: true,
});

var http = require('http');
// const board = require('./board.js');
const response = require('response');
const { title } = require('process');
//var server = http.createServer(app).listen(80);
//console.log("server is running...")

//mysql 접속 정보
//var mysql = require('mysql');
//const request = require('request');

// app.use('/', router)
app.use(bodyParser.urlencoded({extended:false}));
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
// app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

let connection = mysql.createConnection({
  //host: '127.0.0.1',
  host: 'localhost',
  user:'root',
  port:'3306',
  password: '10301030',
  database: 'helplist',
});

//mysql 접속하기
connection.connect();

// let async = require('async');
// function HelpLoadFunction(callback) {
//     models.Help.findAll().then(function(result){    //result가 board 테이블의 모든 값을 json으로 반환
//         let jsonObj = [];                //board 테이블의 데이터를 담을 배열
//         let task = function(call){            
//                 if(result.length==0)    //게시판에 글이 하나도 없을 때0값 리턴
//                     callback(0)
//                 else{
//                     for(let i=0;i<result.length;i++)        //데이터의 개수만큼 반복문
//                         jsonObj.push(result[i].dataValues)    //jsonObj 배열에 select * from board 값을 저장
//                     call(null,jsonObj);                        //위의 쿼리문 결과를 다음 함수로 넘겨줌
//                 }
//             }
//         async.waterfall(task,function(err){
//             if(err)
//                 console.log(err)
//         })
//     }).catch(function(err){
//         console.log(err);
//     })
// }
// //exports.boardLoadFunction = boardLoadFunction;

// app.get('/view',function(request,response){
//     help.HelpLoadFunction(function(result){
//         res.render('view',{data:JSON.stringify(result)})
//     })
// })

// if(path === 'http://127.0.0.1:3000/board'){
//     board.home(request,response);
// }
// exports.home = function(request,response){
//     connection.query("select *, @idx:=@idx+1 as idx2, date_format(today, '%H:%m %m-%d-%Y ') as today, hit from help, (select @idx:=0)A", (error,results)=>{
//         var list = board.list(results);
//         var html = board.HTML(list,
//             '${board.HelpTable(results)}'
//             )
//         if(error){
//                 console.log(error);
//         }else{
//                 console.log(results);
//                 response.render('board.js',{
//                 rows: rows?rows:{}
//             })
//         }
//         })
//         response.writeHead(200);
//         response.end(html);
// }

app.post('/writedone',function(request,response){
    const name = request.body.name;
    const timecoin = request.body.timecoin;
    const gender = request.body.gender;
    const title = request.body.title;
    const content = request.body.content;
    const address = request.body.address;
    console.log(request.body);
  
    const sql = "INSERT INTO HELP (name, timecoin, gender,title, content, address) VALUES (?,?,?,?,?,?)";
    const params = [name, timecoin, gender, title, content, address];
    connection.query(sql,params,(error)=>{
         if(error){
           console.log(error);
        }else{
         //console.log(result);
         //location.href="view.html?"+title+":"+address+":"+name+":"+timecoin+":"+gender+":"+content;
         response.render('view.html',{name:name, timecoin:timecoin, gender:gender, title:title, content:content,address:address});
         response.writeHead(302, {location:'http://localhost:3000/view.html'});
         response.end();
       }
    })
    //console.log(window.test);
    // if (window.location='http://localhost:3000/writedone'){
    // window.location.href='http://localhost:3000/view';
    // } 
    //return response.redirect("/view"); 
});

      
//------------------ V I E W -------------------//

app.get('/view',(request,response)=>{
  let idx = request.query.idx;
  console.log(request.query);
  
  connection.query("select * from help where idx='${idx}'",(error,results)=>{
      if(error){
          console.log(error)
      }else{
          console.log(results)
          response.render('view.html',{
              view_db:results[0],
          });
      };
  });

  connection.query(`update help set hit=hit+1 where idx='${idx}'`);
  
})
app.get('/modify',(request,response)=>{

  let idx=request.query.idx;

  connection.query(`select * from help where idx=${idx}`,(error,results)=>{
      if(error){
          console.log(error)
      }else{
          console.log(results);
          response.render('list_modify.html',{
              modify_db:results[0],
          });
      };
  });
});

app.post('/modifydone',(request,response)=>{
  let idx = request.body.idx;
  console.log(request.body);
  let name=request.body.name;
  let timecoin=request.body.timecoin;
  let gender=request.body.gender;
  let title=request.body.title;
  let content=request.body.content;
  let address = request.body.address;
  let sql = "update help set name='${name}', timecoin='${timecoin}', gender='${gender}', title='${title}', content='${content}', address='${address}', today=now() where idx='${idx}'";

  connection.query(sql,(error,results)=> {
      if(error){
          console.log(error);
      }else{
          console.log(results);
          response.redirect('list.html');
      };
  });
});

app.get('/delete',(request,response)=>{
    
  let idx=request.query.idx;
  let sql=`delete from help where idx='${idx}'`;
  connection.query(sql,(error,results)=>{
      if(error){
          console.log(error);
      }else{
          response.redirect('list.html');
      };
  });
});

app.listen(3000,()=>{
  console.log('server start port : 3000')
});

// module.exports=app;
