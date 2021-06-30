<template>
  <div class="bzz-layout">
    <!--  logo  -->
    <div class="bzz-header">
      <img src="../../assets/images/logo.png">
    </div>
    <!--  内容  -->
    <div class="bzz-content">
      <!--   头部卡片   -->
      <div class="node-box">
        <div class="data-box" v-for="(item, index) in headData" :key="index"
             :style="{ 'background-image': item.color }">
          <p>{{item.tile}}</p>
          <p style="border-bottom: 1px solid #FFFFFF; margin-top: 10px; margin-bottom: 10px"></p>
          <p style="font-size: 30px">{{ item.number }}</p>
        </div>
      </div>
      <!--   其他操作   -->
      <div class="bzz-other">
        <div class="bzz-other-tag">
          <Tag checkable color="primary" size="large">在线：{{stateData.onSum}}</Tag>
          <Tag checkable color="error" size="large">离线：{{stateData.offSum}}</Tag>
          <Select v-model="inputParam.selectValue" @on-change="queryData" style="width: 250px;" filterable>
            <div slot="prefix" style="width: 60px;height: 100%">服务器：</div>
            <Option v-for="(item, index) in selectList" :value="item.ip" :key="index">{{ item.ip }}</Option>
          </Select>
        </div>
        <div class="bzz-other-input">
          <Input @on-search="searchQueryData" v-model="queryParam.phone" placeholder="手机账号搜索"  search></Input>
        </div>
      </div>
      <!--   表格   -->
      <div class="bzz-table">
        <Table :loading="isLoading" :columns="columns" :data="dataList" size="small" height="500" :border="true"></Table>
      </div>
      <!--   分页   -->
      <div class="bzz-paging">
        <Page @on-change="pageClick" :current="queryParam.page" :total="inputParam.total" :page-size="queryParam.limit"/>
        <p>共 {{ inputParam.pages }} 页</p>
      </div>
    </div>
  </div>
</template>

