
//  firebase.analytics();

  var db = firebase.firestore();


  db.collection("beverages").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });
  });

