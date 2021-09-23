const fs = require('fs');
const substrFinder = require("./substrFinder.js")
let rawdata = fs.readFileSync("default-cards-20210722210331.json");
let jsonIn = JSON.parse(rawdata);
let jsonOut = {total:0,name:{},type_line:{},oracle_text:{},flavor_text:{},artist:{}};
let usedNames = new Set();

var ct = 0;

for(card of jsonIn) {
	if(!usedNames.has(card.name)) {
		usedNames.add(card.name);
		ct++;
		
		nmstrs = substrFinder.allSubstrsSpaced(card.name);
		for(str of nmstrs) {
			if(jsonOut.name[str] > 0) {
				jsonOut.name[str]++;
			} else {
				jsonOut.name[str] = 1;
			}
		}
		
		artstrs = substrFinder.allSubstrsSpaced(card.artist);
		for(str of artstrs) {
			if(jsonOut.artist[str] > 0) {
				jsonOut.artist[str]++;
			} else {
				jsonOut.artist[str] = 1;
			}
		}
		
		tplnstrs = substrFinder.allSubstrs(card.type_line);
		for(str of tplnstrs) {
			if(jsonOut.type_line[str] > 0) {
				jsonOut.type_line[str]++;
			} else {
				jsonOut.type_line[str] = 1;
			}
		}
		
		orcstrs = substrFinder.allSubstrs(card.oracle_text);
		for(str of orcstrs) {
			if(jsonOut.oracle_text[str] > 0) {
				jsonOut.oracle_text[str]++;
			} else {
				jsonOut.oracle_text[str] = 1;
			}
		}
		
		ftstrs = substrFinder.allSubstrs(card.flavor_text);
		for(str of ftstrs) {
			if(jsonOut.flavor_text[str] > 0) {
				jsonOut.flavor_text[str]++;
			} else {
				jsonOut.flavor_text[str] = 1;
			}
		}
	}
}

console.log(usedNames.size);
console.log(ct);

jsonOut.total = usedNames.size;

fs.writeFileSync("mtg-cards-texts-agglutinated.json", JSON.stringify(jsonOut));