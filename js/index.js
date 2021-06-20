new Vue({
    el: '#app',
    data() {
        return {
            baseUrl: 'https://api.swarmbee.xyz', // http://beepush.zkyc.vip  //http://192.168.110.159:8080
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
        this.getDataList()
    },
    methods: {
        searchKeypress(event) {
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
        getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    console.log("找参数" + pair[1]);
                    return pair[1];
                }
            }
            console.log("找不到参数");
            return ("");
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
            // 请求数据

            this.searchValue = this.getQueryVariable('phone');

            console.log("phone=" + this.searchValue);
            axios({
                method: 'POST',
                url: this.baseUrl + '/postList' + '?limit=' + this.pageInfo.limit + '&page=' + this.pageInfo.pages + '&phone=' + this.searchValue+'&rnd'+Math.ceil(Math.random()*10),
                data: {
                    limit: this.pageInfo.limit,
                    page: this.pageInfo.pages
                }
            }).then(res => {
                const {
                    page,
                    code,
                    msg
                } = res.data
                const {
                    total,
                    records
                } = page.data
                // 分页数据
                this.pageInfo.total = total
                // 头部数据
                this.headData.staySum = page.staySum
                this.headData.alreadySum = page.alreadySum
                this.headData.sum = page.sum
                this.headData.offSum = page.offSum
                this.headData.onSum = page.onSum
                this.headData.nodeSum = page.nodeSum
                // 节点列表数据
                for (let item in records) {
                    this.dataList.push(records[item])
                }
                this.loading = false;
                // 判断当前列表数据和分页总数是否相等
                if (this.dataList.length >= this.pageInfo.total) {
                    this.loadedAdd = true
                }
            }).catch(err => {
                this.loading = false
                this.$toast.message({
                    position: 'top',
                    message: '获取数据失败',
                    color: 'error',
                    close: false
                });
            })
        },
        // 返回顶部
        backTop() {
            window.scrollTo(0, 0)
        },
        // 点击加载更多
        clickLoadMore() {
            this.pageInfo.pages += 1
            this.getDataList()
        },
        // 手机号验证
        isPhone(data) {
            const mobile = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
            return mobile.test(data)
        },
        /**
         * 过滤节点地址
         * */
        f_nodeAddr(data) {
            return data.slice(1, -1)
        },
        // 状态颜色转换
        f_Color(data) {
            if (data === 0) {
                return '#FF4646'
            } else if (data === 1) {
                return '#12D526'
            }
        }
    },
    filters: {
        // 状态过滤
        f_State(data) {
            if (data === 0) {
                return '离线'
            } else if (data === 1) {
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