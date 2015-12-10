jsToolBar.prototype.elements.dotsphere = {
	type: 'button',
	context: 'post',
	icon: 'index.php?pf=dotsphere/icon.png',
	fn: {},
};

jsToolBar.prototype.elements.dotsphere.fn.wiki = function() {
  var me = this;
  this.encloseSelection('', '', function(sel) {
    return me.elements.dotsphere.selFn(sel, true);
  });
};
jsToolBar.prototype.elements.dotsphere.fn.xhtml = function() {
  var me = this;
  this.encloseSelection('', '', function(sel) {
    return me.elements.dotsphere.selFn(sel, false);
  });
};

jsToolBar.prototype.elements.dotsphere.selFn = function(sel, wiki) {
  var src;
  if (wiki) {
    var matchImage = sel.match(/^\s*\(\(([^()|]+)(\|[^()]*)\)\)\s*$/);
    if (!matchImage) {
      alert(this.selectImageError);
      return sel;
    }
    src = matchImage[1];
  } else {
    var matchImage = sel.match(/^\s*<img (?:[^>]* )?src=["']([^"'>]+)["'](?: [^>]*)?>\s*/);
    if (!matchImage) {
      alert(this.selectImageError);
      return sel;
    }
    src = matchImage[1];
  }

  var html = '<div class="dotsphere"></div>' +
    '<script src="' + this.pluginUrl + 'js/photo-sphere-viewer.min.js"></script>' +
    '<script>dotsphere({panorama: ' + JSON.stringify(src) + '})</script>';

  if (wiki) {
    return '\n///html\n' + html + '\n///\n';
  }
  return html;
};
