<template>
  <transition name="scale">
    <div class="modal" tabindex="-1">
      <button class="modal__close" @click="$emit('close')">
          <svg version="1.1" width="24" height="24"  viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.41,18l8.29-8.29a1,1,0,0,0-1.41-1.41L18,16.59,9.71,8.29A1,1,0,0,0,8.29,9.71L16.59,18,8.29,26.29a1,1,0,1,0,1.41,1.41L18,19.41l8.29,8.29a1,1,0,0,0,1.41-1.41Z"></path>
          </svg>
        </button>
        <div class="modal__body">
          <div class="modal__header"></div>
          <div class="modal__content">
            <slot/>
          </div>
          <div class="modal__footer"></div>
        </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'Modal',
    data () {
      return {
        focusableEls: null,
        focusableElFirst: null,
        focusableElLast: null
      }
    },
    mounted () {
      this.focusableEls = Array.prototype.slice.call(
        this.$el.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]')
      )
      this.focusableElFirst = this.focusableEls[0];
      this.focusableElLast = this.focusableEls[this.focusableEls.length - 1];

      this.$el.focus();
      this.$el.addEventListener('keydown', this.handleKeyDown)

    },
    beforeDestroy () {
      this.$el.removeEventListener('keydown', this.handleKeyDown)
    },
    methods: {
      handleKeyDown (e) {
        const ESC = 27;
        const TAB = 9;

        const focusPrev = () => {
          if (document.activeElement === this.focusableElFirst) {
            e.preventDefault()
            this.focusableElLast.focus()
          }
        }

        const focusNext = () => {
          if (document.activeElement === this.focusableElLast) {
            e.preventDefault()
            this.focusableElFirst.focus()
          }
        }

        switch(e.which) {
          case TAB:
            if (this.focusableEls.length === 1) {
              e.preventDefault();
              break
            }
            if (e.shiftKey) {
              focusPrev()
            } else {
              focusNext()
            }
            break;
          case ESC:
            this.$emit('close')
            break

          default: break
        }
      }
    }

  }
</script>

<style lang="scss">
  .modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    outline: 0;

    &__close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      color: #fff;
      border: 0;
      border-radius: 50%;
      background-color: transparent;
      cursor: pointer;
      z-index: 1;
      transition: background-color .2s;

      &:hover {
        background-color: rgba(51,51,51, .5);
      }

      svg {
        fill: currentColor;
        stroke: currentColor;
      }
    }

    &__body {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: #fff;
      z-index: 1;
      @media(min-width: 480px) {
        position: relative;
        max-width: 500px;
        border-radius: 3px;
        box-shadow: 0 15px 30px 5px rgba(55,55,55,.15);
      }
    }

    &__content {
      padding: 2rem;
    }

  }
  .scale-enter-active,
  .scale-leave-active {
    transform-origin: 50% 100%;
    transition: all .25s;
  }
  .scale-enter,
  .scale-leave-to {
    transform: scale(.97);
    opacity: 0;
  }
</style>
