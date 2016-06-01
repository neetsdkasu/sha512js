/* ByteIterator Tester
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Leonardone @ NEETSDKASU
 */


var ByteIteratorTester = new function() {
	
	var T = new TesterUtilJS(this, 'ByteIteratorTester');
	var log = T.log;
	
	var EMPTYITER, ByteArrayByteIterator, ByteStringByteIterator, NumberArrayByteIterator;
	var common_fields = ['hasNext', 'next', 'size'];
	
	T.setBindFunc(function(x) {
		EMPTYITER = x['EMPTYITER'];
		ByteArrayByteIterator = x['ByteArrayByteIterator'];
		ByteStringByteIterator = x['ByteStringByteIterator'];
		NumberArrayByteIterator = x['NumberArrayByteIterator'];
	});
	
	// EMPTYITER
	// -------------------------------------
	T.makeTest('EMPTYITER', false, [], function() {
		log('check common fields');
		log(common_fields);
		log(EMPTYITER);
		if (T.checkKey(EMPTYITER, common_fields) === 0) {
			return false;
		}
		log('check size (must be 0)');
		log(EMPTYITER.size());
		if (T.check(EMPTYITER.size() === 0) === 0) {
			return false;
		}
		log('check hasNext (must be false)');
		var hasNext_value = EMPTYITER.hasNext();
		log(hasNext_value);
		if (T.check(hasNext_value === false) === 0) {
			log('hasNext() do not return false');
			return false;
		}
		log('check next (must do throw exception)');
		try {
			var next_value = EMPTYITER.next();
			log('NG');
			log('have not to exist next value');
			log(next_value);
			return false;
		} catch (e) {
			log('OK');
			log('exception text: ' + e);
		}
		return true;
	});
	
};
