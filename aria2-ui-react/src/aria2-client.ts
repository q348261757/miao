import { rejects } from "assert";



export default class Aria2Client{

  ws:WebSocket;
  id:number;

  //记录每个ID请求 对应的回调函数
  //内容为ID映射到回调函数
  callback:{
    [id:number]:(data:any) => void
  }={}               //声明callback 的类型 同时声明为一个空对象

  constructor(private ip:string = '127.0.0.1',public port:number|string, private secret:string){
    //接受ip地址 端口号（port）
    //secret 为登录密码 在aria2启动时设置
    var url = `ws://${ip}:${port}/jsonrpc`  //拼接出用于建立websocket连接的url
    this.ws = new WebSocket(url)       //用于建立 websocket连接
    this.id = 1    //id为任务id

    this.ws.addEventListener('error', function(){
      console.log('连接失败')
    })




    this.ws.addEventListener('message', (e) => {  //当websocket连接接受到来自服务器端的响应时 触发的事件
      var data = JSON.parse(e.data)
      var id = data.id    //获取到接受到的响应时哪个任务的ID

      if(id){       //判断任务是否成功建立  成功后存在任务Id 失败不存在id
        var callback = this.callback[id]  //获取到任务对应的回调函数
        callback(data)      //传入数据 运行回调函数
      } else {
        //不存在Id说明 响应回的是事件，如：onDownloadStart，onDownloadError
      }
    })
  }


  addUri(...args:any[]){                 //添加下载任务    发送下载任务的请求
    return new Promise((resolve, rejects) =>{
      var id = this.id++

      function callback(data:any){      //当前任务的回调
        if(data.error){
          rejects(data.error)
        }else{
          resolve(data.result)
        }
      }

      this.callback[id] = callback    //将回调放入callback中 id映射回调

      this.ws.send(JSON.stringify({
        jsonrpc:'2.0',
        id: id ,
        method:'aria2.addUri',           //请求响应所使用的方法
        params:[`token:${this.secret}`, ...args]
      }))
    })
  }








}