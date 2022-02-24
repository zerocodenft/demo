<template>
  <b-container class="countdown-wrapper">
    <p class="header text-white font-weight-bold text-nowrap text-center mb-0 mb-lg-2">Minting available in...</p>
    <b-row class="d-flex flex-nowrap box w-100 m-0">
      <b-col class="d-flex align-items-center flex-column m-1 p-0">
        <p class="digit text-white m-0 font-weight-bold">{{ twoDigits(days) }}</p>
        <span class="title text-white">days</span>
      </b-col>
      <b-col class="d-flex justify-content-center m-0 p-0">
        <span class="digit text-white m-0">:</span>
      </b-col>

      <b-col class="d-flex align-items-center flex-column m-1 p-0">
        <p class="digit text-white m-0 font-weight-bold">{{ twoDigits(hours) }}</p>
        <span class="title text-white">hours</span>
      </b-col>
      <b-col class="d-flex justify-content-center m-0 p-0">
        <span class="digit text-white m-0">:</span>
      </b-col>
      <b-col class="d-flex align-items-center flex-column m-1 p-0">
        <p class="digit text-white m-0 font-weight-bold">{{ twoDigits(minutes) }}</p>
        <span class="title text-white">min</span>
      </b-col>
      <b-col class="d-flex justify-content-center m-0 p-0">
        <span class="digit text-white m-0">:</span>
      </b-col>
      <b-col class="d-flex align-items-center flex-column m-1 p-0">
        <p class="digit text-white m-0 font-weight-bold">{{ twoDigits(seconds) }}</p>
        <span class="title text-white">sec</span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Countdown",
  props: {
    date: {
      type: String
    }
  },
  data: () => ({
    now: Math.trunc((new Date()).getTime() / 1000)
  }),
  computed: {
    dateInMilliseconds() {
      return Math.trunc(Date.parse(this.date) / 1000)
    },
    seconds() {
      return (this.dateInMilliseconds - this.now) % 60;
    },
    minutes() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60) % 60;
    },
    hours() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60) % 24;
    },
    days() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60 / 24);
    }
  },
  mounted() {
    setInterval(() => {
      this.now = Math.trunc((new Date()).getTime() / 1000);
    }, 1000);
  },
  methods: {
    twoDigits (value) {
      if (value < 0) {
        return '00';
      }
      if (value.toString().length <= 1) {
        return `0${value}`;
      }
      return value;
    }
  }
}
</script>
<style lang="scss">
@mixin count-position($bottom,$width,$left){
  bottom: $bottom;
  width: $width;
  left: $left;
}
.countdown-wrapper {
  @media (min-width: 1199.5px) {
    @include count-position(130px,250px,20px);
    .header {
      font-size: clamp(1rem, 2.5vw, 1.3rem);
    }
    .digit {
      font-size: clamp(1.2rem, 2.5vw, 1.5rem);
      line-height: 27px;
    }
    .title {
      font-size: clamp(.475rem, 2.5vw, .675rem);
      opacity: .5;
    }
  }
  @media (max-width: 1199px) {
    @include count-position(100px,200px,20px);
    .header {
      font-size: clamp(1rem, 2.5vw, 1rem);
    }
    .digit {
      font-size: clamp(1.2rem, 2.5vw, 1rem);
      line-height: 27px;
    }
    .title {
      font-size: clamp(.475rem, 2.5vw, .675rem);
      opacity: .5;
    }

  }
  @media (max-width: 992px) {
    @include count-position(170px,250px,50px);
    .header {
      font-size: clamp(1rem, 2.5vw, 1.4rem);
    }
    .digit {
      font-size: clamp(1.2rem, 2.5vw, 1.6rem);
      line-height: 27px;
    }
    .title {
      font-size: clamp(.475rem, 2.5vw, .675rem);
      opacity: .5;
    }
  }
  @media (max-width: 767px){
    @include count-position(120px,220px,20px);
    .header {
      font-size: clamp(1rem, 2.5vw, 1.2rem);
    }
    .digit {
      font-size: clamp(1.2rem, 2.5vw, 1.2rem);
      line-height: 27px;
    }
    .title {
      font-size: clamp(.475rem, 2.5vw, .675rem);
      opacity: .5;
    }
  }
  @media (max-width: 492px) {
    @include count-position(75px,120px,15px);
    .header {
      font-size: clamp(.8rem, 2.5vw, 1rem);
    }
    .digit {
      font-size: clamp(1.2rem, 2.5vw, 1.2rem);
      line-height: 27px;
    }
    .title {
      font-size: clamp(.475rem, 2.5vw, .675rem);
      opacity: .5;
    }
  }


}
</style>
