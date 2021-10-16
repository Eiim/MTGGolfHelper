const fs = require('fs');
const readline = require("readline");
const https = require('https');
const substrFinder = require("./substrFinder.js")
let rawdata = fs.readFileSync("mtg-cards-texts-agglutinated.json");
let jsonIn = JSON.parse(rawdata);
let total = jsonIn.total;
const nonLatin = /[^\u0000-\u007f]/;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Card 1: ", function(c1) {
    rl.question("Card 2: ", function(c2) {
        findSimilar(c1,c2);
        rl.close();
    });
});

async function findSimilar(c1NmF,c2NmF) {
	const c1 = await getCard(c1NmF);
	const c2 = await getCard(c2NmF);
	
	var missingCard = false;
	if(c1.object != "card") {
		console.log("Could not find card \""+c1NmF+"\"!");
		missingCard = true;
	}
	if(c2.object != "card") {
		console.log("Could not find card \""+c2NmF+"\"!");
		missingCard = true;
	}
	if(missingCard){return}
	
	let c1strs,c2strs;
	
	c1strs = substrFinder.allSubstrsSpaced(c1.name);
	c2strs = substrFinder.allSubstrsSpaced(c2.name);
	nmstrs = Object.keys(jsonIn["name"]).filter(x => !c1strs.has(x) && !c2strs.has(x));
	c1strs = substrFinder.allSubstrsSpaced(c1.artist);
	c2strs = substrFinder.allSubstrsSpaced(c2.artist);
	artstrs = Object.keys(jsonIn["artist"]).filter(x => !c1strs.has(x) && !c2strs.has(x));
	c1strs = substrFinder.allSubstrs(c1.type_line);
	c2strs = substrFinder.allSubstrs(c2.type_line);
	tplnstrs = Object.keys(jsonIn["type_line"]).filter(x => !c1strs.has(x) && !c2strs.has(x));
	
	let c1ot, c2ot;
	if(c1.card_faces != undefined) {
		c1ot = c1.card_faces.map(x => {return x.oracle_text}).join(" ");
	} else {
		c1ot = c1.oracle_text;
	}
	if(c2.card_faces != undefined) {
		c2ot = c2.card_faces.map(x => {return x.oracle_text}).join(" ");
	} else {
		c2ot = c2.oracle_text;
	}
	c1strs = substrFinder.allSubstrs(c1ot);
	c2strs = substrFinder.allSubstrs(c2ot);
	
	ostrs = Object.keys(jsonIn["oracle_text"]).filter(x => !c1strs.has(x) && !c2strs.has(x));
	c1strs = substrFinder.allSubstrs(c1.flavor_text);
	c2strs = substrFinder.allSubstrs(c2.flavor_text);
	ftstrs = Object.keys(jsonIn["flavor_text"]).filter(x => !c1strs.has(x) && !c2strs.has(x));
	
	/*
	console.log("\n\u001b[33;1m\u001b[1mAll Substrings:\u001b[0m");
	console.log("\u001b[36;1mName:\u001b[0m "+nmstrs);
	console.log("\u001b[36;1mOracle Text:\u001b[0m "+ostrs);
	console.log("\u001b[36;1mFlavor Text:\u001b[0m "+ftstrs);
	console.log("\u001b[36;1mType Line:\u001b[0m "+tplnstrs);
	console.log("\u001b[36;1mArtist:\u001b[0m "+artstrs);
	*/
	
	console.log("\n\u001b[33;1m\u001b[1mMost effective substrings:\u001b[0m");
	
	nameEffs = effectiveness(nmstrs, "Name", "name");
	oEffs = effectiveness(ostrs, "Oracle Text", "oracle_text");
	ftEffs = effectiveness(ftstrs, "Flavor Text", "flavor_text");
	tplnEffs = effectiveness(tplnstrs, "Type Line", "type_line");
	artEffs = effectiveness(artstrs, "Artist", "artist");
	
	console.log("\n\u001b[33;1m\u001b[1mMost efficient substrings:\u001b[0m");
	
	for(var i = 0; i < nameEffs.length; i++) {
		len = nameEffs[i][0].length +1;
		if(nameEffs[i][0].includes(" ") || nameEffs[i][0] == "or" || nameEffs[i][0] == "and") {
			len += 2
		}
		nameEffs[i][1] = 1-Math.pow(1-nameEffs[i][1], 1/len);
	}
	nameEffs.sort((a,b) => {return b[1]-a[1]});
	console.log("Note: using slightly less accurate name efficiency calculation for drastically improved runtime");
	outStr = "\u001b[36;1mName:\u001b[0m";
	for(var i = 0; i < 5 && i < nameEffs.length; i++) {
		outStr += "\n"+nameEffs[i][0]+": "+Number.parseFloat(100*nameEffs[i][1]).toPrecision(4)+"%";
	}
	console.log(outStr);
	
	oEffs = efficiency(oEffs, "Oracle Text", 3);
	ftEffs = efficiency(ftEffs, "Flavor Text", 4);
	tplnEffs = efficiency(tplnEffs, "Typle Line", 3);
	artEffs = efficiency(artEffs, "Artist", 3);
	
	allEffs = [];
	for(var i = 0; i < nameEffs.length; i++) {
		allEffs.push(["Name", nameEffs[i][0], nameEffs[i][1]]);
	}
	for(var i = 0; i < oEffs.length; i++) {
		allEffs.push(["Oracle Text", oEffs[i][0], oEffs[i][1]]);
	}
	for(var i = 0; i < ftEffs.length; i++) {
		allEffs.push(["Flavor Text", ftEffs[i][0], ftEffs[i][1]]);
	}
	for(var i = 0; i < tplnEffs.length; i++) {
		allEffs.push(["Type Line", tplnEffs[i][0], tplnEffs[i][1]]);
	}
	for(var i = 0; i < artEffs.length; i++) {
		allEffs.push(["Artist", artEffs[i][0], artEffs[i][1]]);
	}
	allEffs.sort((a,b) => {return b[2]-a[2]});
	console.log("\n\u001b[33;1m\u001b[1mMost efficient overall:\u001b[0m");
	for(var i = 0; i < allEffs.length && i < 10; i++) {
		console.log("\u001b[36;1m"+allEffs[i][0]+"\u001b[0m: "+allEffs[i][1]+": "+Number.parseFloat(100*allEffs[i][2]).toPrecision(4)+"%");
	}
	
	console.log("\u001b[0m");
}

