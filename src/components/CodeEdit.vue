<template>
    <!-- 是内置嵌入的子组建 -->
    <v-ace-editor :readOnly='readOnly' :options="editOption" v-model:value="dataEdit" :lang="lang" :theme="theme"
        :style="{ height: height }" />
    <el-button type="primary" size="small" @click='formatJson' v-if="lang === 'json'">格式化json</el-button>
</template>

<script>
// 是内置嵌入的子组建
import {
    VAceEditor
} from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/snippets/json';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/snippets/python';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/snippets/html';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import ace from 'ace-builds';
ace.config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@' + require('ace-builds').version +
    '/src-noconflict/');

export default {
    components: {
        VAceEditor
    },

    methods: {
        formatJson() {
            const jsObj = JSON.parse(this.dataEdit)
            this.dataEdit = JSON.stringify(jsObj, null, 4)
        },
    },
    props: {
        // 指定代码编辑器支持的语言
        // 这里用的是花括号{}，与用方括号[]一样
        lang: {
            default: 'json'
        },
        // vue内置的字段，用于接收父组件传递的v-model值
        modelValue: {
            type: String,
        },
        // 指定代码编辑器的主体
        // 默认谷歌，还可以monokai，还可以github，在上面import导入，在props-theme中使用
        theme: {
            default: 'chrome'
        },
        // 指定代码编辑器的高度
        height: {
            default: "300px"
        },
        // 代码编辑器是否为只读模式
        readOnly: {
            default: false
        }
    },
    // vue内置函数，用于向父组件派发事件，实现v-model的双向绑定
    emits: ['update:modelValue'],
    // emits: ['update:modelValue','update:theme'],

    // 是计算属性，将它的对象 传递 给 编辑器子组件<v-ace-editor>
    computed: {
        // 给编辑器进行内置的配置
        editOption() {
            return {
                enableBasicAutocompletion: true, // 启用基本自动补全
                enableSnippets: true, // 启用代码段
                enableLiveAutocompletion: true, // 启用实时自动提示
                tabSize: 4, //     tab键占用的空格的位置
                fontSize: 18, // 设置字号
                // 改成false,因为'https://cdn.hsdelivr.net/失效了
                useWorker: false, // 使用校验json语法是否正确
                showPrintMargin: false, //去除编辑器里的竖线
                enableMultiselect: true, // 支持鼠标选中多处
                // readOnly: true, // 是否只读
                showFoldWidgets: true, // 显示折叠部件
                fadeFoldWidgets: true, // 淡入折叠部件
                wrap: true //换行
            };
        },
        // 通过get、set实现双向绑定
        dataEdit: {
            // 是从props - 父组件v-model中获取
            get() {
                return this.modelValue;
            },
            // 在编辑进行编辑时,通过事件的形式，再将值传给props - 父组件v-model 也就是header params setup_script等
            set(value) {
                this.$emit('update:modelValue', value);
            }
        }
    }
};
</script>

<style></style>