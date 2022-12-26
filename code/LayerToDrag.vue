<template>
    <div class="cc" v-if="showLayer" :style="{
      left: leftValue+'px',
      top: topValue+'px',
      zIndex: zIndex
    }">
        <div class="titleClass" @mousedown="mousedownFun">
          <slot name="title">
            <div>公告</div>
          </slot>
          <div style="padding-right: 15px;cursor: pointer;" @click="showLayer = false">
            <slot name="close">
              X
            </slot>
          </div>
        </div>
        <div ref="layerToDragContentRef" class="contentClass" @click.left.prevent>
          <slot name="default">
            提示内容为空
          </slot>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    // 初始化状态是否靠近左侧, true为靠近左侧, false为靠近右侧
    closeToLeft: {
      type: Boolean,
      default: false
    },
    // 初始化状态是否靠近上面, true为靠近上面, false为靠近下面
    closeToTop: {
      type: Boolean,
      default: true
    },
    // 层级
    zIndex: {
      type: Number,
      default: 1
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 传入的内容高度不确定, 因此采用动态计算的方式
      this.contentHeight = this.$refs.layerToDragContentRef.clientHeight
      // console.log(this.contentHeight)
      this.initFun()
    })
  },
  data () {
    return {
      watchMoveEle: document,
      leftValue: 0,
      topValue: 0,
      showLayer: true,
      startMove: false,
      clientX: 0,
      clientY: 0,
      contentHeight: null
    }
  },
  methods: {
    initFun () {
      this.watchMoveEle.onmousemove = (e) => {
        if (this.showLayer && this.startMove && e.clientY > 0) {
          // console.log('move', e)
          // 根据鼠标上一次和当前位置的位移计算移动距离
          const xDistance = Math.abs(e.clientX) - Math.abs(this.clientX)
          const yDistance = Math.abs(e.clientY) - Math.abs(this.clientY)
          // console.log('x,y: ', xDistance, yDistance)
          this.leftValue = this.leftValue + xDistance
          this.topValue = this.topValue + yDistance
          // 限制移动范围
          if (this.leftValue < 1) {
            this.leftValue = 1
          }
          if (this.leftValue + 401 > window.innerWidth) {
            this.leftValue = window.innerWidth - 401
          }
          if (this.topValue < 1) {
            this.topValue = 1
          }
          if (this.topValue + this.contentHeight + 1 + 48 > window.innerHeight) {
            this.topValue = window.innerHeight - this.contentHeight - 1 - 48
          }
          // 每移动一点都要重新记录上一次的鼠标位置
          this.clientX = e.clientX
          this.clientY = e.clientY
        }
      }
      this.watchMoveEle.onmouseup = (e) => {
        // 鼠标抬起, 不再监听(不再跟随移动)
        if (this.showLayer && this.startMove) {
          this.clientX = e.clientX
          this.clientY = e.clientY
          this.startMove = false
        }
      }
      // 初始化位置计算
      if (this.closeToLeft) {
        this.leftValue = 20
      } else {
        this.leftValue = window.innerWidth - 400 - 20 // 当前屏幕总宽度 400 是提示框固定宽度, 20是与屏幕之间的间隔
      }
      if (this.closeToTop) {
        this.topValue = 20
      } else {
        this.topValue = window.innerHeight - this.contentHeight - 1 - 50 - 20
      }
    },
    mousedownFun (e) {
      // 鼠标按下, 开始监听(跟随移动)
      if (this.showLayer) {
        this.startMove = true
        this.clientX = e.clientX
        this.clientY = e.clientY
      }
    }
  }
}
</script>

<style scoped lang='less'>
.cc{
  width: 400px;
  position: fixed;
  right: 0;
  top: 0;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.1);
  box-shadow: 1px 1px 5px rgba(0,0,0,.2);
  border-radius:2px;
  .titleClass{
    height: 33px;
    background-color: #f8f8f8;
    border-bottom: #eeeeee 1px solid;
    padding-left: 20px;
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    cursor: move;
    user-select: none;
  }
  .contentClass{
    height: auto;
    padding: 8px;
    cursor: text;
  }
}
</style>
