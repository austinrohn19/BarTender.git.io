<template>
  <div>
    <button class="btn" @click="goToAddDrink">Add Drink</button>
    <!-- <label for="my-modal" class="btn modal-button">Add Drink</label>

    <input type="checkbox" id="my-modal" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box">
        <div class="p-4">
          <label>Drink name: </label>
          <input type="text" v-model="newDrink.name" placeholder="name" />
        </div>
        <div>
          <label>Drink instructions: </label>
          <textarea
            class="textarea"
            placeholder="instructions"
            v-model="newDrink.instructions"
          ></textarea>
        </div>
        <div>
          <span
            v-for="(ingredents, index) in newDrink.ingredents"
            :key="ingredents"
          >
            <input
              type="text"
              v-model="ingredents.name"
              placeholder="ingredents name"
            />
            <input
              type="text"
              v-model="ingredents.amount"
              placeholder="ingredents amount"
            />
            <button class="btn" @click="mRemoveFromIngredients(index)">
              X
            </button>
          </span>
          <button class="btn" @click="mAddMoreIngredients">
            Add more ingredients
          </button>
        </div>
        <div class="modal-action">
          <label for="my-modal" class="btn" @click="mAddDrink">Yay!</label>
          <label for="my-modal" class="btn btn-warning" @click="mClose"
            >Close</label
          >
        </div>
      </div>
    </div> -->
    <section>
      <div
        class="
          relative
          items-center
          w-full
          px-5
          py-12
          mx-auto
          md:px-12
          lg:px-24
          max-w-7xl
        "
      >
        <div class="grid w-full grid-cols-1 gap-1 mx-auto lg:grid-cols-4">
          <div class="p-6" v-for="drink in drinks" :key="drink">
            <drink-card :data="drink"></drink-card>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import router from '../../router';
import drinkCard from './drink.vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
export default {
  name: 'login',
  components: {
    Form,
    Field,
    ErrorMessage,
    drinkCard,
  },
  data() {
    return {
      successful: false,
      loading: false,
      message: '',
      newDrink: { ingredents: [{ name: '', amount: '' }] },
      drinks: [
        {
          name: 'moscow mule',
          ingredents: [
            { name: 'apple', amount: '1 slice' },
            { name: 'whisky', amount: '8 oz' },
            { name: 'gin', amount: '2 oz' },
          ],
          instructions: 'add it all together and SHAKE!',
        },
        {
          name: 'moscow mule',
          ingredents: [
            { name: 'apple', amount: '1 slice' },
            { name: 'whisky', amount: '8 oz' },
            { name: 'gin', amount: '2 oz' },
          ],
          instructions: 'add it all together and SHAKE!',
        },
        {
          name: 'moscow mule',
          ingredents: [
            { name: 'apple', amount: '1 slice' },
            { name: 'whisky', amount: '8 oz' },
            { name: 'gin', amount: '2 oz' },
          ],
          instructions: 'add it all together and SHAKE!',
        },
        {
          name: 'moscow mule',
          ingredents: [
            { name: 'apple', amount: '1 slice' },
            { name: 'whisky', amount: '8 oz' },
            { name: 'gin', amount: '2 oz' },
          ],
          instructions: 'add it all together and SHAKE!',
        },
        {
          name: 'moscow mule',
          ingredents: [
            { name: 'apple', amount: '1 slice' },
            { name: 'whisky', amount: '8 oz' },
            { name: 'gin', amount: '2 oz' },
          ],
          instructions: 'add it all together and SHAKE!',
        },
        {
          name: 'moscow mule',
          ingredents: [
            { name: 'apple', amount: '1 slice' },
            { name: 'whisky', amount: '8 oz' },
            { name: 'gin', amount: '2 oz' },
          ],
          instructions: 'add it all together and SHAKE!',
        },
        {
          name: 'moscow mule',
          ingredents: [
            { name: 'apple', amount: '1 slice' },
            { name: 'whisky', amount: '8 oz' },
            { name: 'gin', amount: '2 oz' },
          ],
          instructions: 'add it all together and SHAKE!',
        },
        {
          name: 'moscow mule',
          ingredents: [
            { name: 'apple', amount: '1 slice' },
            { name: 'whisky', amount: '8 oz' },
            { name: 'gin', amount: '2 oz' },
          ],
          instructions: 'add it all together and SHAKE!',
        },
      ],
    };
  },
  computed: {},
  mounted() {},
  methods: {
    mRemoveFromIngredients(index) {
      this.newDrink.ingredents = this.newDrink.ingredents.filter((v, i) => {
        return i !== index;
      });
    },
    mAddMoreIngredients() {
      console.log(this.newDrink.ingredents);
      this.newDrink.ingredents.push({ name: '', amount: '' });
    },
    mAddDrink() {
      this.newDrink.push(this.newDrink);
      this.mClose();
    },
    mClose() {
      this.newDrink = { ingredents: [{ name: '', amount: '' }] };
    },
    goToAddDrink() {
      router.push({
        name: 'drinkCrud',
        params: {
          drinkToEdit: this.newDrink,
        },
      });
    },
  },
};
</script>