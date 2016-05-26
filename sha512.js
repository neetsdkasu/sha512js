/* SHA512 for JavaScript
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Leonardone @ NEETSDKASU
 */

function SHA512JS() {
	
	function IntClass(sz) {
		//  sz: byte size (i.e. sz = 8 -> 64bit Int)
		var BITLEN = 16;
		var MASK = 0xFFFF;
		
		var BYTESIZE = sz;
		var INTBITS = BYTESIZE << 3;
		var SHIFTMASK = INTBITS - 1;
		var LEN = INTBITS >> 4;
		var SIZE = LEN + 1;
		var ROTMASK = LEN - 1;
		
		this.valueOf = function(n) {
			// n: Number(Integer)
			var i, v = new Array(SIZE);
			for (i = 0; i < SIZE; i++) {
				v[i] = n & MASK;
				n >>= BITLEN;
			}
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
			s &= MASK;
			m = (1 << s) - 1; // mask
			p = BITLEN - s;   // shiftL
			for (i = 0; i < LEN; i++) {
				v[i] >>= s;
				v[i] |= (v[i + 1] & m) << p;
			}
			return v;
		};
		
		this.rotateR = function(v1, r) {
			var i, v = new Array(SIZE), k, m, p;
			k = (r & SHIFTMASK) >> 4; // div BITLEN(16)
			for (i = 0; i < LEN; i++) {
				v[i] = v1[(i + k) & ROTMASK];
			}
			r &= MASK;
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
	};
	
	var Int64 = new IntClass(8);
	
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
		x.a = hash[0];
		x.b = hash[1];
		x.c = hash[2];
		x.d = hash[3];
		x.e = hash[4];
		x.f = hash[5];
		x.g = hash[6];
		x.h = hash[7];
		x.size = 0;
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
			Int64.shiftR(x, 28),
			Int64.shiftR(x, 34),
			Int64.shiftR(x, 39)
		);
	};
	
	var __ucSigma1 = function(x) {
		return Int64.bwXor3(
			Int64.shiftR(x, 14),
			Int64.shiftR(x, 18),
			Int64.shiftR(x, 41)
		);
	};
	
	var __lcSigma0 = function(x) {
		return Int64.bwXor3(
			Int64.shiftR(x, 1),
			Int64.shiftR(x, 8),
			Int64.rotateR(x, 7)
		);
	};
	
	var __lcSigma1 = function(x) {
		return Int64.bwXor3(
			Int64.shiftR(x, 19),
			Int64.shiftR(x, 61),
			Int64.rotateR(x, 6)
		);
	};
	
	this.create = function() {
		var x = {
			"hash": new Array(8),
			"w": new Array(80)
		};
		__init_hash(x);
		return x;
	};
	
	this.init = __init_hash;
	
	var __calcWj = function(x) {
		var j, w = x.w;
		for (j = 16; j < 80; j++) {
			w[j] = Int64.add4(__lcSigma1(w[j - 2]), w[j - 7], __lcSigma0(w[j - 15]), w[j - 16]);
		}
		return w;
	};
	
	var __compress = function(x) {
		var w = __calcWj(x);
		var a = x.a;
		var b = x.b;
		var c = x.c;
		var d = x.d;
		var e = x.e;
		var f = x.f;
		var g = x.g;
		var h = x.h;
		var j, t1, t2;
		for (j = 0; j < 80; j++) {
			t1 = Int64.add5(h, __ucSigma1(e), __Ch(e, f, g), _K[j], w[j]);
			t2 = Int64.add(__ucSigma0(a), __Maj(a, b, b));
			h = g;
			g = f;
			f = e;
			e = Int64.add(d, t1);
			d = c;
			c = b;
			b = a;
			a = Int64.add(t1, t2);
		}
		x.a = a;
		x.b = b;
		x.c = c;
		x.d = d;
		x.e = e;
		x.f = f;
		x.g = g;
		x.h = h;
		x.hash[0] = Int64.add(x.hash[0], a);
		x.hash[1] = Int64.add(x.hash[1], b);
		x.hash[2] = Int64.add(x.hash[2], c);
		x.hash[3] = Int64.add(x.hash[3], d);
		x.hash[4] = Int64.add(x.hash[4], e);
		x.hash[5] = Int64.add(x.hash[5], f);
		x.hash[6] = Int64.add(x.hash[6], g);
		x.hash[7] = Int64.add(x.hash[7], h);
	};
	
	var __update = function(x, data, offset, size) {
		
	};
	
	this.update = __update;
	
	this.finish = function() {
	};
	
	this.getHash = function(x, dest, offset) {
		// ByteArray
		var i;
		for (i = 0; i < 8; i++) {
			Int64.copyBytes(x.hash[i], dest, offset + i * 8);
		}
	};
}
