var a = false;
var people = [];

firebase.auth().onAuthStateChanged(function(user) {
	console.log("cambio de estado de sesión");
	if (user) {
		checkUser();
 	} else {
		showLogin();
	}
});
 
$(document).ready(function(){
	console.log("document ready vemos sesión");
	$("#loader").fadeOut();
	var user = firebase.auth().currentUser;
	if (user) {
		checkUser();
	}else{
		showLogin();
	}

	var db = firebase.firestore();
	var storage = firebase.storage().ref();
	db.collection("users").get().then(function(querySnapshot) {
		querySnapshot.forEach(function(u) {
			storage.child('avatars/' + u.id + '.jpg').getDownloadURL().then((url) => {
				var xhr = new XMLHttpRequest();
				xhr.responseType = 'blob';
				xhr.onload = (event) => {
					var blob = xhr.response;
					var bUrl = URL.createObjectURL(blob);
					people[u.id] = {avatar: bUrl, name: u.data().name};
				};
				xhr.open('GET', url);
				xhr.send();
  			}).catch((error) => {
  				console.log("error al descargar imagen de usuario");
			});
		});
		console.log(people);
	})
	.catch(function(error) {
    	console.log("Error getting users: ", error);
	});
});

function signin(){
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().useDeviceLanguage();
	firebase.auth()
		.signInWithPopup(provider)
		.then((result) => {
			var credential = result.credential;
			var token = credential.accessToken;
			var user = result.user;

		}).catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			var email = error.email;
			var credential = error.credential;
	});
}

function logout(){
	firebase.auth().signOut().then(() => {
		a = false;
	}).catch((error) => {
	});
}

function showLogin(){
	$("#sessionlayout").fadeOut();
	$("#topmenu").fadeOut();
	$("#loginlayout").fadeIn();
}

function checkUser(){
	var user = firebase.auth().currentUser;
	var [userid,domain] = user.email.split("@");
	var db = firebase.firestore();
	var ue = false;
	db.collection("users").doc(userid)
		.get().then(function(doc) {
    		if(user.email == doc.data().email){
    			a = doc.data().admin;
    			identifyUser(user,userid);
    		}else{
    			console.log("Error getting email");
    			showSessionError("No puedes iniciar sesión");
    		}
    	})
    .catch(function(error) {
        console.log("Error getting user: ", error);
		showSessionError("No puedes iniciar sesión");        
    });
}

function identifyUser(user,userid){

	fetch(user.photoURL)
	  .then(res => res.blob())
	  .then(blob => {
	    let objectURL = URL.createObjectURL(blob);
	    $("#identity img").attr("src",objectURL);
		$("#identity label").text(user.displayName);
		$("#sessionlayout").fadeIn();
		$("#loginlayout").fadeOut(function(){
			$("#topmenu").fadeIn();drinxIndex();
			if(a) $("#amenu").fadeIn();
		});

		var storage = firebase.storage().ref();
		var avatarRef = storage.child('avatars/' + userid + '.jpg');
		var metadata = {cacheControl: 'public,max-age=300'};
		avatarRef.put(blob,metadata).then((snapshot) => {
  			console.log('avatar updated');
		});

    	var db = firebase.firestore();
		db.collection("users").doc(userid).update({
			name: user.displayName,
			lastLogin: firebase.firestore.FieldValue.serverTimestamp()
		})
		.then(function() {})
		.catch(function(error) {
	    	console.error("Error updating user: ", error);
		});
	});
}

function showSessionError(message){
	$("#sessionError .header").text(message);
	$('.message .close').on('click', function() {
    	$(this).closest('.message').transition('fade');
  	});
    $("#sessionError").fadeIn();
    logout();
}