var vm = new Vue({
    el: '#vm',
    data: {
        gradeList: [],
        selectedGrade: null,
        selectedChapter: null,
        isDropdownListShow: false,
        isEdit: true,
        showChangeBtn: true,
        selPoints: [],
        testsHtml: [],
        isNumInputTipShow: false,
        numInputTipsContent: '',
        TIPS: {
            FMT_ERR: '只能输入整数！',
            InputTooBig_ERR: '已添加知识点下全部题目',
            InputTooSmall_ERR: '数量过小！',
            Network_ERR: '网络异常！'
        },        
        saveBtnTitle:''
    },
    computed: {
        tipShow: function () {
            return this.selPoints.length <= 0;
        },
        pointsCount: function () {
            return this.selPoints.length;
        },
        testsCount: function () {
            var cnt = 0;
            this.selPoints.map(function (p) { cnt += p.count });
            return cnt;
        }
    },
    methods: {
        hidePreviewBtn: function (isToShow) {
            if(!isToShow)
                document.querySelectorAll('.funcBtns ul li')[1].style.display = 'none';
            else 
                document.querySelectorAll('.funcBtns ul li')[1].style.display = 'inline';
        },
        changeSaveBtnTitle: function (newTitle) {
            (document.querySelectorAll('.funcBtns ul li a')[2]).innerHTML = newTitle;
        },
        callTooltips: function (point, content) {
            point.numInputTipsContent = content;
            point.isNumInputTipShow = true;
            var idx = this.findPointByValue(point), _this = this;
            setTimeout('tooltipsTimeout(' + idx + ')', 2000);
        },
        findPointByValue: function (p) {
            var idx = -1;
            for (var i = 0; i < this.selPoints.length; ++i) {
                if (this.selPoints[i].ruleId == p.ruleId) {
                    idx = i;
                    break;
                }
            }
            return idx;
        },
        //年级下拉列表
        dropdownClick: function () {
            this.isDropdownListShow = !this.isDropdownListShow;
        },
        dropdownItemClick: function (gradeItem) {
            this.isDropdownListShow = false;
            this.selectedGrade = gradeItem;
            this.selectedChapter = this.selectedGrade.chapterList[0];
            this.selectedChapter.isActive = true;
        },
        //左侧导航
        chapterTitleClick: function (chap) {
            this.selectedChapter.isActive = false;
            this.selectedChapter = chap;
            this.selectedChapter.isActive = true;
        },
        chapterCheckClick: function (chapter) {
            chapter.selected = !chapter.selected;
            var _this = this;
            chapter.pointList.map(function (point) {
                point.selected = chapter.selected;
                if (point.selected) { point.count = 5; }
                _this.pointSel(point);
            });
            if (chapter.selected) {
                chapter.selectedPointsCount = chapter.pointList.length;
            }
            else {
                chapter.selectedPointsCount = 0;
            }
        },
        pointCheckClick: function (chapter, point, testCnt) {
            point.selected = !point.selected;
            if (point.selected) {
                if ((++chapter.selectedPointsCount) === chapter.pointList.length) chapter.selected = true;
                if (testCnt && testCnt > 0) point.count = testCnt;
                else point.count = 5;
            } else {
                if ((--chapter.selectedPointsCount) === 0) chapter.selected = false;
            }
            this.pointSel(point);
        },
        pointSel: function (point) {
            if (point.selected) {
                var isIn = false;
                for (var i = 0; i < this.selPoints.length; ++i) {
                    if (this.selPoints[i].ruleId == point.ruleId) {
                        isIn = true;
                        break;
                    }
                }
                if (!isIn) this.selPoints.push(point);
            }
            else {
                var idx = -1;
                this.selPoints.map(function (p, i) { if (point.ruleId == p.ruleId) idx = i });
                if (idx >= 0) this.selPoints.splice(idx, 1);
            }
        },
        increase: function (p) {
            var tmp = p.count + 1;
            if (tmp > p.maxNum) {
                tmp = p.maxNum;
                this.callTooltips(p, this.TIPS.InputTooBig_ERR)
            }
            p.count = tmp;
        },
        decrease: function (p) {
            var tmp = p.count - 1;
            if (tmp <= 0) tmp = 0;
            if (tmp == 0) {
                this.pointCheckClick(p.chapter, p);
            }
            p.count = tmp;
        },
        numberInputChanged: function (p, evt) {
            var i = parseInt(evt.target.value), old = p.count;
            p.count = -1;
            if (isNaN(i)) {
                p.count = old;
                this.callTooltips(p, this.TIPS.FMT_ERR);
            } else if (i > p.maxNum) {
                p.count = p.maxNum;
                this.callTooltips(p, this.TIPS.InputTooBig_ERR);
            } else if (i < 0) {
                p.count = old;
                this.callTooltips(p, this.TIPS.InputTooSmall_ERR);
            } else if (i == 0) {
                this.pointCheckClick(p.chapter, p);
            } else {
                p.count = i;
            }
        },
        testNum: function (expr) {
            return new RegExp("^\\d+$").test(expr);
        },
        testOperator: function (expr) {
            var operators = ['+', '-', '*', 'x', '×', '÷', '/', '(', ')', '='];
            return operators.indexOf(expr) >= 0;
        },
        testBlank: function (expr) {
            return "?" == expr;
        },
        getTestsInHtml: function (point) {
            var testsObj, ret = '';
            testsObj = RULES['rule_' + point.ruleId.replace(/-/g, '_')](point.count);
            point.tests = testsObj.tests;
            point.tests.map(function (expr, ix) {
                var cont = '<li><em>(' + (ix + 1) + ')</em>';
                for (var i = 0; i < expr.length - 1; ++i) {
                    if (i == expr.length - 2) cont += "<i>=</i>";
                    var item = expr[i];
                    if (this.vm.testNum(item)) {
                        cont += "<span>" + item + "</span>";
                    } else if (this.vm.testOperator(item)) {
                        cont += "<i>" + item + "</i>";
                    } else if (this.vm.testBlank(item)) {
                        cont += '<input class="inp" type="text" />';
                    }
                }
                cont += '</li>';
                ret += cont;
            });
            return ret;
        },
        updateTests: function (point, idx) {
            this.testsHtml.splice(idx, 1, this.getTestsInHtml(point));
        },
        next: function () {
            if (this.tipShow) return;

            if (this.saveBtnTitle && this.saveBtnTitle != '') {
                this.hidePreviewBtn();
                this.changeSaveBtnTitle(this.saveBtnTitle);
            }

            this.isEdit = false;
            var _this = this;
            this.selPoints.map(function (pt) {
                _this.testsHtml.push(_this.getTestsInHtml(pt));
            });
        },
        returnEdit: function () {
            this.isEdit = true;
            this.testsHtml.splice(0, this.testsHtml.length);
        },
        save: function () {
            var obj = { "questionType": "mentalExercise" };
            var pts = [];
            this.selPoints.map(function (pt) { delete pt.chapter; pts.push(pt); })
            obj.points = pts;
            bounds.ViewModel.ProceedOnSave(JSON.stringify(obj));
        },
        preview: function () {
            var obj = { "questionType": "mentalExercise" };
            var pts = [];
            this.selPoints.map(function (pt) { delete pt.chapter; pts.push(pt); })
            obj.points = pts;
            bounds.ViewModel.ProceedOnPreview(JSON.stringify(obj));
        },
        deployWork: function () {
            //布置作业
        },
        checkIsEdited: function () {
            var chns = '';
            if (!this.isEdit) {
                var obj = { "questionType": "mentalExercise" };
                var pts = [];
                this.selPoints.map(function (pt) { delete pt.chapter; pts.push(pt); })
                obj.points = pts;
                chns = JSON.stringify(obj);
            }
            bounds.ViewModel.CheckIsEdited(chns);
        }
    },
    created: function () {
        var _this = this;
        document.onclick = function (ev) {
            _this.isDropdownListShow = false;
        };
        axios.get('data/info.json').then(function (res) {
            res.data.data.map(function (grade) {
                grade.chapterList.map(function (chap) {
                    chap.isActive = false;
                    chap.selectedPointsCount = 0;
                    chap.selected = false;
                    chap.pointList.map(function (point) {
                        point.selected = false;
                        point.count = point.maxNum >= 5 ? 5 : point.maxNum;
                        point.chapter = chap;
                        point.isNumInputTipShow = false;
                        point.numInputTipsContent = '';
                    });
                });
                _this.gradeList.push(grade);
            });
            axios.get('data/main.json').then(function (res2) {
                var edtPoints = res2.data.points;
                for (var i = _this.gradeList.length - 1; i >= 0; --i) {
                    var grade = _this.gradeList[i];
                    for (var j = grade.chapterList.length - 1; j >= 0; --j) {
                        var chap = grade.chapterList[j];
                        for (var k = chap.pointList.length - 1; k >= 0; k--) {
                            var pnt = chap.pointList[k];
                            edtPoints.map(function (edtPnt) {
                                if (pnt.ruleId == edtPnt.ruleId) {
                                    pnt.count = edtPnt.count;
                                    _this.pointCheckClick(chap, pnt, pnt.count);
                                    _this.selectedGrade = grade;
                                    _this.selectedChapter = chap;
                                }
                            });
                        }
                    }
                }
                if (!_this.selectedGrade) _this.selectedGrade = _this.gradeList[0];
                if (!_this.selectedChapter) _this.selectedChapter = _this.selectedGrade.chapterList[0];
                _this.selectedChapter.isActive = true;
            }).catch(function (err1) {
                if (!_this.selectedGrade) _this.selectedGrade = _this.gradeList[0];
                if (!_this.selectedChapter) _this.selectedChapter = _this.selectedGrade.chapterList[0];
                _this.selectedChapter.isActive = true;
                //console.log(err1);
            });
        }).catch(function (err2) {
            //console.log(err2);
        });
    }
});

function tooltipsTimeout(idx) {
    window.vm.selPoints[idx].isNumInputTipShow = false;
}