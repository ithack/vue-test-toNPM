/*关于mac系统下使用本文件问题记录：
  1：mac下可能1024端口以下不让用；
  解决办法：可用sudo运行node server.js 试一下；如不行请关闭自带的apache服务；另本文件有待优化，把80端口映射转发到其他自定义端口，以便多个项目同时运行
  2：mac下读取文件有问题，可能是path或__dirname问题引起，读出来的当前根目录文件非项目根目录而是当前项目上一级目录，另需要确认在mac里是不是需要用/a/b的方式才能读取文件还是和win一样用\a\b的方式读取
*/
/**
 * 2017/12/27
 * Created by yangkai9
 */
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    vJson=JSON.parse(fs.readFileSync("config.json")),
    local_folders,
    header_url;
console.log(vJson.publish);
local_folders = path.join(__dirname)+"\\dist\\"+vJson.publish// 本地路径，代理将在这个列表中的目录下寻找文件，如果没有找到则转到线上地址
header_url = "E:\\project\\jd-worldwide-header"; // 公用头尾引用
http.createServer(function (request,response){
    var req_url = request.url,
        fn,
        comboFile='';
    if(req_url.match(/\/(js|css|i)(\S*)*(.js|.css|.png|.ico|.jpg|.gif)/)){
        fn=req_url.match(/\/(js|css|i)(\S*)*(.js|.css|.png|.ico|.jpg|.gif)/)[0].replace(/\/+/g,'\\');
    }else{
        console.log("失败："+req_url)
        response.writeHead(404);
        response.end();
        return false
    }
    // 处理类似 http://a.tbcdn.cn/??p/global/1.0/global-min.css,tbsp/tbsp.css?t=20110920172000.css 的请求
    if(req_url.indexOf('lib/')!=-1){
        let val=fn.replace('??','');
        val.split(',').map(function(item,i){
            if(i>0){
                console.log(item)
                item.indexOf('lib')==-1&&(item='\\js\\lib\\'+item)||(item='\\js\\'+item);
                console.log(local_folders+item)
                comboFile+=fs.readFileSync(local_folders+item,"UTF-8")
            }else{
                console.log(fs.existsSync(local_folders+item))
                console.log(local_folders+item)
                comboFile+=fs.readFileSync(local_folders+item,"UTF-8")
            }
        })
        console.log('combo文件读取')
        response.writeHead(200);
        response.write(comboFile);
        response.end();
    }else{
        if(req_url.indexOf('/header/')!=-1){
            let headerFn=req_url.match(/\/(dist)(\S*)*(.js|.css|.png|.ico|.jpg|.gif)/)[0]
            fn=header_url+headerFn;
        }else if(req_url.indexOf('/gemini/')!=-1) {
            let headerFn = req_url.match(/\/(gemini.mini)(\S*)*(.js|.css|.png|.ico|.jpg|.gif)/)[0];
            fn = header_url + headerFn;
        }else{
            fn=local_folders+fn;
        }
        if(fs.existsSync(fn)){
            console.log("本地读取成功:"+fn);
            fs.readFile(fn,function (err,data) {
                response.writeHead(200);
                response.write(data);
                response.end();
            });
        }else{
            console.log("文件读取失败："+fn);
            response.writeHead(404);
            response.end();
        }
    }
}).listen(80);
console.log('Server running at http://127.0.0.1:80/');
