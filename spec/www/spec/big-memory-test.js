/* 'use strict'; */

// increased timeout for these tests:
var MYTIMEOUT = 360000;

var DEFAULT_SIZE = 5000000; // max to avoid popup in safari/ios

// FUTURE TBD replace in test(s):
function ok(test, desc) { expect(test).toBe(true); }
function equal(a, b, desc) { expect(a).toEqual(b); } // '=='
function strictEqual(a, b, desc) { expect(a).toBe(b); } // '==='

var isAndroid = /Android/.test(navigator.userAgent);
var isWP8 = /IEMobile/.test(navigator.userAgent); // Matches WP(7/8/8.1)
var isWindows = /Windows /.test(navigator.userAgent); // Windows (8.1)

var scenarioList = [ 'Plugin', 'HTML5' ];

var scenarioCount = 1;
// FUTURE:
//var scenarioCount = (!!window.hasWebKitBrowser) ? 2 : 1;

// big memory test(s):
var mytests = function() {

  for (var i=0; i<scenarioCount; ++i) {

    describe(scenarioList[i] + ': big memory test(s)', function() {
      var scenarioName = scenarioList[i];
      var suiteName = scenarioName + ': ';
      var isWebSql = (i !== 0);

      // NOTE: MUST be defined in function scope, NOT outer scope:
      var openDatabase = function(name, ignored1, ignored2, ignored3) {
        if (isWebSql) {
          return window.openDatabase(name, '1.0', 'Test', DEFAULT_SIZE);
        } else {
          // explicit database location:
          return window.sqlitePlugin.openDatabase({name: name, location: 'default'});
        }
      }


        // litehelpers/Cordova-sqlite-storage#18 - thanks to @sonalk:
        it(suiteName + 'adding a large number of records', function(done) {

          var db = openDatabase("add-large-number-of-records.db", "1.0", "Demo", DEFAULT_SIZE);

          expect(db).toBeDefined()

          db.transaction(function(tx) {

            expect(tx).toBeDefined()

            tx.executeSql('DROP TABLE IF EXISTS test_table');
            tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');
            tx.executeSql('DROP TABLE IF EXISTS db');
            tx.executeSql('CREATE TABLE IF NOT EXISTS db (idd integer primary key, dataa text, data_numm integer)');
            tx.executeSql('DROP TABLE IF EXISTS abc');
            tx.executeSql('CREATE TABLE IF NOT EXISTS abc (iddd integer primary key, dataaa text, data_nummm integer)');
            tx.executeSql('DROP TABLE IF EXISTS abcd');

            for (var k = 0; k < 80000; k++) { //loop to add 80000 records
              tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100]);
              tx.executeSql("INSERT INTO db (dataa, data_numm) VALUES (?,?)", ["abc", 100]);

              tx.executeSql("INSERT INTO abc (dataaa, data_nummm) VALUES (?,?)", ["abc", 100]);
            } ////-for loop ends

          //db.transaction ends
          }, function (e) {
            // not expected:
            expect(false).toBe(true);
          }, function () {
            // expected ok:
            expect(true).toBe(true);
            done();
          });

        }, MYTIMEOUT);

    });
  };
}

if (window.hasBrowser) mytests();
else exports.defineAutoTests = mytests;

/* vim: set expandtab : */
