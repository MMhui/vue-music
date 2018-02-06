<template>
  <div class="rank" ref="rank">
    <scroll class="rank-list" ref="rankList" :data="rankList">
      <ul>
        <li class="item"
            v-for="item in rankList"
            :key="item.id">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" />
          </div>
          <ul class="song-list">
            <li class="song" @click="selectItem(item)" v-for="(song, index) in item.songList" :key="song.songname">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!rankList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { getRankList } from 'api/rank';
import { ERR_OK } from 'api/config';
import { playListMixin } from 'common/js/mixin';
import { mapMutations } from 'vuex';
export default {
  mixins: [ playListMixin ],
  name: 'Rank',
  computed: {},
  data() {
    return {
      rankList: []
    };
  },
  created() {
    this._getRankList();
  },
  methods: {
    ...mapMutations({
      setRankList: 'SET_RANK_LIST'
    }),
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : 0;
      this.$refs.rank.style.bottom = bottom;
      this.$refs.rankList.refresh();
    },
    _getRankList() {
      getRankList().then((res) => {
        if (res.code === ERR_OK) {
          this.rankList = res.data.topList;
        }
      });
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      });
      this.setRankList(item);
    }
  },
  components: {
    Scroll, Loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable";
@import "~common/stylus/mixin";
.rank{
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  .rank-list{
    height: 100%;
    overflow: hidden;
    .item{
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child{
        padding-bottom: 20px;
      }
      .icon{
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .song-list{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        font-size: $font-size-small;
        color: $color-text-d;
        .song{
          no-wrap();
          line-height: 26px;
        }
      }
    }
  }
  .loading-conainer{
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
  }
}
</style>
