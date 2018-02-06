<template>
    <div class="song-list">
      <ul>
        <li class="item"
            @click="selectItem(song, index)"
            v-for="(song, index) in songs"
            :key="song.id">
          <div class="rank" v-show="rank">
            <span :class="getRankClass(index)" v-html="getRankText(index)"></span>
          </div>
          <div class="content">
            <h3 class="name">{{song.name}}</h3>
            <p class="desc">{{getDesc(song)}}</p>
          </div>
        </li>
      </ul>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit('select', item, index);
    },
    getDesc(song) {
      return `${song.singer}·${song.album}`;
    },
    getRankClass(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return 'text';
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable";
@import "~common/stylus/mixin";
.song-list{
  .item{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .rank{
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;
      .icon{
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0{
          bg-img('first');
        }
        &.icon1{
          bg-img('second');
        }
        &.icon2{
           bg-img('third');
         }
      }
    }
    .content{
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name{
        nowrap();
        color: $color-text;
      }
      .desc{
        nowrap();
        margin-top: 4px;
        color: $color-text-l;
      }
    }
  }
}
</style>
