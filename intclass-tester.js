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
};
