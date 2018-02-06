<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list';
import { mapGetters } from 'vuex';
import { getMusicList } from 'api/rank';
import { ERR_OK } from 'api/config';
import { createSong } from 'common/js/song';
export default {
  name: 'RankList',
  data() {
    return {
      songs: [],
      rank: true
    };
  },
  computed: {
    title() {
      return this.rankList.topTitle;
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      }
      return '';
    },
    ...mapGetters([
      'rankList'
    ])
  },
  created() {
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      if (!this.rankList.id) {
        this.$router.push('/rank');
        return;
      };
      getMusicList(this.rankList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist);
        }
      });
    },
    _normalizeSongs(list) {
      var ret = [];
      list.forEach((item) => {
        var musicData = item.data;
        if (musicData.albumid && musicData.songid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active{
    transition: all 0.3s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
