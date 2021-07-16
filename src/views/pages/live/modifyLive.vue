<template>
  <el-main>
    <el-form :model="form" ref="form" size="mini" label-width="100px">
      <el-form-item label="直播间名称:">
        <el-input v-model="form.room_name" placeholder="请输入直播间名称"></el-input>
      </el-form-item>
      <el-form-item label="房间类型:">
        <el-radio-group v-model="form.room_type">
          <el-radio :label="1">本科</el-radio>
          <el-radio :label="2">专科</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="直播类型:">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">分类招生</el-radio>
          <el-radio :label="2">秋招</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否推荐:">
        <el-radio-group v-model="form.isrecom">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学校名称:">
        <el-input v-model="form.school" placeholder="请输入学校名称"></el-input>
      </el-form-item>
      <el-form-item label="学校ID:">
        <el-input v-model="form.school_id" placeholder="请输入学校ID"></el-input>
      </el-form-item>
      <el-form-item label="开始时间:">
        <el-date-picker
          v-model="editModel.start_time"
          type="datetime"
          placeholder="选择开始时间"
          value-format="timestamp"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="老师开始时间:">
        <el-date-picker
          v-model="editModel.teacher_start_time"
          type="datetime"
          placeholder="选择老师开始时间"
          value-format="timestamp"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间:">
        <el-date-picker
          v-model="editModel.end_time"
          type="datetime"
          placeholder="选择结束时间"
          value-format="timestamp"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="预约人数:">
        <el-input v-model="form.orders" placeholder="请输入预约人数"></el-input>
      </el-form-item>
      <el-form-item label="收藏人数:">
        <el-input v-model="form.collects" placeholder="请输入收藏人数"></el-input>
      </el-form-item>
      <el-form-item label="缩略图:">
        <upload ref="thumb" url="/image_live" :limit="3" :file="JSON.stringify(editModel.thumb)"></upload>
      </el-form-item>
      <el-form-item label="封面图:">
        <upload ref="cover" url="/image_live" :limit="3" :file="JSON.stringify(editModel.cover)"></upload>
      </el-form-item>
      <el-form-item label="直播间背景音乐:">
        <uploadMusic ref="music" url="/music_live" :limit="1" :file="JSON.stringify(form.music)"></uploadMusic>
      </el-form-item>
      <el-form-item label="精彩视频连接:">
        <el-input v-model="form.wait_video" placeholder="请输入精彩视频连接"></el-input>
      </el-form-item>
      <el-form-item label="是否有直播预告:">
        <el-radio-group v-model="form.cover_isvideo">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="直播预告视频连接:" v-show="form.cover_isvideo==1">
        <el-input v-model="form.cover_video" placeholder="请输入直播预告视频连接"></el-input>
      </el-form-item>
      <el-form-item label="学校LOGO:">
        <upload
          ref="school_logo"
          url="/image_live"
          :limit="1"
          :file="JSON.stringify(editModel.school_logo)"
        ></upload>
      </el-form-item>
      <el-form-item label="封面图:">
        <upload
          ref="share_img"
          url="/image_live"
          :limit="1"
          :file="JSON.stringify(editModel.share_img)"
        ></upload>
      </el-form-item>
      <el-form-item label="管理员ID:">
        <el-input v-model="form.admin_id" placeholder="请输入管理员ID"></el-input>
      </el-form-item>
      <el-form-item label="助理ID:">
        <el-input v-model="form.zhuli_id" placeholder="请输入助理ID"></el-input>
      </el-form-item>
      <el-form-item label="管理员名称:">
        <el-input v-model="form.admin_name" placeholder="请输入管理员名称"></el-input>
      </el-form-item>
      <el-form-item label="排序:">
        <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
      </el-form-item>
      <el-form-item label="发布版本:">
        <el-radio-group v-model="form.dev">
          <el-radio :label="1">正式</el-radio>
          <el-radio :label="0">测试</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="内容:" prop="content">
        <editor editorId="content" :content="form.content" ref="content"></editor>
      </el-form-item>
      <el-form-item label="ppt直播:">
        <el-radio-group v-model="form.is_ppt">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="ppt直播内容:" v-show="form.is_ppt==1">
        <upload
          ref="ppt_image"
          url="/image_live"
          multiple
          :file="JSON.stringify(editModel.ppt_image)"
        ></upload>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleClose">取 消</el-button>
        <el-button v-if="state=='add'" type="primary" @click="handleAdd">确 定</el-button>
        <el-button v-else type="primary" @click="handleEdit">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>
        
