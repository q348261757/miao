var zxccheng = {                                        //chunk 拆分数组形成新数组
  chunk: function (array, size) {
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
      if (residual != 0 && array.length - 1 - i < residual) {      //将剩余的数字输入到数组中
        result1.push(array[i])
      }
    }
    return result1
  },


  compact: function (array) {                                          //compact 判断值为true还是false
    let result = []
    for (let i = 0; i < array.length; i++) {
      if (array[i]) {
        result.push(array[i])
      }
    } return result
  },


  drop: function (array, n = 1) {                                       //drop 删除在数组开头删除n位 默认删除1位
    for (let i = 0; i < n; i++) {
      array.shift()
    }
    return array
  },


  dropRight: function (array, n = 1) {                                     //dropRight 删除在数组开头删除n位 默认删除1位
    for (let i = 0; i < n; i++) {
      array.pop()
    }
    return array
  },


  fill: function (array, value, start = 0, end = array.length) {                   //fill 替换数组的start到end的值 包含start不包含end
    for (let i = start; i < end; i++) {
      array[i] = value
    }
    return array
  },


  flatten: function (array) {                    //flatten 减少一级数组嵌套深度
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
  },


  flattenDeep: function (array, depth = 1) {
    for (let i = 0; i < depth; i++) {
      array = flatten(array)
    }
    return array
  },

}















