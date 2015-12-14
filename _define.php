<?php
if (!defined('DC_RC_PATH')) {return;}

$this->registerModule(
	/* Name */ 'dotsphere',
	/* Description */ 'Adds a button to easily insert a PhotoSphere inside a post',
	/* Author */ 'Pascal Corpet',
	/* Version */ 'dev',
	array(
		'type' => 'plugin',
		'permissions' => 'usage,contentadmin'
	)
);

?>
