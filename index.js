const sw = require('./smithWaterman.js')
const nw = require('./needlemanWunsch.js')

if (process.argv[1] == __filename) {
		  const lArray = "For example, thats a first array of objects. We can align a second array!".split(' ')
		  const rArray = "Thats a second array of objects.".split(' ')
		 
		  const leftObjectArray = lArray.map(ele => {
					 return {content: ele}
		  })

		  const rightObjectArray = rArray.map(ele => {
					 return {content: ele}
		  })

		  console.log('Needleman-Wunsch result:')
		  console.log(nw(leftObjectArray,rightObjectArray))
		  console.log('Smith-Waterman result:')
		  console.log(sw(leftObjectArray,rightObjectArray))
}
