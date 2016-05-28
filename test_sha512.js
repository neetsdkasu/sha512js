/* test SHA512JS
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Leonardone @ NEETSDKASU
 */


var Test_SHA512JS = new function() {

	// test tools
	// -----------------------------------------------
	var self = this;
	var test_list = [];
	var logging_flag = true;
	var _logging = function(f) { logging_flag = f; };
	var log = function(x) { if (logging_flag) self['logfunc'](x); };
	var check = function(b) { if (b) { log('OK'); return 1; } else { log('NG'); return 0; } };
	var checkA = function(a1, a2) {
		var i; for (i in a1) { if (a1[i] !== a2[i]) { log('NG'); return 0; } } log('OK'); return 1;
	};
	var skip_flag = false;
	var _skip = function(f) { skip_flag = f; }
	var _require = function(a) {
		if (skip_flag) { return true; }
		var i, flag, func;
		for (i in a) {
			flag = 'flag_' + a[i];
			if (self[flag]) { continue; }
			func = self['test_' + a[i]];
			if (func(false) === false) {
				return false;
			}
		}
		return true;
	};
	var makeTest = function(test_name, test_req, test_func) {
		test_list.push(test_name);
		var flag = 'flag_' + test_name;
		self[flag] = false;
		self['test_' + test_name] = function(s) {
			if (_require(test_req) === false) { return false; }
			log(('TEST ' + test_name +'  ----------------------------------------------').substring(0, 50));
			var r, bk = logging_flag;
			_logging(s !== false);
			r = test_func();
			_logging(bk);
			log('TEST ' + (r ? 'OK' : 'NG') +' ------------------------------------------');
			self[flag] = r;
			return r;
		};
	};
	this.logging = _logging;
	this.skip = _skip;
	this.testAll = function(s, ls) {
		log('TEST ALL -----------------------------------------');
		var i, b = true, func;
		var tg = ls === undefined ? test_list : ls;
		var ok = [], ng = [];
		for (i in tg) {
			func = self['test_' + tg[i]];
			if (func(s === true)) {
				ok.push(tg[i]);
			} else {
				b = false;
				ng.push(tg[i]);
			}
		}
		log('TEST ALL ' + (b ? 'OK' : 'NG') + ' --------------------------------------');
		if (s === true) {
			log('OK TESTS:');
			log(ok);
			log('NG TESTS:');
			log(ng);
		}
	};
	this.logfunc = (function() {
		if (console) { if (console.log) {
			return function (x) { console.log(x); };
		}}
		if (document) {
			return (function() {
				var id = 'debuglog-test-sha512js';
				var dbg = document.getElementById(id);
				if (dbg === null) {
					dbg = document.body.appendChild(document.createElement('div'));
					dbg.id = id;
				}
				return function(x) {
					dbg.appendChild(document.createTextNode(x))
					   .parentNode
					   .appendChild(document.createElement('br'));
				};
			})();
		}
		return function(x) { };
	})();
	
	// -----------------------------------------------
	var sha512 = new SHA512JS();
	var int64  = sha512.getInt64();
	var packer = int64.getPacker();
	
	// Int64 parse
	// -----------------------------------------------
	makeTest('int64_parse', [], function() {
		var test_values = [
			['0', [0x0000, 0x0000, 0x0000, 0x0000, 0]],
			['1', [0x0001, 0x0000, 0x0000, 0x0000, 0]],
			['a', [0x000a, 0x0000, 0x0000, 0x0000, 0]],
			['1000', [0x1000, 0x0000, 0x0000, 0x0000, 0]],
			['a000b', [0x000b, 0x000a, 0x0000, 0x0000, 0]],
			['10002000', [0x2000, 0x1000, 0x0000, 0x0000, 0]],
			['a000b000c', [0x000c, 0x000b, 0x000a, 0x0000, 0]],
			['100020003000', [0x3000, 0x2000, 0x1000, 0x0000, 0]],
			['a000b000c000d', [0x000d, 0x000c, 0x000b, 0x000a, 0]],
			['1000200030004000', [0x4000, 0x3000, 0x2000, 0x1000, 0]],
			['a000b000c000d000e', [0x000e, 0x000d, 0x000c, 0x000b, 0]]
		];
		var test_count = test_values.length;
		var i, v, w, ok = 0;
		for (i in test_values) {
			log('case #' + i);
			v = test_values[i];
			w = int64.parse(v[0]);
			log(v);
			log(w);
			ok += checkA(v[1], w);
		}
		return ok === test_count;
	});
	
	// Int64 toHex
	// -----------------------------------------------
	makeTest('int64_toHex', ['int64_parse'], function() {
		var test_values = [
			['0', '0000000000000000'],
			['1', '0000000000000001'],
			['a', '000000000000000a'],
			['1000', '0000000000001000'],
			['a000b', '00000000000a000b'],
			['10002000', '0000000010002000'],
			['a000b000c', '0000000a000b000c'],
			['100020003000', '0000100020003000'],
			['a000b000c000d', '000a000b000c000d'],
			['1000200030004000', '1000200030004000']
		];
		var test_count = test_values.length;
		var i, v, w, s, ok = 0;
		for (i in test_values) {
			log('case #' + i);
			v = test_values[i];
			w = int64.parse(v[0]);
			s = int64.toHex(w);
			log(v);
			log(w);
			log(s);
			ok += check(v[1] === s);
		}
		return ok === test_count;
	});
	
	// Int64 equals
	// -----------------------------------------------
	makeTest('int64_equals', ['int64_parse', 'int64_toHex'], function() {
		var test_values = [
			['0', '0', true],
			['0', '1', false],
			['1', '1', true],
			['1000', '1000', true],
			['1000', 'f000', false],
			['f000', 'f000', true],
			['0', '10000', false],
			['10000', '10000', true],
			['1', 'ffff', false],
			['1', '1000', false],
			['f000f000', '10001000', false],
			['1', 'ffffffff', false],
			['100000000', '100000000', true],
			['100000000000', 'f00000000000', false],
			['100020003000', 'a000b000c000', false],
			['100020003000', '100020003000', true]
		];
		var test_count = test_values.length;
		var i, v, w1, w2, s1, s2, ok = 0;
		for (i in test_values) {
			log('case #' + i);
			v = test_values[i];
			w1 = int64.parse(v[0]);
			w2 = int64.parse(v[1]);
			s1 = int64.equals(w1, w2);
			log(v);
			log(int64.toHex(w1));
			log(int64.toHex(w2));
			log(s1);
			ok += check(v[2] === s1);
			if (v[0] != v[1]) {
				test_count++;
				log('swap case');
				s2 = int64.equals(w2, w1);
				log(s2);
				ok += check(v[2] === s2);
			}
		}
		return ok === test_count;
	});
	
	// Int64 valueOf
	// -----------------------------------------------
	makeTest('int64_valueOf', ['int64_parse', 'int64_equals'], function() {
		var test_values = [
			[0x0, '0'],
			[0x1, '1'],
			[0x1234, '1234'],
			[0x56780000, '56780000'],
			[0x12345678, '12345678'],
			[0xffffffff, 'ffffffffffffffff'],
			[0x1234567890abcd, '7890abcd']
		];
		var test_count = test_values.length;
		var i, v, w1, w2, ok = 0;
		for (i in test_values) {
			log('case #' + i);
			v = test_values[i];
			w1 = int64.valueOf(v[0]);
			w2 = int64.parse(v[1]);
			log(v);
			log(w1);
			log(w2);
			ok += check(int64.equals(w1, w2));
		}
		return ok === test_count;
	});
	
	// Int64 add
	// -----------------------------------------------
	makeTest('int64_add', ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
		var test_values = [
			['0', '0', '0'],
			['0', '1', '1'],
			['1', '1', '2'],
			['1000', '1000', '2000'],
			['1000', 'f000', '10000'],
			['f000', 'f000', '1e000'],
			['1'   , 'ffff', '10000'],
			['0'    , '10000', '10000'],
			['10000', '10000', '20000'],
			['10001000', 'f000f000', '100010000'],
			['1', 'ffffffff', '100000000'],
			['100000000', '100000000', '200000000'],
			['100000000000', 'f00000000000', '1000000000000'],
			['100010001000', 'f000f000f000', '1000100010000'],
			['2', 'ffffffffffff', '1000000000001'],
			['1000100010001000', 'f000f000f000f000', '1000100010000'],
			['1', 'ffffffffffffffff', '0']
		];
		var test_count = test_values.length;
		var i, v, w1, w2, a, s1, s2, ok = 0;
		for (i in test_values) {
			log('case #' + i);
			v = test_values[i];
			w1 = int64.parse(v[0]);
			w2 = int64.parse(v[1]);
			a = int64.parse(v[2]);
			s1 = int64.add(w1, w2);
			log(v);
			log(int64.toHex(w1));
			log(int64.toHex(w2));
			log(int64.toHex(s1));
			ok += check(int64.equals(a, s1));
			if (v[0] != v[1]) {
				test_count++;
				log('swap case');
				s2 = int64.add(w2, w1);
				log(int64.toHex(s2));
				ok += check(int64.equals(a, s2));
			}
		}
		return ok === test_count;
	});
	
	// Int64 bwAnd
	// -----------------------------------------------
	makeTest('int64_bwAnd', ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
		var test_values = [
			['0', '0', '0'],
			['0', '1', '0'],
			['1', '1', '1'],
			['0', 'ffffffffffffffff', '0'],
			['1000200030004000', 'ffffffffffffffff', '1000200030004000'],
			['ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff']
		];
		var test_count = test_values.length;
		var i, v, w1, w2, a, s1, s2, ok = 0;
		for (i in test_values) {
			log('case #' + i);
			v = test_values[i];
			w1 = int64.parse(v[0]);
			w2 = int64.parse(v[1]);
			a = int64.parse(v[2]);
			s1 = int64.bwAnd(w1, w2);
			log(v);
			log(int64.toHex(w1));
			log(int64.toHex(w2));
			log(int64.toHex(s1));
			ok += check(int64.equals(a, s1));
			if (v[0] != v[1]) {
				test_count++;
				log('swap case');
				s2 = int64.bwAnd(w2, w1);
				log(int64.toHex(s2));
				ok += check(int64.equals(a, s2));
			}
		}
		return ok === test_count;
	});
	
	// Int64 bwOr
	// -----------------------------------------------
	makeTest('int64_bwOr', ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
		var test_values = [
			['0', '0', '0'],
			['0', '1', '1'],
			['1', '1', '1'],
			['1000200030004000', '0', '1000200030004000'],
			['0', 'ffffffffffffffff', 'ffffffffffffffff'],
			['1000200030004000', 'ffffffffffffffff', 'ffffffffffffffff'],
			['ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff']
		];
		var test_count = test_values.length;
		var i, v, w1, w2, a, s1, s2, ok = 0;
		for (i in test_values) {
			log('case #' + i);
			v = test_values[i];
			w1 = int64.parse(v[0]);
			w2 = int64.parse(v[1]);
			a = int64.parse(v[2]);
			s1 = int64.bwOr(w1, w2);
			log(v);
			log(int64.toHex(w1));
			log(int64.toHex(w2));
			log(int64.toHex(s1));
			ok += check(int64.equals(a, s1));
			if (v[0] != v[1]) {
				test_count++;
				log('swap case');
				s2 = int64.bwOr(w2, w1);
				log(int64.toHex(s2));
				ok += check(int64.equals(a, s2));
			}
		}
		return ok === test_count;
	});
	
	// Int64 bwXor
	// -----------------------------------------------
	makeTest('int64_bwXor', ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
		var test_values = [
			['0', '0', '0'],
			['0', '1', '1'],
			['1', '1', '0'],
			['1000200030004000', '0', '1000200030004000'],
			['0', 'ffffffffffffffff', 'ffffffffffffffff'],
			['1000200030004000', 'ffffffffffffffff', 'efffdfffcfffbfff'],
			['ffffffffffffffff', 'ffffffffffffffff', '0']
		];
		var test_count = test_values.length;
		var i, v, w1, w2, a, s1, s2, ok = 0;
		for (i in test_values) {
			log('case #' + i);
			v = test_values[i];
			w1 = int64.parse(v[0]);
			w2 = int64.parse(v[1]);
			a = int64.parse(v[2]);
			s1 = int64.bwXor(w1, w2);
			log(v);
			log(int64.toHex(w1));
			log(int64.toHex(w2));
			log(int64.toHex(s1));
			ok += check(int64.equals(a, s1));
			if (v[0] != v[1]) {
				test_count++;
				log('swap case');
				s2 = int64.bwXor(w2, w1);
				log(int64.toHex(s2));
				ok += check(int64.equals(a, s2));
			}
		}
		return ok === test_count;
	});


};
