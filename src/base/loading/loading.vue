<template>
    <div class="loading">
      <img src="./loading.gif" width="24" height="24" />
      <p class="text">{{title}}</p>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'Loading',
  props: {
    title: {
      type: String,
      default: '正在载入中...'
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable.styl";
  .loading{
  width: 100%;
  text-align: center;
  .disc{
    lien-height: 20px;
    font-size: $font-size-small;
    color: $color-text-l;
  }
}
</style>
