const _this = this
export default [
  {
    title: '节点名称',
    key: 'nodeName',
    width: 100,
    resizable: true
  },
  {
    title: '节点地址',
    key: 'nodeAddress',
    width: 200,
    resizable: true,
    render: (h, params) => {
      return h('a', {
        style: {
          textDecoration: 'underline'
        },
        on: {
          click: () => {
            window.open('https://www.yitaifang.com/')
          }
        }
      }, params.row.nodeAddress)
    }
  },
  {
    title: '手机账号',
    key: 'phone',
    width: 110,
    resizable: true
  },
  {
    title: '已兑换支票',
    key: 'yetExchange',
    width: 100,
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
        }, params.row.cheque.number1),
        h('p', { style: { 'margin-left': '5px', 'margin-right': '5px' } }, '/'),
        h('p', {
          style: {
            color: '#F81515'
          }
        }, params.row.cheque.number2),
        h('p', { style: { 'margin-left': '5px', 'margin-right': '5px' } }, '/'),
        h('p', {
          style: {
            color: '#1E1E1E'
          }
        }, params.row.cheque.number3)
      ])
    }
  },
  {
    title: '连接数',
    key: 'linkNumber',
    width: 100,
    resizable: true
  },
  {
    title: '外链地址',
    key: 'externalLinkAddress',
    width: 120,
    ellipsis: true,
    render: (h, params) => {
      return h('div', {
        on: {
          click: () => {
            _this.copyText()
          }
        }
      }, [
        h('Tooltip', {
          class: 'bzz-linkTile',
          props: {
            content: '点击复制地址'
          }
        }, params.row.externalLinkAddress)
      ])
    }
  },
  {
    title: '钱包地址',
    key: 'walletAddress',
    width: 120,
    ellipsis: true
  },
  {
    title: '创建日期',
    key: 'createDate',
    width: 120,
    resizable: true
  },
  {
    title: '状态',
    key: 'state',
    width: 100
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
            disabled: false,
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            click: () => {
              this.show(params.index)
            }
          }
        }, '提现')
      ])
    }
  }
]
