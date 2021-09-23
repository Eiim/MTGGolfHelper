module.exports = {
	allSubstrsSpaced: function (name) {
		if(name == undefined || name == null) {return new Set()}
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
		return new Set(a);
	},

	allSubstrs: function (name) {
		if(name == undefined || name == null) {return new Set()}
		strL = name.toLowerCase();
		a = [];
		for(len = 1; len <=4; len++) {
			for(i = 0; i <= strL.length-len; i++) {
				s = strL.substring(i, i+len);
			if(s.length > 0) {a.push(s)}
			}
		}
		return new Set(a);
	}
};