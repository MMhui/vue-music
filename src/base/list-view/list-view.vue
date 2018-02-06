<template>
    <scroll class="listview"
            ref="listview"
            :probeType="probeType"
            :data="data"
            :listenScroll="listenScroll"
            @scroll="scroll">
      <ul>
        <li class="list-group" ref="listGroup"
            v-for="group in data"
            :key="group.title">
          <h2 class="list-group-title">{{group.title}}</h2>
          <ul>
            <li class="list-group-item"
                v-for="item in group.items"
                :key="item.name"
                @click="selectItem(item)">
              <img class="avatar" v-lazy="item.avatar" />
              <span class="name">{{item.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="list-shortcut"
           @touchstart="onShortcutTouchStart"
           @touchmove.stop.prevent="onShortcutTouchMove"
           @touchend.stop>
        <ul>
          <li class="item"
              :class="{'current': currentIndex === index}"
              v-for="(item, index) in shortcutList"
              :key="index"
              :data-index="index">{{item}}</li>
        </ul>
      </div>
      <div class="shortcut-fixed" ref="shortcutFixed" v-show="fixedTitle">
        <h2 class="fixed-title">{{fixedTitle}}</h2>
      </div>
      <div class="loading-container" v-show="!data.length">
        <loading></loading>
      </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll.vue';
import Loading from 'base/loading/loading.vue';
import { getData } from 'common/js/dom.js';
import { prefixStyle } from 'common/js/dom';
const transform = prefixStyle('transform');
const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;
export default {
  name: 'ListView',
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return '';
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
    }
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.probeType = 3;
  },
  methods: {
    refresh() {
      this.$refs.listview.refresh();
    },
    selectItem(item) {
      this.$emit('select', item);
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index');
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = parseFloat(anchorIndex);
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = parseFloat(this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
      let anchorIndex = this.touch.anchorIndex + delta;
      this._scrollTo(anchorIndex);
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newScrollY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部 newSCroll > 0
      if (newScrollY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 当在中间部分滚动的时候
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newScrollY >= height1 && -newScrollY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newScrollY;
          return;
        }
      }
      // 当滚动到底部，且-newScroll大于最后一个元素的上限
      if (-newScrollY >= this.listHeight[this.listHeight.length - 1]) {
        this.currentIndex = listHeight.length - 2;
      }
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.shortcutFixed.style[transform] = `translate3d(0, ${fixedTop}px, 0)`;
    }
  },
  components: {
    Scroll, Loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable.styl";
.listview{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .list-group{
    padding-bottom: 30px;
    .list-group-title{
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .list-group-item{
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar{
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name{
        margin-left: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
    }

  }
  .list-shortcut{
    position: absolute;
    z-index: 30;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 20px;
    margin: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helveltica;
    .item{
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current{
        color: $color-theme;
      }
    }
  }
  .shortcut-fixed{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title{
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  .loading-container{
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
