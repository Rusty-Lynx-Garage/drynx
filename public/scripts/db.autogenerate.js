
//  firebase.analytics();

  var db = firebase.firestore();

  $(document).ready(function(){

    //------------------------------------------------------------------
    //-------- BEBIDAS
    //------------------------------------------------------------------

    db.collection("beverages").doc("n21axPunQQcsbKwkD43h").set({
      name: "Cerveza",
      price: 1 ,
      image: 2,
      category: 0,
      stock: 10
    })
    .then(function(docRef) {
      console.log("Beverage written with ID: n21axPunQQcsbKwkD43h");
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("beverages").doc("ycSaPimReVqMd9WHwJmp").set({
      name: "Refresco",
      price: 0.75 ,
      image: 1,
      category: 0,
      stock: 10
    })
    .then(function(docRef) {
      console.log("Beverage written with ID: ycSaPimReVqMd9WHwJmp");
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("beverages").doc("XqBiH7q9PdK31pkScMjs").set({
      name: "Café",
      price: 0.5 ,
      image: 3,
      category: 0,
      stock: 10
    })
    .then(function(docRef) {
      console.log("Beverage written with ID: XqBiH7q9PdK31pkScMjs");
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("beverages").doc("9854714GvVSCWaoCKI4l").set({
      name: "Combinado",
      price: 2 ,
      image: 4,
      category: 0,
      stock: 10
    })
    .then(function(docRef) {
      console.log("Beverage written with ID: 9854714GvVSCWaoCKI4l");
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    //------------------------------------------------------------------
    //-------- USUARIOS
    //------------------------------------------------------------------

    db.collection("users").doc("dgrafols").set({
      email: "dgrafols@gmail.com",
      admin: true,
      name: "",
      lastLogin: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2000"))
    })
    .then(function(docRef) {
      console.log("User written with ID: dgrafols");
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("users").doc("galremi").set({
      email: "galremi@gmail.com",
      admin: false,
      name: "Cabesa",
      lastLogin: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2000"))
    })
    .then(function(docRef) {
      console.log("User written with ID: galremi");
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("users").doc("sergrafer").set({
      email: "sergrafer@gmail.com",
      admin: false,
      name: "Sergio",
      lastLogin: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2000"))
    })
    .then(function(docRef) {
      console.log("User written with ID: galremi");
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    //------------------------------------------------------------------
    //-------- CONSUMOS
    //------------------------------------------------------------------

    db.collection("uptakes").add({
      beverage: db.doc('beverages/n21axPunQQcsbKwkD43h'),
      user: db.doc('users/dgrafols'),
      quantity: 2,
      price: 1,
      description: "Cerveza",
      paid: true,
      date: firebase.firestore.Timestamp.fromDate(new Date("November 12, 2020"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("uptakes").add({
      beverage: db.doc('beverages/n21axPunQQcsbKwkD43h'),
      user: db.doc('users/sergrafer'),
      quantity: 2,
      price: 1,
      description: "Cerveza",
      paid: false,
      date: firebase.firestore.Timestamp.fromDate(new Date("November 12, 2020"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("uptakes").add({
      beverage: db.doc('beverages/9854714GvVSCWaoCKI4l'),
      user: db.doc('users/sergrafer'),
      quantity: 2,
      price: 2,
      description: "Combinado",
      paid: false,
      date: firebase.firestore.Timestamp.fromDate(new Date("November 12, 2020"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("uptakes").add({
      beverage: db.doc('beverages/XqBiH7q9PdK31pkScMjs'),
      user: db.doc('users/dgrafols'),
      quantity: 1,
      price: 0.5,
      description: "Café",
      paid: false,
      date: firebase.firestore.Timestamp.fromDate(new Date("December 2, 2020"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("uptakes").add({
      beverage: db.doc('beverages/XqBiH7q9PdK31pkScMjs'),
      user: db.doc('users/galremi'),
      quantity: 2,
      price: 0.5,
      description: "Café",
      paid: true,
      date: firebase.firestore.Timestamp.fromDate(new Date("December 2, 2020"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("uptakes").add({
      beverage: db.doc('beverages/ycSaPimReVqMd9WHwJmp'),
      user: db.doc('users/dgrafols'),
      quantity: 1,
      price: 0.75,
      description: "Refresco",
      paid: false,
      date: firebase.firestore.Timestamp.fromDate(new Date("December 2, 2020"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("uptakes").add({
      beverage: db.doc('beverages/n21axPunQQcsbKwkD43h'),
      user: db.doc('users/dgrafols'),
      quantity: 1,
      price: 1,
      description: "Cerveza",
      paid: false,
      date: firebase.firestore.Timestamp.fromDate(new Date("December 14, 2020"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

   db.collection("uptakes").add({
      beverage: db.doc('beverages/XqBiH7q9PdK31pkScMjs'),
      user: db.doc('users/dgrafols'),
      quantity: 1,
      price: 0.5,
      description: "Café",
      paid: false,
      date: firebase.firestore.Timestamp.fromDate(new Date("January 11, 2021"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

   db.collection("uptakes").add({
      beverage: db.doc('beverages/XqBiH7q9PdK31pkScMjs'),
      user: db.doc('users/galremi'),
      quantity: 2,
      price: 0.5,
      description: "Café",
      paid: false,
      date: firebase.firestore.Timestamp.fromDate(new Date("January 11, 2021"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

   db.collection("uptakes").add({
      beverage: db.doc('beverages/XqBiH7q9PdK31pkScMjs'),
      user: db.doc('users/sergrafer'),
      quantity: 1,
      price: 0.5,
      description: "Café",
      paid: false,
      date: firebase.firestore.Timestamp.fromDate(new Date("January 11, 2021"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

   db.collection("uptakes").add({
      beverage: db.doc('beverages/9854714GvVSCWaoCKI4l'),
      user: db.doc('users/sergrafer'),
      quantity: 2,
      price: 2,
      description: "Combinado",
      paid: false,
      date: firebase.firestore.Timestamp.fromDate(new Date("January 11, 2021"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

   db.collection("uptakes").add({
      beverage: db.doc('beverages/9854714GvVSCWaoCKI4l'),
      user: db.doc('users/sergrafer'),
      quantity: 150,
      price: 300,
      description: "Combinado",
      paid: false,
      date: firebase.firestore.Timestamp.fromDate(new Date("February 11, 2021"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("uptakes").add({
      beverage: db.doc('beverages/9854714GvVSCWaoCKI4l'),
      user: db.doc('users/dgrafols'),
      quantity: 1,
      price: 2,
      description: "Combinado",
      paid: false,
      date: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("uptakes").add({
      beverage: db.doc('beverages/9854714GvVSCWaoCKI4l'),
      user: db.doc('users/dgrafols'),
      quantity: 1,
      price: 2,
      description: "Combinado",
      paid: false,
      date: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("uptakes").add({
      beverage: db.doc('beverages/XqBiH7q9PdK31pkScMjs'),
      user: db.doc('users/dgrafols'),
      quantity: 2,
      price: 0.5,
      description: "Café",
      paid: false,
      date: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("uptakes").add({
      beverage: db.doc('beverages/9854714GvVSCWaoCKI4l'),
      user: db.doc('users/sergrafer'),
      quantity: 3,
      price: 2,
      description: "Combinado",
      paid: false,
      date: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("uptakes").add({
      beverage: db.doc('beverages/XqBiH7q9PdK31pkScMjs'),
      user: db.doc('users/galremi'),
      quantity: 2,
      price: 0.5,
      description: "Café",
      paid: false,
      date: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    //------------------------------------------------------------------
    //-------- TRANSFERENCIAS
    //------------------------------------------------------------------

    db.collection("transfers").add({
      user: db.doc('users/dgrafols'),
      month: 10,
      year: 2020,
      amount: 2,
      confirmed: true,
      date: firebase.firestore.Timestamp.fromDate(new Date("December 01, 2020"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("transfers").add({
      user: db.doc('users/sergrafer'),
      month: 10,
      year: 2020,
      amount: 6,
      confirmed: false,
      date: firebase.firestore.Timestamp.fromDate(new Date("December 02, 2020"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("transfers").add({
      user: db.doc('users/galremi'),
      month: 11,
      year: 2020,
      amount: 1,
      confirmed: true,
      date: firebase.firestore.Timestamp.fromDate(new Date("January 02, 2021"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("transfers").add({
      user: db.doc('users/dgrafols'),
      month: 11,
      year: 2020,
      amount: 2.25,
      confirmed: false,
      date: firebase.firestore.Timestamp.fromDate(new Date("January 01, 2021"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("transfers").add({
      user: db.doc('users/galremi'),
      month: 0,
      year: 2021,
      amount: 1,
      confirmed: false,
      date: firebase.firestore.Timestamp.fromDate(new Date("February 01, 2021"))
    })
    .then(function(docRef) {
      console.log("Uptake written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

  });