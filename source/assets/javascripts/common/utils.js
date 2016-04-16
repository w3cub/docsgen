var Utils = (function() {
    var idCounter = 0;
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }
            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function() {},
                fBound = function() {
                    return fToBind.apply(this instanceof fNOP && oThis ? this : oThis || window,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();
            return fBound;
        };
    }
    var nativeBind = Function.prototype.bind;
    var toString = Object.prototype.toString;
    var property = function(key) {
        return function(obj) {
            return obj == null ? void 0 : obj[key];
        };
    };
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    var createAssigner = function(keysFunc, undefinedOnly) {
        return function(obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };


    var Utils = {
        each: function(obj, iteratee, context) {
            var func = iteratee;
            iteratee = function() {
                return func.apply(context, arguments);
            };
            var i, length;
            if (isArrayLike(obj)) {
                for (i = 0, length = obj.length; i < length; i++) {
                    iteratee(obj[i], i, obj);
                }
            } else {
                var keys = Utils.keys(obj);
                for (i = 0, length = keys.length; i < length; i++) {
                    iteratee(obj[keys[i]], keys[i], obj);
                }
            }
            return obj;
        },
        extend: createAssigner(function(obj) {
            if (!Utils.isObject(obj)) return [];
            var keys = [];
            for (var key in obj) keys.push(key);
            return keys;
        }),
        keys: function(obj) {
            var keys = [];
            for (var key in obj)
                if (obj.hasOwnProperty(key)) keys.push(key);
            return keys;
        },
        bind: function(func, context) {
            if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        },
        uniqueId: function(prefix) {
            var id = ++idCounter + '';
            return prefix ? prefix + id : id;
        },
        inherits: function(ctor, superCtor) {
            ctor.super_ = superCtor
            var TempCtor = function() {}
            TempCtor.prototype = superCtor.prototype
            ctor.prototype = new TempCtor()
            ctor.prototype.constructor = ctor
        },
        filter: function(data, callback, context) {
            var results = [];
            for (var i = 0; i < data.length; i++) {
                if (callback.call(context || null, data[i])) {
                    results.push(data[i]);
                }
            };
            return results
        },
        findWhere: function(data, obj) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var u = 0,
                    v = 0;
                for (var j in obj) {
                    u++;
                    if (item[j] != undefined && item[j] == obj[j]) {
                        v++;
                    }
                }
                if (u == v) {
                    return item;
                }
            };
        }
    };

    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    Utils.isArray = Array.isArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    };

    // Is a given variable an object?
    Utils.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
    Utils.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
        Utils['is' + name] = function(obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    Utils.isEmpty = function(obj) {
        if (obj == null) return true;
        if (isArrayLike(obj) && (Utils.isArray(obj) || Utils.isString(obj) || Utils.isArguments(obj))) return obj.length === 0;
        return Utils.keys(obj).length === 0;
    };

    Utils.size = function(obj) {
        if (obj == null) return 0;
        return isArrayLike(obj) ? obj.length : Utils.keys(obj).length;
    };
    Utils.once = function(fn, context) {
        var result;
        return function() {
            if (fn) {
                result = fn.apply(context || this, arguments);
                fn = null;
            }
            return result;
        };
    };
    var escapeMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "/": "&#x2F;"
        },
        escapeReg = /[&<>"'\/]/g;
    Utils.escape = function(str) {
        return str.replace(escapeReg, function(e) {
            return escapeMap[e];
        });
    };
    return Utils;
})();

var _ = {};


_.now = Date.now || function() {
    return new Date().getTime();
};

_.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
        previous = options.leading === false ? 0 : _.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function() {
        var now = _.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};
