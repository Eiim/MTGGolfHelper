const fs = require('fs');
const readline = require("readline");
const https = require('https');
const substrFinder = require("./substrFinder.js")
let rawdata = fs.readFileSync("mtg-cards-texts-agglutinated.json");
let jsonIn = JSON.parse(rawdata);
let total = jsonIn.total;

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
	nmstrs = [...c1strs].filter(x => c2strs.has(x));
	c1strs = substrFinder.allSubstrsSpaced(c1.artist);
	c2strs = substrFinder.allSubstrsSpaced(c2.artist);
	artstrs = [...c1strs].filter(x => c2strs.has(x));
	c1strs = substrFinder.allSubstrs(c1.type_line);
	c2strs = substrFinder.allSubstrs(c2.type_line);
	tplnstrs = [...c1strs].filter(x => c2strs.has(x));
	c1strs = substrFinder.allSubstrs(c1.oracle_text);
	c2strs = substrFinder.allSubstrs(c2.oracle_text);
	ostrs = [...c1strs].filter(x => c2strs.has(x));
	c1strs = substrFinder.allSubstrs(c1.flavor_text);
	c2strs = substrFinder.allSubstrs(c2.flavor_text);
	ftstrs = [...c1strs].filter(x => c2strs.has(x));
	
	console.log("\n\u001b[33;1m\u001b[1mAll Substrings:\u001b[0m");
	console.log("\u001b[36;1mName:\u001b[0m "+nmstrs);
	console.log("\u001b[36;1mOracle Text:\u001b[0m "+ostrs);
	console.log("\u001b[36;1mFlavor Text:\u001b[0m "+ftstrs);
	console.log("\u001b[36;1mType Line:\u001b[0m "+tplnstrs);
	console.log("\u001b[36;1mArtist:\u001b[0m "+artstrs);
	
	console.log("\n\u001b[33;1m\u001b[1mMost effective substrings:\u001b[0m");
	
	nameEffs = [];
	for(str of nmstrs) {
		var ct = jsonIn.name[str]
		ct = (ct > 0 ? ct : 0);
		nameEffs.push([str,(total-ct)/total]);
	}
	nameEffs.sort((a,b) => {return b[1]-a[1]});
	outStr = "\u001b[36;1mName:\u001b[0m";
	for(var i = 0; i < 5 && i < nameEffs.length; i++) {
		outStr += "\n"+nameEffs[i][0]+": "+Number.parseFloat(100*nameEffs[i][1]).toPrecision(4)+"%";
	}
	console.log(outStr);
	
	oEffs = [];
	for(str of ostrs) {
		var ct = jsonIn.oracle_text[str]
		ct = (ct > 0 ? ct : 0);
		oEffs.push([str,(total-ct)/total]);
	}
	oEffs.sort((a,b) => {return b[1]-a[1]});
	outStr = "\u001b[36;1mOracle Text:\u001b[0m";
	for(var i = 0; i < 5 && i < oEffs.length; i++) {
		outStr += "\n"+oEffs[i][0]+": "+Number.parseFloat(100*oEffs[i][1]).toPrecision(4)+"%";
	}
	console.log(outStr);
	
	ftEffs = [];
	for(str of ftstrs) {
		var ct = jsonIn.flavor_text[str]
		ct = (ct > 0 ? ct : 0);
		ftEffs.push([str,(total-ct)/total]);
	}
	ftEffs.sort((a,b) => {return b[1]-a[1]});
	outStr = "\u001b[36;1mFlavor Text:\u001b[0m";
	for(var i = 0; i < 5 && i < ftEffs.length; i++) {
		outStr += "\n"+ftEffs[i][0]+": "+Number.parseFloat(100*ftEffs[i][1]).toPrecision(4)+"%";
	}
	console.log(outStr);
	
	tplnEffs = [];
	for(str of tplnstrs) {
		var ct = jsonIn.type_line[str]
		ct = (ct > 0 ? ct : 0);
		tplnEffs.push([str,(total-ct)/total]);
	}
	tplnEffs.sort((a,b) => {return b[1]-a[1]});
	outStr = "\u001b[36;1mType Line:\u001b[0m";
	for(var i = 0; i < 5 && i < tplnEffs.length; i++) {
		outStr += "\n"+tplnEffs[i][0]+": "+Number.parseFloat(100*tplnEffs[i][1]).toPrecision(4)+"%";
	}
	console.log(outStr);
	
	artEffs = [];
	for(str of artstrs) {
		var ct = jsonIn.artist[str]
		ct = (ct > 0 ? ct : 0);
		artEffs.push([str,(total-ct)/total]);
	}
	artEffs.sort((a,b) => {return b[1]-a[1]});
	outStr = "\u001b[36;1mArtist:\u001b[0m";
	for(var i = 0; i < 5 && i < artEffs.length; i++) {
		outStr += "\n"+artEffs[i][0]+": "+Number.parseFloat(100*artEffs[i][1]).toPrecision(4)+"%";
	}
	console.log(outStr);
	
	console.log("\n\u001b[33;1m\u001b[1mMost efficient substrings:\u001b[0m");
	var nonLatin = /[^\u0000-\u007f]/;
	
	for(var i = 0; i < nameEffs.length; i++) {
		len = nameEffs[i][0].length;
		if(nameEffs[i][0].includes(" ") || nameEffs[i][0].includes("\"") || nameEffs[i][0].includes("'") || nameEffs == "or" || nameEffs == "and" || nonLatin.test(nameEffs[i][0])) {
			len += 2
		}
		nameEffs[i][1] = 1-Math.pow(1-nameEffs[i][1], 1/len);
	}
	nameEffs.sort((a,b) => {return b[1]-a[1]});
	outStr = "\u001b[36;1mName:\u001b[0m";
	for(var i = 0; i < 5 && i < nameEffs.length; i++) {
		outStr += "\n"+nameEffs[i][0]+": "+Number.parseFloat(100*nameEffs[i][1]).toPrecision(4)+"%";
	}
	console.log(outStr);
	
	for(var i = 0; i < oEffs.length; i++) {
		len = oEffs[i][0].length + 2;
		if(oEffs[i][0].includes(" ") || nonLatin.test(oEffs[i][0])) {
			len += 2
		}
		oEffs[i][1] = 1-Math.pow(1-oEffs[i][1], 1/len);
	}
	oEffs.sort((a,b) => {return b[1]-a[1]});
	outStr = "\u001b[36;1mOracle Text:\u001b[0m";
	for(var i = 0; i < 5 && i < oEffs.length; i++) {
		outStr += "\n"+oEffs[i][0]+": "+Number.parseFloat(100*oEffs[i][1]).toPrecision(4)+"%";
	}
	console.log(outStr);
	
	for(var i = 0; i < ftEffs.length; i++) {
		len = ftEffs[i][0].length + 3;
		if(ftEffs[i][0].includes(" ") || nonLatin.test(ftEffs[i][0])) {
			len += 2
		}
		ftEffs[i][1] = 1-Math.pow(1-ftEffs[i][1], 1/len);
	}
	ftEffs.sort((a,b) => {return b[1]-a[1]});
	outStr = "\u001b[36;1mFlavor Text:\u001b[0m";
	for(var i = 0; i < 5 && i < ftEffs.length; i++) {
		outStr += "\n"+ftEffs[i][0]+": "+Number.parseFloat(100*ftEffs[i][1]).toPrecision(4)+"%";
	}
	console.log(outStr);
	
	for(var i = 0; i < tplnEffs.length; i++) {
		len = tplnEffs[i][0].length + 2;
		if(tplnEffs[i][0].includes(" ") || nonLatin.test(tplnEffs[i][0])) {
			len += 2
		}
		tplnEffs[i][1] = 1-Math.pow(1-tplnEffs[i][1], 1/len);
	}
	tplnEffs.sort((a,b) => {return b[1]-a[1]});
	outStr = "\u001b[36;1mType Line:\u001b[0m";
	for(var i = 0; i < 5 && i < tplnEffs.length; i++) {
		outStr += "\n"+tplnEffs[i][0]+": "+Number.parseFloat(100*tplnEffs[i][1]).toPrecision(4)+"%";
	}
	console.log(outStr);
	
	for(var i = 0; i < artEffs.length; i++) {
		len = artEffs[i][0].length + 2;
		if(artEffs[i][0].includes(" ") || nonLatin.test(artEffs[i][0])) {
			len += 2
		}
		artEffs[i][1] = 1-Math.pow(1-artEffs[i][1], 1/len);
	}
	artEffs.sort((a,b) => {return b[1]-a[1]});
	outStr = "\u001b[36;1mArtist:\u001b[0m";
	for(var i = 0; i < 5 && i < artEffs.length; i++) {
		outStr += "\n"+artEffs[i][0]+": "+Number.parseFloat(100*artEffs[i][1]).toPrecision(4)+"%";
	}
	console.log(outStr);
	
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