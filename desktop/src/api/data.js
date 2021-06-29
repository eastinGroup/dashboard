import axios from '@/libs/api.request'
// 获取列表数据
export const getListData = (data) => {
  return axios.request({
    url: 'https://api.swarmbee.xyz/getListnew',
    params: data,
    method: 'get'
  })
}
