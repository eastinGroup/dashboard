new Vue({
    el: '#app',
    data() {
        return {
            baseUrl: 'https://api.swarmbee.xyz', // http://beepush.zkyc.vip  //http://192.168.110.159:8080   // http://183.240.60.54:9006 // /bee_list?user=all
            searchValue: '',
            dataList: [], // 数据表格
            num: 0,
            refreshing: false,
            loading: false,
            loadedAdd: false,
            phone: '',
            headData: {
                staySum: 0, // 总待兑换支票
                alreadySum: 0, // 总兑换
                sum: 0, // 总支票合计
                offSum: 0, // 离线人数
                onSum: 0, // 在线人数
                nodeSum: 0 // 总节点数
            }, // 头部数据
            pageInfo: {
                total: 0, // 总条数
                limit: 10, // 每页展示条数
                pages: 1 // 页数
            } // 分页数据
        }
    },
    mounted() {
        this.pageInfo.limit = this.paramData('limit') === null ? 10 : this.paramData('limit')
        this.pageInfo.pages = this.paramData('page') === null ? 1 : this.paramData('page')
        this.searchValue = this.paramData('phone') === null ? '': this.paramData('phone')
        this.getDataList()
    },
    methods: {
        searchKeypress (event) {
            new Promise((resolve, reject) => {
                if (event.keyCode === 13) {
                    if (this.isPhone(this.searchValue) || this.searchValue === '') {
                        this.pageInfo.pages = 1
                        setTimeout(() => {
                            this.$toast.message({
                                position: 'top',
                                message: '查询成功',
                                color: '#4caf50',
                                close: false
                            });
                            this.loadedAdd = false
                            resolve(true)
                        }, 1000)
                    } else {
                        resolve(false)
                        this.$toast.message({
                            position: 'top',
                            message: '请输入正确的手机号',
                            color: 'error',
                            close: false
                        });
                    }
                }
            }).then(res => {
                if (res) {
                    this.dataList = []
                    this.getDataList()

                }
            })
        },
        // 搜索框查询
        searchClick() {
            new Promise((resolve, reject) => {
                if (this.isPhone(this.searchValue) || this.searchValue === '') {
                    this.pageInfo.pages = 1
                    this.dataList = []
                    setTimeout(() => {
                        this.$toast.message({
                            position: 'top',
                            message: '查询成功',
                            color: '#4caf50',
                            close: false
                        });
                        this.loadedAdd = false
                        resolve(true)
                    }, 1000)
                } else {
                    resolve(false)
                    this.$toast.message({
                        position: 'top',
                        message: '请输入正确的手机号',
                        color: 'error',
                        close: false
                    });
                }
            }).then(res => {
                if (res) {
                    this.dataList = []
                    this.getDataList()
                }
            })

        },
        // 下拉加载数据
        load() {
            this.loading = true;
            if (this.dataList.length >= this.pageInfo.total) {
                this.loadedAdd = true
            } else {
                // 添加数据
                this.pageInfo.pages += 1
                this.getDataList()
            }
        },
        // 上拉刷新数据
        refresh() {
            this.refreshing = true;
            this.loadedAdd = false;
            this.$refs.container.scrollTop = 0;
            this.dataList = []
            this.pageInfo.pages = 1
            setTimeout(() => {
                this.refreshing = false;
                // 请求数据
                this.getDataList()
                this.$toast.message({
                    position: 'top',
                    message: '刷新成功',
                    color: '#4caf50',
                    close: false
                });
            }, 1000)
        },
        // 列表数据请求
        getDataList() {
            const data = {
                limit: this.pageInfo.limit,
                page: this.pageInfo.pages,
                phone: this.searchValue,
                rnd5: ''
            }
            // 请求数据   + '?limit=' + this.pageInfo.limit + '&page=' + this.pageInfo.pages + '&phone=' + this.searchValue
            axios({
                method: 'GET',
                url: this.baseUrl + '/getListnew',
                params: data
            }).then(res => {
                const {data, code, msg} = res.data
                // console.log(data,data.data)
                // 分页数据
                this.pageInfo.total = data.totalNode
                // 头部数据
                this.headData.staySum = data.staySum
                this.headData.alreadySum = data.totalGBzz
                this.headData.sum = data.totalCheque
                this.headData.offSum = data.offlines || 0
                this.headData.onSum = data.onlines || 0
                this.headData.nodeSum = data.totalNode
                // 节点列表数据
                for (let item in data.data) {
                    this.dataList.push(data.data[item])
                }
                this.loading = false;
                // 判断当前列表数据和分页总数是否相等
                if (this.dataList.length >= this.pageInfo.total) {
                    this.loadedAdd = true
                }
            }).catch(err => {
                this.loading = false
                console.log(err)
                this.$toast.message({
                    position: 'top',
                    message: '获取数据失败',
                    color: 'error',
                    close: false
                });
            })
        },
        // 返回顶部
        backTop () {
            window.scrollTo(0, 0)
        },
        // 点击加载更多
        clickLoadMore() {
            this.pageInfo.pages += 1
            this.getDataList()
        },
        // 获取url地址栏参数方法
        paramData (name) {
            const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            const r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        // 手机号验证
        isPhone (data) {
            const mobile = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
            return  mobile.test(data)
        },
        /**
         * 过滤节点地址
         * */
        f_nodeAddr(data) {
           return data.slice(1,-1)
        },
        // 状态颜色转换
        f_Color(data) {
            if (data < 1) {
                return '#FF4646'
            } else {
                return '#12D526'
            }
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
            if (data !== '') {
                return data.replace(/^(.{3}).+(.{4})$/, '$1****$2');
            }
            return ''
        },
    }
})
