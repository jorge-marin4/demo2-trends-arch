const { db } = require("../firebase");

const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const querySnapshot = await db.collection("admin").get();
    const contacts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.render("index", { contacts });
  } catch (error) {
    console.error(error);
  }
});

router.post("/new-contact", async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;
  await db.collection("admin").add({
    firstname,
    lastname,
    email,
    phone,
  });
  res.redirect("/");
});

router.get("/delete-contact/:id", async (req, res) => {
  await db.collection("admin").doc(req.params.id).delete();
  res.redirect("/");
});

router.get("/edit-contact/:id", async (req, res) => {
  const doc = await db.collection("admin").doc(req.params.id).get();
  res.render("index", { contact: { id: doc.id, ...doc.data() } });
  console.log('BANDERA ' + doc.data().email)
});

router.post("/update-contact/:id", async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;
  const { id } = req.params;
  await db
    .collection("admin")
    .doc(id)
    .update({ firstname, lastname, email, phone });
  res.redirect("/");
});

module.exports = router;
