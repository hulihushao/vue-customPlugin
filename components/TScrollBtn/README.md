<ScrollBtn direction="h" :scrollLength="100">
  <div style="height: 300px; overflow: auto; width: 800px; display: flex">
    <p style="width: 100px" v-for="(item, index) in 100" :key="index">1111</p>
  </div>
</ScrollBtn>
