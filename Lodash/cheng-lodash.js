var cheng = function(array,size){
  debugger
  var result1 = []
  var result2 = []
  var count = 1
  for (var i = 0 ; i < array.length ; i++){
    result2.push(array[i])
    if(count == size){
      result1.push(result2)
      count = 1
      result2 = []
    }else{
      count++
    }
    if(array.length - i + 1 < size){
      result1.push(array[i])
    }
  }
  return result1
}