async function getCard(cardName) {
	return new Promise(resolve => {
		https.get('https://api.scryfall.com/cards/named?fuzzy='+cardName,(res) => {
			let body = "";

			res.on("data", (chunk) => {
				body += chunk;
			});

			res.on("end", () => {
				try {
					let json = JSON.parse(body);
					resolve(json);
				} catch (error) {
					console.error(error.message);
				};
			});

		}).on("error", (error) => {
			console.error(error.message);
		});
	});
}

function effectiveness(strs, cat, JSONcat) {
	effs = [];
	for(str of strs) {
		var ct = jsonIn[JSONcat][str];
		ct = (ct > 0 ? ct : 0);
		effs.push([str,1-((total-ct)/total)]);
	}
	effs.sort((a,b) => {return b[1]-a[1]});
	outStr = "\u001b[36;1m"+cat+":\u001b[0m";
	for(var i = 0; i < 5 && i < effs.length; i++) {
		outStr += "\n"+effs[i][0]+": "+Number.parseFloat(100*effs[i][1]).toPrecision(4)+"%";
	}
	console.log(outStr)
	return effs;
}

function efficiency(effs, cat, baseLen) {
	for(var i = 0; i < effs.length; i++) {
		len = effs[i][0].length + baseLen;
		if(effs[i][0].includes(" ") || nonLatin.test(effs[i][0])) {
			len += 2
		}
		effs[i][1] = 1-Math.pow(1-effs[i][1], 1/len);
	}
	effs.sort((a,b) => {return b[1]-a[1]});
	outStr = "\u001b[36;1m"+cat+":\u001b[0m";
	for(var i = 0; i < 5 && i < effs.length; i++) {
		outStr += "\n"+effs[i][0]+": "+Number.parseFloat(100*effs[i][1]).toPrecision(4)+"%";
	}
	console.log(outStr);
	return effs;
}