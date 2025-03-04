<template>
  <view class="ui-popup">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {},
  components: {},
  computed: {},
  methods: {},
  onShow() {},
}
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.ui-popup {
  @include fl-center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
}
</style>