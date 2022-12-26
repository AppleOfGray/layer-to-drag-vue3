import LayerCom from './LayerToDrag.vue'

export default {
  install: (app, options) => {
    app.component('LayerToDrag', LayerCom)
  }
}

/**
 * 插件入口, 上传到npm平台的时候, 在package.json文件里面配置这里的文件地址, 引入插件后将自动导入入口文件
 */