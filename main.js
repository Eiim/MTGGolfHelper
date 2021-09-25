const nonLatin = /[^\u0000-\u007f]/;
var jsonIn;
var total;
fetch("mtg-cards-texts-agglutinated.json")
	.then(response => response.json())
	.then(json => {jsonIn = json; total = jsonIn.total});

document.addEventListener("DOMContentLoaded", function(e) {
	document.getElementById("go").addEventListener("click", async function(e) {
		resetAll();
		
		var c1NmF = document.getElementById("c1").value;
		var c2NmF = document.getElementById("c2").value;
		console.log(c1NmF, c2NmF);
		
		var c1, c2;
		
		await fetch("https://api.scryfall.com/cards/named?fuzzy="+c1NmF)
		.then(response => response.json())
		.then(json => {c1 = json});
		await fetch("https://api.scryfall.com/cards/named?fuzzy="+c2NmF)
		.then(response => response.json())
		.then(json => {c2 = json});
		
		var missingCard = false;
		if(c1.object != "card") {
			console.log(c1.details);
			document.getElementById("err").innerHTML += "<p>"+c1.details+"</p>";
			missingCard = true;
		}
		if(c2.object != "card") {
			console.log(c2.details);
			document.getElementById("err").innerHTML += "<p>"+c2.details+"</p>";
			missingCard = true;
		}
		if(missingCard){return}
		
		document.getElementById("cardImg1").src = c1.image_uris.normal;
		document.getElementById("cardImg2").src = c2.image_uris.normal;
		document.getElementById("cardName1").textContent = c1.name;
		document.getElementById("cardName2").textContent = c2.name;
	});
});

function resetAll() {
	document.getElementById("err").innerHTML = "";
	
	document.getElementById("cardImg1").src = "";
	document.getElementById("cardImg2").src = "";
	document.getElementById("cardName1").textContent = "";
	document.getElementById("cardName2").textContent = "";
}