/* An adaption of the Smith-Waterman-Algorithm for arrays of objects
 * adapted from the Python Code of Slaviana Pavlovich (https://github.com/slavianap/Smith-Waterman-Algorithm)
 * 
 * Copyright (C) 2022  Nikolaus Altmann
 *
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

//Smith Waterman local alignment

// Assigning the constants for the scores
var Score = {MATCH:1, MISMATCH:-1, GAP:-1}

// Assigning the constant values for the traceback
var Trace = {STOP:0, LEFT:1, UP:2, DIAGONAL:3}

// Implementing the Smith Waterman local alignment
function smithWaterman(seq1, seq2){

	//Generating the empty matrices for storing scores and tracing
	var row = seq1.length + 1
    	var col = seq2.length + 1
  
	// Doesn't work!!
	//var matrix = Array(row).fill(Array(col).fill(1))
	//var tracing_matrix = Array(row).fill(Array(col).fill(0))
	
	var matrix = {}
	var tracing_matrix = {}
  
	for(var i=0; i<row; i++) {
		matrix[i] = {0:0};
		tracing_matrix[i] = {0:0};
		for(var j=1; j<col; j++) {
			matrix[i][j] = 0
			tracing_matrix[i][j] = 0;
		}
	}

	//Initialising the variables to find the highest scoring cell
	var max_score = -1
	var max_index = [-1, -1]
   
	//Calculating the scores for all cells in the matrix
	var i,j
	for(i=1; i<row; i++){
		for(j=1; j<col; j++){
	
			// Calculating the diagonal score (match score)
			//var match_value = (seq1[i - 1].content == seq2[j - 1].content) ? Score.MATCH : Score.MISMATCH;
			var match_value = isEqual(seq1[i - 1].content,seq2[j - 1].content) ? Score.MATCH : Score.MISMATCH;
			var diagonal_score = matrix[i - 1][j - 1] + match_value
			
			// Calculating the vertical gap score
			var vertical_score = matrix[i - 1][j] + Score.GAP 

			// Calculating the horizontal gap score
			var horizontal_score = matrix[i][j - 1] + Score.GAP
            
			// Taking the highest score 
			matrix[i][j] = Math.max(0, diagonal_score, vertical_score, horizontal_score)
			
			// Tracking where the cell's value is coming from    
			if(matrix[i][j] == 0){
				tracing_matrix[i][j] = Trace.STOP
			}else if(matrix[i][j] == horizontal_score){
				tracing_matrix[i][j] = Trace.LEFT
			}else if(matrix[i][j] == vertical_score){
				tracing_matrix[i][j] = Trace.UP
			}else if(matrix[i][j] == diagonal_score){
				tracing_matrix[i][j] = Trace.DIAGONAL
			} 
               		
			
			// Tracking the cell with the maximum score
		
			if(matrix[i][j] >= max_score){
				max_index = [i,j]
				max_score = matrix[i][j]
			}
			
		}
	}


	// Initialising the variables for tracing
	var aligned_seq1 = []
	var aligned_seq2 = []
	var current_aligned_seq1 = {}
	var current_aligned_seq2 = {}
	
	var max_i = max_index[0]
	var max_j = max_index[1]
		
	//Tracing and computing the pathway with the local alignment
	
	while(tracing_matrix[max_i][max_j] != Trace.STOP){
	
		if(tracing_matrix[max_i][max_j] == Trace.DIAGONAL){
			current_aligned_seq1 = seq1[max_i - 1]
			current_aligned_seq2 = seq2[max_j - 1]
			max_i = max_i - 1
			max_j = max_j - 1
		}else if(tracing_matrix[max_i][max_j] == Trace.UP){
			current_aligned_seq1 = seq1[max_i - 1]
			current_aligned_seq2 = {content:'_EMPTY_',confidence:1}
			max_i = max_i - 1
		}else if(tracing_matrix[max_i][max_j] == Trace.LEFT){
			current_aligned_seq1 = {content:'_EMPTY_',confidence:1}
			current_aligned_seq2 = seq2[max_j - 1]
			max_j = max_j - 1
		}
	
		aligned_seq1.push(current_aligned_seq1)
		aligned_seq2.push(current_aligned_seq2)
	}
	
	// Reversing the order of the sequences
	aligned_seq1 =  aligned_seq1.reverse();
	aligned_seq2 = aligned_seq2.reverse();
	return [aligned_seq1, aligned_seq2]
	
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

module.exports = smithWaterman;
