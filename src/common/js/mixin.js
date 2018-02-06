import { mapGetters, mapMutations, mapActions } from 'vuex';
import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/util';

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList);
  },
  activated() {
    this.handlePlayList(this.playList);
  },
  methods: {
    handlePlayList() {
      let error = new Error('component must implement handlePlaylist method');
      throw error;
    }
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal);
    }
  }
};

export const playerMixin = {
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playList',
      'favoriteList'
    ]),
    iconMode() {
      return (this.mode === playMode.sequence) ? 'icon-sequence' : (this.mode === playMode.loop ? 'icon-loop' : 'icon-random');
    }
  },
  methods: {
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    getFavoriteIcon(song) {
      return this.isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite';
    },
    toggleFavorite(song) {
      this.isFavorite(song) ? this.deleteFavoriteList(song) : this.saveFavoriteList(song);
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id;
      });
      return index > -1;
    }
  }
};

export const searchMixin = {
  data() {
    return {
      query: ''
    };
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ]),
    addQuery(key) {
      this.$refs.searchBox.setQuery(key);
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    onQueryChange(query) {
      this.query = query;
    }
  }
};
