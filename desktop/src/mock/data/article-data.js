import Mock from 'mockjs'
const Random = Mock.Random
// 随机文章类型
Random.extend({
  articleTypes: function (date) {
    const articleTypes = ['技术', '小说', '散文', '文言文', '新闻', '娱乐', '科技', '军事', '农业', '宇宙']
    return this.pick(articleTypes)
  }
})
// 随机文章状态
Random.extend({
  articleStates: function (date) {
    const articleStates = ['上架', '下架', '审核', '违规', '通过', '停更', '完结']
    return this.pick(articleStates)
  }
})
// 随机背景颜色
Random.extend({
  backgroundColor: function (date) {
    const backgroundColor = ['#ffcc33', '#FFE4B5', '#FF7F00', '#FF6A6A', '#EEAD0E', '#CD8500', '#9E9E9E']
    return this.pick(backgroundColor)
  }
})
// 随机文字颜色
Random.extend({
  textColor: function (date) {
    const textColor = ['#0A0A0A', '#FFF']
    return this.pick(textColor)
  }
})
// 文章列表数据
export const article_list = (req) => {
  const reqs = JSON.parse(req.body)
  console.log(reqs)
  const list = []
  // 生成指定数量数据
  for (let i = 0; i < reqs.pageSize; i++) {
    list.push(Mock.mock({
      id: Random.id(),
      articleTitle: '@ctitle(5)',
      articleContent: '@cparagraph(12)',
      articleType: Random.articleTypes(),
      articleAuthor: '@cname',
      cover: Random.image('900x600', Random.backgroundColor(), Random.textColor(), 'png', Random.csentence(3, 10)),
      publishDate: '@datetime',
      'admireNumber|1-100000': 100000,
      'browseNumber|1-100000': 100000,
      state: Random.articleStates()
    }))
  }
  return list
}

// 轮播图数据
export const carousel_List = (req) => {
  const reqs = JSON.parse(req.body)
  console.log(reqs)
  const list = []
  // 生成指定数量数据
  for (let i = 0; i < reqs.pageSize; i++) {
    list.push(Mock.mock({
      id: Random.id(),
      articleLink: Random.image('600x200', Random.backgroundColor(), Random.textColor(), 'text', Random.csentence(3, 10)),
      imageLink: Random.image('600x200', Random.backgroundColor(), Random.textColor(), 'png', Random.csentence(3, 10))
    }))
  }
  return list
}
