const fs = require('fs');
let rawdata = fs.readFileSync("mtg-cards-texts.json");
let jsonIn = JSON.parse(rawdata);
let jsonOut = {total:0,name:{},type_line:{},oracle_text:{},flavor_text:{},artist:{}};
let usedNames = new Set();

var ct = 0;

for(card of jsonIn) {
	if(!usedNames.has(card.name)) {
		usedNames.add(card.name);
		ct++;
		
		nmstrs = allSubstrsSpaced(card.name);
		for(str of nmstrs) {
			if(jsonOut.name[str] > 0) {
				jsonOut.name[str]++;
			} else {
				jsonOut.name[str] = 1;
			}
		}
		
		artstrs = allSubstrsSpaced(card.artist);
		for(str of artstrs) {
			if(jsonOut.artist[str] > 0) {
				jsonOut.artist[str]++;
			} else {
				jsonOut.artist[str] = 1;
			}
		}
		
		tplnstrs = allSubstrs(card.type_line);
		for(str of tplnstrs) {
			if(jsonOut.type_line[str] > 0) {
				jsonOut.type_line[str]++;
			} else {
				jsonOut.type_line[str] = 1;
			}
		}
		
		orcstrs = allSubstrs(card.oracle_text);
		for(str of orcstrs) {
			if(jsonOut.oracle_text[str] > 0) {
				jsonOut.oracle_text[str]++;
			} else {
				jsonOut.oracle_text[str] = 1;
			}
		}
		
		ftstrs = allSubstrs(card.flavor_text);
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

function allSubstrsSpaced(name) {
  if(name == undefined || name == null) {return []}
  strL = name.toLowerCase();
  a = [];
  for(len = 1; len <=4; len++) {
    for(i = 0; i <= strL.length-len; i++) {
	  s = strL.substring(i, i+len);
	  if(s.length > 0) {a.push(s)}
    }
  }
  strL = strL.replace(/ /g, "").replace(/,/g, "").replace(/-/g, "").replace(/:/g,"").replace(/'/g,"").replace(/\\/g, "").replace(/\//g, "").replace(/!/g, "").replace(/—/g, "");	
  for(len = 1; len <=4; len++) {
    for(i = 0; i <= strL.length-len; i++) {
      s = strL.substring(i, i+len);
	  if(s.length > 0) {a.push(s)}
    }
  }
  return [...new Set(a)];
}

function allSubstrs(name) {
  if(name == undefined || name == null) {return []}
  strL = name.toLowerCase();
  a = [];
  for(len = 1; len <=4; len++) {
    for(i = 0; i <= strL.length-len; i++) {
      s = strL.substring(i, i+len);
	  if(s.length > 0) {a.push(s)}
    }
  }
  return [...new Set(a)];
}