
firebase.analytics();

const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const images_url = "/images/";
const user_default = "user.png";
const images_d = [
	{name:"Por defecto", file:"default.jpg"},
	{name:"Coca-cola", file:"coca-cola.png"},
	{name:"Coca-cola light", file:"coca-cola-light.jpg"},
	{name:"Coca-cola zero", file:"coca-cola-zero.png"},
	{name:"Coca-cola zero zero", file:"coca-cola-zero-zero.png"},
	{name:"Fanta limón", file:"fanta-limon.jpg"},
	{name:"Fanta naranja", file:"fanta-naranja.jpg"},
	{name:"Tónica", file:"tonica.png"},
	{name:"7up", file:"7up.png"},
	{name:"Lata cerveza", file:"mahou.png"},
	{name:"Tercio cerveza", file:"estrella-galicia.png"},
	{name:"Café", file:"cafe.jpg"},
	{name:"Café con leche", file:"cafe-leche.jpg"},
	{name:"Dyc", file:"dyc.jpg"},
	{name:"Red label", file:"johnnie-walker.png"},
	{name:"Ron", file:"barcelo.png"},
	{name:"Vodka", file:"moskovskaya.png"},
	{name:"Hierbas", file:"orujo-hierbas.png"},
	{name:"Crema", file:"crema-orujo.jpg"},
	{name:"Ginebra",file:"tanqueray.png"}
	];
const categories = ["Cafés","Cervezas","Refrescos","Licores"];
const cat_refrescos = 2;
var products = [];
var y,m,ty,tm;

/* TODO LIST

- Agregar categoría, combinable, adicionable y stock a la bebida en formulario de gestión
- Agregar agrupación por categoría al listado general
- Descontar stock en consumo
- Agregar refresco al consumo de combinados
- Agregar consumo del usuario y deudas a su ficha
- Agregar gestión de stock en edición bebidas

*/

function drinxIndex(){

	firebase.analytics().setCurrentScreen("Index");
	$(".menu .item").removeClass("active");
	$("#tmdrynx").addClass("active");

	var db = firebase.firestore();
	$("#main").empty()
		.append($("<h2>").text("Bebidas").addClass("ui center aligned header"))
		.append($("<div>").addClass("ui two column cards grid container"));

	db.collection("beverages").get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {

			products[doc.id] = {image: images_url + images_d[doc.data().image].file, name: doc.data().name};

			$("<div>").addClass("column")
				.append($("<div>").addClass("ui card").attr("data-id",doc.id).attr("data-price",doc.data().price).click(function(){
					$('.ui.modal .header').text($(this).find(".header").text());
					$('.ui.modal').attr("data-id",$(this).attr("data-id"));
					$('.ui.modal').attr("data-price",$(this).attr("data-price"));
					$('.ui.modal').modal({
						onApprove: function(){
							var user = firebase.auth().currentUser;
							var [userid,domain] = user.email.split("@");
							var intQuantity = isNaN($("#quantity").val())? 1: parseInt($("#quantity").val());
							db.collection("uptakes").add({
								beverage: db.doc('beverages/' + $('.ui.modal').attr("data-id")),
								user: db.doc('users/' + userid),
								quantity: intQuantity,
								price: parseFloat($('.ui.modal').attr("data-price")),
								description: $(this).find(".header").text(),
								date: firebase.firestore.FieldValue.serverTimestamp()
							})
							.then(function(docRef) {
								console.log("Uptake written with ID: ", docRef.id);
								var intQuantity = isNaN($("#quantity").val())? 1: parseInt($("#quantity").val());

								firebase.analytics().logEvent("purchase",{
									currency: "euro",
									value: parseFloat($('.ui.modal').attr("data-price"))
								});
							})
							.catch(function(error) {
								console.error("Error adding document: ", error);
							});
						},
						onHidden: function(){
							$("#quantity").val("1");
							$("body").removeClass("dimmable");
						}
					}).modal('show');
				})
					.append($("<div>").addClass("image")
						.append($("<img>").attr("src", images_url + images_d[doc.data().image].file)))
					.append($("<div>").addClass("content")
						.append($("<a>").addClass("ui header").attr("href","#").text(doc.data().name))
						.append($("<div>").addClass("ui right floated tag label").text(formatCurrency(doc.data().price)))))
				.appendTo(".container");
		});
	});

	return false;
}

