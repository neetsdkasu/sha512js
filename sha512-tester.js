/* SHA512JS Tester
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Leonardone @ NEETSDKASU
 */


var SHA512JSTester = new function() {
	
	var T = new TesterUtilJS(this, 'SHA512JSTester');
	var log = T.log;
	
	var Int64, _init_hash_value;
	
	T.setBindFunc(function(x) {
		Int64 = x['Int64'];
		_init_hash_value = x['_init_hash_value'];
	});
	
	// fields
	// -----------------------------------------------
	T.makeTest('fields', false, [], function() {
		var fields = ['create', 'init', 'finish', 'getHash', 'getInt64', 'toHexString', 'toByteString', 'getHashToNumberArray',
			 'updateByByteArray', 'updateByByteString', 'updateByNumberArray'];
		log(fields);
		log(SHA512JS);
		return T.checkKey(SHA512JS, fields) === 1;
	});
	
	// getInt64
	// -----------------------------------------------
	T.makeTest('getInt64', false, [], function() {
		return Int64 === SHA512JS.getInt64();
	});
	
	
	// init
	// -----------------------------------------------
	T.makeTest('init', false, [], function() {
		var x = {
			"hash": [],
			"packer": Int64.getPacker().create()
		};
		SHA512JS.init(x);
		log('check hash property length 8?');
		log(x.hash.length);
		if (T.check(x.hash.length === 8) === 0) {
			return false;
		}
		log('check hash property values');
		log(_init_hash_value);
		log(x.hash);
		if (T.checkA(_init_hash_value, x.hash) === 0) {
			return false;
		}
		log('check size property 0?');
		log(x.size);
		if (T.check(x.size === 0) === 0) {
			return false;
		}
		log('check packer property initialized (field-v)');
		log(x.packer.v);
		if (T.checkA([0, 0, 0, 0], x.packer.v) === 0) {
			return false;
		}
		log('check packer property initialized (field-p 8?)');
		log(x.packer.p);
		if (T.check(x.packer.p === 8) === 0) {
			return false;
		}
		return true;
	});
	
	
	var _first_hash = [
		0x6a, 0x09, 0xe6, 0x67, 0xf3, 0xbc, 0xc9, 0x08, 0xbb, 0x67, 0xae, 0x85, 0x84, 0xca, 0xa7, 0x3b,
		0x3c, 0x6e, 0xf3, 0x72, 0xfe, 0x94, 0xf8, 0x2b, 0xa5, 0x4f, 0xf5, 0x3a, 0x5f, 0x1d, 0x36, 0xf1,
		0x51, 0x0e, 0x52, 0x7f, 0xad, 0xe6, 0x82, 0xd1, 0x9b, 0x05, 0x68, 0x8c, 0x2b, 0x3e, 0x6c, 0x1f,
		0x1f, 0x83, 0xd9, 0xab, 0xfb, 0x41, 0xbd, 0x6b, 0x5b, 0xe0, 0xcd, 0x19, 0x13, 0x7e, 0x21, 0x79
	];
	
	// getHash
	// -----------------------------------------------
	T.makeTest('getHash', false, [], function() {
		var cnt = SHA512JS.create();
		SHA512JS.init(cnt);
		var hash = new Array(64);
		SHA512JS.getHash(cnt, hash, 0);
		log(_first_hash);
		log(hash);
		return T.checkA(_first_hash, hash);
	});
	
	// getHashToNumberArray 16bit
	// -----------------------------------------------
	T.makeTest('getHashToNumberArray_16bit', false, [], function() {
		var a = [
			0x6a09, 0xe667, 0xf3bc, 0xc908, 0xbb67, 0xae85, 0x84ca, 0xa73b,
			0x3c6e, 0xf372, 0xfe94, 0xf82b, 0xa54f, 0xf53a, 0x5f1d, 0x36f1,
			0x510e, 0x527f, 0xade6, 0x82d1, 0x9b05, 0x688c, 0x2b3e, 0x6c1f,
			0x1f83, 0xd9ab, 0xfb41, 0xbd6b, 0x5be0, 0xcd19, 0x137e, 0x2179
		];
		var cnt = SHA512JS.create();
		SHA512JS.init(cnt);
		var hash = new Array(32);
		SHA512JS.getHashToNumberArray(cnt, 16, hash, 0);
		log(a);
		log(hash);
		return T.checkA(a, hash);
	});
	
	// getHashToNumberArray 32bit
	// -----------------------------------------------
	T.makeTest('getHashToNumberArray_32bit', false, [], function() {
		var a = [
			0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b, 0x3c6ef372, 0xfe94f82b, 0xa54ff53a, 0x5f1d36f1,
			0x510e527f, 0xade682d1, 0x9b05688c, 0x2b3e6c1f, 0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179
		];
		var cnt = SHA512JS.create();
		SHA512JS.init(cnt);
		var hash = new Array(16);
		SHA512JS.getHashToNumberArray(cnt, 32, hash, 0);
		log(a);
		log(hash);
		return T.checkA(a, hash);
	});
	
	// toHexString
	// -----------------------------------------------
	T.makeTest('toHexString', false, [], function() {
		var a = '6a09e667f3bcc908bb67ae8584caa73b3c6ef372fe94f82ba54ff53a5f1d36f1510e527fade682d19b05688c2b3e6c1f1f83d9abfb41bd6b5be0cd19137e2179';
		var cnt = SHA512JS.create();
		SHA512JS.init(cnt);
		var s = SHA512JS.toHexString(cnt);
		log(a);
		log(s);
		return T.check(a === s);
	});
	
	
	// toByteString
	// -----------------------------------------------
	T.makeTest('toByteString', false, [], function() {
		var i, bs = '';
		for (i = 0; i < _first_hash.length; i++) {
			bs += String.fromCharCode(_first_hash[i]);
		}
		var cnt = SHA512JS.create();
		SHA512JS.init(cnt);
		var s = SHA512JS.toByteString(cnt);
		log(bs);
		log(s);
		return T.checkA(bs, s);
		
	});
	
	// sample1 hash
	// -----------------------------------------------
	var _sample1_hash = [
		0xdd, 0xaf, 0x35, 0xa1, 0x93, 0x61, 0x7a, 0xba, 0xcc, 0x41, 0x73, 0x49, 0xae, 0x20, 0x41, 0x31,
		0x12, 0xe6, 0xfa, 0x4e, 0x89, 0xa9, 0x7e, 0xa2, 0x0a, 0x9e, 0xee, 0xe6, 0x4b, 0x55, 0xd3, 0x9a,
		0x21, 0x92, 0x99, 0x2a, 0x27, 0x4f, 0xc1, 0xa8, 0x36, 0xba, 0x3c, 0x23, 0xa3, 0xfe, 0xeb, 0xbd,
		0x45, 0x4d, 0x44, 0x23, 0x64, 0x3c, 0xe8, 0x0e, 0x2a, 0x9a, 0xc9, 0x4f, 0xa5, 0x4c, 0xa4, 0x9f
	];
	
	// sample1 manual
	// -----------------------------------------------
	T.makeTest('sample1_manual', false, [], function() {
		var data = [
			0x61626380, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
			0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
			0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
			0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000018
		];
		var cnt = SHA512JS.create();
		SHA512JS.init(cnt);
		SHA512JS.updateByNumberArray(cnt, data, 0, data.length, 32);
		var hash = new Array(64);
		SHA512JS.getHash(cnt, hash, 0);
		log(data);
		log(_sample1_hash);
		log(hash);
		return T.checkA(_sample1_hash, hash);
	});
	
	// sample1 auto by ByteArray
	// -----------------------------------------------
	T.makeTest('sample1_ByteArray', false, [], function() {
		var bytedata = [0x61, 0x62, 0x63];
		var cnt = SHA512JS.create();
		SHA512JS.init(cnt);
		SHA512JS.updateByByteArray(cnt, bytedata, 0, bytedata.length);
		SHA512JS.finish(cnt);
		var hash = new Array(64);
		SHA512JS.getHash(cnt, hash, 0);
		log(bytedata);
		log(_sample1_hash);
		log(hash);
		return T.checkA(_sample1_hash, hash);
	});
	
	// sample1 auto by ByteString
	// -----------------------------------------------
	T.makeTest('sample1_ByteString', false, [], function() {
		var strdata = 'abc';
		var cnt = SHA512JS.create();
		SHA512JS.init(cnt);
		SHA512JS.updateByByteString(cnt,strdata, 0, strdata.length);
		SHA512JS.finish(cnt);
		var hash = new Array(64);
		SHA512JS.getHash(cnt, hash, 0);
		log(strdata);
		log(_sample1_hash);
		log(hash);
		return T.checkA(_sample1_hash, hash);
	});
	
	// sample2 hash
	// -----------------------------------------------
	var _sample2_hash = [
		0x8e, 0x95, 0x9b, 0x75, 0xda, 0xe3, 0x13, 0xda, 0x8c, 0xf4, 0xf7, 0x28, 0x14, 0xfc, 0x14, 0x3f,
		0x8f, 0x77, 0x79, 0xc6, 0xeb, 0x9f, 0x7f, 0xa1, 0x72, 0x99, 0xae, 0xad, 0xb6, 0x88, 0x90, 0x18,
		0x50, 0x1d, 0x28, 0x9e, 0x49, 0x00, 0xf7, 0xe4, 0x33, 0x1b, 0x99, 0xde, 0xc4, 0xb5, 0x43, 0x3a,
		0xc7, 0xd3, 0x29, 0xee, 0xb6, 0xdd, 0x26, 0x54, 0x5e, 0x96, 0xe5, 0x5b, 0x87, 0x4b, 0xe9, 0x09
	];
	
	// sample2 manual
	// -----------------------------------------------
	T.makeTest('sample2_manual', false, [], function() {
		var data = [
			0x61626364, 0x65666768, 0x62636465, 0x66676869, 0x63646566, 0x6768696a, 0x64656667, 0x68696a6b,
			0x65666768, 0x696a6b6c, 0x66676869, 0x6a6b6c6d, 0x6768696a, 0x6b6c6d6e, 0x68696a6b, 0x6c6d6e6f,
			0x696a6b6c, 0x6d6e6f70, 0x6a6b6c6d, 0x6e6f7071, 0x6b6c6d6e, 0x6f707172, 0x6c6d6e6f, 0x70717273,
			0x6d6e6f70, 0x71727374, 0x6e6f7071, 0x72737475, 0x80000000, 0x00000000, 0x00000000, 0x00000000,
			0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
			0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
			0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
			0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000380
		];
		var cnt = SHA512JS.create();
		SHA512JS.init(cnt);
		SHA512JS.updateByNumberArray(cnt, data, 0, data.length, 32);
		var hash = new Array(64);
		SHA512JS.getHash(cnt, hash, 0);
		log(data);
		log(_sample2_hash);
		log(hash);
		return T.checkA(_sample2_hash, hash);
	});
	
	// sample2 auto by ByteArray
	// -----------------------------------------------
	T.makeTest('sample2_ByteArray', false, [], function() {
		var bytedata = [
			0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
			0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b,
			0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d,
			0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f,
			0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71,
			0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73,
			0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75
		];
		var cnt = SHA512JS.create();
		SHA512JS.init(cnt);
		SHA512JS.updateByByteArray(cnt, bytedata, 0, bytedata.length);
		SHA512JS.finish(cnt);
		var hash = new Array(64);
		SHA512JS.getHash(cnt, hash, 0);
		log(bytedata);
		log(_sample2_hash);
		log(hash);
		return T.checkA(_sample2_hash, hash);
	});
	
	// sample2 auto by ByteString
	// -----------------------------------------------
	T.makeTest('sample2_ByteString', false, [], function() {
		var strdata = 'abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu';
		var cnt = SHA512JS.create();
		SHA512JS.init(cnt);
		SHA512JS.updateByByteString(cnt,strdata, 0, strdata.length);
		SHA512JS.finish(cnt);
		var hash = new Array(64);
		SHA512JS.getHash(cnt, hash, 0);
		log(strdata);
		log(_sample2_hash);
		log(hash);
		return T.checkA(_sample2_hash, hash);
	});
	
	// sample2 auto by NumberArray
	// -----------------------------------------------
	T.makeTest('sample2_NumberArray', false, [], function() {
		var numbers = [
			0x61626364, 0x65666768, 0x62636465, 0x66676869, 0x63646566, 0x6768696a, 0x64656667, 0x68696a6b,
			0x65666768, 0x696a6b6c, 0x66676869, 0x6a6b6c6d, 0x6768696a, 0x6b6c6d6e, 0x68696a6b, 0x6c6d6e6f,
			0x696a6b6c, 0x6d6e6f70, 0x6a6b6c6d, 0x6e6f7071, 0x6b6c6d6e, 0x6f707172, 0x6c6d6e6f, 0x70717273,
			0x6d6e6f70, 0x71727374, 0x6e6f7071, 0x72737475
		];
		var cnt = SHA512JS.create();
		SHA512JS.init(cnt);
		SHA512JS.updateByNumberArray(cnt, numbers, 0, numbers.length, 32);
		SHA512JS.finish(cnt);
		var hash = new Array(64);
		SHA512JS.getHash(cnt, hash, 0);
		log(numbers);
		log(_sample2_hash);
		log(hash);
		return T.checkA(_sample2_hash, hash);
	});
	
	// sample2 auto by NumberArrayLE
	// -----------------------------------------------
	T.makeTest('sample2_NumberArrayLE', false, [], function() {
		var numbers = [
			0x64636261, 0x68676665, 0x65646362, 0x69686766, 0x66656463, 0x6a696867, 0x67666564, 0x6b6a6968,
			0x68676665, 0x6c6b6a69, 0x69686766, 0x6d6c6b6a, 0x6a696867, 0x6e6d6c6b, 0x6b6a6968, 0x6f6e6d6c,
			0x6c6b6a69, 0x706f6e6d, 0x6d6c6b6a, 0x71706f6e, 0x6e6d6c6b, 0x7271706f, 0x6f6e6d6c, 0x73727170,
			0x706f6e6d, 0x74737271, 0x71706f6e, 0x75747372
		];
		var cnt = SHA512JS.create();
		SHA512JS.init(cnt);
		SHA512JS.updateByNumberArrayLE(cnt, numbers, 0, numbers.length, 32);
		SHA512JS.finish(cnt);
		var hash = new Array(64);
		SHA512JS.getHash(cnt, hash, 0);
		log(numbers);
		log(_sample2_hash);
		log(hash);
		return T.checkA(_sample2_hash, hash);
	});
	
	// hash test
	// -----------------------------------------------
	T.makeTest('hash_test', false, [], function() {
		var test_values = [
			['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
				'e26b7daef4366128fc7ae3fb75f31789ae03648c61b91192ac6cffb4924a1ce53c0768fe21daab635f5aebaa7fd112b325fd6a32715926c3d73d1ac31e6431a5'],
			['Hello, I am a human. This is a pen. It is very heavy. I have it.',
				'bfdccdfb7e212cfdfc6b2126026b8316e0aa2ad0f7e6e6ce4fd9d0dd943080f2a20c33a94e8596ae8dc02353aaebe72cdb72b6e23128dbd8b1c78d61d410c742'],
			['Windows Mac OSX Linux BSDUnix InternetExplorer FireFox GoogleChrome Safari Opera Microsoft Apple Google GNU JavaScript HTML CSS',
				'cd6fdc79577d6ec6d0c35f7d6b6f69648d43fa5fcccb1edba6d3d7db2e55d27ad5d00e3b807f23c3aa3e003bceb1b5f05ee8c38a868c576322a3e2faad6113d5'],
			["function FizzBuzz() { var i; for (;;) { if (i % 15 === 0) { println('FizzBuzz'); } else if (i % 5 === 0) { println('Buzz'); } else if (i % 3 === 0) { println('Fizz'); } else { println(i); } } } } FizzBuzz();",
				'0468a49a4edab01f33cf28f08694e00baf20eca3d03fa01204c388fde00e85bdf3bf0e2bb035597bd0ffd87c5f08cca0800446b1ea506605e48cd5bbd14eb45c'],
			['Application Basic Circle Depth Earth Force Graphic Heaven Idle Joker Kid Lion Music Nice O',
				'4d293dd1e7257bd2ca479e4dd6e1803176267445648b826ab997a6a7d4d11b5a9af5465bd2caf3250367b5d59d6c30315dd3264226ab5dea140a2b69e320ea08'],
			['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%()~|{}[]-=*+<>,.;:?_@`',
				'e64c87c526b094a83fece0f21e1de029a56ac98b440a0e3274a79c868e23425104b92e00efca2be6f21d5e4fdb422509735ba8c620eac8f86964a62fc8069398'],
			['This is Test!!',
				'd65cd5b0fc7120b2bf54fcbea341d40a2a8e30ba5dc0790ab2cbbe9976d3bf9cf4f7be4b9344ca49120ecce97f2be3a876baaf3047ede0aacfe1d10961681146'],
			['C C++ Java Python Perl PHP Ruby JavaScript Haskell Scheme CommonLisp Go Objective-C Swift Rust COBOL Fortran BASIC Scala',
				'eb4828882a2758b2027c0aa02c9f1ea26cdcc6c31969ed294e5221eee663e64ed88ba12a9e7534f0311273be88f1ca42644f39c7d8d913b13a730c0102e73726']
		];
		var test_count = test_values.length;
		var i, s, v, ok = 0;
		var cnt = SHA512JS.create();
		for (i in test_values) {
			log('case #' + i);
			v = test_values[i];
			SHA512JS.init(cnt);
			SHA512JS.updateByByteString(cnt, v[0], 0, v[0].length);
			SHA512JS.finish(cnt);
			s = SHA512JS.toHexString(cnt);
			log(v[0]);
			log(v[0].length + ' bytes');
			log((v[0].length << 3) + ' bits');
			log(v[1]);
			log(s);
			ok += T.check(v[1] === s);
		}
		return ok === test_count;
		
	});
	
		// hash test multi update
	// -----------------------------------------------
	T.makeTest('hash_test_multi_update', false, [], function() {
		var test_values = [
			[['abcdefghijklmnopqr', 'stuvwxyzABCDEFGH', 'IJKLMNOPQRSTUVWXYZ0123456789'],
				'e26b7daef4366128fc7ae3fb75f31789ae03648c61b91192ac6cffb4924a1ce53c0768fe21daab635f5aebaa7fd112b325fd6a32715926c3d73d1ac31e6431a5'],
			[['Hello, I am a human. ', 'This is a pen. ', 'It is very heavy. ', 'I have it.'],
				'bfdccdfb7e212cfdfc6b2126026b8316e0aa2ad0f7e6e6ce4fd9d0dd943080f2a20c33a94e8596ae8dc02353aaebe72cdb72b6e23128dbd8b1c78d61d410c742'],
			[['Windows Mac OSX Linux BSDUnix ', 'InternetExplorer FireFox GoogleChrome Safari Opera ', 'Microsoft Apple Google GNU ', 'JavaScript HTML CSS'],
				'cd6fdc79577d6ec6d0c35f7d6b6f69648d43fa5fcccb1edba6d3d7db2e55d27ad5d00e3b807f23c3aa3e003bceb1b5f05ee8c38a868c576322a3e2faad6113d5'],
			[["function FizzBuzz() { var i; ", "for (;;) { if (i % 15 === 0) { println('FizzBuzz'); } ", "else if (i % 5 === 0) { println('Buzz'); } else ", "if (i % 3 === 0) { println('Fizz'); } else { println(i); } } } } FizzBuzz();"],
				'0468a49a4edab01f33cf28f08694e00baf20eca3d03fa01204c388fde00e85bdf3bf0e2bb035597bd0ffd87c5f08cca0800446b1ea506605e48cd5bbd14eb45c'],
			[['Application Basic Cir', 'cle Depth Earth Fo', 'rce Graphic Heaven Idle Jok', 'er Kid Lion Music Nice O'],
				'4d293dd1e7257bd2ca479e4dd6e1803176267445648b826ab997a6a7d4d11b5a9af5465bd2caf3250367b5d59d6c30315dd3264226ab5dea140a2b69e320ea08'],
			[['abcdefghijkl', 'mnopqrstuvwxyzABCDEFGHIJK', 'LMNOPQRSTUVWXYZ012345678', '9!#$%()~|{}[]-=*+<>,.;:?_@`'],
				'e64c87c526b094a83fece0f21e1de029a56ac98b440a0e3274a79c868e23425104b92e00efca2be6f21d5e4fdb422509735ba8c620eac8f86964a62fc8069398'],
			[['This i', 's Test!!'],
				'd65cd5b0fc7120b2bf54fcbea341d40a2a8e30ba5dc0790ab2cbbe9976d3bf9cf4f7be4b9344ca49120ecce97f2be3a876baaf3047ede0aacfe1d10961681146'],
			[['C ', 'C++ ', 'Java ', 'Python ', 'Perl ', 'PHP ', 'Ruby ', 'JavaScript ', 'Haskell ', 'Scheme ', 'CommonLisp ', 'Go ', 'Objective-C ', 'Swift ', 'Rust ', 'COBOL ', 'Fortran ', 'BASIC ', 'Scala'],
				'eb4828882a2758b2027c0aa02c9f1ea26cdcc6c31969ed294e5221eee663e64ed88ba12a9e7534f0311273be88f1ca42644f39c7d8d913b13a730c0102e73726']
		];
		var test_count = test_values.length;
		var i, j, s, v, w, ok = 0;
		var cnt = SHA512JS.create();
		for (i in test_values) {
			log('case #' + i);
			v = test_values[i];
			w = v[0];
			SHA512JS.init(cnt);
			for (j in w) {
				SHA512JS.updateByByteString(cnt, w[j], 0, w[j].length);
			}
			SHA512JS.finish(cnt);
			s = SHA512JS.toHexString(cnt);
			log(v[0]);
			log(v[1]);
			log(s);
			ok += T.check(v[1] === s);
		}
		return ok === test_count;
		
	});

};
