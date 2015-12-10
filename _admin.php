<?php
if (!defined('DC_CONTEXT_ADMIN')) {return;}

// Unused comment to translate the description in _define.php.
__('Adds a button to easily insert a PhotoSphere inside a post');

$core->addBehavior('adminPostHeaders',
	array('dotsphereBehaviors','postHeaders'));

class dotsphereBehaviors {
	public static function postHeaders() {
		global $core;
		return
		'<script type="text/javascript" src="index.php?pf=dotsphere/js/post.js"></script>'.
		'<script type="text/javascript">'."\n".
		"//<![CDATA[\n".
		dcPage::jsVar('jsToolBar.prototype.elements.dotsphere.title',__('Display as a PhotoSphere')).
		dcPage::jsVar('jsToolBar.prototype.elements.dotsphere.selectImageError',__('Select an image to display as a PhotoSphere.')).
		dcPage::jsVar('jsToolBar.prototype.elements.dotsphere.pluginUrl',
			html::stripHostURL($core->blog->getQmarkURL().'pf=dotsphere/')).
		"\n//]]>\n".
		"</script>\n";
	}
}
?>