function uptakesIndex(){

	firebase.analytics().setCurrentScreen("Uptakes");
	$(".menu .item").removeClass("active");
	$("#tmuptakes").addClass("active");

	$("#main").empty()
		.append($("<div>").addClass("ui center aligned container")
			.append($("<div>").addClass("ui statistic").attr("id","debt")
				.append($("<div>").addClass("label").text("Llevas consumido"))
				.append($("<div>").addClass("value").text(formatCurrency(0))))
			.append($("<div>").addClass("ui divider")))
		.append($("<div>").addClass("ui center aligned container calendar"));

	$("#main").append($("<div>").addClass("ui segment container")
		.append($("<div>").attr("id","myUptakes").addClass("ui middle aligned divided list")));

	var d = new Date();
	y = d.getFullYear();
	m = d.getMonth();
	ty = y;
	tm = m;
	printCalendar(printMonthUptakes);
	printMonthUptakes();
	return false;
}

function globalsIndex(){

	firebase.analytics().setCurrentScreen("Globals");
	$(".menu .item").removeClass("active");
	$("#tmglobals").addClass("active");

	$("#main").empty()
		.append($("<div>").addClass("ui center aligned container")
			.append($("<div>").addClass("ui statistic").attr("id","debt")
				.append($("<div>").addClass("value").text(formatCurrency(0)))
				.append($("<div>").addClass("label").text("Este mes"))))
		.append($("<h3>").text("Los bebedores del mes").addClass("ui center aligned header"))
		.append($("<div>").attr("id","currentDrinkers").addClass("ui segment container"))
		.append($("<div>").addClass("ui divider"))
		.append($("<h3>").text("Lo que han bebido").addClass("ui center aligned header"))
		.append($("<div>").attr("id","currentUptakes").addClass("ui segment container"))
		.append($("<div>").addClass("ui divider"))
		.append($("<h3>").text("Los que deben dinero").addClass("ui center aligned header"))
		.append($("<div>").attr("id","currentDefaulters").addClass("ui segment container"))
		.appendTo($("#main"));

	var db = firebase.firestore();
	var d = new Date();
	y = d.getFullYear();
	m = d.getMonth();
	db.collection("uptakes")
		.where("date",">",firebase.firestore.Timestamp.fromDate(new Date(y, m, "1")))
		.where("date","<",firebase.firestore.Timestamp.fromDate(new Date(y, m+1, "0")))
		.get().then(function(querySnapshot) {
			var debt = 0;
			if(querySnapshot.docs.length == 0){
				$("#currentDrinkers").append($("<p>").text("¿Ha vuelto la Ley Seca? ¡Venga a beber cohone!"));
				$("#currentUptakes").append($("<p>").text("Na! Ya te lo digo yo. Na!"));
			}else{
				$("#currentDrinkers").append($("<div>").addClass("ui middle aligned divided list"));
				$("#currentUptakes").append($("<div>").addClass("ui middle aligned divided list"));
				var drinkers = [];
				var consumptions = [];
				var buffer = 0;
	        	querySnapshot.forEach(function(uptake) {
	        		if(!drinkers[uptake.data().user.id]) drinkers[uptake.data().user.id] = {uptakes:0, debt:0};
	        		if(!consumptions[uptake.data().beverage.id]) consumptions[uptake.data().beverage.id] = {uptakes:0, debt:0};
	        		drinkers[uptake.data().user.id].uptakes += uptake.data().quantity;
	        		drinkers[uptake.data().user.id].debt += (uptake.data().quantity * uptake.data().price);
	        		consumptions[uptake.data().beverage.id].uptakes += uptake.data().quantity;
	        		consumptions[uptake.data().beverage.id].debt += (uptake.data().quantity * uptake.data().price);
	        		buffer += (uptake.data().quantity * uptake.data().price);
	        	});

	        	for(var d in drinkers) {
					$("<div>").addClass("item")
						.append($("<img>").addClass("ui avatar image " + d).attr("src",images_url + user_default))
						.append($("<div>").addClass("content")
							.append($("<div>").addClass("header " + d))
							.append($("<p>").text(drinkers[d].uptakes + (drinkers[d].uptakes > 1 ? " consumiciones" : " consumición"))))
						.prepend($("<div>").addClass("right floated content").text(formatCurrency(drinkers[d].debt)))
						.appendTo("#currentDrinkers .list");
				}

	        	for(var c in consumptions) {
					$("<div>").addClass("item")
						.append($("<img>").addClass("ui avatar image").attr("src",products[c].image))
						.append($("<div>").addClass("content")
							.append($("<div>").addClass("header").text(products[c].name))
							.append($("<p>").text(consumptions[c].uptakes + (consumptions[c].uptakes > 1 ? " consumiciones" : " consumición"))))
						.prepend($("<div>").addClass("right floated content").text(formatCurrency(consumptions[c].debt)))
						.appendTo("#currentUptakes .list");
				}
				$("#debt .value").text(formatCurrency(buffer));
				printAvatarsAndNames();
	        }
    	})
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

	db.collection("uptakes")
		.where("paid","==",false)
		.where("date","<",firebase.firestore.Timestamp.fromDate(new Date(y, m, "0")))
		.get().then(function(querySnapshot) {
			if(querySnapshot.docs.length == 0){
				$("#currentDefaulters").append($("<p>").text("Nadie debe pasta ¡Debe ser un milagro!"));
			}else{
				$("#currentDefaulters").append($("<div>").addClass("ui middle aligned divided list"));
				var defaulters = [];
	        	querySnapshot.forEach(function(uptake) {
	        		var u = uptake.data().user.id;
	        		if(!defaulters[u]) defaulters[u] = [];
	        		var i = (uptake.data().date.toDate().getFullYear() * 100) + uptake.data().date.toDate().getMonth();
	        		if(!defaulters[u][i])
	        			defaulters[u][i] = {date: uptake.data().date.toDate(), debt: (uptake.data().quantity * uptake.data().price)};
	        		else
	        			defaulters[u][i].debt +=uptake.data().quantity * uptake.data().price;
	        	});

	        	for(var d in defaulters) {
	        		for(var i in defaulters[d]) {
						$("<div>").addClass("item")
							.append($("<img>").addClass("ui avatar image " + d).attr("src",images_url + user_default))
							.append($("<div>").addClass("content")
								.append($("<div>").addClass("header " + d))
								.append($("<p>").text(months[defaulters[d][i].date.getMonth()] + " " + defaulters[d][i].date.getFullYear())))
							.prepend($("<div>").addClass("right floated content").text(formatCurrency(defaulters[d][i].debt)))
							.appendTo("#currentDefaulters .list");
					}
				}
	        }
	        printAvatarsAndNames();
    	})
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

	return false;
}

