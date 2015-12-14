'use strict';
describe('dotsphere', function() {
  var toolBar;

  beforeEach(function() {
    toolBar = new jsToolBar();
    jsToolBar.prototype.elements.dotsphere.selectImageError =
        'Select Image Error';
    jsToolBar.prototype.elements.dotsphere.pluginUrl = 'path/to/plugin/';
  });

  it('should add a new button in the toolbar', function() {
    expect(toolBar.elements.dotsphere).toBeDefined();
    expect(toolBar.elements.dotsphere.context).toEqual('post');
    expect(toolBar.elements.dotsphere.type).toEqual('button');
  });

  describe('button', function() {
    var button;

    beforeEach(function() {
      button = toolBar.elements.dotsphere;
      spyOn(toolBar, 'encloseSelection');
    });

    it('should be clickable', function() {
      expect(button.fn).toBeDefined();
      expect(button.fn.wiki).toBeDefined();
      expect(button.fn.xhtml).toBeDefined();
    });

    var expectCallToDotsphere = function(html) {
      var p = document.createElement('p');
      p.innerHTML = html;
      expect(p.children.length).toEqual(3);

      // Starts with a container with the "dotsphere" class.
      expect(p.children[0].className).toEqual('dotsphere');

      // Loads external script.
      expect(p.children[1].tagName).toEqual('SCRIPT');
      expect(p.children[1].innerHTML).toBeFalsy();
      expect(p.children[1].getAttribute('src'))
          .toEqual('path/to/plugin/js/public.js');

      // Call dotsphere public function.
      expect(p.children[2].tagName).toEqual('SCRIPT');
      expect(p.children[2].getAttribute('src')).toBeFalsy();
      var jsScript = p.children[2].innerHTML;
      expect(jsScript).toBeTruthy();
      var dotsphere = jasmine.createSpy('dotsphere');
      eval(jsScript);
      expect(dotsphere.calls.count()).toEqual(1);
      expect(dotsphere.calls.mostRecent().args[1], 'path/to/plugin/js');
      return dotsphere.calls.mostRecent().args[0];
    };

    ['wiki', 'xhtml'].forEach(function(mode) {
      describe('click in ' + mode + ' mode', function() {

        it('should check the selection', function() {
          button.fn[mode].call(toolBar);
          expect(toolBar.encloseSelection.calls.count()).toEqual(1);
          var args = toolBar.encloseSelection.calls.mostRecent().args;
          expect(args[0]).toBeFalsy();
          expect(args[1]).toBeFalsy();
        });
      });
    });

    describe('click in Wiki mode', function() {
      var updateSelectionFunction;

      beforeEach(function() {
        button.fn.wiki.call(toolBar);
        updateSelectionFunction =
            toolBar.encloseSelection.calls.mostRecent().args[2];
        spyOn(window, 'alert');
      });

      var alertTests = {
        'empty': '',
        'not a wiki image': '/foo/bar.jpg',
        'more than a wiki image': 'a ((/foo/bar.jpg))',
      };
      for (let desc in alertTests) {
        it('should raises an alert if the selection is ' + desc, function() {
          var sel = alertTests[desc];
          expect(updateSelectionFunction(sel)).toEqual(sel);
          expect(window.alert).toHaveBeenCalledWith('Select Image Error');
        });
      }

      var successTests = {
        'an image': '((/foo/bar.jpg))',
        'an image with a title': '((/foo/bar.jpg|My nice title|C))',
        'an image with parentheses in the title':
            '((/foo/bar.jpg|My (nice) title|C))',
        'an image with blanks around': '\n((/foo/bar.jpg)) ',
      };
      for (let desc in successTests) {
        it('should replace the selection by a dotsphere call if it is ' + desc,
            function() {
              var newSelection = updateSelectionFunction(successTests[desc]);
              expect(window.alert).not.toHaveBeenCalled();
              expect(newSelection).toMatch('^\n///html\n.*\n///\n$');
              var html = newSelection.substr('\n///html\n'.length);
              html = html.substr(0, html.length - '\n///\n'.length);
              var dotsphereOptions = expectCallToDotsphere(html);
              expect(dotsphereOptions.panorama).toEqual('/foo/bar.jpg');
            });
      }
    });

    describe('click in XHTML mode', function() {
      var updateSelectionFunction;

      beforeEach(function() {
        button.fn.xhtml.call(toolBar);
        updateSelectionFunction =
            toolBar.encloseSelection.calls.mostRecent().args[2];
        spyOn(window, 'alert');
      });

      var alertTests = {
        'empty': '',
        'not an XHTML image': '/foo/bar.jpg',
        'a wiki image': '((/foo/bar.jpg))',
        'more than an XHTML image': 'a <img src="/foo/bar.jpg"/>',
      };
      for (let desc in alertTests) {
        it('should raises an alert if the selection is ' + desc, function() {
          var sel = alertTests[desc];
          expect(updateSelectionFunction(sel)).toEqual(sel);
          expect(window.alert).toHaveBeenCalledWith('Select Image Error');
        });
      }

      var successTests = {
        'an image': '<img src="/foo/bar.jpg"/>',
        'an image with a title':
            '<img src="/foo/bar.jpg" title="My nice title"/>',
        'an image with capital tag name': '<IMG SRC="/foo/bar.jpg"/>',
        'an image using single quotes': "<img src='/foo/bar.jpg'/>",
        'an image with blanks around': '\n<img src="/foo/bar.jpg"/>',
      };
      for (let desc in successTests) {
        it('should replace the selection by a dotsphere call if it is ' + desc,
            function() {
              var newSelection = updateSelectionFunction(successTests[desc]);
              expect(window.alert).not.toHaveBeenCalled();
              var dotsphereOptions = expectCallToDotsphere(newSelection);
              expect(dotsphereOptions.panorama).toEqual('/foo/bar.jpg');
            });
      }
    });
  });
});
