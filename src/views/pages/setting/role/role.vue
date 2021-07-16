<template>
    <el-main>
        <div class="add">
            <el-button @click="add" type="primary" size="mini">添加</el-button>
        </div>
        <el-table
            border
            :data="roleList"
            borderstripe
            row-key="role_id"
            :tree-props="{children: 'child',hasChildren:'child.length>=0'}"
        >
            <el-table-column prop="role_id" label="ID" align="center"></el-table-column>
            <el-table-column prop="role_name" label="角色姓名" align="center"></el-table-column>
            <el-table-column prop="role_desc" label="角色描述" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="300">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="primary" size="mini">编辑</el-button>
                    <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totals"
                :page-size="offset"
                @current-change="loadList"
            ></el-pagination>
        </div>
    </el-main>
</template>
<script>
/* eslint-disable*/
export default {
    data() {
        return {
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            roleList: []
        };
    },
    created() {
        this.loadList();
    },
    methods: {
        //加载列表
        loadList(pages) {
            this.page = pages;
            this.$post("/admin/role/index", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.roleList = res.list;
                }
            });
        },
        //通往同一页面，传递不同参数
        //添加角色
        add() {
            this.$router.push("/role/modifyRole");
        },
        //编辑角色
        edit(item) {
            this.$router.push({
                name: "role-modifyRole",
                query: { role_id: item.role_id }
            });
        },
        //删除角色
        handleDelete(item) {
            this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/role/delete", {
                        role_id: item.role_id
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            //删除后重新拉取
                            this.loadList();
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        }
    }
};
</script>
<style  scoped>
.add {
    margin-bottom: 20px;
}
.pagination {
    margin: 20px 0 0 -10px;
}
</style>