function modalPlus(){
	if(isNaN($("#quantity").val())){
		var q = 0;
	}else{
		var q = parseInt($("#quantity").val());
	}
	q++;
	$("#quantity").val(q);
}

function modalMinus(){
	if(isNaN($("#quantity").val())){
		var q = 1;
	}else{
		var q = parseInt($("#quantity").val());
	}
	if(q>1) q--;
	$("#quantity").val(q);
}

function formatCurrency(val){
	var output = new Intl.NumberFormat("es-ES", {style: "currency", currency: "EUR"}).format(val);
	return output;
}

function printCalendar(callback){
	$("<div>").addClass("ui buttons")
		.append($("<button>").addClass("ui icon button").append($("<i>").addClass("left chevron icon")).click(function(){
			if(m==0){
				y--;
				m=11;
			}else
				m--;
			callback();	
			$(this).next().text(months[m] + " " + y);
			if((ty != y) || (tm != m))
				$(this).next().next().removeClass("disabled");
		}))
		.append($("<button>").attr("id","currentMonthButton").addClass("ui button").text(months[m] + " " + y))
		.append($("<button>").addClass("ui right icon disabled button").append($("<i>").addClass("right chevron icon")).click(function(){
			if(m==11){
				y++;
				m=0;
			}else
				m++;
			callback();
			$(this).prev().text(months[m] + " " + y);
			if((ty == y) && (tm == m))
				$(this).addClass("disabled");
		}))
		.appendTo($(".container.calendar"));
}

