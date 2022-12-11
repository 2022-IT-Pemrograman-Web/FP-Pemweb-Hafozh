import { db, auth } from './config/firebase.js';
import admin from './config/firebase-service-account.config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, onSnapshot, doc, updateDoc, increment} from "firebase/firestore";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.post('/', (req, res) => {
    const { email, password } = req.body;
    
    try {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return user
        })
        .then((user) => {
            admin.auth().createSessionCookie(user.accessToken, { expiresIn: 60 * 60 * 24 * 5 * 1000 })
            .then((sessionCookie) => {
                const options = { maxAge: 60 * 60 * 24 * 5 * 1000, httpOnly: true, secure: true };
                return res.send({
                    code: 200,
                    message: "Login successfull",
                    result: {
                        logged_in: true,
                        session: sessionCookie,
                        options
                    }
                })
            })
        })
        .catch((error) => {
            res.status(400).json({ message: error.message });
        });
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: 'Internal Server Error',
            error
        })
    }
});


app.post('/register', (req, res) => {
    const { email, password, cpassword } = req.body;

    try {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userRecord) => {
            res.send({
                code: 200,
                message: "User registered successfully",
                result: {
                    userRecord
                }
            })
        })
        .catch((error) => {
            res.status(400).json({ message: error.message });
        });
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: 'Internal Server Error',
            error
        })
    }
});

app.post('/signout', (req, res) => {
    admin.auth().revokeRefreshTokens(req.user.sub)
    .then(() => {
        return admin.auth().getUser(req.user.user_id)
    })
    .then((userRecord) => {
        return res.send({
            code: 200,
            message: 'User record fetched successfully',
            result: {
                userRecord
            }
        })
    })
    .catch((error) => {
        return res.status(500).send({
            code: 500,
            message: 'Internal Server Error',
            error
        })
    });
})

app.get("/dashboard", (req, res) => {
    try {
      db.collection("urls")
        .get()
        .then((querySnapshot) => {
          let linky = [];
          let id;
          querySnapshot.forEach((doc) => {
            id = doc.id;
            linky.push({ id, ...doc.data() });
          });
          res.send(linky);
        });
    } catch (error) {
      res.send(error);
    }
  });

  app.post("/dashboard", (req, res) => {
    const { alias, url, code } = req.body;
    try {
        db.collection("urls")
      .add({
        alias: alias,
        url: url,
        code: code,
        editState: false,
        hitung: 0
      })
    
      res.send( alias, url, code);
      console.log(req.body)
    } catch (error) {
      res.send(error);
    }
  });

  app.delete('/linky/:id', (req, res) => {
    try {
        db.collection("urls")
        .doc(req.params.id).delete()
        .then(() => {
            return res.send({
                code: 200,
                message: 'Link deleted successfully',
            });
        })
        .catch((error) => {
            return res.status(500).send({
                code: 500,
                message: 'Internal Server Error: Failed to update database',
                error
            })
        });
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: 'Internal Server Error',
            error
        })
    }
});

app.patch('/linky/:id', (req, res) => {
    try {
        const linkis = doc(db, "urls", req.params.id);
         updateDoc(linkis, {
         'hitung' : increment(1)
  });
    } catch (error) {
      res.send({
        status: false,
        message: "Failed to update link",
      });
    }
  });

app.patch('/linky/:id', (req, res) => {
    try {
      db.collection("urls")
        .doc(req.params.id)
        .update({
          alias: req.body.alias,
          url: req.body.url,
          code: req.body.code,
          editState: false,
          hitung : 0
        })
        .then(() => {
      console.log("aman")
        })
    } catch (error) {
      res.send({
        status: false,
        message: "Failed to update link",
      });
    }
  });

  app.patch('/linky/:id', (req, res) => {
    try {
      db.collection("urls")
        .doc(req.params.id)
        .update({
          hitung: req.body.firebase.firestore.FieldValue.increment(1)
        })
        .then(() => {
      console.log("aman")
        })
    } catch (error) {
      res.send({
        status: false,
        message: "Failed to update link",
      });
    }
  });

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});