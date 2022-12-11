import { db, auth }  from "../config/firebase.js";
import { signOut } from "firebase/auth";
import { defineStore } from "pinia";
import { collection, onSnapshot, } from "firebase/firestore";
import Swal from "sweetalert2";
import axios from "axios";

const URL_API = "http://localhost:3000/";

export const useApp = defineStore({
  id: "App",
  state: () => ({
    input: {
      links: {},
      edit : {},
  },
    user: {
      logged_in: false,
    },
    error: null,
    linkys : [],
  }),
  actions: {
    async login(email, password) {
      console.log("login");
      try {
        await axios
        .post(URL_API, {
            email,
            password,
          })
          .then((res) => {
            document.cookie = `session=${res.data.result.session}; max-age=${res.data.result.options.maxAge};`;
            this.router.push("/dashboard");
          })
          .catch((error) => {
            console.log(error.response.data.message);
            if (
              error.response.data.message === "Firebase: Error (auth/user-not-found)."
            ) {
              let alert_1 = document.querySelector("#alert_1");
              alert_1.classList.remove("d-none");
              alert_1.innerHTML = "User not found !";
            }
            if (
              error.response.data.message === "Firebase: Error (auth/wrong-password)."
            ) {
              let alert_1 = document.querySelector("#alert_1");
              alert_1.classList.remove("d-none");
              alert_1.innerHTML = "Wrong password !";
            }
          });
      } catch (error) {
        console.log(error);
        this.error = error;
      } 
    },
    async register(email, password, cpassword) {
      this.error = null;
      console.log("register");
      try {
        
        await axios
          .post(URL_API + "register", {
            email,
            password,
            cpassword,
          })
          .then((res) => {
            if(password !== cpassword) {
              let alert_2 = document.querySelector("#alert_2");
                    alert_2.classList.remove("d-none");
                    alert_2.innerHTML = "Passwords don't match !";
              return res.status(400).json({
                  message: "Passwords don't match",
              });
          }
            console.log(res);
            this.router.push("/");
          })
          .catch((error) => {
            console.log(error.response.data.message);
            if (
              error.response.data.message === "Firebase: Error (auth/email-already-in-use)."
            ) {
              let alert_2 = document.querySelector("#alert_2");
              alert_2.classList.remove("d-none");
              alert_2.innerHTML = "Email already in use !";
            }
          });
      } catch (error) {
        this.error = error;
      } 
    },
    
    async logout() {
      await signOut(auth)

     document.cookie = 'token=; Max-Age=0'
      document.cookie = 'refreshToken=; Max-Age=0'
      document.cookie = 'session=; Max-Age=0'

      console.log("document.cookie", document.cookie)

      this.router.push('/')
    },

    async sessionCheck() {

      const session = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session="))
        ?.split("=")[1];

      console.log("session : " + session);
      console.log("document.cookie : ", document.cookie)

 
      return false;
    },
    async shorten(links){
      await axios
      .post(URL_API + "dashboard", {
        alias: links.alias,
        url: links.url,
        code: links.code,
        editState: false,
      })
      .then((result) => {
        console.log(result);
        // Reset form
        this.resetForm();
        // Refresh link list
        this.refreshList();
      }).catch((error) => {
        console.log(error);
      });
    },
    async deleteLink(linky) {
    
          const id = linky.id 
          console.log(linky.id)
          await axios.delete(URL_API + "linky/" + id)
  
          
          .then((result) => {
            console.log(result);
            // Reset form
            this.resetForm();
            // Refresh link list
            this.refreshList();
          }).catch((error) => {
            console.log(error);
          });
   
    },

    async editLink(linky, edit) {
      const id = linky.id 
      console.log(linky.id)
          await axios.patch(URL_API + "linky/" + id, edit)
      .then((result) => {
        console.log(result);
        // Reset form
        this.resetForm();
        // Refresh link list
        this.refreshList();
      }).catch((error) => {
        console.log(error);
      });

},
    resetForm() {
      this.input.links.url = '';
      this.input.links.alias = '';
      this.input.links.code = '';
      this.input.edit.url = '';
      this.input.edit.alias = '';
      this.input.edit.code = '';
    },
    redirect(){
      db.collection('urls').where('code', '==', this.$route.params.code).onSnapshot((linky) => {
      if(linky.empty){
        this.$router.push({name: '404'});
      } else {
        window.location.replace(linky.docs[0].data().url);
      }
    })
    },
    async refreshList() {
      onSnapshot(collection(db, "urls"), (querySnapshot) => {
        this.linkys = [];
        querySnapshot.forEach((doc) => {
          this.linkys.push({ id: doc.id, ...doc.data() });
        });
      },
      error => {
        Swal.fire({
          title: 'Error!',
          text: `Seems like there is an error while connecting to Firestore<br>${error}`,
          icon: 'error',
          confirmButtonText: 'Cool'
        });
      }
      );
    },
  },
});