function printMonthUptakes(){
	var db = firebase.firestore();
	var user = firebase.auth().currentUser;
	var [userid,domain] = user.email.split("@");
	const userDoc = firebase.firestore().collection('users').doc(userid);
	$("#myUptakes").empty();
	db.collection("uptakes")
		.where("user","==",userDoc)
		.where("date",">",firebase.firestore.Timestamp.fromDate(new Date(y, m, "1")))
		.where("date","<",firebase.firestore.Timestamp.fromDate(new Date(y, m+1, "0")))
		.orderBy("date","desc")
		.get().then(function(querySnapshot) {
			var debt = 0;
			if(querySnapshot.docs.length == 0){
			   	$("<p>").text("No has consumido en " + months[m]).attr("colspan","3").appendTo($("#myUptakes"));
			}else{
	        	querySnapshot.forEach(function(uptake) {
	        		var b = uptake.data().beverage.id;
	        		const options = { month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
					$("<div>").addClass("item")
						.append($("<img>").addClass("ui avatar image").attr("src",products[b].image))
						.append($("<div>").addClass("content")
							.append($("<div>").addClass("header").text(uptake.data().quantity + " " + uptake.data().description + (uptake.data().quantity > 1? "s" : "")))
							.append($("<p>").text(new Intl.DateTimeFormat("es-ES", options).format(uptake.data().date.toDate()))))
						.prepend($("<div>").addClass("right floated content").text(formatCurrency(uptake.data().quantity * uptake.data().price)))
						.appendTo("#myUptakes");

	            		debt += uptake.data().quantity * uptake.data().price;
	        	});
	        }
	        $("#debt .value").text(formatCurrency(debt));
	        if((ty == y) && (tm == m))
	        	$(".statistic .label").text("Llevas consumido");
	        else
	        	$(".statistic .label").text("Consumiste");
	        checkTransfers(debt);
    	})
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });    
}

function checkTransfers(debt){
	$(".debt").remove();
	if((tm != m) || (ty != y)){
		if(debt > 0){

			var db = firebase.firestore();
			var user = firebase.auth().currentUser;
			var [userid,domain] = user.email.split("@");
			const userDoc = firebase.firestore().collection('users').doc(userid);
			db.collection("transfers")
				.where("user","==",userDoc)
				.where("month","==",m)
				.where("year","==",y)
				.get().then(function(querySnapshot) {
					if(querySnapshot.docs.length == 0){
						printDebtButton(debt);
					}else{
						var buffer = 0;
						var unconfirmed = false;
						querySnapshot.forEach(function(transfer) {
							buffer += transfer.data().amount;
							if(!transfer.data().confirmed) unconfirmed = true;
						});
						if(buffer < debt) printDebtButton(buffer - debt);
						if(unconfirmed)
							printPendingTransfers();
						else
							printConfirmedTransfers();
					}
		    	})
		    .catch(function(error) {
		        console.log("Error getting documents: ", error);
		    });    
		}
	}
}

