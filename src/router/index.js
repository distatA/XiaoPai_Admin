import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/login",
        name: "login",
        component: () => import("../views/pages/login/login.vue")
    },
    {
        path: "/charts",
        name: "charts",
        component: () => import("../views/charts/charts.vue")
    },
    {
        path: "/index",
        name: "index",
        component: () => import("../views/index.vue"),
        children: [
            {
                path: "/index/index",
                name: "index-index",
                component: () => import("../views/pages/index/index.vue")
            },
            // 设置中心
            // 权限管理模块
            {
                path: "/role/role",
                name: "role-role",
                component: () => import("../views/pages/setting/role/role.vue")
            },
            {
                path: "/role/modifyRole",
                name: "role-modifyRole",
                component: () => import("../views/pages/setting/role/modifyRole.vue")
            },
            //系统设置
            {
                path: "/setting/setting",
                name: "setting-setting",
                component: () => import("../views/pages/setting/setting.vue")
            },
            //活动设置
            {
                path: "/setting/activity",
                name: "setting-activity",
                component: () => import("../views/pages/setting/activity/activity.vue")
            },
            //中奖用户设置
            {
                path: "/setting/win",
                name: "setting-win",
                component: () => import("../views/pages/setting/activity/win.vue")
            },
            //中奖抽奖记录
            {
                path: "/setting/activityRecord",
                name: "setting-activityRecord",
                component: () => import("../views/pages/setting/activity/record.vue")
            },
            //敏感词设置
            {
                path: "/sensitive/words",
                name: "sensitive-words",
                component: () => import("../views/pages/setting/sensitiveWord.vue")
            },
            //系统红包设置
            {
                path: "/setting/participator",
                name: "setting-participator",
                component: () => import("../views/pages/setting/participator.vue")
            },
            //系统红包领取用户
            {
                path: "/setting/redBag",
                name: "setting-redBag",
                component: () => import("../views/pages/setting/redBag.vue")
            },
            //积分设置
            {
                path: "/pointsRule/pointsRule",
                name: "pointsRule-pointsRule",
                component: () => import("../views/pages/setting/pointsRule.vue")
            },
            //积分设置
            {
                path: "/pointsExchange/pointsExchange",
                name: "pointsExchange-pointsExchange",
                component: () => import("../views/pages/setting/pointsExchange.vue")
            },
            //小程序首页菜单设置
            {
                path: "/program/menu",
                name: "program-menu",
                component: () => import("../views/pages/setting/menu.vue")
            },
            //菜单管理
            {
                path: "/menu/menu",
                name: "menu-menu",
                component: () => import("../views/pages/setting/menu/menu.vue")
            },
            // 地推
            {
                path: '/ditui/ditui',
                name: 'ditui',
                component: () => import("../views/ditui/ditui.vue")
            },
            // 排行管理
            {
                path: '/rank/rank',
                name: 'rank',
                component: () => import("../views/rank/rank.vue")
            },
            {
                path: '/category/category',
                name: 'category',
                component: () => import("../views/category/category.vue")
            },
            //系统用户管理
            {
                path: "/admin/admin",
                name: "admin-admin",
                component: () => import("../views/pages/setting/admin/admin.vue")
            },
            //地区管理
            {
                path: "/area/area",
                name: "area-area",
                component: () => import("../views/pages/setting/area/area.vue")
            },
            //文章（移动端）管理
            {
                path: "/article/article",
                name: "article-article",
                component: () => import("../views/pages/article/article.vue")
            },
            //文章标签
            {
                path: "/articleTags/articleTags",
                name: "articleTags-articleTags",
                component: () => import("../views/pages/article/articleTags.vue")
            },
            //文章（pc端）管理
            {
                path: "/articlePc/articlePc",
                name: "articlePc-articlePc",
                component: () => import("../views/pages/article/articlePc.vue")
            },
            {
                path: "/articleComment/articleComment",
                name: "articleComment-articleComment",
                component: () => import("../views/pages/article/articleComment.vue")
            },
            //添加/编辑文章
            {
                path: "/modifyArticle/modifyArticle",
                name: "modifyArticle-modifyArticle",
                component: () => import("../views/pages/article/modifyArticle.vue")
            },
            {
                path: "/editArticle/editArticle",
                name: "editArticle-editArticle",
                component: () => import("../views/pages/article/editArticle.vue")
            },
            //文章分类
            {
                path: "/articleCategory/articleCategory",
                name: "articleCategory-articleCategory",
                component: () => import("../views/pages/article/articleCategory.vue")
            },
            //新闻早班车管理
            {
                path: "/newsBus/newsBus",
                name: "newsBus-newsBus",
                component: () => import("../views/pages/newsBus/newsBus.vue")
            },
            {
                path: "/addNewsBus/addNewsBus",
                name: "addNewsBus-addNewsBus",
                component: () => import("../views/pages/newsBus/addNewsBus.vue")
            },
            {
                path: "/editNewsBus/editNewsBus",
                name: "editNewsBus-editNewsBus",
                component: () => import("../views/pages/newsBus/editNewsBus.vue")
            },
            //用户管理
            {
                path: "/user/user",
                name: "user-user",
                component: () => import("../views/pages/user/user.vue")
            },
            //学校管理
            {
                path: "/school/school",
                name: "school-school",
                component: () => import("../views/pages/school/school.vue")
            },
            //学校院校类型管理
            {
                path: "/schoolCategory/schoolCategory",
                name: "schoolCategory-schoolCategory",
                component: () => import("../views/pages/school/schoolCategory.vue")
            },
            //添加学校管理
            {
                path: "/addSchool/addSchool",
                name: "addSchool-addSchool",
                component: () => import("../views/pages/school/addSchool.vue")
            },
            //编辑学校
            {
                path: "/editSchool/editSchool",
                name: "editSchool-editSchool",
                component: () => import("../views/pages/school/editSchool.vue")
            },
            //群聊管理
            {
                path: "/school/group",
                name: "school-group",
                component: () => import("../views/pages/school/group/group.vue")
            },
            //群聊管理用户列表
            {
                path: "/school/user",
                name: "school-user",
                component: () => import("../views/pages/school/group/user.vue")
            },
            //群聊管理聊天记录
            {
                path: "/school/userNotes",
                name: "school-userNotes",
                component: () => import("../views/pages/school/group/userNotes.vue")
            },
            //群聊修改
            {
                path: "/school/modifyGroup",
                name: "school-modifyGroup",
                component: () => import("../views/pages/school/group/modifyGroup.vue")
            },
            //学校特色专业管理
            {
                path: "/specialMajor/specialMajor",
                name: "specialMajor-specialMajor",
                component: () => import("../views/pages/school/major/specialMajor.vue")
            },
            //学校开设专业管理
            {
                path: "/createMajor/createMajor",
                name: "createMajor-createMajor",
                component: () => import("../views/pages/school/major/createMajor.vue")
            },
            //学校知名校友管理
            {
                path: "/classmate/classmate",
                name: "classmate-classmate",
                component: () => import("../views/pages/school/classmate/classmate.vue")
            },
            //修改学校知名校友管理
            {
                path: "/modifyClassmate/modifyClassmate",
                name: "modifyClassmate-modifyClassmate",
                component: () =>
                    import("../views/pages/school/classmate/modifyClassmate.vue")
            },
            //学校招生简章管理
            {
                path: "/studentSection/studentSection",
                name: "studentSection-studentSection",
                component: () =>
                    import("../views/pages/school/studentSection/studentSection.vue")
            },
            //修改学校招生简章管理
            {
                path: "/modifyStudentSection/modifyStudentSection",
                name: "modifyStudentSection-modifyStudentSection",
                component: () =>
                    import(
                        "../views/pages/school/studentSection/modifyStudentSection.vue"
                    )
            },
            //专家管理
            {
                path: "/expert/expert",
                name: "expert-expert",
                component: () => import("../views/pages/expert/expert.vue")
            },
            //修改专家
            {
                path: "/modifyExpert/modifyExpert",
                name: "modifyExpert-modifyExpert",
                component: () => import("../views/pages/expert/modifyExpert.vue")
            },
            //专家分类管理
            {
                path: "/expertCategory/expertCategory",
                name: "expertCategory-expertCategory",
                component: () => import("../views/pages/expert/expertCategory.vue")
            },
            //专业库管理
            {
                path: "/careerMajor/careerMajor",
                name: "careerMajor-careerMajor",
                component: () =>
                    import("../views/pages/career/careerMajor/careerMajor.vue")
            },
            //修改专业库
            {
                path: "/modifyCareerMajor/modifyCareerMajor",
                name: "modifyCareerMajor-modifyCareerMajor",
                component: () =>
                    import("../views/pages/career/careerMajor/modifyCareerMajor.vue")
            },
            //职业库管理
            {
                path: "/careerJob/careerJob",
                name: "careerJob-careerJob",
                component: () => import("../views/pages/career/careerJob/careerJob.vue")
            },
            //修改职业库
            {
                path: "/modifyCareerJob/modifyCareerJob",
                name: "modifyCareerJob-modifyCareerJob",
                component: () =>
                    import("../views/pages/career/careerJob/modifyCareerJob.vue")
            },
            //心理测试题管理
            {
                path: "/testQuestion/testQuestion",
                name: "testQuestion-testQuestion",
                component: () =>
                    import("../views/pages/test/testQuestion/testQuestion.vue")
            },
            //心理测试题结果管理
            {
                path: "/testQuestionResult/testQuestionResult",
                name: "testQuestionResult-testQuestionResult",
                component: () =>
                    import("../views/pages/test/testQuestion/testQuestionResult.vue")
            },
            //心理测试题结果相关专业
            {
                path: "/testMajor/testMajor",
                name: "testMajor-testMajor",
                component: () =>
                    import("../views/pages/test/testQuestion/testMajor.vue")
            },
            //测试题封面管理
            {
                path: "/testCover/testCover",
                name: "testCover-testCover",
                component: () =>
                    import("../views/pages/test/testQuestion/testCover.vue")
            },
            //本专科优选列表管理
            {
                path: "/optimal/index",
                name: "optimal-index",
                component: () => import("../views/pages/optimal/school/index.vue")
            },
            //修改本专科优选学校
            {
                path: "/optimal/modify/school",
                name: "optimal-modify-school",
                component: () =>
                    import("../views/pages/optimal/school/modifySchool.vue")
            },
            //本专科优选咨询
            {
                path: "/optimal/news",
                name: "optimal-news",
                component: () => import("../views/pages/optimal/news/news.vue")
            },
            //修改本专科优选咨询
            {
                path: "/optimal/modify/news",
                name: "optimal-modify-news",
                component: () => import("../views/pages/optimal/news/modifyNews.vue")
            },
            //本专科优咨询评论
            {
                path: "/optimal/comments",
                name: "optimal-comments",
                component: () => import("../views/pages/optimal/comments/comments.vue")
            },
            //本专科优栏目管理
            {
                path: "/optimal/section",
                name: "optimal-section",
                component: () => import("../views/pages/optimal/section/section.vue")
            },
            //本专科优文章管理
            {
                path: "/optimal/article",
                name: "optimal-article",
                component: () => import("../views/pages/optimal/article/article.vue")
            },
            //本专科优修改文章
            {
                path: "/optimal/modifyArticle",
                name: "optimal-modifyArticle",
                component: () =>
                    import("../views/pages/optimal/article/modifyArticle.vue")
            },
            //本专科优视频管理
            {
                path: "/optimal/video",
                name: "optimal-video",
                component: () => import("../views/pages/optimal/video/video.vue")
            },
            //本专科优修改视频
            {
                path: "/optimal/modifyVideo",
                name: "optimal-modifyVideo",
                component: () => import("../views/pages/optimal/video/modifyVideo.vue")
            },
            //本专科优学院管理
            {
                path: "/optimal/college",
                name: "optimal-college",
                component: () => import("../views/pages/optimal/college/college.vue")
            },
            //本专科优学院管理
            {
                path: "/optimal/modifyCollege",
                name: "optimal-modifyCollege",
                component: () =>
                    import("../views/pages/optimal/college/modifyCollege.vue")
            },
            //本专科优系部管理
            {
                path: "/optimal/department",
                name: "optimal-department",
                component: () =>
                    import("../views/pages/optimal/department/department.vue")
            },
            //本专科优系部修改
            {
                path: "/optimal/modifyDepartment",
                name: "optimal-modifyDepartment",
                component: () =>
                    import("../views/pages/optimal/department/modifyDepartment.vue")
            },
            //本专科优专业管理
            {
                path: "/optimal/major",
                name: "optimal-major",
                component: () => import("../views/pages/optimal/major/major.vue")
            },
            //本专科优专业修改
            {
                path: "/optimal/modifyMajor",
                name: "optimal-modifyMajor",
                component: () => import("../views/pages/optimal/major/modifyMajor.vue")
            },
            //统计管理
            {
                path: "/count/count",
                name: "count-count",
                component: () => import("../views/pages/count/count.vue")
            },
            //高职社招学校列表
            {
                path: "/vocational/index",
                name: "vocational-index",
                component: () => import("../views/pages/vocational/school/index.vue")
            },
            // 新版高职社招相关专业
            {
                path: "/vocational/specialty",
                name: "vocational-specialty",
                component: () => import("../views/pages/vocational/gaozhi/specialty.vue")
            },
            //添加修改学校
            {
                path: "/vocational/modifySchool",
                name: "vocational-modifySchool",
                component: () =>
                    import("../views/pages/vocational/school/modifySchool.vue")
            },
            //添加修改学校相关专业
            {
                path: "/vocational/schoolMajor",
                name: "vocational-schoolMajor",
                component: () =>
                    import("../views/pages/vocational/school/schoolMajor.vue")
            },
            //高职社招热门专业列表
            {
                path: "/vocational/major",
                name: "vocational-major",
                component: () => import("../views/pages/vocational/major/major.vue")
            },
            // 高职社招报考资讯
            {
                path: "/vocational/information",
                name: 'vocational-information',
                component: () => import("../views/pages/vocational/information/information.vue")
            },
            // 高职社招资讯添加/编辑
            {
                path: "/vocational/addinformation",
                name: 'vocational-addinformation',
                component: () => import("../views/pages/vocational/information/addinfo.vue")
            },
            // 高职社招相关信息
            {
                path: "/vocational/message",
                name: 'vocational-message',
                component: () => import("../views/pages/vocational/message/message.vue")
            },
            //高职社招报名信息列表
            {
                path: "/vocational/info",
                name: "vocational-info",
                component: () => import("../views/pages/vocational/info/info.vue")
            },
            //高职社招政策课堂列表
            {
                path: "/vocational/class",
                name: "vocational-class",
                component: () => import("../views/pages/vocational/class/class.vue")
            },
            //高职社招政策课堂修改
            {
                path: "/vocational/modifyClass",
                name: "vocational-modifyClass",
                component: () =>
                    import("../views/pages/vocational/class/modifyClass.vue")
            },
            //名师课堂课程管理
            {
                path: "/class/class",
                name: "class-class",
                component: () => import("../views/pages/class/class/class.vue")
            },
            //名师课堂课程管理修改
            {
                path: "/class/modifyClass",
                name: "class-modifyClass",
                component: () => import("../views/pages/class/class/modifyClass.vue")
            },
            //名师讲堂章节管理
            {
                path: "/class/chapter",
                name: "class-chapter",
                component: () => import("../views/pages/class/chapter/chapter.vue")
            },
            //名师讲堂章节管理修改
            {
                path: "/class/modifyChapter",
                name: "class-modifyChapter",
                component: () =>
                    import("../views/pages/class/chapter/modifyChapter.vue")
            },
            //名师讲堂用户管理
            {
                path: "/class/user",
                name: "class-user",
                component: () => import("../views/pages/class/user/user.vue")
            },
            //分类招生测试题基础设置
            {
                path: "/exam/setting",
                name: "exam-setting",
                component: () => import("../views/pages/classifie/exam/setting.vue")
            },
            //分类招生测试题编辑基础设置
            {
                path: "/exam/modifySetting",
                name: "exam-modifySetting",
                component: () => import("../views/pages/classifie/exam/modifySet.vue")
            },
            //分类招生测试题分类设置
            {
                path: "/exam/cates",
                name: "exam-cates",
                component: () => import("../views/pages/classifie/exam/cates.vue")
            },
            //分类招生测试题编辑分类设置
            {
                path: "/exam/modifyCates",
                name: "exam-modifyCates",
                component: () => import("../views/pages/classifie/exam/modifyCates.vue")
            },
            //分类招生测试题试题设置
            {
                path: "/exam/exam",
                name: "exam-exam",
                component: () => import("../views/pages/classifie/exam/exam.vue")
            },
            //分类招生测试修改题试题设置
            {
                path: "/exam/modifyExam",
                name: "exam-modifyExam",
                component: () => import("../views/pages/classifie/exam/modifyExam.vue")
            },
            //分类招生学校
            {
                path: "/classifie/school",
                name: "classifie-school",
                component: () => import("../views/pages/classifie/school/school.vue")
            },

            //分类招生修改学校
            {
                path: "/classifie/modifySchool",
                name: "classifie-modifySchool",
                component: () =>
                    import("../views/pages/classifie/school/modifySchool.vue")
            },
            //分类招生配置
            {
                path: "/classifie/option",
                name: "classifie-option",
                component: () => import("../views/pages/classifie/option/option.vue")
            },
            //报考政策
            {
                path: "/classifie/policy",
                name: "classifie-policy",
                component: () => import("../views/pages/classifie/policy/policy.vue")
            },
            //添加政策
            {
                path: "/classifie/modifyPolicy",
                name: "classifie-modifyPolicy",
                component: () =>
                    import("../views/pages/classifie/policy/modifyPolicy.vue")
            },
            //报考政策分类
            {
                path: "/classifie/policy/cates",
                name: "classifie-policy-cates",
                component: () => import("../views/pages/classifie/policy/cates.vue")
            },
            //报考政策真题列表
            {
                path: "/classifie/question/cates",
                name: "classifie-question-cates",
                component: () => import("../views/pages/classifie/question/cates.vue")
            },
            //报考政策真题列表
            {
                path: "/classifie/question",
                name: "classifie-question",
                component: () =>
                    import("../views/pages/classifie/question/question.vue")
            },
            //报考政策修改真题
            {
                path: "/classifie/modifyQuestion",
                name: "classifie-modifyQuestion",
                component: () =>
                    import("../views/pages/classifie/question/modifyQuestion.vue")
            },
            //报考政策学校真题
            {
                path: "/classifie/schoolQuestion",
                name: "classifie-schoolQuestion",
                component: () =>
                    import("../views/pages/classifie/schoolQuestion/schoolQuestion.vue")
            },
            //修改报考政策学校真题
            {
                path: "/classifie/modifySchoolQuestion",
                name: "classifie-modifySchoolQuestion",
                component: () =>
                    import(
                        "../views/pages/classifie/schoolQuestion/modifySchoolQuestion.vue"
                    )
            },
            //分类招生专业
            {
                path: "/classifie/major",
                name: "classifie-major",
                component: () => import("../views/pages/classifie/major/major.vue")
            },
            //分类招生学校专业
            {
                path: "/classifie/schoolMajor",
                name: "classifie-schoolMajor",
                component: () =>
                    import("../views/pages/classifie/schoolMajor/schoolMajor.vue")
            },
            //分类招生学校招生简章
            {
                path: "/classifie/section",
                name: "classifie-section",
                component: () => import("../views/pages/classifie/section/section.vue")
            },
            //修改分类招生学校招生简章
            {
                path: "/classifie/modifySection",
                name: "classifie-modifySection",
                component: () =>
                    import("../views/pages/classifie/section/modifySection.vue")
            },
            //分类招生学校分数
            {
                path: "/classifie/score",
                name: "classifie-score",
                component: () => import("../views/pages/classifie/score/score.vue")
            },
            //分类招生学校特定分数
            {
                path: "/classifie/specialScore",
                name: "classifie-specialScore",
                component: () =>
                    import("../views/pages/classifie/score/specialScore.vue")
            },
            //分类招生搜索配置
            {
                path: "/classifie/search",
                name: "classifie-search",
                component: () => import("../views/pages/classifie/search/search.vue")
            },
            //留学中心学校列表
            {
                path: "/international/index",
                name: "international-index",
                component: () => import("../views/pages/international/index.vue")
            },
            //留学中心修改学校
            {
                path: "/international/modifySchool",
                name: "international-modifySchool",
                component: () => import("../views/pages/international/modifySchool.vue")
            },
            //留学中心分类
            {
                path: "/international/cate",
                name: "international-cate",
                component: () => import("../views/pages/international/cate.vue")
            },
            //留学中心报名申请
            {
                path: "/international/apply",
                name: "international-apply",
                component: () => import("../views/pages/international/apply.vue")
            },
            //留学中心院校简介
            {
                path: "/international/introduce",
                name: "international-introduce",
                component: () =>
                    import("../views/pages/international/introduce/introduce.vue")
            },
            //留学中心院校简介修改
            {
                path: "/international/modifyIntroduce",
                name: "international-modifyIntroduce",
                component: () =>
                    import("../views/pages/international/introduce/modifyIntroduce.vue")
            },
            //留学中心教学环境简介
            {
                path: "/international/env",
                name: "international-env",
                component: () => import("../views/pages/international/env/env.vue")
            },
            //留学中心教学环境修改
            {
                path: "/international/modifyEnv",
                name: "international-modifyEnv",
                component: () =>
                    import("../views/pages/international/env/modifyEnv.vue")
            },
            //留学中心开设专业
            {
                path: "/international/major",
                name: "international-major",
                component: () => import("../views/pages/international/major/major.vue")
            },
            //留学中心开设专业修改
            {
                path: "/international/modifyMajor",
                name: "international-modifyMajor",
                component: () =>
                    import("../views/pages/international/major/modifyMajor.vue")
            },
            //留学中心地理位置
            {
                path: "/international/place",
                name: "international-place",
                component: () => import("../views/pages/international/place/place.vue")
            },
            //留学中心地理位置修改
            {
                path: "/international/modifyPlace",
                name: "international-modifyPlace",
                component: () =>
                    import("../views/pages/international/place/modifyPlace.vue")
            },
            //留学中心院校特点
            {
                path: "/international/feature",
                name: "international-feature",
                component: () =>
                    import("../views/pages/international/feature/feature.vue")
            },
            //留学中心院校特点修改
            {
                path: "/international/modifyFeature",
                name: "international-modifyFeature",
                component: () =>
                    import("../views/pages/international/feature/modifyFeature.vue")
            },
            //留学中心教学特色
            {
                path: "/international/teach",
                name: "international-teach",
                component: () => import("../views/pages/international/teach/teach.vue")
            },
            //留学中心教学特色修改
            {
                path: "/international/modifyTeach",
                name: "international-modifyTeach",
                component: () =>
                    import("../views/pages/international/teach/modifyTeach.vue")
            },
            //留学中心留学通道
            {
                path: "/international/direction",
                name: "international-direction",
                component: () =>
                    import("../views/pages/international/direction/direction.vue")
            },
            //留学中心留学通道修改
            {
                path: "/international/modifyDirection",
                name: "international-modifyDirection",
                component: () =>
                    import("../views/pages/international/direction/modifyDirection.vue")
            },
            //留学中心视频
            {
                path: "/international/video",
                name: "international-video",
                component: () => import("../views/pages/international/video/video.vue")
            },
            //留学中心视频修改
            {
                path: "/international/modifyVideo",
                name: "international-modifyVideo",
                component: () =>
                    import("../views/pages/international/video/modifyVideo.vue")
            },
            //积分商城
            {
                path: "/shop/shop",
                name: "shop-shop",
                component: () => import("../views/pages/shop/shop.vue")
            },
            //积分商城商品修改
            {
                path: "/shop/modifyShop",
                name: "shop-modifyShop",
                component: () => import("../views/pages/shop/modifyShop.vue")
            },
            //积分商城订单
            {
                path: "/shop/order",
                name: "shop-order",
                component: () => import("../views/pages/shop/order.vue")
            },
            //积分商城积分列表
            {
                path: "/shop/integral",
                name: "shop-integral",
                component: () => import("../views/pages/shop/integral.vue")
            },
            //直播间管理
            {
                path: "/live/live",
                name: "live-live",
                component: () => import("../views/pages/live/live.vue")
            },
            //直播间管理-修改
            {
                path: "/live/modifyLive",
                name: "live-modifyLive",
                component: () => import("../views/pages/live/modifyLive.vue")
            },
            //直播间红包记录
            {
                path: "/live/redBag",
                name: "live-redBag",
                component: () => import("../views/pages/live/redBag.vue")
            }, //直播间栏目设置
            {
                path: "/live/column",
                name: "live-column",
                component: () => import("../views/pages/live/column/column.vue")
            }, //直播间栏目--学校专业
            {
                path: "/live/activity",
                name: "live-activity",
                component: () => import("../views/pages/live/activity/activity.vue")
            }, //直播间栏目--学校专业
            {
                path: "/live/schoolMajor",
                name: "live-schoolMajor",
                component: () => import("../views/pages/live/column/schoolMajor.vue")
            },
            //直播间栏目--学校分数
            {
                path: "/live/schoolScore",
                name: "live-schoolScore",
                component: () => import("../views/pages/live/column/schoolScore.vue")
            },
            //直播间栏目--问题
            {
                path: "/live/question",
                name: "live-question",
                component: () => import("../views/pages/live/column/question.vue")
            },
            //直播间栏目--学校分数附表
            {
                path: "/live/scoreList",
                name: "live-scoreList",
                component: () => import("../views/pages/live/column/scoreList.vue")
            },
            //直播间栏目--秋招栏目--学校专业
            {
                path: "/live/schoolCollege",
                name: "live-schoolCollege",
                component: () => import("../views/pages/live/college/schoolCollege.vue")
            },
            //直播间栏目--秋招栏目--学校专业分数
            {
                path: "/live/schoolCollegeScore",
                name: "live-schoolCollegeScore",
                component: () =>
                    import("../views/pages/live/college/schoolCollegeScore.vue")
            },
            //直播间栏目--秋招栏目--学校院系
            {
                path: "/live/schoolDepart",
                name: "live-schoolDepart",
                component: () => import("../views/pages/live/college/schoolDepart.vue")
            },
            //直播间栏目--用户列表
            {
                path: "/live/user",
                name: "live-user",
                component: () => import("../views/pages/live/liveUser.vue")
            },
            // 直播间栏目--灌水
            {
                path: "/live/irrigation",
                name: "live-irrigation",
                component: () => import("../views/pages/live/irrigation.vue")
            },
            // 直播间栏目--精彩视频
            {
                path: "/live/video",
                name: "live-video",
                component: () => import("../views/pages/live/video.vue")
            },
            //新高考省份
            {
                path: "/newExam/newExam",
                name: "newExam-newExam",
                component: () => import("../views/pages/newExam/newExam/newExam.vue")
            },
            //新高考省份配置
            {
                path: "/newExam/subject",
                name: "newExam-subject",
                component: () => import("../views/pages/newExam/subject/subject.vue")
            },
            //新高考省份算法配置
            {
                path: "/newExam/algorithm",
                name: "newExam-algorithm",
                component: () =>
                    import("../views/pages/newExam/algorithm/algorithm.vue")
            },
            //新高考省份玩法配置
            {
                path: "/newExam/method",
                name: "newExam-method",
                component: () => import("../views/pages/newExam/method/method.vue")
            },
            //新高考省份玩法专业配置
            {
                path: "/newExam/methodMajor",
                name: "newExam-methodMajor",
                component: () => import("../views/pages/newExam/method/methodMajor.vue")
            },
            //新高考学校配置
            {
                path: "/newExam/school",
                name: "newExam-school",
                component: () => import("../views/pages/newExam/school/school.vue")
            },
            //新高考学校相关专业配置
            {
                path: "/newExam/schoolMajor",
                name: "newExam-schoolMajor",
                component: () => import("../views/pages/newExam/major/major.vue")
            },
            //新高考搜索配置
            {
                path: "/newExam/options",
                name: "newExam-options",
                component: () => import("../views/pages/newExam/options/options.vue")
            },
            //强基计划学校列表
            {
                path: "/enrollmentReform/enrollmentReform",
                name: "enrollmentReform-enrollmentReform",
                component: () => import("../views/pages/enrollmentReform/enrollmentReform.vue")
            },
            // 强基计划政策解读policyDetails policyComment
            {
                path: "/enrollmentReform/policy",
                name: "enrollmentReform-policy",
                component: () => import("../views/pages/enrollmentReform/policy.vue")
            },
            {
                path: "/enrollmentReform/policyDetails",
                name: "enrollmentReform-policyDetails",
                component: () => import("../views/pages/enrollmentReform/policyDetails.vue")
            },
            {
                path: "/enrollmentReform/policyComment",
                name: "enrollmentReform-policyComment",
                component: () => import("../views/pages/enrollmentReform/policyComment.vue")
            },
            // 强基计划添加学校
            {
                path: "/enrollmentReform/school",
                name: "enrollmentReform-school",
                component: () => import("../views/pages/enrollmentReform/school.vue")
            },
            // 强基计划招生简章
            {
                path: "/enrollmentReform/admissionsGuide",
                name: "enrollmentReform-admissionsGuide",
                component: () => import("../views/pages/enrollmentReform/admissionsGuide.vue")
            },
            // 强基计划招生简章(添加编辑)
            {
                path: "/enrollmentReform/guideDetails",
                name: "enrollmentReform-guideDetails",
                component: () => import("../views/pages/enrollmentReform/guideDetails.vue")
            },
            // 强基计划招生专业
            {
                path: "/enrollmentReform/major",
                name: "enrollmentReform-major",
                component: () => import("../views/pages/enrollmentReform/major.vue")
            },
            // 强基计划考试报名
            {
                path: "/enrollmentReform/exam",
                name: "enrollmentReform-exam",
                component: () => import("../views/pages/enrollmentReform/exam.vue")
            }
        ]
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
