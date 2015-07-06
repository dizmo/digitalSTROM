<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:import href="common.xsl"></xsl:import>

	<xsl:template name="stylesheets">
		<xsl:for-each select="files/stylesheets/*">
			<link rel="stylesheet" type="text/css" href="[% c.uri_for('static/{@href}') %]" />
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="scripts">
		<xsl:for-each select="files/scripts/*">
			<script type="text/javascript" src="[% c.uri_for('static/{@src}') %]"></script>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="loading">
		<div class="flab-loading-animation">
			<img id="loading-anim" src="[% c.uri_for('static/css/img/progress-anim-50x50.gif') %]" alt="Loading animation" />
		</div>
	</xsl:template>
</xsl:stylesheet>