function printDebtButton(debt){
	$("<div>").addClass("ui cards container debt")
		.append($("<div>").addClass("card")
			.append($("<div>").addClass("content left aligned")
				.append($("<div>").addClass("header").text("Transferencia pendiente"))
				.append($("<div>").addClass("description").append($("<p>").text("Este mes todavía debes " + formatCurrency(debt) + " Haz la transferencia de la forma habitual y confirma su envío.")))
				.append($("<div>").addClass("ui primary button").attr("data-debt",debt).text("Transferencia realizada").click(function(){
					var db = firebase.firestore();
					var user = firebase.auth().currentUser;
					var [userid,domain] = user.email.split("@");
					db.collection("transfers").add({
				      user: db.doc('users/'+userid),
				      month: m,
				      year: y,
				      amount: $(this).attr("data-debt"),
				      confirmed: false,
				      date: firebase.firestore.FieldValue.serverTimestamp()
				    })
				    .then(function(docRef) {
				    	$(".debt").fadeOut(function(){
							$(".debt").remove();
							printPendingTransfers();
						});
						firebase.analytics().logEvent("refund",{
							currency: "euro",
							value: $(this).attr("data-debt")
						});
				    })
				    .catch(function(error) {
						$(".debt").fadeOut(function(){
							$(".debt").remove();
				      		$("<div>").addClass("ui positive debt message").append($("<p>").text("Ha ocurrido un error. Avisa al friki que ha hecho esto.")).appendTo(".container");
				      	});
				    });
				}).prepend($("<i>").addClass("thumbs up outline icon")))
				)
			).appendTo("#main");	
}

function printPendingTransfers(){
	$("<div>").addClass("ui warning debt message center aligned container")
		.append($("<i>").addClass("warning large icon"))
		.append($("<p>").text("Alguna de tus transferencias no ha sido confirmada todavía"))
		.appendTo("#main");
}

function printConfirmedTransfers(){
	$("<div>").addClass("ui positive debt message center aligned container")
		.append($("<i>").addClass("check large icon"))
		.append($("<p>").text("Tus deudas de este mes están saldadas"))
		.appendTo("#main");
}

function printAvatarsAndNames(){
	for(var p in people) {
  		$("img." + p).attr("src",people[p].avatar);
		$(".header." + p).text(people[p].name?people[p].name:p);
	}
}

//a

function printAccessControl(){
	firebase.analytics().setCurrentScreen("AccessControl");
	$("<div>").addClass("ui container")
		.append($("<div>").addClass("ui negative message")
			.append($("<p>").text("No tienes acceso a esta sección")));
}

function transfersIndex(){

	$(".menu .item").removeClass("active");
	$("#amtransfers").addClass("active");

	if(a){
		firebase.analytics().setCurrentScreen("Transfers");
		$("#main").empty()
			.append($("<h2>").text("Transferencias").addClass("ui center aligned header"))
			.append($("<h3>").text("Por confirmar").addClass("ui center aligned header"))
			.append($("<div>").attr("id","pendingTransfers").addClass("ui segment container"))
			.append($("<h3>").text("Por meses").addClass("ui center aligned header"))
			.append($("<div>").addClass("ui center aligned container calendar"))
			.append($("<div>").attr("id","monthTransfers").addClass("ui segment container"));

		var db = firebase.firestore();
		db.collection("transfers")
			.where("confirmed","==",false)
			.get().then(function(querySnapshot) {
				if(querySnapshot.docs.length > 0){
					$("#pendingTransfers").append($("<div>").addClass("ui middle aligned divided list"));
					querySnapshot.forEach(function(transfer) {
						$("<div>").addClass("item")
							.append($("<img>").addClass("ui avatar image " + transfer.data().user.id).attr("src",images_url + user_default))
							.append($("<div>").addClass("content")
								.append($("<div>").addClass("header").text(months[transfer.data().month] + " " + transfer.data().year))
								.append($("<p>").text(transfer.data().date.toDate().toLocaleDateString())))
							.prepend($("<div>").addClass("right floated content")
								.append($("<div>").addClass("ui vertical animated button").attr("tabindex","0").attr("data-id",transfer.id).click(function(){
									var user = firebase.auth().currentUser;
									var [userid,domain] = user.email.split("@");
									db.collection("transfers").doc($(this).attr("data-id")).update({
										confirmed: true,
										confirmedBy: userid,
										confirmationDate: firebase.firestore.FieldValue.serverTimestamp()
									})
									.then(function() {})
									.catch(function(error) {
								    	console.error("Error updating transfer: ", error);
									});
									$(this).parent().parent().remove();
									if($(".ui.list").children().length == 0) $(".ui.list").append("<p>Todas las transferencias confirmadas</p>");
									loadTransfers();
								}).append($("<div>").addClass("hidden content")
										.append($("<i>").addClass("check icon")))
									.append($("<div>").addClass("visible content").text(formatCurrency(transfer.data().amount)))))
							.appendTo("#pendingTransfers .list");
					});
					printAvatarsAndNames();
				}else{
					$("#pendingTransfers").append($("<p>").text("Genial! No hay nada pendiente"));
				}
	    	})
	    .catch(function(error) {
	        console.log("Error getting transfers: ", error);
	    }); 

		var d = new Date();
		y = d.getFullYear();
		m = d.getMonth()-1;
		ty = y;
		tm = m;
		printCalendar(loadTransfers);
		loadTransfers();
	}else{
		printAccessControl();
	}
}

