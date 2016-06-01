/* IntClass Tester
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Leonardone @ NEETSDKASU
 */


var IntClassTester = new function() {
	
	var T = new TesterUtilJS(this, 'IntClassTester');
	var log = T.log;
	
	// -----------------------------------------------
	var IntClass = null, int64 = null;
	
	// -----------------------------------------------
	T.setBindFunc(function(x) {
		IntClass = x['IntClass'];
	});
	
	// Int64 Constructor
	// -----------------------------------------------
	T.makeTest('int64_constructor', true, [], function() {
		var fields = [
			'parse', 'toHex', 'equals', 'valueOf', 'add', 'bwAnd', 'bwOr', 'bwXor', 'bwNot',
			'shiftR', 'rotateR', 'ZERO', 'add4', 'add5', 'bwXor3', 'copyBytes', 'getPacker'
		];
		int64 = new IntClass(8);
		log(fields);
		var ok = T.checkKey(int64, fields);
		return ok === 1;
	});
	
	// Int64 parse
	// -----------------------------------------------
	T.makeTest('int64_parse', false, ['int64_constructor'], function() {
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
			ok += T.checkA(v[1], w);
		}
		return ok === test_count;
	});
	
	// Int64 toHex
	// -----------------------------------------------
	T.makeTest('int64_toHex', false, ['int64_parse'], function() {
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
			ok += T.check(v[1] === s);
		}
		return ok === test_count;
	});
	
	// Int64 equals
	// -----------------------------------------------
	T.makeTest('int64_equals', false, ['int64_parse', 'int64_toHex'], function() {
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
			ok += T.check(v[2] === s1);
			if (v[0] != v[1]) {
				test_count++;
				log('swap case');
				s2 = int64.equals(w2, w1);
				log(s2);
				ok += T.check(v[2] === s2);
			}
		}
		return ok === test_count;
	});
	
	// Int64 valueOf
	// -----------------------------------------------
	T.makeTest('int64_valueOf', false, ['int64_parse', 'int64_equals'], function() {
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
			ok += T.check(int64.equals(w1, w2));
		}
		return ok === test_count;
	});
	
	// Int64 add
	// -----------------------------------------------
	T.makeTest('int64_add', false, ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
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
			ok += T.check(int64.equals(a, s1));
			if (v[0] != v[1]) {
				test_count++;
				log('swap case');
				s2 = int64.add(w2, w1);
				log(int64.toHex(s2));
				ok += T.check(int64.equals(a, s2));
			}
		}
		return ok === test_count;
	});
	
	// Int64 bwAnd
	// -----------------------------------------------
	T.makeTest('int64_bwAnd', false, ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
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
			ok += T.check(int64.equals(a, s1));
			if (v[0] != v[1]) {
				test_count++;
				log('swap case');
				s2 = int64.bwAnd(w2, w1);
				log(int64.toHex(s2));
				ok += T.check(int64.equals(a, s2));
			}
		}
		return ok === test_count;
	});
	
	// Int64 bwOr
	// -----------------------------------------------
	T.makeTest('int64_bwOr', false, ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
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
			ok += T.check(int64.equals(a, s1));
			if (v[0] != v[1]) {
				test_count++;
				log('swap case');
				s2 = int64.bwOr(w2, w1);
				log(int64.toHex(s2));
				ok += T.check(int64.equals(a, s2));
			}
		}
		return ok === test_count;
	});
	
	// Int64 bwXor
	// -----------------------------------------------
	T.makeTest('int64_bwXor', false, ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
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
			ok += T.check(int64.equals(a, s1));
			if (v[0] != v[1]) {
				test_count++;
				log('swap case');
				s2 = int64.bwXor(w2, w1);
				log(int64.toHex(s2));
				ok += T.check(int64.equals(a, s2));
			}
		}
		return ok === test_count;
	});
	
	// Int64 bwNot
	// -----------------------------------------------
	T.makeTest('int64_bwNot', false, ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
		var test_values = [
			['0', 'ffffffffffffffff'],
			['1', 'fffffffffffffffe'],
			['1000100010001000', 'efffefffefffefff'],
			['123456789abcdef0', 'edcba9876543210f']
		];
		var test_count = test_values.length * 2;
		var i, v, w, a, s1, s2, ok = 0;
		for (i in test_values) {
			log('case #' + i);
			v = test_values[i];
			w = int64.parse(v[0]);
			a = int64.parse(v[1]);
			s1 = int64.bwNot(w);
			log(v);
			log(int64.toHex(w));
			log(int64.toHex(s1));
			ok += T.check(int64.equals(a, s1));
			log('swap case');
			s2 = int64.bwNot(a);
			log(int64.toHex(a));
			log(int64.toHex(s2));
			ok += T.check(int64.equals(w, s2));
		}
		return ok === test_count;
	});
	
	// Int64 shiftR
	// -----------------------------------------------
	T.makeTest('int64_shiftR', false, ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
		var shift_values = [0, 1, 10, 16, 18, 36, 47, 48, 49, 63, 64, 65, 81, 130, 200];
		var test_values = [
			['0', ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']],
			['1', ['1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1', '0', '0', '0', '0']],
			['f', ['f', '7', '0', '0', '0', '0', '0', '0', '0', '0', 'f', '7', '0', '3', '0']],
			['10', ['10', '8', '0', '0', '0', '0', '0', '0', '0', '0', '10', '8', '0', '4', '0']],
			['1000', ['1000', '800', '4', '0', '0', '0', '0', '0', '0', '0', '1000', '800', '0', '400', '10']],
			['6789', ['6789', '33c4', '19', '0', '0', '0', '0', '0', '0', '0', '6789', '33c4', '0', '19e2', '67']],
			['10000', ['10000', '8000', '40', '1', '0', '0', '0', '0', '0', '0', '10000', '8000', '0', '4000', '100']],
			['fffff', ['fffff', '7ffff', '3ff', 'f', '3', '0', '0', '0', '0', '0', 'fffff', '7ffff', '7', '3ffff', 'fff']],
			['abcd037b', ['abcd037b', '55e681bd', '2af340', 'abcd', '2af3', '0', '0', '0', '0', '0', 'abcd037b', '55e681bd', '55e6', '2af340de', 'abcd03']],
			['100000000', ['100000000', '80000000', '400000', '10000', '4000', '0', '0', '0', '0', '0', '100000000', '80000000', '8000', '40000000', '1000000']],
			['ffffffffff', ['ffffffffff', '7fffffffff', '3fffffff', 'ffffff', '3fffff', 'f', '0', '0', '0', '0', 'ffffffffff', '7fffffffff', '7fffff', '3fffffffff', 'ffffffff']],
			['f1a4c99ed678', ['f1a4c99ed678', '78d264cf6b3c', '3c693267b5', 'f1a4c99e', '3c693267', 'f1a', '1', '0', '0', '0', 'f1a4c99ed678', '78d264cf6b3c', '78d264cf', '3c693267b59e', 'f1a4c99ed6']],
			['1000000000000', ['1000000000000', '800000000000', '4000000000', '100000000', '40000000', '1000', '2', '1', '0', '0', '1000000000000', '800000000000', '80000000', '400000000000', '10000000000']],
			['fffffffffffff', ['fffffffffffff', '7ffffffffffff', '3ffffffffff', 'fffffffff', '3ffffffff', 'ffff', '1f', 'f', '7', '0', 'fffffffffffff', '7ffffffffffff', '7ffffffff', '3ffffffffffff', 'fffffffffff']],
			['8000000000000000', ['8000000000000000', '4000000000000000', '20000000000000', '800000000000', '200000000000', '8000000', '10000', '8000', '4000', '1', '8000000000000000', '4000000000000000', '400000000000', '2000000000000000', '80000000000000']],
			['c9d20a1ef4771111', ['c9d20a1ef4771111', '64e9050f7a3b8888', '32748287bd1dc4', 'c9d20a1ef477', '32748287bd1d', 'c9d20a1', '193a4', 'c9d2', '64e9', '1', 'c9d20a1ef4771111', '64e9050f7a3b8888', '64e9050f7a3b', '32748287bd1dc444', 'c9d20a1ef47711']],
			['ffffffffffffffff', ['ffffffffffffffff', '7fffffffffffffff', '3fffffffffffff', 'ffffffffffff', '3fffffffffff', 'fffffff', '1ffff', 'ffff', '7fff', '1', 'ffffffffffffffff', '7fffffffffffffff', '7fffffffffff', '3fffffffffffffff', 'ffffffffffffff']]
		];
		var test_count = test_values.length;
		var i, j, v, w, u, ok = 0;
		var s = new Array(shift_values.length);
		var a = new Array(shift_values.length);
		log('shift values');
		log(shift_values);
		for (i in test_values) {
			log('case #' + i);
			v = test_values[i];
			w = int64.parse(v[0]);
			u = v[1];
			log(v);
			log(int64.toHex(w));
			for (j in shift_values) {
				a[j] = int64.parse(u[j]);
				s[j] = int64.shiftR(w, shift_values[j]);
			}
			ok += T.checkAfn(a, s, int64.equals);
		}
		return ok === test_count;
	});
	
	// Int64 rotateR
	// -----------------------------------------------
	T.makeTest('int64_rotateR', false, ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
		var rotate_values = [0, 1, 10, 16, 18, 36, 47, 48, 49, 63, 64, 65, 81, 130, 200];
		var test_values = [
			['0', ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']],
			['1', ['1', '8000000000000000', '40000000000000', '1000000000000', '400000000000', '10000000', '20000', '10000', '8000', '2', '1', '8000000000000000', '800000000000', '4000000000000000', '100000000000000']],
			['f', ['f', '8000000000000007', '3c0000000000000', 'f000000000000', '3c00000000000', 'f0000000', '1e0000', 'f0000', '78000', '1e', 'f', '8000000000000007', '7800000000000', 'c000000000000003', 'f00000000000000']],
			['10', ['10', '8', '400000000000000', '10000000000000', '4000000000000', '100000000', '200000', '100000', '80000', '20', '10', '8', '8000000000000', '4', '1000000000000000']],
			['1000', ['1000', '800', '4', '1000000000000000', '400000000000000', '10000000000', '20000000', '10000000', '8000000', '2000', '1000', '800', '800000000000000', '400', '10']],
			['6789', ['6789', '80000000000033c4', 'e240000000000019', '6789000000000000', '19e2400000000000', '67890000000', 'cf120000', '67890000', '33c48000', 'cf12', '6789', '80000000000033c4', '33c4800000000000', '40000000000019e2', '8900000000000067']],
			['10000', ['10000', '8000', '40', '1', '4000000000000000', '100000000000', '200000000', '100000000', '80000000', '20000', '10000', '8000', '8000000000000000', '4000', '100']],
			['fffff', ['fffff', '800000000007ffff', 'ffc00000000003ff', 'ffff00000000000f', 'ffffc00000000003', 'fffff0000000', '1ffffe0000', 'fffff0000', '7ffff8000', '1ffffe', 'fffff', '800000000007ffff', 'ffff800000000007', 'c00000000003ffff', 'ff00000000000fff']],
			['abcd037b', ['abcd037b', '8000000055e681bd', 'dec00000002af340', '37b00000000abcd', '40dec00000002af3', 'abcd037b0000000', '1579a06f60000', 'abcd037b0000', '55e681bd8000', '1579a06f6', 'abcd037b', '8000000055e681bd', '81bd8000000055e6', 'c00000002af340de', '7b00000000abcd03']],
			['100000000', ['100000000', '80000000', '400000', '10000', '4000', '1000000000000000', '2000000000000', '1000000000000', '800000000000', '200000000', '100000000', '80000000', '8000', '40000000', '1000000']],
			['ffffffffff', ['ffffffffff', '8000007fffffffff', 'ffc000003fffffff', 'ffff000000ffffff', 'ffffc000003fffff', 'fffffffff000000f', '1fffffffffe0000', 'ffffffffff0000', '7fffffffff8000', '1fffffffffe', 'ffffffffff', '8000007fffffffff', 'ffff8000007fffff', 'c000003fffffffff', 'ff000000ffffffff']],
			['f1a4c99ed678', ['f1a4c99ed678', '78d264cf6b3c', '9e00003c693267b5', 'd6780000f1a4c99e', 'b59e00003c693267', '4c99ed6780000f1a', 'e349933dacf00001', 'f1a4c99ed6780000', '78d264cf6b3c0000', '1e349933dacf0', 'f1a4c99ed678', '78d264cf6b3c', '6b3c000078d264cf', '3c693267b59e', '780000f1a4c99ed6']],
			['1000000000000', ['1000000000000', '800000000000', '4000000000', '100000000', '40000000', '1000', '2', '1', '8000000000000000', '2000000000000', '1000000000000', '800000000000', '80000000', '400000000000', '10000000000']],
			['fffffffffffff', ['fffffffffffff', '8007ffffffffffff', 'ffc003ffffffffff', 'ffff000fffffffff', 'ffffc003ffffffff', 'fffffffff000ffff', 'fffffffffffe001f', 'ffffffffffff000f', 'ffffffffffff8007', '1ffffffffffffe', 'fffffffffffff', '8007ffffffffffff', 'ffff8007ffffffff', 'c003ffffffffffff', 'ff000fffffffffff']],
			['8000000000000000', ['8000000000000000', '4000000000000000', '20000000000000', '800000000000', '200000000000', '8000000', '10000', '8000', '4000', '1', '8000000000000000', '4000000000000000', '400000000000', '2000000000000000', '80000000000000']],
			['c9d20a1ef4771111', ['c9d20a1ef4771111', 'e4e9050f7a3b8888', '4472748287bd1dc4', '1111c9d20a1ef477', 'c44472748287bd1d', 'ef4771111c9d20a1', '143de8ee222393a4', 'a1ef4771111c9d2', '50f7a3b8888e4e9', '93a4143de8ee2223', 'c9d20a1ef4771111', 'e4e9050f7a3b8888', '8888e4e9050f7a3b', '72748287bd1dc444', '11c9d20a1ef47711']],
			['ffffffffffffffff', ['ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff', 'ffffffffffffffff']]
		];
		var test_count = test_values.length;
		var i, j, v, w, u, ok = 0;
		var s = new Array(rotate_values.length);
		var a = new Array(rotate_values.length);
		log('rotate values');
		log(rotate_values);
		for (i in test_values) {
			log('case #' + i);
			v = test_values[i];
			w = int64.parse(v[0]);
			u = v[1];
			log(v);
			log(int64.toHex(w));
			for (j in rotate_values) {
				a[j] = int64.parse(u[j]);
				s[j] = int64.rotateR(w, rotate_values[j]);
			}
			ok += T.checkAfn(a, s, int64.equals);
		}
		return ok === test_count;
	});
	
	// int64 ZERO
	// -----------------------------------------------
	T.makeTest('int64_ZERO', false, ['int64_parse', 'int64_equals'], function() {
		var a = int64.parse('0');
		var z = int64.ZERO;
		log(a);
		log(z);
		var ok = T.check(int64.equals(a, z));
		return ok === 1;
	});
	
	// int64 add4
	// -----------------------------------------------
	T.makeTest('int64_add4', false, ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
		var test_values = [
			['0', '0', '0', '0', '0'],
			['1', '1', '1', '1', '4'],
			['4000', '4000', '4000', '4000', '10000'],
			['62ec63a2dd2ae650', '3f5fd239401e4dd1', '6a74d21b60a83247', '7ecd747dd9fe6d6e', '8b8e7c7557efd3d6'],
			['732ad2ec01150c5a', 'e1daf90dc69a60ca', '6fab3bb5bc7276f2', '9da9dcfa5758dbda', '625ae4a9db7abff0'],
			['56d253f2f6931797', '9a72603999920bde', '24305920891fd621', 'cf282ee37594bbd3', 'e49d3c308ed9b569'],
			['97e1c12c4b790a5b', '5d339df2796b8ad5', '1d31567791abf830', '409af92c22338dc', '1650652918b3c63c'],
			['2c05b545bfefca65', '79933eda7eeb4e19', '3ff9c5484a6b1e4c', 'fc6cb8ae750d3156', 'e1ff7216fe536820'],
			['610592d803f55f25', '2263e0c165f4a59f', '4b260c8796b125e3', '2b80a656bad773bc', 'fa102677bb729e63'],
			['74f40e6f8f77aacb', '5ac068fa86bc9b4f', '8ab04855d85ebcc1', 'c9bf29bb76043474', '2423e97b6497374f'],
			['5392c38ae5f329fe', '8a80ce0d428005', '969546daeb462471', '91b58a8385df9716', '7c6815b7645b658a'],
			['e571d13ad8c060f3', 'd86c0d57cec87496', 'f543d3ca44edfcdf', '15a8675c646727ff', 'c8ca19b950ddfa67'],
			['a62c1b1fef182098', 'b580607df5ad7a06', '7d665ad795442e76', '8018600607a6174d', '592b367b81afe061'],
			['82c1b5e7edfa5225', 'c64c4f1eb48b9af', 'bdfc7e804f746d8a', 'c3b506b45b0eb65d', '10d8000e83c62fbb'],
			['71a1b02747d36107', '4031f80538b60ebc', '491945cb80a427c', '5aaea86ce6e959b0', '1113e4f61f7d0bef'],
			['78188c112eb8ee9e', '268f4fdadf91e2f1', '15e730472c3e94b6', 'e50dd6ce3a234c24', '999ce30174acb269'],
			['559a8130f880de86', '5afe0f48c77e1028', 'c2ff27d0171f3713', '97cef85c75f2257d', 'b66b0a64d104b3e']
		];
		var test_count = test_values.length;
		var i, j, v, s, ok = 0;
		var w = new Array(4);
		for (i in test_values) {
			v = test_values[i];
			for (j = 0; j < 4; j++) {
				w[j] = int64.parse(v[j]);
			}
			s = int64.add4(w[0], w[1], w[2], w[3]);
			a = int64.parse(v[4]);
			log(v);
			log(int64.toHex(s));
			ok += T.check(int64.equals(a, s));
		}
		return ok === test_count;
	});
	
	// int64 add5
	// -----------------------------------------------
	T.makeTest('int64_add5', false, ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
		var test_values = [
			['0', '0', '0', '0', '0', '0'],
			['1', '1', '1', '1', '1', '5'],
			['4000', '4000', '4000', '4000', '4000', '14000'],
			['f7680c3d7281db30', '21041d12735567cf', '9f10f5bd31d296b8', '23e7705b73947495', 'b201b13b8c6e964', 'e684aa7c440537b0'],
			['9de4de84745f4e60', '111dfcc777cd81af', 'af57f3189cca7d17', '34ff3b8551753e7c', '3d383506a9af1f70', 'd0923ef0841bab12'],
			['9137ec90a62ce92a', 'f5bad0c4f12a5c57', '30d939d4aab8fa12', 'f8ce2f1aee7cf0c8', 'c4d6e7572279bf54', '75710d9c5306efaf'],
			['5c8fde377e8f4bb0', '2a5eaef857f659d3', '8ef4de0b5cda130d', 'e2d68a847c89193', '852f8ac1de77aa69', 'a9405ea5599ff48c'],
			['9b5c732e6782c9c0', '183b7579d8c31d98', '4d60c0339f27431d', 'e8bb21559fefbdd6', 'd8ef50b0dc525580', 'c2a31ae25baf3dcb'],
			['2260e3055b2828a1', '31a26722f521d3ce', '918b626ca0b0f802', '8e45c2c1188054c9', 'faac9e339ecd8a6c', '6e810d89a848d3a6'],
			['9fc6cd354d374018', 'bd450b5ed68885ac', '6f18e6550cdb2836', '24b290bc8b263ed', '762cffb96c9b11ce', '449ce7ae65e863b5'],
			['964072dff70e6242', '808c6445450b3f69', 'c05da34cbd7d5073', '7c2dd627d4315496', '76e3b2d401eb4ce', '5ac68bc70de6fb82'],
			['eca92cbdab854fab', '5afb12805dfb21a2', '47e54ce7cc6dde0e', '8a879838062e5d23', '454858f7eb5ab44f', '5f597d55c77760cd'],
			['b00e27d00607172b', 'f3068d48d57743a1', 'ae4bcdcef3d10da9', '9fca5fb7c54f0976', 'e0b885f1ce6ba2d5', 'd1e36891630a14c0'],
			['be1d7d9fe76d02d2', '84d3bdd309b027f9', '8b855814d25032cb', '592dab16239c4d86', '4563c0f694464784', '6d07ff947b4ff2a0'],
			['9e6ecf0fb665817e', '4d3b682c17aca273', '7b71b121edf2c132', '3f7328923f097281', '4db1e7e0cc6680f6', 'f440f8d0c774d89a'],
			['8a5b0e273f374bba', '2e72a6f9797ad97', 'cf9f244a65c13367', '4e6c6554abe6a421', '4438d7ddc1de877e', 'ef869a13aa555857'],
			['6ababcf6f079846b', 'b554d3a7b11713b2', 'c63468bc2c2b7fa7', '7ddef0b9284c0d68', '110e28e252d5956c', '753112f648ddba98']
		];
		var test_count = test_values.length;
		var i, j, v, s, ok = 0;
		var w = new Array(5);
		for (i in test_values) {
			v = test_values[i];
			for (j = 0; j < 5; j++) {
				w[j] = int64.parse(v[j]);
			}
			s = int64.add5(w[0], w[1], w[2], w[3], w[4]);
			a = int64.parse(v[5]);
			log(v);
			log(int64.toHex(s));
			ok += T.check(int64.equals(a, s));
		}
		return ok === test_count;
	});
	
	// int64 bwXor3
	// -----------------------------------------------
	T.makeTest('int64_bwXor3', false, ['int64_parse', 'int64_toHex', 'int64_equals'], function() {
		var test_values = [
			['0', '0', '0', '0'],
			['1', '1', '1', '1'],
			['0', '1', '1', '0'],
			['1', '0', '1', '0'],
			['1', '1', '0', '0'],
			['1', '0', '0', '1'],
			['0', '1', '0', '1'],
			['0', '0', '1', '1'],
			['7eea886edd535d48', '539e5d9f1dd13c85', 'a107cc2df4f0960f', '8c7319dc3472f7c2'],
			['519a7f67139bb244', 'fc9f2c387b65a473', 'd604c3c32e5e946b', '7b01909c46a0825c'],
			['d44188b269fd806f', '8d85fc907da799fd', '8adecc818918501d', 'd31ab8a39d42498f'],
			['cd4ccf1168e381d8', 'c59288798697bab0', 'd42c65d0cf099f16', 'dcf222b8217da47e'],
			['b5efdbe40110e341', 'ea9d35b89c5b3ccd', '3eefb844fdfd7314', '619d561860b6ac98'],
			['58307ad3b25c59c8', 'cb0b5d47ccf52e', 'a368f70642efc2ef', 'fb938688b77f6e09'],
			['502cb22950520252', 'c186f740dce73fe0', 'e9d980b7a1d8c973', '7873c5de2d6df4c1'],
			['a7500d5d1718725a', 'ebda1aed337f19e7', 'b61dcb283df4018', '47ebcb02a7b82ba5'],
			['b420866e21ed5508', '3f547b34d978c370', '808ac843fec2ee8a', 'bfe3519065778f2'],
			['7f1f20ba42b8f322', '1f33cb331ca4ca81', 'a6370a8d48f40f96', 'c61be10416e83635'],
			['2566ec9cb5e91809', 'c086086c08d34c9a', '4d571f6e7b796894', 'a8b7fb9ec6433c07'],
			['7a96159502ef0f2e', 'f9f9e60d6a812661', '996b002415a51e77', '1a04f3bc7dcb3738'],
			['fe47e16d9bc76c6', '3bc1832dfe465ab3', 'c79a4bff57dabe50', 'f3bfb6c470209225'],
			['aa9b2cdfec9918dd', 'f46449f94fa8e8bc', 'b17d921daa6488f6', 'ef82f73b09557897']
		];
		var test_count = test_values.length;
		var i, j, v, s, ok = 0;
		var w = new Array(3);
		for (i in test_values) {
			v = test_values[i];
			for (j = 0; j < 3; j++) {
				w[j] = int64.parse(v[j]);
			}
			s = int64.bwXor3(w[0], w[1], w[2]);
			a = int64.parse(v[3]);
			log(v);
			log(int64.toHex(s));
			ok += T.check(int64.equals(a, s));
		}
		return ok === test_count;
	});
	
	// Int64 copyBytes
	// -----------------------------------------------
	T.makeTest('int64_copyBytes', false, ['int64_parse'], function() {
		var test_values = [
			['0', 0, [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]],
			['1', 1, [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x1]],
			['801f703e60405cab', 7, [0x80, 0x1f, 0x70, 0x3e, 0x60, 0x40, 0x5c, 0xab]]
		];
		var test_count = test_values.length;
		var i, j, ok = 0;
		var v, o, w, s = new Array(20);
		for (i in test_values) {
			for (j = 0; j < 20; j++) {
				s[j] = 0;
			}
			v = test_values[i];
			w = int64.parse(v[0]);
			o = v[1];
			int64.copyBytes(w, s, o);
			log(v);
			log(v[2]);
			log(s);
			ok += T.checkAP(v[2], 0, s, o, 8);
		}
		return ok === test_count;
	});
};
