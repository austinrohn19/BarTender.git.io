<template>
  <nav>
    <router-link v-if="loggedIn || true" to="/serverTracker"
      >server tracker</router-link
    ><br />
  </nav>
  <router-view />
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
export default {
  name: 'login',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      successful: false,
      loading: false,
      message: '',
    };
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>