/* ByteIterator Tester
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Leonardone @ NEETSDKASU
 */


var ByteIteratorTester = new function() {
	
	var T = new TesterUtilJS(this, 'ByteIteratorTester');
	
	var EMPTYITER, ByteArrayByteIterator, ByteStringByteIterator, NumberArrayByteIterator;
	
	T.setBindFunc(function(x) {
		EMPTYITER = x['EMPTYITER'];
		ByteArrayByteIterator = x['ByteArrayByteIterator'];
		ByteStringByteIterator = x['ByteStringByteIterator'];
		NumberArrayByteIterator = x['NumberArrayByteIterator'];
	});
};