<script>
  import table from '../../libs/render-table'
  import {getListData} from '../../api/data'
  import momnet from 'moment'
  import axios from 'axios'
  export default {
    name: "index",
    data() {
      return {
        isLoading: true,
        columns: [
          {
            title: '节点名称',
            key: 'ip',
            width: 100,
            ellipsis: true,
            tooltip: true
          },
          {
            title: '节点地址',
            key: 'chequeAddr',
            width: 350,
            resizable: true,
            render: (h, params) => {
              return h('a', {
                style: {
                  textDecoration: 'underline'
                },
                on: {
                  click: () => {
                    window.open('https://goerli.etherscan.io/address/' + params.row.chequeAddr)
                  }
                }
              }, params.row.chequeAddr)
            }
          },
          {
            title: '手机账号',
            key: 'phone',
            width: 110,
            resizable: true,
            render: (h, params) => {
              return h('p',this.$options.filters.f_Phone(params.row.phone))
            }
          },
          {
            title: '已兑换支票',
            key: 'alreadyExchanged',
            width: 100,
            align: 'center',
            resizable: true
          },
          {
            title: '支票',
            key: 'cheque',
            width: 120,
            resizable: true,
            render: (h, params) => {
              return h('div', { class: 'bzz-cheque' }, [
                h('p', {
                  style: {
                    color: '#22CF39'
                  }
                }, params.row.totalReceived), //params.row.cheque
                h('p', { style: { 'margin-left': '5px', 'margin-right': '5px' } }, '/'),
                h('p', {
                  style: {
                    color: '#F81515'
                  }
                }, params.row.totalSend), // params.row.cheque.number2
                h('p', { style: { 'margin-left': '5px', 'margin-right': '5px' } }, '/'),
                h('p', {
                  style: {
                    color: '#1E1E1E'
                  }
                }, params.row.totalCheque) // params.row.cheque.number3
              ])
            }
          },
          {
            title: '连接数',
            key: 'peers',
            width: 80,
            align: 'center',
            resizable: true
          },
          {
            title: '外链地址',
            key: 'nodeAddr',
            // width: 120,
            ellipsis: true,
            render: (h, params) => {
              return h('div', {
                on: {
                  click: () => {
                    this.copyText(params.row.nodeAddr)
                  }
                }
              }, [
                h('Tooltip', {
                  class: 'bzz-linkTile',
                  props: {
                    content: '点击我复制地址'
                  }
                }, params.row.nodeAddr)
              ])
            }
          },
          {
            title: '钱包地址',
            key: 'ethAddr',
            // width: 120,
            ellipsis: true,
            render: (h, params) => {
              return h('div', {
                on: {
                  click: () => {
                    this.copyText(params.row.ethAddr)
                  }
                }
              }, [
                h('Tooltip', {
                  class: 'bzz-linkTile',
                  props: {
                    content: '点击我复制地址'
                  }
                }, params.row.ethAddr)
              ])
            }
          },
          {
            title: '更新日期',
            key: 'createTime',
            width: 100,
            resizable: true,
            render: (h, params) => {
              return h('p', {
              },momnet(params.row.updateTime).format('YYYY-MM-DD'))
            }
          },
          {
            title: '状态',
            key: 'peers',
            width: 80,
            render: (h, params) => {
              return h('p', {
                class: 'state',
                style: { color: this.f_Color(params.row.peers) }
              },this.$options.filters.f_State(params.row.peers))
            }
          },
          {
            title: '操作',
            key: 'Action',
            width: 80,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    disabled: params.row.state === 0 ? true: false,
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      params.row.state = 0
                      this.extractMoney(params.index)
                    }
                  }
                }, '提现')
              ])
            }
          }
        ], // 表头数据配置
        headData: [
          {tile: '总节点数', number: 0, color: 'linear-gradient(to left,#7874FF,#DAB4FE)'},
          {tile: '总链接数', number: 0, color: 'linear-gradient(to left,#84E37D,#7EDCC9)'},
          {tile: '总兑换(gBZZ)', number: 0, color: 'linear-gradient(to left,#FE8887,#F6C59A)'},
          {tile: '总支票合计', number: 0, color: 'linear-gradient(to left,#FD76A6,#FFAAD6)'},
          {tile: '总已兑换支票', number: 0, color: 'linear-gradient(to left,#76A3FD,#A3DAEB)'},
        ], // 头部卡片数据
        dataList: [], // 表格数据
        selectList: [{ip: '26.262.263.2'}], // 服务器下拉数据
        stateData: {
          offSum: 0,
          onSum: 0
        },
        pageData: {
          pages: ''
        },
        queryParam: {
          page: 1,
          limit: 20,
          phone: '',
          rnd5: ''
        }, // 查询参数
        inputParam: {
          total: 0,
          size: 10,
          pages: 0,
          selectValue: ''
        }  // 输入参数
      }
    },
    mounted() {
      this.paramData()
      this.queryData()
    },
    methods: {
      // 搜索框查询
      searchQueryData() {
        this.queryParam.page = 1
        this.queryData()
      },
      // 查询数据
      queryData() {
        const _this = this
        _this.isLoading = true
        getListData(this.queryParam).then(res => {
          const {data, code, msg} = res.data
          _this.isLoading = false
          if (code === 0) {
            // 分页数据
            _this.inputParam.total = data.totalNode
            _this.inputParam.pages = data.totalPage
            // 状态数据
            _this.stateData.onSum = data.onlines || 0
            _this.stateData.offSum = data.offlines || 0
            // 头部卡片数据
            _this.headData[0].number = data.totalNode
            _this.headData[1].number = data.totalPeers
            _this.headData[2].number = data.totalGBzz
            _this.headData[3].number = data.totalCheque
            _this.headData[4].number = data.totalAlreayCheque
            // 列表数据
            _this.dataList = data.data
            // 弹框信息
            _this.$Message.success('查询成功')
          } else {
            _this.$Message.error(msg)
          }
          // console.log(data,code)
        })
      },
      // 复制
      copyText(data) {
        console.log(data)
        this.$copyText(data).then(res => {
          console.log(res)
        })
      },
      // 提现
      extractMoney() {
        this.$Message.error('暂不支持提现')
      },
      // 页面切换
      pageClick(index) {
        this.isLoading = true
        this.queryParam.page = index
        this.queryData()
      },
      // 状态颜色转换
      f_Color(data) {
        if (data < 1) {
          return '#FF4646'
        } else {
          return '#12D526'
        }
      },
      // 浏览器地址栏默认参数设置
      paramData() {
        this.queryParam.phone = this.$route.query.phone === undefined ? '' : this.$route.query.phone
        this.queryParam.limit = this.$route.query.limit === undefined ? 10 : this.$route.query.limit
        this.queryParam.page = this.$route.query.page === undefined ? 1 : this.$route.query.page
        this.queryParam.rnd5 = Math.ceil(Math.random()* 999999999)
      }
    },
    filters: {
      // 状态过滤
      f_State(data) {
        if (data < 1) {
          return '离线'
        } else {
          return '在线'
        }
      },
      /**
       * 过滤手机号
       */
      f_Phone(data) {
        if (data !== '' && data !== null) {
          return data.replace(/^(.{3}).+(.{4})$/, '$1****$2');
        }
        return ''
      }
    }
  }
</script>

<style lang="less">
  @import './index.less';
</style>
