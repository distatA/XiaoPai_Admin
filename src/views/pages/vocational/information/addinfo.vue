<template>
  <div style="margin: 20px;">
    <el-form :model="form" label-width="100px">
      <el-form-item label="文章标题：">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="省份：">
        <el-select v-model="form.province_id" placeholder="请选择省份">
          <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间：">
        <el-time-picker v-model="form.create_time" placeholder="请选择发布时间"></el-time-picker>
      </el-form-item>
      <el-form-item label="排序:">
        <el-input v-model="form.sort" style="width: 220px;"></el-input>
      </el-form-item>
      <el-form-item label="是否隐藏:">
        <el-radio v-model="form.status" label="0">是</el-radio>
        <el-radio v-model="form.status" label="1">否</el-radio>
      </el-form-item>
      <el-form-item label="内容:">
          <editor editorId="content" :content="form.content" ref="content"></editor>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmAddInformation">确 定</el-button>
    </div>
  </div>
</template>

<script>
import editor from "@/components/editor";
export default {
  components: {
    editor,
  },
  data() {
    return {
      form: {},
    };
  },
};
</script>

<style scoped>
</style>