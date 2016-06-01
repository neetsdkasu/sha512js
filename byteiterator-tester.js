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
	
	// ByteArrayByteIterator
	// -------------------------------------
	T.makeTest('ByteArrayByteIterator', false, [], function() {
		log('construct');
		var iter = new ByteArrayByteIterator();
		log(iter);
		log('check common fields');
		log(common_fields);
		if (T.checkKey(iter, common_fields) === 0) {
			return false;
		}
		var fields = ['init'];
		log('check fields');
		log(fields);
		if (T.checkKey(iter, fields) === 0) {
			return false;
		}
		log('check first state (before first init)');
		log('size() 0?');
		log(iter.size());
		if (T.check(iter.size() === 0) === 0) {
			return false;
		}
		log('hasNext false?');
		log(iter.hasNext());
		if (T.check(iter.hasNext() === false) === 0) {
			return false;
		}
		var test_values = [
			[[0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80, 0x90, 0xa0, 0xb0], 3, 4],
			[[0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7], 0, 5],
			[[0xf, 0xe, 0xd, 0xc, 0xb, 0xa, 0x9], 2, 5],
			[[0x1, 0x2, 0x3], 1, 0],
			[[], 0, 0]
		];
		var i, hasNext_value, next_value;
		var j, values, offset, len, v;
		for (j in test_values) {
			log('case #' + j);
			v = test_values[j];
			values = v[0];
			offset = v[1];
			len = v[2];
			log(values);
			log('offset: ' + offset);
			log('len: ' + len);
			iter.init(values, offset, len);
			log('size ' + len + '?');
			log(iter.size());
			if (T.check(iter.size() === len) === 0) {
				return false;
			}
			log('test iterate');
			for (i = 0; i < len; i++) {
				log('item: ' + i);
				log('hasNext true?');
				hasNext_value = iter.hasNext();
				log(hasNext_value);
				if (T.check(hasNext_value === true) === 0) {
					return;
				}
				log('next ' + values[i + offset] + '?');
				next_value = iter.next();
				log(next_value);
				if (T.check(next_value === values[i + offset]) === 0) {
					return false;
				}
			}
			log('now, must have no item');
			log('hasNext false?');
			hasNext_value = iter.hasNext();
			log(hasNext_value);
			if (T.check(hasNext_value === false) === 0) {
				return false;
			}
			log('next ' + values[offset + len] + '? (it is reference original array)');
			next_value = iter.next();
			log(next_value);
			if (T.check(next_value === values[offset + len]) === 0) {
				return false;
			}
			log('size ' + len + '? (size must not change)');
			log(iter.size());
			if (T.check(iter.size() === len) === 0) {
				return false;
			}
		}
		return true;
	});
	
	// ByteStringByteIterator
	// -------------------------------------
	T.makeTest('ByteStringByteIterator', false, [], function() {
		log('construct');
		var iter = new ByteStringByteIterator();
		log(iter);
		log('check common fields');
		log(common_fields);
		if (T.checkKey(iter, common_fields) === 0) {
			return false;
		}
		var fields = ['init'];
		log('check fields');
		log(fields);
		if (T.checkKey(iter, fields) === 0) {
			return false;
		}
		log('check first state (before first init)');
		log('size() 0?');
		log(iter.size());
		if (T.check(iter.size() === 0) === 0) {
			return false;
		}
		log('hasNext false?');
		log(iter.hasNext());
		if (T.check(iter.hasNext() === false) === 0) {
			return false;
		}
		var test_values = [
			['ABC', 0, 3],
			['abcdefghij', 2, 4],
			['XYZ0123ABC', 5, 5],
			['KLmno',2, 0],
			['', 0, 0],
			['S', 0, 1]
		];
		var i, hasNext_value, next_value;
		var j, strsrc, offset, len, v, bytevalue;
		for (j in test_values) {
			log('case #' + j);
			v = test_values[j];
			strsrc = v[0];
			offset = v[1];
			len = v[2];
			bytes = v[3];
			log('str: ' + strsrc);
			log('offset: ' + offset);
			log('len: ' + len);
			iter.init(strsrc, offset, len);
			log('size ' + len + '?');
			log(iter.size());
			if (T.check(iter.size() === len) === 0) {
				return false;
			}
			log('test iterate');
			for (i = 0; i < len; i++) {
				log('item: ' + i);
				log('hasNext true?');
				hasNext_value = iter.hasNext();
				log(hasNext_value);
				if (T.check(hasNext_value === true) === 0) {
					return;
				}
				bytevalue = strsrc.charCodeAt(i + offset) & 0xFF;
				log('next ' + bytevalue + '?');
				next_value = iter.next();
				log(next_value);
				if (T.check(next_value === bytevalue) === 0) {
					return false;
				}
			}
			log('now, must have no item');
			log('hasNext false?');
			hasNext_value = iter.hasNext();
			log(hasNext_value);
			if (T.check(hasNext_value === false) === 0) {
				return false;
			}
			bytevalue = strsrc.charCodeAt(i + offset) & 0xFF;
			log('next ' + bytevalue + '? (it is reference original array)');
			next_value = iter.next();
			log(next_value);
			if (T.check(next_value === bytevalue) === 0) {
				return false;
			}
			log('size ' + len + '? (size must not change)');
			log(iter.size());
			if (T.check(iter.size() === len) === 0) {
				return false;
			}
		}
		return true;
	});
};
