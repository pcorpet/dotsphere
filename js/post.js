var dotsphere = dotsphere || {};



/**
 * A button in the tool bar to replace a selected image by some code to display
 * a Photo Sphere Viewer for that image.
 * @extends {jsToolBar.Button}
 * @private
 * @constructor
 */
dotsphere.Button_ = function() {
  this.type = 'button';
  this.context = 'post';
  this.icon = 'index.php?pf=dotsphere/icon.png';
  this.fn = new dotsphere.ButtonClick_(this);
};



/**
 * A functor to handle a click on the dotsphere button.
 * @extends {jsToolBar.ButtonFunction}
 * @param {!dotsphere.Button_} button the button that is clicked.
 * @private
 * @constructor
 */
dotsphere.ButtonClick_ = function(button) {
  this.wiki = function() {
    this.encloseSelection('', '', function(sel) {
      return button.replaceSelectionByPhotoSphere(sel, true);
    });
  };
  this.xhtml = function() {
    this.encloseSelection('', '', function(sel) {
      return button.replaceSelectionByPhotoSphere(sel, false);
    });
  };
};


/**
 * Replaces characters that could harm XML by equivalent entities.
 * @param {string} s The initial string.
 * @return {string} The string with the XML special chars replaced.
 * @private
 */
dotsphere.Button_.replaceXmlEntities_ = function(s) {
  return s.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
};


/**
 * Regular expression to match an image in Wiki syntax. The first matching
 * group is the image's source.
 * @const @private {!RegExp}
 */
dotsphere.Button_.MATCH_WIKI_IMAGE_RE_ =
    /^\s*\(\(([^()|]+)(\|[^()]*)\)\)\s*$/;


/**
 * Regular expresion to match an image in XHTML syntax. The first matching
 * group is the image's source.
 * @const @private {!RegExp}
 */
dotsphere.Button_.MATCH_XHTML_IMAGE_RE_ =
    /^\s*<img (?:[^>]* )?src=["']([^"'>]+)["'](?: [^>]*)?>\s*$/;


/**
 * Extracts image source from text or issue a warning.
 * @param {string} sel The selected text from which to find an image.
 * @param {!RegExp} regexp The regular expression to extract the source.
 * @return {?string} The image's source or null if it wasn't an image.
 * @private
 */
dotsphere.Button_.prototype.extractImageSource_ = function(sel, regexp) {
  var matchImage = sel.match(regexp);
  if (!matchImage) {
    alert(this.selectImageError);
    return null;
  }
  return matchImage[1];
};


/**
 * Replaces the selection, if it's an image, by a Photo Sphere Viewer for that
 * image.
 * @param {string} sel The current selection.
 * @param {boolean} wiki Whether this is using wiki syntax or XHTML.
 * @return {string} The text to replace the current selection.
 */
dotsphere.Button_.prototype.replaceSelectionByPhotoSphere = function(
    sel, wiki) {
  /** @type {?string} */
  var src;
  if (wiki) {
    src = this.extractImageSource_(
        sel, dotsphere.Button_.MATCH_WIKI_IMAGE_RE_);
  } else {
    src = this.extractImageSource_(
        sel, dotsphere.Button_.MATCH_XHTML_IMAGE_RE_);
  }
  if (!src) {
    return sel;
  }

  var html = '<div class="dotsphere"></div>' +
      '<script src="' +
      dotsphere.Button_.replaceXmlEntities_(
          this.pluginUrl + 'js/photo-sphere-viewer.min.js') +
      '"></script>' +
      '<script>dotsphere({panorama: ' + JSON.stringify(src) + '})</script>';

  if (wiki) {
    return '\n///html\n' + html + '\n///\n';
  }
  return html;
};


// Add the new button to the elements of the toolbar.
jsToolBar.prototype.elements['dotsphere'] = new dotsphere.Button_();