<script>
/* eslint-disable*/
import editor from "@/components/editor";
import upload from "@/components/upload";
import uploadMusic from "@/components/uploadMusic";
export default {
  components: {
    editor,
    upload,
    uploadMusic
  },
  data() {
    return {
      form: {},
      region: [],
      cate_list: [],
      editModel: {},
      state: "add"
    };
  },
  created() {
    this.state = this.$route.query.state;
    this.form.room_id = this.$route.query.room_id;
    if (this.form.room_id) {
      this.loadDetail();
    }
  },
  methods: {
    loadOption() {
      this.$post("/admin/classifie/condition_question").then(res => {
        if (res.code === 1) {
          this.region = res.region; //地区搜索
          this.cate_list = res.cate_list;
        }
      });
    },
    //
    loadDetail() {
      this.$post("/admin/live/getone", {
        room_id: this.form.room_id
      }).then(res => {
        // console.log("详情", res);
        if (res.code === 1) {
          this.form = res.info;
          this.form.content = res.info_data.content;
          this.form.cover = res.info_data.cover;
          this.form.share_img = res.info_data.share_img;
          this.form.school_logo = res.info_data.school_logo;
          // this.form.start_time = this.form.start_time * 1000;
          // this.form.end_time = this.form.end_time * 1000;
          // this.form.teacher_start_time = this.form.teacher_start_time * 1000;
          this.form.ppt_image = res.info_data.ppt_image;
          this.form.is_ppt = res.info.is_ppt;
          this.form.cover_isvideo = res.info_data.cover_isvideo;
          this.form.music = res.info_data.music;
          this.form.wait_video = res.info_data.wait_video;
          this.form.cover_video = res.info_data.cover_video;

          // edit展示图片
          this.editModel = {
            start_time: res.info.start_time * 1000,
            end_time: res.info.end_time * 1000,
            teacher_start_time: res.info.teacher_start_time * 1000,
            thumb: res.info.thumb,
            cover: res.info_data.cover,
            school_logo: res.info_data.school_logo,
            share_img: res.info_data.share_img,
            ppt_image: res.info_data.ppt_image
          };
        
        }
      });
    },
    handleClose() {},
    handleAdd() {
      this.form.content = this.$refs.content.getHtml();

      // console.log("新增",this.$refs.thumb.getFileList())

      this.form.music = this.$refs.music.getFileList();
      this.form.thumb = this.$refs.thumb.getFileList();
      this.form.cover = this.$refs.cover.getFileList();
      this.form.school_logo = this.$refs.school_logo.getFileList();
      this.form.share_img = this.$refs.share_img.getFileList();
      this.form.end_time = this.editModel.end_time / 1000;
      this.form.start_time = this.editModel.start_time / 1000;
      this.form.teacher_start_time = this.editModel.teacher_start_time / 1000;
      if (this.form.is_ppt == 1) {
        this.form.ppt_image = this.$refs.ppt_image.getFileList();
      }
      this.$post("/admin/live/add", this.form).then(res => {
        if (res.code === 1) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.$router.push("/live/live");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleEdit() {
      this.form.content = this.$refs.content.getHtml();
      this.form.music = this.$refs.music.getFileList();
      this.form.thumb = this.$refs.thumb.getFileList();
      this.form.cover = this.$refs.cover.getFileList();
      this.form.share_img = this.$refs.share_img.getFileList();
      this.form.school_logo = this.$refs.school_logo.getFileList();
      this.form.start_time = this.editModel.start_time / 1000;
      this.form.end_time = this.editModel.end_time / 1000;
      this.form.teacher_start_time = this.editModel.teacher_start_time / 1000;
      if (this.form.is_ppt == 1) {
        this.form.ppt_image = this.$refs.ppt_image.getFileList();
      }
      this.$post("/admin/live/edit", this.form).then(res => {
        if (res.code === 1) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.$router.push("/live/live");
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  mounted() {
    this.form = {
      content: " "
    };
  }
};
</script>
        
 <style>
.mt {
  margin-top: 10px;
}
</style>