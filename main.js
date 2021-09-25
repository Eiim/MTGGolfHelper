const nonLatin = /[^\u0000-\u007f]/;
fetch("mtg-cards-texts-agglutinated.json")
	.then(response => response.json())
	.then(json => {const jsonIn = json; const total = jsonin.total});

document.addEventListener("DOMContentLoaded", function(e) {
	document.getElementById("go").addEventListener("click", async function(e) {
		var c1NmF = document.getElementById("c1").value;
		var c2NmF = document.getElementById("c2").value;
		console.log(c1NmF, c2NmF);
		
		await fetch("https://api.scryfall.com/cards/named?fuzzy="+c1NmF)
		.then(response => response.json())
		.then(json => {var c1 = json});
		await fetch("https://api.scryfall.com/cards/named?fuzzy="+c2NmF)
		.then(response => response.json())
		.then(json => {var c1 = json});
		
		var missingCard = false;
		if(c1.object != "card") {
			console.log(c1.details);
			missingCard = true;
		}
		if(c2.object != "card") {
			console.log(c2.details);
			missingCard = true;
		}
		if(missingCard){return}
	});
});