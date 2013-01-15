/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  module('jQuery#gdda', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', 1, function() {
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.gdda(), this.elems, 'should be chaninable');
  });

  test('is gdda', 1, function() {
   // debugger;
    strictEqual(this.elems.gdda({debug:false}).text(), 'gddagddagdda', 'should be thoroughly gdda');
  });

  module('jQuery.gdda');

  test('is gdda', 1, function() {
    strictEqual($.gdda(), 'gdda', 'should be thoroughly gdda');
  });

  module(':gdda selector', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is gdda', 1, function() {
    // Use deepEqual & .get() when comparing jQuery objects.
    deepEqual($('span:gdda').text(),'awesome test markup', 'knows gdda when it sees it');
  });

 module('jQuery#gdda#core', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });
  test('gdda extends', 1, function() {
    expect(4);
    ok( !! $.gdda.core,'gdda.core is exist!' );
    ok( ! $.gdda.core.test,'before extend gdda.core.test is not exist!' );
    $.extend($.gdda.core,{'test':function(){return 'gdda.core.test!';}});
    ok( !! $.gdda.core.test,'before extend gdda.core.test is exist!' );
    equal($.gdda.core.test(),'gdda.core.test!','gdda.core.test result is OK!');
  });
}(jQuery));
