/* TesterUtilJS
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Leonardone @ NEETSDKASU
 */


function TesterUtilJS(__tester, __tester_name) {
	
	var _self = this;
	
	var _test_list = [];
	var _must_do_list = [];
	
	var _logging_flag = true;
	var _skip_flag = false;
	var _must_do_flag = false;
	
	var _flagName = function(x) {
		return 'flag_' + x;
	};
	
	var _funcName = function(x) {
		return 'test_' + x;
	};
	
	var _logfunc = (function() {
		if (console) { if (console.log) {
			return function (x) { console.log(x); };
		}}
		if (document) {
			return (function() {
				var id = 'debuglog-tester-' + __tester_name;
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
	
	var _log = function(x) {
		if (_logging_flag) {
			_logfunc(x);
		}
	};
	
	var _BAR = (function(){
		var bar10 = '-----' + '-----';
		var bar20 = bar10 + bar10
		return ' ' + bar20 + bar20 + bar20 + bar20;
	})();
	
	var _withBar = function(x) {
		if (x.length < 80) {
			return (x + _BAR).substring(0, 80);
		} else {
			return x;
		}
	};
	
	var _testMustDo = function() {
		if (_must_do_flag) {
			return;
		}
		if (_must_do_list.length === 0) {
			_must_do_flag = true;
			return;
		}
		_must_do_flag = true;
		var i, func, bk = _logging_flag;
		if (_skip_flag) {
			_setLogging(false);
		}
		_log(_withBar('MUST DO TESTS'));
		for (i in _must_do_list) {
			func = __tester[_funcName(_must_do_list[i])];
			if (func(false) === false) {
				_must_do_flag = false;
				_setLogging(true);
				_log('ERROR REQUIRED TEST ' + _must_do_list[i]);
				func(true);
				_setLogging(bk);
				throw 'failure reuired test! "' + _must_do_list[i] + '"';
			}
		}
		_log(_withBar('MUST DO TESTS OK'));
		_setLogging(bk);
	};
	
	var _require = function(a) {
		if (a.length === 0) {
			return;
		}
		_testMustDo();
		if (_skip_flag) {
			return;
		}
		var i, flag, func, bk = _logging_flag;
		for (i in a) {
			flag = _flagName(a[i]);
			if (_self[flag]) {
				continue;
			}
			_log('DEPENDENT TEST ' + a[i]);
			_setLogging(false);
			func = __tester[_funcName(a[i])];
			if (func(false) === false) {
				_setLogging(true);
				_log('ERROR DEPENDENT TEST ' + a[i]);
				func(true);
				_setLogging(bk);
				throw 'failure dependent test! "' + a[i] + '"';
			}
			_setLogging(bk);
		}
	};
	
	var _makeTest = function(test_name, test_must, test_req, test_func) {
		_test_list.push(test_name);
		if (test_must) {
			_must_do_list.push(test_name);
		}
		var flag_name = _flagName(test_name);
		_self[flag_name] = false;
		var func = function(s) {
			_require(test_req);
			var r, bk = _logging_flag;
			_setLogging(s !== false);
			_log(_withBar('TEST ' + test_name));
			r = test_func();
			_setLogging(bk);
			_log(_withBar('TEST ' + test_name + ' ' + (r ? 'OK' : 'NG')));
			_self[flag_name] = r;
			return r;
		};
		var func_name = _funcName(test_name);
		_self[func_name] = func;
		__tester[func_name] = func;
	};
	
	var _testAll = function(s, ls) {
		_testMustDo();
		_log(_withBar('TEST ALL'));
		var i, b = true, func;
		var tg = (ls === undefined || ls.length === 0) ? _test_list : ls;
		var ok = [], ng = [];
		for (i in tg) {
			func = __tester[_funcName(tg[i])];
			if (func(s === true)) {
				ok.push(tg[i]);
			} else {
				b = false;
				ng.push(tg[i]);
			}
		}
		_log(_withBar('TEST ALL ' + (b ? 'OK' : 'NG')));
		_log('OK TESTS:');
		_log(ok);
		if (b === false) {
			_log('NG TESTS:');
			_log(ng);
		}
		return ng.length === 0;
	};

	var _check = function(b) {
		if (b) {
			_log('OK');
			return 1;
		} else {
			_log('NG');
			return 0;
		}
	};
	
	var _checkA = function(a1, a2) {
		var i;
		for (i in a1) {
			if (a1[i] !== a2[i]) {
				_log('NG');
				_log('i = ' + i);
				_log(a1[i]);
				_log(a2[i]);
				return 0;
			}
		}
		_log('OK');
		return 1;
	};
	
	var _checkAfn = function(a1, a2, cmpf) {
		var i;
		for (i in a1) {
			if (cmpf(a1[i], a2[i]) === false) {
				_log('NG');
				_log('i = ' + i);
				_log(a1[i]);
				_log(a2[i]);
				return 0;
			}
		}
		_log('OK');
		return 1;
	};
	
	var _checkAP = function(a1, o1, a2, o2, len) {
		var i;
		for (i = 0; i < len; i++) {
			if (a1[i + o1] !== a2[i + o2]) {
				_log('NG');
				_log('i = ' + i);
				_log(a1[i + o1]);
				_log(a2[i + o2]);
				return 0;
			}
		}
		_log('OK');
		return 1;
	};
	
	var _checkAPfn = function(a1, o1, a2, o2, len, cmpf) {
		var i;
		for (i = 0; i < len; i++) {
			if (cmpf(a1[i + o1], a2[i + o2]) === false) {
				_log('NG');
				_log('i = ' + i);
				_log(a1[i + o1]);
				_log(a2[i + o2]);
				return 0;
			}
		}
		_log('OK');
		return 1;
	};
	
	var _checkKey = function(o, ks) {
		var i;
		for (i in ks) {
			if (o[ks[i]] !== undefined) {
				continue;
			}
			_log('NG');
			_log('not exist: ' + ks[i]);
			return 0;
		}
		_log('OK');
		return 1;
	}
	
	var _setLogging = function(f) {
		_logging_flag = f;
	};
	
	var _setSkip = function(f) {
		_skip_flag = f;
	};
	
	var _setLogFunc = function(f) {
		_logfunc = f;
	};
	
	var _flags = function(ls) {
		var i;
		for (i in ls) {
			if (_self[_flagName(ls[i])] === false) {
				return false;
			}
		}
		return true;
	};
	
	var _bindfunc = function(x) {
	};
	
	var _setBindFunc = function(f) {
		_bindfunc = f;
	};
	
	var _bind = function(x) {
		_log(_withBar('BIND ' + __tester_name));
		_log(x);
		_bindfunc(x);
	};
	
	this.flagName    = __tester['flagName']    = _flagName;
	this.funcName    = __tester['funcName']    = _funcName;
	this.log         = __tester['log']         = _log;
	this.withBar     = __tester['withBar']     = _withBar;
	this.require     = __tester['require']     = _require;
	this.testAll     = __tester['testAll']     = _testAll;
	this.makeTest    = __tester['makeTest']    = _makeTest;
	this.check       = __tester['check']       = _check;
	this.checkA      = __tester['checkA']      = _checkA;
	this.checkAfn    = __tester['checkAfn']    = _checkAfn;
	this.checkAP     = __tester['checkAP']     = _checkAP;
	this.checkAPfn   = __tester['checkAPfn']   = _checkAPfn;
	this.checkKey    = __tester['checkKey']    = _checkKey;
	this.setSkip     = __tester['setSkip']     = _setSkip;
	this.setLogging  = __tester['setLogging']  = _setLogging;
	this.setLogFunc  = __tester['setLogFunc']  = _setLogFunc;
	this.flags       = __tester['flags']       = _flags;
	this.setBindFunc = __tester['setBindFunc'] = _setBindFunc;
	this.bind        = __tester['bind']        = _bind;
	

};
