var zxccheng = function(){
  function chunk(array, size) {                               //chunk 拆分数组形成新数组
    let result1 = []
    let result2 = []
    let count = 1
    let residual = array.length % size                      //判断时是否有剩余的数字
    for (let i = 0; i < array.length; i++) {
      result2.push(array[i])
      if (count == size) {
        result1.push(result2)
        count = 1
        result2 = []
      } else {
        count++                                               //计数循环次数 循环size次
      }
      if (residual != 0 && array.length - i - 1 < residual) {      //将剩余的数字输入到数组中
        result1.push(result2)
        result2 = []
      }
    }
    return result1
  }


  function compact(array) {                                          //compact 判断值为true还是false
    let result = []
    for (let i = 0; i < array.length; i++) {
      if (array[i]) {
        result.push(array[i])
      }
    } return result
  }


  function drop(array, n = 1) {                                       //drop 删除在数组开头删除n位 默认删除1位
    for (let i = 0; i < n; i++) {
      array.shift()
    }
    return array
  }


  function dropRight(array, n = 1) {                                     //dropRight 删除在数组开头删除n位 默认删除1位
    for (let i = 0; i < n; i++) {
      array.pop()
    }
    return array
  }


  function fill(array, value, start = 0, end = array.length) {                   //fill 替换数组的start到end的值 包含start不包含end
    for (let i = start; i < end; i++) {
      array[i] = value
    }
    return array
  }


  function flatten(array) {                    //flatten 减少一级数组嵌套深度
    let result = []
    for (let i = 0; i < array.length; i++) {
      if (Array.isArray(array[i])) {
        let len = array[i]
        for (let j = 0; j < len.length; j++) {
          result.push(len[j])
        }
      } else {
        result.push(array[i])
      }
    }
    return result
  }


  function flattenDeep(array, depth = 1) {        //flattenDeep  减少指定数组嵌套深度
    for (let i = 0; i < depth; i++) {
      array = flatten(array)
    }
    return array
  }



  function fromPairs( pairs ){                      //fromPairs  返回一个由键值对pairs构成的对象。
    var object = {}
    for(var i = 0 ; i < pairs.length ; i++){
      object[pairs[i][0]] = pairs[i][1]
    }
    return object
  }


  function head(array){                              //head  返回数组第一个值
   return array[0]
  }

  function indexOf(array , value , fromIndex = 0){          //indexOf  返回首次 value 在数组array中被找到的 索引值
  if(fromIndex >= 0){
    for(var i = fromIndex ; i < array.length ; i++){
      if(array[i] == value){
        return i
      }
    }
  }else{
    for(var j = array.length - 1 ; j >= 0 ; j--){
      if(array[j] == value){
        return j
      }
    }
  }
  return -1
  }


  function initial(array){                      //initial  获取数组array中除了最后一个元素之外的所有元素
    array.pop()
    return array
  }


  function join(array , separator = ','){             //join    将 array 中的所有元素转换为由 separator 分隔的字符串。
    var result = array[0]
    for(var i = 1 ; i < array.length ; i++){
      result = result + '~' + array[i]
    }
    return result
  }


  function last(array){                                 //last  获取array中的最后一个元素。
    return array[array.length - 1]
  }


  function lastIndexOf(array , value , fromIndex = array.length-1){             //lastIndexOf   这个方法类似indexOf ，区别是它是从右到左遍历array的元素。
    for(var i = fromIndex ; i >= 0 ; i--){
      if(array[i] == value){
        return i
      }
    }
    return -1
  }


  function nth(array , n = 0){                                    //  nth  获取array数组的第n个元素。如果n为负数，则返回从数组结尾开始的第n个元素。
    if(n >= 0){
      return array[n]
    }else{
      return array[array.length + n]
    }
  }


  function ary(func , n = func.length){             ///ary  创建一个调用func的函数。调用func时最多接受 n个参数，忽略多出的参数。
    return function(...arge){
      return func.call(this, ...argr.slice(0, n))
    }
  }


  function unary(func){
    return ary(func , 1)
  }


  function negate( predicate ){     //创建一个针对断言函数 func 结果取反的函数。 func 断言函数被调用的时候，this 绑定到创建的函数，并传入对应参数。
    return function( ...arge){
      return !predicate(...arge)
    }
  }


  function spread(func){  //创建一个函数，调用func时，this绑定到创建的新函数，把参数作为数组传入，类似于Function#apply.
    return function(ary){
      return func(...ary)
    }
  }


  function flip(func){                //创建一个函数，调用func时候接收翻转的参数。
    return function(...args){
      return func(...args)
    }
  }


function before(n , func){
  var c = 0
  var result
  return function(...args){
    if (c < n ){
      result = func(...args)
      c++
    }
    return result
  }
}



function memoize(func, resolver){
  var map = new Map()
  return function(val){
    if(map.has(val)){
      return map.get(val)
    }
    var result = func(val)
    map.set(val , result)
    return result
  }
}













return {
  chunk: chunk,
  compact: compact,
  drop: drop,
  dropRight: dropRight,
  fill: fill,
  flatten: flatten,
  flattenDeep: flattenDeep,
  fromPairs: fromPairs,
  head: head,
  indexOf: indexOf,
  initial: initial,
  join: join,
  last: last,
  lastIndexOf: lastIndexOf,
  nth: nth,
}




}()