function loadTransfers(){

	var db = firebase.firestore();
	$("#monthTransfers").empty();
	db.collection("transfers")
		.where("month","==",m)
		.where("year","==",y)
		.get().then(function(querySnapshot) {
			if(querySnapshot.docs.length > 0){
				$("#monthTransfers").append($("<div>").addClass("ui middle aligned divided list"));
				querySnapshot.forEach(function(transfer) {
					$("<div>").addClass("item")
						.append($("<img>").addClass("ui avatar image " + transfer.data().user.id).attr("src",images_url + user_default))
						.append($("<div>").addClass("content")
							.append($("<div>").addClass("header").text(formatCurrency(transfer.data().amount)))
							.append($("<p>").text(transfer.data().date.toDate().toLocaleDateString())))
						.prepend($("<div>").addClass("right floated content")
							.append($("<i>").addClass(transfer.data().confirmed ? "check green icon" : "warning yellow icon")))
						.appendTo("#monthTransfers .list");
				});
				printAvatarsAndNames();
			}else{
				$("#monthTransfers").append($("<p>").text("Nadie ha realizado transferencias correspondientes a este mes"));
			}
    	})
    .catch(function(error) {
        console.log("Error getting transfers: ", error);
    });
}

function manageBeverages(){

	$(".menu .item").removeClass("active");
	$("#ambeves").addClass("active");

	if(a){
		firebase.analytics().setCurrentScreen("Beverages");
		var db = firebase.firestore();
		$("#main").empty()
			.append($("<h2>").text("Gestionar bebidas").addClass("ui center aligned header"))
			.append($("<div>").addClass("ui segment container")
				.append($("<div>").attr("id","drinksList").addClass("ui middle aligned divided list"))
				.append($("<div>").addClass("ui center aligned container")
					.append($("<button>").addClass("ui labeled icon button").text("Añadir bebida").click(function(){
						editBeverage();
					}).append($("<i>").addClass("plus icon")))));

		db.collection("beverages").get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {

				$("<div>").addClass("item")
					.append($("<img>").addClass("ui avatar image").attr("src", images_url + images_d[doc.data().image].file))
					.append($("<div>").addClass("content")
						.append($("<div>").addClass("header").text(doc.data().name)))
					.prepend($("<div>").addClass("right floated content")
						.append($("<div>").addClass("ui tiny button").attr("data-id",doc.id).text("Editar").click(function(){
							editBeverage($(this).attr("data-id"));
						})))
					.appendTo("#drinksList");
			});
		});
	}else{
		printAccessControl();
	}
}

function editBeverage(b){

	if(a){
		if(b){
			var db = firebase.firestore();
			db.collection("beverages").doc(b).get().then(function(doc) {
				printBeverageForm(doc);
			});
		}else{
			printBeverageForm();
		}
	}else{
		printAccessControl();
	}
}

