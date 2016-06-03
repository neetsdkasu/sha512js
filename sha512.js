/* SHA512 for JavaScript
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Leonardone @ NEETSDKASU
 */

var SHA512JS = new function() {
	
	function IntClass(sz) {
		//  sz: byte size (i.e. sz = 8 -> 64bit Int)
		//      require sz == pow(2,x) (x >= 1)
		
		var BITLEN = 16;   // bit length of a unit
		var MASK = 0xFFFF; // bit mask of a unit
		var UNITSHIFTMASK = BITLEN - 1; // shifter mask in a unit
		
		var BYTESIZE = sz; // byte size of Integer
		var INTBITS = BYTESIZE << 3; // bit size of Integer
		var SHIFTMASK = INTBITS - 1; // shifter mask for bitwise shift
		var LEN = INTBITS >> 4;  // count of units for Integer
		var SIZE = LEN + 1;      // count of units with a unit for carry
		var ROTMASK = LEN - 1;   // unit index mask for rotation
		
		this.ZERO = (function() {
			var i, v = new Array(SIZE);
			for (i = 0; i < SIZE; i++) {
				v[i] = 0;
			}
			return v;
		})();
		
		this.valueOf = function(n) {
			// n: Number(Integer)
			var i, v = new Array(SIZE);
			for (i = 0; i < LEN; i++) {
				v[i] = n & MASK;
				n >>= BITLEN;  // shift right n as 32bits singed integer on javascript
			}
			v[LEN] = 0;
			return v;
		};
		
		this.parse = function(s) {
			// s: Hex String
			var i, v = new Array(SIZE), j;
			i = 0;
			for (j = s.length - 4; j >= 0 && i < LEN; j -= 4) { // BITLEN(16) -> 4 Hex-characters
				v[i] = parseInt('0x' + s.substring(j, j + 4));
				i++;
			}
			if (j > -4 && i < LEN) {
				v[i] = parseInt('0x' + s.substring(0, j + 4));
				i++;
			}
			for (; i < SIZE; i++) {
				v[i] = 0;
			}
			return v;
		};
		
		this.equals = function(v1, v2) {
			var i;
			for (i = 0; i < SIZE; i++) {
				if (v1[i] !== v2[i]) {
					return false;
				}
			}
			return true;
		};
		
		this.add = function(v1, v2) {
			var i, v = new Array(SIZE), t = 0;
			for (i = 0; i < LEN; i++) {
				t += v1[i] + v2[i];
				v[i] = t & MASK;
				t >>= BITLEN;
			}
			v[LEN] = 0;
			return v;
		};
		
		this.add4 = function(v1, v2, v3, v4) {
			var i, v = new Array(SIZE), t = 0;
			for (i = 0; i < LEN; i++) {
				t += v1[i] + v2[i] + v3[i] + v4[i];
				v[i] = t & MASK;
				t >>= BITLEN;
			}
			v[LEN] = 0;
			return v;
		};
		
		this.add5 = function(v1, v2, v3, v4, v5) {
			var i, v = new Array(SIZE), t = 0;
			for (i = 0; i < LEN; i++) {
				t += v1[i] + v2[i] + v3[i] + v4[i] + v5[i];
				v[i] = t & MASK;
				t >>= BITLEN;
			}
			v[LEN] = 0;
			return v;
		};
		
		this.bwXor = function(v1, v2) {
			var i, v = new Array(SIZE);
			for (i = 0; i < LEN; i++) {
				v[i] = v1[i] ^ v2[i];
			}
			v[LEN] = 0;
			return v;
		};
		
		this.bwXor3 = function(v1, v2, v3) {
			var i, v = new Array(SIZE);
			for (i = 0; i < LEN; i++) {
				v[i] = v1[i] ^ v2[i] ^ v3[i];
			}
			v[LEN] = 0;
			return v;
		};
		
		this.bwAnd = function(v1, v2) {
			var i, v = new Array(SIZE);
			for (i = 0; i < LEN; i++) {
				v[i] = v1[i] & v2[i];
			}
			v[LEN] = 0;
			return v;
		};
		
		this.bwOr  = function(v1, v2) {
			var i, v = new Array(SIZE);
			for (i = 0; i < LEN; i++) {
				v[i] = v1[i] | v2[i];
			}
			v[LEN] = 0;
			return v;
		};
		
		this.bwNot = function(v1) {
			var i, v = new Array(SIZE);
			for (i = 0; i < LEN; i++) {
				v[i] = v1[i] ^ MASK;
			}
			v[LEN] = 0;
			return v;
		};
		
		this.shiftR = function(v1, s) {
			var i, v = new Array(SIZE), k, m, p;
			k = (s & SHIFTMASK) >> 4; // div BITLEN(16)
			for (i = 0; i + k < LEN; i++) {
				v[i] = v1[i + k];
			}
			s &= UNITSHIFTMASK;
			m = (1 << s) - 1; // mask
			p = BITLEN - s;   // shiftL
			for (i = 0; i < LEN; i++) {
				v[i] >>= s;
				v[i] |= (v[i + 1] & m) << p;
			}
			v[LEN] = 0;
			return v;
		};
		
		this.rotateR = function(v1, r) {
			var i, v = new Array(SIZE), k, m, p;
			k = (r & SHIFTMASK) >> 4; // div BITLEN(16)
			for (i = 0; i < LEN; i++) {
				v[i] = v1[(i + k) & ROTMASK];
			}
			r &= UNITSHIFTMASK;
			m = (1 << r) - 1;  // mask
			p = BITLEN - r;    // shiftL
			v[LEN] = v[0] & m; // lowest bits
			for (i = 0; i < LEN; i++) {
				v[i] >>= r;
				v[i] |= (v[i + 1] & m) << p;
			}
			v[LEN] = 0;
			return v;
		};
		
		this.toHex = function(v) {
			var i, c, s = '';
			for (i = LEN - 1; i >= 0; i--) {
				c = v[i].toString(16);
				while (c.length < 4) { c = '0' + c; } // 4 hex-characters at BITLEN(16)
				s += c;
			}
			return s;
		};
		
		this.copyBytes = function(v, dest, offset) {
			var i, j = offset;
			for (i = LEN - 1; i >= 0; i--) {
				dest[j]     = v[i] >> 8; // BITLEN(16) -> 2 bytes
				dest[j + 1] = v[i] &  0xFF;
				j += 2;
			}
		};
		
		var packer = new function () {
			
			this.create = function() {
				return {
					"v": new Array(LEN),
					"p": 0
				};
			};
			
			this.init = function(vp) {
				var i;
				for (i = 0; i < LEN; i++) {
					vp.v[i] = 0;
				}
				vp.p = BYTESIZE;
			};
			
			this.push = function(vp, x) {
				if (vp.p > 0) {
					vp.p--;
					vp.v[vp.p >> 1] |= (x & 0xFF) << ((vp.p & 1) << 3); // BITLEN(16)
				}
			};
			
			this.getCopy = function(vp) {
				var i, r = new Array(SIZE);
				for (i = 0; i < LEN; i++) {
					r[i] = vp.v[i]
				}
				r[LEN] = 0;
				return r;
			};
		}
		
		this.getPacker = function() {
			return packer;
		};
	};
	
	var EMPTYITER = new function() {
		this.hasNext = function() { return false; };
		this.next = function() { throw 'EMPTYITER: No item!'; };
		this.size = function() { return 0; };
	};
	
	function ByteArrayByteIterator() {
		var _arr = [];
		var _idx = 0;
		var _iend = 0;
		var _size = 0;
		this.hasNext = function() { return _idx < _iend; };
		this.next = function() { return _arr[_idx++]; };
		this.size = function() { return _size; };
		this.init = function(data, offset, len) {
			_arr = data; _idx = offset; _iend = offset + len; _size = len;
		};
	}
	
	function ByteStringByteIterator() {
		var _str ='';
		var _idx = 0;
		var _iend = 0;
		var _size = 0;
		this.hasNext = function() { return _idx < _iend; };
		this.next = function() { return _str.charCodeAt(_idx++) & 0xFF; };
		this.size = function() { return _size; };
		this.init = function(str, offset, len) {
			_str = str; _idx = offset; _iend = offset + len; _size = len;
		};
	}
	
	function NumberArrayByteIterator() { // 32bits number
		var _arr = [];
		var _idx = 0;
		var _iend = 0;
		var _size = 0;
		var _mask = 0;
		var _shift = 0;
		var _i;
		this.hasNext = function() { return _idx < _iend; };
		this.next = function() {
			_i = (_mask - (_idx & _mask)) << 3;
			return (_arr[(_idx++) >> _shift] >> _i) & 0xFF;
		};
		this.size = function() { return _size; }
		this.init = function(data, offset, len, bits) {
			// bits: Integer bits (16 or 32) (javascript's shift operators support only 32bits number)
			_mask = (bits >> 3) - 1; _shift = bits >> 4;
			_arr = data; _idx = offset << _shift; _iend = (offset + len) << _shift; _size = len * (bits >> 3);
		};
	}
	
	var Int64 = new IntClass(8);
	var Packer = Int64.getPacker();
	
	this.getInt64 = function() { return Int64; };
	
	var _init_hash_value = [
		Int64.parse('6a09e667f3bcc908'),
		Int64.parse('bb67ae8584caa73b'),
		Int64.parse('3c6ef372fe94f82b'),
		Int64.parse('a54ff53a5f1d36f1'),
		Int64.parse('510e527fade682d1'),
		Int64.parse('9b05688c2b3e6c1f'),
		Int64.parse('1f83d9abfb41bd6b'),
		Int64.parse('5be0cd19137e2179')
	];
	
	var _K = [
		Int64.parse('428a2f98d728ae22'), Int64.parse('7137449123ef65cd'), Int64.parse('b5c0fbcfec4d3b2f'), Int64.parse('e9b5dba58189dbbc'),
		Int64.parse('3956c25bf348b538'), Int64.parse('59f111f1b605d019'), Int64.parse('923f82a4af194f9b'), Int64.parse('ab1c5ed5da6d8118'),
		Int64.parse('d807aa98a3030242'), Int64.parse('12835b0145706fbe'), Int64.parse('243185be4ee4b28c'), Int64.parse('550c7dc3d5ffb4e2'),
		Int64.parse('72be5d74f27b896f'), Int64.parse('80deb1fe3b1696b1'), Int64.parse('9bdc06a725c71235'), Int64.parse('c19bf174cf692694'),
		Int64.parse('e49b69c19ef14ad2'), Int64.parse('efbe4786384f25e3'), Int64.parse('0fc19dc68b8cd5b5'), Int64.parse('240ca1cc77ac9c65'),
		Int64.parse('2de92c6f592b0275'), Int64.parse('4a7484aa6ea6e483'), Int64.parse('5cb0a9dcbd41fbd4'), Int64.parse('76f988da831153b5'),
		Int64.parse('983e5152ee66dfab'), Int64.parse('a831c66d2db43210'), Int64.parse('b00327c898fb213f'), Int64.parse('bf597fc7beef0ee4'),
		Int64.parse('c6e00bf33da88fc2'), Int64.parse('d5a79147930aa725'), Int64.parse('06ca6351e003826f'), Int64.parse('142929670a0e6e70'),
		Int64.parse('27b70a8546d22ffc'), Int64.parse('2e1b21385c26c926'), Int64.parse('4d2c6dfc5ac42aed'), Int64.parse('53380d139d95b3df'),
		Int64.parse('650a73548baf63de'), Int64.parse('766a0abb3c77b2a8'), Int64.parse('81c2c92e47edaee6'), Int64.parse('92722c851482353b'),
		Int64.parse('a2bfe8a14cf10364'), Int64.parse('a81a664bbc423001'), Int64.parse('c24b8b70d0f89791'), Int64.parse('c76c51a30654be30'),
		Int64.parse('d192e819d6ef5218'), Int64.parse('d69906245565a910'), Int64.parse('f40e35855771202a'), Int64.parse('106aa07032bbd1b8'),
		Int64.parse('19a4c116b8d2d0c8'), Int64.parse('1e376c085141ab53'), Int64.parse('2748774cdf8eeb99'), Int64.parse('34b0bcb5e19b48a8'),
		Int64.parse('391c0cb3c5c95a63'), Int64.parse('4ed8aa4ae3418acb'), Int64.parse('5b9cca4f7763e373'), Int64.parse('682e6ff3d6b2b8a3'),
		Int64.parse('748f82ee5defb2fc'), Int64.parse('78a5636f43172f60'), Int64.parse('84c87814a1f0ab72'), Int64.parse('8cc702081a6439ec'),
		Int64.parse('90befffa23631e28'), Int64.parse('a4506cebde82bde9'), Int64.parse('bef9a3f7b2c67915'), Int64.parse('c67178f2e372532b'),
		Int64.parse('ca273eceea26619c'), Int64.parse('d186b8c721c0c207'), Int64.parse('eada7dd6cde0eb1e'), Int64.parse('f57d4f7fee6ed178'),
		Int64.parse('06f067aa72176fba'), Int64.parse('0a637dc5a2c898a6'), Int64.parse('113f9804bef90dae'), Int64.parse('1b710b35131c471b'),
		Int64.parse('28db77f523047d84'), Int64.parse('32caab7b40c72493'), Int64.parse('3c9ebe0a15c9bebc'), Int64.parse('431d67c49c100d4c'),
		Int64.parse('4cc5d4becb3e42b6'), Int64.parse('597f299cfc657e2a'), Int64.parse('5fcb6fab3ad6faec'), Int64.parse('6c44198c4a475817')
	];
	
	var __init_hash = function(x) {
		var i, hash = x.hash;
		for (i = 0; i < 8; i++) {
			hash[i] = _init_hash_value[i]
		}
		x.size = 0;
		Packer.init(x.packer);
	};
	
	var __Ch = function(x, y, z) {
		return Int64.bwXor(
			Int64.bwAnd(x, y),
			Int64.bwAnd(Int64.bwNot(x), z)
		);
	};
	
	var __Maj = function(x, y, z) {
		return Int64.bwXor3(
			Int64.bwAnd(x, y),
			Int64.bwAnd(x, z),
			Int64.bwAnd(y, z)
		);
	};
	
	var __ucSigma0 = function(x) {
		return Int64.bwXor3(
			Int64.rotateR(x, 28),
			Int64.rotateR(x, 34),
			Int64.rotateR(x, 39)
		);
	};
	
	var __ucSigma1 = function(x) {
		return Int64.bwXor3(
			Int64.rotateR(x, 14),
			Int64.rotateR(x, 18),
			Int64.rotateR(x, 41)
		);
	};
	
	var __lcSigma0 = function(x) {
		return Int64.bwXor3(
			Int64.rotateR(x, 1),
			Int64.rotateR(x, 8),
			Int64.shiftR(x, 7)
		);
	};
	
	var __lcSigma1 = function(x) {
		return Int64.bwXor3(
			Int64.rotateR(x, 19),
			Int64.rotateR(x, 61),
			Int64.shiftR(x, 6)
		);
	};
	
	this.create = function() {
		var x = {
			"hash"  : new Array(8),
			"w"     : new Array(80),
			"packer": Packer.create(),
			"b_iter": EMPTYITER,
			"s_iter": EMPTYITER,
			"n_iter": EMPTYITER
		};
		__init_hash(x);
		return x;
	};
	
	this.init = __init_hash;
	
	var __calcWj = function(x) {
		var j, w = x.w;
		for (j = 16; j < 80; j++) {
			w[j] = Int64.add4(__lcSigma1(w[j - 2]), w[j - 7], __lcSigma0(w[j - 15]), w[j - 16]);
//			console.log('w[' + j + '] = ' + Int64.toHex(w[j]) + ', ' + Int64.toHex(x.w[j]));
		}
		return w;
	};
	
	var __compress = function(x) {
//		console.log('compress!');
		var w = __calcWj(x);
		var a = x.hash[0];
		var b = x.hash[1];
		var c = x.hash[2];
		var d = x.hash[3];
		var e = x.hash[4];
		var f = x.hash[5];
		var g = x.hash[6];
		var h = x.hash[7];
		var j, t1, t2;
//		console.log('init');
//		console.log(Int64.toHex(a) + ' ' + Int64.toHex(b) + ' ' + Int64.toHex(c) + ' ' + Int64.toHex(d));
//		console.log(Int64.toHex(e) + ' ' + Int64.toHex(f) + ' ' + Int64.toHex(g) + ' ' + Int64.toHex(h));
		for (j = 0; j < 80; j++) {
			t1 = Int64.add5(h, __ucSigma1(e), __Ch(e, f, g), _K[j], w[j]);
			t2 = Int64.add(__ucSigma0(a), __Maj(a, b, c));
			h = g;
			g = f;
			f = e;
			e = Int64.add(d, t1);
			d = c;
			c = b;
			b = a;
			a = Int64.add(t1, t2);
//			console.log('t = ' + j);
//			console.log(Int64.toHex(a) + ' ' + Int64.toHex(b) + ' ' + Int64.toHex(c) + ' ' + Int64.toHex(d));
//			console.log(Int64.toHex(e) + ' ' + Int64.toHex(f) + ' ' + Int64.toHex(g) + ' ' + Int64.toHex(h));
		}
		x.hash[0] = Int64.add(x.hash[0], a);
		x.hash[1] = Int64.add(x.hash[1], b);
		x.hash[2] = Int64.add(x.hash[2], c);
		x.hash[3] = Int64.add(x.hash[3], d);
		x.hash[4] = Int64.add(x.hash[4], e);
		x.hash[5] = Int64.add(x.hash[5], f);
		x.hash[6] = Int64.add(x.hash[6], g);
		x.hash[7] = Int64.add(x.hash[7], h);
	};
	
	var __tryCompress = function(p, x) {
		if ((p & 63) !== 0) { return false; }
		x.w[(p >> 6) - 1] = Packer.getCopy(x.packer);
//		console.log('w[' + ((p >> 6) - 1) + '] = ' + Int64.toHex(x.w[(p >> 6) - 1]));
		Packer.init(x.packer);
		if (p !== 1024) { return false; }
		__compress(x);
		return true;
	};
	
	var __update = function(x, iter) {
		var p = x.size & 1023, v;
//		var b = 0;
//		console.log('iter.size: ' + iter.size());
		while (iter.hasNext()) {
			v = iter.next();
//			console.log('__update: ' + (b++) + ', ' + v.toString(16));
			Packer.push(x.packer, v);
			p += 8;
			if (__tryCompress(p, x)) {
				p = 0;
			}
		}
		x.size += iter.size() << 3; // bytes to bits
	};
	
	this.updateByByteArray = function(x, data, offset, len) {
		if (x.b_iter === EMPTYITER) {
			x.b_iter = new ByteArrayByteIterator();
		}
		x.b_iter.init(data, offset, len)
		__update(x, x.b_iter);
	};
	
	this.updateByByteString = function(x, s, offset, len) {
		if (x.s_iter === EMPTYITER) {
			x.s_iter = new ByteStringByteIterator();
		}
		x.s_iter.init(s, offset, len);
		__update(x, x.s_iter);
	};
	
	this.updateByNumberArray = function(x, data, offset, len, bits) {
		if (x.n_iter === EMPTYITER) {
			x.n_iter = new NumberArrayByteIterator();
		}
		x.n_iter.init(data, offset, len, bits);
		__update(x, x.n_iter);
	};
	
	this.finish = function(x) {
		var p = x.size & 1023;
		Packer.push(x.packer, 0x80); // end of message
		p += 8;
		if (__tryCompress(p, x)) {
			p = 0;
		}
		if (p >= 896) {
			// need to compress this block
			do {
				Packer.push(x.packer, 0x00);
				p += 8;
			} while (__tryCompress(p, x) === false);
			p = 0;
		}
		while (p < 896) {
			Packer.push(x.packer, 0x00);
			p += 8;
			__tryCompress(p, x);
		}
		// 128bits (message bits)
		x.w[14] = Int64.ZERO; // I think ... maybe, allmost, message bits < 2^64
		x.w[15] = Int64.parse(x.size.toString(16));
//		console.log('w[14] = ' + Int64.toHex(x.w[14]));
//		console.log('w[15] = ' + Int64.toHex(x.w[15]));
		
		// final compress
		__compress(x);
	};
	
	this.getHash = function(x, dest, offset) {
		// ByteArray
		var i;
		for (i = 0; i < 8; i++) {
			Int64.copyBytes(x.hash[i], dest, offset + i * 8);
		}
	};
	
	this.getHashToNumberArray = function(x, bits, dest, offset) {
		// bits: 16 or 32
		var i, b, j, p = offset, s = bits >> 2;
		for (i = 0; i < 8; i++) {
			b = Int64.toHex(x.hash[i]);
			for (j = 0; j < 16; j += s) {
				dest[p] = parseInt(b.substring(j, j + s), 16);
				p++;
			}
		}
	};
	
	this.toHexString = function(x) {
		var i, s = '';
		for (i = 0; i < 8; i++) {
			s += Int64.toHex(x.hash[i]);
		}
		return s;
	};
	
	this.toByteString = function(x) {
		var b = new Array(8);
		var i, j, s = '';
		for (i = 0; i < 8; i++) {
			Int64.copyBytes(x.hash[i], b, 0);
			for (j = 0; j < 8; j++) {
				s += String.fromCharCode(b[j]);
			}
		}
		return s;
	};
	
	// Tester
	// =============================================
	if (typeof IntClassTester !== 'undefined') {
		IntClassTester.bind({
			"IntClass": IntClass
		});
	}
	if (typeof ByteIteratorTester !== 'undefined') {
		ByteIteratorTester.bind({
			"EMPTYITER": EMPTYITER,
			"ByteArrayByteIterator": ByteArrayByteIterator,
			"ByteStringByteIterator": ByteStringByteIterator,
			"NumberArrayByteIterator": NumberArrayByteIterator
		});
	}
	if (typeof SHA512JSTester !== 'undefined') {
		SHA512JSTester.bind({
			"Int64": Int64,
			"_init_hash_value": _init_hash_value
		});
	}
}
