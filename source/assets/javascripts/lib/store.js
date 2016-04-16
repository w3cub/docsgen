var Store = (function() {
    function Store() {}
    Store.prototype.get = function(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (_error) {

        }
    };
    Store.prototype.set = function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (_error) {

        }
    };
    Store.prototype.del = function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (_error) {

        }
    };
    Store.prototype.clear = function() {
        try {
            localStorage.clear();
            return true;
        } catch (_error) {

        }
    };
    return new Store;
})();