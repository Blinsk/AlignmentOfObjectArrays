/*
 * An adaption of the Needleman-Wunsch-Algorithm for arrays of objects
 * adapted from the code of Shin Suzuki (https://gist.github.com/shinout/f19da7720d130f3925ac)
 *
 * Copyright (C) 2022  Nikolaus Altmann
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * */

const UP   = 1;
const LEFT = 2;
const UL   = 4;

function nw(s1, s2) {
  op = {};
  const G = op.G || 2;
  const P = op.P || 1;
  const M = op.M || -1;
  
  var mat   = {};
  var direc = {};

  // initialization
  for(var i=0; i<s1.length+1; i++) {
    mat[i] = {0:0};
    direc[i] = {0:[]};
    for(var j=1; j<s2.length+1; j++) {
      mat[i][j] = (i == 0) 
        ? 0
        : isEqual(s1[i-1].content,s2[j-1].content) ? P : M
      direc[i][j] = [];
    }
  }

  // calculate each value
  for(var i=0; i<s1.length+1; i++) {
    for(var j=0; j<s2.length+1; j++) {
      var newval = (i == 0 || j == 0)
          ? -G * (i + j)
          : Math.max(mat[i-1][j] - G, mat[i-1][j-1] + mat[i][j], mat[i][j-1] -G);

      if (i > 0 && j > 0) {
        if( newval == mat[i-1][j] - G) direc[i][j].push(UP);
        if( newval == mat[i][j-1] - G) direc[i][j].push(LEFT);
        if( newval == mat[i-1][j-1] + mat[i][j]) direc[i][j].push(UL);
      }
      else {
        direc[i][j].push((j == 0) ? UP : LEFT);
      }
      mat[i][j] = newval;
    }
  }

  // get result
  var chars = [[],[]];
  var I = s1.length;
  var J = s2.length;
  const max = Math.max(I, J);
  while(I > 0 || J > 0) {
    switch (direc[I][J][0]) {
      case UP:
        I--;
	s1[I].nwType = 'UP';	    
        chars[0].push(s1[I]);
        chars[1].push({content : '-', nwType: 'UP'});
        break;
      case LEFT:
        J--;
	s2[J].nwType = 'LEFT';	    
        chars[0].push({content : '-', nwType: 'LEFT'});
        chars[1].push(s2[J]);
        break;
      case UL:
        I--;
        J--;
	s1[I].nwType = 'UL';	    
	s2[J].nwType = 'UL';	    
        chars[0].push(s1[I]);
        chars[1].push(s2[J]);
        break;
       default: break;
    }
  }
	return [chars[0].reverse(),chars[1].reverse()]
}

function isEqual(a,b){
		  // This is trivial, but you could make your own:)
        // For example:
        // String Similarity
        // Levenshtein Distance
		  
		  if(a == b){
					 return 1.0
		  }else{
					 return 0.0
		  }
}

module.exports = nw;
