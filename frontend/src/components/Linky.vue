<template>
  <div class="w-full flex justify-center items-center ">
    <div
      class="w-96 flex-2 rounded-xl bg-white p-5 my-2 lg:my-4 lg:mx-4 shadow-sm border hover:shadow-md hover:border-purple-600">
      <h3 class="flex justify-center text-lg font-bold flex items-center">
        <button
          class="w-20 bg-gradient-to-r from-red-600 to-red-400 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded"
          @click="app.deleteLink(linky)">Delete</button>
        <button
          class="w-20 bg-gradient-to-r from-red-600 to-red-400 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded"
          v-if="!linky.editState" @click="linky.editState = !linky.editState">Edit</button>

        

        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
        {{ linky.alias }}
      </h3>
      <div class="flex items-center flex justify-center">
        <router-link class="text-blue-600 underline mr-4" :to="'/' + linky.code" target="_blank">
          {{ currentHost }}/{{ linky.code }}</router-link>
        <!-- Copy Button -->

      </div>

      <div v-if="linky.editState">
          <br>
          <h3>Edit Link</h3>
          <form>
            <input
              class="w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-500 focus:outline-none  text- text-black placeholder-gray-500 border border-gray-200 rounded-lg pl-4 py-2 mb-4"
              type="url" pattern="https://.*" v-model="app.input.edit.url" aria-label="URL" placeholder="blabla.com"
              required />
            <br>
            <input
              class="w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-500 focus:outline-none  text- text-black placeholder-gray-500 border border-gray-200 rounded-lg pl-4 py-2 mb-4"
              type="text" v-model="app.input.edit.alias" aria-label="Alias" placeholder="alias" required />
            <br>
            <input
              class="w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-500 focus:outline-none  text- text-black placeholder-gray-500 border border-gray-200 rounded-lg pl-4 py-2 mb-4"
              type="text" v-model="app.input.edit.code" aria-label="Alias" placeholder="code" required />
            <br>
            <button
              class="w-20 bg-gradient-to-r from-blue-600 to-blue-400 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded"
              @click="(linky.editState = !linky.editState); app.editLink(linky)">Edit</button>
            <button
              class="w-20 bg-gradient-to-r from-blue-600 to-blue-400 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded"
              @click="linky.editState = !linky.editState">Cancel</button>
          </form>
        </div>

        
    </div>
  </div>
</template>
  
  <script>
import { useApp } from "../stores/index.js";

  export default {
    data() {
    return {
      url: '',
      alias: '',
      code: '',
    }
  },
    name: 'Linky',
    props: {
      linky: Object
    },
    setup() {
    const app = useApp();
    return {
      app
    };
  },
    data() {
      return {
        currentHost: window.location.host
      }
    },
  
   
  
  }
  </script>
  
  <style scoped>
    .container:hover {
      box-shadow: rgba(124, 58, 237, .4) 0px 3px 10px 0px;
    }
  </style>