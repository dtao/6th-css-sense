(function() {

  // Scan selectors every 3 seconds.
  var SCAN_INTERVAL = 3000;

  setTimeout(function doPeriodicScan() {

    checkAllSelectors();
    updateUI();
    setTimeout(doPeriodicScan, SCAN_INTERVAL);

  }, SCAN_INTERVAL);

  var forEach = Array.prototype.forEach,
      reduce  = Array.prototype.reduce;

  var invalidSelectors = {},
      liveSelectors    = {},
      deadSelectors    = {};

  function getAllStylesheets() {
    return document.styleSheets;
  }

  function selectorIsInvalid(selector) {
    // If we've already determined a selector is invalid, there's no need to
    // check it again.
    if (invalidSelectors[selector]) {
      return true;
    }

    try {
      document.querySelector(selector);
      return false;

    } catch (e) {
      invalidSelectors[selector] = true;
      return true;
    }
  }

  function selectorIsDead(selector) {
    // If we've detected a selector at least once, ever, then it's not dead.
    if (liveSelectors[selector]) {
      return false;
    }

    return !document.querySelector(selector);
  }

  function checkAllSelectors() {
    forEach.call(getAllStylesheets(), function(stylesheet) {
      var rules = stylesheet.cssRules;

      forEach.call(rules, function checkRuleSelectors(rule) {
        if (rule.cssRules) {
          // e.g., for media queries
          forEach.call(rule.cssRules, checkRuleSelectors);
          return;
        }

        if (!rule.selectorText) {
          // e.g., for import rules
          return;
        }

        var selectors = rule.selectorText.split(/,\s*/);

        forEach.call(selectors, function(selector) {
          // Strip away pseudo selectors
          selector = selector.replace(/::(?:before|after)$/, '');

          if (selectorIsInvalid(selector)) {
            return;
          }

          if (selectorIsDead(selector)) {
            deadSelectors[selector] = true;

          } else {
            liveSelectors[selector] = true;
            delete deadSelectors[selector];
          }
        });
      });
    });
  }

  function initializeUI() {
    var wrapper = document.createElement('DIV');
    wrapper.id  = 'dead-selectors';

    var heading = document.createElement('H3');
    heading.textContent = 'Dead Selectors';
    wrapper.appendChild(heading);

    var paragraph = document.createElement('P');
    paragraph.className = 'count';
    paragraph.textContent = '0';
    wrapper.appendChild(paragraph);

    var list = document.createElement('UL');
    wrapper.appendChild(list);

    document.body.appendChild(wrapper);

    return list;
  }

  function updateUI() {
    var ui = document.querySelector('#dead-selectors > ul');
    if (!ui) {
      ui = initializeUI();
    }

    ui.innerHTML = '';

    var deadSelectorList = Object.keys(deadSelectors);

    forEach.call(deadSelectorList, function(deadSelector) {
      var item = document.createElement('LI');
      item.textContent = deadSelector;
      ui.appendChild(item);
    });

    ui.parentNode.querySelector('p').textContent = deadSelectorList.length;
  }

}());