function printBeverageForm(doc){

	firebase.analytics().setCurrentScreen("BeverageForm");
	$("#main").empty()
		.append($("<div>").addClass("ui segment container")
			.append($("<form>").addClass("ui form")
				.append($("<div>").addClass("ui error message"))
				.append($("<input>").attr("type","hidden").attr("name","ddoc").val(doc?doc.id:""))
				.append($("<div>").addClass("field")
					.append($("<label>").text("Nombre"))
					.append($("<input>").attr("type","text").attr("name","dname").attr("placeholder","Nombre").val(doc?doc.data().name:"")))
				.append($("<div>").addClass("field")
					.append($("<label>").text("Precio"))
					.append($("<div>").addClass("ui right labeled input")
						.append($("<input>").attr("type","text").attr("name","dprice").attr("placeholder","Precio").val(doc?doc.data().price:""))
						.append($("<div>").addClass("ui label").text("€"))))
				.append($("<div>").addClass("field")
					.append($("<label>").text("Stock"))
					.append($("<div>").addClass("ui right labeled input")
						.append($("<input>").attr("type","text").attr("name","dstock").attr("placeholder","Stock").val(doc?doc.data().stock:""))
						.append($("<div>").addClass("ui label").text("uds."))))
				.append($("<div>").addClass("field")
					.append($("<label>").text("Categoría"))
					.append($("<select>").addClass("ui dropdown").attr("id","dcategory").attr("name","dcategory")
						.append($("<option>").val("").text("Selecciona categoría"))))						
				.append($("<div>").addClass("field")
					.append($("<label>").text("Imagen"))
					.append($("<label>").attr("id","selectedImage").text(""))
					.append($("<div>").addClass("ui dropdown selection")
						.append($("<input>").attr("type","hidden").attr("id","dimage").attr("name","dimage"))
						.append($("<div>").attr("id","selectedImage").addClass("text").text("Seleccionar imagen")
							.prepend($("<img>").addClass("ui avatar image")))
						.append($("<i>").addClass("dropdown icon"))
						.append($("<div>").addClass("menu"))))
				.append($("<div>").addClass("inline field")
					.append($("<div>").addClass("ui toggle checkbox")
						.append($("<input>").attr("type","checkbox").attr("name","dmixable").addClass("hidden"))
						.append($("<label>").text("Esta bebida se puede combinar con refrescos"))))
				.append($("<div>").addClass("ui center aligned container")
					.append($("<button>").addClass("ui labeled icon button").text("Volver").click(function(){
						console.log("vuelvo");
						manageBeverages();
						return false;
					}).append($("<i>").addClass("undo icon")))
					.append($("<button>").addClass("ui labeled icon button").text("Guardar").append($("<i>").addClass("save icon"))))));

	$('.dropdown.selection').dropdown({action: 'combo'});

	for(var i in images_d){
		$("<div>").addClass("item").attr("data-value",i).text(images_d[i].name)
			.prepend($("<img>").addClass("ui avatar image").attr("src",images_url + images_d[i].file))
			.appendTo($("#main .menu"));
	}

	for(var c in categories){
		var selected = doc.data().category == c?"selected":"data-notselected";
		$("<option>").val(c).text(categories[c]).attr(selected,selected).appendTo($("#dcategory"));
	}

	$('.ui.form').form({
    	fields: {
     		dname: {identifier:'dname', rules:[{type:'empty',prompt:'Introduce un nombre'}]},
     		dstock: {identifier:'dstock', rules:[{type:'empty',prompt:'Introduce el stock disponible'},{type:'integer',prompt:'El stock no es un número entero válido'}]},
     		dcategory: {identifier:'dcategory', rules:[{type:'empty',prompt:'Elige la categoría'}]},
     		dprice: {identifier:'dprice', rules:[{type:'empty',prompt:'Introduce el precio'},{type:'number',prompt:'El precio debe ser un número'}]},
     		dimage: {identifier:'dimage', rules:[{type:'empty',prompt:'Elige una imagen'}]}
    	}
  	});

	if(doc){
		$("#selectedImage").text(images_d[doc.data().image].name)
			.prepend($("<img>").addClass("ui avatar image").attr("src",images_url + images_d[doc.data().image].file))
		$("#dimage").val(doc.data().image);
	}

	$("form").submit(function(e){
		e.preventDefault();
		if( !$("div.field").hasClass("error")) {
			var f = $('.ui.form').form('get values');
			var db = firebase.firestore();
			var data = {
					name: f[0].dname,
					price: f[0].dprice,
					stock: f[0].dstock,
					category: f[0].dcategory,
					image: f[0].dimage
				};
			if(f[0].ddoc){
				db.collection("beverages").doc(f[0].ddoc).update(data).then(function(docRef) {
					manageBeverages();
				}).catch(function(error) {
					console.error("Error adding document: ", error);
				});
			}else{
				db.collection("beverages").add(data).then(function(docRef) {
					manageBeverages();
				}).catch(function(error) {
					console.error("Error adding document: ", error);
				});
			}
		}
	});
}

