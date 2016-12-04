<template>
  <div class="flex">
    <config-list></config-list>
    <option-field></option-field>
  </div>
</template>
<script>
import ConfigList from './components/ConfigList'
import OptionField from './components/OptionField'
export default {
  components: {
    ConfigList,
    OptionField
  }
}
</script>
<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:300);

  * {
    margin: 0;
    padding: 0;
  }

  html,
  body { height: 100%; }

  body {
    align-items: center;
    background:
      radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 1) 0%,
        rgba(229, 229, 229, .85) 100%
      );
    background-position: center;
    display: flex;
    font-family: Lato, Helvetica, sans-serif;
    justify-content: center;
    text-align: center;
  }

  .flex {
    display: flex;
  }
  .flex-1 {
    flex: 1;
  }
</style>
