<template>
    <div class="star-rating">
      <span 
        v-for="(star, index) in 5"
        :key="index"
        @click="selectStar(index + 1)"
        @mouseover="highlightStars(index + 1)"
        @mouseout="resetStars"
      >
        <i 
          :class="['fa', 'fa-star', { 'selected': selectedStars >= index + 1 }, { 'hovered': hoveredStars >= index + 1 }]"
        ></i>
      </span>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      value: {
        type: Number,
        default: 0
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        selectedStars: this.value,
        hoveredStars: this.value
      };
    },
    watch: {
      value(newVal) {
        this.selectedStars = newVal;
      }
    },
    methods: {
      selectStar(rating) {
        if (!this.disabled) {
          this.selectedStars = rating;
          this.$emit('input', rating);
        }
      },
      highlightStars(rating) {
        this.hoveredStars = rating;
      },
      resetStars() {
        this.hoveredStars = this.selectedStars;
      }
    }
  };
  </script>
  
  <style scoped>
  .star-rating {
    font-size: 24px;
    color: #ccc;
  }
  .star-rating .selected {
    color: gold;
  }
  .star-rating .hovered {
    color: orange;
  }
  </style>