function manageUsers(){

	$(".menu .item").removeClass("active");
	$("#amusers").addClass("active");

	if(a){
		firebase.analytics().setCurrentScreen("Users");
		var db = firebase.firestore();
		$("#main").empty()
			.append($("<h2>").text("Gestionar usuarios").addClass("ui center aligned header"))
			.append($("<div>").addClass("ui segment container")
				.append($("<div>").attr("id","usersList").addClass("ui middle aligned divided list"))
				.append($("<div>").addClass("ui center aligned container")
					.append($("<button>").addClass("ui labeled icon button").text("Añadir usuario").click(function(){
						editUser();
					})
						.append($("<i>").addClass("plus icon")))));

		db.collection("users").get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {

				$("<div>").addClass("item")
					.append($("<img>").addClass("ui avatar image " + doc.id).attr("src",images_url + user_default))
					.append($("<div>").addClass("content")
						.append($("<div>").addClass("header").text(doc.data().name?doc.data().name:doc.data().email)))
					.prepend($("<div>").addClass("right floated content")
						.append($("<div>").addClass("ui tiny button").attr("data-id",doc.id).text("Editar").click(function(){
							editUser($(this).attr("data-id"));
						})))
					.appendTo("#usersList");
			});
			printAvatarsAndNames();
		});
	}else{
		printAccessControl();
	}
}

function editUser(u){
	if(a){
		if(u){
			var db = firebase.firestore();
			db.collection("users").doc(u).get().then(function(doc) {
				printUserForm(doc);
			});
		}else{
			printUserForm();
		}
	}else{
		printAccessControl();
	}
}

function printUserForm(doc){
	firebase.analytics().setCurrentScreen("UserForm");
	$("#main").empty()
		.append($("<div>").addClass("ui segment container")
			.append($("<form>").addClass("ui form")
				.append($("<div>").addClass("ui error message"))
				.append($("<input>").attr("type","hidden").attr("name","udoc").val(doc?doc.id:""))
				.append($("<div>").addClass("field")
					.append($("<label>").text("Email"))
					.append($("<input>").attr("type","text").attr("name","uemail").attr("placeholder","Email").val(doc?doc.data().email:"")))
				.append($("<div>").addClass("inline field")
					.append($("<div>").addClass("ui toggle checkbox")
						.append($("<input>").attr("type","checkbox").attr("name","uadmin").addClass("hidden"))
						.append($("<label>").text("Administrador"))))
				.append($("<div>").addClass("ui center aligned container")
					.append($("<button>").addClass("ui button").text("Guardar")))));

	if(doc) if(doc.data().admin) $('.ui.checkbox input').attr("checked","checked");
	$('.ui.checkbox').checkbox();
	$('.ui.form').form({
    	fields: {
     		uemail: {identifier:'uemail', rules:[{type:'empty',prompt:'Introduce el email'},{type:'email',prompt:'El email no tiene formato correcto'}]}
    	}
  	});

	$("form").submit(function(e){
		e.preventDefault();
		if( !$("div.field").hasClass("error")) {
			var f = $('.ui.form').form('get values');
			var db = firebase.firestore();
			if(f[0].udoc){
				db.collection("users").doc(f[0].udoc).update({
					email: f[0].uemail,
					admin: (f[0].uadmin == "on")
				}).then(function(docRef) {
					manageUsers();
				}).catch(function(error) {
					console.error("Error adding document: ", error);
				});
			}else{
				var [userid,domain] = f[0].uemail.split("@");
				db.collection("users").doc(userid).set({
					email: f[0].uemail,
					admin: (f[0].uadmin == "on")
				}).then(function(docRef) {
					manageUsers();
				}).catch(function(error) {
					console.error("Error adding document: ", error);
				});
			}
		}
	});
}